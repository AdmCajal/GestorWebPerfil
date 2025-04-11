import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { Table } from 'primeng/table';
import { UsuarioAuth } from '../../../auth/model/usuario';

@Component({
  selector: 'ngx-asignaciones-view',
  templateUrl: './asignaciones-view.component.html'
})
export class AsignacionesViewComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: Maestro[]=[];
  bloquearPag: boolean;

  constructor(
    private toastrService: NbToastrService) 
     {
      super();
     }

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
