import { Component, OnInit, ViewChild } from '@angular/core';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { MessageService, ConfirmationService, SelectItem, TreeNode, LazyLoadEvent } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { HeaderTituloComponent } from '../../../../@theme/components/header.titulo/header-titulo.component';
import { Maestro } from '../../FormMaestro/model/maestro';
import { ModeloServicioMantenimientoComponent } from '../components/modelo-servicio-mantenimiento.component';

@Component({
  selector: 'ngx-modelo-servicio',
  templateUrl: './modelo-servicio.component.html'
})
export class ModeloServicioComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  @ViewChild(ModeloServicioMantenimientoComponent, { static: false }) modeloServicioMantenimientoComponent: ModeloServicioMantenimientoComponent;

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
    this.modeloServicioMantenimientoComponent.iniciarComponente("NUEVO",this.objetoTitulo.menuSeguridad.titulo)
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
    this.modeloServicioMantenimientoComponent.iniciarComponente("VER",this.objetoTitulo.menuSeguridad.titulo)
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
    this.modeloServicioMantenimientoComponent.iniciarComponente("EDITAR",this.objetoTitulo.menuSeguridad.titulo)
  }

}
