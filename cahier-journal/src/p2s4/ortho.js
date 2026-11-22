// Orthographe lexicale P2 S4 (23-27 novembre 2026) : fiche 8 de la progression, le son [ɛ] (è, ê, e devant deux consonnes, et),
// en synthèse avec [e] et ai (é et è regroupés, révision du 18 novembre).
// Dix mots : 6 du son (liste de fréquence, analyse sons/sons.json), 2 invariables de la période (lieu et quantité), 2 des disciplines ; CM2 + 2.
// Les séances du jour (1/4 à 4/4) sont écrites par la tâche du soir, à partir du corpus de 48 mots ci-dessous.
const DIX_MOTS = ['était', 'elle', 'avait', 'aller', 'très', 'même', 'près', 'beaucoup', 'la lumière', 'la liberté'];
const CM2_PLUS = ['trop', 'assez'];
// Corpus de recherche (lundi) : 48 mots fréquents, sortie de l'analyse de fréquence (gen_annee.py, S11)
const CORPUS = ['vers', 'aller', 'premier', 'chez', 'quelques', 'parler', 'état', 'général', 'même', 'mais', 'mère', 'faire',
  'étaient', 'jamais', 'cette', 'épaules', 'était', 'étais', 'très', 'café', 'personne', 'tête', 'elle', 'avec',
  'après', 'quelque', 'avais', 'elles', 'avait', 'côté', 'cet', 'déjà', 'années', 'donner', 'présent', 'avaient',
  'fait', 'être', 'intérieur', 'presque', 'passé', 'été', 'avez', 'malgré', 'donné', 'passer', 'assez', 'idée'];
module.exports = { son: '[ɛ] et [e]', fiche: 8, dixMots: DIX_MOTS, cm2Plus: CM2_PLUS, corpus: CORPUS };
