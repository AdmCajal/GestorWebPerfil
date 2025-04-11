import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { DtoClassContratoDellate } from '../../Contrato/model/DtoClassContratoDellate';
import { DtoContrato } from '../../Contrato/model/DtoContrato';
import { ControlService } from '../../Control/service/control.service';
import { DtoInteres } from '../model/Dtointeres';
import { InteresService } from '../service/interes.service';

@Component({
  selector: 'ngx-interes-control',
  templateUrl: './interes-control.component.html'
})
export class InteresControlComponent extends ComponenteBasePrincipal implements OnInit {
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

  Observacion: string = "";
  Nombre: string = "";
  DiasMora: number = 0.0;
  montoTotal: number = 0.0;
  lstInteresX: DtoInteres[] = [];
  lstSeleccionadomultiple: any[] = [];
  lstmsj: any[] = [];
  lstmsjInteres: DtoInteres[] = [];

  dto: DtoContrato = new DtoContrato();

  constructor(private datePipe: DatePipe,
    private controlService: ControlService,
    private messageService: MessageService,
    private interesService: InteresService
    ) {    super(); }

    ngOnInit(): void {
    }


  async coreIniciarComponente(msj: MensajeController, accion: string, _contrato?: DtoContrato, _Interes?: DtoInteres[]) {
    this.dialog = true;
    console.log("Cuota coreIniciarComponente DtoContrato ", _contrato);
    console.log("Cuota coreIniciarComponente MensajeController", msj);
    console.log("Cuota coreIniciarComponente _Interes", _Interes);
    this.lstmsj = [];
    this.lstmsj = msj.componenteDestino.lstInteres;  
    this.lstSeleccionadomultiple = [];

    this.lstInteresX = [];
    this.lstInteresX = _Interes;

    this.lstmsjInteres = [];
    this.lstmsjInteres = _Interes;

    this.dto = new DtoContrato();
    this.dto = _contrato;    

    this.lstInteresX.forEach((element) => {
      this.fechaInicial = new Date(element.FechaVencimiento);
      this.montoTotal   = element.TotalMora;
      this.IdCliente    = element.IdCliente;
      this.IdContrato   = element.IdContrato;
      this.Observacion  = element.Observacion;
      this.Nombre       = element.Nombre;
      this.DiasMora     = element.DiasMora;      
    });

    this.lstmsj.forEach((element) => {
      if (element.Cuota == 1) {
        this.fechaPrimera = new Date(element.FechaVencimiento);
        console.log("coreIniciarComponente fechaPrimera ", this.fechaPrimera);
      }
    });
  }


  nuevoDetalle() {
    const totalRegistros = this.lstInteresX.length + 1; // Número total de registros
    const montoPorRegistro = parseFloat((this.montoTotal / totalRegistros).toFixed(2)); // Calcula el monto dividido
    this.lstInteresX = []; // Reinicia la lista de letras

    for (let i = 0; i < totalRegistros; i++) {
      const fechaVencimiento = new Date(this.fechaInicial); // Clona la fecha inicial
      fechaVencimiento.setMonth(this.fechaInicial.getMonth() + i); // Incrementa el mes progresivamente

      // Ejemplo: monto inicial
      const interesEnv: DtoInteres = new DtoInteres();
      // Generar un nuevo registro con datos iniciales.       
 
      interesEnv.num = totalRegistros + 1;
      interesEnv.CompaniaCodigo = this.dto.CompaniaCodigo;
      interesEnv.DescripcionCorta = this.dto.DescripcionCorta;
      interesEnv.IdSede = this.dto.IdSede;
      interesEnv.SedDescripcion = this.dto.SedDescripcion;
      interesEnv.NomProyecto = this.dto.NomProyecto;
      interesEnv.NomManzana = this.dto.NomManzana;
      interesEnv.DesCondicion = this.dto.DesCondicion;
      interesEnv.DesSituacion = this.dto.DesSituacion;
      interesEnv.IdLote = this.dto.IdLote;
      interesEnv.Situacion = this.dto.Situacion;
      interesEnv.IdReserva = this.dto.IdReserva;
      interesEnv.IdVendedor = this.dto.IdVendedor;
      interesEnv.IdProyecto = this.dto.IdProyecto;
      interesEnv.IdManzana = this.dto.IdManzana;
      interesEnv.TipoDocumento = this.dto.TipoDocumento;
      interesEnv.Documento = this.dto.Documento;
      interesEnv.Cliente = this.dto.Cliente;
      interesEnv.Conyuge = this.dto.Conyuge;
      interesEnv.IdVendedor = this.dto.IdVendedor;
      interesEnv.DocVendedor = this.dto.DocumentoVen;
      interesEnv.Vendedor = this.dto.Vendedor;
      interesEnv.DesUbicacion = this.dto.DesUbicacion;
      interesEnv.FormaPago = this.dto.FormaPago;
      interesEnv.Banco = this.dto.Banco;
      interesEnv.IdContrato = this.dto.IdContrato;
      interesEnv.IdCliente = this.dto.IdCliente;
      interesEnv.Codigo = this.dto.Codigo;
      // SE ENVIA EN NOMBRE LOS ID DE CADA LETRA DE MANERA CONCATENADA
      interesEnv.Nombre =  this.Nombre;
      interesEnv.Observacion = this.Observacion;
      interesEnv.FechaVencimiento = fechaVencimiento;
      interesEnv.TotalMora = parseFloat(montoPorRegistro.toFixed(2));
      interesEnv.MontoPago = parseFloat(montoPorRegistro.toFixed(2));

      interesEnv.MonedaCodigo = this.dto.MonedaCodigo;
      interesEnv.DiasMora = this.DiasMora;
      interesEnv.Descuento = 0;
      interesEnv.Estado = 1;
      interesEnv.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
      interesEnv.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
      interesEnv.FechaCreacion = this.dto.FechaCreacion;
      interesEnv.FechaModificacion = this.dto.FechaModificacion;
      interesEnv.IpCreacion = this.getIp();
      interesEnv.IpModificacion = this.getIp();

      // Agregar nuevo registro a la lista
      this.lstInteresX.push(interesEnv);
      // Actualizar los montos en todos los registros
      this.actualizarMontos();
    }
  }

  // Función para actualizar montos después de agregar un registro
  actualizarMontos() {
    const totalRegistros = this.lstInteresX.length;
    const nuevoMonto = this.lstInteresX.reduce((total, item) => total + item.TotalMora, 0) / totalRegistros;
    this.lstInteresX = this.lstInteresX.map((registro, index) => ({
      ...registro,
      MontoTotal: parseFloat(nuevoMonto.toFixed(2)), // Conversión a número
      num: index + 1
    }));
  }

  async coreFraccionar() {
    this.bloquearPag = true;
    console.log("coreFraccionar lstmsj : ", this.lstmsj); 
    console.log("coreFraccionar lstmsjInteres : ", this.lstmsjInteres);   
    console.log("coreFraccionar lstmsjLetra : ", this.lstInteresX);

    this.lstmsjInteres[0].Estado = 2;
    const interes = await this.interesService.MantenimientoInteres(3, this.lstmsjInteres[0], this.getUsuarioToken());

    if (interes.success) {
        for (const element of this.lstInteresX) { // Usamos for...of en lugar de forEach
            let interesEnv: DtoInteres = new DtoInteres();
            interesEnv = element;

            try {
                let letraCop: any = await this.interesService.MantenimientoInteres(1, interesEnv, this.getUsuarioToken());
                console.log("coreFraccionar letraCop : ", letraCop); 

                if (letraCop.success) {  
                    this.dialog = false;
                    this.message('success', 'Success', 'Exitoso.');
                    this.onClose.emit(true); // Notificar al padre que fue exitoso
                } else {
                    this.message('error', 'Error', 'Error dividir.');
                    this.bloquearPag = false;
                    return;
                }
            } catch (error) {
                this.message('error', 'Error', 'Error al procesar la solicitud.');
                console.error(error);
                this.bloquearPag = false;
                return;
            }
        }
    } else {
        this.message('error', 'Error', 'Error al dividir.');
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
