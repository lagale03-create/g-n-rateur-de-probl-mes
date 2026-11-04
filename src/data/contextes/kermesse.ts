import type { Contexte } from "../../core/types";

export const kermesse: Contexte = {
  id: "kermesse",
  titre: "La kermesse",
  schemas: {
    comparaison: {
      mots: { lieu: "à la kermesse", obj: { s: "ticket" }, verbe: { s: "a vendu", p: "ont vendu" }, pp: "vendus" },
      plages: {
        1: { A: { min: 15, max: 60 }, e1: { min: 3, max: 15 } },
        2: { A: { min: 40, max: 150 }, e1: { min: 6, max: 35 }, e2: { min: 6, max: 35 } },
        3: { A: { min: 100, max: 400 }, e1: { min: 15, max: 80 }, e2: { min: 15, max: 80 } },
      },
    },
    lots: {
      mots: {
        lieu: "pour la kermesse", obj: { s: "bonbon" }, contA: { s: "sachet" }, contB: { s: "boîte", g: "f" },
        action: "les parents préparent", action2: "Ils préparent aussi", vrac: "en vrac",
        retrait: "Ils en vendent", retraitSans: "Ils en vendent une partie", dest: "pendant la fête",
        qd: "Combien de bonbons ont été vendus pendant la fête ?", ld: "bonbons vendus pendant la fête",
      },
      plages: { 1: { a: { min: 5, max: 12 } }, 2: { a: { min: 8, max: 15 }, b: { min: 20, max: 50 } }, 3: { a: { min: 10, max: 25 }, b: { min: 30, max: 60 } } },
    },
    "division-reste": {
      mots: {
        intro: "Pour le repas de la kermesse, on attend", persA: { s: "parent" }, persB: { s: "enfant", voy: true },
        pers: { s: "personne", g: "f" }, cont: { s: "table", g: "f" }, contient: "peut accueillir",
        prixPhrase: "La location d'une table coûte", coutPhrase: "En tout, la location des tables coûte",
        qcout: "Combien coûte la location des tables ?", rcout: "La location des tables coûte",
        remplir: "On remplit", plein: "complètement", sans: "sans place", dansCont: "aux tables pleines",
        absent: "se désistent et ne viennent pas",
      },
      plages: {
        1: { cap: { min: 6, max: 10 } },
        2: { cap: { min: 6, max: 12 }, prix: { min: 4, max: 12, pas: 0.5 } },
        3: { cap: { min: 8, max: 12 }, prix: { min: 4, max: 12, pas: 0.5 } },
      },
    },
  },
  parasites: [
    { t: "La kermesse commence à {h}.", vals: { h: { type: "heure", min: 600, max: 840, pas: 30 } } },
    { t: "La cour de l'école mesure {l} de long.", vals: { l: { type: "nombre", min: 30, max: 60, unite: "m" } } },
    { t: "La première kermesse de l'école a eu lieu en {a}.", vals: { a: { type: "annee", min: 1970, max: 2010 } } },
  ],
};
