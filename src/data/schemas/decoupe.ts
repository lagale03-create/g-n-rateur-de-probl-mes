/**
 * Schéma « découpe » (décimal × entier) : on coupe des morceaux identiques dans un rouleau.
 *   ★ : n morceaux de q m, reste du rouleau  ★★ : deux longueurs de morceaux  ★★★ : morceaux en cm à convertir.
 * Jour 2 : longueur d'un morceau (partage d'un décimal par un entier), ou longueur du rouleau.
 * Habillage : facette « decoupe » (lieu, qui, matiere, rouleau, objA, objB, usage).
 */
import type { Relation, Schema, Structure } from "../../core/types";
import { constante, mes, N, prod, retrait, union } from "./outils";

export const decoupe: Schema = {
  id: "decoupe",
  titre: "Découpe : décimal × entier",
  notion: "décimal × entier",
  roles: ["lieu", "qui", "matiere", "rouleau", "objA", "objB"],

  structure(niveau): Structure {
    const m = mes("m");
    const U = niveau === 1 ? "uA" : "utilise";
    const v: Structure["variables"] = { R: m, nA: N, qA: m, uA: m, reste: m };
    const r: Relation[] = [prod("uA", "qA", "nA"), retrait("R", "reste", U)];
    const tirage: Structure["tirage"] = [
      { v: "nA", plage: niveau === 1 ? { min: 3, max: 8 } : { min: 4, max: 12 } },
    ];
    if (niveau === 3) {
      v.qAcm = mes("cm"); v.cent = constante(100);
      r.push({ type: "conv", c: "qAcm", a: "qA", b: "cent" });
      tirage.push({ v: "qAcm", plage: { min: 35, max: 180, pas: 5 } });
    } else tirage.push({ v: "qA", plage: niveau === 1 ? { min: 1, max: 3, pas: 0.5 } : { min: 0.5, max: 2.5, pas: 0.25 } });
    if (niveau >= 2) {
      v.nB = N; v.qB = m; v.uB = m; v.utilise = m;
      r.push(prod("uB", "qB", "nB"), union("utilise", "uA", "uB"));
      tirage.push({ v: "nB", plage: { min: 3, max: 10 } }, { v: "qB", plage: { min: 0.5, max: 3, pas: niveau === 2 ? 0.5 : 0.25 } });
    }
    tirage.push({ v: "R", f: (w, { rng }) => w[U].ceil().add(rng.int(1, 6)) });
    const A = niveau === 3 ? "qAcm" : "qA";
    const base = niveau === 1 ? ["nA", A] : ["nA", A, "nB", "qB"];
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: "reste", donnees: [...base, "R"] },
      j2: [
        ...(niveau < 3 ? [{ inconnue: "qA", donnees: [...base.filter((x) => x !== "qA"), "R", "reste"] }] : []),
        { inconnue: "R", donnees: [...base, "reste"] },
      ],
      contraintes: (w) => (w.qA.decimales > 2 ? "longueur trop précise" : niveau >= 2 && w.qA.eq(w.qB) ? "morceaux identiques" : null),
    };
  },

  textes: {
    phrases: [
      [
        { vars: ["R"], t: "[lieu], [qui] a [un:rouleau] [rouleau] de {R} [de:matiere]." },
        { t: "[lieu], [qui] a [un:rouleau] [rouleau] [de:matiere]." },
      ],
      [
        { vars: ["nA", "qAcm"], t: "[il:qui] coupe {nA} morceaux de {qAcm} pour les [objA:pl]." },
        { vars: ["nA", "qA"], t: "[il:qui] coupe {nA} morceaux de {qA} pour les [objA:pl]." },
        { vars: ["nA"], t: "[il:qui] coupe {nA} morceaux de même longueur pour les [objA:pl]." },
      ],
      [{ vars: ["nB", "qB"], t: "[il:qui] coupe aussi {nB} morceaux de {qB} pour les [objB:pl]." }],
      [{ vars: ["reste"], t: "Il reste ensuite {reste} [de:matiere] sur [le:rouleau] [rouleau]." }],
    ],
    questions: {
      reste: "Quelle longueur [de:matiere] reste-t-il sur [le:rouleau] [rouleau] ?",
      qA: "Quelle est la longueur de chaque morceau pour les [objA:pl] ?",
      R: "Quelle était la longueur [du:rouleau] [rouleau] au départ ?",
    },
    guidees: { uA: "Quelle longueur [de:matiere] faut-il pour les {nA} morceaux ?", utilise: "Quelle longueur [de:matiere] faut-il en tout ?" },
    libelles: {
      qA: "longueur d'un morceau pour les [objA:pl], en mètres", uA: "longueur pour les [objA:pl]", uB: "longueur pour les [objB:pl]",
      utilise: "longueur utilisée", reste: "longueur qui reste", R: "longueur [du:rouleau] [rouleau]",
    },
    reponses: {
      reste: "Il reste {reste} [de:matiere] sur [le:rouleau] [rouleau].",
      qA: "Chaque morceau pour les [objA:pl] mesure {qA}.",
      R: "[le:rouleau] [rouleau] mesurait {R}.",
    },
  },
};
