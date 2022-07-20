import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenderService } from './services/render.service';

const routes: Routes = [
  {
    path: '**',
    resolve: { result: RenderService },
    loadComponent: () =>
      import('./components/render/render.component').then(
        (c) => c.RenderComponent
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
