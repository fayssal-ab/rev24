# GROUP22 · EMSI — study hub 4IIR

Site de révision pour les contrôles de 4IIR (EMSI Rabat, 2026/2027) :

- **Administration Unix / Linux RHEL 9** : Intro, TP1 → TP5, utilisateurs et droits ;
- **Analyse de données** (Pr. A. Kadiri) : Chap 0 + rappel (statistique descriptive, régression), Chap 1 pandas + Feuille N°1, Chap 2 nettoyage, Chap 4 visualisation, Chap 5 tests d'hypothèses (lois et tables) — reconstruit depuis les supports du Drive, expliqué pas à pas ;
- **Recherche Opérationnelle** (graphes) : définitions, matrices, Euler/Hamilton, coloration, Kruskal/Prim, Dijkstra, annale du contrôle 2025-2026 (examen blanc chronométré). Les corrigés numériques sont calculés par `src/lib/graph/` (testé) ;
- **Administration Oracle 1** (19c) : Chap 2 architecture (connexion, instance, CDB/PDB, exercices 1 et 2), Chap 3 instance (schéma interactif de l'instance, SGA, PGA, processus, UPDATE vs SELECT, STARTUP/SHUTDOWN), TP1 corrigé ; chapitres 1 et 4 à 8 « bientôt disponibles ».

Il propose des cours animés, des QCM (5 types), des exercices corrigés pas à pas, des flashcards (SM-2) et un examen blanc. Il inclut aussi un **terminal RHEL 9 simulé** avec missions, un **labo de stats** et un **coach de présentation orale** (dans le profil, avec un téléprompteur qui suit la voix). La progression est enregistrée sur l'appareil (localStorage), y compris la position de lecture dans chaque chapitre. Le tout est en **français, darija (alphabet latin) et anglais**, fonctionne hors-ligne (PWA) et n'a pas de backend.

## Installation

```bash
npm install
npm run dev          # http://localhost:5173
```

Node 20+ recommandé.

## Comptes (MySQL)

Chaque étudiant crée son compte (e-mail + mot de passe) ; sa progression est enregistrée dans MySQL et synchronisée entre ses appareils. Sans configuration, le site fonctionne en **mode local** (progression dans le navigateur uniquement).

- API : `netlify/functions/api.mts` (Netlify Function, servie sous `/api/*`) — mots de passe hachés avec bcrypt, session dans un cookie `httpOnly` signé (JWT), chaque utilisateur n'accède qu'à ses données.
- Tables : `database/schema.sql` (créées automatiquement au premier appel de l'API).
- Le coach de présentation orale n'est visible que pour les e-mails listés dans `ORAL_EMAILS` (côté serveur).

Variables d'environnement (Netlify → Site configuration → Environment variables) :

| Variable | Valeur |
|---|---|
| `VITE_AUTH` | `on` (comptes obligatoires) |
| `DATABASE_URL` | `mysql://avnadmin:MOT_DE_PASSE@hôte:port/defaultdb` (Aiven → Service URI) |
| `DB_CA_CERT` | contenu du « CA certificate » Aiven (texte PEM) |
| `JWT_SECRET` | longue chaîne aléatoire (≥ 32 caractères) |
| `ORAL_EMAILS` | facultatif, e-mails autorisés pour le coach oral (séparés par des virgules) |

En local : copier `.env.example` en `.env.local`, lancer `npm run dev:api` puis `VITE_AUTH=on npm run dev`.

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run dev:api` | API locale (comptes) sur le port 8788, utilisée par `npm run dev` via le proxy `/api` |
| `npm run build` | `content:check` + `i18n:check` + TypeScript + build de production (`dist/`) |
| `npm run preview` | Sert `dist/` sur http://localhost:4173 |
| `npm run test` | Tests Vitest : stats, graphes, moteur QCM, SM-2, coach oral, TerminalSim, contenu |
| `npm run test:e2e` | Playwright (4 parcours : langue, « Mes erreurs », mission TP5, sauvegarde de la progression). Lancer `npm run build` avant, puis `npx playwright install chromium` la première fois |
| `npm run lint` | ESLint |
| `npm run content:build` | Régénère les JSON de `src/content/` depuis les sources compactes `content-src/` |
| `npm run content:check` | Valide le contenu (schémas Zod, références croisées, volumes minimums, valeurs numériques recalculées par la bibliothèque de stats, solutions des missions rejouées dans le terminal simulé, couverture des 44 questions du TP5) |
| `npm run i18n:check` | Liste les traductions manquantes (fr / dar / en). Doit afficher 0 |

Le site est 100 % statique (routeur à base de `#`), donc déployable tel quel sur GitHub Pages, Vercel ou Netlify : il suffit de publier `dist/`.

## Organisation

```
src/
  content/<module>/        contenu JSON (lu par l'application, chargé à la demande)
    module.json            titre, couleur, thème, chapitres, poids à l'examen
    chapters/<id>.json     sections du cours (text, heading, code, formula, table, animation, callout, miniQuiz, mission)
    questions/<ch>.json    QCM : single | multi | command | numeric | order
    exercises/<ch>.json    exercices : indices, solution pas à pas, réponse, erreurs fréquentes
    flashcards/<ch>.json
    missions.json          missions du terminal (optionnel)
    reference.json         formulaire / aide-mémoire (optionnel)
  lib/                     schémas Zod, stats, moteur QCM, SM-2
  terminal/                simulateur bash RHEL 9 (VFS, comptes, systemd, rpm/dnf, GRUB…)
  anim/                    animations interactives (référencées par nom dans le contenu)
  i18n/                    textes de l'interface et des animations (fr / dar / en)
  pages/ components/ store/
content-src/               sources compactes du contenu ([fr, dar, en]) → npm run content:build
scripts/                   content-check, i18n-check, build-content
tests/e2e/                 Playwright
```

## Ajouter un nouveau module (Recherche opérationnelle, Oracle, Virtualisation…)

Il n'y a aucun code à modifier : l'application découvre automatiquement tout dossier `src/content/<id>/` qui contient un `module.json`.

1. **Copier un dossier de contenu**, par exemple `cp -r src/content/data src/content/ro`.
2. **Remplir les JSON** :
   - `module.json` : `id` (= nom du dossier), `title`, `subtitle`, `color`, `icon` (`chart`, `terminal`, `book`…), `theme` (`terminal` vert ou `violet`), la liste `chapters`, les `weights` de chaque chapitre (utilisés par l'examen blanc) et éventuellement `upcoming` (chapitres « bientôt disponibles ») ;
   - un fichier par chapitre dans `chapters/`, puis `questions/`, `exercises/`, `flashcards/` (et `reference.json`, `missions.json` si besoin).

   Chaque texte affiché est un objet `{ "fr": "…", "dar": "…", "en": "…" }`. Les commandes, le code et les formules ne se traduisent pas.

   Une question `numeric` peut porter un champ `"compute": { "fn": "zStat", "args": [41.25, 40, 2, 25] }` : la réponse est alors recalculée par `src/lib/stats.ts`. Pour un exercice, le champ `checks` joue le même rôle.
3. **Lancer `npm run content:check`**, puis `npm run i18n:check` : les deux doivent passer sans erreur.

   Les volumes minimums vérifiés pour chaque module sont définis dans la constante `MIN` de `scripts/content-check.ts` : ajoute une entrée si tu veux en imposer pour le nouveau module.
4. `npm run dev` : le module apparaît sur l'accueil, dans la navbar et dans le profil.

> Optionnel : on peut aussi écrire le contenu sous forme compacte dans `content-src/<id>/index.ts` (tuples `[fr, dar, en]`, aides `single`, `cmd`, `num`, `ex`, `fc`, `ms` de `content-src/lib.ts`). Il faut alors ajouter l'id dans `scripts/build-content.ts` et lancer `npm run content:build`.

## Terminal simulé

- **Comptes** : `root` / `redhat`, `etudiant` / `etudiant`.
- **Fichiers réellement mis à jour** par les commandes : `/etc/passwd`, `shadow`, `group`, `gshadow`, `/etc/default/useradd`, `login.defs`, `/etc/skel`, `/etc/sudoers` (+ `sudoers.d`).
- **Éditeur simplifié** (`vi`, `nano`, `visudo`, `vipw`, `vigr`) : une ligne tapée est ajoutée à la fin du fichier.
  - `:r N texte` remplace la ligne N ;
  - `:i N texte` insère une ligne avant la ligne N ;
  - `:d N` supprime la ligne N ;
  - `:wq` enregistre et quitte ;
  - `:q!` quitte sans enregistrer.
- **Bouton « Réinitialiser »** : remet la machine dans l'état « Installation_propre ».
- **Missions** : chaque objectif est vérifié automatiquement sur l'état du système (✅ en direct). La mission `m-root-reset` démarre directement au prompt `switch_root:/#`, comme après avoir ajouté `rd.break` dans GRUB.
