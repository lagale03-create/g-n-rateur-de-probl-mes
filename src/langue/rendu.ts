/**
 * Moteur de gabarits.
 *   {x}        valeur de la variable x avec son unité (« 36 kg », « 4,50 € », « 6 »)
 *   [A]        mot A au singulier            [A:pl]  au pluriel
 *   [A:n]      mot A accordé avec la variable n (pluriel si n ≥ 2)
 *   [de:A]     « de viande » / « d'eau »      [un:A]  « un » / « une »
 *   [le:A]     « le » / « la » / « l' »       [dun:A] « d'un » / « d'une »
 *   [il:A]     « il » / « elle »              [ils:A] « ils » / « elles »
 *   [tous:A]   « tous » / « toutes »
 */
import { Q } from "../core/rational";
import type { Grandeur, Mot, Niveau, Texte, Variante } from "../core/types";
import { formatMesure, formatEuros, formatNombre } from "./format";
import { de, le, majuscules, pluriel, typographie, un } from "./grammaire";
import { enLettres } from "./enLettres";

export interface EnvRendu {
  valeurs: Record<string, Q>;
  grandeurs: Record<string, Grandeur>;
  unites: { quantite?: string; grande?: string };
  mots: Record<string, Mot>;
  lettres: Set<string>;
}

export function uniteDe(g: Grandeur, unites: EnvRendu["unites"]): string {
  if (g === "euro") return "€";
  if (g === "quantite") return unites.quantite ?? "";
  if (g === "quantiteGrande") return unites.grande ?? "";
  return "";
}

export function formatVar(nom: string, env: EnvRendu, lettresOk = true): string {
  const v = env.valeurs[nom];
  if (!v) throw new Error(`Variable inconnue dans le gabarit : ${nom}`);
  const g = env.grandeurs[nom] ?? "compte";
  if (lettresOk && env.lettres.has(nom) && v.isInteger) {
    const u = uniteDe(g, env.unites);
    return enLettres(v.toNumber()) + (g === "euro" ? " euros" : u ? " " + u : "");
  }
  if (g === "euro") return formatEuros(v);
  return formatMesure(v, uniteDe(g, env.unites));
}

/** Choisit la première variante dont les variables sont toutes disponibles. */
export function choisir(t: Texte | undefined, dispo: Set<string>, niveau: Niveau): Variante | null {
  if (t === undefined) return null;
  if (typeof t === "string") return { t };
  for (const v of t) {
    if (v.niveaux && !v.niveaux.includes(niveau)) continue;
    if ((v.vars ?? []).every((x) => dispo.has(x))) return v;
  }
  return null;
}

/** Variables citées dans un gabarit (pour vérifier qu'aucune inconnue n'est révélée). */
export function variablesCitees(t: string): string[] {
  return [...t.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
}

export function rendre(t: string, env: EnvRendu, opts: { lettres?: boolean } = {}): string {
  const lettresOk = opts.lettres ?? true;
  let s = t.replace(/\{(\w+)\}/g, (_, nom: string) => formatVar(nom, env, lettresOk));
  s = s.replace(/\[(\w+)(?::(\w+))?\]/g, (_, a: string, b?: string) => {
    const getMot = (k: string) => {
      const m = env.mots[k];
      if (!m) throw new Error(`Mot manquant dans le contexte : ${k}`);
      return m;
    };
    if (b !== undefined) {
      switch (a) {
        case "de": return de(getMot(b));
        case "un": return un(getMot(b));
        case "dun": return "d'" + un(getMot(b));
        case "le": return le(getMot(b)).trimEnd() + (le(getMot(b)).endsWith("'") ? "\u0000" : "");
        case "il": return getMot(b).g === "f" ? "elle" : "il";
        case "ils": return getMot(b).g === "f" ? "elles" : "ils";
        case "tous": return getMot(b).g === "f" ? "toutes" : "tous";
      }
      const m = getMot(a);
      if (b === "pl") return pluriel(m);
      const v = env.valeurs[b];
      if (!v) throw new Error(`Accord avec une variable inconnue : ${b}`);
      return v.cmp(2) >= 0 ? pluriel(m) : m.s;
    }
    return getMot(a).s;
  });
  // « l' » se colle au mot suivant
  s = s.replace(/\u0000\s*/g, "");
  return majuscules(typographie(s));
}

export { formatNombre };
