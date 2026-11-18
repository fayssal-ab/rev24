import { setCtx, L, h, p, code, tip, trap, exam, table, anim, quiz, mission, single, multi, cmd, order, ex, fc, ref } from '../lib';
import type { Chapter } from '../../src/lib/schema';

setCtx('linux', 'systemd');

export const questions = [
  single('ls-01', 1, ['Quel est le PID de systemd ?', 'Chnou PID dyal systemd ?', 'What is systemd\'s PID?'],
    [['0', '0', '0'], ['1', '1', '1'], ['100', '100', '100'], ['Variable', 'Kaytbeddel', 'It varies']], 1,
    ['systemd est le **premier processus** lancé par le noyau : **PID 1**, ancêtre de tous les autres (`ps aux | head -2`).', 'systemd howa **awel processus** : **PID 1** (`ps aux | head -2`).', 'systemd is the **first process** started by the kernel: **PID 1**, ancestor of all others (`ps aux | head -2`).'],
    [['Le PID 0 n\'est pas un processus utilisateur (ordonnanceur du noyau).', 'PID 0 machi processus.', 'PID 0 is not a user process.'], ['Les services ont des PID plus élevés.', 'Services PID kbar.', 'Services have higher PIDs.'], ['Il est toujours 1.', 'Dima 1.', 'Always 1.']], ['systemd']),
  cmd('ls-02', 1, ['Affiche la cible (target) de démarrage par défaut.', 'Werri target par défaut.', 'Show the default boot target.'],
    ['systemctl get-default'], ['`get-default` lit le lien `/etc/systemd/system/default.target`.', '`get-default` kay9ra lien `default.target`.', '`get-default` reads the `/etc/systemd/system/default.target` link.'],
    { 'systemctl status default.target': ['Montre l\'état d\'une unité, pas laquelle est la cible par défaut.', 'Status machi default.', 'Shows a unit state, not which target is default.'] }, ['targets']),
  cmd('ls-03', 2, ['Fais démarrer la machine en mode texte multi-utilisateur **aux prochains démarrages**.', 'Khalli machine tbda b mode texte **f démarrages jayin**.', 'Make the machine boot in text multi-user mode **on future boots**.'],
    ['systemctl set-default multi-user.target'], ['`set-default` remplace le lien `default.target` → effet au **prochain** démarrage. Pour basculer **maintenant** : `isolate`.', '`set-default` → démarrage **jay**. Daba : `isolate`.', '`set-default` replaces the `default.target` link → effective at **next** boot. To switch **now**: `isolate`.'],
    { 'systemctl isolate multi-user.target': ['`isolate` bascule maintenant mais ne change pas le démarrage par défaut.', '`isolate` daba walakin machi default.', '`isolate` switches now but does not change the default.'] }, ['targets']),
  single('ls-04', 2, ['Différence entre `systemctl set-default X` et `systemctl isolate X` ?', 'Lfar9 bin `set-default` w `isolate` ?', 'Difference between `set-default X` and `isolate X`?'],
    [['Aucune', 'Walou', 'None'], ['set-default agit au prochain démarrage, isolate bascule immédiatement', 'set-default f démarrage jay, isolate daba', 'set-default applies at next boot, isolate switches now'], ['isolate est permanent, set-default temporaire', 'isolate dayem, set-default mo2a9at', 'isolate is permanent, set-default temporary'], ['set-default arrête les services', 'set-default kaywe9ef services', 'set-default stops services']], 1,
    ['**set-default ≠ isolate** : le premier modifie le lien `default.target` (persistant), le second change de cible **tout de suite** (non persistant).', '**set-default ≠ isolate** : wa7ed dayem, lakhor daba.', '**set-default ≠ isolate**: the first changes `default.target` (persistent), the second switches **now** (not persistent).'],
    [['Elles diffèrent.', 'Mkhtalfin.', 'They differ.'], ['C\'est l\'inverse.', 'L3eks.', 'It is the opposite.'], ['C\'est isolate qui arrête ce qui n\'appartient pas à la cible.', 'isolate li kaywe9ef.', 'isolate is the one stopping units outside the target.']], ['targets']),
  single('ls-05', 2, ['Quelle cible correspond à l\'ancien runlevel 5 ?', 'Ach men target = runlevel 5 ?', 'Which target matches old runlevel 5?'],
    [['multi-user.target', 'multi-user.target', 'multi-user.target'], ['graphical.target', 'graphical.target', 'graphical.target'], ['rescue.target', 'rescue.target', 'rescue.target'], ['reboot.target', 'reboot.target', 'reboot.target']], 1,
    ['Runlevels : 0 poweroff, 1 rescue, 2-4 multi-user, **5 graphical**, 6 reboot. `runlevel` / `telinit` existent encore pour compatibilité.', '0 poweroff, 1 rescue, 3 multi-user, **5 graphical**, 6 reboot.', 'Runlevels: 0 poweroff, 1 rescue, 2-4 multi-user, **5 graphical**, 6 reboot.'],
    [['= runlevel 3.', '= 3.', '= runlevel 3.'], ['= runlevel 1.', '= 1.', '= runlevel 1.'], ['= runlevel 6.', '= 6.', '= runlevel 6.']], ['targets']),
  cmd('ls-06', 2, ['Liste les cibles (targets) actuellement chargées.', 'Lister targets chargés.', 'List the currently loaded targets.'],
    ['systemctl list-units --type target', 'systemctl list-units --type=target', 'systemctl list-units -t target'], ['`list-units` filtre par type avec `--type target` (ou `--type=target`).', '`--type target`.', '`list-units` filters with `--type target`.'], {}, ['targets']),
  cmd('ls-07', 2, ['Liste les unités en **échec**.', 'Lister unités li **fchlou**.', 'List **failed** units.'],
    ['systemctl --failed', 'systemctl list-units --failed', 'systemctl list-units --state=failed'], ['`--failed` filtre les unités en état `failed` (ex. kdump sur une VM sans mémoire réservée).', '`--failed`.', '`--failed` shows units in `failed` state.'], {}, ['systemd']),
  single('ls-08', 1, ['`systemctl enable httpd` démarre-t-il httpd immédiatement ?', 'Wach `enable httpd` kaybdah daba ?', 'Does `systemctl enable httpd` start httpd now?'],
    [['Oui', 'Ah', 'Yes'], ['Non : il l\'active pour les prochains démarrages seulement', 'La : ghir l démarrages jayin', 'No: only for future boots'], ['Oui, et au démarrage', 'Ah, w f démarrage', 'Yes, and at boot'], ['Non, il le masque', 'La, kaymasquih', 'No, it masks it']], 1,
    ['**enable ≠ start**. `enable` crée un lien dans `multi-user.target.wants/`. Pour les deux : `systemctl enable --now httpd`.', '**enable ≠ start**. Bjouj : `enable --now`.', '**enable ≠ start**. `enable` creates a link in `multi-user.target.wants/`. Both: `enable --now`.'],
    [['C\'est start qui démarre.', 'start li kaybda.', 'start starts it.'], ['Seulement avec --now.', 'Ghir b --now.', 'Only with --now.'], ['mask est une autre commande.', 'mask haja khra.', 'mask is different.']], ['services']),
  cmd('ls-09', 2, ['Active httpd au démarrage **et** démarre-le tout de suite, en une commande.', 'Enable httpd **w** bdah daba, f commande wa7da.', 'Enable httpd at boot **and** start it now, in one command.'],
    ['systemctl enable --now httpd', 'systemctl enable --now httpd.service', 'systemctl --now enable httpd'], ['`--now` combine `enable` + `start`.', '`--now` = enable + start.', '`--now` combines enable + start.'],
    { 'systemctl enable httpd': ['Ne démarre pas le service maintenant.', 'Ma kaybdach daba.', 'Does not start it now.'], 'systemctl start httpd': ['Ne l\'active pas au démarrage.', 'Ma kaydirch enable.', 'Does not enable it at boot.'] }, ['services']),
  single('ls-10', 3, ['Quel est l\'effet de `systemctl mask bluetooth` ?', 'Chnou kaydir `mask bluetooth` ?', 'What does `systemctl mask bluetooth` do?'],
    [['Le service est arrêté mais peut redémarrer', 'Kaywe9ef walakin y9der yrje3', 'Stops it but it can start again'], ['Lien vers /dev/null : le service ne peut plus être démarré, même manuellement ou par dépendance', 'Lien l /dev/null : ma ymkench ybda, 7ta b yeddek', 'Link to /dev/null: cannot be started at all, even manually or as a dependency'], ['Le cache de l\'affichage', 'Kaykhbbih f affichage', 'Hides it from listings'], ['Le désinstalle', 'Kaydésinstallih', 'Uninstalls it']], 1,
    ['`mask` crée `/etc/systemd/system/bluetooth.service → /dev/null` : `start` échoue (« Unit is masked »). `unmask` annule.', '`mask` → `/dev/null` ; `start` kayfchel ; `unmask`.', '`mask` creates a link to `/dev/null`: `start` fails ("Unit is masked"). `unmask` undoes it.'],
    [['Ça, c\'est stop (+ disable).', 'Hadi stop.', 'That is stop (+ disable).'], ['Le service apparaît toujours, état masked.', 'Kayban, masked.', 'It still shows, as masked.'], ['Le paquet reste installé.', 'Paquet kayb9a.', 'The package stays installed.']], ['services']),
  multi('ls-11', 3, ['Après `systemctl disable --now sshd`, que se passe-t-il ?', 'Mor `disable --now sshd` ?', 'After `systemctl disable --now sshd`?'],
    [['sshd est arrêté immédiatement', 'sshd wa9ef daba', 'sshd stops now'], ['sshd ne démarrera plus au boot', 'Ma ghaybdach f boot', 'sshd will not start at boot'], ['sshd est masqué', 'sshd masqué', 'sshd is masked'], ['On peut encore le démarrer avec start', 'Y9der ybda b start', 'It can still be started with start']], [0, 1, 3],
    ['`disable --now` = disable + stop. Contrairement à `mask`, un `start` manuel reste possible.', 'disable + stop ; start mazal momkin.', '`disable --now` = disable + stop. Unlike `mask`, a manual `start` still works.'],
    [['Non : seul `mask` empêche tout démarrage.', 'La : ghir `mask`.', 'No: only `mask` blocks all starts.']], ['services']),
  single('ls-12', 2, ['`systemctl is-active sshd` affiche `inactive`. Quel est son code de retour ?', '`is-active` → `inactive`. Code de retour ?', '`is-active sshd` prints `inactive`. Exit code?'],
    [['0', '0', '0'], ['Différent de 0 (3)', 'Machi 0 (3)', 'Non-zero (3)'], ['1 toujours', '1 dima', 'Always 1'], ['Aucun', 'Walou', 'None']], 1,
    ['`is-active` renvoie **0 si actif**, sinon un code non nul (3) : utilisable dans un script (`systemctl is-active sshd && echo OK`).', '0 ila active, sinon 3.', 'Returns **0 if active**, otherwise non-zero (3): usable in scripts.'],
    [['0 = actif.', '0 = active.', '0 = active.'], ['C\'est 3 en pratique.', '3.', 'In practice 3.'], ['Toute commande renvoie un code.', 'Kol commande 3endha code.', 'Every command returns a code.']], ['services']),
  cmd('ls-13', 2, ['Affiche les **erreurs** (priorité err et plus grave) du démarrage courant.', 'Werri **erreurs** dyal démarrage daba.', 'Show **errors** (priority err and worse) from the current boot.'],
    ['journalctl -b -p err', 'journalctl -p err -b', 'journalctl -b -p 3'], ['`-b` = depuis le démarrage, `-p err` = priorité err (3) **et plus grave** (crit, alert, emerg).', '`-b` démarrage, `-p err` priorité.', '`-b` = this boot, `-p err` = priority err (3) **and worse**.'],
    { 'journalctl -p err': ['Correct pour les erreurs mais inclut aussi les démarrages précédents.', 'Ma fihach `-b`.', 'Includes previous boots too.'] }, ['journal']),
  cmd('ls-14', 2, ['Suis en temps réel le journal du service sshd.', 'Tba3 journal dyal sshd b temps réel.', 'Follow the sshd journal in real time.'],
    ['journalctl -u sshd -f', 'journalctl -f -u sshd', 'journalctl -fu sshd', 'journalctl -u sshd.service -f'], ['`-u` filtre l\'unité, `-f` suit (comme `tail -f`).', '`-u` unité, `-f` tba3.', '`-u` filters the unit, `-f` follows.'], {}, ['journal']),
  cmd('ls-15', 2, ['Affiche les **20 dernières** lignes du journal.', 'Werri **20 lekhrin**.', 'Show the **last 20** journal lines.'],
    ['journalctl -n 20', 'journalctl -n20', 'journalctl --lines 20'], ['`-n N` = N dernières lignes.', '`-n N`.', '`-n N` = last N lines.'], { 'journalctl | tail -20': ['Fonctionne mais lit tout le journal ; `-n` est fait pour ça.', 'Khddam walakin `-n` a7san.', 'Works but reads everything; `-n` is meant for this.'] }, ['journal']),
  order('ls-16', 3, ['Remets dans l\'ordre la création d\'un service personnalisé `monscript`.', 'Rttab création dyal service `monscript`.', 'Order the creation of a custom service `monscript`.'],
    [['Créer le script et le rendre exécutable (chmod +x)', 'Dir script w chmod +x', 'Create the script and chmod +x'], ['Écrire /etc/systemd/system/monscript.service ([Unit] [Service] [Install])', 'Ktb monscript.service', 'Write /etc/systemd/system/monscript.service'], ['systemctl daemon-reload', 'systemctl daemon-reload', 'systemctl daemon-reload'], ['systemctl enable --now monscript', 'enable --now', 'systemctl enable --now monscript'], ['systemctl status monscript', 'status', 'systemctl status monscript']],
    ['Script exécutable → fichier d\'unité → **daemon-reload** (systemd relit les unités) → enable/start → vérification.', 'Script → unité → daemon-reload → enable → status.', 'Executable script → unit file → **daemon-reload** → enable/start → verify.'], ['service']),
  single('ls-17', 3, ['Pourquoi lancer `systemctl daemon-reload` après avoir créé ou modifié un fichier `.service` ?', '3lach `daemon-reload` ?', 'Why run `daemon-reload` after creating/editing a `.service`?'],
    [['Pour redémarrer la machine', 'Bach redémarrer', 'To reboot'], ['Pour que systemd relise les fichiers d\'unités modifiés', 'Bach systemd y3awed y9ra unités', 'So systemd re-reads the unit files'], ['Pour démarrer tous les services', 'Bach ybdaw services', 'To start all services'], ['Pour vider le journal', 'Bach ykhwi journal', 'To clear the journal']], 1,
    ['systemd garde les unités en mémoire : sans `daemon-reload`, il ignore le nouveau fichier (« Unit not found ») ou l\'ancienne version.', 'Bla daemon-reload : « Unit not found ».', 'systemd caches units: without `daemon-reload` it ignores the new file ("Unit not found") or uses the old version.'],
    [['Aucun redémarrage.', 'Bla redémarrage.', 'No reboot.'], ['Ne démarre rien.', 'Ma kaybda walou.', 'Starts nothing.'], ['Sans rapport avec le journal.', 'Ma 3endo 3ala9a.', 'Unrelated to the journal.']], ['service']),
  single('ls-18', 2, ['Dans un fichier `.service`, que signifie `WantedBy=multi-user.target` ?', '`WantedBy=multi-user.target` ma3naha ?', 'What does `WantedBy=multi-user.target` mean?'],
    [['Le service démarre après multi-user', 'Kaybda mor multi-user', 'Starts after multi-user'], ['enable crée un lien dans multi-user.target.wants/ : le service démarre avec cette cible', 'enable kaydir lien f multi-user.target.wants/', 'enable links it in multi-user.target.wants/: it starts with that target'], ['Le service est obligatoire', 'Darouri', 'The service is mandatory'], ['Seul root peut le lancer', 'Ghir root', 'Only root can start it']], 1,
    ['La section `[Install]` est utilisée par `enable` : `WantedBy=multi-user.target` → lien dans `/etc/systemd/system/multi-user.target.wants/`.', '`[Install]` dyal `enable`.', '`[Install]` is used by `enable`: link created in `multi-user.target.wants/`.'],
    [['L\'ordre se règle avec After=.', 'After=.', 'Ordering uses After=.'], ['« Wanted » = dépendance faible.', 'Dépendance d3ifa.', '"Wanted" = weak dependency.'], ['Sans rapport avec les droits.', 'Machi droits.', 'Unrelated to permissions.']], ['service']),
  cmd('ls-19', 2, ['Affiche les services qui ont pris le plus de temps au démarrage.', 'Werri services li tweltou f démarrage.', 'Show which services took longest at boot.'],
    ['systemd-analyze blame'], ['`systemd-analyze` donne le temps total ; `blame` le détail par unité ; `critical-chain` la chaîne critique.', '`blame` détail ; `critical-chain`.', '`blame` per unit; `critical-chain` the critical path.'], { 'systemd-analyze': ['Donne seulement le temps total.', 'Ghir total.', 'Only the total time.'] }, ['systemd']),
  multi('ls-20', 2, ['Quels formats accepte `journalctl -o` ?', 'Formats dyal `journalctl -o` ?', 'Which formats does `journalctl -o` accept?'],
    [['json', 'json', 'json'], ['json-pretty', 'json-pretty', 'json-pretty'], ['cat', 'cat', 'cat'], ['verbose', 'verbose', 'verbose'], ['xml', 'xml', 'xml']], [0, 1, 2, 3],
    ['`-o short` (défaut), `json`, `json-pretty`, `cat` (message seul), `verbose` (tous les champs).', 'short, json, json-pretty, cat, verbose.', 'short (default), json, json-pretty, cat, verbose.'],
    [['Pas de sortie XML.', 'Ma kaynch XML.', 'No XML output.']], ['journal']),
  cmd('ls-21', 3, ['Affiche les avertissements (warning et plus grave) du service httpd depuis une heure.', 'Werri warnings dyal httpd mn sa3a.', 'Show warnings (and worse) of httpd from the last hour.'],
    ['journalctl -u httpd -p warning --since "1 hour ago"', 'journalctl -p warning -u httpd --since "1 hour ago"'], ['On combine `-u` (unité), `-p warning` (priorité ≤ 4) et `--since`.', '`-u` + `-p warning` + `--since`.', 'Combine `-u`, `-p warning` and `--since`.'], {}, ['journal'])
];

export const chapter: Chapter = {
  id: 'systemd',
  module: 'linux',
  order: 4,
  title: L(['TP3 — systemd : cibles, services, journal', 'TP3 — systemd : targets, services, journal', 'TP3 — systemd: targets, services, journal']),
  summary: L(['PID 1, cibles (get/set-default, isolate), gestion des services (start ≠ enable, mask), journalctl, création d\'un service personnalisé.', 'PID 1, targets, services (start ≠ enable, mask), journalctl, service dyalek.', 'PID 1, targets (get/set-default, isolate), services (start ≠ enable, mask), journalctl, custom service.']),
  estimatedMinutes: 55,
  sections: [
    h(['systemd, le PID 1', 'systemd, PID 1', 'systemd, PID 1']),
    p(['**systemd** est le gestionnaire de système de RHEL 9 : premier processus (PID 1), il démarre les **unités** (services `.service`, cibles `.target`, montages, sockets…) en parallèle selon leurs dépendances.', '**systemd** : PID 1, kaybda **unités** (`.service`, `.target`…) f nefs lwe9t.', '**systemd** is RHEL 9\'s system manager: PID 1, it starts **units** (`.service`, `.target`, mounts, sockets…) in parallel by dependencies.']),
    code(`systemctl --version
ps aux | head -2              # PID 1 = /usr/lib/systemd/systemd
whereis systemd
systemd-analyze               # temps de démarrage
systemd-analyze blame         # par unité
systemd-analyze critical-chain`),
    quiz('ls-01', 'ls-19'),
    h(['Les cibles (targets)', 'Targets', 'Targets']),
    table([['Cible', 'Target', 'Target'], ['Ancien runlevel', 'Runlevel', 'Runlevel'], ['Usage', 'Isti3mal', 'Use']], [
      ['poweroff.target', '0', ['Arrêt', 'Tfi', 'Power off']], ['rescue.target', '1', ['Maintenance mono-utilisateur', 'Maintenance', 'Single-user maintenance']], ['multi-user.target', '3', ['Texte + réseau (serveurs)', 'Texte + réseau', 'Text + network (servers)']], ['graphical.target', '5', ['Interface graphique', 'Graphique', 'Graphical']], ['reboot.target', '6', ['Redémarrage', 'Redémarrage', 'Reboot']]
    ]),
    code(`systemctl get-default                       # cible par défaut
systemctl set-default multi-user.target     # au PROCHAIN démarrage (lien default.target)
systemctl isolate multi-user.target         # MAINTENANT
systemctl list-units --type target
systemctl --failed
runlevel ; telinit 3                        # anciennes commandes (compatibilité)`),
    exam(['**set-default ≠ isolate** : persistant (au boot) vs immédiat.', '**set-default ≠ isolate**.', '**set-default ≠ isolate**: persistent (boot) vs immediate.']),
    mission('m-systemd-target'),
    quiz('ls-03', 'ls-04', 'ls-05'),
    h(['Gérer les services', 'Gestion dyal services', 'Managing services']),
    anim('SystemdStates'),
    code(`systemctl list-unit-files --type=service
systemctl status sshd
systemctl start | stop | restart | reload httpd
systemctl enable | disable httpd       # au démarrage
systemctl enable --now httpd           # les deux
systemctl is-active sshd ; systemctl is-enabled sshd
systemctl mask bluetooth ; systemctl unmask bluetooth
systemctl kill httpd`),
    trap(['`enable` ne démarre **pas** le service maintenant, et `start` ne l\'active **pas** au démarrage. `reload` relit la configuration sans couper (si le service le permet), `restart` arrête puis relance.', '`enable` ≠ `start`. `reload` ≠ `restart`.', '`enable` does **not** start now and `start` does **not** enable at boot. `reload` re-reads config without stopping; `restart` stops then starts.']),
    mission('m-systemd-enable'),
    quiz('ls-08', 'ls-10', 'ls-11'),
    h(['Le journal : journalctl', 'Journal : journalctl', 'The journal: journalctl']),
    code(`journalctl -b                 # depuis le démarrage (-b -1 : précédent)
journalctl -f                 # suivre en temps réel
journalctl -u sshd            # une unité
journalctl -p err             # priorité err et plus grave (warning, info…)
journalctl --since "1 hour ago" ; journalctl -n 20
journalctl -o json | json-pretty | cat | verbose`),
    tip(['Priorités : 0 emerg, 1 alert, 2 crit, **3 err**, **4 warning**, 5 notice, **6 info**, 7 debug. `-p X` affiche X et tout ce qui est plus grave.', '0 emerg … 3 err, 4 warning, 6 info, 7 debug.', 'Priorities: 0 emerg, 1 alert, 2 crit, **3 err**, **4 warning**, 5 notice, **6 info**, 7 debug. `-p X` shows X and worse.']),
    quiz('ls-13', 'ls-14'),
    h(['Créer un service personnalisé', 'Dir service dyalek', 'Creating a custom service']),
    code(`[Unit]
Description=Mon script de sauvegarde

[Service]
ExecStart=/usr/local/bin/monscript.sh

[Install]
WantedBy=multi-user.target`, 'ini', ['/etc/systemd/system/monscript.service', '/etc/systemd/system/monscript.service', '/etc/systemd/system/monscript.service']),
    code(`chmod +x /usr/local/bin/monscript.sh
systemctl daemon-reload            # relire les unités
systemctl enable --now monscript
systemctl status monscript`),
    mission('m-systemd-service'),
    quiz('ls-16', 'ls-17', 'ls-18')
  ],
  keyPoints: [
    L(['systemd = PID 1 ; `systemd-analyze blame` / `critical-chain`.', 'systemd = PID 1.', 'systemd = PID 1; `systemd-analyze blame` / `critical-chain`.']),
    L(['get-default / set-default (lien default.target, au prochain boot) / isolate (immédiat). multi-user = 3, graphical = 5.', 'set-default (boot) ≠ isolate (daba).', 'get-default / set-default (next boot) / isolate (now). multi-user = 3, graphical = 5.']),
    L(['start/stop/restart/reload (maintenant) ≠ enable/disable (démarrage) ; enable --now ; mask = lien /dev/null.', 'start ≠ enable ; --now ; mask.', 'start/stop/restart/reload (now) ≠ enable/disable (boot); enable --now; mask = /dev/null link.']),
    L(['journalctl -b -f -u -p err|warning|info --since -n -o json|json-pretty|cat|verbose.', 'journalctl -b -f -u -p.', 'journalctl -b -f -u -p err|warning|info --since -n -o.']),
    L(['Service perso : [Unit] Description, [Service] ExecStart, [Install] WantedBy=multi-user.target → daemon-reload → enable --now.', '[Unit] [Service] [Install] → daemon-reload → enable --now.', 'Custom service: [Unit] Description, [Service] ExecStart, [Install] WantedBy → daemon-reload → enable --now.'])
  ]
};

export const exercises = [
  ex('lx-sd-1', 2, ['Serveur sans interface graphique', 'Serveur bla graphique', 'Server without GUI'],
    ['Une VM démarre en mode graphique et consomme trop de RAM. Passe-la **tout de suite** en mode texte multi-utilisateur, et fais en sorte qu\'elle reste en mode texte **après redémarrage**. Vérifie.', 'VM graphique. Douzha **daba** l texte, w **mor redémarrage** tb9a texte.', 'A VM boots graphical and uses too much RAM. Switch it **now** to text multi-user, keep it text **after reboot**, and verify.'],
    [['Deux commandes différentes : maintenant / au démarrage.', 'Jouj commandes.', 'Two different commands: now / at boot.']],
    [{ t: ['Maintenant', 'Daba', 'Now'], b: ['`isolate` change de cible immédiatement (gdm s\'arrête).', '`isolate`.', '`isolate` switches immediately.'], code: 'systemctl isolate multi-user.target' },
     { t: ['Au démarrage', 'F démarrage', 'At boot'], b: ['`set-default` remplace le lien default.target.', '`set-default`.', '`set-default` replaces default.target.'], code: 'systemctl set-default multi-user.target\nsystemctl get-default\nls -l /etc/systemd/system/default.target' }],
    ['`isolate multi-user.target` + `set-default multi-user.target` ; `get-default` affiche multi-user.target.', 'isolate + set-default.', '`isolate multi-user.target` + `set-default multi-user.target`.'],
    [['Faire seulement set-default et croire que c\'est immédiat.', 'Ghir set-default.', 'Only set-default, thinking it is immediate.'], ['Faire seulement isolate : retour au graphique au reboot.', 'Ghir isolate.', 'Only isolate: back to GUI at reboot.']], { missionId: 'm-systemd-target' }),
  ex('lx-sd-2', 3, ['Service personnalisé de bout en bout', 'Service kaml', 'End-to-end custom service'],
    ['Crée un service `hello` qui exécute `/usr/local/bin/hello.sh`, démarré automatiquement en mode multi-utilisateur. Donne le fichier d\'unité, les commandes et les vérifications. Que se passe-t-il si on oublie `chmod +x` ?', 'Dir service `hello` → `/usr/local/bin/hello.sh`, automatique. Chnou ywqe3 bla `chmod +x` ?', 'Create a `hello` service running `/usr/local/bin/hello.sh`, started automatically in multi-user mode. Give the unit file, commands, checks. What if you forget `chmod +x`?'],
    [['Trois sections dans l\'unité.', '3 sections.', 'Three sections in the unit.'], ['systemd doit relire ses unités.', 'daemon-reload.', 'systemd must reload units.']],
    [{ t: ['Script', 'Script', 'Script'], b: ['Créer et rendre exécutable.', 'Dir w chmod +x.', 'Create and make executable.'], code: 'echo -e \'#!/bin/bash\\necho hello\' > /usr/local/bin/hello.sh\nchmod +x /usr/local/bin/hello.sh' },
     { t: ['Unité', 'Unité', 'Unit'], b: ['/etc/systemd/system/hello.service', '/etc/systemd/system/hello.service', '/etc/systemd/system/hello.service'], code: '[Unit]\nDescription=Hello\n\n[Service]\nExecStart=/usr/local/bin/hello.sh\n\n[Install]\nWantedBy=multi-user.target' },
     { t: ['Activer et vérifier', 'Activer w tsdi9', 'Enable and check'], b: ['Sans `chmod +x` : échec « Permission denied » visible dans `journalctl -u hello`.', 'Bla chmod +x : Permission denied.', 'Without `chmod +x`: "Permission denied" in `journalctl -u hello`.'], code: 'systemctl daemon-reload\nsystemctl enable --now hello\nsystemctl status hello\njournalctl -u hello' }],
    ['Unité [Unit]/[Service]/[Install] + daemon-reload + enable --now ; sans +x → failed (Permission denied).', 'daemon-reload + enable --now.', 'Unit + daemon-reload + enable --now; without +x → failed (Permission denied).'],
    [['Oublier daemon-reload → « Unit hello.service not found ».', 'Tnsa daemon-reload.', 'Forgetting daemon-reload → "Unit not found".'], ['Mettre le fichier dans /usr/lib/systemd/system (réservé aux paquets).', 'F /usr/lib (dyal paquets).', 'Putting it in /usr/lib/systemd/system (for packages).']], { missionId: 'm-systemd-service' }),
  ex('lx-sd-3', 2, ['Interdire un service', 'Mna3 service', 'Forbid a service'],
    ['La politique de sécurité interdit Bluetooth. Fais en sorte qu\'il soit arrêté, désactivé et **impossible à démarrer**, même par erreur. Quelle commande annule ?', 'Bluetooth mamnou3. Wa9fo w khallih **ma ymkench ybda**.', 'Security policy forbids Bluetooth. Stop it, disable it, make it **impossible to start**. What undoes it?'],
    [['disable ne suffit pas.', 'disable ma kafich.', 'disable is not enough.']],
    [{ t: ['Arrêter et masquer', 'W9ef w mask', 'Stop and mask'], b: ['`mask` pointe l\'unité vers /dev/null.', 'mask → /dev/null.', 'mask links the unit to /dev/null.'], code: 'systemctl stop bluetooth\nsystemctl mask bluetooth\nsystemctl start bluetooth   # → Unit bluetooth.service is masked.' },
     { t: ['Annuler', 'Lghi', 'Undo'], b: ['`unmask`.', '`unmask`.', '`unmask`.'], code: 'systemctl unmask bluetooth' }],
    ['`systemctl stop bluetooth` + `systemctl mask bluetooth` ; `unmask` pour annuler.', 'stop + mask ; unmask.', 'stop + mask; unmask to undo.'],
    [['Se contenter de disable (un start reste possible).', 'Ghir disable.', 'Only disable (start still possible).']]),
  ex('lx-sd-4', 3, ['Enquête dans le journal', 'Bahth f journal', 'Journal investigation'],
    ['Quelqu\'un tente de se connecter en root via SSH. Retrouve dans le journal du démarrage courant les échecs d\'authentification de sshd, puis les 5 dernières erreurs du système, au format court puis en JSON.', 'Chi wa7ed kayjereb root b SSH. Qelleb f journal.', 'Someone tries to log in as root via SSH. Find sshd authentication failures in this boot\'s journal, then the last 5 system errors, short then JSON.'],
    [['Combine -b et -u, puis filtre avec grep.', '-b -u w grep.', 'Combine -b and -u, then grep.']],
    [{ t: ['Échecs sshd', 'Échecs sshd', 'sshd failures'], b: ['`-b -u sshd` puis `grep Failed`.', '`grep Failed`.', '`-b -u sshd` then `grep Failed`.'], code: 'journalctl -b -u sshd | grep Failed' },
     { t: ['Dernières erreurs', 'Erreurs lekhrin', 'Last errors'], b: ['`-p err -n 5`, puis `-o json-pretty`.', '`-p err -n 5`.', '`-p err -n 5`, then `-o json-pretty`.'], code: 'journalctl -p err -n 5\njournalctl -p err -n 5 -o json-pretty' }],
    ['`journalctl -b -u sshd | grep Failed` ; `journalctl -p err -n 5 [-o json-pretty]`.', 'journalctl -b -u sshd ; -p err -n 5.', '`journalctl -b -u sshd | grep Failed`; `journalctl -p err -n 5 [-o json-pretty]`.'],
    [['Confondre -n (nombre) et -b (boot).', 'Tkhalt -n w -b.', 'Confusing -n and -b.'], ['Croire que -p err exclut crit/alert.', '-p err fih crit.', 'Thinking -p err excludes crit/alert.']])
];

export const flashcards = [
  fc('fc-sd-1', ['PID de systemd ?', 'PID systemd ?', 'systemd PID?'], ['1 (`ps aux | head -2`).', '1.', '1.']),
  fc('fc-sd-2', ['set-default vs isolate ?', 'set-default vs isolate ?', 'set-default vs isolate?'], ['set-default : prochain démarrage (lien default.target). isolate : immédiat.', 'Boot vs daba.', 'Next boot (link) vs now.']),
  fc('fc-sd-3', ['multi-user / graphical = quels runlevels ?', 'Runlevels ?', 'Runlevels?'], ['multi-user = 3, graphical = 5 (rescue 1, poweroff 0, reboot 6).', '3 / 5.', '3 / 5.']),
  fc('fc-sd-4', ['enable vs start ?', 'enable vs start ?', 'enable vs start?'], ['enable : au démarrage (lien .wants) ; start : maintenant. `enable --now` = les deux.', 'Boot vs daba ; --now.', 'Boot vs now; `--now` both.']),
  fc('fc-sd-5', ['mask ?', 'mask ?', 'mask?'], ['Lien vers /dev/null : impossible de démarrer le service. unmask annule.', '/dev/null ; unmask.', 'Link to /dev/null: cannot start. unmask undoes.']),
  fc('fc-sd-6', ['reload vs restart ?', 'reload vs restart ?', 'reload vs restart?'], ['reload relit la config sans arrêter ; restart arrête puis relance.', 'reload bla wa9f ; restart.', 'reload re-reads config; restart stops and starts.']),
  fc('fc-sd-7', ['Unités en échec ?', 'Unités fchlou ?', 'Failed units?'], ['`systemctl --failed`', '`systemctl --failed`', '`systemctl --failed`']),
  fc('fc-sd-8', ['journalctl -b / -f / -u / -p ?', 'journalctl options ?', 'journalctl options?'], ['Depuis le boot / suivre / unité / priorité.', 'Boot / tba3 / unité / priorité.', 'This boot / follow / unit / priority.']),
  fc('fc-sd-9', ['Priorités err, warning, info ?', 'Priorités ?', 'Priorities?'], ['err = 3, warning = 4, info = 6 (0 emerg … 7 debug).', '3, 4, 6.', '3, 4, 6.']),
  fc('fc-sd-10', ['Sections d\'un .service ?', 'Sections .service ?', '.service sections?'], ['[Unit] Description · [Service] ExecStart · [Install] WantedBy=multi-user.target', '[Unit] [Service] [Install]', '[Unit] [Service] [Install]']),
  fc('fc-sd-11', ['Après avoir créé un .service ?', 'Mor .service ?', 'After creating a .service?'], ['`systemctl daemon-reload` puis `enable --now`.', 'daemon-reload → enable --now.', '`daemon-reload` then `enable --now`.']),
  fc('fc-sd-12', ['Analyser le temps de boot ?', 'Temps boot ?', 'Analyse boot time?'], ['`systemd-analyze`, `blame`, `critical-chain`.', 'systemd-analyze blame.', '`systemd-analyze blame` / `critical-chain`.']),
  fc('fc-sd-13', ['Où mettre ses propres unités ?', 'Fin unités dyalek ?', 'Where do your own units go?'], ['/etc/systemd/system/ (/usr/lib/systemd/system/ = paquets).', '/etc/systemd/system/.', '/etc/systemd/system/.'])
];

export const reference = [
  ref('r-sd-1', 'systemctl get-default · set-default T · isolate T', ['Cible par défaut / changer au boot / maintenant', 'Target', 'Default target / set for boot / now']),
  ref('r-sd-2', 'systemctl list-units --type target · --failed', ['Lister les cibles · unités en échec', 'Lister', 'List targets · failed units']),
  ref('r-sd-3', 'systemctl list-unit-files --type=service', ['Services et leur état enable/disable', 'Services', 'Services and enablement']),
  ref('r-sd-4', 'systemctl start|stop|restart|reload S', ['Agir maintenant', 'Daba', 'Act now']),
  ref('r-sd-5', 'systemctl enable|disable [--now] S', ['Au démarrage (--now : aussi maintenant)', 'F démarrage', 'At boot (--now: also now)']),
  ref('r-sd-6', 'systemctl status · is-active · is-enabled S', ['État détaillé / actif ? / activé ?', 'Status', 'State / active? / enabled?']),
  ref('r-sd-7', 'systemctl mask|unmask S', ['Interdire / réautoriser le démarrage', 'Mna3 / rjje3', 'Forbid / allow start']),
  ref('r-sd-8', 'systemctl daemon-reload', ['Relire les fichiers d\'unités', '3awed 9ra unités', 'Reload unit files']),
  ref('r-sd-9', 'systemctl kill S', ['Envoyer un signal aux processus du service', 'Signal', 'Signal the service processes']),
  ref('r-sd-10', 'journalctl -b [-1]', ['Journal du démarrage courant / précédent', 'Journal dyal boot', 'Current / previous boot journal']),
  ref('r-sd-11', 'journalctl -f · -u S · -n N', ['Suivre · une unité · N lignes', 'Tba3 · unité · N', 'Follow · unit · N lines']),
  ref('r-sd-12', 'journalctl -p err|warning|info', ['Filtrer par priorité', 'Priorité', 'Filter by priority']),
  ref('r-sd-13', 'journalctl --since "1 hour ago"', ['Depuis une date', 'Mn date', 'Since a time']),
  ref('r-sd-14', 'journalctl -o json|json-pretty|cat|verbose', ['Format de sortie', 'Format', 'Output format']),
  ref('r-sd-15', 'systemd-analyze [blame|critical-chain]', ['Temps de démarrage', 'Temps boot', 'Boot time']),
  ref('r-sd-16', '[Unit] [Service] ExecStart= [Install] WantedBy=', ['Fichier .service minimal', '.service', 'Minimal .service']),
  ref('r-sd-17', 'runlevel · telinit N', ['Anciennes commandes SysV', 'SysV', 'Legacy SysV commands']),
  ref('r-sd-18', 'ps aux | head -2', ['Voir le PID 1', 'PID 1', 'See PID 1'])
];
