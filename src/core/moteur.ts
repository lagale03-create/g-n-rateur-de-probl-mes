/**
 * Moteur de génération d'un problème.
 * On tire un « monde » cohérent, on choisit ce qu'on cache, on rédige, on vérifie.
 * En cas d'échec, on recommence le tirage (au plus MAX_ESSAIS fois).
 */
import { Q } from "./rational";
import { rngFor, Rng } from "./rng";
import { propager, resoudre } from "./solveur";
import { implicites, verifier } from "./verificateur";
import { habillage } from "./habillage";
import type {
  Contexte, ContexteSchema, Etape, Gabarit, Grandeur, Inconnue, Jour, Monde, Mot, Niveau,
  Probleme, Schema, Structure, Visuel,
} from "./types";
import { choisir, formatVar, rendre, variablesCitees, type EnvRendu } from "../langue/rendu";
import { formatAnnee, formatDuree, formatHeure, formatMesure, formatNombre } from "../langue/format";
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

const UNITES_LONGUES: Record<string, string> = {
  g: "grammes", kg: "kilogrammes", t: "tonnes", cL: "centilitres", L: "litres", mL: "millilitres",
  m: "mètres", cm: "centimètres", km: "kilomètres", min: "minutes",
};

function choisirMots(cs: ContexteSchema, rng: Rng): Record<string, Mot> {
  const mots: Record<string, Mot> = {};
  // unités du contexte en toutes lettres : [uniteP] (petite), [uniteG] (grande)
  if (cs.unites?.quantite) mots.uniteP = { s: UNITES_LONGUES[cs.unites.quantite] ?? cs.unites.quantite };
  if (cs.unites?.grande) mots.uniteG = { s: UNITES_LONGUES[cs.unites.grande] ?? cs.unites.grande };
  for (const [k, v] of Object.entries(cs.mots)) {
    mots[k] = typeof v === "string" ? { s: v } : Array.isArray(v) ? rng.pick(v) : v;
  }
  // trois prénoms différents (les problèmes de comparaison mettent en scène plusieurs enfants)
  const [p1, p2, p3] = rng.shuffle(PRENOMS);
  mots.prenom = { s: p1.s, g: p1.g };
  mots.prenom2 = { s: p2.s, g: p2.g };
  mots.prenom3 = { s: p3.s, g: p3.g };
  return mots;
}

/** Tire toutes les variables d'une structure, en respectant les plages du contexte. */
export function tirerMonde(struct: Structure, cs: ContexteSchema, niveau: Niveau, rng: Rng): Monde {
  const w: Monde = {};
  for (const f of implicites(struct)) {
    const val = struct.variables[f].valeur ?? cs.unites?.facteur;
    if (!val) throw new Error("facteur de conversion manquant dans le contexte");
    w[f] = Q.of(val);
  }
  for (const t of struct.tirage) {
    if (t.f) w[t.v] = t.f(w, { rng, ctx: cs });
    else {
      const p = cs.plages?.[niveau]?.[t.cle ?? t.v] ?? t.plage;
      if (!p) throw new Error(`Aucune plage pour ${t.v}`);
      w[t.v] = rng.step(p.min, p.max, p.pas ?? 1);
    }
    propager(struct.relations, w);
  }
  return w;
}

function nombreSeul(x: Q, g: Grandeur): string {
  if (g === "duree") return formatDuree(x.toNumber());
  if (g === "heure") return formatHeure(x.toNumber());
  return g === "euro" ? formatNombre(x, x.isInteger ? 0 : 2) : formatNombre(x);
}

export function genererProbleme(dm: Demande): Probleme {
  const { schema, contexte, niveau, jour } = dm;
  const cs = habillage(schema, contexte);
  if (!cs) throw new Error(`Le contexte ${contexte.id} ne sait pas habiller le schéma ${schema.id}`);
  const struct = schema.structure(niveau, cs);
  const textes = fusion(schema.textes, cs.textes);
  const mots = choisirMots(cs, rngFor(dm.graineLex ?? dm.graine, "lex", contexte.id));
  const grandeurs = Object.fromEntries(Object.entries(struct.variables).map(([k, d]) => [k, d.grandeur]));
  const unites = { quantite: cs.unites?.quantite, grande: cs.unites?.grande };

  let candidats: Inconnue[];
  if (dm.inconnue) {
    // inconnue imposée (Jour 2 choisi, ou mode « problème isolé »)
    candidats = [struct.j1, ...struct.j2].filter((i) => i.inconnue === dm.inconnue);
    if (candidats.length === 0) throw new Error(`Inconnue impossible pour ce schéma : ${dm.inconnue}`);
  } else if (jour === 2) {
    candidats = rngFor(dm.graine, dm.chemin, "inconnue").shuffle(struct.j2);
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
    let res: ReturnType<typeof construire>;
    try {
      res = construire(dm, struct, textes, mots, grandeurs, unites, monde, inc, rng, essai);
    } catch (e) {
      derniereErreur = [String(e)];
      continue;
    }
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
  // les variables « visibles » peuvent être citées comme des données
  const donnees = new Set([...inc.donnees, ...Object.keys(struct.variables).filter((k) => struct.variables[k].visible)]);
  const erreurs: string[] = [];

  // nombres écrits en lettres (★★★) : 1 ou 2 effectifs entiers
  const lettres = new Set<string>();
  if (niveau === 3) {
    const cand = inc.donnees.filter((d) => grandeurs[d] === "compte" && monde[d].isInteger && monde[d].cmp(2) >= 0 && monde[d].cmp(999_999) <= 0);
    for (const d of rng.shuffle(cand).slice(0, rng.int(1, 2))) lettres.add(d);
  }
  const env: EnvRendu = { valeurs: monde, grandeurs, unites, mots, lettres, defs: struct.variables };

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

  // tableau ou graphique : valeurs des données, « ? » pour l'inconnue, leurres tirés au hasard
  let visuel: Visuel | undefined;
  if (dm.schema.visuel) {
    const spec = dm.schema.visuel(niveau);
    const envSans: EnvRendu = { ...env, lettres: new Set() };
    visuel = {
      type: spec.type, titre: rendre(spec.titre, envSans), unite: spec.unite ? rendre(spec.unite, envSans) : undefined,
      colonnes: spec.colonnes.map((c) => rendre(c, envSans)),
      lignes: spec.lignes.map((l) => ({
        label: rendre(l.label, envSans),
        valeurs: l.cases.map((c) => {
          if (typeof c === "string") {
            if (donnees.has(c)) { citees.add(c); return { texte: formatVar(c, envSans, false), nombre: monde[c].toNumber() }; }
            return { texte: "?", nombre: null };
          }
          if ("texte" in c) return { texte: rendre(c.texte, envSans), nombre: null };
          const x = rng.step(c.leurre.min, c.leurre.max, c.leurre.pas ?? 1);
          valeursPar.push(x);
          return { texte: formatNombre(x), nombre: x.toNumber() };
        }),
      })),
    };
  }

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
  // les libellés du corrigé ne citent que ce qui est déjà connu à cette étape
  const connusEtape = new Set(inc.donnees);
  const etapes: Etape[] = [];
  const guidees: string[] = [];
  const guideesManquantes: string[] = [];
  const envCorrige: EnvRendu = { ...env, lettres: new Set() };
  // lecture du tableau ou du graphique : on relève d'abord les données utiles
  if (visuel) {
    const lus: string[] = [];
    visuel.lignes.forEach((l, li) => l.valeurs.forEach((v, ci) => {
      const c = dm.schema.visuel!(niveau).lignes[li].cases[ci];
      if (typeof c === "string" && inc.donnees.includes(c)) lus.push(`${[l.label, visuel!.colonnes[ci]].filter(Boolean).join(", ")} : ${v.texte}`);
    }));
    const situation = visuel.type === "tableau" ? "Lecture de tableau" : "Lecture de graphique";
    etapes.push({ situation, calcul: lus.join(" ; "), libelle: "données utiles", cible: "", texte: `${situation} : ${lus.join(" ; ")}` });
  }
  for (const e of sol?.etapes ?? []) {
    const fv = (n: string) => formatVar(n, envCorrige, false);
    const fn = (n: string) => (grandeurs[n] === "fraction" ? formatVar(n, envCorrige, false) : nombreSeul(monde[n], grandeurs[n]));
    let calcul: string;
    if (e.op === "conv") calcul = `${fv(e.g)} = ${fv(e.cible)}`;
    else if (grandeurs[e.cible] === "proba") calcul = `${fn(e.g)} cas favorables sur ${fn(e.d)} cas possibles : ${fv(e.cible)}`;
    else if (e.op === "×" && (grandeurs[e.g] === "fraction" || grandeurs[e.d] === "fraction")) {
      // « 3⁄4 de 28 = 21 »
      const [f, x] = grandeurs[e.g] === "fraction" ? [e.g, e.d] : [e.d, e.g];
      calcul = `${fv(f)} de ${fn(x)} = ${fv(e.cible)}`;
    }
    else if (e.op === "ceil" || e.op === "quot") {
      // division euclidienne, puis interprétation du reste
      const a = monde[e.g], b = monde[e.d];
      const qt = a.div(b).floor(), r = a.sub(qt.mul(b));
      const base = `${fn(e.g)} ÷ ${fn(e.d)} = ${formatNombre(qt)}`;
      if (r.n === 0) calcul = `${fn(e.g)} ÷ ${fn(e.d)} = ${fv(e.cible)}`;
      else calcul = e.op === "ceil"
        ? `${base} reste ${formatNombre(r)}, donc ${formatNombre(qt)} + 1 = ${fv(e.cible)}`
        : `${base} reste ${formatNombre(r)}`;
    } else calcul = `${fn(e.g)} ${e.op} ${fn(e.d)} = ${fv(e.cible)}`;
    connusEtape.add(e.cible);
    const vl = choisir(textes.libelles[e.cible], connusEtape, niveau);
    const libelle = vl ? rendre(vl.t, envCorrige).replace(/\.$/, "") : e.cible;
    const lib = libelle.charAt(0).toLowerCase() + libelle.slice(1);
    etapes.push({ situation: e.situation, calcul, libelle: lib, cible: e.cible, texte: `${e.situation} : ${calcul} (${lib})` });
    // ★ : questions guidées les Jours 1 et 2 ; l'évaluation n'a que la question finale
    if (niveau === 1 && dm.jour !== "eval") {
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
    visuel,
    monde: Object.fromEntries(Object.entries(monde).map(([k, v]) => [k, v.toString()])),
    essais: essai + 1,
  };
  return { probleme, erreurs };
}

