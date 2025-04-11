import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';

import { BlockUIModule } from 'primeng/blockui';
import { CalendarModule } from 'primeng/calendar';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { SplitButtonModule } from 'primeng/splitbutton';

import { MensajeriaRoutingModule } from './mensajeria-routing.module';
import { MensajeriaComponent } from './mensajeria.component';
import { localStorageSync } from 'ngrx-store-localstorage';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { appReducers } from '../maestros/app.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../../environments/environment';
import { ServicioComunService } from '../framework-comun/servicioComun.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PickListModule } from 'primeng/picklist';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormatoMensajeComponent } from './formato-mensaje/components/formato-mensaje.component';
import { ProgramarMensajeComponent } from './programar-mensaje/view/programar-mensaje.component';
import { ProgramaMantenimientoComponent } from './programar-mensaje/component/programa-mantenimiento/programa-mantenimiento.component';
import { MensajeComponent } from './formato-mensaje/view/mensaje.component';
import { ComunModule } from "../framework-comun/Comun.module";
import { VistaPreviaMensajeComponent } from './programar-mensaje/component/vista-previa-mensaje/vista-previa-mensaje.component';
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['proyecto'], rehydrate: true })(reducer);
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];


@NgModule({
    declarations: [
        MensajeriaComponent,
        MensajeComponent,
        FormatoMensajeComponent,
        ProgramarMensajeComponent,
        ProgramaMantenimientoComponent,
        VistaPreviaMensajeComponent
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        MessageService, ConfirmationService, ServicioComunService
    ],
    imports: [
        CommonModule,
        FieldsetModule,
        BlockUIModule,
        InputSwitchModule,
        RadioButtonModule,
        InputTextareaModule,
        CalendarModule,
        ToastModule,
        ConfirmDialogModule,
        PickListModule,
        DropdownModule,
        NbCardModule,
        ThemeModule,
        TableModule,
        HttpClientModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        DividerModule,
        InputNumberModule,
        CardModule,
        GalleriaModule,
        SplitButtonModule,
        MensajeriaRoutingModule,
        StoreModule.forRoot(appReducers, { metaReducers }),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production, // Restrict extension to log-only mode
        }),
        ComunModule
    ]
})
export class MensajeriaModule { }
