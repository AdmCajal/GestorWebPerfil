import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsistenciaComponent } from './asistencia.component';
import { AsistenciaMantenimientoComponent } from './Asistencia/asistencia-mantenimiento/asistencia-mantenimiento.component';
import { AsistenciaViewComponent } from './Asistencia/asistencia-view/asistencia-view.component';

const routes: Routes = [{
  path: '',
  component:AsistenciaComponent,
  children: [
    {
      path:'co_asistencia',
      component:AsistenciaViewComponent,
    },     
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsistenciaRoutingModule { }

export const routedComponents = [
  AsistenciaViewComponent,
  AsistenciaMantenimientoComponent
];
