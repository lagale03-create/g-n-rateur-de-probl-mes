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

/** Entier tiré entre min% et max% de x (au moins 1), arrondi au multiple `pas`. */
export function partDe(x: Q, rng: Rng, min = 0.2, max = 0.7, pas = 1): Q {
  const lo = Math.max(1, Math.ceil((x.toNumber() * min) / pas));
  const hi = Math.max(lo, Math.floor((x.toNumber() * max) / pas));
  return Q.of(rng.int(lo, hi) * pas);
}

// ---------- relations usuelles ----------
import type { Relation, Situation, VarDef } from "../../core/types";

export const N: VarDef = { grandeur: "compte" };
export const E: VarDef = { grandeur: "euro" };
export const mes = (unite: string): VarDef => ({ grandeur: "mesure", unite });
export const constante = (valeur: number): VarDef => ({ grandeur: "facteur", valeur });

/** c = a + b (on réunit ; à rebours : différence). */
export const union = (c: string, a: string, b: string, nom: Situation = "Union"): Relation =>
  ({ type: "add", c, a, b, noms: { c: nom, a: "Différence", b: "Différence" } });
/** avant − retire = apres (retrait ; à rebours : recherche de l'état initial). */
export const retrait = (avant: string, apres: string, retire: string): Relation =>
  ({ type: "add", c: avant, a: apres, b: retire, noms: { c: "Recherche de l'état initial", a: "Retrait", b: "Différence" } });
/** c = a × b (réitération ; à rebours : partage pour a, groupement pour b). */
export const prod = (c: string, a: string, b: string, noms: Relation["noms"] = {}): Relation =>
  ({ type: "mul", c, a, b, noms: { c: "Réitération", a: "Partage", b: "Groupement", ...noms } });
/** grand = petit + écart (comparaison dans les deux sens). */
export const ecart = (grand: string, petit: string, e: string): Relation =>
  ({ type: "add", c: grand, a: petit, b: e, noms: { c: "Comparaison", a: "Comparaison", b: "Comparaison" } });
/** c = a × facteur (conversion). */
export const conv = (c: string, a: string, facteur: string): Relation => ({ type: "conv", c, a, b: facteur });
