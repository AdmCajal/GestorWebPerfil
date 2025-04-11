import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbToastrService } from "@nebular/theme";
import { LazyLoadEvent, Message, MessageService, SelectItem } from "primeng/api";
import { Table } from "primeng/table";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { Filtroaseguradora } from "../../../maestros/Aseguradora/dominio/filtro/Filtroaseguradora";
import { AseguradoraService } from "../servicio/aseguradora.service";




@Component({
  selector: 'ngx-aseguradora-buscar',
  templateUrl: './aseguradora-buscar.component.html'
})
export class AseguradoraBuscarComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  @ViewChild(Table, { static: false }) dataTableComponent: Table;

  mensajeController: MensajeController

  filtro: Filtroaseguradora = new Filtroaseguradora();

  lstTipoDocumento: SelectItem[] = [];
  lstAseguradora: any[] = [];
  registroSeleccionado: any;


  editarCampos: boolean = false;

  verdocumento: boolean = false;
  vernombre: boolean = true;
  acciones: string = ''
  position: string = 'top'
  dialog: boolean = false;
  // paginacion: DominioPaginacion = new DominioPaginacion();
  titulo: string;
  validarBusAseg: FormGroup;
  validarBusAseg2: FormGroup;
  bloquearPag: boolean; 

  constructor(
    private formBuilder: FormBuilder,
    private aseguradoraService: AseguradoraService,
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
    this.ValidarBusAseguradora();
    const p1 = this.listaComboTipoDocumento();

    Promise.all([p1]).then(resp => {

    });
  }

  ValidarBusAseguradora() {

    this.validarBusAseg = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
    })
    this.validarBusAseg2 = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.maxLength(7)]],
    })
  }

  get nombreField() {
    return this.validarBusAseg.get('nombre');
  }
  get codigoField() {
    return this.validarBusAseg2.get('codigo');
  }

  
  checknombre(hola: any) {
    this.vernombre = true;
    this.verdocumento = false;
    this.filtro.IdAseguradora = null;
    this.ValidarBusAseguradora();

  }
  checkdocumento(anyd: any) {
    this.vernombre = false;
    this.filtro.NombreEmpresa = null;
    this.verdocumento = true;
    this.ValidarBusAseguradora();
  }
  
  coreNuevo(): void {
    throw new Error("Method not implemented.");
  }

  coreBuscar(): void {
    if (this.validarBusAseg.valid || this.validarBusAseg2.valid) {
      this.dataTableComponent.first = 0;
      this.grillaCargarDatos({ first: this.dataTableComponent.first });
    } else {
      this.validarBusAseg.markAllAsTouched();
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
    } else {
      this.mensajeController.resultado = dto;
      this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
      this.coreSalir();
      
    }
  }

  esIdValido(event) {
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



  mostrarMensajeInfo(mensaje: string): void {
    this.mostrarMensaje(mensaje, 'info');
  }

  mostrarMensaje(mensaje: string, tipo: string): void {
    this.messageService.clear();
    this.messageService.add({ severity: tipo, summary: 'Mensaje', detail: mensaje });
  }


  grillaCargarDatos(event: LazyLoadEvent) {
   
      this.bloquearPag = true;   
      this.filtro.Estado=1;
      this.aseguradoraService.listarpaginado(this.filtro).then((res) => {
        var contado = 1;
        res.forEach(element => {
          element.numeroaseguradora = contado++;
        });
        this.bloquearPag = false;
        this.lstAseguradora = res;
      });
   
    
 
  }

  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      this.coreBuscar();
      // this.aseguradoraService.listarpaginado(this.filtro).then((res) => {
      //   var contado = 1;
      //   res.forEach(element => {
      //     element.numeroaseguradora = contado++;
      //   });
      //   if (this.filtro.NombreEmpresa == null) {
      //     this.mostrarMensajeInfo('DOCUMENTO NO ENCONTRADO, REVISAR BIEN LOS CARACTERES');
      //   } else {
      //     this.lstAseguradora = res;

      //   }
      // });
    }
  }

  limpiarBuscador() {
    this.lstAseguradora = [];
    this.filtro.NombreEmpresa = null;
    this.filtro.IdAseguradora = null;
    this.checknombre(event);  
    this.bloquearPag = false; 

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
    this.titulo = 'ASEGURADORA';
    this.acciones = `${this.titulo}: ${accionform}`;
    this.filtro = new Filtroaseguradora();


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
    });
  }

}



