import type { Contexte } from "../../core/types";

export const confitures: Contexte = {
  id: "confitures",
  titre: "Les confitures",
  schemas: {
    "achat-unite": {
      mots: {
        lieu: "au marché, sur le stand du producteur",
        artA: [
          { s: "pot de confiture de fraises", p: "pots de confiture de fraises", g: "m" },
          { s: "pot de confiture d'abricots", p: "pots de confiture d'abricots", g: "m" },
        ],
        artB: [{ s: "pot de miel", p: "pots de miel", g: "m" }, { s: "bocal de compote", p: "bocaux de compote", g: "m" }],
      },
      plages: {
        1: { pu: { min: 3, max: 6 } },
        2: { pu: { min: 3, max: 6, pas: 0.1 }, prixB: { min: 5, max: 10, pas: 0.5 } },
        3: { pu: { min: 3.05, max: 5.95, pas: 0.05 }, puB: { min: 4.5, max: 8.95, pas: 0.05 }, nB: { min: 2, max: 4 } },
      },
    },
  },
  parasites: [
    { t: "Le marché a lieu tous les samedis depuis {a}.", vals: { a: { type: "annee", min: 1980, max: 2018 } } },
    { t: "Le stand ouvre à {h}.", vals: { h: { type: "heure", min: 480, max: 540, pas: 15 } } },
    { t: "Chaque pot pèse {m}.", vals: { m: { type: "nombre", min: 250, max: 450, pas: 10, unite: "g" } } },
  ],
};
