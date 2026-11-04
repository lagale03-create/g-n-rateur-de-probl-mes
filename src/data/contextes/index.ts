import type { Contexte } from "../../core/types";
import { zoo } from "./zoo";
import { centreEquestre } from "./centreEquestre";
import { randonnee } from "./randonnee";
import { cantine } from "./cantine";
import { boulangerie } from "./boulangerie";
import { confitures } from "./confitures";
import { bibliotheque } from "./bibliotheque";
import { piscine } from "./piscine";
import { journal } from "./journal";
import { jardin } from "./jardin";
import { kermesse } from "./kermesse";
import { THEMES } from "./themes";

/** Contextes de la vie courante (toute l'année). */
export const CONTEXTES_BASE: Contexte[] = [
  zoo, centreEquestre, randonnee, cantine, boulangerie, confitures, bibliotheque, piscine, journal, jardin, kermesse,
];
/** Tous les contextes, y compris ceux des synthèses à thème (Noël, tournoi, cour, voyage). */
export const CONTEXTES: Contexte[] = [...CONTEXTES_BASE, ...THEMES];

/** Contextes utilisables pour une semaine : ceux de son thème, sinon les contextes de base. */
export const contextesPour = (theme?: string): Contexte[] =>
  theme ? CONTEXTES.filter((c) => c.theme === theme) : CONTEXTES_BASE;
export const contexteParId = (id: string): Contexte => {
  const c = CONTEXTES.find((x) => x.id === id);
  if (!c) throw new Error(`Contexte inconnu : ${id}`);
  return c;
};
