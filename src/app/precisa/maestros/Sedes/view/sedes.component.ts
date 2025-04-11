import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { DtoWcoSede } from '../dominio/dto/DtoWcoSede';
import { ISucrusal } from '../dominio/dto/iSucursal';
import { FiltroWcoSede } from '../dominio/filtro/FiltroWcoSede';
import { MaestroSucursalService } from '../servicio/maestro-sucursal.service';
import { SedesMantenimientoComponent } from './components/sedes-mantenimiento.component';

@Component({
  selector: 'ngx-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.scss']
})
export class SedesComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(SedesMantenimientoComponent, { static: false }) sedesMantenimientoComponent: SedesMantenimientoComponent;
  lstEstado: SelectItem[] = [];
  bloquearPag: boolean = false;
  filtro: FiltroWcoSede = new FiltroWcoSede();
  lstSucursaltb: any[] = [];
  filtrocompa: FiltroCompaniamast = new FiltroCompaniamast();
  lstCompania: SelectItem[] = [];
  ltsExportar: MenuItem[];

  constructor(
    private maestroSucursalService: MaestroSucursalService,
    private exportarService: ExportarService,
    private messageService: MessageService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private confirmationService: ConfirmationService
  ) { super(); }

  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    const p1 = this.cargarEstados();
    const p2 = this.cargarCombocompania();
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
    Promise.all([p1, p2]).then((resp) => {
      this.bloquearPag = false;
    });
  }

  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECTOR_SEDES") {
      this.coreBuscar();
    }
  }

  exportExcel() {
    if (this.lstSucursaltb == null || this.lstSucursaltb == undefined || this.lstSucursaltb.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: ISucrusal[] = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstSucursaltb.forEach(function (e: DtoWcoSede) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCreacion);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2); let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar: ISucrusal = {
          NRO: contador.toString(),
          FECHA: fechaCreacion,
          CODIGO: e.SedCodigo,
          TELEFONO: e.Telefono,
          SUCURSAL: e.SedDescripcion?.toUpperCase() || '',
          DIRECCION: e.Direccion?.toUpperCase() || '',
          COMPAÑIA: e.NombreCompleto?.toUpperCase() || '',
          ESTADO: e.DescEstado?.toUpperCase() || ''
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lstSucursaltb, listaExportar, "Sucursales");
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
    if (this.lstSucursaltb == null || this.lstSucursaltb == undefined || this.lstSucursaltb.length == 0) {
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
        "CODIGO",
        "TELEFONO",
        "SUCURSAL",
        "DIRECCION",
        "COMPAÑIA",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstSucursaltb.forEach(function (e: DtoWcoSede) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCreacion);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2); let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar = [
          contador.toString(),
          fechaCreacion,
          e.SedCodigo,
          e.Telefono,
          e.SedDescripcion?.toUpperCase() || '',
          e.Direccion?.toUpperCase() || '',
          e.NombreCompleto?.toUpperCase() || '',
          e.DescEstado?.toUpperCase() || ''
        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lstSucursaltb, col, rows, "Sucursales.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }

  }

  coreNuevo(): void {
    this.sedesMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_SEDES', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }
  coreEditar(row) {
    this.sedesMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_SEDES', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, row);
  }
  coreVer(row) {
    this.sedesMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_SEDES', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row);
  }

  coreinactivar(row) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: () => {
        row.SedEstado = 2;
        this.maestroSucursalService.mantenimientoMaestro(3, row, this.getUsuarioToken()).then(
          res => {
            if (res != null) {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Anulado con éxito.' });
              this.coreBuscar();
            }
          });
      },

    });
  }

  coreBuscar(): void {
    if (!this.estaVacio(this.filtro.SedDescripcion)) {
      this.filtro.SedDescripcion = this.filtro.SedDescripcion.trim();
    }
    this.bloquearPag = true;
    this.maestroSucursalService.ListaSede(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lstSucursaltb = res;
      console.log("maestro coreBuscar listado:", res);
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


  cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstado.push({ label: i.Nombre, value: i.IdCodigo });
    });
  }

  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
  }


  cargarCombocompania(): Promise<number> {
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.filtrocompa.estado = "A";
    return this.maestrocompaniaMastService.listarCompaniaMast(this.filtrocompa).then(res => {
      console.log("company", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
      });
      return 1;
    });
  }


}
