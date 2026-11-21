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
