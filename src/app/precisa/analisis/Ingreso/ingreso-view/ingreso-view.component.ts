import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { Table } from 'primeng/table';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { IngresoMantenimientoComponent } from '../ingreso-mantenimiento/ingreso-mantenimiento.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';

import { DtoContrato } from '../../../ventas/Contrato/model/DtoContrato';
import { DtoCorrelativo } from '../../../liquidacion/correlativos/model/DtoCorrelativo';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { CorrelativoService } from '../../../liquidacion/correlativos/services/correlativo.service';
import { ControlService } from '../../../ventas/Control/service/control.service';
import { FiltroContrato } from '../../../ventas/Contrato/model/FiltroContrato';
import { ContratoService } from '../../../ventas/Contrato/service/contrato.service';
import { InteresPagarComponent } from '../../../ventas/Interes/interes-pagar/interes-pagar.component';
import { ControlPagarComponent } from '../../../ventas/Control/control-pagar/control-pagar.component';
import { InteresService } from '../../../ventas/Interes/service/interes.service';
import { DtoInteres } from '../../../ventas/Interes/model/Dtointeres';
import { FiltroControl } from '../../../ventas/Control/model/filtroControl';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { IIngreso } from '../model/iingreso';



@Component({
  selector: 'ngx-ingreso-view',
  templateUrl: './ingreso-view.component.html',
  styleUrls: ['./ingreso-view.component.scss']
})
export class IngresoViewComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  @ViewChild(InteresPagarComponent, { static: false }) interesPagarComponent: InteresPagarComponent;
  // @ViewChild(ControlPagarComponent, { static: false }) controlPagarComponent: ControlPagarComponent;
  @ViewChild(IngresoMantenimientoComponent, { static: false }) IngresoMantenimientoComponent: IngresoMantenimientoComponent;
  @ViewChild(IngresoMantenimientoComponent, { static: false })
  ingresoMantenimientoComponent: IngresoMantenimientoComponent;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  filtro: any = new DtoContrato();
  ltsExportar: MenuItem[];
  bloquearPag: boolean;
  lstSerie: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];
  lstCompania: SelectItem[] = [];
  lstComprobante: SelectItem[] = [];
  ingresoTotal: number = 0;
  lstTipoPago: SelectItem[] = [];
  lstDetalle: any[] = [];

  constructor(
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private CorrelativoService: CorrelativoService,
    private ControlService: ControlService,
    private contratoService: ContratoService,
    private exportarService: ExportarService,
    private messageService: MessageService,
    private controlService: ControlService,
    private InteresService: InteresService,

  ) {
    super();
  }


  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    const p4 = this.cargarCombocompania();

    const p1 = this.cargarTipoComprobante();
    const p2 = this.cargarFormaPago();

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
    Promise.all([p1, p4, p2]).then((f) => {
      this.bloquearPag = false;
    });


    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() + 1;
    var anio = hoy.getFullYear();
    this.filtro.FechaEmision = new Date(`${anio},${mes},${dia}`);
    this.filtro.FechaVencimiento = new Date(`${anio},${mes},${dia}`);


  }

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreNuevo(): void {

  }

  async coreBuscar() {
    this.bloquearPag = true;
    this.ingresoTotal = 0;
    console.log("Lote coreBuscar:", this.filtro);
    //asignar fecha final por defecto si esta llega a ser null
    this.filtro.FechaVencimiento = this.filtro.FechaVencimiento == null ? new Date() : this.filtro.FechaVencimiento;
    this.ControlService.ListarFacturacion(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;

      res.forEach((element) => {
        this.ingresoTotal = this.ingresoTotal + element.MontoTotal;
      });

      this.lstComprobante = res;
      console.log("maestro CONTRATO listado:", res);
    });
  }
  cargarFormaPago() {
    this.lstTipoPago = [];
    this.lstTipoPago.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "FORMAPAGO").forEach(i => {
      this.lstTipoPago.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });
    console.log("TIPO DE PAGO", this.lstTipoPago);
  }
  cargarCombocompania(): Promise<number> {
    const FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
    FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    this.lstSerie = [];
    this.lstSerie.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    return this.maestrocompaniaMastService.listarCompaniaMast(FiltroCompan)
      .then((res) => {
        console.log("listarCompaniaMast", res);
        res.forEach((ele) => {
          this.lstCompania.push({
            label: ele.DescripcionCorta.trim(),
            value: ele.CompaniaCodigo.trim(),
            title: ele.Persona,
          });
        });
        return 1;
      });
  }

  selectedItemcompania(event) {
    if (event.value != null) {
      var dato = this.lstCompania.filter((x) => x.value == event.value);
      // this.cargarSerie(event.value);
    } else {
      this.lstSerie = [];
      this.lstSerie.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    }
  }

  async cargarTipoComprobante(): Promise<boolean> {
    this.lstTipoComprobante = [];
    this.lstTipoComprobante.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipoComprobante.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });

    this.lstSerie = [];
    this.lstSerie.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    if (this.lstTipoComprobante.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  async cargarSerie(CompaniaCodigo: string): Promise<boolean> {
    this.lstSerie = [];
    const FiltroCorrelativo: DtoCorrelativo = new DtoCorrelativo();
    FiltroCorrelativo.Estado = "A";
    FiltroCorrelativo.CompaniaCodigo = this.filtro.CompaniaCodigo;
    FiltroCorrelativo.TipoComprobante = this.filtro.TipoComprobante;
    console.log("FiltroCorrelativo cargarSerie", FiltroCorrelativo);
    this.lstSerie.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    const RespCorrelativo: DtoCorrelativo[] = await this.CorrelativoService.ListarCorrelativos(FiltroCorrelativo);
    RespCorrelativo.forEach(ele => {
      this.lstSerie.push({ label: ele.Serie.trim(), value: ele.Serie });
    } );
    console.log(" cargarSerie lstSerie ::",  this.lstSerie);
    if (this.lstSerie.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  async SeleccioneTipoComprobante(event) {
    if (event.value != null) {
      console.log(" this.lstTipoComprobante:", this.lstTipoComprobante);
      console.log("SeleccioneTipoComprobante:", event);
      var dato = this.lstCompania.filter((x) => x.value == event.value);
      this.filtro.TipoComprobante = event.value;
      this.cargarSerie(this.filtro.CompaniaCodigo);
      /*       let dato = this.lstTipoComprobante.filter((x) => x.value == event.value);
            const isSerie: boolean = await this.cargarSerie(this.filtro.CompaniaCodigo); */
    } else {
      this.lstSerie = [];
      this.lstSerie.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.filtro.SerieComprobante = null;
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

  async coreVer(rowData) {
    // this.messageService.add({
    //   key: "bc",
    //   severity: "warn",
    //   summary: "Advertencia",
    //   detail: "Seleccione un interes pagado",
    // });
    console.log("coreVer rowData", rowData);
    this.lstDetalle = [];
    if (rowData.TipoComprobante == "RE") {
      let BusarInteres: DtoInteres = new DtoInteres();
      BusarInteres.IdComprobante = rowData.IdComprobante;
      console.log("ListarInteresFacturacion BusarInteres", BusarInteres);
      this.lstDetalle = await this.InteresService.ListarInteresFacturacion(BusarInteres);
      this.lstDetalle.forEach(detalle=>{
        if(detalle.Nombre.length < 5){
          detalle.Nombre = detalle.Observacion;
        }
      });
      console.log("RE respComprobante", this.lstDetalle);
    }
    else {
      let BusarLetra: FiltroControl = new FiltroControl();
      BusarLetra.IdComprobante = rowData.IdComprobante;
      console.log("ListarLetraFacturacion BusarLetra", BusarLetra);
      this.lstDetalle = await this.controlService.ListarLetraFacturacion(BusarLetra);
      console.log("OTRO respComprobante", this.lstDetalle);
    }
    await this.IngresoMantenimientoComponent.coreIniciarComponente(new MensajeController(this, "VER_LETRA", ""), "VER_LETRA", rowData, this.lstDetalle);
  }

  async getContrato(IdContrato: number): Promise<DtoContrato> {
    const filtroContrato: FiltroContrato = new FiltroContrato();
    filtroContrato.IdContrato = IdContrato;
    const respContrato = await this.contratoService.ListarContrato(filtroContrato);
    console.log(respContrato);
    if (respContrato.length == 0) {
      return null;
    } else { return respContrato[0]; }

  }

  async exportExcel() {
    if (this.lstComprobante == null || this.lstComprobante == undefined || this.lstComprobante.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: IIngreso[] = [];
      let contador: number = 0;
      let fechaEmision: string;
      this.lstComprobante.forEach(function (e: any) {
        contador += 1;
        if (e.FechaEmision != null || e.FechaEmision != undefined) {
          let FechaInicio = new Date(e.FechaEmision);
          let dd = ("0" + FechaInicio.getDate()).slice(-2);
          let mm = ("0" + (FechaInicio.getMonth() + 1)).slice(-2);
          let yyyy = FechaInicio.getFullYear()
          fechaEmision = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaEmision = '';
        }

        //new Intl.NumberFormat().format(element.Diametro)
        let itemExportar: IIngreso = {
          NRO: contador.toString(),
          FECHA: fechaEmision,
          COMPAÑIA: e.DescripcionCorta?.toUpperCase() || '',
          CLIENTE: e.Cliente?.toUpperCase() || '',
          TIPO_COMPROBANTE: e.TipoComprobante?.toUpperCase() || '',
          SERIE: e.SerieComprobante?.toUpperCase() || '',
          NUMERO: e.NumeroComprobante?.toUpperCase() || '',
          FORMA_PAGO: e.NomFormaPago?.toUpperCase() || '',
          MONTO_TOTAL: new Intl.NumberFormat().format(e.MontoTotal)

        };
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lstComprobante, listaExportar, "ingresos");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });
    }
  }


  async exportPdf() {
    if (this.lstComprobante == null || this.lstComprobante == undefined || this.lstComprobante.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      this.bloquearPag = await true;
      var col = [[
        "NUM",
        "FECHA",
        "COMPAÑIA",
        "CLIENTE",
        "TIPO_COMPROBANTE",
        "SERIE",
        "NUMERO",
        "FORMA_PAGO",
        "MONTO_TOTAL"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaEmision: string;
      this.lstComprobante.forEach(function (e: any) {
        contador += 1;
        if (e.FechaEmision != null || e.FechaEmision != undefined) {
          let FechaInicio = new Date(e.FechaEmision);
          let dd = ("0" + FechaInicio.getDate()).slice(-2);
          let mm = ("0" + (FechaInicio.getMonth() + 1)).slice(-2);
          let yyyy = FechaInicio.getFullYear()
          fechaEmision = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaEmision = '';
        }

        let itemExportar = [
          contador,
          fechaEmision,
          e.DescripcionCorta?.toUpperCase() || '',
          e.Cliente?.toUpperCase() || '',
          e.TipoComprobante?.toUpperCase() || '',
          e.SerieComprobante?.toUpperCase() || '',
          e.NumeroComprobante?.toUpperCase() || '',
          e.NomFormaPago?.toUpperCase() || '',
          new Intl.NumberFormat().format(e.MontoTotal)

        ];
        rows.push(itemExportar);
      });

      const result = await this.exportarService.ExportPdf(this.lstComprobante, col, rows, "Ingresos.pdf", "l");
      console.log("result", result);
      this.bloquearPag = await false;
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }
  }

}
