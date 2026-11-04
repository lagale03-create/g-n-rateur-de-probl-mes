/**
 * Période 5 : probabilités, partages inégaux, essais et ajustements.
 */
import { Q } from "../../core/rational";
import type { Relation, Schema, Structure } from "../../core/types";
import { constante, ecart, N, prod, retrait, union } from "./outils";

// ---------- probabilités ----------
export const probabilite: Schema = {
  id: "probabilite", herite: "proba",
  titre: "Probabilités : combien de chances sur combien ?", notion: "probabilités",
  roles: ["contenant", "objA", "objB", "objC", "objet", "tirer", "tirerInf"],
  structure(niveau): Structure {
    const v: Structure["variables"] = { a: N, b: N, c: N, ab: N, T: N, pb: { grandeur: "proba", ratio: ["b", "T"] } };
    const r: Relation[] = [union("ab", "a", "b"), union("T", "ab", "c"), { type: "mul", c: "b", a: "pb", b: "T", noms: { a: "Probabilité", c: "Fraction d'une quantité" } }];
    const max = niveau === 1 ? 8 : niveau === 2 ? 15 : 30;
    const tirage: Structure["tirage"] = [{ v: "a", plage: { min: 2, max } }, { v: "b", plage: { min: 1, max } }, { v: "c", plage: { min: 2, max } }];
    let fin = "pb", base = ["a", "b", "c"];
    if (niveau >= 2) {
      // on retire d'abord k objets du premier type
      v.k = N; v.a2 = N; v.ab2 = N; v.T2 = N; v.pb2 = { grandeur: "proba", ratio: ["b", "T2"] };
      r.push(retrait("a", "a2", "k"), union("ab2", "a2", "b"), union("T2", "ab2", "c"), { type: "mul", c: "b", a: "pb2", b: "T2", noms: { a: "Probabilité" } });
      tirage.push({ v: "k", f: (w, { rng }) => Q.of(rng.int(1, Math.max(1, w.a.toNumber() - 1))) });
      base = ["a", "b", "c", "k"]; fin = "pb2";
    }
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: fin, donnees: base },
      j2: [{ inconnue: "c", donnees: ["a", "pb", "T"] }],
      contraintes: (w) => (w.a.eq(w.b) || w.b.eq(w.c) ? "quantités identiques" : null),
    };
  },
  textes: {
    phrases: [
      [{ vars: ["a", "b", "c"], t: "Dans [contenant], il y a {a} [objA:a], {b} [objB:b] et {c} [objC:c]." },
        { vars: ["a", "T"], t: "Dans [contenant], il y a {T} [objet:T] : des [objA:pl], des [objB:pl] et des [objC:pl]. Il y a {a} [objA:a]." }],
      [{ vars: ["k"], t: "On retire {k} [objA:k] [du:contenant]." }],
      [{ vars: ["pb"], t: "On a {pb} de [tirerInf] [un:objB] [objB]." }],
    ],
    questions: {
      pb: "On [tirer] [un:objet] [objet] au hasard. Combien a-t-on de chances de [tirerInf] [un:objB] [objB] ?",
      pb2: "Ensuite, on [tirer] [un:objet] [objet] au hasard. Combien a-t-on de chances de [tirerInf] [un:objB] [objB] ?",
      c: "Combien y a-t-il de [objC:pl] ?",
    },
    guidees: { b: "Combien y a-t-il de [objB:pl] ?", ab: "Combien y a-t-il de [objA:pl] et de [objB:pl] ensemble ?", T: "Combien y a-t-il de [objet:pl] en tout ?" },
    libelles: { ab: "[objA:pl] et [objB:pl]", T: "nombre total de [objet:pl]", a2: "[objA:pl] qui restent", ab2: "[objA:pl] et [objB:pl] après le retrait", T2: "[objet:pl] après le retrait", pb: "chances de [tirerInf] [un:objB] [objB]", pb2: "chances de [tirerInf] [un:objB] [objB]", b: "nombre de [objB:pl]", c: "nombre de [objC:pl]" },
    reponses: { pb: "On a {pb} de [tirerInf] [un:objB] [objB].", pb2: "On a {pb2} de [tirerInf] [un:objB] [objB].", c: "Il y a {c} [objC:c]." },
  },
};

// ---------- partages inégaux ----------
export const partageInegal: Schema = {
  id: "partage-inegal", herite: "comparaison",
  titre: "Partages inégaux (schéma en barres)", notion: "partages inégaux",
  roles: ["lieu", "obj", "verbe", "pp"],
  structure(niveau): Structure {
    const PI = { a: "Partage inégal", b: "Partage inégal" } as const;
    if (niveau === 2) {
      // B en a k fois plus que A : T = A × (k + 1)
      const v: Structure["variables"] = { T: N, k: N, un: constante(1), parts: N, A: N, B: N };
      return {
        variables: v,
        relations: [union("parts", "k", "un"), prod("T", "A", "parts", { a: "Partage inégal" }), prod("B", "A", "k", { c: "Réitération" })],
        tirage: [{ v: "k", plage: { min: 2, max: 5 } }, { v: "A", plage: { min: 5, max: 40 } }],
        j1: { inconnue: "B", donnees: ["T", "k"] },
        j2: [{ inconnue: "T", donnees: ["B", "k"] }],
      };
    }
    // ★ : deux enfants, écart e   ★★★ : trois enfants, écarts e1 et e2 avec le premier
    const v: Structure["variables"] = { T: N, e1: N, D1: N, A: N, B: N };
    const r: Relation[] = [ecart("B", "A", "e1")];
    const tirage: Structure["tirage"] = [{ v: "A", plage: niveau === 1 ? { min: 5, max: 30 } : { min: 20, max: 150 } }, { v: "e1", plage: niveau === 1 ? { min: 2, max: 12 } : { min: 5, max: 40 } }];
    if (niveau === 1) {
      v.deux = constante(2);
      r.push(retrait("T", "D1", "e1"), prod("D1", "A", "deux", PI), union("T", "A", "B"));
      return {
        variables: v, relations: r, tirage,
        j1: { inconnue: "B", donnees: ["T", "e1"] },
        j2: [{ inconnue: "T", donnees: ["B", "e1"] }],
      };
    }
    v.e2 = N; v.C = N; v.D2 = N; v.trois = constante(3); v.AB = N;
    r.push(ecart("C", "A", "e2"), retrait("T", "D1", "e1"), retrait("D1", "D2", "e2"), prod("D2", "A", "trois", PI), union("AB", "A", "B"), union("T", "AB", "C"));
    tirage.push({ v: "e2", plage: { min: 5, max: 40 } });
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: "C", donnees: ["T", "e1", "e2"] },
      j2: [{ inconnue: "T", donnees: ["A", "e1", "e2"] }],
      contraintes: (w) => (w.e1.eq(w.e2) ? "écarts identiques" : null),
    };
  },
  textes: {
    phrases: [
      [
        { vars: ["T"], niveaux: [1, 2], t: "[lieu], [prenom] et [prenom2] [verbe:pl] {T} [obj:T] à eux deux." },
        { vars: ["T"], niveaux: [3], t: "[lieu], [prenom], [prenom2] et [prenom3] [verbe:pl] {T} [obj:T] à eux trois." },
        { vars: ["A"], t: "[lieu], [prenom] [verbe] {A} [obj:A]." },
        { vars: ["B"], t: "[lieu], [prenom2] [verbe] {B} [obj:B]." },
      ],
      [
        { vars: ["k", "B"], t: "C'est {k} fois plus que [prenom]." },
        { vars: ["k"], t: "[prenom2] en [verbe] {k} fois plus que [prenom]." },
        { vars: ["e1", "B"], t: "C'est {e1} de plus que [prenom]." },
        { vars: ["e1"], t: "[prenom2] en [verbe] {e1} de plus que [prenom]." },
      ],
      [{ vars: ["e2"], t: "[prenom3] en [verbe] {e2} de plus que [prenom]." }],
    ],
    questions: {
      B: "Combien de [obj:pl] [prenom2] a-t-[il:prenom2] [pp] ?",
      C: "Combien de [obj:pl] [prenom3] a-t-[il:prenom3] [pp] ?",
      T: [{ niveaux: [3], t: "Combien de [obj:pl] les trois enfants ont-ils [pp] en tout ?" }, { t: "Combien de [obj:pl] les deux enfants ont-ils [pp] en tout ?" }],
    },
    guidees: { D1: "Si [prenom2] n'avait pas ses {e1} [obj:pl] de plus, combien y en aurait-il en tout ?", A: "Combien de [obj:pl] [prenom] a-t-[il:prenom] [pp] ?" },
    libelles: { D1: "total sans l'écart (deux parts égales)", D2: "total sans les écarts (trois parts égales)", A: "[obj:pl] [de:prenom]", B: "[obj:pl] [de:prenom2]", C: "[obj:pl] [de:prenom3]", parts: "nombre de parts égales", AB: "[obj:pl] [de:prenom] et [de:prenom2]", T: "total" },
    reponses: { B: "[prenom2] en [verbe] {B}.", C: "[prenom3] en [verbe] {C}.", T: "Ensemble, ils en ont [pp] {T}." },
  },
};

// ---------- essais et ajustements ----------
export const deuxSortes: Schema = {
  id: "deux-sortes", herite: "deux-sortes",
  titre: "Problèmes de recherche : essais et ajustements", notion: "problèmes de recherche",
  roles: ["lieu", "sA", "sB", "unite", "valeur", "vA", "vB", "tous"],
  structure(niveau, cs): Structure {
    const val = (m: unknown) => Number(typeof m === "string" ? m : (m as { s: string }).s);
    const vA = val(cs.mots.vA), vB = val(cs.mots.vB);
    const EA = { c: "Essais et ajustements", a: "Essais et ajustements", b: "Essais et ajustements" } as const;
    const v: Structure["variables"] = {
      N: N, T: N, va: constante(vA), vb: constante(vB), dv: N, min: N, manque: N, nB: N, nA: N,
    };
    const r: Relation[] = [
      prod("min", "va", "N", EA), { type: "add", c: "vb", a: "va", b: "dv", noms: { b: "Différence" } },
      retrait("T", "min", "manque"), prod("manque", "dv", "nB", { b: "Essais et ajustements" }), union("N", "nA", "nB"),
    ];
    const max = niveau === 1 ? 12 : niveau === 2 ? 30 : 80;
    return {
      variables: v, relations: r,
      tirage: [
        { v: "nA", plage: { min: 2, max } }, { v: "nB", plage: { min: 2, max } },
        { v: "T", f: (w) => w.nA.mul(vA).add(w.nB.mul(vB)) },
      ],
      j1: { inconnue: "nB", donnees: ["N", "T"] },
      j2: [{ inconnue: "T", donnees: ["nA", "nB"] }],
      contraintes: (w) => (w.nA.eq(w.nB) ? "autant de chaque sorte" : null),
    };
  },
  textes: {
    phrases: [
      [
        { vars: ["N", "T"], t: "[lieu], il y a des [sA:pl] et des [sB:pl] : {N} [unite:N] et {T} [valeur:T] en tout." },
        { vars: ["nA", "nB"], t: "[lieu], il y a {nA} [sA:nA] et {nB} [sB:nB]." },
      ],
      [{ t: "On sait que [un:sA] [sA] a {va} [valeur:va] et [un:sB] [sB] en a {vb}." }],
    ],
    questions: {
      nB: "Combien y a-t-il de [sB:pl] ?",
      T: "Combien y a-t-il de [valeur:pl] en tout ?",
    },
    guidees: { N: "Combien y a-t-il de [unite:pl] en tout ?", nB: "Combien y a-t-il de [sB:pl] ?", min: "Si [tous] étaient des [sA:pl], combien y aurait-il de [valeur:pl] ?", manque: "Combien de [valeur:pl] manque-t-il ?", dv: "Combien [un:sB] [sB] a-t-[il:sB] de [valeur:pl] de plus que [un:sA] [sA] ?" },
    libelles: { min: "si [tous] étaient des [sA:pl]", manque: "[valeur:pl] qui manquent", dv: "[valeur:pl] de plus pour [un:sB] [sB]", nB: "nombre de [sB:pl]", nA: "nombre de [sA:pl]", T: "total" },
    reponses: { nB: "Il y a {nB} [sB:nB] (et {nA} [sA:nA]).", T: "Il y a {T} [valeur:T] en tout." },
  },
};
