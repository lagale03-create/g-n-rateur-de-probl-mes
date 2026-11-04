import type { Contexte } from "../../core/types";

export const centreEquestre: Contexte = {
  id: "centre-equestre",
  titre: "Au centre équestre",
  schemas: {
    trajet: {
      mots: {
        qui: { s: "la monitrice", g: "f" }, verbe: "parcourt", e1: "du centre jusqu'à la forêt", e2: "dans la forêt",
        e3: "le long de la rivière", but: "à la ferme", moyen: "à cheval", moment1: "le matin", moment2: "l'après-midi",
      },
      plages: { 1: { v1: { min: 6, max: 12 } }, 2: { v1: { min: 6, max: 12 }, v2: { min: 5, max: 10 } }, 3: { v1: { min: 6, max: 12, pas: 0.5 }, v2: { min: 5, max: 10, pas: 0.5 } } },
    },
    decoupe: {
      mots: { lieu: "au centre équestre", qui: { s: "la monitrice", g: "f" }, matiere: { s: "corde", g: "f" }, rouleau: { s: "rouleau" }, objA: { s: "longe", g: "f" }, objB: { s: "attache", g: "f", voy: true } },
    },
    "partage-frais": {
      mots: {
        occasion: "pour le concours d'équitation", qui: { s: "le centre", g: "m" },
        depA: { s: "le transport des chevaux", g: "m" }, depB: { s: "l'inscription au concours", g: "f" }, depC: { s: "le repas", g: "m" },
        parts: { s: "cavalier" }, aide: "Le club prend en charge",
      },
    },
    durees: {
      mots: {
        lieu: "au centre équestre", qui: { s: "le groupe de cavaliers", g: "m" }, a1: { s: "le pansage des poneys", g: "m" },
        a2: { s: "la leçon dans le manège", g: "f" }, a3: { s: "la balade", g: "f" }, limite: "Les parents arrivent à",
      },
    },
    tarif: {
      mots: { lieu: "au centre équestre", qui: { s: "Inès", g: "f" }, seance: { s: "cours" , p: "cours"}, fixe: "d'adhésion pour l'année" },
      plages: { 1: { pu: { min: 10, max: 20 } }, 2: { pu: { min: 10, max: 18 } }, 3: { pu: { min: 10, max: 18, pas: 0.5 } } },
    },
    terrain: {
      mots: { lieu: "au centre équestre", objet: { s: "le paddock", g: "m" }, cloture: { s: "barrière en bois", g: "f" }, ouverture: "le portail", revetement: { s: "sable", g: "m" }, partie: { s: "l'abreuvoir", g: "m" } },
    },
    volume: {
      mots: { lieu: "au centre équestre", objet: { s: "l'abreuvoir", g: "m" }, ress: { s: "eau", g: "f", voy: true }, seau: { s: "seau" } },
    },
    "deux-sortes": {
      mots: { lieu: "dans la prairie", sA: { s: "cavalier" }, sB: { s: "cheval", p: "chevaux" }, unite: { s: "tête", g: "f" }, valeur: { s: "jambe", g: "f" }, vA: "2", vB: "4", tous: "tous" },
    },
    "consommation-stock": {
      mots: {
        lieu: "au centre équestre",
        A: { s: "cheval", p: "chevaux", g: "m" },
        B: [{ s: "poney", g: "m" }, { s: "âne", g: "m", voy: true }],
        verbe: { s: "mange", p: "mangent" },
        ress: { s: "foin", g: "m" },
        resp: [{ s: "la monitrice", g: "f" }, { s: "le moniteur", g: "m" }],
        reserve: "dans la grange",
        action: "nourrir tous les animaux",
        tous: "tous les animaux",
        quelle: "quelle masse de foin",
      },
      unites: { quantite: "kg", grande: "t", facteur: 1000 },
      plages: {
        1: { ration: { min: 8, max: 12 }, nA: { min: 2, max: 5 }, nb_jours: { min: 2, max: 6 } },
        2: { ration: { min: 8, max: 12 }, nA: { min: 4, max: 10 }, rationB: { min: 3, max: 6 }, nB: { min: 2, max: 8 }, nb_jours: { min: 5, max: 12 } },
        3: { ration: { min: 8, max: 12, pas: 0.5 }, nA: { min: 6, max: 15 }, rationB: { min: 3, max: 6, pas: 0.5 }, nB: { min: 3, max: 10 }, nb_jours: { min: 7, max: 15 } },
      },
    },
    "achat-unite": {
      mots: {
        lieu: "au centre équestre",
        artA: [{ s: "sac de carottes", p: "sacs de carottes" }, { s: "paquet de friandises", p: "paquets de friandises" }],
        artB: [{ s: "brosse", g: "f" }, { s: "licol", g: "m" }],
      },
      plages: {
        1: { pu: { min: 2, max: 4 } },
        2: { pu: { min: 1.5, max: 4, pas: 0.1 }, prixB: { min: 6, max: 14, pas: 0.5 } },
        3: { pu: { min: 1.5, max: 3.95, pas: 0.05 }, puB: { min: 5, max: 12.5, pas: 0.05 }, nB: { min: 2, max: 3 } },
      },
    },
  },
  parasites: [
    { t: "Le centre équestre a été créé en {a}.", vals: { a: { type: "annee", min: 1975, max: 2012 } } },
    { t: "Les cours commencent à {h}.", vals: { h: { type: "heure", min: 540, max: 600, pas: 30 } } },
    { t: "Un cheval adulte pèse environ {m}.", vals: { m: { type: "nombre", min: 450, max: 600, pas: 10, unite: "kg" } } },
    { t: "Les prairies du centre couvrent {s}.", vals: { s: { type: "nombre", min: 5, max: 20, unite: "hectares" } } },
  ],
};
