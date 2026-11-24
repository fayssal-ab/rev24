import { setCtx, L, h, p, plain, steps, copy, demo, table, trap, exam, tip, key, ex } from '../lib';
import type { Chapter } from '../../src/lib/schema';

/**
 * Mock written test limited to what is in the data-analysis test: pandas (Chap 1), normal-law and Student tests in the 3 cases ≠ / < / >.
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
  ex('d-x-b1', 2, ['Examen blanc — Ex. 1 : pandas (lire, vérifier, modifier, sauvegarder)', 'Examen blanc — Ex. 1 : pandas (9ra, t2akked, beddel, sauvegardi)', 'Mock test — Ex. 1: pandas (read, check, modify, save)'],
    ['Le fichier `ventes.csv` (ci-dessous) utilise « ; » comme séparateur, « , » comme décimale et « - » pour une quantité inconnue.\n**A.** 1) Lire le fichier correctement dans `df`. 2) Afficher les 3 premières lignes. 3) Vérifier la lecture (dimensions, types). 4) Compter les valeurs manquantes par colonne. 5) Que donne `pd.read_csv("ventes.csv")` sans paramètre ?\n**B.** 6) Créer la colonne `montant` = quantite × prix (2 décimales). 7) Afficher produit et montant des ventes de Rabat. 8) Sauvegarder `df` dans `ventes_montant.csv` au format français, sans numéros de ligne. 9) Créer la Series des notes 12, 15, 9 indexée par Amine, Sara, Yassine et afficher sa moyenne. 10) Lire seulement les colonnes A à C et 4 lignes de la feuille « S1 » de `notes.xlsx`.',
     'Fichier `ventes.csv` : séparateur « ; », décimale « , » w « - » = quantité ma m3roufach.\n**A.** 1) 9rah mzyan f `df`. 2) Werri 3 stour lwlin. 3) T2akked mn 9raya (shape, dtypes). 4) 7seb NaN f kol colonne. 5) Chnou kay3ti `pd.read_csv("ventes.csv")` bla paramètres ?\n**B.** 6) Colonne `montant` = quantite × prix (2 décimales). 7) Werri produit w montant dyal Rabat. 8) Sauvegardi f `ventes_montant.csv` b format français, bla numéros dyal stour. 9) Series dyal notes 12, 15, 9 (Amine, Sara, Yassine) w moyenne dyalha. 10) 9ra ghir colonnes A tal C w 4 stour mn feuille « S1 » dyal `notes.xlsx`.',
     '`ventes.csv` uses ";" as separator, "," as decimal and "-" for an unknown quantity.\n**A.** 1) Read it into `df`. 2) Show the first 3 rows. 3) Check the read (shape, types). 4) Count missing values per column. 5) What does `pd.read_csv("ventes.csv")` give without parameters?\n**B.** 6) Create `montant` = quantite × prix (2 decimals). 7) Show product and amount for Rabat. 8) Save to `ventes_montant.csv` in French format, without row numbers. 9) Series of marks 12, 15, 9 indexed by Amine, Sara, Yassine and its mean. 10) Read only columns A to C and 4 rows of sheet "S1" of `notes.xlsx`.'],
    [['Repère les 3 indices de l\'énoncé (« ; », « , », « - ») : ce sont tes 3 paramètres. Ensuite chaque question = une instruction.', 'Chouf 3 indices (« ; », « , », « - ») : homa 3 paramètres. Mn ba3d kol so2al = instruction wa7da.', 'Spot the 3 clues (";", ",", "-"): your 3 parameters. Then each question = one instruction.']],
    [{ t: ['1–2) Lecture', '1–2) 9raya', '1–2) Read'], b: ['Trois indices → trois paramètres : `sep=";"`, `decimal=","`, `na_values=["-"]`.', '3 indices → 3 paramètres : `sep=";"`, `decimal=","`, `na_values=["-"]`.', '3 clues → 3 parameters: `sep=";"`, `decimal=","`, `na_values=["-"]`.'], code: 'import pandas as pd\ndf = pd.read_csv("ventes.csv", sep=";", decimal=",", na_values=["-"])\nprint(df.head(3))' },
     { t: ['3–4) Vérification', '3–4) T2akked', '3–4) Check'], b: ['`df.shape` → (6, 5) ; `df.dtypes` : quantite et prix en **float64** → lecture réussie. `df.isna().sum()` → quantite : 2, les autres 0.', '(6, 5) ; quantite w prix **float64** → 9raya mzyana ; quantite fiha 2 NaN.', '(6, 5); quantite and prix are **float64**; quantite has 2 NaN.'], code: 'print(df.shape)\nprint(df.dtypes)\nprint(df.isna().sum())' },
     { t: ['5) Sans paramètre', '5) Bla paramètres', '5) No parameters'], b: ['Séparateur par défaut = virgule : l\'en-tête devient **une seule colonne** (shape (6, 1)) et « 149,90 » est coupé en deux. Lecture ratée.', 'Séparateur par défaut = virgule : **colonne wa7da** (6, 1), w 149,90 kayt9sem. 9raya ghalta.', 'Default separator is the comma: **one single column** (6, 1), 149,90 is split. Bad read.'] },
     { t: ['6–7) Colonne et filtre', '6–7) Colonne w filtre', '6–7) Column and filter'], b: ['NaN × prix = NaN (pas d\'erreur). Filtre : condition entre crochets, puis liste de colonnes.', 'NaN × prix = NaN (bla erreur). Filtre : condition bin crochets, mn ba3d liste dyal colonnes.', 'NaN × price = NaN (no error). Filter: condition in brackets, then a list of columns.'], code: 'df["montant"] = (df["quantite"] * df["prix"]).round(2)\nprint(df[df["ville"] == "Rabat"][["produit", "montant"]])' },
     { t: ['8) Sauvegarde', '8) Sauvegarde', '8) Save'], b: ['`to_csv` reprend `sep` et `decimal` ; `index=False` enlève les numéros de ligne.', '`to_csv` b nefs `sep` w `decimal` ; `index=False` kay7iyed numéros.', '`to_csv` with the same `sep` and `decimal`; `index=False` drops row numbers.'], code: 'df.to_csv("ventes_montant.csv", sep=";", decimal=",", index=False)' },
     { t: ['9–10) Series et read_excel', '9–10) Series w read_excel', '9–10) Series and read_excel'], b: ['Series = une colonne + un index ; moyenne 12.0. Excel : `sheet_name`, `usecols`, `nrows`.', 'Series = colonne + index ; moyenne 12.0. Excel : `sheet_name`, `usecols`, `nrows`.', 'Series = one column + an index; mean 12.0. Excel: `sheet_name`, `usecols`, `nrows`.'], code: 's = pd.Series([12, 15, 9], index=["Amine", "Sara", "Yassine"])\nprint(s.mean())          # 12.0\nnotes = pd.read_excel("notes.xlsx", sheet_name="S1", usecols="A:C", nrows=4)' }],
    ['`pd.read_csv("ventes.csv", sep=";", decimal=",", na_values=["-"])` ; shape (6, 5) ; quantite float64 avec 2 NaN ; montants 449.7, NaN, 1299.0, 299.8, NaN, 297.5 ; Rabat : Clavier 449.7, Ecran 1299.0, Souris 297.5 ; moyenne de la Series 12.0.', 'sep, decimal, na_values ; (6, 5) ; 2 NaN ; montants ; Rabat 3 stour ; 12.0.', 'sep, decimal, na_values; (6, 5); 2 NaN; amounts; Rabat 3 rows; 12.0.'],
    [['Oublier `decimal=","` : prix devient du texte (object).', 'Nsit `decimal=","` → prix kaywlli texte (object).', 'Forgetting `decimal=","` → prix becomes text (object).'], ['Oublier `index=False` : une colonne de numéros apparaît dans le fichier.', 'Nsit `index=False` → colonne dyal numéros f fichier.', 'Forgetting `index=False` → a column of numbers in the file.'], ['Écrire `df["ville" == "Rabat"]` : la condition doit porter sur `df["ville"]`.', '`df["ville" == "Rabat"]` ghalat : khass `df["ville"] == "Rabat"`.', '`df["ville" == "Rabat"]` is wrong: use `df["ville"] == "Rabat"`.']],
    { data: VENTES }),

  ex('d-x-b2', 3, ['Examen blanc — Ex. 2 : loi normale (σ connu), les 3 cas ≠, <, >', 'Examen blanc — Ex. 2 : loi normale (σ m3rouf), 3 cas ≠, <, >', 'Mock test — Ex. 2: normal law (σ known), the 3 cases ≠, <, >'],
    ['Une machine doit remplir des bouteilles de **500 mL**. L\'écart-type est connu : **σ = 4 mL**. Sur **n = 36** bouteilles, on trouve **x̄ = 498,5 mL**. Au risque **α = 5 %** :\na) La machine est-elle **déréglée** ?\nb) Remplit-elle en moyenne **moins** de 500 mL ?\nc) Remplit-elle en moyenne **plus** de 500 mL ?\nPour chaque cas : hypothèses, région critique, décision, P-value et conclusion.\nd) Refaire a) et b) au risque **α = 1 %**.',
     'Machine khassha t3emmer bouteilles dyal **500 mL**. σ m3rouf : **σ = 4 mL**. F **n = 36** bouteille, **x̄ = 498,5 mL**. B risque **α = 5 %** :\na) Wach machine **mderegla** ?\nb) Wach kat3emmer f moyenne **a9al** mn 500 mL ?\nc) Wach kat3emmer f moyenne **ktar** mn 500 mL ?\nL kol cas : hypothèses, région critique, qarar, P-value w conclusion.\nd) 3awed a) w b) b risque **α = 1 %**.',
     'A machine must fill **500 mL** bottles. σ is known: **σ = 4 mL**. On **n = 36** bottles, **x̄ = 498.5 mL**. At **α = 5 %**:\na) Is the machine **out of adjustment**?\nb) Does it fill **less** than 500 mL on average?\nc) Does it fill **more** than 500 mL on average?\nFor each: hypotheses, critical region, decision, P-value, conclusion.\nd) Redo a) and b) at **α = 1 %**.'],
    [['σ donné → **Z**. Les 3 cas ont la **même statistique** Z0 : calcule-la une seule fois, seule la région critique change (≠ → 1,96 des deux côtés ; < → −1,645 ; > → +1,645).', 'σ m3tia → **Z**. 3 cas 3ndhom **nefs statistique** Z0 : 7sebha mra wa7da, ghir région critique katbeddel (≠ → 1,96 ; < → −1,645 ; > → +1,645).', 'σ given → **Z**. The 3 cases share **one statistic** Z0: compute it once; only the critical region changes.']],
    [{ t: ['Statistique (commune aux 3 cas)', 'Statistique (nefsha f 3 cas)', 'Statistic (same for the 3 cases)'], b: ['Sous H0 : µ = 500, Z0 = (x̄ − µ0)/(σ/√n) ~ N(0, 1). σ/√n = 4/6 ≈ 0,667 ; Z0 = −1,5/0,667 = **−2,25**.', 'Sous H0 : µ = 500, Z0 ~ N(0, 1). σ/√n = 4/6 ≈ 0,667 ; Z0 = **−2,25**.', 'Under H0: µ = 500, Z0 ~ N(0, 1). σ/√n ≈ 0.667; Z0 = **−2.25**.'], tex: 'Z_0 = \\frac{498{,}5 - 500}{4/\\sqrt{36}} = -2{,}25' },
     { t: ['a) H1 : µ ≠ 500 (bilatéral)', 'a) H1 : µ ≠ 500 (bilatéral)', 'a) H1: µ ≠ 500 (two-sided)'], b: ['Région critique |Z0| > z(0,025) = 1,96. |−2,25| = 2,25 > 1,96 → **rejet de H0**. PV = 2(1 − Φ(2,25)) ≈ **0,0244**. La machine est déréglée.', '|Z0| > 1,96 ? 2,25 > 1,96 → **rfed H0**. PV ≈ **0,0244**. Machine mderegla.', '|Z0| > 1.96? 2.25 > 1.96 → **reject H0**. PV ≈ **0.0244**.'] },
     { t: ['b) H1 : µ < 500 (gauche)', 'b) H1 : µ < 500 (gauche)', 'b) H1: µ < 500 (left)'], b: ['Région critique Z0 < −z(0,05) = −1,645. −2,25 < −1,645 → **rejet de H0**. PV = Φ(−2,25) ≈ **0,0122**. Elle remplit moins de 500 mL.', 'Z0 < −1,645 ? −2,25 < −1,645 → **rfed H0**. PV ≈ **0,0122**. Kat3emmer a9al mn 500.', 'Z0 < −1.645? −2.25 < −1.645 → **reject H0**. PV ≈ **0.0122**.'] },
     { t: ['c) H1 : µ > 500 (droite)', 'c) H1 : µ > 500 (droite)', 'c) H1: µ > 500 (right)'], b: ['Région critique Z0 > 1,645. −2,25 n\'est pas > 1,645 → **on ne rejette pas H0**. PV = 1 − Φ(−2,25) ≈ **0,9878**. Rien ne montre qu\'elle remplit plus.', 'Z0 > 1,645 ? −2,25 la → **ma nrfdouch H0**. PV ≈ **0,9878**.', 'Z0 > 1.645? No → **do not reject H0**. PV ≈ **0.9878**.'] },
     { t: ['d) Au risque 1 %', 'd) B risque 1 %', 'd) At 1 %'], b: ['a) z(0,005) = 2,576 : 2,25 < 2,576 → non-rejet. b) z(0,01) = 2,326 : −2,25 n\'est pas < −2,326 → non-rejet. Cohérent avec les P-values : 0,0244 et 0,0122 sont > 0,01.', 'a) 2,25 < 2,576 → ma nrfdouch. b) −2,25 machi < −2,326 → ma nrfdouch. PV 0,0244 w 0,0122 kbar mn 0,01.', 'a) 2.25 < 2.576 → keep. b) −2.25 not < −2.326 → keep. Both PVs are > 0.01.'] }],
    ['Z0 = −2,25. À 5 % : a) rejet (PV ≈ 0,0244) ; b) rejet (PV ≈ 0,0122) ; c) non-rejet (PV ≈ 0,9878). À 1 % : a) et b) non-rejet.', 'Z0 = −2,25. 5 % : a) rfed ; b) rfed ; c) la. 1 % : a) w b) la.', 'Z0 = −2.25. 5 %: a) reject; b) reject; c) keep. 1 %: a) and b) keep.'],
    [['Prendre |Z0| en unilatéral : en c), |−2,25| > 1,645 mais Z0 est **du mauvais côté**, on ne rejette pas.', '|Z0| f unilatéral : f c), Z0 f **jiha lokhra**, ma nrfdouch.', 'Using |Z0| one-sided: in c) Z0 is on **the wrong side**.'], ['Prendre 1,645 en bilatéral ou 1,96 en unilatéral.', '1,645 f bilatéral wla 1,96 f unilatéral.', '1.645 two-sided or 1.96 one-sided.'], ['Diviser par σ au lieu de σ/√n (Z0 = −0,375).', 't9assem 3la σ f blast σ/√n.', 'Dividing by σ instead of σ/√n.']],
    { checks: [
      { compute: { fn: 'zStat', args: [498.5, 500, 4, 36] }, expect: -2.25, tolerance: 0.001 },
      { compute: { fn: 'pValueZ', args: [-2.25, 'two'] }, expect: 0.0244, tolerance: 0.0002 },
      { compute: { fn: 'pValueZ', args: [-2.25, 'left'] }, expect: 0.0122, tolerance: 0.0002 },
      { compute: { fn: 'pValueZ', args: [-2.25, 'right'] }, expect: 0.9878, tolerance: 0.0002 },
      { compute: { fn: 'zCrit', args: [0.025] }, expect: 1.96, tolerance: 0.001 },
      { compute: { fn: 'zCrit', args: [0.05] }, expect: 1.645, tolerance: 0.001 },
      { compute: { fn: 'zCrit', args: [0.005] }, expect: 2.576, tolerance: 0.001 },
      { compute: { fn: 'zCrit', args: [0.01] }, expect: 2.326, tolerance: 0.001 }
    ] }),

  ex('d-x-b3', 3, ['Examen blanc — Ex. 3 : Student (σ inconnu), les 3 cas ≠, >, <', 'Examen blanc — Ex. 3 : Student (σ ma m3roufch), 3 cas ≠, >, <', 'Mock test — Ex. 3: Student (σ unknown), the 3 cases ≠, >, <'],
    [`Un fournisseur annonce une autonomie moyenne de **9,5 h** pour ses batteries. On mesure 9 batteries (heures) : ${BAT.join(' ; ').replace(/\./g, ',')}. σ est **inconnu**.\n1) Avec pandas, calculer x̄ et S.\n2) Au risque **5 %** : a) l'autonomie moyenne est-elle **différente** de 9,5 h ? b) est-elle **supérieure** à 9,5 h ? c) est-elle **inférieure** à 9,5 h ? Pour chaque cas : hypothèses, région critique, décision, P-value, conclusion.\n3) a) et b) ne donnent pas la même décision : pourquoi ?`,
     `Fournisseur kay9oul autonomie moyenne **9,5 h**. 9 batteries (s3at) : ${BAT.join(' ; ').replace(/\./g, ',')}. σ **ma m3roufch**.\n1) B pandas, 7seb x̄ w S.\n2) B risque **5 %** : a) wach autonomie **mkhtalfa** 3la 9,5 h ? b) wach **ktar** mn 9,5 h ? c) wach **a9al** mn 9,5 h ? L kol cas : hypothèses, région critique, qarar, P-value, conclusion.\n3) a) w b) ma 3tawch nefs qarar : 3lach ?`,
     `A supplier announces a mean battery life of **9.5 h**. 9 batteries measured (hours): ${BAT.join('; ')}. σ is **unknown**.\n1) With pandas, compute x̄ and S.\n2) At **5 %**: a) is the mean **different** from 9.5 h? b) **greater** than 9.5 h? c) **less** than 9.5 h? For each: hypotheses, critical region, decision, P-value, conclusion.\n3) a) and b) disagree: why?`],
    [['σ pas donné → **Student à ν = n − 1 = 8**. Calcule T0 une seule fois ; bilatéral → t(0,025 ; 8) = 2,306, unilatéral → t(0,05 ; 8) = 1,860.', 'σ ma m3tiach → **Student ν = 8**. 7seb T0 mra wa7da ; bilatéral → 2,306, unilatéral → 1,860.', 'σ not given → **Student, ν = 8**. Compute T0 once; two-sided → 2.306, one-sided → 1.860.']],
    [{ t: ['1) x̄ et S avec pandas', '1) x̄ w S b pandas', '1) x̄ and S with pandas'], b: ['`.std()` de pandas divise par **n − 1** : c\'est le S du test. x̄ ≈ **9,689** ; S ≈ **0,2934**.', '`.std()` kayfasem 3la **n − 1**. x̄ ≈ **9,689** ; S ≈ **0,2934**.', '`.std()` divides by **n − 1**. x̄ ≈ **9.689**; S ≈ **0.2934**.'], code: 'import pandas as pd\nx = pd.Series([9.6, 10.1, 9.4, 9.8, 9.9, 9.2, 10.0, 9.5, 9.7])\nprint(x.mean(), x.std(), len(x))   # 9.68888888888889 0.2934469476943169 9' },
     { t: ['Statistique (commune aux 3 cas)', 'Statistique (nefsha f 3 cas)', 'Statistic (same for the 3 cases)'], b: ['Sous H0 : µ = 9,5, T0 = (x̄ − µ0)/(S/√n) ~ t(8). S/√n = 0,2934/3 ≈ 0,0978 ; T0 = 0,1889/0,0978 ≈ **1,93**.', 'Sous H0, T0 ~ t(8). S/√n ≈ 0,0978 ; T0 ≈ **1,93**.', 'Under H0, T0 ~ t(8). S/√n ≈ 0.0978; T0 ≈ **1.93**.'], tex: 'T_0 = \\frac{9{,}689 - 9{,}5}{0{,}2934/\\sqrt 9} \\approx 1{,}93' },
     { t: ['a) H1 : µ ≠ 9,5 (bilatéral)', 'a) H1 : µ ≠ 9,5 (bilatéral)', 'a) H1: µ ≠ 9.5 (two-sided)'], b: ['|T0| > t(0,025 ; 8) = 2,306 ? 1,93 < 2,306 → **on ne rejette pas H0** (PV ≈ 0,0896).', '1,93 < 2,306 → **ma nrfdouch H0** (PV ≈ 0,0896).', '1.93 < 2.306 → **do not reject H0** (PV ≈ 0.0896).'] },
     { t: ['b) H1 : µ > 9,5 (droite)', 'b) H1 : µ > 9,5 (droite)', 'b) H1: µ > 9.5 (right)'], b: ['T0 > t(0,05 ; 8) = 1,860 ? 1,93 > 1,860 → **rejet de H0** (PV ≈ 0,0448). L\'autonomie dépasse 9,5 h.', '1,93 > 1,860 → **rfed H0** (PV ≈ 0,0448). Autonomie ktar mn 9,5 h.', '1.93 > 1.860 → **reject H0** (PV ≈ 0.0448).'] },
     { t: ['c) H1 : µ < 9,5 (gauche)', 'c) H1 : µ < 9,5 (gauche)', 'c) H1: µ < 9.5 (left)'], b: ['T0 < −1,860 ? 1,93 non → **on ne rejette pas H0** (PV ≈ 0,955).', '1,93 machi < −1,860 → **ma nrfdouch H0** (PV ≈ 0,955).', '1.93 is not < −1.860 → **do not reject H0** (PV ≈ 0.955).'] },
     { t: ['3) Pourquoi a) ≠ b) ?', '3) 3lach a) ≠ b) ?', '3) Why a) ≠ b)?'], b: ['En bilatéral, α = 5 % est **coupé en deux** (2,5 % de chaque côté) → seuil 2,306. En unilatéral, **tout α est du côté droit** → seuil 1,860, plus bas. T0 = 1,93 est entre les deux. Même chose avec les P-values : PV bilatérale = 2 × 0,0448 = 0,0896.', 'F bilatéral, α **mt9soum 3la 2** → 2,306. F unilatéral, **α kamla f jiha wa7da** → 1,860. T0 = 1,93 binathom. PV bilatérale = 2 × 0,0448.', 'Two-sided splits α in half → 2.306; one-sided puts all α on one side → 1.860. T0 = 1.93 lies between.'] }],
    ['x̄ ≈ 9,689 ; S ≈ 0,2934 ; T0 ≈ 1,93. a) non-rejet (PV ≈ 0,0896) ; b) rejet (PV ≈ 0,0448) : autonomie > 9,5 h ; c) non-rejet.', 'T0 ≈ 1,93 : a) la ; b) rfed ; c) la.', 'T0 ≈ 1.93: a) keep; b) reject; c) keep.'],
    [['Utiliser 1,96 / 1,645 (loi normale) alors que σ est inconnu et n = 9.', '1,96 / 1,645 machi hna : Student.', 'Using 1.96 / 1.645 instead of Student.'], ['ν = 9 au lieu de 8.', 'ν = 9 f blast 8.', 'ν = 9 instead of 8.'], ['Calculer S avec n (0,2767) au lieu de n − 1.', 'S b n f blast n − 1.', 'S with n instead of n − 1.']],
    { checks: [
      { compute: { fn: 'mean', args: [BAT] }, expect: 9.6889, tolerance: 0.0001 },
      { compute: { fn: 'sampleSd', args: [BAT] }, expect: 0.2934, tolerance: 0.0001 },
      { compute: { fn: 'tStatData', args: [BAT, 9.5] }, expect: 1.9311, tolerance: 0.001 },
      { compute: { fn: 'tCrit', args: [0.025, 8] }, expect: 2.306, tolerance: 0.001 },
      { compute: { fn: 'tCrit', args: [0.05, 8] }, expect: 1.86, tolerance: 0.001 },
      { compute: { fn: 'pValueT', args: [1.9311, 8, 'two'] }, expect: 0.0896, tolerance: 0.0005 },
      { compute: { fn: 'pValueT', args: [1.9311, 8, 'right'] }, expect: 0.0448, tolerance: 0.0005 },
      { compute: { fn: 'pValueT', args: [1.9311, 8, 'left'] }, expect: 0.9552, tolerance: 0.0005 }
    ] })
];

export const chapter: Chapter = {
  id: 'blanc',
  module: 'data',
  order: 7,
  title: L(['Examen blanc corrigé — pandas, loi normale, Student', 'Examen blanc m-corrigé — pandas, loi normale, Student', 'Solved mock test — pandas, normal law, Student']),
  summary: L(['Seulement des exercices, comme au contrôle : pandas (6 pts), loi normale avec les 3 cas ≠, <, > (7 pts), Student avec les 3 cas (7 pts). Code avec vrai résultat et copies modèles en 7 lignes.', 'Ghir exercices, b7al contrôle : pandas (6 pts), loi normale b 3 cas ≠, <, > (7 pts), Student b 3 cas (7 pts). Code b résultat 7a9i9i w copies modèles f 7 stour.', 'Exercises only, like the test: pandas (6 pts), normal law with the 3 cases ≠, <, > (7 pts), Student with the 3 cases (7 pts). Real code output and 7-line model answers.']),
  estimatedMinutes: 90,
  sections: [
    key(['**3 exercices, 20 points, pas de question de cours** : Ex. 1 pandas (lire, vérifier, modifier, sauvegarder) ; Ex. 2 loi normale (σ connu) dans les **3 cas H1 : ≠, <, >** ; Ex. 3 Student (σ inconnu) dans les **3 cas**. Fais d\'abord l\'**examen blanc chronométré** (page Examen blanc), puis compare avec la correction ci-dessous.', '**3 exercices, 20 no9ta, bla questions de cours** : Ex. 1 pandas ; Ex. 2 loi normale (σ m3rouf) f **3 cas H1 : ≠, <, >** ; Ex. 3 Student (σ ma m3roufch) f **3 cas**. Dir **examen blanc b chrono** 9bel, mn ba3d 9aren m3a correction.', '**3 exercises, 20 points, no theory questions**: Ex. 1 pandas; Ex. 2 normal law (σ known) in the **3 cases H1: ≠, <, >**; Ex. 3 Student (σ unknown) in the **3 cases**. Take the **timed mock** first, then compare.']),

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


    h(['Révision 2 — les 3 cas d\'un test sur une moyenne', 'Révision 2 — 3 cas dyal test 3la moyenne', 'Revision 2 — the 3 cases of a test on a mean']),
    table([['Le mot de l\'énoncé', 'Kelma f énoncé', 'Word in the statement'], ['H1', 'H1', 'H1'], ['σ connu : rejet si…', 'σ m3rouf : rfed ila…', 'σ known: reject if…'], ['σ inconnu : rejet si…', 'σ ma m3roufch : rfed ila…', 'σ unknown: reject if…'], ['P-value (Z)', 'P-value (Z)', 'P-value (Z)']], [
      [['« différent », « déréglé », « conforme ? »', '« différent », « déréglé »', '"different", "out of adjustment"'], '$\\mu \\neq \\mu_0$', '$|Z_0| > z_{\\alpha/2}$ (1,96)', '$|T_0| > t_{\\alpha/2;\\,n-1}$', '$2\\,(1 - \\Phi(|z_0|))$'],
      [['« inférieur », « moins de »', '« inférieur », « a9al »', '"lower", "less than"'], '$\\mu < \\mu_0$', '$Z_0 < -z_{\\alpha}$ (−1,645)', '$T_0 < -t_{\\alpha;\\,n-1}$', '$\\Phi(z_0)$'],
      [['« supérieur », « dépasse »', '« supérieur », « ktar »', '"greater", "exceeds"'], '$\\mu > \\mu_0$', '$Z_0 > z_{\\alpha}$ (+1,645)', '$T_0 > t_{\\alpha;\\,n-1}$', '$1 - \\Phi(z_0)$']
    ]),
    plain(['Dans les 3 cas, **H0 : µ = µ0** et **la statistique est la même** : on la calcule une seule fois. Seule la **région critique** change. En unilatéral, **on garde le signe** (pas de valeur absolue). Puis les **7 lignes du prof** : **Données → Hypothèses → Statistique et sa loi → Calcul → Valeur critique (région) → Décision → Conclusion dans le contexte**.', 'F 3 cas, **H0 : µ = µ0** w **statistique hiya hiya** : 7sebha mra wa7da. Ghir **région critique** katbeddel. F unilatéral, **khalli signe** (bla valeur absolue). Mn ba3d **7 stour dyal l prof** : **Données → Hypothèses → Statistique w loi → 7sab → Valeur critique → Qarar → Conclusion f contexte**.', 'In all 3 cases **H0: µ = µ0** and **the statistic is the same**: compute it once. Only the **critical region** changes. One-sided: **keep the sign**. Then the teacher\'s **7 lines**: **Data → Hypotheses → Statistic and law → Computation → Critical value → Decision → Conclusion in context**.']),

    h(['Exercice 1 — pandas (6 pts) · A. Lire et vérifier', 'Exercice 1 — pandas (6 pts) · A. 9ra w t2akked', 'Exercise 1 — pandas (6 pts) · A. Read and check']),
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


    h(['Exercice 1 · B. Modifier, filtrer, sauvegarder', 'Exercice 1 · B. Beddel, filtri, sauvegardi', 'Exercise 1 · B. Modify, filter, save']),
    p(['6) Colonne `montant` = quantite × prix (2 décimales). 7) Produit et montant des ventes de Rabat. 8) Sauvegarder au format français sans numéros de ligne. 9) Series des notes 12, 15, 9 (Amine, Sara, Yassine) et sa moyenne. 10) Lire les colonnes A à C, 4 lignes, de la feuille « S1 » de `notes.xlsx`.', '6) montant. 7) Rabat. 8) to_csv français. 9) Series. 10) read_excel.', '6) amount. 7) Rabat. 8) French to_csv. 9) Series. 10) read_excel.']),
    tip(['**Comment démarrer** : chaque question = **une instruction**. Créer → `df["col"] = …` ; filtrer → `df[condition]` ; sauvegarder → `to_csv(…, index=False)`.', '**Kifach tbda** : kol so2al = **instruction wa7da**.', '**How to start**: each question = **one instruction**.']),
    demo(['Q6 : nouvelle colonne', 'Q6 : colonne jdida', 'Q6: new column'], `df["montant"] = (df["quantite"] * df["prix"]).round(2)
print(df)`, `         date  ville  produit  quantite    prix  montant
0  02/11/2026  Rabat  Clavier       3.0   149.9    449.7
1  02/11/2026   Casa   Souris       NaN    59.5      NaN
2  03/11/2026  Rabat    Ecran       1.0  1299.0   1299.0
3  03/11/2026    Fes  Clavier       2.0   149.9    299.8
4  04/11/2026   Casa    Ecran       NaN  1299.0      NaN
5  04/11/2026  Rabat   Souris       5.0    59.5    297.5`, { note: ['NaN × prix = **NaN** : pandas ne plante pas, il propage la valeur manquante.', 'NaN × prix = **NaN**.', 'NaN × price = **NaN**.'] }),
    demo(['Q7 : filtrer les lignes, choisir les colonnes', 'Q7 : filtri stour, khtar colonnes', 'Q7: filter rows, pick columns'], `print(df[df["ville"] == "Rabat"][["produit", "montant"]])`, `   produit  montant
0  Clavier    449.7
2    Ecran   1299.0
5   Souris    297.5`),
    demo(['Q8 : sauvegarder au format français', 'Q8 : sauvegardi b format français', 'Q8: save in French format'], `df.to_csv("ventes_montant.csv", sep=";", decimal=",", index=False)`, `date;ville;produit;quantite;prix;montant
02/11/2026;Rabat;Clavier;3,0;149,9;449,7
02/11/2026;Casa;Souris;;59,5;
03/11/2026;Rabat;Ecran;1,0;1299,0;1299,0
03/11/2026;Fes;Clavier;2,0;149,9;299,8
04/11/2026;Casa;Ecran;;1299,0;
04/11/2026;Rabat;Souris;5,0;59,5;297,5`, { note: ['Contenu du fichier écrit. Les NaN deviennent des cases vides.', 'Contenu dyal fichier. NaN → khawi.', 'File content. NaN become empty cells.'] }),
    demo(['Q9–Q10 : Series et read_excel', 'Q9–Q10 : Series w read_excel', 'Q9–Q10: Series and read_excel'], `s = pd.Series([12, 15, 9], index=["Amine", "Sara", "Yassine"])
print(s)
print(s.mean())
notes = pd.read_excel("notes.xlsx", sheet_name="S1", usecols="A:C", nrows=4)`, `Amine      12
Sara       15
Yassine     9
dtype: int64
12.0`),

    h(['Exercice 2 — Loi normale (σ connu) : les 3 cas ≠, <, > (7 pts)', 'Exercice 2 — Loi normale (σ m3rouf) : 3 cas ≠, <, > (7 pts)', 'Exercise 2 — Normal law (σ known): the 3 cases ≠, <, > (7 pts)']),
    p(['Une machine doit remplir des bouteilles de **500 mL**, **σ = 4 mL** (connu). Sur **n = 36** bouteilles, **x̄ = 498,5 mL**. Au risque **5 %** : a) la machine est-elle **déréglée** ? b) remplit-elle en moyenne **moins** de 500 mL ? c) **plus** de 500 mL ? Pour chaque cas : hypothèses, région critique, décision, P-value, conclusion. d) Refaire a) et b) à **1 %**.', 'Machine 500 mL, **σ = 4** (m3rouf), **n = 36**, **x̄ = 498,5**. B risque **5 %** : a) **mderegla** ? b) kat3emmer **a9al** mn 500 ? c) **ktar** mn 500 ? L kol cas : hypothèses, région critique, qarar, P-value, conclusion. d) 3awed a) w b) b **1 %**.', 'Machine set at **500 mL**, **σ = 4** (known), **n = 36**, **x̄ = 498.5**. At **5 %**: a) out of adjustment? b) fills **less** than 500? c) **more**? For each: hypotheses, region, decision, P-value, conclusion. d) Redo a) and b) at **1 %**.']),
    tip(['**Comment démarrer** : σ donné → **Z**. Écris une seule fois les lignes communes (données, statistique, calcul de Z0), puis pour chaque cas : H1, région critique, décision, conclusion.', '**Kifach tbda** : σ m3tia → **Z**. Kteb mra wa7da stour li mchtarkin (données, statistique, 7sab Z0), mn ba3d l kol cas : H1, région, qarar, conclusion.', '**How to start**: σ given → **Z**. Write the shared lines once (data, statistic, Z0), then for each case: H1, region, decision, conclusion.']),
    copy(['Lignes communes aux 3 cas', 'Stour mchtarkin f 3 cas', 'Lines shared by the 3 cases'], null, [
      { l: ['Données', 'Data', 'Data'], b: ['µ0 = 500 ; σ = 4 (**connu**) ; n = 36 ; x̄ = 498,5 ; α = 0,05.', 'µ0 = 500 ; σ = 4 (**m3rouf**) ; n = 36 ; x̄ = 498,5 ; α = 0,05.', 'µ0 = 500; σ = 4 (**known**); n = 36; x̄ = 498.5; α = 0.05.'] },
      { l: ['H0 et loi', 'H0 w loi', 'H0 and law'], b: ['H0 : µ = 500. Sous H0, Z0 = (x̄ − µ0)/(σ/√n) suit **N(0, 1)**.', 'H0 : µ = 500. Sous H0, Z0 ~ **N(0, 1)**.', 'H0: µ = 500. Under H0, Z0 ~ **N(0, 1)**.'] },
      { l: ['Calcul', '7sab', 'Computation'], b: ['σ/√n = 4/6 ≈ 0,667 ; Z0 = −1,5/0,667 = **−2,25**.', 'σ/√n ≈ 0,667 ; Z0 = **−2,25**.', 'σ/√n ≈ 0.667; Z0 = **−2.25**.'], tex: 'Z_0 = \\frac{498{,}5 - 500}{4/\\sqrt{36}} = -2{,}25' }
    ]),
    copy(['a) H1 : µ ≠ 500 — bilatéral', 'a) H1 : µ ≠ 500 — bilatéral', 'a) H1: µ ≠ 500 — two-sided'], null, [
      { l: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['« déréglée » → H0 : µ = 500 contre **H1 : µ ≠ 500**.', '« mderegla » → **H1 : µ ≠ 500**.', '"out of adjustment" → **H1: µ ≠ 500**.'] },
      { l: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['α/2 = 0,025 → z = **1,96** ; région critique : |Z0| > 1,96.', 'α/2 → **1,96** ; |Z0| > 1,96.', 'α/2 → **1.96**; |Z0| > 1.96.'] },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['|Z0| = 2,25 > 1,96 → **on rejette H0**. PV = 2(1 − Φ(2,25)) ≈ **0,0244** < 0,05.', '2,25 > 1,96 → **nrfdou H0**. PV ≈ **0,0244**.', '2.25 > 1.96 → **reject H0**. PV ≈ **0.0244**.'] },
      { l: ['Conclusion', 'Conclusion', 'Conclusion'], b: ['Au risque 5 %, la machine est **déréglée**.', 'B risque 5 %, machine **mderegla**.', 'At 5 %, the machine is **out of adjustment**.'] }
    ]),
    copy(['b) H1 : µ < 500 — unilatéral à gauche', 'b) H1 : µ < 500 — gauche', 'b) H1: µ < 500 — left-tailed'], null, [
      { l: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['« moins de 500 » → H0 : µ = 500 contre **H1 : µ < 500**.', '« a9al » → **H1 : µ < 500**.', '"less" → **H1: µ < 500**.'] },
      { l: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['Tout α à gauche → z(0,05) = **1,645** ; région critique : Z0 < −1,645.', 'α kamla f lisr → **1,645** ; Z0 < −1,645.', 'All α on the left → **1.645**; Z0 < −1.645.'] },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['Z0 = −2,25 < −1,645 → **on rejette H0**. PV = Φ(−2,25) ≈ **0,0122**.', '−2,25 < −1,645 → **nrfdou H0**. PV ≈ **0,0122**.', '−2.25 < −1.645 → **reject H0**. PV ≈ **0.0122**.'] },
      { l: ['Conclusion', 'Conclusion', 'Conclusion'], b: ['Au risque 5 %, la machine remplit en moyenne **moins de 500 mL**.', 'B risque 5 %, kat3emmer **a9al mn 500 mL**.', 'At 5 %, it fills **less than 500 mL** on average.'] }
    ]),
    copy(['c) H1 : µ > 500 — unilatéral à droite', 'c) H1 : µ > 500 — droite', 'c) H1: µ > 500 — right-tailed'], null, [
      { l: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['« plus de 500 » → H0 : µ = 500 contre **H1 : µ > 500**.', '« ktar » → **H1 : µ > 500**.', '"more" → **H1: µ > 500**.'] },
      { l: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['Tout α à droite → **1,645** ; région critique : Z0 > 1,645.', 'α kamla f limen → **1,645** ; Z0 > 1,645.', 'All α on the right → **1.645**; Z0 > 1.645.'] },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['Z0 = −2,25 n\'est pas > 1,645 → **on ne rejette pas H0**. PV = 1 − Φ(−2,25) ≈ **0,9878**.', '−2,25 machi > 1,645 → **ma nrfdouch H0**. PV ≈ **0,9878**.', '−2.25 is not > 1.645 → **do not reject H0**. PV ≈ **0.9878**.'] },
      { l: ['Conclusion', 'Conclusion', 'Conclusion'], b: ['Au risque 5 %, rien ne montre que la machine remplit **plus** de 500 mL.', 'B risque 5 %, ma kayn 7ta dalil belli kat3emmer **ktar**.', 'At 5 %, nothing shows it fills **more** than 500 mL.'] }
    ]),
    table([['Cas', 'Cas', 'Case'], ['Seuil 5 %', 'Seuil 5 %', '5 % threshold'], ['Décision 5 %', 'Qarar 5 %', 'Decision 5 %'], ['Seuil 1 %', 'Seuil 1 %', '1 % threshold'], ['Décision 1 %', 'Qarar 1 %', 'Decision 1 %'], ['P-value', 'P-value', 'P-value']], [
      [['a) ≠', 'a) ≠', 'a) ≠'], '|Z0| > 1,96', ['Rejet', 'Rfed', 'Reject'], '|Z0| > 2,576', ['Non-rejet', 'La', 'Keep'], '0,0244'],
      [['b) <', 'b) <', 'b) <'], 'Z0 < −1,645', ['Rejet', 'Rfed', 'Reject'], 'Z0 < −2,326', ['Non-rejet', 'La', 'Keep'], '0,0122'],
      [['c) >', 'c) >', 'c) >'], 'Z0 > 1,645', ['Non-rejet', 'La', 'Keep'], '—', '—', '0,9878']
    ]),
    trap(['En c), |−2,25| > 1,645 donne envie de rejeter : faux. En unilatéral **on garde le signe** : Z0 est négatif, il va **contre** H1 : µ > 500. Et contrôle-toi avec la P-value : on rejette **si et seulement si PV < α** (d : 0,0244 et 0,0122 sont > 0,01 → non-rejet à 1 %).', 'F c), |−2,25| > 1,645 kaykhllik trfed : ghalat. F unilatéral **khalli signe** : Z0 salib, mchat **dodd** H1. W t2akked b P-value : nrfdou **ghir ila PV < α**.', 'In c) |−2.25| > 1.645 tempts you: wrong. One-sided **keeps the sign**: Z0 goes **against** H1. Check with the P-value: reject **iff PV < α**.']),

    h(['Exercice 3 — Student (σ inconnu) : les 3 cas ≠, >, < (7 pts)', 'Exercice 3 — Student (σ ma m3roufch) : 3 cas ≠, >, < (7 pts)', 'Exercise 3 — Student (σ unknown): the 3 cases ≠, >, < (7 pts)']),
    p([`Un fournisseur annonce une autonomie moyenne de **9,5 h**. 9 batteries mesurées (h) : ${BAT.join(' ; ').replace(/\./g, ',')}. σ **inconnu**. 1) Avec pandas, x̄ et S. 2) Au risque 5 % : a) autonomie **différente** de 9,5 h ? b) **supérieure** ? c) **inférieure** ? 3) Pourquoi a) et b) ne donnent pas la même décision ?`, `Fournisseur : **9,5 h**. 9 batteries : ${BAT.join(' ; ').replace(/\./g, ',')}. σ **ma m3roufch**. 1) B pandas, x̄ w S. 2) B 5 % : a) **mkhtalfa** 3la 9,5 ? b) **ktar** ? c) **a9al** ? 3) 3lach a) w b) ma 3tawch nefs qarar ?`, `Supplier claims **9.5 h**. 9 batteries: ${BAT.join('; ')}. σ **unknown**. 1) x̄ and S with pandas. 2) At 5 %: a) **different** from 9.5 h? b) **greater**? c) **less**? 3) Why do a) and b) disagree?`]),
    tip(['**Comment démarrer** : σ pas donné → **Student**, ν = 9 − 1 = **8**. Calcule x̄ et S (diviseur **n − 1** = `.std()` de pandas), puis T0 une seule fois. Seuils : t(0,025 ; 8) = **2,306** (bilatéral), t(0,05 ; 8) = **1,860** (unilatéral).', '**Kifach tbda** : σ ma m3tiach → **Student**, ν = **8**. 7seb x̄ w S (`.std()` = **n − 1**), mn ba3d T0 mra wa7da. Seuils : **2,306** (bilatéral), **1,860** (unilatéral).', '**How to start**: σ not given → **Student**, ν = **8**. Compute x̄ and S (`.std()` = **n − 1**), then T0 once. Thresholds: **2.306** two-sided, **1.860** one-sided.']),
    demo(['Q1 : x̄ et S avec pandas', 'Q1 : x̄ w S b pandas', 'Q1: x̄ and S with pandas'], `import pandas as pd
x = pd.Series([9.6, 10.1, 9.4, 9.8, 9.9, 9.2, 10.0, 9.5, 9.7])
print(x.mean(), x.std(), len(x))`, `9.68888888888889 0.2934469476943169 9`, { note: ['`.std()` de pandas divise par **n − 1** : c\'est exactement le S du test de Student.', '`.std()` dyal pandas kayfasem 3la **n − 1** : howa S dyal Student.', 'pandas `.std()` divides by **n − 1**: exactly the S of the Student test.'] }),
    copy(['Lignes communes aux 3 cas', 'Stour mchtarkin f 3 cas', 'Lines shared by the 3 cases'], null, [
      { l: ['Données', 'Data', 'Data'], b: ['µ0 = 9,5 ; n = 9 ; x̄ ≈ 9,689 ; S ≈ 0,2934 ; σ **inconnu** ; α = 0,05.', 'µ0 = 9,5 ; n = 9 ; x̄ ≈ 9,689 ; S ≈ 0,2934 ; σ **ma m3roufch**.', 'µ0 = 9.5; n = 9; x̄ ≈ 9.689; S ≈ 0.2934; σ **unknown**.'] },
      { l: ['H0 et loi', 'H0 w loi', 'H0 and law'], b: ['H0 : µ = 9,5. Sous H0, T0 = (x̄ − µ0)/(S/√n) suit **Student à 8 ddl**.', 'H0 : µ = 9,5. Sous H0, T0 ~ **Student ν = 8**.', 'H0: µ = 9.5. Under H0, T0 ~ **Student, 8 df**.'] },
      { l: ['Calcul', '7sab', 'Computation'], b: ['S/√n = 0,2934/3 ≈ 0,0978 ; T0 = 0,1889/0,0978 ≈ **1,93**.', 'S/√n ≈ 0,0978 ; T0 ≈ **1,93**.', 'S/√n ≈ 0.0978; T0 ≈ **1.93**.'], tex: 'T_0 = \\frac{9{,}689 - 9{,}5}{0{,}2934/\\sqrt 9} \\approx 1{,}93' }
    ]),
    copy(['a) H1 : µ ≠ 9,5 — bilatéral', 'a) H1 : µ ≠ 9,5 — bilatéral', 'a) H1: µ ≠ 9.5 — two-sided'], null, [
      { l: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['H0 : µ = 9,5 contre **H1 : µ ≠ 9,5**.', '**H1 : µ ≠ 9,5**.', '**H1: µ ≠ 9.5**.'] },
      { l: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['t(0,025 ; 8) = **2,306** ; région critique : |T0| > 2,306.', '**2,306** ; |T0| > 2,306.', '**2.306**; |T0| > 2.306.'] },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['|T0| = 1,93 < 2,306 → **on ne rejette pas H0** (PV ≈ 0,0896 > 0,05).', '1,93 < 2,306 → **ma nrfdouch H0** (PV ≈ 0,0896).', '1.93 < 2.306 → **do not reject H0** (PV ≈ 0.0896).'] },
      { l: ['Conclusion', 'Conclusion', 'Conclusion'], b: ['Au risque 5 %, on ne peut pas dire que l\'autonomie est **différente** de 9,5 h.', 'B risque 5 %, ma n9drouch ngoulou belli **mkhtalfa** 3la 9,5 h.', 'At 5 %, we cannot say the mean **differs** from 9.5 h.'] }
    ]),
    copy(['b) H1 : µ > 9,5 — unilatéral à droite', 'b) H1 : µ > 9,5 — droite', 'b) H1: µ > 9.5 — right-tailed'], null, [
      { l: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['« supérieure » → H0 : µ = 9,5 contre **H1 : µ > 9,5**.', '« ktar » → **H1 : µ > 9,5**.', '"greater" → **H1: µ > 9.5**.'] },
      { l: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['t(0,05 ; 8) = **1,860** ; région critique : T0 > 1,860.', '**1,860** ; T0 > 1,860.', '**1.860**; T0 > 1.860.'] },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['T0 = 1,93 > 1,860 → **on rejette H0** (PV ≈ 0,0448 < 0,05).', '1,93 > 1,860 → **nrfdou H0** (PV ≈ 0,0448).', '1.93 > 1.860 → **reject H0** (PV ≈ 0.0448).'] },
      { l: ['Conclusion', 'Conclusion', 'Conclusion'], b: ['Au risque 5 %, l\'autonomie moyenne est **supérieure à 9,5 h**.', 'B risque 5 %, autonomie **ktar mn 9,5 h**.', 'At 5 %, the mean is **above 9.5 h**.'] }
    ]),
    copy(['c) H1 : µ < 9,5 — unilatéral à gauche', 'c) H1 : µ < 9,5 — gauche', 'c) H1: µ < 9.5 — left-tailed'], null, [
      { l: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['« inférieure » → H0 : µ = 9,5 contre **H1 : µ < 9,5**.', '« a9al » → **H1 : µ < 9,5**.', '"less" → **H1: µ < 9.5**.'] },
      { l: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['Région critique : T0 < −1,860.', 'T0 < −1,860.', 'T0 < −1.860.'] },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['T0 = 1,93 n\'est pas < −1,860 → **on ne rejette pas H0** (PV ≈ 0,955).', '1,93 machi < −1,860 → **ma nrfdouch H0** (PV ≈ 0,955).', '1.93 is not < −1.860 → **do not reject H0** (PV ≈ 0.955).'] },
      { l: ['Conclusion', 'Conclusion', 'Conclusion'], b: ['Au risque 5 %, rien ne montre une autonomie **inférieure** à 9,5 h.', 'B risque 5 %, ma kayn 7ta dalil 3la autonomie **a9al** mn 9,5 h.', 'At 5 %, nothing shows a mean **below** 9.5 h.'] }
    ]),
    plain(['**Q3 — pourquoi a) et b) ne sont pas d\'accord ?** En bilatéral, α = 5 % est **coupé en deux** (2,5 % de chaque côté) → seuil **2,306**. En unilatéral, **tout α est d\'un seul côté** → seuil **1,860**, plus bas. T0 = 1,93 tombe **entre les deux**. Avec les P-values : PV bilatérale = 2 × 0,0448 = 0,0896 > 0,05, alors que PV droite = 0,0448 < 0,05.', '**Q3 — 3lach a) w b) ma ttaf9ouch ?** F bilatéral, α = 5 % **mt9soum 3la 2** (2,5 % f kol jiha) → **2,306**. F unilatéral, **α kamla f jiha wa7da** → **1,860**, ktar sghir. T0 = 1,93 **binathom**. B P-values : bilatérale = 2 × 0,0448 = 0,0896 > 0,05, droite = 0,0448 < 0,05.', '**Q3 — why do a) and b) disagree?** Two-sided splits α in half → **2.306**; one-sided puts all α on one side → **1.860**. T0 = 1.93 lies **between**. P-values: two-sided 2 × 0.0448 = 0.0896 > 0.05, right 0.0448 < 0.05.']),
    trap(['σ inconnu et n = 9 → **jamais** 1,96 ni 1,645 ; c\'est la table de **Student à ν = 8**, pas 9. Et S se calcule avec **n − 1** (avec n on trouve 0,2767, faux).', 'σ ma m3roufch w n = 9 → **3omrek** 1,96 wla 1,645 ; table **Student ν = 8**, machi 9. W S b **n − 1**.', 'σ unknown and n = 9 → **never** 1.96 or 1.645; use **Student ν = 8**, not 9. And S uses **n − 1**.']),
    exam(['Barème indicatif : Ex. 1 = 6 (0,5 par question + 1 pour la vérification), Ex. 2 = 7 (lignes communes 1,5 ; chaque cas 1,5 ; d) 1), Ex. 3 = 7 (pandas 1 ; lignes communes 1 ; chaque cas 1,5 ; Q3 0,5). Dans un test, chaque ligne rapporte des points, **conclusion dans le contexte** comprise.', 'Barème : Ex. 1 = 6, Ex. 2 = 7, Ex. 3 = 7. F test, kol str fih no9at, 7ta **conclusion f contexte**.', 'Scoring: Ex. 1 = 6, Ex. 2 = 7, Ex. 3 = 7. Each line of a test earns points, **conclusion in context** included.'])
  ],
  keyPoints: [
    L(['pandas : lire (bons paramètres) → vérifier (shape, dtypes, isna) → modifier → sauvegarder (index=False).', 'pandas : 9ra → t2akked → beddel → sauvegardi.', 'pandas: read → check → modify → save.']),
    L(['Une seule statistique pour les 3 cas ; seule la région change : ≠ → |stat| > seuil(α/2) ; < → stat < −seuil(α) ; > → stat > seuil(α).', 'Statistique wa7da l 3 cas ; ghir région katbeddel.', 'One statistic for the 3 cases; only the region changes.']),
    L(['Ex. 2 : Z0 = −2,25 → ≠ rejet, < rejet, > non-rejet ; à 1 % tout non-rejet.', 'Z0 = −2,25 : ≠ rfed, < rfed, > la.', 'Z0 = −2.25: ≠ reject, < reject, > keep.']),
    L(['Ex. 3 : T0 ≈ 1,93 (ν = 8) → ≠ non-rejet (2,306), > rejet (1,860), < non-rejet.', 'T0 ≈ 1,93 : ≠ la, > rfed, < la.', 'T0 ≈ 1.93: ≠ keep, > reject, < keep.'])
  ]
};
