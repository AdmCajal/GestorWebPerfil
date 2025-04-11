import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../FormMaestro/model/maestro';
import { MaestroDetalleMantenimientoComponent } from '../components/maestro-detalle-mantenimiento.component';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { MaestroService } from '../../FormMaestro/service/maestro.service';
import { FiltroMaestro } from '../../FormMaestro/model/Filtro.Maestro';
import { Filtromaestrodetalle } from '../dominio/filtro/Filtromaestrodetalle';
import { MaestrodetalleService } from '../servicio/maestrodetalle.service';
import { IMaestroDetalle } from '../dominio/dto/imaestrodetalle';
import { Dtomaestrodetalle } from '../dominio/dto/Dtomaestrodetalle';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';


@Component({
  selector: 'ngx-maestro-detalle',
  templateUrl: './maestro-detalle.component.html',
  styleUrls: ['./maestro-detalle.component.scss']
})
export class MaestroDetalleComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(MaestroDetalleMantenimientoComponent, { static: false }) maestroDetalleMantenimientoComponent: MaestroDetalleMantenimientoComponent;
  lstTablaMaestro: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  filtroMaestro: FiltroMaestro = new FiltroMaestro();
  filtro: Filtromaestrodetalle = new Filtromaestrodetalle();
  bloquearPag: boolean;

  dto: Maestro[] = [];
  lstMaestroDetalle: any[] = [];
  ltsExportar: MenuItem[];

  lstSeleccionadomultiple: any[] = [];
  constructor(
    private messageService: MessageService,
    private maestroService: MaestroService,
    private maestrodetalleService: MaestrodetalleService,
    private confirmationService: ConfirmationService,
    private exportarService: ExportarService,) {
    super();
  }


  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    // let dw = new Maestro()
    // dw.CodigoTabla = "01"
    // dw.Descripcion = "PRUEBA DESCRI"
    // dw.Estado = 2
    // this.dto.push(dw);
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
    const p1 = this.cargarEstados();
    const p2 = this.cargarMaestros();
    Promise.all([p1, p2]).then((resp) => {

    });


  }

  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECTOR_DETALLE") {
      this.coreBuscar();
    }
  }

  coreNuevo(): void {
    this.maestroDetalleMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_DETALLE', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }
  coreEditar(row) {
    this.maestroDetalleMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_DETALLE', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, row)
  }
  coreVer(row) {
    this.maestroDetalleMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_DETALLE', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row)
  }

  coreBuscar(): void {

    if (!this.estaVacio(this.filtro.Nombre)) {
      this.filtro.Nombre = this.filtro.Nombre.trim();
    }
    this.bloquearPag = true;
    this.maestrodetalleService.listarmaestroDetalle(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lstMaestroDetalle = res;
      console.log("maestro listado:", res);
    });

  }


  exportExcel() {
    if (this.lstMaestroDetalle == null || this.lstMaestroDetalle == undefined || this.lstMaestroDetalle.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: IMaestroDetalle[] = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstMaestroDetalle.forEach(function (e: Dtomaestrodetalle) {
        contador += 1;

        if (e.FechaCreacion != null || e.FechaCreacion != undefined) {
          let fechaInicio = new Date(e.FechaCreacion);
          let dd = ("0" + fechaInicio.getDate()).slice(-2);
          let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2); let yyyy = fechaInicio.getFullYear()
          fechaCreacion = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaCreacion = ''
        }


        let itemExportar: IMaestroDetalle = {
          NRO: contador.toString(),
          FECHA: fechaCreacion,
          CODIGO: e.Codigo,
          MAESTRO: e.TablaMaestro.toUpperCase() || '',
          NOMBRE: e.Nombre?.toUpperCase() || '',
          ESTADO: e.EstadoDesc?.toUpperCase() || '',
          DESCRIPCION: e.Descripcion?.toUpperCase() || ''
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lstMaestroDetalle, listaExportar, "Maestro detalle");
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
    if (this.lstMaestroDetalle == null || this.lstMaestroDetalle == undefined || this.lstMaestroDetalle.length == 0) {
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
        "NOMBRE",
        "ESTADO",
        "MAESTRO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstMaestroDetalle.forEach(function (e: Dtomaestrodetalle) {
        contador += 1;

        if (e.FechaCreacion != null || e.FechaCreacion != undefined) {
          let fechaInicio = new Date(e.FechaCreacion);
          let dd = ("0" + fechaInicio.getDate()).slice(-2);
          let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2); 
          let yyyy = fechaInicio.getFullYear()
          fechaCreacion = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaCreacion = ''
        }

        let itemExportar = [
          contador.toString(),
          fechaCreacion,
          e.Codigo,
          e.Nombre?.toUpperCase() || '',
          e.EstadoDesc?.toUpperCase() || '',
          e.TablaMaestro?.toUpperCase() || ''
        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lstMaestroDetalle, col, rows, "Maestro_Detalle.pdf", "l");
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
    console.log("exportar:", this.lstSeleccionadomultiple);
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }




  coreinactivar(row) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: () => {
        row.estado = 2;
        this.maestrodetalleService.mantenimientoMaestro(3, row, this.getUsuarioToken()).then(
          res => {
            if (res != null) {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Anulado con éxito.' });
              this.coreBuscar();
            }
          });
      }

    });
  }

  cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstado.push({ label: i.Nombre, value: i.IdCodigo });
    });
  }

  cargarMaestros() {
    this.filtroMaestro.Estado = 1;
    this.maestroService.listarMaestro(this.filtroMaestro).then(
      res => {
        this.lstTablaMaestro = [];
        this.lstTablaMaestro.push({ label: ConstanteAngular.COMBOTODOS, value: null });
        console.log("TABLA MAESTRO:", res);
        res.forEach(element => {
          this.lstTablaMaestro.push({ label: element.Nombre, value: element.IdTablaMaestro });
        });
      }
    );
  }

  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
  }


}
