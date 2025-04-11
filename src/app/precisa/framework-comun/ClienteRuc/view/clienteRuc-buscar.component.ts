import { Component, OnInit, ViewChild } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { LazyLoadEvent, Message, MessageService, SelectItem } from "primeng/api";
import { Table } from "primeng/table";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { FiltroCliente } from "../../../admision/consulta/dominio/filtro/FiltroConsultaAdmision";
import { ConsultaAdmisionService } from "../../../admision/consulta/servicio/consulta-admision.service";






@Component({
  selector: 'ngx-clienteruc-buscar',
  templateUrl: './clienteRuc-buscar.component.html'
})
export class ClienteRucBuscarComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  @ViewChild(Table, { static: false }) dataTableComponent: Table;

  mensajeController: MensajeController

  filtro: FiltroCliente = new FiltroCliente();

  listClienteRuc: any[] = [];
  registroSeleccionado: any;


  editarCampos: boolean = false;

  verdocumento: boolean = false;
  vernombre: boolean = true;
  acciones: string = ''
  position: string = 'top'
  dialog: boolean = false;
  titulo: string;

  constructor(
    private consultaAdmisionService: ConsultaAdmisionService,
    private toastrService: NbToastrService,
    protected messageService: MessageService,
  ) { super(); }

  coreBusquedaRapida(filtro: string): void {
    throw new Error("Method not implemented.");
  }
  coreFiltro(flag: boolean): void {
    throw new Error("Method not implemented.");
  }
  coreAccion(accion: string): void {
    throw new Error("Method not implemented.");
  }




  ngOnInit(): void {
    this.dialog = false;
    this.titulo = '';

  }


  coreNuevo(): void {
    throw new Error("Method not implemented.");
  }
  coreBuscar(): void {
    this.dataTableComponent.first = 0;
    this.grillaCargarDatos({ first: this.dataTableComponent.first });
  }

  coreGuardar(): void {
    throw new Error("Method not implemented.");
  }
  coreMensaje(mensage: MensajeController): void {

  }
  coreExportar(tipo: string): void {
    throw new Error("Method not implemented.");
  }

  coreSalir() {
    // this.mensajeController.componenteDestino.desbloquearPagina();
    this.dialog = false;
  };

  coreSeleccionar(dto: any) {
    if (dto === null) {
      this.mostrarMensajeInfo('Debe seleccionar un registro');
      return;
    } else {
      this.mensajeController.resultado = dto;
      this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
      this.coreSalir();
      this.limpiarBuscador();
    }
  }

  mostrarMensajeInfo(mensaje: string): void {
    this.mostrarMensaje(mensaje, 'info');
  }

  mostrarMensaje(mensaje: string, tipo: string): void {
    this.messageService.clear();
    this.messageService.add({ severity: tipo, summary: 'Mensaje', detail: mensaje });
  }


  grillaCargarDatos(event: LazyLoadEvent) {
    this.filtro.UneuNegocioId = 1;
    this.filtro.TipEstado = 1;
    this.filtro.TIPOADMISIONID = 2;

    this.consultaAdmisionService.listarcombocliente(this.filtro).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.numeroClienteRuc = contado++;
      });

      this.listClienteRuc = res;
      console.log("data listado:", res);

    });

  }

  iniciarComponente(accion: string, titulo) {

    // this.dialog = true;
    // this.filtro = new FiltroPersona();
    // if (accion == "NUEVO") {
    this.cargarAcciones(accion, titulo)
    this.coreIniciarComponente
    console.log("entra?:");

    // else{
    //   this.cargarAcciones(accion,titulo)
    // }
  }
  coreIniciarComponente(msj: MensajeController, accionform: string) {
    this.mensajeController = msj;
    this.dialog = true;
    this.limpiarBuscador();
    this.titulo = 'CLIENTE';
    this.acciones = `${this.titulo}: ${accionform}`;
    this.filtro = new FiltroCliente();


  }

  esRUCValido(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
    if (!regex.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }

  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      this.coreBuscar();
    }
  }

  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;

    this.dialog = true;
    this.puedeEditar = false;

  }

  limpiarBuscador() {
    this.listClienteRuc = [];
    this.filtro = null;
  }

}


