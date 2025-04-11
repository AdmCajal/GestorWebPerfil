import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { Table } from 'primeng/table';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { ReservaMantenimientoComponent } from '../reserva-mantenimiento/reserva-mantenimiento.component';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { SelectItem, ConfirmationService, MessageService, MenuItem } from "primeng/api";
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { FiltroWcoSede } from '../../../maestros/Sedes/dominio/filtro/FiltroWcoSede';
import { FiltroLote } from '../../../proyecto/Lotes/model/FiltroLote';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { FiltroPrograma } from '../../../proyecto/Programa/model/FiltroPrograma';
import { ProgramaService } from '../../../proyecto/Programa/service/programa.service';
import { FiltroManzana } from '../../../proyecto/Manzana/model/FiltroManzana';
import { ManzanaService } from '../../../proyecto/Manzana/service/manzana.service';
import { ReservaService } from '../service/reserva.service';
import { DtoReserva } from '../model/DtoReserva';
import { FiltroReserva } from '../model/FiltroReserva';
import { IReserva } from '../model/IReserva';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { LoteService } from '../../../proyecto/Lotes/service/lotes.service';
import { ReservaImprimirComponent } from '../reserva-imprimir/reserva-imprimir.component';
import { ReservaPagarComponent } from '../reserva-pagar/reserva-pagar.component';
import Swal from 'sweetalert2';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { DtoLote } from '../../../proyecto/Lotes/model/DtoLote';

@Component({
  selector: 'ngx-reserva-view',
  templateUrl: './reserva-view.component.html',
  styleUrls: ['./reserva-view.component.scss']
})
export class ReservaViewComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(ReservaMantenimientoComponent, { static: false }) reservaMantenimientoComponent: ReservaMantenimientoComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  @ViewChild(ReservaImprimirComponent, { static: false }) reservaImprimirComponent: ReservaImprimirComponent;
  @ViewChild(ReservaPagarComponent, { static: false }) reservaPagarComponent: ReservaPagarComponent;

  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: Maestro[] = [];
  bloquearPag: boolean;
  filtroPrograma: FiltroPrograma = new FiltroPrograma();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  FiltroManzana: FiltroManzana = new FiltroManzana();
  filtro: FiltroReserva = new FiltroReserva();
  FiltroLote: FiltroLote = new FiltroLote();
  lstSeleccionadomultiple: any = {};
  lstCompania: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstManzana: SelectItem[] = [];
  lstTipoPago: SelectItem[] = [];
  lstLote: SelectItem[] = [];
  lstEstadoLote: SelectItem[] = [];
  lstEstadoSeparacion: SelectItem[] = [];
  lstReserva: DtoReserva[] = [];
  ltsExportar: MenuItem[];
  loteseleccionado: DtoLote;
  maxDate: Date = new Date();
  minDateFin: Date = new Date();
  seleccion: any;
  lstSeparacionLote: any[] = [];
  constructor(
    private exportarService: ExportarService,
    private programaService: ProgramaService,
    private manzanaService: ManzanaService,
    private loteService: LoteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private maestroSucursalService: MaestroSucursalService,
    private reservaService: ReservaService
  ) {
    super();

    this.maxDate.setFullYear(this.maxDate.getFullYear());
    this.minDateFin.setDate(this.minDateFin.getDate() + 1);

  }


  ngOnInit(): void {
    const p1 = this.tituloListadoAsignar(1, this);
    const p2 = this.iniciarComponent();
    const p3 = this.cargarCombocompania();
    console.log("Listado ngOnInit : cargarCombocompania");
    const p4 = this.cargarComboEstadoLote();
    const p5 = this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    const p6 = this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    const p7 = this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    const p20 = this.lstLote.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    const p8 = this.cargarComboEstadoSeparacion();

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
    Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p20]).then((f) => {
      this.bloquearPag = false;
      this.cargarFormaPago();
    });

    this.filtro.FechaInicial = new Date();
    this.filtro.FechaInicial.setMonth(new Date().getMonth() - 1);
    this.filtro.FechaFinal = new Date();
  }
  coreMensaje(mensage: MensajeController): void {
    console.log("coreMensaje llegando:", mensage.componente);
    if (mensage.componente == "SELECTOR_RESERVA") {
      this.coreBuscar();
    }

  }
  coreNuevo(): void {
    this.reservaMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_RESERVA', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }
  coreEditar(row) {
    this.reservaMantenimientoComponent.iniciarComponenteMaestro(
      new MensajeController(this, "SELECTOR_RESERVA", ""), "EDITAR",
      this.objetoTitulo.menuSeguridad.titulo, row);
  }

  coreVer(row) {
    this.reservaMantenimientoComponent.iniciarComponenteMaestro(
      new MensajeController(this, "SELECTOR_RESERVA", ""), "VER",
      this.objetoTitulo.menuSeguridad.titulo, row);
  }



  coreinactivar(row) {
    if (row.Estado == 3) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "La Separación ya se encuentra Anulada.",
      });
      return;
    }
    if (row.Estado > 3) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "La Separación debe ser PENDIENTE para anular.",
      });
      return;
    }
    console.log("coreinactivar Reserva:", row);
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro? ",
      key: "confirm2",
      accept: () => {
        row.Estado = 3; //rest por tipo 3 no funciona
        this.reservaService.mantenimientoReserva(3, row, this.getUsuarioToken())
          .then((res) => {
            if (res.success) {

              const p1 = this.getLote(row.IdProyecto, row.IdManzana, row.IdLote);

              Promise.all([p1]).then((f) => {
                this.loteseleccionado.Condicion = 1
                this.loteService.mantenimientoLote(2, this.loteseleccionado, this.getUsuarioToken()).then(
                  resp => {
                    if (resp.success == true) {
                      this.messageService.add({
                        key: "bc",
                        severity: "success",
                        summary: "Success",
                        detail: "Anulación con éxito.",
                      });

                      this.coreBuscar();
                    }
                  });
              });

            }
            else {
              this.messageService.add({
                key: "bc",
                severity: "danger",
                summary: "Error",
                detail: "No se puedo Anular, intentelo de nuevo...",
              });
            }
          });
      },
    });
  }
  exportExcel() {
    if (this.lstReserva == null || this.lstReserva == undefined || this.lstReserva.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: IReserva[] = [];
      let contador: number = 0;
      let fechaInicial: string;
      let fechaFinal: string;
      this.lstReserva.forEach(function (element) {
        contador += 1;
        let fechaInicio = new Date(element.FechaInicial);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
        let yyyy = fechaInicio.getFullYear()
        fechaInicial = dd + "/" + mm + "/" + yyyy;

        let fechaFin = new Date(element.FechaFinal);
        dd = ("0" + fechaFin.getDate()).slice(-2);
        mm = ("0" + (fechaFin.getMonth() + 1)).slice(-2);
        yyyy = fechaFin.getFullYear()
        fechaFinal = dd + "/" + mm + "/" + yyyy;

        let manzanaExportar: IReserva = {
          NRO: element.num,
          DOCUMENTO_CLIENTE: element.Documento,
          CLIENTE: element.Cliente?.toUpperCase() || '',
          DOCUMENTO_PROMOTOR: element.DocumentoVen,
          PROMOTOR: element.Vendedor?.toUpperCase() || '',
          COMPAÑIA: element.DescripcionCorta?.toUpperCase() || '',
          SUCURSAL: element.SedDescripcion?.toUpperCase() || '',
          PROGRAMA: element.NomProyecto?.toUpperCase() || '',
          MANZANA: element.NomManzana?.toUpperCase() || '',
          LOTE: element.Lote?.toLocaleUpperCase() || '',
          FECHA_INICIO: fechaInicial,
          AREA_M2: new Intl.NumberFormat().format(element.Diametro),
          PRECIO: new Intl.NumberFormat().format(element.Valor),
          MONTO_TOTAL: new Intl.NumberFormat().format(element.CostoTotal),
          OBSERVACION: element.Observacion?.toUpperCase() || '',

          CUENTABANCARIA: element.NomCuentaBancaria,
          TIPO_PAGO: element.TipoPago?.toUpperCase() || '',
          BANCO: element.NomBanco?.toUpperCase() || '',
          MONEDA: element.DesMoneda?.toUpperCase() || '',
          REFERENCIA: element.Descripcion?.toUpperCase() || '',
          MONTO_SEPARACION: new Intl.NumberFormat().format(element.ValorSeparacion),
          FECHA_FIN: fechaFinal,
          ESTADO_RESERVA: element.DesEstado?.toUpperCase() || ''
        };
        listaExportar.push(manzanaExportar);
      });
      this.exportarService.exportExcel(this.lstReserva, listaExportar, "reserva de lotes");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });
    }
  }


  exportPdf() {
    if (this.lstReserva == null || this.lstReserva == undefined || this.lstReserva.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      var col = [["NRO", "FECHA", "COMPAÑIA", "SUCURSAL", "PROGRAMA", "MANZANA", "LOTE", "CLIENTE",
        "AREA M2",
        "PRECIO",
        "M.TOTAL", "M.SEPARACION", "TIPO PAGO", "E.RESERVA"]]
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      let fechaInicial: string;
      let fechaFinal: string;
      this.lstReserva.forEach(function (element) {
        contador += 1;
        let fechaInicio = new Date(element.FechaInicial);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2); let yyyy = fechaInicio.getFullYear()
        fechaInicial = dd + "/" + mm + "/" + yyyy;

        let fechaFin = new Date(element.FechaFinal);
        dd = ("0" + fechaFin.getDate()).slice(-2);
        mm = ("0" + (fechaFin.getMonth() + 1)).slice(-2);
        yyyy = fechaFin.getFullYear()
        fechaFinal = dd + "/" + mm + "/" + yyyy;

        let itemExportar = [
          contador,
          fechaInicial,
          element.DescripcionCorta?.toUpperCase() || '',
          element.SedDescripcion?.toUpperCase() || '',
          element.NomProyecto?.toUpperCase() || '',
          element.NomManzana?.toUpperCase() || '',
          element.Lote?.toUpperCase() || '',
          element.Cliente?.toUpperCase() || '',
          new Intl.NumberFormat().format(element.Diametro),
          new Intl.NumberFormat().format(element.Valor),
          new Intl.NumberFormat().format(element.CostoTotal),
          new Intl.NumberFormat().format(element.ValorSeparacion),
          element.NomTipoPago?.toUpperCase() || '',
          element.DesEstado?.toUpperCase() || ''
        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lstReserva, col, rows, "SEPARACION_LOTES.pdf", "l")
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
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }
  }
  cargarFormaPago() {
    this.lstTipoPago = [];
    this.lstTipoPago.push({ label: '', value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "FORMAPAGO").forEach(i => {
      this.lstTipoPago.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });
    console.log("TIPO DE PAGO", this.lstTipoPago);
  }

  coreBuscar(): void {
    this.lstSeleccionadomultiple = {};
    this.bloquearPag = true;
    console.log("Lote coreBuscar:", this.filtro);
    if (this.filtro.CompaniaCodigo == null) {
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
      this.filtro.IdManzana = null;
      this.filtro.IdLote = null;
    }

    //asignar fecha final por defecto si esta llega a ser null
    this.filtro.FechaFinal = this.filtro.FechaFinal == null ? new Date() : this.filtro.FechaFinal;

    // this.filtro.FechaInicial = new Date();
    // this.filtro.FechaInicial.setDate(this.filtro.FechaInicial.getDate() - 15);
    // this.filtro.FechaFinal = new Date();
    this.reservaService.listarReserva(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      console.log("RESERVAS", res);

      res.forEach((element) => {
        element.num = contado++;
        element.DesMoneda = element.MonedaCodigo == "EX" ? "DOLARES" : "LOCAL";

        // this.lstTipoPago.forEach(tp => {
        //   if (element.TipoPago == tp.value) { element.TipoPago = tp.label }
        // });
      });
      this.lstReserva = res;

      console.log("maestro LOTE listado:", res);
    });
  }

  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }

  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreImprimir(row: any): void {
    if (this.lstSeleccionadomultiple.length <= 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Advertencia",
        detail: "Realizar busqueda y seleccionar separación.",
      });
      return;
    }
    if (this.lstSeleccionadomultiple.length > 1) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Advertencia",
        detail: "Seleccionar una sola separacion.",
      });
      return;
    }
    if (this.lstSeleccionadomultiple.Estado == 1 || this.lstSeleccionadomultiple.Estado == 3 || this.lstSeleccionadomultiple.Estado == 4) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Advertencia",
        detail: "La reserva no fue pagada",
      });
      return;
    }

    this.reservaImprimirComponent.coreIniciarComponente(
      new MensajeController(this, "", ""), "", "IMPRIMIR", this.lstSeleccionadomultiple);
  }
  corePagar(row: any): void {
    console.log("lstSeleccionadomultiple", this.lstSeleccionadomultiple);

    if (this.lstSeleccionadomultiple.length <= 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Advertencia",
        detail: "Realizar busqueda y seleccionar separación.",
      });
      return;
    }


    if (this.lstSeleccionadomultiple.length > 1) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Advertencia",
        detail: "Seleccionar una sola separacion.",
      });
      return;
    }
    if (this.lstSeleccionadomultiple.Estado != 1) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Advertencia",
        detail: "Seleccionar una separacion con estado PENDIENTE.",
      });
      return;
    }

    let lote: string = this.lstSeleccionadomultiple.Lote;
    let montoSeparacion: number = this.lstSeleccionadomultiple.ValorSeparacion;
    Swal.fire({
      title: '¡Importante!',
      text: `¿Seguro que desea pagar la reserva del lote: ${lote}?
              \n Monto: ${new Intl.NumberFormat().format(montoSeparacion)}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#094d74',
      cancelButtonColor: '#ffc72f',
      cancelButtonText: 'No, Cancelar',
      confirmButtonText: 'Si, Pagar'
    }).then((result) => {
      if (result.isConfirmed) {
        let isreserva: boolean = false;

        //servicio de lote

        //servicio de lote
        const p1 = this.getLote(this.lstSeleccionadomultiple.IdProyecto, this.lstSeleccionadomultiple.IdManzana, this.lstSeleccionadomultiple.IdLote);

        Promise.all([p1]).then((f) => {
          this.loteseleccionado.Condicion = 2;
          this.loteService.mantenimientoLote(2, this.loteseleccionado, this.getUsuarioToken()).then((res) => {
            if (res.success == true) {
              isreserva = true;
              this.lstSeleccionadomultiple.Estado = 2;
              this.reservaService.mantenimientoReserva(2, this.lstSeleccionadomultiple, this.getUsuarioToken()).then((resp) => {
                if (resp.success == true) {
                  this.messageService.add({
                    key: "bc",
                    severity: "success",
                    summary: "success",
                    detail: "Pago realizado.",
                  });
                  this.lstSeleccionadomultiple = {};
                  this.filtro = new FiltroReserva();
                  this.coreBuscar();
                }
              });
            }
          });
        });

        //servicio de reserva

      }
    })
    //this.reservaPagarComponent.coreIniciarComponente(
    //  new MensajeController(this, "", ""), "", "PAGAR", row);
  }
  getLote(IdProyecto: any, IdManzana: any, idLote: any) {

    this.FiltroLote.IdProyecto = IdProyecto;
    this.FiltroLote.IdManzana = IdManzana;
    this.FiltroLote.Estado = 1;
    return this.loteService.listarLote(this.FiltroLote).then((res) => {
      res.forEach(ele => {
        if (ele.IdLote == idLote) {
          this.loteseleccionado = ele;

          console.log(this.loteseleccionado);

        }
      });
    });



  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  cargarCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
      console.log("listarCompaniaMast", res);
      res.forEach(ele => {
        //  this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
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

  cargarComboEstadoLote() {
    this.lstEstadoLote = [];
    this.lstEstadoLote.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLOT").forEach(i => {
      this.lstEstadoLote.push({ label: i.Nombre, value: i.IdCodigo })
    });
  }
  cargarComboEstadoSeparacion() {
    this.lstEstadoSeparacion = [];
    this.lstEstadoSeparacion.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTRESER").forEach(i => {
      console.log("ESTADO RESERVA", i);

      this.lstEstadoSeparacion.push({ label: i.Nombre, value: i.IdCodigo })
    });
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

        //if (ele.Condicion != 1 && ele.Condicion != 3) {
        this.lstLote.push({ label: ele.Nombre.trim() + "-" + ele.DesCondicion, value: ele.IdLote });
        //}
      });
      console.log("lstLote", this.lstLote);
      return 1;
    });

  }



}
