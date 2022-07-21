import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { isBrowser } from './helper';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  isBrowser = isBrowser();
  constructor(@Inject(DOCUMENT) private document: Document) {}

  async seo(html: string) {
    let title = '';
    if (this.isBrowser) {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const h = doc.querySelector('h1, h2');
      if (h) {
        title = h.textContent || '';
      }
    } else {
      const htmlParser = await import('node-html-parser');
      const doc = htmlParser.parse(html);
      const h = doc.querySelector('h1, h2');
      if (h) {
        title = h.textContent;
      }
    }
    if (title) {
      this.document.title = title;
    }
  }
}
