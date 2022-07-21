import { HttpClient } from '@angular/common/http';
import { inject, Injectable, InjectFlags, InjectionToken } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { isBrowser } from './helper';

export const NODE_READ_FILE = new InjectionToken<
  (path: string) => Promise<string>
>('node.fs.readfile');

@Injectable({
  providedIn: 'root',
})
export class FileService {
  isBrowser = isBrowser();
  readFile = inject(NODE_READ_FILE, InjectFlags.Optional);
  constructor(private http: HttpClient, private transfer: TransferState) {}

  async getFile(path: string) {
    const key = makeStateKey<string>(path);
    if (this.transfer.hasKey(key)) {
      return this.transfer.get<string>(key, '');
    }
    let content = '';
    if (this.isBrowser) {
      content = await firstValueFrom(
        this.http.get('assets' + path, { responseType: 'text' })
      );
    } else if (this.readFile) {
      content = await this.readFile('src/assets' + path);
    } else {
      throw 'missing read file function';
    }

    this.transfer.set(key, content);
    return content;
  }
}
