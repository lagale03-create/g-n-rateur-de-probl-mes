# Générateur de problèmes à étapes CM1-CM2

Application qui fonctionne entièrement dans le navigateur, hors ligne. Aucune donnée n'est envoyée sur Internet.
Elle génère des séries hebdomadaires de problèmes à étapes, différenciées sur 3 niveaux (★, ★★, ★★★), avec leur corrigé.

> **État actuel : étape 5 en cours.** La période 1 (semaines 1 à 7) est couverte, ainsi que les semaines 8 et 19.
> Schémas : états et transformations, comparaison, grands nombres, lots (multiplication), division avec reste,
> consommation et stock, achats et passage à l'unité. Contextes (11) : zoo, centre équestre, randonnée, cantine,
> boulangerie, confitures, bibliothèque, piscine, journal de l'école, jardin, kermesse.

## Lancer l'application

```bash
npm install
npm run dev          # ouvre http://localhost:5173
npm test             # lance tous les tests
npm run build        # crée dist/index.html : un seul fichier, à ouvrir d'un double-clic
npm run exemple -- 5 MAGRAINE   # écrit la semaine 5 en texte dans docs/exemple-S05.md
npm run docx -- 5 MAGRAINE      # écrit la semaine 5 en Word dans docs/S05_Problemes_a_etapes_mixtes.docx
```

## Interface

Trois espaces, accessibles en haut de la page :

**Préparer la semaine** (enseignant)
- Réglages : semaine de la progression (les semaines « à venir » n'ont pas encore de schéma) ou **notion libre**
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
src/export/    export Word (docx) et ZIP (jszip)
src/ui/        interface React : etat.ts (logique testée), Preparation, Isole, Eleve, Carte
tests/         tests Vitest
```
