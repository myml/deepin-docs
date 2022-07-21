import { Injectable } from '@angular/core';
import fm from 'front-matter';
import { marked } from 'marked';
import { isBrowser } from './helper';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  isBrowser = isBrowser();
  constructor() {}

  async redner(md: string, opt: { baseURL: string }) {
    const result = fm(md);
    const html = await new Promise<string>((resolve, reject) => {
      marked.parse(result.body, { baseUrl: opt.baseURL }, (err, html) =>
        err ? reject(err) : resolve(html)
      );
    });
    return { html, attrs: result.attributes };
  }
}
