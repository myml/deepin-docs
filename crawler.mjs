import { marked } from "marked";
import fetch from "node-fetch";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import * as parser from "node-html-parser";

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
    mdPaths.push(p);
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

const urls = [
  {
    path: "a/packages/packages_zh.md",
    url: "http://localhost:8000/docs/mirrors/packages_zh.md",
  },
];

await Promise.all(urls.map((url) => crawler(url.url, url.path)));

await writeFile("routes", mdPaths.join("\n"));