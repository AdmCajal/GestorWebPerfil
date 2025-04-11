import { Component, OnInit, ViewChild } from '@angular/core';

import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { MessageService, ConfirmationService, SelectItem, TreeNode, LazyLoadEvent } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../FormMaestro/model/maestro';
import { ConfiguracionContratosMantenimientoComponent } from '../components/configuracion-contratos-mantenimiento.component';
@Component({
  selector: 'ngx-configuracion-contratos',
  templateUrl: './configuracion-contratos.component.html',
  styleUrls: ['./configuracion-contratos.component.scss']
})
export class ConfiguracionContratosComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController{

  @ViewChild(ConfiguracionContratosMantenimientoComponent, { static: false }) configuracionContratosMantenimientoComponent: ConfiguracionContratosMantenimientoComponent;
  tipocambio:number=4.00
  igv:0.18
  
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
    this.configuracionContratosMantenimientoComponent.iniciarComponente("NUEVO",this.objetoTitulo.menuSeguridad.titulo)
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
   
    this.configuracionContratosMantenimientoComponent.iniciarComponente("VER",this.objetoTitulo.menuSeguridad.titulo)
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
    this.configuracionContratosMantenimientoComponent.iniciarComponente("EDITAR",this.objetoTitulo.menuSeguridad.titulo)
  }

}
