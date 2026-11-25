import { setCtx, ex, rb } from '../lib';

/**
 * Four mock tests for RO (graphs) by level, with marking schemes for the automatic correction.
 * Every number is computed by src/lib/graph (the `checks` are re-run by content:check).
 */
setCtx('ro', 'annale');

const E1 = 'A B C D E | A-B A-C B-C B-D C-D D-E';
const E2 = 'A B C D | A-B A-C B-C C-D';
const E3 = 'A B C D E | A-B B-C C-D D-A A-C C-E';
const M1 = 'A B C D E F | A-B:4 A-C:2 B-C:1 B-D:5 C-D:8 C-E:10 D-E:2 D-F:6 E-F:3';
const M2 = 'A B C D E F | A-B:7 A-C:9 A-F:14 B-C:10 B-D:15 C-D:11 C-F:2 D-E:6 E-F:9';
const M3 = 'A B C D | A-B A-C A-D B-C C-D';
const M4 = 'A B C D E F | A-B A-C B-C B-D C-E D-E D-F E-F';
const H1 = '1 2 3 4 5 6 7 | 1-2:7 1-4:5 2-3:8 2-4:9 2-5:7 3-5:5 4-5:15 4-6:6 5-6:8 5-7:9 6-7:11';
const H2 = 'S A B C D T | S>A:4 S>B:2 B>A:1 A>C:5 B>C:8 B>D:10 C>D:2 C>T:6 D>T:2';
const H3 = 'A B C D E F G | A-B A-C A-D B-C B-E C-F D-F E-F E-G F-G';
const H4 = '1 2 3 4 | 1>2 1>3 2>3 3>1 3>4 4>2';
const X1 = 'A B C D E F G H | A-B:3 A-C:5 A-D:4 B-D:2 B-E:6 C-D:5 C-F:4 D-E:7 D-F:3 E-G:5 F-G:6 F-H:7 G-H:2 E-H:8';
const X2 = 'M N O P Q R T | M>N:6 M>O:3 O>N:2 N>P:5 O>P:9 O>Q:7 P>R:4 Q>P:1 Q>R:8 R>T:3 P>T:9';
const X3 = 'A B C D E F | A-B A-C A-D B-C B-E C-D C-E D-F E-F A-F';
const X4 = 'A B C D E | A-B A-C A-D B-C B-D C-D D-E C-E';
const edges = (g: string) => g.split('|')[1].trim().replace(/:(\d+)/g, ' ($1)').split(' ').join(' ').replace(/ \(/g, '(');

export const exercises = [
  // ------------------------------------------------------------------ FACILE
  ex('ro-e-1', 2, ['Facile — Ex. 1 : ordre, taille, degrés (5 pts)', 'Facile — Ex. 1 : ordre, taille, degrés (5 pts)', 'Easy — Ex. 1: order, size, degrees (5 pts)'],
    [`Graphe non orienté G : sommets A, B, C, D, E ; arêtes ${edges(E1)}. 1) Ordre et taille de G. 2) Degré de chaque sommet. 3) Vérifiez le lemme des poignées de main. 4) G est-il complet ? Combien d'arêtes manque-t-il ? 5) G est-il connexe ?`, `G : sommets A–E ; arêtes ${edges(E1)}. 1) Ordre w taille. 2) Degrés. 3) Lemme des poignées. 4) Complet ? Ch7al na9sin ? 5) Connexe ?`, `Undirected G: vertices A–E; edges ${edges(E1)}. 1) Order and size. 2) Degrees. 3) Handshake lemma. 4) Complete? Missing edges? 5) Connected?`],
    [['Ordre = nombre de sommets, taille = nombre d\'arêtes ; K5 a 5×4/2 arêtes.', 'Ordre = sommets, taille = arêtes ; K5 = 10.', 'Order = vertices, size = edges; K5 = 10.']],
    [{ t: ['Réponses', 'Jawabat', 'Answers'], b: ['1) Ordre **5**, taille **6**. 2) d(A)=2, d(B)=3, d(C)=3, d(D)=3, d(E)=1. 3) Somme des degrés = **12 = 2 × 6**. 4) Non complet : K5 a **10** arêtes, il en manque **4**. 5) **Connexe** (chaîne A–B–D–E, C relié à A).', '5 ; 6 ; 2,3,3,3,1 ; 12 = 2×6 ; manque 4 ; connexe.', '5; 6; 2,3,3,3,1; 12 = 2×6; 4 missing; connected.'] }],
    ['Ordre 5, taille 6, degrés 2-3-3-3-1, Σd = 12 = 2m, non complet (manque 4 arêtes), connexe.', '5, 6, Σd 12, manque 4, connexe.', '5, 6, Σd 12, 4 missing, connected.'],
    [['Compter chaque arête deux fois dans la taille.', 'Taille = arêtes ghir mra.', 'Counting edges twice.']],
    { checks: [{ compute: { fn: 'gOrder', args: [E1] }, expect: 5, tolerance: 0 }, { compute: { fn: 'gSize', args: [E1] }, expect: 6, tolerance: 0 }, { compute: { fn: 'gDegreeSum', args: [E1] }, expect: 12, tolerance: 0 }, { compute: { fn: 'gMissing', args: [E1] }, expect: 4, tolerance: 0 }, { compute: { fn: 'gConnected', args: [E1] }, expect: 1, tolerance: 0 }],
      rubric: [rb('Ordre = 5', 0.5, 'ordre 5', 'ordre = 5', 'ordre : 5', '5 sommets'), rb('Taille = 6', 0.5, 'taille 6', 'taille = 6', 'taille : 6', '6 aretes'), rb('Degrés A2 B3 C3 D3 E1', 1.5, '2 && 3 && 1'), rb('Σ degrés = 12 = 2 × 6', 1, '12'), rb('Il manque 4 arêtes (K5 = 10)', 1, '4 aretes', 'manque 4', '10'), rb('Connexe', 0.5, 'connexe')] }),
  ex('ro-e-2', 2, ['Facile — Ex. 2 : matrice d\'adjacence (5 pts)', 'Facile — Ex. 2 : matrice (5 pts)', 'Easy — Ex. 2: adjacency matrix (5 pts)'],
    [`G : sommets A, B, C, D ; arêtes ${edges(E2)}. 1) Écrivez la matrice d'adjacence M (ordre A, B, C, D). 2) Pourquoi M est-elle symétrique ? 3) Calculez M². 4) Combien de chaînes de longueur 2 vont de A à D ? 5) Que représente le coefficient (A, A) de M² ?`, `G : A–D ; arêtes ${edges(E2)}. 1) M. 2) 3lach symétrique ? 3) M². 4) Chaînes longueur 2 A → D. 5) (A, A) dyal M² ?`, `G: A–D; edges ${edges(E2)}. 1) M. 2) Why symmetric? 3) M². 4) Length-2 walks A → D. 5) Meaning of (A, A) in M².`],
    [['(M²)ij = nombre de chaînes de longueur 2 de i à j.', '(M²)ij = chaînes de longueur 2.', '(M²)ij = length-2 walks.']],
    [{ t: ['Réponses', 'Jawabat', 'Answers'], b: ['1) M = [0 1 1 0 / 1 0 1 0 / 1 1 0 1 / 0 0 1 0]. 2) Graphe **non orienté** : i–j ⇔ j–i. 3) M² = [2 1 1 1 / 1 2 1 1 / 1 1 3 0 / 1 1 0 1]. 4) **1** chaîne (A–C–D). 5) (M²)AA = **2** = d(A) : nombre d\'allers-retours de longueur 2.', 'M ; non orienté ; M² ; 1 ; 2 = d(A).', 'M; undirected; M²; 1; 2 = d(A).'] }],
    ['M symétrique (non orienté) ; M² = [2 1 1 1 / 1 2 1 1 / 1 1 3 0 / 1 1 0 1] ; 1 chaîne A→D ; (M²)AA = 2 = degré de A.', 'M², 1, 2.', 'M², 1, 2.'],
    [['Lire M au lieu de M² pour les chaînes de longueur 2.', 'M² machi M.', 'Use M², not M.']],
    { checks: [{ compute: { fn: 'gPaths', args: [E2, 2, 'A', 'D'] }, expect: 1, tolerance: 0 }, { compute: { fn: 'gPaths', args: [E2, 2, 'A', 'A'] }, expect: 2, tolerance: 0 }],
      rubric: [rb('Matrice M correcte', 1.5, '0 1 1 0 && 1 0 1 0 && 1 1 0 1', '0110 && 1010 && 1101'), rb('Symétrique car non orienté', 0.5, 'non oriente', 'symetri'), rb('M² correcte', 1.5, '2 1 1 1 && 1 1 3 0', '2111 && 1130'), rb('1 chaîne de A à D (A-C-D)', 1, 'a-c-d', 'a c d', '1 chaine'), rb('(M²)AA = 2 = degré de A', 0.5, 'degre')] }),
  ex('ro-e-3', 2, ['Facile — Ex. 3 : Euler (5 pts)', 'Facile — Ex. 3 : Euler (5 pts)', 'Easy — Ex. 3: Euler (5 pts)'],
    [`G : sommets A, B, C, D, E ; arêtes ${edges(E3)}. 1) Degrés. 2) Énoncez le théorème d'Euler (cycle et chaîne). 3) G admet-il un cycle eulérien ? une chaîne eulérienne ? 4) Si oui, donnez-en une.`, `G : A–E ; arêtes ${edges(E3)}. 1) Degrés. 2) Théorème d'Euler. 3) Cycle ? chaîne ? 4) 3tini wa7da.`, `G: A–E; edges ${edges(E3)}. 1) Degrees. 2) Euler's theorem. 3) Cycle? Chain? 4) Give one.`],
    [['Compte les sommets de degré impair.', '7seb sommets impairs.', 'Count odd vertices.']],
    [{ t: ['Réponses', 'Jawabat', 'Answers'], b: ['1) d(A)=3, d(B)=2, d(C)=4, d(D)=2, d(E)=1. 2) G connexe : **cycle** eulérien ⇔ **0** sommet impair ; **chaîne** eulérienne ⇔ **0 ou 2** sommets impairs (elle va de l\'un à l\'autre). 3) Deux sommets impairs (**A et E**) : pas de cycle, mais une **chaîne de A à E**. 4) **A–B–C–A–D–C–E** (6 arêtes, chacune une fois).', 'A,E impairs → chaîne A…E : A-B-C-A-D-C-E.', 'A, E odd → chain A…E: A-B-C-A-D-C-E.'] }],
    ['Degrés 3-2-4-2-1, impairs A et E → chaîne eulérienne (pas de cycle) : A-B-C-A-D-C-E.', 'Chaîne A…E.', 'Chain A…E.'],
    [['Oublier la condition de connexité.', 'Connexe darouri.', 'Connectivity is required.']],
    { checks: [{ compute: { fn: 'gOddCount', args: [E3] }, expect: 2, tolerance: 0 }, { compute: { fn: 'gEuler', args: [E3] }, expect: 1, tolerance: 0 }],
      rubric: [rb('Degrés 3, 2, 4, 2, 1', 1, '3 && 2 && 4 && 1'), rb('Théorème : 0 impair = cycle, 2 impairs = chaîne (connexe)', 1.5, 'impair && cycle && chaine'), rb('Sommets impairs A et E', 1, 'a et e', 'a, e', 'a & e'), rb('Pas de cycle, chaîne eulérienne', 0.5, 'chaine euler', 'pas de cycle'), rb('Une chaîne valide de A à E', 1, 'a-b-c-a-d-c-e', 'a b c a d c e', 'e-c-d-a-c-b-a')] }),
  ex('ro-e-4', 2, ['Facile — Ex. 4 : arbres et graphes complets (5 pts)', 'Facile — Ex. 4 : arbres w complets (5 pts)', 'Easy — Ex. 4: trees and complete graphs (5 pts)'],
    ['1) Définissez un arbre. 2) Combien d\'arêtes a un arbre de 7 sommets ? 3) Combien d\'arêtes ont K5 et K6 ? 4) Combien d\'arbres couvrants différents possède K4 ? et K5 (formule de Cayley) ? 5) Un graphe connexe de 6 sommets et 5 arêtes est-il un arbre ?', '1) Arbre ? 2) Arbre 7 sommets → arêtes ? 3) K5, K6 ? 4) Cayley K4, K5 ? 5) Connexe 6 sommets 5 arêtes ?', '1) Tree? 2) Edges of a 7-vertex tree? 3) K5, K6? 4) Cayley for K4, K5? 5) Connected, 6 vertices, 5 edges?'],
    [['Arbre : n − 1 arêtes ; Kn : n(n − 1)/2 ; Cayley : n^(n − 2).', 'n − 1 ; n(n − 1)/2 ; n^(n − 2).', 'n − 1; n(n − 1)/2; n^(n − 2).']],
    [{ t: ['Réponses', 'Jawabat', 'Answers'], b: ['1) Graphe **connexe sans cycle**. 2) **6** (n − 1). 3) K5 : **10**, K6 : **15**. 4) K4 : 4² = **16** ; K5 : 5³ = **125**. 5) **Oui** : connexe avec n − 1 arêtes ⇒ arbre.', 'Connexe sans cycle ; 6 ; 10, 15 ; 16, 125 ; oui.', 'Connected, acyclic; 6; 10, 15; 16, 125; yes.'] }],
    ['Arbre = connexe sans cycle ; 6 arêtes ; K5 = 10, K6 = 15 ; Cayley 16 et 125 ; oui (connexe et n − 1 arêtes).', '6, 10, 15, 16, 125, oui.', '6, 10, 15, 16, 125, yes.'],
    [['Utiliser n^n au lieu de n^(n − 2).', 'n^(n − 2).', 'Use n^(n − 2).']],
    { checks: [{ compute: { fn: 'completeEdges', args: [5] }, expect: 10, tolerance: 0 }, { compute: { fn: 'completeEdges', args: [6] }, expect: 15, tolerance: 0 }, { compute: { fn: 'cayley', args: [4] }, expect: 16, tolerance: 0 }, { compute: { fn: 'cayley', args: [5] }, expect: 125, tolerance: 0 }],
      rubric: [rb('Arbre = connexe sans cycle', 1, 'connexe && sans cycle', 'connexe && acycl'), rb('7 sommets → 6 arêtes', 1, '6'), rb('K5 = 10, K6 = 15', 1, '10 && 15'), rb('Cayley : 16 et 125', 1.5, '16 && 125'), rb('Oui, c\'est un arbre', 0.5, 'oui', 'arbre')] }),

  // ------------------------------------------------------------------ MOYEN
  ex('ro-m-1', 3, ['Moyen — Ex. 1 : Kruskal (5 pts)', 'Moyen — Ex. 1 : Kruskal (5 pts)', 'Medium — Ex. 1: Kruskal (5 pts)'],
    [`Réseau (coûts) : ${edges(M1)}. Appliquez **Kruskal** : 1) trier les arêtes ; 2) donner l'ordre des arêtes retenues et refusées (avec la raison) ; 3) l'arbre couvrant minimal et son coût.`, `Réseau : ${edges(M1)}. **Kruskal** : tri, retenues/refusées, ACM w coût.`, `Network: ${edges(M1)}. Apply **Kruskal**: sort, kept/rejected edges, MST and cost.`],
    [['On refuse une arête qui ferme un cycle (ses deux extrémités sont déjà dans la même composante).', 'Refuser li katsed cycle.', 'Reject edges closing a cycle.']],
    [{ t: ['Déroulement', 'Déroulement', 'Run'], b: ['Tri : B–C 1, A–C 2, D–E 2, E–F 3, A–B 4, B–D 5, D–F 6, C–D 8, C–E 10. Retenues : **B–C (1)**, **A–C (2)**, **D–E (2)**, **E–F (3)** ; A–B (4) **refusée** (cycle A–B–C) ; **B–D (5)** relie les deux blocs → 5 arêtes = n − 1, fin.', 'B–C, A–C, D–E, E–F, (A–B refusée), B–D.', 'B–C, A–C, D–E, E–F, (A–B rejected), B–D.'] },
     { t: ['Résultat', 'Natija', 'Result'], b: ['ACM = {B–C, A–C, D–E, E–F, B–D}, coût **13**.', 'Coût **13**.', 'Cost **13**.'] }],
    ['ACM : B–C, A–C, D–E, E–F, B–D ; coût 13 (A–B refusée : cycle).', '13.', '13.'],
    [['Prendre A–B au lieu de B–D (cycle).', 'A–B katsed cycle.', 'A–B closes a cycle.']],
    { checks: [{ compute: { fn: 'gMst', args: [M1] }, expect: 13, tolerance: 0 }],
      rubric: [rb('Tri des arêtes par coût croissant', 0.5, 'tri', 'croissant', 'b-c 1 && a-c 2'), rb('B–C, A–C, D–E, E–F retenues', 1.5, 'b-c && a-c && d-e && e-f', 'bc && ac && de && ef'), rb('A–B refusée (cycle)', 1, 'a-b && cycle', 'ab && cycle', 'refus'), rb('B–D retenue (relie les blocs)', 1, 'b-d', 'bd'), rb('Coût total 13', 1, '13')] }),
  ex('ro-m-2', 3, ['Moyen — Ex. 2 : Dijkstra (5 pts)', 'Moyen — Ex. 2 : Dijkstra (5 pts)', 'Medium — Ex. 2: Dijkstra (5 pts)'],
    [`Graphe non orienté pondéré : ${edges(M2)}. Avec **Dijkstra** depuis A : 1) tableau des étapes ; 2) plus courte distance de A à chaque sommet ; 3) plus court chemin de A à E.`, `Graphe : ${edges(M2)}. **Dijkstra** mn A : tableau, distances, chemin A → E.`, `Graph: ${edges(M2)}. **Dijkstra** from A: table, distances, path A → E.`],
    [['À chaque étape, on fixe le sommet non fixé de plus petite étiquette et on met à jour ses voisins.', 'Fixer a9al étiquette w mettre à jour.', 'Fix the smallest label, update neighbours.']],
    [{ t: ['Étapes', 'Marahil', 'Steps'], b: ['Fixés dans l\'ordre : A (0), B (7, A), C (9, A), F (11, C), D (20, C) et E (20, F). Mises à jour clés : F passe de 14 à **11** via C ; D de 22 (via B) à **20** via C ; E = 11 + 9 = **20** via F.', 'A, B 7, C 9, F 11, D 20, E 20.', 'A, B 7, C 9, F 11, D 20, E 20.'] },
     { t: ['Résultat', 'Natija', 'Result'], b: ['d(B)=7, d(C)=9, d(F)=11, d(D)=20, d(E)=20. Chemin A → E : **A–C–F–E** (9 + 2 + 9 = **20**).', 'A–C–F–E = 20.', 'A–C–F–E = 20.'] }],
    ['B 7, C 9, F 11, D 20, E 20 ; A → E : A–C–F–E, 20.', 'A–C–F–E = 20.', 'A–C–F–E = 20.'],
    [['Garder F = 14 (arête directe) sans voir A–C–F = 11.', 'F = 11 machi 14.', 'F = 11, not 14.']],
    { checks: [{ compute: { fn: 'gDist', args: [M2, 'A', 'E'] }, expect: 20, tolerance: 0 }, { compute: { fn: 'gDist', args: [M2, 'A', 'F'] }, expect: 11, tolerance: 0 }, { compute: { fn: 'gDist', args: [M2, 'A', 'D'] }, expect: 20, tolerance: 0 }],
      rubric: [rb('d(B) = 7, d(C) = 9', 1, '7 && 9'), rb('d(F) = 11 (via C)', 1, '11'), rb('d(D) = 20', 0.5, 'd = 20', 'd(d) = 20', 'd : 20', '20'), rb('d(E) = 20', 0.5, '20'), rb('Chemin A–C–F–E', 1.5, 'a-c-f-e', 'a c f e', 'acfe'), rb('Tableau / ordre de fixation', 0.5, 'fix', 'tableau', 'etape')] }),
  ex('ro-m-3', 2, ['Moyen — Ex. 3 : puissances de M (5 pts)', 'Moyen — Ex. 3 : puissances de M (5 pts)', 'Medium — Ex. 3: powers of M (5 pts)'],
    [`G : sommets A, B, C, D ; arêtes ${edges(M3)}. 1) Matrice M. 2) Calculez M² puis M³. 3) Nombre de chaînes de longueur 3 de A à B. 4) Que vaut la trace de M³ et combien G a-t-il de triangles ?`, `G : ${edges(M3)}. 1) M. 2) M², M³. 3) Chaînes longueur 3 A → B. 4) Trace M³ w triangles.`, `G: ${edges(M3)}. 1) M. 2) M², M³. 3) Length-3 walks A → B. 4) Trace of M³ and triangles.`],
    [['Nombre de triangles = trace(M³) / 6.', 'Triangles = trace(M³)/6.', 'Triangles = trace(M³)/6.']],
    [{ t: ['Calculs', 'Calculs', 'Computations'], b: ['M = [0 1 1 1 / 1 0 1 0 / 1 1 0 1 / 1 0 1 0]. M² = [3 1 2 1 / 1 2 1 2 / 2 1 3 1 / 1 2 1 2]. M³ = [4 5 5 5 / 5 2 5 2 / 5 5 4 5 / 5 2 5 2].', 'M, M², M³.', 'M, M², M³.'] },
     { t: ['Lecture', 'Qraya', 'Reading'], b: ['(M³)AB = **5** chaînes. trace(M³) = 4 + 2 + 4 + 2 = **12** ⇒ **12 / 6 = 2 triangles** (A-B-C et A-C-D).', '5 ; trace 12 ; 2 triangles.', '5; trace 12; 2 triangles.'] }],
    ['(M³)AB = 5 ; trace(M³) = 12 ; 2 triangles (ABC, ACD).', '5, 12, 2.', '5, 12, 2.'],
    [['Diviser la trace par 3 au lieu de 6.', '/6 machi /3.', 'Divide by 6.']],
    { checks: [{ compute: { fn: 'gPaths', args: [M3, 3, 'A', 'B'] }, expect: 5, tolerance: 0 }, { compute: { fn: 'gTracePow', args: [M3, 3] }, expect: 12, tolerance: 0 }],
      rubric: [rb('M correcte', 1, '0 1 1 1 && 1 0 1 0', '0111 && 1010'), rb('M² correcte', 1, '3 1 2 1', '3121'), rb('M³ correcte', 1, '4 5 5 5', '4555'), rb('5 chaînes de longueur 3 de A à B', 1, '5'), rb('trace 12 → 2 triangles', 1, '12 && 2', 'triangle')] }),
  ex('ro-m-4', 2, ['Moyen — Ex. 4 : Euler, Hamilton, coloration (5 pts)', 'Moyen — Ex. 4 : Euler, Hamilton, coloration (5 pts)', 'Medium — Ex. 4: Euler, Hamilton, colouring (5 pts)'],
    [`G : sommets A à F ; arêtes ${edges(M4)}. 1) G est-il eulérien (cycle ou chaîne) ? 2) Trouvez un cycle hamiltonien. 3) G est-il biparti ? 4) Nombre chromatique (justifiez par une coloration et une borne).`, `G : ${edges(M4)}. 1) Euler ? 2) Cycle hamiltonien. 3) Biparti ? 4) Nombre chromatique.`, `G: ${edges(M4)}. 1) Eulerian? 2) Hamiltonian cycle. 3) Bipartite? 4) Chromatic number.`],
    [['Triangle ⇒ au moins 3 couleurs et pas biparti.', 'Triangle ⇒ 3 alwan.', 'A triangle ⇒ 3 colours.']],
    [{ t: ['Réponses', 'Jawabat', 'Answers'], b: ['1) Degrés 2, 3, 3, 3, 3, 2 : **4 sommets impairs** ⇒ ni cycle ni chaîne eulérienne. 2) **A–B–D–F–E–C–A**. 3) **Non** : triangle A–B–C (cycle impair). 4) **χ = 3** : le triangle impose ≥ 3, et Welsh-Powell donne 3 couleurs : **{B, E}**, **{C, D}**, **{A, F}**.', '4 impairs ; A-B-D-F-E-C-A ; non biparti ; χ = 3.', '4 odd; A-B-D-F-E-C-A; not bipartite; χ = 3.'] }],
    ['Pas eulérien (4 impairs) ; hamiltonien A-B-D-F-E-C-A ; non biparti (triangle ABC) ; χ = 3.', 'Non eulérien, χ = 3.', 'Not Eulerian, χ = 3.'],
    [['Dire χ = 2 sans voir le triangle.', 'Triangle ⇒ 3.', 'Triangle ⇒ 3.']],
    { checks: [{ compute: { fn: 'gOddCount', args: [M4] }, expect: 4, tolerance: 0 }, { compute: { fn: 'gChromatic', args: [M4] }, expect: 3, tolerance: 0 }],
      rubric: [rb('4 sommets impairs → pas eulérien', 1.5, '4 && impair', 'pas euler', 'non euler'), rb('Cycle hamiltonien valide', 1, 'a-b-d-f-e-c-a', 'abdfeca', 'a b d f e c a'), rb('Non biparti (triangle / cycle impair)', 1, 'triangle', 'cycle impair', 'non biparti', 'pas biparti'), rb('χ = 3', 1.5, '3 couleurs', 'chromatique = 3', 'χ = 3', 'x = 3', '= 3')] }),

  // ------------------------------------------------------------------ DIFFICILE
  ex('ro-h-1', 3, ['Difficile — Ex. 1 : Prim depuis 1 (5 pts)', 'Difficile — Ex. 1 : Prim (5 pts)', 'Hard — Ex. 1: Prim from 1 (5 pts)'],
    [`Réseau : ${edges(H1)}. 1) Appliquez **Prim** depuis le sommet 1 en donnant l'arête ajoutée à chaque étape. 2) Coût de l'arbre. 3) Vérifiez avec Kruskal (même coût ?).`, `${edges(H1)}. **Prim** mn 1 : arête f kol marhala, coût, Kruskal.`, `${edges(H1)}. **Prim** from 1: edge per step, cost, Kruskal check.`],
    [['Prim agrandit un seul arbre : à chaque étape, l\'arête la moins chère qui sort de l\'arbre.', 'Arête a9al tmen li khrja mn chajara.', 'Cheapest edge leaving the tree.']],
    [{ t: ['Étapes', 'Marahil', 'Steps'], b: ['**1–4 (5)**, **4–6 (6)**, **1–2 (7)**, **2–5 (7)**, **3–5 (5)**, **5–7 (9)**.', '1–4, 4–6, 1–2, 2–5, 3–5, 5–7.', '1–4, 4–6, 1–2, 2–5, 3–5, 5–7.'] },
     { t: ['Coût', 'Coût', 'Cost'], b: ['5 + 6 + 7 + 7 + 5 + 9 = **39**, identique à Kruskal (tout arbre couvrant minimal a le même coût).', '**39**.', '**39**.'] }],
    ['Prim : 1–4, 4–6, 1–2, 2–5, 3–5, 5–7 ; coût 39 = Kruskal.', '39.', '39.'],
    [['Choisir l\'arête la moins chère du graphe entier (c\'est Kruskal, pas Prim).', 'Prim : ghir li khrja mn chajara.', 'That is Kruskal, not Prim.']],
    { checks: [{ compute: { fn: 'gPrim', args: [H1, '1'] }, expect: 39, tolerance: 0 }, { compute: { fn: 'gMst', args: [H1] }, expect: 39, tolerance: 0 }],
      rubric: [rb('1–4 en premier', 0.5, '1-4', '1–4', '(1,4)'), rb('4–6 puis 1–2', 1, '4-6 && 1-2', '4–6 && 1–2'), rb('2–5 et 3–5', 1, '2-5 && 3-5', '2–5 && 3–5'), rb('5–7', 0.5, '5-7', '5–7'), rb('Coût 39', 1.5, '39'), rb('Même coût que Kruskal', 0.5, 'kruskal')] }),
  ex('ro-h-2', 3, ['Difficile — Ex. 2 : Dijkstra orienté (5 pts)', 'Difficile — Ex. 2 : Dijkstra orienté (5 pts)', 'Hard — Ex. 2: directed Dijkstra (5 pts)'],
    [`Graphe orienté (durées) : ${edges(H2)}. Avec Dijkstra depuis S : 1) tableau complet (étiquette et prédécesseur) ; 2) plus court chemin de S à T et sa durée ; 3) pourquoi A ne garde-t-il pas l'étiquette 4 ?`, `Orienté : ${edges(H2)}. Dijkstra mn S : tableau, chemin S → T, 3lach A ≠ 4 ?`, `Directed: ${edges(H2)}. Dijkstra from S: table, S → T path, why A ≠ 4?`],
    [['Un arc ne se parcourt que dans son sens.', 'Arc f ittijah wa7ed.', 'Arcs go one way.']],
    [{ t: ['Étapes', 'Marahil', 'Steps'], b: ['Fixés : S 0 ; B 2 (S) ; A **3** (B) ; C 8 (A) ; D 10 (C) ; T **12** (D). A passe de 4 (S→A) à **3** via S→B→A (2 + 1).', 'S, B 2, A 3, C 8, D 10, T 12.', 'S, B 2, A 3, C 8, D 10, T 12.'] },
     { t: ['Chemin', 'Chemin', 'Path'], b: ['**S → B → A → C → D → T** = 2 + 1 + 5 + 2 + 2 = **12**.', 'S-B-A-C-D-T = 12.', 'S-B-A-C-D-T = 12.'] }],
    ['S-B-A-C-D-T, durée 12 ; A = 3 via B (S→B→A = 3 < 4).', '12.', '12.'],
    [['Aller directement C → T (14) au lieu de C → D → T (12).', 'C-D-T = 12.', 'C-D-T = 12.']],
    { checks: [{ compute: { fn: 'gDist', args: [H2, 'S', 'T'] }, expect: 12, tolerance: 0 }, { compute: { fn: 'gDist', args: [H2, 'S', 'A'] }, expect: 3, tolerance: 0 }],
      rubric: [rb('A = 3 via B', 1, '3 && b', 'a = 3', 'a : 3'), rb('C = 8, D = 10', 1, '8 && 10'), rb('T = 12', 1, '12'), rb('Chemin S-B-A-C-D-T', 1.5, 's-b-a-c-d-t', 's b a c d t', 'sbacdt'), rb('Justification : S→B→A (3) < S→A (4)', 0.5, '3 < 4', '< 4', 'plus court')] }),
  ex('ro-h-3', 3, ['Difficile — Ex. 3 : coloration de Welsh-Powell (5 pts)', 'Difficile — Ex. 3 : Welsh-Powell (5 pts)', 'Hard — Ex. 3: Welsh-Powell colouring (5 pts)'],
    [`Graphe d'incompatibilités (examens à placer) : ${edges(H3)}. 1) Degrés et ordre de Welsh-Powell. 2) Coloration obtenue. 3) Nombre chromatique (minorant + majorant). 4) Interprétez : combien de créneaux au minimum ?`, `${edges(H3)}. 1) Degrés w tartib. 2) Coloration. 3) χ. 4) Ch7al créneaux ?`, `${edges(H3)}. 1) Degrees and order. 2) Colouring. 3) χ. 4) Minimum time slots?`],
    [['Minorant : une clique (triangle) ; majorant : la coloration trouvée.', 'Triangle ≤ χ ≤ coloration.', 'Clique ≤ χ ≤ colouring.']],
    [{ t: ['Réponses', 'Jawabat', 'Answers'], b: ['Degrés : A3 B3 C3 D2 E3 **F4** G2 → ordre F, A, B, C, E, D, G. Couleurs : **{F, A}**, **{B, D, G}**, **{C, E}** → **3 couleurs**. Triangle **A-B-C** ⇒ χ ≥ 3 ; coloration à 3 ⇒ **χ = 3** : **3 créneaux** minimum.', 'Ordre F, A, B… ; 3 couleurs ; triangle ABC ; χ = 3 → 3 créneaux.', 'Order F, A, B…; 3 colours; triangle ABC; χ = 3 → 3 slots.'] }],
    ['Welsh-Powell (F en premier, degré 4) donne 3 couleurs ; triangle ABC ⇒ χ = 3 ⇒ 3 créneaux.', 'χ = 3.', 'χ = 3.'],
    [['Oublier le minorant : 3 couleurs trouvées ne prouvent pas que 2 sont impossibles.', 'Khass minorant.', 'You need a lower bound.']],
    { checks: [{ compute: { fn: 'gChromatic', args: [H3] }, expect: 3, tolerance: 0 }, { compute: { fn: 'gWelsh', args: [H3] }, expect: 3, tolerance: 0 }],
      rubric: [rb('F de plus grand degré (4) en premier', 1, 'f && 4'), rb('Coloration valide en 3 couleurs', 1.5, '3 couleurs', 'trois couleurs', '3 creneaux'), rb('Minorant : triangle A-B-C', 1, 'triangle', 'clique', 'a-b-c'), rb('χ = 3', 1, 'χ = 3', 'chromatique = 3', '= 3'), rb('3 créneaux minimum', 0.5, 'creneau')] }),
  ex('ro-h-4', 3, ['Difficile — Ex. 4 : graphe orienté et chemins (5 pts)', 'Difficile — Ex. 4 : orienté w chemins (5 pts)', 'Hard — Ex. 4: directed graph and paths (5 pts)'],
    [`Graphe orienté sur {1, 2, 3, 4} : ${edges(H4)}. 1) Matrice M. 2) M² et M³. 3) Nombre de chemins de longueur 2 de 1 à 3, de longueur 3 de 1 à 4. 4) G est-il fortement connexe ? Justifiez.`, `${edges(H4)}. 1) M. 2) M², M³. 3) Chemins 1→3 (2), 1→4 (3). 4) Fortement connexe ?`, `${edges(H4)}. 1) M. 2) M², M³. 3) Paths 1→3 (length 2), 1→4 (length 3). 4) Strongly connected?`],
    [['M n\'est plus symétrique ; fortement connexe = un chemin de tout sommet vers tout autre.', 'M machi symétrique.', 'M is not symmetric.']],
    [{ t: ['Calculs', 'Calculs', 'Computations'], b: ['M = [0 1 1 0 / 0 0 1 0 / 1 0 0 1 / 0 1 0 0]. M² = [1 0 1 1 / 1 0 0 1 / 0 2 1 0 / 0 0 1 0]. M³ = [1 2 1 1 / 0 2 1 0 / 1 0 2 1 / 1 0 0 1].', 'M, M², M³.', 'M, M², M³.'] },
     { t: ['Lecture', 'Qraya', 'Reading'], b: ['(M²)13 = **1** (1→2→3) ; (M³)14 = **1** (1→2→3→4). **Fortement connexe** : circuit 1→2→3→1 et 3→4→2 relient tout.', '1 ; 1 ; fortement connexe.', '1; 1; strongly connected.'] }],
    ['(M²)13 = 1, (M³)14 = 1 ; fortement connexe (1→2→3→1, 3→4→2).', '1, 1, oui.', '1, 1, yes.'],
    [['Remplir M symétriquement comme un graphe non orienté.', 'M machi symétrique.', 'M is not symmetric.']],
    { checks: [{ compute: { fn: 'gPaths', args: [H4, 2, '1', '3'] }, expect: 1, tolerance: 0 }, { compute: { fn: 'gPaths', args: [H4, 3, '1', '4'] }, expect: 1, tolerance: 0 }],
      rubric: [rb('M correcte (non symétrique)', 1, '0 1 1 0 && 0 0 1 0 && 1 0 0 1', '0110 && 0010 && 1001'), rb('M² correcte', 1, '1 0 1 1 && 0 2 1 0', '1011 && 0210'), rb('M³ correcte', 1, '1 2 1 1', '1211'), rb('1 chemin 1→3 (long. 2) et 1 chemin 1→4 (long. 3)', 1, '1->2->3', '1-2-3', '1→2→3'), rb('Fortement connexe (circuit)', 1, 'fortement connexe', 'circuit')] }),

  // ------------------------------------------------------------------ EXPERT
  ex('ro-x-e1', 3, ['Expert — Ex. 1 : Kruskal et Prim sur 8 sommets (5 pts)', 'Expert — Ex. 1 : Kruskal w Prim (5 pts)', 'Expert — Ex. 1: Kruskal and Prim on 8 vertices (5 pts)'],
    [`Réseau : ${edges(X1)}. 1) Kruskal complet (retenues, refusées). 2) Coût. 3) Prim depuis H donne-t-il le même coût ? 4) L'arbre est-il unique ? Justifiez par les égalités de coût.`, `${edges(X1)}. Kruskal, coût, Prim mn H, unique ?`, `${edges(X1)}. Kruskal, cost, Prim from H, unique?`],
    [['Repère les égalités au moment où l\'arbre se connecte.', 'Chouf égalités.', 'Watch the ties.']],
    [{ t: ['Kruskal', 'Kruskal', 'Kruskal'], b: ['Retenues : **B–D 2, G–H 2, A–B 3, D–F 3, C–F 4, E–G 5**, puis **B–E 6** (ou **F–G 6**). Refusées : A–D 4, A–C 5, C–D 5 (cycles). Coût **25**.', 'B–D, G–H, A–B, D–F, C–F, E–G, B–E/F–G : 25.', '…: 25.'] },
     { t: ['Prim et unicité', 'Prim w unicité', 'Prim and uniqueness'], b: ['Prim depuis H : même coût **25** (tout ACM a le même coût). **Pas unique** : B–E (6) et F–G (6) relient au même moment le bloc {E, G, H} au reste : deux arbres minimaux différents.', '25 ; pas unique (B–E ou F–G).', '25; not unique.'] }],
    ['Coût 25 (B–D, G–H, A–B, D–F, C–F, E–G + B–E ou F–G) ; Prim même coût ; non unique (égalité à 6).', '25, non unique.', '25, not unique.'],
    [['Croire qu\'un ACM est toujours unique.', 'Machi dima unique.', 'MSTs are not always unique.']],
    { checks: [{ compute: { fn: 'gMst', args: [X1] }, expect: 25, tolerance: 0 }, { compute: { fn: 'gPrim', args: [X1, 'H'] }, expect: 25, tolerance: 0 }],
      rubric: [rb('B–D, G–H, A–B, D–F retenues', 1, 'b-d && g-h && a-b && d-f'), rb('C–F et E–G retenues', 1, 'c-f && e-g'), rb('B–E ou F–G (coût 6)', 0.5, 'b-e', 'f-g'), rb('Coût 25', 1, '25'), rb('Prim : même coût', 0.5, 'prim && 25', 'meme cout'), rb('Non unique (égalité B–E / F–G)', 1, 'pas unique', 'non unique', 'egalit')] }),
  ex('ro-x-e2', 3, ['Expert — Ex. 2 : partir le plus tard possible (5 pts)', 'Expert — Ex. 2 : khrj m3etel (5 pts)', 'Expert — Ex. 2: leave as late as possible (5 pts)'],
    [`Trajets (minutes) : ${edges(X2)}. Un livreur part de M et doit arriver en T **au plus tard à 10h00**. 1) Dijkstra depuis M (tableau). 2) Plus court chemin M → T et sa durée. 3) Heure de départ la plus tardive. 4) Si l'arc Q → P passe à 5 min, le chemin change-t-il ?`, `${edges(X2)}. Wsel l T 9bel **10h00**. 1) Dijkstra. 2) Chemin w durée. 3) A9 khrja m3etla. 4) Q → P = 5 ?`, `${edges(X2)}. Arrive at T by **10:00**. 1) Dijkstra. 2) Path and time. 3) Latest departure. 4) If Q → P becomes 5?`],
    [['Départ au plus tard = heure limite − plus courte durée.', 'Départ = 10h00 − durée.', 'Departure = deadline − shortest time.']],
    [{ t: ['Dijkstra', 'Dijkstra', 'Dijkstra'], b: ['Fixés : M 0 ; O 3 ; N **5** (via O) ; P 10 (via N) et Q 10 ; R 14 (via P) ; T **17** (via R).', 'O 3, N 5, P 10, Q 10, R 14, T 17.', 'O 3, N 5, P 10, Q 10, R 14, T 17.'] },
     { t: ['Réponse', 'Jawab', 'Answer'], b: ['Chemin **M → O → N → P → R → T** = 3 + 2 + 5 + 4 + 3 = **17 min**. Départ au plus tard : 10h00 − 17 min = **9h43**. Avec Q → P = 5 : P via Q = 10 + 5 = 15 > 10 : **pas de changement**.', '17 min ; 9h43 ; pas de changement.', '17 min; 9:43; no change.'] }],
    ['M-O-N-P-R-T, 17 min ; départ 9h43 ; Q → P = 5 ne change rien.', '17, 9h43.', '17, 9:43.'],
    [['Prendre P → T direct (19) au lieu de P → R → T (17).', 'P-R-T = 7 < 9.', 'P-R-T = 7 < 9.']],
    { checks: [{ compute: { fn: 'gDist', args: [X2, 'M', 'T'] }, expect: 17, tolerance: 0 }, { compute: { fn: 'gDist', args: [X2, 'M', 'N'] }, expect: 5, tolerance: 0 }],
      rubric: [rb('N = 5 via O', 0.5, '5'), rb('P = 10, R = 14', 1, '10 && 14'), rb('T = 17 min', 1, '17'), rb('Chemin M-O-N-P-R-T', 1, 'm-o-n-p-r-t', 'm o n p r t', 'monprt'), rb('Départ 9h43', 1, '9h43', '9:43', '09h43', '09:43'), rb('Q → P = 5 : pas de changement', 0.5, 'pas de changement', 'ne change', 'inchange', 'meme chemin')] }),
  ex('ro-x-e3', 3, ['Expert — Ex. 3 : rendre un graphe eulérien (5 pts)', 'Expert — Ex. 3 : graphe eulérien (5 pts)', 'Expert — Ex. 3: make a graph Eulerian (5 pts)'],
    [`Réseau de rues (A à F) : ${edges(X3)}. 1) Degrés ; le camion de nettoyage peut-il passer une seule fois par chaque rue et revenir à son point de départ ? 2) Combien de rues au minimum faut-il doubler pour que ce soit possible ? Lesquelles proposez-vous ? 3) Donnez alors un cycle eulérien.`, `${edges(X3)}. 1) Degrés ; cycle eulérien ? 2) Ch7al rues tzid (doubler) ? 3) Cycle eulérien.`, `${edges(X3)}. 1) Degrees; Euler cycle? 2) Minimum streets to double? 3) An Euler cycle.`],
    [['Chaque rue doublée rend pairs ses deux extrémités.', 'Kol rue mdoubla katred jouj extrémités pairs.', 'Each doubled street fixes two odd ends.']],
    [{ t: ['Réponses', 'Jawabat', 'Answers'], b: ['1) Degrés A4 **B3** C4 **D3 E3 F3** : **4 impairs** ⇒ impossible. 2) Il faut apparier les 4 impairs : **2 rues** au minimum, par ex. doubler **B–E** et **D–F** (rues existantes). 3) Tous les degrés deviennent pairs ; un cycle eulérien existe, par ex. A–B–E–B–C–E–F–D–F–A–D–C–A (12 arêtes).', '4 impairs ; doubler B–E et D–F ; cycle de 12 arêtes.', '4 odd; double B–E and D–F; 12-edge cycle.'] }],
    ['4 sommets impairs (B, D, E, F) ; doubler 2 rues (ex. B–E et D–F) ; cycle eulérien de 12 arêtes.', '4 impairs, 2 rues.', '4 odd, 2 streets.'],
    [['Doubler une rue entre deux sommets déjà pairs.', 'Ghir bin impairs.', 'Only between odd vertices.']],
    { checks: [{ compute: { fn: 'gOddCount', args: [X3] }, expect: 4, tolerance: 0 }, { compute: { fn: 'gEuler', args: [X3] }, expect: 0, tolerance: 0 }],
      rubric: [rb('Degrés : B, D, E, F impairs', 1, 'b && d && e && f && impair'), rb('Impossible (4 impairs)', 1, 'impossible', 'pas de cycle', 'non'), rb('2 rues à doubler', 1, '2 rues', 'deux rues', '2 aretes'), rb('Rues appariant les impairs (B–E, D–F)', 1, 'b-e && d-f', 'b-f && d-e'), rb('Un cycle eulérien (12 arêtes)', 1, '12', 'cycle euler')] }),
  ex('ro-x-e4', 3, ['Expert — Ex. 4 : triangles et chemins avec M (5 pts)', 'Expert — Ex. 4 : triangles b M (5 pts)', 'Expert — Ex. 4: triangles and walks with M (5 pts)'],
    [`G : sommets A à E ; arêtes ${edges(X4)}. 1) Calculez M². 2) Combien de triangles possède G (via la trace de M³) ? Listez-les. 3) Nombre de chaînes de longueur 4 de A à E. 4) Pourquoi divise-t-on la trace par 6 ?`, `${edges(X4)}. 1) M². 2) Triangles (trace M³). 3) Chaînes longueur 4 A → E. 4) 3lach /6 ?`, `${edges(X4)}. 1) M². 2) Triangles via trace(M³). 3) Length-4 walks A → E. 4) Why divide by 6?`],
    [['Un triangle est compté depuis 3 sommets et dans 2 sens.', '3 sommets × 2 ittijahat.', '3 vertices × 2 directions.']],
    [{ t: ['Réponses', 'Jawabat', 'Answers'], b: ['1) M² = [3 2 2 2 2 / 2 3 2 2 2 / 2 2 4 3 1 / 2 2 3 4 1 / 2 2 1 1 2]. 2) trace(M³) = **30** ⇒ 30 / 6 = **5 triangles** : ABC, ABD, ACD, BCD, CDE. 3) (M⁴)AE = **18**. 4) Chaque triangle donne 6 chemins fermés de longueur 3 : départ depuis l\'un de ses **3 sommets** × **2 sens**.', 'trace 30 → 5 triangles ; 18 ; 3 × 2.', 'trace 30 → 5 triangles; 18; 3 × 2.'] }],
    ['trace(M³) = 30 ⇒ 5 triangles (ABC, ABD, ACD, BCD, CDE) ; (M⁴)AE = 18 ; ÷6 = 3 sommets × 2 sens.', '5 triangles, 18.', '5 triangles, 18.'],
    [['Diviser par 3 : on oublie les deux sens de parcours.', '/6 machi /3.', 'Divide by 6.']],
    { checks: [{ compute: { fn: 'gTracePow', args: [X4, 3] }, expect: 30, tolerance: 0 }, { compute: { fn: 'gPaths', args: [X4, 4, 'A', 'E'] }, expect: 18, tolerance: 0 }],
      rubric: [rb('M² correcte', 1, '3 2 2 2 2 && 2 2 4 3 1', '32222 && 22431'), rb('trace(M³) = 30', 1, '30'), rb('5 triangles', 1, '5 triangles', '5'), rb('Triangles listés (ABC, ABD, ACD, BCD, CDE)', 0.5, 'abc && cde'), rb('(M⁴)AE = 18', 1, '18'), rb('÷6 = 3 sommets × 2 sens', 0.5, '3 && 2 && sens', 'sens')] })
];
