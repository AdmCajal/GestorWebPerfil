import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../FormMaestro/model/maestro';
import { AutorizacionesMantenimientoComponent } from '../view/components/autorizaciones-mantenimiento.component';

@Component({
  selector: 'ngx-autorizaciones',
  templateUrl: './autorizaciones.component.html',
  styleUrls: ['./autorizaciones.component.scss']
})
export class AutorizacionesComponent extends ComponenteBasePrincipal implements OnInit,UIMantenimientoController {


  @ViewChild(AutorizacionesMantenimientoComponent, { static: false }) autorizacionesMantenimientoComponent: AutorizacionesMantenimientoComponent;
  dto: Maestro[] = [];
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private toastrService: NbToastrService) {
    super();
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreNuevo(): void {
    this.autorizacionesMantenimientoComponent.iniciarComponente("NUEVO", this.objetoTitulo.menuSeguridad.titulo)
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

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    let dw = new Maestro()
    dw.CodigoTabla = "01"
    dw.Descripcion = "PRUEBA DESCRI"
    dw.Nombre = "NOMBRE DETALLE"
    dw.Estado = 2
    this.dto.push(dw)

  }

  coreVer(dto) {
    this.autorizacionesMantenimientoComponent.iniciarComponente("VER", this.objetoTitulo.menuSeguridad.titulo)
  }
  coreEditar(dto) {
    this.autorizacionesMantenimientoComponent.iniciarComponente("EDITAR", this.objetoTitulo.menuSeguridad.titulo)
  }

}
