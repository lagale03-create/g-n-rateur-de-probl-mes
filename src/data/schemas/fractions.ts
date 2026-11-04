/**
 * Schémas sur les fractions.
 *  - « fraction-quantite » : les 3⁄4 de 28 élèves (partage puis réitération), puis le reste…
 *  - « retrouver-tout »    : les 3⁄4 des élèves, c'est 21 élèves : combien en tout ?
 *  - « fractions-somme »   : 1⁄8 + 3⁄8 de la tarte, quelle fraction reste ? quelle quantité ?
 * Dénominateurs : ★ 2, 4, 10 ; ★★ 2, 3, 4, 5, 10 ; ★★★ 3, 4, 5, 6, 8, 10 (et 100 pour fraction-quantite).
 * Habillage : facette « fraction » (obj, ensemble, groupe1, groupe2, groupe3) et « fractions-somme ».
 */
import { Q } from "../../core/rational";
import type { Niveau, Relation, Schema, Structure } from "../../core/types";
import { constante, N, prod, retrait } from "./outils";

const DENS: Record<Niveau, number[]> = { 1: [2, 4, 10], 2: [2, 3, 4, 5, 10], 3: [3, 4, 5, 6, 8, 10, 100] };

/** Tirage d'une fraction : dénominateur de la liste, numérateur entre 1 et den − 1. */
function tirageFraction(pre: string, niveau: Niveau, unitaire = false): Structure["tirage"] {
  return [
    { v: `${pre}den`, f: (_, { rng }) => Q.of(rng.pick(DENS[niveau])) },
    { v: `${pre}num`, f: (w, { rng }) => Q.of(unitaire ? 1 : rng.int(1, w[`${pre}den`].toNumber() - 1)) },
  ];
}

const reste = (tout: string, pre: string) => (pre === "a" ? "reste" : tout === "reste" ? "reste2" : `${tout}_reste`);

/** Variables et relations d'une « fraction d'une quantité » : u = tout ÷ den ; part = u × num ; autres = u × (den − num). */
function fractionDe(tout: string, part: string, pre: string): { v: Structure["variables"]; r: Relation[] } {
  return {
    v: { [`${pre}den`]: N, [`${pre}num`]: N, [`${pre}u`]: N, [`${pre}comp`]: N, [part]: N },
    r: [
      // fraction complémentaire : den − num (les « autres »)
      { type: "add", c: `${pre}den`, a: `${pre}num`, b: `${pre}comp`, noms: { b: "Différence" } },
      prod(reste(tout, pre), `${pre}u`, `${pre}comp`, { a: "Retrouver le tout", c: "Fraction d'une quantité" }),
      prod(tout, `${pre}u`, `${pre}den`, { a: "Partage", c: "Retrouver le tout" }),
      prod(part, `${pre}u`, `${pre}num`, { c: "Fraction d'une quantité", a: "Partage" }),
    ],
  };
}

function structureFraction(niveau: Niveau, sens: "part" | "tout"): Structure {
  // ★ : tout → part → reste   ★★ : … puis une fraction du reste   ★★★ : idem, dénominateurs plus variés
  const a = fractionDe("total", "partA", "a");
  const v: Structure["variables"] = { total: N, reste: N, ...a.v };
  const r: Relation[] = [...a.r, retrait("total", "reste", "partA")];
  const tirage: Structure["tirage"] = [
    ...tirageFraction("a", niveau),
    { v: "au", plage: niveau === 1 ? { min: 2, max: 10 } : niveau === 2 ? { min: 3, max: 25 } : { min: 2, max: 40 } },
  ];
  let fin = "reste";
  if (niveau >= 2) {
    const b = fractionDe("reste", "partB", "b");
    Object.assign(v, b.v, { reste2: N });
    r.push(...b.r, retrait("reste", "reste2", "partB"));
    // le reste doit être divisible par le second dénominateur : on choisit ce dénominateur parmi ses diviseurs
    tirage.push(
      { v: "bden", f: (w, { rng }) => {
        const ok = DENS[niveau].filter((d) => d > 1 && w.reste.toNumber() % d === 0);
        return Q.of(ok.length ? rng.pick(ok) : 2);
      } },
      { v: "bnum", f: (w, { rng }) => Q.of(rng.int(1, Math.max(1, w.bden.toNumber() - 1))) },
    );
    fin = "reste2";
  }
  const fA = ["aden", "anum"], fB = niveau >= 2 ? ["bden", "bnum"] : [];
  const j1 = sens === "part"
    ? { inconnue: fin, donnees: ["total", ...fA, ...fB] }
    : { inconnue: "total", donnees: [niveau >= 2 ? "partB" : "partA", ...fA, ...fB] };
  const j2 = sens === "part"
    ? [{ inconnue: "total", donnees: [niveau >= 2 ? "reste2" : "reste", ...fA, ...fB] }]
    : [{ inconnue: fin, donnees: ["total", ...fA, ...fB] }];
  return {
    variables: v, relations: r, tirage, j1, j2,
    contraintes: (w) => {
      if (w.aden.cmp(1) <= 0 || (w.bden && w.bden.cmp(1) <= 0)) return "dénominateur invalide";
      if (w.anum.cmp(w.aden) >= 0) return "fraction ≥ 1";
      if (w.total.cmp(niveau === 1 ? 60 : niveau === 2 ? 400 : 2000) > 0) return "total trop grand";
      return null;
    },
  };
}

const textesFraction = (sens: "part" | "tout"): Schema["textes"] => ({
  phrases: [
    [
      { vars: ["total", "aden"], t: "[ensemble], il y a {total} [obj:total]. {anum/aden} des [obj:pl] [groupe1]." },
      { vars: ["partA", "aden"], t: "[ensemble], {anum/aden} des [obj:pl] [groupe1] : cela fait {partA} [obj:partA]." },
      { vars: ["aden"], t: "[ensemble], {anum/aden} des [obj:pl] [groupe1]." },
    ],
    [
      { vars: ["bden", "partB"], t: "Parmi les autres [obj:pl], {bnum/bden} [groupe2] : cela fait {partB} [obj:partB]." },
      { vars: ["bden"], t: "Parmi les autres [obj:pl], {bnum/bden} [groupe2]." },
    ],
    [
      { vars: ["reste2"], t: "Les {reste2} autres [obj:pl] [groupe3]." },
      { vars: ["reste"], niveaux: [1], t: "Les {reste} autres [obj:pl] [groupe2]." },
    ],
  ],
  questions: {
    reste: "Combien de [obj:pl] [groupe2] ?",
    reste2: "Combien de [obj:pl] [groupe3] ?",
    total: "Combien y a-t-il de [obj:pl] en tout ?",
  },
  guidees: {
    au: "Combien de [obj:pl] représente {1/aden} ?",
    acomp: "Quelle fraction représentent les autres [obj:pl] ?",
    bu: "Combien de [obj:pl] représente {1/bden} des autres ?",
    reste: "Combien reste-t-il de [obj:pl] ?",
    partA: "Combien de [obj:pl] [groupe1] ?",
    total: "Combien y a-t-il de [obj:pl] en tout ?",
  },
  libelles: {
    acomp: "part des autres (en nombre de parts sur {aden})", bcomp: "part des autres (sur {bden})",
    au: "{1/aden} des [obj:pl]", partA: "[obj:pl] qui [groupe1]", reste: "[obj:pl] qui restent", bu: "{1/bden} des autres",
    partB: "[obj:pl] qui [groupe2]", reste2: "[obj:pl] qui [groupe3]", total: "nombre total de [obj:pl]",
  },
  reponses: {
    reste: "{reste} [obj:reste] [groupe2].",
    reste2: "{reste2} [obj:reste2] [groupe3].",
    total: "Il y a {total} [obj:total] en tout.",
  },
});

export const fractionQuantite: Schema = {
  id: "fraction-quantite", herite: "fraction",
  titre: "Fraction d'une quantité", notion: "fraction d'une quantité",
  roles: ["ensemble", "obj", "groupe1", "groupe2", "groupe3"],
  structure: (n) => structureFraction(n, "part"),
  textes: textesFraction("part"),
};

export const retrouverTout: Schema = {
  id: "retrouver-tout", herite: "fraction",
  titre: "Retrouver le tout à partir d'une fraction", notion: "retrouver le tout",
  roles: ["ensemble", "obj", "groupe1", "groupe2", "groupe3"],
  structure: (n) => structureFraction(n, "tout"),
  textes: textesFraction("tout"),
};

// ---------- addition et soustraction de fractions ----------

export const fractionsSomme: Schema = {
  id: "fractions-somme",
  titre: "Addition et soustraction de fractions",
  notion: "addition et soustraction de fractions",
  roles: ["tout", "quantite", "qA", "qB", "qC", "qBq", "qreste"],

  structure(niveau): Structure {
    const F = (den: string) => ({ grandeur: "fraction" as const, den });
    const v: Structure["variables"] = {
      den: N, nA: N, nB: N, fA: F("den"), fB: F("den"), fS: F("den"), un: constante(1), fR: F("den"), Q: { grandeur: "quantite" }, part: { grandeur: "quantite" },
    };
    const r: Relation[] = [
      { type: "add", c: "fS", a: "fA", b: "fB", noms: { c: "Union" } },
      { type: "add", c: "un", a: "fS", b: "fR", noms: { b: "Différence" } },
      { type: "mul", c: "part", a: "fR", b: "Q", noms: { c: "Fraction d'une quantité" } },
    ];
    const dens = niveau === 1 ? [4, 5, 6, 8, 10] : niveau === 2 ? [6, 8, 10, 12] : [8, 10, 12, 100];
    const tirage: Structure["tirage"] = [
      { v: "den", f: (_, { rng }) => Q.of(rng.pick(dens)) },
      { v: "nA", f: (w, { rng }) => Q.of(rng.int(1, Math.max(1, Math.floor(w.den.toNumber() / 3)))) },
      { v: "nB", f: (w, { rng }) => Q.of(rng.int(1, Math.max(1, Math.floor(w.den.toNumber() / 3)))) },
      { v: "fA", f: (w) => w.nA.div(w.den) },
      { v: "fB", f: (w) => w.nB.div(w.den) },
    ];
    if (niveau >= 2) {
      v.nC = N; v.fC = F("den"); v.fAB = F("den");
      r[0] = { type: "add", c: "fAB", a: "fA", b: "fB", noms: { c: "Union" } };
      r.push({ type: "add", c: "fS", a: "fAB", b: "fC", noms: { c: "Union" } });
      tirage.push({ v: "nC", f: (w, { rng }) => Q.of(rng.int(1, Math.max(1, Math.floor(w.den.toNumber() / 4)))) }, { v: "fC", f: (w) => w.nC.div(w.den) });
    }
    // la quantité totale est un multiple du dénominateur, pour que la part soit entière
    tirage.push({ v: "Q", f: (w, { rng }) => w.den.mul(rng.int(2, niveau === 1 ? 10 : 30)) });
    const fr = niveau >= 2 ? ["fA", "fB", "fC"] : ["fA", "fB"];
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: "part", donnees: [...fr, "Q"] },
      j2: [{ inconnue: "fB", donnees: [...fr.filter((x) => x !== "fB"), "fR"] }],
      contraintes: (w) => (w.fR.cmp(0) <= 0 ? "il ne reste rien" : w.fA.eq(w.fB) ? "fractions identiques" : null),
    };
  },

  textes: {
    phrases: [
      [{ vars: ["Q"], t: "[tout] [quantite] {Q}." }, { t: "Voici comment on utilise [tout]." }],
      [{ vars: ["fA"], t: "[qA] {fA} [de:tout]." }],
      [{ vars: ["fB"], t: "[qB] {fB} [de:tout]." }],
      [{ vars: ["fC"], t: "[qC] {fC} [de:tout]." }],
      [{ vars: ["fR"], t: "Il reste alors {fR} [de:tout]." }],
    ],
    questions: {
      part: "[qreste]",
      fB: "[qBq]",
    },
    guidees: { fS: "Quelle fraction [de:tout] a été utilisée en tout ?", fR: "Quelle fraction [de:tout] reste-t-il ?" },
    libelles: { fAB: "fraction utilisée par les deux premiers", fS: "fraction utilisée", fR: "fraction qui reste", part: "quantité qui reste", fB: "fraction cherchée" },
    reponses: { part: "Il reste {part}.", fB: "[qB] {fB} [de:tout]." },
  },
};
