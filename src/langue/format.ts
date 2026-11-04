/**
 * Formatage des nombres « à la française ».
 * - virgule décimale ;
 * - espace fine insécable (U+202F) entre les classes : 1 200 ;
 * - espace insécable (U+00A0) avant les unités : 47,50 € ; 36 kg.
 */
import { Q } from "../core/rational";

export const ESPACE_FINE = " ";
export const INSECABLE = " ";
export const BARRE_FRACTION = "⁄";

function grouper(entier: string): string {
  return entier.replace(/\B(?=(\d{3})+(?!\d))/g, ESPACE_FINE);
}

/** 1200 → « 1 200 » ; 2.5 → « 2,5 » ; 3/4 → « 3⁄4 ». */
export function formatNombre(x: Q | number | string, decimalesMin = 0): string {
  const q = Q.from(x);
  if (q.isNegative) return "−" + formatNombre(Q.of(-q.n, q.d), decimalesMin);
  const nbDec = q.decimales;
  if (nbDec === Infinity) return formatFraction(q);
  const dec = Math.max(nbDec, decimalesMin);
  const ent = Math.floor(q.n / q.d);
  const reste = q.sub(ent);
  let s = grouper(String(ent));
  if (dec > 0) {
    const frac = reste.mul(10 ** dec);
    s += "," + String(frac.n / frac.d).padStart(dec, "0");
  }
  return s;
}

/** 47.5 → « 47,50 € » ; 12 → « 12 € ». */
export function formatEuros(x: Q | number | string): string {
  const q = Q.from(x);
  return formatNombre(q, q.isInteger ? 0 : 2) + INSECABLE + "€";
}

/** Nombre suivi de son unité : « 36 kg », « 1,5 L ». */
export function formatMesure(x: Q | number | string, unite: string): string {
  if (unite === "€") return formatEuros(x);
  return unite ? formatNombre(x) + INSECABLE + unite : formatNombre(x);
}

/** 112 → « 1 h 52 » ; 45 → « 45 min » ; 120 → « 2 h » ; 65 → « 1 h 05 ». */
export function formatDuree(minutes: number): string {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  if (h === 0) return `${m}${INSECABLE}min`;
  if (m === 0) return `${h}${INSECABLE}h`;
  return `${h}${INSECABLE}h${INSECABLE}${String(m).padStart(2, "0")}`;
}

/** Heure de la journée (minutes depuis minuit) : 510 → « 8 h 30 ». */
export function formatHeure(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24, m = minutes % 60;
  return m === 0 ? `${h}${INSECABLE}h` : `${h}${INSECABLE}h${INSECABLE}${String(m).padStart(2, "0")}`;
}

/** Fraction : « 3⁄4 ». */
export function formatFraction(x: Q | number | string): string {
  const q = Q.from(x);
  return `${q.n}${BARRE_FRACTION}${q.d}`;
}

/** Les années ne prennent pas d'espace : 1985. */
export function formatAnnee(a: number): string {
  return String(a);
}
