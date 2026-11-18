import { setCtx, L, h, p, code, tip, trap, exam, table, anim, quiz, mission, single, multi, cmd, order, ex, fc, ref } from '../lib';
import type { Chapter } from '../../src/lib/schema';

setCtx('linux', 'users');

export const questions = [
  single('lu-01', 1, ['Quel est l\'UID de root ?', 'UID dyal root ?', 'What is root\'s UID?'], ['0', '1', '1000', '65534'], 0,
    ['root a toujours l\'**UID 0**. Comptes système : UID < 1000 ; utilisateurs ordinaires : UID ≥ 1000 (UID_MIN).', 'root **UID 0**. Système < 1000 ; 3adiyin ≥ 1000.', 'root is always **UID 0**. System accounts < 1000; regular users ≥ 1000.'],
    [['UID 1 = bin (compte système).', '1 = bin.', 'UID 1 = bin.'], ['1000 = premier utilisateur ordinaire.', '1000 = awel user.', '1000 = first regular user.'], ['65534 = nobody.', '65534 = nobody.', '65534 = nobody.']], ['comptes']),
  single('lu-02', 2, ['Combien de champs a une ligne de `/etc/passwd` et lequel est le 6e ?', 'Ch7al champ f `/etc/passwd` w chnou 6 ?', 'How many fields in `/etc/passwd`, and what is the 6th?'],
    [['7 champs ; 6e = répertoire personnel', '7 ; 6 = home', '7 fields; 6th = home directory'], ['7 champs ; 6e = shell', '7 ; 6 = shell', '7; 6th = shell'], ['9 champs ; 6e = date d\'expiration', '9 ; 6 = expiration', '9; 6th = expiry'], ['4 champs ; 6e n\'existe pas', '4', '4 fields']], 0,
    ['`login:x:uid:gid:commentaire:home:shell` → 7 champs, **6e = home**, 7e = shell.', '`login:x:uid:gid:commentaire:home:shell`.', '`login:x:uid:gid:comment:home:shell` → 7 fields, **6th = home**, 7th = shell.'],
    [['Le shell est le 7e.', 'Shell = 7.', 'Shell is 7th.'], ['9 champs = /etc/shadow.', '9 = shadow.', '9 fields = /etc/shadow.'], ['4 champs = /etc/group.', '4 = group.', '4 fields = /etc/group.']], ['passwd']),
  anim0(),
  single('lu-04', 2, ['Dans `/etc/shadow`, que signifie `!!` dans le champ mot de passe ?', '`!!` f shadow ?', 'In `/etc/shadow`, what does `!!` mean?'],
    [['Mot de passe vide', 'Khawi', 'Empty password'], ['Aucun mot de passe n\'a été défini (compte verrouillé)', 'Ma t7at 7ta mot de passe', 'No password set yet (locked)'], ['Mot de passe expiré', 'Expiré', 'Expired password'], ['Compte root', 'Root', 'Root account']], 1,
    ['Après `useradd`, le champ vaut `!!` : impossible de se connecter par mot de passe tant que `passwd` n\'a pas été fait. `passwd -l` ajoute aussi `!!` devant le hachage.', '`!!` mor useradd ; `passwd -l` kayzid `!!`.', 'After `useradd`, the field is `!!`: no password login until `passwd`. `passwd -l` also prefixes `!!`.'],
    [['Vide = champ vraiment vide (`passwd -d`).', 'Khawi = `passwd -d`.', 'Empty = truly empty field (`passwd -d`).'], ['L\'expiration se lit dans les champs 3–8 (chage).', 'Expiration f champs 3–8.', 'Expiry is in fields 3–8.'], ['Rien à voir.', 'Walou.', 'Unrelated.']], ['shadow']),
  multi('lu-05', 3, ['Dans `tp1:$6$abc$X…:20410:0:90:7:2:20818:`, quelles lectures sont justes ?', 'Chnou s7i7 f had ster ?', 'In `tp1:$6$abc$X…:20410:0:90:7:2:20818:`, which readings are right?'],
    [['$6$ = SHA-512', '$6$ = SHA-512', '$6$ = SHA-512'], ['Le mot de passe doit être changé tous les 90 jours', 'Kol 90 yom', 'Password must change every 90 days'], ['7 jours d\'avertissement', '7 iyam tanbih', '7 warning days'], ['Le compte expire dans 2 jours', 'Compte kaysali f 2 iyam', 'The account expires in 2 days'], ['Le compte a une date d\'expiration (jour 20818)', 'Compte 3endo expiration', 'The account has an expiry date (day 20818)']], [0, 1, 2, 4],
    ['Champs : login : hachage ($6$ = SHA-512) : dernier changement : **min 0** : **max 90** : **warn 7** : **inactif 2** (jours après expiration du mot de passe) : **expiration du compte 20818**.', 'min 0, max 90, warn 7, inactif 2, expire 20818.', 'Fields: login : hash ($6$ = SHA-512) : last : **min 0** : **max 90** : **warn 7** : **inactive 2** : **account expiry 20818**.'],
    [['Faux : 2 = jours d\'inactivité tolérés **après** expiration du mot de passe, pas l\'expiration du compte.', 'Ghalat : 2 = inactif.', 'Wrong: 2 = inactive days **after** password expiry.']], ['shadow']),
  single('lu-06', 2, ['Quelle commande affiche les valeurs par défaut utilisées par `useradd` ?', 'Ach men commande katwerri défauts dyal useradd ?', 'Which command shows `useradd` defaults?'],
    [['useradd -D', 'useradd -D', 'useradd -D'], ['useradd --list', 'useradd --list', 'useradd --list'], ['cat /etc/login.defs', 'cat /etc/login.defs', 'cat /etc/login.defs'], ['usermod -D', 'usermod -D', 'usermod -D']], 0,
    ['`useradd -D` lit `/etc/default/useradd` (GROUP, HOME, INACTIVE, EXPIRE, SHELL, SKEL, CREATE_MAIL_SPOOL). `useradd -D -s /bin/zsh` modifie un défaut.', '`useradd -D` = /etc/default/useradd.', '`useradd -D` reads `/etc/default/useradd`; `useradd -D -s …` changes a default.'],
    [['N\'existe pas.', 'Ma kaynach.', 'Does not exist.'], ['login.defs contient d\'autres réglages (UID_MIN, PASS_MAX_DAYS…).', 'login.defs haja khra.', 'login.defs holds other settings.'], ['usermod n\'a pas -D.', 'Ma kaynch.', 'usermod has no -D.']], ['defauts']),
  single('lu-07', 3, ['Où se règle la durée de validité **par défaut** des mots de passe des nouveaux comptes ?', 'Fin validité par défaut dyal mots de passe ?', 'Where is the **default** password validity for new accounts set?'],
    [['/etc/default/useradd (EXPIRE)', '/etc/default/useradd', '/etc/default/useradd (EXPIRE)'], ['/etc/login.defs (PASS_MAX_DAYS)', '/etc/login.defs (PASS_MAX_DAYS)', '/etc/login.defs (PASS_MAX_DAYS)'], ['/etc/shadow', '/etc/shadow', '/etc/shadow'], ['/etc/skel/.bashrc', '/etc/skel', '/etc/skel/.bashrc']], 1,
    ['`/etc/login.defs` : PASS_MAX_DAYS, PASS_MIN_DAYS, PASS_MIN_LEN, PASS_WARN_AGE, UID_MIN/MAX, SYS_UID_MIN/MAX, CREATE_HOME, ENCRYPT_METHOD. `EXPIRE` (default/useradd) = date d\'expiration du **compte**.', 'login.defs = PASS_* ; EXPIRE = compte.', '`/etc/login.defs`: PASS_MAX_DAYS… `EXPIRE` (default/useradd) = **account** expiry date.'],
    [['EXPIRE fixe une date d\'expiration du compte, pas la durée du mot de passe.', 'EXPIRE = compte.', 'EXPIRE sets account expiry.'], ['shadow contient les valeurs de chaque compte existant.', 'shadow = kol compte.', 'shadow holds each existing account\'s values.'], ['skel = fichiers copiés dans le home.', 'skel = fichiers.', 'skel = files copied to homes.']], ['defauts']),
  cmd('lu-08', 1, ['Crée l\'utilisateur `tp` avec son répertoire personnel.', 'Dir user `tp` m3a home.', 'Create user `tp` with a home directory.'],
    ['useradd -m tp', 'useradd tp'], ['`-m` force la création du home (copie de /etc/skel). Sur RHEL, `CREATE_HOME yes` dans login.defs le fait déjà par défaut.', '`-m` (RHEL kaydirha par défaut).', '`-m` creates the home (copy of /etc/skel); RHEL does it by default (`CREATE_HOME yes`).'], { 'useradd -M tp': ['`-M` = **ne pas** créer le home.', '`-M` = bla home.', '`-M` = do **not** create home.'] }, ['useradd']),
  cmd('lu-09', 2, ['Crée un **compte système** `tpsys` (UID < 1000, sans répertoire personnel).', 'Dir **compte système** `tpsys`.', 'Create a **system account** `tpsys`.'],
    ['useradd -r tpsys'], ['`-r` : UID pris entre SYS_UID_MIN et SYS_UID_MAX (201–999), pas de home par défaut.', '`-r` : UID 201–999.', '`-r`: UID in 201–999, no home by default.'], { 'useradd -s /sbin/nologin tpsys': ['Change le shell mais crée un compte **ordinaire** (UID ≥ 1000).', 'Compte 3adi.', 'Creates a **regular** account.'] }, ['useradd']),
  cmd('lu-10', 3, ['Crée `tp1` avec l\'UID **2003**, groupe principal **users**, expirant le **31/12/2026**.', 'Dir `tp1` UID 2003, groupe users, expire 31/12/2026.', 'Create `tp1` with UID **2003**, primary group **users**, expiring **2026-12-31**.'],
    ['useradd -u 2003 -g users -e 2026-12-31 tp1', 'useradd -m -u 2003 -g users -e 2026-12-31 tp1'], ['`-u` UID, `-g` groupe **primaire**, `-e AAAA-MM-JJ` date d\'expiration du **compte** (champ 8 de shadow).', '`-u`, `-g` primaire, `-e` date.', '`-u` UID, `-g` **primary** group, `-e YYYY-MM-DD` account expiry.'],
    { 'useradd -u 2003 -G users -e 2026-12-31 tp1': ['`-G` = groupes **secondaires** ; le primaire serait un nouveau groupe tp1.', '`-G` = secondaires.', '`-G` = **secondary** groups.'] }, ['useradd']),
  single('lu-11', 2, ['Après `useradd -m tmpuser`, d\'où viennent `.bashrc` et `bienvenue.txt` dans `/home/tmpuser` ?', 'Mnin jaw `.bashrc` w `bienvenue.txt` ?', 'Where do `.bashrc` and `bienvenue.txt` in `/home/tmpuser` come from?'],
    [['De /root', 'Mn /root', 'From /root'], ['Copiés depuis /etc/skel', 'Mn /etc/skel', 'Copied from /etc/skel'], ['Créés par bash au 1er login', 'bash', 'Created by bash at first login'], ['De /etc/default/useradd', 'default/useradd', 'From /etc/default/useradd']], 1,
    ['`/etc/skel` (variable SKEL) est le **modèle** copié dans chaque nouveau home ; le contenu appartient au nouvel utilisateur.', '`/etc/skel` = modèle.', '`/etc/skel` is the **template** copied into each new home.'],
    [['root n\'est pas un modèle.', 'Machi root.', 'root is no template.'], ['Ils existent dès la création.', 'Kaynin mn lowel.', 'They exist from creation.'], ['Ce fichier indique seulement où est le skel.', 'Ghir chemin.', 'It only points to skel.']], ['skel']),
  cmd('lu-12', 2, ['Supprime `tmpuser` **avec** son répertoire personnel et sa boîte mail.', 'Mse7 `tmpuser` **m3a** home.', 'Delete `tmpuser` **with** home and mail spool.'],
    ['userdel -r tmpuser'], ['`-r` supprime home et `/var/spool/mail/tmpuser`. Les fichiers ailleurs restent : `find / -uid UID`.', '`-r` + find -uid.', '`-r` removes home and mail. Files elsewhere remain: `find / -uid UID`.'], { 'userdel tmpuser': ['Le home reste (fichiers orphelins).', 'Home kayb9a.', 'The home stays.'] }, ['userdel']),
  cmd('lu-13', 3, ['Ajoute `tp` au groupe `IIR` **sans** lui retirer ses autres groupes secondaires.', 'Zid `tp` l `IIR` **bla** ma t7eyed groupes khrin.', 'Add `tp` to `IIR` **without** removing other secondary groups.'],
    ['usermod -aG IIR tp', 'usermod -a -G IIR tp', 'gpasswd -a tp IIR'], ['`-a` (*append*) + `-G` ajoute. **`-G` seul remplace** tous les groupes secondaires ! `gpasswd -a tp IIR` est équivalent.', '`-aG` ; `-G` bou7do kaymse7.', '`-a` + `-G` appends. **`-G` alone replaces** all secondary groups! `gpasswd -a tp IIR` too.'],
    { 'usermod -G IIR tp': ['Piège : `tp` perd tous ses autres groupes secondaires.', 'Fekh : kaymse7 groupes.', 'Trap: tp loses other secondary groups.'], 'usermod -g IIR tp': ['`-g` change le groupe **primaire**.', '`-g` primaire.', '`-g` changes the **primary** group.'] }, ['usermod', 'groupes']),
  single('lu-14', 3, ['`tp` est dans `dev` et `docker`. On tape `usermod -G IIR tp`. Résultat ?', '`tp` f dev w docker ; `usermod -G IIR tp` ?', '`tp` is in `dev` and `docker`. `usermod -G IIR tp` gives?'],
    [['tp est dans dev, docker et IIR', 'dev, docker, IIR', 'dev, docker and IIR'], ['tp est seulement dans IIR (secondaire)', 'Ghir IIR', 'Only IIR (secondary)'], ['Erreur', 'Erreur', 'Error'], ['IIR devient son groupe primaire', 'IIR primaire', 'IIR becomes primary']], 1,
    ['Sans `-a`, `-G` **remplace** la liste des groupes secondaires. Le primaire ne change pas.', 'Bla `-a`, `-G` kaybeddel liste.', 'Without `-a`, `-G` **replaces** the secondary list. Primary unchanged.'],
    [['Il faudrait -a.', 'Khass -a.', 'Needs -a.'], ['Commande valide.', 'Valide.', 'Valid.'], ['Ce serait -g.', '-g.', 'That would be -g.']], ['usermod', 'groupes']),
  cmd('lu-15', 2, ['Renomme le login `tp2` en `tp3`.', 'Beddel `tp2` l `tp3`.', 'Rename login `tp2` to `tp3`.'],
    ['usermod -l tp3 tp2'], ['`usermod -l NOUVEAU ANCIEN`. Le home et le groupe privé gardent leur nom (`-d … -m`, `groupmod -n`).', '`-l NOUVEAU ANCIEN`.', '`usermod -l NEW OLD`. Home and group keep old names.'], { 'usermod -l tp2 tp3': ['Ordre inversé : NOUVEAU puis ANCIEN.', 'L3eks.', 'Reversed: NEW then OLD.'] }, ['usermod']),
  cmd('lu-16', 3, ['Déplace le répertoire personnel de `tp3` vers `/home/tp3` **en déplaçant son contenu**.', 'Nqel home dyal `tp3` l `/home/tp3` **m3a contenu**.', 'Move `tp3`\'s home to `/home/tp3` **moving its content**.'],
    ['usermod -d /home/tp3 -m tp3', 'usermod -m -d /home/tp3 tp3'], ['`-d` change le chemin, `-m` déplace le contenu (n\'a de sens qu\'avec `-d`).', '`-d` + `-m`.', '`-d` changes the path, `-m` moves the content.'], { 'usermod -d /home/tp3 tp3': ['Sans `-m`, le contenu reste dans l\'ancien répertoire.', 'Bla `-m`.', 'Without `-m` content stays behind.'] }, ['usermod']),
  multi('lu-17', 2, ['Quelles commandes **verrouillent** le mot de passe de `tp1` ?', 'Chnou kaysedd mot de passe ?', 'Which commands **lock** tp1\'s password?'],
    ['passwd -l tp1', 'usermod -L tp1', 'passwd -u tp1', 'passwd -d tp1'], [0, 1],
    ['`passwd -l` (`!!`) et `usermod -L` (`!`) préfixent le hachage. Déverrouiller : `passwd -u` / `usermod -U`.', '-l / -L ; -u / -U.', '`passwd -l` and `usermod -L` prefix the hash. Unlock: `passwd -u` / `usermod -U`.'],
    [['`-u` déverrouille.', '`-u` kayfte7.', '`-u` unlocks.'], ['`-d` supprime le mot de passe : connexion **sans** mot de passe possible — l\'inverse !', '`-d` mse7.', '`-d` deletes the password — the opposite!']], ['passwd']),
  cmd('lu-18', 2, ['Affiche l\'état du mot de passe de `tp1` (PS, LK ou NP).', 'Werri l7ala dyal mot de passe tp1.', 'Show tp1\'s password status (PS, LK, NP).'],
    ['passwd -S tp1', 'passwd --status tp1'], ['`passwd -S` : **PS** défini, **LK** verrouillé, **NP** aucun ; + dates et durées.', 'PS / LK / NP.', 'PS set, LK locked, NP none.'], {}, ['passwd']),
  cmd('lu-19', 3, ['Force `tp1` à changer son mot de passe à la prochaine connexion **et** désactive son compte **2 jours** après l\'expiration du mot de passe.', '`tp1` ybeddel f connexion jaya w inactif 2 iyam.', 'Force tp1 to change at next login **and** disable the account **2 days** after password expiry.'],
    ['chage -d 0 -I 2 tp1', 'chage -I 2 -d 0 tp1'], ['`-d 0` met le dernier changement au 01/01/1970 → expiré ; `-I 2` = 2 jours d\'inactivité tolérés.', '`-d 0` + `-I 2`.', '`-d 0` → expired; `-I 2` = 2 inactive days.'], { 'chage -E 0 -I 2 tp1': ['`-E 0` fait expirer le **compte**.', '`-E 0` = compte.', '`-E 0` expires the **account**.'] }, ['chage']),
  cmd('lu-20', 2, ['Mot de passe d\'`alice` : valable 90 jours max, avertissement 7 jours avant.', 'alice : 90 yom, tanbih 7.', 'alice: max 90 days, warn 7 days before.'],
    ['chage -M 90 -W 7 alice', 'passwd -x 90 -w 7 alice'], ['`chage -M` max, `-W` warn (équivalents `passwd -x`, `-w`).', '`-M` + `-W`.', '`-M` max, `-W` warn.'], { 'chage -m 90 -W 7 alice': ['`-m` = **minimum** entre deux changements.', '`-m` = minimum.', '`-m` = **minimum**.'] }, ['chage']),
  single('lu-21', 2, ['`chage -l tp1` affiche « Fin de validité du compte : déc. 31, 2026 ». Quelle option l\'a fixée ?', 'Ach men option ?', 'Which option set it?'],
    [['chage -M', 'chage -M', 'chage -M'], ['chage -E (ou useradd/usermod -e)', 'chage -E', 'chage -E (or -e)'], ['chage -W', 'chage -W', 'chage -W'], ['chage -I', 'chage -I', 'chage -I']], 1,
    ['`-E` = expiration du **compte** (champ 8). `-E -1` = jamais.', '`-E` = compte.', '`-E` = **account** expiry. `-E -1` = never.'],
    [['-M concerne le mot de passe.', '-M = mot de passe.', '-M is about the password.'], ['-W = avertissement.', '-W.', '-W = warning.'], ['-I = inactivité.', '-I.', '-I = inactivity.']], ['chage']),
  cmd('lu-22', 1, ['Crée le groupe `IIR` avec le GID 5000.', 'Dir groupe `IIR` GID 5000.', 'Create group `IIR` with GID 5000.'], ['groupadd -g 5000 IIR'], ['`-g` GID ; `-r` système ; `-f` pas d\'erreur si existe.', '`-g`.', '`-g` GID; `-r` system; `-f` no error if exists.'], {}, ['groupes']),
  cmd('lu-23', 2, ['Renomme le groupe `IIR` en `4IIR`.', 'Beddel `IIR` l `4IIR`.', 'Rename group `IIR` to `4IIR`.'], ['groupmod -n 4IIR IIR'], ['`groupmod -n NOUVEAU ANCIEN` ; `-g` change le GID.', '`-n NOUVEAU ANCIEN`.', '`groupmod -n NEW OLD`.'], { 'groupmod -n IIR 4IIR': ['Ordre inversé.', 'L3eks.', 'Reversed.'] }, ['groupes']),
  single('lu-24', 3, ['Pourquoi `groupdel tp` échoue-t-il juste après `useradd tp` ?', '3lach `groupdel tp` kayfchel ?', 'Why does `groupdel tp` fail right after `useradd tp`?'],
    [['Le groupe n\'existe pas', 'Ma kaynch', 'Group missing'], ['C\'est le groupe primaire de l\'utilisateur tp', 'Primaire dyal tp', 'It is tp\'s primary group'], ['Il faut -f', 'Khass -f', 'Needs -f'], ['Seul useradd peut le supprimer', 'Ghir useradd', 'Only useradd can']], 1,
    ['On ne supprime pas le groupe **primaire** d\'un utilisateur existant. `userdel tp` le supprime.', 'Primaire ma ytmse7ch.', 'You cannot delete an existing user\'s **primary** group.'],
    [['Il existe (groupe privé créé par useradd).', 'Kayn.', 'It exists.'], ['groupdel n\'a pas -f.', 'Ma kaynch -f.', 'No -f.'], ['C\'est userdel.', 'userdel.', 'That is userdel.']], ['groupes']),
  multi('lu-25', 3, ['Pour le groupe `developpeurs`, quelles commandes `gpasswd` sont correctes ?', 'gpasswd s7a7 ?', 'Which `gpasswd` commands are correct?'],
    [['gpasswd -a user1 developpeurs (ajoute)', 'gpasswd -a user1 developpeurs', 'gpasswd -a user1 developpeurs (add)'], ['gpasswd -d user1 developpeurs (retire)', 'gpasswd -d user1 developpeurs', 'gpasswd -d user1 developpeurs (remove)'], ['gpasswd -M user1,user2 developpeurs (définit les membres)', 'gpasswd -M', 'gpasswd -M (set members)'], ['gpasswd -A admin1 developpeurs (définit les administrateurs)', 'gpasswd -A', 'gpasswd -A (set admins)'], ['gpasswd -G user1 developpeurs', 'gpasswd -G', 'gpasswd -G user1 developpeurs']], [0, 1, 2, 3],
    ['`-a` ajoute, `-d` retire, `-M` membres (liste), `-A` administrateurs (gshadow, champ 3).', '-a -d -M -A.', '`-a` add, `-d` delete, `-M` members, `-A` admins.'],
    [['`-G` n\'existe pas pour gpasswd (c\'est usermod).', 'Ma kaynch.', 'No `-G` for gpasswd.']], ['gpasswd']),
  cmd('lu-26', 1, ['Affiche **les noms** de tous les groupes de `tp`.', 'Werri **smiyat** groupes dyal `tp`.', 'Print the **names** of all of tp\'s groups.'], ['id -Gn tp', 'groups tp'], ['`id -Gn` (-G tous, -n noms) ; `groups tp` équivalent. `id -u` UID, `id -g` GID.', '`id -Gn` / `groups`.', '`id -Gn` or `groups tp`.'], { 'id -G tp': ['Donne les **numéros**.', 'Ar9am.', 'Gives **numbers**.'] }, ['identite']),
  single('lu-27', 2, ['Que vaut `rwxrw-r--` en octal ?', '`rwxrw-r--` octal ?', '`rwxrw-r--` in octal?'], ['764', '754', '746', '664'], 0,
    ['rwx = 4+2+1 = **7**, rw- = 4+2 = **6**, r-- = **4** → **764**.', '7, 6, 4 → 764.', '7, 6, 4 → 764.'],
    [['754 = rwxr-xr--.', '754.', '754 = rwxr-xr--.'], ['746 = rwxr--rw-.', '746.', '746.'], ['664 = rw-rw-r--.', '664.', '664.']], ['chmod', 'droits']),
  cmd('lu-28', 2, ['Donne à `/opt/donnees` les droits rwxr-xr-x.', 'rwxr-xr-x l `/opt/donnees`.', 'Set rwxr-xr-x on `/opt/donnees`.'], ['chmod 755 /opt/donnees', 'chmod u=rwx,g=rx,o=rx /opt/donnees', 'chmod u=rwx,go=rx /opt/donnees'], ['755 = rwx r-x r-x.', '755.', '755.'], { 'chmod 777 /opt/donnees': ['777 donne l\'écriture à tous : déconseillé.', '777 khatar.', '777: everyone writes.'] }, ['chmod', 'droits']),
  cmd('lu-29', 2, ['Retire le droit d\'écriture au groupe et tous les droits aux autres sur `rapport.txt`, en symbolique.', 'Symbolique : g-w, o=.', 'Symbolic: remove group write and all others\' rights.'], ['chmod g-w,o= rapport.txt', 'chmod o=,g-w rapport.txt', 'chmod g-w,o-rwx rapport.txt'], ['`g-w` retire w au groupe ; `o=` met « rien » aux autres.', '`g-w`, `o=`.', '`g-w` removes group write; `o=` sets none.'], {}, ['chmod', 'droits']),
  single('lu-30', 3, ['Répertoire `d` en `711`, fichier `d/f` en `644`. Un autre utilisateur peut-il faire `ls d` ? `cat d/f` ?', '`711` w `644` : ls ? cat ?', 'Dir `711`, file `644`. Can another user `ls d`? `cat d/f`?'],
    [['ls oui, cat oui', 'ls ah, cat ah', 'ls yes, cat yes'], ['ls non, cat oui', 'ls la, cat ah', 'ls no, cat yes'], ['ls oui, cat non', 'ls ah, cat la', 'ls yes, cat no'], ['ls non, cat non', 'ls la, cat la', 'ls no, cat no']], 1,
    ['Autres = `--x` : pas de **r** → pas de `ls`, mais **x** → on traverse, et `f` est lisible (r) → `cat` marche si on connaît le nom.', 'x bla r : ma tlistich walakin tdkhol.', 'Others `--x`: no r → no `ls`; x → can traverse; `f` readable → `cat` works.'],
    [['Lister demande r.', 'ls khasso r.', 'Listing needs r.'], ['C\'est l\'inverse.', 'L3eks.', 'Opposite.'], ['x suffit pour accéder.', 'x kafi.', 'x suffices.']], ['droits']),
  cmd('lu-31', 2, ['Fais de `tp` le propriétaire et de `IIR` le groupe de `/opt/donnees` **et de tout son contenu**.', '`tp:IIR` récursif.', 'Make `tp:IIR` own `/opt/donnees` **recursively**.'], ['chown -R tp:IIR /opt/donnees', 'chown -R tp.IIR /opt/donnees'], ['`chown user:groupe` ; `-R` récursif. `chown :IIR` ou `chgrp IIR` pour le groupe seul.', '`-R tp:IIR`.', '`chown -R user:group`.'], { 'chown tp:IIR /opt/donnees': ['Sans `-R`, seul le répertoire change.', 'Bla -R.', 'Without `-R` only the directory.'] }, ['chown', 'droits']),
  single('lu-32', 2, ['Un utilisateur ordinaire peut-il `chown` un de ses fichiers à un autre ?', 'User 3adi y9der chown ?', 'Can a regular user chown a file to someone else?'],
    [['Oui s\'il en est propriétaire', 'Ah', 'Yes if owner'], ['Non, réservé à root', 'La, ghir root', 'No, root only'], ['Oui avec chmod 777', 'Ah b 777', 'Yes with 777'], ['Oui avec -R', 'Ah b -R', 'Yes with -R']], 1,
    ['« Opération non permise » : donner un fichier est réservé à **root** (évite les abus de quotas). Le propriétaire peut `chgrp` vers un groupe dont il est membre.', 'Ghir root ; chgrp momkin.', 'Only **root** can give files away; owner can chgrp to own groups.'],
    [['Le propriétaire ne peut pas « donner ».', 'Ma y9derch.', 'Owners cannot give away.'], ['Les droits ne changent pas la propriété.', 'Machi droits.', 'Perms do not affect ownership.'], ['-R ne change rien.', '-R walou.', '-R changes nothing.']], ['chown']),
  single('lu-33', 2, ['Pourquoi éditer `/etc/sudoers` avec `visudo` ?', '3lach `visudo` ?', 'Why edit sudoers with `visudo`?'],
    [['Seul éditeur pour root', 'Ghir hwa', 'Only editor for root'], ['Il verrouille le fichier et vérifie la syntaxe avant d\'enregistrer', 'Kaysedd w kaytsdi9 syntaxe', 'Locks the file and checks syntax before saving'], ['Il chiffre le fichier', 'Kaychiffri', 'Encrypts it'], ['Il redémarre sudo', 'Redémarrer', 'Restarts sudo']], 1,
    ['Une erreur dans sudoers peut **bloquer sudo**. `visudo` refuse d\'enregistrer un fichier invalide ; `visudo -c` vérifie ; `visudo -f /etc/sudoers.d/x` pour un fichier inclus.', 'visudo kaymna3 akhta2.', 'A sudoers error can **break sudo**. `visudo` refuses invalid files; `-c` checks; `-f` for includes.'],
    [['N\'importe quel éditeur marcherait, sans protection.', 'Bla protection.', 'Any editor works, unprotected.'], ['Pas de chiffrement.', 'Walou.', 'No encryption.'], ['sudo n\'est pas un service.', 'Machi service.', 'sudo is no service.']], ['sudo']),
  single('lu-34', 3, ['Que permet `%developers ALL=(ALL) /usr/bin/systemctl, /usr/bin/journalctl` ?', 'Chnou kaysma7 ?', 'What does this rule allow?'],
    [['L\'utilisateur developers peut tout faire', 'User developers kolchi', 'User developers can do anything'], ['Les membres du groupe developers peuvent lancer systemctl et journalctl en tant que n\'importe quel utilisateur', 'Membres dyal groupe : systemctl w journalctl', 'Members of group developers may run systemctl and journalctl as any user'], ['developers peut éditer sudoers', 'Sudoers', 'developers can edit sudoers'], ['Sans mot de passe', 'Bla mot de passe', 'Without password']], 1,
    ['`%` = **groupe** ; `ALL` = hôte ; `(ALL)` = utilisateurs cibles ; puis la liste des commandes (chemins absolus). `NOPASSWD:` serait nécessaire pour éviter le mot de passe.', '`%` = groupe ; `(ALL)` cibles.', '`%` = **group**; `ALL` host; `(ALL)` targets; commands. `NOPASSWD:` would skip password.'],
    [['`%` désigne un groupe.', '`%` groupe.', '`%` means group.'], ['Seules ces deux commandes.', 'Ghir jouj.', 'Only those two.'], ['Il manque NOPASSWD:.', 'Na9es NOPASSWD.', 'NOPASSWD: is missing.']], ['sudo']),
  cmd('lu-35', 3, ['Ligne sudoers : `tp1` peut lancer **uniquement** `/usr/sbin/reboot` en tant que root.', 'tp1 ghir reboot b root.', 'sudoers line: tp1 may run **only** `/usr/sbin/reboot` as root.'],
    ['tp1 ALL=(root) /usr/sbin/reboot', 'tp1 ALL=(ALL) /usr/sbin/reboot'], ['Format `utilisateur hôte=(cible) commandes`, chemin absolu.', '`user hôte=(cible) cmd`.', 'Format `user host=(target) commands`, absolute path.'], { 'tp1 ALL=(root) reboot': ['Chemin absolu obligatoire.', 'Chemin absolu.', 'Absolute path required.'], 'tp1 ALL=(ALL) ALL': ['Donne **toutes** les commandes.', 'Kolchi.', 'Gives **all** commands.'] }, ['sudo']),
  cmd('lu-36', 2, ['Donne à `tp1` tous les droits sudo par le groupe standard de RHEL.', 'Kol droits sudo l tp1 b groupe RHEL.', 'Give tp1 full sudo via RHEL\'s standard group.'], ['usermod -aG wheel tp1', 'gpasswd -a tp1 wheel'], ['`%wheel ALL=(ALL) ALL` est déjà dans sudoers. Retirer : `gpasswd -d tp1 wheel`.', 'wheel ; gpasswd -d.', '`%wheel ALL=(ALL) ALL` is preset. Remove: `gpasswd -d tp1 wheel`.'], { 'usermod -G wheel tp1': ['Écrase les autres groupes.', 'Kaymse7.', 'Overwrites other groups.'] }, ['sudo']),
  order('lu-37', 2, ['Ordre logique de la création d\'un espace de travail partagé.', 'Tartib espace partagé.', 'Order: setting up a shared workspace.'],
    [['groupadd IIR', 'groupadd IIR', 'groupadd IIR'], ['usermod -aG IIR tp', 'usermod -aG IIR tp', 'usermod -aG IIR tp'], ['mkdir /opt/donnees', 'mkdir /opt/donnees', 'mkdir /opt/donnees'], ['chown tp:IIR /opt/donnees', 'chown tp:IIR', 'chown tp:IIR /opt/donnees'], ['chmod 775 /opt/donnees', 'chmod 775', 'chmod 775 /opt/donnees'], ['ls -ld /opt/donnees', 'ls -ld', 'ls -ld /opt/donnees']],
    ['Groupe → membres → répertoire → propriété → droits → vérification.', 'Groupe → membres → dossier → chown → chmod → ls.', 'Group → members → directory → ownership → mode → check.'], ['droits', 'groupes'])
];

function anim0() {
  return single('lu-03', 1, ['Qui peut lire `/etc/shadow` ?', 'Chkoun y9ra shadow ?', 'Who can read `/etc/shadow`?'],
    [['Tout le monde', 'Ga3', 'Everyone'], ['Seulement root', 'Ghir root', 'Only root'], ['Les membres de wheel', 'wheel', 'wheel members'], ['Le propriétaire de chaque ligne', 'Mol ster', 'Each line\'s owner']], 1,
    ['`/etc/shadow` (hachages) est **lisible par root seul** ; `/etc/passwd` est lisible par tous (traduction UID ↔ nom).', 'shadow ghir root ; passwd ga3.', 'shadow: **root only**; passwd: everyone.'],
    [['C\'est /etc/passwd.', 'passwd.', 'That is /etc/passwd.'], ['wheel donne sudo, pas la lecture directe.', 'wheel = sudo.', 'wheel gives sudo.'], ['Un fichier n\'a pas de droits par ligne.', 'Ma kaynch.', 'No per-line rights.']], ['shadow']);
}

export const chapter: Chapter = {
  id: 'users',
  module: 'linux',
  order: 6,
  title: L(['Chap 4 + TP5 — Utilisateurs, groupes et droits', 'Fasl 4 + TP5 — Users, groupes w droits', 'Ch. 4 + TP5 — Users, groups and permissions']),
  summary: L(['Le chapitre le plus important : comptes, fichiers passwd/shadow/group/gshadow, useradd/usermod/userdel, mots de passe et expiration (passwd, chage), groupes, droits (chmod, chown) et sudo.', 'Ahamm fasl : comptes, fichiers, useradd/usermod, passwd/chage, groupes, chmod/chown, sudo.', 'The key chapter: accounts, passwd/shadow/group/gshadow, useradd/usermod/userdel, passwords and aging, groups, permissions, sudo.']),
  estimatedMinutes: 90,
  sections: [
    h(['Types de comptes et groupes', 'Anwa3 comptes w groupes', 'Account types and groups']),
    table([['Type', 'Naw3', 'Type'], ['UID', 'UID', 'UID'], ['Exemple', 'Mithal', 'Example']], [
      [['Super-utilisateur', 'Super-user', 'Superuser'], '0', 'root'], [['Comptes système (services)', 'Comptes système', 'System accounts'], '1–999', 'bin, sshd, chrony'], [['Utilisateurs ordinaires', 'Users 3adiyin', 'Regular users'], '≥ 1000', 'etudiant, tp']
    ]),
    p(['Un **groupe** a un nom, un **GID**, des membres, éventuellement un mot de passe et des administrateurs (rares). Chaque utilisateur a **un groupe primaire** (champ 4 de passwd, propriétaire de groupe des fichiers qu\'il crée) et des **groupes secondaires** (`/etc/group`).', 'Groupe : smiya, **GID**, membres. **Primaire** (champ 4) + **secondaires**.', 'A **group** has a name, **GID**, members, optional password and admins. Each user has **one primary group** (passwd field 4) and **secondary groups**.']),
    quiz('lu-01'),
    h(['Les quatre fichiers', '4 fichiers', 'The four files']),
    table([['Fichier', 'Fichier', 'File'], ['Format', 'Format', 'Format'], ['Droits', 'Droits', 'Mode']], [
      ['/etc/passwd', 'login:x:uid:gid:commentaire:home:shell', ['lecture pour tous', 'ga3', 'world-readable']],
      ['/etc/shadow', 'login:mdp:last:min:max:warn:inactif:expire:', ['root seul', 'ghir root', 'root only']],
      ['/etc/group', 'groupe:x:gid:membres', ['lecture pour tous', 'ga3', 'world-readable']],
      ['/etc/gshadow', 'groupe:mdp:admins:membres', ['root seul', 'ghir root', 'root only']]
    ]),
    anim('PasswdLineExplorer'),
    p(['Exemple gshadow : `developpeurs:$6$…:admin1,admin2:user1,user2,user3` ($6$ = SHA-512). Pour éditer ces fichiers à la main, utiliser **`vipw`** et **`vigr`** (verrouillage, `-s` pour shadow/gshadow).', 'Mithal gshadow. `vipw` / `vigr`.', 'gshadow example. Edit by hand only with **`vipw`** / **`vigr`** (locking; `-s` for shadow/gshadow).']),
    trap(['`!!` dans shadow = aucun mot de passe défini (ou `passwd -l`). Champ **vide** = pas de mot de passe du tout (`passwd -d`) : dangereux.', '`!!` ≠ khawi.', '`!!` = no password set; **empty** = no password at all (dangerous).']),
    quiz('lu-02', 'lu-03', 'lu-04', 'lu-05'),
    h(['Valeurs par défaut', 'Défauts', 'Defaults']),
    code(`useradd -D                  # /etc/default/useradd
GROUP=100  HOME=/home  INACTIVE=-1  EXPIRE=  SHELL=/bin/bash  SKEL=/etc/skel  CREATE_MAIL_SPOOL=yes
useradd -D -s /bin/sh       # changer un défaut
grep -E "^(UID|SYS_UID|PASS|CREATE_HOME|ENCRYPT)" /etc/login.defs
ls -a /etc/skel             # modèle du répertoire personnel`),
    quiz('lu-06', 'lu-07'),
    h(['Créer, modifier, supprimer un utilisateur', 'useradd, usermod, userdel', 'Create, modify, delete a user']),
    table([['Option', 'Option', 'Option'], ['useradd', 'useradd', 'useradd'], ['usermod', 'usermod', 'usermod']], [
      ['-u UID', ['UID', 'UID', 'UID'], ['changer l\'UID', 'beddel UID', 'change UID']], ['-g G', ['groupe primaire', 'primaire', 'primary group'], ['changer le primaire', 'beddel primaire', 'change primary']], ['-G G1,G2', ['groupes secondaires', 'secondaires', 'secondary groups'], ['⚠ REMPLACE (avec -a : ajoute)', '⚠ kaybeddel (b -a kayzid)', '⚠ REPLACES (with -a: appends)']], ['-d REP', ['home', 'home', 'home'], ['nouveau home (+ -m déplace)', 'home jdid (+ -m)', 'new home (+ -m moves)']], ['-m / -M', ['créer / ne pas créer le home', 'dir / bla home', 'create / no home'], ['—', '—', '—']], ['-s SHELL · -c TEXTE', ['shell · commentaire', 'shell · commentaire', 'shell · comment'], ['idem', 'idem', 'same']], ['-e AAAA-MM-JJ', ['expiration du compte', 'expiration', 'account expiry'], ['idem', 'idem', 'same']], ['-r · -D', ['compte système · défauts', 'système · défauts', 'system · defaults'], ['—', '—', '—']], ['-l · -L · -U', ['—', '—', '—'], ['renommer · verrouiller · déverrouiller', 'smiya · sedd · fte7', 'rename · lock · unlock']]
    ]),
    code(`useradd tp ; passwd tp
useradd -r tpsys                        # compte système
useradd -u 2003 -g users -e 2026-12-31 -c "Utilisateur TP1" tp1
usermod -aG IIR tp                      # AJOUTER un groupe secondaire
usermod -l tp3 tp2 ; usermod -d /home/tp3 -m tp3
userdel tp ; userdel -r tp ; userdel -rf tp
find / -type f -uid 1002 -print -exec rm {} \\;   # fichiers orphelins`),
    exam(['**Piège n°1 du contrôle** : `usermod -G IIR tp` sans `-a` **retire** tous les autres groupes secondaires de tp.', '**Fekh n°1** : `-G` bla `-a`.', '**Exam trap #1**: `usermod -G IIR tp` without `-a` **removes** all other secondary groups.']),
    mission('m-tp5-tp'),
    mission('m-tp5-skel'),
    quiz('lu-08', 'lu-10', 'lu-13', 'lu-14'),
    h(['Mots de passe et expiration', 'Mots de passe w expiration', 'Passwords and aging']),
    code(`passwd tp1              # définir (root : sans l'ancien)
passwd -l tp1 ; passwd -u tp1     # verrouiller / déverrouiller
passwd -d tp1           # supprimer le mot de passe (!)
passwd -e tp1           # expirer : changement forcé
passwd -S tp1           # état : PS / LK / NP
passwd -n 1 -x 90 -w 7 -i 3 tp1   # min, max, warn, inactif
chage -l tp1            # afficher
chage -d 0 tp1          # changement obligatoire à la prochaine connexion
chage -M 90 -W 7 alice  # validité 90 j, avertissement 7 j
chage -m 2 -I 2 -E 2026-12-31 tp1  # min, inactivité, expiration du compte (-E -1 = jamais)`),
    tip(['Teste dans le terminal : `chage -d 0 tp1` puis, en tant qu\'`etudiant`, `su - tp1` → on te demande de changer le mot de passe.', '`chage -d 0` w `su - tp1`.', 'Try `chage -d 0 tp1` then, as `etudiant`, `su - tp1` → forced change.']),
    mission('m-tp5-chage'),
    mission('m-tp5-lock'),
    quiz('lu-17', 'lu-19', 'lu-20', 'lu-21'),
    h(['Groupes', 'Groupes', 'Groups']),
    code(`groupadd -g 5000 IIR ; groupadd -r grpsys ; groupadd -f IIR
groupmod -n 4IIR IIR ; groupmod -g 5001 4IIR
groupdel 4IIR                    # impossible si groupe primaire d'un utilisateur
gpasswd -a tp IIR ; gpasswd -d tp IIR
gpasswd -M user1,user2 developpeurs ; gpasswd -A admin1 developpeurs
whoami ; who ; groups tp ; id tp ; id -u ; id -g ; id -Gn tp`),
    mission('m-tp5-iir'),
    quiz('lu-22', 'lu-24', 'lu-25', 'lu-26'),
    h(['Droits d\'accès', 'Droits', 'Permissions']),
    anim('PermissionCalculator'),
    table([['Droit', 'L7a9', 'Right'], ['Fichier', 'Fichier', 'File'], ['Répertoire', 'Répertoire', 'Directory']], [
      ['r (4)', ['lire', '9ra', 'read'], ['lister (ls)', 'lister', 'list']], ['w (2)', ['modifier', 'beddel', 'modify'], ['créer/supprimer des entrées (avec x)', 'dir/mse7 (m3a x)', 'create/delete entries (with x)']], ['x (1)', ['exécuter', 'nfed', 'execute'], ['traverser (cd)', 'dkhol (cd)', 'traverse (cd)']]
    ]),
    code(`chmod u+x,g-w,o= f       # symbolique : u g o a, + - =
chmod 755 rep ; chmod 644 f ; chmod 600 secret   # octal (777 déconseillé)
chmod -R 750 /opt/projet
chown tp f ; chown tp:IIR f ; chown :IIR f ; chown -R tp:IIR rep
chgrp IIR f ; chgrp -R IIR rep
ls -l f ; ls -ld rep`),
    mission('m-tp5-donnees'),
    quiz('lu-27', 'lu-30', 'lu-31', 'lu-32'),
    h(['sudo', 'sudo', 'sudo']),
    p(['`sudo` exécute une commande en tant qu\'un autre utilisateur (root par défaut) en demandant **le mot de passe de l\'appelant**. Règles : `/etc/sudoers` et `/etc/sudoers.d/`, toujours éditées avec **`visudo`** (`visudo -c` vérifie).\n\nFormat : `utilisateur hôte=(cible) commandes`\n\n- `%wheel ALL=(ALL) ALL` : le groupe wheel peut tout faire ;\n- `tp1 ALL=(root) /usr/sbin/reboot` : tp1 peut seulement redémarrer ;\n- `%developers ALL=(ALL) /usr/bin/systemctl, /usr/bin/journalctl` ;\n- `NOPASSWD:` devant les commandes : pas de mot de passe.', '`sudo` b mot de passe dyalek. `visudo`. `user hôte=(cible) cmd`, `%wheel`, `NOPASSWD:`.', '`sudo` runs a command as another user asking **the caller\'s password**. Rules in sudoers, edited with **`visudo`**.\n\nFormat: `user host=(target) commands`; `%wheel ALL=(ALL) ALL`; `tp1 ALL=(root) /usr/sbin/reboot`; `NOPASSWD:`.']),
    code(`usermod -aG wheel tp1        # sudo complet
gpasswd -d tp1 wheel          # le retirer
visudo -f /etc/sudoers.d/tp1  # ajouter : tp1 ALL=(root) /usr/sbin/reboot
visudo -c
su - tp1 ; sudo -l ; sudo reboot`),
    mission('m-tp5-wheel'),
    mission('m-tp5-sudoers'),
    quiz('lu-33', 'lu-34', 'lu-35'),
    h(['TP5 : les 44 questions', 'TP5 : 44 so2al', 'TP5: the 44 questions']),
    p(['Chaque question du TP5 est couverte par une **mission terminal** (validation automatique) ou un **exercice corrigé** :\n\n- Q1–2, Q6–9 → mission « Créer tp » · Q3–5 → exercice « Explorer les fichiers et défauts »\n- Q10–11 → mission « Compte système tpsys » · Q12–15 → mission « /etc/skel et tmpuser »\n- Q16–18 → mission « Groupe IIR » · Q19–23 → mission « /opt/donnees »\n- Q24–28 → mission « tp1 » · Q29–30, Q34 → mission « Expiration » · Q31–33 → mission « Verrouillage »\n- Q35 → exercice « Renommer et déplacer » · Q36–37 → mission « wheel » · Q38–41 → mission « sudoers »\n- Q42–44 → mission « Nettoyage final ».', 'Kol so2al f TP5 3endo mission wla tamrin.', 'Every TP5 question is covered by a **terminal mission** or a **worked exercise** (see list).']),
    mission('m-tp5-tpsys'),
    mission('m-tp5-tp1'),
    mission('m-tp5-cleanup')
  ],
  keyPoints: [
    L(['root UID 0, système < 1000, ordinaires ≥ 1000 ; groupe primaire (passwd) + secondaires (group).', 'root 0 ; < 1000 ; ≥ 1000.', 'root 0, system < 1000, users ≥ 1000; primary + secondary groups.']),
    L(['passwd 7 champs (login:x:uid:gid:commentaire:home:shell), shadow 9 (`!!` = pas de mdp, $6$ SHA-512), group 4, gshadow 4 (admins:membres).', 'passwd 7, shadow 9, group 4, gshadow 4.', 'passwd 7 fields, shadow 9, group 4, gshadow 4.']),
    L(['Défauts : /etc/default/useradd (useradd -D), /etc/login.defs (UID_MIN, PASS_MAX_DAYS…), /etc/skel.', 'default/useradd, login.defs, skel.', 'Defaults: default/useradd, login.defs, skel.']),
    L(['usermod -aG pour AJOUTER ; -G seul REMPLACE. -l renomme, -d -m déplace, -L/-U verrouille.', '-aG zid ; -G kaybeddel.', '-aG appends; -G alone replaces.']),
    L(['passwd -l -u -d -e -S ; chage -l, -d 0, -M -m -W -I -E (ex. chage -M 90 -W 7 alice).', 'passwd + chage.', 'passwd and chage options.']),
    L(['groupadd -g -r -f, groupmod -n -g, groupdel (pas un groupe primaire), gpasswd -a -d -M -A.', 'groupadd, groupmod, groupdel, gpasswd.', 'groupadd, groupmod, groupdel, gpasswd.']),
    L(['r=4 w=2 x=1 ; 755, 644, 600 ; rwxrw-r-- = 764 ; x sur un répertoire = traverser ; chown réservé à root.', 'r4 w2 x1 ; 764.', 'r=4 w=2 x=1; rwxrw-r-- = 764; x on dir = traverse.']),
    L(['sudo : visudo (-c), /etc/sudoers.d/, `user hôte=(cible) cmds`, %wheel ALL=(ALL) ALL, NOPASSWD:.', 'sudo : visudo, wheel, NOPASSWD.', 'sudo: visudo, sudoers.d, %wheel, NOPASSWD.'])
  ]
};

export const exercises = [
  ex('lx-tp5-q3-q4-q5', 2, ['TP5 Q3–5 : explorer fichiers et défauts', 'TP5 Q3–5', 'TP5 Q3–5: explore files and defaults'],
    ['Q3 : pourquoi un utilisateur ordinaire ne peut-il pas lire `/etc/shadow` ? Q4 : affiche les valeurs par défaut de useradd. Q5 : dans `/etc/login.defs`, retrouve UID_MIN, PASS_MAX_DAYS et ENCRYPT_METHOD.', 'Q3 shadow, Q4 useradd -D, Q5 login.defs.', 'Q3: why can\'t a regular user read shadow? Q4: show useradd defaults. Q5: find UID_MIN, PASS_MAX_DAYS, ENCRYPT_METHOD.'],
    [['Regarde `ls -l /etc/shadow`.', '`ls -l /etc/shadow`.', 'Look at `ls -l /etc/shadow`.'], ['grep sur login.defs.', 'grep.', 'grep login.defs.']],
    [{ t: ['Q3', 'Q3', 'Q3'], b: ['Mode `----------` root : seul root lit les hachages (sinon attaques par dictionnaire hors ligne).', 'Ghir root.', 'Mode `----------`: root only (protects hashes).'], code: 'ls -l /etc/shadow /etc/passwd\ncat /etc/shadow    # en etudiant : Permission non accordée' },
     { t: ['Q4', 'Q4', 'Q4'], b: ['', '', ''], code: 'useradd -D' },
     { t: ['Q5', 'Q5', 'Q5'], b: ['UID_MIN 1000, PASS_MAX_DAYS 99999, ENCRYPT_METHOD SHA512.', '1000, 99999, SHA512.', '1000, 99999, SHA512.'], code: 'grep -E "^(UID_MIN|PASS_MAX_DAYS|ENCRYPT_METHOD)" /etc/login.defs' }],
    ['shadow : root seul ; `useradd -D` ; UID_MIN 1000, PASS_MAX_DAYS 99999, ENCRYPT_METHOD SHA512.', 'root ; useradd -D ; 1000/99999/SHA512.', 'root only; `useradd -D`; 1000 / 99999 / SHA512.'],
    [['Chercher les défauts de mot de passe dans /etc/default/useradd.', 'F default/useradd.', 'Looking for password defaults in default/useradd.']]),
  ex('lx-tp5-q35', 3, ['TP5 Q35 : renommer et déplacer', 'TP5 Q35', 'TP5 Q35: rename and move'],
    ['Renomme `tp` en `tpnew`, déplace son répertoire en `/home/tpnew` avec son contenu, et renomme son groupe privé. Vérifie avec `id` et `ls -ld`.', 'Beddel tp → tpnew, home w groupe.', 'Rename tp → tpnew, move its home, rename its private group; verify.'],
    [['usermod -l ne touche ni au home ni au groupe.', '-l bou7do.', 'usermod -l changes neither home nor group.']],
    [{ t: ['Login', 'Login', 'Login'], b: ['', '', ''], code: 'usermod -l tpnew tp' },
     { t: ['Home', 'Home', 'Home'], b: ['`-d` + `-m`.', '`-d -m`.', '`-d` + `-m`.'], code: 'usermod -d /home/tpnew -m tpnew' },
     { t: ['Groupe et vérification', 'Groupe w tsdi9', 'Group and check'], b: ['', '', ''], code: 'groupmod -n tpnew tp\nid tpnew\nls -ld /home/tpnew' }],
    ['`usermod -l tpnew tp` ; `usermod -d /home/tpnew -m tpnew` ; `groupmod -n tpnew tp`.', 'usermod -l ; -d -m ; groupmod -n.', '`usermod -l`; `usermod -d … -m`; `groupmod -n`.'],
    [['Inverser NOUVEAU/ANCIEN.', 'L3eks.', 'Swapping NEW/OLD.'], ['Oublier -m.', 'Bla -m.', 'Forgetting -m.']]),
  ex('lx-users-1', 3, ['Diagnostic : « je ne suis plus dans le groupe docker »', 'Ma b9itch f docker', '"I\'m no longer in docker"'],
    ['L\'admin a tapé `usermod -G IIR tp` pour ajouter tp au groupe IIR. Le lendemain tp ne peut plus utiliser docker ni sudo. Explique et répare (tp était dans wheel et docker).', 'Fesser w sle7.', 'Explain and fix (tp was in wheel and docker).'],
    [['Que fait -G sans -a ?', '-G bla -a ?', '-G without -a?']],
    [{ t: ['Cause', 'Sabab', 'Cause'], b: ['`-G` sans `-a` **remplace** les groupes secondaires : tp n\'est plus que dans IIR.', '`-G` kaybeddel.', '`-G` without `-a` **replaces** the list.'], code: 'id -Gn tp    # tp IIR' },
     { t: ['Réparation', 'Tasli7', 'Fix'], b: ['Rajouter avec -a (ou gpasswd -a).', '`-aG`.', 'Re-add with -a.'], code: 'usermod -aG wheel,docker tp\nid -Gn tp' }],
    ['`usermod -aG wheel,docker tp` ; à l\'avenir toujours `-aG`.', '`-aG`.', '`usermod -aG wheel,docker tp`; always `-aG`.'],
    [['Recommencer avec -G.', '-G 3awtani.', 'Using -G again.']]),
  ex('lx-users-2', 3, ['Calcul de droits', '7sab droits', 'Permission arithmetic'],
    ['Donne l\'octal et la commande symbolique pour : a) `rwxr-x---` b) `rw-r-----` c) `rwxrwxr-x`. Puis : un fichier `script.sh` en 644 doit devenir exécutable par son propriétaire seulement.', 'Octal w symbolique.', 'Give octal and symbolic for three modes, then make script.sh (644) owner-executable.'],
    [['4+2+1 par triplet.', '4+2+1.', '4+2+1 per triplet.']],
    [{ t: ['a, b, c', 'a, b, c', 'a, b, c'], b: ['a) **750** = `u=rwx,g=rx,o=` ; b) **640** = `u=rw,g=r,o=` ; c) **775** = `ug=rwx,o=rx`.', '750, 640, 775.', 'a) 750, b) 640, c) 775.'] },
     { t: ['script.sh', 'script.sh', 'script.sh'], b: ['644 + x pour u = 744.', '744.', '744.'], code: 'chmod u+x script.sh   # ou chmod 744 script.sh' }],
    ['750, 640, 775 ; `chmod u+x script.sh` (→ 744).', '750, 640, 775 ; 744.', '750, 640, 775; `chmod u+x` → 744.'],
    [['`chmod +x` donne x à tous (755).', '`+x` l ga3.', '`chmod +x` gives x to all.'], ['Lire les triplets dans le désordre.', 'Tartib ghalat.', 'Misreading triplet order.']]),
  ex('lx-users-3', 3, ['Politique de mots de passe d\'une équipe', 'Politique mots de passe', 'Team password policy'],
    ['Pour `alice` : changement obligatoire à la 1re connexion, minimum 2 jours entre deux changements, validité 90 jours, avertissement 7 jours, compte désactivé 3 jours après expiration, compte expirant le 30/06/2027. Une commande `chage`, puis vérification.', 'Politique kamla b chage.', 'One chage command for the full policy, then verify.'],
    [['-d -m -M -W -I -E', '-d -m -M -W -I -E', '-d -m -M -W -I -E']],
    [{ t: ['Commande', 'Commande', 'Command'], b: ['', '', ''], code: 'chage -d 0 -m 2 -M 90 -W 7 -I 3 -E 2027-06-30 alice' },
     { t: ['Vérification', 'Tsdi9', 'Check'], b: ['shadow : `alice:…:0:2:90:7:3:<jour 30/06/2027>:`.', 'shadow.', 'shadow fields.'], code: 'chage -l alice\ngrep alice /etc/shadow' }],
    ['`chage -d 0 -m 2 -M 90 -W 7 -I 3 -E 2027-06-30 alice`.', 'chage kamla.', 'Full chage command.'],
    [['Confondre -m et -M.', '-m ≠ -M.', 'Confusing -m/-M.'], ['Confondre -I et -E.', '-I ≠ -E.', 'Confusing -I/-E.']]),
  ex('lx-users-4', 2, ['Supprimer proprement un compte', 'Mse7 compte', 'Cleanly delete an account'],
    ['`bob` (UID 1005) quitte l\'entreprise : il a des fichiers dans `/tmp` et `/opt`. Supprime le compte, son home, sa boîte mail, puis tous ses fichiers restants.', 'Mse7 bob w fichiers dyalo.', 'Delete bob, home, mail, then leftover files.'],
    [['Après userdel, les fichiers n\'ont plus de propriétaire nommé : cherche par UID.', 'find -uid.', 'Search by UID.']],
    [{ t: ['Compte', 'Compte', 'Account'], b: ['', '', ''], code: 'userdel -r bob' },
     { t: ['Fichiers orphelins', 'Orphelins', 'Orphans'], b: ['', '', ''], code: 'find / -type f -uid 1005 -print -exec rm {} \\;' }],
    ['`userdel -r bob` puis `find / -type f -uid 1005 -print -exec rm {} \\;`.', 'userdel -r + find.', '`userdel -r bob` then `find … -uid 1005 -exec rm`.'],
    [['Chercher avec -user bob après suppression.', '-user bob.', 'Using -user bob after deletion.'], ['Oublier `\\;` à la fin de -exec.', 'Tnsa `\\;`.', 'Forgetting `\\;`.']]),
  ex('lx-users-5', 3, ['Répertoire de projet partagé', 'Dossier partagé', 'Shared project directory'],
    ['Les membres de `dev` (alice, bob) doivent pouvoir lire/écrire dans `/srv/projet`, les autres n\'y ont aucun accès. Propose les commandes.', 'dev : rw ; lokhrin : walou.', 'dev members read/write /srv/projet; others nothing.'],
    [['Le groupe propriétaire doit être dev.', 'Groupe dev.', 'Group owner dev.']],
    [{ t: ['Groupe', 'Groupe', 'Group'], b: ['', '', ''], code: 'groupadd dev\ngpasswd -M alice,bob dev' },
     { t: ['Répertoire', 'Dossier', 'Directory'], b: ['770.', '770.', '770.'], code: 'mkdir -p /srv/projet\nchown root:dev /srv/projet\nchmod 770 /srv/projet\nls -ld /srv/projet' }],
    ['Groupe dev, `chown root:dev`, `chmod 770`.', 'dev + 770.', 'dev group, chown root:dev, chmod 770.'],
    [['777 : tout le monde y accède.', '777 khatar.', '777 opens to all.'], ['Oublier x sur le répertoire.', 'Bla x.', 'Forgetting x.']]),
  ex('lx-users-6', 3, ['Règles sudo ciblées', 'Règles sudo', 'Targeted sudo rules'],
    ['Écris les règles pour : a) les membres d\'`ops` peuvent gérer les services et lire le journal sans mot de passe ; b) `stagiaire` ne peut que redémarrer. Où et comment les écrire ? Comment tester ?', 'Règles ops w stagiaire.', 'Rules for ops (systemctl/journalctl, NOPASSWD) and stagiaire (reboot only).'],
    [['Fichiers dans /etc/sudoers.d avec visudo -f.', 'visudo -f.', 'visudo -f in sudoers.d.']],
    [{ t: ['Règles', 'Règles', 'Rules'], b: ['', '', ''], code: '%ops ALL=(ALL) NOPASSWD: /usr/bin/systemctl, /usr/bin/journalctl\nstagiaire ALL=(root) /usr/sbin/reboot' },
     { t: ['Écriture et test', 'Ktaba w test', 'Write and test'], b: ['', '', ''], code: 'visudo -f /etc/sudoers.d/ops\nvisudo -f /etc/sudoers.d/stagiaire\nvisudo -c\nsu - stagiaire -c "sudo -l"' }],
    ['`%ops ALL=(ALL) NOPASSWD: /usr/bin/systemctl, /usr/bin/journalctl` et `stagiaire ALL=(root) /usr/sbin/reboot`, via `visudo -f`.', 'Règles + visudo -f.', 'Two rules via `visudo -f`, check with `visudo -c`.'],
    [['Chemins relatifs dans sudoers.', 'Chemins relatifs.', 'Relative paths.'], ['Éditer sudoers avec nano.', 'nano.', 'Using nano.']]),
  ex('lx-users-7', 2, ['Lire /etc/group et /etc/gshadow', 'Qra group w gshadow', 'Reading group and gshadow'],
    ['Interprète : `/etc/group` : `developpeurs:x:1010:user1,user2,user3` et `/etc/gshadow` : `developpeurs:$6$Zp…:admin1,admin2:user1,user2,user3`. Qui est membre ? Qui peut ajouter un membre sans être root ? Quel algorithme ?', 'Chkoun membre ? admin ? algorithme ?', 'Who is a member? Who can add members without root? Which algorithm?'],
    [['gshadow = groupe:mdp:admins:membres.', 'gshadow champs.', 'gshadow fields.']],
    [{ t: ['Lecture', '9raya', 'Reading'], b: ['GID 1010 ; membres secondaires user1-3 ; admins admin1, admin2 (gpasswd -a/-d sans root) ; mot de passe $6$ = SHA-512.', 'Membres, admins, SHA-512.', 'GID 1010; members user1-3; admins admin1/2; $6$ = SHA-512.'] }],
    ['Membres : user1, user2, user3 ; admins : admin1, admin2 ; SHA-512.', 'user1-3 ; admin1-2 ; SHA-512.', 'Members user1-3; admins admin1-2; SHA-512.'],
    [['Croire que les admins sont membres automatiquement.', 'Admins machi membres.', 'Admins are not automatically members.']])
];

export const flashcards = [
  fc('fc-us-1', ['UID root / système / ordinaires ?', 'UID ?', 'UIDs?'], ['0 / 1–999 / ≥ 1000', '0 / 1–999 / ≥ 1000', '0 / 1–999 / ≥ 1000']),
  fc('fc-us-2', ['Champs de /etc/passwd ?', 'passwd ?', '/etc/passwd fields?'], ['login:x:uid:gid:commentaire:home:shell', 'login:x:uid:gid:commentaire:home:shell', 'login:x:uid:gid:comment:home:shell']),
  fc('fc-us-3', ['Champs de /etc/shadow ?', 'shadow ?', 'shadow fields?'], ['login:mdp:last:min:max:warn:inactif:expire:réservé', 'login:mdp:last:min:max:warn:inactif:expire', 'login:hash:last:min:max:warn:inactive:expire:reserved']),
  fc('fc-us-4', ['/etc/group et /etc/gshadow ?', 'group / gshadow ?', 'group / gshadow?'], ['group:x:gid:membres · group:mdp:admins:membres', 'group:x:gid:membres · group:mdp:admins:membres', 'group:x:gid:members · group:pw:admins:members']),
  fc('fc-us-5', ['`!!` dans shadow ?', '`!!` ?', '`!!`?'], ['Pas de mot de passe défini / verrouillé.', 'Bla mot de passe.', 'No password set / locked.']),
  fc('fc-us-6', ['$6$ ?', '$6$ ?', '$6$?'], ['SHA-512', 'SHA-512', 'SHA-512']),
  fc('fc-us-7', ['/etc/default/useradd ?', 'default/useradd ?', 'default/useradd?'], ['GROUP HOME INACTIVE EXPIRE SHELL SKEL CREATE_MAIL_SPOOL (useradd -D)', 'Défauts useradd.', 'useradd defaults.']),
  fc('fc-us-8', ['/etc/login.defs ?', 'login.defs ?', 'login.defs?'], ['UID_MIN/MAX, SYS_UID_MIN/MAX, PASS_MAX/MIN_DAYS, PASS_MIN_LEN, CREATE_HOME, ENCRYPT_METHOD', 'UID_MIN, PASS_*…', 'UID_MIN, PASS_*, CREATE_HOME…']),
  fc('fc-us-9', ['usermod -G vs -aG ?', '-G vs -aG ?', '-G vs -aG?'], ['-G remplace les groupes secondaires ; -aG ajoute.', '-G kaybeddel ; -aG kayzid.', '-G replaces; -aG appends.']),
  fc('fc-us-10', ['useradd -r ?', 'useradd -r ?', 'useradd -r?'], ['Compte système (UID < 1000, pas de home).', 'Système.', 'System account.']),
  fc('fc-us-11', ['userdel -r ?', 'userdel -r ?', 'userdel -r?'], ['Supprime aussi home et boîte mail.', 'Home + mail.', 'Also home and mail.']),
  fc('fc-us-12', ['passwd -l -u -d -e -S ?', 'passwd options ?', 'passwd options?'], ['verrouiller, déverrouiller, supprimer, expirer, état', 'sedd, fte7, mse7, expirer, état', 'lock, unlock, delete, expire, status']),
  fc('fc-us-13', ['chage -d 0 ?', 'chage -d 0 ?', 'chage -d 0?'], ['Changement de mot de passe obligatoire à la prochaine connexion.', 'Beddel f connexion jaya.', 'Forced change at next login.']),
  fc('fc-us-14', ['chage -M -m -W -I -E ?', 'chage ?', 'chage?'], ['max, min, warn, inactif, expiration du compte', 'max, min, warn, inactif, expire', 'max, min, warn, inactive, account expiry']),
  fc('fc-us-15', ['gpasswd -a -d -M -A ?', 'gpasswd ?', 'gpasswd?'], ['ajouter, retirer, membres, administrateurs', 'zid, 7eyed, membres, admins', 'add, delete, members, admins']),
  fc('fc-us-16', ['groupdel impossible quand ?', 'groupdel ?', 'groupdel fails when?'], ['Groupe primaire d\'un utilisateur.', 'Primaire.', 'Primary group of a user.']),
  fc('fc-us-17', ['rwxrw-r-- ?', 'rwxrw-r-- ?', 'rwxrw-r--?'], ['764', '764', '764']),
  fc('fc-us-18', ['x sur un répertoire ?', 'x f dossier ?', 'x on a directory?'], ['Le traverser (cd, accéder aux fichiers) ; r = lister.', 'Dkhol ; r = lister.', 'Traverse it; r = list.']),
  fc('fc-us-19', ['Format sudoers ?', 'sudoers ?', 'sudoers format?'], ['utilisateur hôte=(cible) commandes ; %groupe ; NOPASSWD:', 'user hôte=(cible) cmd', 'user host=(target) cmds; %group; NOPASSWD:']),
  fc('fc-us-20', ['Retirer tp1 de wheel ?', 'tp1 mn wheel ?', 'Remove tp1 from wheel?'], ['`gpasswd -d tp1 wheel`', '`gpasswd -d tp1 wheel`', '`gpasswd -d tp1 wheel`']),
  fc('fc-us-21', ['vipw / vigr ?', 'vipw / vigr ?', 'vipw / vigr?'], ['Éditer passwd / group avec verrouillage (-s : shadow / gshadow).', 'Beddel b verrou.', 'Edit with locking.'])
];

export const reference = [
  ref('r-us-1', 'useradd [-m -M -u -g -G -d -s -c -e -r] login', ['Créer un utilisateur', 'Dir user', 'Create a user'], 'useradd -u 2003 -g users -e 2026-12-31 tp1'),
  ref('r-us-2', 'useradd -D [-s SHELL]', ['Voir / changer les défauts', 'Défauts', 'Show / set defaults']),
  ref('r-us-3', 'usermod -aG G login', ['AJOUTER un groupe secondaire', 'Zid groupe', 'APPEND a secondary group']),
  ref('r-us-4', 'usermod -G G1,G2 login', ['REMPLACER les groupes secondaires', 'Beddel groupes', 'REPLACE secondary groups']),
  ref('r-us-5', 'usermod -l NOUVEAU ANCIEN · -d REP -m · -s · -c · -e · -L · -U', ['Renommer, home, shell, commentaire, expiration, verrou', 'Usermod', 'Rename, home, shell…']),
  ref('r-us-6', 'userdel [-r] [-f] login', ['Supprimer (avec home)', 'Mse7', 'Delete (with home)']),
  ref('r-us-7', 'find / -type f -uid UID -print -exec rm {} \\;', ['Fichiers orphelins', 'Orphelins', 'Orphan files']),
  ref('r-us-8', 'passwd [-l -u -d -e -S -n -x -w -i] [login]', ['Mot de passe', 'Mot de passe', 'Password']),
  ref('r-us-9', 'chage -l · -d 0 · -M -m -W -I · -E DATE', ['Expiration', 'Expiration', 'Aging'], 'chage -M 90 -W 7 alice'),
  ref('r-us-10', 'groupadd [-g GID] [-r] [-f] G', ['Créer un groupe', 'Dir groupe', 'Create a group']),
  ref('r-us-11', 'groupmod -n NOUVEAU -g GID G · groupdel G', ['Modifier / supprimer un groupe', 'Beddel / mse7', 'Modify / delete group']),
  ref('r-us-12', 'gpasswd -a U G · -d U G · -M U1,U2 G · -A U G', ['Membres et admins', 'Membres', 'Members and admins']),
  ref('r-us-13', 'whoami · who · groups · id [-u -g -Gn] [login]', ['Identité', 'Identité', 'Identity']),
  ref('r-us-14', 'vipw [-s] · vigr [-s]', ['Éditer avec verrouillage', 'Beddel', 'Edit with locking']),
  ref('r-us-15', 'chmod [-R] 755|u+x,g-w,o= f', ['Droits', 'Droits', 'Permissions']),
  ref('r-us-16', 'chown [-R] user[:group] f · chgrp [-R] G f', ['Propriétaire / groupe', 'Mol / groupe', 'Owner / group']),
  ref('r-us-17', 'r=4 w=2 x=1', ['755 rwxr-xr-x · 644 rw-r--r-- · 600 rw------- · 764 rwxrw-r--', 'Octal', 'Octal']),
  ref('r-us-18', 'visudo [-c] [-f /etc/sudoers.d/x]', ['Éditer / vérifier sudoers', 'sudoers', 'Edit / check sudoers']),
  ref('r-us-19', 'user hôte=(cible) [NOPASSWD:] cmds', ['Règle sudoers', 'Règle', 'sudoers rule'], 'tp1 ALL=(root) /usr/sbin/reboot'),
  ref('r-us-20', '%wheel ALL=(ALL) ALL', ['Groupe wheel = sudo complet', 'wheel', 'wheel = full sudo']),
  ref('r-us-21', 'sudo -l · sudo -i · sudo -u U cmd', ['Mes droits · shell root · autre utilisateur', 'sudo', 'My rights · root shell · as user']),
  ref('r-us-22', 'su [-] [login] · su -c "cmd" login · exit', ['Changer d\'utilisateur', 'Beddel user', 'Switch user'])
];
