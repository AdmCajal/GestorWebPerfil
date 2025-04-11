import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { AtencionParticularesPagoComponent } from './components/atencion-particulares-pago.component';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { AtencionParticularesBuscarComponent } from '../components/atencion-particulares-buscar.component';
import { MensajeController } from '../../../../../util/MensajeController';

@Component({
  selector: 'ngx-atencion-particulares',
  templateUrl: './atencion-particulares.component.html',
  styleUrls: ['./atencion-particulares.component.scss']
})
export class AtencionParticularesComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController  {
  @ViewChild(AtencionParticularesBuscarComponent, { static: false }) atencionParticularesBuscarComponent: AtencionParticularesBuscarComponent;
  @ViewChild(AtencionParticularesPagoComponent, { static: false }) pagoComponent: AtencionParticularesPagoComponent;

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

  corePago(): void {
    this.openPago();
    console.log("::Click modal:::");
  }

  openPago() {
   this.pagoComponent.iniciarComponente('PAGO')
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
    this.atencionParticularesBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
 }



}
