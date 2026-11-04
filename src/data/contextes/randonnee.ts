import type { Contexte } from "../../core/types";

export const randonnee: Contexte = {
  id: "randonnee",
  titre: "La randonnée",
  schemas: {
    comparaison: {
      mots: { lieu: "pendant la randonnée", obj: { s: "pomme de pin", p: "pommes de pin", g: "f" }, verbe: { s: "a ramassé", p: "ont ramassé" }, pp: "ramassées" },
      plages: {
        1: { A: { min: 10, max: 40 }, e1: { min: 3, max: 12 } },
        2: { A: { min: 20, max: 90 }, e1: { min: 5, max: 30 }, e2: { min: 5, max: 30 } },
        3: { A: { min: 120, max: 450 }, e1: { min: 15, max: 90 }, e2: { min: 15, max: 90 } },
      },
    },
    "grands-nombres": {
      mots: {
        site1: { s: "le sentier du lac", g: "m" }, site2: { s: "le sentier des crêtes", g: "m" },
        obj: { s: "randonneur" }, verbe: { s: "a vu passer", p: "ont vu passer" }, pp: "vu passer",
        per1: "en juillet", per2: "en août", per3: "en septembre", periode: "sur ces deux mois", periode3: "sur ces trois mois",
      },
      plages: {
        2: { A: { min: 12000, max: 35000 }, B: { min: 12000, max: 35000 }, D: { min: 12000, max: 35000 } },
        3: { A: { min: 100000, max: 250000 }, B: { min: 100000, max: 250000 }, C: { min: 100000, max: 250000 }, D: { min: 100000, max: 250000 } },
      },
    },
    "division-reste": {
      mots: {
        intro: "Pour le camp de randonnée, le club emmène", persA: { s: "adulte", voy: true }, persB: { s: "enfant", voy: true },
        pers: { s: "randonneur" }, cont: { s: "tente", g: "f" }, contient: "peut accueillir",
        prixPhrase: "La location d'une tente pour le séjour coûte", coutPhrase: "En tout, la location des tentes coûte",
        qcout: "Combien le club va-t-il payer pour les tentes ?", rcout: "Le club va payer",
        remplir: "On remplit", plein: "complètement", sans: "sans tente", dansCont: "dans les tentes pleines",
        absent: "ont un empêchement et ne viennent pas",
      },
      plages: {
        1: { nA: { min: 8, max: 20 }, nB: { min: 8, max: 20 }, cap: { min: 3, max: 6 } },
        2: { nA: { min: 15, max: 40 }, nB: { min: 15, max: 45 }, cap: { min: 4, max: 8 }, prix: { min: 15, max: 45 } },
        3: { nA: { min: 25, max: 60 }, nB: { min: 25, max: 60 }, cap: { min: 4, max: 8 }, prix: { min: 18, max: 48 } },
      },
    },
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
