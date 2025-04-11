import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { MuestrasMantenimientoComponent } from './components/muestra-mantenimiento.component';

@Component({
  selector: 'ngx-muestra',
  templateUrl: './muestra.component.html',
  styleUrls: ['./muestra.component.scss']
})
export class MuestraComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(MuestrasMantenimientoComponent, { static: false }) muestraMantenimientoComponent: MuestrasMantenimientoComponent;

  constructor() {super(); }
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
  }

  coreNuevo(): void {
    this.openNew();
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


  openNew() {
    this.muestraMantenimientoComponent.iniciarComponente('NUEVO',this.objetoTitulo.menuSeguridad.titulo)
  }
}
