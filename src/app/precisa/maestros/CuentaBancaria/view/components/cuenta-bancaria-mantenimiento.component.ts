import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../../util/ComponenteBasePrincipa";
import { SelectItem, MessageService } from 'primeng/api';
import { DtoCuentaBancaria } from '../../model/DtoCuentaBancaria';
import { FiltroCuentaBancaria } from '../../model/FiltroCuentaBancaria';
import { FiltroCompaniamast } from '../../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MensajeController } from '../../../../../../util/MensajeController';
import { MaestrocompaniaMastService } from '../../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { CuentaBancariaService } from '../../service/cuentabancaria.service';
import { ConstanteAngular } from '../../../../../@theme/ConstanteAngular';
import { MaestroBancoService } from '../../../maestroBanco/servicio/maestro-banco.service';
import { FiltroBanco } from '../../../maestroBanco/dominio/filtro/FiltroBanco';
import Swal from "sweetalert2";
import { ConstanteUI } from "../../../../../../util/Constantes/Constantes";



@Component({
  selector: 'ngx-cuenta-bancaria-mantenimiento',
  templateUrl: './cuenta-bancaria-mantenimiento.component.html'
})
export class CuentaBancariaMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {

  acciones: string = ''
  position: string = 'top';
  lstEstados: SelectItem[] = [];
  bloquearPag: boolean;
  verMant: boolean = false;
  validarform: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  dto: DtoCuentaBancaria = new DtoCuentaBancaria();
  lstCompania: SelectItem[] = [];
  lstBancos: SelectItem[] = [];
  filtrocompa: FiltroCompaniamast = new FiltroCompaniamast();
  filtro: FiltroCuentaBancaria = new FiltroCuentaBancaria();
  filtrobanco: FiltroBanco = new FiltroBanco();
  lstMoneda: SelectItem[] = [];

  constructor(
    private messageService: MessageService,
    private cuentaBancariaService: CuentaBancariaService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private maestroBancoService: MaestroBancoService,
  ) {
    super();
  }



  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }




  async iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any) {

    /**PARAMETROS */
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;

    /**OBJETOS */
    this.dto = new DtoCuentaBancaria();

    /**AUDITORIA */
    this.fechaModificacion = undefined;
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

    /**METODOS DE COMBOS  */
    await this.cargarEstados();
    await this.cargarCombocompania();
    await this.cargarMoneda();
    await this.cargarComboBancos();

    /**ACCION DE FORMULARIO */
    this.bloquearPag = true;
    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.puedeEditar = false;

        this.dto.Estado = "A";
        this.dto.MonedaCodigo = "EX";

        this.fechaCreacion = new Date();
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.puedeEditar = false;
        console.log("EDITAR FILA :", rowdata);
        this.filtro.CuentaBancaria = rowdata.CuentaBancaria;

        const respEditar = await this.cuentaBancariaService.listarCuentaBancaria(this.filtro);

        this.dto = respEditar[0];
        this.dto.CompaniaCodigo = this.dto.CompaniaCodigo;
        this.dto.Descripcion = this.dto.Descripcion.trim();

        //falta fecha de creación
        this.fechaCreacion = new Date(this.dto.FechaCreacion);
        if (this.dto.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(this.dto.UltimaFechaModif);
        }
        break;
      case ConstanteUI.ACCION_SOLICITADA_VER:
        this.puedeEditar = true;
        console.log("EDITAR FILA :", rowdata);
        this.filtro.CuentaBancaria = rowdata.CuentaBancaria;

        const respVer = await this.cuentaBancariaService.listarCuentaBancaria(this.filtro);

        this.dto = respVer[0];
        this.dto.CompaniaCodigo = this.dto.CompaniaCodigo;
        this.dto.Descripcion = this.dto.Descripcion.trim();

        //falta fecha de creación
        this.fechaCreacion = new Date(this.dto.FechaCreacion);
        if (this.dto.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(this.dto.UltimaFechaModif);
        }
        break;
    }
    this.bloquearPag = false;
  }


  cargarEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.trim().toUpperCase(), value: i.Codigo.trim() });
    });
  }

  cargarCombocompania(): Promise<number> {
    this.lstCompania = [];
    this.lstCompania.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.filtrocompa.estado = "A";
    return this.maestrocompaniaMastService.listarCompaniaMast(this.filtrocompa).then(res => {
      console.log("company", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.CompaniaCodigo.trim() });
      });
      return 1;
    });
  }


  cargarComboBancos(): Promise<number> {
    this.lstBancos = [];
    this.lstBancos.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.filtrobanco.estado = "A";
    return this.maestroBancoService.listarmaestroBancos(this.filtrobanco).then(res => {
      console.log("bancos", res);
      res.forEach(ele => {
        this.lstBancos.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.Banco });
      });
      return 1;
    });
  }




  cargarMoneda() {
    this.lstMoneda = [];
    this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "MONEDA").forEach(i => {
      this.lstMoneda.push({ label: i.Nombre.trim().toUpperCase(), value: i.Codigo.trim() });
      console.log("LISTA MONEDA:", this.lstMoneda);
    });
  }


  esTelefesCeluValido(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /^[0-9]/;
    if (!regex.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }

  async coreGuardar() {

    if (this.estaVacio(this.dto.CompaniaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione una compañia válido'); return; }
    if (this.estaVacio(this.dto.Banco)) { this.messageShow('warn', 'Advertencia', 'Seleccione un banco válido'); return; }
    if (this.estaVacio(this.dto.Descripcion)) { this.messageShow('warn', 'Advertencia', 'Ingrese un número de cuenta válido'); return; }
    if (this.estaVacio(this.dto.MonedaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de moneda válido'); return; }
    if (this.estaVacio(this.dto.Estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione un estado válido'); return; }
    this.verMant = false;
    this.dto.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;

    this.bloquearPag = true;
    switch (this.validarform) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        /**AUDITORIA*/
        this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Documento;
        this.dto.FechaCreacion = new Date();
        this.dto.UltimaFechaModif = null;

        const respNuevo = await this.cuentaBancariaService.mantenimientoCuentaBancaria(ConstanteUI.SERVICIO_SOLICITUD_NUEVO, this.dto, this.getUsuarioToken());
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
      case  ConstanteUI.ACCION_SOLICITADA_EDITAR: 
      /**AUDITORIA*/
        this.dto.UltimoUsuario = this.getUsuarioAuth().data[0].Documento;
        this.dto.UltimaFechaModif = new Date();

        const respEditar = await this.cuentaBancariaService.mantenimientoCuentaBancaria(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.dto, this.getUsuarioToken());
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
    }
    this.bloquearPag = false;
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }
}


