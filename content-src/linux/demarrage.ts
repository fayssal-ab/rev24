import { setCtx, L, h, p, code, key, plain, tip, trap, exam, def, table, anim, quiz, single, multi, cmd, order, ex, fc, ref } from '../lib';
import type { Chapter } from '../../src/lib/schema';

/**
 * CC (Pr Zbakh): "Processus de démarrage (GRUB, Systemd)". Source: EMSI course "Administration Unix 02 — Démarrage et
 * arrêt du système Linux" (BIOS/UEFI, boot loader, initramfs, PID 1, SysVinit, systemd, arrêt, journalctl),
 * TP2 (GRUB2) and TP3 (cibles, services, journalctl). The TP2/TP3 chapters keep the hands-on details.
 */
setCtx('linux', 'demarrage');

export const questions = [
  order('ld-01', 1, ['Remets les étapes du démarrage dans l\'ordre.', 'Rettab marahil dyal démarrage.', 'Put the boot steps in order.'],
    [['Mise sous tension, firmware BIOS/UEFI (POST)', 'Tension, BIOS/UEFI (POST)', 'Power on, BIOS/UEFI firmware (POST)'], ['Chargeur de démarrage GRUB2', 'GRUB2', 'GRUB2 boot loader'], ['Noyau Linux + initramfs', 'Noyau + initramfs', 'Linux kernel + initramfs'], ['Processus PID 1 (systemd)', 'PID 1 (systemd)', 'PID 1 (systemd)'], ['Cible par défaut atteinte : système prêt', 'Cible par défaut : système wajed', 'Default target reached: ready']],
    ['Power on → **Pre-OS (BIOS/UEFI)** → **Boot loader (GRUB2)** → **Linux kernel** (+ initramfs) → **PID 1 (systemd)** → Ready.', 'BIOS/UEFI → GRUB2 → noyau → systemd → prêt.', 'BIOS/UEFI → GRUB2 → kernel → systemd → ready.'], ['sequence']),
  single('ld-02', 1, ['Que fait le BIOS avant de chercher le système ?', 'Chnou kaydir BIOS 9bel ?', 'What does the BIOS do first?'],
    [['Le POST : tests du matériel (mémoire, clavier, disques…)', 'POST : tests dyal matériel', 'POST: hardware self-tests'], ['Il monte /', 'Kaymonti /', 'Mounts /'], ['Il lance systemd', 'Kaylanci systemd', 'Starts systemd'], ['Il lit /etc/fstab', 'Kay9ra fstab', 'Reads fstab']], 0,
    ['**POST** (*Power-On Self Test*) : recensement et tests du matériel, puis recherche du **MBR** (secteur 0) sur le périphérique de démarrage choisi.', '**POST**, mn ba3d **MBR**.', '**POST**, then the **MBR**.'],
    [['Le noyau monte / (après l\'initramfs).', 'Noyau li kaymonti.', 'The kernel mounts /.'], ['systemd est lancé par le noyau.', 'Noyau kaylanci systemd.', 'The kernel starts systemd.'], ['fstab est lu par systemd.', 'systemd kay9ra fstab.', 'systemd reads fstab.']], ['bios']),
  single('ld-03', 2, ['Que contient le MBR ?', 'Chnou fih MBR ?', 'What is in the MBR?'],
    [['Les 512 premiers octets du disque : code d\'amorçage (étape 1) + table des partitions', '512 octets : code d amorçage + table des partitions', 'First 512 bytes: boot code (stage 1) + partition table'], ['Le noyau', 'Noyau', 'The kernel'], ['La configuration de GRUB', 'Config GRUB', 'GRUB configuration'], ['La partition /boot', '/boot', 'The /boot partition']], 0,
    ['**MBR** (*Master Boot Record*) = **secteur 0, 512 octets** : le **code d\'amorçage** (chargeur étape 1) et la **table des partitions** (+ la signature 0x55AA). Le chargeur étape 1 lance l\'étape 2 depuis /boot (GRUB).', '**512 octets** : code + table.', '**512 bytes**: code + table.'],
    [['Le noyau est dans /boot.', 'Noyau f /boot.', 'Kernel is in /boot.'], ['grub.cfg est dans /boot/grub2.', 'grub.cfg f /boot/grub2.', 'grub.cfg is in /boot/grub2.'], ['/boot est une partition, pas un secteur.', '/boot partition.', '/boot is a partition.']], ['bios']),
  single('ld-04', 2, ['Avantage de UEFI + GPT sur BIOS + MBR ?', 'Mzya dyal UEFI + GPT ?', 'Advantage of UEFI + GPT?'],
    [['Démarrer sur des disques/partitions de plus de 2 To, plus de partitions, interface et sécurité modernes', '> 2 To, partitions ktar, sécurité', '> 2 TB disks, more partitions, modern security'], ['Démarrer sans noyau', 'Bla noyau', 'Boot without a kernel'], ['Ne plus avoir besoin de GRUB', 'Bla GRUB', 'No GRUB needed'], ['Être compatible 16 bits', '16 bits', '16-bit compatibility']], 0,
    ['UEFI remplace le BIOS : interface graphique, réseau, sécurité intégrée, écrit en C, et support **GPT** (remplace le MBR) pour démarrer sur des partitions de **plus de 2 To**. Il lit la GPT et monte l\'**ESP** (**/boot/efi**) qui contient `EFI/redhat/grubx64.efi`.', 'UEFI : **GPT** (> 2 To), ESP = **/boot/efi**.', 'UEFI: **GPT** (> 2 TB), ESP = **/boot/efi**.'],
    [['Le noyau reste indispensable.', 'Noyau darouri.', 'The kernel is still needed.'], ['UEFI charge GRUB (grubx64.efi).', 'UEFI kaychargi GRUB.', 'UEFI loads GRUB.'], ['C\'est l\'inverse : UEFI est moderne.', 'L3aks.', 'The opposite.']], ['uefi']),
  single('ld-05', 1, ['Rôle principal d\'un chargeur de démarrage ?', 'Dor dyal chargeur ?', 'Main role of a boot loader?'],
    [['Charger le noyau (et l\'initramfs) en mémoire et le lancer', 'Chargi noyau w initramfs w lanci', 'Load the kernel (and initramfs) and start it'], ['Créer les utilisateurs', 'Users', 'Create users'], ['Monter /home', 'Monter /home', 'Mount /home'], ['Lancer les services', 'Services', 'Start services']], 0,
    ['Il fait la **transition entre le matériel et le noyau** ; il peut aussi proposer plusieurs noyaux/OS et passer des **paramètres au noyau**. Chargeurs : GRUB, **GRUB2** (actuel), LILO (abandonné).', '**Transition** matériel → noyau.', '**Bridge** hardware → kernel.'],
    [['Ça se fait avec useradd.', 'useradd.', 'That is useradd.'], ['C\'est systemd (fstab).', 'systemd.', 'systemd does it.'], ['C\'est systemd.', 'systemd.', 'systemd does it.']], ['grub']),
  single('ld-06', 2, ['Après avoir modifié /etc/default/grub, que faut-il faire ?', 'Mor tbeddel /etc/default/grub ?', 'After editing /etc/default/grub?'],
    [['Régénérer grub.cfg avec grub2-mkconfig -o /boot/grub2/grub.cfg', 'grub2-mkconfig -o /boot/grub2/grub.cfg', 'Regenerate with grub2-mkconfig -o /boot/grub2/grub.cfg'], ['Rien, c\'est lu au démarrage', 'Walou', 'Nothing'], ['Éditer grub.cfg à la main', 'Beddel grub.cfg b yeddek', 'Edit grub.cfg by hand'], ['Redémarrer systemd', 'Restart systemd', 'Restart systemd']], 0,
    ['GRUB2 ne lit que **/boot/grub2/grub.cfg**, fichier **généré** à partir de **/etc/default/grub** et des scripts **/etc/grub.d/** par **grub2-mkconfig**. On n\'édite jamais grub.cfg.', '**grub2-mkconfig -o /boot/grub2/grub.cfg**.', '**grub2-mkconfig -o /boot/grub2/grub.cfg**.'],
    [['/etc/default/grub n\'est pas lu au démarrage.', 'Ma kayt9rach.', 'Not read at boot.'], ['Écrasé à la prochaine génération.', 'Ghaytmse7.', 'Overwritten.'], ['Sans rapport.', 'Ma 3ndha 3la9a.', 'Unrelated.']], ['grub']),
  single('ld-07', 2, ['GRUB_DEFAULT=saved signifie :', 'GRUB_DEFAULT=saved ya3ni :', 'GRUB_DEFAULT=saved means:'],
    [['Démarrer par défaut la dernière entrée enregistrée (activée)', 'Akhir entrée msjjla', 'Boot the last saved entry'], ['Démarrer la première entrée', 'Lowla', 'The first entry'], ['Sauvegarder grub.cfg', 'Sauvegarder', 'Back up grub.cfg'], ['Désactiver le menu', 'Bla menu', 'Hide the menu']], 0,
    ['GRUB_DEFAULT accepte un **numéro** (0 = première entrée), un **nom** d\'entrée ou **saved** (dernière entrée enregistrée dans grubenv). GRUB_TIMEOUT = secondes avant le choix par défaut.', 'Numéro, nom wla **saved**.', 'Number, name or **saved**.'],
    [['C\'est GRUB_DEFAULT=0.', 'GRUB_DEFAULT=0.', 'That is 0.'], ['Aucun rapport avec une sauvegarde.', 'Machi sauvegarde.', 'Not a backup.'], ['C\'est GRUB_TIMEOUT_STYLE=hidden / timeout.', 'TIMEOUT_STYLE.', 'That is TIMEOUT_STYLE.']], ['grub']),
  single('ld-08', 2, ['Pourquoi le noyau a-t-il besoin de l\'initramfs ?', '3lach noyau khasso initramfs ?', 'Why does the kernel need initramfs?'],
    [['Il contient les pilotes (modules) nécessaires pour accéder au vrai / et le monter', 'Fih pilotes bach ymonti / l7a9i9i', 'It holds the drivers needed to mount the real /'], ['Il contient les comptes utilisateurs', 'Fih users', 'User accounts'], ['C\'est la configuration de GRUB', 'Config GRUB', 'GRUB config'], ['C\'est le swap', 'Swap', 'It is swap']], 0,
    ['Les pilotes sont des **modules** (fichiers) : pour les charger il faut un système de fichiers… déjà monté. L\'**initramfs** (*initial RAM filesystem*, ancien nom initrd) est une **racine temporaire en mémoire**, chargée par GRUB avec le noyau (`vmlinuz`), qui contient le strict minimum (pilotes disque, LVM, chiffrement) pour monter le vrai **/** puis lancer `/init`.', '**Racine temporaire** f mémoire b pilotes bach ymonti /.', 'A **temporary root** in RAM with the drivers to mount /.'],
    [['Les comptes sont dans /etc/passwd.', '/etc/passwd.', '/etc/passwd.'], ['C\'est grub.cfg.', 'grub.cfg.', 'grub.cfg.'], ['Sans rapport.', 'Walou.', 'Unrelated.']], ['initramfs']),
  single('ld-09', 2, ['Message « Kernel panic - not syncing: No working init found » : que s\'est-il passé ?', '« Kernel panic … No working init found » : chnou w9e3 ?', '"Kernel panic … No working init found": what happened?'],
    [['Le noyau n\'a pas trouvé le programme du PID 1 (init/systemd)', 'Noyau ma l9ach PID 1', 'The kernel did not find the PID 1 program'], ['GRUB est absent', 'Bla GRUB', 'GRUB is missing'], ['Le BIOS a échoué au POST', 'POST', 'POST failed'], ['Un service a planté', 'Service', 'A service crashed']], 0,
    ['Le **PID 1** est le **seul processus lancé par le noyau** : il initialise tout le reste. S\'il est introuvable, le noyau **panique**.', 'PID 1 ma kaynch → **panic**.', 'No PID 1 → **panic**.'],
    [['GRUB a fonctionné puisque le noyau tourne.', 'GRUB khdem.', 'GRUB worked.'], ['Le POST est bien avant le noyau.', 'POST 9bel.', 'POST is much earlier.'], ['Un service qui plante est géré par systemd (failed).', 'systemd.', 'systemd handles it.']], ['pid1']),
  cmd('ld-10', 1, ['Affiche l\'arbre des processus (pour voir le gestionnaire de services au sommet).', 'Werri chajara dyal processus.', 'Show the process tree.'],
    ['pstree', 'pstree -p'], ['Au sommet : **systemd** (PID 1). `pstree -p` ajoute les PID. `ps -p 1` le confirme aussi.', 'Fo9 : **systemd**.', 'Top: **systemd**.'],
    { 'ps aux': ['Liste les processus mais pas sous forme d\'arbre.', 'Liste machi chajara.', 'A list, not a tree.'] }, ['pid1']),
  single('ld-11', 2, ['SysVinit : niveau d\'exécution 3 =', 'SysVinit : runlevel 3 =', 'SysVinit runlevel 3 ='],
    [['Multi-utilisateurs complet en mode texte (sans interface graphique)', 'Multi-users texte', 'Full multi-user, text mode'], ['Arrêt', 'Arrêt', 'Halt'], ['Graphique', 'Graphique', 'Graphical'], ['Redémarrage', 'Redémarrage', 'Reboot']], 0,
    ['0 arrêt · 1 (s, S) mono-utilisateur (maintenance, root seul) · 2 non utilisé · **3 multi-utilisateurs texte** · 4 non utilisé · 5 multi-utilisateurs graphique · 6 redémarrage. Le niveau par défaut était `initdefault` dans **/etc/inittab**.', '**3 = multi-users texte** ; 5 graphique ; 0 arrêt ; 6 reboot.', '**3 = multi-user text**; 5 graphical.'],
    [['Arrêt = 0.', '0.', '0.'], ['Graphique = 5.', '5.', '5.'], ['Redémarrage = 6.', '6.', '6.']], ['sysvinit']),
  multi('ld-12', 2, ['Défauts de SysVinit qui ont mené à systemd ?', 'Mochkil dyal SysVinit ?', 'SysVinit drawbacks?'],
    [['Démarrage séquentiel des services', 'Séquentiel', 'Sequential start'], ['Gestion des dépendances très basique', 'Dépendances basiques', 'Basic dependencies'], ['Presque tout en scripts shell : lent', 'Scripts shell : bti2', 'Shell scripts: slow'], ['Impossible de redémarrer la machine', 'Ma y9derch reboot', 'Cannot reboot']], [0, 1, 2],
    ['Démarrage **séquentiel**, dépendances **basiques**, tout en **scripts shell** → lent. systemd **parallélise** (sockets), **uniformise** et accélère le démarrage.', 'Séquentiel, dépendances, scripts → systemd parallèle.', 'Sequential, basic deps, scripts → systemd parallel.'],
    [['init 6 redémarre très bien.', 'init 6 khddam.', 'init 6 reboots.']], ['sysvinit']),
  single('ld-13', 2, ['Équivalent systemd du niveau d\'exécution 5 ?', 'systemd dyal runlevel 5 ?', 'systemd equivalent of runlevel 5?'],
    [['graphical.target', 'graphical.target', 'graphical.target'], ['multi-user.target', 'multi-user.target', 'multi-user.target'], ['rescue.target', 'rescue.target', 'rescue.target'], ['default.service', 'default.service', 'default.service']], 0,
    ['0 → **poweroff.target** · 1 → **rescue.target** · 3 → **multi-user.target** · 5 → **graphical.target** · 6 → **reboot.target**. graphical.target requiert multi-user.target.', '5 → **graphical.target**.', '5 → **graphical.target**.'],
    [['C\'est le 3.', '3.', '3.'], ['C\'est le 1.', '1.', '1.'], ['N\'existe pas.', 'Ma kaynch.', 'Does not exist.']], ['systemd']),
  cmd('ld-14', 2, ['Fais démarrer la machine en mode texte multi-utilisateurs à chaque démarrage.', 'Khalli machine tbda f mode texte dima.', 'Make the machine boot in multi-user text mode.'],
    ['systemctl set-default multi-user.target'], ['`set-default` change le lien `default.target` (permanent). `systemctl get-default` vérifie. Pour changer **tout de suite** sans redémarrer : `systemctl isolate multi-user.target`.', '`set-default` = dima ; `isolate` = daba.', '`set-default` = permanent; `isolate` = now.'],
    { 'systemctl isolate multi-user.target': ['Change maintenant, mais pas au prochain démarrage.', 'Daba walakin machi dima.', 'Now only, not permanent.'], 'init 3': ['Ancienne commande SysVinit, non permanente.', 'Ancienne, machi dima.', 'Old and not permanent.'] }, ['systemd']),
  multi('ld-15', 2, ['Types d\'unités systemd ?', 'Types dyal unités ?', 'systemd unit types?'],
    [['.service', '.service', '.service'], ['.target', '.target', '.target'], ['.socket', '.socket', '.socket'], ['.mount', '.mount', '.mount'], ['.runlevel', '.runlevel', '.runlevel']], [0, 1, 2, 3],
    ['Une **unité** = un fichier de configuration : **service** (processus), **socket**, **target** (groupe d\'unités, remplace les runlevels), **mount** / **automount** (montages, depuis fstab), snapshot…', 'service, socket, target, mount…', 'service, socket, target, mount…'],
    [['Les runlevels sont remplacés par des targets.', 'Runlevels → targets.', 'Runlevels became targets.']], ['systemd']),
  single('ld-16', 2, ['Où mettre un fichier .service écrit ou modifié par l\'administrateur ?', 'Fin t7ett .service dyalek ?', 'Where does an admin-written .service go?'],
    [['/etc/systemd/system/', '/etc/systemd/system/', '/etc/systemd/system/'], ['/usr/lib/systemd/system/', '/usr/lib/systemd/system/', '/usr/lib/systemd/system/'], ['/etc/init.d/', '/etc/init.d/', '/etc/init.d/'], ['/boot/', '/boot/', '/boot/']], 0,
    ['**/usr/lib/systemd/system** = unités fournies par le système et les paquets ; **/etc/systemd/system** = unités **personnalisées/modifiées par l\'admin** (prioritaires). Après modification : `systemctl daemon-reload`.', '/etc/systemd/system (admin) ; /usr/lib (paquets).', '/etc/systemd/system (admin); /usr/lib (packages).'],
    [['Réservé aux paquets (écrasé lors des mises à jour).', 'Dyal paquets.', 'Package files.'], ['Scripts SysVinit.', 'SysVinit.', 'SysVinit scripts.'], ['Démarrage.', 'Démarrage.', 'Boot files.']], ['systemd']),
  single('ld-17', 2, ['Différence entre enable et start ?', 'Far9 bin enable w start ?', 'enable vs start?'],
    [['start lance maintenant ; enable lance à chaque démarrage', 'start daba ; enable f kol démarrage', 'start now; enable at every boot'], ['Aucune', 'Walou', 'None'], ['enable lance maintenant', 'enable daba', 'enable starts now'], ['start est permanent', 'start dima', 'start is permanent']], 0,
    ['`start` = **maintenant** (jusqu\'au prochain arrêt) ; `enable` = **au démarrage** (lien vers la cible de WantedBy). Les deux : `systemctl enable --now httpd`.', 'start = daba ; enable = démarrage ; `enable --now` = jouj.', 'start = now; enable = boot; `enable --now` = both.'],
    [['Ce sont deux choses différentes.', 'Mkhtalfin.', 'Different.'], ['Non, sauf avec --now.', 'Ghir b --now.', 'Only with --now.'], ['Non : start disparaît au redémarrage.', 'start kaymchi.', 'start is lost at reboot.']], ['systemd']),
  cmd('ld-18', 2, ['Affiche les erreurs (et plus grave) du démarrage précédent.', 'Werri erreurs dyal démarrage li 9bel.', 'Show errors (or worse) from the previous boot.'],
    ['journalctl -b -1 -p err', 'journalctl -p err -b -1'], ['`-b -1` = boot précédent (`-b` seul = actuel, `--list-boots` pour la liste) ; `-p err` = priorité err et plus grave. Priorités : emerg 0, alert 1, crit 2, err 3, warning 4, notice 5, info 6, debug 7.', '`-b -1` boot li 9bel ; `-p err`.', '`-b -1` previous boot; `-p err`.'],
    { 'journalctl -b -p err': ['C\'est le démarrage actuel, pas le précédent.', 'Hada daba.', 'That is the current boot.'], 'journalctl -p err': ['Toutes les sessions mélangées.', 'Kolchi mkhalet.', 'All boots mixed.'] }, ['journal']),
  cmd('ld-19', 2, ['Suis en direct les messages du service sshd.', 'Tb3 messages dyal sshd f direct.', 'Follow sshd messages live.'],
    ['journalctl -u sshd -f', 'journalctl -fu sshd', 'journalctl -f -u sshd'], ['`-u` = unité, `-f` = *follow* (comme tail -f).', '`-u` unité, `-f` direct.', '`-u` unit, `-f` follow.'],
    { 'journalctl -u sshd': ['Affiche l\'historique, sans suivre.', 'Bla -f.', 'Without -f.'] }, ['journal']),
  cmd('ld-20', 2, ['Programme un redémarrage dans 10 minutes avec le message « Maintenance ».', 'Brmej reboot f 10 d9ay9 b message « Maintenance ».', 'Schedule a reboot in 10 minutes with the message "Maintenance".'],
    ['shutdown -r +10 "Maintenance"', "shutdown -r +10 'Maintenance'", 'shutdown -r +10 Maintenance'], ['`shutdown [OPTION] [HEURE] [MESSAGE]` : `-r` redémarrer, `-h` arrêter, `-P` éteindre, `-c` annuler ; heure `hh:mm` ou `+mm`.', '`-r` reboot, `+10` d9ay9, message.', '`-r` reboot, `+10` minutes, message.'],
    { 'shutdown -h +10 "Maintenance"': ['-h arrête au lieu de redémarrer.', '-h = arrêt.', '-h halts.'], 'reboot': ['Redémarre immédiatement, sans délai ni message.', 'Daba bla message.', 'Immediately.'] }, ['arret']),
  single('ld-21', 2, ['systemctl halt ou systemctl poweroff ?', 'halt wla poweroff ?', 'halt or poweroff?'],
    [['halt arrête le CPU mais laisse la machine sous tension ; poweroff coupe l\'alimentation', 'halt bla coupure ; poweroff kay9te3 tension', 'halt keeps power; poweroff cuts it'], ['Identiques', 'Nefs l7aja', 'Identical'], ['halt redémarre', 'halt reboot', 'halt reboots'], ['poweroff met en veille', 'poweroff veille', 'poweroff sleeps']], 0,
    ['**poweroff** : arrêt + signal ACPI qui **coupe l\'alimentation**. **halt** : arrête le CPU mais **laisse sous tension** (maintenance bas niveau). `--no-wall` évite le message aux utilisateurs.', 'poweroff kay9te3 ; halt ma kay9te3ch.', 'poweroff cuts power; halt does not.'],
    [['Ils diffèrent sur l\'alimentation.', 'Kayn far9.', 'They differ.'], ['C\'est reboot.', 'reboot.', 'That is reboot.'], ['C\'est suspend.', 'suspend.', 'That is suspend.']], ['arret']),
  single('ld-22', 2, ['suspend ou hibernate ?', 'suspend wla hibernate ?', 'suspend or hibernate?'],
    [['suspend garde l\'état en RAM (rapide, perdu en cas de coupure) ; hibernate l\'écrit sur disque (swap) et éteint', 'suspend f RAM ; hibernate f disque', 'suspend keeps RAM; hibernate writes to disk'], ['Identiques', 'Nefs l7aja', 'Identical'], ['hibernate est plus rapide à reprendre', 'hibernate sri3', 'hibernate resumes faster'], ['suspend éteint complètement', 'suspend kayt-fi', 'suspend powers off']], 0,
    ['**suspend** : état en **RAM**, reprise rapide, vulnérable aux coupures. **hibernate** : état sur **disque**, machine éteinte, reprise plus lente. **hybrid-sleep** : les deux. Les bloquer : `systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`.', 'suspend RAM ; hibernate disque ; mask bach tbloqui.', 'suspend RAM; hibernate disk; mask to block.'],
    [['Différents.', 'Mkhtalfin.', 'Different.'], ['C\'est l\'inverse.', 'L3aks.', 'The opposite.'], ['suspend garde la RAM alimentée.', 'RAM b tension.', 'RAM stays powered.']], ['arret'])
];

export const exercises = [
  ex('lx-d-1', 2, ['Raconter le démarrage d\'une machine UEFI', 'Ch7a démarrage UEFI', 'Explain a UEFI boot'],
    ['Une VM RHEL 9 démarre en UEFI. Décrivez chaque étape, de la mise sous tension jusqu\'à l\'écran de connexion graphique, en citant à chaque fois le **fichier** ou le **composant** concerné.', 'VM RHEL 9 UEFI : ch7a kol marhala mn tension 7ta écran de connexion, b **fichier** wla **composant**.', 'A RHEL 9 VM boots in UEFI. Describe each step up to the graphical login, naming the **file** or **component**.'],
    [['5 étapes : firmware, chargeur, noyau, PID 1, cible.', '5 marahil.', '5 steps.']],
    [{ t: ['Réponse', 'Jawab', 'Answer'], b: ['1) **UEFI** : POST, lit la **GPT**, monte l\'**ESP /boot/efi**, lance **/boot/efi/EFI/redhat/grubx64.efi**. 2) **GRUB2** lit **/boot/grub2/grub.cfg** (menu, GRUB_TIMEOUT), charge **/boot/vmlinuz-…** et **/boot/initramfs-….img**, passe les paramètres (GRUB_CMDLINE_LINUX). 3) **Noyau** : détecte le matériel, monte l\'**initramfs** comme racine temporaire, charge les pilotes, monte le vrai **/**. 4) Lance **PID 1 = systemd** (/usr/lib/systemd/systemd). 5) systemd démarre en **parallèle** les unités jusqu\'à **default.target** (ici graphical.target → gdm).', 'UEFI → GRUB2 (grub.cfg, vmlinuz, initramfs) → noyau (monte /) → systemd → graphical.target.', 'UEFI → GRUB2 → kernel → systemd → graphical.target.'], code: '[ -d /sys/firmware/efi ] && echo UEFI || echo BIOS\nls /boot /boot/efi/EFI/redhat\ncat /proc/cmdline\nsystemctl get-default\nsystemd-analyze blame | head' }],
    ['UEFI (GPT, ESP, grubx64.efi) → GRUB2 (/boot/grub2/grub.cfg → vmlinuz + initramfs) → noyau (initramfs puis /) → systemd PID 1 → default.target.', 'UEFI → GRUB2 → noyau → systemd → cible.', 'UEFI → GRUB2 → kernel → systemd → target.'],
    [['Oublier l\'initramfs ou le confondre avec /boot.', 'Nsiti initramfs.', 'Forgetting initramfs.'], ['Dire que GRUB lance les services.', 'GRUB kaylanci services : ghalat.', 'Saying GRUB starts services.']]),
  ex('lx-d-2', 2, ['Modifier le menu GRUB2', 'Beddel menu GRUB2', 'Change the GRUB2 menu'],
    ['1) Affichez le menu GRUB pendant **10 secondes**. 2) Démarrez par défaut sur la **dernière entrée choisie**. 3) Gardez l\'option noyau **quiet** et retirez **rhgb**. 4) Appliquez et vérifiez. Donnez les commandes et les lignes modifiées.', '1) Menu **10 s**. 2) Par défaut : **akhir entrée**. 3) Zid **quiet**, 7iyed **rhgb**. 4) Appliquer w t2akked.', '1) Menu for **10 s**. 2) Default: **last chosen entry**. 3) Keep **quiet**, remove **rhgb**. 4) Apply and check.'],
    [['Tout se règle dans /etc/default/grub, puis une seule commande génère grub.cfg.', '/etc/default/grub, mn ba3d grub2-mkconfig.', '/etc/default/grub, then grub2-mkconfig.']],
    [{ t: ['Modifier /etc/default/grub', 'Beddel /etc/default/grub', 'Edit /etc/default/grub'], b: ['Sauvegarde, puis lignes : GRUB_TIMEOUT=10 · GRUB_DEFAULT=saved · GRUB_TIMEOUT_STYLE=menu · GRUB_CMDLINE_LINUX sans rhgb, avec quiet.', 'TIMEOUT=10, DEFAULT=saved, CMDLINE bla rhgb.', 'TIMEOUT=10, DEFAULT=saved, CMDLINE without rhgb.'], code: 'cp -p /etc/default/grub /etc/default/grub.bak\nvi /etc/default/grub\n# GRUB_TIMEOUT=10\n# GRUB_DEFAULT=saved\n# GRUB_TIMEOUT_STYLE=menu\n# GRUB_CMDLINE_LINUX="... quiet"     (rhgb retiré)' },
     { t: ['Appliquer et vérifier', 'Appliquer w t2akked', 'Apply and check'], b: ['Régénérer grub.cfg puis contrôler.', 'grub2-mkconfig, mn ba3d grep.', 'Regenerate and check.'], code: 'grub2-mkconfig -o /boot/grub2/grub.cfg\ngrep -E "timeout|default" /boot/grub2/grub.cfg | head\ngrubby --info=DEFAULT     # options du noyau par défaut\nreboot                    # puis cat /proc/cmdline' }],
    ['/etc/default/grub : GRUB_TIMEOUT=10, GRUB_DEFAULT=saved, GRUB_CMDLINE_LINUX sans rhgb ; grub2-mkconfig -o /boot/grub2/grub.cfg ; vérif : grubby --info=DEFAULT, /proc/cmdline.', 'TIMEOUT, DEFAULT, CMDLINE ; grub2-mkconfig.', 'TIMEOUT, DEFAULT, CMDLINE; grub2-mkconfig.'],
    [['Éditer /boot/grub2/grub.cfg directement.', 'Tbeddel grub.cfg.', 'Editing grub.cfg.'], ['Oublier -o : rien n\'est écrit.', 'Nsiti -o.', 'Forgetting -o.']]),
  ex('lx-d-3', 2, ['Créer et activer un service systemd', 'Dir service systemd', 'Create and enable a systemd service'],
    ['Le script **/usr/local/bin/sauvegarde.sh** doit tourner comme service : démarré après le réseau, relancé s\'il échoue, lancé à chaque démarrage en mode multi-utilisateurs. 1) Écrivez l\'unité **sauvegarde.service** et dites où la placer. 2) Donnez les commandes pour la prendre en compte, la lancer maintenant et au démarrage. 3) Comment voir son état et ses logs ?', 'Script **/usr/local/bin/sauvegarde.sh** : service mor réseau, restart ila fchel, f kol démarrage. 1) Kteb **sauvegarde.service** w fin. 2) Commandes. 3) État w logs.', 'Make **/usr/local/bin/sauvegarde.sh** a service: after network, restart on failure, at every multi-user boot. 1) Write the unit and where. 2) Commands. 3) Status and logs.'],
    [['Trois sections : [Unit], [Service], [Install].', '3 sections.', 'Three sections.']],
    [{ t: ['1) Le fichier', '1) Fichier', '1) The file'], b: ['Dans **/etc/systemd/system/** (unités de l\'admin).', 'F **/etc/systemd/system/**.', 'In **/etc/systemd/system/**.'], code: '# /etc/systemd/system/sauvegarde.service\n[Unit]\nDescription=Sauvegarde\nAfter=network.target\n\n[Service]\nType=simple\nExecStart=/usr/local/bin/sauvegarde.sh\nRestart=on-failure\n\n[Install]\nWantedBy=multi-user.target' },
     { t: ['2–3) Commandes', '2–3) Commandes', '2–3) Commands'], b: ['daemon-reload après toute création/modification ; enable --now = démarrage + maintenant.', 'daemon-reload, enable --now, status, journalctl -u.', 'daemon-reload, enable --now, status, journalctl -u.'], code: 'systemctl daemon-reload\nsystemctl enable --now sauvegarde.service\nsystemctl status sauvegarde\nsystemctl is-enabled sauvegarde; systemctl is-active sauvegarde\njournalctl -u sauvegarde -f' }],
    ['/etc/systemd/system/sauvegarde.service ([Unit] After=network.target · [Service] ExecStart, Restart=on-failure · [Install] WantedBy=multi-user.target) ; daemon-reload ; enable --now ; status ; journalctl -u sauvegarde.', '[Unit]/[Service]/[Install] ; daemon-reload ; enable --now.', '[Unit]/[Service]/[Install]; daemon-reload; enable --now.'],
    [['Oublier daemon-reload : systemd ne voit pas le nouveau fichier.', 'Nsiti daemon-reload.', 'Forgetting daemon-reload.'], ['Oublier [Install] : enable n\'a rien à activer.', 'Bla [Install].', 'No [Install] section.']]),
  ex('lx-d-4', 3, ['Diagnostiquer une panne avec journalctl', 'Diagnostic b journalctl', 'Troubleshoot with journalctl'],
    ['14h30 : le service web **nginx** est inaccessible depuis environ 30 minutes, et la machine a redémarré seule cette nuit. Donnez, dans l\'ordre, les commandes pour : 1) voir l\'état du service ; 2) les erreurs des 30 dernières minutes ; 3) les 50 derniers messages de nginx ; 4) les erreurs du démarrage précédent ; 5) relancer et surveiller en direct.', 'nginx ma khddamch hadi 30 d9i9a, w machine dart reboot f lil. Commandes : 1) état ; 2) erreurs 30 min ; 3) 50 messages nginx ; 4) erreurs boot li 9bel ; 5) restart w surveillance.', 'nginx down for ~30 min and the machine rebooted overnight. Commands: 1) status; 2) last 30 min errors; 3) last 50 nginx lines; 4) previous boot errors; 5) restart and follow.'],
    [['Filtres : -u (unité), -p (priorité), --since, -n, -b, -f.', '-u, -p, --since, -n, -b, -f.', '-u, -p, --since, -n, -b, -f.']],
    [{ t: ['Commandes', 'Commandes', 'Commands'], b: ['Du plus général au plus ciblé, puis action et vérification.', 'Mn 3am l khass.', 'From general to specific.'], code: 'systemctl status nginx                       # 1\njournalctl --since "30 minutes ago" -p err   # 2\njournalctl -u nginx -n 50                    # 3\njournalctl -b -1 -p err                      # 4\nsystemctl restart nginx                      # 5\njournalctl -u nginx -f' }],
    ['status nginx · journalctl --since "30 minutes ago" -p err · journalctl -u nginx -n 50 · journalctl -b -1 -p err · systemctl restart nginx + journalctl -u nginx -f.', 'status, --since, -n 50, -b -1, restart + -f.', 'status, --since, -n 50, -b -1, restart + -f.'],
    [['Redémarrer la machine avant de lire les logs (on perd des indices).', 'Reboot 9bel logs.', 'Rebooting before reading logs.']])
];

export const flashcards = [
  fc('fc-ld-1', ['Runlevel 3 / 5 en systemd ?', 'Runlevel 3/5 ?', 'Runlevel 3/5?'], ['multi-user.target / graphical.target', 'multi-user / graphical', 'multi-user / graphical'])
];

export const reference = [
  ref('r-boot-1', 'BIOS/UEFI → GRUB2 → noyau + initramfs → PID 1 systemd → default.target', ['Séquence de démarrage', 'Démarrage', 'Boot sequence']),
  ref('r-boot-2', '/etc/default/grub · /etc/grub.d/ · grub2-mkconfig -o /boot/grub2/grub.cfg', ['Configurer GRUB2', 'GRUB2', 'Configure GRUB2']),
  ref('r-boot-3', '0 poweroff · 1 rescue · 3 multi-user · 5 graphical · 6 reboot (.target)', ['Runlevels → cibles', 'Runlevels → targets', 'Runlevels → targets']),
  ref('r-boot-4', 'systemctl get-default · set-default X.target · isolate X.target', ['Cible par défaut / immédiate', 'Cible', 'Default / immediate target']),
  ref('r-boot-5', 'systemctl start|stop|restart|reload|enable|disable|mask|status · daemon-reload', ['Gérer un service', 'Services', 'Manage a service']),
  ref('r-boot-6', 'journalctl -b [-1] · -u svc · -p err · --since "1 hour ago" · -n 50 · -f', ['Journaux', 'Logs', 'Logs']),
  ref('r-boot-7', 'shutdown -r|-h|-P|-c [hh:mm|+mm] "msg" · systemctl poweroff|halt|reboot|suspend|hibernate', ['Arrêt du système', 'Arrêt', 'Shutdown'])
];

export const chapter: Chapter = {
  id: 'demarrage',
  module: 'linux',
  order: 2.5,
  title: L(['Chap 2 — Processus de démarrage (GRUB2, systemd)', 'Fasl 2 — Démarrage (GRUB2, systemd)', 'Ch. 2 — The boot process (GRUB2, systemd)']),
  summary: L([
    'Au CC : BIOS/UEFI, MBR/GPT, GRUB2 et ses fichiers, noyau et initramfs, PID 1, SysVinit (niveaux 0–6) puis systemd (unités, cibles, services), arrêt du système et journalctl.',
    'F CC : BIOS/UEFI, MBR/GPT, GRUB2, noyau w initramfs, PID 1, SysVinit (0–6), systemd (unités, targets, services), arrêt w journalctl.',
    'In the test: BIOS/UEFI, MBR/GPT, GRUB2 files, kernel and initramfs, PID 1, SysVinit (0–6) then systemd (units, targets, services), shutdown and journalctl.'
  ]),
  estimatedMinutes: 55,
  sections: [
    key([
      '1. **5 étapes** : firmware **BIOS/UEFI** → chargeur **GRUB2** → **noyau + initramfs** → **PID 1 = systemd** → **cible par défaut**.\n2. BIOS lit le **MBR** (512 octets : code + table) ; UEFI lit la **GPT** et lance **/boot/efi/EFI/redhat/grubx64.efi**.\n3. GRUB2 : on modifie **/etc/default/grub** (et /etc/grub.d/), puis **grub2-mkconfig -o /boot/grub2/grub.cfg** ; jamais grub.cfg à la main.\n4. **initramfs** = racine temporaire en RAM avec les pilotes pour monter le vrai **/**.\n5. systemd remplace SysVinit : **unités** (.service, .target…), **cibles** à la place des niveaux (3 → multi-user, 5 → graphical) ; **systemctl** et **journalctl** pour tout piloter.',
      '1. **5 marahil** : **BIOS/UEFI** → **GRUB2** → **noyau + initramfs** → **systemd** → **cible**.\n2. BIOS → **MBR** (512 octets) ; UEFI → **GPT** → **grubx64.efi**.\n3. Beddel **/etc/default/grub** w **grub2-mkconfig -o /boot/grub2/grub.cfg**.\n4. **initramfs** = racine mo2a9ata f RAM.\n5. systemd : **unités**, **targets** (3 → multi-user, 5 → graphical) ; **systemctl** w **journalctl**.',
      '1. **5 steps**: **BIOS/UEFI** → **GRUB2** → **kernel + initramfs** → **systemd** → **default target**.\n2. BIOS → **MBR** (512 bytes); UEFI → **GPT** → **grubx64.efi**.\n3. Edit **/etc/default/grub**, run **grub2-mkconfig -o /boot/grub2/grub.cfg**.\n4. **initramfs** = temporary root in RAM.\n5. systemd: **units**, **targets** (3 → multi-user, 5 → graphical); **systemctl** and **journalctl**.'
    ]),

    p(['[Fiche PDF des commandes du CC à imprimer](/docs/linux-cc-commandes.pdf) (documents papier autorisés)', '[Fiche PDF dyal commandes](/docs/linux-cc-commandes.pdf) (documents autorisés)', '[Printable command sheet (PDF)](/docs/linux-cc-commandes.pdf) (paper documents allowed)']),
    h(['1. Les étapes du démarrage', '1. Marahil dyal démarrage', '1. The boot steps']),
    anim('BootSequence'),
    table([['Étape', 'Marhala', 'Step'], ['Composant', 'Composant', 'Component'], ['Ce qu\'il fait', 'Chnou kaydir', 'What it does']], [
      ['1. Pre-OS', 'BIOS / UEFI', ['POST, choix du périphérique de démarrage, lancement du chargeur', 'POST w lanci chargeur', 'POST, choose boot device, start the loader']],
      ['2. Boot loader', 'GRUB2 (LILO, GRUB…)', ['Menu, charge le noyau + initramfs, passe les paramètres', 'Menu, noyau + initramfs', 'Menu, loads kernel + initramfs']],
      ['3. Noyau', 'vmlinuz + initramfs', ['Détecte le matériel, monte l\'initramfs puis le vrai /', 'Matériel, monte /', 'Hardware, mounts /']],
      ['4. PID 1', 'systemd (SysVinit, Upstart)', ['Seul processus lancé par le noyau : initialise tout', 'Kay-initialisi kolchi', 'Initialises everything']],
      ['5. Prêt', 'default.target', ['Services lancés, écran de connexion', 'Services w login', 'Services up, login screen']]
    ]),
    quiz('ld-01'),

    h(['2. Le firmware : BIOS/MBR ou UEFI/GPT', '2. Firmware : BIOS/MBR wla UEFI/GPT', '2. Firmware: BIOS/MBR or UEFI/GPT']),
    p(['**BIOS** (*Basic Input Output System*, en ROM sur la carte mère) : **POST** (mémoire, clavier, disques…), on peut l\'interrompre pour le configurer (ex. touche DEL), puis il lit le **MBR** = **secteur 0, 512 octets** du disque de démarrage : **code d\'amorçage** (chargeur étape 1) + **table des partitions**. L\'étape 1 lance l\'étape 2 (GRUB) depuis **/boot**.', '**BIOS** : **POST**, mn ba3d **MBR** (512 octets : code + table) → GRUB f /boot.', '**BIOS**: **POST**, then the **MBR** (512 bytes: code + table) → GRUB in /boot.']),
    p(['**UEFI** (*Unified Extensible Firmware Interface*) remplace le BIOS : interface graphique, réseau, sécurité intégrée, écrit en C, support **GPT** (partitions > **2 To**). Il lit la GPT, monte l\'**ESP** = **/boot/efi** et lance **/boot/efi/EFI/redhat/grubx64.efi** (GRUB compilé pour UEFI). Mode **Legacy** possible sur les cartes récentes.', '**UEFI** : **GPT** (> 2 To), **ESP /boot/efi**, **grubx64.efi**.', '**UEFI**: **GPT** (> 2 TB), **ESP /boot/efi**, **grubx64.efi**.']),
    table([['Critère', 'Critère', 'Criterion'], ['BIOS + MBR', 'BIOS + MBR', 'BIOS + MBR'], ['UEFI + GPT', 'UEFI + GPT', 'UEFI + GPT']], [
      [['Lieu du chargeur', 'Fin chargeur', 'Loader location'], ['MBR (secteur 0)', 'MBR', 'MBR'], ['ESP /boot/efi (vfat)', 'ESP /boot/efi', 'ESP /boot/efi']],
      [['Taille max', 'Taille max', 'Max size'], '2 To', ['> 2 To', '> 2 To', '> 2 TB']],
      [['Partitions', 'Partitions', 'Partitions'], ['4 primaires (ou 3 + étendue)', '4 primaires', '4 primary'], ['128 par défaut', '128', '128 by default']],
      [['Vérifier', 'T2akked', 'Check'], '[ -d /sys/firmware/efi ] → BIOS', '[ -d /sys/firmware/efi ] → UEFI']
    ]),
    code('[ -d /sys/firmware/efi ] && echo UEFI || echo BIOS\nls /boot/efi/EFI/redhat/        # grubx64.efi, shimx64.efi (UEFI)\nlsblk -o NAME,SIZE,FSTYPE,MOUNTPOINT'),
    quiz('ld-02', 'ld-03', 'ld-04'),

    h(['3. Le chargeur de démarrage GRUB2', '3. Chargeur GRUB2', '3. The GRUB2 boot loader']),
    def(['Le **chargeur de démarrage** (*boot loader*) localise le noyau, le **charge en mémoire** avec l\'initramfs et le **lance**. Il permet aussi de choisir entre plusieurs noyaux/OS et de **passer des paramètres au noyau**. GRUB2 est installé automatiquement ; `os-prober` sert à trouver les autres systèmes.', '**Chargeur** : kaychargi noyau w initramfs w kaylancih ; ikhtiyar w paramètres.', 'The **boot loader** loads and starts the kernel and initramfs; lets you choose and pass parameters.']),
    table([['Fichier', 'Fichier', 'File'], ['Rôle', 'Dor', 'Role']], [
      ['/etc/default/grub', ['Paramètres du menu (VARIABLE=valeur) : on le modifie', 'Paramètres : hna katbeddel', 'Menu settings: you edit this']],
      ['/etc/grub.d/', ['Scripts qui génèrent le menu (00_header, 10_linux, 40_custom…)', 'Scripts dyal menu', 'Scripts that build the menu']],
      ['/boot/grub2/grub.cfg', ['Configuration finale **générée** : ne pas éditer', 'Finale **générée**', 'Final **generated** config']],
      ['/boot/vmlinuz-*', ['Noyau compressé', 'Noyau', 'Compressed kernel']],
      ['/boot/initramfs-*.img', ['Racine temporaire avec les pilotes', 'Racine mo2a9ata', 'Temporary root with drivers']]
    ]),
    table([['Variable', 'Variable', 'Variable'], ['Sens', 'Ma3na', 'Meaning']], [
      ['GRUB_TIMEOUT', ['Secondes avant de démarrer l\'entrée par défaut', 'Tawani 9bel default', 'Seconds before default']],
      ['GRUB_DEFAULT', ['Entrée par défaut : numéro (0 = 1re), nom ou saved (dernière choisie)', '0, smiya wla saved', '0, name or saved']],
      ['GRUB_DISTRIBUTOR', ['Titre des entrées du menu', 'Titre', 'Menu titles']],
      ['GRUB_DISABLE_SUBMENU', ['Une entrée par noyau, sans sous-menu', 'Bla sous-menu', 'No submenu']],
      ['GRUB_CMDLINE_LINUX', ['Arguments passés au noyau (ex. rhgb quiet)', 'Paramètres noyau', 'Kernel arguments']],
      ['GRUB_DISABLE_RECOVERY', ['true : pas d\'entrée Recovery', 'Bla Recovery', 'No Recovery entry']],
      ['GRUB_BACKGROUND', ['Image d\'arrière-plan', 'Image', 'Background image']]
    ]),
    anim('GrubConfigFlow'),
    code(`cp -p /etc/default/grub /etc/default/grub.bak     # 1. sauvegarder
vi /etc/default/grub                               # 2. GRUB_TIMEOUT=10, GRUB_DEFAULT=saved…
grub2-mkconfig -o /boot/grub2/grub.cfg            # 3. régénérer
grubby --default-kernel ; cat /proc/cmdline        # 4. vérifier (après reboot)`, 'bash', ['Modifier GRUB2 en 4 étapes', 'GRUB2 f 4 marahil', 'Change GRUB2 in 4 steps']),
    tip(['Les détails pratiques (entrées personnalisées 40_custom, mot de passe GRUB, réinitialiser le mot de passe root avec rd.break) sont dans le chapitre **TP2 — GRUB2**.', 'Tafassil f **TP2 — GRUB2**.', 'Hands-on details are in **TP2 — GRUB2**.']),
    quiz('ld-05', 'ld-06', 'ld-07'),

    h(['4. Noyau, initramfs et PID 1', '4. Noyau, initramfs w PID 1', '4. Kernel, initramfs and PID 1']),
    p(['Le noyau (`vmlinuz`, version compressée de `vmlinux`) doit monter **/**, mais les **pilotes** du disque sont des **modules** (fichiers)… sur ce même disque. Solution : l\'**initramfs** (*INITial RAM FileSystem*, ancien nom **initrd**), image chargée en mémoire par GRUB : **racine temporaire** avec le strict minimum (pilotes disque, LVM, partitions chiffrées). Le noyau la monte sur /, lance `/init`, puis bascule sur le vrai /.', '**initramfs** = racine mo2a9ata f RAM b pilotes ; noyau kaymontiha, mn ba3d / l7a9i9i.', '**initramfs** = temporary root in RAM with drivers; then the real /.']),
    p(['Le noyau lance ensuite le **premier processus, PID 1** : le **seul** lancé par le noyau, chargé de tout initialiser et de lancer les services. Sans lui : **Kernel panic - not syncing: No working init found**. `pstree` montre au sommet le gestionnaire utilisé : **SysVinit** (historique), **Upstart** (2006, Ubuntu) ou **systemd** (2010, RHEL 7+).', '**PID 1** = l processus lowel ; bla bih → **kernel panic**. SysVinit, Upstart, **systemd**.', '**PID 1** is the first process; without it → **kernel panic**. SysVinit, Upstart, **systemd**.']),
    code('ls -lh /boot/vmlinuz-* /boot/initramfs-*\nlsinitrd | head          # contenu de l\'initramfs\npstree | head -3         # systemd au sommet\nps -p 1 -o pid,comm'),
    quiz('ld-08', 'ld-09', 'ld-10'),

    h(['5. SysVinit : l\'ancien système (niveaux d\'exécution)', '5. SysVinit : niveaux', '5. SysVinit: runlevels']),
    table([['Niveau', 'Niveau', 'Level'], ['Mode', 'Mode', 'Mode'], ['Cible systemd', 'Target systemd', 'systemd target']], [
      ['0', ['Arrêt', 'Arrêt', 'Halt'], 'poweroff.target'],
      ['1, s, S', ['Mono-utilisateur : maintenance, root seul', 'Mono-user : maintenance', 'Single user: maintenance'], 'rescue.target'],
      ['2, 4', ['Non utilisés (définissables)', 'Ma mst3mlinch', 'Unused'], 'multi-user.target'],
      ['3', ['Multi-utilisateurs, mode texte', 'Multi-users texte', 'Multi-user, text'], 'multi-user.target'],
      ['5', ['Multi-utilisateurs, mode graphique', 'Multi-users graphique', 'Multi-user, graphical'], 'graphical.target'],
      ['6', ['Redémarrage', 'Redémarrage', 'Reboot'], 'reboot.target']
    ]),
    p(['Fonctionnement : **/sbin/init** (PID 1) lit **/etc/inittab** (lignes `id:niveaux:action:processus`, ex. `id:5:initdefault:`), puis exécute **/etc/rc.d/rc N**, qui lance les liens de **/etc/rc.d/rcN.d/** : `Snn…` (start) et `Knn…` (kill), dans l\'ordre de nn, pointant vers les scripts de **/etc/init.d/**. Commandes : `init N` / `telinit N`, `runlevel` ou `who -r`.', '**init** → **/etc/inittab** → **/etc/rcN.d/** (S = start, K = kill) → **/etc/init.d/**. `init N`, `runlevel`.', '**init** → **/etc/inittab** → **/etc/rcN.d/** (S/K) → **/etc/init.d/**.']),
    trap(['Défauts : démarrage **séquentiel**, dépendances **basiques**, tout en **scripts shell** → lent. D\'où **systemd**.', 'Séquentiel, dépendances, scripts → bti2 → **systemd**.', 'Sequential, basic deps, shell scripts → slow → **systemd**.']),
    quiz('ld-11', 'ld-12'),

    h(['6. systemd : unités, cibles, services', '6. systemd : unités, targets, services', '6. systemd: units, targets, services']),
    p(['**systemd** (PID 1, remplace /sbin/init) **parallélise** le démarrage (une **socket** par service : les dépendants s\'y connectent avant même que le service soit prêt), **uniformise** la gestion des services entre distributions et reste compatible avec les scripts init.', '**systemd** : **parallèle** (sockets), **uniforme**.', '**systemd**: **parallel** (sockets), **uniform**.']),
    table([['Unité', 'Unité', 'Unit'], ['Rôle', 'Dor', 'Role']], [
      ['.service', ['Lancer et administrer un processus', 'Processus', 'A process']],
      ['.socket', ['Socket Unix ou réseau associée à un service', 'Socket', 'A socket']],
      ['.target', ['Groupe d\'unités : remplace les niveaux d\'exécution', 'Groupe = runlevel', 'Group = runlevel']],
      ['.mount / .automount', ['Montages (créés depuis /etc/fstab) / auto-montage', 'Montages', 'Mounts']],
      ['snapshot', ['Sauvegarder puis restaurer l\'état du système', 'État', 'System state']]
    ]),
    p(['Emplacements : **/usr/lib/systemd/system/** (unités fournies par les paquets) et **/etc/systemd/system/** (unités de l\'administrateur, prioritaires). Après toute création/modification : **systemctl daemon-reload**.', '/usr/lib/systemd/system (paquets) · /etc/systemd/system (admin) · daemon-reload.', '/usr/lib (packages) · /etc (admin) · daemon-reload.']),
    code(`# /etc/systemd/system/monservice.service
[Unit]                      # métadonnées et conditions de démarrage
Description=Mon Service Web
After=network.target

[Service]                   # comment exécuter le service
Type=simple
ExecStart=/usr/bin/mon-service
Restart=on-failure

[Install]                   # intégration au démarrage (enable)
WantedBy=multi-user.target`, 'ini', ['Les 3 sections d\'une unité .service', '3 sections', 'The 3 sections']),
    table([['Commande', 'Commande', 'Command'], ['Effet', 'Effet', 'Effect']], [
      ['systemctl status svc', ['État détaillé (diagnostic)', 'État', 'Status']],
      ['systemctl start | stop | restart | reload svc', ['Maintenant (reload = relire la config)', 'Daba', 'Now']],
      ['systemctl enable | disable svc', ['Au démarrage (--now : aussi maintenant)', 'F démarrage', 'At boot']],
      ['systemctl mask | unmask svc', ['Interdire tout démarrage / lever', 'Bloqui', 'Block']],
      ['systemctl is-active | is-enabled svc', ['Tests pour scripts', 'Tests', 'Checks']],
      ['systemctl get-default · set-default X.target', ['Cible par défaut (permanent)', 'Cible par défaut', 'Default target']],
      ['systemctl isolate X.target', ['Changer de cible maintenant (≈ init N)', 'Beddel daba', 'Switch now']],
      ['systemctl list-unit-files · list-units --type=service', ['Inventaire', 'Liste', 'Inventory']],
      ['systemd-analyze blame', ['Temps de démarrage par unité', 'Wa9t', 'Boot time per unit']]
    ]),
    p(['États d\'un service : **active**, **inactive**, **failed**, **masked**, **static** (ne s\'active pas seule, dépend d\'une autre unité), **alias**, **disabled**.', 'États : active, inactive, failed, masked, static, alias, disabled.', 'States: active, inactive, failed, masked, static, alias, disabled.']),
    anim('SystemdStates'),
    quiz('ld-13', 'ld-14', 'ld-15', 'ld-16', 'ld-17'),

    h(['7. Arrêter le système', '7. Arrêt dyal système', '7. Shutting down']),
    table([['Ancienne commande', 'Ancienne', 'Old'], ['systemctl', 'systemctl', 'systemctl'], ['Effet', 'Effet', 'Effect']], [
      ['halt', 'systemctl halt', ['Arrête le CPU, machine sous tension', 'CPU wa9ef, tension', 'CPU halted, power on']],
      ['poweroff', 'systemctl poweroff', ['Arrête et coupe l\'alimentation (ACPI)', 'Kay9te3 tension', 'Cuts power']],
      ['reboot', 'systemctl reboot', ['Redémarre', 'Redémarrage', 'Reboots']],
      ['pm-suspend', 'systemctl suspend', ['État en RAM', 'RAM', 'State in RAM']],
      ['pm-hibernate', 'systemctl hibernate', ['État sur disque, éteint', 'Disque', 'State on disk']],
      ['pm-suspend-hybrid', 'systemctl hybrid-sleep', ['Les deux', 'Jouj', 'Both']]
    ]),
    code(`shutdown -r +10 "Maintenance"   # redémarrer dans 10 min avec un message
shutdown -h 22:30                # arrêter à 22h30
shutdown -c                      # annuler
systemctl poweroff --no-wall     # sans prévenir les utilisateurs
systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target`, 'bash', ['shutdown [OPTION] [HEURE] [MESSAGE] — -r redémarrer, -h arrêter, -P éteindre, -c annuler, -f sans fsck, -F fsck forcé', 'shutdown : -r, -h, -P, -c', 'shutdown: -r, -h, -P, -c']),
    quiz('ld-20', 'ld-21', 'ld-22'),

    h(['8. Dépannage avec journalctl', '8. Dépannage b journalctl', '8. Troubleshooting with journalctl']),
    table([['Commande', 'Commande', 'Command'], ['Usage', 'Isti3mal', 'Use']], [
      ['journalctl -b / -b -1 / --list-boots', ['Démarrage actuel / précédent / liste', 'Boot daba / 9bel / liste', 'Current / previous boot / list']],
      ['journalctl -u nginx', ['Logs d\'un service', 'Logs service', 'One service']],
      ['journalctl -f', ['Suivre en direct', 'Direct', 'Follow']],
      ['journalctl -p err · -p warning..emerg', ['Par priorité', 'B priorité', 'By priority']],
      ['journalctl --since "1 hour ago" · --since "09:00" --until "10:00"', ['Par période', 'B wa9t', 'By time']],
      ['journalctl -n 50 · -o verbose', ['50 dernières lignes · métadonnées', '50 stour · tafassil', 'Last 50 · metadata']]
    ]),
    plain(['Priorités : **emerg 0 · alert 1 · crit 2 · err 3 · warning 4 · notice 5 · info 6 · debug 7** ; `-p err` = err **et plus grave**. Combinaisons utiles : `journalctl -u nginx -b`, `journalctl -b -1 -p err` (crash précédent), `journalctl -p err..alert --since today`.', 'Priorités 0 → 7 ; `-p err` = err w ktar.', 'Priorities 0 → 7; `-p err` = err and worse.']),
    exam(['Au CC, une question « panne » se rédige comme le cours : **diagnostic** (`systemctl status`), **recherche** (`journalctl` filtré), **action** (`restart`), **vérification** (`journalctl -f`).', 'Panne : status → journalctl → restart → -f.', 'Outage: status → journalctl → restart → -f.']),
    quiz('ld-18', 'ld-19')
  ],
  keyPoints: [
    L(['BIOS (POST, MBR 512 octets) ou UEFI (GPT, ESP /boot/efi, grubx64.efi) → GRUB2 → vmlinuz + initramfs → PID 1 systemd → default.target.', 'BIOS/UEFI → GRUB2 → noyau → systemd → cible.', 'BIOS/UEFI → GRUB2 → kernel → systemd → target.']),
    L(['GRUB2 : modifier /etc/default/grub (TIMEOUT, DEFAULT, CMDLINE_LINUX…) puis grub2-mkconfig -o /boot/grub2/grub.cfg.', '/etc/default/grub → grub2-mkconfig.', '/etc/default/grub → grub2-mkconfig.']),
    L(['SysVinit : /etc/inittab, /etc/rcN.d (S/K), niveaux 0–6 ; systemd : unités, cibles (3 → multi-user, 5 → graphical), parallèle.', 'SysVinit 0–6 → systemd targets.', 'SysVinit 0–6 → systemd targets.']),
    L(['systemctl start/enable/--now, mask, daemon-reload, get/set-default, isolate ; unités admin dans /etc/systemd/system.', 'systemctl ; /etc/systemd/system.', 'systemctl; /etc/systemd/system.']),
    L(['Arrêt : poweroff (coupe) / halt (CPU) / reboot / suspend (RAM) / hibernate (disque) ; shutdown -r +10 "msg" ; journalctl -b -1 -p err, -u svc -f.', 'poweroff, halt, shutdown, journalctl.', 'poweroff, halt, shutdown, journalctl.'])
  ]
};
