/**
 * Schéma « division et interprétation du reste ».
 *   ★   : nA + nB personnes (ou objets), contenants de cap places → combien de contenants ? (arrondi supérieur)
 *   ★★  : … puis prix de la location ou de l'achat des contenants
 *   ★★★ : … avec des absents, puis prix
 * Jour 2 « à rebours » : « on remplit q contenants et il en reste r » → retrouver un effectif ;
 * ou retrouver le prix d'un contenant à partir du prix total (partage).
 *
 * Mots attendus : intro (« Pour la sortie, l'école emmène »), persA, persB, pers (nom général),
 * cont, contient (« peut transporter »), prixPhrase (« La location d'un bus coûte »),
 * coutPhrase (« En tout, la location des bus coûte »), qcout, rcout, remplir (« On remplit »),
 * plein (« complètement »), sans (« sans place »), dansCont (« dans les bus pleins »),
 * absent (« sont malades et ne viennent pas »).
 */
import type { Relation, Schema, Structure, VarDef } from "../../core/types";
import { partDe } from "./outils";

const n: VarDef = { grandeur: "compte" };
const e: VarDef = { grandeur: "euro" };
const union = (c: string, a: string, b: string): Relation => ({ type: "add", c, a, b, noms: { c: "Union", a: "Différence", b: "Différence" } });

export const divisionReste: Schema = {
  id: "division-reste",
  titre: "Division et interprétation du reste",
  notion: "division",
  roles: ["intro", "persA", "persB", "pers", "cont", "contient", "prixPhrase", "coutPhrase", "qcout", "rcout", "remplir", "plein", "sans", "dansCont", "absent"],

  structure(niveau): Structure {
    const v: Record<string, VarDef> = { nA: n, nB: n, cap: n, total: n, nb: n, q: n, prod: n, reste: n };
    const r: Relation[] = [
      { type: "ceil", c: "nb", a: "total", b: "cap" },
      { type: "quot", c: "q", a: "total", b: "cap" },
      { type: "mul", c: "prod", a: "cap", b: "q", noms: { c: "Réitération" } },
      { type: "add", c: "total", a: "prod", b: "reste", noms: { c: "Union", b: "Différence" } },
    ];
    if (niveau === 3) {
      v.t0 = n; v.abs = n;
      r.push(union("t0", "nA", "nB"), { type: "add", c: "t0", a: "total", b: "abs", noms: { c: "Recherche de l'état initial", a: "Retrait", b: "Différence" } });
    } else r.push(union("total", "nA", "nB"));
    if (niveau >= 2) {
      v.prix = e; v.cout = e;
      r.push({ type: "mul", c: "cout", a: "prix", b: "nb", noms: { c: "Réitération", a: "Partage", b: "Groupement" } });
    }
    const pl = niveau === 1
      ? { nA: { min: 8, max: 30 }, nB: { min: 8, max: 30 }, cap: { min: 4, max: 10 } }
      : { nA: { min: 20, max: 80 }, nB: { min: 20, max: 80 }, cap: { min: 6, max: 30 } };
    const tirage: Structure["tirage"] = [{ v: "nA", plage: pl.nA }, { v: "nB", plage: pl.nB }];
    if (niveau === 3) tirage.push({ v: "abs", f: (w, { rng }) => partDe(w.t0, rng, 0.03, 0.12) });
    tirage.push({ v: "cap", plage: pl.cap });
    if (niveau >= 2) tirage.push({ v: "prix", plage: { min: 2, max: 12 } });
    const eff = niveau === 3 ? ["nA", "nB", "abs"] : ["nA", "nB"];
    const j1 = niveau === 1 ? "nb" : "cout";
    return {
      variables: v,
      relations: r,
      tirage,
      j1: { inconnue: j1, donnees: [...eff, "cap", ...(niveau >= 2 ? ["prix"] : [])] },
      j2: [
        // à rebours : « on remplit q contenants et il en reste r » → effectif d'un groupe
        { inconnue: "nB", donnees: [...eff.filter((x) => x !== "nB"), "cap", "q", "reste"] },
        ...(niveau >= 2 ? [{ inconnue: "prix", donnees: [...eff, "cap", "cout"] }] : []),
      ],
      contraintes: (w) => {
        if (w.reste.n === 0) return "pas de reste : rien à interpréter";
        if (w.q.cmp(1) < 0) return "un seul contenant";
        if (w.nb.cmp(30) > 0) return "trop de contenants";
        return null;
      },
    };
  },

  textes: {
    phrases: [
      [
        { vars: ["nA", "nB"], t: "[intro] {nA} [persA:nA] et {nB} [persB:nB]." },
        { vars: ["nA"], t: "[intro] {nA} [persA:nA] et des [persB:pl]." },
      ],
      [{ vars: ["abs"], t: "Le jour venu, {abs} [pers:abs] [absent]." }],
      [{ vars: ["cap"], t: "Chaque [cont] [contient] {cap} [pers:cap]." }],
      [{ vars: ["q", "reste"], t: "[remplir] {q} [cont:q] [plein] et il reste {reste} [pers:reste] [sans]." }],
      [
        { vars: ["prix"], t: "[prixPhrase] {prix}." },
        { vars: ["cout"], t: "[coutPhrase] {cout}." },
      ],
    ],
    questions: {
      nb: "Combien de [cont:pl] faut-il ?",
      cout: "[qcout]",
      nB: "Combien y a-t-il de [persB:pl] ?",
      prix: "Quel est le prix [dun:cont] [cont] ?",
    },
    guidees: {
      total: "Combien de [pers:pl] y a-t-il en tout ?",
      prod: "Combien de [pers:pl] y a-t-il [dansCont] ?",
    },
    libelles: {
      t0: "nombre de [pers:pl] prévu",
      total: "nombre de [pers:pl] à placer",
      nb: "[cont:pl] nécessaires",
      q: "[cont:pl] [plein]",
      prod: "[pers:pl] [dansCont]",
      reste: "[pers:pl] [sans]",
      cout: "prix total",
      prix: "prix [dun:cont] [cont]",
      nB: "nombre de [persB:pl]",
    },
    reponses: {
      nb: "Il faut {nb} [cont:nb].",
      cout: "[rcout] {cout}.",
      nB: "Il y a {nB} [persB:nB].",
      prix: "[un:cont] [cont] coûte {prix}.",
    },
  },
};
