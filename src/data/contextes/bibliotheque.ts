import type { Contexte } from "../../core/types";

export const bibliotheque: Contexte = {
  id: "bibliotheque",
  titre: "À la bibliothèque",
  schemas: {
    "achat-unite": {
      mots: {
        lieu: "à la brocante de la bibliothèque",
        artA: [{ s: "livre de poche", p: "livres de poche" }, { s: "bande dessinée", p: "bandes dessinées", g: "f" }],
        artB: [{ s: "dictionnaire" }, { s: "atlas", p: "atlas", voy: true }],
      },
      plages: {
        1: { pu: { min: 1, max: 4 } }, 2: { pu: { min: 1, max: 4, pas: 0.1 }, prixB: { min: 5, max: 12, pas: 0.5 } },
        3: { pu: { min: 1.2, max: 4, pas: 0.05 }, puB: { min: 5, max: 12, pas: 0.05 }, nB: { min: 2, max: 3 } },
      },
    },
    trajet: {
      mots: {
        qui: { s: "le bibliobus", g: "m" }, verbe: "roule", e1: "jusqu'au premier village", e2: "jusqu'à l'école du hameau",
        e3: "jusqu'à la maison de retraite", but: "au dernier arrêt", moyen: "sur les routes de campagne", moment1: "le matin", moment2: "l'après-midi",
      },
      plages: { 1: { v1: { min: 30, max: 60, pas: 5 } }, 2: { v1: { min: 30, max: 60, pas: 5 }, v2: { min: 20, max: 50, pas: 5 } }, 3: { v1: { min: 30, max: 60, pas: 2.5 }, v2: { min: 20, max: 50, pas: 2.5 } } },
    },
    decoupe: {
      mots: { lieu: "à la bibliothèque", qui: { s: "la bibliothécaire", g: "f" }, matiere: { s: "film plastique", g: "m" }, rouleau: { s: "rouleau" }, objA: { s: "album", voy: true }, objB: { s: "dictionnaire" } },
    },
    durees: {
      mots: {
        lieu: "à la bibliothèque", qui: { s: "la classe", g: "f" }, a1: { s: "l'heure du conte", g: "f" },
        a2: { s: "le choix des livres", g: "m" }, a3: { s: "la lecture silencieuse", g: "f" }, limite: "La bibliothèque ferme à",
      },
    },
    fraction: {
      mots: { ensemble: "à la bibliothèque", obj: { s: "livre" }, groupe1: "sont des romans", groupe2: "sont des bandes dessinées", groupe3: "sont des documentaires" },
    },
    "fractions-somme": {
      mots: {
        tout: { s: "le roman", g: "m" }, quantite: "compte", qA: "Lundi, [prenom] lit", qB: "Mardi, [il:prenom] lit", qC: "Mercredi, [il:prenom] lit",
        qBq: "Quelle fraction du roman [prenom] a-t-[il:prenom] lue mardi ?", qreste: "Combien de pages [prenom] doit-[il:prenom] encore lire ?",
      },
      unites: { quantite: "pages" },
    },
    tarif: {
      mots: { lieu: "à la médiathèque", qui: { s: "Zoé", g: "f" }, seance: { s: "film emprunté", p: "films empruntés" }, fixe: "d'inscription" },
      plages: { 1: { pu: { min: 1, max: 3 }, fixe: { min: 10, max: 25, pas: 5 } }, 2: { pu: { min: 1, max: 3 }, fixe: { min: 10, max: 25, pas: 5 } }, 3: { pu: { min: 1, max: 3, pas: 0.5 }, fixe: { min: 10, max: 25, pas: 5 } } },
    },
    terrain: {
      mots: { lieu: "à la bibliothèque", objet: { s: "la salle de lecture", g: "f" }, cloture: { s: "frise décorative", g: "f" }, ouverture: "la porte", revetement: { s: "moquette", g: "f" }, partie: { s: "le coin des tout-petits", g: "m" } },
      plages: { 1: { L: { min: 5, max: 12 }, l: { min: 3, max: 8 } }, 2: { L: { min: 8, max: 20 }, l: { min: 5, max: 12 } }, 3: { L: { min: 8, max: 20, pas: 0.5 }, l: { min: 5, max: 12 } } },
    },
    serie: {
      mots: {
        titreG: "le nombre de livres prêtés chaque jour", obj: { s: "livre" },
        c1: "lundi", c2: "mardi", c3: "mercredi", c4: "jeudi", c5: "vendredi", prixPhrase: "Pour chaque livre prêté, la mairie verse",
        titreS: "les livres préférés des élèves", objS: { s: "élève", voy: true }, s1: "les romans", s2: "les BD", s3: "les albums", s4: "les documentaires",
      },
      plages: { 2: { pu: { min: 0.5, max: 2, pas: 0.5 } } },
    },
    proba: {
      mots: { contenant: "la boîte à livres", objA: { s: "roman" }, objB: { s: "bande dessinée", p: "bandes dessinées", g: "f" }, objC: { s: "album", voy: true }, objet: { s: "livre" }, tirer: "prend", tirerInf: "prendre" },
    },
    "etats-transformations": {
      mots: {
        obj: { s: "livre" }, stock: "sur les étagères",
        debut: "lundi matin", aj1: "Lundi, des parents en apportent", m1: "lundi soir",
        re1: "Mardi, les élèves en empruntent", m2: "mardi soir",
        aj2: "Mercredi, la mairie en offre", m3: "mercredi soir",
        re2: "Jeudi, les élèves en empruntent encore", fin: "jeudi soir",
        vp1: "ont été empruntés mardi", vg2: "ont été offerts par la mairie mercredi", vp2: "ont été empruntés jeudi",
      },
      plages: {
        1: { depart: { min: 80, max: 300 }, g1: { min: 10, max: 60 } },
        2: { depart: { min: 300, max: 900 }, g1: { min: 30, max: 150 }, g2: { min: 30, max: 150 } },
        3: { depart: { min: 1500, max: 8000 }, g1: { min: 100, max: 900 }, g2: { min: 100, max: 900 } },
      },
    },
    comparaison: {
      mots: { lieu: "ce mois-ci", obj: { s: "page", g: "f" }, verbe: { s: "a lu", p: "ont lu" }, pp: "lues" },
      plages: {
        1: { A: { min: 40, max: 150 }, e1: { min: 10, max: 50 } },
        2: { A: { min: 100, max: 400 }, e1: { min: 15, max: 90 }, e2: { min: 15, max: 90 } },
        3: { A: { min: 300, max: 1500 }, e1: { min: 30, max: 200 }, e2: { min: 30, max: 200 } },
      },
    },
    "grands-nombres": {
      mots: {
        site1: { s: "la médiathèque de la ville", g: "f" }, site2: { s: "la médiathèque du quartier nord", g: "f" },
        obj: { s: "livre" }, verbe: { s: "a prêté", p: "ont prêté" }, pp: "prêtés",
        per1: "en mars", per2: "en avril", per3: "en mai", periode: "sur ces deux mois", periode3: "sur ces trois mois",
      },
      plages: {
        1: { A: { min: 1200, max: 6000 }, B: { min: 1200, max: 6000 } },
        2: { A: { min: 12000, max: 40000 }, B: { min: 12000, max: 40000 }, D: { min: 12000, max: 40000 } },
        3: { A: { min: 100000, max: 300000 }, B: { min: 100000, max: 300000 }, C: { min: 100000, max: 300000 }, D: { min: 100000, max: 300000 } },
      },
    },
    lots: {
      mots: {
        lieu: "à la bibliothèque", obj: { s: "livre" }, contA: { s: "carton" }, contB: { s: "caisse", g: "f" },
        action: "la bibliothécaire reçoit", action2: "Elle reçoit aussi", vrac: "apportés par des parents",
        retrait: "Elle en prête", retraitSans: "Elle en prête une partie", dest: "aux classes",
        qd: "Combien de livres la bibliothécaire a-t-elle prêtés aux classes ?", ld: "livres prêtés aux classes",
      },
      plages: { 1: { a: { min: 6, max: 12 } }, 2: { a: { min: 10, max: 30 }, b: { min: 15, max: 40 } }, 3: { a: { min: 15, max: 40 }, b: { min: 20, max: 50 } } },
    },
    "division-reste": {
      mots: {
        intro: "Pour le déménagement de la bibliothèque, on range", persA: { s: "album", voy: true }, persB: { s: "roman" },
        pers: { s: "livre" }, cont: { s: "carton" }, contient: "peut contenir",
        prixPhrase: "Un carton coûte", coutPhrase: "En tout, les cartons coûtent",
        qcout: "Combien faut-il payer pour les cartons ?", rcout: "Il faut payer",
        remplir: "On remplit", plein: "complètement", sans: "à ranger", dansCont: "dans les cartons pleins",
        absent: "sont trop abîmés et sont jetés",
      },
      plages: {
        1: { cap: { min: 6, max: 12 } },
        2: { cap: { min: 10, max: 25 }, prix: { min: 1.5, max: 4, pas: 0.5 } },
        3: { nA: { min: 60, max: 180 }, nB: { min: 60, max: 180 }, cap: { min: 12, max: 30 }, prix: { min: 1.5, max: 4, pas: 0.5 } },
      },
    },
  },
  parasites: [
    { t: "La bibliothèque ouvre à {h}.", vals: { h: { type: "heure", min: 510, max: 570, pas: 15 } } },
    { t: "La bibliothèque a été construite en {a}.", vals: { a: { type: "annee", min: 1960, max: 2015 } } },
    { t: "La salle de lecture mesure {l} de long.", vals: { l: { type: "nombre", min: 8, max: 20, unite: "m" } } },
  ],
};
