import type { Contexte } from "../../core/types";
import { consommationStock } from "../schemas/consommationStock";

const generiques = consommationStock.textes.phrases;

export const boulangerie: Contexte = {
  id: "boulangerie",
  titre: "À la boulangerie",
  schemas: {
    trajet: {
      mots: {
        qui: { s: "le livreur", g: "m" }, verbe: "roule", e1: "jusqu'à l'école", e2: "jusqu'à la maison de retraite",
        e3: "jusqu'au restaurant", but: "au dernier client", moyen: "en camionnette", moment1: "le matin", moment2: "l'après-midi",
      },
      plages: { 1: { v1: { min: 20, max: 50, pas: 5 } }, 2: { v1: { min: 20, max: 50, pas: 5 }, v2: { min: 30, max: 70, pas: 5 } }, 3: { v1: { min: 20, max: 50, pas: 2.5 }, v2: { min: 30, max: 70, pas: 2.5 } } },
    },
    decoupe: {
      mots: { lieu: "à la boulangerie", qui: { s: "la boulangère", g: "f" }, matiere: { s: "ruban doré", g: "m" }, rouleau: { s: "rouleau" }, objA: { s: "boîte de gâteaux", p: "boîtes de gâteaux", g: "f" }, objB: { s: "sachet de chocolats", p: "sachets de chocolats" } },
    },
    remplissage: {
      mots: { lieu: "à la boulangerie", qui: { s: "le boulanger", g: "m" }, ress: { s: "pâte", g: "f" }, stockMot: "un bac", recA: { s: "pâton de pain", p: "pâtons de pain" }, recB: { s: "pâton de brioche", p: "pâtons de brioche" } },
      unites: { grande: "kg", quantite: "g", facteur: 1000 },
    },
    "fractions-somme": {
      mots: {
        tout: { s: "la tarte", g: "f" }, quantite: "pèse", qA: "[prenom] en mange", qB: "[prenom2] en mange", qC: "[prenom3] en mange",
        qBq: "Quelle fraction de la tarte [prenom2] a-t-[il:prenom2] mangée ?", qreste: "Quelle masse de tarte reste-t-il ?",
      },
      unites: { quantite: "g" },
    },
    serie: {
      mots: {
        titreG: "le nombre de baguettes vendues chaque jour", obj: { s: "baguette", g: "f" },
        c1: "lundi", c2: "mardi", c3: "mercredi", c4: "jeudi", c5: "vendredi", prixPhrase: "Une baguette coûte",
        titreS: "les viennoiseries vendues le dimanche", objS: { s: "viennoiserie", g: "f" }, s1: "les croissants", s2: "les pains au chocolat", s3: "les chouquettes", s4: "les brioches",
      },
      plages: { 2: { pu: { min: 1, max: 1.5, pas: 0.1 } } },
    },
    "deux-sortes": {
      mots: { lieu: "à la boulangerie", sA: { s: "boîte de 6 macarons", p: "boîtes de 6 macarons", g: "f" }, sB: { s: "boîte de 12 macarons", p: "boîtes de 12 macarons", g: "f" }, unite: { s: "boîte", g: "f" }, valeur: { s: "macaron" }, vA: "6", vB: "12", tous: "toutes les boîtes" },
    },
    "etats-transformations": {
      mots: {
        obj: { s: "baguette", g: "f" }, stock: "dans la boutique",
        debut: "à 7 h", aj1: "Entre 7 h et 9 h, le boulanger en fait cuire", m1: "à 9 h",
        re1: "Entre 9 h et midi, il en vend", m2: "à midi",
        aj2: "Entre midi et 16 h, il en fait cuire encore", m3: "à 16 h",
        re2: "Entre 16 h et 19 h, il en vend", fin: "à 19 h",
        vp1: "ont été vendues entre 9 h et midi", vg2: "ont été cuites entre midi et 16 h", vp2: "ont été vendues entre 16 h et 19 h",
      },
      plages: {
        1: { depart: { min: 20, max: 80 }, g1: { min: 20, max: 90 } },
        2: { depart: { min: 50, max: 200 }, g1: { min: 80, max: 300 }, g2: { min: 50, max: 250 } },
        3: { depart: { min: 100, max: 400 }, g1: { min: 200, max: 900 }, g2: { min: 150, max: 700 } },
      },
    },
    "grands-nombres": {
      mots: {
        site1: { s: "la boulangerie du village", g: "f" }, site2: { s: "la boulangerie de la gare", g: "f" },
        obj: { s: "baguette", g: "f" }, verbe: { s: "a vendu", p: "ont vendu" }, pp: "vendues",
        per1: "en janvier", per2: "en février", per3: "en mars", periode: "sur ces deux mois", periode3: "sur ces trois mois",
      },
      plages: {
        2: { A: { min: 12000, max: 30000 }, B: { min: 12000, max: 30000 }, D: { min: 12000, max: 30000 } },
        3: { A: { min: 30000, max: 95000 }, B: { min: 30000, max: 95000 }, C: { min: 30000, max: 95000 }, D: { min: 30000, max: 95000 } },
      },
    },
    lots: {
      mots: {
        lieu: "à la boulangerie", obj: { s: "croissant" }, contA: { s: "plaque", g: "f" }, contB: { s: "corbeille", g: "f" },
        action: "le boulanger prépare", action2: "Il prépare aussi", vrac: "posés sur le comptoir",
        retrait: "Il en vend", retraitSans: "Il en vend une partie", dest: "dans la matinée",
        qd: "Combien de croissants le boulanger a-t-il vendus dans la matinée ?", ld: "croissants vendus dans la matinée",
      },
      plages: { 1: { a: { min: 6, max: 12 } }, 2: { a: { min: 12, max: 24 }, b: { min: 6, max: 15 } }, 3: { a: { min: 15, max: 30 }, b: { min: 8, max: 20 } } },
    },
    "division-reste": {
      mots: {
        intro: "Pour la fête de l'école, le boulanger prépare", persA: { s: "chouquette au sucre", p: "chouquettes au sucre", g: "f" },
        persB: { s: "chouquette au chocolat", p: "chouquettes au chocolat", g: "f" }, pers: { s: "chouquette", g: "f" },
        cont: { s: "boîte", g: "f" }, contient: "peut contenir",
        prixPhrase: "Une boîte vide coûte", coutPhrase: "En tout, les boîtes coûtent",
        qcout: "Combien le boulanger va-t-il payer pour les boîtes ?", rcout: "Le boulanger va payer",
        remplir: "Il remplit", plein: "complètement", sans: "à part", dansCont: "dans les boîtes pleines",
        absent: "sont abîmées et ne sont pas mises en boîte",
      },
      plages: {
        1: { cap: { min: 6, max: 12 } },
        2: { cap: { min: 10, max: 20 }, prix: { min: 0.5, max: 1.5, pas: 0.1 } },
        3: { cap: { min: 12, max: 24 }, prix: { min: 0.5, max: 1.5, pas: 0.1 } },
      },
    },
    "consommation-stock": {
      mots: {
        lieu: "à la boulangerie",
        A: { s: "fournée de baguettes", p: "fournées de baguettes", g: "f" },
        B: { s: "fournée de croissants", p: "fournées de croissants", g: "f" },
        verbe: { s: "utilise", p: "utilisent" },
        ress: { s: "farine", g: "f" },
        resp: [{ s: "le boulanger", g: "m" }, { s: "la boulangère", g: "f" }],
        reserve: "dans la réserve",
        action: "faire toutes ses fournées",
        tous: "toutes les fournées",
        quelle: "quelle masse de farine",
      },
      unites: { quantite: "kg", grande: "t", facteur: 1000 },
      plages: {
        1: { ration: { min: 5, max: 9 }, nA: { min: 2, max: 5 }, nb_jours: { min: 2, max: 6 } },
        2: { ration: { min: 8, max: 12 }, nA: { min: 3, max: 8 }, rationB: { min: 3, max: 6 }, nB: { min: 2, max: 5 }, nb_jours: { min: 5, max: 12 } },
        3: { ration: { min: 8, max: 12, pas: 0.5 }, nA: { min: 4, max: 8 }, rationB: { min: 3, max: 6, pas: 0.5 }, nB: { min: 2, max: 6 }, nb_jours: { min: 6, max: 14 } },
      },
      // phrases propres à ce contexte : une fournée ne « mange » pas !
      textes: {
        phrases: [
          [
            { vars: ["ration", "nA"], t: "Chaque jour, [lieu], [resp] fait {nA} [A:nA]. Pour chaque [A], [il:resp] utilise {ration} [de:ress]." },
            { vars: ["nA"], t: "Chaque jour, [lieu], [resp] fait {nA} [A:nA]. Chaque [A] demande la même quantité [de:ress]." },
          ],
          [
            { vars: ["rationB", "nB"], t: "[il:resp] fait aussi {nB} [B:nB], qui demandent chacune {rationB} [de:ress]." },
            { vars: ["nB"], t: "[il:resp] fait aussi {nB} [B:nB], qui demandent toutes la même quantité [de:ress]." },
          ],
          generiques[2],
          generiques[3],
        ],
        questions: {
          ration: "[quelle] faut-il pour [un:A] [A] ?",
          rationB: "[quelle] faut-il pour [un:B] [B] ?",
        },
        guidees: { consoA: "[quelle] faut-il chaque jour pour les {nA} [A:nA] ?" },
        libelles: {
          ration: "[ress] pour [un:A] [A]",
          rationB: "[ress] pour [un:B] [B]",
          consoA: [{ vars: ["nA"], t: "[ress] pour les {nA} [A:nA] d'une journée" }, { t: "[ress] pour les [A:pl] d'une journée" }],
          consoB: "[ress] pour les {nB} [B:nB] d'une journée",
        },
        reponses: {
          ration: "Chaque [A] demande {ration} [de:ress].",
          rationB: "Chaque [B] demande {rationB} [de:ress].",
        },
      },
    },
    "achat-unite": {
      mots: {
        lieu: "à la boulangerie",
        artA: [{ s: "croissant", g: "m" }, { s: "pain au chocolat", p: "pains au chocolat", g: "m" }],
        artB: [{ s: "tarte aux pommes", p: "tartes aux pommes", g: "f" }, { s: "tarte aux fraises", p: "tartes aux fraises", g: "f" }],
      },
      plages: {
        1: { pu: { min: 1, max: 2, pas: 0.5 } },
        2: { pu: { min: 0.9, max: 1.5, pas: 0.1 }, prixB: { min: 8, max: 15, pas: 0.5 } },
        3: { pu: { min: 0.95, max: 1.45, pas: 0.05 }, puB: { min: 7.5, max: 14.95, pas: 0.05 }, nB: { min: 2, max: 3 } },
      },
    },
  },
  parasites: [
    { t: "La boulangerie ouvre à {h}.", vals: { h: { type: "heure", min: 390, max: 450, pas: 15 } } },
    { t: "Le four chauffe jusqu'à {t}.", vals: { t: { type: "nombre", min: 220, max: 260, pas: 10, unite: "°C" } } },
    { t: "La boulangerie existe depuis {a}.", vals: { a: { type: "annee", min: 1950, max: 2010 } } },
    { t: "Une baguette mesure environ {l}.", vals: { l: { type: "nombre", min: 55, max: 70, unite: "cm" } } },
  ],
};
