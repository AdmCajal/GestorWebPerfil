import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { AdmisionRoutingModule, routedComponents } from './admision-routing.routes';
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
import { InputMaskModule } from 'primeng/inputmask';
import { ComunModule } from '../framework-comun/Comun.module';
import { ServicioComunService } from '../framework-comun/servicioComun.service';
import {BlockUIModule} from 'primeng/blockui';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { ConsultacomprobanteComponent } from './Comprobante/consultacomprobante/consultacomprobante.component';
import { ConsultaletrasvencidasComponent } from './Letras/consultaletrasvencidas/consultaletrasvencidas.component';
import { ConsultaletraspendientesComponent } from './Letras/consultaletraspendientes/consultaletraspendientes.component';
import { ConsultanotificacionesComponent } from './Notificaciones/consultanotificaciones/consultanotificaciones.component';
import { ConsultarequerimientoComponent } from './Requerimiento/consultarequerimiento/consultarequerimiento.component';
import { ConsultaingresoComponent } from './Ingreso/consultaingreso/consultaingreso.component';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { NotificacioDetalleComponent } from './Notificaciones/notificacio-detalle/notificacio-detalle.component';
import { RequerimientoDetalleComponent } from './Requerimiento/requerimiento-detalle/requerimiento-detalle.component';
import { AdmisionComponent } from './admision.component';


//import { NgxSoapModule, NgxSoapService } from 'ngx-soap';

@NgModule({
  imports: [
    ProgressBarModule,
    SplitButtonModule,
    BlockUIModule,
    DividerModule,
    InputNumberModule,
    CalendarModule,
    CommonModule,
    AdmisionRoutingModule,
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
    InputMaskModule,
    ComunModule,
    CardModule,
    PdfJsViewerModule
   // NgxSoapModule,

  ],
  declarations: [
    AdmisionComponent,
    ...routedComponents,
    ConsultacomprobanteComponent,
    ConsultaletrasvencidasComponent,
    ConsultaletraspendientesComponent,
    ConsultanotificacionesComponent,
    ConsultarequerimientoComponent,
    ConsultaingresoComponent,
    NotificacioDetalleComponent,
    RequerimientoDetalleComponent,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService, ConfirmationService
    , ServicioComunService
    // ,NgxSoapService
  ]
})
export class AdmisionModule { }
