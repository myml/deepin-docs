import { marked } from "marked";
import fetch from "node-fetch";
import path from "path";
import { writeFile, mkdir, readFile } from "fs/promises";
import * as parser from "node-html-parser";
import { load } from "js-yaml";

// file download dir
const assets = "src/assets";

const mdPaths = [];
const allUrl = [];
async function crawler(url, p) {
  if (allUrl.includes(url)) {
    return;
  }
  allUrl.push(url);

  console.log(p, url);
  // download file
  const resp = await fetch(url);
  const body = await resp.blob();
  const filepath = path.join(assets, p);
  await mkdir(path.dirname(filepath), { recursive: true });
  await writeFile(filepath, new Uint8Array(await body.arrayBuffer()));

  // parse markdown and download internal link
  if (url.endsWith(".md")) {
    mdPaths.push(p.slice(0, -3)); // remove .md suffix
    const content = await body.text();
    const html = marked(content);
    const doc = parser.parse(html);
    const urls = doc
      .querySelectorAll("a")
      .filter((el) => {
        // filter external link and mail link
        const href = el.getAttribute("href");
        return !href.includes("://") && !href.startsWith("mailto:");
      })
      .map((el) => {
        const href = el.getAttribute("href");
        const u = new URL(url);
        u.pathname = path.join(path.dirname(u.pathname), href);
        return {
          path: path.join(path.dirname(p), href),
          url: u.toString(),
        };
      });
    await Promise.all(urls.map((url) => crawler(url.url, url.path)));
  }
}

const config = load(await readFile("crawler-config.yaml"));
console.log(config);
const urls = config.urls || [];

await Promise.all(urls.map((url) => crawler(url.url, url.path)));

await writeFile("routes", mdPaths.join("\n"));
