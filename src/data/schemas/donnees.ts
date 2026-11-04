/**
 * Organisation et gestion de données.
 *  - « tableau »    : tableau à double entrée (ventes par jour et par article), habillage « achat-unite »
 *  - « graphique »  : diagramme en barres (★), courbe (★★), diagramme circulaire en % (★★★), facette « serie »
 * Les cases inutiles du tableau sont des leurres : ce sont des données parasites.
 */
import { Q } from "../../core/rational";
import type { Niveau, Relation, Schema, SpecVisuel, Structure } from "../../core/types";
import { constante, E, ecart, N, prod, union } from "./outils";

const J = ["lundi", "mardi", "mercredi", "jeudi"];
const L = (n: number) => ({ leurre: { min: 8, max: 60 } as const, n });

export const tableau: Schema = {
  id: "tableau", herite: "achat-unite",
  titre: "Lecture d'un tableau à double entrée", notion: "tableaux à double entrée",
  roles: ["lieu", "artA", "artB"],
  visuel: (niveau: Niveau): SpecVisuel => ({
    type: "tableau",
    titre: "Ventes [lieu]",
    colonnes: ["", ...J.slice(0, niveau === 1 ? 3 : 4)],
    lignes: [
      { label: "[artA:pl]", cases: niveau === 1 ? ["a1", "a2", L(1)] : ["a1", "a2", "a3", L(1)] },
      { label: "[artB:pl]", cases: niveau === 1 ? [L(2), L(3), L(4)] : niveau === 2 ? [L(2), L(3), L(4), L(5)] : ["b1", "b2", L(3), "b4"] },
    ].map((l) => ({ label: l.label, cases: l.cases.map((c) => (typeof c === "string" ? c : { leurre: c.leurre })) })),
  }),
  structure(niveau): Structure {
    const v: Structure["variables"] = { a1: N, a2: N, totA: N, pu: E, recA: E };
    const r: Relation[] = [];
    const tirage: Structure["tirage"] = [
      { v: "a1", plage: { min: 8, max: 60 } }, { v: "a2", plage: { min: 8, max: 60 } },
      { v: "pu", plage: niveau === 1 ? { min: 1, max: 4 } : { min: 0.5, max: 3, pas: 0.1 } },
    ];
    let fin: string, base: string[];
    if (niveau === 1) {
      // ★ : article A sur deux jours, comparé à l'article B le lundi, puis recette de A
      v.b1 = N; v.ecartAB = N;
      r.push(union("totA", "a1", "a2"), prod("recA", "pu", "totA"));
      tirage.push({ v: "b1", plage: { min: 8, max: 60 } });
      fin = "recA"; base = ["a1", "a2", "pu"];
      delete v.ecartAB; delete v.b1;
      return { variables: v, relations: r, tirage, j1: { inconnue: fin, donnees: base }, j2: [{ inconnue: "a2", donnees: ["a1", "pu", "recA"] }] };
    }
    v.a3 = N; v.a12 = N;
    r.push(union("a12", "a1", "a2"), union("totA", "a12", "a3"), prod("recA", "pu", "totA"));
    tirage.push({ v: "a3", plage: { min: 8, max: 60 } });
    if (niveau === 2) {
      v.b3 = N; v.ecart = N;
      r.push(ecart("a3", "b3", "ecart"));
      tirage.push({ v: "b3", f: (w, { rng }) => Q.of(rng.int(3, Math.max(3, w.a3.toNumber() - 2))) });
      // ★★ : recette de A sur trois jours
      fin = "recA"; base = ["a1", "a2", "a3", "pu"];
      delete v.b3; delete v.ecart; r.pop();
      return { variables: v, relations: r, tirage, j1: { inconnue: fin, donnees: base }, j2: [{ inconnue: "a3", donnees: ["a1", "a2", "pu", "recA"] }] };
    }
    // ★★★ : recettes de A (trois jours) et de B (deux jours), recette totale
    v.b1 = N; v.b2 = N; v.b4 = N; v.b12 = N; v.totB = N; v.puB = E; v.recB = E; v.total = E;
    r.push(union("b12", "b1", "b2"), union("totB", "b12", "b4"), prod("recB", "puB", "totB"), union("total", "recA", "recB"));
    tirage.push({ v: "b1", plage: { min: 8, max: 60 } }, { v: "b2", plage: { min: 8, max: 60 } }, { v: "b4", plage: { min: 8, max: 60 } }, { v: "puB", plage: { min: 0.5, max: 3, pas: 0.1 } });
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: "total", donnees: ["a1", "a2", "a3", "pu", "b1", "b2", "b4", "puB"] },
      j2: [{ inconnue: "b4", donnees: ["a1", "a2", "a3", "pu", "b1", "b2", "puB", "total"] }],
      contraintes: (w) => (w.pu.eq(w.puB) ? "prix identiques" : null),
    };
  },
  textes: {
    phrases: [
      [{ t: "Le tableau indique le nombre d'articles vendus [lieu] chaque jour." }],
      [
        { vars: ["pu", "puB"], t: "[un:artA] [artA] coûte {pu} et [un:artB] [artB] coûte {puB}." },
        { vars: ["pu"], t: "[un:artA] [artA] coûte {pu}." },
      ],
      [
        { vars: ["recA"], niveaux: [1], t: "La vente des [artA:pl] du lundi et du mardi a rapporté {recA}." },
        { vars: ["recA"], niveaux: [2], t: "La vente des [artA:pl] du lundi au mercredi a rapporté {recA}." },
        { vars: ["total"], t: "En tout, les ventes du tableau ont rapporté {total}." },
      ],
    ],
    questions: {
      recA: [
        { niveaux: [1], t: "Combien a rapporté la vente des [artA:pl] le lundi et le mardi ?" },
        { t: "Combien a rapporté la vente des [artA:pl] du lundi au mercredi ?" },
      ],
      total: "Combien ont rapporté en tout les ventes de [artA:pl] (lundi, mardi, mercredi) et de [artB:pl] (lundi, mardi, jeudi) ?",
      a2: "Combien de [artA:pl] a-t-on vendus le mardi ?",
      a3: "Combien de [artA:pl] a-t-on vendus le mercredi ?",
      b4: "Combien de [artB:pl] a-t-on vendus le jeudi ?",
    },
    guidees: { totA: "Combien de [artA:pl] a-t-on vendus le lundi et le mardi ?" },
    libelles: { a12: "[artA:pl] lundi et mardi", totA: "[artA:pl] vendus", recA: "recette des [artA:pl]", b12: "[artB:pl] lundi et mardi", totB: "[artB:pl] vendus", recB: "recette des [artB:pl]", total: "recette totale", a2: "[artA:pl] le mardi", a3: "[artA:pl] le mercredi", b4: "[artB:pl] le jeudi" },
    reponses: {
      recA: "La vente des [artA:pl] a rapporté {recA}.", total: "Les ventes ont rapporté {total} en tout.",
      a2: "On a vendu {a2} [artA:a2] le mardi.", a3: "On a vendu {a3} [artA:a3] le mercredi.", b4: "On a vendu {b4} [artB:b4] le jeudi.",
    },
  },
};

// ---------- graphiques ----------
export const graphique: Schema = {
  id: "graphique", herite: "serie",
  titre: "Lecture de graphiques", notion: "graphiques",
  roles: ["titreG", "obj", "c1", "c2", "c3", "c4", "c5", "prixPhrase", "titreS", "objS", "s1", "s2", "s3", "s4"],
  visuel: (niveau: Niveau): SpecVisuel => niveau === 3
    ? { type: "secteurs", titre: "[titreS] (en %)", colonnes: ["[s1]", "[s2]", "[s3]", "[s4]"], unite: "%", lignes: [{ label: "", cases: ["p1", "p2", "p3", "p4"] }] }
    : {
      type: niveau === 1 ? "barres" : "courbe", titre: "[titreG]", colonnes: ["[c1]", "[c2]", "[c3]", "[c4]", "[c5]"], unite: "[obj:pl]",
      lignes: [{ label: "", cases: niveau === 1 ? ["x1", "x2", "x3", { leurre: { min: 20, max: 120, pas: 10 } }, { leurre: { min: 20, max: 120, pas: 10 } }] : ["x1", "x2", "x3", "x4", "x5"] }],
    },
  structure(niveau): Structure {
    if (niveau === 3) {
      // diagramme circulaire : pourcentages, total connu → effectif d'une catégorie, puis écart
      // tous les pourcentages sont affichés sur le diagramme, même ceux qui ne servent pas
      const P = { grandeur: "pourcent", visible: true } as const;
      const v: Structure["variables"] = { p1: P, p2: P, p3: P, p4: P, T: N, cent: constante(100), un: { grandeur: "quantite" }, n1: N, n2: N, ec: N };
      const r: Relation[] = [
        prod("T", "un", "cent", { a: "Pourcentage" }), prod("n1", "un", "p1", { c: "Pourcentage" }), prod("n2", "un", "p2", { c: "Pourcentage" }),
        ecart("n1", "n2", "ec"),
      ];
      const tirage: Structure["tirage"] = [
        { v: "p1", f: (_, { rng }) => Q.of(5 * rng.int(6, 10)) },
        { v: "p2", f: (w, { rng }) => Q.of(5 * rng.int(2, Math.max(2, (95 - w.p1.toNumber()) / 5 - 3))) },
        { v: "p3", f: (w, { rng }) => Q.of(5 * rng.int(1, Math.max(1, (100 - w.p1.toNumber() - w.p2.toNumber()) / 5 - 1))) },
        { v: "p4", f: (w) => Q.of(100).sub(w.p1).sub(w.p2).sub(w.p3) },
        { v: "T", f: (_, { rng }) => Q.of(20 * rng.int(5, 40)) },
      ];
      return {
        variables: v, relations: r, tirage,
        j1: { inconnue: "ec", donnees: ["p1", "p2", "T"] },
        j2: [{ inconnue: "T", donnees: ["p1", "n1"] }],
        contraintes: (w) => (w.p4.cmp(5) < 0 || w.p2.cmp(w.p1) >= 0 || !w.n1.isInteger || !w.n2.isInteger ? "répartition impossible" : null),
      };
    }
    const xs = niveau === 1 ? ["x1", "x2", "x3"] : ["x1", "x2", "x3", "x4", "x5"];
    const v: Structure["variables"] = Object.fromEntries([...xs, "s12"].map((x) => [x, N]));
    const pas = niveau === 1 ? 10 : 5;
    const tirage: Structure["tirage"] = xs.map((x) => ({ v: x, plage: { min: pas * 2, max: pas * 12, pas } }));
    if (niveau === 1) {
      // ★ : total de deux jours, comparé à un troisième
      v.ec = N;
      return {
        variables: v,
        relations: [union("s12", "x1", "x2"), ecart("s12", "x3", "ec")],
        tirage,
        j1: { inconnue: "ec", donnees: ["x1", "x2", "x3"] },
        j2: [{ inconnue: "x2", donnees: ["x1", "x3", "ec"] }],
        contraintes: (w) => (w.s12.cmp(w.x3) <= 0 ? "écart négatif" : null),
      };
    }
    // ★★ : total des cinq jours, puis recette
    v.s123 = N; v.s1234 = N; v.s = N; v.pu = E; v.rec = E;
    return {
      variables: v,
      relations: [union("s12", "x1", "x2"), union("s123", "s12", "x3"), union("s1234", "s123", "x4"), union("s", "s1234", "x5"), prod("rec", "pu", "s")],
      tirage: [...tirage, { v: "pu", plage: { min: 2, max: 8, pas: 0.5 } }],
      j1: { inconnue: "rec", donnees: ["x1", "x2", "x3", "x4", "x5", "pu"] },
      j2: [{ inconnue: "x4", donnees: ["x1", "x2", "x3", "x5", "pu", "rec"] }],
    };
  },
  textes: {
    phrases: [
      [{ niveaux: [1, 2], t: "Le graphique ci-dessous présente [titreG]." }, { t: "Le graphique ci-dessous présente [titreS]." }],
      [{ vars: ["T"], t: "En tout, on compte {T} [objS:T]." }],
      [{ vars: ["pu"], t: "[prixPhrase] {pu}." }],
      [{ vars: ["ec"], niveaux: [1], t: "Le [c1] et le [c2] ensemble, il y a {ec} [obj:ec] de plus que le [c3]." }, { vars: ["rec"], t: "En tout, cela a rapporté {rec}." }, { vars: ["n1"], t: "Cela représente {n1} [objS:n1] pour « [s1] »." }],
    ],
    questions: {
      ec: [
        { niveaux: [1], t: "Combien de [obj:pl] y a-t-il eu de plus le [c1] et le [c2] ensemble que le [c3] ?" },
        { niveaux: [3], t: "Combien de [objS:pl] de plus y a-t-il pour « [s1] » que pour « [s2] » ?" },
      ],
      rec: "Combien cela a-t-il rapporté en tout ?",
      x2: "Combien de [obj:pl] y a-t-il eu le [c2] ?",
      x4: "Combien de [obj:pl] y a-t-il eu le [c4] ?",
      T: "Combien y a-t-il de [objS:pl] en tout ?",
    },
    guidees: { s12: "Combien de [obj:pl] y a-t-il eu le [c1] et le [c2] ensemble ?" },
    libelles: { s12: "[c1] + [c2]", s123: "trois premiers jours", s1234: "quatre premiers jours", s: "total", rec: "recette", ec: "écart", un: "1 % du total", n1: "[objS:pl] pour « [s1] »", n2: "[objS:pl] pour « [s2] »", T: "total", x2: "valeur du [c2]", x4: "valeur du [c4]" },
    reponses: {
      ec: [{ niveaux: [1], t: "Il y a eu {ec} [obj:ec] de plus." }, { t: "Il y a {ec} [objS:ec] de plus pour « [s1] »." }],
      rec: "Cela a rapporté {rec}.", x2: "Il y a eu {x2} [obj:x2] le [c2].", x4: "Il y a eu {x4} [obj:x4] le [c4].", T: "Il y a {T} [objS:T] en tout.",
    },
  },
};
