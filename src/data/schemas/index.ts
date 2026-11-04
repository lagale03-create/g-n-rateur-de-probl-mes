import type { Schema } from "../../core/types";
import { consommationStock } from "./consommationStock";
import { achatUnite } from "./achatUnite";
import { etatsTransformations } from "./etatsTransformations";
import { comparaison } from "./comparaison";
import { grandsNombres } from "./grandsNombres";
import { lots } from "./lots";
import { divisionReste } from "./divisionReste";

export const SCHEMAS: Schema[] = [
  etatsTransformations, comparaison, grandsNombres, lots, divisionReste, consommationStock, achatUnite,
];
export const schemaParId = (id: string): Schema => {
  const s = SCHEMAS.find((x) => x.id === id);
  if (!s) throw new Error(`Schéma inconnu : ${id}`);
  return s;
};
