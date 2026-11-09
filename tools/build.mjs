// Usage: node tools/build.mjs [output-dir]   (default: dist/)
import { cp, mkdir, rm, access, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Absolute URLs in src/index.html (canonical, og:url, og:image) use this base.
const DEFAULT_BASE = "https://veillette.github.io/sketchbook/";
const source = new URL("../src/", import.meta.url);
const output = process.argv[2] ? pathToFileURL(resolve(process.argv[2]) + "/") : new URL("../dist/", import.meta.url);
await access(new URL("index.html", source));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
// Hosting can supply its own canonical origin and deployment subdirectory.
if (process.env.SITE_URL) {
  const url = new URL(process.env.SITE_URL);
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("SITE_URL must use HTTP or HTTPS");
  url.search = "";
  url.hash = "";
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  const index = new URL("index.html", output);
  const html = await readFile(index, "utf8");
  if (!html.includes(DEFAULT_BASE)) throw new Error(`index.html no longer contains ${DEFAULT_BASE}`);
  await writeFile(index, html.replaceAll(DEFAULT_BASE, url.href));
}
console.log(`Built static site in ${decodeURIComponent(output.pathname)}`);
