import type { Contexte } from "../../core/types";

export const cantine: Contexte = {
  id: "cantine",
  titre: "À la cantine",
  schemas: {
    "consommation-stock": {
      mots: {
        lieu: "à la cantine",
        A: { s: "table de grands", p: "tables de grands", g: "f" },
        B: { s: "table de petits", p: "tables de petits", g: "f" },
        verbe: { s: "mange", p: "mangent" },
        ress: { s: "pommes de terre", g: "f" },
        resp: [{ s: "le cuisinier", g: "m" }, { s: "la cuisinière", g: "f" }],
        reserve: "dans la réserve",
        action: "préparer les repas",
        tous: "toutes les tables",
        quelle: "quelle masse de pommes de terre",
      },
      unites: { quantite: "kg" },
      plages: {
        1: { ration: { min: 2, max: 4 }, nA: { min: 3, max: 8 }, nb_jours: { min: 2, max: 4 } },
        2: { ration: { min: 3, max: 4 }, nA: { min: 6, max: 12 }, rationB: { min: 1, max: 2 }, nB: { min: 4, max: 10 }, nb_jours: { min: 4, max: 10 } },
        3: { ration: { min: 2, max: 4, pas: 0.5 }, nA: { min: 8, max: 15 }, rationB: { min: 1, max: 2.5, pas: 0.5 }, nB: { min: 5, max: 12 }, nb_jours: { min: 5, max: 12 } },
      },
    },
    "achat-unite": {
      mots: {
        lieu: "à la mairie",
        artA: { s: "ticket de cantine", p: "tickets de cantine" },
        artB: { s: "repas adulte", p: "repas adultes" },
      },
      plages: {
        1: { pu: { min: 3, max: 5 } },
        2: { pu: { min: 3, max: 4.5, pas: 0.1 }, prixB: { min: 6, max: 8, pas: 0.5 } },
        3: { pu: { min: 2.85, max: 4.6, pas: 0.05 }, puB: { min: 5.5, max: 7.9, pas: 0.05 }, nB: { min: 2, max: 4 } },
      },
    },
  },
  parasites: [
    { t: "La cantine accueille les élèves à partir de {h}.", vals: { h: { type: "heure", min: 690, max: 720, pas: 15 } } },
    { t: "Le restaurant scolaire a été rénové en {a}.", vals: { a: { type: "annee", min: 1995, max: 2022 } } },
    { t: "La salle mesure {l} de long.", vals: { l: { type: "nombre", min: 15, max: 30, unite: "m" } } },
  ],
};
