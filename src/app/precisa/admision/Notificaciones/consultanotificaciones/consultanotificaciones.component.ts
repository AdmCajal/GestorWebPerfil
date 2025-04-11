import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { Table } from 'primeng/table';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { FiltroWcoSede } from '../../../maestros/Sedes/dominio/filtro/FiltroWcoSede';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { FiltroPrograma } from '../../../proyecto/Programa/model/FiltroPrograma';
import { FiltroManzana } from '../../../proyecto/Manzana/model/FiltroManzana';
import { ProgramaService } from '../../../proyecto/Programa/service/programa.service';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { ManzanaService } from '../../../proyecto/Manzana/service/manzana.service';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { ContratoService } from '../../../ventas/Contrato/service/contrato.service';
import { ControlService } from '../../../ventas/Control/service/control.service';
import { FiltroContrato } from '../../../ventas/Contrato/model/FiltroContrato';
import { DtoContrato } from '../../../ventas/Contrato/model/DtoContrato';
import { FiltroControl } from '../../../ventas/Control/model/filtroControl';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { NotificacioDetalleComponent } from '../notificacio-detalle/notificacio-detalle.component';
import { iControl } from '../../../ventas/Control/model/icontrol';
import { INotificacion } from '../../../ventas/Contrato/model/iNotificacion';

@Component({
  selector: 'ngx-consultanotificaciones',
  templateUrl: './consultanotificaciones.component.html'
})
export class ConsultanotificacionesComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  @ViewChild(NotificacioDetalleComponent, { static: false }) notificacioDetalleComponent: NotificacioDetalleComponent;
  dto: Maestro[] = [];
  bloquearPag: boolean;
  lstCompania: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstManzana: SelectItem[] = [];
  seleccion: DtoContrato = new DtoContrato();;
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  filtro: FiltroContrato = new FiltroContrato();
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  filtroPrograma: FiltroPrograma = new FiltroPrograma();
  FiltroManzana: FiltroManzana = new FiltroManzana();
  lstContrato: INotificacion[] = [];
  ltsExportar: MenuItem[];
  maxDate: Date = new Date();
  procesoLetras: number = 20;
  FiltroLetra: FiltroControl = new FiltroControl();
  isImprimir: boolean = false;
  date: Date = new Date();
  constructor(
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private programaService: ProgramaService,
    private messageService: MessageService,
    private contratoService: ContratoService,
    private exportarService: ExportarService,
    private maestroSucursalService: MaestroSucursalService,
    private ControlService: ControlService,
    private manzanaService: ManzanaService

  ) {
    super();
  }


  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    this.bloquearPag = true;
    const p4 = this.cargarCombocompania();
    this.ltsExportar = [
      {
        label: "Formato PDF",
        icon: "pi pi-file-pdf",
        command: () => {
          this.exportPdf();
        },
      },
      {
        label: "Formato EXCEL",
        icon: "pi pi-file-excel",
        command: () => {
          this.exportExcel();
        },
      },
    ];
    Promise.all([p4]).then((f) => {
      this.bloquearPag = false;
    });
    this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    this.filtro.FechaInicial = new Date();
    this.filtro.FechaInicial.setMonth(new Date().getMonth() - 1);
    this.filtro.FechaModificacion = new Date();

  }

  coreMensaje(mensage: MensajeController): void {
    console.log("coreMensaje llegando:", mensage.componente);
    if (mensage.componente == "SELECTOR_CONTRATO") {
      this.coreBuscar();
    }
  }

  coreBuscar(): void {
    this.bloquearPag = true;
    console.log("Lote coreBuscar:", this.filtro);
    console.log("Lote coreBuscar:", this.filtro);
    if (this.filtro.CompaniaCodigo == null) {
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
      this.filtro.IdManzana = null;
    }

    //asignar fecha final por defecto si esta llega a ser null
    this.filtro.FechaModificacion = this.filtro.FechaModificacion == null ? new Date() : this.filtro.FechaModificacion;

    this.contratoService.ListarLetraNotificacion(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      this.lstContrato = [];
      res.forEach((element) => {
        element.num = contado++;
       let porcentaje = (element.CantidadLetraPendientePagadas * 100);
        element.progreso = Math.trunc(porcentaje / element.Cant); 
        console.log("valor porcentaje:: ", porcentaje);  
        console.log("valor progreso:: ", element.progreso );    
      //  element.progreso =  (element.Cant - element.CantidadLetraPendientePagadas + element.CantidadLetraPendiente);
      });
      this.lstContrato = res;
     // this.calculoProgreso();
     console.log("Repote ListarLetraNotificacion:: ", res);
    });

  }

  async calculoProgreso() {
    this.procesoLetras;

    for (let i = 0; i < this.lstContrato.length; i++) {
      this.FiltroLetra.IdContrato = this.lstContrato[i].IdContrato;
      let data: any[] = await this.ControlService.ListarLetra(this.FiltroLetra);
      var countLetrasPagadas = await 0;
      data.forEach(e => {
        if (e.Estado == 2) {
          countLetrasPagadas++;
        }
      });
      console.log(`LETRAS PAGADAS DE CONTRATO ${this.lstContrato[i].IdContrato}`, countLetrasPagadas);
      let porcentaje = (countLetrasPagadas * 100);
      this.lstContrato[i].progreso = Math.trunc(porcentaje / data.length);
      console.log("this.lstContrato[i].progreso" + this.lstContrato[i].progreso)


      // this.lstContrato[i].progreso = (porcentaje / this.lstContrato[i].CantidadLetra);
      // if (this.lstContrato[i].progreso > 100) {
      //   this.lstContrato[i].progreso = 100;
      // }
      // if (this.lstContrato[i].DesEstado == 'PENDIENTE' && this.lstContrato[i].progreso >= 99) {
      //   this.lstContrato[i].progreso--;
      // }
    }
  }


  exportExcel() {
    if (this.lstContrato == null || this.lstContrato == undefined || this.lstContrato.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: iControl[] = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstContrato.forEach(function (e: INotificacion) {
        contador += 1;
        if (e.FechaInicio != null || e.FechaInicio != undefined) {
          let fechaInicio = new Date(e.FechaInicio);
          let dd = ("0" + fechaInicio.getDate()).slice(-2);
          let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
          let yyyy = fechaInicio.getFullYear()
          fechaCreacion = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaCreacion = '';
        }

        let itemExportar: iControl = {
          NRO: contador,
          FECHA: fechaCreacion,
          COMPAÑIA: e.DescripcionCorta?.toUpperCase() || '',
          SUCURSAL: e.SedDescripcion?.toUpperCase() || '',
          PROGRAMA: e.NomProyecto?.toUpperCase() || '',
          MANZANA: e.NomManzana?.toUpperCase() || '',
          LOTE: e.DesLote?.toUpperCase() || '',
          CLIENTE: e.Cliente?.toUpperCase() || '',
          PROCESO: `${Number.isNaN(new Intl.NumberFormat().format(e.progreso)) ? 0 : new Intl.NumberFormat().format(e.progreso)}`,
          AREA_M2: new Intl.NumberFormat().format(e.Area),
          PRECIO: new Intl.NumberFormat().format(Number(e.MontoAfecto)),
          COSTO_TOTAL: new Intl.NumberFormat().format(e.MontoTotal),
          ESTADO: e.DesEstado?.toUpperCase() || ''
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lstContrato, listaExportar, "REQ DE PAGOS");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });
    }
  }

  //pdf

  exportPdf() {
    if (this.lstContrato == null || this.lstContrato == undefined || this.lstContrato.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {

      var col = [[
        "NUM",
        "FECHA",
        "COMPAÑIA",
        "SUCURSAL",
        "PROGRAMA",
        "MANZANA",
        "LOTE",
        "CLIENTE",
        "PROCESO",
        "AREA",
        "PRECIO",
        "COSTO_TOTAL",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstContrato.forEach(function (e: INotificacion) {
        contador += 1;


        if (e.FechaInicio != null || e.FechaInicio != undefined) {
          let fechaInicio = new Date(e.FechaInicio);
          let dd = ("0" + fechaInicio.getDate()).slice(-2);
          let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
          let yyyy = fechaInicio.getFullYear()
          fechaCreacion = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaCreacion = '';
        }

        let itemExportar = [
          contador,
          fechaCreacion,
          e.DescripcionCorta?.toUpperCase() || '',
          e.SedDescripcion?.toUpperCase() || '',
          e.NomProyecto?.toUpperCase() || '',
          e.NomManzana?.toUpperCase() || '',
          e.DesLote?.toUpperCase() || '',
          e.Cliente?.toUpperCase() || '',
          `${Number.isNaN(new Intl.NumberFormat().format(e.progreso)) ? 0 : new Intl.NumberFormat().format(e.progreso)}`,
          new Intl.NumberFormat().format(e.Area),
          new Intl.NumberFormat().format(Number(e.MontoAfecto)),
          new Intl.NumberFormat().format(e.MontoTotal),
          e.DesEstado?.toUpperCase() || ''

        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lstContrato, col, rows, "REQ DE PAGOS.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }

  }

  cargarCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestrocompaniaMastService
      .listarCompaniaMast(this.FiltroCompan)
      .then((res) => {
        console.log("listarCompaniaMast", res);
        res.forEach((ele) => {
          //  this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
          this.lstCompania.push({
            label: ele.DescripcionCorta.trim(),
            value: ele.CompaniaCodigo.trim(),
            title: ele.Persona,
          });
        });
        return 1;
      });
  }

  onRowSelect(event: any) {
    console.log("FILA SELECCIONADA:", event.data);
    this.seleccion = event.data
  }

  selectedItemcompania(event) {
    if (event.value != null) {
      console.log(" this.lstCompania:", this.lstCompania);
      console.log("seleccion:", event);
      let dato = this.lstCompania.filter((x) => x.value == event.value);
      this.filtroSede.IdEmpresa = Number(dato[0].title);
      this.cargarCombosede(this.filtroSede.IdEmpresa);
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
    } else {
      this.lstSucursal = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.lstPrograma = [];
      this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.lstManzana = [];
      this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
      this.filtro.IdManzana = null;
    }
  }

  cargarCombosede(IdPersona: number): Promise<number> {
    this.lstSucursal = [];
    this.filtroSede.SedEstado = 1;
    this.filtroSede.IdEmpresa = IdPersona;

    this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestroSucursalService
      .ListaSede(this.filtroSede)
      .then((res) => {
        console.log("ListaSede", res);
        res.forEach((ele) => {
          this.lstSucursal.push({
            label: ele.SedDescripcion.trim(),
            value: ele.IdSede,
          });
        });
        return 1;
      });
  }

  cargarComboPrograma(): Promise<number> {
    this.filtroPrograma.Estado = 1;
    this.filtroPrograma.IdSede = this.filtro.IdSede;
    this.lstPrograma = [];
    this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.programaService
      .listarPrograma(this.filtroPrograma)
      .then((res) => {
        console.log("Combo Programa:", res);
        res.forEach((ele) => {
          this.lstPrograma.push({
            label: ele.Nombre.trim(),
            value: ele.IdProyecto,
          });
        });
        return 1;
      });
  }

  selectedItemPrograma(event) {
    console.log("event selectedItemPrograma", event);
    this.filtro.IdProyecto = event.value;
    this.cargarComboManzana(this.filtro.IdProyecto);
  }

  cargarComboManzana(Id: number): Promise<number> {
    this.FiltroManzana.IdProyecto = Id;
    this.FiltroManzana.Estado = 1;
    this.lstManzana = [];
    this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.manzanaService.listarManzana(this.FiltroManzana).then((res) => {
      console.log("listarManzana", res);
      res.forEach((ele) => {
        this.lstManzana.push({
          label: ele.Nombre.trim(),
          value: ele.IdManzana,
        });
      });
      return 1;
    });
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

  coreVer(dto) {
    this.notificacioDetalleComponent.iniciarComponenteMaestro('VER', 'DETALLE', dto);
  }

  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }

  coreImprimir() {
    this.isImprimir = true;
    this.bloquearPag = true;

    var canvas: HTMLElement = document.getElementById('notificacion-doc');
    domtoimage.toPng(canvas).then((dataUrl) => {
      let imagen = new Image();
      imagen.src = dataUrl;
      let pdf = new jsPDF('p', 'mm', 'A4');
      pdf.addImage(imagen, 29, 29, 160, 178); /*imagen: es la captura que insertaremos en el pdf, 18: margen izquierdo, 10: margen superior, 260:ancho, 189:alto, pueden jugar con estos valores, de esta forma me quedó prolijo en A4 horizontal*/
      pdf.save(`Notificacion.pdf`);

      this.bloquearPag = false;
      this.dialog = false;
    });
    this.bloquearPag = false;
  }

  selectedItemSucursal(event) {
    if (event.value != null) {
      console.log("event selectedItemPrograma", event);
      this.filtro.IdSede = event.value;
      this.filtro.IdProyecto = null;
      this.filtro.IdManzana = null;
      this.cargarComboPrograma();
      this.lstManzana = []
      this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    }
    else {
      this.lstPrograma = []
      this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.lstManzana = []
      this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.filtro.IdProyecto = null;
      this.filtro.IdManzana = null;
    }
  }

}
