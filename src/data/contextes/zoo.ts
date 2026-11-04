import type { Contexte } from "../../core/types";

export const zoo: Contexte = {
  id: "zoo",
  titre: "Au zoo",
  schemas: {
    "consommation-stock": {
      mots: {
        lieu: "au zoo",
        A: [{ s: "lion", g: "m" }, { s: "tigre", g: "m" }],
        B: [{ s: "loup", g: "m" }, { s: "guépard", g: "m" }, { s: "lynx", p: "lynx", g: "m" }],
        verbe: { s: "mange", p: "mangent" },
        ress: { s: "viande", g: "f" },
        resp: [{ s: "le soigneur", g: "m" }, { s: "la soigneuse", g: "f" }],
        reserve: "dans la chambre froide",
        action: "nourrir tous ces animaux",
        tous: "tous les animaux",
        quelle: "quelle masse de viande",
      },
      unites: { quantite: "kg", grande: "t", facteur: 1000 },
      plages: {
        1: { ration: { min: 5, max: 9 }, nA: { min: 2, max: 5 }, nb_jours: { min: 2, max: 6 } },
        2: { ration: { min: 6, max: 9 }, nA: { min: 3, max: 6 }, rationB: { min: 2, max: 4 }, nB: { min: 4, max: 9 }, nb_jours: { min: 5, max: 14 } },
        3: { ration: { min: 6, max: 9, pas: 0.5 }, nA: { min: 3, max: 8 }, rationB: { min: 2, max: 4, pas: 0.5 }, nB: { min: 4, max: 12 }, nb_jours: { min: 7, max: 21 } },
      },
    },
    "achat-unite": {
      mots: {
        lieu: "à la boutique du zoo",
        artA: [{ s: "carte postale", p: "cartes postales", g: "f" }, { s: "porte-clés", p: "porte-clés", g: "m" }],
        artB: [{ s: "peluche", g: "f" }, { s: "casquette", g: "f" }],
      },
      plages: {
        1: { pu: { min: 1, max: 3 } },
        2: { pu: { min: 1, max: 3.5, pas: 0.1 }, prixB: { min: 8, max: 15, pas: 0.5 } },
        3: { pu: { min: 1.2, max: 3.5, pas: 0.05 }, puB: { min: 6.5, max: 14.9, pas: 0.05 }, nB: { min: 2, max: 4 } },
      },
    },
  },
  parasites: [
    { t: "Le zoo a ouvert ses portes en {a}.", vals: { a: { type: "annee", min: 1960, max: 2015 } } },
    { t: "Le zoo ouvre à {h}.", vals: { h: { type: "heure", min: 540, max: 600, pas: 15 } } },
    { t: "Un lion adulte peut peser jusqu'à {m}.", vals: { m: { type: "nombre", min: 180, max: 250, pas: 5, unite: "kg" } } },
    { t: "Le parc s'étend sur {s}.", vals: { s: { type: "nombre", min: 12, max: 40, unite: "hectares" } } },
  ],
};
