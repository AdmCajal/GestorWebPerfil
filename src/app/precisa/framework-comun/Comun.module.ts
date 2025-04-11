import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AseguradoraMantenimientoComponent } from './Aseguradora/vista/aseguradora-mantenimiento.component';
import { MedicoMantenimientoComponent } from './Medico/vista/medico-mantenimiento.component';
import { PersonaMantenimientoComponent } from './Persona/vista/persona-mantenimiento.component';

import { PickListModule } from 'primeng/picklist';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbTooltipModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { TreeModule } from 'primeng/tree';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CardModule } from 'primeng/card';
import { PersonaBuscarComponent } from './Persona/components/persona-buscar.component';
import { AseguradoraBuscarComponent } from './Aseguradora/components/aseguradora-buscar.component';
import { MedicoBuscarComponent } from './Medico/components/medico-buscar.component';
import { ExamenBuscarComponent } from './Examen/components/examen-buscar.component';
import { ExamenMantenimientoComponent } from './Examen/vista/examen-mantenimiento.component';
import { ClienteRucBuscarComponent } from './ClienteRuc/view/clienteRuc-buscar.component';
import { PersonaPasswordResetComponent } from './Persona/components/persona-password-reset.component';
import { EmpresaBuscarComponent } from './Empresa/view/empresa-buscar.component';
import { ReporteVistaComponent } from './Reportes/view/reporte-vista.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from '../maestros/asignar-servicio/service/asignar-servicio.service';
import { MaestroService } from '../maestros/FormMaestro/service/maestro.service';
import { ServicioComunService } from './servicioComun.service';
import { ExamenAsignarMuestraComponent } from './Examen/components/examen-asignar-muestra.component';
import { ExamenAsignarHomologacionComponent } from './Examen/components/examen-asignar-homologacion.component';
import { ExamenPerfilComponent } from './Examen/components/examen-perfil.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { BlockUIModule } from 'primeng/blockui';
import { CajaPagoComponent } from './Cajapago/vista/cajapago.component';



@NgModule({
  declarations: [
    AseguradoraMantenimientoComponent,
    AseguradoraBuscarComponent,
    MedicoMantenimientoComponent,
    MedicoBuscarComponent,
    PersonaMantenimientoComponent,
    CajaPagoComponent,
    PersonaBuscarComponent,
    EmpresaBuscarComponent,
    PersonaPasswordResetComponent,
    ExamenMantenimientoComponent,
    ExamenAsignarMuestraComponent,
    ExamenAsignarHomologacionComponent,
    ExamenPerfilComponent,
    ExamenBuscarComponent,
    ClienteRucBuscarComponent,
    ReporteVistaComponent
  ],
  imports: [
    BlockUIModule,
    CommonModule,
    PickListModule,
    DividerModule,
    InputNumberModule,
    CalendarModule,
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
    PdfJsViewerModule
  ],
  exports: [
    AseguradoraMantenimientoComponent,
    AseguradoraBuscarComponent,
    MedicoMantenimientoComponent,
    MedicoBuscarComponent,
    PersonaMantenimientoComponent,
    PersonaPasswordResetComponent,
    PersonaBuscarComponent,
    ExamenMantenimientoComponent,
    ExamenAsignarMuestraComponent,
    ExamenAsignarHomologacionComponent,
    ExamenPerfilComponent,
    ExamenBuscarComponent,
    EmpresaBuscarComponent,
    ClienteRucBuscarComponent,
    ReporteVistaComponent,
    CajaPagoComponent
  ],

  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService, ConfirmationService, ProductService, MaestroService, ServicioComunService

  ]

})
export class ComunModule { }
