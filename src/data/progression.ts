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
  etapes: [number, number];
}

const P = (numero: number, periode: SemaineProg["periode"], titre: string, schemas: string[] = [], principal?: string): SemaineProg => ({
  numero, periode, titre, schemas, principal,
  etapes: ([[2, 3], [3, 4], [4, 5], [4, 6], [5, 8]] as [number, number][])[periode - 1],
});

export const PROGRESSION: SemaineProg[] = [
  P(1, 1, "Structures additives", ["etats-transformations", "comparaison"]),
  P(2, 1, "Grands nombres", ["grands-nombres"]),
  P(3, 1, "Multiplication", ["lots"]),
  P(4, 1, "Division et interprétation du reste", ["division-reste"]),
  P(5, 1, "Problèmes à étapes mixtes", ["consommation-stock", "achat-unite"], "consommation-stock"),
  P(6, 1, "Synthèse de la période 1", ["etats-transformations", "comparaison", "lots", "division-reste"], "lots"),
  P(7, 1, "Synthèse de la période 1 (bis)", ["grands-nombres", "division-reste", "consommation-stock", "lots"], "consommation-stock"),
  P(8, 2, "Décimaux et monnaie", ["achat-unite"]),
  P(9, 2, "Longueurs"),
  P(10, 2, "Décimal × entier"),
  P(11, 2, "Décimal ÷ entier"),
  P(12, 2, "Masses et contenances"),
  P(13, 2, "Durées"),
  P(14, 2, "Synthèse : la fête de Noël"),
  P(15, 3, "Fraction d'une quantité"),
  P(16, 3, "Retrouver le tout"),
  P(17, 3, "Addition et soustraction de fractions"),
  P(18, 3, "Linéarité multiplicative"),
  P(19, 3, "Passage à l'unité et linéarité additive", ["achat-unite"]),
  P(20, 3, "Situations proportionnelles ou non"),
  P(21, 3, "Synthèse : le tournoi"),
  P(22, 4, "Périmètres"),
  P(23, 4, "Aires"),
  P(24, 4, "Périmètre et aire avec coûts"),
  P(25, 4, "Volumes"),
  P(26, 4, "Pourcentages"),
  P(27, 4, "Échelles et vitesse"),
  P(28, 4, "Synthèse : l'aménagement de la cour"),
  P(29, 5, "Tableaux à double entrée"),
  P(30, 5, "Graphiques"),
  P(31, 5, "Probabilités"),
  P(32, 5, "Partages inégaux"),
  P(33, 5, "Problèmes de recherche"),
  P(34, 5, "Comparaison d'offres"),
  P(35, 5, "Grand projet de fin d'année"),
  P(36, 5, "Bilan et rallye"),
];

export const semaineProg = (n: number): SemaineProg => {
  const s = PROGRESSION.find((x) => x.numero === n);
  if (!s) throw new Error(`Semaine inconnue : ${n}`);
  return s;
};
