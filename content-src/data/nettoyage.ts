import { setCtx, single, num, multi, order, ex, fc, ref } from '../lib';
import { DATASET } from './course/nettoyage';
export { chapter } from './course/nettoyage';

setCtx('data', 'nettoyage');

const AGE = [25, 32, 45, 28, 35, 40, 40];
const INCOME = [50000, 75000, 80000, 110000, 120000];
const OUT = [12, 14, 15, 15, 16, 18, 19, 20, 95];

export const questions = [
  single('dn-01', 1, ['Que renvoie `df.isnull().sum()` ?', 'Chnou kayrje3 `df.isnull().sum()` ?', 'What does `df.isnull().sum()` return?'],
    [['Le nombre de valeurs manquantes par colonne', '3adad NaN f kol colonne', 'The number of missing values per column'], ['Le nombre total de lignes', '3adad stour', 'The total number of rows'], ['La somme des valeurs de chaque colonne', 'Majmou3 l qiyam', 'The sum of each column'], ['Les lignes sans NaN', 'Stour bla NaN', 'The rows without NaN']], 0,
    ['`isnull()` met True sur chaque case vide ; `sum()` compte les True (True = 1) colonne par colonne.', 'True = 1, sum kay7seb.', 'True counts as 1, so sum counts NaNs per column.'],
    [['Le nombre de lignes : `len(df)` ou `df.shape[0]`.', 'len(df).', 'Use `len(df)`.'], ['Ça, c\'est `df.sum()`.', 'df.sum().', 'That is `df.sum()`.'], ['Ça, c\'est `df.dropna()`.', 'dropna.', 'That is `df.dropna()`.']], ['nettoyage', 'nan'], DATASET + '\nprint(df.isnull().sum())'),
  num('dn-02', 1, ['Jeu du cours : combien de NaN dans la colonne income ?', 'Ch7al NaN f income ?', 'How many NaN in income?'], 4, 0,
    ['income = 50000, NaN, 75000, 80000, NaN, 110000, 120000, NaN, NaN → **4**.', '4.', '**4**.'], {}, ['nettoyage', 'nan'], { fn: 'arith', args: [4] }),
  num('dn-03', 2, ['Jeu du cours : combien de lignes reste-t-il après `df.dropna()` ?', 'Ch7al str kayb9a mn b3d `dropna()` ?', 'How many rows remain after `df.dropna()`?'], 1, 0,
    ['Seule la ligne 0 (1, 25, 50000, 0.15) est complète → **1 ligne sur 9** : énorme perte d\'information.', 'Ghir str 0 → **1**.', 'Only row 0 is complete → **1 row out of 9**.'],
    { '9': ['dropna() supprime toute ligne contenant au moins un NaN.', 'Kay7iyed ay str fih NaN.', 'dropna() removes any row with a NaN.'], '8': ['8 = après drop_duplicates(), pas dropna().', 'Hada drop_duplicates.', 'That is drop_duplicates().'] }, ['nettoyage', 'suppression'], { fn: 'arith', args: [1] }),
  num('dn-04', 1, ['Moyenne de age (sans les NaN) : 25, 32, 45, 28, 35, 40, 40 ?', 'Moyenne dyal age ?', 'Mean of age (ignoring NaN)?'], 35, 0.001,
    ['245 / 7 = **35** : c\'est la valeur que `fillna(df["age"].mean())` met dans les cases vides.', '245 / 7 = 35.', '245 / 7 = **35**.'],
    { '27.2': ['Tu as divisé par 9 en comptant les NaN comme 0 : pandas ignore les NaN.', 'Ma t7sebch NaN.', 'Do not count NaN as 0.'] }, ['nettoyage', 'imputation'], { fn: 'mean', args: [AGE] }),
  num('dn-05', 2, ['Moyenne de income (valeurs présentes) ?', 'Moyenne dyal income ?', 'Mean of income (present values)?'], 87000, 1,
    ['(50000 + 75000 + 80000 + 110000 + 120000) / 5 = **87 000**.', '435000 / 5.', '435,000 / 5 = **87,000**.'], {}, ['nettoyage', 'imputation'], { fn: 'mean', args: [INCOME] }),
  single('dn-06', 2, ['Quel est l\'inconvénient principal de l\'imputation par la moyenne ?', '3ib dyal imputation b moyenne ?', 'Main drawback of mean imputation?'],
    [['Elle peut réduire la variance et biaiser les corrélations', 'Kat9ss variance w tkhssr corrélations', 'It can reduce variance and bias correlations'], ['Elle supprime des lignes', 'Kat7iyed stour', 'It deletes rows'], ['Elle est très coûteuse en calcul', 'T9ila', 'It is very expensive'], ['Elle ne marche que sur du texte', 'Ghir texte', 'It only works on text']], 0,
    ['Les valeurs ajoutées sont toutes égales à la moyenne → écarts nuls → dispersion sous-estimée (diapo 11).', 'Qiyam = moyenne → variance kat9ss.', 'Imputed values equal the mean → spread underestimated.'],
    [['Elle **conserve** la taille du jeu de données.', 'Katkhlli 7ajm.', 'It keeps the size.'], ['C\'est le défaut du k-NN.', 'Hada k-NN.', 'That is k-NN\'s drawback.'], ['Pour le catégoriel on prend le mode.', 'Mode l catégoriel.', 'Use the mode for categories.']], ['nettoyage', 'imputation']),
  single('dn-07', 2, ['Pour une variable **catégorielle** (ex. ville) avec des valeurs manquantes, on impute plutôt par…', 'Variable catégorielle : imputer b… ?', 'For a categorical variable, impute with…'],
    [['le mode', 'l mode', 'the mode'], ['la moyenne', 'l moyenne', 'the mean'], ['la médiane', 'l médiane', 'the median'], ['0', '0', '0']], 0,
    ['On ne peut pas faire la moyenne de « Rabat » et « Salé » : on prend la catégorie la plus fréquente, `df["ville"].mode()[0]`.', 'Mode = li ktar tkrar.', 'Take the most frequent category.'],
    [['La moyenne n\'existe pas pour du texte.', 'Ma kaynach.', 'No mean for text.'], ['La médiane demande un ordre numérique.', 'Khass tartib.', 'Needs a numeric order.'], ['0 n\'est pas une catégorie.', 'Machi catégorie.', '0 is not a category.']], ['nettoyage', 'imputation']),
  multi('dn-08', 2, ['Imputation avancée : quelles affirmations sont vraies ?', 'Imputation avancée : chnou s7i7 ?', 'Advanced imputation: which are true?'],
    [['La régression prédit la valeur manquante à partir des autres variables', 'Régression katnba2 mn variables khrin', 'Regression predicts from other variables'], ['La régression suppose un modèle linéaire et est sensible aux valeurs extrêmes', 'Linéaire w sensible', 'Regression assumes linearity, outlier-sensitive'], ['k-NN remplace par la moyenne (ou le mode) des k voisins les plus proches', 'k-NN : moyenne dyal k jiran', 'k-NN uses the k nearest neighbours'], ['k-NN est la méthode la moins coûteuse en calcul', 'k-NN rkhissa', 'k-NN is the cheapest']], [0, 1, 2],
    ['Diapos 13 et 14 : régression = relations entre variables mais hypothèse linéaire ; k-NN = plus précis **mais coûteux en calcul**.', 'k-NN ad9a9 walakin t9il.', 'k-NN is more accurate but costly.'],
    [['Faux : k-NN calcule les distances à tous les individus, c\'est coûteux.', 'Ghalat : t9il.', 'False: it is costly.']], ['nettoyage', 'imputation']),
  num('dn-09', 2, ['Série 12 ; 14 ; 15 ; 15 ; 16 ; 18 ; 19 ; 20 ; 95 : IQR = Q3 − Q1 (convention pandas) ?', 'IQR ?', 'IQR (pandas convention)?'], 4, 0.001,
    ['Q1 (position 2) = 15, Q3 (position 6) = 19 → IQR = **4**.', '19 − 15 = 4.', '19 − 15 = **4**.'], {}, ['nettoyage', 'iqr'], { fn: 'iqrBounds', args: [OUT], pick: 'iqr' }),
  num('dn-10', 2, ['Même série : borne haute Q3 + 1,5 × IQR ?', 'Borne haute ?', 'Upper bound?'], 25, 0.001,
    ['19 + 1,5 × 4 = **25** → 95 est aberrante.', '19 + 6 = 25.', '19 + 6 = **25**.'], { '23': ['1,5 × IQR = 6, pas 4.', '1,5 × 4 = 6.', '1.5 × 4 = 6.'] }, ['nettoyage', 'iqr'], { fn: 'iqrBounds', args: [OUT], pick: 'high' }),
  num('dn-11', 2, ['Min-Max sur la colonne 10 ; 20 ; 30 : valeur normalisée de 20 ?', 'Min-Max dyal 20 ?', 'Min-Max value of 20?'], 0.5, 0.001,
    ['(20 − 10) / (30 − 10) = 10/20 = **0,5**.', '0,5.', '**0.5**.'], {}, ['nettoyage', 'normalisation'], { fn: 'minMax', args: [20, 10, 30] }),
  num('dn-12', 2, ['Z-score de 30 dans la série 10 ; 20 ; 30 (σ avec n − 1 comme pandas) ?', 'Z-score dyal 30 ?', 'Z-score of 30?'], 1, 0.001,
    ['μ = 20, σ = 10 → (30 − 20)/10 = **1**.', '(30 − 20)/10.', '(30 − 20)/10 = **1**.'], { '1.22': ['Tu as pris σ avec diviseur n (8,16) : pandas `.std()` utilise n − 1.', 'n − 1.', 'pandas uses n − 1.'] }, ['nettoyage', 'normalisation'], { fn: 'zScore', args: [30, 20, 10] }),
  single('dn-13', 1, ['Quelle commande supprime les doublons ?', 'Ina commande kat7iyed doublons ?', 'Which command removes duplicates?'],
    [['df.drop_duplicates()', 'df.drop_duplicates()', 'df.drop_duplicates()'], ['df.duplicated()', 'df.duplicated()', 'df.duplicated()'], ['df.dropna()', 'df.dropna()', 'df.dropna()'], ['df.unique()', 'df.unique()', 'df.unique()']], 0,
    ['`drop_duplicates()` supprime ; `duplicated()` détecte seulement (True/False).', 'duplicated kaykchef, drop_duplicates kay7iyed.', '`duplicated()` only detects.'],
    [['duplicated() **détecte**, il ne supprime rien.', 'Ghir kaykchef.', 'Only detects.'], ['dropna() concerne les NaN.', 'NaN.', 'For NaN.'], ['unique() existe sur une Series, pas sur un DataFrame.', 'Series.', 'Series only.']], ['nettoyage', 'doublons']),
  order('dn-14', 2, ['Remets dans l\'ordre une démarche de nettoyage raisonnable.', 'Rtteb démarche dyal nettoyage.', 'Order a sensible cleaning process.'],
    [['Lire le fichier et regarder info()', '9ra fichier w info()', 'Read the file and look at info()'], ['Compter les NaN avec isnull().sum()', 'isnull().sum()', 'Count NaN with isnull().sum()'], ['Supprimer les doublons', '7iyed doublons', 'Drop duplicates'], ['Imputer les valeurs manquantes', 'Imputer', 'Impute missing values'], ['Traiter les valeurs aberrantes (IQR)', 'Aberrantes (IQR)', 'Handle outliers (IQR)'], ['Normaliser / standardiser', 'Normaliser', 'Normalise / standardise']],
    ['On regarde avant d\'agir, on enlève les doublons (sinon ils pèsent deux fois dans les moyennes d\'imputation), on remplit, on traite les extrêmes, puis on met à l\'échelle.', 'Chouf, doublons, imputer, aberrantes, échelle.', 'Look, dedupe, impute, outliers, then scale.'], ['nettoyage'])
];

export const exercises = [
  ex('dn-ex1', 2, ['Diagnostic du jeu de données du cours', 'Diagnostic dyal data dyal dars', 'Diagnosing the course dataset'],
    ['Avec le DataFrame de la diapo 8 : (1) donne le nombre de NaN par colonne ; (2) combien de lignes restent après `dropna()` ? après `dropna(axis=1)`, combien de colonnes ? (3) Quelle stratégie proposes-tu ?', 'B DataFrame dyal diapo 8 : (1) NaN f kol colonne ; (2) ch7al str mn b3d `dropna()` ? colonnes mn b3d `dropna(axis=1)` ? (3) chnou tqtare7 ?', 'With the slide-8 DataFrame: (1) NaN per column; (2) rows left after `dropna()`? columns after `dropna(axis=1)`? (3) What strategy do you suggest?'],
    [['Parcours la table ligne par ligne.', 'Chouf str b str.', 'Go row by row.'], ['Une seule ligne n\'a aucun NaN.', 'Ghir str wa7ed kamel.', 'Only one row is complete.']],
    [
      { t: ['Compter les NaN', '7seb NaN', 'Count NaN'], b: ['user_id 0 · age 2 · income 4 · click_rate 2.', 'user_id 0 · age 2 · income 4 · click_rate 2.', 'user_id 0 · age 2 · income 4 · click_rate 2.'], code: 'df.isnull().sum()' },
      { t: ['Supprimer ?', '7iyed ?', 'Delete?'], b: ['`dropna()` → **1 ligne** (la 0). `dropna(axis=1)` → **1 colonne** (user_id). Les deux détruisent presque tout.', '1 str ; 1 colonne.', '**1 row**; **1 column**.'] },
      { t: ['Stratégie', 'Stratégie', 'Strategy'], b: ['`drop_duplicates()` (ligne 8), puis imputer age et click_rate par la **moyenne** (ou médiane), income (44 % manquants) par la **médiane** ou k-NN, ou la supprimer si elle n\'est pas utile à l\'analyse.', 'Doublons, 3ad imputer.', 'Drop duplicates, then impute.'], code: "df = df.drop_duplicates()\ndf['age'] = df['age'].fillna(df['age'].mean())\ndf['click_rate'] = df['click_rate'].fillna(df['click_rate'].mean())\ndf['income'] = df['income'].fillna(df['income'].median())" }
    ],
    ['NaN : 0 / 2 / 4 / 2 ; dropna() → 1 ligne, dropna(axis=1) → 1 colonne ; donc dédoublonner puis imputer.', '0/2/4/2 ; 1 str ; 1 colonne.', 'NaN: 0/2/4/2; 1 row; 1 column; dedupe then impute.'],
    [['Croire que dropna() enlève seulement les NaN et garde le reste de la ligne.', 'dropna kay7iyed str kamel.', 'dropna() removes whole rows.'], ['Imputer avant de supprimer les doublons.', 'Imputer 9bel doublons.', 'Imputing before deduplicating.']],
    { data: DATASET, checks: [{ compute: { fn: 'mean', args: [AGE] }, expect: 35, tolerance: 0.001 }] }),
  ex('dn-ex2', 2, ['Valeurs aberrantes par la méthode IQR', 'Aberrantes b IQR', 'Outliers with the IQR method'],
    ['Notes : 12 ; 14 ; 15 ; 15 ; 16 ; 18 ; 19 ; 20 ; 95. Calcule Q1, Q3, l\'IQR, les bornes et indique les valeurs aberrantes. Écris le code pandas qui les retire.', 'Notes : 12…95. 7seb Q1, Q3, IQR, l 7doud w aberrantes. Kteb code pandas.', 'Marks 12 … 95. Compute Q1, Q3, IQR, bounds and outliers. Write the pandas code that removes them.'],
    [['Positions (n − 1) × 0,25 et (n − 1) × 0,75.', 'Positions 2 w 6.', 'Positions 2 and 6.']],
    [
      { t: ['Quartiles', 'Quartiles', 'Quartiles'], b: ['n = 9 : Q1 = valeur en position 2 = **15** ; Q3 = position 6 = **19**.', 'Q1 = 15 ; Q3 = 19.', 'Q1 = **15**; Q3 = **19**.'] },
      { t: ['IQR et bornes', 'IQR w 7doud', 'IQR and bounds'], b: ['IQR = 4 ; [15 − 6 ; 19 + 6] = **[9 ; 25]**.', '[9 ; 25].', '**[9 ; 25]**.'] },
      { t: ['Décision', 'Qarar', 'Decision'], b: ['**95** est aberrante ; on la supprime (ou on la corrige si c\'est une faute de saisie).', '95 aberrante.', '**95** is an outlier.'], code: "Q1, Q3 = df['note'].quantile([0.25, 0.75])\nIQR = Q3 - Q1\ndf = df[df['note'].between(Q1 - 1.5*IQR, Q3 + 1.5*IQR)]" }
    ],
    ['Q1 = 15, Q3 = 19, IQR = 4, intervalle [9 ; 25] : 95 est la seule valeur aberrante.', '95 aberrante.', 'Q1 = 15, Q3 = 19, IQR = 4, [9 ; 25]: 95 is the only outlier.'],
    [['Oublier le facteur 1,5.', 'Nsit 1,5.', 'Forgetting the 1.5 factor.'], ['Calculer les quartiles sans trier.', 'Bla tartib.', 'Not sorting.']],
    { checks: [
      { compute: { fn: 'iqrBounds', args: [OUT], pick: 'low' }, expect: 9, tolerance: 0.001 },
      { compute: { fn: 'iqrBounds', args: [OUT], pick: 'high' }, expect: 25, tolerance: 0.001 },
      { compute: { fn: 'iqrBounds', args: [OUT], pick: 'outliers' }, expect: 1, tolerance: 0 }
    ] }),
  ex('dn-ex3', 3, ['Normaliser et standardiser une colonne', 'Normaliser w standardiser', 'Normalise and standardise a column'],
    ['La colonne age après imputation par la moyenne vaut : 25 ; 32 ; 35 ; 45 ; 28 ; 35 ; 35 ; 40 ; 40. (1) Donne la valeur Min-Max de 35 et de 32. (2) Pourquoi l\'imputation a-t-elle placé deux fois 35 ? (3) Écris le code Z-score.', 'age mn b3d imputation : 25 ; 32 ; 35 ; 45 ; 28 ; 35 ; 35 ; 40 ; 40. (1) Min-Max dyal 35 w 32. (2) 3lach 35 jouj merrat ? (3) Code Z-score.', 'Age after mean imputation: 25 ; 32 ; 35 ; 45 ; 28 ; 35 ; 35 ; 40 ; 40. (1) Min-Max of 35 and 32. (2) Why two extra 35s? (3) Write the Z-score code.'],
    [['min = 25, max = 45.', 'min = 25, max = 45.', 'min = 25, max = 45.']],
    [
      { t: ['Min-Max', 'Min-Max', 'Min-Max'], b: ['max − min = 20. 35 → (35 − 25)/20 = **0,5** ; 32 → 7/20 = **0,35**.', '35 → 0,5 ; 32 → 0,35.', '35 → **0.5**; 32 → **0.35**.'] },
      { t: ['Pourquoi 35', '3lach 35', 'Why 35'], b: ['Les lignes 2 et 5 étaient NaN et ont reçu la moyenne des 7 autres valeurs (245/7 = 35).', 'Kanou NaN w khdaw moyenne.', 'They were NaN and received the mean.'] },
      { t: ['Code Z-score', 'Code Z-score', 'Z-score code'], b: ['Formule de la diapo 22.', 'Diapo 22.', 'Slide 22 formula.'], code: "df['age_z'] = (df['age'] - df['age'].mean()) / df['age'].std()" }
    ],
    ['Min-Max(35) = 0,5 ; Min-Max(32) = 0,35 ; z = (age − moyenne) / écart-type.', '0,5 ; 0,35.', '0.5; 0.35.'],
    [['Diviser par max au lieu de max − min.', 'Q9sem 3la max.', 'Dividing by max.']],
    { checks: [{ compute: { fn: 'minMax', args: [32, 25, 45] }, expect: 0.35, tolerance: 0.001 }] })
];

export const flashcards = [
  fc('dn-fc1', ['3 causes de données manquantes', '3 asbab dyal NaN', '3 causes of missing data'], ['Erreurs de saisie/mesure, non-réponses, problèmes techniques (capteurs, BD).', 'Ghalat, ma jawbouch, machakil techniques.', 'Entry errors, non-response, technical problems.']),
  fc('dn-fc2', ['Compter les NaN par colonne', '7seb NaN', 'Count NaN per column'], ['`df.isnull().sum()`', '`df.isnull().sum()`', '`df.isnull().sum()`']),
  fc('dn-fc3', ['dropna() vs dropna(axis=1)', 'dropna() vs axis=1', 'dropna() vs dropna(axis=1)'], ['Lignes avec NaN (perte d\'info) vs colonnes avec NaN (si > 40 % et non importantes).', 'Stour vs colonnes.', 'Rows vs columns.']),
  fc('dn-fc4', ['Imputation simple : laquelle pour quoi ?', 'Imputation : ina l ina ?', 'Simple imputation: which for what?'], ['Moyenne → continue ; mode → catégorielle ; médiane si valeurs extrêmes ; valeur fixe possible.', 'Moyenne / mode / médiane.', 'Mean → continuous; mode → categorical; median with extremes.']),
  fc('dn-fc5', ['Défaut de l\'imputation par la moyenne', '3ib dyal moyenne', 'Drawback of mean imputation'], ['Réduit la variance et biaise les corrélations.', 'Kat9ss variance.', 'Reduces variance, biases correlations.']),
  fc('dn-fc6', ['Imputation par régression', 'Imputation b régression', 'Regression imputation'], ['Prédit la valeur à partir des autres variables ; suppose un modèle linéaire, sensible aux extrêmes.', 'Katnba2 ; linéaire.', 'Predicts from other variables; linear, outlier-sensitive.']),
  fc('dn-fc7', ['Imputation k-NN', 'k-NN', 'k-NN imputation'], ['Moyenne (ou mode) des k voisins les plus proches ; plus précis mais coûteux.', 'k jiran ; ad9a9 walakin t9il.', 'Mean of k nearest neighbours; accurate but costly.']),
  fc('dn-fc8', ['Règle IQR', '9a3idat IQR', 'IQR rule'], ['Aberrante si x < Q1 − 1,5·IQR ou x > Q3 + 1,5·IQR, avec IQR = Q3 − Q1.', 'Bra [Q1 − 1,5 IQR ; Q3 + 1,5 IQR].', 'Outside [Q1 − 1.5 IQR; Q3 + 1.5 IQR].']),
  fc('dn-fc9', ['Min-Max', 'Min-Max', 'Min-Max'], ['$X_{norm} = \\frac{X - X_{min}}{X_{max} - X_{min}}$ → [0, 1].', '[0, 1].', '→ [0, 1].']),
  fc('dn-fc10', ['Z-score', 'Z-score', 'Z-score'], ['$X_z = \\frac{X - \\mu}{\\sigma}$ → moyenne 0, écart-type 1.', 'Moyenne 0, σ 1.', 'Mean 0, SD 1.']),
  fc('dn-fc11', ['Doublons', 'Doublons', 'Duplicates'], ['Détecter : `df[df.duplicated()]` ; supprimer : `df.drop_duplicates()`.', 'duplicated / drop_duplicates.', 'duplicated / drop_duplicates.'])
];

export const reference = [
  ref('dn-r1', 'df.isnull()  ·  df.isnull().sum()', ['Détecter / compter les valeurs manquantes', 'Kchef / 7seb NaN', 'Detect / count missing values']),
  ref('dn-r2', 'df.dropna()  ·  df.dropna(axis=1)', ['Supprimer les lignes / colonnes contenant des NaN', '7iyed stour / colonnes', 'Drop rows / columns with NaN']),
  ref('dn-r3', "df['c'].fillna(df['c'].mean())", ['Imputer par la moyenne (ou .median(), .mode()[0], une valeur fixe)', 'Imputer', 'Impute with the mean (or median, mode, fixed value)']),
  ref('dn-r4', 'IQR = Q3 − Q1 ; aberrante si x ∉ [Q1 − 1,5·IQR ; Q3 + 1,5·IQR]', ['Méthode IQR', 'Méthode IQR', 'IQR method'], "df['c'].quantile([0.25, 0.75])"),
  ref('dn-r5', 'Xnorm = (X − Xmin) / (Xmax − Xmin)', ['Normalisation Min-Max', 'Min-Max', 'Min-Max normalisation'], "(df - df.min()) / (df.max() - df.min())"),
  ref('dn-r6', 'Xz = (X − μ) / σ', ['Standardisation Z-score', 'Z-score', 'Z-score standardisation'], '(df - df.mean()) / df.std()'),
  ref('dn-r7', 'df.duplicated()  ·  df.drop_duplicates()', ['Détecter / supprimer les doublons', 'Doublons', 'Detect / drop duplicates'])
];
