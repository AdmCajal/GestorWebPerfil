import { Component, OnInit } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';

@Component({
  selector: 'ngx-generar-comprobante',
  templateUrl: './generar-comprobante.component.html',
  styleUrls: ['./generar-comprobante.component.scss']
})
export class GenerarComprobanteComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  tipocambio:number=4.00
  igv:0.18
  
  constructor() {
    super();
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
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

  ngOnInit(): void {
  }

}
