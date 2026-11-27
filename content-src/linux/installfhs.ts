import { setCtx, L, h, p, code, key, plain, tip, trap, exam, def, table, anim, quiz, single, multi, cmd, ex, fc, ref } from '../lib';
import type { Chapter } from '../../src/lib/schema';

/**
 * CC (Pr Zbakh): Installation + FHS. Source: course "Chapitre 1 — Introduction et installation" (slides 47–83)
 * and TP1 (parts 1 and 3). Partition sizes are the ones of the slides and of the TP1 100 GB scheme.
 */
setCtx('linux', 'install-fhs');

export const questions = [
  single('lf-01', 1, ['Pourquoi Red Hat a-t-il créé Fedora ?', '3lach Red Hat dar Fedora ?', 'Why did Red Hat create Fedora?'],
    [['Comme laboratoire communautaire : les nouveautés y sont testées avant d\'entrer dans RHEL', 'Laboratoire communautaire : jdid kayt-testa tma 9bel RHEL', 'As a community lab: new features are tested there before reaching RHEL'], ['Pour remplacer RHEL', 'Bach t3awed RHEL', 'To replace RHEL'], ['Pour les serveurs uniquement', 'Ghir l serveurs', 'For servers only'], ['Parce que RHEL est fermé', '7it RHEL msdoud', 'Because RHEL is closed source']], 0,
    ['RHEL n\'est pas livrée gratuitement en binaire. **Fedora** est la distribution communautaire qui sert de **laboratoire** : les fonctionnalités y sont développées puis intégrées plus tard à RHEL.', 'RHEL ma katjich gratuite. **Fedora** hiya **laboratoire** dyal RHEL.', 'RHEL binaries are not free. **Fedora** is the community **lab** whose features later reach RHEL.'],
    [['Fedora ne remplace pas RHEL : elle la précède.', 'Fedora kat-sbe9 RHEL, ma kat3awedhach.', 'Fedora precedes RHEL, it does not replace it.'], ['Fedora est une distribution généraliste (postes et serveurs).', 'Fedora 3amma.', 'Fedora is general purpose.'], ['Les sources de RHEL sont libres et accessibles (d\'où CentOS).', 'Sources dyal RHEL m7loulin (CentOS).', 'RHEL sources are open (hence CentOS).']], ['installation']),
  single('lf-02', 1, ['Configuration minimale indiquée dans le cours pour installer RHEL 9 ?', 'Configuration minimale dyal RHEL 9 f cours ?', 'Minimum configuration for RHEL 9 in the course?'],
    [['Processeur 64 bits, 1 Go de RAM (2 Go recommandés), 10 Go de disque (20 Go recommandés)', '64 bits, 1 Go RAM (2 recommandés), 10 Go disque (20 recommandés)', '64-bit CPU, 1 GB RAM (2 recommended), 10 GB disk (20 recommended)'], ['32 bits, 512 Mo, 4 Go', '32 bits, 512 Mo, 4 Go', '32-bit, 512 MB, 4 GB'], ['64 bits, 8 Go RAM, 100 Go', '64 bits, 8 Go, 100 Go', '64-bit, 8 GB, 100 GB'], ['Aucune contrainte', 'Walou', 'No constraint']], 0,
    ['Slide « Configuration requise » : **64 bits**, **1 Go** de RAM (2 Go ou plus recommandés), **10 Go** de disque (20 Go ou plus recommandés). Le TP1 utilise une VM plus confortable : 2 vCPU, 4 Go, 100 Go.', '**64 bits**, **1 Go** RAM (2 recommandés), **10 Go** disque (20 recommandés). TP1 : 2 vCPU, 4 Go, 100 Go.', '**64-bit**, **1 GB** RAM (2+ recommended), **10 GB** disk (20+ recommended). TP1 VM: 2 vCPU, 4 GB, 100 GB.'],
    [['RHEL 9 n\'existe qu\'en 64 bits.', 'RHEL 9 ghir 64 bits.', 'RHEL 9 is 64-bit only.'], ['C\'est la VM du TP (confortable), pas le minimum.', 'Hadi VM dyal TP, machi minimum.', 'That is the TP VM, not the minimum.'], ['Il y a un minimum.', 'Kayn minimum.', 'There is a minimum.']], ['installation']),
  multi('lf-03', 2, ['Quelles partitions le cours recommande-t-il au minimum ?', 'Ach men partitions kay-recommandi cours ?', 'Which partitions does the course recommend at least?'],
    [['/', '/', '/'], ['/home', '/home', '/home'], ['/boot', '/boot', '/boot'], ['/boot/efi (UEFI)', '/boot/efi (UEFI)', '/boot/efi (UEFI)'], ['swap', 'swap', 'swap'], ['/proc', '/proc', '/proc']], [0, 1, 2, 3, 4],
    ['« L\'installation nécessite au moins une partition, mais on recommande au moins : **/**, **/home**, **/boot**, **/boot/efi** et **swap**. » `/proc` est un système de fichiers **virtuel** créé par le noyau : on ne le partitionne pas.', '**/**, **/home**, **/boot**, **/boot/efi**, **swap**. `/proc` virtuel.', '**/**, **/home**, **/boot**, **/boot/efi**, **swap**. `/proc` is virtual.'],
    [['/proc est virtuel (créé en mémoire par le noyau), jamais une partition.', '/proc virtuel.', '/proc is virtual, never a partition.']], ['partitionnement']),
  single('lf-04', 2, ['Quelle taille recommandée pour /boot sur RHEL 9 ?', 'Ch7al l /boot ?', 'Recommended size for /boot on RHEL 9?'],
    [['Au moins 1 Gio', '1 Gio 3la l a9al', 'At least 1 GiB'], ['100 Mio', '100 Mio', '100 MiB'], ['10 Gio', '10 Gio', '10 GiB'], ['Égale à la RAM', 'Kif RAM', 'Same as RAM']], 0,
    ['/boot contient le **noyau** (vmlinuz) et l\'**initramfs** de chaque version installée : **au moins 1 Gio**, partition **séparée obligatoire**.', '/boot = noyau + initramfs : **1 Gio** 3la l a9al, séparée.', '/boot holds kernels and initramfs: **at least 1 GiB**, separate.'],
    [['Trop petit : plusieurs noyaux + initramfs ne tiennent pas.', 'Sghira bzaf.', 'Too small.'], ['C\'est la taille conseillée pour / (racine).', 'Hadi dyal /.', 'That is the size for /.'], ['C\'est la règle (ancienne) du swap.', 'Hadi dyal swap.', 'That is the (old) swap rule.']], ['partitionnement']),
  single('lf-05', 2, ['Pourquoi séparer /home de / ?', '3lach nfr9ou /home 3la / ?', 'Why separate /home from /?'],
    [['Séparer données système et utilisateurs : réinstaller / mettre à jour le système sans perdre les données', 'Nfr9ou système w data : nbeddlou système bla ma ntelfou data', 'Separate system and user data: reinstall/upgrade without losing data'], ['C\'est obligatoire pour démarrer', 'Darouri l démarrage', 'Required to boot'], ['Pour accélérer le noyau', 'Bach noyau ykoun sri3', 'To speed up the kernel'], ['Pour que root ait un dossier', 'Bach root y3ndou dossier', 'So root has a folder']], 0,
    ['Slide : « Séparation données système/utilisateurs — permet upgrades **sans perte de données** ». Si / est réinstallée ou pleine, /home reste intacte.', '**Bla ma ntelfou data** mli nbeddlou système.', 'Upgrades **without data loss**.'],
    [['Le système démarre avec une seule partition /.', 'Système kaybda b / wa7da.', 'The system boots with / only.'], ['Aucun rapport avec le noyau.', 'Ma 3ndha 3la9a.', 'Unrelated to the kernel.'], ['Le dossier de root est /root, dans /.', '/root f /.', 'root\'s home is /root, inside /.']], ['partitionnement']),
  single('lf-06', 1, ['Ne pas confondre : que désigne /root ?', 'Ma tkhaltch : /root chnou ?', 'Don\'t mix up: what is /root?'],
    [['Le répertoire personnel de l\'administrateur root', 'Dossier personnel dyal root', 'The root user\'s home directory'], ['La racine du système de fichiers', 'Racine dyal système', 'The filesystem root'], ['La partition de démarrage', 'Partition démarrage', 'The boot partition'], ['Le dossier des commandes', 'Dossier commandes', 'The commands folder']], 0,
    ['**/** (slash) est la **racine** de l\'arborescence ; **/root** est le **home de l\'utilisateur root** (accessible à root seulement). Le cours le souligne : « Ne pas confondre avec /root ».', '**/** = racine ; **/root** = home dyal root.', '**/** is the root of the tree; **/root** is root\'s home.'],
    [['La racine, c\'est /.', 'Racine = /.', 'The root is /.'], ['C\'est /boot.', '/boot.', 'That is /boot.'], ['Ce sont /bin et /usr/bin.', '/bin w /usr/bin.', 'That is /bin and /usr/bin.']], ['fhs']),
  single('lf-07', 1, ['Que signifie FHS ?', 'FHS chnou ?', 'What does FHS stand for?'],
    [['Filesystem Hierarchy Standard', 'Filesystem Hierarchy Standard', 'Filesystem Hierarchy Standard'], ['File Hosting Service', 'File Hosting Service', 'File Hosting Service'], ['Fast Hard-disk System', 'Fast Hard-disk System', 'Fast Hard-disk System'], ['Filesystem Home Structure', 'Filesystem Home Structure', 'Filesystem Home Structure']], 0,
    ['**Filesystem Hierarchy Standard** : norme qui définit l\'arborescence et le contenu des principaux répertoires des systèmes GNU/Linux et de la plupart des Unix. Version actuelle : **3.0 (juin 2015)**.', '**Filesystem Hierarchy Standard**, version **3.0 (2015)**.', '**Filesystem Hierarchy Standard**, version **3.0 (2015)**.'],
    [['Hors sujet.', 'Machi hadi.', 'Off topic.'], ['Inventé.', 'Mkhtar3.', 'Made up.'], ['Presque, mais H = Hierarchy.', 'H = Hierarchy.', 'H = Hierarchy.']], ['fhs']),
  single('lf-08', 2, ['Où se trouvent les fichiers de configuration du système ?', 'Fin kaynin fichiers dyal configuration ?', 'Where are the system configuration files?'],
    [['/etc', '/etc', '/etc'], ['/var', '/var', '/var'], ['/usr', '/usr', '/usr'], ['/opt', '/opt', '/opt']], 0,
    ['**/etc** : configuration du système (ex. `/etc/passwd`, `/etc/fstab`, `/etc/hostname`, `/etc/default/grub`, `/etc/ssh/`).', '**/etc** = configuration.', '**/etc** = configuration.'],
    [['/var : données variables (logs, cache, spool).', '/var = data li katbeddel.', '/var: variable data.'], ['/usr : programmes et bibliothèques (lecture seule).', '/usr = programmes.', '/usr: programs.'], ['/opt : logiciels additionnels.', '/opt = logiciels zayda.', '/opt: add-on software.']], ['fhs']),
  single('lf-09', 2, ['Où sont écrits les journaux (logs) du système ?', 'Fin kaytktbou logs ?', 'Where are system logs written?'],
    [['/var/log', '/var/log', '/var/log'], ['/etc/log', '/etc/log', '/etc/log'], ['/tmp/log', '/tmp/log', '/tmp/log'], ['/proc/log', '/proc/log', '/proc/log']], 0,
    ['**/var** = données **variables** : `/var/log` (journaux), `/var/cache` (cache, ex. dnf), `/var/spool` (files d\'attente), `/var/www`… D\'où l\'intérêt d\'une partition /var séparée sur un serveur : des logs qui gonflent ne remplissent pas /.', '**/var/log**. /var séparée bach logs ma y3emrouch /.', '**/var/log**. A separate /var keeps logs from filling /.'],
    [['/etc ne contient que de la configuration.', '/etc = config.', '/etc is config only.'], ['/tmp est vidé au redémarrage.', '/tmp kaytkhwa.', '/tmp is cleared at reboot.'], ['/proc est virtuel (processus, noyau).', '/proc virtuel.', '/proc is virtual.']], ['fhs']),
  single('lf-10', 2, ['Que représentent les fichiers de /dev ?', 'Chnou houma fichiers dyal /dev ?', 'What do the files in /dev represent?'],
    [['Les périphériques (disques, terminaux…) sous forme de fichiers spéciaux', 'Périphériques f chkl fichiers spéciaux', 'Devices (disks, terminals…) as special files'], ['Les programmes en développement', 'Programmes f développement', 'Programs under development'], ['Les fichiers supprimés', 'Fichiers mms7in', 'Deleted files'], ['La documentation', 'Documentation', 'Documentation']], 0,
    ['« Tout est fichier » : `/dev/sda` (1er disque), `/dev/sda1` (1re partition), `/dev/nvme0n1`, `/dev/tty1`, `/dev/null` (poubelle), `/dev/zero`…', '« Kolchi fichier » : /dev/sda, /dev/null…', '"Everything is a file": /dev/sda, /dev/null…'],
    [['« dev » = devices, pas development.', 'dev = devices.', 'dev = devices.'], ['Il n\'y a pas de corbeille système.', 'Ma kaynach corbeille.', 'No system trash.'], ['La doc est dans /usr/share/doc et man.', 'Doc f /usr/share/doc.', 'Docs are in /usr/share/doc.']], ['fhs']),
  single('lf-11', 2, ['Que contient /proc ?', 'Chnou kayn f /proc ?', 'What is in /proc?'],
    [['Un système de fichiers virtuel : informations sur les processus et le noyau, en mémoire', 'Système virtuel : processus w noyau, f mémoire', 'A virtual filesystem: process and kernel information, in memory'], ['Les programmes installés', 'Programmes', 'Installed programs'], ['Les fichiers de démarrage', 'Fichiers démarrage', 'Boot files'], ['Les home des utilisateurs', 'Home dyal users', 'User homes']], 0,
    ['/proc n\'existe pas sur le disque : le noyau le crée **en mémoire**. Un dossier par PID (`/proc/1` = systemd), plus `/proc/cpuinfo`, `/proc/meminfo`, `/proc/version`…', '/proc f **mémoire** : /proc/<PID>, cpuinfo, meminfo.', '/proc lives **in memory**: /proc/<PID>, cpuinfo, meminfo.'],
    [['Les programmes sont dans /usr/bin.', '/usr/bin.', 'Programs are in /usr/bin.'], ['C\'est /boot.', '/boot.', 'That is /boot.'], ['C\'est /home.', '/home.', 'That is /home.']], ['fhs']),
  single('lf-12', 2, ['Quelle différence entre /mnt et /media ?', 'Far9 bin /mnt w /media ?', 'Difference between /mnt and /media?'],
    [['/media : montage automatique des supports amovibles (USB, DVD) ; /mnt : montages temporaires faits à la main par l\'admin', '/media = amovibles automatique ; /mnt = montage manuel', '/media: automatic removable media; /mnt: manual temporary mounts'], ['Aucune', 'Walou', 'None'], ['/mnt est pour les utilisateurs, /media pour root', '/mnt users, /media root', '/mnt for users, /media for root'], ['/media contient les vidéos', '/media = vidéos', '/media holds videos']], 0,
    ['Clé USB branchée → montée automatiquement sous **/media/<user>/<label>** (ou /run/media sur RHEL). **/mnt** sert aux montages ponctuels faits par l\'administrateur (`mount /dev/sdb1 /mnt`).', '/media automatique ; /mnt manuel.', '/media automatic; /mnt manual.'],
    [['Les deux ont un usage différent.', 'Kayn far9.', 'They differ.'], ['Ce n\'est pas une question de droits.', 'Machi droits.', 'Not about permissions.'], ['« media » = supports amovibles.', 'media = amovibles.', '"media" = removable media.']], ['fhs']),
  single('lf-13', 2, ['Que devient le contenu de /tmp après un redémarrage ?', 'Chnou kaywli /tmp mor redémarrage ?', 'What happens to /tmp after a reboot?'],
    [['Il est effacé (fichiers temporaires)', 'Kaytmse7', 'It is wiped'], ['Il est sauvegardé dans /var', 'Kayt-sauvegarda f /var', 'Saved to /var'], ['Il est déplacé dans /home', 'Kaymchi /home', 'Moved to /home'], ['Rien ne change', 'Walou', 'Nothing changes']], 0,
    ['/tmp = fichiers **temporaires**, accessibles en écriture par tous (sticky bit `t` : chacun ne supprime que ses fichiers). Sur RHEL 9 il est nettoyé au démarrage / périodiquement (`systemd-tmpfiles`). Pour des temporaires qui survivent : **/var/tmp**.', '/tmp **temporaire**, kaytmse7. Li bghiti yb9a : /var/tmp.', '/tmp is **temporary**, wiped. Persistent temps: /var/tmp.'],
    [['/var/tmp est un autre dossier, rien n\'y est copié.', '/var/tmp dossier akhor.', '/var/tmp is separate.'], ['Non.', 'La.', 'No.'], ['Il est vidé.', 'Kaytkhwa.', 'It is emptied.']], ['fhs']),
  cmd('lf-14', 1, ['Affiche les partitions et disques sous forme d\'arbre (taille, point de montage).', 'Werri disques w partitions b chkl chajara.', 'Show disks and partitions as a tree (size, mount point).'],
    ['lsblk', 'lsblk -f'], ['`lsblk` affiche les disques (`sda`, `nvme0n1`), leurs partitions et volumes LVM (`rhel-root`, `rhel-home`, `rhel-swap`) avec taille et **point de montage**. `lsblk -f` ajoute le type de système de fichiers (xfs, vfat, swap).', '`lsblk` = disques + partitions + montage.', '`lsblk` = disks, partitions, mount points.'],
    { 'fdisk -l': ['Fonctionne (en root), mais n\'affiche pas les points de montage.', 'Bla points de montage.', 'No mount points.'], 'df -h': ['Montre l\'espace utilisé des systèmes **montés**, pas l\'arbre des disques.', 'Espace utilisé ghir.', 'Shows used space only.'] }, ['partitionnement']),
  cmd('lf-15', 1, ['Affiche l\'espace disque utilisé et libre de chaque système de fichiers monté, en unités lisibles.', 'Werri espace mst3mel w khawi b unités wad7in.', 'Show used and free space of each mounted filesystem in human units.'],
    ['df -h', 'df -hT', 'df -Th'], ['`df -h` (human) : taille, utilisé, disponible et % pour /, /home, /boot, /var… `-T` ajoute le type (xfs).', '`df -h`.', '`df -h`.'],
    { 'du -sh': ['du mesure la taille d\'un dossier, pas l\'espace libre des partitions.', 'du = taille dossier.', 'du measures a folder.'], 'df': ['Sans -h, les tailles sont en blocs de 1 Ko.', 'Bla -h, blocs.', 'Without -h, 1K blocks.'] }, ['partitionnement']),
  single('lf-16', 3, ['Sur RHEL 9, que constate-t-on avec `ls -ld /bin /sbin /lib` ?', 'F RHEL 9, `ls -ld /bin /sbin /lib` chnou kaywerri ?', 'On RHEL 9, what does `ls -ld /bin /sbin /lib` show?'],
    [['Ce sont des liens symboliques vers /usr/bin, /usr/sbin et /usr/lib', 'Liens symboliques l /usr/bin, /usr/sbin, /usr/lib', 'Symlinks to /usr/bin, /usr/sbin, /usr/lib'], ['Ce sont des partitions', 'Partitions', 'Partitions'], ['Ils sont vides', 'Khawyin', 'Empty'], ['Ils n\'existent pas', 'Ma kaynin', 'They don\'t exist']], 0,
    ['RHEL 9 applique la fusion **/usr** (« usrmerge ») : `/bin -> usr/bin`, `/sbin -> usr/sbin`, `/lib -> usr/lib`, `/lib64 -> usr/lib64`. Le rôle FHS reste le même : /bin = commandes de base pour tous, /sbin = commandes d\'administration.', 'RHEL 9 : `/bin -> usr/bin` (usrmerge). Rôle FHS nefso.', 'RHEL 9 merged /usr: `/bin -> usr/bin`. Same FHS role.'],
    [['Pas des partitions : des liens (l en tête de ls -l).', 'Liens (l).', 'Symlinks (l).'], ['Ils pointent vers des dossiers pleins de commandes.', 'Fihom commandes.', 'They point to full folders.'], ['Ils existent (en tant que liens).', 'Kaynin (liens).', 'They exist (as links).']], ['fhs'])
];

export const exercises = [
  ex('lx-f-1', 2, ['Partitionner un disque de 100 Go (schéma du TP1)', 'Partitionner disque 100 Go (TP1)', 'Partition a 100 GB disk (TP1 scheme)'],
    ['Pendant l\'installation de RHEL 9 sur une VM UEFI avec un disque de **100 Go**, vous choisissez le partitionnement manuel. 1) Donnez le schéma du TP1 (point de montage et taille). 2) Justifiez chaque partition. 3) Quelle partition faut-il en plus en UEFI et quel est son système de fichiers ? 4) Vérifiez le résultat après installation.',
     'Installation RHEL 9 f VM UEFI b disque **100 Go**, partitionnement manuel. 1) Schéma dyal TP1. 2) 3lach kol partition. 3) Partition zayda f UEFI w système dyalha ? 4) T2akked mor installation.',
     'Installing RHEL 9 on a UEFI VM with a **100 GB** disk, manual partitioning. 1) TP1 scheme. 2) Justify each. 3) Extra partition for UEFI and its filesystem? 4) Check after install.'],
    [['Repartis comme le TP : petites partitions de démarrage, / confortable, la plus grosse part pour /home.', 'B7al TP : démarrage sghar, / mzyana, /home kbira.', 'Like the TP: small boot partitions, a roomy /, most for /home.']],
    [{ t: ['1) Schéma', '1) Schéma', '1) Scheme'], b: ['/boot **1 Go** · /boot/efi **1 Go** · / **20 Go** · /home **50 Go** · /var **24 Go** · swap **4 Go** (total 100 Go).', '/boot 1 · /boot/efi 1 · / 20 · /home 50 · /var 24 · swap 4.', '/boot 1 · /boot/efi 1 · / 20 · /home 50 · /var 24 · swap 4.'] },
     { t: ['2) Justification', '2) 3lach', '2) Why'], b: ['/boot : noyaux + initramfs (≥ 1 Gio, séparée). / : système (≥ 10 Gio). /home : données utilisateurs, conservées lors d\'une réinstallation. /var : logs, cache, paquets — un serveur web/BD y écrit beaucoup. swap : mémoire virtuelle (selon la RAM).', '/boot noyaux ; / système ; /home data ; /var logs ; swap mémoire virtuelle.', '/boot kernels; / system; /home data; /var logs; swap virtual memory.'] },
     { t: ['3) UEFI', '3) UEFI', '3) UEFI'], b: ['**/boot/efi** = partition système EFI (**ESP**), en **FAT32 (vfat)**, qui contient `EFI/redhat/grubx64.efi`. 200 Mo suffisent (taille par défaut du partitionnement automatique), le TP en met 1 Go.', '**/boot/efi** (ESP) f **vfat**.', '**/boot/efi** (ESP) in **vfat**.'] },
     { t: ['4) Vérification', '4) T2akked', '4) Check'], b: ['Arbre des disques et montages, puis espace utilisé.', 'lsblk w df -h.', 'lsblk and df -h.'], code: 'lsblk -f\ndf -hT\ncat /etc/fstab\nswapon --show' }],
    ['/boot 1 Go, /boot/efi 1 Go (vfat, UEFI), / 20 Go, /home 50 Go, /var 24 Go, swap 4 Go ; vérification lsblk -f, df -hT, /etc/fstab, swapon --show.', '1/1/20/50/24/4 Go ; lsblk, df -h.', '1/1/20/50/24/4 GB; lsblk, df -h.'],
    [['Oublier /boot/efi sur une machine UEFI : le système ne démarre pas.', 'Nsiti /boot/efi f UEFI.', 'Forgetting /boot/efi on UEFI.'], ['Confondre / et /root.', 'Khalti / w /root.', 'Mixing up / and /root.']]),
  ex('lx-f-2', 2, ['FHS : où trouver quoi ?', 'FHS : fin kayn chnou ?', 'FHS: where is what?'],
    ['Pour chaque besoin, donnez le répertoire FHS et un exemple : a) modifier le nom de la machine ; b) lire les logs d\'Apache ; c) trouver le noyau ; d) une commande de base utilisable par tous ; e) une commande d\'administration ; f) le disque comme fichier ; g) les infos CPU ; h) monter une clé USB à la main ; i) installer un logiciel tiers ; j) les fichiers temporaires.',
     'L kol 7aja, 3ti répertoire FHS w mithal : a) smiya dyal machine ; b) logs Apache ; c) noyau ; d) commande de base ; e) commande admin ; f) disque ka fichier ; g) infos CPU ; h) monter USB b yeddek ; i) logiciel tiers ; j) temporaires.',
     'For each need give the FHS directory and an example: a) hostname; b) Apache logs; c) kernel; d) basic command; e) admin command; f) disk as a file; g) CPU info; h) mount a USB stick by hand; i) third-party software; j) temporary files.'],
    [['Pense « Tout est fichier » et à la règle : config = /etc, variable = /var, programmes = /usr.', 'Config = /etc, variable = /var, programmes = /usr.', 'Config = /etc, variable = /var, programs = /usr.']],
    [{ t: ['Réponses', 'Jawabat', 'Answers'], b: ['a) **/etc/hostname** (ou `hostnamectl`) · b) **/var/log/httpd/** · c) **/boot/vmlinuz-…** · d) **/bin** (→ /usr/bin) : ls, cp · e) **/sbin** (→ /usr/sbin) : fdisk, useradd · f) **/dev/sda** · g) **/proc/cpuinfo** · h) **/mnt** : `mount /dev/sdb1 /mnt` · i) **/opt** · j) **/tmp** (ou /var/tmp pour survivre au redémarrage).', 'a) /etc/hostname · b) /var/log/httpd · c) /boot · d) /bin · e) /sbin · f) /dev/sda · g) /proc/cpuinfo · h) /mnt · i) /opt · j) /tmp.', 'a) /etc/hostname · b) /var/log/httpd · c) /boot · d) /bin · e) /sbin · f) /dev/sda · g) /proc/cpuinfo · h) /mnt · i) /opt · j) /tmp.'], code: 'cat /etc/hostname\nls /var/log/\nls /boot\nls -ld /bin /sbin\nls -l /dev/sda*\nhead /proc/cpuinfo' }],
    ['/etc, /var/log, /boot, /bin, /sbin, /dev, /proc, /mnt, /opt, /tmp.', 'etc, var/log, boot, bin, sbin, dev, proc, mnt, opt, tmp.', 'etc, var/log, boot, bin, sbin, dev, proc, mnt, opt, tmp.'],
    [['Mettre la config dans /var ou les logs dans /etc.', 'Config f /var.', 'Config in /var.'], ['Chercher le noyau dans /bin.', 'Noyau f /bin.', 'Kernel in /bin.']]),
  ex('lx-f-3', 3, ['Pourquoi un serveur a-t-il besoin de /var séparé ?', '3lach serveur khasso /var séparé ?', 'Why does a server need a separate /var?'],
    ['Un serveur web RHEL 9 n\'a qu\'une partition / de 20 Go. Après quelques semaines, plus personne ne peut se connecter et les services plantent. `df -h` montre / à 100 %. 1) Quelle est la cause probable ? 2) Où regarder ? 3) Quelle décision de partitionnement aurait évité le problème ?',
     'Serveur web RHEL 9 b / wa7da 20 Go. Mor chi simanat, ta wa7ed ma y9der ydkhol. `df -h` : / 100 %. 1) Sbab ? 2) Fin tchouf ? 3) Partitionnement li kan ghadi ymne3 hadchi ?',
     'A RHEL 9 web server has only a 20 GB /. After weeks, logins fail and services crash; / is 100 % full. 1) Likely cause? 2) Where to look? 3) Which partitioning choice would have avoided it?'],
    [['Ce qui grossit tout seul sur un serveur : les journaux et les caches.', 'Chnou kaykber wa7do : logs w cache.', 'What grows by itself: logs and caches.']],
    [{ t: ['1–2) Cause', '1–2) Sbab', '1–2) Cause'], b: ['Les **logs** (/var/log) et caches (/var/cache) ont rempli /. On le confirme en mesurant les gros dossiers.', '**Logs** w cache 3emrou /.', '**Logs** and caches filled /.'], code: 'df -h /\ndu -sh /var/* 2>/dev/null | sort -h | tail\njournalctl --disk-usage' },
     { t: ['3) Prévention', '3) Prévention', '3) Prevention'], b: ['Une partition **/var séparée** (le cours : « critique pour serveurs web », au moins 5 Go) : si les logs la remplissent, / et /home continuent de fonctionner.', '**/var séparée** : ila t3emrat, / w /home khddamin.', 'A **separate /var**: if logs fill it, / and /home keep working.'] }],
    ['Cause : /var (logs, cache) a rempli / ; diagnostic df -h + du -sh /var/* ; solution : partition /var séparée (≥ 5 Go, plus sur un serveur web).', '/var 3emrat / ; /var séparée.', '/var filled /; separate /var.'],
    [['Supprimer des fichiers dans /usr ou /etc au hasard.', 'Tms7 f /usr wla /etc.', 'Deleting things in /usr or /etc.']])
];

export const flashcards = [
  fc('fc-lf-1', ['FHS ?', 'FHS ?', 'FHS?'], ['Filesystem Hierarchy Standard, v3.0 (2015)', 'Filesystem Hierarchy Standard 3.0', 'Filesystem Hierarchy Standard 3.0'])
];

export const reference = [
  ref('r-fhs-1', '/boot ≥1 Gio · / ≥10 Gio · /home ≥1 Gio · swap selon RAM · /var ≥5 Go · /boot/efi 200 Mo (UEFI)', ['Partitionnement recommandé (cours)', 'Partitions recommandées', 'Recommended partitions']),
  ref('r-fhs-2', 'TP1 (100 Go) : /boot 1 · /boot/efi 1 · / 20 · /home 50 · /var 24 · swap 4', ['Schéma du TP1', 'Schéma TP1', 'TP1 scheme']),
  ref('r-fhs-3', 'lsblk -f · df -hT · cat /etc/fstab · swapon --show', ['Vérifier disques, montages et swap', 'Disques w montages', 'Check disks, mounts, swap']),
  ref('r-fhs-4', '/etc config · /var variable · /usr programmes · /dev périphériques · /proc noyau', ['FHS en une ligne', 'FHS', 'FHS in one line'])
];

export const chapter: Chapter = {
  id: 'install-fhs',
  module: 'linux',
  order: 1.5,
  title: L(['Chap 1 — Installation de RHEL 9 et FHS', 'Fasl 1 — Installation dyal RHEL 9 w FHS', 'Ch. 1 — Installing RHEL 9 and the FHS']),
  summary: L([
    'Au CC : RHEL, Fedora et CentOS, configuration requise, partitionnement recommandé (/boot, /, /home, swap, /var, /boot/efi), schéma du TP1, et la norme FHS répertoire par répertoire.',
    'F CC : RHEL, Fedora, CentOS, configuration, partitions (/boot, /, /home, swap, /var, /boot/efi), schéma TP1, w FHS répertoire b répertoire.',
    'In the test: RHEL, Fedora and CentOS, requirements, recommended partitioning, the TP1 scheme, and the FHS directory by directory.'
  ]),
  estimatedMinutes: 40,
  sections: [
    key([
      '1. **RHEL** = distribution entreprise (payante en binaire, sources libres → **CentOS**) ; **Fedora** = son laboratoire communautaire.\n2. Minimum : **64 bits, 1 Go RAM (2 recommandés), 10 Go disque (20 recommandés)**.\n3. Partitions recommandées : **/**, **/home**, **/boot**, **/boot/efi** (UEFI) et **swap** ; en option **/var** et **/usr**.\n4. **FHS 3.0 (2015)** : une seule arborescence qui part de **/** ; **tout est fichier**.\n5. Règle d\'or : **/etc** = configuration, **/var** = données variables, **/usr** = programmes, **/dev** = périphériques, **/proc** = noyau en mémoire.',
      '1. **RHEL** = entreprise (sources libres → **CentOS**) ; **Fedora** = laboratoire.\n2. Minimum : **64 bits, 1 Go RAM, 10 Go disque**.\n3. Partitions : **/**, **/home**, **/boot**, **/boot/efi**, **swap** ; option **/var**, **/usr**.\n4. **FHS 3.0** : chajara wa7da mn **/** ; **kolchi fichier**.\n5. **/etc** config, **/var** variable, **/usr** programmes, **/dev** périphériques, **/proc** noyau.',
      '1. **RHEL** = enterprise (open sources → **CentOS**); **Fedora** = its lab.\n2. Minimum: **64-bit, 1 GB RAM, 10 GB disk**.\n3. Partitions: **/**, **/home**, **/boot**, **/boot/efi**, **swap**; optional **/var**, **/usr**.\n4. **FHS 3.0**: one tree from **/**; **everything is a file**.\n5. **/etc** config, **/var** variable, **/usr** programs, **/dev** devices, **/proc** kernel.'
    ]),
    p(['[Fiche PDF des commandes du CC à imprimer](/docs/linux-cc-commandes.pdf) (documents papier autorisés)', '[Fiche PDF dyal commandes](/docs/linux-cc-commandes.pdf) (documents autorisés)', '[Printable command sheet (PDF)](/docs/linux-cc-commandes.pdf) (paper documents allowed)']),
    p(['[Cours expliqué + questions-réponses du CC en PDF (26 pages, chaque commande commentée)](/docs/linux-cc-cours-qr.pdf)', '[Cours mcharr7 + questions w ajwiba dyal CC (PDF, 26 pages)](/docs/linux-cc-cours-qr.pdf)', '[Explained course + test Q&A (PDF, 26 pages)](/docs/linux-cc-cours-qr.pdf)']),
    exam(['CC : **documents papier autorisés**. Le correcteur attend donc des réponses **justifiées et appliquées** (un schéma de partitions argumenté, le bon répertoire avec un exemple, la bonne commande), pas une définition recopiée.', 'CC : **documents autorisés** : jawab **mbarer w mtab9** (schéma m3allel, répertoire + mithal, commande), machi définition mnsoukha.', 'Test: **paper documents allowed**, so answers must be **justified and applied**, not copied definitions.']),

    h(['1. RHEL, Fedora, CentOS', '1. RHEL, Fedora, CentOS', '1. RHEL, Fedora, CentOS']),
    table([['Distribution', 'Distribution', 'Distribution'], ['Ce qu\'il faut retenir', 'Chnou t3a9el', 'What to remember']], [
      ['RHEL', ['Red Hat Enterprise Linux : stable, sécurisée, **support professionnel** ; la plus utilisée en entreprise. Binaire payant (abonnement), mais **Red Hat Developer Subscription** gratuite pour un développeur.', 'Stable, support pro ; payante walakin Developer Subscription gratuite.', 'Stable, pro support; paid binaries but a free Developer Subscription.']],
      ['Fedora', ['Distribution **communautaire** : **laboratoire** des nouveautés intégrées plus tard dans RHEL.', '**Laboratoire** dyal RHEL.', 'Community **lab** for RHEL.']],
      ['CentOS', ['Recompilation des **sources libres** de RHEL (les sources sont publiques mais doivent être compilées).', 'Sources dyal RHEL m-compilyin.', 'Rebuilt from RHEL\'s open sources.']]
    ]),
    quiz('lf-01'),

    h(['2. Avant d\'installer : configuration et machine virtuelle', '2. 9bel installation : configuration w VM', '2. Before installing: requirements and VM']),
    table([['Ressource', 'Ressource', 'Resource'], ['Minimum (cours)', 'Minimum (cours)', 'Minimum (course)'], ['VM du TP1', 'VM TP1', 'TP1 VM']], [
      [['Processeur', 'Processeur', 'CPU'], '64 bits', '2 vCPU'],
      [['Mémoire', 'Mémoire', 'Memory'], ['1 Go (2 Go recommandés)', '1 Go (2 recommandés)', '1 GB (2 recommended)'], '4 Go'],
      [['Disque', 'Disque', 'Disk'], ['10 Go (20 Go recommandés)', '10 Go (20 recommandés)', '10 GB (20 recommended)'], ['100 Go (SATA/SCSI, dynamique)', '100 Go', '100 GB']],
      [['Réseau', 'Réseau', 'Network'], '—', 'NAT ou Bridge'],
      [['Média', 'Média', 'Media'], '—', 'rhel-9.6-x86_64-boot.iso']
    ]),
    p(['Étapes du TP1 : démarrer la VM → **Install Red Hat Enterprise Linux 9** → langue Français → clavier Français, source détectée depuis l\'ISO, logiciels **Server with GUI**, destination : disque de 100 Go en **partitionnement manuel** → mot de passe **root** fort + un utilisateur administrateur → après le redémarrage, **instantané « Installation_propre »**.', 'TP1 : Install RHEL 9 → Français → **Server with GUI** → **partitionnement manuel** → mot de passe root + user admin → **snapshot « Installation_propre »**.', 'TP1: Install RHEL 9 → French → **Server with GUI** → **manual partitioning** → root password + admin user → **snapshot "Installation_propre"**.']),
    quiz('lf-02'),

    h(['3. Le partitionnement', '3. Partitionnement', '3. Partitioning']),
    def(['Une **partition** est une portion du disque traitée comme un disque indépendant. RHEL 9 propose des partitions standard ou des volumes **LVM** (`rhel-root`, `rhel-home`, `rhel-swap`), redimensionnables plus tard.', '**Partition** = jiha mn disque b7al disque mosta9il. RHEL 9 : standard wla **LVM**.', 'A **partition** is a slice of the disk used as an independent disk. RHEL 9: standard or **LVM** volumes.']),
    table([['Partition', 'Partition', 'Partition'], ['Taille recommandée', 'Taille', 'Size'], ['Rôle', 'Dor', 'Role'], ['À retenir', 'T3a9el', 'Remember']], [
      ['/boot', ['≥ 1 Gio', '≥ 1 Gio', '≥ 1 GiB'], ['Noyau et fichiers de démarrage', 'Noyau w démarrage', 'Kernel and boot files'], ['Séparée **obligatoire**', 'Séparée **obligatoire**', 'Separate, **mandatory**']],
      ['/', ['≥ 10 Gio', '≥ 10 Gio', '≥ 10 GiB'], ['Racine du système', 'Racine', 'System root'], ['≠ /root (home de root)', '≠ /root', '≠ /root']],
      ['/home', ['≥ 1 Gio', '≥ 1 Gio', '≥ 1 GiB'], ['Données utilisateurs', 'Data users', 'User data'], ['Upgrades sans perte de données', 'Bla ma ttlef data', 'Upgrades without data loss']],
      ['swap', ['Selon la RAM', 'Selon RAM', 'Depends on RAM'], ['Mémoire virtuelle', 'Mémoire virtuelle', 'Virtual memory'], ['Pas de point de montage', 'Bla point de montage', 'No mount point']],
      ['/var', ['≥ 5 Go', '≥ 5 Go', '≥ 5 GB'], ['Logs, cache, paquets', 'Logs, cache', 'Logs, cache, packages'], ['Critique pour un serveur web', 'Mohim l serveur web', 'Critical for web servers']],
      ['/usr', ['5–10 Go', '5–10 Go', '5–10 GB'], ['Logiciels système', 'Logiciels', 'System software'], ['10 Go pour une station de développement', '10 Go l dév', '10 GB for development']],
      ['/boot/efi', ['200 Mo', '200 Mo', '200 MB'], ['Partition système EFI (ESP)', 'ESP', 'EFI system partition'], ['UEFI seulement, en vfat', 'UEFI, vfat', 'UEFI only, vfat']]
    ]),
    tip(['Schéma imposé au TP1 pour **100 Go** : /boot **1 Go** · /boot/efi **1 Go** · / **20 Go** · /home **50 Go** · /var **24 Go** · swap **4 Go**.', 'TP1 (100 Go) : 1 · 1 · 20 · 50 · 24 · 4.', 'TP1 (100 GB): 1 · 1 · 20 · 50 · 24 · 4.']),
    code(`lsblk -f            # disques, partitions, LVM, systèmes de fichiers, montages
df -hT              # espace utilisé / libre par système de fichiers
cat /etc/fstab      # montages faits au démarrage
swapon --show       # swap actif`, 'bash', ['Vérifier le partitionnement après l\'installation', 'T2akked mn partitions', 'Check partitioning after install']),
    trap(['Partitionnement automatique : RHEL ne crée une **/home séparée** que si le disque est assez grand (le cours : **55 Gio minimum**).', 'Automatique : /home séparée ghir ila disque ≥ **55 Gio**.', 'Automatic: separate /home only on disks ≥ **55 GiB**.']),
    quiz('lf-03', 'lf-04', 'lf-05', 'lf-14', 'lf-15'),

    h(['4. La norme FHS', '4. Norme FHS', '4. The FHS']),
    def(['**FHS** (*Filesystem Hierarchy Standard*) définit l\'arborescence et le contenu des principaux répertoires de GNU/Linux et de la plupart des Unix. Version actuelle **3.0 (juin 2015)**. Un système Unix a **une seule arborescence** (arbre) qui part de **/**, et **tout est fichier** (même les disques et les processus).', '**FHS** kat-7added chajara w contenu dyal répertoires. **3.0 (2015)**. Chajara **wa7da** mn **/**, **kolchi fichier**.', '**FHS** defines the tree and content of the main directories. **3.0 (2015)**. **One** tree from **/**, **everything is a file**.']),
    anim('FHSTree'),
    table([['Répertoire', 'Répertoire', 'Directory'], ['Rôle', 'Dor', 'Role'], ['Exemple', 'Mithal', 'Example']], [
      ['/bin', ['Commandes de base utilisables par tous', 'Commandes de base l kolchi', 'Basic commands for everyone'], 'ls, cp, cat'],
      ['/sbin', ['Commandes d\'administration (root)', 'Commandes admin', 'Admin commands'], 'fdisk, useradd, reboot'],
      ['/etc', ['Configuration du système', 'Configuration', 'Configuration'], '/etc/passwd, /etc/fstab'],
      ['/home', ['Répertoires personnels des utilisateurs', 'Home dyal users', 'Users\' homes'], '/home/amine'],
      ['/root', ['Home de l\'administrateur root', 'Home dyal root', 'root\'s home'], ['accès root seulement', 'ghir root', 'root only']],
      ['/var', ['Données variables', 'Data li katbeddel', 'Variable data'], '/var/log, /var/cache'],
      ['/tmp', ['Fichiers temporaires (vidé au démarrage)', 'Temporaires', 'Temporary files'], ['sticky bit t', 'sticky bit', 'sticky bit']],
      ['/usr', ['Programmes, bibliothèques, docs (Unix System Resources)', 'Programmes w bibliothèques', 'Programs and libraries'], '/usr/bin, /usr/share'],
      ['/lib', ['Bibliothèques partagées et modules du noyau', 'Bibliothèques w modules', 'Shared libraries, kernel modules'], '/lib/modules'],
      ['/boot', ['Noyau, initramfs, GRUB : indispensables au démarrage', 'Noyau, initramfs, GRUB', 'Kernel, initramfs, GRUB'], 'vmlinuz-*, grub2/'],
      ['/dev', ['Périphériques sous forme de fichiers spéciaux', 'Périphériques', 'Devices as special files'], '/dev/sda, /dev/null'],
      ['/proc', ['Virtuel : processus et noyau, en mémoire', 'Virtuel : processus w noyau', 'Virtual: processes and kernel'], '/proc/cpuinfo, /proc/1'],
      ['/media', ['Montage automatique des supports amovibles', 'Amovibles automatique', 'Auto-mounted removable media'], ['clé USB', 'clé USB', 'USB stick']],
      ['/mnt', ['Montages temporaires faits par l\'admin', 'Montage manuel', 'Manual temporary mounts'], 'mount /dev/sdb1 /mnt'],
      ['/opt', ['Logiciels additionnels (tiers)', 'Logiciels tiers', 'Add-on software'], '/opt/google'],
      ['/run', ['Données d\'exécution depuis le démarrage (PID, sockets)', 'Data d exécution', 'Runtime data'], '/run/media']
    ]),
    code(`cd / && ls -l               # la racine (les répertoires du tableau)
ls -ld /bin /sbin /lib      # RHEL 9 : liens vers /usr/bin, /usr/sbin, /usr/lib
file /bin/ls /dev/sda       # exécutable · fichier spécial bloc
ls /proc | head; cat /proc/version
ls -ld /tmp                 # drwxrwxrwt : le t = sticky bit`, 'bash', ['Explorer le FHS (TP1, partie 3)', 'Explorer FHS', 'Explore the FHS']),
    plain(['Pour répondre vite : demande-toi **« ça change souvent ? »** (→ /var), **« ça se configure ? »** (→ /etc), **« c\'est un programme ? »** (→ /usr/bin ou /usr/sbin), **« c\'est du matériel ? »** (→ /dev), **« c\'est le noyau en direct ? »** (→ /proc).', 'Sowel rasek : katbeddel ? → /var ; config ? → /etc ; programme ? → /usr ; matériel ? → /dev ; noyau ? → /proc.', 'Ask: changes often? → /var; configuration? → /etc; program? → /usr; hardware? → /dev; live kernel? → /proc.']),
    quiz('lf-06', 'lf-07', 'lf-08', 'lf-09', 'lf-10', 'lf-11', 'lf-12', 'lf-13', 'lf-16')
  ],
  keyPoints: [
    L(['RHEL (entreprise, support) ← Fedora (laboratoire) ; CentOS = sources de RHEL recompilées.', 'RHEL ← Fedora ; CentOS = sources RHEL.', 'RHEL ← Fedora; CentOS = rebuilt RHEL sources.']),
    L(['Minimum 64 bits, 1 Go RAM, 10 Go disque ; TP1 : 2 vCPU, 4 Go, 100 Go, Server with GUI, partitionnement manuel.', '64 bits, 1 Go, 10 Go ; TP1 : 2 vCPU, 4 Go, 100 Go.', '64-bit, 1 GB, 10 GB; TP1: 2 vCPU, 4 GB, 100 GB.']),
    L(['Partitions : /boot ≥1 Gio, / ≥10 Gio, /home, swap, /var ≥5 Go, /boot/efi 200 Mo (UEFI, vfat) ; TP1 : 1/1/20/50/24/4 Go.', '/boot, /, /home, swap, /var, /boot/efi ; TP1 1/1/20/50/24/4.', '/boot, /, /home, swap, /var, /boot/efi; TP1 1/1/20/50/24/4.']),
    L(['FHS 3.0 (2015) : /etc config, /var variable, /usr programmes, /dev périphériques, /proc virtuel, /tmp vidé, /root ≠ /.', 'FHS : etc, var, usr, dev, proc, tmp, root ≠ /.', 'FHS: etc, var, usr, dev, proc, tmp, root ≠ /.'])
  ]
};
