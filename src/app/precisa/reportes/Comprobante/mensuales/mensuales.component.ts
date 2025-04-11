import { Component, OnInit, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { Maestro } from "../../../maestros/FormMaestro/model/maestro";
import { SelectItem, MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { FiltroCompaniamast } from "../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { FiltroContrato } from "../../../ventas/Contrato/model/FiltroContrato";
import { FiltroWcoSede } from "../../../maestros/Sedes/dominio/filtro/FiltroWcoSede";
import { FiltroPrograma } from "../../../proyecto/Programa/model/FiltroPrograma";
import { FiltroManzana } from "../../../proyecto/Manzana/model/FiltroManzana";
import { DtoContrato } from "../../../ventas/Contrato/model/DtoContrato";
import { FiltroLote } from "../../../proyecto/Lotes/model/FiltroLote";
import { ExportarService } from "../../../framework-comun/Exportar/exportar.service";
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { ProgramaService } from "../../../proyecto/Programa/service/programa.service";
import { ContratoService } from "../../../ventas/Contrato/service/contrato.service";
import { LoteService } from "../../../proyecto/Lotes/service/lotes.service";
import { MaestroSucursalService } from "../../../maestros/Sedes/servicio/maestro-sucursal.service";
import { ManzanaService } from "../../../proyecto/Manzana/service/manzana.service";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { ILetrasVencidas } from "../../../ventas/Contrato/model/iletrasvencidas";
import { IMensual } from "../model/iMensual";

@Component({
  selector: 'ngx-mensuales',
  templateUrl: './mensuales.component.html'
})
export class MensualesComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: Maestro[]=[];
  bloquearPag: boolean;
  lstCompania: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstLote: SelectItem[] = [];
  lstManzana: SelectItem[] = [];
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  filtro: FiltroContrato = new FiltroContrato();
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  filtroPrograma: FiltroPrograma = new FiltroPrograma();
  FiltroManzana: FiltroManzana = new FiltroManzana();
  lstContrato: any[] = [];
  ltsExportar: MenuItem[];
  maxDate: Date = new Date();
  minDateFin: Date = new Date();

  seleccion: DtoContrato = new DtoContrato();
  FiltroLote: FiltroLote = new FiltroLote();
  constructor(private exportarService: ExportarService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private programaService: ProgramaService,
    private messageService: MessageService,
    private contratoService: ContratoService,
    private loteService: LoteService,
    private maestroSucursalService: MaestroSucursalService,
    private manzanaService: ManzanaService,) {
    super();
    this.maxDate.setFullYear(this.maxDate.getFullYear());
    this.minDateFin.setDate(this.minDateFin.getDate() + 1);
  }


  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    let dw = new Maestro()

    dw.CodigoTabla="01"
    dw.Descripcion="PRUEBA DESCRI"
    dw.Nombre="NOMBRE DETALLE"
    dw.Estado=2
    this.dto.push(dw)

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
    this.lstLote.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    this.filtro.FechaInicial = new Date();
    this.filtro.FechaInicial.setMonth(new Date().getMonth() - 1);
    this.filtro.FechaModificacion = new Date();
  }

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }

  async coreBuscar() {
    this.bloquearPag = true;
    if (this.filtro.CompaniaCodigo == null) {
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
      this.filtro.IdManzana = null;
    }
    //asignar fecha final por defecto si esta llega a ser null
    this.filtro.FechaModificacion = this.filtro.FechaModificacion == null ? new Date() : this.filtro.FechaModificacion;
    console.log("Lote coreBuscar:", this.filtro);
    this.contratoService.ReporteMensual(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach((element) => {
        element.num = contado++;

      });
      this.lstContrato = res;
      console.log("maestro CONTRATO listado:", res);
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
  coreVer(dto){
    throw new Error('Method not implemented.');  }

    async exportExcel() {
      if (this.lstContrato == null || this.lstContrato == undefined || this.lstContrato.length == 0) {
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "Warning",
          detail: "Realice Busqueda primero",
        });
      } else {
        let listaExportar: IMensual[] = [];
        let contador: number = 0;
        let fechaInicial: string;
        this.lstContrato.forEach(function (e) {
          contador += 1;
          if (e.FechaPago != null || e.FechaPago != undefined) {
            let fechaInicio = new Date(e.FechaPago);
            let dd = ("0" + fechaInicio.getDate()).slice(-2);
            let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
            let yyyy = fechaInicio.getFullYear();

            fechaInicial = dd + "/" + mm + "/" + yyyy;
          } else {
            fechaInicial = '';
          }

          let itemExportar: IMensual = {
            Nro: e.num,            
            COMPAÑIA: e.DescripcionCorta?.toUpperCase() || '',
            SUCURSAL: e.SedDescripcion?.toUpperCase() || '',    
            DOCUMENTO_CLIENTE: e.Documento,
            PROGRAMA: e.NomProyecto?.toUpperCase() || '',
            MANZANA: e.NomManzana?.toUpperCase() || '',
            LOTE: e.DesLote?.toUpperCase() || '',   
            CLIENTE: e.Cliente?.toUpperCase() || '',   
            CUOTA: e.Nombre?.toUpperCase() || '',   
            FEC_PAGO: fechaInicial,
            TIPO_MONEDA: e.MonedaCodigo?.toUpperCase() || '',
            MONTO: new Intl.NumberFormat().format(e.MontoAfecto),
            SERIE: e.SerieComprobante,
            NRO_COMPROBANTE: e.NumeroComprobante,
         
          };
          listaExportar.push(itemExportar);
        });

        const result = await this.exportarService.exportExcel(this.lstContrato, listaExportar, "ReporteMensual");
        console.log(result);

        this.bloquearPag = await false;
        //this.exportarService.exportExcel(this.lstContrato, listaExportar, "Contratos");
        this.messageService.add({
          key: "bc",
          severity: "success",
          summary: "Success",
          detail: "Archivo EXCEL Generado.",
        });
      }
    }


    async exportPdf() {
      if (this.lstContrato == null || this.lstContrato == undefined || this.lstContrato.length == 0) {
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "Warning",
          detail: "Realice Busqueda primero",
        });
      } else {
        this.bloquearPag = await true;
        var col = [[
          "NRO",       
          "COMPAÑIA",
          "SUCURSAL",
          "PROGRAMA",
          "MANZANA",
          "LOTE",
          "DOCUMENTO_CLIENTE",
          "CLIENTE",   
          "CUOTA",
          "FEC_PAGO",
          "TIPO_MONEDA",
          "MONTO",
          "SERIE",
          "NRO_COMPROBANTE"
        ]];
        var rows = [];
        let contador: number = 0;
        let fechaInicio: string;
        let fechaCese: string;
        this.lstContrato.forEach(function (e: any) {
          contador += 1;
          if (e.FechaPago != null || e.FechaPago != undefined) {
            let FechaInicio = new Date(e.FechaPago);
            let dd = ("0" + FechaInicio.getDate()).slice(-2);
            let mm = ("0" + (FechaInicio.getMonth() + 1)).slice(-2);
            let yyyy = FechaInicio.getFullYear()
            fechaInicio = dd + "/" + mm + "/" + yyyy;
          } else {
            fechaInicio = '';
          }

          let itemExportar = [
            contador,     
            e.DescripcionCorta?.toUpperCase() || '',
            e.SedDescripcion?.toUpperCase() || '',
            e.NomProyecto?.toUpperCase() || '',
            e.NomManzana?.toUpperCase() || '',
            e.DesLote?.toUpperCase() || '',
            e.Documento?.toUpperCase() || '',
            e.Cliente?.toUpperCase() || '',
            e.Nombre?.toUpperCase() || '',
            fechaInicio,
            e.MonedaCodigo?.toUpperCase() || '',
            new Intl.NumberFormat().format(e.MontoAfecto),
            e.SerieComprobante?.toUpperCase() || '',
            e.NumeroComprobante?.toUpperCase() || ''

          ];
          rows.push(itemExportar);
        });

        const result = await this.exportarService.ExportPdf(this.lstContrato, col, rows, "ReporteMensual.pdf", "l");
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
        this.lstLote = [];
        this.lstLote.push({ label: ConstanteAngular.COMBOTODOS, value: null });

      }
    }

    cargarCombosede(IdPersona: number): Promise<number> {
      this.lstSucursal = [];
      this.lstPrograma = [];
      this.filtroSede.SedEstado = 1;
      this.filtroSede.IdEmpresa = IdPersona;
      this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
        res.forEach((ele) => {
          this.lstSucursal.push({ label: ele.SedDescripcion.trim(), value: ele.IdSede, });
        });
        return 1;
      });
    }

    cargarComboPrograma(): Promise<number> {
      if (this.filtro.IdSede != null) {
        this.filtroPrograma.Estado = 1;
        this.filtroPrograma.IdSede = this.filtro.IdSede;
        this.lstPrograma = [];
        this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
        return this.programaService.listarPrograma(this.filtroPrograma).then((res) => {
          console.log("Combo Programa:", res);
          res.forEach((ele) => {
            this.lstPrograma.push({ label: ele.Nombre.trim(), value: ele.IdProyecto });
          });
          this.filtro.IdProyecto = null;
          return 1;
        });
      } else {
        this.lstPrograma = []
        this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
        this.lstManzana = [];
        this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });
        this.lstLote = [];
        this.lstLote.push({ label: ConstanteAngular.COMBOTODOS, value: null });

      }
    }

    selectedItemPrograma(event) {
      if (event.value != null) {
        this.cargarComboManzana(event.value);
      } else {
        this.lstManzana = [];
        this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });
        this.lstLote = [];
        this.lstLote.push({ label: ConstanteAngular.COMBOTODOS, value: null });

      }
    }
    cargarComboManzana(Id: number): Promise<number> {
      this.FiltroManzana.IdProyecto = Id;
      this.FiltroManzana.Estado = 1;
      this.lstManzana = [];
      console.log("FiltroManzana cargarComboManzana", this.FiltroManzana);
      this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      return this.manzanaService.listarManzana(this.FiltroManzana).then((res) => {
        console.log("listarManzana", res);
        res.forEach(ele => {
          this.lstManzana.push({ label: ele.Nombre.trim(), value: ele.IdManzana });
        });
        return 1;
      });
    }
    selectedItemManzana(event) {
      if (event.value != null) {
        this.cargarComboLote(event.value);
      }
      else {
        this.lstLote = [];
        this.lstLote.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      }
    }

    cargarComboLote(Id: number): Promise<number> {
      this.FiltroLote.IdProyecto = this.filtro.IdProyecto;
      this.FiltroLote.IdManzana = Id;
      this.FiltroLote.Estado = 1;
      this.lstLote = [];
      console.log("FiltroLote cargarComboLote", this.FiltroLote);
      this.lstLote.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      return this.loteService.listarLote(this.FiltroLote).then((res) => {

        sessionStorage.setItem('access_lstLote', JSON.stringify(res));
        res.forEach(ele => {

          //if (ele.Condicion == 3) {
          this.lstLote.push({ label: ele.Nombre.trim() + "-" + ele.DesCondicion, value: ele.IdLote });
          //}
        });
        console.log("lstLote", this.lstLote);
        return 1;
      });

    }
}

