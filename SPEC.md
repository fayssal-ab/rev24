# SPEC — "Rev24" : plateforme de révision 4IIR (Linux + Analyse de données)

> Fichier destiné à **Claude Code**. Lis tout ce document avant d'écrire du code, puis construis le site complet décrit ici, étape par étape (voir §12 « Ordre de construction »). Ne demande pas de validation entre les étapes : construis, teste, corrige, continue.

---

## 0. Contexte

- Étudiant : **Fayssal ABAIBAT**, 4IIR, EMSI Rabat, année 2026/2027.
- Objectif : réviser **tout** le programme de deux modules pour les contrôles, avec cours, animations, QCM, exercices difficiles corrigés, et un **mode « 24h »** pour réviser en une journée.
- Modules (V1) :
  1. **Administration Unix / Linux RHEL 9** (Chap 1 Intro + Installation, TP1 → TP5, Chap 4 Utilisateurs)
  2. **Analyse de données** (Pr. A. Kadiri : Chap 0, Chap 1 pandas, Chap 4 Visualisation, Chap 5 Tests d'hypothèses, Feuille N°1)
- L'architecture doit permettre d'ajouter facilement d'autres modules plus tard (Recherche Opérationnelle, Oracle, Virtualisation) **sans toucher au code** : seulement en ajoutant des fichiers de contenu.

## 1. Langues (obligatoire)

Trois langues, sélecteur toujours visible dans la barre du haut, choix mémorisé (localStorage) :

| Code | Langue | Notes |
|---|---|---|
| `fr` | Français | Langue par défaut, langue de l'examen. |
| `dar` | Darija marocaine | **En alphabet latin** (style « 3arabizi » : 3, 7, 9, 2, gh, kh, ch). Ton simple, comme un ami qui explique. Ex. : « Had l commande katkhlli l user ybeddel l password dyalou. » Les termes techniques restent en français/anglais (commande, fichier, groupe, test, H0…). |
| `en` | English | Clair et simple. |

Règles :
- **Toute** chaîne affichée (UI, cours, QCM, explications, corrigés) existe dans les 3 langues. Aucun texte en dur dans les composants : tout passe par les fichiers de contenu / dictionnaire i18n.
- Les **commandes, code, formules** ne se traduisent jamais.
- Option « Mode bilingue » : afficher FR + une 2e langue côte à côte (ou FR avec bulle de traduction au survol/tap). Très utile pour apprendre le vocabulaire d'examen en français.
- Si une traduction manque, fallback sur `fr` + petit badge « FR » (et un script `npm run i18n:check` qui liste les clés manquantes ; le build doit le passer à 0 manquant).

## 2. Stack technique

- **Vite + React 18 + TypeScript** (strict).
- **Tailwind CSS** + composants maison (pas de lib UI lourde).
- **Framer Motion** pour les animations ; **Lottie** non nécessaire.
- **KaTeX** pour les formules mathématiques.
- **Shiki** (ou Prism) pour la coloration du code (bash, python).
- **Recharts** ou SVG/D3 maison pour les graphiques statistiques (courbe normale, Student, χ²).
- **Zustand** pour l'état global ; persistance **localStorage** (progression, scores, langue, thème, mode 24h).
- **React Router** (routes listées en §4).
- **PWA** (vite-plugin-pwa) : utilisable hors-ligne et installable sur téléphone — l'étudiant révise beaucoup sur mobile.
- **Pas de backend.** Site 100 % statique, déployable sur GitHub Pages / Vercel / Netlify.
- Tests : **Vitest** pour la logique (moteur QCM, simulateur de terminal, calculs statistiques), **Playwright** pour 3–4 parcours clés.
- `npm run dev`, `npm run build`, `npm run test`, `npm run i18n:check`, `npm run content:check` doivent tous fonctionner.

## 3. Design & animations

- **Mobile-first** (écran ~380 px), puis desktop. Le cours doit être agréable à lire sur téléphone.
- Thème clair / sombre (sombre par défaut, style terminal pour le module Linux : accents vert/cyan ; module Analyse : accents violet/bleu).
- Typo : une sans-serif lisible pour le texte, une monospace (JetBrains Mono / Fira Code) pour le code.
- Animations (Framer Motion), toujours **utiles** pour comprendre, jamais gratuites :
  - transitions de pages et apparition progressive des sections au scroll ;
  - schémas animés (voir §6) étape par étape avec boutons ◀ ▶ et lecture auto ;
  - feedback QCM : vert + petit rebond si juste, secousse + rouge si faux, puis explication qui se déplie ;
  - barre de progression animée, confettis discrets quand un chapitre atteint 100 % ;
  - streak / XP qui s'incrémente avec animation.
- Respecter `prefers-reduced-motion` (désactive les animations non essentielles).
- Accessibilité : contrastes AA, navigation clavier complète dans les QCM (1–4 pour répondre, Entrée pour valider, → pour suivant).

## 4. Pages & navigation

```
/                         Accueil : choix du module, progression globale, bouton « Mode 24h »
/m/:module                Tableau de bord du module : chapitres, % maîtrise, points faibles
/m/:module/c/:chapter     Cours du chapitre (sections + animations + mini-quiz intégrés)
/m/:module/qcm            Banque de QCM (filtres : chapitre, difficulté, « mes erreurs »)
/m/:module/exercices      Exercices difficiles avec corrigés pas à pas
/m/:module/fiche          Fiche de révision condensée (imprimable / export PDF via window.print)
/m/:module/formulaire     Formulaire / aide-mémoire des commandes (recherche instantanée)
/m/:module/flashcards     Flashcards avec répétition espacée
/m/:module/examen         Examen blanc chronométré
/24h                      Mode 24h (voir §9)
/terminal                 Simulateur de terminal Linux libre (bac à sable)
/stats-lab                Labo stats : visualiseur de tests d'hypothèses
/progression              Statistiques personnelles, historique, export/import JSON de la progression
```

Barre du bas sur mobile : Cours · QCM · Exos · 24h · Profil.

## 5. Modèle de contenu (data-driven)

Tout le contenu vit dans `src/content/<module>/` en **JSON ou MDX**, jamais dans les composants. Schémas validés avec **Zod** (`npm run content:check` échoue si un fichier est invalide).

```ts
type L10n = { fr: string; dar: string; en: string };

interface Module { id: string; title: L10n; color: string; icon: string; chapters: string[] }

interface Chapter {
  id: string; module: string; order: number;
  title: L10n; summary: L10n;
  estimatedMinutes: number;
  sections: Section[];              // contenu du cours
  keyPoints: L10n[];                // pour la fiche de révision
}

type Section =
  | { type: 'text'; body: L10n }                       // markdown autorisé
  | { type: 'code'; lang: 'bash'|'python'; code: string; caption?: L10n }
  | { type: 'formula'; tex: string; caption?: L10n }
  | { type: 'table'; headers: L10n[]; rows: (L10n|string)[][] }
  | { type: 'animation'; component: string; props?: object }   // voir §6
  | { type: 'callout'; kind: 'tip'|'trap'|'exam'; body: L10n } // « piège », « tombe souvent à l'exam »
  | { type: 'miniQuiz'; questionIds: string[] };

interface Question {
  id: string; module: string; chapter: string;
  difficulty: 1|2|3;                // 3 = difficile
  kind: 'single'|'multi'|'command'|'numeric'|'order';
  prompt: L10n;
  options?: { id: string; text: L10n }[];
  answer: string | string[] | number;   // 'command' : liste de réponses acceptées (normalisées)
  tolerance?: number;                     // pour 'numeric'
  explanation: L10n;                      // pourquoi la bonne réponse est juste
  wrongExplanations?: Record<string, L10n>; // pourquoi chaque mauvaise option est fausse
  tags: string[];
}

interface Exercise {
  id: string; module: string; chapter: string; difficulty: 2|3;
  statement: L10n;
  data?: string;                    // jeu de données, fichier simulé…
  hints: L10n[];                    // révélés un par un
  solutionSteps: { title: L10n; body: L10n; code?: string; tex?: string }[];
  finalAnswer: L10n;
  commonMistakes: L10n[];
}

interface Flashcard { id: string; module: string; chapter: string; front: L10n; back: L10n }
```

Types de questions :
- `single` / `multi` : QCM classiques (options mélangées à chaque passage).
- `command` : l'étudiant **tape** la commande (ex. « Ajouter tp au groupe IIR sans retirer ses autres groupes » → accepte `usermod -aG IIR tp`, `usermod -a -G IIR tp`, `gpasswd -a tp IIR`). Normaliser espaces, ordre des options courtes quand c'est équivalent.
- `numeric` : calcul (ex. « Calculer Z0 », tolérance ±0,01).
- `order` : remettre des étapes dans l'ordre (séquence de boot, étapes reset mdp root, étapes d'un test d'hypothèse).

## 6. Composants interactifs / animations à construire

### Module Linux
1. **`TerminalSim`** — terminal Linux simulé dans le navigateur (le cœur du module) :
   - système de fichiers virtuel en mémoire (arborescence FHS réaliste : `/bin /sbin /etc /home /root /var /tmp /usr /lib /dev /proc /boot /opt /media /mnt`) avec propriétaires, groupes, permissions ;
   - fichiers `/etc/passwd`, `/etc/shadow`, `/etc/group`, `/etc/gshadow`, `/etc/default/useradd`, `/etc/login.defs`, `/etc/skel/*`, `/etc/sudoers` **réellement mis à jour** par les commandes ;
   - commandes supportées (avec options principales et messages d'erreur réalistes en français comme sur RHEL) :
     `pwd cd ls(-l -a -ld -R) mkdir(-p) touch cp mv rm(-r -f) cat echo(> >>) head tail grep(-c) cut(-d -f) sort wc(-l) find(-name -type -uid -size -mtime) tee man(--résumé) whoami who id(-u -g -Gn) groups su(-) exit sudo useradd(-m -d -s -u -g -G -e -r -c -D) usermod(-aG -G -s -d -m -l -L -U -e -c) userdel(-r -f) passwd(-l -u -e -d -S) chage(-l -M -m -W -E -I -d) groupadd(-g -r) groupmod(-n -g) groupdel gpasswd(-a -d -M -A) chmod(symbolique + octal, -R) chown(user, user:group, :group, -R) chgrp(-R) visudo(éditeur simplifié) systemctl(start stop restart reload status enable disable is-active is-enabled mask unmask get-default set-default isolate list-units --type target --failed daemon-reload) journalctl(-b -f -u -p -n --since) rpm(-qa -qi -ql -qf -V -ivh -e -K -qpc) dnf(install remove info provides history check-update update group list/info/install/remove repolist) uname(-r) clear history`
   - prompt `[user@rhel9 ~]$` / `[root@rhel9 ~]#` selon l'utilisateur ;
   - historique ↑/↓, Tab pour complétion, Ctrl+L ;
   - mode **« mission »** : une consigne + validation automatique de l'état final (ex. « /opt/donnees appartient à tp, droits 755 »), avec ✅ par sous-objectif ;
   - bouton « Réinitialiser » (= snapshot « Installation_propre » comme au TP1).
2. **`BootSequence`** — animation : BIOS/UEFI → GRUB2 (menu, `/boot/grub2/grub.cfg`) → noyau `vmlinuz` + `initramfs` → systemd PID 1 → `default.target` (multi-user / graphical). Chaque étape cliquable avec explication + fichiers concernés.
3. **`RootPasswordReset`** — animation pas à pas : `e` dans GRUB → ajouter `rd.break` → Ctrl+X → `mount -o remount,rw /sysroot` → `chroot /sysroot` → `passwd` → `touch /.autorelabel` → `exit`, `exit`. Puis version « à toi de jouer » dans le TerminalSim.
4. **`PermissionCalculator`** — grille 3×3 de cases r/w/x (u/g/o) ⇄ notation octale ⇄ `-rwxr-xr--` ⇄ commande `chmod` symbolique ; animation des bits 4/2/1 qui s'additionnent.
5. **`PasswdLineExplorer`** — une ligne `/etc/passwd` (et `/etc/shadow`, `/etc/group`, `/etc/gshadow`) découpée champ par champ au survol/tap, avec explication de chaque champ.
6. **`FHSTree`** — arborescence interactive de `/`, chaque répertoire s'ouvre avec son rôle.
7. **`GrubConfigFlow`** — schéma : `/etc/default/grub` + `/etc/grub.d/*` → `grub2-mkconfig -o /boot/grub2/grub.cfg` → `grub.cfg` (+ BLS `/boot/loader/entries/`).
8. **`SystemdStates`** — états d'un service (inactive/active/failed/masked) et effet de `start/stop/enable/disable/mask` : bien montrer **enable ≠ start** et **set-default ≠ isolate**.
9. **`RpmVsDnf`** — animation de résolution de dépendances (rpm échoue sur wireshark, dnf télécharge l'arbre de dépendances).
10. **`LinuxTimeline`** — frise : Multics 1964 → UNIX 1969 → C 1972 → BSD 1977 → Minix 1987 → Linux 1991 → GNU/Linux ; familles Debian / Red Hat / SUSE.

### Module Analyse de données
1. **`HypothesisTestVisualizer`** (page `/stats-lab`) — courbe N(0,1) ou Student t(ν) ; sliders : x̄, µ0, σ ou S, n, α, type de test (bilatéral / gauche / droite). Affiche en direct : statistique Z0/T0, région critique colorée, valeur critique, **P-value** (aire), décision « rejeter / ne pas rejeter H0 », avec phrase de conclusion dans les 3 langues. Préréglages = les 4 exemples du cours (§8.2).
2. **`ErrorTable`** — tableau de décision α/β/puissance animé, avec l'exemple du procès (H0 = innocent).
3. **`ChiSquareBuilder`** — tableau Oi / pi / Ei qui se remplit étape par étape, calcul de χ², ν = k − p − 1, comparaison au seuil ; préréglage exemple du cours.
4. **`AnalysisTypesCards`** — 5 cartes (descriptive, exploratoire, confirmatoire, prédictive, prescriptive) à associer à leurs méthodes par glisser-déposer.
5. **`DataPipeline`** — animation des 5 étapes : collecte → nettoyage → exploration → modélisation → interprétation.
6. **`ChartChooser`** — « Quel graphique pour cet objectif ? » : l'étudiant choisit, le site affiche le graphique recommandé et explique pourquoi l'autre est à éviter.
7. **`PandasReadPlayground`** — un faux fichier CSV affiché (séparateur `;`, décimale `,`, sans en-tête, ligne de commentaire…) ; l'étudiant écrit l'appel `pd.read_csv(...)` ; le site vérifie les paramètres (`sep`, `decimal`, `header=None`, `skiprows`, `sheet_name`, `index=False` pour l'export) et montre le DataFrame résultant. (Pas besoin de vrai Python : parser les arguments et simuler. Bonus optionnel : Pyodide chargé à la demande.)
8. **`MatplotlibStyles`** — comparaison côte à côte style procédural `plt.*` vs orienté objet `fig, ax = plt.subplots()`.

## 7. QCM, exercices, flashcards, examen blanc

- **Volume minimum** (à générer à partir du contenu §8, en 3 langues) :
  - Linux : **≥ 120 questions** (dont ≥ 30 de type `command`, ≥ 30 difficulté 3) ; **≥ 25 exercices** difficiles ; **≥ 10 missions** TerminalSim ; **≥ 80 flashcards**.
  - Analyse de données : **≥ 80 questions** (dont ≥ 20 `numeric`, ≥ 20 difficulté 3) ; **≥ 20 exercices** difficiles avec calculs complets ; **≥ 60 flashcards**.
- Chaque question : explication de la bonne réponse **et** de chaque mauvaise option (`wrongExplanations`).
- Les exercices difficiles : indices progressifs → solution pas à pas → réponse finale → « erreurs fréquentes ». Bouton « Je l'ai réussi / Raté » qui alimente les statistiques.
- **Mode « Mes erreurs »** : resservir les questions ratées jusqu'à 3 bonnes réponses consécutives.
- **Flashcards** : répétition espacée (algorithme SM-2 simplifié : Again / Hard / Good / Easy).
- **Examen blanc** : 30 questions tirées au hasard pondérées par chapitre, chrono 45 min, pas de correction avant la fin, puis note /20, correction détaillée, et liste des chapitres à revoir.
- Les valeurs numériques des exercices stats doivent être **calculées par le code** (fonctions testées par Vitest : Φ, quantiles normale/Student/χ², moyennes, S), pas recopiées à la main — et les tests doivent vérifier les résultats de §8.2.

## 8. Contenu de référence (source de vérité)

> Rédige le cours complet à partir de ces points (développe, explique, donne des exemples), dans les 3 langues. Ne contredis jamais ces éléments.

### 8.1 Module Linux (Administration Unix, RHEL 9)

**Chap 1 — Introduction & installation**
- Rôle de l'administrateur : maintenir le parc, configurer, résoudre les incidents, installer/mettre à jour, administrer les disques, gérer utilisateurs et accès, planifier l'évolution.
- Système informatique = matériel, logiciel, individus, données, connectivité.
- OS : gère mémoire, périphériques, processeur, utilisateurs, standardisation des programmes.
- Historique : 1964 Multics (MIT, GE, Bell Labs) ; 1969 UNIX (Ken Thompson, assembleur) ; 1972 langage C (Dennis Ritchie), Unix réécrit en C ; 1977 BSD (Berkeley, Bill Joy) avec TCP/IP et mémoire virtuelle ; projet GNU (système libre sans noyau) ; 1987 Minix (Tanenbaum, micro-noyau, pédagogique, non librement distribuable) ; 1991 noyau Linux (Linus Torvalds) → GNU/Linux. Bureaux : CDE 1993, KDE 1996, GNOME 1997, Xfce 2000.
- Unix : tout est fichier, multi-utilisateurs, multi-tâches, noyau, shell, multi-architectures.
- Architecture : matériel → noyau (ressources, processus, droits, pilotes) → shell (interpréteur de commandes) → applications.
- Distribution = noyau + programmes + gestionnaire de paquets + installateur (300+ actives, distrowatch.com). Familles : Debian (.deb, libre, ~25 000 paquets, stable) ; Red Hat (.rpm, payante pour le support, Fedora = laboratoire, CentOS = clone, intégrée à Red Hat depuis 2014) ; SUSE (RPM, SLES/SLED, openSUSE gratuit). Choisir : besoins → distributions adaptées → version selon la machine → communauté active.
- RHEL 9 : config minimale 64 bits, 1 Go RAM (2+ recommandés), 10 Go disque (20+). Red Hat Developer Subscription gratuite.
- Partitions : /boot ≥ 1 GiB, / ≥ 10 GiB (≠ /root), /home ≥ 1 GiB, swap selon RAM ; optionnelles /var ≥ 5 GB, /usr 5–10 GB, /boot/efi 200 MB. TP1 (disque 100 Go) : /boot 1, /boot/efi 1, / 20, /home 50, /var 24, swap 4 Go.
- FHS 3.0 (juin 2015) : rôle de chaque répertoire (/bin, /sbin, /etc, /home, /root, /var, /tmp vidé au reboot, /usr, /lib, /media montage auto, /mnt montage manuel, /dev, /proc, /boot).

**TP1 — Prise en main** : commandes fichiers (mkdir -p, cd relatif/absolu, ls -la, touch, cp, mv, rm -rf, cat, nano/vi) ; `tty` (consoles Ctrl+Alt+F3) ; `$` vs `#` ; `man` (/ recherche, q, sections 1 et 5 : `man 1 passwd` vs `man 5 passwd`), `--help`, `man -k`, `mandb` ; `type`/`which` (builtin, alias, exécutable) ; complétion Tab ; `history`, `!!`, `!n`, Ctrl+R ; raccourcis Ctrl+C/L/A/E/U/D ; `date`, `cal`, `uptime` ; redirections `>`, `>>`, `2>`, `&>`, `2>/dev/null` ; `head`, `tail`, `less`, `grep -c`, `cut -d: -f1`, `sort`, `wc -l`, tubes `|`, `find -name -mtime -size`, `du -sh /var/log/* | sort -h | tail -5`, `tee` ; `ls -l` (type, droits, propriétaire, groupe, taille, date) ; SSH : `systemctl status sshd`, `is-enabled`, `firewall-cmd --list-services`, `ssh user@IP`, `hostname`, `$SSH_CONNECTION`, `who`, `w`, `ssh user@IP "uptime; df -h /"`.

**TP2 — GRUB2** : rôle (menu, charge noyau + initramfs, passe la main) ; détection UEFI `[ -d /sys/firmware/efi ]` ; grub.cfg BIOS `/boot/grub2/grub.cfg`, UEFI `/boot/efi/EFI/redhat/grub.cfg` (relais) ; `/boot` : vmlinuz, initramfs, loader/entries (BLS), grub2/grubenv ; `uname -r`, `rpm -q kernel-core` ; ne jamais éditer grub.cfg directement → `/etc/default/grub` (GRUB_TIMEOUT, GRUB_DEFAULT 0/1/saved, GRUB_TIMEOUT_STYLE=menu, GRUB_CMDLINE_LINUX, GRUB_DISABLE_SUBMENU, GRUB_ENABLE_BLSCFG…) + `/etc/grub.d/` (00_header, 01_users, 10_linux, 30_uefi-firmware, 40_custom) puis `grub2-mkconfig -o /boot/grub2/grub.cfg` ; sauvegardes `cp -p` avant modif ; entrées 40_custom `menuentry "Redemarrer" { reboot }` / `halt` ; reset mdp root (rd.break… voir §6) ; protection `grub2-setpassword` → `/boot/grub2/user.cfg` (supprimer ce fichier pour enlever la protection) et pourquoi (mode single user, console GRUB, OS non sécurisés).

**TP3 — systemd** : `systemctl --version`, `ps aux | head -2` (PID 1), `whereis`, `systemd-analyze` (+ `blame`, `critical-chain`) ; targets : `get-default`, `set-default` (lien symbolique /etc/systemd/system/default.target), `isolate`, `list-units --type target`, `--failed`, runlevel/telinit (anciens) ; services : `list-unit-files --type=service`, start/stop/restart/reload/status/is-active/enable/disable/mask/unmask/kill ; `journalctl -b -f -u -p err|warning|info --since -n -o json|json-pretty|cat|verbose` ; service personnalisé `[Unit] Description` / `[Service] ExecStart` / `[Install] WantedBy=multi-user.target` + `daemon-reload`, `enable`, `start`.

**TP4 — Paquetages** : rpm `-qa | wc -l`, `-qi`, `-ql`, `-qf /etc/services`, `-V` (fichiers modifiés), `-qpc` (fichiers de config d'un .rpm), `-K` (signature), `-ivh --nodeps`, `-q`, `-e`, `-qf /bin/ls` ; rpm ne gère pas les dépendances (wireshark échoue) ; dnf : install, `check-update`, update, `history` / `history info N` / `history undo N`, `info`, `provides /usr/share/magic`, `group list/info/install/remove "System Tools"`, `repolist`, `/etc/yum.repos.d/*.repo` (`enabled=0`), `yum-config-manager --enable` ; dépôt local : httpd, `mkdir /var/www/html/mon_depot`, `yum install --downloadonly --downloaddir=…`, `createrepo`, fichier `.repo` (`baseurl=file:///…`, `gpgcheck=0`, `enabled=1`).

**Chap 4 + TP5 — Utilisateurs, groupes, droits** (chapitre le plus important) :
- Types de comptes : root (UID 0), système, ordinaires (UID ≥ 1000).
- Groupe : nom, GID, membres, mot de passe et admin (rares). Groupe primaire + secondaires.
- `/etc/passwd` `login:x:uid:gid:commentaire:home:shell` (lecture pour tous) ; `/etc/shadow` `login:mdp:last:may(min):must(max):warn:inactif:disable` (root seul ; `!!` = pas de mdp) ; `/etc/group` `group:passwd:gid:membres` ; `/etc/gshadow` `group:passwd:admins:membres` (ex. `developpeurs:$6$…:admin1,admin2:user1,user2,user3`, $6$ = SHA-512).
- `vipw` / `vigr` (verrouillage). Défauts : `/etc/default/useradd` (GROUP, HOME, INACTIVE, EXPIRE, SHELL, SKEL, CREATE_MAIL_SPOOL ; `useradd -D`), `/etc/login.defs` (UID_MIN/MAX, SYS_UID_MIN/MAX, PASS_MAX_DAYS, PASS_MIN_DAYS, PASS_MIN_LENGTH, CREATE_HOME, ENCRYPT_METHOD), `/etc/skel`.
- useradd `-u -c -d -D -e -g -G -m -M -s -r` ; usermod `-m (avec -d) -l -e -L -U -a -G -s -c` (**piège : `-G` sans `-a` écrase les groupes secondaires**) ; userdel / `-r` / `-rf` ; `find / -type f -uid 1002 -print -exec rm {} \;` ; passwd `-d -l -S -u -e -n -x -w -i` ; chage `-d -E -I -m -M -W -l` (ex. `chage -M 90 -W 7 alice`).
- groupadd `-g -f -r`, groupmod `-n -g`, groupdel (groupe sans membres), gpasswd `-a -A -d -M`.
- whoami, who, groups, id (`-u -g -Gn`).
- Droits r/w/x sur fichier vs répertoire ; chmod symbolique (u g o a, + - =) et absolu (r=4 w=2 x=1 ; 755, 644, 600, 777 déconseillé ; ex. `rwxrw-r--` = 764) ; `-R` ; chgrp ; chown `user`, `:groupe`, `user:groupe`, `-R`.
- sudo : `visudo`, `visudo -c`, `/etc/sudoers.d/`, format `utilisateur hôte=(cible) commandes`, `%wheel ALL=(ALL) ALL`, `NOPASSWD:`, ex. `%developers ALL=(ALL) /usr/bin/systemctl, /usr/bin/journalctl`.
- Les 44 questions du TP5 doivent toutes exister comme exercices ou missions TerminalSim (tp, tpsys, tmpuser, /etc/skel/bienvenue.txt, groupe IIR, /opt/donnees en 755 propriétaire tp, tp1 UID 2003 groupe users expirant le 31/12, `chage -d 0 -I 2`, wheel, `tp1 ALL=(root) /usr/sbin/reboot` après retrait de wheel…).

### 8.2 Module Analyse de données (Pr. A. Kadiri, EMSI)

**Chap 0 — Introduction** : définition ; 4 objectifs (décrire, relier, prédire, décider) ; exemple santé (diabète) ; 5 types : descriptive (moyenne, variance, graphiques), exploratoire (ACP, AFC, clustering), confirmatoire (tests), prédictive (régression, ML), prescriptive (simulation, optimisation) ; 5 étapes : collecte, nettoyage, exploration, modélisation, interprétation ; outils statistiques / informatiques (Python Pandas NumPy Matplotlib, R, Excel, SPSS, Power BI) / visualisation ; domaines (santé, finance, marketing, industrie, sciences sociales, IT) ; rôle dans la décision.

**Chap 1 — pandas** : `pip install pandas` ; toutes les fonctions `read_*` (csv, fwf, clipboard, excel, hdf, html, json, feather, orc, parquet, pickle, sas, spss, sql, sql_table, stata, xml) ; écriture `to_csv`, `to_excel`, `to_json` ; Series (1D) vs DataFrame (2D) ; paramètres `read_excel` (io, sheet_name 0/nom/None, header, names, index_col, usecols, skiprows, nrows, dtype, engine, na_values, converters) + `sep`, `decimal`.
Feuille N°1 (corrigé de référence) :
```python
url = "http://egallic.fr/Enseignement/Python/Exercices/donnees/"
pd.read_csv("notes.csv"); pd.read_csv(url + "notes.csv")
pd.read_csv(url + "notes_decim.csv", sep=";", decimal=",")
pd.read_csv(url + "notes_h.csv", header=None)
pd.read_csv(url + "notes_h_s.csv", header=None, skiprows=1)
pd.read_excel(url + "notes.xlsx", sheet_name=0)
pd.read_excel(url + "notes.xlsx", sheet_name="notes_h_s", skiprows=1)
df.to_csv("notes_export.csv", sep=",", decimal=".", index=False)
```

**Chap 4 — Visualisation** : pourquoi visualiser ; écosystème (Matplotlib fondamental, Pandas débutant, Altair/Seaborn intermédiaire, Plotly/Bokeh avancé) ; styles procédural vs orienté objet (recommandé) ; plot, scatter (c, s, alpha, cmap, colorbar), hist (bins, cumulative, density), bar groupé, pie (autopct, explode, startangle), subplots 2×2 + tight_layout ; règles d'or (simplicité, clarté, précision, couleurs, honnêteté) et erreurs (3D inutile, couleurs non accessibles, log injustifié, surcharge, labels illisibles) ; tableau objectif → graphique (comparaison : barres/radar, éviter camembert/3D ; distribution : histogramme/box/violon ; composition : empilé/treemap ; relation : scatter/ligne/heatmap ; évolution : ligne/aire ; spatial : cartes) ; workflow exploration → analyse → présentation → validation → export ; export PNG/PDF/SVG/JPG, `savefig(dpi=300)`, rcParams ; Seaborn (histplot kde, kdeplot, ecdfplot, boxplot, scatterplot hue, lineplot, relplot col, heatmap corr annot cmap coolwarm + mask triu ; datasets tips/iris/fmri) ; pandas `df.plot`, `.hist`, `.box`, `.area`, `.scatter`.

**Chap 5 — Tests d'hypothèses** : hypothèse paramétrique / non paramétrique ; H0 / H1 (bilatéral, gauche, droite) ; origines de H0 ; α (type I), β (type II), puissance 1−β ; tableau de décision ; exemple du procès (2 cas) ; étapes 1→7 ; conclusion forte (rejet) / faible ; région critique ; Z0 (σ connu), T0 (σ inconnu, S avec n−1, ddl n−1) ; règles de rejet bilatéral/unilatéral ; P-value (définition, formules Φ, rejet si α > PV) ; test d'ajustement du χ² (Ei = n·pi, regrouper si Ei petit, χ² = Σ(Oi−Ei)²/Ei, ν = k − p − 1).
Exemples du cours — **résultats à vérifier par les tests Vitest** :
| Exemple | Données | Résultat attendu |
|---|---|---|
| Fusée (σ connu, bilatéral, α=5 %) | µ0=40, σ=2, n=25, x̄=41.25 | Z0 = 3.125 > 1.96 → rejet H0 ; PV ≈ 0.0018 |
| Comprimés (σ inconnu, bilatéral, seuil 98 %) | 0.81 0.84 0.83 0.80 0.85 0.86 0.85 0.83 0.84 0.80 ; µ0=0.83 | x̄=0.831, S≈0.0213, T0≈0.148 < t(0.01;9)=2.821 → on ne rejette pas H0 |
| Glycémie (σ connu, unilatéral gauche, α=5 %) | µ0=1, σ=0.1, n=9, x̄=1.12 | Z0 = 3.6, région Z0 < −1.645 → on ne rejette pas H0 |
| χ² normalité (α=5 %) | classes <0.5, [0.5;1[, [1;1.5[, ≥1.5 ; O = 2, 23, 17, 8 ; n=50 ; x̄=1.168 ; S=0.591 | pi ≈ 0.129, 0.259, 0.325, 0.287 ; Ei ≈ 6.46, 12.95, 16.24, 14.36 ; χ² ≈ 13.74 ; ν = 1 ; seuil 3.841 → rejet H0 |

Valeurs utiles : z 1.282 / 1.645 / 1.96 / 2.054 / 2.326 / 2.576 ; χ²(0.05) : 3.841 (ν=1), 5.991 (2), 7.815 (3).

> Note pour l'UI : les chapitres 2 et 3 du module Analyse de données ne sont pas encore fournis. Afficher deux chapitres « Bientôt disponibles » (verrouillés), prêts à être remplis.

## 9. Mode 24h (« Rev24 ») — la fonctionnalité phare

Un mode qui transforme 24 heures en plan de révision guidé, du « je ne sais rien » au « prêt pour le contrôle ».

1. **Démarrage** : l'étudiant choisit le module (ou les deux), l'heure de l'examen, et passe un **diagnostic de 15 questions** (5 min). Le site calcule le niveau par chapitre.
2. **Plan généré automatiquement** sur la timeline des 24h (ou jusqu'à l'heure de l'examen si < 24h) :
   - blocs **Pomodoro 25/5** (pause longue 15 min toutes les 4 sessions) ;
   - priorité aux chapitres faibles × poids à l'examen (Linux : utilisateurs/droits > systemd > paquets > GRUB > TP1 > intro ; Analyse : tests > pandas > visualisation > intro) ;
   - chaque bloc = 1 objectif précis : « Cours : chage & passwd (10 min) → 8 QCM → 1 mission terminal » ;
   - **sommeil protégé** : bloc de nuit de 6–7 h obligatoire (non supprimable, avec message expliquant pourquoi le sommeil consolide la mémoire), repas et pauses inclus ;
   - les 2 dernières heures avant l'examen : fiche de révision + flashcards uniquement (pas de nouveau contenu).
3. **Pendant le mode** : compte à rebours géant animé, bloc en cours mis en avant, minuteur Pomodoro avec son doux, bouton « fini / besoin de plus de temps » (le plan se recalcule), notifications navigateur optionnelles.
4. **Checkpoints** toutes les ~4 h : mini-test de 10 questions ; les erreurs réinjectent du contenu dans les blocs suivants.
5. **Examen blanc final** chronométré, puis **rapport** : note /20, carte de chaleur des chapitres, « top 10 des pièges à relire ».
6. Progression sauvegardée : on peut fermer le site et reprendre (localStorage).
7. Ton motivant dans les 3 langues (en darija : « Yallah, ba9i lik 3 sessions w nsaliw had l chapitre 💪 »), sans culpabiliser.

## 10. Gamification légère

XP par question juste (plus pour difficulté 3), streak quotidien, badges (« Maître de chmod », « Root sans mot de passe », « Rejet de H0 », « 24h finisher »), niveau de maîtrise par chapitre (0–100 %) affiché en anneau animé.

## 11. Qualité attendue

- Lighthouse mobile ≥ 90 (perf, accessibilité, bonnes pratiques).
- Aucune erreur TypeScript, ESLint propre.
- Tests Vitest : moteur QCM (normalisation des réponses `command`), TerminalSim (au moins 40 cas : useradd/usermod -aG/-G, chmod octal/symbolique, chown, passwd -l, sudoers…), fonctions statistiques (tableau §8.2).
- Playwright : (1) changer la langue → tout le cours change ; (2) répondre à un QCM faux puis juste → il sort de « Mes erreurs » après 3 réussites ; (3) mission terminal TP5 /opt/donnees validée ; (4) démarrer le mode 24h et terminer un bloc.
- `README.md` : installation, scripts, comment **ajouter un nouveau module** (copier un dossier de contenu, remplir les JSON, lancer `content:check`).

## 12. Ordre de construction

1. Scaffold Vite/React/TS/Tailwind/Router/Zustand/PWA, thème, layout mobile, sélecteur de langue + i18n.
2. Schémas Zod + chargement du contenu + `content:check` / `i18n:check`.
3. Pages module / chapitre / fiche / formulaire avec rendu des sections (texte, code, formule, tableau, callout).
4. Moteur QCM (tous les types) + « Mes erreurs » + flashcards SM-2 + examen blanc.
5. `TerminalSim` + missions (le plus gros morceau, bien tester).
6. Animations Linux (§6) puis Analyse de données (§6) + `/stats-lab`.
7. Rédaction du **contenu complet** des deux modules dans les 3 langues (cours, ≥ volumes du §7).
8. Mode 24h.
9. Gamification, page progression, export/import JSON.
10. Tests, Lighthouse, README, build de production. Corriger jusqu'à ce que tout passe.

Quand tout est terminé : lancer `npm run build`, puis afficher un récapitulatif (pages, nombre de questions/exercices/flashcards par module et par langue, résultats des tests) et la commande pour lancer le site en local.
