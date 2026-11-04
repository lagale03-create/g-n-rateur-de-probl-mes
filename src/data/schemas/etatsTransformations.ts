/**
 * Schéma « états et transformations » (structures additives).
 *   Un stock évolue dans le temps : il augmente (union), diminue (retrait)…
 *   ★ : départ + arrivée − départ  ★★ : une arrivée de plus  ★★★ : deux arrivées, deux départs, grands nombres.
 * Jour 2 : recherche de l'état initial, ou de l'une des transformations.
 *
 * Mots attendus du contexte : obj, stock, debut, aj1, m1, re1, m2, aj2, m3, re2, fin,
 * vp1, vg2, vp2 (« sont sortis entre 14 h et 16 h » : sert aux questions du Jour 2).
 */
import type { Relation, Schema, Structure, VarDef } from "../../core/types";
import { partDe } from "./outils";

const n: VarDef = { grandeur: "compte" };
const EI = "Recherche de l'état initial" as const;
const plus = (c: string, a: string, b: string): Relation => ({ type: "add", c, a, b, noms: { c: "Union", a: EI, b: "Différence" } });
const moins = (avant: string, apres: string, retire: string): Relation =>
  ({ type: "add", c: avant, a: apres, b: retire, noms: { c: EI, a: "Retrait", b: "Différence" } });

export const etatsTransformations: Schema = {
  id: "etats-transformations",
  titre: "États et transformations",
  notion: "structures additives",
  roles: ["obj", "stock", "debut", "aj1", "m1", "re1", "m2", "aj2", "m3", "re2", "fin", "vp1", "vg2", "vp2"],

  structure(niveau): Structure {
    const v: Record<string, VarDef> = { depart: n, g1: n, s1: n, p1: n, s2: n };
    const r: Relation[] = [plus("s1", "depart", "g1"), moins("s1", "s2", "p1")];
    if (niveau >= 2) { v.g2 = n; v.s3 = n; r.push(plus("s3", "s2", "g2")); }
    if (niveau === 3) { v.p2 = n; v.s4 = n; r.push(moins("s3", "s4", "p2")); }
    const fin = niveau === 1 ? "s2" : niveau === 2 ? "s3" : "s4";
    const pl = niveau === 1
      ? { depart: { min: 40, max: 250 }, g1: { min: 10, max: 90 } }
      : niveau === 2
        ? { depart: { min: 150, max: 900 }, g1: { min: 50, max: 400 }, g2: { min: 50, max: 400 } }
        : { depart: { min: 1000, max: 9500 }, g1: { min: 200, max: 3000 }, g2: { min: 200, max: 3000 } };
    const tirage: Structure["tirage"] = [
      { v: "depart", plage: pl.depart },
      { v: "g1", plage: pl.g1 },
      { v: "p1", f: (w, { rng }) => partDe(w.s1, rng, 0.2, 0.6) },
    ];
    if (niveau >= 2) tirage.push({ v: "g2", plage: (pl as { g2: { min: number; max: number } }).g2 });
    if (niveau === 3) tirage.push({ v: "p2", f: (w, { rng }) => partDe(w.s3, rng, 0.2, 0.6) });
    const donnees = (sans: string, avec: string) =>
      ["depart", "g1", "p1", ...(niveau >= 2 ? ["g2"] : []), ...(niveau === 3 ? ["p2"] : []), fin].filter((x) => x !== sans && x !== avec);
    return {
      variables: v,
      relations: r,
      tirage,
      j1: { inconnue: fin, donnees: donnees(fin, "") },
      j2: [
        { inconnue: "depart", donnees: donnees("depart", "") },
        niveau === 1 ? { inconnue: "p1", donnees: donnees("p1", "") }
          : niveau === 2 ? { inconnue: "g2", donnees: donnees("g2", "") }
            : { inconnue: "p2", donnees: donnees("p2", "") },
      ],
      contraintes: (w) => {
        if (w[fin].cmp(5) < 0) return "état final trop petit";
        const t = ["depart", "g1", "p1", "g2", "p2", fin].filter((x) => w[x]).map((x) => w[x].toString());
        return new Set(t).size < t.length ? "deux données identiques" : null;
      },
    };
  },

  textes: {
    phrases: [
      [
        { vars: ["depart"], t: "[debut], il y a {depart} [obj:depart] [stock]." },
        { t: "[debut], il y a des [obj:pl] [stock]." },
      ],
      [{ vars: ["g1"], t: "[aj1] {g1}." }],
      [{ vars: ["p1"], t: "[re1] {p1}." }],
      [{ vars: ["g2"], t: "[aj2] {g2}." }],
      [{ vars: ["p2"], t: "[re2] {p2}." }],
      [
        { vars: ["s2"], t: "[m2], il y a {s2} [obj:s2] [stock]." },
        { vars: ["s3"], t: "[m3], il y a {s3} [obj:s3] [stock]." },
        { vars: ["s4"], t: "[fin], il y a {s4} [obj:s4] [stock]." },
      ],
    ],
    questions: {
      s2: "Combien de [obj:pl] y a-t-il [stock] [m2] ?",
      s3: "Combien de [obj:pl] y a-t-il [stock] [m3] ?",
      s4: "Combien de [obj:pl] y a-t-il [stock] [fin] ?",
      depart: "Combien de [obj:pl] y avait-il [stock] [debut] ?",
      p1: "Combien de [obj:pl] [vp1] ?",
      g2: "Combien de [obj:pl] [vg2] ?",
      p2: "Combien de [obj:pl] [vp2] ?",
    },
    guidees: {
      s1: "Combien de [obj:pl] y a-t-il [stock] [m1] ?",
    },
    libelles: {
      depart: "[obj:pl] [stock] [debut]",
      s1: "[obj:pl] [stock] [m1]",
      s2: "[obj:pl] [stock] [m2]",
      s3: "[obj:pl] [stock] [m3]",
      s4: "[obj:pl] [stock] [fin]",
      p1: "nombre de [obj:pl] qui [vp1]",
      g2: "nombre de [obj:pl] qui [vg2]",
      p2: "nombre de [obj:pl] qui [vp2]",
    },
    reponses: {
      s2: "[m2], il y a {s2} [obj:s2] [stock].",
      s3: "[m3], il y a {s3} [obj:s3] [stock].",
      s4: "[fin], il y a {s4} [obj:s4] [stock].",
      depart: "[debut], il y avait {depart} [obj:depart] [stock].",
      p1: "{p1} [obj:p1] [vp1].",
      g2: "{g2} [obj:g2] [vg2].",
      p2: "{p2} [obj:p2] [vp2].",
    },
  },
};
