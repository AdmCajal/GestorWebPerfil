import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../util/UIMantenimientoController';
import { Maestro } from '../FormMaestro/model/maestro';
import { CambioComercialMantenimientoComponent } from './components/cambio-comercial-mantenimiento.component';

@Component({
  selector: 'ngx-cambio-comercial',
  templateUrl: './cambio-comercial.component.html',
  styleUrls: ['./cambio-comercial.component.scss']
})
export class CambioComercialComponent extends ComponenteBasePrincipal implements OnInit,UIMantenimientoController {

  @ViewChild(CambioComercialMantenimientoComponent, { static: false }) cambioComercialMantenimientoComponent: CambioComercialMantenimientoComponent;
  dto: Maestro[]=[];
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
    this.cambioComercialMantenimientoComponent.iniciarComponente("NUEVO",this.objetoTitulo.menuSeguridad.titulo)
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


  coreVer(dto){
   
    this.cambioComercialMantenimientoComponent.iniciarComponente("VER",this.objetoTitulo.menuSeguridad.titulo)
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
  coreEditar(dto){
    this.cambioComercialMantenimientoComponent.iniciarComponente("EDITAR",this.objetoTitulo.menuSeguridad.titulo)
  }

}
