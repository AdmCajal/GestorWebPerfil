import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { ComprobanteParticularBuscarComponent } from '../components/comprobante-particular-buscar.component';

@Component({
  selector: 'ngx-comprobante-particular',
  templateUrl: './comprobante-particular.component.html',
  styleUrls: ['./comprobante-particular.component.scss']
})
export class ComprobanteParticularComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(ComprobanteParticularBuscarComponent, { static: false }) comprobanteParticularBuscarComponent: ComprobanteParticularBuscarComponent;
  
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
    this.comprobanteParticularBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
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

}
