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
import { routedComponents,AnalisisRoutingModule } from './analisis-routing.module';
import { AnalisisComponent } from './analisis.component';
import { EgresoMantenimientoComponent } from './Egreso/egreso-mantenimiento/egreso-mantenimiento.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { VentasModule } from '../ventas/ventas.module';
import { IngresoMantenimientoComponent } from './Ingreso/ingreso-mantenimiento/ingreso-mantenimiento.component';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['analisis'], rehydrate: true })(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];


@NgModule({
  imports: [
    VentasModule,
    InputSwitchModule,
    RadioButtonModule,
    BlockUIModule,
    SplitButtonModule,
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
    AnalisisRoutingModule,
    StoreModule.forRoot(appReducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  declarations: [
    EgresoMantenimientoComponent,
    IngresoMantenimientoComponent,
    AnalisisComponent,
    ...routedComponents,

  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService, ConfirmationService   , ServicioComunService
  ]
 
})
export class AnalisisModule { }
