# Générateur de problèmes à étapes CM1-CM2

Application qui fonctionne entièrement dans le navigateur, hors ligne. Aucune donnée n'est envoyée sur Internet.
Elle génère des séries hebdomadaires de problèmes à étapes, différenciées sur 3 niveaux (★, ★★, ★★★), avec leur corrigé.

Les 36 semaines de la progression sont couvertes : 32 schémas de problèmes, 11 contextes de la vie courante
et 20 contextes pour les synthèses à thème (Noël, tournoi, aménagement de la cour, voyage de fin d'année),
avec tableaux et graphiques pour les semaines de données.

## Lancer l'application

```bash
npm install
npm run dev          # ouvre http://localhost:5173
npm test             # lance tous les tests
npm run build        # crée dist/index.html : un seul fichier, à ouvrir d'un double-clic
npm run exemple -- 5 MAGRAINE   # écrit la semaine 5 en texte dans docs/exemple-S05.md
npm run docx -- 5 MAGRAINE      # écrit la semaine 5 en Word dans docs/S05_Problemes_a_etapes_mixtes.docx
```

## Mise en ligne (GitHub Pages)

À chaque envoi sur la branche `main`, le fichier `.github/workflows/pages.yml` lance les tests, construit
l'application et la publie. À faire une seule fois sur GitHub : **Settings → Pages → Source : GitHub Actions**.

- Lien enseignant : `https://VOTRE-COMPTE.github.io/generateur-problemes/`
- Lien à donner aux élèves : `https://VOTRE-COMPTE.github.io/generateur-problemes/#eleve`

L'application reste entièrement dans le navigateur : la page est hébergée par GitHub, mais aucune donnée
(préparation, verrous, textes modifiés) n'est envoyée ; tout reste dans le navigateur de chaque utilisateur.

## Interface

Trois espaces, accessibles en haut de la page :

**Préparer la semaine** (enseignant)
- Réglages : semaine de la progression ou **notion libre**
  (titre + schémas à combiner), niveaux à générer, nombre de problèmes par jour (1 à 5), graine,
  contextes à **exclure** et contexte **imposé** pour chaque problème.
- Boutons : **Générer le Jour 1**, **Faire évoluer (Jour 2)**, **Créer l'évaluation**,
  **Exporter la semaine (.docx)**, **Exporter la période (.zip)** (ou l'année complète).
- Aperçu : un onglet par niveau ; chaque problème du Jour 1 est affiché à côté de son évolution du Jour 2,
  avec son corrigé. Sur chaque problème :
  - **Verrouiller** : le problème est conservé quand on régénère le Jour 1, même avec une autre graine
    (son contexte est alors imposé aux autres niveaux) ;
  - **Régénérer** : nouvelles données pour ce seul problème, même contexte ;
  - **Modifier le texte** : énoncé, questions et phrase réponse. Le corrigé n'est pas recalculé :
    pour changer un nombre, régénérez plutôt. **Rétablir le texte généré** annule les modifications.
  - Un Jour 2 dont le Jour 1 a été régénéré est signalé : cliquez de nouveau sur « Faire évoluer ».
- La préparation est enregistrée automatiquement **dans ce navigateur** (jamais envoyée) ;
  « Tout effacer » repart de zéro.
- L'export ZIP d'une période contient la semaine préparée (avec verrous et modifications) et les autres
  semaines générées avec la même graine, plus un `LISEZMOI.txt` qui liste les semaines pas encore disponibles.

**Problème isolé** : cochez les types de situations à combiner (par exemple Union + Groupement),
choisissez le niveau, puis « Générer le problème ». « Autre version » en propose un autre ;
« Exporter ce problème (.docx) » produit une fiche avec son corrigé. Si aucun schéma ne combine
encore ces situations, les combinaisons les plus proches sont proposées.

## Export Word

Dans l'application (mode enseignant), le bouton **« Exporter la semaine (.docx) »** télécharge un fichier
nommé comme `S05_Problemes_a_etapes_mixtes.docx` :

- A4, Arial 12, marges de 2 cm, pied de page « Semaine 5 · page N » ;
- une section par niveau et par jour : chacune commence sur une nouvelle page, pour n'imprimer
  que les pages d'un groupe (dans Word : Imprimer → Pages, ou « s3 » pour la 3e section) ;
- en-tête : titre de la semaine (bleu foncé), niveau et jour (orange), « Prénom / Date », code de la fiche (graine) ;
- ★ Jours 1 et 2 : 2 problèmes par page, chaque question guidée suivie d'une ligne de réponse ;
- ★★, ★★★ et toutes les évaluations : 1 problème par page, cadre « Je cherche, je calcule : »
  qui occupe la place disponible, puis « Ma phrase réponse : » et deux lignes ;
- ★★★ : consigne « Attention : certaines informations ne servent à rien !… » en tête de fiche ;
- corrigé enseignant à la fin (« NE PAS DISTRIBUER »), par niveau puis par jour : étapes nommées,
  données parasites, réponse en gras.

## Mode élève

Ajoutez `#eleve` à la fin de l'adresse (par exemple `index.html#eleve`) ou cliquez sur « Mode élève ».
Sur l'ordinateur où la semaine a été préparée, l'élève voit **la fiche de la classe** (avec les problèmes
régénérés, verrouillés ou modifiés). Ailleurs, il saisit la semaine et le **code de la fiche** imprimé
en haut de sa feuille. Attention : ce code ne reproduit que les problèmes générés directement, sans
régénération ni modification. L'élève choisit ensuite son niveau et son jour. Sous chaque problème, le bouton
**« Voir la correction »** affiche la correction complète, rédigée pour lui : chaque étape
(« Je cherche : … » puis le calcul), les informations inutiles au niveau ★★★ et la phrase réponse.
La correction n'est pas proposée pendant l'évaluation. Pour retrouver exactement les problèmes
imprimés, l'élève doit utiliser la même graine que la fiche.

## Comment ça marche

1. Un **schéma** décrit la structure mathématique d'un problème : ses variables, ses relations
   (`c = a × b`, `c = a + b`), les plages de valeurs selon le niveau, l'inconnue du Jour 1 et les
   inconnues « à l'envers » du Jour 2.
2. Un **contexte** (zoo, boulangerie…) fournit le vocabulaire, les unités, des plages réalistes
   et des données parasites.
3. Le **moteur** tire des valeurs, calcule tout le « monde » du problème, puis cache l'inconnue.
   La solution est retrouvée automatiquement en partant des seules données. Elle n'est
   jamais écrite à la main.
4. Le **vérificateur** contrôle chaque problème : recalcul, nombres positifs, quantités entières,
   euros à 2 décimales au maximum, jamais de décimal × décimal ni de division par un décimal,
   données parasites inutiles et distinctes des données utiles, texte qui cite toutes les données
   sans révéler l'inconnue. Un problème refusé est tiré à nouveau.
5. La **graine** (par exemple `DEMO-2026`) rend tout reproductible. Chaque problème a sa propre sous-graine,
   ce qui permettra de régénérer un seul problème sans toucher aux autres.

## Progression annuelle

Modifiable dans `src/data/progression.ts` (schémas de la semaine, schéma de l'évaluation, thème).
Les 4 problèmes d'une semaine alternent ses schémas ; l'évaluation reprend le premier (ou celui indiqué).

| Sem. | Période | Notion | Schémas | Thème |
|---|---|---|---|---|
| S1 | P1 | Structures additives | `etats-transformations`, `comparaison` |  |
| S2 | P1 | Grands nombres | `grands-nombres` |  |
| S3 | P1 | Multiplication | `lots` |  |
| S4 | P1 | Division et interprétation du reste | `division-reste` |  |
| S5 | P1 | Problèmes à étapes mixtes | `consommation-stock`, `division-reste` |  |
| S6 | P1 | Synthèse de la période 1 | `etats-transformations`, `comparaison`, `lots`, `division-reste` |  |
| S7 | P1 | Synthèse de la période 1 (bis) | `grands-nombres`, `division-reste`, `consommation-stock`, `lots` |  |
| S8 | P2 | Décimaux et monnaie | `liste-courses`, `achat-unite` |  |
| S9 | P2 | Longueurs | `parcours` |  |
| S10 | P2 | Décimal × entier | `decoupe`, `achat-unite` |  |
| S11 | P2 | Décimal ÷ entier | `partage-frais` |  |
| S12 | P2 | Masses et contenances | `remplissage` |  |
| S13 | P2 | Durées | `durees` |  |
| S14 | P2 | Synthèse : la fête de Noël | `liste-courses`, `durees`, `decoupe`, `remplissage` | noel |
| S15 | P3 | Fraction d'une quantité | `fraction-quantite` |  |
| S16 | P3 | Retrouver le tout | `retrouver-tout` |  |
| S17 | P3 | Addition et soustraction de fractions | `fractions-somme` |  |
| S18 | P3 | Linéarité multiplicative | `linearite-mult` |  |
| S19 | P3 | Passage à l'unité et linéarité additive | `achat-unite`, `linearite-add` |  |
| S20 | P3 | Situations proportionnelles ou non | `tarif-affine`, `linearite-mult` |  |
| S21 | P3 | Synthèse : le tournoi | `fraction-quantite`, `linearite-mult`, `division-reste`, `tarif-affine` | tournoi |
| S22 | P4 | Périmètres | `perimetre` |  |
| S23 | P4 | Aires | `aire` |  |
| S24 | P4 | Périmètre et aire avec coûts | `perimetre-aire-couts` |  |
| S25 | P4 | Volumes | `volume` |  |
| S26 | P4 | Pourcentages | `pourcentage` |  |
| S27 | P4 | Échelles et vitesse | `echelle`, `vitesse` |  |
| S28 | P4 | Synthèse : l'aménagement de la cour | `perimetre`, `aire`, `volume`, `perimetre-aire-couts` | cour |
| S29 | P5 | Tableaux à double entrée | `tableau` |  |
| S30 | P5 | Graphiques | `graphique` |  |
| S31 | P5 | Probabilités | `probabilite` |  |
| S32 | P5 | Partages inégaux | `partage-inegal` |  |
| S33 | P5 | Problèmes de recherche | `deux-sortes` |  |
| S34 | P5 | Comparaison d'offres | `tarif-affine`, `offre-lot` |  |
| S35 | P5 | Grand projet de fin d'année | `division-reste`, `tarif-affine`, `durees`, `partage-frais` | voyage |
| S36 | P5 | Bilan et rallye | `consommation-stock`, `fraction-quantite`, `perimetre-aire-couts`, `deux-sortes` |  |

## Les schémas et ce qu'on cherche au Jour 2

Chaque schéma a sa structure pour ★, ★★ et ★★★ (le nombre d'étapes et la taille des nombres augmentent),
une inconnue au Jour 1 et une ou deux inconnues « à l'envers » au Jour 2 (état initial, nombre de groupes,
prix unitaire, durée, dimension, total à partir d'une fraction…). Les fichiers sont dans `src/data/schemas/`.

Particularités :
- **division avec reste** : arrondi au supérieur (« il faut 8 bus ») ou quotient et reste ;
- **fractions** : affichées « 3⁄4 », dénominateurs 2, 4, 10 (★), puis 3, 5 (★★), puis 6, 8, 100 (★★★) ;
- **durées** : « 9 h 15 + 45 min = 10 h » ;
- **pourcentages** : 10 %, 20 %, 25 %, 50 %, calculés en passant par 1 % ;
- **tableaux** (S29) : tableau à double entrée avec des cases inutiles (données parasites) ;
- **graphiques** (S30) : diagramme en barres (★), courbe (★★), diagramme circulaire en % (★★★) ;
- **probabilités** : « 3 chances sur 10 » ;
- **essais et ajustements** (poules et lapins, tentes de 2 et 3 places, billets de 5 et 10 €…).

## Tableaux et graphiques

Un schéma peut décrire un `visuel` (tableau ou graphique) dont les cases sont des variables du problème
(« ? » pour l'inconnue) ou des leurres. À l'écran, le graphique est dessiné en SVG ; dans le fichier Word,
les tableaux sont de vrais tableaux Word et les graphiques des images PNG produites par le navigateur.
Le corrigé commence par une étape « Lecture du tableau / du graphique » qui relève les données utiles.
(Dans les scripts Node, sans navigateur, les graphiques sont dessinés sans texte : utilisez l'application
pour imprimer les semaines 29 et 30.)

## Ajouter un contexte

Copiez `src/data/contextes/zoo.ts`, renommez-le, puis ajoutez-le à la liste de `src/data/contextes/index.ts`.

```ts
export const piscine: Contexte = {
  id: "piscine",
  titre: "À la piscine",
  schemas: {
    // pour chaque schéma que ce contexte sait habiller :
    "achat-unite": {
      mots: {
        lieu: "à l'accueil de la piscine",
        // une liste = un choix au hasard ; g = genre ; p = pluriel s'il est irrégulier
        artA: [{ s: "entrée enfant", p: "entrées enfant", g: "f", voy: true }],
        artB: { s: "bonnet de bain", p: "bonnets de bain", g: "m" },
      },
      // plages réalistes par niveau (elles remplacent celles du schéma)
      plages: {
        1: { pu: { min: 2, max: 4 } },
        2: { pu: { min: 2, max: 4.5, pas: 0.1 }, prixB: { min: 3, max: 6, pas: 0.5 } },
        3: { pu: { min: 2.15, max: 4.5, pas: 0.05 }, puB: { min: 2.5, max: 6, pas: 0.05 }, nB: { min: 2, max: 4 } },
      },
    },
  },
  parasites: [
    { t: "Le grand bassin mesure {l} de long.", vals: { l: { type: "nombre", min: 25, max: 50, pas: 25, unite: "m" } } },
    { t: "La piscine ouvre à {h}.", vals: { h: { type: "heure", min: 540, max: 600, pas: 30 } } },
  ],
};
```

**Facettes partagées.** Plusieurs schémas réutilisent le même bloc de vocabulaire (champ `herite` du schéma) :

| Bloc du contexte | Schémas qui l'utilisent |
|---|---|
| `achat-unite` (lieu, artA, artB, prix) | achats, liste de courses, linéarité multiplicative et additive, pourcentages, tableau, offre par lot |
| `trajet` (qui, étapes, but, moyen) | parcours (longueurs), vitesse |
| `terrain` (objet rectangulaire, clôture, revêtement) | périmètre, aire, périmètre et aire avec coûts, échelle |
| `fraction` (ensemble, groupes) | fraction d'une quantité, retrouver le tout |
| `comparaison` (obj, verbe) | comparaison, partages inégaux |
| `tarif`, `volume`, `serie`, `proba`, `deux-sortes`, `decoupe`, `remplissage`, `durees`, `partage-frais`, `fractions-somme` | un schéma chacun |

**Thèmes.** Un contexte avec `theme: "noel"` (ou `tournoi`, `cour`, `voyage`) n'est utilisé que pour les semaines
de ce thème (`theme` dans la progression). Voir `src/data/contextes/themes.ts`.

Les mots attendus par chaque schéma sont listés dans son champ `roles`.
Un contexte peut aussi remplacer une phrase d'un schéma (champ `textes`) : voir `boulangerie.ts`.

### Écrire une phrase (gabarit)

| Écriture | Résultat |
|---|---|
| `{nA}` | valeur de la variable, avec son unité : « 4 », « 36 kg », « 4,50 € » |
| `[A]` / `[A:pl]` | mot au singulier ou au pluriel |
| `[A:nA]` | mot accordé avec la variable `nA` |
| `[de:ress]` | « de viande », « d'eau » |
| `[un:A]`, `[le:A]`, `[dun:A]` | « un/une », « le/la/l' », « d'un/d'une » |
| `[il:resp]`, `[ils:A]`, `[tous:A]` | pronoms et « tous/toutes » accordés |
| `[prenom]` | prénom tiré au hasard (avec son genre pour `[il:prenom]`) |

Les majuscules en début de phrase et les espaces insécables (avant ? ! : ; et les unités) sont ajoutées automatiquement.

## Ajouter un schéma

Copiez `src/data/schemas/achatUnite.ts`. Pour chaque niveau, la fonction `structure` renvoie :

- `variables` : chaque variable et sa grandeur (`compte`, `euro`, `quantite`…) ;
- `relations` : les égalités entre variables, avec le nom de la situation selon le sens du calcul
  (`{ type: "mul", c: "prix1", a: "pu", b: "n1", noms: { a: "Passage à l'unité" } }`) ;
- `tirage` : l'ordre des tirages et les plages. Les autres variables se calculent seules ;
- `j1` : l'inconnue du Jour 1 et les données affichées ;
- `j2` : les inconnues « à l'envers » possibles et leurs données.

Les textes (`phrases`, `questions`, `guidees`, `libelles`, `reponses`) utilisent des **variantes** :
le moteur prend la première variante dont toutes les variables sont des données.
Ajoutez ensuite le schéma dans `src/data/schemas/index.ts` et dans la progression (`src/data/progression.ts`).
Le test `tests/schemas.test.ts` le vérifie automatiquement sur 1 000 tirages par niveau.

## Organisation du code

```
src/core/      moteur, solveur, vérificateur, semaine, nombres exacts, graine
src/langue/    formatage à la française, nombres en lettres, grammaire, gabarits
src/data/      schémas, contextes, prénoms, progression des 36 semaines
src/export/    export Word (docx), ZIP (jszip), graphiques (SVG / PNG)
src/ui/        interface React : etat.ts (logique testée), Preparation, Isole, Eleve, Carte
tests/         tests Vitest
```
