# Mots par fiche de son : (mots fréquents contenant le son, intrus : mots qui ont les lettres sans faire le son)
SONS = {
 1: (['image', 'livre', 'midi', 'lycée', 'île', 'maïs', 'cygne', 'stylo', 'gîte', 'naïf', 'pyjama', 'ville'], ['main', 'pain', 'loin', 'roi']),
 2: (['moto', 'chaud', 'bateau', 'hôpital', 'chose', 'jaune', 'château', 'drôle', 'autre', 'nouveau', 'trop', 'oiseau', 'côte', 'faute', 'gâteau', 'zéro', 'rôti', 'aussi', 'beaucoup', 'dos', 'restaurant', 'chapeau', 'pôle', 'sauter'], ['moi', 'bon', 'tout', 'cou']),
 3: (['jour', 'où', 'goût', 'nous', 'route', 'loup', 'août', 'rue', 'mur', 'sûr', 'tortue', 'plume', 'toujours', 'bientôt', 'humide', 'flûte', 'voulu', 'roue', 'jupe', 'soupe', 'lune', 'mûre', 'pouce', 'usine'], ['oiseau', 'nuit', 'loin', 'un']),
 4: (['arbre', 'là', 'pâte', 'chat', 'âne', 'déjà', 'gâteau', 'table', 'voilà', 'château', 'tasse', 'à', 'âge', 'caramel'], ['maison', 'chant', 'pain', 'mais']),
 5: (['feu', 'jeudi', 'peur', 'cœur', 'sœur', 'œuf', 'neuf', 'deux', 'fleur', 'heure', 'bleu', 'vœu', 'meuble', 'jeune', 'premier', 'heureux', 'chevaux', 'mieux', 'peuple', 'acteur', 'nœud', 'neveu', 'beurre'], ['eu (j\'ai eu)', 'oignon', 'feuille', 'neuve']),
 6: (['été', 'année', 'et', 'marcher', 'nez', 'café', 'journée', 'assez', 'chez', 'boulanger', 'clé', 'rocher'], ['mer', 'fer', 'hiver', 'elle']),
 7: (['lait', 'mais', 'jamais', 'baleine', 'reine', 'mer', 'fait', 'vrai', 'neige', 'balai', 'hiver', 'frais'], ['main', 'peint', 'plein', 'faim']),
 8: (['père', 'fête', 'forêt', 'belle', 'terre', 'tête', 'élève', 'bête', 'perle', 'veste', 'bonnet', 'violet'], ['le', 'premier', 'ferme', 'petit']),
 9: (['maman', 'enfant', 'champ', 'jambe', 'blanc', 'chambre', 'gant', 'lampe', 'grand', 'camp', 'manger', 'rang'], ['panne', 'année', 'ami', 'canard']),
 10: (['dent', 'temps', 'vent', 'pendant', 'ensemble', 'trembler', 'souvent', 'membre', 'parent', 'lentement', 'emporter', 'cent'], ['ennemi', 'chienne', 'examen', 'femme']),
 11: (['bonbon', 'nombre', 'pont', 'lapin', 'timbre', 'pain', 'plein', 'brun', 'parfum', 'jardin', 'compter', 'demain', 'ceinture', 'lundi', 'ombre', 'faim', 'monde', 'chemin', 'humble', 'peinture', 'ronde', 'cousin', 'sapin', 'combien',
       'lion', 'tomber', 'raison', 'tonton', 'impossible', 'quinze', 'aucun', 'train', 'main', 'singe', 'simple', 'onze'], ['bonne', 'pomme', 'inutile', 'ancienne']),
 12: (['payer', 'crayon', 'fille', 'travail', 'soleil', 'piano', 'feuille', 'papillon', 'abeille', 'pied', 'yeux', 'réveil', 'bouteille', 'ciel', 'paille', 'voyage', 'famille', 'cahier', 'vieux', 'sommeil', 'grenouille', 'oreille', 'rayon', 'lieu'], ['ville', 'mille', 'tranquille', 'lit']),
 13: (['roi', 'poisson', 'loin', 'moins', 'voiture', 'point', 'kiwi', 'week-end', 'mois', 'besoin', 'histoire', 'coin'], ['oignon', 'poêle', 'moelle']),
 14: (['pomme', 'appeler', 'papier', 'nappe', 'bébé', 'abbé', 'bulle', 'sabbat', 'appui', 'ballon', 'robe', 'apporter'], ['photo', 'sept', 'compter', 'plomb']),
 15: (['tête', 'patte', 'théâtre', 'dos', 'addition', 'cathédrale', 'date', 'attendre', 'rythme', 'midi', 'reddition', 'goutte'], ['nation', 'partiel', 'et', 'grand']),
 16: (['café', 'qui', 'kilo', 'chœur', 'jockey', 'accord', 'coq', 'quatre', 'kayak', 'orchestre', 'occasion', 'cinq', 'parc', 'quand', 'képi', 'technique', 'stock', 'accuser', 'bouquet', 'école', 'koala', 'écho', 'ticket', 'accrocher'], ['citron', 'cerise', 'chat', 'ceci']),
 17: (['gare', 'guitare', 'aggraver', 'gomme', 'guêpe', 'figure', 'longue', 'agglomération', 'gant', 'guidon', 'bague', 'glace', 'vague', 'garçon', 'guérir', 'goûter', 'langue', 'guide', 'grand', 'fatigue', 'gorille', 'bagage', 'aiguille', 'gui'], ['girafe', 'genou', 'nageoire', 'gymnase']),
 18: (['fille', 'effort', 'photo', 'vélo', 'wagon', 'phrase', 'café', 'difficile', 'phare', 'rivière', 'téléphone', 'chouette'], ['wifi', 'clef', 'neuf', 'cerf']),
 19: (['cheval', 'chemin', 'short', 'jardin', 'girafe', 'pigeon', 'chaussure', 'joue', 'gens', 'machine', 'shampoing', 'bougeoir', 'chercher', 'jamais', 'manger', 'orange', 'chanson', 'jouet', 'geler', 'nager', 'boucher', 'déjeuner', 'génial', 'rougeur'], ['chorale', 'orchestre', 'gant', 'guide']),
 20: (['maman', 'pomme', 'nuage', 'année', 'mardi', 'homme', 'sonner', 'neige', 'immense', 'personne', 'mouton', 'canne'], ['enfant', 'bon', 'fin', 'chant']),
 21: (['lune', 'ville', 'balle', 'aller', 'loup', 'pelle', 'salle', 'lit', 'belle', 'colline', 'lettre', 'illustre'], ['fille', 'feuille', 'travail', 'gentil']),
 22: (['rue', 'terre', 'rhume', 'rose', 'carré', 'rhinocéros', 'arbre', 'verre', 'rond', 'courir', 'arriver', 'rhubarbe'], ['monsieur', 'premier', 'boulanger', 'aller']),
 23: (['sel', 'tasse', 'cerise', 'garçon', 'piscine', 'nation', 'soleil', 'poisson', 'ceinture', 'leçon', 'science', 'attention', 'souris', 'brosse', 'citron', 'reçu', 'descendre', 'patience', 'sac', 'classe', 'cinéma', 'maçon', 'scène', 'récréation',
       'savoir', 'aussi', 'ciel', 'commençons', 'scie', 'addition', 'reste', 'passer', 'cent', 'façon', 'piscine', 'portion'], ['rose', 'maison', 'chaise', 'cousin']),
 24: (['rose', 'zéro', 'deuxième', 'maison', 'gazon', 'dixième', 'cousin', 'zoo', 'sixième', 'chaise', 'onze', 'raison'], ['six', 'dix', 'soleil', 'texte']),
 25: (['montagne', 'campagne', 'peigne', 'agneau', 'oignon', 'ligne', 'gagner', 'signal', 'champignon', 'araignée', 'magnifique', 'cygne'], ['gnou', 'diagnostic', 'stagnant', 'gant']),
}
def mots_semaine(fiche, part, nparts):
    m, intr = SONS[fiche]
    n = max(6, len(m) // nparts)
    sel = m[(part - 1) * n:(part - 1) * n + 6]
    if len(sel) < 6: sel = (sel + m)[:6]
    return sel, intr
