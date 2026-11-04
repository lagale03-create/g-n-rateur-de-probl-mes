import type { Contexte } from "../../core/types";

export const kermesse: Contexte = {
  id: "kermesse",
  titre: "La kermesse",
  schemas: {
    "achat-unite": {
      mots: {
        lieu: "au stand de la kermesse",
        artA: [{ s: "crêpe", g: "f" }, { s: "gaufre", g: "f" }],
        artB: [{ s: "gâteau entier", p: "gâteaux entiers" }, { s: "panier garni", p: "paniers garnis" }],
      },
      plages: {
        1: { pu: { min: 1, max: 3 } }, 2: { pu: { min: 1, max: 3, pas: 0.1 }, prixB: { min: 6, max: 15, pas: 0.5 } },
        3: { pu: { min: 1.2, max: 3, pas: 0.05 }, puB: { min: 6, max: 15, pas: 0.05 }, nB: { min: 2, max: 3 } },
      },
    },
    decoupe: {
      mots: { lieu: "pour la kermesse", qui: { s: "Madame Diallo", g: "f" }, matiere: { s: "guirlande", g: "f" }, rouleau: { s: "rouleau" }, objA: { s: "stand" }, objB: { s: "table", g: "f" } },
    },
    "partage-frais": {
      mots: {
        occasion: "pour préparer la kermesse", qui: { s: "l'association des parents", g: "f" },
        depA: { s: "la location des jeux gonflables", g: "f" }, depB: { s: "la sono", g: "f" }, depC: { s: "les lots", g: "m" },
        parts: { s: "classe", g: "f" }, aide: "La mairie participe pour",
      },
    },
    remplissage: {
      mots: { lieu: "à la buvette de la kermesse", qui: { s: "le papa de Noé", g: "m" }, ress: { s: "sirop dilué", g: "m" }, stockMot: "une fontaine", recA: { s: "gobelet" }, recB: { s: "verre" } },
      unites: { grande: "L", quantite: "cL", facteur: 100 },
    },
    durees: {
      mots: {
        lieu: "à la kermesse", qui: { s: "la fête", g: "f" }, a1: { s: "le spectacle des maternelles", g: "m" },
        a2: { s: "les jeux", g: "m" }, a3: { s: "la tombola", g: "f" }, limite: "L'école ferme ses portes à",
      },
    },
    fraction: {
      mots: { ensemble: "à la kermesse", obj: { s: "ticket" }, groupe1: "sont vendus pour la pêche aux canards", groupe2: "sont vendus pour le chamboule-tout", groupe3: "sont vendus pour le maquillage" },
    },
    terrain: {
      mots: { lieu: "pour la kermesse", objet: { s: "la piste de danse", g: "f" }, cloture: { s: "ruban de sécurité", g: "m" }, ouverture: "l'entrée des danseurs", revetement: { s: "parquet", g: "m" }, partie: { s: "l'estrade des musiciens", g: "f" } },
      plages: { 1: { L: { min: 5, max: 12 }, l: { min: 3, max: 8 } }, 2: { L: { min: 8, max: 18 }, l: { min: 5, max: 12 } }, 3: { L: { min: 8, max: 18, pas: 0.5 }, l: { min: 5, max: 12 } } },
    },
    volume: {
      mots: { lieu: "à la kermesse", objet: { s: "le bac de la pêche aux canards", g: "m" }, ress: { s: "eau", g: "f", voy: true }, seau: { s: "seau" } },
    },
    serie: {
      mots: {
        titreG: "le nombre de tickets vendus à chaque stand", obj: { s: "ticket" },
        c1: "stand 1", c2: "stand 2", c3: "stand 3", c4: "stand 4", c5: "stand 5", prixPhrase: "Un ticket coûte",
        titreS: "les jeux préférés des enfants", objS: { s: "enfant", voy: true }, s1: "la pêche aux canards", s2: "le chamboule-tout", s3: "le maquillage", s4: "la course en sac",
      },
      plages: { 2: { pu: { min: 1, max: 3, pas: 0.5 } } },
    },
    proba: {
      mots: { contenant: "l'urne de la tombola", objA: { s: "ticket perdant", p: "tickets perdants" }, objB: { s: "ticket gagnant", p: "tickets gagnants" }, objC: { s: "ticket « rejouez »", p: "tickets « rejouez »" }, objet: { s: "ticket" }, tirer: "tire", tirerInf: "tirer" },
    },
    "deux-sortes": {
      mots: { lieu: "dans la caisse de la kermesse", sA: { s: "billet de 5 €", p: "billets de 5 €" }, sB: { s: "billet de 10 €", p: "billets de 10 €" }, unite: { s: "billet" }, valeur: { s: "euro", voy: true }, vA: "5", vB: "10", tous: "tous les billets" },
    },
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
