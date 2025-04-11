import { FiltroWcoSede } from './../../dominio/filtro/FiltroWcoSede';
import { ServicioComunService } from './../../../../framework-comun/servicioComun.service';
import { MaestroSucursalService } from './../../servicio/maestro-sucursal.service';
import { Component, OnInit } from "@angular/core";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../../util/ComponenteBasePrincipa";
import { ConstanteAngular } from "../../../../../@theme/ConstanteAngular";
import { FiltroCompaniamast } from "../../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { MaestrocompaniaMastService } from "../../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { ConstanteMaestros } from "../../../ConstanteMaestros";
import { DtoWcoSede } from "../../dominio/dto/DtoWcoSede";
import { MensajeController } from '../../../../../../util/MensajeController';
import { strict } from "assert";



@Component({
  selector: 'ngx-sedes-mantenimiento',
  templateUrl: './sedes-mantenimiento.component.html'
})
export class SedesMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  lstEstados: SelectItem[] = [];
  bloquearPag: boolean;
  validarform: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  dto: DtoWcoSede = new DtoWcoSede();
  acciones: string = '';
  position: string = 'top';
  lstCompania: SelectItem[] = [];
  lstSucursaltb: any[] = [];
  filtrocompa: FiltroCompaniamast = new FiltroCompaniamast();
  filtro: FiltroWcoSede = new FiltroWcoSede();

  constructor(
    private messageService: MessageService,
    private maestroSucursalService: MaestroSucursalService,
    private maestrocompaniaMastService: MaestrocompaniaMastService
  ) {
    super();
  }



  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any): void {
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    const p1 = this.cargarEstados();
    const p2 = this.cargarCombocompania();
    this.dto = new DtoWcoSede();
    this.fechaModificacion = undefined;
    Promise.all([p1, p2]).then((resp) => {
      if (this.validarform == "NUEVO") {
        this.dto.SedEstado = 1;
        this.puedeEditar = false;
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
      } else if (this.validarform == "EDITAR") {
        console.log("EDITAR FILA :", rowdata);
        this.filtro.IdSede = rowdata.IdSede;
        this.bloquearPag = true;
        this.maestroSucursalService.ListaSede(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.dto = res[0];
          this.puedeEditar = false;
          this.fechaModificacion = new Date();
          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        });

      } else if (this.validarform == "VER") {
        console.log("VER FILA :", rowdata);
        this.filtro.IdSede = rowdata.IdSede;
        this.bloquearPag = true;
        let fechaM: string;

        this.maestroSucursalService.ListaSede(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.dto = res[0];
          this.puedeEditar = true;
          // this.fechaModificacion = new Date(res[0].FechaModificacion);
          if (res[0].FechaModificacion == null || res[0].FechaModificacion == undefined) {
            this.fechaModificacion = undefined;
          } else {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }
          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        });
      }
    });
  }

  cargarEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo });
    });
  }

  async coreGuardar() {

    if (this.estaVacio(this.dto.SedCodigo)) { this.messageShow('warn', 'Advertencia', 'Ingrese un código válido'); return; }
    if (this.estaVacio(this.dto.SedDescripcion)) { this.messageShow('warn', 'Advertencia', 'Ingrese un nombre válido'); return; }
    if (this.estaVacio(this.dto.IdEmpresa)) { this.messageShow('warn', 'Advertencia', 'Seleccione una compañia válida'); return; }
    if (this.estaVacio(this.dto.SedEstado)) { this.messageShow('warn', 'Advertencia', 'Seleccione una estado válido'); return; }

    if (this.validarform == "NUEVO") {
      // this.filtro = new FiltroWcoSede;
      // this.filtro.SedDescripcion = this.dto.SedDescripcion;
      // let data = await this.maestroSucursalService.ListaSede(this.filtro);
      // if (data.length != 0) {
      //   this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Ya existe una sucursal con ese nombre' });
      //   this.bloquearPag = false;
      //   return;
      // }
      this.bloquearPag = true;
      this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();
      this.dto.FechaCreacion = this.fechaCreacion;
      this.maestroSucursalService.mantenimientoMaestro(1, this.dto, this.getUsuarioToken()).then(
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

      this.maestroSucursalService.mantenimientoMaestro(2, this.dto, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          if (res != null) {
            console.log("registrado:", res);
            if (res.mensaje == "Ok") {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Se actualizó con éxito.' });
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
              this.bloquearPag = false;
              this.dialog = false;
            } else {
              this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertenciaaa', detail: res.mensaje });
              this.bloquearPag = false;
              this.dialog = false;
            }
          }

        });
    }

  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  cargarCombocompania(): Promise<number> {
    this.lstCompania = [];
    this.lstCompania.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.filtrocompa.estado = "A";
    return this.maestrocompaniaMastService.listarCompaniaMast(this.filtrocompa).then(res => {
      console.log("company", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
      });
      return 1;
    });
  }

  esTelefesCeluValido(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /^[0-9]/;
    if (!regex.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }


}


