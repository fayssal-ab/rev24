import { L, h, p, def, plain, example, formula, steps, tip, trap, exam, table, anim, quiz } from '../../lib';
import type { Chapter } from '../../../src/lib/schema';

/** Chap 5 — Tests d'hypothèses (Pr. A. Kadiri, 2 novembre 2026). All numbers are recomputed by src/lib/stats in content:check. */
export const chapter: Chapter = {
  id: 'tests',
  module: 'data',
  order: 6,
  title: L(['Chap 5 — Tests d\'hypothèses', 'Fasl 5 — Tests d\'hypothèses', 'Ch. 5 — Hypothesis testing']),
  summary: L([
    'Hypothèses H0 / H1, erreurs α et β, puissance, région critique, les lois utilisées (normale, Student, Khi-deux) avec leurs tables, test sur une moyenne (σ connu ou non, bilatéral ou unilatéral), P-value et test d\'ajustement du χ². Les 4 exemples du cours résolus pas à pas.',
    'H0 / H1, akhta2 α w β, puissance, région critique, les lois (normale, Student, Khi-deux) m3a tables, test 3la moyenne (σ m3rouf wla la, bilatéral wla unilatéral), P-value w χ². 4 amthila dyal dars m7loulin étape par étape.',
    'H0 / H1, α and β errors, power, critical region, the distributions used (normal, Student, chi-square) with their tables, test on a mean (σ known or not, two- or one-sided), P-value and the χ² goodness-of-fit test. The 4 course examples solved step by step.'
  ]),
  estimatedMinutes: 70,
  sections: [
    h(['1. L\'idée d\'un test d\'hypothèse', '1. L fikra dyal test', '1. The idea of a hypothesis test']),
    def([
      'Un **test d\'hypothèse** est une méthode statistique permettant de **vérifier**, entre autres, **la valeur d\'un paramètre**, **la forme d\'une distribution**, etc. On formule les hypothèses qui décrivent la situation, puis on exécute un test statistique sur un échantillon.',
      '**Test d\'hypothèse** = méthode statistique bach **nt2akdou** mn **qimat paramètre**, **chkl dyal distribution**… Kanktbou hypothèses dyal l wad3iya, w kandirou test 3la échantillon.',
      'A **hypothesis test** is a statistical method to **check**, among other things, **the value of a parameter**, **the shape of a distribution**, etc. We state the hypotheses describing the situation, then run a statistical test on a sample.'
    ]),
    example([
      '**Exemple 1 du cours — la fusée.** Le cahier des charges exige une vitesse moyenne de combustion de **40 cm/s**. L\'écart-type est **σ = 2 cm/s**. Sur un échantillon de **n = 25**, on mesure **x̄ = 41,25 cm/s**. Question : la moyenne est-elle bien de 40 cm/s ?',
      '**Mithal 1 — fusée.** Cahier des charges kaytleb vitesse moyenne **40 cm/s**. **σ = 2 cm/s**. F échantillon dyal **n = 25**, l9ina **x̄ = 41,25 cm/s**. Sou2al : wach l moyenne bsse7 40 ?',
      '**Course example 1 — the rocket.** The specification requires a mean burning speed of **40 cm/s**. Standard deviation **σ = 2 cm/s**. On a sample of **n = 25** we measure **x̄ = 41.25 cm/s**. Question: is the mean really 40 cm/s?'
    ]),
    plain([
      'x̄ = 41,25 n\'est pas exactement 40… mais un échantillon ne tombe **jamais** pile sur la vraie moyenne. Le test répond à **une seule question** : l\'écart 41,25 − 40 est-il **assez grand** pour ne pas être dû au hasard ?',
      'x̄ = 41,25 machi 40 bdbt… walakin échantillon **3omro** ma ytla3 bdbt l moyenne l 7a9i9iya. Test kayjaweb 3la **sou2al wa7ed** : wach l far9 41,25 − 40 **kbir bzaf** bach ykoun machi sodfa ?',
      'x̄ = 41.25 is not exactly 40… but a sample **never** lands exactly on the true mean. The test answers **one question**: is the gap 41.25 − 40 **large enough** not to be due to chance?'
    ]),

    h(['2. Les hypothèses H0 et H1', '2. Hypothèses H0 w H1', '2. The hypotheses H0 and H1']),
    p([
      'Une **hypothèse statistique** est une affirmation concernant :\n1. la **valeur d\'un paramètre** (moyenne, variance, proportion…) ;\n2. l\'**égalité des paramètres** de deux distributions ;\n3. la **forme d\'une distribution**.\n\nCas 1 et 2 : **hypothèse paramétrique**. Cas 3 : **hypothèse non paramétrique**.',
      '**Hypothèse statistique** = idd3a3 3la :\n1. **qimat paramètre** (moyenne, variance, proportion…) ;\n2. **tasawi paramètres** dyal jouj distributions ;\n3. **chkl dyal distribution**.\n\n1 w 2 : **paramétrique**. 3 : **non paramétrique**.',
      'A **statistical hypothesis** is a claim about:\n1. the **value of a parameter** (mean, variance, proportion…);\n2. the **equality of parameters** of two distributions;\n3. the **shape of a distribution**.\n\nCases 1 and 2: **parametric**. Case 3: **non-parametric**.'
    ]),
    table([['Hypothèse', 'Hypothèse', 'Hypothesis'], ['Forme', 'Chkl', 'Form'], ['Nom', 'Smiya', 'Name']], [
      [['**H0** (nulle)', '**H0** (nulle)', '**H0** (null)'], 'θ = θ0', ['Toujours avec le signe **=**', 'Dima b **=**', 'Always with **=**']],
      [['**H1** (alternative)', '**H1**', '**H1** (alternative)'], 'θ ≠ θ0', ['**Bilatérale**', '**Bilatérale**', '**Two-sided**']],
      [['**H1**', '**H1**', '**H1**'], 'θ < θ0', ['**Unilatérale à gauche**', '**Unilatérale gauche**', '**Left-tailed**']],
      [['**H1**', '**H1**', '**H1**'], 'θ > θ0', ['**Unilatérale à droite**', '**Unilatérale droite**', '**Right-tailed**']]
    ]),
    p(['H0 peut provenir : d\'**expériences antérieures** (les conditions ont-elles changé ?), d\'une **théorie ou d\'un modèle** (est-il valide ?), ou de **spécifications techniques** (le produit est-il conforme ?) — c\'est le cas de la fusée.', 'H0 jaya mn : **tajarib 9dima**, **théorie / modèle**, wla **spécifications techniques** (b7al fusée).', 'H0 can come from **previous experiments**, a **theory or model**, or **technical specifications** — the rocket case.']),
    quiz('dt-01', 'dt-02'),

    h(['3. Les deux erreurs, α, β et la puissance', '3. Jouj akhta2, α, β w puissance', '3. The two errors, α, β and power']),
    table([['Décision \\ Réalité', 'Qarar \\ Wa9i3', 'Decision \\ Reality'], ['H0 vraie', 'H0 s7i7a', 'H0 true'], ['H0 fausse', 'H0 ghalta', 'H0 false']], [
      [['Accepter H0', 'Qbel H0', 'Accept H0'], ['**1 − α** (bonne décision)', '**1 − α** (mzyan)', '**1 − α** (correct)'], ['**Erreur de type II (β)**', '**Ghalat naw3 II (β)**', '**Type II error (β)**']],
      [['Rejeter H0', 'Rfed H0', 'Reject H0'], ['**Erreur de type I (α)**', '**Ghalat naw3 I (α)**', '**Type I error (α)**'], ['**1 − β = puissance**', '**1 − β = puissance**', '**1 − β = power**']]
    ]),
    formula('\\alpha = P(\\text{rejeter } H_0 \\mid H_0 \\text{ vraie}) \\qquad \\beta = P(\\text{accepter } H_0 \\mid H_0 \\text{ fausse}) \\qquad \\text{puissance} = 1 - \\beta', [
      'α s\'appelle aussi le **seuil critique** ou **seuil de signification**. La **puissance** est la probabilité de rejeter H0 quand H0 est effectivement fausse.',
      'α smitha **seuil critique** wla **seuil de signification**. **Puissance** = proba nrfdou H0 mli hiya ghalta b s7.',
      'α is also called the **critical level** or **significance level**. **Power** is the probability of rejecting H0 when it is really false.'
    ]),
    example([
      '**Exemple 2 — le procès (cas 1).** H0 : la personne est **innocente**, H1 : **coupable**. Condamner un innocent = **α** ; libérer un coupable = **β**. On fixe α petit car **ne pas condamner un innocent est prioritaire**.\n\n**Cas 2** : si on pose H0 : **coupable**, les rôles s\'inversent : α = libérer un coupable, β = condamner un innocent. **Le choix de H0 décide quelle erreur on contrôle.**',
      '**Mithal 2 — lm7akama (cas 1).** H0 : **bri2**, H1 : **moujrim**. T7kem 3la bri2 = **α** ; tkhlli moujrim = **β**. α sghir 7it **ma n7kmouch 3la bri2 hiya l2awlawiya**.\n\n**Cas 2** : ila H0 : **moujrim**, kayt9elbou : α = tkhlli moujrim, β = t7kem 3la bri2. **Khtiyar H0 kaykhtar ina ghalat kancontroliw.**',
      '**Example 2 — the trial (case 1).** H0: the person is **innocent**, H1: **guilty**. Convicting an innocent = **α**; freeing a guilty person = **β**. α is set small because **not convicting an innocent comes first**.\n\n**Case 2**: with H0: **guilty**, roles swap. **The choice of H0 decides which error we control.**'
    ]),
    anim('ErrorTable'),
    p(['Remarques du cours : on veut α et β petits ; **α est fixé à l\'avance** ; à α et n fixés, β dépend du vrai θ (sa courbe = **courbe caractéristique** du test) ; souvent **α < β** ; **pour diminuer β, il faut augmenter α et/ou n**.', 'Molahadat : bghina α w β sghar ; **α kanfixiwh 9bel** ; β kat3tamed 3la θ (**courbe caractéristique**) ; ghaliban **α < β** ; **bach tn9ss β, zid α wla n**.', 'Course remarks: we want α and β small; **α is fixed in advance**; at fixed α and n, β depends on the true θ (its curve = **operating characteristic**); often **α < β**; **to reduce β, increase α and/or n**.']),
    quiz('dt-03', 'dt-04', 'dt-05'),

    h(['4. Région critique et étapes d\'un test', '4. Région critique w étapes dyal test', '4. Critical region and test steps']),
    def([
      'Une **région critique** est une zone où il est **peu probable** que la statistique tombe **si H0 est vraie**. Si la statistique calculée y tombe → **rejeter H0 (conclusion forte)**. Sinon → **ne pas rejeter H0 (conclusion faible)**.',
      '**Région critique** = zone li **sa3ib** tti7 fiha statistique **ila H0 s7i7a**. Ila tla3t fiha → **nrfdou H0 (conclusion 9wiya)**. Sinon → **ma nrfdouch (conclusion d3ifa)**.',
      'A **critical region** is where the statistic is **unlikely** to fall **if H0 is true**. If it falls there → **reject H0 (strong conclusion)**. Otherwise → **do not reject H0 (weak conclusion)**.'
    ]),
    p(['**Les étapes détaillées du cours :**\n1. Formuler **H0 et H1**.\n2. Choisir **α**.\n3. Considérer un échantillon de taille **n**.\n4. **Exécuter le test** (ex. comparer |Z0| à zα/2).\n5. **Conclure** : rejeter H0 (forte) ou ne pas rejeter (faible).\n6. *Facultatif* : calculer β.\n7. *Facultatif* : si β est trop grand, changer α et/ou n et recommencer.', '**Étapes :**\n1. **H0 w H1**.\n2. Khtar **α**.\n3. Échantillon dyal **n**.\n4. **Dir test** (9aren |Z0| m3a zα/2).\n5. **Conclure**.\n6. *Ikhtiyari* : 7seb β.\n7. *Ikhtiyari* : ila β kbir, beddel α wla n.', '**The course\'s steps:**\n1. State **H0 and H1**.\n2. Choose **α**.\n3. Take a sample of size **n**.\n4. **Run the test** (e.g. compare |Z0| with zα/2).\n5. **Conclude**: reject H0 (strong) or not (weak).\n6. *Optional*: compute β.\n7. *Optional*: if β is too big, change α and/or n and start again.']),
    quiz('dt-06'),

    h(['5. Les lois à connaître (et leurs tables)', '5. Les lois li khassek t3ref (m3a tables)', '5. The distributions to know (and their tables)']),
    formula('Z = \\frac{\\bar X - \\mu_0}{\\sigma/\\sqrt n} \\sim \\mathcal N(0,1) \\qquad T = \\frac{\\bar X - \\mu_0}{S/\\sqrt n} \\sim t_{n-1} \\qquad \\chi^2 = \\sum \\frac{(O_i-E_i)^2}{E_i} \\sim \\chi^2_{\\nu}', [
      'Trois lois, trois situations : **normale centrée réduite** N(0, 1) quand σ est connu ; **Student** à n − 1 degrés de liberté quand σ est inconnu (remplacé par S) ; **Khi-deux** à ν = k − p − 1 degrés de liberté pour l\'ajustement.',
      'Tlata lois, tlata 7alat : **normale** N(0, 1) mli σ m3rouf ; **Student** b n − 1 ddl mli σ ma m3roufch (kanst3mlou S) ; **Khi-deux** b ν = k − p − 1 l ajustement.',
      'Three laws, three situations: **standard normal** N(0, 1) when σ is known; **Student** with n − 1 degrees of freedom when σ is unknown (replaced by S); **chi-square** with ν = k − p − 1 degrees of freedom for goodness of fit.'
    ]),
    p(['**Loi normale N(0, 1)** — Φ(z) = P(Z ≤ z), la fonction de répartition. Symétrie : Φ(−z) = 1 − Φ(z). On note **zα** la valeur telle que **P(Z > zα) = α**.', '**Normale N(0, 1)** — Φ(z) = P(Z ≤ z). Tamatoul : Φ(−z) = 1 − Φ(z). **zα** : P(Z > zα) = α.', '**Normal N(0, 1)** — Φ(z) = P(Z ≤ z), the CDF. Symmetry: Φ(−z) = 1 − Φ(z). **zα** is the value with **P(Z > zα) = α**.']),
    table([['α (une queue)', 'α (jiha wa7da)', 'α (one tail)'], ['zα', 'zα', 'zα'], ['Utilisation typique', 'Fin', 'Typical use']], [
      ['0,10', '1,282', ['Unilatéral 10 %', 'Unilatéral 10 %', 'One-sided 10 %']],
      ['0,05', '1,645', ['**Unilatéral 5 %** (ou bilatéral 10 %)', '**Unilatéral 5 %**', '**One-sided 5 %** (or two-sided 10 %)']],
      ['0,025', '1,960', ['**Bilatéral 5 %** (α/2 = 0,025)', '**Bilatéral 5 %**', '**Two-sided 5 %** (α/2 = 0.025)']],
      ['0,01', '2,326', ['Unilatéral 1 % (ou bilatéral 2 %)', 'Unilatéral 1 %', 'One-sided 1 % (or two-sided 2 %)']],
      ['0,005', '2,576', ['**Bilatéral 1 %**', '**Bilatéral 1 %**', '**Two-sided 1 %**']]
    ]),
    p(['Quelques valeurs de Φ : Φ(1) = 0,8413 ; Φ(1,645) = 0,9500 ; Φ(1,96) = 0,9750 ; Φ(2) = 0,9772 ; Φ(2,5) = 0,9938 ; Φ(3) = 0,9987.', 'Qiyam dyal Φ : Φ(1) = 0,8413 ; Φ(1,645) = 0,95 ; Φ(1,96) = 0,975 ; Φ(2) = 0,9772 ; Φ(2,5) = 0,9938 ; Φ(3) = 0,9987.', 'Some Φ values: Φ(1) = 0.8413; Φ(1.645) = 0.95; Φ(1.96) = 0.975; Φ(2) = 0.9772; Φ(2.5) = 0.9938; Φ(3) = 0.9987.']),
    p(['**Loi de Student t(ν)** — même forme en cloche que N(0, 1) mais **queues plus épaisses** (on est moins sûr car σ est estimé). Quand ν grandit, elle se rapproche de N(0, 1). On note **tα;ν** la valeur telle que P(T > tα;ν) = α.', '**Student t(ν)** — b7al cloche dyal normale walakin **jwaneb atkhan** (7it σ m9addra). Mli ν kbir, katwli 9riba mn N(0, 1). **tα;ν** : P(T > tα;ν) = α.', '**Student t(ν)** — same bell shape as N(0, 1) but **heavier tails** (σ is estimated). As ν grows it approaches N(0, 1). **tα;ν** satisfies P(T > tα;ν) = α.']),
    table([['ν (ddl)', 'ν (ddl)', 'ν (df)'], ['t0,05', 't0,05', 't0.05'], ['t0,025', 't0,025', 't0.025'], ['t0,01', 't0,01', 't0.01'], ['t0,005', 't0,005', 't0.005']], [
      ['8', '1,860', '2,306', '2,896', '3,355'],
      ['9', '1,833', '2,262', '**2,821**', '3,250'],
      ['24', '1,711', '2,064', '2,492', '2,797'],
      ['∞ (= normale)', '1,645', '1,960', '2,326', '2,576']
    ]),
    p(['**Loi du Khi-deux χ²(ν)** — toujours **positive**, asymétrique. Le test d\'ajustement rejette quand χ² est **grand** (test unilatéral à droite). On note **χ²α;ν** la valeur telle que P(χ² > χ²α;ν) = α.', '**Khi-deux χ²(ν)** — dima **mojaba**, machi mtamatla. Kanrfdou mli χ² **kbir** (jiha limna). **χ²α;ν** : P(χ² > χ²α;ν) = α.', '**Chi-square χ²(ν)** — always **positive**, skewed. The fit test rejects when χ² is **large** (right-tailed). **χ²α;ν** satisfies P(χ² > χ²α;ν) = α.']),
    table([['ν', 'ν', 'ν'], ['χ²0,05', 'χ²0,05', 'χ²0.05'], ['χ²0,01', 'χ²0,01', 'χ²0.01']], [
      ['1', '**3,841**', '6,635'],
      ['2', '5,991', '9,210'],
      ['3', '7,815', '11,345'],
      ['4', '9,488', '13,277'],
      ['5', '11,070', '15,086']
    ]),
    tip(['Au contrôle, les tables sont fournies : l\'important est de savoir **quelle ligne / colonne lire**. Bilatéral → **α/2** ; unilatéral → **α** ; Student → **ν = n − 1** ; χ² → **ν = k − p − 1**.', 'F contrôle tables kayn3tawk : lmohim t3ref **ina str / colonne t9ra**. Bilatéral → **α/2** ; unilatéral → **α** ; Student → **ν = n − 1** ; χ² → **ν = k − p − 1**.', 'In the test the tables are given: what matters is **which row / column to read**. Two-sided → **α/2**; one-sided → **α**; Student → **ν = n − 1**; χ² → **ν = k − p − 1**.']),

    h(['6. Test bilatéral sur la moyenne, σ connu (Z)', '6. Test bilatéral 3la moyenne, σ m3rouf (Z)', '6. Two-sided test on a mean, σ known (Z)']),
    formula('H_0 : \\mu = \\mu_0 \\quad H_1 : \\mu \\neq \\mu_0 \\qquad Z_0 = \\frac{\\bar X - \\mu_0}{\\sigma/\\sqrt n} \\qquad \\text{rejeter } H_0 \\text{ si } |Z_0| > z_{\\alpha/2}', ['Les trois étapes principales du cours : hypothèses, statistique, décision.', 'Tlata étapes : hypothèses, statistique, qarar.', 'The three main steps: hypotheses, statistic, decision.']),
    steps(['Exemple 1 — la fusée (α = 5 %)', 'Mithal 1 — fusée (α = 5 %)', 'Example 1 — the rocket (α = 5 %)'], [
      { t: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['H0 : µ = 40 contre H1 : µ ≠ 40 (on veut savoir si la vitesse **diffère**, dans un sens ou l\'autre → **bilatéral**).', 'H0 : µ = 40 vs H1 : µ ≠ 40 (**bilatéral**).', 'H0: µ = 40 vs H1: µ ≠ 40 (**two-sided**).'] },
      { t: ['Choisir la statistique', 'Khtar statistique', 'Choose the statistic'], b: ['σ = 2 est **connu** → statistique **Z0**, qui suit N(0, 1) si H0 est vraie.', 'σ **m3rouf** → **Z0** ~ N(0, 1).', 'σ = 2 is **known** → **Z0** ~ N(0, 1) under H0.'] },
      { t: ['Calculer l\'écart-type de x̄', '7seb écart-type dyal x̄', 'Standard deviation of x̄'], b: ['σ/√n = 2/√25 = 2/5 = **0,4**.', '2/5 = **0,4**.', '2/5 = **0.4**.'], why: ['La moyenne de 25 mesures varie beaucoup moins qu\'une mesure seule : son écart-type est divisé par √n.', 'Moyenne dyal 25 kat-tbeddel 9ell mn mesure wa7da : / √n.', 'A mean of 25 measurements varies much less than one: divide by √n.'] },
      { t: ['Calculer Z0', '7seb Z0', 'Compute Z0'], b: ['Z0 = (41,25 − 40) / 0,4 = 1,25 / 0,4 = **3,125**.', 'Z0 = 1,25 / 0,4 = **3,125**.', 'Z0 = 1.25 / 0.4 = **3.125**.'], tex: 'Z_0 = \\frac{41{,}25 - 40}{2/\\sqrt{25}} = \\frac{1{,}25}{0{,}4} = 3{,}125' },
      { t: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['Bilatéral à 5 % → α/2 = 0,025 dans chaque queue → **z0,025 = 1,96**.', 'α/2 = 0,025 → **1,96**.', 'α/2 = 0.025 → **1.96**.'] },
      { t: ['Décision', 'Qarar', 'Decision'], b: ['|Z0| = 3,125 > 1,96 → **on rejette H0** (conclusion forte).', '3,125 > 1,96 → **nrfdou H0**.', '3.125 > 1.96 → **reject H0**.'] },
      { t: ['Conclusion dans le contexte', 'Conclusion f l contexte', 'Conclusion in context'], b: ['Au risque 5 %, la vitesse moyenne de combustion **n\'est pas** de 40 cm/s : le carburant **ne respecte pas** le cahier des charges (il brûle plus vite).', 'B risque 5 %, l vitesse **machi** 40 cm/s : **ma m7tarmach** cahier des charges.', 'At the 5 % level the mean speed **is not** 40 cm/s: the fuel **does not meet** the specification.'] }
    ]),
    anim('HypothesisTestVisualizer', { preset: 'fusee' }),

    h(['7. Test bilatéral sur la moyenne, σ inconnu (Student)', '7. Test bilatéral, σ ma m3roufch (Student)', '7. Two-sided test on a mean, σ unknown (Student)']),
    formula('T_0 = \\frac{\\bar X - \\mu_0}{S/\\sqrt n}, \\quad S = \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^{n}(x_i-\\bar x)^2} \\qquad \\text{rejeter } H_0 \\text{ si } |T_0| > t_{\\alpha/2;\\,n-1}', ['On remplace σ par S (diviseur n − 1) et la loi normale par la loi de Student à n − 1 degrés de liberté.', 'Kanbeddlou σ b S (n − 1) w normale b Student b n − 1.', 'Replace σ with S (n − 1) and the normal law with Student with n − 1 df.']),
    steps(['Exemple du cours — les comprimés (seuil 98 %)', 'Mithal — comprimés (98 %)', 'Course example — the tablets (98 % level)'], [
      { t: ['Lire l\'énoncé', '9ra l énoncé', 'Read the statement'], b: ['10 comprimés pesés : 0,81 ; 0,84 ; 0,83 ; 0,80 ; 0,85 ; 0,86 ; 0,85 ; 0,83 ; 0,84 ; 0,80 g. Moyenne de production annoncée : 0,83 g. « Seuil 98 % » = confiance 98 % → **α = 2 %**. σ n\'est pas donné → **Student**.', '10 comprimés. µ0 = 0,83. 98 % → **α = 2 %**. σ ma m3tich → **Student**.', '10 tablets weighed; µ0 = 0.83 g. "98 % level" → **α = 2 %**. σ not given → **Student**.'] },
      { t: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['H0 : µ = 0,83 contre H1 : µ ≠ 0,83.', 'H0 : µ = 0,83 vs H1 : µ ≠ 0,83.', 'H0: µ = 0.83 vs H1: µ ≠ 0.83.'] },
      { t: ['Moyenne', 'Moyenne', 'Mean'], b: ['Somme = 8,31 → x̄ = 8,31 / 10 = **0,831 g**.', 'x̄ = **0,831**.', 'x̄ = **0.831 g**.'] },
      { t: ['Écart-type corrigé S', 'S', 'Corrected S'], b: ['Somme des carrés des écarts à 0,831 : **0,00409**. S² = 0,00409 / 9 ≈ 0,000454 → **S ≈ 0,0213**.', 'Σ = 0,00409 → S ≈ **0,0213**.', 'Sum of squares 0.00409 → S ≈ **0.0213**.'], tex: 'S = \\sqrt{\\frac{0{,}00409}{9}} \\approx 0{,}0213' },
      { t: ['Statistique T0', 'T0', 'Statistic T0'], b: ['T0 = (0,831 − 0,83) / (0,0213 / √10) = 0,001 / 0,00674 ≈ **0,148**.', 'T0 ≈ **0,148**.', 'T0 ≈ **0.148**.'], tex: 'T_0 = \\frac{0{,}001}{0{,}0213/\\sqrt{10}} \\approx 0{,}148' },
      { t: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['Bilatéral, α = 0,02 → α/2 = 0,01 ; ν = n − 1 = 9 → **t0,01;9 = 2,821** (table de Student).', 'α/2 = 0,01, ν = 9 → **2,821**.', 'α/2 = 0.01, ν = 9 → **2.821**.'] },
      { t: ['Décision et conclusion', 'Qarar', 'Decision'], b: ['|T0| = 0,148 ≤ 2,821 → **on ne rejette pas H0** (conclusion faible). Le poids moyen observé est **compatible** avec 0,83 g au seuil 98 %.', '0,148 ≤ 2,821 → **ma nrfdouch H0**. Compatible m3a 0,83 g.', '0.148 ≤ 2.821 → **do not reject H0**. Compatible with 0.83 g.'] }
    ]),
    trap(['Trois pièges : **α/2** en bilatéral (pas α) ; **ν = n − 1 = 9** (pas 10) ; **S avec n − 1** (pas n). Chacun fait perdre le point.', 'Tlata fkhakh : **α/2** ; **ν = 9** machi 10 ; **S b n − 1**.', 'Three traps: **α/2** for two-sided; **ν = n − 1 = 9**; **S with n − 1**.']),

    h(['8. Tests unilatéraux', '8. Tests unilatéraux', '8. One-sided tests']),
    table([['Critère', 'Mi3yar', 'Criterion'], ['Unilatéral à gauche, H1 : µ < µ0', 'Gauche, H1 : µ < µ0', 'Left-tailed, H1: µ < µ0'], ['Unilatéral à droite, H1 : µ > µ0', 'Droite, H1 : µ > µ0', 'Right-tailed, H1: µ > µ0']], [
      [['σ connu', 'σ m3rouf', 'σ known'], 'Z0 < −zα', 'Z0 > zα'],
      [['σ inconnu', 'σ ma m3roufch', 'σ unknown'], 'T0 < −tα;n−1', 'T0 > tα;n−1']
    ]),
    p(['Les statistiques sont **les mêmes** ; seule la région critique change : tout α est d\'**un seul côté**, et **le signe compte** (pas de valeur absolue).', 'Nefs statistiques ; ghir région critique katbeddel : α kamla f **jiha wa7da**, w **signe mohim** (bla valeur absolue).', 'The statistics are **the same**; only the critical region changes: all of α on **one side**, and **the sign matters**.']),
    steps(['Exemple du cours — la glycémie (α = 5 %)', 'Mithal — glycémie (α = 5 %)', 'Course example — blood sugar (α = 5 %)'], [
      { t: ['Données', 'Data', 'Data'], b: ['Population : µ0 = 1 g/L, σ0 = 0,1 g/L. 9 patients suspects d\'**hypoglycémie** : x̄ = 1,12 g/L.', 'µ0 = 1, σ0 = 0,1, n = 9, x̄ = 1,12.', 'µ0 = 1 g/L, σ0 = 0.1, n = 9, x̄ = 1.12.'] },
      { t: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['On veut tester si la glycémie est **inférieure** : H0 : µ = 1 (µ ≥ 1) contre **H1 : µ < 1** → **unilatéral à gauche**.', 'H1 : µ < 1 → **gauche**.', 'H1: µ < 1 → **left-tailed**.'] },
      { t: ['Statistique', 'Statistique', 'Statistic'], b: ['σ connu → Z0 = (1,12 − 1) / (0,1/√9) = 0,12 / 0,0333 = **3,6**.', 'Z0 = **3,6**.', 'Z0 = **3.6**.'], tex: 'Z_0 = \\frac{1{,}12 - 1}{0{,}1/3} = 3{,}6' },
      { t: ['Région critique', 'Région critique', 'Critical region'], b: ['Gauche à 5 % : on rejette si **Z0 < −1,645**.', 'Nrfdou ila **Z0 < −1,645**.', 'Reject if **Z0 < −1.645**.'] },
      { t: ['Décision', 'Qarar', 'Decision'], b: ['Z0 = +3,6 n\'est **pas** < −1,645 → **on ne rejette pas H0**. L\'échantillon est représentatif d\'une population de moyenne **au moins égale à 1 g/L** : ces patients ne sont pas en hypoglycémie (leur moyenne est même au-dessus).', '+3,6 machi < −1,645 → **ma nrfdouch H0**.', '+3.6 is **not** < −1.645 → **do not reject H0**.'], why: ['Le piège : |3,6| > 1,645 pousse à rejeter… mais en unilatéral **on ne prend pas la valeur absolue**. Z0 va dans le sens **opposé** à H1.', 'Fekh : bla valeur absolue f unilatéral.', 'Trap: no absolute value in one-sided tests.'] }
    ]),
    quiz('dt-07', 'dt-08', 'dt-12', 'dt-16'),

    h(['9. Le niveau critique observé (P-value)', '9. P-value', '9. The observed significance level (P-value)']),
    def([
      'La **P-value** (PV) est la **valeur minimale de α** pour laquelle H0 est rejetée. **Avantage** : une fois PV connue, on décide pour n\'importe quel α : **si α > PV, on rejette H0**. **Inconvénient** : calcul pas toujours facile (les logiciels la donnent). Si PV est grande, on accepte H0.',
      '**P-value** = **a9al α** li kanrfdou fih H0. **Mzya** : mli t3ref PV, t9arrer l ay α : **ila α > PV, rfed H0**. **3ib** : 7sabha s3ib chwiya (logiciels kay3tiwha). Ila PV kbira, qbel H0.',
      'The **P-value** (PV) is the **smallest α** for which H0 is rejected. **Pro**: once known, decide for any α: **if α > PV, reject H0**. **Con**: not always easy to compute (software gives it). Large PV → accept H0.'
    ]),
    table([['Cas', '7ala', 'Case'], ['σ connu', 'σ m3rouf', 'σ known'], ['σ inconnu', 'σ ma m3roufch', 'σ unknown']], [
      [['Gauche (µ < µ0)', 'Gauche', 'Left'], 'PV = Φ(z0)', 'PV = P(T > |t0|), T ~ tn−1'],
      [['Droite (µ > µ0)', 'Droite', 'Right'], 'PV = 1 − Φ(z0)', 'PV = P(T > |t0|), T ~ tn−1'],
      [['Bilatéral', 'Bilatéral', 'Two-sided'], 'PV = 2(1 − Φ(|z0|))', 'PV = 2 P(T > |t0|)']
    ]),
    steps(['P-value de l\'exemple 1 (fusée)', 'P-value dyal fusée', 'P-value of example 1 (rocket)'], [
      { t: ['Choisir la formule', 'Khtar formule', 'Pick the formula'], b: ['σ connu, bilatéral → PV = 2(1 − Φ(|z0|)).', 'Bilatéral → 2(1 − Φ(|z0|)).', 'Two-sided → 2(1 − Φ(|z0|)).'] },
      { t: ['Lire Φ(3,125)', '9ra Φ(3,125)', 'Read Φ(3.125)'], b: ['Φ(3,125) ≈ 0,99911.', 'Φ(3,125) ≈ 0,99911.', 'Φ(3.125) ≈ 0.99911.'] },
      { t: ['Calculer PV', '7seb PV', 'Compute PV'], b: ['PV = 2 × (1 − 0,99911) ≈ **0,0018**.', 'PV ≈ **0,0018**.', 'PV ≈ **0.0018**.'], tex: 'PV = 2\\,(1 - \\Phi(3{,}125)) \\approx 0{,}0018' },
      { t: ['Décider', 'Qarrer', 'Decide'], b: ['α = 0,05 > 0,0018 → **rejet de H0** (même décision qu\'avec la région critique, heureusement !). On rejetterait même à α = 1 %.', '0,05 > 0,0018 → **rejet**.', '0.05 > 0.0018 → **reject H0**.'] }
    ]),
    p(['Pour la glycémie (gauche) : PV = Φ(3,6) ≈ **0,9998** → énorme → on ne rejette pas H0. Pour les comprimés : PV = 2P(T > 0,148) ≈ **0,885** → on ne rejette pas.', 'Glycémie : PV = Φ(3,6) ≈ **0,9998** → ma nrfdouch. Comprimés : PV ≈ **0,885**.', 'Blood sugar (left): PV = Φ(3.6) ≈ **0.9998** → do not reject. Tablets: PV ≈ **0.885**.']),
    quiz('dt-09', 'dt-23'),

    h(['10. Le test d\'ajustement du Khi-deux', '10. Test d\'ajustement dyal Khi-deux', '10. The chi-square goodness-of-fit test']),
    p(['On veut vérifier si les données x1, …, xn proviennent d\'une loi particulière F(x, θ) : **H0 : X ~ F(x, θ)** contre **H1 : X ne suit pas F**. C\'est un test **non paramétrique** (il porte sur la forme de la loi).', 'Bghina nchoufou wach data jaya mn loi F : **H0 : X ~ F** vs **H1 : la**. Test **non paramétrique**.', 'Check whether the data come from a given law F(x, θ): **H0: X ~ F** vs **H1: X does not follow F**. A **non-parametric** test.']),
    formula('E_i = n\\,p_i^{(0)} \\qquad \\chi^2_0 = \\sum_{i=1}^{k} \\frac{(O_i - E_i)^2}{E_i} \\qquad \\nu = k - p - 1 \\qquad \\text{rejeter } H_0 \\text{ si } \\chi^2_0 > \\chi^2_{\\alpha;\\nu}', [
      '**Oi** = effectifs observés, **Ei** = effectifs attendus si H0 est vraie, **pi(0)** = P(X ∈ classe i | H0). χ²0 est une sorte de **distance** entre observé et attendu : plus elle est grande, moins H0 est plausible. **k** = nombre de classes retenues, **p** = nombre de paramètres estimés. Si des Ei sont petits, **regrouper des classes**.',
      '**Oi** = li tchafou, **Ei** = li kan tssennaw ila H0 s7i7a. χ²0 = **massafa** bin observé w attendu. **k** = 3adad classes, **p** = 3adad paramètres m9addrin. Ila Ei sghar, **jme3 classes**.',
      '**Oi** = observed counts, **Ei** = expected counts under H0. χ²0 is a **distance** between observed and expected: the larger, the less plausible H0. **k** = number of classes, **p** = number of estimated parameters. Merge classes if some Ei are small.'
    ]),
    steps(['Exemple du cours — les données suivent-elles une loi normale ? (α = 0,05)', 'Mithal — wach data normale ? (α = 0,05)', 'Course example — are the data normal? (α = 0.05)'], [
      { t: ['Données', 'Data', 'Data'], b: ['Classes [0 ; 0,5[, [0,5 ; 1[, [1 ; 1,5[, [1,5 ; ∞[ avec Oi = **2, 23, 17, 8** (n = 50). x̄ = 1,168 et S = 0,591.', 'Oi = 2, 23, 17, 8 (n = 50) ; x̄ = 1,168, S = 0,591.', 'Oi = **2, 23, 17, 8** (n = 50); x̄ = 1.168, S = 0.591.'] },
      { t: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['H0 : X ~ N(µ, σ²) contre H1 : X ne suit pas une loi normale. µ et σ sont **estimés** par x̄ et S → **p = 2**.', 'H0 : normale. µ w σ m9addrin → **p = 2**.', 'H0: X ~ N(µ, σ²). µ and σ are **estimated** → **p = 2**.'] },
      { t: ['Probabilités des classes sous H0', 'Probabilités dyal classes', 'Class probabilities under H0'], b: ['On centre-réduit chaque borne : z = (borne − 1,168) / 0,591.\n- p1 = Φ((0,5 − 1,168)/0,591) = Φ(−1,130) ≈ **0,129**\n- p2 = Φ(−0,284) − Φ(−1,130) ≈ **0,259**\n- p3 = Φ(0,562) − Φ(−0,284) ≈ **0,325**\n- p4 = 1 − Φ(0,562) ≈ **0,287**\n(Pour la 1re classe on prend toute la queue gauche pour que les p somment à 1.)', 'z = (borne − 1,168)/0,591 → p ≈ 0,129 ; 0,259 ; 0,325 ; 0,287.', 'Standardise each bound → p ≈ **0.129; 0.259; 0.325; 0.287**.'] },
      { t: ['Effectifs attendus', 'Effectifs attendus', 'Expected counts'], b: ['Ei = 50 × pi ≈ **6,46 ; 12,95 ; 16,24 ; 14,36** (tous ≥ 5, pas besoin de regrouper).', 'Ei ≈ 6,46 ; 12,95 ; 16,24 ; 14,36.', 'Ei ≈ **6.46; 12.95; 16.24; 14.36**.'] },
      { t: ['Statistique χ²0', 'χ²0', 'χ²0 statistic'], b: ['(2 − 6,46)²/6,46 ≈ 3,08 ; (23 − 12,95)²/12,95 ≈ 7,81 ; (17 − 16,24)²/16,24 ≈ 0,04 ; (8 − 14,36)²/14,36 ≈ 2,81. Total **χ²0 ≈ 13,74**.', 'χ²0 ≈ **13,74**.', 'χ²0 ≈ **13.74**.'] },
      { t: ['Degrés de liberté', 'Ddl', 'Degrees of freedom'], b: ['ν = k − p − 1 = 4 − 2 − 1 = **1** → χ²0,05;1 = **3,841**.', 'ν = 1 → **3,841**.', 'ν = 1 → **3.841**.'] },
      { t: ['Décision', 'Qarar', 'Decision'], b: ['13,74 > 3,841 → **on rejette H0** : au risque 5 %, les données **ne suivent pas** une loi normale.', '13,74 > 3,841 → **rejet** : machi normale.', '13.74 > 3.841 → **reject H0**: the data are **not** normal.'], why: ['La classe [0,5 ; 1[ contient 23 valeurs alors qu\'on en attendait 13 : c\'est elle qui fait exploser χ².', 'Classe 2 fiha 23 f blast 13.', 'Class 2 holds 23 values instead of 13.'] }
    ]),
    anim('ChiSquareBuilder'),
    exam(['À chaque test, rédige toujours **5 lignes** : (1) H0/H1, (2) statistique + sa loi sous H0, (3) valeur calculée, (4) valeur critique ou PV, (5) décision **et** phrase de conclusion dans le contexte de l\'énoncé.', 'F kol test, kteb **5 stour** : H0/H1, statistique + loi, qima m7souba, valeur critique wla PV, qarar **w** jomla f l contexte.', 'For every test write **5 lines**: (1) H0/H1, (2) statistic + law under H0, (3) computed value, (4) critical value or PV, (5) decision **and** a sentence in context.']),
    quiz('dt-26', 'dt-27', 'dt-29')
  ],
  keyPoints: [
    L(['H0 contient toujours « = » ; H1 : ≠ (bilatéral), < (gauche), > (droite). Paramétrique = sur un paramètre ; non paramétrique = sur la forme de la loi.', 'H0 b « = » ; H1 : ≠, <, >.', 'H0 has "="; H1: ≠, <, >. Parametric vs non-parametric.']),
    L(['α = P(rejeter H0 | H0 vraie) (type I, fixé à l\'avance) ; β = P(accepter H0 | H0 fausse) (type II) ; puissance = 1 − β ; pour baisser β, augmenter α et/ou n.', 'α, β, puissance.', 'α (type I), β (type II), power = 1 − β.']),
    L(['σ connu : Z0 = (x̄ − µ0)/(σ/√n) ~ N(0, 1). σ inconnu : T0 = (x̄ − µ0)/(S/√n) ~ t(n − 1), S avec n − 1.', 'Z0 wla T0.', 'σ known → Z0; unknown → T0 ~ t(n − 1).']),
    L(['Bilatéral : |stat| > valeur à α/2 (1,96 à 5 %). Unilatéral : stat < −zα ou stat > zα (1,645 à 5 %), sans valeur absolue.', 'Bilatéral α/2, unilatéral α.', 'Two-sided at α/2, one-sided at α, no absolute value.']),
    L(['P-value : rejeter H0 si α > PV ; bilatéral PV = 2(1 − Φ(|z0|)), gauche Φ(z0), droite 1 − Φ(z0).', 'Rejet ila α > PV.', 'Reject if α > PV.']),
    L(['χ² d\'ajustement : Ei = n·pi, χ² = Σ(Oi − Ei)²/Ei, ν = k − p − 1, rejet si χ² > χ²α;ν ; regrouper les classes si Ei petits.', 'χ² : ν = k − p − 1.', 'χ² fit: ν = k − p − 1, reject if large.']),
    L(['Résultats du cours : fusée Z0 = 3,125 → rejet (PV ≈ 0,0018) ; comprimés T0 ≈ 0,148 < 2,821 → non-rejet ; glycémie Z0 = 3,6 (gauche) → non-rejet ; χ² ≈ 13,74 > 3,841 → pas normale.', 'Natayij dyal amthila.', 'Course results: rocket reject; tablets keep; blood sugar keep; χ² not normal.'])
  ]
};
