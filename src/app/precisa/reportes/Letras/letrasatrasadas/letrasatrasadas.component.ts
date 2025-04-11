import { Component, OnInit, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { Maestro } from "../../../maestros/FormMaestro/model/maestro";
import { SelectItem, MessageService,  MenuItem } from 'primeng/api';
import { FiltroCompaniamast } from "../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { FiltroContrato } from "../../../ventas/Contrato/model/FiltroContrato";
import { FiltroWcoSede } from "../../../maestros/Sedes/dominio/filtro/FiltroWcoSede";
import { FiltroPrograma } from "../../../proyecto/Programa/model/FiltroPrograma";
import { FiltroManzana } from "../../../proyecto/Manzana/model/FiltroManzana";
import { FiltroControl } from "../../../ventas/Control/model/filtroControl";
import { DtoContrato } from "../../../ventas/Contrato/model/DtoContrato";
import { FiltroLote } from "../../../proyecto/Lotes/model/FiltroLote";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { ProgramaService } from "../../../proyecto/Programa/service/programa.service";
import { ContratoService } from "../../../ventas/Contrato/service/contrato.service";

import { MaestroSucursalService } from "../../../maestros/Sedes/servicio/maestro-sucursal.service";

import { ContratoMantenimientoComponent } from "../../../ventas/Contrato/contrato-mantenimiento/contrato-mantenimiento.component";
import { ExportarService } from "../../../framework-comun/Exportar/exportar.service";
import { IContrato } from "../../../ventas/Contrato/model/icontrato";



@Component({
  selector: 'ngx-letrasatrasadas',
  templateUrl: './letrasatrasadas.component.html'
})
export class LetrasatrasadasComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(Table, { static: false }) contratoMantenimientoComponent: ContratoMantenimientoComponent ;dataTableComponent: Table;
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
  lstLetra: any[] = [];
  ltsExportar: MenuItem[];
  maxDate: Date = new Date();
  minDateFin: Date = new Date();

  seleccion: DtoContrato = new DtoContrato();
  FiltroLote: FiltroLote = new FiltroLote();

  constructor(
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private programaService: ProgramaService,
    private messageService: MessageService,
    private contratoService: ContratoService,
    private maestroSucursalService: MaestroSucursalService,
    private exportarService: ExportarService,)
     {
      super();
     }


  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
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

    this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.lstLote.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    this.filtro.FechaCreacion = new Date();
    this.filtro.FechaCreacion.setMonth(new Date().getMonth() - 1);
    this.filtro.FechaModificacion = new Date();
  }

  coreMensaje(mensage: MensajeController): void {
    console.log("coreMensaje llegando:", mensage.componente);
    if (mensage.componente == "SELECTOR_CONTRATO") {
      this.coreBuscar();
    }
  }

  ngOnDestroy() {
    this.contratoMantenimientoComponent = undefined;
    this.dataTableComponent = undefined;
    this.usuarioAuth = undefined;
    this.dto = [];
    this.bloquearPag = undefined;
    this.lstCompania = [];
    this.lstEstados = [];
    this.lstSucursal = [];
    this.lstPrograma = [];
    this.lstManzana = [];
    this.FiltroCompan = undefined;
    this.filtro = undefined;
    this.filtroSede = undefined;
    this.filtroPrograma = undefined;
    this.FiltroManzana = undefined;
    this.lstLetra = [];
    this.ltsExportar = undefined;
    this.maxDate = undefined;
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

    this.contratoService.ReporteLetraAtrasadas(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach((element) => {
        element.num = contado++;
      //  filtroLote.IdLote = element.IdLote;

      });
      this.lstLetra = res;
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



    async exportExcel() {
      if (this.lstLetra == null || this.lstLetra == undefined || this.lstLetra.length == 0) {
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "Warning",
          detail: "Realice Busqueda primero",
        });
      } else {
        let listaExportar: IContrato[] = [];
        let contador: number = 0;
        let fechaInicial: string;
        let fechaPrimeraLetra: string;
        let fechaFinal: string;
        this.lstLetra.forEach(function (e) {
          contador += 1;
          if (e.FechaInicial != null || e.FechaInicial != undefined) {
            let fechaInicio = new Date(e.FechaInicial);
            let dd = ("0" + fechaInicio.getDate()).slice(-2);
            let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
            let yyyy = fechaInicio.getFullYear();

            fechaInicial = dd + "/" + mm + "/" + yyyy;
          } else {
            fechaInicial = '';
          }

          if (e.FechaPrimeraLetra != null || e.FechaPrimeraLetra != undefined) {
            let fechaPrLetra = new Date(e.FechaPrimeraLetra);
            let dd = ("0" + fechaPrLetra.getDate()).slice(-2);
            let mm = ("0" + (fechaPrLetra.getMonth() + 1)).slice(-2);
            let yyyy = fechaPrLetra.getFullYear();

            fechaPrimeraLetra = dd + "/" + mm + "/" + yyyy;
          } else {
            fechaPrimeraLetra = '';
          }

          //new Intl.NumberFormat().format(element.Diametro)
          let itemExportar: IContrato = {
            Nro: e.num,
            DOCUMENTO_CLIENTE: e.Documento,
            CLIENTE: e.Cliente?.toUpperCase() || '',
            DOCUMENTO_CONYUGE: e.DocumentoCony,
            CONYUGE: e.Conyuge?.toUpperCase() || '',
            COMPAÑIA: e.DescripcionCorta?.toUpperCase() || '',
            SUCURSAL: e.SedDescripcion?.toUpperCase() || '',
            PROGRAMA: e.NomProyecto?.toUpperCase() || '',
            MANZANA: e.NomManzana?.toUpperCase() || '',
            LOTE: e.lote?.toUpperCase() || '',
            AREA_M2: new Intl.NumberFormat().format(e.Area),
            PRECIO_M2: new Intl.NumberFormat().format(e.Valor),
            MONTO_TOTAL: new Intl.NumberFormat().format(e.Monto),
            TIPO_CAMBIO: new Intl.NumberFormat().format(e.TipoCambio),
            MONTO_SEPARACION: new Intl.NumberFormat().format(e.ValorSeparacion),
            TIPO_MONEDA: e.DesMoneda?.toUpperCase() || '',
            CUOTA_INICIAL: new Intl.NumberFormat().format(e.ValorCuotaInicial),
            NRO_CUOTA: Number(e.CantidadLetra).toString(),
            CUOTA_MENSUAL: new Intl.NumberFormat().format(e.ValorLetra),
            CUOTA_FINAL: new Intl.NumberFormat().format(e.ValorUltimaLetra),
            FECHA_INICIAL: fechaInicial,
            FECHA_PRIMERA_LETRA: fechaPrimeraLetra,
            //DIAS_GRACIA: e.DiasGracia,
            SALDO: new Intl.NumberFormat().format(e.Saldo),
            //RETENCION: new Intl.NumberFormat().format(e.Interes),
            TASA_MORA: new Intl.NumberFormat().format(e.TasaInteres),
            OBSERVACION: e.Descripcion?.toUpperCase() || '',
            DOCUMENTO_COMISIONISTA: e.DocumentoVen,
            COMISIONISTA: e.Vendedor?.toUpperCase() || '',
            // COMISION_TOTAL: e.ComisionPorcentaje,
            // COMISION_INICIAL: e.ComisionInicialPorcentaje,
            //MONTO_TOTAL: new Intl.NumberFormat().format(e.ComisionTotal)
          };
          listaExportar.push(itemExportar);
        });

        const result = await this.exportarService.exportExcel(this.lstLetra, listaExportar, "Letras_Atrasadas");
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
      if (this.lstLetra == null || this.lstLetra == undefined || this.lstLetra.length == 0) {
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
          "FECHA",
          "COMPAÑIA",
          "SUCURSAL",
          "PROGRAMA",
          "MANZANA",
          "LOTE",
          "CLIENTE",
          "AREA_M2",
          "PRECIO",
          "MONTO_TOTAL",
          "ESTADO"
        ]];
        var rows = [];
        let contador: number = 0;
        let fechaInicio: string;
        let fechaCese: string;
        this.lstLetra.forEach(function (e: DtoContrato) {
          contador += 1;
          if (e.FechaContrato != null || e.FechaContrato != undefined) {
            let FechaInicio = new Date(e.FechaContrato);
            let dd = ("0" + FechaInicio.getDate()).slice(-2);
            let mm = ("0" + (FechaInicio.getMonth() + 1)).slice(-2);
            let yyyy = FechaInicio.getFullYear()
            fechaInicio = dd + "/" + mm + "/" + yyyy;
          } else {
            fechaInicio = '';
          }

          let itemExportar = [
            contador,
            fechaInicio,
            e.DescripcionCorta?.toUpperCase() || '',
            e.SedDescripcion?.toUpperCase() || '',
            e.NomProyecto?.toUpperCase() || '',
            e.NomManzana?.toUpperCase() || '',
            e.lote?.toUpperCase() || '',
            e.Cliente?.toUpperCase() || '',
            new Intl.NumberFormat().format(e.Area),
            new Intl.NumberFormat().format(Number(e.Valor)),
            new Intl.NumberFormat().format(e.Monto),
            e.DesEstado?.toUpperCase() || ''

          ];
          rows.push(itemExportar);
        });

        const result = await this.exportarService.ExportPdf(this.lstLetra, col, rows, "Contratos.pdf", "l");
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

