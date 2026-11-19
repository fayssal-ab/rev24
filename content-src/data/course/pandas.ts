import { L, h, p, def, plain, steps, tip, trap, exam, table, code, anim, quiz } from '../../lib';
import type { Chapter } from '../../../src/lib/schema';

const URL = 'http://egallic.fr/Enseignement/Python/Exercices/donnees';

/** Chap 1 — Manipulation de différents formats de données (Pr. A. Kadiri, 11 octobre 2026) + Feuille d'exercices N°1. */
export const chapter: Chapter = {
  id: 'pandas',
  module: 'data',
  order: 3,
  title: L(['Chap 1 — Manipulation de différents formats de données (pandas)', 'Fasl 1 — Khdma b formats dyal data (pandas)', 'Ch. 1 — Working with different data formats (pandas)']),
  summary: L([
    'Pourquoi pandas, installation, les fonctions read_… (CSV, Excel, JSON, SQL…), écrire avec Series et DataFrame, paramètres de read_excel, puis la correction complète de la Feuille d\'exercices N°1.',
    '3lach pandas, installation, les fonctions read_… (CSV, Excel, JSON, SQL…), Series w DataFrame, paramètres dyal read_excel, w correction kamla dyal Feuille N°1.',
    'Why pandas, installation, the read_… functions (CSV, Excel, JSON, SQL…), writing with Series and DataFrame, read_excel parameters, then the full solution of Exercise sheet No. 1.'
  ]),
  estimatedMinutes: 40,
  sections: [
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

    h(['4. Exemples : lire, modifier, sauvegarder', '4. Amthila : 9ra, beddel, sauvegardi', '4. Examples: read, modify, save']),
    steps(['De la lecture à la sauvegarde, ligne par ligne', 'Mn 9raya l sauvegarde, str b str', 'From reading to saving, line by line'], [
      { t: ['Importer pandas', 'Importi pandas', 'Import pandas'], b: ['On importe la bibliothèque sous son alias habituel `pd`.', 'Kanimportiw b smiya `pd`.', 'Import the library with its usual alias `pd`.'], code: 'import pandas as pd' },
      { t: ['Lire le fichier Excel', '9ra Excel', 'Read the Excel file'], b: ['`read_excel` renvoie un DataFrame qu\'on range dans `df`.', '`read_excel` kayrje3 DataFrame, kan7ttouh f `df`.', '`read_excel` returns a DataFrame stored in `df`.'], code: 'df = pd.read_excel("notes.xlsx")\nprint(df.head())   # 5 premières lignes' },
      { t: ['Regarder la structure', 'Chouf structure', 'Inspect the structure'], b: ['Toujours vérifier ce qu\'on a lu : dimensions, noms et types des colonnes.', 'Dima t2akked chnou 9riti : l 7ajm, smiyat w types dyal colonnes.', 'Always check what you read: shape, column names and types.'], code: 'print(df.shape)     # (lignes, colonnes)\nprint(df.columns)\ndf.info()', why: ['Une colonne de nombres lue comme du texte (« 12,5 » avec une virgule) est le bug le plus fréquent : `info()` le montre tout de suite (type object).', 'Colonne d arqam t9rat texte (« 12,5 » b virgule) hiya akther bug : `info()` kayban fih direct (type object).', 'A numeric column read as text ("12,5" with a comma) is the most frequent bug: `info()` shows it immediately (object type).'] },
      { t: ['Modifier', 'Beddel', 'Modify'], b: ['Exemple : ajouter une colonne calculée.', 'Mithal : zid colonne m7souba.', 'Example: add a computed column.'], code: 'df["moyenne"] = (df["note1"] + df["note2"]) / 2' },
      { t: ['Sauvegarder en Excel', 'Sauvegardi f Excel', 'Save as Excel'], b: ['Sauvegarder les données modifiées dans un nouveau fichier Excel. `index=False` évite d\'écrire la colonne 0, 1, 2… des numéros de ligne.', 'Sauvegardi data jdida f Excel. `index=False` bach ma yktebch colonne dyal numéros 0, 1, 2…', 'Save the modified data to a new Excel file. `index=False` avoids writing the 0, 1, 2… row-number column.'], code: 'df.to_excel("notes_modifiees.xlsx", index=False)' },
      { t: ['Pour JSON ou CSV', 'L JSON wla CSV', 'For JSON or CSV'], b: ['**Même fonction, autre mot** : on remplace `excel` par `json` ou `csv`, et l\'extension du fichier dans le chemin.', '**Nefs fonction, kelma khra** : kanbeddlou `excel` b `json` wla `csv`, w l extension f chemin.', '**Same function, other word**: replace `excel` by `json` or `csv`, and the file extension in the path.'], code: 'df = pd.read_csv("notes.csv")\ndf = pd.read_json("notes.json")\ndf.to_csv("notes.csv", index=False)\ndf.to_json("notes.json")' }
    ]),

    h(['5. Écrire des données : Series et DataFrame', '5. Kteb data : Series w DataFrame', '5. Writing data: Series and DataFrame']),
    p(['On peut créer des données directement avec les deux structures de pandas :', 'N9drou nsaybou data direct b jouj structures dyal pandas :', 'We can create data directly with pandas\' two structures:']),
    code(`import pandas as pd

# Series : UNE colonne (valeurs + index)
s = pd.Series([12, 15, 9], index=["Amine", "Sara", "Yassine"], name="note")
print(s)
# Amine      12
# Sara       15
# Yassine     9
# Name: note, dtype: int64

# DataFrame : un TABLEAU (plusieurs colonnes qui partagent le même index)
df = pd.DataFrame({
    "nom":  ["Amine", "Sara", "Yassine"],
    "note": [12, 15, 9],
    "ville": ["Rabat", "Salé", "Témara"],
})
print(df)
#        nom  note   ville
# 0    Amine    12   Rabat
# 1     Sara    15    Salé
# 2  Yassine     9  Témara`, 'python'),
    table([['Critère', 'Mi3yar', 'Criterion'], ['Series', 'Series', 'Series'], ['DataFrame', 'DataFrame', 'DataFrame']], [
      [['Dimensions', 'Dimensions', 'Dimensions'], ['**1 dimension** (une colonne)', '**1 bo3d** (colonne wa7da)', '**1 dimension** (one column)'], ['**2 dimensions** (lignes × colonnes)', '**2 ab3ad** (stour × colonnes)', '**2 dimensions** (rows × columns)']],
      [['Contenu', 'Chnou fiha', 'Content'], ['Valeurs + un index', 'Qiyam + index', 'Values + an index'], ['Plusieurs colonnes, chacune est une Series', 'Bzaf d colonnes, kol wa7da Series', 'Several columns, each one is a Series']],
      [['Types', 'Types', 'Types'], ['Un seul type', 'Type wa7ed', 'One type'], ['Un type par colonne', 'Type l kol colonne', 'One type per column']],
      [['Obtenir', 'Kifach tjibha', 'Get it'], ['`df["note"]`', '`df["note"]`', '`df["note"]`'], ['`df[["nom", "note"]]` ou `pd.read_csv(…)`', '`df[["nom", "note"]]` wla `pd.read_csv(…)`', '`df[["nom", "note"]]` or `pd.read_csv(…)`']]
    ]),
    exam(['**Question du cours : « Donner la différence entre Series et DataFrame. »** Réponse type : une **Series** est un tableau à **une dimension** (une seule colonne de valeurs avec un index) ; un **DataFrame** est un tableau à **deux dimensions** (lignes et colonnes), c\'est-à-dire une collection de Series qui partagent le même index. Une colonne d\'un DataFrame (`df["note"]`) est une Series.', '**Sou2al dyal dars : « 3tini l far9 bin Series w DataFrame. »** Jawab : **Series** = tableau b **bo3d wa7ed** (colonne wa7da m3a index) ; **DataFrame** = tableau b **jouj ab3ad** (stour w colonnes), ya3ni majmou3a d Series 3andhom nefs l index. Colonne mn DataFrame (`df["note"]`) hiya Series.', '**Course question: "Give the difference between Series and DataFrame."** Model answer: a **Series** is **one-dimensional** (a single column of values with an index); a **DataFrame** is **two-dimensional** (rows and columns), i.e. a collection of Series sharing the same index. A DataFrame column (`df["note"]`) is a Series.']),

    h(['6. Les principaux paramètres de read_excel()', '6. Paramètres l mohimmin dyal read_excel()', '6. Main parameters of read_excel()']),
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
    p(['Pour **read_csv**, on retrouve les mêmes plus deux paramètres essentiels : **`sep`** (séparateur de champs, `,` par défaut) et **`decimal`** (séparateur décimal, `.` par défaut).', 'F **read_csv**, kayn nefs l paramètres + jouj mohimmin : **`sep`** (séparateur, `,` par défaut) w **`decimal`** (virgule dyal l a3dad, `.` par défaut).', 'For **read_csv**, the same parameters apply plus two essential ones: **`sep`** (field separator, `,` by default) and **`decimal`** (decimal separator, `.` by default).']),
    anim('PandasReadPlayground'),
    trap(['`header=None` veut dire **« il n\'y a pas de ligne d\'en-tête »**, pas « supprime l\'en-tête ». Et `skiprows=1` **saute** la 1re ligne. Les deux ne sont pas interchangeables.', '`header=None` ma3nah **« ma kaynch str dyal titres »**, machi « 7iyed titres ». W `skiprows=1` **kayfout** str lowl. Machi b7al b7al.', '`header=None` means **"there is no header row"**, not "drop the header". And `skiprows=1` **skips** the first row. They are not interchangeable.']),
    quiz('dp-03', 'dp-04', 'dp-05', 'dp-12'),

    h(['7. Feuille d\'exercices N°1 — correction complète', '7. Feuille N°1 — correction kamla', '7. Exercise sheet No. 1 — full solution']),
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
    quiz('dp-06', 'dp-07', 'dp-08', 'dp-17')
  ],
  keyPoints: [
    L(['pandas = lire, modifier, sauvegarder des tableaux ; `pip install pandas` ; `import pandas as pd`.', 'pandas = 9ra, beddel, sauvegardi ; `pip install pandas`.', 'pandas = read, modify, save tables; `pip install pandas`; `import pandas as pd`.']),
    L(['`pd.read_<format>` (csv, excel, json, html, sql, parquet, fwf, clipboard…) ; écrire avec `df.to_<format>`.', '`pd.read_<format>` ; `df.to_<format>`.', '`pd.read_<format>` (csv, excel, json, html, sql, parquet, fwf, clipboard…); write with `df.to_<format>`.']),
    L(['read_csv : `sep`, `decimal`, `header=None`, `names`, `skiprows`, `na_values`. read_excel : `sheet_name`, `usecols`, `nrows`, `index_col`, `dtype`.', 'Paramètres : sep, decimal, header, skiprows, sheet_name…', 'read_csv: `sep`, `decimal`, `header=None`, `names`, `skiprows`, `na_values`. read_excel: `sheet_name`, `usecols`, `nrows`, `index_col`, `dtype`.']),
    L(['Series = 1 dimension (une colonne + index) ; DataFrame = 2 dimensions (collection de Series).', 'Series = 1 bo3d ; DataFrame = 2 ab3ad.', 'Series = 1-D (one column + index); DataFrame = 2-D (collection of Series).']),
    L(['Export sans numéros de ligne : `index=False`.', 'Bla numéros : `index=False`.', 'Export without row numbers: `index=False`.'])
  ]
};
