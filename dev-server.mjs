// Local test server: serves app/dist and the Netlify token function, using the values in .env.
// Usage: cd app && npm run build, then: node dev-server.mjs   (opens on http://localhost:8000)
import { createReadStream, existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "app", "dist");
const port = Number(process.env.PORT || 8000);

for (const line of readFileSync(join(root, ".env"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
}

const tokenFn = await import(pathToFileURL(join(root, "netlify", "functions", "token.js")).href);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname === "/api/token") {
    const r = await tokenFn.default(req);
    res.writeHead(r.status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    res.end(await r.text());
    return;
  }
  const requested = normalize(join(dist, url.pathname === "/" ? "index.html" : url.pathname));
  const file = requested.startsWith(dist) && existsSync(requested) ? requested : join(dist, "index.html");
  res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => console.log(`Open http://localhost:${port}`));
