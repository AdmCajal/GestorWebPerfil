import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { Parametros } from '../../Parametros/model/parametros';
import { filtroParametros } from '../../Parametros/model/filtro.parametros';
import { ParametrosService } from '../service/parametros.service';
import { ParametrosMantenimientoComponent } from '../components/parametros-mantenimiento.component';
import { Table } from 'primeng/table';
import { UsuarioAuth } from '../../../auth/model/usuario';
import Swal from 'sweetalert2';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { IParametro } from '../model/iparametro';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.scss']
})

export class ParametrosComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(ParametrosMantenimientoComponent, { static: false }) parametrosMantenimientoComponent: ParametrosMantenimientoComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  bloquearPag: boolean;
  filtro: filtroParametros = new filtroParametros();
  Entydad: Parametros = new Parametros();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  lstEstado: SelectItem[] = [];
  lstparametros: any[] = [];
  lstCompania: SelectItem[] = [];
  ltsExportar: MenuItem[];

  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  position: string = 'top'
  titulo: string;


  constructor(
    private exportarService: ExportarService,
    private messageService: MessageService,
    private toastrService: NbToastrService,
    private ParametrosService: ParametrosService,
    private confirmationService: ConfirmationService,
    private maestrocompaniaMastService: MaestrocompaniaMastService) {
    super();
  }


  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    const p2 = this.cargarEstados();
    const p3 = this.cargarCombocompania();
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
    Promise.all([p2, p3]).then(
      f => {
        setTimeout(() => {
          this.bloquearPag = false;
        }, 100);
      });
  }

  cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstado.push({ label: i.Nombre.toUpperCase(), value: i.Codigo });
    });
    console.log("llego cargarEstados", this.lstEstado);
    this.filtro.Estado = "A";
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
        this.ParametrosService.mantenimientoParametros(2, row, this.getUsuarioToken()).then(
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

  cargarCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
      console.log("listarCompaniaMast", res);
      res.forEach(ele => {
        //  this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
        this.lstCompania.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
      });
      return 1;
    });
  }

  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECTOR_PARAMETROS") {
      this.coreBuscar();
    }

  }

  coreNuevo(): void {
    this.parametrosMantenimientoComponent.cargarAcciones(new MensajeController(this, 'SELECTOR_PARAMETROS', ''),ConstanteUI.ACCION_SOLICITADA_NUEVO, this.objetoTitulo.menuSeguridad.titulo);
  }

  coreBuscar(): void {
    console.log("llego coreBuscar");

    if (this.filtro.AplicacionCodigo == "") {
      this.filtro.AplicacionCodigo = null;
    }
    if (this.filtro.DescripcionParametro == "") {
      this.filtro.DescripcionParametro = null;
    }
    if (this.filtro.Estado == "") {
      this.filtro.Estado = null;
    }
    console.log("llego filtro", this.filtro);
    this.bloquearPag = true;

    this.ParametrosService.listarParametros(this.filtro).then((res) => {
      var contado = 1;
      res.forEach(element => {
        element.num = contado++;
        element.CompaniaCodigo = element.CompaniaCodigo.trim();
      });
      console.log("consulta listarParametros:", res);
      this.lstparametros = res;
      setTimeout(() => {
        this.bloquearPag = false;
      }, 500);
    });
  }

  coreInvactivar(event: any) {
    console.log("llego coreInvactivar", event);
    Swal.fire({
      title: 'Importante',
      text: "¿Seguro que desea anular el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#094d74',
      cancelButtonColor: '#ffc72f',
      cancelButtonText: '¡No, Cancelar!',
      confirmButtonText: '¡Si, Anular!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bloquearPag = true;
        event.Estado = "I";
        event.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
        this.ParametrosService.mantenimientoParametros(3, event, this.getUsuarioToken()).then(
          res => {
            console.log("entro el servicio", res);
            if (res.success == true) {
              this.toastMensaje('Se Anuló el registro con éxito.', 'success', 2000);
              setTimeout(() => {
              }, 500);
              this.coreBuscar();
            } else {
              this.toastMensaje('No se pudo Anular el Registro. ' + res.message, 'info', 2000);
            }

          }).catch(error => error)
      }
      this.bloquearPag = false;
    })
  }


  exportExcel() {
    if (this.lstparametros == null || this.lstparametros == undefined || this.lstparametros.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: IParametro[] = [];
      let contador: number = 0;
      let fechaCreacion: string;
      let fechaP: string;
      this.lstparametros.forEach(function (e: Parametros) {
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

        if (e.Fecha != null || e.Fecha != undefined) {
          let fechaI = new Date(e.Fecha);
          let dd = ("0" + fechaI.getDate()).slice(-2);
          let mm = ("0" + (fechaI.getMonth() + 1)).slice(-2);
          let yyyy = fechaI.getFullYear()
          fechaP = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaP = ''
        }

        let itemExportar: IParametro = {
          NRO: contador,
          // FECHA: fechaCreacion,
          COMPAÑIA: e.DescripcionCorta,
          FECHAP: fechaP,
          CODIGO: e.AplicacionCodigo?.toUpperCase() || '',
          TEXTO: e.Texto?.toUpperCase() || '',
          PARAMETRO: e.ParametroClave?.toUpperCase() || '',
          VALOR: new Intl.NumberFormat().format(e.Numero),
          TIPO_DATO: e.TipodeDatoFlag?.toUpperCase() || '',
          DESCRIPCION: e.DescripcionParametro?.toUpperCase() || '',
          ESTADO: e.ESTADOdesc?.toUpperCase() || ''
          // EXPLICACION: e.Explicacion?.toUpperCase() || ''
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lstparametros, listaExportar, "Parametros");
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
    if (this.lstparametros == null || this.lstparametros == undefined || this.lstparametros.length == 0) {
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
        "CODIGO",
        "PARAMETRO",
        "DESCRIPCION",
        "ESTADO",
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstparametros.forEach(function (e: Parametros) {
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
          contador,
          fechaCreacion,
          e.DescripcionCorta,
          e.AplicacionCodigo.toUpperCase() || '',
          e.ParametroClave?.toUpperCase() || '',
          e.DescripcionParametro?.toUpperCase() || '',
          e.ESTADOdesc?.toUpperCase() || '',

        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lstparametros, col, rows, "Parametros.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }

  }

  coreVer(event: any) {
    console.log("llego BtncoreVer  ", event);
    this.Entydad = event;
    console.log("llego Entydad  ", this.Entydad);
    this.parametrosMantenimientoComponent.cargarAcciones(new MensajeController(this, 'SELECTOR_PARAMETROS', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, this.Entydad);
  }

  coreEditar(event: any) {
    console.log("llego BtncoreEditar  ", event);
    this.Entydad = event;
    this.parametrosMantenimientoComponent.cargarAcciones(new MensajeController(this, 'SELECTOR_PARAMETROS', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, this.Entydad)
  }

  onRowSelect(event: any) {
    console.log("seleccion onRowSelect:", event);
  }

  /*    MENSAJES DE CONFIRMACIÓN    */
  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
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

}
