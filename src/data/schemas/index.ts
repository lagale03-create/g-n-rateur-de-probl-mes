import type { Schema } from "../../core/types";
import { consommationStock } from "./consommationStock";
import { achatUnite } from "./achatUnite";

export const SCHEMAS: Schema[] = [consommationStock, achatUnite];
export const schemaParId = (id: string): Schema => {
  const s = SCHEMAS.find((x) => x.id === id);
  if (!s) throw new Error(`Schéma inconnu : ${id}`);
  return s;
};
