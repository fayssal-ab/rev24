/**
 * Local API for development: serves netlify/functions/api.mts on http://localhost:8788
 * (Vite proxies /api there). Reads .env.local / .env for DATABASE_URL, JWT_SECRET, DB_CA_CERT, DB_SSL.
 *   npm run dev:api   (in one terminal)   +   VITE_AUTH=on npm run dev   (in another)
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';

for (const f of ['.env.local', '.env']) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

// path in a variable: TypeScript does not type-check the .mts import, tsx resolves it at runtime
const fnPath = '../netlify/functions/api.mts';
const handler = ((await import(fnPath)) as { default: (req: Request) => Promise<Response> }).default;

createServer(async (req, res) => {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const r = await handler(
    new Request(`http://localhost:8788${req.url}`, {
      method: req.method,
      headers: Object.entries(req.headers).flatMap(([k, v]) => (v === undefined ? [] : [[k, Array.isArray(v) ? v.join(', ') : v]])) as [string, string][],
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body
    })
  );
  res.writeHead(r.status, Object.fromEntries(r.headers));
  res.end(Buffer.from(await r.arrayBuffer()));
}).listen(8788, () => console.log('API → http://localhost:8788/api'));
