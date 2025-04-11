import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { MaestroBancoMantenimientoComponent } from '../components/maestro-banco-mantenimiento.component';
import { DtoBanco } from '../dominio/dto/DtoBanco';
import { IBanco } from '../dominio/dto/ibanco';
import { FiltroBanco } from '../dominio/filtro/FiltroBanco';
import { MaestroBancoService } from '../servicio/maestro-banco.service';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-maestro-banco-listado',
  templateUrl: './maestro-banco-listado.component.html',
  styleUrls: ['./maestro-banco-listado.component.scss']
})
export class MaestroBancoListadoComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  lstTablaMaestro: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  bloquearPag: boolean;
  @ViewChild(MaestroBancoMantenimientoComponent, { static: false }) maestroBancoMantenimientoComponent: MaestroBancoMantenimientoComponent;
  dto: DtoBanco[] = [];
  lstMaestroDetalle: any[] = [];
  filtro: FiltroBanco = new FiltroBanco();
  lstSeleccionadomultiple: any[] = [];
  ltsExportar: MenuItem[];
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private maestroBancoService: MaestroBancoService,
    private toastrService: NbToastrService,
    private exportarService: ExportarService,) {
    super();
  }


  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    const p1 = this.cargarEstados();
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
      this.bloquearPag = false;
    });


  }

  coreNuevo(): void {
    this.maestroBancoMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_BANCO', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo.toUpperCase());
  }
  coreEditar(row) {
    this.maestroBancoMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_BANCO', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo.toUpperCase(), row);
  }
  coreVer(row) {
    this.maestroBancoMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_BANCO', ''), "VER", this.objetoTitulo.menuSeguridad.titulo.toUpperCase(), row);
  }

  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
  }


  coreBuscar(): void {
    if (!this.estaVacio(this.filtro.descripcioncorta)) {
      this.filtro.descripcioncorta = this.filtro.descripcioncorta.trim();
    }

    if (this.estaVacio(this.filtro.descripcioncorta)) {
      this.filtro.descripcioncorta = null;
    }

    this.bloquearPag = true;
    this.maestroBancoService.listarmaestroBancos(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lstMaestroDetalle = res;
      console.log("maestro listado:", res);
    });

  }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }

  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECTOR_BANCO") {
      this.coreBuscar();
    }
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
      let listaExportar: IBanco[] = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstMaestroDetalle.forEach(function (e: DtoBanco) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCreacion);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
        let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar: IBanco = {
          NRO: contador,
          CODIGO: e.Banco?.toUpperCase() || '',
          NOMBRE: e.DescripcionCorta?.toUpperCase() || '',
          EMAIL: e.CorreoElectronico?.toUpperCase() || '',
          NOMBRE_COMPLETO: e.DescripcionLarga?.toUpperCase() || '',
          // FECHA: fechaCreacion,
          ESTADO: e.ESTADOdesc?.toUpperCase() || '',
          TELEFONO: e.Telefono?.toUpperCase() || ''
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lstMaestroDetalle, listaExportar, "BANCOS");
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
        "BANCO",
        "EMAIL",
        "TELEFONO",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstMaestroDetalle.forEach(function (e: DtoBanco) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCreacion);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
        let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar = [
          contador,
          fechaCreacion,
          e.Banco?.toUpperCase() || '',
          e.DescripcionCorta?.toUpperCase() || '',
          e.CorreoElectronico?.toUpperCase() || '',
          e.Telefono?.toUpperCase() || '',
          e.ESTADOdesc?.toUpperCase() || ''
        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lstMaestroDetalle, col, rows, "BANCOS.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }

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
        dtoInactivar.estado = 'I';
        const respInactivar = await this.maestroBancoService.mantenimientoMaestro(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, dtoInactivar, this.getUsuarioToken());
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
