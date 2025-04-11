import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { CorrelativosMantenimientoComponent } from '../components/correlativos-mantenimiento.component';
import { DtoCorrelativo } from '../model/DtoCorrelativo';
import { FiltroCorrelativo } from '../model/FiltroCorrelativo';
import { ICorrelativo } from '../model/ICorrelativo';
import { CorrelativoService } from '../services/correlativo.service';

@Component({
  selector: 'ngx-correlativos',
  templateUrl: './correlativos.component.html',
  styleUrls: ['./correlativos.component.scss']
})

export class CorrelativosComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(CorrelativosMantenimientoComponent, { static: false }) correlativosMantenimientoComponent: CorrelativosMantenimientoComponent;

  filtro: FiltroCorrelativo = new FiltroCorrelativo();
  tipocambio: number = 4.00
  igv: 0.18;
  bloquearPag: boolean = false;
  lst: any[] = [];
  lstEstado: SelectItem[] = [];
  lstCompania: SelectItem[] = [];
  dto: Maestro[] = [];
  filtrocompany: FiltroCompaniamast = new FiltroCompaniamast();
  ltsExportar: MenuItem[];
  lstTipoComprobante: SelectItem[] = [];

  constructor(
    private messageService: MessageService,
    private CorrelativoService: CorrelativoService,
    private confirmationService: ConfirmationService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private exportarService: ExportarService,) {
    super();
  }


  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    const p1 = this.cargarEstados();
    const p2 = this.cargarCombocompania();
    const p3 = this.cargarTipoComprobante();

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
    Promise.all([p1, p2, p3]).then((resp) => {

    });
  }




  coreBuscar(): void {
    this.bloquearPag = true;
    this.CorrelativoService.ListarCorrelativos(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lst = res;
      console.log("maestro TIPO CAMBIO listado:", res);

    });
  }

  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECTOR_CUENTABANCARIA") {
      this.coreBuscar();
    }
  }



  coreNuevo(): void {
    this.correlativosMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_CUENTABANCARIA', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }
  coreEditar(row) {
    if(row.CorrelativoNumero>1){
      this.messageShow('warn', 'Advertencia', 'Este correlativo se encuentra en uso');
      return;
    }
    this.correlativosMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_CUENTABANCARIA', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, row);
  }
  coreVer(row) {
    this.correlativosMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_CUENTABANCARIA', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row);
  }

  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }


  exportExcel() {
    if (this.lst == null || this.lst == undefined || this.lst.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: ICorrelativo[] = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lst.forEach(function (e: DtoCorrelativo) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCreacion);
        // let dd = fechaInicio.getDate() <= 9 ? "0" + fechaInicio.getDate() : fechaInicio.getDate();
        // let mm = fechaInicio.getMonth() == 0 ? "01" : fechaInicio.getMonth() <= 9 ? "0" + fechaInicio.getMonth() : fechaInicio.getMonth() + 1;
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
        let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar: ICorrelativo = {
          NRO: contador,
          FECHA: fechaCreacion,
          COMPAÑIA: e.DescripcionCorta?.toUpperCase() || '',
          TIPOCOMPROBANTE: e.TipoComprobante?.toUpperCase() || '',
          SERIE: e.Serie?.toUpperCase() || '',
          NUMERO: e.CorrelativoNumero.toString(),
          DESDE: new Intl.NumberFormat().format(e.CorrelativoDesde),
          HASTA: new Intl.NumberFormat().format(e.CorrelativoHasta),
          ESTADO: e.ESTADOdesc?.toUpperCase() || ''
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lst, listaExportar, "Correlativos");
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
    if (this.lst == null || this.lst == undefined || this.lst.length == 0) {
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
        "TIPO COMPROBANTE",
        "SERIE",
        "NUMERO",
        "DESDE",
        "HASTA",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lst.forEach(function (e: DtoCorrelativo) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCreacion);
        // let dd = fechaInicio.getDate() <= 9 ? "0" + fechaInicio.getDate() : fechaInicio.getDate();
        // let mm = fechaInicio.getMonth() == 0 ? "01" : fechaInicio.getMonth() <= 9 ? "0" + fechaInicio.getMonth() : fechaInicio.getMonth() + 1;
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
        let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar = [
          contador,
          fechaCreacion,
          e.DescripcionCorta?.toUpperCase() || '',
          e.TipoComprobante?.toUpperCase() || '',
          e.Serie?.toUpperCase() || '',
          e.CorrelativoNumero.toString(),
          new Intl.NumberFormat().format(e.CorrelativoDesde),
          new Intl.NumberFormat().format(e.CorrelativoHasta),
          e.ESTADOdesc?.toUpperCase() || ''
        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lst, col, rows, "Correlativos.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }

  }

  coreSalir(): void {
    throw new Error('Method not implemented.');
  }


  cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstado.push({ label: i.Nombre.trim().toUpperCase(), value: i.Codigo.trim() });
    });
  }

  cargarCombocompania(): Promise<number> {
    this.filtrocompany.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.filtrocompany).then(res => {
      console.log("listarCompaniaMast", res);
      res.forEach(ele => {
        //  this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
        this.lstCompania.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
      });
      return 1;
    });
  }

  async cargarTipoComprobante(): Promise<boolean> {
    this.lstTipoComprobante = [];
    this.lstTipoComprobante.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipoComprobante.push({ label: i.Nombre.trim().toUpperCase(), value: i.Codigo.trim() });
    });

    if (this.lstTipoComprobante.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  coreinactivar(row) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: () => {
        row.Estado = 'I';
        row.fechaModificacion = new Date();
        this.CorrelativoService.MantenimientoCorrelativos(2, row, this.getUsuarioToken()).then(
          res => {
            console.log("res", res);
            if (res != null) {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Anulado con éxito.' });
              this.coreBuscar();
            }
          });
      }
    });
  }

  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }
}
