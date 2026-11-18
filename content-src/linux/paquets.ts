import { setCtx, L, h, p, code, trap, exam, anim, quiz, mission, single, multi, cmd, order, ex, fc, ref } from '../lib';
import type { Chapter } from '../../src/lib/schema';

setCtx('linux', 'paquets');

export const questions = [
  cmd('lp-01', 1, ['Compte le nombre de paquets RPM installés.', '7seb paquets installés.', 'Count installed RPM packages.'],
    ['rpm -qa | wc -l'], ['`rpm -qa` (*query all*) liste un paquet par ligne, `wc -l` compte.', '`rpm -qa` + `wc -l`.', '`rpm -qa` lists one package per line, `wc -l` counts.'], { 'rpm -qa': ['Liste, mais ne compte pas.', 'Kaylister walakin ma kay7sebch.', 'Lists but does not count.'] }, ['rpm']),
  cmd('lp-02', 2, ['À quel paquet appartient le fichier `/etc/services` ?', 'L ach men paquet `/etc/services` ?', 'Which package owns `/etc/services`?'],
    ['rpm -qf /etc/services'], ['`rpm -qf` (*query file*) → `setup-…`.', '`-qf` → setup.', '`rpm -qf` → `setup-…`.'], { 'rpm -ql /etc/services': ['`-ql` liste les fichiers d\'un **paquet** donné, l\'inverse.', '`-ql` l3eks.', '`-ql` lists a **package**\'s files: the opposite.'] }, ['rpm']),
  cmd('lp-03', 1, ['Affiche les informations détaillées du paquet installé `bash`.', 'Werri ma3loumat dyal `bash`.', 'Show detailed info on installed `bash`.'],
    ['rpm -qi bash'], ['`-qi` : nom, version, release, licence, résumé, date d\'installation…', '`-qi`.', '`-qi`: name, version, licence, summary…'], { 'rpm -q bash': ['Donne seulement nom-version-release.', 'Ghir nom-version.', 'Only name-version-release.'] }, ['rpm']),
  single('lp-04', 2, ['Que fait `rpm -ql openssh-server` ?', 'Chnou kaydir `rpm -ql openssh-server` ?', 'What does `rpm -ql openssh-server` do?'],
    [['Liste les fichiers installés par ce paquet', 'Kaylister fichiers dyal paquet', 'Lists files installed by the package'], ['Liste ses dépendances', 'Dépendances', 'Lists its dependencies'], ['Vérifie sa signature', 'Signature', 'Checks its signature'], ['L\'installe', 'Kayinstallih', 'Installs it']], 0,
    ['`-q` query + `-l` list. `-qc` = seulement les fichiers de configuration, `-qd` = documentation.', '`-ql` fichiers ; `-qc` config.', '`-ql` files; `-qc` config files only; `-qd` docs.'],
    [['Dépendances : `rpm -qR`.', '`-qR`.', 'Dependencies: `rpm -qR`.'], ['Signature : `rpm -K` sur un fichier .rpm.', '`-K`.', 'Signature: `rpm -K`.'], ['Installation : `rpm -ivh`.', '`-ivh`.', 'Install: `rpm -ivh`.']], ['rpm']),
  cmd('lp-05', 2, ['Vérifie quels fichiers du paquet `sudo` ont été modifiés depuis l\'installation.', 'Chouf ach men fichiers dyal `sudo` tbeddlou.', 'Check which files of `sudo` changed since install.'],
    ['rpm -V sudo'], ['`rpm -V` compare taille (S), somme MD5 (5), date (T)… avec la base RPM ; `c` = fichier de configuration. Aucune sortie = rien de modifié.', '`-V` : S, 5, T ; `c` = config.', '`rpm -V` compares size (S), digest (5), time (T)…; `c` = config file. No output = unchanged.'], {}, ['rpm']),
  cmd('lp-06', 3, ['Affiche les fichiers de configuration contenus dans le fichier **non installé** `tree-1.8.0-10.el9.x86_64.rpm`.', 'Werri config dyal fichier **ma installich** `tree-….rpm`.', 'List config files inside the **uninstalled** file `tree-1.8.0-10.el9.x86_64.rpm`.'],
    ['rpm -qpc tree-1.8.0-10.el9.x86_64.rpm', 'rpm -qcp tree-1.8.0-10.el9.x86_64.rpm'], ['`-p` interroge un **fichier .rpm** au lieu de la base installée ; `-c` = configuration.', '`-p` = fichier .rpm ; `-c` config.', '`-p` queries a **.rpm file** instead of the installed DB; `-c` = config.'],
    { 'rpm -qc tree': ['Sans `-p`, interroge le paquet **installé** (absent ici).', 'Bla `-p` : installé.', 'Without `-p`, queries the **installed** package (absent).'] }, ['rpm']),
  cmd('lp-07', 2, ['Vérifie la signature du fichier `wireshark-3.4.10-7.el9.x86_64.rpm`.', 'Tsdi9 signature dyal `wireshark-….rpm`.', 'Check the signature of `wireshark-3.4.10-7.el9.x86_64.rpm`.'],
    ['rpm -K wireshark-3.4.10-7.el9.x86_64.rpm', 'rpm --checksig wireshark-3.4.10-7.el9.x86_64.rpm'], ['`rpm -K` vérifie empreintes et signature GPG (« digests signatures OK »).', '`rpm -K`.', '`rpm -K` checks digests and GPG signature.'], {}, ['rpm']),
  single('lp-08', 2, ['`rpm -ivh wireshark-*.rpm` échoue avec « Dépendances requises ». Pourquoi ?', '`rpm -ivh wireshark` kayfchel. 3lach ?', '`rpm -ivh wireshark-*.rpm` fails with "Failed dependencies". Why?'],
    [['Le fichier est corrompu', 'Fichier khasser', 'The file is corrupt'], ['rpm vérifie les dépendances mais ne les résout pas (ne télécharge rien)', 'rpm kaytsdi9 walakin ma kay7ellch dépendances', 'rpm checks dependencies but does not resolve them'], ['Il faut être root', 'Khass root', 'You must be root'], ['wireshark n\'existe pas pour RHEL', 'Ma kaynch', 'wireshark does not exist for RHEL']], 1,
    ['`rpm` travaille sur **un fichier** : il refuse si des paquets requis manquent. `dnf` résout l\'arbre des dépendances depuis les dépôts.', '`rpm` fichier wa7ed ; `dnf` kay7ell.', '`rpm` works on **one file** and refuses if requirements are missing. `dnf` resolves the dependency tree.'],
    [['Le message parle de dépendances, pas de corruption.', 'Machi corruption.', 'The message is about dependencies.'], ['Sans root, l\'erreur serait un verrou/permission.', 'Bla root : permission.', 'Without root, the error would be a lock/permission one.'], ['Il existe (dépôt AppStream).', 'Kayn f AppStream.', 'It exists (AppStream).']], ['rpm', 'dnf']),
  single('lp-09', 3, ['Que risque-t-on avec `rpm -ivh --nodeps paquet.rpm` ?', 'Chnou khatar `--nodeps` ?', 'What is the risk of `rpm -ivh --nodeps pkg.rpm`?'],
    [['Rien, c\'est recommandé', 'Walou', 'Nothing, it is recommended'], ['Installer un logiciel qui ne fonctionnera pas (bibliothèques manquantes)', 'Logiciel ma ykhdemch (bibliothèques na9sin)', 'Install software that will not run (missing libraries)'], ['Supprimer d\'autres paquets', 'Ymse7 paquets khrin', 'Remove other packages'], ['Désactiver SELinux', 'Ytfi SELinux', 'Disable SELinux']], 1,
    ['`--nodeps` force l\'installation sans les dépendances : le programme plantera au lancement (ex. libQt5Core.so.5 manquante). À éviter : utiliser dnf.', '`--nodeps` : programme ma ykhdemch. Dnf a7san.', '`--nodeps` forces install without deps: the program will crash. Use dnf.'],
    [['Fortement déconseillé.', 'Ma ynsa7ch.', 'Strongly discouraged.'], ['Ne supprime rien.', 'Ma kaymse7 walou.', 'Removes nothing.'], ['Sans rapport.', 'Ma 3endo 3ala9a.', 'Unrelated.']], ['rpm']),
  cmd('lp-10', 1, ['Installe le paquet `tree` avec ses dépendances, sans confirmation.', 'Installi `tree` bla ma ysowel.', 'Install `tree` with dependencies, no confirmation.'],
    ['dnf install -y tree', 'dnf -y install tree', 'yum install -y tree', 'yum -y install tree'], ['`dnf install` résout les dépendances ; `-y` répond oui. `yum` est un alias de dnf sur RHEL 9.', '`dnf install -y`.', '`dnf install` resolves deps; `-y` answers yes. `yum` aliases dnf on RHEL 9.'], { 'rpm -ivh tree': ['rpm attend un fichier .rpm et ne télécharge rien.', 'rpm khasso fichier.', 'rpm needs a .rpm file.'] }, ['dnf']),
  cmd('lp-11', 2, ['Trouve quel paquet fournit le fichier `/usr/share/magic`.', 'Ach men paquet kay3ti `/usr/share/magic` ?', 'Find which package provides `/usr/share/magic`.'],
    ['dnf provides /usr/share/magic', 'yum provides /usr/share/magic', 'dnf whatprovides /usr/share/magic'], ['`dnf provides` cherche dans **tous** les paquets des dépôts (même non installés) → `file-libs`.', '`provides` → file-libs.', '`dnf provides` searches **all** repo packages → `file-libs`.'], { 'rpm -qf /usr/share/magic': ['Fonctionne seulement si le fichier est déjà installé.', 'Ghir ila installé.', 'Only if already installed.'] }, ['dnf']),
  single('lp-12', 2, ['Que fait `dnf history undo 7` ?', 'Chnou kaydir `dnf history undo 7` ?', 'What does `dnf history undo 7` do?'],
    [['Supprime la ligne 7 de l\'historique', 'Kaymse7 ster 7', 'Deletes history line 7'], ['Annule la transaction n° 7 (désinstalle ce qu\'elle a installé et inversement)', 'Kaylghi transaction 7', 'Reverts transaction #7'], ['Rejoue la transaction 7', '3awed 7', 'Replays transaction 7'], ['Affiche le détail de la transaction 7', 'Détail 7', 'Shows transaction 7 details']], 1,
    ['`dnf history` liste les transactions, `history info N` les détaille, **`history undo N`** les annule.', 'list → info → undo.', '`history` lists, `info N` details, **`undo N`** reverts.'],
    [['L\'historique n\'est pas modifié ainsi.', 'Machi hakka.', 'History is not edited this way.'], ['C\'est `history redo`.', '`redo`.', 'That is `redo`.'], ['C\'est `history info 7`.', '`info`.', 'That is `history info 7`.']], ['dnf']),
  cmd('lp-13', 2, ['Liste les paquets pour lesquels une mise à jour est disponible, **sans** rien installer.', 'Lister updates bla ma tinstalli.', 'List packages with available updates, **without** installing.'],
    ['dnf check-update', 'yum check-update'], ['`check-update` liste (code de retour 100 s\'il y a des mises à jour) ; `dnf update` les applique.', '`check-update` ; `update` kaytbe9.', '`check-update` lists (exit code 100 if updates); `dnf update` applies.'], { 'dnf update': ['Applique les mises à jour.', 'Kaytbe9.', 'Applies them.'] }, ['dnf']),
  cmd('lp-14', 2, ['Installe le groupe de paquets « System Tools ».', 'Installi groupe « System Tools ».', 'Install the "System Tools" package group.'],
    ['dnf group install "System Tools"', 'dnf groupinstall "System Tools"', 'dnf group install -y "System Tools"', 'yum groupinstall "System Tools"'], ['Les guillemets sont obligatoires (nom avec espace). `group list`, `group info`, `group remove`.', 'Guillemets darouriyin.', 'Quotes are required (space in name).'], { 'dnf group install System Tools': ['Sans guillemets, « System » et « Tools » deviennent deux arguments.', 'Bla guillemets : jouj arguments.', 'Without quotes these become two args.'] }, ['dnf']),
  single('lp-15', 2, ['Comment désactiver un dépôt dans un fichier `.repo` ?', 'Kifach ntfi dépôt f `.repo` ?', 'How do you disable a repo in a `.repo` file?'],
    [['Supprimer baseurl', 'Mse7 baseurl', 'Delete baseurl'], ['Mettre enabled=0 (ou yum-config-manager --disable ID)', 'enabled=0 (wla --disable)', 'Set enabled=0 (or yum-config-manager --disable ID)'], ['Mettre gpgcheck=0', 'gpgcheck=0', 'Set gpgcheck=0'], ['Renommer le fichier en .txt', '.txt', 'Rename to .txt']], 1,
    ['Chaque section `[id]` de `/etc/yum.repos.d/*.repo` a `enabled=1/0`. `yum-config-manager --enable|--disable ID` le modifie. `dnf repolist` vérifie.', '`enabled=0` ; `repolist`.', 'Each `[id]` section has `enabled=1/0`. `yum-config-manager --enable|--disable ID` edits it; `dnf repolist` checks.'],
    [['Le dépôt serait cassé, pas désactivé proprement.', 'Ykhssar.', 'That breaks it.'], ['gpgcheck concerne la vérification des signatures.', 'gpgcheck = signatures.', 'gpgcheck is signature checking.'], ['Bricolage : enabled=0 est la bonne méthode.', 'enabled=0 a7san.', 'A hack; enabled=0 is right.']], ['depots']),
  order('lp-16', 3, ['Remets dans l\'ordre la création d\'un dépôt local servi par HTTP.', 'Rttab création dyal dépôt local.', 'Order the creation of a local HTTP-served repository.'],
    [['dnf install httpd createrepo_c ; systemctl enable --now httpd', 'httpd + createrepo', 'Install httpd + createrepo_c, start httpd'], ['mkdir /var/www/html/mon_depot', 'mkdir mon_depot', 'mkdir /var/www/html/mon_depot'], ['dnf install --downloadonly --downloaddir=/var/www/html/mon_depot paquet', '--downloadonly', 'dnf install --downloadonly --downloaddir=… pkg'], ['createrepo /var/www/html/mon_depot', 'createrepo', 'createrepo /var/www/html/mon_depot'], ['Créer /etc/yum.repos.d/local.repo (baseurl, gpgcheck=0, enabled=1)', 'local.repo', 'Create local.repo (baseurl, gpgcheck=0, enabled=1)'], ['dnf repolist puis installation depuis le dépôt', 'repolist w install', 'dnf repolist then install from it']],
    ['Serveur web → répertoire → paquets téléchargés → **métadonnées (createrepo)** → fichier `.repo` → test.', 'httpd → dossier → paquets → createrepo → .repo → test.', 'Web server → directory → packages → **metadata (createrepo)** → `.repo` → test.'], ['depots']),
  single('lp-17', 3, ['Sans `createrepo`, que se passe-t-il quand dnf utilise un répertoire plein de .rpm comme dépôt ?', 'Bla `createrepo` chnou ywqe3 ?', 'Without `createrepo`, what happens when dnf uses a folder of .rpm files as a repo?'],
    [['Ça marche', 'Khddam', 'It works'], ['dnf ne trouve pas de métadonnées (repodata/) : dépôt inutilisable', 'Ma kaynch repodata/ : ma ykhdemch', 'dnf finds no metadata (repodata/): unusable repo'], ['dnf installe tous les paquets', 'Kayinstalli kolchi', 'dnf installs everything'], ['Les paquets sont supprimés', 'Kaytmse7ou', 'Packages get deleted']], 1,
    ['Un dépôt = des .rpm **+ un répertoire `repodata/`** (repomd.xml…) généré par `createrepo`. À relancer après chaque ajout de paquet.', 'Dépôt = .rpm + `repodata/`.', 'A repo = .rpm files **+ `repodata/`** generated by `createrepo`. Re-run after adding packages.'],
    [['dnf lit les métadonnées, pas le dossier.', 'dnf kay9ra repodata.', 'dnf reads metadata, not the folder.'], ['Faux.', 'Ghalat.', 'False.'], ['Rien n\'est supprimé.', 'Walou.', 'Nothing is deleted.']], ['depots']),
  multi('lp-18', 2, ['Dans un fichier `.repo` local, quelles lignes sont correctes ?', 'F `.repo` local, chnou s7i7 ?', 'In a local `.repo`, which lines are correct?'],
    [['[local]', '[local]', '[local]'], ['baseurl=file:///var/www/html/mon_depot', 'baseurl=file:///var/www/html/mon_depot', 'baseurl=file:///var/www/html/mon_depot'], ['gpgcheck=0', 'gpgcheck=0', 'gpgcheck=0'], ['enabled=1', 'enabled=1', 'enabled=1'], ['baseurl=/var/www/html/mon_depot', 'baseurl=/var/www/html/mon_depot', 'baseurl=/var/www/html/mon_depot']], [0, 1, 2, 3],
    ['Identifiant entre crochets, `name=`, `baseurl=` avec un **schéma** (`file:///` ou `http://IP/mon_depot`), `gpgcheck=0` (paquets non signés par nous), `enabled=1`.', 'baseurl b `file:///` wla `http://`.', 'ID in brackets, `baseurl=` with a **scheme** (`file:///` or `http://`), `gpgcheck=0`, `enabled=1`.'],
    [['Il manque le schéma `file://` : URL invalide.', 'Na9es `file://`.', 'Missing the `file://` scheme.']], ['depots']),
  cmd('lp-19', 1, ['Liste les dépôts activés.', 'Lister dépôts activés.', 'List enabled repositories.'],
    ['dnf repolist', 'yum repolist'], ['`repolist` (ajouter `--all` pour voir aussi les désactivés).', '`repolist`.', '`repolist` (`--all` includes disabled).'], {}, ['depots']),
  cmd('lp-20', 2, ['Désinstalle `tree` avec dnf.', 'Désinstalli `tree`.', 'Uninstall `tree` with dnf.'],
    ['dnf remove tree', 'dnf remove -y tree', 'yum remove tree', 'dnf erase tree'], ['`dnf remove` retire aussi les dépendances devenues inutiles ; `rpm -e` refuse si d\'autres paquets en dépendent.', '`dnf remove`.', '`dnf remove` also cleans unused deps; `rpm -e` refuses if others depend on it.'], {}, ['dnf'])
];

export const chapter: Chapter = {
  id: 'paquets',
  module: 'linux',
  order: 5,
  title: L(['TP4 — Gestion des paquetages (rpm, dnf)', 'TP4 — Paquets (rpm, dnf)', 'TP4 — Package management (rpm, dnf)']),
  summary: L(['Interroger et vérifier avec rpm, installer et résoudre les dépendances avec dnf, historique, groupes, dépôts et dépôt local.', 'rpm, dnf, historique, groupes, dépôts w dépôt local.', 'Query/verify with rpm, install with dnf, history, groups, repos and a local repo.']),
  estimatedMinutes: 50,
  sections: [
    h(['rpm : la base de paquets', 'rpm', 'rpm: the package database']),
    code(`rpm -qa | wc -l               # nombre de paquets installés
rpm -q bash                   # installé ? version
rpm -qi bash                  # informations
rpm -ql openssh-server        # fichiers du paquet
rpm -qc openssh-server        # fichiers de configuration
rpm -qf /etc/services         # à quel paquet appartient ce fichier ?
rpm -qf /bin/ls
rpm -V sudo                   # fichiers modifiés (S taille, 5 somme, T date, c config)
rpm -qpc fichier.rpm          # config d'un .rpm NON installé (-p)
rpm -K fichier.rpm            # signature
rpm -ivh fichier.rpm          # installer (-U mettre à jour, -e supprimer)`),
    trap(['`rpm` ne résout **pas** les dépendances : `rpm -ivh wireshark-…rpm` échoue. `--nodeps` force… et donne un logiciel cassé.', '`rpm` ma kay7ellch dépendances.', '`rpm` does **not** resolve dependencies. `--nodeps` gives broken software.']),
    anim('RpmVsDnf'),
    quiz('lp-02', 'lp-05', 'lp-08'),
    h(['dnf : installer, mettre à jour, historique', 'dnf', 'dnf: install, update, history']),
    code(`dnf install -y wireshark            # résout et installe les dépendances
dnf check-update ; dnf update
dnf info httpd
dnf provides /usr/share/magic        # quel paquet fournit ce fichier ?
dnf history ; dnf history info 5 ; dnf history undo 5
dnf group list ; dnf group info "System Tools"
dnf group install "System Tools" ; dnf group remove "System Tools"
dnf remove tree`),
    mission('m-dnf-wireshark'),
    quiz('lp-10', 'lp-11', 'lp-12'),
    h(['Dépôts', 'Dépôts', 'Repositories']),
    p(['Les dépôts sont déclarés dans `/etc/yum.repos.d/*.repo` : une section `[id]` avec `name`, `baseurl`, `enabled`, `gpgcheck`. `dnf repolist` liste les dépôts activés, `yum-config-manager --enable|--disable ID` (ou `enabled=0`) les active/désactive.', '`/etc/yum.repos.d/*.repo` : `[id]`, `baseurl`, `enabled`, `gpgcheck`.', 'Repos live in `/etc/yum.repos.d/*.repo`: `[id]` with `name`, `baseurl`, `enabled`, `gpgcheck`. `dnf repolist` lists them; `yum-config-manager --enable|--disable ID` toggles them.']),
    h(['Créer un dépôt local', 'Dépôt local', 'Creating a local repository']),
    code(`dnf install -y httpd createrepo_c
systemctl enable --now httpd
mkdir /var/www/html/mon_depot
dnf install --downloadonly --downloaddir=/var/www/html/mon_depot zsh
createrepo /var/www/html/mon_depot        # génère repodata/
cat > /etc/yum.repos.d/local.repo <<EOF
[local]
name=Depot local
baseurl=file:///var/www/html/mon_depot    # ou http://IP/mon_depot
gpgcheck=0
enabled=1
EOF
dnf repolist`),
    exam(['Sans `createrepo` (répertoire `repodata/`), le dépôt est inutilisable. `baseurl` doit commencer par `file:///` ou `http://`.', 'Bla `createrepo` ma ykhdemch.', 'Without `createrepo` (`repodata/`) the repo is unusable. `baseurl` needs `file:///` or `http://`.']),
    mission('m-dnf-local-repo'),
    quiz('lp-16', 'lp-17', 'lp-18')
  ],
  keyPoints: [
    L(['rpm -qa | wc -l, -q, -qi, -ql, -qc, -qf fichier, -V, -qpc f.rpm, -K, -ivh, -e.', 'rpm -qa -qi -ql -qc -qf -V -qpc -K -ivh -e.', 'rpm -qa | wc -l, -q, -qi, -ql, -qc, -qf, -V, -qpc, -K, -ivh, -e.']),
    L(['rpm ne résout pas les dépendances (wireshark échoue) ; dnf oui.', 'rpm la ; dnf ah.', 'rpm does not resolve deps; dnf does.']),
    L(['dnf install/remove/update/check-update/info/provides ; history, history info N, history undo N ; group list/info/install/remove "System Tools".', 'dnf + history + group.', 'dnf install/remove/update/check-update/info/provides; history info/undo; group.']),
    L(['/etc/yum.repos.d/*.repo : [id], baseurl, enabled=0/1, gpgcheck ; dnf repolist ; yum-config-manager --enable/--disable.', '.repo, repolist.', '.repo files, repolist, yum-config-manager.']),
    L(['Dépôt local : httpd, mkdir /var/www/html/mon_depot, --downloadonly --downloaddir, createrepo, local.repo (baseurl=file:///…, gpgcheck=0, enabled=1).', 'Dépôt local : downloadonly + createrepo + .repo.', 'Local repo: --downloadonly, createrepo, local.repo.'])
  ]
};

export const exercises = [
  ex('lx-pkg-1', 2, ['Enquête rpm', 'Bahth b rpm', 'rpm investigation'],
    ['Un collègue a modifié un fichier système. Trouve à quel paquet appartient `/etc/sudoers`, liste les fichiers de configuration de ce paquet, puis vérifie lesquels ont été modifiés.', 'Chi wa7ed beddel fichier. L ach men paquet `/etc/sudoers` ? Config dyalo ? Chnou tbeddel ?', 'A colleague changed a system file. Find the package owning `/etc/sudoers`, list its config files, then check which were modified.'],
    [['-qf, -qc, -V', '-qf, -qc, -V', '-qf, -qc, -V']],
    [{ t: ['Propriétaire', 'Mol', 'Owner'], b: ['→ sudo-1.9.5p2-…', '→ sudo', '→ sudo-…'], code: 'rpm -qf /etc/sudoers' },
     { t: ['Fichiers de config', 'Config', 'Config files'], b: ['', '', ''], code: 'rpm -qc sudo' },
     { t: ['Vérifier', 'Tsdi9', 'Verify'], b: ['Une ligne `S.5....T.  c /etc/sudoers` = taille, somme et date changées.', '`S.5....T.` = tbeddel.', '`S.5....T.  c /etc/sudoers` = size, digest and time changed.'], code: 'rpm -V sudo' }],
    ['`rpm -qf /etc/sudoers` → sudo ; `rpm -qc sudo` ; `rpm -V sudo`.', 'qf → qc → V.', '`rpm -qf` → `rpm -qc sudo` → `rpm -V sudo`.'],
    [['Utiliser `rpm -ql` au lieu de `-qf`.', '`-ql` f blast `-qf`.', 'Using `-ql` instead of `-qf`.'], ['Croire qu\'une sortie vide de `rpm -V` est une erreur.', 'Sortie khawya = mzyan.', 'Thinking empty `rpm -V` output is an error.']]),
  ex('lx-pkg-2', 3, ['rpm échoue, dnf réussit', 'rpm kayfchel, dnf kaynje7', 'rpm fails, dnf succeeds'],
    ['Tu as `/root/rpms/wireshark-3.4.10-7.el9.x86_64.rpm`. Essaie de l\'installer avec rpm, explique l\'échec, puis installe wireshark correctement et annule ensuite cette installation grâce à l\'historique.', 'Installi b rpm, fesser, men b3d dnf, w lghi b history.', 'Try installing with rpm, explain the failure, install properly, then revert via history.'],
    [['Lis attentivement le message « Dépendances requises ».', '9ra message.', 'Read "Failed dependencies".'], ['history list → numéro → undo.', 'history → undo.', 'history → undo.']],
    [{ t: ['Avec rpm', 'B rpm', 'With rpm'], b: ['Échec : wireshark-cli, libQt5Core.so.5, libpcap… manquent ; rpm ne télécharge rien.', 'Dépendances na9sin.', 'Fails: missing wireshark-cli, libQt5Core.so.5, libpcap…'], code: 'rpm -ivh /root/rpms/wireshark-3.4.10-7.el9.x86_64.rpm' },
     { t: ['Avec dnf', 'B dnf', 'With dnf'], b: ['dnf calcule et installe les dépendances.', 'dnf kay7ell.', 'dnf resolves and installs them.'], code: 'dnf install -y wireshark' },
     { t: ['Annuler', 'Lghi', 'Undo'], b: ['Repérer l\'ID de la transaction puis l\'annuler.', 'ID w undo.', 'Find the ID then undo.'], code: 'dnf history\ndnf history info 2\ndnf history undo 2' }],
    ['rpm : « Dépendances requises » ; `dnf install -y wireshark` ; `dnf history undo N`.', 'rpm fchel ; dnf ; undo.', 'rpm: failed deps; `dnf install -y wireshark`; `dnf history undo N`.'],
    [['Ajouter --nodeps.', '--nodeps.', 'Adding --nodeps.'], ['Annuler avec `dnf remove wireshark` (laisse les dépendances).', '`remove` kaykhelli deps.', 'Undoing with `dnf remove` (leaves deps).']], { missionId: 'm-dnf-wireshark' }),
  ex('lx-pkg-3', 3, ['Dépôt local complet', 'Dépôt local kaml', 'Complete local repository'],
    ['Crée un dépôt local `mon_depot` contenant `zsh`, déclare-le, désactive les dépôts Red Hat, puis installe zsh depuis ce dépôt uniquement.', 'Dir dépôt local fih `zsh`, tfi dépôts Red Hat, installi zsh.', 'Create a local repo with `zsh`, declare it, disable Red Hat repos, then install zsh from it only.'],
    [['createrepo vient du paquet createrepo_c.', 'createrepo_c.', 'createrepo comes from createrepo_c.'], ['baseurl en file:///', 'file:///', 'baseurl with file:///']],
    [{ t: ['Préparer', 'Wjjed', 'Prepare'], b: ['', '', ''], code: 'dnf install -y httpd createrepo_c\nmkdir -p /var/www/html/mon_depot\ndnf install --downloadonly --downloaddir=/var/www/html/mon_depot -y zsh\ncreaterepo /var/www/html/mon_depot' },
     { t: ['Déclarer', 'Déclarer', 'Declare'], b: ['Fichier /etc/yum.repos.d/local.repo', 'local.repo', 'local.repo'], code: '[local]\nname=Depot local\nbaseurl=file:///var/www/html/mon_depot\ngpgcheck=0\nenabled=1' },
     { t: ['Tester', 'Testi', 'Test'], b: ['', '', ''], code: 'yum-config-manager --disable rhel-9-for-x86_64-baseos-rpms\nyum-config-manager --disable rhel-9-for-x86_64-appstream-rpms\ndnf repolist\ndnf install -y zsh' }],
    ['Le dépôt `local` est le seul listé par `dnf repolist` et fournit zsh.', 'local wa7dou.', '`local` is the only repo listed and provides zsh.'],
    [['Oublier createrepo.', 'Tnsa createrepo.', 'Forgetting createrepo.'], ['baseurl sans `file://`.', 'Bla file://.', 'baseurl without `file://`.']], { missionId: 'm-dnf-local-repo' }),
  ex('lx-pkg-4', 2, ['Groupes de paquets', 'Groupes', 'Package groups'],
    ['Affiche les groupes disponibles, le contenu du groupe « System Tools », installe-le puis supprime-le.', 'Groupes, contenu, install, remove.', 'Show groups, the content of "System Tools", install it then remove it.'],
    [['Guillemets !', 'Guillemets !', 'Quotes!']],
    [{ t: ['Commandes', 'Commandes', 'Commands'], b: ['', '', ''], code: 'dnf group list\ndnf group info "System Tools"\ndnf group install -y "System Tools"\ndnf group remove -y "System Tools"' }],
    ['group list / info / install / remove avec le nom entre guillemets.', 'group + guillemets.', 'group list/info/install/remove, quoted name.'],
    [['Nom sans guillemets.', 'Bla guillemets.', 'Unquoted name.']])
];

export const flashcards = [
  fc('fc-pkg-1', ['Nombre de paquets installés ?', 'Ch7al paquet ?', 'Number of installed packages?'], ['`rpm -qa | wc -l`', '`rpm -qa | wc -l`', '`rpm -qa | wc -l`']),
  fc('fc-pkg-2', ['À quel paquet appartient un fichier ?', 'Paquet dyal fichier ?', 'Package owning a file?'], ['`rpm -qf /chemin` (ou `dnf provides` si non installé).', '`rpm -qf`.', '`rpm -qf` (or `dnf provides`).']),
  fc('fc-pkg-3', ['rpm -qi / -ql / -qc ?', '-qi -ql -qc ?', '-qi / -ql / -qc?'], ['Infos / fichiers / fichiers de config.', 'Infos / fichiers / config.', 'Info / files / config files.']),
  fc('fc-pkg-4', ['rpm -V ?', 'rpm -V ?', 'rpm -V?'], ['Vérifie les fichiers modifiés (S taille, 5 somme, T date ; c = config).', 'Fichiers tbeddlou.', 'Verifies modified files.']),
  fc('fc-pkg-5', ['rpm -qpc f.rpm ?', '-qpc ?', '-qpc?'], ['Config d\'un fichier .rpm non installé.', 'Config dyal .rpm.', 'Config of an uninstalled .rpm.']),
  fc('fc-pkg-6', ['rpm -K ?', 'rpm -K ?', 'rpm -K?'], ['Vérifie la signature d\'un .rpm.', 'Signature.', 'Checks .rpm signature.']),
  fc('fc-pkg-7', ['rpm vs dnf ?', 'rpm vs dnf ?', 'rpm vs dnf?'], ['rpm : un fichier, ne résout pas les dépendances. dnf : dépôts + résolution.', 'rpm fichier ; dnf dépôts.', 'rpm: one file, no resolution. dnf: repos + resolution.']),
  fc('fc-pkg-8', ['Annuler une installation dnf ?', 'Lghi dnf ?', 'Undo a dnf install?'], ['`dnf history` → `dnf history undo N`', 'history undo N', '`dnf history undo N`']),
  fc('fc-pkg-9', ['Groupe de paquets ?', 'Groupe ?', 'Package group?'], ['`dnf group list|info|install|remove "System Tools"`', 'dnf group', '`dnf group …`']),
  fc('fc-pkg-10', ['Désactiver un dépôt ?', 'Tfi dépôt ?', 'Disable a repo?'], ['`enabled=0` dans le .repo, ou `yum-config-manager --disable ID`.', 'enabled=0.', '`enabled=0` or `yum-config-manager --disable`.']),
  fc('fc-pkg-11', ['Télécharger sans installer ?', 'Télécharger bla installation ?', 'Download without installing?'], ['`dnf install --downloadonly --downloaddir=REP pkg`', '--downloadonly', '`--downloadonly --downloaddir=`']),
  fc('fc-pkg-12', ['createrepo ?', 'createrepo ?', 'createrepo?'], ['Génère repodata/ (métadonnées) d\'un dépôt local.', 'repodata/.', 'Generates repodata/.'])
];

export const reference = [
  ref('r-pkg-1', 'rpm -qa | wc -l', ['Nombre de paquets installés', 'Ch7al paquet', 'Count installed packages']),
  ref('r-pkg-2', 'rpm -q · -qi · -ql · -qc · -qd P', ['Version · infos · fichiers · config · doc', 'Version · infos · fichiers · config', 'Version · info · files · config · docs']),
  ref('r-pkg-3', 'rpm -qf /fichier', ['Paquet propriétaire', 'Paquet dyal fichier', 'Owning package'], 'rpm -qf /etc/services'),
  ref('r-pkg-4', 'rpm -V P', ['Vérifier les fichiers modifiés', 'Tsdi9', 'Verify modified files']),
  ref('r-pkg-5', 'rpm -qpc f.rpm · rpm -K f.rpm', ['Config d\'un .rpm · signature', 'Config · signature', 'Config of a .rpm · signature']),
  ref('r-pkg-6', 'rpm -ivh f.rpm [--nodeps] · -Uvh · -e P', ['Installer · mettre à jour · supprimer', 'Installer · update · mse7', 'Install · upgrade · erase']),
  ref('r-pkg-7', 'dnf install|remove [-y] P', ['Installer / supprimer avec dépendances', 'Install / remove', 'Install / remove with deps']),
  ref('r-pkg-8', 'dnf check-update · dnf update', ['Lister / appliquer les mises à jour', 'Updates', 'List / apply updates']),
  ref('r-pkg-9', 'dnf info P · dnf provides /fichier', ['Infos · quel paquet fournit', 'Infos · provides', 'Info · which package provides'], 'dnf provides /usr/share/magic'),
  ref('r-pkg-10', 'dnf history [info N | undo N]', ['Historique des transactions', 'Historique', 'Transaction history']),
  ref('r-pkg-11', 'dnf group list|info|install|remove "Nom"', ['Groupes de paquets', 'Groupes', 'Package groups']),
  ref('r-pkg-12', 'dnf repolist [--all]', ['Dépôts activés', 'Dépôts', 'Enabled repos']),
  ref('r-pkg-13', '/etc/yum.repos.d/*.repo', ['[id] name baseurl enabled gpgcheck', 'Fichiers .repo', 'Repo definition files']),
  ref('r-pkg-14', 'yum-config-manager --enable|--disable ID', ['Activer / désactiver un dépôt', 'Activer / tfi', 'Enable / disable a repo']),
  ref('r-pkg-15', 'dnf install --downloadonly --downloaddir=REP P', ['Télécharger les .rpm', 'Télécharger', 'Download .rpm files']),
  ref('r-pkg-16', 'createrepo REP', ['Créer les métadonnées d\'un dépôt', 'repodata', 'Create repo metadata']),
  ref('r-pkg-17', 'baseurl=file:///var/www/html/mon_depot', ['Dépôt local (gpgcheck=0, enabled=1)', 'Dépôt local', 'Local repo'])
];
