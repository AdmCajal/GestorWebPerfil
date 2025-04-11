import { Component, OnInit, ViewChild } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { LazyLoadEvent, Message, MessageService, SelectItem } from "primeng/api";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from "primeng/table";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { FiltroPersona } from "../../../maestros/persona/dominio/filtro/FiltroPersona";
import { dtoPersona } from "../../Persona/dominio/dto/dtoPersona";
import { PersonaService } from "../../Persona/servicio/persona.service";

@Component({
  selector: 'ngx-empresa-buscar',
  templateUrl: './empresa-buscar.component.html',
  styleUrls: ['./empresa-buscar.component.scss']
})
export class EmpresaBuscarComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  @ViewChild('myselect') myselect;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;

  mensajeController: MensajeController

  dto: dtoPersona = new dtoPersona();
  filtro: FiltroPersona = new FiltroPersona();

  lstTipoDocumento: SelectItem[] = [];
  lstPersona: any[] = [];

  editarRuc: boolean = false;
  editarCampos: boolean = false;
  editarTipoDocumento: boolean = false;
  verdocumento: boolean = false;
  vernombre: boolean = true;
  acciones: string = ''
  position: string = 'top'
  dialog: boolean = false;
  selectedTipoDocuemento = "";
  selectedPort = "";
  // paginacion: DominioPaginacion = new DominioPaginacion();
  titulo: string;
  loading: boolean; 
  validarBusPer: FormGroup;
  validarBusDocPer: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private personaService: PersonaService,
    private toastrService: NbToastrService,
    protected messageService: MessageService,
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
    this.ValidarBusEmpresa();
    const p1 = this.listaComboTipoDocumento();
    Promise.all([p1]).then(resp => {

    });
    this.checknombre(event)
  }

  ValidarBusEmpresa() {
    this.validarBusPer = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]]
    })
    this.validarBusDocPer = this.formBuilder.group({
      documento: ['', [Validators.required, Validators.minLength(11)]]
    })
  }

  get nombreField() {
    return this.validarBusPer.get('nombre');
  }

  get documentoField() {
    return this.validarBusDocPer.get('documento');
  }


  coreNuevo(): void {
    throw new Error("Method not implemented.");
  }

  coreBuscare() {
    if (this.validarBusPer.valid || this.validarBusDocPer.valid) {
      this.dataTableComponent.first = 0;
      this.grillaCargarDatos({ first: this.dataTableComponent.first });
    } else {
      this.validarBusPer.markAllAsTouched();
      this.validarBusDocPer.markAllAsTouched();
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
    console.log("data del persona", dto)
    this.coreSalir();   
  }

  mostrarMensajeInfo(mensaje: string): void {
    this.mostrarMensaje(mensaje, 'info');
  }

  mostrarMensaje(mensaje: string, tipo: string): void {
    this.messageService.clear();
    this.messageService.add({ severity: tipo, summary: 'Mensaje', detail: mensaje });
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

  grillaCargarDatos(event: LazyLoadEvent) {
    this.loading = true;
    console.log("entrooo:::::");   
    this.dto.TipoDocumento = "R";
    this.dto.Estado = "A";
    this.dto.TipoPersona = "J";    
    this.personaService.listarpaginado(this.dto).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.numeroempresa = contado++;
      });
      this.loading = false;
      this.lstPersona = res;
      console.log("data listado:", res);
    });
  }

  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      this.coreBuscare();
    }
  }

  limpiarBuscador() {
    this.lstPersona = [];
    this.dto.NombreCompleto = null;
    this.dto.Documento = null;
    this.checknombre(event);
    this.loading = false;
  }

  iniciarComponente(accion: string, titulo) {
    // this.dialog = true;
    // this.filtro = new FiltroPersona();
    // if (accion == "NUEVO") {
    this.cargarAcciones(accion, titulo)
    this.coreIniciarComponente
    // else{
    //   this.cargarAcciones(accion,titulo)
    // }
  }

  coreIniciarComponente(msj: MensajeController, accionform: string) {
    this.mensajeController = msj;
    this.dialog = true;
    this.limpiarBuscador();
    this.titulo = 'EMPRESA';
    this.acciones = `${this.titulo}: ${accionform}`;
    this.filtro = new FiltroPersona();
  }



  // selectedItemTipoDocumento(event) {
  //   this.selectedTipoDocuemento = event.value
  //   if (this.selectedTipoDocuemento == "R") {
  //     this.verRuc = false
  //   } else {
  //     this.verRuc = true
  //   }
  // }

  checknombre(hola: any) {
    console.log("entro", hola);
    this.vernombre = true;
    this.verdocumento = false;   
    this.dto.Documento = null;
    this.ValidarBusEmpresa();

  }

  checkdocumento(anyd: any) {
    this.vernombre = false;
    this.dto.NombreCompleto = null;
    this.verdocumento = true;
    this.ValidarBusEmpresa();
  }

  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false;

  }
  listaComboTipoDocumento() {

    this.lstTipoDocumento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPODOCIDENTID").forEach(i => {
      this.lstTipoDocumento.push({ label: i.Nombre, value: i.Codigo })
      this.dto.TipoDocumento = "R"

    });
  }


}


