import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { FiltroWcoSede } from '../../../maestros/Sedes/dominio/filtro/FiltroWcoSede';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { DtoLote } from '../../../proyecto/Lotes/model/DtoLote';
import { FiltroLote } from '../../../proyecto/Lotes/model/FiltroLote';
import { LoteService } from '../../../proyecto/Lotes/service/lotes.service';
import { FiltroManzana } from '../../../proyecto/Manzana/model/FiltroManzana';
import { ManzanaService } from '../../../proyecto/Manzana/service/manzana.service';
import { FiltroPrograma } from '../../../proyecto/Programa/model/FiltroPrograma';
import { ProgramaService } from '../../../proyecto/Programa/service/programa.service';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { DtoReserva } from '../model/DtoReserva';
import { FiltroReserva } from '../model/FiltroReserva';
import { ReservaService } from '../service/reserva.service';

@Component({
  selector: 'ngx-buscar-reserva',
  templateUrl: './buscar-reserva.component.html',
  styleUrls: ['./buscar-reserva.component.scss']
})
export class BuscarReservaComponent extends ComponenteBasePrincipal implements OnDestroy, UIMantenimientoController {
  mensajeController: MensajeController
  bloquearPag: boolean;
  acciones: string = 'BUSCAR'
  position: string = 'top'
  dialog: boolean;
  titulo: string;

  lstTipoDocumento: SelectItem[] = [];
  filtroPrograma: FiltroPrograma = new FiltroPrograma();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  FiltroManzana: FiltroManzana = new FiltroManzana();
  filtro: FiltroReserva = new FiltroReserva();
  FiltroLote: FiltroLote = new FiltroLote();
  lstSeleccionadomultiple: any[] = [];
  lstCompania: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstManzana: SelectItem[] = [];
  lstLote: SelectItem[] = [];
  lstEstadoLote: SelectItem[] = [];
  lstEstadoSeparacion: SelectItem[] = [];
  lstReserva: DtoReserva[] = [];
  Reservaseleccionado: DtoReserva = new DtoReserva();
  isbuscadorNombre = true;
  isbuscadorDocumento = false;

  constructor(private programaService: ProgramaService,
    private manzanaService: ManzanaService,
    private loteService: LoteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private maestroSucursalService: MaestroSucursalService,
    private reservaService: ReservaService
  ) {
    super();
    this.ngOnDestroy();
  }
  ngOnDestroy(): void {
    this.bloquearPag = false;
    this.dialog = false;
    this.acciones = '';
    this.position = 'top';
    this.puedeEditar = false;
    this.titulo = '';
    this.filtroPrograma = new FiltroPrograma();
    this.FiltroCompan = new FiltroCompaniamast();
    this.filtroSede = new FiltroWcoSede();
    this.FiltroManzana = new FiltroManzana();
    this.filtro = new FiltroReserva();
    this.FiltroLote = new FiltroLote();
    this.lstSeleccionadomultiple = [];
    this.lstCompania = [];
    this.lstSucursal = [];
    this.lstPrograma = [];
    this.lstManzana = [];
    this.lstLote = [];
    this.lstEstadoLote = [];
    this.lstEstadoSeparacion = [];
    this.lstReserva = [];
    this.Reservaseleccionado = new DtoReserva();
  }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }
  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }
  validarTeclaEnter(event) {
    if (event.key == "Enter") {
       console.log("Buscar Enter", event)
      this.coreBuscar();
    }
  }
  coreBuscar(): void {
    this.bloquearPag = true;
      this.filtro.Estado = 2;
     console.log("Lote coreBuscar:", this.filtro);
    this.reservaService.listarReserva(this.filtro).then((res) => {
      this.bloquearPag = false;
      var contado = 1;

      res.forEach((element) => {
        element.num = contado++;
        element.DesMoneda = element.MonedaCodigo == "EX" ? "DOLARES" : "LOCAL";
      });
      this.lstReserva = res.filter(e => e.Estado < 3);
      console.log("RESERVAS", this.lstReserva);
    });
  }

  listaComboTipoDocumento() {
    this.lstTipoDocumento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPODOCIDENTID").forEach(i => {
      this.lstTipoDocumento.push({ label: i.Nombre, value: i.Codigo })
    });
  }
  
  ondobleRowDblclick(rowData: any) {
    this.dialog = false;
    this.Reservaseleccionado = rowData;
    this.coreSeleccionar(this.Reservaseleccionado);

  }
  coreSeleccionar(dto: any) {
    this.mensajeController.resultado = dto;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    console.log("data del persona", dto)
    this.coreSalir();

    //this.limpiarBuscador();
  }
  coreIniciarComponente(msj: MensajeController, accionform: string) {
    const p0 = this.ngOnDestroy();
    const p1 = this.cargarCombocompania();
    const p2 = this.cargarComboEstadoSeparacion();
    const p3 = this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    const p4 = this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    const p5 = this.lstManzana.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    const p6 = this.lstLote.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    const p7 = this.listaComboTipoDocumento();
    Promise.all([p0, p1, p2, p3, p4, p5, p6,p7]).then(resp => {
      this.mensajeController = msj;
      this.dialog = true;
      this.titulo = `SEPARACIÓN DE LOTE: ${accionform}`;
      this.acciones = `${accionform}`;
    });
  }
  cargarCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
      console.log("listarCompaniaMast", res);
      res.forEach(ele => {
        //  this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
      });
      return 1;
    });
  }
  cargarCombosede(IdPersona: number): Promise<number> {
    this.lstSucursal = [];
    this.filtroSede.SedEstado = 1;
    this.filtroSede.IdEmpresa = IdPersona;
    this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
      res.forEach((ele) => {
        this.lstSucursal.push({ label: ele.SedDescripcion.trim(), value: ele.IdSede, });
      });
      return 1;
    });
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
          this.lstPrograma.push({ label: ele.Nombre.trim(), value: ele.IdProyecto });
        });
        this.filtro.IdProyecto = null;
        return 1;
      });
    } else {
      this.lstPrograma = []
      this.lstPrograma.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    }
  }
  cargarComboEstadoSeparacion() {
    this.lstEstadoSeparacion = [];
    this.lstEstadoSeparacion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTRESER").forEach(i => {
      console.log("ESTADO RESERVA", i);
      if (i.IdCodigo < 3) {
        this.lstEstadoSeparacion.push({ label: i.Nombre, value: i.IdCodigo })
      } else {
        return;
      }
    });
  }
  selectedItemcompania(event) {
    if (event.value != null) {
      var dato = this.lstCompania.filter((x) => x.value == event.value);
      this.filtroSede.IdEmpresa = Number(dato[0].title);
      this.cargarCombosede(this.filtroSede.IdEmpresa);
      this.filtro.IdSede = null;
      this.filtro.IdProyecto = null;
    } else {
      this.lstSucursal = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOTODOS, value: null });

    }
  }
  selectedItemPrograma(event) {
    if (event.value != null) {
      this.cargarComboManzana(event.value);
    } else {
      this.lstManzana = [];
      this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    }
  }
  cargarComboManzana(Id: number): Promise<number> {
    this.FiltroManzana.IdProyecto = Id;
    this.FiltroManzana.Estado = 1;
    this.lstManzana = [];
    console.log("FiltroManzana cargarComboManzana", this.FiltroManzana);
    this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.manzanaService.listarManzana(this.FiltroManzana).then((res) => {
      console.log("listarManzana", res);
      res.forEach(ele => {
        this.lstManzana.push({ label: ele.Nombre.trim(), value: ele.IdManzana });
      });
      return 1;
    });
  }
  selectedItemManzana(event) {
    if (event.value != null) {
      this.cargarComboLote(event.value);
    }
    else {
      this.lstLote = [];
      this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    }
  }
  cargarComboLote(Id: number): Promise<number> {
    this.FiltroLote.IdProyecto = this.filtro.IdProyecto;
    this.FiltroLote.IdManzana = Id;
    this.FiltroLote.Estado = 1;
    this.lstLote = [];
    console.log("FiltroLote cargarComboLote", this.FiltroLote);
    this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.loteService.listarLote(this.FiltroLote).then((res) => {

      sessionStorage.setItem('access_lstLote', JSON.stringify(res));
      res.forEach(ele => {

        if (ele.Condicion != 1 && ele.Condicion != 3) {
          this.lstLote.push({ label: ele.Nombre.trim() + "-" + ele.DesCondicion, value: ele.IdLote });
        }
      });
      console.log("lstLote", this.lstLote);
      return 1;
    });

  }
  checkdocumento() {
    this.isbuscadorNombre = false;
    this.isbuscadorDocumento = true;
    this.filtro.Cliente = '';
  }
  checknombre() {
    this.isbuscadorNombre = true;
    this.isbuscadorDocumento = false;
    this.filtro.Documento = '';
  }
}
