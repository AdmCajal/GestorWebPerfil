import { Usuario } from './../../../seguridad/usuarios/model/usuario';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { PersonaBuscarComponent } from '../../../framework-comun/Persona/components/persona-buscar.component';
import { FiltroWcoSede } from '../../../maestros/Sedes/dominio/filtro/FiltroWcoSede';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { FiltroManzana } from '../../../proyecto/Manzana/model/FiltroManzana';
import { ManzanaService } from '../../../proyecto/Manzana/service/manzana.service';
import { FiltroPrograma } from '../../../proyecto/Programa/model/FiltroPrograma';
import { ProgramaService } from '../../../proyecto/Programa/service/programa.service';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { EmpleadoMast } from '../../../maestros/Empleados/model/empleadomast';
import { DtoReserva } from '../model/DtoReserva';
import { ReservaService } from '../service/reserva.service';
import { FiltroReserva } from '../model/FiltroReserva';
import { PersonaMantenimientoComponent } from '../../../framework-comun/Persona/vista/persona-mantenimiento.component';
import { FiltroLote } from '../../../proyecto/Lotes/model/FiltroLote';
import { LoteService } from '../../../proyecto/Lotes/service/lotes.service';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { FiltroBanco } from '../../../maestros/maestroBanco/dominio/filtro/FiltroBanco';
import { MaestroBancoService } from '../../../maestros/maestroBanco/servicio/maestro-banco.service';
import { DtoLote } from '../../../proyecto/Lotes/model/DtoLote';
import { CuentaBancariaService } from '../../../maestros/CuentaBancaria/service/cuentabancaria.service';
import { FiltroCuentaBancaria } from '../../../maestros/CuentaBancaria/model/FiltroCuentaBancaria';
import { select } from '@ngrx/store';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-reserva-mantenimiento',
  templateUrl: './reserva-mantenimiento.component.html',
  styleUrls: ['./reserva-mantenimiento.component.scss']
})
export class ReservaMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;

  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = ''
  position: string = 'top'
  fechaInicio: Date;
  dto: DtoReserva = new DtoReserva();
  loteAReservar: any;
  loteEditar: DtoLote;
  cliente: EmpleadoMast = new EmpleadoMast();
  lstCompania: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstManzana: SelectItem[] = [];
  lstTipoInteres: SelectItem[] = [];
  lstLote: SelectItem[] = [];
  lstMoneda: SelectItem[] = [];
  lstTipoPago: SelectItem[] = [];
  lstcuentaBancaria: SelectItem[] = [];


  FiltroCuentaBancaria: FiltroCuentaBancaria = new FiltroCuentaBancaria();
  filtro: FiltroReserva = new FiltroReserva();
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  FiltroPrograma: FiltroPrograma = new FiltroPrograma();
  FiltroManzana: FiltroManzana = new FiltroManzana();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  lstEstadoReserva: SelectItem[] = [];
  FiltroLote: FiltroLote = new FiltroLote();
  lstBanco: any[] = [];
  FiltroBanco: FiltroBanco = new FiltroBanco();
  disabledBanco: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  minDateFin: Date = new Date();
  isEditClient: boolean;
  monedaCuenta: string;
  isEditEstPendiente: boolean;
  isEditEstPagado: boolean;
  isEditEstDisabled: boolean = true;

  constructor(

    private cuentaBancariaService: CuentaBancariaService,
    private maestroBancoService: MaestroBancoService,
    private manzanaService: ManzanaService,
    private loteService: LoteService,
    private maestroSucursalService: MaestroSucursalService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private reservaService: ReservaService,
    private messageService: MessageService,
    private programaService: ProgramaService
  ) {
    super();
    this.minDateFin.setDate(this.minDateFin.getDate() + 1);

  }
  btnCerrar() {
    this.lstSucursal = [];
    this.lstPrograma = [];
    this.lstManzana = [];
    this.lstLote = [];
    this.lstBanco = [];
    this.lstcuentaBancaria = [];
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstBanco.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstcuentaBancaria.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.fechaModificacion = undefined;
    this.fechaCreacion = undefined;
  }
  ngOnInit(): void {
    sessionStorage.removeItem('access_lstLote');
    this.fechaInicio = new Date();
    const p1 = this.cargarCombocompania();
    console.log("mantenimiento ngOnInit :", p1);
    const p2 = this.cargarMoneda();
    const p3 = this.cargarFormaPago();
    //const p4 = this.cargarComboBanco();
    const p5 = this.cargarComboEstadoSeparacion();
    Promise.all([p1, p2, p3, p5]).then((resp) => {
      this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.lstcuentaBancaria.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.lstBanco.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

      console.log("mantenimiento ngOnInit Promise:");
    });
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('access_lstLote');
  }

  async iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any,) {
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.bloquearPag = true;
    this.dto = new DtoReserva();
    this.lstcuentaBancaria = [];
    switch (this.validarform) {
      case "NUEVO":
        this.lstcuentaBancaria = [];
        this.lstcuentaBancaria.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
        this.lstBanco = [];
        this.lstBanco.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
        this.dto.FechaInicial = new Date();
        this.dto.FechaInicial.setHours(0);
        this.dto.FechaInicial.setMinutes(0);
        this.dto.FechaInicial.setSeconds(0);
        this.dto.MonedaCodigo = "EX";
        this.dto.Estado = 1;
        this.puedeEditar = false;
        console.log("mantenimiento iniciarComponenteMaestro 1:", this.dto);
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dto.UsuarioCreacion = this.usuario
        this.dto.FechaCreacion = new Date();
        this.fechaCreacion = this.dto.FechaCreacion;

        this.bloquearPag = false;
        console.log("mantenimiento iniciarComponenteMaestro 2:", this.dto);
        break;
      case "EDITAR":
        await this.cargarComboBanco();
        this.loteService.listarLote(this.FiltroLote).then((resp) => {
          resp.forEach(e => {
            if (e.IdLote == rowdata.IdLote) {
              this.loteEditar = e;
              return;
            }
          });
        });
        if (rowdata.Estado == 2) {
          this.messageService.add({
            key: "bc",
            severity: "warn",
            summary: "Advertencia",
            detail: "No se puede editar una RESERVA PAGADA.",
          });
          this.puedeEditar = true;
          this.bloquearPag = false;
          this.dialog = false;
          return;
        }
        if (rowdata.Estado == 3) {
          this.messageService.add({
            key: "bc",
            severity: "warn",
            summary: "Advertencia",
            detail: "No se puede editar una RESERVA ANULADA.",
          });
          this.puedeEditar = true;
          this.bloquearPag = false;
          this.dialog = false;
          return;
        }
        if (rowdata.Estado == 4) {
          this.messageService.add({
            key: "bc",
            severity: "warn",
            summary: "Advertencia",
            detail: "No se puede editar una RESERVA ANULADA.",
          });
          this.puedeEditar = true;
          this.bloquearPag = false;
          this.dialog = false;
          return;
        }
        if (rowdata.Estado > 4) {
          this.messageService.add({
            key: "bc",
            severity: "warn",
            summary: "Advertencia",
            detail: "No se puede editar Esta reserva.",
          });
          this.puedeEditar = true;
          this.bloquearPag = false;
          this.dialog = false;
          return;
        }
        console.log("EDITAR rowdata :", rowdata);
        const p5 = this.cargarSucursalEditar(rowdata.CompaniaCodigo);
        const p6 = this.cargarComboPrograma(rowdata.IdSede);
        const p7 = this.cargarComboManzana(rowdata.IdProyecto);
        const p8 = this.cargarComboLote(rowdata.IdManzana);
        const p90 = this.cuentaBancaria();
        console.log("ROWDATA", rowdata);

        Promise.all([p5, p6, p7, p8, p90]).then((resp) => {
          this.FiltroLote = new FiltroLote();

          this.filtro.IdReserva = rowdata.IdReserva;
          this.reservaService.listarReserva(this.filtro).then((res) => {
            console.log("res[0]", res[0]);
            this.bloquearPag = false;
            this.puedeEditar = false;
            //this.dto = rowdata;
            this.dto = res[0];
            console.log("HIRO MAN", res[0]);

            this.lstPrograma.forEach(e => {
              if (e.value == this.dto.IdProyecto) {
                this.dto.CuotaInicial = Number(e.icon);
                return;
              }
            });

            if (
              this.dto.TipoPago == "TB"

            ) {
              this.disabledBanco = false;

            } else {
              this.disabledBanco = false;
            }

            if (
              this.dto.TipoPago == "EF"
            ) {
              this.disabledBanco = true;
            }

            this.dto.FechaInicial = new Date(this.dto.FechaInicial);
            this.dto.FechaFinal = new Date(this.dto.FechaFinal);
            // this.dto.CuentaBancaria =Number(this.dto.CuentaBancaria.toString().trim());
            /**
             * Autor: Geampier Smc
             * tipo: cambio de logica
             */



            /*fin*/
            this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
            this.fechaCreacion = new Date(this.dto.FechaCreacion);
            // if (this.dto.FechaModificacion != null || this.dto.FechaModificacion != undefined) {
            //   this.fechaModificacion = new Date(this.dto.FechaModificacion);
            // }
            this.fechaModificacion = new Date();
            this.lstLote.push({ label: this.dto.Lote.trim() + "-" + "ACTUAL", value: this.dto.IdLote });
            this.selectedItemLote(this.dto.IdLote);
          });

        });
        break;
      case "VER":
        await this.cargarComboBanco();
        this.loteService.listarLote(this.FiltroLote).then((resp) => {
          resp.forEach(e => {
            if (e.IdLote == rowdata.IdLote) {
              this.loteEditar = e;
              return;
            }
          });
        });

        console.log("EDITAR rowdata :", rowdata);
        const p9 = this.cargarSucursalEditar(rowdata.CompaniaCodigo);
        const p10 = this.cargarComboPrograma(rowdata.IdSede);
        const p11 = this.cargarComboManzana(rowdata.IdProyecto);
        const p12 = this.cargarComboLote(rowdata.IdManzana);
        const p91 = this.cuentaBancaria();
        console.log("ROWDATA", rowdata);

        Promise.all([p9, p10, p11, p12, p91]).then((resp) => {
          this.FiltroLote = new FiltroLote();

          this.filtro.IdReserva = rowdata.IdReserva;
          this.reservaService.listarReserva(this.filtro).then((res) => {
            console.log("res[0]", res[0]);
            this.bloquearPag = false;
            this.puedeEditar = true;
            this.disabledBanco = true;
            //this.dto = rowdata;
            this.dto = res[0];


            this.disabledBanco = true;

            this.dto.FechaInicial = new Date(this.dto.FechaInicial);
            this.dto.FechaFinal = new Date(this.dto.FechaFinal);
            /**
             * Autor: Geampier Smc
             * tipo: cambio de logica
             */

            this.lstPrograma.forEach(e => {
              if (e.value == this.dto.IdProyecto) {
                this.dto.CuotaInicial = Number(e.icon);
                return;
              }
            });

            /*fin*/
            this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
            this.fechaCreacion = new Date(this.dto.FechaCreacion);
            if (this.dto.FechaModificacion == null || this.dto.FechaModificacion == undefined) {
              this.fechaModificacion = undefined;
            } else {
              this.fechaModificacion = new Date(this.dto.FechaModificacion);
            }
            this.lstLote.push({ label: this.dto.Lote.trim() + "-" + "ACTUAL", value: this.dto.IdLote });
            this.selectedItemLote(this.dto.IdLote);
          });

        });
        this.disabledBanco = true;
        break;
    }
  }

  cargarCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
      console.log("probando", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
      });
      return 1;
    });
  }
  cargarComboEstadoSeparacion() {
    this.lstEstadoReserva = [];
    this.lstEstadoReserva.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTRESER").forEach(i => {
      console.log("ESTADO RESERVA", i);

      this.lstEstadoReserva.push({ label: i.Nombre, value: i.IdCodigo })
    });
  }
  selectedItemcompania(event) {
    if (event.value != null) {
      console.log(" this.lstCompania:", this.lstCompania);
      console.log("seleccion:", event);
      var dato = this.lstCompania.filter(x => x.value == event.value);
      this.filtroSede.IdEmpresa = Number(dato[0].title);
      this.cargarCombosede(this.filtroSede.IdEmpresa);
    }
    this.lstSucursal = [];
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstPrograma = [];
    this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstManzana = [];
    this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstLote = [];
    this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstcuentaBancaria = [];
    this.lstcuentaBancaria.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null});
    this.dto.CostoTotal = 0;
    this.dto.Diametro = 0;
    this.dto.Valor = 0;
    this.dto.Banco = null;
    this.dto.TipoPago = null;
  }

  cuentaBancaria() {
    this.cargarcuentaBancaria(this.filtroSede.IdEmpresa, this.dto.Banco);
  }
  cargarCombosede(IdPersona: number): Promise<number> {
    this.lstSucursal = [];
    this.filtroSede.SedEstado = 1;
    this.filtroSede.IdEmpresa = IdPersona;
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
      console.log("ListaSede", res);
      res.forEach(ele => {
        this.lstSucursal.push({ label: ele.SedDescripcion.trim(), value: ele.IdSede });
      });
      this.dto.IdSede = 331;
      this.cargarComboPrograma(this.dto.IdSede);
      return 1;
    });
  }


  cargarSucursalEditar(compniacodigo: string) {
    var dato = this.lstCompania.filter(x => x.value == compniacodigo);
    this.filtroSede.IdEmpresa = Number(dato[0].title);
    this.filtroSede.SedEstado = 1;
    this.lstSucursal = [];
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
      console.log("ListaSede EDITAR", res);
      res.forEach(ele => {
        this.lstSucursal.push({ label: ele.SedDescripcion.trim(), value: ele.IdSede });
      });
      return 1;
    });

  }


  cargarComboPrograma(IdSede: number): Promise<number> {

    this.lstPrograma = [];
    this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstManzana = [];
    this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstLote = [];
    this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.dto.CostoTotal = 0;
    this.dto.Diametro = 0;
    this.dto.Valor = 0;

    if (IdSede != null) {
      this.lstPrograma = [];
      this.FiltroPrograma.Estado = 1;
      this.FiltroPrograma.IdSede = IdSede;
      console.log("Combo FiltroPrograma:", this.FiltroPrograma);
      this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      return this.programaService.listarPrograma(this.FiltroPrograma).then((res) => {
        console.log("Combo Programa:", res);
        res.forEach(ele => {
          this.lstPrograma.push({ label: ele.Nombre.trim(), value: ele.IdProyecto, icon: ele.MontoInicial });
        });
        return 1;
      });
    }


  }

  selectedItemPrograma(event) {
    if (event.value != null) {
      console.log("event selectedItemPrograma", event);
      this.dto.IdProyecto = event.value;
      this.cargarComboManzana(this.dto.IdProyecto);
      console.log("this.lstPrograma", this.lstPrograma);
      console.log("this.lstPrograma", event.value);

      this.lstPrograma.forEach(e => {
        if (e.value == this.dto.IdProyecto) {
          this.dto.CuotaInicial = Number(e.icon);
          return;
        }
      });
    }
    this.lstManzana = [];
    this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstLote = [];
    this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.dto.CostoTotal = 0;
    this.dto.Diametro = 0;
    this.dto.Valor = 0;

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
      console.log("event selectedItemManzana", event);
      this.dto.IdManzana = event.value;
      this.cargarComboLote(this.dto.IdManzana);
    }

    this.lstLote = [];
    this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.dto.CostoTotal = 0;
    this.dto.Diametro = 0;
    this.dto.Valor = 0;

  }


  cargarComboLote(Id: number): Promise<number> {
    this.FiltroLote.IdProyecto = this.dto.IdProyecto;
    this.FiltroLote.IdManzana = Id;
    this.FiltroLote.Estado = 1;
    this.lstLote = [];
    console.log("FiltroLote cargarComboLote", this.FiltroLote);
    this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.loteService.listarLote(this.FiltroLote).then((res) => {

      sessionStorage.setItem('access_lstLote', JSON.stringify(res));
      res.forEach(ele => {

        if (ele.Condicion == 1) {
          this.lstLote.push({ label: ele.Nombre.trim() + "-" + ele.DesCondicion, value: ele.IdLote });
        }
      });
      console.log("lstLote", this.lstLote);
      return 1;
    });

  }

  selectedItemLote(event) {
    console.log("event selectedItemLote", event);
    this.dto.IdLote = event.value != undefined ? event.value : event;
    var listaLote = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_lstLote')));
    if (!this.esListaVacia(listaLote)) {
      listaLote.forEach(e => {
        if (e.IdLote == this.dto.IdLote) {
          console.log("event selectedItemLote listaLote.forEach", e.IdLote, e.ValorTotal, e.AreaTotal,);
          this.dto.CostoTotal = e.ValorTotal;
          this.dto.Diametro = e.AreaTotal;
          this.dto.Valor = e.Valor;
          this.loteAReservar = e;
          console.log("loteReservado", this.loteAReservar);

        }
      });
    }
  }


  cargarMoneda() {
    this.lstMoneda = [];
    this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "MONEDA").forEach(i => {
      this.lstMoneda.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });
  }

  cargarFormaPago() {
    this.lstTipoPago = [];
    this.lstTipoPago.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "FORMAPAGO").forEach(i => {
      this.lstTipoPago.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });
    console.log("TIPO DE PAGO", this.lstTipoPago);
  }

  cargarcuentaBancaria(Id: number, idBanco: string) {
    if (Id == null || Id == undefined) {
      return;
    }
    this.FiltroCuentaBancaria.Estado = "A";
    this.FiltroCuentaBancaria.Persona = Id;
    this.FiltroCuentaBancaria.Banco = idBanco;
    this.lstcuentaBancaria = [];
    console.log("FiltroCuentaBancaria cargarcuentaBancaria", this.FiltroCuentaBancaria);
    this.lstcuentaBancaria.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.cuentaBancariaService.listarCuentaBancaria(this.FiltroCuentaBancaria).then((res) => {
      console.log("cuentaBancariaService", res);
      res.forEach(ele => {
        this.lstcuentaBancaria.push({ label: ele.Descripcion.trim(), value: ele.CuentaBancaria, title: ele.MonedaCodigo, icon: ele.Banco });

      });
      return 1;
    });
  }
  selectMoneda() {
    for (let i = 0; i <= this.lstcuentaBancaria.length; i++) {
      if (this.lstcuentaBancaria[i].value == this.dto.CuentaBancaria) {

        if (this.lstcuentaBancaria[i].title != null) { this.dto.MonedaCodigo = this.lstcuentaBancaria[i].title; }
        //this.dto.Banco = this.lstcuentaBancaria[i].icon;
        return;
      }
    }
  }

  cargarComboBanco() {
    this.FiltroBanco.estado = "A";
    this.lstBanco = [];
    console.log("FiltroManzana cargarComboBanco", this.FiltroManzana);
    this.lstBanco.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestroBancoService.listarmaestroBancos(this.FiltroBanco).then((res) => {
      console.log("lstBanco", res);
      res.forEach(ele => {
        this.lstBanco.push({ label: ele.DescripcionCorta.trim(), value: ele.Banco });
      });
      return 1;
    });
  }

  async validarTipoPago() {
    //
    this.disabledBanco = false;
    await this.cargarComboBanco();
    this.lstcuentaBancaria = [];
    this.lstcuentaBancaria.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.dto.Banco = null;
    this.dto.CuentaBancaria = null;
    switch (this.dto.TipoPago) {
      default:

        break;
      case "EF":
        this.disabledBanco = true;
        this.dto.Banco = null;
        this.dto.CuentaBancaria = null;
        break;
      case "TB":
        this.dto.Banco = await "005"; // Selección por defecto de banco BBVA
        this.cuentaBancaria();
        this.dto.CuentaBancaria = null;
        break;

    }
  }
  coreMensaje(mensage: MensajeController): void {
    console.log("data llegando mantenimiento:", mensage);

    if (mensage.componente == "PROMOTOR") {
      this.dto.IdVendedor = mensage.resultado.Persona;
      this.dto.DocumentoVen = mensage.resultado.Documento;
      this.dto.Vendedor = mensage.resultado.NombreCompleto;
    }
    if (mensage.componente == "SELECPACIENTE") {
      this.dto.Documento = mensage.resultado.Documento;
      this.dto.Cliente = mensage.resultado.NombreCompleto;
      this.dto.IdCliente = mensage.resultado.Persona;
    }

    if (mensage.componente == "TIPMAPERSONA") {
      this.dto.Documento = mensage.resultado.data.Documento;
      this.dto.Cliente = mensage.resultado.data.NombreCompleto;
      this.dto.IdCliente = mensage.resultado.data.Persona;

      this.messageShow("success", "Success", this.getMensajeGuardado());
    }

  }

  verSelector(tipo: string): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), 'BUSCAR ' + tipo, "N");
  }

  verPromotor(tipo: string): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'PROMOTOR', 'BUSCAR'), 'BUSCAR ' + tipo, "E");
  }


  crearPersona(tipo: string) {
    // this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGPERSONA', ''), 'NUEVO ' + tipo, 1);
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONA', ''), "NUEVO", 1);

  }


  limpiarCliente() {
    this.dto.Documento = null;
    this.dto.Cliente = null;
    this.dto.IdCliente = null;
  }

  limpiarPromotor() {
    this.dto.DocumentoVen = null;
    this.dto.Vendedor = null;
    this.dto.IdVendedor = null;
  }


  coreGuardar() {

    if (this.estaVacio(this.dto.Documento)) { this.messageShow('warn', 'Advertencia', 'Seleccione un cliente válido'); return; }
   // if (this.estaVacio(this.dto.DocumentoVen)) { this.messageShow('warn', 'Advertencia', 'Seleccione un promotor de ventas válido'); return; }

    if (this.estaVacio(this.dto.CompaniaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione una compañia válida'); return; }
    if (this.estaVacio(this.dto.IdSede)) { this.messageShow('warn', 'Advertencia', 'Seleccione una sacursal válida'); return; }
    if (this.estaVacio(this.dto.IdProyecto)) { this.messageShow('warn', 'Advertencia', 'Seleccione un programa válido'); return; }
    if (this.estaVacio(this.dto.IdManzana)) { this.messageShow('warn', 'Advertencia', 'Seleccione una manzana válida'); return; }
    if (this.estaVacio(this.dto.IdLote)) { this.messageShow('warn', 'Advertencia', 'Seleccione un lote válido'); return; }

    if (this.estaVacio(this.dto.FechaFinal)) { this.messageShow('warn', 'Advertencia', 'Seleccione una fecha de fin válida'); return; }

    if (this.estaVacio(this.dto.TipoPago)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de pago válida'); return; }
    //if (this.estaVacio(this.dto.Banco)) { this.messageShow('warn', 'Advertencia', 'Seleccione un banco válida'); return; }
    //if (this.estaVacio(this.dto.CuentaBancaria)) { this.messageShow('warn', 'Advertencia', 'Seleccione una cuenta bancaria válida'); return; }
    if (this.estaVacio(this.dto.MonedaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione una moneda válida'); return; }

    this.dto.FechaInicial.setHours(0);
    this.dto.FechaInicial.setMinutes(0);
    this.dto.FechaInicial.setSeconds(0);
    this.dto.FechaFinal.setHours(0);
    this.dto.FechaFinal.setMinutes(0);
    this.dto.FechaFinal.setSeconds(0);

    switch (this.validarform) {
      case "NUEVO":
        if (this.dto.Estado != 1) {
          this.message('warn', 'Advertencia', 'El estado de una nueva separación no puede ser diferente a PENDIENTE.')
          return;
        }
        this.bloquearPag = true;
        this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
        this.dto.IpCreacion = this.getIp();  //crear metodo que nos muestre la IP del usuario

        this.reservaService.mantenimientoReserva(1, this.dto, this.getUsuarioToken()).then(
          resp_reserva => {
            if (resp_reserva.success == true) {
              this.loteAReservar.Condicion = 2;
              this.loteService.mantenimientoLote(2, this.loteAReservar, this.getUsuarioToken()).then(
                resp => {
                  if (resp.success == true) {
                    switch (resp_reserva.mensaje) {
                      case "Created":
                        this.messageService.add({ key: 'mr', severity: 'success', summary: 'Success', detail: 'Se registró con éxito.' });
                        this.mensajeController.resultado = resp_reserva;
                        this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                        break;
                      default:
                        this.messageService.add({ key: 'mr', severity: 'warn', summary: 'Advertencia', detail: resp_reserva.mensaje });
                        break;
                    }
                    this.dialog = false;
                    this.bloquearPag = false;
                    console.log("registrado:", resp_reserva);
                  }
                }
              );
            }
          });

        break;
      case "EDITAR":
        this.dto.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario.trim();
        this.dto.FechaModificacion = new Date();
        //this.dto.IpModificacion =
        this.bloquearPag = true;
        this.reservaService.mantenimientoReserva(2, this.dto, this.getUsuarioToken()).then(
          res => {
            if (res.success == true) {
              if (this.loteEditar.IdLote != this.loteAReservar.IdLote) {
                this.loteEditar.Condicion = 1;
                this.loteService.mantenimientoLote(2, this.loteEditar, this.getUsuarioToken()).then(
                  resp_lote_Actual => {
                    if (resp_lote_Actual.success == true) { }
                    this.loteAReservar.Condicion = 2;
                    this.loteService.mantenimientoLote(2, this.loteAReservar, this.getUsuarioToken()).then(
                      resp_nuevoLote => {
                        this.bloquearPag = false;
                        this.dialog = false;
                        if (resp_nuevoLote.success == true) {
                          this.messageService.add({ key: 'mr', severity: 'success', summary: 'Success', detail: 'Se actualizó con éxito.' });
                          this.mensajeController.resultado = res;
                          this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);

                        } else {
                          this.messageService.add({ key: 'mr', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
                        }
                      }
                    );

                  });
              } else {
                this.messageService.add({ key: 'mr', severity: 'success', summary: 'Success', detail: 'Se actualizó con éxito.' });
                this.mensajeController.resultado = res;
                this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);

              }
            } else {
              this.messageService.add({ key: 'mr', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
            }
            this.bloquearPag = false;
            this.dialog = false;
          });
        break;
      default:
        return;
    }
  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  coreSalir() {
    this.dialog = false;
  }

  coreImprimir() {

  }
  message(tipo: string, titulo: string, msg: string) {
    this.messageService.add({
      key: "bc",
      severity: tipo,
      summary: titulo,
      detail: msg,
    });
  }
}
