import { setCtx, L, h, p, key, plain, proof, formula, table, trap, exam, tip, quiz, single, num, ex } from '../lib';
import type { Chapter } from '../../src/lib/schema';

/**
 * Démonstrations — where the formulas of the hypothesis tests come from:
 * loi de x̄, Z (σ connu) and its 3 critical regions, P-values, test ⇔ interval,
 * S² with n − 1, χ², Student = Z / √(χ²/ν), t → N(0, 1), Z² = χ²(1), ν = k − p − 1.
 * Every number is checked with src/lib/stats (exercise checks) or scipy.
 */

setCtx('data', 'demos');

export const questions = [
  single('dd-01', 2, ['Pourquoi divise-t-on Σ(xi − x̄)² par **n − 1** pour obtenir S² ?', '3lach kanfasmou Σ(xi − x̄)² 3la **n − 1** bach nl9aw S² ?', 'Why divide Σ(xi − x̄)² by **n − 1** to get S²?'],
    [['Pour que E(S²) = σ² (estimateur sans biais)', 'Bach E(S²) = σ² (sans biais)', 'So that E(S²) = σ² (unbiased)'], ['Parce que n − 1 rend le calcul plus simple', '7it n − 1 sahl', 'Because n − 1 is simpler'], ['Parce que pandas l\'impose', '7it pandas bghat', 'Because pandas requires it'], ['Pour que S soit toujours plus petit que σ', 'Bach S dima sghir', 'So that S is always smaller than σ']], 0,
    ['On démontre E[Σ(xi − x̄)²] = (n − 1)σ² : diviser par n − 1 donne exactement σ² en moyenne. Diviser par n donnerait (n − 1)σ²/n, trop petit.', 'E[Σ(xi − x̄)²] = (n − 1)σ² → n9smou 3la n − 1 bach nl9aw σ².', 'E[Σ(xi − x̄)²] = (n − 1)σ², so dividing by n − 1 gives σ² on average.'],
    [['La raison est mathématique (biais), pas la simplicité.', 'Sbab riyadi (biais).', 'The reason is bias, not simplicity.'], ['pandas suit la formule, il ne la décide pas (`.std()` utilise ddof = 1).', 'pandas kaytb3 formule (ddof = 1).', 'pandas follows the formula (ddof = 1).'], ['Au contraire, n − 1 rend S² un peu **plus grand**.', 'Bil3aks, n − 1 kaykbbar S².', 'On the contrary, n − 1 makes S² slightly **larger**.']], ['demos', 'student']),
  single('dd-02', 3, ['Dans T0 = (x̄ − µ0)/(S/√n), pourquoi la loi de T0 ne dépend-elle **pas** de σ (inconnu) ?', 'F T0 = (x̄ − µ0)/(S/√n), 3lach loi dyal T0 **ma katb9ach** 3la σ ?', 'Why does the law of T0 **not** depend on the unknown σ?'],
    [['Car T0 = Z / √(K/(n − 1)) et σ se simplifie entre Z et K', '7it T0 = Z / √(K/(n − 1)) w σ kat-simplifia', 'Because T0 = Z / √(K/(n − 1)) and σ cancels'], ['Car S = σ exactement', '7it S = σ', 'Because S = σ exactly'], ['Car n est grand', '7it n kbir', 'Because n is large'], ['Car on remplace σ par 1', '7it σ = 1', 'Because σ is replaced by 1']], 0,
    ['On écrit T0 = [(x̄ − µ0)/(σ/√n)] / √[((n − 1)S²/σ²)/(n − 1)] : le σ du numérateur et celui du dénominateur se simplifient. Il reste Z ~ N(0, 1) divisé par √(χ²(n − 1)/(n − 1)) : c\'est la définition de Student(n − 1).', 'σ f lfo9 w σ f lta7t kaytsimplifiaw → Student(n − 1).', 'σ cancels between numerator and denominator → Student(n − 1).'],
    [['S est une estimation de σ, jamais égale à coup sûr.', 'S ghir ta9dir.', 'S only estimates σ.'], ['Le résultat est exact pour tout n (données normales).', 'S7i7 l kol n.', 'Exact for any n.'], ['σ n\'est pas remplacé : il disparaît par simplification.', 'σ kaytsimplifia.', 'σ cancels out.']], ['demos', 'student']),
  num('dd-03', 2, ['On sait que Z² suit χ²(1). Avec z(0,025) = 1,96, calcule le seuil χ²(0,05 ; 1) ≈ 1,96² (3 décimales).', 'Z² ~ χ²(1). B z(0,025) = 1,96, 7seb χ²(0,05 ; 1) ≈ 1,96² (3 décimales).', 'Z² ~ χ²(1). With z(0.025) = 1.96, compute χ²(0.05; 1) ≈ 1.96² (3 decimals).'], 3.841, 0.01,
    ['P(Z² > c²) = P(|Z| > c) = α. Donc χ²(α ; 1) = z(α/2)² : 1,96² = 3,8416 ≈ **3,841** (la table).', '1,96² ≈ **3,841**.', '1.96² ≈ **3.841**.'], { '1.96': ['C\'est z, il faut l\'élever au carré.', 'Khass tmorabba3.', 'Square it.'] }, ['demos', 'chi2'], { fn: 'chi2Crit', args: [0.05, 1] }),
  num('dd-04', 2, ['µ0 = 500, σ = 4 (connu), n = 36, α = 5 %, H1 : µ > 500. Au-dessus de quelle valeur de **x̄** rejette-t-on H0 ? (2 décimales)', 'µ0 = 500, σ = 4, n = 36, α = 5 %, H1 : µ > 500. Mn ina qima dyal **x̄** kanrfdou H0 ? (2 décimales)', 'µ0 = 500, σ = 4, n = 36, α = 5 %, H1: µ > 500. Above which **x̄** is H0 rejected? (2 decimals)'], 501.1, 0.02,
    ['Z0 > 1,645 ⇔ (x̄ − 500)/(4/6) > 1,645 ⇔ x̄ > 500 + 1,645 × 0,667 ≈ **501,10**.', 'x̄ > 500 + 1,645 × 4/6 ≈ **501,10**.', 'x̄ > 500 + 1.645 × 4/6 ≈ **501.10**.'], { '501.31': ['Ça c\'est le seuil bilatéral (1,96).', 'Hada bilatéral (1,96).', 'That is the two-sided threshold.'], '506.58': ['Tu as oublié √n.', 'Nsiti √n.', 'You forgot √n.'] }, ['demos', 'regions']),
  num('dd-05', 2, ['Test Z : la P-value **unilatérale** du côté de Z0 vaut 0,0122. Quelle est la P-value **bilatérale** ?', 'Test Z : PV **unilatérale** (jiha dyal Z0) = 0,0122. Ch7al PV **bilatérale** ?', 'Z test: the **one-sided** P-value on Z0\'s side is 0.0122. What is the **two-sided** one?'], 0.0244, 0.0002,
    ['Loi symétrique : PV bilatérale = 2 × PV unilatérale (côté de Z0) = 2 × 0,0122 = **0,0244**.', '2 × 0,0122 = **0,0244**.', '2 × 0.0122 = **0.0244**.'], { '0.0061': ['On multiplie par 2, on ne divise pas.', 'Darb f 2.', 'Multiply by 2.'] }, ['demos', 'pvalue'], { fn: 'pValueZ', args: [-2.25, 'two'] }),
  single('dd-06', 2, ['Test bilatéral Z au risque α. « On rejette H0 : µ = µ0 » est équivalent à :', 'Test bilatéral Z b α. « Nrfdou H0 : µ = µ0 » kaysawi :', 'Two-sided Z test at α. "Reject H0: µ = µ0" is equivalent to:'],
    [['µ0 n\'est pas dans l\'intervalle de confiance x̄ ± z(α/2)·σ/√n', 'µ0 barra IC x̄ ± z(α/2)·σ/√n', 'µ0 is outside x̄ ± z(α/2)·σ/√n'], ['x̄ n\'est pas dans l\'intervalle', 'x̄ barra IC', 'x̄ outside the interval'], ['µ0 est dans l\'intervalle', 'µ0 dakhel IC', 'µ0 inside the interval'], ['La P-value est plus grande que α', 'PV kbar mn α', 'P-value larger than α']], 0,
    ['|x̄ − µ0|/(σ/√n) > z(α/2) ⇔ |x̄ − µ0| > z(α/2)·σ/√n ⇔ µ0 hors de [x̄ − z·σ/√n ; x̄ + z·σ/√n].', '|x̄ − µ0| > z·σ/√n ⇔ µ0 barra IC.', '|x̄ − µ0| > z·σ/√n ⇔ µ0 outside the CI.'],
    [['x̄ est toujours au centre de son intervalle.', 'x̄ dima f lwesst.', 'x̄ is always at the centre.'], ['C\'est la condition pour **garder** H0.', 'Hadi bach **nkhalliw** H0.', 'That is the condition to **keep** H0.'], ['On rejette quand PV **<** α.', 'Nrfdou ila PV **<** α.', 'Reject when PV **<** α.']], ['demos', 'ic']),
  single('dd-07', 3, ['Test du χ² d\'ajustement avec **k = 2 classes** (proportion p). Que vaut χ²0 ?', 'χ² d\'ajustement b **k = 2 classes** (proportion p). Ch7al χ²0 ?', 'χ² fit test with **k = 2 classes** (proportion p). What is χ²0?'],
    [['Z0², avec Z0 = (X − np)/√(np(1 − p))', 'Z0², Z0 = (X − np)/√(np(1 − p))', 'Z0², with Z0 = (X − np)/√(np(1 − p))'], ['2·Z0', '2·Z0', '2·Z0'], ['Z0', 'Z0', 'Z0'], ['√Z0', '√Z0', '√Z0']], 0,
    ['O2 − E2 = −(O1 − E1), donc χ² = (X − np)²·[1/(np) + 1/(n(1 − p))] = (X − np)²/(np(1 − p)) = Z0². Et ν = 2 − 1 = 1 : cohérent avec Z² ~ χ²(1).', 'χ² = (X − np)²/(np(1 − p)) = Z0².', 'χ² = (X − np)²/(np(1 − p)) = Z0².'],
    [['Ce n\'est pas linéaire : c\'est un carré.', 'Machi 2Z : morabba3.', 'It is a square, not 2Z.'], ['χ² est un carré, toujours positif.', 'χ² morabba3.', 'χ² is a square.'], ['C\'est l\'inverse.', 'L3aks.', 'The opposite.']], ['demos', 'chi2']),
  num('dd-08', 1, ['Si K ~ χ²(8), que vaut E(K) ?', 'Ila K ~ χ²(8), ch7al E(K) ?', 'If K ~ χ²(8), what is E(K)?'], 8, 0,
    ['K = Z1² + … + Z8², et E(Zi²) = V(Zi) + E(Zi)² = 1 + 0 = 1. Donc E(K) = **8** = ν.', 'E(Zi²) = 1 → E(K) = **8**.', 'E(Zi²) = 1 → E(K) = **8**.'], { '64': ['E(K) = ν, pas ν².', 'E(K) = ν.', 'E(K) = ν.'], '16': ['16 = 2ν, c\'est la variance.', '16 = variance.', '16 is the variance.'] }, ['demos', 'chi2']),
  single('dd-09', 2, ['Quand n devient grand, la valeur critique t(0,025 ; n − 1) de Student tend vers :', 'Mli n kaykbar, t(0,025 ; n − 1) kayqarreb l :', 'As n grows, t(0.025; n − 1) tends to:'],
    [['1,96', '1,96', '1.96'], ['0', '0', '0'], ['2,306', '2,306', '2.306'], ['+∞', '+∞', '+∞']], 0,
    ['S → σ quand n grandit, donc T0 → Z0 : t(0,025 ; 8) = 2,306 ; ν = 30 : 2,042 ; ν = 100 : 1,984 ; ν → ∞ : **1,96**.', 'S → σ → t → **1,96**.', 'S → σ so t → **1.96**.'],
    [['La valeur critique diminue mais ne va pas à 0.', 'Ma katwsalch l 0.', 'It does not go to 0.'], ['2,306 c\'est pour ν = 8 seulement.', '2,306 ghir ν = 8.', '2.306 is only ν = 8.'], ['Elle diminue, elle ne grandit pas.', 'Katn9es.', 'It decreases.']], ['demos', 'student']),
  num('dd-10', 2, ['Test χ² de normalité sur **6 classes**, µ et σ estimés par x̄ et S. Combien de degrés de liberté ν ?', 'χ² normalité, **6 classes**, µ w σ m9addrin. Ch7al ν ?', 'χ² normality test, **6 classes**, µ and σ estimated. How many df ν?'], 3, 0,
    ['ν = k − p − 1 = 6 − 2 − 1 = **3** : on perd 1 pour ΣOi = ΣEi = n, et 1 par paramètre estimé.', 'ν = 6 − 2 − 1 = **3**.', 'ν = 6 − 2 − 1 = **3**.'], { '5': ['k − 1 oublie les 2 paramètres estimés.', 'Nsiti p = 2.', 'You forgot p = 2.'], '4': ['p = 2 (µ et σ), pas 1.', 'p = 2.', 'p = 2.'] }, ['demos', 'chi2'])
];

export const exercises = [
  ex('d-x-dm1', 3, ['Démontrer : loi de x̄ et région critique (σ connu)', 'Démontrer : loi dyal x̄ w région critique (σ m3rouf)', 'Prove: law of x̄ and critical region (σ known)'],
    ['X1, …, Xn indépendantes, de loi N(µ, σ²), σ connu. 1) Démontrer que E(x̄) = µ et V(x̄) = σ²/n. 2) En déduire que Z = (x̄ − µ)/(σ/√n) suit N(0, 1). 3) Pour H0 : µ = µ0 contre H1 : µ > µ0 au risque α, démontrer que la région critique est Z0 > z(α), puis l\'écrire sur x̄. Application : µ0 = 500, σ = 4, n = 36, α = 5 %.',
     'X1, …, Xn mosta9illin, loi N(µ, σ²), σ m3rouf. 1) Bayyen E(x̄) = µ w V(x̄) = σ²/n. 2) Stantej Z ~ N(0, 1). 3) L H0 : µ = µ0 contre H1 : µ > µ0 b α, bayyen région critique Z0 > z(α), w kteb-ha 3la x̄. Application : µ0 = 500, σ = 4, n = 36, α = 5 %.',
     'X1, …, Xn independent N(µ, σ²), σ known. 1) Prove E(x̄) = µ and V(x̄) = σ²/n. 2) Deduce Z ~ N(0, 1). 3) For H0: µ = µ0 vs H1: µ > µ0 at α, prove the critical region is Z0 > z(α), then write it on x̄. Application: µ0 = 500, σ = 4, n = 36, α = 5 %.'],
    [['E est linéaire ; V(aX) = a²V(X) ; V d\'une somme de variables indépendantes = somme des V.', 'E linéaire ; V(aX) = a²V(X) ; V(somme) = somme V (mosta9illin).', 'E is linear; V(aX) = a²V(X); V of an independent sum = sum of V.']],
    [{ t: ['1) E et V', '1) E w V', '1) E and V'], b: ['E(x̄) = (1/n)ΣE(Xi) = (1/n)·nµ = µ. V(x̄) = (1/n²)ΣV(Xi) (indépendance) = (1/n²)·nσ² = σ²/n.', 'E(x̄) = µ ; V(x̄) = nσ²/n² = σ²/n.', 'E(x̄) = µ; V(x̄) = nσ²/n² = σ²/n.'], tex: 'V(\\bar X) = \\frac{1}{n^2}\\sum V(X_i) = \\frac{n\\sigma^2}{n^2} = \\frac{\\sigma^2}{n}' },
     { t: ['2) Centrer-réduire', '2) Centrer-réduire', '2) Standardise'], b: ['Une somme de normales indépendantes est normale, donc x̄ ~ N(µ, σ²/n). Z = (x̄ − µ)/(σ/√n) : E(Z) = 0, V(Z) = V(x̄)/(σ²/n) = 1 → Z ~ N(0, 1).', 'x̄ normale → Z : E = 0, V = 1 → N(0, 1).', 'x̄ normal → Z has E = 0, V = 1 → N(0, 1).'] },
     { t: ['3) Région critique', '3) Région critique', '3) Critical region'], b: ['On rejette si Z0 > c, avec P(Z > c | H0) = α ⇔ 1 − Φ(c) = α ⇔ c = z(α). Sur x̄ : x̄ > µ0 + z(α)·σ/√n. Application : 500 + 1,645 × 4/6 ≈ **501,10 mL**.', 'P(Z > c) = α ⇔ c = z(α). x̄ > µ0 + z(α)σ/√n = **501,10**.', 'P(Z > c) = α ⇔ c = z(α). x̄ > 501.10.'], tex: '\\bar x > \\mu_0 + z_{\\alpha}\\frac{\\sigma}{\\sqrt n} = 500 + 1{,}645 \\times \\frac{4}{6} \\approx 501{,}10' }],
    ['E(x̄) = µ, V(x̄) = σ²/n, Z ~ N(0, 1) ; région H1 : µ > µ0 : Z0 > z(α) ⇔ x̄ > µ0 + z(α)σ/√n ≈ 501,10.', 'V(x̄) = σ²/n ; x̄ > 501,10.', 'V(x̄) = σ²/n; x̄ > 501.10.'],
    [['Écrire V(x̄) = σ²/n² ou σ/n.', 'V(x̄) = σ²/n machi σ/n.', 'V(x̄) = σ²/n, not σ/n.'], ['Oublier que V(aX) = a²V(X).', 'Nsiti a².', 'Forgetting a².']],
    { checks: [{ compute: { fn: 'zCrit', args: [0.05] }, expect: 1.645, tolerance: 0.001 }] }),
  ex('d-x-dm2', 3, ['Démontrer : T0 suit Student(n − 1)', 'Démontrer : T0 ~ Student(n − 1)', 'Prove: T0 follows Student(n − 1)'],
    ['On admet : Z = (x̄ − µ)/(σ/√n) ~ N(0, 1), K = (n − 1)S²/σ² ~ χ²(n − 1), Z et K indépendantes, et la définition T = Z/√(K/ν) ~ Student(ν). 1) Démontrer que T0 = (x̄ − µ)/(S/√n) suit Student(n − 1). 2) Démontrer que E[Σ(xi − x̄)²] = (n − 1)σ² (justifie le n − 1 de S²). 3) Application : 9 batteries, x̄ ≈ 9,689, S ≈ 0,2934, µ0 = 9,5 : calculer T0 et ν.',
     'Admis : Z ~ N(0, 1), K = (n − 1)S²/σ² ~ χ²(n − 1), mosta9illin, w T = Z/√(K/ν) ~ Student(ν). 1) Bayyen T0 = (x̄ − µ)/(S/√n) ~ Student(n − 1). 2) Bayyen E[Σ(xi − x̄)²] = (n − 1)σ². 3) Application : 9 batteries, x̄ ≈ 9,689, S ≈ 0,2934, µ0 = 9,5 : T0 w ν.',
     'Given: Z ~ N(0, 1), K = (n − 1)S²/σ² ~ χ²(n − 1), independent, and T = Z/√(K/ν) ~ Student(ν). 1) Prove T0 = (x̄ − µ)/(S/√n) ~ Student(n − 1). 2) Prove E[Σ(xi − x̄)²] = (n − 1)σ². 3) Application: 9 batteries, x̄ ≈ 9.689, S ≈ 0.2934, µ0 = 9.5: T0 and ν.'],
    [['Divise numérateur et dénominateur de T0 par σ/√n.', 'Fasem lfo9 w lta7t 3la σ/√n.', 'Divide top and bottom by σ/√n.']],
    [{ t: ['1) Le σ se simplifie', '1) σ kaytsimplifia', '1) σ cancels'], b: ['T0 = [(x̄ − µ)/(σ/√n)] / (S/σ) = Z / √(S²/σ²) = Z / √(K/(n − 1)). C\'est exactement la définition de Student à ν = n − 1.', 'T0 = Z / (S/σ) = Z / √(K/(n − 1)) → Student(n − 1).', 'T0 = Z / (S/σ) = Z / √(K/(n − 1)) → Student(n − 1).'], tex: 'T_0 = \\frac{\\frac{\\bar x - \\mu}{\\sigma/\\sqrt n}}{\\sqrt{\\frac{(n-1)S^2/\\sigma^2}{n-1}}} = \\frac{Z}{\\sqrt{K/(n-1)}}' },
     { t: ['2) Le n − 1', '2) n − 1', '2) The n − 1'], b: ['Σ(xi − x̄)² = Σ(xi − µ)² − n(x̄ − µ)². En espérance : nσ² − n·(σ²/n) = (n − 1)σ². Donc E(S²) = σ² avec S² = Σ(xi − x̄)²/(n − 1).', 'E = nσ² − σ² = (n − 1)σ² → E(S²) = σ².', 'E = nσ² − σ² = (n − 1)σ² → E(S²) = σ².'], tex: 'E\\Big[\\sum (x_i-\\bar x)^2\\Big] = n\\sigma^2 - n\\frac{\\sigma^2}{n} = (n-1)\\sigma^2' },
     { t: ['3) Application', '3) Application', '3) Application'], b: ['ν = 9 − 1 = **8** ; S/√n = 0,2934/3 ≈ 0,0978 ; T0 = 0,1889/0,0978 ≈ **1,93**.', 'ν = **8** ; T0 ≈ **1,93**.', 'ν = **8**; T0 ≈ **1.93**.'] }],
    ['T0 = Z/√(K/(n − 1)) ~ Student(n − 1) (σ disparaît) ; E[Σ(xi − x̄)²] = (n − 1)σ² ; application : ν = 8, T0 ≈ 1,93.', 'T0 ~ Student(n − 1) ; ν = 8 ; T0 ≈ 1,93.', 'T0 ~ Student(n − 1); ν = 8; T0 ≈ 1.93.'],
    [['Dire « S ≈ σ donc T0 ~ N(0, 1) » : faux pour n petit.', 'S ≈ σ → N(0, 1) : ghalat ila n sghir.', '"S ≈ σ so normal": wrong for small n.'], ['Oublier que Σ(xi − x̄) = 0 fait perdre 1 degré de liberté.', 'Σ(xi − x̄) = 0 → ddl na9es 1.', 'Σ(xi − x̄) = 0 costs one df.']],
    { checks: [{ compute: { fn: 'tStatData', args: [[9.6, 10.1, 9.4, 9.8, 9.9, 9.2, 10.0, 9.5, 9.7], 9.5] }, expect: 1.9311, tolerance: 0.001 }] }),
  ex('d-x-dm3', 3, ['Démontrer : Z² = χ²(1) et χ² à 2 classes', 'Démontrer : Z² = χ²(1) w χ² b 2 classes', 'Prove: Z² = χ²(1) and χ² with 2 classes'],
    ['1) Démontrer que χ²(α ; 1) = z(α/2)² et vérifier avec les tables à 5 % et 1 %. 2) Une pièce est lancée n fois, X = nombre de « pile », H0 : p = p0. Démontrer que le χ² d\'ajustement à 2 classes vaut Z0² avec Z0 = (X − np0)/√(np0(1 − p0)). 3) Application : n = 100, X = 60, p0 = 0,5 : calculer χ²0 et décider à 5 %.',
     '1) Bayyen χ²(α ; 1) = z(α/2)² w t2akked b tables (5 % w 1 %). 2) Pièce mlou7a n mra, X = 3adad « pile », H0 : p = p0. Bayyen χ² b 2 classes = Z0². 3) Application : n = 100, X = 60, p0 = 0,5 : χ²0 w qarar b 5 %.',
     '1) Prove χ²(α; 1) = z(α/2)² and check with the tables at 5 % and 1 %. 2) A coin tossed n times, X = heads, H0: p = p0. Prove the 2-class χ² equals Z0². 3) Application: n = 100, X = 60, p0 = 0.5: χ²0 and decision at 5 %.'],
    [['Z² > c² ⇔ |Z| > c. Et avec 2 classes, O2 − E2 = −(O1 − E1).', 'Z² > c² ⇔ |Z| > c ; O2 − E2 = −(O1 − E1).', 'Z² > c² ⇔ |Z| > c; O2 − E2 = −(O1 − E1).']],
    [{ t: ['1) Z² et χ²(1)', '1) Z² w χ²(1)', '1) Z² and χ²(1)'], b: ['Z² ~ χ²(1) (définition, ν = 1). P(Z² > c²) = P(|Z| > c) = α ⇔ c = z(α/2). Donc χ²(α ; 1) = z(α/2)² : 1,96² = 3,8416 ≈ **3,841** ; 2,576² = **6,635**.', '1,96² ≈ 3,841 ; 2,576² ≈ 6,635.', '1.96² ≈ 3.841; 2.576² ≈ 6.635.'] },
     { t: ['2) χ² à 2 classes', '2) χ² b 2 classes', '2) 2-class χ²'], b: ['O1 = X, E1 = np0 ; O2 = n − X, E2 = n(1 − p0), donc O2 − E2 = −(X − np0). χ² = (X − np0)²[1/(np0) + 1/(n(1 − p0))] = (X − np0)²/(np0(1 − p0)) = Z0².', 'χ² = (X − np0)²/(np0(1 − p0)) = Z0².', 'χ² = (X − np0)²/(np0(1 − p0)) = Z0².'], tex: '\\frac{1}{np_0} + \\frac{1}{n(1-p_0)} = \\frac{1}{np_0(1-p_0)}' },
     { t: ['3) Application', '3) Application', '3) Application'], b: ['Z0 = (60 − 50)/√25 = **2** ; χ²0 = 10²/50 + 10²/50 = **4** = Z0². ν = 2 − 1 = 1 → 4 > 3,841 → **rejet de H0** (et |Z0| = 2 > 1,96 : même décision).', 'Z0 = 2 ; χ²0 = 4 > 3,841 → **rfed H0**.', 'Z0 = 2; χ²0 = 4 > 3.841 → **reject H0**.'] }],
    ['χ²(α ; 1) = z(α/2)² (3,841 = 1,96²) ; à 2 classes χ² = Z0² ; application χ²0 = 4 > 3,841 → rejet, p ≠ 0,5.', 'χ²(1) = Z² ; χ²0 = 4 → rfed.', 'χ²(1) = Z²; χ²0 = 4 → reject.'],
    [['Prendre ν = 2 (nombre de classes) au lieu de 1.', 'ν = 2 ghalat : ν = 1.', 'ν = 2 is wrong: ν = 1.']],
    { checks: [{ compute: { fn: 'chi2Crit', args: [0.05, 1] }, expect: 3.8415, tolerance: 0.001 }, { compute: { fn: 'chi2Crit', args: [0.01, 1] }, expect: 6.6349, tolerance: 0.001 }, { compute: { fn: 'chi2Uniform', args: [[60, 40], 0.05], pick: 'chi2' }, expect: 4, tolerance: 0.0001 }] })
];

export const flashcards = [];
export const reference = [];

export const chapter: Chapter = {
  id: 'demos',
  module: 'data',
  order: 6.5,
  title: L(['Démonstrations — loi normale, Student, χ² et leurs relations', 'Démonstrations — loi normale, Student, χ² w les relations binathom', 'Proofs — normal law, Student, χ² and how they relate']),
  summary: L(['D\'où viennent les formules : loi de x̄, Z quand σ est connu, les 3 régions (≠, <, >), la P-value, le lien test ⇔ intervalle, le n − 1 de S, Student quand σ est inconnu, le χ², et les ponts entre les trois lois.', 'Mnin jaw les formules : loi dyal x̄, Z mli σ m3rouf, 3 régions (≠, <, >), P-value, test ⇔ intervalle, n − 1 dyal S, Student mli σ ma m3roufch, χ², w les ponts bin 3 lois.', 'Where the formulas come from: law of x̄, Z when σ is known, the 3 regions (≠, <, >), the P-value, test ⇔ interval, the n − 1 of S, Student when σ is unknown, χ², and the bridges between the three laws.']),
  estimatedMinutes: 50,
  sections: [
    key(['1. **σ connu** : x̄ ~ N(µ, σ²/n) donc **Z = (x̄ − µ)/(σ/√n) ~ N(0, 1)**.\n2. **σ inconnu** : on remplace σ par S (diviseur n − 1) → **T = Z / √(χ²(n − 1)/(n − 1)) ~ Student(n − 1)** : σ se simplifie.\n3. **χ²(ν)** = somme de ν carrés de N(0, 1) ; **Z² = χ²(1)** donc 1,96² = 3,841.\n4. Les 3 régions viennent toutes de **P(rejeter | H0) = α** : ≠ → α/2 de chaque côté ; < → α à gauche ; > → α à droite.\n5. **n grand** : Student → N(0, 1) (2,306 → 1,96).', '1. **σ m3rouf** : x̄ ~ N(µ, σ²/n) → **Z ~ N(0, 1)**.\n2. **σ ma m3roufch** : nbeddlou σ b S (n − 1) → **T = Z / √(χ²(n − 1)/(n − 1)) ~ Student(n − 1)** : σ kaytsimplifia.\n3. **χ²(ν)** = majmou3 ν morabba3at dyal N(0, 1) ; **Z² = χ²(1)** → 1,96² = 3,841.\n4. 3 régions kamlin jayin mn **P(rfed | H0) = α** : ≠ → α/2 f kol jiha ; < → α f lisr ; > → α f limen.\n5. **n kbir** : Student → N(0, 1).', '1. **σ known**: x̄ ~ N(µ, σ²/n) so **Z ~ N(0, 1)**.\n2. **σ unknown**: replace σ by S (n − 1) → **T = Z / √(χ²(n − 1)/(n − 1)) ~ Student(n − 1)**: σ cancels.\n3. **χ²(ν)** = sum of ν squared N(0, 1); **Z² = χ²(1)** so 1.96² = 3.841.\n4. The 3 regions all come from **P(reject | H0) = α**.\n5. **Large n**: Student → N(0, 1).']),
    table([['Loi', 'Loi', 'Law'], ['Définition', 'Ta3rif', 'Definition'], ['Quand ?', 'Imta ?', 'When?'], ['Lien', 'Rabt', 'Link']], [
      [['Normale N(0, 1)', 'Normale N(0, 1)', 'Normal N(0, 1)'], '$Z = \\frac{\\bar x - \\mu}{\\sigma/\\sqrt n}$', ['Moyenne, **σ connu**', 'Moyenne, **σ m3rouf**', 'Mean, **σ known**'], ['Brique de base des deux autres', 'Asas dyal jouj lokhrin', 'Building block of the other two']],
      [['Khi-deux χ²(ν)', 'Khi-deux χ²(ν)', 'Chi-square χ²(ν)'], '$K = Z_1^2 + \\dots + Z_\\nu^2$', ['Ajustement d\'une loi ; variance', 'Ajustement ; variance', 'Goodness of fit; variance'], '$Z^2 = \\chi^2(1)$'],
      [['Student t(ν)', 'Student t(ν)', 'Student t(ν)'], '$T = \\frac{Z}{\\sqrt{K/\\nu}}$', ['Moyenne, **σ inconnu**', 'Moyenne, **σ ma m3roufch**', 'Mean, **σ unknown**'], '$t(\\nu) \\to N(0,1)$']
    ]),

    // ------------------------------------------------------------------
    h(['D1. La loi de x̄ (σ connu)', 'D1. Loi dyal x̄ (σ m3rouf)', 'D1. The law of x̄ (σ known)']),
    proof(['Démontrer que x̄ ~ N(µ, σ²/n)', 'Bayyen x̄ ~ N(µ, σ²/n)', 'Prove x̄ ~ N(µ, σ²/n)'], [
      { t: ['Hypothèses', 'Hypothèses', 'Assumptions'], b: ['X1, …, Xn **indépendantes**, même loi N(µ, σ²). x̄ = (X1 + … + Xn)/n.', 'X1, …, Xn **mosta9illin**, nefs loi N(µ, σ²). x̄ = (X1 + … + Xn)/n.', 'X1, …, Xn **independent**, same law N(µ, σ²).'] },
      { t: ['Espérance', 'Espérance', 'Mean'], b: ['L\'espérance est linéaire.', 'Espérance linéaire.', 'Expectation is linear.'], tex: 'E(\\bar X) = \\frac{1}{n}\\sum_{i=1}^n E(X_i) = \\frac{1}{n}\\, n\\mu = \\mu' },
      { t: ['Variance', 'Variance', 'Variance'], b: ['V(aX) = a²V(X), et pour des variables **indépendantes** la variance d\'une somme est la somme des variances.', 'V(aX) = a²V(X) ; mosta9illin → V(somme) = somme V.', 'V(aX) = a²V(X); independent → V(sum) = sum of V.'], tex: 'V(\\bar X) = \\frac{1}{n^2}\\sum_{i=1}^n V(X_i) = \\frac{n\\sigma^2}{n^2} = \\frac{\\sigma^2}{n}' },
      { t: ['Loi', 'Loi', 'Law'], b: ['Une somme de normales indépendantes est normale. Donc x̄ ~ N(µ, σ²/n). Si les Xi ne sont pas normales mais **n ≥ 30**, c\'est vrai approximativement (théorème central limite).', 'Majmou3 normales = normale → x̄ ~ N(µ, σ²/n). Ila machi normales w **n ≥ 30** → ta9riban (TCL).', 'A sum of independent normals is normal. If not normal but **n ≥ 30**: approximately (CLT).'], tex: '\\bar X \\sim N\\!\\left(\\mu,\\ \\frac{\\sigma^2}{n}\\right)' }
    ]),
    plain(['L\'écart-type de x̄ est **σ/√n**, pas σ : plus n est grand, plus x̄ est précis. C\'est pour ça qu\'on divise par σ/√n dans Z0.', 'Écart-type dyal x̄ howa **σ/√n**, machi σ : kol ma n kbir, x̄ d9i9. Hadchi 3lach kanfasmou 3la σ/√n f Z0.', 'The SD of x̄ is **σ/√n**, not σ: that is why Z0 divides by σ/√n.']),

    // ------------------------------------------------------------------
    h(['D2. Centrer-réduire : Z ~ N(0, 1)', 'D2. Centrer-réduire : Z ~ N(0, 1)', 'D2. Standardising: Z ~ N(0, 1)']),
    proof(null, [
      { t: ['Définir Z', 'Ta3rif Z', 'Define Z'], b: ['On retire la moyenne et on divise par l\'écart-type de x̄.', 'N7iydou moyenne w nfasmou 3la écart-type dyal x̄.', 'Subtract the mean, divide by the SD of x̄.'], tex: 'Z = \\frac{\\bar X - \\mu}{\\sigma/\\sqrt n}' },
      { t: ['E(Z) = 0', 'E(Z) = 0', 'E(Z) = 0'], b: ['E(Z) = (E(x̄) − µ)/(σ/√n) = (µ − µ)/(σ/√n) = 0.', 'E(Z) = (µ − µ)/(σ/√n) = 0.', 'E(Z) = (µ − µ)/(σ/√n) = 0.'] },
      { t: ['V(Z) = 1', 'V(Z) = 1', 'V(Z) = 1'], b: ['Une constante retirée ne change pas la variance ; diviser par a divise la variance par a².', 'Constante ma katbeddelch V ; t9sem 3la a → V/a².', 'A constant does not change V; dividing by a divides V by a².'], tex: 'V(Z) = \\frac{V(\\bar X)}{\\sigma^2/n} = \\frac{\\sigma^2/n}{\\sigma^2/n} = 1' },
      { t: ['Conclusion', 'Conclusion', 'Conclusion'], b: ['Z est normale (transformation affine d\'une normale), de moyenne 0 et variance 1 : **Z ~ N(0, 1)**. Sous H0 (µ = µ0), on calcule donc **Z0 = (x̄ − µ0)/(σ/√n)** et on lit la table N(0, 1).', 'Z normale, E = 0, V = 1 → **Z ~ N(0, 1)**. Sous H0 : **Z0 = (x̄ − µ0)/(σ/√n)**.', 'Z is normal with mean 0 and variance 1: **Z ~ N(0, 1)**. Under H0: **Z0 = (x̄ − µ0)/(σ/√n)**.'] }
    ]),

    // ------------------------------------------------------------------
    h(['D3. Les 3 régions critiques (≠, <, >)', 'D3. 3 régions critiques (≠, <, >)', 'D3. The 3 critical regions (≠, <, >)']),
    p(['Le principe est toujours le même : on choisit la région R pour que **P(Z0 ∈ R | H0 vraie) = α** (erreur de 1re espèce), placée **du côté de H1**.', 'Lmabda2 dima nefso : nkhtarou région R bach **P(Z0 ∈ R | H0 s7i7a) = α**, f **jiha dyal H1**.', 'Always the same principle: choose R so that **P(Z0 ∈ R | H0) = α**, placed **on H1\'s side**.']),
    proof(['H1 : µ ≠ µ0 (bilatéral)', 'H1 : µ ≠ µ0 (bilatéral)', 'H1: µ ≠ µ0 (two-sided)'], [
      { t: ['Forme', 'Chkl', 'Shape'], b: ['Un écart dans les deux sens contredit H0 → R = { |Z0| > c }.', 'Far9 f jouj jihat → R = { |Z0| > c }.', 'A gap either way → R = { |Z0| > c }.'] },
      { t: ['Calcul de c', '7sab c', 'Finding c'], b: ['Par symétrie, P(|Z| > c) = 2(1 − Φ(c)).', 'Symétrie : P(|Z| > c) = 2(1 − Φ(c)).', 'By symmetry, P(|Z| > c) = 2(1 − Φ(c)).'], tex: '2\\,(1 - \\Phi(c)) = \\alpha \\iff \\Phi(c) = 1 - \\tfrac{\\alpha}{2} \\iff c = z_{\\alpha/2}' },
      { t: ['À 5 %', 'B 5 %', 'At 5 %'], b: ['Φ(c) = 0,975 → c = **1,96**. On rejette si **|Z0| > 1,96**.', 'Φ(c) = 0,975 → **1,96** → rfed ila **|Z0| > 1,96**.', 'Φ(c) = 0.975 → **1.96**: reject if **|Z0| > 1.96**.'] }
    ]),
    proof(['H1 : µ < µ0 (unilatéral gauche)', 'H1 : µ < µ0 (gauche)', 'H1: µ < µ0 (left)'], [
      { t: ['Forme', 'Chkl', 'Shape'], b: ['Seules les petites valeurs de x̄ contredisent H0 → R = { Z0 < −c }.', 'Ghir x̄ sghira katnaqed H0 → R = { Z0 < −c }.', 'Only small x̄ contradicts H0 → R = { Z0 < −c }.'] },
      { t: ['Calcul de c', '7sab c', 'Finding c'], b: ['Φ(−c) = 1 − Φ(c).', 'Φ(−c) = 1 − Φ(c).', 'Φ(−c) = 1 − Φ(c).'], tex: 'P(Z < -c) = \\Phi(-c) = 1 - \\Phi(c) = \\alpha \\iff c = z_{\\alpha}' },
      { t: ['À 5 %', 'B 5 %', 'At 5 %'], b: ['Φ(c) = 0,95 → c = **1,645**. On rejette si **Z0 < −1,645** (avec le signe).', '**1,645** → rfed ila **Z0 < −1,645** (b signe).', '**1.645**: reject if **Z0 < −1.645** (with the sign).'] }
    ]),
    proof(['H1 : µ > µ0 (unilatéral droite)', 'H1 : µ > µ0 (droite)', 'H1: µ > µ0 (right)'], [
      { t: ['Forme', 'Chkl', 'Shape'], b: ['Seules les grandes valeurs de x̄ contredisent H0 → R = { Z0 > c }.', 'Ghir x̄ kbira → R = { Z0 > c }.', 'Only large x̄ → R = { Z0 > c }.'] },
      { t: ['Calcul de c', '7sab c', 'Finding c'], b: ['Tout α est à droite.', 'α kamla f limen.', 'All of α on the right.'], tex: 'P(Z > c) = 1 - \\Phi(c) = \\alpha \\iff c = z_{\\alpha}' },
      { t: ['À 5 %', 'B 5 %', 'At 5 %'], b: ['c = **1,645**. On rejette si **Z0 > 1,645**.', '**1,645** → rfed ila **Z0 > 1,645**.', '**1.645**: reject if **Z0 > 1.645**.'] }
    ]),
    formula('\\bar x > \\mu_0 + z_{\\alpha}\\tfrac{\\sigma}{\\sqrt n} \\qquad \\bar x < \\mu_0 - z_{\\alpha}\\tfrac{\\sigma}{\\sqrt n} \\qquad |\\bar x - \\mu_0| > z_{\\alpha/2}\\tfrac{\\sigma}{\\sqrt n}', ['**Les mêmes régions écrites sur x̄** (on multiplie Z0 > c par σ/√n > 0, puis on ajoute µ0). Exemple µ0 = 500, σ = 4, n = 36, α = 5 % : droite x̄ > **501,10** ; gauche x̄ < **498,90** ; bilatéral x̄ < **498,69** ou x̄ > **501,31**.', '**Nefs régions 3la x̄** (nedarbou f σ/√n w nzidou µ0). Mithal µ0 = 500, σ = 4, n = 36 : droite x̄ > **501,10** ; gauche x̄ < **498,90** ; bilatéral x̄ < **498,69** wla > **501,31**.', '**The same regions on x̄**. Example µ0 = 500, σ = 4, n = 36: right x̄ > **501.10**; left x̄ < **498.90**; two-sided x̄ < **498.69** or > **501.31**.']),

    // ------------------------------------------------------------------
    h(['D4. La P-value et la règle « PV < α »', 'D4. P-value w lqa3ida « PV < α »', 'D4. The P-value and the rule "PV < α"']),
    proof(null, [
      { t: ['Définition', 'Ta3rif', 'Definition'], b: ['PV = probabilité, sous H0, d\'obtenir une statistique **au moins aussi extrême** que z0, **dans le sens de H1**.', 'PV = proba, sous H0, dyal statistique **extrême b7al z0 wla ktar**, f **jiha dyal H1**.', 'PV = probability under H0 of a statistic **at least as extreme** as z0, **in H1\'s direction**.'] },
      { t: ['Les 3 formules', '3 formules', 'The 3 formulas'], b: ['> : PV = P(Z > z0) = 1 − Φ(z0). < : PV = P(Z < z0) = Φ(z0). ≠ : PV = P(|Z| > |z0|) = 2(1 − Φ(|z0|)).', '> : 1 − Φ(z0). < : Φ(z0). ≠ : 2(1 − Φ(|z0|)).', '>: 1 − Φ(z0). <: Φ(z0). ≠: 2(1 − Φ(|z0|)).'] },
      { t: ['Équivalence (cas >)', 'Équivalence (cas >)', 'Equivalence (case >)'], b: ['Φ est croissante, donc on peut passer d\'une inégalité à l\'autre.', 'Φ croissante.', 'Φ is increasing.'], tex: 'PV < \\alpha \\iff 1 - \\Phi(z_0) < \\alpha \\iff \\Phi(z_0) > 1 - \\alpha \\iff z_0 > z_{\\alpha}' },
      { t: ['Conclusion', 'Conclusion', 'Conclusion'], b: ['« PV < α » et « Z0 dans la région critique » sont **la même décision**. Même calcul pour < et ≠. Et PV bilatérale = **2 × PV unilatérale** (côté de z0) : ex. Z0 = −2,25 → 0,0122 et 0,0244.', '« PV < α » = « Z0 f région » : **nefs qarar**. PV bilatérale = **2 × unilatérale** : Z0 = −2,25 → 0,0122 w 0,0244.', 'Same decision. Two-sided PV = **2 × one-sided**: Z0 = −2.25 → 0.0122 and 0.0244.'] }
    ]),

    // ------------------------------------------------------------------
    h(['D5. Test bilatéral ⇔ intervalle de confiance', 'D5. Test bilatéral ⇔ intervalle de confiance', 'D5. Two-sided test ⇔ confidence interval']),
    proof(null, [
      { t: ['Non-rejet', 'Ma nrfdouch', 'Not rejecting'], b: ['On garde H0 si |Z0| ≤ z(α/2).', 'Nkhalliw H0 ila |Z0| ≤ z(α/2).', 'Keep H0 if |Z0| ≤ z(α/2).'], tex: '\\left|\\frac{\\bar x - \\mu_0}{\\sigma/\\sqrt n}\\right| \\le z_{\\alpha/2} \\iff \\bar x - z_{\\alpha/2}\\tfrac{\\sigma}{\\sqrt n} \\le \\mu_0 \\le \\bar x + z_{\\alpha/2}\\tfrac{\\sigma}{\\sqrt n}' },
      { t: ['Lecture', '9raya', 'Reading'], b: ['On garde H0 **si et seulement si µ0 est dans l\'IC à 1 − α**. Exemple : x̄ = 498,5, σ = 4, n = 36 → IC 95 % = [**497,19** ; **499,81**]. 500 n\'y est pas → rejet (comme |Z0| = 2,25 > 1,96).', 'Nkhalliw H0 **ghir ila µ0 dakhel IC**. Mithal : IC 95 % = [497,19 ; 499,81], 500 barra → rfed.', 'Keep H0 **iff µ0 is in the 1 − α CI**. Example: CI = [497.19; 499.81], 500 outside → reject.'] },
      { t: ['σ inconnu', 'σ ma m3roufch', 'σ unknown'], b: ['Même démonstration avec S et t(α/2 ; n − 1) : IC = x̄ ± t·S/√n.', 'Nefs chi b S w t(α/2 ; n − 1).', 'Same with S and t(α/2; n − 1).'] }
    ]),

    // ------------------------------------------------------------------
    h(['D6. Pourquoi S² divise par n − 1', 'D6. 3lach S² kayfasem 3la n − 1', 'D6. Why S² divides by n − 1']),
    proof(null, [
      { t: ['Décomposition', 'Décomposition', 'Decomposition'], b: ['On écrit xi − µ = (xi − x̄) + (x̄ − µ) et on développe ; le double produit est nul car Σ(xi − x̄) = 0.', 'xi − µ = (xi − x̄) + (x̄ − µ) ; double produit = 0 7it Σ(xi − x̄) = 0.', 'xi − µ = (xi − x̄) + (x̄ − µ); cross term is 0 since Σ(xi − x̄) = 0.'], tex: '\\sum (x_i - \\bar x)^2 = \\sum (x_i - \\mu)^2 - n(\\bar x - \\mu)^2' },
      { t: ['Espérance', 'Espérance', 'Expectation'], b: ['E[(xi − µ)²] = σ² et E[(x̄ − µ)²] = V(x̄) = σ²/n.', 'E[(xi − µ)²] = σ² ; E[(x̄ − µ)²] = σ²/n.', 'E[(xi − µ)²] = σ²; E[(x̄ − µ)²] = σ²/n.'], tex: 'E\\Big[\\sum (x_i - \\bar x)^2\\Big] = n\\sigma^2 - n\\cdot\\frac{\\sigma^2}{n} = (n-1)\\,\\sigma^2' },
      { t: ['Conclusion', 'Conclusion', 'Conclusion'], b: ['Donc **S² = Σ(xi − x̄)²/(n − 1)** vérifie E(S²) = σ² : estimateur **sans biais**. Diviser par n donnerait en moyenne (n − 1)σ²/n < σ². C\'est le `.std()` de pandas (ddof = 1).', '**S² = Σ(xi − x̄)²/(n − 1)** → E(S²) = σ² (**sans biais**). Howa `.std()` dyal pandas.', '**S² = Σ(xi − x̄)²/(n − 1)** is **unbiased**. It is pandas `.std()` (ddof = 1).'] }
    ]),

    // ------------------------------------------------------------------
    h(['D7. La loi du χ² et (n − 1)S²/σ²', 'D7. Loi dyal χ² w (n − 1)S²/σ²', 'D7. The χ² law and (n − 1)S²/σ²']),
    proof(null, [
      { t: ['Définition', 'Ta3rif', 'Definition'], b: ['Si Z1, …, Zν sont N(0, 1) indépendantes, K = Z1² + … + Zν² suit **χ²(ν)**, ν = degrés de liberté.', 'Z1, …, Zν N(0, 1) mosta9illin → K = ΣZi² ~ **χ²(ν)**.', 'Z1, …, Zν independent N(0, 1) → K = ΣZi² ~ **χ²(ν)**.'] },
      { t: ['Espérance = ν', 'Espérance = ν', 'Mean = ν'], b: ['E(Zi²) = V(Zi) + E(Zi)² = 1 + 0 = 1, donc E(K) = ν. (Et V(K) = 2ν.)', 'E(Zi²) = 1 → E(K) = ν.', 'E(Zi²) = 1 → E(K) = ν.'], tex: 'E(K) = \\sum_{i=1}^{\\nu} E(Z_i^2) = \\nu' },
      { t: ['Lien avec S²', 'Rabt m3a S²', 'Link with S²'], b: ['(n − 1)S²/σ² = Σ((xi − x̄)/σ)² : n carrés, mais liés par **une** contrainte Σ(xi − x̄) = 0 → on perd 1 degré de liberté. Résultat (théorème de Fisher, admis) : **(n − 1)S²/σ² ~ χ²(n − 1)**, indépendant de x̄.', 'n morabba3at, walakin **contrainte wa7da** Σ(xi − x̄) = 0 → ddl na9es 1 : **(n − 1)S²/σ² ~ χ²(n − 1)** (Fisher, admis).', 'n squares tied by **one** constraint → one df lost: **(n − 1)S²/σ² ~ χ²(n − 1)** (Fisher, admitted).'], tex: '\\frac{(n-1)S^2}{\\sigma^2} = \\sum_{i=1}^n \\left(\\frac{x_i - \\bar x}{\\sigma}\\right)^2 \\sim \\chi^2(n-1)' }
    ]),

    // ------------------------------------------------------------------
    h(['D8. σ inconnu : T0 suit Student(n − 1)', 'D8. σ ma m3roufch : T0 ~ Student(n − 1)', 'D8. σ unknown: T0 follows Student(n − 1)']),
    formula('T = \\frac{Z}{\\sqrt{K/\\nu}} \\sim t(\\nu) \\qquad Z \\sim N(0,1),\\ K \\sim \\chi^2(\\nu) \\text{ indépendantes}', ['**Définition de Student** : une N(0, 1) divisée par la racine d\'un χ² divisé par ses ddl.', '**Ta3rif dyal Student** : N(0, 1) m9soma 3la jdr dyal χ² m9soum 3la ddl dyalo.', '**Definition of Student**: an N(0, 1) divided by the root of a χ² over its df.']),
    proof(['Démontrer que T0 = (x̄ − µ)/(S/√n) ~ t(n − 1)', 'Bayyen T0 ~ t(n − 1)', 'Prove T0 ~ t(n − 1)'], [
      { t: ['Faire apparaître σ', 'Dkhel σ', 'Bring in σ'], b: ['On divise le haut et le bas par σ/√n.', 'Nfasmou lfo9 w lta7t 3la σ/√n.', 'Divide top and bottom by σ/√n.'], tex: 'T_0 = \\frac{\\bar x - \\mu}{S/\\sqrt n} = \\frac{\\dfrac{\\bar x - \\mu}{\\sigma/\\sqrt n}}{S/\\sigma}' },
      { t: ['Reconnaître Z et K', '3ref Z w K', 'Recognise Z and K'], b: ['En haut Z ~ N(0, 1) (D2). En bas S/σ = √(S²/σ²) = √(K/(n − 1)) avec K = (n − 1)S²/σ² ~ χ²(n − 1) (D7).', 'Lfo9 Z ; lta7t S/σ = √(K/(n − 1)), K ~ χ²(n − 1).', 'Top Z; bottom S/σ = √(K/(n − 1)), K ~ χ²(n − 1).'], tex: 'T_0 = \\frac{Z}{\\sqrt{K/(n-1)}}' },
      { t: ['Conclure', 'Conclure', 'Conclude'], b: ['Z et K indépendantes → c\'est la définition : **T0 ~ Student(n − 1)**. Le σ inconnu **a disparu** : on peut calculer T0 et lire la table. Exemple : 9 batteries, x̄ ≈ 9,689, S ≈ 0,2934, µ0 = 9,5 → ν = 8, T0 ≈ **1,93**.', '**T0 ~ Student(n − 1)** ; σ **mcha**. Mithal : ν = 8, T0 ≈ **1,93**.', '**T0 ~ Student(n − 1)**; σ **is gone**. Example: ν = 8, T0 ≈ **1.93**.'] }
    ]),
    tip(['Les 3 régions (≠, <, >) de D3 restent **les mêmes**, en remplaçant z par t(· ; n − 1) : |T0| > t(α/2 ; n − 1), T0 < −t(α ; n − 1), T0 > t(α ; n − 1).', '3 régions dyal D3 **hiya hiya**, ghir nbeddlou z b t(· ; n − 1).', 'The 3 regions of D3 stay **the same**, replacing z by t(·; n − 1).']),

    // ------------------------------------------------------------------
    h(['D9. Student → loi normale quand n grandit', 'D9. Student → normale mli n kaykbar', 'D9. Student → normal as n grows']),
    p(['K/ν est une moyenne de ν carrés d\'espérance 1 : quand ν grandit, K/ν → 1 (loi des grands nombres), donc **T = Z/√(K/ν) → Z ~ N(0, 1)**. Concrètement S → σ.', 'K/ν moyenne dyal ν morabba3at (E = 1) : ν kbir → K/ν → 1 → **T → Z ~ N(0, 1)**. Ya3ni S → σ.', 'K/ν is a mean of ν squares with mean 1: as ν grows, K/ν → 1, so **T → Z ~ N(0, 1)**.']),
    table([['ν = n − 1', 'ν = n − 1', 'ν = n − 1'], ['8', '8', '8'], ['30', '30', '30'], ['100', '100', '100'], ['∞', '∞', '∞']], [
      [['t(0,025 ; ν)', 't(0,025 ; ν)', 't(0.025; ν)'], '2,306', '2,042', '1,984', ['**1,96** = z(0,025)', '**1,96**', '**1.96**']],
      [['t(0,05 ; ν)', 't(0,05 ; ν)', 't(0.05; ν)'], '1,860', '1,697', '1,660', ['**1,645** = z(0,05)', '**1,645**', '**1.645**']]
    ]),
    plain(['Student a des **queues plus épaisses** : comme S est incertain, il faut un écart plus grand pour rejeter (2,306 au lieu de 1,96 pour n = 9). Utiliser 1,96 avec σ inconnu et n petit = rejeter trop souvent.', 'Student **dnab dyalha ghlad** : S ma m3roufch mzyan, khass far9 kbir bach nrfdou (2,306 f blast 1,96 l n = 9).', 'Student has **heavier tails**: a larger gap is needed (2.306 instead of 1.96 for n = 9).']),

    // ------------------------------------------------------------------
    h(['D10. Normale et χ² : Z² = χ²(1)', 'D10. Normale w χ² : Z² = χ²(1)', 'D10. Normal and χ²: Z² = χ²(1)']),
    proof(null, [
      { t: ['Relation', 'Rabt', 'Relation'], b: ['Par définition (ν = 1), Z² ~ χ²(1).', 'Ta3rif (ν = 1) : Z² ~ χ²(1).', 'By definition (ν = 1), Z² ~ χ²(1).'] },
      { t: ['Seuils', 'Seuils', 'Thresholds'], b: ['Z² > c² ⇔ |Z| > c, donc P(Z² > c²) = P(|Z| > c) = α donne c = z(α/2).', 'Z² > c² ⇔ |Z| > c → c = z(α/2).', 'Z² > c² ⇔ |Z| > c → c = z(α/2).'], tex: '\\chi^2_{\\alpha;\\,1} = z_{\\alpha/2}^2' },
      { t: ['Vérification sur les tables', 'T2akked b tables', 'Check on the tables'], b: ['5 % : 1,96² = 3,8416 ≈ **3,841** ✓. 1 % : 2,576² = 6,635 ≈ **6,635** ✓. Un test χ² à 1 ddl et un test Z bilatéral donnent **la même décision**.', '1,96² ≈ **3,841** ; 2,576² ≈ **6,635**.', '1.96² ≈ **3.841**; 2.576² ≈ **6.635**.'] }
    ]),

    // ------------------------------------------------------------------
    h(['D11. Le χ² d\'ajustement à 2 classes = Z²', 'D11. χ² d\'ajustement b 2 classes = Z²', 'D11. The 2-class χ² fit = Z²']),
    proof(['X « succès » sur n essais, H0 : p = p0', 'X « succès » f n mra, H0 : p = p0', 'X successes in n trials, H0: p = p0'], [
      { t: ['Tableau', 'Tableau', 'Table'], b: ['Classe 1 : O1 = X, E1 = np0. Classe 2 : O2 = n − X, E2 = n(1 − p0). Donc **O2 − E2 = −(O1 − E1)**.', 'O1 = X, E1 = np0 ; O2 = n − X, E2 = n(1 − p0) → **O2 − E2 = −(O1 − E1)**.', 'O1 = X, E1 = np0; O2 = n − X, E2 = n(1 − p0) → **O2 − E2 = −(O1 − E1)**.'] },
      { t: ['Calcul', '7sab', 'Computation'], b: ['Les deux numérateurs sont égaux à (X − np0)² ; on met au même dénominateur.', 'Jouj numérateurs = (X − np0)².', 'Both numerators are (X − np0)².'], tex: '\\chi^2 = (X - np_0)^2\\left[\\frac{1}{np_0} + \\frac{1}{n(1-p_0)}\\right] = \\frac{(X - np_0)^2}{np_0(1-p_0)} = Z_0^2' },
      { t: ['Exemple', 'Mithal', 'Example'], b: ['n = 100, X = 60, p0 = 0,5 : Z0 = 10/5 = **2**, χ²0 = 100/50 + 100/50 = **4** = 2². ν = k − 1 = 1 → 4 > 3,841 ⇔ 2 > 1,96 : **rejet** dans les deux cas.', 'Z0 = 2, χ²0 = 4 = 2² → 4 > 3,841 ⇔ 2 > 1,96 : **rfed**.', 'Z0 = 2, χ²0 = 4 = 2²: **reject** both ways.'] }
    ]),

    // ------------------------------------------------------------------
    h(['D12. Les degrés de liberté du χ² : ν = k − p − 1', 'D12. ddl dyal χ² : ν = k − p − 1', 'D12. χ² degrees of freedom: ν = k − p − 1']),
    p(['On part de **k** écarts (Oi − Ei). **−1** : ils sont liés par ΣOi = ΣEi = n (le dernier se déduit des autres, comme Σ(xi − x̄) = 0 pour S²). **−p** : chaque paramètre estimé sur les données (µ par x̄, σ par S…) rapproche les Ei des Oi et enlève une liberté. Normalité sur 4 classes avec µ et σ estimés : ν = 4 − 2 − 1 = **1**.', 'Nbdaw b **k** far9. **−1** : ΣOi = ΣEi = n. **−p** : kol paramètre m9addar mn data kay7iyed ddl. Normalité 4 classes, µ w σ m9addrin : ν = 4 − 2 − 1 = **1**.', 'Start with **k** gaps. **−1**: ΣOi = ΣEi = n. **−p**: each estimated parameter removes one. Normality on 4 classes with µ, σ estimated: ν = **1**.']),
    trap(['Ne pas confondre : Student → **n − 1** (une contrainte Σ(xi − x̄) = 0) ; χ² d\'ajustement → **k − p − 1** (k classes, pas n valeurs).', 'Ma tkhaltch : Student → **n − 1** ; χ² → **k − p − 1** (k classes, machi n).', 'Do not mix: Student → **n − 1**; χ² fit → **k − p − 1** (k classes, not n).']),
    exam(['Au contrôle, une démonstration se rédige comme les étapes ci-dessus : **hypothèses** (indépendance, normalité), **propriété utilisée** à chaque ligne (linéarité de E, V(aX) = a²V(X), symétrie de Φ…), puis **conclusion encadrée**. Termine par l\'application numérique quand il y en a une.', 'F contrôle, démonstration katkteb b7al étapes : **hypothèses**, **propriété** f kol str, w **conclusion**. Kmel b application numérique.', 'In the test, write a proof like the steps above: **assumptions**, the **property used** on each line, then the **conclusion**, then the numbers.']),
    quiz('dd-01', 'dd-02', 'dd-03', 'dd-04', 'dd-05', 'dd-06', 'dd-07', 'dd-08', 'dd-09', 'dd-10')
  ],
  keyPoints: [
    L(['E(x̄) = µ, V(x̄) = σ²/n → Z = (x̄ − µ)/(σ/√n) ~ N(0, 1) quand σ est connu.', 'V(x̄) = σ²/n → Z ~ N(0, 1).', 'V(x̄) = σ²/n → Z ~ N(0, 1).']),
    L(['Régions : P(rejeter | H0) = α → ≠ : |Z0| > z(α/2) ; < : Z0 < −z(α) ; > : Z0 > z(α). PV < α ⇔ statistique dans la région.', 'Régions mn P(rfed | H0) = α ; PV < α ⇔ région.', 'Regions from P(reject | H0) = α; PV < α ⇔ region.']),
    L(['E[Σ(xi − x̄)²] = (n − 1)σ² → S² divise par n − 1 ; (n − 1)S²/σ² ~ χ²(n − 1).', 'S² b n − 1 ; (n − 1)S²/σ² ~ χ²(n − 1).', 'S² with n − 1; (n − 1)S²/σ² ~ χ²(n − 1).']),
    L(['T0 = Z/√(K/(n − 1)) ~ Student(n − 1) : σ se simplifie ; t → N(0, 1) quand n grandit.', 'T0 = Z/√(K/(n − 1)) ; σ kaytsimplifia ; t → N(0, 1).', 'T0 = Z/√(K/(n − 1)); σ cancels; t → N(0, 1).']),
    L(['Z² = χ²(1) : 1,96² = 3,841 ; χ² à 2 classes = Z0² ; ν = k − p − 1.', 'Z² = χ²(1) ; 2 classes = Z0² ; ν = k − p − 1.', 'Z² = χ²(1); 2 classes = Z0²; ν = k − p − 1.'])
  ]
};
