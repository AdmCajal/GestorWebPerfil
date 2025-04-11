import { Component, OnInit, ViewChild } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { LazyLoadEvent, Message, MessageService, SelectItem } from "primeng/api";
import { Table } from "primeng/table";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { FiltroMedico } from "../../../maestros/Medico/dominio/filtro/Filtromedico";
import { MedicoService } from "../servicio/medico.service";




@Component({
  selector: 'ngx-medico-buscar',
  templateUrl: './medico-buscar.component.html'
})
export class MedicoBuscarComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  @ViewChild(Table, { static: false }) dataTableComponent: Table;

  mensajeController: MensajeController

  filtro: FiltroMedico = new FiltroMedico();

  lstTipoDocumento: SelectItem[] = [];
  lstMedico: any[] = [];


  editarCampos: boolean = false;

  verdocumento: boolean = false;
  vernombre: boolean = true;
  acciones: string = ''
  position: string = 'top'
  dialog: boolean = false;
  loading: boolean;
  // paginacion: DominioPaginacion = new DominioPaginacion();
  titulo: string;
  validarBusMed: FormGroup;
  validarBusMed2: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private medicoService: MedicoService,
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
    this.ValidarBusMedico();
  }

  esCMPValido(event) {
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

  ValidarBusMedico() {

    this.validarBusMed = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],

    })
    this.validarBusMed2 = this.formBuilder.group({
      cmp: ['', [Validators.required, Validators.minLength(3)]],

    })
  }

  get nombreField() {
    return this.validarBusMed.get('nombre');
  }
  get cmpField() {
    return this.validarBusMed2.get('cmp');
  }

  checknombre(hola: any) {
    this.vernombre = true;
    this.verdocumento = false;
    this.filtro.CMP = null;
    this.ValidarBusMedico();

  }
  checkdocumento(anyd: any) {
    this.vernombre = false;
    this.filtro.Nombres = null;
    this.verdocumento = true;
    this.ValidarBusMedico();
  }

  coreNuevo(): void {
    throw new Error("Method not implemented.");
  }
  coreBuscar(): void {
    if (this.validarBusMed.valid || this.validarBusMed2.valid) {
      this.dataTableComponent.first = 0;
      this.grillaCargarDatos({ first: this.dataTableComponent.first });
    } else {
      this.validarBusMed.markAllAsTouched();

    }
  }

  coreGuardar(): void {
    throw new Error("Method not implemented.");
  }

  coreMensaje(mensage: MensajeController): void {
    // if(mensage.componente == "TIPREGPERSONA") {
    //   console.log("data del seleccionar",mensage);
    //   this.filtro.Documento=mensage.resultado.Documento;
    //   this.filtro.NombreCompleto=mensage.resultado.NombreCompleto;
    //   this.filtro.FechaNacimiento=mensage.resultado.FechaNacimiento;

    // }
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
    }
    this.mensajeController.resultado = dto;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    this.coreSalir();
    this.limpiarBuscador();
  }




  mostrarMensajeInfo(mensaje: string): void {
    this.mostrarMensaje(mensaje, 'info');
  }

  mostrarMensaje(mensaje: string, tipo: string): void {
    this.messageService.clear();
    this.messageService.add({ severity: tipo, summary: 'Mensaje', detail: mensaje });
  }


  grillaCargarDatos(event: LazyLoadEvent) {
    this.loading = true;
    this.filtro.MedicoId = -1;
    this.filtro.Estado = 1;

    this.medicoService.listarpaginado(this.filtro).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.numeromedico = contado++;
        // if (this.estaVacio(element.Busqueda)) {
        //   element.Busqueda = res.Nombres;
        // } 
        // this.lstMedico.push(element);
        // element.NombreCompleto = element.ApellidoPaterno + " " + element.ApellidoMaterno + " " + element.Nombres
      });
      this.loading = false;
      this.lstMedico = res;
      console.log("data listado:", res);

    });

  }
  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      this.coreBuscar();
      // this.filtro.MedicoId = -1;
      // this.filtro.Estado = 1;
      // this.medicoService.listarpaginado(this.filtro).then((res) => {
      //   var contado = 1;
      //   res.forEach(element => {
      //     element.numeromedico = contado++;
      //   });

      //   console.log("data del enter", res)
      //   // this.filtro.NombreCompleto = `${res[0].ApellidoPaterno} ${res[0].ApellidoMaterno}, ${res[0].Nombres}`
      //   if (this.filtro.Nombres == null) {
      //     this.mostrarMensajeInfo('DOCUMENTO NO ENCONTRADO, REVISAR BIEN LOS CARACTERES');
      //   } else {
      //     this.lstMedico = res;

      //   }
      // });

    }
  }

  limpiarBuscador() {
    this.lstMedico = [];
    this.filtro.CMP = null;
    this.filtro.Nombres = null;
    this.checknombre(event);
    this.loading = false;
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
    this.titulo = 'MÉDICO';
    this.acciones = `${this.titulo}: ${accionform}`;
    this.filtro = new FiltroMedico();


  }


  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;

    this.dialog = true;
    this.puedeEditar = false;

  }

}


