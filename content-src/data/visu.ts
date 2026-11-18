import { setCtx, L, h, p, code, tip, trap, exam, table, anim, quiz, single, multi, order, ex, fc, ref } from '../lib';
import type { Chapter } from '../../src/lib/schema';

setCtx('data', 'visu');

export const questions = [
  single('dv-01', 1, ['Quelle bibliothèque est la **fondation** de la visualisation en Python ?', 'Asas dyal visualisation ?', 'The **foundation** of Python plotting?'], ['Matplotlib', 'Seaborn', 'Plotly', 'Bokeh'], 0,
    ['Matplotlib est fondamental ; pandas (débutant) et Seaborn (intermédiaire) s\'appuient dessus ; Plotly/Bokeh (avancé, interactif).', 'Matplotlib.', 'Matplotlib; others build on it.'],
    [['Seaborn est construit sur Matplotlib.', 'Fou9 Matplotlib.', 'Built on Matplotlib.'], ['Plotly : niveau avancé, interactif.', 'Avancé.', 'Advanced.'], ['Bokeh : avancé, interactif.', 'Avancé.', 'Advanced.']], ['ecosysteme']),
  single('dv-02', 2, ['Quel style Matplotlib est **recommandé** ?', 'Ach men style mzyan ?', 'Which style is **recommended**?'], [['Orienté objet : fig, ax = plt.subplots()', 'Orienté objet', 'Object-oriented: fig, ax = plt.subplots()'], ['Procédural : plt.plot(), plt.title()', 'Procédural', 'Procedural'], ['Les deux sont interdits', 'Bjouj mamnou3', 'Both forbidden'], ['Uniquement pandas', 'Ghir pandas', 'Only pandas']], 0,
    ['L\'**orienté objet** manipule explicitement figure et axes (`ax.set_title`) : plus clair et indispensable avec plusieurs sous-graphiques.', 'Orienté objet.', '**OO** style is explicit and needed for subplots.'],
    [['Pratique mais repose sur un état caché (axes courants).', 'État mkhbbi.', 'Relies on hidden state.'], ['Faux.', 'Ghalat.', 'False.'], ['pandas utilise Matplotlib.', 'pandas = Matplotlib.', 'pandas uses Matplotlib.']], ['matplotlib']),
  single('dv-03', 2, ['En style orienté objet, quel est l\'équivalent de `plt.title("X")` ?', 'Équivalent plt.title ?', 'OO equivalent of plt.title?'], ['ax.set_title("X")', 'ax.title("X")', 'fig.title("X")', 'plt.ax.title("X")'], 0,
    ['plt.title → `ax.set_title`, plt.xlabel → `ax.set_xlabel`, plt.xlim → `ax.set_xlim`.', 'ax.set_title.', '`ax.set_title`.'],
    [['ax.title est un attribut, pas la méthode à appeler.', 'Attribut.', 'Attribute, not method.'], ['fig.suptitle existe pour le titre global.', 'suptitle.', 'fig.suptitle is the global title.'], ['N\'existe pas.', 'Ma kaynach.', 'Does not exist.']], ['matplotlib']),
  single('dv-04', 2, ['Pour comparer les ventes de 6 produits, quel graphique ?', 'N9arnou 6 produits ?', 'Compare sales of 6 products?'], [['Diagramme en barres', 'Barres', 'Bar chart'], ['Camembert 3D', 'Camembert 3D', '3D pie'], ['Nuage de points', 'Scatter', 'Scatter'], ['Courbe', 'Courbe', 'Line']], 0,
    ['**Comparaison** → barres (ou radar). À éviter : camembert et 3D (angles et perspective trompent l\'œil).', 'Barres.', '**Bars** for comparison.'],
    [['Double erreur : camembert + 3D.', 'Ghalat jouj.', 'Double mistake.'], ['Le scatter montre une relation entre 2 variables numériques.', 'Relation.', 'Relationship.'], ['La courbe suggère une évolution / un ordre.', 'Évolution.', 'Suggests trend.']], ['choix']),
  single('dv-05', 2, ['Pour montrer la **distribution** d\'une variable ?', 'Distribution ?', 'Show a **distribution**?'], [['Histogramme, boîte à moustaches ou violon', 'Histogramme, box, violon', 'Histogram, box or violin'], ['Camembert', 'Camembert', 'Pie'], ['Treemap', 'Treemap', 'Treemap'], ['Carte', 'Carte', 'Map']], 0,
    ['Distribution → histogramme, boxplot, violon (Seaborn : histplot, kdeplot, ecdfplot, boxplot).', 'Histogramme.', 'Histogram, box, violin.'],
    [['Le camembert montre des parts d\'un tout.', 'Parts.', 'Parts of a whole.'], ['La treemap montre une composition.', 'Composition.', 'Composition.'], ['Une carte montre des données spatiales.', 'Spatial.', 'Spatial data.']], ['choix']),
  single('dv-06', 1, ['Pour une **évolution dans le temps** ?', 'Évolution f lwe9t ?', 'Change **over time**?'], [['Courbe (ligne) ou aire', 'Courbe', 'Line or area'], ['Camembert', 'Camembert', 'Pie'], ['Histogramme', 'Histogramme', 'Histogram'], ['Heatmap', 'Heatmap', 'Heatmap']], 0,
    ['Évolution → ligne / aire.', 'Ligne.', 'Line / area.'], [['Pas de notion de temps.', 'Bla wa9t.', 'No time.'], ['Distribution.', 'Distribution.', 'Distribution.'], ['Relation / corrélation.', 'Corrélation.', 'Correlation.']], ['choix']),
  multi('dv-07', 2, ['Quelles sont des **erreurs** de visualisation citées dans le cours ?', 'Akhta2 ?', 'Visualisation **mistakes**?'], [['3D inutile', '3D bla sabab', 'Needless 3D'], ['Couleurs non accessibles', 'Alwan ma accessibles', 'Inaccessible colours'], ['Échelle log injustifiée', 'Log bla sabab', 'Unjustified log scale'], ['Surcharge d\'informations', 'Bzaf ma3loumat', 'Overload'], ['Titre et axes nommés', 'Titre w axes', 'Titled, labelled axes']], [0, 1, 2, 3],
    ['Erreurs : 3D inutile, couleurs non accessibles, log injustifié, surcharge, labels illisibles. Règles d\'or : simplicité, clarté, précision, couleurs, honnêteté.', 'Akhta2 w qawa3id.', 'Mistakes vs golden rules.'], [['C\'est une bonne pratique (clarté).', 'Mzyan.', 'Good practice.']], ['regles']),
  single('dv-08', 2, ['Que fait `ax.hist(x, bins=20, density=True)` ?', 'hist density=True ?', 'What does density=True do?'], [['Histogramme de 20 classes normalisé (aire totale = 1)', '20 classes, aire = 1', '20 bins, total area = 1'], ['20 histogrammes', '20 histogrammes', '20 histograms'], ['Histogramme cumulé', 'Cumulé', 'Cumulative'], ['Trie les données', 'Kaytri', 'Sorts data']], 0,
    ['`bins` = nombre de classes ; `density=True` normalise en densité ; `cumulative=True` donne l\'histogramme cumulé.', 'bins, density, cumulative.', '`bins`, `density`, `cumulative`.'],
    [['Un seul histogramme.', 'Wa7ed.', 'One histogram.'], ['C\'est cumulative=True.', 'cumulative.', 'That is cumulative=True.'], ['Aucun tri.', 'Walou.', 'No sorting.']], ['matplotlib']),
  single('dv-09', 2, ['Dans `ax.scatter(x, y, c=z, s=50, alpha=0.5, cmap="viridis")`, que règle `alpha` ?', 'alpha ?', 'What is alpha?'], ['La transparence des points', 'La taille des points', 'La couleur', 'Le nombre de points'], 0,
    ['`c` couleur (selon une variable), `s` taille, `alpha` **transparence** (utile si les points se superposent), `cmap` palette ; `fig.colorbar(...)` ajoute l\'échelle.', 'alpha = transparence.', '`alpha` = **transparency**.'],
    [['C\'est `s`.', 's.', 'That is s.'], ['C\'est `c` / `cmap`.', 'c.', 'c / cmap.'], ['Aucun paramètre ne fait ça.', 'Walou.', 'None.']], ['matplotlib']),
  single('dv-10', 2, ['Dans `ax.pie(parts, autopct="%1.1f%%", explode=e, startangle=90)`, que fait `autopct` ?', 'autopct ?', 'What does autopct do?'], [['Affiche le pourcentage sur chaque part', 'Pourcentage', 'Shows percentages'], ['Fait pivoter le camembert', 'Dwer', 'Rotates'], ['Détache une part', 'Fr9 part', 'Explodes a slice'], ['Trie les parts', 'Tri', 'Sorts slices']], 0,
    ['`autopct` pourcentages, `explode` détache des parts, `startangle` angle de départ.', 'autopct · explode · startangle.', '`autopct`, `explode`, `startangle`.'],
    [['C\'est startangle.', 'startangle.', 'startangle.'], ['C\'est explode.', 'explode.', 'explode.'], ['Aucun.', 'Walou.', 'None.']], ['matplotlib']),
  single('dv-11', 2, ['Créer une grille 2 × 2 de graphiques sans chevauchement ?', 'Grille 2 × 2 ?', 'A 2 × 2 grid without overlap?'], ['fig, axs = plt.subplots(2, 2) puis fig.tight_layout()', 'plt.figure(2, 2)', 'plt.grid(2, 2)', 'ax.subplots(4)'], 0,
    ['`plt.subplots(2, 2)` renvoie la figure et un tableau 2×2 d\'axes (`axs[0, 1]`…) ; `tight_layout()` ajuste les marges.', 'subplots + tight_layout.', '`subplots(2, 2)` + `tight_layout()`.'],
    [['plt.figure crée une figure vide.', 'Figure khawya.', 'Empty figure.'], ['plt.grid affiche un quadrillage.', 'Quadrillage.', 'Gridlines.'], ['N\'existe pas.', 'Ma kaynach.', 'Does not exist.']], ['matplotlib']),
  single('dv-12', 2, ['Enregistrer une figure en haute résolution pour un rapport ?', 'Haute résolution ?', 'High-resolution export?'], ['fig.savefig("graph.png", dpi=300)', 'plt.show(dpi=300)', 'fig.export("graph.png")', 'ax.save("graph")'], 0,
    ['`savefig` exporte en PNG, PDF, SVG, JPG ; `dpi=300` pour l\'impression. Réglages globaux : `plt.rcParams`.', 'savefig dpi=300.', '`savefig(dpi=300)`.'],
    [['show affiche, n\'enregistre pas.', 'Kaywerri.', 'Displays only.'], ['N\'existe pas.', 'Ma kaynach.', 'No.'], ['N\'existe pas.', 'Ma kaynach.', 'No.']], ['export']),
  single('dv-13', 3, ['Afficher la matrice de corrélation d\'un DataFrame `df` avec Seaborn, valeurs inscrites, palette divergente, en masquant le triangle supérieur ?', 'Heatmap corr ?', 'Correlation heatmap?'], ['sns.heatmap(df.corr(), annot=True, cmap="coolwarm", mask=np.triu(np.ones_like(df.corr(), dtype=bool)))', 'sns.heatmap(df, annot=False)', 'sns.histplot(df.corr())', 'plt.heatmap(df.corr())'], 0,
    ['`df.corr()` calcule la matrice ; `annot=True` inscrit les valeurs ; `cmap="coolwarm"` divergente (−1 bleu, +1 rouge) ; `mask=np.triu(...)` cache le triangle supérieur (redondant).', 'corr + annot + coolwarm + mask triu.', 'corr + annot + coolwarm + triu mask.'],
    [['Il faut la matrice de corrélation, pas les données brutes.', 'corr.', 'Need corr().'], ['histplot = distribution.', 'Distribution.', 'Distribution.'], ['plt n\'a pas de heatmap (c\'est Seaborn / imshow).', 'Seaborn.', 'Use Seaborn.']], ['seaborn']),
  multi('dv-14', 2, ['Quelles fonctions Seaborn montrent une **distribution** ?', 'Seaborn distribution ?', 'Seaborn distribution functions?'], ['histplot (kde=True)', 'kdeplot', 'ecdfplot', 'boxplot', 'lineplot'], [0, 1, 2, 3],
    ['histplot (avec courbe `kde=True`), kdeplot, ecdfplot, boxplot ; lineplot sert aux évolutions/relations.', 'histplot, kdeplot, ecdfplot, boxplot.', 'histplot, kdeplot, ecdfplot, boxplot.'], [['lineplot montre une tendance.', 'Tendance.', 'Trend.']], ['seaborn']),
  single('dv-15', 2, ['`sns.scatterplot(data=tips, x="total_bill", y="tip", hue="sex")` : que fait `hue` ?', 'hue ?', 'What is hue?'], [['Colore les points selon la variable sex', 'Lwan 3la 7sab sex', 'Colours points by sex'], ['Change la taille', 'Taille', 'Size'], ['Filtre les femmes', 'Filtre', 'Filters'], ['Trie', 'Tri', 'Sorts']], 0,
    ['`hue` = couleur selon une variable catégorielle ; `relplot(..., col="time")` crée des sous-graphiques par catégorie.', 'hue = couleur.', '`hue` = colour by category.'], [['C\'est size.', 'size.', 'size.'], ['Aucun filtre.', 'Walou.', 'No filter.'], ['Aucun tri.', 'Walou.', 'No sort.']], ['seaborn']),
  single('dv-16', 1, ['Avec pandas, tracer directement une colonne ?', 'pandas plot ?', 'Plot a column with pandas?'], ['df["ventes"].plot()', 'pd.plot(df)', 'df.draw("ventes")', 'plt.pandas(df)'], 0,
    ['`df.plot()`, `df.hist()`, `df.plot.box()`, `df.plot.area()`, `df.plot.scatter(x=…, y=…)` — appellent Matplotlib.', 'df.plot.', '`df.plot` family.'], [['N\'existe pas.', 'Ma kaynach.', 'No.'], ['N\'existe pas.', 'Ma kaynach.', 'No.'], ['N\'existe pas.', 'Ma kaynach.', 'No.']], ['pandas-plot']),
  order('dv-17', 2, ['Remets dans l\'ordre le workflow de visualisation.', 'Rttab workflow.', 'Order the visualisation workflow.'], [['Exploration', 'Istikchaf', 'Exploration'], ['Analyse', 'Ta7lil', 'Analysis'], ['Présentation', 'Taqdim', 'Presentation'], ['Validation', 'Tsdi9', 'Validation'], ['Export', 'Export', 'Export']],
    ['Exploration (graphiques rapides) → analyse → présentation (graphique soigné) → validation (relecture, honnêteté) → export (PNG/PDF/SVG).', 'Workflow.', 'Workflow.'], ['workflow']),
  single('dv-18', 3, ['Un graphique de barres dont l\'axe Y commence à 95 au lieu de 0 pour des valeurs 96 à 100 viole surtout quelle règle ?', 'Axe Y mn 95 : ach men qa3ida ?', 'Y axis starting at 95: which rule is broken?'], ['Honnêteté', 'Couleurs', 'Simplicité', 'Export'], 0,
    ['Tronquer l\'axe des barres **exagère** les différences : faute d\'**honnêteté** (et de précision).', 'Amana.', '**Honesty**.'],
    [['Les couleurs ne sont pas en cause.', 'Machi alwan.', 'Not colours.'], ['Le graphique peut rester simple.', 'Basit.', 'Can be simple.'], ['Sans rapport.', 'Walou.', 'Unrelated.']], ['regles'])
];

export const chapter: Chapter = {
  id: 'visu',
  module: 'data',
  order: 3,
  title: L(['Chap 4 — Visualisation des données', 'Fasl 4 — Visualisation', 'Ch. 4 — Data visualisation']),
  summary: L(['Pourquoi visualiser, écosystème Python, Matplotlib procédural vs orienté objet, principaux graphiques, règles d\'or, choisir le bon graphique, export, Seaborn et pandas.', 'Matplotlib, Seaborn, choix, règles.', 'Why visualise, ecosystem, Matplotlib styles, main charts, rules, choosing, export, Seaborn, pandas.']),
  estimatedMinutes: 50,
  sections: [
    h(['Pourquoi visualiser ?', '3lach visualisation ?', 'Why visualise?']),
    p(['Un graphique révèle en un coup d\'œil tendances, écarts, valeurs aberrantes et relations qu\'un tableau de chiffres cache. Écosystème Python : **Matplotlib** (fondamental), **pandas** (débutant, `df.plot`), **Seaborn** / Altair (intermédiaire, statistique), **Plotly** / Bokeh (avancé, interactif).', 'Graphique kaywerri tendances. Matplotlib, pandas, Seaborn, Plotly.', 'Charts reveal trends and outliers. Ecosystem: Matplotlib (core), pandas (beginner), Seaborn/Altair (intermediate), Plotly/Bokeh (advanced).']),
    quiz('dv-01'),
    h(['Deux styles Matplotlib', 'Jouj styles', 'Two Matplotlib styles']),
    anim('MatplotlibStyles'),
    quiz('dv-02', 'dv-03'),
    h(['Les graphiques de base', 'Graphiques', 'Basic charts']),
    code(`fig, axs = plt.subplots(2, 2, figsize=(10, 8))
axs[0, 0].plot(x, y, marker="o")                         # courbe
sc = axs[0, 1].scatter(x, y, c=z, s=40, alpha=0.6, cmap="viridis")
fig.colorbar(sc, ax=axs[0, 1])                           # échelle de couleurs
axs[1, 0].hist(data, bins=20, density=True)              # cumulative=True : cumulé
axs[1, 1].pie(parts, autopct="%1.1f%%", explode=(0.1, 0, 0), startangle=90)
fig.tight_layout()
fig.savefig("tableau.png", dpi=300)                      # PNG, PDF, SVG, JPG`, 'python'),
    code(`import numpy as np
x = np.arange(3); w = 0.35
ax.bar(x - w/2, ventes_2024, w, label="2024")            # barres groupées
ax.bar(x + w/2, ventes_2025, w, label="2025")
ax.set_xticks(x, ["A", "B", "C"]); ax.legend()`, 'python', ['Diagramme en barres groupé', 'Barres groupées', 'Grouped bar chart']),
    quiz('dv-08', 'dv-09', 'dv-10', 'dv-11'),
    h(['Règles d\'or et erreurs', 'Qawa3id w akhta2', 'Golden rules and mistakes']),
    p(['**Règles d\'or** : simplicité, clarté (titre, axes, unités, légende), précision, couleurs adaptées et accessibles, **honnêteté** (pas d\'axe tronqué trompeur).\n\n**Erreurs fréquentes** : 3D inutile, couleurs non accessibles (rouge/vert), échelle logarithmique injustifiée, surcharge d\'informations, labels illisibles.', 'Qawa3id : basata, wodo7, di9a, alwan, amana. Akhta2 : 3D, alwan, log, bzaf, labels.', '**Rules**: simplicity, clarity, accuracy, colours, honesty. **Mistakes**: 3D, inaccessible colours, unjustified log, overload, unreadable labels.']),
    trap(['Le camembert est à éviter pour **comparer** (et la 3D partout).', 'Camembert ma ynsa7ch l comparaison.', 'Avoid pies for **comparison**.']),
    quiz('dv-07', 'dv-18'),
    h(['Quel graphique pour quel objectif ?', 'Ach men graphique ?', 'Which chart for which goal?']),
    table([['Objectif', 'Hadaf', 'Goal'], ['Recommandé', 'Mzyan', 'Recommended'], ['À éviter', 'Tjenneb', 'Avoid']], [
      [['Comparaison', 'Mo9arana', 'Comparison'], ['barres, radar', 'barres, radar', 'bars, radar'], ['camembert, 3D', 'camembert, 3D', 'pie, 3D']],
      [['Distribution', 'Distribution', 'Distribution'], ['histogramme, boîte, violon', 'histogramme, box, violon', 'histogram, box, violin'], ['—', '—', '—']],
      [['Composition', 'Composition', 'Composition'], ['barres empilées, treemap', 'empilées, treemap', 'stacked bars, treemap'], ['—', '—', '—']],
      [['Relation', '3ala9a', 'Relationship'], ['nuage de points, ligne, heatmap', 'scatter, ligne, heatmap', 'scatter, line, heatmap'], ['—', '—', '—']],
      [['Évolution', 'Tatawwor', 'Change over time'], ['ligne, aire', 'ligne, aire', 'line, area'], ['—', '—', '—']],
      [['Spatial', 'Makani', 'Spatial'], ['cartes', 'cartes', 'maps'], ['—', '—', '—']]
    ]),
    anim('ChartChooser'),
    exam(['Le tableau objectif → graphique est une question de cours classique.', 'Tableau dyal choix kaytl3.', 'The goal → chart table is a classic question.']),
    quiz('dv-04', 'dv-05', 'dv-06'),
    h(['Workflow, export et réglages', 'Workflow w export', 'Workflow, export, settings']),
    p(['Workflow : **exploration → analyse → présentation → validation → export**. Export : `savefig` en PNG, PDF, SVG, JPG (`dpi=300` pour l\'impression). Réglages globaux : `plt.rcParams["font.size"] = 12`.', 'Workflow ; savefig ; rcParams.', 'Workflow; savefig; rcParams.']),
    quiz('dv-12', 'dv-17'),
    h(['Seaborn et pandas', 'Seaborn w pandas', 'Seaborn and pandas']),
    code(`import seaborn as sns
tips = sns.load_dataset("tips"); iris = sns.load_dataset("iris"); fmri = sns.load_dataset("fmri")
sns.histplot(data=tips, x="total_bill", kde=True)
sns.kdeplot(data=tips, x="total_bill") ; sns.ecdfplot(data=tips, x="total_bill")
sns.boxplot(data=tips, x="day", y="total_bill")
sns.scatterplot(data=tips, x="total_bill", y="tip", hue="sex")
sns.lineplot(data=fmri, x="timepoint", y="signal")
sns.relplot(data=tips, x="total_bill", y="tip", col="time")
corr = iris.drop(columns="species").corr()
mask = np.triu(np.ones_like(corr, dtype=bool))
sns.heatmap(corr, annot=True, cmap="coolwarm", mask=mask)

df.plot() ; df.hist() ; df.plot.box() ; df.plot.area() ; df.plot.scatter(x="a", y="b")`, 'python'),
    tip(['`hue` colore par catégorie, `col` crée un sous-graphique par catégorie (`relplot`).', 'hue ; col.', '`hue` colours; `col` facets.']),
    quiz('dv-13', 'dv-14', 'dv-15')
  ],
  keyPoints: [
    L(['Écosystème : Matplotlib (fondamental), pandas (débutant), Seaborn/Altair (intermédiaire), Plotly/Bokeh (avancé).', 'Écosystème.', 'Ecosystem.']),
    L(['Orienté objet recommandé : fig, ax = plt.subplots() ; ax.set_title / set_xlabel ; subplots(2, 2) + tight_layout().', 'fig, ax ; ax.set_*.', 'OO style recommended.']),
    L(['plot, scatter (c, s, alpha, cmap, colorbar), hist (bins, cumulative, density), bar groupé, pie (autopct, explode, startangle).', 'Graphiques.', 'Basic charts and parameters.']),
    L(['Règles d\'or : simplicité, clarté, précision, couleurs, honnêteté. Erreurs : 3D, couleurs, log injustifié, surcharge, labels.', 'Qawa3id.', 'Golden rules and mistakes.']),
    L(['Comparaison : barres (pas camembert/3D) ; distribution : histogramme/boîte/violon ; composition : empilé/treemap ; relation : scatter/heatmap ; évolution : ligne/aire ; spatial : cartes.', 'Choix.', 'Goal → chart.']),
    L(['Workflow : exploration → analyse → présentation → validation → export ; savefig(dpi=300) ; rcParams.', 'Workflow.', 'Workflow & export.']),
    L(['Seaborn : histplot(kde), kdeplot, ecdfplot, boxplot, scatterplot(hue), lineplot, relplot(col), heatmap(corr, annot, cmap coolwarm, mask triu) ; datasets tips, iris, fmri.', 'Seaborn.', 'Seaborn functions.'])
  ]
};

export const exercises = [
  ex('dx-v-1', 2, ['Du procédural à l\'orienté objet', 'Procédural → OO', 'Procedural to OO'],
    ['Réécris en style orienté objet : `plt.figure(); plt.plot(x, y); plt.title("CA"); plt.xlabel("Mois"); plt.ylabel("MAD"); plt.xlim(1, 12); plt.savefig("ca.png")`.', 'Réécris b OO.', 'Rewrite in OO style.'],
    [['plt.xxx → ax.set_xxx ; savefig → fig.savefig.', 'ax.set_*.', 'ax.set_*.']],
    [{ t: ['Solution', 'Solution', 'Solution'], b: ['', '', ''], code: 'fig, ax = plt.subplots()\nax.plot(x, y)\nax.set_title("CA")\nax.set_xlabel("Mois")\nax.set_ylabel("MAD")\nax.set_xlim(1, 12)\nfig.savefig("ca.png", dpi=300)' }],
    ['`fig, ax = plt.subplots()` puis méthodes `ax.set_*` et `fig.savefig`.', 'OO.', 'See code.'],
    [['Écrire `ax.title("CA")`.', 'ax.title.', 'Writing `ax.title("CA")`.']]),
  ex('dx-v-2', 3, ['Tableau de bord 2 × 2', 'Tableau 2 × 2', '2 × 2 dashboard'],
    ['Avec le dataset `tips`, construis une figure 2 × 2 : distribution de `total_bill`, relation `total_bill`/`tip` colorée par `sex`, pourboire moyen par jour (barres), et boîte `total_bill` par `day`. Exporte en PDF.', 'Dashboard tips.', 'Build a 2×2 tips dashboard.'],
    [['sns.* accepte un paramètre ax=.', 'ax=.', 'Pass ax= to seaborn.']],
    [{ t: ['Code', 'Code', 'Code'], b: ['', '', ''], code: 'tips = sns.load_dataset("tips")\nfig, axs = plt.subplots(2, 2, figsize=(10, 8))\nsns.histplot(data=tips, x="total_bill", kde=True, ax=axs[0, 0])\nsns.scatterplot(data=tips, x="total_bill", y="tip", hue="sex", ax=axs[0, 1])\ntips.groupby("day")["tip"].mean().plot.bar(ax=axs[1, 0])\nsns.boxplot(data=tips, x="day", y="total_bill", ax=axs[1, 1])\nfig.tight_layout()\nfig.savefig("tips.pdf")' }],
    ['Une figure 2 × 2 cohérente (distribution, relation, comparaison, distribution par groupe) exportée en PDF.', 'Figure 2 × 2.', '2 × 2 figure exported to PDF.'],
    [['Camembert pour comparer les jours.', 'Camembert.', 'Pie to compare days.'], ['Oublier tight_layout (titres qui se chevauchent).', 'tight_layout.', 'Missing tight_layout.']]),
  ex('dx-v-3', 2, ['Critiquer un graphique', 'Naqd graphique', 'Critique a chart'],
    ['Un rapport présente : un camembert 3D à 9 parts pour comparer les ventes de 9 régions, en rouge/vert, sans titre ni légende lisible. Liste les erreurs et propose une alternative.', 'Akhta2 w badil.', 'List mistakes and propose an alternative.'],
    [['Utilise les règles d\'or.', 'Qawa3id.', 'Use the golden rules.']],
    [{ t: ['Erreurs', 'Akhta2', 'Mistakes'], b: ['3D inutile (déforme), camembert pour comparer, trop de parts (surcharge), rouge/vert non accessible, pas de titre/labels (clarté).', 'Kolchi.', 'All of them.'] },
     { t: ['Alternative', 'Badil', 'Alternative'], b: ['Barres horizontales triées, une couleur (ou palette accessible), titre, axe des ventes avec unité, valeurs affichées.', 'Barres.', 'Sorted horizontal bars.'], code: 'ventes.sort_values().plot.barh(title="Ventes par région (MAD)")' }],
    ['Remplacer par un diagramme en barres trié, clair et accessible.', 'Barres.', 'Use a sorted bar chart.'],
    [['Garder le camembert en 2D (toujours mauvais pour 9 catégories).', 'Camembert 2D.', 'A 2D pie is still bad.']])
];

export const flashcards = [
  fc('fc-dv-1', ['Écosystème de visualisation ?', 'Écosystème ?', 'Ecosystem?'], ['Matplotlib (fondamental), pandas (débutant), Seaborn/Altair (intermédiaire), Plotly/Bokeh (avancé).', 'Matplotlib, pandas, Seaborn, Plotly.', 'Matplotlib, pandas, Seaborn, Plotly.']),
  fc('fc-dv-2', ['Style recommandé ?', 'Style ?', 'Recommended style?'], ['Orienté objet : `fig, ax = plt.subplots()`.', 'OO.', 'OO: `fig, ax = plt.subplots()`.']),
  fc('fc-dv-3', ['plt.title en OO ?', 'plt.title ?', 'plt.title in OO?'], ['`ax.set_title()` (set_xlabel, set_xlim…)', 'ax.set_title', '`ax.set_title()`']),
  fc('fc-dv-4', ['scatter : c, s, alpha, cmap ?', 'scatter ?', 'scatter params?'], ['couleur, taille, transparence, palette (+ fig.colorbar).', 'Lwan, taille, transparence, palette.', 'colour, size, transparency, colormap.']),
  fc('fc-dv-5', ['hist : bins, density, cumulative ?', 'hist ?', 'hist params?'], ['nombre de classes, normaliser, cumuler.', 'Classes, normaliser, cumuler.', 'bins, normalise, cumulate.']),
  fc('fc-dv-6', ['pie : autopct, explode, startangle ?', 'pie ?', 'pie params?'], ['pourcentages, détacher, angle de départ.', '%, fr9, angle.', 'percentages, explode, start angle.']),
  fc('fc-dv-7', ['Grille 2 × 2 ?', 'Grille ?', '2 × 2 grid?'], ['`fig, axs = plt.subplots(2, 2)` + `fig.tight_layout()`', 'subplots(2,2)', '`subplots(2, 2)` + `tight_layout()`']),
  fc('fc-dv-8', ['Règles d\'or ?', 'Qawa3id ?', 'Golden rules?'], ['Simplicité, clarté, précision, couleurs, honnêteté.', 'Basata, wodo7, di9a, alwan, amana.', 'Simplicity, clarity, accuracy, colours, honesty.']),
  fc('fc-dv-9', ['Comparer des catégories ?', 'Mo9arana ?', 'Compare categories?'], ['Barres (radar) ; éviter camembert et 3D.', 'Barres.', 'Bars; avoid pie/3D.']),
  fc('fc-dv-10', ['Distribution · composition · relation · évolution ?', 'Choix ?', 'Chart choice?'], ['histogramme/boîte/violon · empilé/treemap · scatter/heatmap · ligne/aire', 'Choix.', 'hist/box/violin · stacked/treemap · scatter/heatmap · line/area']),
  fc('fc-dv-11', ['Workflow ?', 'Workflow ?', 'Workflow?'], ['Exploration → analyse → présentation → validation → export.', 'Workflow.', 'Exploration → analysis → presentation → validation → export.']),
  fc('fc-dv-12', ['Export haute qualité ?', 'Export ?', 'Export?'], ['`fig.savefig("f.png", dpi=300)` (PNG, PDF, SVG, JPG).', 'savefig dpi=300.', '`savefig(dpi=300)`.']),
  fc('fc-dv-13', ['Heatmap de corrélation Seaborn ?', 'Heatmap ?', 'Correlation heatmap?'], ['`sns.heatmap(df.corr(), annot=True, cmap="coolwarm", mask=np.triu(...))`', 'heatmap corr.', 'heatmap of corr.']),
  fc('fc-dv-14', ['Datasets Seaborn du cours ?', 'Datasets ?', 'Course datasets?'], ['tips, iris, fmri (`sns.load_dataset`).', 'tips, iris, fmri.', 'tips, iris, fmri.'])
];

export const reference = [
  ref('r-dv-1', 'fig, ax = plt.subplots() · ax.set_title/xlabel/ylabel/xlim', ['Style orienté objet', 'OO', 'OO style']),
  ref('r-dv-2', 'ax.plot · ax.scatter(c, s, alpha, cmap) · fig.colorbar', ['Courbe · nuage de points', 'Courbe · scatter', 'Line · scatter']),
  ref('r-dv-3', 'ax.hist(bins, density, cumulative) · ax.bar · ax.pie(autopct, explode, startangle)', ['Histogramme · barres · camembert', 'Hist · barres · pie', 'Histogram · bars · pie']),
  ref('r-dv-4', 'plt.subplots(2, 2) · fig.tight_layout()', ['Grille de graphiques', 'Grille', 'Grid']),
  ref('r-dv-5', 'fig.savefig("f.png", dpi=300) · plt.rcParams', ['Export · réglages', 'Export', 'Export · settings']),
  ref('r-dv-6', 'sns.histplot(kde=True) · kdeplot · ecdfplot · boxplot', ['Distributions Seaborn', 'Distributions', 'Seaborn distributions']),
  ref('r-dv-7', 'sns.scatterplot(hue) · lineplot · relplot(col)', ['Relations Seaborn', 'Relations', 'Seaborn relations']),
  ref('r-dv-8', 'sns.heatmap(corr, annot=True, cmap="coolwarm", mask=np.triu(...))', ['Matrice de corrélation', 'Corrélation', 'Correlation matrix']),
  ref('r-dv-9', 'df.plot() · df.hist() · df.plot.box/area/scatter', ['Graphiques pandas', 'pandas', 'pandas plots'])
];
