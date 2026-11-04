/**
 * Générateur pseudo-aléatoire déterministe à graine.
 * La même graine (et le même chemin) donne toujours le même tirage.
 */
import { Q } from "./rational";

/** Hachage d'une chaîne en entier 32 bits (cyrb53 tronqué). */
export function hash(str: string): number {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 ^ h1) >>> 0;
}

export class Rng {
  private s: number;
  constructor(seed: number | string) {
    this.s = typeof seed === "number" ? seed >>> 0 : hash(seed);
  }

  /** Flottant dans [0, 1[ (mulberry32). */
  next(): number {
    let t = (this.s = (this.s + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Entier entre min et max inclus. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** Valeur exacte entre min et max, par pas de `pas` (ex. 0,05). */
  step(min: number | string, max: number | string, pas: number | string = 1): Q {
    const a = Q.from(min), b = Q.from(max), p = Q.from(pas);
    const k = b.sub(a).div(p).floor().toNumber();
    return a.add(p.mul(this.int(0, k)));
  }

  pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) throw new Error("pick sur un tableau vide");
    return arr[Math.floor(this.next() * arr.length)];
  }

  chance(p: number): boolean { return this.next() < p; }

  shuffle<T>(arr: readonly T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

/** Sous-générateur déterministe : rngFor("S05-AB12", "niveau2", "jour1", 3). */
export function rngFor(...chemin: (string | number)[]): Rng {
  return new Rng(chemin.join("|"));
}

/** Nouvelle graine lisible, ex. "K7QZ-2M4P". */
export function nouvelleGraine(alea: () => number = Math.random): string {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += (i === 4 ? "-" : "") + c[Math.floor(alea() * c.length)];
  return s;
}
