import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CorrelativosComponent } from './correlativos/view/correlativos.component';
import { LiquidacionComponent } from './liquidacion.component';
import { LiquidacionFormComponent } from './liquidacion_form/view/liquidacion-form.component';
import { ProduccionComponent } from './produccion/view/produccion.component';
import { FacturacionComponent } from './facturacion/view/facturacion.component';
import { AprobacionEstadoComponent } from './aprobacion/view/aprobacion-estado.component';
import { CorrelativosMantenimientoComponent } from './correlativos/components/correlativos-mantenimiento.component';
import { AprobacionEstadoMantenimientoComponent } from './aprobacion/components/aprobacion-estado-mantenimiento.component';
import { ProduccionMantenimientoComponent } from './produccion/components/produccion-mantenimiento.component';
import { LiquidacionFormMantenimientoComponent } from './liquidacion_form/components/liquidacion-form-mantenimiento.component';
import { FacturacionMantenimientoComponent } from './facturacion/components/facturacion-mantenimiento.component';



const routes: Routes = [{
  path: '',
  component: LiquidacionComponent,
  children: [
    {
      path: 'co_correlativosmastmantenimiento',
      component: CorrelativosComponent,
    },
    {
      path: 'co_produccionmantenimiento',
      component: ProduccionComponent,
    },
    {
      path: 'co_liquidacion',
      component: LiquidacionFormComponent,
    },
    {
      path: 'co_facturacionmantenimiento',
      component: FacturacionComponent,
    },
    {
      path: 'co_aprobacionestadomantenimiento',
      component: AprobacionEstadoComponent,
    }

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class liquidacionRoutingModule { }

export const routedComponents = [

  LiquidacionComponent,
  CorrelativosComponent,
  ProduccionComponent,
  ProduccionMantenimientoComponent,
  FacturacionComponent,
  FacturacionMantenimientoComponent,
  LiquidacionFormComponent,
  LiquidacionFormMantenimientoComponent,
  AprobacionEstadoComponent,
  AprobacionEstadoMantenimientoComponent,
  CorrelativosComponent,
  CorrelativosMantenimientoComponent,



];
