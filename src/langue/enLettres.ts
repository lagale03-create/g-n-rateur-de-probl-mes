/**
 * Écriture des nombres entiers en lettres (orthographe traditionnelle par défaut,
 * orthographe rectifiée de 1990 en option : traits d'union partout).
 *   87  → « quatre-vingt-sept »
 *   147 → « cent quarante-sept »
 *   80  → « quatre-vingts »   200 → « deux cents »   1000 → « mille »
 */
const UNITES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"];
const DIZAINES = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante"];

export interface OptionsLettres { rectifiee?: boolean }

function moinsDeCent(n: number, final: boolean, sep: string): string {
  if (n <= 16) return UNITES[n];
  if (n < 20) return "dix" + "-" + UNITES[n - 10];
  const d = Math.floor(n / 10), u = n % 10;
  if (d === 7 || d === 9) {
    const base = d === 7 ? "soixante" : "quatre-vingt";
    const r = 10 + u;
    const liaison = d === 7 && u === 1 ? `${sep}et${sep}` : "-";
    return base + liaison + moinsDeCent(r, final, sep);
  }
  if (d === 8) return u === 0 ? (final ? "quatre-vingts" : "quatre-vingt") : "quatre-vingt-" + UNITES[u];
  if (u === 0) return DIZAINES[d];
  if (u === 1) return DIZAINES[d] + `${sep}et${sep}un`;
  return DIZAINES[d] + "-" + UNITES[u];
}

function moinsDeMille(n: number, final: boolean, sep: string): string {
  const c = Math.floor(n / 100), r = n % 100;
  let s = "";
  if (c > 0) {
    s = c === 1 ? "cent" : UNITES[c] + sep + "cent";
    if (r === 0 && c > 1 && final) s += "s";
    if (r > 0) s += sep + moinsDeCent(r, final, sep);
    return s;
  }
  return moinsDeCent(r, final, sep);
}

export function enLettres(n: number, opts: OptionsLettres = {}): string {
  if (!Number.isInteger(n) || n < 0) throw new Error(`enLettres : entier positif attendu (${n})`);
  if (n >= 1e12) throw new Error("enLettres : nombre trop grand");
  const sep = opts.rectifiee ? "-" : " ";
  if (n === 0) return "zéro";
  const milliards = Math.floor(n / 1e9);
  const millions = Math.floor((n % 1e9) / 1e6);
  const milliers = Math.floor((n % 1e6) / 1000);
  const reste = n % 1000;
  const parts: string[] = [];
  if (milliards) parts.push(moinsDeMille(milliards, true, sep) + sep + (milliards > 1 ? "milliards" : "milliard"));
  if (millions) parts.push(moinsDeMille(millions, true, sep) + sep + (millions > 1 ? "millions" : "million"));
  // « mille » est invariable et « cent/vingt » devant « mille » ne prennent pas de s
  if (milliers) parts.push(milliers === 1 ? "mille" : moinsDeMille(milliers, false, sep) + sep + "mille");
  if (reste) parts.push(moinsDeMille(reste, true, sep));
  return parts.join(sep);
}
