import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { Maestro } from '../../FormMaestro/model/maestro';
import { TipoCambioMantenimientoComponent } from '../components/tipo-cambio-mantenimiento.component';
import { DtoTipocambiomast } from '../dominio/dto/DtoTipocambiomast';
import { ITipoCambio } from '../dominio/dto/itipocambio';
import { Filtrotipodecambio } from '../dominio/filtro/Filtrotipodecambio';
import { MaestrotipocambioService } from '../servicio/maestrotipocambio.service';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-tipo-cambio',
  templateUrl: './tipo-cambio.component.html',
  styleUrls: ['./tipo-cambio.component.scss']
})
export class TipoCambioComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  @ViewChild(TipoCambioMantenimientoComponent, { static: false }) tipoCambioMantenimientoComponent: TipoCambioMantenimientoComponent;
  dto: Maestro[] = [];
  filtro: Filtrotipodecambio = new Filtrotipodecambio();
  lstEstado: SelectItem[] = [];
  bloquearPag: boolean = false;
  lstMaestroTipoCambio: any[] = [];
  lstSeleccionadomultiple: any[] = [];
  ltsExportar: MenuItem[];
  maxDate: Date = new Date();
  constructor(
    private messageService: MessageService,
    private exportarService: ExportarService,
    private confirmationService: ConfirmationService,
    private maestrotipocambioService: MaestrotipocambioService,
    private toastrService: NbToastrService) {
    super();
    this.maxDate.setFullYear(this.maxDate.getFullYear());
  }

  ngOnDestroy() {
    this.maxDate = undefined;

  }

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    // let dw = new Maestro()
    // dw.CodigoTabla="01"
    // dw.Descripcion="PRUEBA DESCRI"
    // dw.Nombre="NOMBRE DETALLE"
    // dw.Estado=2
    // this.dto.push(dw)
    const p1 = this.cargarEstados();
    //const p2 = this.filtro.fechacambio = new Date();
    //const p3 = this.filtro.ultimafechamodif = new Date();
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
    Promise.all([p1]).then((resp) => {
      this.fechaActual();
      console.log("messelaneos:", this.getMiscelaneos());

    });

  }

  fechaActual() {
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() + 1;
    var anio = hoy.getFullYear();
    this.filtro.fechacambio = new Date(`${anio},${mes},${dia}`);
    this.filtro.ultimafechamodif = new Date(`${anio},${mes},${dia}`);

  }



  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECTOR_TIPOCAMBIO") {
      this.coreBuscar();
    }
  }






  coreNuevo(): void {

    this.tipoCambioMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_TIPOCAMBIO', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }
  coreEditar(row) {
    this.tipoCambioMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_TIPOCAMBIO', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, row);
  }
  coreVer(row) {
    this.tipoCambioMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_TIPOCAMBIO', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row);
  }


  coreBuscar(): void {
    this.bloquearPag = true;
    let isFechaUnica: boolean;
    if (this.filtro.ultimafechamodif == null || this.filtro.ultimafechamodif == undefined) {
      this.filtro.ultimafechamodif = new Date();
      isFechaUnica = true;
    }
    this.maestrotipocambioService.listarmaestroTipoCambio(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lstMaestroTipoCambio = res;
      console.log("maestro TIPO CAMBIO listado:", res);

    });
    if (isFechaUnica == true) {
      this.filtro.ultimafechamodif = undefined;
    }
  }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }

  async exportExcel() {
    if (this.lstMaestroTipoCambio == null || this.lstMaestroTipoCambio == undefined || this.lstMaestroTipoCambio.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      this.bloquearPag = await true;
      let listaExportar: ITipoCambio[] = [];
      let contador: number = 0;
      let fechaCambio: string;
      this.lstMaestroTipoCambio.forEach(function (e: DtoTipocambiomast) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCambio);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
        let yyyy = fechaInicio.getFullYear()
        fechaCambio = dd + "/" + mm + "/" + yyyy;

        let itemExportar: ITipoCambio = {
          NRO: contador,
          FECHA: fechaCambio || '',
          MONEDA_DE: e.DesMonedaDE?.toUpperCase() || '',
          VENTA: new Intl.NumberFormat().format(e.FactorVenta),
          COMPRA: new Intl.NumberFormat().format(e.FactorCompra),
          ESTADO: e.EstadoDesc?.toUpperCase() || ''
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });

      const result = await this.exportarService.exportExcel(this.lstMaestroTipoCambio, listaExportar, "Tipos de Cambios");
      console.log(result);

      this.bloquearPag = await false;
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });
    }
  }

  //pdf

  async exportPdf() {
    if (this.lstMaestroTipoCambio == null || this.lstMaestroTipoCambio == undefined || this.lstMaestroTipoCambio.length == 0) {
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
        "MONEDA_DE",
        "VENTA",
        "COMPRA",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCambio: string;
      this.lstMaestroTipoCambio.forEach(function (e: DtoTipocambiomast) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCambio);
        let dd = fechaInicio.getDate() <= 9 ? "0" + fechaInicio.getDate() : fechaInicio.getDate();
        // let mm = fechaInicio.getMonth() == 0 ? "01" : fechaInicio.getMonth() <= 9 ? "0" + fechaInicio.getMonth() : fechaInicio.getMonth() + 1;
        let mm = fechaInicio.getMonth() + 1;
        let yyyy = fechaInicio.getFullYear()
        fechaCambio = dd + "/" + mm + "/" + yyyy;

        let itemExportar = [
          contador,
          fechaCambio,
          e.DesMonedaDE?.toUpperCase() || '',
          new Intl.NumberFormat().format(e.FactorVenta),
          new Intl.NumberFormat().format(e.FactorCompra),
          e.EstadoDesc?.toUpperCase() || ''
        ];
        rows.push(itemExportar);
      });

      const result = await this.exportarService.ExportPdf(this.lstMaestroTipoCambio, col, rows, "Tipo de Cambio.pdf", "l");
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

  coreSalir(): void {
    throw new Error('Method not implemented.');
  }


  cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstado.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });
  }

  async coreinactivar(dtoInactivar) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: async () => {

        /**AUDITORIA*/
        dtoInactivar.UltimoUsuario = this.getUsuarioAuth().data[0].Documento;
        dtoInactivar.UltimaFechaModif = new Date();
        dtoInactivar.IpModificacion = this.getIp();

        dtoInactivar.Estado = 'I';
        const respInactivar = await this.maestrotipocambioService.mantenimientoMaestro(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, dtoInactivar, this.getUsuarioToken());
        if (respInactivar != null) {
          if (respInactivar.success) {
            this.messageShow('success', 'success', this.getMensajeInactivo());
            this.coreBuscar();
          } else {
            this.messageShow('warn', 'Advertencia', this.getMensajeErrorinactivar());
          }
        } else {
          this.messageShow('warn', 'Advertencia', this.getMensajeErrorinactivar());
        }

      },

    });
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }
}
