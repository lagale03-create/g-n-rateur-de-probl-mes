/**
 * Schéma « parcours » (longueurs) : on additionne des étapes, on compare à la distance prévue.
 *   ★ : deux étapes en mètres, reste à parcourir  ★★ : une étape en km à convertir  ★★★ : km décimaux.
 * Habillage : facette « trajet » du contexte (qui, e1, e2, e3, but, verbe).
 */
import type { Relation, Schema, Structure } from "../../core/types";
import { constante, conv, mes, retrait, union } from "./outils";

export const parcours: Schema = {
  id: "parcours",
  herite: "trajet",
  titre: "Longueurs : parcours et conversions",
  notion: "longueurs",
  roles: ["qui", "e1", "e2", "e3", "but", "verbe"],

  structure(niveau): Structure {
    const m = mes("m"), km = mes("km");
    if (niveau === 1) {
      return {
        variables: { d1: m, d2: m, fait: m, objectif: m, reste: m },
        relations: [union("fait", "d1", "d2"), retrait("objectif", "reste", "fait")],
        tirage: [
          { v: "d1", plage: { min: 200, max: 900, pas: 50 } }, { v: "d2", plage: { min: 150, max: 800, pas: 50 } },
          { v: "objectif", f: (w, { rng }) => w.fait.add(100 * rng.int(2, 9)) },
        ],
        j1: { inconnue: "reste", donnees: ["d1", "d2", "objectif"] },
        j2: [{ inconnue: "d2", donnees: ["d1", "objectif", "reste"] }, { inconnue: "objectif", donnees: ["d1", "d2", "reste"] }],
      };
    }
    const v: Structure["variables"] = { d1k: km, d1: m, d2: m, d3: m, d12: m, fait: m, objk: km, objectif: m, reste: m, mille: constante(1000) };
    const r: Relation[] = [conv("d1", "d1k", "mille"), union("d12", "d1", "d2"), union("fait", "d12", "d3"), conv("objectif", "objk", "mille"), retrait("objectif", "reste", "fait")];
    const pas = niveau === 2 ? 1 : 0.1;
    return {
      variables: v, relations: r,
      tirage: [
        { v: "d1k", plage: { min: 1, max: niveau === 2 ? 4 : 6, pas } },
        { v: "d2", plage: { min: 200, max: 1800, pas: niveau === 2 ? 50 : 10 } },
        { v: "d3", plage: { min: 300, max: 2500, pas: niveau === 2 ? 50 : 10 } },
        { v: "objk", f: (w, { rng }) => w.fait.div(1000).ceil().add(rng.int(1, 4)) },
      ],
      j1: { inconnue: "reste", donnees: ["d1k", "d2", "d3", "objk"] },
      j2: [{ inconnue: "d3", donnees: ["d1k", "d2", "objk", "reste"] }],
    };
  },

  textes: {
    phrases: [
      [
        { vars: ["d1k"], t: "[qui] [verbe] d'abord {d1k} [e1]." },
        { vars: ["d1"], t: "[qui] [verbe] d'abord {d1} [e1]." },
      ],
      [{ vars: ["d2"], t: "Ensuite, [il:qui] [verbe] {d2} [e2]." }],
      [{ vars: ["d3"], t: "Puis [il:qui] [verbe] {d3} [e3]." }],
      [
        { vars: ["objk", "reste"], t: "Pour arriver [but], le parcours complet mesure {objk} : il reste {reste} à parcourir." },
        { vars: ["objectif", "reste"], t: "Pour arriver [but], le parcours complet mesure {objectif} : il reste {reste} à parcourir." },
        { vars: ["objk"], t: "Pour arriver [but], le parcours complet mesure {objk}." },
        { vars: ["objectif"], t: "Pour arriver [but], le parcours complet mesure {objectif}." },
        { vars: ["reste"], t: "Il lui reste {reste} à parcourir pour arriver [but]." },
      ],
    ],
    questions: {
      reste: "Combien de mètres reste-t-il à parcourir pour arriver [but] ?",
      d2: "Quelle distance [qui] a-t-[il:qui] parcourue [e2] ?",
      d3: "Quelle distance [qui] a-t-[il:qui] parcourue [e3] ?",
      objectif: "Combien de mètres mesure le parcours complet ?",
    },
    guidees: { fait: "Quelle distance [qui] a-t-[il:qui] déjà parcourue ?" },
    libelles: {
      d1: "première étape en mètres", objectif: "parcours complet en mètres", fait: "distance déjà parcourue",
      d12: "distance des deux premières étapes", reste: "distance qui reste", d2: "deuxième étape", d3: "troisième étape",
    },
    reponses: {
      reste: "Il reste {reste} à parcourir.",
      d2: "[qui] a parcouru {d2} [e2].",
      d3: "[qui] a parcouru {d3} [e3].",
      objectif: "Le parcours complet mesure {objectif}.",
    },
  },
};
