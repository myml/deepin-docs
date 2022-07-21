import { NgModule } from '@angular/core';
import {
  ServerModule,
  ServerTransferStateModule,
} from '@angular/platform-server';
import { readFile } from 'fs/promises';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { NODE_READ_FILE } from './services/file.service';

@NgModule({
  imports: [AppModule, ServerModule, ServerTransferStateModule],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: NODE_READ_FILE,
      useValue: async (file: string) => {
        const buff = await readFile(file, 'utf8');
        return buff.toString();
      },
    },
  ],
})
export class AppServerModule {}
