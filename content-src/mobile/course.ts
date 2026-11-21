import { L, h, p, def, plain, example, steps, tip, trap, exam, table, code, anim, quiz, formula } from '../lib';
import type { Chapter } from '../../src/lib/schema';

/**
 * Développement mobile (4IIR G22) — Préparation au contrôle, Android natif (Java).
 * Source: the professor's "Préparation au contrôle" slides (A. Berahal), slides 2 to 4, plus the class notes.
 */

// ======================================================================
// Chapitre 1 — Outils et fichiers d'un écran
// ======================================================================
export const c1: Chapter = {
  id: 'ecran',
  module: 'mobile',
  order: 1,
  title: L(["Outils, fichiers et affichage d'un écran", "Les outils, les fichiers w kifach kayban écran", 'Tools, files and displaying a screen']),
  summary: L([
    "Android Studio et le SDK Android, les trois fichiers d'un écran (layout, strings.xml, AndroidManifest.xml) et leur responsabilité, puis le lien entre le code Java et les ressources : setContentView, la classe R, @string.",
    "Android Studio w SDK Android, tlata d fichiers dyal écran (layout, strings.xml, AndroidManifest.xml) w chkoun kaydir ach, w men b3d l3alaqa bin code Java w les ressources : setContentView, la classe R, @string.",
    "Android Studio and the Android SDK, the three files of a screen (layout, strings.xml, AndroidManifest.xml) and what each is responsible for, then the link between Java code and resources: setContentView, the R class, @string."
  ]),
  estimatedMinutes: 35,
  sections: [
    h(["1. Android Studio et le SDK Android : qui fait quoi ?", "1. Android Studio w SDK Android : chkoun kaydir ach ?", '1. Android Studio and the Android SDK: who does what?']),
    p([
      "Pour développer une application Android **native** (en Java ou Kotlin, sans Flutter), on utilise deux choses différentes qu'il ne faut pas confondre : **l'outil où l'on écrit** et **les outils qui fabriquent l'application**.",
      "Bach tdevelopper application Android **native** (b Java wla Kotlin, bla Flutter), kansta3mlou jouj 7wayej mkhtalfin w ma khassekch tkhallethom : **l'outil fin katkteb** w **les outils li kaysaybou l'application**.",
      "To build a **native** Android app (in Java or Kotlin, no Flutter) you use two different things that must not be confused: **the tool where you write** and **the tools that build the app**."
    ]),
    table([["Élément", "L'élément", 'Item'], ["Définition", "Ta3rif", 'Definition'], ["Ce qu'il contient", "Chnou fih", 'What it contains']], [
      [
        ['**Android Studio**', '**Android Studio**', '**Android Studio**'],
        ["L'**environnement de développement (IDE)** officiel : c'est là qu'on **écrit le code**, qu'on **édite** les écrans et qu'on **débogue**.", "**IDE** officiel : hna fin kat**kteb l code**, kat**modifi** les écrans w kat**débogui**.", "The official **IDE**: where you **write the code**, **edit** screens and **debug**."],
        ["Éditeur de code, éditeur de layouts (Design / Code), **débogueur**, Logcat, gestionnaire d'émulateurs (AVD), lancement du build Gradle", "Éditeur dyal code, éditeur dyal layouts (Design / Code), **débogueur**, Logcat, gestion dyal émulateurs (AVD), lancement dyal build Gradle", "Code editor, layout editor (Design / Code), **debugger**, Logcat, emulator manager (AVD), Gradle build"]
      ],
      [
        ['**SDK Android**', '**SDK Android**', '**Android SDK**'],
        ["Le **Software Development Kit** : l'**ensemble des API et des outils** Android nécessaires pour **construire** l'application.", "**Software Development Kit** : **majmou3a dyal API w outils** Android li khassin bach **tbni** l'application.", "The **Software Development Kit**: the **set of Android APIs and tools** needed to **build** the app."],
        ["Les **API** (classes `android.*` : Activity, TextView, Button…), les **outils de compilation** (build-tools), **adb**, l'**émulateur** et les images système", "Les **API** (classes `android.*` : Activity, TextView, Button…), **outils dyal compilation** (build-tools), **adb**, **émulateur** w images système", "The **APIs** (`android.*` classes: Activity, TextView, Button…), **build tools**, **adb**, the **emulator** and system images"]
      ]
    ]),
    plain([
      "Android Studio = **l'atelier** (le bureau, l'écran, les outils pour écrire et chercher les erreurs). SDK = **les pièces et les machines** qui transforment ton code en application installable (APK). Sans SDK, Android Studio ne peut rien construire.",
      "Android Studio = **l'atelier** (l'bureau, l'écran, outils bach tkteb w tqelleb 3la les erreurs). SDK = **les pièces w les machines** li kaydirou mn code dyalek application t9der tinstalliha (APK). Bla SDK, Android Studio ma y9der ybni walou.",
      "Android Studio = **the workshop** (desk, screen, tools to write and find errors). SDK = **the parts and machines** that turn your code into an installable app (APK). Without the SDK, Android Studio cannot build anything."
    ]),
    trap([
      "Ne réponds pas « Android Studio compile l'application » tout court. C'est le **SDK** (via Gradle) qui fournit les API et les outils de construction ; Android Studio est l'**éditeur et le débogueur** qui les utilise.",
      "Ma tjawebch ghir « Android Studio kaycompili l'application ». **SDK** (b Gradle) howa li kay3ti les API w outils dyal construction ; Android Studio howa **l'éditeur w débogueur** li kaystakhdemhom.",
      "Do not just answer \"Android Studio compiles the app\". The **SDK** (through Gradle) provides the APIs and build tools; Android Studio is the **editor and debugger** that uses them."
    ]),
    quiz('mob-01', 'mob-02'),

    h(["2. Trois fichiers, trois responsabilités", "2. Tlata d fichiers, tlata d mas2ouliyat", '2. Three files, three responsibilities']),
    p([
      "Un écran Android repose sur trois fichiers. Chacun a **une seule responsabilité** : c'est ce que le prof veut que tu saches dire.",
      "Écran Android kay3tamed 3la tlata d fichiers. Kol wa7ed 3ando **mas2ouliya wa7da** : hadchi li bgha l prof t3ref tgoulo.",
      "An Android screen relies on three files. Each has **one responsibility**: that is what the professor wants you to be able to state."
    ]),
    table([["Fichier", "Fichier", 'File'], ["Responsabilité", "Mas2ouliya", 'Responsibility'], ["Exemple de contenu", "Mithal", 'Example content']], [
      [
        '`res/layout/activity_main.xml`',
        ["**Décrit les composants et leur disposition** (quels TextView, Button… et où ils sont placés).", "**Kaywsef les composants w fin m7totin** (ach mn TextView, Button… w fin kaynin).", "**Describes the components and their layout** (which TextView, Button… and where they go)."],
        ["Un `LinearLayout` qui contient un `TextView` et un `Button`", "`LinearLayout` fih `TextView` w `Button`", "A `LinearLayout` holding a `TextView` and a `Button`"]
      ],
      [
        '`res/values/strings.xml`',
        ["**Centralise les textes**, ce qui facilite leur **réutilisation** et leur **traduction**.", "**Kayjme3 les textes f blasa wa7da**, bach ysahal **t3awed tsta3melhom** w **ttraduirihom**.", "**Centralises the texts**, which makes them easy to **reuse** and **translate**."],
        ["`<string name=\"app_name\">Contacts</string>`", "`<string name=\"app_name\">Contacts</string>`", "`<string name=\"app_name\">Contacts</string>`"]
      ],
      [
        '`AndroidManifest.xml`',
        ["**Déclare les composants** de l'application, notamment les **Activity**, ainsi que les **permissions** nécessaires.", "**Kaydeclari les composants** dyal l'application, khoussousan les **Activity**, w 7tta les **permissions** li khassa.", "**Declares the app's components**, especially the **Activities**, and the **permissions** it needs."],
        ["`<activity android:name=\".MainActivity\">` et `<uses-permission android:name=\"android.permission.INTERNET\" />`", "`<activity android:name=\".MainActivity\">` w `<uses-permission android:name=\"android.permission.INTERNET\" />`", "`<activity android:name=\".MainActivity\">` and `<uses-permission android:name=\"android.permission.INTERNET\" />`"]
      ]
    ]),
    def([
      "**La phrase à retenir (diapo du prof)** : le **XML décrit l'interface**. L'**Activity porte le comportement**. Le **manifeste décrit les composants**.",
      "**Jomla li khassek t7fed (diapo dyal prof)** : **XML kaywsef l'interface**. **Activity fiha comportement** (chnou kaywe9e3). **Manifeste kaywsef les composants**.",
      "**The sentence to remember (professor's slide)**: the **XML describes the interface**. The **Activity carries the behaviour**. The **manifest describes the components**."
    ]),
    code(`<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- permission nécessaire pour accéder à Internet -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher">

        <!-- l'écran de démarrage : MAIN + LAUNCHER -->
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- un deuxième écran : il doit aussi être déclaré -->
        <activity android:name=".DetailActivity" />
    </application>
</manifest>`, 'xml', ["AndroidManifest.xml : deux Activity déclarées et une permission", "AndroidManifest.xml : jouj Activity mdeclarin w permission", 'AndroidManifest.xml: two declared Activities and one permission']),
    trap([
      "Si tu crées `DetailActivity.java` mais que tu **oublies de la déclarer** dans le manifeste, l'application **plante** au moment de l'ouvrir (*ActivityNotFoundException*). Créer la classe ne suffit pas.",
      "Ila sayebti `DetailActivity.java` w **nsiti ma declarertihach** f manifeste, l'application kat**planti** mli t7elha (*ActivityNotFoundException*). Tsayeb classe bo7dha ma kafyach.",
      "If you create `DetailActivity.java` but **forget to declare it** in the manifest, the app **crashes** when opening it (*ActivityNotFoundException*). Creating the class is not enough."
    ]),
    tip([
      "Ne jamais écrire un texte **en dur** dans le layout (`android:text=\"Contacts\"`) : Android Studio affiche un avertissement. On écrit `android:text=\"@string/app_name\"` et le texte vit dans `strings.xml`. Pour traduire en anglais, on ajoute `res/values-en/strings.xml` avec les mêmes `name` : **le layout ne change pas**.",
      "3mmrek ma tkteb texte **direct** f layout (`android:text=\"Contacts\"`) : Android Studio kay3tik avertissement. Katkteb `android:text=\"@string/app_name\"` w texte kayskon f `strings.xml`. Bach ttraduiri l anglais, katzid `res/values-en/strings.xml` b nefs les `name` : **layout ma kaytbeddelch**.",
      "Never **hard-code** text in the layout (`android:text=\"Contacts\"`): Android Studio warns you. Write `android:text=\"@string/app_name\"` and keep the text in `strings.xml`. To translate to English, add `res/values-en/strings.xml` with the same `name`s: **the layout does not change**."
    ]),
    quiz('mob-03', 'mob-04', 'mob-05'),

    h(["3. Le lien entre Java et les ressources", "3. L3alaqa bin Java w les ressources", '3. The link between Java and resources']),
    anim('ScreenFilesFlow'),
    code(`// Dans onCreate() de MainActivity
setContentView(R.layout.activity_main);

// Dans strings.xml
<string name="app_name">Contacts</string>

// Dans le fichier de mise en page
android:text="@string/app_name"`, 'java', ["Les trois lignes de la diapo du prof", "Tlata d sstour dyal diapo dyal prof", "The three lines of the professor's slide"]),
    steps(["Lire ces lignes comme le prof", "9ra had sstour b7al l prof", 'Read these lines like the professor'], [
      {
        t: ["setContentView charge l'interface", "setContentView kaychargi l'interface", 'setContentView loads the interface'],
        b: [
          "`setContentView(...)` **charge l'interface de l'Activity** : il lit le fichier XML et crée les vues (TextView, Button…) à l'écran. Sans cette ligne, l'Activity s'affiche **vide**.",
          "`setContentView(...)` kay**chargi l'interface dyal Activity** : kay9ra fichier XML w kaysayb les vues (TextView, Button…) f l écran. Bla had ster, Activity katban **khawya**.",
          "`setContentView(...)` **loads the Activity's interface**: it reads the XML file and creates the views (TextView, Button…) on screen. Without it, the Activity shows **empty**."
        ]
      },
      {
        t: ['R.layout.activity_main', 'R.layout.activity_main', 'R.layout.activity_main'],
        b: [
          "`R` est une classe **générée automatiquement** par le build : elle donne un **identifiant entier** à chaque ressource. `R.layout.activity_main` **désigne la ressource XML `res/layout/activity_main.xml`, sans son extension**.",
          "`R` classe kat**tsayb automatiquement** f build : kat3ti **identifiant (nombre)** l kol ressource. `R.layout.activity_main` kay**désigner ressource XML `res/layout/activity_main.xml`, bla extension dyalha**.",
          "`R` is a class **generated automatically** by the build: it gives each resource an **integer id**. `R.layout.activity_main` **designates the XML resource `res/layout/activity_main.xml`, without its extension**."
        ],
        why: ["Écrire `R.layout.activity_main.xml` est une erreur de compilation.", "Tkteb `R.layout.activity_main.xml` = erreur f compilation.", 'Writing `R.layout.activity_main.xml` is a compile error.']
      },
      {
        t: ['@string/app_name', '@string/app_name', '@string/app_name'],
        b: [
          "Dans un fichier XML, `@string/app_name` **réutilise le texte déclaré** dans `strings.xml` sous le nom `app_name`. À l'écran on lit **Contacts**.",
          "F fichier XML, `@string/app_name` kay**3awed ysta3mel texte li mdeclari** f `strings.xml` b smiya `app_name`. F l écran kat9ra **Contacts**.",
          "In an XML file, `@string/app_name` **reuses the text declared** in `strings.xml` under the name `app_name`. The screen shows **Contacts**."
        ]
      }
    ]),
    table([["Ressource", "Ressource", 'Resource'], ["Depuis Java", "Mn Java", 'From Java'], ["Depuis un XML", "Mn XML", 'From XML']], [
      [['Un layout', 'Layout', 'A layout'], '`R.layout.activity_main`', '`@layout/activity_main`'],
      [['Un texte', 'Texte', 'A string'], '`R.string.app_name` · `getString(R.string.app_name)`', '`@string/app_name`'],
      [['Une vue (id)', 'View (id)', 'A view (id)'], '`R.id.titre` · `findViewById(R.id.titre)`', ["`@+id/titre` (le `+` **crée** l'id)", "`@+id/titre` (`+` kay**sayb** l'id)", "`@+id/titre` (the `+` **creates** the id)"]],
      [['Une couleur', 'Couleur', 'A colour'], '`R.color.vert`', '`@color/vert`']
    ]),
    code(`public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);              // 1. charger l'interface

        TextView titre = findViewById(R.id.titre);           // 2. récupérer une vue par son id
        titre.setText(getString(R.string.app_name));         // 3. lui donner un texte de strings.xml
    }
}`, 'java', ["MainActivity.java : l'Activity porte le comportement", "MainActivity.java : Activity fiha comportement", 'MainActivity.java: the Activity carries the behaviour']),
    trap([
      "`findViewById(...)` **avant** `setContentView(...)` renvoie **null** (l'interface n'est pas encore chargée) → *NullPointerException* au `setText`. Toujours `setContentView` **d'abord**.",
      "`findViewById(...)` **9bel** `setContentView(...)` kayrje3 **null** (interface mazal ma tchargat) → *NullPointerException* f `setText`. Dima `setContentView` **lowel**.",
      "`findViewById(...)` **before** `setContentView(...)` returns **null** (the interface is not loaded yet) → *NullPointerException* on `setText`. Always `setContentView` **first**."
    ]),
    exam([
      "Question type : « Quel est le rôle de `setContentView(R.layout.activity_main)` ? » → **Il charge l'interface de l'Activity ; `R.layout.activity_main` désigne la ressource XML `activity_main.xml` sans son extension.** Et « Pourquoi `@string/app_name` ? » → **pour réutiliser le texte déclaré dans strings.xml (réutilisation + traduction).**",
      "Sou2al : « Chnou kaydir `setContentView(R.layout.activity_main)` ? » → **Kaychargi l'interface dyal Activity ; `R.layout.activity_main` kaydesigner ressource XML `activity_main.xml` bla extension.** W « 3lach `@string/app_name` ? » → **bach n3awdou nsta3mlou texte li f strings.xml (réutilisation + traduction).**",
      "Typical question: \"What does `setContentView(R.layout.activity_main)` do?\" → **It loads the Activity's interface; `R.layout.activity_main` designates the XML resource `activity_main.xml` without its extension.** And \"Why `@string/app_name`?\" → **to reuse the text declared in strings.xml (reuse + translation).**"
    ]),
    quiz('mob-06', 'mob-07', 'mob-08')
  ],
  keyPoints: [
    L(["Android Studio = IDE (éditeur, débogueur, émulateur). SDK Android = API + outils nécessaires pour construire l'application.", "Android Studio = IDE (éditeur, débogueur). SDK = API + outils bach tbni l'app.", 'Android Studio = IDE (editor, debugger, emulator). Android SDK = APIs + tools needed to build the app.']),
    L(["activity_main.xml décrit les composants et leur disposition ; strings.xml centralise les textes (réutilisation, traduction) ; AndroidManifest.xml déclare les Activity et les permissions.", "Layout = composants ; strings = textes ; manifeste = Activity + permissions.", 'activity_main.xml = components and layout; strings.xml = texts (reuse, translation); manifest = Activities and permissions.']),
    L(["Le XML décrit l'interface. L'Activity porte le comportement. Le manifeste décrit les composants.", "XML = interface ; Activity = comportement ; manifeste = composants.", 'XML = interface; Activity = behaviour; manifest = components.']),
    L(["setContentView(R.layout.activity_main) charge l'interface ; R.layout.activity_main désigne le XML sans son extension.", "setContentView kaychargi l'interface ; R.layout bla .xml.", 'setContentView loads the interface; R.layout.activity_main = the XML without its extension.']),
    L(["@string/app_name réutilise le texte déclaré dans strings.xml ; @+id/x crée un id, R.id.x le lit en Java.", "@string = texte mn strings.xml ; @+id kaysayb id.", '@string/app_name reuses the declared text; @+id/x creates an id, R.id.x reads it in Java.'])
  ]
};

// ======================================================================
// Chapitre 2 — Cycle de vie d'une Activity
// ======================================================================
export const c2: Chapter = {
  id: 'cycle',
  module: 'mobile',
  order: 2,
  title: L(["Le cycle de vie d'une Activity", "Cycle de vie dyal Activity", 'The Activity lifecycle']),
  summary: L([
    "Le sens des méthodes onCreate, onStart, onResume, onPause, onStop, onRestart et onDestroy, le scénario du prof (Accueil puis retour), les autres scénarios classiques (rotation, deuxième écran, fenêtre par-dessus, processus tué) et pourquoi onDestroy() n'est pas garanti.",
    "Ma3na dyal onCreate, onStart, onResume, onPause, onStop, onRestart w onDestroy, scénario dyal prof (Accueil w men b3d rjou3), scénarios okhrin (rotation, écran tani, fenêtre fo9ha, processus m9toul) w 3lach onDestroy() machi garanti.",
    "What onCreate, onStart, onResume, onPause, onStop, onRestart and onDestroy mean, the professor's scenario (Home then return), other classic scenarios (rotation, second screen, window on top, killed process) and why onDestroy() is not guaranteed."
  ]),
  estimatedMinutes: 45,
  sections: [
    h(["1. Pourquoi un cycle de vie ?", "1. 3lach kayn cycle de vie ?", '1. Why a lifecycle?']),
    p([
      "Une **Activity** est **un écran** de l'application. Ce n'est pas toi qui décides quand elle s'affiche ou disparaît : c'est **Android**. Quand l'utilisateur ouvre l'application, appuie sur Accueil, reçoit un appel ou tourne le téléphone, Android **appelle automatiquement** certaines méthodes de ton Activity. Tu les **redéfinis** (`@Override`) pour réagir au bon moment.",
      "**Activity** hiya **écran** wa7ed mn l'application. Machi nta li katgoul imta tban wla tghber : **Android** howa li kaydir hadchi. Mli user kay7el l'app, kaybrek 3la Accueil, kayjih appel wla kaydawwer téléphone, Android kay**3ayet automatiquement** l chi méthodes f Activity dyalek. Nta kat**3awed tktebhom** (`@Override`) bach tdir l 7aja f wa9tha.",
      "An **Activity** is **one screen** of the app. You do not decide when it appears or disappears: **Android** does. When the user opens the app, presses Home, gets a call or rotates the phone, Android **automatically calls** certain methods of your Activity. You **override** them (`@Override`) to react at the right moment."
    ]),
    plain([
      "Imagine un magasin. **onCreate** : on installe le magasin (une seule fois). **onStart** : on lève le rideau, on voit l'intérieur. **onResume** : on ouvre la porte, les clients peuvent entrer. **onPause** : on ferme la porte mais le rideau est levé. **onStop** : on baisse le rideau. **onDestroy** : on démonte le magasin.",
      "Tkhayel 7anout. **onCreate** : kanwjjdou l 7anout (mra wa7da). **onStart** : kanhezzou l rideau, ychoufou dakhel. **onResume** : kan7ellou l bab, les clients ydakhlou. **onPause** : kansseddou l bab walakin rideau mazal mhzouz. **onStop** : kanhabtou l rideau. **onDestroy** : kanfekkou l 7anout.",
      "Picture a shop. **onCreate**: set up the shop (once). **onStart**: raise the shutter, people can see inside. **onResume**: open the door, customers can come in. **onPause**: close the door, shutter still up. **onStop**: lower the shutter. **onDestroy**: dismantle the shop."
    ]),

    h(["2. Le sens des principales méthodes", "2. Ma3na dyal les méthodes l2asasiyin", '2. What the main methods mean']),
    table([["Méthode", "Méthode", 'Method'], ["Sens (diapo du prof)", "Ma3na (diapo dyal prof)", "Meaning (professor's slide)"], ["Ce qu'on y met en général", "Chnou kandirou fiha", 'What usually goes there']], [
      ['`onCreate()`', ["**Initialise l'Activity et son interface.** Appelée **une seule fois par instance**.", "**Kat initialisi Activity w interface dyalha.** Kat3ayet **mra wa7da l kol instance**.", "**Initialises the Activity and its interface.** Called **once per instance**."], ["`setContentView`, `findViewById`, écouteurs de clic", "`setContentView`, `findViewById`, listeners dyal click", '`setContentView`, `findViewById`, click listeners']],
      ['`onStart()`', ["**L'Activity devient visible.**", "**Activity katweli bayna.**", '**The Activity becomes visible.**'], ["Préparer ce qui doit être à jour quand l'écran se voit", "Wjjed chi 7aja khassha tkoun à jour mli l écran yban", 'Refresh what must be up to date when visible']],
      ['`onResume()`', ["**Elle passe au premier plan et devient interactive.**", "**Katdouz l l9eddam w t9der tkhdem biha.**", '**It comes to the foreground and becomes interactive.**'], ["Démarrer la caméra, une animation, un capteur", "Bda caméra, animation, capteur", 'Start the camera, an animation, a sensor']],
      ['`onPause()`', ["**Elle perd le premier plan.** (souvent encore partiellement visible)", "**Katfqed l9eddam.** (ghaliban mazal bayna chwiya)", '**It loses the foreground.** (often still partly visible)'], ["Mettre en pause ce qui a démarré dans onResume ; code **court**", "Wa9ef dakchi li bda f onResume ; code **9sir**", 'Pause what onResume started; keep it **short**']],
      ['`onStop()`', ["**Elle n'est plus visible.**", "**Ma bqatch bayna.**", '**It is no longer visible.**'], ["Libérer les ressources, **sauvegarder** les données importantes", "Libéri ressources, **7fed** data mohimma", 'Release resources, **save** important data']],
      ['`onRestart()`', ["Appelée **avant onStart()** quand l'Activity **revient après un onStop()** (même instance).", "Kat3ayet **9bel onStart()** mli Activity **katrje3 mor onStop()** (nefs l instance).", "Called **before onStart()** when the Activity **comes back after onStop()** (same instance)."], ["Rarement utilisée", "Nadir", 'Rarely used']],
      ['`onDestroy()`', ["**Fin de cette instance, si le système appelle la méthode.**", "**Nihayat had l instance, ila système 3ayet 3la méthode.**", '**End of this instance, if the system calls the method.**'], ["Nettoyage final — **jamais** de sauvegarde critique ici", "Tnqiya lkhra — **3mmrek** t7fed chi 7aja mohimma hna", 'Final cleanup — **never** critical saving here']]
    ]),
    code(`              onCreate()
                  |
              onStart()  <---------- onRestart()
                  |                      ^
              onResume()                 |
                  |                      |
        [ Activity au premier plan ]     |
                  |                      |
              onPause()                  |
                  |                      |
              onStop()  -----------------+   (l'utilisateur revient)
                  |
              onDestroy()   (pas garanti)`, 'text', ["Le schéma à savoir reproduire", "Schéma li khassek t3ref trsmo", 'The diagram to know how to draw']),
    exam([
      "Les méthodes vont **par paires** : onCreate ↔ onDestroy (création / fin de l'instance), onStart ↔ onStop (visible / plus visible), onResume ↔ onPause (premier plan / perte du premier plan). Si on te demande « ce qui se passe quand… », raisonne avec ces paires.",
      "Les méthodes jayin **paires** : onCreate ↔ onDestroy (bdaya / nihaya dyal instance), onStart ↔ onStop (bayna / ma bqatch bayna), onResume ↔ onPause (l9eddam / fqdat l9eddam). Ila sowlok « chnou kaywe9e3 mli… », fekker b had les paires.",
      "The methods come **in pairs**: onCreate ↔ onDestroy (instance created / ended), onStart ↔ onStop (visible / not visible), onResume ↔ onPause (foreground / lost foreground). For any \"what happens when…\" question, reason with these pairs."
    ]),
    quiz('mob-10', 'mob-11', 'mob-12'),

    h(["3. Scénario du prof : Accueil, puis retour", "3. Scénario dyal prof : Accueil, w men b3d rjou3", "3. The professor's scenario: Home, then return"]),
    steps(["Les trois étapes (diapo 3)", "Tlata d étapes (diapo 3)", 'The three steps (slide 3)'], [
      {
        t: ["1. Premier lancement", "1. Awel lancement", '1. First launch'],
        b: ["**onCreate()**, **onStart()**, **onResume()**. L'Activity est créée, devient visible puis interactive.", "**onCreate()**, **onStart()**, **onResume()**. Activity kattsayb, katban, w men b3d t9der tkhdem biha.", "**onCreate()**, **onStart()**, **onResume()**. The Activity is created, becomes visible, then interactive."]
      },
      {
        t: ["2. L'utilisateur appuie sur Accueil", "2. User kaybrek 3la Accueil", '2. The user presses Home'],
        b: ["**onPause()**, puis **onStop()**. L'Activity perd le premier plan puis n'est plus visible. Elle **n'est pas détruite** : l'instance reste en mémoire.", "**onPause()**, w men b3d **onStop()**. Activity katfqed l9eddam w men b3d ma bqatch bayna. **Ma tmse7atch** : instance ba9ya f mémoire.", "**onPause()**, then **onStop()**. The Activity loses the foreground, then is no longer visible. It is **not destroyed**: the instance stays in memory."]
      },
      {
        t: ["3. Il revient, sans destruction", "3. Kayrje3, bla destruction", '3. They come back, no destruction'],
        b: ["**onRestart()**, **onStart()**, **onResume()**. On conserve ici **la même instance** : **onCreate() ne se répète pas**.", "**onRestart()**, **onStart()**, **onResume()**. Hna kan7afdou 3la **nefs l instance** : **onCreate() ma kat3awedch**.", "**onRestart()**, **onStart()**, **onResume()**. The **same instance** is kept: **onCreate() is not repeated**."]
      }
    ]),
    trap([
      "Ces séquences **supposent un passage complet en arrière-plan**. Et **onDestroy() n'est pas garanti** : si Android manque de mémoire, il peut **tuer le processus** d'une application en arrière-plan **sans appeler onDestroy()**. Donc on ne sauvegarde jamais des données importantes dans onDestroy() : on le fait dans **onPause()/onStop()**.",
      "Had les séquences **kayftardou douz kamel l arrière-plan**. W **onDestroy() machi garanti** : ila Android na9so mémoire, y9der **y9tel processus** dyal app f arrière-plan **bla ma y3ayet l onDestroy()**. Donc 3mmrek t7fed data mohimma f onDestroy() : katdirha f **onPause()/onStop()**.",
      "These sequences **assume a full move to the background**. And **onDestroy() is not guaranteed**: if Android is short on memory it may **kill the process** of a background app **without calling onDestroy()**. So never save important data in onDestroy(): do it in **onPause()/onStop()**."
    ]),
    anim('ActivityLifecycle'),
    quiz('mob-13', 'mob-14'),

    h(["4. Les autres scénarios à connaître", "4. Scénarios okhrin khassek t3refhom", '4. Other scenarios to know']),
    p([
      "Le prof a présenté le scénario Accueil / retour. Au contrôle, on peut aussi te demander les cas suivants : ils se déduisent tous des paires de méthodes.",
      "L prof chre7 scénario Accueil / rjou3. F l contrôle, y9der ysowlek 7tta 3la had les cas : kamlin kaytfehmou b les paires dyal méthodes.",
      "The professor presented the Home / return scenario. In the test you may also be asked the following cases: they all follow from the method pairs."
    ]),
    table([["Situation", "L 7ala", 'Situation'], ["Méthodes appelées, dans l'ordre", "Méthodes, b tartib", 'Methods called, in order'], ["Pourquoi", "3lach", 'Why']], [
      [["**Rotation** de l'écran", "**Rotation** dyal l écran", 'Screen **rotation**'], '`onPause` → `onStop` → `onDestroy` → `onCreate` → `onStart` → `onResume`', ["Changement de configuration : par défaut l'instance est **détruite et recréée** (nouvelle instance) pour charger le bon layout.", "Changement de configuration : par défaut instance kat**tmse7 w kat3awed tetsayb** (instance jdida) bach tchargi layout mzyan.", 'Configuration change: by default the instance is **destroyed and recreated** (new instance) to load the right layout.']],
      [["**finish()** ou Retour sur un écran secondaire", "**finish()** wla Retour f écran tani", '**finish()** or Back on a secondary screen'], '`onPause` → `onStop` → `onDestroy`', ["L'Activity est **terminée** : un nouvel affichage recommencera par onCreate().", "Activity **salat** : ila t7elat 3awtani ghatbda b onCreate().", 'The Activity is **finished**: showing it again starts with onCreate().']],
      [["Une fenêtre d'une autre activité **par-dessus** (ex. demande de permission)", "Fenêtre dyal activité okhra **fo9ha** (b7al demande de permission)", "A window from another activity **on top** (e.g. permission request)"], ["`onPause` seulement, puis `onResume` quand elle se ferme", "Ghir `onPause`, w `onResume` mli katsedd", "`onPause` only, then `onResume` when it closes"], ["L'Activity **reste visible** derrière : elle perd seulement le premier plan.", "Activity **ba9a bayna** mn lour : ghir fqdat l9eddam.", 'The Activity **stays visible** behind: it only loses the foreground.']],
      [["A ouvre une deuxième Activity **B**", "A kat7el Activity tanya **B**", "A opens a second Activity **B**"], '`A.onPause` → `B.onCreate` → `B.onStart` → `B.onResume` → `A.onStop`', ["A perd d'abord le premier plan, B s'affiche, **puis** A n'est plus visible. A n'est pas détruite.", "A katfqed l9eddam lowel, B katban, **w men b3d** A ma bqatch bayna. A ma tmse7atch.", 'A loses the foreground first, B shows up, **then** A is no longer visible. A is not destroyed.']],
      [["Retour de **B** vers **A**", "Rjou3 mn **B** l **A**", 'Back from **B** to **A**'], '`B.onPause` → `A.onRestart` → `A.onStart` → `A.onResume` → `B.onStop` → `B.onDestroy`', ["B est terminée ; A revient **sans onCreate** (même instance).", "B salat ; A katrje3 **bla onCreate** (nefs l instance).", 'B is finished; A comes back **without onCreate** (same instance).']],
      [["Processus **tué** en arrière-plan, puis l'utilisateur revient", "Processus **m9toul** f arrière-plan, w user kayrje3", 'Process **killed** in the background, then the user returns'], ["Aucune méthode à la mort, puis `onCreate` → `onStart` → `onResume`", "Ta méthode f lmout, w men b3d `onCreate` → `onStart` → `onResume`", "No method at death, then `onCreate` → `onStart` → `onResume`"], ["C'est **une nouvelle instance** : d'où l'importance de sauvegarder avant (onStop).", "**Instance jdida** : 3lach mohim t7fed 9bel (onStop).", "It is **a new instance**: hence saving earlier (onStop) matters."]]
    ]),
    tip([
      "Pour **garder une valeur** (ex. un compteur) après une rotation, on la sauvegarde dans `onSaveInstanceState(Bundle)` et on la relit dans `onCreate(savedInstanceState)` — ou on la place dans un **ViewModel**. Sinon elle repart à zéro, car l'instance est nouvelle.",
      "Bach **t7afed 3la valeur** (b7al compteur) mor rotation, kat7fedha f `onSaveInstanceState(Bundle)` w kat9raha f `onCreate(savedInstanceState)` — wla kat7etha f **ViewModel**. Sinon katrje3 l zéro, 7it instance jdida.",
      "To **keep a value** (e.g. a counter) across rotation, save it in `onSaveInstanceState(Bundle)` and read it back in `onCreate(savedInstanceState)` — or keep it in a **ViewModel**. Otherwise it resets, because the instance is new."
    ]),
    quiz('mob-15', 'mob-16', 'mob-17'),

    h(["5. Observer le cycle de vie dans Logcat", "5. Choufo cycle de vie f Logcat", '5. Watching the lifecycle in Logcat']),
    code(`public class MainActivity extends AppCompatActivity {
    private static final String TAG = "CYCLE";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Log.d(TAG, "onCreate");
    }

    @Override protected void onStart()   { super.onStart();   Log.d(TAG, "onStart"); }
    @Override protected void onResume()  { super.onResume();  Log.d(TAG, "onResume"); }
    @Override protected void onPause()   { super.onPause();   Log.d(TAG, "onPause"); }
    @Override protected void onStop()    { super.onStop();    Log.d(TAG, "onStop"); }
    @Override protected void onRestart() { super.onRestart(); Log.d(TAG, "onRestart"); }
    @Override protected void onDestroy() { super.onDestroy(); Log.d(TAG, "onDestroy"); }
}`, 'java', ["Chaque méthode écrit son nom dans Logcat (filtre : tag:CYCLE)", "Kol méthode katkteb smitha f Logcat (filtre : tag:CYCLE)", 'Each method logs its name in Logcat (filter: tag:CYCLE)']),
    trap([
      "Chaque méthode redéfinie doit appeler **`super.onXxx()`** (la version de la classe parente). Oublier `super.onCreate(savedInstanceState)` provoque une erreur à l'exécution (*SuperNotCalledException*).",
      "Kol méthode li 3awedti ktebtha khassha t3ayet l **`super.onXxx()`** (version dyal classe parente). Ila nsiti `super.onCreate(savedInstanceState)` kat3tik erreur f l'exécution (*SuperNotCalledException*).",
      "Every overridden method must call **`super.onXxx()`** (the parent class version). Forgetting `super.onCreate(savedInstanceState)` causes a runtime error (*SuperNotCalledException*)."
    ]),
    example([
      "Lance l'application, appuie sur Accueil, reviens, puis tourne l'écran. Logcat affiche : `onCreate, onStart, onResume` / `onPause, onStop` / `onRestart, onStart, onResume` / `onPause, onStop, onDestroy, onCreate, onStart, onResume`. C'est exactement ce que le simulateur ci-dessus montre.",
      "Lanci l'app, brek 3la Accueil, rje3, w men b3d dawwer l écran. Logcat kaybyen : `onCreate, onStart, onResume` / `onPause, onStop` / `onRestart, onStart, onResume` / `onPause, onStop, onDestroy, onCreate, onStart, onResume`. Hadchi bdbt li kaybyen simulateur lfo9.",
      "Launch the app, press Home, come back, then rotate. Logcat shows: `onCreate, onStart, onResume` / `onPause, onStop` / `onRestart, onStart, onResume` / `onPause, onStop, onDestroy, onCreate, onStart, onResume`. Exactly what the simulator above shows."
    ]),
    quiz('mob-18')
  ],
  keyPoints: [
    L(["onCreate initialise l'Activity et son interface ; onStart = visible ; onResume = premier plan, interactive.", "onCreate = initialisation ; onStart = bayna ; onResume = l9eddam.", 'onCreate initialises; onStart = visible; onResume = foreground, interactive.']),
    L(["onPause = perd le premier plan ; onStop = plus visible ; onDestroy = fin de l'instance, si le système l'appelle.", "onPause = fqdat l9eddam ; onStop = ma bqatch bayna ; onDestroy = nihaya (ila t3ayet).", 'onPause = loses foreground; onStop = not visible; onDestroy = end of instance, if called.']),
    L(["Lancement : onCreate, onStart, onResume. Accueil : onPause, onStop. Retour : onRestart, onStart, onResume — même instance, onCreate ne se répète pas.", "Lancement / Accueil / rjou3 : bla onCreate f rjou3.", 'Launch / Home / return: no onCreate on return.']),
    L(["onDestroy() n'est pas garanti : sauvegarder dans onPause/onStop, jamais dans onDestroy.", "onDestroy machi garanti : 7fed f onPause/onStop.", 'onDestroy() is not guaranteed: save in onPause/onStop.']),
    L(["Rotation = destruction + recréation (nouvelle instance). A ouvre B : A.onPause, B.onCreate/onStart/onResume, A.onStop.", "Rotation = tmse7 + tsayb ; A → B : A.onPause … A.onStop.", 'Rotation = destroy + recreate. A opens B: A.onPause, B.onCreate/onStart/onResume, A.onStop.'])
  ]
};

// ======================================================================
// Chapitre 3 — Unités et dimensions
// ======================================================================
export const c3: Chapter = {
  id: 'dimensions',
  module: 'mobile',
  order: 3,
  title: L(["Les unités et les dimensions", "Les unités w les dimensions", 'Units and dimensions']),
  summary: L([
    "Pourquoi le pixel brut ne convient pas, dp pour les dimensions et sp pour le texte (avec le calcul en pixels), wrap_content et match_parent, et 0dp (« match constraints ») dans un ConstraintLayout.",
    "3lach pixel brut ma kaysla7ch, dp l dimensions w sp l texte (m3a 7sab b pixels), wrap_content w match_parent, w 0dp (« match constraints ») f ConstraintLayout.",
    "Why raw pixels do not work, dp for dimensions and sp for text (with the pixel calculation), wrap_content and match_parent, and 0dp (\"match constraints\") in a ConstraintLayout."
  ]),
  estimatedMinutes: 35,
  sections: [
    h(["1. Le problème du pixel brut", "1. Lmochkil dyal pixel brut", '1. The problem with raw pixels']),
    p([
      "Les téléphones n'ont pas tous la même **densité** : le nombre de pixels par pouce (**dpi**) varie. Sur un écran très dense, les pixels sont minuscules. Donc **le pixel brut dépend de la densité : un même nombre de pixels n'a pas la même taille apparente partout**. Un bouton de 48 px est confortable sur un vieil écran et minuscule sur un écran récent.",
      "Les téléphones ma 3andhomch kamlin nefs **densité** : 3adad dyal pixels f pouce (**dpi**) kaytbeddel. F écran dense bzaf, les pixels sghar bzaf. Donc **pixel brut kaytbe3 densité : nefs 3adad dyal pixels ma 3andoch nefs taille li katban f kol blasa**. Bouton dyal 48 px mzyan f écran 9dim w sghir bzaf f écran jdid.",
      "Phones do not all have the same **density**: the number of pixels per inch (**dpi**) varies. On a very dense screen pixels are tiny. So **raw pixels depend on density: the same number of pixels does not look the same size everywhere**. A 48 px button is fine on an old screen and tiny on a recent one."
    ]),
    def([
      "**dp** (*density-independent pixel*) : unité **indépendante de la densité**. Par définition, **1 dp = 1 px sur un écran de 160 dpi** (densité de référence, *mdpi*). Android convertit pour chaque écran.",
      "**dp** (*density-independent pixel*) : unité **ma katbe3ch densité**. Par définition, **1 dp = 1 px f écran dyal 160 dpi** (densité de référence, *mdpi*). Android kaydir conversion l kol écran.",
      "**dp** (*density-independent pixel*): a **density-independent** unit. By definition **1 dp = 1 px on a 160 dpi screen** (reference density, *mdpi*). Android converts for each screen."
    ]),
    formula('px = dp \\times \\frac{dpi}{160}', [
      "Conversion dp → pixels réels. Le quotient dpi/160 est le **facteur de densité**.",
      "Conversion dp → pixels 7a9i9iyin. dpi/160 howa **facteur de densité**.",
      "dp → actual pixels. dpi/160 is the **density factor**."
    ]),
    table([["Catégorie", "Catégorie", 'Bucket'], ['dpi', 'dpi', 'dpi'], ["Facteur", "Facteur", 'Factor'], ["48dp donne", "48dp = ", '48dp gives']], [
      ['mdpi', '160', '×1', '48 px'],
      ['hdpi', '240', '×1,5', '72 px'],
      ['xhdpi', '320', '×2', '96 px'],
      ['xxhdpi', '480', '×3', '144 px'],
      ['xxxhdpi', '640', '×4', '192 px']
    ]),
    plain([
      "Le nombre de pixels augmente avec la densité, mais les pixels sont plus petits : au final, **48dp a la même taille physique** sur tous ces écrans. C'est exactement le but.",
      "3adad dyal pixels kayzid m3a densité, walakin les pixels kaysghaarou : f lekher, **48dp 3ando nefs taille** f ga3 had les écrans. Hadak howa lhadaf.",
      "The pixel count grows with density but pixels get smaller: in the end **48dp has the same physical size** on all these screens. That is the whole point."
    ]),

    h(["2. dp et sp : deux usages distincts", "2. dp w sp : jouj isti3malat mkhtalfin", '2. dp and sp: two distinct uses']),
    table([["Unité", "Unité", 'Unit'], ["Mesure", "Kat9is", 'Measures'], ["Tient compte de", "Katbe3", 'Accounts for'], ["Exemple (diapo)", "Mithal (diapo)", 'Example (slide)']], [
      ['**dp**', ["Les **dimensions de l'interface** (largeur, hauteur, marges, padding)", "**Dimensions dyal l'interface** (l3ard, tol, marges, padding)", '**Interface dimensions** (width, height, margins, padding)'], ["La **densité** de l'écran", "**Densité** dyal l écran", 'Screen **density**'], ["Largeur d'un composant = **48dp**", "L3ard dyal composant = **48dp**", 'Component width = **48dp**']],
      ['**sp**', ["La **taille du texte**", "**Taille dyal texte**", '**Text size**'], ["La densité **et** le **réglage de taille de police** de l'utilisateur", "Densité **w** **réglage dyal taille de police** dyal user", 'Density **and** the user\'s **font size setting**'], ["Texte d'un bouton = **18sp**", "Texte dyal bouton = **18sp**", 'Button text = **18sp**']],
      ['**px**', ["Des pixels physiques", "Pixels physiques", 'Physical pixels'], ["Rien : **dépend de la densité**", "Walou : **kaytbe3 densité**", 'Nothing: **depends on density**'], ["À éviter pour l'interface", "Tjnnbo f l'interface", 'Avoid for UI']]
    ]),
    anim('AndroidUnits'),
    trap([
      "**dp pour les dimensions, sp pour le texte.** Mettre `android:textSize=\"18dp\"` ignore le réglage de police de l'utilisateur (problème d'accessibilité pour les malvoyants). À l'inverse, mettre des **sp** sur une largeur fait grossir le composant quand l'utilisateur agrandit la police.",
      "**dp l dimensions, sp l texte.** Ila drti `android:textSize=\"18dp\"`, kat-ignori réglage dyal police dyal user (mochkil d accessibilité l li ma kaychoufch mzyan). W l3eks, ila drti **sp** f l3ard, composant kaykbar mli user kaykabbar police.",
      "**dp for dimensions, sp for text.** `android:textSize=\"18dp\"` ignores the user's font setting (an accessibility problem for visually impaired users). Conversely, **sp** on a width makes the component grow when the user enlarges the font."
    ]),
    tip([
      "48dp n'est pas un hasard : c'est la **taille minimale recommandée d'une zone tactile** (bouton, icône cliquable) pour qu'un doigt la touche facilement.",
      "48dp machi sodfa : hiya **a9all taille mnsou7 biha l zone tactile** (bouton, icône li katbrek 3liha) bach sbe3 ybrek 3liha bsohola.",
      "48dp is no accident: it is the **recommended minimum touch target size** (button, tappable icon) so a finger can hit it easily."
    ]),
    quiz('mob-20', 'mob-21', 'mob-22'),

    h(["3. wrap_content et match_parent", "3. wrap_content w match_parent", '3. wrap_content and match_parent']),
    table([["Valeur", "Valeur", 'Value'], ["Sens (diapo du prof)", "Ma3na (diapo dyal prof)", "Meaning (professor's slide)"]], [
      ['`wrap_content`', ["La vue **adapte sa taille à son contenu**, avec ses **marges internes** (padding) et ses **contraintes de taille**.", "View kat**3ti rasha taille 3la 7sab contenu dyalha**, m3a **marges internes** (padding) w **contraintes de taille** dyalha.", "The view **sizes itself to its content**, with its **inner margins** (padding) and **size constraints**."]],
      ['`match_parent`', ["La vue **occupe la dimension disponible** que son **parent** lui attribue.", "View kat**3mmer dimension li mojouda** li 3taha **parent** dyalha.", "The view **fills the available dimension** its **parent** gives it."]]
    ]),
    code(`<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <Button
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="@string/valider"
        android:textSize="18sp" />
</LinearLayout>`, 'xml', ["Exemple de la diapo : le bouton prend la largeur disponible et ajuste sa hauteur", "Mithal dyal diapo : bouton kayakhod l3ard kamel w kay3dl tol dyalo", 'Slide example: the button takes the available width and adjusts its height']),
    plain([
      "**largeur = match_parent** : le bouton s'étire d'un bord à l'autre du LinearLayout (moins le padding de 16dp). **hauteur = wrap_content** : il est juste assez haut pour son texte. Résultat : un bouton large, de hauteur normale.",
      "**l3ard = match_parent** : bouton kaytmedd mn jenb l jenb dyal LinearLayout (na9es padding dyal 16dp). **tol = wrap_content** : tol dyalo 9ed texte dyalo bach. Natija : bouton 3rid, b tol 3adi.",
      "**width = match_parent**: the button stretches edge to edge in the LinearLayout (minus the 16dp padding). **height = wrap_content**: just tall enough for its text. Result: a wide button of normal height."
    ]),
    trap([
      "`layout_width` et `layout_height` sont **obligatoires** pour chaque vue d'un LinearLayout : sans eux, erreur à l'exécution. Et `fill_parent` est **l'ancien nom** de `match_parent` (déprécié) : écris toujours `match_parent`.",
      "`layout_width` w `layout_height` **wajibin** l kol view f LinearLayout : bla bihom, erreur f l'exécution. W `fill_parent` howa **smiya l9dima** dyal `match_parent` (dépréciée) : dima kteb `match_parent`.",
      "`layout_width` and `layout_height` are **mandatory** for every view of a LinearLayout: without them, runtime error. And `fill_parent` is the **old name** of `match_parent` (deprecated): always write `match_parent`."
    ]),
    quiz('mob-23', 'mob-24'),

    h(["4. ConstraintLayout : 0dp = « match constraints »", "4. ConstraintLayout : 0dp = « match constraints »", '4. ConstraintLayout: 0dp = "match constraints"']),
    p([
      "Dans un **ConstraintLayout**, chaque vue est placée par des **contraintes** (attachée au parent ou à d'autres vues). Une dimension à **0dp** ne veut pas dire « taille zéro » : elle signifie **« match constraints »** — **la dimension dépend des contraintes**. La vue s'étire entre ce à quoi elle est attachée.",
      "F **ConstraintLayout**, kol view kat7et b **contraintes** (mrbouta b parent wla b views okhrin). Dimension b **0dp** ma ma3naha ch « taille zéro » : ma3naha **« match constraints »** — **dimension katbe3 les contraintes**. View kattmedd bin chnou mrbouta bih.",
      "In a **ConstraintLayout**, each view is placed by **constraints** (attached to the parent or to other views). A dimension of **0dp** does not mean \"size zero\": it means **\"match constraints\"** — **the dimension depends on the constraints**. The view stretches between what it is attached to."
    ]),
    code(`<androidx.constraintlayout.widget.ConstraintLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <EditText
        android:id="@+id/nom"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:hint="@string/nom"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>`, 'xml', ["0dp + contraintes Start et End : le champ s'étire entre les deux bords du parent", "0dp + contraintes Start w End : champ kayttmedd bin jouj jnab dyal parent", '0dp + Start and End constraints: the field stretches between both parent edges']),
    trap([
      "Dans un ConstraintLayout, on **n'utilise pas `match_parent`** pour les vues enfants : on met **0dp** avec les deux contraintes opposées (Start + End pour la largeur, Top + Bottom pour la hauteur). Et 0dp **sans** contraintes des deux côtés ne s'étire pas.",
      "F ConstraintLayout, **ma kansta3mlouch `match_parent`** l views wlad : kandirou **0dp** m3a jouj contraintes m9ablin (Start + End l l3ard, Top + Bottom l tol). W 0dp **bla** contraintes mn jouj jnab ma kaytmeddch.",
      "In a ConstraintLayout, **do not use `match_parent`** for child views: use **0dp** with both opposite constraints (Start + End for width, Top + Bottom for height). And 0dp **without** constraints on both sides does not stretch."
    ]),
    exam([
      "Phrase de la diapo à restituer : « **Dans ConstraintLayout, 0dp signifie « match constraints » : la dimension dépend des contraintes.** » Questions possibles : différence dp / sp, calcul en px, effet de match_parent / wrap_content sur un bouton.",
      "Jomla dyal diapo li khassek t3awedha : « **F ConstraintLayout, 0dp ma3naha « match constraints » : dimension katbe3 les contraintes.** » Les questions momkin : far9 dp / sp, 7sab b px, chnou kaydir match_parent / wrap_content l bouton.",
      "Slide sentence to reproduce: \"**In ConstraintLayout, 0dp means 'match constraints': the dimension depends on the constraints.**\" Possible questions: dp vs sp, px calculation, effect of match_parent / wrap_content on a button."
    ]),
    quiz('mob-25', 'mob-26', 'mob-27')
  ],
  keyPoints: [
    L(["Le pixel brut dépend de la densité ; dp est indépendant de la densité : px = dp × dpi / 160 (1dp = 1px à 160 dpi).", "px kaytbe3 densité ; px = dp × dpi / 160.", 'Raw px depends on density; px = dp × dpi / 160 (1dp = 1px at 160 dpi).']),
    L(["dp pour les dimensions (48dp) ; sp pour le texte (18sp), car sp suit aussi le réglage de taille de police.", "dp l dimensions, sp l texte.", 'dp for dimensions (48dp); sp for text (18sp), since sp also follows the font size setting.']),
    L(["wrap_content = taille du contenu (+ padding) ; match_parent = toute la dimension que le parent attribue.", "wrap = contenu ; match = ga3 l blasa dyal parent.", 'wrap_content = content size (+ padding); match_parent = all the space the parent gives.']),
    L(["Exemple : largeur match_parent + hauteur wrap_content → bouton large, hauteur ajustée au texte.", "match_parent + wrap_content → bouton 3rid.", 'match_parent width + wrap_content height → wide button, height fits the text.']),
    L(["ConstraintLayout : 0dp = « match constraints », la dimension dépend des contraintes ; pas de match_parent pour les enfants.", "0dp = match constraints.", 'ConstraintLayout: 0dp = "match constraints"; no match_parent for children.'])
  ]
};

// ======================================================================
// Chapitre 4 — Navigation et passage de données
// ======================================================================
export const c4: Chapter = {
  id: 'navigation',
  module: 'mobile',
  order: 4,
  title: L(["Navigation entre écrans et passage de données", "Navigation bin écrans w passage dyal data", 'Navigating between screens and passing data']),
  summary: L([
    "Ouvrir un deuxième écran avec un Intent explicite, lui envoyer des données (putExtra), les lire (getIntent, getStringExtra, getIntExtra), revenir (finish) et renvoyer un résultat (setResult, registerForActivityResult), avec les pièges classiques.",
    "T7el écran tani b Intent explicite, tsifet lih data (putExtra), t9raha (getIntent, getStringExtra, getIntExtra), trje3 (finish) w trj3 résultat (setResult, registerForActivityResult), m3a les pièges.",
    "Opening a second screen with an explicit Intent, sending it data (putExtra), reading it (getIntent, getStringExtra, getIntExtra), going back (finish) and returning a result (setResult, registerForActivityResult), with the classic traps."
  ]),
  estimatedMinutes: 45,
  sections: [
    h(["1. L'Intent : le message entre deux écrans", "1. Intent : message bin jouj écrans", '1. The Intent: the message between two screens']),
    def([
      "Un **Intent** est un **message** adressé à Android pour demander une action, par exemple **ouvrir une Activity**. Un Intent **explicite** nomme **la classe exacte** de l'écran à ouvrir (`DetailActivity.class`). Un Intent **implicite** décrit seulement une **action** (« appeler », « ouvrir une page web ») et Android choisit l'application capable de la faire.",
      "**Intent** howa **message** kansiftouh l Android bach ndir chi action, b7al **n7ello Activity**. Intent **explicite** kaysemmi **classe bdbt** dyal écran li bghina (`DetailActivity.class`). Intent **implicite** kaywsef ghir **action** (« appeler », « 7ell page web ») w Android kaykhtar l'app li t9der dirha.",
      "An **Intent** is a **message** to Android asking for an action, e.g. **opening an Activity**. An **explicit** Intent names **the exact class** of the screen (`DetailActivity.class`). An **implicit** Intent only describes an **action** (\"call\", \"open a web page\") and Android picks an app that can do it."
    ]),
    plain([
      "Pense à une **enveloppe** : l'adresse = l'écran cible ; le contenu = les données (`putExtra`) ; la poste = Android (`startActivity`). L'écran B ouvre l'enveloppe avec `getIntent()`.",
      "Fekker f **ghlaf d bra** : l'adresse = écran li bghina ; dakhel = data (`putExtra`) ; l poste = Android (`startActivity`). Écran B kay7el l ghlaf b `getIntent()`.",
      "Think of an **envelope**: the address = the target screen; the content = the data (`putExtra`); the post office = Android (`startActivity`). Screen B opens it with `getIntent()`."
    ]),
    anim('NavigationFlow'),

    h(["2. Ouvrir un écran et lui envoyer des données", "2. 7ell écran w sifet lih data", '2. Opening a screen and sending it data']),
    code(`public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button bouton = findViewById(R.id.bouton_detail);
        bouton.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, DetailActivity.class); // 1. qui ouvrir
            intent.putExtra("nom", "Sara");                                        // 2. les données
            intent.putExtra("age", 21);
            startActivity(intent);                                                 // 3. envoyer
        });
    }
}`, 'java', ["Écran A : au clic, ouvrir DetailActivity avec deux données", "Écran A : f click, 7ell DetailActivity b jouj data", 'Screen A: on click, open DetailActivity with two values']),
    steps(["Lire ce code ligne par ligne", "9ra had code ster b ster", 'Reading this code line by line'], [
      {
        t: ['setOnClickListener', 'setOnClickListener', 'setOnClickListener'],
        b: ["On récupère le bouton (`findViewById`) et on lui donne un **écouteur de clic**. Le code entre `{ }` s'exécute **à chaque clic**, pas au démarrage.", "Kanjibou bouton (`findViewById`) w kan3tiwh **écouteur dyal click**. Code li bin `{ }` kaytexécuta **f kol click**, machi f démarrage.", "We get the button (`findViewById`) and give it a **click listener**. The code in `{ }` runs **on every click**, not at startup."]
      },
      {
        t: ['new Intent(MainActivity.this, DetailActivity.class)', 'new Intent(...)', 'new Intent(...)'],
        b: ["Premier paramètre : le **contexte**, l'Activity actuelle (`MainActivity.this`, car `this` seul désignerait l'écouteur dans une classe anonyme). Second : la **classe** de l'écran cible.", "Paramètre lowel : **contexte**, Activity li 7na fiha (`MainActivity.this`, 7it `this` bo7do y9der ydesigner l'écouteur f classe anonyme). Tani : **classe** dyal écran li bghina.", "First parameter: the **context**, the current Activity (`MainActivity.this`, since plain `this` would be the listener in an anonymous class). Second: the target screen **class**."]
      },
      {
        t: ['putExtra(clé, valeur)', 'putExtra(clé, valeur)', 'putExtra(key, value)'],
        b: ["Chaque donnée est rangée sous une **clé** (String). Types acceptés : String, int, double, boolean, tableaux… et des objets **Serializable** ou **Parcelable**.", "Kol data kat7et ta7t **clé** (String). Types : String, int, double, boolean, tableaux… w objets **Serializable** wla **Parcelable**.", "Each value is stored under a **key** (String). Types: String, int, double, boolean, arrays… and **Serializable** or **Parcelable** objects."]
      },
      {
        t: ['startActivity(intent)', 'startActivity(intent)', 'startActivity(intent)'],
        b: ["Android ouvre DetailActivity **si elle est déclarée dans le manifeste**. A n'est pas détruite : A.onPause → B.onCreate → B.onStart → B.onResume → A.onStop.", "Android kay7el DetailActivity **ila kanet mdeclariya f manifeste**. A ma katmse7ch : A.onPause → B.onCreate → B.onStart → B.onResume → A.onStop.", "Android opens DetailActivity **if it is declared in the manifest**. A is not destroyed: A.onPause → B.onCreate → B.onStart → B.onResume → A.onStop."]
      }
    ]),
    quiz('mob-30', 'mob-31', 'mob-32'),

    h(["3. Lire les données dans l'écran B", "3. 9ra data f écran B", '3. Reading the data in screen B']),
    code(`public class DetailActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detail);

        Intent intent = getIntent();                      // l'Intent qui a ouvert cet écran
        String nom = intent.getStringExtra("nom");        // même clé que putExtra
        int age = intent.getIntExtra("age", 0);           // 0 = valeur par défaut

        TextView texte = findViewById(R.id.texte_detail);
        texte.setText(nom + " a " + age + " ans");
    }
}`, 'java', ["Écran B : lire les données reçues dans onCreate()", "Écran B : 9ra data f onCreate()", 'Screen B: read the received data in onCreate()']),
    table([["Type envoyé", "Type li tsafet", 'Type sent'], ["Lecture dans B", "9raya f B", 'Reading in B'], ["Si la clé n'existe pas", "Ila clé ma kaynach", 'If the key is missing']], [
      ['String', '`getStringExtra("cle")`', ['renvoie **null**', 'kayrje3 **null**', 'returns **null**']],
      ['int', '`getIntExtra("cle", 0)`', ['renvoie la **valeur par défaut** (0)', 'kayrje3 **valeur par défaut** (0)', 'returns the **default value** (0)']],
      ['double', '`getDoubleExtra("cle", 0.0)`', ['valeur par défaut', 'valeur par défaut', 'default value']],
      ['boolean', '`getBooleanExtra("cle", false)`', ['valeur par défaut', 'valeur par défaut', 'default value']]
    ]),
    trap([
      "La clé doit être **exactement la même** des deux côtés (majuscules comprises). `putExtra(\"nom\", …)` puis `getStringExtra(\"Nom\")` → **null** → *NullPointerException* plus loin. Bonne pratique : déclarer la clé **une seule fois** en constante : `public static final String EXTRA_NOM = \"nom\";`.",
      "Clé khassha tkoun **bdbt nefsha** f jouj jnab (7tta majuscules). `putExtra(\"nom\", …)` w men b3d `getStringExtra(\"Nom\")` → **null** → *NullPointerException* mn b3d. Bonne pratique : declari clé **mra wa7da** f constante : `public static final String EXTRA_NOM = \"nom\";`.",
      "The key must be **exactly the same** on both sides (case included). `putExtra(\"nom\", …)` then `getStringExtra(\"Nom\")` → **null** → *NullPointerException* later. Good practice: declare the key **once** as a constant: `public static final String EXTRA_NOM = \"nom\";`."
    ]),
    trap([
      "Lire un nombre avec le **mauvais type** ne marche pas : `putExtra(\"age\", 21)` (int) puis `getStringExtra(\"age\")` → **null**. Et `getIntExtra` **exige** une valeur par défaut (2e paramètre).",
      "T9ra nombre b **type ghalat** ma kaykhdemch : `putExtra(\"age\", 21)` (int) w men b3d `getStringExtra(\"age\")` → **null**. W `getIntExtra` **khasso** valeur par défaut (paramètre tani).",
      "Reading a number with the **wrong type** fails: `putExtra(\"age\", 21)` (int) then `getStringExtra(\"age\")` → **null**. And `getIntExtra` **requires** a default value (2nd parameter)."
    ]),
    quiz('mob-33', 'mob-34', 'mob-35'),

    h(["4. Revenir et renvoyer un résultat", "4. Rje3 w rj3 résultat", '4. Going back and returning a result']),
    p([
      "Pour **revenir** à A, B appelle `finish()` (ou l'utilisateur appuie sur Retour) : B est détruite et A réapparaît **sans onCreate** (onRestart → onStart → onResume). **Ne relance pas A avec un nouvel Intent** : tu empilerais une deuxième copie de A.\n\nPour que B **renvoie une donnée** à A (ex. le contact choisi comme favori), A lance B avec un **lanceur de résultat** et B répond avec `setResult`.",
      "Bach **trje3** l A, B kat3ayet `finish()` (wla user kaybrek 3la Retour) : B katmse7 w A katban **bla onCreate** (onRestart → onStart → onResume). **Ma t3awedch t7el A b Intent jdid** : ghatzid nskha tanya dyal A f l pile.\n\nBach B **trj3 data** l A (b7al contact favori), A kat7el B b **lanceur de résultat** w B katjaweb b `setResult`.",
      "To **go back** to A, B calls `finish()` (or the user presses Back): B is destroyed and A reappears **without onCreate** (onRestart → onStart → onResume). **Do not restart A with a new Intent**: you would stack a second copy of A.\n\nFor B to **return data** to A (e.g. the contact marked as favourite), A starts B with a **result launcher** and B answers with `setResult`."
    ]),
    code(`// ---- Dans A (MainActivity) : déclarer le lanceur comme attribut ----
private final ActivityResultLauncher<Intent> lanceur = registerForActivityResult(
        new ActivityResultContracts.StartActivityForResult(),
        result -> {
            if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                boolean favori = result.getData().getBooleanExtra("favori", false);
                // mettre à jour l'écran A
            }
        });

// au clic : lancer B en attendant une réponse
lanceur.launch(new Intent(MainActivity.this, DetailActivity.class));

// ---- Dans B (DetailActivity) : répondre puis fermer ----
Intent data = new Intent();
data.putExtra("favori", true);
setResult(RESULT_OK, data);
finish();`, 'java', ["Renvoyer un résultat de B vers A", "Rj3 résultat mn B l A", 'Returning a result from B to A']),
    tip([
      "Tu verras encore `startActivityForResult(intent, code)` + `onActivityResult(...)` dans d'anciens cours : c'est l'**ancienne méthode, dépréciée**. Le principe est le même (setResult + finish côté B) ; la version actuelle est `registerForActivityResult`.",
      "Ghatchouf mazal `startActivityForResult(intent, code)` + `onActivityResult(...)` f cours 9dam : hadi **tari9a 9dima, dépréciée**. Nefs lfekra (setResult + finish f B) ; version jdida hiya `registerForActivityResult`.",
      "You will still see `startActivityForResult(intent, code)` + `onActivityResult(...)` in older material: the **old, deprecated** way. Same idea (setResult + finish in B); today's version is `registerForActivityResult`."
    ]),

    h(["5. Intent implicite : demander une action", "5. Intent implicite : tleb action", '5. Implicit Intent: asking for an action']),
    code(`// ouvrir le composeur avec un numéro (aucune permission nécessaire)
Intent appel = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:0612345678"));
startActivity(appel);

// ouvrir une page web
Intent web = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.emsi.ma"));
startActivity(web);`, 'java', ["Pas de classe cible : Android choisit l'application", "Bla classe : Android kaykhtar l'app", 'No target class: Android picks the app']),
    table([["Critère", "Mi3yar", 'Criterion'], ["Intent explicite", "Intent explicite", 'Explicit Intent'], ["Intent implicite", "Intent implicite", 'Implicit Intent']], [
      [['Cible', 'Cible', 'Target'], ['Une **classe** précise (`DetailActivity.class`)', '**Classe** m7eddda', 'A precise **class**'], ['Une **action** (`ACTION_DIAL`, `ACTION_VIEW`) + une donnée (Uri)', '**Action** + Uri', 'An **action** + data (Uri)']],
      [['Usage', 'Isti3mal', 'Use'], ['Naviguer **dans ton application**', 'Navigation **dakhel l\'app dyalek**', 'Navigate **within your app**'], ['Utiliser **une autre application** (téléphone, navigateur, carte…)', 'Tsta3mel **app okhra**', 'Use **another app** (phone, browser, map…)']]
    ]),
    exam([
      "Question type : « Écrire le code qui ouvre DetailActivity en lui passant le nom d'un contact, puis le code qui le lit. » → **A** : `new Intent(MainActivity.this, DetailActivity.class)`, `putExtra(\"nom\", nom)`, `startActivity(intent)`. **B**, dans onCreate : `getIntent().getStringExtra(\"nom\")`. Sans oublier : **DetailActivity déclarée dans le manifeste**.",
      "Sou2al : « Kteb code li kay7el DetailActivity w kaysifet smiyat contact, w code li kay9raha. » → **A** : `new Intent(MainActivity.this, DetailActivity.class)`, `putExtra(\"nom\", nom)`, `startActivity(intent)`. **B**, f onCreate : `getIntent().getStringExtra(\"nom\")`. W ma tnsach : **DetailActivity mdeclariya f manifeste**.",
      "Typical question: \"Write the code that opens DetailActivity passing a contact name, then the code that reads it.\" → **A**: `new Intent(MainActivity.this, DetailActivity.class)`, `putExtra(\"nom\", nom)`, `startActivity(intent)`. **B**, in onCreate: `getIntent().getStringExtra(\"nom\")`. And: **DetailActivity declared in the manifest**."
    ]),
    quiz('mob-36', 'mob-37', 'mob-38')
  ],
  keyPoints: [
    L(["Intent explicite : new Intent(ContexteActuel.this, Cible.class) puis startActivity(intent). La cible doit être déclarée dans le manifeste.", "new Intent(A.this, B.class) + startActivity ; B f manifeste.", 'Explicit Intent: new Intent(Current.this, Target.class) then startActivity; target declared in the manifest.']),
    L(["putExtra(clé, valeur) dans A ; getIntent().getStringExtra(clé) / getIntExtra(clé, défaut) dans onCreate de B — même clé, même type.", "putExtra / getXxxExtra b nefs clé w type.", 'putExtra in A; getIntent().getXxxExtra in B\'s onCreate — same key, same type.']),
    L(["Clé absente : getStringExtra renvoie null, getIntExtra renvoie la valeur par défaut.", "Clé ma kaynach : null / défaut.", 'Missing key: null for String, default for int.']),
    L(["Revenir : finish() (A revient sans onCreate). Renvoyer une donnée : setResult(RESULT_OK, data) + finish() dans B, registerForActivityResult dans A.", "finish() ; setResult + registerForActivityResult.", 'Back: finish(). Result: setResult + finish in B, registerForActivityResult in A.']),
    L(["Intent implicite = une action (ACTION_DIAL, ACTION_VIEW) + Uri ; Android choisit l'application.", "Implicite = action + Uri.", 'Implicit Intent = action + Uri; Android picks the app.'])
  ]
};

// ======================================================================
// Chapitre 5 — Lire un ConstraintLayout
// ======================================================================
export const c5: Chapter = {
  id: 'constraint',
  module: 'mobile',
  order: 5,
  title: L(["Lire un ConstraintLayout", "Kifach t9ra ConstraintLayout", 'Reading a ConstraintLayout']),
  summary: L([
    "La grammaire d'une contrainte (côté de la vue → côté de la cible), les règles (au moins une contrainte horizontale et une verticale), le centrage et le biais, les marges, 0dp, Start/End contre Left/Right, et la méthode pour lire un layout et dessiner l'écran.",
    "Grammaire dyal contrainte (jenb dyal view → jenb dyal cible), les règles (contrainte horizontale w verticale 3la l a9al), centrage w biais, marges, 0dp, Start/End vs Left/Right, w méthode bach t9ra layout w trsem l écran.",
    "The grammar of a constraint (view side → target side), the rules (at least one horizontal and one vertical constraint), centring and bias, margins, 0dp, Start/End vs Left/Right, and a method to read a layout and sketch the screen."
  ]),
  estimatedMinutes: 40,
  sections: [
    h(["1. La grammaire d'une contrainte", "1. Grammaire dyal contrainte", '1. The grammar of a constraint']),
    p([
      "Dans un **ConstraintLayout**, on ne dit pas « mets ce bouton en ligne 2 » : on **attache les côtés** de chaque vue à un côté du **parent** ou d'une **autre vue**, comme avec des élastiques. Chaque attribut se lit toujours de la même façon :",
      "F **ConstraintLayout**, ma kangoulouch « 7et bouton f ster 2 » : kan**rbtou jnab** dyal kol view b jenb dyal **parent** wla dyal **view okhra**, b7al b l'élastique. Kol attribut kayt9ra dima b nefs tari9a :",
      "In a **ConstraintLayout** you do not say \"put this button on row 2\": you **attach the sides** of each view to a side of the **parent** or of **another view**, like elastic bands. Every attribute reads the same way:"
    ]),
    code(`app:layout_constraintTop_toBottomOf="@id/titre"
                     ^^^   ^^^^^^        ^^^^^
                     |     |             la cible
                     |     son côté (Bottom)
                     mon côté (Top)`, 'text', [
      "« Mon **haut** est attaché au **bas** de **titre** » → cette vue est placée **sous** titre.",
      "« **Lfo9** dyali mrbout b **lte7t** dyal **titre** » → had view kayna **ta7t** titre.",
      "\"My **top** is attached to the **bottom** of **titre**\" → this view sits **below** titre."
    ]),
    table([["Attribut", "Attribut", 'Attribute'], ["Se lit", "Kayt9ra", 'Reads as'], ["Résultat", "Natija", 'Result']], [
      ['`Top_toTopOf="parent"`', ["Mon haut → haut du parent", "Lfo9 dyali → lfo9 dyal parent", 'My top → parent top'], ["Collé **en haut** de l'écran", "Lsse9 **lfo9**", 'Stuck to the **top**']],
      ['`Top_toBottomOf="@id/a"`', ["Mon haut → bas de a", "Lfo9 dyali → lte7t dyal a", 'My top → bottom of a'], ["**Sous** a", "**Ta7t** a", '**Below** a']],
      ['`Bottom_toTopOf="@id/a"`', ["Mon bas → haut de a", "Lte7t dyali → lfo9 dyal a", 'My bottom → top of a'], ["**Au-dessus** de a", "**Fo9** a", '**Above** a']],
      ['`Start_toEndOf="@id/a"`', ["Mon début → fin de a", "Bdaya dyali → nihaya dyal a", 'My start → end of a'], ["**À droite** de a", "**3la limn** dyal a", '**Right of** a']],
      ['`End_toStartOf="@id/a"`', ["Ma fin → début de a", "Nihaya dyali → bdaya dyal a", 'My end → start of a'], ["**À gauche** de a", "**3la lisr** dyal a", '**Left of** a']],
      ['`Start_toStartOf="@id/a"`', ["Mon début → début de a", "Bdaya dyali → bdaya dyal a", 'My start → start of a'], ["**Aligné à gauche** sur a", "**M9ad lisr** m3a a", '**Left-aligned** with a']],
      ['`Baseline_toBaselineOf="@id/a"`', ["Ma ligne de texte → celle de a", "Ster dyal texte dyali → dyal a", 'My text baseline → a\'s'], ["Textes **sur la même ligne**", "Textes **f nefs ster**", 'Texts **on the same line**']]
    ]),
    tip([
      "Le préfixe est `app:` (pas `android:`) : `app:layout_constraintTop_toTopOf`. Et pour cibler une vue on écrit `@id/titre` ; `@+id/titre` sert à **créer** l'id dans la vue elle-même.",
      "Préfixe howa `app:` (machi `android:`) : `app:layout_constraintTop_toTopOf`. Bach tcibli view katkteb `@id/titre` ; `@+id/titre` kaysta3mel bach **tsayb** l'id f view rasha.",
      "The prefix is `app:` (not `android:`): `app:layout_constraintTop_toTopOf`. To target a view write `@id/titre`; `@+id/titre` **creates** the id on the view itself."
    ]),
    quiz('mob-40', 'mob-41'),

    h(["2. Les règles qui décident de la position", "2. Les règles li kayhdedou position", '2. The rules that decide the position']),
    steps(["Cinq règles à appliquer dans l'ordre", "5 règles b tartib", 'Five rules, in order'], [
      {
        t: ["Règle 1 : une horizontale + une verticale", "Règle 1 : horizontale + verticale", 'Rule 1: one horizontal + one vertical'],
        b: ["Chaque vue a besoin d'**au moins une contrainte horizontale** (Start/End/Left/Right) **et une verticale** (Top/Bottom/Baseline). Sinon, à l'exécution, elle se place en **haut à gauche** (x = 0 ou y = 0), même si elle paraissait ailleurs dans l'éditeur.", "Kol view khassha **contrainte horizontale** (Start/End/Left/Right) **w verticale** (Top/Bottom/Baseline) 3la l a9al. Sinon, f l'exécution, kattla7 **lfo9 3la lisr** (x = 0 wla y = 0), wakha kanet f blasa khra f l'éditeur.", "Each view needs **at least one horizontal** (Start/End/Left/Right) **and one vertical** constraint (Top/Bottom/Baseline). Otherwise at runtime it lands **top-left** (x = 0 or y = 0), even if it looked elsewhere in the editor."]
      },
      {
        t: ["Règle 2 : un seul côté → collée", "Règle 2 : jenb wa7ed → lsse9a", 'Rule 2: one side → stuck'],
        b: ["Avec **un seul** côté attaché dans un axe (ex. seulement `End_toEndOf=\"parent\"`), la vue est **collée** de ce côté (+ marge).", "B jenb **wa7ed** f axe (b7al ghir `End_toEndOf=\"parent\"`), view kat**lsse9** f dak jenb (+ marge).", "With **one** side attached in an axis (e.g. only `End_toEndOf=\"parent\"`), the view is **stuck** to that side (+ margin)."]
      },
      {
        t: ["Règle 3 : deux côtés opposés → centrée", "Règle 3 : jouj jnab → f lwest", 'Rule 3: two opposite sides → centred'],
        b: ["Avec `Start` **et** `End` attachés (ou `Top` **et** `Bottom`), la vue est tirée des deux côtés : elle est **centrée** entre les deux cibles. Le **biais** (`layout_constraintHorizontal_bias`, de 0 à 1, défaut **0,5**) déplace ce centrage : 0 = à gauche, 1 = à droite.", "B `Start` **w** `End` mrboutin (wla `Top` **w** `Bottom`), view mjbouda mn jouj jnab : kat**koun f lwest**. **Biais** (`layout_constraintHorizontal_bias`, mn 0 l 1, par défaut **0,5**) kaybeddel l blasa : 0 = lisr, 1 = limn.", "With `Start` **and** `End` attached (or `Top` **and** `Bottom`), the view is pulled both ways: it is **centred** between the targets. The **bias** (`layout_constraintHorizontal_bias`, 0 to 1, default **0.5**) shifts it: 0 = left, 1 = right."]
      },
      {
        t: ["Règle 4 : 0dp → s'étire", "Règle 4 : 0dp → kattmedd", 'Rule 4: 0dp → stretches'],
        b: ["Si la dimension vaut **0dp** et que les deux côtés sont attachés, la vue **remplit l'espace** entre ses contraintes (*match constraints*) au lieu d'être centrée.", "Ila dimension **0dp** w jouj jnab mrboutin, view kat**3mmer l blasa** bin contraintes (*match constraints*) f blast ma tcentra.", "If the dimension is **0dp** and both sides are attached, the view **fills the space** between its constraints (*match constraints*) instead of being centred."]
      },
      {
        t: ["Règle 5 : la marge suit la contrainte", "Règle 5 : marge kattb3 contrainte", 'Rule 5: the margin follows the constraint'],
        b: ["`android:layout_marginTop=\"16dp\"` n'a d'effet **que s'il existe une contrainte Top**. Une marge sur un côté non contraint est **ignorée**.", "`android:layout_marginTop=\"16dp\"` ma kaykhdem **ghir ila kayna contrainte Top**. Marge f jenb bla contrainte kat**t-ignora**.", "`android:layout_marginTop=\"16dp\"` only works **if there is a Top constraint**. A margin on an unconstrained side is **ignored**."]
      }
    ]),
    anim('ConstraintReader'),
    trap([
      "**Start/End** et **Left/Right** ne sont pas identiques : Start/End **s'inversent** dans les langues écrites de droite à gauche (arabe), Left/Right non. Android recommande **Start/End**. Et ne mélange pas `Start` et `Left` sur la même vue.",
      "**Start/End** w **Left/Right** machi b7al b7al : Start/End kay**t9elbou** f les langues li katkteb mn limn l lisr (l3arbiya), Left/Right la. Android kaynsa7 b **Start/End**. W ma tkhallatch `Start` w `Left` f nefs view.",
      "**Start/End** and **Left/Right** are not the same: Start/End **flip** in right-to-left languages (Arabic), Left/Right do not. Android recommends **Start/End**. Do not mix `Start` and `Left` on the same view."
    ]),
    quiz('mob-42', 'mob-43', 'mob-44'),

    h(["3. Méthode : lire un layout et dessiner l'écran", "3. Méthode : 9ra layout w rsem l écran", '3. Method: read a layout and sketch the screen']),
    code(`<androidx.constraintlayout.widget.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ImageView
        android:id="@+id/photo"
        android:layout_width="64dp"
        android:layout_height="64dp"
        android:layout_marginStart="16dp"
        android:layout_marginTop="16dp"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/nom"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_marginStart="12dp"
        android:layout_marginEnd="16dp"
        android:text="@string/nom_contact"
        app:layout_constraintStart_toEndOf="@id/photo"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="@id/photo" />

    <TextView
        android:id="@+id/telephone"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:layout_constraintStart_toStartOf="@id/nom"
        app:layout_constraintTop_toBottomOf="@id/nom" />

    <Button
        android:id="@+id/appeler"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="24dp"
        android:text="@string/appeler"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintBottom_toBottomOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>`, 'xml', ["Fiche d'un contact : à lire sans exécuter", "Fiche dyal contact : 9raha bla ma tlanciha", 'Contact card: read it without running it']),
    steps(["Lecture vue par vue", "9raya view b view", 'Reading view by view'], [
      {
        t: ['photo', 'photo', 'photo'],
        b: ["Start → parent, Top → parent, marges 16dp : **coin en haut à gauche**, carré de 64dp.", "Start → parent, Top → parent, marges 16dp : **f rokn lfo9 lisr**, carré 64dp.", "Start → parent, Top → parent, 16dp margins: **top-left corner**, 64dp square."]
      },
      {
        t: ['nom', 'nom', 'nom'],
        b: ["Start → **fin de photo** (+12dp) : **à droite de la photo**. End → parent et largeur **0dp** : s'étire **jusqu'au bord droit**. Top → haut de photo : **aligné sur le haut de la photo**.", "Start → **nihaya dyal photo** (+12dp) : **3la limn dyal photo**. End → parent w l3ard **0dp** : kaytmedd **7tta l jenb limn**. Top → lfo9 dyal photo : **m9ad m3a lfo9 dyal photo**.", "Start → **end of photo** (+12dp): **right of the photo**. End → parent with **0dp** width: stretches **to the right edge**. Top → top of photo: **aligned with the photo's top**."]
      },
      {
        t: ['telephone', 'telephone', 'telephone'],
        b: ["Start → début de nom : **aligné à gauche sur le nom**. Top → bas de nom : **juste sous le nom**.", "Start → bdaya dyal nom : **m9ad lisr m3a nom**. Top → lte7t dyal nom : **ta7t nom direct**.", "Start → start of nom: **left-aligned with the name**. Top → bottom of nom: **right under the name**."]
      },
      {
        t: ['appeler', 'appeler', 'appeler'],
        b: ["Start **et** End → parent : **centré horizontalement**. Seulement Bottom → parent (+24dp) : **collé en bas**. Résultat : un bouton centré en bas de l'écran.", "Start **w** End → parent : **f lwest horizontalement**. Ghir Bottom → parent (+24dp) : **lsse9 lte7t**. Natija : bouton f lwest lte7t dyal l écran.", "Start **and** End → parent: **horizontally centred**. Only Bottom → parent (+24dp): **stuck to the bottom**. Result: a centred button at the bottom of the screen."]
      }
    ]),
    code(`+--------------------------------------+
| [photo]  Nom du contact ............ |
| [64dp ]  06 12 34 56 78              |
|                                      |
|                                      |
|              [ APPELER ]             |
+--------------------------------------+`, 'text', ["Le croquis attendu", "Croquis li khass", 'The expected sketch']),
    exam([
      "Méthode au contrôle : pour **chaque vue**, (1) repère sa contrainte **horizontale** et sa contrainte **verticale**, (2) traduis chaque attribut par « mon côté → côté de la cible », (3) applique les règles : un côté = collée, deux côtés = centrée (ou étirée si 0dp), (4) ajoute les marges, (5) dessine. Signale toute vue **sans contrainte horizontale ou verticale**.",
      "Méthode f contrôle : l **kol view**, (1) l9a contrainte **horizontale** w **verticale** dyalha, (2) traduiri kol attribut b « jenb dyali → jenb dyal cible », (3) tbe9 les règles : jenb wa7ed = lsse9a, jouj jnab = f lwest (wla mtmedda ila 0dp), (4) zid marges, (5) rsem. Goul ila kayna chi view **bla contrainte horizontale wla verticale**.",
      "Test method: for **each view**, (1) find its **horizontal** and **vertical** constraints, (2) translate each attribute as \"my side → target's side\", (3) apply the rules: one side = stuck, two sides = centred (or stretched if 0dp), (4) add margins, (5) sketch. Flag any view **missing a horizontal or vertical constraint**."
    ]),
    quiz('mob-45', 'mob-46', 'mob-47')
  ],
  keyPoints: [
    L(["layout_constraintX_toYOf=\"cible\" se lit « mon côté X est attaché au côté Y de la cible » (préfixe app:, cible @id/… ou parent).", "« Jenb X dyali mrbout b jenb Y dyal cible ».", '"My side X is attached to side Y of the target".']),
    L(["Chaque vue : au moins une contrainte horizontale et une verticale, sinon elle saute en haut à gauche à l'exécution.", "Horizontale + verticale, sinon (0,0).", 'At least one horizontal and one vertical constraint, otherwise it jumps to the top-left.']),
    L(["Un côté = collée ; deux côtés opposés = centrée (biais 0,5 par défaut) ; 0dp + deux côtés = étirée.", "Jenb = lsse9a ; jouj = f lwest ; 0dp = mtmedda.", 'One side = stuck; two sides = centred (bias 0.5); 0dp + two sides = stretched.']),
    L(["Une marge ne s'applique que du côté où il y a une contrainte.", "Marge ghir f jenb fih contrainte.", 'A margin only applies on a constrained side.']),
    L(["Start/End (s'inversent en arabe) sont recommandés plutôt que Left/Right.", "Start/End mzyanin 3la Left/Right.", 'Prefer Start/End (they flip in RTL) over Left/Right.'])
  ]
};

// ======================================================================
// Chapitre 6 — Listes : ListView, RecyclerView et adaptateurs
// ======================================================================
export const c6: Chapter = {
  id: 'listes',
  module: 'mobile',
  order: 6,
  title: L(["Listes : ListView, RecyclerView et adaptateurs", "Les listes : ListView, RecyclerView w adaptateurs", 'Lists: ListView, RecyclerView and adapters']),
  summary: L([
    "Le rôle de l'adaptateur entre les données et la liste, ListView avec ArrayAdapter (et le clic sur un élément), puis RecyclerView : layout d'une ligne, ViewHolder, les trois méthodes de l'adaptateur, LayoutManager, recyclage des vues, clic et mise à jour (notify…). Comparaison ListView / RecyclerView.",
    "Dor dyal adaptateur bin data w liste, ListView b ArrayAdapter (w click 3la élément), w men b3d RecyclerView : layout dyal ligne, ViewHolder, tlata d méthodes dyal adaptateur, LayoutManager, recyclage, click w mise à jour (notify…). Mo9arana ListView / RecyclerView.",
    "The adapter's role between data and list, ListView with ArrayAdapter (and item clicks), then RecyclerView: row layout, ViewHolder, the adapter's three methods, LayoutManager, view recycling, clicks and updates (notify…). ListView vs RecyclerView."
  ]),
  estimatedMinutes: 55,
  sections: [
    h(["1. Le problème : afficher une liste de données", "1. Lmochkil : nwerriw liste dyal data", '1. The problem: showing a list of data']),
    p([
      "Une application de contacts peut avoir 3 contacts ou 1000. Impossible d'écrire 1000 TextView dans le XML : la liste est **dynamique**. On utilise donc une **vue de liste** (ListView ou RecyclerView) et un **adaptateur** qui fabrique une ligne par donnée.",
      "App dyal contacts t9der ykoun fiha 3 contacts wla 1000. Ma ymkench tkteb 1000 TextView f XML : liste **dynamique**. Donc kansta3mlou **vue de liste** (ListView wla RecyclerView) w **adaptateur** li kaysayb ligne l kol data.",
      "A contacts app may hold 3 contacts or 1000. You cannot write 1000 TextViews in XML: the list is **dynamic**. So we use a **list view** (ListView or RecyclerView) and an **adapter** that builds one row per data item."
    ]),
    def([
      "Un **adaptateur** (*Adapter*) est le **pont entre les données et la liste** : il sait **combien** d'éléments il y a, il **crée la vue** d'une ligne (à partir d'un layout de ligne) et il la **remplit** avec les données de la position demandée.",
      "**Adaptateur** (*Adapter*) howa **l9ent ra bin data w liste** : kay3ref **ch7al** mn élément kayn, kay**sayb vue** dyal ligne (mn layout dyal ligne) w kay**3mmerha** b data dyal position li tlebna.",
      "An **adapter** is the **bridge between the data and the list**: it knows **how many** items there are, **creates the view** of a row (from a row layout) and **fills** it with the data at the requested position."
    ]),
    code(`  Données                 Adaptateur                      Vue de liste
  ArrayList<Contact>  -->  combien ? crée ? remplit ?  -->  ListView / RecyclerView
  [Sara, Youssef, ...]     (une ligne = item_contact.xml)   (affiche les lignes)`, 'text', ["Les trois acteurs", "Tlata d les acteurs", 'The three actors']),
    plain([
      "La liste est une **vitrine**, les données sont le **stock** dans l'entrepôt, et l'adaptateur est le **vendeur** qui va chercher chaque article et le pose dans la vitrine au bon endroit.",
      "Liste hiya **vitrine**, data hiya **sel3a** f l makhzen, w adaptateur howa **l bya3** li kayjib kol sel3a w kay7ettha f vitrine f blastha.",
      "The list is a **shop window**, the data is the **stock** in the warehouse, and the adapter is the **assistant** who fetches each item and places it in the window."
    ]),

    h(["2. ListView avec ArrayAdapter", "2. ListView b ArrayAdapter", '2. ListView with ArrayAdapter']),
    code(`<ListView
    android:id="@+id/liste"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />`, 'xml', ["activity_main.xml", "activity_main.xml", 'activity_main.xml']),
    code(`public class MainActivity extends AppCompatActivity {
    private final ArrayList<String> noms = new ArrayList<>();
    private ArrayAdapter<String> adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        noms.add("Sara");
        noms.add("Youssef");
        noms.add("Imane");

        ListView liste = findViewById(R.id.liste);
        adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, noms);
        liste.setAdapter(adapter);

        // clic sur un élément : ouvrir le détail
        liste.setOnItemClickListener((parent, view, position, id) -> {
            Intent intent = new Intent(MainActivity.this, DetailActivity.class);
            intent.putExtra("nom", noms.get(position));
            startActivity(intent);
        });
    }

    private void ajouter(String nom) {
        noms.add(nom);
        adapter.notifyDataSetChanged();   // prévenir la liste que les données ont changé
    }
}`, 'java', ["MainActivity.java : une ListView de noms", "MainActivity.java : ListView dyal smiyat", 'MainActivity.java: a ListView of names']),
    steps(["Lire ce code", "9ra had code", 'Reading this code'], [
      {
        t: ['new ArrayAdapter<>(this, layout, noms)', 'new ArrayAdapter<>(...)', 'new ArrayAdapter<>(...)'],
        b: ["Trois paramètres : le **contexte**, le **layout d'une ligne** et la **liste de données**. `android.R.layout.simple_list_item_1` est un layout **fourni par Android** (préfixe `android.R`) qui contient un seul TextView ; ArrayAdapter y écrit le `toString()` de chaque élément.", "Tlata d paramètres : **contexte**, **layout dyal ligne** w **liste dyal data**. `android.R.layout.simple_list_item_1` layout **3tah Android** (préfixe `android.R`) fih TextView wa7ed ; ArrayAdapter kaykteb fih `toString()` dyal kol élément.", "Three parameters: the **context**, the **row layout** and the **data list**. `android.R.layout.simple_list_item_1` is a layout **provided by Android** (`android.R` prefix) holding one TextView; ArrayAdapter writes each item's `toString()` into it."]
      },
      {
        t: ['setAdapter(adapter)', 'setAdapter(adapter)', 'setAdapter(adapter)'],
        b: ["On **branche** l'adaptateur sur la ListView. Sans cette ligne, la liste reste vide.", "Kan**rbtou** adaptateur m3a ListView. Bla had ster, liste katb9a khawya.", "**Plugs** the adapter into the ListView. Without it the list stays empty."]
      },
      {
        t: ['setOnItemClickListener', 'setOnItemClickListener', 'setOnItemClickListener'],
        b: ["Appelé au clic sur une ligne. Le paramètre **position** est l'indice de l'élément cliqué dans la liste de données : `noms.get(position)`.", "Kat3ayet f click 3la ligne. Paramètre **position** howa l'indice dyal élément li tclicka f liste : `noms.get(position)`.", "Called when a row is tapped. **position** is the index of the tapped item in the data list: `noms.get(position)`."]
      },
      {
        t: ['notifyDataSetChanged()', 'notifyDataSetChanged()', 'notifyDataSetChanged()'],
        b: ["Modifier l'ArrayList **ne met pas l'écran à jour tout seul** : il faut prévenir l'adaptateur pour qu'il redessine la liste.", "Tbeddel ArrayList **ma kaybeddelch l écran bo7do** : khass t9oul l adaptateur bach y3awed yrsem liste.", "Changing the ArrayList **does not refresh the screen by itself**: tell the adapter so it redraws the list."]
      }
    ]),
    trap([
      "Une ListView **personnalisée** (photo + nom + téléphone par ligne) demande un adaptateur à soi qui redéfinit `getView(position, convertView, parent)`. Il faut **réutiliser `convertView`** quand il n'est pas null, sinon on recrée une vue à chaque défilement : c'est lent. RecyclerView **impose** ce recyclage, c'est pourquoi on la préfère aujourd'hui.",
      "ListView **personnalisée** (photo + smiya + téléphone f kol ligne) khassha adaptateur dyalek li kay3awed ykteb `getView(position, convertView, parent)`. Khass **t3awed tsta3mel `convertView`** ila ma kanch null, sinon katsayb vue jdida f kol défilement : bti2. RecyclerView kat**frred** had recyclage, 3lach kanfeddlouha lyoum.",
      "A **custom** ListView (photo + name + phone per row) needs your own adapter overriding `getView(position, convertView, parent)`. You must **reuse `convertView`** when it is not null, otherwise a view is rebuilt on every scroll: slow. RecyclerView **enforces** this recycling, which is why it is preferred today."
    ]),
    quiz('mob-50', 'mob-51', 'mob-52'),

    h(["3. RecyclerView : les quatre pièces", "3. RecyclerView : rb3a d les pièces", '3. RecyclerView: the four pieces']),
    table([["Pièce", "Pièce", 'Piece'], ["Rôle", "Dor", 'Role'], ["Fichier", "Fichier", 'File']], [
      [['**Layout d\'une ligne**', '**Layout dyal ligne**', '**Row layout**'], ["À quoi ressemble **une** ligne", "Kifach katban ligne **wa7da**", 'What **one** row looks like'], '`res/layout/item_contact.xml`'],
      [['**Modèle**', '**Modèle**', '**Model**'], ["Une donnée (un contact)", "Data wa7da (contact)", 'One data item (a contact)'], '`Contact.java`'],
      [['**Adaptateur + ViewHolder**', '**Adaptateur + ViewHolder**', '**Adapter + ViewHolder**'], ["Crée les lignes et les remplit ; le ViewHolder **garde les vues** d'une ligne (pas de findViewById à chaque fois)", "Kaysayb lignes w kay3mmerhom ; ViewHolder kay**7fed les vues** dyal ligne (bla findViewById kol mra)", 'Creates and fills rows; the ViewHolder **keeps a row\'s views** (no findViewById each time)'], '`ContactAdapter.java`'],
      [['**RecyclerView + LayoutManager**', '**RecyclerView + LayoutManager**', '**RecyclerView + LayoutManager**'], ["Affiche les lignes ; le LayoutManager décide **comment** les disposer (liste verticale, horizontale, grille)", "Kaywerri lignes ; LayoutManager kay9rer **kifach** y7ethom (verticale, horizontale, grille)", 'Shows the rows; the LayoutManager decides **how** (vertical, horizontal, grid)'], '`activity_main.xml` + `MainActivity.java`']
    ]),
    code(`<!-- res/layout/item_contact.xml : UNE ligne -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="12dp">

    <TextView
        android:id="@+id/item_nom"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="18sp" />

    <TextView
        android:id="@+id/item_tel"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="14sp" />
</LinearLayout>`, 'xml', ["Hauteur wrap_content : sinon chaque ligne prendrait tout l'écran", "Tol wrap_content : sinon kol ligne takhod l écran kaml", 'Height wrap_content: otherwise each row fills the screen']),
    code(`public class Contact {
    private final String nom;
    private final String telephone;

    public Contact(String nom, String telephone) {
        this.nom = nom;
        this.telephone = telephone;
    }
    public String getNom() { return nom; }
    public String getTelephone() { return telephone; }
}`, 'java', ["Contact.java : le modèle", "Contact.java : modèle", 'Contact.java: the model']),
    code(`public class ContactAdapter extends RecyclerView.Adapter<ContactAdapter.ContactViewHolder> {

    private final List<Contact> contacts;

    public ContactAdapter(List<Contact> contacts) {
        this.contacts = contacts;
    }

    // 1. garde les vues d'UNE ligne
    static class ContactViewHolder extends RecyclerView.ViewHolder {
        final TextView nom, tel;
        ContactViewHolder(View itemView) {
            super(itemView);
            nom = itemView.findViewById(R.id.item_nom);
            tel = itemView.findViewById(R.id.item_tel);
        }
    }

    // 2. créer une ligne (appelée seulement quand il n'y a pas de ligne à recycler)
    @Override
    public ContactViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_contact, parent, false);
        return new ContactViewHolder(v);
    }

    // 3. remplir une ligne avec les données de la position
    @Override
    public void onBindViewHolder(ContactViewHolder holder, int position) {
        Contact c = contacts.get(position);
        holder.nom.setText(c.getNom());
        holder.tel.setText(c.getTelephone());
        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(v.getContext(), DetailActivity.class);
            intent.putExtra("nom", c.getNom());
            v.getContext().startActivity(intent);
        });
    }

    // 4. combien de lignes
    @Override
    public int getItemCount() {
        return contacts.size();
    }
}`, 'java', ["ContactAdapter.java : l'adaptateur et son ViewHolder", "ContactAdapter.java : adaptateur w ViewHolder", 'ContactAdapter.java: the adapter and its ViewHolder']),
    code(`// activity_main.xml
<androidx.recyclerview.widget.RecyclerView
    android:id="@+id/recycler"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />

// MainActivity.onCreate()
List<Contact> contacts = new ArrayList<>();
contacts.add(new Contact("Sara", "0612345678"));
contacts.add(new Contact("Youssef", "0698765432"));

RecyclerView recycler = findViewById(R.id.recycler);
recycler.setLayoutManager(new LinearLayoutManager(this));   // obligatoire
recycler.setAdapter(new ContactAdapter(contacts));`, 'java', ["Brancher le RecyclerView dans l'Activity", "Rbet RecyclerView f Activity", 'Wiring the RecyclerView in the Activity']),
    table([["Méthode", "Méthode", 'Method'], ["Quand Android l'appelle", "Imta Android kay3ayet 3liha", 'When Android calls it'], ["Ce qu'elle fait", "Chnou kadir", 'What it does']], [
      ['`getItemCount()`', ["Pour savoir combien de lignes afficher", "Bach y3ref ch7al mn ligne", 'To know how many rows'], ["Renvoie `contacts.size()`", "Katrj3 `contacts.size()`", 'Returns `contacts.size()`']],
      ['`onCreateViewHolder()`', ["Quand il faut une **nouvelle** ligne (aucune à recycler) — quelques fois seulement", "Mli khass ligne **jdida** (ma kayn ma y-recyclé) — chi mrat bach", 'When a **new** row is needed (none to recycle) — only a few times'], ["**Gonfle** (`inflate`) item_contact.xml et crée le ViewHolder", "Kat**inflati** item_contact.xml w katsayb ViewHolder", '**Inflates** item_contact.xml and creates the ViewHolder']],
      ['`onBindViewHolder()`', ["À **chaque** ligne qui devient visible (y compris une ligne recyclée)", "F **kol** ligne li katban (7tta li m-recycliya)", 'For **every** row that becomes visible (recycled ones too)'], ["**Remplit** les vues du holder avec `contacts.get(position)`", "Kat**3mmer** vues dyal holder b `contacts.get(position)`", '**Fills** the holder views with `contacts.get(position)`']]
    ]),
    anim('RecyclerSim'),
    trap([
      "Les trois oublis qui donnent un **écran vide** : (1) pas de `setLayoutManager(...)` (Logcat : *No layout manager attached; skipping layout*) ; (2) `getItemCount()` qui renvoie **0** (méthode générée par Android Studio non modifiée) ; (3) liste de données vide. Et `inflate(R.layout.item_contact, parent, **true**)` fait planter : le 3e paramètre doit être **false**, c'est le RecyclerView qui ajoute la ligne.",
      "Tlata d l7wayej li ila nsitihom l écran kayb9a **khawi** : (1) ma kaynch `setLayoutManager(...)` (Logcat : *No layout manager attached; skipping layout*) ; (2) `getItemCount()` katrj3 **0** (méthode li sayeb Android Studio w ma beddeltihach) ; (3) liste dyal data khawya. W `inflate(R.layout.item_contact, parent, **true**)` katplanti : paramètre talet khasso **false**, RecyclerView howa li kayzid ligne.",
      "The three omissions that give an **empty screen**: (1) no `setLayoutManager(...)` (Logcat: *No layout manager attached; skipping layout*); (2) `getItemCount()` returning **0** (the Android Studio stub left unchanged); (3) empty data list. And `inflate(R.layout.item_contact, parent, **true**)` crashes: the 3rd parameter must be **false**, the RecyclerView adds the row itself."
    ]),
    quiz('mob-53', 'mob-54', 'mob-55'),

    h(["4. Mettre à jour la liste", "4. Mise à jour dyal liste", '4. Updating the list']),
    code(`// ajouter à la fin
contacts.add(new Contact("Omar", "0611223344"));
adapter.notifyItemInserted(contacts.size() - 1);

// supprimer la ligne 2
contacts.remove(2);
adapter.notifyItemRemoved(2);

// modifier la ligne 0
adapter.notifyItemChanged(0);

// tout a changé (plus lourd, sans animation)
adapter.notifyDataSetChanged();`, 'java', ["Toujours : modifier la liste, PUIS notifier l'adaptateur", "Dima : beddel liste, W MEN B3D 9oul l adaptateur", 'Always: change the list, THEN notify the adapter']),
    tip([
      "Garde l'adaptateur dans un **attribut** de l'Activity (`private ContactAdapter adapter;`) pour pouvoir le notifier plus tard. Les méthodes précises (`notifyItemInserted/Removed/Changed`) animent seulement la ligne concernée ; `notifyDataSetChanged()` redessine tout.",
      "7fed adaptateur f **attribut** dyal Activity (`private ContactAdapter adapter;`) bach t9der t-notifyih mn b3d. Les méthodes précises (`notifyItemInserted/Removed/Changed`) kat-animi ghir ligne l m3niya ; `notifyDataSetChanged()` kay3awed yrsem kolchi.",
      "Keep the adapter in an Activity **field** (`private ContactAdapter adapter;`) so you can notify it later. The precise methods (`notifyItemInserted/Removed/Changed`) animate only that row; `notifyDataSetChanged()` redraws everything."
    ]),

    h(["5. ListView ou RecyclerView ?", "5. ListView wla RecyclerView ?", '5. ListView or RecyclerView?']),
    table([["Critère", "Mi3yar", 'Criterion'], ['ListView', 'ListView', 'ListView'], ['RecyclerView', 'RecyclerView', 'RecyclerView']], [
      [['Recyclage des vues', 'Recyclage', 'View recycling'], ["Possible mais **à la main** (`convertView`)", "Momkin walakin **b yeddek** (`convertView`)", 'Possible but **manual** (`convertView`)'], ["**Imposé** par le ViewHolder", "**Mfrouḍ** b ViewHolder", '**Enforced** by the ViewHolder']],
      [['Disposition', 'Disposition', 'Layout'], ["Liste **verticale** uniquement", "Ghir **verticale**", '**Vertical** only'], ["**LayoutManager** : `LinearLayoutManager` (vertical ou horizontal), `GridLayoutManager` (grille)", "**LayoutManager** : verticale, horizontale, grille", '**LayoutManager**: vertical, horizontal, grid']],
      [['Clic sur un élément', 'Click', 'Item click'], ['`setOnItemClickListener` intégré', '`setOnItemClickListener` mojoud', 'Built-in `setOnItemClickListener`'], ["À coder soi-même (ex. dans `onBindViewHolder`)", "Khassek tktebha (f `onBindViewHolder`)", 'Write it yourself (e.g. in `onBindViewHolder`)']],
      [['Mise à jour', 'Mise à jour', 'Updates'], ['`notifyDataSetChanged()`', '`notifyDataSetChanged()`', '`notifyDataSetChanged()`'], ['`notifyItemInserted/Removed/Changed` + animations', 'notifyItem… + animations', 'notifyItem… + animations']],
      [['Mise en place', 'Mise en place', 'Setup'], ["Rapide (ArrayAdapter en 2 lignes)", "Sari3 (ArrayAdapter f 2 sstour)", 'Quick (ArrayAdapter in 2 lines)'], ["Plus de code (modèle, layout de ligne, adaptateur, ViewHolder)", "Code ktar", 'More code']]
    ]),
    exam([
      "Questions classiques : « Rôle d'un adaptateur ? » → **pont entre les données et la liste : nombre d'éléments, création et remplissage des lignes**. « Les 3 méthodes d'un RecyclerView.Adapter ? » → **onCreateViewHolder (créer/gonfler une ligne), onBindViewHolder (la remplir pour une position), getItemCount (nombre)**. « Pourquoi RecyclerView ? » → **recyclage imposé des ViewHolder : seules les lignes visibles existent en mémoire**, plus LayoutManager flexible.",
      "Les questions classiques : « Dor dyal adaptateur ? » → **l9ent ra bin data w liste : 3adad, création w remplissage dyal lignes**. « 3 méthodes dyal RecyclerView.Adapter ? » → **onCreateViewHolder (tsayb/tinflati ligne), onBindViewHolder (t3mmerha l position), getItemCount (3adad)**. « 3lach RecyclerView ? » → **recyclage mfroud dyal ViewHolder : ghir lignes li bayna kaynin f mémoire**, w LayoutManager flexible.",
      "Classic questions: \"Adapter's role?\" → **bridge between data and list: item count, creating and filling rows**. \"The 3 methods of a RecyclerView.Adapter?\" → **onCreateViewHolder (create/inflate a row), onBindViewHolder (fill it for a position), getItemCount (count)**. \"Why RecyclerView?\" → **enforced ViewHolder recycling: only visible rows live in memory**, plus a flexible LayoutManager."
    ]),
    quiz('mob-56', 'mob-57', 'mob-58')
  ],
  keyPoints: [
    L(["Adaptateur = pont données ↔ liste : combien d'éléments, créer une ligne, la remplir pour une position.", "Adaptateur = l9ent ra data ↔ liste.", 'Adapter = data ↔ list bridge: count, create, fill.']),
    L(["ListView : new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, liste) + setAdapter ; clic : setOnItemClickListener(position).", "ArrayAdapter + setAdapter + setOnItemClickListener.", 'ArrayAdapter + setAdapter + setOnItemClickListener.']),
    L(["RecyclerView : layout de ligne + modèle + Adapter/ViewHolder (onCreateViewHolder, onBindViewHolder, getItemCount) + setLayoutManager + setAdapter.", "4 pièces + 3 méthodes.", '4 pieces + 3 methods.']),
    L(["Recyclage : seules les lignes visibles ont un ViewHolder ; en défilant, onBindViewHolder remplit les holders réutilisés.", "Ghir lignes bayna ; onBind kay3awed y3mmer.", 'Only visible rows have holders; onBind refills them.']),
    L(["Écran vide : pas de LayoutManager, getItemCount = 0 ou données vides. Après modification : notifyItemInserted/Removed/Changed ou notifyDataSetChanged.", "LayoutManager, getItemCount, notify.", 'Empty: no LayoutManager / count 0. Then notify….'])
  ]
};

// ======================================================================
// Chapitre 7 — Traces d'exécution et méthode de réponse
// ======================================================================
export const c7: Chapter = {
  id: 'traces',
  module: 'mobile',
  order: 7,
  title: L(["Traces d'exécution et méthode de réponse", "Traces d'exécution w méthode de réponse", 'Execution traces and how to answer']),
  summary: L([
    "Comment écrire la trace (sortie Logcat) d'un code Android pour un scénario donné, avec deux traces corrigées, et la méthode pour rédiger chaque type de réponse au contrôle.",
    "Kifach tkteb trace (Logcat) dyal code Android l scénario, b jouj traces m-corrigin, w méthode bach tjaweb 3la kol type dyal sou2al.",
    "How to write the trace (Logcat output) of Android code for a scenario, with two solved traces, and how to write each kind of answer."
  ]),
  estimatedMinutes: 25,
  sections: [
    h(["1. Méthode pour une trace d'exécution", "1. Méthode dyal trace", '1. Method for an execution trace']),
    steps(null, [
      { t: ["Lister les événements", "Kteb les événements", 'List the events'], b: ["Découpe le scénario : lancement, Accueil, retour, rotation, clic, finish…", "9ssem scénario : lancement, Accueil, rjou3, rotation, click, finish…", 'Split the scenario: launch, Home, return, rotation, click, finish…'] },
      { t: ["Méthodes appelées", "Méthodes li kat3ayet", 'Methods called'], b: ["Pour chaque événement, écris les méthodes du cycle de vie **dans l'ordre**, pour **chaque Activity** (A puis B…).", "L kol événement, kteb méthodes **b tartib**, l **kol Activity**.", 'For each event, write the lifecycle methods **in order**, for **each Activity**.'] },
      { t: ["Suivre les variables", "Tba3 les variables", 'Track variables'], b: ["Note la valeur des attributs. **Nouvelle instance** (rotation, processus tué) → les attributs **repartent de leur valeur initiale**.", "Kteb valeur dyal attributs. **Instance jdida** → attributs **kayrj3ou l valeur lowla**.", 'Track field values. **New instance** → fields **reset**.'] },
      { t: ["Écrire la sortie", "Kteb sortie", 'Write the output'], b: ["Une ligne par `Log.d`, numérotées, exactement comme Logcat les afficherait.", "Ster l kol `Log.d`, mnumrouin.", 'One numbered line per `Log.d`.'] }
    ]),

    h(["2. Trace corrigée : compteur et rotation", "2. Trace : compteur w rotation", '2. Solved trace: counter and rotation']),
    code(`public class MainActivity extends AppCompatActivity {
    private int compteur = 0;

    @Override protected void onCreate(Bundle b) { super.onCreate(b); setContentView(R.layout.activity_main); Log.d("T", "onCreate " + compteur); }
    @Override protected void onResume() { super.onResume(); compteur++; Log.d("T", "onResume " + compteur); }
    @Override protected void onStop()   { super.onStop(); Log.d("T", "onStop " + compteur); }
}`, 'java', ["Scénario : lancement, Accueil, retour, rotation", "Scénario : lancement, Accueil, rjou3, rotation", 'Scenario: launch, Home, return, rotate']),
    code(`1. onCreate 0      (lancement)
2. onResume 1
3. onStop 1        (Accueil)
4. onResume 2      (retour : même instance, pas de onCreate)
5. onStop 2        (rotation : destruction…)
6. onCreate 0      (… nouvelle instance : compteur repart à 0)
7. onResume 1`, 'text', ["Trace attendue", "Trace li khass", 'Expected trace']),
    trap(["Les méthodes **non redéfinies** (onStart, onPause…) ne produisent **aucune ligne** : n'écris que les Log.d présents dans le code.", "Méthodes **ma m3awdach** ma kat3ti **ta ster** : kteb ghir Log.d li f code.", 'Methods **not overridden** print **nothing**: only write the Log.d calls in the code.']),

    h(["3. Trace corrigée : deux écrans", "3. Trace : jouj écrans", '3. Solved trace: two screens']),
    p(["A et B ont chacune un `Log.d` dans onCreate, onPause, onStop, onDestroy et onResume. A est au premier plan ; l'utilisateur ouvre B, puis appuie sur Retour.", "A w B fihom `Log.d` f onCreate, onPause, onStop, onDestroy w onResume. A f l9eddam ; user kay7el B, w men b3d Retour.", 'A and B log in onCreate, onPause, onStop, onDestroy and onResume. A opens B, then Back.']),
    code(`1. A.onPause
2. B.onCreate
3. B.onResume
4. A.onStop
5. B.onPause       (Retour)
6. A.onResume
7. B.onStop
8. B.onDestroy`, 'text', ["onStart/onRestart non tracés ici car pas de Log.d", "onStart/onRestart ma kaybanouch 7it bla Log.d", 'onStart/onRestart not logged']),

    h(["4. Méthode de réponse au contrôle", "4. Méthode de réponse f contrôle", '4. How to answer in the test']),
    table([["Type de question", "Type dyal sou2al", 'Question type'], ["Ce qu'il faut écrire", "Chnou tkteb", 'What to write']], [
      [["Définition / rôle", "Ta3rif / dor", 'Definition / role'], ["**Définition** en une phrase + **rôle** + **exemple** (une ligne de code). Reprends les phrases du prof.", "**Ta3rif** f jomla + **dor** + **mithal** (ster code). 3awed jomal dyal prof.", '**Definition** + **role** + **example** (one code line). Reuse the professor\'s sentences.']],
      [["Comparaison (dp/sp, ListView/RecyclerView…)", "Mo9arana", 'Comparison'], ["Un **tableau** avec 3 ou 4 critères.", "**Tableau** b 3 wla 4 critères.", 'A **table** with 3–4 criteria.']],
      [["Écrire du code", "Kteb code", 'Write code'], ["Code **complet** de la méthode (onCreate…), dans l'ordre : setContentView → findViewById → logique. Mentionne le **manifeste** si un écran est ajouté.", "Code **kamel** b tartib : setContentView → findViewById → logique. Dkr **manifeste** ila zedti écran.", '**Complete** method code in order; mention the **manifest** for a new screen.']],
      [["Trace d'exécution", "Trace", 'Trace'], ["Lignes **numérotées**, une par Log.d, avec l'événement entre parenthèses et la valeur des variables.", "Sstour **mnumrouin**, wa7ed l kol Log.d, m3a événement w valeurs.", '**Numbered** lines, one per Log.d, with the event and variable values.']],
      [["Lire un layout", "9ra layout", 'Read a layout'], ["Vue par vue : contrainte horizontale, verticale, règle → **croquis**.", "View b view : horizontale, verticale, règle → **croquis**.", 'View by view: horizontal, vertical, rule → **sketch**.']],
      [["Trouver l'erreur", "L9a l erreur", 'Find the bug'], ["**Cause** (ce qui se passe) + **correction** (le code corrigé).", "**Sabab** + **correction** (code msse7).", '**Cause** + **fix** (corrected code).']]
    ]),
    quiz('mob-60', 'mob-61')
  ],
  keyPoints: [
    L(["Trace : événements → méthodes dans l'ordre (par Activity) → variables → une ligne par Log.d.", "Événements → méthodes → variables → sstour.", 'Events → methods → variables → lines.']),
    L(["Nouvelle instance (rotation) : les attributs repartent de zéro ; retour sans destruction : pas de onCreate.", "Rotation = reset ; rjou3 = bla onCreate.", 'Rotation resets fields; return has no onCreate.']),
    L(["Réponse : définition + rôle + exemple ; comparaison en tableau ; code complet ; cause + correction.", "Ta3rif + dor + mithal ; tableau ; code ; sabab + correction.", 'Definition + role + example; table; full code; cause + fix.'])
  ]
};

// ======================================================================
// Chapitre 8 — Contrôle 2025 corrigé (annale du prof, Drive)
// ======================================================================
export const c8: Chapter = {
  id: 'annale',
  module: 'mobile',
  order: 8,
  title: L(["Annale : Contrôle 2025 corrigé", "Annale : Contrôle 2025 m-corrigi", 'Past paper: 2025 test, solved']),
  summary: L([
    "Le contrôle de Développement Mobile du 26/11/2025 (1h30, 20 pts) partagé par le prof, question par question avec la réponse attendue, et les notions qu'il ajoute : nom du package, minSdk, structure du projet, layouts, getText().toString(), build.gradle.",
    "Contrôle dyal Dev Mobile 26/11/2025 (1h30, 20 pts) li 3ta l prof, sou2al b sou2al m3a jawab, w notions jdad : package, minSdk, structure dyal projet, layouts, getText().toString(), build.gradle.",
    "The 26/11/2025 Mobile Development test (1h30, 20 pts) shared by the professor, question by question with the expected answer, plus the notions it adds: package name, minSdk, project structure, layouts, getText().toString(), build.gradle."
  ]),
  estimatedMinutes: 40,
  sections: [
    exam(["Structure : **Partie I** questions de cours (12 pts), **Partie II** code (8 pts). « La clarté et la simplicité des réponses et du code seront prises en considération » : réponds court, précis, avec le bon vocabulaire. Tu peux le passer en conditions réelles dans **Examen blanc**.", "**Partie I** cours (12 pts), **Partie II** code (8 pts). Jaweb 9sir w wade7. T9der dwzou b wa9t f **Examen blanc**.", '**Part I** theory (12 pts), **Part II** code (8 pts). Answer short and precise. Take it timed in **Mock exam**.']),

    h(["Partie I — Q1 à Q3 : le projet Android", "Partie I — Q1 l Q3 : projet Android", 'Part I — Q1–Q3: the Android project']),
    steps(null, [
      { t: ["Q1. Pourquoi le nom du package est essentiel ? (1 pt)", "Q1. 3lach package mohim ?", 'Q1. Why is the package name essential?'], b: ["C'est l'**identifiant unique** de l'application (`applicationId`, ex. `com.example.controleandroid`) sur l'appareil et sur le Play Store : deux applications ne peuvent pas avoir le même. Le changer revient à publier **une autre application**. Il sert aussi d'**espace de noms** pour les classes Java et la classe R.", "Howa **identifiant unique** dyal l'app (`applicationId`) f téléphone w f Play Store : jouj apps ma ymkench ykoun 3andhom nefs package. Ila beddelto = **app okhra**. W howa **namespace** dyal classes Java w R.", "It is the app's **unique identifier** (`applicationId`) on the device and the Play Store: no two apps share it; changing it means **a different app**. It is also the **namespace** for Java classes and R."] },
      { t: ["Q2. SDK / API (1 pt)", "Q2. SDK / API", 'Q2. SDK / API'], b: ["**SDK** : ensemble des **outils et bibliothèques** nécessaires pour développer et construire une application Android (compilateur, build-tools, adb, émulateur, API). **API** : ensemble de **classes et méthodes** fournies par Android pour utiliser ses fonctionnalités (interface, caméra, capteurs…). Chaque version d'Android a un **niveau d'API** (ex. API 24 = Android 7.0).", "**SDK** : **outils w bibliothèques** bach tdevelopper w tbni app Android. **API** : **classes w méthodes** li 3tana Android bach nsta3mlou fonctionnalités dyalo. Kol version 3andha **niveau d'API** (API 24 = Android 7.0).", '**SDK**: the **tools and libraries** to build an Android app. **API**: the **classes and methods** Android provides to use its features. Each version has an **API level** (API 24 = Android 7.0).'] },
      { t: ["Q3. Structure du projet (2 pts)", "Q3. Structure dyal projet", 'Q3. Project structure'], b: ["a) Interfaces XML : **`res/layout/`**. b) Code source : **`app/src/main/java/<package>/`** (dossier *java*, même en Kotlin). c) **AndroidManifest.xml** : déclare les composants (Activity…), les permissions, le nom, l'icône. d) Cet `intent-filter` (action **MAIN** + catégorie **LAUNCHER**) fait de l'Activity le **point d'entrée** : elle s'ouvre au lancement et son icône apparaît dans le **lanceur** du téléphone.", "a) **`res/layout/`**. b) **`app/src/main/java/<package>/`**. c) Manifeste : composants, permissions, smiya, icône. d) **MAIN + LAUNCHER** = Activity hiya **point d'entrée** : kat7el f lancement w l'icône dyalha katban f **launcher**.", "a) **`res/layout/`**. b) **`app/src/main/java/<package>/`**. c) Manifest: components, permissions, name, icon. d) **MAIN + LAUNCHER** makes the Activity the **entry point**, shown in the **launcher**."] }
    ]),

    h(["Partie I — Q4 à Q8 : cycle de vie, unités, setContentView", "Partie I — Q4 l Q8", 'Part I — Q4–Q8']),
    steps(null, [
      { t: ["Q4. onCreate / onStart / onResume (1,5 pt)", "Q4.", 'Q4.'], b: ["**onCreate()** : création de l'Activity, appelée une fois par instance ; on y charge l'interface (setContentView) et on initialise les vues. **onStart()** : l'Activity devient **visible**. **onResume()** : elle passe **au premier plan** et devient **interactive**.", "**onCreate()** : création, mra wa7da, setContentView. **onStart()** : **bayna**. **onResume()** : **l9eddam w interactive**.", '**onCreate()**: creation, once per instance, setContentView. **onStart()**: **visible**. **onResume()**: **foreground, interactive**.'] },
      { t: ["Q5. Rotation (0,5 pt)", "Q5. Rotation", 'Q5. Rotation'], b: ["**onPause → onStop → onDestroy → onCreate → onStart → onResume** : l'Activity est détruite puis recréée (nouvelle instance).", "**onPause → onStop → onDestroy → onCreate → onStart → onResume**.", '**onPause → onStop → onDestroy → onCreate → onStart → onResume**.'] },
      { t: ["Q6. sp / dp (0,5 pt)", "Q6.", 'Q6.'], b: ["**dp** : dimensions indépendantes de la densité (tailles, marges). **sp** : taille du **texte**, tient compte en plus du **réglage de police** de l'utilisateur.", "**dp** : dimensions. **sp** : texte + réglage police.", '**dp**: dimensions. **sp**: text + font setting.'] },
      { t: ["Q7. match_parent / wrap_content (0,5 pt)", "Q7.", 'Q7.'], b: ["**match_parent** : la vue prend toute la dimension que lui donne son parent. **wrap_content** : elle prend juste la taille de son contenu (+ padding).", "**match_parent** : ga3 l blasa dyal parent. **wrap_content** : 9ed contenu.", '**match_parent**: all the parent space. **wrap_content**: content size.'] },
      { t: ["Q8. setContentView(R.layout.activity_main) (1 pt)", "Q8.", 'Q8.'], b: ["Elle **charge l'interface** décrite dans `res/layout/activity_main.xml` et l'affiche comme contenu de l'Activity ; `R.layout.activity_main` est l'identifiant de cette ressource (sans .xml). Placée dans onCreate, avant tout findViewById.", "Kat**chargi l'interface** dyal `activity_main.xml` ; f onCreate 9bel findViewById.", '**Loads the interface** from `activity_main.xml`; in onCreate before findViewById.'] }
    ]),

    h(["Partie I — Q9 à Q12 : layouts, séparation, strings, minSdk", "Partie I — Q9 l Q12", 'Part I — Q9–Q12']),
    table([["Layout", "Layout", 'Layout'], ["Principe", "Principe", 'Principle']], [
      ['**LinearLayout**', ["Vues **les unes après les autres**, en ligne ou en colonne (`orientation`)", "Views **wa7da mor lokhra**, horizontal wla vertical", 'Views **one after another**, row or column']],
      ['**ConstraintLayout**', ["Vues placées par **contraintes** (layout par défaut d'Android Studio)", "Views b **contraintes** (par défaut)", 'Views placed by **constraints** (default)']],
      ['**RelativeLayout**', ["Vues placées **par rapport** au parent ou aux autres (`layout_below`, `alignParentEnd`…)", "Views **b 3ala9a** m3a parent wla lokhrin", 'Views placed **relative** to parent or siblings']],
      ['**FrameLayout**', ["Vues **empilées** les unes sur les autres (une seule vue en général)", "Views **fo9 b3diyathom**", 'Views **stacked** on each other']],
      ['**TableLayout / GridLayout**', ["Vues en **lignes et colonnes**", "**Sstour w colonnes**", '**Rows and columns**']]
    ]),
    steps(null, [
      { t: ["Q9. Quatre layouts (1,5 pt)", "Q9.", 'Q9.'], b: ["LinearLayout, ConstraintLayout, RelativeLayout, FrameLayout (ou TableLayout / GridLayout), avec une demi-phrase chacun (tableau ci-dessus).", "4 mn tableau.", 'Four from the table.'] },
      { t: ["Q10. Logique métier / présentation (1 pt)", "Q10.", 'Q10.'], b: ["La **présentation** est décrite en **XML** dans `res/` (layouts, strings, couleurs). La **logique** est dans les classes **Java/Kotlin** (`java/`, les Activity). Les deux sont reliées par la classe **R** : `setContentView(R.layout.…)`, `findViewById(R.id.…)`.", "**Présentation** = XML f `res/` ; **logique** = Java f Activity ; mrboutin b **R**.", '**Presentation** = XML in `res/`; **logic** = Java classes; linked by **R**.'] },
      { t: ["Q11. Pourquoi strings.xml (1 pt)", "Q11.", 'Q11.'], b: ["Textes **centralisés** : modification en un seul endroit, **réutilisation**, **traduction** facile (`values-en/strings.xml`), pas de texte en dur dans le code ou le layout.", "Centralisés, réutilisation, traduction, bla texte en dur.", 'Centralised, reusable, translatable, no hard-coded text.'] },
      { t: ["Q12. MinSDK pour des tablettes de restaurant (0,5 pt)", "Q12. MinSDK", 'Q12. MinSDK'], b: ["Un **minSdk élevé/récent** (celui des tablettes fournies) : la solution est **clé en main**, le restaurant n'utilise que **nos tablettes**, donc pas besoin de compatibilité avec de vieux appareils ; on profite des **API récentes**, de la sécurité et on teste moins de versions.", "**minSdk 3ali** : tablettes dyalna bo7dhom, ma khassnach compatibilité m3a téléphones 9dam ; API jdad w sécurité.", 'A **high/recent minSdk**: we supply the tablets, so no old-device compatibility is needed; recent APIs and security.'], why: ["Pour une application publiée sur le Play Store, on choisirait au contraire un minSdk bas pour toucher plus d'utilisateurs.", "L Play Store, minSdk hbet bach twsel l bzaf.", 'For a public Play Store app you would pick a lower minSdk.'] }
    ]),

    h(["Partie II — Code (8 pts)", "Partie II — Code", 'Part II — Code']),
    code(`EditText input = findViewById(R.id.editName);
String nom = input;                          // ERREUR : un EditText n'est pas un String
String nom = input.getText().toString();     // correct`, 'java', ["Q1 : récupérer le texte d'un EditText", "Q1 : texte dyal EditText", 'Q1: reading an EditText']),
    steps(null, [
      { t: ["Q1. Pourquoi `String nom = input;` est incorrect (1 pt)", "Q1.", 'Q1.'], b: ["`input` est un **objet EditText** (une vue), pas une chaîne : types incompatibles → **erreur de compilation**. Il faut lire son contenu : `input.getText().toString()`.", "`input` howa **EditText** machi String → **erreur de compilation**. Khass `getText().toString()`.", '`input` is an **EditText**, not a String → **compile error**. Use `getText().toString()`.'] },
      { t: ["Q2a. Composants du formulaire (2 pts)", "Q2a.", 'Q2a.'], b: ["Un **layout** conteneur ; des **TextView** pour les libellés ; des **EditText** pour la saisie (avec `inputType` adapté : texte, email, nombre…) ; un **Button** « OK » (`btnOk`). Selon le formulaire : RadioButton/RadioGroup (choix unique), CheckBox (choix multiples), Spinner (liste).", "Layout, **TextView** (libellés), **EditText** (saisie), **Button** OK ; w ila kayn : RadioButton, CheckBox, Spinner.", 'A layout, **TextView** labels, **EditText** inputs, an OK **Button**; plus RadioButton, CheckBox, Spinner if present.'], why: ["L'image du formulaire n'apparaît pas dans la version texte du sujet : adapte la liste aux champs dessinés.", "Tswira ma kaynach f texte : 3la 7sab champs li f sujet.", 'The form image is not in the text version: adapt to its fields.'] },
      { t: ["Q2b. getText().toString() (1 pt)", "Q2b.", 'Q2b.'], b: ["`getText()` renvoie le contenu saisi dans l'EditText (un objet **Editable**) ; `toString()` le convertit en **String** pour pouvoir l'utiliser (l'afficher, le tester, l'envoyer avec putExtra).", "`getText()` = contenu (Editable) ; `toString()` = String.", '`getText()` = typed content (Editable); `toString()` → String.'] },
      { t: ["Q2c. Le code du bouton OK (1 pt)", "Q2c.", 'Q2c.'], b: ["Au **clic** sur `btnOk`, on crée un **Intent explicite** vers **Activity2** et `startActivity(i)` **ouvre ce deuxième écran**. Aucune donnée n'est transmise (pas de putExtra) ; Activity2 doit être déclarée dans le manifeste. Dans une lambda, `this` désigne bien l'Activity.", "F **click** 3la `btnOk`, **Intent explicite** l **Activity2** w `startActivity` kay**7elha**. Bla data ; Activity2 f manifeste.", 'On **click**, an **explicit Intent** to **Activity2** and `startActivity` **opens it**; no data; Activity2 in the manifest.'] },
      { t: ["Q3. Dans quels fichiers ? (3 pts)", "Q3. F ach mn fichiers ?", 'Q3. Which files?'], b: ["a) Le `<Button …>` : un **fichier de layout** `res/layout/activity_main.xml` (les attributs `app:layout_constraint…` montrent un **ConstraintLayout**). b) `<resources><string …>` : **`res/values/strings.xml`**. c) `defaultConfig { applicationId … minSdk … }` : le **`build.gradle.kts` du module app** (configuration Gradle : identifiant, minSdk 24 = Android 7.0, targetSdk 36, version).", "a) **layout** `res/layout/…xml`. b) **`res/values/strings.xml`**. c) **`app/build.gradle.kts`** (Gradle).", 'a) a **layout** file. b) **`res/values/strings.xml`**. c) the app module\'s **`build.gradle.kts`**.'] }
    ]),
    trap(["Dans le bouton de la Q3a, `match_parent` à l'intérieur d'un ConstraintLayout est déconseillé (on mettrait `0dp` + Start/End) et il n'a qu'une contrainte verticale (Bottom) : collé en bas. Bon réflexe à signaler si on te demande de commenter ce code.", "F bouton Q3a, `match_parent` f ConstraintLayout ma mzyanch (0dp + Start/End) ; w ghir Bottom : lsse9 lte7t.", 'In Q3a, `match_parent` inside a ConstraintLayout is discouraged (use 0dp + Start/End); only a Bottom constraint: stuck to the bottom.']),
    quiz('mob-70', 'mob-71', 'mob-72', 'mob-73')
  ],
  keyPoints: [
    L(["Package (applicationId) = identifiant unique de l'app ; SDK = outils + bibliothèques ; API = classes fournies, niveau d'API = version.", "Package unique ; SDK ; API.", 'Package = unique id; SDK; API level.']),
    L(["res/layout = interfaces ; java/ = code ; manifeste = composants + permissions ; MAIN + LAUNCHER = écran de démarrage.", "res/layout, java/, manifeste, MAIN/LAUNCHER.", 'res/layout, java/, manifest, MAIN/LAUNCHER.']),
    L(["Layouts : LinearLayout, ConstraintLayout, RelativeLayout, FrameLayout (TableLayout, GridLayout).", "4 layouts.", 'Four layouts.']),
    L(["Lire un EditText : input.getText().toString() ; build.gradle.kts (app) : applicationId, minSdk, targetSdk, version.", "getText().toString() ; build.gradle.kts.", 'getText().toString(); build.gradle.kts.'])
  ]
};
