import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { DtoContrato } from '../../Contrato/model/DtoContrato';
import { FiltroContrato } from '../../Contrato/model/FiltroContrato';
import { ContratoService } from '../../Contrato/service/contrato.service';
import { DtoLetra } from '../../Control/model/dtoLetra';
import { InteresControlComponent } from '../interes-control/interes-control.component';
import { InteresPagarComponent } from '../interes-pagar/interes-pagar.component';
import { DtoInteres } from '../model/Dtointeres';
import { InteresService } from '../service/interes.service';

@Component({
  selector: 'ngx-interes-mantenimiento',
  templateUrl: './interes-mantenimiento.component.html',
  styleUrls: ['./interes-mantenimiento.component.scss']
})
export class InteresMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(InteresPagarComponent, { static: false }) interesPagarComponent: InteresPagarComponent;
  @ViewChild(InteresControlComponent, { static: false }) InteresControlComponent: InteresControlComponent;

  
  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = ''
  position: string = 'top';
  lstInteres: DtoInteres[] = [];
  seleccion: DtoInteres;
  esRefinanciar: boolean = false;
  lstInteresRefinanciados: DtoInteres[] = [];
  contrato: DtoContrato = new DtoContrato();
  lstTotal: any[] = [];
  lstSeleccionadomultiple: any[] = [];

  constructor(private _InteresService: InteresService, 
    private _ContratoService: ContratoService, 
    private messageService: MessageService,) { super(); }
  
  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }

  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }

  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }

  async coredividir(Interes: DtoInteres) {
   
    if (Interes.Estado !== 1) {
      this.message('warn', 'Advertencia', 'Seleccione solo letras PENDIENTES.');
      return;
    }

    const val = await this.InteresControlComponent.coreIniciarComponente(
      new MensajeController(this, "VER_LETRA", ""),
      "VER_LETRA",    this.contrato,     [Interes]
    );
    this.listenToComponent(this.InteresControlComponent); // Escuchar cierre

  }

// Método para escuchar el evento de cierre
listenToComponent(componentInstance: any) {
  componentInstance.onClose.subscribe((success: boolean) => {
    if (success) {
      this.bloquearPag = true;
      // Ejecutar método para refrescar la vista principal
      this.refrescarVistaPrincipal();
      this.bloquearPag = false;
    }
  });
}

  // Método para refrescar la vista principal
  refrescarVistaPrincipal() {
    console.log('Refrescando vista principal...');
    // console.log("this.contrato :",    this.contrato );
    // Aquí llama al método que necesitas para actualizar la vista principal
    // this.initializeEditMode(this.dto); // Por ejemplo
  }

  async coreMensaje(mensage: MensajeController) {
    console.log("coreMensaje llegando:", mensage.componente);
    if (mensage.componente == "PAGAR_INTERES" || mensage.componente == "REFINANCIAR") {
      this.lstSeleccionadomultiple = [];
      this.mensajeController.resultado = mensage.resultado;
      this.mensajeController.componente = mensage.componente;
      this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);


      //this.iniciarComponenteMaestro(this.mensajeController, 'PAGAR', 'INTERES', this.contrato);
      this.lstInteres = [];
      this.lstInteres = (await this.getInteresesContrato(this.contrato.IdContrato)).filter(e => {
        if (e.Estado == 1) {
          return e;
        }
      });
    }

    if (mensage.componente == "REFINANCIAR") {
      this.mensajeController.resultado = mensage.resultado;
      this.mensajeController.componente = mensage.componente;
      this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);

      //this.iniciarComponenteMaestro(this.mensajeController, 'REFINANCIAR', 'INTERES', this.contrato);
      this.lstInteres = [];
      this.lstInteres = (await this.getInteresesContrato(this.contrato.IdContrato)).filter(e => {
        if (e.Estado == 1) {
          return e;
        }
      });
    }
  }

  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }

  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  async iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: DtoInteres,) {
    this.contrato = new DtoContrato();
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.esRefinanciar = false;
    this.bloquearPag = true;
    let vTotal = 0;
    let vAbonado = 0;
    let vFaltante = 0;
    this.lstSeleccionadomultiple = [];
    console.log(rowdata);

    //listar intereses
    this.lstInteres = (await this.getInteresesContrato(rowdata.IdContrato)).filter(e => {
      if (e.Estado == 1) {
        return e;
      }
    });


    this.contrato = await this.getContrato(rowdata.IdContrato);


    this.lstInteres.forEach((element) => {

      vTotal += element.TotalMora;
      if (element.Estado == 1) {
        vFaltante += element.TotalMora;
      }
      if (element.Estado == 2) {
        vAbonado += element.TotalMora;
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
    switch (this.validarform) {
      case 'PAGAR':
        break;
      case 'REFINANCIAR':
        break;
    }
    this.bloquearPag = false;
  }

  async getInteresesContrato(IdContrato: number): Promise<DtoInteres[]> {

    const filtroInteres: DtoInteres = new DtoInteres();
    filtroInteres.IdContrato = IdContrato;
    filtroInteres.Estado = 1;
    const respIntereses = await this._InteresService.ListarInteres(filtroInteres);
    console.log(respIntereses);
    var contado = 1;
    respIntereses.forEach((element) => {
      element.num = contado++;
    });
    if (respIntereses.length == 0) {
      return [];
    } else { return respIntereses; }

  }

  async getContrato(IdContrato: number): Promise<DtoContrato> {
    const filtroContrato: FiltroContrato = new FiltroContrato();
    filtroContrato.IdContrato = IdContrato;
    const respContrato = await this._ContratoService.ListarContrato(filtroContrato);
    console.log(respContrato);
    if (respContrato.length == 0) {
      return null;
    } else { return respContrato[0]; }

  }


  async verInteresesRefinanciados(interes: DtoInteres) {
    this.bloquearPag = true;

    let filtro: DtoInteres = new DtoInteres();
    filtro.IdContrato = interes.IdContrato;
    filtro.IdInteres = interes.IdInteres;

    const respIntereses = await this._InteresService.ListarInteresPadre(filtro);
    var contado = 1;
    respIntereses.forEach((element) => { element.num = contado++; });

    this.lstInteresRefinanciados = await respIntereses;
    this.bloquearPag = false;

    if (this.lstInteresRefinanciados.length == 0) {
      this.messageShow('warn', 'Advertencia', 'No contiene intereses refinanciados');
      this.esRefinanciar = false; return;
    } else {
      this.esRefinanciar = true;
    }
  }
  cerrarInteresRefinanciado() {
    this.esRefinanciar = false;
  }
  async corePagar() {
    switch (this.validarform) {
      case 'PAGAR':
        if (this.lstSeleccionadomultiple.length == 0) {
          this.message('warn', 'Advertencia', 'Debe elegir al menos una letra.');
          return;
        }
        for (let step = 0; step < this.lstSeleccionadomultiple.length; step++) {
          if (this.lstSeleccionadomultiple[step].Estado > 1) {
            this.message('warn', 'Advertencia', 'Seleccione solo intereses PENDIENTES.');
            return;
          }
        }
        const val = await this.interesPagarComponent.coreIniciarComponente(new MensajeController(this, "PAGAR_INTERES", ""), 'PAGAR', this.contrato, this.lstSeleccionadomultiple);
        this.lstSeleccionadomultiple = await [];
        break;
      case 'REFINANCIAR':
        const val1 = await this.interesPagarComponent.coreIniciarComponente(new MensajeController(this, "REFINANCIAR", ""), 'REFINANCIAR', this.contrato, this.lstSeleccionadomultiple);
        this.lstSeleccionadomultiple = await [];
        break;
    }

  }
  async coreLimpiar() {
    this.lstSeleccionadomultiple = await [];
  }
  message(tipo: string, titulo: string, msg: string) {
    this.messageService.add({
      key: "bc",
      severity: tipo,
      summary: titulo,
      detail: msg,
    });
  }

  //ver seguimiento de pago

  async verIntereses(interes: DtoInteres) {
    if (interes.Estado == 1) {
      this.message('warn', 'Advertencia', 'Seleccione solo letras FACTURADAS.');
      return;
    }
    const val = await this.interesPagarComponent.coreIniciarComponente(new MensajeController(this, "VER_LETRA", ""), "", this.contrato, [interes]);
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

}
