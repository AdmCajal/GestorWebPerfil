import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdmisionComponent } from './admision.component';
import { PacienteClinicaComponent } from './paciente-clinica/view/paciente-clinica.component';
import { PacienteClinicaBuscarOAComponent } from "./paciente-clinica/view/components/paciente-clinica-buscarOA.component";
import { ConvenioComponent } from './convenio/view/convenio.component';
import { ParticularComponent } from './particular/view/particular.component';
import { ConsultaAdmisionComponent } from './consulta/consulta-admision.component';
import { PacienteClinicaBuscarPacienteComponent } from './paciente-clinica/view/components/paciente-clinica-buscarPaciente.component';
import { PacienteClinicaBuscarPruebaComponent } from './paciente-clinica/view/components/paciente-clinica-buscarPrueba.component';
import { ConsultaDetalleComponent } from './consulta/components/consulta-detalle.component';
import { ConsultacomprobanteComponent } from './Comprobante/consultacomprobante/consultacomprobante.component';
import { ConsultaletraspendientesComponent } from './Letras/consultaletraspendientes/consultaletraspendientes.component';
import { ConsultaletrasvencidasComponent } from './Letras/consultaletrasvencidas/consultaletrasvencidas.component';
import { ConsultaingresoComponent } from './Ingreso/consultaingreso/consultaingreso.component';
import { ConsultanotificacionesComponent } from './Notificaciones/consultanotificaciones/consultanotificaciones.component';
import { ConsultarequerimientoComponent } from './Requerimiento/consultarequerimiento/consultarequerimiento.component';


const routes: Routes = [{
  path: '',
  component: AdmisionComponent,
  children: [
    {
      path: 'co_admisionclinica/:accion/:dto',
      component: PacienteClinicaComponent,
    },
    {
      path: 'co_admisionclinica',
      component: PacienteClinicaComponent,

    },
    {
      path: 'co_admisionconvenio',
      component: ConvenioComponent,
    },
    {
      path: 'co_admisionconvenio/:accion/:dto',
      component: ConvenioComponent,
    },
    {
      path: 'co_admisionparticular/:accion/:dto',
      component: ParticularComponent,
    },
    {
      path: 'co_admisionparticular',
      component: ParticularComponent,
    },
    {
      path: 'co_consultaadmision',
      component: ConsultaAdmisionComponent,
    },    
    {
      path: 'co_consultacomprobante',
      component: ConsultacomprobanteComponent,
    },
    {
      path: 'co_consultaletrasvencidas',
      component: ConsultaletrasvencidasComponent,
    },
    {
      path: 'co_consultaletraspendientes',
      component: ConsultaletraspendientesComponent,
    },
    {
      path: 'co_consultaingreso',
      component: ConsultaingresoComponent,
    },
    {
      path: 'co_consultanotificaciones',
      component: ConsultanotificacionesComponent,
    },
    {
      path: 'co_consultarequerimiento',
      component: ConsultarequerimientoComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmisionRoutingModule { }

export const routedComponents = [
  PacienteClinicaComponent,
  AdmisionComponent,
  ConvenioComponent,
  ParticularComponent,
  PacienteClinicaBuscarOAComponent,
  PacienteClinicaBuscarPacienteComponent,
  PacienteClinicaBuscarPruebaComponent,
  ConsultaAdmisionComponent,
  ConsultaDetalleComponent
];
