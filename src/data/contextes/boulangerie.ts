import type { Contexte } from "../../core/types";
import { consommationStock } from "../schemas/consommationStock";

const generiques = consommationStock.textes.phrases;

export const boulangerie: Contexte = {
  id: "boulangerie",
  titre: "À la boulangerie",
  schemas: {
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
          consoA: "[ress] pour les {nA} [A:nA] d'une journée",
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
