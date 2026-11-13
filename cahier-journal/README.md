# Cahier journal CM1-CM2 (2026-2027)

Outils qui fabriquent le cahier journal de la classe, semaine par semaine : planning, séances détaillées et fiches élèves (Word), à partir du cadrage validé le 12 novembre 2026. Utilisés par la compétence « cahier-journal-cm1-cm2 ».

## Contenu

| Chemin | Rôle |
|---|---|
| `src/lib.js` | Mise en forme Word : planning (paysage), séances (blocs et tableau des phases), fiches élèves (une par page, version aménagée en Verdana 14) |
| `src/build.js` | `node src/build.js p2s3 [Jour]` : construit une semaine (ou un jour) dans `out/Cahier_journal_CM1-CM2_2026-2027/<dossier>` |
| `src/gen.js` | Intègre le problème du jour (générateur de problèmes) et le rituel de calcul mental dans chaque jour |
| `src/calcmental.py` | Séries des tables (six formes, 15 calculs ; CM1 entiers, CM2 dixièmes) : `python3 src/calcmental.py <graine> <tables CM1> <tables CM2>` |
| `src/procedures.py` | Procédures et faits usuels par période, fractions d'une quantité (P3-P5), pourcentages (P4-P5), vérifiés en arithmétique exacte : `python3 src/procedures.py <graine> <période> <CM1\|CM2> <n>` |
| `src/progression_sons.js` | Les 25 fiches de sons réparties sur les 36 semaines (`node src/progression_sons.js`) |
| `src/p2s3/` | Semaine modèle P2 S3 (16-20 novembre) : un fichier par jour, `commun.js` (verbe du jour, chasse au mot), `ortho.js` (son de la semaine), `semaine.js` (planning) |
| `lucy-lost/plan_P2.md` | Plan de lecture de Lucy Lost en période 2 : chapitres et pivot de chaque semaine, débat, activités, écrits, vigilance, corpus de grammaire. Le dossier de Pierre (textes adaptés, fiches de compréhension) reste hors du dépôt ; le cahier journal y renvoie comme fichiers séparés |
| `cheval-de-guerre/plan_P3.md` | Plan de lecture de Cheval de guerre en période 3 (à valider) ; P4 : Matilda (remplace Le Bon Gros Géant), P5 : L'Enfant Océan, voir `annee/lecture.py` |
| `img/` | Figures dessinées pour la classe (droites, droites graduées, schéma de circuit) |
| `gen/p2s3/` | Sorties du générateur et du calcul mental pour la semaine modèle |
| `referentiel/` | Référentiel des progressions en PDF et son script (`python3 referentiel/build_ref.py && node referentiel/topdf.js`) |
| `../scripts/cahier.ts` | Découpe une semaine du générateur de problèmes par jour : `npx tsx scripts/cahier.ts <semaine> <graine> <dossier> [schémas] [titre]` |

## Faire une nouvelle semaine

1. Copier `src/p2s3/` vers `src/pXsY/` et réécrire chaque jour d'après le cadrage.
2. Générer le problème du jour : `npx tsx scripts/cahier.ts <n> CJ-PXSY cahier-journal/gen/pXsY <schémas> "<titre>"`.
3. Générer le calcul mental dans `gen/pXsY/cm2/` (`Mardi.json`, `Vendredi.json`, `proc_<Jour>_<CM1|CM2>.json`).
4. `node src/build.js pXsY`, puis convertir en PDF et vérifier chaque page.

Prérequis : Node (dépendance `docx` du dépôt), Python 3, Playwright pour le PDF du référentiel.

## L'année complète (générateur)

`annee/` produit les 36 semaines d'un coup, d'après le cadrage et le référentiel : `data.py` (calendrier zone A, jours fériés, progressions par période et par semaine), `data2.py` (sciences, histoire-géographie, EMC, anglais, arts, EPS), `lecture.py` (un pivot par semaine : Charlie, Lucy Lost, Cheval de guerre, Matilda en P4, L'Enfant Océan en P5 ; questions et attendus, aucun texte des romans), `dictees.py` (phrases de dictée et verbes du jour), `sons.py` (mots par fiche de son), `exos.py` (exercices de maths vérifiés en arithmétique exacte), `conj.py` (conjugaison exacte avec verbecc).

1. Générer les problèmes du jour : `for n in $(seq 1 36); do npx tsx scripts/cahier.ts $n CJ-S$n cahier-journal/gen/annee/s$(printf %02d $n); done` (depuis la racine du dépôt).
2. `pip install --break-system-packages verbecc` puis `python3 annee/gen_annee.py` (JSON dans `gen/annee_json/`).
3. `node src/build_annee.js [numéros de semaines]` : plannings, séances et fiches dans `out/`. La semaine P2 S3 garde sa version faite à la main (`node src/build.js p2s3`).

## Calendrier

Zone A 2026-2027 : P1 = S1-S7, P2 = S8-S14 (2 nov.-18 déc.), P3 = S15-S20 (4 janv.-12 févr.), P4 = S21-S26 (1er mars-9 avr.), P5 = S27-S36 (26 avr.-2 juil.). Les progressions de maths et de géométrie du cadrage, écrites sur 7 + 7 + 8 semaines pour P3 à P5, se lisent comme une suite continue : « P3 S7 » se fait en P4 S1, « P4 S1-S5 » en P4 S2-S6, « P4 S6-S7 » en P5 S1-S2, « P5 S1-S8 » en P5 S3-S10.
