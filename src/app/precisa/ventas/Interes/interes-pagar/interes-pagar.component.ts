import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { FiltroCuentaBancaria } from '../../../maestros/CuentaBancaria/model/FiltroCuentaBancaria';
import { CuentaBancariaService } from '../../../maestros/CuentaBancaria/service/cuentabancaria.service';
import { FiltroBanco } from '../../../maestros/maestroBanco/dominio/filtro/FiltroBanco';
import { MaestroBancoService } from '../../../maestros/maestroBanco/servicio/maestro-banco.service';
import { Filtrotipodecambio } from '../../../maestros/TipoCambio/dominio/filtro/Filtrotipodecambio';
import { MaestrotipocambioService } from '../../../maestros/TipoCambio/servicio/maestrotipocambio.service';
import { DtoContrato } from '../../Contrato/model/DtoContrato';

import { DtoInteres } from '../../Interes/model/Dtointeres';
import { InteresService } from '../../Interes/service/interes.service';
import { FiltroControl } from '../../Control/model/filtroControl';
import { ControlService } from '../../Control/service/control.service';
import { DtoTipocambiomast } from '../../../maestros/TipoCambio/dominio/dto/DtoTipocambiomast';
import { DtoBanco } from '../../../maestros/maestroBanco/dominio/dto/DtoBanco';
import { DtoCuentaBancaria } from '../../../maestros/CuentaBancaria/model/DtoCuentaBancaria';
import { DtoCorrelativo } from '../../../liquidacion/correlativos/model/DtoCorrelativo';
import { CorrelativoService } from '../../../liquidacion/correlativos/services/correlativo.service';
import { DtoClassComprobante } from '../../Control/model/DtoClassComprobante';
import { ImprimirLetra } from '../../Contrato/model/imprimirletra';

@Component({
  selector: 'ngx-interes-pagar',
  templateUrl: './interes-pagar.component.html'
})
export class InteresPagarComponent extends ComponenteBasePrincipal implements OnInit {

  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = "";
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  TipoDeCambio: number;
  disabledBanco: boolean;
  lstTipoCambios: DtoTipocambiomast[] = []
  position: string = "top";
  puedeEditar: boolean = false;
  contrato: DtoContrato = new DtoContrato();
  lstMoneda: SelectItem[] = [];
  lstSerie: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];
  lstTipoPago: SelectItem[] = [];
  lstBanco: SelectItem[] = [];
  lstTipoDescuento: SelectItem[] = [];

  lstTipoMotivo: SelectItem[] = [];
  dtoInteres: DtoInteres = new DtoInteres();
  FiltroBanco: FiltroBanco = new FiltroBanco();
  // lstLetra: DtoInteres[] = [];
  lstInteres: any[] = [];
  lstLetra: any[] = [];
  lstcuentaBancaria: any[] = [];
  TipoDescuento: number = 0;
  descuento: number = 0;
  observacion: string = '';
  nuevoTotal: number = 0;
  montoTotal: number = 0;
  montoPagar: number = 0;
  tipoDescuento: string = '';
  PeriodoEmision: string = null
  FiltroLetra: FiltroControl = new FiltroControl();
  visible: boolean = false;
  isMontoEnabled: boolean = true;
  montoEditable: boolean = false; // Controla si el campo es editable
  FlagAproInteres : number; // Flag para habilitar la edición (simulación)



  constructor(
    private _CuentaBancariaService: CuentaBancariaService,
    private _MaestrotipocambioService: MaestrotipocambioService,
    private _MaestroBancoService: MaestroBancoService,
    private _MessageService: MessageService,
    private confirmationService: ConfirmationService,
    private _InteresService: InteresService,
    private controlService: ControlService,
    private CorrelativoService: CorrelativoService,

  ) { super(); }


  ngOnInit(): void {
/*     throw new Error('Method not implemented.'); */
  }

  async coreIniciarComponente(msj: MensajeController, accion: string, _contrato?: DtoContrato, _Intereses?: DtoInteres[]) {
    if (_Intereses.length == 0) {
      this.message('error', 'Error', 'No se pudo cargar los intereses');
      this.puedeEditar = true;
      return;
    }
    this.isMontoEnabled  = true;
    //variables de entorno
    this.mensajeController = msj;
    this.acciones = accion;
    this.dialog = true;
    this.disabledBanco = false;
    //asignar variables personalizadas
    this.FlagAproInteres = this.getUsuarioAuth().data[0]?.FlagAproInteres;
    this.nuevoTotal = 0;
    this.tipoDescuento = null;
    //obtener data entrante

    this.contrato = await _contrato;
    console.log("_contrato JORDAN", _contrato);
    this.lstInteres = _Intereses;
    this.montoPagar = 0;
    console.log("this.lstLetra :: ",  this.lstInteres);
    this.lstInteres.forEach(e => {
      this.montoPagar += e.TotalMora;
      if(e.DiasMora >11){
        this.isMontoEnabled  = false;
      }    
    });

    console.log(" this.isMontoEnabled ",  this.isMontoEnabled );

    this.montoTotal = 0;
    this.dtoInteres.Observacion = null;
    this.bloquearPag = true;
    switch (this.acciones) {

      case 'PAGAR':
        const ismonedas: boolean = await this.cargarMoneda();
        if (!ismonedas) {
          this.message('error', 'Error', 'Error al cargar.');
        }

        const isTipoComprobantes: boolean = await this.cargarTipoComprobante();
        if (!isTipoComprobantes) {
          this.message('error', 'Error', 'Error al cargar.');
        }

        const isBancos: boolean = await this.cargarComboBanco();
        if (!isBancos) {
          this.message('error', 'Error', 'Error al cargar.');
        }

        this.puedeEditar = false;
        const isCuentaBancaria: boolean = await this.cargarcuentaBancaria('0');
        if (!isCuentaBancaria) {
          this.message('error', 'Error', 'Error al cargar.');
        }

        var hoy = new Date();
        var dia = hoy.getDate();
        var mes = hoy.getMonth() + 1;
        var anio = hoy.getFullYear();
        //asignar variables personalizadas
        this.contrato.FechaCreacion = await new Date(`${anio},${mes},${dia}`);
        //llenar combos
        this.lstTipoCambios = await this.cargarTipoCambio();
        this.lstTipoCambios.forEach(element => {
          if (element.FactorVenta == undefined || element.Estado == "I") {
            this._MessageService.add({
              key: "bc",
              severity: "warn",
              summary: "Advertencia",
              detail: "No tiene un tipo de cambio establecido",
            });
            this.puedeEditar = true;
          }
          this.TipoDeCambio = (element.Estado != "I" || element.Estado == undefined) ? element.FactorVenta : 0;
        })
        this.contrato.TipoCambio = this.TipoDeCambio;
        this.contrato.TipoComprobante = 'RE';
        await this.SeleccioneSerie();
        this.contrato.SerieComprobante = await "I001";
        const isFormaPago: boolean = await this.cargarFormaPago();
        if (!isFormaPago) {
          this.message('error', 'Error', 'Error al cargar.');
        }
        this.contrato.FechaEmision = new Date(`${anio},${mes},${dia}`);
        this.contrato.TipoCambio = this.TipoDeCambio;
        this.contrato.FechaModificacion = new Date(`${anio},${mes},${dia}`);
        this.contrato.FechaModificacion.setMonth(this.contrato.FechaModificacion.getMonth() + 1);

        /**LIMPIEZA DE DATOS QUE SE QUEDAN PEGADOS */
        this.contrato.Observacion = null;
        this.contrato.FormaPago = null;
        this.contrato.CampoReferencia = null;
        break;

      case 'VER':
        this.puedeEditar = true;
        this.disabledBanco = true;
        this.acciones = 'VER PAGO';

        this.contrato = new DtoContrato(); 
        this.contrato.IdComprobante = this.lstInteres[0].IdComprobante;
        this.dialog = true;

        this.lstTipoCambios = await this.cargarTipoCambio();
        this.lstTipoCambios.forEach(element => {
          if (element.FactorVenta == undefined || element.Estado == "I") {
            this._MessageService.add({
              key: "bc",
              severity: "warn",
              summary: "Advertencia",
              detail: "No tiene un tipo de cambio establecido",
            });
            this.puedeEditar = true;
          }
          this.TipoDeCambio = (element.Estado != "I" || element.Estado == undefined) ? element.FactorVenta : 0;
        })

        this.contrato.TipoCambio = this.TipoDeCambio;
        const ismonedas1: boolean = await this.cargarMoneda();
        if (!ismonedas1) {
          this.message('error', 'Error', 'Error al cargar.');
        }

        const isTipoComprobantes1: boolean = await this.cargarTipoComprobante();
        if (!isTipoComprobantes1) {
          this.message('error', 'Error', 'Error al cargar.');
        }

        const isFormaPago1: boolean = await this.cargarFormaPago();
        if (!isFormaPago1) {
          this.message('error', 'Error', 'Error al cargar.');
        }

        const isBancos1: boolean = await this.cargarComboBanco();
        if (!isBancos1) {
          this.message('error', 'Error', 'Error al cargar.');
        }

        const isSerie = await this.SeleccioneSerie();
        console.log(isSerie);

        const isCuentaBancaria1: boolean = await this.cargarcuentaBancaria(this.contrato.CompaniaCodigo);
        if (!isCuentaBancaria1) {
          this.message('error', 'Error', 'Error al cargar.');
        }

        await this.controlService.ListarFacturacion(this.contrato).then(async (res) => {
          console.log("VER_LETRA mensajeController", res);
          this.contrato = res[0];
          this.dtoInteres.Observacion = this.contrato.Observacion;
          this.contrato.SerieComprobante = res[0].SerieComprobante;
          this.contrato.Banco = res[0].Banco;
          this.contrato.CuentaBancaria = await res[0].CuentaBancaria;
          this.contrato.TipoCambio = res[0].TipoCambio;
          this.contrato.MonedaCodigo = res[0].MonedaCodigo;
          this.contrato.ValorLetra = res[0].MontoTotal;
          this.contrato.TipoPago = res[0].FormaPago;
          this.contrato.FechaEmision = new Date(res[0].FechaEmision);
        });

        this.contrato.TipoCambio = this.TipoDeCambio;
        this.contrato.FechaModificacion = new Date(`${anio},${mes},${dia}`);
        this.contrato.FechaModificacion.setMonth(this.contrato.FechaModificacion.getMonth() + 1);
        this.contrato.FechaEmision = new Date(this.contrato.FechaEmision);
        break;
      case 'REFINANCIAR':
        this.nuevoTotal = 0;
        this.descuento = 0;
        this.puedeEditar = false;
        this.dtoInteres = { ...this.lstInteres[0] };
        console.log("this.dtoInteres", this.dtoInteres);

        const isTipoDescuen: boolean = await this.cargarTipoDescuento();
        if (!isTipoDescuen) {
          this.message('error', 'Error', 'Error al cargar.');
        }

        const isTipoMotivo: boolean = await this.cargarTipoMotivo();
        if (!isTipoMotivo) {
          this.message('error', 'Error', 'Error al cargar.');
        }

        this.TipoDescuento = null;
        let calculo = async () => {
          for (let letra of this.lstInteres) {
            this.montoTotal += letra.TotalMora;
          }
        }
        calculo();
        break;
    }
    this.bloquearPag = false;
  }

  toggleMontoEditable() {
    if (this.FlagAproInteres) {
      this.montoEditable = !this.montoEditable;

        // Cambiar monto a 0.00
        this.montoPagar = 0.00;

        // Cambiar observación
        this.contrato.Observacion = 'SE ESTA MODIFICANDO EL MONTO=0 POR REGULARIZACION';

        // Cambiar monto de letra en la tabla
        this.lstInteres.forEach((row) => {
          row.TotalMora = 0.00;
        });

    console.log('Monto y observaciones actualizadas:', this.montoPagar, this.contrato.Observacion);
    console.log('Detalle actualizado:', this.lstInteres);

    } else {
      alert('No tienes permiso para editar este monto.');
    }
  }

  onMontoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.montoPagar = parseFloat(input.value);
    console.log('Nuevo monto:', this.montoPagar);
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
    const respTipoCambios = await this._MaestrotipocambioService.listarmaestroTipoCambio(filtroTipoDeCambio);
    if (respTipoCambios.length == 0) {
      this.puedeEditar = true;
      this.disabledBanco = true;
      this.TipoDeCambio = 0; //duda
      this._MessageService.add({
        key: "bc",
        severity: "warn",
        summary: "",
        detail: "No tiene un tipo de cambio establecido.",
      });
      return [];
    } else { return respTipoCambios; }
  }

  async cargarMoneda(): Promise<boolean> {
    this.lstMoneda = [];
    this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "MONEDA").forEach(i => {
      this.lstMoneda.push(
        {
          label: i.Nombre.toUpperCase().trim(),
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
      this.lstTipoComprobante.push({ label: i.Nombre.toUpperCase().trim(), value: i.Codigo.trim() });
    });
    if (this.lstTipoComprobante.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  async cargarTipoMotivo(): Promise<boolean> {
    this.lstTipoMotivo = [];
    this.lstTipoMotivo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPMOTIVO").forEach(i => {
      this.lstTipoMotivo.push({ label: i.Nombre.toUpperCase().trim(), value: i.Codigo.trim() });
    });
    if (this.lstTipoMotivo.length == 0) {
      return false;
    } else {
      return true;
    }
  }
  

  async SeleccioneSerie() {
    console.log("SeleccioneSerie", this.lstInteres[0]);
    const isSerie: boolean = await this.cargarSerie(this.lstInteres[0].CompaniaCodigo);
    if (!isSerie) {
      this.message('error', 'Error', 'Error al cargar.');
    }

  }

  async calculoLetras(): Promise<DtoContrato> {
    this.FiltroLetra = new FiltroControl();
    this.FiltroLetra.IdContrato = this.contrato.IdContrato;
    this.FiltroLetra.IdLetra = this.lstInteres[0].Nombre.split(',')[0];
    this.lstInteres[0].Nombre;

    for (let i = 0; i < this.lstInteres.length; i++) {
      this.FiltroLetra = new FiltroControl();
      this.FiltroLetra.IdContrato = this.contrato.IdContrato;
      this.FiltroLetra.IdLetra = this.lstInteres[0].Nombre.split(',')[i];
      let letra = await this.controlService.ListarLetra(this.FiltroLetra);
      this.lstLetra.push(letra[0]);
    }

    const letras: any[] = await this.controlService.ListarLetra(this.FiltroLetra);    
    let facturacionLetras: DtoContrato = new DtoContrato();
    console.log("letras[0].IdComprobante",);
    facturacionLetras.IdComprobante = letras[0].IdComprobante
    const facturaletras = await this.controlService.ListarFacturacion(facturacionLetras);
    console.log("facturaletras", facturaletras);
    facturacionLetras = facturaletras[0];
    facturacionLetras.FechaVencimiento = letras[0].FechaVencimiento;
    return facturacionLetras;

  }

  async calculoVer() {

    let contratoFiltro = new FiltroControl();
    contratoFiltro.IdContrato = this.contrato.IdContrato;
    let buscarContrato = await this.calculoLetras();
    console.log("this.contrato.FechaEmision", buscarContrato[0].FechaEmision);
    let fechaHoy: Date = await buscarContrato.FechaEmision;
    let fechaAtrasada: Date;
    let diferencia_mm: number;
    this.contrato.ValorLetra = 0;
    this.contrato.DiasGracia = 0;
    this.contrato.ComisionTotal = 0;
    let tazaInteres = (this.contrato.TasaInteres / 100);

    this.lstLetra.forEach(e => {
      fechaAtrasada = new Date(e.FechaVencimiento);
      fechaHoy.setHours(0, 0, 0, 0);
      fechaAtrasada.setHours(0, 0, 0, 0);
      diferencia_mm = fechaHoy.getTime() - fechaAtrasada.getTime();
      e.diasAtrasados = Math.round(diferencia_mm / 1000 / 60 / 60 / 24);
      e.diasAtrasados = e.diasAtrasados;
      let interesPrimario = e.diasAtrasados * tazaInteres;
      console.log("DIAS ATRASADOS", e.diasAtrasados);
    });
    console.log("DÏAs", this.lstLetra);
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
      this.lstSerie.push({ label: ele.Serie.toUpperCase().trim(), value: ele.Serie });
    });
    console.log("lstSerie", this.lstSerie);

    if (this.lstSerie.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  async cargarFormaPago(): Promise<boolean> {
    this.lstTipoPago = [];
    this.lstTipoPago.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "FORMAPAGO").forEach(i => {
      this.lstTipoPago.push({ label: i.Nombre.toUpperCase().trim(), value: i.Codigo.trim() });
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
    const Respbancos: DtoBanco[] = await this._MaestroBancoService.listarmaestroBancos(this.FiltroBanco);

    Respbancos.forEach(ele => {
      this.lstBanco.push({ label: ele.DescripcionCorta.toUpperCase().trim(), value: ele.Banco });
    });
    if (this.lstBanco.length == 0) {
      return false;
    } else {
      return true;
    }
  }


  async cargarTipoDescuento(): Promise<boolean> {
    this.lstTipoDescuento = [];
    this.lstTipoDescuento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "FORMULA").forEach(i => {
      console.log(i);
      this.lstTipoDescuento.push({ label: i.Nombre.toUpperCase().trim(), value: i.Codigo.trim(), title: i.IdCodigo.toString() });
    });
    console.log("lstTipoDescuento", this.lstTipoDescuento);

    if (this.lstTipoDescuento.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  async selectTipoDescuento(event) {
      for (let tpdescuento of this.lstTipoDescuento) {
          if (tpdescuento.value == event.value) {
            this.tipoDescuento = tpdescuento.title;
            return;
          }
      }
  }


  async cargarcuentaBancaria(CompaniaCodigo: string): Promise<boolean> {
    this.lstcuentaBancaria = [];
    const filtroCuentaBancaria: FiltroCuentaBancaria = new FiltroCuentaBancaria();
    filtroCuentaBancaria.Estado = "A";
    filtroCuentaBancaria.CompaniaCodigo = CompaniaCodigo;
    filtroCuentaBancaria.Banco = this.contrato.Banco;

    this.lstcuentaBancaria.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    const respCuentaBancaria: DtoCuentaBancaria[] = await this._CuentaBancariaService.listarCuentaBancaria(filtroCuentaBancaria);
    respCuentaBancaria.forEach(ele => {
      this.lstcuentaBancaria.push({ label: ele.Descripcion.toUpperCase().trim(), value: ele.CuentaBancaria });
    });
    if (this.lstcuentaBancaria.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  message(tipo: string, titulo: string, msg: string) {
    this._MessageService.add({
      key: "bc",
      severity: tipo,
      summary: titulo,
      detail: msg,
    });
  }

  async calculoRefinanciar() {
    if (this.descuento > this.montoTotal) {
      this.message('warn', '', 'El descuento no puede ser mayor al monto total');
      return;
    }

    switch (this.tipoDescuento) {
      case '1':
        console.log("MONTO");
        this.nuevoTotal = this.montoTotal - this.descuento;
        break;
      case '2':
        console.log("PORCENTAJE");
        this.nuevoTotal = this.montoTotal - Math.round((this.descuento * this.montoTotal) / 100);
        break;
      default:
        this.nuevoTotal = 0;
        break;
    }
    
    if (this.descuento == 0) {
      this.nuevoTotal = 0;
    }
    this.nuevoTotal = Number.isNaN(this.nuevoTotal) ? 0 : this.nuevoTotal;
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
      this.contrato.CuentaBancaria = null;
      this.contrato.CampoReferencia = null;
      this.disabledBanco = true;
    }
  }

  async cuentaBancaria() {
    const isCuentaBancaria: boolean = await this.cargarcuentaBancaria(this.lstInteres[0].CompaniaCodigo);
    if (!isCuentaBancaria) {
      this.message('error', 'Error', 'Error al cargar.');
    }
  }

  async corepagar() {

    switch (this.acciones) {
      case 'PAGAR':
        try {

          if (this.estaVacio(this.contrato.TipoComprobante)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de comprobante válido'); return; }
          if (this.estaVacio(this.contrato.SerieComprobante)) { this.messageShow('warn', 'Advertencia', 'Seleccione una serie válida'); return; }
          if (this.estaVacio(this.contrato.MonedaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione una moneda válida'); return; }
          if (this.estaVacio(this.contrato.FormaPago)) { this.messageShow('warn', 'Advertencia', 'Seleccione una forma de pago válida'); return; }
          if (this.estaVacio(this.contrato.Observacion)) { this.messageShow('warn', 'Advertencia', 'Agregar la Observación'); return; }

          console.log("PAGAR contrato", this.contrato);
          this.bloquearPag = true;
          const ComprobanteEnv: DtoClassComprobante = new DtoClassComprobante();
          ComprobanteEnv.Comprobante = this.contrato;
          ComprobanteEnv.Comprobante.MontoAfecto = this.montoPagar;
          ComprobanteEnv.Comprobante.MontoImpuestoVentas = 0;
          ComprobanteEnv.Comprobante.ValorImpuesto = 0;
          ComprobanteEnv.Comprobante.MontoTotal = this.montoPagar;
          ComprobanteEnv.Comprobante.PeriodoEmision = this.PeriodoEmision;
          ComprobanteEnv.Comprobante.FormaPago = this.contrato.FormaPago;
          ComprobanteEnv.Comprobante.Observacion = this.contrato.Observacion;
          ComprobanteEnv.Comprobante.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();

          console.log("this.antes", this.lstInteres);
          ComprobanteEnv.Detalle = this.lstInteres.map((item) => ({...item}));
          for(let i=0; i< this.lstInteres.length; i++){
             this.lstInteres[i].codigocomponente = "330033"; //codigo de interes
             this.lstInteres[i].FechaPago = new Date();
             this.lstInteres[i].FechaPago.setHours(this.lstInteres[i].FechaPago.getHours() - 5);
             this.lstInteres[i].MontoAfecto = this.lstInteres[i].MontoPago;
             this.lstInteres[i].MontoTotal = this.lstInteres[i].MontoPago;

             ComprobanteEnv.Detalle[i].Nombre = this.lstInteres[i].Observacion;             
             ComprobanteEnv.Detalle[i].codigocomponente = "330033"; //codigo de interes
             ComprobanteEnv.Detalle[i].FechaPago = this.lstInteres[i].FechaPago;
             ComprobanteEnv.Detalle[i].MontoAfecto = this.lstInteres[i].MontoPago;
             ComprobanteEnv.Detalle[i].MontoTotal = this.lstInteres[i].MontoPago;
          }

          const Facturacion = await this.controlService.MantenimientoFacturacion(1, ComprobanteEnv, this.getUsuarioToken());
          console.log("MantenimientoFacturacion ", Facturacion);
          if (Facturacion.success) {
            for (let interes of this.lstInteres) {
              interes.Estado = 2;
              interes.IdComprobante = Facturacion.valor;
              interes.FormaPago = this.contrato.FormaPago;
              interes.Banco = this.contrato.Banco;
              interes.CuentaBancaria = this.contrato.CuentaBancaria;
              interes.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario.trim();
              console.log("Envio interes", interes);
              const respPagoInteres = await this._InteresService.MantenimientoInteres(2, interes, this.getUsuarioToken());
              console.log('pago MantenimientoInteres ', respPagoInteres);

              if (respPagoInteres.success) {
                this.message('success', '', 'pago de interes Realizado.');
                this.mensajeController.resultado = respPagoInteres;
                this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                this.bloquearPag = false;
                this.dialog = false;
              } else {
                this.message('error', 'Error', 'Error al pagar.');
                this.bloquearPag = false;
              }
            }
          } else {
            this.message('error', 'Error', 'Error al pagar.');
            this.bloquearPag = false;
            return;
          }

        } catch (e) {
          this.message('error', 'Error', 'Error al pagar.');
          console.log(e)
        }
        break;
      case 'REFINANCIAR':
        if (this.nuevoTotal <= 0) { this.messageShow('warn', 'Advertencia', 'El nuevo refinanciamiento no puede ser 0'); return; }
        if (this.descuento <= 0) { this.messageShow('warn', 'Advertencia', 'Ingrese undescuento válido'); return; }
        if (this.estaVacio(this.TipoDescuento)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de descuento válido'); return; }

        this.visible = true;
        this.confirmationService.confirm({
          header: "Confirmación",
          icon: "fa fa-question-circle",
          message: "¿Desea refinanciar el interes? ",
          key: "refinanciar",
          accept: async () => {
            this.dtoInteres.InteresPadre = null;
            this.dtoInteres.TotalMora = this.nuevoTotal;
            this.dtoInteres.MontoPago = this.nuevoTotal;
            this.dtoInteres.Descuento = this.descuento;
            this.dtoInteres.TipoDescuento = this.TipoDescuento;
            this.dtoInteres.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();
            this.visible = false;
            const respNuevoInteres = await this._InteresService.MantenimientoInteres(1, this.dtoInteres, this.getUsuarioToken());
            if (respNuevoInteres.success) {
              for (let interes of this.lstInteres) {
                interes.Estado = 3;
                interes.InteresPadre = respNuevoInteres.data.IdInteres;
                interes.Observacion = interes.Observacion;
                interes.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario.trim();
                const respPagoInteres = await this._InteresService.MantenimientoInteres(4, interes, this.getUsuarioToken());
                console.log(respPagoInteres);

                if (respPagoInteres.success) {
                  this.message('success', '', 'Intereses refinanciados.');
                  this.mensajeController.resultado = respPagoInteres;
                  this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                  this.bloquearPag = false;
                  this.dialog = false;

                } else {
                  this.message('error', 'Error', 'Error al refinanciar.');
                  this.bloquearPag = false;
                  this.visible = false;
                }
              }
            }
          },
          reject: async () => {
            this.visible = false;
          }
        });

        break;
    }

  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this._MessageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }
  //CALCULO 
  async calculo() {
    let fechaHoy: Date = new Date();
    let fechaAtrasada: Date;
    let diferencia_mm: number;
    this.contrato.DiasGracia = 0;
    this.contrato.ComisionTotal = 0;
    this.lstInteres.forEach(e => {
      fechaAtrasada = new Date(e.FechaVencimiento);
      fechaHoy.setHours(0, 0, 0, 0);
      fechaAtrasada.setHours(0, 0, 0, 0);
      diferencia_mm = fechaHoy.getTime() - fechaAtrasada.getTime();
      e.diasAtrasados = Math.round(diferencia_mm / 1000 / 60 / 60 / 24);
      e.Interes = (e.MontoTotal * (this.contrato.TasaInteres / 100)) * e.diasAtrasados;
      /*       
      console.log("MONTO TOTAL", e.MontoTotal);
      console.log("TAZA INTERES", this.contrato.TasaInteres);
      console.log("DIAS ATRASADOS", e.diasAtrasados);
      console.log("PRIMER CALCULO INTERES", e.Interes); 
      */
      if (e.diasAtrasados <= 0) {
        e.diasAtrasados = 0;
      }
      if (e.Interes <= 0) {
        e.Interes = 0;
      }
      this.contrato.ComisionTotal += e.Interes;
      this.contrato.DiasGracia += e.diasAtrasados;

    });

    this.contrato.ComisionTotal = this.contrato.ComisionTotal.toFixed(2)
    console.log("DÏAs", this.lstInteres);
  }

  async generarPdf() {
    try {
        console.log("generarPdf", this.contrato);
        let imprimirLetra:ImprimirLetra = new ImprimirLetra();
        imprimirLetra.valor = this.contrato.IdComprobante;   
        const respLetrasPdf = await this.controlService.ListarComprobanteReporte(imprimirLetra);
        console.log("generarPdf RETORNo", respLetrasPdf);
        let basePrueba = respLetrasPdf.mensaje;      
        this.convertirAPdf( basePrueba,this.contrato.IdComprobante);

    } catch (e) {
      console.log('error', e);
      this.messageShow('warn', 'Advertencia', 'Error al generar PDF ');
    }
  }

  convertirAPdf(base64String: string, filename) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${filename}.pdf`;
    link.click();
  }

}
