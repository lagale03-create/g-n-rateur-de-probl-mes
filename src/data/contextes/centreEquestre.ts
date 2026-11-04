import type { Contexte } from "../../core/types";

export const centreEquestre: Contexte = {
  id: "centre-equestre",
  titre: "Au centre équestre",
  schemas: {
    "consommation-stock": {
      mots: {
        lieu: "au centre équestre",
        A: { s: "cheval", p: "chevaux", g: "m" },
        B: [{ s: "poney", g: "m" }, { s: "âne", g: "m", voy: true }],
        verbe: { s: "mange", p: "mangent" },
        ress: { s: "foin", g: "m" },
        resp: [{ s: "la monitrice", g: "f" }, { s: "le moniteur", g: "m" }],
        reserve: "dans la grange",
        action: "nourrir tous les animaux",
        tous: "tous les animaux",
        quelle: "quelle masse de foin",
      },
      unites: { quantite: "kg", grande: "t", facteur: 1000 },
      plages: {
        1: { ration: { min: 8, max: 12 }, nA: { min: 2, max: 5 }, nb_jours: { min: 2, max: 6 } },
        2: { ration: { min: 8, max: 12 }, nA: { min: 4, max: 10 }, rationB: { min: 3, max: 6 }, nB: { min: 2, max: 8 }, nb_jours: { min: 5, max: 12 } },
        3: { ration: { min: 8, max: 12, pas: 0.5 }, nA: { min: 6, max: 15 }, rationB: { min: 3, max: 6, pas: 0.5 }, nB: { min: 3, max: 10 }, nb_jours: { min: 7, max: 15 } },
      },
    },
    "achat-unite": {
      mots: {
        lieu: "au centre équestre",
        artA: [{ s: "sac de carottes", p: "sacs de carottes" }, { s: "paquet de friandises", p: "paquets de friandises" }],
        artB: [{ s: "brosse", g: "f" }, { s: "licol", g: "m" }],
      },
      plages: {
        1: { pu: { min: 2, max: 4 } },
        2: { pu: { min: 1.5, max: 4, pas: 0.1 }, prixB: { min: 6, max: 14, pas: 0.5 } },
        3: { pu: { min: 1.5, max: 3.95, pas: 0.05 }, puB: { min: 5, max: 12.5, pas: 0.05 }, nB: { min: 2, max: 3 } },
      },
    },
  },
  parasites: [
    { t: "Le centre équestre a été créé en {a}.", vals: { a: { type: "annee", min: 1975, max: 2012 } } },
    { t: "Les cours commencent à {h}.", vals: { h: { type: "heure", min: 540, max: 600, pas: 30 } } },
    { t: "Un cheval adulte pèse environ {m}.", vals: { m: { type: "nombre", min: 450, max: 600, pas: 10, unite: "kg" } } },
    { t: "Les prairies du centre couvrent {s}.", vals: { s: { type: "nombre", min: 5, max: 20, unite: "hectares" } } },
  ],
};
