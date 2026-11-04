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

export const CONTEXTES: Contexte[] = [
  zoo, centreEquestre, randonnee, cantine, boulangerie, confitures, bibliotheque, piscine, journal, jardin, kermesse,
];
export const contexteParId = (id: string): Contexte => {
  const c = CONTEXTES.find((x) => x.id === id);
  if (!c) throw new Error(`Contexte inconnu : ${id}`);
  return c;
};
