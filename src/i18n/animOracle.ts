/** Texts of the Oracle animations (fr / dar / en), checked by i18n:check. */
const t = (fr: string, dar: string, en: string) => ({ fr, dar, en });

const g = {
  client: t('Côté client / connexion', 'Jiha dyal client / connexion', 'Client side / connection'),
  sga: t('Mémoire SGA (partagée)', 'Mémoire SGA (mchtaraka)', 'SGA memory (shared)'),
  proc: t('Processus d\'arrière-plan', 'Processus d\'arrière-plan', 'Background process'),
  file: t('Fichier de la base de données', 'Fichier dyal base de données', 'Database file')
};

export const ORA_ARCH = {
  title: t('Serveur Oracle = Instance + Base de données', 'Serveur Oracle = Instance + Base de données', 'Oracle server = Instance + Database'),
  instance: t('Instance (en RAM)', 'Instance (f RAM)', 'Instance (in RAM)'),
  database: t('Base de données (sur disque)', 'Base de données (f disque)', 'Database (on disk)'),
  hint: t('Clique sur un composant pour voir son rôle.', 'Cliqui 3la composant bach tchouf dor dyalo.', 'Click a component to see its role.'),
  parts: {
    userproc: { name: 'User process', group: g.client, role: t('**Processus utilisateur** : le programme du client (ex. SQL*Plus) qui se connecte à Oracle et envoie les requêtes.', '**Processus utilisateur** : programme dyal client (b7al SQL*Plus) li kayconnecta l Oracle w kaysift requêtes.', '**User process**: the client program (e.g. SQL*Plus) that connects to Oracle and sends queries.') },
    serverproc: { name: 'Server process', group: g.client, role: t('**Processus serveur** : fait l\'interaction avec le processus utilisateur, **analyse (parse) et exécute** les requêtes SQL et renvoie les résultats.', '**Processus serveur** : kayhder m3a processus utilisateur, **kay-parser w kay-exécuter** SQL w kayrje3 natija.', '**Server process**: talks to the user process, **parses and executes** SQL and returns results.') },
    pga: { name: 'PGA', group: g.client, role: t('**Program Global Area** : mémoire **privée, non partagée** de chaque processus serveur (pile + UGA en mode dédié).', '**PGA** : mémoire **khassa** dyal kol processus serveur (stack + UGA f mode dédié).', '**PGA**: **private, non-shared** memory of each server process (stack + UGA in dedicated mode).') },
    shared: { name: 'Shared Pool', group: g.sga, role: t('Met en cache le **code SQL et PL/SQL analysé**, les paramètres, le dictionnaire de données. Contient le **Library cache** (texte + plan d\'exécution des requêtes récentes, réutilisés même par d\'autres utilisateurs) et le **Data dictionary cache** (colonnes, privilèges…).', 'Kat-cachi **SQL m-analysé**, paramètres w dictionnaire. Fiha **Library cache** (texte + plan dyal requêtes) w **Data dictionary cache** (colonnes, privilèges).', 'Caches **parsed SQL and PL/SQL**, parameters and the data dictionary: **Library cache** (text + execution plans, reused by other users) and **Data dictionary cache**.') },
    buffer: { name: 'Database Buffer Cache', group: g.sga, role: t('Stocke des **copies des blocs de données** lus depuis les datafiles. **La lecture se fait toujours à partir du buffer** ; garde en mémoire les blocs les plus demandés pour réduire les I/O.', 'Kaykhzen **nousakh dyal blocs** mn datafiles. **9raya dima mn buffer** ; kaykhlli blocs li kaytstl9bou bzaf f mémoire.', 'Stores **copies of data blocks** read from datafiles. **Reads always go through the buffer**; keeps hot blocks to reduce I/O.') },
    redobuf: { name: 'Redo Log Buffer', group: g.sga, role: t('Tampon **réutilisable** qui note toutes les **modifications** (LMD, LDD, internes). Quand le serveur modifie un bloc dans le Buffer Cache, des **entrées de journalisation** sont écrites ici. Vidé par **LGWR**.', 'Tampon **kayt3awed** fih kol **tbdil** (LMD, LDD). Mli bloc kaytbeddel, **entrées redo** kaytktbou hna. **LGWR** kaykhwih.', '**Reusable** buffer recording every **change** (DML, DDL, internal). Flushed by **LGWR**.') },
    large: { name: 'Large Pool', group: g.sga, role: t('Zone **optionnelle** pour les grosses allocations : **UGA en serveur partagé**, processus d\'E/S, **sauvegarde / restauration**. Laisse la Shared Pool aux requêtes SQL partagées.', 'Zone **ikhtiyariya** : **UGA f serveur partagé**, E/S, **sauvegarde/restauration**.', '**Optional** area for large allocations: **shared-server UGA**, I/O processes, **backup / restore**.') },
    java: { name: 'Java Pool', group: g.sga, role: t('Mémoire pour le **code Java** et les données de session dans la **JVM**.', 'Mémoire dyal **Java** f **JVM**.', 'Memory for **Java code** and session data in the **JVM**.') },
    streams: { name: 'Streams Pool', group: g.sga, role: t('Mémoire des processus **Oracle Streams** (capture et application des modifications, partage de données entre bases).', 'Mémoire dyal **Oracle Streams** (partage data bin bases).', 'Memory for **Oracle Streams** (capturing and applying changes between databases).') },
    pmon: { name: 'PMON', group: g.proc, role: t('**Process Monitor** : détecte les processus terminés anormalement, **nettoie** (cache, ressources) et les libère ; avec CLMN / CLnn.', '**PMON** : kaykchef processus li tsalaw b ghalat w **kaynaddef** ressources dyalhom.', '**Process Monitor**: detects abnormally ended processes and **cleans up** their resources (with CLMN / CLnn).') },
    smon: { name: 'SMON', group: g.proc, role: t('**System Monitor** : **récupération de l\'instance au redémarrage** après une défaillance, libération des segments temporaires, récupération des transactions terminées ignorées.', '**SMON** : **kayrécupéri l instance** mli kat3awed tbda mn b3d crash, w kaynaddef segments temporaires.', '**System Monitor**: **instance recovery at restart** after a failure, frees temporary segments.') },
    dbw: { name: 'DBWn', group: g.proc, role: t('**Database Writer** : écrit les blocs **modifiés (dirty)** du Buffer Cache vers les **datafiles** — quand il n\'y a plus de buffers libres ou au **checkpoint**. **Pas au COMMIT.** Jusqu\'à 100 (DB_WRITER_PROCESSES).', '**DBWn** : kaykteb **blocs dirty** f **datafiles** — mli buffer 3amer wla f **checkpoint**. **Machi f COMMIT.**', '**Database Writer**: writes **dirty blocks** to **datafiles** when buffers run out or at **checkpoint**. **Not at COMMIT.**') },
    lgwr: { name: 'LGWR', group: g.proc, role: t('**Log Writer** : écrit le Redo Log Buffer dans les **redo log files** : **au COMMIT**, quand le buffer est **plein au tiers**, **avant que DBWn écrive**, et **toutes les 3 secondes**.', '**LGWR** : kaykteb redo buffer f **redo log files** : **f COMMIT**, mli **tolot** 3amer, **9bel DBWn**, w **kol 3 thawani**.', '**Log Writer**: writes the redo buffer to **redo log files**: **at COMMIT**, at **one third full**, **before DBWn writes**, and **every 3 seconds**.') },
    ckpt: { name: 'CKPT', group: g.proc, role: t('**Checkpoint** : met à jour le **fichier de contrôle** et l\'**en-tête des datafiles** (checkpoint, **SCN**) et demande à **DBWn d\'écrire** les blocs sur disque.', '**CKPT** : kaybeddel **control file** w **en-têtes dyal datafiles** (SCN) w kaygoul l **DBWn ykteb**.', '**Checkpoint**: updates the **control file** and **datafile headers** (SCN) and tells **DBWn to write**.') },
    arc: { name: 'ARCn', group: g.proc, role: t('**Archiver** (processus **facultatif**) : copie les redo log files pleins vers les **archives** (mode ARCHIVELOG, Chap 6).', '**ARCn** (**ikhtiyari**) : kaynsakh redo logs 3amrin l **archives**.', '**Archiver** (**optional**): copies full redo logs to **archives** (ARCHIVELOG mode).') },
    datafiles: { name: 'Data files', group: g.file, role: t('Contiennent les **données** (tables, index…). Lus dans le Buffer Cache, écrits par DBWn.', 'Fihom **data** (tables, index…).', 'Hold the **data** (tables, indexes…).') },
    control: { name: 'Control files', group: g.file, role: t('Décrivent la **structure physique** de la base (noms et emplacements des fichiers, SCN). **Lus à l\'étape MOUNT**.', 'Kayweṣfou **structure physique** dyal base. **Kayt9raw f MOUNT**.', 'Describe the **physical structure** of the database. **Read at MOUNT**.') },
    redofiles: { name: 'Redo log files', group: g.file, role: t('Journal de toutes les modifications, écrit par **LGWR** ; sert à **reconstruire** les données après une panne.', 'Journal dyal kol tbdil, kaykteb **LGWR** ; bach **n3awdou nbniw** data mn b3d panne.', 'Log of every change, written by **LGWR**; used to **rebuild** data after a crash.') }
  }
};

export const ORA_START = {
  title: t('Les modes de démarrage de l\'instance', 'Modes dyal démarrage dyal instance', 'Instance startup modes'),
  steps: [
    { state: 'SHUTDOWN', cmd: 'SHUTDOWN IMMEDIATE', output: 'Database closed. Database dismounted. ORACLE instance shut down.', text: t('Rien ne tourne : **pas de SGA, pas de processus**. La base est fermée.', 'Walou khddam : **bla SGA, bla processus**.', 'Nothing runs: **no SGA, no processes**.') },
    { state: 'NOMOUNT', cmd: 'STARTUP NOMOUNT', output: 'ORACLE instance started. Total System Global Area … Fixed Size … Variable Size … Database Buffers … Redo Buffers', text: t('Oracle lit le **fichier de paramètres** (spfile/pfile), **crée la SGA** et **démarre les processus d\'arrière-plan**. L\'instance n\'est **pas encore associée** à une base. Utilisé pour **créer une base** ou **recréer les fichiers de contrôle**.', 'Oracle kay9ra **fichier de paramètres**, **kaysayb SGA** w **kaybda processus**. Instance **mazal ma mrbouta** b base. Kaynfa3 bach **tsayb base** wla **control files**.', 'Oracle reads the **parameter file**, **creates the SGA** and **starts the background processes**. Not yet associated with a database. Used to **create a database** or **re-create control files**.') },
    { state: 'MOUNT', cmd: 'ALTER DATABASE MOUNT;', output: 'Database altered.  (STARTUP MOUNT → Database mounted.)', text: t('Oracle lit les **fichiers de contrôle** : l\'instance est **associée** à la base, mais la base est **fermée** aux utilisateurs (maintenance, passage en ARCHIVELOG, restauration).', 'Oracle kay9ra **control files** : instance **mrbouta** b base, walakin base **msdouda** 3la users (maintenance, ARCHIVELOG).', 'Oracle reads the **control files**: the instance is **associated** with the database, still **closed** to users (maintenance, ARCHIVELOG, recovery).') },
    { state: 'OPEN', cmd: 'ALTER DATABASE OPEN;', output: 'Database altered.  (STARTUP → Database opened.)', text: t('Oracle ouvre les **datafiles** et les **redo log files** en ligne : les utilisateurs autorisés peuvent travailler. Variantes : `OPEN READ ONLY`, `STARTUP RESTRICT` (privilégiés seulement), `STARTUP FORCE` (= SHUTDOWN ABORT + STARTUP).', 'Oracle kayfte7 **datafiles** w **redo logs** : users y9dro ykhdmou. `READ ONLY`, `RESTRICT`, `FORCE` (= ABORT + STARTUP).', 'Oracle opens the **datafiles** and **online redo logs**: authorised users can work. Variants: `READ ONLY`, `RESTRICT`, `FORCE` (= ABORT + STARTUP).') }
  ]
};

/** Full instance diagram (exam drawing) + data-flow scenarios. */
export const ORA_DIAG = {
  title: t('Schéma de l\'instance Oracle (à savoir dessiner)', 'Schéma dyal instance Oracle (khassek t3ref trsmo)', 'Oracle instance diagram (know how to draw it)'),
  modes: { flow: t('Voir les flux', 'Chouf l flux', 'See the flows'), test: t('Teste-toi', 'Testi rasek', 'Test yourself') },
  scen: { update: t('UPDATE + COMMIT', 'UPDATE + COMMIT', 'UPDATE + COMMIT'), select: t('SELECT', 'SELECT', 'SELECT'), ckpt: t('Checkpoint', 'Checkpoint', 'Checkpoint'), startup: t('Démarrage', 'Démarrage', 'Startup') },
  labels: { instance: t('INSTANCE', 'INSTANCE', 'INSTANCE'), sga: t('SGA', 'SGA', 'SGA'), db: t('BASE DE DONNÉES', 'BASE DE DONNÉES', 'DATABASE'), bg: t('Processus d\'arrière-plan', 'Processus d\'arrière-plan', 'Background processes'), other: t('Fichiers associés', 'Fichiers associés', 'Related files') },
  testHint: t('Choisis le bon nom pour chaque case, comme sur la copie du contrôle.', 'Khtar smiya s7i7a l kol khana, b7al f contrôle.', 'Pick the right name for each box, as on the test paper.'),
  score: t('Bonnes réponses', 'Jawabat s7a7', 'Correct'),
  reveal: t('Afficher la correction', 'Wrri correction', 'Show the answers'),
  reset: t('Recommencer', '3awed', 'Start over'),
  flows: {
    update: [
      { edges: [['user', 'server']], text: t('Le **processus utilisateur** envoie l\'UPDATE au **processus serveur** (qui a sa **PGA**).', '**Processus utilisateur** kaysift UPDATE l **processus serveur** (b **PGA** dyalo).', 'The **user process** sends the UPDATE to the **server process** (with its **PGA**).') },
      { edges: [['server', 'shared']], text: t('**Parse** dans la **Shared Pool** : syntaxe et privilèges via le **dictionary cache**, plan via le **library cache**.', '**Parse** f **Shared Pool** : dictionary cache + library cache.', '**Parse** in the **Shared Pool**: dictionary cache + library cache.') },
      { edges: [['datafiles', 'buffer'], ['server', 'buffer']], text: t('Le bloc est lu dans le **Database Buffer Cache** (depuis le **datafile** s\'il n\'y est pas encore) puis **modifié en mémoire** → bloc **dirty**. L\'ancienne valeur part en **undo**.', 'Bloc kayt9ra f **Buffer Cache** (mn **datafile** ila ma kanch) w kaytbeddel → **dirty**. Qima l9dima → **undo**.', 'The block is read into the **Buffer Cache** (from the **datafile** if needed) and **changed in memory** → **dirty**. Old value → **undo**.') },
      { edges: [['server', 'redobuf']], text: t('Une **entrée de journalisation** est écrite dans le **Redo Log Buffer**.', '**Entrée redo** f **Redo Log Buffer**.', 'A **redo entry** is written to the **Redo Log Buffer**.') },
      { edges: [['redobuf', 'lgwr'], ['lgwr', 'redofiles']], text: t('**COMMIT** : **LGWR** vide le Redo Log Buffer dans les **redo log files** → « Commit complete ». Les données ne sont pas encore dans les datafiles !', '**COMMIT** : **LGWR** kaykteb f **redo log files** → « Commit complete ». Data mazal ma f datafiles !', '**COMMIT**: **LGWR** writes to the **redo log files** → "Commit complete". Data is not in the datafiles yet!') },
      { edges: [['buffer', 'dbw'], ['dbw', 'datafiles']], text: t('**Plus tard** (checkpoint ou manque de buffers libres) : **DBWn** écrit le bloc dirty dans le **datafile**.', '**Mn b3d** : **DBWn** kaykteb bloc dirty f **datafile**.', '**Later**: **DBWn** writes the dirty block to the **datafile**.') }
    ],
    select: [
      { edges: [['user', 'server']], text: t('Le client envoie le SELECT au processus serveur.', 'Client kaysift SELECT.', 'The client sends the SELECT.') },
      { edges: [['server', 'shared']], text: t('**Parse** dans la Shared Pool (réutilise le plan si la requête est déjà dans le library cache).', '**Parse** f Shared Pool.', '**Parse** in the Shared Pool.') },
      { edges: [['datafiles', 'buffer'], ['buffer', 'server']], text: t('Lecture des blocs **via le Buffer Cache** (chargés depuis les datafiles si besoin).', '9raya **mn Buffer Cache**.', 'Blocks read **through the Buffer Cache**.') },
      { edges: [['server', 'user']], text: t('Les lignes sont **renvoyées** au client. **Pas d\'undo, pas de redo, pas de LGWR, pas de DBWn.**', 'Natija katrje3 l client. **Bla undo, redo, LGWR, DBWn.**', 'Rows are **returned**. **No undo, redo, LGWR or DBWn.**') }
    ],
    ckpt: [
      { edges: [['ckpt', 'control'], ['ckpt', 'datafiles']], text: t('**CKPT** écrit le **SCN** du checkpoint dans le **fichier de contrôle** et l\'**en-tête des datafiles**…', '**CKPT** kaykteb **SCN** f **control file** w **en-têtes**…', '**CKPT** writes the checkpoint **SCN** to the **control file** and **datafile headers**…') },
      { edges: [['ckpt', 'dbw'], ['dbw', 'datafiles']], text: t('…et **signale à DBWn** d\'écrire les blocs dirty sur disque.', '…w kaygoul l **DBWn** ykteb blocs dirty.', '…and **signals DBWn** to write dirty blocks.') },
      { edges: [['redofiles', 'arc'], ['arc', 'archives']], text: t('En mode ARCHIVELOG, **ARCn** copie les redo log files pleins vers les **archives**.', 'F ARCHIVELOG, **ARCn** kaynsakh redo logs l **archives**.', 'In ARCHIVELOG mode, **ARCn** copies full redo logs to **archives**.') }
    ],
    startup: [
      { edges: [['pfile', 'sga']], text: t('**NOMOUNT** : lecture du **fichier de paramètres**, allocation de la **SGA**, démarrage des **processus**.', '**NOMOUNT** : **fichier de paramètres** → **SGA** + **processus**.', '**NOMOUNT**: **parameter file** → **SGA** + **processes**.') },
      { edges: [['control', 'sga']], text: t('**MOUNT** : lecture des **fichiers de contrôle**.', '**MOUNT** : **control files**.', '**MOUNT**: **control files** read.') },
      { edges: [['datafiles', 'sga'], ['redofiles', 'sga']], text: t('**OPEN** : ouverture des **datafiles** et des **redo log files**.', '**OPEN** : **datafiles** w **redo log files**.', '**OPEN**: **datafiles** and **redo log files** opened.') },
      { edges: [['smon', 'sga']], text: t('Après un **SHUTDOWN ABORT**, c\'est **SMON** qui fait la **restauration de l\'instance** à l\'ouverture.', 'Mn b3d **ABORT**, **SMON** kaydir **récupération**.', 'After **SHUTDOWN ABORT**, **SMON** performs **instance recovery**.') }
    ]
  }
};

/** Texts of the RO graph-algorithm animation. */
export const RO_ANIM = {
  titles: {
    kruskal: t('Algorithme de Kruskal pas à pas', 'Kruskal étape par étape', 'Kruskal step by step'),
    prim: t('Algorithme de Prim pas à pas', 'Prim étape par étape', 'Prim step by step'),
    dijkstra: t('Algorithme de Dijkstra pas à pas', 'Dijkstra étape par étape', 'Dijkstra step by step'),
    degrees: t('Le graphe et ses degrés', 'Graphe w degrés dyalo', 'The graph and its degrees')
  },
  weight: t('Poids', 'Wazn', 'Weight'),
  edge: t('Arête', 'Arête', 'Edge'),
  cycle: t('crée un cycle', 'kaydir cycle', 'creates a cycle'),
  add: t('On ajoute', 'Kanzidou', 'Add'),
  start: t('sommet de départ', 'sommet dyal bdya', 'start vertex'),
  init: t('Initialisation : 0 pour le départ, ∞ pour les autres', 'Bdya : 0 l départ, ∞ l lokhrin', 'Initialisation: 0 for the start, ∞ elsewhere'),
  fix: t('On fixe', 'Kanfixiw', 'Fix'),
  fixedCol: t('Fixé', 'Fixé', 'Fixed'),
  path: t('Plus court chemin', 'A9sar tri9', 'Shortest path'),
  end: t('Résultat final', 'Natija', 'Final result'),
  degreeHint: t('Le nombre au-dessus de chaque sommet est son **degré** (nombre d\'arêtes qui le touchent). La somme des degrés = **2 × nombre d\'arêtes**.', 'Raqm fou9 kol sommet howa **degré** dyalo. Majmou3 degrés = **2 × 3adad arêtes**.', 'The number above each vertex is its **degree**. Sum of degrees = **2 × number of edges**.')
};

export const RO_GAME = {
  title: t('Graph Arena — joue l\'algorithme', 'Graph Arena — l3eb l\'algorithme', 'Graph Arena — play the algorithm'),
  modes: {
    kruskal: t('Kruskal', 'Kruskal', 'Kruskal'),
    prim: t('Prim', 'Prim', 'Prim'),
    dijkstra: t('Dijkstra', 'Dijkstra', 'Dijkstra')
  },
  goal: {
    kruskal: t('Clique les arêtes dans l\'ordre de **Kruskal** : la plus petite qui ne crée **pas de cycle**.', 'Cliqui 3la arêtes b tartib **Kruskal** : sghira li ma katdirch **cycle**.', 'Click edges in **Kruskal** order: the smallest one that does **not** close a cycle.'),
    prim: t('Fais grandir l\'arbre depuis **A** (**Prim**) : clique l\'arête minimale qui sort de l\'arbre.', 'Kbbr l\'arbre mn **A** (**Prim**) : cliqui arête sghira li kharja mn l\'arbre.', 'Grow the tree from **A** (**Prim**): click the cheapest edge leaving the tree.'),
    dijkstra: t('**Dijkstra** depuis **A** : clique le sommet non fixé de **plus petite distance** ; les voisins se mettent à jour.', '**Dijkstra** mn **A** : cliqui sommet machi fixé li 3ndo **a9al distance**.', '**Dijkstra** from **A**: click the unfixed vertex with the **smallest distance**; neighbours update.')
  },
  level: t('Niveau', 'Niveau', 'Level'),
  score: t('Score', 'Score', 'Score'),
  best: t('Record', 'Record', 'Best'),
  combo: t('Combo', 'Combo', 'Combo'),
  weight: t('Poids de l\'arbre', 'Wazn dyal l\'arbre', 'Tree weight'),
  errCycle: t('Cycle ! Cette arête relie deux sommets déjà connectés.', 'Cycle ! Had l\'arête katrbet jouj sommets deja mrbouttin.', 'Cycle! This edge joins two already-connected vertices.'),
  errMin: t('Pas la plus petite : il existe une arête valide de poids', 'Machi sghira : kayna arête valide b wazn', 'Not the smallest: there is a valid edge of weight'),
  errOut: t('Prim : l\'arête doit toucher l\'arbre (un bout dedans, un bout dehors).', 'Prim : arête khassha tmess l\'arbre (tarf dakhel, tarf barra).', 'Prim: the edge must leave the tree (one end inside, one outside).'),
  errFixed: t('Ce sommet est déjà fixé.', 'Had sommet deja fixé.', 'This vertex is already fixed.'),
  errDist: t('Pas le minimum : un sommet non fixé a une distance de', 'Machi a9al : kayn sommet b distance', 'Not the minimum: an unfixed vertex has distance'),
  levelDone: t('Niveau réussi !', 'Niveau tsala !', 'Level cleared!'),
  next: t('Niveau suivant', 'Niveau jay', 'Next level'),
  over: t('Game over', 'Game over', 'Game over'),
  retry: t('Rejouer', '3awed', 'Play again'),
  newRecord: t('Nouveau record !', 'Record jdid !', 'New record!'),
  timeBonus: t('Bonus temps', 'Bonus wa9t', 'Time bonus'),
  hint: t('Indice', 'Indice', 'Hint')
};

export const CDB_VIS = {
  title: t('CDB / PDB : où est ta session ?', 'CDB / PDB : fin kayna session dyalek ?', 'CDB / PDB: where is your session?'),
  hint: t('Clique une commande : le rond **SYS** montre le conteneur courant de la session, et la console affiche la réponse de SQL*Plus.', 'Cliqui 3la commande : rond **SYS** kayban fin kayna session, w console katwerrik jawab SQL*Plus.', 'Click a command: the **SYS** dot shows the session\'s current container and the console shows SQL*Plus\'s answer.'),
  root: t('Dictionnaire, utilisateurs **communs** (C##…)', 'Dictionnaire, users **communs** (C##…)', 'Dictionary, **common** users (C##…)'),
  seed: t('Modèle **READ ONLY** pour créer des PDB', 'Modèle **READ ONLY** bach tsayb PDB', '**READ ONLY** template for new PDBs'),
  pdb: t('Schéma **HR**, utilisateurs **locaux**', 'Schéma **HR**, users **locaux**', '**HR** schema, **local** users'),
  newPdb: t('Nouvelle PDB, clonée depuis le seed', 'PDB jdida, mnsoukha mn seed', 'New PDB, cloned from the seed'),
  shared: t('Une seule instance pour tous les conteneurs : SGA + processus (PMON, SMON, DBWn, LGWR, CKPT)', 'Instance wa7da l ga3 conteneurs : SGA + processus', 'One instance for every container: SGA + processes'),
  sharedShort: t('une seule instance, partagée par tous les conteneurs', 'instance wa7da, mchtaraka bin ga3 conteneurs', 'one instance, shared by every container'),
  files: t('Chaque conteneur a ses datafiles ; control files et redo logs sont communs à la CDB', 'Kol conteneur 3ndo datafiles ; control files w redo mchtarkin', 'Each container has its datafiles; control files and redo logs belong to the CDB'),
  reset: t('Recommencer', '3awed', 'Reset'),
  console: t('Console SQL*Plus', 'Console SQL*Plus', 'SQL*Plus console')
};
