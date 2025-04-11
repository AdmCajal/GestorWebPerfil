import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { Table } from 'primeng/table';
import { UsuarioAuth } from '../../../auth/model/usuario';

@Component({
  selector: 'ngx-control-view',
  templateUrl: './control-view.component.html'
})
export class ControlViewComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: Maestro[]=[];
  bloquearPag: boolean;

  ngOnInit(): void {
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
  coreVer(dto){
    throw new Error('Method not implemented.');  }
}
