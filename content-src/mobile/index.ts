import { c1, c2, c3, c4, c5, c6, c7 } from './course';
import { setCtx, L, single, multi, cmd, order, ex, fc, ref } from '../lib';
import type { Module } from '../../src/lib/schema';

const NO = ['Non.', 'La.', 'No.'] as [string, string, string];

// ================= Chapitre 1 — Outils et fichiers d'un écran =================
setCtx('mobile', 'ecran');
const q1 = [
  single('mob-01', 1, ["Quel est le rôle d'**Android Studio** ?", "Chnou dor dyal **Android Studio** ?", 'What is **Android Studio** for?'],
    [["C'est l'IDE : éditeur de code, éditeur de layouts et débogueur", "IDE : éditeur dyal code, layouts w débogueur", 'The IDE: code editor, layout editor and debugger'], ["C'est l'ensemble des API Android", "Majmou3a dyal API Android", 'The set of Android APIs'], ["C'est le fichier qui déclare les Activity", "Fichier li kaydeclari les Activity", 'The file that declares Activities']], 0,
    ["**Android Studio** = l'environnement où l'on **écrit le code** et où l'on **débogue**. Les API et outils de construction viennent du **SDK**.", "Android Studio = fin katkteb l code w katdébogui. API w outils = SDK.", "**Android Studio** = where you **write code** and **debug**. APIs and build tools come from the **SDK**."],
    [["Ça, c'est le SDK Android.", "Hadak SDK.", 'That is the Android SDK.'], ["Ça, c'est AndroidManifest.xml.", "Hadak manifeste.", 'That is AndroidManifest.xml.']], ['outils']),
  single('mob-02', 1, ["Le **SDK Android** est…", "**SDK Android** howa…", 'The **Android SDK** is…'],
    [["l'ensemble des API et des outils Android nécessaires pour construire l'application", "API + outils bach tbni l'app", 'the set of Android APIs and tools needed to build the app'], ["un émulateur seulement", "ghir émulateur", 'only an emulator'], ["un langage de programmation", "langage", 'a programming language']], 0,
    ["SDK = **Software Development Kit** : API (`android.*`), build-tools, adb, émulateur, images système.", "SDK = API + build-tools + adb + émulateur.", 'SDK = APIs (`android.*`), build tools, adb, emulator, system images.'],
    [["L'émulateur n'est qu'un des outils du SDK.", "Émulateur jouz2 mn SDK.", 'The emulator is only one SDK tool.'], ["Le langage est Java (ou Kotlin).", "Langage = Java/Kotlin.", 'The language is Java (or Kotlin).']], ['outils']),
  single('mob-03', 1, ["Quel fichier **décrit les composants d'un écran et leur disposition** ?", "Ach mn fichier kaywsef composants dyal écran w fin m7totin ?", 'Which file **describes the components of a screen and their layout**?'],
    [['res/layout/activity_main.xml', 'res/layout/activity_main.xml', 'res/layout/activity_main.xml'], ['res/values/strings.xml', 'res/values/strings.xml', 'res/values/strings.xml'], ['AndroidManifest.xml', 'AndroidManifest.xml', 'AndroidManifest.xml']], 0,
    ["Le **layout** décrit l'interface : quels TextView, Button… et où.", "Layout = interface.", 'The **layout** describes the interface.'],
    [["strings.xml centralise les textes.", "strings = textes.", 'strings.xml holds texts.'], ["Le manifeste déclare les composants et permissions.", "Manifeste = composants.", 'The manifest declares components.']], ['fichiers']),
  multi('mob-04', 2, ["Que **déclare** AndroidManifest.xml ?", "Chnou kaydeclari AndroidManifest.xml ?", 'What does AndroidManifest.xml **declare**?'],
    [["Les Activity de l'application", "Les Activity", 'The Activities'], ["Les permissions nécessaires (ex. INTERNET)", "Permissions (INTERNET)", 'Required permissions (e.g. INTERNET)'], ["La disposition des boutons", "Disposition dyal boutons", 'Button positions'], ["Les traductions des textes", "Traductions", 'Text translations']], [0, 1],
    ["Manifeste = **composants** (Activity…) + **permissions**. La disposition est dans le layout, les textes dans strings.xml.", "Composants + permissions.", 'Components (Activities…) + permissions.'],
    [["C'est le rôle du layout.", "Layout.", "That's the layout."], ["C'est le rôle de strings.xml.", "strings.xml.", "That's strings.xml."]], ['fichiers', 'manifeste']),
  single('mob-05', 2, ["Pourquoi mettre les textes dans **strings.xml** plutôt qu'en dur dans le layout ?", "3lach textes f strings.xml machi direct f layout ?", 'Why put texts in **strings.xml** instead of hard-coding them?'],
    [["Pour les centraliser : réutilisation et traduction faciles", "Bach yjtam3ou : réutilisation w traduction", 'To centralise them: easy reuse and translation'], ["Parce que le layout ne peut pas contenir de texte", "Layout ma y9derch ychd texte", 'Because layouts cannot contain text'], ["Pour accélérer l'application", "Bach l'app tsra3", 'To speed up the app']], 0,
    ["strings.xml **centralise les textes**, ce qui facilite leur **réutilisation** et leur **traduction** (un `values-en/strings.xml` suffit).", "Réutilisation + traduction.", 'Reuse + translation.'],
    [["Il peut (texte en dur), mais c'est déconseillé.", "Y9der walakin ma mzyanch.", 'It can (hard-coded), but it is discouraged.'], ["Aucun effet sur la vitesse.", "Ma 3andha 3ala9a b sor3a.", 'No effect on speed.']], ['fichiers', 'strings']),
  single('mob-06', 1, ["Que fait `setContentView(R.layout.activity_main)` ?", "Chnou kaydir `setContentView(R.layout.activity_main)` ?", 'What does `setContentView(R.layout.activity_main)` do?'],
    [["Il charge l'interface de l'Activity à partir du layout", "Kaychargi l'interface mn layout", "Loads the Activity's interface from the layout"], ["Il déclare l'Activity", "Kaydeclari Activity", 'Declares the Activity'], ["Il crée le fichier activity_main.xml", "Kaysayb fichier", 'Creates activity_main.xml']], 0,
    ["`setContentView` **charge l'interface de l'Activity**. `R.layout.activity_main` désigne la ressource XML.", "Kaychargi l'interface.", "Loads the Activity's interface."],
    [["La déclaration se fait dans le manifeste.", "Manifeste.", 'Declaration is in the manifest.'], ["Le fichier existe déjà dans res/layout.", "Fichier deja kayn.", 'The file already exists.']], ['java-res']),
  single('mob-07', 2, ["`R.layout.activity_main` désigne…", "`R.layout.activity_main` kaydesigner…", '`R.layout.activity_main` designates…'],
    [["la ressource res/layout/activity_main.xml, sans son extension", "ressource activity_main.xml bla extension", 'the res/layout/activity_main.xml resource, without its extension'], ["une classe Java écrite par le développeur", "classe Java li kteb dev", 'a Java class written by the developer'], ["une chaîne de caractères", "texte", 'a string']], 0,
    ["`R` est **générée automatiquement** ; chaque ressource y a un identifiant. On écrit le nom **sans `.xml`**.", "R automatique ; bla .xml.", '`R` is **auto-generated**; no `.xml`.'],
    [["R est générée, on ne l'écrit pas.", "R automatique.", 'R is generated.'], ["C'est R.string.x pour un texte.", "R.string.", 'That would be R.string.x.']], ['java-res']),
  single('mob-08', 2, ["Dans un layout, `android:text=\"@string/app_name\"`…", "F layout, `android:text=\"@string/app_name\"`…", 'In a layout, `android:text="@string/app_name"`…'],
    [["réutilise le texte déclaré dans strings.xml sous le nom app_name", "kay3awed ysta3mel texte dyal strings.xml", 'reuses the text declared in strings.xml as app_name'], ["affiche littéralement « @string/app_name »", "kayban « @string/app_name »", 'literally shows "@string/app_name"'], ["crée une nouvelle chaîne", "kaysayb texte jdid", 'creates a new string']], 0,
    ["Avec `<string name=\"app_name\">Contacts</string>`, l'écran affiche **Contacts**.", "Kayban Contacts.", 'Shows **Contacts**.'],
    [["Le préfixe @ indique une référence de ressource.", "@ = référence.", '@ means a resource reference.'], ["Il faut que la chaîne existe déjà.", "Khass texte ykoun kayn.", 'The string must already exist.']], ['java-res', 'strings']),
  cmd('mob-09', 2, ["Écris la ligne (Java) qui charge l'interface `activity_main` dans onCreate().", "Kteb ster li kaychargi `activity_main` f onCreate().", 'Write the Java line that loads `activity_main` in onCreate().'],
    ['setContentView(R.layout.activity_main);', 'setContentView(R.layout.activity_main)'],
    ["Pas d'extension .xml, et R.layout (pas R.id).", "Bla .xml, R.layout.", 'No .xml, and R.layout (not R.id).'],
    { 'setContentView(R.layout.activity_main.xml);': ["Pas d'extension .xml dans R.", "Bla .xml.", 'No .xml in R.'], 'setContentView(activity_main);': ["Il faut passer par R.layout.", "Khass R.layout.", 'Use R.layout.'] }, ['java-res'])
];

// ================= Chapitre 2 — Cycle de vie =================
setCtx('mobile', 'cycle');
const q2 = [
  single('mob-10', 1, ["Quelle méthode **initialise l'Activity et son interface** ?", "Ach mn méthode kat initialisi Activity w interface ?", 'Which method **initialises the Activity and its interface**?'],
    [['onCreate()', 'onCreate()', 'onCreate()'], ['onStart()', 'onStart()', 'onStart()'], ['onResume()', 'onResume()', 'onResume()']], 0,
    ["**onCreate()** : appelée une fois par instance ; on y fait `setContentView`.", "onCreate.", '**onCreate()**: once per instance.'],
    [["onStart = devient visible.", "onStart = bayna.", 'onStart = becomes visible.'], ["onResume = premier plan.", "onResume = l9eddam.", 'onResume = foreground.']], ['methodes']),
  single('mob-11', 1, ["Après quelle méthode l'Activity est-elle **au premier plan et interactive** ?", "Mor ach mn méthode Activity katweli f l9eddam w interactive ?", 'After which method is the Activity **in the foreground and interactive**?'],
    [['onResume()', 'onResume()', 'onResume()'], ['onStart()', 'onStart()', 'onStart()'], ['onRestart()', 'onRestart()', 'onRestart()']], 0,
    ["onStart = visible ; **onResume = premier plan + interactive**.", "onResume.", 'onResume = foreground + interactive.'],
    [["Visible mais pas encore interactive.", "Bayna walakin mazal.", 'Visible but not yet interactive.'], ["onRestart précède onStart.", "9bel onStart.", 'onRestart precedes onStart.']], ['methodes']),
  single('mob-12', 2, ["Que signifie **onStop()** ?", "Chnou ma3na **onStop()** ?", 'What does **onStop()** mean?'],
    [["L'Activity n'est plus visible", "Activity ma bqatch bayna", 'The Activity is no longer visible'], ["L'Activity perd le premier plan mais reste visible", "Fqdat l9eddam walakin bayna", 'Lost foreground but still visible'], ["L'instance est détruite", "Instance tmse7at", 'The instance is destroyed']], 0,
    ["onPause = perd le premier plan ; **onStop = plus visible** ; onDestroy = fin de l'instance.", "onStop = ma bqatch bayna.", 'onStop = no longer visible.'],
    [["C'est onPause().", "onPause.", "That's onPause()."], ["C'est onDestroy().", "onDestroy.", "That's onDestroy()."]], ['methodes']),
  order('mob-13', 2, ["Premier lancement puis appui sur **Accueil** : ordre des méthodes.", "Awel lancement w men b3d **Accueil** : tartib.", 'First launch then **Home**: order of methods.'],
    ['onCreate()', 'onStart()', 'onResume()', 'onPause()', 'onStop()'],
    ["Lancement : onCreate, onStart, onResume. Accueil : onPause, puis onStop. Pas de onDestroy.", "Bla onDestroy.", 'No onDestroy.'], ['scenario']),
  single('mob-14', 2, ["L'utilisateur revient sur l'application (sans destruction). Quelle séquence ?", "User kayrje3 (bla destruction). Ach mn séquence ?", 'The user returns (no destruction). Which sequence?'],
    [['onRestart(), onStart(), onResume()', 'onRestart(), onStart(), onResume()', 'onRestart(), onStart(), onResume()'], ['onCreate(), onStart(), onResume()', 'onCreate(), onStart(), onResume()', 'onCreate(), onStart(), onResume()'], ['onResume() seulement', 'Ghir onResume()', 'onResume() only']], 0,
    ["**Même instance** : onCreate() ne se répète pas ; onRestart() précède onStart().", "Nefs instance, bla onCreate.", 'Same instance: no onCreate().'],
    [["onCreate ne se répète pas pour la même instance.", "onCreate ma kat3awedch.", 'onCreate is not repeated.'], ["Elle était invisible : onStart est nécessaire.", "Kanet ma bayna ch : onStart.", 'It was invisible: onStart is needed.']], ['scenario']),
  single('mob-15', 3, ["Pourquoi ne pas sauvegarder des données importantes dans **onDestroy()** ?", "3lach ma n7fdouch data f **onDestroy()** ?", 'Why not save important data in **onDestroy()**?'],
    [["Parce que onDestroy() n'est pas garanti : le système peut tuer le processus sans l'appeler", "onDestroy machi garanti", 'onDestroy() is not guaranteed: the process may be killed without it'], ["Parce que onDestroy() est appelée avant onCreate()", "Kat3ayet 9bel onCreate", 'Because it runs before onCreate()'], ["Parce qu'on n'a plus accès aux variables", "Ma kaynach variables", 'Because variables are gone']], 0,
    ["En arrière-plan, Android peut **tuer le processus** sans appeler onDestroy(). On sauvegarde dans **onPause()/onStop()**.", "7fed f onPause/onStop.", 'Save in onPause()/onStop().'],
    [["Faux : c'est la dernière méthode.", "Ghalat.", 'False: it is the last one.'], ["Les variables existent encore si elle est appelée.", "Kaynin.", 'They still exist if called.']], ['scenario', 'destroy']),
  order('mob-16', 3, ["**Rotation** de l'écran (Activity au premier plan) : ordre des méthodes.", "**Rotation** : tartib.", 'Screen **rotation**: order of methods.'],
    ['onPause()', 'onStop()', 'onDestroy()', 'onCreate()', 'onStart()', 'onResume()'],
    ["Changement de configuration : destruction puis **nouvelle instance**.", "Tmse7 w tsayb.", 'Destroyed, then a **new instance**.'], ['scenario', 'rotation']),
  single('mob-17', 3, ["L'Activity A ouvre l'Activity B. Laquelle de ces séquences est correcte ?", "A kat7el B. Ach mn séquence s7i7a ?", 'Activity A opens B. Which sequence is right?'],
    [['A.onPause → B.onCreate → B.onStart → B.onResume → A.onStop', 'A.onPause → B.onCreate → B.onStart → B.onResume → A.onStop', 'A.onPause → B.onCreate → B.onStart → B.onResume → A.onStop'], ['A.onStop → A.onDestroy → B.onCreate → B.onStart → B.onResume', 'A.onStop → A.onDestroy → B…', 'A.onStop → A.onDestroy → B…'], ['B.onCreate → B.onStart → B.onResume → A.onPause → A.onStop', 'B… → A.onPause → A.onStop', 'B… → A.onPause → A.onStop']], 0,
    ["A perd d'abord le premier plan (onPause), B s'affiche, **puis** A devient invisible (onStop). A n'est pas détruite.", "A.onPause, B, A.onStop.", 'A.onPause, B starts, then A.onStop.'],
    [["A n'est pas détruite.", "A ma tmse7atch.", 'A is not destroyed.'], ["A.onPause vient en premier.", "A.onPause lowel.", 'A.onPause comes first.']], ['scenario']),
  single('mob-18', 2, ["Une fenêtre de permission s'affiche **par-dessus** l'Activity (qui reste visible derrière). Quelle méthode ?", "Fenêtre permission fo9 Activity (ba9a bayna). Ach mn méthode ?", 'A permission window appears **over** the Activity (still visible). Which method?'],
    [['onPause() seulement', 'Ghir onPause()', 'onPause() only'], ['onPause() puis onStop()', 'onPause() w onStop()', 'onPause() then onStop()'], ['onDestroy()', 'onDestroy()', 'onDestroy()']], 0,
    ["Elle perd le premier plan mais **reste visible** → onPause() seulement ; onResume() à la fermeture.", "Ghir onPause.", 'Still visible → onPause() only.'],
    [["onStop = plus visible du tout.", "onStop = ma bayna ch.", 'onStop = not visible at all.'], ["Rien n'est détruit.", "Walou ma tmse7.", 'Nothing is destroyed.']], ['scenario']),
  multi('mob-19', 3, ["Quelles affirmations sont vraies ?", "Chnou s7i7 ?", 'Which statements are true?'],
    [["onCreate() est appelée une seule fois par instance", "onCreate mra wa7da l kol instance", 'onCreate() runs once per instance'], ["Chaque méthode redéfinie doit appeler super.onXxx()", "Khass super.onXxx()", 'Each override must call super.onXxx()'], ["onRestart() est appelée au premier lancement", "onRestart f awel lancement", 'onRestart() runs on first launch'], ["onDestroy() est toujours appelée", "onDestroy dima", 'onDestroy() is always called']], [0, 1],
    ["onRestart() seulement après un onStop() ; onDestroy() n'est pas garanti.", "onRestart mor onStop ; onDestroy machi garanti.", 'onRestart only after onStop; onDestroy not guaranteed.'],
    [["Seulement quand on revient après onStop().", "Ghir mor onStop.", 'Only when coming back after onStop().'], ["Pas garanti (processus tué).", "Machi garanti.", 'Not guaranteed.']], ['methodes'])
];

// ================= Chapitre 3 — Unités et dimensions =================
setCtx('mobile', 'dimensions');
const q3 = [
  single('mob-20', 1, ["Quelle unité pour la **taille d'un texte** ?", "Ach mn unité l **taille dyal texte** ?", 'Which unit for **text size**?'],
    [['sp', 'sp', 'sp'], ['dp', 'dp', 'dp'], ['px', 'px', 'px']], 0,
    ["**sp** : tient compte de la densité **et** du réglage de taille de police de l'utilisateur. Ex. 18sp.", "sp.", '**sp**: density **and** user font size.'],
    [["dp ignore le réglage de police.", "dp ma kaytbe3ch police.", 'dp ignores the font setting.'], ["px dépend de la densité.", "px kaytbe3 densité.", 'px depends on density.']], ['unites']),
  single('mob-21', 2, ["Pourquoi éviter le **px** pour les dimensions de l'interface ?", "3lach ntjnbou **px** ?", 'Why avoid **px** for UI dimensions?'],
    [["Un même nombre de pixels n'a pas la même taille apparente selon la densité", "Nefs pixels ma 3andhomch nefs taille", 'The same px count looks different depending on density'], ["Android n'accepte pas l'unité px", "Android ma ykbelch px", 'Android rejects px'], ["Le px est réservé au texte", "px l texte", 'px is for text only']], 0,
    ["Le pixel brut **dépend de la densité** ; dp est indépendant.", "px kaytbe3 densité.", 'Raw px **depends on density**.'],
    [["Il l'accepte, mais c'est déconseillé.", "Kaykbelha walakin la.", 'It accepts it, but it is discouraged.'], ["Faux.", "Ghalat.", 'False.']], ['unites']),
  single('mob-22', 2, ["Combien de pixels fait un composant de **48dp** sur un écran **xxhdpi (480 dpi)** ?", "**48dp** f **480 dpi** = ch7al px ?", 'How many pixels is **48dp** on **xxhdpi (480 dpi)**?'],
    [['144 px', '144 px', '144 px'], ['48 px', '48 px', '48 px'], ['96 px', '96 px', '96 px'], ['72 px', '72 px', '72 px']], 0,
    ["px = 48 × 480 / 160 = 48 × 3 = **144**.", "48 × 3 = 144.", '48 × 3 = 144.'],
    [["Seulement à 160 dpi (mdpi).", "Ghir f 160 dpi.", 'Only at 160 dpi.'], ["C'est xhdpi (320 dpi, ×2).", "xhdpi.", "That's xhdpi."], ["C'est hdpi (240 dpi, ×1,5).", "hdpi.", "That's hdpi."]], ['unites', 'calcul']),
  single('mob-23', 1, ["`wrap_content` signifie…", "`wrap_content` ma3naha…", '`wrap_content` means…'],
    [["la vue adapte sa taille à son contenu (avec padding)", "taille 3la 7sab contenu", 'the view sizes to its content (with padding)'], ["la vue prend toute la place du parent", "ga3 l blasa dyal parent", 'the view takes all the parent space'], ["la taille est 0", "taille 0", 'the size is 0']], 0,
    ["wrap_content = taille du **contenu** + marges internes + contraintes de taille.", "Contenu.", 'Content size.'],
    [["C'est match_parent.", "match_parent.", "That's match_parent."], NO], ['dimensions']),
  single('mob-24', 2, ["Dans un LinearLayout : largeur `match_parent`, hauteur `wrap_content`. Le bouton…", "LinearLayout : l3ard match_parent, tol wrap_content. Bouton…", 'In a LinearLayout: width `match_parent`, height `wrap_content`. The button…'],
    [["prend la largeur disponible et ajuste sa hauteur", "kayakhod l3ard w kay3dl tol", 'takes the available width and adjusts its height'], ["remplit tout l'écran", "kay3mmer l écran", 'fills the whole screen'], ["est aussi petit que son texte dans les deux sens", "sghir 3la 7sab texte", 'is as small as its text both ways']], 0,
    ["C'est l'exemple de la diapo 4.", "Mithal dyal diapo 4.", 'Slide 4 example.'],
    [["La hauteur est wrap_content.", "Tol wrap_content.", 'Height is wrap_content.'], ["La largeur est match_parent.", "L3ard match_parent.", 'Width is match_parent.']], ['dimensions']),
  single('mob-25', 2, ["Dans un **ConstraintLayout**, `android:layout_width=\"0dp\"` signifie…", "F **ConstraintLayout**, `0dp` ma3naha…", 'In a **ConstraintLayout**, `layout_width="0dp"` means…'],
    [["« match constraints » : la largeur dépend des contraintes", "match constraints", '"match constraints": width depends on constraints'], ["la vue est invisible (largeur nulle)", "view ma katbanch", 'the view is invisible'], ["la même chose que wrap_content", "b7al wrap_content", 'same as wrap_content']], 0,
    ["0dp = **match constraints** : la vue s'étire entre ses contraintes (ex. Start et End au parent).", "Katmedd bin contraintes.", 'Stretches between its constraints.'],
    [["Piège : 0dp ne veut pas dire taille zéro ici.", "Fekh : machi zéro.", 'Trap: not zero here.'], NO], ['constraint']),
  single('mob-26', 3, ["Un EditText dans un ConstraintLayout doit occuper toute la largeur. Quelle écriture est recommandée ?", "EditText khasso l3ard kamel f ConstraintLayout. Chnou mzyan ?", 'An EditText in a ConstraintLayout must span the width. Recommended?'],
    [["layout_width=\"0dp\" + constraintStart_toStartOf et constraintEnd_toEndOf=\"parent\"", "0dp + Start/End parent", '0dp + Start/End to parent'], ["layout_width=\"match_parent\" sans contraintes", "match_parent bla contraintes", 'match_parent without constraints'], ["layout_width=\"0dp\" sans contraintes", "0dp bla contraintes", '0dp without constraints']], 0,
    ["0dp + les **deux** contraintes opposées. match_parent n'est pas recommandé pour les enfants d'un ConstraintLayout.", "0dp + jouj contraintes.", '0dp + both opposite constraints.'],
    [["Déconseillé dans ConstraintLayout.", "Ma mzyanch.", 'Discouraged in ConstraintLayout.'], ["Sans contraintes, 0dp ne s'étire pas.", "Bla contraintes ma kaytmeddch.", 'Without constraints 0dp does not stretch.']], ['constraint']),
  multi('mob-27', 2, ["Quelles écritures sont **correctes** ?", "Chnou s7i7 ?", 'Which are **correct**?'],
    [['android:textSize="18sp"', 'android:textSize="18sp"', 'android:textSize="18sp"'], ['android:layout_width="48dp"', 'android:layout_width="48dp"', 'android:layout_width="48dp"'], ['android:textSize="18dp"', 'android:textSize="18dp"', 'android:textSize="18dp"'], ['android:layout_width="48px"', 'android:layout_width="48px"', 'android:layout_width="48px"']], [0, 1],
    ["sp pour le texte, dp pour les dimensions.", "sp texte, dp dimensions.", 'sp for text, dp for dimensions.'],
    [["dp ignore la taille de police de l'utilisateur.", "dp machi l texte.", 'dp ignores the user font size.'], ["px dépend de la densité.", "px kaytbe3 densité.", 'px depends on density.']], ['unites'])
];

// ================= Chapitre 4 — Navigation et passage de données =================
setCtx('mobile', 'navigation');
const q4 = [
  single('mob-30', 1, ["Pour ouvrir **DetailActivity** depuis MainActivity, on crée…", "Bach t7el **DetailActivity** mn MainActivity, katsayb…", 'To open **DetailActivity** from MainActivity you create…'],
    [["new Intent(MainActivity.this, DetailActivity.class)", "new Intent(MainActivity.this, DetailActivity.class)", "new Intent(MainActivity.this, DetailActivity.class)"], ["new DetailActivity()", "new DetailActivity()", "new DetailActivity()"], ["new Intent(DetailActivity.class, MainActivity.this)", "new Intent(DetailActivity.class, MainActivity.this)", "new Intent(DetailActivity.class, MainActivity.this)"]], 0,
    ["Intent explicite : (contexte actuel, classe cible), puis `startActivity(intent)`.", "(contexte, classe cible) + startActivity.", '(current context, target class), then startActivity.'],
    [["On ne crée jamais une Activity avec new : c'est Android qui la crée.", "Android howa li kaysayb Activity.", 'Android creates Activities, never new.'], ["Ordre inversé : d'abord le contexte.", "Tartib m9loub.", 'Wrong order: context first.']], ['intent']),
  single('mob-31', 2, ["Quelle méthode **envoie** l'Intent pour ouvrir l'écran ?", "Ach mn méthode kat**sifet** Intent ?", 'Which method **sends** the Intent?'],
    [['startActivity(intent)', 'startActivity(intent)', 'startActivity(intent)'], ['putExtra(intent)', 'putExtra(intent)', 'putExtra(intent)'], ['setContentView(intent)', 'setContentView(intent)', 'setContentView(intent)']], 0,
    ["`startActivity` confie l'Intent à Android, qui crée l'écran cible.", "startActivity.", '`startActivity` hands it to Android.'],
    [["putExtra ajoute une donnée.", "putExtra = data.", 'putExtra adds data.'], ["setContentView charge un layout.", "setContentView = layout.", 'setContentView loads a layout.']], ['intent']),
  cmd('mob-32', 2, ["Ajoute à `intent` la donnée « nom » de valeur \"Sara\".", "Zid l `intent` data « nom » = \"Sara\".", 'Add the value "Sara" under the key "nom" to `intent`.'],
    ['intent.putExtra("nom", "Sara");', 'intent.putExtra("nom","Sara");', 'intent.putExtra("nom", "Sara")'],
    ["putExtra(clé, valeur).", "putExtra(clé, valeur).", 'putExtra(key, value).'], {}, ['extras']),
  single('mob-33', 2, ["Dans DetailActivity, comment lire la donnée String « nom » ?", "F DetailActivity, kifach t9ra String « nom » ?", 'In DetailActivity, how do you read the String "nom"?'],
    [['getIntent().getStringExtra("nom")', 'getIntent().getStringExtra("nom")', 'getIntent().getStringExtra("nom")'], ['getStringExtra(intent, "nom")', 'getStringExtra(intent, "nom")', 'getStringExtra(intent, "nom")'], ['new Intent().getStringExtra("nom")', 'new Intent().getStringExtra("nom")', 'new Intent().getStringExtra("nom")']], 0,
    ["`getIntent()` renvoie l'Intent **reçu** ; on lit avec la **même clé**.", "getIntent() + nefs clé.", '`getIntent()` returns the **received** Intent.'],
    [["Cette méthode n'existe pas.", "Ma kaynach.", 'No such method.'], ["Un nouvel Intent est vide : renvoie null.", "Intent jdid khawi : null.", 'A new Intent is empty: null.']], ['extras']),
  single('mob-34', 3, ["A fait `putExtra(\"age\", 21)`. B lit `getIntent().getIntExtra(\"Age\", 0)`. Résultat ?", "A : `putExtra(\"age\", 21)`. B : `getIntExtra(\"Age\", 0)`. Natija ?", 'A: `putExtra("age", 21)`. B: `getIntExtra("Age", 0)`. Result?'],
    [['0', '0', '0'], ['21', '21', '21'], ['null', 'null', 'null'], ["Erreur de compilation", "Erreur compilation", 'Compile error']], 0,
    ["Les clés sont **sensibles à la casse** : « Age » ≠ « age ». La clé n'existe pas → **valeur par défaut** 0.", "Casse : Age ≠ age → 0.", 'Case-sensitive keys → default 0.'],
    [["Il faudrait la même clé « age ».", "Khass nefs clé.", 'Needs the same key.'], ["Un int ne peut pas être null : on obtient la valeur par défaut.", "int ma ykounch null.", 'An int cannot be null.'], ["Ça compile : l'erreur est logique.", "Kaycompili.", 'It compiles.']], ['extras', 'pieges']),
  single('mob-35', 2, ["Que renvoie `getStringExtra(\"x\")` si la clé « x » n'a pas été envoyée ?", "`getStringExtra(\"x\")` ila clé ma kaynach ?", 'What does `getStringExtra("x")` return when "x" was not sent?'],
    [['null', 'null', 'null'], ['"" (chaîne vide)', '"" (khawya)', '"" (empty)'], ["Une exception immédiate", "Exception direct", 'An immediate exception']], 0,
    ["**null** — d'où le risque de NullPointerException si on l'utilise sans vérifier.", "null → NullPointerException.", '**null** — hence NPE risk.'],
    [["Non, null.", "La, null.", 'No, null.'], ["Pas tout de suite : seulement si on utilise null ensuite.", "Ghir mn b3d.", 'Only later, when used.']], ['extras', 'pieges']),
  single('mob-36', 2, ["Dans B, comment **revenir** à A ?", "F B, kifach **trje3** l A ?", 'In B, how do you **go back** to A?'],
    [['finish()', 'finish()', 'finish()'], ['startActivity(new Intent(this, MainActivity.class))', 'startActivity(new Intent(this, MainActivity.class))', 'startActivity(new Intent(this, MainActivity.class))'], ['onDestroy()', 'onDestroy()', 'onDestroy()']], 0,
    ["`finish()` termine B ; A revient avec onRestart → onStart → onResume (même instance).", "finish() ; A bla onCreate.", '`finish()` ends B; A comes back.'],
    [["Cela crée une **deuxième** copie de A au lieu de revenir.", "Kaysayb A tanya.", 'Creates a second A.'], ["On n'appelle jamais onDestroy() soi-même.", "Ma n3aytouch l onDestroy.", 'Never call onDestroy() yourself.']], ['retour']),
  order('mob-37', 3, ["B renvoie « favori = true » à A : ordre des lignes dans B.", "B katrj3 « favori = true » : tartib f B.", 'B returns "favori = true" to A: order in B.'],
    ['Intent data = new Intent();', 'data.putExtra("favori", true);', 'setResult(RESULT_OK, data);', 'finish();'],
    ["On prépare la réponse, on la confie avec setResult, **puis** on ferme. setResult après finish() serait trop tard.", "setResult 9bel finish.", 'setResult before finish.'], ['retour']),
  single('mob-38', 2, ["Ouvrir le composeur téléphonique avec un numéro est un exemple…", "T7el composeur b numéro = …", 'Opening the dialer with a number is an example of…'],
    [["d'Intent implicite (ACTION_DIAL + Uri tel:)", "Intent implicite", 'an implicit Intent (ACTION_DIAL + tel: Uri)'], ["d'Intent explicite", "Intent explicite", 'an explicit Intent'], ["de putExtra", "putExtra", 'putExtra']], 0,
    ["Implicite : une **action**, Android choisit l'application. Explicite : une **classe** précise de ton app.", "Implicite = action.", 'Implicit = action; explicit = class.'],
    [["On ne connaît pas la classe de l'app Téléphone.", "Ma kan3rfouch classe.", 'We do not know the dialer class.'], ["putExtra ajoute des données, ce n'est pas un type d'Intent.", "Machi type.", 'Not an Intent type.']], ['intent']),
  multi('mob-39', 3, ["DetailActivity plante dès son ouverture. Causes possibles ?", "DetailActivity katplanti. Asbab ?", 'DetailActivity crashes on open. Possible causes?'],
    [["Elle n'est pas déclarée dans le manifeste", "Ma mdeclariyach f manifeste", 'Not declared in the manifest'], ["getStringExtra renvoie null (mauvaise clé) puis on appelle une méthode dessus", "null (clé ghalta) + méthode", 'getStringExtra returns null (wrong key) then a method is called on it'], ["findViewById avant setContentView", "findViewById 9bel setContentView", 'findViewById before setContentView'], ["On a utilisé putExtra deux fois", "putExtra jouj mrat", 'putExtra used twice']], [0, 1, 2],
    ["Manifeste, null issu d'une mauvaise clé, vue null : les trois classiques.", "3 classiques.", 'The three classics.'],
    [["Plusieurs putExtra sont normaux.", "Bzaf d putExtra 3adi.", 'Several putExtra are normal.']], ['pieges'])
];

// ================= Chapitre 5 — Lire un ConstraintLayout =================
setCtx('mobile', 'constraint');
const q5 = [
  single('mob-40', 1, ["`app:layout_constraintTop_toBottomOf=\"@id/titre\"` place la vue…", "`Top_toBottomOf=\"@id/titre\"` kat7et view…", '`Top_toBottomOf="@id/titre"` places the view…'],
    [["sous titre", "ta7t titre", 'below titre'], ["au-dessus de titre", "fo9 titre", 'above titre'], ["à droite de titre", "limn dyal titre", 'right of titre']], 0,
    ["« Mon haut → bas de titre » : la vue commence où titre finit, donc **dessous**.", "Lfo9 dyali → lte7t dyal titre.", 'My top → titre bottom: **below**.'],
    [["Ce serait Bottom_toTopOf.", "Bottom_toTopOf.", 'That is Bottom_toTopOf.'], ["Ce serait Start_toEndOf.", "Start_toEndOf.", 'That is Start_toEndOf.']], ['grammaire']),
  single('mob-41', 2, ["Quel attribut place la vue **à droite** de `photo` ?", "Ach mn attribut kay7et view **3la limn** dyal `photo` ?", 'Which attribute puts the view **right of** `photo`?'],
    [['layout_constraintStart_toEndOf="@id/photo"', 'Start_toEndOf', 'Start_toEndOf'], ['layout_constraintEnd_toStartOf="@id/photo"', 'End_toStartOf', 'End_toStartOf'], ['layout_constraintStart_toStartOf="@id/photo"', 'Start_toStartOf', 'Start_toStartOf']], 0,
    ["Mon **début** commence à la **fin** de photo → à sa droite.", "Bdaya dyali f nihaya dyal photo.", 'My start at photo end → right of it.'],
    [["Ça la met à gauche de photo.", "Lisr.", 'Puts it left of photo.'], ["Ça l'aligne à gauche sur photo.", "M9ad lisr.", 'Left-aligns with photo.']], ['grammaire']),
  single('mob-42', 2, ["Un bouton a `Start_toStartOf=\"parent\"` et `End_toEndOf=\"parent\"`, largeur `wrap_content`. Où est-il ?", "Bouton : Start w End → parent, wrap_content. Fin ?", 'Button: Start and End → parent, wrap_content. Where?'],
    [["Centré horizontalement", "F lwest", 'Horizontally centred'], ["Collé à gauche", "Lisr", 'Stuck left'], ["Il remplit toute la largeur", "Kay3mmer l3ard", 'Fills the width']], 0,
    ["Tiré des deux côtés → centré (biais 0,5). Pour remplir il faudrait **0dp**.", "Jouj jnab → f lwest.", 'Pulled both ways → centred.'],
    [["Il faudrait un seul côté.", "Jenb wa7ed.", 'Would need one side only.'], ["Il faudrait 0dp.", "0dp.", 'Would need 0dp.']], ['regles']),
  single('mob-43', 3, ["Une vue n'a **que** `Top_toTopOf=\"parent\"`. À l'exécution…", "View fiha **ghir** `Top_toTopOf=\"parent\"`. F l'exécution…", 'A view has **only** `Top_toTopOf="parent"`. At runtime…'],
    [["elle est en haut, collée à gauche (x = 0)", "lfo9, lisr (x = 0)", 'top, stuck left (x = 0)'], ["elle est centrée", "f lwest", 'centred'], ["l'application refuse de compiler", "ma kaycompilich", 'the app fails to compile']], 0,
    ["Pas de contrainte horizontale → x = 0. Android Studio avertit (« not constrained horizontally ») mais compile.", "Bla horizontale → x = 0.", 'No horizontal constraint → x = 0.'],
    [["Le centrage exige Start et End.", "Centrage = Start + End.", 'Centring needs Start and End.'], ["C'est un avertissement, pas une erreur.", "Avertissement.", 'Only a warning.']], ['regles']),
  single('mob-44', 2, ["`layout_constraintHorizontal_bias=\"0.2\"` sur une vue contrainte Start et End au parent…", "`bias=\"0.2\"` m3a Start w End → parent…", '`Horizontal_bias="0.2"` with Start and End to parent…'],
    [["la décale vers la gauche (20 % de l'espace libre à gauche)", "katmilha l lisr", 'shifts it left (20 % of free space on the left)'], ["la décale vers la droite", "limn", 'shifts it right'], ["n'a aucun effet", "walou", 'has no effect']], 0,
    ["0 = tout à gauche, 0,5 = centre, 1 = tout à droite.", "0 lisr, 0,5 west, 1 limn.", '0 left, 0.5 centre, 1 right.'],
    [["C'est le cas pour un biais > 0,5.", "> 0,5.", 'That is bias > 0.5.'], ["Il agit dès que les deux côtés sont contraints.", "Kaykhdem m3a jouj jnab.", 'Works with both sides constrained.']], ['regles']),
  single('mob-45', 3, ["Une vue a `layout_marginTop=\"24dp\"` mais **aucune contrainte Top** (seulement Bottom → parent). La marge…", "marginTop=24dp walakin **bla Top** (ghir Bottom). Marge…", 'A view has `marginTop="24dp"` but **no Top constraint** (only Bottom). The margin…'],
    [["est ignorée", "kat-ignora", 'is ignored'], ["la décale de 24dp vers le bas", "katnzelha 24dp", 'moves it down 24dp'], ["la décale de 24dp vers le haut", "kat-tal3ha 24dp", 'moves it up 24dp']], 0,
    ["Une marge ne s'applique que du côté contraint. Ici il faudrait `marginBottom`.", "Marge ghir f jenb mcontraint.", 'Margins only apply on constrained sides.'],
    [NO, NO], ['regles']),
  single('mob-46', 2, ["Pourquoi préférer `Start/End` à `Left/Right` ?", "3lach Start/End 3la Left/Right ?", 'Why prefer `Start/End` over `Left/Right`?'],
    [["Start/End s'inversent automatiquement dans les langues de droite à gauche (arabe)", "Kayt9elbou f l3arbiya", 'Start/End flip automatically in RTL languages (Arabic)'], ["Left/Right n'existent pas dans ConstraintLayout", "Left/Right ma kaynach", 'Left/Right do not exist'], ["Start/End sont plus rapides", "Asra3", 'Start/End are faster']], 0,
    ["Une interface en arabe se lit de droite à gauche : Start devient la droite.", "Start = limn f l3arbiya.", 'In Arabic, Start becomes the right.'],
    [["Ils existent, mais ne s'inversent pas.", "Kaynin walakin ma kayt9elbouch.", 'They exist but do not flip.'], ["Aucune différence de vitesse.", "Nefs sor3a.", 'No speed difference.']], ['regles']),
  multi('mob-47', 3, ["Dans la fiche contact du cours, quelles affirmations sont vraies ?", "F fiche contact, chnou s7i7 ?", 'In the course contact card, which are true?'],
    [["« nom » est à droite de la photo et s'étire jusqu'au bord droit", "nom limn photo w kaytmedd", 'nom is right of photo and stretches to the right edge'], ["« telephone » est sous « nom », aligné à gauche sur lui", "telephone ta7t nom", 'telephone is under nom, left-aligned with it'], ["« appeler » est centré en bas de l'écran", "appeler f lwest lte7t", 'appeler is centred at the bottom'], ["« photo » est centrée horizontalement", "photo f lwest", 'photo is horizontally centred']], [0, 1, 2],
    ["photo n'a que Start → parent : elle est **collée à gauche**.", "photo ghir Start → lisr.", 'photo only has Start → left.'],
    [["Une seule contrainte horizontale (Start) : collée à gauche.", "Jenb wa7ed : lisr.", 'One horizontal constraint: left.']], ['lecture'])
];

// ================= Chapitre 6 — Listes et adaptateurs =================
setCtx('mobile', 'listes');
const q6 = [
  single('mob-50', 1, ["Quel est le rôle d'un **adaptateur** ?", "Chnou dor dyal **adaptateur** ?", "What is an **adapter**'s role?"],
    [["Faire le pont entre les données et la liste : nombre d'éléments, création et remplissage des lignes", "L9ent ra bin data w liste", 'Bridge data and list: count, create and fill rows'], ["Stocker les données dans une base", "Y7fed data f base", 'Store data in a database'], ["Déclarer la liste dans le manifeste", "Declari liste f manifeste", 'Declare the list in the manifest']], 0,
    ["L'adaptateur sait **combien** il y a d'éléments, **crée** la vue d'une ligne et la **remplit** pour une position.", "3adad, création, remplissage.", 'Count, create, fill.'],
    [["Il lit des données déjà en mémoire.", "Data deja kayna.", 'It reads data already in memory.'], ["Les listes ne se déclarent pas dans le manifeste.", "Machi f manifeste.", 'Lists are not declared in the manifest.']], ['adaptateur']),
  single('mob-51', 2, ["Dans `new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, noms)`, le 2e paramètre est…", "Paramètre tani f ArrayAdapter ?", 'In `new ArrayAdapter<>(…)`, the 2nd parameter is…'],
    [["le layout d'une ligne, fourni par Android", "layout dyal ligne mn Android", 'the row layout, provided by Android'], ["l'id de la ListView", "id dyal ListView", 'the ListView id'], ["le nombre de lignes", "3adad lignes", 'the row count']], 0,
    ["`android.R.layout.simple_list_item_1` : un layout système avec un TextView ; on y affiche `toString()` de chaque élément.", "Layout système b TextView.", 'A system layout with one TextView.'],
    [["L'id sert à findViewById.", "Id l findViewById.", 'The id is for findViewById.'], ["Le nombre vient de la taille de la liste.", "Mn taille dyal liste.", 'Count comes from the list size.']], ['listview']),
  single('mob-52', 2, ["On ajoute un nom à l'ArrayList, mais la ListView n'affiche rien de nouveau. Il manque…", "Zedt smiya walakin ListView ma tbeddlatch. Na9es…", 'A name is added but the ListView does not change. Missing…'],
    [["adapter.notifyDataSetChanged()", "adapter.notifyDataSetChanged()", 'adapter.notifyDataSetChanged()'], ["liste.setOnItemClickListener(...)", "setOnItemClickListener", 'setOnItemClickListener'], ["un nouveau setContentView", "setContentView jdid", 'a new setContentView']], 0,
    ["Modifier la liste ne met pas l'écran à jour : il faut **notifier** l'adaptateur.", "Khass notify.", 'You must **notify** the adapter.'],
    [["Ça gère les clics.", "Clics.", 'That handles clicks.'], ["Recharger le layout est inutile.", "Ma kaynfa3ch.", 'Reloading the layout is useless.']], ['listview', 'maj']),
  multi('mob-53', 1, ["Quelles sont les **3 méthodes à redéfinir** dans un `RecyclerView.Adapter` ?", "Ach homa **3 méthodes** dyal `RecyclerView.Adapter` ?", 'Which are the **3 methods to override** in a `RecyclerView.Adapter`?'],
    [['onCreateViewHolder', 'onCreateViewHolder', 'onCreateViewHolder'], ['onBindViewHolder', 'onBindViewHolder', 'onBindViewHolder'], ['getItemCount', 'getItemCount', 'getItemCount'], ['getView', 'getView', 'getView'], ['onCreate', 'onCreate', 'onCreate']], [0, 1, 2],
    ["**onCreateViewHolder** crée une ligne, **onBindViewHolder** la remplit, **getItemCount** donne le nombre.", "Create / Bind / Count.", 'Create / Bind / Count.'],
    [["getView est la méthode des adaptateurs de **ListView**.", "getView = ListView.", 'getView is for **ListView** adapters.'], ["onCreate appartient à l'Activity.", "onCreate = Activity.", 'onCreate belongs to the Activity.']], ['recycler', 'methodes']),
  single('mob-54', 2, ["Laquelle des 3 méthodes est appelée **à chaque fois** qu'une ligne devient visible, même recyclée ?", "Ach mn méthode kat3ayet **f kol mra** ligne katban, 7tta m-recycliya ?", 'Which method runs **every time** a row becomes visible, even recycled?'],
    [['onBindViewHolder(holder, position)', 'onBindViewHolder', 'onBindViewHolder'], ['onCreateViewHolder(parent, viewType)', 'onCreateViewHolder', 'onCreateViewHolder'], ['getItemCount()', 'getItemCount', 'getItemCount']], 0,
    ["onCreateViewHolder n'est appelée que s'il n'y a **aucune ligne à recycler** ; onBindViewHolder remplit **chaque** ligne affichée.", "onBind f kol ligne.", 'onBind fills every shown row.'],
    [["Seulement quelques fois (pas de ligne à recycler).", "Chi mrat bach.", 'Only a few times.'], ["Elle donne juste le nombre d'éléments.", "Ghir 3adad.", 'Just the count.']], ['recycler', 'methodes']),
  order('mob-55', 2, ["Mettre en place un RecyclerView dans onCreate : ordre.", "Tartib dyal RecyclerView f onCreate.", 'Setting up a RecyclerView in onCreate: order.'],
    ['setContentView(R.layout.activity_main);', 'List<Contact> contacts = … (remplir la liste)', 'RecyclerView recycler = findViewById(R.id.recycler);', 'recycler.setLayoutManager(new LinearLayoutManager(this));', 'recycler.setAdapter(new ContactAdapter(contacts));'],
    ["Charger l'interface, préparer les données, récupérer le RecyclerView, LayoutManager, puis adaptateur.", "Interface → data → recycler → LayoutManager → adapter.", 'UI → data → recycler → LayoutManager → adapter.'], ['recycler']),
  multi('mob-56', 3, ["Le RecyclerView reste **vide**. Causes possibles ?", "RecyclerView **khawi**. Asbab ?", 'The RecyclerView stays **empty**. Possible causes?'],
    [["Pas de setLayoutManager", "Bla setLayoutManager", 'No setLayoutManager'], ["getItemCount() renvoie 0", "getItemCount() = 0", 'getItemCount() returns 0'], ["La liste de données est vide", "Liste khawya", 'The data list is empty'], ["Le ViewHolder est une classe static", "ViewHolder static", 'The ViewHolder is static']], [0, 1, 2],
    ["Les trois oublis classiques. Un ViewHolder `static` est normal (et recommandé).", "3 classiques.", 'The three classics.'],
    [["static est correct.", "static mzyan.", 'static is fine.']], ['recycler', 'pieges']),
  single('mob-57', 3, ["Dans onCreateViewHolder, `inflate(R.layout.item_contact, parent, false)` : pourquoi **false** ?", "3lach **false** f inflate ?", 'Why **false** in inflate?'],
    [["C'est le RecyclerView qui ajoute la ligne lui-même ; true la rattacherait deux fois et ferait planter", "RecyclerView howa li kayzid ligne", 'The RecyclerView attaches the row itself; true would attach it twice and crash'], ["Pour cacher la ligne", "Bach tkhabbi ligne", 'To hide the row'], ["Pour ne pas créer de ViewHolder", "Bla ViewHolder", 'To avoid a ViewHolder']], 0,
    ["`attachToRoot = false` : on gonfle la vue avec les paramètres du parent, sans l'y ajouter.", "attachToRoot = false.", '`attachToRoot = false`.'],
    [NO, NO], ["recycler", "pieges"]),
  single('mob-58', 2, ["Quel avantage principal a RecyclerView sur ListView ?", "Chnou ahsan f RecyclerView 3la ListView ?", 'Main advantage of RecyclerView over ListView?'],
    [["Recyclage imposé (ViewHolder) et disposition libre via le LayoutManager", "Recyclage mfroud + LayoutManager", 'Enforced recycling and flexible LayoutManager'], ["Moins de code à écrire", "Code 9lil", 'Less code'], ["Un setOnItemClickListener intégré", "setOnItemClickListener mojoud", 'Built-in item click listener']], 0,
    ["Seules les lignes visibles ont une vue ; liste, grille ou horizontale selon le LayoutManager.", "Ghir lignes bayna.", 'Only visible rows have views.'],
    [["Au contraire : plus de code.", "L3eks.", 'The opposite.'], ["C'est ListView qui l'a ; RecyclerView non.", "ListView 3andha.", 'ListView has it, not RecyclerView.']], ['comparaison'])
];

setCtx('mobile', 'traces');
const q7 = [
  single('mob-60', 3, ["`compteur` (attribut, 0 au départ) est incrémenté dans onResume. Après lancement puis rotation, que vaut compteur ?", "compteur++ f onResume. Mor lancement w rotation ?", 'Counter incremented in onResume. After launch then rotation?'],
    [['1', '1', '1'], ['2', '2', '2'], ['0', '0', '0']], 0,
    ["La rotation crée une **nouvelle instance** : compteur repart à 0 puis onResume → 1.", "Instance jdida → 0 → 1.", 'New instance → 0 → 1.'],
    [["Ce serait vrai sans destruction (retour depuis Accueil).", "Bla destruction.", 'Only without destruction.'], ["onResume est appelée après la recréation.", "onResume kat3ayet.", 'onResume runs after recreation.']], ['trace']),
  order('mob-61', 3, ["A (au premier plan) ouvre B. Trace des Log.d placés dans onPause, onCreate, onResume, onStop.", "A kat7el B : trace.", 'A opens B: trace.'],
    ['A.onPause', 'B.onCreate', 'B.onResume', 'A.onStop'],
    ["A perd le premier plan, B se crée et devient interactive, puis A n'est plus visible.", "A.onPause → B → A.onStop.", 'A.onPause → B → A.onStop.'], ['trace'])
];

// ================= Exercices =================
setCtx('mobile', 'ecran');
const exs = [
  ex('mob-x-1', 2, ["Écrire le onCreate d'un écran", "Kteb onCreate dyal écran", "Write a screen's onCreate"],
    ["Le layout `activity_main.xml` contient un TextView d'id `titre`. strings.xml contient `<string name=\"bienvenue\">Bienvenue</string>`. Écris le onCreate() de MainActivity qui affiche l'écran puis met ce texte dans le TextView.", "Layout fih TextView id `titre`, strings fih `bienvenue`. Kteb onCreate() li kaybyen l écran w kay7et texte f TextView.", "The layout has a TextView with id `titre`; strings.xml has `bienvenue`. Write MainActivity.onCreate() to show the screen and put that text in the TextView."],
    [["Quel ordre entre setContentView et findViewById ?", "Ach lowel : setContentView wla findViewById ?", 'Which comes first?']],
    [{ t: ['Solution', 'Solution', 'Solution'], b: ["super.onCreate, puis charger l'interface, puis récupérer la vue, puis lui donner le texte de strings.xml.", "super, setContentView, findViewById, setText.", 'super, setContentView, findViewById, setText.'], code: '@Override\nprotected void onCreate(Bundle savedInstanceState) {\n    super.onCreate(savedInstanceState);\n    setContentView(R.layout.activity_main);\n    TextView titre = findViewById(R.id.titre);\n    titre.setText(R.string.bienvenue);\n}' }],
    ["super.onCreate → setContentView(R.layout.activity_main) → findViewById(R.id.titre) → setText(R.string.bienvenue).", "super → setContentView → findViewById → setText.", 'super → setContentView → findViewById → setText.'],
    [["findViewById avant setContentView (null).", "findViewById 9bel setContentView.", 'findViewById before setContentView (null).'], ["Écrire R.layout.activity_main.xml.", "R.layout b .xml.", 'Writing R.layout.activity_main.xml.'], ["Oublier super.onCreate(...).", "Nsit super.", 'Forgetting super.onCreate(...).']]),
  ex('mob-x-2', 2, ["Compléter le manifeste", "Kmmel manifeste", 'Complete the manifest'],
    ["L'application a deux écrans, MainActivity (écran de démarrage) et DetailActivity, et charge des données depuis Internet. Écris les éléments à mettre dans AndroidManifest.xml.", "Jouj écrans (MainActivity lowel, DetailActivity) w Internet. Kteb chnou f manifeste.", 'Two screens (MainActivity launcher, DetailActivity) and Internet access. Write the manifest entries.'],
    [["Le manifeste déclare les composants **et** les permissions.", "Composants + permissions.", 'Components and permissions.']],
    [{ t: ['Permission', 'Permission', 'Permission'], b: ["Hors de `<application>`.", "Barra `<application>`.", 'Outside `<application>`.'], code: '<uses-permission android:name="android.permission.INTERNET" />' },
     { t: ['Activity', 'Activity', 'Activities'], b: ["MainActivity avec MAIN + LAUNCHER ; DetailActivity simplement déclarée.", "MainActivity b MAIN + LAUNCHER ; DetailActivity declarée.", 'MainActivity with MAIN + LAUNCHER; DetailActivity declared.'], code: '<application android:label="@string/app_name">\n    <activity android:name=".MainActivity" android:exported="true">\n        <intent-filter>\n            <action android:name="android.intent.action.MAIN" />\n            <category android:name="android.intent.category.LAUNCHER" />\n        </intent-filter>\n    </activity>\n    <activity android:name=".DetailActivity" />\n</application>' }],
    ["Une uses-permission INTERNET + deux balises activity (MainActivity avec l'intent-filter MAIN/LAUNCHER).", "INTERNET + 2 activity.", 'INTERNET permission + two activity tags.'],
    [["Oublier de déclarer DetailActivity (plantage à l'ouverture).", "Nsit DetailActivity.", 'Forgetting DetailActivity (crash).'], ["Mettre la permission dans le layout.", "Permission f layout.", 'Putting the permission in the layout.']])
];
setCtx('mobile', 'cycle');
exs.push(
  ex('mob-x-3', 3, ["Suivre un scénario complet", "Tba3 scénario kamel", 'Follow a full scenario'],
    ["Donne toutes les méthodes appelées, dans l'ordre : (1) l'utilisateur lance l'application ; (2) il appuie sur Accueil ; (3) il revient ; (4) il tourne l'écran. Indique à chaque fois si c'est la même instance.", "3ti ga3 méthodes : lancement, Accueil, rjou3, rotation. W wach nefs instance.", 'List every method in order: launch, Home, return, rotate. Same instance each time?'],
    [["Raisonne avec les paires onCreate/onDestroy, onStart/onStop, onResume/onPause.", "Les paires.", 'Use the method pairs.']],
    [{ t: ['(1) Lancement', '(1) Lancement', '(1) Launch'], b: ["onCreate, onStart, onResume — instance n°1.", "Instance 1.", 'Instance #1.'] },
     { t: ['(2) Accueil', '(2) Accueil', '(2) Home'], b: ["onPause, onStop — instance n°1 conservée.", "Instance 1 ba9ya.", 'Instance #1 kept.'] },
     { t: ['(3) Retour', '(3) Rjou3', '(3) Return'], b: ["onRestart, onStart, onResume — **même instance**, pas de onCreate.", "Nefs instance.", '**Same instance**, no onCreate.'] },
     { t: ['(4) Rotation', '(4) Rotation', '(4) Rotation'], b: ["onPause, onStop, onDestroy, puis onCreate, onStart, onResume — **nouvelle instance** (n°2).", "Instance jdida.", '**New instance** (#2).'] }],
    ["onCreate, onStart, onResume / onPause, onStop / onRestart, onStart, onResume / onPause, onStop, onDestroy, onCreate, onStart, onResume.", "Les 4 séquences.", 'The four sequences.'],
    [["Mettre onCreate au retour (3).", "onCreate f rjou3.", 'onCreate on return.'], ["Oublier onRestart.", "Nsit onRestart.", 'Forgetting onRestart.'], ["Croire que la rotation garde la même instance.", "Rotation = nefs instance (ghalat).", 'Thinking rotation keeps the instance.']]),
  ex('mob-x-4', 3, ["Deux écrans : aller-retour", "Jouj écrans : mchi w rjou3", 'Two screens: there and back'],
    ["MainActivity (A) est au premier plan. L'utilisateur clique sur un contact, ce qui ouvre DetailActivity (B). Puis il appuie sur Retour. Donne les méthodes appelées sur A et B, dans l'ordre.", "A f l9eddam, kat7el B, w men b3d Retour. Méthodes dyal A w B.", 'A in front opens B, then Back. Methods on A and B, in order.'],
    [["Au départ de B, A perd d'abord le premier plan.", "A.onPause lowel.", 'A.onPause first.'], ["Au retour, B est terminée.", "B katsali.", 'On Back, B is finished.']],
    [{ t: ['Ouverture de B', '7ellan B', 'Opening B'], b: ["A.onPause → B.onCreate → B.onStart → B.onResume → A.onStop.", "A.onPause → B… → A.onStop.", 'A.onPause → B… → A.onStop.'] },
     { t: ['Retour vers A', 'Rjou3 l A', 'Back to A'], b: ["B.onPause → A.onRestart → A.onStart → A.onResume → B.onStop → B.onDestroy. A revient **sans onCreate**.", "B.onPause → A.onRestart… → B.onDestroy.", 'B.onPause → A.onRestart… → B.onDestroy.'] }],
    ["Aller : A.onPause, B.onCreate, B.onStart, B.onResume, A.onStop. Retour : B.onPause, A.onRestart, A.onStart, A.onResume, B.onStop, B.onDestroy.", "Mchi w rjou3.", 'There and back.'],
    [["Détruire A à l'ouverture de B.", "Tmse7 A.", 'Destroying A.'], ["Mettre A.onStop avant le démarrage de B.", "A.onStop 9bel B.", 'A.onStop before B starts.']])
);
setCtx('mobile', 'dimensions');
exs.push(
  ex('mob-x-5', 2, ["Convertir dp et sp en pixels", "7seb dp w sp b pixels", 'Convert dp and sp to pixels'],
    ["a) Un bouton fait 48dp de large. Combien de pixels sur un écran hdpi (240 dpi) et xxhdpi (480 dpi) ? b) Un texte de 18sp, sur un écran xhdpi (320 dpi), quand l'utilisateur règle la police à ×1,3 ?", "a) 48dp f 240 w 480 dpi. b) 18sp f 320 dpi, police ×1,3.", 'a) 48dp at 240 and 480 dpi. b) 18sp at 320 dpi, font ×1.3.'],
    [["px = dp × dpi / 160.", "px = dp × dpi / 160.", 'px = dp × dpi / 160.']],
    [{ t: ['a) dp', 'a) dp', 'a) dp'], b: ["hdpi : 48 × 240/160 = 48 × 1,5 = **72 px**. xxhdpi : 48 × 3 = **144 px**. Même taille physique.", "72 px w 144 px.", '72 px and 144 px.'], tex: '48 \\times \\tfrac{240}{160} = 72 \\qquad 48 \\times \\tfrac{480}{160} = 144' },
     { t: ['b) sp', 'b) sp', 'b) sp'], b: ["18 × 2 (densité) × 1,3 (police) = **46,8 ≈ 47 px** (calcul linéaire).", "18 × 2 × 1,3 ≈ 47 px.", '18 × 2 × 1.3 ≈ 47 px.'], tex: '18 \\times \\tfrac{320}{160} \\times 1{,}3 = 46{,}8' }],
    ["a) 72 px et 144 px. b) ≈ 47 px.", "72 / 144 / 47.", '72 / 144 / ≈47 px.'],
    [["Diviser au lieu de multiplier.", "9ssem f blast tdreb.", 'Dividing instead of multiplying.'], ["Oublier le facteur de police pour sp.", "Nsit facteur police.", 'Forgetting the font factor.']]),
  ex('mob-x-6', 3, ["Corriger un layout", "Sse7 layout", 'Fix a layout'],
    ["Trouve et corrige les 3 erreurs de ce bouton placé dans un ConstraintLayout : `<Button android:layout_width=\"match_parent\" android:layout_height=\"wrap_content\" android:text=\"Valider\" android:textSize=\"20px\" app:layout_constraintTop_toTopOf=\"parent\" />`", "L9a w sse7 3 erreurs f had bouton f ConstraintLayout.", 'Find and fix the 3 mistakes in this button inside a ConstraintLayout.'],
    [["Regarde l'unité du texte, le texte en dur et la largeur dans un ConstraintLayout.", "Unité, texte direct, l3ard.", 'Unit, hard-coded text, width.']],
    [{ t: ['Erreurs', 'Erreurs', 'Mistakes'], b: ["1) textSize en **px** → **sp**. 2) Texte en dur → **@string/valider**. 3) **match_parent** dans un ConstraintLayout → **0dp** + contraintes Start et End.", "px → sp ; texte → @string ; match_parent → 0dp + contraintes.", 'px → sp; hard-coded → @string; match_parent → 0dp + constraints.'] },
     { t: ['Correction', 'Correction', 'Fixed'], b: ["Version corrigée :", "Version msse7a :", 'Fixed version:'], code: '<Button\n    android:layout_width="0dp"\n    android:layout_height="wrap_content"\n    android:text="@string/valider"\n    android:textSize="18sp"\n    app:layout_constraintStart_toStartOf="parent"\n    app:layout_constraintEnd_toEndOf="parent"\n    app:layout_constraintTop_toTopOf="parent" />' }],
    ["sp pour le texte, @string pour le libellé, 0dp + Start/End pour la largeur.", "sp, @string, 0dp.", 'sp, @string, 0dp + Start/End.'],
    [["Mettre 0dp sans ajouter les contraintes Start et End.", "0dp bla contraintes.", '0dp without Start/End.'], ["Remplacer px par dp pour le texte.", "dp l texte.", 'Using dp for text.']])
);

setCtx('mobile', 'navigation');
exs.push(
  ex('mob-x-7', 2, ["Envoyer et lire un contact", "Sifet w 9ra contact", 'Send and read a contact'],
    ["Au clic sur le bouton `bouton_detail` de MainActivity, ouvre DetailActivity en lui passant le nom « Youssef » et l'âge 23. Dans DetailActivity, affiche « Youssef, 23 ans » dans le TextView `texte_detail`.", "F click 3la `bouton_detail`, 7el DetailActivity b smiya « Youssef » w 3mr 23. F DetailActivity, werri « Youssef, 23 ans » f `texte_detail`.", 'On click of `bouton_detail`, open DetailActivity with name "Youssef" and age 23; display "Youssef, 23 ans" in `texte_detail`.'],
    [["Mêmes clés des deux côtés ; getIntExtra demande une valeur par défaut.", "Nefs clés ; défaut l int.", 'Same keys; default for int.']],
    [{ t: ['MainActivity', 'MainActivity', 'MainActivity'], b: ["Écouteur de clic, Intent explicite, deux putExtra, startActivity.", "Listener, Intent, putExtra, startActivity.", 'Listener, Intent, putExtra, startActivity.'], code: 'Button bouton = findViewById(R.id.bouton_detail);\nbouton.setOnClickListener(v -> {\n    Intent intent = new Intent(MainActivity.this, DetailActivity.class);\n    intent.putExtra("nom", "Youssef");\n    intent.putExtra("age", 23);\n    startActivity(intent);\n});' },
     { t: ['DetailActivity', 'DetailActivity', 'DetailActivity'], b: ["Dans onCreate, après setContentView.", "F onCreate, mor setContentView.", 'In onCreate, after setContentView.'], code: 'setContentView(R.layout.activity_detail);\nString nom = getIntent().getStringExtra("nom");\nint age = getIntent().getIntExtra("age", 0);\nTextView texte = findViewById(R.id.texte_detail);\ntexte.setText(nom + ", " + age + " ans");' }],
    ["putExtra(\"nom\"/\"age\") + startActivity dans A ; getStringExtra(\"nom\") et getIntExtra(\"age\", 0) dans B ; DetailActivity déclarée dans le manifeste.", "putExtra / getXxxExtra + manifeste.", 'putExtra / getXxxExtra + manifest.'],
    [["`new Intent(this, …)` dans l'écouteur : `this` n'est pas l'Activity dans une classe anonyme.", "this f classe anonyme.", '`this` in an anonymous class.'], ["Lire l'âge avec getStringExtra (null).", "getStringExtra l int.", 'Reading the age with getStringExtra.'], ["Oublier la déclaration dans le manifeste.", "Nsit manifeste.", 'Forgetting the manifest.']]),
  ex('mob-x-8', 3, ["Renvoyer un résultat", "Rj3 résultat", 'Return a result'],
    ["DetailActivity a un bouton « Ajouter aux favoris ». Au clic, elle doit renvoyer à MainActivity le booléen favori = true puis se fermer. MainActivity affiche alors un Toast « Ajouté aux favoris ». Écris le code des deux côtés.", "B katrj3 favori = true w katsedd ; A katwerri Toast. Kteb jouj jnab.", 'B returns favori = true and closes; A shows a Toast. Write both sides.'],
    [["Côté A : registerForActivityResult + launch. Côté B : setResult puis finish.", "A : register + launch ; B : setResult + finish.", 'A: register + launch; B: setResult + finish.']],
    [{ t: ['A — lanceur', 'A — lanceur', 'A — launcher'], b: ["Attribut de MainActivity, puis `lanceur.launch(intent)` au lieu de startActivity.", "Attribut + launch.", 'Field + launch.'], code: 'private final ActivityResultLauncher<Intent> lanceur = registerForActivityResult(\n        new ActivityResultContracts.StartActivityForResult(),\n        result -> {\n            if (result.getResultCode() == RESULT_OK && result.getData() != null\n                    && result.getData().getBooleanExtra("favori", false)) {\n                Toast.makeText(this, "Ajouté aux favoris", Toast.LENGTH_SHORT).show();\n            }\n        });\n\n// au clic :\nlanceur.launch(new Intent(MainActivity.this, DetailActivity.class));' },
     { t: ['B — réponse', 'B — jawab', 'B — reply'], b: ["setResult **avant** finish.", "setResult 9bel finish.", 'setResult **before** finish.'], code: 'Button fav = findViewById(R.id.bouton_favori);\nfav.setOnClickListener(v -> {\n    Intent data = new Intent();\n    data.putExtra("favori", true);\n    setResult(RESULT_OK, data);\n    finish();\n});' }],
    ["A : registerForActivityResult(StartActivityForResult) + launch ; B : putExtra + setResult(RESULT_OK, data) + finish().", "register / setResult / finish.", 'register / setResult / finish.'],
    [["Appeler finish() avant setResult.", "finish 9bel setResult.", 'finish before setResult.'], ["Relancer A avec startActivity au lieu de finish().", "startActivity l A.", 'Restarting A with startActivity.'], ["Ne pas tester RESULT_OK.", "Bla RESULT_OK.", 'Not checking RESULT_OK.']])
);
setCtx('mobile', 'constraint');
exs.push(
  ex('mob-x-9', 3, ["Lire un layout et le dessiner", "9ra layout w rsmo", 'Read and sketch a layout'],
    ["Décris et dessine l'écran : TextView `titre` (Top → parent, Start → parent, End → parent, marginTop 24dp) ; EditText `email` (largeur 0dp, Top → bas de titre, Start → parent, End → parent, marges 16dp) ; EditText `mdp` (largeur 0dp, Top → bas de email, Start → début de email, End → fin de email) ; Button `connexion` (Top → bas de mdp, End → fin de mdp) ; TextView `oubli` (Top → bas de mdp, Start → début de mdp).", "Wsef w rsem l écran dyal login.", 'Describe and sketch this login screen.'],
    [["Pour chaque vue : horizontale, verticale, puis la règle (collée, centrée, étirée).", "L kol view : horizontale, verticale, règle.", 'Per view: horizontal, vertical, rule.']],
    [{ t: ['titre', 'titre', 'titre'], b: ["Start et End → parent : **centré** ; en haut à 24dp.", "F lwest, lfo9.", 'Centred, at the top.'] },
     { t: ['email', 'email', 'email'], b: ["0dp entre les deux bords (16dp) : **pleine largeur**, sous le titre.", "L3ard kamel ta7t titre.", 'Full width under the title.'] },
     { t: ['mdp', 'mdp', 'mdp'], b: ["0dp entre le début et la fin de email : **même largeur que email**, juste dessous.", "Nefs l3ard dyal email, ta7to.", 'Same width as email, below it.'] },
     { t: ['connexion et oubli', 'connexion w oubli', 'connexion and oubli'], b: ["Tous deux sous mdp : `connexion` **calé à droite** (End → fin de mdp), `oubli` **calé à gauche** (Start → début de mdp), sur la même ligne.", "Jouj ta7t mdp : connexion limn, oubli lisr.", 'Both under mdp: connexion right, oubli left.'] }],
    ["Titre centré en haut ; deux champs pleine largeur l'un sous l'autre ; dessous, « mot de passe oublié » à gauche et le bouton connexion à droite.", "Titre, 2 champs, oubli lisr w bouton limn.", 'Centred title, two full-width fields, then forgot-link left and button right.'],
    [["Centrer `connexion` (il n'a qu'une contrainte horizontale).", "Centrer connexion.", 'Centring connexion.'], ["Donner à mdp la largeur de l'écran au lieu de celle de email (ici c'est pareil grâce aux contraintes, mais il faut le justifier).", "Mdp = email.", 'mdp follows email.']]),
  ex('mob-x-10', 3, ["Corriger les contraintes", "Sse7 contraintes", 'Fix the constraints'],
    ["Dans l'éditeur le bouton `valider` apparaît en bas à droite, mais sur le téléphone il est en haut à gauche. Son XML : `layout_marginEnd=\"16dp\"`, `layout_marginBottom=\"16dp\"`, aucune contrainte. Explique et corrige.", "F éditeur bouton lte7t limn, f téléphone lfo9 lisr. Bla contraintes. Fesser w sse7.", 'Bottom-right in the editor, top-left on the phone; no constraints. Explain and fix.'],
    [["Règle 1 et règle 5.", "Règle 1 w 5.", 'Rules 1 and 5.']],
    [{ t: ['Explication', 'Charh', 'Explanation'], b: ["Sans contrainte horizontale ni verticale, la vue est placée en (0, 0) à l'exécution ; la position de l'éditeur n'est qu'un aperçu. Les marges sont ignorées car aucun côté n'est contraint.", "Bla contraintes → (0, 0) ; marges ignorées.", 'No constraints → (0, 0); margins ignored.'] },
     { t: ['Correction', 'Correction', 'Fix'], b: ["Attacher la fin et le bas au parent : les marges deviennent actives.", "Rbet End w Bottom b parent.", 'Attach End and Bottom to the parent.'], code: '<Button\n    android:id="@+id/valider"\n    android:layout_width="wrap_content"\n    android:layout_height="wrap_content"\n    android:layout_marginEnd="16dp"\n    android:layout_marginBottom="16dp"\n    android:text="@string/valider"\n    app:layout_constraintEnd_toEndOf="parent"\n    app:layout_constraintBottom_toBottomOf="parent" />' }],
    ["Ajouter End_toEndOf=\"parent\" et Bottom_toBottomOf=\"parent\".", "End + Bottom → parent.", 'Add End and Bottom → parent.'],
    [["Ajouter seulement des marges plus grandes.", "Ghir marges.", 'Only adding bigger margins.'], ["Ajouter Start ET End : le bouton serait centré, pas à droite.", "Start w End = f lwest.", 'Start AND End would centre it.']])
);

setCtx('mobile', 'listes');
exs.push(
  ex('mob-x-11', 3, ["Écrire les 3 méthodes d'un RecyclerView.Adapter", "Kteb 3 méthodes dyal RecyclerView.Adapter", "Write a RecyclerView.Adapter's 3 methods"],
    ["On a `List<Produit> produits` (getNom(), getPrix()) et le layout `item_produit.xml` avec deux TextView `item_nom` et `item_prix`. Le ViewHolder `ProduitViewHolder` est déjà écrit (champs `nom` et `prix`). Écris onCreateViewHolder, onBindViewHolder et getItemCount.", "Kteb 3 méthodes l produits.", 'Write the 3 methods for products.'],
    [["Create = inflate + new ViewHolder ; Bind = get(position) + setText ; Count = size().", "Create / Bind / Count.", 'Create / Bind / Count.']],
    [{ t: ['onCreateViewHolder', 'onCreateViewHolder', 'onCreateViewHolder'], b: ["Gonfler la ligne (attachToRoot = false) et l'envelopper dans un ViewHolder.", "Inflate + ViewHolder.", 'Inflate + ViewHolder.'], code: '@Override\npublic ProduitViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {\n    View v = LayoutInflater.from(parent.getContext())\n            .inflate(R.layout.item_produit, parent, false);\n    return new ProduitViewHolder(v);\n}' },
     { t: ['onBindViewHolder', 'onBindViewHolder', 'onBindViewHolder'], b: ["Lire l'élément de la position et remplir les vues du holder. Le prix est un nombre : le convertir en texte.", "get(position) + setText ; prix → texte.", 'get(position) + setText; convert price to text.'], code: '@Override\npublic void onBindViewHolder(ProduitViewHolder holder, int position) {\n    Produit p = produits.get(position);\n    holder.nom.setText(p.getNom());\n    holder.prix.setText(p.getPrix() + " DH");\n}' },
     { t: ['getItemCount', 'getItemCount', 'getItemCount'], b: ["Le nombre de lignes = taille de la liste.", "Taille dyal liste.", 'List size.'], code: '@Override\npublic int getItemCount() {\n    return produits.size();\n}' }],
    ["inflate(…, parent, false) + new ProduitViewHolder ; produits.get(position) + setText ; return produits.size().", "Create / Bind / Count.", 'Create / Bind / Count.'],
    [["`setText(p.getPrix())` avec un int : Android le prend pour un id de ressource → plantage (Resources$NotFoundException).", "setText(int) = id ressource.", 'setText(int) is treated as a resource id.'], ["Laisser `return 0;` dans getItemCount.", "return 0.", 'Leaving return 0.'], ["inflate avec true.", "inflate true.", 'inflate with true.']]),
  ex('mob-x-12', 2, ["Passer d'une ListView à un écran de détail", "Mn ListView l détail", 'From a ListView to a detail screen'],
    ["Une ListView affiche `ArrayList<String> villes` avec un ArrayAdapter. Au clic sur une ville, ouvre `VilleActivity` en lui passant le nom de la ville, puis affiche-le dans VilleActivity.", "Click 3la ville → VilleActivity b smiya.", 'Tap a city → open VilleActivity with its name.'],
    [["position → villes.get(position) → putExtra.", "position → get → putExtra.", 'position → get → putExtra.']],
    [{ t: ['MainActivity', 'MainActivity', 'MainActivity'], b: ["Adaptateur + écouteur de clic.", "Adaptateur + listener.", 'Adapter + listener.'], code: 'ListView liste = findViewById(R.id.liste);\nliste.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, villes));\nliste.setOnItemClickListener((parent, view, position, id) -> {\n    Intent intent = new Intent(MainActivity.this, VilleActivity.class);\n    intent.putExtra("ville", villes.get(position));\n    startActivity(intent);\n});' },
     { t: ['VilleActivity', 'VilleActivity', 'VilleActivity'], b: ["Dans onCreate, après setContentView.", "F onCreate.", 'In onCreate.'], code: 'String ville = getIntent().getStringExtra("ville");\nTextView titre = findViewById(R.id.titre_ville);\ntitre.setText(ville);' }],
    ["setOnItemClickListener → villes.get(position) → putExtra(\"ville\") → startActivity ; getStringExtra(\"ville\") dans VilleActivity (déclarée dans le manifeste).", "Click → putExtra → getStringExtra.", 'Click → putExtra → getStringExtra.'],
    [["Utiliser `id` au lieu de `position` pour lire la liste.", "id f blast position.", 'Using id instead of position.'], ["Oublier VilleActivity dans le manifeste.", "Nsit manifeste.", 'Forgetting the manifest.']])
);

// ================= Flashcards =================
setCtx('mobile', 'ecran');
const fcs = [
  fc('fc-mob-1', ['Android Studio ?', 'Android Studio ?', 'Android Studio?'], ["IDE : éditeur de code et de layouts, débogueur, émulateur, Logcat.", "IDE : éditeur w débogueur.", 'IDE: editor, debugger, emulator, Logcat.']),
  fc('fc-mob-2', ['SDK Android ?', 'SDK Android ?', 'Android SDK?'], ["Ensemble des API et des outils Android nécessaires pour construire l'application.", "API + outils bach tbni l'app.", 'APIs and tools needed to build the app.']),
  fc('fc-mob-3', ['activity_main.xml ?', 'activity_main.xml ?', 'activity_main.xml?'], ["Décrit les composants et leur disposition.", "Composants w disposition.", 'Components and their layout.']),
  fc('fc-mob-4', ['strings.xml ?', 'strings.xml ?', 'strings.xml?'], ["Centralise les textes : réutilisation et traduction.", "Textes : réutilisation + traduction.", 'Central texts: reuse and translation.']),
  fc('fc-mob-5', ['AndroidManifest.xml ?', 'AndroidManifest.xml ?', 'AndroidManifest.xml?'], ["Déclare les composants (Activity) et les permissions.", "Activity + permissions.", 'Declares components (Activities) and permissions.']),
  fc('fc-mob-6', ['La phrase du prof ?', 'Jomla dyal prof ?', "The professor's sentence?"], ["Le XML décrit l'interface. L'Activity porte le comportement. Le manifeste décrit les composants.", "XML = interface, Activity = comportement, manifeste = composants.", 'XML = interface, Activity = behaviour, manifest = components.']),
  fc('fc-mob-7', ['setContentView(R.layout.activity_main) ?', 'setContentView ?', 'setContentView?'], ["Charge l'interface de l'Activity ; R.layout.activity_main = la ressource XML sans extension.", "Kaychargi l'interface ; bla .xml.", "Loads the interface; the XML resource without extension."]),
  fc('fc-mob-8', ['@string/app_name ?', '@string/app_name ?', '@string/app_name?'], ["Réutilise le texte déclaré dans strings.xml.", "Texte mn strings.xml.", 'Reuses the text from strings.xml.'])
];
setCtx('mobile', 'cycle');
fcs.push(
  fc('fc-mob-10', ['onCreate / onStart / onResume ?', 'onCreate / onStart / onResume ?', 'onCreate / onStart / onResume?'], ["Initialise l'Activity et son interface / devient visible / premier plan et interactive.", "Initialisation / bayna / l9eddam.", 'Initialise / visible / foreground and interactive.']),
  fc('fc-mob-11', ['onPause / onStop / onDestroy ?', 'onPause / onStop / onDestroy ?', 'onPause / onStop / onDestroy?'], ["Perd le premier plan / plus visible / fin de l'instance, si le système l'appelle.", "Fqdat l9eddam / ma bayna ch / nihaya.", 'Loses foreground / not visible / end of instance, if called.']),
  fc('fc-mob-12', ['Accueil puis retour ?', 'Accueil w rjou3 ?', 'Home then return?'], ["onPause, onStop… puis onRestart, onStart, onResume (même instance, pas de onCreate).", "onPause, onStop / onRestart, onStart, onResume.", 'onPause, onStop / onRestart, onStart, onResume.']),
  fc('fc-mob-13', ['onDestroy garanti ?', 'onDestroy garanti ?', 'Is onDestroy guaranteed?'], ["Non : le système peut tuer le processus sans l'appeler. Sauvegarder dans onPause/onStop.", "La : 7fed f onPause/onStop.", 'No: save in onPause/onStop.']),
  fc('fc-mob-14', ['Rotation ?', 'Rotation ?', 'Rotation?'], ["onPause, onStop, onDestroy, onCreate, onStart, onResume : nouvelle instance.", "Tmse7 w tsayb.", 'Destroyed and recreated.']),
  fc('fc-mob-15', ['A ouvre B ?', 'A kat7el B ?', 'A opens B?'], ["A.onPause → B.onCreate → B.onStart → B.onResume → A.onStop.", "A.onPause … A.onStop.", 'A.onPause … A.onStop.'])
);
setCtx('mobile', 'dimensions');
fcs.push(
  fc('fc-mob-20', ['dp ?', 'dp ?', 'dp?'], ["Dimensions indépendantes de la densité ; px = dp × dpi / 160. Ex. 48dp.", "px = dp × dpi / 160.", 'Density-independent; px = dp × dpi / 160.']),
  fc('fc-mob-21', ['sp ?', 'sp ?', 'sp?'], ["Taille du texte ; tient compte de la densité et du réglage de police. Ex. 18sp.", "Texte + réglage police.", 'Text size; follows the font setting.']),
  fc('fc-mob-22', ['wrap_content / match_parent ?', 'wrap_content / match_parent ?', 'wrap_content / match_parent?'], ["Taille du contenu (+ padding) / dimension que le parent attribue.", "Contenu / parent.", 'Content size / what the parent gives.']),
  fc('fc-mob-23', ['0dp en ConstraintLayout ?', '0dp f ConstraintLayout ?', '0dp in ConstraintLayout?'], ["« match constraints » : la dimension dépend des contraintes.", "match constraints.", '"match constraints".'])
);

setCtx('mobile', 'navigation');
fcs.push(
  fc('fc-mob-30', ['Ouvrir un écran ?', '7ell écran ?', 'Open a screen?'], ["new Intent(A.this, B.class) puis startActivity(intent). B déclarée dans le manifeste.", "new Intent + startActivity.", 'new Intent + startActivity; B in manifest.']),
  fc('fc-mob-31', ['Envoyer une donnée ?', 'Sifet data ?', 'Send data?'], ["intent.putExtra(\"cle\", valeur) avant startActivity.", "putExtra.", 'putExtra before startActivity.']),
  fc('fc-mob-32', ['Lire une donnée ?', '9ra data ?', 'Read data?'], ["getIntent().getStringExtra(\"cle\") / getIntExtra(\"cle\", défaut), dans onCreate de B.", "getIntent().getXxxExtra.", 'getIntent().getXxxExtra in B onCreate.']),
  fc('fc-mob-33', ['Clé absente ?', 'Clé ma kaynach ?', 'Missing key?'], ["String → null ; int/boolean → valeur par défaut.", "null / défaut.", 'null / default.']),
  fc('fc-mob-34', ['Revenir / renvoyer ?', 'Rje3 / rj3 ?', 'Go back / return?'], ["finish() ; résultat : setResult(RESULT_OK, data) + finish() dans B, registerForActivityResult dans A.", "finish ; setResult + register.", 'finish; setResult + register.']),
  fc('fc-mob-35', ['Explicite / implicite ?', 'Explicite / implicite ?', 'Explicit / implicit?'], ["Explicite : une classe de ton app. Implicite : une action (ACTION_DIAL, ACTION_VIEW) + Uri.", "Classe / action.", 'Class / action.'])
);
setCtx('mobile', 'constraint');
fcs.push(
  fc('fc-mob-40', ['Lire X_toYOf ?', 'T9ra X_toYOf ?', 'Read X_toYOf?'], ["« Mon côté X est attaché au côté Y de la cible. »", "Jenb X dyali → jenb Y dyal cible.", '"My side X → target side Y."']),
  fc('fc-mob-41', ['Contraintes minimales ?', 'A9all contraintes ?', 'Minimum constraints?'], ["Une horizontale + une verticale ; sinon la vue saute en (0, 0).", "Horizontale + verticale.", 'One horizontal + one vertical.']),
  fc('fc-mob-42', ['Un côté / deux côtés / 0dp ?', 'Jenb / jouj / 0dp ?', 'One side / two / 0dp?'], ["Collée / centrée (biais 0,5) / étirée.", "Lsse9a / west / mtmedda.", 'Stuck / centred / stretched.']),
  fc('fc-mob-43', ['Marge sans contrainte ?', 'Marge bla contrainte ?', 'Margin without constraint?'], ["Ignorée : elle n'agit que du côté contraint.", "Kat-ignora.", 'Ignored.']),
  fc('fc-mob-44', ['Start/End ou Left/Right ?', 'Start/End wla Left/Right ?', 'Start/End or Left/Right?'], ["Start/End : s'inversent en arabe (RTL).", "Start/End.", 'Start/End: flip in RTL.'])
);

setCtx('mobile', 'listes');
fcs.push(
  fc('fc-mob-50', ['Adaptateur ?', 'Adaptateur ?', 'Adapter?'], ["Pont données ↔ liste : nombre, création et remplissage des lignes.", "L9ent ra data ↔ liste.", 'Data ↔ list bridge.']),
  fc('fc-mob-51', ['ListView en 2 lignes ?', 'ListView f 2 sstour ?', 'ListView in 2 lines?'], ["new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, liste) puis setAdapter.", "ArrayAdapter + setAdapter.", 'ArrayAdapter + setAdapter.']),
  fc('fc-mob-52', ['Les 3 méthodes de RecyclerView.Adapter ?', '3 méthodes ?', 'The 3 adapter methods?'], ["onCreateViewHolder (créer/gonfler une ligne), onBindViewHolder (la remplir pour une position), getItemCount (nombre).", "Create / Bind / Count.", 'Create / Bind / Count.']),
  fc('fc-mob-53', ['ViewHolder ?', 'ViewHolder ?', 'ViewHolder?'], ["Garde les vues d'une ligne (findViewById une seule fois) ; c'est lui qui est recyclé.", "Kay7fed vues dyal ligne.", 'Holds a row\'s views; it is recycled.']),
  fc('fc-mob-54', ['RecyclerView vide ?', 'RecyclerView khawi ?', 'Empty RecyclerView?'], ["setLayoutManager oublié, getItemCount = 0, ou données vides.", "LayoutManager / 0 / khawya.", 'No LayoutManager / 0 / empty data.']),
  fc('fc-mob-55', ['Mettre à jour ?', 'Mise à jour ?', 'Update?'], ["Modifier la liste puis notifyItemInserted/Removed/Changed (ou notifyDataSetChanged).", "Beddel + notify.", 'Change then notify.'])
);

export const module: Module = {
  id: 'mobile',
  title: L(['Développement mobile', 'Développement mobile', 'Mobile development']),
  subtitle: L([
    "Préparation au contrôle — Android natif (Java) : outils, fichiers d'un écran, cycle de vie, unités et dimensions, navigation et passage de données, ConstraintLayout, ListView et RecyclerView",
    "Préparation l contrôle — Android natif (Java) : outils, fichiers dyal écran, cycle de vie, unités w dimensions, navigation w passage dyal data, ConstraintLayout, ListView w RecyclerView",
    'Test preparation — native Android (Java): tools, screen files, lifecycle, units and dimensions, navigation and data passing, ConstraintLayout, ListView and RecyclerView'
  ]),
  color: '#0f6f8f',
  icon: 'phone',
  theme: 'violet',
  chapters: ['ecran', 'cycle', 'dimensions', 'navigation', 'constraint', 'listes', 'traces'],
  upcoming: [
    { id: 'mob-prep-suite', order: 8, title: L(["Suite de la préparation (diapos restantes)", "Tkmila dyal préparation (diapos li ba9in)", 'Rest of the preparation (remaining slides)']) }
  ],
  annales: [],
  weights: { cycle: 5, navigation: 5, listes: 5, traces: 4, constraint: 4, ecran: 4, dimensions: 4 }
};

export const chapters = [c1, c2, c3, c4, c5, c6, c7];
export const questions = [...q1, ...q2, ...q3, ...q4, ...q5, ...q6, ...q7];
export const exercises = exs;
export const flashcards = fcs;
export const reference = [
  ref('r-mob-1', 'setContentView(R.layout.activity_main);', ["Charger l'interface dans onCreate()", "Chargi l'interface", 'Load the interface in onCreate()']),
  ref('r-mob-2', 'findViewById(R.id.x) · getString(R.string.x)', ["Lire une vue / un texte depuis Java", "Vue / texte mn Java", 'Read a view / string from Java']),
  ref('r-mob-3', '@string/x · @+id/x · @layout/x', ["Références de ressources dans le XML", "Références f XML", 'Resource references in XML']),
  ref('r-mob-4', '<uses-permission android:name="android.permission.INTERNET" />', ["Permission dans le manifeste", "Permission f manifeste", 'Permission in the manifest']),
  ref('r-mob-5', 'onCreate → onStart → onResume → onPause → onStop → onDestroy (+ onRestart)', ["Cycle de vie", "Cycle de vie", 'Lifecycle']),
  ref('r-mob-6', 'px = dp × dpi / 160', ["Conversion dp → px", "Conversion dp → px", 'dp → px']),
  ref('r-mob-7', 'wrap_content · match_parent · 0dp (ConstraintLayout)', ["Valeurs de dimension", "Valeurs dyal dimension", 'Dimension values']),
  ref('r-mob-8', 'new Intent(A.this, B.class) · putExtra("cle", v) · startActivity(intent)', ["Ouvrir un écran avec des données", "7ell écran b data", 'Open a screen with data']),
  ref('r-mob-9', 'getIntent().getStringExtra("cle") · getIntExtra("cle", 0)', ["Lire les données dans B", "9ra data f B", 'Read data in B']),
  ref('r-mob-10', 'setResult(RESULT_OK, data); finish(); · registerForActivityResult(...)', ["Renvoyer un résultat", "Rj3 résultat", 'Return a result']),
  ref('r-mob-11', 'app:layout_constraint{Top|Bottom|Start|End}_to{Top|Bottom|Start|End}Of="@id/x|parent"', ["Grammaire d'une contrainte", "Grammaire dyal contrainte", 'Constraint grammar']),
  ref('r-mob-13', 'new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, liste); listView.setAdapter(a);', ["ListView simple", "ListView simple", 'Simple ListView']),
  ref('r-mob-14', 'onCreateViewHolder · onBindViewHolder · getItemCount', ["Les 3 méthodes de RecyclerView.Adapter", "3 méthodes dyal adapter", 'The 3 RecyclerView.Adapter methods']),
  ref('r-mob-15', 'recycler.setLayoutManager(new LinearLayoutManager(this)); recycler.setAdapter(adapter);', ["Brancher un RecyclerView", "Rbet RecyclerView", 'Wire a RecyclerView']),
  ref('r-mob-16', 'notifyItemInserted(i) · notifyItemRemoved(i) · notifyItemChanged(i) · notifyDataSetChanged()', ["Mettre à jour la liste", "Mise à jour", 'Update the list']),
  ref('r-mob-12', 'layout_constraintHorizontal_bias="0.5" · layout_constraintBaseline_toBaselineOf', ["Biais et alignement de texte", "Biais w alignement", 'Bias and baseline'])
];
export const missions = [];
