import { IPrograma } from "./../model/IPrograma";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { Maestro } from "../../../maestros/FormMaestro/model/maestro";
import { Table } from "primeng/table";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { ProgramaMantenimientoComponent } from "../programa-mantenimiento/programa-mantenimiento.component";
import { FiltroCompaniamast } from "../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { FiltroWcoSede } from "../../../maestros/Sedes/dominio/filtro/FiltroWcoSede";
import {
  SelectItem,
  MessageService,
  ConfirmationService,
  MenuItem,
} from "primeng/api";
import { MaestroSucursalService } from "../../../maestros/Sedes/servicio/maestro-sucursal.service";
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { FiltroPrograma } from "../model/FiltroPrograma";
import { ProgramaService } from "../service/programa.service";
import jsPDF from "jspdf";
import { jsPDFCustom } from "../../Lotes/model/ILote";
import { DtoPrograma } from "../model/DtoPrograma";
import { ExportarService } from "../../../framework-comun/Exportar/exportar.service";
import { Image } from "../../../seguridad/companias/dominio/dto/image";
import { LotesImagenComponent } from "../../Lotes/lotes-imagen/lotes-imagen.component";

@Component({
  selector: "ngx-programa-view",
  templateUrl: "./programa-view.component.html",
  styleUrls: ["./programa-view.component.scss"],
})
export class ProgramaViewComponent
  extends ComponenteBasePrincipal
  implements OnInit, UIMantenimientoController {
  @ViewChild(ProgramaMantenimientoComponent, { static: false })
  programaMantenimientoComponent: ProgramaMantenimientoComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  @ViewChild(LotesImagenComponent, { static: false })
  lotesImagenComponent: LotesImagenComponent;

  // @ViewChild(ProgramaImagenComponent, { static: false })
  // programaImagenComponent: ProgramaImagenComponent;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  dto: Maestro[] = [];
  bloquearPag: boolean;
  lstCompania: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  ltsExportar: MenuItem[];
  lstSeleccionadomultiple: any[] = [];
  filtro: FiltroPrograma = new FiltroPrograma();
  lstProgramatb: DtoPrograma[] = [];
  maxDate: Date = new Date();
  constructor(
    private exportarService: ExportarService,
    private maestroSucursalService: MaestroSucursalService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private programaService: ProgramaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    super();
    this.maxDate.setFullYear(this.maxDate.getFullYear());

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
  }

  coreMensaje(mensage: MensajeController): void {
    console.log("coreMensaje llegando:", mensage.componente);
    if (mensage.componente == "SELECTOR_PROGRAMA") {
      this.coreBuscar();
    }
  }

  coreNuevo(): void {
    this.programaMantenimientoComponent.iniciarComponenteMaestro(
      new MensajeController(this, "SELECTOR_PROGRAMA", ""),
      "NUEVO",
      this.objetoTitulo.menuSeguridad.titulo
    );
  }

  coreEditar(row) {
    this.programaMantenimientoComponent.iniciarComponenteMaestro(
      new MensajeController(this, "SELECTOR_PROGRAMA", ""),
      "EDITAR",
      this.objetoTitulo.menuSeguridad.titulo,
      row
    );
  }
  coreVer(row) {
    this.programaMantenimientoComponent.iniciarComponenteMaestro(
      new MensajeController(this, "SELECTOR_PROGRAMA", ""),
      "VER",
      this.objetoTitulo.menuSeguridad.titulo,
      row
    );
  }
  async coreVerImagen(row) {

    let filtroImg: Image = new Image();
    filtroImg.Tabla = 'COMPANY';
    filtroImg.IdTabla = row.Persona;
    const imagenEnviar: Image = await this.getImagenes(filtroImg);
    console.log('TRAIDAAAA', filtroImg);
    if (imagenEnviar != undefined && imagenEnviar.Contenido != undefined) {
      this.lotesImagenComponent.iniciarComponenteMaestro(new MensajeController(this, "SELECTOR_LOTE", ""), "VER",
        this.objetoTitulo.menuSeguridad.titulo, [imagenEnviar]);
    } else {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Imagen no obtenida' });
    }

  }
  async getImagenes(filtroImg: Image): Promise<Image> {
    filtroImg.Estado = 1
    if (filtroImg.IdTabla == undefined || filtroImg.IdTabla == null) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Imagen no obtenida' });
      return;
    }
    const imagenes: Image[] = await this.maestrocompaniaMastService.MantenimientoFileVer(filtroImg, this.getUsuarioToken());

    console.log("WAKANDA FOREVER", imagenes);
    return imagenes[0];
  }

  coreBuscar(): void {
    // if(this.filtro.CompaniaCodigo == null){
    //    this.filtro = new FiltroPrograma();
    //  }
    console.log("Lote coreBuscar:", this.filtro);
    console.log("Lote coreBuscar:", this.filtro);
    if (this.filtro.CompaniaCodigo == null) {
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
    }

    this.bloquearPag = true;
    this.programaService.listarPrograma(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach((element) => {
        element.num = contado++;
      });
      this.lstProgramatb = res;
      console.log("maestro PROGRAMA listado:", res);
    });
  }

  // coreBuscar2(): void {

  //   this.bloquearPag = true;
  //   console.log("Programa coreBuscar:", this.filtro);
  //   this.programaService.listarPrograma(this.filtro).then((res) => {
  //     this.bloquearPag = false;
  //     let contado: number = 1;

  //     res.forEach((element) => {
  //       element.num = contado++;
  //       // element.valorEnSoles = element.Valor * element.TipoCambio;
  //       // element.valorEnsolesTotal = element.ValorTotal * element.TipoCambio;
  //       //element.descEstado = element.Estado == 1 ? "Activo" : "Inactivo";
  //     });
  //     this.lstProgramatb = res;

  //     console.log("proyecto PROGRAMA listado:", this.lstProgramatb);
  //   });
  // }

  coreGuardar(): void {
    throw new Error("Method not implemented.");
  }
  coreExportar(tipo: string): void {
    throw new Error("Method not implemented.");
  }

  exportExcel() {
    if (this.lstProgramatb == null || this.lstProgramatb == undefined || this.lstProgramatb.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: IPrograma[] = [];
      let contador: number = 0;
      let fecha: string;
      this.lstProgramatb.forEach(function (element) {
        contador += 1;

        if (element.FechaCreacion != null || element.FechaCreacion != undefined) {
          let fechaRegistro = new Date(element.FechaCreacion);
          let dd = ("0" + fechaRegistro.getDate()).slice(-2);
          let mm = ("0" + (fechaRegistro.getMonth() + 1)).slice(-2);
          let yyyy = fechaRegistro.getFullYear()
          fecha = dd + "/" + mm + "/" + yyyy;
        } else {
          fecha = '';
        }

        let manzanaExportar: IPrograma = {
          NRO: contador,
          FECHA: fecha,
          PROMOTOR: element.NombreCompleto?.toUpperCase() || '',
          COMPAÑIA: element.DescripcionCorta?.toUpperCase() || '',
          SUCURSAL: element.SedDescripcion?.toUpperCase() || '',
          PROGRAMA: element.Nombre?.toUpperCase() || '',
          AREA_M2: new Intl.NumberFormat().format(element.Area),
          PRECIO_M2: new Intl.NumberFormat().format(element.Precio),
          MONTO_TOTAL: new Intl.NumberFormat().format(element.MontoTotal),
          TIPO_MONEDA: element.DesMoneda?.toUpperCase() || '',
          CUOTAS: new Intl.NumberFormat().format(element.TotalCuota),
          MONTO_INICIAL: new Intl.NumberFormat().format(element.MontoInicial),
          UBIGEO: element.ubigeodesc?.toUpperCase() || '',
          ESTADO: element.Estado1?.toUpperCase() || '',
        };
        listaExportar.push(manzanaExportar);
      });
      this.exportarService.exportExcel(this.lstProgramatb, listaExportar, "Programa");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });
    }
  }


  exportPdf() {
    if (this.lstProgramatb == null || this.lstProgramatb == undefined || this.lstProgramatb.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      var col = [["NRO ",
        "FECHA ",
        "COMPAÑIA  ",
        "SUCURSAL  ",
        "PROGRAMA",
        "AREA M2",
        "PRECIO POR M2 ",
        "MONTO TOTAL",
        "TIPO DE MONEDA",
        "CUOTAS",
        "MONTO INICIAL",
        "ESTADO"]];
      //12 COLUMNAS
      var rows = [];
      let contador: number = 0;
      let fecha: string;
      this.lstProgramatb.forEach(function (element) {
        contador += 1;

        if (element.FechaCreacion != null || element.FechaCreacion != undefined) {
          let fechaRegistro = new Date(element.FechaCreacion);
          let dd = ("0" + fechaRegistro.getDate()).slice(-2);
          let mm = ("0" + (fechaRegistro.getMonth() + 1)).slice(-2);
          let yyyy = fechaRegistro.getFullYear()
          fecha = dd + "/" + mm + "/" + yyyy;
        }
        else {
          fecha = '';
        }
        let manzanaExportar = [
          contador,
          fecha,
          element.DescripcionCorta?.toUpperCase() || '',
          element.SedDescripcion?.toUpperCase() || '',
          element.Nombre?.toUpperCase() || '',
          new Intl.NumberFormat().format(element.Area),
          new Intl.NumberFormat().format(element.Precio),
          new Intl.NumberFormat().format(element.MontoTotal),

          element.DesMoneda?.toUpperCase() || '',
          new Intl.NumberFormat().format(element.TotalCuota),
          new Intl.NumberFormat().format(element.MontoInicial),
          element.Estado1?.toUpperCase() || ''
        ];
        rows.push(manzanaExportar);
      });

      this.exportarService.ExportPdf(this.lstProgramatb, col, rows, "Programa.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }
  }

  coreSalir(): void {
    throw new Error("Method not implemented.");
  }

  listarComboEstados() {
    this.lstEstados.push({
      label: ConstanteAngular.COMBOTODOS,
      value: null,
    });
    this.getMiscelaneos()
      .filter((x) => x.CodigoTabla == "ESTGEN")
      .forEach((i) => {
        this.lstEstados.push({ label: i.Nombre, value: i.Codigo });
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
      console.log(" this.lstCompania:", this.lstCompania);
      console.log("seleccion:", event);
      var dato = this.lstCompania.filter((x) => x.value == event.value);
      this.filtroSede.IdEmpresa = Number(dato[0].title);
      this.cargarCombosede(this.filtroSede.IdEmpresa);
      this.filtro.IdSede = null;
    } else {
      this.lstSucursal = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });

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

  coreinactivar(row) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: () => {
        row.Estado = 2;
        row.fechaModificacion = new Date();
        this.programaService
          .mantenimientoPrograma(2, row, this.getUsuarioToken())
          .then((res) => {
            if (res != null) {
              this.messageService.add({
                key: "bc",
                severity: "success",
                summary: "Success",
                detail: "Inactivado con éxito.",
              });
              this.coreBuscar();
            }
          });
      },
    });
  }


}
