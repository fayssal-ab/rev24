import { setCtx, ms } from '../lib';
import type { Mission } from '../../src/lib/schema';

const PW = 'Tp1pass2026!';
const withTp1 = ['useradd tp1', `echo ${PW} | passwd --stdin tp1`];

setCtx('linux', 'tp1');
const tp1 = [
  ms('m-tp1-files', ['Fichiers et répertoires', 'Fichiers w répertoires', 'Files and directories'],
    ['En tant qu\'`etudiant` : crée `~/tp1/a/b`, écris « Revision Linux » dans `~/tp1/notes.txt`, copie-le en `~/tp1/a/copie.txt`, puis supprime le répertoire `~/brouillon` et tout son contenu.', 'B `etudiant` : `~/tp1/a/b`, notes.txt, copie, w mse7 `~/brouillon`.', 'As `etudiant`: create `~/tp1/a/b`, write "Revision Linux" to `~/tp1/notes.txt`, copy it to `~/tp1/a/copie.txt`, delete `~/brouillon`.'],
    [[['~/tp1/a/b existe', '~/tp1/a/b kayn', '~/tp1/a/b exists'], { type: 'pathExists', path: '/home/etudiant/tp1/a/b', kind: 'dir' }],
     [['notes.txt contient « Revision Linux »', 'notes.txt fih « Revision Linux »', 'notes.txt contains "Revision Linux"'], { type: 'fileContains', path: '/home/etudiant/tp1/notes.txt', text: 'Revision Linux' }],
     [['copie.txt existe dans ~/tp1/a', 'copie.txt kayn', 'copie.txt exists in ~/tp1/a'], { type: 'pathExists', path: '/home/etudiant/tp1/a/copie.txt', kind: 'file' }],
     [['~/brouillon a disparu', '~/brouillon tmse7', '~/brouillon is gone'], { type: 'pathExists', path: '/home/etudiant/brouillon', not: true }]],
    ['mkdir -p ~/tp1/a/b', 'echo "Revision Linux" > ~/tp1/notes.txt', 'cp ~/tp1/notes.txt ~/tp1/a/copie.txt', 'rm -rf ~/brouillon'],
    { startUser: 'etudiant', setup: ['mkdir -p /home/etudiant/brouillon/vieux', 'touch /home/etudiant/brouillon/vieux/a.txt', 'chown -R etudiant:etudiant /home/etudiant/brouillon'] }),
  ms('m-tp1-pipes', ['Filtres et tubes', 'Filtres w pipes', 'Filters and pipes'],
    ['Écris dans `~/logins.txt` la liste **triée** des logins dont le shell est `/bin/bash`, et dans `~/nb_comptes.txt` le **nombre** de lignes de `/etc/passwd`.', 'logins.txt w nb_comptes.txt.', 'Write the **sorted** bash logins to `~/logins.txt` and the **number** of passwd lines to `~/nb_comptes.txt`.'],
    [[['logins.txt contient etudiant puis root', 'logins.txt : etudiant w root', 'logins.txt holds etudiant then root'], { type: 'fileContains', path: '/home/etudiant/logins.txt', text: 'etudiant\nroot' }],
     [['nb_comptes.txt contient 20', 'nb_comptes.txt fih 20', 'nb_comptes.txt contains 20'], { type: 'fileContains', path: '/home/etudiant/nb_comptes.txt', text: '20' }]],
    ['grep "/bin/bash$" /etc/passwd | cut -d: -f1 | sort > ~/logins.txt', 'cat /etc/passwd | wc -l > ~/nb_comptes.txt'], { startUser: 'etudiant' })
];

setCtx('linux', 'grub');
const grub = [
  ms('m-grub-timeout', ['Menu GRUB : 10 secondes', 'Menu GRUB : 10 s', 'GRUB menu: 10 seconds'],
    ['Sauvegarde `/etc/default/grub` (avec `cp -p`) en `grub.bak`, mets `GRUB_TIMEOUT=10` et `GRUB_TIMEOUT_STYLE=menu`, puis régénère grub.cfg. (Éditeur simplifié : `vi /etc/default/grub`, `:r 1 GRUB_TIMEOUT=10` remplace la ligne 1, une ligne tapée est ajoutée, `:wq` enregistre.)', 'Sauvegarde, TIMEOUT=10, STYLE=menu, grub2-mkconfig.', 'Back up with `cp -p`, set `GRUB_TIMEOUT=10` and `GRUB_TIMEOUT_STYLE=menu`, regenerate grub.cfg.'],
    [[['Sauvegarde grub.bak présente', 'grub.bak kayn', 'grub.bak backup exists'], { type: 'fileContains', path: '/etc/default/grub.bak', text: 'GRUB_TIMEOUT=5' }],
     [['GRUB_TIMEOUT=10', 'GRUB_TIMEOUT=10', 'GRUB_TIMEOUT=10'], { type: 'fileContains', path: '/etc/default/grub', text: 'GRUB_TIMEOUT=10' }],
     [['GRUB_TIMEOUT_STYLE=menu', 'GRUB_TIMEOUT_STYLE=menu', 'GRUB_TIMEOUT_STYLE=menu'], { type: 'fileContains', path: '/etc/default/grub', text: 'GRUB_TIMEOUT_STYLE=menu' }],
     [['grub.cfg régénéré (timeout=10)', 'grub.cfg tjedded', 'grub.cfg regenerated'], { type: 'fileContains', path: '/boot/grub2/grub.cfg', text: 'set timeout=10' }]],
    ['cp -p /etc/default/grub /etc/default/grub.bak', 'vi /etc/default/grub', ':r 1 GRUB_TIMEOUT=10', 'GRUB_TIMEOUT_STYLE=menu', ':wq', 'grub2-mkconfig -o /boot/grub2/grub.cfg']),
  ms('m-grub-custom', ['Entrées « Redemarrer » et « Arreter »', 'Entrées Redemarrer w Arreter', '"Redemarrer" and "Arreter" entries'],
    ['Ajoute deux entrées au menu GRUB (redémarrer, arrêter) dans le bon fichier, puis régénère la configuration.', 'Zid jouj entrées w 3awed config.', 'Add two GRUB entries in the right file, then regenerate.'],
    [[['Entrées dans 40_custom', 'F 40_custom', 'Entries in 40_custom'], { type: 'fileContains', path: '/etc/grub.d/40_custom', text: 'menuentry "Arreter"' }],
     [['« Redemarrer » dans grub.cfg', 'Redemarrer f grub.cfg', '"Redemarrer" in grub.cfg'], { type: 'fileContains', path: '/boot/grub2/grub.cfg', text: 'menuentry "Redemarrer"' }],
     [['« Arreter » dans grub.cfg', 'Arreter f grub.cfg', '"Arreter" in grub.cfg'], { type: 'fileContains', path: '/boot/grub2/grub.cfg', text: 'menuentry "Arreter"' }]],
    ['echo \'menuentry "Redemarrer" { reboot }\' >> /etc/grub.d/40_custom', 'echo \'menuentry "Arreter" { halt }\' >> /etc/grub.d/40_custom', 'grub2-mkconfig -o /boot/grub2/grub.cfg']),
  ms('m-root-reset', ['Réinitialiser le mot de passe root', 'Beddel mot de passe root', 'Reset the root password'],
    ['Tu es au prompt `switch_root:/#` après avoir ajouté `rd.break` dans GRUB. Change le mot de passe root en **`Rev24#Root`** sans casser SELinux, puis termine le démarrage.', 'F `switch_root:/#`. Beddel root l `Rev24#Root`.', 'You are at `switch_root:/#` after `rd.break`. Set root\'s password to **`Rev24#Root`** without breaking SELinux, then finish booting.'],
    [[['Mot de passe root = Rev24#Root', 'Mot de passe root = Rev24#Root', 'root password = Rev24#Root'], { type: 'password', user: 'root', password: 'Rev24#Root' }],
     [['Réétiquetage SELinux effectué', 'Relabel SELinux tdar', 'SELinux relabel done'], { type: 'flag', flag: 'relabeled' }]],
    ['mount -o remount,rw /sysroot', 'chroot /sysroot', 'passwd', 'Rev24#Root', 'Rev24#Root', 'touch /.autorelabel', 'exit', 'exit'], { rdbreak: true })
];

setCtx('linux', 'systemd');
const systemd = [
  ms('m-systemd-target', ['Passer en mode texte', 'Douz l mode texte', 'Switch to text mode'],
    ['Passe **immédiatement** en `multi-user.target` et fais-en la cible **par défaut**.', 'Daba multi-user w par défaut.', 'Switch **now** to `multi-user.target` and make it the **default**.'],
    [[['Cible par défaut = multi-user.target', 'Default = multi-user', 'Default = multi-user.target'], { type: 'defaultTarget', target: 'multi-user.target' }],
     [['Interface graphique arrêtée (isolate)', 'gdm wa9ef', 'GUI stopped (isolate)'], { type: 'serviceState', service: 'gdm', active: false }]],
    ['systemctl set-default multi-user.target', 'systemctl isolate multi-user.target']),
  ms('m-systemd-enable', ['Services : enable, start, mask', 'Services', 'Services: enable, start, mask'],
    ['Installe le serveur web `httpd`, démarre-le et active-le au démarrage en une commande ; interdis complètement `bluetooth`.', 'httpd enable --now ; mask bluetooth.', 'Install `httpd`, start+enable it in one command; fully forbid `bluetooth`.'],
    [[['httpd installé', 'httpd installé', 'httpd installed'], { type: 'packageInstalled', name: 'httpd', installed: true }],
     [['httpd actif et activé', 'httpd active w enabled', 'httpd active and enabled'], { type: 'serviceState', service: 'httpd', active: true, enabled: true }],
     [['bluetooth masqué', 'bluetooth masqué', 'bluetooth masked'], { type: 'serviceState', service: 'bluetooth', masked: true }]],
    ['dnf install -y httpd', 'systemctl enable --now httpd', 'systemctl mask bluetooth']),
  ms('m-systemd-service', ['Créer le service hello', 'Service hello', 'Create the hello service'],
    ['Crée le script exécutable `/usr/local/bin/hello.sh`, l\'unité `/etc/systemd/system/hello.service` (Description, ExecStart, WantedBy=multi-user.target), recharge systemd, active et démarre le service.', 'Script + unité + daemon-reload + enable --now.', 'Create the executable script, the unit file, reload systemd, enable and start.'],
    [[['Script exécutable (755)', 'Script 755', 'Executable script (755)'], { type: 'mode', path: '/usr/local/bin/hello.sh', mode: '755' }],
     [['Fichier d\'unité présent', 'Unité kayna', 'Unit file present'], { type: 'fileContains', path: '/etc/systemd/system/hello.service', text: 'WantedBy=multi-user.target' }],
     [['hello actif et activé', 'hello active w enabled', 'hello active and enabled'], { type: 'serviceState', service: 'hello', active: true, enabled: true }]],
    ['echo -e "#!/bin/bash\\necho hello" > /usr/local/bin/hello.sh', 'chmod +x /usr/local/bin/hello.sh', 'echo -e "[Unit]\\nDescription=Hello\\n\\n[Service]\\nExecStart=/usr/local/bin/hello.sh\\n\\n[Install]\\nWantedBy=multi-user.target" > /etc/systemd/system/hello.service', 'systemctl daemon-reload', 'systemctl enable --now hello'])
];

setCtx('linux', 'paquets');
const paquets = [
  ms('m-dnf-wireshark', ['Installer wireshark', 'Installi wireshark', 'Install wireshark'],
    ['Essaie d\'installer `/root/rpms/wireshark-3.4.10-7.el9.x86_64.rpm` avec rpm, observe l\'erreur, puis installe wireshark correctement.', 'rpm kayfchel ; dnf.', 'Try rpm, observe the error, then install properly.'],
    [[['wireshark installé', 'wireshark installé', 'wireshark installed'], { type: 'packageInstalled', name: 'wireshark', installed: true }],
     [['Dépendance libpcap installée', 'libpcap installé', 'Dependency libpcap installed'], { type: 'packageInstalled', name: 'libpcap', installed: true }]],
    ['rpm -ivh /root/rpms/wireshark-3.4.10-7.el9.x86_64.rpm', 'dnf install -y wireshark']),
  ms('m-dnf-local-repo', ['Dépôt local', 'Dépôt local', 'Local repository'],
    ['Crée un dépôt local `/var/www/html/mon_depot` contenant `zsh`, déclare-le dans `local.repo`, désactive les deux dépôts Red Hat puis installe zsh.', 'Dépôt local + zsh.', 'Create a local repo with zsh, declare it, disable Red Hat repos, install zsh.'],
    [[['Métadonnées générées (repodata)', 'repodata', 'Metadata generated'], { type: 'pathExists', path: '/var/www/html/mon_depot/repodata', kind: 'dir' }],
     [['local.repo correct', 'local.repo', 'local.repo correct'], { type: 'fileContains', path: '/etc/yum.repos.d/local.repo', text: 'baseurl=file:///var/www/html/mon_depot' }],
     [['Dépôt AppStream désactivé', 'AppStream mtfi', 'AppStream disabled'], { type: 'fileContains', path: '/etc/yum.repos.d/redhat.repo', text: 'enabled = 0' }],
     [['zsh installé', 'zsh installé', 'zsh installed'], { type: 'packageInstalled', name: 'zsh', installed: true }]],
    ['dnf install -y httpd createrepo_c', 'mkdir -p /var/www/html/mon_depot', 'dnf install --downloadonly --downloaddir=/var/www/html/mon_depot -y zsh', 'createrepo /var/www/html/mon_depot', 'echo -e "[local]\\nname=Depot local\\nbaseurl=file:///var/www/html/mon_depot\\ngpgcheck=0\\nenabled=1" > /etc/yum.repos.d/local.repo', 'yum-config-manager --disable rhel-9-for-x86_64-baseos-rpms', 'yum-config-manager --disable rhel-9-for-x86_64-appstream-rpms', 'dnf repolist', 'dnf install -y zsh'])
];

setCtx('linux', 'users');
const users = [
  ms('m-tp5-tp', ['TP5 · Créer l\'utilisateur tp', 'TP5 · Dir tp', 'TP5 · Create user tp'],
    ['Affiche ton identité (`id`, `whoami`), crée l\'utilisateur `tp` avec son répertoire personnel, observe les 4 fichiers de comptes puis donne-lui un mot de passe.', 'id, useradd tp, passwd tp.', 'Show your identity, create `tp` with a home, inspect the account files, set a password.'],
    [[['tp existe (home /home/tp)', 'tp kayn', 'tp exists'], { type: 'userExists', user: 'tp', home: '/home/tp' }],
     [['Groupe privé tp créé', 'Groupe tp', 'Private group tp'], { type: 'groupExists', group: 'tp' }],
     [['/home/tp contient .bashrc (copie de /etc/skel)', '.bashrc f /home/tp', '/home/tp holds .bashrc'], { type: 'pathExists', path: '/home/tp/.bashrc', kind: 'file' }],
     [['Mot de passe défini (plus de !!)', 'Mot de passe t7at', 'Password set'], { type: 'passwordLocked', user: 'tp', locked: false }]],
    ['id', 'whoami', 'useradd tp', 'grep tp /etc/passwd /etc/shadow /etc/group /etc/gshadow', 'ls -la /home/tp', 'passwd tp', 'Rev24#Linux26', 'Rev24#Linux26'], { tp5: [1, 2, 6, 7, 8, 9] }),
  ms('m-tp5-tpsys', ['TP5 · Compte système tpsys', 'TP5 · tpsys', 'TP5 · System account tpsys'],
    ['Crée le compte système `tpsys` et compare son UID et son répertoire avec ceux d\'un compte ordinaire.', 'useradd -r tpsys.', 'Create system account `tpsys` and compare.'],
    [[['tpsys existe avec un UID système (996)', 'tpsys UID 996', 'tpsys exists with system UID (996)'], { type: 'fileLine', path: '/etc/passwd', user: 'tpsys', field: 2, value: '996' }],
     [['Pas de répertoire /home/tpsys', 'Bla /home/tpsys', 'No /home/tpsys'], { type: 'pathExists', path: '/home/tpsys', not: true }]],
    ['useradd -r tpsys', 'id tpsys', 'grep tpsys /etc/passwd', 'ls /home'], { tp5: [10, 11] }),
  ms('m-tp5-skel', ['TP5 · /etc/skel et tmpuser', 'TP5 · skel w tmpuser', 'TP5 · /etc/skel and tmpuser'],
    ['Crée `/etc/skel/bienvenue.txt` (« Bienvenue »), crée `tmpuser` et vérifie qu\'il a reçu ce fichier, puis supprime `tmpuser` **avec** son répertoire.', 'skel → tmpuser → userdel -r.', 'Create the skel file, create tmpuser, check, delete with home.'],
    [[['/etc/skel/bienvenue.txt existe', 'bienvenue.txt f skel', 'skel file exists'], { type: 'fileContains', path: '/etc/skel/bienvenue.txt', text: 'Bienvenue' }],
     [['tmpuser supprimé', 'tmpuser tmse7', 'tmpuser deleted'], { type: 'userAbsent', user: 'tmpuser' }],
     [['/home/tmpuser supprimé', '/home/tmpuser tmse7', '/home/tmpuser removed'], { type: 'pathExists', path: '/home/tmpuser', not: true }]],
    ['echo "Bienvenue" > /etc/skel/bienvenue.txt', 'useradd -m tmpuser', 'cat /home/tmpuser/bienvenue.txt', 'userdel -r tmpuser'], { tp5: [12, 13, 14, 15] }),
  ms('m-tp5-iir', ['TP5 · Groupe IIR', 'TP5 · Groupe IIR', 'TP5 · Group IIR'],
    ['`tp` est déjà dans le groupe `dev`. Crée le groupe `IIR` et ajoutes-y `tp` **sans** lui faire perdre `dev`. Vérifie avec `id`.', 'IIR bla ma ymchi dev.', 'Create `IIR` and add `tp` **without** losing `dev`.'],
    [[['Groupe IIR créé', 'IIR kayn', 'IIR exists'], { type: 'groupExists', group: 'IIR' }],
     [['tp membre de IIR', 'tp f IIR', 'tp in IIR'], { type: 'inGroup', user: 'tp', group: 'IIR' }],
     [['tp toujours membre de dev', 'tp mazal f dev', 'tp still in dev'], { type: 'inGroup', user: 'tp', group: 'dev' }]],
    ['groupadd IIR', 'usermod -aG IIR tp', 'id tp'], { setup: ['useradd tp', 'groupadd dev', 'usermod -aG dev tp'], tp5: [16, 17, 18] }),
  ms('m-tp5-donnees', ['TP5 · /opt/donnees', 'TP5 · /opt/donnees', 'TP5 · /opt/donnees'],
    ['Crée `/opt/donnees`, fais de `tp` son propriétaire, donne les droits **755**, puis mets le groupe `IIR`. Vérifie avec `ls -ld`.', 'mkdir, chown tp, chmod 755, chgrp IIR.', 'Create `/opt/donnees`, owner tp, mode 755, group IIR.'],
    [[['/opt/donnees existe', 'Kayn', 'Exists'], { type: 'pathExists', path: '/opt/donnees', kind: 'dir' }],
     [['Propriétaire tp, groupe IIR', 'tp:IIR', 'Owner tp, group IIR'], { type: 'owner', path: '/opt/donnees', user: 'tp', group: 'IIR' }],
     [['Droits 755 (rwxr-xr-x)', '755', 'Mode 755'], { type: 'mode', path: '/opt/donnees', mode: '755' }]],
    ['mkdir /opt/donnees', 'chown tp /opt/donnees', 'chmod 755 /opt/donnees', 'chgrp IIR /opt/donnees', 'ls -ld /opt/donnees'], { setup: ['useradd tp', 'groupadd IIR'], tp5: [19, 20, 21, 22, 23] }),
  ms('m-tp5-tp1', ['TP5 · L\'utilisateur tp1', 'TP5 · tp1', 'TP5 · User tp1'],
    ['Crée `tp1` : UID **2003**, groupe principal **users**, compte expirant le **31/12/2026**. Ajoute le commentaire « Utilisateur TP1 », donne-lui le shell `/bin/sh` et un mot de passe. Vérifie avec `chage -l`.', 'tp1 : 2003, users, 2026-12-31, commentaire, shell, passwd.', 'Create tp1: UID 2003, group users, expires 2026-12-31; comment, shell /bin/sh, password.'],
    [[['UID 2003, groupe users', 'UID 2003, users', 'UID 2003, group users'], { type: 'userExists', user: 'tp1', uid: 2003, gid: 'users' }],
     [['Expiration 31/12/2026', 'Expiration 2026-12-31', 'Expires 2026-12-31'], { type: 'shadowField', user: 'tp1', field: 'expire', value: '2026-12-31' }],
     [['Commentaire « Utilisateur TP1 »', 'Commentaire', 'Comment set'], { type: 'userExists', user: 'tp1', comment: 'Utilisateur TP1' }],
     [['Shell /bin/sh', 'Shell /bin/sh', 'Shell /bin/sh'], { type: 'userExists', user: 'tp1', shell: '/bin/sh' }],
     [['Mot de passe défini', 'Mot de passe', 'Password set'], { type: 'passwordLocked', user: 'tp1', locked: false }]],
    ['useradd -u 2003 -g users -e 2026-12-31 tp1', 'usermod -c "Utilisateur TP1" tp1', 'usermod -s /bin/sh tp1', 'passwd tp1', PW, PW, 'chage -l tp1'], { tp5: [24, 25, 26, 27, 28] }),
  ms('m-tp5-chage', ['TP5 · Expiration des mots de passe', 'TP5 · Expiration', 'TP5 · Password aging'],
    ['Force `tp1` à changer de mot de passe à la prochaine connexion et désactive son compte 2 jours après expiration. Pour `tp` : validité 90 j, minimum 2 j, avertissement 7 j. Teste ensuite la connexion de tp1 depuis le compte `etudiant` (mot de passe actuel de tp1 : `Tp1pass2026!`).', 'chage tp1 w tp, w testi su - tp1.', 'Force tp1\'s change and 2-day inactivity; tp: 90/2/7. Then test tp1\'s login from `etudiant` (current password `Tp1pass2026!`).'],
    [[['tp1 : inactivité 2 jours', 'tp1 inactif 2', 'tp1: 2 inactive days'], { type: 'shadowField', user: 'tp1', field: 'inactive', value: '2' }],
     [['tp : max 90', 'tp max 90', 'tp: max 90'], { type: 'shadowField', user: 'tp', field: 'max', value: '90' }],
     [['tp : min 2', 'tp min 2', 'tp: min 2'], { type: 'shadowField', user: 'tp', field: 'min', value: '2' }],
     [['tp : avertissement 7', 'tp warn 7', 'tp: warn 7'], { type: 'shadowField', user: 'tp', field: 'warn', value: '7' }],
     [['Connecté en tp1 après changement forcé', 'Dkhalt tp1', 'Logged in as tp1 after forced change'], { type: 'currentUser', user: 'tp1' }]],
    ['chage -d 0 -I 2 tp1', 'chage -M 90 -m 2 -W 7 tp', 'chage -l tp1', 'su - etudiant', 'su - tp1', PW, PW, 'Nouveau#Rev-2026', 'Nouveau#Rev-2026'], { setup: [...withTp1, 'useradd tp'], tp5: [29, 30, 34] }),
  ms('m-tp5-lock', ['TP5 · Verrouiller / déverrouiller', 'TP5 · Sedd / fte7', 'TP5 · Lock / unlock'],
    ['Verrouille `tp1`, vérifie son état (`passwd -S`) et constate qu\'il ne peut plus se connecter, puis déverrouille-le. Le compte `stagiaire`, lui, doit **rester verrouillé**.', 'Sedd tp1, testi, fte7 ; stagiaire yb9a msdoud.', 'Lock tp1, check, see login fail, unlock it; `stagiaire` must stay locked.'],
    [[['stagiaire verrouillé', 'stagiaire msdoud', 'stagiaire locked'], { type: 'passwordLocked', user: 'stagiaire', locked: true }],
     [['tp1 déverrouillé à la fin', 'tp1 mfto7', 'tp1 unlocked at the end'], { type: 'passwordLocked', user: 'tp1', locked: false }]],
    ['passwd -l tp1', 'passwd -S tp1', 'usermod -L stagiaire', 'su - etudiant', 'su - tp1', PW, 'exit', 'passwd -u tp1', 'passwd -S tp1'], { setup: [...withTp1, 'useradd stagiaire', 'echo Stage2026!! | passwd --stdin stagiaire'], tp5: [31, 32, 33] }),
  ms('m-tp5-wheel', ['TP5 · sudo via wheel', 'TP5 · wheel', 'TP5 · sudo via wheel'],
    ['Donne à `tp1` tous les droits sudo grâce au groupe standard, connecte-toi en tp1 et vérifie que `sudo whoami` répond root.', 'wheel + sudo whoami.', 'Give tp1 full sudo via the standard group, log in as tp1 and check `sudo whoami`.'],
    [[['tp1 membre de wheel', 'tp1 f wheel', 'tp1 in wheel'], { type: 'inGroup', user: 'tp1', group: 'wheel' }],
     [['Session tp1 ouverte', 'Session tp1', 'tp1 session open'], { type: 'currentUser', user: 'tp1' }]],
    ['usermod -aG wheel tp1', 'su - tp1', 'sudo whoami', PW], { setup: withTp1, tp5: [36, 37] }),
  ms('m-tp5-sudoers', ['TP5 · Règle sudo restreinte', 'TP5 · sudoers', 'TP5 · Restricted sudo rule'],
    ['Retire `tp1` du groupe wheel, puis, avec `visudo -f /etc/sudoers.d/tp1`, autorise-le **uniquement** à lancer `/usr/sbin/reboot` en root. Vérifie la syntaxe puis, en tp1, affiche tes droits (`sudo -l`).', 'gpasswd -d, visudo -f, sudo -l.', 'Remove tp1 from wheel, allow only reboot via visudo -f, check, `sudo -l` as tp1.'],
    [[['tp1 n\'est plus dans wheel', 'tp1 kharej wheel', 'tp1 no longer in wheel'], { type: 'inGroup', user: 'tp1', group: 'wheel', not: true }],
     [['Règle dans /etc/sudoers.d/tp1', 'Règle kayna', 'Rule in sudoers.d/tp1'], { type: 'fileContains', path: '/etc/sudoers.d/tp1', text: 'tp1 ALL=(root) /usr/sbin/reboot' }],
     [['Session tp1 ouverte', 'Session tp1', 'tp1 session open'], { type: 'currentUser', user: 'tp1' }]],
    ['gpasswd -d tp1 wheel', 'visudo -f /etc/sudoers.d/tp1', 'tp1 ALL=(root) /usr/sbin/reboot', ':wq', 'visudo -c', 'su - tp1', 'sudo -l', PW], { setup: [...withTp1, 'usermod -aG wheel tp1'], tp5: [38, 39, 40, 41] }),
  ms('m-tp5-cleanup', ['TP5 · Nettoyage final', 'TP5 · Tnqiya', 'TP5 · Final cleanup'],
    ['Renomme le groupe `IIR` en `4IIR`. Supprime `tp1` **sans** son répertoire puis retrouve et supprime ses fichiers restants (UID 2003). Enfin supprime `tp` (avec son home), `tpsys` et le groupe `4IIR`.', 'groupmod, userdel, find -uid, cleanup.', 'Rename IIR to 4IIR, delete tp1 keeping its home, remove its leftover files (UID 2003), then delete tp, tpsys and 4IIR.'],
    [[['Fichier /tmp/rapport_tp1 supprimé', 'rapport_tp1 tmse7', '/tmp/rapport_tp1 removed'], { type: 'pathExists', path: '/tmp/rapport_tp1', not: true }],
     [['/home/tp1 conservé', '/home/tp1 b9a', '/home/tp1 kept'], { type: 'pathExists', path: '/home/tp1', kind: 'dir' }],
     [['tp1, tp et tpsys supprimés', 'tp1, tp, tpsys tmse7ou', 'tp1, tp, tpsys deleted'], { type: 'userAbsent', user: 'tpsys' }],
     [['tp supprimé avec son home', 'tp w home', 'tp deleted with home'], { type: 'pathExists', path: '/home/tp', not: true }],
     [['Groupe 4IIR supprimé', '4IIR tmse7', '4IIR deleted'], { type: 'groupAbsent', group: '4IIR' }],
     [['Groupe IIR renommé (n\'existe plus)', 'IIR tbeddel', 'IIR renamed'], { type: 'groupAbsent', group: 'IIR' }]],
    ['groupmod -n 4IIR IIR', 'userdel tp1', 'find / -type f -uid 2003 -print -exec rm {} \\;', 'userdel -r tp', 'userdel tpsys', 'groupdel 4IIR'],
    { setup: ['useradd tp', 'useradd -u 2003 tp1', 'useradd -r tpsys', 'groupadd IIR', 'usermod -aG IIR tp', 'touch /tmp/rapport_tp1', 'chown tp1 /tmp/rapport_tp1'], tp5: [42, 43, 44] })
];

export const missions: Mission[] = [...tp1, ...grub, ...systemd, ...paquets, ...users];
