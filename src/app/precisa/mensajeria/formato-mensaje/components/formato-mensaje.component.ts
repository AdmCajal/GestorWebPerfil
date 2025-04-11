import { Component, OnInit } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { MensajeController } from '../../../../../util/MensajeController';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { MensajeServices } from '../services/mensaje.services';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { Filtromensaje } from '../model/Filtromensaje';
import { Dtomensaje } from '../model/Dtomensaje';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';

@Component({
  selector: 'ngx-formato-mensaje',
  templateUrl: './formato-mensaje.component.html',
  styleUrls: ['./formato-mensaje.component.scss']
})
export class FormatoMensajeComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  position: boolean;
  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = "";
  filtro: Filtromensaje = new Filtromensaje();
  filtrocompa: FiltroCompaniamast = new FiltroCompaniamast();
  dto: Dtomensaje = new Dtomensaje();
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  TipoDeCambio: number;
  accionDetalle: string = '';
  html: '';

  rbTipo: string = '';
  lstEstados: SelectItem[];
  lstCompania: SelectItem[] = [];

  constructor(
    private exportarService: ExportarService,
    private confirmationService: ConfirmationService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private messageService: MessageService,
    private MensajeServices: MensajeServices

  ) { super(); }

  async coreIniciarComponente(msj: MensajeController, accion: string, rowdata?: any) {

    console.log("coreIniciarComponente ", msj);
    console.log("coreIniciarComponente accion", accion);
    //variables de entorno
    this.mensajeController = msj;
    this.acciones = accion;
    this.dialog = true;
    this.cargarEstado();
    this.cargarCombocompania();

    //auditoria
    this.fechaModificacion = undefined;
    this.bloquearPag = true;
    this.puedeEditar = false;
    // let filtroegresoDetalle: DtoEgreso = new DtoEgreso();
    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
        this.bloquearPag = false;
        this.puedeEditar = false;
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        console.log("DTO EDITAR", rowdata);
        this.filtro.IdMensaje = rowdata.IdMensaje;
        this.bloquearPag = true;
        this.MensajeServices.ListarMensaje(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.puedeEditar = false;
          console.log("EDITAR REST :", res);
          this.dto = res[0];
          this.rbTipo = this.dto.TipoMensaje == 1 ? 'sms' : this.dto.TipoMensaje == 2 ? 'correo' : null;
          if (res[0].FechaModificacion == null || res[0].FechaModificacion == undefined) {
            this.fechaModificacion == undefined;
          } else {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }
          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
          console.log("EDITAR puedeEditar :", this.puedeEditar);

        });

        break;
      case ConstanteUI.ACCION_SOLICITADA_VER:
        console.log("DTO VER", rowdata);
        this.filtro.IdMensaje = rowdata.IdMensaje;
        this.bloquearPag = true;
        this.MensajeServices.ListarMensaje(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.puedeEditar = true;

          console.log("VER REST :", res);
          this.dto = res[0];

          if (res[0].FechaModificacion == null || res[0].FechaModificacion == undefined) {
            this.fechaModificacion == undefined;
          } else {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }

          if (res[0].FechaModificacion != null || res[0].FechaModificacion != undefined) {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }
          // this.fechaModificacion = new Date(res[0].FechaModificacion);
          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

        });

        break;
    }
    this.bloquearPag = false;
  }

  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }

  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }

  coreGuardar(): void {
    console.log("coreGuardar", this.dto);
    console.log("validarform", this.validarform);

    if (this.acciones == ConstanteUI.ACCION_SOLICITADA_NUEVO) {
      this.bloquearPag = true;
      this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
      this.dto.IpCreacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
      if (this.rbTipo != null || this.rbTipo != undefined || this.rbTipo != '') {
        this.dto.TipoMensaje = this.rbTipo == 'correo' ? 2 : this.rbTipo == 'sms' ? 1 : null;
      }



      this.MensajeServices.MantenimientoMensaje(1, this.dto, this.getUsuarioToken()).then(
        res => {
          this.dialog = false;
          this.bloquearPag = false;
          console.log("registrado:", res);
          if (res != null) {
            if (res.mensaje == "Created") {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Se registró con éxito.' });
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            } else {
              this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
            }
          }
        });

    } else if (this.acciones == ConstanteUI.ACCION_SOLICITADA_EDITAR) {
      this.dto.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario.trim();
      this.dto.FechaModificacion = this.fechaModificacion;
      this.bloquearPag = true;
      this.MensajeServices.MantenimientoMensaje(2, this.dto, this.getUsuarioToken()).then(
        res => {
          this.dialog = false;
          this.bloquearPag = false;
          if (res != null) {
            console.log("registrado:", res);
            if (res.mensaje == "Ok") {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Se actualizó con éxito.' });
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            } else {
              this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
            }
          }

        });
    }
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
  }

  btnCerrar(): void {
    this.rbTipo = null;
    this.lstEstados = null;
  }

  cargarEstado(): void {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo })
    });
    console.log("VER cargarEstado :", this.lstEstados);
  }
  
  cargarCombocompania(): Promise<number> {
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.filtrocompa.estado = "A";
    return this.maestrocompaniaMastService.listarCompaniaMast(this.filtrocompa).then(res => {
      console.log("company", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
      });
      return 1;
    });
  }

}
