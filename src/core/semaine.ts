/**
 * Assemblage d'une semaine : Jour 1 (contextes tous différents), Jour 2 (mêmes contextes,
 * inconnue inversée), évaluation (contexte nouveau, schéma principal), pour chaque niveau.
 * Les contextes sont les mêmes pour les 3 niveaux : toute la classe travaille sur les mêmes histoires.
 *
 * Les fonctions « un » génèrent un seul problème : l'interface s'en sert pour régénérer
 * un problème sans toucher aux autres (la `variante` change sa sous-graine).
 */
import { genererProbleme } from "./moteur";
import { rngFor } from "./rng";
import type { Contexte, Niveau, Probleme, Schema } from "./types";

export interface OptionsSemaine {
  numero: number;
  titre: string;
  schemas: Schema[];
  principal?: Schema;
  contextes: Contexte[];
  graine: string;
  niveaux?: Niveau[];
  nbProblemes?: number;
  /** Contextes imposés, par numéro de problème (null ou absent = au choix du logiciel). */
  imposes?: (string | null | undefined)[];
  exclus?: string[];
}

export interface NiveauSemaine { jour1: Probleme[]; jour2: Probleme[]; evaluation: Probleme }

export interface Semaine {
  numero: number;
  titre: string;
  graine: string;
  contextes: string[];
  contexteEval: string;
  niveaux: Partial<Record<Niveau, NiveauSemaine>>;
}

export interface Plan { probs: Contexte[]; evaluation: Contexte }

export const schemaDuProbleme = (o: OptionsSemaine, i: number): Schema => o.schemas[i % o.schemas.length];
export const principalDe = (o: OptionsSemaine): Schema => o.principal ?? o.schemas[0];
const prefixe = (o: OptionsSemaine) => `S${o.numero}`;
const graineLex = (o: OptionsSemaine) => `${o.graine}|${prefixe(o)}`;
const suffixe = (variante: number) => (variante > 0 ? `~${variante}` : "");

/** Répartit les contextes (tous différents) entre les problèmes, plus un pour l'évaluation. */
export function repartirContextes(o: OptionsSemaine): Plan {
  const nb = o.nbProblemes ?? 4;
  const principal = principalDe(o);
  const dispo = o.contextes.filter((c) => !(o.exclus ?? []).includes(c.id));
  const ordre = rngFor(o.graine, "contextes").shuffle(dispo);
  const schemaDe = (i: number) => (i < nb ? schemaDuProbleme(o, i) : principal);
  const choix: Contexte[] = [];
  const essayer = (i: number): boolean => {
    if (i > nb) return true;
    const impose = i < nb ? o.imposes?.[i] : undefined;
    const cands = impose ? dispo.filter((c) => c.id === impose) : ordre;
    for (const c of cands) {
      if (choix.includes(c) || !c.schemas[schemaDe(i).id]) continue;
      choix.push(c);
      if (essayer(i + 1)) return true;
      choix.pop();
    }
    return false;
  };
  if (!essayer(0)) {
    throw new Error(`Pas assez de contextes compatibles : il en faut ${nb + 1} différents (${nb} problèmes et l'évaluation). `
      + "Retirez une exclusion, un contexte imposé ou un problème.");
  }
  return { probs: choix.slice(0, nb), evaluation: choix[nb] };
}

/** Contexte de l'évaluation : compatible avec le schéma principal et absent du Jour 1. */
export function contexteEvaluation(o: OptionsSemaine, utilises: string[], prefere?: Contexte): Contexte {
  const principal = principalDe(o);
  const ok = (c: Contexte) => !utilises.includes(c.id) && !!c.schemas[principal.id] && !(o.exclus ?? []).includes(c.id);
  if (prefere && ok(prefere)) return prefere;
  const c = rngFor(o.graine, "contexte-eval").shuffle(o.contextes).find(ok);
  if (!c) throw new Error("Aucun contexte nouveau disponible pour l'évaluation.");
  return c;
}

export function genererJ1Un(o: OptionsSemaine, contexte: Contexte, niveau: Niveau, i: number, variante = 0): Probleme {
  return genererProbleme({
    schema: schemaDuProbleme(o, i), contexte, niveau, jour: 1, graine: o.graine, graineLex: graineLex(o),
    chemin: `${prefixe(o)}/N${niveau}/J1/P${i + 1}${suffixe(variante)}`,
  });
}

/** Jour 2 : même schéma, même contexte, données modifiées et inconnue inversée. */
export function genererJ2Un(o: OptionsSemaine, j1: Probleme, i: number, variante = 0): Probleme {
  const schema = o.schemas.find((s) => s.id === j1.schemaId) ?? schemaDuProbleme(o, i);
  const contexte = o.contextes.find((c) => c.id === j1.contexteId)!;
  return genererProbleme({
    schema, contexte, niveau: j1.niveau, jour: 2, graine: o.graine, graineLex: graineLex(o),
    chemin: `${prefixe(o)}/N${j1.niveau}/J2/P${i + 1}${suffixe(variante)}`, differentDe: j1.monde,
  });
}

export function genererEvalUn(o: OptionsSemaine, contexte: Contexte, niveau: Niveau, variante = 0): Probleme {
  return genererProbleme({
    schema: principalDe(o), contexte, niveau, jour: "eval", graine: o.graine, graineLex: graineLex(o),
    chemin: `${prefixe(o)}/N${niveau}/EV${suffixe(variante)}`,
  });
}

export function genererSemaine(o: OptionsSemaine): Semaine {
  const nb = o.nbProblemes ?? 4;
  const { probs, evaluation } = repartirContextes(o);
  const niveaux: Semaine["niveaux"] = {};
  for (const niveau of o.niveaux ?? [1, 2, 3]) {
    const jour1 = Array.from({ length: nb }, (_, i) => genererJ1Un(o, probs[i], niveau, i));
    const jour2 = jour1.map((p1, i) => genererJ2Un(o, p1, i));
    niveaux[niveau] = { jour1, jour2, evaluation: genererEvalUn(o, evaluation, niveau) };
  }
  return { numero: o.numero, titre: o.titre, graine: o.graine, contextes: probs.map((c) => c.id), contexteEval: evaluation.id, niveaux };
}
