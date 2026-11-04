import type { Contexte } from "../../core/types";

export const piscine: Contexte = {
  id: "piscine",
  titre: "À la piscine",
  schemas: {
    "achat-unite": {
      mots: {
        lieu: "à l'accueil de la piscine",
        artA: [{ s: "entrée enfant", p: "entrées enfant", g: "f", voy: true }, { s: "bonnet de bain", p: "bonnets de bain" }],
        artB: [{ s: "paire de lunettes", p: "paires de lunettes", g: "f" }, { s: "serviette", g: "f" }],
      },
      plages: {
        1: { pu: { min: 2, max: 5 } }, 2: { pu: { min: 2, max: 5, pas: 0.1 }, prixB: { min: 6, max: 15, pas: 0.5 } },
        3: { pu: { min: 2.15, max: 4.5, pas: 0.05 }, puB: { min: 6, max: 15, pas: 0.05 }, nB: { min: 2, max: 3 } },
      },
    },
    "partage-frais": {
      mots: {
        occasion: "pour l'anniversaire à la piscine", qui: { s: "les parents", g: "m" },
        depA: { s: "la location du bassin", g: "f" }, depB: { s: "le goûter", g: "m" }, depC: { s: "les cadeaux", g: "m" },
        parts: { s: "famille", g: "f" }, aide: "La piscine offre une réduction de",
      },
    },
    durees: {
      mots: {
        lieu: "à la piscine", qui: { s: "la classe", g: "f" }, a1: { s: "le passage aux vestiaires", g: "m" },
        a2: { s: "la séance de natation", g: "f" }, a3: { s: "la douche et l'habillage", g: "f" }, limite: "Le bus repart à",
      },
    },
    fraction: {
      mots: { ensemble: "au club de natation", obj: { s: "nageur" }, groupe1: "nagent la brasse", groupe2: "nagent le crawl", groupe3: "nagent le dos crawlé" },
    },
    "fractions-somme": {
      mots: {
        tout: { s: "la séance", g: "f" }, quantite: "dure", qA: "L'échauffement occupe", qB: "Les longueurs occupent", qC: "Les plongeons occupent",
        qBq: "Quelle fraction de la séance les longueurs occupent-elles ?", qreste: "Combien de minutes reste-t-il pour les jeux ?",
      },
      unites: { quantite: "min" },
    },
    tarif: {
      mots: { lieu: "à la piscine", qui: { s: "Hugo", g: "m" }, seance: { s: "entrée", g: "f", voy: true }, fixe: "pour la carte d'abonnement" },
      plages: { 1: { pu: { min: 2, max: 4 } }, 2: { pu: { min: 2, max: 4 } }, 3: { pu: { min: 1.5, max: 4, pas: 0.5 } } },
    },
    terrain: {
      mots: { lieu: "à la piscine", objet: { s: "le bassin d'apprentissage", g: "m" }, cloture: { s: "ligne de bouées", p: "lignes de bouées", g: "f" }, ouverture: "l'échelle", revetement: { s: "bâche", g: "f" }, partie: { s: "le coin du toboggan", g: "m" } },
      plages: { 1: { L: { min: 8, max: 15 }, l: { min: 4, max: 8 } }, 2: { L: { min: 12, max: 25 }, l: { min: 6, max: 12 } }, 3: { L: { min: 12, max: 25, pas: 0.5 }, l: { min: 6, max: 12 } } },
    },
    volume: {
      mots: { lieu: "à la piscine", objet: { s: "la pataugeoire", g: "f" }, ress: { s: "eau", g: "f", voy: true }, seau: { s: "bidon" } },
    },
    serie: {
      mots: {
        titreG: "le nombre d'entrées à la piscine chaque jour", obj: { s: "entrée", g: "f", voy: true },
        c1: "lundi", c2: "mardi", c3: "mercredi", c4: "jeudi", c5: "vendredi", prixPhrase: "Une entrée coûte",
        titreS: "les nages préférées des nageurs du club", objS: { s: "nageur" }, s1: "la brasse", s2: "le crawl", s3: "le dos", s4: "le papillon",
      },
      plages: { 2: { pu: { min: 2, max: 5, pas: 0.5 } } },
    },
    proba: {
      mots: { contenant: "le panier des bonnets", objA: { s: "bonnet bleu", p: "bonnets bleus" }, objB: { s: "bonnet rouge", p: "bonnets rouges" }, objC: { s: "bonnet jaune", p: "bonnets jaunes" }, objet: { s: "bonnet" }, tirer: "prend", tirerInf: "prendre" },
    },
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
