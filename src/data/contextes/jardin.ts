import type { Contexte } from "../../core/types";

export const jardin: Contexte = {
  id: "jardin",
  titre: "Au jardin de l'école",
  schemas: {
    "etats-transformations": {
      mots: {
        obj: { s: "plant de salade", p: "plants de salade" }, stock: "dans la serre",
        debut: "lundi matin", aj1: "Lundi, le jardinier en apporte", m1: "lundi soir",
        re1: "Mardi, pour le potager, les élèves en repiquent", m2: "mardi soir",
        aj2: "Mercredi, des parents en apportent", m3: "mercredi soir",
        re2: "Jeudi, pour le potager, ils en repiquent encore", fin: "jeudi soir",
        vp1: "ont été repiqués mardi", vg2: "ont été apportés mercredi", vp2: "ont été repiqués jeudi",
      },
      plages: {
        1: { depart: { min: 20, max: 90 }, g1: { min: 10, max: 50 } },
        2: { depart: { min: 60, max: 200 }, g1: { min: 30, max: 120 }, g2: { min: 30, max: 120 } },
        3: { depart: { min: 150, max: 600 }, g1: { min: 80, max: 300 }, g2: { min: 80, max: 300 } },
      },
    },
    comparaison: {
      mots: { lieu: "au jardin de l'école", obj: { s: "tomate", g: "f" }, verbe: { s: "a cueilli", p: "ont cueilli" }, pp: "cueillies" },
      plages: {
        1: { A: { min: 10, max: 40 }, e1: { min: 3, max: 12 } },
        2: { A: { min: 20, max: 90 }, e1: { min: 4, max: 20 }, e2: { min: 4, max: 20 } },
        3: { A: { min: 60, max: 250 }, e1: { min: 8, max: 40 }, e2: { min: 8, max: 40 } },
      },
    },
    lots: {
      mots: {
        lieu: "au jardin de l'école", obj: { s: "salade", g: "f" }, contA: { s: "rangée", g: "f" }, contB: { s: "carré" },
        action: "on plante", action2: "On plante aussi", vrac: "dans des pots",
        retrait: "Les élèves en récoltent", retraitSans: "Les élèves en récoltent une partie", dest: "pour la cantine",
        qd: "Combien de salades les élèves ont-ils récoltées pour la cantine ?", ld: "salades récoltées pour la cantine",
      },
      plages: { 1: { a: { min: 4, max: 10 } }, 2: { a: { min: 8, max: 15 }, b: { min: 4, max: 9 } }, 3: { a: { min: 10, max: 25 }, b: { min: 6, max: 16 } } },
    },
    "division-reste": {
      mots: {
        intro: "Pour le jardin, la classe a fait pousser", persA: { s: "plant de tomate", p: "plants de tomate" },
        persB: { s: "plant de courgette", p: "plants de courgette" }, pers: { s: "plant" }, cont: { s: "jardinière", g: "f" },
        contient: "peut accueillir", prixPhrase: "Une jardinière coûte", coutPhrase: "En tout, les jardinières coûtent",
        qcout: "Combien la classe va-t-elle payer pour les jardinières ?", rcout: "La classe va payer",
        remplir: "On remplit", plein: "complètement", sans: "à planter ailleurs", dansCont: "dans les jardinières pleines",
        absent: "ont fané et sont jetés",
      },
      plages: {
        1: { cap: { min: 4, max: 8 } },
        2: { cap: { min: 6, max: 12 }, prix: { min: 6, max: 15, pas: 0.5 } },
        3: { cap: { min: 6, max: 12 }, prix: { min: 6, max: 15, pas: 0.5 } },
      },
    },
  },
  parasites: [
    { t: "Le jardin mesure {l} de long.", vals: { l: { type: "nombre", min: 12, max: 30, unite: "m" } } },
    { t: "Les élèves arrosent le jardin à {h}.", vals: { h: { type: "heure", min: 510, max: 600, pas: 15 } } },
    { t: "Le jardin a été créé en {a}.", vals: { a: { type: "annee", min: 2005, max: 2022 } } },
  ],
};
