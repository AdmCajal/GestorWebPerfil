import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { DtoBanco } from '../dominio/dto/DtoBanco';
import { FiltroBanco } from '../dominio/filtro/FiltroBanco';
import { MaestroBancoService } from '../servicio/maestro-banco.service';
import { MensajeController } from '../../../../../util/MensajeController';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';


@Component({
  selector: 'ngx-maestro-banco-mantenimiento',
  templateUrl: './maestro-banco-mantenimiento.component.html',
  styleUrls: ['./maestro-banco-mantenimiento.component.scss']
})
export class MaestroBancoMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  acciones: string = ''
  position: string = 'top'
  lstEstados: SelectItem[] = [];
  lstTablaMaestro: SelectItem[] = [];
  dto: DtoBanco = new DtoBanco();
  bloquearPag: boolean;
  validarform: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  filtro: FiltroBanco = new FiltroBanco();
  puedeEditarpk: boolean = true;
  constructor(
    private messageService: MessageService,
    private maestroBancoService: MaestroBancoService) {
    super();
  }
  ngOnInit(): void {
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
  cargarEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });
  }
  async iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any) {

    /**PARAMETROS */
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;

    /**OBJETOS */
    this.dto = new DtoBanco();

    /**AUDITORIA */
    this.fechaModificacion = undefined;
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

    /**METODOS DE COMBOS  */
    await this.cargarEstados();

    /**ACCION DE FORMULARIO */
    this.bloquearPag = true;
    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        //Estado
        this.dto.Estado = 'A';

        this.puedeEditar = false;
        //FECHAS
        this.fechaCreacion = new Date();
        this.fechaModificacion = undefined;
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.puedeEditar = false;
        console.log("ConstanteUI.ACCION_SOLICITADA_EDITAR", rowdata);
        /**BUSCAR OBJETO */
        this.filtro.banco = rowdata.Banco;
        const respBancoEditar = await this.maestroBancoService.listarmaestroBancos(this.filtro);

        this.dto = respBancoEditar[0];
        this.fechaCreacion = new Date(this.dto.FechaCreacion);
        if (this.dto.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(this.dto.UltimaFechaModif);
        }
        break;
      case ConstanteUI.ACCION_SOLICITADA_VER:
        this.puedeEditar = true;
        console.log("ConstanteUI.ACCION_SOLICITADA_EDITAR", rowdata);
        /**BUSCAR OBJETO */
        this.filtro.banco = rowdata.Banco;
        const respBancoVer = await this.maestroBancoService.listarmaestroBancos(this.filtro);
        this.dto = respBancoVer[0];
        this.fechaCreacion = new Date(this.dto.FechaCreacion);
        if (this.dto.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(this.dto.UltimaFechaModif);
        }
        break;
    }
    this.bloquearPag = false;

  }
  async coreGuardar() {

    if (this.dto.DescripcionCorta == null || this.dto.DescripcionCorta == undefined) { this.messageShow('warn', 'Advertencia', 'Ingrese un nombre'); return; }
    if (this.dto.DescripcionLarga == null || this.dto.DescripcionLarga == undefined) { this.messageShow('warn', 'Advertencia', 'Ingrese el nombre completo'); return; }
    if (this.dto.Estado == null || this.dto.Estado == undefined) { this.messageShow('warn', 'Advertencia', 'Seleccione un estado'); return; }

    this.bloquearPag = true;
    switch (this.validarform) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        /**AUDITORIA*/
        this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Documento;
        this.dto.FechaCreacion = new Date();
        this.dto.UltimaFechaModif = null;
        this.dto.IpCreacion = this.getIp();

        const respNuevo = await this.maestroBancoService.mantenimientoMaestro(ConstanteUI.SERVICIO_SOLICITUD_NUEVO, this.dto, this.getUsuarioToken());
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
        }
        else {
          this.messageShow('warn', 'Advertencia', this.getMensajeErrorGuardado());
        }
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        /**AUDITORIA*/
        this.dto.UltimoUsuario = this.getUsuarioAuth().data[0].Documento;
        this.dto.UltimaFechaModif = new Date();
        this.dto.IpModificacion = this.getIp();

        const respEditar = await this.maestroBancoService.mantenimientoMaestro(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.dto, this.getUsuarioToken());
        console.log("registrado:", respEditar);
        if (respEditar != null) {
          if (respEditar.success) {
            this.messageShow('success', 'Success', this.getMensajeActualizado());
            this.mensajeController.resultado = respEditar;
            this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            this.dialog = false;
          } else {
            this.messageShow('warn', 'Advertencia', this.getMensajeErrorActualizar());
          }
        }
        else {
          this.messageShow('warn', 'Advertencia', this.getMensajeErrorActualizar());
        }

        break;
    }
    this.bloquearPag = false;

  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }
}
