import { L, h, p, def, key, copy, formula, tip, trap, exam, table, anim, quiz } from '../../lib';
import type { Chapter } from '../../../src/lib/schema';

/**
 * Chap 5 — Tests d'hypothèses (Pr. A. Kadiri, 2 novembre 2026).
 * Written for the written test (not a quiz): choose the test, write the copy line by line, read the tables.
 * Every number is the one of the course examples, recomputed by src/lib/stats in the exercises' checks.
 */
export const chapter: Chapter = {
  id: 'tests',
  module: 'data',
  order: 6,
  title: L(['Chap 5 — Tests d\'hypothèses', 'Fasl 5 — Tests d\'hypothèses', 'Ch. 5 — Hypothesis testing']),
  summary: L([
    'Choisir le bon test, le rédiger en 7 lignes, lire les tables (normale, Student, χ²). Les 4 exemples du cours corrigés comme sur une copie.',
    'Kifach tkhtar test, tktbou f 7 stour, w t9ra tables (normale, Student, χ²). 4 amthila dyal lprof m7loulin b7al f copie.',
    'Pick the right test, write it in 7 lines, read the tables (normal, Student, χ²). The 4 course examples solved as on a test paper.'
  ]),
  estimatedMinutes: 45,
  sections: [
    key([
      '1. Un test répond à une question : **l\'écart observé est-il dû au hasard ?**\n2. **H0** contient toujours **=** ; **H1** donne le type : ≠ bilatéral, < gauche, > droite.\n3. **Trois lois** : σ connu → **Z ~ N(0, 1)** ; σ inconnu → **T ~ Student(n − 1)** ; forme d\'une loi → **χ²(k − p − 1)**.\n4. **Décision** : la statistique tombe dans la région critique → **on rejette H0**. Sinon → on ne rejette pas.\n5. Au contrôle, on rédige **toujours les mêmes 7 lignes** (section 3).',
      '1. Test kayjaweb 3la sou2al wa7ed : **wach l far9 li chefna ja b sodfa ?**\n2. **H0** dima fiha **=** ; **H1** kat3tik naw3 : ≠ bilatéral, < gauche, > droite.\n3. **Tlata lois** : σ m3rouf → **Z ~ N(0, 1)** ; σ ma m3roufch → **T ~ Student(n − 1)** ; chkl dyal loi → **χ²(k − p − 1)**.\n4. **Qarar** : ila statistique tla3t f région critique → **nrfdou H0**. Sinon → ma nrfdouch.\n5. F contrôle, katkteb **dima nefs 7 stour** (partie 3).',
      '1. A test answers one question: **is the observed gap due to chance?**\n2. **H0** always holds **=**; **H1** gives the type: ≠ two-sided, < left, > right.\n3. **Three laws**: σ known → **Z ~ N(0, 1)**; σ unknown → **T ~ Student(n − 1)**; shape of a law → **χ²(k − p − 1)**.\n4. **Decision**: the statistic falls in the critical region → **reject H0**. Otherwise → do not reject.\n5. In the test, always write **the same 7 lines** (section 3).'
    ]),

    // ------------------------------------------------------------------
    h(['1. Le principe', '1. Lfikra', '1. The idea']),
    def([
      'Un **test d\'hypothèse** vérifie, à partir d\'un échantillon, une affirmation sur une population : **la valeur d\'un paramètre** (moyenne, variance…), **l\'égalité de deux paramètres**, ou **la forme d\'une loi**. Les deux premiers cas sont **paramétriques**, le troisième **non paramétrique**.',
      '**Test d\'hypothèse** kayt2akked, b échantillon, mn idd3a2 3la population : **qimat paramètre** (moyenne, variance…), **tasawi jouj paramètres**, wla **chkl dyal loi**. Lwlin **paramétriques**, talt **non paramétrique**.',
      'A **hypothesis test** checks, from a sample, a claim about a population: **the value of a parameter** (mean, variance…), **the equality of two parameters**, or **the shape of a law**. The first two are **parametric**, the third **non-parametric**.'
    ]),
    p([
      '**Exemple 1 du cours (fusée).** Le cahier des charges impose une vitesse moyenne de **40 cm/s**, σ = 2. Sur n = 25 essais, x̄ = **41,25**. Un échantillon ne tombe jamais pile sur 40 : le test dit si l\'écart de 1,25 est **trop grand pour être le hasard**.',
      '**Mithal 1 (fusée).** Cahier des charges kaytleb vitesse moyenne **40 cm/s**, σ = 2. F n = 25 tajriba, x̄ = **41,25**. Échantillon 3omro ma ytla3 40 bdbt : test kay9ol lik wach far9 1,25 **kbir bzaf bach ykoun sodfa**.',
      '**Course example 1 (rocket).** The specification requires a mean speed of **40 cm/s**, σ = 2. Over n = 25 trials, x̄ = **41.25**. A sample never lands exactly on 40: the test says whether the 1.25 gap is **too big to be chance**.'
    ]),
    table([['Hypothèse', 'Hypothèse', 'Hypothesis'], ['Écriture', 'Ktaba', 'Written'], ['Type de test', 'Naw3 test', 'Test type']], [
      [['**H0** (nulle)', '**H0** (nulle)', '**H0** (null)'], 'µ = µ0', ['Toujours avec **=**', 'Dima b **=**', 'Always with **=**']],
      [['**H1** (alternative)', '**H1**', '**H1** (alternative)'], 'µ ≠ µ0', ['**Bilatéral**', '**Bilatéral**', '**Two-sided**']],
      [['**H1**', '**H1**', '**H1**'], 'µ < µ0', ['**Unilatéral à gauche**', '**Unilatéral gauche**', '**Left-tailed**']],
      [['**H1**', '**H1**', '**H1**'], 'µ > µ0', ['**Unilatéral à droite**', '**Unilatéral droite**', '**Right-tailed**']]
    ]),
    p([
      '**Région critique** : la zone où la statistique a **peu de chances** de tomber si H0 est vraie. Dedans → **rejet de H0, conclusion forte**. Dehors → **non-rejet, conclusion faible** (on n\'a pas prouvé H0, on manque seulement de preuves contre elle).',
      '**Région critique** : zone li **sa3ib** tti7 fiha statistique ila H0 s7i7a. Ila tla3t fiha → **rfed H0, conclusion 9wiya**. Ila la → **ma nrfdouch, conclusion d3ifa** (ma bayannach H0, ghir ma3ndnach dalil dedha).',
      '**Critical region**: where the statistic is **unlikely** to fall if H0 is true. Inside → **reject H0, strong conclusion**. Outside → **do not reject, weak conclusion** (H0 is not proven, we just lack evidence against it).'
    ]),
    quiz('dt-01', 'dt-02'),

    // ------------------------------------------------------------------
    h(['2. Choisir le bon test', '2. Kifach tkhtar test', '2. Choosing the right test']),
    p([
      'Deux questions suffisent. **(a) Que veut-on tester ?** une moyenne ou la forme d\'une loi. **(b) Que donne l\'énoncé ?** σ (population) ou seulement les données / S.',
      'Jouj as2ila kafyin. **(a) Chno bghina ntestiw ?** moyenne wla chkl dyal loi. **(b) Chno 3tana l énoncé ?** σ (dyal population) wla ghir data / S.',
      'Two questions are enough. **(a) What is tested?** a mean or the shape of a law. **(b) What does the statement give?** σ (population) or only the data / S.'
    ]),
    table([['Situation', 'L7ala', 'Situation'], ['Statistique', 'Statistique', 'Statistic'], ['Loi sous H0', 'Loi ila H0 s7i7a', 'Law under H0'], ['Table à lire', 'Table', 'Table to read']], [
      [['Moyenne, **σ connu**', 'Moyenne, **σ m3rouf**', 'Mean, **σ known**'], 'Z0 = (x̄ − µ0) / (σ/√n)', 'N(0, 1)', ['Normale : zα ou zα/2', 'Normale : zα wla zα/2', 'Normal: zα or zα/2']],
      [['Moyenne, **σ inconnu**', 'Moyenne, **σ ma m3roufch**', 'Mean, **σ unknown**'], 'T0 = (x̄ − µ0) / (S/√n)', 'Student, ν = n − 1', ['Student : tα;n−1', 'Student : tα;n−1', 'Student: tα;n−1']],
      [['**Forme d\'une loi** (ajustement)', '**Chkl dyal loi**', '**Shape of a law** (fit)'], 'χ²0 = Σ (Oi − Ei)² / Ei', 'χ², ν = k − p − 1', ['Khi-deux : χ²α;ν', 'Khi-deux : χ²α;ν', 'Chi-square: χ²α;ν']]
    ]),
    p([
      '**Trouver H1 dans l\'énoncé** : ce sont les mots de la question qui décident.',
      '**Kifach tl9a H1 f l énoncé** : lklimat dyal sou2al homa li kay9arrou.',
      '**Finding H1 in the statement**: the words of the question decide.'
    ]),
    table([['L\'énoncé dit…', 'L énoncé kay9ol…', 'The statement says…'], ['H1', 'H1', 'H1'], ['Rejet si', 'Rfed ila', 'Reject if']], [
      [['« différent », « déréglée », « conforme ? », « la moyenne est-elle de… ? »', '« différent », « déréglée », « conforme ? »', '"different", "out of adjustment", "is the mean…?"'], 'µ ≠ µ0', '|Z0| > zα/2'],
      [['« inférieur », « baisse », « diminue », « moins de »', '« inférieur », « baisse », « na9es »', '"lower", "decrease", "less than"'], 'µ < µ0', 'Z0 < −zα'],
      [['« supérieur », « dépasse », « augmente », « plus de »', '« supérieur », « dépasse », « zayd »', '"higher", "exceeds", "increase", "more than"'], 'µ > µ0', 'Z0 > zα']
    ]),
    tip([
      '**« Seuil de confiance 98 % »** veut dire **α = 2 %**. En bilatéral on lit la table à **α/2 = 1 %**, en unilatéral à **α**.',
      '**« Seuil de confiance 98 % »** ya3ni **α = 2 %**. F bilatéral kan9raw table b **α/2 = 1 %**, f unilatéral b **α**.',
      '**"98 % confidence level"** means **α = 2 %**. Two-sided: read the table at **α/2 = 1 %**; one-sided: at **α**.'
    ]),

    // ------------------------------------------------------------------
    h(['3. La méthode de rédaction (7 lignes)', '3. Tari9a d ktaba (7 stour)', '3. How to write it up (7 lines)']),
    p([
      'C\'est ce que le correcteur cherche, dans cet ordre. Chaque ligne rapporte des points : même si un calcul est faux, une copie bien structurée garde les points de méthode.',
      'Hada howa li kaychouf l correcteur, b had tartib. Kol str fih no9at : wakha l 7sab ykoun ghalat, copie mnadma kat7afed 3la no9at dyal méthode.',
      'This is what the grader looks for, in this order. Each line earns points: even with a wrong calculation, a well-structured copy keeps the method points.'
    ]),
    copy(['Le modèle à recopier', 'Lmodèle li tkteb', 'The template'], null, [
      { l: ['Données', 'Data', 'Data'], b: ['On relève µ0, n, x̄, σ (ou S), α. On note si σ est **connu**.', 'Kteb µ0, n, x̄, σ (wla S), α. Goul wach σ **m3rouf**.', 'List µ0, n, x̄, σ (or S), α. State whether σ is **known**.'] },
      { l: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['H0 : µ = µ0 contre H1 : µ ≠ µ0 (ou < / >). On précise **bilatéral / unilatéral**.', 'H0 : µ = µ0 contre H1 : µ ≠ µ0 (wla < / >). Goul **bilatéral / unilatéral**.', 'H0: µ = µ0 vs H1: µ ≠ µ0 (or < / >). State **two- / one-sided**.'] },
      { l: ['Statistique et loi', 'Statistique w loi', 'Statistic and law'], b: ['On écrit la formule **et sa loi sous H0** (« sous H0, Z0 suit N(0, 1) »).', 'Kteb formule **w loi dyalha ila H0 s7i7a** (« sous H0, Z0 ~ N(0, 1) »).', 'Write the formula **and its law under H0** ("under H0, Z0 ~ N(0, 1)").'] },
      { l: ['Calcul', '7sab', 'Computation'], b: ['On remplace et on calcule, avec les étapes intermédiaires (σ/√n d\'abord).', 'Bddel b l qiyam w 7seb, m3a étapes (σ/√n lwla).', 'Substitute and compute, with intermediate steps (σ/√n first).'] },
      { l: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['On lit la table (α/2 ou α, et ν) et on écrit la **région critique**.', '9ra table (α/2 wla α, w ν) w kteb **région critique**.', 'Read the table (α/2 or α, and ν) and write the **critical region**.'] },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['On compare : « |Z0| = … > … donc on rejette H0 » ou « … ≤ … donc on ne rejette pas H0 ».', '9aren : « |Z0| = … > … donc nrfdou H0 » wla « … ≤ … donc ma nrfdouch ».', 'Compare: "|Z0| = … > … so reject H0" or "… ≤ … so do not reject H0".'] },
      { l: ['Conclusion', 'Conclusion', 'Conclusion'], b: ['Une phrase **dans le contexte**, avec le risque : « Au risque 5 %, la machine est déréglée. »', 'Jomla **f l contexte** m3a risque : « Au risque 5 %, la machine est déréglée. »', 'One sentence **in context**, with the level: "At the 5 % level, the machine is out of adjustment."'] }
    ]),
    exam([
      'Ne jamais finir sur « on rejette H0 » seul : la **phrase de conclusion dans le contexte** est notée à part.',
      'Matsalich 3la « on rejette H0 » bou7dha : **jomla dyal conclusion f l contexte** 3ndha no9at bou7dha.',
      'Never stop at "reject H0": the **concluding sentence in context** is graded separately.'
    ]),
    quiz('dt-06'),

    // ------------------------------------------------------------------
    h(['4. Les lois et leurs tables', '4. Les lois w tables dyalhom', '4. The laws and their tables']),
    formula('Z = \\frac{\\bar X - \\mu_0}{\\sigma/\\sqrt n} \\sim \\mathcal N(0,1) \\qquad T = \\frac{\\bar X - \\mu_0}{S/\\sqrt n} \\sim t_{n-1} \\qquad S = \\sqrt{\\frac{1}{n-1}\\sum (x_i-\\bar x)^2}', [
      'S se calcule avec **n − 1** (écart-type corrigé). Quand σ est inconnu, on le remplace par S et la loi normale par Student.',
      'S kat7seb b **n − 1** (écart-type corrigé). Mli σ ma m3roufch, kanbeddlouh b S w normale b Student.',
      'S uses **n − 1** (corrected SD). When σ is unknown, replace it with S and the normal law with Student.'
    ]),
    p([
      '**Loi normale N(0, 1).** zα est la valeur telle que **P(Z > zα) = α**. Symétrie : Φ(−z) = 1 − Φ(z).',
      '**Loi normale N(0, 1).** zα hiya l qima li **P(Z > zα) = α**. Tamatoul : Φ(−z) = 1 − Φ(z).',
      '**Normal N(0, 1).** zα is the value with **P(Z > zα) = α**. Symmetry: Φ(−z) = 1 − Φ(z).'
    ]),
    table([['Risque α', 'Risque α', 'Level α'], ['Bilatéral (zα/2)', 'Bilatéral (zα/2)', 'Two-sided (zα/2)'], ['Unilatéral (zα)', 'Unilatéral (zα)', 'One-sided (zα)']], [
      ['10 %', '1,645', '1,282'],
      ['5 %', '**1,960**', '**1,645**'],
      ['2 %', '2,326', '2,054'],
      ['1 %', '**2,576**', '2,326']
    ]),
    p([
      '**Loi de Student t(ν).** Même cloche que N(0, 1) mais **queues plus épaisses** (σ est estimé) ; elle tend vers N(0, 1) quand ν grandit. On lit la ligne **ν = n − 1**.',
      '**Student t(ν).** Nefs cloche dyal N(0, 1) walakin **jwaneb atkhan** (σ m9addra) ; katwli N(0, 1) mli ν kbir. Kan9raw str **ν = n − 1**.',
      '**Student t(ν).** Same bell as N(0, 1) with **heavier tails** (σ is estimated); tends to N(0, 1) as ν grows. Read row **ν = n − 1**.'
    ]),
    table([['ν = n − 1', 'ν = n − 1', 'ν = n − 1'], ['t0,05', 't0,05', 't0.05'], ['t0,025', 't0,025', 't0.025'], ['t0,01', 't0,01', 't0.01'], ['t0,005', 't0,005', 't0.005']], [
      ['7', '1,895', '2,365', '2,998', '3,499'],
      ['8', '1,860', '2,306', '2,896', '3,355'],
      ['9', '1,833', '2,262', '**2,821**', '3,250'],
      ['15', '1,753', '2,131', '2,602', '2,947'],
      ['24', '1,711', '2,064', '2,492', '2,797'],
      ['∞', '1,645', '1,960', '2,326', '2,576']
    ]),
    p([
      '**Loi du Khi-deux χ²(ν).** Toujours **positive** et asymétrique. Le test d\'ajustement rejette quand χ² est **grand** : il est toujours **unilatéral à droite**, on lit la colonne **α** (pas α/2).',
      '**Khi-deux χ²(ν).** Dima **mojaba** w machi mtamatla. Test d\'ajustement kayrfed mli χ² **kbir** : dima **unilatéral droite**, kan9raw colonne **α** (machi α/2).',
      '**Chi-square χ²(ν).** Always **positive** and skewed. The fit test rejects when χ² is **large**: always **right-tailed**, read column **α** (not α/2).'
    ]),
    table([['ν', 'ν', 'ν'], ['χ²0,05', 'χ²0,05', 'χ²0.05'], ['χ²0,01', 'χ²0,01', 'χ²0.01']], [
      ['1', '**3,841**', '6,635'],
      ['2', '5,991', '9,210'],
      ['3', '7,815', '11,345'],
      ['4', '9,488', '13,277'],
      ['5', '11,070', '15,086']
    ]),
    tip([
      'Les tables sont fournies au contrôle. Ce qui est noté, c\'est **la bonne case** : bilatéral → **α/2** ; unilatéral → **α** ; Student → **ν = n − 1** ; χ² → **ν = k − p − 1**.',
      'Tables kayn3tawk f contrôle. Li m7soub howa **lkhana s7i7a** : bilatéral → **α/2** ; unilatéral → **α** ; Student → **ν = n − 1** ; χ² → **ν = k − p − 1**.',
      'Tables are provided in the test. What is graded is **the right cell**: two-sided → **α/2**; one-sided → **α**; Student → **ν = n − 1**; χ² → **ν = k − p − 1**.'
    ]),

    // ------------------------------------------------------------------
    h(['5. Exemple 1 — σ connu, bilatéral (fusée)', '5. Mithal 1 — σ m3rouf, bilatéral (fusée)', '5. Example 1 — σ known, two-sided (rocket)']),
    formula('Z_0 = \\frac{\\bar X - \\mu_0}{\\sigma/\\sqrt n} \\qquad \\text{rejeter } H_0 \\text{ si } |Z_0| > z_{\\alpha/2}', [
      'Test bilatéral sur une moyenne, σ connu.',
      'Test bilatéral 3la moyenne, σ m3rouf.',
      'Two-sided test on a mean, σ known.'
    ]),
    copy(['Fusée — α = 5 %', 'Fusée — α = 5 %', 'Rocket — α = 5 %'], [
      'Vitesse moyenne exigée 40 cm/s, σ = 2 cm/s. Sur n = 25 essais, x̄ = 41,25 cm/s. Le carburant respecte-t-il le cahier des charges ?',
      'Vitesse moyenne lmatlouba 40 cm/s, σ = 2. F n = 25 tajriba, x̄ = 41,25. Wach carburant m7tarem cahier des charges ?',
      'Required mean speed 40 cm/s, σ = 2 cm/s. Over n = 25 trials, x̄ = 41.25 cm/s. Does the fuel meet the specification?'
    ], [
      { l: ['Données', 'Data', 'Data'], b: ['µ0 = 40 ; σ = 2 (**connu**) ; n = 25 ; x̄ = 41,25 ; α = 0,05.', 'µ0 = 40 ; σ = 2 (**m3rouf**) ; n = 25 ; x̄ = 41,25 ; α = 0,05.', 'µ0 = 40; σ = 2 (**known**); n = 25; x̄ = 41.25; α = 0.05.'] },
      { l: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['H0 : µ = 40 contre H1 : µ ≠ 40 → **bilatéral** (« respecte-t-il » : un écart dans les deux sens compte).', 'H0 : µ = 40 contre H1 : µ ≠ 40 → **bilatéral** (far9 f jouj jihat kaybedel).', 'H0: µ = 40 vs H1: µ ≠ 40 → **two-sided** (a gap either way matters).'] },
      { l: ['Statistique et loi', 'Statistique w loi', 'Statistic and law'], b: ['σ connu → Z0 = (x̄ − µ0)/(σ/√n) ; **sous H0, Z0 ~ N(0, 1)**.', 'σ m3rouf → Z0 ; **sous H0, Z0 ~ N(0, 1)**.', 'σ known → Z0; **under H0, Z0 ~ N(0, 1)**.'] },
      { l: ['Calcul', '7sab', 'Computation'], b: ['σ/√n = 2/5 = 0,4.', 'σ/√n = 2/5 = 0,4.', 'σ/√n = 2/5 = 0.4.'], tex: 'Z_0 = \\frac{41{,}25 - 40}{0{,}4} = \\frac{1{,}25}{0{,}4} = 3{,}125' },
      { l: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['Bilatéral, α/2 = 0,025 → **z0,025 = 1,96**. Région critique : |Z0| > 1,96.', 'α/2 = 0,025 → **1,96**. Région critique : |Z0| > 1,96.', 'α/2 = 0.025 → **1.96**. Critical region: |Z0| > 1.96.'] },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['|Z0| = 3,125 > 1,96 → **on rejette H0** (conclusion forte).', '3,125 > 1,96 → **nrfdou H0** (conclusion 9wiya).', '3.125 > 1.96 → **reject H0** (strong conclusion).'] }
    ], [
      'au risque 5 %, la vitesse moyenne **n\'est pas** 40 cm/s : le carburant ne respecte pas le cahier des charges.',
      'b risque 5 %, l vitesse moyenne **machi** 40 cm/s : carburant ma m7tarmch cahier des charges.',
      'at the 5 % level, the mean speed **is not** 40 cm/s: the fuel does not meet the specification.'
    ]),
    anim('HypothesisTestVisualizer', { preset: 'fusee' }),

    // ------------------------------------------------------------------
    h(['6. Exemple 2 — σ inconnu (Student)', '6. Mithal 2 — σ ma m3roufch (Student)', '6. Example 2 — σ unknown (Student)']),
    formula('T_0 = \\frac{\\bar X - \\mu_0}{S/\\sqrt n} \\qquad \\text{rejeter } H_0 \\text{ si } |T_0| > t_{\\alpha/2;\\,n-1}', [
      'Même méthode, avec S à la place de σ et la table de Student à n − 1 ddl.',
      'Nefs tari9a, b S f blast σ w table Student b n − 1 ddl.',
      'Same method, with S instead of σ and the Student table with n − 1 df.'
    ]),
    copy(['Comprimés — seuil de confiance 98 %', 'Comprimés — seuil 98 %', 'Tablets — 98 % level'], [
      'Poids (g) de 10 comprimés : 0,81 ; 0,84 ; 0,83 ; 0,80 ; 0,85 ; 0,86 ; 0,85 ; 0,83 ; 0,84 ; 0,80. Le poids moyen annoncé est 0,83 g. Est-il crédible ?',
      'Poids (g) dyal 10 comprimés : 0,81 ; 0,84 ; 0,83 ; 0,80 ; 0,85 ; 0,86 ; 0,85 ; 0,83 ; 0,84 ; 0,80. Poids moyen m3lan 0,83 g. Wach m39oul ?',
      'Weights (g) of 10 tablets: 0.81; 0.84; 0.83; 0.80; 0.85; 0.86; 0.85; 0.83; 0.84; 0.80. Announced mean weight 0.83 g. Is it credible?'
    ], [
      { l: ['Données', 'Data', 'Data'], b: ['µ0 = 0,83 ; n = 10 ; σ **non donné** → Student ; 98 % → **α = 0,02**.', 'µ0 = 0,83 ; n = 10 ; σ **ma m3tich** → Student ; 98 % → **α = 0,02**.', 'µ0 = 0.83; n = 10; σ **not given** → Student; 98 % → **α = 0.02**.'] },
      { l: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['H0 : µ = 0,83 contre H1 : µ ≠ 0,83 → **bilatéral**.', 'H0 : µ = 0,83 contre H1 : µ ≠ 0,83 → **bilatéral**.', 'H0: µ = 0.83 vs H1: µ ≠ 0.83 → **two-sided**.'] },
      { l: ['Moyenne et S', 'Moyenne w S', 'Mean and S'], b: ['Σxi = 8,31 → x̄ = **0,831**. Σ(xi − x̄)² = 0,00409.', 'Σxi = 8,31 → x̄ = **0,831**. Σ(xi − x̄)² = 0,00409.', 'Σxi = 8.31 → x̄ = **0.831**. Σ(xi − x̄)² = 0.00409.'], tex: 'S = \\sqrt{\\frac{0{,}00409}{10-1}} \\approx 0{,}0213' },
      { l: ['Statistique et loi', 'Statistique w loi', 'Statistic and law'], b: ['**Sous H0, T0 ~ t(9)**.', '**Sous H0, T0 ~ t(9)**.', '**Under H0, T0 ~ t(9)**.'], tex: 'T_0 = \\frac{0{,}831 - 0{,}83}{0{,}0213/\\sqrt{10}} = \\frac{0{,}001}{0{,}00674} \\approx 0{,}148' },
      { l: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['α/2 = 0,01 et ν = 9 → **t0,01;9 = 2,821**. Région critique : |T0| > 2,821.', 'α/2 = 0,01, ν = 9 → **2,821**. Région critique : |T0| > 2,821.', 'α/2 = 0.01, ν = 9 → **2.821**. Critical region: |T0| > 2.821.'] },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['|T0| = 0,148 ≤ 2,821 → **on ne rejette pas H0** (conclusion faible).', '0,148 ≤ 2,821 → **ma nrfdouch H0** (conclusion d3ifa).', '0.148 ≤ 2.821 → **do not reject H0** (weak conclusion).'] }
    ], [
      'au seuil 98 %, le poids moyen est **compatible** avec 0,83 g : l\'annonce est crédible.',
      'b seuil 98 %, poids moyen **compatible** m3a 0,83 g : l i3lan m39oul.',
      'at the 98 % level, the mean weight is **compatible** with 0.83 g: the claim is credible.'
    ]),
    trap([
      'Les trois erreurs classiques : **α au lieu de α/2** en bilatéral ; **ν = n = 10** au lieu de 9 ; **S calculé avec n** au lieu de n − 1.',
      'Tlata dyal lfkhakh : **α f blast α/2** f bilatéral ; **ν = n = 10** f blast 9 ; **S b n** f blast n − 1.',
      'The three classic mistakes: **α instead of α/2** in two-sided; **ν = n = 10** instead of 9; **S computed with n** instead of n − 1.'
    ]),

    // ------------------------------------------------------------------
    h(['7. Exemple 3 — test unilatéral (glycémie)', '7. Mithal 3 — unilatéral (glycémie)', '7. Example 3 — one-sided test (blood sugar)']),
    table([['Cas', '7ala', 'Case'], ['Gauche, H1 : µ < µ0', 'Gauche, H1 : µ < µ0', 'Left, H1: µ < µ0'], ['Droite, H1 : µ > µ0', 'Droite, H1 : µ > µ0', 'Right, H1: µ > µ0']], [
      [['σ connu', 'σ m3rouf', 'σ known'], 'Z0 < −zα', 'Z0 > zα'],
      [['σ inconnu', 'σ ma m3roufch', 'σ unknown'], 'T0 < −tα;n−1', 'T0 > tα;n−1']
    ]),
    p([
      'Même statistique ; seule la région critique change : **tout α d\'un seul côté**, et **le signe compte** (pas de valeur absolue).',
      'Nefs statistique ; ghir région critique katbeddel : **α kamla f jiha wa7da**, w **signe mohim** (bla valeur absolue).',
      'Same statistic; only the critical region changes: **all of α on one side**, and **the sign matters** (no absolute value).'
    ]),
    copy(['Glycémie — α = 5 %', 'Glycémie — α = 5 %', 'Blood sugar — α = 5 %'], [
      'Dans la population, µ0 = 1 g/L et σ = 0,1 g/L. 9 patients soupçonnés d\'**hypoglycémie** ont x̄ = 1,12 g/L. Leur glycémie moyenne est-elle inférieure à la normale ?',
      'F population, µ0 = 1 g/L w σ = 0,1. 9 patients mchkouk fihom **hypoglycémie** 3ndhom x̄ = 1,12. Wach glycémie dyalhom na9sa 3la normale ?',
      'In the population µ0 = 1 g/L and σ = 0.1 g/L. 9 patients suspected of **hypoglycaemia** have x̄ = 1.12 g/L. Is their mean below normal?'
    ], [
      { l: ['Données', 'Data', 'Data'], b: ['µ0 = 1 ; σ = 0,1 (**connu**) ; n = 9 ; x̄ = 1,12 ; α = 0,05.', 'µ0 = 1 ; σ = 0,1 (**m3rouf**) ; n = 9 ; x̄ = 1,12 ; α = 0,05.', 'µ0 = 1; σ = 0.1 (**known**); n = 9; x̄ = 1.12; α = 0.05.'] },
      { l: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['« inférieure » → H0 : µ = 1 contre **H1 : µ < 1** → **unilatéral à gauche**.', '« inférieure » → H0 : µ = 1 contre **H1 : µ < 1** → **gauche**.', '"below" → H0: µ = 1 vs **H1: µ < 1** → **left-tailed**.'] },
      { l: ['Statistique et loi', 'Statistique w loi', 'Statistic and law'], b: ['**Sous H0, Z0 ~ N(0, 1)**. σ/√n = 0,1/3 ≈ 0,0333.', '**Sous H0, Z0 ~ N(0, 1)**. σ/√n = 0,1/3.', '**Under H0, Z0 ~ N(0, 1)**. σ/√n = 0.1/3.'], tex: 'Z_0 = \\frac{1{,}12 - 1}{0{,}1/3} = 3{,}6' },
      { l: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['Gauche, α = 0,05 → z0,05 = 1,645. Région critique : **Z0 < −1,645**.', 'Gauche → 1,645. Région critique : **Z0 < −1,645**.', 'Left, α = 0.05 → 1.645. Critical region: **Z0 < −1.645**.'] },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['Z0 = **+3,6** n\'est pas < −1,645 → **on ne rejette pas H0**.', 'Z0 = **+3,6** machi < −1,645 → **ma nrfdouch H0**.', 'Z0 = **+3.6** is not < −1.645 → **do not reject H0**.'] }
    ], [
      'au risque 5 %, rien n\'indique une hypoglycémie : la moyenne des patients est même au-dessus de 1 g/L.',
      'b risque 5 %, ma kayn 7ta dalil 3la hypoglycémie : moyenne dyal patients 7ta hiya fo9 1 g/L.',
      'at the 5 % level there is no sign of hypoglycaemia: the patients\' mean is even above 1 g/L.'
    ]),
    trap([
      '|3,6| > 1,645 donne envie de rejeter. Faux : en unilatéral **pas de valeur absolue**. Z0 va dans le sens **opposé** à H1, donc H0 reste.',
      '|3,6| > 1,645 kaykhllik tbghi trfed. Ghalat : f unilatéral **bla valeur absolue**. Z0 mchat f jiha **mo3akisa** l H1, donc H0 kat b9a.',
      '|3.6| > 1.645 tempts you to reject. Wrong: one-sided means **no absolute value**. Z0 goes **against** H1, so H0 stays.'
    ]),
    quiz('dt-07', 'dt-08', 'dt-12', 'dt-16'),

    // ------------------------------------------------------------------
    h(['8. La P-value', '8. La P-value', '8. The P-value']),
    def([
      'La **P-value (PV)** est le **plus petit α** pour lequel on rejette H0. Règle : **α > PV → rejet de H0** ; PV grande → on garde H0.',
      '**P-value (PV)** hiya **a9al α** li kanrfdou fih H0. Lqa3ida : **α > PV → rfed H0** ; PV kbira → nkhalliw H0.',
      'The **P-value (PV)** is the **smallest α** at which H0 is rejected. Rule: **α > PV → reject H0**; large PV → keep H0.'
    ]),
    table([['Test', 'Test', 'Test'], ['σ connu', 'σ m3rouf', 'σ known'], ['σ inconnu', 'σ ma m3roufch', 'σ unknown']], [
      [['Bilatéral', 'Bilatéral', 'Two-sided'], 'PV = 2(1 − Φ(|z0|))', 'PV = 2 P(T > |t0|)'],
      [['Gauche', 'Gauche', 'Left'], 'PV = Φ(z0)', 'PV = P(T < t0)'],
      [['Droite', 'Droite', 'Right'], 'PV = 1 − Φ(z0)', 'PV = P(T > t0)']
    ]),
    copy(['P-value de la fusée', 'P-value dyal fusée', 'Rocket P-value'], null, [
      { l: ['Formule', 'Formule', 'Formula'], b: ['Bilatéral, σ connu → PV = 2(1 − Φ(|z0|)) avec z0 = 3,125.', 'Bilatéral, σ m3rouf → PV = 2(1 − Φ(|z0|)), z0 = 3,125.', 'Two-sided, σ known → PV = 2(1 − Φ(|z0|)), z0 = 3.125.'] },
      { l: ['Calcul', '7sab', 'Computation'], b: ['Φ(3,125) ≈ 0,99911.', 'Φ(3,125) ≈ 0,99911.', 'Φ(3.125) ≈ 0.99911.'], tex: 'PV = 2\\,(1 - 0{,}99911) \\approx 0{,}0018' },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['α = 0,05 > 0,0018 → **rejet de H0**, même décision qu\'avec la région critique (on rejetterait même à 1 %).', '0,05 > 0,0018 → **rfed H0**, nefs qarar (7ta b 1 % nrfdou).', '0.05 > 0.0018 → **reject H0**, same decision (even at 1 %).'] }
    ]),
    p([
      'Les autres exemples : glycémie (gauche) PV = Φ(3,6) ≈ **0,9998** → on garde H0 ; comprimés PV = 2P(T > 0,148) ≈ **0,885** → on garde H0.',
      'Lmthila lokhrin : glycémie (gauche) PV = Φ(3,6) ≈ **0,9998** → nkhalliw H0 ; comprimés PV ≈ **0,885** → nkhalliw H0.',
      'The other examples: blood sugar (left) PV = Φ(3.6) ≈ **0.9998** → keep H0; tablets PV ≈ **0.885** → keep H0.'
    ]),
    quiz('dt-09', 'dt-23'),

    // ------------------------------------------------------------------
    h(['9. Le test d\'ajustement du χ²', '9. Test d\'ajustement dyal χ²', '9. The χ² goodness-of-fit test']),
    formula('E_i = n\\,p_i \\qquad \\chi^2_0 = \\sum_{i=1}^{k} \\frac{(O_i - E_i)^2}{E_i} \\qquad \\nu = k - p - 1 \\qquad \\text{rejeter } H_0 \\text{ si } \\chi^2_0 > \\chi^2_{\\alpha;\\nu}', [
      '**Oi** observés, **Ei** attendus si H0 est vraie, **k** classes, **p** paramètres estimés sur les données. Si un Ei < 5, on **regroupe** des classes voisines.',
      '**Oi** li chefna, **Ei** li kantssennaw ila H0 s7i7a, **k** classes, **p** paramètres m9addrin mn data. Ila chi Ei < 5, **jme3** classes 9rab.',
      '**Oi** observed, **Ei** expected under H0, **k** classes, **p** parameters estimated from the data. If some Ei < 5, **merge** neighbouring classes.'
    ]),
    copy(['Les données suivent-elles une loi normale ? (α = 5 %)', 'Wach data normale ? (α = 5 %)', 'Are the data normal? (α = 5 %)'], [
      'n = 50 valeurs en 4 classes [0 ; 0,5[, [0,5 ; 1[, [1 ; 1,5[, [1,5 ; ∞[ avec Oi = 2, 23, 17, 8. On a x̄ = 1,168 et S = 0,591.',
      'n = 50 qima f 4 classes [0 ; 0,5[, [0,5 ; 1[, [1 ; 1,5[, [1,5 ; ∞[ b Oi = 2, 23, 17, 8. x̄ = 1,168 w S = 0,591.',
      'n = 50 values in 4 classes [0; 0.5[, [0.5; 1[, [1; 1.5[, [1.5; ∞[ with Oi = 2, 23, 17, 8. x̄ = 1.168 and S = 0.591.'
    ], [
      { l: ['Hypothèses', 'Hypothèses', 'Hypotheses'], b: ['H0 : X suit une loi normale contre H1 : X ne suit pas une loi normale. µ et σ estimés par x̄ et S → **p = 2**.', 'H0 : X normale contre H1 : la. µ w σ m9addrin b x̄ w S → **p = 2**.', 'H0: X is normal vs H1: X is not normal. µ and σ estimated by x̄ and S → **p = 2**.'] },
      { l: ['Probabilités pi', 'Probabilités pi', 'Probabilities pi'], b: ['On centre-réduit chaque borne : z = (borne − 1,168)/0,591, puis on lit Φ. p1 = Φ(−1,130) ≈ 0,129 ; p2 = Φ(−0,284) − Φ(−1,130) ≈ 0,259 ; p3 = Φ(0,562) − Φ(−0,284) ≈ 0,325 ; p4 = 1 − Φ(0,562) ≈ 0,287.', 'Centrer-réduire kol borne : z = (borne − 1,168)/0,591, w 9ra Φ. p ≈ 0,129 ; 0,259 ; 0,325 ; 0,287.', 'Standardise each bound: z = (bound − 1.168)/0.591, then read Φ. p ≈ 0.129; 0.259; 0.325; 0.287.'] },
      { l: ['Effectifs Ei', 'Effectifs Ei', 'Counts Ei'], b: ['Ei = 50 pi ≈ **6,46 ; 12,95 ; 16,24 ; 14,36** (tous ≥ 5, pas de regroupement).', 'Ei = 50 pi ≈ **6,46 ; 12,95 ; 16,24 ; 14,36** (kolhom ≥ 5).', 'Ei = 50 pi ≈ **6.46; 12.95; 16.24; 14.36** (all ≥ 5).'] },
      { l: ['Calcul de χ²0', '7sab χ²0', 'Computing χ²0'], b: ['Contributions (Oi − Ei)²/Ei : 3,08 ; 7,81 ; 0,04 ; 2,81.', '(Oi − Ei)²/Ei : 3,08 ; 7,81 ; 0,04 ; 2,81.', '(Oi − Ei)²/Ei: 3.08; 7.81; 0.04; 2.81.'], tex: '\\chi^2_0 \\approx 3{,}08 + 7{,}81 + 0{,}04 + 2{,}81 = 13{,}74' },
      { l: ['Valeur critique', 'Valeur critique', 'Critical value'], b: ['ν = k − p − 1 = 4 − 2 − 1 = **1** → χ²0,05;1 = **3,841**.', 'ν = 4 − 2 − 1 = **1** → **3,841**.', 'ν = 4 − 2 − 1 = **1** → **3.841**.'] },
      { l: ['Décision', 'Qarar', 'Decision'], b: ['13,74 > 3,841 → **on rejette H0**. La classe [0,5 ; 1[ (23 observés pour 13 attendus) pèse le plus.', '13,74 > 3,841 → **nrfdou H0**. Classe [0,5 ; 1[ (23 f blast 13) hiya li tal3a bzaf.', '13.74 > 3.841 → **reject H0**. Class [0.5; 1[ (23 observed vs 13 expected) weighs the most.'] }
    ], [
      'au risque 5 %, les données **ne suivent pas** une loi normale.',
      'b risque 5 %, data **ma katb3ch** loi normale.',
      'at the 5 % level, the data **do not follow** a normal law.'
    ]),
    anim('ChiSquareBuilder'),
    quiz('dt-26', 'dt-27', 'dt-29'),

    // ------------------------------------------------------------------
    h(['10. Erreurs α, β et puissance', '10. Akhta2 α, β w puissance', '10. Errors α, β and power']),
    table([['Décision \\ Réalité', 'Qarar \\ Wa9i3', 'Decision \\ Reality'], ['H0 vraie', 'H0 s7i7a', 'H0 true'], ['H0 fausse', 'H0 ghalta', 'H0 false']], [
      [['On garde H0', 'Nkhalliw H0', 'Keep H0'], ['Bonne décision (1 − α)', 'Qarar s7i7 (1 − α)', 'Correct (1 − α)'], ['**Erreur de 2e espèce β**', '**Ghalat naw3 2 : β**', '**Type II error β**']],
      [['On rejette H0', 'Nrfdou H0', 'Reject H0'], ['**Erreur de 1re espèce α**', '**Ghalat naw3 1 : α**', '**Type I error α**'], ['Bonne décision : **puissance 1 − β**', 'Qarar s7i7 : **puissance 1 − β**', 'Correct: **power 1 − β**']]
    ]),
    formula('\\alpha = P(\\text{rejeter } H_0 \\mid H_0 \\text{ vraie}) \\qquad \\beta = P(\\text{garder } H_0 \\mid H_0 \\text{ fausse}) \\qquad \\text{puissance} = 1 - \\beta', [
      'α (seuil de signification) est **fixé à l\'avance**. Pour diminuer β sans toucher à α, on **augmente n**.',
      'α (seuil de signification) **kanfixiwh 9bel**. Bach tn9ess β bla matbeddel α, **zid n**.',
      'α (significance level) is **fixed in advance**. To lower β without changing α, **increase n**.'
    ]),
    p([
      '**Exemple du procès.** H0 : « innocent ». Condamner un innocent = **α** ; libérer un coupable = **β**. On veut d\'abord ne pas condamner d\'innocent, donc on fixe **α petit**. Le choix de H0 décide quelle erreur on contrôle.',
      '**Mithal lm7akama.** H0 : « bri2 ». T7kem 3la bri2 = **α** ; tkhlli moujrim = **β**. Lwla hiya ma n7kmouch 3la bri2, donc **α sghir**. Khtiyar H0 kay9arrer ina ghalat kancontroliw.',
      '**The trial example.** H0: "innocent". Convicting an innocent = **α**; freeing a guilty person = **β**. Not convicting an innocent comes first, so **α is small**. The choice of H0 decides which error is controlled.'
    ]),
    anim('ErrorTable'),
    quiz('dt-03', 'dt-04', 'dt-05'),

    // ------------------------------------------------------------------
    h(['11. Les pièges qui coûtent des points', '11. Lfkhakh li kaydiw no9at', '11. Mistakes that cost points']),
    table([['Erreur', 'Ghalat', 'Mistake'], ['Ce qu\'il faut faire', 'Chno khass', 'What to do']], [
      [['Lire zα en bilatéral', '9ra zα f bilatéral', 'Reading zα in two-sided'], ['Lire **zα/2** (1,96 à 5 %)', '9ra **zα/2** (1,96 f 5 %)', 'Read **zα/2** (1.96 at 5 %)']],
      [['Prendre |Z0| en unilatéral', '|Z0| f unilatéral', 'Using |Z0| one-sided'], ['Garder **le signe** de Z0', 'Khalli **signe** dyal Z0', 'Keep **the sign** of Z0']],
      [['Loi normale alors que σ est inconnu', 'Normale w σ ma m3roufch', 'Normal law with σ unknown'], ['**Student** à n − 1 ddl', '**Student** b n − 1 ddl', '**Student** with n − 1 df']],
      [['Oublier √n', 'Nsiti √n', 'Forgetting √n'], ['Calculer **σ/√n d\'abord**', '7seb **σ/√n lwla**', 'Compute **σ/√n first**']],
      [['ν = k − 1 au χ² avec paramètres estimés', 'ν = k − 1 f χ²', 'ν = k − 1 with estimated parameters'], ['**ν = k − p − 1**', '**ν = k − p − 1**', '**ν = k − p − 1**']],
      [['Écrire « on accepte H0, H0 est vraie »', '« H0 s7i7a »', 'Writing "H0 is true"'], ['« On ne rejette pas H0 » (conclusion faible)', '« On ne rejette pas H0 » (d3ifa)', '"We do not reject H0" (weak)']],
      [['Finir sans phrase de contexte', 'Bla jomla f contexte', 'No sentence in context'], ['« Au risque 5 %, … » avec les mots de l\'énoncé', '« Au risque 5 %, … » b klimat l énoncé', '"At the 5 % level, …" with the statement\'s words']]
    ])
  ],
  keyPoints: [
    L(['H0 contient « = » ; H1 : ≠ (bilatéral), < (gauche), > (droite) — ce sont les mots de l\'énoncé qui décident.', 'H0 fiha « = » ; H1 : ≠, <, > — klimat l énoncé homa li kay9arrou.', 'H0 has "="; H1: ≠, <, > — the statement\'s words decide.']),
    L(['σ connu : Z0 = (x̄ − µ0)/(σ/√n) ~ N(0, 1). σ inconnu : T0 = (x̄ − µ0)/(S/√n) ~ t(n − 1), S avec n − 1.', 'σ m3rouf : Z0 ~ N(0, 1). σ ma m3roufch : T0 ~ t(n − 1), S b n − 1.', 'σ known: Z0 ~ N(0, 1). σ unknown: T0 ~ t(n − 1), S with n − 1.']),
    L(['Bilatéral : |stat| > valeur à α/2 (1,96 à 5 %). Unilatéral : Z0 < −zα ou Z0 > zα (1,645 à 5 %), sans valeur absolue.', 'Bilatéral : α/2 (1,96). Unilatéral : α (1,645), bla valeur absolue.', 'Two-sided at α/2 (1.96); one-sided at α (1.645), no absolute value.']),
    L(['Rédaction en 7 lignes : données, hypothèses, statistique + loi, calcul, valeur critique, décision, conclusion dans le contexte.', '7 stour : data, hypothèses, statistique + loi, 7sab, valeur critique, qarar, conclusion f contexte.', '7 lines: data, hypotheses, statistic + law, computation, critical value, decision, conclusion in context.']),
    L(['P-value : rejet si α > PV ; bilatéral 2(1 − Φ(|z0|)), gauche Φ(z0), droite 1 − Φ(z0).', 'PV : rfed ila α > PV.', 'P-value: reject if α > PV.']),
    L(['χ² d\'ajustement : Ei = n·pi, χ² = Σ(Oi − Ei)²/Ei, ν = k − p − 1, rejet si χ² > χ²α;ν ; regrouper si Ei < 5.', 'χ² : Ei = n·pi, ν = k − p − 1, rfed ila kbir.', 'χ² fit: Ei = n·pi, ν = k − p − 1, reject if large.']),
    L(['Résultats du cours : fusée Z0 = 3,125 → rejet (PV ≈ 0,0018) ; comprimés T0 ≈ 0,148 → non-rejet ; glycémie Z0 = 3,6 (gauche) → non-rejet ; χ² ≈ 13,74 > 3,841 → pas normale.', 'Fusée rfed ; comprimés la ; glycémie la ; χ² machi normale.', 'Rocket reject; tablets keep; blood sugar keep; χ² not normal.'])
  ]
};
