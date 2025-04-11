import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../FormMaestro/model/maestro';
import { AprobadoresBuscarComponent } from '../components/aprobadores-buscar.component';
import { AprobadoresMantenimientoComponent } from '../components/aprobadores-mantenimiento.component';

@Component({
  selector: 'ngx-aprobadores',
  templateUrl: './aprobadores.component.html',
  styleUrls: ['./aprobadores.component.scss']
})
export class AprobadoresComponent extends ComponenteBasePrincipal   implements OnInit,UIMantenimientoController {


  @ViewChild(AprobadoresMantenimientoComponent, { static: false }) aprobadoresMantenimientoComponent: AprobadoresMantenimientoComponent;
  @ViewChild(AprobadoresBuscarComponent, { static: false }) aprobadoresbuscarComponent: AprobadoresBuscarComponent;

  tipocambio:number=4.00
  igv:0.18
  
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
    this.aprobadoresMantenimientoComponent.iniciarComponente("NUEVO",this.objetoTitulo.menuSeguridad.titulo)
  }

  verSelectorUsuario(): void {
    this.aprobadoresbuscarComponent.iniciarComponente("BUSCADOR USUARIO", this.objetoTitulo.menuSeguridad.titulo)
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
    console.log(this.objetoTitulo)
    this.aprobadoresMantenimientoComponent.iniciarComponente("VER",this.objetoTitulo.menuSeguridad.titulo)
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
    this.aprobadoresMantenimientoComponent.iniciarComponente("EDITAR",this.objetoTitulo.menuSeguridad.titulo)
  }
}
