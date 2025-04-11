import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsignarServicioComponent } from './asignar-servicio/view/asignar-servicio.component';
import { ConfiguracionContratosComponent } from './ConfiguracionContratos/view/configuracion-contratos.component';
import { MaestrosComponent } from './maestros.component';
import { ModeloServicioComponent } from './ModeloServicio/view/modelo-servicio.component';
import { TipoAdmisionComponent } from './TipoAdmision/view/tipo-admision.component';
import {AutorizacionesComponent} from './autorizaciones/view/autorizaciones.component';
import { ExamenComponent } from './examen/view/examen.component';
import { ListaBaseComponent } from './lista-base/view/lista-base.component';
import {ExamenListaComponent} from './exameneslista/view/examen-lista.component';
import { FormMaestroComponent } from './FormMaestro/view/form-maestro.component';
import { FormMaestroMantenimientoComponent } from './FormMaestro/view/components/form-maestro-mantenimiento.component';
import { MaestroDetalleComponent } from './Detalle/view/maestro-detalle.component';
import { TipoCambioComponent } from './TipoCambio/view/tipo-cambio.component';
import { TipoTrabajadorComponent } from './TipoTrabajador/view/tipo-trabajador.component';
import {CuentaBancariaComponent} from  './CuentaBancaria/view/cuenta-bancaria.component';
import {EmpleadosComponent} from './Empleados/view/empleados.component';
import { MedicoComponent } from './Medico/view/medico.component';
import { TipoPacienteComponent } from './TipoPaciente/view/tipo-paciente.component';
import { AseguradoraComponent } from './Aseguradora/view/aseguradora.component';
import { MuestraComponent } from './Muestra/view/muestra.component';
import { SedesComponent } from './Sedes/view/sedes.component';
import { InsumoComponent } from './Insumo/view/insumo.component';
import { ExamenPatologicoComponent } from './ExamenPatológico/view/examen-patologico.component';
import { AprobadoresComponent } from './Aprobadores/view/aprobadores.component';
import { CambioComercialComponent } from './CambioComercial/cambio-comercial.component';
import { TipoPagoComponent } from './TipoPago/view/tipo-pago.component';
import { ParametrosComponent } from './Parametros/view/parametros.component';
import { AsignarExamenesComponent } from './asignar-examenes/asignar-examenes.component';
import { ModeloServicioMantenimientoComponent } from './ModeloServicio/components/modelo-servicio-mantenimiento.component'
import { ConfiguracionContratosMantenimientoComponent } from './ConfiguracionContratos/components/configuracion-contratos-mantenimiento.component';
import { AutorizacionesMantenimientoComponent } from './autorizaciones/view/components/autorizaciones-mantenimiento.component';
import { ListaBaseMantenimientoComponent } from './lista-base/components/lista-base-mantenimiento.component';
import { ExamenListaMantenimientoComponent } from './exameneslista/components/examen-lista-mantenimiento.component';
import { MaestroDetalleMantenimientoComponent } from './Detalle/components/maestro-detalle-mantenimiento.component';
import { TipoCambioMantenimientoComponent } from './TipoCambio/components/tipo-cambio-mantenimiento.component';
import { TipoTrabajadorMantenimientoComponent } from './TipoTrabajador/components/tipo-trabajador-mantenimiento.component';
import { CuentaBancariaMantenimientoComponent } from './CuentaBancaria/view/components/cuenta-bancaria-mantenimiento.component';
import { ParametrosMantenimientoComponent } from './Parametros/components/parametros-mantenimiento.component';
import { TipoPagoMantenimientoComponent } from './TipoPago/components/tipo-pago-mantenimiento.component';
import { TipoPacienteMantenimientoComponent } from './TipoPaciente/view/components/tipo-paciente-mantenimiento.component';
import { MuestrasMantenimientoComponent } from './Muestra/view/components/muestra-mantenimiento.component';
import { SedesMantenimientoComponent } from './Sedes/view/components/sedes-mantenimiento.component';
import { CambioComercialMantenimientoComponent } from './CambioComercial/components/cambio-comercial-mantenimiento.component';
import { AprobadoresMantenimientoComponent } from './Aprobadores/components/aprobadores-mantenimiento.component';
import { ExamenPatologicoMantenimientoComponent } from './ExamenPatológico/components/examen-patologico-mantenimiento.component';
import { EmpleadosMantenimientoComponent } from './Empleados/components/empleados-mantenimiento.component';
import { InsumoMantenimientoComponent } from './Insumo/components/insumo-mantenimiento.component';
import { CuentaBancariaBuscarComponent } from './CuentaBancaria/view/components/cuenta-bancaria-buscar.component';
import { AprobadoresBuscarComponent } from './Aprobadores/components/aprobadores-buscar.component';
import { PersonamastComponent } from './persona/vista/personamast.component';
import { MaestroBancoListadoComponent } from './maestroBanco/vista/maestro-banco-listado.component';
import { MaestroBancoMantenimientoComponent } from './maestroBanco/components/maestro-banco-mantenimiento.component';



const routes: Routes = [{
  path: '',
  component:MaestrosComponent,
  children: [
    {
      path:'co_asignacioncomponenteslistabase',
      component:AsignarExamenesComponent,
    },
    {
      path: 'co_asignacionmodeloservicio',
      component: AsignarServicioComponent,
    },
    {
      path: 'co_tipooperacionmantenimiento',
      component: ConfiguracionContratosComponent,
    }
    ,
    {
      path: 'co_modeloserviciomantenimiento',
      component: ModeloServicioComponent,
    },
    {
      path: 'co_tipo _admision _maestromantenimiento',
      component: TipoAdmisionComponent,
    },
    {
      path: 'co_personasmantenimiento',
     // component: PersonaComponent,
     component: PersonamastComponent,
     
    },
    {
      path: 'co_autorizacionmantenimiento',
      component: AutorizacionesComponent,
    },
    {
      path: 'co_componentemantenimiento',
      component: ExamenComponent,
    },
    {
      path: 'co_listabasemantenimiento',
      component: ListaBaseComponent,
    },
    {
      path: 'co_listabasecomponentemantenimiento',
      component:ExamenListaComponent,
    },
    {
      path: 'co_maestrosmantenimiento',
      component:FormMaestroComponent,
    },
    {
      path: 'co_tabladetallesmantenimiento',
      component:MaestroDetalleComponent,
    },
    {
      path: 'co_tipocambiomantenimiento',
      component:TipoCambioComponent,
    },
    {
      path: 'co_tipotrabajadormantenimiento',
      component:TipoTrabajadorComponent,
    },
    {
      path: 'co_cuentabancariamantenimiento',
      component:CuentaBancariaComponent,
    },

    {
      path: 'co_cuentabancomantenimiento',
      component:MaestroBancoListadoComponent,
    },

    {
      path: 'co_empleadomastmantenimiento',
      component:EmpleadosComponent,
    },
    {
      path: 'co_medicomantenimiento',
      component:MedicoComponent,
    },
    {
      path: 'co_tipopacientemantenimiento',
      component:TipoPacienteComponent,
    },
    {
      path: 'co_aseguradoramantenimiento',
      component:AseguradoraComponent,
    },
    {
      path: 'co_muestramantenimiento',
      component:MuestraComponent,
    },
    {
      path: 'co_sedemantenimiento',
      component:SedesComponent,
    },
    {
      path: 'co_insumomantenimiento',
      component:InsumoComponent,
    },
    {
      path: 'co_examenpatologicomantenimiento',
      component:ExamenPatologicoComponent,
    },
    {
      path: 'co_aprobadoresmantenimiento',
      component:AprobadoresComponent,
    },
    {
      path: 'co_cambiocomercialmantenimiento',
      component:CambioComercialComponent,
    },
    {
      path: 'co_tipopagomantenimiento',
      component:TipoPagoComponent,
    },
    {
      path: 'co_parametrosmantenimiento',
      component:ParametrosComponent,
    },
    {
      path: 'co_bancomantenimiento',
      component:MaestroBancoListadoComponent,
    },
    

    

  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaestrosRoutingModule { }

export const routedComponents = [
  FormMaestroComponent,
  FormMaestroMantenimientoComponent,
  ModeloServicioMantenimientoComponent,
  ConfiguracionContratosMantenimientoComponent,
  //PersonaComponent,
  PersonamastComponent,
  AutorizacionesComponent,
  AutorizacionesMantenimientoComponent,
  ExamenComponent,
  ListaBaseComponent,
  ListaBaseMantenimientoComponent,
  ExamenListaComponent,
  ExamenListaMantenimientoComponent,
  MaestroDetalleComponent,
  MaestroDetalleMantenimientoComponent,
  TipoCambioComponent,
  TipoCambioMantenimientoComponent,
  TipoTrabajadorComponent,
  TipoTrabajadorMantenimientoComponent,
  CuentaBancariaComponent,
  CuentaBancariaMantenimientoComponent,  
  MedicoComponent,
  ParametrosComponent,
  ParametrosMantenimientoComponent,
  TipoPagoComponent,
  TipoPagoMantenimientoComponent,
  TipoPacienteMantenimientoComponent,
  TipoPacienteComponent,
  AseguradoraComponent,
  EmpleadosComponent,
  MuestrasMantenimientoComponent,
  MuestraComponent,
  SedesMantenimientoComponent,
  SedesComponent,
  CambioComercialComponent,
  CambioComercialMantenimientoComponent,
  AprobadoresComponent,
  AprobadoresMantenimientoComponent,
  ExamenPatologicoComponent,
  ExamenPatologicoMantenimientoComponent,
  EmpleadosComponent,
  EmpleadosMantenimientoComponent,
  InsumoComponent,
  InsumoMantenimientoComponent,
  CuentaBancariaBuscarComponent,
  AprobadoresBuscarComponent,
  MaestroBancoListadoComponent,
  MaestroBancoMantenimientoComponent
  
  
];