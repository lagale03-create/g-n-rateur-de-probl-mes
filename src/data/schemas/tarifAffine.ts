/**
 * Schéma « tarif avec abonnement » (situation non proportionnelle) et comparaison avec un tarif simple.
 *   ★ : coût = frais fixes + n × prix  ★★ : comparaison avec l'offre sans abonnement  ★★★ : idem, prix décimaux.
 * Jour 2 : retrouver le nombre de séances (groupement) ou les frais fixes.
 * Habillage : facette « tarif » (lieu, qui, seance, fixe, offreB) et plages.
 */
import type { Relation, Schema, Structure } from "../../core/types";
import { E, ecart, N, prod, union } from "./outils";

export const tarifAffine: Schema = {
  id: "tarif-affine",
  herite: "tarif",
  titre: "Tarifs : proportionnels ou non",
  notion: "situations proportionnelles ou non",
  roles: ["lieu", "qui", "seance", "fixe"],

  structure(niveau): Structure {
    const v: Structure["variables"] = { fixe: E, pu: E, n: N, var: E, coutA: E };
    const r: Relation[] = [prod("var", "pu", "n"), union("coutA", "fixe", "var")];
    const tirage: Structure["tirage"] = [
      { v: "fixe", plage: { min: 10, max: 40, pas: 5 } },
      { v: "pu", plage: niveau === 3 ? { min: 2, max: 8, pas: 0.5 } : { min: 2, max: 8 } },
      { v: "n", plage: niveau === 1 ? { min: 3, max: 10 } : { min: 6, max: 20 } },
    ];
    let j1 = "coutA";
    const base = ["fixe", "pu", "n"];
    if (niveau >= 2) {
      v.puB = E; v.coutB = E; v.eco = E;
      r.push(prod("coutB", "puB", "n"));
      // l'offre avec abonnement est la moins chère : coutB = coutA + eco
      r.push(ecart("coutB", "coutA", "eco"));
      tirage.push({ v: "puB", f: (w, { rng }) => w.pu.add(niveau === 3 ? rng.int(2, 8) * 0.5 : rng.int(1, 4)) });
      base.push("puB");
      j1 = "eco";
    }
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: j1, donnees: base },
      j2: [
        ...(niveau < 3 ? [{ inconnue: "n", donnees: ["fixe", "pu", "coutA"] }] : []),
        { inconnue: "fixe", donnees: ["pu", "n", "coutA"] },
      ],
      contraintes: (w) => (w.eco && w.eco.cmp(0) <= 0 ? "l'abonnement n'est pas avantageux" : null),
    };
  },

  textes: {
    phrases: [
      [
        { vars: ["fixe", "pu"], t: "[lieu], avec l'abonnement, on paie {fixe} [fixe], puis {pu} par [seance]." },
        { vars: ["pu"], t: "[lieu], avec l'abonnement, on paie des frais [fixe], puis {pu} par [seance]." },
        { vars: ["fixe"], t: "[lieu], avec l'abonnement, on paie {fixe} [fixe], puis un prix fixe par [seance]." },
      ],
      [{ vars: ["puB"], t: "Sans abonnement, on paie {puB} par [seance]." }],
      [
        { vars: ["n", "coutA"], t: "Avec l'abonnement, [qui] a payé {coutA} pour {n} [seance:n]." },
        { vars: ["coutA"], t: "Avec l'abonnement, [qui] a payé {coutA} en tout." },
        { vars: ["n"], t: "[qui] prévoit {n} [seance:n]." },
      ],
    ],
    questions: {
      coutA: "Combien [qui] va-t-[il:qui] payer avec l'abonnement ?",
      eco: "Combien [qui] économise-t-[il:qui] en prenant l'abonnement ?",
      n: "Combien de [seance:pl] [qui] a-t-[il:qui] payées ?",
      fixe: "Combien coûtent les frais [fixe] ?",
    },
    guidees: { var: "Combien coûtent les {n} [seance:n], sans les frais ?" },
    libelles: { var: "prix des [seance:pl] sans les frais", coutA: "prix avec l'abonnement", coutB: "prix sans abonnement", eco: "économie", n: "nombre de [seance:pl]", fixe: "frais [fixe]" },
    reponses: {
      coutA: "[qui] va payer {coutA} avec l'abonnement.", eco: "[qui] économise {eco} avec l'abonnement.",
      n: "[qui] a payé {n} [seance:n].", fixe: "Les frais [fixe] coûtent {fixe}.",
    },
  },
};
