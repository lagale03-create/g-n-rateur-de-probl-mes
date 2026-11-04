/**
 * Schéma « consommation et stock » (problèmes à étapes mixtes, type « zoo »).
 *   Chaque A consomme une ration par jour (réitération), chaque B aussi,
 *   on réunit (union), on multiplie par le nombre de jours, on retire du stock.
 * Jour 2 : on cherche le stock de départ, le nombre de jours, ou une ration (partage).
 */
import { Q } from "../../core/rational";
import type { Relation, Schema, Structure, VarDef } from "../../core/types";
import { auDessus } from "./outils";

const q: VarDef = { grandeur: "quantite" };
const n: VarDef = { grandeur: "compte" };

const R = {
  consoA: { type: "mul", c: "consoA", a: "ration", b: "nA" } as Relation,
  consoB: { type: "mul", c: "consoB", a: "rationB", b: "nB" } as Relation,
  jour: { type: "add", c: "jour", a: "consoA", b: "consoB" } as Relation,
  stock: { type: "add", c: "stock", a: "besoin", b: "reste",
    noms: { c: "Recherche de l'état initial", a: "Différence", b: "Retrait" } } as Relation,
};

export const consommationStock: Schema = {
  id: "consommation-stock",
  titre: "Consommation et stock",
  notion: "problèmes à étapes mixtes",
  roles: ["lieu", "A", "B", "verbe", "ress", "resp", "reserve", "action", "tous", "quelle"],

  structure(niveau, cs): Structure {
    if (niveau === 1) {
      return {
        variables: { ration: q, nA: n, consoA: q, nb_jours: n, besoin: q, stock: q, reste: q },
        relations: [R.consoA, { type: "mul", c: "besoin", a: "consoA", b: "nb_jours" }, R.stock],
        tirage: [
          { v: "ration", plage: { min: 2, max: 9 } },
          { v: "nA", plage: { min: 2, max: 5 } },
          { v: "nb_jours", plage: { min: 2, max: 6 } },
          { v: "stock", f: (w, { rng }) => auDessus(w.besoin, 10, rng, 3) },
        ],
        j1: { inconnue: "reste", donnees: ["ration", "nA", "nb_jours", "stock"] },
        j2: [
          { inconnue: "stock", donnees: ["ration", "nA", "nb_jours", "reste"] },
          { inconnue: "nb_jours", donnees: ["ration", "nA", "stock", "reste"] },
          { inconnue: "ration", donnees: ["nA", "nb_jours", "stock", "reste"] },
        ],
        contraintes: (w) => (w.reste.cmp(w.besoin) >= 0 ? "reste trop grand" : w.ration.eq(w.nA) ? "ration = effectif" : null),
      };
    }

    const conv = niveau === 3 && !!cs.unites?.grande;
    const st = conv ? "stockG" : "stock";
    const variables: Record<string, VarDef> = {
      ration: q, nA: n, consoA: q, rationB: q, nB: n, consoB: q, jour: q,
      nb_jours: n, besoin: q, stock: q, reste: q,
    };
    const relations: Relation[] = [R.consoA, R.consoB, R.jour,
      { type: "mul", c: "besoin", a: "jour", b: "nb_jours" }, R.stock];
    if (conv) {
      variables.stockG = { grandeur: "quantiteGrande" };
      variables.facteur = { grandeur: "facteur" };
      relations.push({ type: "conv", c: "stock", a: "stockG", b: "facteur" });
    }
    const m = niveau === 3 ? (conv ? 100 : 10) : 50;
    return {
      variables,
      relations,
      tirage: niveau === 2
        ? [
          { v: "ration", plage: { min: 5, max: 30 } },
          { v: "nA", plage: { min: 3, max: 8 } },
          { v: "rationB", plage: { min: 3, max: 20 } },
          { v: "nB", plage: { min: 2, max: 8 } },
          { v: "nb_jours", plage: { min: 5, max: 15 } },
          { v: "stock", f: (w, { rng }) => auDessus(w.besoin, m, rng, 3) },
        ]
        : [
          { v: "ration", plage: { min: 2, max: 9, pas: 0.5 } },
          { v: "nA", plage: { min: 3, max: 12 } },
          { v: "rationB", plage: { min: 2, max: 9, pas: 0.5 } },
          { v: "nB", plage: { min: 2, max: 12 } },
          { v: "nb_jours", plage: { min: 7, max: 21 } },
          { v: "stock", f: (w, { rng }) => auDessus(w.besoin, m, rng, 3) },
        ],
      j1: { inconnue: "reste", donnees: ["ration", "nA", "rationB", "nB", "nb_jours", st] },
      j2: [
        { inconnue: "stock", donnees: ["ration", "nA", "rationB", "nB", "nb_jours", "reste"] },
        { inconnue: "rationB", donnees: ["ration", "nA", "nB", "nb_jours", st, "reste"] },
        ...(niveau === 2
          ? [{ inconnue: "nb_jours", donnees: ["ration", "nA", "rationB", "nB", st, "reste"] }]
          : [{ inconnue: "ration", donnees: ["nA", "rationB", "nB", "nb_jours", st, "reste"] }]),
      ],
      contraintes: (w) => {
        if (w.ration.eq(w.rationB)) return "rations identiques";
        if (w.nA.eq(w.nB)) return "effectifs identiques";
        if (w.reste.cmp(w.besoin) >= 0) return "reste trop grand";
        if (niveau === 3 && w.ration.isInteger && w.rationB.isInteger) return "★★★ : au moins une ration décimale";
        if (conv && w.stock.cmp(Q.of(500)) < 0) return "stock trop petit pour être donné en grande unité";
        return null;
      },
    };
  },

  textes: {
    phrases: [
      [
        { vars: ["ration", "nA"], t: "[lieu], il y a {nA} [A:nA]. Chaque [A] [verbe] {ration} [de:ress] par jour." },
        { vars: ["nA"], t: "[lieu], il y a {nA} [A:nA]. [ils:A] [verbe:pl] tous la même quantité [de:ress] chaque jour." },
      ],
      [
        { vars: ["rationB", "nB"], t: "Il y a aussi {nB} [B:nB]. Chaque [B] [verbe] {rationB} [de:ress] par jour." },
        { vars: ["nB"], t: "Il y a aussi {nB} [B:nB], qui [verbe:pl] tous la même quantité [de:ress] chaque jour." },
      ],
      [
        { vars: ["stockG"], t: "[resp] dispose de {stockG} [de:ress] [reserve]." },
        { vars: ["stock"], t: "[resp] dispose de {stock} [de:ress] [reserve]." },
      ],
      [
        { vars: ["nb_jours", "reste"], t: "[resp] doit [action] pendant {nb_jours} jours. À la fin, il restera {reste} [de:ress] [reserve]." },
        { vars: ["nb_jours"], t: "[il:resp] doit [action] pendant {nb_jours} jours." },
        { vars: ["reste"], t: "[il:resp] veut [action] le plus longtemps possible, mais en gardant {reste} [de:ress] en réserve." },
      ],
    ],
    questions: {
      reste: "[quelle] restera-t-il [reserve] au bout de ces {nb_jours} jours ?",
      stock: "[quelle] y a-t-il [reserve] au départ ?",
      nb_jours: "Pendant combien de jours [resp] peut-[il:resp] [action] ?",
      ration: "[quelle] [verbe] chaque [A] par jour ?",
      rationB: "[quelle] [verbe] chaque [B] par jour ?",
    },
    guidees: {
      consoA: "[quelle] les {nA} [A:nA] [verbe:pl]-[ils:A] en tout chaque jour ?",
      besoin: [
        { vars: ["nb_jours"], t: "[quelle] faut-il pour [tous] pendant {nb_jours} jours ?" },
        { t: "[quelle] [resp] va-t-[il:resp] utiliser en tout ?" },
      ],
    },
    libelles: {
      ration: "[ress] pour [un:A] [A] en un jour",
      consoA: [{ vars: ["nA"], t: "[ress] pour les {nA} [A:nA] en un jour" }, { t: "[ress] pour les [A:pl] en un jour" }],
      rationB: "[ress] pour [un:B] [B] en un jour",
      consoB: "[ress] pour les {nB} [B:nB] en un jour",
      jour: "[ress] pour [tous] en un jour",
      besoin: [{ vars: ["nb_jours"], t: "[ress] pour [tous] en {nb_jours} jours" }, { t: "total [de:ress] à utiliser" }],
      stock: "[ress] [reserve] au départ",
      stockG: "[ress] [reserve] au départ",
      reste: "reste [de:ress] [reserve]",
      nb_jours: "nombre de jours",
    },
    reponses: {
      reste: "Il restera {reste} [de:ress] [reserve].",
      stock: "Au départ, il y a {stock} [de:ress] [reserve].",
      nb_jours: "[resp] peut [action] pendant {nb_jours} jours.",
      ration: "Chaque [A] [verbe] {ration} [de:ress] par jour.",
      rationB: "Chaque [B] [verbe] {rationB} [de:ress] par jour.",
    },
  },
};
