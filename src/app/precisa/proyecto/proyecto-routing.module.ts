import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProyectoComponent } from './proyecto.component';
import { LotesViewComponent } from './Lotes/lotes-view/lotes-view.component';
import { ManzanaViewComponent } from './Manzana/manzana-view/manzana-view.component';
import { ProgramaViewComponent } from './Programa/programa-view/programa-view.component';
import { ProgramaMantenimientoComponent } from './Programa/programa-mantenimiento/programa-mantenimiento.component';
import { ManzanaMantenimientoComponent } from './Manzana/manzana-mantenimiento/manzana-mantenimiento.component';
import { LotesMantenimientoComponent } from './Lotes/lotes-mantenimiento/lotes-mantenimiento.component';


const routes: Routes = [{
  path: '',
  component: ProyectoComponent,
  children: [
    {
      path:'co_programamantenimiento',
      component:ProgramaViewComponent,
    },
    {
      path:'co_manzanamantenimiento',
      component:ManzanaViewComponent,
    },    
    {
      path:'co_lotemantenimiento',
      component:LotesViewComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyectoRoutingModule { }

export const routedComponents = [
  ProgramaViewComponent,
  ManzanaViewComponent, 
  LotesViewComponent,
  ProgramaMantenimientoComponent,
  ManzanaMantenimientoComponent,
  LotesMantenimientoComponent
  
];