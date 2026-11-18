# SPEC-RO-ORACLE — Ajout de 2 modules au site « Rev24 »

> Fichier destiné à **Claude Code**. Ce document **complète `SPEC.md`**.
> - Si le projet Rev24 existe déjà : ajoute les deux modules ci-dessous en respectant l'architecture existante (contenu data-driven dans `src/content/<module>/`, schémas Zod, i18n FR / Darija latin / EN, QCM, exercices, flashcards, examen blanc, mode 24h).
> - Si le projet n'existe pas encore : construis d'abord tout `SPEC.md`, puis ce fichier.
> Ne demande pas de validation entre les étapes : construis, teste, corrige, continue.

Modules ajoutés :
1. **`ro`** — Recherche Opérationnelle : théorie des graphes (4IIR, EMSI)
2. **`oracle`** — Administration Oracle 1 / DBA1 (4IIR G22, Oracle 19c)

Mêmes règles qu'avant : 3 langues pour **tout** le texte (FR par défaut ; darija en alphabet latin, ton simple d'ami qui explique ; EN), commandes / SQL / formules jamais traduits, mobile-first, animations utiles, `prefers-reduced-motion` respecté, `npm run i18n:check` et `npm run content:check` à 0 erreur.

Couleurs : module RO = accents orange/ambre ; module Oracle = accents rouge/bordeaux (style console SQL*Plus sombre).

---

## 1. Module RO — Recherche Opérationnelle (graphes)

### 1.1 Chapitres

| # | Chapitre | Source |
|---|---|---|
| 1 | Graphes : définitions et terminologie | Cours « Chapitre Graphes » |
| 2 | Représentation matricielle | Cours « Chapitre Graphes » |
| 3 | Chaînes, cycles, connexité, Euler, Hamilton | Cours « Chapitre Graphes » |
| 4 | Graphes particuliers : simple, complet, planaire, biparti, coloration | Cours « Chapitre Graphes » |
| 5 | Arbres, forêts, arbres couvrants : Kruskal & Prim | Cours « Arbres et Forêts » |
| 6 | Plus court chemin : Dijkstra | Demandé au contrôle continu (rédiger le cours) |
| 7 | Annales : contrôle continu 2025-2026 corrigé | Contrôle du 28/11/2025 |

### 1.2 Contenu de référence (source de vérité)

**Définitions**
- Applications : plans de transport, réseaux d'ordinateurs, tournois sportifs.
- Graphe = ensemble de sommets + arêtes (non orienté) ou arcs (orienté).
- Non orienté : G = (S, A), S non vide, A = paires non ordonnées {s1, s2} = arêtes ; s1 et s2 adjacents ; boucle = extrémités confondues.
  Exemple du cours : S = {1,…,7}, A = {{1,3},{1,4},{7,1},{3,4},{5,3},{3,6},{3,7},{7,4},{3}}.
- Orienté : A = couples ordonnés (s1, s2) = arcs.
  Exemple : S = {1,…,6}, A = {(1,2),(2,4),(2,5),(4,1),(4,4),(4,5),(5,4),(6,3)}.
- **Ordre** = nombre de sommets. **Taille** = nombre d'arêtes.
- **Degré** d(a) = nombre d'arêtes incidentes, boucle comptée 2 fois ; 0 si isolé.
- **Théorème** : Σ degrés = 2 × nombre d'arêtes (donc pair). **Corollaire** : le nombre de sommets de degré impair est pair.
- **Graphe simple** : au plus une arête entre deux sommets, sans boucle. À tout graphe orienté on associe un graphe simple.
- **Graphe complet Kn** : simple, tous les sommets adjacents deux à deux ; nombre d'arêtes = n(n−1)/2.
- Exercices du cours : graphe sur {2,…,8} avec i–j reliés si premiers entre eux ; graphe orienté sur {1,…,12} « être multiple de » ; graphe d'amitié de 9 personnes.

**Matrices**
- Matrice d'adjacence M(G) n×n : mij = nombre d'arêtes entre si et sj (orienté : nombre d'arcs de si vers sj).
- Non orienté → symétrique. Graphe simple → diagonale nulle. Orienté → somme des coefficients = nombre d'arcs.
- Matrice sommet-arc : 0 si non incident, 1 si sortant, −1 si entrant. Matrice sommet-arête. Matrice sommet-sommet.
- **(M^k)ij = nombre de chemins (chaînes) de longueur k de si à sj** ; la trace de M^k compte les circuits fermés de longueur k (demandé au contrôle).

**Chaînes et cycles**
- Chaîne = succession d'arêtes adjacentes ; longueur = nombre d'arêtes ; simple = arêtes distinctes ; élémentaire = sommets distincts (sauf extrémités) ; fermée = origine = extrémité.
- Cycle = chaîne fermée à arêtes toutes distinctes (orienté : chemin, circuit).
- Connexe : toute paire de sommets reliée par une chaîne. Fortement connexe (orienté) : un chemin pour tout couple (s1, s2).
- **Eulérien** = passe une fois par chaque **arête**. **Hamiltonien** = passe une fois par chaque **sommet**.
- **Théorème d'Euler** : graphe simple connexe → cycle eulérien ⇔ tous les degrés pairs.
- Chaîne eulérienne (semi-eulérien) ⇔ 0 ou 2 sommets de degré impair ; si 2, ce sont les extrémités de la chaîne.

**Graphes particuliers**
- Planaire : arêtes ne se croisent qu'aux sommets.
- Biparti : S = S1 ∪ S2, aucune arête à l'intérieur de S1 ni de S2.
- Coloration : sommets adjacents de couleurs différentes ; nombre chromatique χ(G) = minimum de couleurs ; graphe planaire → χ ≤ 4.

**Arbres**
- Arbre = non orienté, connexe, sans cycle. Racine (orienté) = chemin de r vers tout sommet. Arborescence = racine + chemin unique vers chaque sommet.
- Équivalences pour n sommets : connexe sans cycle ⇔ connexe avec n−1 arêtes ⇔ sans cycle avec n−1 arêtes.
- Applications : réseaux de communication à moindre coût, urbanisme / routes, câblage optimal.
- Arbre couvrant = connexe, sans cycle, contient tous les sommets. Kn possède **n^(n−2)** arbres couvrants (Cayley).
- **Kruskal** : trier les arêtes par poids croissant ; partir d'un arbre vide ; ajouter chaque arête si elle ne crée pas de cycle ; s'arrêter quand n−1 arêtes. Présentation en tableau « poids | arête | à choisir ✓ / à éliminer ✗ ».
- **Prim** : partir d'un sommet ; à chaque étape ajouter l'arête de poids minimal reliant l'arbre à un sommet hors de l'arbre. Présentation en tableau « Ensemble S | sommets (poids ; prédécesseur) », ∞ au départ.
  Exemple du cours : arbre {B,D},{B,C},{A,D},{E,F},{C,F}, poids 14.
  Exercice du cours (9 sommets, départ 1) : arbre {1,2},{1,3},{4,5},{5,8},{5,6},{6,7},{8,9},{3,9}, poids 37.
- **Dijkstra** (poids ≥ 0) : distances initiales ∞ sauf source 0 ; à chaque étape fixer le sommet non traité de plus petite distance, relâcher ses voisins (d(v) = min(d(v), d(u) + w(u,v))) ; noter le prédécesseur ; reconstruire le chemin à rebours. Tableau d'itérations obligatoire (format examen).

### 1.3 Annale : contrôle continu 2025-2026 (28/11/2025, 1h30, calculatrice autorisée) — à intégrer comme examen blanc corrigé

**Exercice 2** — réseau de 6 stations A–F, matrice d'adjacence :

```
    A B C D E F
A   0 0 1 1 1 1
B   0 0 1 1 0 0
C   1 1 0 1 0 1
D   1 1 1 0 1 1
E   1 0 0 1 0 1
F   1 0 1 1 1 0
```

Poids : A–C 4, A–D 3, A–E 7, A–F 2, B–C 9, B–D 5, C–D 2, C–F 3, D–E 12, D–F 5, E–F 3.

Résultats attendus (**à vérifier par des tests Vitest** sur les fonctions de graphe du site) :
- 11 arêtes ; non complet (K6 en a 15, il en manque 4) ; connexe.
- Degrés : A 4, B 2, C 4, D 5, E 3, F 4.
- Inspecter chaque ligne une seule fois = chaîne eulérienne : **oui**, exactement 2 sommets impairs (D et E) → la chaîne va de D à E. Exemple : D–A–C–B–D–C–F–A–E–D–F–E.
- Partie A (Kruskal ou Prim) : arbre couvrant minimal de **coût 15** (milliers de DH), ex. A–F 2, C–D 2, A–D 3, E–F 3, B–D 5. Il existe plusieurs arbres de coût 15 : accepter toute solution valide.
- Partie B (Dijkstra) : plus court trajet B → E = **13 min**, ex. B–D–F–E (5+5+3) ; B–D–A–F–E (5+3+2+3) est aussi optimal.

**Exercice 3.1** — degrés 4, 3, 3, 2, 1 : **impossible**, la somme (13) est impaire.

**Exercice 3.2** — matrice d'adjacence d'un graphe orienté à 3 sommets, puis nombre de chemins de longueur 4 via M^4 et circuits de longueur 4 via la trace de M^4. Le schéma original n'est pas lisible : créer un exercice équivalent avec un graphe orienté de 3 sommets défini dans le contenu, et calculer M^4 par le code.

**Exercice 1** (graphe A–G) : la figure n'est pas exploitable ; créer un graphe équivalent à 7 sommets et reprendre les 7 questions : ordre et taille, degré d'un sommet, sommets impairs, chaîne de longueur 3, voisins, cycle hamiltonien, arêtes à ajouter pour être complet = 21 − taille.

### 1.4 Composants interactifs (module RO)

1. **`GraphEditor`** : créer / déplacer des sommets et des arêtes au doigt ; orienté ou non, pondéré ou non. Affiche en direct l'ordre, la taille, les degrés, la vérification Σ degrés = 2 × arêtes, la connexité, et les étiquettes simple / complet / biparti / eulérien / semi-eulérien.
2. **`MatrixSync`** : la matrice d'adjacence et le dessin du graphe restent synchronisés dans les deux sens. Bouton « M^k » qui surligne le nombre de chemins de longueur k entre deux sommets, puis les énumère.
3. **`EulerHamiltonTracer`** : l'étudiant trace un parcours au doigt ; le site valide eulérien / hamiltonien ; animation de l'algorithme de Fleury ou d'Hierholzer.
4. **`KruskalAnimator`** : liste des arêtes triées à gauche, graphe à droite ; chaque étape colore l'arête (✓ verte ou ✗ rouge « crée un cycle »), avec la visualisation des composantes (union-find) et le tableau au format examen qui se remplit.
5. **`PrimAnimator`** : l'arbre grandit depuis le sommet de départ ; le tableau « Ensemble S | (poids ; prédécesseur) » se remplit ligne par ligne, exactement comme dans le cours.
6. **`DijkstraAnimator`** : file de priorité visible, relâchement des arêtes animé, tableau d'itérations, chemin final surligné.
7. **`ColoringGame`** : colorier un graphe avec le minimum de couleurs, plus un algorithme glouton (Welsh-Powell) en démonstration.
8. **`BipartiteChecker`** : coloration en 2 couleurs par BFS, et mise en évidence du cycle impair qui empêche le graphe d'être biparti.
9. **Mode « Feuille d'examen »** : pour Kruskal / Prim / Dijkstra, l'étudiant remplit lui-même le tableau, et le site corrige case par case.
10. Les algorithmes (degrés, connexité, Euler, Kruskal, Prim, Dijkstra, puissance de matrice, coloration gloutonne, biparti) sont codés dans `src/lib/graph/` avec des tests Vitest. **Les corrigés numériques sont générés par ce code**, jamais tapés à la main.

### 1.5 Volume minimum (RO)

- **≥ 90 QCM**, dont ≥ 25 `numeric` (degrés, tailles, poids d'arbre, distances, n^(n−2), n(n−1)/2) et ≥ 25 de difficulté 3.
- **≥ 25 exercices difficiles**, avec génération aléatoire de graphes pour Kruskal / Prim / Dijkstra (infini, avec corrigé automatique).
- **≥ 50 flashcards**.
- 1 examen blanc « Contrôle continu » de 1h30 au format exact du vrai contrôle (3 exercices, choix Partie A / Partie B).

---

## 2. Module Oracle — Administration Oracle 1 (DBA1)

### 2.1 Chapitres (plan officiel du cours)

| # | Chapitre | Statut |
|---|---|---|
| 1 | Introduction et installation | « Bientôt disponible » (verrouillé) |
| 2 | Architecture globale (+ CDB/PDB, TP1/TP2) | **Contenu fourni** |
| 3 | Instance Oracle : SGA, PGA, processus, démarrage/arrêt (+ TP1 sessions) | **Contenu fourni** |
| 4 | Gestion des paramètres et des fichiers de paramètres | Verrouillé, structure prête |
| 5 | Gestion des fichiers de journalisation | Verrouillé, structure prête |
| 6 | Archivelog | Verrouillé, structure prête |
| 7 | Gestion des fichiers de contrôle | Verrouillé, structure prête |
| 8 | Tablespaces | Verrouillé, structure prête |

Les chapitres verrouillés s'affichent avec leur titre, en grisé. On les débloque en ajoutant simplement leurs fichiers de contenu plus tard.

### 2.2 Contenu de référence

**Architecture globale**
- Serveur Oracle = **instance** (mémoire SGA + processus d'arrière-plan) + **base de données** (fichiers physiques).
- Fichiers de la base : fichiers de données (datafiles), fichiers de contrôle (control files), fichiers de journalisation (redo log files). Fichiers associés : fichier de paramètres (pfile/spfile), fichier de mots de passe, archives (archived redo logs).
- Côté client : processus utilisateur → connexion → session → processus serveur (+ PGA).
- **Multitenant (12c+, ici 19c)** :
  - **CDB** (conteneur) = CDB$ROOT + PDB$SEED + une ou plusieurs **PDB** (ex. ORCLPDB).
  - Utilisateur **commun** créé dans la racine avec le préfixe obligatoire **`C##`** ; utilisateur **local** créé dans une PDB.
  - D'où l'erreur `ORA-65096` si on fait `CREATE USER ETUDIANT` dans CDB$ROOT ; ça marche après `ALTER SESSION SET CONTAINER=ORCLPDB`.
- Exercice d'application 1 :
```
  sqlplus / as sysdba
  SHOW PDBS;
  ALTER PLUGGABLE DATABASE ORCLPDB OPEN;   -- si MOUNTED
  SHOW CON_NAME;
  CREATE USER ETUDIANT IDENTIFIED BY etudiant123;   -- échoue dans CDB$ROOT
  GRANT CREATE SESSION TO ETUDIANT;
  ALTER SESSION SET CONTAINER=ORCLPDB;
  SHOW CON_NAME;
  CREATE USER ETUDIANT IDENTIFIED BY etudiant123;   -- réussit
  GRANT CREATE SESSION TO ETUDIANT;
  CONNECT etudiant/etudiant123@localhost:1521/ORCLPDB
```
- Exercice d'application 2 : installer le schéma HR (dépôt oracle-samples/db-sample-schemas, dossier `human_resources/hr_install.sql`, chemin sans espaces ni accents).
  1. `sqlplus / as sysdba`
  2. `SHOW CON_NAME`
  3. `SHOW PDBS`
  4. `ALTER SESSION SET CONTAINER=ORCLPDB`
  5. `@C:\oracle_samples\...\hr_install.sql` (mot de passe `root`, tablespace USERS, tablespace temporaire TEMP)
  6. `ALTER USER hr ACCOUNT UNLOCK`
  7. `sqlplus hr/root@localhost:1521/ORCLPDB`
  8. `SELECT table_name FROM user_tables;`

**Instance : mémoire**
- **SGA** (System Global Area) : partagée par les processus serveur et d'arrière-plan.
  - **Shared Pool** : SQL et PL/SQL analysés, paramètres, dictionnaire. Contient la **Library cache** (texte des requêtes, plan d'exécution, arbre d'analyse, réutilisés même par d'autres utilisateurs) et le **Data dictionary cache** (structure des colonnes, privilèges…).
  - **Database Buffer Cache** : copies des blocs lus depuis les datafiles. La lecture se fait **toujours** depuis le buffer ; les blocs fréquents restent en mémoire, ce qui optimise les E/S.
  - **Redo Log Buffer** : tampon réutilisable des modifications (LMD, LDD, internes). Chaque modification dans le buffer cache génère une entrée redo.
  - **Large Pool** (optionnelle) : UGA en serveur partagé, processus d'E/S, sauvegarde/restauration (RMAN). Elle soulage la Shared Pool.
  - **Java Pool** : code et données Java de la JVM.
  - **Streams Pool** : mémoire pour Oracle Streams (partage de données entre bases).
- **PGA** (Program Global Area) : privée, une par processus serveur.
  - **Serveur dédié** : un processus serveur par utilisateur ; PGA = stack space + **UGA**.
  - **Serveur partagé** : plusieurs clients par processus ; l'UGA passe dans la SGA (Shared Pool, ou Large Pool si configurée) ; la PGA ne contient que le stack space.

**Instance : processus d'arrière-plan**
- Obligatoires :
  - **PMON** : surveille les processus ; nettoie après l'échec d'un processus utilisateur (rollback, libération des verrous et ressources).
  - **SMON** : récupération de l'instance au démarrage après un crash ; nettoie les segments temporaires ; regroupe l'espace libre.
  - **DBWn** : écrit les blocs modifiés (« dirty ») du buffer cache vers les datafiles (au checkpoint, quand il manque des buffers libres…). **Pas au COMMIT.**
  - **LGWR** : écrit le redo log buffer vers les redo log files, **au COMMIT**, toutes les 3 s, quand le buffer est rempli au tiers, et avant chaque écriture de DBWn.
  - **CKPT** : déclenche les checkpoints ; met à jour les en-têtes des datafiles et les fichiers de contrôle.
- Facultatif :
  - **ARCn** : copie les redo logs remplis vers les archives, en mode **ARCHIVELOG**.

**Exercice clé : exécution d'une requête** (à animer, voir §2.4)
- `UPDATE customers SET city='Rabat' WHERE id_customer=123; COMMIT;`
  1. Le processus serveur analyse la requête : Shared Pool (library cache : plan déjà existant ? ; dictionary cache : table, colonnes, privilèges).
  2. Le bloc est cherché dans le Buffer Cache, sinon lu depuis le datafile vers le buffer.
  3. L'image avant est gardée dans l'undo (pour rollback et lecture cohérente).
  4. Le bloc est modifié dans le buffer (bloc « dirty »).
  5. Une entrée redo est écrite dans le Redo Log Buffer.
  6. **COMMIT** : LGWR écrit le redo log buffer dans les redo log files, puis la validation est confirmée à l'utilisateur.
  7. DBWn écrira le bloc modifié dans le datafile **plus tard** (checkpoint, CKPT).
- **Différence avec SELECT** : analyse + lecture via le buffer cache + renvoi des lignes. Pas de modification, pas d'undo, pas de redo, pas de LGWR, pas de COMMIT nécessaire.

**Démarrage**
- `STARTUP [OPEN [READ ONLY|READ WRITE] | MOUNT | NOMOUNT | FORCE | RESTRICT]`
- Séquence : **SHUTDOWN → NOMOUNT** (lecture du fichier de paramètres, création de la SGA, démarrage des processus) → **MOUNT** (lecture des fichiers de contrôle, base associée à l'instance) → **OPEN** (ouverture des datafiles et des redo logs en ligne).
- NOMOUNT sert à la création d'une base ou à la recréation des fichiers de contrôle.
- FORCE = shutdown abort + startup. RESTRICT = ouverte seulement aux utilisateurs privilégiés (RESTRICTED SESSION).
- `ALTER DATABASE MOUNT;` / `ALTER DATABASE OPEN [READ WRITE|READ ONLY];`

**Arrêt** — `SHUTDOWN [NORMAL|TRANSACTIONAL|IMMEDIATE|ABORT]`

| Mode | Nouvelles connexions | Attend la déconnexion des sessions | Attend la fin des transactions | Checkpoint / fichiers fermés proprement | Récupération au redémarrage |
|---|---|---|---|---|---|
| NORMAL (défaut) | non | oui | oui | oui | non |
| TRANSACTIONAL | non | non (client déconnecté à la fin de sa transaction) | oui | oui | non |
| IMMEDIATE | non | non | non (rollback des transactions non validées) | oui | non |
| ABORT | non | non | non | **non** | **oui** (SMON) |

**TP1 — Sessions et instance**
- `SET PAGESIZE 1000`, `SET LINESIZE 2000`, `COLUMN MACHINE FORMAT A30` : mise en forme de l'affichage SQL*Plus.
- Lister les sessions :
```
  SELECT sid, serial#, username, status, osuser, machine, program, paddr FROM v$session;
```
  (SID, SERIAL#, STATUS ACTIVE/INACTIVE, OSUSER, PROGRAM). Les lignes sans USERNAME sont les processus d'arrière-plan.
- `SET AUTOTRACE ON STATISTICS`.
- `CREATE USER C##ETUDIANT IDENTIFIED BY etudiant123; GRANT CREATE SESSION TO C##ETUDIANT;`
- Chaque nouvelle connexion du même utilisateur = une **nouvelle session** (SID/SERIAL# différents).
- Sessions inactives :
```
  SELECT sid, serial#, username, status, seconds_in_wait FROM v$session WHERE status='INACTIVE' AND seconds_in_wait > 60;
```
  Intérêt pour le DBA : libérer des ressources.
- `ALTER SYSTEM KILL SESSION 'sid,serial#';` → la session tuée reçoit `ORA-00028: your session has been killed` ; l'autre session du même utilisateur continue normalement.
- `SHUTDOWN` affiche : « Database closed. Database dismounted. ORACLE instance shut down. »
- `STARTUP` affiche la taille de la SGA, puis « Database mounted. Database opened. »
- `SELECT * FROM v$sgainfo;` (composants de la SGA), `SELECT * FROM v$sgastat;` (utilisation).

### 2.3 Vues et commandes à connaître (aide-mémoire + flashcards)

- **Vues** : `v$instance`, `v$database`, `v$session`, `v$process`, `v$sga`, `v$sgainfo`, `v$sgastat`, `v$bgprocess`, `v$pdbs`, `v$parameter`, `v$controlfile`, `v$logfile`, `v$log`, `dba_users`, `dba_data_files`, `dba_tablespaces`, `cdb_users`.
- **Commandes SQL*Plus** : `SHOW PDBS`, `SHOW CON_NAME`, `SHOW SGA`, `SHOW PARAMETER`, `CONNECT`, `DESC`.

### 2.4 Composants interactifs (module Oracle)

1. **`OracleArchitectureMap`** : grand schéma animé, cliquable.
   - Processus utilisateur → processus serveur + PGA.
   - SGA : Shared Pool (library / dictionary cache), Buffer Cache, Redo Log Buffer, Large / Java / Streams Pool.
   - Processus PMON, SMON, DBWn, LGWR, CKPT, ARCn.
   - Fichiers : datafiles, control files, redo logs, archives, spfile, password file.
   - Chaque élément s'ouvre avec son rôle en 3 langues.
2. **`QueryFlowAnimator`** : boutons « Rejouer un UPDATE + COMMIT » et « Rejouer un SELECT ». Des particules animées suivent le chemin de la requête (Shared Pool → Buffer Cache → undo → Redo Log Buffer → LGWR → redo files ; DBWn plus tard). Une frise d'étapes est synchronisée avec l'animation. Mode quiz : « Qui écrit maintenant ? DBWn ou LGWR ? ».
3. **`StartupShutdownSim`** : machine à états SHUTDOWN ⇄ NOMOUNT ⇄ MOUNT ⇄ OPEN. Chaque transition montre les fichiers lus (paramètres → contrôle → datafiles + redo). Les 4 modes de SHUTDOWN sont simulés avec des sessions et des transactions en cours qui réagissent (attente, rollback, coupure ; récupération SMON après ABORT).
4. **`SqlPlusSim`** : faux terminal SQL*Plus avec CDB$ROOT, PDB$SEED et ORCLPDB simulés. Il supporte :
   - `sqlplus / as sysdba`, `SHOW PDBS`, `SHOW CON_NAME`
   - `ALTER SESSION SET CONTAINER`, `ALTER PLUGGABLE DATABASE … OPEN`
   - `CREATE USER` (avec erreur ORA-65096 si utilisateur non `C##` dans la racine), `GRANT CREATE SESSION`, `ALTER USER … ACCOUNT UNLOCK`, `CONNECT`
   - `SELECT` sur `v$session` (sessions simulées), `v$sgainfo`, `v$instance`, `dba_users`, `user_tables`
   - `ALTER SYSTEM KILL SESSION` (→ ORA-00028 dans la session tuée)
   - `STARTUP` / `SHUTDOWN` (tous les modes) avec les messages réels
   - `SET PAGESIZE` / `LINESIZE`, `COLUMN … FORMAT`

   Il propose des **missions** reprenant TP1 et les exercices d'application 1 et 2, avec validation automatique.
5. **`SgaPgaCompare`** : bascule serveur dédié / partagé ; l'UGA se déplace visuellement de la PGA vers la SGA.
6. **`CdbPdbExplorer`** : arbre CDB$ROOT → PDB$SEED / ORCLPDB, avec les utilisateurs communs (C##) et locaux placés au bon endroit.

### 2.5 Volume minimum (Oracle)

- **≥ 90 QCM**, dont ≥ 20 de type `command` (SQL ou SQL*Plus à taper) et ≥ 25 de difficulté 3.
- **≥ 20 exercices difficiles**, ex. :
  - ordonner les étapes d'un UPDATE ;
  - choisir le bon mode de SHUTDOWN selon un scénario ;
  - diagnostiquer une ORA-65096 ;
  - trouver et tuer une session inactive ;
  - passer de NOMOUNT à OPEN.
- **≥ 10 missions SqlPlusSim**.
- **≥ 60 flashcards**.

---

## 3. Intégration au reste du site

- Les deux modules apparaissent sur l'accueil, dans `/m/ro` et `/m/oracle`, avec cours, QCM, exercices, fiche, formulaire, flashcards, examen blanc.
- **Mode 24h** : ajouter les modules au diagnostic et au planificateur.
  - Poids RO : graphes / définitions + matrices > Kruskal / Prim / Dijkstra > Euler / Hamilton > biparti / coloration.
  - Poids Oracle : instance (SGA, processus, startup / shutdown) > architecture + CDB/PDB > TP1 sessions.
- Nouveaux badges : « Kruskal Master », « Dijkstra Speedrun », « LGWR ≠ DBWn », « Shutdown Abort Survivor ».
- Fiches de révision imprimables (une par module, 2 pages max).
- Mettre à jour le README (liste des modules) et les tests Playwright :
  1. résoudre un Kruskal en mode « Feuille d'examen » ;
  2. mission SqlPlusSim « créer ETUDIANT dans ORCLPDB ».

## 4. Ordre de construction

1. `src/lib/graph/` + tests Vitest (cas du §1.3).
2. Contenu RO (3 langues) + composants §1.4.
3. Contenu Oracle (3 langues) + `SqlPlusSim` + composants §2.4.
4. QCM, exercices, flashcards, examens blancs des deux modules (volumes minimum).
5. Intégration au mode 24h, badges, fiches, README.
6. `npm run test`, `npm run i18n:check`, `npm run content:check`, `npm run build`. Tout doit passer.

À la fin, affiche un récapitulatif : nombre de questions, exercices, flashcards et missions par module et par langue, et les résultats des tests.