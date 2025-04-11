import { DtoClassContrato } from './../../Contrato/model/DtoClassContrato';
import { Component, OnInit } from '@angular/core';
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
import { DtoLetra } from '../model/dtoLetra';
import { ControlService } from '../service/control.service';
import { FiltroControl } from '../model/filtroControl';
import { DtoCuentaBancaria } from '../../../maestros/CuentaBancaria/model/DtoCuentaBancaria';
import { DtoBanco } from '../../../maestros/maestroBanco/dominio/dto/DtoBanco';
import { DtoTipocambiomast } from '../../../maestros/TipoCambio/dominio/dto/DtoTipocambiomast';
import { DtoCorrelativo } from '../../../liquidacion/correlativos/model/DtoCorrelativo';
import { CorrelativoService } from '../../../liquidacion/correlativos/services/correlativo.service';
import { DtoClassComprobante } from '../model/DtoClassComprobante';
import { MessageService, SelectItem } from 'primeng/api';
import { ContratoService } from '../../Contrato/service/contrato.service';
import { LoteService } from '../../../proyecto/Lotes/service/lotes.service';
import { InteresService } from '../../Interes/service/interes.service';
import { FiltroLote } from '../../../proyecto/Lotes/model/FiltroLote';
import { DtoInteres } from '../../Interes/model/Dtointeres';
import { DtoLote } from '../../../proyecto/Lotes/model/DtoLote';

@Component({
  selector: 'ngx-control-pagar',
  templateUrl: './control-pagar.component.html'
})
export class ControlPagarComponent extends ComponenteBasePrincipal implements OnInit {

  bloquearPag: boolean;
  validarform: string = null;
  PeriodoEmision: string = null;
  acciones: string = "";
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  TipoDeCambio: number;
  disabledBanco: boolean;
  lstTipoCambios: DtoTipocambiomast[] = [];
  position: string = "top";
  puedeEditar: boolean = false;
  puedeEditarTipoComprobante: boolean = false;
  contrato: DtoContrato = new DtoContrato();
  lstMoneda: SelectItem[] = [];
  lstSerie: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];
  lstTipoPago: SelectItem[] = [];
  lstBanco: SelectItem[] = [];
  FiltroBanco: FiltroBanco = new FiltroBanco();
  lstLetra: any[] = [];
  lstcuentaBancaria: any[] = [];
  lstInteresCal: any[] = [];
  CambioReferencial: number;

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


  ngOnInit(): void {

  }

  async coreIniciarComponente(msj: MensajeController, accion: string, _contrato?: DtoContrato, _Letras?: DtoLetra[]) {
    this.lstInteresCal = [];
    this.contrato = new DtoContrato();
    if (accion == "VER_LETRA") {
      this.puedeEditar = true;
      this.disabledBanco = true;
      this.puedeEditarTipoComprobante = true;
      
    }
    else {
      this.puedeEditar = false;
      this.disabledBanco = false;
      this.puedeEditarTipoComprobante = false;
    }


    if (_Letras.length == 0) {
      this.message('error', 'Error', 'No se pudo cargar las letras');
      this.puedeEditar = true;
      return;
    }

    this.bloquearPag = true;
    this.mensajeController = msj;
    console.log("mensajeController", this.mensajeController);

    const isTipoComprobantes: boolean = await this.cargarTipoComprobante();
    if (!isTipoComprobantes) {
      this.message('error', 'Error', 'Error al cargar Tipo Comprobante.');
    }

    const ismonedas: boolean = await this.cargarMoneda();
    if (!ismonedas) {
      this.message('error', 'Error', 'Error al cargar Moneda.');
    }

    const isFormaPago: boolean = await this.cargarFormaPago();
    if (!isFormaPago) {
      this.message('error', 'Error', 'Error al cargar Forma Pago.');
    }

    const isBancos: boolean = await this.cargarComboBanco();
    if (!isBancos) {
      this.message('error', 'Error', 'Error al cargar Banco.');
    }
    this.lstLetra = await _Letras;
    console.log("lstLetra", this.lstLetra);

    if (msj.componente == "VER_LETRA") {
      this.lstLetra.forEach(element => {
        this.contrato.IdComprobante = element.IdComprobante
      });
      this.acciones = 'VER PAGO';
      let contratoFiltro = new FiltroControl();
      contratoFiltro.IdContrato = _contrato.IdContrato;
      if(this.contrato.IdComprobante > 0 ){
        console.log("VER_LETRA mensajeController", this.contrato)
        await this.controlService.ListarFacturacion(this.contrato).then(async (res) => {
          console.log("VER_LETRA mensajeController", res[0]);
          console.log("this.lstLetra[0]", this.lstLetra[0]);
          this.contrato = await res[0];
          this.contrato.TasaInteres = _contrato.TasaInteres;
          this.contrato.Codigo = _contrato.Codigo;
          console.log("VER_LETRA this.contrato ", this.contrato); 
  
          //Se actualizó el colocar la serie
          this.lstSerie = [{ value: res[0].SerieComprobante, label: res[0].SerieComprobante }];
          this.contrato.SerieComprobante = res[0].SerieComprobante;
          this.contrato.TipoCambio = res[0].TipoCambio;
          this.contrato.ValorLetra = res[0].MontoAfecto;
          this.contrato.TipoPago = res[0].FormaPago;
          this.contrato.MonedaCodigo = res[0].MonedaCodigo;
          this.contrato.FechaEmision = new Date(res[0].FechaEmision);

        })
      }
     
      console.log("this.lstLetra[0]", this.contrato.SerieComprobante);
      const isSerie: boolean = await this.cargarSerie(this.lstLetra[0].CompaniaCodigo);
      console.log(isSerie);
      const isCuentaBancaria = await this.cuentaBancaria();
      console.log(isCuentaBancaria);
      this.dialog = true;
      await this.calculoVer();
    }
    else {
      this.acciones = `PAGAR`;
      this.dialog = true;
      this.lstcuentaBancaria = []
      this.lstcuentaBancaria.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      //obtener data entrante
      this.contrato = await { ..._contrato };
      var hoy = new Date();
      var dia = hoy.getDate();
      var mes = hoy.getMonth() + 1;
      var anio = hoy.getFullYear();

      //asignar variables personalizadas
      this.contrato.FechaCreacion = await new Date(`${anio},${mes},${dia}`);
      //llenar combos this.contrato.FechaEmision 
      this.lstTipoCambios = await this.cargarTipoCambio();
 
      this.lstTipoCambios.forEach(element => {
        console.log("this.lstTipoCambios", element);
        if (element.FactorVenta == undefined || element.Estado == "I") {
          this.messageService.add({
            key: "bc",
            severity: "warn",
            summary: "Advertencia",
            detail: "No tiene un tipo de cambio establecido",
          });
          this.puedeEditar = false;
          this.disabledBanco = false;
        } 
        this.TipoDeCambio = (element.Estado != "I" || element.Estado == undefined) ? element.FactorVenta : 0;
        this.CambioReferencial = (element.Estado != "I" || element.Estado == undefined) ? element.Factor : 0;
      })

      /**EL TIPO DE CAMBIO SE GUARDABA EN 
      this.contrato.ValorSeparacion = this.TipoDeCambio;
      */
      this.contrato.TipoCambio = this.TipoDeCambio;
      this.contrato.FechaModificacion = new Date(`${anio},${mes},${dia}`);
      this.contrato.FechaModificacion.setMonth(this.contrato.FechaModificacion.getMonth() + 1);
      this.contrato.FechaEmision = await new Date();
      this.contrato.FechaEmision.setHours(this.contrato.FechaEmision.getHours() - 5);
      this.puedeEditar = false;
      this.contrato.Observacion =".";  

      const dtoInter = new DtoInteres();
      dtoInter.IdContrato = this.contrato.IdContrato;
      dtoInter.Estado = 1;
      await this.ListarInteres(dtoInter);
      await this.calculo();
    }
    this.bloquearPag = false;
  }

  async cuentaBancaria() {
    const isCuentaBancaria: boolean = await this.cargarcuentaBancaria(this.lstLetra[0].CompaniaCodigo);
    if (!isCuentaBancaria) {
      this.message('error', 'Error', 'Error al cargar.');
    }
  }

  async ListarInteres(dtoInter: DtoInteres ) {
    this.lstInteresCal = await this.interesService.ListarInteres(dtoInter);
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
      console.log("listarmaestroTipoCambio ::", respTipoCambios);
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


  async SeleccioneSerie(event) {
    if (event.value != null) {
      let dato = this.lstTipoComprobante.filter((x) => x.value == event.value);
      console.log("SeleccioneSerie", this.lstLetra[0]);
      const isSerie: boolean = await this.cargarSerie(this.lstLetra[0].CompaniaCodigo);
    } else {
      this.lstSerie = [];
      this.lstSerie.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    }

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
    this.contrato.DiasGracia = 0;
    this.contrato.ComisionTotal = 0;
    let tazaInteres = (this.contrato.TasaInteres / 100);

    this.lstLetra.forEach(e => {
      this.contrato.ValorLetra += e.MontoTotal;
      if (e.Nombre.includes('INICIAL') || e.Nombre.includes('INCIAL')) {
        return;
      } else {
        fechaAtrasada = new Date(e.FechaVencimiento);
        fechaHoy.setHours(0, 0, 0, 0);
        fechaAtrasada.setHours(0, 0, 0, 0);
        let interes = tazaInteres * e.MontoTotal;

        diferencia_mm = fechaHoy.getTime() - fechaAtrasada.getTime();
        e.diasAtrasados = Math.round(diferencia_mm / 1000 / 60 / 60 / 24);
        let interesPrimario = e.diasAtrasados * tazaInteres;
        console.log("TAZA INTERES", interesPrimario);
        e.Interes = e.diasAtrasados * interes;
        console.log("PRIMER CALCULO INTERES", e.Interes);
        console.log("calculo JORDAN");
        if(e.TipoDocumento == "R"){
              this.contrato.TipoComprobante = "FA";
          }else{
              this.contrato.TipoComprobante = "BV";
          }
        this.cargarSerie(this.lstLetra[0].CompaniaCodigo);  
        this.puedeEditarTipoComprobante = true;
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
        this.contrato.DiasGracia += e.diasAtrasados;
      }
    });
    this.contrato.ComisionTotal = this.contrato.ComisionTotal.toFixed(2)
    this.contrato.MontoCambioReferencial = Math.round(this.contrato.ValorLetra *  this.CambioReferencial);
    console.log("DÏAs", this.lstLetra);
  }

  async calculoVer() {
    let fechaHoy: Date = await this.contrato.FechaEmision;
    let fechaAtrasada: Date;
    let diferencia_mm: number;
    this.contrato.DiasGracia = 0;
    this.contrato.ComisionTotal = 0;
    let tazaInteres = (this.contrato.TasaInteres / 100);
    this.lstLetra.forEach(e => {
      if (e.Nombre.includes('INICIAL') || e.Nombre.includes('INCIAL')) {
        return;
      } else {
        fechaAtrasada = new Date(e.FechaVencimiento);
        fechaHoy.setHours(0, 0, 0, 0);
        fechaAtrasada.setHours(0, 0, 0, 0);
        let interes = tazaInteres * e.MontoTotal;
        diferencia_mm = fechaHoy.getTime() - fechaAtrasada.getTime();
        e.diasAtrasados = Math.round(diferencia_mm / 1000 / 60 / 60 / 24);
        e.diasAtrasados = e.diasAtrasados;
        let interesPrimario = e.diasAtrasados * tazaInteres;
        console.log("TAZA INTERES", interesPrimario);
        e.Interes = e.diasAtrasados * interes;
        if (e.diasAtrasados <= 0) {
          e.diasAtrasados = 0;
          e.Interes = 0;
        }
        if (e.Interes <= 0) {
          e.Interes = 0;
        }
        e.Interes = Math.round(e.Interes);
        this.contrato.ComisionTotal += Math.round(e.Interes);
        this.contrato.DiasGracia += e.diasAtrasados;
      }
    });
    this.contrato.ComisionTotal = this.contrato.ComisionTotal.toFixed(2);
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
      this.contrato.CuentaBancaria = null;
      this.contrato.CampoReferencia = null;
      this.disabledBanco = true;
    }
  }


  async corepagar() {

    if (this.lstInteresCal.length>0  ) { this.messageShow('warn', 'Advertencia', 'Debe cancelar el(os) Interes(es) pendiente(s) antes de pagar'); return; }
 
    if (this.estaVacio(this.contrato.TipoComprobante)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de comprobante válido'); return; }
    if (this.estaVacio(this.contrato.SerieComprobante)) { this.messageShow('warn', 'Advertencia', 'Seleccione una serie válida'); return; }
    if (this.estaVacio(this.contrato.MonedaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione una moneda válida'); return; }
    if (this.estaVacio(this.contrato.FormaPago)) { this.messageShow('warn', 'Advertencia', 'Seleccione una forma de pago válida'); return; }
    if (this.estaVacio(this.contrato.Observacion)) { this.messageShow('warn', 'Advertencia', 'Ingrese una observación'); return; }

    try {
      var hoy = new Date();
      var dia = hoy.getDate();
      var mes = hoy.getMonth() + 1;
      var anio = hoy.getFullYear();

      //asignar variables personalizadas
      this.contrato.FechaCreacion = await new Date(`${anio},${mes},${dia}`);
       this.bloquearPag = true;
      //TODO: Contrato(VENDIDO
      this.contrato.Estado = 3;
      const contratoEnv: DtoClassContrato = new DtoClassContrato();
      contratoEnv.Contrato = this.contrato;
      let data = await this.calculoProgreso();
      if (data < 100) {
        contratoEnv.Contrato.Estado = 1;
      } else if (data >= 100) {
        contratoEnv.Contrato.Estado = 3;
      }

      const ComprobanteEnv: DtoClassComprobante = new DtoClassComprobante();
      ComprobanteEnv.Comprobante = this.contrato;
      ComprobanteEnv.Comprobante.FechaEmision = await new Date(`${anio},${mes},${dia}`);
      ComprobanteEnv.Comprobante.MontoAfecto = this.contrato.ValorLetra;
      ComprobanteEnv.Comprobante.MontoImpuestoVentas = 0;
      ComprobanteEnv.Comprobante.ValorImpuesto = 0;
      ComprobanteEnv.Comprobante.MontoTotal = this.contrato.ValorLetra;
      ComprobanteEnv.Comprobante.PeriodoEmision = this.PeriodoEmision;
      ComprobanteEnv.Comprobante.FormaPago = this.contrato.FormaPago;
      this.lstLetra.forEach(e => {
        e.Observacion = this.contrato.Observacion;
      });
      ComprobanteEnv.Detalle = this.lstLetra;
      console.log("ComprobanteEnv", ComprobanteEnv);
      console.log("this.contrato.FormaPago;", this.contrato.FormaPago);

     const Facturacion = await this.controlService.MantenimientoFacturacion(1, ComprobanteEnv, this.getUsuarioToken());
      console.log("Facturacion", Facturacion);
      if (Facturacion.success) {

        this.contrato.NumeroComprobante = Facturacion.data.Comprobante.NumeroComprobante;
        this.mensajeController.resultado = Facturacion;
        this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        this.message('success', 'Success', 'Pago Exitoso. N° DOCUMENTO = ' + this.contrato.NumeroComprobante);
        this.bloquearPag = false;
        this.dialog = false;
        const contrato = await this.contratoService.MantenimientoContrato(3, contratoEnv, this.getUsuarioToken());
        console.log(contrato);

        // //TODO: LETRA(FACTURADO)
        let contLetras: number = 0;
        if (contrato.success) {
          for (let i = 0; i < this.lstLetra.length; i++) {
            this.lstLetra[i].Estado = 2;
            this.lstLetra[i].DesEstado = "FACTURADO";
            this.lstLetra[i].IdComprobante = Facturacion.valor;
            this.lstLetra[i].FormaPago = this.contrato.FormaPago;
            this.lstLetra[i].FechaPago = new Date();
            console.log(" this.lstLetra[i]", this.lstLetra[i]);

            const letra: any = await this.controlService.MantenimientoLetra(2, this.lstLetra[i], this.getUsuarioToken());
            if (letra.success) {
              contLetras += 1;
            } else {
              this.message('error', 'Error', 'Error al pagar.');
              this.bloquearPag = false;
              return;
            }
          };

          let dto = {
            IdComprobante: Facturacion.data.Comprobante.IdComprobante,
            NumeroComprobante:     this.contrato.NumeroComprobante
          }
  
          const WSFacturador = await this.controlService.MantenimientoFacturador(1, dto, this.getUsuarioToken());
          console.log("Envio WSFacturador", WSFacturador);

          if (this.lstLetra.length == contLetras) {
            const filtroLote: FiltroLote = new FiltroLote();
            filtroLote.IdLote = this.contrato.IdLote;
            const loteEnv: DtoLote = await this.loteService.listarLote(filtroLote);
            const lote = await this.loteService.mantenimientoLote(3, loteEnv[0], this.getUsuarioToken());
            if (lote.success) {
              if (this.contrato.ComisionTotal > 0) {
                const interesEnv: DtoInteres = new DtoInteres();
                interesEnv.CompaniaCodigo = this.contrato.CompaniaCodigo;
                interesEnv.DescripcionCorta = this.contrato.DescripcionCorta;
                interesEnv.IdSede = this.contrato.IdSede;
                interesEnv.SedDescripcion = this.contrato.SedDescripcion;
                interesEnv.NomProyecto = this.contrato.NomProyecto;
                interesEnv.NomManzana = this.contrato.NomManzana;
                interesEnv.DesCondicion = this.contrato.DesCondicion;
                interesEnv.DesSituacion = this.contrato.DesSituacion;
                interesEnv.IdLote = this.contrato.IdLote;
                interesEnv.Situacion = this.contrato.Situacion;
                interesEnv.IdReserva = this.contrato.IdReserva;
                interesEnv.IdVendedor = this.contrato.IdVendedor;
                interesEnv.IdProyecto = this.contrato.IdProyecto;
                interesEnv.IdManzana = this.contrato.IdManzana;
                interesEnv.TipoDocumento = this.contrato.TipoDocumento;
                interesEnv.Documento = this.contrato.Documento;
                interesEnv.Cliente = this.contrato.Cliente;
                interesEnv.Conyuge = this.contrato.Conyuge;
                interesEnv.IdVendedor = this.contrato.IdVendedor;
                interesEnv.DocVendedor = this.contrato.DocumentoVen;
                interesEnv.Vendedor = this.contrato.Vendedor;
                interesEnv.DesUbicacion = this.contrato.DesUbicacion;
                interesEnv.FormaPago = this.contrato.FormaPago;
                interesEnv.Banco = this.contrato.Banco;
                interesEnv.IdContrato = this.contrato.IdContrato;
                interesEnv.IdCliente = this.contrato.IdCliente;
                interesEnv.Codigo = this.contrato.Codigo;
                // SE ENVIA EN NOMBRE LOS ID DE CADA LETRA DE MANERA CONCATENADA
                interesEnv.FechaVencimiento = await new Date(`${anio},${mes},${dia}`);;
                interesEnv.MonedaCodigo = this.contrato.MonedaCodigo;
                interesEnv.DiasMora = this.contrato.DiasGracia;
                interesEnv.Descuento = 0;
                interesEnv.TotalMora = this.contrato.ComisionTotal;
                interesEnv.MontoPago = this.contrato.ComisionTotal;
                interesEnv.Estado = 1;
                interesEnv.UsuarioCreacion = this.contrato.UsuarioCreacion;
                interesEnv.UsuarioModificacion = this.contrato.UsuarioModificacion;
                interesEnv.FechaCreacion = this.contrato.FechaCreacion;
                interesEnv.FechaModificacion = this.contrato.FechaModificacion;
                interesEnv.FechaVencimiento = new Date(); //fecha de vencimiento
                interesEnv.FechaVencimiento.setHours(interesEnv.FechaVencimiento.getHours() - 5);

                interesEnv.IpCreacion = this.contrato.IpCreacion;
                interesEnv.IpModificacion = this.contrato.IpModificacion;

                console.log("CUANDO SE PAGAAAAAlstLetra", this.lstLetra);
                interesEnv.Nombre = '';
                interesEnv.Observacion = '';
                for (let e = 0; e < this.lstLetra.length; e++) {
                  if (this.lstLetra[e].diasAtrasados > 0) {
                    interesEnv.Nombre = interesEnv.Nombre + this.lstLetra[e].IdLetra + ',';
                    interesEnv.Observacion = interesEnv.Observacion + this.lstLetra[e].Nombre + ',';
                  }
                }
                const interes = await this.interesService.MantenimientoInteres(1, interesEnv, this.getUsuarioToken());
                if (interes.success) {
                  this.message('success', 'Success', 'Pago Exitoso.');
                  this.mensajeController.resultado = contrato;
                  this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                  this.bloquearPag = false;
                  this.dialog = false;
                } else {
                  this.message('error', 'Error', 'Error al pagar.');
                  this.bloquearPag = false;
                  return;
                }
              } else {
                if (lote.success) {
                  this.message('success', 'Success', 'Pago Exitoso.');
                  this.contrato = null;
                  this.mensajeController.resultado = contrato;
                  this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                  this.bloquearPag = false;
                  this.dialog = false;
                  this.mensajeController.resultado = this.mensajeController;
                  this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                } else {
                  this.message('error', 'Error', 'Error al pagar.');
                  this.bloquearPag = false;
                  return;
                }
              }
            } else {
              this.message('error', 'Error', 'Error al pagar.');
              this.bloquearPag = false;

              this.mensajeController.resultado = this.mensajeController;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
              return;
            }
          } else {
            this.message('error', 'Error', 'Error al pagar.');
            this.bloquearPag = false;
            return;
          }
        } else {
          this.message('error', 'Error', 'Error al pagar.');
          this.bloquearPag = false;
          return;
        }
      } else {
        this.message('error', 'Error', 'Error al pagar.');
        this.bloquearPag = false;
        return;
      } 
      this.contrato = undefined;
      this.bloquearPag = false;
      this.dialog = false;

      // //TODO: Lote(Vendido) 

    } catch (e) {
      this.message('error', 'Error', 'Error Interno.');
      console.log(e)
    }
  }

  async calculoProgreso(): Promise<number> {

    this.FiltroLetra.IdContrato = this.contrato.IdContrato;
    let data: any[] = await this.controlService.ListarLetra(this.FiltroLetra);
    var countLetrasPagadas = await 0;

    data.forEach(e => {
      if (e.Estado == 2) {
        countLetrasPagadas++;
      }
    });
    let nuevoPorcentaje = 0;
    console.log(`LETRAS PAGADAS DE CONTRATO ${this.contrato.IdContrato}`, countLetrasPagadas);
    let porcentaje = (countLetrasPagadas * 100);
    this.contrato.progreso = Math.round(porcentaje / data.length);
    let porcentajePorPagar = (this.lstLetra.length * 100);
    let progresoPorpagar = Math.round(porcentajePorPagar / data.length);
    nuevoPorcentaje = this.contrato.progreso + progresoPorpagar;
    if (nuevoPorcentaje == 100) {
      this.contrato.progreso = 100;
    } else {
      this.contrato.progreso = nuevoPorcentaje;
    }

    return this.contrato.progreso;
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

}
