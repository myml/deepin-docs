import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { marked } from 'marked';

import { isBrowser } from './helper';
import { DOCUMENT } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { MarkdownService } from './markdown.service';
import { SeoService } from './seo.service';
import { FileService } from './file.service';

@Injectable({
  providedIn: 'root',
})
export class RenderService implements Resolve<Result> {
  isBrowser = isBrowser();
  constructor(
    private fileService: FileService,
    private markdownService: MarkdownService,
    private seoService: SeoService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.worker(state.url);
  }

  async worker(path: string) {
    try {
      const mdContent = await this.fileService.getFile(path);
      const baseUrl = path.slice(0, path.lastIndexOf('/') + 1);
      const result = await this.markdownService.redner(mdContent, {
        baseURL: baseUrl,
      });
      this.seoService.seo(result.html);
      return { html: result.html };
    } catch (err) {
      console.log(err);
      return { html: '<h1>404</h1>' };
    }
  }
}

export interface Result {
  html: string;
}
