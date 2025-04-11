import { Component, OnInit, ViewChild } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { LazyLoadEvent, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import Swal from "sweetalert2";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { FiltroPersona } from "../../../maestros/persona/dominio/filtro/FiltroPersona";
import { dtoPersona } from "../dominio/dto/dtoPersona";
import { PersonaService } from "../servicio/persona.service";
@Component({
  selector: 'ngx-persona-password-reset',
  templateUrl: './persona-password-reset.component.html'
})
export class PersonaPasswordResetComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  @ViewChild('myselect') myselect;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;

  mensajeController: MensajeController

  dto: dtoPersona = new dtoPersona();
  filtro: FiltroPersona = new FiltroPersona();
  lstPersona: any[] = [];

  esCliente: boolean = false;
  esProveedor: boolean = false;
  esEmpleado: boolean = false;
  esOtro: boolean = false;

  acciones: string = ''
  position: string = 'top'
  dialog: boolean = false;
  titulo: string;
  validarAccion: string;

  constructor(
    private personaService: PersonaService,
    protected messageService: MessageService,
    private toastrService: NbToastrService,
  ) { super(); }
  coreBuscar(): void {
    throw new Error("Method not implemented.");
  }
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






  mostrarMensajeInfo(mensaje: string): void {
    this.mostrarMensaje(mensaje, 'info');
  }

  mostrarMensaje(mensaje: string, tipo: string): void {
    this.messageService.clear();
    this.messageService.add({ severity: tipo, summary: 'Mensaje', detail: mensaje });
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
  coreIniciarComponente(msj: MensajeController) {

    this.mensajeController = msj;
    this.dialog = true;
  }

  coreIniciarComponentePassword(mensaje: MensajeController, accionform: string, dtoEditPersona?: any): void {
    this.mensajeController = mensaje;
    console.log("ENTRO NUEVO COMPONENTE", this.mensajeController);
    this.dialog = true;
    this.titulo = 'PERSONA';
    this.acciones = `${this.titulo}: ${accionform}`;
    this.validarAccion = accionform;
    if (accionform == "PASSWORD") {
      this.dto = dtoEditPersona;
      console.log("datos recibiendo", this.dto);
      this.grillaCargarDatos({ first: 0 });
    }

  }

  grillaCargarDatos(event: LazyLoadEvent) {

    let IdPersona = { IdPersona: this.dto.Persona }
    // this.filtro.Persona = this.dto.Persona;
    console.log("datos de la grilla persona", IdPersona)
    return this.personaService.listarUsuarioWeb(IdPersona).then((res) => {
      console.log("data listado:", res);
      this.lstPersona = res;
    });
  }


  guardarPersona(filtro: any) {

    if (this.validarAccion == "PASSWORD") {
      function generarpsd() {
        let result = '';
        const characters = '0123456789';
        
        for (let i = 0; i < 8; i++) {

          result += characters.charAt(Math.floor(Math.random() * 10));    //sorteo

        }
        return result;
      }
      this.dto.IdPersona = filtro.IdPersona;
      this.dto.TIPODOCUMENTO = filtro.TIPODOCUMENTO;
      this.dto.Documento = filtro.Documento;
      this.dto.PasswordWeb = generarpsd()
      this.dto.ClasificadorMovimiento = filtro.ClasificadorMovimiento;
      this.personaService.mantenimientoUsuarioWeb(2, this.dto, this.getUsuarioToken()).then(
        res => {
          if (res.success) {
            alert("Se ha cambiado su contraseña")
            this.grillaCargarDatos({ first: 0 });

          } else {
            alert("No Autorizado")
            this.dialog = false

          }
        }).catch(error => error)
    }
  }

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }

  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false;

  }




}


