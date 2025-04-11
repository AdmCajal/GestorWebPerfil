import { Component, OnInit } from '@angular/core';

import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { MessageService, ConfirmationService, SelectItem, TreeNode, LazyLoadEvent } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../FormMaestro/model/maestro';
@Component({
  selector: 'ngx-tipo-admision',
  templateUrl: './tipo-admision.component.html',
  styleUrls: ['./tipo-admision.component.scss']
})
export class TipoAdmisionComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  TipoAdmisionComponent: any;

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
  coreNuevo(): void {
    this.openNew();
  }
  openNew() {
    this.TipoAdmisionComponent.iniciarComponente('NUEVO')
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
    // this.iniciarComponent()
    // let dw = new Maestro()
    // dw.CodigoTabla="01"
    // dw.Descripcion="PRUEBA DESCRI"
    // dw.Nombre="NOMBRE DETALLE"
    // dw.Estado=2
    // this.dto.push(dw)
  }

}
