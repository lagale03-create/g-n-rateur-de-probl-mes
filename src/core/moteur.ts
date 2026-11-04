/**
 * Moteur de génération d'un problème.
 * On tire un « monde » cohérent, on choisit ce qu'on cache, on rédige, on vérifie.
 * En cas d'échec, on recommence le tirage (au plus MAX_ESSAIS fois).
 */
import { Q } from "./rational";
import { rngFor, Rng } from "./rng";
import { propager, resoudre } from "./solveur";
import { implicites, verifier } from "./verificateur";
import type {
  Contexte, ContexteSchema, Etape, Gabarit, Grandeur, Inconnue, Jour, Monde, Mot, Niveau,
  Probleme, Schema, Structure,
} from "./types";
import { choisir, formatVar, rendre, variablesCitees, type EnvRendu } from "../langue/rendu";
import { formatAnnee, formatHeure, formatMesure, formatNombre } from "../langue/format";
import { PRENOMS } from "../data/prenoms";

export const MAX_ESSAIS = 300;

export interface Demande {
  schema: Schema;
  contexte: Contexte;
  niveau: Niveau;
  jour: Jour;
  graine: string;
  /** Chemin qui rend ce problème indépendant des autres (régénération isolée). */
  chemin: string;
  /** Graine des choix de vocabulaire : identique au Jour 1 et au Jour 2. */
  graineLex?: string;
  /** Pour le Jour 2 : inconnue imposée ; sinon tirée parmi celles du schéma. */
  inconnue?: string;
  /** Monde du Jour 1 : le Jour 2 doit en modifier au moins deux données. */
  differentDe?: Record<string, string>;
}

export class EchecGeneration extends Error {}

function fusion(base: Gabarit, sur?: Partial<Gabarit>): Gabarit {
  if (!sur) return base;
  return {
    phrases: sur.phrases ?? base.phrases,
    questions: { ...base.questions, ...sur.questions },
    guidees: { ...base.guidees, ...sur.guidees },
    libelles: { ...base.libelles, ...sur.libelles },
    reponses: { ...base.reponses, ...sur.reponses },
  };
}

function choisirMots(cs: ContexteSchema, rng: Rng): Record<string, Mot> {
  const mots: Record<string, Mot> = {};
  for (const [k, v] of Object.entries(cs.mots)) {
    mots[k] = typeof v === "string" ? { s: v } : Array.isArray(v) ? rng.pick(v) : v;
  }
  const p = rng.pick(PRENOMS);
  mots.prenom = { s: p.s, g: p.g };
  return mots;
}

/** Tire toutes les variables d'une structure, en respectant les plages du contexte. */
export function tirerMonde(struct: Structure, cs: ContexteSchema, niveau: Niveau, rng: Rng): Monde {
  const w: Monde = {};
  for (const f of implicites(struct)) {
    if (!cs.unites?.facteur) throw new Error("facteur de conversion manquant dans le contexte");
    w[f] = Q.of(cs.unites.facteur);
  }
  for (const t of struct.tirage) {
    if (t.f) w[t.v] = t.f(w, { rng, ctx: cs });
    else {
      const p = cs.plages?.[niveau]?.[t.v] ?? t.plage;
      if (!p) throw new Error(`Aucune plage pour ${t.v}`);
      w[t.v] = rng.step(p.min, p.max, p.pas ?? 1);
    }
    propager(struct.relations, w);
  }
  return w;
}

function nombreSeul(x: Q, g: Grandeur): string {
  return g === "euro" ? formatNombre(x, x.isInteger ? 0 : 2) : formatNombre(x);
}

export function genererProbleme(dm: Demande): Probleme {
  const { schema, contexte, niveau, jour } = dm;
  const cs = contexte.schemas[schema.id];
  if (!cs) throw new Error(`Le contexte ${contexte.id} ne sait pas habiller le schéma ${schema.id}`);
  const struct = schema.structure(niveau, cs);
  const textes = fusion(schema.textes, cs.textes);
  const mots = choisirMots(cs, rngFor(dm.graineLex ?? dm.graine, "lex", contexte.id));
  const grandeurs = Object.fromEntries(Object.entries(struct.variables).map(([k, d]) => [k, d.grandeur]));
  const unites = { quantite: cs.unites?.quantite, grande: cs.unites?.grande };

  let candidats: Inconnue[];
  if (jour === 2) {
    candidats = dm.inconnue
      ? struct.j2.filter((i) => i.inconnue === dm.inconnue)
      : rngFor(dm.graine, dm.chemin, "inconnue").shuffle(struct.j2);
    if (candidats.length === 0) throw new Error(`Inconnue inversée inconnue : ${dm.inconnue}`);
  } else candidats = [struct.j1];

  let derniereErreur: string[] = [];
  for (let essai = 0; essai < MAX_ESSAIS; essai++) {
    const rng = rngFor(dm.graine, dm.chemin, essai);
    // on garde la même inconnue pendant un bloc d'essais avant de passer à la suivante
    const inc = candidats[Math.floor(essai / 60) % candidats.length];
    let monde: Monde;
    try {
      monde = tirerMonde(struct, cs, niveau, rng);
    } catch (e) {
      derniereErreur = [String(e)];
      continue;
    }
    if (Object.keys(struct.variables).some((v) => !monde[v])) {
      derniereErreur = ["tirage incomplet"];
      continue;
    }
    if (dm.differentDe) {
      const ref = dm.differentDe;
      const communes = inc.donnees.filter((d) => ref[d] !== undefined);
      const changees = communes.filter((d) => !Q.from(ref[d]).eq(monde[d])).length;
      if (changees < Math.min(2, communes.length)) {
        derniereErreur = ["données trop proches du Jour 1"];
        continue;
      }
    }
    const res = construire(dm, struct, textes, mots, grandeurs, unites, monde, inc, rng, essai);
    if (res.erreurs.length === 0) return res.probleme;
    derniereErreur = res.erreurs;
  }
  throw new EchecGeneration(
    `Impossible de générer ${schema.id} / ${contexte.id} / niveau ${niveau} / jour ${jour} : ${derniereErreur.join(" ; ")}`,
  );
}

function construire(
  dm: Demande, struct: Structure, textes: Gabarit, mots: Record<string, Mot>,
  grandeurs: Record<string, Grandeur>, unites: EnvRendu["unites"], monde: Monde,
  inc: Inconnue, rng: Rng, essai: number,
): { probleme: Probleme; erreurs: string[] } {
  const { niveau } = dm;
  const donnees = new Set(inc.donnees);
  const erreurs: string[] = [];

  // nombres écrits en lettres (★★★) : 1 ou 2 effectifs entiers
  const lettres = new Set<string>();
  if (niveau === 3) {
    const cand = inc.donnees.filter((d) => grandeurs[d] === "compte" && monde[d].isInteger && monde[d].cmp(2) >= 0 && monde[d].cmp(999) <= 0);
    for (const d of rng.shuffle(cand).slice(0, rng.int(1, 2))) lettres.add(d);
  }
  const env: EnvRendu = { valeurs: monde, grandeurs, unites, mots, lettres };

  // énoncé
  const citees = new Set<string>();
  const phrases: string[] = [];
  for (const slot of textes.phrases) {
    const v = choisir(slot, donnees, niveau);
    if (!v) continue;
    variablesCitees(v.t).forEach((x) => citees.add(x));
    phrases.push(rendre(v.t, env));
  }

  // données parasites
  const nbPar = niveau === 1 ? 0 : niveau === 2 ? (rng.chance(1 / 3) ? 1 : 0) : rng.int(1, 2);
  const parasites: string[] = [];
  const valeursPar: Q[] = [];
  for (const p of rng.shuffle(dm.contexte.parasites).slice(0, nbPar)) {
    let t = p.t;
    for (const [k, def] of Object.entries(p.vals)) {
      const x = rng.step(def.min, def.max, def.pas ?? 1);
      valeursPar.push(x);
      const s = def.type === "annee" ? formatAnnee(x.toNumber())
        : def.type === "heure" ? formatHeure(x.toNumber())
        : formatMesure(x, def.unite ?? "");
      t = t.replaceAll(`{${k}}`, s);
    }
    parasites.push(rendre(t, env));
  }
  // les parasites s'intercalent après la première phrase
  for (const p of parasites) phrases.splice(rng.int(1, phrases.length), 0, p);

  // question finale
  const vq = choisir(textes.questions[inc.inconnue], donnees, niveau);
  if (!vq) erreurs.push(`question manquante pour ${inc.inconnue}`);
  const question = vq ? rendre(vq.t, env) : "";
  if (vq) variablesCitees(vq.t).forEach((x) => citees.add(x));

  // résolution (recalcul à partir des données)
  const connu: Monde = {};
  for (const d of [...inc.donnees, ...implicites(struct)]) connu[d] = monde[d];
  const sol = resoudre(struct.relations, connu, inc.inconnue);
  const tout = new Set(Object.keys(struct.variables));
  const etapes: Etape[] = [];
  const guidees: string[] = [];
  const guideesManquantes: string[] = [];
  const envCorrige: EnvRendu = { ...env, lettres: new Set() };
  for (const e of sol?.etapes ?? []) {
    const fv = (n: string) => formatVar(n, envCorrige, false);
    const fn = (n: string) => nombreSeul(monde[n], grandeurs[n]);
    const calcul = e.op === "conv" ? `${fv(e.g)} = ${fv(e.cible)}` : `${fn(e.g)} ${e.op} ${fn(e.d)} = ${fv(e.cible)}`;
    const vl = choisir(textes.libelles[e.cible], tout, niveau);
    const libelle = vl ? rendre(vl.t, envCorrige).replace(/\.$/, "") : e.cible;
    const lib = libelle.charAt(0).toLowerCase() + libelle.slice(1);
    etapes.push({ situation: e.situation, calcul, libelle: lib, cible: e.cible, texte: `${e.situation} : ${calcul} (${lib})` });
    if (niveau === 1) {
      if (e.cible === inc.inconnue) guidees.push(question);
      else {
        const vg = choisir(textes.guidees[e.cible], donnees, niveau);
        if (!vg) guideesManquantes.push(e.cible);
        else {
          variablesCitees(vg.t).forEach((x) => citees.add(x));
          guidees.push(rendre(vg.t, env));
        }
      }
    }
  }

  const vr = choisir(textes.reponses[inc.inconnue], tout, niveau);
  if (!vr) erreurs.push(`phrase réponse manquante pour ${inc.inconnue}`);

  erreurs.push(...verifier({ struct, monde, donnees: inc.donnees, inconnue: inc.inconnue, niveau, citees, parasites: valeursPar, guideesManquantes }));

  const situations = [...new Set(etapes.map((e) => e.situation))];
  const probleme: Probleme = {
    id: `${dm.chemin}`,
    graine: dm.graine,
    schemaId: dm.schema.id,
    contexteId: dm.contexte.id,
    titreContexte: dm.contexte.titre,
    niveau, jour: dm.jour,
    inconnue: inc.inconnue,
    donnees: inc.donnees,
    enonce: phrases.join(" "),
    question,
    guidees,
    parasites,
    etapes,
    resultat: formatVar(inc.inconnue, envCorrige, false),
    reponse: vr ? rendre(vr.t, envCorrige) : "",
    situations,
    monde: Object.fromEntries(Object.entries(monde).map(([k, v]) => [k, v.toString()])),
    essais: essai + 1,
  };
  return { probleme, erreurs };
}

