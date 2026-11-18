/** Texts of the Linux animations (fr / dar / en). */
export const BOOT = {
  title: { fr: 'Séquence de démarrage RHEL 9', dar: 'Kifach kayt3al RHEL 9', en: 'RHEL 9 boot sequence' },
  steps: [
    {
      name: { fr: 'BIOS / UEFI', dar: 'BIOS / UEFI', en: 'BIOS / UEFI' },
      text: { fr: 'Le firmware teste le matériel (POST) puis cherche un chargeur de démarrage. En **UEFI**, il lit la partition EFI (`/boot/efi`) et lance `shimx64.efi` → `grubx64.efi`. En BIOS, il lit le MBR du disque.', dar: 'Firmware kaytesti lmatériel (POST) w men b3d kaycherchi chargeur de démarrage. F **UEFI**, kay9ra partition EFI (`/boot/efi`) w kaylancé `shimx64.efi` → `grubx64.efi`. F BIOS, kay9ra MBR dyal disque.', en: 'The firmware tests the hardware (POST) then looks for a boot loader. With **UEFI** it reads the EFI partition (`/boot/efi`) and runs `shimx64.efi` → `grubx64.efi`. With BIOS it reads the disk MBR.' },
      files: ['/boot/efi/EFI/redhat/shimx64.efi', '/boot/efi/EFI/redhat/grubx64.efi', '[ -d /sys/firmware/efi ] && echo UEFI']
    },
    {
      name: { fr: 'GRUB2', dar: 'GRUB2', en: 'GRUB2' },
      text: { fr: 'GRUB2 affiche le **menu** (délai `GRUB_TIMEOUT`), lit sa configuration et permet d\'éditer l\'entrée avec `e` (c\'est là qu\'on ajoute `rd.break`). Il charge en mémoire le **noyau** et l\'**initramfs**, puis lui passe la main.', dar: 'GRUB2 kayban **menu** (b délai `GRUB_TIMEOUT`), kay9ra configuration dyalo w kaykhallik tbeddel entrée b `e` (hna fin kanzidou `rd.break`). Kaychargi f mémoire **noyau** w **initramfs**, w kay3tih lyed.', en: 'GRUB2 shows the **menu** (`GRUB_TIMEOUT` delay), reads its configuration and lets you edit the entry with `e` (that is where `rd.break` is added). It loads the **kernel** and the **initramfs** into memory, then hands over.' },
      files: ['/boot/grub2/grub.cfg', '/boot/efi/EFI/redhat/grub.cfg (relais)', '/boot/loader/entries/*.conf (BLS)', '/boot/grub2/grubenv']
    },
    {
      name: { fr: 'Noyau + initramfs', dar: 'Noyau + initramfs', en: 'Kernel + initramfs' },
      text: { fr: 'Le noyau `vmlinuz-…` se décompresse, initialise processeur, mémoire et pilotes. L\'**initramfs** est un mini-système en RAM qui contient les modules nécessaires pour monter la vraie racine (`/dev/mapper/rhel-root`, montée sur `/sysroot`).', dar: 'Noyau `vmlinuz-…` kayt7ell, kayinitialisé processeur, mémoire w pilotes. **Initramfs** howa mini-système f RAM fih les modules li khassin bach ymonti racine l7a9i9iya (`/dev/mapper/rhel-root`, f `/sysroot`).', en: 'The `vmlinuz-…` kernel decompresses and initialises CPU, memory and drivers. The **initramfs** is a mini-system in RAM holding the modules needed to mount the real root (`/dev/mapper/rhel-root`, mounted on `/sysroot`).' },
      files: ['/boot/vmlinuz-5.14.0-427.13.1.el9_4.x86_64', '/boot/initramfs-5.14.0-427.13.1.el9_4.x86_64.img', 'uname -r']
    },
    {
      name: { fr: 'systemd (PID 1)', dar: 'systemd (PID 1)', en: 'systemd (PID 1)' },
      text: { fr: 'Après le `switch_root`, le noyau lance **systemd**, premier processus (**PID 1**), père de tous les autres. Il démarre les unités (services, montages, sockets) en parallèle, selon leurs dépendances.', dar: 'Mor `switch_root`, noyau kaylancé **systemd**, awel processus (**PID 1**), bba dyal ga3 lokhrin. Kaybda les unités (services, montages, sockets) f nefs lwe9t, 3la 7sab dépendances dyalhom.', en: 'After `switch_root`, the kernel starts **systemd**, the first process (**PID 1**), parent of all others. It starts units (services, mounts, sockets) in parallel according to their dependencies.' },
      files: ['ps aux | head -2', 'systemctl --version', 'systemd-analyze blame']
    },
    {
      name: { fr: 'default.target', dar: 'default.target', en: 'default.target' },
      text: { fr: 'systemd atteint la cible par défaut : lien `/etc/systemd/system/default.target` → **graphical.target** (interface graphique, ancien niveau 5) ou **multi-user.target** (texte + réseau, ancien niveau 3). On la change avec `systemctl set-default`.', dar: 'systemd kaywsel l cible par défaut : lien `/etc/systemd/system/default.target` → **graphical.target** (interface graphique, niveau 5 l9dim) wla **multi-user.target** (texte + réseau, niveau 3 l9dim). Kanbeddlouha b `systemctl set-default`.', en: 'systemd reaches the default target: link `/etc/systemd/system/default.target` → **graphical.target** (GUI, old runlevel 5) or **multi-user.target** (text + network, old runlevel 3). Change it with `systemctl set-default`.' },
      files: ['systemctl get-default', 'systemctl set-default multi-user.target', 'ls -l /etc/systemd/system/default.target']
    }
  ]
};

export const ROOTRESET = {
  title: { fr: 'Réinitialiser le mot de passe root (rd.break)', dar: 'Beddel mot de passe dyal root (rd.break)', en: 'Reset the root password (rd.break)' },
  steps: [
    { cmd: 'e', text: { fr: 'Redémarrer. Dans le menu GRUB, sélectionner le noyau et appuyer sur **e** pour éditer l\'entrée.', dar: '3awed t3al. F menu GRUB, khtar noyau w brek 3la **e** bach tbeddel entrée.', en: 'Reboot. In the GRUB menu select the kernel and press **e** to edit the entry.' } },
    { cmd: 'linux ($root)/vmlinuz-… ro … rhgb quiet rd.break', text: { fr: 'Aller à la fin de la ligne qui commence par `linux` et ajouter **`rd.break`** : le démarrage s\'arrêtera dans l\'initramfs, avant le montage définitif de la racine.', dar: 'Sir l lekher dyal ster li kaybda b `linux` w zid **`rd.break`** : démarrage ghaywe9ef f initramfs, 9bel ma tmonta racine nihaiyan.', en: 'Go to the end of the line starting with `linux` and append **`rd.break`**: boot will stop inside the initramfs, before the root is finally mounted.' } },
    { cmd: 'Ctrl+X', text: { fr: '**Ctrl+X** démarre avec cette option (modification temporaire, non enregistrée).', dar: '**Ctrl+X** kaydémarré b had l option (tabdil mo2a9at, ma kaytsjjelch).', en: '**Ctrl+X** boots with this option (temporary change, not saved).' } },
    { cmd: 'mount -o remount,rw /sysroot', text: { fr: 'On obtient `switch_root:/#`. La vraie racine est montée sur `/sysroot` **en lecture seule** : on la remonte en lecture-écriture.', dar: 'Kayban `switch_root:/#`. Racine l7a9i9iya mmontiya f `/sysroot` **lecture seule** : kan3awdou nmontiwha lecture-écriture.', en: 'You get `switch_root:/#`. The real root is mounted on `/sysroot` **read-only**: remount it read-write.' } },
    { cmd: 'chroot /sysroot', text: { fr: '`chroot` fait de `/sysroot` la racine `/` : les commandes agissent maintenant sur le vrai système (prompt `sh-5.1#`).', dar: '`chroot` kaydir `/sysroot` howa racine `/` : daba les commandes kaykhdmou 3la système l7a9i9i (prompt `sh-5.1#`).', en: '`chroot` makes `/sysroot` the root `/`: commands now act on the real system (prompt `sh-5.1#`).' } },
    { cmd: 'passwd', text: { fr: '`passwd` (sans argument : on est root) → saisir deux fois le nouveau mot de passe. `/etc/shadow` est mis à jour.', dar: '`passwd` (bla argument : 7na root) → kteb mot de passe jdid jouj merrat. `/etc/shadow` kaytbeddel.', en: '`passwd` (no argument: we are root) → type the new password twice. `/etc/shadow` is updated.' } },
    { cmd: 'touch /.autorelabel', text: { fr: '**Indispensable avec SELinux** : `/etc/shadow` a été modifié hors contexte, son étiquette SELinux est fausse. Ce fichier demande un réétiquetage complet au prochain démarrage (sinon plus personne ne peut se connecter).', dar: '**Darouri m3a SELinux** : `/etc/shadow` tbeddel bla contexte, l\'étiquette SELinux dyalo ghalta. Had fichier kaytleb réétiquetage kamel f démarrage jay (ila la, 7ta wa7ed ma ghaydkhol).', en: '**Mandatory with SELinux**: `/etc/shadow` was modified out of context, so its SELinux label is wrong. This file requests a full relabel on next boot (otherwise nobody can log in).' } },
    { cmd: 'exit', text: { fr: 'Premier `exit` : on sort du chroot (retour à `switch_root:/#`).', dar: '`exit` lowel : kankhrjou mn chroot (nrj3ou l `switch_root:/#`).', en: 'First `exit`: leave the chroot (back to `switch_root:/#`).' } },
    { cmd: 'exit', text: { fr: 'Deuxième `exit` : le démarrage continue, le réétiquetage SELinux se fait (quelques minutes), puis le système redémarre. On se connecte en root avec le nouveau mot de passe.', dar: '`exit` tani : démarrage kaykemmel, réétiquetage SELinux kaytdar (chi d9aye9), w système kay3awed yt3al. Kandkhlou root b mot de passe jdid.', en: 'Second `exit`: boot continues, the SELinux relabel runs (a few minutes), then the system reboots. Log in as root with the new password.' } }
  ]
};

export const PERM = {
  title: { fr: 'Calculateur de droits', dar: 'Calculateur dyal droits', en: 'Permission calculator' },
  who: [
    { fr: 'Propriétaire (u)', dar: 'Mol l fichier (u)', en: 'Owner (u)' },
    { fr: 'Groupe (g)', dar: 'Groupe (g)', en: 'Group (g)' },
    { fr: 'Autres (o)', dar: 'Lokhrin (o)', en: 'Others (o)' }
  ],
  bits: [
    { fr: 'lecture (r = 4)', dar: '9raya (r = 4)', en: 'read (r = 4)' },
    { fr: 'écriture (w = 2)', dar: 'ktaba (w = 2)', en: 'write (w = 2)' },
    { fr: 'exécution (x = 1)', dar: 'tnfid (x = 1)', en: 'execute (x = 1)' }
  ],
  fileDir: { fr: 'Sur un **fichier** : r = lire le contenu, w = le modifier, x = l\'exécuter. Sur un **répertoire** : r = lister (`ls`), w = créer/supprimer des entrées (avec x), x = le traverser (`cd`, accéder aux fichiers dedans).', dar: '3la **fichier** : r = t9ra contenu, w = tbeddlo, x = tnfdo. 3la **répertoire** : r = tlister (`ls`), w = tcréer/tmse7 fichiers (m3a x), x = tdkhol lih (`cd`, tousel l fichiers li fih).', en: 'On a **file**: r = read the content, w = modify it, x = execute it. On a **directory**: r = list it (`ls`), w = create/delete entries (with x), x = traverse it (`cd`, reach files inside).' },
  presets: { fr: 'Valeurs classiques', dar: 'Qiyam m3roufin', en: 'Common values' },
  warn777: { fr: '777 : tout le monde peut tout faire — déconseillé (faille de sécurité).', dar: '777 : ga3 nas ydirou kolchi — ma ynsa7ch (khatar).', en: '777: everybody can do everything — not recommended (security hole).' }
};

export const PASSWD = {
  title: { fr: 'Explorateur de /etc/passwd, shadow, group, gshadow', dar: 'Explorateur dyal /etc/passwd, shadow, group, gshadow', en: '/etc/passwd, shadow, group, gshadow explorer' },
  tap: { fr: 'Touche un champ pour voir sa signification.', dar: 'Tapi 3la champ bach tchouf ma3nah.', en: 'Tap a field to see what it means.' },
  files: {
    passwd: {
      line: 'tp1:x:2003:100:Utilisateur TP1:/home/tp1:/bin/bash',
      perm: { fr: '`-rw-r--r--` root root : lisible par tous (les programmes ont besoin de traduire UID → nom).', dar: '`-rw-r--r--` root root : ga3 nas y9raw (les programmes kay7tajou ybeddlou UID → smiya).', en: '`-rw-r--r--` root root: readable by everyone (programs need UID → name lookups).' },
      fields: [
        { fr: '**login** : nom de connexion.', dar: '**login** : smiya dyal connexion.', en: '**login**: user name.' },
        { fr: '**x** : le mot de passe chiffré est dans `/etc/shadow`.', dar: '**x** : mot de passe mchiffré kayn f `/etc/shadow`.', en: '**x**: the hashed password is in `/etc/shadow`.' },
        { fr: '**UID** : 0 = root, < 1000 = comptes système, ≥ 1000 = utilisateurs ordinaires (UID_MIN dans `/etc/login.defs`).', dar: '**UID** : 0 = root, < 1000 = comptes système, ≥ 1000 = users 3adiyin (UID_MIN f `/etc/login.defs`).', en: '**UID**: 0 = root, < 1000 = system accounts, ≥ 1000 = regular users (UID_MIN in `/etc/login.defs`).' },
        { fr: '**GID** du groupe **primaire** (100 = users).', dar: '**GID** dyal groupe **primaire** (100 = users).', en: '**GID** of the **primary** group (100 = users).' },
        { fr: '**Commentaire** (GECOS) : nom complet… (`useradd -c`, `usermod -c`).', dar: '**Commentaire** (GECOS) : smiya kamla… (`useradd -c`, `usermod -c`).', en: '**Comment** (GECOS): full name… (`useradd -c`, `usermod -c`).' },
        { fr: '**Répertoire personnel** (`-d`).', dar: '**Répertoire personnel** (`-d`).', en: '**Home directory** (`-d`).' },
        { fr: '**Shell** de connexion (`-s`). `/sbin/nologin` interdit la connexion interactive.', dar: '**Shell** dyal connexion (`-s`). `/sbin/nologin` kaymna3 connexion.', en: 'Login **shell** (`-s`). `/sbin/nologin` forbids interactive login.' }
      ]
    },
    shadow: {
      line: 'tp1:$6$rev24k$Qd…/:20410:0:99999:7:2:20818:',
      perm: { fr: '`----------` root root : seul root peut le lire.', dar: '`----------` root root : ghir root li y9rah.', en: '`----------` root root: only root can read it.' },
      fields: [
        { fr: '**login**.', dar: '**login**.', en: '**login**.' },
        { fr: '**Mot de passe chiffré** : `$6$` = SHA-512 (sel, puis hachage). `!!` = jamais défini, `!` devant = verrouillé, vide = pas de mot de passe.', dar: '**Mot de passe mchiffré** : `$6$` = SHA-512 (sel, w men b3d hachage). `!!` = 3omro ma t7at, `!` 9damou = msdoud, khawi = bla mot de passe.', en: '**Hashed password**: `$6$` = SHA-512 (salt, then hash). `!!` = never set, leading `!` = locked, empty = no password.' },
        { fr: '**Dernier changement** (jours depuis le 01/01/1970). **0** = changement obligatoire à la prochaine connexion (`chage -d 0`).', dar: '**Akhir tabdil** (iyam mn 01/01/1970). **0** = khass ybeddel f connexion jaya (`chage -d 0`).', en: '**Last change** (days since 1970-01-01). **0** = must change at next login (`chage -d 0`).' },
        { fr: '**min** : jours minimum entre deux changements (`chage -m`).', dar: '**min** : a9al 3adad iyam bin jouj tabdilat (`chage -m`).', en: '**min**: minimum days between changes (`chage -m`).' },
        { fr: '**max** : durée de validité du mot de passe (`chage -M`). 99999 = illimité.', dar: '**max** : ch7al ybqa mot de passe sali7 (`chage -M`). 99999 = bla 7dod.', en: '**max**: password validity (`chage -M`). 99999 = unlimited.' },
        { fr: '**warn** : jours d\'avertissement avant expiration (`chage -W`).', dar: '**warn** : iyam dyal tanbih 9bel expiration (`chage -W`).', en: '**warn**: warning days before expiry (`chage -W`).' },
        { fr: '**inactif** : jours après expiration du mot de passe avant désactivation du compte (`chage -I`).', dar: '**inactif** : iyam mor expiration dyal mot de passe 9bel ma ytsedd compte (`chage -I`).', en: '**inactive**: days after password expiry before the account is disabled (`chage -I`).' },
        { fr: '**expiration du compte** (jours depuis 1970) : `useradd -e`, `chage -E 2026-12-31`.', dar: '**expiration dyal compte** (iyam mn 1970) : `useradd -e`, `chage -E 2026-12-31`.', en: '**account expiry** (days since 1970): `useradd -e`, `chage -E 2026-12-31`.' },
        { fr: 'Champ réservé.', dar: 'Champ m7jouz.', en: 'Reserved field.' }
      ]
    },
    group: {
      line: 'IIR:x:1001:tp,tp1',
      perm: { fr: '`-rw-r--r--` : lisible par tous.', dar: '`-rw-r--r--` : ga3 y9raw.', en: '`-rw-r--r--`: readable by everyone.' },
      fields: [
        { fr: '**Nom du groupe**.', dar: '**Smiya dyal groupe**.', en: '**Group name**.' },
        { fr: '**x** : mot de passe de groupe dans `/etc/gshadow` (rarement utilisé).', dar: '**x** : mot de passe dyal groupe f `/etc/gshadow` (nadir).', en: '**x**: group password in `/etc/gshadow` (rarely used).' },
        { fr: '**GID**.', dar: '**GID**.', en: '**GID**.' },
        { fr: '**Membres secondaires**, séparés par des virgules. Les membres dont c\'est le groupe **primaire** n\'apparaissent pas ici !', dar: '**Les membres secondaires**, mfr9in b virgule. Li 3ndhom had groupe **primaire** ma kayban-ouch hna !', en: '**Secondary members**, comma-separated. Users whose **primary** group it is do not appear here!' }
      ]
    },
    gshadow: {
      line: 'developpeurs:$6$…:admin1,admin2:user1,user2,user3',
      perm: { fr: '`----------` : seul root peut le lire.', dar: '`----------` : ghir root.', en: '`----------`: root only.' },
      fields: [
        { fr: '**Nom du groupe**.', dar: '**Smiya dyal groupe**.', en: '**Group name**.' },
        { fr: '**Mot de passe chiffré** du groupe (`$6$` = SHA-512) ; `!` = aucun.', dar: '**Mot de passe mchiffré** dyal groupe (`$6$` = SHA-512) ; `!` = walou.', en: '**Hashed group password** (`$6$` = SHA-512); `!` = none.' },
        { fr: '**Administrateurs** du groupe (`gpasswd -A`) : peuvent ajouter/retirer des membres sans être root.', dar: '**Les admins** dyal groupe (`gpasswd -A`) : y9edrou yzidou/y7eydou membres bla ma ykounou root.', en: 'Group **administrators** (`gpasswd -A`): can add/remove members without being root.' },
        { fr: '**Membres** (`gpasswd -M`).', dar: '**Les membres** (`gpasswd -M`).', en: '**Members** (`gpasswd -M`).' }
      ]
    }
  }
};

export const FHS = {
  title: { fr: 'Arborescence FHS 3.0', dar: 'Chajara FHS 3.0', en: 'FHS 3.0 tree' },
  intro: { fr: 'Le *Filesystem Hierarchy Standard* (FHS 3.0, juin 2015) fixe le rôle de chaque répertoire. Touche un répertoire.', dar: '*Filesystem Hierarchy Standard* (FHS 3.0, juin 2015) kay7added dor dyal kol répertoire. Tapi 3la répertoire.', en: 'The *Filesystem Hierarchy Standard* (FHS 3.0, June 2015) defines each directory\'s role. Tap a directory.' },
  dirs: [
    { d: '/bin', t: { fr: 'Commandes essentielles pour tous (ls, cp, bash). Sur RHEL 9 : lien vers `/usr/bin`.', dar: 'Les commandes asasiya l ga3 (ls, cp, bash). F RHEL 9 : lien l `/usr/bin`.', en: 'Essential commands for everyone (ls, cp, bash). On RHEL 9: link to `/usr/bin`.' } },
    { d: '/sbin', t: { fr: 'Commandes d\'administration système (useradd, fdisk, reboot). Lien vers `/usr/sbin`.', dar: 'Les commandes dyal administration (useradd, fdisk, reboot). Lien l `/usr/sbin`.', en: 'System administration commands (useradd, fdisk, reboot). Link to `/usr/sbin`.' } },
    { d: '/etc', t: { fr: 'Fichiers de **configuration** (texte) : passwd, shadow, group, fstab, default/grub, sudoers, yum.repos.d…', dar: 'Fichiers dyal **configuration** (texte) : passwd, shadow, group, fstab, default/grub, sudoers, yum.repos.d…', en: '**Configuration** files (text): passwd, shadow, group, fstab, default/grub, sudoers, yum.repos.d…' } },
    { d: '/home', t: { fr: 'Répertoires personnels des utilisateurs ordinaires (`/home/tp`).', dar: 'Les répertoires personnels dyal users 3adiyin (`/home/tp`).', en: 'Home directories of regular users (`/home/tp`).' } },
    { d: '/root', t: { fr: 'Répertoire personnel de **root** (≠ `/`, la racine !).', dar: 'Répertoire personnel dyal **root** (≠ `/`, racine !).', en: '**root**\'s home directory (≠ `/`, the root of the tree!).' } },
    { d: '/var', t: { fr: 'Données **variables** : journaux `/var/log`, files d\'attente, cache, sites web `/var/www`.', dar: 'Données **kaytbeddlou** : logs `/var/log`, spool, cache, sites web `/var/www`.', en: '**Variable** data: logs `/var/log`, spools, cache, websites `/var/www`.' } },
    { d: '/tmp', t: { fr: 'Fichiers temporaires, accessibles à tous (sticky bit `t`), **vidé au redémarrage**.', dar: 'Fichiers mo2a9atin, l ga3 (sticky bit `t`), **kaytkhwa f redémarrage**.', en: 'Temporary files, writable by all (sticky bit `t`), **emptied at reboot**.' } },
    { d: '/usr', t: { fr: 'Programmes et bibliothèques installés (lecture seule partageable) : `/usr/bin`, `/usr/lib`, `/usr/share`.', dar: 'Programmes w bibliothèques installés : `/usr/bin`, `/usr/lib`, `/usr/share`.', en: 'Installed programs and libraries (shareable, read-only): `/usr/bin`, `/usr/lib`, `/usr/share`.' } },
    { d: '/lib', t: { fr: 'Bibliothèques partagées et modules du noyau (lien vers `/usr/lib`).', dar: 'Bibliothèques partagées w modules dyal noyau (lien l `/usr/lib`).', en: 'Shared libraries and kernel modules (link to `/usr/lib`).' } },
    { d: '/dev', t: { fr: 'Fichiers spéciaux de **périphériques** (`/dev/sda`, `/dev/null`, `/dev/tty1`) : « tout est fichier ».', dar: 'Fichiers spéciaux dyal **périphériques** (`/dev/sda`, `/dev/null`, `/dev/tty1`) : « kolchi fichier ».', en: 'Special **device** files (`/dev/sda`, `/dev/null`, `/dev/tty1`): "everything is a file".' } },
    { d: '/proc', t: { fr: 'Système de fichiers **virtuel** du noyau : processus (`/proc/1`), `/proc/cpuinfo`, `/proc/meminfo`.', dar: 'Système de fichiers **virtuel** dyal noyau : processus (`/proc/1`), `/proc/cpuinfo`, `/proc/meminfo`.', en: 'Kernel **virtual** filesystem: processes (`/proc/1`), `/proc/cpuinfo`, `/proc/meminfo`.' } },
    { d: '/boot', t: { fr: 'Fichiers de démarrage : noyau `vmlinuz`, `initramfs`, `grub2/`, `loader/entries/`, `efi/`.', dar: 'Fichiers dyal démarrage : noyau `vmlinuz`, `initramfs`, `grub2/`, `loader/entries/`, `efi/`.', en: 'Boot files: `vmlinuz` kernel, `initramfs`, `grub2/`, `loader/entries/`, `efi/`.' } },
    { d: '/opt', t: { fr: 'Logiciels **optionnels** / tiers installés hors paquets (ex. `/opt/donnees` du TP5).', dar: 'Logiciels **ikhtiyariya** / mn bra (ex. `/opt/donnees` dyal TP5).', en: '**Optional** / third-party software (e.g. TP5\'s `/opt/donnees`).' } },
    { d: '/media', t: { fr: 'Points de montage **automatiques** des médias amovibles (clé USB, CD).', dar: 'Points de montage **automatiques** dyal clé USB, CD.', en: '**Automatic** mount points for removable media (USB, CD).' } },
    { d: '/mnt', t: { fr: 'Point de montage **manuel** temporaire (par l\'administrateur).', dar: 'Point de montage **manuel** mo2a9at (dyal l admin).', en: 'Temporary **manual** mount point (by the admin).' } }
  ]
};

export const GRUBFLOW = {
  title: { fr: 'Comment est généré grub.cfg', dar: 'Kifach kaytsawb grub.cfg', en: 'How grub.cfg is generated' },
  steps: [
    { fr: '**1. Sauvegarder** avant toute modification : `cp -p /etc/default/grub /etc/default/grub.bak`.', dar: '**1. Dir sauvegarde** 9bel ay tabdil : `cp -p /etc/default/grub /etc/default/grub.bak`.', en: '**1. Back up** before any change: `cp -p /etc/default/grub /etc/default/grub.bak`.' },
    { fr: '**2. Modifier les réglages** dans `/etc/default/grub` : `GRUB_TIMEOUT=10`, `GRUB_DEFAULT=0|saved`, `GRUB_TIMEOUT_STYLE=menu`, `GRUB_CMDLINE_LINUX=…`.', dar: '**2. Beddel réglages** f `/etc/default/grub` : `GRUB_TIMEOUT=10`, `GRUB_DEFAULT=0|saved`, `GRUB_TIMEOUT_STYLE=menu`, `GRUB_CMDLINE_LINUX=…`.', en: '**2. Edit settings** in `/etc/default/grub`: `GRUB_TIMEOUT=10`, `GRUB_DEFAULT=0|saved`, `GRUB_TIMEOUT_STYLE=menu`, `GRUB_CMDLINE_LINUX=…`.' },
    { fr: '**3. Scripts** de `/etc/grub.d/` exécutés dans l\'ordre : `00_header`, `01_users`, `10_linux`, `30_uefi-firmware`, `40_custom` (tes entrées : `menuentry "Redemarrer" { reboot }`).', dar: '**3. Scripts** dyal `/etc/grub.d/` kaytnfdou b tartib : `00_header`, `01_users`, `10_linux`, `30_uefi-firmware`, `40_custom` (entrées dyalek : `menuentry "Redemarrer" { reboot }`).', en: '**3. Scripts** in `/etc/grub.d/` run in order: `00_header`, `01_users`, `10_linux`, `30_uefi-firmware`, `40_custom` (your entries: `menuentry "Redemarrer" { reboot }`).' },
    { fr: '**4. Générer** : `grub2-mkconfig -o /boot/grub2/grub.cfg` assemble tout. **Ne jamais éditer grub.cfg à la main** (écrasé à la prochaine génération).', dar: '**4. Générer** : `grub2-mkconfig -o /boot/grub2/grub.cfg` kayjm3 kolchi. **3omrek ma tbeddel grub.cfg b yeddek** (kaytmse7 f génération jaya).', en: '**4. Generate**: `grub2-mkconfig -o /boot/grub2/grub.cfg` assembles everything. **Never edit grub.cfg by hand** (overwritten at next generation).' },
    { fr: '**5. Entrées des noyaux** au format **BLS** dans `/boot/loader/entries/*.conf`. En UEFI, `/boot/efi/EFI/redhat/grub.cfg` est un simple **relais** vers `/boot/grub2/grub.cfg`.', dar: '**5. Les entrées dyal noyaux** b format **BLS** f `/boot/loader/entries/*.conf`. F UEFI, `/boot/efi/EFI/redhat/grub.cfg` ghir **relais** l `/boot/grub2/grub.cfg`.', en: '**5. Kernel entries** use **BLS** format in `/boot/loader/entries/*.conf`. With UEFI, `/boot/efi/EFI/redhat/grub.cfg` is just a **relay** to `/boot/grub2/grub.cfg`.' }
  ]
};

export const SYSTEMD = {
  title: { fr: 'États d\'un service systemd', dar: 'Les états dyal service systemd', en: 'systemd service states' },
  now: { fr: 'Maintenant (runtime)', dar: 'Daba (runtime)', en: 'Now (runtime)' },
  boot: { fr: 'Au prochain démarrage', dar: 'F démarrage jay', en: 'At next boot' },
  running: { fr: 'en marche', dar: 'khddam', en: 'running' },
  stopped: { fr: 'arrêté', dar: 'wa9ef', en: 'stopped' },
  willStart: { fr: 'démarrera', dar: 'ghaybda', en: 'will start' },
  wontStart: { fr: 'ne démarrera pas', dar: 'ma ghaybdach', en: 'won\'t start' },
  maskedTxt: { fr: 'masqué : impossible de le démarrer, même manuellement', dar: 'masqué : ma ymkench ybda, 7ta b yeddek', en: 'masked: cannot be started, even manually' },
  lesson: { fr: '**enable ≠ start** : `enable` crée un lien dans `multi-user.target.wants/` pour le **prochain démarrage**, `start` lance le service **maintenant**. `enable --now` fait les deux.', dar: '**enable ≠ start** : `enable` kaydir lien f `multi-user.target.wants/` l **démarrage jay**, `start` kaybda service **daba**. `enable --now` kaydir bjouj.', en: '**enable ≠ start**: `enable` creates a link in `multi-user.target.wants/` for the **next boot**, `start` launches the service **now**. `enable --now` does both.' },
  targets: { fr: 'Cibles : set-default ≠ isolate', dar: 'Cibles : set-default ≠ isolate', en: 'Targets: set-default ≠ isolate' },
  current: { fr: 'Cible actuelle', dar: 'Cible daba', en: 'Current target' },
  def: { fr: 'Cible par défaut (au boot)', dar: 'Cible par défaut (f boot)', en: 'Default target (at boot)' },
  targetLesson: { fr: '`set-default` change le lien `default.target` (effet au **prochain** démarrage). `isolate` bascule **immédiatement** (arrête ce qui n\'appartient pas à la cible).', dar: '`set-default` kaybeddel lien `default.target` (kayban f démarrage **jay**). `isolate` kaybeddel **daba** (kaywe9ef li machi dyal cible).', en: '`set-default` changes the `default.target` link (takes effect at **next** boot). `isolate` switches **immediately** (stops what is not part of the target).' },
  reboot: { fr: 'Simuler un redémarrage', dar: 'Simuler redémarrage', en: 'Simulate a reboot' }
};

export const RPMDNF = {
  title: { fr: 'rpm vs dnf : les dépendances', dar: 'rpm vs dnf : les dépendances', en: 'rpm vs dnf: dependencies' },
  rpmTxt: { fr: '`rpm` installe **un fichier .rpm** et vérifie les dépendances **sans les résoudre** : il échoue et liste ce qui manque. (`--nodeps` force… et casse le logiciel.)', dar: '`rpm` kayinstalli **fichier .rpm wa7ed** w kayverifyi dépendances **bla ma y7ellhom** : kayfchel w kayqol chnou na9es. (`--nodeps` kayforcé… w kaykhsser logiciel.)', en: '`rpm` installs **one .rpm file** and checks dependencies **without resolving them**: it fails and lists what is missing. (`--nodeps` forces… and breaks the software.)' },
  dnfTxt: { fr: '`dnf` interroge les **dépôts** (`/etc/yum.repos.d/*.repo`), calcule l\'**arbre de dépendances**, télécharge et installe tout dans le bon ordre, puis enregistre la transaction (`dnf history`).', dar: '`dnf` kaysowel **les dépôts** (`/etc/yum.repos.d/*.repo`), kay7seb **chajara dyal dépendances**, kaytélécharger w kayinstalli kolchi b tartib, w kaysjjel transaction (`dnf history`).', en: '`dnf` queries the **repositories** (`/etc/yum.repos.d/*.repo`), computes the **dependency tree**, downloads and installs everything in order, then records the transaction (`dnf history`).' },
  run: { fr: 'Lancer', dar: 'Chghel', en: 'Run' }
};

export const TIMELINE = {
  title: { fr: 'Frise : de Multics à GNU/Linux', dar: 'Tarikh : mn Multics l GNU/Linux', en: 'Timeline: from Multics to GNU/Linux' },
  events: [
    { y: '1964', t: { fr: '**Multics** (MIT, General Electric, Bell Labs) : système multi-utilisateurs ambitieux.', dar: '**Multics** (MIT, General Electric, Bell Labs) : système multi-users kbir.', en: '**Multics** (MIT, General Electric, Bell Labs): ambitious multi-user system.' } },
    { y: '1969', t: { fr: '**UNIX** écrit par Ken Thompson aux Bell Labs, en **assembleur**.', dar: '**UNIX** ktbou Ken Thompson f Bell Labs, b **assembleur**.', en: '**UNIX** written by Ken Thompson at Bell Labs, in **assembly**.' } },
    { y: '1972', t: { fr: 'Dennis Ritchie crée le **langage C** ; Unix est réécrit en C → portable.', dar: 'Dennis Ritchie dar **langage C** ; Unix t3awed ktbou b C → portable.', en: 'Dennis Ritchie creates **C**; Unix is rewritten in C → portable.' } },
    { y: '1977', t: { fr: '**BSD** (Berkeley, Bill Joy) : ajoute **TCP/IP** et la **mémoire virtuelle**.', dar: '**BSD** (Berkeley, Bill Joy) : zad **TCP/IP** w **mémoire virtuelle**.', en: '**BSD** (Berkeley, Bill Joy): adds **TCP/IP** and **virtual memory**.' } },
    { y: '1983', t: { fr: 'Projet **GNU** (R. Stallman) : un système libre… mais sans noyau.', dar: 'Projet **GNU** (R. Stallman) : système 7orr… walakin bla noyau.', en: '**GNU** project (R. Stallman): a free system… but without a kernel.' } },
    { y: '1987', t: { fr: '**Minix** (Tanenbaum) : micro-noyau pédagogique, non librement distribuable.', dar: '**Minix** (Tanenbaum) : micro-noyau l ta3lim, ma kaytwazza3ch b 7orriya.', en: '**Minix** (Tanenbaum): teaching micro-kernel, not freely distributable.' } },
    { y: '1991', t: { fr: 'Linus Torvalds publie le **noyau Linux** ; avec les outils GNU → **GNU/Linux**.', dar: 'Linus Torvalds nchar **noyau Linux** ; m3a outils GNU → **GNU/Linux**.', en: 'Linus Torvalds releases the **Linux kernel**; with GNU tools → **GNU/Linux**.' } },
    { y: '1993–2000', t: { fr: 'Bureaux graphiques : **CDE** 1993, **KDE** 1996, **GNOME** 1997, **Xfce** 2000.', dar: 'Bureaux graphiques : **CDE** 1993, **KDE** 1996, **GNOME** 1997, **Xfce** 2000.', en: 'Desktops: **CDE** 1993, **KDE** 1996, **GNOME** 1997, **Xfce** 2000.' } }
  ],
  families: { fr: 'Familles de distributions', dar: 'Les familles dyal distributions', en: 'Distribution families' },
  fam: [
    { n: 'Debian', t: { fr: 'Paquets **.deb** (apt), 100 % libre, ~25 000 paquets, réputée stable. Dérivées : Ubuntu, Mint.', dar: 'Paquets **.deb** (apt), 7orra 100 %, ~25 000 paquet, stable. Dérivées : Ubuntu, Mint.', en: '**.deb** packages (apt), 100 % free, ~25,000 packages, known as stable. Derivatives: Ubuntu, Mint.' } },
    { n: 'Red Hat', t: { fr: 'Paquets **.rpm** (dnf). RHEL payante pour le support ; **Fedora** = laboratoire ; **CentOS** = clone, intégré à Red Hat depuis 2014.', dar: 'Paquets **.rpm** (dnf). RHEL b lflous 3la support ; **Fedora** = laboratoire ; **CentOS** = clone, dkhel l Red Hat mn 2014.', en: '**.rpm** packages (dnf). RHEL paid for support; **Fedora** = lab; **CentOS** = clone, part of Red Hat since 2014.' } },
    { n: 'SUSE', t: { fr: 'Aussi **RPM** (zypper). SLES / SLED (entreprise), **openSUSE** gratuit.', dar: 'Hta hiya **RPM** (zypper). SLES / SLED (charikat), **openSUSE** bla flous.', en: 'Also **RPM** (zypper). SLES / SLED (enterprise), **openSUSE** free.' } }
  ]
};
