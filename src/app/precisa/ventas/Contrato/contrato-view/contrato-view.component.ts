import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { Table } from 'primeng/table';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { ContratoMantenimientoComponent } from '../contrato-mantenimiento/contrato-mantenimiento.component';
import { SelectItem, MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { FiltroContrato } from '../model/FiltroContrato';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { FiltroWcoSede } from '../../../maestros/Sedes/dominio/filtro/FiltroWcoSede';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { FiltroPrograma } from '../../../proyecto/Programa/model/FiltroPrograma';
import { ProgramaService } from '../../../proyecto/Programa/service/programa.service';
import { FiltroManzana } from '../../../proyecto/Manzana/model/FiltroManzana';
import { ManzanaService } from '../../../proyecto/Manzana/service/manzana.service';
import { ContratoService } from '../service/contrato.service';
import { DtoContrato } from '../model/DtoContrato';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { ControlService } from '../../Control/service/control.service';
import { FiltroControl } from '../../Control/model/filtroControl';
import { IContrato } from '../model/icontrato';
import { DtoClassContrato } from '../model/DtoClassContrato';
import { FiltroLote } from '../../../proyecto/Lotes/model/FiltroLote';
import { LoteService } from '../../../proyecto/Lotes/service/lotes.service';

@Component({
  selector: 'ngx-contrato-view',
  templateUrl: './contrato-view.component.html',
  styleUrls: ['./contrato-view.component.scss']
})
export class ContratoViewComponent extends ComponenteBasePrincipal implements UIMantenimientoController {
  @ViewChild(ContratoMantenimientoComponent, { static: false }) contratoMantenimientoComponent: ContratoMantenimientoComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: Maestro[] = [];
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
  FiltroLetra: FiltroControl = new FiltroControl();
  seleccion: DtoContrato = new DtoContrato();
  FiltroLote: FiltroLote = new FiltroLote();

  flatAprob: number;

  constructor(private exportarService: ExportarService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private programaService: ProgramaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private contratoService: ContratoService,
    private loteService: LoteService,
    private maestroSucursalService: MaestroSucursalService,
    private manzanaService: ManzanaService,
    private ControlService: ControlService,) {
    super();
    this.maxDate.setFullYear(this.maxDate.getFullYear());
    this.minDateFin.setDate(this.minDateFin.getDate() + 1);
  }


  ngAfterContentInit(): void {
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
    this.lstLote.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    this.filtro.FechaInicial = new Date();
    this.filtro.FechaInicial.setMonth(new Date().getMonth() - 1);
    this.filtro.FechaModificacion = new Date();
    this.flatAprob = this.getUsuarioAuth().data[0]?.FlagAproLetra;
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
    this.lstContrato = [];
    this.ltsExportar = undefined;
    this.maxDate = undefined;
    this.FiltroLetra = undefined;
  }

  coreMensaje(mensage: MensajeController): void {
    console.log("coreMensaje llegando:", mensage.componente);
    if (mensage.componente == "SELECTOR_CONTRATO") {
      this.coreBuscar();
    }
  }

  async coreBuscar() {
    const filtroLote = new FiltroLote();
    this.bloquearPag = true;
    console.log("Lote coreBuscar:", this.filtro);
    if (this.filtro.CompaniaCodigo == null) {
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
      this.filtro.IdManzana = null;
    }

    //asignar fecha final por defecto si esta llega a ser null
    this.filtro.FechaModificacion = this.filtro.FechaModificacion == null ? new Date() : this.filtro.FechaModificacion;

    this.contratoService.ListarContrato(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = res.length;
      res.forEach((element) => {
        element.num = contado--;
        element.flatAprob =  this.flatAprob;
        filtroLote.IdLote = element.IdLote;
       });
      this.lstContrato = res;
      console.log("maestro CONTRATO listado:", res);
    });
  }

  async exportExcel() {
    if (this.lstContrato == null || this.lstContrato == undefined || this.lstContrato.length == 0) {
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
      this.lstContrato.forEach(function (e) {
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

        e.saldo=e.Monto-e.ValorCuotaInicial;

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
          // COSTO_TOTAL: new Intl.NumberFormat().format(e.Monto),
          TIPO_CAMBIO: new Intl.NumberFormat().format(e.TipoCambio),
          MONTO_SEPARACION: new Intl.NumberFormat().format(e.ValorSeparacion),
          TIPO_MONEDA: e.DesMoneda?.toUpperCase() || '',
          CUOTA_INICIAL: new Intl.NumberFormat().format(e.ValorCuotaInicial),
          NRO_CUOTA: Number(e.CantidadLetra).toString(),
          CUOTA_MENSUAL: new Intl.NumberFormat().format(e.ValorLetra),
          CUOTA_FINAL: new Intl.NumberFormat().format(e.ValorUltimaLetra),
          FECHA_PRIMERA_LETRA: fechaPrimeraLetra,
          FECHA_INICIAL: fechaInicial,
          SALDO: new Intl.NumberFormat().format(e.saldo),
          // DIAS_GRACIA: e.DiasGracia,
          // RETENCION: new Intl.NumberFormat().format(e.Interes),
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

      const result = await this.exportarService.exportExcel(this.lstContrato, listaExportar, "Contratos");
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
        "FECHA",
        "COMPAÑIA",
        "SUCURSAL",
        "PROGRAMA",
        "MANZANA",
        "LOTE",
        "CLIENTE",
        "AREA_M2",
        "PRECIO_M2",
        "MONTO_TOTAL",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaInicio: string;
      let fechaCese: string;
      this.lstContrato.forEach(function (e: DtoContrato) {
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

      const result = await this.exportarService.ExportPdf(this.lstContrato, col, rows, "Contratos.pdf", "l");
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

  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }

  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  listarComboEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTCON").forEach(i => {
      this.lstEstados.push({ label: i.Nombre, value: i.IdCodigo })
    });
  }

  cargarCombocompania(): Promise<number> {
    this.flatAprob = this.getUsuarioAuth().data[0]?.FlagAproContrato;
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
      this.filtro.IdProyecto = null;

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

  coreNuevo(): void {
    this.contratoMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_CONTRATO', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }

  async coreEditar(row) {
    if (row.Estado == 4) {
      this.message('warn', 'Advertencia', 'Este contrato está anulado.');
      return;
    }
    if (row.Estado == 5) {
      this.message('warn', 'Advertencia', 'Este contrato está Judicializado.');
      return;
    }
    this.FiltroLetra.Estado = 2;
    this.FiltroLetra.IdContrato = row.IdContrato;
    const data: any[] = await this.ControlService.ListarLetra(this.FiltroLetra);
    if (data.length > 0) {
      this.message('warn', 'Advertencia', 'Este contrato contiene pagos realizados.');
      return;
    }

    this.contratoMantenimientoComponent.iniciarComponenteMaestro(
      new MensajeController(this, 'SELECTOR_CONTRATO', ''), "EDITAR",
      this.objetoTitulo.menuSeguridad.titulo, row);
  }

  message(tipo: string, titulo: string, msg: string) {
    this.messageService.add({
      key: "bc",
      severity: tipo,
      summary: titulo,
      detail: msg,
    });
  }

  coreVer(row) {
    this.contratoMantenimientoComponent.iniciarComponenteMaestro(
      new MensajeController(this, "SELECTOR_CONTRATO", ""),
      "VER",
      this.objetoTitulo.menuSeguridad.titulo,
      row
    );
  }

  coreJudicial(row) {

    if (row.Estado == 4) {
      this.message('warn', 'Advertencia', 'Este contrato está anulado.');
      return;
    }

    console.log(row);
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea Judicializar este Contrato ? ",
      key: "confirm2",
      accept: async () => {
        this.bloquearPag = true;
        let dtoActualizar: DtoClassContrato = new DtoClassContrato();
        dtoActualizar.Contrato = row;
        dtoActualizar.Contrato.Estado = 5;
        dtoActualizar.Contrato.FechaModificacion = new Date();
        dtoActualizar.Contrato.UsuarioModificacion = this.getUsuarioAuth().data[0].NombreCompleto;
        console.log("row", row);
        const _respAnular = await this.contratoService.MantenimientoContrato(3, dtoActualizar, this.getUsuarioToken());
        console.log(_respAnular);
        if (_respAnular != null) {
          this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Anulado con éxito. y se ha liberado el Lote :' + row.lote });
          this.coreBuscar();
          this.bloquearPag = true;
        }
      }
    })
  }


  async coreinactivar(row) {
    if (row.Estado == 5) {
      this.message('warn', 'Advertencia', 'Este contrato está Judicializado.');
      return;
    }
    if (row.Estado == 4) {
      this.message('warn', 'Advertencia', 'Este contrato está anulado.');
      return;
    }

    console.log(row);
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea Anular este Contrato ? ",
      key: "confirm2",
      accept: async () => {
        this.bloquearPag = true;
        let dtoActualizar: DtoClassContrato = new DtoClassContrato();
        dtoActualizar.Contrato = row;
        dtoActualizar.Contrato.Estado = 4;
        dtoActualizar.Contrato.FechaModificacion = new Date();
        dtoActualizar.Contrato.UsuarioModificacion = this.getUsuarioAuth().data[0].NombreCompleto;
        console.log("row", row);

        const _respAnular = await this.contratoService.MantenimientoContrato(3, dtoActualizar, this.getUsuarioToken());
        console.log(_respAnular);


        if (_respAnular != null) {
          this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Anulado con éxito. y se ha liberado el Lote :' + row.lote });
          this.coreBuscar();
          this.bloquearPag = true;
        }



      }


    })
  }
}

