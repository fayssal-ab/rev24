/**
 * Builds cours/catalog.json: real metadata of every course file (page count + document date),
 * read from the PDFs themselves with `pdfinfo` (poppler-utils). Run after adding files:  npm run catalog
 * When a PDF has no reliable date (scans, or files converted from .docx/.pptx), the date of the
 * original file on the Drive is used instead (DRIVE_DATES below).
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DRIVE_DATES: Record<string, string> = {
  'oracle/04 - TP - TP1 - Architecture et instance (sessions, arrêt et démarrage).pdf': '2026-10-17',
  'virtualisation/01 - Cours - Chapitre 1 - Introduction à la virtualisation.pdf': '2026-11-15',
  'virtualisation/02 - Cours - Chapitre 2 - Fondamentaux de la virtualisation (partie 1).pdf': '2026-11-15',
  'linux/01 - Cours - Chapitre 1 - Introduction et installation.pdf': '2026-10-13',
  'linux/02 - Cours - Gestion des utilisateurs sous Linux.pdf': '2026-11-07',
  'ro/03 - TD - Théorie des graphes P1.pdf': '2026-11-15',
  'ro/04 - TD - Théorie des graphes P2.pdf': '2026-11-15',
  'ml/06 - Annexe - Jeu de données employés (démo ML).pdf': '2026-11-15',
  'linux/06 - TP - TP4 - Gestion des paquetages.pdf': '2026-11-03',
  'linux/07 - TP - TP5 - Gestion des utilisateurs et des groupes.pdf': '2026-11-07',
  'dotnet/01 - Cours - Langage C Sharp et programmation orientée objet.pdf': '2026-10-12',
  'dotnet/02 - TP - TP2 - POO en C Sharp.pdf': '2026-10-12',
  'dotnet/05 - TP - Atelier 2 - Classes, Controllers et Views.pdf': '2026-11-01',
  // NoSQL: .pptx / .docx of the Drive converted to PDF
  'nosql/01 - Cours - Introduction au NoSQL.pdf': '2026-10-05',
  'nosql/02 - Cours - Partie 1 - Les quatre familles de bases NoSQL.pdf': '2026-10-05',
  'nosql/03 - TP - TP1 - Introduction au NoSQL et MongoDB.pdf': '2026-10-12',
  'nosql/04 - TP - TP2 - Base orientée graphe (Neo4j).pdf': '2026-10-12',
  'nosql/05 - TP - TP3 - Bases orientées colonnes (HBase et Cassandra).pdf': '2026-10-12',
  'nosql/06 - TP - TP4 - Base clé-valeur (Redis).pdf': '2026-10-12',
  'nosql/07 - TP - Mini-projet.pdf': '2026-11-02'
};

const root = 'cours';
const out: Record<string, { pages: number | null; date: string | null; size: number }> = {};
for (const dir of readdirSync(root)) {
  const d = join(root, dir);
  if (!statSync(d).isDirectory()) continue;
  for (const f of readdirSync(d)) {
    const rel = `${dir}/${f}`;
    const full = join(d, f);
    let pages: number | null = null;
    let date: string | null = null;
    if (f.toLowerCase().endsWith('.pdf')) {
      const info = execFileSync('pdfinfo', [full], { encoding: 'utf8' });
      pages = Number(/^Pages:\s+(\d+)/m.exec(info)?.[1] ?? NaN) || null;
      const c = /^CreationDate:\s+(.+)$/m.exec(info)?.[1];
      if (c) date = new Date(c.replace(/ \+(\d\d)$/, ' +$100')).toISOString().slice(0, 10);
    }
    date = DRIVE_DATES[rel] ?? date;
    out[rel] = { pages, date, size: statSync(full).size };
  }
}
writeFileSync(join(root, 'catalog.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`✓ catalog: ${Object.keys(out).length} files`);
