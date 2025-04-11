import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { SelectItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { AppSatate } from '../../app.reducer';
import * as actions from '../../perfi-usuarios/store/actions'

@Component({
  selector: 'ngx-asignar-perfil',
  templateUrl: './asignar-perfil.component.html',
  styleUrls: ['./asignar-perfil.component.scss']
})
export class AsignarPerfilComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  asignarPerfil:any[]=[]
  filtrosAsignarPerfil:any
  perfiles:SelectItem[]=[]
  perfilesAsignar:SelectItem[]=[]


  constructor(private store:Store<AppSatate>) {
    super();
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreNuevo(): void {
   
  }
  coreBuscar(): void {

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

  ngOnInit(): void {
    this.cargarFuncionesIniciales()
    let perfil ={tipousuario:1,Perfil:'datito',VaEstado:'A'}
    this.asignarPerfil.push(perfil)
  }

  cargarFuncionesIniciales() {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    this.store.dispatch(actions.cargarLista())
    this.cargarPerfiles()
  }

  cargarPerfiles(){
    this.store.select('perfil').subscribe(perfiles=>{
      const items = [...perfiles.perfiles];
      this.perfiles=[]
      this.perfiles.push({ label: 'Seleccionar Perfil', value: null })
      items.forEach(perfil => {
        this.perfiles.push({ label: perfil.Perfil, value: perfil.Perfil })
        this.perfilesAsignar.push({ label: perfil.Perfil, value: perfil.Perfil })
      });
    })
  }
}
