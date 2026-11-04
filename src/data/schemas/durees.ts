/**
 * Schéma « durées » : heure de début + durées successives = heure de fin.
 *   ★ : deux activités  ★★ : trois activités  ★★★ : trois activités, puis marge avant une heure limite.
 * Jour 2 : heure de début (à rebours), ou durée d'une activité.
 * Habillage : facette « durees » (lieu, qui, a1, a2, a3, limite).
 */
import type { Relation, Schema, Structure } from "../../core/types";
import { union } from "./outils";

const H = { grandeur: "heure" } as const;
const D = { grandeur: "duree" } as const;

export const durees: Schema = {
  id: "durees",
  titre: "Durées et horaires",
  notion: "durées",
  roles: ["lieu", "qui", "a1", "a2", "a3", "limite"],

  structure(niveau): Structure {
    const v: Structure["variables"] = { debut: H, d1: D, h1: H, d2: D, h2: H };
    const r: Relation[] = [union("h1", "debut", "d1", "Durée"), union("h2", "h1", "d2", "Durée")];
    const pas = niveau === 1 ? 15 : 5;
    const tirage: Structure["tirage"] = [
      { v: "debut", plage: { min: 8 * 60, max: 14 * 60, pas } },
      { v: "d1", plage: niveau === 1 ? { min: 15, max: 60, pas: 15 } : { min: 20, max: 95, pas } },
      { v: "d2", plage: niveau === 1 ? { min: 15, max: 75, pas: 15 } : { min: 15, max: 80, pas } },
    ];
    let fin = "h2";
    if (niveau >= 2) {
      v.d3 = D; v.h3 = H; r.push(union("h3", "h2", "d3", "Durée")); fin = "h3";
      tirage.push({ v: "d3", plage: { min: 25, max: 110, pas } });
    }
    const base = ["debut", "d1", "d2", ...(niveau >= 2 ? ["d3"] : [])];
    if (niveau === 3) {
      v.lim = H; v.marge = D;
      // marge = limite − fin
      r.push({ type: "add", c: "lim", a: "h3", b: "marge", noms: { c: "Durée", a: "Durée", b: "Durée" } });
      tirage.push({ v: "lim", f: (w, { rng }) => w.h3.add(5 * rng.int(3, 18)) });
    }
    const j1 = niveau === 3 ? "marge" : fin;
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: j1, donnees: [...base, ...(niveau === 3 ? ["lim"] : [])] },
      j2: [
        { inconnue: "debut", donnees: [...base.filter((x) => x !== "debut"), fin] },
        { inconnue: "d2", donnees: [...base.filter((x) => x !== "d2"), fin] },
      ],
      contraintes: (w) => (w[fin].cmp(19 * 60) > 0 ? "trop tard" : w.d1.eq(w.d2) ? "durées identiques" : null),
    };
  },

  textes: {
    phrases: [
      [
        { vars: ["debut"], t: "[lieu], [qui] commence à {debut}." },
        { t: "[lieu], voici le programme [du:qui]." },
      ],
      [{ vars: ["d1"], t: "[a1] dure {d1}." }],
      [{ vars: ["d2"], t: "Ensuite, [a2] dure {d2}." }, { t: "Ensuite, il y a [a2]." }],
      [{ vars: ["d3"], t: "Enfin, [a3] dure {d3}." }],
      [
        { vars: ["h2"], niveaux: [1], t: "Tout se termine à {h2}." },
        { vars: ["h3"], t: "Tout se termine à {h3}." },
      ],
      [{ vars: ["lim"], t: "[limite] {lim}." }],
    ],
    questions: {
      h2: "À quelle heure tout se termine-t-il ?",
      h3: "À quelle heure tout se termine-t-il ?",
      marge: "Combien de temps reste-t-il entre la fin et {lim} ?",
      debut: "À quelle heure [qui] a-t-[il:qui] commencé ?",
      d2: "Combien de temps dure [a2] ?",
    },
    guidees: { h1: "À quelle heure [a1] se termine-t-[il:a1] ?" },
    libelles: { h1: "fin [du:a1]", h2: "fin [du:a2]", h3: "fin [du:a3]", marge: "temps qui reste", debut: "heure de début", d2: "durée [du:a2]" },
    reponses: {
      h2: "Tout se termine à {h2}.", h3: "Tout se termine à {h3}.",
      marge: "Il reste {marge} entre la fin et {lim}.",
      debut: "[qui] a commencé à {debut}.", d2: "[a2] dure {d2}.",
    },
  },
};
