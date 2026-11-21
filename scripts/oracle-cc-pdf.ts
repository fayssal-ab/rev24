/**
 * Builds the two PDFs of the Oracle continuous-assessment annale (CC 2025-2026, shown in class on 21/11/2026):
 *   cours/oracle/05 - Contrôle - CC 2025-2026 (énoncé).pdf
 *   cours/oracle/06 - Contrôle - CC 2025-2026 (corrigé).pdf
 * Run:  npx tsx scripts/oracle-cc-pdf.ts
 * Answers follow the professor's slides (Chapitre 2 Architecture globale, Chapitre 3 Instance Oracle, TP1).
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

interface Q {
  n: number;
  q: string;
  /** blank answer lines in the énoncé */
  lines?: number;
  /** model answer (HTML) */
  a: string;
  /** what the grader looks for / common trap */
  tip?: string;
}

const PARTS: { title: string; qs: Q[] }[] = [
  {
    title: 'Partie A (7 questions, 7 points)',
    qs: [
      {
        n: 1,
        q: '<b>Définir</b> un SGBDR et <b>citer</b> deux rôles principaux.',
        lines: 2,
        a: `Un <b>SGBDR</b> (Système de Gestion de Bases de Données Relationnelles) est un logiciel qui permet de <b>créer, stocker, manipuler et interroger</b> des données organisées en <b>tables reliées entre elles</b> (modèle relationnel), à l'aide du langage <b>SQL</b>. Exemple : Oracle Database.
        <br>Deux rôles principaux (en citer deux) :
        <ul><li><b>Stocker et manipuler les données</b> : définition (LDD : CREATE…) et manipulation (LMD : SELECT, INSERT, UPDATE, DELETE).</li>
        <li><b>Sécuriser</b> l'accès : utilisateurs, mots de passe, privilèges.</li>
        <li>Garantir l'<b>intégrité</b> (contraintes) et la <b>cohérence</b> lors des accès concurrents (transactions).</li>
        <li>Assurer la <b>sauvegarde et la restauration</b> des données.</li></ul>`
      },
      {
        n: 2,
        q: 'Quel est le rôle d\'un administrateur de BD Oracle ?',
        lines: 1,
        a: `Le <b>DBA</b> (Database Administrator) est responsable du bon fonctionnement de la base : il <b>installe et configure</b> Oracle, <b>crée</b> les bases, <b>démarre et arrête</b> l'instance, <b>gère les utilisateurs et les privilèges</b> (sécurité), <b>gère le stockage</b> (fichiers, tablespaces), fait les <b>sauvegardes et restaurations</b>, et <b>surveille / optimise les performances</b> (sessions, mémoire).`
      },
      {
        n: 3,
        q: '<b>Lister</b> les trois types de connexions possibles à un serveur Oracle.',
        lines: 2,
        a: `<ol><li><b>Connexion locale</b> : l'utilisateur est directement connecté sur la machine qui héberge le serveur Oracle (ex. <code>sqlplus / as sysdba</code> sur le PC du TP).</li>
        <li><b>Client / serveur</b> (deux tiers) : l'utilisateur se connecte depuis une autre machine reliée au serveur par le réseau (ex. SQL Developer sur un portable).</li>
        <li><b>Multi-tiers</b> (trois tiers) : le client passe par un serveur applicatif intermédiaire (ex. navigateur → serveur Web → Oracle).</li></ol>`
      },
      {
        n: 4,
        q: 'Une instance Oracle est composée de ____________ et de ____________, créés lors du démarrage de la base.',
        a: `Une instance Oracle est composée de la <b>mémoire SGA</b> (System Global Area) et des <b>processus d'arrière-plan</b> (background processes : PMON, SMON, DBWn, LGWR, CKPT…), créés lors du démarrage de la base.`,
        tip: 'L\'instance vit uniquement en RAM : elle est recréée à chaque démarrage et disparaît à chaque arrêt.'
      },
      {
        n: 5,
        q: 'Un serveur Oracle est constitué de trois grandes structures : ____________, ____________ et ____________.',
        a: `Les <b>structures mémoire</b> (SGA, PGA), les <b>structures de processus</b> (processus utilisateur, serveur et d'arrière-plan) et les <b>structures de stockage</b> (les fichiers de la base sur disque).`
      },
      {
        n: 6,
        q: 'Qu\'indiquent les variables suivantes : <code>ORACLE_HOME</code>, <code>ORACLE_BASE</code>, <code>ORACLE_SID</code> ?',
        lines: 3,
        a: `<ul><li><code>ORACLE_HOME</code> : le <b>répertoire d'installation du logiciel</b> Oracle (binaires, <code>sqlplus</code>, bibliothèques). Ex. <code>C:\\app\\oracle\\product\\19.0.0\\dbhome_1</code>.</li>
        <li><code>ORACLE_BASE</code> : le <b>répertoire racine</b> de toute l'arborescence Oracle ; il contient ORACLE_HOME, les fichiers d'administration, de diagnostic et les données. Ex. <code>C:\\app\\oracle</code>.</li>
        <li><code>ORACLE_SID</code> : le <b>nom de l'instance</b> (System IDentifier) à laquelle on se connecte par défaut sur la machine. Ex. <code>ORCL</code>.</li></ul>`,
        tip: 'Piège classique : ORACLE_HOME est DANS ORACLE_BASE, pas l\'inverse.'
      },
      {
        n: 7,
        q: 'Nommer les trois types des fichiers physiques qui composent une CDB.',
        lines: 1,
        a: `<ol><li>Les <b>fichiers de données</b> (datafiles) : les données des tables, index…</li>
        <li>Les <b>fichiers de contrôle</b> (control files) : la structure physique de la base (nom, emplacement des fichiers…).</li>
        <li>Les <b>fichiers de journalisation</b> (redo log files) : l'historique des modifications, pour la récupération.</li></ol>`
      }
    ]
  },
  {
    title: 'Partie B (7 questions, 7 points)',
    qs: [
      {
        n: 8,
        q: 'Quelle est la différence entre une connexion et une session ?',
        lines: 2,
        a: `<ul><li><b>Connexion</b> : le <b>lien de communication</b> entre le processus utilisateur et le processus serveur.</li>
        <li><b>Session</b> : la connexion <b>spécifique d'un utilisateur</b> au serveur Oracle. Elle <b>commence</b> quand le serveur <b>valide</b> l'utilisateur (login) et <b>se termine</b> à sa déconnexion ou en cas de fin prématurée.</li></ul>
        Image : la connexion est le câble, la session est l'appel passé sur ce câble. Une même connexion peut porter plusieurs sessions (vu au TP1 avec <code>SET AUTOTRACE</code>).`
      },
      {
        n: 9,
        q: '<b>Quel processus</b> Oracle est responsable de la coordination des connexions entre l\'application (client) et la base de données ? Expliquer brièvement son rôle.',
        lines: 2,
        a: `Le <b>Listener</b> (processus d'écoute Oracle Net, <code>TNSLSNR</code>, géré par <code>lsnrctl</code>). Il <b>écoute</b> les demandes de connexion des clients sur le réseau (port <b>1521</b> par défaut), vérifie le <b>service</b> demandé (ex. ORCLPDB) puis <b>passe la connexion</b> à un <b>processus serveur</b>. Ensuite c'est ce processus serveur qui dialogue avec le processus utilisateur : il analyse, exécute les ordres SQL et renvoie les résultats.`,
        tip: 'Si le prof attendait le processus serveur, la deuxième phrase couvre aussi ce cas : écrire les deux.'
      },
      {
        n: 10,
        q: '<b>Expliquer</b> le rôle du <b>PDB$SEED</b>.',
        lines: 2,
        a: `<b>PDB$SEED</b> est le <b>modèle (template)</b> fourni par Oracle pour <b>créer de nouvelles PDB</b> rapidement. Il est en <b>lecture seule</b> (READ ONLY), on ne peut ni le modifier ni s'y connecter pour travailler, et une CDB contient <b>exactement un</b> seed (avec un seul CDB$ROOT).`
      },
      {
        n: 11,
        q: `Un administrateur s'est connecté à la base de données en tapant la commande <b>sqlplus / as sysdba</b>. Le message suivant lui a été affiché :
        <pre>C:\\Windows\\System32&gt;sqlplus / as sysdba
SQL*Plus: Release 19.0.0.0.0 - Production on Mer. Nov. 19 12:40:23 2025
Version 19.3.0.0.0
Copyright (c) 1982, 2019, Oracle.  All rights reserved.
Connecté à une instance inactive.</pre>
        Quelle est l'état de la base de données ?`,
        lines: 1,
        a: `« Connecté à une instance inactive » (<i>Connected to an idle instance</i>) signifie que l'<b>instance est arrêtée</b> : la base est <b>fermée</b> (état <b>SHUTDOWN</b>), ni SGA ni processus d'arrière-plan. Il faut la démarrer avec <code>STARTUP</code>.`
      },
      {
        n: 12,
        q: 'CDB/PDB font partie de l\'architecture multitenant. Compléter : « Une CDB est … », « Une PDB est … », « Deux avantages de l\'architecture multitenant sont … et … ».',
        lines: 3,
        a: `<ul><li>Une <b>CDB</b> (Container Database) est un <b>conteneur</b> : une collection logique de données et de métadonnées qui regroupe <b>CDB$ROOT</b>, <b>PDB$SEED</b> et <b>0, 1 ou plusieurs PDB</b>.</li>
        <li>Une <b>PDB</b> (Pluggable Database) est une <b>base « branchable »</b> : une collection portable de schémas, objets et données qui <b>apparaît aux applications comme une base classique</b> (non-CDB). On peut la débrancher d'une CDB et la brancher dans une autre.</li>
        <li>Deux avantages : le <b>partage des ressources</b> (une seule SGA et un seul jeu de processus pour toutes les PDB) et l'<b>administration simplifiée</b> (sauvegarde, mise à jour une seule fois) ; on peut aussi citer le <b>déplacement facile</b> des données d'un conteneur à un autre.</li></ul>`
      },
      {
        n: 13,
        q: '<b>Lister</b> et <b>expliquer</b> les trois étapes de démarrage d\'une instance Oracle.',
        lines: 4,
        a: `<table><tr><th>Étape</th><th>Ce qui se passe</th><th>Message SQL*Plus</th></tr>
        <tr><td><b>1. NOMOUNT</b></td><td>Lecture du <b>fichier de paramètres</b> (SPFILE / PFILE), <b>allocation de la SGA</b> et <b>démarrage des processus d'arrière-plan</b>. L'instance existe, la base n'est pas encore associée.</td><td>Instance ORACLE lancée.</td></tr>
        <tr><td><b>2. MOUNT</b></td><td>Lecture des <b>fichiers de contrôle</b> : la base est <b>associée à l'instance</b>, mais reste fermée aux utilisateurs (seul le DBA travaille).</td><td>Base de données montée.</td></tr>
        <tr><td><b>3. OPEN</b></td><td>Ouverture des <b>fichiers de données</b> et des <b>fichiers de journalisation</b> en ligne : les utilisateurs peuvent accéder à la base.</td><td>Base de données ouverte.</td></tr></table>
        <code>STARTUP</code> enchaîne les trois ; on peut s'arrêter avec <code>STARTUP NOMOUNT</code> ou <code>STARTUP MOUNT</code>, puis avancer avec <code>ALTER DATABASE MOUNT</code> / <code>ALTER DATABASE OPEN</code>.`
      },
      {
        n: 14,
        q: '<b>Citez</b> les étapes d\'arrêt de l\'instance et indiquez la commande utilisée.',
        lines: 2,
        a: `Commande : <code>SHUTDOWN [NORMAL | TRANSACTIONAL | IMMEDIATE | ABORT]</code> (NORMAL par défaut). Les étapes sont l'inverse du démarrage :
        <ol><li><b>Fermeture de la base</b> : fermeture des fichiers de données et de journalisation → « Base de données fermée ».</li>
        <li><b>Démontage</b> : fermeture des fichiers de contrôle → « Base de données démontée ».</li>
        <li><b>Arrêt de l'instance</b> : libération de la SGA et arrêt des processus d'arrière-plan → « Instance ORACLE arrêtée ».</li></ol>`,
        tip: 'Avec SHUTDOWN ABORT les fichiers ne sont pas fermés proprement : restauration de l\'instance (SMON) au démarrage suivant.'
      }
    ]
  },
  {
    title: 'Partie C (6 questions, 6 points)',
    qs: [
      {
        n: 15,
        q: 'Après avoir vérifié que tous les services Oracle sont démarrés, comment accéder à SQL*Plus sans saisir le nom d\'utilisateur et se connecter en tant qu\'administrateur SYSDBA ?',
        lines: 2,
        a: `<pre>sqlplus / as sysdba</pre>Le <b>/</b> veut dire <b>authentification par le système d'exploitation</b> : l'utilisateur Windows connecté (membre du groupe <b>ORA_DBA</b>) est reconnu sans nom ni mot de passe, et <b>as sysdba</b> donne le privilège d'administration complet (on est connecté en <b>SYS</b>).`
      },
      {
        n: 16,
        q: 'Vous voulez vous connecter à la base de données Oracle en tapant la commande SQL*Plus : <b>sqlplus HR/HR as sysdba</b>. Quel est le message renvoyé par la commande : <b>show user</b> ?',
        lines: 1,
        a: `<pre>SQL&gt; show user
USER est "SYS"</pre>Avec <b>AS SYSDBA</b>, Oracle connecte toujours en <b>SYS</b> (propriétaire du dictionnaire), quel que soit le nom saisi : HR/HR est ignoré grâce à l'authentification par le système d'exploitation.`,
        tip: 'Piège : la réponse n\'est pas « HR ».'
      },
      {
        n: 17,
        q: 'Exécuter la commande <b>STARTUP MOUNT</b>. Quel est le résultat obtenu ? Justifier votre réponse.',
        lines: 1,
        a: `L'instance démarre puis la base est <b>montée mais pas ouverte</b> :
        <pre>Instance ORACLE lancée.
Total System Global Area ... bytes
...
Base de données montée.</pre>Justification : MOUNT s'arrête à la <b>2<sup>e</sup> étape</b> (SGA + processus, puis lecture des fichiers de contrôle) ; les fichiers de données ne sont pas ouverts, donc <b>les utilisateurs ne peuvent pas accéder aux données</b> (une requête sur une table donne ORA-01219). Pour finir : <code>ALTER DATABASE OPEN;</code>
        <br>Remarque : si l'instance tourne déjà, Oracle répond <b>ORA-01081 : impossible de démarrer ORACLE déjà en cours d'exécution - l'arrêter d'abord</b>.`
      },
      {
        n: 18,
        q: 'Que permet d\'afficher la commande <b>show con_name</b> ?',
        lines: 1,
        a: `Elle affiche le <b>nom du conteneur courant</b> de la session : <code>CDB$ROOT</code> juste après <code>sqlplus / as sysdba</code>, ou le nom de la PDB (ex. <code>ORCLPDB</code>) après un changement de conteneur.`
      },
      {
        n: 19,
        q: 'On dispose d\'une PDB nommée EMSIPDB en mode OPEN abritant le schéma HR ayant comme mot de passe \'secret\'. Quelle commande pour se connecter à cette PDB via SQL*Plus ?',
        lines: 1,
        a: `<pre>sqlplus hr/secret@localhost:1521/EMSIPDB</pre>Syntaxe <b>Easy Connect</b> : <code>utilisateur/mot_de_passe@hôte:port/service</code>. HR est un utilisateur <b>local</b> de EMSIPDB, il faut donc nommer le <b>service de la PDB</b> ; sans <code>@…/EMSIPDB</code> la connexion vise la racine, où HR n'existe pas.`
      },
      {
        n: 20,
        q: 'Expliquer ce que fait cette requête et pourquoi elle est nécessaire avant d\'activer l\'utilisateur HR : <b>ALTER SESSION SET CONTAINER=ORCLPDB</b>',
        lines: 3,
        a: `La requête <b>déplace la session courante</b> (SYS) de la racine <b>CDB$ROOT</b> vers la PDB <b>ORCLPDB</b> (vérifiable avec <code>show con_name</code>).
        <br>Elle est nécessaire car <b>HR est un utilisateur local</b> : il n'existe que <b>dans ORCLPDB</b>. Depuis CDB$ROOT, <code>ALTER USER hr ACCOUNT UNLOCK;</code> échoue avec <b>ORA-01918 : l'utilisateur 'HR' n'existe pas</b>. Une fois dans la PDB :
        <pre>SQL&gt; ALTER SESSION SET CONTAINER=ORCLPDB;
SQL&gt; ALTER USER hr IDENTIFIED BY root ACCOUNT UNLOCK;</pre>`
      }
    ]
  }
];

const CSS = `
@page { size: A4; margin: 16mm 16mm 18mm; }
* { box-sizing: border-box; }
body { font-family: 'Figtree', 'Segoe UI', Arial, sans-serif; color: #0E1E2E; font-size: 10.6pt; line-height: 1.5; margin: 0; }
.head { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #0D2B4A; padding-bottom: 10px; }
.brand { font-family: 'Bricolage Grotesque', Arial, sans-serif; font-weight: 800; font-size: 20pt; letter-spacing: -0.02em; }
.brand span { background: #009646; color: #fff; border-radius: 6px; padding: 0 6px; margin-left: 4px; }
.meta { text-align: right; font-size: 8.5pt; color: #586878; text-transform: uppercase; letter-spacing: .12em; }
h1 { font-family: 'Bricolage Grotesque', Arial, sans-serif; font-size: 19pt; margin: 18px 0 2px; letter-spacing: -0.02em; }
.sub { color: #586878; margin: 0 0 6px; }
.tag { display: inline-block; font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: .14em; color: #fff; background: #009646; padding: 3px 9px; border-radius: 99px; }
.tag.navy { background: #0D2B4A; }
.info { display: flex; gap: 18px; margin: 12px 0 4px; font-size: 9pt; color: #586878; }
.info b { color: #0E1E2E; }
h2 { font-family: 'Bricolage Grotesque', Arial, sans-serif; font-size: 13pt; margin: 22px 0 6px; padding: 5px 10px; background: #ECF1EF; border-left: 4px solid #009646; break-after: avoid; }
.q { margin: 12px 0 0; break-inside: avoid; }
.qt { font-weight: 500; }
.qt .n { display: inline-block; min-width: 28px; font-weight: 800; color: #009646; }
.pt { color: #586878; font-size: 9pt; }
.line { border-bottom: 1px solid #b4cdc3; height: 26px; margin-left: 28px; }
.ans { margin: 6px 0 0 28px; padding: 8px 12px; border: 1px solid #DAE2DF; border-left: 3px solid #009646; border-radius: 4px; background: #fbfdfc; }
.tip { margin: 6px 0 0 28px; font-size: 9pt; color: #8a5a1c; }
.tip::before { content: 'À retenir : '; font-weight: 700; }
pre { font-family: 'JetBrains Mono', Consolas, monospace; font-size: 8.6pt; background: #0E1E2E; color: #e8eff4; padding: 8px 10px; border-radius: 4px; white-space: pre-wrap; margin: 6px 0; }
.qt pre { background: #f3f5f4; color: #0E1E2E; border: 1px solid #DAE2DF; }
code { font-family: 'JetBrains Mono', Consolas, monospace; font-size: 8.8pt; background: #ECF1EF; padding: 0 3px; border-radius: 3px; }
ul, ol { margin: 4px 0; padding-left: 20px; }
table { border-collapse: collapse; width: 100%; margin: 6px 0; font-size: 9.4pt; }
th, td { border: 1px solid #DAE2DF; padding: 5px 7px; text-align: left; vertical-align: top; }
th { background: #ECF1EF; }
.foot { margin-top: 26px; padding-top: 8px; border-top: 1px solid #DAE2DF; font-size: 8.5pt; color: #586878; }
`;

function page(mode: 'enonce' | 'corrige') {
  const corr = mode === 'corrige';
  const body = PARTS.map(
    (p) =>
      `<h2>${p.title}</h2>` +
      p.qs
        .map(
          (q) => `<div class="q"><div class="qt"><span class="n">${q.n}.</span><span class="pt">(1 pt)</span> ${q.q}</div>${
            corr ? `<div class="ans">${q.a}</div>${q.tip ? `<div class="tip">${q.tip}</div>` : ''}` : '<div class="line"></div>'.repeat(q.lines ?? 1)
          }</div>`
        )
        .join('')
  ).join('');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Figtree:wght@400..700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>
<div class="head"><div class="brand">GROUP<span>22</span></div><div class="meta">EMSI Rabat · 4IIR<br>Administration Oracle 1</div></div>
<h1>Contrôle continu · Administration Oracle 1</h1>
<p class="sub">Annale 2025-2026, recopiée de l'énoncé projeté en classe${corr ? ' · <b>corrigé détaillé</b>' : ''}</p>
<span class="tag${corr ? '' : ' navy'}">${corr ? 'Corrigé' : 'Énoncé'}</span>
<div class="info"><span><b>20</b> questions</span><span><b>20</b> points (1 pt chacune)</span><span>Parties A, B, C</span>${corr ? '<span>Réponses alignées sur les chapitres 2, 3 et le TP1</span>' : '<span>Nom : ______________________</span>'}</div>
${body}
<div class="foot">GROUP22 · 4IIR G22 · ${corr ? 'Corrigé rédigé à partir des supports du cours (Chapitre 2 Architecture globale, Chapitre 3 Instance Oracle, TP1). ' : ''}Document de révision, non officiel.</div>
</body></html>`;
}

const outDir = 'cours/oracle';
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const [mode, file] of [
  ['enonce', '05 - Contrôle - CC 2025-2026 (énoncé).pdf'],
  ['corrige', '06 - Contrôle - CC 2025-2026 (corrigé).pdf']
] as const) {
  const html = page(mode);
  const tab = await browser.newPage();
  await tab.setContent(html, { waitUntil: 'networkidle' });
  await tab.pdf({ path: join(outDir, file), format: 'A4', printBackground: true, margin: { top: '16mm', bottom: '18mm', left: '16mm', right: '16mm' } });
  await tab.close();
  console.log('wrote', file);
}
await browser.close();
