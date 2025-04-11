import { Component, OnInit, ViewChild } from '@angular/core';
import { PendienteAprobacionDetalleComponent } from './components/pendiente-aprobacion-detalle.component';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { PendienteAprobacionBuscarComponent } from '../components/pendiente-aprobacion-buscar.component';
import { MensajeController } from '../../../../../util/MensajeController';

@Component({
  selector: 'ngx-pendiente-aprobacion',
  templateUrl: './pendiente-aprobacion.component.html',
  styleUrls: ['./pendiente-aprobacion.component.scss']
})
export class PendienteAprobacionComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(PendienteAprobacionBuscarComponent, { static: false }) pendienteAprobacionBuscarComponent: PendienteAprobacionBuscarComponent;
  @ViewChild(PendienteAprobacionDetalleComponent, { static: false }) detalleComponent: PendienteAprobacionDetalleComponent;

  dto:Maestro[]=[]
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private toastrService: NbToastrService) {
    super();
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }
  
  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    let dw = new Maestro()
    dw.CodigoTabla="01"
    dw.Descripcion="PRUEBA DESCRI"
    dw.Nombre="NOMBRE DETALLE"
    dw.Estado=2
    this.dto.push(dw)
  }

  coreDetalle(): void {
    this.openDetalle();
    console.log("::Click modal:::");
  }

  openDetalle() {
   this.detalleComponent.iniciarComponente('DETALLE')
  }

  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }
  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  verSelectorPacientes(): void {
    this.pendienteAprobacionBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
 }

}
