import type { Contexte } from "../../core/types";

export const journal: Contexte = {
  id: "journal",
  titre: "Le journal de l'école",
  schemas: {
    "etats-transformations": {
      mots: {
        obj: { s: "exemplaire", voy: true }, stock: "dans la classe",
        debut: "lundi matin", aj1: "Lundi, les élèves en impriment", m1: "lundi soir",
        re1: "Mardi, ils en vendent", m2: "mardi soir",
        aj2: "Mercredi, ils en impriment encore", m3: "mercredi soir",
        re2: "Jeudi, ils en vendent", fin: "jeudi soir",
        vp1: "ont été vendus mardi", vg2: "ont été imprimés mercredi", vp2: "ont été vendus jeudi",
      },
      plages: {
        1: { depart: { min: 10, max: 60 }, g1: { min: 20, max: 80 } },
        2: { depart: { min: 40, max: 150 }, g1: { min: 50, max: 200 }, g2: { min: 50, max: 200 } },
        3: { depart: { min: 100, max: 400 }, g1: { min: 150, max: 600 }, g2: { min: 150, max: 600 } },
      },
    },
    comparaison: {
      mots: { lieu: "pour le journal de l'école", obj: { s: "exemplaire", voy: true }, verbe: { s: "a vendu", p: "ont vendu" }, pp: "vendus" },
      plages: {
        1: { A: { min: 10, max: 40 }, e1: { min: 3, max: 12 } },
        2: { A: { min: 20, max: 80 }, e1: { min: 4, max: 20 }, e2: { min: 4, max: 20 } },
        3: { A: { min: 50, max: 200 }, e1: { min: 8, max: 40 }, e2: { min: 8, max: 40 } },
      },
    },
    lots: {
      mots: {
        lieu: "pour le journal de l'école", obj: { s: "journal", p: "journaux" }, contA: { s: "paquet" }, contB: { s: "carton" },
        action: "l'imprimeur livre", action2: "Il livre aussi", vrac: "en plus",
        retrait: "Les élèves en vendent", retraitSans: "Les élèves en vendent une partie", dest: "à la sortie de l'école",
        qd: "Combien de journaux les élèves ont-ils vendus à la sortie de l'école ?", ld: "journaux vendus",
      },
      plages: { 1: { a: { min: 5, max: 12 } }, 2: { a: { min: 10, max: 25 }, b: { min: 20, max: 50, pas: 5 } }, 3: { a: { min: 20, max: 50 }, b: { min: 25, max: 60, pas: 5 } } },
    },
  },
  parasites: [
    { t: "Le journal paraît depuis {a}.", vals: { a: { type: "annee", min: 1995, max: 2020 } } },
    { t: "Chaque numéro compte {p}.", vals: { p: { type: "nombre", min: 8, max: 16, pas: 4, unite: "pages" } } },
    { t: "Le comité de rédaction se réunit à {h}.", vals: { h: { type: "heure", min: 750, max: 810, pas: 15 } } },
  ],
};
