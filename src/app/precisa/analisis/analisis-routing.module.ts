import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalisisComponent } from './analisis.component';
import { EgresoViewComponent } from './Egreso/egreso-view/egreso-view.component';
import { IngresoViewComponent } from './Ingreso/ingreso-view/ingreso-view.component';


const routes: Routes = [{
  path: '',
  component:AnalisisComponent,
  children: [
    {
      path:'co_ingresomantenimiento',
      component:IngresoViewComponent,
    },
    {
      path:'co_egresosmantenimiento',
      component:EgresoViewComponent,
    },    
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AnalisisRoutingModule { }

export const routedComponents = [
  IngresoViewComponent,
  EgresoViewComponent, 
];


