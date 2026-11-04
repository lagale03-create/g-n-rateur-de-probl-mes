/**
 * Moteur de gabarits.
 *   {x}        valeur de la variable x avec son unité (« 36 kg », « 4,50 € », « 6 »)
 *   [A]        mot A au singulier            [A:pl]  au pluriel
 *   [A:n]      mot A accordé avec la variable n (pluriel si n ≥ 2)
 *   [de:A]     « de viande » / « d'eau »      [un:A]  « un » / « une »
 *   [le:A]     « le » / « la » / « l' »       [dun:A] « d'un » / « d'une »
 *   [il:A]     « il » / « elle »              [ils:A] « ils » / « elles »
 *   [tous:A]   « tous » / « toutes »          [du:A]  « du » / « de la » / « de l' »
 */
import { Q } from "../core/rational";
import type { Grandeur, Mot, Niveau, Texte, Variante, VarDef } from "../core/types";
import { formatDuree, formatFraction, formatHeure, formatMesure, formatEuros, formatNombre, INSECABLE } from "./format";
import { de, le, majuscules, pluriel, typographie, un } from "./grammaire";
import { enLettres } from "./enLettres";

export interface EnvRendu {
  valeurs: Record<string, Q>;
  grandeurs: Record<string, Grandeur>;
  unites: { quantite?: string; grande?: string };
  mots: Record<string, Mot>;
  lettres: Set<string>;
  /** Définitions complètes (unités, dénominateurs, probabilités). */
  defs?: Record<string, VarDef>;
}

/** Unité d'une variable « mesure » : texte fixe, ou mot du contexte (« [unite] »). */
function uniteMesure(d: VarDef | undefined, env: EnvRendu): string {
  const u = d?.unite ?? "";
  const m = /^\[(\w+)\]$/.exec(u);
  return m ? env.mots[m[1]]?.s ?? "" : u;
}

export function uniteDe(g: Grandeur, unites: EnvRendu["unites"]): string {
  if (g === "euro") return "€";
  if (g === "quantite") return unites.quantite ?? "";
  if (g === "quantiteGrande") return unites.grande ?? "";
  return "";
}

export function formatVar(nom: string, env: EnvRendu, lettresOk = true, feminin = false): string {
  const v = env.valeurs[nom];
  if (!v) throw new Error(`Variable inconnue dans le gabarit : ${nom}`);
  const g = env.grandeurs[nom] ?? "compte";
  const d = env.defs?.[nom];
  switch (g) {
    case "duree": return formatDuree(v.toNumber());
    case "heure": return formatHeure(v.toNumber());
    case "pourcent": return formatNombre(v) + INSECABLE + "%";
    case "fraction": {
      const den = d?.den ? env.valeurs[d.den] : undefined;
      if (den && v.mul(den).isInteger) return `${v.mul(den).toNumber()}\u2044${den.toNumber()}`;
      return formatFraction(v);
    }
    case "proba": {
      if (d?.ratio) {
        const [a, b] = d.ratio.map((x) => env.valeurs[x].toNumber());
        return `${a}${INSECABLE}chance${a > 1 ? "s" : ""} sur ${b}`;
      }
      return formatFraction(v);
    }
    case "mesure": {
      const u = uniteMesure(d, env);
      if (lettresOk && env.lettres.has(nom) && v.isInteger) return enLettres(v.toNumber()) + (u ? " " + u : "");
      return formatMesure(v, u);
    }
  }
  if (lettresOk && env.lettres.has(nom) && v.isInteger) {
    const u = uniteDe(g, env.unites);
    return enLettres(v.toNumber(), { feminin }) + (g === "euro" ? " euros" : u ? " " + u : "");
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
  return [...t.matchAll(/\{(\w+)(?:\/(\w+))?\}/g)].flatMap((m) => (m[2] ? [m[1], m[2]] : [m[1]])).filter((x) => !/^\d+$/.test(x));
}

export function rendre(t: string, env: EnvRendu, opts: { lettres?: boolean } = {}): string {
  const lettresOk = opts.lettres ?? true;
  // « {n} [table:n] » : le nombre en lettres s'accorde avec un nom féminin (« vingt et une tables »)
  let s = t.replace(/\{(\w+)\}(\s+\[(\w+):\1\])/g, (_, nom: string, suite: string, mot: string) =>
    formatVar(nom, env, lettresOk, env.mots[mot]?.g === "f") + suite);
  s = s.replace(/\{(\w+)\}/g, (_, nom: string) => formatVar(nom, env, lettresOk));
  // {num/den} : fraction écrite à partir de deux entiers
  const val = (x: string) => (/^\d+$/.test(x) ? Number(x) : env.valeurs[x].toNumber());
  s = s.replace(/\{(\w+)\/(\w+)\}/g, (_, a: string, b: string) => `${val(a)}\u2044${val(b)}`);
  const balises = (x: string) => x.replace(/\[(\w+)(?::(\w+))?\]/g, (_, a: string, b?: string) => {
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
        case "du": {
          // « le potager » → « du potager » ; « la salle » → « de la salle » ; sans article : l'article seul
          const m = getMot(b);
          const art = /^(le|la|les|l')\s?(.*)$/i.exec(m.s);
          if (art) return ({ le: "du ", la: "de la ", les: "des ", "l'": "de l'" } as Record<string, string>)[art[1].toLowerCase()] + art[2];
          const l = le(m); return l === "l'" ? "de l'\u0000" : l === "la " ? "de la" : "du";
        }
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
  s = balises(balises(s));
  // « l' » se colle au mot suivant
  s = s.replace(/\u0000\s*/g, "");
  return majuscules(typographie(s));
}

export { formatNombre };
