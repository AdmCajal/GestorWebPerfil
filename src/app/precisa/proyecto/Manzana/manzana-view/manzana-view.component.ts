import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Table } from 'primeng/table';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { ManzanaMantenimientoComponent } from '../manzana-mantenimiento/manzana-mantenimiento.component';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { FiltroWcoSede } from '../../../maestros/Sedes/dominio/filtro/FiltroWcoSede';
import { SelectItem, MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ManzanaService } from '../service/manzana.service';
import { FiltroManzana } from '../model/FiltroManzana';
import { FiltroPrograma } from '../../Programa/model/FiltroPrograma';
import { ProgramaService } from '../../Programa/service/programa.service';
import 'jspdf-autotable';
import { IManzana } from '../model/IManzana';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { DtoManzana } from '../model/DtoManzana';
import { LotesImagenComponent } from '../../Lotes/lotes-imagen/lotes-imagen.component';
@Component({
  selector: 'ngx-manzana-view',
  templateUrl: './manzana-view.component.html',
  styleUrls: ['./manzana-view.component.scss']
})
export class ManzanaViewComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(ManzanaMantenimientoComponent, { static: false }) manzanaMantenimientoComponent: ManzanaMantenimientoComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  @ViewChild(LotesImagenComponent, { static: false })
  lotesImagenComponent: LotesImagenComponent;

  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  lstManzanatb: DtoManzana[] = [];
  bloquearPag: boolean;
  lstCompania: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstManzana: SelectItem[] = [];
  ltsExportar: MenuItem[];
  filtro: FiltroManzana = new FiltroManzana();
  FiltroManzana: FiltroManzana = new FiltroManzana();
  filtroPrograma: FiltroPrograma = new FiltroPrograma();

  constructor(
    private exportarService: ExportarService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private manzanaService: ManzanaService,
    private programaService: ProgramaService,
    private maestroSucursalService: MaestroSucursalService,
    private maestrocompaniaMastService: MaestrocompaniaMastService) {
    super();
  }



  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    this.bloquearPag = true;
    const p1 = this.listarComboEstados();
    const p2 = this.cargarCombocompania();
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

    Promise.all([p1, p2]).then(
      f => {
        this.bloquearPag = false;

        console.log("ngOnInit MANZANA Promise:");
      });
  }

  coreBuscar(): void {
    this.bloquearPag = true;
    console.log("MANZANA coreBuscar:", this.filtro);
    console.log("Lote coreBuscar:", this.filtro);
    if (this.filtro.CompaniaCodigo == null) {
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
      this.filtro.IdManzana = null;
    }

    this.manzanaService.listarManzana(this.filtro).then((res: DtoManzana[]) => {
      this.bloquearPag = false;
      let contado: number = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lstManzanatb = res;
      console.log("maestro MANZANA listado:", res);

    });
  }

  coreVerImagen(row) {
    this.lotesImagenComponent.iniciarComponenteMaestro(
      new MensajeController(this, "SELECTOR_LOTE", ""),
      "VER",
      this.objetoTitulo.menuSeguridad.titulo,
      row
    );
  }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }

  exportExcel() {
    if (this.lstManzanatb == null || this.lstManzanatb == undefined || this.lstManzanatb.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: IManzana[] = [];
      let contador: number = 0;
      let fecha: string;
      this.lstManzanatb.forEach(function (element) {
        contador += 1;
        if (element.FechaCreacion != null || element.FechaCreacion != undefined) {
          let fechaCreacion = new Date(element.FechaCreacion);
          let dd = ("0" + fechaCreacion.getDate()).slice(-2);
          let mm = ("0" + (fechaCreacion.getMonth() + 1)).slice(-2); let yyyy = fechaCreacion.getFullYear()
          fecha = dd + "/" + mm + "/" + yyyy;
        } else {
          fecha = '';
        }

        let manzanaExportar: IManzana = {
          NRO: contador,
          FECHA: fecha,
          COMPAÑIA: element.DescripcionCorta?.toUpperCase() || '',
          SUCURSAL: element.SedDescripcion?.toUpperCase() || '',
          PROGRAMA: element.NomProyecto?.toUpperCase() || '',
          MANZANA: element.Nombre?.toUpperCase(),
          ESTADO: element.Estado == 1 ? 'Activo'.toUpperCase() || '' : 'Inactivo'.toUpperCase() || ''
        }
        listaExportar.push(manzanaExportar);
      });
      this.exportarService.exportExcel(this.lstManzanatb, listaExportar, "Manzana");
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
    if (this.lstManzanatb == null || this.lstManzanatb == undefined || this.lstManzanatb.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let col = [["NRO", "FECHA", "COMPAÑIA", "SUCURSAL", "PROGRAMA", "MANZANA", "ESTADO"]];
      let rows = [];
      let contador: number = 0;
      let fecha: string;
      this.lstManzanatb.forEach(function (element) {
        contador += 1;
        if (element.FechaCreacion != null || element.FechaCreacion != undefined) {
          let fechaCreacion = new Date(element.FechaCreacion);
          let dd = ("0" + fechaCreacion.getDate()).slice(-2);
          let mm = ("0" + (fechaCreacion.getMonth() + 1)).slice(-2); let yyyy = fechaCreacion.getFullYear()
          fecha = dd + "/" + mm + "/" + yyyy;
        } else {
          fecha = '';
        }

        let manzanaExportar = [
          contador,
          fecha,
          element.DescripcionCorta?.toUpperCase() || '',
          element.SedDescripcion?.toUpperCase() || '',
          element.NomProyecto?.toUpperCase() || '',
          element.Nombre?.toUpperCase() || '',
          element.Estado == 1 ? 'Activo'?.toUpperCase() || '' : 'Inactivo'?.toUpperCase() || ''
        ]
        rows.push(manzanaExportar);
      });
      this.exportarService.ExportPdf(this.lstManzanatb, col, rows, "Manzana.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }
  }

  coreSalir(): void {

  }

  coreMensaje(mensage: MensajeController): void {
    console.log("coreMensaje llegando:", mensage.componente);
    if (mensage.componente == "SELECTOR_MANZANA") {
      this.coreBuscar();
    }
  }

  coreNuevo(): void {
    this.manzanaMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MANZANA', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }

  coreEditar(row) {
    this.manzanaMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MANZANA', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, row);
  }
  coreVer(row) {
    this.manzanaMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_MANZANA', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row);
  }


  listarComboEstados() {
    this.lstEstados.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  cargarCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.lstSucursal = [];
    this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.lstPrograma = [];
    this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
      console.log("listarCompaniaMast", res);
      res.forEach(ele => {
        //  this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
      });
      return 1;
    });
  }

  selectedItemcompania(event) {
    if (event.value != null) {
      console.log(" this.lstCompania:", this.lstCompania);
      console.log("seleccion:", event);
      let dato = this.lstCompania.filter(x => x.value == event.value);
      this.filtroSede.IdEmpresa = Number(dato[0].title);
      this.cargarCombosede(this.filtroSede.IdEmpresa);
      console.log("probando sucursal", this.lstSucursal);
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
    } else {
      this.lstSucursal = [];
      this.lstPrograma = [];
      this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    }
  }


  cargarCombosede(IdPersona: number): Promise<number> {
    if (IdPersona != undefined) {
      this.lstSucursal = [];
      this.filtroSede.SedEstado = 1;
      this.filtroSede.IdEmpresa = IdPersona;
      this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
        console.log("ListaSede", res);
        res.forEach(ele => {
          this.lstSucursal.push({ label: ele.SedDescripcion.trim(), value: ele.IdSede });
        });
        return 1;
      });
    }
    else {
      this.lstSucursal = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    }
  }


  selectedItemSucursal(event) {
    if (event.value != null) {
      console.log("event selectedItemSucursal", event);
      this.filtro.IdSede = event.value;
      this.cargarComboPrograma();
      this.filtro.IdProyecto = null;
    } else {
      this.lstPrograma = []
      this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    }
  }



  cargarComboPrograma(): Promise<number> {
    if (this.filtro.IdSede != undefined) {
      this.filtroPrograma.Estado = 1;
      this.filtroPrograma.IdSede = this.filtro.IdSede;
      this.lstPrograma = [];
      console.log("sede", this.filtro.IdSede);
      this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
      return this.programaService.listarPrograma(this.filtroPrograma).then((res) => {
        console.log("Combo Programa:", res);
        res.forEach(ele => {
          this.lstPrograma.push({ label: ele.Nombre.trim(), value: ele.IdProyecto });
        });
        return 1;
      });
    } else {
      this.lstPrograma = [];
      this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    }
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
        this.manzanaService.mantenimientoManzana(2, row, this.getUsuarioToken()).then(
          res => {
            if (res != null) {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Inactivado con éxito.' });
              this.coreBuscar();
            }
          });
      },

    });
  }



}
