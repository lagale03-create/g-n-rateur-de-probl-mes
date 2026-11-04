/**
 * Petite grammaire française : pluriel, genre, élision, majuscules.
 */
import type { Mot } from "../core/types";

const VOYELLES = /^[aeiouyàâäéèêëîïôöùûüœæh]/i;

export function mot(m: string | Mot): Mot {
  return typeof m === "string" ? { s: m } : m;
}

export function pluriel(m: Mot): string {
  if (m.p) return m.p;
  // pluriel régulier du premier mot (« pot de confiture » → « pots de confiture »)
  const [tete, ...reste] = m.s.split(" ");
  let p: string;
  if (/(s|x|z)$/.test(tete)) p = tete;
  else if (/(au|eu|eau)$/.test(tete)) p = tete + "x";
  else if (/al$/.test(tete) && !["bal", "festival", "carnaval", "chacal", "récital"].includes(tete)) p = tete.slice(0, -2) + "aux";
  else p = tete + "s";
  return [p, ...reste].join(" ");
}

export function commenceParVoyelle(m: Mot): boolean {
  if (m.voy !== undefined) return m.voy;
  return VOYELLES.test(m.s) && !/^h/i.test(m.s);
}

/** « de viande », « d'eau » */
export function de(m: Mot): string {
  return commenceParVoyelle(m) ? `d'${m.s}` : `de ${m.s}`;
}
/** « un croissant », « une tarte » */
export function un(m: Mot): string {
  return m.g === "f" ? "une" : "un";
}
/** « le lion », « la tarte », « l'adulte » */
export function le(m: Mot): string {
  if (commenceParVoyelle(m)) return "l'";
  return m.g === "f" ? "la " : "le ";
}

/** Met une majuscule au début du texte et après chaque point. */
export function majuscules(t: string): string {
  return t.replace(/(^\s*|[.!?]\s+)([a-zàâäéèêëîïôöùûüç])/g, (_, a: string, b: string) => a + b.toUpperCase());
}

/** Nettoie les espaces et applique la ponctuation française (espace insécable avant ? ! : ;). */
export function typographie(t: string): string {
  return t
    .replace(/[ \t\n]+/g, " ")
    .replace(/\s*([?!:;])/g, " $1")
    .replace(/\s+([.,])/g, "$1")
    .replace(/'[ \t]+/g, "'")
    .trim();
}
