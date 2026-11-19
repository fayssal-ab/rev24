import { L, h, p, def, example, plain, steps, tip, exam, table, anim, quiz } from '../../lib';
import type { Chapter } from '../../../src/lib/schema';

/** Chap 0 — Introduction à l'analyse de données (Pr. A. Kadiri, 4 octobre 2026). */
export const chapter: Chapter = {
  id: 'd-intro',
  module: 'data',
  order: 1,
  title: L(['Chap 0 — Introduction à l\'analyse de données', 'Fasl 0 — Mo9addima l analyse de données', 'Ch. 0 — Introduction to data analysis']),
  summary: L([
    'Ce qu\'est l\'analyse de données, ses 4 objectifs, les 5 types d\'analyse, les 5 étapes de la démarche, les outils, les domaines et le rôle dans la décision.',
    'Chnou hiya analyse de données, 4 ahdaf dyalha, 5 anwa3, 5 étapes, les outils, fin katsta3mel w kifach kat3awen f l qarar.',
    'What data analysis is, its 4 goals, the 5 types of analysis, the 5 steps, the tools, the fields and its role in decision-making.'
  ]),
  estimatedMinutes: 30,
  sections: [
    h(['1. C\'est quoi, l\'analyse de données ?', '1. Chnou hiya analyse de données ?', '1. What is data analysis?']),
    def([
      'L\'analyse de données est le **processus de collecte, de transformation et d\'organisation des données** afin de **tirer des conclusions**, **faire des prédictions** et **prendre des décisions éclairées**.\n\nAutrement dit : c\'est l\'ensemble des **méthodes et outils** qui permettent d\'**extraire une information utile à partir de données brutes**, pour aider à la **compréhension** et à la **prise de décision**.',
      'Analyse de données hiya l **process** li fih kanjem3ou data, kanbeddlouha w kanrttbouha, bach **nkhrjou b conclusions**, **ntnab2ou** b chi 7aja, w **nakhdou qarar** mbni 3la ma3loumat.\n\nB kelma khra : hiya majmou3a d **méthodes w outils** li kaykhrjou **ma3louma mfida mn data khama** (brute), bach nfhmou w nqarrrou mzyan.',
      'Data analysis is the **process of collecting, transforming and organising data** in order to **draw conclusions**, **make predictions** and **take informed decisions**.\n\nIn other words: it is the set of **methods and tools** used to **extract useful information from raw data**, to help **understanding** and **decision-making**.'
    ]),
    plain([
      'Imagine un cahier rempli de chiffres : les notes de toute la classe, matière par matière. Tel quel, ce cahier ne dit rien : ce sont des **données brutes**. Si tu calcules la moyenne de chaque matière, tu repères la matière la plus difficile, et tu décides d\'y passer plus de temps : tu viens de faire de l\'**analyse de données**. Données brutes → information → décision.',
      'Tkhayel cahier 3amer b l arqam : notes dyal l9ism kamel, kol matière. Hakka bo7do, had l cahier ma kaygoul walou : hadi hiya **data brute**. Ila 7sebti l moyenne dyal kol matière, ghadi tchouf ach hiya s3iba, w t9arrer tzid fiha l wa9t : hna derti **analyse de données**. Data khama → ma3louma → qarar.',
      'Picture a notebook full of numbers: every student\'s marks, subject by subject. As it is, the notebook says nothing: this is **raw data**. If you compute the average of each subject, spot the hardest one and decide to spend more time on it, you have just done **data analysis**. Raw data → information → decision.'
    ]),

    h(['2. Les 4 objectifs principaux', '2. 4 ahdaf ra2isiya', '2. The 4 main goals']),
    p([
      'Le professeur donne **4 objectifs**. Retiens-les dans l\'ordre, ils vont du plus simple au plus utile :\n\n1. **Décrire** les phénomènes observés : *qu\'est-ce que je vois ?*\n2. **Identifier les relations** entre variables : *qu\'est-ce qui est lié à quoi ?*\n3. **Prédire** des comportements futurs : *que va-t-il se passer ?*\n4. **Aider à la prise de décision** : *que dois-je faire ?*',
      'Lprof 3tana **4 ahdaf**. 7fedhom b tartib, kaybdaw mn sahel l mfid :\n\n1. **Wsef** (décrire) dakchi li kanchoufou : *chnou kayn ?*\n2. **L9a l 3ala9at** bin les variables : *chnou mrbout b chnou ?*\n3. **Tnba2** (prédire) b chnou ghadi ywqe3 : *chnou ghadi ykoun mn b3d ?*\n4. **3awen f l qarar** : *chnou khassni ndir ?*',
      'The professor lists **4 goals**. Learn them in order, from the simplest to the most useful:\n\n1. **Describe** the observed phenomena: *what do I see?*\n2. **Identify relationships** between variables: *what is linked to what?*\n3. **Predict** future behaviour: *what will happen?*\n4. **Support decision-making**: *what should I do?*'
    ]),
    example([
      '**Exemple du cours : la santé.** Un hôpital collecte l\'âge, la tension et le taux de sucre de ses patients.\n- **Décrire** : quel est le taux de sucre moyen des patients ?\n- **Relier** : identifier les **facteurs de risque du diabète** (l\'âge est-il lié au taux de sucre ?).\n- **Prédire / regrouper** : **regrouper les patients selon des profils similaires**.\n- **Décider** : **adapter les traitements** à chaque profil.\n\n→ L\'analyse de données **transforme les observations en connaissance**.',
      '**Mithal dyal lprof : sa7a.** Sbitar kayjme3 l3omr, tension w nisbat sokkar dyal lmrda.\n- **Wsef** : ch7al l moyenne dyal sokkar 3and lmrda ?\n- **Rbet** : nl9aw **facteurs de risque dyal diabète** (wach l3omr mrbout b sokkar ?).\n- **Tnba2 / jme3** : **njem3ou lmrda li kayt chabhou** f profils.\n- **Qarrer** : **nbeddlou l traitement** 3la 7sab kol profil.\n\n→ Analyse de données **kat7awel l observations l ma3rifa** (connaissance).',
      '**Course example: health.** A hospital collects its patients\' age, blood pressure and sugar level.\n- **Describe**: what is the patients\' average sugar level?\n- **Relate**: identify the **risk factors of diabetes** (is age linked to sugar level?).\n- **Predict / group**: **group patients with similar profiles**.\n- **Decide**: **adapt the treatment** to each profile.\n\n→ Data analysis **turns observations into knowledge**.'
    ]),
    quiz('di-01', 'di-09'),

    h(['3. Les 5 types d\'analyse de données', '3. 5 anwa3 dyal analyse', '3. The 5 types of data analysis']),
    p([
      'C\'est **le tableau le plus important du chapitre** : il tombe très souvent en QCM. Pour chaque type, retiens **son objectif** et **ses méthodes**.',
      'Hada **akther tableau mohim f fasl** : kayti7 bzaf f QCM. L kol naw3, 7fed **l hadaf dyalo** w **les méthodes dyalo**.',
      'This is **the most important table of the chapter**: it comes up very often in quizzes. For each type, learn **its goal** and **its methods**.'
    ]),
    table([['Type', 'Naw3', 'Type'], ['Objectif', 'Lhadaf', 'Goal'], ['Méthodes', 'Méthodes', 'Methods']], [
      [['**Descriptive**', '**Descriptive**', '**Descriptive**'], ['Résumer les données', 'Nlakhssou data', 'Summarise the data'], ['Moyenne, variance, graphiques', 'Moyenne, variance, graphiques', 'Mean, variance, charts']],
      [['**Exploratoire**', '**Exploratoire**', '**Exploratory**'], ['Découvrir des structures', 'Nktachfou structures mkhbbin', 'Discover structures'], ['ACP, AFC, clustering', 'ACP, AFC, clustering', 'PCA, CA, clustering']],
      [['**Confirmatoire**', '**Confirmatoire**', '**Confirmatory**'], ['Tester des hypothèses', 'Ntestiw hypothèses', 'Test hypotheses'], ['Tests statistiques', 'Tests statistiques', 'Statistical tests']],
      [['**Prédictive**', '**Prédictive**', '**Predictive**'], ['Anticiper des valeurs', 'Ntnab2ou b l qiyam', 'Anticipate values'], ['Régression, machine learning', 'Régression, machine learning', 'Regression, machine learning']],
      [['**Prescriptive**', '**Prescriptive**', '**Prescriptive**'], ['Optimiser la décision', 'N7ssnou l qarar', 'Optimise the decision'], ['Simulation, optimisation', 'Simulation, optimisation', 'Simulation, optimisation']]
    ]),
    steps(['Comment reconnaître le type en 3 secondes', 'Kifach t3ref naw3 f 3 thawani', 'How to recognise the type in 3 seconds'], [
      {
        t: ['Cherche le verbe de la question', 'Qelleb 3la l fi3l f sou2al', 'Look for the verb in the question'],
        b: ['Chaque type répond à une question différente : **« que s\'est-il passé ? »** (descriptive), **« qu\'est-ce qui se cache ? »** (exploratoire), **« est-ce vrai ? »** (confirmatoire), **« que va-t-il se passer ? »** (prédictive), **« que faut-il faire ? »** (prescriptive).', 'Kol naw3 kayjaweb 3la sou2al : **« chnou wqe3 ? »** (descriptive), **« chnou mkhbbi ? »** (exploratoire), **« wach s7i7 ? »** (confirmatoire), **« chnou ghadi ywqe3 ? »** (prédictive), **« chnou khassna ndirou ? »** (prescriptive).', 'Each type answers a different question: **"what happened?"** (descriptive), **"what is hidden?"** (exploratory), **"is it true?"** (confirmatory), **"what will happen?"** (predictive), **"what should we do?"** (prescriptive).']
      },
      {
        t: ['Regarde la méthode citée', 'Chouf l méthode li mdkoura', 'Look at the method mentioned'],
        b: ['Si l\'énoncé cite une méthode, c\'est gagné : **moyenne/variance → descriptive**, **ACP/AFC/clustering → exploratoire**, **test (Student, χ²) → confirmatoire**, **régression/ML → prédictive**, **optimisation/simulation → prescriptive**.', 'Ila l énoncé dkar méthode, sahla : **moyenne/variance → descriptive**, **ACP/AFC/clustering → exploratoire**, **test (Student, χ²) → confirmatoire**, **régression/ML → prédictive**, **optimisation/simulation → prescriptive**.', 'If the statement names a method, you are done: **mean/variance → descriptive**, **PCA/CA/clustering → exploratory**, **test (Student, χ²) → confirmatory**, **regression/ML → predictive**, **optimisation/simulation → prescriptive**.'],
        why: ['Les QCM du contrôle donnent presque toujours une méthode dans la phrase.', 'QCM dyal contrôle tqriban dima kay3tiw méthode f jomla.', 'Test quizzes almost always name a method in the sentence.']
      },
      {
        t: ['Attention à confirmatoire vs exploratoire', '3endak tkhllet confirmatoire m3a exploratoire', 'Careful: confirmatory vs exploratory'],
        b: ['**Confirmatoire** : on avait une **hypothèse AVANT** de regarder les données, on la teste. **Exploratoire** : **aucune hypothèse** au départ, on cherche ce que les données cachent.', '**Confirmatoire** : kant 3andna **hypothèse 9BEL** ma nchoufou data, w kantestiwha. **Exploratoire** : **ma kayn 7ta hypothèse** f lbdya, kanqellbou chnou mkhbbi f data.', '**Confirmatory**: we had a **hypothesis BEFORE** looking at the data and we test it. **Exploratory**: **no hypothesis** at the start, we look for what the data hides.']
      }
    ]),
    anim('AnalysisTypesCards'),
    quiz('di-02', 'di-03', 'di-05'),

    h(['4. Les 5 étapes de la démarche', '4. 5 étapes dyal la démarche', '4. The 5 steps of the process']),
    table([['Étape', 'Étape', 'Step'], ['Description', 'Chnou katdir', 'Description'], ['Exemple', 'Mithal', 'Example']], [
      [['1. **Collecte**', '1. **Collecte** (jam3)', '1. **Collection**'], ['Acquisition des données pertinentes', 'Tjib data li mohimma', 'Acquire the relevant data'], ['Questionnaire, base de données', 'Questionnaire, base de données', 'Questionnaire, database']],
      [['2. **Nettoyage**', '2. **Nettoyage** (tn9iya)', '2. **Cleaning**'], ['Suppression d\'erreurs et de valeurs aberrantes', 'T7iyed l akhta2 w l qiyam l ghriba', 'Remove errors and outliers'], ['Valeurs manquantes, doublons', 'Valeurs manquantes, doublons', 'Missing values, duplicates']],
      [['3. **Exploration**', '3. **Exploration**', '3. **Exploration**'], ['Calculs descriptifs, visualisations', '7sab descriptif w graphiques', 'Descriptive calculations, visualisations'], ['Moyenne, histogrammes', 'Moyenne, histogrammes', 'Mean, histograms']],
      [['4. **Modélisation**', '4. **Modélisation**', '4. **Modelling**'], ['Application d\'outils statistiques', 'Tstakhdem outils statistiques', 'Apply statistical tools'], ['Régression, ACP, clustering', 'Régression, ACP, clustering', 'Regression, PCA, clustering']],
      [['5. **Interprétation**', '5. **Interprétation** (tafsir)', '5. **Interpretation**'], ['Transformation des résultats en décision', 'Tbeddel natija l qarar', 'Turn results into decisions'], ['Identifier les profils à risque', 'T3ref les profils li fihom risque', 'Identify at-risk profiles']]
    ]),
    p(['→ Ces étapes constituent **le cycle complet de toute analyse de données**.', '→ Had les étapes homa **cycle kamel dyal ay analyse de données**.', '→ These steps form **the complete cycle of any data analysis**.']),
    steps(['Les 5 étapes sur un cas concret : « Pourquoi des étudiants ratent le contrôle ? »', '5 étapes 3la mithal : « 3lach chi tlamid kaysqtou f contrôle ? »', 'The 5 steps on a real case: "Why do some students fail the test?"'], [
      {
        t: ['Collecte', 'Collecte', 'Collection'],
        b: ['On envoie un **questionnaire** à 120 étudiants : heures de révision, heures de sommeil, note obtenue.', 'Kansiftou **questionnaire** l 120 tlmid : ch7al d sa3a rajj3ou, ch7al n3sou, w no9ta li jabou.', 'We send a **questionnaire** to 120 students: revision hours, sleep hours, mark obtained.']
      },
      {
        t: ['Nettoyage', 'Nettoyage', 'Cleaning'],
        b: ['Certains n\'ont pas répondu à « sommeil » (**valeurs manquantes**), un étudiant a répondu deux fois (**doublon**), un autre a écrit 250 heures de révision (**valeur aberrante**). On corrige tout ça — c\'est le **Chap 2**.', 'Chi wa7din ma jawbouch 3la « n3as » (**valeurs manquantes**), wa7ed jaweb jouj merrat (**doublon**), w wa7ed ktb 250 sa3a d révision (**valeur aberrante**). Kansl7ou hadchi kamel — hada howa **Fasl 2**.', 'Some did not answer "sleep" (**missing values**), one student answered twice (**duplicate**), another wrote 250 revision hours (**outlier**). We fix all that — this is **Ch. 2**.'],
        why: ['Sans nettoyage, une seule valeur fausse (250 h) peut fausser toute la moyenne.', 'Bla nettoyage, qima wa7da ghalta (250 h) t9der tkhssr l moyenne kamla.', 'Without cleaning, one wrong value (250 h) can distort the whole mean.']
      },
      {
        t: ['Exploration', 'Exploration', 'Exploration'],
        b: ['On calcule la **moyenne** des heures de révision et on trace un **histogramme** des notes (Chap 4).', 'Kan7sbou **moyenne** dyal sa3at d révision w nrsmou **histogramme** dyal notes (Fasl 4).', 'We compute the **mean** of revision hours and draw a **histogram** of marks (Ch. 4).']
      },
      {
        t: ['Modélisation', 'Modélisation', 'Modelling'],
        b: ['On applique une **régression linéaire** : note = a × heures + b. On trouve par exemple « +0,6 point par heure de révision ».', 'Kandirou **régression linéaire** : note = a × sa3at + b. Nl9aw mathalan « +0,6 point 3la kol sa3a d révision ».', 'We fit a **linear regression**: mark = a × hours + b. We find, for example, "+0.6 point per revision hour".']
      },
      {
        t: ['Interprétation', 'Interprétation', 'Interpretation'],
        b: ['Décision : l\'école organise des **séances de révision encadrées** pour les étudiants qui révisent moins de 3 heures.', 'Qarar : l\'école kat-organiser **séances d révision m3a encadrant** l tlamid li kayrajj3ou 9el mn 3 sa3at.', 'Decision: the school organises **supervised revision sessions** for students who revise less than 3 hours.']
      }
    ]),
    anim('DataPipeline'),
    exam(['Retiens l\'ordre exact : **Collecte → Nettoyage → Exploration → Modélisation → Interprétation**. Astuce : « **C**ette **N**uit **E**lle **M**ange **I**ci » (C-N-E-M-I).', '7fed tartib : **Collecte → Nettoyage → Exploration → Modélisation → Interprétation**. Astuce : « **C**ette **N**uit **E**lle **M**ange **I**ci » (C-N-E-M-I).', 'Learn the exact order: **Collection → Cleaning → Exploration → Modelling → Interpretation**. Mnemonic (French initials): "**C**ette **N**uit **E**lle **M**ange **I**ci" (C-N-E-M-I).']),
    quiz('di-06', 'di-07'),

    h(['5. Les outils fondamentaux', '5. Les outils l asasiyin', '5. The core tools']),
    table([['Famille', 'No3', 'Family'], ['Exemples du cours', 'Amthila mn dars', 'Course examples']], [
      [['**Outils statistiques**', '**Outils statistiques**', '**Statistical tools**'], ['Moyenne, variance, corrélation, test t', 'Moyenne, variance, corrélation, test t', 'Mean, variance, correlation, t-test']],
      [['**Outils informatiques**', '**Outils informatiques**', '**Software tools**'], ['Python (**Pandas, NumPy, Matplotlib**), R, Excel, SPSS, Power BI', 'Python (**Pandas, NumPy, Matplotlib**), R, Excel, SPSS, Power BI', 'Python (**Pandas, NumPy, Matplotlib**), R, Excel, SPSS, Power BI']],
      [['**Outils de visualisation**', '**Outils de visualisation**', '**Visualisation tools**'], ['Graphiques, nuages de points, heatmaps, tableaux de bord', 'Graphiques, nuages de points, heatmaps, tableaux de bord', 'Charts, scatter plots, heatmaps, dashboards']]
    ]),
    tip(['Dans ce module on travaille en **Python** : **pandas** pour lire et nettoyer (Chap 1 et 2), **Matplotlib / Seaborn** pour visualiser (Chap 4), et les **tests statistiques** pour décider (Chap 5).', 'F had module kankhdmou b **Python** : **pandas** bach n9raw w nn9iw data (Fasl 1 w 2), **Matplotlib / Seaborn** l graphiques (Fasl 4), w **tests statistiques** bach nqarrrou (Fasl 5).', 'In this module we work in **Python**: **pandas** to read and clean (Ch. 1 and 2), **Matplotlib / Seaborn** to visualise (Ch. 4), and **statistical tests** to decide (Ch. 5).']),

    h(['6. Importance dans différents domaines', '6. Fin katsta3mel', '6. Importance across fields']),
    table([['Domaine', 'Domaine', 'Field'], ['À quoi sert l\'analyse', 'Fach kat3awen', 'What analysis is used for']], [
      [['Santé', 'Sa7a', 'Health'], ['Diagnostic, suivi des patients, analyse des traitements, recherche médicale', 'Diagnostic, tab3 lmrda, t7lil l traitements, recherche', 'Diagnosis, patient follow-up, treatment analysis, medical research']],
      [['Finance', 'Finance', 'Finance'], ['Évaluation des risques, **détection de fraudes**, prévisions, investissements', 'Risques, **kachf l fraude**, prévisions, investissements', 'Risk assessment, **fraud detection**, forecasting, investments']],
      [['Marketing et commerce', 'Marketing w tijara', 'Marketing and retail'], ['Comportement des clients, **segmentation du marché**, offres personnalisées, ventes', 'Slouk dyal clients, **segmentation**, offres personnalisées, ventes', 'Customer behaviour, **market segmentation**, personalised offers, sales']],
      [['Industrie et production', 'Sina3a', 'Industry'], ['Optimisation des processus, **maintenance prédictive**, ressources', 'T7sin l process, **maintenance prédictive**, ressources', 'Process optimisation, **predictive maintenance**, resources']],
      [['Sciences sociales', 'Sciences sociales', 'Social sciences'], ['Tendances, enquêtes statistiques, études de population', 'Tendances, enquêtes, dirasat dyal sokkan', 'Trends, surveys, population studies']],
      [['Technologies de l\'information', 'IT', 'Information technology'], ['Algorithmes, **big data**, intelligence artificielle', 'Algorithmes, **big data**, IA', 'Algorithms, **big data**, artificial intelligence']]
    ]),
    p(['Ainsi, l\'analyse de données est un **levier stratégique** : elle améliore la performance, anticipe les besoins et permet des décisions basées sur des **informations fiables**.', 'Donc analyse de données hiya **levier stratégique** : kat7ssen l performance, katsbe9 l i7tiyajat, w katkhllik t9arrer 3la **ma3loumat mwtou9 fiha**.', 'Data analysis is therefore a **strategic lever**: it improves performance, anticipates needs and enables decisions based on **reliable information**.']),

    h(['7. Rôle dans la prise de décision', '7. Dawrha f l qarar', '7. Role in decision-making']),
    p([
      'L\'analyse de données fournit des informations **objectives et pertinentes**. Elle permet de :\n\n- **Identifier des tendances et des modèles** à partir des données historiques ;\n- **Évaluer les risques** et anticiper les conséquences des décisions ;\n- **Optimiser les stratégies** en se basant sur des **preuves concrètes plutôt que sur des intuitions** ;\n- **Mesurer l\'impact** des actions entreprises et ajuster les décisions.\n\nRésultat : de meilleures décisions, **moins d\'incertitude**, plus de compétitivité.',
      'Analyse de données kat3tik ma3loumat **objectives w mfida**. Katkhllik :\n\n- **Tchouf tendances w modèles** mn data l9dima ;\n- **T9iyyem l risques** w tsbe9 l nata2ij dyal l qarar ;\n- **T7ssen strategies** 3la 7sab **preuves 7a9i9iya, machi 3la l 7ss (intuition)** ;\n- **T9is l impact** dyal dakchi li derti w tbeddel l qarar ila khass.\n\nNatija : qararat a7ssen, **chk 9lil**, w compétitivité ktar.',
      'Data analysis provides **objective and relevant** information. It lets you:\n\n- **Identify trends and patterns** in historical data;\n- **Assess risks** and anticipate the consequences of decisions;\n- **Optimise strategies** based on **concrete evidence rather than intuition**;\n- **Measure the impact** of actions taken and adjust decisions.\n\nResult: better decisions, **less uncertainty**, more competitiveness.'
    ]),
    tip(['Le chapitre 0 se termine par un **rappel de statistique descriptive et de régression linéaire** : c\'est le chapitre suivant, avec tous les calculs pas à pas.', 'Fasl 0 kaysali b **rappel dyal statistique descriptive w régression linéaire** : hada howa l fasl li jay, b ga3 l 7sabat étape par étape.', 'Chapter 0 ends with a **reminder of descriptive statistics and linear regression**: that is the next chapter, with every calculation step by step.']),
    quiz('di-08', 'di-12')
  ],
  keyPoints: [
    L(['Définition : collecter, transformer, organiser les données pour conclure, prédire et décider.', 'Ta3rif : njem3ou, nbeddlou w nrttbou data bach nkhrjou b conclusion, ntnab2ou w nqarrrou.', 'Definition: collect, transform and organise data to conclude, predict and decide.']),
    L(['4 objectifs : décrire, identifier les relations, prédire, aider à la décision.', '4 ahdaf : wsef, l9a l 3ala9at, tnba2, 3awen f l qarar.', '4 goals: describe, identify relationships, predict, support decisions.']),
    L(['5 types : descriptive (moyenne, variance, graphiques) · exploratoire (ACP, AFC, clustering) · confirmatoire (tests) · prédictive (régression, ML) · prescriptive (simulation, optimisation).', '5 anwa3 : descriptive · exploratoire · confirmatoire · prédictive · prescriptive, m3a méthodes dyalhom.', '5 types: descriptive · exploratory · confirmatory · predictive · prescriptive, with their methods.']),
    L(['5 étapes dans l\'ordre : collecte → nettoyage → exploration → modélisation → interprétation.', '5 étapes b tartib : collecte → nettoyage → exploration → modélisation → interprétation.', '5 steps in order: collection → cleaning → exploration → modelling → interpretation.']),
    L(['Outils : statistiques (moyenne, variance, corrélation, test t), informatiques (Python : Pandas, NumPy, Matplotlib ; R, Excel, SPSS, Power BI), visualisation.', 'Outils : statistiques, informatiques (Python…), visualisation.', 'Tools: statistical, software (Python…), visualisation.'])
  ]
};
