import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
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
  selector: 'ngx-lotes-unir',
  templateUrl: './lotes-unir.component.html'
})
export class LotesUnirComponent extends ComponenteBasePrincipal implements OnInit {
  validarform: string = null;
  acciones: string = '';
  dto: DtoLote = new DtoLote();
  position: string = 'top';
  lstLote: DtoLote[] = [];
  seleccion: any;
  lstCompania: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstManzana: SelectItem[] = [];
  lstMoneda: SelectItem[] = [];
  lstTipoInteres: SelectItem[] = [];
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  FiltroPrograma: FiltroPrograma = new FiltroPrograma();
  FiltroManzana: FiltroManzana = new FiltroManzana();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  lstEstadoCampo: SelectItem[] = [];
  valorEnSoles: number;
  valorEnsolesTotal: number;
  bloquearPag: boolean;
  fechaModificacion: Date;
  valorloteunido: string;

  constructor(
    private manzanaService: ManzanaService,
    private maestroSucursalService: MaestroSucursalService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private messageService: MessageService,
    private loteService:LoteService,
    private programaService: ProgramaService
  ) { super(); }

  ngOnInit(): void {
    const p1 = this.cargarCombocompania();
    const p2 = this.cargarComboTipoInteres();
    const p3 = this.cargarMoneda();
    const p4 = this.cargarComboEstadoCambio();

    Promise.all([p1, p2, p3, p4]).then((resp) => {




    });


  }


  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any,) {
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.dto = new DtoLote();
    this.dto.MonedaCodigo = "EX";
    // this.dto = [...rowdata[0]];
    this.lstLote = rowdata;

    this.dto.TipoInteres = this.lstLote[0].TipoInteres;
    this.dto.MorosidadPorcentaje = this.lstLote[0].MorosidadPorcentaje;
    this.dto.diasGracia = this.lstLote[0].diasGracia;
    this.dto.Situacion = this.lstLote[0].Situacion;
    this.dto.Nombre = this.lstLote[0].Nombre;
    this.dto.TipoCambio = this.lstLote[0].TipoCambio;
    if (!this.estaVacio(this.lstLote[0].MonedaCodigo)) {
      this.dto.MonedaCodigo = this.lstLote[0].MonedaCodigo.trim();
    }


    var areaTotal = 0;
    rowdata.forEach(element => {
      areaTotal += element.AreaTotal;
    });
    console.log("total:", areaTotal);
    this.dto.AreaTotal = areaTotal;


    this.dto.FechaModificacion = new Date();

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

  cargarComboTipoInteres() {
    this.lstTipoInteres = [];
    this.lstTipoInteres.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPINT").forEach(i => {
      this.lstTipoInteres.push({ label: i.Nombre, value: i.IdCodigo })
    });
    console.log("lstTipoInteres:", this.lstTipoInteres);
  }

  cargarMoneda() {
    this.lstMoneda = [];
    this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "MONEDA").forEach(i => {
      this.lstMoneda.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });
  }

  cargarComboEstadoCambio() {
    this.lstEstadoCampo = [];
    this.lstEstadoCampo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTCAM").forEach(i => {
      this.lstEstadoCampo.push({ label: i.Nombre, value: i.IdCodigo })
    });
    console.log("lstEstadoCampo:", this.lstEstadoCampo);
  }

  onRowSelect(event: any) {
    console.log("FILA SELECCIONADA:", event.data);
    this.dto.Valor = event.data.Valor;
    var valortotallote = this.dto.AreaTotal * this.dto.Valor;
    this.dto.ValorTotal = valortotallote;
    this.valorEnSoles = this.dto.TipoCambio * this.dto.Valor;
    this.valorEnsolesTotal = this.dto.TipoCambio * this.dto.ValorTotal;
  }

  coreSalir() {
    this.dialog = false;
  }


  coreGuardar() {
    this.lstLote.forEach(element => {
      if(element.checkregistro ==true){
        this.dto.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario.trim();
        this.bloquearPag = true;
        this.valorloteunido = element.Nombre;
        element.AreaTotal = this.dto.AreaTotal;
        element.Valor = this.dto.Valor;
        element.ValorTotal = this.dto.ValorTotal;
        this.loteService.mantenimientoLote(2, element, this.getUsuarioToken()).then(
          res => {
            this.dialog = false;
            this.bloquearPag = false;
            if (res != null) {
              console.log("registrado:", res);
              if (res.mensaje == "Ok") {
                this.messageService.add({ key: 'md', severity: 'success', summary: 'Success', detail: 'Se actualizó con éxito.' });
                this.mensajeController.resultado = res;
                this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
              } else {
                this.messageService.add({ key: 'md', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
              }
            }
          });

      }else{
        element.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario.trim();
        element.Observacion ="SE ANULA PORQUE SE UNIÓ AL LOTE:" + this.valorloteunido;
        element.Estado = 2;
        this.bloquearPag = true;
        this.loteService.mantenimientoLote(2, element, this.getUsuarioToken()).then(
          res => {
            this.dialog = false;
            this.bloquearPag = false;
            if (res != null) {
              console.log("registrado:", res);
              if (res.mensaje == "Ok") {
                this.messageService.add({ key: 'md', severity: 'success', summary: 'Success', detail: 'Se actualizó con éxito.' });
                this.mensajeController.resultado = res;
                this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
              } else {
                this.messageService.add({ key: 'md', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
              }
            }

          });
      }
    });
  }
}


