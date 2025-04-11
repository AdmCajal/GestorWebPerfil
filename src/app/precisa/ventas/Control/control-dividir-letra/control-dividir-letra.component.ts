import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { DtoContrato } from '../../Contrato/model/DtoContrato';
import { DtoLetra } from '../model/dtoLetra';
import { ControlService } from '../service/control.service';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ngx-control-dividir-letra',
  templateUrl: './control-dividir-letra.component.html',
  styleUrls: ['./control-dividir-letra.component.scss']
})
export class ControlDividirLetraComponent extends ComponenteBasePrincipal implements OnInit {
  @Output() onClose: EventEmitter<boolean> = new EventEmitter();
  bloquearPag: boolean;
  validarform: string = null;
  PeriodoEmision: string = null;
  acciones: string = "";
  usuario: string;
  position: string = "top";
  puedeEditar: boolean = false;
  puedeEditarTipoComprobante: boolean = false;
  dialog = false;
  fechaInicial: Date;
  montoInicial: number = 0.0;
  montoParcial: number = 0.0;
  lstSeleccionadomultiple: any[] = [];
  lstmsj: any[] = [];
  lstLetraY: DtoLetra[] = [];

  constructor(private datePipe: DatePipe,
    private controlService: ControlService,
    private messageService: MessageService
    ) {    super(); }

  ngOnInit(): void {

  }

  async coreIniciarComponente(msj: MensajeController, accion: string, _contrato?: DtoContrato, _Letras?: DtoLetra[]) {
    this.dialog = true;
    console.log("Letra coreIniciarComponente _Letras ", _Letras);
    console.log("Cuota coreIniciarComponente MensajeController ", msj);  
    this.lstmsj = msj.componenteDestino.lstLetra;
    this.lstSeleccionadomultiple = [];
    this.lstLetraY = [];  
    this.lstSeleccionadomultiple = _Letras;
  
    _Letras.forEach((element) => {
      this.montoInicial = element.MontoTotal;
  
      // Crear una copia original del elemento
      const copiaOriginal = {
        ...element,
        num: 1,
        IdLetra: 0,
        Nombre: element.Nombre + " - I"
      };
  
      // Calcular la nueva fecha de vencimiento
      const fechaActual = new Date(element.FechaVencimiento);
      const nuevaFechaVencimiento = new Date(fechaActual);
  
      // Crear una copia editable con los cambios
      const copiaEditable = {
        ...element,
        num: 2,
        MontoTotal: 0,
        IdLetra: 0,
        Nombre: element.Nombre + " - F",
        FechaVencimiento: nuevaFechaVencimiento
      };
  
      // Agregar ambas copias a la lista
      this.lstLetraY.push(copiaOriginal);
      this.lstLetraY.push(copiaEditable);
    });
  
    // Forzar que Angular detecte los cambios
    this.lstLetraY = [...this.lstLetraY];
  
    console.log("Letra coreIniciarComponente this.lstLetraY", this.lstLetraY);
  }

  actualizarMonto(row: DtoLetra) {
    // Busca el registro duplicado relacionado
    const index = this.lstLetraY.indexOf(row);
    if (index !== -1 && index % 2 === 0) {
      const registroDiferencia = this.lstLetraY[index + 1];
      // Calcula la diferencia y actualiza el registro duplicado
      registroDiferencia.MontoTotal = this.montoInicial - row.MontoTotal;

      this.montoParcial =  registroDiferencia.MontoTotal;
    }
  }


  async coreFraccionar() {
    this.bloquearPag = true;
    console.log("coreFraccionar lstLetraY : ", this.lstLetraY);
    console.log("coreFraccionar lstSeleccionadomultiple : ", this.lstSeleccionadomultiple);

    this.montoParcial
    if (this.estaVacio(this.montoParcial)) { this.message('warn', 'Advertencia', 'Ingrese un monto'); return; }
    if (this.montoParcial < 1 ) { this.message('warn', 'Advertencia', 'Ingrese un monto correcto'); return; }
    this.lstSeleccionadomultiple[0].Estado = 3;
    const letra: any = await this.controlService.MantenimientoLetra(3, this.lstSeleccionadomultiple[0], this.getUsuarioToken());
        if (letra.success) {
              const letraCop: any = await this.controlService.MantenimientoDividirLetra(4, this.lstLetraY, this.getUsuarioToken());
              if (letraCop.success) {  
                this.dialog = false;
                this.message('success', 'Success', 'Exitoso.');
                this.onClose.emit(true); // Notificar al padre que fue exitoso
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
        this.bloquearPag = false;
        this.dialog = false;
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
