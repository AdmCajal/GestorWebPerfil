import { SelectItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { FiltroWcoSede } from '../../../maestros/Sedes/dominio/filtro/FiltroWcoSede';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { FiltroManzana } from '../../Manzana/model/FiltroManzana';
import { ManzanaService } from '../../Manzana/service/manzana.service';
import { FiltroPrograma } from '../../Programa/model/FiltroPrograma';
import { ProgramaService } from '../../Programa/service/programa.service';
import { DtoLote } from '../model/DtoLote';
import { LoteService } from '../service/lotes.service';

@Component({
  selector: 'ngx-lotes-dividir',
  templateUrl: './lotes-dividir.component.html'
})
export class LotesDividirComponent extends ComponenteBasePrincipal implements OnInit {
  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = '';
  dto: DtoLote = new DtoLote();
  position: string = 'top';
  areaTotalview:number = this.dto.AreaTotal;
  lstLote: DtoLote[] = [];
  lstSeleccionadomultiple: any[] = [];
  lstCompania: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstManzana: SelectItem[] = [];
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  FiltroPrograma: FiltroPrograma = new FiltroPrograma();
  FiltroManzana: FiltroManzana = new FiltroManzana();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();

  constructor(
    private manzanaService: ManzanaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private loteService: LoteService,
    private maestroSucursalService: MaestroSucursalService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private programaService: ProgramaService
  ) { super(); }

  ngOnInit(): void {
    this.cargarCombocompania();

    this.lstLote = new Array();


  }


  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any,) {
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.dto = new DtoLote();
    this.lstLote = new Array();
    const p1 = this.cargarSucursalEditar(rowdata.CompaniaCodigo);
    const p2 = this.cargarComboPrograma(rowdata.IdSede);
    const p3 = this.cargarComboManzana(rowdata.IdProyecto);
    Promise.all([p1, p2, p3]).then((resp) => {
      this.dto = rowdata[0];
    });

  }

  cargarComboPrograma(IdSede: number): Promise<number> {
    this.lstPrograma = [];
    this.FiltroPrograma.Estado = 1;
    this.FiltroPrograma.IdSede = IdSede;
    console.log("Combo FiltroPrograma:", this.FiltroPrograma);
    this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.programaService.listarPrograma(this.FiltroPrograma).then((res) => {
      console.log("Combo Programa:", res);
      res.forEach(ele => {
        this.lstPrograma.push({ label: ele.Nombre.trim(), value: ele.IdProyecto });
      });
      return 1;
    });
  }

  cargarCombosede(IdPersona: number): Promise<number> {
    this.lstSucursal = [];
    this.filtroSede.SedEstado = 1;
    this.filtroSede.IdEmpresa = IdPersona;
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
      console.log("ListaSede", res);
      res.forEach(ele => {
        this.lstSucursal.push({ label: ele.SedDescripcion.trim(), value: ele.IdSede });
      });
      this.dto.IdSede = 331;
      this.cargarComboPrograma(this.dto.IdSede);
      return 1;
    });
  }

  selectedItemcompania(event) {
    console.log(" this.lstCompania:", this.lstCompania);
    console.log("seleccion:", event);
    var dato = this.lstCompania.filter(x => x.value == event.value);
    this.filtroSede.IdEmpresa = Number(dato[0].title);
    this.cargarCombosede(this.filtroSede.IdEmpresa);
  }

  selectedItemPrograma(event) {
    console.log("event selectedItemPrograma", event);
    this.dto.IdProyecto = event.value;
    this.cargarComboManzana(this.dto.IdProyecto);
  }

  cargarComboManzana(Id: number): Promise<number> {
    this.FiltroManzana.IdProyecto = Id;
    this.FiltroManzana.Estado = 1;
    this.lstManzana = [];
    console.log("FiltroManzana cargarComboManzana", this.FiltroManzana);
    this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.manzanaService.listarManzana(this.FiltroManzana).then((res) => {
      console.log("listarManzana", res);
      res.forEach(ele => {
        this.lstManzana.push({ label: ele.Nombre.trim(), value: ele.IdManzana });
      });
      return 1;
    });
  }

  cargarCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
      console.log("probando", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
      });
      return 1;
    });
  }

  coreAgregar() {

    var objLote = new DtoLote();
    objLote.IdProyecto = this.dto.IdProyecto;
    objLote.IdManzana = this.dto.IdManzana;
    objLote.Codigo = this.dto.Codigo;
    objLote.IdSede = this.dto.IdSede;
    objLote.SedDescripcion = this.dto.SedDescripcion;
    objLote.NomProyecto = this.dto.NomProyecto;
    objLote.Nombre = "";
    objLote.DesSituacion = this.dto.DesSituacion;
    objLote.Estado = 1;
    objLote.DesEstado = this.dto.DesEstado;
    objLote.Ubigeo = this.dto.Ubigeo;
    objLote.Direccion = this.dto.Direccion;
    objLote.TipoLote = this.dto.TipoLote;
    objLote.TipoInteres = this.dto.TipoInteres;
    objLote.MorosidadPorcentaje = this.dto.MorosidadPorcentaje;
    objLote.diasGracia = this.dto.diasGracia;
    objLote.TipoCambio = this.dto.TipoCambio;
    objLote.MonedaCodigo = this.dto.MonedaCodigo;
    objLote.Valor = this.dto.Valor;
    objLote.Condicion = this.dto.Condicion;
    objLote.Situacion = this.dto.Situacion;
    objLote.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
    objLote.IpCreacion = this.getIp();
    this.lstLote.push(objLote);
  }



  cargarSucursalEditar(compniacodigo: string) {
    var dato = this.lstCompania.filter(x => x.value == compniacodigo);
    this.filtroSede.IdEmpresa = Number(dato[0].title);
    this.filtroSede.SedEstado = 1;
    this.lstSucursal = [];
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
      console.log("ListaSede EDITAR", res);
      res.forEach(ele => {
        this.lstSucursal.push({ label: ele.SedDescripcion.trim(), value: ele.IdSede });
      });
      return 1;
    });

  }

  coreGuardar() {

    let areatotal = this.lstLote.reduce((a, b) => a += b.AreaTotal, 0);
    console.log('lista:', this.lstLote);
    if (areatotal > this.dto.AreaTotal) {
      this.messageService.add({ key: 'md', severity: 'warn', summary: 'Advertencia', detail: 'Supero el limite del area total.' });
    } else {
      this.confirmationService.confirm({
        header: "Confirmación",
        icon: "fa fa-question-circle",
        message: "¿Esta Seguro de dividir el LOTE: " + this.dto.Nombre + "?",
        key: "confirm3",
        accept: () => {
          var concatenado = "";
          this.lstLote.forEach(element => {
            concatenado += element.Nombre + ",";
          });
          this.dto.Estado = 2;
          this.dto.Observacion = "SE INACTIVO POR EL MOTIVO DE DIVIDIR EN LOTES: " + concatenado
          this.loteService.mantenimientoLote(3, this.dto, this.getUsuarioToken()).then(
            res => {
              if (res != null) {
                this.lstLote.forEach(element => {
                  this.loteService.mantenimientoLote(1, element, this.getUsuarioToken()).then(
                    res => {
                      this.dialog = false;
                      this.bloquearPag = false;
                      if (res != null) {
                        console.log("registrado:", res);
                        if (res.mensaje == "Created") {
                          this.messageService.add({ key: 'md', severity: 'success', summary: 'Success', detail: 'Se actualizó con éxito.' });
                          this.mensajeController.resultado = res;
                          this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                        } else {
                          this.messageService.add({ key: 'md', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
                        }
                      }
                    });
                });
              }
            });
        },

      });
    }
  }



  coreEliminar(row: DtoLote, index: number) {
    this.lstLote.splice(index, 1);
  }

}
