/**
 * Schéma « liste de courses » (décimaux et monnaie) : additions et soustractions de prix.
 * Réutilise l'habillage « achat-unite » du contexte (lieu, artA, artB, plages de prix).
 *   ★ : artA + artB, monnaie rendue  ★★ : nA × artA + artB, monnaie  ★★★ : … moins un bon de réduction
 * Jour 2 : retrouver le prix d'un article, ou le billet donné.
 */
import type { Schema, Structure } from "../../core/types";
import { billet, E, N, prod, retrait, union } from "./outils";

export const listeCourses: Schema = {
  id: "liste-courses",
  herite: "achat-unite",
  titre: "Liste de courses et monnaie",
  notion: "décimaux et monnaie",
  roles: ["lieu", "artA", "artB"],

  structure(niveau): Structure {
    const v = { pA: E, pB: E, total: E, somme: E, rendu: E } as Structure["variables"];
    const r = [retrait("somme", "rendu", "total")];
    const tirage: Structure["tirage"] = [
      { v: "pA", cle: "pu", plage: niveau === 1 ? { min: 1, max: 9, pas: 0.5 } : { min: 1, max: 6, pas: 0.05 } },
      { v: "pB", cle: niveau === 3 ? "puB" : "prixB", plage: niveau === 1 ? { min: 2, max: 12, pas: 0.5 } : { min: 4, max: 15, pas: 0.05 } },
    ];
    const A = niveau === 1 ? "pA" : "prixA";
    if (niveau >= 2) { v.nA = N; v.prixA = E; r.push(prod("prixA", "pA", "nA")); tirage.push({ v: "nA", plage: { min: 2, max: 6 } }); }
    if (niveau === 3) {
      v.brut = E; v.bon = E;
      r.push(union("brut", A, "pB"), retrait("brut", "total", "bon"));
      tirage.push({ v: "bon", plage: { min: 1, max: 5, pas: 0.5 } });
    } else r.push(union("total", A, "pB"));
    tirage.push({ v: "somme", f: (w, { rng }) => billet(w.total, rng) });
    const base = [...(niveau >= 2 ? ["nA"] : []), "pA", "pB", ...(niveau === 3 ? ["bon"] : [])];
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: "rendu", donnees: [...base, "somme"] },
      j2: [
        { inconnue: "pB", donnees: [...base.filter((x) => x !== "pB"), "somme", "rendu"] },
        { inconnue: "somme", donnees: [...base, "rendu"] },
      ],
      contraintes: (w) => (w.somme.cmp(200) > 0 ? "somme trop grande" : niveau === 3 && w.bon.cmp(w.brut.div(3)) > 0 ? "bon trop gros" : null),
    };
  },

  textes: {
    phrases: [
      [
        { vars: ["nA", "pA", "pB"], t: "[lieu], [prenom] achète {nA} [artA:nA] à {pA} pièce et [un:artB] [artB] à {pB}." },
        { vars: ["nA", "pA"], t: "[lieu], [prenom] achète {nA} [artA:nA] à {pA} pièce et [un:artB] [artB]." },
        { vars: ["pA", "pB"], t: "[lieu], [prenom] achète [un:artA] [artA] à {pA} et [un:artB] [artB] à {pB}." },
        { vars: ["pA"], t: "[lieu], [prenom] achète [un:artA] [artA] à {pA} et [un:artB] [artB]." },
      ],
      [{ vars: ["bon"], t: "[il:prenom] a un bon de réduction de {bon} sur le total." }],
      [
        { vars: ["somme", "rendu"], t: "[il:prenom] paie avec un billet de {somme} et on lui rend {rendu}." },
        { vars: ["somme"], t: "[il:prenom] paie avec un billet de {somme}." },
        { vars: ["rendu"], t: "[il:prenom] paie avec un seul billet et on lui rend {rendu}." },
      ],
    ],
    questions: {
      rendu: "Combien d'argent doit-on rendre à [prenom] ?",
      pB: "Combien coûte [le:artB] [artB] ?",
      somme: "Quel billet [prenom] a-t-[il:prenom] donné ?",
    },
    guidees: { total: "Combien coûtent les deux articles ensemble ?" },
    libelles: {
      prixA: "prix des {nA} [artA:nA]", total: "prix à payer", brut: "prix avant réduction",
      rendu: "monnaie rendue", somme: "billet donné", pB: "prix [dun:artB] [artB]",
    },
    reponses: {
      rendu: "On doit rendre {rendu} à [prenom].",
      pB: "[le:artB] [artB] coûte {pB}.",
      somme: "[prenom] a donné un billet de {somme}.",
    },
  },
};
