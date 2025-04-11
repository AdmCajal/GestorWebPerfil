import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { ManzanaService } from '../../../proyecto/Manzana/service/manzana.service';
import { ProgramaService } from '../../../proyecto/Programa/service/programa.service';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { DtoContrato } from '../../../ventas/Contrato/model/DtoContrato';
import { DtoLetra } from '../../../ventas/Control/model/dtoLetra';
import { FiltroControl } from '../../../ventas/Control/model/filtroControl';
import { ControlService } from '../../../ventas/Control/service/control.service';

@Component({
  selector: 'ngx-requerimiento-detalle',
  templateUrl: './requerimiento-detalle.component.html',
  styleUrls: ['./requerimiento-detalle.component.scss']
})
export class RequerimientoDetalleComponent  extends ComponenteBasePrincipal implements OnInit {

  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = "";
  position: string = "top";
  puedeEditar: boolean = false;
  lstMoneda: SelectItem[] = [];
  lstLetra: DtoLetra[] = [];
  lstSeleccionadomultiple: any[] = [];
  lstTotal: any[] = [];

  dto: DtoContrato = new DtoContrato();
  FiltroLetra: FiltroControl = new FiltroControl();
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  constructor(
    private manzanaService: ManzanaService,
    private programaService: ProgramaService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private confirmationService: ConfirmationService,
    private ControlService: ControlService,
    private messageService: MessageService,
  ) {
    super();
  }
  coreNuevo(): void {
    throw new Error("Method not implemented.");
  }
  coreBuscar(): void {
    throw new Error("Method not implemented.");
  }
  coreGuardar(): void {
    throw new Error("Method not implemented.");
  }
  async coreMensaje(mensage: MensajeController) {
    console.log("coreMensaje llegando:", mensage.componente);
    if (mensage.componente == "SELECTOR_PAGAR") {
      this.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_CONTRATO', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, this.dto);

    }
  }
  coreExportar(tipo: string): void {
    throw new Error("Method not implemented.");
  }
  coreSalir(): void {
    throw new Error("Method not implemented.");
  }

  ngOnInit(): void {

    throw new Error('Method not implemented.');
  }

  async iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: DtoContrato) {
    // this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.bloquearPag = true;

    this.dto = rowdata
    if (this.validarform == "VER") {
      this.dto = rowdata;
      this.puedeEditar = false;
      this.dto.MonedaCodigo = rowdata.MonedaCodigo.trim();
      this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
      this.fechaCreacion = new Date(this.dto.FechaCreacion);
      if (this.dto.FechaModificacion != null) {
        this.fechaModificacion = new Date(this.dto.FechaModificacion);
      }
      this.FiltroLetra.IdContrato = this.dto.IdContrato;
      console.log("Lote coreBuscar:", this.FiltroLetra);
      var vTotal = 0;
      var vAbonado = 0;
      var vFaltante = 0;
      this.bloquearPag = true;
      const data: any[] = await this.ControlService.ListarLetra(this.FiltroLetra);
      console.log("ListarLetra listado:", data);
      this.lstLetra = data;
      this.bloquearPag = false;

      var contado = 0;
      this.lstLetra.forEach((element) => {
        element.num = contado++;
        vTotal += element.MontoTotal;
        if (element.Estado == 1) {
          vFaltante += element.MontoTotal;
        }
        if (element.Estado == 2) {
          vAbonado += element.MontoTotal;
        }
      });

      console.log("variable 1° vFaltante:", vFaltante);
      console.log("variable vTotal:", vTotal);
      console.log("variable vFaltante:", vFaltante);
      console.log("variable vAbonado:", vAbonado);

      this.lstTotal = await [
        {
          num: 1,
          Total: vTotal,
          Abonado: vAbonado,
          Faltante: vFaltante
        }
      ];
      console.log("   this.lstTotal", this.lstTotal);
    
    }
  }

  async verLetra(letra: DtoLetra) {

    if (letra.Estado == 1) {
      this.message('warn', 'Advertencia', 'Seleccione solo letras FACTURADAS.');
      return;
    }
  }

  async corePagar() {



    // if (this.lstLetra[0].DesEstado != 'FACTURADO' && this.lstSeleccionadomultiple[0].Nombre != 'CUOTA INCIAL') {
    //   this.message('warn', 'Advertencia', 'Debe primero pagar la cuota inicial.');
    //   return;
    // }else if (this.lstLetra[0].DesEstado != 'FACTURADO' && this.lstSeleccionadomultiple[0].Nombre == 'CUOTA INCIAL') {
    //   console.log("Todo tranquilo, sigue wacho")
    // }

    if (this.lstSeleccionadomultiple.length == 0) {
      this.message('warn', 'Advertencia', 'Debe elegir al menos una letra.');
      return;
    }
    for (let step = 0; step < this.lstSeleccionadomultiple.length; step++) {
      if (this.lstSeleccionadomultiple[step].Estado > 1) {
        this.message('warn', 'Advertencia', 'Seleccione solo letras PENDIENTES.');
        return;
      }
    }


    if (this.lstSeleccionadomultiple[0].FechaVencimiento) {
      this.lstSeleccionadomultiple = await [];
    }
  }

  coreLimpiar() {
    this.lstSeleccionadomultiple = [];
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
