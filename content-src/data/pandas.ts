import { setCtx, single, multi, num, ex, fc, ref } from '../lib';

setCtx('data', 'pandas');

export const questions = [
  single('dp-01', 1, ['Comment installer pandas ?', 'Kifach tinstalli pandas ?', 'How to install pandas?'], ['pip install pandas', 'import pandas', 'pd.install()', 'dnf install pandas'], 0,
    ['`pip install pandas` (gestionnaire de paquets Python), puis `import pandas as pd` dans le code.', '`pip install pandas` w `import pandas as pd`.', '`pip install pandas`, then `import pandas as pd`.'],
    [['`import` charge une bibliothèque déjà installée.', 'import ≠ install.', '`import` loads an installed library.'], ['Cette fonction n\'existe pas.', 'Ma kaynach.', 'Does not exist.'], ['On installe les bibliothèques Python avec pip.', 'pip.', 'Use pip.']], ['pandas']),
  single('dp-02', 1, ['Différence entre **Series** et **DataFrame** ?', 'Series vs DataFrame ?', 'Series vs DataFrame?'],
    [['Series = 1D (une colonne indexée), DataFrame = 2D (tableau de colonnes)', 'Series 1D, DataFrame 2D', 'Series 1D, DataFrame 2D'], ['Series = 2D, DataFrame = 1D', 'L3eks', 'Reversed'], ['Aucune', 'Walou', 'None'], ['Series ne contient que du texte', 'Ghir texte', 'Series holds text only']], 0,
    ['**Series** : structure à **une dimension** (valeurs + index). **DataFrame** : **deux dimensions** (lignes × colonnes), chaque colonne est une Series.', 'Series 1D ; DataFrame 2D.', '**Series** 1D; **DataFrame** 2D, each column is a Series.'],
    [['Inversé.', 'L3eks.', 'Reversed.'], ['Elles diffèrent par la dimension.', 'Dimension.', 'Different dimension.'], ['Une Series peut contenir des nombres.', 'Ar9am.', 'It can hold numbers.']], ['pandas']),
  single('dp-03', 2, ['`notes_decim.csv` utilise `;` comme séparateur et la virgule comme séparateur décimal. Quel appel est correct ?', 'notes_decim.csv : ?', 'Which call reads notes_decim.csv?'],
    ['pd.read_csv("notes_decim.csv", sep=";", decimal=",")', 'pd.read_csv("notes_decim.csv", sep=",", decimal=";")', 'pd.read_csv("notes_decim.csv", delimiter=",")', 'pd.read_excel("notes_decim.csv")'], 0,
    ['`sep=";"` découpe les colonnes, `decimal=","` convertit « 12,5 » en 12.5 (float).', 'sep=";" w decimal=",".', '`sep=";"` and `decimal=","`.'],
    [['Paramètres inversés.', 'L3eks.', 'Swapped.'], ['Le séparateur est `;`, pas `,` ; et le décimal n\'est pas géré.', 'Ghalat.', 'Wrong separator.'], ['C\'est un CSV, pas un classeur Excel.', 'CSV.', 'It is a CSV.']], ['read_csv'], 'pd.read_csv(url + "notes_decim.csv", ...)'),
  single('dp-04', 2, ['Le fichier `notes_h.csv` n\'a **pas** de ligne d\'en-tête. Que faut-il ajouter ?', 'Bla en-tête : ?', 'No header line: add?'], ['header=None', 'header=0', 'skiprows=1', 'index_col=0'], 0,
    ['Par défaut pandas prend la 1re ligne comme noms de colonnes ; `header=None` indique qu\'il n\'y en a pas (colonnes 0, 1, 2…).', '`header=None`.', '`header=None` (columns numbered 0, 1, 2…).'],
    [['header=0 est le défaut : la 1re ligne de données deviendrait l\'en-tête.', 'Défaut.', 'Default: first row becomes header.'], ['skiprows supprime une ligne de données !', 'Kaymse7 ster.', 'Drops a data row!'], ['index_col choisit la colonne d\'index.', 'Index.', 'Picks the index column.']], ['read_csv']),
  single('dp-05', 3, ['`notes_h_s.csv` commence par une ligne de commentaire, puis les données sans en-tête. Appel correct ?', 'Commentaire + bla en-tête ?', 'Comment line + no header?'],
    ['pd.read_csv("notes_h_s.csv", header=None, skiprows=1)', 'pd.read_csv("notes_h_s.csv", skiprows=1)', 'pd.read_csv("notes_h_s.csv", header=None)', 'pd.read_csv("notes_h_s.csv", header=1)'], 0,
    ['`skiprows=1` saute le commentaire, `header=None` évite de prendre la 1re ligne de données comme en-tête.', 'skiprows=1 + header=None.', '`skiprows=1` + `header=None`.'],
    [['Sans header=None, la 1re ligne de données devient l\'en-tête.', 'Na9es header=None.', 'First data row becomes the header.'], ['Le commentaire serait lu comme donnée.', 'Commentaire = data.', 'Comment read as data.'], ['header=1 prend la 2e ligne comme en-tête.', 'Ster tani en-tête.', 'Second line as header.']], ['read_csv']),
  single('dp-06', 2, ['Lire la **première feuille** de `notes.xlsx` ?', 'Feuille lowla ?', 'Read the **first sheet**?'], ['pd.read_excel("notes.xlsx", sheet_name=0)', 'pd.read_csv("notes.xlsx")', 'pd.read_excel("notes.xlsx", sheet_name=1)', 'pd.read_excel("notes.xlsx", sheet_name=None)'], 0,
    ['`sheet_name=0` = 1re feuille (défaut), un **nom** (`"notes_h_s"`) = cette feuille, `None` = **toutes** dans un dictionnaire.', '0 = lowla ; nom ; None = kolchi.', '0 first; name; None = all (dict).'],
    [['read_csv ne lit pas les .xlsx.', 'CSV.', 'Not for xlsx.'], ['1 = 2e feuille.', '1 = tanya.', '1 = second.'], ['None renvoie un dict de toutes les feuilles.', 'Dict.', 'Returns a dict.']], ['read_excel']),
  cmd2(),
  single('dp-08', 2, ['Exporter `df` en CSV standard **sans** la colonne d\'index ?', 'Export bla index ?', 'Export without index?'], ['df.to_csv("notes_export.csv", sep=",", decimal=".", index=False)', 'df.to_csv("notes_export.csv")', 'pd.to_csv(df, "notes_export.csv")', 'df.to_excel("notes_export.csv", index=False)'], 0,
    ['`index=False` empêche l\'écriture de l\'index 0, 1, 2… ; `sep` et `decimal` fixent le format.', '`index=False`.', '`index=False` drops the index column.'],
    [['Écrit l\'index en 1re colonne.', 'Index kaytktb.', 'Writes the index.'], ['to_csv est une méthode du DataFrame.', 'Méthode.', 'It is a DataFrame method.'], ['to_excel produit un xlsx.', 'xlsx.', 'Writes xlsx.']], ['to_csv']),
  multi('dp-09', 2, ['Lesquelles sont de vraies fonctions de lecture pandas ?', 'Fonctions read_ s7a7 ?', 'Which are real pandas readers?'], ['read_csv', 'read_json', 'read_parquet', 'read_sql', 'read_word', 'read_html'], [0, 1, 2, 3, 5],
    ['csv, fwf, clipboard, excel, hdf, html, json, feather, orc, parquet, pickle, sas, spss, sql, sql_table, stata, xml.', 'read_* liste.', 'Full read_* list.'],
    [['Pas de read_word (Word n\'est pas un format de données tabulaires).', 'Ma kaynch.', 'No read_word.']], ['read']),
  single('dp-10', 2, ['Quel paramètre de `read_excel` choisit les colonnes à lire ?', 'Ach men paramètre colonnes ?', 'Which read_excel parameter selects columns?'], ['usecols', 'names', 'index_col', 'nrows'], 0,
    ['`usecols` : colonnes à lire ; `names` : noms à donner ; `index_col` : colonne d\'index ; `nrows` : nombre de lignes.', 'usecols.', '`usecols`.'],
    [['names renomme.', 'Smiyat.', 'names renames.'], ['index_col choisit l\'index.', 'Index.', 'Index column.'], ['nrows limite les lignes.', 'Lignes.', 'Rows limit.']], ['read_excel']),
  single('dp-11', 3, ['Que fait `na_values=["-", "NA"]` ?', 'na_values ?', 'What does na_values do?'], [['Traite « - » et « NA » comme valeurs manquantes (NaN)', 'Kay3tabrhom NaN', 'Treats "-" and "NA" as missing (NaN)'], ['Supprime ces lignes', 'Kaymse7', 'Deletes those rows'], ['Remplace NaN par « - »', 'L3eks', 'Replaces NaN with "-"'], ['Renomme des colonnes', 'Smiyat', 'Renames columns']], 0,
    ['`na_values` liste les chaînes à interpréter comme manquantes : utile au **nettoyage** (sinon la colonne devient de type object).', 'NaN.', 'Strings read as NaN.'],
    [['Rien n\'est supprimé à la lecture.', 'Ma kaymse7ch.', 'Nothing deleted.'], ['C\'est l\'inverse (fillna à l\'écriture).', 'L3eks.', 'Opposite.'], ['Sans rapport.', 'Walou.', 'Unrelated.']], ['read_excel']),
  single('dp-12', 3, ['Sans `decimal=","`, la colonne `note1` de `notes_decim.csv` (lue avec `sep=";"`) aura le type…', 'Bla decimal : type ?', 'Without decimal=",": dtype?'], ['object (texte)', 'float64', 'int64', 'bool'], 0,
    ['« 12,5 » n\'est pas un nombre pour pandas sans `decimal=","` → la colonne reste **object** et les calculs (moyenne) échouent.', 'object.', '**object**: computations fail.'],
    [['Seulement avec decimal=",".', 'B decimal.', 'Only with decimal.'], ['Il y a des décimales.', 'Décimales.', 'There are decimals.'], ['Non.', 'La.', 'No.']], ['read_csv', 'nettoyage']),
  single('dp-13', 2, ['Quel paramètre fixe le moteur de lecture d\'un .xlsx ?', 'Moteur xlsx ?', 'Engine parameter?'], ['engine="openpyxl"', 'driver="xlsx"', 'mode="excel"', 'reader="xl"'], 0,
    ['`engine` choisit la bibliothèque (openpyxl pour .xlsx).', 'engine.', '`engine`.'], [['N\'existe pas.', 'Ma kaynch.', 'Does not exist.'], ['N\'existe pas.', 'Ma kaynch.', 'Does not exist.'], ['N\'existe pas.', 'Ma kaynch.', 'Does not exist.']], ['read_excel']),
  num('dp-14', 3, ['`notes_h.csv` contient 4 lignes de données sans en-tête. Combien de lignes aura le DataFrame lu **sans** `header=None` ?', 'Ch7al ster bla header=None ?', 'Rows read without header=None?'], 3, 0,
    ['La 1re ligne de données devient l\'en-tête : il reste **3** lignes (une donnée perdue).', '3.', '**3** (one row lost).'], { '4': ['Ce serait avec header=None.', 'B header=None.', 'With header=None.'] }, ['read_csv']),
  num('dp-15', 2, ['`notes_h_s.csv` : 1 ligne de commentaire + 4 lignes de données. Lu avec `header=None, skiprows=1`, combien de lignes ?', 'Ch7al ster ?', 'How many rows?'], 4, 0, ['Le commentaire est sauté, aucune ligne prise comme en-tête → **4**.', '4.', '**4**.'], {}, ['read_csv']),
  single('dp-16', 3, ['Pourquoi utiliser `url + "notes.csv"` dans le corrigé de la Feuille N°1 ?', '3lach url + "notes.csv" ?', 'Why url + "notes.csv"?'], [['read_csv peut lire directement un fichier depuis une URL HTTP', 'read_csv y9ra mn URL', 'read_csv reads directly from an HTTP URL'], ['Pour télécharger pandas', 'Telecharger pandas', 'To download pandas'], ['C\'est obligatoire', 'Darouri', 'It is mandatory'], ['Pour convertir en Excel', 'Excel', 'To convert to Excel']], 0,
    ['pandas accepte un chemin local **ou une URL** : la concaténation de chaînes construit l\'adresse complète.', 'URL.', 'Paths or URLs are accepted.'],
    [['pandas est déjà installé.', 'Installé.', 'Already installed.'], ['Un chemin local marche aussi.', 'Local.', 'Local paths work.'], ['Aucune conversion.', 'Walou.', 'No conversion.']], ['read_csv']),
  multi('dp-17', 3, ['Pour `pd.read_excel(url + "notes.xlsx", sheet_name="notes_h_s", skiprows=1)`, quelles affirmations sont vraies ?', 'read_excel : chnou s7i7 ?', 'Which statements are true?'], [['On lit la feuille nommée notes_h_s', 'Feuille notes_h_s', 'Reads sheet notes_h_s'], ['La 1re ligne de la feuille est ignorée', 'Ster lowel tzad', 'First line skipped'], ['Toutes les feuilles sont lues', 'Kolchi', 'All sheets read'], ['Le résultat est un DataFrame', 'DataFrame', 'Result is a DataFrame']], [0, 1, 3],
    ['Un nom de feuille → un seul DataFrame ; `skiprows=1` saute la ligne de commentaire.', 'Feuille wa7da.', 'One sheet → one DataFrame.'], [['Seulement avec sheet_name=None.', 'None.', 'Only with None.']], ['read_excel']),
  single('dp-18', 1, ['Quelle méthode écrit un DataFrame en JSON ?', 'JSON ?', 'Write JSON?'], ['df.to_json()', 'pd.write_json(df)', 'df.save_json()', 'df.json()'], 0, ['Écriture : `to_csv`, `to_excel`, `to_json`.', 'to_json.', '`to_json`.'], [['N\'existe pas.', 'Ma kaynach.', 'No.'], ['N\'existe pas.', 'Ma kaynach.', 'No.'], ['N\'existe pas.', 'Ma kaynach.', 'No.']], ['to_csv'])
];

function cmd2() {
  return single('dp-07', 2, ['Que renvoie `pd.read_excel("notes.xlsx", sheet_name=None)` ?', 'sheet_name=None ?', 'sheet_name=None returns?'], [['Un dictionnaire {nom de feuille: DataFrame}', 'Dict', 'A dict {sheet name: DataFrame}'], ['La première feuille', 'Lowla', 'The first sheet'], ['Une erreur', 'Erreur', 'An error'], ['Une Series', 'Series', 'A Series']], 0,
    ['`None` = toutes les feuilles, dans un **dict** dont les clés sont les noms des feuilles.', 'Dict.', 'A **dict** of all sheets.'], [['C\'est sheet_name=0.', '0.', 'That is 0.'], ['Valeur permise.', 'Permise.', 'Allowed.'], ['Non.', 'La.', 'No.']], ['read_excel']);
}

export { chapter } from './course/pandas';

export const exercises = [
  ex('dx-p-1', 2, ['Feuille N°1 — lectures CSV', 'Feuille 1 — CSV', 'Sheet 1 — CSV reads'],
    ['Écris les instructions pour lire depuis `url` : a) `notes.csv` ; b) `notes_decim.csv` (`;`, virgule décimale) ; c) `notes_h.csv` (sans en-tête) ; d) `notes_h_s.csv` (une ligne de commentaire puis sans en-tête).', '4 lectures CSV.', 'Four CSV reads.'],
    [['Regarde la 1re ligne de chaque fichier.', 'Chouf ster lowel.', 'Look at line 1.']],
    [{ t: ['Solution', 'Solution', 'Solution'], b: ['', '', ''], code: 'url = "http://egallic.fr/Enseignement/Python/Exercices/donnees/"\na = pd.read_csv(url + "notes.csv")\nb = pd.read_csv(url + "notes_decim.csv", sep=";", decimal=",")\nc = pd.read_csv(url + "notes_h.csv", header=None)\nd = pd.read_csv(url + "notes_h_s.csv", header=None, skiprows=1)' }],
    ['a) défaut ; b) sep=";", decimal="," ; c) header=None ; d) header=None, skiprows=1.', 'Paramètres.', 'See parameters.'],
    [['skiprows=1 seul pour notes_h (supprime une donnée).', 'skiprows ghalat.', 'skiprows alone loses data.'], ['Oublier decimal.', 'Bla decimal.', 'Forgetting decimal.']]),
  ex('dx-p-2', 2, ['Feuille N°1 — Excel et export', 'Feuille 1 — Excel', 'Sheet 1 — Excel and export'],
    ['Lis la 1re feuille de `notes.xlsx`, puis la feuille `notes_h_s` (en sautant la ligne de commentaire). Exporte enfin le DataFrame en `notes_export.csv`, séparateur `,`, point décimal, sans index.', 'Excel w export.', 'Excel reads and export.'],
    [['sheet_name accepte un numéro ou un nom.', 'Ra9m wla smiya.', 'Number or name.']],
    [{ t: ['Solution', 'Solution', 'Solution'], b: ['', '', ''], code: 'df1 = pd.read_excel(url + "notes.xlsx", sheet_name=0)\ndf2 = pd.read_excel(url + "notes.xlsx", sheet_name="notes_h_s", skiprows=1)\ndf2.to_csv("notes_export.csv", sep=",", decimal=".", index=False)' }],
    ['`sheet_name=0` ; `sheet_name="notes_h_s", skiprows=1` ; `to_csv(..., index=False)`.', 'Solution.', 'See code.'],
    [['read_csv sur un .xlsx.', 'read_csv.', 'read_csv on xlsx.'], ['Oublier index=False.', 'index=False.', 'Forgetting index=False.']]),
  ex('dx-p-3', 3, ['Diagnostiquer une lecture ratée', 'Diagnostic', 'Debug a failed read'],
    ['`df = pd.read_csv("ventes.csv")` donne une seule colonne nommée `produit;prix;qte` et des valeurs comme `"pomme;2,5;10"`. `df["prix"].mean()` plante. Explique et corrige.', 'Colonne wa7da : 3lach ?', 'One column only: why? Fix it.'],
    [['Regarde le caractère entre les champs.', 'Séparateur.', 'Look at the separator.']],
    [{ t: ['Cause', 'Sabab', 'Cause'], b: ['Séparateur `;` non indiqué → tout dans une colonne ; décimales à virgule → texte.', '`;` w `,`.', '`;` separator and decimal comma.'] },
     { t: ['Correction', 'Tas7i7', 'Fix'], b: ['', '', ''], code: 'df = pd.read_csv("ventes.csv", sep=";", decimal=",")\ndf["prix"].mean()' }],
    ['`pd.read_csv("ventes.csv", sep=";", decimal=",")`.', 'sep + decimal.', 'sep + decimal.'],
    [['Mettre seulement sep : prix reste du texte.', 'Ghir sep.', 'Only sep: still text.']]),
  ex('dx-p-4', 3, ['Lecture ciblée d\'un classeur', 'Lecture ciblée', 'Targeted workbook read'],
    ['Dans `notes.xlsx`, lis seulement les colonnes A et C des 100 premières lignes, utilise la colonne A comme index, traite « abs » comme valeur manquante et lis **toutes** les feuilles. Quel type d\'objet obtiens-tu ?', 'usecols, nrows, index_col, na_values, sheet_name=None.', 'Columns A,C, 100 rows, index A, "abs" as NaN, all sheets.'],
    [['usecols accepte "A,C".', 'usecols="A,C".', 'usecols="A,C".']],
    [{ t: ['Appel', 'Appel', 'Call'], b: ['', '', ''], code: 'd = pd.read_excel("notes.xlsx", sheet_name=None, usecols="A,C", nrows=100, index_col=0, na_values=["abs"])\nd.keys()   # noms des feuilles' },
     { t: ['Type', 'Type', 'Type'], b: ['`sheet_name=None` → **dict** {nom de feuille: DataFrame}.', 'Dict.', 'A dict.'] }],
    ['Un dictionnaire de DataFrames, un par feuille.', 'Dict.', 'A dict of DataFrames.'],
    [['Attendre un seul DataFrame.', 'DataFrame wa7ed.', 'Expecting one DataFrame.']]),
  ex('dx-p-5', 2, ['Series ou DataFrame ?', 'Series wla DataFrame ?', 'Series or DataFrame?'],
    ['Après `df = pd.read_csv("notes.csv")` (colonnes nom, note1, note2), quel est le type de `df`, de `df["note1"]` et de `df[["note1", "note2"]]` ?', 'Types ?', 'Types?'],
    [['Un seul crochet → une colonne.', 'Crochet wa7ed.', 'Single brackets → one column.']],
    [{ t: ['Réponse', 'Jawab', 'Answer'], b: ['`df` : DataFrame (2D) ; `df["note1"]` : **Series** (1D) ; `df[["note1","note2"]]` : **DataFrame** (liste de colonnes).', 'DataFrame, Series, DataFrame.', 'DataFrame, Series, DataFrame.'] }],
    ['DataFrame · Series · DataFrame.', 'DataFrame · Series · DataFrame.', 'DataFrame · Series · DataFrame.'],
    [['Croire que deux crochets donnent une Series.', 'Jouj crochets.', 'Double brackets give a DataFrame.']])
];

export const flashcards = [
  fc('fc-dp-1', ['Installer / importer pandas ?', 'pandas ?', 'Install / import pandas?'], ['`pip install pandas` · `import pandas as pd`', '`pip install pandas`', '`pip install pandas`']),
  fc('fc-dp-2', ['Series vs DataFrame ?', 'Series vs DataFrame ?', 'Series vs DataFrame?'], ['1D (valeurs + index) vs 2D (lignes × colonnes).', '1D vs 2D.', '1D vs 2D.']),
  fc('fc-dp-3', ['CSV avec ; et virgule décimale ?', '; w virgule ?', '; and decimal comma?'], ['`sep=";", decimal=","`', '`sep=";", decimal=","`', '`sep=";", decimal=","`']),
  fc('fc-dp-4', ['Fichier sans en-tête ?', 'Bla en-tête ?', 'No header?'], ['`header=None`', '`header=None`', '`header=None`']),
  fc('fc-dp-5', ['Sauter une ligne de commentaire ?', 'Sauter ster ?', 'Skip a comment line?'], ['`skiprows=1`', '`skiprows=1`', '`skiprows=1`']),
  fc('fc-dp-6', ['sheet_name = 0 / "nom" / None ?', 'sheet_name ?', 'sheet_name values?'], ['1re feuille / cette feuille / toutes (dict)', 'Lowla / smiya / kolchi', 'First / named / all (dict)']),
  fc('fc-dp-7', ['Exporter sans index ?', 'Export bla index ?', 'Export without index?'], ['`df.to_csv("f.csv", index=False)`', '`index=False`', '`index=False`']),
  fc('fc-dp-8', ['usecols · nrows · index_col ?', 'usecols · nrows · index_col ?', 'usecols · nrows · index_col?'], ['colonnes à lire · nombre de lignes · colonne d\'index', 'colonnes · lignes · index', 'columns · rows · index']),
  fc('fc-dp-9', ['na_values ?', 'na_values ?', 'na_values?'], ['Chaînes à lire comme valeurs manquantes (NaN).', 'NaN.', 'Strings read as NaN.']),
  fc('fc-dp-10', ['Écrire en JSON / Excel ?', 'JSON / Excel ?', 'Write JSON / Excel?'], ['`to_json` · `to_excel`', '`to_json` · `to_excel`', '`to_json` · `to_excel`']),
  fc('fc-dp-11', ['3 fonctions read_ « binaires » ?', 'Binaires ?', 'Binary readers?'], ['read_parquet, read_feather, read_pickle (aussi hdf, orc).', 'parquet, feather, pickle.', 'parquet, feather, pickle.']),
  fc('fc-dp-12', ['notes_h_s.csv ?', 'notes_h_s ?', 'notes_h_s?'], ['`pd.read_csv(url + "notes_h_s.csv", header=None, skiprows=1)`', 'header=None, skiprows=1', 'header=None, skiprows=1']),
  fc('fc-dp-13', ['Sans decimal="," : dtype ?', 'Bla decimal ?', 'Without decimal?'], ['object (texte) : calculs impossibles.', 'object.', 'object.']),
  fc('fc-dp-14', ['read_csv accepte une URL ?', 'URL ?', 'URL?'], ['Oui : `pd.read_csv(url + "notes.csv")`.', 'Ah.', 'Yes.'])
];

export const reference = [
  ref('r-dp-1', 'pd.read_csv(f, sep=";", decimal=",", header=None, skiprows=1)', ['Lire un CSV', '9ra CSV', 'Read a CSV']),
  ref('r-dp-2', 'pd.read_excel(f, sheet_name=0|"nom"|None, usecols, nrows, index_col)', ['Lire un classeur', '9ra Excel', 'Read Excel']),
  ref('r-dp-3', 'df.to_csv(f, sep=",", decimal=".", index=False)', ['Exporter', 'Export', 'Export']),
  ref('r-dp-4', 'df.to_excel · df.to_json', ['Autres exports', 'Exports', 'Other exports']),
  ref('r-dp-5', 'pd.Series · pd.DataFrame', ['1D · 2D', '1D · 2D', '1D · 2D'])
];
