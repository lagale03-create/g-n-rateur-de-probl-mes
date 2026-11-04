/**
 * Schéma « vitesse » : distance = vitesse × durée (en heures entières), puis on additionne.
 * Habillage : facette « trajet » (qui, moyen, e1, e2, but).
 *   ★ : une étape, puis distance restante  ★★ : deux étapes à deux vitesses  ★★★ : vitesses décimales, reste.
 * Jour 2 : retrouver une durée (groupement) ou une vitesse (partage).
 */
import type { Relation, Schema, Structure } from "../../core/types";
import { mes, prod, retrait, union } from "./outils";

export const vitesse: Schema = {
  id: "vitesse", herite: "trajet",
  titre: "Vitesse, distance, durée", notion: "vitesse",
  roles: ["qui", "moyen", "moment1", "moment2", "but"],
  structure(niveau): Structure {
    const KMH = mes("km/h"), KM = mes("km"), H = mes("h");
    const V = { c: "Vitesse", a: "Partage", b: "Groupement" } as const;
    const v: Structure["variables"] = { v1: KMH, t1: H, d1: KM, total: KM, reste: KM };
    const r: Relation[] = [prod("d1", "v1", "t1", V), retrait("total", "reste", niveau === 1 ? "d1" : "fait")];
    const tirage: Structure["tirage"] = [
      { v: "v1", plage: niveau === 3 ? { min: 3, max: 18, pas: 0.5 } : { min: 3, max: 20 } },
      { v: "t1", plage: { min: 1, max: 4 } },
    ];
    const base = ["v1", "t1"];
    if (niveau >= 2) {
      v.v2 = KMH; v.t2 = H; v.d2 = KM; v.fait = KM;
      r.push(prod("d2", "v2", "t2", V), union("fait", "d1", "d2"));
      tirage.push({ v: "v2", plage: niveau === 3 ? { min: 3, max: 18, pas: 0.5 } : { min: 3, max: 20 } }, { v: "t2", plage: { min: 1, max: 3 } });
      base.push("v2", "t2");
    }
    tirage.push({ v: "total", f: (w, { rng }) => w[niveau === 1 ? "d1" : "fait"].ceil().add(rng.int(3, 25)) });
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: "reste", donnees: [...base, "total"] },
      j2: [niveau === 3
        ? { inconnue: "v1", donnees: [...base.filter((x) => x !== "v1"), "total", "reste"] }
        : { inconnue: "t1", donnees: [...base.filter((x) => x !== "t1"), "total", "reste"] }],
      contraintes: (w) => (niveau >= 2 && w.v1.eq(w.v2) ? "vitesses identiques" : null),
    };
  },
  textes: {
    phrases: [
      [{ vars: ["total"], t: "Pour arriver [but], [qui] doit parcourir {total} [moyen]." }, { t: "[qui] part [moyen] pour arriver [but]." }],
      [
        { vars: ["v1", "t1"], t: "[moment1], [il:qui] avance à {v1} pendant {t1}." },
        { vars: ["v1"], t: "[moment1], [il:qui] avance à {v1}." },
        { vars: ["t1"], t: "[moment1], [il:qui] avance à vitesse constante pendant {t1}." },
      ],
      [{ vars: ["v2", "t2"], t: "[moment2], [il:qui] avance à {v2} pendant {t2}." }],
      [{ vars: ["reste"], t: "Il lui reste alors {reste} à parcourir." }],
    ],
    questions: { reste: "Quelle distance lui reste-t-il à parcourir ?", v1: "À quelle vitesse [qui] avançait-[il:qui] [moment1] ?", t1: "Combien de temps [qui] a-t-[il:qui] avancé [moment1] ?" },
    guidees: { d1: "Quelle distance [qui] parcourt-[il:qui] [moment1] ?" },
    libelles: { d1: "distance de la première partie", d2: "distance de la deuxième partie", fait: "distance parcourue", reste: "distance qui reste", t1: "durée de la première partie" },
    reponses: { reste: "Il lui reste {reste} à parcourir.", v1: "[qui] avançait à {v1} [moment1].", t1: "[qui] a avancé {t1} [moment1]." },
  },
};
