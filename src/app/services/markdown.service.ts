import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { isBrowser } from './helper';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  isBrowser = isBrowser();
  constructor() {}

  async redner(md: string, opt: { baseURL: string }) {
    const html = await new Promise<string>((resolve, reject) => {
      marked.parse(md, { baseUrl: opt.baseURL }, (err, html) =>
        err ? reject(err) : resolve(html)
      );
    });
    return { html };
  }
}
