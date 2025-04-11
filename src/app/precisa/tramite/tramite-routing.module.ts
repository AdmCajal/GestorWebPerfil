import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoViewComponent } from './Tipo/tipo-view/tipo-view.component';
import { TramiteComponent } from './tramite.component';
import { TramiteViewComponent } from './Tramite/tramite-view/tramite-view.component';


const routes: Routes = [{
  path: '',
  component:TramiteComponent,
  children: [
    {
      path:'co_tipotramite',
      component:TipoViewComponent,
    },
    {
      path:'co_tramite',
      component:TramiteViewComponent,
    },    
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TramiteRoutingModule { }

export const routedComponents = [
  TipoViewComponent,
  TramiteViewComponent, 
];


