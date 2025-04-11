import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../../maestros/FormMaestro/model/maestro';
import { Table } from 'primeng/table';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { EgresoMantenimientoComponent } from '../egreso-mantenimiento/egreso-mantenimiento.component';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { FiltroEgreso } from '../model/filtro.egreso';
import { EgresoService } from '../service/egreso.service';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { DtoEgreso } from '../model/dtoegreso';
import { IEgreso } from '../model/iegreso';
import { IEgresoDetalle } from '../model/iegresodetalle';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { DtoClassEgreso } from '../model/dtoclassegreso';


@Component({
  selector: 'ngx-egreso-view',
  templateUrl: './egreso-view.component.html',
  styleUrls: ['./egreso-view.component.scss']
})
export class EgresoViewComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(EgresoMantenimientoComponent, { static: false })
  egresoMantenimientoComponent: EgresoMantenimientoComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: Maestro[] = [];
  ltsExportar: MenuItem[];
  lstEstados: SelectItem[] = [];
  bloquearPag: boolean;
  lstTipoComprobante: SelectItem[] = [];
  filtro: FiltroEgreso = new FiltroEgreso();
  //filtro: DtoEgreso = new DtoEgreso();
  lstEgreso: DtoEgreso[] = [];

  constructor(
    private toastrService: NbToastrService,
    private messageService: MessageService,
    private exportarService: ExportarService,
    private confirmationService: ConfirmationService,
    private egresoservice: EgresoService) {
    super();
  }


  async ngOnInit() {
    // this.tituloListadoAsignar(1, this);
    // this.iniciarComponent();
    /*     
    let dw = new Maestro()
    dw.CodigoTabla = "01"
    dw.Descripcion = "PRUEBA DESCRI"
    dw.Nombre = "NOMBRE DETALLE"
    dw.Estado = 2 
    */

    await this.cargarTipoComprobante();
    await this.listarComboEstados();
    this.filtro.FechaCreacion = new Date(); 
    this.filtro.FechaRegistro = new Date(); 
    // this.dto.push(dw)

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
  }

  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECTOR_EGRESO") {
      this.coreBuscar();
    }

  }

  coreNuevo() {
    this.egresoMantenimientoComponent.coreIniciarComponente(new MensajeController(this, "SELECTOR_EGRESO", ""), ConstanteUI.ACCION_SOLICITADA_NUEVO);
  }
  coreEditar(egreso: DtoEgreso) {
    this.egresoMantenimientoComponent.coreIniciarComponente(new MensajeController(this, "SELECTOR_EGRESO", ""), ConstanteUI.ACCION_SOLICITADA_EDITAR, egreso);
  }
  coreVer(egreso: DtoEgreso) {
    this.egresoMantenimientoComponent.coreIniciarComponente(new MensajeController(this, "SELECTOR_EGRESO", ""), ConstanteUI.ACCION_SOLICITADA_VER, egreso);
  }
  coreinactivar(egreso: DtoEgreso) {
    if(egreso.Estado == ConstanteUI.ESTADO_NUMERICO_ANULAR){
      this.messageShow('error', 'error', 'Ya está anulado');
      return;
    }

    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "Desea anular el registro? ",
      key: "confirm",
      accept: async () => {
        let dtoClassEgreso: DtoClassEgreso = new DtoClassEgreso();
        egreso.Estado = ConstanteUI.ESTADO_NUMERICO_ANULAR;
        egreso.UsuarioModificacion = this.getUsuarioAuth().data[0].Documento;
        egreso.IpModificacion = this.getIp();
        egreso.FechaModificacion = new Date();

        dtoClassEgreso.Egreso = egreso;
        dtoClassEgreso.Detalle = [];

        console.log("coreinactivar dtoClassEgreso", dtoClassEgreso);

        this.egresoservice.MantenimientoEgreso(ConstanteUI.SERVICIO_SOLICITUD_ELIMINAR, dtoClassEgreso).then(resp => {
          if (resp.success) {
            this.messageShow('success', 'success', this.getMensajeAnulado());
            this.coreBuscar();
          } else {
            this.messageShow('warn', 'error', this.getMensajeErrorAnular());
            return;
          }
        });

      },
      reject: async () => {
        // this.visible = false;
      }
    });



  }
  coreAprobar(egreso: DtoEgreso) {

    if(egreso.Estado == ConstanteUI.ESTADO_NUMERICO_APROBADO){
      this.messageShow('error', 'error', 'Ya está aprobado');
      return;
    }


    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea aprobar el registro? ",
      key: "confirm",
      accept: async () => {
        let dtoClassEgreso: DtoClassEgreso = new DtoClassEgreso();
        egreso.Estado = ConstanteUI.ESTADO_NUMERICO_APROBADO;
        egreso.UsuarioModificacion = this.getUsuarioAuth().data[0].Documento;
        egreso.IpModificacion = this.getIp();
        egreso.FechaModificacion = new Date();

        dtoClassEgreso.Egreso = egreso;
        dtoClassEgreso.Detalle = [];

        console.log("coreinactivar dtoClassEgreso", dtoClassEgreso);

        this.egresoservice.MantenimientoEgreso(ConstanteUI.SERVICIO_SOLICITUD_APROBAR, dtoClassEgreso).then(resp => {
          if (resp.success) {
            this.messageShow('success', 'success', this.getMensajeAprobado());
            this.coreBuscar();
          } else {
            this.messageShow('warn', 'error', this.getMensajeErrorAprobar());
            return;
          }
        });

      },
      reject: async () => {
        // this.visible = false;
      }
    });



  }
  async coreBuscar() {
    this.bloquearPag = true;
    console.log("filtro",this.filtro);
    
    const respEgreso = await this.egresoservice.ListarEgreso(this.filtro);
    let contador: number = respEgreso.length;
    respEgreso.forEach(element => { element.num = contador--; });
    this.lstEgreso = respEgreso;
    this.bloquearPag = false;
    console.log("coreBuscar lstEgreso", this.lstEgreso);
  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
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
  async listarComboEstados() {
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null, });
    this.getMiscelaneos()
      .filter((x) => x.CodigoTabla == "ESTEGR")
      .forEach((i) => {
        this.lstEstados.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
      });
  }

  exportExcel() {
    if (this.lstEgreso == null || this.lstEgreso == undefined || this.lstEgreso.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportarEgreso: IEgreso[] = [];
      let listaExportarEgresoDetalle: IEgresoDetalle[] = [];
      let contador: number = 0;
      let fechaEgreso: string;
      let fechaEgresoDetalle: string;
      this.lstEgreso.forEach(e => {
        contador += 1;
        if (e.FechaCreacion != null || e.FechaCreacion != undefined) {
          let fechaCreacion = new Date(e.FechaCreacion);
          let dd = ("0" + fechaCreacion.getDate()).slice(-2);
          let mm = ("0" + (fechaCreacion.getMonth() + 1)).slice(-2);
          let yyyy = fechaCreacion.getFullYear();

          fechaEgreso = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaEgreso = '';
        }

        let itemExportar: IEgreso = {
          NRO: contador,
          FECHA: fechaEgreso,
          DOCUMENTO: e.Documento?.toUpperCase() || '',
          EMPLEADO: e.Empleado?.toUpperCase() || '',
          SUB_TOTAL: new Intl.NumberFormat().format(e.MontoAfecto),
          IGV: new Intl.NumberFormat().format(e.MontoImpuesto),
          TOTAL: new Intl.NumberFormat().format(e.MontoTotal),
        };
        listaExportarEgreso.push(itemExportar);

      });

      this.exportarService.exportExcel(this.lstEgreso, listaExportarEgreso, "egresos");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });

    }
  }


  async exportPdf() {

    if (this.lstEgreso == null || this.lstEgreso == undefined || this.lstEgreso.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportarEgreso: IEgreso[] = [];
      let listaExportarEgresoDetalle: IEgresoDetalle[] = [];
      let contador: number = 0;
      let fechaEgreso: string;
      let fechaEgresoDetalle: string;

      var col = [[
        "NRO",
        "FECHA",
        "DOCUMENTO",
        "EMPLEADO",
        "SUB_TOTAL",
        "IGV",
        "TOTAL",
      ]];
      var rows = [];

      this.lstEgreso.forEach(e => {
        contador += 1;
        if (e.FechaCreacion != null || e.FechaCreacion != undefined) {
          let fechaCreacion = new Date(e.FechaCreacion);
          let dd = ("0" + fechaCreacion.getDate()).slice(-2);
          let mm = ("0" + (fechaCreacion.getMonth() + 1)).slice(-2);
          let yyyy = fechaCreacion.getFullYear();

          fechaEgreso = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaEgreso = '';
        }


        let itemExportar = [
          contador,
          fechaEgreso,
          e.Documento?.toUpperCase() || '',
          e.Empleado?.toUpperCase() || '',
          new Intl.NumberFormat().format(e.MontoAfecto),
          new Intl.NumberFormat().format(e.MontoImpuesto),
          new Intl.NumberFormat().format(e.MontoTotal),
        ];
        rows.push(itemExportar);

      });

      const result = await this.exportarService.ExportPdf(this.lstEgreso, col, rows, "egresos.pdf", "l");
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



  async cargarTipoComprobante(): Promise<boolean> {
    this.lstTipoComprobante = [];
    this.lstTipoComprobante.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipoComprobante.push({ label: i.Nombre.trim().toUpperCase(), value: i.Codigo.trim() });
    });

    if (this.lstTipoComprobante.length == 0) {
      return false;
    } else {
      return true;
    }
  }
}
