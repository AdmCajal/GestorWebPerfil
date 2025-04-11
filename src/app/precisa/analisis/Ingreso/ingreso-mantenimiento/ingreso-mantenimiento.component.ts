import { Component, OnInit } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { MensajeController } from '../../../../../util/MensajeController';
import { ControlService } from '../../../ventas/Control/service/control.service';
import { DtoContrato } from '../../../ventas/Contrato/model/DtoContrato';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { DtoBanco } from '../../../maestros/maestroBanco/dominio/dto/DtoBanco';
import { MaestroBancoService } from '../../../maestros/maestroBanco/servicio/maestro-banco.service';
import { FiltroBanco } from '../../../maestros/maestroBanco/dominio/filtro/FiltroBanco';
import { FiltroCuentaBancaria } from '../../../maestros/CuentaBancaria/model/FiltroCuentaBancaria';
import { DtoCuentaBancaria } from '../../../maestros/CuentaBancaria/model/DtoCuentaBancaria';
import { CuentaBancariaService } from '../../../maestros/CuentaBancaria/service/cuentabancaria.service';
import { FiltroControl } from '../../../ventas/Control/model/filtroControl';
import { InteresService } from '../../../ventas/Interes/service/interes.service';
import { DtoInteres } from '../../../ventas/Interes/model/Dtointeres';
import { DtoCorrelativo } from '../../../liquidacion/correlativos/model/DtoCorrelativo';
import { CorrelativoService } from '../../../liquidacion/correlativos/services/correlativo.service';
import { DtoTipocambiomast } from '../../../maestros/TipoCambio/dominio/dto/DtoTipocambiomast';
import { MessageService, SelectItem } from 'primeng/api';
import { MaestrotipocambioService } from '../../../maestros/TipoCambio/servicio/maestrotipocambio.service';
import { ContratoService } from '../../../ventas/Contrato/service/contrato.service';
import { LoteService } from '../../../proyecto/Lotes/service/lotes.service';
import { Filtrotipodecambio } from '../../../maestros/TipoCambio/dominio/filtro/Filtrotipodecambio';
import { DtoClassComprobante } from '../../../ventas/Control/model/DtoClassComprobante';
import { DtoClassContrato } from '../../../ventas/Contrato/model/DtoClassContrato';
import { FiltroLote } from '../../../proyecto/Lotes/model/FiltroLote';
import { DtoLote } from '../../../proyecto/Lotes/model/DtoLote';

@Component({
  selector: 'ngx-ingreso-mantenimiento',
  templateUrl: './ingreso-mantenimiento.component.html',
  styleUrls: ['./ingreso-mantenimiento.component.scss']
})
export class IngresoMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
 
  bloquearPag: boolean;
  validarform: string = null;
  PeriodoEmision: string = null;
  acciones: string = "";
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  dtoIngreso: DtoContrato;
  TipoDeCambio: number;
  disabledBanco: boolean;
  lstTipoCambios: DtoTipocambiomast[] = [];
  position: string = "top";
  puedeEditar: boolean = false;
  contrato: DtoContrato = new DtoContrato();
  lstMoneda: SelectItem[] = [];
  lstSerie: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];
  lstTipoPago: SelectItem[] = [];
  lstBanco: SelectItem[] = [];
  FiltroBanco: FiltroBanco = new FiltroBanco();
  lstLetra: any[] = [];
  lstcuentaBancaria: any[] = [];


  FiltroLetra: FiltroControl = new FiltroControl();
  constructor(
    private cuentaBancariaService: CuentaBancariaService,
    private maestrotipocambioService: MaestrotipocambioService,
    private maestroBancoService: MaestroBancoService,
    private messageService: MessageService,
    private controlService: ControlService,
    private contratoService: ContratoService,
    private loteService: LoteService,
    private interesService: InteresService,
    private CorrelativoService: CorrelativoService
  ) { super(); }
 
  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }


  coreBuscar(): void {
    throw new Error('Method not implemented.');
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

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  async coreIniciarComponente(msj: MensajeController, accion: string, _contrato?: DtoContrato, _Letras?: any[]) {

    this.puedeEditar = true;
    this.disabledBanco = true; 
    if (_Letras.length == 0) 
    {
      this.message('error', 'Error', 'No se pudo cargar las letras');
      this.puedeEditar = true;
      return;
    }

    this.contrato = new DtoContrato();
    this.bloquearPag = true;
    this.mensajeController = msj;
    console.log("mensajeController", this.mensajeController);
    this.contrato = await _contrato;
    this.contrato.FechaEmision = new Date(_contrato.FechaEmision);
    this.lstLetra = await  _Letras;

    console.log("mensajeController _contrato", this.contrato );
    console.log("mensajeController _Letras", this.lstLetra);

    const isTipoComprobantes: boolean = await this.cargarTipoComprobante();
    if (!isTipoComprobantes) {
      this.message('error', 'Error', 'Error al cargar.');
    }

    const ismonedas: boolean = await this.cargarMoneda();
    if (!ismonedas) {
      this.message('error', 'Error', 'Error al cargar.');
    }

    const isFormaPago: boolean = await this.cargarFormaPago();
    if (!isFormaPago) {
      this.message('error', 'Error', 'Error al cargar.');
    }

    const isBancos: boolean = await this.cargarComboBanco();
    if (!isBancos) {
      this.message('error', 'Error', 'Error al cargar.');
    }

    this.acciones = 'VER PAGO';

    const isSerie = await this.cargarSerie(this.contrato.CompaniaCodigo);
    console.log(isSerie);
    const isCuentaBancaria = await this.cuentaBancaria();
    console.log(isCuentaBancaria);
    this.dialog = true;     
    this.bloquearPag = false;
  }

  async cuentaBancaria() {
    const isCuentaBancaria: boolean = await this.cargarcuentaBancaria(this.contrato.CompaniaCodigo);
    if (!isCuentaBancaria) {
      this.message('error', 'Error', 'Error al cargar.');
    }
  }

  async coreCerrar() {
    this.dialog = false;
  }

  async cargarTipoCambio(): Promise<DtoTipocambiomast[]> {
    const filtroTipoDeCambio: Filtrotipodecambio = new Filtrotipodecambio();
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() + 1;
    var anio = hoy.getFullYear();

    this.PeriodoEmision = anio + '' + mes;
    filtroTipoDeCambio.fechacambio = new Date(`${anio},${mes},${dia}`);
    filtroTipoDeCambio.ultimafechamodif = new Date(`${anio},${mes},${dia}`);
    const respTipoCambios = await this.maestrotipocambioService.listarmaestroTipoCambio(filtroTipoDeCambio);
    if (respTipoCambios.length == 0) {

      this.puedeEditar = true;
      this.disabledBanco = true;
      this.TipoDeCambio = 0; //duda

      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "",
        detail: "No tiene un tipo de cambio establecido.",
      });
      this.dialog = false;
      return [];
    } else { return respTipoCambios; }
  }

  async cargarMoneda(): Promise<boolean> {
    this.lstMoneda = [];
    this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "MONEDA").forEach(i => {
      this.lstMoneda.push(
        {
          label: i.Nombre.trim(),
          value: i.Codigo.trim()
        }
      );
    });
    if (this.lstMoneda.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  async cargarTipoComprobante(): Promise<boolean> {
    this.lstTipoComprobante = [];
    this.lstTipoComprobante.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipoComprobante.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });

    this.lstSerie = [];
    this.lstSerie.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    if (this.lstTipoComprobante.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  async cargarFormaPago(): Promise<boolean> {
    this.lstTipoPago = [];
    this.lstTipoPago.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "FORMAPAGO").forEach(i => {
      this.lstTipoPago.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });
    if (this.lstTipoPago.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  async cargarComboBanco(): Promise<boolean> {
    this.FiltroBanco.estado = "A";
    this.lstBanco = [];
    console.log("FiltroBanco cargarComboBanco", this.FiltroBanco);
    this.lstBanco.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    const Respbancos: DtoBanco[] = await this.maestroBancoService.listarmaestroBancos(this.FiltroBanco);

    Respbancos.forEach(ele => {
      this.lstBanco.push({ label: ele.DescripcionCorta.trim(), value: ele.Banco });
    });
    if (this.lstBanco.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  async cargarcuentaBancaria(CompaniaCodigo: string): Promise<boolean> {
    this.lstcuentaBancaria = [];
    const filtroCuentaBancaria: FiltroCuentaBancaria = new FiltroCuentaBancaria();
    filtroCuentaBancaria.Estado = "A";
    filtroCuentaBancaria.CompaniaCodigo = CompaniaCodigo;
    filtroCuentaBancaria.Banco = this.contrato.Banco;

    this.lstcuentaBancaria.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    const respCuentaBancaria: DtoCuentaBancaria[] = await this.cuentaBancariaService.listarCuentaBancaria(filtroCuentaBancaria);
    respCuentaBancaria.forEach(ele => {
      this.lstcuentaBancaria.push({ label: ele.Descripcion.trim(), value: ele.CuentaBancaria });
    });
    if (this.lstcuentaBancaria.length == 0) {
      return false;
    } else {
      return true;
    }
  }


  message(tipo: string, titulo: string, msg: string) {
    this.messageService.add({
      key: "bc",
      severity: tipo,
      summary: titulo,
      detail: msg,
    });
  }

  async calculo() {
    let fechaHoy: Date = new Date();
    let fechaAtrasada: Date;
    let diferencia_mm: number;
    this.contrato.ValorLetra = 0;
    /**
    año * 12
    mes * 30dia */
    this.contrato.DiasGracia = 0;
    this.contrato.ComisionTotal = 0;
    let tazaInteres = (this.contrato.TasaInteres / 100);


    this.lstLetra.forEach(e => {
      this.contrato.ValorLetra += e.MontoTotal;
      if (e.Nombre.includes('INICIAL') || e.Nombre.includes('INCIAL')) {
        return;
      } else {
        fechaAtrasada = new Date(e.FechaVencimiento);
        let interes = tazaInteres * e.MontoTotal;

        diferencia_mm = fechaHoy.getTime() - fechaAtrasada.getTime();
        e.diasAtrasados = Math.round(diferencia_mm / 1000 / 60 / 60 / 24);
        let interesPrimario = e.diasAtrasados * tazaInteres;


        console.log("MONTO LETRA", e.MontoTotal);
        console.log("TAZA INTERES", interesPrimario);
        console.log("DIAS ATRASADOS", e.diasAtrasados);
        console.log("interes", tazaInteres);

        e.Interes = e.diasAtrasados * interes;
        console.log("PRIMER CALCULO INTERES", e.Interes);

        if (e.diasAtrasados <= 0) {
          e.diasAtrasados = 0;
          e.Interes = 0;
        }
        if (e.Interes <= 0) {
          e.Interes = 0;
        }
        if (e.diasAtrasados == undefined || e.diasAtrasados == undefined) {
          e.diasAtrasados = 0;
          e.Interes = 0;
        }
        e.Interes = Math.round(e.Interes);
        this.contrato.ComisionTotal += Math.round(e.Interes);
        this.contrato.DiasGracia += e.diasAtrasados
      }
    });

    this.contrato.ComisionTotal = this.contrato.ComisionTotal.toFixed(2)
    console.log("DÏAs", this.lstLetra);
  }

  async calculoVer() {

    let fechaHoy: Date = await this.contrato.FechaEmision;
    let fechaAtrasada: Date;
    let diferencia_mm: number;
    this.contrato.ValorLetra = 0;

    /**
    año * 12
    mes * 30dia */

    this.contrato.DiasGracia = 0;
    this.contrato.ComisionTotal = 0;
    let tazaInteres = (this.contrato.TasaInteres / 100);


    this.lstLetra.forEach(e => {
      this.contrato.ValorLetra += e.MontoTotal;
      if (e.Nombre.includes('INICIAL') || e.Nombre.includes('INCIAL')) {
        return;
      } else {
        fechaAtrasada = new Date(e.FechaVencimiento);
        let interes = tazaInteres * e.MontoTotal;

        diferencia_mm = fechaHoy.getTime() - fechaAtrasada.getTime();
        e.diasAtrasados = Math.round(diferencia_mm / 1000 / 60 / 60 / 24);
        e.diasAtrasados = e.diasAtrasados;
        let interesPrimario = e.diasAtrasados * tazaInteres;


        console.log("MONTO LETRA", e.MontoTotal);
        console.log("TAZA INTERES", interesPrimario);
        console.log("DIAS ATRASADOS", e.diasAtrasados);
        console.log("interes", tazaInteres);

        e.Interes = e.diasAtrasados * interes;
        console.log("PRIMER CALCULO INTERES", e.Interes);

        if (e.diasAtrasados <= 0) {
          e.diasAtrasados = 0;
          e.Interes = 0;
        }
        if (e.Interes <= 0) {
          e.Interes = 0;
        }
        e.Interes = Math.round(e.Interes);
        this.contrato.ComisionTotal += Math.round(e.Interes);
        this.contrato.DiasGracia += e.diasAtrasados

      }

    });

    this.contrato.ComisionTotal = this.contrato.ComisionTotal.toFixed(2)
    console.log("DÏAs", this.lstLetra);
  }

  validarTipoPago() {
    if (this.contrato.FormaPago == "TB") {
      this.contrato.Banco = "005";
      this.disabledBanco = false;
      this.cuentaBancaria();
    } else {
      this.contrato.Banco = null;
      this.disabledBanco = false;

    }

    if (this.contrato.FormaPago == "EF") {
      this.contrato.Banco = null;
      this.disabledBanco = true;
    }
  }

  async corepagar() {

  }


  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  async cargarSerie(CompaniaCodigo: string): Promise<boolean> {
    this.lstSerie = [];
    const FiltroCorrelativo: DtoCorrelativo = new DtoCorrelativo();
    FiltroCorrelativo.Estado = "A";
    FiltroCorrelativo.CompaniaCodigo = CompaniaCodigo;
    FiltroCorrelativo.TipoComprobante = this.contrato.TipoComprobante;
    console.log("FiltroCorrelativo cargarSerie", FiltroCorrelativo);

    this.lstSerie.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    const RespCorrelativo: DtoCorrelativo[] = await this.CorrelativoService.ListarCorrelativos(FiltroCorrelativo);

    RespCorrelativo.forEach(ele => {
      this.lstSerie.push({ label: ele.Serie.trim().toUpperCase(), value: ele.Serie });
    });
    if (this.lstSerie.length == 0) {
      return false;
    } else {
      return true;
    }


  }

}
