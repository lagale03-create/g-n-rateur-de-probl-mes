import type { Schema } from "../../core/types";
import { consommationStock } from "./consommationStock";
import { achatUnite } from "./achatUnite";
import { etatsTransformations } from "./etatsTransformations";
import { comparaison } from "./comparaison";
import { grandsNombres } from "./grandsNombres";
import { lots } from "./lots";
import { divisionReste } from "./divisionReste";
import { listeCourses } from "./listeCourses";
import { parcours } from "./parcours";
import { decoupe } from "./decoupe";
import { partageFrais } from "./partageFrais";
import { remplissage } from "./remplissage";
import { durees } from "./durees";
import { fractionQuantite, fractionsSomme, retrouverTout } from "./fractions";
import { lineariteAdd, lineariteMult, offreLot } from "./proportionnalite";
import { tarifAffine } from "./tarifAffine";
import { aire, echelle, perimetre, perimetreAireCouts, volume } from "./geometrie";
import { pourcentage } from "./pourcentage";
import { vitesse } from "./vitesse";
import { graphique, tableau } from "./donnees";
import { deuxSortes, partageInegal, probabilite } from "./recherche";

/** Tous les schémas, dans l'ordre de la progression. */
export const SCHEMAS: Schema[] = [
  // période 1
  etatsTransformations, comparaison, grandsNombres, lots, divisionReste, consommationStock,
  // période 2
  achatUnite, listeCourses, parcours, decoupe, partageFrais, remplissage, durees,
  // période 3
  fractionQuantite, retrouverTout, fractionsSomme, lineariteMult, lineariteAdd, tarifAffine,
  // période 4
  perimetre, aire, perimetreAireCouts, volume, pourcentage, vitesse, echelle,
  // période 5
  tableau, graphique, probabilite, partageInegal, deuxSortes, offreLot,
];
export const schemaParId = (id: string): Schema => {
  const s = SCHEMAS.find((x) => x.id === id);
  if (!s) throw new Error(`Schéma inconnu : ${id}`);
  return s;
};
