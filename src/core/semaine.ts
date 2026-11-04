/**
 * Assemblage d'une semaine : Jour 1 (4 contextes différents), Jour 2 (mêmes contextes,
 * inconnue inversée), évaluation (contexte nouveau, schéma principal), pour chaque niveau.
 * Les contextes sont les mêmes pour les 3 niveaux : toute la classe travaille sur les mêmes histoires.
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
  /** Contextes imposés (dans l'ordre des problèmes) et exclus. */
  imposes?: string[];
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

/** Répartit les contextes (tous différents) entre les problèmes, plus un pour l'évaluation. */
export function repartirContextes(o: OptionsSemaine): { probs: Contexte[]; evaluation: Contexte } {
  const nb = o.nbProblemes ?? 4;
  const principal = o.principal ?? o.schemas[0];
  const dispo = o.contextes.filter((c) => !(o.exclus ?? []).includes(c.id));
  const ordre = rngFor(o.graine, "contextes").shuffle(dispo);
  const schemaDe = (i: number) => (i < nb ? o.schemas[i % o.schemas.length] : principal);
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
  if (!essayer(0)) throw new Error("Pas assez de contextes compatibles pour cette semaine (il en faut 5 différents).");
  return { probs: choix.slice(0, nb), evaluation: choix[nb] };
}

export function genererSemaine(o: OptionsSemaine): Semaine {
  const nb = o.nbProblemes ?? 4;
  const principal = o.principal ?? o.schemas[0];
  const { probs, evaluation } = repartirContextes(o);
  const niveaux: Semaine["niveaux"] = {};
  const pre = `S${o.numero}`;
  for (const niveau of o.niveaux ?? [1, 2, 3]) {
    const jour1: Probleme[] = [], jour2: Probleme[] = [];
    for (let i = 0; i < nb; i++) {
      const schema = o.schemas[i % o.schemas.length];
      const base = { schema, contexte: probs[i], niveau, graine: o.graine, graineLex: `${o.graine}|${pre}` };
      const p1 = genererProbleme({ ...base, jour: 1, chemin: `${pre}/N${niveau}/J1/P${i + 1}` });
      jour1.push(p1);
      jour2.push(genererProbleme({ ...base, jour: 2, chemin: `${pre}/N${niveau}/J2/P${i + 1}`, differentDe: p1.monde }));
    }
    const ev = genererProbleme({
      schema: principal, contexte: evaluation, niveau, jour: "eval", graine: o.graine,
      graineLex: `${o.graine}|${pre}`, chemin: `${pre}/N${niveau}/EV`,
    });
    niveaux[niveau] = { jour1, jour2, evaluation: ev };
  }
  return { numero: o.numero, titre: o.titre, graine: o.graine, contextes: probs.map((c) => c.id), contexteEval: evaluation.id, niveaux };
}
