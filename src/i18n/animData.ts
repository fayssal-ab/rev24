/** Texts of the data-analysis animations (fr / dar / en). */
export const HTV = {
  title: { fr: 'Visualiseur de tests d\'hypothèses', dar: 'Visualiseur dyal tests d\'hypothèses', en: 'Hypothesis test visualizer' },
  presets: [
    { id: 'fusee', name: { fr: 'Fusée (σ connu, bilatéral)', dar: 'Fusée (σ m3rouf, bilatéral)', en: 'Rocket (σ known, two-sided)' } },
    { id: 'comprimes', name: { fr: 'Comprimés (σ inconnu, 98 %)', dar: 'Comprimés (σ ma m3roufch, 98 %)', en: 'Tablets (σ unknown, 98 %)' } },
    { id: 'glycemie', name: { fr: 'Glycémie (σ connu, gauche)', dar: 'Glycémie (σ m3rouf, lisser)', en: 'Blood sugar (σ known, left)' } },
    { id: 'chi2', name: { fr: 'χ² normalité (ν = 1)', dar: 'χ² normalité (ν = 1)', en: 'χ² normality (ν = 1)' } }
  ],
  h0: { fr: 'Hypothèses', dar: 'Hypothèses', en: 'Hypotheses' },
  pv: { fr: 'P-value = aire au-delà de la statistique observée', dar: 'P-value = l mesa7a mora statistique li tchafet', en: 'P-value = area beyond the observed statistic' },
  area: { fr: 'Zone rouge = région critique (aire α)', dar: 'Zone 7amra = région critique (mesa7a α)', en: 'Red zone = critical region (area α)' }
};

export const ERRT = {
  title: { fr: 'Erreurs de 1re et 2e espèce', dar: 'Les erreurs dyal naw3 1 w 2', en: 'Type I and type II errors' },
  truth: { fr: 'Réalité', dar: 'L7a9i9a', en: 'Reality' },
  decision: { fr: 'Décision', dar: 'Lqarar', en: 'Decision' },
  h0true: { fr: 'H0 vraie', dar: 'H0 s7i7a', en: 'H0 true' },
  h0false: { fr: 'H0 fausse', dar: 'H0 ghalta', en: 'H0 false' },
  keep: { fr: 'Ne pas rejeter H0', dar: 'Ma nrfdouch H0', en: 'Do not reject H0' },
  reject: { fr: 'Rejeter H0', dar: 'Nrfdou H0', en: 'Reject H0' },
  ok1: { fr: 'Bonne décision (1 − α)', dar: 'Qarar s7i7 (1 − α)', en: 'Right decision (1 − α)' },
  errI: { fr: 'Erreur de 1re espèce : α', dar: 'Ghalta naw3 1 : α', en: 'Type I error: α' },
  errII: { fr: 'Erreur de 2e espèce : β', dar: 'Ghalta naw3 2 : β', en: 'Type II error: β' },
  power: { fr: 'Puissance : 1 − β', dar: 'Puissance : 1 − β', en: 'Power: 1 − β' },
  trialTitle: { fr: 'Exemple du procès : H0 = « l\'accusé est innocent »', dar: 'Mithal dyal lm7akama : H0 = « lmtaham bri2 »', en: 'Trial example: H0 = "the defendant is innocent"' },
  trial: [
    { truth: 0, dec: 1, t: { fr: 'Un innocent est condamné : **erreur de 1re espèce (α)**. C\'est l\'erreur qu\'on veut le plus éviter : on fixe α petit (5 %).', dar: 'Bri2 t7kem 3lih : **ghalta naw3 1 (α)**. Hadi li bghina ntjennbou ktar : kandirou α sghira (5 %).', en: 'An innocent is convicted: **type I error (α)**. The error we most want to avoid, so α is kept small (5 %).' } },
    { truth: 1, dec: 0, t: { fr: 'Un coupable est acquitté (faute de preuves) : **erreur de 2e espèce (β)**. Ne pas rejeter H0 ≠ prouver H0 : conclusion **faible**.', dar: 'Lmoujrim khrej bri2 (ma kaynach adilla) : **ghalta naw3 2 (β)**. Ma nrfdouch H0 ≠ nbaynou H0 : conclusion **d3ifa**.', en: 'A guilty person is acquitted (lack of evidence): **type II error (β)**. Not rejecting H0 ≠ proving H0: **weak** conclusion.' } },
    { truth: 1, dec: 1, t: { fr: 'Un coupable est condamné : bonne décision, probabilité = **puissance 1 − β**.', dar: 'Lmoujrim t7kem 3lih : qarar s7i7, l i7timal = **puissance 1 − β**.', en: 'A guilty person is convicted: right decision, probability = **power 1 − β**.' } },
    { truth: 0, dec: 0, t: { fr: 'Un innocent est acquitté : bonne décision, probabilité **1 − α**.', dar: 'Bri2 khrej bri2 : qarar s7i7, i7timal **1 − α**.', en: 'An innocent is acquitted: right decision, probability **1 − α**.' } }
  ],
  tradeoff: { fr: 'À n fixé, diminuer α augmente β : on ne peut pas réduire les deux erreurs à la fois, sauf en augmentant la taille de l\'échantillon n.', dar: 'B n tabet, ila n9essna α kaytzad β : ma ymkench n9essou bjouj f nefs lwe9t, ghir ila kebbarna n.', en: 'For a fixed n, lowering α raises β: you cannot reduce both errors at once, except by increasing the sample size n.' }
};

export const CHI = {
  title: { fr: 'Constructeur du test du χ² d\'ajustement', dar: 'Bnaa dyal test du χ² d\'ajustement', en: 'χ² goodness-of-fit builder' },
  steps: [
    { fr: '**1. Hypothèses** : H0 « X suit une loi normale » contre H1 « X ne suit pas une loi normale ». On estime µ par x̄ et σ par S (**p = 2 paramètres estimés**).', dar: '**1. Hypothèses** : H0 « X kaytb3 loi normale » vs H1 « X ma kaytb3ch loi normale ». Kanqddrou µ b x̄ w σ b S (**p = 2 paramètres**).', en: '**1. Hypotheses**: H0 "X follows a normal law" vs H1 "X does not". µ is estimated by x̄ and σ by S (**p = 2 estimated parameters**).' },
    { fr: '**2. Probabilités théoriques** pi de chaque classe : on centre-réduit les bornes avec x̄ et S, puis pi = Φ(b) − Φ(a).', dar: '**2. L i7timalat** pi dyal kol classe : kancentréw-réduisiw les bornes b x̄ w S, w men b3d pi = Φ(b) − Φ(a).', en: '**2. Theoretical probabilities** pi for each class: standardise the bounds with x̄ and S, then pi = Φ(b) − Φ(a).' },
    { fr: '**3. Effectifs théoriques** Ei = n·pi. Si un Ei est trop petit (< 5), on **regroupe** des classes voisines.', dar: '**3. Effectifs théoriques** Ei = n·pi. Ila chi Ei sghir bzaf (< 5), kan**jm3ou** classes 9rab.', en: '**3. Expected counts** Ei = n·pi. If an Ei is too small (< 5), **merge** neighbouring classes.' },
    { fr: '**4. Statistique** χ² = Σ (Oi − Ei)² / Ei : on additionne les contributions de chaque classe.', dar: '**4. Statistique** χ² = Σ (Oi − Ei)² / Ei : kanjm3ou contributions dyal kol classe.', en: '**4. Statistic** χ² = Σ (Oi − Ei)² / Ei: add up each class\'s contribution.' },
    { fr: '**5. Degrés de liberté** ν = k − p − 1 (k classes, p paramètres estimés) puis comparaison au seuil χ²(α ; ν) : si χ² > seuil, on rejette H0.', dar: '**5. Degrés de liberté** ν = k − p − 1 (k classes, p paramètres) w men b3d n9arnou m3a seuil χ²(α ; ν) : ila χ² > seuil, kanrfdou H0.', en: '**5. Degrees of freedom** ν = k − p − 1 (k classes, p estimated parameters), then compare with the threshold χ²(α; ν): if χ² > threshold, reject H0.' }
  ],
  classes: { fr: 'Classes', dar: 'Classes', en: 'Classes' },
  edit: { fr: 'Modifie les effectifs observés Oi pour voir l\'effet.', dar: 'Beddel Oi bach tchouf natija.', en: 'Edit the observed counts Oi to see the effect.' },
  small: { fr: 'Attention : un Ei < 5, il faudrait regrouper des classes.', dar: 'Rd balek : chi Ei < 5, khass tjm3 classes.', en: 'Warning: an Ei < 5, classes should be merged.' }
};

export const TYPES = {
  title: { fr: 'Les 5 types d\'analyse', dar: '5 anwa3 dyal analyse', en: 'The 5 types of analysis' },
  cards: [
    { id: 'desc', n: { fr: 'Descriptive', dar: 'Descriptive', en: 'Descriptive' }, q: { fr: 'Que s\'est-il passé ?', dar: 'Chnou wqe3 ?', en: 'What happened?' } },
    { id: 'expl', n: { fr: 'Exploratoire', dar: 'Exploratoire', en: 'Exploratory' }, q: { fr: 'Quelles structures cachées ?', dar: 'Chnou mkhbbi f data ?', en: 'What hidden structures?' } },
    { id: 'conf', n: { fr: 'Confirmatoire', dar: 'Confirmatoire', en: 'Confirmatory' }, q: { fr: 'L\'hypothèse est-elle vraie ?', dar: 'Wach hypothèse s7i7a ?', en: 'Is the hypothesis true?' } },
    { id: 'pred', n: { fr: 'Prédictive', dar: 'Prédictive', en: 'Predictive' }, q: { fr: 'Que va-t-il se passer ?', dar: 'Chnou ghaywqe3 ?', en: 'What will happen?' } },
    { id: 'presc', n: { fr: 'Prescriptive', dar: 'Prescriptive', en: 'Prescriptive' }, q: { fr: 'Que faut-il faire ?', dar: 'Chnou khassna ndirou ?', en: 'What should we do?' } }
  ],
  methods: [
    { m: { fr: 'Moyenne, variance', dar: 'Moyenne, variance', en: 'Mean, variance' }, a: 'desc' },
    { m: { fr: 'Graphiques (histogramme, barres)', dar: 'Graphiques (histogramme, barres)', en: 'Charts (histogram, bars)' }, a: 'desc' },
    { m: { fr: 'ACP', dar: 'ACP', en: 'PCA' }, a: 'expl' },
    { m: { fr: 'AFC', dar: 'AFC', en: 'CA (correspondence analysis)' }, a: 'expl' },
    { m: { fr: 'Clustering', dar: 'Clustering', en: 'Clustering' }, a: 'expl' },
    { m: { fr: 'Tests statistiques (Z, Student, χ²)', dar: 'Tests statistiques (Z, Student, χ²)', en: 'Statistical tests (Z, Student, χ²)' }, a: 'conf' },
    { m: { fr: 'Régression', dar: 'Régression', en: 'Regression' }, a: 'pred' },
    { m: { fr: 'Machine learning', dar: 'Machine learning', en: 'Machine learning' }, a: 'pred' },
    { m: { fr: 'Simulation', dar: 'Simulation', en: 'Simulation' }, a: 'presc' },
    { m: { fr: 'Optimisation', dar: 'Optimisation', en: 'Optimisation' }, a: 'presc' }
  ],
  done: { fr: 'Bravo, tout est bien classé !', dar: 'Bravo, kolchi f blasto !', en: 'Well done, everything is in place!' }
};

export const PIPE = {
  title: { fr: 'Les 5 étapes d\'une analyse de données', dar: '5 mara7il dyal analyse de données', en: 'The 5 steps of data analysis' },
  steps: [
    { n: { fr: 'Collecte', dar: 'Jm3', en: 'Collection' }, t: { fr: 'Rassembler les données : fichiers CSV/Excel, bases SQL, API, capteurs, questionnaires. Ex. santé : glycémie, âge, IMC de patients.', dar: 'Jm3 data : fichiers CSV/Excel, bases SQL, API, capteurs, questionnaires. Mithal sa7a : glycémie, 3mer, IMC dyal mrad.', en: 'Gather data: CSV/Excel files, SQL databases, APIs, sensors, surveys. Health example: patients\' blood sugar, age, BMI.' } },
    { n: { fr: 'Nettoyage', dar: 'Tnqiya', en: 'Cleaning' }, t: { fr: 'Valeurs manquantes (`na_values`), doublons, erreurs de saisie, types (`dtype`), séparateur décimal (`decimal=","`). Souvent la plus longue étape.', dar: 'Qiyam na9sin (`na_values`), doublons, akhta2 f ktaba, types (`dtype`), séparateur décimal (`decimal=","`). Ghaliban hiya atwal mar7ala.', en: 'Missing values (`na_values`), duplicates, typos, types (`dtype`), decimal separator (`decimal=","`). Often the longest step.' } },
    { n: { fr: 'Exploration', dar: 'Istikchaf', en: 'Exploration' }, t: { fr: 'Statistiques descriptives et graphiques (histogramme, boxplot, heatmap de corrélation) pour comprendre la distribution et les relations.', dar: 'Statistiques descriptives w graphiques (histogramme, boxplot, heatmap dyal corrélation) bach nfhmou distribution w l3ala9at.', en: 'Descriptive statistics and charts (histogram, boxplot, correlation heatmap) to understand distributions and relationships.' } },
    { n: { fr: 'Modélisation', dar: 'Modélisation', en: 'Modelling' }, t: { fr: 'Tests d\'hypothèses, régression, classification, clustering : construire un modèle qui explique ou prédit.', dar: 'Tests d\'hypothèses, régression, classification, clustering : nbniw modèle kayfesser wla kaytnba2.', en: 'Hypothesis tests, regression, classification, clustering: build a model that explains or predicts.' } },
    { n: { fr: 'Interprétation', dar: 'Tafsir', en: 'Interpretation' }, t: { fr: 'Traduire les résultats en conclusions et en **décisions** (rapport, visualisation claire, recommandations).', dar: 'Nbeddlou natayij l conclusions w **qararat** (rapport, visualisation wad7a, tawsiyat).', en: 'Turn results into conclusions and **decisions** (report, clear visuals, recommendations).' } }
  ]
};

export const CHART = {
  title: { fr: 'Quel graphique pour quel objectif ?', dar: 'Ach men graphique l ach men hadaf ?', en: 'Which chart for which goal?' },
  goals: [
    { id: 'comp', n: { fr: 'Comparer des catégories', dar: 'N9arnou catégories', en: 'Compare categories' }, ok: 'bar', okN: { fr: 'Barres (ou radar)', dar: 'Barres (wla radar)', en: 'Bars (or radar)' }, avoid: { fr: 'Camembert et 3D : l\'œil compare mal les angles et la 3D déforme les longueurs.', dar: 'Camembert w 3D : l3in ma kat9arnch mzyan zwaya, w 3D katbeddel toul.', en: 'Pie and 3D: the eye compares angles poorly and 3D distorts lengths.' } },
    { id: 'dist', n: { fr: 'Montrer une distribution', dar: 'Nwerriw distribution', en: 'Show a distribution' }, ok: 'hist', okN: { fr: 'Histogramme / boîte à moustaches / violon', dar: 'Histogramme / boxplot / violon', en: 'Histogram / box plot / violin' }, avoid: { fr: 'Courbe reliant des points non ordonnés : suggère une évolution qui n\'existe pas.', dar: 'Courbe kat9adda points machi mrattbin : katban b7al évolution w hiya ma kaynach.', en: 'A line joining unordered points: suggests a trend that does not exist.' } },
    { id: 'compo', n: { fr: 'Montrer une composition', dar: 'Nwerriw composition', en: 'Show a composition' }, ok: 'stack', okN: { fr: 'Barres empilées / treemap', dar: 'Barres empilées / treemap', en: 'Stacked bars / treemap' }, avoid: { fr: 'Camembert à 10 parts : illisible au-delà de 4–5 catégories.', dar: 'Camembert b 10 parts : ma yt9rach ktar mn 4–5 catégories.', en: 'A 10-slice pie: unreadable beyond 4–5 categories.' } },
    { id: 'rel', n: { fr: 'Relation entre variables', dar: 'L3ala9a bin variables', en: 'Relationship between variables' }, ok: 'scatter', okN: { fr: 'Nuage de points (scatter) / heatmap de corrélation', dar: 'Nuage de points (scatter) / heatmap dyal corrélation', en: 'Scatter plot / correlation heatmap' }, avoid: { fr: 'Barres côte à côte : cachent la forme de la relation.', dar: 'Barres jenb b jenb : katkhbbi chkl l3ala9a.', en: 'Side-by-side bars: hide the shape of the relationship.' } },
    { id: 'evo', n: { fr: 'Évolution dans le temps', dar: 'Tatawwor m3a lwe9t', en: 'Change over time' }, ok: 'line', okN: { fr: 'Courbe (ligne) / aire', dar: 'Courbe (ligne) / aire', en: 'Line / area' }, avoid: { fr: 'Échelle log injustifiée ou axe tronqué : exagère les variations.', dar: 'Échelle log bla sabab wla axe ma9tou3 : katkebber les variations.', en: 'Unjustified log scale or truncated axis: exaggerates changes.' } }
  ],
  rules: { fr: 'Règles d\'or : simplicité, clarté (titre, axes, unités), précision, couleurs accessibles, honnêteté.', dar: 'Qawa3id dhabiya : basata, wodo7 (titre, axes, unités), di9a, alwan accessibles, amana.', en: 'Golden rules: simplicity, clarity (title, axes, units), accuracy, accessible colours, honesty.' }
};

export const PANDAS = {
  title: { fr: 'Terrain de jeu pd.read_csv / read_excel', dar: 'Terrain dyal pd.read_csv / read_excel', en: 'pd.read_csv / read_excel playground' },
  pick: { fr: 'Choisis un fichier puis écris l\'appel pandas qui le lit correctement.', dar: 'Khtar fichier w kteb l appel pandas li y9rah mzyan.', en: 'Pick a file then write the pandas call that reads it correctly.' },
  cases: [
    { id: 'notes', file: 'notes.csv', hint: { fr: 'Fichier « standard » : virgule, point décimal, en-tête.', dar: 'Fichier « 3adi » : virgule, point décimal, en-tête.', en: '"Standard" file: comma, decimal point, header.' } },
    { id: 'decim', file: 'notes_decim.csv', hint: { fr: 'Séparateur `;` et virgule décimale (format français).', dar: 'Séparateur `;` w virgule décimale (format français).', en: '`;` separator and decimal comma (French format).' } },
    { id: 'h', file: 'notes_h.csv', hint: { fr: 'Pas de ligne d\'en-tête : la 1re ligne est déjà une donnée.', dar: 'Ma kaynch en-tête : ster lowel howa data.', en: 'No header line: the first line is already data.' } },
    { id: 'hs', file: 'notes_h_s.csv', hint: { fr: 'Une ligne de commentaire au début, puis pas d\'en-tête.', dar: 'Ster dyal commentaire f lowel, w men b3d bla en-tête.', en: 'A comment line first, then no header.' } },
    { id: 'xlsx', file: 'notes.xlsx (feuille notes_h_s)', hint: { fr: 'Classeur Excel : lire la feuille « notes_h_s » en sautant la 1re ligne.', dar: 'Classeur Excel : 9ra feuille « notes_h_s » w zid 3la ster lowel.', en: 'Excel workbook: read sheet "notes_h_s" skipping the first line.' } },
    { id: 'export', file: 'df → notes_export.csv', hint: { fr: 'Exporter le DataFrame en CSV standard **sans** la colonne d\'index.', dar: 'Export DataFrame l CSV standard **bla** colonne d\'index.', en: 'Export the DataFrame to a standard CSV **without** the index column.' } }
  ],
  ok: { fr: 'Paramètres corrects : voici le DataFrame obtenu.', dar: 'Paramètres s7a7 : hada DataFrame li tla3.', en: 'Correct parameters: here is the resulting DataFrame.' },
  bad: { fr: 'Résultat incorrect : regarde l\'aperçu, quelque chose cloche.', dar: 'Natija ghalta : chouf l aperçu, kayn chi mochkil.', en: 'Wrong result: look at the preview, something is off.' },
  show: { fr: 'Voir la réponse', dar: 'Chouf jawab', en: 'Show answer' },
  why: {
    sep: { fr: 'Sans `sep=";"`, toute la ligne tombe dans une seule colonne.', dar: 'Bla `sep=";"`, ster kaml kaytla3 f colonne wa7da.', en: 'Without `sep=";"`, each whole line ends up in a single column.' },
    decimal: { fr: 'Sans `decimal=","`, « 12,5 » reste du texte (dtype object) au lieu d\'un nombre.', dar: 'Bla `decimal=","`, « 12,5 » kayb9a texte (object) machi ra9m.', en: 'Without `decimal=","`, "12,5" stays text (object dtype) instead of a number.' },
    header: { fr: 'Sans `header=None`, la 1re ligne de données devient les noms de colonnes (une ligne perdue).', dar: 'Bla `header=None`, ster lowel dyal data kaywelli smiyat colonnes (ster kaydi3).', en: 'Without `header=None`, the first data row becomes the column names (one row lost).' },
    skiprows: { fr: 'Sans `skiprows=1`, la ligne de commentaire est lue comme une donnée.', dar: 'Bla `skiprows=1`, ster dyal commentaire kayt9ra b7al data.', en: 'Without `skiprows=1`, the comment line is read as data.' },
    sheet: { fr: '`sheet_name="notes_h_s"` (ou son numéro) choisit la feuille ; `sheet_name=None` lit toutes les feuilles dans un dict.', dar: '`sheet_name="notes_h_s"` (wla ra9mha) kaykhtar feuille ; `sheet_name=None` kay9ra ga3 feuilles f dict.', en: '`sheet_name="notes_h_s"` (or its number) picks the sheet; `sheet_name=None` reads all sheets into a dict.' },
    index: { fr: 'Sans `index=False`, pandas écrit une colonne d\'index 0, 1, 2… en plus.', dar: 'Bla `index=False`, pandas kayktb colonne d\'index 0, 1, 2… zayda.', en: 'Without `index=False`, pandas writes an extra 0, 1, 2… index column.' }
  }
};

export const MPL = {
  title: { fr: 'Matplotlib : procédural vs orienté objet', dar: 'Matplotlib : procédural vs orienté objet', en: 'Matplotlib: procedural vs object-oriented' },
  proc: { fr: 'Interface `pyplot` « à la MATLAB » : chaque appel agit sur la figure / les axes **courants** (état caché). Rapide pour un graphique simple, source d\'erreurs avec plusieurs sous-graphiques.', dar: 'Interface `pyplot` « b7al MATLAB » : kol appel kaykhdem 3la figure / axes **courants** (état mkhbbi). Sari3 l graphique sahel, walakin kaydir akhta2 m3a bzaf dyal subplots.', en: '`pyplot` "MATLAB-like" interface: each call acts on the **current** figure / axes (hidden state). Fast for a simple plot, error-prone with several subplots.' },
  oo: { fr: 'On récupère explicitement `fig` et `ax` puis on appelle les méthodes de l\'objet (`ax.set_title`, `ax.set_xlabel`). **Recommandé** : clair, réutilisable, indispensable avec `subplots(2, 2)`.', dar: 'Kanjibou `fig` w `ax` b wodo7 w kan3iyto l méthodes dyal objet (`ax.set_title`, `ax.set_xlabel`). **Mzyan** : wad7, kayt3awed, darouri m3a `subplots(2, 2)`.', en: 'Explicitly get `fig` and `ax`, then call the object\'s methods (`ax.set_title`, `ax.set_xlabel`). **Recommended**: clear, reusable, essential with `subplots(2, 2)`.' },
  same: { fr: 'Les deux produisent le même graphique :', dar: 'Bjouj kay3tiw nefs graphique :', en: 'Both produce the same chart:' },
  mapping: { fr: 'Correspondances', dar: 'Mo9abalat', en: 'Mapping' }
};

const t3 = (fr: string, dar: string, en: string) => ({ fr, dar, en });

/** Mean vs median on a number line, with the box plot (course IQR rule). */
export const SHAPE_MM = {
  title: t3('Moyenne, médiane et boîte à moustaches', 'Moyenne, médiane w boîte à moustaches', 'Mean, median and box plot'),
  hint: t3('Déplace la **dernière note** avec le curseur : la **moyenne** (triangle) suit la valeur extrême, la **médiane** (losange) bouge à peine. La boîte va de Q1 à Q3 ; un point **rouge** est hors de [Q1 − 1,5·IQR ; Q3 + 1,5·IQR].', 'Hrrek **akhir note** b curseur : **moyenne** (triangle) katmchi m3a l valeur extrême, **médiane** (losange) ma katt7errekch bzaf. Boîte mn Q1 l Q3 ; point **7mer** = aberrante.', 'Move the **last mark**: the **mean** (triangle) follows the extreme value, the **median** (diamond) barely moves. Box = Q1 to Q3; a **red** dot is outside [Q1 − 1.5·IQR, Q3 + 1.5·IQR].'),
  last: t3('Dernière note', 'Akhir note', 'Last mark'),
  mean: t3('Moyenne', 'Moyenne', 'Mean'),
  median: t3('Médiane', 'Médiane', 'Median'),
  outlier: t3('valeur aberrante', 'valeur aberrante', 'outlier'),
  lesson: t3('Avec une valeur aberrante, on préfère la **médiane** (robuste) pour résumer, et pour imputer les valeurs manquantes.', 'Ila kayna aberrante, **médiane** a7san (robuste), 7ta f imputation.', 'With an outlier, prefer the **median** (robust), also for imputation.')
};

/** Covariance seen as areas: the sign of (x − x̄)(y − ȳ) in each quadrant. */
export const SHAPE_COR = {
  title: t3('Covariance et corrélation : la géométrie', 'Covariance w corrélation : b chkal', 'Covariance and correlation: the geometry'),
  hint: t3('Les deux droites passent par le **point moyen** (x̄ ; ȳ). Chaque point dessine un rectangle jusqu\'à ce centre : **vert** si (x − x̄)(y − ȳ) > 0, **rouge** si < 0. La covariance est la **moyenne de ces aires signées** ; r la ramène entre −1 et 1.', 'Jouj stour kaydouzou mn **point moyen** (x̄ ; ȳ). Kol point kayrsem mostatil : **khdar** ila (x − x̄)(y − ȳ) > 0, **7mer** ila < 0. Covariance = **moyenne dyal had l mesa7at**.', 'Both lines go through the **mean point** (x̄, ȳ). Each point draws a rectangle to it: **green** if (x − x̄)(y − ȳ) > 0, **red** if < 0. Covariance = **mean of these signed areas**; r scales it to [−1, 1].'),
  sets: [t3('Forte positive', 'Qwiya positive', 'Strong positive'), t3('Négative', 'Négative', 'Negative'), t3('Nulle (nuage)', 'Walou (sa7ab)', 'None (cloud)'), t3('Non linéaire', 'Machi linéaire', 'Non-linear')],
  noise: t3('Bruit', 'Bruit', 'Noise'),
  line: t3('Droite des moindres carrés', 'Droite dyal moindres carrés', 'Least-squares line'),
  trap: t3('**r ≈ 0 ne veut pas dire « aucun lien »** : regarde le jeu « non linéaire » (parabole) — lien fort, mais pas linéaire.', '**r ≈ 0 machi « bla 3ala9a »** : chouf « non linéaire » — 3ala9a qwiya walakin machi linéaire.', '**r ≈ 0 does not mean "no link"**: see the non-linear set — strong link, not linear.')
};
