import { setCtx, L, h, p, code, key, tip, exam, copy, ex, rb } from '../lib';
import type { Chapter } from '../../src/lib/schema';

/** Mock CC (Pr Zbakh): Installation, FHS, boot process (GRUB2, systemd). Paper documents allowed → applied questions. */
setCtx('linux', 'cc-blanc');

export const questions = [];
export const flashcards = [];
export const reference = [];

export const exercises = [
  ex('lx-cc-1', 2, ['CC blanc — Ex. 1 : partitionner un serveur (4 pts)', 'CC blanc — Ex. 1 : partitions serveur (4 pts)', 'Mock CC — Ex. 1: partition a server (4 pts)'],
    ['On installe RHEL 9 sur un **serveur web** UEFI avec un disque de **60 Go** et 4 Go de RAM. 1) Proposez un schéma de partitionnement (point de montage, taille, système de fichiers). 2) Justifiez /boot, /var et /home. 3) Quelle partition est indispensable en UEFI ? 4) Donnez 3 commandes pour vérifier le résultat.', 'RHEL 9 f **serveur web** UEFI, disque **60 Go**, 4 Go RAM. 1) Schéma. 2) 3lach /boot, /var, /home. 3) Partition darouriya f UEFI. 4) 3 commandes dyal t2akked.', 'RHEL 9 on a UEFI **web server**, **60 GB** disk, 4 GB RAM. 1) Scheme. 2) Justify /boot, /var, /home. 3) Mandatory UEFI partition. 4) 3 check commands.'],
    [['Reprends les tailles minimales du cours et donne le reste à /var (serveur web).', 'Tailles minimales w lba9i l /var.', 'Use the course minimums, give the rest to /var.']],
    [{ t: ['1) Schéma (exemple valable)', '1) Schéma', '1) Scheme'], b: ['/boot/efi 600 Mo (vfat) · /boot 1 Go (xfs) · / 20 Go (xfs) · /var 25 Go (xfs) · /home 10 Go (xfs) · swap 4 Go. Total ≈ 60 Go.', '0,6 · 1 · 20 · 25 · 10 · 4 Go.', '0.6 · 1 · 20 · 25 · 10 · 4 GB.'] },
     { t: ['2–3) Justification', '2–3) 3lach', '2–3) Why'], b: ['/boot (≥ 1 Gio, séparée) : noyaux + initramfs. /var : logs et cache d\'un serveur web qui grossissent sans remplir /. /home : données utilisateurs conservées si on réinstalle. En UEFI : **/boot/efi** (ESP, vfat) sinon la machine ne démarre pas.', '/boot noyaux ; /var logs ; /home data ; /boot/efi darouriya.', '/boot kernels; /var logs; /home data; /boot/efi mandatory.'] },
     { t: ['4) Vérifier', '4) T2akked', '4) Check'], b: ['', '', ''], code: 'lsblk -f\ndf -hT\ncat /etc/fstab' }],
    ['Schéma avec /boot/efi (vfat), /boot ≥ 1 Go, / ≥ 10–20 Go, /var la plus grande (serveur web), /home, swap ≈ RAM ; vérification lsblk -f, df -hT, /etc/fstab.', '/boot/efi, /boot, /, /var kbira, /home, swap.', '/boot/efi, /boot, /, large /var, /home, swap.'],
    [['Pas de /boot/efi en UEFI.', 'Bla /boot/efi.', 'No /boot/efi.'], ['Total supérieur à 60 Go.', 'Ktar mn 60 Go.', 'Over 60 GB.']],
    { rubric: [rb('/boot/efi (ESP) en vfat pour UEFI', 3, '/boot/efi && vfat', '/boot/efi && fat'), rb('/boot/efi présente', 1, '/boot/efi'), rb('/boot ≥ 1 Go', 2, '/boot 1', '/boot : 1', '/boot = 1', '/boot (1'), rb('/ (racine) dimensionnée', 1, '/ 20', '/ : 20', 'racine'), rb('/var séparée pour le serveur web (logs)', 3, '/var && log'), rb('/home : données utilisateurs conservées', 2, '/home && donnees', '/home && utilisateur'), rb('swap', 1, 'swap'), rb('lsblk', 1, 'lsblk'), rb('df -h', 1, 'df -h', 'df -ht'), rb('/etc/fstab', 1, 'fstab')] }),
  ex('lx-cc-2', 2, ['CC blanc — Ex. 2 : FHS (4 pts)', 'CC blanc — Ex. 2 : FHS (4 pts)', 'Mock CC — Ex. 2: FHS (4 pts)'],
    ['Indiquez le répertoire concerné : a) la configuration du serveur SSH ; b) les journaux du serveur web ; c) le noyau et l\'initramfs ; d) la commande useradd ; e) le deuxième disque ; f) la mémoire disponible vue par le noyau ; g) un logiciel tiers installé à la main ; h) le dossier personnel de root. Puis : pourquoi /tmp ne convient-il pas pour garder un fichier ? Que constate-t-on avec `ls -ld /bin` sur RHEL 9 ?', 'Répertoire : a) config SSH ; b) logs web ; c) noyau + initramfs ; d) useradd ; e) disque 2 ; f) mémoire (noyau) ; g) logiciel tiers ; h) home root. W : /tmp ? `ls -ld /bin` f RHEL 9 ?', 'Directory: a) SSH config; b) web logs; c) kernel + initramfs; d) useradd; e) second disk; f) memory (kernel view); g) third-party software; h) root\'s home. Then: /tmp? `ls -ld /bin` on RHEL 9?'],
    [['/etc config · /var variable · /boot démarrage · /sbin admin · /dev matériel · /proc noyau · /opt tiers.', 'etc, var, boot, sbin, dev, proc, opt.', 'etc, var, boot, sbin, dev, proc, opt.']],
    [{ t: ['Réponses', 'Jawabat', 'Answers'], b: ['a) /etc/ssh/ (sshd_config) · b) /var/log/httpd/ (ou nginx) · c) /boot · d) /sbin → /usr/sbin/useradd · e) /dev/sdb · f) /proc/meminfo · g) /opt · h) /root. /tmp est **vidé** au démarrage (préférer /var/tmp). Sur RHEL 9, **/bin est un lien** vers /usr/bin (fusion /usr).', 'etc/ssh · var/log/httpd · boot · sbin · dev/sdb · proc/meminfo · opt · root ; /tmp kaytkhwa ; /bin → usr/bin.', 'etc/ssh · var/log/httpd · boot · sbin · dev/sdb · proc/meminfo · opt · root; /tmp is wiped; /bin → usr/bin.'], code: 'ls /etc/ssh/sshd_config /var/log/httpd /boot\nwhich useradd; ls -l /dev/sdb\ngrep MemAvailable /proc/meminfo\nls -ld /bin /tmp' }],
    ['/etc/ssh, /var/log/httpd, /boot, /usr/sbin, /dev/sdb, /proc/meminfo, /opt, /root ; /tmp vidé au démarrage ; /bin -> usr/bin.', 'etc, var/log, boot, sbin, dev, proc, opt, root.', 'etc, var/log, boot, sbin, dev, proc, opt, root.'],
    [['/root confondu avec /.', '/root ≠ /.', '/root ≠ /.']],
    { rubric: [rb('a) /etc/ssh', 1, '/etc/ssh'), rb('b) /var/log', 1, '/var/log'), rb('c) /boot', 1, '/boot'), rb('d) /sbin ou /usr/sbin', 1, 'sbin'), rb('e) /dev/sdb', 1, '/dev/sdb', '/dev/sd'), rb('f) /proc/meminfo', 1, '/proc/meminfo', '/proc'), rb('g) /opt', 1, '/opt'), rb('h) /root', 1, '/root'), rb('/tmp vidé au démarrage', 1, '/tmp && vid', '/tmp && efface', '/tmp && redemarr'), rb('/bin lien vers /usr/bin', 1, 'usr/bin && lien', 'usr/bin && link', '-> usr/bin')] }),
  ex('lx-cc-3', 3, ['CC blanc — Ex. 3 : séquence de démarrage et pannes (4 pts)', 'CC blanc — Ex. 3 : démarrage w pannes (4 pts)', 'Mock CC — Ex. 3: boot sequence and failures (4 pts)'],
    ['1) Ordonnez : noyau, systemd, UEFI, initramfs monté, GRUB2, default.target. 2) Pour chaque symptôme, dites quelle étape a échoué et que vérifier : a) l\'écran reste sur l\'invite `grub>` ; b) « Kernel panic - not syncing: No working init found » ; c) le système tombe dans un shell d\'urgence (dracut) « cannot mount root » ; d) la machine démarre mais le serveur web ne répond pas.', '1) Rettab : noyau, systemd, UEFI, initramfs, GRUB2, default.target. 2) L kol symptôme : ina marhala w chnou tchouf.', '1) Order the steps. 2) For each symptom: which step failed and what to check.'],
    [['Chaque message appartient à une étape précise : GRUB, noyau, initramfs, systemd.', 'Kol message 3ndo marhala.', 'Each message belongs to one step.']],
    [{ t: ['1) Ordre', '1) Tartib', '1) Order'], b: ['UEFI → GRUB2 → noyau → initramfs monté → systemd (PID 1) → default.target.', 'UEFI → GRUB2 → noyau → initramfs → systemd → target.', 'UEFI → GRUB2 → kernel → initramfs → systemd → target.'] },
     { t: ['2) Pannes', '2) Pannes', '2) Failures'], b: ['a) **GRUB2** ne trouve pas sa configuration : /boot/grub2/grub.cfg (régénérer avec grub2-mkconfig). b) **PID 1** introuvable : le noyau n\'a pas trouvé systemd (/sbin/init). c) **initramfs** : pilotes/LVM pour monter / absents ou mauvais `root=` dans GRUB_CMDLINE_LINUX (dracut -f pour reconstruire). d) **systemd / service** : `systemctl status httpd`, `journalctl -u httpd -b`.', 'a) GRUB2 ; b) PID 1 ; c) initramfs ; d) service.', 'a) GRUB2; b) PID 1; c) initramfs; d) service.'] }],
    ['UEFI → GRUB2 → noyau → initramfs → systemd → default.target ; a) GRUB2/grub.cfg b) PID 1 c) initramfs/root= d) service (status, journalctl -u).', 'GRUB2, PID 1, initramfs, service.', 'GRUB2, PID 1, initramfs, service.'],
    [['Accuser le BIOS pour un problème qui survient après le menu GRUB.', 'BIOS machi houwa.', 'Blaming the BIOS.']],
    { rubric: [rb('Ordre UEFI → GRUB2 → noyau → initramfs → systemd → target', 3, 'uefi && grub && noyau && initramfs && systemd && target'), rb('a) grub> : GRUB2 / grub.cfg', 2, 'grub.cfg', 'grub2-mkconfig'), rb('b) kernel panic : PID 1 / init introuvable', 2, 'pid 1', 'init && introuvable', 'systemd && introuvable', 'init && trouv'), rb('c) cannot mount root : initramfs / root=', 2, 'initramfs', 'dracut', 'root='), rb('d) service : systemctl status + journalctl -u', 2, 'systemctl status && journalctl', 'status && journalctl -u')] }),
  ex('lx-cc-4', 2, ['CC blanc — Ex. 4 : GRUB2 (4 pts)', 'CC blanc — Ex. 4 : GRUB2 (4 pts)', 'Mock CC — Ex. 4: GRUB2 (4 pts)'],
    ['1) Quel fichier modifie-t-on pour régler le menu et pourquoi pas /boot/grub2/grub.cfg ? 2) Écrivez les lignes pour : menu affiché **15 s**, démarrer la **dernière entrée choisie**, supprimer l\'entrée **Recovery**, passer l\'option noyau **quiet**. 3) Donnez la commande qui applique les changements. 4) Comment vérifier les options reçues par le noyau après le redémarrage ?', '1) Ina fichier w 3lach machi grub.cfg ? 2) Lignes : **15 s**, **akhir entrée**, bla **Recovery**, **quiet**. 3) Commande. 4) T2akked.', '1) Which file and why not grub.cfg? 2) Lines: **15 s**, **last entry**, no **Recovery**, **quiet**. 3) Command. 4) Check.'],
    [['/etc/default/grub contient des lignes VARIABLE=valeur.', 'VARIABLE=valeur.', 'VARIABLE=value.']],
    [{ t: ['Réponses', 'Jawabat', 'Answers'], b: ['1) **/etc/default/grub** : grub.cfg est **généré** par grub2-mkconfig (modifs écrasées). 2–4) :', '1) /etc/default/grub (grub.cfg générée).', '1) /etc/default/grub (grub.cfg is generated).'], code: 'GRUB_TIMEOUT=15\nGRUB_DEFAULT=saved\nGRUB_DISABLE_RECOVERY="true"\nGRUB_CMDLINE_LINUX="... quiet"\n\ngrub2-mkconfig -o /boot/grub2/grub.cfg\ncat /proc/cmdline      # après reboot' }],
    ['/etc/default/grub : GRUB_TIMEOUT=15, GRUB_DEFAULT=saved, GRUB_DISABLE_RECOVERY="true", quiet dans GRUB_CMDLINE_LINUX ; grub2-mkconfig -o /boot/grub2/grub.cfg ; cat /proc/cmdline.', 'TIMEOUT, DEFAULT, RECOVERY, CMDLINE ; grub2-mkconfig ; /proc/cmdline.', 'TIMEOUT, DEFAULT, RECOVERY, CMDLINE; grub2-mkconfig; /proc/cmdline.'],
    [['grub2-mkconfig sans -o.', 'Bla -o.', 'Without -o.']],
    { rubric: [rb('Fichier /etc/default/grub', 2, '/etc/default/grub'), rb('grub.cfg généré (ne pas éditer)', 1, 'genere', 'grub2-mkconfig'), rb('GRUB_TIMEOUT=15', 1, 'grub_timeout=15'), rb('GRUB_DEFAULT=saved', 1, 'grub_default=saved'), rb('GRUB_DISABLE_RECOVERY="true"', 1, 'grub_disable_recovery=true', 'grub_disable_recovery="true"'), rb('quiet dans GRUB_CMDLINE_LINUX', 1, 'grub_cmdline_linux && quiet'), rb('grub2-mkconfig -o /boot/grub2/grub.cfg', 3, 'grub2-mkconfig -o /boot/grub2/grub.cfg'), rb('Vérifier : cat /proc/cmdline', 1, '/proc/cmdline', 'grubby')] }),
  ex('lx-cc-5', 2, ['CC blanc — Ex. 5 : systemd et arrêt (4 pts)', 'CC blanc — Ex. 5 : systemd w arrêt (4 pts)', 'Mock CC — Ex. 5: systemd and shutdown (4 pts)'],
    ['1) Quelle est la cible par défaut et comment la passer en **mode texte** de façon permanente ? 2) Passez en mode texte **tout de suite** sans redémarrer. 3) Le service **httpd** doit tourner maintenant et à chaque démarrage. 4) Empêchez totalement le démarrage de **cups**. 5) Programmez l\'arrêt (coupure) à **23h00** avec le message « Fin de journée », puis annulez-le. 6) Affichez les erreurs de httpd depuis le démarrage actuel.', '1) Cible par défaut w mode **texte** dima. 2) Mode texte **daba**. 3) **httpd** daba w f démarrage. 4) Bloqui **cups**. 5) Arrêt **23h00** b message, w lghi. 6) Erreurs httpd mn démarrage.', '1) Default target, text mode permanently. 2) Text mode now. 3) httpd now and at boot. 4) Block cups. 5) Power off at 23:00 with a message, then cancel. 6) httpd errors since boot.'],
    [['set-default = permanent, isolate = maintenant, enable --now = les deux, mask = interdit.', 'set-default, isolate, enable --now, mask.', 'set-default, isolate, enable --now, mask.']],
    [{ t: ['Commandes', 'Commandes', 'Commands'], b: ['', '', ''], code: 'systemctl get-default                          # 1\nsystemctl set-default multi-user.target\nsystemctl isolate multi-user.target            # 2\nsystemctl enable --now httpd                   # 3\nsystemctl mask cups                            # 4\nshutdown -P 23:00 "Fin de journée"             # 5\nshutdown -c\njournalctl -u httpd -b -p err                  # 6' }],
    ['get-default / set-default multi-user.target ; isolate multi-user.target ; enable --now httpd ; mask cups ; shutdown -P 23:00 "Fin de journée" puis shutdown -c ; journalctl -u httpd -b -p err.', 'set-default, isolate, enable --now, mask, shutdown, journalctl.', 'set-default, isolate, enable --now, mask, shutdown, journalctl.'],
    [['Utiliser disable au lieu de mask (un autre service peut encore démarrer cups).', 'disable machi mask.', 'disable is not mask.'], ['Oublier --now.', 'Nsiti --now.', 'Forgetting --now.']],
    { rubric: [rb('systemctl get-default', 1, 'get-default'), rb('set-default multi-user.target', 2, 'set-default multi-user.target'), rb('isolate multi-user.target', 2, 'isolate multi-user.target'), rb('enable --now httpd', 2, 'enable --now httpd', 'enable httpd && start httpd'), rb('mask cups', 2, 'mask cups'), rb('shutdown à 23:00 avec message', 2, 'shutdown && 23:00'), rb('shutdown -c', 1, 'shutdown -c'), rb('journalctl -u httpd -b -p err', 2, 'journalctl && -u httpd && -p err', 'journalctl -u httpd')] })
];

export const chapter: Chapter = {
  id: 'cc-blanc',
  module: 'linux',
  order: 7,
  title: L(['CC blanc corrigé — Installation, FHS, démarrage', 'CC blanc m-corrigé — Installation, FHS, démarrage', 'Solved mock CC — Installation, FHS, boot']),
  summary: L([
    'Le programme exact du CC de Pr Zbakh (Installation, FHS, processus de démarrage : GRUB, systemd), en 5 exercices de 4 points avec copies modèles. Documents papier autorisés.',
    'Programme dyal CC (Installation, FHS, démarrage : GRUB, systemd), 5 exercices × 4 pts b copies modèles. Documents autorisés.',
    'The exact CC scope in 5 exercises of 4 points with model answers. Paper documents allowed.'
  ]),
  estimatedMinutes: 90,
  sections: [
    key(['**Programme du CC** : Installation · FHS · Processus de démarrage (GRUB, systemd). **Documents papier autorisés** : imprime la **fiche PDF des commandes** (bouton plus bas, ou Supports) et apporte-la. Fais d\'abord l\'**examen blanc chronométré** (page Examen blanc → CC Linux), puis compare avec ces copies.', '**Programme** : Installation · FHS · Démarrage (GRUB, systemd). **Documents autorisés** : imprimi **fiche PDF** w jibha. Dir examen blanc b chrono 9bel.', '**Scope**: Installation · FHS · Boot (GRUB, systemd). **Paper documents allowed**: print the **command sheet PDF**. Take the timed mock first.']),
    p(['[Télécharger la fiche des commandes (PDF)](/docs/linux-cc-commandes.pdf)', '[Téléchargi fiche dyal commandes (PDF)](/docs/linux-cc-commandes.pdf)', '[Download the command sheet (PDF)](/docs/linux-cc-commandes.pdf)']),

    h(['Ex. 1 — Partitionner un serveur web (4 pts)', 'Ex. 1 — Partitions serveur web (4 pts)', 'Ex. 1 — Partition a web server (4 pts)']),
    p(['Serveur web RHEL 9, UEFI, disque **60 Go**, 4 Go de RAM : schéma, justification de /boot, /var, /home, partition indispensable en UEFI, 3 commandes de vérification.', 'Serveur web, UEFI, **60 Go**, 4 Go : schéma, 3lach, UEFI, t2akked.', 'Web server, UEFI, **60 GB**: scheme, why, UEFI, checks.']),
    copy(['Copie modèle — Ex. 1', 'Copie modèle — Ex. 1', 'Model answer — Ex. 1'], null, [
      { l: ['Schéma', 'Schéma', 'Scheme'], b: ['/boot/efi 600 Mo **vfat** · /boot 1 Go xfs · / 20 Go xfs · **/var 25 Go** xfs · /home 10 Go xfs · swap 4 Go.', '0,6 · 1 · 20 · 25 · 10 · 4.', '0.6 · 1 · 20 · 25 · 10 · 4.'] },
      { l: ['/boot', '/boot', '/boot'], b: ['Noyaux et initramfs, ≥ 1 Gio, partition séparée.', 'Noyaux, ≥ 1 Gio.', 'Kernels, ≥ 1 GiB.'] },
      { l: ['/var', '/var', '/var'], b: ['Serveur web : logs et cache grossissent ; séparée, elle ne peut pas remplir /.', 'Logs ma y3emrouch /.', 'Logs cannot fill /.'] },
      { l: ['/home', '/home', '/home'], b: ['Données utilisateurs conservées lors d\'une réinstallation ou mise à jour.', 'Data mahfoda.', 'User data kept.'] },
      { l: ['UEFI', 'UEFI', 'UEFI'], b: ['**/boot/efi** (ESP, FAT32) contient EFI/redhat/grubx64.efi : sans elle, pas de démarrage.', '**/boot/efi** darouriya.', '**/boot/efi** is mandatory.'] },
      { l: ['Vérification', 'T2akked', 'Check'], b: ['`lsblk -f` · `df -hT` · `cat /etc/fstab`.', 'lsblk -f · df -hT · fstab.', 'lsblk -f · df -hT · fstab.'] }
    ]),

    h(['Ex. 2 — FHS (4 pts)', 'Ex. 2 — FHS (4 pts)', 'Ex. 2 — FHS (4 pts)']),
    copy(['Copie modèle — Ex. 2', 'Copie modèle — Ex. 2', 'Model answer — Ex. 2'], null, [
      { l: ['a–d', 'a–d', 'a–d'], b: ['Config SSH **/etc/ssh/** · logs web **/var/log/httpd/** · noyau + initramfs **/boot** · useradd **/usr/sbin** (/sbin est un lien).', 'etc/ssh · var/log/httpd · boot · usr/sbin.', 'etc/ssh · var/log/httpd · boot · usr/sbin.'] },
      { l: ['e–h', 'e–h', 'e–h'], b: ['2e disque **/dev/sdb** · mémoire **/proc/meminfo** · logiciel tiers **/opt** · home de root **/root**.', 'dev/sdb · proc/meminfo · opt · root.', 'dev/sdb · proc/meminfo · opt · root.'] },
      { l: ['/tmp', '/tmp', '/tmp'], b: ['Vidé au démarrage : garder plutôt dans /var/tmp ou /home.', 'Kaytkhwa : /var/tmp.', 'Wiped: use /var/tmp.'] },
      { l: ['ls -ld /bin', 'ls -ld /bin', 'ls -ld /bin'], b: ['`lrwxrwxrwx … /bin -> usr/bin` : fusion /usr de RHEL 9 ; le rôle FHS de /bin ne change pas.', '/bin -> usr/bin.', '/bin -> usr/bin.'] }
    ]),

    h(['Ex. 3 — Démarrage et pannes (4 pts)', 'Ex. 3 — Démarrage w pannes (4 pts)', 'Ex. 3 — Boot and failures (4 pts)']),
    copy(['Copie modèle — Ex. 3', 'Copie modèle — Ex. 3', 'Model answer — Ex. 3'], null, [
      { l: ['Ordre', 'Tartib', 'Order'], b: ['UEFI → GRUB2 → noyau → initramfs monté → systemd (PID 1) → default.target.', 'UEFI → GRUB2 → noyau → initramfs → systemd → target.', 'UEFI → GRUB2 → kernel → initramfs → systemd → target.'] },
      { l: ['a) grub>', 'a) grub>', 'a) grub>'], b: ['Étape **GRUB2** : grub.cfg absent/illisible → régénérer `grub2-mkconfig -o /boot/grub2/grub.cfg` (depuis un mode de secours).', '**GRUB2** : grub.cfg.', '**GRUB2**: grub.cfg.'] },
      { l: ['b) Kernel panic', 'b) Kernel panic', 'b) Kernel panic'], b: ['Étape **PID 1** : le noyau ne trouve pas init/systemd.', '**PID 1**.', '**PID 1**.'] },
      { l: ['c) cannot mount root', 'c) cannot mount root', 'c) cannot mount root'], b: ['Étape **initramfs** : pilote ou volume LVM manquant, ou mauvais `root=` dans GRUB_CMDLINE_LINUX → vérifier, reconstruire (`dracut -f`).', '**initramfs**.', '**initramfs**.'] },
      { l: ['d) service', 'd) service', 'd) service'], b: ['Étape **systemd** : `systemctl status httpd`, `journalctl -u httpd -b`, puis `systemctl restart httpd`.', '**systemd** : status, journalctl, restart.', '**systemd**: status, journalctl, restart.'] }
    ]),

    h(['Ex. 4 — GRUB2 (4 pts)', 'Ex. 4 — GRUB2 (4 pts)', 'Ex. 4 — GRUB2 (4 pts)']),
    copy(['Copie modèle — Ex. 4', 'Copie modèle — Ex. 4', 'Model answer — Ex. 4'], null, [
      { l: ['Fichier', 'Fichier', 'File'], b: ['**/etc/default/grub** ; /boot/grub2/grub.cfg est **généré** par grub2-mkconfig, une modification à la main serait écrasée.', '/etc/default/grub (grub.cfg générée).', '/etc/default/grub (grub.cfg is generated).'] },
      { l: ['Lignes', 'Lignes', 'Lines'], b: ['GRUB_TIMEOUT=15 · GRUB_DEFAULT=saved · GRUB_DISABLE_RECOVERY="true" · GRUB_CMDLINE_LINUX="… quiet".', 'TIMEOUT=15 · DEFAULT=saved · RECOVERY · quiet.', 'TIMEOUT=15 · DEFAULT=saved · RECOVERY · quiet.'] },
      { l: ['Appliquer', 'Appliquer', 'Apply'], b: ['`grub2-mkconfig -o /boot/grub2/grub.cfg`.', 'grub2-mkconfig -o.', 'grub2-mkconfig -o.'] },
      { l: ['Vérifier', 'T2akked', 'Check'], b: ['Après redémarrage : `cat /proc/cmdline` (options reçues par le noyau).', 'cat /proc/cmdline.', 'cat /proc/cmdline.'] }
    ]),

    h(['Ex. 5 — systemd et arrêt (4 pts)', 'Ex. 5 — systemd w arrêt (4 pts)', 'Ex. 5 — systemd and shutdown (4 pts)']),
    code(`systemctl get-default                          # 1. ex. graphical.target
systemctl set-default multi-user.target        #    mode texte, permanent
systemctl isolate multi-user.target            # 2. tout de suite
systemctl enable --now httpd                   # 3. maintenant + au démarrage
systemctl mask cups                            # 4. démarrage impossible
shutdown -P 23:00 "Fin de journée"             # 5. arrêt + coupure à 23h
shutdown -c                                    #    annuler
journalctl -u httpd -b -p err                  # 6. erreurs httpd, démarrage actuel`, 'bash', ['Copie modèle — Ex. 5', 'Copie modèle — Ex. 5', 'Model answer — Ex. 5']),
    tip(['`disable` n\'empêche pas un autre service ou un utilisateur de lancer cups ; `mask` le relie à /dev/null : **aucun** démarrage possible.', 'disable ≠ mask.', 'disable ≠ mask.']),
    exam(['Barème indicatif : 4 points par exercice. Une commande exacte vaut plus qu\'une longue définition : écris la commande, puis une phrase qui dit ce qu\'elle fait.', '4 pts l kol exercice. Commande s7i7a + jomla.', '4 pts each. An exact command beats a long definition.'])
  ],
  keyPoints: [
    L(['Partitions : /boot/efi (UEFI, vfat), /boot ≥ 1 Go, /, /var (serveur), /home, swap.', '/boot/efi, /boot, /, /var, /home, swap.', '/boot/efi, /boot, /, /var, /home, swap.']),
    L(['Pannes : grub> = GRUB2 ; Kernel panic no init = PID 1 ; cannot mount root = initramfs ; service = systemctl status + journalctl -u.', 'grub>, panic, initramfs, service.', 'grub>, panic, initramfs, service.']),
    L(['set-default (permanent) · isolate (maintenant) · enable --now · mask · shutdown -P 23:00 "msg" / -c.', 'set-default, isolate, enable --now, mask, shutdown.', 'set-default, isolate, enable --now, mask, shutdown.'])
  ]
};
