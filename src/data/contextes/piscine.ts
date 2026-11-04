import type { Contexte } from "../../core/types";

export const piscine: Contexte = {
  id: "piscine",
  titre: "À la piscine",
  schemas: {
    "etats-transformations": {
      mots: {
        obj: { s: "nageur" }, stock: "dans la piscine",
        debut: "à 14 h", aj1: "Entre 14 h et 15 h, il en arrive", m1: "à 15 h",
        re1: "Entre 15 h et 16 h, il en part", m2: "à 16 h",
        aj2: "Entre 16 h et 17 h, il en arrive encore", m3: "à 17 h",
        re2: "Entre 17 h et 18 h, il en part", fin: "à 18 h",
        vp1: "sont partis entre 15 h et 16 h", vg2: "sont arrivés entre 16 h et 17 h", vp2: "sont partis entre 17 h et 18 h",
      },
      plages: {
        1: { depart: { min: 20, max: 90 }, g1: { min: 10, max: 60 } },
        2: { depart: { min: 60, max: 200 }, g1: { min: 30, max: 150 }, g2: { min: 30, max: 150 } },
        3: { depart: { min: 150, max: 500 }, g1: { min: 80, max: 400 }, g2: { min: 80, max: 400 } },
      },
    },
    comparaison: {
      mots: { lieu: "à l'entraînement", obj: { s: "longueur", g: "f" }, verbe: { s: "a nagé", p: "ont nagé" }, pp: "nagées" },
      plages: {
        1: { A: { min: 8, max: 30 }, e1: { min: 2, max: 10 } },
        2: { A: { min: 20, max: 80 }, e1: { min: 4, max: 20 }, e2: { min: 4, max: 20 } },
        3: { A: { min: 40, max: 150 }, e1: { min: 5, max: 30 }, e2: { min: 5, max: 30 } },
      },
    },
    "grands-nombres": {
      mots: {
        site1: { s: "la piscine municipale", g: "f" }, site2: { s: "le centre aquatique", g: "m" },
        obj: { s: "entrée", g: "f", voy: true }, verbe: { s: "a vendu", p: "ont vendu" }, pp: "vendues",
        per1: "en juin", per2: "en juillet", per3: "en août", periode: "sur ces deux mois", periode3: "sur ces trois mois",
      },
      plages: {
        2: { A: { min: 12000, max: 45000 }, B: { min: 12000, max: 45000 }, D: { min: 12000, max: 45000 } },
        3: { A: { min: 60000, max: 150000 }, B: { min: 60000, max: 150000 }, C: { min: 60000, max: 150000 }, D: { min: 60000, max: 150000 } },
      },
    },
  },
  parasites: [
    { t: "Le grand bassin mesure {l} de long.", vals: { l: { type: "nombre", min: 25, max: 50, pas: 25, unite: "m" } } },
    { t: "L'eau est à {t}.", vals: { t: { type: "nombre", min: 26, max: 29, unite: "°C" } } },
    { t: "La piscine a ouvert ses portes en {a}.", vals: { a: { type: "annee", min: 1965, max: 2015 } } },
  ],
};
