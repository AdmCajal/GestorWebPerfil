import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BandejaComponent } from './bandeja.component';
import { AsignacionesViewComponent } from './Asignaciones/asignaciones-view/asignaciones-view.component';
import { ControlViewComponent } from './Control/control-view/control-view.component';
import { SolicitudesViewComponent } from './Solicitudes/solicitudes-view/solicitudes-view.component';

const routes: Routes = [{
  path: '',
  component:BandejaComponent,
  children: [
    {
      path:'co_solicitudes',
      component:SolicitudesViewComponent,
    },
    {
      path:'co_asignaciones',
      component:AsignacionesViewComponent,
    },
    {
      path:'co_controltramite',
      component:ControlViewComponent,
    },    
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BandejaRoutingModule { }

export const routedComponents = [
  SolicitudesViewComponent,
  AsignacionesViewComponent,
  ControlViewComponent
];
