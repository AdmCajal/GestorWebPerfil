import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { FiltroMaestro } from '../../FormMaestro/model/Filtro.Maestro';
import { MaestroService } from '../../FormMaestro/service/maestro.service';
import { NbToastrService } from '@nebular/theme';
import { Dtomaestrodetalle } from "../dominio/dto/Dtomaestrodetalle";
import { MaestrodetalleService } from "../servicio/maestrodetalle.service";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Filtromaestrodetalle } from "../dominio/filtro/Filtromaestrodetalle";
import { MensajeController } from '../../../../../util/MensajeController';



@Component({
  selector: 'ngx-maestro-detalle-mantenimiento',
  templateUrl: './maestro-detalle-mantenimiento.component.html'
})
export class MaestroDetalleMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  lstEstados: SelectItem[] = [];
  lstTablaMaestro: SelectItem[] = [];
  filtroMaestro: FiltroMaestro = new FiltroMaestro();
  dto: Dtomaestrodetalle = new Dtomaestrodetalle();
  bloquearPag: boolean;
  validarform: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  esEditable:boolean = false;
  filtro: Filtromaestrodetalle = new Filtromaestrodetalle();

  constructor(
    private messageService: MessageService,
    private maestroService: MaestroService,
    private maestrodetalleService: MaestrodetalleService,
    private confirmationService: ConfirmationService,
    private toastrService: NbToastrService) {
    super();
  }



  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  acciones: string = ''
  position: string = 'top'

  iniciarComponente(accion: string, titulo) {
    if (accion) {
      this.cargarAcciones(accion, titulo)
    }
  }

  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any,) {
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    const p1 = this.cargarEstados();
    const p2 = this.cargarMaestros();
    this.dto = new Dtomaestrodetalle();

    Promise.all([p1, p2]).then((resp) => {
      if (this.validarform == "NUEVO") {
        this.dto.Estado = 1;
        this.puedeEditar = false;
        this.esEditable = false;
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
        this.fechaModificacion = undefined;
      } else if (this.validarform == "EDITAR") {
        this.bloquearPag = true;
        this.filtro.IdTablaMaestro = rowdata.IdTablaMaestro;
        this.filtro.IdCodigo = rowdata.IdCodigo;
        this.maestrodetalleService.listarmaestroDetalle(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.puedeEditar = false;
          this.esEditable = true;
          console.log("respuesta editar:", res[0]);
          this.dto = res[0];
          this.fechaModificacion = new Date();
          // this.fechaCreacion = new Date(res[0].FechaCreacion);
          if (res[0].FechaCreacion == null || res[0].FechaCreacion == undefined) {
            this.fechaCreacion = undefined;
          } else {
            this.fechaCreacion = new Date(res[0].FechaCreacion);
          }
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        });
      } else if (this.validarform == "VER") {
        this.bloquearPag = true;
        this.filtro.IdTablaMaestro = rowdata.IdTablaMaestro;
        this.filtro.IdCodigo = rowdata.IdCodigo;
        this.maestrodetalleService.listarmaestroDetalle(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.puedeEditar = true;
          this.esEditable = true;
          console.log("respuesta editar:", res[0]);
          this.dto = res[0];
          // this.fechaModificacion = new Date(res[0].FechaModificacion);
          if (res[0].FechaModificacion == null || res[0].FechaModificacion == undefined) {
            this.fechaModificacion = undefined;
          } else {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }
          // this.fechaCreacion = new Date(res[0].FechaCreacion);
          if (res[0].FechaCreacion == null || res[0].FechaCreacion == undefined) {
            this.fechaCreacion = undefined;
          } else {
            this.fechaCreacion = new Date(res[0].FechaCreacion);
          }
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        });
      }
    });
  }


  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false;

    const p1 = this.cargarEstados();
    const p2 = this.cargarMaestros();
    Promise.all([p1, p2]).then((resp) => {


    });

  }



  cargarEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre, value: i.IdCodigo });
    });
  }

  cargarMaestros() {
    this.filtroMaestro.Estado = 1;
    this.maestroService.listarMaestro(this.filtroMaestro).then(
      res => {
        this.lstTablaMaestro = [];
        this.lstTablaMaestro.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
        console.log("TABLA MAESTRO:", res);
        res.forEach(element => {
          this.lstTablaMaestro.push({ label: element.Nombre, value: element.IdTablaMaestro });
        });
      }
    );
  }



  async coreGuardar() {

    if (this.estaVacio(this.dto.Codigo)) { this.messageShow('warn', 'Advertencia', 'Ingrese un código válido'); return; }
    if (this.estaVacio(this.dto.Nombre)) { this.messageShow('warn', 'Advertencia', 'Ingrese una descripción válida'); return; }
    if (this.estaVacio(this.dto.IdTablaMaestro)) { this.messageShow('warn', 'Advertencia', 'Seleccione un maestro válido'); return; }
    if (this.estaVacio(this.dto.Estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione una estado válido'); return; }


    if (this.esNumeroVacio(this.dto.IdTablaMaestro)) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Debe Seleccionar un maestro.' });
      return;
    }
    if (this.validarform == "NUEVO") {
      this.bloquearPag = true;
      this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();
      this.dto.FechaCreacion = this.fechaCreacion;
      this.dto.IdCodigo = 0;
      this.maestrodetalleService.mantenimientoMaestro(1, this.dto, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          this.dialog = false;
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
      this.bloquearPag = true;
      this.dialog = false;
      this.dto.FechaModificacion = this.fechaModificacion;
      this.maestrodetalleService.mantenimientoMaestro(2, this.dto, this.getUsuarioToken()).then(
        res => {
          this.dto.FechaModificacion = this.fechaModificacion;
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
