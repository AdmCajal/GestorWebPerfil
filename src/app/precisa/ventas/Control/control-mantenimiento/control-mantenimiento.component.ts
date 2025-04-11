import { Component, OnInit, ViewChild } from "@angular/core";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";
import { PersonaBuscarComponent } from "../../../framework-comun/Persona/components/persona-buscar.component";
import { PersonaMantenimientoComponent } from "../../../framework-comun/Persona/vista/persona-mantenimiento.component";
import { DtoContrato } from "../../Contrato/model/DtoContrato";
import { DtoInteres } from "../../Interes/model/Dtointeres";
import { InteresService } from "../../Interes/service/interes.service";
import { ControlDividirCuotaComponent } from "../control-dividir-cuota/control-dividir-cuota.component";
import { ControlDividirLetraComponent } from "../control-dividir-letra/control-dividir-letra.component";
import { ControlPagarComponent } from "../control-pagar/control-pagar.component";
import { DtoLetra } from "../model/dtoLetra";
import { FiltroControl } from "../model/filtroControl";
import { ControlService } from "../service/control.service";

@Component({
  selector: "ngx-control-mantenimiento",
  templateUrl: "./control-mantenimiento.component.html",
  styleUrls: ["./control-mantenimiento.component.scss"],
})
export class ControlMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;
  @ViewChild(ControlPagarComponent, { static: false }) ControlPagarComponent: ControlPagarComponent;
  @ViewChild(ControlDividirCuotaComponent, { static: false }) ControlDividirCuotaComponent: ControlDividirCuotaComponent;
  @ViewChild(ControlDividirLetraComponent, { static: false }) ControlDividirLetraComponent: ControlDividirLetraComponent;

  
  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = "";
  position: string = "top";
  puedeEditar: boolean = false;
  lstMoneda: SelectItem[] = [];
  lstLetra: DtoLetra[] = [];
  lstSeleccionadomultiple: any[] = [];
  lstTotal: any[] = [];

  lstInteres: DtoInteres[] = [];

  dto: DtoContrato = new DtoContrato();
  FiltroLetra: FiltroControl = new FiltroControl();
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  flatApro : number;


  constructor(
      private ControlService: ControlService,
      private messageService: MessageService,
      private _InteresService: InteresService,
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

  async coredividir(letra: DtoLetra) {
    if(this.dto.Estado == 5){
      this.message('warn', 'Advertencia', 'Seleccione solo contratos PENDIENTES.');
      return;
    }
    if (letra.Estado !== 1) {
      this.message('warn', 'Advertencia', 'Seleccione solo letras PENDIENTES.');
      return;
    }

    if (letra.codigocomponente === '110011') {
      const val = await this.ControlDividirCuotaComponent.coreIniciarComponente(
        new MensajeController(this, "VER_LETRA", ""),
        "VER_LETRA",
        this.dto,
        [letra]
      );
      this.listenToComponent(this.ControlDividirCuotaComponent); // Escuchar cierre
    } else {
      const val = await this.ControlDividirLetraComponent.coreIniciarComponente(
        new MensajeController(this, "VER_LETRA", ""),
        "VER_LETRA",
        this.dto,
        [letra]
      );
      this.listenToComponent(this.ControlDividirLetraComponent); // Escuchar cierre
    }

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
  console.log("this.dto :",    this.dto );
  // Aquí llama al método que necesitas para actualizar la vista principal
  this.initializeEditMode(this.dto); // Por ejemplo
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

  async iniciarComponenteMaestro(
    msj: MensajeController, 
    accion: string, 
    titulo: string, 
    rowdata?: DtoContrato
  ) {
    try {
      this.resetComponentState();
      console.log("iniciarComponenteMaestro llegando:", msj.componente);
      this.mensajeController = msj;
      this.validarform = accion;
      this.acciones = `${titulo}: ${accion}`;
      this.dialog = true;
      this.bloquearPag = true;
  
      if (this.validarform === "EDITAR" && rowdata) {
        await this.initializeEditMode(rowdata);
      }

    if(rowdata.Estado == 5){
      console.log("rowdata.Estado llegando:", rowdata.Estado);
      this.puedeEditar = true;
    }
      
  
    } catch (error) {
      console.error("Error al iniciar el componente maestro:", error);
    } finally {
      this.bloquearPag = false;
    }
  }
  
  // Resetea el estado inicial del componente
  private resetComponentState() {
    this.dto = new DtoContrato();
    this.dto.MonedaCodigo = "EX";
    this.usuario = this.getUsuarioAuth().data[0]?.NombreCompleto.trim() || '';
    this.dto.FechaCreacion = new Date();
    this.fechaCreacion = this.dto.FechaCreacion;
    this.lstSeleccionadomultiple = [];
    this.lstTotal = [];
    this.lstLetra = [];
    this.lstInteres = [];
  }
  
  // Inicializa el estado en modo edición
  private async initializeEditMode(rowdata: DtoContrato) {    
    this.dto = rowdata;
    this.puedeEditar = false;
    this.dto.MonedaCodigo = rowdata.MonedaCodigo.trim();
    this.usuario = this.getUsuarioAuth().data[0]?.NombreCompleto.trim() || '';

    this.flatApro = this.getUsuarioAuth().data[0]?.FlagAproLetra;

    this.fechaCreacion = new Date(this.dto.FechaCreacion);
    this.fechaModificacion = this.dto.FechaModificacion ? new Date(this.dto.FechaModificacion) : null;
    this.FiltroLetra.IdContrato = this.dto.IdContrato;
  
    const tazaInteres = this.dto.TasaInteres / 100;
    const data: any[] = await this.ControlService.ListarLetra(this.FiltroLetra);
  
    this.lstLetra = this.processLetraData(data, tazaInteres);
    console.log("lstInteres :",    this.lstInteres );
    this.lstInteres = [...this.lstInteres]; // Crear una nueva referencia para forzar la detección de cambios
    this.calculateTotals(this.lstLetra);
  }
  
  // Procesa los datos de las letras y calcula interés y mora
  private processLetraData(data: any[], tazaInteres: number): any[] {
    const fechaHoy = new Date();
    let contado = 0;
  
    return data.map((e) => {
      e.num = contado++;
      e.isVer = e.Estado;  
      e.flatApro =   this.flatApro; 

   /*    if (!e.isVer) {    */     
        if (e.Estado == 1){
          const fechaVencimiento = new Date(e.FechaVencimiento);
          if (fechaVencimiento < fechaHoy) 
          {
              const diasAtrasados = this.calculateDiasAtrasados(e.FechaVencimiento, fechaHoy);
              const interes = this.calculateInteres(diasAtrasados, tazaInteres, e.MontoTotal);
              e.diasAtrasados = diasAtrasados;
              e.Interes = interes;

              // Ejemplo: monto inicial
              var   dtoLetra = new DtoInteres();
              // Generar un nuevo registro con datos iniciales. 
              const dtoInter = new DtoInteres();
              dtoInter.Observacion = e.Nombre;
              dtoInter.TotalMora = parseFloat(interes.toFixed(2));
              dtoInter.DiasMora = diasAtrasados;
              
              // Agregar nuevo registro a la lista
              this.lstInteres.push(dtoInter);  
          }
        } 
 /*      } */
  
      return e;
    });
  }
  
  // Calcula los días atrasados
  private calculateDiasAtrasados(fechaVencimiento: string | Date, fechaHoy: Date): number {
    const vencimiento = new Date(fechaVencimiento);
    vencimiento.setHours(0, 0, 0, 0);
    fechaHoy.setHours(0, 0, 0, 0);
  
    const diferencia = fechaHoy.getTime() - vencimiento.getTime();
    return Math.max(Math.round(diferencia / (1000 * 60 * 60 * 24)), 0);
  }
  
  // Calcula el interés basado en los días atrasados y la tasa
  private calculateInteres(diasAtrasados: number, tazaInteres: number, montoTotal: number): number {
    const interes = diasAtrasados * tazaInteres * montoTotal;
    return Math.round(Math.max(interes, 0));
  }
  
  
  // Calcula los totales y los asigna a `lstTotal`
  private calculateTotals(lstLetra: any[]) {
    let vTotal = 0, vAbonado = 0, vFaltante = 0;
  
    lstLetra.forEach((e) => {
      vTotal += e.MontoTotal;
      if (e.isVer) {
        vFaltante += e.MontoTotal;
      } else {
        vAbonado += e.MontoTotal;
      }
    });
  
    this.lstTotal = [
      {
        num: 1,
        Total: vTotal,
        Abonado: vAbonado,
        Faltante: vFaltante,
      },
    ];
  }

  imprimir(rowData: any) {
    console.log("imprimir url", rowData.Link_pdf);
   // const url = 'https://e-vf.softwareintegrado.com/vc-cpe/consult/show/d6e001f4-d570-5c94-97aa-d46efd45e585';
    window.open(rowData.Link_pdf, '_blank');
  }



  async verLetra(letra: DtoLetra) {

    if (letra.Estado == 1) {
      this.message('warn', 'Advertencia', 'Seleccione solo letras FACTURADAS.');
      return;
    }
    if ( letra.IdComprobante.length < 1) {
      this.message('warn', 'Advertencia', 'No cuenta con un comprobante.');
      return;
    }
    const val = await this.ControlPagarComponent.coreIniciarComponente(new MensajeController(this, "VER_LETRA", ""),"VER_LETRA", this.dto, [letra]);
  }

  async corePagar() {

    if (this.lstSeleccionadomultiple.length == 0) {
      this.message('warn', 'Advertencia', 'Debe elegir al menos una letra.');
      return;
    }

/*     if (this.lstInteres.length > 0) {
      this.message('warn', 'Advertencia', 'Debe refinanciar el Interes que debe.');
      return;
    } */

    for (let step = 0; step < this.lstSeleccionadomultiple.length; step++) {
      if (this.lstSeleccionadomultiple[step].Estado > 1) {
        this.message('warn', 'Advertencia', 'Seleccione solo letras PENDIENTES.');
        return;
      }
    }

    if (this.lstSeleccionadomultiple[0].FechaVencimiento) {
      const val = await this.ControlPagarComponent.coreIniciarComponente(new MensajeController(this, "SELECTOR_PAGAR", ""),"PAGAR_LETRA", this.dto, this.lstSeleccionadomultiple);
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
