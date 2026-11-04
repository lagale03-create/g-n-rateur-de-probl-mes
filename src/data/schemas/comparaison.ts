/**
 * Schéma « comparaison » (« de plus », « de moins ») puis réunion.
 *   ★   : B a e1 de plus que A ; combien en tout ?
 *   ★★  : B a e1 de plus que A, C a e2 de moins que B ; combien en tout ?
 *   ★★★ : B a e1 de moins que A, C a e2 de plus que B ; combien en tout ?
 * Jour 2 : on cherche un écart (« combien de plus ? »), à partir du total.
 *
 * Mots attendus : lieu, obj, verbe (« a ramassé » / « ont ramassé »), pp (participe accordé
 * avec obj au pluriel : « ramassées »). Les prénoms sont fournis par le moteur.
 */
import type { Relation, Schema, Structure, VarDef } from "../../core/types";

const n: VarDef = { grandeur: "compte" };
const cmp = (grand: string, petit: string, ecart: string): Relation =>
  ({ type: "add", c: grand, a: petit, b: ecart, noms: { c: "Comparaison", a: "Comparaison", b: "Comparaison" } });
const union = (c: string, a: string, b: string): Relation => ({ type: "add", c, a, b, noms: { c: "Union", a: "Différence", b: "Différence" } });

export const comparaison: Schema = {
  id: "comparaison",
  titre: "Comparaison : de plus, de moins",
  notion: "structures additives",
  roles: ["lieu", "obj", "verbe", "pp"],

  structure(niveau): Structure {
    if (niveau === 1) {
      return {
        variables: { A: n, e1: n, B: n, total: n },
        relations: [cmp("B", "A", "e1"), union("total", "A", "B")],
        tirage: [{ v: "A", plage: { min: 12, max: 60 } }, { v: "e1", plage: { min: 3, max: 25 } }],
        j1: { inconnue: "total", donnees: ["A", "e1"] },
        j2: [{ inconnue: "e1", donnees: ["A", "total"] }],
      };
    }
    // ★★ : B = A + e1, C = B − e2   ★★★ : B = A − e1, C = B + e2
    const rel = niveau === 2
      ? [cmp("B", "A", "e1"), cmp("B", "C", "e2")]
      : [cmp("A", "B", "e1"), cmp("C", "B", "e2")];
    const pl = niveau === 2
      ? { A: { min: 40, max: 250 }, e1: { min: 8, max: 60 }, e2: { min: 8, max: 60 } }
      : { A: { min: 300, max: 2500 }, e1: { min: 25, max: 400 }, e2: { min: 25, max: 400 } };
    return {
      variables: { A: n, e1: n, B: n, e2: n, C: n, AB: n, total: n },
      relations: [...rel, union("AB", "A", "B"), union("total", "AB", "C")],
      tirage: [{ v: "A", plage: pl.A }, { v: "e1", plage: pl.e1 }, { v: "e2", plage: pl.e2 }],
      j1: { inconnue: "total", donnees: ["A", "e1", "e2"] },
      j2: [
        { inconnue: "e2", donnees: ["A", "e1", "total"] },
        { inconnue: "e1", donnees: ["A", "C", "total"] },
      ],
      contraintes: (w) => (w.e1.eq(w.e2) ? "écarts identiques" : w.C.cmp(5) < 0 || w.B.cmp(5) < 0 ? "quantité trop petite" : null),
    };
  },

  textes: {
    phrases: [
      [{ vars: ["A"], t: "[lieu], [prenom] [verbe] {A} [obj:A]." }],
      [
        { vars: ["e1"], niveaux: [1, 2], t: "[prenom2] en [verbe] {e1} de plus que [prenom]." },
        { vars: ["e1"], niveaux: [3], t: "[prenom2] en [verbe] {e1} de moins que [prenom]." },
      ],
      [
        { vars: ["e2"], niveaux: [2], t: "[prenom3] en [verbe] {e2} de moins que [prenom2]." },
        { vars: ["e2"], niveaux: [3], t: "[prenom3] en [verbe] {e2} de plus que [prenom2]." },
        { vars: ["C"], t: "[prenom3] en [verbe] {C}." },
      ],
      [
        { vars: ["total"], niveaux: [1], t: "Ensemble, les deux enfants en [verbe:pl] {total}." },
        { vars: ["total"], t: "Ensemble, les trois enfants en [verbe:pl] {total}." },
      ],
    ],
    questions: {
      total: [
        { niveaux: [1], t: "Combien de [obj:pl] les deux enfants ont-ils [pp] en tout ?" },
        { t: "Combien de [obj:pl] les trois enfants ont-ils [pp] en tout ?" },
      ],
      e1: [
        { niveaux: [1], t: "Combien de [obj:pl] [prenom2] a-t-[il:prenom2] [pp] de plus que [prenom] ?" },
        { niveaux: [2], t: "Combien de [obj:pl] [prenom2] a-t-[il:prenom2] [pp] de plus que [prenom] ?" },
        { t: "Combien de [obj:pl] [prenom2] a-t-[il:prenom2] [pp] de moins que [prenom] ?" },
      ],
      e2: [
        { niveaux: [2], t: "Combien de [obj:pl] [prenom3] a-t-[il:prenom3] [pp] de moins que [prenom2] ?" },
        { t: "Combien de [obj:pl] [prenom3] a-t-[il:prenom3] [pp] de plus que [prenom2] ?" },
      ],
    },
    guidees: {
      B: "Combien de [obj:pl] [prenom2] a-t-[il:prenom2] [pp] ?",
    },
    libelles: {
      A: "[obj:pl] [de:prenom]",
      B: "[obj:pl] [de:prenom2]",
      C: "[obj:pl] [de:prenom3]",
      AB: "[obj:pl] [de:prenom] et [de:prenom2]",
      total: [{ niveaux: [1], t: "[obj:pl] des deux enfants" }, { t: "[obj:pl] des trois enfants" }],
      e1: "écart entre [prenom] et [prenom2]",
      e2: "écart entre [prenom2] et [prenom3]",
    },
    reponses: {
      total: [
        { niveaux: [1], t: "Ensemble, les deux enfants [verbe:pl] {total} [obj:total]." },
        { t: "Ensemble, les trois enfants [verbe:pl] {total} [obj:total]." },
      ],
      e1: [
        { niveaux: [1, 2], t: "[prenom2] en [verbe] {e1} de plus que [prenom]." },
        { t: "[prenom2] en [verbe] {e1} de moins que [prenom]." },
      ],
      e2: [
        { niveaux: [2], t: "[prenom3] en [verbe] {e2} de moins que [prenom2]." },
        { t: "[prenom3] en [verbe] {e2} de plus que [prenom2]." },
      ],
    },
  },
};
