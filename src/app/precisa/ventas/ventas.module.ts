import { NgModule } from '@angular/core';
import { NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { TreeModule } from 'primeng/tree';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { ComunModule } from '../framework-comun/Comun.module';
import {BlockUIModule} from 'primeng/blockui';
import { ServicioComunService } from '../framework-comun/servicioComun.service';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { CardModule } from 'primeng/card';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../../environments/environment';
import { localStorageSync } from 'ngrx-store-localstorage';
import { PickListModule } from 'primeng/picklist';
import { appReducers } from '../maestros/app.reducer';
import {ProgressBarModule} from 'primeng/progressbar';
import { routedComponents, VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas.component';
import { ReservaMantenimientoComponent } from './Reserva/reserva-mantenimiento/reserva-mantenimiento.component';
import { ContratoMantenimientoComponent } from './Contrato/contrato-mantenimiento/contrato-mantenimiento.component';
import { ControlMantenimientoComponent } from './Control/control-mantenimiento/control-mantenimiento.component';
import { InteresMantenimientoComponent } from './Interes/interes-mantenimiento/interes-mantenimiento.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ControlPagarComponent } from './Control/control-pagar/control-pagar.component';
import { ReservaPagarComponent } from './Reserva/reserva-pagar/reserva-pagar.component';
import { ReservaImprimirComponent } from './Reserva/reserva-imprimir/reserva-imprimir.component';
import { BuscarReservaComponent } from './Reserva/buscar-reserva/buscar-reserva.component';
import { LetrasImprimirComponent } from './Contrato/letras-imprimir/letras-imprimir.component';
import { InteresControlComponent } from './Interes/interes-control/interes-control.component';
import { InteresPagarComponent } from './Interes/interes-pagar/interes-pagar.component';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { ControlDividirCuotaComponent } from './Control/control-dividir-cuota/control-dividir-cuota.component';
import { ControlDividirLetraComponent } from './Control/control-dividir-letra/control-dividir-letra.component';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['ventas'], rehydrate: true })(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  imports: [
    ScrollPanelModule,
    ProgressBarModule,
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
    CardModule,
    OverlayPanelModule,
    NbCheckboxModule,
    ComunModule,
    VentasRoutingModule,
    StoreModule.forRoot(appReducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  declarations: [
    VentasComponent,
    ...routedComponents,
    ReservaMantenimientoComponent,
    ContratoMantenimientoComponent,
    ControlMantenimientoComponent,
    InteresMantenimientoComponent,
    ControlPagarComponent,
    ReservaPagarComponent,
    ReservaImprimirComponent,
    BuscarReservaComponent,
    LetrasImprimirComponent,
    InteresControlComponent,
    InteresPagarComponent,
    ControlDividirCuotaComponent,
    ControlDividirLetraComponent
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService, ConfirmationService   , ServicioComunService
  ],
  exports:[
    ControlMantenimientoComponent,
    InteresPagarComponent,
    ControlPagarComponent
  ]

 
})
export class VentasModule { }
