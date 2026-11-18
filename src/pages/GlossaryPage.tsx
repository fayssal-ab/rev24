import { useMemo, useState } from 'react';
import { PageTitle } from '../components/Layout';
import { useT } from '../hooks/useT';

type M = 'data' | 'ro' | 'oracle' | 'linux';
/** [terme, module, fr, dar, en] */
type Term = [string, M, string, string, string];

const TERMS: Term[] = [
  // ── Analyse de données
  ['ACP (Analyse en Composantes Principales)', 'data', "Méthode qui résume beaucoup de variables numériques en quelques nouvelles variables (les composantes) qui gardent le maximum d'information (de variance). Sert à visualiser des données à beaucoup de dimensions sur un plan 2D.", "Tari9a katjma3 bzaf d les variables numériques f chi 2 wla 3 variables jdad (composantes) li kay7tafdo b ktar ma3loumat (variance). Kat3awnek tchouf data kbira f graphique 2D.", 'Method that compresses many numeric variables into a few new ones (components) keeping most of the variance. Used to plot high-dimensional data in 2D.'],
  ['AFC (Analyse Factorielle des Correspondances)', 'data', "Comme l'ACP mais pour deux variables qualitatives (un tableau de contingence). Montre quelles modalités vont ensemble.", "B7al ACP walakin l 2 variables qualitatives (tableau de contingence). Katwerrik ach mn modalités kaymchiw m3a ba3dhoum.", 'Like PCA but for two categorical variables (contingency table). Shows which categories go together.'],
  ['ACM (Analyse des Correspondances Multiples)', 'data', "Extension de l'AFC à plus de deux variables qualitatives (ex : questionnaire).", "AFC walakin l ktar mn 2 variables qualitatives (b7al questionnaire).", 'Extension of CA to more than two categorical variables (e.g. surveys).'],
  ['Clustering (classification)', 'data', "Regrouper automatiquement des individus qui se ressemblent en groupes (clusters), sans étiquettes connues. Ex : k-means, CAH.", "Tjma3 les individus li kaychbho l ba3dhoum f groupes (clusters) bla ma t3ref les groupes mn 9bel. Ex : k-means, CAH.", 'Automatically group similar individuals into clusters without known labels. E.g. k-means, hierarchical clustering.'],
  ['Variable quantitative / qualitative', 'data', "Quantitative = un nombre (âge, salaire). Qualitative = une catégorie (sexe, ville). On ne calcule pas de moyenne sur une qualitative.", "Quantitative = ra9m (3mer, salaire). Qualitative = catégorie (sexe, mdina). Ma kan7esbouch moyenne 3la qualitative.", 'Quantitative = a number (age, salary). Qualitative = a category (sex, city). No mean on a qualitative variable.'],
  ['Moyenne, médiane, mode', 'data', "Moyenne = somme / effectif. Médiane = valeur du milieu (moitié en dessous, moitié au-dessus), résiste aux valeurs extrêmes. Mode = valeur la plus fréquente.", "Moyenne = majmou3 / 3adad. Médiane = l9ima li f lwast (nos ta7tha w nos fou9ha), ma katta2ttarch b les valeurs extrêmes. Mode = l9ima li ktar tkrar.", 'Mean = sum / count. Median = middle value, robust to outliers. Mode = most frequent value.'],
  ['Variance / écart-type', 'data', "Mesurent la dispersion autour de la moyenne. Écart-type = racine de la variance, dans la même unité que les données.", "Kay9isso chhal data mferr9a 3la moyenne. Écart-type = jadr dyal variance, b nafs l unité dyal data.", 'Measure spread around the mean. Std dev = square root of variance, same unit as the data.'],
  ['Corrélation (r de Pearson)', 'data', "Nombre entre -1 et 1 qui mesure le lien linéaire entre deux variables. Proche de 1 : montent ensemble ; proche de -1 : l'une monte, l'autre baisse ; 0 : pas de lien linéaire. Corrélation ≠ causalité.", "Ra9m bin -1 w 1 kay9is l3ala9a linéaire bin 2 variables. 9rib l 1 : kaytl3o m3a ba3d ; 9rib l -1 : wa7d kaytla3 w lakhor kaynzel ; 0 : makaynach 3ala9a. Corrélation ≠ sabab.", 'Number between -1 and 1 measuring linear association. Near 1: rise together; near -1: opposite; 0: no linear link. Correlation ≠ causation.'],
  ['Hypothèse nulle H0 / alternative H1', 'data', "H0 = « il n'y a pas d'effet / pas de différence ». H1 = ce qu'on veut montrer. Un test décide si les données permettent de rejeter H0.", "H0 = « makayn walou, ta far9 ». H1 = dakchi li bghina nbyno. Test kayguolik wach data kat3tik l7e9 trfod H0.", 'H0 = "no effect / no difference". H1 = what we want to show. A test decides whether data lets us reject H0.'],
  ['p-value', 'data', "Probabilité d'observer un résultat au moins aussi extrême si H0 est vraie. Si p < α (souvent 0,05) on rejette H0.", "Ihtimal nchoufo résultat b7al hada wla ktar ila kanet H0 s7i7a. Ila p < α (ghaliban 0,05) kanrfdo H0.", 'Probability of a result at least this extreme if H0 is true. If p < α (often 0.05), reject H0.'],
  ['Seuil α / erreur de 1ère espèce', 'data', "α = risque accepté de rejeter H0 alors qu'elle est vraie (faux positif). Erreur de 2e espèce β = garder H0 alors qu'elle est fausse.", "α = risque li 9bilna nrfdo H0 w hiya s7i7a (faux positif). Erreur 2 (β) = nkhelliw H0 w hiya ghalta.", 'α = accepted risk of rejecting a true H0 (false positive). Type II error β = keeping a false H0.'],
  ['Test Z / test t de Student', 'data', "Comparent une moyenne à une valeur (ou deux moyennes). Z si σ connu ou grand échantillon ; t si σ inconnu et petit échantillon.", "Kay9arno moyenne m3a valeur (wla 2 moyennes). Z ila σ ma3rouf wla échantillon kbir ; t ila σ ma ma3roufch w échantillon sghir.", 'Compare a mean to a value (or two means). Z if σ known / large sample; t if σ unknown, small sample.'],
  ['Test du Khi-deux (χ²)', 'data', "Teste l'indépendance de deux variables qualitatives en comparant effectifs observés et effectifs théoriques.", "Kaytesti wach 2 variables qualitatives mosta9illin, b mo9arana bin l effectifs li chefna w li kan tsennaw.", 'Tests independence of two categorical variables by comparing observed vs expected counts.'],
  ['Intervalle de confiance', 'data', "Fourchette de valeurs qui contient le vrai paramètre avec un niveau de confiance donné (ex : 95 %).", "Majal dyal 9iyam fih l9ima l7a9i9iya b niveau de confiance (ex : 95 %).", 'Range that contains the true parameter with a given confidence level (e.g. 95%).'],
  ['DataFrame (pandas)', 'data', "Tableau à deux dimensions de pandas : lignes = individus, colonnes = variables. Ex : df.head(), df.describe(), df.groupby().", "Tableau dyal pandas : stour = individus, colonnes = variables. Ex : df.head(), df.describe(), df.groupby().", 'pandas 2-D table: rows = observations, columns = variables. E.g. df.head(), df.describe(), df.groupby().'],
  ['Boxplot (boîte à moustaches)', 'data', "Graphique qui montre médiane, quartiles (Q1, Q3) et valeurs aberrantes d'une variable.", "Graphique kaywerri médiane, quartiles (Q1, Q3) w les valeurs aberrantes.", 'Chart showing median, quartiles (Q1, Q3) and outliers.'],

  // ── Recherche opérationnelle
  ['Graphe (sommet, arête, arc)', 'ro', "Ensemble de sommets reliés par des arêtes (non orienté) ou des arcs (orienté, avec une flèche).", "Majmou3a d sommets mrbtin b arêtes (bla ittijah) wla arcs (b flèche, orienté).", 'Set of vertices joined by edges (undirected) or arcs (directed).'],
  ['Degré d\'un sommet', 'ro', "Nombre d'arêtes qui touchent le sommet. Somme des degrés = 2 × nombre d'arêtes.", "3adad l arêtes li mrbtin b sommet. Majmou3 les degrés = 2 × 3adad l arêtes.", 'Number of edges touching a vertex. Sum of degrees = 2 × number of edges.'],
  ['Graphe connexe', 'ro', "On peut aller de n'importe quel sommet à n'importe quel autre par un chemin.", "T9der tmchi mn ay sommet l ay sommet akhor b chemin.", 'Every vertex can reach every other vertex.'],
  ['Graphe complet Kn', 'ro', "Chaque sommet est relié à tous les autres. Kn a n(n-1)/2 arêtes.", "Kol sommet mrbot m3a ga3 lakhrin. Kn fih n(n-1)/2 arêtes.", 'Every vertex joined to every other. Kn has n(n-1)/2 edges.'],
  ['Matrice d\'adjacence', 'ro', "Tableau M où M[i][j] = nombre d'arêtes entre i et j. M^k[i][j] = nombre de chemins de longueur k de i à j.", "Tableau M fin M[i][j] = 3adad l arêtes bin i w j. M^k[i][j] = 3adad les chemins b toul k mn i l j.", 'Matrix M with M[i][j] = edges between i and j. M^k[i][j] = number of walks of length k.'],
  ['Chaîne / cycle eulérien', 'ro', "Passe par toutes les arêtes une seule fois. Cycle si 0 sommet de degré impair, chaîne si exactement 2 (on part de l'un, on finit à l'autre).", "Katdouz 3la ga3 l arêtes merra wa7da. Cycle ila 0 sommet impair, chaîne ila 2 bdbt (tbda mn wa7d w tsali f lakhor).", 'Uses every edge exactly once. Circuit if 0 odd vertices, trail if exactly 2.'],
  ['Cycle hamiltonien', 'ro', "Passe par tous les sommets une seule fois et revient au départ. Pas de critère simple (contrairement à Euler).", "Kaydouz 3la ga3 les sommets merra wa7da w yrje3 l bdaya. Makaynach 9a3ida sahla b7al Euler.", 'Visits every vertex once and returns. No simple criterion (unlike Euler).'],
  ['Graphe biparti', 'ro', "Sommets séparables en 2 groupes, aucune arête à l'intérieur d'un groupe. Équivaut à : pas de cycle de longueur impaire.", "Les sommets t9der t9semhom 2 groupes, ta arête dakhel nafs groupe. Ya3ni : makaynch cycle impair.", 'Vertices split in 2 groups with no edge inside a group ⇔ no odd cycle.'],
  ['Coloration / nombre chromatique χ(G)', 'ro', "Colorer les sommets pour que deux voisins n'aient jamais la même couleur. χ(G) = nombre minimum de couleurs. Welsh-Powell donne une coloration rapide.", "Tlouwen les sommets bach 2 jiran ma ykounch 3andhom nafs llon. χ(G) = a9al 3adad d lalwan. Welsh-Powell kat3tik coloration b sor3a.", 'Colour vertices so neighbours differ. χ(G) = minimum colours. Welsh-Powell gives a quick colouring.'],
  ['Arbre / arbre couvrant', 'ro', "Arbre = graphe connexe sans cycle (n sommets, n-1 arêtes). Arbre couvrant = arbre qui touche tous les sommets du graphe.", "Arbre = graphe connexe bla cycle (n sommets, n-1 arêtes). Arbre couvrant = arbre li kaywsel l ga3 les sommets.", 'Tree = connected, acyclic (n vertices, n-1 edges). Spanning tree = tree reaching all vertices.'],
  ['Kruskal', 'ro', "Arbre couvrant de poids minimum : trier les arêtes par poids croissant, prendre chaque arête si elle ne crée pas de cycle.", "Arbre couvrant b a9al poids : rtteb l arêtes mn sghir l kbir, khod kol arête ila ma dartch cycle.", 'Minimum spanning tree: sort edges ascending, take each one unless it creates a cycle.'],
  ['Prim', 'ro', "Arbre couvrant minimum en partant d'un sommet : à chaque étape on ajoute l'arête la moins chère qui relie l'arbre à un nouveau sommet.", "Arbre couvrant minimum mn sommet : f kol étape zid l arête lrkhessa li katrbet l arbre b sommet jdid.", 'MST from a start vertex: repeatedly add the cheapest edge reaching a new vertex.'],
  ['Dijkstra', 'ro', "Plus court chemin depuis un sommet (poids positifs) : on fixe à chaque étape le sommet non visité de plus petite distance, puis on met à jour ses voisins.", "A9sar chemin mn sommet (poids positifs) : f kol étape kanthbto sommet li 3ando a9al distance, w kan update jiranou.", 'Shortest paths from a source (non-negative weights): fix the closest unvisited vertex, relax its neighbours.'],

  // ── Oracle
  ['SGBD / instance / base', 'oracle', "SGBD = logiciel qui gère les données (Oracle). Instance = mémoire (SGA) + processus en RAM. Base = fichiers sur disque. L'instance ouvre la base.", "SGBD = logiciel li kaysayer data (Oracle). Instance = mémoire (SGA) + processus f RAM. Base = fichiers f disque. Instance hiya li kat7el base.", 'DBMS = data software (Oracle). Instance = memory (SGA) + processes. Database = files on disk, opened by the instance.'],
  ['CDB / PDB', 'oracle', "CDB (Container Database) = la base « conteneur » qui contient CDB$ROOT, PDB$SEED et des PDB. PDB (Pluggable Database) = base « enfichable » vue par l'application comme une base indépendante.", "CDB = base « conteneur » fiha CDB$ROOT, PDB$SEED w les PDB. PDB = base « enfichable » li l'application katchoufha b7al base mosta9illa.", 'CDB = container holding CDB$ROOT, PDB$SEED and PDBs. PDB = pluggable database, seen by apps as standalone.'],
  ['SGA (System Global Area)', 'oracle', "Mémoire partagée de l'instance : buffer cache (blocs de données), shared pool (SQL et dictionnaire), redo log buffer, large/java pool.", "Mémoire partagée dyal instance : buffer cache (blocs data), shared pool (SQL w dictionnaire), redo log buffer, large/java pool.", 'Shared instance memory: buffer cache, shared pool, redo log buffer, large/java pools.'],
  ['PGA (Program Global Area)', 'oracle', "Mémoire privée d'un processus serveur (tri, hash, variables de session). Non partagée.", "Mémoire khassa b kol processus serveur (tri, hash, session). Machi partagée.", 'Private memory of a server process (sorts, hashes, session data). Not shared.'],
  ['DBWn, LGWR, CKPT, SMON, PMON', 'oracle', "Processus d'arrière-plan : DBWn écrit les blocs modifiés sur disque ; LGWR écrit le redo ; CKPT signale les checkpoints ; SMON récupère l'instance après crash ; PMON nettoie les sessions mortes.", "Processus f l'arrière : DBWn kaykteb blocs f disque ; LGWR kaykteb redo ; CKPT checkpoint ; SMON kaysle7 instance mor crash ; PMON kaynaddef sessions mytin.", 'Background processes: DBWn writes dirty blocks; LGWR writes redo; CKPT checkpoints; SMON instance recovery; PMON cleans dead sessions.'],
  ['Redo log', 'oracle', "Fichiers qui enregistrent toutes les modifications, pour pouvoir rejouer les transactions après une panne.", "Fichiers kaysjlo ga3 les modifications bach n3awdo transactions mor panne.", 'Files recording all changes so transactions can be replayed after a failure.'],
  ['Control file', 'oracle', "Petit fichier binaire vital : nom de la base, emplacement des datafiles et redo logs, SCN. Lu à l'étape MOUNT.", "Fichier sghir walakin darouri : smiya dyal base, blasa dyal datafiles w redo logs, SCN. Kayt9ra f MOUNT.", 'Small vital binary file: DB name, datafile/redo locations, SCN. Read at MOUNT.'],
  ['Tablespace / datafile', 'oracle', "Tablespace = conteneur logique (SYSTEM, SYSAUX, USERS…). Datafile = fichier physique qui le stocke.", "Tablespace = conteneur logique (SYSTEM, SYSAUX, USERS…). Datafile = fichier physique li fih.", 'Tablespace = logical container (SYSTEM, USERS…). Datafile = its physical file.'],
  ['STARTUP : NOMOUNT → MOUNT → OPEN', 'oracle', "NOMOUNT : lit le fichier de paramètres (spfile), crée SGA + processus. MOUNT : lit le control file. OPEN : ouvre datafiles et redo logs.", "NOMOUNT : kay9ra spfile w kaykhle9 SGA + processus. MOUNT : kay9ra control file. OPEN : kay7el datafiles w redo logs.", 'NOMOUNT reads spfile, starts SGA + processes. MOUNT reads control file. OPEN opens datafiles and redo.'],
  ['SHUTDOWN NORMAL / IMMEDIATE / TRANSACTIONAL / ABORT', 'oracle', "NORMAL attend que tout le monde se déconnecte ; TRANSACTIONAL attend la fin des transactions ; IMMEDIATE annule les transactions et ferme proprement ; ABORT coupe tout (récupération au prochain démarrage).", "NORMAL kaytsenna ga3 ykhorjo ; TRANSACTIONAL kaytsenna transactions tsalo ; IMMEDIATE kaylghi transactions w ysedd mzyan ; ABORT kay9te3 kolchi (récupération f startup jay).", 'NORMAL waits for logouts; TRANSACTIONAL for transactions; IMMEDIATE rolls back and closes cleanly; ABORT kills (recovery next start).'],
  ['SCN (System Change Number)', 'oracle', "Compteur qui augmente à chaque commit : « horloge » interne d'Oracle pour la cohérence et la récupération.", "Compteur kayzid f kol commit : « sa3a » dakhliya dyal Oracle l cohérence w récupération.", 'Counter increased at each commit: Oracle\'s internal clock for consistency and recovery.'],

  // ── Linux
  ['UID / GID', 'linux', "Numéro d'utilisateur / de groupe. root = 0. Les comptes humains commencent à 1000 sur RHEL 9.", "Ra9m dyal user / groupe. root = 0. Les comptes dyal nas kaybdaw mn 1000 f RHEL 9.", 'User / group number. root = 0. Human accounts start at 1000 on RHEL 9.'],
  ['/etc/passwd, /etc/shadow, /etc/group', 'linux', "passwd = liste des comptes ; shadow = mots de passe hachés + expiration ; group = groupes et membres.", "passwd = lista dyal comptes ; shadow = mots de passe hachés + expiration ; group = groupes w members.", 'passwd = accounts; shadow = hashed passwords + aging; group = groups and members.'],
  ['Droits rwx / chmod 755', 'linux', "r=4 lecture, w=2 écriture, x=1 exécution, pour propriétaire / groupe / autres. 755 = rwxr-xr-x.", "r=4 9raya, w=2 ktaba, x=1 exécution, l propriétaire / groupe / lakhrin. 755 = rwxr-xr-x.", 'r=4, w=2, x=1 for owner / group / others. 755 = rwxr-xr-x.'],
  ['sudo / sudoers', 'linux', "sudo permet d'exécuter une commande en root. Les droits sont dans /etc/sudoers (modifié avec visudo). Groupe wheel = admins.", "sudo kaykhellik tdir commande b root. Les droits f /etc/sudoers (kat3dlo b visudo). Groupe wheel = admins.", 'sudo runs a command as root. Rules in /etc/sudoers (edit with visudo). wheel group = admins.'],
  ['systemd / systemctl', 'linux', "Gestionnaire de services : systemctl start|stop|enable|status service. enable = démarrage auto au boot.", "Kaysayer services : systemctl start|stop|enable|status service. enable = yebda wa7do f boot.", 'Service manager: systemctl start|stop|enable|status. enable = start at boot.'],
  ['rpm / dnf', 'linux', "rpm installe un paquet .rpm local sans dépendances ; dnf télécharge depuis les dépôts et gère les dépendances.", "rpm kayinstalli paquet .rpm local bla dépendances ; dnf kayjib mn dépôts w kaydir dépendances.", 'rpm installs a local .rpm without deps; dnf fetches from repos and resolves deps.'],
  ['GRUB / rd.break', 'linux', "GRUB = chargeur de démarrage. Ajouter rd.break à la ligne linux permet de s'arrêter avant le montage du système pour réinitialiser le mot de passe root.", "GRUB = li kaybda système. Tzid rd.break f ligne linux bach t7bes 9bel montage w tbeddel mot de passe root.", 'GRUB = bootloader. Adding rd.break stops before the root mount to reset the root password.'],
  ['SELinux / autorelabel', 'linux', "Couche de sécurité qui étiquette chaque fichier. Après un reset root : touch /.autorelabel pour réétiqueter au reboot.", "Couche sécurité kat7et label 3la kol fichier. Mor reset root : touch /.autorelabel bach y3awd labels f reboot.", 'Security layer labelling every file. After a root reset: touch /.autorelabel.'],
];

const MODS: { id: M | 'all'; label: string }[] = [
  { id: 'all', label: 'Tout / All' },
  { id: 'data', label: 'Data' },
  { id: 'ro', label: 'RO' },
  { id: 'oracle', label: 'Oracle' },
  { id: 'linux', label: 'Linux' }
];

export default function GlossaryPage() {
  const { lang } = useT();
  const [q, setQ] = useState('');
  const [m, setM] = useState<M | 'all'>('all');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return TERMS.filter((t) => (m === 'all' || t[1] === m) && (!s || t.join(' ').toLowerCase().includes(s)));
  }, [q, m]);
  const idx = lang === 'dar' ? 3 : lang === 'en' ? 4 : 2;
  return (
    <div>
      <PageTitle
        back="/"
        title={lang === 'en' ? 'Glossary' : 'Lexique'}
        sub={lang === 'en' ? 'Key terms explained simply.' : lang === 'dar' ? 'Lmoustala7at lmohimma mcharhin b sahl.' : 'Les termes clés expliqués simplement.'}
      />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ACP, CDB, Dijkstra…" className="mb-3 w-full rounded-xl border border-line bg-surface px-3 py-2 outline-none focus:border-accent" />
      <div className="mb-4 flex flex-wrap gap-2">
        {MODS.map((x) => (
          <button key={x.id} onClick={() => setM(x.id)} className={`chip ${m === x.id ? 'border-accent text-accent' : ''}`}>
            {x.label}
          </button>
        ))}
      </div>
      <ul className="space-y-3">
        {list.map((t) => (
          <li key={t[0]} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{t[0]}</h2>
              <span className="chip shrink-0 text-xs">{t[1]}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{t[idx]}</p>
          </li>
        ))}
        {!list.length && <li className="text-muted">—</li>}
      </ul>
    </div>
  );
}
