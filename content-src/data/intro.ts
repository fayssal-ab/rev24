import { setCtx, single, multi, order, ex, fc, ref } from '../lib';

setCtx('data', 'd-intro');

export const questions = [
  multi('di-01', 1, ['Quels sont les 4 objectifs de l\'analyse de données ?', '4 ahdaf dyal analyse ?', 'The 4 goals of data analysis?'],
    [['Décrire', 'Wsef', 'Describe'], ['Relier', 'Rbet', 'Relate'], ['Prédire', 'Tnba2', 'Predict'], ['Décider', 'Qarrer', 'Decide'], ['Chiffrer', 'Chiffrer', 'Encrypt']], [0, 1, 2, 3],
    ['Décrire (résumer), **relier** (liens entre variables), **prédire** (anticiper), **décider** (aider la décision).', 'Wsef, rbet, tnba2, qarrer.', 'Describe, **relate**, **predict**, **decide**.'],
    [['Le chiffrement relève de la sécurité, pas de l\'analyse.', 'Sécurité.', 'Encryption is security.']], ['objectifs']),
  single('di-02', 1, ['Calculer la moyenne et la variance de l\'âge des patients relève de l\'analyse…', 'Moyenne w variance = analyse… ?', 'Mean and variance of age = … analysis?'],
    [['descriptive', 'descriptive', 'descriptive'], ['prédictive', 'prédictive', 'predictive'], ['prescriptive', 'prescriptive', 'prescriptive'], ['confirmatoire', 'confirmatoire', 'confirmatory']], 0,
    ['**Descriptive** : résumer les données (moyenne, variance, graphiques). « Que s\'est-il passé ? »', 'Descriptive.', '**Descriptive**: summarise data.'],
    [['Prédictive : régression, ML pour anticiper.', 'Tnba2.', 'Prediction.'], ['Prescriptive : simulation, optimisation pour recommander.', 'Tawsiya.', 'Recommendation.'], ['Confirmatoire : tests d\'hypothèses.', 'Tests.', 'Tests.']], ['types']),
  single('di-03', 2, ['L\'ACP, l\'AFC et le clustering appartiennent à l\'analyse…', 'ACP, AFC, clustering = ?', 'PCA, CA, clustering are…'],
    [['descriptive', 'descriptive', 'descriptive'], ['exploratoire', 'exploratoire', 'exploratory'], ['confirmatoire', 'confirmatoire', 'confirmatory'], ['prescriptive', 'prescriptive', 'prescriptive']], 1,
    ['**Exploratoire** : découvrir des structures cachées sans hypothèse préalable (ACP, AFC, clustering).', 'Exploratoire.', '**Exploratory**: find hidden structure.'],
    [['Descriptive = statistiques simples et graphiques.', 'Basita.', 'Simple stats.'], ['Confirmatoire = tester une hypothèse posée avant.', 'Tests.', 'Testing a prior hypothesis.'], ['Prescriptive = simulation, optimisation.', 'Optimisation.', 'Optimisation.']], ['types']),
  single('di-04', 2, ['Un test de Student pour vérifier qu\'un médicament baisse la glycémie est une analyse…', 'Test Student = ?', 'A Student test checking a drug is…'],
    [['exploratoire', 'exploratoire', 'exploratory'], ['confirmatoire', 'confirmatoire', 'confirmatory'], ['prédictive', 'prédictive', 'predictive'], ['descriptive', 'descriptive', 'descriptive']], 1,
    ['**Confirmatoire** : on confirme ou infirme une hypothèse formulée **avant** de voir les données (tests).', 'Confirmatoire.', '**Confirmatory**: tests a prior hypothesis.'],
    [['Exploratoire = sans hypothèse.', 'Bla hypothèse.', 'No prior hypothesis.'], ['Prédictive = anticiper des valeurs futures.', 'Mosta9bal.', 'Future values.'], ['Descriptive = résumer.', 'Résumer.', 'Summarising.']], ['types']),
  single('di-05', 2, ['Choisir le planning de production qui minimise les coûts relève de l\'analyse…', 'Planning b a9al coût = ?', 'Choosing a cost-minimising production plan is…'],
    [['prescriptive', 'prescriptive', 'prescriptive'], ['prédictive', 'prédictive', 'predictive'], ['exploratoire', 'exploratoire', 'exploratory'], ['descriptive', 'descriptive', 'descriptive']], 0,
    ['**Prescriptive** : recommander une action (simulation, **optimisation**) — « que faut-il faire ? ».', 'Prescriptive.', '**Prescriptive**: recommend actions.'],
    [['Prédire ≠ recommander une action.', 'Tnba2 ≠ tawsiya.', 'Predicting ≠ recommending.'], ['Pas de recherche de structure ici.', 'Machi structure.', 'No structure search.'], ['On ne se contente pas de résumer.', 'Machi ghir résumé.', 'Not just summarising.']], ['types']),
  order('di-06', 1, ['Remets dans l\'ordre les 5 étapes d\'une analyse de données.', 'Rttab 5 mara7il.', 'Order the 5 steps.'],
    [['Collecte', 'Jm3', 'Collection'], ['Nettoyage', 'Tnqiya', 'Cleaning'], ['Exploration', 'Istikchaf', 'Exploration'], ['Modélisation', 'Modélisation', 'Modelling'], ['Interprétation', 'Tafsir', 'Interpretation']],
    ['Collecte → nettoyage → exploration → modélisation → interprétation.', 'Jm3 → tnqiya → istikchaf → modélisation → tafsir.', 'Collection → cleaning → exploration → modelling → interpretation.'], ['etapes']),
  single('di-07', 2, ['Traiter les valeurs manquantes et les doublons, c\'est l\'étape de…', 'Valeurs na9sin w doublons = ?', 'Missing values and duplicates = which step?'],
    [['collecte', 'jm3', 'collection'], ['nettoyage', 'tnqiya', 'cleaning'], ['modélisation', 'modélisation', 'modelling'], ['interprétation', 'tafsir', 'interpretation']], 1,
    ['Le **nettoyage** corrige valeurs manquantes, doublons, erreurs de saisie, types — souvent l\'étape la plus longue.', 'Tnqiya.', '**Cleaning**.'],
    [['La collecte récupère les données brutes.', 'Jm3.', 'Collection gathers raw data.'], ['La modélisation vient après.', 'Mn b3d.', 'Comes later.'], ['L\'interprétation est la dernière étape.', 'Lekhra.', 'Last step.']], ['etapes']),
  multi('di-08', 2, ['Quels outils **informatiques** d\'analyse cite le cours ?', 'Outils informatiques ?', 'Which **software** tools?'],
    [['Python (Pandas, NumPy, Matplotlib)', 'Python', 'Python (Pandas, NumPy, Matplotlib)'], ['R', 'R', 'R'], ['Excel', 'Excel', 'Excel'], ['SPSS', 'SPSS', 'SPSS'], ['Power BI', 'Power BI', 'Power BI'], ['GRUB2', 'GRUB2', 'GRUB2']], [0, 1, 2, 3, 4],
    ['Python (Pandas, NumPy, Matplotlib), R, Excel, SPSS, Power BI.', 'Python, R, Excel, SPSS, Power BI.', 'Python, R, Excel, SPSS, Power BI.'],
    [['GRUB2 est un chargeur de démarrage Linux !', 'GRUB2 = Linux.', 'GRUB2 is a boot loader!']], ['outils']),
  single('di-09', 1, ['Dans l\'exemple santé (diabète), prévoir le risque de diabète d\'un nouveau patient selon son âge et son IMC est…', 'Diabète : tnba2 = ?', 'Diabetes: predicting risk is…'],
    [['descriptif', 'descriptif', 'descriptive'], ['prédictif', 'prédictif', 'predictive'], ['exploratoire', 'exploratoire', 'exploratory'], ['de la collecte', 'jm3', 'collection']], 1,
    ['Anticiper une valeur pour un nouvel individu = **prédiction** (régression, ML).', 'Prédictif.', '**Predictive**.'],
    [['Décrire ne prévoit rien.', 'Wsef.', 'Describing predicts nothing.'], ['Pas de recherche de groupes.', 'Machi groupes.', 'No grouping.'], ['Ce n\'est pas une étape mais un type.', 'Machi étape.', 'Not a step.']], ['types']),
  multi('di-10', 2, ['Dans quels domaines l\'analyse de données est-elle utilisée ?', 'Domaines ?', 'Domains?'],
    [['Santé', 'Sa7a', 'Health'], ['Finance', 'Finance', 'Finance'], ['Marketing', 'Marketing', 'Marketing'], ['Industrie', 'Sina3a', 'Industry'], ['Sciences sociales', 'Sciences sociales', 'Social sciences'], ['IT', 'IT', 'IT']], [0, 1, 2, 3, 4, 5],
    ['Tous : santé, finance, marketing, industrie, sciences sociales, IT…', 'Kolchi.', 'All of them.'], [], ['domaines']),
  single('di-11', 3, ['Une banque regroupe ses clients en profils sans catégorie définie à l\'avance. Type et méthode ?', 'Bank kat-groupi clients : ?', 'A bank groups customers without predefined categories. Type/method?'],
    [['Descriptive, moyenne', 'Descriptive', 'Descriptive, mean'], ['Exploratoire, clustering', 'Exploratoire, clustering', 'Exploratory, clustering'], ['Confirmatoire, χ²', 'Confirmatoire', 'Confirmatory, χ²'], ['Prescriptive, optimisation', 'Prescriptive', 'Prescriptive']], 1,
    ['Sans catégories préétablies, on **explore** pour découvrir des groupes : **clustering**.', 'Clustering.', '**Clustering** (exploratory).'],
    [['La moyenne ne crée pas de groupes.', 'Moyenne.', 'Mean does not group.'], ['Aucune hypothèse à tester.', 'Bla hypothèse.', 'No hypothesis.'], ['On ne recommande pas encore d\'action.', 'Machi tawsiya.', 'No action yet.']], ['types']),
  single('di-12', 3, ['Pourquoi l\'analyse de données est-elle un outil d\'aide à la **décision** ?', '3lach analyse = aide décision ?', 'Why is analysis a decision aid?'],
    [['Elle remplace le décideur', 'Kat3awed l mas2oul', 'It replaces the decision-maker'], ['Elle transforme des données en informations objectives qui réduisent l\'incertitude', 'Kat7awel data l ma3loumat', 'It turns data into objective information that reduces uncertainty'], ['Elle garantit une décision juste', 'Dima s7i7', 'It guarantees the right decision'], ['Elle évite de collecter des données', 'Bla data', 'It avoids collecting data']], 1,
    ['Elle fournit des faits chiffrés, des tendances, des prévisions avec un **risque d\'erreur mesuré** : le décideur reste humain.', 'Faits + risque.', 'Facts and measured risk; humans still decide.'],
    [['Le décideur reste responsable.', 'Mas2oul.', 'Humans decide.'], ['Il reste toujours un risque d\'erreur (α, β).', 'Risque.', 'Risk remains.'], ['Elle repose sur les données.', 'Data.', 'It needs data.']], ['decision'])
];

export { chapter } from './course/intro';

export const exercises = [
  ex('dx-i-1', 2, ['Classer des cas d\'usage', 'Tsnif', 'Classify use cases'],
    ['Pour chaque situation, donne le type d\'analyse et une méthode : a) taux moyen d\'absentéisme 2025 ; b) savoir si une nouvelle formation améliore les notes ; c) prévoir les ventes du mois prochain ; d) regrouper des clients similaires ; e) choisir les stocks qui minimisent les coûts.', '5 situations.', 'Classify 5 situations.'],
    [['Pose la question « que s\'est-il passé / que va-t-il se passer / que faire ? ».', 'So2al.', 'Ask the guiding question.']],
    [{ t: ['Correction', 'Tas7i7', 'Answer'], b: ['a) descriptive (moyenne) ; b) confirmatoire (test d\'hypothèse) ; c) prédictive (régression) ; d) exploratoire (clustering) ; e) prescriptive (optimisation).', 'a desc ; b conf ; c préd ; d expl ; e presc.', 'a descriptive; b confirmatory; c predictive; d exploratory; e prescriptive.'] }],
    ['a descriptive · b confirmatoire · c prédictive · d exploratoire · e prescriptive.', 'a · b · c · d · e.', 'a descriptive · b confirmatory · c predictive · d exploratory · e prescriptive.'],
    [['Confondre prédictive et prescriptive.', 'Préd ≠ presc.', 'Predictive ≠ prescriptive.'], ['Classer le clustering en descriptive.', 'Clustering = expl.', 'Clustering is exploratory.']]),
  ex('dx-i-2', 2, ['Le pipeline sur un cas réel', 'Pipeline', 'Pipeline on a real case'],
    ['Une clinique veut réduire les complications du diabète. Décris concrètement ce qu\'on fait à chacune des 5 étapes.', '5 mara7il l clinique.', 'Describe the 5 steps for a clinic.'],
    [['Pense aux données (glycémie, âge, IMC…).', 'Data.', 'Think of the data.']],
    [{ t: ['Collecte et nettoyage', 'Jm3 w tnqiya', 'Collect and clean'], b: ['Dossiers patients (CSV/SQL) ; supprimer doublons, gérer valeurs manquantes, unités (g/L).', 'Dossiers ; doublons ; na9sin.', 'Patient files; duplicates; missing values; units.'] },
     { t: ['Exploration et modélisation', 'Istikchaf w modélisation', 'Explore and model'], b: ['Histogrammes, corrélations IMC/glycémie ; tests, régression pour prédire le risque.', 'Graphiques ; tests ; régression.', 'Charts; tests; regression.'] },
     { t: ['Interprétation', 'Tafsir', 'Interpretation'], b: ['Identifier les profils à risque, recommander un suivi : aide à la décision.', 'Tawsiya.', 'Recommend follow-up.'] }],
    ['Collecte → nettoyage → exploration → modélisation → interprétation, appliquées au diabète.', '5 mara7il.', 'The 5 steps applied.'],
    [['Modéliser avant de nettoyer.', 'Modéliser 9bel.', 'Modelling before cleaning.']]),
  ex('dx-i-3', 2, ['Choisir les outils', 'Outils', 'Choose tools'],
    ['Une PME a des fichiers Excel de ventes et veut des tableaux de bord pour la direction et des analyses statistiques poussées. Quels outils du cours proposer et pourquoi ?', 'Outils l PME.', 'Which tools for an SME?'],
    [['Distingue calcul / visualisation.', 'Calcul / visualisation.', 'Compute vs visualise.']],
    [{ t: ['Proposition', 'Iqtira7', 'Proposal'], b: ['Python (pandas pour lire les Excel avec `read_excel`, statistiques, Matplotlib) ou R pour l\'analyse ; Power BI pour les tableaux de bord de la direction ; Excel pour les échanges.', 'Python/R + Power BI.', 'Python/R for analysis, Power BI dashboards.'] }],
    ['Python (pandas) / R pour l\'analyse, Power BI pour la visualisation décisionnelle.', 'Python + Power BI.', 'Python/R + Power BI.'],
    [['Tout faire à la main dans Excel (peu reproductible).', 'Excel bou7do.', 'Excel only.']])
];

export const flashcards = [
  fc('fc-di-1', ['4 objectifs ?', '4 ahdaf ?', '4 goals?'], ['Décrire, relier, prédire, décider.', 'Wsef, rbet, tnba2, qarrer.', 'Describe, relate, predict, decide.']),
  fc('fc-di-2', ['Analyse descriptive ?', 'Descriptive ?', 'Descriptive?'], ['Moyenne, variance, graphiques.', 'Moyenne, variance.', 'Mean, variance, charts.']),
  fc('fc-di-3', ['Analyse exploratoire ?', 'Exploratoire ?', 'Exploratory?'], ['ACP, AFC, clustering.', 'ACP, AFC, clustering.', 'PCA, CA, clustering.']),
  fc('fc-di-4', ['Analyse confirmatoire ?', 'Confirmatoire ?', 'Confirmatory?'], ['Tests statistiques.', 'Tests.', 'Statistical tests.']),
  fc('fc-di-5', ['Analyse prédictive ?', 'Prédictive ?', 'Predictive?'], ['Régression, machine learning.', 'Régression, ML.', 'Regression, ML.']),
  fc('fc-di-6', ['Analyse prescriptive ?', 'Prescriptive ?', 'Prescriptive?'], ['Simulation, optimisation.', 'Simulation, optimisation.', 'Simulation, optimisation.']),
  fc('fc-di-7', ['5 étapes ?', '5 mara7il ?', '5 steps?'], ['Collecte → nettoyage → exploration → modélisation → interprétation.', 'Jm3 → tnqiya → istikchaf → modélisation → tafsir.', 'Collection → cleaning → exploration → modelling → interpretation.']),
  fc('fc-di-8', ['Outils informatiques ?', 'Outils ?', 'Software?'], ['Python (Pandas, NumPy, Matplotlib), R, Excel, SPSS, Power BI.', 'Python, R, Excel, SPSS, Power BI.', 'Python, R, Excel, SPSS, Power BI.']),
  fc('fc-di-9', ['Domaines ?', 'Domaines ?', 'Domains?'], ['Santé, finance, marketing, industrie, sciences sociales, IT.', 'Sa7a, finance…', 'Health, finance, marketing, industry, social sciences, IT.']),
  fc('fc-di-10', ['Rôle dans la décision ?', 'Dor f qarar ?', 'Role in decisions?'], ['Fournir des faits objectifs et un risque d\'erreur maîtrisé ; l\'humain décide.', 'Faits ; insan kayqarrer.', 'Objective facts, measured risk; humans decide.']),
  fc('fc-di-11', ['Étape la plus longue en pratique ?', 'Atwal mar7ala ?', 'Longest step in practice?'], ['Le nettoyage (valeurs manquantes, doublons, types).', 'Tnqiya.', 'Cleaning.']),
  fc('fc-di-12', ['Exemple santé ?', 'Mithal sa7a ?', 'Health example?'], ['Diabète : décrire la glycémie, relier IMC/glycémie, prédire le risque, décider de la prévention.', 'Diabète.', 'Diabetes example.'])
];

export const reference = [
  ref('r-di-1', 'Décrire · relier · prédire · décider', ['4 objectifs', '4 ahdaf', '4 goals']),
  ref('r-di-2', 'Descriptive · exploratoire · confirmatoire · prédictive · prescriptive', ['5 types', '5 anwa3', '5 types']),
  ref('r-di-3', 'Collecte → nettoyage → exploration → modélisation → interprétation', ['5 étapes', '5 mara7il', '5 steps'])
];
