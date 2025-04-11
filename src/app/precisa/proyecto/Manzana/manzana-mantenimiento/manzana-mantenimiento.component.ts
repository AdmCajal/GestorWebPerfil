import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { ManzanaService } from '../service/manzana.service';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { DtoManzana } from '../model/DtoManzana';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { FiltroWcoSede } from '../../../maestros/Sedes/dominio/filtro/FiltroWcoSede';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { FiltroPrograma } from '../../Programa/model/FiltroPrograma';
import { ProgramaService } from '../../Programa/service/programa.service';
import { FiltroManzana } from '../model/FiltroManzana';

@Component({
  selector: 'ngx-manzana-mantenimiento',
  templateUrl: './manzana-mantenimiento.component.html',
  styleUrls: ['./manzana-mantenimiento.component.scss']
})
export class ManzanaMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  bloquearPag: boolean;
  validarform: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  UsuarioCreacion: string = '';
  acciones: string = ''
  position: string = 'top';
  lstEstados: SelectItem[] = [];
  dto: DtoManzana = new DtoManzana();
  lstCompania: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  lstPrograma: SelectItem[] = [];
  filtroPrograma: FiltroPrograma = new FiltroPrograma();
  filtro: FiltroManzana = new FiltroManzana();
  habilitarcombo: boolean = false;
  isNuevo:boolean=false;


  constructor(
    private messageService: MessageService,
    private manzanaService: ManzanaService,
    private maestroSucursalService: MaestroSucursalService,
    private programaService: ProgramaService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private confirmationService: ConfirmationService) {

    super();
  }

  ngOnInit(): void {

    const p1 = this.cargarComboEstados();
    const p2 = this.cargarCombocompania();
    Promise.all([p1, p2]).then((resp) => {


    });
  }


  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any,) {
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.dto = new DtoManzana();
    this.fechaModificacion = undefined;
    this.UsuarioCreacion = this.getUsuarioAuth().data[0].NombreCompleto.trim();
    if (this.validarform == "NUEVO") {
      this.lstSucursal = [];
      this.lstPrograma = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.dto.Estado = 1;
      this.dto.Estado = 1;
      this.isNuevo = false;
      this.dto.FechaCreacion = new Date();
      this.fechaCreacion = this.dto.FechaCreacion;

      this.bloquearPag = false;
      this.habilitarcombo = false;
    } else if (this.validarform == "EDITAR") {

      const p1 = this.cargarSucursalEditar(rowdata.CompaniaCodigo);
      const p2 = this.cargarComboProgramaEditar(rowdata.IdSede);
      Promise.all([p1, p2]).then((resp) => {
        this.filtro.IdManzana = rowdata.IdManzana;
        this.bloquearPag = true;
        this.manzanaService.listarManzana(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.puedeEditar = false;
          this.isNuevo = true;
          this.habilitarcombo = true;
          console.log("EDITAR REST :", res);
          this.dto = res[0];
          if (res[0].FechaModificacion != null || res[0].FechaModificacion != undefined) {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }

          this.fechaCreacion = new Date(res[0].FechaCreacion);

        });
      });


    } else if (this.validarform == "VER") {

      const p1 = this.cargarSucursalEditar(rowdata.CompaniaCodigo);
      const p2 = this.cargarComboProgramaEditar(rowdata.IdSede);
      Promise.all([p1, p2]).then((resp) => {
        this.filtro.IdManzana = rowdata.IdManzana;
        this.bloquearPag = true;
        this.manzanaService.listarManzana(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.puedeEditar = true;
          this.habilitarcombo = true;
          console.log("EDITAR REST :", res);
          this.dto = res[0];
          if (res[0].FechaModificacion != null || res[0].FechaModificacion != undefined) {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }

          this.fechaCreacion = new Date(res[0].FechaCreacion);

        });
      });

    }




  }


  cargarComboEstados() {
    this.lstEstados = [];
    let label: string;
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      label = i.Nombre.trim()
      this.lstEstados.push({ label: label.toUpperCase(), value: i.IdCodigo })
    });
    console.log("lstEstados:", this.lstEstados);
  }

  cargarCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania = []
    this.lstSucursal = []
    this.lstPrograma = []
    this.lstCompania.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
      console.log("listarCompaniaMast", res);
      res.forEach(ele => {
        //  this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
        this.lstCompania.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
      });
      return 1;
    });
  }

  selectedItemcompania(event) {
    if (event.value != null) {
      console.log(" this.lstCompania:", this.lstCompania);
      console.log("seleccion:", event);
      var dato = this.lstCompania.filter(x => x.value == event.value);
      this.filtroSede.IdEmpresa = Number(dato[0].title);
      this.lstSucursal = [];
      this.lstPrograma = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.cargarCombosede(this.filtroSede.IdEmpresa);
    }
    else {
      this.lstSucursal = [];
      this.lstPrograma = [];
      this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    }
  }

  cargarCombosede(IdPersona: number): Promise<number> {
    this.filtroSede.SedEstado = 1;
    this.filtroSede.IdEmpresa = IdPersona;
    this.lstSucursal = [];
    this.lstPrograma = [];
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
      console.log("ListaSede", res);
      res.forEach(ele => {
        this.lstSucursal.push({ label: ele.SedDescripcion.trim().toUpperCase(), value: ele.IdSede });
      });
      return 1;
    });
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
        this.lstSucursal.push({ label: ele.SedDescripcion.trim().toUpperCase(), value: ele.IdSede });
      });
      return 1;
    });

  }

  cargarComboProgramaEditar(IdSede: number): Promise<number> {
    this.filtroPrograma.Estado = 1;
    this.lstPrograma = [];
    this.filtroPrograma.IdSede = IdSede;
    this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.programaService.listarPrograma(this.filtroPrograma).then((res) => {
      console.log("Combo Programa:", res);
      res.forEach(ele => {
        this.lstPrograma.push({ label: ele.Nombre.trim().toUpperCase(), value: ele.IdProyecto });
      });
      return 1;
    });
  }
  cargarComboPrograma(): Promise<number> {
    if (this.dto.IdSede != null) {
      this.filtroPrograma.Estado = 1;
      this.lstPrograma = [];
      let label: string;
      this.filtroPrograma.IdSede = this.dto.IdSede;
      this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      return this.programaService.listarPrograma(this.filtroPrograma).then((res) => {
        console.log("Combo Programa:", res);
        res.forEach(ele => {
          label = ele.Nombre.trim()
          this.lstPrograma.push({ label: label.toUpperCase(), value: ele.IdProyecto });
        });
        return 1;
      });
    } else {
      this.lstPrograma = [];
      this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    }

  }


  coreGuardar() {

    if (this.estaVacio(this.dto.CompaniaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione una compañia válida'); return; }
    if (this.estaVacio(this.dto.IdSede)) { this.messageShow('warn', 'Advertencia', 'Seleccione una sucursal válida'); return; }
    if (this.estaVacio(this.dto.IdProyecto)) { this.messageShow('warn', 'Advertencia', 'Seleccione un programa válido'); return; }

    if (this.estaVacio(this.dto.Nombre)) { this.messageShow('warn', 'Advertencia', 'Ingrese un nombre válido'); return; }
    if (this.estaVacio(this.dto.Estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione un estado válido'); return; }


    if (this.validarform == "NUEVO") {
      this.bloquearPag = true;
      this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();
      this.dto.IpCreacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
      this.manzanaService.mantenimientoManzana(1, this.dto, this.getUsuarioToken()).then(
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

    } else if (this.validarform == "EDITAR") {
      this.dto.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario.trim();
      this.dto.FechaModificacion = new Date();
      this.bloquearPag = true;
      this.manzanaService.mantenimientoManzana(2, this.dto, this.getUsuarioToken()).then(
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

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

}
