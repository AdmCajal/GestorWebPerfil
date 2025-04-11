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
import {CarouselModule} from 'primeng/carousel';
import { ProyectoRoutingModule, routedComponents } from './proyecto-routing.module';
import { ProyectoComponent } from './proyecto.component';
import { LotesUnirComponent } from './Lotes/lotes-unir/lotes-unir.component';
import { LotesDividirComponent } from './Lotes/lotes-dividir/lotes-dividir.component';
import {SplitButtonModule} from 'primeng/splitbutton';
import { LotesImagenComponent } from './Lotes/lotes-imagen/lotes-imagen.component';
import {GalleriaModule} from 'primeng/galleria';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['proyecto'], rehydrate: true })(reducer);
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  imports: [
    GalleriaModule,
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
    NbCheckboxModule,
    ComunModule,
    CarouselModule,
    ProyectoRoutingModule,
    StoreModule.forRoot(appReducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  declarations: [
    ProyectoComponent,
    ...routedComponents,
    LotesUnirComponent,
    LotesDividirComponent,
    LotesImagenComponent,

  ],
  exports:[
    LotesImagenComponent
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService, ConfirmationService   , ServicioComunService
  ]

})
export class ProyectoModule { }
