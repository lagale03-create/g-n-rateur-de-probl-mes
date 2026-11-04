import { Q } from "../../core/rational";
import type { Rng } from "../../core/rng";

/** Plus petit multiple de m strictement supérieur à x, plus 0 à k multiples supplémentaires. */
export function auDessus(x: Q, m: number, rng: Rng, k = 3): Q {
  const base = x.div(m).floor().add(1).mul(m);
  return base.add(m * rng.int(0, k));
}

/** Billet ou somme ronde pour payer un total. */
export function billet(total: Q, rng: Rng): Q {
  const billets = [5, 10, 20, 50, 100, 200];
  const i = billets.findIndex((b) => total.cmp(b) < 0);
  if (i < 0) return auDessus(total, 50, rng, 1);
  // le plus petit billet qui suffit, parfois le suivant
  return Q.of(billets[Math.min(i + (rng.chance(0.25) ? 1 : 0), billets.length - 1)]);
}
