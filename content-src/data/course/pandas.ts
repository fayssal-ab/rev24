import { L, h, p, def, plain, steps, tip, trap, exam, table, code, anim, quiz, demo, copy, key } from '../../lib';
import type { Chapter } from '../../../src/lib/schema';

const URL = 'http://egallic.fr/Enseignement/Python/Exercices/donnees';

/** Chap 1 — Manipulation de différents formats de données (Pr. A. Kadiri, 11 octobre 2026) + Feuille d'exercices N°1. */
export const chapter: Chapter = {
  id: 'pandas',
  module: 'data',
  order: 3,
  title: L(['Chap 1 — Manipulation de différents formats de données (pandas)', 'Fasl 1 — Khdma b formats dyal data (pandas)', 'Ch. 1 — Working with different data formats (pandas)']),
  summary: L([
    'Lire, vérifier, modifier et sauvegarder des données avec pandas : un exemple exécuté pour chaque paramètre (sep, decimal, header, skiprows, sheet_name…), Series et DataFrame, et la Feuille d\'exercices N°1 corrigée.',
    '3lach pandas, installation, les fonctions read_… (CSV, Excel, JSON, SQL…), Series w DataFrame, paramètres dyal read_excel, w correction kamla dyal Feuille N°1.',
    'Why pandas, installation, the read_… functions (CSV, Excel, JSON, SQL…), writing with Series and DataFrame, read_excel parameters, then the full solution of Exercise sheet No. 1.'
  ]),
  estimatedMinutes: 50,
  sections: [
    key([
      '1. `import pandas as pd`, puis **`pd.read_<format>(chemin)`** renvoie un DataFrame ; **`df.to_<format>(chemin)`** l\'écrit.\n2. Après chaque lecture : **`df.shape`, `df.dtypes`, `df.head()`**.\n3. Les paramètres qui tombent : **`sep`, `decimal`, `header=None`, `names`, `skiprows`, `sheet_name`, `index=False`**.\n4. **Series** = 1 dimension ; **DataFrame** = 2 dimensions (collection de Series).',
      '1. `import pandas as pd`, w **`pd.read_<format>(chemin)`** kayrje3 DataFrame ; **`df.to_<format>(chemin)`** kaykteb.\n2. Mor kol 9raya : **`df.shape`, `df.dtypes`, `df.head()`**.\n3. Paramètres li kayti7ou : **`sep`, `decimal`, `header=None`, `names`, `skiprows`, `sheet_name`, `index=False`**.\n4. **Series** = bo3d wa7ed ; **DataFrame** = jouj ab3ad (majmou3a dyal Series).',
      '1. `import pandas as pd`, then **`pd.read_<format>(path)`** returns a DataFrame; **`df.to_<format>(path)`** writes it.\n2. After every read: **`df.shape`, `df.dtypes`, `df.head()`**.\n3. Parameters that come up: **`sep`, `decimal`, `header=None`, `names`, `skiprows`, `sheet_name`, `index=False`**.\n4. **Series** = 1 dimension; **DataFrame** = 2 dimensions (collection of Series).'
    ]),
    h(['1. Pourquoi utiliser pandas ?', '1. 3lach pandas ?', '1. Why use pandas?']),
    def([
      '**pandas** est une bibliothèque Python pour **manipuler les données facilement**. Elle permet de **lire, modifier et sauvegarder des tableaux de données** (comme dans Excel). Elle est utilisée pour l\'analyse de données, les statistiques, le machine learning, etc.',
      '**pandas** hiya bibliothèque f Python bach **tkhdem b data b sahoula**. Katkhllik **t9ra, tbeddel w tsauvegardi tableaux dyal data** (b7al Excel). Katsta3mel f analyse de données, statistiques, machine learning…',
      '**pandas** is a Python library to **handle data easily**. It lets you **read, modify and save data tables** (like in Excel). It is used for data analysis, statistics, machine learning, etc.'
    ]),
    plain([
      'Pense à pandas comme à **Excel, mais piloté par du code** : au lieu de cliquer, tu écris une ligne, et elle marche pareil sur 10 lignes ou sur 10 millions.',
      'Fkker f pandas b7al **Excel walakin b l code** : f blast ma tclicki, katkteb str wa7ed, w kaykhdem b7al b7al 3la 10 stour wla 10 malayin.',
      'Think of pandas as **Excel driven by code**: instead of clicking, you write one line, and it works the same on 10 rows or 10 million.'
    ]),

    h(['2. Installation', '2. Installation', '2. Installation']),
    p(['Dans le **Terminal** :', 'F **Terminal** :', 'In the **Terminal**:']),
    code('pip install pandas openpyxl\n\n# puis dans le script / notebook :\nimport pandas as pd', 'bash', ['`openpyxl` est le moteur qui permet à pandas de lire et écrire les fichiers .xlsx.', '`openpyxl` howa l moteur li kaykhlli pandas y9ra w ykteb .xlsx.', '`openpyxl` is the engine pandas uses to read and write .xlsx files.']),
    quiz('dp-02'),

    h(['3. Lire des données : la famille read_…', '3. 9raya dyal data : 3a2ilat read_…', '3. Reading data: the read_… family']),
    p([
      'Le principe est toujours le même : **`pd.read_<format>(chemin)`** renvoie un **DataFrame**. Seul le mot après `read_` change selon le format. Voici les deux tableaux du cours :',
      'L9a3ida dima hiya hiya : **`pd.read_<format>(chemin)`** kayrje3 **DataFrame**. Ghir l kelma li mor `read_` li katbeddel 3la 7sab l format. Hado jouj tableaux dyal dars :',
      'The rule is always the same: **`pd.read_<format>(path)`** returns a **DataFrame**. Only the word after `read_` changes with the format. Here are the two tables from the course:'
    ]),
    table([['Fonction', 'Fonction', 'Function'], ['Description', 'Chnou katdir', 'Description']], [
      ['read_csv', ['Données délimitées (fichier, URL, objet fichier) ; **virgule** par défaut', 'Data mfrr9a b séparateur ; **virgule** par défaut', 'Delimited data (file, URL, file object); **comma** by default']],
      ['read_fwf', ['Colonnes à **largeur fixe** (sans délimiteur)', 'Colonnes b **3ard tabit** (bla séparateur)', '**Fixed-width** columns (no delimiter)']],
      ['read_clipboard', ['Comme read_csv mais depuis le **presse-papiers** (tableaux copiés d\'une page web)', 'B7al read_csv walakin mn **presse-papiers**', 'Like read_csv but from the **clipboard**']],
      ['read_excel', ['Fichier **Excel XLS / XLSX**', 'Fichier **Excel**', '**Excel XLS / XLSX** file']],
      ['read_hdf', ['Fichiers **HDF5** écrits par pandas', 'Fichiers **HDF5**', '**HDF5** files written by pandas']],
      ['read_html', ['**Tous les tableaux** d\'une page HTML', '**Ga3 les tableaux** dyal page HTML', '**All tables** of an HTML page']],
      ['read_json', ['Chaîne, fichier ou URL au format **JSON**', '**JSON**', '**JSON** string, file or URL']]
    ]),
    table([['Fonction (suite)', 'Fonction (tatimma)', 'Function (cont.)'], ['Description', 'Chnou katdir', 'Description']], [
      ['read_feather', ['Fichier binaire **Feather**', 'Binaire **Feather**', 'Binary **Feather** file']],
      ['read_orc', ['Fichier binaire **Apache ORC**', 'Binaire **ORC**', 'Binary **Apache ORC** file']],
      ['read_parquet', ['Fichier binaire **Apache Parquet**', 'Binaire **Parquet**', 'Binary **Apache Parquet** file']],
      ['read_pickle', ['Objet stocké par pandas au format **pickle** de Python', '**pickle** dyal Python', 'Object stored in Python **pickle** format']],
      ['read_sas', ['Jeu de données **SAS**', 'Data **SAS**', '**SAS** dataset']],
      ['read_spss', ['Fichier de données **SPSS**', 'Fichier **SPSS**', '**SPSS** data file']],
      ['read_sql', ['Résultat d\'une **requête SQL** (via SQLAlchemy)', 'Natija dyal **requête SQL**', 'Result of a **SQL query** (via SQLAlchemy)']],
      ['read_sql_table', ['**Table SQL complète** (= SELECT * via read_sql)', '**Table SQL kamla**', '**Whole SQL table**']],
      ['read_stata', ['Jeu de données **Stata**', 'Data **Stata**', '**Stata** dataset']],
      ['read_xml', ['Tableau de données depuis un fichier **XML**', 'Mn **XML**', 'Table from an **XML** file']]
    ]),
    exam(['Question classique : « Quelle fonction pour un fichier sans délimiteur ? » → **read_fwf**. « Pour tous les tableaux d\'une page web ? » → **read_html**. « Pour le presse-papiers ? » → **read_clipboard**.', 'Sou2al classique : « fichier bla délimiteur ? » → **read_fwf**. « Tableaux dyal page web ? » → **read_html**. « Presse-papiers ? » → **read_clipboard**.', 'Classic question: "Function for a file without delimiter?" → **read_fwf**. "All tables of a web page?" → **read_html**. "Clipboard?" → **read_clipboard**.']),
    quiz('dp-09'),

    h(['4. Lire un fichier et vérifier ce qu\'on a lu', '4. 9ra fichier w t2akked mn chnou 9riti', '4. Read a file and check what you read']),
    demo(['Lire un CSV standard', '9ra CSV 3adi', 'Read a standard CSV'], `import pandas as pd

df = pd.read_csv("notes.csv")
print(df)`, `       nom  note1  note2
0    Amine     12     14
1     Sara     15     17
2  Yassine      9     11
3     Hiba     16     13`, { file: ['notes.csv', 'nom,note1,note2\nAmine,12,14\nSara,15,17\nYassine,9,11\nHiba,16,13'], note: ['La 1re ligne devient l\'en-tête ; pandas ajoute un **index** 0, 1, 2, 3 à gauche.', 'Str lowl kaywli en-tête ; pandas kayzid **index** 0, 1, 2, 3 3la lissar.', 'The first row becomes the header; pandas adds an **index** 0, 1, 2, 3 on the left.'] }),
    demo(['Inspecter : shape, columns, dtypes, head', 'Chouf : shape, columns, dtypes, head', 'Inspect: shape, columns, dtypes, head'], `print(df.shape)          # (lignes, colonnes)
print(list(df.columns))  # noms des colonnes
print(df.dtypes)         # type de chaque colonne
print(df.head(2))        # 2 premières lignes`, `(4, 3)
['nom', 'note1', 'note2']
nom      object
note1     int64
note2     int64
dtype: object
     nom  note1  note2
0  Amine     12     14
1   Sara     15     17`, { note: ['Réflexe à avoir après **chaque** lecture : si une colonne de notes est `object` (texte), la lecture est ratée. Avec pandas 3, `object` s\'affiche `str`.', 'Dir hadchi mor **kol** 9raya : ila colonne dyal notes tla3t `object` (texte), l 9raya ghalta. F pandas 3, `object` kayban `str`.', 'Do this after **every** read: if a marks column is `object` (text), the read went wrong. In pandas 3, `object` shows as `str`.'] }),
    quiz('dp-02'),

    h(['5. Les paramètres de lecture, un exemple chacun', '5. Paramètres dyal 9raya, mithal l kol wa7ed', '5. Reading parameters, one example each']),
    p([
      'Tableau du cours, puis chaque paramètre utile au contrôle avec **le fichier, le code et le résultat réel**. `read_csv` et `read_excel` partagent la plupart de ces paramètres ; `sep` et `decimal` sont propres aux fichiers texte.',
      'Tableau dyal dars, w kol paramètre mohim l contrôle b **fichier, code w natija 7a9i9iya**. `read_csv` w `read_excel` kaytcharkou ktar had paramètres ; `sep` w `decimal` ghir dyal fichiers texte.',
      'The course table, then each parameter useful for the test with **the file, the code and the real output**. `read_csv` and `read_excel` share most of them; `sep` and `decimal` are for text files only.'
    ]),
    table([['Paramètre', 'Paramètre', 'Parameter'], ['Rôle', 'Chnou kaydir', 'Role'], ['Exemple', 'Mithal', 'Example']], [
      ['io', ['Chemin du fichier, URL ou objet fichier', 'Chemin, URL wla fichier', 'File path, URL or file object'], '"data.xlsx"'],
      ['sheet_name', ['Feuille à lire : 0 (défaut, la 1re), un nom, ou None pour toutes', 'Ina feuille : 0 (lowla), smiya, wla None l kolhom', 'Sheet: 0 (default, first), a name, or None for all'], 'sheet_name="notes_h_s"'],
      ['header', ['Ligne utilisée comme en-tête (défaut 0)', 'Str dyal titres (défaut 0)', 'Row used as header (default 0)'], 'header=None'],
      ['names', ['Noms de colonnes à utiliser', 'Smiyat dyal colonnes', 'Column names to use'], 'names=["nom", "note"]'],
      ['index_col', ['Colonne(s) utilisée(s) comme index', 'Colonne li tkoun index', 'Column(s) used as index'], 'index_col=0'],
      ['usecols', ['Colonnes à lire', 'Colonnes li t9ra', 'Columns to read'], 'usecols="A:C"'],
      ['skiprows', ['Lignes à ignorer au début', 'Stour li tfout f lbdya', 'Rows to skip at the start'], 'skiprows=1'],
      ['nrows', ['Nombre de lignes à lire', '3adad stour li t9ra', 'Number of rows to read'], 'nrows=100'],
      ['dtype', ['Type imposé à certaines colonnes', 'Type mfrod 3la colonnes', 'Type forced on columns'], "dtype={'col1': str}"],
      ['engine', ['Moteur de lecture', 'Moteur', 'Reading engine'], "engine='openpyxl'"],
      ['na_values', ['Chaînes à considérer comme valeurs manquantes (NaN)', 'Kelmat li tkoun NaN', 'Strings treated as missing (NaN)'], 'na_values=["NA", "-"]'],
      ['converters', ['Fonctions pour convertir certaines colonnes', 'Fonctions bach tbeddel colonnes', 'Functions to convert columns'], 'converters={"note": float}']
    ]),
    demo(['sep et decimal : un CSV « à la française »', 'sep w decimal : CSV « b la française »', 'sep and decimal: a "French-style" CSV'], `df = pd.read_csv("notes_decim.csv")   # sans paramètres
print(df.shape)`, `(3, 1)`, { file: ['notes_decim.csv', 'nom;note1;note2\nAmine;12,5;14\nSara;15,25;17\nYassine;9,75;11'], note: ['Sans `sep=";"`, pandas cherche des virgules : **une seule colonne** est lue. C\'est le symptôme à reconnaître.', 'Bla `sep=";"`, pandas kay9elleb 3la virgules : **colonne wa7da** bark. Hada howa symptôme.', 'Without `sep=";"`, pandas looks for commas: **a single column** is read. Learn to spot this symptom.'] }),
    demo(['La bonne lecture', 'L 9raya s7i7a', 'The right read'], `df = pd.read_csv("notes_decim.csv", sep=";", decimal=",")
print(df)
print(df.dtypes)`, `       nom  note1  note2
0    Amine  12.50     14
1     Sara  15.25     17
2  Yassine   9.75     11
nom       object
note1    float64
note2      int64
dtype: object`, { note: ['Avec `sep=";"` seul, `note1` reste du texte (« 12,5 ») : il faut **aussi** `decimal=","` pour obtenir des `float64`.', 'B `sep=";"` bou7do, `note1` kayb9a texte (« 12,5 ») : khass **7ta** `decimal=","` bach ykoun `float64`.', 'With `sep=";"` alone, `note1` stays text ("12,5"): you **also** need `decimal=","` to get `float64`.'] }),
    demo(['header=None : le fichier n\'a pas d\'en-tête', 'header=None : fichier bla en-tête', 'header=None: the file has no header'], `print(pd.read_csv("notes_h.csv"))               # faux
print(pd.read_csv("notes_h.csv", header=None))  # juste`, `     Amine  12  14
0     Sara  15  17
1  Yassine   9  11
         0   1   2
0    Amine  12  14
1     Sara  15  17
2  Yassine   9  11`, { file: ['notes_h.csv', 'Amine,12,14\nSara,15,17\nYassine,9,11'], note: ['Sans `header=None`, la ligne d\'Amine devient l\'en-tête et **on perd une observation** (2 lignes au lieu de 3).', 'Bla `header=None`, str dyal Amine kaywli en-tête w **kanmchiw observation** (2 stour f blast 3).', 'Without `header=None`, Amine\'s row becomes the header and **one observation is lost** (2 rows instead of 3).'] }),
    demo(['names : donner des noms aux colonnes', 'names : 3ti smiyat l colonnes', 'names: name the columns'], `df = pd.read_csv("notes_h.csv", header=None, names=["nom", "note1", "note2"])
print(df)`, `       nom  note1  note2
0    Amine     12     14
1     Sara     15     17
2  Yassine      9     11`),
    demo(['skiprows : sauter une ligne parasite', 'skiprows : fout str zayd', 'skiprows: skip an extra line'], `df = pd.read_csv("notes_h_s.csv", skiprows=1, header=None)
print(df)`, `         0   1   2
0    Amine  12  14
1     Sara  15  17
2  Yassine   9  11`, { file: ['notes_h_s.csv', '# fichier exporté le 10/10\nAmine,12,14\nSara,15,17\nYassine,9,11'], note: ['`skiprows=1` saute le commentaire, `header=None` dit qu\'il n\'y a pas d\'en-tête après. Les deux sont nécessaires.', '`skiprows=1` kayfout commentaire, `header=None` kay9ol ma kaynch en-tête moraha. Bjouj lazmin.', '`skiprows=1` skips the comment, `header=None` says there is no header after it. Both are needed.'] }),
    demo(['index_col : une colonne comme index', 'index_col : colonne tkoun index', 'index_col: a column as index'], `df = pd.read_csv("notes.csv", index_col=0)
print(df)
print(df.loc["Sara", "note1"])`, `         note1  note2
nom
Amine       12     14
Sara        15     17
Yassine      9     11
Hiba        16     13
15`, { note: ['Les noms remplacent 0, 1, 2… : on accède ensuite à une ligne par son nom avec `.loc`.', 'Smiyat kayweliw f blast 0, 1, 2… : kanwslou l str b smito b `.loc`.', 'Names replace 0, 1, 2…: rows are then reached by name with `.loc`.'] }),
    demo(['usecols : ne lire que certaines colonnes', 'usecols : 9ra ghir chi colonnes', 'usecols: read only some columns'], `df = pd.read_csv("notes.csv", usecols=["nom", "note1"])
print(df)`, `       nom  note1
0    Amine     12
1     Sara     15
2  Yassine      9
3     Hiba     16`, { note: ['Pour Excel on peut aussi donner des lettres : `usecols="A:B"`.', 'F Excel t9der t3ti 7rouf : `usecols="A:B"`.', 'For Excel you can also give letters: `usecols="A:B"`.'] }),
    demo(['nrows : ne lire que le début', 'nrows : 9ra ghir lbdya', 'nrows: read only the start'], `df = pd.read_csv("notes.csv", nrows=2)
print(df)`, `     nom  note1  note2
0  Amine     12     14
1   Sara     15     17`),
    demo(['na_values : marquer les valeurs manquantes', 'na_values : 7edded valeurs manquantes', 'na_values: mark missing values'], `df = pd.read_csv("notes_na.csv", na_values=["-"])
print(df)
print(df.isna().sum())`, `       nom  note1  note2
0    Amine   12.0    NaN
1     Sara    NaN   17.0
2  Yassine    9.0   11.0
nom      0
note1    1
note2    1
dtype: int64`, { file: ['notes_na.csv', 'nom,note1,note2\nAmine,12,-\nSara,NA,17\nYassine,9,11'], note: ['« NA » est reconnu par défaut, mais pas « - » : sans `na_values=["-"]`, la colonne `note2` resterait du texte (`object`).', '« NA » kay3rfo par défaut, « - » la : bla `na_values=["-"]`, `note2` kat b9a texte (`object`).', '"NA" is recognised by default, "-" is not: without `na_values=["-"]`, `note2` would stay text (`object`).'] }),
    demo(['dtype : garder les zéros d\'un code', 'dtype : 7afed 3la zéros dyal code', 'dtype: keep a code\'s leading zeros'], `print(pd.read_csv("villes.csv"))
print(pd.read_csv("villes.csv", dtype={"code": str}))`, `   code  ville
0     7  Rabat
1    42   Salé
  code  ville
0  007  Rabat
1  042   Salé`, { file: ['villes.csv', 'code,ville\n007,Rabat\n042,Salé'], note: ['Un code (postal, produit, CIN) n\'est pas un nombre : `dtype={"code": str}` évite que 007 devienne 7.', 'Code (postal, produit…) machi raqm : `dtype={"code": str}` bach 007 ma yweliich 7.', 'A code (postal, product…) is not a number: `dtype={"code": str}` stops 007 from becoming 7.'] }),
    demo(['converters : transformer une colonne à la lecture', 'converters : beddel colonne f 9raya', 'converters: transform a column while reading'], `df = pd.read_csv("notes.csv", converters={"nom": str.upper})
print(df)`, `       nom  note1  note2
0    AMINE     12     14
1     SARA     15     17
2  YASSINE      9     11
3     HIBA     16     13`),
    demo(['read_excel : choisir la feuille', 'read_excel : khtar feuille', 'read_excel: choose the sheet'], `pd.read_excel("notes.xlsx")                       # 1re feuille (sheet_name=0)
pd.read_excel("notes.xlsx", sheet_name="notes_h_s", skiprows=1, header=None)
pd.read_excel("notes.xlsx", sheet_name=1)          # même chose par numéro

toutes = pd.read_excel("notes.xlsx", sheet_name=None)
print(type(toutes).__name__, list(toutes.keys()))`, `dict ['notes', 'notes_h_s']`, { note: ['`sheet_name=None` renvoie un **dictionnaire** {nom de feuille : DataFrame}, pas un DataFrame. La lecture d\'un .xlsx demande `openpyxl`.', '`sheet_name=None` kayrje3 **dictionnaire** {smiyat feuille : DataFrame}, machi DataFrame. .xlsx kaykhsso `openpyxl`.', '`sheet_name=None` returns a **dictionary** {sheet name: DataFrame}, not a DataFrame. Reading .xlsx needs `openpyxl`.'] }),
    anim('PandasReadPlayground'),
    trap(['`header=None` veut dire **« il n\'y a pas de ligne d\'en-tête »**, pas « supprime l\'en-tête ». `skiprows=1` **saute** la 1re ligne. Les deux ne sont pas interchangeables.', '`header=None` ma3nah **« ma kaynch str dyal titres »**, machi « 7iyed titres ». `skiprows=1` **kayfout** str lowl. Machi b7al b7al.', '`header=None` means **"there is no header row"**, not "drop the header". `skiprows=1` **skips** the first row. They are not interchangeable.']),
    quiz('dp-03', 'dp-04', 'dp-05', 'dp-12'),

    h(['6. Modifier et sauvegarder', '6. Beddel w sauvegardi', '6. Modify and save']),
    demo(['Ajouter une colonne puis exporter en CSV', 'Zid colonne w exporti CSV', 'Add a column then export to CSV'], `df = pd.read_csv("notes.csv")
df["moyenne"] = (df["note1"] + df["note2"]) / 2
df.to_csv("notes_moy.csv", index=False)`, `nom,note1,note2,moyenne
Amine,12,14,13.0
Sara,15,17,16.0
Yassine,9,11,10.0
Hiba,16,13,14.5`, { note: ['Contenu du fichier écrit. **Sans** `index=False`, chaque ligne commencerait par son numéro (`0,Amine,…`) et une colonne vide apparaîtrait en tête.', 'Hada contenu dyal fichier. **Bla** `index=False`, kol str kaybda b numéro (`0,Amine,…`) w colonne khawya f lowl.', 'Content of the written file. **Without** `index=False`, each row would start with its number (`0,Amine,…`) and an empty column would appear first.'] }),
    demo(['Exporter au format français (« ; » et « , »)', 'Exporti b format français', 'Export in French format (";" and ",")'], `df = pd.read_csv("notes_decim.csv", sep=";", decimal=",")
df.to_csv("export_fr.csv", sep=";", decimal=",", index=False)`, `nom;note1;note2
Amine;12,5;14
Sara;15,25;17
Yassine;9,75;11`, { note: ['`to_csv` accepte les mêmes `sep` et `decimal` que `read_csv`.', '`to_csv` kayqbel nefs `sep` w `decimal` dyal `read_csv`.', '`to_csv` takes the same `sep` and `decimal` as `read_csv`.'] }),
    demo(['Excel et JSON : même logique, autre mot', 'Excel w JSON : nefs lmantiq, kelma khra', 'Excel and JSON: same logic, other word'], `df.to_excel("notes_modifiees.xlsx", index=False)

petit = df.head(2)
print(petit.to_json())
print(petit.to_json(orient="records"))`, `{"nom":{"0":"Amine","1":"Sara"},"note1":{"0":12,"1":15},"note2":{"0":14,"1":17}}
[{"nom":"Amine","note1":12,"note2":14},{"nom":"Sara","note1":15,"note2":17}]`, { note: ['`orient="records"` donne une liste d\'objets, un par ligne : le format des API web. Relire : `pd.read_json("fichier.json")`.', '`orient="records"` kay3ti liste dyal objets, wa7ed l kol str : format dyal API. T9rah : `pd.read_json("fichier.json")`.', '`orient="records"` gives a list of objects, one per row: the web API format. Read back: `pd.read_json("file.json")`.'] }),

    h(['7. Écrire des données : Series et DataFrame', '7. Kteb data : Series w DataFrame', '7. Writing data: Series and DataFrame']),
    demo(['Series à partir d\'une liste, avec un index', 'Series mn liste, b index', 'Series from a list, with an index'], `s = pd.Series([12, 15, 9], index=["Amine", "Sara", "Yassine"], name="note")
print(s)
print(s["Sara"])
print(s.mean())`, `Amine      12
Sara       15
Yassine     9
Name: note, dtype: int64
15
12.0`),
    demo(['Series à partir d\'un dictionnaire', 'Series mn dictionnaire', 'Series from a dictionary'], `s = pd.Series({"Rabat": 1.9, "Salé": 1.0, "Témara": 0.6})
print(s)`, `Rabat     1.9
Salé      1.0
Témara    0.6
dtype: float64`, { note: ['Les **clés** deviennent l\'index. Sans index fourni (liste simple), pandas met 0, 1, 2…', '**Clés** kayweliw index. Bla index (liste 3adiya), pandas kaydir 0, 1, 2…', 'The **keys** become the index. With no index (plain list), pandas uses 0, 1, 2…'] }),
    demo(['DataFrame à partir d\'un dictionnaire de colonnes', 'DataFrame mn dictionnaire dyal colonnes', 'DataFrame from a dictionary of columns'], `df = pd.DataFrame({
    "nom":   ["Amine", "Sara", "Yassine"],
    "note":  [12, 15, 9],
    "ville": ["Rabat", "Salé", "Témara"],
})
print(df)
print(df.shape)
print(type(df["note"]).__name__)          # une colonne
print(type(df[["nom", "note"]]).__name__)  # plusieurs colonnes`, `       nom  note   ville
0    Amine    12   Rabat
1     Sara    15    Salé
2  Yassine     9  Témara
(3, 3)
Series
DataFrame`, { note: ['`df["note"]` (un nom) renvoie une **Series** ; `df[["nom", "note"]]` (une liste) renvoie un **DataFrame**.', '`df["note"]` (smiya wa7da) → **Series** ; `df[["nom", "note"]]` (liste) → **DataFrame**.', '`df["note"]` (one name) returns a **Series**; `df[["nom", "note"]]` (a list) returns a **DataFrame**.'] }),
    demo(['DataFrame à partir de lignes', 'DataFrame mn stour', 'DataFrame from rows'], `df = pd.DataFrame([["Amine", 12], ["Sara", 15]], columns=["nom", "note"])
print(df)`, `     nom  note
0  Amine    12
1   Sara    15`),
    demo(['Filtrer, trier, résumer', 'Filtri, rettib, lkhoulasa', 'Filter, sort, summarise'], `df = pd.DataFrame({"nom": ["Amine", "Sara", "Yassine"], "note": [12, 15, 9]})
print(df[df["note"] >= 12])
print(df.sort_values("note", ascending=False))
print(df["note"].describe())`, `     nom  note
0  Amine    12
1   Sara    15
       nom  note
1     Sara    15
0    Amine    12
2  Yassine     9
count     3.0
mean     12.0
std       3.0
min       9.0
25%      10.5
50%      12.0
75%      13.5
max      15.0
Name: note, dtype: float64`, { note: ['`describe()` utilise l\'écart-type **corrigé** (n − 1) : ici std = 3,0.', '`describe()` kayst3mel écart-type **corrigé** (n − 1) : hna std = 3,0.', '`describe()` uses the **corrected** SD (n − 1): here std = 3.0.'] }),
    table([['Critère', 'Mi3yar', 'Criterion'], ['Series', 'Series', 'Series'], ['DataFrame', 'DataFrame', 'DataFrame']], [
      [['Dimensions', 'Dimensions', 'Dimensions'], ['**1 dimension** (une colonne)', '**1 bo3d** (colonne wa7da)', '**1 dimension** (one column)'], ['**2 dimensions** (lignes × colonnes)', '**2 ab3ad** (stour × colonnes)', '**2 dimensions** (rows × columns)']],
      [['Contenu', 'Chnou fiha', 'Content'], ['Valeurs + un index', 'Qiyam + index', 'Values + an index'], ['Plusieurs colonnes, chacune est une Series', 'Bzaf d colonnes, kol wa7da Series', 'Several columns, each one is a Series']],
      [['Types', 'Types', 'Types'], ['Un seul type', 'Type wa7ed', 'One type'], ['Un type par colonne', 'Type l kol colonne', 'One type per column']],
      [['Obtenir', 'Kifach tjibha', 'Get it'], ['`df["note"]`', '`df["note"]`', '`df["note"]`'], ['`df[["nom", "note"]]` ou `pd.read_csv(…)`', '`df[["nom", "note"]]` wla `pd.read_csv(…)`', '`df[["nom", "note"]]` or `pd.read_csv(…)`']]
    ]),
    copy(['Question du cours : différence entre Series et DataFrame', 'Sou2al dyal dars : far9 bin Series w DataFrame', 'Course question: Series vs DataFrame'], null, [
      { l: ['Series', 'Series', 'Series'], b: ['Structure à **une dimension** : une suite de valeurs d\'un même type, associée à un **index** (étiquettes des lignes).', 'Structure b **bo3d wa7ed** : qiyam b nefs type, m3a **index**.', '**One-dimensional** structure: values of one type with an **index** (row labels).'] },
      { l: ['DataFrame', 'DataFrame', 'DataFrame'], b: ['Structure à **deux dimensions** (lignes × colonnes), chaque colonne peut avoir son propre type.', 'Structure b **jouj ab3ad** (stour × colonnes), kol colonne b type dyalha.', '**Two-dimensional** structure (rows × columns), each column may have its own type.'] },
      { l: ['Lien', 'L3ala9a', 'Link'], b: ['Un DataFrame est une **collection de Series** qui partagent le même index : `df["note"]` est une Series.', 'DataFrame = **majmou3a dyal Series** b nefs index : `df["note"]` hiya Series.', 'A DataFrame is a **collection of Series** sharing the same index: `df["note"]` is a Series.'] },
      { l: ['Exemple', 'Mithal', 'Example'], b: ['`pd.Series([12, 15, 9])` vs `pd.DataFrame({"nom": […], "note": […]})`.', '`pd.Series([12, 15, 9])` vs `pd.DataFrame({"nom": […], "note": […]})`.', '`pd.Series([12, 15, 9])` vs `pd.DataFrame({"nom": […], "note": […]})`.'] }
    ]),

    h(['8. Feuille d\'exercices N°1 — correction complète', '8. Feuille N°1 — correction kamla', '8. Exercise sheet No. 1 — full solution']),
    p([
      '**Exercice 1 — Importer et exporter des données avec pandas.** Objectif : manipuler différents formats (CSV, Excel) et les options d\'importation / exportation. Les fichiers sont sur `' + URL + '/`.',
      '**Exercice 1 — Importer w exporter data b pandas.** Lhadaf : tkhdem b formats mokhtalifa (CSV, Excel) w options dyal import / export. Les fichiers f `' + URL + '/`.',
      '**Exercise 1 — Import and export data with pandas.** Goal: handle different formats (CSV, Excel) and import / export options. Files are at `' + URL + '/`.'
    ]),
    steps(['Les 8 questions, une par une', '8 questions, wa7da b wa7da', 'The 8 questions, one by one'], [
      { t: ['Q1 — CSV téléchargé à la main', 'Q1 — CSV mtélécharger', 'Q1 — CSV downloaded by hand'], b: ['On télécharge `notes.csv`, on le place dans le **répertoire courant** (le dossier du notebook) et on donne juste son nom.', 'Kantéléchargiw `notes.csv`, kan7ttouh f **répertoire courant** w kan3tiw ghir smito.', 'Download `notes.csv`, put it in the **current directory** (the notebook\'s folder) and pass just its name.'], code: 'import pandas as pd\nnotes = pd.read_csv("notes.csv")' },
      { t: ['Q2 — Même fichier, via l\'URL', 'Q2 — B l URL', 'Q2 — Same file, via the URL'], b: ['read_csv accepte directement une **URL** à la place d\'un chemin.', 'read_csv kayqbel **URL** direct.', 'read_csv accepts a **URL** instead of a path.'], code: `notes = pd.read_csv("${URL}/notes.csv")` },
      { t: ['Q3 — Séparateur « ; » et décimale « , »', 'Q3 — « ; » w virgule', 'Q3 — ";" separator and "," decimal'], b: ['Format « français » : on précise **`sep=";"`** et **`decimal=","`**, sinon tout arrive dans une seule colonne et les notes restent du texte.', 'Format « français » : **`sep=";"`** w **`decimal=","`**, sinon kolchi kayji f colonne wa7da w notes kayb9aw texte.', '"French" format: set **`sep=";"`** and **`decimal=","`**, otherwise everything lands in one column and marks stay as text.'], code: `notes_decim = pd.read_csv("${URL}/notes_decim.csv", sep=";", decimal=",")` },
      { t: ['Q4 — Pas de noms de colonnes', 'Q4 — Bla smiyat colonnes', 'Q4 — No column names'], b: ['**`header=None`** : la 1re ligne est une donnée, pas un en-tête. pandas nomme les colonnes 0, 1, 2… (on peut ajouter `names=[…]`).', '**`header=None`** : str lowl data machi titres. pandas kaysmmi 0, 1, 2… (t9der tzid `names=[…]`).', '**`header=None`**: the first row is data, not a header. pandas names columns 0, 1, 2… (you may add `names=[…]`).'], code: `notes_h = pd.read_csv("${URL}/notes_h.csv", header=None)` },
      { t: ['Q5 — La 1re ligne n\'est pas à importer', 'Q5 — Str lowl ma ndkhlouhch', 'Q5 — Skip the first row'], b: ['**`skiprows=1`** saute la ligne parasite ; le fichier n\'a pas non plus d\'en-tête → `header=None`.', '**`skiprows=1`** kayfout str ; w ma kaynch titres → `header=None`.', '**`skiprows=1`** skips the extra line; the file also has no header → `header=None`.'], code: `notes_h_s = pd.read_csv("${URL}/notes_h_s.csv", skiprows=1, header=None)` },
      { t: ['Q6 — 1re feuille d\'un Excel', 'Q6 — Feuille lowla f Excel', 'Q6 — First sheet of an Excel file'], b: ['Par défaut `sheet_name=0`, donc c\'est la 1re feuille.', 'Par défaut `sheet_name=0` = lowla.', 'Default `sheet_name=0` = the first sheet.'], code: `notes_xl = pd.read_excel("${URL}/notes.xlsx")` },
      { t: ['Q7 — 2e feuille « notes_h_s », 1re ligne = commentaire', 'Q7 — Feuille « notes_h_s », str lowl commentaire', 'Q7 — Sheet "notes_h_s", first row is a comment'], b: ['On choisit la feuille par son **nom** et on saute le commentaire.', 'Kankhtarou feuille b **smiya** w kanfoutou commentaire.', 'Select the sheet by **name** and skip the comment.'], code: `notes_xl2 = pd.read_excel("${URL}/notes.xlsx", sheet_name="notes_h_s", skiprows=1)` },
      { t: ['Q8 — Export CSV', 'Q8 — Export CSV', 'Q8 — CSV export'], b: ['Virgule comme séparateur de champs, point comme séparateur décimal, **sans numéros de ligne** → `index=False`.', 'Virgule séparateur, point décimal, **bla numéros** → `index=False`.', 'Comma field separator, dot decimal, **no row numbers** → `index=False`.'], code: 'notes_xl2.to_csv("notes_export.csv", sep=",", decimal=".", index=False)', why: ['`sep=","` et `decimal="."` sont déjà les valeurs par défaut : les écrire montre au correcteur que tu as compris la consigne.', '`sep=","` w `decimal="."` déjà par défaut : ktbhom bach ybayen l correcteur bli fhemti.', '`sep=","` and `decimal="."` are already the defaults: writing them shows the grader you understood.'] }
    ]),
    tip(['Si une feuille Excel a un nom avec des espaces (« notes h s » dans l\'énoncé), recopie-le exactement, ou utilise son numéro : `sheet_name=1` pour la 2e feuille.', 'Ila smiyat feuille fiha espaces (« notes h s »), ktebha bdbt, wla st3mel numéro : `sheet_name=1` l tanya.', 'If a sheet name has spaces ("notes h s" in the statement), copy it exactly, or use its number: `sheet_name=1` for the 2nd sheet.']),
    quiz('dp-06', 'dp-07', 'dp-08', 'dp-17'),

    h(['9. Aide-mémoire : je veux… j\'écris…', '9. Aide-mémoire : bghit… nkteb…', '9. Cheat sheet: I want… I write…']),
    table([['Je veux…', 'Bghit…', 'I want…'], ['J\'écris', 'Nkteb', 'I write']], [
      [['Lire un CSV', '9ra CSV', 'Read a CSV'], 'pd.read_csv("f.csv")'],
      [['Lire depuis une URL', '9ra mn URL', 'Read from a URL'], 'pd.read_csv(url + "f.csv")'],
      [['Séparateur « ; », décimale « , »', '« ; » w « , »', '";" separator, "," decimal'], 'sep=";", decimal=","'],
      [['Fichier sans en-tête', 'Bla en-tête', 'File without header'], 'header=None, names=[…]'],
      [['Sauter la 1re ligne', 'Fout str lowl', 'Skip the first row'], 'skiprows=1'],
      [['Une feuille Excel précise', 'Feuille Excel m7eddda', 'A given Excel sheet'], 'pd.read_excel("f.xlsx", sheet_name="nom")'],
      [['Toutes les feuilles', 'Ga3 feuilles', 'All sheets'], 'sheet_name=None  → dict'],
      [['Quelques colonnes / lignes', 'Chi colonnes / stour', 'Some columns / rows'], 'usecols=[…], nrows=n'],
      [['« - » = valeur manquante', '« - » = manquante', '"-" = missing value'], 'na_values=["-"]'],
      [['Garder 007 en texte', '007 texte', 'Keep 007 as text'], 'dtype={"code": str}'],
      [['Vérifier la lecture', 'T2akked', 'Check the read'], 'df.shape, df.dtypes, df.head()'],
      [['Exporter sans numéros de ligne', 'Export bla numéros', 'Export without row numbers'], 'df.to_csv("f.csv", index=False)'],
      [['Exporter en Excel / JSON', 'Export Excel / JSON', 'Export to Excel / JSON'], 'df.to_excel(…), df.to_json(…)']
    ])
  ],
  keyPoints: [
    L(['pandas = lire, modifier, sauvegarder des tableaux ; `pip install pandas` ; `import pandas as pd`.', 'pandas = 9ra, beddel, sauvegardi ; `pip install pandas`.', 'pandas = read, modify, save tables; `pip install pandas`; `import pandas as pd`.']),
    L(['`pd.read_<format>` (csv, excel, json, html, sql, parquet, fwf, clipboard…) ; écrire avec `df.to_<format>`.', '`pd.read_<format>` ; `df.to_<format>`.', '`pd.read_<format>` (csv, excel, json, html, sql, parquet, fwf, clipboard…); write with `df.to_<format>`.']),
    L(['read_csv : `sep`, `decimal`, `header=None`, `names`, `skiprows`, `na_values`. read_excel : `sheet_name`, `usecols`, `nrows`, `index_col`, `dtype`.', 'Paramètres : sep, decimal, header, skiprows, sheet_name…', 'read_csv: `sep`, `decimal`, `header=None`, `names`, `skiprows`, `na_values`. read_excel: `sheet_name`, `usecols`, `nrows`, `index_col`, `dtype`.']),
    L(['Series = 1 dimension (une colonne + index) ; DataFrame = 2 dimensions (collection de Series).', 'Series = 1 bo3d ; DataFrame = 2 ab3ad.', 'Series = 1-D (one column + index); DataFrame = 2-D (collection of Series).']),
    L(['Export sans numéros de ligne : `index=False`.', 'Bla numéros : `index=False`.', 'Export without row numbers: `index=False`.'])
  ]
};
