import { describe, it, expect } from 'vitest';
import * as G from './index';

/** Contrôle continu 28/11/2025 — exercice 2 */
export const CC = 'A B C D E F | A-C:4 A-D:3 A-E:7 A-F:2 B-C:9 B-D:5 C-D:2 C-F:3 D-E:12 D-F:5 E-F:3';
const M = [
  [0, 0, 1, 1, 1, 1],
  [0, 0, 1, 1, 0, 0],
  [1, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1],
  [1, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0]
];

describe('contrôle continu 2025-2026, exercice 2', () => {
  const g = G.parseGraph(CC);
  it('matrice d\'adjacence de l\'énoncé', () => expect(G.adjacency(g)).toEqual(M));
  it('11 arêtes, non complet (manque 4), connexe', () => {
    expect(G.size(g)).toBe(11);
    expect(G.completeEdges(6)).toBe(15);
    expect(G.missingForComplete(g)).toBe(4);
    expect(G.isComplete(g)).toBe(false);
    expect(G.isConnected(g)).toBe(true);
  });
  it('degrés A4 B2 C4 D5 E3 F4', () => expect(G.degrees(g)).toEqual([4, 2, 4, 5, 3, 4]));
  it('chaîne eulérienne de D à E', () => {
    expect(G.oddVertices(g)).toEqual(['D', 'E']);
    expect(G.eulerType(g)).toBe('chain');
    const p = G.eulerPath(g, 'D')!;
    expect(p[0]).toBe('D');
    expect(p[p.length - 1]).toBe('E');
    expect(G.isEulerWalk(g, p)).toBe(true);
    expect(G.isEulerWalk(g, 'D A C B D C F A E D F E'.split(' '))).toBe(true);
  });
  it('arbre couvrant minimal de coût 15 (Kruskal = Prim)', () => {
    const k = G.kruskal(g);
    expect(k.total).toBe(15);
    expect(k.tree).toHaveLength(5);
    expect(k.tree).toEqual(['A-F', 'C-D', 'A-D', 'E-F', 'B-D']);
    expect(k.steps.find((s) => s.edge === 'C-F')!.accepted).toBe(false);
    expect(G.prim(g, 'A').total).toBe(15);
    expect(G.prim(g, 'B').total).toBe(15);
  });
  it('Dijkstra B → E = 13 min', () => {
    const d = G.dijkstra(g, 'B');
    expect(d.dist.E).toBe(13);
    const path = d.path('E');
    expect(path).toEqual(['B', 'D', 'F', 'E']);
    expect(d.rows.map((r) => r.fixed)).toEqual(['B', 'D', 'C', 'A', 'F', 'E']);
  });
});

describe('exercice 3', () => {
  it('3.1 degrés 4,3,3,2,1 impossible (somme impaire)', () => expect([4, 3, 3, 2, 1].reduce((a, b) => a + b) % 2).toBe(1));
  it('3.2 chemins de longueur 4 et circuits via M^4', () => {
    const g = G.parseGraph('1 2 3 | 1>2 1>3 2>1 2>3 3>1');
    const M4 = G.matPow(G.adjacency(g), 4);
    expect(G.adjacency(g)).toEqual([[0, 1, 1], [1, 0, 1], [1, 0, 0]]);
    expect(M4).toEqual(G.matMul(G.matMul(G.adjacency(g), G.adjacency(g)), G.matMul(G.adjacency(g), G.adjacency(g))));
    expect(G.trace(M4)).toBe(M4[0][0] + M4[1][1] + M4[2][2]);
  });
});

describe('course facts', () => {
  it('Σ degrés = 2 × arêtes, boucle comptée 2 fois', () => {
    const g = G.parseGraph('1 2 3 4 5 6 7 | 1-3 1-4 7-1 3-4 5-3 3-6 3-7 7-4 3-3');
    expect(G.degrees(g).reduce((a, b) => a + b)).toBe(2 * G.size(g));
    expect(G.degreeOf(g, '3')).toBe(7);
    expect(G.isSimple(g)).toBe(false);
  });
  it('Kn : n(n−1)/2 arêtes et n^(n−2) arbres couvrants', () => {
    expect(G.completeEdges(7)).toBe(21);
    expect(G.cayley(4)).toBe(16);
  });
  it('Prim exemple du cours : poids 14', () => {
    const g = 'A B C D E F | B-D:2 B-C:3 A-D:3 E-F:2 C-F:4 A-B:5 C-D:6 C-E:6 D-F:7';
    const p = G.prim(g, 'A');
    expect(p.total).toBe(14);
    expect([...p.tree].sort()).toEqual(['A-D', 'B-C', 'B-D', 'C-F', 'E-F']);
    expect(p.rows[0].cells.B).toEqual([Infinity, null]);
  });
  it('Prim exercice 9 sommets : poids 37', () => {
    const g = '1 2 3 4 5 6 7 8 9 | 1-2:4 1-3:5 4-5:3 5-8:6 5-6:4 6-7:2 8-9:7 3-9:6 2-3:8 2-4:9 3-4:10 4-6:8 6-9:9 7-8:11 7-9:10';
    const p = G.prim(g, '1');
    expect(p.total).toBe(37);
    expect([...p.tree].sort()).toEqual(['1-2', '1-3', '3-9', '4-5', '5-6', '5-8', '6-7', '8-9']);
    expect(G.kruskal(g).total).toBe(37);
  });
  it('biparti / cycle impair', () => {
    expect(G.bipartite('A B C D | A-B B-C C-D D-A').ok).toBe(true);
    const r = G.bipartite('A B C | A-B B-C C-A');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.oddCycle.length % 2).toBe(0);
  });
  it('coloration', () => {
    const k4 = 'A B C D | A-B A-C A-D B-C B-D C-D';
    expect(G.chromaticNumber(k4)).toBe(4);
    expect(G.welshPowell('A B C D | A-B B-C C-D D-A').count).toBe(2);
    expect(G.isProperColoring('A B | A-B', [0, 1])).toBe(true);
  });
  it('hamiltonien (exercice 1 reconstitué)', () => {
    const g = 'A B C D E F G | A-B A-C A-D B-C B-E C-D C-F D-G E-F F-G';
    expect(G.size(g)).toBe(10);
    expect(G.oddVertices(g)).toEqual(['A', 'B', 'D', 'F']);
    const h = G.hamiltonianCycle(g)!;
    expect(G.isHamiltonCycle(g, h)).toBe(true);
    expect(G.missingForComplete(g)).toBe(11);
  });
  it('random graphs are connected and reproducible', () => {
    for (let s = 1; s < 30; s++) {
      const g = G.randomGraph(6, s);
      expect(G.isConnected(g)).toBe(true);
      expect(G.kruskal(g).tree).toHaveLength(5);
      expect(G.prim(g, 'A').total).toBe(G.kruskal(g).total);
    }
    expect(G.formatGraph(G.randomGraph(5, 7))).toBe(G.formatGraph(G.randomGraph(5, 7)));
  });
  it('strong connectivity', () => {
    expect(G.isStronglyConnected('1 2 3 | 1>2 2>3 3>1')).toBe(true);
    expect(G.isStronglyConnected('1 2 3 | 1>2 2>3')).toBe(false);
  });
});
