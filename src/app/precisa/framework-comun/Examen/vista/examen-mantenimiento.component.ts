import { Component, OnInit,ViewChild } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { SelectItem } from 'primeng/api';
import { UsuarioAuth } from "../../../auth/model/usuario";
import { FiltroExamen, FiltroServicio } from "../dominio/filtro/FiltroExamen";
import { ExamenService } from "../servicio/Examen.service";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { MensajeController } from "../../../../../util/MensajeController";

@Component({
    selector: 'ngx-examen-mantenimiento',
    templateUrl: './examen-mantenimiento.component.html'
  })

export class ExamenMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  bloquearPag: boolean;
  lstServicio: SelectItem[] = [];
  lstEstado: SelectItem[] = [];
  lstClasificacion: SelectItem[] = [];  
  lstTiempo: SelectItem[] = [];
  lstSexo: SelectItem[] = [];
  lstCentroCosto: SelectItem[] = [];
  lstVenta: SelectItem[] = [];

  Auth: UsuarioAuth = new UsuarioAuth();
  filtro: FiltroExamen = new FiltroExamen();
  servicio: FiltroServicio = new FiltroServicio();

  constructor(
    private examenService: ExamenService) {
    super();
  }

  ngOnInit(): void {
    console.log("Mant Exa Inicio ngOnInit");
    const p1 = this.comboCargarServicios();
    console.log("Mant Exa Inicio p1", p1);
    const p2 = this.listaComboEstado();
    console.log("Mant Exa Inicio p2", p2);
    const p3 = this.comboCargarClasificacion();
    console.log("Mant Exa Inicio p3", p3);
    const p4 = this.listaComboSexo();
    console.log("Mant Exa Inicio p4", p4);
    const p5 = this.listaComboTiempo();
    console.log("Mant Exa Inicio p5", p5);
    const p6 = this.listaComboCentroCosto();
    console.log("Mant Exa Inicio p6", p6);
    const p7 = this.listaComboVenta();
    console.log("Mant Exa Inicio p7", p7);
    Promise.all([p1,p2,p3,p4,p5,p6,p7]).then(resp => {
  
    });
  }
  
  acciones: string = ''
  position: string = 'top'

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, titulo: string, page: number, dtoEditExamen?: any): void {



    this.cargarAcciones(accionform,titulo)
    this.mensajeController = mensaje; 
    console.log("dtoEditExamen:",dtoEditExamen);
    console.log("controller:",this.mensajeController);
    console.log("page:",page);
    console.log("titulo:",titulo);
    if (page == 1) {

    }

    if (page == 2) {
     // this.filtro = new dtoEditExamen();
      this.filtro = dtoEditExamen;
      console.log("Mant persona dto llegando:",  this.filtro );
    }

    if (page == 3) {
     // this.filtro = new dtoEditExamen();
      this.filtro = dtoEditExamen;

    }
  }
  
  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false;
  }

  comboCargarServicios(){
    this.Auth = this.getUsuarioAuth();
    var service = this.Auth.data;
    this.servicio.Estado = 1;
    this.lstServicio.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.examenService.serviciopaginado(this.servicio).then(resp => {
      resp.forEach(e => {
        this.lstServicio.push({ label: e.Nombre, value: e.ClasificadorMovimiento });
      });     
      console.log("Mant Exa combo servicio resp", resp);
    });
  }

  listaComboEstado() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstado.push({ label: i.Nombre, value: i.IdCodigo });
    });
    this.filtro.Estado = 1;
  }

  listaComboTiempo() {
    this.lstTiempo = [];
    this.lstTiempo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIEMPO").forEach(i => {
      this.lstTiempo.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  listaComboSexo() {
    this.lstSexo = [];
    this.lstSexo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "SEXO").forEach(i => {
      this.lstSexo.push({ label: i.Nombre, value: i.Codigo })
    });
  }


  listaComboCentroCosto() {
    this.lstCentroCosto = [];
    this.lstCentroCosto.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstCentroCosto.push({ label: '2006', value: '2006' });
    this.lstCentroCosto.push({ label: '2022', value: '2022' });
    this.lstCentroCosto.push({ label: '2002', value: '2006' });
    this.lstCentroCosto.push({ label: '2001', value: '2022' });
    this.lstCentroCosto.push({ label: '600401', value: '600401' });
    console.log("Mant Exa lstCentroCosto",  this.lstCentroCosto);
  }

  listaComboVenta() {
    this.lstVenta = [];
    this.lstVenta.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstVenta.push({ label: '243', value: '243' });
    this.lstVenta.push({ label: '159', value: '159' });
    this.lstVenta.push({ label: '160', value: '160' });
    this.lstVenta.push({ label: '158', value: '158' });
    console.log("Mant Exa listaComboVenta",  this.lstVenta);
  }

  comboCargarClasificacion() {
    let clasificador = {Estado: 1 }
    this.lstClasificacion = [];
    this.lstClasificacion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.examenService.listarclasificadorcomponente(clasificador).then(resp => {
        resp.forEach(e => {
          this.lstClasificacion.push({ label: e.Nombre, value: e.IdClasificacion });
        });
    });
    console.log("Mant Exa comboCargarClasificacion",  this.lstClasificacion);
 }
}
