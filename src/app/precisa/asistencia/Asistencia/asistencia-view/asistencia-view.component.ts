import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from "@nebular/theme";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { Table } from "primeng/table";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { MessageService } from 'primeng/api';
import { PersonaBuscarComponent } from '../../../framework-comun/Persona/components/persona-buscar.component';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { AsistenciaMantenimientoComponent } from '../asistencia-mantenimiento/asistencia-mantenimiento.component';
import { DtoAsistencia } from '../model/DtoAsistencia';
import { AsistenciaService } from '../service';
import { IAsistencia } from '../model/iasistencia';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { format } from 'date-fns';

@Component({
  selector: 'ngx-asistencia-view',
  templateUrl: './asistencia-view.component.html'
})

export class AsistenciaViewComponent extends ComponenteBasePrincipal implements OnInit, AfterContentInit, UIMantenimientoController {

  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(AsistenciaMantenimientoComponent, { static: false }) asistenciaMantenimientoComponent: AsistenciaMantenimientoComponent;

  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: DtoAsistencia[] = [];
  bloquearPag: boolean;
  editarrepresen: boolean = false;
  FiltroAsistencia: DtoAsistencia = new DtoAsistencia();
  fechaInicio: Date = new Date();
  fechaFin: Date = new Date();
  isSupervidor:boolean=true;
  constructor(private messageService: MessageService,
    private personaService: PersonaService,
    private toastrService: NbToastrService,
    private asistenciaService: AsistenciaService,
    private exportarService: ExportarService
  ) {
    super();
  }

  ngAfterContentInit(): void {
    this.iniciarComponent();
    this.validarSupervisor();
  }

  ngOnInit() {
    this.tituloListadoAsignar(1, this);
    this.FiltroAsistencia.documento = this.getUsuarioAuth().data[0].Documento.trim();
    this.FiltroAsistencia.nombrecompleto = this.getUsuarioAuth().data[0].NombreCompleto.trim();
    this.FiltroAsistencia.Empleado = this.getUsuarioAuth().data[0].Persona;
    this.puedeEditar=true;

  }

  verSelectorDocumento(tipo: string): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECCOMISIONISTA', 'BUSCAR'), 'BUSCAR ' + tipo, "E");
  
  }

  coreMensaje(mensage: MensajeController): void {
    console.log("entro company listado:", mensage.componente);
    if (mensage.componente == "SELECPACIENTE") {
      this.FiltroAsistencia.documento = mensage.resultado.Documento;
      this.FiltroAsistencia.nombrecompleto = mensage.resultado.NombreCompleto;
      this.FiltroAsistencia.Empleado = mensage.resultado.Persona;
    }
  }


  coreNuevo(): void {
    console.log("entro coreNuevo:");
    this.asistenciaMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_COMPANY', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }
  validarSupervisor(){
    const usuarioAsistencia = sessionStorage.getItem('access_UsuarioPerfil');
    const convertJson = JSON.parse(usuarioAsistencia);
    if(convertJson!= undefined ||convertJson!= null){
      if(convertJson[0].FlatSupervisor == 1){
        this.isSupervidor = false;
      }
      
    }else{
      this.isSupervidor = true;
    }
   
  }

  coreEditar(row) {
    console.log("entro coreNuevo:");
    //this.asistenciaMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_COMPANY', ''),"EDITAR", this.objetoTitulo.menuSeguridad.titulo,row);
  }

  coreVer(row) {
    console.log("entro coreNuevo:");
    this.asistenciaMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_COMPANY', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row);
  }

  async coreBuscar() {
    this.bloquearPag = true;
    console.log("coreBuscar FiltroAsistencia:", this.FiltroAsistencia);

    this.FiltroAsistencia.FechaCreacion = await this.fechaInicio;
    this.FiltroAsistencia.FechaMarcacion = await this.fechaFin;
    this.asistenciaService.listarAsistencia(this.FiltroAsistencia).then((res: DtoAsistencia[]) => {
      this.bloquearPag = false;
      var contado = 1;
      console.log("RESSSS", res);
      this.dto = res;
    });
  }

  exportExcel() {
    if (this.dto == null || this.dto == undefined || this.dto.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: IAsistencia[] = [];
      let contador: number = 0;
      let fechaCreacion: string;
      for ( let e of this.dto){
        contador += 1;
        let fechaInicio = new Date(e.FechaMarcacion);
        let dd = fechaInicio.getDate() <= 9 ? "0" + fechaInicio.getDate() : fechaInicio.getDate();
        let mm = fechaInicio.getMonth() == 0 ? "01" : fechaInicio.getMonth() <= 9 ? "0" + fechaInicio.getMonth() : fechaInicio.getMonth() + 1;
        let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar: IAsistencia = {
          NRO: contador,
          FECHA_DE_ASISTENCIA: fechaCreacion,
          DOCUMENTO: e.documento?.toUpperCase() || '',
          EMPLEADO: e.nombrecompleto?.toUpperCase() || '',
          TIPO_DE_ASISTENCIA: e.TipoMarcacion?.toUpperCase() || '',
          OBSERVACION: e.Comentarios?.toUpperCase() || '',
          HORA: this.obtenerHoraFormateada(new Date(e.FechaMarcacion)),
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      }
      this.exportarService.exportExcel(this.dto, listaExportar, "Asistencia");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });
    }
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

  limpiarDocumento() {
    this.FiltroAsistencia.documento = null;
    this.FiltroAsistencia.nombrecompleto = null;
    this.FiltroAsistencia.Empleado = null;
  }

  validarTeclaEnterRepresentante(evento) {

  }


  obtenerHoraFormateada(date: Date): string {
    const horaFormateada = format(date, 'hh:mm a');
    return horaFormateada;
  }
  
  // // Ejemplo de uso
  // const fechaActual = new Date();
  // const horaFormateada = obtenerHoraFormateada(fechaActual);
  // console.log(horaFormateada);

}
