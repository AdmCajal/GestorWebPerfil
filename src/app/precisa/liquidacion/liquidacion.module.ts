import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TreeModule } from 'primeng/tree';
import { ThemeModule } from '../../@theme/theme.module';
import { liquidacionRoutingModule, routedComponents } from './liquidacion-routing.routes';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from '../maestros/asignar-servicio/service/asignar-servicio.service';
import { MaestroService } from '../maestros/FormMaestro/service/maestro.service';
import {TabViewModule} from 'primeng/tabview';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {SplitterModule} from 'primeng/splitter';
import { CardModule } from 'primeng/card';
import {BlockUIModule} from 'primeng/blockui';
import {SplitButtonModule} from 'primeng/splitbutton';
@NgModule({
  declarations: [
    //CorrelativosMantenimientoComponent,
    ...routedComponents

  ],

  imports: [
    SplitButtonModule,
    BlockUIModule,
    CardModule,
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
    liquidacionRoutingModule,
    TabViewModule,
    ScrollPanelModule,
    SplitterModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService, ConfirmationService, ProductService, MaestroService]
})
export class LiquidacionModule { }
