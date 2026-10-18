import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, sep, extname } from "node:path";

const root = fileURLToPath(new URL(".", import.meta.url));
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".mp4": "video/mp4", ".svg": "image/svg+xml" };
createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, "http://preview").pathname;
    if (pathname.startsWith("/_next/") || pathname.startsWith("/moneybee")) {
      const response = await fetch(`https://moneybees.localhost:1355${req.url}`);
      res.writeHead(response.status, { "Content-Type": response.headers.get("content-type") ?? "application/octet-stream" });
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    const path = resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
    if (!path.startsWith(root.endsWith(sep) ? root : root + sep)) {
      res.writeHead(403).end();
      return;
    }
    const body = await readFile(path);
    res.writeHead(200, { "Content-Type": types[extname(path)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(Number(process.env.PORT), "127.0.0.1", () => console.log("Terrain preview ready"));
