import { setCtx, L, h, p, plain, steps, copy, demo, table, trap, exam, tip, key, ex } from '../lib';
import type { Chapter } from '../../src/lib/schema';

/**
 * Mock written test limited to what is in the data-analysis test: pandas (Chap 1) and hypothesis tests (Chap 5).
 * Every pandas output below was produced by running the code (pandas 2.3); every test value was checked with src/lib/stats.
 */

setCtx('data', 'blanc');

const VENTES = `date;ville;produit;quantite;prix
02/11/2026;Rabat;Clavier;3;149,90
02/11/2026;Casa;Souris;-;59,50
03/11/2026;Rabat;Ecran;1;1299,00
03/11/2026;Fes;Clavier;2;149,90
04/11/2026;Casa;Ecran;-;1299,00
04/11/2026;Rabat;Souris;5;59,50`;
const BAT = [9.6, 10.1, 9.4, 9.8, 9.9, 9.2, 10.0, 9.5, 9.7];

export const questions = [];
export const flashcards = [];
export const reference = [];

export const exercises = [
  ex('d-x-b1', 2, ['Examen blanc — Ex. 1 : lire et vérifier un CSV', 'Examen blanc — Ex. 1 : 9ra w t2akked', 'Mock test — Ex. 1: read and check a CSV'],
    ['Le fichier `ventes.csv` (ci-dessous) utilise « ; » comme séparateur, « , » comme décimale et « - » pour une quantité inconnue.\n1) Écrire l\'instruction qui le lit correctement dans `df`. 2) Afficher les 3 premières lignes. 3) Donner les instructions qui vérifient la lecture (dimensions, types) et le résultat attendu. 4) Compter les valeurs manquantes par colonne. 5) Que se passe-t-il avec `pd.read_csv("ventes.csv")` sans paramètre ?', 'Fichier `ventes.csv` : « ; », « , » w « - ». 1) 9rah mzyan. 2) 3 stour lwlin. 3) T2akked (shape, dtypes). 4) Ch7al mn NaN f kol colonne. 5) Chnou kayw9e3 bla paramètres ?', '`ventes.csv` uses ";", "," and "-". 1) Read it. 2) First 3 rows. 3) Check shape and types. 4) Count missing values. 5) What happens without parameters?'],
    [['Repère dans l\'énoncé les 3 indices : séparateur, décimale, valeur manquante.', 'Chouf 3 indices : séparateur, décimale, manquante.', 'Spot the 3 clues: separator, decimal, missing value.']],
    [{ t: ['1–2) Lecture', '1–2) 9raya', '1–2) Read'], b: ['Trois indices → trois paramètres : `sep=";"`, `decimal=","`, `na_values=["-"]`.', '3 indices → 3 paramètres.', '3 clues → 3 parameters.'], code: 'import pandas as pd\ndf = pd.read_csv("ventes.csv", sep=";", decimal=",", na_values=["-"])\nprint(df.head(3))' },
     { t: ['3–4) Vérification', '3–4) T2akked', '3–4) Check'], b: ['`df.shape` → (6, 5) ; `df.dtypes` : quantite et prix en **float64** (nombres) → lecture réussie. `df.isna().sum()` → quantite : 2, les autres 0.', '(6, 5) ; float64 ; quantite = 2 NaN.', '(6, 5); float64; quantite has 2 NaN.'], code: 'print(df.shape)\nprint(df.dtypes)\nprint(df.isna().sum())' },
     { t: ['5) Sans paramètre', '5) Bla paramètres', '5) No parameters'], b: ['Séparateur par défaut = virgule : l\'en-tête devient **une seule colonne** (shape (6, 1)) et « 149,90 » est coupé en deux. Lecture ratée.', 'Colonne wa7da (6, 1), w 149,90 kayt9sem.', 'One single column (6, 1); 149,90 is split.'] }],
    ['`pd.read_csv("ventes.csv", sep=";", decimal=",", na_values=["-"])` ; shape (6, 5) ; quantite float64 avec 2 valeurs manquantes.', 'sep, decimal, na_values ; (6, 5) ; 2 NaN.', 'sep, decimal, na_values; (6, 5); 2 NaN.'],
    [['Oublier `decimal=","` : prix devient du texte (object).', 'Nsit decimal → object.', 'Forgetting decimal → object.'], ['Écrire `na_values="-"` puis ne pas vérifier avec `isna()`.', 'Ma t2akkedtich.', 'Not checking with isna().']],
    { data: VENTES }),
  ex('d-x-b2', 2, ['Examen blanc — Ex. 2 : modifier, filtrer, sauvegarder', 'Examen blanc — Ex. 2 : beddel w sauvegardi', 'Mock test — Ex. 2: modify, filter, save'],
    ['Avec `df` de l\'exercice 1 : 1) Créer la colonne `montant` = quantite × prix arrondie à 2 décimales. 2) Afficher produit et montant des ventes de Rabat. 3) Sauvegarder `df` dans `ventes_montant.csv` au format français, sans numéros de ligne. 4) Créer une Series des notes 12, 15, 9 indexée par Amine, Sara, Yassine, et afficher sa moyenne. 5) Écrire l\'instruction qui lit seulement les colonnes A à C et 4 lignes de la feuille « S1 » de `notes.xlsx`.', 'Montant, filtre Rabat, to_csv français, Series, read_excel b paramètres.', 'Amount column, Rabat filter, French to_csv, Series, read_excel with parameters.'],
    [['Une colonne se crée par simple affectation : `df["nouvelle"] = …`.', '`df["jdida"] = …`.', '`df["new"] = …`.']],
    [{ t: ['1–2) Colonne et filtre', '1–2) Colonne w filtre', '1–2) Column and filter'], b: ['NaN × prix = NaN (pas d\'erreur). Filtre : condition entre crochets, puis liste de colonnes.', 'NaN × prix = NaN.', 'NaN × price = NaN.'], code: 'df["montant"] = (df["quantite"] * df["prix"]).round(2)\nprint(df[df["ville"] == "Rabat"][["produit", "montant"]])' },
     { t: ['3) Sauvegarde', '3) Sauvegarde', '3) Save'], b: ['`to_csv` reprend `sep` et `decimal` ; `index=False` enlève les numéros de ligne.', 'Nefs sep w decimal ; index=False.', 'Same sep and decimal; index=False.'], code: 'df.to_csv("ventes_montant.csv", sep=";", decimal=",", index=False)' },
     { t: ['4–5) Series et read_excel', '4–5) Series w read_excel', '4–5) Series and read_excel'], b: ['Series = une colonne + un index ; moyenne 12.0. Excel : `sheet_name`, `usecols`, `nrows`.', 'Series ; 12.0 ; sheet_name, usecols, nrows.', 'Series; 12.0; sheet_name, usecols, nrows.'], code: 's = pd.Series([12, 15, 9], index=["Amine", "Sara", "Yassine"])\nprint(s.mean())          # 12.0\npd.read_excel("notes.xlsx", sheet_name="S1", usecols="A:C", nrows=4)' }],
    ['Montants 449.7, NaN, 1299.0, 299.8, NaN, 297.5 ; Rabat : Clavier 449.7, Ecran 1299.0, Souris 297.5 ; moyenne de la Series 12.0.', 'Montants w filtre ; 12.0.', 'Amounts and filter; 12.0.'],
    [['Oublier `index=False` : une colonne de numéros apparaît dans le fichier.', 'Nsit index=False.', 'Forgetting index=False.'], ['Écrire `df["ville" == "Rabat"]` : la condition doit porter sur `df["ville"]`.', 'Condition ghalta.', 'Wrong condition syntax.']]),
  ex('d-x-b3', 3, ['Examen blanc — Ex. 3 : test Z bilatéral', 'Examen blanc — Ex. 3 : test Z bilatéral', 'Mock test — Ex. 3: two-sided Z test'],
    ['Une machine remplit des bouteilles de **500 mL**. L\'écart-type du remplissage est connu : **σ = 4 mL**. Sur **36** bouteilles, on trouve une moyenne de **498,5 mL**. Au risque **α = 5 %**, la machine est-elle déréglée ? Donner aussi la P-value.', 'Machine 500 mL, σ = 4 m3rouf, n = 36, x̄ = 498,5, α = 5 %. Wach mderegla ? W P-value.', 'Machine set at 500 mL, σ = 4 known, n = 36, x̄ = 498.5, α = 5 %. Out of adjustment? Give the P-value.'],
    [['σ connu → Z. « déréglée » = dans un sens ou dans l\'autre → bilatéral.', 'σ m3rouf → Z ; déréglée → bilatéral.', 'σ known → Z; "out of adjustment" → two-sided.']],
    [{ t: ['Hypothèses et statistique', 'Hypothèses w statistique', 'Hypotheses and statistic'], b: ['H0 : µ = 500 contre H1 : µ ≠ 500 (bilatéral). Sous H0, Z0 = (x̄ − µ0)/(σ/√n) suit N(0, 1).', 'H0 : µ = 500 ; H1 : µ ≠ 500.', 'H0: µ = 500 vs H1: µ ≠ 500.'] },
     { t: ['Calcul et décision', '7sab w qarar', 'Computation and decision'], b: ['σ/√n = 4/6 ≈ 0,667 ; Z0 = −1,5/0,667 = **−2,25**. |Z0| = 2,25 > z(0,025) = 1,96 → **rejet de H0**. PV = 2(1 − Φ(2,25)) ≈ **0,0244** < 0,05.', 'Z0 = −2,25 ; 2,25 > 1,96 → rejet ; PV ≈ 0,0244.', 'Z0 = −2.25; 2.25 > 1.96 → reject; PV ≈ 0.0244.'], tex: 'Z_0 = \\frac{498{,}5 - 500}{4/\\sqrt{36}} = -2{,}25' }],
    ['Z0 = −2,25, |Z0| > 1,96 : au risque 5 %, la machine est **déréglée** (PV ≈ 0,0244).', 'Rejet : machine mderegla.', 'Reject: the machine is out of adjustment.'],
    [['Diviser par σ au lieu de σ/√n (Z0 = −0,375 → mauvaise décision).', 'Nsit √n.', 'Forgetting √n.'], ['Prendre 1,645 (unilatéral) au lieu de 1,96.', '1,645 machi hna.', 'Using 1.645 instead of 1.96.']],
    { checks: [{ compute: { fn: 'zStat', args: [498.5, 500, 4, 36] }, expect: -2.25, tolerance: 0.001 }, { compute: { fn: 'pValueZ', args: [-2.25, 'two'] }, expect: 0.0244, tolerance: 0.0002 }] }),
  ex('d-x-b4', 3, ['Examen blanc — Ex. 4 : test de Student unilatéral', 'Examen blanc — Ex. 4 : Student unilatéral', 'Mock test — Ex. 4: one-sided Student test'],
    [`Un fournisseur affirme que l'autonomie moyenne de ses batteries est d'**au moins 10 h**. On mesure 9 batteries (heures) : ${BAT.join(' ; ').replace(/\./g, ',')}. σ est inconnu. 1) Calculer x̄ et S (à la main ou avec pandas). 2) Au risque **5 %**, peut-on dire que l'autonomie moyenne est **inférieure** à 10 h ?`, `Fournisseur : autonomie **au moins 10 h**. 9 batteries : ${BAT.join(' ; ').replace(/\./g, ',')}. σ ma m3roufch. x̄, S, w wach µ < 10 b risque 5 % ?`, `Supplier claims **at least 10 h**. 9 batteries: ${BAT.join('; ')}. σ unknown. Compute x̄ and S; at 5 %, is the mean **below** 10 h?`],
    [['σ inconnu → Student à ν = n − 1 = 8. « inférieure » → unilatéral **gauche**.', 'σ ma m3roufch → Student ν = 8 ; gauche.', 'σ unknown → Student ν = 8; left-tailed.']],
    [{ t: ['x̄ et S', 'x̄ w S', 'x̄ and S'], b: ['x̄ = 87,2/9 ≈ **9,689** ; S ≈ **0,2934** (diviseur n − 1). Avec pandas, `.std()` donne directement S.', 'x̄ ≈ 9,689 ; S ≈ 0,2934.', 'x̄ ≈ 9.689; S ≈ 0.2934.'], code: 'x = pd.Series([9.6, 10.1, 9.4, 9.8, 9.9, 9.2, 10.0, 9.5, 9.7])\nprint(x.mean(), x.std())   # 9.68888888888889 0.2934469476943169' },
     { t: ['Test', 'Test', 'Test'], b: ['H0 : µ = 10 contre H1 : µ < 10. T0 = (9,689 − 10)/(0,2934/3) ≈ **−3,18**. Région critique : T0 < −t(0,05 ; 8) = **−1,860**. −3,18 < −1,860 → **rejet de H0** (PV ≈ 0,0065).', 'T0 ≈ −3,18 < −1,860 → rejet.', 'T0 ≈ −3.18 < −1.860 → reject.'], tex: 'T_0 = \\frac{9{,}689 - 10}{0{,}2934/\\sqrt 9} \\approx -3{,}18' }],
    ['Au risque 5 %, l\'autonomie moyenne est **inférieure à 10 h** : l\'affirmation du fournisseur est rejetée.', 'Rejet : a9al mn 10 h.', 'Reject: mean below 10 h.'],
    [['Utiliser la loi normale (1,645) alors que σ est inconnu et n = 9.', '1,645 machi hna : Student.', 'Using 1.645 instead of Student.'], ['Calculer l\'écart-type avec n (0,2767) au lieu de n − 1.', 'S b n − 1.', 'S uses n − 1.']],
    { checks: [{ compute: { fn: 'tStatData', args: [BAT, 10] }, expect: -3.1806, tolerance: 0.001 }, { compute: { fn: 'tCrit', args: [0.05, 8] }, expect: 1.86, tolerance: 0.001 }, { compute: { fn: 'sampleSd', args: [BAT] }, expect: 0.2934, tolerance: 0.0001 }] })
];

export const chapter: Chapter = {
  id: 'blanc',
  module: 'data',
  order: 7,
  title: L(['Examen blanc corrigé — pandas + tests d\'hypothèses', 'Examen blanc m-corrigé — pandas + tests d\'hypothèses', 'Solved mock test — pandas + hypothesis tests']),
  summary: L(['Seulement ce qui tombe au contrôle : la révision des étapes, puis 4 exercices (20 pts) avec pour chacun comment démarrer, le code et son vrai résultat, et la rédaction du prof.', 'Ghir li kayji f contrôle : révision dyal les étapes, w 4 exercices (20 pts) : kifach tbda, code b résultat 7a9i9i, w ktaba dyal l prof.', 'Only what the test covers: the steps to revise, then 4 exercises (20 pts), each with how to start, real code output and the teacher\'s write-up.']),
  estimatedMinutes: 90,
  sections: [
    key(['**Programme du contrôle** : pandas (lire, vérifier, modifier, sauvegarder) + tests d\'hypothèses (Z ou Student, bilatéral ou unilatéral, rédaction en 7 lignes). Fais d\'abord l\'**examen blanc chronométré** (page Examen blanc), puis compare avec la correction ci-dessous.', '**Programme** : pandas (9ra, t2akked, beddel, sauvegardi) + tests (Z wla Student, bilatéral wla unilatéral, 7 stour). Dir **examen blanc b chrono** 9bel, mn ba3d 9aren m3a correction.', '**Scope**: pandas (read, check, modify, save) + hypothesis tests (Z or Student, two- or one-sided, 7-line write-up). Take the **timed mock** first, then compare.']),

    h(['Révision 1 — pandas : les 4 étapes', 'Révision 1 — pandas : 4 étapes', 'Revision 1 — pandas: the 4 steps']),
    steps(['Toujours dans cet ordre', 'Dima b had tartib', 'Always in this order'], [
      { t: ['1. Lire', '1. 9ra', '1. Read'], b: ['`df = pd.read_csv(…)` ou `pd.read_excel(…)` avec les **bons paramètres** : on les trouve dans l\'énoncé (voir le tableau).', '`pd.read_csv` / `pd.read_excel` b **paramètres** li f énoncé.', '`pd.read_csv` / `pd.read_excel` with the **parameters** the statement gives.'] },
      { t: ['2. Vérifier', '2. T2akked', '2. Check'], b: ['`df.head()`, `df.shape`, `df.dtypes`, `df.isna().sum()`. Une colonne de nombres en **object** = lecture ratée.', 'head, shape, dtypes, isna. Nombres f **object** = ghalat.', 'head, shape, dtypes, isna. Numbers as **object** = bad read.'] },
      { t: ['3. Modifier / sélectionner', '3. Beddel / khtar', '3. Modify / select'], b: ['Nouvelle colonne : `df["c"] = …`. Colonnes : `df[["a", "b"]]`. Lignes : `df[df["a"] == x]`.', '`df["c"] = …` ; `df[["a","b"]]` ; `df[df["a"] == x]`.', '`df["c"] = …`; `df[["a","b"]]`; `df[df["a"] == x]`.'] },
      { t: ['4. Sauvegarder', '4. Sauvegardi', '4. Save'], b: ['`df.to_csv("f.csv", index=False)` (+ `sep`, `decimal` si format français), `df.to_excel(…)`.', '`to_csv(…, index=False)`.', '`to_csv(…, index=False)`.'] }
    ]),
    table([['Dans l\'énoncé je lis…', 'F énoncé kan9ra…', 'The statement says…'], ['J\'écris', 'Nkteb', 'I write']], [
      [['séparateur « ; »', 'séparateur « ; »', '";" separator'], 'sep=";"'],
      [['décimale « , » (12,5)', 'décimale « , »', '"," decimal'], 'decimal=","'],
      [['« - » ou « NA » = inconnu', '« - » = manquante', '"-" = unknown'], 'na_values=["-"]'],
      [['pas de ligne d\'en-tête', 'bla en-tête', 'no header row'], 'header=None, names=[…]'],
      [['feuille « S1 », colonnes A à C, 4 lignes', 'feuille S1, A:C, 4 stour', 'sheet S1, A:C, 4 rows'], 'sheet_name="S1", usecols="A:C", nrows=4'],
      [['sans numéros de ligne', 'bla numéros', 'without row numbers'], 'index=False']
    ]),

    h(['Révision 2 — test d\'hypothèse : choisir puis rédiger', 'Révision 2 — test : khtar w kteb', 'Revision 2 — test: choose then write']),
    table([['Question', 'So2al', 'Question'], ['Réponse → conséquence', 'Jawab → natija', 'Answer → consequence']], [
      [['σ est-il donné (« connu ») ?', 'σ m3tia ?', 'Is σ given?'], ['Oui → **Z0** et la table N(0, 1). Non → **T0** avec S et Student à **ν = n − 1**.', 'Ah → **Z0**. La → **T0** b S, **ν = n − 1**.', 'Yes → **Z0**, N(0, 1). No → **T0** with S, Student **ν = n − 1**.']],
      [['Quel mot dans la question ?', 'Ina kelma f so2al ?', 'Which word in the question?'], ['« différent, déréglé, conforme » → **bilatéral** (α/2). « inférieur, moins de » → **gauche**. « supérieur, dépasse » → **droite**.', '« déréglé » → bilatéral ; « inférieur » → gauche ; « dépasse » → droite.', '"different" → two-sided; "lower" → left; "exceeds" → right.']],
      [['Valeur critique ?', 'Valeur critique ?', 'Critical value?'], ['5 % : 1,96 (bilatéral) ou 1,645 (unilatéral) ; Student : t(α/2 ; ν) ou t(α ; ν).', '1,96 / 1,645 ; Student t(α ; ν).', '1.96 / 1.645; Student t(α; ν).']]
    ]),
    plain(['Puis les **7 lignes du prof**, toujours les mêmes : **Données → Hypothèses → Statistique et sa loi → Calcul → Valeur critique (région) → Décision → Conclusion dans le contexte**. Même si un calcul est faux, une copie qui suit les 7 lignes garde les points de méthode.', 'Mn ba3d **7 stour dyal l prof** : **Données → Hypothèses → Statistique w loi → 7sab → Valeur critique → Qarar → Conclusion f contexte**. Wakha 7sab ghalat, no9at dyal méthode kayb9aw.', 'Then the teacher\'s **7 lines**: **Data → Hypotheses → Statistic and law → Computation → Critical value → Decision → Conclusion in context**.']),

    h(['Exercice 1 — Lire et vérifier un CSV (5 pts)', 'Exercice 1 — 9ra w t2akked (5 pts)', 'Exercise 1 — Read and check a CSV (5 pts)']),
    p(['`ventes.csv` utilise « ; », la virgule décimale et « - » pour une quantité inconnue. 1) Lire. 2) 3 premières lignes. 3) Vérifier dimensions et types. 4) Compter les valeurs manquantes. 5) Que donne `pd.read_csv("ventes.csv")` sans paramètre ?', '`ventes.csv` : « ; », « , », « - ». 1) 9ra. 2) 3 stour. 3) shape w dtypes. 4) NaN. 5) Bla paramètres ?', '`ventes.csv` uses ";", decimal comma and "-". 1) Read. 2) First 3 rows. 3) Shape and types. 4) Missing values. 5) Without parameters?']),
    tip(['**Comment démarrer** : souligne dans l\'énoncé les 3 indices (« ; », « , », « - ») → ce sont tes 3 paramètres. Écris d\'abord `import pandas as pd`.', '**Kifach tbda** : 7tt khatt ta7t 3 indices (« ; », « , », « - ») → homa 3 paramètres. Bda b `import pandas as pd`.', '**How to start**: underline the 3 clues (";", ",", "-") → your 3 parameters. Start with `import pandas as pd`.']),
    demo(['Q1–Q2 : lire puis afficher', 'Q1–Q2 : 9ra w werri', 'Q1–Q2: read then show'], `import pandas as pd
df = pd.read_csv("ventes.csv", sep=";", decimal=",", na_values=["-"])
print(df.head(3))`, `         date  ville  produit  quantite    prix
0  02/11/2026  Rabat  Clavier       3.0   149.9
1  02/11/2026   Casa   Souris       NaN    59.5
2  03/11/2026  Rabat    Ecran       1.0  1299.0`, { file: ['ventes.csv', VENTES] }),
    demo(['Q3–Q4 : vérifier', 'Q3–Q4 : t2akked', 'Q3–Q4: check'], `print(df.shape)
print(df.dtypes)
print(df.isna().sum())`, `(6, 5)
date         object
ville        object
produit      object
quantite    float64
prix        float64
dtype: object
date        0
ville       0
produit     0
quantite    2
prix        0
dtype: int64`, { note: ['quantite et prix en **float64** : les nombres sont bien lus. quantite est en float (et non int) à cause des 2 NaN.', 'quantite w prix **float64** : mzyan. quantite float 7it fiha 2 NaN.', 'quantite and prix are **float64**: read correctly. quantite is float because of the 2 NaN.'] }),
    demo(['Q5 : sans paramètre (lecture ratée)', 'Q5 : bla paramètres (ghalat)', 'Q5: no parameters (bad read)'], `w = pd.read_csv("ventes.csv")
print(w.shape)`, `(6, 1)`, { note: ['Le séparateur par défaut est la virgule : toute la ligne d\'en-tête devient **une seule colonne**, et « 149,90 » est coupé en deux. Réponse attendue : « lecture incorrecte, il faut sep=";" et decimal="," ».', 'Séparateur par défaut = virgule : **colonne wa7da**, w 149,90 kayt9sem.', 'Default separator is the comma: **one single column**, and 149,90 is split.'] }),
    trap(['Ne jamais conclure sans **vérifier** : `df.dtypes` est la preuve que la lecture est bonne, et le correcteur la cherche.', 'Ma tsalich bla **t2akked** : `df.dtypes` howa dalil.', 'Never finish without **checking**: `df.dtypes` is the proof.']),

    h(['Exercice 2 — Modifier, filtrer, sauvegarder (5 pts)', 'Exercice 2 — Beddel, filtri, sauvegardi (5 pts)', 'Exercise 2 — Modify, filter, save (5 pts)']),
    p(['1) Colonne `montant` = quantite × prix (2 décimales). 2) Produit et montant des ventes de Rabat. 3) Sauvegarder au format français sans numéros de ligne. 4) Series des notes 12, 15, 9 (Amine, Sara, Yassine) et sa moyenne. 5) Lire les colonnes A à C, 4 lignes, de la feuille « S1 » de `notes.xlsx`.', '1) montant. 2) Rabat. 3) to_csv français. 4) Series. 5) read_excel.', '1) amount. 2) Rabat. 3) French to_csv. 4) Series. 5) read_excel.']),
    tip(['**Comment démarrer** : chaque question = **une instruction**. Créer → `df["col"] = …` ; filtrer → `df[condition]` ; sauvegarder → `to_csv(…, index=False)`.', '**Kifach tbda** : kol so2al = **instruction wa7da**.', '**How to start**: each question = **one instruction**.']),
    demo(['Q1 : nouvelle colonne', 'Q1 : colonne jdida', 'Q1: new column'], `df["montant"] = (df["quantite"] * df["prix"]).round(2)
print(df)`, `         date  ville  produit  quantite    prix  montant
0  02/11/2026  Rabat  Clavier       3.0   149.9    449.7
1  02/11/2026   Casa   Souris       NaN    59.5      NaN
2  03/11/2026  Rabat    Ecran       1.0  1299.0   1299.0
3  03/11/2026    Fes  Clavier       2.0   149.9    299.8
4  04/11/2026   Casa    Ecran       NaN  1299.0      NaN
5  04/11/2026  Rabat   Souris       5.0    59.5    297.5`, { note: ['NaN × prix = **NaN** : pandas ne plante pas, il propage la valeur manquante.', 'NaN × prix = **NaN**.', 'NaN × price = **NaN**.'] }),
    demo(['Q2 : filtrer les lignes, choisir les colonnes', 'Q2 : filtri stour, khtar colonnes', 'Q2: filter rows, pick columns'], `print(df[df["ville"] == "Rabat"][["produit", "montant"]])`, `   produit  montant
0  Clavier    449.7
2    Ecran   1299.0
5   Souris    297.5`),
    demo(['Q3 : sauvegarder au format français', 'Q3 : sauvegardi b format français', 'Q3: save in French format'], `df.to_csv("ventes_montant.csv", sep=";", decimal=",", index=False)`, `date;ville;produit;quantite;prix;montant
02/11/2026;Rabat;Clavier;3,0;149,9;449,7
02/11/2026;Casa;Souris;;59,5;
03/11/2026;Rabat;Ecran;1,0;1299,0;1299,0
03/11/2026;Fes;Clavier;2,0;149,9;299,8
04/11/2026;Casa;Ecran;;1299,0;
04/11/2026;Rabat;Souris;5,0;59,5;297,5`, { note: ['Contenu du fichier écrit. Les NaN deviennent des cases vides.', 'Contenu dyal fichier. NaN → khawi.', 'File content. NaN become empty cells.'] }),
    demo(['Q4–Q5 : Series et read_excel', 'Q4–Q5 : Series w read_excel', 'Q4–Q5: Series and read_excel'], `s = pd.Series([12, 15, 9], index=["Amine", "Sara", "Yassine"])
print(s)
print(s.mean())
notes = pd.read_excel("notes.xlsx", sheet_name="S1", usecols="A:C", nrows=4)`, `Amine      12
Sara       15
Yassine     9
dtype: int64
12.0`),

    h(['Exercice 3 — Test Z bilatéral (5 pts)', 'Exercice 3 — Test Z bilatéral (5 pts)', 'Exercise 3 — Two-sided Z test (5 pts)']),
    p(['Une machine remplit des bouteilles de **500 mL**, **σ = 4 mL** (connu). Sur **n = 36** bouteilles, **x̄ = 498,5 mL**. Au risque **5 %**, la machine est-elle déréglée ? Donner la P-value.', 'Machine 500 mL, σ = 4 m3rouf, n = 36, x̄ = 498,5, α = 5 %. Mderegla ? P-value ?', 'Machine 500 mL, σ = 4 known, n = 36, x̄ = 498.5, α = 5 %. Out of adjustment? P-value?']),
    tip(['**Comment démarrer** : 2 questions. σ donné ? **oui → Z**. Le mot « déréglée » ? → écart dans les deux sens → **bilatéral**, seuil **1,96**.', '**Kifach tbda** : σ m3tia ? **ah → Z**. « déréglée » → **bilatéral**, **1,96**.', '**How to start**: σ given? **yes → Z**. "out of adjustment" → **two-sided**, **1.96**.']),
    copy(['Copie modèle — Exercice 3', 'Copie modèle — Exercice 3', 'Model answer — Exercise 3'], null, [
      { l: ['Données', 'Data', 'Data'], b: ['µ0 = 500 ; σ = 4 (**connu**) ; n = 36 ; x̄ = 498,5 ; α = 0,05.', 'µ0 = 500 ; σ = 4 (**m3rouf**) ; n = 36 ; x̄ = 498,5 ; α = 0,05.', 'µ0 = 500; σ = 4 (**known**); n = 36; x̄ = 498.5; α = 0.05.'] },
      { l: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['H0 : µ = 500 contre H1 : µ ≠ 500 → test **bilatéral**.', 'H0 : µ = 500 contre H1 : µ ≠ 500 → **bilatéral**.', 'H0: µ = 500 vs H1: µ ≠ 500 → **two-sided**.'] },
      { l: ['Statistique et loi', 'Statistique w loi', 'Statistic and law'], b: ['Sous H0, Z0 = (x̄ − µ0)/(σ/√n) suit **N(0, 1)**.', 'Sous H0, Z0 ~ **N(0, 1)**.', 'Under H0, Z0 ~ **N(0, 1)**.'] },
      { l: ['Calcul', '7sab', 'Computation'], b: ['σ/√n = 4/6 ≈ 0,667 ; Z0 = (498,5 − 500)/0,667 = **−2,25**.', 'σ/√n ≈ 0,667 ; Z0 = **−2,25**.', 'σ/√n ≈ 0.667; Z0 = **−2.25**.'], tex: 'Z_0 = \\frac{498{,}5 - 500}{4/\\sqrt{36}} = \\frac{-1{,}5}{0{,}667} = -2{,}25' },
      { l: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['z(α/2) = z(0,025) = **1,96** ; région critique : |Z0| > 1,96.', 'z(0,025) = **1,96** ; |Z0| > 1,96.', 'z(0.025) = **1.96**; |Z0| > 1.96.'] },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['|Z0| = 2,25 > 1,96 → **on rejette H0**. (P-value = 2(1 − Φ(2,25)) ≈ 0,0244 < 0,05 : même décision.)', '2,25 > 1,96 → **nrfdou H0** (PV ≈ 0,0244).', '2.25 > 1.96 → **reject H0** (PV ≈ 0.0244).'] },
      { l: ['Conclusion', 'Conclusion', 'Conclusion'], b: ['Au risque 5 %, la machine est **déréglée** (elle remplit en moyenne moins de 500 mL).', 'B risque 5 %, machine **mderegla**.', 'At the 5 % level, the machine is **out of adjustment**.'] }
    ]),
    trap(['L\'écart-type de x̄ est **σ/√n**, pas σ : sans √n on trouve Z0 = −0,375 et on garde H0 à tort.', '**σ/√n** machi σ : bla √n Z0 = −0,375 w qarar ghalat.', 'Use **σ/√n**, not σ: otherwise Z0 = −0.375 and the wrong decision.']),

    h(['Exercice 4 — Test de Student unilatéral (5 pts)', 'Exercice 4 — Student unilatéral (5 pts)', 'Exercise 4 — One-sided Student test (5 pts)']),
    p([`Un fournisseur affirme une autonomie moyenne d'**au moins 10 h**. 9 batteries mesurées (h) : ${BAT.join(' ; ').replace(/\./g, ',')}. σ inconnu. 1) x̄ et S. 2) Au risque 5 %, l'autonomie moyenne est-elle **inférieure** à 10 h ?`, `Fournisseur : **au moins 10 h**. 9 batteries : ${BAT.join(' ; ').replace(/\./g, ',')}. 1) x̄ w S. 2) Wach µ < 10 b 5 % ?`, `Supplier claims **at least 10 h**. 9 batteries: ${BAT.join('; ')}. 1) x̄ and S. 2) At 5 %, is the mean **below** 10 h?`]),
    tip(['**Comment démarrer** : σ pas donné → **Student**, ν = 9 − 1 = **8**. « inférieure » → **unilatéral gauche** : région T0 < −t(0,05 ; 8). Commence par x̄ et S (diviseur **n − 1**).', '**Kifach tbda** : σ ma m3tiach → **Student**, ν = **8**. « inférieure » → **gauche**. Bda b x̄ w S (**n − 1**).', '**How to start**: σ not given → **Student**, ν = **8**. "below" → **left-tailed**. Start with x̄ and S (**n − 1**).']),
    demo(['x̄ et S avec pandas (S = .std())', 'x̄ w S b pandas', 'x̄ and S with pandas'], `x = pd.Series([9.6, 10.1, 9.4, 9.8, 9.9, 9.2, 10.0, 9.5, 9.7])
print(x.mean(), x.std(), len(x))`, `9.68888888888889 0.2934469476943169 9`, { note: ['`.std()` de pandas divise par **n − 1** : c\'est exactement le S du test de Student.', '`.std()` kayfasem 3la **n − 1** : howa S.', 'pandas `.std()` divides by **n − 1**: it is the S of the test.'] }),
    copy(['Copie modèle — Exercice 4', 'Copie modèle — Exercice 4', 'Model answer — Exercise 4'], null, [
      { l: ['Données', 'Data', 'Data'], b: ['µ0 = 10 ; n = 9 ; x̄ = 87,2/9 ≈ 9,689 ; S ≈ 0,2934 ; σ **inconnu** ; α = 0,05.', 'µ0 = 10 ; n = 9 ; x̄ ≈ 9,689 ; S ≈ 0,2934 ; σ **ma m3roufch**.', 'µ0 = 10; n = 9; x̄ ≈ 9.689; S ≈ 0.2934; σ **unknown**.'] },
      { l: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['H0 : µ = 10 contre H1 : µ < 10 → **unilatéral gauche**.', 'H0 : µ = 10 ; H1 : µ < 10 → **gauche**.', 'H0: µ = 10 vs H1: µ < 10 → **left-tailed**.'] },
      { l: ['Statistique et loi', 'Statistique w loi', 'Statistic and law'], b: ['Sous H0, T0 = (x̄ − µ0)/(S/√n) suit **Student à 8 ddl**.', 'Sous H0, T0 ~ **Student ν = 8**.', 'Under H0, T0 ~ **Student, 8 df**.'] },
      { l: ['Calcul', '7sab', 'Computation'], b: ['S/√n = 0,2934/3 ≈ 0,0978 ; T0 = (9,689 − 10)/0,0978 ≈ **−3,18**.', 'T0 ≈ **−3,18**.', 'T0 ≈ **−3.18**.'], tex: 'T_0 = \\frac{9{,}689 - 10}{0{,}2934/\\sqrt 9} \\approx -3{,}18' },
      { l: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['t(0,05 ; 8) = **1,860** ; région critique : T0 < −1,860.', 't(0,05 ; 8) = **1,860** ; T0 < −1,860.', 't(0.05; 8) = **1.860**; T0 < −1.860.'] },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['T0 = −3,18 < −1,860 → **on rejette H0** (P-value ≈ 0,0065).', '−3,18 < −1,860 → **nrfdou H0**.', '−3.18 < −1.860 → **reject H0**.'] },
      { l: ['Conclusion', 'Conclusion', 'Conclusion'], b: ['Au risque 5 %, l\'autonomie moyenne est **inférieure à 10 h** : l\'affirmation du fournisseur est fausse.', 'B risque 5 %, autonomie **a9al mn 10 h**.', 'At 5 %, the mean is **below 10 h**: the claim is false.'] }
    ]),
    trap(['« au moins 10 h » est l\'affirmation testée (H0 : µ = 10) ; ce qu\'on cherche à montrer (« inférieure ») va dans **H1**. Et avec σ inconnu et n = 9, **jamais** 1,645.', '« au moins 10 h » = H0 ; « inférieure » = **H1**. W **machi** 1,645.', '"at least 10 h" is H0; "below" goes in **H1**. And **never** 1.645 here.']),
    exam(['Barème indicatif : Ex. 1 = 5, Ex. 2 = 5, Ex. 3 = 5, Ex. 4 = 5. Pour un test, chaque ligne des 7 rapporte des points : **conclusion dans le contexte** comprise.', 'Barème : 5 + 5 + 5 + 5. F test, kol str mn 7 fih no9at.', 'Scoring: 5 + 5 + 5 + 5. In a test, each of the 7 lines earns points.'])
  ],
  keyPoints: [
    L(['pandas : lire (bons paramètres) → vérifier (shape, dtypes, isna) → modifier → sauvegarder (index=False).', 'pandas : 9ra → t2akked → beddel → sauvegardi.', 'pandas: read → check → modify → save.']),
    L(['Test : σ connu → Z, sinon Student ν = n − 1 ; le mot de la question donne bilatéral / gauche / droite ; puis les 7 lignes.', 'Test : Z wla Student ; bilatéral / gauche / droite ; 7 stour.', 'Test: Z or Student; two-sided / left / right; then 7 lines.']),
    L(['Ex. 3 : Z0 = −2,25 → rejet ; Ex. 4 : T0 ≈ −3,18 < −1,860 → rejet.', 'Z0 = −2,25 ; T0 ≈ −3,18.', 'Z0 = −2.25; T0 ≈ −3.18.'])
  ]
};
