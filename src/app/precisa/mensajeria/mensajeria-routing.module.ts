import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MensajeriaComponent } from './mensajeria.component';
import { ProgramarMensajeComponent } from './programar-mensaje/view/programar-mensaje.component';
import { MensajeComponent } from './formato-mensaje/view/mensaje.component';

const routes: Routes = [{
  path: '',
  component: MensajeriaComponent,
  children: [
    {
      path: 'co_mensajes',
      component: MensajeComponent
    },
    {
      path:'co_programacion',
      component:ProgramarMensajeComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MensajeriaRoutingModule { }
