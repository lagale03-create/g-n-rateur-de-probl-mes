/**
 * Correction rédigée pour l'élève : mêmes étapes que le corrigé enseignant,
 * sans le vocabulaire de l'enseignant (« Réitération », « Partage »…).
 */
import type { Probleme } from "./types";

export interface CorrectionEleve {
  etapes: string[];
  parasites: string | null;
  reponse: string;
}

export function correctionEleve(p: Probleme): CorrectionEleve {
  return {
    etapes: p.etapes.map((e, i) => `Étape ${i + 1} · Je cherche : ${e.libelle}. ${e.calcul}`),
    parasites: p.niveau === 3 && p.parasites.length
      ? `Ces informations ne servaient à rien : ${p.parasites.join(" ")}`
      : null,
    reponse: p.reponse,
  };
}
