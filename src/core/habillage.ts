import type { Contexte, ContexteSchema, Schema } from "./types";

/** Ce que le contexte fournit pour habiller ce schéma (son propre bloc, ou celui dont le schéma hérite). */
export function habillage(schema: Schema, contexte: Contexte): ContexteSchema | undefined {
  const propre = contexte.schemas[schema.id];
  if (propre) return propre;
  if (!schema.herite) return undefined;
  const h = contexte.schemas[schema.herite];
  // les textes propres à l'autre schéma ne s'appliquent pas ici
  return h ? { ...h, textes: undefined } : undefined;
}

export const compatible = (schema: Schema, contexte: Contexte) => !!habillage(schema, contexte);
