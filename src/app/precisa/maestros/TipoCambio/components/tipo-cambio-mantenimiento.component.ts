import { Component, OnInit } from "@angular/core";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { DtoTipocambiomast } from '../dominio/dto/DtoTipocambiomast';
import { Filtrotipodecambio } from "../dominio/filtro/Filtrotipodecambio";
import { MaestrotipocambioService } from "../servicio/maestrotipocambio.service";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";


@Component({
  selector: 'ngx-tipo-cambio-mantenimiento',
  templateUrl: './tipo-cambio-mantenimiento.component.html'
})
export class TipoCambioMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  acciones: string = ''
  position: string = 'top'
  lstEstados: SelectItem[] = [];
  lstMoneda: SelectItem[] = [];
  bloquearPag: boolean;
  validarform: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  dto: DtoTipocambiomast = new DtoTipocambiomast();
  filtro: Filtrotipodecambio = new Filtrotipodecambio();
  maxDate: Date = new Date();
  minDate: Date = new Date();

  constructor(
    private messageService: MessageService,
    private maestrotipocambioService: MaestrotipocambioService,
  ) {
    super();

    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth();
    var anio = hoy.getFullYear();
    this.maxDate = new Date(`${anio},${mes},${dia}`);
  }

  ngOnDestroy() {
    this.maxDate = undefined;

  }

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();

  }
  coreNuevo(): void {
    throw new Error("Method not implemented.");
  }
  coreBuscar(): void {
    throw new Error("Method not implemented.");
  }
  async coreGuardar() {
    if (this.dto.MonedaCodigo == null || this.dto.MonedaCodigo == undefined) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de moneda'); return; }
    if (this.dto.FactorVenta == null || this.dto.FactorVenta == undefined) { this.messageShow('warn', 'Advertencia', 'Ingrese valor de venta'); return; }
    if (this.dto.FactorCompra == null || this.dto.FactorCompra == undefined) { this.messageShow('warn', 'Advertencia', 'Ingrese valor de compra'); return; }
    if (this.dto.Estado == null || this.dto.Estado == undefined) { this.messageShow('warn', 'Advertencia', 'Seleccione un estado'); return; }

    this.bloquearPag = true;
    switch (this.validarform) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        /**AUDITORIA*/
        this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Documento;
        this.dto.FechaCreacion = new Date();
        this.dto.UltimoUsuario =null;
        this.dto.UltimaFechaModif = null;
        console.log("coreGuardar this.dto:", this.dto);
        const respNuevo = await this.maestrotipocambioService.mantenimientoMaestro(ConstanteUI.SERVICIO_SOLICITUD_NUEVO, this.dto, this.getUsuarioToken());
        console.log("registrado:", respNuevo);
        if (respNuevo != null) {
          if (respNuevo.success) {
            this.messageShow('success', 'Success', this.getMensajeGuardado());
            this.mensajeController.resultado = respNuevo;
            this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            this.dialog = false;
          } else {
            this.messageShow('warn', 'Advertencia', this.getMensajeErrorGuardado());
          }
        } else {
          this.messageShow('warn', 'Advertencia', this.getMensajeErrorGuardado());
        }
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.dto.UltimoUsuario = this.getUsuarioAuth().data[0].Documento;
        this.dto.UltimaFechaModif = new Date();
        const respEditar = await this.maestrotipocambioService.mantenimientoMaestro(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.dto, this.getUsuarioToken());
        console.log("registrado:", respEditar);
        if (respEditar != null) {
          if (respEditar.success) {
            this.messageShow('success', 'Success', this.getMensajeGuardado());
            this.mensajeController.resultado = respEditar;
            this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            this.dialog = false;
          } else {
            this.messageShow('warn', 'Advertencia', this.getMensajeErrorGuardado());
          }
        } else {
          this.messageShow('warn', 'Advertencia', this.getMensajeErrorGuardado());
        }
        break;
    }
    this.bloquearPag = false;
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error("Method not implemented.");
  }
  coreExportar(tipo: string): void {
    throw new Error("Method not implemented.");
  }
  coreSalir(): void {
    throw new Error("Method not implemented.");
  }
  cargarEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.trim().toUpperCase(), value: i.Codigo.trim() });
    });
  }
  cargarMoneda() {
    this.lstMoneda = [];
    this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "MONEDA").forEach(i => {
      this.lstMoneda.push({ label: i.Nombre.trim().toUpperCase(), value: i.Codigo.trim() });
    });
  }

  formatearDecimales(value: number): string {
    console.log("EDITAR formatearDecimales :", value);
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR', // o la moneda que prefieras
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }


  async iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any) {

    /**PARAMETROS */
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;

    /**OBJETOS */
    this.dto = new DtoTipocambiomast();
    this.minDate.setDate(this.maxDate.getDate())
    /**AUDITORIA */
    this.fechaModificacion = undefined;
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

    /**METODOS DE COMBOS  */
    await this.cargarEstados();
    await this.cargarMoneda();

    /**ACCION DE FORMULARIO */
    this.bloquearPag = true;
    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.puedeEditar = false;
        /**ATRIBUTOS */
        this.dto.Estado = 'A';
        this.dto.MonedaCodigo = 'EX';
        this.dto.MonedaCambioCodigo = 'LO';
        this.dto.FechaCambio = new Date();

        //FECHAS
        this.fechaCreacion = new Date();
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.puedeEditar = false;
        console.log("EDITAR FILA :", rowdata);

        /**BUSQUEDA DE OBJETO */
        this.filtro.fechacambio = rowdata.FechaCambio;
        this.filtro.ultimafechamodif = rowdata.FechaCambio;

        const respEditar = await this.maestrotipocambioService.listarmaestroTipoCambio(this.filtro);
        this.dto = respEditar[0];
        //FECHAS
        this.dto.FechaCambio = new Date(this.dto.FechaCambio);

        //falta fecha de creación
        this.fechaCreacion = new Date(this.dto.FechaCreacion);
        if (this.dto.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(this.dto.UltimaFechaModif);
        }
        break;
      case ConstanteUI.ACCION_SOLICITADA_VER:
        this.puedeEditar = true;
        console.log("EDITAR FILA :", rowdata);

        /**BUSQUEDA DE OBJETO */
        this.filtro.fechacambio = rowdata.FechaCambio;
        this.filtro.ultimafechamodif = rowdata.FechaCambio;

        const respVer = await this.maestrotipocambioService.listarmaestroTipoCambio(this.filtro);
        this.dto = respVer[0];
        //FECHAS
        this.dto.FechaCambio = new Date(this.dto.FechaCambio);

        //falta fecha de creación
        this.fechaCreacion = new Date(this.dto.FechaCreacion);
        if (this.dto.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(this.dto.UltimaFechaModif);
        }
        break;
    }
    this.bloquearPag = false;
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

}
