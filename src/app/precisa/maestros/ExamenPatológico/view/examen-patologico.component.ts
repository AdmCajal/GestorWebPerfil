import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../FormMaestro/model/maestro';
import { ExamenPatologicoMantenimientoComponent } from '../components/examen-patologico-mantenimiento.component';

@Component({
  selector: 'ngx-examen-patologico',
  templateUrl: './examen-patologico.component.html',
  styleUrls: ['./examen-patologico.component.scss']
})
export class ExamenPatologicoComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController {

  @ViewChild(ExamenPatologicoMantenimientoComponent, { static: false }) examenPatologicoMantenimientoComponent: ExamenPatologicoMantenimientoComponent;

  dto: Maestro[] = []

  constructor(
    private messageService: MessageService,
    private toastrService: NbToastrService) {
    super();

  }

  ngOnDestroy(): void {
    // this.userInactive.unsubscribe();
  }

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    let dw = new Maestro()
    dw.CodigoTabla = "01"
    dw.Descripcion = "PRUEBA DESCRI"
    dw.Nombre = "NOMBRE DETALLE"
    dw.Estado = 2
    this.dto.push(dw)

  }

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreNuevo(): void {
    this.examenPatologicoMantenimientoComponent.iniciarComponente("NUEVO", this.objetoTitulo.menuSeguridad.titulo)
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

  coreVer(dto) {
    console.log(this.objetoTitulo)
    this.examenPatologicoMantenimientoComponent.iniciarComponente("VER", this.objetoTitulo.menuSeguridad.titulo)
  }



  coreEditar(dto) {
    this.examenPatologicoMantenimientoComponent.iniciarComponente("EDITAR", this.objetoTitulo.menuSeguridad.titulo)
  }
}
