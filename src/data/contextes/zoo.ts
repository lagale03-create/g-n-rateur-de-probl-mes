import type { Contexte } from "../../core/types";

export const zoo: Contexte = {
  id: "zoo",
  titre: "Au zoo",
  schemas: {
    "etats-transformations": {
      mots: {
        obj: { s: "visiteur" }, stock: "dans le zoo",
        debut: "à 10 h", aj1: "Entre 10 h et midi, il en entre encore", m1: "à midi",
        re1: "Entre midi et 14 h, il en sort", m2: "à 14 h",
        aj2: "Entre 14 h et 16 h, il en entre", m3: "à 16 h",
        re2: "Entre 16 h et 18 h, il en sort", fin: "à 18 h",
        vp1: "sont sortis entre midi et 14 h", vg2: "sont entrés entre 14 h et 16 h", vp2: "sont sortis entre 16 h et 18 h",
      },
      plages: {
        1: { depart: { min: 80, max: 300 }, g1: { min: 40, max: 200 } },
        2: { depart: { min: 300, max: 900 }, g1: { min: 100, max: 500 }, g2: { min: 100, max: 500 } },
        3: { depart: { min: 1200, max: 4000 }, g1: { min: 500, max: 3000 }, g2: { min: 500, max: 2500 } },
      },
    },
    "grands-nombres": {
      mots: {
        site1: { s: "le zoo", g: "m" }, site2: { s: "le parc d'attractions voisin", g: "m" },
        obj: { s: "visiteur" }, verbe: { s: "a accueilli", p: "ont accueilli" }, pp: "accueillis",
        per1: "en juillet", per2: "en août", per3: "en septembre", periode: "sur ces deux mois", periode3: "sur ces trois mois",
      },
    },
    "division-reste": {
      mots: {
        intro: "Pour la sortie au zoo, l'école emmène", persA: { s: "élève de CM1", p: "élèves de CM1", voy: true },
        persB: { s: "élève de CM2", p: "élèves de CM2", voy: true }, pers: { s: "élève", voy: true },
        cont: { s: "bus", p: "bus" }, contient: "peut transporter",
        prixPhrase: "La location d'un bus coûte", coutPhrase: "En tout, la location des bus coûte",
        qcout: "Combien l'école va-t-elle payer pour la location des bus ?", rcout: "L'école va payer",
        remplir: "On remplit", plein: "complètement", sans: "sans place", dansCont: "dans les bus pleins",
        absent: "sont malades et ne viennent pas",
      },
      plages: {
        1: { nA: { min: 15, max: 30 }, nB: { min: 15, max: 30 }, cap: { min: 15, max: 25, pas: 5 } },
        2: { nA: { min: 40, max: 80 }, nB: { min: 40, max: 80 }, cap: { min: 30, max: 55, pas: 5 }, prix: { min: 150, max: 320, pas: 10 } },
        3: { nA: { min: 60, max: 110 }, nB: { min: 60, max: 110 }, cap: { min: 40, max: 60, pas: 5 }, prix: { min: 180, max: 380, pas: 5 } },
      },
    },
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
