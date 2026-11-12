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
