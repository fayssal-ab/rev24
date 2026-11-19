import { L, h, p, def, plain, steps, tip, trap, exam, table, code, anim, quiz } from '../../lib';
import type { Chapter } from '../../../src/lib/schema';

/** Chap 4 — Visualisation des données (Pr. A. Kadiri, 26 octobre 2026). */
export const chapter: Chapter = {
  id: 'visu',
  module: 'data',
  order: 5,
  title: L(['Chap 4 — Visualisation des données', 'Fasl 4 — Visualisation dyal data', 'Ch. 4 — Data visualisation']),
  summary: L([
    'Pourquoi visualiser, l\'écosystème Python, l\'architecture de Matplotlib (Figure / Axes), les deux styles, les graphiques de base, les subplots, les bonnes pratiques, le choix du graphique, l\'export, Seaborn et la visualisation avec pandas.',
    '3lach nrsmou, l écosystème Python, architecture dyal Matplotlib (Figure / Axes), jouj styles, graphiques de base, subplots, bonnes pratiques, khtiyar l graphique, export, Seaborn w pandas.',
    'Why visualise, the Python ecosystem, Matplotlib\'s architecture (Figure / Axes), the two styles, basic charts, subplots, good practice, choosing a chart, export, Seaborn and plotting with pandas.'
  ]),
  estimatedMinutes: 45,
  sections: [
    h(['1. Pourquoi visualiser les données ?', '1. 3lach nrsmou data ?', '1. Why visualise data?']),
    p([
      'Le cours donne **5 raisons** :\n1. **Compréhension rapide** des patterns et tendances ;\n2. **Détection d\'anomalies** et de valeurs aberrantes ;\n3. **Communication efficace** des résultats ;\n4. **Validation d\'hypothèses** statistiques ;\n5. **Aide à la décision** basée sur les données.',
      'Dars kay3ti **5 asbab** :\n1. **Tfhem b zerba** patterns w tendances ;\n2. **Tkchef anomalies** w valeurs aberrantes ;\n3. **Tbligh natija** b wodou7 ;\n4. **Tvalidi hypothèses** statistiques ;\n5. **T3awen f l qarar** mbni 3la data.',
      'The course gives **5 reasons**:\n1. **Quick understanding** of patterns and trends;\n2. **Detecting anomalies** and outliers;\n3. **Communicating results** effectively;\n4. **Validating** statistical hypotheses;\n5. **Supporting data-driven decisions**.'
    ]),
    plain(['Un tableau de 1 000 lignes, personne ne le lit. Un histogramme de ces 1 000 valeurs se comprend en 2 secondes. Visualiser, c\'est **traduire des chiffres en image** pour le cerveau.', 'Tableau fih 1 000 str, 7ta wa7ed ma ghay9rah. Histogramme dyal 1 000 qima katfhmo f 2 thawani. Visualisation = **ttarjem l arqam l tswira** l l mokh.', 'Nobody reads a 1,000-row table. A histogram of those values is understood in 2 seconds. Visualising means **translating numbers into a picture** for the brain.']),
    quiz('dv-01'),

    h(['2. L\'écosystème Python pour la visualisation', '2. L écosystème Python', '2. The Python visualisation ecosystem']),
    table([['Bibliothèque', 'Bibliothèque', 'Library'], ['Utilisation principale', 'Fach katsta3mel', 'Main use'], ['Niveau', 'Mostawa', 'Level']], [
      ['Matplotlib', ['Graphiques 2D de base', 'Graphiques 2D asasiyin', 'Basic 2D charts'], ['Fondamental', 'Asasi', 'Fundamental']],
      ['Pandas', ['Exploration rapide', 'Exploration b zerba', 'Quick exploration'], ['Débutant', 'Mobtadi2', 'Beginner']],
      ['Altair', ['Visualisation déclarative', 'Déclarative', 'Declarative'], ['Intermédiaire', 'Moutawassit', 'Intermediate']],
      ['Seaborn', ['Visualisation statistique', 'Statistique', 'Statistical'], ['Intermédiaire', 'Moutawassit', 'Intermediate']],
      ['Plotly', ['Graphiques interactifs', 'Interactifs', 'Interactive'], ['Avancé', 'Motaqaddim', 'Advanced']],
      ['Bokeh', ['Applications web', 'Applications web', 'Web apps'], ['Avancé', 'Motaqaddim', 'Advanced']]
    ]),
    code('pip install matplotlib seaborn pandas plotly bokeh altair', 'bash'),

    h(['3. Matplotlib : architecture et deux styles', '3. Matplotlib : architecture w jouj styles', '3. Matplotlib: architecture and two styles']),
    def([
      'Matplotlib est organisé en couches. Les deux objets à retenir : la **Figure** = toute la « feuille » (la fenêtre, l\'image exportée) ; un **Axes** = **un** graphique à l\'intérieur (avec ses axes x/y, son titre, sa légende). Une Figure peut contenir plusieurs Axes (subplots).',
      'Matplotlib mrtteb f couches. Jouj objets mohimmin : **Figure** = l « werqa » kamla (fenêtre, image) ; **Axes** = graphique **wa7ed** dakhelha (b axes x/y, titre, légende). Figure t9der ykoun fiha bzaf d Axes (subplots).',
      'Matplotlib is built in layers. Two objects to remember: the **Figure** = the whole "sheet" (window, exported image); an **Axes** = **one** chart inside it (with its x/y axes, title, legend). A Figure can hold several Axes (subplots).'
    ]),
    table([['Critère', 'Mi3yar', 'Criterion'], ['Style MATLAB (procédural)', 'Style MATLAB', 'MATLAB style (procedural)'], ['Style orienté objet (recommandé)', 'Style objet (recommandé)', 'Object-oriented style (recommended)']], [
      [['Création', 'Création', 'Creation'], ['`plt.figure()` puis `plt.subplot(2, 1, 1)`', '`plt.figure()` w `plt.subplot(...)`', '`plt.figure()` then `plt.subplot(2, 1, 1)`'], ['`fig, (ax1, ax2) = plt.subplots(2, 1)`', '`fig, (ax1, ax2) = plt.subplots(2, 1)`', '`fig, (ax1, ax2) = plt.subplots(2, 1)`']],
      [['Tracer', 'Rsem', 'Draw'], ['`plt.plot(x, y)`', '`plt.plot(x, y)`', '`plt.plot(x, y)`'], ['`ax1.plot(x, y)`', '`ax1.plot(x, y)`', '`ax1.plot(x, y)`']],
      [['Titre', 'Titre', 'Title'], ['`plt.title(\'…\')`', '`plt.title(\'…\')`', '`plt.title(\'…\')`'], ['`ax1.set_title(\'…\')`', '`ax1.set_title(\'…\')`', '`ax1.set_title(\'…\')`']],
      [['Mise en page', 'Mise en page', 'Layout'], ['`plt.tight_layout()`', '`plt.tight_layout()`', '`plt.tight_layout()`'], ['`fig.tight_layout()`', '`fig.tight_layout()`', '`fig.tight_layout()`']]
    ]),
    trap(['En orienté objet, les fonctions prennent **`set_`** : `ax.set_title`, `ax.set_xlabel`, `ax.set_ylabel`, `ax.set_xticks`. Écrire `ax.title("…")` est une erreur classique au contrôle.', 'F style objet, les fonctions fihom **`set_`** : `ax.set_title`, `ax.set_xlabel`… Ktba `ax.title("…")` ghalat classique.', 'In OO style the methods start with **`set_`**: `ax.set_title`, `ax.set_xlabel`, `ax.set_ylabel`. Writing `ax.title("…")` is a classic test mistake.']),
    anim('MatplotlibStyles'),
    quiz('dv-02', 'dv-03'),

    h(['4. Les graphiques de base', '4. Graphiques de base', '4. Basic charts']),
    steps(['Le graphique linéaire du cours, ligne par ligne', 'Graphique linéaire dyal dars, str b str', 'The course line chart, line by line'], [
      { t: ['Préparer les données', 'Wjjed data', 'Prepare the data'], b: ['`np.linspace(0, 4*np.pi, 100)` crée **100 points régulièrement espacés** entre 0 et 4π.', '`linspace` kaysayb **100 n9ta** bin 0 w 4π.', '`np.linspace(0, 4*np.pi, 100)` creates **100 evenly spaced points** between 0 and 4π.'], code: 'import numpy as np\nimport matplotlib.pyplot as plt\nx = np.linspace(0, 4*np.pi, 100)\ny1 = np.sin(x)\ny2 = np.cos(x)' },
      { t: ['Créer la figure et l\'axe', 'Sayb figure w axe', 'Create figure and axes'], b: ['`figsize=(10, 4)` = largeur 10 pouces, hauteur 4.', '`figsize=(10, 4)` = 3ard 10, tol 4.', '`figsize=(10, 4)` = width 10 in, height 4.'], code: 'fig, ax = plt.subplots(figsize=(10, 4))' },
      { t: ['Tracer les deux courbes', 'Rsem jouj courbes', 'Draw both curves'], b: ['`\'b-\'` = bleu trait plein, `\'r--\'` = rouge pointillés ; `label` sert à la légende.', '`\'b-\'` = zre9 khatt, `\'r--\'` = 7mer pointillés.', '`\'b-\'` = solid blue, `\'r--\'` = dashed red; `label` feeds the legend.'], code: "ax.plot(x, y1, 'b-', label='sin(x)', linewidth=2)\nax.plot(x, y2, 'r--', label='cos(x)', linewidth=2)" },
      { t: ['Habiller', 'Lbbes', 'Dress it'], b: ['Axes nommés, titre, légende, grille légère.', 'Smiyat, titre, légende, grille.', 'Axis names, title, legend, light grid.'], code: "ax.set_xlabel('x')\nax.set_ylabel('y')\nax.set_title('Fonctions trigonométriques')\nax.legend()\nax.grid(True, alpha=0.3)\nplt.show()" }
    ]),
    table([['Graphique', 'Graphique', 'Chart'], ['Fonction', 'Fonction', 'Function'], ['À quoi il sert', 'Fach', 'Purpose'], ['Paramètres du cours', 'Paramètres', 'Course parameters']], [
      [['Ligne', 'Ligne', 'Line'], 'ax.plot(x, y)', ['Évolution, fonction continue', 'Tatawor', 'Trend, continuous function'], "'b-', 'r--', label, linewidth"],
      [['Nuage de points', 'Nuage de points', 'Scatter'], 'ax.scatter(x, y)', ['**Relation** entre deux variables', '**3ala9a** bin jouj variables', '**Relationship** between two variables'], "c=colors, s=sizes, alpha=0.7, cmap='viridis' + plt.colorbar"],
      [['Histogramme', 'Histogramme', 'Histogram'], 'ax.hist(data)', ['**Distribution** d\'une variable', '**Tawzi3** dyal variable', '**Distribution** of a variable'], "bins=30, alpha, color, edgecolor, cumulative=True, density=True"],
      [['Barres', 'Barres', 'Bars'], 'ax.bar(x, h)', ['**Comparer** des catégories', '**9aren** catégories', '**Compare** categories'], "bar_width, x_pos ± width/2 (groupées), set_xticks"],
      [['Camembert', 'Camembert', 'Pie'], 'ax.pie(sizes)', ['**Parts d\'un tout** (en %)', '**Nisab** mn kol (%)', '**Parts of a whole** (%)'], "labels, explode, autopct='%1.1f%%', startangle=90"]
    ]),
    code(`# Nuage de points (diapo 13)
n_points = 100
x = np.random.randn(n_points)
y = 2*x + np.random.randn(n_points)*0.5
fig, ax = plt.subplots(figsize=(8, 6))
scatter = ax.scatter(x, y, c=np.random.rand(n_points), s=100*np.random.rand(n_points), alpha=0.7, cmap='viridis')
plt.colorbar(scatter, label='Intensité')

# Histogramme simple et cumulatif (diapo 15)
data1 = np.random.normal(0, 1, 1000)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
ax1.hist(data1, bins=30, alpha=0.7, color='skyblue', edgecolor='black')
ax2.hist(data1, bins=30, cumulative=True, density=True)

# Barres groupées (diapo 17)
categories = ['Cat A', 'Cat B', 'Cat C', 'Cat D']
x_pos = np.arange(len(categories)); w = 0.35
ax.bar(x_pos - w/2, [23, 45, 56, 12], w, label='Serie 1')
ax.bar(x_pos + w/2, [34, 30, 45, 23], w, label='Serie 2')
ax.set_xticks(x_pos); ax.set_xticklabels(categories)

# Camembert (diapo 19)
ax.pie([45, 20, 15, 12, 8], labels=['Python', 'Java', 'C++', 'JavaScript', 'Other'],
       explode=(0.1, 0, 0, 0, 0), autopct='%1.1f%%', startangle=90)`, 'python', ['Les codes des diapos, regroupés.', 'Codes dyal diapos.', 'The slide code, grouped.']),
    tip(['`density=True` met l\'histogramme en **proportions** (aire totale = 1) ; avec `cumulative=True`, la dernière barre atteint donc **1** : c\'est la fonction de répartition empirique.', '`density=True` = **nisab** (majmou3 = 1) ; m3a `cumulative=True` lekher kaywsel l **1**.', '`density=True` turns counts into **proportions** (total area 1); with `cumulative=True` the last bar reaches **1**.']),
    quiz('dv-08', 'dv-09', 'dv-10', 'dv-11'),

    h(['5. Subplots : plusieurs graphiques dans une figure', '5. Subplots : bzaf d graphiques f figure', '5. Subplots: several charts in one figure']),
    code(`fig, axes = plt.subplots(2, 2, figsize=(12, 10))   # grille 2 x 2
fig.suptitle('Grille de graphiques 2x2')
axes[0, 0].plot(x, np.sin(x), 'b-');   axes[0, 0].set_title('Sinus')
axes[0, 1].plot(x, np.cos(x), 'r-');   axes[0, 1].set_title('Cosinus')
axes[1, 0].scatter(x, np.tan(x), alpha=0.5); axes[1, 0].set_title('Tangente')
axes[1, 1].hist(np.random.randn(1000), bins=30); axes[1, 1].set_title('Distribution normale')
plt.tight_layout()
plt.show()`, 'python'),
    p(['`axes` est un tableau 2D : **`axes[ligne, colonne]`**, en partant de 0. `suptitle` = titre de toute la figure ; `set_title` = titre d\'un seul graphique. `tight_layout()` évite que les titres se chevauchent.', '`axes` tableau 2D : **`axes[str, colonne]`** mn 0. `suptitle` = titre dyal figure kamla ; `set_title` = titre dyal graphique wa7ed. `tight_layout()` bach ma ytkhllatouch.', '`axes` is a 2-D array: **`axes[row, col]`**, from 0. `suptitle` = whole-figure title; `set_title` = one chart. `tight_layout()` prevents overlapping titles.']),

    h(['6. Bonnes pratiques et erreurs courantes', '6. Bonnes pratiques w akhta2', '6. Good practice and common mistakes']),
    table([['Règles d\'or', 'Qawa3id dhahabiya', 'Golden rules'], ['Erreurs courantes', 'Akhta2 kathira', 'Common mistakes']], [
      [['**Simplicité** : un message par graphique', '**Bsata** : message wa7ed', '**Simplicity**: one message per chart'], ['Graphiques **3D inutiles**', '**3D** bla 7aja', 'Useless **3D**']],
      [['**Clarté** : labels explicites', '**Wodou7** : labels wad7in', '**Clarity**: explicit labels'], ['Couleurs **non accessibles** (daltonisme)', 'Alwan ma kaybanouch (daltonisme)', '**Inaccessible** colours (colour-blindness)']],
      [['**Précision** : échelles appropriées', '**Di9a** : échelles mnasbin', '**Precision**: proper scales'], ['Échelles **logarithmiques non justifiées**', 'Log bla sabab', '**Unjustified log** scales']],
      [['**Efficacité** : couleurs significatives', 'Alwan 3andhom ma3na', '**Efficiency**: meaningful colours'], ['**Trop d\'information**', '**Bzaf d ma3loumat**', '**Too much information**']],
      [['**Honnêteté** : pas d\'échelles trompeuses', '**Amana** : bla échelles ghachin', '**Honesty**: no misleading scales'], ['**Labels illisibles**', 'Labels ma kayt9raw', '**Unreadable labels**']]
    ]),
    quiz('dv-07', 'dv-18'),

    h(['7. Choisir le bon type de graphique', '7. Khtar l graphique l mnasb', '7. Choosing the right chart']),
    table([['Objectif', 'Lhadaf', 'Goal'], ['Recommandés', 'Mzyanin', 'Recommended'], ['À éviter', 'Tjenneb', 'Avoid']], [
      [['Comparaison', 'Mo9arana', 'Comparison'], ['Barres, Radar', 'Barres, Radar', 'Bars, Radar'], ['Camembert, 3D', 'Camembert, 3D', 'Pie, 3D']],
      [['Distribution', 'Tawzi3', 'Distribution'], ['Histogramme, Box, Violon', 'Histogramme, Box, Violon', 'Histogram, Box, Violin'], ['Ligne, Barres', 'Ligne, Barres', 'Line, Bars']],
      [['Composition', 'Tarkib', 'Composition'], ['Empilé, Treemap', 'Empilé, Treemap', 'Stacked, Treemap'], ['Camembert (sauf %)', 'Camembert (illa %)', 'Pie (except %)']],
      [['Relation', '3ala9a', 'Relationship'], ['Scatter, Line, Heatmap', 'Scatter, Line, Heatmap', 'Scatter, Line, Heatmap'], ['Barres, Camembert', 'Barres, Camembert', 'Bars, Pie']],
      [['Évolution', 'Tatawor', 'Evolution'], ['Ligne, Aire', 'Ligne, Aire', 'Line, Area'], ['Barres (temps long)', 'Barres (wa9t twil)', 'Bars (long time)']],
      [['Données spatiales', 'Data jughrafiya', 'Spatial data'], ['Carte, Choroplèthe', 'Carte, Choroplèthe', 'Map, Choropleth'], ['Tous sauf cartes', 'Kolchi ghir cartes', 'Anything but maps']]
    ]),
    anim('ChartChooser'),
    exam(['Question type : « Quel graphique pour montrer la **distribution** des salaires ? » → **histogramme** (ou boxplot / violon), jamais une ligne. « Pour la **relation** taille/poids ? » → **scatter**.', 'Sou2al : « **tawzi3** dyal salaires ? » → **histogramme** (wla boxplot). « **3ala9a** tol/wazn ? » → **scatter**.', 'Typical question: "Chart for the **distribution** of salaries?" → **histogram** (or box/violin). "For the height/weight **relationship**?" → **scatter**.']),
    quiz('dv-04', 'dv-05', 'dv-06'),

    h(['8. Workflow, export et publication', '8. Workflow, export w publication', '8. Workflow, export and publishing']),
    steps(['Le workflow recommandé du cours', 'Workflow dyal dars', 'The course\'s recommended workflow'], [
      { t: ['Exploration', 'Exploration', 'Exploration'], b: ['`df.plot()`, `sns.pairplot()` : regarder vite, sans soigner.', '`df.plot()`, `sns.pairplot()` : chouf b zerba.', '`df.plot()`, `sns.pairplot()`: look quickly.'] },
      { t: ['Analyse', 'Analyse', 'Analysis'], b: ['`sns.relplot()`, `sns.catplot()` : comparer par groupes.', '`relplot`, `catplot` : 9aren groupes.', '`sns.relplot()`, `sns.catplot()`: compare groups.'] },
      { t: ['Présentation', 'Présentation', 'Presentation'], b: ['`plt.subplots()` + personnalisation.', '`plt.subplots()` + personnalisation.', '`plt.subplots()` + styling.'] },
      { t: ['Validation', 'Validation', 'Validation'], b: ['Vérifier échelles, labels, accessibilité.', 'T2akked échelles, labels, accessibilité.', 'Check scales, labels, accessibility.'] },
      { t: ['Export', 'Export', 'Export'], b: ['`savefig()` avec haute résolution (`dpi=300`, `bbox_inches=\'tight\'`).', '`savefig()` b `dpi=300`.', '`savefig()` at high resolution.'], code: "fig.savefig('mon_graphique.png', dpi=300)\nfig.savefig('mon_graphique.pdf')   # vectoriel\nfig.savefig('mon_graphique.svg')   # vectoriel" }
    ]),
    table([['Format', 'Format', 'Format'], ['Usage recommandé', 'Fin', 'Recommended use']], [
      ['PNG', ['Web, présentations', 'Web, présentations', 'Web, slides']],
      ['PDF', ['Publications scientifiques (vectoriel)', 'Publications (vectoriel)', 'Scientific papers (vector)']],
      ['SVG', ['Édition vectorielle', 'Édition vectorielle', 'Vector editing']],
      ['JPG', ['Photos — **à éviter pour les graphiques**', 'Tswer — **machi l graphiques**', 'Photos — **avoid for charts**']]
    ]),
    quiz('dv-12', 'dv-17'),

    h(['9. Seaborn : la visualisation statistique', '9. Seaborn : visualisation statistique', '9. Seaborn: statistical visualisation']),
    p(['Seaborn est **basé sur Matplotlib**, avec une **interface de haut niveau**, **spécialisée en statistique**, **intégrée nativement à pandas** (on lui donne `data=df` et des noms de colonnes) et avec des **thèmes esthétiques par défaut**.', 'Seaborn **mbni 3la Matplotlib**, **interface sahla**, **mtkhasssa f statistique**, **mrbouta b pandas** (`data=df` w smiyat colonnes), w **thèmes zwinin par défaut**.', 'Seaborn is **built on Matplotlib**, with a **high-level interface**, **specialised in statistics**, **natively integrated with pandas** (`data=df` plus column names) and **nice default themes**.']),
    table([['Famille', 'Famille', 'Family'], ['Fonctions du cours', 'Fonctions', 'Course functions'], ['Ce qu\'elles montrent', 'Chnou kaybyynou', 'What they show']], [
      [['Distribution', 'Tawzi3', 'Distribution'], 'histplot(kde=True), kdeplot, ecdfplot, boxplot', ['Forme d\'une variable, comparaison par groupe (`hue`)', 'Chkl dyal variable', 'Shape of a variable, by group (`hue`)']],
      [['Relations', '3ala9at', 'Relationships'], 'scatterplot, lineplot, relplot', ['Lien entre deux variables ; relplot = **multi-facettes** (`col=`)', '3ala9a ; relplot = facettes', 'Link between two variables; relplot = **facets** (`col=`)']],
      [['Matrices', 'Matrices', 'Matrices'], 'heatmap(corr, annot=True)', ['**Matrice de corrélation**', '**Matrice de corrélation**', '**Correlation matrix**']]
    ]),
    code(`import seaborn as sns
tips = sns.load_dataset('tips')
sns.scatterplot(data=tips, x='total_bill', y='tip', hue='time')   # couleur par 'time'
sns.histplot(data=tips, x='total_bill', kde=True)
sns.boxplot(data=tips, x='day', y='total_bill')

iris = sns.load_dataset('iris')
corr_matrix = iris.select_dtypes(include=[np.number]).corr()
sns.heatmap(corr_matrix, annot=True, fmt=".2f", cmap='coolwarm', center=0, square=True)
mask = np.triu(np.ones_like(corr_matrix, dtype=bool))   # cacher le triangle supérieur
sns.heatmap(corr_matrix, mask=mask, annot=True, fmt=".2f")`, 'python'),
    tip(['La **heatmap de corrélation** relie ce chapitre au Rappel : chaque case est un **r** entre −1 et 1. `annot=True` écrit la valeur, `fmt=".2f"` l\'arrondit à 2 décimales, `center=0` met le blanc à r = 0.', '**Heatmap** = kol khana fiha **r** bin −1 w 1. `annot=True` kaykteb l qima, `fmt=".2f"` 2 ar9am.', 'The **correlation heatmap** links back to the Reminder: each cell is an **r** between −1 and 1.']),
    quiz('dv-13', 'dv-14'),

    h(['10. Visualiser directement avec pandas', '10. Rsem direct b pandas', '10. Plotting directly with pandas']),
    code(`df['A'].plot(title='Série A')                 # ligne
df[['A', 'B']].plot()                          # plusieurs séries
df['A'].plot.hist(bins=20, alpha=0.7)          # histogramme
df[['A', 'B', 'C']].plot.box()                 # boîtes à moustaches
df[['A', 'B']].plot.area(alpha=0.5, stacked=False)
df.plot.scatter(x='A', y='B', c='C', cmap='viridis')`, 'python'),
    p(['Avantages de pandas : **syntaxe concise** (`df.plot()`), **intégration données / graphiques**, **exploration rapide**, **utilise l\'index automatiquement** (des dates en index deviennent l\'axe x).', 'Mzayat pandas : **syntaxe 9sira**, **data w graphique m3a ba3d**, **exploration b zerba**, **index kaywli axe x automatiquement**.', 'pandas advantages: **concise syntax**, **data/plot integration**, **quick exploration**, **uses the index automatically** (dates become the x-axis).']),
    quiz('dv-15'),
    p(['**Pour aller plus loin** (cité dans la conclusion du cours) : Plotly (interactif), Bokeh (web), Geopandas (cartes), Dash (tableaux de bord), Altair (déclaratif).', '**Bach tmchi b3id** : Plotly, Bokeh, Geopandas, Dash, Altair.', '**Going further** (course conclusion): Plotly, Bokeh, Geopandas, Dash, Altair.'])
  ],
  keyPoints: [
    L(['5 raisons : comprendre vite, détecter les anomalies, communiquer, valider des hypothèses, décider.', '5 asbab dyal visualisation.', '5 reasons: understand, detect anomalies, communicate, validate, decide.']),
    L(['Figure = la feuille, Axes = un graphique ; style orienté objet `fig, ax = plt.subplots()` + `ax.set_…` recommandé.', 'Figure / Axes ; style objet.', 'Figure = sheet, Axes = one chart; OO style recommended.']),
    L(['plot (évolution), scatter (relation), hist (distribution), bar (comparaison), pie (parts en %).', 'plot, scatter, hist, bar, pie.', 'plot, scatter, hist, bar, pie and their uses.']),
    L(['Règles d\'or : simplicité, clarté, précision, efficacité, honnêteté ; éviter 3D, couleurs non accessibles, trop d\'info.', 'Qawa3id dhahabiya.', 'Golden rules and common mistakes.']),
    L(['Export : PNG (web), PDF/SVG (vectoriel), pas de JPG pour un graphique ; `savefig(dpi=300)`.', 'PNG, PDF, SVG ; machi JPG.', 'PNG, PDF/SVG, not JPG; `savefig(dpi=300)`.']),
    L(['Seaborn : histplot/kdeplot/ecdfplot/boxplot, scatterplot/lineplot/relplot, heatmap ; pandas : `df.plot.*`.', 'Seaborn w pandas.', 'Seaborn functions and pandas `df.plot.*`.'])
  ]
};
