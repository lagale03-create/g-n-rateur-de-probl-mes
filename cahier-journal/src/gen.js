// Intègre au cahier journal les sorties des deux générateurs de Pierre :
//  - générateur de problèmes (dépôt g-n-rateur-de-probl-mes) : fichiers Word par jour + resume.json ;
//  - générateur de calcul mental (compétence calcul-mental) : séries de 30 calculs, 6 rubriques.
const fs = require('fs');
const path = require('path');

const ETOILES = { 1: '★', 2: '★★', 3: '★★★' };
const MOMENT = { Lundi: 'Jour 1, problème 1', Mardi: 'Jour 1, problème 2', Jeudi: 'Jour 2 (problèmes 1 et 2, mêmes contextes, inconnue « à l\'envers »)', Vendredi: 'évaluation (nouveau contexte)' };
const RUBS = ['Produit', 'Facteur manquant', 'Quotient', 'Diviseur manquant', 'Dividende manquant', 'Égalité inversée'];

function seanceProbleme(dir, jour, h) {
  const r = JSON.parse(fs.readFileSync(path.join(dir, 'resume.json'), 'utf8'));
  const d = r[jour];
  const corr = [];
  for (const n of ['1', '2', '3']) {
    (d[n] || []).forEach((p, i) => {
      corr.push(`**${ETOILES[n]}${d[n].length > 1 ? ' · problème ' + (i + 1) : ''}** (${p.contexte}) : ${p.etapes.join(' ; ')}. ${p.reponse}${p.parasites.length ? ' Données inutiles : ' + p.parasites.join(' ') : ''}`);
    });
  }
  const sit = [...new Set(Object.values(d).flat().flatMap(p => p.situations))].join(', ');
  const eval_ = jour === 'Vendredi';
  return {
    h, dom: 'Problème du jour', titre: `${r.titre} (générateur, semaine ${r.numero})`,
    comp: 'Résoudre des problèmes à étapes (programmes 2025) ; nommer les situations (Vergnaud, Houdement)',
    obj: eval_ ? `Résoudre seul un problème du même type que ceux de la semaine, dans un nouveau contexte.` : `Résoudre un problème à étapes : ${MOMENT[jour]}. Situations en jeu : ${sit}.`,
    crit: eval_ ? ['les étapes sont écrites', 'la phrase réponse est juste'] : ['chaque étape est nommée et calculée', 'la phrase réponse répond à la question', '★★★ : les données inutiles sont surlignées'],
    mat: `Fichier « problème du jour » du générateur (graine ${r.graine}) : ★ CM1 fragiles (questions guidées), ★★ CM1, ★★★ CM2`,
    fiche: 'Fichier séparé du générateur : imprimer la section de chaque niveau',
    phases: eval_ ? [
      ['Consigne', '2 min', 'Distribue la fiche de chaque niveau ; pas d\'aide sur la démarche.', 'Lisent'],
      ['Évaluation', '18 min', 'Observe sans intervenir ; note qui schématise.', 'Résolvent seuls'],
    ] : [
      ['Lecture', '3 min', 'Lit l\'énoncé de chaque niveau à voix haute (les ★ d\'abord).', 'Surlignent la question ; ★★★ surlignent les données utiles'],
      ['Recherche', '10 min', jour === 'Jeudi' ? 'Rappelle le problème de lundi : même histoire, mais on cherche autre chose.' : 'Passe auprès des ★ : questions guidées une par une.', 'Cherchent, écrivent les étapes'],
      ['Mise en commun', '7 min', 'Fait nommer les situations (réitération, retrait…) et compare deux procédures.', 'Expliquent, corrigent'],
    ],
    diff: [['★', 'questions guidées, une ligne de réponse par étape'], ['★★★', 'données parasites à éliminer, plus d\'étapes']].concat(jour === 'Jeudi' ? [['Rapides', 'problème 2 en défi']] : []),
    corrige: corr,
  };
}

// Rituel de calcul mental validé le 12/11/2026 (8h55-9h10) :
// lundi calcul réfléchi (procédure de la période) + flash de faits ; mardi série des tables (15) + 5 procédures ;
// jeudi entraînement de la procédure + flash fractions ; vendredi bilan sans pression (15 tables + 5 procédures).
const PROC_P2 = {
  CM1: 'relations entre fractions usuelles et écritures décimales ; × 10 et : 10 sur les décimaux',
  CM2: '× et : par 10, 100, 1 000 sur les décimaux ; fractions usuelles',
};
const lire = (dir, f) => JSON.parse(fs.readFileSync(path.join(dir, 'cm2', f), 'utf8'));
const lig = l => l.map((x, i) => `${i + 1}) ${x.r}`).join(' – ');
const enonces = l => l.map((x, i) => `${i + 1}) ${x.q}`).join(' · ');
function procs(dir, jour, niv, n, rub) {
  const l = lire(dir, `proc_${jour}_${niv}.json`);
  return (rub ? l.filter(x => x.rub === rub) : l).slice(0, n);
}

function seanceCalcul(dir, jour, h, tables) {
  const base = { h, dom: 'Calcul mental', comp: 'Calculer mentalement : faits numériques, connaissances de numération, procédures à automatiser (programmes 2025)' };
  if (jour === 'Lundi' || jour === 'Jeudi') {
    const c1 = procs(dir, jour, 'CM1', 12), c2 = procs(dir, jour, 'CM2', 12);
    const lundi = jour === 'Lundi';
    return { ...base,
      titre: lundi ? 'calcul réfléchi : multiplier et diviser un décimal par 10, 100, 1 000' : 'entraînement de la procédure et flash fractions',
      obj: lundi ? 'Trouver, comparer et nommer une procédure pour multiplier ou diviser un décimal par 10 (CM1) ou par 10, 100, 1 000 (CM2) ; retrouver vite les fractions usuelles.'
        : 'Automatiser la procédure de lundi (glissement des chiffres dans le tableau de numération) ; retrouver les égalités entre fractions usuelles et décimaux.',
      crit: ['la procédure est dite avec les mots de la classe (« chaque chiffre prend une valeur 10 fois plus grande »)', 'pas de « on ajoute un zéro » sur un décimal', '9 réponses justes sur 12'],
      mat: 'Ardoises ; tableau de numération affiché (des milliers aux millièmes) ; pas de fiche',
      ref: 'Butlen et Pézard (calcul réfléchi : recherche, comparaison, dénomination des procédures) ; Charnay',
      phases: lundi ? [
        ['Problème', '2 min', 'Écrit CM1 : 4,5 × 10 ; CM2 : 4,77 : 1 000. « Sans poser le calcul. »', 'Cherchent sur l\'ardoise'],
        ['Comparaison', '6 min', 'Affiche trois réponses : 4,50 · 45 · 40,5 (CM2 : 4,77000 · 0,00477 · 0,477). Fait vérifier dans le tableau de numération : chaque chiffre glisse d\'un rang (de trois rangs pour 1 000). Nomme la procédure ; écarte « on ajoute un zéro ».', 'Argumentent, déplacent les chiffres dans le tableau'],
        ['Application', '2 min', 'Dicte les calculs 1 à 6 de chaque niveau (liste ci-dessous).', 'Ardoise levée'],
        ['Flash de faits', '5 min', 'Dicte les calculs 7 à 12 (5 s chacun).', 'Ardoise levée'],
      ] : [
        ['Furet', '5 min', 'Furet du × 10 : 0,3 → 3 → 30 → 300, puis à rebours avec : 10. CM2 : départ 4 567, : 10 jusqu\'à 4,567 puis : 100.', 'Enchaînent à tour de rôle'],
        ['Ardoise', '6 min', 'Dicte les 12 calculs de chaque niveau (liste ci-dessous), en alternant CM1 et CM2.', 'Écrivent, lèvent l\'ardoise'],
        ['Flash fractions', '4 min', 'Montre les cartes ½, ¼, ¾, 1/10, 0,5, 0,25, 0,75, 0,1 : « Donne une autre écriture. »', 'Répondent à l\'oral'],
      ],
      diff: [['CM1 fragiles', 'tableau de numération individuel sous les yeux'], ['CM2 experts', 'inventer un calcul piège et l\'expliquer']],
      corrige: [`CM1 (${PROC_P2.CM1}) : ${enonces(c1)}.`, `Réponses CM1 : ${lig(c1)}.`, `CM2 (${PROC_P2.CM2}) : ${enonces(c2)}.`, `Réponses CM2 : ${lig(c2)}.`],
      note: 'Calculs générés par le générateur de procédures de la classe, chacun vérifié en arithmétique exacte.' };
  }
  const t = lire(dir, jour + '.json');
  const p1 = procs(dir, jour, 'CM1', 5, 'Procédure'), p2 = procs(dir, jour, 'CM2', 5, 'Procédure');
  const bilan = jour === 'Vendredi';
  return { ...base,
    titre: bilan ? `bilan sans pression : tables de ${tables} et procédures` : `série des tables de ${tables} et 5 procédures`,
    obj: `Retrouver un fait des tables de ${tables} sous six formes (CM2 en dixièmes, diviseur toujours entier) et appliquer la procédure de la période.`,
    crit: ['16 réponses justes sur 20', 'CM2 : la virgule est bien placée'],
    mat: 'Fiches CM1 et CM2 (20 calculs) ; graphique personnel de calcul mental',
    ref: 'Compétence calcul mental de la classe (six rubriques) ; générateur de procédures (période 2)',
    fiche: 'CM1 et CM2',
    phases: bilan ? [
      ['Série', '9 min', 'Pas d\'aide, pas de chronomètre affiché : on fait de son mieux.', 'Calculent seuls'],
      ['Autocorrection', '4 min', 'Dicte les réponses.', 'Corrigent au vert'],
      ['Graphique', '2 min', 'Rappelle : on se compare à soi-même.', 'Reportent leur score'],
    ] : [
      ['Échauffement', '2 min', `Fait réciter la table de ${tables.split(' ')[0]} à rebours ; rappelle 9 × n = 10 × n − n.`, 'Récitent'],
      ['Série', '9 min', 'Lance la série ; les rapides vérifient leurs divisions par une multiplication.', 'Calculent'],
      ['Correction', '4 min', 'Corrige collectivement l\'égalité inversée et le piège décimal (CM2).', 'Corrigent au vert'],
    ],
    corrige: [`CM1 tables : ${lig(t.CM1)}.`, `CM1 procédures : ${p1.map((x, i) => `${16 + i}) ${x.r}`).join(' – ')}.`, `CM2 tables : ${lig(t.CM2)}.`, `CM2 procédures : ${p2.map((x, i) => `${16 + i}) ${x.r}`).join(' – ')}.`],
    note: 'Rappel CM2 : on divise un décimal par un entier ; la division par un décimal relève du cycle 4.' };
}

function fichesCalcul(dir, jour, tables) {
  if (jour === 'Lundi' || jour === 'Jeudi') return [];
  const s = lire(dir, jour + '.json');
  return ['CM1', 'CM2'].map(niv => {
    const b = [];
    if (niv === 'CM2') b.push({ t: 'p', x: 'On divise toujours par un nombre entier. Pense à 4 = 4,0.' });
    let k = 0;
    RUBS.forEach(rub => {
      const items = s[niv].filter(x => x.rub === rub);
      b.push({ t: 'consigne', x: rub });
      b.push({ t: 'calc', cols: 3, x: items.map(x => `${++k}) ${x.q}`) });
    });
    b.push({ t: 'consigne', x: 'Procédures' });
    b.push({ t: 'calc', cols: 3, x: procs(dir, jour, niv, 5, 'Procédure').map(x => `${++k}) ${x.q}`) });
    b.push({ t: 'p', x: 'Mon score : ……… / 20' });
    return { dom: 'Calcul mental', niv, titre: `${jour === 'Vendredi' ? 'Bilan' : 'Série'} : tables de ${tables}${niv === 'CM2' ? ' (décimaux)' : ''} et procédures`, b };
  });
}

// Remplace dans une journée les séances et fiches de calcul mental et de problème du jour.
function integrer(day, dir, tables, fichierProblemes) {
  day.seances = day.seances.map(s => {
    if (s.dom === 'Calcul mental') return seanceCalcul(dir, day.jour, s.h, tables);
    if (s.dom === 'Problème du jour') return seanceProbleme(dir, day.jour, s.h);
    return s;
  });
  const autres = day.fiches.filter(f => f.dom !== 'Calcul mental' && f.dom !== 'Problème du jour');
  const iConj = autres.filter(f => f.dom === 'Vocabulaire').length;
  day.fiches = [...autres.slice(0, iConj), ...fichesCalcul(dir, day.jour, tables), ...autres.slice(iConj)];
  day.externes = [...(day.externes || []), ['Problème du jour', `Fichier ${fichierProblemes} (générateur de problèmes)`, '★ ★★ ★★★']];
  return day;
}

module.exports = { integrer };
