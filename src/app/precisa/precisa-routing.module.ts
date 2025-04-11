import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ECommerceComponent } from '../pages/e-commerce/e-commerce.component';
import { PrecisaIndexComponent } from './precisa-index.component';


const routes: Routes = [{
  path: '',
  component: PrecisaIndexComponent,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'caja',
      loadChildren: () => import('./caja/caja.module').then(m => m.CajaModule)
    },
    {
      path: 'liquidacion',
      loadChildren: () => import('./liquidacion/liquidacion.module').then(m => m.LiquidacionModule),
    },
    {
      path: 'facturacion',
      loadChildren: () => import('./comprobante/comprobante.module').then(m => m.ComprobanteModule),
    },
    {
      path: 'admision',
      loadChildren: () => import('./admision/admision.module').then(m => m.AdmisionModule),
    },
    {
      path: 'maestros',
      loadChildren: () => import('./maestros/maestros.module').then(m => m.MaestrosModule),
    },
    {
      path: 'reportes',
      loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule),
    },
    {
      path: 'seguridad',
      loadChildren: () => import('./seguridad/seguridad.module').then(m => m.SeguridadModule),
    },
    {
      path: 'proyecto',
      loadChildren: () => import('./proyecto/proyecto.module').then(m => m.ProyectoModule),
    },
    {
      path: 'ventas',
      loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule),
    },
    {
      path: 'analisis',
      loadChildren: () => import('./analisis/analisis.module').then(m => m.AnalisisModule),
    },
    {
      path: 'asistencia',
      loadChildren: () => import('./asistencia/asistencia.module').then(m => m.AsistenciaModule),
    },
    {
      path: 'bandeja',
      loadChildren: () => import('./bandeja/bandeja.module').then(m => m.BandejaModule),
    },
    {
      path: 'tramite',
      loadChildren: () => import('./tramite/tramite.module').then(m => m.TramiteModule),
    },
    {
      path: 'mensajeria',
      loadChildren: () => import('./mensajeria/mensajeria.module').then(m => m.MensajeriaModule)
    },
    // {
    //   path: 'consulta',
    //   loadChildren: () => import('./consulta/consulta.module').then(m => m.ConsultaModule),
    // },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      loadChildren: () => import('./miscellaneous/miscellaneous.module').then(m => m.MiscellaneousModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrecisaRoutingModule {
}
