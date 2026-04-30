const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");
const SPACE_FILE = path.join(DATA_DIR, "space.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

async function ensureSpaceFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(SPACE_FILE);
  } catch {
    await writeSpace({
      text: "Welcome to Third Space.\n\nThis is a shared note. Anyone with this page open can edit it.",
      updatedAt: new Date().toISOString()
    });
  }
}

async function readSpace() {
  await ensureSpaceFile();
  const raw = await fs.readFile(SPACE_FILE, "utf8");
  return JSON.parse(raw);
}

async function writeSpace(space) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SPACE_FILE, JSON.stringify(space, null, 2));
}

function sendJson(res, statusCode, body) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload)
  });
  res.end(payload);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 100_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

async function serveStatic(req, res) {
  const requestPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, safePath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const contents = await fs.readFile(filePath);
    const contentType = MIME_TYPES[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(req.method === "HEAD" ? undefined : contents);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/api/space" && req.method === "GET") {
      sendJson(res, 200, await readSpace());
      return;
    }

    if (url.pathname === "/api/space" && req.method === "PUT") {
      const body = await readRequestBody(req);
      const payload = JSON.parse(body || "{}");
      const text = String(payload.text || "").slice(0, 20_000);
      const space = { text, updatedAt: new Date().toISOString() };

      await writeSpace(space);
      sendJson(res, 200, space);
      return;
    }

    if (req.method === "GET" || req.method === "HEAD") {
      await serveStatic(req, res);
      return;
    }

    res.writeHead(405);
    res.end("Method not allowed");
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Something went wrong." });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Third Space is running at http://${HOST}:${PORT}`);
});
