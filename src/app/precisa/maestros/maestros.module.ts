import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ThemeModule } from '../../@theme/theme.module';
import { AsignarServicioComponent } from './asignar-servicio/view/asignar-servicio.component';
import { ConfiguracionContratosComponent } from './ConfiguracionContratos/view/configuracion-contratos.component';
import { MaestrosRoutingModule } from './maestos-routing.routes';
import { MaestrosComponent } from './maestros.component';
import { ModeloServicioComponent } from './ModeloServicio/view/modelo-servicio.component';
import { TipoAdmisionComponent } from './TipoAdmision/view/tipo-admision.component';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { AutorizacionesComponent } from './autorizaciones/view/autorizaciones.component';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToastModule } from 'primeng/toast';
import { TreeModule } from 'primeng/tree';
import { ExamenComponent } from './examen/view/examen.component';
import { ExamenListaComponent } from './exameneslista/view/examen-lista.component';
import { FormMaestroComponent } from './FormMaestro/view/form-maestro.component';
import { MaestroDetalleComponent } from './Detalle/view/maestro-detalle.component';
import { TipoCambioComponent } from './TipoCambio/view/tipo-cambio.component';
import { TipoTrabajadorComponent } from './TipoTrabajador/view/tipo-trabajador.component';
import { ListaBaseComponent } from './lista-base/view/lista-base.component';
import { CuentaBancariaComponent } from './CuentaBancaria/view/cuenta-bancaria.component';
import { EmpleadosComponent } from './Empleados/view/empleados.component';
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
import { PickListModule } from 'primeng/picklist';
import { ProductService } from './asignar-servicio/service/asignar-servicio.service';
import { MaestroService } from './FormMaestro/service/maestro.service';
import { CardModule } from 'primeng/card';
import { FormMaestroMantenimientoComponent } from './FormMaestro/view/components/form-maestro-mantenimiento.component';
//ngrx
import {SplitButtonModule} from 'primeng/splitbutton';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../../environments/environment';
import { appReducers } from './app.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import { AsignarExamenesComponent } from './asignar-examenes/asignar-examenes.component';
import { ModeloServicioMantenimientoComponent } from './ModeloServicio/components/modelo-servicio-mantenimiento.component';
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
import { ComunModule } from '../framework-comun/Comun.module';
import { BlockUIModule } from 'primeng/blockui';
import { PersonamastComponent } from './persona/vista/personamast.component';
import { NodeService } from './TipoTrabajador/Service/nodeservice';
import { MaestroBancoListadoComponent } from './maestroBanco/vista/maestro-banco-listado.component';
import { MaestroBancoMantenimientoComponent } from './maestroBanco/components/maestro-banco-mantenimiento.component';
import { MaestroBancoService } from './maestroBanco/servicio/maestro-banco.service';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {

  return localStorageSync({ keys: ['perfil'], rehydrate: true })(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];


@NgModule({
  imports: [
    SplitButtonModule,
    BlockUIModule,
    PickListModule,
    DividerModule,
    InputNumberModule,
    CalendarModule,
    CommonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    TableModule,
    HttpClientModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    NbTooltipModule,
    FieldsetModule,
    TreeModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    ToastModule,
    OverlayPanelModule,
    MaestrosRoutingModule,
    CardModule,
    OverlayPanelModule,
    NbCheckboxModule,
    ComunModule,
    StoreModule.forRoot(appReducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],

  declarations: [
    //PersonaComponent,
    AutorizacionesComponent,
    MaestrosComponent,
    AsignarServicioComponent,
    ConfiguracionContratosComponent,
    ModeloServicioComponent,
    TipoAdmisionComponent,
    ExamenComponent,
    ExamenListaComponent,
    FormMaestroComponent,
    MaestroDetalleComponent,
    TipoCambioComponent,
    TipoTrabajadorComponent,
    ListaBaseComponent,
    CuentaBancariaComponent,
    EmpleadosComponent,
    MedicoComponent,
    TipoPacienteComponent,
    AseguradoraComponent,
    MuestraComponent,
    SedesComponent,
    InsumoComponent,
    ExamenPatologicoComponent,
    AprobadoresComponent,
    CambioComercialComponent,
    TipoPagoComponent,
    ParametrosComponent,
    FormMaestroMantenimientoComponent,
    AsignarExamenesComponent,
    ModeloServicioMantenimientoComponent,
    ConfiguracionContratosMantenimientoComponent,
    AutorizacionesMantenimientoComponent,
    ListaBaseMantenimientoComponent,
    ExamenListaMantenimientoComponent,
    MaestroDetalleMantenimientoComponent,
    TipoCambioMantenimientoComponent,
    TipoTrabajadorMantenimientoComponent,
    CuentaBancariaMantenimientoComponent,
    ParametrosMantenimientoComponent,
    TipoPagoMantenimientoComponent,
    TipoPacienteMantenimientoComponent,
    MuestrasMantenimientoComponent,
    SedesMantenimientoComponent,
    CambioComercialMantenimientoComponent,
    AprobadoresMantenimientoComponent,
    ExamenPatologicoMantenimientoComponent,
    EmpleadosMantenimientoComponent,
    InsumoMantenimientoComponent,
    CuentaBancariaBuscarComponent,
    AprobadoresBuscarComponent,
    PersonamastComponent,
    MaestroBancoListadoComponent,
    MaestroBancoMantenimientoComponent

  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService, ConfirmationService, ProductService, MaestroService,
    MaestroBancoService,

    NodeService
  ]
})
export class MaestrosModule { }
