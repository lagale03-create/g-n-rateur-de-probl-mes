/**
 * Schéma « lots » (multiplication) : des contenants identiques de plusieurs objets.
 *   ★   : nA contenants de a objets + c objets à l'unité → total
 *   ★★  : nA × a + nB × b → total
 *   ★★★ : nA × a + nB × b, puis on en distribue d → reste
 * Jour 2 : on cherche le nombre de contenants (groupement), leur contenu (partage)
 * ou la quantité distribuée.
 *
 * Mots attendus : lieu, obj, contA, contB, action (« la bibliothécaire reçoit »),
 * action2 (« Elle reçoit aussi »), vrac (« à l'unité »), retrait (« Elle en prête »),
 * retraitSans (« Elle en prête une partie »), dest (« aux classes »), qd (question sur d), ld (libellé de d).
 */
import type { Monde, Relation, Schema, Structure, VarDef } from "../../core/types";
import { partDe } from "./outils";

const n: VarDef = { grandeur: "compte" };
const prod = (c: string, a: string, b: string): Relation => ({ type: "mul", c, a, b, noms: { c: "Réitération", a: "Partage", b: "Groupement" } });
const union = (c: string, a: string, b: string): Relation => ({ type: "add", c, a, b, noms: { c: "Union", a: "Différence", b: "Différence" } });

export const lots: Schema = {
  id: "lots",
  titre: "Lots et multiplication",
  notion: "multiplication",
  roles: ["lieu", "obj", "contA", "contB", "action", "action2", "vrac", "retrait", "retraitSans", "dest", "qd", "ld"],

  structure(niveau): Structure {
    if (niveau === 1) {
      return {
        variables: { nA: n, a: n, prodA: n, c: n, total: n },
        relations: [prod("prodA", "a", "nA"), union("total", "prodA", "c")],
        tirage: [{ v: "nA", plage: { min: 3, max: 9 } }, { v: "a", plage: { min: 4, max: 12 } }, { v: "c", plage: { min: 2, max: 15 } }],
        j1: { inconnue: "total", donnees: ["nA", "a", "c"] },
        j2: [
          { inconnue: "nA", donnees: ["a", "c", "total"] },
          { inconnue: "c", donnees: ["nA", "a", "total"] },
        ],
        contraintes: (w) => (w.c.cmp(w.a) >= 0 ? "le vrac dépasse un contenant" : null),
      };
    }
    const base = {
      nA: n, a: n, prodA: n, nB: n, b: n, prodB: n, total: n,
    } as Record<string, VarDef>;
    const rel = [prod("prodA", "a", "nA"), prod("prodB", "b", "nB"), union("total", "prodA", "prodB")];
    const pl = niveau === 2
      ? { nA: { min: 4, max: 15 }, a: { min: 10, max: 30 }, nB: { min: 3, max: 12 }, b: { min: 5, max: 25 } }
      : { nA: { min: 12, max: 45 }, a: { min: 12, max: 50 }, nB: { min: 8, max: 35 }, b: { min: 6, max: 40 } };
    const tirage: Structure["tirage"] = [
      { v: "nA", plage: pl.nA }, { v: "a", plage: pl.a }, { v: "nB", plage: pl.nB }, { v: "b", plage: pl.b },
    ];
    const ctr = (w: Monde) => (w.a.eq(w.b) ? "contenants identiques" : w.nA.eq(w.nB) ? "nombres de contenants identiques" : null);
    if (niveau === 2) {
      return {
        variables: base, relations: rel, tirage,
        j1: { inconnue: "total", donnees: ["nA", "a", "nB", "b"] },
        j2: [
          { inconnue: "nB", donnees: ["nA", "a", "b", "total"] },
          { inconnue: "a", donnees: ["nA", "nB", "b", "total"] },
        ],
        contraintes: (w) => ctr(w),
      };
    }
    return {
      variables: { ...base, d: n, reste: n },
      relations: [...rel, { type: "add", c: "total", a: "reste", b: "d", noms: { c: "Recherche de l'état initial", a: "Retrait", b: "Différence" } }],
      tirage: [...tirage, { v: "d", f: (w, { rng }) => partDe(w.total, rng, 0.3, 0.8) }],
      j1: { inconnue: "reste", donnees: ["nA", "a", "nB", "b", "d"] },
      j2: [
        { inconnue: "nB", donnees: ["nA", "a", "b", "d", "reste"] },
        { inconnue: "d", donnees: ["nA", "a", "nB", "b", "reste"] },
      ],
      contraintes: (w) => ctr(w),
    };
  },

  textes: {
    phrases: [
      [
        { vars: ["nA", "a"], t: "[lieu], [action] {nA} [contA:nA] de {a} [obj:a]." },
        { vars: ["a"], t: "[lieu], [action] des [contA:pl] de {a} [obj:a]." },
        { vars: ["nA"], t: "[lieu], [action] {nA} [contA:nA], qui contiennent [tous:contA] le même nombre de [obj:pl]." },
      ],
      [
        { vars: ["c"], t: "Il y a aussi {c} [obj:c] [vrac]." },
        { vars: ["nB", "b"], t: "[action2] {nB} [contB:nB] de {b} [obj:b]." },
        { vars: ["b"], t: "[action2] des [contB:pl] de {b} [obj:b]." },
      ],
      [
        { vars: ["d"], t: "[retrait] {d} [dest]." },
        { vars: ["reste"], niveaux: [3], t: "[retraitSans] [dest]." },
      ],
      [
        { vars: ["total"], t: "En tout, il y a {total} [obj:total]." },
        { vars: ["reste"], t: "Après cela, il reste {reste} [obj:reste]." },
      ],
    ],
    questions: {
      total: "Combien de [obj:pl] y a-t-il en tout ?",
      reste: "Combien de [obj:pl] reste-t-il ?",
      nA: "Combien y a-t-il de [contA:pl] ?",
      nB: "Combien y a-t-il de [contB:pl] ?",
      a: "Combien de [obj:pl] y a-t-il dans chaque [contA] ?",
      c: "Combien y a-t-il de [obj:pl] [vrac] ?",
      d: "[qd]",
    },
    guidees: {
      prodA: "Combien de [obj:pl] y a-t-il dans les [contA:pl] ?",
    },
    libelles: {
      prodA: "[obj:pl] dans les [contA:pl]",
      prodB: "[obj:pl] dans les [contB:pl]",
      total: "[obj:pl] en tout",
      reste: "[obj:pl] qui restent",
      nA: "nombre de [contA:pl]",
      nB: "nombre de [contB:pl]",
      a: "[obj:pl] dans chaque [contA]",
      c: "[obj:pl] [vrac]",
      d: "[ld]",
    },
    reponses: {
      total: "Il y a {total} [obj:total] en tout.",
      reste: "Il reste {reste} [obj:reste].",
      nA: "Il y a {nA} [contA:nA].",
      nB: "Il y a {nB} [contB:nB].",
      a: "Il y a {a} [obj:a] dans chaque [contA].",
      c: "Il y a {c} [obj:c] [vrac].",
      d: "[retrait] {d} [dest].",
    },
  },
};
