import type { Contexte } from "../../core/types";

export const cantine: Contexte = {
  id: "cantine",
  titre: "À la cantine",
  schemas: {
    "grands-nombres": {
      mots: {
        site1: { s: "la cuisine centrale de la ville", g: "f" }, site2: { s: "la cuisine centrale de la ville voisine", g: "f" },
        obj: { s: "repas", p: "repas" }, verbe: { s: "a servi", p: "ont servi" }, pp: "servis",
        per1: "en septembre", per2: "en octobre", per3: "en novembre", periode: "sur ces deux mois", periode3: "sur ces trois mois",
      },
      plages: {
        2: { A: { min: 12000, max: 40000 }, B: { min: 12000, max: 40000 }, D: { min: 12000, max: 40000 } },
        3: { A: { min: 120000, max: 400000 }, B: { min: 120000, max: 400000 }, C: { min: 120000, max: 400000 }, D: { min: 120000, max: 400000 } },
      },
    },
    lots: {
      mots: {
        lieu: "à la cantine", obj: { s: "yaourt" }, contA: { s: "pack" }, contB: { s: "carton" },
        action: "le cuisinier reçoit", action2: "Il reçoit aussi", vrac: "déjà dans le réfrigérateur",
        retrait: "Il en sert", retraitSans: "Il en sert une partie", dest: "aux élèves à midi",
        qd: "Combien de yaourts le cuisinier a-t-il servis aux élèves ?", ld: "yaourts servis aux élèves",
      },
      plages: { 1: { a: { min: 4, max: 8, pas: 2 } }, 2: { a: { min: 4, max: 12, pas: 2 }, b: { min: 24, max: 48, pas: 12 } }, 3: { a: { min: 4, max: 12, pas: 2 }, b: { min: 24, max: 60, pas: 12 } } },
    },
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
