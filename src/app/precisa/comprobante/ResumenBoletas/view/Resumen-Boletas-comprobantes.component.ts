import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';

@Component({
  selector: 'ngx-resumen-boletas-comprobantes',
  templateUrl: './resumen-boletas-comprobantes.component.html',
  styleUrls: ['./resumen-boletas-comprobantes.component.scss']
})
export class ResumenBoletasComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

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
    
  }
  coreNuevo(): void {
    
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
 
  

}
