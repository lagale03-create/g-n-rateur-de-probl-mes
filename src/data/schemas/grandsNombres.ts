/**
 * Schéma « grands nombres » : totaux sur plusieurs périodes et comparaison de deux lieux.
 *   ★   : site 1 = A + B ; écart avec le site 2 (C)
 *   ★★  : site 1 = A + B + D ; écart avec le site 2 (C)
 *   ★★★ : site 1 = A + B ; site 2 = C + D ; écart
 * Jour 2 : on cherche l'une des quantités à partir de l'écart.
 *
 * Mots attendus : site1, site2 (avec leur genre), obj, verbe (« a accueilli »),
 * pp (participe accordé : « accueillis »), per1, per2, per3 (« en juillet »…),
 * periode (« sur ces deux mois ») et periode3 (« sur ces trois mois »).
 */
import type { Relation, Schema, Structure, VarDef } from "../../core/types";
import { partDe } from "./outils";

const n: VarDef = { grandeur: "compte" };
const union = (c: string, a: string, b: string): Relation => ({ type: "add", c, a, b, noms: { c: "Union", a: "Différence", b: "Différence" } });
const cmp = (grand: string, petit: string, ecart: string): Relation =>
  ({ type: "add", c: grand, a: petit, b: ecart, noms: { c: "Comparaison", a: "Comparaison", b: "Comparaison" } });

export const grandsNombres: Schema = {
  id: "grands-nombres",
  titre: "Grands nombres : totaux et écarts",
  notion: "grands nombres",
  roles: ["site1", "site2", "obj", "verbe", "pp", "per1", "per2", "per3", "periode", "periode3"],

  structure(niveau): Structure {
    const pl = niveau === 1 ? { min: 1200, max: 9800, pas: 1 } : niveau === 2 ? { min: 12000, max: 98000 } : { min: 120000, max: 980000 };
    if (niveau === 1) {
      return {
        variables: { A: n, B: n, T1: n, C: n, ecart: n },
        relations: [union("T1", "A", "B"), cmp("T1", "C", "ecart")],
        tirage: [{ v: "A", plage: pl }, { v: "B", plage: pl }, { v: "C", f: (w, { rng }) => partDe(w.T1, rng, 0.5, 0.9) }],
        j1: { inconnue: "ecart", donnees: ["A", "B", "C"] },
        j2: [
          { inconnue: "B", donnees: ["A", "C", "ecart"] },
          { inconnue: "C", donnees: ["A", "B", "ecart"] },
        ],
        contraintes: (w) => (w.ecart.cmp(w.T1.div(20)) < 0 ? "écart trop petit ou négatif" : null),
      };
    }
    if (niveau === 2) {
      return {
        variables: { A: n, B: n, D: n, T1: n, T2: n, C: n, ecart: n },
        relations: [union("T1", "A", "B"), union("T2", "T1", "D"), cmp("T2", "C", "ecart")],
        tirage: [{ v: "A", plage: pl }, { v: "B", plage: pl }, { v: "D", plage: pl }, { v: "C", f: (w, { rng }) => partDe(w.T2, rng, 0.55, 0.9) }],
        j1: { inconnue: "ecart", donnees: ["A", "B", "D", "C"] },
        j2: [
          { inconnue: "D", donnees: ["A", "B", "C", "ecart"] },
          { inconnue: "C", donnees: ["A", "B", "D", "ecart"] },
        ],
        contraintes: (w) => (w.ecart.cmp(w.T2.div(20)) < 0 ? "écart trop petit ou négatif" : null),
      };
    }
    return {
      variables: { A: n, B: n, T1: n, C: n, D: n, T2: n, ecart: n },
      relations: [union("T1", "A", "B"), union("T2", "C", "D"), cmp("T1", "T2", "ecart")],
      tirage: [{ v: "A", plage: pl }, { v: "B", plage: pl }, { v: "C", plage: pl }, { v: "D", plage: pl }],
      j1: { inconnue: "ecart", donnees: ["A", "B", "C", "D"] },
      j2: [
        { inconnue: "D", donnees: ["A", "B", "C", "ecart"] },
        { inconnue: "A", donnees: ["B", "C", "D", "ecart"] },
      ],
      contraintes: (w) => (w.ecart.cmp(w.T1.div(30)) < 0 ? "écart trop petit ou négatif" : null),
    };
  },

  textes: {
    phrases: [
      [
        { vars: ["A", "B"], t: "[site1] [verbe] {A} [obj:A] [per1] et {B} [obj:B] [per2]." },
        { vars: ["A"], t: "[site1] [verbe] {A} [obj:A] [per1]." },
        { vars: ["B"], t: "[site1] [verbe] {B} [obj:B] [per2]." },
      ],
      [{ vars: ["D"], niveaux: [2], t: "[per3], [il:site1] en [verbe] {D}." }],
      [
        { vars: ["C", "D"], niveaux: [3], t: "[site2] en [verbe] {C} [per1] et {D} [per2]." },
        { vars: ["C"], niveaux: [3], t: "[site2] en [verbe] {C} [per1]." },
        { vars: ["D"], niveaux: [3], t: "[site2] en [verbe] {D} [per2]." },
        { vars: ["C"], niveaux: [1, 2], t: "Pendant la même période, [site2] en [verbe] {C}." },
      ],
      [
        { vars: ["ecart"], niveaux: [2], t: "[periode3], [site1] en [verbe] {ecart} de plus que [site2]." },
        { vars: ["ecart"], t: "[periode], [site1] en [verbe] {ecart} de plus que [site2]." },
      ],
    ],
    questions: {
      ecart: [
        { niveaux: [2], t: "[periode3], combien de [obj:pl] [site1] a-t-[il:site1] [pp] de plus que [site2] ?" },
        { t: "[periode], combien de [obj:pl] [site1] a-t-[il:site1] [pp] de plus que [site2] ?" },
      ],
      A: "Combien de [obj:pl] [site1] a-t-[il:site1] [pp] [per1] ?",
      B: "Combien de [obj:pl] [site1] a-t-[il:site1] [pp] [per2] ?",
      C: [
        { niveaux: [3], t: "Combien de [obj:pl] [site2] a-t-[il:site2] [pp] [per1] ?" },
        { niveaux: [2], t: "[periode3], combien de [obj:pl] [site2] a-t-[il:site2] [pp] ?" },
        { t: "[periode], combien de [obj:pl] [site2] a-t-[il:site2] [pp] ?" },
      ],
      D: [
        { niveaux: [2], t: "Combien de [obj:pl] [site1] a-t-[il:site1] [pp] [per3] ?" },
        { t: "Combien de [obj:pl] [site2] a-t-[il:site2] [pp] [per2] ?" },
      ],
    },
    guidees: {
      T1: "Combien de [obj:pl] [site1] a-t-[il:site1] [pp] en tout ?",
    },
    libelles: {
      T1: [{ niveaux: [2], t: "total pour [site1] [per1] et [per2]" }, { t: "total pour [site1]" }],
      T2: [{ niveaux: [2], t: "total pour [site1] sur les trois mois" }, { t: "total pour [site2]" }],
      ecart: "écart entre [site1] et [site2]",
      A: "[obj:pl] [per1]", B: "[obj:pl] [per2]",
      C: [{ niveaux: [3], t: "[obj:pl] [per1] pour [site2]" }, { t: "[obj:pl] pour [site2]" }],
      D: [{ niveaux: [2], t: "[obj:pl] [per3]" }, { t: "[obj:pl] [per2] pour [site2]" }],
    },
    reponses: {
      ecart: [
        { niveaux: [2], t: "[periode3], [site1] [verbe] {ecart} [obj:ecart] de plus que [site2]." },
        { t: "[periode], [site1] [verbe] {ecart} [obj:ecart] de plus que [site2]." },
      ],
      A: "[site1] [verbe] {A} [obj:A] [per1].",
      B: "[site1] [verbe] {B} [obj:B] [per2].",
      C: [{ niveaux: [3], t: "[site2] [verbe] {C} [obj:C] [per1]." }, { t: "[site2] [verbe] {C} [obj:C]." }],
      D: [{ niveaux: [2], t: "[per3], [site1] [verbe] {D} [obj:D]." }, { t: "[site2] [verbe] {D} [obj:D] [per2]." }],
    },
  },
};
