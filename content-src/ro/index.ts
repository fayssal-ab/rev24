import { COURSE } from './course';
import { exercises as roExams } from './exams';
import { setCtx, L, h, p, code, tip, trap, exam, quiz, single, multi, num, ex, fc, ref, type T } from '../lib';
import type { Module, Chapter, Question, Exercise, Flashcard, RefEntry } from '../../src/lib/schema';

const CC = 'A B C D E F | A-C:4 A-D:3 A-E:7 A-F:2 B-C:9 B-D:5 C-D:2 C-F:3 D-E:12 D-F:5 E-F:3';
const EX1 = 'A B C D E F G | A-B A-C A-D B-C B-E C-D C-F D-G E-F F-G';
const DIR3 = '1 2 3 | 1>2 1>3 2>1 2>3 3>1';
const C22 = 'A B C D E F | A-B A-D A-F B-C B-D B-E C-D D-E';
const VILLES = '1 2 3 4 5 | 1-2:3 1-3:5 1-4:11 1-5:9 2-3:3 2-5:8 3-4:9 3-5:10 4-5:7';
const TRAJET = 'M B C D E F T | M>B:5 M>D:8 D>M:8 B>E:15 B>C:6 C>B:6 C>E:17 E>C:17 E>T:11 D>C:1 C>F:8 F>C:8 D>F:14 F>D:14 F>T:6 T>F:6';
const PRIM9 = '1 2 3 4 5 6 7 8 9 | 1-2:4 1-3:5 4-5:3 5-8:6 5-6:4 6-7:2 8-9:7 3-9:6 2-3:8 2-4:9 3-4:10 4-6:8 6-9:9 7-8:11 7-9:10';

const chap = (id: string, order: number, title: T, summary: T, sections: Chapter['sections'], keyPoints: T[]): Chapter => ({
  id, module: 'ro', order, title: L(title), summary: L(summary), estimatedMinutes: 30, sections, keyPoints: keyPoints.map(L)
});
const Q: Question[] = [];
const E: Exercise[] = [];
const F: Flashcard[] = [];
const R: RefEntry[] = [];

// ---------------- 1. définitions ----------------
setCtx('ro', 'defs');
Q.push(
  single('ro-01', 1, ['L\'**ordre** d\'un graphe est…', '**Ordre** dyal graphe howa…', 'The **order** of a graph is…'], [['le nombre de sommets', 'ch7al mn sommet', 'the number of vertices'], ['le nombre d\'arêtes', 'ch7al mn arête', 'the number of edges'], ['le degré maximal', 'akbar degré', 'the max degree']], 0,
    ['Ordre = nombre de sommets ; **taille** = nombre d\'arêtes.', 'Ordre = sommets ; taille = arêtes.', 'Order = vertices; **size** = edges.'], [['C\'est la taille.', 'Hadi taille.', 'That is the size.'], ['Non.', 'La.', 'No.']], ['defs']),
  single('ro-02', 2, ['Comment compte-t-on une **boucle** dans le degré ?', 'Boucle f degré ?', 'How does a **loop** count in the degree?'], [['2 fois', 'Jouj merrat', 'Twice'], ['1 fois', 'Merra', 'Once'], ['0', '0', '0']], 0,
    ['Une boucle compte **2** dans le degré du sommet.', 'Boucle = 2.', 'A loop counts **2**.'], [['Faux : 2.', 'Ghalat : 2.', 'Wrong: 2.'], ['Faux : 2.', 'Ghalat : 2.', 'Wrong: 2.']], ['degres']),
  single('ro-03', 2, ['Pourquoi la somme des degrés est-elle toujours paire ?', '3lach somme dyal degrés dima pair ?', 'Why is the degree sum always even?'], [['Σ deg = 2 × nombre d\'arêtes', 'Σ deg = 2 × arêtes', 'Σ deg = 2 × edges'], ['Les graphes ont un nombre pair de sommets', 'Sommets pair', 'Even number of vertices'], ['Par convention', 'Convention', 'By convention']], 0,
    ['Chaque arête a 2 extrémités : Σ deg = 2m. Corollaire : le nombre de sommets de degré impair est **pair**.', 'Kol arête 3endha 2 tarf : Σ = 2m.', 'Each edge has 2 ends: Σ deg = 2m. Hence an even number of odd vertices.'], [['Faux.', 'Ghalat.', 'False.'], ['C\'est un théorème.', 'Théorème.', 'It is a theorem.']], ['degres']),
  single('ro-04', 3, ['Existe-t-il un graphe de degrés 4, 3, 3, 2, 1 ?', 'Kayn graphe b degrés 4,3,3,2,1 ?', 'Is there a graph with degrees 4, 3, 3, 2, 1?'], [['Non, la somme 13 est impaire', 'La, 13 impair', 'No, the sum 13 is odd'], ['Oui', 'Ah', 'Yes'], ['Oui si on ajoute une boucle', 'Ah b boucle', 'Yes with a loop']], 0,
    ['Σ = 13 impaire, or Σ deg = 2m doit être pair → **impossible** (contrôle, ex. 3.1).', '13 impair → impossible.', '13 is odd → **impossible**.'], [['Impossible.', 'Impossible.', 'Impossible.'], ['Une boucle ajoute 2 : la parité ne change pas.', 'Boucle +2.', 'A loop adds 2: parity unchanged.']], ['degres', 'annale']),
  num('ro-05', 1, ['Nombre d\'arêtes de K7 ?', 'Ch7al arête f K7 ?', 'Edges of K7?'], 21, 0, ['n(n−1)/2 = 7×6/2 = **21**.', '7×6/2 = 21.', '7×6/2 = **21**.'], {}, ['complet'], { fn: 'completeEdges', args: [7] }),
  num('ro-06', 2, ['Nombre d\'arêtes de K10 ?', 'K10 ?', 'Edges of K10?'], 45, 0, ['10×9/2 = **45**.', '45.', '**45**.'], {}, ['complet'], { fn: 'completeEdges', args: [10] }),
  multi('ro-07', 2, ['Un **graphe simple** est un graphe…', 'Graphe **simple** ?', 'A **simple graph** has…'], [['sans boucle', 'bla boucle', 'no loop'], ['avec au plus une arête entre deux sommets', 'arête wa7da max', 'at most one edge between two vertices'], ['forcément connexe', 'dima connexe', 'always connected']], [0, 1],
    ['Simple = pas de boucle, pas d\'arêtes multiples.', 'Bla boucle, bla multiples.', 'No loops, no multiple edges.'], [['Un graphe simple peut être non connexe.', 'Momkin ma connexe.', 'May be disconnected.']], ['defs'])
);
F.push(
  fc('fc-ro-1', ['Ordre / taille ?', 'Ordre / taille ?', 'Order / size?'], ['Nombre de sommets / nombre d\'arêtes.', 'Sommets / arêtes.', 'Vertices / edges.']),
  fc('fc-ro-2', ['Théorème des degrés ?', 'Théorème degrés ?', 'Degree theorem?'], ['Σ deg = 2 × arêtes ; nb de sommets impairs pair.', 'Σ = 2m.', 'Σ deg = 2m; even number of odd vertices.']),
  fc('fc-ro-3', ['Arêtes de Kn ?', 'Kn ?', 'Edges of Kn?'], ['n(n−1)/2', 'n(n−1)/2', 'n(n−1)/2']),
  fc('fc-ro-4', ['Graphe simple ?', 'Simple ?', 'Simple graph?'], ['Sans boucle ni arête multiple.', 'Bla boucle w multiples.', 'No loops, no multi-edges.'])
);
R.push(ref('r-ro-1', 'Σ deg(v) = 2|A|', ['Lemme des poignées de main', 'Somme degrés', 'Handshake lemma']), ref('r-ro-2', '|A(Kn)| = n(n−1)/2', ['Graphe complet', 'Complet', 'Complete graph']));

const c1 = chap('defs', 1, ['Graphes : définitions et terminologie', 'Graphes : ta3arif', 'Graphs: definitions'], ['Sommets, arêtes, arcs, ordre, taille, degré, graphe simple et complet.', 'Sommets, arêtes, degré.', 'Vertices, edges, degree, simple and complete graphs.'], [
  h(['Définitions', 'Ta3arif', 'Definitions']),
  p(['Un graphe **non orienté** G = (S, A) : S ensemble non vide de **sommets**, A ensemble d\'**arêtes** {s1, s2} (s1 et s2 sont **adjacents** ; boucle = extrémités confondues). **Orienté** : couples (s1, s2) = **arcs**. Applications : transports, réseaux, tournois.', 'G = (S, A) : sommets w arêtes. Orienté : arcs.', 'An **undirected** graph G = (S, A): vertices and **edges** {s1, s2}; **directed**: **arcs** (s1, s2).']),
  code('S = {1,…,7}\nA = {{1,3},{1,4},{7,1},{3,4},{5,3},{3,6},{3,7},{7,4},{3}}', 'text', ['Exemple du cours ({3} = boucle)', 'Mithal ({3} = boucle)', 'Course example ({3} = loop)']),
  p(['**Ordre** = nombre de sommets, **taille** = nombre d\'arêtes, **degré** d(s) = arêtes incidentes (boucle = 2). **Σ deg = 2 × taille**. **Simple** : sans boucle ni arête multiple. **Complet Kn** : tous les sommets adjacents, **n(n−1)/2** arêtes.', 'Ordre, taille, degré (boucle = 2), Σ = 2m, Kn = n(n−1)/2.', 'Order, size, degree (loop = 2), Σ deg = 2m, Kn has n(n−1)/2 edges.']),
  exam(['« Degrés 4, 3, 3, 2, 1 » : impossible car la somme est impaire.', '4,3,3,2,1 : impossible.', '"Degrees 4,3,3,2,1": impossible (odd sum).']),
  quiz('ro-03', 'ro-04', 'ro-05')
], [['Σ deg = 2 × taille ; nombre pair de sommets impairs.', 'Σ = 2m.', 'Σ deg = 2m.'], ['Kn : n(n−1)/2 arêtes.', 'Kn.', 'Kn: n(n−1)/2.']]);

// ---------------- 2. matrices ----------------
setCtx('ro', 'matrices');
Q.push(
  single('ro-10', 1, ['La matrice d\'adjacence d\'un graphe non orienté est…', 'Matrice non orienté ?', 'The adjacency matrix of an undirected graph is…'], [['symétrique', 'symétrique', 'symmetric'], ['triangulaire', 'triangulaire', 'triangular'], ['diagonale', 'diagonale', 'diagonal']], 0,
    ['mij = mji. Graphe simple → diagonale nulle.', 'Symétrique.', 'mij = mji; simple → zero diagonal.'], [['Non.', 'La.', 'No.'], ['Non.', 'La.', 'No.']], ['matrices']),
  single('ro-11', 2, ['(M^k)ij représente…', '(M^k)ij ?', '(M^k)ij is…'], [['le nombre de chemins de longueur k de si à sj', 'ch7al chemin dyal toul k', 'the number of walks of length k from si to sj'], ['la distance', 'distance', 'the distance'], ['le degré', 'degré', 'the degree']], 0,
    ['Puissance k de la matrice = nombre de chemins de longueur k ; trace(M^k) = circuits fermés de longueur k.', 'M^k = chemins ; trace = circuits.', 'M^k counts length-k walks; trace counts closed ones.'], [['Non.', 'La.', 'No.'], ['Non.', 'La.', 'No.']], ['matrices']),
  num('ro-12', 3, ['Graphe orienté 1→2, 1→3, 2→1, 2→3, 3→1 : nombre de chemins de longueur 4 de 1 à 1 ?', 'Chemins 4 mn 1 l 1 ?', 'Walks of length 4 from 1 to 1?'], 4, 0, ['Calculer M^4 ; coefficient (1,1).', '(M^4)11.', 'Entry (1,1) of M^4.'], {}, ['matrices', 'annale'], { fn: 'gPaths', args: [DIR3, 4, '1', '1'] }),
  num('ro-13', 3, ['Même graphe : nombre de circuits de longueur 4 = trace(M^4) ?', 'trace(M^4) ?', 'trace(M^4)?'], 8, 0, ['Somme de la diagonale de M^4.', 'Somme diagonale.', 'Sum of the diagonal.'], {}, ['matrices', 'annale'], { fn: 'gTracePow', args: [DIR3, 4] }),
  num('ro-14', 2, ['Même graphe : chemins de longueur 2 de 1 à 3 ?', 'Chemins 2 mn 1 l 3 ?', 'Length-2 walks from 1 to 3?'], 1, 0, ['(M²)13.', '(M²)13.', '(M²)13.'], {}, ['matrices'], { fn: 'gPaths', args: [DIR3, 2, '1', '3'] })
);
F.push(
  fc('fc-ro-5', ['Matrice d\'adjacence ?', 'Matrice ?', 'Adjacency matrix?'], ['mij = nombre d\'arêtes (arcs i→j) ; symétrique si non orienté.', 'mij = arêtes.', 'mij = number of edges (arcs i→j).']),
  fc('fc-ro-6', ['M^k ?', 'M^k ?', 'M^k?'], ['(M^k)ij = chemins de longueur k ; trace = circuits de longueur k.', 'Chemins / circuits.', 'Walks of length k; trace = closed walks.']),
  fc('fc-ro-7', ['Matrice sommet-arc ?', 'Sommet-arc ?', 'Incidence matrix?'], ['1 sortant, −1 entrant, 0 sinon.', '1, −1, 0.', '1 out, −1 in, 0 otherwise.'])
);
const c2 = chap('matrices', 2, ['Représentation matricielle', 'Matrices', 'Matrix representation'], ['Matrices d\'adjacence et d\'incidence, puissances M^k.', 'Adjacence, M^k.', 'Adjacency, incidence, powers.'], [
  h(['Matrice d\'adjacence', 'Matrice d\'adjacence', 'Adjacency matrix']),
  p(['M(G) n×n : **mij = nombre d\'arêtes** entre si et sj (orienté : arcs de si vers sj). Non orienté → symétrique ; simple → diagonale nulle ; orienté → somme des coefficients = nombre d\'arcs. Matrice **sommet-arc** : 1 sortant, −1 entrant, 0 sinon.', 'mij = arêtes ; symétrique ; sommet-arc 1/−1/0.', 'mij = number of edges; symmetric if undirected; incidence 1/−1/0.']),
  p(['**(M^k)ij = nombre de chemins de longueur k** de si à sj ; **trace(M^k)** = nombre de circuits fermés de longueur k.', 'M^k = chemins ; trace = circuits.', '**(M^k)ij** = length-k walks; **trace** = closed walks.']),
  code('M = [[0,1,1],\n     [1,0,1],\n     [1,0,0]]    # arcs 1→2 1→3 2→1 2→3 3→1', 'text'),
  quiz('ro-11', 'ro-12', 'ro-13')
], [['M symétrique (non orienté), diagonale nulle (simple).', 'Symétrique.', 'Symmetric, zero diagonal.'], ['(M^k)ij = chemins de longueur k ; trace(M^k) = circuits.', 'M^k.', 'M^k walks; trace closed.']]);

// ---------------- 3. chaînes, Euler, Hamilton ----------------
setCtx('ro', 'euler');
Q.push(
  single('ro-20', 1, ['Un cycle **eulérien** passe une fois par chaque…', 'Eulérien : kol… ?', 'An **Eulerian** cycle uses each… once'], [['arête', 'arête', 'edge'], ['sommet', 'sommet', 'vertex'], ['boucle', 'boucle', 'loop']], 0,
    ['**Euler = arêtes**, **Hamilton = sommets**.', 'Euler = arêtes ; Hamilton = sommets.', '**Euler = edges**, **Hamilton = vertices**.'], [['Ça c\'est Hamilton.', 'Hamilton.', 'That is Hamilton.'], ['Non.', 'La.', 'No.']], ['euler']),
  single('ro-21', 2, ['Théorème d\'Euler : un graphe connexe admet un cycle eulérien ssi…', 'Théorème Euler ?', 'Euler theorem: a connected graph has an Eulerian cycle iff…'], [['tous les degrés sont pairs', 'kol degré pair', 'all degrees are even'], ['il a 2 sommets impairs', '2 impairs', 'it has 2 odd vertices'], ['il est complet', 'complet', 'it is complete']], 0,
    ['Cycle ⇔ 0 sommet impair ; chaîne eulérienne ⇔ 0 ou 2 sommets impairs (extrémités = les 2 impairs).', '0 impair = cycle ; 2 = chaîne.', '0 odd → cycle; 2 odd → chain between them.'], [['2 impairs → chaîne, pas cycle.', 'Chaîne.', 'That gives a chain.'], ['Non.', 'La.', 'No.']], ['euler']),
  num('ro-22', 2, ['Contrôle : réseau A–F. Nombre de sommets de degré impair ?', 'Ch7al sommet impair ?', 'How many odd-degree vertices?'], 2, 0, ['Degrés A4 B2 C4 D5 E3 F4 : D et E impairs.', 'D w E.', 'D and E.'], {}, ['euler', 'annale'], { fn: 'gOddCount', args: [CC] }),
  single('ro-23', 3, ['Contrôle : peut-on inspecter chaque ligne une seule fois ?', 'Kol ligne merra wa7da ?', 'Can each line be inspected exactly once?'], [['Oui, chaîne eulérienne de D à E', 'Ah, mn D l E', 'Yes, Euler chain from D to E'], ['Non, il y a des sommets impairs', 'La', 'No, odd vertices exist'], ['Oui, cycle eulérien', 'Cycle', 'Yes, Euler cycle']], 0,
    ['Exactement 2 sommets impairs (D, E) → chaîne eulérienne D…E, ex. D–A–C–B–D–C–F–A–E–D–F–E.', '2 impairs → chaîne D…E.', 'Exactly 2 odd vertices → chain D…E.'], [['2 impairs suffisent pour une chaîne.', '2 kafiyin.', '2 odd vertices allow a chain.'], ['Cycle impossible : 2 impairs.', 'Cycle la.', 'No cycle: 2 odd vertices.']], ['euler', 'annale']),
  num('ro-24', 2, ['Graphe A–G (exercice 1) : nombre d\'arêtes à ajouter pour qu\'il soit complet ?', 'Ch7al arête nzidou ?', 'Edges to add to make it complete?'], 11, 0, ['21 − 10 = **11**.', '21 − 10.', '21 − 10 = **11**.'], {}, ['complet', 'annale'], { fn: 'gMissing', args: [EX1] }),
  num('ro-25', 2, ['Graphe A–G : degré de C ?', 'Degré C ?', 'Degree of C?'], 4, 0, ['C relié à A, B, D, F.', 'A, B, D, F.', 'A, B, D, F.'], {}, ['degres'], { fn: 'gDegree', args: [EX1, 'C'] }),
  single('ro-26', 2, ['Un graphe **connexe** est un graphe où…', 'Connexe ?', 'A **connected** graph is one where…'], [['toute paire de sommets est reliée par une chaîne', 'kol jouj sommets mrbouttin', 'every pair is joined by a chain'], ['tous les sommets sont adjacents', 'kolhom adjacents', 'all vertices are adjacent'], ['il n\'y a pas de cycle', 'bla cycle', 'there is no cycle']], 0,
    ['Connexe = une chaîne entre toute paire. Tous adjacents = complet.', 'Chaîne bin kol jouj.', 'A chain between any pair.'], [['Ça c\'est complet.', 'Complet.', 'That is complete.'], ['Ça c\'est sans cycle (forêt).', 'Forêt.', 'That is acyclic.']], ['connexite'])
);
F.push(
  fc('fc-ro-8', ['Eulérien vs hamiltonien ?', 'Euler vs Hamilton ?', 'Euler vs Hamilton?'], ['Euler : chaque arête une fois. Hamilton : chaque sommet une fois.', 'Arêtes vs sommets.', 'Edges vs vertices.']),
  fc('fc-ro-9', ['Condition cycle eulérien ?', 'Cycle eulérien ?', 'Euler cycle condition?'], ['Connexe + tous degrés pairs.', 'Connexe + pair.', 'Connected + all degrees even.']),
  fc('fc-ro-10', ['Chaîne eulérienne ?', 'Chaîne eulérienne ?', 'Euler chain?'], ['0 ou 2 sommets impairs ; extrémités = sommets impairs.', '0 wla 2 impairs.', '0 or 2 odd vertices (the ends).']),
  fc('fc-ro-11', ['Chaîne simple / élémentaire ?', 'Simple / élémentaire ?', 'Simple / elementary chain?'], ['Arêtes distinctes / sommets distincts.', 'Arêtes / sommets distincts.', 'Distinct edges / distinct vertices.'])
);
const c3 = chap('euler', 3, ['Chaînes, cycles, connexité, Euler, Hamilton', 'Chaînes, Euler, Hamilton', 'Chains, connectivity, Euler, Hamilton'], ['Chaînes, cycles, connexité, graphes eulériens et hamiltoniens.', 'Euler w Hamilton.', 'Chains, cycles, Euler and Hamilton.'], [
  h(['Chaînes et cycles', 'Chaînes w cycles', 'Chains and cycles']),
  p(['**Chaîne** = suite d\'arêtes adjacentes (longueur = nombre d\'arêtes) ; **simple** = arêtes distinctes ; **élémentaire** = sommets distincts ; **cycle** = chaîne fermée à arêtes distinctes (orienté : chemin, circuit). **Connexe** : chaîne entre toute paire ; **fortement connexe** (orienté) : chemin pour tout couple.', 'Chaîne, simple, élémentaire, cycle, connexe.', 'Chain, simple, elementary, cycle, connected, strongly connected.']),
  h(['Euler et Hamilton', 'Euler w Hamilton', 'Euler and Hamilton']),
  p(['**Eulérien** : passe une fois par chaque **arête**. **Hamiltonien** : passe une fois par chaque **sommet**. **Théorème d\'Euler** : connexe → cycle eulérien ⇔ tous les degrés pairs ; chaîne eulérienne ⇔ 0 ou 2 sommets impairs (ce sont les extrémités).', 'Euler = arêtes ; Hamilton = sommets ; théorème.', '**Eulerian** = every edge once; **Hamiltonian** = every vertex once; Euler theorem.']),
  trap(['Ne pas confondre : Euler ↔ **arêtes**, Hamilton ↔ **sommets**.', 'Euler = arêtes, Hamilton = sommets.', 'Euler ↔ edges, Hamilton ↔ vertices.']),
  quiz('ro-20', 'ro-21', 'ro-23')
], [['Euler : tous degrés pairs (cycle) ou 2 impairs (chaîne).', 'Euler.', 'Euler: all even (cycle) or 2 odd (chain).'], ['Hamilton : chaque sommet une fois.', 'Hamilton.', 'Hamilton: each vertex once.']]);

// ---------------- 4. graphes particuliers ----------------
setCtx('ro', 'particuliers');
Q.push(
  single('ro-30', 2, ['Un graphe **biparti** est un graphe dont…', 'Biparti ?', 'A **bipartite** graph…'], [['les sommets se partagent en S1, S2 sans arête interne', 'S1, S2 bla arête dakhel', 'splits into S1, S2 with no inner edge'], ['il y a deux composantes', 'jouj composantes', 'has two components'], ['tous les degrés valent 2', 'degré 2', 'all degrees are 2']], 0,
    ['Biparti ⇔ 2-coloriable ⇔ aucun cycle impair.', 'Bla cycle impair.', 'Bipartite ⇔ 2-colourable ⇔ no odd cycle.'], [['Non.', 'La.', 'No.'], ['Non.', 'La.', 'No.']], ['biparti']),
  single('ro-31', 2, ['Pour un graphe **planaire**, le nombre chromatique est…', 'Planaire : χ ?', 'For a **planar** graph χ is…'], [['≤ 4', '≤ 4', '≤ 4'], ['≤ 2', '≤ 2', '≤ 2'], ['= n', '= n', '= n']], 0,
    ['Théorème des 4 couleurs : planaire → χ ≤ 4.', '4 couleurs.', 'Four-colour theorem.'], [['Seulement si biparti.', 'Biparti.', 'Only if bipartite.'], ['Non.', 'La.', 'No.']], ['coloration']),
  num('ro-32', 2, ['Nombre chromatique de K4 ?', 'χ(K4) ?', 'χ(K4)?'], 4, 0, ['Tous adjacents → 4 couleurs.', '4.', '4.'], {}, ['coloration'], { fn: 'gChromatic', args: ['A B C D | A-B A-C A-D B-C B-D C-D'] }),
  num('ro-33', 2, ['Nombre chromatique d\'un cycle de longueur 5 ?', 'χ(C5) ?', 'χ(C5)?'], 3, 0, ['Cycle impair → non biparti → 3.', 'Impair → 3.', 'Odd cycle → 3.'], {}, ['coloration'], { fn: 'gChromatic', args: ['A B C D E | A-B B-C C-D D-E E-A'] })
);
F.push(
  fc('fc-ro-12', ['Biparti ?', 'Biparti ?', 'Bipartite?'], ['S = S1 ∪ S2, aucune arête dans S1 ni dans S2 ⇔ pas de cycle impair.', 'Bla cycle impair.', 'No odd cycle.']),
  fc('fc-ro-13', ['Nombre chromatique χ(G) ?', 'χ(G) ?', 'χ(G)?'], ['Minimum de couleurs, sommets adjacents de couleurs différentes ; planaire → χ ≤ 4.', 'Min couleurs.', 'Min colours; planar → ≤ 4.']),
  fc('fc-ro-14', ['Planaire ?', 'Planaire ?', 'Planar?'], ['Arêtes ne se croisent qu\'aux sommets.', 'Bla croisement.', 'Edges only meet at vertices.'])
);
const c4 = chap('particuliers', 4, ['Graphes particuliers et coloration', 'Graphes khassin', 'Special graphs and colouring'], ['Simple, complet, planaire, biparti, coloration.', 'Planaire, biparti, couleurs.', 'Planar, bipartite, colouring.'], [
  h(['Graphes particuliers', 'Graphes khassin', 'Special graphs']),
  p(['**Planaire** : arêtes qui ne se croisent qu\'aux sommets. **Biparti** : S = S1 ∪ S2, aucune arête à l\'intérieur de S1 ni de S2 (⇔ pas de cycle impair). **Coloration** : sommets adjacents de couleurs différentes ; **χ(G)** = minimum de couleurs ; planaire → χ ≤ 4. Algorithme glouton **Welsh-Powell** : trier par degré décroissant, donner la plus petite couleur libre.', 'Planaire, biparti, χ, Welsh-Powell.', 'Planar, bipartite, χ, Welsh–Powell greedy colouring.']),
  quiz('ro-30', 'ro-31', 'ro-33')
], [['Biparti ⇔ pas de cycle impair.', 'Biparti.', 'Bipartite ⇔ no odd cycle.'], ['Planaire → χ ≤ 4.', 'χ ≤ 4.', 'Planar → χ ≤ 4.']]);

// ---------------- 5. arbres ----------------
setCtx('ro', 'arbres');
Q.push(
  single('ro-40', 1, ['Un **arbre** est un graphe…', 'Arbre ?', 'A **tree** is a graph that is…'], [['connexe et sans cycle', 'connexe bla cycle', 'connected and acyclic'], ['complet', 'complet', 'complete'], ['biparti', 'biparti', 'bipartite']], 0,
    ['Arbre = non orienté, connexe, sans cycle ⇔ connexe avec n−1 arêtes ⇔ sans cycle avec n−1 arêtes.', 'Connexe bla cycle, n−1.', 'Connected, acyclic, n−1 edges.'], [['Non.', 'La.', 'No.'], ['Un arbre est biparti, mais ce n\'est pas la définition.', 'Machi ta3rif.', 'Not the definition.']], ['arbres']),
  num('ro-41', 1, ['Nombre d\'arêtes d\'un arbre à 12 sommets ?', 'Arbre 12 sommets ?', 'Edges of a 12-vertex tree?'], 11, 0, ['n − 1 = 11.', '11.', '11.'], {}, ['arbres'], { fn: 'arith', args: [11] }),
  num('ro-42', 2, ['Nombre d\'arbres couvrants de K5 (Cayley) ?', 'Cayley K5 ?', 'Spanning trees of K5?'], 125, 0, ['n^(n−2) = 5³ = **125**.', '125.', '**125**.'], {}, ['arbres'], { fn: 'cayley', args: [5] }),
  num('ro-43', 3, ['Contrôle : coût de l\'arbre couvrant minimal du réseau A–F (milliers DH) ?', 'Coût ACM ?', 'Minimum spanning tree cost?'], 15, 0, ['Kruskal : A–F 2, C–D 2, A–D 3, (C–F rejeté), E–F 3, B–D 5 → **15**.', '15.', '**15**.'], { '13': ['Tu as gardé C–F qui crée un cycle.', 'C–F cycle.', 'C–F creates a cycle.'] }, ['kruskal', 'annale'], { fn: 'gMst', args: [CC] }),
  num('ro-44', 3, ['Exercice du cours (9 sommets, Prim depuis 1) : poids de l\'arbre ?', 'Prim 9 sommets ?', 'Prim, 9 vertices: weight?'], 37, 0, ['Arbre {1,2},{1,3},{4,5},{5,8},{5,6},{6,7},{8,9},{3,9} → **37**.', '37.', '**37**.'], {}, ['prim'], { fn: 'gPrim', args: [PRIM9, '1'] }),
  single('ro-45', 2, ['Kruskal : quand rejette-t-on une arête ?', 'Kruskal : imta nrfdou arête ?', 'Kruskal rejects an edge when…'], [['quand elle crée un cycle', 'cycle', 'it creates a cycle'], ['quand son poids est pair', 'pair', 'its weight is even'], ['jamais', 'jamais', 'never']], 0,
    ['Arêtes triées par poids croissant ; on ajoute si pas de cycle ; on s\'arrête à n−1 arêtes.', 'Tri, bla cycle, n−1.', 'Sort, skip cycles, stop at n−1.'], [['Non.', 'La.', 'No.'], ['Si : cycle → ✗.', 'Cycle → ✗.', 'Cycle → ✗.']], ['kruskal']),
  single('ro-46', 2, ['Prim, à chaque étape, ajoute…', 'Prim kayzid… ?', 'Prim adds at each step…'], [['l\'arête minimale reliant l\'arbre à un sommet hors de l\'arbre', 'arête min mn arbre l bra', 'the cheapest edge from the tree to outside'], ['l\'arête minimale du graphe', 'arête min f graphe', 'the cheapest edge overall'], ['un sommet au hasard', 'zher', 'a random vertex']], 0,
    ['Prim fait grandir **un seul arbre** depuis un sommet ; Kruskal prend la plus petite arête globale (forêt).', 'Prim : arbre wa7ed.', 'Prim grows one tree; Kruskal picks globally.'], [['Ça c\'est Kruskal.', 'Kruskal.', 'That is Kruskal.'], ['Non.', 'La.', 'No.']], ['prim'])
);
E.push(
  ex('ro-x-1', 3, ['Contrôle — Partie A : arbre couvrant minimal', 'Partie A : ACM', 'Part A: minimum spanning tree'],
    ['Réseau de 6 stations, poids (milliers DH) : A–C 4, A–D 3, A–E 7, A–F 2, B–C 9, B–D 5, C–D 2, C–F 3, D–E 12, D–F 5, E–F 3. Trouver le réseau de coût minimal reliant toutes les stations (Kruskal ou Prim, tableau).', 'ACM b Kruskal wla Prim.', 'Find the minimum-cost network (Kruskal or Prim, with table).'],
    [['Trie les arêtes par poids.', 'Tri.', 'Sort edges.'], ['Il faut 5 arêtes.', '5 arêtes.', '5 edges.']],
    [{ t: ['Tableau Kruskal', 'Tableau', 'Kruskal table'], b: ['A–F 2 ✓ · C–D 2 ✓ · A–D 3 ✓ · C–F 3 ✗ (cycle A–F–C–D–A) · E–F 3 ✓ · A–C 4 ✗ · B–D 5 ✓ → 5 arêtes.', 'Kruskal.', 'Kruskal steps.'] }, { t: ['Coût', 'Coût', 'Cost'], b: ['2 + 2 + 3 + 3 + 5 = **15**. D\'autres arbres de coût 15 existent (ex. C–F au lieu de A–D) : toute solution valide est acceptée.', '15.', '**15**; other 15-trees exist.'] }],
    ['Coût minimal **15** (milliers DH).', '15.', 'Minimum cost **15**.'], [['Garder une arête qui crée un cycle.', 'Cycle.', 'Keeping a cycle edge.'], ['S\'arrêter avant n−1 arêtes.', 'Wa9ef bkri.', 'Stopping early.']],
    { checks: [{ compute: { fn: 'gMst', args: [CC] }, expect: 15, tolerance: 0 }] }),
  ex('ro-x-2', 3, ['Prim — exercice du cours (9 sommets)', 'Prim 9 sommets', 'Prim — 9-vertex exercise'],
    [`Graphe (reconstitué) : ${PRIM9.split('|')[1].trim()}. Appliquer Prim depuis 1 avec le tableau « Ensemble S | (poids ; prédécesseur) ».`, 'Prim mn 1 b tableau.', 'Run Prim from 1 with the course table.'],
    [['Au départ tout est à ∞ sauf 1.', '∞ sauf 1.', 'All ∞ except 1.']],
    [{ t: ['Ordre d\'ajout', 'Tartib', 'Order'], b: ['1 → 2 (4) → 3 (5) → 9 (6) → 8 (7) → 5 (6) → 4 (3) → 6 (4) → 7 (2).', 'Tartib.', 'Addition order.'] }, { t: ['Arbre', 'Arbre', 'Tree'], b: ['{1,2},{1,3},{3,9},{8,9},{5,8},{4,5},{5,6},{6,7} ; poids **37**.', '37.', 'Weight **37**.'] }],
    ['Poids **37**.', '37.', 'Weight **37**.'], [['Choisir l\'arête minimale du graphe entier (c\'est Kruskal).', 'Kruskal.', 'Picking globally (Kruskal).']],
    { checks: [{ compute: { fn: 'gPrim', args: [PRIM9, '1'] }, expect: 37, tolerance: 0 }] })
);
F.push(
  fc('fc-ro-15', ['Arbre ?', 'Arbre ?', 'Tree?'], ['Connexe sans cycle ⇔ connexe à n−1 arêtes ⇔ sans cycle à n−1 arêtes.', 'Connexe bla cycle, n−1.', 'Connected acyclic, n−1 edges.']),
  fc('fc-ro-16', ['Cayley ?', 'Cayley ?', 'Cayley?'], ['Kn a n^(n−2) arbres couvrants.', 'n^(n−2).', 'n^(n−2) spanning trees.']),
  fc('fc-ro-17', ['Kruskal ?', 'Kruskal ?', 'Kruskal?'], ['Trier les arêtes ; ajouter si pas de cycle ; stop à n−1.', 'Tri + bla cycle.', 'Sort, add if no cycle, stop at n−1.']),
  fc('fc-ro-18', ['Prim ?', 'Prim ?', 'Prim?'], ['Depuis un sommet, ajouter l\'arête min vers un sommet hors de l\'arbre.', 'Arête min l bra.', 'From one vertex, cheapest edge leaving the tree.']),
  fc('fc-ro-19', ['ACM du contrôle ?', 'ACM contrôle ?', 'Exam MST?'], ['Coût 15 : A–F, C–D, A–D, E–F, B–D.', '15.', 'Cost 15.'])
);
const c5 = chap('arbres', 5, ['Arbres, Kruskal et Prim', 'Arbres, Kruskal, Prim', 'Trees, Kruskal and Prim'], ['Arbres, arbres couvrants, Cayley, Kruskal, Prim.', 'Kruskal w Prim.', 'Trees, spanning trees, Kruskal, Prim.'], [
  h(['Arbres', 'Arbres', 'Trees']),
  p(['**Arbre** : non orienté, connexe, sans cycle (n sommets → n−1 arêtes). **Arbre couvrant** : contient tous les sommets. Kn possède **n^(n−2)** arbres couvrants (Cayley). Applications : réseaux à moindre coût, routes, câblage.', 'Arbre, n−1, Cayley.', 'Tree, n−1 edges, Cayley n^(n−2).']),
  h(['Kruskal', 'Kruskal', 'Kruskal']),
  p(['1) Trier les arêtes par poids croissant. 2) Partir d\'un arbre vide. 3) Ajouter chaque arête si elle **ne crée pas de cycle** (✓), sinon l\'éliminer (✗). 4) S\'arrêter à **n−1** arêtes. Tableau : « poids | arête | ✓ / ✗ ».', 'Tri → ✓/✗ → n−1.', 'Sort → ✓/✗ → n−1 edges.']),
  code('poids | arête | décision\n  2   | A–F   | ✓\n  2   | C–D   | ✓\n  3   | A–D   | ✓\n  3   | C–F   | ✗ cycle\n  3   | E–F   | ✓\n  4   | A–C   | ✗ cycle\n  5   | B–D   | ✓   → coût 15', 'text', ['Contrôle 2025-2026', 'Contrôle', 'Exam 2025-2026']),
  h(['Prim', 'Prim', 'Prim']),
  p(['Partir d\'un sommet ; à chaque étape ajouter l\'arête de **poids minimal reliant l\'arbre à un sommet hors de l\'arbre**. Tableau « Ensemble S | sommets (poids ; prédécesseur) », ∞ au départ. Exemple du cours : arbre {B,D},{B,C},{A,D},{E,F},{C,F}, poids 14.', 'Prim + tableau.', 'Grow from one vertex; table "S | (weight; pred)".']),
  quiz('ro-43', 'ro-45', 'ro-46')
], [['Arbre : connexe, sans cycle, n−1 arêtes ; Kn : n^(n−2) arbres couvrants.', 'n−1, Cayley.', 'n−1 edges; Cayley.'], ['Kruskal : tri + rejet des cycles ; Prim : croissance depuis un sommet.', 'Kruskal / Prim.', 'Kruskal / Prim.']]);

// ---------------- 6. Dijkstra ----------------
setCtx('ro', 'dijkstra');
Q.push(
  num('ro-50', 3, ['Contrôle : plus court trajet B → E (minutes) ?', 'B → E ?', 'Shortest B → E?'], 13, 0, ['B–D–F–E = 5 + 5 + 3 = **13** (B–D–A–F–E aussi).', '13.', '**13**.'], { '17': ['B–D–E direct (12) n\'est pas optimal.', 'D–E twil.', 'B–D–E is longer.'] }, ['dijkstra', 'annale'], { fn: 'gDist', args: [CC, 'B', 'E'] }),
  num('ro-51', 2, ['Même réseau : distance B → A ?', 'B → A ?', 'Distance B → A?'], 8, 0, ['B–D–A = 5 + 3 = **8**.', '8.', '**8**.'], {}, ['dijkstra'], { fn: 'gDist', args: [CC, 'B', 'A'] }),
  num('ro-52', 2, ['Même réseau : distance A → E ?', 'A → E ?', 'Distance A → E?'], 5, 0, ['A–F–E = 2 + 3 = **5**.', '5.', '**5**.'], {}, ['dijkstra'], { fn: 'gDist', args: [CC, 'A', 'E'] }),
  single('ro-53', 2, ['Condition d\'utilisation de Dijkstra ?', 'Chart Dijkstra ?', 'Dijkstra requires…'], [['poids ≥ 0', 'poids ≥ 0', 'non-negative weights'], ['graphe complet', 'complet', 'a complete graph'], ['graphe sans cycle', 'bla cycle', 'an acyclic graph']], 0,
    ['Avec un poids négatif, un sommet « fixé » pourrait encore s\'améliorer.', 'Poids négatif → ghalat.', 'Negative weights break it.'], [['Non.', 'La.', 'No.'], ['Non.', 'La.', 'No.']], ['dijkstra']),
  single('ro-54', 3, ['Dijkstra : à chaque itération on fixe…', 'Dijkstra : nfixiw… ?', 'Each Dijkstra iteration fixes…'], [['le sommet non traité de plus petite distance', 'sommet b a9al distance', 'the unvisited vertex with smallest distance'], ['le sommet de plus grand degré', 'akbar degré', 'the highest-degree vertex'], ['un voisin de la source', 'jar', 'a source neighbour']], 0,
    ['Puis relâchement : d(v) = min(d(v), d(u) + w(u,v)) et on note le prédécesseur ; chemin reconstruit à rebours.', 'Relâchement.', 'Then relax: d(v) = min(d(v), d(u)+w).'], [['Non.', 'La.', 'No.'], ['Non.', 'La.', 'No.']], ['dijkstra'])
);
E.push(
  ex('ro-x-3', 3, ['Contrôle — Partie B : Dijkstra B → E', 'Partie B : Dijkstra', 'Part B: Dijkstra B → E'],
    ['Même réseau, poids = minutes. Plus court trajet de B à E, avec le tableau d\'itérations.', 'Dijkstra B → E b tableau.', 'Shortest B → E with the iteration table.'],
    [['Départ : d(B) = 0, autres ∞.', 'd(B) = 0.', 'd(B) = 0.']],
    [{ t: ['Itérations', 'Itérations', 'Iterations'], b: ['Fixe B : C 9, D 5. Fixe D(5) : A 8, C 7, E 17, F 10. Fixe C(7). Fixe A(8) : E 15. Fixe F(10) : E 13. Fixe E(13).', 'Tableau.', 'Table.'] }, { t: ['Chemin', 'Chemin', 'Path'], b: ['À rebours : E ← F ← D ← B → **B–D–F–E = 13 min**.', '13.', '**13 min**.'] }],
    ['**13 minutes** (B–D–F–E ; B–D–A–F–E aussi).', '13.', '**13 minutes**.'], [['Ne pas mettre à jour C (9 → 7).', 'C ma tbeddel.', 'Not updating C.'], ['Oublier les prédécesseurs.', 'Prédécesseurs.', 'Forgetting predecessors.']],
    { checks: [{ compute: { fn: 'gDist', args: [CC, 'B', 'E'] }, expect: 13, tolerance: 0 }] })
);
F.push(
  fc('fc-ro-20', ['Dijkstra ?', 'Dijkstra ?', 'Dijkstra?'], ['Poids ≥ 0 ; fixer le min ; d(v) = min(d(v), d(u)+w) ; prédécesseurs.', 'Fixe min, relâche.', 'Fix min, relax, predecessors.']),
  fc('fc-ro-21', ['Contrôle B → E ?', 'B → E ?', 'Exam B → E?'], ['13 min : B–D–F–E.', '13.', '13 min.'])
);
const c6 = chap('dijkstra', 6, ['Plus court chemin : Dijkstra', 'Dijkstra', 'Shortest path: Dijkstra'], ['Algorithme de Dijkstra et tableau d\'itérations.', 'Dijkstra.', 'Dijkstra with iteration table.'], [
  h(['Algorithme', 'Algorithme', 'Algorithm']),
  p(['Poids **≥ 0**. 1) d(source) = 0, autres = ∞. 2) Fixer le sommet non traité de plus petite distance u. 3) Relâcher ses voisins : **d(v) = min(d(v), d(u) + w(u,v))**, noter le prédécesseur. 4) Recommencer ; reconstruire le chemin à rebours.', 'd = 0 / ∞ ; fixe min ; relâche ; à rebours.', 'Init, fix min, relax, backtrack.']),
  code('it | fixé |  A    B    C    D    E     F\n 0 |  B   |  ∞    0    9B   5B   ∞     ∞\n 1 |  D   |  8D   -    7D   -    17D   10D\n 2 |  C   |  8D   -    -    -    17D   10D\n 3 |  A   |  -    -    -    -    15A   10D\n 4 |  F   |  -    -    -    -    13F   -\n 5 |  E   |  B–D–F–E = 13', 'text', ['Tableau d\'itérations (format examen)', 'Tableau', 'Exam-format table']),
  tip(['Le tableau d\'itérations est **obligatoire** au contrôle.', 'Tableau darouri.', 'The table is mandatory.']),
  quiz('ro-50', 'ro-53', 'ro-54')
], [['Dijkstra : poids ≥ 0, fixer le min, relâcher, prédécesseurs.', 'Dijkstra.', 'Dijkstra steps.'], ['Contrôle : B → E = 13 min.', '13.', 'Exam: 13 min.']]);

// ---------------- 7. annale ----------------
setCtx('ro', 'annale');
E.push(
  ex('ro-x-4', 2, ['Contrôle — Exercice 1 (graphe A–G)', 'Exercice 1', 'Exercise 1 (graph A–G)'],
    [`Graphe (reconstitué) : ${EX1.split('|')[1].trim()}. 1) Ordre et taille. 2) Degré de C. 3) Sommets impairs. 4) Une chaîne de longueur 3. 5) Voisins de F. 6) Un cycle hamiltonien. 7) Arêtes à ajouter pour être complet.`, '7 so2alat.', 'Seven questions.'],
    [['Compte les arêtes une par une.', '7seb arêtes.', 'Count the edges.']],
    [{ t: ['1–3', '1–3', '1–3'], b: ['Ordre 7, taille 10. d(C) = 4. Impairs : A, B, D, F (4 sommets, nombre pair ✓).', '7, 10 ; 4 ; A B D F.', '7, 10; 4; A, B, D, F.'] }, { t: ['4–7', '4–7', '4–7'], b: ['Chaîne : A–B–E–F. Voisins de F : C, E, G. Hamiltonien : A–B–E–F–G–D–C–A. À ajouter : 21 − 10 = **11**.', 'Hamilton ; 11.', 'Hamiltonian; 11.'] }],
    ['Ordre 7, taille 10, d(C) = 4, impairs A B D F, cycle A–B–E–F–G–D–C–A, 11 arêtes à ajouter.', 'Jawab.', 'See answers.'], [['Compter K7 = 42 arêtes (c\'est 21).', 'K7 = 21.', 'K7 has 21 edges.']],
    { checks: [{ compute: { fn: 'gSize', args: [EX1] }, expect: 10, tolerance: 0 }, { compute: { fn: 'gMissing', args: [EX1] }, expect: 11, tolerance: 0 }] }),
  ex('ro-x-5', 3, ['Contrôle — Exercice 3.2 : M^4', 'Exercice 3.2', 'Exercise 3.2: M^4'],
    ['Graphe orienté 1→2, 1→3, 2→1, 2→3, 3→1. Écrire M, calculer M^4, le nombre de chemins de longueur 4 de 1 à 1 et le nombre de circuits de longueur 4.', 'M, M^4, trace.', 'Write M, compute M^4, walks 1→1 and trace.'],
    [['M² = M × M, puis M^4 = M² × M².', 'M² × M².', 'M^4 = M² × M².']],
    [{ t: ['Matrices', 'Matrices', 'Matrices'], b: ['M = [[0,1,1],[1,0,1],[1,0,0]] ; M² = [[2,0,1],[1,1,1],[0,1,1]] ; M^4 = [[4,1,3],[3,2,3],[1,2,2]].', 'M², M^4.', 'M², M^4.'] }, { t: ['Lecture', '9raya', 'Reading'], b: ['(M^4)11 = **4** chemins ; trace = 4 + 2 + 2 = **8** circuits fermés de longueur 4.', '4 w 8.', '4 walks; trace 8.'] }],
    ['(M^4)11 = 4 ; trace(M^4) = 8.', '4 ; 8.', '4; 8.'], [['Calculer 4 × M au lieu de M^4.', '4M.', 'Computing 4M.']],
    { checks: [{ compute: { fn: 'gPaths', args: [DIR3, 4, '1', '1'] }, expect: 4, tolerance: 0 }, { compute: { fn: 'gTracePow', args: [DIR3, 4] }, expect: 8, tolerance: 0 }] })
);
E.push(
  ex('ro-x-6', 2, ['Contrôle 2022 — Exercice 1 : graphe A–F', 'Contrôle 2022 — Exercice 1', 'Test 2022 — Exercise 1: graph A–F'],
    ['G = (S, V), S = {A, B, C, D, E, F}, V = {{A,B}, {A,D}, {A,F}, {B,C}, {B,D}, {B,E}, {C,D}, {D,E}}. 1) Représenter G. 2) Complet ? 3) Connexe ? 4) Justifier l\'absence de cycle eulérien. 5) Matrice d\'adjacence M (ordre alphabétique). 6) Sachant (M³)AF = 3, donner toutes les chaînes de longueur 3 de A à F.', 'G = (S, V) b 6 sommets w 8 arêtes : complet ? connexe ? Euler ? matrice ? chaînes toul 3 mn A l F ?', 'G with 6 vertices and 8 edges: complete? connected? Euler? matrix? all length-3 chains from A to F?'],
    [['Commence par les degrés.', 'Bda b degrés.', 'Start with the degrees.'], ['F n\'a qu\'un seul voisin.', 'F 3ndo jar wa7ed.', 'F has a single neighbour.']],
    [{ t: ['Q1–Q4', 'Q1–Q4', 'Q1–Q4'], b: ['Degrés A3 B4 C2 D4 E2 F1. Non complet (8 < 15). Connexe (tout est relié à A). A et F impairs → pas de cycle eulérien.', 'A3 B4 C2 D4 E2 F1 ; machi complet ; connexe ; A w F impairs.', 'A3 B4 C2 D4 E2 F1; not complete; connected; A and F odd.'] }, { t: ['Q5–Q6', 'Q5–Q6', 'Q5–Q6'], b: ['M = [[0,1,0,1,0,1],[1,0,1,1,1,0],[0,1,0,1,0,0],[1,1,1,0,1,0],[0,1,0,1,0,0],[1,0,0,0,0,0]]. (M³)AF = 3 : A–B–A–F, A–D–A–F, A–F–A–F.', 'M ; 3 chaînes.', 'M; 3 chains.'] }],
    ['Non complet, connexe, pas de cycle eulérien ; chaînes A–B–A–F, A–D–A–F, A–F–A–F.', 'Jawab.', 'See answers.'], [['Oublier A–F–A–F (une chaîne peut repasser par une arête).', 'Nsit A–F–A–F.', 'Forgetting A–F–A–F.'], ['Dire « connexe » sans montrer de chaînes.', 'Connexe bla tbrir.', 'Claiming connected without chains.']],
    { checks: [{ compute: { fn: 'gPaths', args: [C22, 3, 'A', 'F'] }, expect: 3, tolerance: 0 }, { compute: { fn: 'gMissing', args: [C22] }, expect: 7, tolerance: 0 }, { compute: { fn: 'gOddCount', args: [C22] }, expect: 2, tolerance: 0 }] }),
  ex('ro-x-7', 3, ['Contrôle 2022 — Exercice 2 : routes de coût minimum', 'Contrôle 2022 — Exercice 2', 'Test 2022 — Exercise 2: minimum-cost roads'],
    ['5 villes ; coûts c12 = 3, c13 = 5, c14 = 11, c15 = 9, c23 = 3, c24 = +∞, c25 = 8, c34 = 9, c35 = 10, c45 = 7. Trouver le réseau de routes de coût minimum reliant toutes les villes.', '5 mdon, matrice C : l9a réseau b a9al taman.', '5 cities, cost matrix C: find the cheapest network connecting them all.'],
    [['C\'est un arbre couvrant minimal : 4 routes.', 'ACM : 4 routes.', 'An MST: 4 roads.'], ['+∞ = route impossible.', '+∞ = bla route.', '+∞ = no road.']],
    [{ t: ['Kruskal', 'Kruskal', 'Kruskal'], b: ['1–2 (3) ✓ · 2–3 (3) ✓ · 1–3 (5) ✗ cycle · 4–5 (7) ✓ · 2–5 (8) ✓ → 4 routes.', 'Tableau Kruskal.', 'Kruskal table.'] }, { t: ['Coût', 'Coût', 'Cost'], b: ['3 + 3 + 7 + 8 = **21**.', '**21**.', '**21**.'] }],
    ['Réseau {1,2}, {2,3}, {4,5}, {2,5} ; coût **21**.', '21.', 'Cost **21**.'], [['Prendre 1–3 (5) qui ferme le cycle 1–2–3.', '1–3 cycle.', 'Taking 1–3 (cycle).'], ['Utiliser la route 2–4 (+∞).', '2–4 ma kaynach.', 'Using road 2–4.']],
    { checks: [{ compute: { fn: 'gMst', args: [VILLES] }, expect: 21, tolerance: 0 }] }),
  ex('ro-x-8', 3, ['Contrôle 2022 — Exercice 3 : partir le plus tard', 'Contrôle 2022 — Exercice 3', 'Test 2022 — Exercise 3: leave as late as possible'],
    ['Réseau orienté (minutes) : M→B 5, M⇄D 8, B→E 15, B⇄C 6, C⇄E 17, E→T 11, D→C 1, C⇄F 8, D⇄F 14, F⇄T 6. Arriver en T à 8h15 en partant le plus tard possible de M : chemin (algorithme justifié, tableau) et heure de départ.', 'Réseau orienté : a9sar tri9 mn M l T, w sa3a dyal lkhrouj (wsel 8h15).', 'Directed network: shortest M → T path and departure time (arrive 8:15).'],
    [['Partir le plus tard = trajet le plus court.', 'M3etel = a9sar tri9.', 'Latest departure = shortest trip.'], ['Poids positifs → Dijkstra.', 'Poids ≥ 0 → Dijkstra.', 'Non-negative → Dijkstra.']],
    [{ t: ['Dijkstra depuis M', 'Dijkstra mn M', 'Dijkstra from M'], b: ['Fixe M(0) : B 5, D 8. Fixe B(5) : C 11, E 20. Fixe D(8) : C 9 (via D), F 22. Fixe C(9) : F 17. Fixe F(17) : T 23. Fixe E(20) : T reste 23. Fixe T(23).', 'Tableau.', 'Table.'] }, { t: ['Résultat', 'Natija', 'Result'], b: ['**M–D–C–F–T = 23 min** → départ **7h52**.', '**23 min** → **7h52**.', '**23 min** → leave **7:52**.'] }],
    ['M–D–C–F–T, 23 minutes, départ à **7h52**.', '7h52.', 'Leave at **7:52**.'], [['Partir par B parce que 5 < 8.', 'B 7it 5 < 8.', 'Going via B because 5 < 8.'], ['Emprunter C→D (sens interdit).', 'C→D mamnou3.', 'Using C→D (not allowed).']],
    { checks: [{ compute: { fn: 'gDist', args: [TRAJET, 'M', 'T'] }, expect: 23, tolerance: 0 }] })
);
Q.push(
  num('ro-60', 2, ['Contrôle 2022 : nombre de chaînes de longueur 3 de A à F ?', '2022 : chaînes toul 3 A → F ?', '2022: length-3 chains from A to F?'], 3, 0, ['(M³)AF = 3 : A–B–A–F, A–D–A–F, A–F–A–F.', '3.', '**3**.'], {}, ['matrices', 'annale'], { fn: 'gPaths', args: [C22, 3, 'A', 'F'] }),
  num('ro-61', 3, ['Contrôle 2022 : coût minimal du réseau des 5 villes ?', '2022 : coût ACM 5 mdon ?', '2022: minimum cost for the 5 cities?'], 21, 0, ['Kruskal : 1–2, 2–3, 4–5, 2–5 → **21**.', '21.', '**21**.'], { '26': ['Tu as gardé 1–3 qui crée un cycle.', '1–3 cycle.', '1–3 makes a cycle.'] }, ['kruskal', 'annale'], { fn: 'gMst', args: [VILLES] }),
  num('ro-62', 3, ['Contrôle 2022 : durée minimale M → T (minutes) ?', '2022 : M → T ch7al d d9i9a ?', '2022: minimal M → T time?'], 23, 0, ['M–D–C–F–T = 8 + 1 + 8 + 6 = **23** → départ 7h52.', '23 → 7h52.', '**23** → leave 7:52.'], { '26': ['M–B–C–F–T (5 + 6 + 8 + 6) : D → C ne coûte que 1.', 'D → C = 1.', 'D → C costs 1.'] }, ['dijkstra', 'annale'], { fn: 'gDist', args: [TRAJET, 'M', 'T'] })
);
F.push(
  fc('fc-ro-23', ['Contrôle 2022 : pourquoi pas de cycle eulérien ?', '2022 : 3lach bla cycle eulérien ?', '2022: why no Eulerian cycle?'], ['d(A) = 3 et d(F) = 1 impairs.', 'A w F impairs.', 'A and F have odd degree.']),
  fc('fc-ro-24', ['Contrôle 2022 : départ le plus tard ?', '2022 : imta ykhrej ?', '2022: latest departure?'], ['M–D–C–F–T = 23 min → 7h52.', '7h52.', '7:52.'])
);
F.push(fc('fc-ro-22', ['Contrôle : degrés 4,3,3,2,1 ?', 'Degrés 4,3,3,2,1 ?', 'Degrees 4,3,3,2,1?'], ['Impossible : somme 13 impaire.', 'Impossible.', 'Impossible: odd sum.']));
const c7 = chap('annale', 7, ['Annales : contrôle continu 2025-2026', 'Annales 2025-2026', 'Past exam 2025-2026'], ['Contrôle du 28/11/2025 (1h30) corrigé.', 'Contrôle m-sa7e7.', 'Corrected exam of 28/11/2025.'], [
  h(['Énoncé', 'Énoncé', 'Statement']),
  p(['Exercice 1 : graphe A–G (7 questions). Exercice 2 : réseau de 6 stations — matrice, degrés, chaîne eulérienne, puis **Partie A** (Kruskal ou Prim) **ou Partie B** (Dijkstra). Exercice 3 : degrés 4,3,3,2,1 ; M^4 d\'un graphe orienté.', '3 exercices, Partie A wla B.', '3 exercises, Part A or Part B.']),
  code('    A B C D E F\nA   0 0 1 1 1 1\nB   0 0 1 1 0 0\nC   1 1 0 1 0 1\nD   1 1 1 0 1 1\nE   1 0 0 1 0 1\nF   1 0 1 1 1 0', 'text', ['Matrice de l\'exercice 2', 'Matrice', 'Exercise 2 matrix']),
  p(['Résultats : 11 arêtes, non complet (manque 4), connexe ; degrés A4 B2 C4 D5 E3 F4 ; chaîne eulérienne de D à E ; ACM coût **15** ; B → E **13 min**.', 'Natayij.', 'Results: 11 edges, degrees, Euler chain D→E, MST 15, B→E 13.']),
  exam(['Faites l\'examen blanc chronométré (page Examen blanc → « Contrôle continu »).', 'Dir l\'examen blanc.', 'Take the timed mock exam.'])
], [['Exercice 2 : MST 15, B → E 13, chaîne D…E.', '15 ; 13.', 'MST 15; 13 min.']]);

export const module: Module = {
  id: 'ro',
  title: L(['Recherche Opérationnelle (graphes)', 'Recherche Opérationnelle', 'Operations Research (graphs)']),
  subtitle: L(['Graphes, matrices, Euler, arbres, Kruskal, Prim, Dijkstra', 'Graphes, Kruskal, Dijkstra', 'Graphs, trees, Kruskal, Prim, Dijkstra']),
  color: '#0f7c8c',
  icon: 'layers',
  theme: 'amber',
  chapters: ['defs', 'matrices', 'euler', 'particuliers', 'arbres', 'dijkstra', 'annale'],
  upcoming: [],
  annales: [
    {
      id: 'cc-2025',
      title: L(['Contrôle continu 2025-2026 (28/11/2025)', 'Contrôle 2025-2026', 'Mid-term 2025-2026']),
      minutes: 90,
      intro: L(['1h30, calculatrice autorisée. Exercice 2 : traiter la Partie A **ou** la Partie B.', '1h30. Partie A wla B.', '1h30, calculator allowed. Exercise 2: Part A **or** Part B.']),
      parts: [{ exerciseId: 'ro-x-4', points: 6 }, { exerciseId: 'ro-x-1', points: 8, group: 'A' }, { exerciseId: 'ro-x-3', points: 8, group: 'B' }, { exerciseId: 'ro-x-5', points: 6 }]
    },
    {
      id: 'cc-2022',
      title: L(['Contrôle du 16/12/2022 (Pr. Benouahmane)', 'Contrôle 16/12/2022', 'Test of 16/12/2022']),
      minutes: 90,
      intro: L(['3 exercices : graphe et matrice (M³), arbre couvrant minimal (5 villes), Dijkstra sur un graphe orienté. Rapporter les tableaux.', '3 exercices : graphe w M³, ACM, Dijkstra orienté. Ktb tableaux.', '3 exercises: graph and M³, MST (5 cities), Dijkstra on a directed graph. Show the tables.']),
      parts: [{ exerciseId: 'ro-x-6', points: 8 }, { exerciseId: 'ro-x-7', points: 6 }, { exerciseId: 'ro-x-8', points: 6 }]
    },
    {
      id: 'blanc-facile',
      title: L(['Examen blanc RO — Niveau 1 · Facile', 'Examen blanc RO — Niveau 1 · Sahel', 'OR mock test — Level 1 · Easy']),
      minutes: 45,
      intro: L(['4 exercices de 5 points : vocabulaire, matrice d\'adjacence, chaîne eulérienne, formule de Cayley. Écris ta réponse sous chaque exercice ; la correction est automatique à la fin.', '4 × 5 pts : vocabulaire, matrice, Euler, Cayley. Kteb jawab ta7t kol exercice ; correction automatique.', '4 × 5 pts: vocabulary, matrix, Euler, Cayley. Automatic marking at the end.']),
      parts: [{ exerciseId: 'ro-e-1', points: 5 }, { exerciseId: 'ro-e-2', points: 5 }, { exerciseId: 'ro-e-3', points: 5 }, { exerciseId: 'ro-e-4', points: 5 }]
    },
    {
      id: 'blanc-moyen',
      title: L(['Examen blanc RO — Niveau 2 · Moyen (type CC)', 'Examen blanc RO — Niveau 2 · Moyen (b7al CC)', 'OR mock test — Level 2 · Medium']),
      minutes: 90,
      intro: L(['4 exercices de 5 points, type CC : Kruskal, Dijkstra, puissances de matrice, coloration. Écris ta réponse sous chaque exercice ; la correction est automatique à la fin.', '4 × 5 pts b7al CC : Kruskal, Dijkstra, M³, coloration. Kteb jawab ta7t kol exercice ; correction automatique.', '4 × 5 pts like the test: Kruskal, Dijkstra, matrix powers, colouring. Automatic marking at the end.']),
      parts: [{ exerciseId: 'ro-m-1', points: 5 }, { exerciseId: 'ro-m-2', points: 5 }, { exerciseId: 'ro-m-3', points: 5 }, { exerciseId: 'ro-m-4', points: 5 }]
    },
    {
      id: 'blanc-difficile',
      title: L(['Examen blanc RO — Niveau 3 · Difficile', 'Examen blanc RO — Niveau 3 · S3ib', 'OR mock test — Level 3 · Hard']),
      minutes: 90,
      intro: L(['4 exercices de 5 points : Prim, Dijkstra orienté, Welsh-Powell, graphe orienté et forte connexité. Écris ta réponse sous chaque exercice ; la correction est automatique à la fin.', '4 × 5 pts : Prim, Dijkstra orienté, Welsh-Powell, forte connexité. Kteb jawab ta7t kol exercice ; correction automatique.', '4 × 5 pts: Prim, directed Dijkstra, Welsh-Powell, strong connectivity. Automatic marking at the end.']),
      parts: [{ exerciseId: 'ro-h-1', points: 5 }, { exerciseId: 'ro-h-2', points: 5 }, { exerciseId: 'ro-h-3', points: 5 }, { exerciseId: 'ro-h-4', points: 5 }]
    },
    {
      id: 'blanc-expert',
      title: L(['Examen blanc RO — Niveau 4 · Expert', 'Examen blanc RO — Niveau 4 · Expert', 'OR mock test — Level 4 · Expert']),
      minutes: 120,
      intro: L(['4 exercices de 5 points pour viser 20/20 : ACM non unique, Dijkstra avec horaires, postier chinois, triangles par la trace. Écris ta réponse sous chaque exercice ; la correction est automatique à la fin.', '4 × 5 pts l 20/20 : ACM, Dijkstra horaires, postier chinois, trace. Kteb jawab ta7t kol exercice ; correction automatique.', '4 × 5 pts for 20/20: non-unique MST, timed Dijkstra, Chinese postman, triangles via trace. Automatic marking at the end.']),
      parts: [{ exerciseId: 'ro-x-e1', points: 5 }, { exerciseId: 'ro-x-e2', points: 5 }, { exerciseId: 'ro-x-e3', points: 5 }, { exerciseId: 'ro-x-e4', points: 5 }]
    }
  ],
  weights: { defs: 4, matrices: 4, arbres: 3, dijkstra: 3, euler: 2, particuliers: 1, annale: 2 }
};

// chapter texts come from course.ts (rewritten from the Drive); ids, order, questions and exercises stay here
export const chapters = [c1, c2, c3, c4, c5, c6, c7].map((c) => ({ ...c, ...COURSE[c.id] }));
export const questions = Q;
export const exercises = [...E, ...roExams];
export const flashcards = F;
export const reference = R;
export const missions = [];
