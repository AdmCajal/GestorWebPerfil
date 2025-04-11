import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogoSunatComponent } from './catalogo-sunat/catalogo-sunat.component';
import { ComprobanteComponent } from './comprobante.component';
import { ListaComprobantesMantenimientoComponent } from './lista-comprobantes/components/lista-comprobantes-mantenimiento.component';
import { ListaComprobantesComponent } from './lista-comprobantes/view/lista-comprobantes.component';
import { PendienteFacturaComponent } from './PendienteFactura/view/pendiente-factura.component';
import { ResumenBoletasComponent } from './ResumenBoletas/view/Resumen-Boletas-comprobantes.component';



const routes: Routes = [{
  path: '',
  component: ComprobanteComponent,
  children: [
    {
      path: 'co_facturacionparticular',
      component: ListaComprobantesComponent,
    },
    {
      path: 'co_resumenboletasmantenimiento',
      component: ResumenBoletasComponent,
    },
    {
      path: 'co_consultaadmision',
      component: PendienteFacturaComponent,
    },
    {
      path: 'co_catalogomantenimiento',
      component: CatalogoSunatComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComprobanteRoutingModule { }

export const routedComponents = [
  ComprobanteComponent,
  ListaComprobantesComponent,
  PendienteFacturaComponent,
  ResumenBoletasComponent,
  CatalogoSunatComponent,
  ListaComprobantesMantenimientoComponent,

];
