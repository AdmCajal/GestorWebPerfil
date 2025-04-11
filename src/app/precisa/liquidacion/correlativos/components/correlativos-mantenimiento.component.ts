import { Component, OnInit } from "@angular/core";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { MaestroBancoService } from "../../../maestros/maestroBanco/servicio/maestro-banco.service";
import { FiltroCompaniamast } from "../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { DtoCorrelativo } from "../model/DtoCorrelativo";
import { CorrelativoService } from "../services/correlativo.service";



@Component({
  selector: 'ngx-correlativos-mantenimiento',
  templateUrl: './correlativos-mantenimiento.component.html'
})
export class CorrelativosMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {

  acciones: string = ''
  position: string = 'top';
  lstEstados: SelectItem[] = [];
  bloquearPag: boolean;
  verMant: boolean = false;
  validarform: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  dto: DtoCorrelativo = new DtoCorrelativo();
  lstCompania: SelectItem[] = [];
  lstTipoComprobante: SelectItem[] = [];
  filtrocompa: FiltroCompaniamast = new FiltroCompaniamast();
  esEditable:boolean = false;
  
  constructor(
    private messageService: MessageService,
    private CorrelativoService: CorrelativoService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private maestroBancoService: MaestroBancoService,
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
    this.fechaModificacion = undefined;
    const p1 = this.cargarEstados();
    const p2 = this.cargarCombocompania();
    const p3 = this.cargarTipoComprobante();
    this.dto = new DtoCorrelativo();
    //  const p3 = this.cargarMoneda();
    this.bloquearPag = true;

    Promise.all([p1, p2, p3]).then(async (resp) => {

      if (this.validarform == "NUEVO") {
        this.dto.Estado = "A";
        // this.dto.MonedaCodigo= "EX";
        this.puedeEditar = false;
        this.esEditable = false;
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
        this.bloquearPag = false;
      } else if (this.validarform == "EDITAR") {
        console.log("EDITAR FILA :", rowdata);

        this.puedeEditar = false;
        this.esEditable = true;

        const respCorrelativo = await this.CorrelativoService.ListarCorrelativos(rowdata);

        this.dto = respCorrelativo[0];
        // if (rowdata.UltimaFechaModif == null || rowdata.UltimaFechaModif==undefined) {
        //   this.fechaModificacion = undefined;
        // } else {
        //   this.fechaModificacion = new Date();
        // }   
        this.fechaModificacion = new Date();
        this.fechaCreacion = new Date(rowdata.FechaCreacion);
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.bloquearPag = false;


      } else if (this.validarform == "VER") {
        console.log("VER FILA :", rowdata);
        this.puedeEditar = true;
        this.esEditable = true;
        const respCorrelativo = await this.CorrelativoService.ListarCorrelativos(rowdata);
        this.dto = respCorrelativo[0];
        if (rowdata.UltimaFechaModif == null || rowdata.UltimaFechaModif == undefined) {
          this.fechaModificacion = undefined;
        } else {
          this.fechaModificacion = new Date(rowdata.UltimaFechaModif);
        }
        // this.fechaModificacion = new Date(rowdata.UltimaFechaModif);
        this.fechaCreacion = new Date(rowdata.FechaCreacion);

        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.bloquearPag = false;
      }

    });

  }


  cargarEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });
  }

  cargarCombocompania(): Promise<number> {
    this.lstCompania = [];
    this.lstCompania.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.filtrocompa.estado = "A";
    return this.maestrocompaniaMastService.listarCompaniaMast(this.filtrocompa).then(res => {
      console.log("company", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.CompaniaCodigo.trim() });
      });
      return 1;
    });
  }

  async cargarTipoComprobante(): Promise<boolean> {
    this.lstTipoComprobante = [];
    this.lstTipoComprobante.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipoComprobante.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });

    if (this.lstTipoComprobante.length == 0) {
      return false;
    } else {
      return true;
    }
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

  async coreGuardar() {


    if (this.estaVacio(this.dto.CompaniaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione una compañia válido'); return; }
    if (this.estaVacio(this.dto.TipoComprobante)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de comprobante válido'); return; }
    if (this.estaVacio(this.dto.Serie)) { this.messageShow('warn', 'Advertencia', 'Ingrese una serie válida'); return; }
    if (this.estaVacio(this.dto.CorrelativoNumero)) { this.messageShow('warn', 'Advertencia', 'Ingrese un número válido'); return; }
    if (this.estaVacio(this.dto.CorrelativoDesde)) { this.messageShow('warn', 'Advertencia', 'Ingrese un valor desde válido'); return; }
    if (this.estaVacio(this.dto.CorrelativoHasta)) { this.messageShow('warn', 'Advertencia', 'Ingrese un valor hasta válido'); return; }
    if (this.estaVacio(this.dto.Estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione una estado válido'); return; }


    if (this.esNumeroVacio(this.dto.CorrelativoNumero)) {
      this.messageService.add({ key: 'mr', severity: 'warn', summary: 'Advertencia', detail: 'Registro sin Descripcion.' });
      //this.messageService.add({ key: 'mr', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });

      console.log("coreGuardar estaVacio:", this.dto);
    } else {
      this.verMant = false;
      this.dto.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;

      if (this.validarform == "NUEVO") {
        // this.dto.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario.trim();
        //this.dto.fecha = this.fechaCreacion;
        this.bloquearPag = true;
        this.CorrelativoService.MantenimientoCorrelativos(1, this.dto, this.getUsuarioToken()).then(
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
        this.dto.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario.trim();
        this.dto.UltimaFechaModif = this.fechaModificacion;
        this.bloquearPag = true;
        this.CorrelativoService.MantenimientoCorrelativos(2, this.dto, this.getUsuarioToken()).then(
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
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }
}
