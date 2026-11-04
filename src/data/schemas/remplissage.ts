/**
 * Schéma « remplissage » (masses et contenances) : un stock en grande unité (L, kg),
 * des récipients en petite unité (cL, g) : conversion, réitération, retrait.
 *   ★ : un type de récipient  ★★ : deux types  ★★★ : stock décimal (2,5 L), trois récipients.
 * Jour 2 : nombre de récipients (groupement), ou stock de départ.
 * Habillage : facette « remplissage » (lieu, qui, ress, stockMot, recA, recB) + unites { grande, quantite, facteur }.
 */
import type { Relation, Schema, Structure } from "../../core/types";
import { conv, N, prod, retrait, union } from "./outils";

export const remplissage: Schema = {
  id: "remplissage",
  titre: "Masses et contenances : conversions",
  notion: "masses et contenances",
  roles: ["lieu", "qui", "ress", "stockMot", "recA", "recB"],

  structure(niveau, cs): Structure {
    const petit = { grandeur: "quantite" } as const, grand = { grandeur: "quantiteGrande" } as const;
    const f = cs.unites?.facteur ?? 100;
    const v: Structure["variables"] = { SG: grand, S: petit, nA: N, cA: petit, uA: petit, reste: petit, facteur: { grandeur: "facteur" } };
    const U = niveau === 1 ? "uA" : "utilise";
    const r: Relation[] = [conv("S", "SG", "facteur"), prod("uA", "cA", "nA"), retrait("S", "reste", U)];
    const cap = f === 1000 ? { min: 100, max: 500, pas: 50 } : { min: 15, max: 75, pas: 5 };
    const tirage: Structure["tirage"] = [{ v: "nA", plage: niveau === 1 ? { min: 3, max: 9 } : { min: 4, max: 15 } }, { v: "cA", plage: cap }];
    if (niveau >= 2) {
      v.nB = N; v.cB = petit; v.uB = petit; v.utilise = petit;
      r.push(prod("uB", "cB", "nB"), union("utilise", "uA", "uB"));
      tirage.push({ v: "nB", plage: { min: 3, max: 12 } }, { v: "cB", plage: cap });
    }
    // le stock en grande unité : entier (★, ★★) ou décimal (★★★)
    tirage.push({ v: "SG", f: (w, { rng }) => w[U].div(f).mul(niveau === 3 ? 2 : 1).ceil().add(rng.int(1, 3)).div(niveau === 3 ? 2 : 1) });
    const base = niveau === 1 ? ["nA", "cA"] : ["nA", "cA", "nB", "cB"];
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: "reste", donnees: [...base, "SG"] },
      j2: [
        { inconnue: "nA", donnees: [...base.filter((x) => x !== "nA"), "SG", "reste"] },
        { inconnue: "SG", donnees: [...base, "reste"] },
      ],
      contraintes: (w) => (niveau >= 2 && w.cA.eq(w.cB) ? "récipients identiques" : w.reste.cmp(0) <= 0 ? "pas de reste" : null),
    };
  },

  textes: {
    phrases: [
      [
        { vars: ["SG"], t: "[lieu], [qui] a [stockMot] de {SG} [de:ress]." },
        { t: "[lieu], [qui] a [stockMot] [de:ress]." },
      ],
      [
        { vars: ["nA", "cA"], t: "[il:qui] remplit {nA} [recA:nA] de {cA}." },
        { vars: ["cA"], t: "[il:qui] remplit des [recA:pl] de {cA}." },
      ],
      [{ vars: ["nB", "cB"], t: "[il:qui] remplit aussi {nB} [recB:nB] de {cB}." }],
      [{ vars: ["reste"], t: "À la fin, il reste {reste} [de:ress]." }],
    ],
    questions: {
      reste: "Quelle quantité [de:ress] reste-t-il ?",
      nA: "Combien de [recA:pl] [qui] a-t-[il:qui] remplis ?",
      SG: "Quelle quantité [de:ress] y avait-il au départ ?",
    },
    guidees: {
      uA: [
        { vars: ["nA"], t: "Quelle quantité [de:ress] faut-il pour remplir les {nA} [recA:nA] ?" },
        { t: "Quelle quantité [de:ress] a-t-on mise dans les [recA:pl] ?" },
      ], S: "Combien de [uniteP] y a-t-il dans {SG} ?" },
    libelles: {
      S: "stock converti", uA: "[ress] dans les [recA:pl]", uB: "[ress] dans les [recB:pl]", utilise: "[ress] utilisée",
      reste: "[ress] qui reste", nA: "nombre de [recA:pl]", SG: "stock de départ",
    },
    reponses: {
      reste: "Il reste {reste} [de:ress].",
      nA: "[qui] a rempli {nA} [recA:nA].",
      SG: "Au départ, il y avait {SG} [de:ress].",
    },
  },
};
