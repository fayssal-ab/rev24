/** Texts of the mobile (native Android) animations (fr / dar / en). */

export const FILES_FLOW = {
  title: { fr: 'Du clic sur l\'icône à l\'écran affiché', dar: 'Mn click 3la l\'icône 7tta l écran kayban', en: 'From the icon tap to the displayed screen' },
  steps: [
    {
      file: 'AndroidManifest.xml',
      text: {
        fr: 'L\'utilisateur touche l\'icône. Android lit le **manifeste** : il y trouve l\'Activity déclarée avec l\'action `MAIN` et la catégorie `LAUNCHER`. C\'est **MainActivity**. Une Activity non déclarée ici ne peut pas être lancée.',
        dar: 'User kaybrek 3la l\'icône. Android kay9ra **manifeste** : kayl9a fih l\'Activity li declarée b `MAIN` w `LAUNCHER`. Hiya **MainActivity**. Activity ma declaréech hna ma t9derch tetlança.',
        en: 'The user taps the icon. Android reads the **manifest** and finds the Activity declared with action `MAIN` and category `LAUNCHER`: **MainActivity**. An Activity not declared here cannot be started.'
      },
      code: '<activity android:name=".MainActivity"\n          android:exported="true">\n  <intent-filter>\n    <action android:name="android.intent.action.MAIN" />\n    <category android:name="android.intent.category.LAUNCHER" />\n  </intent-filter>\n</activity>'
    },
    {
      file: 'MainActivity.java',
      text: {
        fr: 'Le système crée **une instance** de MainActivity et appelle **onCreate()**. C\'est la première méthode du cycle de vie : on y prépare l\'Activity et son interface.',
        dar: 'Système kaysayb **instance** dyal MainActivity w kay3ayet l **onCreate()**. Hiya awel méthode f cycle de vie : fiha kanwjdou l\'Activity w l\'interface dyalha.',
        en: 'The system creates **an instance** of MainActivity and calls **onCreate()**, the first lifecycle method, where the Activity and its interface are prepared.'
      },
      code: '@Override\nprotected void onCreate(Bundle savedInstanceState) {\n    super.onCreate(savedInstanceState);\n    setContentView(R.layout.activity_main);\n}'
    },
    {
      file: 'res/layout/activity_main.xml',
      text: {
        fr: '`setContentView(R.layout.activity_main)` **charge l\'interface** décrite dans `activity_main.xml`. `R.layout.activity_main` est l\'identifiant de la ressource, **sans l\'extension .xml**. Les composants (TextView, Button…) sont créés avec leur disposition.',
        dar: '`setContentView(R.layout.activity_main)` kay**chargi l\'interface** li mwesfa f `activity_main.xml`. `R.layout.activity_main` howa l\'identifiant dyal ressource, **bla extension .xml**. Les composants (TextView, Button…) kaytsaybou b disposition dyalhom.',
        en: '`setContentView(R.layout.activity_main)` **loads the interface** described in `activity_main.xml`. `R.layout.activity_main` is the resource id, **without the .xml extension**. The components (TextView, Button…) are created with their layout.'
      },
      code: '<TextView\n    android:layout_width="wrap_content"\n    android:layout_height="wrap_content"\n    android:text="@string/app_name" />'
    },
    {
      file: 'res/values/strings.xml',
      text: {
        fr: 'Le TextView n\'écrit pas le texte en dur : `@string/app_name` **réutilise le texte déclaré** dans `strings.xml`. Résultat à l\'écran : **Contacts**. Pour traduire l\'application, on ajoute un autre `strings.xml` (ex. `values-en/`) sans toucher au layout.',
        dar: 'TextView ma kaykteb ch texte direct : `@string/app_name` kay**3awed yste3mel texte** li declaré f `strings.xml`. F l écran : **Contacts**. Bach ttraduiri l app, katzid `strings.xml` akhor (b7al `values-en/`) bla ma tmess layout.',
        en: 'The TextView does not hard-code its text: `@string/app_name` **reuses the text declared** in `strings.xml`. On screen: **Contacts**. To translate the app, add another `strings.xml` (e.g. `values-en/`) without touching the layout.'
      },
      code: '<resources>\n    <string name="app_name">Contacts</string>\n</resources>'
    }
  ],
  rule: {
    fr: 'Le **XML décrit l\'interface**. L\'**Activity porte le comportement**. Le **manifeste décrit les composants**.',
    dar: '**XML kaywsef l\'interface**. **Activity fiha comportement**. **Manifeste kaywsef les composants**.',
    en: 'The **XML describes the interface**. The **Activity carries the behaviour**. The **manifest describes the components**.'
  }
};

export const LIFECYCLE = {
  title: { fr: 'Simulateur du cycle de vie d\'une Activity', dar: 'Simulateur dyal cycle de vie dyal Activity', en: 'Activity lifecycle simulator' },
  instance: { fr: 'Instance', dar: 'Instance', en: 'Instance' },
  state: { fr: 'État', dar: 'État', en: 'State' },
  calls: { fr: 'Méthodes appelées', dar: 'Méthodes li t3ayet 3lihom', en: 'Methods called' },
  reset: { fr: 'Recommencer', dar: '3awed mn lowel', en: 'Restart' },
  none: { fr: 'Aucune méthode appelée', dar: 'Ta méthode ma t3ayet 3liha', en: 'No method called' },
  pick: { fr: 'Choisis une action de l\'utilisateur ou du système.', dar: 'Khtar action dyal user wla dyal système.', en: 'Pick a user or system action.' },
  states: {
    none: { fr: 'Pas encore lancée', dar: 'Mazal ma tlançat', en: 'Not started yet' },
    resumed: { fr: 'Au premier plan, interactive', dar: 'F l9eddam, t9der tkhdem biha', en: 'In the foreground, interactive' },
    paused: { fr: 'Visible mais a perdu le premier plan', dar: 'Kayna walakin ma bqatch f l9eddam', en: 'Visible but lost the foreground' },
    stopped: { fr: 'Plus visible (arrière-plan), instance conservée', dar: 'Ma bqatch bayna (arrière-plan), instance ba9ya', en: 'No longer visible (background), instance kept' },
    destroyed: { fr: 'Instance détruite', dar: 'Instance tmse7at', en: 'Instance destroyed' },
    killed: { fr: 'Processus tué par le système', dar: 'Système 9tel processus', en: 'Process killed by the system' }
  },
  actions: {
    launch: {
      label: { fr: 'Premier lancement', dar: 'Awel lancement', en: 'First launch' },
      lesson: {
        fr: 'Premier lancement : **onCreate()** initialise l\'Activity et son interface, **onStart()** la rend visible, **onResume()** la met au premier plan et la rend interactive.',
        dar: 'Awel lancement : **onCreate()** kaywjjed Activity w interface, **onStart()** katweli bayna, **onResume()** katweli f l9eddam w t9der tkhdem biha.',
        en: 'First launch: **onCreate()** initialises the Activity and its interface, **onStart()** makes it visible, **onResume()** brings it to the foreground and makes it interactive.'
      }
    },
    home: {
      label: { fr: 'Bouton Accueil', dar: 'Bouton Accueil (Home)', en: 'Home button' },
      lesson: {
        fr: 'Appui sur **Accueil** : **onPause()** (perd le premier plan) puis **onStop()** (n\'est plus visible). Pas de onDestroy() : l\'instance reste en mémoire.',
        dar: 'Brekti 3la **Accueil** : **onPause()** (ma bqatch f l9eddam) w men b3d **onStop()** (ma bqatch bayna). Ma kaynch onDestroy() : instance ba9ya f mémoire.',
        en: 'Pressing **Home**: **onPause()** (loses the foreground) then **onStop()** (no longer visible). No onDestroy(): the instance stays in memory.'
      }
    },
    back: {
      label: { fr: 'Revenir à l\'application', dar: 'Rje3 l l\'application', en: 'Return to the app' },
      lesson: {
        fr: 'Retour **sans destruction** : **onRestart()**, **onStart()**, **onResume()**. C\'est la **même instance** : **onCreate() ne se répète pas**.',
        dar: 'Rjou3 **bla destruction** : **onRestart()**, **onStart()**, **onResume()**. **Nefs l\'instance** : **onCreate() ma kat3awedch**.',
        en: 'Return **without destruction**: **onRestart()**, **onStart()**, **onResume()**. **Same instance**: **onCreate() is not repeated**.'
      },
      lessonKilled: {
        fr: 'Le processus avait été tué : Android **recrée une nouvelle instance** → **onCreate()**, onStart(), onResume(). Pas de onRestart() ici.',
        dar: 'Processus kan t9tel : Android kay**sayb instance jdida** → **onCreate()**, onStart(), onResume(). Ma kaynch onRestart() hna.',
        en: 'The process had been killed: Android **creates a new instance** → **onCreate()**, onStart(), onResume(). No onRestart() here.'
      }
    },
    overlay: {
      label: { fr: 'Fenêtre par-dessus (permission)', dar: 'Fenêtre fo9ha (permission)', en: 'Window on top (permission)' },
      lesson: {
        fr: 'Une fenêtre d\'une autre activité (ex. demande de permission) passe **devant sans la cacher entièrement** : seulement **onPause()**. L\'Activity reste visible, donc pas de onStop().',
        dar: 'Fenêtre dyal activité okhra (b7al demande de permission) katji **9eddamha bla ma tghettiha kamla** : ghir **onPause()**. Activity ba9a bayna, donc ma kaynch onStop().',
        en: 'A window from another activity (e.g. a permission request) comes **in front without fully hiding it**: only **onPause()**. The Activity is still visible, so no onStop().'
      }
    },
    overlayGone: {
      label: { fr: 'La fenêtre se ferme', dar: 'Fenêtre katsedd', en: 'The window closes' },
      lesson: {
        fr: 'La fenêtre disparaît : l\'Activity reprend le premier plan avec **onResume()** seulement.',
        dar: 'Fenêtre mchat : Activity katrje3 l l9eddam b **onResume()** bo7dha.',
        en: 'The window goes away: the Activity regains the foreground with **onResume()** only.'
      }
    },
    finish: {
      label: { fr: 'Fermer l\'écran (finish)', dar: 'Sedd l écran (finish)', en: 'Close the screen (finish)' },
      lesson: {
        fr: 'L\'Activity est terminée (appel à `finish()`, ou bouton Retour sur un écran secondaire) : **onPause()**, **onStop()**, **onDestroy()**. Un nouveau lancement recommencera par onCreate().',
        dar: 'Activity salat (`finish()`, wla bouton Retour f écran tani) : **onPause()**, **onStop()**, **onDestroy()**. Lancement jdid ghaybda b onCreate().',
        en: 'The Activity is finished (`finish()`, or Back on a secondary screen): **onPause()**, **onStop()**, **onDestroy()**. A new launch starts again with onCreate().'
      }
    },
    rotate: {
      label: { fr: 'Rotation de l\'écran', dar: 'Dawwer l écran', en: 'Rotate the screen' },
      lesson: {
        fr: 'Changement de configuration (rotation) : par défaut l\'instance est **détruite puis recréée** pour recharger le bon layout. On voit donc onPause, onStop, onDestroy **puis** onCreate, onStart, onResume, avec une **nouvelle instance**.',
        dar: 'Changement de configuration (rotation) : par défaut instance kat**tmse7 w kat3awed tetsayb** bach tchargi layout mzyan. Donc onPause, onStop, onDestroy **w men b3d** onCreate, onStart, onResume, b **instance jdida**.',
        en: 'Configuration change (rotation): by default the instance is **destroyed then recreated** to reload the right layout: onPause, onStop, onDestroy **then** onCreate, onStart, onResume, with a **new instance**.'
      }
    },
    kill: {
      label: { fr: 'Le système manque de mémoire', dar: 'Système na9so mémoire', en: 'The system runs low on memory' },
      lesson: {
        fr: 'Application en arrière-plan et mémoire insuffisante : le système peut **tuer le processus sans appeler onDestroy()**. C\'est pour ça que **onDestroy() n\'est pas garanti** : on ne sauvegarde jamais des données importantes dans onDestroy().',
        dar: 'App f arrière-plan w mémoire ma kafyach : système y9der **y9tel processus bla ma y3ayet l onDestroy()**. Hadchi 3lach **onDestroy() machi garanti** : 3mmrek ma t7fed data mohimma f onDestroy().',
        en: 'App in the background and memory is short: the system may **kill the process without calling onDestroy()**. That is why **onDestroy() is not guaranteed**: never save important data in onDestroy().'
      }
    }
  },
  disabled: { fr: 'Impossible dans l\'état actuel', dar: 'Ma ymkench f had l état', en: 'Not possible in the current state' }
};

export const UNITS = {
  title: { fr: 'dp, sp, px et dimensions : manipule-les', dar: 'dp, sp, px w dimensions : jerrebhom', en: 'dp, sp, px and dimensions: try them' },
  density: { fr: 'Densité de l\'écran', dar: 'Densité dyal l écran', en: 'Screen density' },
  font: { fr: 'Taille de police (réglages du téléphone)', dar: 'Taille dyal police (réglages dyal téléphone)', en: 'Font size (phone settings)' },
  normal: { fr: 'Normale', dar: 'Normale', en: 'Normal' },
  large: { fr: 'Grande', dar: 'Kbira', en: 'Large' },
  physical: { fr: 'Taille apparente', dar: 'Taille li katban', en: 'Apparent size' },
  pixels: { fr: 'pixels réels', dar: 'pixels 7a9i9iyin', en: 'actual pixels' },
  same: { fr: 'même taille apparente sur tous les écrans', dar: 'nefs taille f ga3 les écrans', en: 'same apparent size on every screen' },
  shrinks: { fr: 'devient plus petit quand la densité augmente', dar: 'katsghar mli densité katzid', en: 'gets smaller as density increases' },
  follows: { fr: 'suit aussi la taille de police choisie', dar: 'katba3 7tta taille dyal police', en: 'also follows the chosen font size' },
  formula: {
    fr: 'Conversion : px = dp × (dpi ÷ 160). Pour sp, on multiplie en plus par l\'échelle de police choisie par l\'utilisateur (approximation : depuis Android 14, les grandes tailles grossissent un peu moins vite).',
    dar: 'Conversion : px = dp × (dpi ÷ 160). L sp, kandarbou zeyda f l\'échelle dyal police li khtar user (approximation : mn Android 14, les tailles kbar katkbar chwiya b chwiya).',
    en: 'Conversion: px = dp × (dpi ÷ 160). For sp, also multiply by the user\'s font scale (approximation: since Android 14 large sizes grow a bit less).'
  },
  layoutTitle: { fr: 'wrap_content et match_parent dans un LinearLayout vertical', dar: 'wrap_content w match_parent f LinearLayout vertical', en: 'wrap_content and match_parent in a vertical LinearLayout' },
  width: { fr: 'Largeur', dar: 'L3ard', en: 'Width' },
  height: { fr: 'Hauteur', dar: 'Tol', en: 'Height' },
  button: { fr: 'Valider', dar: 'Valider', en: 'Validate' },
  explain: {
    wrap: {
      fr: '**wrap_content** : la vue adapte sa taille **à son contenu** (texte + marges internes `padding`).',
      dar: '**wrap_content** : view kat3ti rasha taille **3la 7sab contenu dyalha** (texte + padding).',
      en: '**wrap_content**: the view sizes itself **to its content** (text + inner `padding`).'
    },
    match: {
      fr: '**match_parent** : la vue prend **toute la dimension disponible** que son parent lui attribue.',
      dar: '**match_parent** : view katakhod **ga3 l blasa** li 3taha parent dyalha.',
      en: '**match_parent**: the view takes **all the space** its parent gives it.'
    }
  }
};
