import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { TipoPacienteMantenimientoComponent } from './components/tipo-paciente-mantenimiento.component';

@Component({
  selector: 'ngx-tipo-paciente',
  templateUrl: './tipo-paciente.component.html',
  styleUrls: ['./tipo-paciente.component.scss']
})
export class TipoPacienteComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(TipoPacienteMantenimientoComponent, { static: false }) tipoPacienteMantenimientoomponent: TipoPacienteMantenimientoComponent;

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
    this.tipoPacienteMantenimientoomponent.iniciarComponente('NUEVO',this.objetoTitulo.menuSeguridad.titulo)
  }

 

}