# SPEC-PRESENTATION — Module « Coach Oral » : rm -rf / (partie de Fayssal)

> Fichier destiné à **Claude Code**. Ce document **complète `SPEC.md`** (site Rev24).
> - Si le site existe : ajoute ce module en respectant l'architecture existante (contenu dans `src/content/`, i18n FR / Darija latin / EN, PWA, mobile-first).
> - Sinon : construis d'abord `SPEC.md`, puis ce fichier.
>
> Ne demande pas de validation entre les étapes : construis, teste, corrige, continue.

## 0. Contexte

- **Présentation :** « rm -rf / — The Most Dangerous Line ». 13 slides, en **anglais**.
- **Équipe :** EL HARRAK Ilyass, ABAIBAT Fayssal. Encadrante : Ezzahrae. EMSI, 4IIR.
- **Partie de Fayssal = slides 9 → 12 uniquement :**
  - 05 Real-World Incidents
  - 06 Consequences
  - 07 Prevention
  - 08 Lessons Learned & Conclusion
- **Durée visée :** ~45–60 s par slide, ~4 min au total.
- **Objectif du module :** que Fayssal
  - **comprenne** chaque phrase ;
  - **prononce** correctement l'anglais et les termes techniques ;
  - parle **naturellement**, sans réciter ;
  - **réponde aux questions** du jury.
- **Langues de l'interface :**
  - Le script reste en **anglais**, c'est la langue de l'oral.
  - Les explications, les conseils et les traductions sont dans les 3 langues du site, avec la **darija (alphabet latin) par défaut** pour ce module.

Route : `/oral/rm-rf` (et une carte « Coach Oral » sur l'accueil).

---

## 1. Le script officiel (source de vérité — ne pas reformuler)

Afficher chaque slide avec son script, découpé en **phrases** (une phrase = une unité d'entraînement).

### Slide 9 — 05 Real-World Incidents
> Okay, so you might think: "Who would actually type this command by mistake?" Well… it happened. To big companies.
> Pixar, 1998. They were making Toy Story 2. Someone ran a delete command on the server, and the movie files just started disappearing. Around 90% of the movie, gone. The only reason we have Toy Story 2 today? One person had a copy on her computer at home. That's it.
> Steam, 2015. A small bug in an update. One variable was empty, so the command basically said "delete everything". And for some people, it deleted all their files.
> GitLab, 2017. An engineer was working late at night and ran rm -rf on the wrong server. 300 GB of data, deleted. And they lost about 6 hours of user data for good.
> So yeah, it's not just a joke on the internet. It really happens.

### Slide 10 — 06 Consequences
> So what happens after? You open the terminal, you try to open your files, and Linux tells you: "No such file or directory." Everything's gone.
> And it hurts in four ways.
> First, you lose your data. If you don't have a backup, it's gone forever.
> Second, everything stops. The servers are down until someone rebuilds the system.
> Third, it costs money. Lost work, time to fix things, customers leaving.
> And fourth, people stop trusting you. And honestly, that's the hardest one to fix.

### Slide 11 — 07 Prevention
> The good news is it's easy to protect yourself. Just six simple habits.
> One: make backups. Keep 3 copies, on 2 different types of storage, and 1 somewhere else. And check that you can actually restore them.
> Two: look before you delete. Type pwd to see where you are, and ls to see what's there.
> Three: use rm -i. Linux will ask you "are you sure?" before deleting each file.
> Four: don't touch the root protection. Linux already refuses to delete / by default. Just leave it like that.
> Five: don't work as root all the time. Use sudo only when you really need it.
> Six: use a trash bin. That way, if you delete something by mistake, you can still get it back.

### Slide 12 — 08 Conclusion
> So if you remember just one thing from today, it's this: Linux does exactly what you tell it, even when you're wrong.
> Three quick lessons.
> One: more power means more responsibility. With root access, one short command can wipe everything in seconds.
> Two: backups save you. In every story we saw, the backup made the difference. Pixar is the best example.
> Three: good habits save you too. Check, confirm, and then press Enter.
> So next time you're about to press Enter… just think for one second. Thank you!

*(Slide 13 : « Thank You » → $ questions --welcome)*

Contenu visible sur les slides (à reproduire dans les aperçus, §3.1) :

- **Slide 9 :**
  - Timeline 1998 / 2015 / 2017.
  - **PIXAR** · Toy Story 2 · `$ rm -r -f *`
  - **STEAM FOR LINUX** · An empty variable · `$ rm -rf "$STEAMROOT/"*`
  - **GITLAB** · Production database · `$ rm -rf <wrong server>`
- **Slide 10 :**
  - Terminal : `$ ls /home` → `ls: cannot access '/home': No such file or directory`.
  - 4 cartes : Data loss, Downtime, Financial cost, Loss of trust.
- **Slide 11 :** 6 cartes avec une commande chacune.
  - 3-2-1 backups
  - `$ pwd && ls`
  - `$ rm -i file`
  - `--preserve-root`
  - `$ sudo …`
  - `$ trash-put file`
- **Slide 12 :**
  - Citation : « Linux does exactly what you tell it to do — even when it's a mistake. » + `$ think --before "Enter"`.
  - 3 leçons :
    - Power needs responsibility
    - Backups are the real safety net
    - Good habits prevent disasters

Style des aperçus : fond crème `#F4F1EA`, encre `#0E0E12`, rouge danger `#FF3B30`, bleu Linux `#2B4BFF`, vert prévention `#00A86B`, néon terminal `#3DFFA2`, titres Poppins bold, commandes en monospace.

---

## 2. « Fhem chno katgoul » — compréhension (pour chaque phrase)

Pour chaque phrase du script, afficher (dépliable) :

1. **Traduction darija** naturelle, ex. : « Pixar, 1998 : kanou kaydiro Toy Story 2. Chi wa7ed lança commande dyal suppression 3la serveur, w les fichiers dyal l film bdaw kayt7ydo. »
2. **Traduction FR**.
3. **L'idée en 5 mots**, ex. « Pixar a presque perdu le film ».
4. **Explication technique** quand il y en a une.

Explications techniques obligatoires (en darija simple + FR + EN, avec mini-animation) :

- **`rm`** = remove ; **`-r`** = récursif (dossiers + tout ce qu'il y a dedans) ; **`-f`** = force (aucune question, aucun message d'erreur) ; **`/`** = la racine, le dossier qui contient TOUT.
- **Bug Steam** : le script faisait `rm -rf "$STEAMROOT/"*`. Si la variable `$STEAMROOT` est vide, la commande devient `rm -rf "/"*`, donc tout ce que l'utilisateur a le droit d'effacer. Animation : la variable qui se vide et la commande qui se transforme.
- **`--preserve-root`** : comportement par défaut de GNU rm, qui refuse `rm -rf /`. Il faut taper `--no-preserve-root` pour forcer. **Ne jamais le faire.**
- **Règle 3-2-1** : 3 copies, 2 types de support, 1 copie hors site. Une sauvegarde qu'on n'a jamais restaurée ne compte pas.
- **`pwd`** (print working directory), **`ls`** (list), **`rm -i`** (interactive), **`sudo`** (exécuter une commande en admin), **least privilege** (le minimum de droits nécessaire), **`trash-put`** (outil trash-cli qui envoie à la corbeille au lieu de supprimer).
- **« No such file or directory »** : message d'erreur quand le chemin n'existe plus.
- **Downtime** = temps d'arrêt du service.
- **Production database** = la vraie base utilisée par les clients, pas une copie de test.
- Expressions : **« for good »** = pour toujours (pas « pour le bien ») ; **« That's it. »** = c'est tout ; **« basically »** = en gros ; **« wipe »** = effacer complètement ; **« safety net »** = filet de sécurité.

---

## 3. Fonctionnalités

### 3.1 Vue « Slide + Script »
- Aperçu HTML/CSS de la slide (reconstruit fidèlement, voir §1). En dessous, le script phrase par phrase.
- Navigation ◀ ▶ entre les slides 9–12 ; swipe sur mobile.
- Pour chaque phrase : bouton 🔊 (écouter), 🎙️ (m'enregistrer), 💬 (comprendre, §2).

### 3.2 Prononciation (le cœur du module)
- **Écouter** : Web Speech API `speechSynthesis` avec une voix `en-US` (ou `en-GB` au choix). Vitesses 0.7× / 1× / 1.2×. Surlignage mot par mot (événement `onboundary`).
- **Mot par mot** : taper sur n'importe quel mot du script pour l'entendre seul, avec :
  - son **IPA** ;
  - une **transcription « à la marocaine »** en lettres latines ;
  - la **syllabe accentuée en gras** ;
  - **l'erreur typique** d'un francophone / arabophone marocain.
- **Moi je dis** : `SpeechRecognition` (`lang="en-US"`) compare la transcription au texte attendu (distance de Levenshtein par mot). Les mots ratés sont surlignés en rouge, avec un score /100 par phrase.
  - Si l'API n'est pas disponible (Safari / Firefox), utiliser l'enregistrement simple + réécoute (MediaRecorder) et un auto-contrôle « j'ai bien dit ✓ / ✗ ».
- **Lexique de prononciation (minimum, avec audio TTS) :**

| Mot | IPA | « Kifach tgoulha » | Accent | Erreur fréquente |
|---|---|---|---|---|
| Linux | /ˈlɪnəks/ | **LI**-nuks | 1re | dire « li-NUX » à la française |
| Pixar | /ˈpɪksɑːr/ | **PIK**-sar | 1re | « pik-SAR » |
| server | /ˈsɜːrvər/ | **SEUR**-veur | 1re | « serveur » français |
| data | /ˈdeɪtə/ ou /ˈdætə/ | **DEY**-ta | 1re | « da-TA » |
| variable | /ˈveəriəbl/ | **VÈ**-ri-a-bel | 1re | « va-ri-A-bl » |
| engineer | /ˌendʒɪˈnɪər/ | en-dji-**NIR** | dernière | « ingénieur » |
| deleted | /dɪˈliːtɪd/ | di-**LI**-tid | 2e | « dé-lé-té » |
| directory | /dəˈrektəri/ | di-**REK**-to-ri | 2e | « di-rec-to-ri » plat |
| database | /ˈdeɪtəbeɪs/ | **DEY**-ta-beys | 1re | « data-baz » |
| consequences | /ˈkɒnsɪkwənsɪz/ | **KON**-si-kwen-siz | 1re | « con-sé-quence » |
| financial | /faɪˈnænʃl/ | fay-**NAN**-chel | 2e | « fi-nan-cial » |
| privilege | /ˈprɪvəlɪdʒ/ | **PRI**-vi-lidj | 1re | « pri-vi-lège » |
| responsibility | /rɪˌspɒnsəˈbɪləti/ | ri-spon-si-**BI**-li-ti | 4e | accent mal placé |
| honestly | /ˈɒnɪstli/ | **O**-nist-li | 1re, **h muet** | prononcer le h |
| hours | /ˈaʊərz/ | **A**-weurz | **h muet** | prononcer le h |
| hurts, happens, hardest | /h/ | h aspiré | — | supprimer le h |
| think, things, three | /θ/ | langue entre les dents | — | « sink », « tree » |
| that, the, they | /ð/ | langue entre les dents, voisé | — | « zat », « de » |
| restore | /rɪˈstɔːr/ | ri-**STOR** | 2e | — |
| sudo | /ˈsuːduː/ | **SOU**-dou | 1re | « su-do » |
| GB | « gigabytes » | **GI**-ga-bayts | 1re | dire « G-B » ou « gigaoctets » |
| rm -rf | « R-M dash R-F » | ar-èm dach ar-èf | — | lire « rm » comme un mot |
| rm -i | « R-M dash I » | ar-èm dach ay | — | « dach i » français |
| pwd | « P-W-D » | pi-dobel-you-di | — | — |
| ls | « L-S » | èl-ès | — | — |
| / (slash), root | « slash », /ruːt/ | slach, **ROUT** | — | « route » français |

Ajouter **tous** les autres mots du script dans un lexique auto-généré (TTS), avec un bouton « mots difficiles seulement ».

### 3.3 Modes de répétition (progressifs)
1. **Lire avec la voix** : téléprompteur karaoké, TTS + surlignage, je lis en même temps (shadowing).
2. **Téléprompteur** : défilement automatique à vitesse réglable (cible 120–140 mots/min), gros texte, mode miroir optionnel, plein écran paysage.
3. **Script qui disparaît** : à chaque passage, 25 % de mots en plus sont masqués (d'abord les petits mots, puis le reste). Au niveau 4, il ne reste que les **mots-clés**.
4. **Mots-clés seulement** : par slide, 5–7 indices. Exemple slide 9 : « Pixar 1998 → 90 % → copie à la maison · Steam 2015 → variable vide · GitLab 2017 → mauvais serveur → 300 GB / 6 h ».
5. **Oral à l'aveugle** : aperçu de la slide seulement + chrono. Enregistrement complet, puis réécoute et rapport :
   - durée par slide (vert si 45–60 s) ;
   - débit en mots/min ;
   - mots de remplissage détectés (« euh », « um », « like », « so » en trop) ;
   - mots-clés oubliés, via la reconnaissance vocale.
6. **Transitions** : entraîner les phrases de liaison :
   - 8 → 9 : « Okay, so you might think… »
   - 9 → 10 : « So what happens after? »
   - 10 → 11 : « The good news is… »
   - 11 → 12 : « So if you remember just one thing… »
   - fin : « Thank you! » → passer à « questions --welcome »
7. **Répétition générale** : les 4 slides d'affilée, chronomètre total (cible ~4 min, alerte à 5 min), score final.

### 3.4 Simulateur de questions du jury
Le jury pose une question (TTS anglais), Fayssal répond à voix haute (enregistrement), puis il voit une **réponse modèle simple** (EN) + l'explication en darija. Minimum 15 questions, dont :

1. What is the difference between `rm -r` and `rm -rf`?
   → `-f` forces: no confirmation, no error messages.
2. Can you recover files after `rm`?
   → Not with a simple undo. rm does not use the trash. You need a backup; sometimes data-recovery tools help, but there is no guarantee.
3. What does `--preserve-root` do?
   → It makes rm refuse to delete `/`. It is on by default in GNU rm.
4. Why did the Steam bug delete user files?
   → An empty variable turned the path into `/`.
5. How did GitLab recover?
   → From a backup copy that was about 6 hours old. That is why they lost around 6 hours of data.
6. What is the 3-2-1 rule?
7. Why not always work as root?
   → Least privilege: a mistake as root can destroy the whole system.
8. What does `sudo` do?
9. Why not use `rm -i` all the time?
   → You can set `alias rm='rm -i'`, but don't rely on it. Backups stay essential.
10. What is `trash-put`?
    → A command from trash-cli that moves files to the trash instead of deleting them.
11. Is `rm -rf /` still dangerous today if Linux protects the root?
    → Yes. `rm -rf /*`, `--no-preserve-root`, the wrong folder, or an empty variable still cause disasters.
12. What is downtime?
13. Which consequence is the worst, in your opinion?
    → Loss of trust, and why.
14. Give one habit you personally use before deleting something.
15. What would you do right after running rm -rf by mistake on a server?
    → Stop, don't write anything new to the disk, alert the team, restore from backup.

Une évaluation simple est affichée après chaque réponse : mots-clés attendus présents ✓/✗ (reconnaissance vocale).

### 3.5 Vérification des faits (affichée dans la vue « Comprendre »)
Encadré « Sources & précisions » pour la slide 9, avec ces formulations prudentes (que Fayssal peut dire sans risque) :

- **Pixar 1998 :** une commande de suppression a effacé environ 90 % des fichiers de Toy Story 2 ; une copie chez une employée qui travaillait depuis chez elle a permis de récupérer le film.
- **Steam for Linux, janvier 2015 :** le script de lancement contenait `rm -rf "$STEAMROOT/"*` ; avec la variable vide, tous les fichiers de l'utilisateur ont été supprimés.
- **GitLab, 31 janvier 2017 :** un ingénieur, tard dans la nuit, a supprimé environ 300 GB de données de production sur le mauvais serveur ; environ 6 heures de données ont été perdues.

Note : « elle avait une copie chez elle » et « il travaillait tard » sont des détails rapportés par la presse. Si on n'est pas sûr, on peut les retirer sans casser l'histoire. Ajouter un interrupteur « version prudente du script », qui affiche le script sans ces deux détails.

### 3.6 Flashcards & mini-QCM
- **Flashcards :**
  - recto = une slide ou un mot-clé ; verso = ce qu'il faut dire (résumé) ;
  - recto = un mot ; verso = sa prononciation (audio).
- **QCM (≥ 20 questions) :**
  - remettre les phrases d'une slide dans l'ordre ;
  - « quelle année / quelle entreprise / combien de GB » ;
  - « quelle commande pour… » ;
  - « quelle syllabe est accentuée ? ».

### 3.7 Mode « Jour J »
- **Checklist :**
  - parler lentement ;
  - regarder le public, pas l'écran ;
  - pointer la slide quand on cite un chiffre ;
  - respirer entre deux slides ;
  - avoir de l'eau ;
  - savoir sa première phrase par cœur.
- **Échauffement de 5 minutes :**
  - 5 mots difficiles (θ, h, accent) ;
  - la phrase d'ouverture ×3 ;
  - la phrase finale ×3.
- **Intégration au mode 24h** (`SPEC.md` §9) :
  - si une date de présentation est saisie, le planificateur ajoute des blocs « Coach Oral » de 20 min ;
  - les blocs suivent la progression des niveaux 1 → 7 ;
  - le dernier bloc la veille au soir est une répétition générale.

### 3.8 Progression
- Par slide : % compréhension, score de prononciation moyen, niveau de mémorisation (1–7), meilleur temps.
- Badges : « No more 'sink' » (θ maîtrisé), « 4 minutes chrono », « Jury proof » (15 questions répondues).
- Tout est sauvegardé en localStorage. Les enregistrements audio sont stockés en IndexedDB (supprimables) et ne sortent jamais de l'appareil.

---

## 4. Technique

- Composants :
  - `SlidePreview` (4 slides en HTML/CSS)
  - `ScriptSentence`
  - `TtsPlayer` (speechSynthesis + surlignage)
  - `PronunciationChecker` (SpeechRecognition + Levenshtein mot à mot)
  - `Recorder` (MediaRecorder + IndexedDB)
  - `Teleprompter`
  - `FadingScript`
  - `JuryQA`
  - `PaceMeter` (mots/min)
- Contenu dans `src/content/oral/rm-rf/` : `slides.json`, `script.json` (phrases), `lexicon.json`, `qa.json`, `quiz.json`, `flashcards.json` — validés par Zod.
- Détection de compatibilité : si `SpeechRecognition` est absent, afficher clairement « Sur ce navigateur, utilise Chrome (Android ou ordinateur) pour la correction automatique ». Le reste du module fonctionne partout.
- Tests :
  - Vitest : découpage des phrases, score Levenshtein, masquage progressif, calcul des mots/min.
  - Playwright : parcourir les 4 slides, lancer le TTS (mock), compléter une répétition générale.
- Mobile-first : grosses zones tactiles, mode paysage pour le téléprompteur, fonctionne hors-ligne (sauf la reconnaissance vocale, qui dépend du navigateur).

## 5. Ordre de construction
1. Contenu JSON (script exact §1, explications §2, lexique §3.2, questions §3.4).
2. `SlidePreview` + vue « Slide + Script » + compréhension.
3. TTS + lexique + reconnaissance vocale.
4. Modes de répétition 1 → 7 + enregistrement.
5. Simulateur du jury, flashcards, QCM, mode Jour J, intégration au mode 24h.
6. Tests, build, et récapitulatif final (nombre de phrases, mots du lexique, questions, résultats des tests).