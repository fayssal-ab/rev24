import { L, h, p, def, plain, example, formula, steps, tip, trap, exam, table, code, quiz } from '../../lib';
import type { Chapter } from '../../../src/lib/schema';

/** Chap 2 — Nettoyage et prétraitement des données (Pr. A. Kadiri, 19 octobre 2026). Dataset copied from the slides. */
export const DATASET = `import pandas as pd
import numpy as np

data = {
    'user_id':    [1, 2, 3, 4, 5, 6, 7, 8, 8],
    'age':        [25, 32, np.nan, 45, 28, np.nan, 35, 40, 40],
    'income':     [50000, np.nan, 75000, 80000, np.nan, 110000, 120000, np.nan, np.nan],
    'click_rate': [0.15, 0.22, 0.18, np.nan, 0.25, 0.30, np.nan, 0.12, 0.12],
}
df = pd.DataFrame(data)`;

export const chapter: Chapter = {
  id: 'nettoyage',
  module: 'data',
  order: 4,
  title: L(['Chap 2 — Nettoyage et prétraitement des données', 'Fasl 2 — Nettoyage w prétraitement dyal data', 'Ch. 2 — Data cleaning and preprocessing']),
  summary: L([
    'Valeurs manquantes (détection, suppression, imputation par moyenne/médiane/mode, valeur fixe, régression, k-NN), valeurs aberrantes (méthode IQR), normalisation Min-Max, standardisation Z-score et doublons — sur le jeu de données du cours.',
    'Valeurs manquantes (kachf, 7dif, imputation b moyenne/médiane/mode, qima tabta, régression, k-NN), valeurs aberrantes (IQR), Min-Max, Z-score w doublons — 3la data dyal dars.',
    'Missing values (detection, deletion, mean/median/mode imputation, fixed value, regression, k-NN), outliers (IQR method), Min-Max normalisation, Z-score standardisation and duplicates — on the course dataset.'
  ]),
  estimatedMinutes: 45,
  sections: [
    h(['1. Les données manquantes : c\'est quoi, et pourquoi c\'est grave ?', '1. Données manquantes : chnou homa w 3lach khatrin ?', '1. Missing data: what they are and why they matter']),
    def([
      'Les **données manquantes** (*missing data*) sont des **valeurs absentes** dans un jeu de données. Elles peuvent résulter :\n- d\'**erreurs de saisie ou de mesure** ;\n- de **non-réponses** dans des enquêtes ;\n- de **problèmes techniques** (capteurs, bases de données, etc.).\n\nLeur traitement est une **étape essentielle du prétraitement**, car elles peuvent **biaiser les analyses statistiques** ou **fausser les modèles d\'apprentissage automatique**.',
      '**Données manquantes** (*missing data*) homa **qiyam na9sin** f data. Kayjiw mn :\n- **ghalat f saisie wla f l 9iyas** ;\n- **ma jawbouch** f enquête ;\n- **machakil techniques** (capteurs, bases de données…).\n\nMo3alajathom **étape asasiya f prétraitement**, 7it ymken **ykhssrou t7lil statistique** wla **ykhllo modèles dyal ML ghaltin**.',
      '**Missing data** are **absent values** in a dataset. They can come from:\n- **entry or measurement errors**;\n- **non-responses** in surveys;\n- **technical problems** (sensors, databases, etc.).\n\nHandling them is an **essential preprocessing step**, because they can **bias statistical analyses** or **distort machine-learning models**.'
    ]),
    plain(['Dans pandas, une case vide s\'appelle **NaN** (*Not a Number*). On l\'écrit `np.nan` quand on crée les données soi-même.', 'F pandas, khana khawya smitha **NaN** (*Not a Number*). Kanktbouha `np.nan` mli kansaybou data b yddina.', 'In pandas, an empty cell is called **NaN** (*Not a Number*). We write `np.nan` when creating data ourselves.']),

    h(['2. Le jeu de données du cours', '2. Data dyal dars', '2. The course dataset']),
    code(DATASET + '\n\nprint("Valeurs manquantes :")\nprint(df.isnull())        # True là où la valeur manque\nprint(df.isnull().sum())  # nombre de NaN par colonne', 'python', ['Exactement le code de la diapo 8 du cours.', 'Bdbt l code dyal diapo 8.', 'Exactly the code of slide 8.']),
    table([['Ligne', 'Str', 'Row'], ['user_id', 'user_id', 'user_id'], ['age', 'age', 'age'], ['income', 'income', 'income'], ['click_rate', 'click_rate', 'click_rate']], [
      ['0', '1', '25', '50000', '0.15'],
      ['1', '2', '32', 'NaN', '0.22'],
      ['2', '3', 'NaN', '75000', '0.18'],
      ['3', '4', '45', '80000', 'NaN'],
      ['4', '5', '28', 'NaN', '0.25'],
      ['5', '6', 'NaN', '110000', '0.30'],
      ['6', '7', '35', '120000', 'NaN'],
      ['7', '8', '40', 'NaN', '0.12'],
      ['8', '8', '40', 'NaN', '0.12']
    ]),
    steps(['Lire le résultat de df.isnull().sum()', '9ra natija dyal df.isnull().sum()', 'Reading df.isnull().sum()'], [
      { t: ['isnull() transforme chaque case en True / False', 'isnull() kaybeddel kol khana l True / False', 'isnull() turns each cell into True / False'], b: ['**True** = la valeur manque, **False** = elle est présente.', '**True** = na9sa, **False** = kayna.', '**True** = missing, **False** = present.'] },
      { t: ['sum() compte les True', 'sum() kay7seb True', 'sum() counts the Trues'], b: ['En Python, True vaut 1 et False vaut 0 : la somme d\'une colonne = **nombre de NaN** dans cette colonne.', 'F Python, True = 1 w False = 0 : majmou3 colonne = **3adad NaN**.', 'In Python True is 1 and False is 0: the column sum = **number of NaN**.'] },
      { t: ['Résultat', 'Natija', 'Result'], b: ['`user_id 0` · `age 2` · `income 4` · `click_rate 2`. La colonne **income** est la plus incomplète (4 / 9 ≈ **44 %** manquants).', '`user_id 0` · `age 2` · `income 4` · `click_rate 2`. **income** hiya li na9sa ktar (4/9 ≈ **44 %**).', '`user_id 0` · `age 2` · `income 4` · `click_rate 2`. **income** is the most incomplete (4 / 9 ≈ **44 %** missing).'], why: ['Le cours dit qu\'on supprime une variable si elle a **plus de 40 %** de valeurs manquantes : income est juste au-dessus de ce seuil.', 'Dars kaygoul n7iydou variable ila fiha **ktar mn 40 %** na9ss : income fou9 had l 7add.', 'The course says to drop a variable with **more than 40 %** missing values: income is just above that threshold.'] }
    ]),

    h(['3. Méthode 1 : supprimer', '3. Méthode 1 : 7dif', '3. Method 1: delete']),
    table([['Méthode', 'Méthode', 'Method'], ['Code', 'Code', 'Code'], ['Avantage', 'Mzya', 'Pro'], ['Inconvénient', '3ib', 'Con']], [
      [['Suppression des **lignes** (*listwise deletion*)', '7dif **stour**', 'Delete **rows** (*listwise deletion*)'], 'df.dropna()', ['Simple à mettre en œuvre', 'Sahla', 'Simple'], ['**Risque de perte d\'informations importantes**', '**Ymken tdi3 ma3loumat mohimma**', '**Risk of losing important information**']],
      [['Suppression des **colonnes** (*variable deletion*)', '7dif **colonnes**', 'Delete **columns** (*variable deletion*)'], 'df.dropna(axis=1)', ['Enlève les variables trop incomplètes (ex. > 40 % de NaN)', 'Kat7iyed variables na9sin bzaf (> 40 %)', 'Removes too-incomplete variables (e.g. > 40 % NaN)'], ['**À éviter si la variable est importante** pour l\'analyse', '**Ma tdirhach ila variable mohimma**', '**Avoid if the variable matters** for the analysis']]
    ]),
    steps(['Que donne dropna() sur notre jeu de données ?', 'Chnou kay3ti dropna() 3la data dyalna ?', 'What does dropna() give on our dataset?'], [
      { t: ['dropna() garde seulement les lignes complètes', 'dropna() kaykhlli ghir stour kamlin', 'dropna() keeps only complete rows'], b: ['On parcourt les 9 lignes : seule la **ligne 0** (1, 25, 50000, 0.15) n\'a aucun NaN. Toutes les autres ont au moins une case vide.', 'Kanchoufou 9 stour : ghir **str 0** (1, 25, 50000, 0.15) li ma fih 7ta NaN.', 'Going through the 9 rows: only **row 0** (1, 25, 50000, 0.15) has no NaN.'] },
      { t: ['Résultat', 'Natija', 'Result'], b: ['Il reste **1 ligne sur 9** : on a jeté **89 %** des données !', 'Kayb9a **str wa7ed mn 9** : 7iydna **89 %** mn data !', '**1 row out of 9** remains: we threw away **89 %** of the data!'], why: ['C\'est exactement le « risque de perte d\'informations » de la diapo : quand les NaN sont éparpillés dans plusieurs colonnes, dropna() vide le tableau.', 'Hada howa « risque de perte d\'informations » : mli NaN mfrr9in f bzaf d colonnes, dropna() kaykhwi tableau.', 'This is exactly the "information loss risk" on the slide: when NaNs are spread over several columns, dropna() empties the table.'] },
      { t: ['Et dropna(axis=1) ?', 'W dropna(axis=1) ?', 'And dropna(axis=1)?'], b: ['`axis=1` supprime les **colonnes** qui contiennent au moins un NaN : il ne reste que **user_id**. Encore pire. On préfère donc l\'**imputation**.', '`axis=1` kay7iyed **colonnes** li fihom NaN : kayb9a ghir **user_id**. Ktar khayba. Donc kanfdlou **imputation**.', '`axis=1` drops **columns** with at least one NaN: only **user_id** remains. Even worse. So we prefer **imputation**.'] }
    ]),

    h(['4. Méthode 2 : l\'imputation simple (remplacer par une valeur)', '4. Méthode 2 : imputation simple (3awed b qima)', '4. Method 2: simple imputation (replace with a value)']),
    p([
      '**Imputer** = remplir la case vide avec une valeur raisonnable. Règle du cours : **moyenne** pour les variables **continues**, **mode** pour les variables **catégorielles** (la médiane si la variable contient des valeurs extrêmes).',
      '**Imputer** = n3mrou khana khawya b qima m3qoula. 9a3idat dars : **moyenne** l variables **continues**, **mode** l variables **catégorielles** (médiane ila kaynin qiyam kbar bzaf).',
      '**Impute** = fill the empty cell with a sensible value. Course rule: **mean** for **continuous** variables, **mode** for **categorical** ones (median when the variable has extreme values).'
    ]),
    steps(['Imputer la colonne age par la moyenne', 'Imputer age b l moyenne', 'Imputing age with the mean'], [
      { t: ['Prendre les valeurs présentes', 'Khod l qiyam li kaynin', 'Take the present values'], b: ['age sans les NaN : 25, 32, 45, 28, 35, 40, 40 (n = 7). pandas ignore automatiquement les NaN dans `.mean()`.', 'age bla NaN : 25, 32, 45, 28, 35, 40, 40 (n = 7). pandas kayfout NaN f `.mean()`.', 'age without NaN: 25, 32, 45, 28, 35, 40, 40 (n = 7). pandas skips NaN in `.mean()`.'] },
      { t: ['Calculer la moyenne', '7seb l moyenne', 'Compute the mean'], b: ['Somme = 245, donc moyenne = **35**.', 'Majmou3 = 245, donc moyenne = **35**.', 'Sum = 245, so mean = **35**.'], tex: '\\bar x = \\frac{25+32+45+28+35+40+40}{7} = \\frac{245}{7} = 35' },
      { t: ['Remplir', '3mmer', 'Fill'], b: ['Les lignes 2 et 5 reçoivent **35**.', 'Str 2 w 5 kayakhdou **35**.', 'Rows 2 and 5 get **35**.'], code: "df['age'] = df['age'].fillna(df['age'].mean())\n# écriture de la diapo :\n# df['age'].fillna(df['age'].mean(), inplace=True)" },
      { t: ['Médiane : même idée', 'Médiane : nefs l fikra', 'Median: same idea'], b: ['Triées : 25, 28, 32, **35**, 40, 40, 45 → médiane = **35** aussi. Pour income : moyenne = (50000 + 75000 + 80000 + 110000 + 120000) / 5 = **87 000**.', 'Mrttbin : 25, 28, 32, **35**, 40, 40, 45 → médiane = **35**. L income : moyenne = **87 000**.', 'Sorted: 25, 28, 32, **35**, 40, 40, 45 → median = **35** too. For income: mean = **87,000**.'], code: "df['income'] = df['income'].fillna(df['income'].median())\n# variable catégorielle : le mode\n# df['ville'] = df['ville'].fillna(df['ville'].mode()[0])" }
    ]),
    table([['Critère', 'Mi3yar', 'Criterion'], ['Avantages', 'Mzayat', 'Pros'], ['Inconvénients', '3oyoub', 'Cons']], [
      [['Moyenne / médiane / mode', 'Moyenne / médiane / mode', 'Mean / median / mode'], ['Facile à appliquer, **conserve la taille** du jeu de données', 'Sahla, **katkhlli 7ajm data**', 'Easy, **keeps the dataset size**'], ['**Peut réduire la variance et biaiser les corrélations**', '**Kat9ss variance w ymken tkhssr corrélations**', '**Can reduce variance and bias correlations**']],
      [['Valeur fixe', 'Qima tabta', 'Fixed value'], ['Simple à interpréter', 'Sahla tfhamha', 'Simple to interpret'], ['**Peut introduire des valeurs artificielles**', '**Ymken tdkhel qiyam msna3in**', '**Can introduce artificial values**']]
    ]),
    code("df['age'].fillna(15, inplace=True)   # valeur fixe (diapo 12)", 'python'),
    trap([
      'Pourquoi l\'imputation par la moyenne **réduit la variance** ? Tu ajoutes des valeurs **exactement égales à la moyenne** : leurs écarts valent 0, donc la somme des carrés des écarts n\'augmente pas alors que n augmente. Les données paraissent plus « serrées » qu\'en réalité.',
      '3lach imputation b moyenne **kat9ss variance** ? Katzid qiyam **= l moyenne bdbt** : l far9 dyalhom = 0, donc majmou3 l mourabba3at ma kayzidch walakin n kayzid. Data katban « mjm3a » ktar mn l 7a9i9a.',
      'Why does mean imputation **reduce the variance**? You add values **exactly equal to the mean**: their deviations are 0, so the sum of squared deviations does not grow while n does. The data look "tighter" than they really are.'
    ]),

    h(['5. Méthode 3 : l\'imputation avancée', '5. Méthode 3 : imputation avancée', '5. Method 3: advanced imputation']),
    table([['Méthode', 'Méthode', 'Method'], ['Principe', 'Fikra', 'Idea'], ['Point fort', 'Mzya', 'Strength'], ['Limite', '3ib', 'Limit']], [
      [['**Régression**', '**Régression**', '**Regression**'], ['On **prédit** la valeur manquante à partir des autres variables (ex. income à partir de age)', 'Kan**tnab2ou** b l qima mn variables khrin', '**Predict** the missing value from the other variables'], ['Utilise les **relations entre variables**', 'Katst3mel **3ala9at** bin variables', 'Uses **relationships between variables**'], ['Suppose un **modèle linéaire**, **sensible aux valeurs extrêmes**', 'Katftared **modèle linéaire**, kat2tharr b **qiyam kbar**', 'Assumes a **linear model**, **sensitive to extreme values**']],
      [['**k plus proches voisins (k-NN)**', '**k-NN**', '**k nearest neighbours (k-NN)**'], ['Remplace par la **moyenne (ou le mode) des k individus les plus proches**', 'Kat3awed b **moyenne (wla mode) dyal k li 9rab**', 'Replace with the **mean (or mode) of the k closest individuals**'], ['**Plus précis**', '**Ad9a9**', '**More accurate**'], ['**Coûteux en calcul**', '**T9il f 7sab**', '**Computationally expensive**']]
    ]),
    example([
      '**k-NN avec k = 2** : il manque l\'âge de l\'utilisateur 3 (income 75 000). Parmi les utilisateurs dont l\'âge et l\'income sont connus, les deux plus proches en income sont l\'utilisateur 4 (80 000, écart 5 000, âge 45) et l\'utilisateur 1 (50 000, écart 25 000, âge 25). Âge imputé = (45 + 25) / 2 = **35**. Avec sklearn : `KNNImputer(n_neighbors=2)`.',
      '**k-NN b k = 2** : 3omr dyal user 3 na9ss (income 75 000). Jouj li income dyalhom 9rib : user 4 (80 000, 45 3am) w user 1 (50 000, 25 3am) (user 2 income dyalo na9ss). 3omr = (45 + 25) / 2 = **35**. B sklearn : `KNNImputer(n_neighbors=2)`.',
      '**k-NN with k = 2**: user 3\'s age is missing (income 75,000). The two users with the closest income are user 4 (80,000, age 45) and user 1 (50,000, age 25) (user 2\'s income is missing). Imputed age = (45 + 25) / 2 = **35**. With sklearn: `KNNImputer(n_neighbors=2)`.'
    ]),
    tip(['Le cours précise que d\'autres méthodes seront vues dans un **mini-projet** : retiens au minimum les 6 de ce chapitre (2 suppressions, moyenne/médiane/mode, valeur fixe, régression, k-NN).', 'Dars kaygoul bli méthodes khrin ghadi tchoufhom f **mini-projet** : 7fed 3la l a9al had 6.', 'The course says other methods will come in a **mini-project**: know at least these 6.']),

    h(['6. Les valeurs aberrantes et la méthode IQR', '6. Valeurs aberrantes w méthode IQR', '6. Outliers and the IQR method']),
    def([
      'Les **valeurs aberrantes** (*outliers*) sont des valeurs **très éloignées de la norme** et **non représentatives** des données. Elles peuvent résulter d\'une **faute de saisie** ou de **circonstances exceptionnelles**. Elles risquent de **fausser les analyses ou les modèles**.',
      '**Valeurs aberrantes** (*outliers*) homa qiyam **b3ad bzaf 3la l 3adi** w **ma kayemttlouch** data. Kayjiw mn **ghalat f saisie** wla **dorouf istitna2iya**. Ymken **ykhssrou t7lil wla modèles**.',
      '**Outliers** are values **very far from the norm** and **not representative** of the data. They can come from a **typing error** or **exceptional circumstances**. They can **distort analyses or models**.'
    ]),
    formula('IQR = Q_3 - Q_1 \\qquad x \\text{ aberrante si } x \\notin [\\,Q_1 - 1{,}5\\,IQR \\; ; \\; Q_3 + 1{,}5\\,IQR\\,]', ['La règle exacte de la diapo 18. Q1 et Q3 sont les quartiles (voir le Rappel).', '9a3ida dyal diapo 18. Q1 w Q3 homa quartiles (chouf Rappel).', 'The exact rule from slide 18. Q1 and Q3 are the quartiles (see the Reminder).']),
    steps(['Méthode IQR sur les notes 12 ; 14 ; 15 ; 15 ; 16 ; 18 ; 19 ; 20 ; 95', 'IQR 3la 12 ; 14 ; 15 ; 15 ; 16 ; 18 ; 19 ; 20 ; 95', 'IQR on 12 ; 14 ; 15 ; 15 ; 16 ; 18 ; 19 ; 20 ; 95'], [
      { t: ['Trier et compter', 'Rtteb w 7seb', 'Sort and count'], b: ['La série est déjà triée, n = 9. Positions 0 à 8.', 'Mrttba, n = 9. Positions mn 0 l 8.', 'Already sorted, n = 9. Positions 0 to 8.'] },
      { t: ['Q1', 'Q1', 'Q1'], b: ['Position (n − 1) × 0,25 = 8 × 0,25 = **2** → Q1 = **15**.', 'Position 8 × 0,25 = 2 → Q1 = **15**.', 'Position 8 × 0.25 = 2 → Q1 = **15**.'] },
      { t: ['Q3', 'Q3', 'Q3'], b: ['Position 8 × 0,75 = **6** → Q3 = **19**.', 'Position 6 → Q3 = **19**.', 'Position 6 → Q3 = **19**.'] },
      { t: ['IQR et bornes', 'IQR w l 7doud', 'IQR and bounds'], b: ['IQR = 19 − 15 = **4**. Borne basse = 15 − 1,5 × 4 = **9**. Borne haute = 19 + 1,5 × 4 = **25**.', 'IQR = **4**. T7t = 15 − 6 = **9**. Fou9 = 19 + 6 = **25**.', 'IQR = **4**. Lower = 15 − 6 = **9**. Upper = 19 + 6 = **25**.'], tex: '[\\,15 - 6 \\; ; \\; 19 + 6\\,] = [\\,9 \\; ; \\; 25\\,]' },
      { t: ['Conclusion', 'Conclusion', 'Conclusion'], b: ['**95 > 25 → valeur aberrante** (probablement une faute de frappe pour 9,5 ou 15). Toutes les autres sont dans l\'intervalle.', '**95 > 25 → aberrante** (ghaliban ghalat f l ktaba). L ba9i dakhel.', '**95 > 25 → outlier** (probably a typo). All the others are inside.'] }
    ]),
    code(`x = df['note']
Q1, Q3 = x.quantile(0.25), x.quantile(0.75)
IQR = Q3 - Q1
bas, haut = Q1 - 1.5 * IQR, Q3 + 1.5 * IQR
aberrantes = df[(x < bas) | (x > haut)]     # les lignes aberrantes
df_propre = df[(x >= bas) & (x <= haut)]    # on les retire`, 'python'),
    tip(['Sur un **boxplot** (Chap 4), les « moustaches » s\'arrêtent justement à Q1 − 1,5 IQR et Q3 + 1,5 IQR : les points dessinés au-delà sont les valeurs aberrantes.', 'F **boxplot** (Fasl 4), « moustaches » kaywqfou f Q1 − 1,5 IQR w Q3 + 1,5 IQR : les points li bra homa aberrantes.', 'On a **boxplot** (Ch. 4), the whiskers stop exactly at Q1 − 1.5 IQR and Q3 + 1.5 IQR: points drawn beyond are outliers.']),

    h(['7. Normalisation et standardisation', '7. Normalisation w standardisation', '7. Normalisation and standardisation']),
    plain([
      'Concept du cours : ramener les variables **à une même échelle**, important pour de nombreux algorithmes d\'apprentissage. Sans ça, income (des dizaines de milliers) écrase age (des dizaines) dans tout calcul de distance (k-NN, clustering…).',
      'Fikra dyal dars : nrj3ou variables **l nefs l échelle**, mohim l bzaf d algorithmes. Bla hadchi, income (3acharat l alaf) kaytghla 3la age (3acharat) f ay 7sab dyal distance (k-NN, clustering…).',
      'Course idea: bring variables **to the same scale**, important for many learning algorithms. Without it, income (tens of thousands) crushes age (tens) in any distance computation (k-NN, clustering…).'
    ]),
    formula('X_{norm} = \\frac{X - X_{min}}{X_{max} - X_{min}} \\in [0, 1] \\qquad\\qquad X_z = \\frac{X - \\mu}{\\sigma}', [
      '**Min-Max** (gauche) : tout passe entre 0 et 1. **Z-score** (droite) : moyenne 0 et écart-type 1, où μ est la moyenne et σ l\'écart-type.',
      '**Min-Max** : kolchi bin 0 w 1. **Z-score** : moyenne 0 w écart-type 1 (μ = moyenne, σ = écart-type).',
      '**Min-Max** (left): everything goes between 0 and 1. **Z-score** (right): mean 0 and standard deviation 1, where μ is the mean and σ the standard deviation.'
    ]),
    steps(['Sur la série 10 ; 20 ; 30', '3la série 10 ; 20 ; 30', 'On the series 10 ; 20 ; 30'], [
      { t: ['Min-Max', 'Min-Max', 'Min-Max'], b: ['min = 10, max = 30, max − min = 20. Donc 10 → 0/20 = **0** ; 20 → 10/20 = **0,5** ; 30 → 20/20 = **1**.', '10 → **0** ; 20 → **0,5** ; 30 → **1**.', '10 → **0**; 20 → **0.5**; 30 → **1**.'] },
      { t: ['Z-score : moyenne et écart-type', 'Z-score : moyenne w écart-type', 'Z-score: mean and SD'], b: ['μ = 20. Avec pandas `.std()` (diviseur n − 1) : écarts −10, 0, 10 → carrés 100, 0, 100 → 200 / 2 = 100 → σ = **10**.', 'μ = 20 ; σ (pandas, n − 1) = **10**.', 'μ = 20; σ (pandas, n − 1) = **10**.'] },
      { t: ['Z-score : résultat', 'Z-score : natija', 'Z-score: result'], b: ['10 → (10 − 20)/10 = **−1** ; 20 → **0** ; 30 → **+1**. Une valeur z = 2 signifie « 2 écarts-types au-dessus de la moyenne ».', '10 → **−1** ; 20 → **0** ; 30 → **+1**.', '10 → **−1**; 20 → **0**; 30 → **+1**. z = 2 means "2 standard deviations above the mean".'] }
    ]),
    code(`sl = df.copy()
for c in sl.columns:                     # Min-Max (diapo 21)
    sl[c] = (sl[c] - sl[c].min()) / (sl[c].max() - sl[c].min())
print(sl)
sl.plot(kind='bar'); plt.show()

sl = df.copy()
for c in sl.columns:                     # Z-score (diapo 22)
    sl[c] = (sl[c] - sl[c].mean()) / sl[c].std()
print(sl)
sl.plot(kind='bar'); plt.show()`, 'python', ['Le code des diapos 21 et 22 (avec `import matplotlib.pyplot as plt`).', 'Code dyal diapos 21 w 22.', 'The code from slides 21 and 22.']),
    table([['Critère', 'Mi3yar', 'Criterion'], ['Min-Max', 'Min-Max', 'Min-Max'], ['Z-score', 'Z-score', 'Z-score']], [
      [['Résultat', 'Natija', 'Result'], ['Entre 0 et 1', 'Bin 0 w 1', 'Between 0 and 1'], ['Moyenne 0, écart-type 1 (pas borné)', 'Moyenne 0, σ 1', 'Mean 0, SD 1 (unbounded)']],
      [['Sensible aux aberrantes', 'Kayt2tharr b aberrantes', 'Outlier-sensitive'], ['**Très** (un seul max extrême écrase tout)', '**Bzaf**', '**Very** (one extreme max squashes everything)'], ['Moins', '9ell', 'Less']],
      [['Quand l\'utiliser', 'Imta', 'When'], ['Bornes connues, images, réseaux de neurones', 'Bornes m3roufin', 'Known bounds, images, neural nets'], ['Données ≈ normales, k-NN, ACP, régression', 'Data ≈ normale, k-NN, ACP', '≈ normal data, k-NN, PCA, regression']]
    ]),

    h(['8. Les doublons', '8. Doublons', '8. Duplicates']),
    steps(['Détecter puis supprimer les doublons', 'Kchef w 7iyed doublons', 'Detect then remove duplicates'], [
      { t: ['Détection', 'Kachf', 'Detection'], b: ['`df.duplicated()` renvoie True pour chaque ligne **identique à une ligne déjà vue**. Dans notre jeu, la **ligne 8** (8, 40, NaN, 0.12) répète la ligne 7 → 1 doublon. (pandas considère deux NaN comme égaux ici.)', '`df.duplicated()` kayrje3 True l kol str **b7al chi str fat**. Hna **str 8** kay3awed str 7 → doublon wa7ed.', '`df.duplicated()` returns True for each row **identical to an earlier one**. Here **row 8** (8, 40, NaN, 0.12) repeats row 7 → 1 duplicate.'], code: 'duplicate_rows = df[df.duplicated()]' },
      { t: ['Suppression', '7dif', 'Removal'], b: ['`drop_duplicates()` garde la 1re occurrence et supprime les suivantes : on passe de 9 à **8 lignes**.', '`drop_duplicates()` kaykhlli lowla w y7iyed l ba9i : mn 9 l **8 stour**.', '`drop_duplicates()` keeps the first occurrence and drops the rest: from 9 to **8 rows**.'], code: 'cleaned_df = df.drop_duplicates()' },
      { t: ['Variante utile', 'Variante mfida', 'Useful variant'], b: ['Doublons sur une clé seulement : `df.drop_duplicates(subset="user_id")`.', 'Ghir 3la clé : `subset="user_id"`.', 'On a key only: `subset="user_id"`.'] }
    ]),
    exam([
      '**Ordre conseillé pour le TP (« nettoyez le fichier data_1.xlsx »)** : 1) `read_excel` + `info()` ; 2) `isnull().sum()` ; 3) supprimer les **doublons** ; 4) supprimer les colonnes > 40 % de NaN si elles ne sont pas importantes ; 5) **imputer** le reste (moyenne/médiane/mode) ; 6) traiter les **aberrantes** (IQR) ; 7) **normaliser** si un algorithme le demande ; 8) `to_excel(…, index=False)`.',
      '**Tartib dyal TP (« nn9iw data_1.xlsx »)** : 1) `read_excel` + `info()` ; 2) `isnull().sum()` ; 3) 7iyed **doublons** ; 4) 7iyed colonnes > 40 % NaN ila machi mohimmin ; 5) **imputer** l ba9i ; 6) **aberrantes** (IQR) ; 7) **normaliser** ila khass ; 8) `to_excel(…, index=False)`.',
      '**Recommended order for the lab ("clean data_1.xlsx")**: 1) `read_excel` + `info()`; 2) `isnull().sum()`; 3) drop **duplicates**; 4) drop columns > 40 % NaN if unimportant; 5) **impute** the rest; 6) handle **outliers** (IQR); 7) **normalise** if needed; 8) `to_excel(…, index=False)`.'
    ]),
    quiz('dn-01', 'dn-03', 'dn-06', 'dn-09')
  ],
  keyPoints: [
    L(['Détection : `df.isnull()` puis `df.isnull().sum()` = nombre de NaN par colonne.', 'Kachf : `df.isnull().sum()`.', 'Detection: `df.isnull().sum()` = NaN count per column.']),
    L(['Suppression : `dropna()` (lignes, perte d\'information) ; `dropna(axis=1)` (colonnes trop incomplètes, > 40 %).', '`dropna()` stour ; `dropna(axis=1)` colonnes.', 'Deletion: `dropna()` (rows, information loss); `dropna(axis=1)` (columns > 40 % missing).']),
    L(['Imputation simple : moyenne (continue), médiane, mode (catégorielle), valeur fixe — conserve la taille mais réduit la variance.', 'Imputation : moyenne, médiane, mode, qima tabta.', 'Simple imputation: mean, median, mode, fixed value — keeps size but reduces variance.']),
    L(['Imputation avancée : régression (modèle linéaire, sensible aux extrêmes) et k-NN (plus précis, coûteux).', 'Régression w k-NN.', 'Advanced: regression and k-NN.']),
    L(['Aberrante si hors de [Q1 − 1,5 IQR ; Q3 + 1,5 IQR], IQR = Q3 − Q1.', 'Aberrante ila bra [Q1 − 1,5 IQR ; Q3 + 1,5 IQR].', 'Outlier if outside [Q1 − 1.5 IQR; Q3 + 1.5 IQR].']),
    L(['Min-Max : (X − min)/(max − min) ∈ [0, 1] ; Z-score : (X − μ)/σ. Doublons : `duplicated()`, `drop_duplicates()`.', 'Min-Max, Z-score, doublons.', 'Min-Max, Z-score; duplicates: `duplicated()`, `drop_duplicates()`.'])
  ]
};
