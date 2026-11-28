// Local REST server for the API tests and CI: serves the same handlers Vercel deploys under /api.
import http from "node:http";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const routes = [
  { pattern: /^\/api\/products$/, file: "../api/products/index.js" },
  { pattern: /^\/api\/products\/([^/]+)$/, file: "../api/products/[slug].js", keys: ["slug"] },
  { pattern: /^\/api\/categories$/, file: "../api/categories.js" },
  { pattern: /^\/api\/cart\/price$/, file: "../api/cart/price.js" },
  { pattern: /^\/api\/promo\/validate$/, file: "../api/promo/validate.js" },
  { pattern: /^\/api\/orders$/, file: "../api/orders.js" },
];

const PORT = Number(process.env.API_PORT || 3200);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(payload));
  };

  const match = routes
    .map((r) => ({ route: r, found: r.pattern.exec(url.pathname) }))
    .find((m) => m.found);

  if (!match) {
    res.status(404).json({ error: `No route for ${url.pathname}` });
    return;
  }

  const query = Object.fromEntries(url.searchParams.entries());
  (match.route.keys || []).forEach((key, i) => {
    query[key] = decodeURIComponent(match.found[i + 1]);
  });

  let raw = "";
  req.on("data", (chunk) => (raw += chunk));
  req.on("end", () => {
    let body;
    if (raw) {
      try {
        body = JSON.parse(raw);
      } catch {
        res.status(400).json({ error: "Body must be valid JSON" });
        return;
      }
    }
    req.query = query;
    req.body = body;
    try {
      require(match.route.file)(req, res);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Coffee Nation REST API on http://localhost:${PORT}/api`);
});
