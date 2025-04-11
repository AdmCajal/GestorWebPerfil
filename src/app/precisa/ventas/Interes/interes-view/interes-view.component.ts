import { InteresService } from './../service/interes.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Table } from 'primeng/table';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { InteresMantenimientoComponent } from '../interes-mantenimiento/interes-mantenimiento.component';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { FiltroContrato } from '../../Contrato/model/FiltroContrato';
import { FiltroWcoSede } from '../../../maestros/Sedes/dominio/filtro/FiltroWcoSede';
import { FiltroPrograma } from '../../../proyecto/Programa/model/FiltroPrograma';
import { FiltroManzana } from '../../../proyecto/Manzana/model/FiltroManzana';
import { ProgramaService } from '../../../proyecto/Programa/service/programa.service';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { ManzanaService } from '../../../proyecto/Manzana/service/manzana.service';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { DtoInteres } from '../model/Dtointeres';
import { InteresPagarComponent } from '../interes-pagar/interes-pagar.component';
import { ContratoService } from '../../Contrato/service/contrato.service';
import { DtoContrato } from '../../Contrato/model/DtoContrato';
import { iInteres } from '../model/iinteres';

@Component({
  selector: 'ngx-interes-view',
  templateUrl: './interes-view.component.html',
  styleUrls: ['./interes-view.component.scss']
})
export class InteresViewComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController, AfterViewInit {
  @ViewChild(InteresMantenimientoComponent, { static: false }) interesMantenimientoComponent: InteresMantenimientoComponent;
  @ViewChild(InteresPagarComponent, { static: false }) interesPagarComponent: InteresPagarComponent;

  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  lstintereses: any[] = [];
  bloquearPag: boolean;
  FlagAproInteres : number;
  seleccion: any;
  lstCompania: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstManzana: SelectItem[] = [];
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  filtro: DtoInteres = new DtoInteres();
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  filtroPrograma: FiltroPrograma = new FiltroPrograma();
  FiltroManzana: FiltroManzana = new FiltroManzana();
  ltsExportar: MenuItem[];
  dtoInteres: DtoInteres = new DtoInteres();
  isVer: boolean = true;
  constructor(
    private exportarService: ExportarService,
    private programaService: ProgramaService,
    private maestroSucursalService: MaestroSucursalService,
    private manzanaService: ManzanaService,
    private messageService: MessageService,
    private contratoService: ContratoService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private interesService: InteresService) {
    super();
  }

  ngAfterViewInit() {


    this.filtro.Estado = 1;
  }

  async ngOnInit() {

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
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() + 1;
    var anio = hoy.getFullYear();

    //asignar variables personalizadas
    this.FlagAproInteres = this.getUsuarioAuth().data[0]?.FlagAproInteres;

    this.filtro.FechaCreacion = await new Date(`${anio},${mes},${dia}`);
    this.filtro.FechaCreacion.setMonth(new Date().getMonth() - 1);
    this.filtro.FechaModificacion = await new Date(`${anio},${mes},${dia}`);
  }

  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "PAGAR_INTERES") {
      this.coreBuscar();
    }
    if (mensage.componente == "REFINANCIAR") {
      this.coreBuscar();
    }
  }

  coreNuevo(tipo?: string) {
    if (this.seleccion == null || this.seleccion == undefined) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "",
        detail: "Seleccione un Interes.",
      });
      return;
    }
    if (this.seleccion.Estado > 1) {
      this.message('warn', '', 'Seleccione solo interes PENDIENTE.');
      return;
    }

    this.interesMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_PROGRAMA', ''), tipo, this.objetoTitulo.menuSeguridad.titulo, this.seleccion);
    this.seleccion = undefined;
  }


  exportExcel() {
    if (this.lstintereses == null || this.lstintereses == undefined || this.lstintereses.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: iInteres[] = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstintereses.forEach(function (e: DtoInteres) {
        contador += 1;
        if (e.FechaCreacion != null || e.FechaCreacion != undefined) {
          let fechaInicio = new Date(e.FechaCreacion);
          let dd = ("0" + fechaInicio.getDate()).slice(-2);
          let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2); let yyyy = fechaInicio.getFullYear()
          fechaCreacion = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaCreacion = '';
        }
        let itemExportar: iInteres = {
          NUM: contador,
          FECHA: fechaCreacion,
          COMPAÑIA: e.DescripcionCorta?.toUpperCase() || '',
          SUCURSAL: e.SedDescripcion?.toUpperCase() || '',
          PROGRAMA: e.NomProyecto?.toUpperCase() || '',
          MANZANA: e.NomManzana?.toUpperCase() || '',
          LOTE: e.DesLote?.toUpperCase() || '',
          CLIENTE: e.Cliente?.toUpperCase() || '',
          MONTO_PAGO: new Intl.NumberFormat().format(e.MontoPago),
          DIAS_MORA: new Intl.NumberFormat().format(e.DiasMora),
          ESTADO: e.DesEstado?.toUpperCase() || ''
        };
        listaExportar.push(itemExportar);
      })
      /* let listaExportar: IReserva[] = [];
       let contador: number = 0;
       let fechaSeparacion: string;
       let fechaFinal: string;
       this.lstReserva.forEach(function (element) {
         contador += 1;
         let fechaInicio = new Date(element.FechaInicial);
         let dd=fechaInicio.getDate()<=9 ? "0"+fechaInicio.getDate():fechaInicio.getDate();
         let mm=fechaInicio.getMonth()==0  ? "01":fechaInicio.getMonth()<=9? "0"+fechaInicio.getMonth():fechaInicio.getMonth()+1;
         let yyyy=fechaInicio.getFullYear()
         fechaSeparacion =dd +"/" + mm + "/" +yyyy;

         let fechaFin = new Date(element.FechaFinal);
         dd=fechaFin.getDate()<=9 ? "0"+fechaFin.getDate():fechaFin.getDate();
         mm=fechaFin.getMonth()==0  ? "01":fechaFin.getMonth()<=9? "0"+fechaFin.getMonth():fechaFin.getMonth()+1;
         yyyy=fechaFin.getFullYear()
         fechaFinal =dd +"/" + mm + "/" +yyyy;

         let manzanaExportar: IReserva = {
           Nro: element.num,
           Fecha_Separación: fechaSeparacion,
           Compañia: element.DescripcionCorta,
           Sucursal: element.SedDescripcion,
           Programa: element.NomProyecto,
           Manzana: element.NomManzana,
           Lote: element.desLote,
           Cliente: element.Cliente,
           Promotor: element.Vendedor,
           Area_M2:  new Intl.NumberFormat().format(element.Diametro),
           Costo_Total:  new Intl.NumberFormat().format(element.CostoTotal),
           Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
           Moneda: element.DesMoneda,
           Tipo_Pago: element.desTipoPago,
           Banco: element.desBanco,
           Referencia: element.Descripcion,
           Observacion: element.Observacion,
           Fecha_Fin: fechaFinal,
           E_Lote: element.DesCondicion,
         };
         listaExportar.push(manzanaExportar);
       });
       this.exportarService.exportExcel(this.lstContrato, listaExportar, "reserva de lotes");
       */
      this.exportarService.exportExcel(this.lstintereses, listaExportar, "INTERESES")
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });
    }
  }


  exportPdf() {
    if (this.lstintereses == null || this.lstintereses == undefined || this.lstintereses.length == 0) {
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
        "MONTO_PAGO",
        "DIAS_MORA",
        "ESTADO"

      ]]
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstintereses.forEach(function (e: DtoInteres) {
        contador += 1;

        if (e.FechaCreacion != null || e.FechaCreacion != undefined) {
          let fechaInicio = new Date(e.FechaCreacion);
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
          new Intl.NumberFormat().format(e.MontoPago),
          new Intl.NumberFormat().format(e.DiasMora),
          e.DesEstado.toString(),
        ];
        rows.push(itemExportar);
      }
      );
      /* var col = [["Nro ","Fecha ","Promotor  ", "Compañia  ", "Sucursal  ", "Programa", "Area M2", "Precio por M2 ","Monto Total", "Tipo de Moneda", "Cuotas", "Monto Inicial","Ubigeo", "Estado"]];
       var rows = [];
       let contador: number = 0;
       let fecha: string;
       this.lstProgramatb.forEach(function (element) {
         contador += 1;
         let fechaRegistro = new Date(element.FechaRegistro);
         let dd=fechaRegistro.getDate()<=9 ? "0"+fechaRegistro.getDate():fechaRegistro.getDate();
         let mm=fechaRegistro.getMonth()==0  ? "01":fechaRegistro.getMonth()<=9? "0"+fechaRegistro.getMonth():fechaRegistro.getMonth()+1;
         let yyyy=fechaRegistro.getFullYear()
         fecha =dd +"/" + mm + "/" +yyyy;

         let manzanaExportar = [contador,fecha, element.NombreCompleto,
           element.DescripcionCorta, element.SedDescripcion, element.Nombre,
           element.Area, String(element.Precio.toFixed(2)), String(element.MontoTotal.toFixed(2)),
           element.DesMoneda, element.TotalCuota,
           String(element.MontoInicial.toFixed(2)),element.ubigeodesc,
           element.Estado == 1 ? "Activo" : "Inactivo"
         ];
         rows.push(manzanaExportar);
       });]*/

      // this.exportarService.ExportPdf(this.lstProgramatb, col, rows, "Programa.pdf","p");
      this.exportarService.ExportPdf(this.lstintereses, col, rows, "INTERES.pdf", "l")
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }
  }

  async coreBuscar() {

    this.bloquearPag = true;
    if (this.filtro.CompaniaCodigo == null) {
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
      this.filtro.IdManzana = null;
    }
    console.log("Lote coreBuscar:", this.filtro);
    //asignar fecha final por defecto si esta llega a ser null
    this.filtro.FechaModificacion = this.filtro.FechaModificacion == null ? new Date() : this.filtro.FechaModificacion;

    this.bloquearPag = true;
    this.interesService.ListarInteres(this.filtro).then(async resp => {
      var contado = 1;
      resp.forEach(async (element) => {
        element.num = await contado++;
        if (element.Estado == 2) {
          this.isVer = false;
        }
      });
      this.lstintereses = await resp;
      this.bloquearPag = false;
    });
    console.log("coreBuscar lstintereses ", this.lstintereses);
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
  async coreVer(dto) {
    this.bloquearPag=true;
    if (dto.Estado == 1) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Advertencia",
        detail: "Seleccione un interes pagado",
      });
      this.bloquearPag=false;
      return;
    }
    if (dto.IdComprobante == null) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Advertencia",
        detail: "Este interes no cuenta con comprobante",
      });
      this.bloquearPag=false;
      return;
    }
    let contrato: DtoContrato = new DtoContrato();
    this.bloquearPag=false;
    await this.interesPagarComponent.coreIniciarComponente(new MensajeController(this, "PAGAR_INTERES", ""), 'VER', contrato, [dto]);
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

  async listarComboEstados() {
    this.lstEstados.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.filtro.Estado = 1;
    this.getMiscelaneos()
      .filter((x) => x.CodigoTabla == "ESTINT")
      .forEach(async (i) => {
        this.filtro.Estado = 1;
        this.lstEstados.push({ label: await i.Nombre.toUpperCase(), value: await i.Codigo });
      });
    console.log("this.lstEstados", this.lstEstados);
    console.log("this.filtro.Estado", this.filtro);
    this.filtro.Estado = 1;
  }

  async cargarCombocompania() {
    this.lstCompania = [];
    this.lstSucursal = [];
    this.lstPrograma = [];
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    const respCompania: any[] = await this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan);
    console.log("listarCompaniaMast", respCompania);
    respCompania.forEach((ele) => {
      //  this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
      this.lstCompania.push({
        label: ele.DescripcionCorta.trim(),
        value: ele.CompaniaCodigo.trim(),
        title: ele.Persona,
      });
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
    }
  }

  async cargarCombosede(IdPersona: number) {
    this.lstSucursal = [];
    this.lstPrograma = [];
    this.filtroSede.SedEstado = 1;
    this.filtroSede.IdEmpresa = IdPersona;
    this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    const respSucursal = await this.maestroSucursalService.ListaSede(this.filtroSede);
    console.log("ListaSede", respSucursal);
    respSucursal.forEach((ele) => {
      this.lstSucursal.push({
        label: ele.SedDescripcion.trim(),
        value: ele.IdSede,
      });
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
      this.filtro.IdProyecto = null;

    }
  }

  // selectedItemPrograma(event) {
  //   console.log("event selectedItemPrograma", event);
  //   this.filtro.IdProyecto = event.value;
  //   this.cargarComboManzana(this.filtro.IdProyecto);
  // }
  selectedItemPrograma(event) {
    if (event.value != null) {
      this.cargarComboManzana(event.value);
    } else {



    }
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

  message(tipo: string, titulo: string, msg: string) {
    this.messageService.add({
      key: "bc",
      severity: tipo,
      summary: titulo,
      detail: msg,
    });
  }
}
