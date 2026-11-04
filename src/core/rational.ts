/**
 * Nombres rationnels exacts (numérateur / dénominateur entiers).
 * Évite toute erreur d'arrondi : 0,1 + 0,2 vaut exactement 0,3.
 */
export class Q {
  readonly n: number;
  readonly d: number;

  private constructor(n: number, d: number) {
    if (d === 0) throw new Error("Division par zéro");
    if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d)) throw new Error("Nombre trop grand");
    const s = d < 0 ? -1 : 1;
    const g = pgcd(Math.abs(n), Math.abs(d)) || 1;
    this.n = (s * n) / g;
    this.d = (s * d) / g;
  }

  static of(n: number, d = 1): Q {
    return new Q(n, d);
  }

  /** Construit depuis un nombre JS ou une chaîne décimale ("2.5", "2,5", "3/4"). */
  static from(x: number | string | Q): Q {
    if (x instanceof Q) return x;
    const s = String(x).trim().replace(",", ".");
    if (s.includes("/")) {
      const [a, b] = s.split("/");
      return new Q(parseInt(a, 10), parseInt(b, 10));
    }
    const neg = s.startsWith("-");
    const [ent, dec = ""] = s.replace("-", "").split(".");
    const d = 10 ** dec.length;
    const n = parseInt(ent || "0", 10) * d + (dec ? parseInt(dec, 10) : 0);
    return new Q(neg ? -n : n, d);
  }

  add(o: Q | number): Q { const b = Q.from(o); return new Q(this.n * b.d + b.n * this.d, this.d * b.d); }
  sub(o: Q | number): Q { const b = Q.from(o); return new Q(this.n * b.d - b.n * this.d, this.d * b.d); }
  mul(o: Q | number): Q { const b = Q.from(o); return new Q(this.n * b.n, this.d * b.d); }
  div(o: Q | number): Q { const b = Q.from(o); return new Q(this.n * b.d, this.d * b.n); }

  cmp(o: Q | number): number { const b = Q.from(o); return Math.sign(this.n * b.d - b.n * this.d); }
  eq(o: Q | number): boolean { return this.cmp(o) === 0; }
  get isInteger(): boolean { return this.d === 1; }
  get isNegative(): boolean { return this.n < 0; }

  /** Nombre de chiffres après la virgule (Infinity si non décimal, ex. 1/3). */
  get decimales(): number {
    let d = this.d, k = 0;
    while (d % 10 === 0) { d /= 10; k++; }
    let twos = 0, fives = 0;
    while (d % 2 === 0) { d /= 2; twos++; }
    while (d % 5 === 0) { d /= 5; fives++; }
    if (d !== 1) return Infinity;
    return k + Math.max(twos, fives);
  }

  floor(): Q { return Q.of(Math.floor(this.n / this.d)); }
  ceil(): Q { return Q.of(Math.ceil(this.n / this.d)); }
  toNumber(): number { return this.n / this.d; }
  toString(): string { return this.d === 1 ? `${this.n}` : `${this.n}/${this.d}`; }
}

export function pgcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}
