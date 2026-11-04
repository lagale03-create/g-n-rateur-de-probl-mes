/**
 * Géométrie (habillage : facette « terrain » du contexte : objet rectangulaire, clôture, revêtement).
 *  - « perimetre »             : périmètre d'un rectangle, moins une ouverture, prix de la clôture
 *  - « aire »                  : aire d'un rectangle (ou de deux), prix du revêtement
 *  - « perimetre-aire-couts »  : clôture + revêtement
 *  - « echelle »               : dimensions sur le plan → dimensions réelles → périmètre
 *  - « volume »                : pavé droit (facette « volume ») : volume, puis nombre de seaux (reste)
 */
import { Q } from "../../core/rational";
import type { Niveau, Relation, Schema, Structure } from "../../core/types";
import { constante, E, mes, N, prod, retrait, union } from "./outils";

const M = mes("m"), M2 = mes("m²");
const P_NOMS = { c: "Périmètre", a: "Partage", b: "Groupement" } as const;
const A_NOMS = { c: "Aire", a: "Partage", b: "Partage" } as const;

function dims(niveau: Niveau): Structure["tirage"] {
  return niveau === 3
    ? [{ v: "L", plage: { min: 8, max: 40, pas: 0.5 } }, { v: "l", plage: { min: 4, max: 20 } }]
    : niveau === 2
      ? [{ v: "L", plage: { min: 10, max: 45 } }, { v: "l", plage: { min: 5, max: 25 } }]
      : [{ v: "L", plage: { min: 4, max: 15 } }, { v: "l", plage: { min: 2, max: 9 } }];
}

const formeOK = (w: Record<string, Q>) => (w.l.cmp(w.L) >= 0 ? "largeur ≥ longueur" : null);

const phraseDims = [
  { vars: ["L", "l"], t: "[objet] est un rectangle de {L} de long et {l} de large." },
  { vars: ["L"], t: "[objet] est un rectangle de {L} de long." },
];

// ---------- périmètre ----------
export const perimetre: Schema = {
  id: "perimetre", herite: "terrain",
  titre: "Périmètre et clôture", notion: "périmètres",
  roles: ["lieu", "objet", "cloture", "ouverture"],
  structure(niveau): Structure {
    const v: Structure["variables"] = { L: M, l: M, demi: M, P: M, deux: constante(2) };
    const r: Relation[] = [union("demi", "L", "l"), prod("P", "demi", "deux", P_NOMS)];
    const tirage = dims(niveau);
    let fin = "P";
    const base = ["L", "l"];
    if (niveau >= 2) {
      v.porte = M; v.lc = M; v.prixm = E; v.cout = E;
      r.push(retrait("P", "lc", "porte"), prod("cout", "prixm", "lc"));
      tirage.push({ v: "porte", plage: { min: 1, max: 4 } }, { v: "prixm", plage: niveau === 2 ? { min: 3, max: 12 } : { min: 2, max: 9 } });
      base.push("porte", "prixm"); fin = "cout";
    }
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: fin, donnees: base },
      j2: [{ inconnue: "l", donnees: niveau === 1 ? ["L", "P"] : ["L", "porte", "prixm", "cout"] }],
      contraintes: formeOK,
    };
  },
  textes: {
    phrases: [
      [{ t: "[lieu], on veut poser [un:cloture] [cloture] autour [du:objet]." }],
      phraseDims,
      [{ vars: ["porte"], t: "On laisse une ouverture de {porte} pour [ouverture]." }],
      [{ vars: ["prixm"], t: "Un mètre [de:cloture] coûte {prixm}." }],
      [{ vars: ["P"], t: "Le périmètre [du:objet] mesure {P}." }, { vars: ["cout"], t: "En tout, [le:cloture] [cloture] coûte {cout}." }],
    ],
    questions: {
      P: "Quel est le périmètre [du:objet] ?", cout: "Combien va coûter [le:cloture] [cloture] ?",
      l: "Quelle est la largeur [du:objet] ?",
    },
    guidees: { demi: "Combien mesurent une longueur et une largeur mises bout à bout ?" },
    libelles: { demi: "longueur + largeur", P: "périmètre", lc: "longueur [de:cloture]", cout: "prix [du:cloture] [cloture]", l: "largeur", L: "longueur" },
    reponses: { P: "Le périmètre [du:objet] mesure {P}.", cout: "[le:cloture] [cloture] va coûter {cout}.", l: "La largeur [du:objet] est de {l}." },
  },
};

// ---------- aire ----------
export const aire: Schema = {
  id: "aire", herite: "terrain",
  titre: "Aire et revêtement", notion: "aires",
  roles: ["lieu", "objet", "revetement", "partie"],
  structure(niveau): Structure {
    const v: Structure["variables"] = { L: M, l: M, A: M2, prix2: E, cout: E };
    const r: Relation[] = [prod("A", "L", "l", A_NOMS)];
    const tirage = dims(niveau);
    let couvrir = "A";
    const base = ["L", "l"];
    if (niveau >= 2) {
      // ★★ : une partie (carré de côté c) n'est pas recouverte
      v.c = M; v.Ac = M2; v.Ar = M2;
      r.push(prod("Ac", "c", "c", A_NOMS), retrait("A", "Ar", "Ac"));
      tirage.push({ v: "c", plage: { min: 1, max: 4 } });
      base.push("c"); couvrir = "Ar";
    }
    r.push(prod("cout", "prix2", couvrir));
    tirage.push({ v: "prix2", plage: niveau === 3 ? { min: 2, max: 9 } : { min: 2, max: 15 } });
    base.push("prix2");
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: "cout", donnees: base },
      j2: [{ inconnue: "l", donnees: [...base.filter((x) => x !== "l"), "cout"] }],
      contraintes: (w) => formeOK(w) ?? (w.c && w.c.cmp(w.l) >= 0 ? "partie trop grande" : null),
    };
  },
  textes: {
    phrases: [
      [{ t: "[lieu], on veut recouvrir [objet] [de:revetement]." }],
      phraseDims,
      [{ vars: ["c"], t: "[partie] est un carré de {c} de côté qu'on ne recouvre pas." }],
      [{ vars: ["prix2"], t: "Un mètre carré [de:revetement] coûte {prix2}." }],
      [{ vars: ["cout"], t: "En tout, [le:revetement] [revetement] coûte {cout}." }],
    ],
    questions: { cout: "Combien va coûter [le:revetement] [revetement] ?", l: "Quelle est la largeur [du:objet] ?" },
    guidees: { A: "Quelle est l'aire [du:objet] ?" },
    libelles: { A: "aire [du:objet]", Ac: "aire [du:partie]", Ar: "aire à recouvrir", cout: "prix [du:revetement] [revetement]", l: "largeur" },
    reponses: { cout: "[le:revetement] [revetement] va coûter {cout}.", l: "La largeur [du:objet] est de {l}." },
  },
};

// ---------- périmètre et aire avec coûts ----------
export const perimetreAireCouts: Schema = {
  id: "perimetre-aire-couts", herite: "terrain",
  titre: "Périmètre et aire avec coûts", notion: "périmètre et aire",
  roles: ["lieu", "objet", "cloture", "revetement"],
  structure(niveau): Structure {
    const v: Structure["variables"] = { L: M, l: M, demi: M, P: M, deux: constante(2), prixm: E, coutP: E, A: M2, prix2: E, coutA: E, total: E };
    const r: Relation[] = [
      union("demi", "L", "l"), prod("P", "demi", "deux", P_NOMS), prod("coutP", "prixm", "P"),
      prod("A", "L", "l", A_NOMS), prod("coutA", "prix2", "A"), union("total", "coutP", "coutA"),
    ];
    const tirage = [...dims(niveau === 3 ? 2 : niveau), { v: "prixm", plage: { min: 3, max: 12 } }, { v: "prix2", plage: niveau === 3 ? { min: 2, max: 8, pas: 0.5 } : { min: 2, max: 10 } }];
    let fin = "total";
    const base = ["L", "l", "prixm", "prix2"];
    if (niveau === 3) {
      v.budget = E; v.reste = E;
      r.push(retrait("budget", "reste", "total"));
      tirage.push({ v: "budget", f: (w, { rng }) => w.total.div(100).ceil().add(rng.int(1, 5)).mul(100) });
      base.push("budget"); fin = "reste";
    }
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: fin, donnees: base },
      j2: [{ inconnue: "prix2", donnees: ["L", "l", "prixm", fin === "reste" ? "budget" : "total", ...(fin === "reste" ? ["reste"] : [])] }],
      contraintes: formeOK,
    };
  },
  textes: {
    phrases: [
      [{ t: "[lieu], on veut poser [un:cloture] [cloture] autour [du:objet] et recouvrir le sol [de:revetement]." }],
      phraseDims,
      [{ vars: ["prixm"], t: "Un mètre [de:cloture] coûte {prixm}." }],
      [{ vars: ["prix2"], t: "Un mètre carré [de:revetement] coûte {prix2}." }],
      [{ vars: ["budget", "reste"], t: "Le budget est de {budget} et il reste {reste} après les travaux." }, { vars: ["budget"], t: "Le budget prévu est de {budget}." }],
      [{ vars: ["total"], t: "En tout, les travaux coûtent {total}." }],
    ],
    questions: {
      total: "Combien coûtent les travaux en tout ?", reste: "Combien restera-t-il sur le budget ?",
      prix2: "Combien coûte un mètre carré [de:revetement] ?",
    },
    guidees: {
      demi: "Combien mesurent une longueur et une largeur mises bout à bout ?", P: "Quel est le périmètre [du:objet] ?",
      coutP: "Combien coûte [le:cloture] [cloture] ?", A: "Quelle est l'aire [du:objet] ?", coutA: "Combien coûte [le:revetement] [revetement] ?",
    },
    libelles: { demi: "longueur + largeur", P: "périmètre", coutP: "prix [du:cloture] [cloture]", A: "aire", coutA: "prix [du:revetement] [revetement]", total: "prix des travaux", reste: "reste du budget", prix2: "prix d'un m² [de:revetement]" },
    reponses: { total: "Les travaux coûtent {total}.", reste: "Il restera {reste} sur le budget.", prix2: "Un mètre carré [de:revetement] coûte {prix2}." },
  },
};

// ---------- échelle ----------
export const echelle: Schema = {
  id: "echelle", herite: "terrain",
  titre: "Échelles : du plan à la réalité", notion: "échelles",
  roles: ["lieu", "objet"],
  structure(niveau): Structure {
    const cm = mes("cm");
    const v: Structure["variables"] = { pL: cm, pl: cm, e: M, L: M, l: M, ecartL: M };
    const ECH = { c: "Échelle", a: "Échelle", b: "Échelle" } as const;
    const r: Relation[] = [prod("L", "e", "pL", ECH), prod("l", "e", "pl", ECH)];
    const tirage: Structure["tirage"] = [
      { v: "e", plage: niveau === 1 ? { min: 2, max: 5 } : { min: 2, max: 10 } },
      { v: "pL", plage: niveau === 3 ? { min: 4, max: 12, pas: 0.5 } : { min: 4, max: 12 } },
      { v: "pl", plage: niveau === 3 ? { min: 2, max: 8, pas: 0.5 } : { min: 2, max: 8 } },
    ];
    let fin = "ecartL";
    if (niveau === 1) r.push(ecart_("L", "l", "ecartL"));
    else {
      delete v.ecartL;
      v.demi = M; v.P = M; v.deux = constante(2);
      r.push(union("demi", "L", "l"), prod("P", "demi", "deux", P_NOMS));
      fin = "P";
    }
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: fin, donnees: ["e", "pL", "pl"] },
      j2: [{ inconnue: "pl", donnees: niveau === 1 ? ["e", "pL", "ecartL"] : ["e", "pL", "P"] }],
      contraintes: (w) => (w.pl.cmp(w.pL) >= 0 ? "largeur ≥ longueur" : null),
    };
  },
  textes: {
    phrases: [
      [{ vars: ["e"], t: "[lieu], sur le plan [du:objet], 1 cm représente {e} dans la réalité." }],
      [
        { vars: ["pL", "pl"], t: "Sur le plan, [objet] est un rectangle de {pL} sur {pl}." },
        { vars: ["pL"], t: "Sur le plan, [objet] est un rectangle de {pL} de long." },
      ],
      [{ vars: ["ecartL"], t: "Dans la réalité, sa longueur dépasse sa largeur de {ecartL}." }, { vars: ["P"], t: "Dans la réalité, son périmètre mesure {P}." }],
    ],
    questions: {
      ecartL: "Dans la réalité, de combien de mètres la longueur dépasse-t-elle la largeur ?",
      P: "Quel est le périmètre réel [du:objet] ?",
      pl: "Quelle est la largeur [du:objet] sur le plan ?",
    },
    guidees: { L: "Quelle est la longueur réelle [du:objet] ?", l: "Quelle est la largeur réelle [du:objet] ?" },
    libelles: { L: "longueur réelle", l: "largeur réelle", ecartL: "écart réel", demi: "longueur + largeur réelles", P: "périmètre réel", pl: "largeur sur le plan" },
    reponses: { ecartL: "La longueur dépasse la largeur de {ecartL}.", P: "Le périmètre réel [du:objet] mesure {P}.", pl: "Sur le plan, la largeur mesure {pl}." },
  },
};
function ecart_(grand: string, petit: string, e: string): Relation {
  return { type: "add", c: grand, a: petit, b: e, noms: { c: "Comparaison", a: "Comparaison", b: "Différence" } };
}

// ---------- volume ----------
export const volume: Schema = {
  id: "volume", herite: "volume",
  titre: "Volume d'un pavé et contenance", notion: "volumes",
  roles: ["lieu", "objet", "ress", "seau"],
  structure(niveau): Structure {
    const dm = mes("dm"), L = mes("L"), dm2 = mes("dm²");
    const v: Structure["variables"] = { L: dm, l: dm, h: dm, base: dm2, V: L };
    const r: Relation[] = [prod("base", "L", "l", A_NOMS), prod("V", "base", "h", { c: "Volume", a: "Partage", b: "Partage" })];
    const tirage: Structure["tirage"] = niveau === 1
      ? [{ v: "L", plage: { min: 3, max: 8 } }, { v: "l", plage: { min: 2, max: 6 } }, { v: "h", plage: { min: 2, max: 5 } }]
      : [{ v: "L", plage: { min: 6, max: 20 } }, { v: "l", plage: { min: 4, max: 12 } }, { v: "h", plage: { min: 3, max: 10 } }];
    let fin = "V";
    const base = ["L", "l", "h"];
    if (niveau >= 2) {
      v.s = L; v.nb = N;
      r.push({ type: "ceil", c: "nb", a: "V", b: "s" });
      tirage.push({ v: "s", plage: { min: 5, max: 15 } });
      base.push("s"); fin = "nb";
    }
    if (niveau === 3) {
      // dimensions données en centimètres, à convertir
      for (const d of ["L", "l", "h"]) { v[`${d}cm`] = mes("cm"); r.push({ type: "conv", c: `${d}cm`, a: d, b: "dix" }); }
      v.dix = constante(10);
      base.splice(0, 3, "Lcm", "lcm", "hcm");
    }
    return {
      variables: v, relations: r, tirage,
      j1: { inconnue: fin, donnees: base },
      j2: [{ inconnue: "h", donnees: ["L", "l", "V"] }],
      contraintes: (w) => (w.l.cmp(w.L) > 0 ? "largeur > longueur" : w.nb && w.V.div(w.s).isInteger ? "pas de reste à interpréter" : null),
    };
  },
  textes: {
    phrases: [
      [{ t: "[lieu], [objet] a la forme d'un pavé droit." }],
      [
        { vars: ["Lcm", "lcm", "hcm"], t: "Il mesure {Lcm} de long, {lcm} de large et {hcm} de haut." },
        { vars: ["L", "l", "h"], t: "Il mesure {L} de long, {l} de large et {h} de haut." },
        { vars: ["L", "l"], t: "Il mesure {L} de long et {l} de large." },
      ],
      [{ vars: ["V"], t: "Plein, il contient {V} [de:ress]." }],
      [{ vars: ["s"], t: "On le remplit avec [un:seau] [seau] de {s}." }],
      [{ t: "On rappelle que 1 dm³ = 1 L." }],
    ],
    questions: {
      V: "Quel est le volume [du:objet], en litres ?",
      nb: "Combien de [seau:pl] faut-il pour le remplir ?",
      h: "Quelle est la hauteur [du:objet] ?",
    },
    guidees: { base: "Quelle est l'aire du fond [du:objet] ?" },
    libelles: { L: "longueur en dm", l: "largeur en dm", h: "hauteur en dm", base: "aire du fond", V: "volume (1 dm³ = 1 L)", nb: "[seau:pl] nécessaires" },
    reponses: { V: "[objet] contient {V}.", nb: "Il faut {nb} [seau:pl].", h: "[objet] mesure {h} de haut." },
  },
};
