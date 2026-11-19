/** Oral coach — « rm -rf / — The Most Dangerous Line », Fayssal's part (slides 9 → 12). Script = source of truth (revised: natural, professional delivery). */

export interface Sentence {
  en: string;
  dar: string;
  fr: string;
  idea?: string;
  /** cautious version (press details removed) */
  safe?: string;
}
export interface Slide {
  n: number;
  title: string;
  keywords: string[];
  cues: string;
  sentences: Sentence[];
}

const s = (en: string, dar: string, fr: string, idea?: string, safe?: string): Sentence => ({ en, dar, fr, idea, safe });

export const SLIDES: Slide[] = [
  {
    n: 9,
    title: '05 Real-World Incidents',
    keywords: ['Pixar', '1998', '90%', 'copy', 'home', 'Steam', '2015', 'variable', 'empty', 'GitLab', '2017', 'wrong', 'server', '300', 'GB', '6', 'hours'],
    cues: 'Pixar 1998 → 90 % → copie à la maison · Steam 2015 → variable vide · GitLab 2017 → mauvais serveur → 300 GB / 6 h',
    sentences: [
      s('Now, you might be thinking: who would ever type this command by accident?', 'Daba ymken katgoulou : chkoun ghadi yktb had commande b ghalat ?', 'Vous vous dites peut-être : qui taperait cette commande par accident ?', 'Qui ferait ça par erreur ?'),
      s('Well, it has happened, and not only to beginners.', 'Walakin w9e3at, w machi ghir l mobtadi2in.', 'Eh bien, c’est arrivé, et pas seulement à des débutants.', 'C’est arrivé'),
      s('It has happened to some of the biggest companies in tech.', 'W9e3at l chi mn akbar charikat f tech.', 'C’est arrivé à certaines des plus grandes entreprises de la tech.', 'Même aux grandes entreprises'),
      s("Let's start with Pixar, in 1998.", 'Nbdaw b Pixar, f 1998.', 'Commençons par Pixar, en 1998.'),
      s('The team was in the middle of making Toy Story 2.', 'L équipe kanet f west l khedma 3la Toy Story 2.', 'L’équipe était en pleine production de Toy Story 2.'),
      s('Someone ran a delete command on one of their servers, and the movie files started disappearing, one after another.', 'Chi wa7ed lança commande dyal suppression 3la wa7ed serveur, w les fichiers dyal l film bdaw kayt7ydo wa7ed mor wa7ed.', 'Quelqu’un a lancé une commande de suppression sur un serveur, et les fichiers du film ont commencé à disparaître, les uns après les autres.', 'Les fichiers disparaissent'),
      s('Within minutes, about 90% of the film was gone.', 'F d9aye9, ta9riban 90% mn l film mcha.', 'En quelques minutes, environ 90 % du film avait disparu.', 'Pixar a presque perdu le film'),
      s('So why do we still have Toy Story 2 today?', 'Iwa 3lach baqi 3andna Toy Story 2 lyoum ?', 'Alors pourquoi a-t-on encore Toy Story 2 aujourd’hui ?'),
      s('Because one employee had a copy of the project on her computer at home.', '7it wa7da mn l employés kan 3andha copie dyal l projet f l PC dyalha f dar.', 'Parce qu’une employée avait une copie du projet sur son ordinateur, chez elle.', 'Une copie à la maison', 'Because a copy kept outside the studio saved the movie.'),
      s('That one copy saved the whole film.', 'Dik l copie wa7da hiya li 3t9at l film kamel.', 'Cette seule copie a sauvé tout le film.'),
      s('Next, Steam, in 2015.', 'Mn b3d, Steam, f 2015.', 'Ensuite, Steam, en 2015.'),
      s('A small bug slipped into an update script.', 'Bug sghir dkhel f script dyal mise à jour.', 'Un petit bug s’est glissé dans un script de mise à jour.'),
      s('One variable was empty, so the command ended up meaning: delete everything.', 'Wa7d l variable kanet khawya, donc l commande wellat kat3ni : ms7 kolchi.', 'Une variable était vide, donc la commande revenait à dire : supprime tout.', 'Variable vide = tout supprimer'),
      s('For some users, it wiped every file they owned.', '3and chi users, ms7at ga3 les fichiers dyalhom.', 'Chez certains utilisateurs, elle a effacé tous leurs fichiers.'),
      s('And finally, GitLab, in 2017.', 'W f lekher, GitLab, f 2017.', 'Et enfin, GitLab, en 2017.'),
      s('An engineer was working late at night and ran rm -rf on the wrong server.', 'Wa7d l ingénieur kan khddam m3ttel f lil w dar rm -rf 3la serveur ghalet.', 'Un ingénieur travaillait tard la nuit et a lancé rm -rf sur le mauvais serveur.', 'Mauvais serveur'),
      s('About 300 GB of data were deleted in seconds.', 'Ta9riban 300 GB dyal data tms7at f thawani.', 'Environ 300 Go de données ont été supprimés en quelques secondes.'),
      s('And around 6 hours of user data were lost for good.', 'W ta9riban 6 swaye3 dyal data dyal users da3o l dima (for good = nihā2iyan).', 'Et environ 6 heures de données utilisateurs ont été perdues définitivement.', '6 h perdues pour toujours'),
      s('So this is not just a joke on the internet.', 'Donc hadi machi ghir blague f internet.', 'Ce n’est donc pas juste une blague d’internet.'),
      s('It really happens, to real teams.', 'Kat w9e3 b s7, l équipes 7a9i9iyin.', 'Ça arrive vraiment, à de vraies équipes.')
    ]
  },
  {
    n: 10,
    title: '06 Consequences',
    keywords: ['No', 'such', 'file', 'directory', 'four', 'data', 'backup', 'stops', 'servers', 'down', 'money', 'trusting', 'hardest'],
    cues: '« No such file or directory » → 4 : data · downtime · money · trust (le plus dur)',
    sentences: [
      s('So, what actually happens after a command like this?', 'Iwa, chno kayw9e3 b s7 mn b3d commande b7al hadi ?', 'Alors, que se passe-t-il concrètement après une telle commande ?', 'Transition'),
      s('You open the terminal, you try to reach your files, and Linux simply answers: No such file or directory.', 'Kat7el terminal, katjarreb tousel l les fichiers dyalek, w Linux kayjawbek ghir : No such file or directory.', 'Vous ouvrez le terminal, vous essayez d’accéder à vos fichiers, et Linux répond simplement : No such file or directory.', 'Le chemin n’existe plus'),
      s('Everything is gone.', 'Kolchi mcha.', 'Tout a disparu.'),
      s('And the damage comes in four forms.', 'W d-dorr kayji f 4 dyal l achkal.', 'Et les dégâts prennent quatre formes.'),
      s('First, data loss.', 'Lewla, data kat-di3.', 'Premièrement, la perte de données.', 'Perte de données'),
      s('Without a backup, those files are gone forever.', 'Bla backup, dok les fichiers mchaw l dima.', 'Sans sauvegarde, ces fichiers sont perdus pour toujours.'),
      s('Second, downtime: everything stops.', 'Tanya, downtime : kolchi kaywe9ef.', 'Deuxièmement, l’indisponibilité : tout s’arrête.', 'Downtime'),
      s('The servers stay down until someone rebuilds the system.', 'Les serveurs kayb9aw wa9fin 7ta chi wa7d y3awd ybni système.', 'Les serveurs restent à l’arrêt jusqu’à ce que quelqu’un reconstruise le système.'),
      s('Third, it costs money.', 'Talta, kayklef flous.', 'Troisièmement, ça coûte de l’argent.', 'Coût financier'),
      s('Lost work, hours spent on recovery, and sometimes customers who leave.', 'Khedma mchat, swaye3 f l récupération, w ba3d lmrat clients kaymchiw.', 'Du travail perdu, des heures de récupération, et parfois des clients qui partent.'),
      s('And fourth, people stop trusting you.', 'W rab3a, nas kay7ebsou ma ythi9ouch fik.', 'Et quatrièmement, les gens arrêtent de vous faire confiance.', 'Perte de confiance'),
      s('Honestly, that is the hardest one to rebuild.', 'B sra7a, hadi hiya s3ib wa7da t3awd tbniha.', 'Honnêtement, c’est la plus difficile à reconstruire.')
    ]
  },
  {
    n: 11,
    title: '07 Prevention',
    keywords: ['six', 'habits', 'backups', '3', '2', '1', 'restore', 'pwd', 'ls', 'rm', '-i', 'root', 'sudo', 'trash'],
    cues: '6 habitudes : 3-2-1 backups · pwd && ls · rm -i · --preserve-root · sudo · trash-put',
    sentences: [
      s('The good news is that protecting yourself is easy.', 'L khbar lmzyan howa anaho sahel t7mi rasek.', 'La bonne nouvelle, c’est qu’il est facile de se protéger.', 'Transition'),
      s('It comes down to six simple habits.', 'Kolchi kayrje3 l 6 d l3adat sahlin.', 'Cela se résume à six habitudes simples.'),
      s('One: make backups.', 'Wa7d : dir backups.', 'Un : faites des sauvegardes.', 'Sauvegardes'),
      s('Follow the 3-2-1 rule: 3 copies, on 2 different types of storage, with 1 kept off-site.', 'Tb3 l 9a3ida 3-2-1 : 3 copies, 3la 2 anwa3 dyal stockage, w 1 f blasa okhra.', 'Suivez la règle 3-2-1 : 3 copies, sur 2 types de support, dont 1 hors site.', 'Règle 3-2-1'),
      s('And test that you can actually restore them.', 'W jarreb bli t9der t3awd tjibhom (restore) b s7.', 'Et testez que vous pouvez vraiment les restaurer.'),
      s('Two: look before you delete.', 'Jouj : chouf 9bel ma tms7.', 'Deux : regardez avant de supprimer.'),
      s('Type pwd to check where you are, and ls to see what is there.', 'Ktb pwd bach tchouf fin nta, w ls bach tchouf chno kayn.', 'Tapez pwd pour vérifier où vous êtes, et ls pour voir ce qu’il y a.', 'pwd + ls'),
      s('Three: use rm -i.', 'Tlata : khdem b rm -i.', 'Trois : utilisez rm -i.'),
      s('Linux will ask you to confirm before it deletes each file.', 'Linux ghadi ytleb mnek t2akked 9bel ma yms7 kol fichier.', 'Linux vous demandera de confirmer avant de supprimer chaque fichier.', 'Confirmation'),
      s('Four: keep the root protection on.', 'Reb3a : khelli l protection dyal root khddama.', 'Quatre : gardez la protection de la racine activée.'),
      s('By default, Linux already refuses to delete /, so leave it that way.', 'Par défaut, Linux deja kayrfod yms7 /, khelliha hakka.', 'Par défaut, Linux refuse déjà de supprimer /, alors laissez-le ainsi.', '--preserve-root'),
      s("Five: don't work as root all the time.", 'Khamsa : ma tkhdemch b root dima.', 'Cinq : ne travaillez pas en root en permanence.', 'Least privilege'),
      s('Use sudo only when you really need it.', 'Khdem b sudo ghir mli t7tajo b s7.', 'Utilisez sudo seulement quand c’est vraiment nécessaire.'),
      s('Six: use a trash bin.', 'Stta : khdem b corbeille (trash).', 'Six : utilisez une corbeille.', 'trash-put'),
      s('That way, if you delete something by mistake, you can still get it back.', 'Hakka, ila ms7ti chi 7aja b ghalat, t9der trejje3ha.', 'Ainsi, si vous supprimez quelque chose par erreur, vous pouvez encore le récupérer.')
    ]
  },
  {
    n: 12,
    title: '08 Conclusion',
    keywords: ['one', 'thing', 'exactly', 'wrong', 'power', 'responsibility', 'root', 'backups', 'Pixar', 'habits', 'Check', 'confirm', 'Enter', 'think'],
    cues: 'Linux fait exactement ce que tu dis → pouvoir = responsabilité · backups · habitudes → think before Enter',
    sentences: [
      s('If you remember only one thing from this presentation, let it be this: Linux does exactly what you tell it, even when you are wrong.', 'Ila t9iyyedto ghir 7aja wa7da mn had l présentation, khelliha tkoun hadi : Linux kaydir bdbt dakchi li golti lih, 7ta ila kenti ghalet.', 'Si vous ne retenez qu’une chose de cette présentation, retenez ceci : Linux fait exactement ce que vous lui dites, même quand vous avez tort.', 'Linux obéit même à l’erreur'),
      s('That leaves us with three lessons.', 'Hadchi kaykhllina b tlata d drous.', 'Cela nous laisse trois leçons.'),
      s('One: more power means more responsibility.', 'Wa7d : ktar d l pouvoir = ktar d l mas2ouliya.', 'Un : plus de pouvoir, c’est plus de responsabilité.', 'Pouvoir = responsabilité'),
      s('With root access, one short command can wipe everything in seconds.', 'B accès root, commande sghira t9der tms7 kolchi f thawani.', 'Avec un accès root, une courte commande peut tout effacer en quelques secondes.'),
      s('Two: backups save you.', 'Jouj : backups kay3t9ouk.', 'Deux : les sauvegardes vous sauvent.', 'Backups = filet de sécurité'),
      s('In every story we saw today, the backup made the difference.', 'F ga3 l 9issas li chefna lyoum, backup hiya li far9at.', 'Dans chaque histoire vue aujourd’hui, la sauvegarde a fait la différence.'),
      s('Pixar is the perfect example.', 'Pixar howa a7ssen mithal.', 'Pixar en est l’exemple parfait.'),
      s('Three: good habits save you too.', 'Tlata : l3adat lmzyanin 7ta homa kay3t9ouk.', 'Trois : les bonnes habitudes vous sauvent aussi.', 'Bonnes habitudes'),
      s('Check, confirm, and only then press Enter.', 'T2akked, confirmi, w 3ad brek 3la Enter.', 'Vérifiez, confirmez, et seulement ensuite appuyez sur Entrée.'),
      s('So next time your finger is on the Enter key, take one second to think.', 'Lmerra jaya mli ykoun sb3ek 3la Enter, khod tanya wa7da w fekker.', 'Alors la prochaine fois que votre doigt est sur la touche Entrée, prenez une seconde pour réfléchir.', 'Réfléchir avant Enter'),
      s("Thank you. We're happy to take your questions.", 'Choukran. Mr7ba b les questions dyalkom.', 'Merci. Nous répondons volontiers à vos questions.')
    ]
  }
];

export const TRANSITIONS = ['Now, you might be thinking…', 'So, what actually happens after a command like this?', 'The good news is that protecting yourself is easy.', 'If you remember only one thing from this presentation…', "Thank you. We're happy to take your questions."];

/** Technical explanations: [title, dar, fr, en] */
export const TECH: [string, string, string, string][] = [
  ['rm -r -f /', 'rm = remove (ms7). -r = récursif : dossier w kolchi li fih. -f = force : bla sou2al, bla message d erreur. / = racine, dossier li fih KOLCHI.', 'rm = supprimer. -r = récursif (dossiers + contenu). -f = force (aucune question, aucune erreur). / = la racine, qui contient tout.', 'rm = remove. -r = recursive. -f = force (no prompt, no error). / = root, contains everything.'],
  ['Bug Steam : rm -rf "$STEAMROOT/"*', 'Ila $STEAMROOT khawya, l commande katwelli rm -rf "/"* → kayms7 kolchi li 3and l user l7e9 yms7o.', 'Si $STEAMROOT est vide, la commande devient rm -rf "/"* → tout ce que l’utilisateur peut effacer.', 'If $STEAMROOT is empty it becomes rm -rf "/"* → everything the user can delete.'],
  ['--preserve-root', 'Par défaut f GNU rm : kayrfod rm -rf /. Bach tforci khassek --no-preserve-root. 3MRK DIRHA.', 'Par défaut dans GNU rm : refuse rm -rf /. Il faut --no-preserve-root pour forcer. Ne jamais le faire.', 'Default in GNU rm: refuses rm -rf /. Needs --no-preserve-root to force. Never do it.'],
  ['Règle 3-2-1', '3 copies, 2 anwa3 d support, 1 barra (hors site). Backup 3mrek ma restoritih = ma kaynach.', '3 copies, 2 types de support, 1 hors site. Une sauvegarde jamais restaurée ne compte pas.', '3 copies, 2 media types, 1 off-site. An untested backup does not count.'],
  ['pwd · ls · rm -i · sudo · trash-put', 'pwd = fin nta. ls = lista d fichiers. rm -i = kaysowlek 9bel. sudo = commande b droits admin. Least privilege = a9al droits. trash-put (trash-cli) = kaysift l corbeille.', 'pwd = dossier courant. ls = lister. rm -i = interactif. sudo = exécuter en admin. Least privilege = droits minimum. trash-put = envoie à la corbeille.', 'pwd = where you are. ls = list. rm -i = interactive. sudo = run as admin. Least privilege = minimum rights. trash-put = send to trash.'],
  ['No such file or directory', 'Message kayji mli l chemin ma b9ach kayn.', 'Message d’erreur quand le chemin n’existe plus.', 'Error when the path no longer exists.'],
  ['Downtime · Production database', 'Downtime = wa9t li service wa9ef. Production database = l base l7a9i9iya dyal clients, machi copie test.', 'Downtime = temps d’arrêt. Production database = la vraie base des clients, pas un test.', 'Downtime = service outage. Production DB = the real customer database.'],
  ['Expressions', 'for good = l dima (machi « pour le bien ») · That’s it = ghir hadchi · basically = f l2assas · wipe = ms7 kolchi · safety net = filet de sécurité.', 'for good = pour toujours · That’s it = c’est tout · basically = en gros · wipe = effacer complètement · safety net = filet de sécurité.', 'for good = forever · That’s it · basically · wipe = erase fully · safety net.']
];

export const FACTS = [
  'Pixar 1998 : une commande de suppression a effacé environ 90 % des fichiers de Toy Story 2 ; une copie chez une employée qui travaillait depuis chez elle a permis de récupérer le film.',
  'Steam for Linux, janvier 2015 : le script de lancement contenait rm -rf "$STEAMROOT/"* ; avec la variable vide, tous les fichiers de l’utilisateur ont été supprimés.',
  'GitLab, 31 janvier 2017 : un ingénieur, tard dans la nuit, a supprimé environ 300 GB de données de production sur le mauvais serveur ; environ 6 heures de données perdues.',
  '⚠️ « copie chez elle » et « travaillait tard » = détails de presse. Active « version prudente » pour les retirer.'
];

/** [word, IPA, kifach tgoulha (accent in CAPS), typical error] */
export const LEXICON: [string, string, string, string][] = [
  ['Linux', '/ˈlɪnəks/', 'LI-nuks', 'li-NUX à la française'],
  ['Pixar', '/ˈpɪksɑːr/', 'PIK-sar', 'pik-SAR'],
  ['server', '/ˈsɜːrvər/', 'SEUR-veur', '« serveur » français'],
  ['data', '/ˈdeɪtə/', 'DEY-ta', 'da-TA'],
  ['variable', '/ˈveəriəbl/', 'VÈ-ri-a-bel', 'va-ri-A-bl'],
  ['engineer', '/ˌendʒɪˈnɪər/', 'en-dji-NIR', '« ingénieur »'],
  ['deleted', '/dɪˈliːtɪd/', 'di-LI-tid', 'dé-lé-té'],
  ['directory', '/dəˈrektəri/', 'di-REK-to-ri', 'plat, sans accent'],
  ['database', '/ˈdeɪtəbeɪs/', 'DEY-ta-beys', 'data-baz'],
  ['consequences', '/ˈkɒnsɪkwənsɪz/', 'KON-si-kwen-siz', 'con-sé-quence'],
  ['financial', '/faɪˈnænʃl/', 'fay-NAN-chel', 'fi-nan-cial'],
  ['privilege', '/ˈprɪvəlɪdʒ/', 'PRI-vi-lidj', 'pri-vi-lège'],
  ['responsibility', '/rɪˌspɒnsəˈbɪləti/', 'ri-spon-si-BI-li-ti', 'accent mal placé'],
  ['honestly', '/ˈɒnɪstli/', 'O-nist-li (h muet)', 'prononcer le h'],
  ['hours', '/ˈaʊərz/', 'A-weurz (h muet)', 'prononcer le h'],
  ['hurts', '/hɜːrts/', 'h aspiré : HEURTS', 'supprimer le h'],
  ['happens', '/ˈhæpənz/', 'HA-penz (h aspiré)', 'supprimer le h'],
  ['hardest', '/ˈhɑːrdɪst/', 'HAR-dist (h aspiré)', 'supprimer le h'],
  ['think', '/θɪŋk/', 'langue entre les dents : θink', '« sink »'],
  ['things', '/θɪŋz/', 'θingz', '« sings »'],
  ['three', '/θriː/', 'θri', '« tree »'],
  ['that', '/ðæt/', 'ðat (voisé, langue entre les dents)', '« zat »'],
  ['the', '/ðə/', 'ðe', '« de »'],
  ['they', '/ðeɪ/', 'ðey', '« dey »'],
  ['restore', '/rɪˈstɔːr/', 'ri-STOR', '—'],
  ['sudo', '/ˈsuːduː/', 'SOU-dou', 'su-do'],
  ['GB', 'gigabytes', 'GI-ga-bayts', '« G-B » / « gigaoctets »'],
  ['rm -rf', 'R-M dash R-F', 'ar-èm dach ar-èf', 'lire « rm » comme un mot'],
  ['rm -i', 'R-M dash I', 'ar-èm dach ay', '« dach i » français'],
  ['pwd', 'P-W-D', 'pi-dobel-you-di', '—'],
  ['ls', 'L-S', 'èl-ès', '—'],
  ['root', '/ruːt/', 'ROUT', '« route » français'],
  ['slash', '/slæʃ/', 'slach', '—']
];

/** [question, model answer, darija explanation, expected keywords] */
export const QA: [string, string, string, string[]][] = [
  ['What is the difference between rm -r and rm -rf?', '-f forces: no confirmation and no error messages.', '-f = force : ma kaysowlekch w ma kaywerrikch erreurs.', ['force', 'confirmation', 'error']],
  ['Can you recover files after rm?', 'Not with a simple undo. rm does not use the trash. You need a backup; recovery tools sometimes help, but there is no guarantee.', 'La, rm ma kaydouzch l corbeille. Khassek backup ; outils de récupération ymken, walakin bla garantie.', ['backup', 'trash', 'recovery']],
  ['What does --preserve-root do?', 'It makes rm refuse to delete /. It is on by default in GNU rm.', 'Kaykhelli rm yrfod yms7 /. Par défaut f GNU rm.', ['refuse', 'default', 'root']],
  ['Why did the Steam bug delete user files?', 'An empty variable turned the path into /.', 'Variable khawya rddat l chemin /.', ['empty', 'variable']],
  ['How did GitLab recover?', 'From a backup copy that was about 6 hours old, so they lost around 6 hours of data.', 'Mn backup 9dim b 6 swaye3, donc dey3o 6 swaye3 d data.', ['backup', 'six', 'hours']],
  ['What is the 3-2-1 rule?', 'Three copies of your data, on two different types of storage, with one copy off-site.', '3 copies, 2 supports, 1 barra.', ['three', 'two', 'one', 'copies']],
  ['Why not always work as root?', 'Least privilege: a mistake as root can destroy the whole system.', 'A9al droits : ghalta b root t9der t5errej système kaml.', ['privilege', 'mistake', 'system']],
  ['What does sudo do?', 'It runs one command with administrator rights, only when needed.', 'Kaydir commande wa7da b droits admin, ghir mli t7taj.', ['command', 'administrator', 'root']],
  ['Why not use rm -i all the time?', "You can set alias rm='rm -i', but don't rely on it. Backups stay essential.", 'T9der dir alias, walakin ma tetekelch 3lih ; backups darourin.', ['alias', 'backups']],
  ['What is trash-put?', 'A command from trash-cli that moves files to the trash instead of deleting them.', 'Commande mn trash-cli kaysift l corbeille fblast ma yms7.', ['trash', 'instead']],
  ['Is rm -rf / still dangerous today if Linux protects the root?', 'Yes. rm -rf /*, --no-preserve-root, the wrong folder or an empty variable still cause disasters.', 'Iyeh : rm -rf /*, --no-preserve-root, dossier ghalet, variable khawya.', ['yes', 'variable', 'folder']],
  ['What is downtime?', 'The time when a service is not available to users.', 'L wa9t li service ma khddamch.', ['time', 'service', 'available']],
  ['Which consequence is the worst, in your opinion?', 'Loss of trust, because you can buy new servers and restore data, but trust takes a long time to rebuild.', 'Fo9dan thi9a : servers t9der techrihom, thi9a s3ib trej3ha.', ['trust']],
  ['Give one habit you personally use before deleting something.', 'I always type pwd and ls first, to check where I am and what I am deleting.', 'Dima kandir pwd w ls 9bel.', ['pwd', 'ls', 'check']],
  ['What would you do right after running rm -rf by mistake on a server?', "Stop, don't write anything new to the disk, alert the team, and restore from backup.", '7bes, ma tktebch f disque, 3lem l équipe, restore mn backup.', ['stop', 'team', 'backup', 'disk']]
];

/** Quiz: [question, options, correct index] */
export const QUIZ: [string, string[], number][] = [
  ['Pixar incident year?', ['1995', '1998', '2005', '2015'], 1],
  ['Which movie almost got deleted?', ['Cars', 'Toy Story 2', 'Up', 'Shrek'], 1],
  ['How much of the movie was deleted?', ['50%', '75%', '90%', '100%'], 2],
  ['Steam bug year?', ['2012', '2015', '2017', '2019'], 1],
  ['Steam bug cause?', ['Wrong server', 'Empty variable', 'Virus', 'Hacker'], 1],
  ['GitLab incident year?', ['2015', '2016', '2017', '2018'], 2],
  ['How much data did GitLab delete?', ['30 GB', '300 GB', '3 TB', '300 MB'], 1],
  ['How many hours of user data did GitLab lose?', ['1', '6', '12', '24'], 1],
  ['Error shown after deletion?', ['Permission denied', 'No such file or directory', 'Segmentation fault', 'Disk full'], 1],
  ['How many consequences on slide 10?', ['3', '4', '5', '6'], 1],
  ['Hardest consequence to fix?', ['Data loss', 'Downtime', 'Money', 'Loss of trust'], 3],
  ['How many habits on slide 11?', ['4', '5', '6', '7'], 2],
  ['3-2-1: what is the "1"?', ['1 copy off-site', '1 day', '1 admin', '1 disk'], 0],
  ['Command to see where you are?', ['ls', 'pwd', 'cd', 'whoami'], 1],
  ['Command that asks before deleting?', ['rm -f', 'rm -r', 'rm -i', 'rm -v'], 2],
  ['Option that protects / by default?', ['--force', '--preserve-root', '--safe', '--no-preserve-root'], 1],
  ['Command to send a file to the trash?', ['trash-put', 'rm -t', 'mv /dev/null', 'del'], 0],
  ['"for good" means…', ['for the good', 'forever', 'for fun', 'quickly'], 1],
  ['Stressed syllable in "engineer"?', ['EN', 'gi', 'NEER'], 2],
  ['Stressed syllable in "responsibility"?', ['re', 'spon', 'BI', 'ty'], 2],
  ['In "honestly", the h is…', ['aspirated', 'silent'], 1],
  ['Order: first sentence of slide 10?', ['So what happens after?', 'Everything’s gone.', 'And it hurts in four ways.'], 0]
];

export const CHECKLIST = [
  'Parler lentement · tkellem b chwiya',
  'Regarder le public, pas l’écran · chouf f nas machi f l écran',
  'Pointer la slide quand tu cites un chiffre · werri b yddek l ra9m',
  'Respirer entre deux slides · tneffes bin slides',
  'Avoir de l’eau · jib lma',
  'Savoir ta 1re phrase par cœur : « Okay, so you might think… »'
];
export const WARMUP = ['think', 'three', 'that', 'honestly', 'responsibility'];
