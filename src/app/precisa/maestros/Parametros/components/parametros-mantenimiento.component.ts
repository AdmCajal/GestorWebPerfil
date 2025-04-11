import { Component, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { AuditoriaComponent } from "../../../../@theme/components/auditoria/auditoria.component";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { NbToastrService } from "@nebular/theme";
import { ParametrosService } from "../service/parametros.service";
import { Parametros } from "../model/parametros";
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import Swal from "sweetalert2";
import { FiltroCompaniamast } from "../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { MensajeController } from "../../../../../util/MensajeController";
import { filtroParametros } from "../model/filtro.parametros";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";

@Component({
  selector: 'ngx-parametros-mantenimiento',
  templateUrl: './parametros-mantenimiento.component.html'
})

export class ParametrosMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy {
  @ViewChild(AuditoriaComponent, { static: false }) auditoriaComponent: AuditoriaComponent;
  acciones: string = '';
  position: string = 'top';
  validarAccion: string = '';

  checked: boolean = false
  lstEstados: SelectItem[] = [];
  lstCompania: SelectItem[] = [];
  lstTipoDato: SelectItem[] = [];
  usuario: string = "";
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  dto: Parametros = new Parametros();
  filtrocompa: FiltroCompaniamast = new FiltroCompaniamast();
  loading: boolean = false;
  bloquearPag: boolean;
  puedeEditar: boolean = false;
  NoPuedeEditar: boolean = false;
  fechaCreacion: Date;
  fechaModificacion: Date;
  constructor(
    private PersonaService: PersonaService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private messageService: MessageService,
    private ParametrosService: ParametrosService) {
    super();
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    const p1 = this.cargarTipo();
    const p2 = this.cargarEstados();
    const p3 = this.cargarCombocompania();
    Promise.all([p1, p2, p3]).then(
      f => {
        setTimeout(() => {
          this.bloquearPag = false;
        }, 100);
      });
  }

  ngOnDestroy(): void {

  }

  iniciarComponente(msj: MensajeController, accion: string, titulo: string) {
    this.mensajeController = msj;
    this.dto = new Parametros();
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false;
    this.validarAccion = accion;
    let fechaM = new Date();
    this.dto.UltimaFechaModif = null;
    this.dto.FechaCreacion = new Date();
    this.fechaCreacion = new Date();
    this.fechaModificacion = undefined;
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
  }

  async cargarAcciones(msj: MensajeController, accion: string, titulo: string, Entydad?: Parametros) {
    console.log("dsad",accion);
    /**PARAMETROS */
    this.mensajeController = msj;
    this.validarAccion = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;

    /**OBJETOS */
    this.dto = new Parametros();
    let filtro = new filtroParametros();

    /**AUDITORIA */
    this.fechaModificacion = undefined;
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

    /**METODOS DE COMBOS  */
    await this.cargarEstados();
    await this.cargarCombocompania();

    /**ACCION DE FORMULARIO */
    this.bloquearPag = true;
    
    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.puedeEditar = false;
        this.NoPuedeEditar = false;
        this.dto.AplicacionCodigo = "W1";
        this.dto.Estado = "A";
      
        
        this.fechaCreacion = new Date();
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.puedeEditar = false;
        this.NoPuedeEditar = true;
        filtro.ParametroClave = Entydad.ParametroClave;
        const respParametros = await this.ParametrosService.listarParametros(filtro);
        this.dto = await respParametros[0];

        this.dto.CompaniaCodigo = await this.dto.CompaniaCodigo.trim();
        
        //falta fecha de creación
        this.fechaCreacion = new Date(this.dto.FechaCreacion);
        this.dto.Fecha = new Date(this.dto.Fecha);
        if (this.dto.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(this.dto.UltimaFechaModif);
        }
        break;
      case ConstanteUI.ACCION_SOLICITADA_VER:
        this.puedeEditar = true;
        this.NoPuedeEditar = true;
        filtro.ParametroClave = Entydad.ParametroClave;
        const respParametrosVer = await this.ParametrosService.listarParametros(filtro);
        this.dto = await respParametrosVer[0];

        this.dto.CompaniaCodigo = await this.dto.CompaniaCodigo.trim();

        //falta fecha de creación
        this.fechaCreacion = new Date(this.dto.FechaCreacion);
        this.dto.Fecha = new Date(this.dto.Fecha);
        if (this.dto.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(this.dto.UltimaFechaModif);
        }
        break;
    }
    this.bloquearPag = false
  }


  cargarEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.trim().toUpperCase(), value: i.Codigo.trim() });
    });
    console.log("lstEstados",this.lstEstados);
    
  }

  cargarCombocompania(): Promise<number> {
    this.lstCompania = [];
    this.lstCompania.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.filtrocompa.estado = "A";
    return this.maestrocompaniaMastService.listarCompaniaMast(this.filtrocompa).then(res => {
      console.log("company", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.CompaniaCodigo.trim() });
      });
      return 1;
    });
  }


  cargarTipo() {
    this.lstTipoDato = [];
    this.lstTipoDato.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstTipoDato.push({ label: 'Texto'.toUpperCase(), value: "T" });
    this.lstTipoDato.push({ label: 'Numero'.toUpperCase(), value: "N" });
    this.lstTipoDato.push({ label: 'Fecha'.toUpperCase(), value: "F" });
    this.dto.TipodeDatoFlag = "T";
  }


  saveProduct() {

    if (this.estaVacio(this.dto.CompaniaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione una compañia válida'); return; }
    if (this.estaVacio(this.dto.TipodeDatoFlag)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de dato válido'); return; }
    if (this.estaVacio(this.dto.AplicacionCodigo)) { this.messageShow('warn', 'Advertencia', 'Ingrese una aplicación válida'); return; }
    if (this.estaVacio(this.dto.Texto)) { this.messageShow('warn', 'Advertencia', 'Ingrese un texto válido'); return; }
    if (this.estaVacio(this.dto.ParametroClave)) { this.messageShow('warn', 'Advertencia', 'Ingrese un parámetro válido'); return; }
    if (this.estaVacio(this.dto.Numero)) { this.messageShow('warn', 'Advertencia', 'Ingrese un valor válido'); return; }
    if (this.estaVacio(this.dto.Fecha)) { this.messageShow('warn', 'Advertencia', 'Ingrese una fecha válida'); return; }
    if (this.estaVacio(this.dto.Estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione una estado válido'); return; }




    this.dto.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
    
    /**ELIMINA HORAS DE CAMPO FECHA */
    this.dto.Fecha.setHours(0, 0, 0, 0);

    if (this.validarAccion == "EDITAR") {
      this.dto.UltimaFechaModif = new Date();
      this.ParametrosService.mantenimientoParametros(2, this.dto, this.getUsuarioToken()).then(
        res => {
          if (res.success) {
            this.dialog = false;
            this.messageService.add({ key: 'bc', severity: 'success', summary: 'Actualización', detail: 'Se modifico el registro con éxito.' });
            this.mensajeController.resultado = res;
            this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
          } else {
            this.dialog = false;
            this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Error al modificar.' });

          }
        }
      ).catch(error => error)
    }
    else if (this.validarAccion == "NUEVO") {
      this.dto.FechaCreacion = new Date();
      this.ParametrosService.mantenimientoParametros(1, this.dto, this.getUsuarioToken()).then(
        res => {
          if (res.success) {
            this.dialog = false;
            this.mensajeController.resultado = res;
            this.messageService.add({ key: 'bc', severity: 'success', summary: 'Actualización', detail: 'Se registro con éxito.' });
            this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
          } else {
            this.dialog = false;
            this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Error al registrar.' });

          }
        })
    }
  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

}
