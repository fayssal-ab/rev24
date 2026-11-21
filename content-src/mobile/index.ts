import { c1, c2, c3 } from './course';
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

export const module: Module = {
  id: 'mobile',
  title: L(['Développement mobile', 'Développement mobile', 'Mobile development']),
  subtitle: L([
    "Préparation au contrôle — Android natif (Java) : outils, fichiers d'un écran, cycle de vie d'une Activity, unités et dimensions",
    "Préparation l contrôle — Android natif (Java) : outils, fichiers dyal écran, cycle de vie, unités w dimensions",
    'Test preparation — native Android (Java): tools, screen files, Activity lifecycle, units and dimensions'
  ]),
  color: '#0f6f8f',
  icon: 'phone',
  theme: 'violet',
  chapters: ['ecran', 'cycle', 'dimensions'],
  upcoming: [
    { id: 'mob-prep-suite', order: 4, title: L(["Suite de la préparation (diapos 5 à 10)", "Tkmila dyal préparation (diapos 5 7tta 10)", 'Rest of the preparation (slides 5 to 10)']) }
  ],
  annales: [],
  weights: { cycle: 5, ecran: 4, dimensions: 4 }
};

export const chapters = [c1, c2, c3];
export const questions = [...q1, ...q2, ...q3];
export const exercises = exs;
export const flashcards = fcs;
export const reference = [
  ref('r-mob-1', 'setContentView(R.layout.activity_main);', ["Charger l'interface dans onCreate()", "Chargi l'interface", 'Load the interface in onCreate()']),
  ref('r-mob-2', 'findViewById(R.id.x) · getString(R.string.x)', ["Lire une vue / un texte depuis Java", "Vue / texte mn Java", 'Read a view / string from Java']),
  ref('r-mob-3', '@string/x · @+id/x · @layout/x', ["Références de ressources dans le XML", "Références f XML", 'Resource references in XML']),
  ref('r-mob-4', '<uses-permission android:name="android.permission.INTERNET" />', ["Permission dans le manifeste", "Permission f manifeste", 'Permission in the manifest']),
  ref('r-mob-5', 'onCreate → onStart → onResume → onPause → onStop → onDestroy (+ onRestart)', ["Cycle de vie", "Cycle de vie", 'Lifecycle']),
  ref('r-mob-6', 'px = dp × dpi / 160', ["Conversion dp → px", "Conversion dp → px", 'dp → px']),
  ref('r-mob-7', 'wrap_content · match_parent · 0dp (ConstraintLayout)', ["Valeurs de dimension", "Valeurs dyal dimension", 'Dimension values'])
];
export const missions = [];
