import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VentasComponent } from './ventas.component';
import { ContratoViewComponent } from './Contrato/contrato-view/contrato-view.component';
import { ControlViewComponent } from './Control/control-view/control-view.component';
import { InteresViewComponent } from './Interes/interes-view/interes-view.component';
import { ReservaViewComponent } from './Reserva/reserva-view/reserva-view.component';


const routes: Routes = [{
  path: '',
  component:VentasComponent,
  children: [
    {
      path:'co_contratomantenimiento',
      component:ContratoViewComponent,
    },
    {
      path:'co_controlmantenimiento',
      component:ControlViewComponent,
    },    
    {
      path:'co_interesmantenimiento',
      component:InteresViewComponent,
    },
    {
      path:'co_reservamantenimiento',
      component:ReservaViewComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }

export const routedComponents = [
  ReservaViewComponent,
  ContratoViewComponent, 
  ControlViewComponent,
  InteresViewComponent,
];