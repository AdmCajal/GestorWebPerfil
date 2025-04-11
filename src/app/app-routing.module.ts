import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PrecisaGuard } from './precisa/precisa.guard';
import { AuthGuard } from './precisa/auth/auth.guard';

export const routes: Routes = [
  /*    {
      path: 'pages',
      loadChildren: () => import('./pages/pages.module')
        .then(m => m.PagesModule),
    },   */
  {
    path: 'precisa',
    canActivate: [PrecisaGuard],
    loadChildren: () => import('./precisa/precisa.module')
      .then(m => m.PrecisaModule),
  },
  {
    path: 'auth',
    canActivate: [AuthGuard],
    loadChildren: () => import('./precisa/auth/auth.module')
      .then(m => m.AuthModule),
  },
  { path: '', redirectTo: 'precisa', pathMatch: 'full' },
  { path: '**', redirectTo: 'precisa' },
];

const config: ExtraOptions = {
  useHash: false,
  preloadingStrategy: PreloadAllModules
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
