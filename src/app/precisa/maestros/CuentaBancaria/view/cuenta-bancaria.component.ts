import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { Maestro } from '../../FormMaestro/model/maestro';
import { DtoCuentaBancaria } from '../model/DtoCuentaBancaria';
import { FiltroCuentaBancaria } from '../model/FiltroCuentaBancaria';
import { ICuentaBancaria } from '../model/icuentabancaria';
import { CuentaBancariaService } from '../service/cuentabancaria.service';
import { CuentaBancariaBuscarComponent } from './components/cuenta-bancaria-buscar.component';
import { CuentaBancariaMantenimientoComponent } from './components/cuenta-bancaria-mantenimiento.component';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-cuenta-bancaria',
  templateUrl: './cuenta-bancaria.component.html',
  styleUrls: ['./cuenta-bancaria.component.scss']
})
export class CuentaBancariaComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  @ViewChild(CuentaBancariaMantenimientoComponent, { static: false }) componentMantenimientoComponent: CuentaBancariaMantenimientoComponent;
  @ViewChild(CuentaBancariaBuscarComponent, { static: false }) componentBuscarComponent: CuentaBancariaBuscarComponent;
  filtro: FiltroCuentaBancaria = new FiltroCuentaBancaria();
  tipocambio: number = 4.00
  igv: 0.18;
  bloquearPag: boolean = false;
  lstcuentasbancariastb: any[] = [];
  lstEstado: SelectItem[] = [];
  lstCompania: SelectItem[] = [];
  dto: Maestro[] = [];
  filtrocompany: FiltroCompaniamast = new FiltroCompaniamast();
  ltsExportar: MenuItem[];
  constructor(
    private messageService: MessageService,
    private cuentaBancariaService: CuentaBancariaService,
    private confirmationService: ConfirmationService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private toastrService: NbToastrService,
    private exportarService: ExportarService,) {
    super();
  }


  ngOnInit(): void {
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

    });
  }




  coreBuscar(): void {
    this.bloquearPag = true;
    this.cuentaBancariaService.listarCuentaBancaria(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = res.length;
      res.forEach(element => {
        element.num = contado--;
      });
      this.lstcuentasbancariastb = res;
      console.log("maestro TIPO CAMBIO listado:", res);

    });
    this.bloquearPag = false;
  }

  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECTOR_CUENTABANCARIA") {
      this.coreBuscar();
    }
  }



  coreNuevo(): void {
    this.componentMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_CUENTABANCARIA', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }
  coreEditar(row) {
    this.componentMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_CUENTABANCARIA', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, row);
  }
  coreVer(row) {
    this.componentMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_CUENTABANCARIA', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row);
  }

  verSelectorEmpresa(): void {
    this.componentBuscarComponent.iniciarComponente("BUSCADOR EMPRESAS", this.objetoTitulo.menuSeguridad.titulo)
  }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }


  exportExcel() {
    if (this.lstcuentasbancariastb == null || this.lstcuentasbancariastb == undefined || this.lstcuentasbancariastb.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: ICuentaBancaria[] = [];
      let contador: number = 0;
      this.lstcuentasbancariastb.forEach(function (e: DtoCuentaBancaria) {
        contador += 1;

    

        let itemExportar: ICuentaBancaria = {
          NRO: contador,
          COMPAÑIA: e.DesCompania?.toUpperCase() || '',
          BANCO: e.DesBanco?.toUpperCase() || '',
          NRO_CUENTA: e.Descripcion,
          MONEDA: e.DesMoneda?.toUpperCase() || '',
          ESTADO: e.ESTADOdesc?.toUpperCase() || ''
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lstcuentasbancariastb, listaExportar, "Cuenta Bancaria");
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
    if (this.lstcuentasbancariastb == null || this.lstcuentasbancariastb == undefined || this.lstcuentasbancariastb.length == 0) {
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
        "BANCO",
        "NRO_CUENTA",
        "MONEDA",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstcuentasbancariastb.forEach(function (e: DtoCuentaBancaria) {
        contador += 1;
        let fechaInicio = new Date(e.FechaCreacion);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
        let yyyy = fechaInicio.getFullYear()
        fechaCreacion = dd + "/" + mm + "/" + yyyy;

        let itemExportar = [
          contador,
          fechaCreacion,
          e.DesCompania?.toUpperCase() || '',
          e.DesBanco?.toUpperCase() || '',
          e.Descripcion,
          e.DesMoneda?.toUpperCase() || '',
          e.ESTADOdesc?.toUpperCase() || ''
        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lstcuentasbancariastb, col, rows, "Cuenta_Bancaria.pdf", "l");
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


  cargarCombocompania(): Promise<number> {
    this.filtrocompany.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.filtrocompany).then(res => {
      console.log("probando", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
      });
      return 1;
    });
  }



  coreinactivar(dtoInactivar) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: async () => {
        /**AUDITORIA */
        dtoInactivar.UltimoUsuario = this.getUsuarioAuth().data[0].Documento;
        dtoInactivar.UltimaFechaModif = new Date();
        dtoInactivar.Estado = 'I';
        const respInactivar = await this.cuentaBancariaService.mantenimientoCuentaBancaria(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, dtoInactivar, this.getUsuarioToken());
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
      }
    });
  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }
  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
  }

}
