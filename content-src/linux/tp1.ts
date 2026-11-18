import { setCtx, L, h, p, code, tip, trap, exam, table, quiz, mission, single, multi, cmd, order, ex, fc, ref } from '../lib';
import type { Chapter } from '../../src/lib/schema';

setCtx('linux', 'tp1');

export const questions = [
  cmd('lt-01', 1, ['Crée en une seule commande l\'arborescence `projets/web/css` (les répertoires parents n\'existent pas).', 'Dir b commande wa7da `projets/web/css` (les parents ma kaynin-ch).', 'Create the tree `projets/web/css` in one command (parents do not exist).'],
    ['mkdir -p projets/web/css'], ['`-p` (*parents*) crée les répertoires intermédiaires manquants, sans erreur s\'ils existent déjà.', '`-p` (*parents*) kaydir les répertoires li na9sin, bla erreur ila kaynin.', '`-p` (*parents*) creates missing intermediate directories, with no error if they exist.'],
    { 'mkdir projets/web/css': ['Sans `-p`, `mkdir` échoue : « Aucun fichier ou dossier de ce type » car `projets/web` n\'existe pas.', 'Bla `-p`, `mkdir` kayfchel 7it `projets/web` ma kaynch.', 'Without `-p`, `mkdir` fails because `projets/web` does not exist.'] }, ['fichiers']),
  cmd('lt-02', 1, ['Affiche **tous** les fichiers du répertoire courant, y compris cachés, au format long.', 'Werri **ga3** les fichiers, 7ta li mkhbbyin, b format long.', 'List **all** files in the current directory, including hidden ones, in long format.'],
    ['ls -la', 'ls -al', 'ls -l -a', 'ls -a -l'], ['`-l` = format long, `-a` = *all* (inclut les fichiers commençant par un point comme `.bashrc`). L\'ordre des options courtes est libre.', '`-l` = format long, `-a` = *all* (7ta `.bashrc`). Tartib dyal options ma kayhemmch.', '`-l` = long format, `-a` = *all* (includes dot files like `.bashrc`). Short option order does not matter.'],
    { 'ls -l': ['Il manque `-a` : les fichiers cachés n\'apparaissent pas.', 'Na9es `-a` : fichiers mkhbbyin ma kaybanouch.', 'Missing `-a`: hidden files are not shown.'] }, ['fichiers']),
  cmd('lt-03', 2, ['Supprime le répertoire `projets` et **tout son contenu**, sans confirmation.', 'Mse7 `projets` w **ga3 li fih**, bla ma ysowlek.', 'Delete `projets` and **all its content**, without confirmation.'],
    ['rm -rf projets', 'rm -fr projets', 'rm -r -f projets', 'rm -Rf projets'], ['`-r` récursif (répertoires), `-f` force (pas de question, pas d\'erreur si absent). Irréversible : pas de corbeille !', '`-r` récursif, `-f` force. Ma kayrje3ch : ma kaynach corbeille !', '`-r` recursive (directories), `-f` force (no prompt, no error if missing). Irreversible: there is no trash!'],
    { 'rm projets': ['« est un dossier » : sans `-r`, `rm` refuse les répertoires.', '« est un dossier » : bla `-r`, `rm` ma kaymse7ch répertoires.', '"is a directory": without `-r`, `rm` refuses directories.'], 'rmdir projets': ['`rmdir` ne supprime que des répertoires **vides**.', '`rmdir` kaymse7 ghir répertoires **khawyin**.', '`rmdir` only removes **empty** directories.'] }, ['fichiers']),
  single('lt-04', 1, ['Que signifie le `#` à la fin du prompt `[root@rhel9 ~]#` ?', 'Chnou ma3na `#` f lekher dyal `[root@rhel9 ~]#` ?', 'What does the `#` at the end of `[root@rhel9 ~]#` mean?'],
    [['On est connecté en root (administrateur)', 'Nta root (admin)', 'You are logged in as root (administrator)'], ['On est dans un commentaire', 'Nta f commentaire', 'You are in a comment'], ['La commande précédente a échoué', 'Commande li fatet fchlat', 'The previous command failed'], ['On est connecté en SSH', 'Nta f SSH', 'You are connected via SSH']], 0,
    ['`#` = **root**, `$` = utilisateur ordinaire. Le `~` indique qu\'on est dans son répertoire personnel.', '`#` = **root**, `$` = user 3adi. `~` = répertoire personnel.', '`#` = **root**, `$` = regular user. `~` means you are in your home directory.'],
    [['Le `#` du prompt n\'a rien à voir avec les commentaires de script.', '`#` dyal prompt machi commentaire.', 'The prompt `#` is unrelated to script comments.'], ['Le statut se voit avec `echo $?`, pas dans le prompt.', 'Statut kayban b `echo $?`.', 'Exit status is shown by `echo $?`, not the prompt.'], ['SSH ou pas, le symbole dépend uniquement de l\'utilisateur.', 'SSH wla la, rmz kay3tamed 3la user.', 'SSH or not, the symbol depends only on the user.']], ['shell']),
  single('lt-05', 2, ['Différence entre `man 1 passwd` et `man 5 passwd` ?', 'Chnou lfar9 bin `man 1 passwd` w `man 5 passwd` ?', 'Difference between `man 1 passwd` and `man 5 passwd`?'],
    [['Aucune', 'Walou', 'None'], ['Section 1 = la commande passwd ; section 5 = le format du fichier /etc/passwd', 'Section 1 = commande ; section 5 = format dyal /etc/passwd', 'Section 1 = the passwd command; section 5 = the /etc/passwd file format'], ['Section 5 = version 5 de passwd', 'Section 5 = version 5', 'Section 5 = passwd version 5'], ['Section 1 = page en anglais, 5 = en français', 'Section 1 = anglais, 5 = français', 'Section 1 = English, 5 = French']], 1,
    ['Le manuel est divisé en sections : **1** commandes utilisateur, **5** formats de fichiers, **8** administration. `man 5 passwd` décrit les 7 champs de `/etc/passwd`.', 'Man fih sections : **1** commandes, **5** formats dyal fichiers, **8** administration.', 'The manual has sections: **1** user commands, **5** file formats, **8** administration. `man 5 passwd` describes the 7 fields of `/etc/passwd`.'],
    [['Les deux pages sont différentes.', 'Bjouj mkhtalfin.', 'The two pages differ.'], ['Le chiffre est une section, pas une version.', 'Ra9m = section, machi version.', 'The number is a section, not a version.'], ['La langue dépend de `LANG`, pas de la section.', 'Logha kat3tamed 3la `LANG`.', 'Language depends on `LANG`, not the section.']], ['man']),
  cmd('lt-06', 2, ['Recherche toutes les pages de manuel dont la description contient le mot « password ».', 'Qelleb 3la ga3 pages man li fihom « password ».', 'Search all manual pages whose description contains "password".'],
    ['man -k password', 'apropos password'], ['`man -k` (équivalent `apropos`) cherche dans les descriptions. Si l\'index est vide : `mandb` (root) le reconstruit.', '`man -k` (= `apropos`) kayqelleb f descriptions. Ila index khawi : `mandb`.', '`man -k` (same as `apropos`) searches descriptions. If the index is empty, `mandb` (root) rebuilds it.'],
    { 'man password': ['Il n\'existe pas de page nommée « password » : il faut chercher par mot-clé avec `-k`.', 'Ma kaynach page smitha « password » : qelleb b `-k`.', 'There is no page named "password": search by keyword with `-k`.'] }, ['man']),
  single('lt-07', 2, ['Que répond `type cd` ?', 'Chnou kayjaweb `type cd` ?', 'What does `type cd` print?'],
    [['cd est /usr/bin/cd', 'cd est /usr/bin/cd', 'cd is /usr/bin/cd'], ['cd est une primitive du shell', 'cd est une primitive du shell', 'cd is a shell builtin'], ['cd est un alias', 'cd est un alias', 'cd is an alias'], ['cd : non trouvé', 'cd : non trouvé', 'cd: not found']], 1,
    ['`cd` est une **primitive** (builtin) : elle doit modifier le répertoire du shell lui-même, ce qu\'un programme externe ne peut pas faire. `type` distingue primitive, alias (`ls`) et exécutable (`useradd est /usr/sbin/useradd`).', '`cd` **primitive** (builtin) : khassha tbeddel répertoire dyal shell bra7o.', '`cd` is a **builtin**: it must change the shell\'s own directory, which an external program cannot do. `type` tells builtins, aliases (`ls`) and executables apart.'],
    [['Il n\'y a pas de binaire `cd` dans /usr/bin.', 'Ma kaynch binaire `cd`.', 'There is no `cd` binary.'], ['C\'est `ls` qui est un alias (`ls --color=auto`).', '`ls` howa alias.', '`ls` is the alias (`ls --color=auto`).'], ['`cd` existe toujours dans bash.', '`cd` dima kayn.', '`cd` always exists in bash.']], ['shell']),
  single('lt-08', 2, ['Que fait `!!` dans bash ?', 'Chnou kaydir `!!` f bash ?', 'What does `!!` do in bash?'],
    [['Annule la dernière commande', 'Kaylghi commande lekhra', 'Undoes the last command'], ['Réexécute la dernière commande', 'Kay3awed commande lekhra', 'Re-runs the last command'], ['Affiche l\'historique', 'Kayban historique', 'Shows the history'], ['Passe en root', 'Kaydouz root', 'Switches to root']], 1,
    ['`!!` réexécute la dernière commande (utile : `sudo !!`). `!n` exécute la commande n° n de `history`, **Ctrl+R** recherche dans l\'historique.', '`!!` kay3awed commande lekhra (`sudo !!`). `!n` = commande ra9m n, **Ctrl+R** = recherche.', '`!!` re-runs the last command (handy: `sudo !!`). `!n` runs command #n from `history`, **Ctrl+R** searches history.'],
    [['On ne peut pas « annuler » une commande dans le shell.', 'Ma ymkench tlghi commande.', 'You cannot "undo" a command in the shell.'], ['C\'est `history`.', 'Hadi `history`.', 'That is `history`.'], ['C\'est `su -` ou `sudo -i`.', 'Hadi `su -` wla `sudo -i`.', 'That is `su -` or `sudo -i`.']], ['shell']),
  multi('lt-09', 2, ['Quels raccourcis clavier sont corrects ?', 'Ach men raccourcis s7a7 ?', 'Which shortcuts are correct?'],
    [['Ctrl+C : interrompre la commande en cours', 'Ctrl+C : w9ef commande', 'Ctrl+C: interrupt the running command'], ['Ctrl+L : effacer l\'écran', 'Ctrl+L : msse7 écran', 'Ctrl+L: clear the screen'], ['Ctrl+A : aller en début de ligne', 'Ctrl+A : bdayat ster', 'Ctrl+A: go to line start'], ['Ctrl+E : effacer la ligne', 'Ctrl+E : msse7 ster', 'Ctrl+E: erase the line'], ['Ctrl+D : fin d\'entrée / déconnexion', 'Ctrl+D : fin / déconnexion', 'Ctrl+D: end of input / logout']], [0, 1, 2, 4],
    ['Ctrl+C interrompt, Ctrl+L efface, Ctrl+A début, **Ctrl+E fin de ligne**, Ctrl+U efface avant le curseur, Ctrl+D fin d\'entrée (quitte le shell si ligne vide).', 'Ctrl+C w9ef, Ctrl+L msse7, Ctrl+A bdaya, **Ctrl+E lekher**, Ctrl+U msse7 9bel curseur, Ctrl+D fin.', 'Ctrl+C interrupts, Ctrl+L clears, Ctrl+A start, **Ctrl+E end of line**, Ctrl+U deletes before cursor, Ctrl+D end of input.'],
    [['Ctrl+E va en **fin** de ligne ; c\'est Ctrl+U qui efface (avant le curseur).', 'Ctrl+E l **lekher** ; Ctrl+U howa li kaymse7.', 'Ctrl+E goes to the **end**; Ctrl+U erases (before cursor).']], ['shell']),
  single('lt-10', 2, ['Que fait `commande > fichier` si `fichier` existe déjà ?', 'Chnou kaydir `commande > fichier` ila fichier kayn ?', 'What does `command > file` do if `file` exists?'],
    [['Ajoute à la fin', 'Kayzid f lekher', 'Appends to the end'], ['Écrase le contenu', 'Kaymse7 contenu w ykteb', 'Overwrites the content'], ['Refuse', 'Kayrfod', 'Refuses'], ['Écrit les erreurs', 'Kayktb les erreurs', 'Writes the errors']], 1,
    ['`>` **écrase** (tronque) ; `>>` **ajoute** ; `2>` redirige les **erreurs** ; `&>` sortie + erreurs ; `2>/dev/null` jette les erreurs.', '`>` kay**mse7** ; `>>` kay**zid** ; `2>` les **erreurs** ; `&>` bjouj ; `2>/dev/null` kayrmi erreurs.', '`>` **overwrites**; `>>` **appends**; `2>` redirects **errors**; `&>` stdout + stderr; `2>/dev/null` discards errors.'],
    [['C\'est `>>`.', 'Hadi `>>`.', 'That is `>>`.'], ['bash écrase sans demander (sauf option noclobber).', 'bash kaymse7 bla ma ysowel.', 'bash overwrites without asking (unless noclobber).'], ['Les erreurs, c\'est `2>`.', 'Erreurs : `2>`.', 'Errors are `2>`.']], ['redirections']),
  cmd('lt-11', 2, ['Liste `/root` en tant qu\'utilisateur ordinaire en **jetant** les messages d\'erreur.', 'Lister `/root` b user 3adi w **rmi** les erreurs.', 'List `/root` as a regular user while **discarding** error messages.'],
    ['ls /root 2>/dev/null', 'ls /root 2> /dev/null'], ['`2>` redirige le flux d\'erreur (descripteur 2) ; `/dev/null` est un « trou noir » qui avale tout.', '`2>` kaydi flux dyal erreurs (2) ; `/dev/null` kayblle3 kolchi.', '`2>` redirects the error stream (fd 2); `/dev/null` swallows everything.'],
    { 'ls /root > /dev/null': ['`>` redirige la sortie **standard**, pas les erreurs : le message « Permission non accordée » s\'affiche quand même.', '`>` kaydi sortie standard, machi erreurs.', '`>` redirects **stdout**, not errors: "Permission denied" still shows.'] }, ['redirections']),
  cmd('lt-12', 2, ['Affiche **uniquement les noms de connexion** (1er champ) de `/etc/passwd`.', 'Werri **ghir les logins** (champ lowel) mn `/etc/passwd`.', 'Print **only the login names** (1st field) of `/etc/passwd`.'],
    ['cut -d: -f1 /etc/passwd', 'cut -d : -f 1 /etc/passwd', 'cut -f1 -d: /etc/passwd'], ['`cut -d:` choisit `:` comme délimiteur, `-f1` garde le 1er champ.', '`-d:` délimiteur `:`, `-f1` champ lowel.', '`-d:` sets `:` as the delimiter, `-f1` keeps field 1.'],
    { 'cut -f1 /etc/passwd': ['Sans `-d:`, le délimiteur par défaut est la tabulation : toute la ligne est affichée.', 'Bla `-d:`, délimiteur = tabulation : ster kaml kayban.', 'Without `-d:`, the default delimiter is TAB: whole lines are printed.'] }, ['filtres']),
  cmd('lt-13', 2, ['Compte le nombre de lignes de `/etc/passwd` qui contiennent `bash`.', '7seb ch7al mn ster f `/etc/passwd` fih `bash`.', 'Count the lines of `/etc/passwd` that contain `bash`.'],
    ['grep -c bash /etc/passwd', 'grep bash /etc/passwd | wc -l'], ['`grep -c` compte les lignes correspondantes (équivaut à `grep … | wc -l`).', '`grep -c` kay7seb lignes (= `grep … | wc -l`).', '`grep -c` counts matching lines (same as `grep … | wc -l`).'],
    { 'wc -l /etc/passwd': ['Compte **toutes** les lignes, pas seulement celles avec bash.', 'Kay7seb **ga3** lignes.', 'Counts **all** lines, not only bash ones.'] }, ['filtres']),
  cmd('lt-14', 3, ['Affiche les **5 plus gros** éléments de `/var/log` (taille lisible), du plus petit au plus grand.', 'Werri **5 kbar** f `/var/log` (taille lisible), mn sghir l kbir.', 'Show the **5 largest** items in `/var/log` (human sizes), smallest to largest.'],
    ['du -sh /var/log/* | sort -h | tail -5', 'du -sh /var/log/* | sort -h | tail -n 5'], ['`du -sh` : taille totale lisible de chaque élément ; `sort -h` trie des tailles humaines (K < M < G) ; `tail -5` garde les 5 dernières (les plus grosses).', '`du -sh` taille ; `sort -h` tri humain ; `tail -5` 5 lekhrin.', '`du -sh`: human total per item; `sort -h` sorts human sizes (K < M < G); `tail -5` keeps the last 5 (largest).'],
    { 'du -sh /var/log/* | sort -n | tail -5': ['`sort -n` compare des nombres : « 2,3M » < « 6,1K »… il faut `-h` pour les unités.', '`sort -n` ma kayfhemch unités : khass `-h`.', '`sort -n` ignores units (2.3M < 6.1K numerically): use `-h`.'], 'du -sh /var/log/* | sort -h | head -5': ['`head` donne les 5 plus **petits**.', '`head` kay3ti 5 **sghar**.', '`head` gives the 5 **smallest**.'] }, ['filtres', 'pipes']),
  cmd('lt-15', 3, ['Cherche dans `/etc` les fichiers dont le nom se termine par `.conf`, modifiés il y a **moins de 7 jours**.', 'Qelleb f `/etc` 3la fichiers `.conf` tbeddlou **a9al mn 7 iyam**.', 'Find files in `/etc` ending in `.conf`, modified **less than 7 days** ago.'],
    ['find /etc -name "*.conf" -mtime -7', 'find /etc -mtime -7 -name "*.conf"', 'find /etc -type f -name "*.conf" -mtime -7'], ['`-name` avec motif entre guillemets (sinon le shell l\'étend), `-mtime -7` = moins de 7 jours (`+7` = plus de 7).', '`-name` b guillemets, `-mtime -7` = a9al mn 7 iyam.', '`-name` with a quoted pattern (otherwise the shell expands it), `-mtime -7` = less than 7 days (`+7` = more than 7).'],
    { 'find /etc -name "*.conf" -mtime +7': ['`+7` = **plus** de 7 jours.', '`+7` = **ktar** mn 7.', '`+7` = **more** than 7 days.'] }, ['find']),
  single('lt-16', 2, ['Dans `-rw-r--r--. 1 root root 2840 nov. 18 13:01 passwd`, que vaut le 3e champ (`root`) ?', 'F `-rw-r--r--. 1 root root 2840 … passwd`, chnou howa champ 3 (`root`) ?', 'In `-rw-r--r--. 1 root root 2840 … passwd`, what is the 3rd field (`root`)?'],
    [['Le groupe propriétaire', 'Groupe', 'The owning group'], ['L\'utilisateur propriétaire', 'Mol l fichier (user)', 'The owning user'], ['Le nombre de liens', 'Nombre de liens', 'The link count'], ['Le type de fichier', 'Type dyal fichier', 'The file type']], 1,
    ['`ls -l` : type+droits (`-rw-r--r--`), nombre de liens (`1`), **propriétaire** (`root`), **groupe** (`root`), taille, date, nom. Le `.` final = contexte SELinux.', '`ls -l` : type+droits, liens, **propriétaire**, **groupe**, taille, date, smiya.', '`ls -l`: type+permissions, link count, **owner**, **group**, size, date, name. The trailing `.` = SELinux context.'],
    [['Le groupe est le 4e champ.', 'Groupe howa champ 4.', 'The group is field 4.'], ['Le nombre de liens est le 2e champ (`1`).', 'Liens = champ 2.', 'The link count is field 2 (`1`).'], ['Le type est le 1er caractère (`-` fichier, `d` répertoire, `l` lien).', 'Type = 7arf lowel.', 'The type is the first character (`-` file, `d` dir, `l` link).']], ['ls']),
  single('lt-17', 1, ['Quelle commande affiche le terminal dans lequel tu es (ex. `/dev/pts/0`) ?', 'Ach men commande katwerri terminal (`/dev/pts/0`) ?', 'Which command shows your terminal (e.g. `/dev/pts/0`)?'],
    [['who', 'who', 'who'], ['tty', 'tty', 'tty'], ['uname', 'uname', 'uname'], ['hostname', 'hostname', 'hostname']], 1,
    ['`tty` affiche le terminal : `/dev/pts/N` = pseudo-terminal (graphique ou SSH), `/dev/ttyN` = console texte (Ctrl+Alt+F3…).', '`tty` : `/dev/pts/N` = pseudo-terminal, `/dev/ttyN` = console (Ctrl+Alt+F3).', '`tty` prints the terminal: `/dev/pts/N` = pseudo-terminal (GUI or SSH), `/dev/ttyN` = text console (Ctrl+Alt+F3…).'],
    [['`who` liste les sessions de tous les utilisateurs.', '`who` kaylister sessions dyal ga3.', '`who` lists every user\'s sessions.'], ['`uname` affiche le noyau / système.', '`uname` noyau.', '`uname` shows kernel/system info.'], ['`hostname` affiche le nom de la machine.', '`hostname` smiya dyal machine.', '`hostname` shows the machine name.']], ['shell']),
  cmd('lt-18', 2, ['Vérifie si le service SSH est **activé au démarrage**.', 'Chouf wach SSH **activé f démarrage**.', 'Check whether the SSH service is **enabled at boot**.'],
    ['systemctl is-enabled sshd', 'systemctl is-enabled sshd.service'], ['`is-enabled` répond `enabled`/`disabled` (démarrage auto), `is-active` répond `active`/`inactive` (état actuel), `status` donne le détail.', '`is-enabled` (démarrage), `is-active` (daba), `status` (détail).', '`is-enabled` answers `enabled`/`disabled` (boot), `is-active` answers `active`/`inactive` (now), `status` shows details.'],
    { 'systemctl is-active sshd': ['`is-active` donne l\'état **actuel**, pas le démarrage automatique.', '`is-active` = l7ala **daba**.', '`is-active` gives the **current** state, not boot enablement.'] }, ['ssh']),
  cmd('lt-19', 3, ['Depuis ton poste, exécute **à distance** sur `192.168.56.10` (compte `etudiant`) les commandes `uptime` puis `df -h /`, sans ouvrir de session interactive.', 'Mn PC dyalek, nfed **mn b3id** 3la `192.168.56.10` (`etudiant`) `uptime` w `df -h /`, bla session.', 'From your PC, run **remotely** on `192.168.56.10` (account `etudiant`) `uptime` then `df -h /`, without an interactive session.'],
    ['ssh etudiant@192.168.56.10 "uptime; df -h /"', 'ssh etudiant@192.168.56.10 \'uptime; df -h /\''], ['Les guillemets passent les deux commandes au shell **distant** ; sans eux, `df -h /` serait exécuté localement après la fin de ssh.', 'Guillemets kaysifto bjouj l shell **dyal b3id**.', 'Quotes send both commands to the **remote** shell; without them `df -h /` would run locally after ssh ends.'],
    { 'ssh etudiant@192.168.56.10 uptime; df -h /': ['Le `;` est interprété par ton shell local : `df -h /` s\'exécute sur ton poste.', '`;` kayfhmo shell local : `df` kaytnfed 3endek.', 'The `;` is interpreted locally: `df -h /` runs on your machine.'] }, ['ssh']),
  order('lt-20', 2, ['Remets dans l\'ordre la vérification d\'un accès SSH à une VM.', 'Rttab tsdi9 dyal SSH l VM.', 'Order the steps to check SSH access to a VM.'],
    [['systemctl status sshd (service actif ?)', 'systemctl status sshd', 'systemctl status sshd (service running?)'], ['firewall-cmd --list-services (ssh autorisé ?)', 'firewall-cmd --list-services', 'firewall-cmd --list-services (ssh allowed?)'], ['ip a / hostname -I (adresse IP de la VM)', 'ip a / hostname -I', 'ip a / hostname -I (VM IP address)'], ['ssh etudiant@IP depuis le poste', 'ssh etudiant@IP', 'ssh etudiant@IP from your PC'], ['echo $SSH_CONNECTION / who (vérifier la session)', 'echo $SSH_CONNECTION / who', 'echo $SSH_CONNECTION / who (check the session)']],
    ['On vérifie le **service**, le **pare-feu**, l\'**adresse**, puis on se connecte et on contrôle la session (`$SSH_CONNECTION` contient IP/port client et serveur).', 'Service → pare-feu → adresse → connexion → tsdi9.', 'Check the **service**, **firewall**, **address**, then connect and verify the session (`$SSH_CONNECTION` holds client/server IP and ports).'], ['ssh']),
  single('lt-21', 3, ['Pourquoi `find / -name *.conf` peut-il donner un résultat inattendu ?', '3lach `find / -name *.conf` ymken y3ti natija ghariba ?', 'Why can `find / -name *.conf` give an unexpected result?'],
    [['find ne connaît pas `*`', 'find ma kay3refch `*`', 'find does not understand `*`'], ['Le shell remplace `*.conf` par les fichiers .conf du **répertoire courant** avant d\'appeler find', 'Shell kaybeddel `*.conf` b fichiers dyal **répertoire courant** 9bel find', 'The shell expands `*.conf` to **current-directory** .conf files before calling find'], ['`-name` est sensible à la casse', '`-name` sensible l casse', '`-name` is case-sensitive'], ['find ne cherche pas dans /', 'find ma kayqellebch f /', 'find does not search /']], 1,
    ['Sans guillemets, **bash développe le motif** : s\'il y a `a.conf` dans le répertoire courant, find reçoit `-name a.conf`. Toujours écrire `-name "*.conf"`.', 'Bla guillemets, **bash kayt-développer** motif. Dima kteb `-name "*.conf"`.', 'Unquoted, **bash expands the glob**: if `a.conf` exists here, find gets `-name a.conf`. Always write `-name "*.conf"`.'],
    [['find comprend très bien les motifs… s\'ils lui parviennent.', 'find kayfhem motifs… ila wslou lih.', 'find handles patterns fine… if it receives them.'], ['Vrai, mais ce n\'est pas la cause ici (`-iname` ignore la casse).', 'S7i7 walakin machi hada sabab.', 'True, but not the cause here (`-iname` ignores case).'], ['find parcourt bien `/`.', 'find kayqelleb f `/`.', 'find does search `/`.']], ['find']),
  multi('lt-22', 3, ['`commande | tee resultat.txt` : quelles affirmations sont vraies ?', '`commande | tee resultat.txt` : chnou s7i7 ?', '`command | tee result.txt`: which statements are true?'],
    [['La sortie s\'affiche à l\'écran', 'Sortie katban f écran', 'Output is shown on screen'], ['La sortie est écrite dans resultat.txt', 'Sortie katktb f resultat.txt', 'Output is written to result.txt'], ['tee -a ajoute au lieu d\'écraser', 'tee -a kayzid', 'tee -a appends instead of overwriting'], ['Les erreurs de commande sont aussi capturées', 'Erreurs 7ta homa', 'The command\'s errors are captured too']], [0, 1, 2],
    ['`tee` lit l\'entrée standard et l\'écrit **à la fois** à l\'écran et dans le fichier (`-a` pour ajouter). Le tube `|` ne transmet que la sortie standard.', '`tee` kayktb f écran **w** f fichier (`-a` zid). `|` kaydi ghir sortie standard.', '`tee` writes stdin **both** to the screen and the file (`-a` appends). The pipe only carries stdout.'],
    [['Les erreurs (stderr) ne passent pas dans le tube : il faudrait `2>&1 |` ou `|&`.', 'Erreurs ma kaydouzouch f `|`.', 'stderr does not go through the pipe: you need `2>&1 |` or `|&`.']], ['redirections', 'pipes'])
];

export const chapter: Chapter = {
  id: 'tp1',
  module: 'linux',
  order: 2,
  title: L(['TP1 — Prise en main du shell', 'TP1 — Bda m3a shell', 'TP1 — Getting started with the shell']),
  summary: L(['Fichiers et répertoires, aide (man), historique, redirections, filtres et tubes, find, ls -l et connexion SSH.', 'Fichiers w répertoires, man, historique, redirections, filtres, pipes, find, ls -l w SSH.', 'Files and directories, help (man), history, redirections, filters and pipes, find, ls -l and SSH.']),
  estimatedMinutes: 60,
  sections: [
    h(['Fichiers et répertoires', 'Fichiers w répertoires', 'Files and directories']),
    p(['Un chemin **absolu** commence par `/` (`/home/etudiant/tp1`), un chemin **relatif** part du répertoire courant (`tp1`, `../etc`). `.` = ici, `..` = parent, `~` = répertoire personnel.', 'Chemin **absolu** kaybda b `/`, **relatif** mn répertoire courant. `.` = hna, `..` = parent, `~` = home.', 'An **absolute** path starts with `/` (`/home/etudiant/tp1`), a **relative** path starts from the current directory (`tp1`, `../etc`). `.` = here, `..` = parent, `~` = home.']),
    code(`pwd                      # où suis-je ?
mkdir -p tp1/a/b         # crée les parents manquants
cd tp1/a                 # relatif
cd /etc                  # absolu
cd ~   ;  cd -           # home ; répertoire précédent
ls -la                   # tout, format long
touch notes.txt          # fichier vide / met à jour la date
cp notes.txt copie.txt   # copier (-r pour un répertoire, -p pour garder droits et dates)
mv copie.txt doc.txt     # renommer / déplacer
rm doc.txt ; rm -rf tp1  # supprimer (irréversible !)
cat /etc/hostname        # afficher un fichier
nano f.txt  /  vi f.txt  # éditer`),
    mission('m-tp1-files'),
    quiz('lt-01', 'lt-02', 'lt-03'),
    h(['Terminaux, prompt et aide', 'Terminaux, prompt w l\'aide', 'Terminals, prompt and help']),
    p(['- `tty` : `/dev/pts/0` (terminal graphique ou SSH) ou `/dev/tty3` (console texte, **Ctrl+Alt+F3**).\n- Prompt `[etudiant@rhel9 ~]$` : utilisateur ordinaire ; `[root@rhel9 ~]#` : **root**.\n- `man commande` : `/mot` pour chercher, `n` suivant, `q` quitter. Sections : **1** commandes, **5** formats de fichiers, **8** administration (`man 5 passwd`).\n- `commande --help` : aide courte ; `man -k mot` (= `apropos`) : recherche ; `mandb` : reconstruit l\'index.\n- `type ls` / `which ls` : primitive, alias ou exécutable ?', '- `tty` : `/dev/pts/0` (graphique wla SSH) wla `/dev/tty3` (console, **Ctrl+Alt+F3**).\n- `$` = user 3adi ; `#` = **root**.\n- `man` : `/mot` qelleb, `n` li jay, `q` khrej. Sections : **1** commandes, **5** fichiers, **8** admin.\n- `--help` ; `man -k` (= `apropos`) ; `mandb`.\n- `type` / `which`.', '- `tty`: `/dev/pts/0` (GUI terminal or SSH) or `/dev/tty3` (text console, **Ctrl+Alt+F3**).\n- Prompt `$` = regular user; `#` = **root**.\n- `man command`: `/word` search, `n` next, `q` quit. Sections: **1** commands, **5** file formats, **8** admin (`man 5 passwd`).\n- `--help`: short help; `man -k word` (= `apropos`): search; `mandb`: rebuild the index.\n- `type ls` / `which ls`: builtin, alias or executable?']),
    exam(['`man 1 passwd` (la commande) ≠ `man 5 passwd` (le fichier `/etc/passwd`) : question classique.', '`man 1 passwd` ≠ `man 5 passwd` : so2al m3rouf.', '`man 1 passwd` (command) ≠ `man 5 passwd` (file): a classic question.']),
    quiz('lt-04', 'lt-05', 'lt-07'),
    h(['Historique et raccourcis', 'Historique w raccourcis', 'History and shortcuts']),
    table([['Raccourci', 'Raccourci', 'Shortcut'], ['Effet', 'Chnou kaydir', 'Effect']], [
      ['Tab', ['Complétion des commandes et chemins (2× : liste les possibilités)', 'Complétion (2× : liste)', 'Complete commands and paths (twice: list options)']],
      ['↑ / ↓ · history · !! · !n', ['Rappel / liste / dernière commande / commande n° n', 'Rappel / liste / lekhra / ra9m n', 'Recall / list / last command / command #n']],
      ['Ctrl+R', ['Recherche dans l\'historique', 'Recherche f historique', 'Reverse-search the history']],
      ['Ctrl+C · Ctrl+D', ['Interrompre · fin d\'entrée (déconnexion)', 'W9ef · fin (déconnexion)', 'Interrupt · end of input (logout)']],
      ['Ctrl+L · Ctrl+A · Ctrl+E · Ctrl+U', ['Effacer l\'écran · début · fin de ligne · effacer avant le curseur', 'Msse7 · bdaya · lekher · msse7 9bel curseur', 'Clear · line start · line end · delete before cursor']]
    ]),
    code(`date ; cal ; uptime        # date, calendrier, durée de fonctionnement + charge`),
    quiz('lt-08', 'lt-09'),
    h(['Redirections, filtres et tubes', 'Redirections, filtres w pipes', 'Redirections, filters and pipes']),
    table([['Syntaxe', 'Syntaxe', 'Syntax'], ['Effet', 'Chnou kaydir', 'Effect']], [
      ['cmd > f', ['Sortie standard dans f (écrase)', 'Sortie f f (kaymse7)', 'stdout to f (overwrite)']], ['cmd >> f', ['Ajoute à la fin de f', 'Kayzid f lekher', 'Append to f']], ['cmd 2> f', ['Erreurs dans f', 'Erreurs f f', 'stderr to f']], ['cmd &> f', ['Sortie + erreurs dans f', 'Bjouj f f', 'stdout + stderr to f']], ['cmd 2>/dev/null', ['Jeter les erreurs', 'Rmi erreurs', 'Discard errors']], ['cmd1 | cmd2', ['La sortie de cmd1 devient l\'entrée de cmd2', 'Sortie dyal cmd1 = entrée dyal cmd2', 'cmd1 output becomes cmd2 input']]
    ]),
    code(`head -n 3 /etc/passwd            # 3 premières lignes (tail : dernières, tail -f : suivre)
less /var/log/messages            # pager (/ recherche, q quitter)
grep -c bash /etc/passwd          # nombre de lignes contenant bash
cut -d: -f1 /etc/passwd | sort    # logins triés
cat /etc/passwd | wc -l           # nombre de comptes
find /etc -name "*.conf" -mtime -7     # .conf modifiés il y a < 7 jours
find /var -size +10M 2>/dev/null       # fichiers > 10 Mo
du -sh /var/log/* | sort -h | tail -5  # 5 plus gros
ls -l /etc | tee liste.txt        # écran ET fichier`),
    trap(['Toujours mettre le motif de `find -name` entre guillemets : `-name "*.conf"`. Sinon le shell remplace `*.conf` avant que find ne le voie.', 'Dima dir guillemets : `-name "*.conf"`.', 'Always quote the `find -name` pattern: `-name "*.conf"`. Otherwise the shell expands it first.']),
    mission('m-tp1-pipes'),
    quiz('lt-10', 'lt-12', 'lt-14'),
    h(['Lire `ls -l`', 'Kifach t9ra `ls -l`', 'Reading `ls -l`']),
    code(`-rw-r--r--. 1 root root 2840 nov. 18 13:01 /etc/passwd
│└┬┘└┬┘└┬┘  │  │    │     │         │
│ u  g  o   │  │    │     │         └ nom
│           │  │    │     └ date de modification
│           │  │    └ taille (octets)
│           │  └ groupe propriétaire
│           └ nombre de liens (puis propriétaire : root)
└ type : - fichier, d répertoire, l lien`, 'text'),
    h(['Connexion SSH', 'Connexion SSH', 'SSH connection']),
    code(`systemctl status sshd              # le service tourne ?
systemctl is-enabled sshd          # démarre au boot ?
firewall-cmd --list-services       # ssh autorisé par le pare-feu ?
hostname ; hostname -I             # nom et IP de la VM
ssh etudiant@192.168.56.10         # se connecter
echo $SSH_CONNECTION ; who ; w     # vérifier la session
ssh etudiant@192.168.56.10 "uptime; df -h /"   # exécuter à distance`),
    tip(['Dans le terminal du site, `ssh etudiant@localhost` fonctionne (mot de passe `etudiant`) : teste un mot de passe verrouillé ou expiré !', 'F terminal dyal site, `ssh etudiant@localhost` khddam (mot de passe `etudiant`).', 'In the site\'s terminal, `ssh etudiant@localhost` works (password `etudiant`): try a locked or expired password!']),
    quiz('lt-18', 'lt-19')
  ],
  keyPoints: [
    L(['`mkdir -p`, `rm -rf` (irréversible), `cp -p` (garde droits/dates), chemins absolus (`/…`) vs relatifs.', '`mkdir -p`, `rm -rf`, `cp -p`, absolu vs relatif.', '`mkdir -p`, `rm -rf` (irreversible), `cp -p` (keeps perms/dates), absolute vs relative paths.']),
    L(['`$` utilisateur, `#` root ; `tty` → /dev/pts/N ou /dev/ttyN.', '`$` user, `#` root ; `tty`.', '`$` user, `#` root; `tty` → /dev/pts/N or /dev/ttyN.']),
    L(['man : sections 1 (commandes), 5 (fichiers), 8 (admin) ; `man -k` = apropos ; `mandb`.', 'man : 1, 5, 8 ; `man -k` ; `mandb`.', 'man: sections 1 (commands), 5 (files), 8 (admin); `man -k` = apropos; `mandb`.']),
    L(['`>` écrase, `>>` ajoute, `2>` erreurs, `&>` tout, `2>/dev/null` jeter ; `|` tube ; `tee` écran + fichier.', '`>` mse7, `>>` zid, `2>` erreurs, `&>` kolchi ; `|` ; `tee`.', '`>` overwrite, `>>` append, `2>` errors, `&>` both, `2>/dev/null` discard; `|` pipe; `tee` screen + file.']),
    L(['`cut -d: -f1`, `grep -c`, `sort -h`, `wc -l`, `find -name "*.x" -mtime -7 -size +10M`, `du -sh … | sort -h | tail -5`.', 'Filtres : cut, grep -c, sort -h, wc -l, find, du.', 'Filters: `cut -d: -f1`, `grep -c`, `sort -h`, `wc -l`, `find`, `du -sh … | sort -h | tail -5`.']),
    L(['SSH : `systemctl status sshd`, `firewall-cmd --list-services`, `ssh user@IP "cmd1; cmd2"`, `$SSH_CONNECTION`.', 'SSH : status sshd, firewall-cmd, ssh user@IP.', 'SSH: `systemctl status sshd`, `firewall-cmd --list-services`, `ssh user@IP "cmd1; cmd2"`, `$SSH_CONNECTION`.'])
  ]
};

export const exercises = [
  ex('lx-tp1-1', 2, ['Chemins absolus et relatifs', 'Chemins absolus w relatifs', 'Absolute and relative paths'],
    ['Tu es dans `/home/etudiant/tp1/a`. Donne la commande `cd` en chemin **relatif** puis en chemin **absolu** pour aller dans `/home/etudiant/docs`. Que fait ensuite `cd -` ?', 'Nta f `/home/etudiant/tp1/a`. 3ti `cd` **relatif** w **absolu** l `/home/etudiant/docs`. Chnou kaydir `cd -` ?', 'You are in `/home/etudiant/tp1/a`. Give the `cd` with a **relative** then an **absolute** path to `/home/etudiant/docs`. What does `cd -` do next?'],
    [['Compte les niveaux à remonter avec `..`.', '7seb ch7al mn `..`.', 'Count the levels to go up with `..`.']],
    [{ t: ['Relatif', 'Relatif', 'Relative'], b: ['On remonte de `a` → `tp1` → `etudiant` : `cd ../../docs`.', 'Ntl3ou `a` → `tp1` → `etudiant` : `cd ../../docs`.', 'Go up `a` → `tp1` → `etudiant`: `cd ../../docs`.'], code: 'cd ../../docs' },
     { t: ['Absolu', 'Absolu', 'Absolute'], b: ['Depuis la racine : `cd /home/etudiant/docs` (ou `cd ~/docs`).', 'Mn racine : `cd /home/etudiant/docs` (wla `~/docs`).', 'From the root: `cd /home/etudiant/docs` (or `cd ~/docs`).'], code: 'cd /home/etudiant/docs' },
     { t: ['cd -', 'cd -', 'cd -'], b: ['Revient au répertoire **précédent** (`/home/etudiant/tp1/a`) et l\'affiche.', 'Kayrje3 l répertoire **li 9bel** w kaywerrih.', 'Returns to the **previous** directory (`/home/etudiant/tp1/a`) and prints it.'] }],
    ['`cd ../../docs` ou `cd /home/etudiant/docs` ; `cd -` ramène dans `/home/etudiant/tp1/a`.', '`cd ../../docs` wla `cd /home/etudiant/docs` ; `cd -` kayrjje3 l `tp1/a`.', '`cd ../../docs` or `cd /home/etudiant/docs`; `cd -` goes back to `/home/etudiant/tp1/a`.'],
    [['Écrire `cd /docs` (cherche docs à la racine).', 'Tkteb `cd /docs`.', 'Writing `cd /docs` (looks for docs at the root).'], ['Un seul `..` (on reste dans tp1).', '`..` wa7da.', 'Only one `..` (you stay in tp1).']], { missionId: 'm-tp1-files' }),
  ex('lx-tp1-2', 3, ['Pipeline d\'audit des comptes', 'Pipeline dyal audit dyal comptes', 'Account audit pipeline'],
    ['À partir de `/etc/passwd`, écris **une** ligne de commande qui affiche, triés par ordre alphabétique, les logins des comptes ayant `/bin/bash` comme shell, puis une autre qui compte combien de comptes ont `/sbin/nologin`.', 'Mn `/etc/passwd`, kteb **ster wa7ed** kaywerri logins li 3endhom `/bin/bash` mrattbin, w ster akhor kay7seb ch7al 3endhom `/sbin/nologin`.', 'From `/etc/passwd`, write **one** command line printing, alphabetically, the logins whose shell is `/bin/bash`, then another counting accounts with `/sbin/nologin`.'],
    [['Filtre d\'abord les lignes avec `grep`.', 'Bda b `grep`.', 'Filter lines first with `grep`.'], ['Le shell est le 7e champ, le login le 1er.', 'Shell champ 7, login champ 1.', 'The shell is field 7, the login field 1.'], ['Pour compter : `grep -c` ou `| wc -l`.', '7seb : `grep -c` wla `wc -l`.', 'To count: `grep -c` or `| wc -l`.']],
    [{ t: ['Comptes bash', 'Comptes bash', 'bash accounts'], b: ['`grep` garde les lignes finissant par `/bin/bash` (`$` = fin de ligne), `cut` garde le login, `sort` trie.', '`grep` (`$` = lekher), `cut` login, `sort`.', '`grep` keeps lines ending in `/bin/bash` (`$` = end of line), `cut` keeps the login, `sort` sorts.'], code: 'grep "/bin/bash$" /etc/passwd | cut -d: -f1 | sort' },
     { t: ['Comptes nologin', 'Comptes nologin', 'nologin accounts'], b: ['`grep -c` compte directement les lignes.', '`grep -c` kay7seb.', '`grep -c` counts lines directly.'], code: 'grep -c "/sbin/nologin" /etc/passwd' }],
    ['`grep "/bin/bash$" /etc/passwd | cut -d: -f1 | sort` → etudiant, root ; `grep -c /sbin/nologin /etc/passwd`.', 'Natija : etudiant, root ; w `grep -c`.', '`grep "/bin/bash$" /etc/passwd | cut -d: -f1 | sort` → etudiant, root; `grep -c /sbin/nologin /etc/passwd`.'],
    [['Oublier `-d:` dans cut.', 'Tnsa `-d:`.', 'Forgetting `-d:` in cut.'], ['`grep bash` attrape aussi d\'autres chaînes contenant « bash ».', '`grep bash` y9der yjib 7wayj khrin.', '`grep bash` may match other strings containing "bash".']], { missionId: 'm-tp1-pipes' }),
  ex('lx-tp1-3', 2, ['Journal des erreurs', 'Journal dyal les erreurs', 'Error log'],
    ['En tant qu\'`etudiant`, lance `find /etc -name "*.conf"`. Envoie la liste des fichiers trouvés dans `confs.txt` et les erreurs « Permission non accordée » dans `erreurs.txt`. Puis ajoute la date à la fin de `confs.txt`.', 'B `etudiant`, dir `find /etc -name "*.conf"`. Résultats f `confs.txt` w erreurs f `erreurs.txt`. Men b3d zid date f lekher dyal `confs.txt`.', 'As `etudiant`, run `find /etc -name "*.conf"`. Send the found files to `confs.txt` and the "Permission denied" errors to `erreurs.txt`. Then append the date to `confs.txt`.'],
    [['Deux redirections sur la même commande.', 'Jouj redirections.', 'Two redirections on one command.'], ['Ajouter ≠ écraser.', 'Zid ≠ mse7.', 'Append ≠ overwrite.']],
    [{ t: ['Séparer les flux', 'Fr9 les flux', 'Split the streams'], b: ['Sortie standard → `>` ; erreurs → `2>`.', 'stdout → `>` ; erreurs → `2>`.', 'stdout → `>`; stderr → `2>`.'], code: 'find /etc -name "*.conf" > confs.txt 2> erreurs.txt' },
     { t: ['Ajouter la date', 'Zid date', 'Append the date'], b: ['`>>` ajoute sans écraser.', '`>>` kayzid.', '`>>` appends.'], code: 'date >> confs.txt' }],
    ['`find /etc -name "*.conf" > confs.txt 2> erreurs.txt` puis `date >> confs.txt`.', '`find … > confs.txt 2> erreurs.txt` w `date >> confs.txt`.', '`find /etc -name "*.conf" > confs.txt 2> erreurs.txt` then `date >> confs.txt`.'],
    [['Utiliser `&>` (tout part dans le même fichier).', 'Tst3mel `&>`.', 'Using `&>` (everything in one file).'], ['`date > confs.txt` efface la liste.', '`date > confs.txt` kaymse7 liste.', '`date > confs.txt` wipes the list.']]),
  ex('lx-tp1-4', 3, ['Diagnostiquer un SSH refusé', 'Diagnostic dyal SSH mrfoud', 'Diagnose a refused SSH'],
    ['`ssh etudiant@192.168.56.10` répond « Connection refused ». Quelles vérifications fais-tu **sur la VM**, dans quel ordre, et quelles commandes corrigent chaque cause possible ?', '`ssh` kayjaweb « Connection refused ». Chnou ghadi tverifyi **f VM**, b ach men tartib, w kifach t7ell ?', '`ssh etudiant@192.168.56.10` says "Connection refused". What do you check **on the VM**, in which order, and which commands fix each cause?'],
    [['« Refused » = personne n\'écoute sur le port 22.', '« Refused » = 7ta wa7ed ma kaysme3 f port 22.', '"Refused" = nobody listening on port 22.'], ['Pense service, démarrage auto, pare-feu.', 'Service, démarrage, pare-feu.', 'Think service, autostart, firewall.']],
    [{ t: ['Service', 'Service', 'Service'], b: ['`systemctl status sshd` : s\'il est inactif → `systemctl start sshd`.', '`status sshd` → `start sshd`.', '`systemctl status sshd`: if inactive → `systemctl start sshd`.'], code: 'systemctl status sshd\nsystemctl start sshd' },
     { t: ['Démarrage automatique', 'Démarrage automatique', 'Autostart'], b: ['`systemctl is-enabled sshd` ; sinon `systemctl enable sshd` (ou `enable --now`).', '`is-enabled` → `enable`.', '`is-enabled`; otherwise `systemctl enable sshd` (or `enable --now`).'], code: 'systemctl enable --now sshd' },
     { t: ['Pare-feu et adresse', 'Pare-feu w adresse', 'Firewall and address'], b: ['`firewall-cmd --list-services` doit contenir `ssh` (sinon `firewall-cmd --add-service=ssh --permanent ; firewall-cmd --reload`) ; vérifier l\'IP avec `hostname -I`.', 'firewall-cmd fih `ssh` ; IP b `hostname -I`.', '`firewall-cmd --list-services` must include `ssh`; check the IP with `hostname -I`.'], code: 'firewall-cmd --list-services\nhostname -I' }],
    ['Service démarré + activé (`enable --now sshd`), service `ssh` autorisé dans firewalld, bonne IP.', 'Service khddam + enable, ssh f firewall, IP s7i7a.', 'Service started + enabled (`enable --now sshd`), `ssh` allowed in firewalld, correct IP.'],
    [['Croire que `enable` démarre le service immédiatement.', 'Tdenn `enable` kaybda daba.', 'Thinking `enable` starts the service now.'], ['Oublier `--reload` après `--permanent`.', 'Tnsa `--reload`.', 'Forgetting `--reload` after `--permanent`.']])
];

export const flashcards = [
  fc('fc-tp1-1', ['`mkdir -p` ?', '`mkdir -p` ?', '`mkdir -p`?'], ['Crée les répertoires parents manquants, sans erreur si déjà présents.', 'Kaydir parents li na9sin.', 'Creates missing parent directories, no error if present.']),
  fc('fc-tp1-2', ['`$` vs `#` dans le prompt ?', '`$` vs `#` ?', '`$` vs `#` in the prompt?'], ['`$` utilisateur ordinaire, `#` root.', '`$` user 3adi, `#` root.', '`$` regular user, `#` root.']),
  fc('fc-tp1-3', ['Sections de man 1 / 5 / 8 ?', 'Sections man 1 / 5 / 8 ?', 'man sections 1 / 5 / 8?'], ['1 commandes utilisateur · 5 formats de fichiers · 8 administration.', '1 commandes · 5 fichiers · 8 admin.', '1 user commands · 5 file formats · 8 administration.']),
  fc('fc-tp1-4', ['`man -k mot` ?', '`man -k mot` ?', '`man -k word`?'], ['Recherche le mot dans les descriptions (= apropos). Index : `mandb`.', 'Qelleb f descriptions (= apropos).', 'Searches descriptions (= apropos). Index: `mandb`.']),
  fc('fc-tp1-5', ['`!!` · `!n` · Ctrl+R ?', '`!!` · `!n` · Ctrl+R ?', '`!!` · `!n` · Ctrl+R?'], ['Dernière commande · commande n° n · recherche dans l\'historique.', 'Lekhra · ra9m n · recherche.', 'Last command · command #n · reverse history search.']),
  fc('fc-tp1-6', ['`>` vs `>>` ?', '`>` vs `>>` ?', '`>` vs `>>`?'], ['`>` écrase, `>>` ajoute à la fin.', '`>` kaymse7, `>>` kayzid.', '`>` overwrites, `>>` appends.']),
  fc('fc-tp1-7', ['`2>/dev/null` ?', '`2>/dev/null` ?', '`2>/dev/null`?'], ['Jette les messages d\'erreur (flux 2).', 'Kayrmi erreurs.', 'Discards error messages (stream 2).']),
  fc('fc-tp1-8', ['Lister les logins de /etc/passwd ?', 'Logins mn /etc/passwd ?', 'List logins from /etc/passwd?'], ['`cut -d: -f1 /etc/passwd`', '`cut -d: -f1 /etc/passwd`', '`cut -d: -f1 /etc/passwd`']),
  fc('fc-tp1-9', ['5 plus gros éléments de /var/log ?', '5 kbar f /var/log ?', '5 largest items in /var/log?'], ['`du -sh /var/log/* | sort -h | tail -5`', '`du -sh /var/log/* | sort -h | tail -5`', '`du -sh /var/log/* | sort -h | tail -5`']),
  fc('fc-tp1-10', ['find : modifié il y a moins de 7 jours ?', 'find : a9al mn 7 iyam ?', 'find: modified less than 7 days ago?'], ['`-mtime -7` (et `+7` = plus de 7 jours).', '`-mtime -7` (`+7` = ktar).', '`-mtime -7` (`+7` = more than 7 days).']),
  fc('fc-tp1-11', ['`tee` ?', '`tee` ?', '`tee`?'], ['Écrit l\'entrée à l\'écran ET dans un fichier (`-a` ajoute).', 'Écran W fichier (`-a` zid).', 'Writes input to screen AND file (`-a` appends).']),
  fc('fc-tp1-12', ['Champs de `ls -l` ?', 'Champs dyal `ls -l` ?', '`ls -l` fields?'], ['type+droits · liens · propriétaire · groupe · taille · date · nom.', 'type+droits · liens · mol · groupe · taille · date · smiya.', 'type+perms · links · owner · group · size · date · name.']),
  fc('fc-tp1-13', ['Exécuter 2 commandes à distance en SSH ?', '2 commandes b SSH ?', 'Run 2 commands remotely via SSH?'], ['`ssh user@IP "uptime; df -h /"` (guillemets obligatoires).', '`ssh user@IP "uptime; df -h /"`.', '`ssh user@IP "uptime; df -h /"` (quotes required).']),
  fc('fc-tp1-14', ['`type` vs `which` ?', '`type` vs `which` ?', '`type` vs `which`?'], ['`type` dit si c\'est une primitive, un alias ou un exécutable ; `which` donne le chemin de l\'exécutable.', '`type` : primitive/alias/exécutable ; `which` : chemin.', '`type` says builtin, alias or executable; `which` gives the executable path.'])
];

export const reference = [
  ref('r-tp1-1', 'pwd · cd [rep] · cd - · cd ~', ['Répertoire courant, changer, précédent, home', 'Répertoire, beddel, li 9bel, home', 'Current dir, change, previous, home']),
  ref('r-tp1-2', 'ls -l -a -d -R -h', ['Lister : long, cachés, le répertoire lui-même, récursif, tailles lisibles', 'Lister : long, mkhbbyin, répertoire, récursif, tailles', 'List: long, hidden, the dir itself, recursive, human sizes'], 'ls -la /etc'),
  ref('r-tp1-3', 'mkdir -p a/b/c', ['Créer avec les parents', 'Dir m3a parents', 'Create with parents']),
  ref('r-tp1-4', 'cp -r -p src dst', ['Copier (récursif, préserver droits et dates)', 'Copier', 'Copy (recursive, preserve perms and dates)']),
  ref('r-tp1-5', 'mv src dst', ['Déplacer / renommer', 'Nqel / beddel smiya', 'Move / rename']),
  ref('r-tp1-6', 'rm -r -f · rmdir', ['Supprimer (récursif, forcer) · répertoire vide', 'Mse7 · répertoire khawi', 'Remove (recursive, force) · empty dir']),
  ref('r-tp1-7', 'touch f · cat f · head/tail -n N · tail -f · less', ['Créer vide · afficher · début/fin · suivre · paginer', 'Dir · werri · bdaya/lekher · tba3 · pager', 'Create · print · head/tail · follow · pager']),
  ref('r-tp1-8', 'tty · whoami · who · w · hostname · uname -r', ['Terminal · moi · sessions · activité · machine · noyau', 'Terminal · ana · sessions · machine · noyau', 'Terminal · me · sessions · activity · host · kernel']),
  ref('r-tp1-9', 'man [1|5|8] cmd · man -k mot · cmd --help · mandb', ['Manuel par section · recherche · aide courte · index', 'Man · recherche · aide · index', 'Manual by section · search · short help · index'], 'man 5 passwd'),
  ref('r-tp1-10', 'type cmd · which cmd · whereis cmd', ['Nature de la commande · chemin · binaire + man', 'Naw3 · chemin · binaire + man', 'Command kind · path · binary + man']),
  ref('r-tp1-11', 'history · !! · !n · Ctrl+R', ['Historique, dernière, n° n, recherche', 'Historique, lekhra, ra9m n, recherche', 'History, last, #n, search']),
  ref('r-tp1-12', 'date · cal · uptime', ['Date, calendrier, durée de fonctionnement et charge', 'Date, calendrier, uptime', 'Date, calendar, uptime and load']),
  ref('r-tp1-13', '> · >> · 2> · &> · 2>/dev/null', ['Écraser, ajouter, erreurs, tout, jeter les erreurs', 'Mse7, zid, erreurs, kolchi, rmi', 'Overwrite, append, errors, both, discard errors']),
  ref('r-tp1-14', 'cmd1 | cmd2', ['Tube : sortie de cmd1 → entrée de cmd2', 'Pipe', 'Pipe: cmd1 output → cmd2 input']),
  ref('r-tp1-15', 'grep [-c -i -v -n] motif f', ['Lignes contenant le motif (compter, casse, inverser, numéros)', 'Lignes fihom motif', 'Matching lines (count, ignore case, invert, numbers)'], 'grep -c bash /etc/passwd'),
  ref('r-tp1-16', 'cut -d: -f1', ['Extraire un champ', 'Champ', 'Extract a field'], 'cut -d: -f1 /etc/passwd'),
  ref('r-tp1-17', 'sort [-n -h -r -t: -k3] · wc -l · uniq', ['Trier · compter les lignes · dédoublonner', 'Tri · 7seb · doublons', 'Sort · count lines · dedupe']),
  ref('r-tp1-18', 'find rep -name "*.x" -type f -mtime -7 -size +10M', ['Rechercher des fichiers', 'Qelleb fichiers', 'Find files'], 'find /etc -name "*.conf"'),
  ref('r-tp1-19', 'du -sh rep/* | sort -h | tail -5', ['Plus gros éléments', 'Kbar', 'Largest items']),
  ref('r-tp1-20', 'cmd | tee [-a] f', ['Écran + fichier', 'Écran + fichier', 'Screen + file']),
  ref('r-tp1-21', 'ssh user@IP ["cmd"]', ['Connexion / exécution à distance', 'Connexion mn b3id', 'Remote login / execution'], 'ssh etudiant@192.168.56.10 "uptime; df -h /"'),
  ref('r-tp1-22', 'firewall-cmd --list-services', ['Services autorisés par le pare-feu', 'Services f pare-feu', 'Services allowed by the firewall']),
  ref('r-tp1-23', 'echo $SSH_CONNECTION', ['IP/port client et serveur de la session SSH', 'IP/port dyal SSH', 'Client/server IP and ports of the SSH session'])
];
