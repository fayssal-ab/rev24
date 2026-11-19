import { L, h, p, def, plain, example, formula, steps, tip, trap, exam, table, anim, quiz } from '../lib';
import type { Chapter } from '../../src/lib/schema';

/** RO course (4IIR) rewritten from the Drive: « Graphes, définitions et terminologie », « Arbres et forêts », TD P1/P2, contrôle 2025-2026. */

const CC = 'A B C D E F | A-C:4 A-D:3 A-E:7 A-F:2 B-C:9 B-D:5 C-D:2 C-F:3 D-E:12 D-F:5 E-F:3';
const EX1 = 'A B C D E F G | A-B A-C A-D B-C B-E C-D C-F D-G E-F F-G';
const PRIMC = 'A B C D E F | A-B:5 A-C:6 A-D:4 B-D:2 C-D:2 B-C:1 C-E:5 C-F:3 D-F:4 E-F:4';
const PRIM9 = '1 2 3 4 5 6 7 8 9 | 1-2:4 1-3:5 4-5:3 5-8:6 5-6:4 6-7:2 8-9:7 3-9:6 2-3:8 2-4:9 3-4:10 4-6:8 6-9:9 7-8:11 7-9:10';
const COURS7 = '1 2 3 4 5 6 7 | 1-3 1-4 7-1 3-4 5-3 3-6 3-7 7-4 3-3';
const POS_CC: Record<string, [number, number]> = { A: [50, 8], B: [92, 50], C: [70, 90], D: [46, 56], E: [8, 50], F: [28, 90] };

type Course = Pick<Chapter, 'title' | 'summary' | 'estimatedMinutes' | 'sections' | 'keyPoints'>;
const k = (fr: string, dar: string, en: string) => L([fr, dar, en]);

export const COURSE: Record<string, Course> = {
  defs: {
    title: k('Chap 1 — Graphes : définitions et terminologie', 'Fasl 1 — Graphes : ta3arif w mofradat', 'Ch. 1 — Graphs: definitions and terminology'),
    summary: k('Graphe non orienté et orienté, sommets, arêtes, arcs, boucle, adjacence, ordre, degré, théorème des degrés et son corollaire, avec les exemples et exercices du cours.', 'Graphe orienté w non orienté, sommets, arêtes, arcs, boucle, ordre, degré, théorème dyal degrés.', 'Undirected and directed graphs, vertices, edges, arcs, loops, adjacency, order, degree, the handshake theorem and its corollary.'),
    estimatedMinutes: 35,
    sections: [
      h(['1. C\'est quoi un graphe ?', '1. Chnou howa graphe ?', '1. What is a graph?']),
      def(['Un **graphe** est un **ensemble de sommets** et d\'**arêtes** (ou **arcs**) reliant ces sommets. Il existe des graphes **orientés** et **non orientés**.', '**Graphe** = **majmou3a d sommets** w **arêtes** (wla **arcs**) li kayrbtou binathom. Kayn **orienté** w **non orienté**.', 'A **graph** is a **set of vertices** and **edges** (or **arcs**) linking them. Graphs can be **directed** or **undirected**.']),
      plain(['Les points = les **sommets** (villes, ordinateurs, personnes). Les traits = les **arêtes** (routes, câbles, amitiés). Applications du cours : **plan de transport en commun**, **réseau d\'ordinateurs**, **tournois sportifs**.', 'Les points = **sommets** (mdon, PC, nas). Les traits = **arêtes** (trou9, câbles, s7ab). Applications : **transport**, **réseau**, **tournois**.', 'Dots = **vertices** (cities, computers, people). Lines = **edges** (roads, cables, friendships). Course applications: **public transport map**, **computer network**, **sports tournaments**.']),

      h(['2. Graphe non orienté', '2. Graphe non orienté', '2. Undirected graph']),
      formula('G = (S, A) \\qquad A \\subseteq \\{\\,\\{s_1, s_2\\} : s_1, s_2 \\in S\\,\\}', ['**S** : ensemble non vide de **sommets** (nœuds). **A** : ensemble de **paires non ordonnées** de sommets, appelées **arêtes**.', '**S** : sommets. **A** : **paires bla tartib** = **arêtes**.', '**S**: non-empty set of **vertices**. **A**: set of **unordered pairs** of vertices called **edges**.']),
      p(['- Si a = {s1, s2} ∈ A, a est l\'**arête d\'extrémités** s1 et s2 ; s1 et s2 sont **adjacents**.\n- Si les deux extrémités sont **confondues** ({s, s}), l\'arête est une **boucle**.', '- a = {s1, s2} : arête bin s1 w s2 ; s1 w s2 **adjacents** (jiran).\n- Ila jouj tarafat **nefs sommet** → **boucle**.', '- If a = {s1, s2}, a is the edge with **endpoints** s1 and s2; they are **adjacent**.\n- If both endpoints are the **same** vertex, the edge is a **loop**.']),
      example(['**Exemple du cours** : S = {1, 2, 3, 4, 5, 6, 7} et A = {{1,3}, {1,4}, {7,1}, {3,4}, {5,3}, {3,6}, {3,7}, {7,4}, {3,3}}. Le sommet **2 est isolé** (degré 0) et {3,3} est une **boucle**.', '**Mithal** : S = {1…7}, A = {{1,3}, {1,4}, {7,1}, {3,4}, {5,3}, {3,6}, {3,7}, {7,4}, {3,3}}. **2 isolé**, {3,3} **boucle**.', '**Course example**: S = {1…7}, A = {{1,3}, {1,4}, {7,1}, {3,4}, {5,3}, {3,6}, {3,7}, {7,4}, {3,3}}. Vertex **2 is isolated**, {3,3} is a **loop**.']),
      anim('GraphAlgo', { graph: COURS7, algo: 'degrees' }),
      tip(['Le degré de 3 vaut **7** : 5 arêtes ordinaires (vers 1, 4, 5, 6, 7) + la **boucle {3,3} comptée deux fois**.', 'Degré dyal 3 = **7** : boucle kat7seb **jouj merrat**.', 'Vertex 3 has degree **7**: the **loop counts twice**.']),

      h(['3. Graphe orienté', '3. Graphe orienté', '3. Directed graph']),
      def(['Un **graphe orienté** G = (S, A) : S ensemble non vide de sommets, A ensemble de **couples ordonnés** (s1, s2), appelés **arcs**. Un arc a un **sens** : de s1 (origine) vers s2 (extrémité).', '**Graphe orienté** : A fih **couples b tartib** (s1, s2) = **arcs**. Arc 3ando **ittijah** : mn s1 l s2.', 'A **directed graph** G = (S, A): A is a set of **ordered pairs** (s1, s2) called **arcs**, going from s1 to s2.']),
      example(['**Exemple du cours** : S = {1, …, 6}, A = {(1,2), (2,4), (2,5), (4,1), (4,4), (4,5), (5,4), (6,3)}. (4,4) est une boucle ; (4,5) et (5,4) sont deux arcs **différents**.', 'S = {1…6}, A = {(1,2), (2,4), (2,5), (4,1), (4,4), (4,5), (5,4), (6,3)}. (4,5) ≠ (5,4).', 'S = {1…6}, A = {(1,2), (2,4), (2,5), (4,1), (4,4), (4,5), (5,4), (6,3)}. (4,5) and (5,4) are **different** arcs.']),

      h(['4. Ordre et degré', '4. Ordre w degré', '4. Order and degree']),
      def(['**Ordre** d\'un graphe = **nombre de sommets**. **Taille** = nombre d\'arêtes. **Degré** d(a) d\'un sommet a = nombre d\'arêtes (ou arcs) qui ont a pour extrémité, **les boucles comptées deux fois**. Degré 0 → sommet **isolé**.', '**Ordre** = 3adad sommets. **Taille** = 3adad arêtes. **Degré** d(a) = 3adad arêtes li fihom a, **boucle = 2**. Degré 0 → **isolé**.', '**Order** = number of vertices. **Size** = number of edges. **Degree** d(a) = number of edges touching a, **loops counted twice**. Degree 0 → **isolated**.']),
      formula('\\sum_{s \\in S} d(s) = 2\\,|A|', ['**Théorème** : la somme des degrés est égale à **deux fois le nombre d\'arêtes** — c\'est donc toujours un nombre **pair**. (Chaque arête a 2 extrémités : elle est comptée 2 fois.)', '**Théorème** : majmou3 degrés = **2 × 3adad arêtes** → dima **zawji**.', '**Theorem**: the sum of degrees is **twice the number of edges** — always **even**.']),
      p(['**Corollaire** : dans un graphe, le **nombre de sommets de degré impair est pair**. Exemple du cours : degrés a = 2, b = 3, c = 3, d = 2 → somme 10 = 2 × 5 arêtes, et 2 sommets impairs (b, c).', '**Corollaire** : 3adad sommets **impairs** howa **zawji**. Mithal : 2, 3, 3, 2 → 10 = 2 × 5.', '**Corollary**: the **number of odd-degree vertices is even**. Course example: 2, 3, 3, 2 → 10 = 2 × 5 edges, 2 odd vertices.']),
      steps(['Exercice type du contrôle : « Peut-on tracer un graphe simple à 5 sommets de degrés 4, 3, 3, 2, 1 ? »', 'Exercice dyal contrôle : degrés 4, 3, 3, 2, 1 ?', 'Exam exercise: a simple graph with degrees 4, 3, 3, 2, 1?'], [
        { t: ['Additionner les degrés', 'Jme3 degrés', 'Add the degrees'], b: ['4 + 3 + 3 + 2 + 1 = **13**.', '= **13**.', '= **13**.'] },
        { t: ['Appliquer le théorème', 'Théorème', 'Apply the theorem'], b: ['La somme doit être **paire** (= 2 × nombre d\'arêtes). 13 est **impair**.', 'Khass **zawji** ; 13 **fardi**.', 'It must be **even**; 13 is **odd**.'] },
        { t: ['Conclure', 'Conclure', 'Conclude'], b: ['**Impossible**. (Autre façon : il y a 3 sommets impairs — 3, 3, 1 — or ce nombre doit être pair.)', '**Impossible** (3 sommets impairs).', '**Impossible** (3 odd vertices).'] }
      ]),
      quiz('ro-01', 'ro-02', 'ro-03', 'ro-04'),

      h(['5. Exercices du cours', '5. Exercices dyal dars', '5. Course exercises']),
      steps(['« Sommets 2 à 8, on relie i et j s\'ils sont premiers entre eux »', '« Sommets 2 l 8, rbet i w j ila premiers entre eux »', '"Vertices 2 to 8, link i and j if coprime"'], [
        { t: ['Rappel', 'Tadkir', 'Reminder'], b: ['i et j sont **premiers entre eux** si leur seul diviseur commun est 1 (pgcd = 1).', '**Premiers entre eux** = pgcd = 1.', '**Coprime** = gcd 1.'] },
        { t: ['Arêtes de 2 et 3', 'Arêtes dyal 2 w 3', 'Edges from 2 and 3'], b: ['2 : avec 3, 5, 7. 3 : avec 2, 4, 5, 7, 8.', '2 : 3, 5, 7. 3 : 2, 4, 5, 7, 8.', '2: 3, 5, 7. 3: 2, 4, 5, 7, 8.'] },
        { t: ['Les autres', 'L ba9i', 'The rest'], b: ['4 : 3, 5, 7. 5 : 2, 3, 4, 6, 7, 8. 6 : 5, 7. 7 : 2, 3, 4, 5, 6, 8. 8 : 3, 5, 7.', '4 : 3, 5, 7 ; 5 : 2, 3, 4, 6, 7, 8 ; 6 : 5, 7 ; 7 : 2…8 ; 8 : 3, 5, 7.', '4: 3, 5, 7; 5: 2, 3, 4, 6, 7, 8; 6: 5, 7; 7: 2, 3, 4, 5, 6, 8; 8: 3, 5, 7.'] },
        { t: ['Vérification', 'Verification', 'Check'], b: ['Degrés 3, 5, 3, 6, 2, 6, 3 → somme 28 → **14 arêtes** (pair ✓).', 'Somme 28 → **14 arêtes**.', 'Sum 28 → **14 edges**.'] }
      ])
    ],
    keyPoints: [
      k('Non orienté : G = (S, A), arêtes = paires {s1, s2} ; orienté : arcs = couples (s1, s2).', 'Arêtes {s1, s2} ; arcs (s1, s2).', 'Edges {s1, s2}; arcs (s1, s2).'),
      k('Ordre = nombre de sommets ; taille = nombre d\'arêtes ; degré = arêtes incidentes, boucle comptée 2 fois.', 'Ordre, taille, degré.', 'Order, size, degree (loop counts twice).'),
      k('Σ d(s) = 2 |A| (toujours pair) ; nombre de sommets impairs toujours pair.', 'Σ d = 2|A|.', 'Σ d = 2|A|; even number of odd vertices.')
    ]
  },

  matrices: {
    title: k('Chap 2 — Représentation matricielle d\'un graphe', 'Fasl 2 — Matrices dyal graphe', 'Ch. 2 — Matrix representation of a graph'),
    summary: k('Matrice d\'adjacence (orientée et non orientée), matrices sommet-arc, sommet-arête et sommet-sommet, et la puissance M^k pour compter les chemins de longueur k (contrôle).', 'Matrice d\'adjacence, sommet-arc, sommet-arête, M^k.', 'Adjacency matrix, vertex-arc and vertex-edge matrices, and M^k to count walks of length k.'),
    estimatedMinutes: 35,
    sections: [
      h(['1. La matrice d\'adjacence', '1. Matrice d\'adjacence', '1. The adjacency matrix']),
      def(['Sommets numérotés de 1 à n. La **matrice d\'adjacence** M(G) = (m_ij) est une matrice carrée **n × n** où m_ij = **nombre d\'arêtes d\'extrémités si et sj**. Pour un graphe **orienté**, m_ij = **nombre d\'arcs d\'origine si et d\'extrémité sj**.', 'Matrice **n × n** : m_ij = **3adad arêtes** bin si w sj. F **orienté** : 3adad arcs **mn si l sj**.', 'An **n × n** matrix where m_ij = **number of edges between si and sj**; for a **directed** graph, number of arcs **from si to sj**.']),
      table([['Remarque du cours', 'Molahada', 'Course remark'], ['Pourquoi', '3lach', 'Why']], [
        [['Non orienté → **symétrique** (m_ij = m_ji)', 'Non orienté → **mtamatla**', 'Undirected → **symmetric**'], ['L\'arête {i, j} compte de i vers j et de j vers i', '{i, j} f jouj jihat', '{i, j} counts both ways']],
        [['Graphe simple → **diagonale de 0**', 'Simple → **diagonale 0**', 'Simple → **zero diagonal**'], ['Pas de boucle (m_ii = 0)', 'Bla boucle', 'No loop']],
        [['Orienté : **somme des coefficients = nombre d\'arcs**', 'Orienté : majmou3 = 3adad arcs', 'Directed: **sum = number of arcs**'], ['Chaque arc ajoute 1 dans une seule case', 'Kol arc = 1', 'Each arc adds 1 once']],
        [['Non orienté : somme de la ligne i = **degré** de i', 'Majmou3 str i = **degré**', 'Row sum = **degree**'], ['Chaque arête issue de i ajoute 1 à sa ligne', 'Kol arête mn i katzid 1', 'Each edge from i adds 1 to its row']]
      ]),
      steps(['Écrire la matrice d\'adjacence du réseau du contrôle (stations A à F)', 'Matrice dyal réseau dyal contrôle (A l F)', 'Adjacency matrix of the exam network (A to F)'], [
        { t: ['Lister les arêtes', 'Lister arêtes', 'List the edges'], b: ['A–C, A–D, A–E, A–F, B–C, B–D, C–D, C–F, D–E, D–F, E–F (11 arêtes).', '11 arêtes.', '11 edges.'] },
        { t: ['Remplir ligne par ligne', '3mmer str b str', 'Fill row by row'], b: ['Ligne A : 0 0 1 1 1 1 · B : 0 0 1 1 0 0 · C : 1 1 0 1 0 1 · D : 1 1 1 0 1 1 · E : 1 0 0 1 0 1 · F : 1 0 1 1 1 0.', 'A : 001111 · B : 001100 · C : 110101 · D : 111011 · E : 100101 · F : 101110.', 'A: 001111 · B: 001100 · C: 110101 · D: 111011 · E: 100101 · F: 101110.'] },
        { t: ['Vérifier', 'Verifi', 'Check'], b: ['Symétrique ✓, diagonale nulle ✓, somme totale 22 = 2 × 11 ✓.', 'Mtamatla, diagonale 0, 22 = 2 × 11.', 'Symmetric, zero diagonal, 22 = 2 × 11.'] }
      ]),
      quiz('ro-10', 'ro-11'),

      h(['2. Les autres représentations', '2. Representations khrin', '2. Other representations']),
      table([['Matrice', 'Matrice', 'Matrix'], ['Taille', 'Taille', 'Size'], ['Coefficient', 'Coefficient', 'Entry']], [
        [['**Sommet-arc** (orienté)', '**Sommet-arc**', '**Vertex-arc** (directed)'], ['n sommets × m arcs', 'n × m', 'n × m'], ['m_i,a = **1** si l\'arc a **sort** de i, **−1** s\'il **entre** dans i, **0** sinon', '**1** khrej, **−1** dkhel, **0**', '**1** if a leaves i, **−1** if it enters, **0** otherwise']],
        [['**Sommet-arête** (non orienté)', '**Sommet-arête**', '**Vertex-edge**'], ['n × m', 'n × m', 'n × m'], ['**1** si le sommet est une extrémité de l\'arête, 0 sinon (chaque colonne contient deux 1)', '**1** ila sommet f arête', '**1** if the vertex is an endpoint'] ],
        [['**Sommet-sommet**', '**Sommet-sommet**', '**Vertex-vertex**'], ['n × n', 'n × n', 'n × n'], ['C\'est la matrice d\'adjacence (1 si adjacents)', 'Hiya matrice d\'adjacence', 'It is the adjacency matrix']]
      ]),
      trap(['Dans la matrice sommet-arc, **chaque colonne contient exactement un 1 et un −1** (un arc sort d\'un sommet et entre dans un autre). Si ta colonne a deux 1, tu as oublié le sens.', 'Sommet-arc : **kol colonne fiha 1 w −1**.', 'Vertex-arc: **each column has one 1 and one −1**.']),

      h(['3. Puissances de M : compter les chemins (contrôle, exercice 3)', '3. M^k : 7seb chemins', '3. Powers of M: counting walks (exam, exercise 3)']),
      formula('(M^k)_{ij} = \\text{nombre de chemins de longueur } k \\text{ de } s_i \\text{ à } s_j \\qquad \\mathrm{tr}(M^k) = \\text{nombre de circuits de longueur } k', ['On calcule M² = M × M, puis M⁴ = M² × M². La **trace** (somme de la diagonale) compte les chemins qui reviennent à leur point de départ.', 'M² = M × M, M⁴ = M² × M². **Trace** = circuits.', 'Compute M² = M × M, then M⁴ = M² × M². The **trace** counts closed walks.']),
      steps(['Contrôle 2025 : graphe A → B, A → C, B → A, B → C, C → A', 'Contrôle 2025 : A→B, A→C, B→A, B→C, C→A', 'Exam 2025: A→B, A→C, B→A, B→C, C→A'], [
        { t: ['Matrice M', 'Matrice M', 'Matrix M'], b: ['Lignes A, B, C : **A = (0 1 1)**, **B = (1 0 1)**, **C = (1 0 0)**.', 'A = 011, B = 101, C = 100.', 'A = 011, B = 101, C = 100.'], tex: 'M = \\begin{pmatrix} 0&1&1\\\\ 1&0&1\\\\ 1&0&0 \\end{pmatrix}' },
        { t: ['M²', 'M²', 'M²'], b: ['Case (i, j) = ligne i de M · colonne j de M. Ex. (A, A) = 0·0 + 1·1 + 1·1 = 2.', '(A, A) = 0 + 1 + 1 = 2.', '(A, A) = 0 + 1 + 1 = 2.'], tex: 'M^2 = \\begin{pmatrix} 2&0&1\\\\ 1&1&1\\\\ 0&1&1 \\end{pmatrix}' },
        { t: ['M⁴ = M² × M²', 'M⁴ = M² × M²', 'M⁴ = M² × M²'], b: ['Même méthode avec M² : ex. (A, B) = 2·0 + 0·1 + 1·1 = 1.', '(A, B) = 1.', '(A, B) = 1.'], tex: 'M^4 = \\begin{pmatrix} 4&1&3\\\\ 3&2&3\\\\ 1&2&2 \\end{pmatrix}' },
        { t: ['Lire les réponses', '9ra jawabat', 'Read the answers'], b: ['De A à B : **1** chemin de longueur 4 ; de B à A : **3** ; de B à C : **3**. Circuits de longueur 4 : trace = 4 + 2 + 2 = **8**.', 'A→B : 1 ; B→A : 3 ; B→C : 3 ; trace = **8**.', 'A→B: 1; B→A: 3; B→C: 3; trace = **8**.'], why: ['« Décrire ces chemins » : le seul chemin de longueur 4 de A à B est **A → B → C → A → B** (chaque flèche existe bien). Vérifie toujours en suivant les arcs, la matrice te dit seulement **combien** il y en a.', 'Chemin wa7ed A → B : **A → B → C → A → B**.', 'The single A → B walk is **A → B → C → A → B**.'] }
      ]),
      quiz('ro-12', 'ro-13', 'ro-14')
    ],
    keyPoints: [
      k('m_ij = nombre d\'arêtes entre si et sj (arcs de si vers sj si orienté) ; non orienté → symétrique ; simple → diagonale nulle.', 'Adjacence : symétrique, diagonale 0.', 'Adjacency matrix rules.'),
      k('Sommet-arc : 1 sortant, −1 entrant, 0 sinon ; sommet-arête : 1 si extrémité.', 'Sommet-arc / sommet-arête.', 'Vertex-arc / vertex-edge.'),
      k('(M^k)_ij = chemins de longueur k de i à j ; trace(M^k) = circuits de longueur k.', 'M^k w trace.', 'M^k and its trace.')
    ]
  },

  euler: {
    title: k('Chap 3 — Chaînes, cycles, connexité, Euler et Hamilton', 'Fasl 3 — Chaînes, cycles, connexité, Euler w Hamilton', 'Ch. 3 — Chains, cycles, connectivity, Euler and Hamilton'),
    summary: k('Chaîne, longueur, chaîne simple / élémentaire / fermée, cycle (avec les 6 exemples du cours), connexité et forte connexité, cycles et chaînes eulériens et hamiltoniens, théorèmes d\'Euler.', 'Chaîne, cycle, connexité, Euler w Hamilton.', 'Chains, cycles, connectivity, Eulerian and Hamiltonian cycles, Euler\'s theorems.'),
    estimatedMinutes: 40,
    sections: [
      h(['1. Chaînes et cycles', '1. Chaînes w cycles', '1. Chains and cycles']),
      table([['Notion', 'Fikra', 'Notion'], ['Définition du cours', 'Ta3rif', 'Course definition']], [
        [['**Chaîne**', '**Chaîne**', '**Chain**'], ['Succession d\'arêtes telle que deux arêtes qui se suivent sont **adjacentes**', 'Arêtes mtab3in, kol jouj mlas9in', 'Sequence of edges, consecutive ones **adjacent**']],
        [['**Longueur**', '**Tol**', '**Length**'], ['**Nombre d\'arêtes** de la chaîne (pas le nombre de sommets !)', '**3adad arêtes**', '**Number of edges**']],
        [['**Chaîne simple**', '**Simple**', '**Simple**'], ['Toutes les **arêtes** sont distinctes', 'Arêtes **mokhtalfin**', 'All **edges** distinct']],
        [['**Chaîne élémentaire**', '**Élémentaire**', '**Elementary**'], ['Tous les **sommets** sont distincts (sauf peut-être les extrémités)', 'Sommets **mokhtalfin**', 'All **vertices** distinct']],
        [['**Chaîne fermée**', '**Fermée**', '**Closed**'], ['L\'origine et l\'extrémité **coïncident**', 'Bdya = nihaya', 'Start = end']],
        [['**Cycle**', '**Cycle**', '**Cycle**'], ['Chaîne **fermée** dont les arêtes sont **toutes distinctes**', '**Fermée** + arêtes mokhtalfin', '**Closed** chain with **distinct edges**']]
      ]),
      example(['Les 6 exemples du cours (graphe s0…s5) :\n1. {s0, s1, s2, s0, s1, s0, s5, s0, s3} : chaîne de longueur **8** (9 sommets cités → 8 arêtes).\n2. {s0, s1, s2, s3, s4, s0, s5} : chaîne **simple** de longueur 6.\n3. {s1, s2, s3, s0, s4, s5} : chaîne **élémentaire** de longueur 5.\n4. {s0, s1, s2, s0, s1, s0, s5, s0, s3, s0} : chaîne **fermée** de longueur 9.\n5. {s1, s2, s0, s3, s4, s0, s5, s1} : **cycle** de longueur 7.\n6. {s0, s1, s2, s3, s0, s5, s1, s0} : chaîne fermée de longueur 7 mais **pas un cycle** : l\'arête s0–s1 est parcourue **deux fois**.', '6 amthila dyal dars : longueur = 3adad sommets − 1 ; cycle khass arêtes mokhtalfin (mithal 6 machi cycle 7it s0–s1 jouj merrat).', 'The 6 course examples: length = listed vertices − 1; example 6 is not a cycle because s0–s1 is used twice.']),
      tip(['Astuce longueur : **longueur = nombre de sommets écrits − 1**.', 'Tol = 3adad sommets mktoubin − 1.', 'Length = number of listed vertices − 1.']),
      quiz('ro-20', 'ro-21'),

      h(['2. Connexité', '2. Connexité', '2. Connectivity']),
      def(['Un graphe est **connexe** si deux sommets distincts quelconques peuvent être **reliés par une chaîne**. Un graphe **orienté** est **fortement connexe** si pour tout couple (s1, s2) il existe un **chemin** (qui respecte le sens des arcs) de s1 à s2.', '**Connexe** : ay jouj sommets mrboutin b chaîne. **Fortement connexe** (orienté) : chemin b ittijah mn ay wa7ed l ay wa7ed.', '**Connected**: any two vertices joined by a chain. **Strongly connected** (directed): a **path** respecting arc directions between every ordered pair.']),

      h(['3. Euler et Hamilton', '3. Euler w Hamilton', '3. Euler and Hamilton']),
      table([['Critère', 'Mi3yar', 'Criterion'], ['Eulérien', 'Eulérien', 'Eulerian'], ['Hamiltonien', 'Hamiltonien', 'Hamiltonian']], [
        [['Passe exactement une fois par…', 'Kaydouz merra wa7da 3la…', 'Uses exactly once…'], ['chaque **ARÊTE**', 'kol **ARÊTE**', 'every **EDGE**'], ['chaque **SOMMET**', 'kol **SOMMET**', 'every **VERTEX**']],
        [['Cycle / chaîne', 'Cycle / chaîne', 'Cycle / chain'], ['Cycle eulérien (revient au départ) / chaîne eulérienne', 'Cycle / chaîne eulérienne', 'Eulerian cycle / chain'], ['Cycle hamiltonien / chaîne hamiltonienne', 'Cycle / chaîne hamiltonienne', 'Hamiltonian cycle / chain']],
        [['Test', 'Test', 'Test'], ['**Théorème simple** sur les degrés', '**Théorème** 3la degrés', '**Simple theorem** on degrees'], ['**Pas de théorème simple** : on cherche un cycle à la main', '**Bla théorème** : 9elleb b yddik', '**No simple test**: search by hand']]
      ]),
      formula('\\text{connexe et tous les degrés pairs} \\iff \\text{cycle eulérien} \\qquad 0 \\text{ ou } 2 \\text{ sommets impairs} \\iff \\text{chaîne eulérienne}', ['**Théorème d\'Euler** : un graphe simple connexe admet un **cycle eulérien** si et seulement si **tous ses sommets ont un degré pair**. Il admet une **chaîne eulérienne** (graphe **semi-eulérien**) si et seulement si le nombre de sommets de degré impair est **0 ou 2** ; s\'il vaut 2, ces deux sommets sont les **extrémités** de la chaîne.', '**Euler** : cycle ⇔ ga3 degrés **zawjiyin** ; chaîne ⇔ **0 wla 2** impairs (homa l bdya w nihaya).', '**Euler**: cycle ⇔ **all degrees even**; chain ⇔ **0 or 2** odd vertices (the chain\'s endpoints).']),
      steps(['Contrôle, exercice 2, question 4 : le contrôleur peut-il emprunter chaque ligne une seule fois ?', 'Contrôle ex. 2 Q4 : kol ligne merra wa7da ?', 'Exam ex. 2 Q4: each line exactly once?'], [
        { t: ['Traduire la question', 'Fhem sou2al', 'Translate the question'], b: ['« Chaque **ligne** (arête) une et une seule fois » = une **chaîne eulérienne**.', '« Kol **ligne** merra wa7da » = **chaîne eulérienne**.', '"Each **line** (edge) once" = an **Eulerian chain**.'] },
        { t: ['Degrés', 'Degrés', 'Degrees'], b: ['A 4, B 2, C 4, **D 5**, **E 3**, F 4 → **2 sommets impairs** (D et E). Le graphe est connexe.', 'D w E impairs (2). Connexe.', '**D** and **E** odd (2 vertices). Connected.'] },
        { t: ['Conclure', 'Conclure', 'Conclude'], b: ['Réalisable (chaîne eulérienne) mais **pas un cycle** : il faut partir de **D** et arriver en **E** (ou l\'inverse).', 'Momkin, mn **D** l **E**.', 'Possible, from **D** to **E**.'] },
        { t: ['Exemple de trajet', 'Mithal', 'Example route'], b: ['**D–A–C–B–D–C–F–A–E–D–F–E** : 11 arêtes, toutes différentes ✓.', '**D–A–C–B–D–C–F–A–E–D–F–E**.', '**D–A–C–B–D–C–F–A–E–D–F–E**.'] }
      ]),
      quiz('ro-22', 'ro-23', 'ro-24', 'ro-25', 'ro-26')
    ],
    keyPoints: [
      k('Longueur d\'une chaîne = nombre d\'arêtes ; simple = arêtes distinctes ; élémentaire = sommets distincts ; cycle = fermée + arêtes distinctes.', 'Chaînes w cycles.', 'Chains and cycles.'),
      k('Connexe : une chaîne entre deux sommets quelconques ; fortement connexe : un chemin orienté dans les deux sens.', 'Connexité.', 'Connectivity.'),
      k('Eulérien = chaque arête une fois ; hamiltonien = chaque sommet une fois.', 'Euler = arêtes ; Hamilton = sommets.', 'Euler = edges; Hamilton = vertices.'),
      k('Euler : cycle ⇔ tous degrés pairs ; chaîne ⇔ 0 ou 2 sommets impairs (extrémités).', 'Théorème d\'Euler.', 'Euler\'s theorem.')
    ]
  },

  particuliers: {
    title: k('Chap 4 — Graphes particuliers et coloration', 'Fasl 4 — Graphes khassin w coloration', 'Ch. 4 — Special graphs and colouring'),
    summary: k('Graphe simple, complet Kn, planaire, biparti, coloration et nombre chromatique, avec la méthode pour l\'exercice des bancs du TD.', 'Simple, complet, planaire, biparti, coloration.', 'Simple, complete, planar, bipartite graphs; colouring and chromatic number.'),
    estimatedMinutes: 30,
    sections: [
      h(['1. Graphe simple et graphe complet', '1. Simple w complet', '1. Simple and complete graphs']),
      def(['Un graphe est **simple** s\'il est **sans boucle** et si deux sommets distincts sont reliés par **au plus une arête**. Un **graphe complet Kn** est un graphe simple d\'ordre n dont **tous les sommets sont deux à deux adjacents**. À tout graphe orienté on peut associer un graphe simple (on oublie le sens et les doublons).', '**Simple** : bla boucle, w jouj sommets b **arête wa7da max**. **Kn** : ga3 sommets mrboutin m3a ba3d.', '**Simple**: no loop, at most one edge between two vertices. **Kn**: every pair of vertices adjacent.']),
      formula('|A(K_n)| = \\frac{n(n-1)}{2} \\qquad \\text{arêtes à ajouter} = \\frac{n(n-1)}{2} - |A|', ['Chaque sommet est relié aux n − 1 autres ; on divise par 2 car chaque arête est comptée deux fois.', 'Kol sommet m3a n − 1 ; / 2.', 'Each vertex to the n − 1 others, divided by 2.']),
      example(['**Contrôle, exercice 1, Q7** : graphe d\'ordre 7 avec 10 arêtes. K7 a 7 × 6 / 2 = **21** arêtes → il faut en ajouter **21 − 10 = 11**.', 'K7 = 21 → zid **11**.', 'K7 has 21 edges → add **11**.']),
      quiz('ro-05', 'ro-06', 'ro-07'),

      h(['2. Graphe planaire et graphe biparti', '2. Planaire w biparti', '2. Planar and bipartite graphs']),
      def(['**Planaire** : on peut le dessiner de sorte que les arêtes **ne se rencontrent qu\'aux sommets** (aucun croisement). **Biparti** : on peut partager S en deux parties **S1 et S2** telles qu\'il n\'y ait **aucune arête entre éléments de S1** et **aucune entre éléments de S2** (toutes les arêtes vont de S1 à S2).', '**Planaire** : bla croisement. **Biparti** : S = S1 + S2, arêtes ghir bin S1 w S2.', '**Planar**: drawable with no crossing. **Bipartite**: S splits into S1, S2 with edges only between them.']),
      tip(['Test rapide : un graphe est biparti **si et seulement s\'il n\'a aucun cycle de longueur impaire** (ex. un triangle l\'empêche d\'être biparti).', 'Biparti ⇔ **bla cycle impair** (triangle = la).', 'Bipartite ⇔ **no odd cycle**.']),

      h(['3. Coloration et nombre chromatique', '3. Coloration w nombre chromatique', '3. Colouring and chromatic number']),
      def(['Une **coloration** attribue une couleur à chaque sommet de sorte que **deux sommets adjacents n\'aient jamais la même couleur**. Le **nombre chromatique χ(G)** est le **nombre minimal de couleurs** nécessaire. Pour un graphe **planaire**, χ(G) ≤ **4**.', '**Coloration** : jiran ma ykounouch b nefs lloun. **χ(G)** = **a9al 3adad alwan**. Planaire → χ ≤ **4**.', '**Colouring**: adjacent vertices never share a colour. **χ(G)** = the **minimum number of colours**. Planar → χ ≤ **4**.']),
      steps(['Méthode pour encadrer puis trouver χ (exercice des bancs du TD)', 'Méthode bach tl9a χ', 'How to bound then find χ'], [
        { t: ['Minorant', 'Minorant', 'Lower bound'], b: ['χ ≥ taille de la plus grande **clique** (sommets tous reliés entre eux). Un triangle → χ ≥ 3.', 'χ ≥ akbar **clique** (triangle → 3).', 'χ ≥ largest **clique** (triangle → 3).'] },
        { t: ['Majorant', 'Majorant', 'Upper bound'], b: ['χ ≤ **degré maximal + 1** (on trouve toujours une couleur libre).', 'χ ≤ **degré max + 1**.', 'χ ≤ **max degree + 1**.'] },
        { t: ['Colorier (Welsh-Powell)', 'Lowwen (Welsh-Powell)', 'Colour (Welsh-Powell)'], b: ['Trier les sommets par **degré décroissant** ; donner la couleur 1 au premier puis à tous les sommets non adjacents à ceux déjà en couleur 1 ; recommencer avec la couleur 2…', 'Rtteb b **degré mn kbir l sghir** ; lloun 1 l ay wa7ed ma jarch…', 'Sort by **decreasing degree**; give colour 1 to each vertex not adjacent to colour-1 ones; repeat.'] },
        { t: ['Conclure', 'Conclure', 'Conclude'], b: ['Si le nombre de couleurs utilisé = le minorant, c\'est **χ**.', 'Ila = minorant → **χ**.', 'If it equals the lower bound, that is **χ**.'] }
      ]),
      quiz('ro-30', 'ro-31', 'ro-32', 'ro-33')
    ],
    keyPoints: [
      k('Simple : sans boucle, au plus une arête entre deux sommets. Kn : n(n−1)/2 arêtes.', 'Simple ; Kn = n(n−1)/2.', 'Simple; Kn has n(n−1)/2 edges.'),
      k('Planaire : sans croisement ; biparti : S1 / S2 sans arête interne ⇔ pas de cycle impair.', 'Planaire, biparti.', 'Planar; bipartite ⇔ no odd cycle.'),
      k('χ(G) = minimum de couleurs ; clique ≤ χ ≤ degré max + 1 ; planaire → χ ≤ 4.', 'χ(G).', 'χ(G) bounds.')
    ]
  },

  arbres: {
    title: k('Chap 5 — Arbres et forêts : Kruskal et Prim', 'Fasl 5 — Arbres w forêts : Kruskal w Prim', 'Ch. 5 — Trees and forests: Kruskal and Prim'),
    summary: k('Arbre, racine, arborescence, propriétés équivalentes, arbre couvrant, formule n^(n−2), arbre couvrant de poids minimum, algorithmes de Kruskal et de Prim avec les tableaux du cours, animés pas à pas.', 'Arbre, arbre couvrant, n^(n−2), Kruskal w Prim b tableaux.', 'Trees, spanning trees, n^(n−2), minimum spanning tree, Kruskal and Prim with the course tables.'),
    estimatedMinutes: 50,
    sections: [
      h(['1. Arbre, racine, arborescence', '1. Arbre, racine, arborescence', '1. Tree, root, arborescence']),
      def(['Un **arbre** est un graphe **non orienté, connexe et sans cycle**. Dans un graphe orienté, une **racine** est un sommet r tel qu\'il existe un chemin de r à tout autre sommet. Une **arborescence** est un graphe orienté avec une racine et **un seul chemin** de la racine à chaque sommet. (Un cycle orienté s\'appelle un **circuit**.)', '**Arbre** : **non orienté, connexe, bla cycle**. **Racine** : mnha chemin l kol sommet. **Arborescence** : orienté, racine, **chemin wa7ed** l kol sommet.', 'A **tree** is **undirected, connected and acyclic**. A **root** reaches every vertex; an **arborescence** has a root and **one path** to each vertex.']),
      p(['**Proposition** (G non orienté à n sommets) — ces phrases sont **équivalentes** :\n1. G est **connexe sans cycle** ;\n2. G est **connexe et a n − 1 arêtes** ;\n3. G est **sans cycle et a n − 1 arêtes**.\n\nApplications : réseaux de communication **à moindre coût**, plans d\'urbanisme et routes, **câblage optimal**.', '**Proposition** : connexe bla cycle ⇔ connexe + **n − 1** arêtes ⇔ bla cycle + **n − 1** arêtes. Applications : réseaux rkhas, trou9, câblage.', '**Proposition**: connected acyclic ⇔ connected with **n − 1** edges ⇔ acyclic with **n − 1** edges. Uses: cheapest networks, roads, cabling.']),
      def(['Un **arbre couvrant** d\'un graphe G est un arbre (connexe, sans cycle) **contenant tous les sommets de G**. Dans un graphe **pondéré**, l\'**arbre couvrant de poids minimum (ACPM)** est celui dont la **somme des poids est minimale**.', '**Arbre couvrant** : arbre fih **ga3 sommets**. **ACPM** : majmou3 dyal wazn **sghir ma ymken**.', 'A **spanning tree** contains **every vertex**; the **minimum spanning tree** has the **smallest total weight**.']),
      formula('\\text{nombre d\'arbres couvrants de } K_n = n^{\\,n-2}', ['Propriété du cours (formule de Cayley). Ex. K5 : 5³ = **125**.', 'K5 : 125.', 'K5: 125.']),
      quiz('ro-40', 'ro-41', 'ro-42'),

      h(['2. Algorithme de Kruskal', '2. Kruskal', '2. Kruskal\'s algorithm']),
      steps(['Les étapes du cours', 'Étapes dyal dars', 'The course steps'], [
        { t: ['Trier', 'Rtteb', 'Sort'], b: ['Trier toutes les arêtes par **poids croissant**.', 'Rtteb arêtes mn **sghir l kbir**.', 'Sort edges by **increasing weight**.'] },
        { t: ['Partir de rien', 'Bda b walou', 'Start empty'], b: ['Arbre T **vide**, poids 0.', 'T **khawi**, wazn 0.', 'Empty tree T, weight 0.'] },
        { t: ['Ajouter si pas de cycle', 'Zid ila bla cycle', 'Add unless it makes a cycle'], b: ['Prendre l\'arête suivante : si elle **ne crée pas de cycle** → ✓ on l\'ajoute ; sinon → ✗ on l\'élimine.', 'Ila **ma katdirch cycle** → ✓, sinon ✗.', '**No cycle** → ✓ add; otherwise ✗ skip.'] },
        { t: ['S\'arrêter', 'Wa9ef', 'Stop'], b: ['Quand **tous les sommets** sont reliés, c\'est-à-dire après **n − 1** arêtes acceptées.', 'Mli **n − 1** arêtes.', 'After **n − 1** accepted edges.'] }
      ]),
      anim('GraphAlgo', { graph: CC, algo: 'kruskal', pos: POS_CC }),
      exam(['Au contrôle, présente le **tableau « Poids | Arête | à choisir ✓ / à éliminer ✗ »** exactement comme dans le cours, puis la liste des arêtes de l\'arbre et le **poids total** (somme des ✓).', 'F contrôle, dir **tableau « Wazn | Arête | ✓ / ✗ »** b7al dars, w l **wazn total**.', 'In the test, draw the **"Weight | Edge | ✓ / ✗" table** exactly as in class, then the tree and its **total weight**.']),
      quiz('ro-43', 'ro-45'),

      h(['3. Algorithme de Prim', '3. Prim', '3. Prim\'s algorithm']),
      steps(['Les étapes du cours', 'Étapes', 'The course steps'], [
        { t: ['Sommet initial', 'Sommet dyal bdya', 'Start vertex'], b: ['Choisir un sommet de départ (arbitraire) et l\'ajouter à l\'ACPM.', 'Khtar sommet w zido.', 'Pick a start vertex.'] },
        { t: ['Meilleure arête sortante', 'A7ssen arête khareja', 'Cheapest leaving edge'], b: ['Sélectionner l\'arête de **poids minimum** qui relie un sommet **dans** l\'arbre à un sommet **hors** de l\'arbre ; ajouter l\'arête et ce sommet.', 'Arête **min** bin **dakhel** w **bra** dyal arbre.', 'The **minimum** edge from **inside** the tree to **outside**.'] },
        { t: ['Répéter', '3awed', 'Repeat'], b: ['Jusqu\'à ce que **tous les sommets** soient dans l\'arbre.', 'Ta ga3 sommets.', 'Until every vertex is in.'] },
        { t: ['Le tableau', 'Tableau', 'The table'], b: ['Colonnes = sommets ; chaque ligne = l\'ensemble S déjà pris, et pour chaque sommet hors de S « **poids ; prédécesseur** » (∞ si pas encore relié). On prend le plus petit, on met à jour.', 'Kol str : S w « **wazn ; préd** » (∞ ila mazal).', 'Each row: set S and "**weight ; predecessor**" (∞ if unreached).'] }
      ]),
      anim('GraphAlgo', { graph: PRIMC, algo: 'prim', start: 'A' }),
      example(['**Exemple du cours** : depuis A, on obtient l\'arbre {B,D}, {B,C}, {A,D}, {E,F}, {C,F} de poids 4 + 2 + 1 + 3 + 4 = **14**. L\'exercice à 9 sommets (départ 1) donne un arbre de poids **37**.', 'Mn A : arbre b wazn **14**. Exercice 9 sommets : **37**.', 'From A: tree of weight **14**. The 9-vertex exercise gives **37**.']),
      anim('GraphAlgo', { graph: PRIM9, algo: 'prim', start: '1' }),
      table([['Critère', 'Mi3yar', 'Criterion'], ['Kruskal', 'Kruskal', 'Kruskal'], ['Prim', 'Prim', 'Prim']], [
        [['Point de départ', 'Bdya', 'Start'], ['Aucun : toutes les arêtes triées', 'Walou : arêtes mrttbin', 'None: all edges sorted'], ['Un sommet choisi', 'Sommet', 'One vertex']],
        [['Pendant l\'algo', 'F l west', 'During'], ['Une **forêt** qui se rejoint', '**Forêt**', 'A **forest** merging'], ['**Un seul arbre** qui grandit', '**Arbre wa7ed** kaykbar', '**One tree** growing']],
        [['Résultat', 'Natija', 'Result'], ['Même poids minimal', 'Nefs wazn', 'Same minimal weight'], ['Même poids minimal', 'Nefs wazn', 'Same minimal weight']]
      ]),
      quiz('ro-44', 'ro-46')
    ],
    keyPoints: [
      k('Arbre : non orienté, connexe, sans cycle ⇔ connexe à n − 1 arêtes ⇔ sans cycle à n − 1 arêtes.', 'Arbre, n − 1.', 'Tree, n − 1 edges.'),
      k('Arbre couvrant : contient tous les sommets ; Kn en a n^(n−2).', 'n^(n−2).', 'Kn has n^(n−2) spanning trees.'),
      k('Kruskal : trier, ajouter si pas de cycle, stop à n − 1 arêtes. Prim : depuis un sommet, arête min vers l\'extérieur.', 'Kruskal / Prim.', 'Kruskal / Prim.'),
      k('Contrôle 2025 : ACPM A–F, C–D, A–D, E–F, B–D, coût 15.', 'ACPM = 15.', 'Exam MST cost 15.')
    ]
  },

  dijkstra: {
    title: k('Chap 6 — Plus court chemin : algorithme de Dijkstra', 'Fasl 6 — A9sar tri9 : Dijkstra', 'Ch. 6 — Shortest path: Dijkstra\'s algorithm'),
    summary: k('Principe, étapes, tableau d\'itérations et lecture du chemin à rebours, sur la partie B du contrôle 2025 (B → E).', 'Dijkstra b tableau 3la Partie B dyal contrôle (B → E).', 'Principle, steps, iteration table and path reconstruction on exam part B (B → E).'),
    estimatedMinutes: 35,
    sections: [
      h(['1. Le problème', '1. L mochkil', '1. The problem']),
      p(['Graphe **pondéré à poids positifs** (temps, distances). On cherche la chaîne de **poids total minimal** d\'un sommet de départ à tous les autres. Dijkstra **fixe** à chaque étape le sommet non fixé de plus petite distance provisoire : sa distance est alors **définitive**.', 'Graphe b wazn **mojab**. Bghina **a9sar tri9** mn sommet l kolchi. Dijkstra kay**fixi** kol merra sommet li 3ando **a9al distance**.', 'Weighted graph with **non-negative** weights. Dijkstra **fixes** at each step the unfixed vertex with the smallest tentative distance — it is then **final**.']),
      steps(['Les étapes', 'Les étapes', 'The steps'], [
        { t: ['Initialiser', 'Bda', 'Initialise'], b: ['d(départ) = 0, d(autres) = ∞, aucun prédécesseur.', 'd(départ) = 0, l ba9i ∞.', 'd(start) = 0, others ∞.'] },
        { t: ['Fixer le minimum', 'Fixi l min', 'Fix the minimum'], b: ['Parmi les sommets non fixés, prendre celui de plus petite distance ; il devient **fixé**.', 'Khod a9al distance → **fixé**.', 'Take the smallest distance → **fixed**.'] },
        { t: ['Relâcher ses voisins', 'Beddel jiran', 'Relax neighbours'], b: ['Pour chaque voisin v non fixé : si d(u) + poids(u, v) < d(v), alors d(v) ← d(u) + poids(u, v) et **prédécesseur(v) = u**. On note « distance ; prédécesseur ».', 'Ila d(u) + w < d(v) → beddel w **préd = u**.', 'If d(u) + w < d(v), update and set **pred(v) = u**.'] },
        { t: ['Répéter puis remonter', '3awed w rje3', 'Repeat then backtrack'], b: ['Quand la cible est fixée, on lit le chemin **à l\'envers** en suivant les prédécesseurs.', 'Rje3 b **les prédécesseurs**.', 'Follow **predecessors** back from the target.'] }
      ]),
      anim('GraphAlgo', { graph: CC, algo: 'dijkstra', start: 'B', target: 'E', pos: POS_CC }),
      steps(['Contrôle 2025, partie B : de B à E', 'Partie B : B → E', 'Exam part B: B to E'], [
        { t: ['Départ B', 'Bda B', 'Start B'], b: ['On fixe B (0). Voisins : C = 9 ; B, D = 5 ; B.', 'B = 0 → C 9, D 5.', 'B = 0 → C 9, D 5.'] },
        { t: ['Fixer D (5)', 'Fixi D (5)', 'Fix D (5)'], b: ['Via D : A = 5 + 3 = 8 ; C = 5 + 2 = **7** < 9 (mise à jour) ; E = 5 + 12 = 17 ; F = 5 + 5 = 10.', 'A 8, C 7, E 17, F 10.', 'A 8, C 7, E 17, F 10.'] },
        { t: ['Fixer C (7) puis A (8)', 'C (7) w A (8)', 'Fix C (7) then A (8)'], b: ['Via C : F = 7 + 3 = 10 (pas mieux). Via A : E = 8 + 7 = **15** < 17 ; F = 8 + 2 = 10 (égal).', 'E 15.', 'E becomes 15.'] },
        { t: ['Fixer F (10)', 'Fixi F (10)', 'Fix F (10)'], b: ['Via F : E = 10 + 3 = **13** < 15 → prédécesseur de E = F.', 'E = **13** (préd F).', 'E = **13** (pred F).'] },
        { t: ['Fixer E (13) et remonter', 'E (13) w rje3', 'Fix E (13) and backtrack'], b: ['E ← F ← D ← B : chemin **B – D – F – E**, temps minimal **13 minutes**.', '**B–D–F–E = 13 min**.', '**B–D–F–E = 13 minutes**.'] }
      ]),
      trap(['Ne jamais mettre à jour un sommet **déjà fixé**, et ne pas s\'arrêter dès qu\'on « voit » la cible (17 puis 15) : sa distance n\'est définitive que **quand elle est fixée** (13).', 'Ma tbeddelch sommet **fixé**, w ma twa9efch 9bel ma tfixi l cible.', 'Never update a **fixed** vertex; the target is final only **once fixed**.']),
      quiz('ro-50', 'ro-51', 'ro-52', 'ro-53', 'ro-54')
    ],
    keyPoints: [
      k('Dijkstra : poids ≥ 0 ; on fixe le sommet de plus petite distance, on relâche ses voisins, on note « distance ; prédécesseur ».', 'Dijkstra.', 'Dijkstra rules.'),
      k('Le chemin se lit à rebours avec les prédécesseurs.', 'Rje3 b préd.', 'Backtrack with predecessors.'),
      k('Contrôle 2025 : B → E = B–D–F–E, 13 minutes.', 'B → E = 13.', 'Exam: B → E = 13.')
    ]
  },

  annale: {
    title: k('Annale — Contrôle continu RO 2025-2026 corrigé', 'Annale — Contrôle RO 2025-2026 m-corrigé', 'Past paper — RO mid-term 2025-2026 solved'),
    summary: k('Le contrôle du 28/11/2025 (1h30) : énoncé et correction détaillée des 3 exercices, avec les graphes animés.', 'Contrôle 28/11/2025 : énoncé w correction kamla.', 'The 28/11/2025 test: statement and full solution of the 3 exercises.'),
    estimatedMinutes: 60,
    sections: [
      h(['Exercice 1 (6 points) — le graphe A à G', 'Exercice 1 (6 points)', 'Exercise 1 (6 points)']),
      anim('GraphAlgo', { graph: EX1, algo: 'degrees' }),
      steps(['Correction', 'Correction', 'Solution'], [
        { t: ['Q1 — Ordre et taille', 'Q1 — Ordre w taille', 'Q1 — Order and size'], b: ['Ordre = **7** sommets ; taille = **10** arêtes.', '**7** ; **10**.', '**7**; **10**.'] },
        { t: ['Q2 — Degré de E', 'Q2 — Degré dyal E', 'Q2 — Degree of E'], b: ['E est relié à B et F → **d(E) = 2**.', 'E m3a B w F → **2**.', 'E – B, E – F → **2**.'] },
        { t: ['Q3 — Sommets impairs', 'Q3 — Impairs', 'Q3 — Odd vertices'], b: ['Degrés : A 3, B 3, C 4, D 3, E 2, F 3, G 2 → impairs **A, B, D, F** (4, nombre pair ✓ ; somme 20 = 2 × 10 ✓).', '**A, B, D, F**.', '**A, B, D, F**.'] },
        { t: ['Q4 — Chaîne de longueur 3 de F à B', 'Q4 — Chaîne F → B', 'Q4 — Chain F to B'], b: ['**F – C – A – B** (3 arêtes).', '**F–C–A–B**.', '**F–C–A–B**.'] },
        { t: ['Q5 — Voisins de C', 'Q5 — Jiran C', 'Q5 — Neighbours of C'], b: ['**A, B, D, F**.', '**A, B, D, F**.', '**A, B, D, F**.'] },
        { t: ['Q6 — Cycle hamiltonien', 'Q6 — Hamilton', 'Q6 — Hamiltonian cycle'], b: ['Oui : **A – B – E – F – G – D – C – A** (chaque sommet une fois, retour en A).', 'Ah : **A–B–E–F–G–D–C–A**.', 'Yes: **A–B–E–F–G–D–C–A**.'] },
        { t: ['Q7 — Pour être complet', 'Q7 — Complet', 'Q7 — To be complete'], b: ['K7 : 7 × 6 / 2 = 21 arêtes → ajouter **11**.', '21 − 10 = **11**.', '21 − 10 = **11**.'] }
      ]),
      h(['Exercice 2 (8 points) — le réseau de transport', 'Exercice 2 (8 points)', 'Exercise 2 (8 points)']),
      steps(['Questions 1 à 4', 'Q1 l Q4', 'Questions 1 to 4'], [
        { t: ['Q1 — Tracer le graphe', 'Q1 — Rsem', 'Q1 — Draw'], b: ['Arêtes lues dans la matrice (triangle supérieur) : A–C, A–D, A–E, A–F, B–C, B–D, C–D, C–F, D–E, D–F, E–F.', '11 arêtes.', '11 edges.'] },
        { t: ['Q2 — Complet ? connexe ?', 'Q2', 'Q2'], b: ['**Pas complet** : A et B ne sont pas reliés (il manque 15 − 11 = 4 arêtes). **Connexe** : D est relié à tous les autres sommets.', '**Machi complet** (A–B) ; **connexe** (D m3a kolchi).', '**Not complete** (A–B missing); **connected** (D reaches all).'] },
        { t: ['Q3 — Degrés', 'Q3 — Degrés', 'Q3 — Degrees'], b: ['A 4, B 2, C 4, D 5, E 3, F 4 (somme 22 = 2 × 11 ✓).', 'A4 B2 C4 D5 E3 F4.', 'A4 B2 C4 D5 E3 F4.'] },
        { t: ['Q4 — Chaque ligne une seule fois', 'Q4', 'Q4'], b: ['2 sommets impairs (D, E) → **chaîne eulérienne** de D à E : **D–A–C–B–D–C–F–A–E–D–F–E**.', 'Chaîne eulérienne D → E.', 'Eulerian chain D → E.'] }
      ]),
      anim('GraphAlgo', { graph: CC, algo: 'kruskal', pos: POS_CC, title: 'Partie A — Kruskal (coût minimal 15)' }),
      anim('GraphAlgo', { graph: CC, algo: 'dijkstra', start: 'B', target: 'E', pos: POS_CC, title: 'Partie B — Dijkstra B → E (13 min)' }),
      p(['**Partie A** : algorithme de **Kruskal** → arêtes A–F (2), C–D (2), A–D (3), E–F (3), B–D (5) ; C–F et A–C rejetées (cycle) → **coût 15 000 DH**. **Partie B** : **Dijkstra** depuis B → **B–D–F–E**, **13 minutes**.', '**A** : Kruskal → **15**. **B** : Dijkstra → **B–D–F–E = 13 min**.', '**Part A**: Kruskal → **15**. **Part B**: Dijkstra → **B–D–F–E, 13 min**.']),
      h(['Exercice 3 (6 points)', 'Exercice 3 (6 points)', 'Exercise 3 (6 points)']),
      p(['**1.** Degrés 4, 3, 3, 2, 1 : somme **13 impaire** → **impossible** (la somme des degrés vaut 2 × nombre d\'arêtes). **2.** Graphe orienté A→B, A→C, B→A, B→C, C→A : voir le chapitre « Représentation matricielle » — M⁴ donne A→B : 1, B→A : 3, B→C : 3 chemins de longueur 4, et **8** circuits de longueur 4 (trace).', '**1.** Somme 13 → **impossible**. **2.** M⁴ : 1, 3, 3 ; trace **8**.', '**1.** Sum 13 → **impossible**. **2.** M⁴: 1, 3, 3; trace **8**.']),
      exam(['Barème : Ex. 1 = 6 pts, Ex. 2 = 8 pts (une seule partie A **ou** B à traiter), Ex. 3 = 6 pts. Durée 1h30, calculatrice autorisée, documents interdits.', 'Ex 1 = 6, Ex 2 = 8 (A **wla** B), Ex 3 = 6. 1h30.', 'Ex. 1 = 6, Ex. 2 = 8 (part A **or** B), Ex. 3 = 6. 1h30.'])
    ],
    keyPoints: [
      k('Ex. 1 : ordre 7, taille 10, d(E) = 2, impairs A B D F, hamiltonien A–B–E–F–G–D–C–A, 11 arêtes manquantes.', 'Ex. 1.', 'Ex. 1 answers.'),
      k('Ex. 2 : non complet, connexe, chaîne eulérienne D → E ; ACPM 15 ; B → E = 13 (B–D–F–E).', 'Ex. 2.', 'Ex. 2 answers.'),
      k('Ex. 3 : 4, 3, 3, 2, 1 impossible ; M⁴ → 1, 3, 3 et trace 8.', 'Ex. 3.', 'Ex. 3 answers.')
    ]
  }
};
