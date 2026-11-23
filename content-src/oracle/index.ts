import { c1, c2, c3 } from './course';
import { c4, annaleQuestions, annaleExercises, annaleFlashcards } from './annale';
import { setCtx, L, single, multi, cmd, order, ex, fc, ref } from '../lib';
import type { Module } from '../../src/lib/schema';

// ================= Chap 2 — Architecture =================
setCtx('oracle', 'architecture');
const qa = [
  single('or-01', 1, ['Un serveur Oracle est composé…', 'Serveur Oracle = ?', 'An Oracle server is made of…'], [['d\'une instance et d\'une base de données', 'instance + base', 'an instance and a database'], ['d\'une base seulement', 'ghir base', 'a database only'], ['de la SGA seulement', 'ghir SGA', 'the SGA only']], 0,
    ['**Instance** = mémoire (SGA) + processus d\'arrière-plan ; **base** = fichiers physiques.', 'Instance (mémoire + processus) + base (fichiers).', '**Instance** = SGA + background processes; **database** = physical files.'], [['Il manque l\'instance.', 'Na9es instance.', 'Missing the instance.'], ['La SGA n\'est qu\'une partie de l\'instance.', 'SGA jouz2.', 'SGA is only part of the instance.']], ['architecture']),
  multi('or-02', 2, ['Quels fichiers constituent la **base de données** ?', 'Fichiers dyal base ?', 'Which files make up the **database**?'], [['Fichiers de données (datafiles)', 'Datafiles', 'Datafiles'], ['Fichiers de contrôle', 'Control files', 'Control files'], ['Fichiers de journalisation (redo logs)', 'Redo logs', 'Redo log files'], ['Fichier de paramètres (spfile)', 'spfile', 'Parameter file (spfile)']], [0, 1, 2],
    ['Base = datafiles + control files + redo logs. Fichiers **associés** : paramètres (pfile/spfile), mots de passe, archives.', 'Base = 3 fichiers ; spfile associé.', 'Database = datafiles, control files, redo logs; spfile is associated.'], [['Le spfile est un fichier **associé**, pas de la base.', 'spfile associé.', 'spfile is an associated file.']], ['fichiers']),
  single('or-03', 2, ['Dans une CDB 19c, que contient le conteneur ?', 'CDB fiha ?', 'What does a 19c CDB contain?'], [['CDB$ROOT + PDB$SEED + une ou plusieurs PDB', 'ROOT + SEED + PDB', 'CDB$ROOT + PDB$SEED + one or more PDBs'], ['Une seule PDB', 'PDB wa7da', 'One PDB only'], ['Seulement CDB$ROOT', 'Ghir ROOT', 'Only CDB$ROOT']], 0,
    ['Multitenant : racine **CDB$ROOT**, modèle **PDB$SEED** (lecture seule), PDB applicatives (ex. **ORCLPDB**).', 'ROOT, SEED, PDB.', 'Root, seed (read only), application PDBs (ORCLPDB).'], [['Non.', 'La.', 'No.'], ['Non.', 'La.', 'No.']], ['cdb']),
  single('or-04', 3, ['`CREATE USER ETUDIANT ...` dans CDB$ROOT renvoie…', 'CREATE USER f ROOT ?', 'In CDB$ROOT, `CREATE USER ETUDIANT` gives…'], [['ORA-65096: invalid common user or role name', 'ORA-65096', 'ORA-65096'], ['User created.', 'User created.', 'User created.'], ['ORA-01017', 'ORA-01017', 'ORA-01017']], 0,
    ['Dans la racine, un utilisateur **commun** doit commencer par **C##**. Solution : `C##ETUDIANT`, ou `ALTER SESSION SET CONTAINER=ORCLPDB` pour créer un utilisateur **local**.', 'Root → C## ; wla dkhol l ORCLPDB.', 'Root needs **C##**; or switch to ORCLPDB for a local user.'], [['Il faut le préfixe C## dans la racine.', 'C##.', 'C## required.'], ['ORA-01017 = mot de passe invalide à la connexion.', 'Login ghalat.', 'Invalid login.']], ['cdb', 'erreurs']),
  cmd('or-05', 1, ['Affiche les PDB et leur mode d\'ouverture (SQL*Plus).', 'Werri PDB.', 'List PDBs and open mode.'], ['SHOW PDBS', 'show pdbs'], ['`SHOW PDBS` : CON_ID, CON_NAME, OPEN MODE (READ WRITE, MOUNTED…).', 'SHOW PDBS.', '`SHOW PDBS`.'], {}, ['cdb', 'sqlplus']),
  cmd('or-06', 1, ['Affiche le conteneur courant.', 'Conteneur daba ?', 'Show the current container.'], ['SHOW CON_NAME', 'show con_name'], ['Renvoie CDB$ROOT ou ORCLPDB.', 'CDB$ROOT / ORCLPDB.', 'Returns CDB$ROOT or ORCLPDB.'], {}, ['cdb', 'sqlplus']),
  cmd('or-07', 2, ['Bascule la session dans la PDB ORCLPDB.', 'Douz l ORCLPDB.', 'Switch the session to ORCLPDB.'], ['ALTER SESSION SET CONTAINER=ORCLPDB;', 'ALTER SESSION SET CONTAINER = ORCLPDB;', 'alter session set container=orclpdb;'], ['Ensuite `SHOW CON_NAME` affiche ORCLPDB.', 'Men b3d ORCLPDB.', 'Then SHOW CON_NAME shows ORCLPDB.'], {}, ['cdb']),
  cmd('or-08', 2, ['Ouvre la PDB ORCLPDB qui est en état MOUNTED.', 'Fte7 ORCLPDB.', 'Open ORCLPDB (currently MOUNTED).'], ['ALTER PLUGGABLE DATABASE ORCLPDB OPEN;', 'alter pluggable database orclpdb open;'], ['Sinon : ORA-01109 database not open.', 'Sinon ORA-01109.', 'Otherwise ORA-01109.'], {}, ['cdb']),
  cmd('or-09', 2, ['Crée l\'utilisateur commun C##ETUDIANT (mot de passe etudiant123).', 'Dir C##ETUDIANT.', 'Create common user C##ETUDIANT.'], ['CREATE USER C##ETUDIANT IDENTIFIED BY etudiant123;', 'create user c##etudiant identified by etudiant123;'], ['Préfixe C## obligatoire dans la racine.', 'C##.', 'C## mandatory in the root.'], {}, ['cdb', 'utilisateurs']),
  cmd('or-10', 1, ['Autorise ETUDIANT à se connecter.', 'ETUDIANT ydkhol.', 'Allow ETUDIANT to log in.'], ['GRANT CREATE SESSION TO ETUDIANT;', 'grant create session to etudiant;'], ['Sans ce privilège : ORA-01045.', 'Bla : ORA-01045.', 'Without it: ORA-01045.'], {}, ['utilisateurs']),
  cmd('or-11', 3, ['Connecte-toi en etudiant/etudiant123 à ORCLPDB sur localhost:1521.', 'Connexion etudiant ORCLPDB.', 'Connect as etudiant to ORCLPDB on localhost:1521.'], ['CONNECT etudiant/etudiant123@localhost:1521/ORCLPDB', 'connect etudiant/etudiant123@localhost:1521/orclpdb', 'conn etudiant/etudiant123@localhost:1521/ORCLPDB'], ['Format EZConnect : user/mdp@hôte:port/service.', 'user/mdp@hôte:port/service.', 'EZConnect: user/pwd@host:port/service.'], {}, ['utilisateurs']),
  cmd('or-12', 2, ['Déverrouille le compte hr.', 'Fte7 hr.', 'Unlock the hr account.'], ['ALTER USER hr ACCOUNT UNLOCK;', 'alter user hr account unlock;'], ['Après hr_install.sql (sinon ORA-28000).', 'Sinon ORA-28000.', 'Otherwise ORA-28000.'], {}, ['hr']),
  cmd('or-13', 2, ['Liste les tables de l\'utilisateur connecté.', 'Tables dyali ?', 'List the current user\'s tables.'], ['SELECT table_name FROM user_tables;', 'select table_name from user_tables;'], ['HR : COUNTRIES, DEPARTMENTS, EMPLOYEES, JOBS, JOB_HISTORY, LOCATIONS, REGIONS.', '7 tables HR.', 'The 7 HR tables.'], {}, ['hr']),
  single('or-14', 3, ['Un utilisateur **local** est créé…', 'User local ?', 'A **local** user is created…'], [['dans une PDB, sans préfixe C##', 'f PDB bla C##', 'in a PDB, without C##'], ['dans CDB$ROOT', 'f ROOT', 'in CDB$ROOT'], ['dans PDB$SEED', 'f SEED', 'in PDB$SEED']], 0,
    ['Commun : racine + C## (visible dans tous les conteneurs). Local : dans une PDB. Créer C##X dans une PDB → ORA-65094.', 'Commun = ROOT ; local = PDB.', 'Common = root + C##; local = PDB.'], [['Dans la racine → commun.', 'ROOT = commun.', 'Root = common.'], ['PDB$SEED est en lecture seule.', 'SEED read only.', 'SEED is read only.']], ['cdb']),
  order('or-15', 2, ['Ordre de l\'exercice 1 (créer ETUDIANT dans ORCLPDB).', 'Rttab exercice 1.', 'Order exercise 1.'], ['sqlplus / as sysdba', 'SHOW PDBS', 'ALTER PLUGGABLE DATABASE ORCLPDB OPEN;', 'ALTER SESSION SET CONTAINER=ORCLPDB;', 'CREATE USER ETUDIANT IDENTIFIED BY etudiant123;', 'GRANT CREATE SESSION TO ETUDIANT;', 'CONNECT etudiant/etudiant123@localhost:1521/ORCLPDB'],
    ['Connexion SYSDBA → vérifier/ouvrir la PDB → entrer dans la PDB → créer + GRANT → se connecter.', 'Tartib.', 'SYSDBA → open PDB → switch → create + grant → connect.'], ['cdb'])
];
const archFc = [
  fc('fc-or-1', ['Serveur Oracle ?', 'Serveur ?', 'Oracle server?'], ['Instance (SGA + processus) + base (fichiers).', 'Instance + base.', 'Instance + database.']),
  fc('fc-or-2', ['Fichiers de la base ?', 'Fichiers ?', 'Database files?'], ['Datafiles, control files, redo logs (+ associés : spfile, password file, archives).', 'Datafiles, control, redo.', 'Datafiles, control, redo logs.']),
  fc('fc-or-3', ['CDB ?', 'CDB ?', 'CDB?'], ['CDB$ROOT + PDB$SEED + PDB (ORCLPDB).', 'ROOT + SEED + PDB.', 'ROOT + SEED + PDBs.']),
  fc('fc-or-4', ['ORA-65096 ?', 'ORA-65096 ?', 'ORA-65096?'], ['Utilisateur sans C## dans CDB$ROOT → passer en PDB ou préfixer C##.', 'C## wla PDB.', 'Use C## or switch to a PDB.']),
  fc('fc-or-5', ['Utilisateur commun / local ?', 'Commun / local ?', 'Common / local?'], ['Commun : C## dans la racine. Local : dans une PDB.', 'C## / PDB.', 'C## in root / inside a PDB.']),
  fc('fc-or-6', ['Changer de conteneur ?', 'Beddel conteneur ?', 'Switch container?'], ['ALTER SESSION SET CONTAINER=ORCLPDB;', 'ALTER SESSION SET CONTAINER', 'ALTER SESSION SET CONTAINER=ORCLPDB;']),
  fc('fc-or-7', ['Ouvrir une PDB ?', 'Fte7 PDB ?', 'Open a PDB?'], ['ALTER PLUGGABLE DATABASE ORCLPDB OPEN;', 'ALTER PLUGGABLE DATABASE … OPEN', 'ALTER PLUGGABLE DATABASE … OPEN;']),
  fc('fc-or-8', ['Installer HR ?', 'HR ?', 'Install HR?'], ['Dans ORCLPDB : @…\\hr_install.sql, puis ALTER USER hr ACCOUNT UNLOCK.', 'hr_install + unlock.', 'hr_install.sql then unlock.'])
];

// ================= Chap 3 — Instance =================
setCtx('oracle', 'instance');
const qi = [
  single('or-20', 1, ['La **SGA** est…', 'SGA ?', 'The **SGA** is…'], [['une mémoire partagée par les processus serveur et d\'arrière-plan', 'mémoire partagée', 'shared memory'], ['privée à un processus', 'khassa', 'private to one process'], ['un fichier', 'fichier', 'a file']], 0,
    ['SGA = partagée ; PGA = privée (une par processus serveur).', 'SGA partagée, PGA privée.', 'SGA shared; PGA private.'], [['C\'est la PGA.', 'PGA.', 'That is the PGA.'], ['C\'est de la mémoire.', 'Mémoire.', 'It is memory.']], ['sga']),
  single('or-21', 2, ['Où sont stockés les plans d\'exécution réutilisables ?', 'Plans d\'exécution fin ?', 'Where are reusable execution plans stored?'], [['Library cache (Shared Pool)', 'Library cache', 'Library cache (Shared Pool)'], ['Buffer Cache', 'Buffer Cache', 'Buffer Cache'], ['Redo Log Buffer', 'Redo buffer', 'Redo Log Buffer']], 0,
    ['Shared Pool = **library cache** (texte SQL, plan, arbre d\'analyse) + **dictionary cache** (colonnes, privilèges).', 'Library + dictionary cache.', 'Shared Pool = library cache + dictionary cache.'], [['Le buffer cache garde des blocs de données.', 'Blocs.', 'Data blocks.'], ['Le redo buffer garde les modifications.', 'Modifications.', 'Changes.']], ['sga']),
  single('or-22', 2, ['La lecture des données se fait…', 'Lecture ?', 'Data is read…'], [['toujours via le Database Buffer Cache', 'dima mn buffer cache', 'always through the Buffer Cache'], ['directement depuis les datafiles', 'mn datafiles', 'directly from datafiles'], ['depuis le redo log', 'mn redo', 'from the redo log']], 0,
    ['Le bloc est lu du datafile vers le buffer (s\'il n\'y est pas) ; les blocs fréquents restent en mémoire.', 'Buffer cache dima.', 'Always via the buffer cache.'], [['Non.', 'La.', 'No.'], ['Non.', 'La.', 'No.']], ['sga']),
  multi('or-23', 2, ['Rôles de la **Large Pool** ?', 'Large Pool ?', '**Large Pool** uses?'], [['UGA en serveur partagé', 'UGA serveur partagé', 'UGA in shared server'], ['Sauvegarde/restauration RMAN', 'RMAN', 'RMAN backup/restore'], ['Processus d\'E/S', 'E/S', 'I/O processes'], ['Code Java', 'Java', 'Java code']], [0, 1, 2],
    ['Large Pool (optionnelle) soulage la Shared Pool. Le Java va dans la **Java Pool**.', 'Java → Java Pool.', 'Java goes to the Java Pool.'], [['C\'est la Java Pool.', 'Java Pool.', 'Java Pool.']], ['sga']),
  single('or-24', 3, ['En **serveur partagé**, où se trouve l\'UGA ?', 'UGA f serveur partagé ?', 'In **shared server**, where is the UGA?'], [['Dans la SGA (Shared Pool, ou Large Pool si configurée)', 'F SGA', 'In the SGA (Shared or Large Pool)'], ['Dans la PGA', 'F PGA', 'In the PGA'], ['Dans le buffer cache', 'Buffer', 'Buffer cache']], 0,
    ['Dédié : PGA = stack + UGA. Partagé : UGA → SGA ; PGA = stack seulement.', 'Partagé : UGA f SGA.', 'Shared: UGA moves to the SGA.'], [['C\'est en serveur dédié.', 'Dédié.', 'That is dedicated server.'], ['Non.', 'La.', 'No.']], ['pga']),
  single('or-25', 3, ['Quel processus écrit au **COMMIT** ?', 'Chkoun kayktb f COMMIT ?', 'Which process writes at **COMMIT**?'], [['LGWR', 'LGWR', 'LGWR'], ['DBWn', 'DBWn', 'DBWn'], ['CKPT', 'CKPT', 'CKPT']], 0,
    ['**LGWR** écrit le redo log buffer dans les redo logs au COMMIT (et toutes les 3 s, buffer au tiers, avant DBWn). **DBWn n\'écrit pas au COMMIT** : il écrit les blocs « dirty » plus tard.', 'LGWR f COMMIT ; DBWn mn b3d.', '**LGWR** at COMMIT; **DBWn not at COMMIT**.'], [['Piège classique : DBWn écrit plus tard (checkpoint, manque de buffers).', 'Fekh : DBWn mn b3d.', 'Trap: DBWn writes later.'], ['CKPT déclenche les checkpoints et met à jour les en-têtes.', 'CKPT.', 'CKPT signals checkpoints.']], ['processus']),
  single('or-26', 2, ['Quel processus nettoie après l\'échec d\'un processus utilisateur ?', 'Chkoun kaynqi ?', 'Who cleans up after a failed user process?'], [['PMON', 'PMON', 'PMON'], ['SMON', 'SMON', 'SMON'], ['ARCn', 'ARCn', 'ARCn']], 0,
    ['**PMON** : rollback, libère verrous et ressources. **SMON** : récupération de l\'instance au démarrage après crash.', 'PMON processus ; SMON instance.', '**PMON** process cleanup; **SMON** instance recovery.'], [['SMON = récupération d\'instance.', 'SMON = instance.', 'SMON = instance recovery.'], ['ARCn archive les redo logs.', 'ARCn archive.', 'ARCn archives.']], ['processus']),
  single('or-27', 2, ['Après un SHUTDOWN ABORT, qui fait la récupération au redémarrage ?', 'Mor ABORT ?', 'After SHUTDOWN ABORT, who recovers?'], [['SMON', 'SMON', 'SMON'], ['PMON', 'PMON', 'PMON'], ['LGWR', 'LGWR', 'LGWR']], 0,
    ['SMON : récupération d\'instance, nettoyage des segments temporaires, regroupement de l\'espace libre.', 'SMON.', 'SMON.'], [['PMON s\'occupe des processus utilisateurs.', 'PMON.', 'PMON is user processes.'], ['Non.', 'La.', 'No.']], ['processus', 'shutdown']),
  single('or-28', 2, ['ARCn est actif seulement…', 'ARCn imta ?', 'ARCn runs only…'], [['en mode ARCHIVELOG', 'ARCHIVELOG', 'in ARCHIVELOG mode'], ['au démarrage', 'démarrage', 'at startup'], ['en NOMOUNT', 'NOMOUNT', 'in NOMOUNT']], 0,
    ['ARCn copie les redo logs remplis vers les archives (facultatif).', 'Archives.', 'Copies full redo logs to archives.'], [['Non.', 'La.', 'No.'], ['Non.', 'La.', 'No.']], ['processus']),
  order('or-29', 3, ['Ordre d\'exécution de `UPDATE … ; COMMIT;`', 'Tartib UPDATE + COMMIT', 'Order of UPDATE + COMMIT'], [['Analyse (Shared Pool : plan, dictionnaire)', 'Analyse', 'Parse (Shared Pool)'], ['Bloc lu dans le Buffer Cache (sinon depuis le datafile)', 'Buffer Cache', 'Block in Buffer Cache'], ['Image avant dans l\'undo', 'Undo', 'Before image in undo'], ['Bloc modifié (dirty)', 'Dirty', 'Block modified (dirty)'], ['Entrée dans le Redo Log Buffer', 'Redo buffer', 'Redo entry'], ['COMMIT : LGWR écrit les redo logs, confirmation', 'LGWR', 'COMMIT: LGWR writes'], ['Plus tard : DBWn écrit le bloc (checkpoint)', 'DBWn mn b3d', 'Later: DBWn writes the block']],
    ['Analyse → buffer → undo → modification → redo → COMMIT (LGWR) → DBWn plus tard.', 'Tartib.', 'Parse → buffer → undo → modify → redo → LGWR → DBWn later.'], ['requete']),
  multi('or-30', 3, ['Un **SELECT** (par rapport à un UPDATE)…', 'SELECT ?', 'A **SELECT** (vs UPDATE)…'], [['passe par l\'analyse et le buffer cache', 'analyse + buffer', 'parses and uses the buffer cache'], ['ne génère ni undo ni redo', 'bla undo/redo', 'generates no undo/redo'], ['n\'a pas besoin de COMMIT', 'bla COMMIT', 'needs no COMMIT'], ['déclenche LGWR', 'LGWR', 'triggers LGWR']], [0, 1, 2],
    ['SELECT : analyse + lecture via le buffer + renvoi des lignes ; pas de modification, undo, redo, LGWR ni COMMIT.', 'Bla modification.', 'No change, no undo/redo, no LGWR.'], [['Pas de redo → pas de LGWR.', 'Bla LGWR.', 'No redo → no LGWR.']], ['requete']),
  single('or-31', 2, ['Ordre des états au démarrage ?', 'Tartib démarrage ?', 'Startup state order?'], [['SHUTDOWN → NOMOUNT → MOUNT → OPEN', 'NOMOUNT → MOUNT → OPEN', 'NOMOUNT → MOUNT → OPEN'], ['MOUNT → NOMOUNT → OPEN', 'MOUNT → NOMOUNT', 'MOUNT → NOMOUNT → OPEN'], ['OPEN → MOUNT → NOMOUNT', 'L3eks', 'Reverse']], 0,
    ['NOMOUNT : fichier de paramètres lu, SGA créée, processus lancés. MOUNT : fichiers de contrôle lus. OPEN : datafiles + redo logs ouverts.', 'Paramètres → contrôle → datafiles.', 'Parameters → control files → datafiles + redo.'], [['Non.', 'La.', 'No.'], ['Non.', 'La.', 'No.']], ['startup']),
  single('or-32', 2, ['Quels fichiers sont lus au passage en **MOUNT** ?', 'MOUNT : chnou kay9ra ?', 'Files read when going to **MOUNT**?'], [['Les fichiers de contrôle', 'Control files', 'Control files'], ['Le fichier de paramètres', 'Paramètres', 'Parameter file'], ['Les datafiles', 'Datafiles', 'Datafiles']], 0,
    ['MOUNT associe la base à l\'instance grâce aux control files.', 'Control files.', 'Control files.'], [['Lu en NOMOUNT.', 'NOMOUNT.', 'Read at NOMOUNT.'], ['Ouverts en OPEN.', 'OPEN.', 'Opened at OPEN.']], ['startup']),
  single('or-33', 2, ['À quoi sert l\'état NOMOUNT ?', 'NOMOUNT 3lach ?', 'What is NOMOUNT for?'], [['Créer une base ou recréer les fichiers de contrôle', 'Créer base / control files', 'Create a database or recreate control files'], ['Travail normal des utilisateurs', 'Khdma 3adiya', 'Normal user work'], ['Sauvegarder les datafiles', 'Sauvegarde', 'Back up datafiles']], 0,
    ['NOMOUNT : instance démarrée sans base associée.', 'Bla base.', 'Instance without a mounted database.'], [['Il faut OPEN.', 'OPEN.', 'Needs OPEN.'], ['Non.', 'La.', 'No.']], ['startup']),
  cmd('or-34', 2, ['Démarre l\'instance sans monter la base.', 'Bda bla MOUNT.', 'Start the instance without mounting.'], ['STARTUP NOMOUNT', 'startup nomount', 'STARTUP NOMOUNT;'], ['Ensuite ALTER DATABASE MOUNT; puis ALTER DATABASE OPEN;', 'Men b3d MOUNT w OPEN.', 'Then ALTER DATABASE MOUNT / OPEN.'], {}, ['startup']),
  cmd('or-35', 2, ['Depuis MOUNT, ouvre la base.', 'Mn MOUNT, fte7.', 'From MOUNT, open the database.'], ['ALTER DATABASE OPEN;', 'alter database open;', 'ALTER DATABASE OPEN READ WRITE;'], ['Les datafiles et redo logs sont ouverts.', 'Datafiles mfto7in.', 'Opens datafiles and redo logs.'], {}, ['startup']),
  cmd('or-36', 2, ['Passe de NOMOUNT à MOUNT.', 'NOMOUNT → MOUNT.', 'Go from NOMOUNT to MOUNT.'], ['ALTER DATABASE MOUNT;', 'alter database mount;'], ['Lecture des fichiers de contrôle.', 'Control files.', 'Reads the control files.'], {}, ['startup']),
  single('or-37', 3, ['Quel arrêt fait un **rollback** des transactions non validées sans attendre la déconnexion ?', 'Ach men SHUTDOWN kaydir rollback ?', 'Which shutdown rolls back uncommitted work without waiting?'], [['IMMEDIATE', 'IMMEDIATE', 'IMMEDIATE'], ['NORMAL', 'NORMAL', 'NORMAL'], ['TRANSACTIONAL', 'TRANSACTIONAL', 'TRANSACTIONAL']], 0,
    ['IMMEDIATE : pas d\'attente, rollback, checkpoint, arrêt propre, pas de récupération ensuite.', 'IMMEDIATE.', 'IMMEDIATE.'], [['NORMAL attend la déconnexion de tous.', 'NORMAL kaytsenna.', 'NORMAL waits for everyone.'], ['TRANSACTIONAL attend la fin des transactions.', 'Kaytsenna transactions.', 'TRANSACTIONAL waits for transactions.']], ['shutdown']),
  single('or-38', 3, ['Quel arrêt impose une **récupération** au redémarrage ?', 'Ach men arrêt khasso récupération ?', 'Which shutdown requires **recovery**?'], [['ABORT', 'ABORT', 'ABORT'], ['IMMEDIATE', 'IMMEDIATE', 'IMMEDIATE'], ['NORMAL', 'NORMAL', 'NORMAL']], 0,
    ['ABORT : pas de checkpoint, fichiers non fermés proprement → SMON récupère au STARTUP.', 'ABORT → SMON.', 'ABORT → SMON recovery.'], [['IMMEDIATE ferme proprement.', 'Propre.', 'Clean.'], ['NORMAL ferme proprement.', 'Propre.', 'Clean.']], ['shutdown']),
  single('or-39', 2, ['Mode d\'arrêt par défaut ?', 'Par défaut ?', 'Default shutdown mode?'], [['NORMAL', 'NORMAL', 'NORMAL'], ['IMMEDIATE', 'IMMEDIATE', 'IMMEDIATE'], ['ABORT', 'ABORT', 'ABORT']], 0,
    ['`SHUTDOWN` seul = NORMAL : attend la déconnexion de toutes les sessions.', 'NORMAL.', 'NORMAL.'], [['Non.', 'La.', 'No.'], ['Non.', 'La.', 'No.']], ['shutdown']),
  single('or-40', 3, ['Que fait `STARTUP FORCE` ?', 'STARTUP FORCE ?', 'What does STARTUP FORCE do?'], [['SHUTDOWN ABORT puis STARTUP', 'ABORT + STARTUP', 'SHUTDOWN ABORT then STARTUP'], ['STARTUP en lecture seule', 'Read only', 'Read-only startup'], ['Démarre en mode restreint', 'Restreint', 'Restricted startup']], 0,
    ['FORCE = abort + startup. RESTRICT = réservé aux utilisateurs avec RESTRICTED SESSION.', 'FORCE = abort + startup.', 'FORCE = abort + startup.'], [['C\'est OPEN READ ONLY.', 'READ ONLY.', 'That is READ ONLY.'], ['C\'est RESTRICT.', 'RESTRICT.', 'That is RESTRICT.']], ['startup']),
  cmd('or-41', 2, ['Arrête la base en annulant les transactions en cours, proprement.', 'Wa9ef b rollback.', 'Shut down rolling back open transactions, cleanly.'], ['SHUTDOWN IMMEDIATE', 'shutdown immediate', 'SHUTDOWN IMMEDIATE;'], ['Affiche « Database closed. Database dismounted. ORACLE instance shut down. »', 'Messages.', 'Prints the 3 shutdown messages.'], { 'SHUTDOWN ABORT': ['ABORT n\'est pas propre (récupération ensuite).', 'ABORT machi propre.', 'ABORT is not clean.'] }, ['shutdown']),
  cmd('or-42', 2, ['Liste les sessions : sid, serial#, username, status depuis la vue dynamique.', 'Sessions ?', 'List sessions (sid, serial#, username, status).'], ['SELECT sid, serial#, username, status FROM v$session;', 'select sid, serial#, username, status from v$session;'], ['Les lignes sans USERNAME sont les processus d\'arrière-plan.', 'Bla USERNAME = arrière-plan.', 'No USERNAME = background processes.'], {}, ['sessions']),
  cmd('or-43', 3, ['Tue la session SID 45, SERIAL# 2311.', 'Tue session 45,2311.', 'Kill session 45,2311.'], ["ALTER SYSTEM KILL SESSION '45,2311';", "alter system kill session '45,2311';"], ['La session tuée reçoit ORA-00028: your session has been killed.', 'ORA-00028.', 'Killed session gets ORA-00028.'], { "ALTER SYSTEM KILL SESSION '2311,45';": ['Ordre : \'sid,serial#\'.', 'sid,serial#.', 'Order is sid,serial#.'] }, ['sessions']),
  cmd('or-44', 3, ['Liste les sessions INACTIVE qui attendent depuis plus de 60 s.', 'Sessions INACTIVE > 60 s.', 'List INACTIVE sessions waiting > 60 s.'], ["SELECT sid, serial#, username, status, seconds_in_wait FROM v$session WHERE status='INACTIVE' AND seconds_in_wait > 60;", "select sid, serial#, username, status, seconds_in_wait from v$session where status='INACTIVE' and seconds_in_wait > 60;"], ['Permet au DBA de repérer les sessions à libérer.', 'Bach tlibéri ressources.', 'Find sessions to free.'], {}, ['sessions']),
  cmd('or-45', 1, ['Affiche les composants de la SGA.', 'Composants SGA ?', 'Show SGA components.'], ['SELECT * FROM v$sgainfo;', 'select * from v$sgainfo;', 'SHOW SGA'], ['v$sgainfo (composants), v$sgastat (utilisation), SHOW SGA (résumé).', 'v$sgainfo.', 'v$sgainfo / v$sgastat / SHOW SGA.'], {}, ['sga']),
  single('or-46', 2, ['Deux connexions du même utilisateur donnent…', 'Jouj connexions ?', 'Two connections by the same user give…'], [['deux sessions (SID/SERIAL# différents)', 'jouj sessions', 'two sessions (different SID/SERIAL#)'], ['une seule session', 'session wa7da', 'one session'], ['une erreur', 'erreur', 'an error']], 0,
    ['Chaque connexion = une nouvelle session ; tuer l\'une n\'affecte pas l\'autre.', 'Kol connexion session.', 'Each connection is a new session.'], [['Non.', 'La.', 'No.'], ['Non.', 'La.', 'No.']], ['sessions']),
  cmd('or-47', 1, ['Élargit l\'affichage SQL*Plus à 2000 caractères par ligne.', 'LINESIZE 2000.', 'Set line width to 2000.'], ['SET LINESIZE 2000', 'set linesize 2000', 'SET LINES 2000'], ['Aussi SET PAGESIZE 1000, COLUMN MACHINE FORMAT A30.', 'PAGESIZE, COLUMN.', 'Also PAGESIZE, COLUMN … FORMAT.'], {}, ['sqlplus'])
];
const instFc = [
  fc('fc-or-10', ['SGA vs PGA ?', 'SGA vs PGA ?', 'SGA vs PGA?'], ['SGA partagée ; PGA privée (une par processus serveur).', 'Partagée / khassa.', 'Shared / private.']),
  fc('fc-or-11', ['Shared Pool ?', 'Shared Pool ?', 'Shared Pool?'], ['Library cache (SQL, plans) + dictionary cache (colonnes, privilèges).', 'Library + dictionary.', 'Library + dictionary cache.']),
  fc('fc-or-12', ['Buffer Cache ?', 'Buffer Cache ?', 'Buffer Cache?'], ['Copies des blocs ; toute lecture passe par lui.', 'Blocs.', 'Block copies; all reads go through it.']),
  fc('fc-or-13', ['Redo Log Buffer ?', 'Redo buffer ?', 'Redo Log Buffer?'], ['Tampon des modifications, vidé par LGWR.', 'LGWR.', 'Change buffer flushed by LGWR.']),
  fc('fc-or-14', ['Large / Java / Streams Pool ?', 'Pools ?', 'Other pools?'], ['Large : UGA partagé, RMAN, E/S. Java : JVM. Streams : Oracle Streams.', 'Large, Java, Streams.', 'Large, Java, Streams.']),
  fc('fc-or-15', ['Dédié vs partagé ?', 'Dédié vs partagé ?', 'Dedicated vs shared?'], ['Dédié : PGA = stack + UGA. Partagé : UGA dans la SGA.', 'UGA f PGA / SGA.', 'UGA in PGA / SGA.']),
  fc('fc-or-16', ['PMON ?', 'PMON ?', 'PMON?'], ['Nettoie après l\'échec d\'un processus utilisateur (rollback, verrous).', 'Nqi processus.', 'Cleans failed user processes.']),
  fc('fc-or-17', ['SMON ?', 'SMON ?', 'SMON?'], ['Récupération d\'instance au démarrage, segments temporaires, espace libre.', 'Récupération.', 'Instance recovery.']),
  fc('fc-or-18', ['DBWn ?', 'DBWn ?', 'DBWn?'], ['Écrit les blocs dirty vers les datafiles (checkpoint…) — pas au COMMIT.', 'Machi f COMMIT.', 'Writes dirty blocks — not at COMMIT.']),
  fc('fc-or-19', ['LGWR ?', 'LGWR ?', 'LGWR?'], ['Écrit le redo buffer : au COMMIT, toutes les 3 s, buffer au 1/3, avant DBWn.', 'F COMMIT.', 'At COMMIT, every 3 s, 1/3 full, before DBWn.']),
  fc('fc-or-20', ['CKPT / ARCn ?', 'CKPT / ARCn ?', 'CKPT / ARCn?'], ['CKPT : checkpoints, en-têtes et control files. ARCn : archives (ARCHIVELOG).', 'CKPT / archives.', 'Checkpoints / archiving.']),
  fc('fc-or-21', ['NOMOUNT / MOUNT / OPEN ?', 'États ?', 'States?'], ['Paramètres + SGA + processus / control files / datafiles + redo.', 'Paramètres / control / datafiles.', 'Params / control files / datafiles.']),
  fc('fc-or-22', ['SHUTDOWN NORMAL ?', 'NORMAL ?', 'NORMAL?'], ['Défaut : attend la déconnexion de tous ; propre.', 'Kaytsenna ga3.', 'Waits for all sessions.']),
  fc('fc-or-23', ['TRANSACTIONAL ?', 'TRANSACTIONAL ?', 'TRANSACTIONAL?'], ['Attend la fin des transactions puis déconnecte ; propre.', 'Transactions.', 'Waits for transactions.']),
  fc('fc-or-24', ['IMMEDIATE ?', 'IMMEDIATE ?', 'IMMEDIATE?'], ['Rollback immédiat, checkpoint, propre.', 'Rollback, propre.', 'Rollback, clean.']),
  fc('fc-or-25', ['ABORT ?', 'ABORT ?', 'ABORT?'], ['Coupure brutale, pas de checkpoint → récupération SMON.', 'SMON.', 'No checkpoint → SMON recovery.']),
  fc('fc-or-26', ['Tuer une session ?', 'Tue session ?', 'Kill a session?'], ["ALTER SYSTEM KILL SESSION 'sid,serial#'; → ORA-00028", 'KILL SESSION.', "ALTER SYSTEM KILL SESSION 'sid,serial#';"]),
  fc('fc-or-27', ['Vues à connaître ?', 'Vues ?', 'Key views?'], ['v$instance, v$database, v$session, v$process, v$sga, v$sgainfo, v$sgastat, v$bgprocess, v$pdbs, v$parameter, v$controlfile, v$logfile, v$log, dba_users, dba_data_files, dba_tablespaces, cdb_users', 'v$… / dba_…', 'v$ / dba_ views'])
];

setCtx('oracle', 'instance');
const exs = [
  ex('or-x-1', 2, ['Choisir le mode de SHUTDOWN', 'Mode SHUTDOWN', 'Choose a shutdown mode'],
    ['a) Maintenance planifiée, on veut laisser finir les transactions. b) Arrêt urgent sans perte, des utilisateurs restent connectés. c) L\'instance est bloquée.', '3 cas.', 'Three scenarios.'],
    [['Qui attend quoi ?', 'Chkoun kaytsenna ?', 'Who waits for what?']],
    [{ t: ['Réponses', 'Jawab', 'Answers'], b: ['a) TRANSACTIONAL. b) IMMEDIATE (rollback, arrêt propre). c) ABORT, puis STARTUP : SMON récupère.', 'TRANSACTIONAL, IMMEDIATE, ABORT.', 'TRANSACTIONAL, IMMEDIATE, ABORT.'] }],
    ['a TRANSACTIONAL · b IMMEDIATE · c ABORT (+ récupération SMON).', 'a · b · c.', 'a TRANSACTIONAL · b IMMEDIATE · c ABORT.'], [['Utiliser ABORT par confort.', 'ABORT dima.', 'Using ABORT casually.']]),
  ex('or-x-2', 3, ['De SHUTDOWN à OPEN pas à pas', 'Mn SHUTDOWN l OPEN', 'From SHUTDOWN to OPEN'],
    ['L\'instance est arrêtée. Démarre-la étape par étape et indique ce qui est lu à chaque étape.', 'Démarrage étape b étape.', 'Start step by step and say what is read.'],
    [['Trois états.', '3 états.', 'Three states.']],
    [{ t: ['Commandes', 'Commandes', 'Commands'], b: ['NOMOUNT : paramètres (spfile), SGA, processus. MOUNT : control files. OPEN : datafiles + redo logs.', 'Paramètres → control → datafiles.', 'Params → control → datafiles.'], code: 'STARTUP NOMOUNT\nALTER DATABASE MOUNT;\nALTER DATABASE OPEN;' }],
    ['STARTUP NOMOUNT → ALTER DATABASE MOUNT → ALTER DATABASE OPEN.', 'NOMOUNT → MOUNT → OPEN.', 'NOMOUNT → MOUNT → OPEN.'], [['Faire ALTER DATABASE OPEN depuis NOMOUNT (ORA-01507).', 'ORA-01507.', 'OPEN from NOMOUNT fails.']]),
  ex('or-x-3', 3, ['Trouver et tuer une session inactive', 'Tue session inactive', 'Kill an idle session'],
    ['C##ETUDIANT a deux sessions ; l\'une est INACTIVE depuis 10 minutes. Trouve-la et tue-la. Que voit chaque session ?', 'Lqaha w qtelha.', 'Find and kill it; what does each session see?'],
    [['Filtre sur status et seconds_in_wait.', 'status w seconds_in_wait.', 'Filter on status and seconds_in_wait.']],
    [{ t: ['Requête et kill', 'Requête w kill', 'Query and kill'], b: ['', '', ''], code: "SELECT sid, serial#, username, status, seconds_in_wait FROM v$session\n WHERE username='C##ETUDIANT' AND status='INACTIVE' AND seconds_in_wait > 60;\nALTER SYSTEM KILL SESSION '45,2311';" },
     { t: ['Effet', 'Natija', 'Effect'], b: ['Session tuée : ORA-00028 à la prochaine commande. L\'autre continue normalement.', 'ORA-00028.', 'ORA-00028; the other continues.'] }],
    ['Requête v$session filtrée + ALTER SYSTEM KILL SESSION \'sid,serial#\'.', 'v$session + KILL.', 'Filtered v$session + KILL SESSION.'], [['Inverser sid et serial#.', 'L3eks.', 'Swapping sid and serial#.']])
];
setCtx('oracle', 'architecture');
exs.push(
  ex('or-x-4', 3, ['Diagnostiquer ORA-65096', 'ORA-65096', 'Diagnose ORA-65096'],
    ['Connecté `sqlplus / as sysdba`, `CREATE USER ETUDIANT IDENTIFIED BY etudiant123;` renvoie ORA-65096. Explique et propose deux solutions.', 'Fesser w 2 7oloul.', 'Explain and give two fixes.'],
    [['Regarde SHOW CON_NAME.', 'SHOW CON_NAME.', 'Check SHOW CON_NAME.']],
    [{ t: ['Cause', 'Sabab', 'Cause'], b: ['On est dans CDB$ROOT : un utilisateur y est commun et doit commencer par C##.', 'ROOT → C##.', 'In CDB$ROOT users are common → C##.'] },
     { t: ['Solutions', '7oloul', 'Fixes'], b: ['1) Utilisateur local dans la PDB. 2) Utilisateur commun C##ETUDIANT.', 'PDB wla C##.', 'Local in PDB, or common C##.'], code: 'ALTER SESSION SET CONTAINER=ORCLPDB;\nCREATE USER ETUDIANT IDENTIFIED BY etudiant123;\nGRANT CREATE SESSION TO ETUDIANT;\n-- ou : CREATE USER C##ETUDIANT IDENTIFIED BY etudiant123;' }],
    ['Passer dans ORCLPDB (utilisateur local) ou nommer l\'utilisateur C##ETUDIANT.', 'ORCLPDB wla C##.', 'Switch to ORCLPDB or use C##.'], [['Oublier GRANT CREATE SESSION (ORA-01045).', 'ORA-01045.', 'Forgetting CREATE SESSION.']]),
  ex('or-x-5', 2, ['Installer le schéma HR', 'Installer HR', 'Install the HR schema'],
    ['Donne la suite de commandes pour installer HR dans ORCLPDB et lister ses tables.', 'Commandes HR.', 'Commands to install HR and list its tables.'],
    [['Le script doit tourner dans la PDB.', 'F PDB.', 'Run it in the PDB.']],
    [{ t: ['Commandes', 'Commandes', 'Commands'], b: ['Mot de passe root, tablespace USERS, temporaire TEMP.', 'root, USERS, TEMP.', 'Password root, USERS, TEMP.'], code: 'sqlplus / as sysdba\nALTER SESSION SET CONTAINER=ORCLPDB;\n@C:\\oracle_samples\\db-sample-schemas\\human_resources\\hr_install.sql\nALTER USER hr ACCOUNT UNLOCK;\nCONNECT hr/root@localhost:1521/ORCLPDB\nSELECT table_name FROM user_tables;' }],
    ['7 tables : COUNTRIES, DEPARTMENTS, EMPLOYEES, JOBS, JOB_HISTORY, LOCATIONS, REGIONS.', '7 tables.', '7 tables.'], [['Chemin avec espaces ou accents.', 'Espaces f chemin.', 'Path with spaces/accents.']])
);

export const module: Module = {
  id: 'oracle',
  title: L(['Administration Oracle 1 (DBA1)', 'Administration Oracle 1', 'Oracle Administration 1 (DBA1)']),
  subtitle: L(['Oracle 19c — architecture, CDB/PDB, instance (SGA, PGA, processus), démarrage/arrêt, TP1', 'Oracle 19c — architecture, CDB/PDB, instance, démarrage/arrêt, TP1', 'Oracle 19c — architecture, CDB/PDB, instance (SGA, PGA, processes), startup/shutdown, lab 1']),
  color: '#163460',
  icon: 'layers',
  theme: 'crimson',
  chapters: ['architecture', 'instance', 'tp1', 'annale'],
  upcoming: [
    { id: 'o-install', order: 1, title: L(['Chap 1 — Introduction et installation', 'Fasl 1 — Installation', 'Ch. 1 — Introduction and installation']) },
    { id: 'o-params', order: 4, title: L(['Chap 4 — Paramètres et fichiers de paramètres', 'Fasl 4 — Paramètres', 'Ch. 4 — Parameters and parameter files']) },
    { id: 'o-redo', order: 5, title: L(['Chap 5 — Fichiers de journalisation', 'Fasl 5 — Redo logs', 'Ch. 5 — Redo log files']) },
    { id: 'o-archive', order: 6, title: L(['Chap 6 — Archivelog', 'Fasl 6 — Archivelog', 'Ch. 6 — Archivelog']) },
    { id: 'o-control', order: 7, title: L(['Chap 7 — Fichiers de contrôle', 'Fasl 7 — Control files', 'Ch. 7 — Control files']) },
    { id: 'o-tbs', order: 8, title: L(['Chap 8 — Tablespaces', 'Fasl 8 — Tablespaces', 'Ch. 8 — Tablespaces']) }
  ],
  annales: [
    {
      id: 'cc-2025',
      title: L(['Contrôle continu Oracle 2025-2026', 'Contrôle Oracle 2025-2026', 'Oracle mid-term 2025-2026']),
      minutes: 60,
      intro: L(['20 questions, 1 point chacune, documents interdits. Réponses courtes : définition + exemple, et le message SQL*Plus pour les commandes.', '20 so2al, kol wa7ed 1 point. Jawab 9sir : ta3rif + mithal.', '20 questions, 1 point each. Short answers: definition + example.']),
      parts: [{ exerciseId: 'or-x-6', points: 7 }, { exerciseId: 'or-x-7', points: 7 }, { exerciseId: 'or-x-8', points: 6 }]
    }
  ],
  weights: { instance: 5, architecture: 4, tp1: 3, annale: 3 }
};

export const chapters = [c1, c2, c3, c4];
export const questions = [...qa, ...qi, ...annaleQuestions];
export const exercises = [...exs, ...annaleExercises];
export const flashcards = [...archFc, ...instFc, ...annaleFlashcards];
export const reference = [
  ref('r-or-1', 'SHOW PDBS · SHOW CON_NAME · SHOW SGA · SHOW PARAMETER x', ['Commandes SQL*Plus', 'SQL*Plus', 'SQL*Plus commands']),
  ref('r-or-2', 'ALTER SESSION SET CONTAINER=ORCLPDB;', ['Changer de conteneur', 'Beddel conteneur', 'Switch container']),
  ref('r-or-3', 'ALTER PLUGGABLE DATABASE ORCLPDB OPEN;', ['Ouvrir une PDB', 'Fte7 PDB', 'Open a PDB']),
  ref('r-or-4', 'CREATE USER C##X IDENTIFIED BY p; GRANT CREATE SESSION TO C##X;', ['Utilisateur commun', 'User commun', 'Common user']),
  ref('r-or-5', 'STARTUP [NOMOUNT|MOUNT|OPEN|FORCE|RESTRICT]', ['Démarrage', 'Démarrage', 'Startup']),
  ref('r-or-6', 'ALTER DATABASE MOUNT; · ALTER DATABASE OPEN;', ['Changer d\'état', 'Beddel état', 'Change state']),
  ref('r-or-7', 'SHUTDOWN [NORMAL|TRANSACTIONAL|IMMEDIATE|ABORT]', ['Arrêt', 'Arrêt', 'Shutdown']),
  ref('r-or-8', "ALTER SYSTEM KILL SESSION 'sid,serial#';", ['Tuer une session (ORA-00028)', 'Tue session', 'Kill a session']),
  ref('r-or-9', 'v$session · v$sgainfo · v$sgastat · v$instance · v$pdbs · dba_users', ['Vues utiles', 'Vues', 'Useful views'])
];
export const missions = [];
