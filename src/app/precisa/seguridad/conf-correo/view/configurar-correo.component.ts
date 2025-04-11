import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { ConfigurarCorreoMantenimientoComponent } from '../components/configurar-correo-mantenimiento.component';

@Component({
  selector: 'ngx-configurar-correo',
  templateUrl: './configurar-correo.component.html',
  styleUrls: ['./configurar-correo.component.scss']
})
export class ConfigurarCorreoComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController{
  @ViewChild(ConfigurarCorreoMantenimientoComponent, { static: false }) configurarCorreoMantenimientoComponent: ConfigurarCorreoMantenimientoComponent;
  
  lstCorreosConfig:any[]=[]
  estados:SelectItem[]=[]
  companias:SelectItem[]=[]
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
    this.configurarCorreoMantenimientoComponent.iniciarComponente("NUEVO",this.objetoTitulo.menuSeguridad.titulo)
  
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
   
    this.configurarCorreoMantenimientoComponent.iniciarComponente("VER",this.objetoTitulo.menuSeguridad.titulo)
  }
  coreEditar(dto){
    this.configurarCorreoMantenimientoComponent.iniciarComponente("EDITAR",this.objetoTitulo.menuSeguridad.titulo)
  }
  
  
  ngOnInit(): void {    
    this.cargarFuncionesInciales()

    this.iniciarComponent()
    let dw = new Maestro()
    dw.CodigoTabla="01"
    dw.Descripcion="PRUEBA DESCRI"
    dw.Nombre="NOMBRE DETALLE"
    dw.Estado=2
    this.dto.push(dw)
  }

  cargarFuncionesInciales(){
    this.tituloListadoAsignar(1,this)
    this.cargarCompanias()
    this.cargarEstados()
  }

  cargarCompanias(){
    this.companias=[
      {label:'-- Seleccionar compañia --',value:null},
      {label:'Analisis Clinico  ML',value:1},
      {label:'BIO PAD SERVICE SAC',value:2}
    ]
  }

  cargarEstados(){
    this.estados=[
      {label:'-- Seleccionar estado --',value:null},
      {label:'Inactivo',value:1},
      {label:'Activo',value:2}
    ]
  }
}
