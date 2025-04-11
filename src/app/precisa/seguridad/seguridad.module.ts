import { ProyectoModule } from './../proyecto/proyecto.module';
import { NgModule } from '@angular/core';
import {  NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { PefilUsuariosRoutingModule, routedComponents } from './seguridad-routing.routes';
import {TableModule} from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService, TreeDragDropService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { PerfilUserService } from './perfi-usuarios/service/produce.service';
import {DropdownModule} from 'primeng/dropdown';
import {FieldsetModule} from 'primeng/fieldset';
import {TreeModule} from 'primeng/tree';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
//ngrx
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../../environments/environment';
import { appReducers } from './app.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import { EffectsModule } from '@ngrx/effects';
import { EffectsArray } from './perfi-usuarios/store/effects';
import { BlockUIModule } from 'primeng/blockui';
import { CompaniamastMantenimientoComponent } from './companias/view/components/companiamast-mantenimiento.component';
import { CardModule } from 'primeng/card';
import { ComunModule } from '../framework-comun/Comun.module';
import {SplitButtonModule} from 'primeng/splitbutton';




export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['perfil'], rehydrate: true})(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];


@NgModule({
  imports: [
    ProyectoModule,
    SplitButtonModule,
    BlockUIModule,
    DividerModule,
    InputNumberModule,
    CalendarModule,
    CommonModule,
    PefilUsuariosRoutingModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbCheckboxModule,
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
    CardModule,
    ComunModule,
    OverlayPanelModule,
    StoreModule.forRoot(appReducers,{metaReducers}),
    EffectsModule.forRoot(EffectsArray),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  declarations: [
    ...routedComponents,
    CompaniamastMantenimientoComponent
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    PerfilUserService, MessageService, ConfirmationService,TreeDragDropService ]

})
export class SeguridadModule { }
