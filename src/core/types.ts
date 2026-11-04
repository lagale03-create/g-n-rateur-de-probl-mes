/**
 * Modèle de données du générateur.
 * Un SCHÉMA décrit la mathématique (variables, relations, inconnues).
 * Un CONTEXTE décrit le monde (mots, unités, plages réalistes, phrases, données parasites).
 */
import type { Q } from "./rational";
import type { Rng } from "./rng";

export type Niveau = 1 | 2 | 3;
export type Jour = 1 | 2 | "eval";

/** Nature d'une grandeur, qui fixe son unité et les contrôles du vérificateur. */
export type Grandeur =
  | "compte"          // nombre d'objets, de personnes, de jours : toujours entier
  | "euro"            // 2 décimales au maximum
  | "quantite"        // masse, contenance… dans l'unité du contexte (kg, L)
  | "quantiteGrande"  // même grandeur dans la grande unité (t) : sert aux conversions
  | "facteur";        // constante de conversion (1 000), jamais affichée

/** Types de situations, nommés dans le corrigé. */
export type Situation =
  | "Union" | "Retrait" | "Différence" | "Comparaison" | "Recherche de l'état initial"
  | "Réitération" | "Partage" | "Groupement" | "Groupement avec reste"
  | "Fraction d'une quantité" | "Retrouver le tout" | "Passage à l'unité"
  | "Linéarité multiplicative" | "Linéarité additive" | "Pourcentage" | "Conversion"
  | "Durée" | "Périmètre" | "Aire" | "Volume" | "Lecture de tableau" | "Probabilité"
  | "Partage inégal" | "Essais et ajustements";

export interface Plage { min: number | string; max: number | string; pas?: number | string }

/**
 * Relation entre trois variables : c = a × b (mul) ou c = a + b (add).
 * Elle se lit dans les deux sens : connaissant deux des trois, on calcule la troisième.
 * `noms` donne le type de situation selon la variable qu'on calcule.
 */
export interface Relation {
  type: "mul" | "add" | "conv";
  c: string; a: string; b: string;
  noms?: Partial<Record<"a" | "b" | "c", Situation>>;
}

export interface VarDef { grandeur: Grandeur }

export type Monde = Record<string, Q>;

export interface AideTirage {
  rng: Rng;
  /** Paramètres propres au contexte (ex. facteur de conversion). */
  ctx: ContexteSchema;
}

/** Une étape du tirage : plage (surchargée par le contexte) ou fonction des valeurs déjà connues. */
export interface Tirage {
  v: string;
  plage?: Plage;
  f?: (w: Monde, aide: AideTirage) => Q;
}

export interface Inconnue { inconnue: string; donnees: string[] }

/** Structure d'un schéma pour un niveau donné. */
export interface Structure {
  variables: Record<string, VarDef>;
  relations: Relation[];
  tirage: Tirage[];
  j1: Inconnue;
  j2: Inconnue[];
  /** Contraintes propres au schéma : renvoie un message si la contrainte échoue. */
  contraintes?: (w: Monde) => string | null;
}

/** Texte à variantes : la première variante dont toutes les `vars` sont des données est retenue. */
export interface Variante { t: string; vars?: string[]; niveaux?: Niveau[] }
export type Texte = string | Variante[];

export interface Gabarit {
  /** Phrases de l'énoncé, dans l'ordre. Chaque emplacement donne 0 ou 1 phrase. */
  phrases: Texte[];
  /** Question finale, par inconnue. */
  questions: Record<string, Texte>;
  /** Questions intermédiaires du niveau ★, par variable calculée. */
  guidees: Record<string, Texte>;
  /** Libellé court de chaque grandeur, pour le corrigé. */
  libelles: Record<string, Texte>;
  /** Phrase réponse attendue, par inconnue. */
  reponses: Record<string, Texte>;
}

export interface Schema {
  id: string;
  titre: string;
  notion: string;
  /** Mots que le contexte doit fournir (A, B, ressource…). */
  roles: string[];
  structure: (niveau: Niveau, ctx: ContexteSchema) => Structure;
  textes: Gabarit;
}

/** Un mot avec son genre et son pluriel (« pot de confiture » → « pots de confiture »). */
export interface Mot {
  s: string;
  p?: string;
  g?: "m" | "f";
  /** Commence par une voyelle ou un h muet (élision : « d'eau », « l'adulte »). */
  voy?: boolean;
}
export type EntreeMot = string | Mot | Mot[];

/** Ce qu'un contexte fournit pour habiller un schéma donné. */
export interface ContexteSchema {
  mots: Record<string, EntreeMot>;
  /** Unités : quantite (kg, L…), grande (t), facteur (1000). */
  unites?: { quantite?: string; grande?: string; facteur?: number };
  plages?: Partial<Record<Niveau, Record<string, Plage>>>;
  textes?: Partial<Gabarit>;
}

/** Donnée parasite : phrase vraisemblable dont les nombres ne servent à rien. */
export interface Parasite {
  t: string;
  vals: Record<string, { type: "annee" | "heure" | "nombre"; min: number; max: number; pas?: number; unite?: string }>;
}

export interface Contexte {
  id: string;
  titre: string;
  schemas: Record<string, ContexteSchema>;
  parasites: Parasite[];
}

// ---------- Problème généré ----------

export interface Etape {
  situation: Situation;
  calcul: string;      // « 162 ÷ 6 = 27 kg »
  libelle: string;     // « viande mangée par un lion en un jour »
  cible: string;
  texte: string;       // « Partage : 162 ÷ 6 = 27 kg (viande mangée par un lion en un jour) »
}

export interface Probleme {
  id: string;
  graine: string;
  schemaId: string;
  contexteId: string;
  titreContexte: string;
  niveau: Niveau;
  jour: Jour;
  inconnue: string;
  donnees: string[];
  enonce: string;
  question: string;
  guidees: string[];
  parasites: string[];
  etapes: Etape[];
  resultat: string;
  reponse: string;
  situations: Situation[];
  /** Valeurs exactes du monde, pour un nouveau contrôle. */
  monde: Record<string, string>;
  essais: number;
}
