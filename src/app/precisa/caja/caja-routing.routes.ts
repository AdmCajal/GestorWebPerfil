import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AtencionParticularesBuscarComponent } from './atencion-particulares/components/atencion-particulares-buscar.component';
import { AtencionParticularesComponent } from './atencion-particulares/view/atencion-particulares.component';
import { AtencionParticularesPagoComponent } from './atencion-particulares/view/components/atencion-particulares-pago.component';
import { CajaComponent } from './caja.component';
import { CierraCajaBuscarComponent } from './cierraCaja/components/cierra-caja-buscar.component';
import { CierreCajaComponent } from './cierraCaja/view/cierre-caja.component';
import { CobranzasBuscarComponent } from './cobranzas/components/cobranzas-buscar.component';
import { CobranzasMantenimientoComponent } from './cobranzas/components/cobranzas-mantenimiento.component';
import { CobranzasComponent } from './cobranzas/view/cobranzas.component';
import { ComprobanteParticularBuscarComponent } from './ComprobanteParticular/components/comprobante-particular-buscar.component';
import { ComprobanteParticularComponent } from './ComprobanteParticular/view/comprobante-particular.component';
import { PendienteAprobacionDetalleComponent } from './PendienteAprobacion/view/components/pendiente-aprobacion-detalle.component';
import { PendienteAprobacionBuscarComponent } from './PendienteAprobacion/components/pendiente-aprobacion-buscar.component';
import { PendienteAprobacionComponent } from './PendienteAprobacion/view/pendiente-aprobacion.component';


const routes: Routes = [{
  path: '',
  component: CajaComponent,
  children: [
    {
      path: 'co_admisionmantenimiento',
      component: AtencionParticularesComponent,
    },
    {
      path: 'co_cobranzasmantenimiento',
      component: CobranzasComponent,
    },
    {
      path: 'co_comprobantesmantenimiento',
      component: ComprobanteParticularComponent,
    },
    {
      path: 'co_liquidacionmantenimiento',
      component: PendienteAprobacionComponent,
    },
    {
      path: 'co_cierrecajamantenimiento',
      component: CierreCajaComponent,
    },
  
  


  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CajaRoutingModule { }

export const routedComponents = [
  CajaComponent,
  AtencionParticularesComponent,
  AtencionParticularesPagoComponent,
  AtencionParticularesBuscarComponent,
  ComprobanteParticularComponent,
  CierreCajaComponent,
  CierraCajaBuscarComponent,
  CobranzasComponent,
  CobranzasMantenimientoComponent,
  CobranzasBuscarComponent,
  ComprobanteParticularBuscarComponent,
  PendienteAprobacionComponent,
  PendienteAprobacionBuscarComponent,
  PendienteAprobacionDetalleComponent,

  
];
