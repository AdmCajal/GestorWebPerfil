
import { filtroUsuario } from './../model/filtro.usuario';
import { Component, OnInit, ViewChild } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { ConfirmationService, MessageService, SelectItem } from "primeng/api";
import { UsuarioService } from "../service/usuario.service";
import { PersonaBuscarComponent } from "../../../framework-comun/Persona/components/persona-buscar.component";
import { Usuario } from "../model/usuario";
import { PersonaMantenimientoComponent } from "../../../framework-comun/Persona/vista/persona-mantenimiento.component";
import { MensajeController } from "../../../../../util/MensajeController";
import { PersonaService } from "../../../framework-comun/Persona/servicio/persona.service";
import * as CryptoJS from 'crypto-js';
import { EmpleadoMastService } from "../../../maestros/Empleados/service/empleadomast.service";
import { filtroEmpleadoMast } from "../../../maestros/Empleados/model/filtro.empleadomast";
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
@Component({
  selector: 'ngx-usuarios-mantenimiento',
  templateUrl: './usuarios-mantenimiento.component.html'
})

export class UsuariosMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;
  bloquearPag: boolean;
  acciones: string = '';
  position: string = 'top';
  validarform: string = null;
  checked: boolean = false;
  lstPerfil: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstTipoUsuario: SelectItem[] = [];
  DtoUsuario: Usuario = new Usuario();
  EsEmpleado: string = '';
  usuario: string;
  fechaCreacion: Date;
  resultado: Date;
  fechaModificacion: Date;
  editarrepresen: boolean = false;
  ActivarfechaExpiracion: boolean = true;
  filtroUsuario: filtroUsuario = new filtroUsuario();
  tieneFechaExpiracion: boolean = true;
  isNuevo: boolean = false;
  constructor(
    private personaService: PersonaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private UsuarioService: UsuarioService,
    private empleadoMastService: EmpleadoMastService,
  ) {
    super();
  }
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }
  ngOnInit(): void {
    //throw new Error("Method not implemented.");
  }

  async iniciarComponente(msj: MensajeController, accion: string, titulo, rowdata?: any,) {

    /**PARAMETROS */
    this.btnCerrar();
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;

    /**OBJETOS */
    this.DtoUsuario = new Usuario();
    console.log("Usuario iniciarComponente rowdata:", rowdata);

    /**AUDITORIA */
    this.fechaModificacion = undefined;
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

    /**METODOS DE COMBOS  */
    await this.listarComboEstados();
    await this.cargarPerfiles();
    await this.listarComboTipoUsuario();

    /**ACCION DE FORMULARIO */
    this.bloquearPag = true;
    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.puedeEditar = false;
        this.isNuevo = false;

        function sumarfecha(fecha, n = 1) {
          return new Date(fecha.setDate(fecha.getDate() + n));
        }
        this.DtoUsuario.FechaExpiracion = new Date();
        this.resultado = sumarfecha(this.DtoUsuario.FechaExpiracion, 45);

        //FECHAS
        this.fechaCreacion = new Date();
        this.fechaModificacion = undefined;
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.puedeEditar = false;
        this.isNuevo = true;
        console.log("ConstanteUI.ACCION_SOLICITADA_EDITAR", rowdata);
        /**BUSCAR OBJETO */
        /**
         * BUSCAR USUARIO POR EL OBJETO ROWDATA CON SU PROPIEDAD USUSARIO
         */
        this.filtroUsuario.USUARIO = rowdata.USUARIO;
        const respEditar: any[] = await this.UsuarioService.listarUsuarioMast(this.filtroUsuario);
        console.log("data", respEditar);
        this.DtoUsuario = await respEditar[0];
        // fin

        this.DtoUsuario.PERFIL = rowdata.PERFIL.trim();
        this.DtoUsuario.TipoUsuario = rowdata.TipoUsuario.toString();
        // VALIDAR FECHA DE CREACIÓN
        this.tieneFechaExpiracion = this.DtoUsuario.ExpirarPasswordFlag == "S" ? true : false;
        this.DtoUsuario.FechaExpiracion = this.tieneFechaExpiracion == true ? new Date(this.DtoUsuario.FechaExpiracion) : null
        if (this.DtoUsuario.FlagAproContrato == 1){
          this.DtoUsuario.FlagContrato = true
        }
        if (this.DtoUsuario.FlagAproLetra  == 1){
          this.DtoUsuario.FlagLetra = true
        }
        if (this.DtoUsuario.FlagAproInteres  == 1){
          this.DtoUsuario.FlagInteres = true
        }  
        this.fechaCreacion = new Date(rowdata.FechaCreacion);
        if (this.DtoUsuario.UltimaFechaModif != null) { this.fechaModificacion = new Date(rowdata.UltimaFechaModif); }
        if (this.DtoUsuario.FechaExpiracion != null) { this.DtoUsuario.FechaExpiracion = await new Date(rowdata.FechaExpiracion); }
        else { this.ActivarfechaExpiracion = false; }

        break;
      case ConstanteUI.ACCION_SOLICITADA_VER:
        this.puedeEditar = true;
        console.log("ConstanteUI.ACCION_SOLICITADA_EDITAR", rowdata);
        /**BUSCAR OBJETO */
        /**
         * BUSCAR USUARIO POR EL OBJETO ROWDATA CON SU PROPIEDAD USUSARIO
         */
        this.filtroUsuario.USUARIO = rowdata.USUARIO;
        const respVer: any[] = await this.UsuarioService.listarUsuarioMast(this.filtroUsuario);
        console.log("data", respVer);
        this.DtoUsuario = await respVer[0];
        // fin
        if (this.DtoUsuario.FlagAproContrato == 1){
          this.DtoUsuario.FlagContrato = true
        }
        if (this.DtoUsuario.FlagAproLetra  == 1){
          this.DtoUsuario.FlagLetra = true
        }
        if (this.DtoUsuario.FlagAproInteres  == 1){
          this.DtoUsuario.FlagInteres = true
        }  
        this.DtoUsuario.PERFIL = rowdata.PERFIL.trim();
        this.DtoUsuario.TipoUsuario = rowdata.TipoUsuario.toString();
        // VALIDAR FECHA DE CREACIÓN
        this.tieneFechaExpiracion = this.DtoUsuario.ExpirarPasswordFlag == "S" ? true : false;
        this.DtoUsuario.FechaExpiracion = this.tieneFechaExpiracion == true ? new Date(this.DtoUsuario.FechaExpiracion) : null

        this.fechaCreacion = new Date(rowdata.FechaCreacion);
        if (this.DtoUsuario.UltimaFechaModif != null) { this.fechaModificacion = new Date(rowdata.UltimaFechaModif); }
        if (this.DtoUsuario.FechaExpiracion != null) { this.DtoUsuario.FechaExpiracion = await new Date(rowdata.FechaExpiracion); }
        else { this.ActivarfechaExpiracion = false; }
        break;
    }
    this.bloquearPag = false;

    /**LIMPIA LA CLAVE POR SEGURIDAD */
    this.DtoUsuario.Clave = '';
  }

  generarpsd() {
    let result = '';
    const characters = '0123456789';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * 10));    //sorteo
    }
    return result;
  }

  async isFechaExpiracion() {
    this.DtoUsuario.FechaExpiracion = null;
    // this.ActivarfechaExpiracion = await this.ActivarfechaExpiracion == true ? false : true;
    // VALIDAR FECHA DE CREACIÓN
    if (!this.tieneFechaExpiracion) {

      this.DtoUsuario.FechaExpiracion = new Date();
      function sumarfecha(fecha, n = 1) {
        return new Date(fecha.setDate(fecha.getDate() + n));
      }
      this.DtoUsuario.FechaExpiracion = sumarfecha(this.DtoUsuario.FechaExpiracion, 45);

      this.DtoUsuario.ExpirarPasswordFlag = 'S';
      return;
    } else {

      this.DtoUsuario.FechaExpiracion = null;
      this.DtoUsuario.ExpirarPasswordFlag = 'N';
      return;
    }
  }
  coreGuardar() {

    // let con = this.generarpsd();
    // this.dto.Clave = CryptoJS.AES.encrypt(this.dto.Clave, con).toString();
    if (this.estaVacio(this.DtoUsuario.USUARIO)) { this.messageShow('warn', 'Advertencia', 'Seleccione una persona válida'); return; }
    if (this.estaVacio(this.DtoUsuario.Clave)) { this.messageShow('warn', 'Advertencia', 'Ingrese una clave válida'); return; }
    if (this.DtoUsuario.Clave != this.DtoUsuario.ClaveNueva) { this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'La contraseñas no coinciden' }); return; }
    if (this.estaVacio(this.DtoUsuario.CorreoElectronico)) { this.messageShow('warn', 'Advertencia', 'Ingrese un correo válido'); return; }
    if (!this.estaVacio(this.DtoUsuario.CorreoElectronico)) {
      if (!this.validarCorreo(this.DtoUsuario.CorreoElectronico)) { this.messageShow('warn', 'Advertencia', 'Ingrese un correo valido.'); return; }
    }
    if (this.estaVacio(this.DtoUsuario.PERFIL)) { this.messageShow('warn', 'Advertencia', 'Seleccione un perfíl válido'); return; }
    if (this.estaVacio(this.DtoUsuario.TipoUsuario.toString())) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de usuario válido'); return; }
    if (this.estaVacio(this.DtoUsuario.ESTADO)) { this.messageShow('warn', 'Advertencia', 'Seleccione un estado válido'); return; }
    
    if (this.DtoUsuario.FlagContrato == true){
      this.DtoUsuario.FlagAproContrato = 1
    }
    if (this.DtoUsuario.FlagLetra == true){
      this.DtoUsuario.FlagAproLetra = 1
    }
    if (this.DtoUsuario.FlagInteres == true){
      this.DtoUsuario.FlagAproInteres = 1
    }  
    console.log("Mant coreGuardar this.DtoUsuario::", this.DtoUsuario);
    this.bloquearPag = true;
    switch (this.validarform) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.confirmationService.confirm({
          header: "Confirmación",
          icon: "fa fa-question-circle",
          message: "¿Desea Guardar el registro ? ",
          key: "confirm2",
          accept: async () => {
            /**AUDITORIA */
            this.DtoUsuario.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
            this.DtoUsuario.UltimoUsuario = null;
            this.DtoUsuario.FechaCreacion = new Date();
            this.DtoUsuario.UltimaFechaModif = null;

            const respNuevo = await this.UsuarioService.mantenimientoUsuarioMast(ConstanteUI.SERVICIO_SOLICITUD_NUEVO, this.DtoUsuario, this.getUsuarioToken());
            if (respNuevo != null) {
              if (respNuevo.success) {
                this.messageShow('success', 'Success', this.getMensajeGuardado());
                this.mensajeController.resultado = respNuevo;
                this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                this.bloquearPag = false;
                this.dialog = false;
              } else {
                this.messageShow('warn', 'Advertencia', this.getMensajeErrorGuardado());
                this.bloquearPag = false;
              }
            }
            else {
              this.messageShow('warn', 'Advertencia', this.getMensajeErrorGuardado());
              this.bloquearPag = false;
            }
          }
        });
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:

        this.DtoUsuario.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
        this.DtoUsuario.UltimaFechaModif = new Date();

        this.confirmationService.confirm({
          header: "Confirmación",
          icon: "fa fa-question-circle",
          message: "¿Desea Modificar el registro ? ",
          key: "confirm2",
          accept: async () => {
            this.DtoUsuario.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
            const respEditar = await this.UsuarioService.mantenimientoUsuarioMast(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.DtoUsuario, this.getUsuarioToken());

            if (respEditar != null) {
              if (respEditar.success) {
                this.messageShow('success', 'Success', this.getMensajeActualizado());
                this.mensajeController.resultado = respEditar;
                this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                this.bloquearPag = false;
                this.dialog = false;
              } else {
                this.messageShow('warn', 'Advertencia', this.getMensajeErrorActualizar());
                this.bloquearPag = false;
              }
            }
            else {
              this.messageShow('warn', 'Advertencia', this.getMensajeErrorActualizar());
              this.bloquearPag = false;
            }
          }
        });
        break;
    }

  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }
  listarComboEstados() {
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstados.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  listarComboTipoUsuario() {
    this.lstTipoUsuario.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOUSUARIO").forEach(i => {
      this.lstTipoUsuario.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  cargarPerfiles() {
    let dto = {
      ESTADO: "A"
    }
    this.lstPerfil.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.UsuarioService.listarComboPerfil(dto).then(res => {
      console.log("Mant Usuario cargarPerfiles::", res);
      res.forEach(ele => {
        this.lstPerfil.push({ label: ele.Descripcion.trim(), value: ele.Codigo.trim() });
      });
      return 1;
    });
  }

  async coreMensaje(mensage: MensajeController) {
    console.log("data llegando mensage:", mensage);
    if (mensage.resultado.EsEmpleado != 'S') { this.messageShow('warn', 'Advertencia', 'La persona no es un empleado'); return; }
    if (mensage.resultado.Estado != "A") { this.messageShow('warn', 'Advertencia', 'El empleado no esta activo'); return; }

    const filtro: filtroUsuario = new filtroUsuario();
    filtro.USUARIO = mensage.resultado.Documento;
    const usuario = await this.UsuarioService.listarUsuarioMast(filtro);
    if (usuario.length > 0) { this.messageShow('warn', 'Advertencia', 'La persona ya tiene un usuario'); return; }
   
    if (mensage.componente == "SELECPACIENTE") {
      this.DtoUsuario.USUARIO = mensage.resultado.Documento;
      this.DtoUsuario.NOMBRECOMPLETO = mensage.resultado.NombreCompleto;
      this.DtoUsuario.PERSONA = mensage.resultado.Persona;
      this.DtoUsuario.CorreoElectronico = mensage.resultado.CorreoInterno.trimEnd();
      this.EsEmpleado = mensage.resultado.EsEmpleado;
    }
  }


  verSelector(tipo: string): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), 'BUSCAR ', "E");
  }

  crearPersona(tipo: string) {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGPERSONA', ''), 'NUEVO ', 1);
  }

  limpiarDocumento() {
    this.DtoUsuario.USUARIO = null;
    this.DtoUsuario.NOMBRECOMPLETO = null;
    this.DtoUsuario.PERSONA = null;
  }

  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      if (this.DtoUsuario.USUARIO == null) {
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Ingrese un Nro. de documento.' });
        return;
      }
      else if (this.DtoUsuario.USUARIO.trim().length >= 5) {
        let Documento = {
          Documento: this.DtoUsuario.USUARIO.trim(),
          tipopersona: "P",
          SoloBeneficiarios: "0",
          UneuNegocioId: "0"
        }
        this.bloquearPag = true;
        return this.personaService.listaPersonaUsuario(Documento).then((res) => {
          this.bloquearPag = false;
          if (this.esListaVacia(res)) {
            this.DtoUsuario.USUARIO = null;
            this.DtoUsuario.NOMBRECOMPLETO = null;
            this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
            return;
          }
          else if (res[0].hasOwnProperty("Documento")) {
            if (this.estaVacio(res[0].NombreCompleto)) {
              this.DtoUsuario.NOMBRECOMPLETO = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`;
              this.DtoUsuario.PERSONA = res[0].Persona;
              this.editarrepresen = true;
            } else {
              this.DtoUsuario.NOMBRECOMPLETO = res[0].NombreCompleto;
              this.DtoUsuario.PERSONA = res[0].Persona;
              this.editarrepresen = true;
            }
          } else {
            this.DtoUsuario.USUARIO = null;
            this.DtoUsuario.NOMBRECOMPLETO = null;
            this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
            return;
          }
        }).catch(error => error);
      } else {
        this.DtoUsuario.USUARIO = null;
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
        return;
      }
    }
  }

  btnCerrar() {
    this.lstEstados = [];
    this.lstPerfil = [];
    this.lstTipoUsuario = [];
    this.ActivarfechaExpiracion;
    this.fechaCreacion = undefined;
    this.fechaModificacion = undefined;
  }

}
