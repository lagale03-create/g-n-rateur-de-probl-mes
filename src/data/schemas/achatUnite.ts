/**
 * Schéma « achat et passage à l'unité » (proportionnalité).
 *   n1 articles coûtent prix1 → prix d'un article (passage à l'unité) → prix de n2 articles.
 *   ★★ : on ajoute un autre article et on calcule la monnaie rendue.
 *   ★★★ : plusieurs exemplaires de l'autre article, prix décimaux au centime.
 * Jour 2 : on cherche le nombre d'articles (groupement), le billet donné (état initial)
 * ou le prix de l'autre article.
 */
import type { Relation, Schema, Structure, VarDef } from "../../core/types";
import { billet } from "./outils";

const e: VarDef = { grandeur: "euro" };
const n: VarDef = { grandeur: "compte" };
const unite = { c: "Réitération", a: "Passage à l'unité", b: "Groupement" } as const;

const R = {
  prix1: { type: "mul", c: "prix1", a: "pu", b: "n1", noms: unite } as Relation,
  prix2: { type: "mul", c: "prix2", a: "pu", b: "n2", noms: unite } as Relation,
  total: { type: "add", c: "total", a: "prix2", b: "prixB" } as Relation,
  somme: { type: "add", c: "somme", a: "total", b: "rendu",
    noms: { c: "Recherche de l'état initial", a: "Différence", b: "Différence" } } as Relation,
  prixB: { type: "mul", c: "prixB", a: "puB", b: "nB" } as Relation,
};

export const achatUnite: Schema = {
  id: "achat-unite",
  titre: "Achats et passage à l'unité",
  notion: "proportionnalité : passage à l'unité",
  roles: ["lieu", "artA", "artB"],

  structure(niveau): Structure {
    if (niveau === 1) {
      return {
        variables: { pu: e, n1: n, prix1: e, n2: n, prix2: e },
        relations: [R.prix1, R.prix2],
        tirage: [
          { v: "pu", plage: { min: 1, max: 5 } },
          { v: "n1", plage: { min: 2, max: 6 } },
          { v: "n2", plage: { min: 2, max: 10 } },
        ],
        j1: { inconnue: "prix2", donnees: ["prix1", "n1", "n2"] },
        j2: [
          { inconnue: "n2", donnees: ["prix1", "n1", "prix2"] },
          { inconnue: "n1", donnees: ["prix1", "n2", "prix2"] },
        ],
        contraintes: (w) => (w.n1.eq(w.n2) ? "n1 = n2" : w.prix2.cmp(50) > 0 ? "prix trop élevé pour ★" : null),
      };
    }
    const variables: Record<string, VarDef> = { pu: e, n1: n, prix1: e, n2: n, prix2: e, prixB: e, total: e, somme: e, rendu: e };
    const relations: Relation[] = [R.prix1, R.prix2, R.total, R.somme];
    if (niveau === 3) {
      variables.puB = e;
      variables.nB = n;
      relations.push(R.prixB);
    }
    const tirage = niveau === 2
      ? [
        { v: "pu", plage: { min: 1, max: 4, pas: 0.1 } },
        { v: "n1", plage: { min: 3, max: 8 } },
        { v: "n2", plage: { min: 4, max: 12 } },
        { v: "prixB", plage: { min: 3, max: 9, pas: 0.5 } },
      ]
      : [
        { v: "pu", plage: { min: 1, max: 4, pas: 0.05 } },
        { v: "n1", plage: { min: 3, max: 12 } },
        { v: "n2", plage: { min: 4, max: 15 } },
        { v: "puB", plage: { min: 1, max: 6, pas: 0.05 } },
        { v: "nB", plage: { min: 2, max: 6 } },
      ];
    const B = niveau === 2 ? ["prixB"] : ["puB", "nB"];
    return {
      variables,
      relations,
      tirage: [...tirage, { v: "somme", f: (w, { rng }) => billet(w.total, rng) }],
      j1: { inconnue: "rendu", donnees: ["prix1", "n1", "n2", ...B, "somme"] },
      j2: [
        { inconnue: "somme", donnees: ["prix1", "n1", "n2", ...B, "rendu"] },
        niveau === 2
          ? { inconnue: "prixB", donnees: ["prix1", "n1", "n2", "somme", "rendu"] }
          : { inconnue: "puB", donnees: ["prix1", "n1", "n2", "nB", "somme", "rendu"] },
      ],
      contraintes: (w) => {
        if (w.n1.eq(w.n2)) return "n1 = n2";
        if (w.somme.cmp(200) > 0) return "somme trop grande";
        if (niveau === 3 && w.pu.isInteger) return "★★★ : prix unitaire décimal attendu";
        if (niveau === 3 && w.nB.eq(w.n1)) return "nB = n1";
        return null;
      },
    };
  },

  textes: {
    phrases: [
      [{ vars: ["prix1", "n1"], t: "[lieu], {n1} [artA:n1] coûtent {prix1}." }],
      [
        { vars: ["n2", "nB", "puB"], niveaux: [3], t: "[prenom] achète {n2} [artA:n2] et {nB} [artB:nB] à {puB} pièce." },
        { vars: ["n2", "nB"], niveaux: [3], t: "[prenom] achète {n2} [artA:n2] et {nB} [artB:nB]. [tous:artB] les [artB:pl] ont le même prix." },
        { vars: ["n2", "prixB"], niveaux: [2], t: "[prenom] achète {n2} [artA:n2] et [un:artB] [artB] à {prixB}." },
        { vars: ["n2"], niveaux: [2], t: "[prenom] achète {n2} [artA:n2] et [un:artB] [artB]." },
        { vars: ["prix2", "n2"], niveaux: [1], t: "[lieu], [prenom] a payé {prix2} pour {n2} [artA:n2]." },
        { vars: ["n2"], niveaux: [1], t: "[prenom] achète {n2} [artA:n2]." },
        { vars: ["prix2"], niveaux: [1], t: "[prenom] a {prix2}. [il:prenom] dépense tout son argent pour acheter des [artA:pl]." },
      ],
      [
        { vars: ["somme", "rendu"], t: "[il:prenom] paie avec un billet de {somme} et on lui rend {rendu}." },
        { vars: ["somme"], t: "[il:prenom] paie avec un billet de {somme}." },
        { vars: ["rendu"], t: "[il:prenom] paie avec un seul billet et on lui rend {rendu}." },
      ],
    ],
    questions: {
      prix2: "Combien [prenom] va-t-[il:prenom] payer ?",
      n2: "Combien de [artA:pl] [prenom] peut-[il:prenom] acheter ?",
      n1: "Combien de [artA:pl] peut-on acheter avec {prix1} ?",
      rendu: "Combien d'argent doit-on rendre à [prenom] ?",
      somme: "Quel billet [prenom] a-t-[il:prenom] donné ?",
      prixB: "Combien coûte [le:artB] [artB] ?",
      puB: "Combien coûte [un:artB] [artB] ?",
    },
    guidees: {
      pu: "Combien coûte [un:artA] [artA] ?",
    },
    libelles: {
      pu: "prix [dun:artA] [artA]",
      prix1: "prix de {n1} [artA:n1]",
      prix2: "prix des {n2} [artA:n2]",
      n1: "nombre de [artA:pl] pour {prix1}",
      n2: "nombre de [artA:pl]",
      prixB: [{ niveaux: [3], t: "prix des {nB} [artB:nB]" }, { t: "prix [dun:artB] [artB]" }],
      puB: "prix [dun:artB] [artB]",
      total: "prix total des achats",
      somme: "billet donné",
      rendu: "monnaie rendue",
    },
    reponses: {
      prix2: "[prenom] va payer {prix2}.",
      n2: "[prenom] peut acheter {n2} [artA:n2].",
      n1: "Avec {prix1}, on peut acheter {n1} [artA:n1].",
      rendu: "On doit rendre {rendu} à [prenom].",
      somme: "[prenom] a donné un billet de {somme}.",
      prixB: "[le:artB] [artB] coûte {prixB}.",
      puB: "[un:artB] [artB] coûte {puB}.",
    },
  },
};
