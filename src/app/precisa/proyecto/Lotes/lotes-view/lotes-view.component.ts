import { ILote, jsPDFCustom } from './../model/ILote';
import { LotesDividirComponent } from "./../lotes-dividir/lotes-dividir.component";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { Table } from "primeng/table";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { LotesMantenimientoComponent } from "../lotes-mantenimiento/lotes-mantenimiento.component";
import { FiltroCompaniamast } from "../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { FiltroWcoSede } from "../../../maestros/Sedes/dominio/filtro/FiltroWcoSede";
import { SelectItem, ConfirmationService, MessageService, MenuItem } from "primeng/api";
import { MaestroSucursalService } from "../../../maestros/Sedes/servicio/maestro-sucursal.service";
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { FiltroLote } from "../model/FiltroLote";
import { LoteService } from "../service/lotes.service";
import { ManzanaService } from "../../Manzana/service/manzana.service";
import { ProgramaService } from "../../Programa/service/programa.service";
import { FiltroPrograma } from "../../Programa/model/FiltroPrograma";
import { FiltroManzana } from "../../Manzana/model/FiltroManzana";
import { LotesUnirComponent } from "../lotes-unir/lotes-unir.component";
import { DtoLote } from "../model/DtoLote";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { RowInput } from 'jspdf-autotable';
import { FLOAT } from 'html2canvas/dist/types/css/property-descriptors/float';
import { LotesImagenComponent } from '../lotes-imagen/lotes-imagen.component';
import { Image } from '../../../seguridad/companias/dominio/dto/image';

@Component({
  selector: "ngx-lotes-view",
  templateUrl: "./lotes-view.component.html",
  styleUrls: ["./lotes-view.component.scss"],
})
export class LotesViewComponent
  extends ComponenteBasePrincipal
  implements OnInit, UIMantenimientoController {
  @ViewChild(LotesMantenimientoComponent, { static: false })
  lotesMantenimientoComponent: LotesMantenimientoComponent;
  @ViewChild(LotesUnirComponent, { static: false })
  lotesUnirComponent: LotesUnirComponent;
  @ViewChild(LotesDividirComponent, { static: false })
  lotesDividirComponent: LotesDividirComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;

  @ViewChild(LotesImagenComponent, { static: false })
  lotesImagenComponent: LotesImagenComponent;

  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  FiltroPrograma: FiltroPrograma = new FiltroPrograma();
  FiltroManzana: FiltroManzana = new FiltroManzana();
  filtro: FiltroLote = new FiltroLote();
  Dtorow: DtoLote = new DtoLote();

  filtroPrograma: FiltroPrograma = new FiltroPrograma();
  lstLote: DtoLote[] = [];
  compañiadelista: string;
  bloquearPag: boolean;
  lstCompania: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstManzana: SelectItem[] = [];
  ltsExportar: MenuItem[];
  lstSeleccionadomultiple: any[] = [];
  lstEstadoCampo: SelectItem[] = [];

  constructor(
    private exportarService: ExportarService,
    private loteService: LoteService,
    private confirmationService: ConfirmationService,
    private manzanaService: ManzanaService,
    private messageService: MessageService,
    private programaService: ProgramaService,
    private maestroSucursalService: MaestroSucursalService,
    private maestrocompaniaMastService: MaestrocompaniaMastService
  ) {
    super();
  }

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    this.bloquearPag = true;
    const p1 = this.listarComboEstados();
    const p4 = this.cargarCombocompania();
    this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    this.ltsExportar = [{
      label: 'Formato PDF', icon: 'pi pi-file-pdf', command: () => {
        this.exportPdf()
      }
    },
    {
      label: 'Formato EXCEL', icon: 'pi pi-file-excel', command: () => {
        this.exportExcel()
      }
    }];
    Promise.all([p1, p4]).then((f) => {
      this.bloquearPag = false;
    });
  }

  coreMensaje(mensage: MensajeController): void {
    console.log("coreMensaje llegando:", mensage.componente);
    if (mensage.componente == "SELECTOR_LOTE") {
      this.coreBuscar();
    }

    if (mensage.componente == "SELECTOR_UNIR") {
      this.coreBuscar();
    }

    if (mensage.componente == "SELECTOR_LOTEDIVIDIR") {
      this.coreBuscar();
    }
  }

  coreNuevo(): void {
    this.lotesMantenimientoComponent.iniciarComponenteMaestro(
      new MensajeController(this, "SELECTOR_LOTE", ""),
      "NUEVO",
      this.objetoTitulo.menuSeguridad.titulo
    );
  }



  coreUnir(): void {
    console.log("registros seleccionados.", this.lstSeleccionadomultiple);
    let valiUnir: Number;
    let valinombre: string;
    if (this.lstSeleccionadomultiple.length <= 1) {
      console.log("registros seleccionados son 1.");
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Debe Seleccionar mas de 1 registros.",
      });
      return;
    }


    let ivalidacionUnir: IvalidacionUnir = new IvalidacionUnir();
    ivalidacionUnir.IdSucursal = this.lstSeleccionadomultiple[0].IdSede,
      ivalidacionUnir.IdPrograma = this.lstSeleccionadomultiple[0].IdProyecto;
    ivalidacionUnir.IdManzana = this.lstSeleccionadomultiple[0].IdManzana,
      ivalidacionUnir.Ubicacion = this.lstSeleccionadomultiple[0].Ubicacion;
    ivalidacionUnir.Precio = this.lstSeleccionadomultiple[0].Valor;


    let concatenado = "";
    let vAreaTotal = 0;
    let vValor = 0;
    let vValorTotal = 0;

    for (let step = 0; step < this.lstSeleccionadomultiple.length; step++) {

      valinombre += this.lstSeleccionadomultiple[step].Nombre + ' - ';
      if (this.lstSeleccionadomultiple[step].IdProyecto != this.lstSeleccionadomultiple[0].IdProyecto) {
        valiUnir = 1;
        break;
      }
      if (this.lstSeleccionadomultiple[step].IdManzana != this.lstSeleccionadomultiple[0].IdManzana) {
        valiUnir = 2;
        break;
      }
      if (this.lstSeleccionadomultiple[step].DesEstado == "Inactivo") {
        valiUnir = 3;
        break;
      }
      if (this.lstSeleccionadomultiple[step].DesCondicion != "Libre") {
        valiUnir = 4;
        break;
      }
      if (this.lstSeleccionadomultiple[0].Valor != this.lstSeleccionadomultiple[step].Valor) {
        //alert("this.lstSeleccionadomultiple[step].Valor: "+this.lstSeleccionadomultiple[step].Valor);
        //alert("IvalidacionUnir.Precio: "+IvalidacionUnir.Precio);
        valiUnir = 5;
        break;
      }
      if (this.lstSeleccionadomultiple[0].Ubicacion != this.lstSeleccionadomultiple[step].Ubicacion) {
        valiUnir = 6;
        break;
      }
      concatenado += this.lstSeleccionadomultiple[step].Nombre + ", ";

      //Area m2
      vAreaTotal += this.lstSeleccionadomultiple[step].AreaTotal;

      // precio m2
      vValor = this.lstSeleccionadomultiple[0].Valor;

      //monto total
      vValorTotal += this.lstSeleccionadomultiple[step].ValorTotal;
    }
    // precio m2
    // vValorTotal = vAreaTotal*vValor;
    switch (valiUnir) {
      case 1:
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "Warning",
          detail: "Lotes deben ser del mismo programa o manzana. " + valinombre,
        });
        this.lstSeleccionadomultiple = [];
        return;

      case 2:
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "Warning",
          detail: "Lotes deben ser del mismo programa o manzana." + valinombre,
        });
        this.lstSeleccionadomultiple = [];
        return;

      case 3:
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "Warning",
          detail: "Seleccione solo lotes activos." + valinombre,
        });
        this.lstSeleccionadomultiple = [];
        return;

      case 4:
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "Warning",
          detail: "Seleccione solo lotes Libres." + valinombre,
        });
        this.lstSeleccionadomultiple = [];
        return;
      case 5:
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "Warning",
          detail: "Los lotes no tienen el mismo precio",
        });
        this.lstSeleccionadomultiple = [];
        return;
      case 6:
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "Warning",
          detail: "Los lotes no tienen la misma ubicación",
        });
        this.lstSeleccionadomultiple = [];
        return;
    }

    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Esta Seguro de Unir los LOTE: " + valinombre + "?",
      key: "confirm3",
      accept: () => {
        this.Dtorow = this.lstSeleccionadomultiple[0];
        this.Dtorow.Nombre = concatenado;
        this.Dtorow.AreaTotal = vAreaTotal;
        this.Dtorow.Valor = vValor;
        this.Dtorow.ValorTotal = vValorTotal;
        this.Dtorow.FlaUnion = 1;
        this.Dtorow.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
        this.Dtorow.IpCreacion = this.getIp(); //crear metodo que nos muestre la IP del usuario
        console.log("coreUnir insert mantenimientoLote.", this.Dtorow);

        this.loteService.mantenimientoLote(1, this.Dtorow, this.getUsuarioToken())
          .then((res) => {
            this.dialog = false;
            this.bloquearPag = false;
            console.log("coreUnir registrado:", res);
            if (res != null) {
              if (res.mensaje == "Created") {
                this.lstSeleccionadomultiple.forEach((element) => {
                  element.Estado = 2;
                  element.IdLotePadre = res.data.IdLote;
                  element.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
                  element.IpModificacion = this.getIp(); //crear metodo que nos muestre la IP del usuario

                  this.loteService.mantenimientoLote(3, element, this.getUsuarioToken())
                    .then((resAnu) => {
                      if (resAnu != null) {
                        this.coreBuscar();
                        // this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Inactivado con éxito.' });
                        console.log(
                          "coreUnir Anula mantenimientoLote.",
                          element
                        );
                      }
                    });
                });

                this.messageService.add({
                  key: "bc",
                  severity: "success",
                  summary: "Success",
                  detail: "Se Unieron los registros con éxito.",
                });
                this.lstSeleccionadomultiple = [];

              } else {
                this.messageService.add({
                  key: "bc",
                  severity: "warn",
                  summary: "Advertencia",
                  detail: res.mensaje,
                });
              }
            }
          });
      },
    });

  }



  coreDividir(): void {
    console.log("registros seleccionados.", this.lstSeleccionadomultiple);

    if (this.lstSeleccionadomultiple[0].DesEstado == "Inactivo") {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Seleccione solo lotes activos.",
      });
      return;
    }
    if (this.lstSeleccionadomultiple[0].Condicion != 1) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Seleccione solo lotes libres.",
      });
      return;
    }

    if (this.lstSeleccionadomultiple[0].FlaUnion != 1) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Seleccione solo lotes unidos.",
      });
      return;
    }

    if (this.lstSeleccionadomultiple.length != 1) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Debe Seleccionar solo 1 Registro.",
      });
      return;
    }
    //  this.lotesDividirComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_LOTEDIVIDIR', ''), "DIVIDIR", this.objetoTitulo.menuSeguridad.titulo, this.lstSeleccionadomultiple);

    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message:
        "¿Esta Seguro de dividir el LOTE: " +
        this.lstSeleccionadomultiple[0].Nombre +
        "?",
      key: "confirm3",
      accept: () => {
        this.Dtorow = this.lstSeleccionadomultiple[0];
        this.Dtorow.Estado = 1;
        this.Dtorow.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
        console.log('dtoRow', this.Dtorow);

        this.loteService
          .mantenimientoLote(4, this.Dtorow, this.getUsuarioToken())
          .then((res) => {
            if (res != null) {
              this.lstSeleccionadomultiple = [];
              this.coreBuscar();
              this.messageService.add({
                key: "bc",
                severity: "success",
                summary: "Success",
                detail: "Se dividio con éxito.",
              });

            }

          });
      },
    });
  }

  coreEditar(row) {
    if (row.IdLotePadre != null || row.IdLotePadre != undefined) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "warning",
        detail: "El lote pertenece a una unión.",
      });
      return;
    }
    if (row.Condicion == 3) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "warning",
        detail: "El lote se enceuntra vendido",
      });
      return;
    }
    if (row.Condicion == 2) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "warning",
        detail: "El lote se encuentra reservado",
      });
      return;
    }
    this.lotesMantenimientoComponent.iniciarComponenteMaestro(
      new MensajeController(this, "SELECTOR_LOTE", ""),
      "EDITAR",
      this.objetoTitulo.menuSeguridad.titulo,
      row
    );
  }

  coreVer(row) {
    this.lotesMantenimientoComponent.iniciarComponenteMaestro(
      new MensajeController(this, "SELECTOR_LOTE", ""),
      "VER",
      this.objetoTitulo.menuSeguridad.titulo,
      row
    );
  }


  async coreVerImagen(row) {
    this.bloquearPag = true;
    let filtroImg: Image = new Image();
    filtroImg.Tabla = 'LOTE';
    filtroImg.IdTabla = row.IdLote;
    if (filtroImg.IdTabla == undefined || filtroImg.IdTabla == null) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Imagen no obtenida' });
      return;
    }
    const imagenEnviar = await this.getImagenes(filtroImg);
    console.log('TRAIDAAAA', filtroImg);
    if (imagenEnviar == undefined || imagenEnviar.length == 0) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Imagen no obtenida' });
      this.bloquearPag = false;
      return;
    } else {
      this.lotesImagenComponent.iniciarComponenteMaestro(new MensajeController(this, "SELECTOR_LOTE", ""), "VER",
        this.objetoTitulo.menuSeguridad.titulo, imagenEnviar);
    }
    this.bloquearPag = false;
  }
  async getImagenes(filtroImg: Image): Promise<Image[]> {
    filtroImg.Estado = 1

    const imagenes: Image[] = await this.maestrocompaniaMastService.MantenimientoFileVer(filtroImg, this.getUsuarioToken());

    console.log("WAKANDA FOREVER", imagenes);
    return imagenes;
  }

  coreBuscar(): void {
    this.bloquearPag = true;
    this.lstSeleccionadomultiple = []
    console.log("Lote coreBuscar:", this.filtro);
    this.loteService.listarLote(this.filtro).then((res) => {
      this.bloquearPag = false;
      let contado: number = 1;

      res.forEach((element) => {
        element.num = contado++;
        element.valorEnSoles = element.Valor * element.TipoCambio;
        element.valorEnsolesTotal = element.ValorTotal * element.TipoCambio;
        //element.descEstado = element.Estado == 1 ? "Activo" : "Inactivo";
      });
      this.lstLote = res;

      console.log("maestro LOTE listado:", this.lstLote);
    });
  }

  coreGuardar(): void {
    throw new Error("Method not implemented.");
  }

  /*Exportar */
  coreExportar(): void {
    //throw new Error("Method not implemented.");
    this.exportPdf();
  }
  /*public formato(value:string): string{
    let array:string[]= value.toString().split(',');
    let valorNuevo: = "";
    array.forEach( function (e){
      valorNuevo += e;
    });
    console.log(valorNuevo);
    let valor = +valorNuevo;
    valorNuevo = valor.toFixed(2);
    var valor2 = Number(valorNuevo);
    console.log("valor");

    return valorNuevo;
  }*/

  exportExcel() {

    if (this.lstLote == null || this.lstLote == undefined || this.lstLote.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: ILote[] = [];
      let contador: number = 0;
      let fecha: string;
      for (let step = 0; step < this.lstLote.length; step++) {
        contador += 1;

        if (this.lstLote[step].FechaCreacion != null || this.lstLote[step].FechaCreacion != undefined) {
          let fechaCreacion = new Date(this.lstLote[step].FechaCreacion);
          let dd = ("0" + fechaCreacion.getDate()).slice(-2);
          let mm = ("0" + (fechaCreacion.getMonth() + 1)).slice(-2); let yyyy = fechaCreacion.getFullYear()
          fecha = dd + "/" + mm + "/" + yyyy;

        } else {
          fecha = '';
        }

        let loteExportar: ILote = {
          NRO: contador,
          FECHA: fecha,
          LOTE: this.lstLote[step].Nombre?.toUpperCase() || '',
          DIRECCION: this.lstLote[step].Direccion?.toUpperCase() || '',
          OBSERVACION: this.lstLote[step].Observacion?.toUpperCase() || '',
          COMPAÑIA: this.lstLote[step].DescripcionCorta?.toUpperCase() || '',
          SUCURSAL: this.lstLote[step].SedDescripcion?.toUpperCase() || '',
          PROGRAMA: this.lstLote[step].NomProyecto?.toUpperCase() || '',
          MANZANA: this.lstLote[step].NomManzana?.toUpperCase() || '',
          UBIGEO: this.lstLote[step].DescUbigeo?.toUpperCase() || '',
          UBICACION: this.lstLote[step].DesUbicacion?.toUpperCase() || '',
          TIPO_LOTE: this.lstLote[step].DescTipoLote?.toUpperCase() || '',
          TIPO_INTERES: this.lstLote[step].DesTipoIntere?.toUpperCase() || '',
          ESTADO_LOTE: this.lstLote[step].DesCondicion?.toUpperCase() || '',
          ESTADO_CAMPO_DETALLE: this.lstLote[step].DesSituacion?.toUpperCase() || '',
          MOROSIDAD: this.lstLote[step].MorosidadPorcentaje,
          AREA_M2: new Intl.NumberFormat().format(this.lstLote[step].AreaTotal),
          PRECIO_M2: new Intl.NumberFormat().format(this.lstLote[step].Valor),
          MONTO_TOTAL: new Intl.NumberFormat().format(this.lstLote[step].ValorTotal),
          // PRECIO_M2_SOLES: new Intl.NumberFormat().format(this.lstLote[step].valorEnSoles),
          // MONTO_TOTAL_SOLES: new Intl.NumberFormat().format(this.lstLote[step].valorEnsolesTotal),
          // DIAS_DE_GRACIA: new Intl.NumberFormat().format(this.lstLote[step].diasGracia),
          TIPO_DE_CAMBIO: new Intl.NumberFormat().format(this.lstLote[step].TipoCambio),
          MONEDA: this.lstLote[step].DesMoneda?.toUpperCase() || '',
          ESTADO: this.lstLote[step].DesEstado?.toUpperCase() || ''
        }
        listaExportar.push(loteExportar);
      };
      this.exportarService.exportExcel(this.lstLote, listaExportar, "lote");
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
    if (this.lstLote == null || this.lstLote == undefined || this.lstLote.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realizar Busqueda",
      });
    } else {
      let col = [["NRO",
        "FECHA",
        "COMPAÑIA",
        "SUCURSAL",
        "PROGRAMA",
        "MANZANA",
        "LOTE",
        "AREA M2",
        "PRECIO POR M2",
        "MONTO TOTAL",
        "E.LOTE",
        "MONEDA",
        "ESTADO"]];
      //13 campos
      let rows: RowInput[] = [];
      let contador: number = 0;
      let fecha: string;
      for (let step = 0; step < this.lstLote.length; step++) {
        contador += 1;

        if (this.lstLote[step].FechaCreacion != null || this.lstLote[step].FechaCreacion != undefined) {
          let fechaCreacion = new Date(this.lstLote[step].FechaCreacion);
          let dd = ("0" + fechaCreacion.getDate()).slice(-2);
          let mm = ("0" + (fechaCreacion.getMonth() + 1)).slice(-2);
          let yyyy = fechaCreacion.getFullYear()
          fecha = dd + "/" + mm + "/" + yyyy;

        } else {
          fecha = '';
        }

        let loteExportar = [
          contador,
          fecha,
          this.lstLote[step].DescripcionCorta?.toUpperCase() || '',
          this.lstLote[step].SedDescripcion?.toUpperCase() || '',
          this.lstLote[step].NomProyecto?.toUpperCase() || '',
          this.lstLote[step].NomManzana?.toUpperCase() || '',
          this.lstLote[step].Nombre?.toUpperCase() || '',
          new Intl.NumberFormat().format(this.lstLote[step].AreaTotal),
          new Intl.NumberFormat().format(this.lstLote[step].Valor),
          new Intl.NumberFormat().format(this.lstLote[step].ValorTotal),
          this.lstLote[step].DesCondicion?.toUpperCase() || '',
          this.lstLote[step].DesMoneda?.toUpperCase() || '',
          this.lstLote[step].DesEstado?.toUpperCase() || ''
        ]
        rows.push(loteExportar);
      };
      console.log("row", rows);

      this.exportarService.ExportPdf(this.lstLote, col, rows, "Lotes.pdf", "l");
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
    this.lstEstados.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos()
      .filter((x) => x.CodigoTabla == "ESTGEN")
      .forEach((i) => {
        this.lstEstados.push({ label: i.Nombre, value: i.Codigo });
      });
    this.filtro.Estado = 1;
  }

  cargarCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then((res) => {
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
    return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
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

  selectedItemPrograma(event) {
    if (event.value != null) {
      console.log("event selectedItemPrograma", event);
      this.filtro.IdProyecto = event.value;
      this.filtro.IdManzana = null;
      this.cargarComboManzana(this.filtro.IdProyecto);
    }
    else {
      this.lstManzana = []
      this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });
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


  cargarComboPrograma(): Promise<number> {
    if (this.filtro.IdSede != null) {
      this.filtroPrograma.Estado = 1;
      this.filtroPrograma.IdSede = this.filtro.IdSede;
      this.lstPrograma = [];
      this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      return this.programaService.listarPrograma(this.filtroPrograma).then((res) => {
        console.log("Combo Programa:", res);
        res.forEach((ele) => {
          this.lstPrograma.push({
            label: ele.Nombre.trim(),
            value: ele.IdProyecto,
          });
        });
        return 1;
      });
    } else {
      this.lstPrograma = []
      this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
      this.filtro.IdManzana = null;
    }
  }

  coreinactivar(row) {
    console.log("coreinactivar lote:", row);
    if (row.Condicion == 3){
      this.messageShow('warn', 'Advertencia', 'Este lote se encuentra vendido'); return;
    }

      if (row.IdLotePadre != null || row.IdLotePadre != undefined) {
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "warning",
          detail: "El lote pertenece a una unión.",
        });
      } else {
        this.confirmationService.confirm({
          header: "Confirmación",
          icon: "fa fa-question-circle",
          message: "¿Desea inactivar este registro ? ",
          key: "confirm2",
          accept: () => {
            row.Estado = 2;
            this.loteService
              .mantenimientoLote(3, row, this.getUsuarioToken())
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
  messageShow(_severity: string, _summary: string, _detail: string): void {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

}

export class IvalidacionUnir {
  IdSucursal: number;
  IdPrograma: number;
  IdManzana: number;
  Ubicacion: any;
  Precio: any
}
