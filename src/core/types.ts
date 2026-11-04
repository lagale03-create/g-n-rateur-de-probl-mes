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
  | "mesure"          // longueur, aire, volume… dans l'unité donnée par `unite` (m, cm, m², dm³)
  | "duree"           // durée en minutes : « 1 h 05 »
  | "heure"           // heure de la journée en minutes depuis minuit : « 9 h 15 »
  | "fraction"        // « 3⁄4 »
  | "pourcent"        // « 25 % »
  | "proba"           // « 3 chances sur 10 » (voir `ratio`)
  | "facteur";        // constante (1 000, 2…), jamais affichée

/** Types de situations, nommés dans le corrigé. */
export type Situation =
  | "Union" | "Retrait" | "Différence" | "Comparaison" | "Recherche de l'état initial"
  | "Réitération" | "Partage" | "Groupement" | "Groupement avec reste"
  | "Fraction d'une quantité" | "Retrouver le tout" | "Passage à l'unité"
  | "Linéarité multiplicative" | "Linéarité additive" | "Pourcentage" | "Conversion"
  | "Durée" | "Périmètre" | "Aire" | "Volume" | "Lecture de tableau" | "Lecture de graphique" | "Probabilité"
  | "Échelle" | "Vitesse"
  | "Partage inégal" | "Essais et ajustements";

export interface Plage { min: number | string; max: number | string; pas?: number | string }

/**
 * Relation entre trois variables : c = a × b (mul) ou c = a + b (add).
 * Elle se lit dans les deux sens : connaissant deux des trois, on calcule la troisième.
 * `noms` donne le type de situation selon la variable qu'on calcule.
 */
export interface Relation {
  /**
   * mul : c = a × b   add : c = a + b   conv : c = a × facteur (conversion)
   * ceil : c = a ÷ b arrondi au supérieur (« il faut 8 bus »)   quot : c = quotient entier de a ÷ b
   * (ceil et quot ne se calculent que dans un sens : de a et b vers c)
   */
  type: "mul" | "add" | "conv" | "ceil" | "quot";
  c: string; a: string; b: string;
  noms?: Partial<Record<"a" | "b" | "c", Situation>>;
}

export interface VarDef {
  grandeur: Grandeur;
  /** Unité affichée (grandeur « mesure »), ou mot du contexte entre crochets : « [unite] ». */
  unite?: string;
  /** Constante (grandeur « facteur ») : sa valeur, sinon le facteur de conversion du contexte. */
  valeur?: number;
  /** Fraction : variable qui donne le dénominateur d'affichage (« 6⁄8 » plutôt que « 3⁄4 »). */
  den?: string;
  /** Variable calculée qu'on peut citer dans l'énoncé (« combien coûtent 8 cahiers ? » avec 8 = 3 + 5). */
  visible?: boolean;
  /** Probabilité : variables [cas favorables, cas possibles] pour l'affichage « 3 chances sur 10 ». */
  ratio?: [string, string];
}

export type Monde = Record<string, Q>;

export interface AideTirage {
  rng: Rng;
  /** Paramètres propres au contexte (ex. facteur de conversion). */
  ctx: ContexteSchema;
}

/** Une étape du tirage : plage (surchargée par le contexte) ou fonction des valeurs déjà connues. */
export interface Tirage {
  v: string;
  /** Nom de la plage à chercher dans le contexte, s'il diffère du nom de la variable. */
  cle?: string;
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

/** Tableau ou graphique inséré dans l'énoncé. Chaque case est une variable, un leurre tiré au hasard, ou un texte. */
export type CaseVisuel = string | { leurre: Plage } | { texte: string };
export interface SpecVisuel {
  type: "tableau" | "barres" | "courbe" | "secteurs";
  titre: string;
  /** En-têtes des colonnes (gabarits). */
  colonnes: string[];
  lignes: { label: string; cases: CaseVisuel[] }[];
  /** Unité des valeurs (graphiques). */
  unite?: string;
}
export interface Visuel {
  type: SpecVisuel["type"];
  titre: string;
  colonnes: string[];
  lignes: { label: string; valeurs: { texte: string; nombre: number | null }[] }[];
  unite?: string;
}

export interface Schema {
  id: string;
  /** Réutilise l'habillage d'un autre schéma (ou d'une « facette ») du contexte : mots et plages. */
  herite?: string;
  /** Tableau ou graphique de l'énoncé. */
  visuel?: (niveau: Niveau) => SpecVisuel;
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
  /** Thème d'une semaine de synthèse (« noel »…) : le contexte n'est utilisé que pour ce thème. */
  theme?: string;
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
  /** Tableau ou graphique de l'énoncé. */
  visuel?: Visuel;
  /** Valeurs exactes du monde, pour un nouveau contrôle. */
  monde: Record<string, string>;
  essais: number;
}
