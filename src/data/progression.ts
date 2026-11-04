/**
 * Progression annuelle (36 semaines). Modifiable librement :
 *  - `schemas` : schémas utilisés dans la semaine (les 4 problèmes les alternent) ;
 *  - `principal` : schéma de l'évaluation (par défaut, le premier) ;
 *  - `contextes` : contextes imposés pour la semaine (facultatif).
 * Les semaines sans schéma seront couvertes à l'étape 5 (extension).
 */
export interface SemaineProg {
  numero: number;
  periode: 1 | 2 | 3 | 4 | 5;
  titre: string;
  schemas: string[];
  principal?: string;
  contextes?: string[];
  /** Semaine de synthèse à thème : seuls les contextes de ce thème sont utilisés. */
  theme?: string;
  etapes: [number, number];
}

const P = (numero: number, periode: SemaineProg["periode"], titre: string, schemas: string[] = [], principal?: string, theme?: string): SemaineProg => ({
  numero, periode, titre, schemas, principal, theme,
  etapes: ([[2, 3], [3, 4], [4, 5], [4, 6], [5, 8]] as [number, number][])[periode - 1],
});

export const PROGRESSION: SemaineProg[] = [
  P(1, 1, "Structures additives", ["etats-transformations", "comparaison"]),
  P(2, 1, "Grands nombres", ["grands-nombres"]),
  P(3, 1, "Multiplication", ["lots"]),
  P(4, 1, "Division et interprétation du reste", ["division-reste"]),
  P(5, 1, "Problèmes à étapes mixtes", ["consommation-stock", "division-reste"], "consommation-stock"),
  P(6, 1, "Synthèse de la période 1", ["etats-transformations", "comparaison", "lots", "division-reste"], "lots"),
  P(7, 1, "Synthèse de la période 1 (bis)", ["grands-nombres", "division-reste", "consommation-stock", "lots"], "consommation-stock"),
  P(8, 2, "Décimaux et monnaie", ["liste-courses", "achat-unite"], "liste-courses"),
  P(9, 2, "Longueurs", ["parcours"]),
  P(10, 2, "Décimal × entier", ["decoupe", "achat-unite"], "decoupe"),
  P(11, 2, "Décimal ÷ entier", ["partage-frais"]),
  P(12, 2, "Masses et contenances", ["remplissage"]),
  P(13, 2, "Durées", ["durees"]),
  P(14, 2, "Synthèse : la fête de Noël", ["liste-courses", "durees", "decoupe", "remplissage"], "liste-courses", "noel"),
  P(15, 3, "Fraction d'une quantité", ["fraction-quantite"]),
  P(16, 3, "Retrouver le tout", ["retrouver-tout"]),
  P(17, 3, "Addition et soustraction de fractions", ["fractions-somme"]),
  P(18, 3, "Linéarité multiplicative", ["linearite-mult"]),
  P(19, 3, "Passage à l'unité et linéarité additive", ["achat-unite", "linearite-add"], "achat-unite"),
  P(20, 3, "Situations proportionnelles ou non", ["tarif-affine", "linearite-mult"], "tarif-affine"),
  P(21, 3, "Synthèse : le tournoi", ["fraction-quantite", "linearite-mult", "division-reste", "tarif-affine"], "fraction-quantite", "tournoi"),
  P(22, 4, "Périmètres", ["perimetre"]),
  P(23, 4, "Aires", ["aire"]),
  P(24, 4, "Périmètre et aire avec coûts", ["perimetre-aire-couts"]),
  P(25, 4, "Volumes", ["volume"]),
  P(26, 4, "Pourcentages", ["pourcentage"]),
  P(27, 4, "Échelles et vitesse", ["echelle", "vitesse"], "vitesse"),
  P(28, 4, "Synthèse : l'aménagement de la cour", ["perimetre", "aire", "volume", "perimetre-aire-couts"], "perimetre-aire-couts", "cour"),
  P(29, 5, "Tableaux à double entrée", ["tableau"]),
  P(30, 5, "Graphiques", ["graphique"]),
  P(31, 5, "Probabilités", ["probabilite"]),
  P(32, 5, "Partages inégaux", ["partage-inegal"]),
  P(33, 5, "Problèmes de recherche", ["deux-sortes"]),
  P(34, 5, "Comparaison d'offres", ["tarif-affine", "offre-lot"], "offre-lot"),
  P(35, 5, "Grand projet de fin d'année", ["division-reste", "tarif-affine", "durees", "partage-frais"], "partage-frais", "voyage"),
  P(36, 5, "Bilan et rallye", ["consommation-stock", "fraction-quantite", "perimetre-aire-couts", "deux-sortes"], "deux-sortes"),
];

export const semaineProg = (n: number): SemaineProg => {
  const s = PROGRESSION.find((x) => x.numero === n);
  if (!s) throw new Error(`Semaine inconnue : ${n}`);
  return s;
};
