import { L, h, p, def, example, plain, formula, steps, tip, trap, exam, table, quiz, demo, key, anim } from '../../lib';
import type { Chapter } from '../../../src/lib/schema';

/** Rappel (fin du Chap 0) : statistique descriptive et régression linéaire — every number is checked by src/lib/stats. */
export const chapter: Chapter = {
  id: 'rappel',
  module: 'data',
  order: 2,
  title: L(['Chap 0 (suite) — Rappel : statistique descriptive et régression linéaire', 'Fasl 0 (tatimma) — Rappel : statistique descriptive w régression linéaire', 'Ch. 0 (cont.) — Reminder: descriptive statistics and linear regression']),
  summary: L([
    'Moyenne, médiane, mode, variance, écart-type, quartiles, covariance, corrélation et droite des moindres carrés : chaque formule expliquée depuis zéro, puis calculée à la main étape par étape.',
    'Moyenne, médiane, mode, variance, écart-type, quartiles, covariance, corrélation w droite dyal moindres carrés : kol formule mcharha mn zero, w m7souba b lyed étape par étape.',
    'Mean, median, mode, variance, standard deviation, quartiles, covariance, correlation and the least-squares line: every formula explained from zero, then computed by hand step by step.'
  ]),
  estimatedMinutes: 45,
  sections: [
    key([
      '1. **Position** : moyenne = Σx / n ; médiane = valeur du milieu (résiste aux aberrantes) ; mode = la plus fréquente.\n2. **Dispersion** : variance = moyenne des carrés des écarts ; écart-type = √variance ; corrigée → diviser par **n − 1**.\n3. **Quartiles** : Q1, Q3, IQR = Q3 − Q1 (sert au Chap 2).\n4. **Deux variables** : cov(x, y), r = cov / (σx σy) ∈ [−1, 1].\n5. **Régression** : a = cov(x, y) / V(x), b = ȳ − a x̄.',
      '1. **Position** : moyenne = Σx / n ; médiane = l west (ma kat2tharch b aberrantes) ; mode = li ktar tkrar.\n2. **Dispersion** : variance = moyenne dyal mourabba3at l far9 ; écart-type = √variance ; corrigée → 9sem 3la **n − 1**.\n3. **Quartiles** : Q1, Q3, IQR = Q3 − Q1 (kayst3mel f Fasl 2).\n4. **Jouj variables** : cov(x, y), r = cov / (σx σy) ∈ [−1, 1].\n5. **Régression** : a = cov(x, y) / V(x), b = ȳ − a x̄.',
      '1. **Location**: mean = Σx / n; median = middle value (robust to outliers); mode = most frequent.\n2. **Spread**: variance = mean of squared deviations; SD = √variance; corrected → divide by **n − 1**.\n3. **Quartiles**: Q1, Q3, IQR = Q3 − Q1 (used in Ch. 2).\n4. **Two variables**: cov(x, y), r = cov / (σx σy) ∈ [−1, 1].\n5. **Regression**: a = cov(x, y) / V(x), b = ȳ − a x̄.'
    ]),
    h(['1. Le vocabulaire de base', '1. L mofradat l asasiya', '1. Basic vocabulary']),
    table([['Mot', 'Kelma', 'Word'], ['Signification', 'Ma3na', 'Meaning'], ['Exemple', 'Mithal', 'Example']], [
      [['**Population**', '**Population**', '**Population**'], ['Tout le groupe qu\'on étudie', 'Ga3 l groupe li kandrssou', 'The whole group we study'], ['Tous les étudiants de l\'EMSI', 'Ga3 tlamid dyal EMSI', 'All EMSI students']],
      [['**Échantillon**', '**Échantillon** (3ayyina)', '**Sample**'], ['Une partie de la population qu\'on observe vraiment', 'Jouz2 mn population li kanchoufouh b s7', 'The part of the population we actually observe'], ['Les 30 étudiants de 4IIR G22', '30 tlmid dyal 4IIR G22', 'The 30 students of 4IIR G22']],
      [['**Individu**', '**Individu**', '**Individual**'], ['Un élément observé (une ligne du tableau)', 'Element wa7ed (str f tableau)', 'One observed element (one table row)'], ['Un étudiant', 'Tlmid wa7ed', 'One student']],
      [['**Variable quantitative**', '**Variable quantitative**', '**Quantitative variable**'], ['Un nombre qu\'on peut calculer (discrète : 0, 1, 2… ; continue : 12,75…)', 'Raqm li n9dro n7sbouh (discrète : 0, 1, 2… ; continue : 12,75…)', 'A number you can compute with (discrete: 0, 1, 2…; continuous: 12.75…)'], ['Note, âge, salaire', 'Note, 3omr, salaire', 'Mark, age, salary']],
      [['**Variable qualitative**', '**Variable qualitative**', '**Qualitative variable**'], ['Une catégorie, pas un calcul', 'Catégorie, machi 7sab', 'A category, not a calculation'], ['Ville, filière, sexe', 'Mdina, filière, jins', 'City, programme, sex']]
    ]),
    plain(['Dans un tableau pandas (Chap 1), **chaque ligne est un individu** et **chaque colonne est une variable**. Toute la suite du cours repose sur cette image.', 'F tableau dyal pandas (Fasl 1), **kol str howa individu** w **kol colonne hiya variable**. Ga3 dars mbni 3la had tswira.', 'In a pandas table (Ch. 1), **each row is an individual** and **each column is a variable**. The whole course builds on this picture.']),

    h(['2. Les paramètres de position : où se trouve le « centre » ?', '2. Paramètres de position : fin kayn « l west » ?', '2. Measures of location: where is the "centre"?']),
    p([
      'On va tout calculer sur **un seul exemple** : les notes de 5 étudiants au contrôle.\n\n**x = 8 ; 12 ; 10 ; 15 ; 10** (n = 5 valeurs)',
      'Ghadi n7sbou kolchi 3la **mithal wa7ed** : notes dyal 5 tlamid f contrôle.\n\n**x = 8 ; 12 ; 10 ; 15 ; 10** (n = 5 qiyam)',
      'We will compute everything on **one single example**: the test marks of 5 students.\n\n**x = 8 ; 12 ; 10 ; 15 ; 10** (n = 5 values)'
    ]),
    formula('\\bar x = \\frac{1}{n}\\sum_{i=1}^{n} x_i = \\frac{x_1 + x_2 + \\dots + x_n}{n}', [
      '**La moyenne** $\\bar x$ (« x barre ») : on additionne toutes les valeurs, puis on divise par leur nombre. Le symbole $\\sum$ (sigma) veut simplement dire « fais la somme ».',
      '**L moyenne** $\\bar x$ (« x barre ») : kanjem3ou ga3 l qiyam, w kan9ssmou 3la 3adadhom. Rmz $\\sum$ (sigma) ma3nah ghir « jme3 ».',
      '**The mean** $\\bar x$ ("x bar"): add all the values, then divide by how many there are. The symbol $\\sum$ (sigma) simply means "add them up".'
    ]),
    steps(['Calcul de la moyenne, de la médiane et du mode', '7sab l moyenne, l médiane w l mode', 'Computing the mean, the median and the mode'], [
      {
        t: ['Somme des valeurs', 'Majmou3 l qiyam', 'Sum of the values'],
        b: ['On additionne : 8 + 12 + 10 + 15 + 10 = **55**.', 'Kanjem3ou : 8 + 12 + 10 + 15 + 10 = **55**.', 'Add: 8 + 12 + 10 + 15 + 10 = **55**.'],
        tex: '\\sum x_i = 8+12+10+15+10 = 55'
      },
      {
        t: ['Diviser par n', 'Q9sem 3la n', 'Divide by n'],
        b: ['Il y a n = 5 notes, donc la moyenne vaut **11**.', '3andna n = 5 notes, donc l moyenne = **11**.', 'There are n = 5 marks, so the mean is **11**.'],
        tex: '\\bar x = \\frac{55}{5} = 11',
        why: ['La moyenne, c\'est la note que tout le monde aurait si on « partageait » les points équitablement.', 'L moyenne hiya no9ta li kol wa7ed ghadi yakhod ila 9ssmna l points b l 3adl.', 'The mean is the mark everyone would get if the points were shared out equally.']
      },
      {
        t: ['La médiane : trier d\'abord', 'L médiane : rtteb 9bel', 'The median: sort first'],
        b: ['On range dans l\'ordre croissant : **8 ; 10 ; 10 ; 12 ; 15**. n = 5 est impair, la médiane est la valeur du milieu (la 3ᵉ) : **Me = 10**. Si n était pair, on prendrait la moyenne des deux valeurs du milieu.', 'Kanrttbou mn sghir l kbir : **8 ; 10 ; 10 ; 12 ; 15**. n = 5 fardi, l médiane hiya l qima li f l west (talta) : **Me = 10**. Ila kan n zawji, kanakhdou moyenne dyal jouj li f l west.', 'Sort in increasing order: **8 ; 10 ; 10 ; 12 ; 15**. n = 5 is odd, the median is the middle value (the 3rd): **Me = 10**. If n were even, take the mean of the two middle values.'],
        why: ['La médiane coupe les données en deux moitiés : 50 % en dessous, 50 % au-dessus. Elle ne bouge pas si un étudiant a 95 au lieu de 15 : elle **résiste aux valeurs aberrantes**, la moyenne non.', 'L médiane kat9ssem data 3la jouj : 50 % t7t, 50 % fou9. Ma katbeddelch ila chi wa7ed 3ando 95 f blast 15 : hiya **ma kat2tharch b l qiyam l ghriba**, l moyenne la.', 'The median splits the data into two halves: 50 % below, 50 % above. It does not move if one student has 95 instead of 15: it **resists outliers**, the mean does not.']
      },
      {
        t: ['Le mode', 'L mode', 'The mode'],
        b: ['Le **mode** est la valeur la plus fréquente : 10 apparaît 2 fois → **Mo = 10**. C\'est le seul paramètre utilisable pour une variable qualitative (ex. la ville la plus fréquente).', 'L **mode** hiya l qima li ktar tkrar : 10 bant 2 merrat → **Mo = 10**. Hwa l paramètre l wa7id li ymken l variable qualitative (mathalan l mdina li ktar tkrrat).', 'The **mode** is the most frequent value: 10 appears twice → **Mo = 10**. It is the only measure usable for a qualitative variable (e.g. the most frequent city).']
      }
    ]),

    h(['3. Les paramètres de dispersion : les valeurs sont-elles serrées ou étalées ?', '3. Paramètres de dispersion : wach l qiyam mjm3in wla mfrr9in ?', '3. Measures of spread: are the values tight or scattered?']),
    plain([
      'Deux classes peuvent avoir **la même moyenne 11** : l\'une avec des notes 10, 11, 12 (serrées), l\'autre avec 2, 11, 20 (étalées). La moyenne ne voit pas la différence. Il faut une mesure de **dispersion** : la **variance** et l\'**écart-type**.',
      'Jouj a9ssam ymken ykoun 3andhom **nefs l moyenne 11** : wa7ed fih notes 10, 11, 12 (9rib mn ba3dhom), w lakhor 2, 11, 20 (b3ad). L moyenne ma katchoufch l far9. Khassna mesure dyal **dispersion** : **variance** w **écart-type**.',
      'Two classes can have **the same mean 11**: one with marks 10, 11, 12 (tight), the other with 2, 11, 20 (spread out). The mean cannot see the difference. We need a **spread** measure: the **variance** and the **standard deviation**.'
    ]),
    formula('V(x) = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar x)^2 \\qquad \\sigma = \\sqrt{V(x)}', [
      '**Variance** = moyenne des **carrés des écarts** à la moyenne. **Écart-type** σ = racine carrée de la variance (il revient dans la même unité que les données : des points, des euros…).',
      '**Variance** = moyenne dyal **mourabba3at dyal l far9** m3a l moyenne. **Écart-type** σ = jidr dyal variance (kayrje3 b nefs l wa7da dyal data : points, dirhams…).',
      '**Variance** = mean of the **squared deviations** from the mean. **Standard deviation** σ = square root of the variance (back in the data\'s unit: points, dirhams…).'
    ]),
    steps(['Variance et écart-type des notes 8 ; 12 ; 10 ; 15 ; 10', 'Variance w écart-type dyal 8 ; 12 ; 10 ; 15 ; 10', 'Variance and standard deviation of 8 ; 12 ; 10 ; 15 ; 10'], [
      {
        t: ['Écarts à la moyenne', 'L far9 m3a l moyenne', 'Deviations from the mean'],
        b: ['On soustrait $\\bar x = 11$ à chaque note : 8 − 11 = **−3** ; 12 − 11 = **1** ; 10 − 11 = **−1** ; 15 − 11 = **4** ; 10 − 11 = **−1**.', 'Kanna9ssou $\\bar x = 11$ mn kol note : 8 − 11 = **−3** ; 12 − 11 = **1** ; 10 − 11 = **−1** ; 15 − 11 = **4** ; 10 − 11 = **−1**.', 'Subtract $\\bar x = 11$ from each mark: 8 − 11 = **−3** ; 12 − 11 = **1** ; 10 − 11 = **−1** ; 15 − 11 = **4** ; 10 − 11 = **−1**.'],
        why: ['Vérification rapide : la somme des écarts fait toujours 0 (−3 + 1 − 1 + 4 − 1 = 0). C\'est pour ça qu\'on ne peut pas simplement faire la moyenne des écarts.', 'Verification : majmou3 l far9 dima = 0 (−3 + 1 − 1 + 4 − 1 = 0). Hadchi 3lach ma n9droch ndirou ghir moyenne dyal l far9.', 'Quick check: deviations always add up to 0 (−3 + 1 − 1 + 4 − 1 = 0). That is why we cannot just average the deviations.']
      },
      {
        t: ['Mettre au carré', 'Dir l mourabba3', 'Square them'],
        b: ['(−3)² = **9** ; 1² = **1** ; (−1)² = **1** ; 4² = **16** ; (−1)² = **1**. Le carré supprime les signes moins.', '(−3)² = **9** ; 1² = **1** ; (−1)² = **1** ; 4² = **16** ; (−1)² = **1**. L mourabba3 kay7iyed l signe na9ss.', '(−3)² = **9** ; 1² = **1** ; (−1)² = **1** ; 4² = **16** ; (−1)² = **1**. Squaring removes the minus signs.']
      },
      {
        t: ['Somme des carrés', 'Majmou3 l mourabba3at', 'Sum of squares'],
        b: ['9 + 1 + 1 + 16 + 1 = **28**.', '9 + 1 + 1 + 16 + 1 = **28**.', '9 + 1 + 1 + 16 + 1 = **28**.'],
        tex: '\\sum (x_i-\\bar x)^2 = 28'
      },
      {
        t: ['Variance', 'Variance', 'Variance'],
        b: ['On divise par n = 5 : **V = 5,6**.', 'Kan9ssmou 3la n = 5 : **V = 5,6**.', 'Divide by n = 5: **V = 5.6**.'],
        tex: 'V(x) = \\frac{28}{5} = 5{,}6'
      },
      {
        t: ['Écart-type', 'Écart-type', 'Standard deviation'],
        b: ['On prend la racine : **σ ≈ 2,37 points**. En moyenne, une note s\'éloigne d\'environ 2,4 points de 11.', 'Kanakhdou l jidr : **σ ≈ 2,37 points**. F l moyenne, note kat-b3ed b ta9riban 2,4 points 3la 11.', 'Take the square root: **σ ≈ 2.37 points**. On average, a mark is about 2.4 points away from 11.'],
        tex: '\\sigma = \\sqrt{5{,}6} \\approx 2{,}37'
      }
    ]),
    trap([
      '**n ou n − 1 ?** Sur un **échantillon** on utilise souvent la variance **corrigée** $S^2 = \\frac{1}{n-1}\\sum (x_i-\\bar x)^2$. Ici : 28 / 4 = **7**, donc S ≈ **2,65**. Attention : **pandas `.var()` et `.std()` divisent par n − 1** par défaut, alors que **NumPy `np.var()` divise par n**. C\'est ce S (avec n − 1) qu\'on utilise dans le test de Student (Chap 5).',
      '**n wla n − 1 ?** F **échantillon** ghaliban kanst3mlou variance **corrigée** $S^2 = \\frac{1}{n-1}\\sum (x_i-\\bar x)^2$. Hna : 28 / 4 = **7**, donc S ≈ **2,65**. 3endak : **pandas `.var()` w `.std()` kay9ssmou 3la n − 1** par défaut, walakin **NumPy `np.var()` kay9ssem 3la n**. Had S (b n − 1) howa li kanst3mlou f test de Student (Fasl 5).',
      '**n or n − 1?** On a **sample** we often use the **corrected** variance $S^2 = \\frac{1}{n-1}\\sum (x_i-\\bar x)^2$. Here: 28 / 4 = **7**, so S ≈ **2.65**. Careful: **pandas `.var()` and `.std()` divide by n − 1** by default, whereas **NumPy `np.var()` divides by n**. This S (with n − 1) is the one used in the Student test (Ch. 5).'
    ]),

    h(['4. Les quartiles et l\'écart interquartile (IQR)', '4. Les quartiles w l IQR', '4. Quartiles and the interquartile range (IQR)']),
    anim('MeanMedianShapes'),
    def([
      '**Q1** (1er quartile) : 25 % des valeurs sont en dessous. **Q2** = la médiane (50 %). **Q3** (3e quartile) : 75 % des valeurs sont en dessous. **IQR = Q3 − Q1** mesure la largeur des 50 % du milieu. C\'est l\'outil du Chap 2 pour détecter les **valeurs aberrantes**.',
      '**Q1** : 25 % dyal l qiyam t7tou. **Q2** = l médiane (50 %). **Q3** : 75 % dyal l qiyam t7tou. **IQR = Q3 − Q1** kay9is l 3ard dyal 50 % li f l west. Hada howa l outil dyal Fasl 2 bach nkchfou **valeurs aberrantes**.',
      '**Q1** (1st quartile): 25 % of the values are below it. **Q2** = the median (50 %). **Q3** (3rd quartile): 75 % are below it. **IQR = Q3 − Q1** measures the width of the middle 50 %. It is the Ch. 2 tool to detect **outliers**.'
    ]),
    example([
      'Notes triées **8 ; 10 ; 10 ; 12 ; 15**. Avec la convention de pandas (`df.quantile(0.25)`), la position de Q1 est (n − 1) × 0,25 = 1 → Q1 = **10** ; la position de Q3 est (n − 1) × 0,75 = 3 → Q3 = **12**. Donc **IQR = 12 − 10 = 2**.',
      'Notes mrttbin **8 ; 10 ; 10 ; 12 ; 15**. B tari9a dyal pandas (`df.quantile(0.25)`), blasat Q1 = (n − 1) × 0,25 = 1 → Q1 = **10** ; blasat Q3 = (n − 1) × 0,75 = 3 → Q3 = **12**. Donc **IQR = 12 − 10 = 2**.',
      'Sorted marks **8 ; 10 ; 10 ; 12 ; 15**. With pandas\' convention (`df.quantile(0.25)`), the position of Q1 is (n − 1) × 0.25 = 1 → Q1 = **10**; the position of Q3 is (n − 1) × 0.75 = 3 → Q3 = **12**. So **IQR = 12 − 10 = 2**.'
    ]),
    tip(['Les positions commencent à 0 (comme les index Python) : position 0 = 8, position 1 = 10, position 2 = 10, position 3 = 12, position 4 = 15. Si la position tombe entre deux valeurs (ex. 2,5), on prend le point au milieu entre elles.', 'Les positions kaybdaw mn 0 (b7al index f Python) : position 0 = 8, 1 = 10, 2 = 10, 3 = 12, 4 = 15. Ila position jat bin jouj qiyam (mathalan 2,5), kanakhdou n9ta li f l west binathom.', 'Positions start at 0 (like Python indexes): position 0 = 8, 1 = 10, 2 = 10, 3 = 12, 4 = 15. If the position falls between two values (e.g. 2.5), take the point halfway between them.']),

    h(['5. Deux variables : covariance et corrélation', '5. Jouj variables : covariance w corrélation', '5. Two variables: covariance and correlation']),
    anim('CorrelationShapes'),
    p([
      'Maintenant on observe **deux variables** sur les mêmes étudiants : **x = heures de révision**, **y = note /10**.\n\n**x = 1 ; 2 ; 3 ; 4 ; 5** et **y = 2 ; 4 ; 5 ; 4 ; 5**.\n\nQuestion : **plus on révise, plus la note monte-t-elle ?**',
      'Daba kanchoufou **jouj variables** 3la nefs tlamid : **x = sa3at d révision**, **y = note /10**.\n\n**x = 1 ; 2 ; 3 ; 4 ; 5** w **y = 2 ; 4 ; 5 ; 4 ; 5**.\n\nSou2al : **wach kolma rajje3ti ktar, kolma note tal3a ?**',
      'Now we observe **two variables** on the same students: **x = revision hours**, **y = mark /10**.\n\n**x = 1 ; 2 ; 3 ; 4 ; 5** and **y = 2 ; 4 ; 5 ; 4 ; 5**.\n\nQuestion: **does the mark go up when students revise more?**'
    ]),
    formula('\\mathrm{cov}(x,y) = \\frac{1}{n}\\sum_{i=1}^{n}(x_i-\\bar x)(y_i-\\bar y) \\qquad r = \\frac{\\mathrm{cov}(x,y)}{\\sigma_x\\,\\sigma_y}', [
      '**Covariance** : positive si x et y montent ensemble, négative si l\'un monte quand l\'autre descend. **Coefficient de corrélation r** : la covariance « mise à l\'échelle », toujours entre **−1 et +1**.',
      '**Covariance** : mojaba ila x w y kaytl3ou m3a ba3d, salba ila wa7ed tal3 w lakhor habet. **Coefficient de corrélation r** : covariance « m9ada », dima bin **−1 w +1**.',
      '**Covariance**: positive if x and y rise together, negative if one rises while the other falls. **Correlation coefficient r**: the covariance "rescaled", always between **−1 and +1**.'
    ]),
    steps(['Calcul de la covariance et de r', '7sab covariance w r', 'Computing the covariance and r'], [
      {
        t: ['Les deux moyennes', 'Jouj moyennes', 'The two means'],
        b: ['$\\bar x = (1+2+3+4+5)/5 = 15/5 = 3$ et $\\bar y = (2+4+5+4+5)/5 = 20/5 = 4$.', '$\\bar x = 15/5 = 3$ w $\\bar y = 20/5 = 4$.', '$\\bar x = 15/5 = 3$ and $\\bar y = 20/5 = 4$.']
      },
      {
        t: ['Les écarts de chaque variable', 'L far9 dyal kol variable', 'Deviations of each variable'],
        b: ['x − 3 : **−2 ; −1 ; 0 ; 1 ; 2**\ny − 4 : **−2 ; 0 ; 1 ; 0 ; 1**', 'x − 3 : **−2 ; −1 ; 0 ; 1 ; 2**\ny − 4 : **−2 ; 0 ; 1 ; 0 ; 1**', 'x − 3: **−2 ; −1 ; 0 ; 1 ; 2**\ny − 4: **−2 ; 0 ; 1 ; 0 ; 1**']
      },
      {
        t: ['Produits des écarts, puis moyenne', 'Dreb l far9at, 3ad moyenne', 'Multiply the deviations, then average'],
        b: ['(−2)(−2) = 4 ; (−1)(0) = 0 ; (0)(1) = 0 ; (1)(0) = 0 ; (2)(1) = 2. Somme = **6**, donc cov = 6 / 5 = **1,2** > 0 : les deux variables **montent ensemble**.', '(−2)(−2) = 4 ; (−1)(0) = 0 ; 0 ; 0 ; (2)(1) = 2. Majmou3 = **6**, donc cov = 6 / 5 = **1,2** > 0 : jouj variables **kaytl3ou m3a ba3d**.', '(−2)(−2) = 4 ; (−1)(0) = 0 ; 0 ; 0 ; (2)(1) = 2. Sum = **6**, so cov = 6 / 5 = **1.2** > 0: both variables **rise together**.'],
        tex: '\\mathrm{cov}(x,y) = \\frac{4+0+0+0+2}{5} = 1{,}2'
      },
      {
        t: ['Les deux écarts-types', 'Jouj écarts-types', 'The two standard deviations'],
        b: ['Carrés des écarts de x : 4, 1, 0, 1, 4 → somme 10 → V(x) = 2 → σx ≈ 1,414. Carrés des écarts de y : 4, 0, 1, 0, 1 → somme 6 → V(y) = 1,2 → σy ≈ 1,095.', 'Mourabba3at x : 4, 1, 0, 1, 4 → 10 → V(x) = 2 → σx ≈ 1,414. Mourabba3at y : 4, 0, 1, 0, 1 → 6 → V(y) = 1,2 → σy ≈ 1,095.', 'Squared x deviations: 4, 1, 0, 1, 4 → 10 → V(x) = 2 → σx ≈ 1.414. Squared y deviations: 4, 0, 1, 0, 1 → 6 → V(y) = 1.2 → σy ≈ 1.095.']
      },
      {
        t: ['Le coefficient r', 'L coefficient r', 'The coefficient r'],
        b: ['r = 1,2 / (1,414 × 1,095) ≈ **0,775**. Proche de +1 → **liaison linéaire positive assez forte**.', 'r = 1,2 / (1,414 × 1,095) ≈ **0,775**. 9rib l +1 → **3ala9a khattiya mojaba 9wiya chwiya**.', 'r = 1.2 / (1.414 × 1.095) ≈ **0.775**. Close to +1 → **fairly strong positive linear relationship**.'],
        tex: 'r = \\frac{1{,}2}{\\sqrt{2}\\,\\sqrt{1{,}2}} \\approx 0{,}775'
      }
    ]),
    table([['Valeur de r', 'Qimat r', 'Value of r'], ['Interprétation', 'Tafsir', 'Interpretation']], [
      ['r = +1', ['Les points sont exactement sur une droite qui monte', 'Les points kamlin 3la khatt tal3', 'Points exactly on a rising line']],
      ['0,7 < r < 1', ['Liaison positive forte', '3ala9a mojaba 9wiya', 'Strong positive link']],
      ['r ≈ 0', ['Pas de liaison **linéaire** (il peut y avoir une liaison courbe)', 'Ma kaynach 3ala9a **khattiya** (ymken tkoun mo3wjja)', 'No **linear** link (there may be a curved one)']],
      ['r < 0', ['Quand x monte, y descend', 'Mli x tal3, y habet', 'When x rises, y falls']],
      ['r = −1', ['Exactement sur une droite qui descend', 'Kamlin 3la khatt habet', 'Exactly on a falling line']]
    ]),
    trap(['**Corrélation ≠ causalité.** Les ventes de glaces et les noyades sont corrélées… parce qu\'il fait chaud. r mesure une liaison, pas une cause.', '**Corrélation ≠ sababiya.** Bi3 d glace w l gher9 mrboutin… 7it kayn s-sh-sh (l7ar). r kay9is 3ala9a, machi sabab.', '**Correlation ≠ causation.** Ice-cream sales and drownings are correlated… because it is hot. r measures a link, not a cause.']),

    h(['6. La régression linéaire simple (moindres carrés)', '6. Régression linéaire simple (moindres carrés)', '6. Simple linear regression (least squares)']),
    def([
      'On cherche la **droite** $\\hat y = a\\,x + b$ qui passe « au plus près » des points. « Au plus près » = elle rend **minimale la somme des carrés des erreurs** $\\sum (y_i - \\hat y_i)^2$ : c\'est la méthode des **moindres carrés**. **a** est la pente (combien y gagne quand x augmente de 1), **b** l\'ordonnée à l\'origine (la valeur de y quand x = 0).',
      'Kanqellbou 3la **khatt** $\\hat y = a\\,x + b$ li kaydouz « 9rib b zaf » mn les points. « 9rib bzaf » = kay-rje3 **majmou3 mourabba3at l akhta2** $\\sum (y_i - \\hat y_i)^2$ **sghir ma ymken** : hadi hiya tari9at **moindres carrés**. **a** hiya l pente (ch7al katzid y mli x katzid b 1), **b** hiya l qima dyal y mli x = 0.',
      'We look for the **line** $\\hat y = a\\,x + b$ that passes "as close as possible" to the points. "As close as possible" = it **minimises the sum of squared errors** $\\sum (y_i - \\hat y_i)^2$: the **least-squares** method. **a** is the slope (how much y gains when x increases by 1), **b** the intercept (the value of y when x = 0).'
    ]),
    formula('a = \\frac{\\mathrm{cov}(x,y)}{V(x)} \\qquad b = \\bar y - a\\,\\bar x \\qquad R^2 = r^2', [
      'Les deux formules à connaître par cœur. Le **R²** dit quelle part de la variation de y est expliquée par x (entre 0 et 1).',
      'Jouj formules khassek t7fedhom. **R²** kaygoul ch7al mn tbeddol dyal y mfssr b x (bin 0 w 1).',
      'The two formulas to know by heart. **R²** tells what share of the variation of y is explained by x (between 0 and 1).'
    ]),
    steps(['La droite de régression note = a × heures + b', 'Droite dyal régression note = a × sa3at + b', 'The regression line mark = a × hours + b'], [
      {
        t: ['Calculer la pente a', '7seb l pente a', 'Compute the slope a'],
        b: ['On réutilise les calculs d\'avant : cov(x, y) = 1,2 et V(x) = 2. Donc **a = 0,6**.', 'Kan3awdou nst3mlou l 7sab li fat : cov(x, y) = 1,2 w V(x) = 2. Donc **a = 0,6**.', 'Reuse the previous results: cov(x, y) = 1.2 and V(x) = 2. So **a = 0.6**.'],
        tex: 'a = \\frac{1{,}2}{2} = 0{,}6',
        why: ['Chaque heure de révision en plus rapporte en moyenne **0,6 point**.', 'Kol sa3a zayda d révision kat3ti f l moyenne **0,6 point**.', 'Each extra revision hour brings on average **0.6 point**.']
      },
      {
        t: ['Calculer b', '7seb b', 'Compute b'],
        b: ['La droite passe toujours par le point moyen $(\\bar x, \\bar y) = (3, 4)$. Donc b = 4 − 0,6 × 3 = **2,2**.', 'L khatt dima kaydouz mn n9ta l moyenne $(\\bar x, \\bar y) = (3, 4)$. Donc b = 4 − 0,6 × 3 = **2,2**.', 'The line always goes through the mean point $(\\bar x, \\bar y) = (3, 4)$. So b = 4 − 0.6 × 3 = **2.2**.'],
        tex: 'b = 4 - 0{,}6 \\times 3 = 2{,}2'
      },
      {
        t: ['Écrire l\'équation', 'Kteb l mo3adala', 'Write the equation'],
        b: ['**ŷ = 0,6 x + 2,2**.', '**ŷ = 0,6 x + 2,2**.', '**ŷ = 0.6 x + 2.2**.']
      },
      {
        t: ['Prédire', 'Tnba2', 'Predict'],
        b: ['Un étudiant qui révise **6 heures** : ŷ = 0,6 × 6 + 2,2 = **5,8 / 10**. C\'est l\'analyse **prédictive** du Chap 0.', 'Tlmid li rajje3 **6 sa3at** : ŷ = 0,6 × 6 + 2,2 = **5,8 / 10**. Hadi hiya analyse **prédictive** dyal Fasl 0.', 'A student who revises **6 hours**: ŷ = 0.6 × 6 + 2.2 = **5.8 / 10**. This is the **predictive** analysis of Ch. 0.']
      },
      {
        t: ['Qualité de l\'ajustement', 'Jawda dyal l khatt', 'Quality of the fit'],
        b: ['R² = r² = 0,775² ≈ **0,60** : les heures de révision expliquent environ **60 %** des différences de notes. Le reste vient d\'autres facteurs (sommeil, niveau de départ…).', 'R² = r² ≈ **0,60** : sa3at d révision kayfssrou ta9riban **60 %** mn l far9 f notes. L ba9i jay mn 7wayej khrin (n3as, l mostawa…).', 'R² = r² ≈ **0.60**: revision hours explain about **60 %** of the differences in marks. The rest comes from other factors (sleep, prior level…).']
      }
    ]),
    exam(['Au contrôle, présente toujours : **1)** les moyennes, **2)** cov(x, y) et V(x), **3)** a puis b, **4)** l\'équation, **5)** la prédiction ou l\'interprétation de a. Chaque étape rapporte des points, même si le résultat final est faux.', 'F contrôle, dima 9addem : **1)** les moyennes, **2)** cov(x, y) w V(x), **3)** a 3ad b, **4)** l mo3adala, **5)** l prédiction wla tafsir dyal a. Kol étape fiha points, wakha natija l akhira tkoun ghalta.', 'In the test, always show: **1)** the means, **2)** cov(x, y) and V(x), **3)** a then b, **4)** the equation, **5)** the prediction or the meaning of a. Every step earns points, even if the final result is wrong.']),

    h(['7. Les mêmes calculs en Python', '7. Nefs l 7sabat b Python', '7. The same calculations in Python']),
    demo(['Position et dispersion d\'une série', 'Position w dispersion dyal série', 'Location and spread of a series'], `import pandas as pd

notes = pd.Series([8, 12, 10, 15, 10])
print(notes.mean(), notes.median(), notes.mode()[0])
print(notes.var(ddof=0))    # divise par n
print(notes.var())          # divise par n - 1 (défaut pandas)
print(notes.quantile([0.25, 0.75]))`, `11.0 10.0 10
5.6
7.0
0.25    10.0
0.75    12.0
dtype: float64`, { note: ['Au contrôle, précise toujours le diviseur : **n** (variance de la série, 5,6) ou **n − 1** (variance corrigée, 7,0).', 'F contrôle, goul dima l diviseur : **n** (5,6) wla **n − 1** (corrigée, 7,0).', 'In the test always state the divisor: **n** (5.6) or **n − 1** (corrected, 7.0).'] }),
    demo(['describe() : le résumé complet', 'describe() : lkhoulasa kamla', 'describe(): the full summary'], `print(notes.describe())`, `count     5.000000
mean     11.000000
std       2.645751
min       8.000000
25%      10.000000
50%      10.000000
75%      12.000000
max      15.000000
dtype: float64`, { note: ['`std` = √7 ≈ 2,646 : pandas utilise **n − 1**. `50%` est la médiane.', '`std` = √7 ≈ 2,646 : pandas kayst3mel **n − 1**. `50%` hiya médiane.', '`std` = √7 ≈ 2.646: pandas uses **n − 1**. `50%` is the median.'] }),
    demo(['Corrélation et droite des moindres carrés', 'Corrélation w droite dyal moindres carrés', 'Correlation and least-squares line'], `import numpy as np

df = pd.DataFrame({"heures": [1, 2, 3, 4, 5], "note": [2, 4, 5, 4, 5]})
print(round(df["heures"].corr(df["note"]), 4))
a, b = np.polyfit(df["heures"], df["note"], 1)
print(round(a, 4), round(b, 4))`, `0.7746
0.6 2.2`, { note: ['On retrouve r ≈ 0,775 et ŷ = 0,6 x + 2,2 calculés à la main plus haut.', 'Nefs r ≈ 0,775 w ŷ = 0,6 x + 2,2 li 7sebna b lyed.', 'Same r ≈ 0.775 and ŷ = 0.6 x + 2.2 as computed by hand above.'] }),
    quiz('dr-01', 'dr-03', 'dr-05', 'dr-08')
  ],
  keyPoints: [
    L(['Moyenne = somme / n ; médiane = valeur du milieu après tri (résiste aux valeurs aberrantes) ; mode = valeur la plus fréquente.', 'Moyenne = majmou3 / n ; médiane = l west mn b3d tartib ; mode = li ktar tkrar.', 'Mean = sum / n; median = middle value after sorting (robust to outliers); mode = most frequent value.']),
    L(['Variance = moyenne des carrés des écarts ; écart-type = sa racine. pandas `.var()`/`.std()` divisent par n − 1, NumPy par n.', 'Variance = moyenne dyal mourabba3at l far9 ; écart-type = jidrha. pandas b n − 1, NumPy b n.', 'Variance = mean of squared deviations; standard deviation = its square root. pandas `.var()`/`.std()` use n − 1, NumPy uses n.']),
    L(['Q1, Q3 et IQR = Q3 − Q1 : base de la détection des valeurs aberrantes (Chap 2).', 'Q1, Q3 w IQR = Q3 − Q1 : asas dyal kachf l qiyam l ghriba (Fasl 2).', 'Q1, Q3 and IQR = Q3 − Q1: the basis of outlier detection (Ch. 2).']),
    L(['cov(x, y) = moyenne des produits des écarts ; r = cov / (σx σy), entre −1 et 1 ; corrélation ≠ causalité.', 'cov = moyenne dyal produits ; r bin −1 w 1 ; corrélation ≠ sababiya.', 'cov = mean of products of deviations; r = cov / (σx σy), between −1 and 1; correlation ≠ causation.']),
    L(['Moindres carrés : a = cov(x, y) / V(x), b = ȳ − a x̄, R² = r². Exemple : ŷ = 0,6 x + 2,2.', 'Moindres carrés : a = cov / V(x), b = ȳ − a x̄, R² = r².', 'Least squares: a = cov(x, y) / V(x), b = ȳ − a x̄, R² = r². Example: ŷ = 0.6 x + 2.2.'])
  ]
};
