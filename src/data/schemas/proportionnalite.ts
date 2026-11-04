/**
 * Proportionnalité (habillage « achat-unite » du contexte : lieu, artA, artB, plages de prix) :
 *  - « linearite-mult » : 3 articles coûtent 4,50 € ; 12 articles (4 fois plus) coûtent 4 fois plus ;
 *  - « linearite-add »  : 3 articles coûtent 4,50 €, 5 articles 7,50 € ; donc 8 articles coûtent…
 *  - « offre-lot »      : un lot de 3 à 4,20 € ou l'unité à 1,50 € : quelle offre choisir et combien économise-t-on ?
 */
import { Q } from "../../core/rational";
import type { Relation, Schema, Structure } from "../../core/types";
import { billet, E, ecart, N, prod, retrait, union } from "./outils";

const LM = { c: "Linéarité multiplicative", b: "Linéarité multiplicative", a: "Partage" } as const;

export const lineariteMult: Schema = {
  id: "linearite-mult",
  herite: "achat-unite",
  titre: "Linéarité multiplicative",
  notion: "linéarité multiplicative",
  roles: ["lieu", "artA", "artB"],

  structure(niveau): Structure {
    const v: Structure["variables"] = { pu: E, n1: N, prix1: E, k: N, n2: N, prix2: E };
    const r: Relation[] = [prod("prix1", "pu", "n1"), prod("n2", "n1", "k", { b: "Linéarité multiplicative" }), prod("prix2", "prix1", "k", LM)];
    const tirage: Structure["tirage"] = [
      { v: "pu", plage: niveau === 1 ? { min: 1, max: 5 } : { min: 0.8, max: 4, pas: niveau === 2 ? 0.1 : 0.05 } },
      { v: "n1", plage: { min: 2, max: 6 } },
      { v: "k", plage: niveau === 1 ? { min: 2, max: 4 } : { min: 3, max: 10 } },
    ];
    let j1 = "prix2";
    const base = ["prix1", "n1", "n2"];
    if (niveau >= 2) {
      v.prixB = E; v.total = E; v.somme = E; v.rendu = E;
      r.push(union("total", "prix2", "prixB"), retrait("somme", "rendu", "total"));
      tirage.push({ v: "prixB", plage: { min: 3, max: 12, pas: 0.5 } }, { v: "somme", f: (w, { rng }) => billet(w.total, rng) });
      base.push("prixB", "somme");
      j1 = "rendu";
    }
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: j1, donnees: base },
      j2: [{ inconnue: "prix1", donnees: [...base.filter((x) => x !== "prix1"), j1 === "rendu" ? "rendu" : "prix2"].filter((x) => !(j1 === "rendu" && x === "prix2")) }],
      contraintes: (w) => (w.somme && w.somme.cmp(200) > 0 ? "somme trop grande" : null),
    };
  },

  textes: {
    phrases: [
      [{ vars: ["prix1", "n1"], t: "[lieu], {n1} [artA:n1] coûtent {prix1}." }, { vars: ["n1"], t: "[lieu], tous les [artA:pl] ont le même prix." }],
      [
        { vars: ["n2", "prixB"], t: "[prenom] achète {n2} [artA:n2] et [un:artB] [artB] à {prixB}." },
        { vars: ["n2", "prix2"], t: "[prenom] paie {prix2} pour {n2} [artA:n2]." },
        { vars: ["n2"], t: "[prenom] achète {n2} [artA:n2]." },
      ],
      [{ vars: ["somme", "rendu"], t: "[il:prenom] paie avec un billet de {somme} et on lui rend {rendu}." }, { vars: ["somme"], t: "[il:prenom] paie avec un billet de {somme}." }],
    ],
    questions: {
      prix2: "Combien [prenom] va-t-[il:prenom] payer ?",
      rendu: "Combien d'argent doit-on rendre à [prenom] ?",
      prix1: [{ vars: ["n1"], t: "Combien coûtent {n1} [artA:n1] ?" }],
    },
    guidees: { k: "Combien de fois plus de [artA:pl] [prenom] achète-t-[il:prenom] ?" },
    libelles: { k: "nombre de fois plus", prix2: "prix des {n2} [artA:n2]", total: "prix total", rendu: "monnaie rendue", prix1: "prix de {n1} [artA:n1]", n2: "nombre de [artA:pl]" },
    reponses: { prix2: "[prenom] va payer {prix2}.", rendu: "On doit rendre {rendu} à [prenom].", prix1: "{n1} [artA:n1] coûtent {prix1}." },
  },
};

export const lineariteAdd: Schema = {
  id: "linearite-add",
  herite: "achat-unite",
  titre: "Linéarité additive",
  notion: "linéarité additive",
  roles: ["lieu", "artA"],

  structure(niveau): Structure {
    const LA = { c: "Linéarité additive", a: "Différence", b: "Différence" } as const;
    const NV = { grandeur: "compte", visible: true } as const;
    // les quantités sont citées dans l'énoncé, mais seuls les prix entrent dans le calcul
    const v: Structure["variables"] = { pu: E, n1: NV, prix1: E, n2: NV, prix2: E, n3: NV, prix3: E, somme: E, rendu: E };
    const r: Relation[] = [
      prod("prix1", "pu", "n1"), prod("prix2", "pu", "n2"),
      { type: "add", c: "n3", a: "n1", b: "n2", noms: LA }, { type: "add", c: "prix3", a: "prix1", b: "prix2", noms: LA },
    ];
    const tirage: Structure["tirage"] = [
      { v: "pu", plage: niveau === 1 ? { min: 1, max: 5 } : { min: 0.8, max: 4, pas: niveau === 2 ? 0.1 : 0.05 } },
      { v: "n1", plage: { min: 2, max: 7 } }, { v: "n2", plage: { min: 3, max: 9 } },
    ];
    let fin = "prix3";
    const base = ["prix1", "prix2"];
    if (niveau >= 2) {
      // ★★ : n4 = n3 + n1 (deux additions)   ★★★ : n4 = 2 × n3 (puis linéarité multiplicative)
      v.n4 = NV; v.prix4 = E;
      if (niveau === 2) r.push({ type: "add", c: "n4", a: "n3", b: "n1", noms: LA }, { type: "add", c: "prix4", a: "prix3", b: "prix1", noms: LA });
      else { v.deux = { grandeur: "facteur", valeur: 2 }; r.push(prod("n4", "n3", "deux", LM), prod("prix4", "prix3", "deux", LM)); }
      fin = "prix4";
    }
    // on paie ensuite avec un billet : monnaie rendue
    r.push(retrait("somme", "rendu", fin));
    tirage.push({ v: "somme", f: (w, { rng }) => billet(w[fin], rng) });
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: "rendu", donnees: [...base, "somme"] },
      j2: [{ inconnue: "prix2", donnees: ["prix1", "somme", "rendu"] }],
      contraintes: (w) => (w.n1.eq(w.n2) ? "quantités identiques" : w.somme.cmp(200) > 0 ? "somme trop grande" : null),
    };
  },

  textes: {
    phrases: [
      [{ vars: ["n1", "prix1"], t: "[lieu], {n1} [artA:n1] coûtent {prix1}." }],
      [{ vars: ["n2", "prix2"], t: "{n2} [artA:n2] coûtent {prix2}." }, { vars: ["n2"], t: "Le prix de {n2} [artA:n2] n'est pas affiché." }],
      [
        { vars: ["somme", "rendu"], niveaux: [1], t: "[prenom] achète {n3} [artA:n3]. [il:prenom] paie avec un billet de {somme} et on lui rend {rendu}." },
        { vars: ["somme", "rendu"], t: "[prenom] achète {n4} [artA:n4]. [il:prenom] paie avec un billet de {somme} et on lui rend {rendu}." },
        { vars: ["somme"], niveaux: [1], t: "[prenom] achète {n3} [artA:n3] et paie avec un billet de {somme}." },
        { vars: ["somme"], t: "[prenom] achète {n4} [artA:n4] et paie avec un billet de {somme}." },
      ],
    ],
    questions: {
      rendu: "Combien d'argent doit-on rendre à [prenom] ?",
      prix2: "Combien coûtent {n2} [artA:n2] ?",
    },
    guidees: { prix3: "Combien coûtent {n3} [artA:n3] ?" },
    libelles: { n3: "{n1} + {n2} [artA:pl]", prix3: "prix de {n3} [artA:n3]", prix4: "prix de {n4} [artA:n4]", n4: "nombre de [artA:pl]", prix2: "prix de {n2} [artA:n2]" },
    reponses: { rendu: "On doit rendre {rendu} à [prenom].", prix2: "{n2} [artA:n2] coûtent {prix2}." },
  },
};

export const offreLot: Schema = {
  id: "offre-lot",
  herite: "achat-unite",
  titre: "Comparaison d'offres : lot ou unité",
  notion: "comparaison d'offres",
  roles: ["lieu", "artA"],

  structure(niveau): Structure {
    const v: Structure["variables"] = { tl: N, pl: E, N: N, k: N, coutLot: E, pu: E, coutUnite: E, eco: E };
    const r: Relation[] = [
      prod("N", "tl", "k", { b: "Groupement" }), prod("coutLot", "pl", "k"), prod("coutUnite", "pu", "N"),
      ecart("coutUnite", "coutLot", "eco"),
    ];
    const tirage: Structure["tirage"] = [
      { v: "tl", plage: { min: 3, max: 6 } },
      { v: "pu", plage: niveau === 1 ? { min: 1, max: 5 } : { min: 0.8, max: 4, pas: 0.05 } },
      { v: "pl", f: (w, { rng }) => w.pu.mul(w.tl).sub(Q.from(niveau === 1 ? rng.int(1, 3) : rng.int(2, 12) * 0.1)).mul(20).floor().div(20) },
      { v: "k", plage: niveau === 1 ? { min: 2, max: 4 } : { min: 3, max: 8 } },
    ];
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: "eco", donnees: ["tl", "pl", "pu", "N"] },
      j2: [{ inconnue: "pl", donnees: ["tl", "pu", "N", "eco"] }],
      contraintes: (w) => (w.eco.cmp(0) <= 0 ? "le lot n'est pas avantageux" : w.pl.cmp(0) <= 0 ? "lot gratuit" : null),
    };
  },

  textes: {
    phrases: [
      [{ t: "[lieu], on peut acheter les [artA:pl] de deux façons." }],
      [{ vars: ["pu"], t: "À l'unité, [un:artA] [artA] coûte {pu}." }],
      [{ vars: ["tl", "pl"], t: "Par lot, un lot de {tl} [artA:tl] coûte {pl}." }, { vars: ["tl"], t: "On peut aussi acheter des lots de {tl} [artA:tl]." }],
      [{ vars: ["N"], t: "[prenom] veut acheter {N} [artA:N]." }],
      [{ vars: ["eco"], t: "En prenant des lots, [il:prenom] économise {eco}." }],
    ],
    questions: {
      eco: "Combien [prenom] économise-t-[il:prenom] en achetant des lots plutôt qu'à l'unité ?",
      pl: "Combien coûte un lot ?",
    },
    guidees: { k: "Combien de lots [prenom] doit-[il:prenom] acheter ?", coutLot: "Combien coûtent ces lots ?", coutUnite: "Combien paierait-[il:prenom] à l'unité ?" },
    libelles: { k: "nombre de lots", coutLot: "prix avec les lots", coutUnite: "prix à l'unité", eco: "économie", pl: "prix d'un lot" },
    reponses: { eco: "[prenom] économise {eco} avec les lots.", pl: "Un lot coûte {pl}." },
  },
};
