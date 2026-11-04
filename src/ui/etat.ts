/**
 * État de la séance de préparation (indépendant de React, donc testable).
 * Toutes les actions renvoient une nouvelle session ; elles peuvent lever une erreur
 * (contextes insuffisants, génération impossible) que l'interface affiche.
 */
import {
  contexteEvaluation, genererEvalUn, genererJ1Un, genererJ2Un, repartirContextes, type OptionsSemaine,
} from "../core/semaine";
import type { Niveau, Probleme } from "../core/types";
import { CONTEXTES, contexteParId } from "../data/contextes";
import { PROGRESSION, semaineProg } from "../data/progression";
import { schemaParId } from "../data/schemas";
import type { SemaineExport } from "../export/docx";

export type JourEtat = "jour1" | "jour2" | "evaluation";

export interface Config {
  source: "semaine" | "libre";
  numero: number;
  titreLibre: string;
  schemasLibres: string[];
  niveaux: Niveau[];
  nbProblemes: number;
  /** Contexte imposé pour chaque problème (null = au choix du logiciel). */
  imposes: (string | null)[];
  exclus: string[];
  graine: string;
}

export interface Emplacement {
  p: Probleme;
  verrou: boolean;
  variante: number;
  /** Version générée, avant les modifications de texte de l'enseignant. */
  original?: Probleme;
  /** Jour 2 : identifiant du Jour 1 dont il est issu. */
  sourceJ1?: string;
}

export interface NiveauEtat { jour1: Emplacement[]; jour2: (Emplacement | null)[]; evaluation: Emplacement | null }

export interface Session { config: Config; niveaux: Partial<Record<Niveau, NiveauEtat>> }

export const CONFIG_DEFAUT: Config = {
  source: "semaine", numero: 5, titreLibre: "Notion libre", schemasLibres: ["consommation-stock"],
  niveaux: [1, 2, 3], nbProblemes: 4, imposes: [], exclus: [], graine: "DEMO-2026",
};

export const sessionVide = (config: Config = CONFIG_DEFAUT): Session => ({ config, niveaux: {} });

/** Traduit la configuration en options du moteur. */
export function optionsDe(c: Config): OptionsSemaine {
  if (c.source === "semaine") {
    const prog = semaineProg(c.numero);
    if (prog.schemas.length === 0) {
      throw new Error(`La semaine ${c.numero} (« ${prog.titre} ») n'a pas encore de schéma de problème. `
        + "Choisissez « Notion libre » pour combiner les schémas disponibles.");
    }
    return {
      numero: c.numero, titre: prog.titre, graine: c.graine, contextes: CONTEXTES, nbProblemes: c.nbProblemes,
      schemas: prog.schemas.map(schemaParId), principal: prog.principal ? schemaParId(prog.principal) : undefined,
      imposes: Array.from({ length: c.nbProblemes }, (_, i) => c.imposes[i] ?? prog.contextes?.[i] ?? null),
      exclus: c.exclus, niveaux: c.niveaux,
    };
  }
  if (c.schemasLibres.length === 0) throw new Error("Choisissez au moins un schéma pour la notion libre.");
  return {
    numero: 0, titre: c.titreLibre.trim() || "Notion libre", graine: c.graine, contextes: CONTEXTES,
    nbProblemes: c.nbProblemes, schemas: c.schemasLibres.map(schemaParId), imposes: c.imposes, exclus: c.exclus, niveaux: c.niveaux,
  };
}

const nouveau = (p: Probleme, variante = 0, sourceJ1?: string): Emplacement => ({ p, verrou: false, variante, sourceJ1 });
const niveauxDe = (s: Session) => s.config.niveaux.filter((n) => s.niveaux[n]);

/** Jour 1 : nouveaux problèmes pour tous les niveaux choisis, sauf ceux qui sont verrouillés. */
export function genererJour1(s: Session): Session {
  const o = optionsDe(s.config);
  const nb = s.config.nbProblemes;
  // un problème verrouillé garde son contexte : on l'impose à tous les niveaux
  const verrouCtx = (i: number) =>
    s.config.niveaux.map((n) => s.niveaux[n]?.jour1[i]).find((e) => e?.verrou)?.p.contexteId;
  const imposes = Array.from({ length: nb }, (_, i) => verrouCtx(i) ?? o.imposes?.[i] ?? null);
  const plan = repartirContextes({ ...o, imposes });
  const niveaux: Session["niveaux"] = {};
  for (const n of s.config.niveaux) {
    const avant = s.niveaux[n];
    const jour1 = Array.from({ length: nb }, (_, i) => {
      const e = avant?.jour1[i];
      if (e?.verrou) return e;
      return nouveau(genererJ1Un(o, plan.probs[i], n, i));
    });
    const ctx = new Set(jour1.map((e) => e.p.contexteId));
    niveaux[n] = {
      jour1,
      // le Jour 2 verrouillé est conservé ; les autres sont à refaire évoluer
      jour2: Array.from({ length: nb }, (_, i) => (avant?.jour2[i]?.verrou ? avant.jour2[i] : null)),
      evaluation: avant?.evaluation && (avant.evaluation.verrou || !ctx.has(avant.evaluation.p.contexteId)) ? avant.evaluation : null,
    };
  }
  return { ...s, niveaux };
}

/** Jour 2 : chaque problème du Jour 1 évolue (mêmes contextes, données modifiées, inconnue inversée). */
export function evoluerJour2(s: Session): Session {
  const o = optionsDe(s.config);
  const niveaux = { ...s.niveaux };
  if (niveauxDe(s).length === 0) throw new Error("Générez d'abord le Jour 1.");
  for (const n of niveauxDe(s)) {
    const ns = s.niveaux[n]!;
    niveaux[n] = {
      ...ns,
      jour2: ns.jour1.map((j1, i) => {
        const e = ns.jour2[i];
        if (e?.verrou) return e;
        return nouveau(genererJ2Un(o, j1.p, i), 0, j1.p.id);
      }),
    };
  }
  return { ...s, niveaux };
}

/** Évaluation : schéma principal de la semaine, dans un contexte absent du Jour 1. */
export function creerEvaluation(s: Session): Session {
  const o = optionsDe(s.config);
  if (niveauxDe(s).length === 0) throw new Error("Générez d'abord le Jour 1.");
  const utilises = [...new Set(niveauxDe(s).flatMap((n) => s.niveaux[n]!.jour1.map((e) => e.p.contexteId)))];
  const verrouille = niveauxDe(s).map((n) => s.niveaux[n]!.evaluation).find((e) => e?.verrou);
  const ctx = contexteEvaluation(o, utilises, verrouille ? contexteParId(verrouille.p.contexteId) : undefined);
  const niveaux = { ...s.niveaux };
  for (const n of niveauxDe(s)) {
    const ns = s.niveaux[n]!;
    niveaux[n] = { ...ns, evaluation: ns.evaluation?.verrou ? ns.evaluation : nouveau(genererEvalUn(o, ctx, n)) };
  }
  return { ...s, niveaux };
}

function lire(s: Session, n: Niveau, jour: JourEtat, i: number): Emplacement | null {
  const ns = s.niveaux[n];
  if (!ns) return null;
  return jour === "evaluation" ? ns.evaluation : ns[jour][i] ?? null;
}

function ecrire(s: Session, n: Niveau, jour: JourEtat, i: number, e: Emplacement): Session {
  const ns = s.niveaux[n]!;
  const maj: NiveauEtat = jour === "evaluation" ? { ...ns, evaluation: e }
    : { ...ns, [jour]: ns[jour].map((x, k) => (k === i ? e : x)) };
  return { ...s, niveaux: { ...s.niveaux, [n]: maj } };
}

/** Régénère un seul problème (même contexte, même schéma, nouvelles données). */
export function regenerer(s: Session, n: Niveau, jour: JourEtat, i: number): Session {
  const e = lire(s, n, jour, i);
  if (!e || e.verrou) return s;
  const o = optionsDe(s.config);
  const v = e.variante + 1;
  const ctx = contexteParId(e.p.contexteId);
  if (jour === "jour1") return ecrire(s, n, jour, i, nouveau(genererJ1Un(o, ctx, n, i, v), v));
  if (jour === "jour2") {
    const j1 = s.niveaux[n]!.jour1[i].p;
    return ecrire(s, n, jour, i, nouveau(genererJ2Un(o, j1, i, v), v, j1.id));
  }
  return ecrire(s, n, jour, i, nouveau(genererEvalUn(o, ctx, n, v), v));
}

export function basculerVerrou(s: Session, n: Niveau, jour: JourEtat, i: number): Session {
  const e = lire(s, n, jour, i);
  return e ? ecrire(s, n, jour, i, { ...e, verrou: !e.verrou }) : s;
}

export type ChampsTexte = Partial<Pick<Probleme, "enonce" | "question" | "guidees" | "reponse">>;

export function modifierTexte(s: Session, n: Niveau, jour: JourEtat, i: number, champs: ChampsTexte): Session {
  const e = lire(s, n, jour, i);
  if (!e) return s;
  return ecrire(s, n, jour, i, { ...e, original: e.original ?? e.p, p: { ...e.p, ...champs } });
}

export function retablirOriginal(s: Session, n: Niveau, jour: JourEtat, i: number): Session {
  const e = lire(s, n, jour, i);
  return e?.original ? ecrire(s, n, jour, i, { ...e, p: e.original, original: undefined }) : s;
}

/** Le Jour 1 a été régénéré depuis que ce Jour 2 a été créé. */
export function jour2Obsolete(s: Session, n: Niveau, i: number): boolean {
  const ns = s.niveaux[n];
  const e = ns?.jour2[i];
  return !!e && !!e.sourceJ1 && e.sourceJ1 !== ns!.jour1[i]?.p.id;
}

export function titreSession(c: Config): { numero: number; titre: string } {
  return c.source === "semaine"
    ? { numero: c.numero, titre: semaineProg(c.numero).titre }
    : { numero: 0, titre: c.titreLibre.trim() || "Notion libre" };
}

/** La session telle qu'elle sera imprimée (textes modifiés compris). */
export function versExport(s: Session): SemaineExport {
  const { numero, titre } = titreSession(s.config);
  const niveaux: SemaineExport["niveaux"] = {};
  for (const n of niveauxDe(s)) {
    const ns = s.niveaux[n]!;
    niveaux[n] = {
      jour1: ns.jour1.map((e) => e.p),
      jour2: ns.jour2.filter((e): e is Emplacement => !!e).map((e) => e.p),
      evaluation: ns.evaluation?.p,
    };
  }
  return { numero, titre, graine: s.config.graine, niveaux };
}

export const aDuContenu = (s: Session) => niveauxDe(s).length > 0;
export const periodeDe = (numero: number) => PROGRESSION.find((x) => x.numero === numero)?.periode ?? 1;

// ---------- sauvegarde locale (navigateur uniquement, jamais envoyée) ----------

const CLE = "generateur-problemes:session:v1";

export function chargerSession(): Session {
  try {
    const t = localStorage.getItem(CLE);
    if (t) {
      const s = JSON.parse(t) as Session;
      return { config: { ...CONFIG_DEFAUT, ...s.config }, niveaux: s.niveaux ?? {} };
    }
  } catch { /* stockage indisponible ou données anciennes */ }
  return sessionVide();
}

export function sauverSession(s: Session): void {
  try { localStorage.setItem(CLE, JSON.stringify(s)); } catch { /* stockage indisponible */ }
}
