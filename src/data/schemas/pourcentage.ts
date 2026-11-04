/**
 * Schéma « pourcentages simples » (soldes) : 10 %, 20 %, 25 %, 50 % d'un prix.
 * Habillage « achat-unite » : lieu, artA, artB.
 *   ★ : remise sur un article  ★★ : deux articles, remise sur le total  ★★★ : puis comparaison avec un autre magasin.
 * Jour 2 : retrouver le prix de départ à partir du montant de la remise.
 */
import { Q } from "../../core/rational";
import type { Relation, Schema, Structure } from "../../core/types";
import { constante, E, ecart, prod, retrait, union } from "./outils";

export const pourcentage: Schema = {
  id: "pourcentage", herite: "achat-unite",
  titre: "Pourcentages simples", notion: "pourcentages",
  roles: ["lieu", "artA", "artB"],
  structure(niveau): Structure {
    const v: Structure["variables"] = { prix: E, cent: constante(100), un: E, p: { grandeur: "pourcent" }, rem: E, final: E };
    const r: Relation[] = [
      prod("prix", "un", "cent", { a: "Pourcentage" }), prod("rem", "un", "p", { c: "Pourcentage", a: "Partage", b: "Pourcentage" }), retrait("prix", "final", "rem"),
    ];
    const tirage: Structure["tirage"] = [];
    let base = ["prix", "p"];
    if (niveau >= 2) {
      v.pA = E; v.pB = E;
      r.push(union("prix", "pA", "pB"));
      tirage.push({ v: "pA", cle: "pu", plage: { min: 8, max: 60 } }, { v: "pB", cle: niveau === 3 ? "puB" : "prixB", plage: { min: 5, max: 40 } });
      base = ["pA", "pB", "p"];
    } else tirage.push({ v: "prix", cle: "prixB", plage: { min: 10, max: 80, pas: 5 } });
    tirage.push({ v: "p", f: (w, { rng }) => Q.of(rng.pick(niveau === 1 ? [10, 50] : [10, 20, 25, 50])) });
    let fin = "final";
    if (niveau === 3) {
      v.autre = E; v.eco = E;
      r.push(ecart("autre", "final", "eco"));
      tirage.push({ v: "autre", f: (w, { rng }) => w.final.add(Q.from(rng.int(1, 12) * 0.5)) });
      base.push("autre"); fin = "eco";
    }
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: fin, donnees: base },
      j2: [niveau === 1 ? { inconnue: "prix", donnees: ["p", "rem"] } : { inconnue: "pB", donnees: ["pA", "p", "rem"] }],
      contraintes: (w) => (w.rem.decimales > 2 || w.final.decimales > 2 ? "centimes" : null),
    };
  },
  textes: {
    phrases: [
      [{ t: "[lieu], c'est la période des soldes." }],
      [
        { vars: ["pA", "pB"], t: "[prenom] choisit [un:artA] [artA] à {pA} et [un:artB] [artB] à {pB}." },
        { vars: ["pA"], t: "[prenom] choisit [un:artA] [artA] à {pA} et [un:artB] [artB]." },
        { vars: ["prix"], t: "[prenom] choisit [un:artA] [artA] qui coûte {prix}." },
        { t: "[prenom] choisit [un:artA] [artA]." },
      ],
      [{ vars: ["p"], t: "Le magasin fait une remise de {p} sur le prix." }],
      [{ vars: ["rem"], t: "La remise est de {rem}." }],
      [{ vars: ["autre"], t: "Dans un autre magasin, les mêmes articles coûtent {autre} en tout, sans remise." }],
    ],
    questions: {
      final: "Combien [prenom] va-t-[il:prenom] payer après la remise ?",
      eco: "Combien [prenom] économise-t-[il:prenom] en achetant dans le premier magasin ?",
      prix: "Quel était le prix de départ ?",
      pB: "Combien coûtait [le:artB] [artB] avant la remise ?",
    },
    guidees: { un: "Combien font 1 % du prix ?", rem: "Quel est le montant de la remise ?" },
    libelles: { un: "1 % du prix", rem: "montant de la remise", final: "prix après remise", prix: "prix avant remise", eco: "économie" },
    reponses: { final: "[prenom] va payer {final}.", eco: "[prenom] économise {eco}.", prix: "Le prix de départ était {prix}.", pB: "[le:artB] [artB] coûtait {pB}." },
  },
};
