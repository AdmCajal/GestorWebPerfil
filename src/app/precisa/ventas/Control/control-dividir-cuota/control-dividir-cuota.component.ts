import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { DtoClassContratoDellate } from '../../Contrato/model/DtoClassContratoDellate';
import { DtoContrato } from '../../Contrato/model/DtoContrato';
import { DtoLetra } from '../model/dtoLetra';
import { ControlService } from '../service/control.service';
import { EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'ngx-control-dividir-cuota',
  templateUrl: './control-dividir-cuota.component.html',
  styleUrls: ['./control-dividir-cuota.component.scss']
})

export class ControlDividirCuotaComponent extends ComponenteBasePrincipal implements OnInit {
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
  fechaUltima: Date;
  fechaPrimera: Date;
  IdCliente: number;
  IdContrato: number;

  montoTotal: number = 0.0;
  lstLetraX: DtoLetra[] = [];
  lstSeleccionadomultiple: any[] = [];
  lstmsjLetra: DtoLetra[] = [];
  dto: DtoContrato = new DtoContrato();
  lstdetContrato: DtoClassContratoDellate[] = [];

  lstmsj: any[] = [];

  constructor(private datePipe: DatePipe,
    private controlService: ControlService,
    private messageService: MessageService
    ) {    super(); }

  ngOnInit(): void {
  }

  async coreIniciarComponente(msj: MensajeController, accion: string, _contrato?: DtoContrato, _Letras?: DtoLetra[]) {
    this.dialog = true;
    console.log("Cuota coreIniciarComponente DtoContrato ", _contrato);
    console.log("Cuota coreIniciarComponente MensajeController", msj);
    this.lstmsj = [];
    this.lstmsj = msj.componenteDestino.lstLetra;
    this.lstSeleccionadomultiple = [];
    this.lstLetraX = [];
    this.lstLetraX = _Letras;
    this.lstLetraX.forEach((element) => {
      this.fechaInicial = new Date(element.FechaVencimiento);
      this.montoTotal   = element.MontoTotal;
      this.IdCliente    = element.IdCliente;
      this.IdContrato   = element.IdContrato;
    });

    this.lstmsj.forEach((element) => {
      if (element.Cuota == 1) {
        this.fechaPrimera = new Date(element.FechaVencimiento);
        console.log("coreIniciarComponente fechaPrimera ", this.fechaPrimera);
      }
    });
  }

  nuevoDetalle() {
    const totalRegistros = this.lstLetraX.length + 1; // Número total de registros
    const montoPorRegistro = parseFloat((this.montoTotal / totalRegistros).toFixed(2)); // Calcula el monto dividido
    this.lstLetraX = []; // Reinicia la lista de letras

    for (let i = 0; i < totalRegistros; i++) {
      const fechaVencimiento = new Date(this.fechaInicial); // Clona la fecha inicial
      fechaVencimiento.setMonth(this.fechaInicial.getMonth() + i); // Incrementa el mes progresivamente

      // Ejemplo: monto inicial
      var dtoLetra = new DtoLetra();
      // Generar un nuevo registro con datos iniciales. 
      dtoLetra.num = totalRegistros + 1;
      dtoLetra.FechaVencimiento = fechaVencimiento; // Fecha actual o lógica personalizada
      dtoLetra.Nombre = 'CUOTA INCIAL';
      dtoLetra.MontoTotal = parseFloat(montoPorRegistro.toFixed(2));
      dtoLetra.DesEstado = 'PENDIENTE'; // Estado por defecto 
      dtoLetra.codigocomponente = '110011';
      dtoLetra.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
      dtoLetra.IpCreacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
      dtoLetra.Estado = 1;
      dtoLetra.IdLetra = 0;
      dtoLetra.IdCliente  = this.IdCliente;
      dtoLetra.IdContrato = this.IdContrato;
      this.fechaUltima = fechaVencimiento;
      
      // Agregar nuevo registro a la lista
      this.lstLetraX.push(dtoLetra);
      // Actualizar los montos en todos los registros
      this.actualizarMontos();
    }
  }

  // Función para actualizar montos después de agregar un registro
  actualizarMontos() {
    const totalRegistros = this.lstLetraX.length;
    const nuevoMonto = this.lstLetraX.reduce((total, item) => total + item.MontoTotal, 0) / totalRegistros;
    this.lstLetraX = this.lstLetraX.map((registro, index) => ({
      ...registro,
      MontoTotal: parseFloat(nuevoMonto.toFixed(2)), // Conversión a número
      num: index + 1
    }));
  }

  async coreFraccionar() {
    this.bloquearPag = true;
    this.lstmsjLetra = [];
    console.log("coreFraccionar lstFraccionar: ", this.lstLetraX);

    let index = 0;  
    let fechaVencimiento = new Date(this.lstLetraX[this.lstLetraX.length - 1].FechaVencimiento);  
    console.log("this.fechaPrimera", this.datePipe.transform(fechaVencimiento, 'yyyy-MM-dd'));  
    this.lstmsj.forEach((element) => {      
      if (element.Cuota == 0) {
        this.lstmsjLetra.push(...this.lstLetraX);
      } else {
        const nuevaFecha = new Date(fechaVencimiento);
        nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);  
        const copiaEditable: DtoLetra = {
          ...element,
          FechaVencimiento: nuevaFecha, 
          FechaInicio: nuevaFecha,
        };
        this.lstmsjLetra.push(copiaEditable);  
        fechaVencimiento = nuevaFecha;
      }
      index++;
    });  

    this.lstSeleccionadomultiple= [];

    this.lstmsj.forEach((element) => {
        if (element.Cuota == 0) {
        element.UsuarioCreacion   = this.getUsuarioAuth().data[0].Usuario;
        element.IpCreacion    = this.getIp();  //crear metodo que nos muestre la IP del usuario
        element.Estado   = 3;
        this.lstSeleccionadomultiple.push(element);  
        }
    });

    console.log("coreFraccionar lstmsj : ", this.lstmsj); 
    console.log("coreFraccionar lstSeleccionadomultiple : ", this.lstSeleccionadomultiple);   
    console.log("coreFraccionar lstmsjLetra : ", this.lstmsjLetra);
 
 
    const letra: any = await this.controlService.MantenimientoLetra(3, this.lstSeleccionadomultiple[0], this.getUsuarioToken());
    if (letra.success) {
          const letraCop: any = await this.controlService.MantenimientoDividirLetra(4, this.lstmsjLetra, this.getUsuarioToken());
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
