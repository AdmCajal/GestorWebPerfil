import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { DtoContrato } from '../model/DtoContrato';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { ProgramaService } from '../../../proyecto/Programa/service/programa.service';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { FiltroPrograma } from '../../../proyecto/Programa/model/FiltroPrograma';
import { FiltroManzana } from '../../../proyecto/Manzana/model/FiltroManzana';
import { ManzanaService } from '../../../proyecto/Manzana/service/manzana.service';
import { PersonaBuscarComponent } from '../../../framework-comun/Persona/components/persona-buscar.component';
import { PersonaMantenimientoComponent } from '../../../framework-comun/Persona/vista/persona-mantenimiento.component';
import { MaestroBancoService } from '../../../maestros/maestroBanco/servicio/maestro-banco.service';
import { LoteService } from '../../../proyecto/Lotes/service/lotes.service';
import { ReservaService } from '../../Reserva/service/reserva.service';
import { FiltroReserva } from '../../Reserva/model/FiltroReserva';
import { FiltroWcoSede } from '../../../maestros/Sedes/dominio/filtro/FiltroWcoSede';
import { FiltroLote } from '../../../proyecto/Lotes/model/FiltroLote';
import { FiltroBanco } from '../../../maestros/maestroBanco/dominio/filtro/FiltroBanco';
import { EmpleadoMast } from '../../../maestros/Empleados/model/empleadomast';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { ContratoService } from '../service/contrato.service';
import { FiltroContrato } from '../model/FiltroContrato';
import { DtoClassCmisionistaDetalle, DtoClassContratoDellate } from '../model/DtoClassContratoDellate';
import { DtoClassContrato } from '../model/DtoClassContrato';
import { BuscarReservaComponent } from '../../Reserva/buscar-reserva/buscar-reserva.component';
import { DtoLote } from '../../../proyecto/Lotes/model/DtoLote';
import { DtoClassContratoComision } from '../model/DtoClassContratoComision';
import { DtoReserva } from '../../Reserva/model/DtoReserva';
import { MaestrotipocambioService } from '../../../maestros/TipoCambio/servicio/maestrotipocambio.service';
import { Filtrotipodecambio } from '../../../maestros/TipoCambio/dominio/filtro/Filtrotipodecambio';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'ngx-contrato-mantenimiento',
  templateUrl: './contrato-mantenimiento.component.html',
  styleUrls: ['./contrato-mantenimiento.component.scss']
})
export class ContratoMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;
  @ViewChild(BuscarReservaComponent, { static: false }) buscarReservaComponent: BuscarReservaComponent;
  bloquearPag: boolean;
  tieneReserva:boolean = false;
  validarform: string = null;
  acciones: string = ''
  position: string = 'top';
  dto: DtoContrato = new DtoContrato();
  ReservaActualizar: DtoReserva = new DtoReserva();
  cliente: EmpleadoMast = new EmpleadoMast();
  lstCompania: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstManzana: SelectItem[] = [];
  lstTipoInteres: SelectItem[] = [];
  lstLote: SelectItem[] = [];
  lstMoneda: SelectItem[] = [];
  lstTipoPago: SelectItem[] = [];
  filtro: FiltroContrato = new FiltroContrato();
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  FiltroPrograma: FiltroPrograma = new FiltroPrograma();
  FiltroManzana: FiltroManzana = new FiltroManzana();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  lstComisionista: DtoClassContratoComision[] = [];
  FiltroLote: FiltroLote = new FiltroLote();
  lstBanco: any[] = [];
  FiltroBanco: FiltroBanco = new FiltroBanco();
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  lstdetContrato: DtoClassContratoDellate[] = [];
  lstdetComision: DtoClassContratoComision[] = [];
  loteAReservar: DtoLote;
  loteEditar: DtoLote;
  dtoguardar: DtoClassContrato = new DtoClassContrato();
  minDateFin: Date = new Date();
  cantidadLetras: number = 0;
  constructor(
    private maestroBancoService: MaestroBancoService,
    private manzanaService: ManzanaService,
    private loteService: LoteService,
    private maestroSucursalService: MaestroSucursalService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private reservaService: ReservaService,
    private contratoService: ContratoService,
    private _ReservaSevice: ReservaService,
    private messageService: MessageService,
    private programaService: ProgramaService,
    private maestrotipocambioService: MaestrotipocambioService
  ) {

    super();
    this.minDateFin.setDate(this.minDateFin.getDate());
  }

  ngOnInit(): void {
    const p1 = this.cargarCombocompania();
    console.log("mantenimiento ngOnInit :", p1);
    const p2 = this.cargarMoneda();
    const p3 = this.cargarFormaPago();
    const p4 = this.cargarComboBanco();
    Promise.all([p1, p2, p3, p4]).then((resp) => {

    });
  }


  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any,) {

    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.acciones = this.acciones.toUpperCase();
    this.dialog = true;
    this.bloquearPag = true;
    this.dto.MonedaCodigo = "EX";
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
    this.dto.FechaCreacion = new Date();
    this.fechaCreacion = this.dto.FechaCreacion;
    this.dto = new DtoContrato();
    this.dto.ComisionTotal = 0;
    this.dtoguardar = new DtoClassContrato();
    this.lstdetContrato = new Array();
    this.lstComisionista = new Array();
    console.log("ContratoMantenimiento MensajeController ", this.mensajeController);

    this.fechaModificacion = undefined;

    if (this.validarform == "NUEVO") {

      this.lstSucursal = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.lstPrograma = [];
      this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.lstManzana = [];
      this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.lstLote = [];
      this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

      this.dto.Estado = 1;
      this.dto.MonedaCodigo = "EX";
      this.puedeEditar = false;
      this.tieneReserva = false;
      this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
      this.dto.FechaCreacion = new Date();
      this.fechaCreacion = this.dto.FechaCreacion;
      this.bloquearPag = false;
      this.dto.FechaInicial = new Date();
      for (let index = 1; index <= 3; index++) {
        var objdet = new DtoClassContratoDellate();
        switch (index) {
          case 1:
            objdet.Id = index;
            objdet.Concepto = "CUOTA INICIAL";
            objdet.campodisabled = true;
            objdet.color = 'none';
            objdet.Cantidad = 1;
            objdet.Monto = 0;
            this.lstdetContrato.push(objdet);
            break;
          case 2:
            objdet.Id = index;
            objdet.Concepto = "NRO DE CUOTA";
            objdet.campodisabled = false;
            objdet.color = 'none';
            objdet.Monto = 0;
            objdet.Cantidad = 0;
            this.lstdetContrato.push(objdet);
            break;
          case 3:
            objdet.Id = index;
            objdet.campodisabled = true;
            objdet.color = 'rgb(247, 247, 208)';
            objdet.Concepto = "CUOTA FINAL";
            objdet.Cantidad = 1;
            objdet.Monto = 0;
            this.lstdetContrato.push(objdet);
            break;
        }
      }
      //for (let index = 1; index <= 2; index++) {
      var objComisionista = new DtoClassContratoComision();
      objComisionista.Id = 1;
      objComisionista.Concepto = "";
      objComisionista.Comision = 0;
      this.lstComisionista.push(objComisionista);
      //}
      let filtroTipoDeCambio: Filtrotipodecambio = new Filtrotipodecambio();
      var hoy = new Date();
      var dia = hoy.getDate();
      var mes = hoy.getMonth() + 1;
      var anio = hoy.getFullYear();
      filtroTipoDeCambio.fechacambio = new Date(`${anio},${mes},${dia}`);
      filtroTipoDeCambio.ultimafechamodif = new Date(`${anio},${mes},${dia}`);

      this.maestrotipocambioService.listarmaestroTipoCambio(filtroTipoDeCambio).then((res) => {
        console.log("Tipo de cambio", res);
        if (res.length == 0) {
          this.puedeEditar = true;
          this.dto.TipoCambio = '0';
          this.messageService.add({
            key: "mr",
            severity: "warn",
            summary: "Warning",
            detail: "No tiene un tipo de cambio establecido",
          });
        }

        res.forEach(element => {

          if (element.FactorVenta == undefined || element.Estado == "I") {
            this.messageService.add({
              key: "mr",
              severity: "warn",
              summary: "Warning",
              detail: "No tiene un tipo de cambio establecido",
            });
            this.puedeEditar = true;
          }

          this.dto.TipoCambio = (element.Estado != "I" || element.Estado == undefined) ? element.FactorVenta.toString() : '0';
        })

      });

    } else if (this.validarform == "EDITAR") {

      console.log("ContratoMantenimiento rowdata ::", rowdata);
      const p1 = this.cargarSucursalEditar(rowdata.CompaniaCodigo);
      const p2 = this.cargarComboPrograma(rowdata.IdSede);
      const p3 = this.cargarComboManzana(rowdata.IdProyecto);
      const p4 = this.cargarComboLote(rowdata.IdLote);

      Promise.all([p1, p2, p3, p4]).then((resp) => {

        this.filtro.IdContrato = rowdata.IdContrato;
        this.bloquearPag = true;
        this.contratoService.ListarContrato(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.puedeEditar = false;
          this.FiltroPrograma.IdSede = rowdata.IdSede;
          this.dto = res[0];
          this.tieneReserva = this.dto.IdReserva !=null || this.dto.IdReserva != undefined ? false: true;
          this.dto.FechaPrimeraLetra = new Date(this.dto.FechaPrimeraLetra);
          this.dto.FechaInicial = new Date(this.dto.FechaInicial);
          if (this.dto.FechaModificacion != null || this.dto.FechaModificacion != undefined) {
            this.fechaModificacion = new Date(this.dto.FechaModificacion);
          }
          this.lstLote.push({ label: res[0].lote + "-" + res[0].DesCondicion, value: res[0].IdLote });


          const filtroLote = new FiltroLote();
          this.loteService.listarLote(filtroLote).then(resp => {
            resp.forEach(e => {
              if (e.IdLote == this.dto.IdLote) {
                console.log("event selectedItemLote listaLote.forEach", e);
                // this.dto.Monto = e.ValorTotal;
                // this.dto.TipoCambio = e.TipoCambio;
                // this.dto.Area = e.AreaTotal;
                this.dto.Valor = e.Valor;
                // this.dto.DiasGracia = e.diasGracia;
                // this.dto.TasaInteres = e.MorosidadPorcentaje;
                // this.loteEditar = e;
              }
            });
          }
          );


          this.contratoService.ListarComision(this.filtro).then((res) => {
            res.forEach(e => {
              e.Porcentaje = e.Comision;
            });
            this.lstComisionista = res;
            console.log("ListarComision:", this.lstComisionista);
          });

          // this.selectedItemLote(this.dto.IdLote);
          /*         if (this.esNumeroVacio(this.dto.IdReserva)) {

                  }else{
                     if ( this.dto.IdReserva >0) {
                        console.log("ContratoMantenimiento ingreso ",  this.dto.IdReserva);
                        this.dto.Saldo  = this.dto.ValorCuotaInicial - this.dto.ValorSeparacion;
                    }
                  } */


          for (let index = 1; index <= 3; index++) {
            var objdet = new DtoClassContratoDellate();
            if (index == 1) {
              objdet.Id = index;
              objdet.Concepto = "CUOTA INICIAL";
              objdet.campodisabled = true;
              objdet.Cantidad = 1;
              objdet.Monto = res[0].ValorCuotaInicial;
              this.lstdetContrato.push(objdet);
            } else if (index == 2) {
              objdet.Id = index;
              objdet.Concepto = "NRO CUOTAS";
              objdet.campodisabled = false;
              objdet.Monto = res[0].ValorLetra;
              objdet.Cantidad = res[0].CantidadLetra;
              this.lstdetContrato.push(objdet);
            } else if (index == 3) {
              objdet.Id = index;
              objdet.campodisabled = true;
              objdet.Concepto = "CUOTA FINAL";
              objdet.Cantidad = 1;
              objdet.Monto = res[0].ValorUltimaLetra;
              this.lstdetContrato.push(objdet);
            }

          }
          this.calculo();
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
          this.fechaCreacion = new Date(this.dto.FechaCreacion);
          if (this.dto.FechaModificacion != null || this.dto.FechaModificacion != undefined) {
            this.fechaModificacion = new Date(this.dto.FechaModificacion);
          }
          this.dto.MonedaCodigo = rowdata.MonedaCodigo.trim();
        });
      });
    } else if (this.validarform == "VER") {
      const p1 = this.cargarSucursalEditar(rowdata.CompaniaCodigo);
      const p2 = this.cargarComboPrograma(rowdata.IdSede);
      const p3 = this.cargarComboManzana(rowdata.IdProyecto);
      const p4 = this.cargarComboLote(rowdata.IdLote);

      Promise.all([p1, p2, p3, p4]).then((resp) => {
        this.filtro.IdContrato = rowdata.IdContrato;
        this.bloquearPag = true;
        this.contratoService.ListarContrato(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.puedeEditar = true;
          this.FiltroPrograma.IdSede = rowdata.IdSede;
          console.log("VER REST :", res);
          this.dto = res[0];
          let filtroLote = new FiltroLote();

          this.fechaCreacion = new Date(res[0].FechaCreacion);
          if (res[0].FechaModificacion != null || res[0].FechaModificacion != undefined) {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }

          this.dto.FechaPrimeraLetra = new Date(this.dto.FechaPrimeraLetra);
          this.dto.FechaInicial = new Date(this.dto.FechaInicial);
          this.lstLote.push({ label: res[0].lote + "-" + res[0].DesCondicion, value: res[0].IdLote });

          this.contratoService.ListarComision(this.filtro).then((res) => {
            res.forEach(e => {
              e.Porcentaje = e.Comision;
            });
            this.lstComisionista = res;
            console.log("ListarComision:", this.lstComisionista);
            console.log("this.filtro:", this.filtro);
          });
          this.loteService.listarLote(filtroLote).then(resp => {
            resp.forEach(e => {
              if (e.IdLote == this.dto.IdLote) {
                console.log("event selectedItemLote listaLote.forEach", e);
                // this.dto.Monto = e.ValorTotal;
                // this.dto.TipoCambio = e.TipoCambio;
                // this.dto.Area = e.AreaTotal;
                this.dto.Valor = e.Valor;
                // this.dto.DiasGracia = e.diasGracia;
                // this.dto.TasaInteres = e.MorosidadPorcentaje;
                // this.loteAReservar = e;
              }
            });
          }
          );

          for (let index = 1; index <= 3; index++) {
            var objdet = new DtoClassContratoDellate();
            if (index == 1) {
              objdet.Id = index;
              objdet.Concepto = "CUOTA INICIAL";
              objdet.campodisabled = true;
              objdet.Cantidad = 1;
              objdet.Monto = res[0].ValorCuotaInicial;
              this.lstdetContrato.push(objdet);
            } else if (index == 2) {
              objdet.Id = index;
              objdet.Concepto = "NRO CUOTAS";
              objdet.campodisabled = true;
              objdet.Monto = res[0].ValorLetra;
              objdet.Cantidad = res[0].CantidadLetra;
              this.lstdetContrato.push(objdet);
            } else if (index == 3) {
              objdet.Id = index;
              objdet.campodisabled = true;
              objdet.Concepto = "CUOTA FINAL";
              objdet.Cantidad = 1;
              objdet.Monto = res[0].ValorUltimaLetra;
              this.lstdetContrato.push(objdet);
            }
          }
          this.calculo();

          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

        });
      });
      this.bloquearPag = true;
    }
  }


  cargarCombocompania(): Promise<number> {
    this.lstCompania = [];
    this.lstSucursal = [];
    this.lstPrograma = [];
    this.lstManzana = [];
    this.lstLote = [];

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

  selectedItemcompania(event) {
    // Cuota inicial
    if (event.value != null) {
      var dato = this.lstCompania.filter(x => x.value == event.value);
      this.filtroSede.IdEmpresa = Number(dato[0].title);
      this.cargarCombosede(this.filtroSede.IdEmpresa);
    }
    else {
      this.lstSucursal = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    }
    this.lstPrograma = [];
    this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstManzana = [];
    this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstLote = [];
    this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.dto.Area = 0;
    this.dto.Valor = 0;
    this.dto.Monto = 0;
    this.dto.Saldo = 0;
    this.lstdetContrato[0].Monto = 0;
    this.lstdetContrato[1].Monto = 0;
    this.lstdetContrato[2].Monto = 0;
    this.lstdetContrato[1].Cantidad = 0;
  }




  cargarCombosede(IdPersona: number): Promise<number> {
    this.lstSucursal = [];
    this.lstPrograma = [];
    this.lstManzana = [];
    this.lstLote = [];

    this.filtroSede.SedEstado = 1;
    this.filtroSede.IdEmpresa = IdPersona;
    this.lstSucursal = [];
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
      console.log("ListaSede", res);
      res.forEach(ele => {
        this.lstSucursal.push({ label: ele.SedDescripcion.trim(), value: ele.IdSede });
      });
      return 1;
    });
  }

  cargarSucursalEditar(compniacodigo: string) {

    this.lstSucursal = [];
    this.lstPrograma = [];
    this.lstManzana = [];
    this.lstLote = [];

    var dato = this.lstCompania.filter(x => x.value == compniacodigo);
    this.filtroSede.IdEmpresa = Number(dato[0].title);
    this.filtroSede.SedEstado = 1;
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
      console.log("ListaSede EDITAR", res);
      res.forEach(ele => {
        this.lstSucursal.push({ label: ele.SedDescripcion.trim(), value: ele.IdSede });
      });
      return 1;
    });

  }



  cargarComboPrograma(IdSede?: any): Promise<number> {

    this.lstManzana = [];
    this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstLote = [];
    this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.dto.Area = 0;
    this.dto.Valor = 0;
    this.dto.Monto = 0;
    this.dto.Saldo = 0;
    console.log("lstdetContrato ::",  this.lstdetContrato);
    var num =0;
    this.lstdetContrato.forEach(ele => {
      num++;
    });  
    console.log("lstdetContrato contar ::", num);
    if(num>0){
      this.lstdetContrato[0].Monto = 0;
      this.lstdetContrato[1].Monto = 0;
      this.lstdetContrato[2].Monto = 0;
      this.lstdetContrato[1].Cantidad = 0;
    }

    this.FiltroPrograma.Estado = 1;
    this.lstPrograma = [];
    if (IdSede == null || IdSede == undefined) {
      this.FiltroPrograma.IdSede = this.dto.IdSede;
    } else {
      this.FiltroPrograma.IdSede = IdSede;
    }

    if (this.FiltroPrograma.IdSede != null) {
      this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      return this.programaService.listarPrograma(this.FiltroPrograma).then((res) => {
        res.forEach(ele => { //title -> monto inicial  nro cuotas
          this.lstPrograma.push({ label: ele.Nombre.trim(), value: ele.IdProyecto, title: ele.MontoInicial, icon: ele.TotalCuota });
        });
        return 1;
      });
    } else {
      this.lstPrograma = [];
      this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    }

  }

   selectedItemPrograma(event) {
    console.log(this.lstPrograma, event.value);
    this.lstPrograma.forEach(async e => {
      if (event.value == e.value) {
        // Cuota inicial
        this.lstdetContrato[0].Monto = await Number(e.title);

        // Total de cuotas
        this.lstdetContrato[1].Cantidad = await Number(e.icon) - 1;
        this.cantidadLetras = await Number(e.icon);
      }
    });

    if (event.value != null) {
      this.dto.IdProyecto = event.value;

      this.cargarComboManzana(this.dto.IdProyecto);
    }
    else {
      this.lstManzana = [];
      this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    }
    this.lstLote = [];
      this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

      this.dto.Area = 0;
      this.dto.Valor = 0;
      this.dto.Monto = 0;
      this.dto.Saldo = 0;
      this.lstdetContrato[0].Monto = 0;
      this.lstdetContrato[1].Monto = 0;
      this.lstdetContrato[2].Monto = 0;
      this.lstdetContrato[1].Cantidad = 0;

  }


  cargarComboManzana(Id: number): Promise<number> {
    this.lstManzana = [];
    this.lstLote = [];
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
    // Monto de cuotas

    if (event.value != null) {
      console.log("event selectedItemManzana", event);
      this.dto.IdManzana = event.value;
      this.cargarComboLote(this.dto.IdManzana);
    }
    else {
      this.lstLote = [];
      this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

      this.dto.Area = 0;
      this.dto.Valor = 0;
      this.dto.Monto = 0;
      this.dto.Saldo = 0;
      this.lstdetContrato[0].Monto = 0;
      this.lstdetContrato[1].Monto = 0;
      this.lstdetContrato[2].Monto = 0;
      this.lstdetContrato[1].Cantidad = 0;

    }
  }


  cargarComboLote(Id: number, tipo?: string): Promise<number> {
    this.lstLote = [];
    this.FiltroLote.IdProyecto = this.dto.IdProyecto;
    this.FiltroLote.IdManzana = Id;
    this.FiltroLote.Estado = 1;

    console.log("FiltroLote cargarComboLote", this.FiltroLote);
    this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.loteService.listarLote(this.FiltroLote).then((res) => {

      sessionStorage.setItem('access_lstLote', JSON.stringify(res));
      res.forEach(ele => {
        if (ele.Condicion == 1) {
          this.lstLote.push({ label: ele.Nombre.trim().toUpperCase() + "-" + ele.DesCondicion.toUpperCase(), value: ele.IdLote });
        }
      });
      console.log("lstLote", this.lstLote);
      return 1;
    });

  }

  selectedItemLote(event?) {
    console.log("event selectedItemLote", event);
    this.dto.IdLote = event.value != undefined ? event.value : event;
    var listaLote = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_lstLote')));
    if (!this.esListaVacia(listaLote)) {
      listaLote.forEach(e => {
        if (e.IdLote == this.dto.IdLote) {
          console.log("event selectedItemLote listaLote.forEach", e);
          this.dto.Monto = e.ValorTotal;
          //this.dto.TipoCambio = e.TipoCambio;
          this.dto.Area = e.AreaTotal;
          this.dto.Valor = e.Valor;
          this.dto.DiasGracia = e.diasGracia;
          this.dto.TasaInteres = e.MorosidadPorcentaje;
          console.log("this.dto.TasaInteres", this.dto.DiasGracia);
          this.loteAReservar = e;
        }
      });
    }
    this.calculo();

    if (this.dto.IdLote == null) {
      this.lstLote = [];
      this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

      this.dto.Area = 0;
      this.dto.Valor = 0;
      this.dto.Monto = 0;
      this.dto.Saldo = 0;
      this.lstdetContrato[0].Monto = 0;
      this.lstdetContrato[1].Monto = 0;
      this.lstdetContrato[2].Monto = 0;
      this.lstdetContrato[1].Cantidad = 0;
    }
  }


  cargarMoneda() {
    this.lstMoneda = [];
    this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "MONEDA").forEach(i => {
      this.lstMoneda.push({ label: i.Nombre.trim().toUpperCase(), value: i.Codigo.trim() });
    });
  }

  cargarFormaPago() {
    this.lstTipoPago = [];
    this.lstTipoPago.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "FORMAPAGO").forEach(i => {
      this.lstTipoPago.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });
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


  async coreMensaje(mensage: MensajeController) {
    console.log("data llegando mantenimiento:", mensage);

    if (mensage.componente == "SELECCOMISIONISTA") {
      this.dto.IdVendedor = mensage.resultado.Persona;
      this.dto.DocumentoVen = mensage.resultado.Documento;
      this.dto.Vendedor = mensage.resultado.NombreCompleto;
    }

    if (mensage.componente == "SELECCLIENTE") {
      this.dto.Documento = mensage.resultado.Documento;
      this.dto.Cliente = mensage.resultado.NombreCompleto;
      this.dto.IdCliente = mensage.resultado.Persona;
    }
    if (mensage.componente == "NUEVOCLIENTE") {
      this.dto.Documento = mensage.resultado.data.Documento;
      this.dto.Cliente = mensage.resultado.data.NombreCompleto;
      this.dto.IdCliente = mensage.resultado.data.Persona;
    }
    if (mensage.componente == "NUEVOCONYUGE") {
      this.dto.DocumentoCony = mensage.resultado.data.Documento;
      this.dto.Conyuge = mensage.resultado.data.NombreCompleto;
      this.dto.IdConyuge = mensage.resultado.data.Persona;
    }

    if (mensage.componente == "SELECCONYUGE") {
      this.dto.DocumentoCony = mensage.resultado.Documento;
      this.dto.Conyuge = mensage.resultado.NombreCompleto;
      this.dto.IdConyuge = mensage.resultado.Persona;
    }
    if (mensage.componente == "SELECRESERVA") {
      this.dto = new DtoContrato();
      let filtroTipoDeCambio: Filtrotipodecambio = new Filtrotipodecambio();
      var hoy = new Date();
      var dia = hoy.getDate();
      var mes = hoy.getMonth() + 1;
      var anio = hoy.getFullYear();
      filtroTipoDeCambio.fechacambio = new Date(`${anio},${mes},${dia}`);
      filtroTipoDeCambio.ultimafechamodif = new Date(`${anio},${mes},${dia}`);

      this.maestrotipocambioService.listarmaestroTipoCambio(filtroTipoDeCambio).then((res) => {
        console.log("Tipo de cambio", res);
        if (res.length == 0) {
          this.puedeEditar = true;
          this.dto.TipoCambio = '0';
          this.messageService.add({
            key: "mr",
            severity: "warn",
            summary: "Warning",
            detail: "No tiene un tipo de cambio establecido",
          });
        }

        res.forEach(element => {

          if (element.FactorVenta == undefined || element.Estado == "I") {
            this.messageService.add({
              key: "mr",
              severity: "warn",
              summary: "Warning",
              detail: "No tiene un tipo de cambio establecido",
            });
            this.puedeEditar = true;
          }

          this.dto.TipoCambio = (element.Estado != "I" || element.Estado == undefined) ? element.FactorVenta.toString() : '0';
        })
      });

      this.tieneReserva = true;
      this.dto.MonedaCodigo = "EX";
      this.dto.Documento = mensage.resultado.Documento;
      this.dto.Cliente = mensage.resultado.Cliente;
      this.dto.IdCliente = mensage.resultado.IdCliente;
      const p1 = await this.cargarSucursalEditar(mensage.resultado.CompaniaCodigo);
      this.dto.IdSede = await mensage.resultado.IdSede;
      const p2 = await this.cargarComboPrograma();
      const p3 = await this.cargarComboManzana(mensage.resultado.IdProyecto);
      const p4 = await this.cargarComboLote(mensage.resultado.IdManzana);
      const p5 = await this.selectedItemLote(mensage.resultado.IdLote);
      Promise.all([p1, p2, p3, p4, p5]).then((resp) => {
        this.dto.CompaniaCodigo = mensage.resultado.CompaniaCodigo;
        this.dto.IdSede = mensage.resultado.IdSede;
        this.dto.IdProyecto = mensage.resultado.IdProyecto;
        this.dto.IdManzana = mensage.resultado.IdManzana;
        this.dto.ValorSeparacion = mensage.resultado.ValorSeparacion;
        this.lstLote.push({ label: mensage.resultado.Lote.trim() + "-" + 'Reservado', value: mensage.resultado.IdLote });
        this.dto.IdLote = mensage.resultado.IdLote;
        this.dto.IdReserva = mensage.resultado.IdReserva;
        this.ReservaActualizar = mensage.resultado;
        this.dto.FechaInicial =  new Date(`${anio},${mes},${dia}`);
        console.log("data this.dto ::",  this.dto);
      });
      this.FiltroPrograma = new FiltroPrograma();
      const datamzn = await this.programaService.listarPrograma(this.FiltroPrograma);
      console.log("listarManzana", datamzn);
      datamzn.forEach(ele => {
        if (ele.IdProyecto == this.dto.IdProyecto) {
          this.lstdetContrato[0].Monto = ele.MontoInicial;

          this.lstdetContrato[1].Cantidad = Number(ele.TotalCuota) - 1;
          this.cantidadLetras = Number(ele.TotalCuota);
        }
      });
      this.calculo();
    }
  }

  buscarSeparacionLote(tipo: string): void {
    this.buscarReservaComponent.coreIniciarComponente(new MensajeController(this, 'SELECRESERVA', 'BUSCAR'), 'BUSCAR ');
  }

  verPersona(tipo: string): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECCLIENTE', 'BUSCAR'), 'BUSCAR ' + tipo, "N");
  }

  crearPersona(tipo: string) {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'NUEVOCLIENTE', ''), 'NUEVO', 1);
  }

  limpiarCliente() {
    this.dto.IdCliente = null;
    this.dto.Documento = null;
    this.dto.Cliente = null;
  }

  verConyuge(tipo: string): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECCONYUGE', 'BUSCAR'), 'BUSCAR ' + tipo, "N");
  }

  crearConyuge(tipo: string) {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'NUEVOCONYUGE', ''), 'NUEVO', 1);
  }

  limpiarConyuge() {

    this.dto.IdConyuge = null;
    this.dto.DocumentoCony = null;
    this.dto.Conyuge = null;
  }

  verComisionista(tipo: string): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECCOMISIONISTA', 'BUSCAR'), 'BUSCAR ' + tipo, "E");
  }


  limpiarComisionista() {
    this.dto.IdVendedor = null;
    this.dto.DocumentoVen = null;
    this.dto.Vendedor = null;
  }
  esFechaVacia(fecha: Date): boolean {
    if (fecha == null) {
      return true;
    }
    if (fecha == undefined) {
      return true;
    }
    if (fecha.toString() == '') {
      return true;
    }

    return false;
  }

  async coreGuardar() {

    if (this.estaVacio(this.dto.Documento)) { this.messageShow('warn', 'Advertencia', 'Ingrese un cliente válido'); return; }
    // if (this.estaVacio(this.dto.DocumentoCony)) { this.messageShow('warn', 'Advertencia', 'Ingrese un conyuge válido'); return; }
    //if (this.estaVacio(this.dto.DocumentoVen)) { this.messageShow('warn', 'Advertencia', 'Ingrese un comisionista válido'); return; }

    if (this.estaVacio(this.dto.CompaniaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione una compañia válida'); return; }
    if (this.estaVacio(this.dto.IdSede)) { this.messageShow('warn', 'Advertencia', 'Seleccione una sucursal válida'); return; }
    if (this.estaVacio(this.dto.IdProyecto)) { this.messageShow('warn', 'Advertencia', 'Seleccione un programa válido'); return; }
    if (this.estaVacio(this.dto.IdManzana)) { this.messageShow('warn', 'Advertencia', 'Seleccione una manzana válida'); return; }
    if (this.estaVacio(this.dto.IdLote)) { this.messageShow('warn', 'Advertencia', 'Seleccione un lote válido'); return; }


    if (this.estaVacio(this.dto.FechaPrimeraLetra)) { this.messageShow('warn', 'Advertencia', 'Ingrese una fecha de primera letra válida'); return; }
    if (this.estaVacio(this.dto.Saldo)) { this.messageShow('warn', 'Advertencia', 'Verifique el cálculo de detalle de letra'); return; }
    if (this.estaVacio(this.dto.MonedaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de moneda válido'); return; }

    if (this.estaVacio(this.lstdetContrato[0].Monto)) { this.messageShow('warn', 'Advertencia', 'Verifique el cálculo de detalle de letra'); return; }
    if (this.estaVacio(this.lstdetContrato[1].Monto)) { this.messageShow('warn', 'Advertencia', 'Verifique el cálculo de detalle de letra'); return; }
    if (this.estaVacio(this.lstdetContrato[2].Monto)) { this.messageShow('warn', 'Advertencia', 'Verifique el cálculo de detalle de letra'); return; }


    this.bloquearPag = true;
    switch (this.validarform) {
      case 'NUEVO':
        if (this.esFechaVacia(this.dto.FechaPrimeraLetra)) {
          this.messageService.add({ key: 'mr', severity: 'warn', summary: 'Advertencia', detail: 'La fecha de primera letra no puede ser vacia.' });
          this.bloquearPag = false;
          return;
        }

        this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
        this.dto.IpCreacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
        this.dto.Estado = 1;
        this.dtoguardar.success = true;
        this.dtoguardar.tokem = this.getUsuarioToken();
        this.dtoguardar.Contrato = this.dto;
        this.dtoguardar.Comision = this.lstComisionista;

        this.dtoguardar.Contrato.ValorCuotaInicial = this.lstdetContrato[0].Monto;
        this.dtoguardar.Contrato.ValorLetra = this.lstdetContrato[1].Monto;
        this.dtoguardar.Contrato.ValorUltimaLetra = this.lstdetContrato[2].Monto;
        this.dtoguardar.Contrato.CantidadLetra = this.lstdetContrato[1].Cantidad;
        this.dtoguardar.Detalle = this.lstdetContrato;
        console.log("COMISION DETALLE", this.lstComisionista);


        console.log("coreGuardar NUEVO:", this.dtoguardar);
        const respContrato = await this.contratoService.MantenimientoContrato(1, this.dtoguardar, this.getUsuarioToken());

        this.dialog = false;
        this.bloquearPag = false;
        console.log("registrado:", respContrato);
        if (respContrato.success) {
          this.loteAReservar.Condicion = 3;
          const respLoteActualizar = await this.loteService.mantenimientoLote(2, this.loteAReservar, this.getUsuarioToken())

          if (respLoteActualizar.success) {
            this.ReservaActualizar.Estado = 5;
            const respActualizarReserva = await this._ReservaSevice.mantenimientoReserva(3, this.ReservaActualizar, this.getUsuarioToken());
            if (respActualizarReserva.success) {
              // let loteContrato:DtoLote = new DtoLote();
              // loteContrato = this.loteAReservar
              // loteContrato.Condicion = 2;
              // const respLoteActualizar = await this.loteService.mantenimientoLote(2,loteContrato,this.getUsuarioToken());
              // if (respLoteActualizar.success) {
              this.messageService.add({ key: 'mr', severity: 'success', summary: 'Success', detail: 'Se registró con éxito.' });
              this.mensajeController.resultado = respContrato;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
              // }

            }
          } else {
            this.messageService.add({ key: 'mr', severity: 'warn', summary: 'Advertencia', detail: respLoteActualizar.mensaje });
          }
        } else {
          this.messageService.add({ key: 'mr', severity: 'warn', summary: 'Advertencia', detail: respContrato.mensaje });
        }

        break;
      case 'EDITAR':
        this.dto.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario.trim();
        this.dto.FechaModificacion = this.fechaModificacion;
        this.dto.IpModificacion = this.getIp();

        this.dto.FechaPrimeraLetra.setHours(this.dto.FechaPrimeraLetra.getHours() - 5);
        this.dto.FechaInicial.setHours(this.dto.FechaInicial.getHours() - 5);

        this.dtoguardar.Contrato = this.dto;
        this.dtoguardar.Contrato.ValorCuotaInicial = this.lstdetContrato[0].Monto;
        this.dtoguardar.Contrato.ValorLetra = this.lstdetContrato[1].Monto;
        this.dtoguardar.Contrato.ValorUltimaLetra = this.lstdetContrato[2].Monto;
        this.dtoguardar.Contrato.CantidadLetra = this.lstdetContrato[1].Cantidad;
        this.dtoguardar.Detalle = this.lstdetContrato;
        this.dtoguardar.Comision = this.lstComisionista;
        console.log("COMISION DETALLE", this.lstComisionista);
        console.log("coreGuardar EDITAR:", this.dtoguardar);
        const respEditarContrato = await this.contratoService.MantenimientoContrato(2, this.dtoguardar, this.getUsuarioToken());

        this.dialog = false;
        this.bloquearPag = false;
        if (respEditarContrato != null) {
          console.log("registrado:", respEditarContrato);

          if (respEditarContrato.mensaje == "Ok") {
            try {


              this.loteAReservar.Condicion = 3;
              const respNuevoLote = await this.loteService.mantenimientoLote(2, this.loteAReservar, this.getUsuarioToken())

              if (respNuevoLote.success) {

                this.loteEditar.Condicion = 1;
                const respLoteanterior = await this.loteService.mantenimientoLote(2, this.loteEditar, this.getUsuarioToken())

                this.mensajeController.resultado = await respEditarContrato;
                this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);

                this.messageService.add({ key: 'mr', severity: 'success', summary: 'Success', detail: 'Se actualizó con éxito.' });


              } else {
                this.messageService.add({ key: 'mr', severity: 'warn', summary: 'Advertencia', detail: respNuevoLote.mensaje });
              }

            }
            catch (e) {
              this.mensajeController.resultado = await respEditarContrato;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
              this.messageService.add({ key: 'mr', severity: 'success', summary: 'Success', detail: 'Se actualizó con éxito.' });

            }
          } else {
            this.messageService.add({ key: 'mr', severity: 'warn', summary: 'Advertencia', detail: respEditarContrato.mensaje });
          }
        }

        break;
      //fin
      default:
        this.dialog = false;
        this.bloquearPag = false;
        return;
    }

  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }
  coreAgregar() {
    if (!this.puedeEditar) {
      var objLote = new DtoClassContratoComision;
      objLote.Id = this.lstComisionista.length + 1;
      this.lstComisionista.push(objLote);
    }
  }
  coreEliminar(row: DtoClassContratoComision, index: number) {
    if (!this.puedeEditar) {
      this.lstComisionista.splice(index, 1);
      this.calculoComisionista();
    }
  }

  async calculo() {

    // Costo total
    this.dto.Monto;
    // Cuota inicial
    this.lstdetContrato[0].Monto;
    // Total de cuotas
    this.lstdetContrato[1].Cantidad

    /*tabla:
                              monto                         cantidad
  cuota inicial   this.lstdetContrato[0].Monto    this.lstdetContrato[0].Cantidad
  letras          this.lstdetContrato[1].Monto    this.lstdetContrato[1].Cantidad
  cuota final     this.lstdetContrato[2].Monto    this.lstdetContrato[2].Cantidad

*/
    // Saldo
    // formula: montototal - Monto Separacion
    if (this.dto.ValorSeparacion > 0 && this.dto.ValorSeparacion > this.lstdetContrato[0].Monto) {
      this.dto.Saldo = this.dto.Monto - this.dto.ValorSeparacion;
    } else {
      // formula: montototal - cuota inicial
      this.dto.Saldo = this.dto.Monto - this.lstdetContrato[0].Monto;
    }

    // letras
    // monto = Saldo / Cantidad de letras;
    this.lstdetContrato[1].Monto = await this.dto.Saldo / (this.lstdetContrato[1].Cantidad + 1); // +2?
    this.lstdetContrato[1].Monto = await Number(this.lstdetContrato[1].Monto.toFixed(6));
    // cantidad this.lstdetContrato[1].Cantidad

    // si sale con decimales el monto de letra ( 0.54)
    let MontoCuotasCas: number = await Number(
      (Number(this.lstdetContrato[1].Monto.toFixed(6)) - (Math.floor(Number(this.lstdetContrato[1].Monto.toFixed(6))))).toFixed(6)
    );

    // Diferencia
    let diferencia = await MontoCuotasCas * this.lstdetContrato[1].Cantidad;
    let diferenciacast = await Number(diferencia.toFixed(2));

    // Ult Cuota
    this.lstdetContrato[2].Monto = await Math.round(this.lstdetContrato[1].Monto + diferenciacast);

    //quitamos diferencia
    this.lstdetContrato[1].Monto = this.lstdetContrato[1].Monto - MontoCuotasCas;


    let calculo = Math.floor(this.lstdetContrato[1].Monto) * this.lstdetContrato[1].Cantidad;
    calculo = await calculo + this.lstdetContrato[2].Monto;
    calculo = await calculo + this.lstdetContrato[0].Monto;
  }




  async calculoComisionista() {
    this.dto.ComisionTotal = 0;
    this.lstComisionista.forEach(e => {
      this.dto.ComisionTotal = this.dto.ComisionTotal + e.Porcentaje;
    });

  }

  async generarPdfLetrar() {

    try {
      if (this.validarform == 'EDITAR' || this.validarform == 'VER') {
        console.log("generarPdfLetrar", this.dto);
        const respLetrasPdf = await this.contratoService.ListarLetraImpresion(this.dto.IdContrato);
        console.log("generarPdfLetrar RETORNo", respLetrasPdf);
        let basePrueba = respLetrasPdf.mensaje;
        this.convertirAPdf(basePrueba, this.dto.IdContrato);
      } else {
        this.messageService.add({ key: 'mr', severity: 'warn', summary: '', detail: 'Primero se debe crear el contrato.' });
      }
    } catch (e) {
      console.log('error', e);

      this.messageService.add({ key: 'mr', severity: 'error', summary: 'Error', detail: 'Error al generar PDF de letras' });

    }
  }

  convertirAPdf(base64String: string, filename) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${filename}.pdf`;
    link.click();
  }


  btnCerrar() {
    this.lstPrograma = [];
    this.lstSucursal = [];
    this.lstPrograma = [];
    this.lstManzana = [];
    this.lstLote = [];

    this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    this.fechaCreacion = undefined;
    this.fechaModificacion = undefined;
  }

}

