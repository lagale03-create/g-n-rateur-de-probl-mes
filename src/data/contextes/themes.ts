/**
 * Contextes des semaines de synthèse à thème. Ils ne servent que pour leur thème
 * (champ `theme`), et chacun n'habille que quelques schémas.
 */
import type { Contexte, Parasite } from "../../core/types";

const par = (t: string, cle: string, def: Parasite["vals"][string]): Parasite => ({ t, vals: { [cle]: def } });
const PAR_NOEL = [
  par("Le sapin de l'école mesure {h} de haut.", "h", { type: "nombre", min: 2, max: 4, unite: "m" }),
  par("Les vacances commencent le {j} décembre.", "j", { type: "nombre", min: 18, max: 22 }),
  par("La fête commence à {h}.", "h", { type: "heure", min: 840, max: 900, pas: 15 }),
];
const PAR_TOURNOI = [
  par("Le terrain mesure {l} de long.", "l", { type: "nombre", min: 40, max: 90, unite: "m" }),
  par("Le premier match commence à {h}.", "h", { type: "heure", min: 540, max: 600, pas: 15 }),
  par("Le tournoi existe depuis {a}.", "a", { type: "annee", min: 1995, max: 2020 }),
];
const PAR_COUR = [
  par("L'école a été construite en {a}.", "a", { type: "annee", min: 1955, max: 2005 }),
  par("La récréation dure {d} minutes.", "d", { type: "nombre", min: 15, max: 20 }),
  par("Le grand marronnier de la cour mesure {h} de haut.", "h", { type: "nombre", min: 8, max: 18, unite: "m" }),
];
const PAR_VOYAGE = [
  par("Le centre se trouve à {d} de l'école.", "d", { type: "nombre", min: 120, max: 480, pas: 10, unite: "km" }),
  par("Le départ est prévu à {h}.", "h", { type: "heure", min: 420, max: 480, pas: 15 }),
  par("Le village compte {n} habitants.", "n", { type: "nombre", min: 800, max: 3500, pas: 50 }),
];

const achat = (lieu: string, artA: Contexte["schemas"][string]["mots"]["artA"], artB: Contexte["schemas"][string]["mots"]["artB"], puMax = 6) => ({
  mots: { lieu, artA, artB },
  plages: {
    1: { pu: { min: 1, max: puMax } }, 2: { pu: { min: 1, max: puMax, pas: 0.1 }, prixB: { min: 5, max: 15, pas: 0.5 } },
    3: { pu: { min: 1.05, max: puMax, pas: 0.05 }, puB: { min: 5, max: 15, pas: 0.05 }, nB: { min: 2, max: 3 } },
  },
});

export const THEMES: Contexte[] = [
  // ---------------- Noël (S14) ----------------
  {
    id: "noel-marche", titre: "Au marché de Noël", theme: "noel", parasites: PAR_NOEL,
    schemas: {
      "achat-unite": achat("au marché de Noël", [{ s: "boule de Noël", p: "boules de Noël", g: "f" }, { s: "bougie", g: "f" }], [{ s: "couronne de l'Avent", p: "couronnes de l'Avent", g: "f" }, { s: "calendrier de l'Avent", p: "calendriers de l'Avent" }]),
      "partage-frais": { mots: { occasion: "pour le stand de la classe au marché de Noël", qui: { s: "la classe", g: "f" }, depA: { s: "la location du chalet", g: "f" }, depB: { s: "les décorations", g: "f" }, depC: { s: "le chocolat chaud", g: "m" }, parts: { s: "famille", g: "f" }, aide: "La coopérative offre" } },
    },
  },
  {
    id: "noel-spectacle", titre: "Le spectacle de Noël", theme: "noel", parasites: PAR_NOEL,
    schemas: {
      durees: { mots: { lieu: "pour le spectacle de Noël", qui: { s: "l'école", g: "f", voy: true }, a1: { s: "la chorale des CP", g: "f" }, a2: { s: "la pièce de théâtre des CM", g: "f" }, a3: { s: "la danse des CE1", g: "f" }, limite: "Le Père Noël arrive à" } },
      "division-reste": { mots: { intro: "Pour le spectacle de Noël, on attend", persA: { s: "parent" }, persB: { s: "enfant", voy: true }, pers: { s: "spectateur" }, cont: { s: "rangée de chaises", p: "rangées de chaises", g: "f" }, contient: "peut accueillir", prixPhrase: "La location des chaises d'une rangée coûte", coutPhrase: "En tout, la location des chaises coûte", qcout: "Combien coûte la location des chaises ?", rcout: "La location des chaises coûte", remplir: "On remplit", plein: "complètement", sans: "debout", dansCont: "dans les rangées pleines", absent: "ne peuvent pas venir" } },
    },
  },
  {
    id: "noel-decorations", titre: "Les décorations de Noël", theme: "noel", parasites: PAR_NOEL,
    schemas: {
      decoupe: { mots: { lieu: "pour décorer la classe", qui: { s: "la maîtresse", g: "f" }, matiere: { s: "guirlande dorée", g: "f" }, rouleau: { s: "rouleau" }, objA: { s: "fenêtre", g: "f" }, objB: { s: "porte", g: "f" } } },
      "achat-unite": achat("au magasin de décorations", [{ s: "guirlande lumineuse", p: "guirlandes lumineuses", g: "f" }, { s: "étoile dorée", p: "étoiles dorées", g: "f", voy: true }], [{ s: "sapin en plastique", p: "sapins en plastique" }, { s: "crèche", g: "f" }], 8),
      lots: { mots: { lieu: "pour décorer le sapin", obj: { s: "boule" , g: "f"}, contA: { s: "boîte", g: "f" }, contB: { s: "sachet" }, action: "la directrice achète", action2: "Elle achète aussi", vrac: "récupérées de l'an dernier", retrait: "Les élèves en accrochent", retraitSans: "Les élèves en accrochent une partie", dest: "au sapin", qd: "Combien de boules les élèves ont-ils accrochées au sapin ?", ld: "boules accrochées" } },
    },
  },
  {
    id: "noel-gouter", titre: "Le goûter de Noël", theme: "noel", parasites: PAR_NOEL,
    schemas: {
      remplissage: { mots: { lieu: "pour le goûter de Noël", qui: { s: "la cantinière", g: "f" }, ress: { s: "chocolat chaud", g: "m" }, stockMot: "une grande casserole", recA: { s: "tasse", g: "f" }, recB: { s: "bol" } }, unites: { grande: "L", quantite: "cL", facteur: 100 } },
      "achat-unite": achat("à la pâtisserie", [{ s: "papillote", g: "f" }, { s: "clémentine", g: "f" }], [{ s: "bûche de Noël", p: "bûches de Noël", g: "f" }, { s: "brioche", g: "f" }], 2),
    },
  },
  {
    id: "noel-colis", titre: "Les colis de Noël", theme: "noel", parasites: PAR_NOEL,
    schemas: {
      "achat-unite": achat("au supermarché", [{ s: "paquet de chocolats", p: "paquets de chocolats" }, { s: "boîte de biscuits", p: "boîtes de biscuits", g: "f" }], [{ s: "livre de contes", p: "livres de contes" }, { s: "jeu de société", p: "jeux de société" }], 5),
      lots: { mots: { lieu: "pour les colis des personnes âgées", obj: { s: "chocolat" }, contA: { s: "boîte", g: "f" }, contB: { s: "sachet" }, action: "l'association prépare", action2: "Elle prépare aussi", vrac: "en plus", retrait: "Elle en distribue", retraitSans: "Elle en distribue une partie", dest: "à la maison de retraite", qd: "Combien de chocolats l'association a-t-elle distribués ?", ld: "chocolats distribués" } },
    },
  },
  // ---------------- Tournoi (S21) ----------------
  {
    id: "tournoi-equipes", titre: "Les équipes du tournoi", theme: "tournoi", parasites: PAR_TOURNOI,
    schemas: {
      "division-reste": { mots: { intro: "Pour le tournoi de football, il y a", persA: { s: "fille", g: "f" }, persB: { s: "garçon" }, pers: { s: "joueur" }, cont: { s: "équipe", g: "f", voy: true }, contient: "compte", prixPhrase: "Un jeu de chasubles pour une équipe coûte", coutPhrase: "En tout, les chasubles coûtent", qcout: "Combien faut-il payer pour les chasubles ?", rcout: "Il faut payer", remplir: "On forme", plein: "complètes", sans: "remplaçants", dansCont: "dans les équipes complètes", absent: "sont blessés et ne jouent pas" },
        plages: { 1: { cap: { min: 5, max: 8 } }, 2: { cap: { min: 5, max: 11 }, prix: { min: 15, max: 40 } }, 3: { cap: { min: 5, max: 11 }, prix: { min: 15, max: 40 } } } },
      fraction: { mots: { ensemble: "au tournoi", obj: { s: "joueur" }, groupe1: "sont des CM2", groupe2: "sont des CM1", groupe3: "sont des CE2" } },
    },
  },
  {
    id: "tournoi-buvette", titre: "La buvette du tournoi", theme: "tournoi", parasites: PAR_TOURNOI,
    schemas: { "achat-unite": achat("à la buvette du tournoi", [{ s: "jus de pomme", p: "jus de pomme" }, { s: "crêpe", g: "f" }], [{ s: "sandwich", p: "sandwichs" }, { s: "part de pizza", p: "parts de pizza", g: "f" }], 3) },
  },
  {
    id: "tournoi-resultats", titre: "Les résultats du tournoi", theme: "tournoi", parasites: PAR_TOURNOI,
    schemas: { fraction: { mots: { ensemble: "pendant le tournoi", obj: { s: "match" , p: "matchs"}, groupe1: "se terminent par une victoire de l'école", groupe2: "se terminent par un match nul", groupe3: "sont perdus" } } },
  },
  {
    id: "tournoi-inscriptions", titre: "Les inscriptions au tournoi", theme: "tournoi", parasites: PAR_TOURNOI,
    schemas: {
      tarif: { mots: { lieu: "pour le tournoi", qui: { s: "l'école", g: "f", voy: true }, seance: { s: "joueur inscrit", p: "joueurs inscrits" }, fixe: "d'inscription pour l'équipe" }, plages: { 1: { pu: { min: 2, max: 5 } }, 2: { pu: { min: 2, max: 5 } }, 3: { pu: { min: 1.5, max: 5, pas: 0.5 } } } },
      fraction: { mots: { ensemble: "parmi les inscrits au tournoi", obj: { s: "enfant", voy: true }, groupe1: "jouent au football", groupe2: "jouent au basket", groupe3: "jouent au handball" } },
    },
  },
  {
    id: "tournoi-maillots", titre: "Les maillots du tournoi", theme: "tournoi", parasites: PAR_TOURNOI,
    schemas: {
      "achat-unite": achat("au magasin de sport", [{ s: "maillot" }, { s: "paire de chaussettes", p: "paires de chaussettes", g: "f" }], [{ s: "ballon" }, { s: "sac de sport", p: "sacs de sport" }], 12),
      tarif: { mots: { lieu: "au magasin de sport", qui: { s: "l'entraîneur", g: "m", voy: true }, seance: { s: "maillot floqué", p: "maillots floqués" }, fixe: "pour le logo de l'école" }, plages: { 1: { pu: { min: 8, max: 15 } }, 2: { pu: { min: 8, max: 15 } }, 3: { pu: { min: 8, max: 15, pas: 0.5 } } } },
    },
  },
  // ---------------- Aménagement de la cour (S28) ----------------
  ...([
    ["cour-potager", "Le potager de la cour", { s: "le potager de la cour", g: "m" }, { s: "grillage", g: "m" }, { s: "paillage", g: "m" }, "la brouette", { s: "le composteur", g: "m" }],
    ["cour-jeux", "Le terrain de jeux", { s: "le terrain de jeux", g: "m" }, { s: "barrière", g: "f" }, { s: "gazon synthétique", g: "m" }, "l'entrée", { s: "le panier de basket", g: "m" }],
    ["cour-preau", "Le préau", { s: "le sol du préau", g: "m" }, { s: "bordure en caoutchouc", g: "f" }, { s: "dalle souple", p: "dalles souples", g: "f" }, "le passage vers les classes", { s: "le coin des vélos", g: "m" }],
    ["cour-calme", "Le coin calme", { s: "le coin calme", g: "m" }, { s: "haie", g: "f" }, { s: "pelouse", g: "f" }, "l'allée", { s: "le banc", g: "m" }],
  ] as const).map(([id, titre, objet, cloture, revetement, ouverture, partie]): Contexte => ({
    id, titre, theme: "cour", parasites: PAR_COUR,
    schemas: { terrain: { mots: { lieu: "dans la cour de l'école", objet, cloture, revetement, ouverture, partie } } },
  })),
  {
    id: "cour-bac-sable", titre: "Le bac à sable", theme: "cour", parasites: PAR_COUR,
    schemas: { volume: { mots: { lieu: "dans la cour de l'école", objet: { s: "le bac à sable", g: "m" }, ress: { s: "sable", g: "m" }, seau: { s: "seau" } } } },
  },
  // ---------------- Voyage de fin d'année (S35) ----------------
  {
    id: "voyage-transport", titre: "Le transport du voyage", theme: "voyage", parasites: PAR_VOYAGE,
    schemas: {
      "division-reste": { mots: { intro: "Pour le voyage de fin d'année, l'école emmène", persA: { s: "élève", voy: true }, persB: { s: "accompagnateur", voy: true }, pers: { s: "personne", g: "f" }, cont: { s: "car" }, contient: "peut transporter", prixPhrase: "La location d'un car pour le séjour coûte", coutPhrase: "En tout, la location des cars coûte", qcout: "Combien l'école va-t-elle payer pour les cars ?", rcout: "L'école va payer", remplir: "On remplit", plein: "complètement", sans: "sans place", dansCont: "dans les cars pleins", absent: "sont malades et ne partent pas" },
        plages: { 1: { nA: { min: 40, max: 70 }, nB: { min: 4, max: 9 }, cap: { min: 20, max: 30, pas: 5 } }, 2: { nA: { min: 60, max: 110 }, nB: { min: 6, max: 12 }, cap: { min: 45, max: 60, pas: 5 }, prix: { min: 450, max: 900, pas: 10 } }, 3: { nA: { min: 80, max: 140 }, nB: { min: 8, max: 15 }, cap: { min: 45, max: 60, pas: 5 }, prix: { min: 450, max: 900, pas: 5 } } } },
      "partage-frais": { mots: { occasion: "pour le transport du voyage", qui: { s: "l'école", g: "f", voy: true }, depA: { s: "la location du car", g: "f" }, depB: { s: "le péage", g: "m" }, depC: { s: "le repas du chauffeur", g: "m" }, parts: { s: "élève", voy: true }, aide: "La mairie verse une aide de" } },
    },
  },
  {
    id: "voyage-hebergement", titre: "L'hébergement du voyage", theme: "voyage", parasites: PAR_VOYAGE,
    schemas: {
      tarif: { mots: { lieu: "au centre d'hébergement", qui: { s: "la classe", g: "f" }, seance: { s: "nuit", g: "f" }, fixe: "de dossier" }, plages: { 1: { fixe: { min: 20, max: 60, pas: 10 }, pu: { min: 30, max: 80, pas: 5 } }, 2: { fixe: { min: 20, max: 60, pas: 10 }, pu: { min: 30, max: 80, pas: 5 } }, 3: { fixe: { min: 20, max: 60, pas: 10 }, pu: { min: 30, max: 80, pas: 2.5 } } } },
      "partage-frais": { mots: { occasion: "pour l'hébergement", qui: { s: "l'école", g: "f", voy: true }, depA: { s: "les nuits au centre", g: "f" }, depB: { s: "les draps", g: "m" }, depC: { s: "la taxe de séjour", g: "f" }, parts: { s: "famille", g: "f" }, aide: "L'association des parents offre" } },
    },
  },
  {
    id: "voyage-visites", titre: "Les visites du voyage", theme: "voyage", parasites: PAR_VOYAGE,
    schemas: { durees: { mots: { lieu: "pendant le voyage", qui: { s: "la classe", g: "f" }, a1: { s: "la visite du château", g: "f" }, a2: { s: "le pique-nique", g: "m" }, a3: { s: "l'atelier de poterie", g: "m" }, limite: "Le dîner est servi à" } } },
  },
  {
    id: "voyage-budget", titre: "Le budget du voyage", theme: "voyage", parasites: PAR_VOYAGE,
    schemas: { "partage-frais": { mots: { occasion: "pour le voyage de fin d'année", qui: { s: "l'école", g: "f", voy: true }, depA: { s: "le transport", g: "m" }, depB: { s: "l'hébergement", g: "m", voy: true }, depC: { s: "les visites", g: "f" }, parts: { s: "élève", voy: true }, aide: "La kermesse a rapporté" } } },
  },
  {
    id: "voyage-repas", titre: "Les repas du voyage", theme: "voyage", parasites: PAR_VOYAGE,
    schemas: {
      "partage-frais": { mots: { occasion: "pour les repas du voyage", qui: { s: "les accompagnateurs", g: "m" }, depA: { s: "les pique-niques", g: "m" }, depB: { s: "les goûters", g: "m" }, depC: { s: "le repas au restaurant", g: "m" }, parts: { s: "adulte", voy: true }, aide: "Le centre offre" } },
      "achat-unite": achat("à la boulangerie du village", [{ s: "sandwich", p: "sandwichs" }, { s: "pain au chocolat", p: "pains au chocolat" }], [{ s: "grande tarte", p: "grandes tartes", g: "f" }, { s: "quiche", g: "f" }], 4),
    },
  },
];
