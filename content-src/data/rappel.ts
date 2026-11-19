import { setCtx, single, num, multi, ex, fc, ref } from '../lib';
export { chapter } from './course/rappel';

setCtx('data', 'rappel');

const NOTES = [8, 12, 10, 15, 10];
const X = [1, 2, 3, 4, 5];
const Y = [2, 4, 5, 4, 5];

export const questions = [
  num('dr-01', 1, ['Notes 8 ; 12 ; 10 ; 15 ; 10 : calcule la moyenne.', 'Notes 8 ; 12 ; 10 ; 15 ; 10 : 7seb l moyenne.', 'Marks 8 ; 12 ; 10 ; 15 ; 10: compute the mean.'], 11, 0.001,
    ['Somme = 55, n = 5 → $\\bar x = 55/5 = 11$.', 'Majmou3 = 55, n = 5 → 11.', 'Sum = 55, n = 5 → 11.'],
    { '10': ['10 est la médiane (et le mode), pas la moyenne.', '10 hiya l médiane.', '10 is the median (and mode).'] }, ['descriptive', 'moyenne'], { fn: 'mean', args: [NOTES] }),
  num('dr-02', 1, ['Même série : la médiane ?', 'Nefs série : l médiane ?', 'Same data: the median?'], 10, 0.001,
    ['Trier : 8 ; 10 ; **10** ; 12 ; 15 → valeur du milieu = 10.', 'Rtteb : 8 ; 10 ; **10** ; 12 ; 15 → 10.', 'Sort: 8 ; 10 ; **10** ; 12 ; 15 → 10.'],
    { '12': ['Tu as pris la valeur du milieu sans trier.', 'Ma rttebtich.', 'You did not sort first.'] }, ['descriptive', 'mediane'], { fn: 'median', args: [NOTES] }),
  num('dr-03', 2, ['Même série : variance (diviseur n).', 'Nefs série : variance (9sem 3la n).', 'Same data: variance (divide by n).'], 5.6, 0.01,
    ['Écarts −3, 1, −1, 4, −1 → carrés 9, 1, 1, 16, 1 → somme 28 → 28/5 = **5,6**.', '28/5 = 5,6.', 'Squares sum to 28 → 28/5 = **5.6**.'],
    { '7': ['7 = variance corrigée (n − 1). La question demande n.', 'Hadi b n − 1.', 'That is the n − 1 version.'], '0': ['La somme des écarts fait 0 : il faut les mettre au carré.', 'Khass l mourabba3.', 'Square the deviations.'] }, ['descriptive', 'variance'], { fn: 'popVariance', args: [NOTES] }),
  num('dr-04', 2, ['Même série : écart-type corrigé S (diviseur n − 1), 2 décimales.', 'Écart-type corrigé S (n − 1) ?', 'Corrected standard deviation S (n − 1), 2 decimals.'], 2.65, 0.01,
    ['$S = \\sqrt{28/4} = \\sqrt 7 \\approx 2{,}65$ — c\'est ce que renvoie pandas `.std()`.', '$\\sqrt 7 \\approx 2{,}65$.', '$\\sqrt 7 \\approx 2.65$ — what pandas `.std()` returns.'],
    { '2.37': ['2,37 = écart-type avec diviseur n.', 'Hada b n.', 'That uses n.'] }, ['descriptive', 'variance'], { fn: 'sampleSd', args: [NOTES] }),
  single('dr-05', 1, ['Quel paramètre résiste le mieux à une valeur aberrante ?', 'Ina paramètre ma kayt2tharch b qima ghriba ?', 'Which measure best resists an outlier?'],
    [['La médiane', 'L médiane', 'The median'], ['La moyenne', 'L moyenne', 'The mean'], ['La variance', 'Variance', 'The variance'], ['L\'étendue (max − min)', 'L\'étendue', 'The range']], 0,
    ['La médiane ne dépend que de la valeur du milieu : remplacer 15 par 95 ne la change pas.', 'L médiane kat3tamed ghir 3la l west.', 'The median only depends on the middle value.'],
    [['La moyenne utilise toutes les valeurs : 95 la ferait exploser.', 'L moyenne kat2tharr.', 'The mean uses every value.'], ['La variance (carrés des écarts) est encore plus sensible.', 'Variance ktar.', 'Variance is even more sensitive.'], ['L\'étendue dépend directement du max.', 'Kat3tamed 3la max.', 'Range depends on the max.']], ['descriptive', 'mediane']),
  single('dr-06', 2, ['`df["note"].std()` en pandas calcule…', '`df["note"].std()` f pandas kay7seb…', 'In pandas, `df["note"].std()` computes…'],
    [['l\'écart-type avec diviseur n − 1', 'écart-type b n − 1', 'the standard deviation with n − 1'], ['l\'écart-type avec diviseur n', 'b n', 'with n'], ['la variance', 'variance', 'the variance'], ['l\'écart interquartile', 'IQR', 'the IQR']], 0,
    ['Par défaut `ddof=1` → diviseur n − 1. Pour diviser par n : `std(ddof=0)`.', 'Par défaut ddof=1.', 'Default `ddof=1` → n − 1.'],
    [['C\'est NumPy `np.std()` qui divise par n par défaut.', 'NumPy hwa li b n.', 'NumPy uses n by default.'], ['`.var()` donne la variance ; `.std()` sa racine.', '.var() hiya variance.', '`.var()` is the variance.'], ['L\'IQR se calcule avec `quantile`.', 'quantile.', 'IQR uses `quantile`.']], ['descriptive', 'pandas']),
  num('dr-07', 2, ['Notes 8 ; 10 ; 10 ; 12 ; 15 (convention pandas) : IQR = Q3 − Q1 ?', 'IQR (pandas) ?', 'IQR (pandas convention)?'], 2, 0.001,
    ['Q1 (position 1) = 10, Q3 (position 3) = 12 → IQR = **2**.', 'Q1 = 10, Q3 = 12 → 2.', 'Q1 = 10, Q3 = 12 → **2**.'], {}, ['descriptive', 'quartiles'], { fn: 'iqrBounds', args: [NOTES], pick: 'iqr' }),
  num('dr-08', 2, ['x = 1…5 (heures), y = 2 ; 4 ; 5 ; 4 ; 5 (notes) : covariance (diviseur n) ?', 'Covariance (n) ?', 'Covariance (divide by n)?'], 1.2, 0.001,
    ['Produits des écarts : 4, 0, 0, 0, 2 → somme 6 → 6/5 = **1,2**.', '6/5 = 1,2.', 'Products 4, 0, 0, 0, 2 → 6/5 = **1.2**.'],
    { '1.5': ['1,5 = 6/4 : covariance corrigée (n − 1).', 'b n − 1.', 'That is the n − 1 version.'] }, ['regression', 'covariance'], { fn: 'covariance', args: [X, Y] }),
  num('dr-09', 2, ['Même données : coefficient de corrélation r (3 décimales).', 'r ?', 'Correlation coefficient r (3 decimals)?'], 0.775, 0.002,
    ['$r = \\frac{1{,}2}{\\sqrt 2 \\sqrt{1{,}2}} \\approx 0{,}775$', 'r ≈ 0,775.', 'r ≈ 0.775.'], {}, ['regression', 'correlation'], { fn: 'correlation', args: [X, Y] }),
  num('dr-10', 2, ['Même données : pente a de la droite des moindres carrés.', 'L pente a ?', 'Slope a of the least-squares line?'], 0.6, 0.001,
    ['a = cov / V(x) = 1,2 / 2 = **0,6**.', '1,2 / 2.', '1.2 / 2 = **0.6**.'],
    { '1.2': ['Tu as oublié de diviser par V(x) = 2.', 'Na9es / V(x).', 'Divide by V(x) = 2.'] }, ['regression', 'mco'], { fn: 'linReg', args: [X, Y], pick: 'a' }),
  num('dr-11', 2, ['Même données : ordonnée à l\'origine b.', 'b ?', 'Intercept b?'], 2.2, 0.001,
    ['b = ȳ − a x̄ = 4 − 0,6 × 3 = **2,2**.', '4 − 1,8.', '4 − 1.8 = **2.2**.'], {}, ['regression', 'mco'], { fn: 'linReg', args: [X, Y], pick: 'b' }),
  num('dr-12', 1, ['Avec ŷ = 0,6 x + 2,2, quelle note prédire pour 6 heures ?', 'ŷ l 6 sa3at ?', 'Predicted mark for 6 hours?'], 5.8, 0.001,
    ['0,6 × 6 + 2,2 = **5,8**.', '3,6 + 2,2.', '3.6 + 2.2 = **5.8**.'], {}, ['regression', 'prediction'], { fn: 'arith', args: [5.8] }),
  multi('dr-13', 2, ['Quelles affirmations sur r sont vraies ?', 'Chnou s7i7 3la r ?', 'Which statements about r are true?'],
    [['r est toujours entre −1 et 1', 'r dima bin −1 w 1', 'r is always between −1 and 1'], ['r < 0 : quand x augmente, y a tendance à diminuer', 'r < 0 : x tal3, y habet', 'r < 0: as x rises, y tends to fall'], ['r = 0,9 prouve que x cause y', 'r = 0,9 = sabab', 'r = 0.9 proves x causes y'], ['r ≈ 0 prouve qu\'il n\'y a aucune liaison', 'r ≈ 0 = walou', 'r ≈ 0 proves there is no link at all']], [0, 1],
    ['r mesure une liaison **linéaire**, entre −1 et 1. Le signe donne le sens.', 'r = 3ala9a khattiya.', 'r measures a **linear** link, between −1 and 1.'],
    [['Corrélation ≠ causalité.', 'Machi sabab.', 'Correlation ≠ causation.'], ['r ≈ 0 : pas de liaison **linéaire** ; une liaison courbe reste possible.', 'Ymken mo3wjja.', 'A curved link is still possible.']], ['regression', 'correlation'])
];

export const exercises = [
  ex('dr-ex1', 2, ['Résumé complet d\'une série de notes', 'Résumé kamel dyal série', 'Full summary of a set of marks'],
    ['Les notes de 5 étudiants sont : **8 ; 12 ; 10 ; 15 ; 10**. Calcule la moyenne, la médiane, le mode, la variance (n), l\'écart-type (n), puis la variance corrigée S² et S. Donne enfin Q1, Q3 et l\'IQR (convention pandas).',
      'Notes dyal 5 tlamid : **8 ; 12 ; 10 ; 15 ; 10**. 7seb moyenne, médiane, mode, variance (n), écart-type (n), 3ad S² w S. F lekher 3tini Q1, Q3 w IQR (b pandas).',
      'The marks of 5 students are **8 ; 12 ; 10 ; 15 ; 10**. Compute the mean, median, mode, variance (n), standard deviation (n), then S² and S. Finally give Q1, Q3 and the IQR (pandas convention).'],
    [['Commence par trier la série.', 'Bda b tartib.', 'Start by sorting.'], ['Écarts à la moyenne : −3, 1, −1, 4, −1.', 'L far9 : −3, 1, −1, 4, −1.', 'Deviations: −3, 1, −1, 4, −1.']],
    [
      { t: ['Moyenne', 'Moyenne', 'Mean'], b: ['55 / 5 = **11**.', '55 / 5 = **11**.', '55 / 5 = **11**.'], tex: '\\bar x = 11' },
      { t: ['Médiane et mode', 'Médiane w mode', 'Median and mode'], b: ['Série triée 8 ; 10 ; 10 ; 12 ; 15 → Me = **10** ; Mo = **10** (2 fois).', 'Me = 10 ; Mo = 10.', 'Me = **10**; Mo = **10**.'] },
      { t: ['Variance et écart-type (n)', 'Variance w écart-type (n)', 'Variance and SD (n)'], b: ['Carrés des écarts : 9, 1, 1, 16, 1 → 28. V = 28/5 = **5,6** ; σ = √5,6 ≈ **2,37**.', 'V = 5,6 ; σ ≈ 2,37.', 'V = **5.6**; σ ≈ **2.37**.'] },
      { t: ['Version corrigée (n − 1)', 'B n − 1', 'Corrected (n − 1)'], b: ['S² = 28/4 = **7** ; S = √7 ≈ **2,65** (ce que donne pandas `.var()` / `.std()`).', 'S² = 7 ; S ≈ 2,65.', 'S² = **7**; S ≈ **2.65**.'] },
      { t: ['Quartiles', 'Quartiles', 'Quartiles'], b: ['Positions (n − 1)p : Q1 → position 1 = **10** ; Q3 → position 3 = **12** ; IQR = **2**.', 'Q1 = 10, Q3 = 12, IQR = 2.', 'Q1 = **10**, Q3 = **12**, IQR = **2**.'] }
    ],
    ['x̄ = 11 ; Me = 10 ; Mo = 10 ; V = 5,6 ; σ ≈ 2,37 ; S² = 7 ; S ≈ 2,65 ; Q1 = 10 ; Q3 = 12 ; IQR = 2.', 'x̄ = 11 ; Me = Mo = 10 ; V = 5,6 ; S² = 7 ; IQR = 2.', 'x̄ = 11; Me = 10; Mo = 10; V = 5.6; σ ≈ 2.37; S² = 7; S ≈ 2.65; Q1 = 10; Q3 = 12; IQR = 2.'],
    [['Calculer la médiane sans trier.', 'Médiane bla tartib.', 'Median without sorting.'], ['Confondre diviseur n et n − 1.', 'Tkhllet n m3a n − 1.', 'Mixing up n and n − 1.']],
    { checks: [
      { compute: { fn: 'mean', args: [NOTES] }, expect: 11, tolerance: 0.001 },
      { compute: { fn: 'popVariance', args: [NOTES] }, expect: 5.6, tolerance: 0.001 },
      { compute: { fn: 'variance', args: [NOTES] }, expect: 7, tolerance: 0.001 },
      { compute: { fn: 'iqrBounds', args: [NOTES], pick: 'iqr' }, expect: 2, tolerance: 0.001 }
    ] }),
  ex('dr-ex2', 3, ['Régression : heures de révision → note', 'Régression : sa3at → note', 'Regression: revision hours → mark'],
    ['x = heures de révision = 1 ; 2 ; 3 ; 4 ; 5 et y = note sur 10 = 2 ; 4 ; 5 ; 4 ; 5.\n1. Calcule x̄, ȳ, V(x), cov(x, y).\n2. Calcule r et interprète.\n3. Donne la droite des moindres carrés et la note prédite pour 6 h.\n4. Calcule R² et interprète.',
      'x = sa3at = 1…5, y = note = 2 ; 4 ; 5 ; 4 ; 5.\n1. 7seb x̄, ȳ, V(x), cov.\n2. 7seb r w fsser.\n3. 3tini l khatt w note l 6 sa3at.\n4. 7seb R² w fsser.',
      'x = revision hours = 1 ; 2 ; 3 ; 4 ; 5 and y = mark /10 = 2 ; 4 ; 5 ; 4 ; 5.\n1. Compute x̄, ȳ, V(x), cov(x, y).\n2. Compute r and interpret.\n3. Give the least-squares line and the predicted mark for 6 h.\n4. Compute R² and interpret.'],
    [['Fais un tableau avec les colonnes x − x̄, y − ȳ, produit, (x − x̄)².', 'Dir tableau b colonnes x − x̄, y − ȳ, produit.', 'Build a table x − x̄, y − ȳ, product, (x − x̄)².'], ['a = cov / V(x), puis b = ȳ − a x̄.', 'a = cov / V(x).', 'a = cov / V(x).']],
    [
      { t: ['Moyennes et variance de x', 'Moyennes w V(x)', 'Means and V(x)'], b: ['x̄ = 3 ; ȳ = 4 ; (x − x̄)² : 4, 1, 0, 1, 4 → V(x) = 10/5 = **2**.', 'x̄ = 3 ; ȳ = 4 ; V(x) = 2.', 'x̄ = 3; ȳ = 4; V(x) = **2**.'] },
      { t: ['Covariance', 'Covariance', 'Covariance'], b: ['Produits : 4, 0, 0, 0, 2 → cov = 6/5 = **1,2**.', 'cov = 1,2.', 'cov = **1.2**.'] },
      { t: ['Corrélation', 'Corrélation', 'Correlation'], b: ['V(y) = 6/5 = 1,2 → r = 1,2 / (√2 × √1,2) ≈ **0,775** : liaison linéaire positive assez forte.', 'r ≈ 0,775 : 3ala9a mojaba 9wiya.', 'r ≈ **0.775**: fairly strong positive linear link.'] },
      { t: ['Droite et prédiction', 'Khatt w prédiction', 'Line and prediction'], b: ['a = 1,2/2 = **0,6** ; b = 4 − 0,6 × 3 = **2,2** → ŷ = 0,6x + 2,2 ; pour x = 6 : **5,8**.', 'ŷ = 0,6x + 2,2 ; 6 h → 5,8.', 'ŷ = 0.6x + 2.2; for x = 6: **5.8**.'] },
      { t: ['R²', 'R²', 'R²'], b: ['R² = r² ≈ **0,60** : 60 % de la variation des notes est expliquée par les heures de révision.', 'R² ≈ 0,60 : 60 %.', 'R² ≈ **0.60**: 60 % of the variation explained.'] }
    ],
    ['ŷ = 0,6 x + 2,2 ; r ≈ 0,775 ; R² ≈ 0,60 ; prédiction pour 6 h : 5,8/10.', 'ŷ = 0,6 x + 2,2 ; r ≈ 0,775 ; R² ≈ 0,60 ; 5,8.', 'ŷ = 0.6 x + 2.2; r ≈ 0.775; R² ≈ 0.60; prediction for 6 h: 5.8/10.'],
    [['Diviser cov par V(y) au lieu de V(x).', 'Q9sem 3la V(y).', 'Dividing cov by V(y).'], ['Écrire b = ȳ + a x̄.', 'Signe ghalat f b.', 'Wrong sign in b.'], ['Conclure à une causalité à partir de r.', 'Sababiya mn r.', 'Concluding causation from r.']],
    { checks: [
      { compute: { fn: 'covariance', args: [X, Y] }, expect: 1.2, tolerance: 0.001 },
      { compute: { fn: 'correlation', args: [X, Y] }, expect: 0.7746, tolerance: 0.001 },
      { compute: { fn: 'linReg', args: [X, Y], pick: 'a' }, expect: 0.6, tolerance: 0.001 },
      { compute: { fn: 'linReg', args: [X, Y], pick: 'b' }, expect: 2.2, tolerance: 0.001 },
      { compute: { fn: 'linReg', args: [X, Y], pick: 'r2' }, expect: 0.6, tolerance: 0.001 }
    ] })
];

export const flashcards = [
  fc('dr-fc1', ['Formule de la moyenne', 'Formule dyal moyenne', 'Mean formula'], ['$\\bar x = \\frac{1}{n}\\sum x_i$', '$\\bar x = \\frac{1}{n}\\sum x_i$', '$\\bar x = \\frac{1}{n}\\sum x_i$']),
  fc('dr-fc2', ['Médiane : méthode', 'Médiane : kifach', 'Median: how'], ['Trier, puis prendre la valeur du milieu (n impair) ou la moyenne des deux du milieu (n pair).', 'Rtteb, 3ad l west (wla moyenne dyal jouj).', 'Sort, then take the middle value (odd n) or the mean of the two middle ones (even n).']),
  fc('dr-fc3', ['Variance (n) et variance corrigée', 'Variance (n) w corrigée', 'Variance (n) and corrected'], ['$V = \\frac{1}{n}\\sum (x_i-\\bar x)^2$ ; $S^2 = \\frac{1}{n-1}\\sum (x_i-\\bar x)^2$ (pandas `.var()`).', 'V b n ; S² b n − 1 (pandas).', '$V$ divides by n; $S^2$ by n − 1 (pandas `.var()`).']),
  fc('dr-fc4', ['IQR', 'IQR', 'IQR'], ['IQR = Q3 − Q1 (les 50 % du milieu).', 'IQR = Q3 − Q1.', 'IQR = Q3 − Q1 (middle 50 %).']),
  fc('dr-fc5', ['Covariance', 'Covariance', 'Covariance'], ['$\\mathrm{cov}(x,y) = \\frac{1}{n}\\sum (x_i-\\bar x)(y_i-\\bar y)$', 'Moyenne dyal produits dyal l far9.', 'Mean of products of deviations.']),
  fc('dr-fc6', ['Coefficient de corrélation r', 'Coefficient r', 'Correlation r'], ['$r = \\frac{\\mathrm{cov}(x,y)}{\\sigma_x\\sigma_y}$, entre −1 et 1.', 'r bin −1 w 1.', 'Between −1 and 1.']),
  fc('dr-fc7', ['Droite des moindres carrés', 'Khatt dyal moindres carrés', 'Least-squares line'], ['$\\hat y = ax+b$ avec $a = \\frac{\\mathrm{cov}(x,y)}{V(x)}$ et $b = \\bar y - a\\bar x$.', 'a = cov / V(x) ; b = ȳ − a x̄.', 'a = cov / V(x); b = ȳ − a x̄.']),
  fc('dr-fc8', ['R²', 'R²', 'R²'], ['R² = r² : part de la variation de y expliquée par x.', 'Ch7al x kayfssr mn y.', 'Share of y\'s variation explained by x.'])
];

export const reference = [
  ref('dr-r1', 'x̄ = Σxᵢ / n', ['Moyenne arithmétique', 'Moyenne', 'Arithmetic mean'], 'df["x"].mean()'),
  ref('dr-r2', 'Me = valeur du milieu (série triée)', ['Médiane', 'Médiane', 'Median'], 'df["x"].median()'),
  ref('dr-r3', 'V = Σ(xᵢ − x̄)² / n   ·   S² = Σ(xᵢ − x̄)² / (n − 1)', ['Variance et variance corrigée (pandas : n − 1)', 'Variance (n) w corrigée (n − 1)', 'Variance and corrected variance (pandas: n − 1)'], 'df["x"].var()  # n-1 ; df["x"].var(ddof=0)  # n'),
  ref('dr-r4', 'σ = √V   ·   S = √S²', ['Écart-type', 'Écart-type', 'Standard deviation'], 'df["x"].std()'),
  ref('dr-r5', 'IQR = Q3 − Q1', ['Écart interquartile', 'IQR', 'Interquartile range'], 'df["x"].quantile(0.75) - df["x"].quantile(0.25)'),
  ref('dr-r6', 'cov(x,y) = Σ(xᵢ − x̄)(yᵢ − ȳ) / n', ['Covariance', 'Covariance', 'Covariance'], 'np.cov(x, y, ddof=0)'),
  ref('dr-r7', 'r = cov(x,y) / (σx σy)', ['Coefficient de corrélation linéaire', 'Corrélation', 'Linear correlation coefficient'], 'df["x"].corr(df["y"])'),
  ref('dr-r8', 'ŷ = a x + b,  a = cov(x,y)/V(x),  b = ȳ − a x̄,  R² = r²', ['Régression linéaire (moindres carrés)', 'Régression linéaire', 'Linear regression (least squares)'], 'a, b = np.polyfit(x, y, 1)')
];
