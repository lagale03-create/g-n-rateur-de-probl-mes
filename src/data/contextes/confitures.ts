import type { Contexte } from "../../core/types";

export const confitures: Contexte = {
  id: "confitures",
  titre: "Les confitures",
  schemas: {
    trajet: {
      mots: {
        qui: { s: "le producteur", g: "m" }, verbe: "roule", e1: "de la ferme jusqu'au village", e2: "du village jusqu'à la ville",
        e3: "dans la ville", but: "au marché", moyen: "en camionnette", moment1: "le matin", moment2: "ensuite",
      },
      plages: { 1: { v1: { min: 30, max: 60, pas: 5 } }, 2: { v1: { min: 30, max: 60, pas: 5 }, v2: { min: 20, max: 50, pas: 5 } }, 3: { v1: { min: 30, max: 60, pas: 2.5 }, v2: { min: 20, max: 50, pas: 2.5 } } },
    },
    decoupe: {
      mots: { lieu: "chez le producteur", qui: { s: "la productrice", g: "f" }, matiere: { s: "ruban à carreaux", g: "m" }, rouleau: { s: "rouleau" }, objA: { s: "grand pot", p: "grands pots", g: "m" }, objB: { s: "petit pot", p: "petits pots", g: "m" } },
    },
    "partage-frais": {
      mots: {
        occasion: "pour fabriquer des confitures", qui: { s: "trois familles", g: "f" },
        depA: { s: "l'achat des fraises", g: "m" }, depB: { s: "le sucre", g: "m" }, depC: { s: "les pots", g: "m" },
        parts: { s: "famille", g: "f" }, aide: "Un voisin offre",
      },
    },
    remplissage: {
      mots: { lieu: "chez le producteur", qui: { s: "la productrice", g: "f" }, ress: { s: "confiture", g: "f" }, stockMot: "une bassine", recA: { s: "grand pot", p: "grands pots", g: "m" }, recB: { s: "petit pot", p: "petits pots", g: "m" } },
      unites: { grande: "kg", quantite: "g", facteur: 1000 },
    },
    "fractions-somme": {
      mots: {
        tout: { s: "la récolte de fraises", g: "f" }, quantite: "pèse", qA: "Le producteur en vend au marché", qB: "Il en garde pour les confitures",
        qC: "Il en offre à ses voisins", qBq: "Quelle fraction de la récolte le producteur garde-t-il pour les confitures ?", qreste: "Quelle masse de fraises reste-t-il ?",
      },
      unites: { quantite: "kg" },
    },
    proba: {
      mots: { contenant: "le carton du producteur", objA: { s: "pot de fraises", p: "pots de fraises" }, objB: { s: "pot d'abricots", p: "pots d'abricots" }, objC: { s: "pot de myrtilles", p: "pots de myrtilles" }, objet: { s: "pot" }, tirer: "prend", tirerInf: "prendre" },
    },
    "etats-transformations": {
      mots: {
        obj: { s: "pot de confiture", p: "pots de confiture" }, stock: "sur le stand",
        debut: "à 8 h", aj1: "Entre 8 h et 9 h, le producteur en apporte encore", m1: "à 9 h",
        re1: "Entre 9 h et 11 h, il en vend", m2: "à 11 h",
        aj2: "Entre 11 h et midi, il en rapporte encore", m3: "à midi",
        re2: "Entre midi et 13 h, il en vend", fin: "à 13 h",
        vp1: "ont été vendus entre 9 h et 11 h", vg2: "ont été rapportés entre 11 h et midi", vp2: "ont été vendus entre midi et 13 h",
      },
      plages: {
        1: { depart: { min: 20, max: 90 }, g1: { min: 10, max: 50 } },
        2: { depart: { min: 60, max: 200 }, g1: { min: 30, max: 120 }, g2: { min: 30, max: 120 } },
        3: { depart: { min: 200, max: 600 }, g1: { min: 100, max: 400 }, g2: { min: 100, max: 400 } },
      },
    },
    comparaison: {
      mots: { lieu: "cet été", obj: { s: "pot de confiture", p: "pots de confiture" }, verbe: { s: "a préparé", p: "ont préparé" }, pp: "préparés" },
      plages: {
        1: { A: { min: 12, max: 60 }, e1: { min: 3, max: 15 } },
        2: { A: { min: 30, max: 120 }, e1: { min: 5, max: 30 }, e2: { min: 5, max: 30 } },
        3: { A: { min: 80, max: 300 }, e1: { min: 10, max: 60 }, e2: { min: 10, max: 60 } },
      },
    },
    lots: {
      mots: {
        lieu: "au marché", obj: { s: "pot de confiture", p: "pots de confiture" }, contA: { s: "cagette", g: "f" }, contB: { s: "carton" },
        action: "le producteur apporte", action2: "Il apporte aussi", vrac: "posés sur la table",
        retrait: "Il en vend", retraitSans: "Il en vend une partie", dest: "dans la matinée",
        qd: "Combien de pots de confiture le producteur a-t-il vendus dans la matinée ?", ld: "pots vendus dans la matinée",
      },
      plages: { 1: { a: { min: 6, max: 12 } }, 2: { a: { min: 6, max: 12 }, b: { min: 12, max: 24, pas: 6 } }, 3: { a: { min: 8, max: 15 }, b: { min: 12, max: 30, pas: 6 } } },
    },
    "division-reste": {
      mots: {
        intro: "Pour une épicerie, le producteur prépare", persA: { s: "pot de confiture de fraises", p: "pots de confiture de fraises" },
        persB: { s: "pot de confiture d'abricots", p: "pots de confiture d'abricots" }, pers: { s: "pot" },
        cont: { s: "carton" }, contient: "peut contenir",
        prixPhrase: "Un carton vide coûte", coutPhrase: "En tout, les cartons coûtent",
        qcout: "Combien le producteur va-t-il payer pour les cartons ?", rcout: "Le producteur va payer",
        remplir: "Il remplit", plein: "complètement", sans: "à part", dansCont: "dans les cartons pleins",
        absent: "sont fêlés et ne sont pas expédiés",
      },
      plages: {
        1: { cap: { min: 6, max: 12 } },
        2: { cap: { min: 6, max: 24, pas: 6 }, prix: { min: 0.8, max: 2.5, pas: 0.1 } },
        3: { cap: { min: 6, max: 24, pas: 6 }, prix: { min: 0.8, max: 2.5, pas: 0.1 } },
      },
    },
    "achat-unite": {
      mots: {
        lieu: "au marché, sur le stand du producteur",
        artA: [
          { s: "pot de confiture de fraises", p: "pots de confiture de fraises", g: "m" },
          { s: "pot de confiture d'abricots", p: "pots de confiture d'abricots", g: "m" },
        ],
        artB: [{ s: "pot de miel", p: "pots de miel", g: "m" }, { s: "bocal de compote", p: "bocaux de compote", g: "m" }],
      },
      plages: {
        1: { pu: { min: 3, max: 6 } },
        2: { pu: { min: 3, max: 6, pas: 0.1 }, prixB: { min: 5, max: 10, pas: 0.5 } },
        3: { pu: { min: 3.05, max: 5.95, pas: 0.05 }, puB: { min: 4.5, max: 8.95, pas: 0.05 }, nB: { min: 2, max: 4 } },
      },
    },
  },
  parasites: [
    { t: "Le marché a lieu tous les samedis depuis {a}.", vals: { a: { type: "annee", min: 1980, max: 2018 } } },
    { t: "Le stand ouvre à {h}.", vals: { h: { type: "heure", min: 480, max: 540, pas: 15 } } },
    { t: "Chaque pot pèse {m}.", vals: { m: { type: "nombre", min: 250, max: 450, pas: 10, unite: "g" } } },
  ],
};
