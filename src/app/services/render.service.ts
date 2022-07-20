import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { marked } from 'marked';

import markdownFiles from 'src/assets/md.json';
import { isBrowser } from './helper';
import { DOCUMENT } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class RenderService implements Resolve<Result> {
  isBrowser = isBrowser();
  constructor(
    private http: HttpClient,
    private transfer: TransferState,
    @Inject(DOCUMENT) private document: Document
  ) {}

  markdownFiles: { path: string; url?: string; content?: string }[] =
    markdownFiles;

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.worker(state.url);
  }

  async worker(path: string) {
    const mdfile = this.markdownFiles.find((item) => item.path === path);
    let mdContent = mdfile?.content;
    if (!mdContent) {
      if (mdfile?.url) {
        mdContent = await this.getFile(mdfile.url);
      } else {
        throw 'json format';
      }
    }
    const baseUrl = path.slice(0, path.lastIndexOf('/') + 1);
    const result = await this.redner(mdContent, { baseUrl: baseUrl });
    this.seo(result.html);
    return { html: result.html };
  }

  async getFile(url: string) {
    const key = makeStateKey<string>(url);
    if (this.transfer.hasKey(key)) {
      console.log('hasKey');
      return this.transfer.get<string>(key, '');
    }
    const content = await firstValueFrom(
      this.http.get(url, { responseType: 'text' })
    );
    this.transfer.set(key, content);
    return content;
  }

  async redner(md: string, opt: Parameters<typeof marked.parse>[1]) {
    const html = await new Promise<string>((resolve, reject) => {
      marked.parse(md, opt, (err, html) => (err ? reject(err) : resolve(html)));
    });
    return { html };
  }

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

export interface Result {
  html: string;
}
