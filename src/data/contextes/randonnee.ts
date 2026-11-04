import type { Contexte } from "../../core/types";

export const randonnee: Contexte = {
  id: "randonnee",
  titre: "La randonnée",
  schemas: {
    "consommation-stock": {
      mots: {
        lieu: "dans le groupe de randonnée",
        A: { s: "adulte", g: "m", voy: true },
        B: { s: "enfant", g: "m", voy: true },
        verbe: { s: "boit", p: "boivent" },
        ress: { s: "eau", g: "f", voy: true },
        resp: [{ s: "le guide", g: "m" }, { s: "la guide", g: "f" }],
        reserve: "dans les bidons du refuge",
        action: "donner de l'eau à tout le groupe",
        tous: "tout le groupe",
        quelle: "quelle quantité d'eau",
      },
      unites: { quantite: "L" },
      plages: {
        1: { ration: { min: 2, max: 3 }, nA: { min: 2, max: 6 }, nb_jours: { min: 2, max: 5 } },
        2: { ration: { min: 2, max: 3 }, nA: { min: 4, max: 12 }, rationB: { min: 1, max: 2 }, nB: { min: 5, max: 15 }, nb_jours: { min: 3, max: 7 } },
        3: { ration: { min: 1.5, max: 3, pas: 0.5 }, nA: { min: 6, max: 15 }, rationB: { min: 1, max: 2, pas: 0.5 }, nB: { min: 8, max: 25 }, nb_jours: { min: 3, max: 8 } },
      },
    },
    "achat-unite": {
      mots: {
        lieu: "à l'office de tourisme",
        artA: [{ s: "sachet de fruits secs", p: "sachets de fruits secs" }, { s: "barre de céréales", p: "barres de céréales", g: "f" }],
        artB: [{ s: "carte de randonnée", p: "cartes de randonnée", g: "f" }, { s: "gourde", g: "f" }],
      },
      plages: {
        1: { pu: { min: 1, max: 3 } },
        2: { pu: { min: 1, max: 3.5, pas: 0.1 }, prixB: { min: 6, max: 12, pas: 0.5 } },
        3: { pu: { min: 0.85, max: 3.5, pas: 0.05 }, puB: { min: 5.5, max: 11.9, pas: 0.05 }, nB: { min: 2, max: 4 } },
      },
    },
  },
  parasites: [
    { t: "Le sentier mesure {d} de long.", vals: { d: { type: "nombre", min: 8, max: 15, unite: "km" } } },
    { t: "Le départ est prévu à {h}.", vals: { h: { type: "heure", min: 450, max: 540, pas: 15 } } },
    { t: "Le sommet culmine à {alt} d'altitude.", vals: { alt: { type: "nombre", min: 1200, max: 2800, pas: 50, unite: "m" } } },
    { t: "Le refuge a été construit en {a}.", vals: { a: { type: "annee", min: 1890, max: 1990 } } },
  ],
};
