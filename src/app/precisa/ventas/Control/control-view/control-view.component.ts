import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { Table } from 'primeng/table';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { ControlMantenimientoComponent } from '../control-mantenimiento/control-mantenimiento.component';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { FiltroWcoSede } from '../../../maestros/Sedes/dominio/filtro/FiltroWcoSede';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { FiltroPrograma } from '../../../proyecto/Programa/model/FiltroPrograma';
import { FiltroContrato } from '../../Contrato/model/FiltroContrato';
import { FiltroManzana } from '../../../proyecto/Manzana/model/FiltroManzana';
import { ProgramaService } from '../../../proyecto/Programa/service/programa.service';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { ManzanaService } from '../../../proyecto/Manzana/service/manzana.service';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { ContratoService } from '../../Contrato/service/contrato.service';
import { DtoContrato } from '../../Contrato/model/DtoContrato';
import { FiltroControl } from '../model/filtroControl';
import { ControlService } from '../service/control.service';
import { ContratoMantenimientoComponent } from '../../Contrato/contrato-mantenimiento/contrato-mantenimiento.component';
import { iControl } from '../model/icontrol';
import { DtoLetra } from '../model/dtoLetra';

@Component({
  selector: 'ngx-control-view',
  templateUrl: './control-view.component.html',
  styleUrls: ['./control-view.component.scss']
})

export class ControlViewComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController, AfterViewInit {
  @ViewChild(ControlMantenimientoComponent, { static: false }) controlMantenimientoComponent: ControlMantenimientoComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  @ViewChild(ContratoMantenimientoComponent, { static: false }) contratoMantenimientoComponent: ContratoMantenimientoComponent;

  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: Maestro[] = [];
  bloquearPag: boolean;
  lstCompania: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstManzana: SelectItem[] = [];
  seleccion: any;
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  filtro: FiltroContrato = new FiltroContrato();
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  filtroPrograma: FiltroPrograma = new FiltroPrograma();
  FiltroManzana: FiltroManzana = new FiltroManzana();
  // lstContrato: DtoContrato[] = [];
  lstContrato: any[] = [];
  ltsExportar: MenuItem[];
  maxDate: Date = new Date();
  procesoLetras: number = 20;
  FiltroLetra: FiltroControl = new FiltroControl();
  constructor(
    private exportarService: ExportarService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private programaService: ProgramaService,
    private messageService: MessageService,
    private contratoService: ContratoService,
    private maestroSucursalService: MaestroSucursalService,
    private ControlService: ControlService,
    private manzanaService: ManzanaService) {
    super();
    this.maxDate.setFullYear(this.maxDate.getFullYear());
  }
  ngAfterViewInit(): void {
    this.filtro.Estado = 1;
  }


  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    this.bloquearPag = true;
    const p1 = this.listarComboEstados();
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
    Promise.all([p1, p4]).then((f) => {
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
    console.log("coreMensaje llegando:dfsfsd", mensage.componente);
    if (mensage.componente == "SELECTOR_CONTRATO") {
      this.coreBuscar();

    }
    if (mensage.componente == "SELECTOR_PAGAR") {
      this.coreBuscar();

    }
  }



  coreBuscar(): void {
    this.bloquearPag = true;
    console.log("coreBuscar:", this.filtro);

    if (this.filtro.CompaniaCodigo == null) {
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
      this.filtro.IdManzana = null;
    }

    //asignar fecha final por defecto si esta llega a ser null
    this.filtro.FechaModificacion = this.filtro.FechaModificacion == null ? new Date() : this.filtro.FechaModificacion;

    this.contratoService.ListarContratoSeguimiento(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = res.length;
      var www = 0;
  
      res.forEach((element) => {
        element.num = contado--;   
        www++;
      });
      this.lstContrato = res;
      console.log("coreBuscar ListarContratoSeguimiento ::",    this.lstContrato);
      for (let contrato of this.lstContrato) {
        let porcentaje = (contrato.CantPagada * 100);
        contrato.progreso = Math.trunc(porcentaje / contrato.CantTotal);
      }

   //   this.calculoProgreso();
      console.log("maestro CONTRATO listado:", res);
    });

  }


  async calculoProgreso() {
    for (let contrato of this.lstContrato) {
      this.FiltroLetra = new FiltroControl();
      this.FiltroLetra.IdContrato = contrato.IdContrato;
      this.ControlService.ListarLetra(this.FiltroLetra).then(data => {
        var countLetrasPagadas = 0;
        data.forEach(e => {
          if (e.Estado == 2) {
            countLetrasPagadas++;
          }
        });
        console.log(`LETRAS PAGADAS DE CONTRATO ${contrato.IdContrato}`, countLetrasPagadas);
        let porcentaje = (countLetrasPagadas * 100);
        contrato.progreso = Math.trunc(porcentaje / data.length);
      });
      // const data: any[] = await this.ControlService.ListarLetra(this.FiltroLetra);
      // console.log("this.lstContrato[i].progreso" + contrato.progreso)
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
      this.lstContrato.forEach(function (e: DtoContrato) {
        contador += 1;
        if (e.FechaInicial != null || e.FechaInicial != undefined) {
          let fechaInicio = new Date(e.FechaInicial);
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
          LOTE: e.lote?.toUpperCase() || '',
          CLIENTE: e.Cliente?.toUpperCase() || '',
          PROCESO: `${Number.isNaN(new Intl.NumberFormat().format(e.progreso)) ? 0 : new Intl.NumberFormat().format(e.progreso)}`,
          AREA_M2: new Intl.NumberFormat().format(e.Area),
          PRECIO: new Intl.NumberFormat().format(Number(e.Valor)),
          COSTO_TOTAL: new Intl.NumberFormat().format(e.Monto),
          ESTADO: e.DesEstado?.toUpperCase() || ''
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lstContrato, listaExportar, "SEGUIMIENTO DE PAGOS");
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
        "NRO",
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
        "COSTO TOTAL",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstContrato.forEach(function (e: DtoContrato) {
        contador += 1;


        if (e.FechaInicial != null || e.FechaInicial != undefined) {
          let fechaInicio = new Date(e.FechaInicial);
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
          e.lote?.toUpperCase() || '',
          e.Cliente?.toUpperCase() || '',
          `${Number.isNaN(new Intl.NumberFormat().format(e.progreso)) ? 0 : new Intl.NumberFormat().format(e.progreso)}`,
          new Intl.NumberFormat().format(e.Area),
          new Intl.NumberFormat().format(Number(e.Valor)),
          new Intl.NumberFormat().format(e.Monto),
          e.DesEstado?.toUpperCase() || ''

        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lstContrato, col, rows, "SEGUIMIENTO DE PAGOS.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
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

  coreVer(dto) {
    this.contratoMantenimientoComponent.iniciarComponenteMaestro(
      new MensajeController(this, "SELECTOR_CONTRATO", ""), "VER",
      this.objetoTitulo.menuSeguridad.titulo, dto);
  }
  onRowSelect(event: any) {
    console.log("FILA SELECCIONADA:", event.data);
    this.seleccion = event.data
  }
  coreNuevo(): void {
    if (this.seleccion == null || this.seleccion == undefined) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Advertencia",
        detail: "Seleccione un contrato.",
      });
      return;
    }
    if (this.seleccion.Estado == 4) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Advertencia",
        detail: "El contrato está anulado.",
      });
      return;
    }
    this.controlMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_CONTRATO', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, this.seleccion);
    this.seleccion = undefined;
  }

  listarComboEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTCON").forEach(i => {
      this.lstEstados.push({ label: i.Nombre, value: i.IdCodigo })
    });

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

  selectedItemcompania2(event) {
    console.log(" this.lstCompania:", this.lstCompania);
    console.log("seleccion:", event);
    var dato = this.lstCompania.filter((x) => x.value == event.value);
    this.filtroSede.IdEmpresa = Number(dato[0].title);
    this.cargarCombosede(this.filtroSede.IdEmpresa);
  }

  selectedItemcompania(event) {
    if (event.value != null) {
      var dato = this.lstCompania.filter((x) => x.value == event.value);
      this.filtroSede.IdEmpresa = Number(dato[0].title);
      this.cargarCombosede(this.filtroSede.IdEmpresa);
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
    } else {
      this.lstSucursal = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.lstPrograma = []
      this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.lstManzana = [];
      this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    }
  }


  cargarCombosede(IdPersona: number): Promise<number> {
    if (IdPersona == null) {
      this.lstSucursal = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.lstPrograma = [];
      this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      return;
    } else {
      this.filtroSede.SedEstado = 1;
      this.filtroSede.IdEmpresa = IdPersona;
      this.lstSucursal = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.lstPrograma = [];
      this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
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


  async generarPdfLetrar(dto) {

    try {

      if (dto == null || dto == undefined) {
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "Advertencia",
          detail: "Seleccione un contrato.",
        });
        return;
      }
      if (dto.Estado == 4) {
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "Advertencia",
          detail: "El contrato está anulado.",
        });
        return;
      }
        const respLetrasPdf = await this.contratoService.ReporteEstadoCuenta(dto.IdContrato);
        console.log("ReporteEstadoCuenta RETORNo", respLetrasPdf);
        let basePrueba = respLetrasPdf.mensaje;
      
        this.convertirAPdf(basePrueba, dto.IdContrato);

    } catch (e) {
      console.log('error', e);

      this.messageService.add({ key: 'mr', severity: 'error', summary: 'Error', detail: 'Error al generar PDF de Estado Cuenta' });

    }
  }


  convertirAPdf(base64String: string, filename) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${filename}.pdf`;
    link.click();
  }

}
