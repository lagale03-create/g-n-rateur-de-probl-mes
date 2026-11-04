/**
 * Schéma « partage des frais » (décimal ÷ entier) : on additionne des dépenses, puis on partage.
 *   ★ : deux dépenses, partagées  ★★ : trois dépenses  ★★★ : une aide est déduite avant le partage.
 * Jour 2 : retrouver une dépense à partir de la part de chacun.
 * Habillage : facette « partage-frais » (occasion, qui, depA, depB, depC, parts, aide).
 */
import type { Relation, Schema, Structure } from "../../core/types";
import { E, N, prod, retrait, union } from "./outils";
import { Q } from "../../core/rational";

export const partageFrais: Schema = {
  id: "partage-frais",
  titre: "Partager une dépense : décimal ÷ entier",
  notion: "décimal ÷ entier",
  roles: ["occasion", "qui", "depA", "depB", "depC", "parts", "aide"],

  structure(niveau): Structure {
    const v: Structure["variables"] = { pA: E, pB: E, n: N, part: E, apartager: E };
    const r: Relation[] = [prod("apartager", "part", "n", { a: "Partage" })];
    const tirage: Structure["tirage"] = [
      { v: "n", plage: niveau === 1 ? { min: 2, max: 5 } : { min: 3, max: 12 } },
      { v: "part", plage: niveau === 1 ? { min: 4, max: 20, pas: 0.5 } : { min: 6, max: 45, pas: 0.05 } },
    ];
    // on tire la part d'abord pour que le partage tombe juste, puis on découpe le total en dépenses
    if (niveau === 1) {
      r.push(union("apartager", "pA", "pB"));
      tirage.push({ v: "pA", f: (w, { rng }) => Q.of(rng.int(Math.ceil(w.apartager.toNumber() * 0.3), Math.floor(w.apartager.toNumber() * 0.7))) });
    } else {
      v.pC = E; v.pAB = E;
      const total = niveau === 3 ? "total" : "apartager";
      if (niveau === 3) { v.total = E; v.aide = E; r.push(retrait("total", "apartager", "aide")); }
      r.push(union("pAB", "pA", "pB"), union(total, "pAB", "pC"));
      if (niveau === 3) tirage.push({ v: "aide", plage: { min: 10, max: 80, pas: 5 } });
      tirage.push(
        { v: "pA", f: (w, { rng }) => Q.from((rng.int(20, 45) * w[total].toNumber() / 100).toFixed(2)).mul(20).floor().div(20) },
        { v: "pB", f: (w, { rng }) => Q.from((rng.int(20, 40) * w[total].toNumber() / 100).toFixed(2)).mul(20).floor().div(20) },
      );
    }
    const dep = niveau === 1 ? ["pA", "pB"] : ["pA", "pB", "pC"];
    const extra = niveau === 3 ? ["aide"] : [];
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: "part", donnees: [...dep, ...extra, "n"] },
      j2: [{ inconnue: "pB", donnees: [...dep.filter((x) => x !== "pB"), ...extra, "n", "part"] }],
      contraintes: (w) => (Object.values(w).some((x) => x.isNegative) || (w.pC && w.pC.cmp(1) < 0) || w.pB.cmp(1) < 0 ? "dépense négative" : null),
    };
  },

  textes: {
    phrases: [
      [{ t: "[occasion], [qui] fait les dépenses suivantes." }],
      [{ vars: ["pA"], t: "[depA] coûte {pA}." }],
      [
        { vars: ["pB"], t: "[depB] coûte {pB}." },
        { t: "Il faut aussi payer [depB]." },
      ],
      [{ vars: ["pC"], t: "[depC] coûte {pC}." }],
      [{ vars: ["aide"], t: "[aide] {aide}." }],
      [
        { vars: ["n", "part"], t: "La somme à payer est partagée en parts égales entre {n} [parts:n] : chacun paie {part}." },
        { vars: ["n"], t: "La somme à payer est partagée en parts égales entre {n} [parts:n]." },
      ],
    ],
    questions: {
      part: "Combien chacun doit-il payer ?",
      pB: "Combien coûte [depB] ?",
    },
    guidees: { apartager: "Quelle somme faut-il partager ?" },
    libelles: { pAB: "deux premières dépenses", total: "total des dépenses", apartager: "somme à partager", part: "part de chacun", pB: "prix [de:depB]" },
    reponses: { part: "Chacun doit payer {part}.", pB: "[depB] coûte {pB}." },
  },
};
