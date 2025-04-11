import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UISelectorController } from '../../../../../util/UISelectorController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { ConsultaAdmisionService } from '../../../admision/consulta/servicio/consulta-admision.service';
import { LoginService } from '../../../auth/service/login.service';
import { PersonaPasswordResetComponent } from '../components/persona-password-reset.component';
import { dtoPersona } from '../dominio/dto/dtoPersona';
import { PersonaService } from '../servicio/persona.service';
@Component({
  selector: 'ngx-persona-mantenimiento',
  templateUrl: './persona-mantenimiento.component.html'
})
export class PersonaMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UISelectorController {
  @ViewChild(PersonaPasswordResetComponent, { static: false }) personaPasswordResetComponent: PersonaPasswordResetComponent;
  // @ViewChild(AuditoriaComponent, { static: false }) auditoriaComponent: AuditoriaComponent;
  @ViewChild('myselect') myselect;

  @ViewChild('myDireccion', { static: false }) myDireccion: ElementRef;
  @ViewChild('myApellidoMaterno', { static: false }) myApellidoMaterno: ElementRef;
  @ViewChild('myDocumento', { static: false }) myDocumento: ElementRef;
  @ViewChild('myTelefono', { static: false }) myTelefono: ElementRef;

  labelSi: string;
  iconSi: string;
  labelNo: string;
  iconNo: string;
  bloquearPag: boolean;
  resultId: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  Auth = this.getUsuarioAuth().data;
  verValidarTipoPersona: boolean = false;
  verValidarTelefono: boolean = false;
  verValidarDireccion: boolean = false;
  verValidarEstado: boolean = false;
  validarDocumento: string;
  validarEmpresa: number = 0;
  validarmaxtexto: number;
  validarmintexto: number;
  lstTipoPersona: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstTipoDocumento: SelectItem[] = [];
  lstSexo: SelectItem[] = [];
  lstTipoAdmision: SelectItem[] = [];
  lstDepartamento: SelectItem[] = [];
  lstProvincia: SelectItem[] = [];
  lstDistrito: SelectItem[] = [];
  bscPersonaCopia: dtoPersona = new dtoPersona();
  verApeMat: boolean = false;
  verDocumento: boolean = false;
  ocultarApeMat: boolean = false;
  oculApeMatExt: boolean = false;
  verLabelId: boolean = true;
  verNombre: boolean = true;
  verEmpresa: boolean = false;
  verRuc: boolean = false;
  verMantPersona: boolean = false;
  verDiaVencimiento: boolean = false;
  verIretencion: boolean = false;
  width: string = '';
  dto: dtoPersona = new dtoPersona();
  dtoConfirmar: dtoPersona = new dtoPersona();
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string;
  editarCampoEmail: boolean = false;
  editarCampos: boolean = false;
  editarPassword: boolean = false;
  editarTipoDocumento: boolean = false;
  esCliente: boolean = false;
  esProveedor: boolean = false;
  esEmpleado: boolean = false;
  esOtro: boolean = false;
  selectedPort = "";
  selectedTipoDocuemento = "";
  selectedDepartamento = "";
  selectedProvincia = "";
  selectedEstado = "";
  selectedFechaNacimiento = new Date();

  disabledTipoPerso: boolean = false;
  verpersonajuridica: boolean = true;
  verrucmodi: boolean = true;


  verpersonanatural: boolean = false;

  maxDate: Date = new Date();

  constructor(
    private confirmationService: ConfirmationService,
    public loginService: LoginService,
    private personaService: PersonaService,
    private consultaAdmisionService: ConsultaAdmisionService,
    private router: Router,
    private messageService: MessageService,
    private toastrService: NbToastrService,

  ) {
    super();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 16);
  }


  ngOnDestroy(): void {

  }

  ngOnInit(): void {

    this.titulo = '';
    const p1 = this.listarEstados();
    const p2 = this.listaComboTipoDocumento();
    const p3 = this.listaComboTipoPersona();
    const p4 = this.listaComboSexo();
    const p6 = this.listarComboDepartamento();
    Promise.all([p1, p2, p3, p4, p6]).then(resp => {
      this.lstProvincia.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.lstDistrito.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    });


  }

  openNew() {
    if (!this.editarPassword) {
      this.personaPasswordResetComponent.coreIniciarComponentePassword(new MensajeController(this, 'PASSWPERSON', ''), "PASSWORD", this.dto);
    }
  }


  coreBusquedaRapida(filtro: string): void {
    throw new Error('Method not implemented.');
  }
  coreBuscar(tabla: Table): void {
    throw new Error('Method not implemented.');
  }
  coreFiltro(flag: boolean): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    //  this.mensajeController.componenteDestino.desbloquearPagina();
    this.verMantPersona = false;
  }

  coreSeleccionar(dto: any): void {
    this.mensajeController.resultado = dto;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    this.coreSalir();
  }

  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreMensaje(mensage: MensajeController): void {

  }

  coreAccion(accion: string): void {
    throw new Error('Method not implemented.');
  }

  Correo() {

    if (!this.editarCampoEmail) {

      var validar = 1;

      if (this.estaVacio(this.dto.CorreoElectronico)) {

        this.verMantPersona = false;
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: 'Mensaje no enviado. El paciente no cuenta con un correo registrado.',
          confirmButtonColor: '#094d74',
          confirmButtonText: 'Ok, volver al registro'
        }).then((result) => {
          if (result.isConfirmed) {
            this.verMantPersona = true;
          } else {
            this.verMantPersona = true;
          }
        })
        validar = 2;
      } else {
        if (!this.esEmailValido(this.dto.CorreoElectronico)) {
          // this.validarPer2.markAllAsTouched();
          validar = 2;
        }
      }
      if (validar == 1) {
        this.bloquearPag = true;

        let IdPersona = {
          IdPersona: this.dto.Persona
          // ClasificadorMovimiento: "01"
          // ClasificadorMovimiento: dto.ClasificadorMovimiento
        }
        var _parametros = null;
        // this.Auth = this.getUsuarioAuth();
        var usuario = this.Auth;

        this.personaService.listarUsuarioWeb(IdPersona).then(resp => {
          console.log("resp", resp)
          if (resp[0].estadoActualizacion == 1) {
            _parametros = {
              success: 1,
              valor: 1,
              UneuNegocioId: usuario[0].UneuNegocioId,
              str_pTo: this.dto.CorreoElectronico,
              str_pCC: "darkon27@gmail.com",
              NombreCompleto: resp[0].NombreCompleto,
              PerNumeroDocumento: resp[0].UserNameWeb,
              Password: resp[0].PasswordWeb
            }


            return this.consultaAdmisionService.sendCorreo(_parametros).then(resp => {
              console.log("correo", resp)
              setTimeout(() => {
                this.bloquearPag = false;
              }, 300);
              this.verMantPersona = false;
              this.toastMensaje('Correo enviado', 'success', 3000);
              if (this.dtoConfirmar.CorreoElectronico != this.dto.CorreoElectronico) {
                this.guardarPersona();
              }
            }).catch(error => error);

          } else {
            this.verMantPersona = false;
            Swal.fire({
              icon: 'warning',
              title: '¡Mensaje!',
              text: 'Usuario ya personalizó su contraseña, procesa a generarla una nueva',
              showCancelButton: true,
              confirmButtonColor: '#094d74',
              cancelButtonColor: '#ffc72f',
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Ok, volver al registro'
            }).then((result) => {
              if (result.isConfirmed) {
                this.verMantPersona = true;
              }
            })

            setTimeout(() => {
              this.bloquearPag = false;
            }, 300);
          }

        });
      }
    }
  }

  coreIniciarComponente(mensaje: MensajeController): void {
    this.mensajeController = mensaje;
    console.log("ENTRO NUEVO COMPONENTE", this.mensajeController);
    this.verMantPersona = true;
    this.titulo = 'PERSONA';
    this.acciones = `${this.titulo}: ${this.mensajeController.tipo}`;
  }

  auditoria(filtro?: any, accion?: string) {
    this.fechaCreacion = undefined;
    this.fechaModificacion = undefined;
    if (accion == "NUEVO") {
      this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
      this.fechaCreacion = new Date();
      this.fechaModificacion = null;
    } else {
      console.log("mostrar auditoria comparacion Inicio", this.getUsuarioAuth().data[0].Usuario, filtro);
      if (this.estaVacio(filtro.UltimoUsuario)) {
        console.log("UsuarioCreacion Igual a UsuarioLogeado");
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
        this.fechaCreacion = new Date();
        if(filtro.UltimaFechaModif !=null){
        this.fechaModificacion = new Date(filtro.UltimaFechaModif);}else{ this.fechaModificacion = null}

      } else {
        console.log("VAlidar Usuario Lleno", this.getUsuarioAuth().data[0].Usuario, filtro.UltimoUsuario);
        if (filtro.UltimoUsuario == this.getUsuarioAuth().data[0].Usuario) {
          console.log("Usuario Logeado")
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
          if (this.esFechaVacia(filtro.IngresoFechaRegistro)) {
            this.fechaModificacion = new Date(filtro.UltimaFechaModif);

            this.fechaCreacion = new Date(filtro.IngresoFechaRegistro);
          }
          else {
            this.fechaCreacion = new Date(filtro.IngresoFechaRegistro);
            this.fechaModificacion = new Date(filtro.UltimaFechaModif);
          }
        }
        else {
          console.log("Usuario Rest", filtro.UltimoUsuario, filtro.UltimaFechaModif);
          let dto = {
            Documento: filtro.UltimoUsuario.trim(),
            tipopersona: "USU",
            SoloBeneficiarios: "-1",
            UneuNegocioId: "-1"
          }
          return this.personaService.listaPersonaUsuario(dto).then((res) => {
            this.usuario = res[0].NombreCompleto;
            this.fechaCreacion = new Date(filtro.IngresoFechaRegistro);
            if (this.esFechaVacia(filtro.UltimaFechaModif)) {
              //this.fechaModificacion = new Date();
            } else {
              this.fechaModificacion = new Date(filtro.UltimaFechaModif);
            }
            console.log("mostrar auditoria", this.usuario, this.fechaCreacion, this.fechaModificacion);
          })
        }
      }
    }
    console.log("mostrar auditoria comparacion Final", this.getUsuarioAuth().data[0].Usuario);
  }

  mostrarCamposEditar(dtoEditPersona) {
    this.dto.TipoPersona = dtoEditPersona.TipoPersona;
    this.dto.Sexo = dtoEditPersona.Sexo;
    this.dto.Persona = dtoEditPersona.Persona;
    this.dto.TipoDocumento = dtoEditPersona.TipoDocumento;
    this.dto.Documento = dtoEditPersona.Documento.trim();
    this.dto.DocumentoFiscal = dtoEditPersona.DocumentoFiscal.trim();
    this.dto.Nombres = dtoEditPersona.TipoDocumento;
    this.dto.ApellidoPaterno = dtoEditPersona.ApellidoPaterno;
    this.dto.ApellidoMaterno = dtoEditPersona.ApellidoMaterno;
    this.dto.FechaNacimiento = new Date(dtoEditPersona.FechaNacimiento);
    this.dto.Telefono = dtoEditPersona.Telefono;
    this.dto.Celular = dtoEditPersona.Celular;
    this.dto.CorreoElectronico = dtoEditPersona.CorreoElectronico;
    this.dto.Direccion = dtoEditPersona.Direccion;
    this.dto.Estado = dtoEditPersona.Estado;
    this.dto.DireccionReferencia = dtoEditPersona.DireccionReferencia;
    this.dto.DEPARTAMENTO = dtoEditPersona.DEPARTAMENTO;
    if (this.esNumeroVacio(dtoEditPersona.Edad)) {
      this.CalcularAnios();
    } else {
      this.dto.Edad = dtoEditPersona.Edad;
    }
    this.dto.PROVINCIA = dtoEditPersona.PROVINCIA;
    this.dto.SunatUbigeo = dtoEditPersona.SunatUbigeo;
    this.dto.Comentario = dtoEditPersona.Comentario;
    this.dto.DiaVencimiento = dtoEditPersona.IndicadorRetencion;
  }

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, page: number, dtoEditPersona?: any): void {
    this.mensajeController = mensaje;
    console.log("Mant dtoEditPersona :", dtoEditPersona);
    console.log("Mant persona accionform :", accionform);
    console.log("Mant persona mensajeController:", this.mensajeController);
    this.dto = new dtoPersona();
    this.verMantPersona = true;
    this.validarAccion = accionform;
    sessionStorage.setItem('filtrosPersona', JSON.stringify(dtoEditPersona));
    if (page == 1) {
      this.titulo = 'PERSONA';
    } else {
      this.titulo = 'EMPRESA';
      this.validarEmpresa = 2
      this.validarmaxtexto = 11;
      this.validarmintexto = 11;
    }
    this.acciones = this.titulo + ":" + accionform;
    this.auditoria(dtoEditPersona, accionform);
    if (accionform == "NUEVO") {
      this.editarCampos = false;
      this.dto.TipoPersona = "N";
      this.dto.Estado = "A";
      if (this.dto.TipoPersona == "N") {
        this.esCliente = true;
        this.verpersonajuridica = false;
        this.disabledTipoPerso = false;
        this.verrucmodi = false;
        // this.editarTipoDocumento = false;
      }
      this.fechaCreacion = new Date();
      this.fechaModificacion = null;
    }
    else if (accionform == "EDITAR") {
      this.editarCampos = false;

      const p2 = this.listarComboProvincia(dtoEditPersona.DEPARTAMENTO);
      const p3 = this.listarComboDistrito(dtoEditPersona.DEPARTAMENTO + dtoEditPersona.PROVINCIA);
      Promise.all([p2, p3]).then(async (resp) => {
        console.log("DEPARTAMENTO:", this.lstDepartamento);
        console.log("PROVINCIA:", this.lstProvincia);
        console.log("DISTRITO:", this.lstDistrito);

        //Busqueda por el servicio de la persona
        this.bloquearPag = true;
        console.log("dtoEditPersona", dtoEditPersona)
        const respPersona = await this.personaService.listarpaginado(dtoEditPersona);
        console.log("respPersona", respPersona);
        this.dto = respPersona[0];
        this.bloquearPag = false;
        //

        if (this.dto.TipoPersona == "J") {
          this.editarTipoDocumento = true;
          this.disabledTipoPerso = true;
          this.verpersonajuridica = true;
          this.verrucmodi = true;
          this.dto.Nombres = dtoEditPersona.NombreCompleto;
          if (this.estaVacio(dtoEditPersona.FechaNacimiento)) {

          }
          else {
            this.dto.FechaNacimiento = new Date(respPersona[0].FechaNacimiento);
          }
        }
        else {
          this.verpersonajuridica = false;
          this.disabledTipoPerso = true;
          this.verrucmodi = false;
          this.dto.FechaNacimiento = new Date(dtoEditPersona.FechaNacimiento);
        }
        this.validarflagABooleanCampos(dtoEditPersona);
        this.CalcularAnios();
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;

        if (dtoEditPersona.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(dtoEditPersona.UltimaFechaModif);
        }
        this.fechaCreacion = new Date(dtoEditPersona.IngresoFechaRegistro);
        console.log("Mant persona dto llegando:", this.dto);
      });

    } else if (accionform == "VER") {
      const p2 = this.listarComboProvincia(dtoEditPersona.DEPARTAMENTO);
      const p3 = this.listarComboDistrito(dtoEditPersona.DEPARTAMENTO + dtoEditPersona.PROVINCIA);
      this.editarCampos = true;
      this.editarPassword = true;
      Promise.all([p2, p3]).then(async (resp) => {
        //Busqueda por el servicio de la persona
        this.bloquearPag = true;
        const respPersona = await this.personaService.listarpaginado(dtoEditPersona);
        console.log("respPersona", respPersona);
        this.dto = respPersona[0];
        this.bloquearPag = false;
        //

        if (this.dto.TipoPersona == "J") {
          this.verpersonajuridica = true;
          this.verrucmodi = true;
          this.dto.Nombres = respPersona[0].NombreCompleto;
        } else if (this.dto.TipoPersona == "N") {
          this.verpersonajuridica = false;
          this.verrucmodi = false;
        }
        this.dto.FechaNacimiento = new Date(respPersona[0].FechaNacimiento);
        this.CalcularAnios();
        this.validarflagABooleanCampos(respPersona[0]);
        this.editarTipoDocumento = true;
        this.disabledTipoPerso = true;
        //this.usuario=new(dtoEditPersona.UsuarioCreacion)
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
        if (dtoEditPersona.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(dtoEditPersona.UltimaFechaModif);
        }
        this.fechaCreacion = new Date(respPersona[0].IngresoFechaRegistro);
        console.log("Mant persona dto llegando:", this.dto);
      });
    }
  }

  selectedItemTipoPersona(event) {
    if (this.dto.TipoPersona == "J") {
      this.verpersonajuridica = true;
      this.verrucmodi = true;
      this.dto.TipoDocumento = "R";
      this.validarmaxtexto = 11;
      this.validarmintexto = 11;
      this.editarTipoDocumento = true;
      console.log("selectedItemTipoPersona:", this.dto);
    } else if (this.dto.TipoPersona == "N") {
      this.verpersonajuridica = false;
      this.dto.TipoDocumento = "D";
      this.verrucmodi = false;
      this.editarTipoDocumento = false;
      console.log("selectedItemTipoPersona:", this.dto);
    }
  }

  validarApeMat(evento) {
    if (evento.key != null) {
      this.verApeMat = false;
    }
  }

  validarTelf(evento) {
    if (evento.key != null) {
      this.verValidarTelefono = false;
    }
  }

  editarPersona(persona: any) {
    console.log("persona editarPersona", persona);
    // if (this.dto.TipoPersona == "J") {
    //   if(this.dto.IndicadorRetencion=="true"){
    //     this.dto.IndicadorRetencion="1";
    //   }else{
    //     this.dto.IndicadorRetencion="0";
    //   }
    //   if(this.esNumeroVacio(this.dto.DiaVencimiento)) {
    //     this.dto.DiaVencimiento=0;
    //   }
    // }

    this.personaService.mantenimientoMaestro(2, persona, this.getUsuarioToken()).then(
      res => {
        if (res.success) {
          this.makeToast(this.getMensajeActualizado(persona.Persona))
          this.verMantPersona = false;
          this.mensajeController.resultado = persona.Persona;
          console.log("editarPersona   this.mensajeController:", this.mensajeController);
          this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
          this.bscPersonaCopia = this.dto;
        }
        else {
          this.verMantPersona = false;
          var mensajito;
          var confirmar;
          var cerrar;
          var validar = 0
          if (this.estaVacio(res.mensaje)) {
            mensajito = 'El token a expirado.'
            confirmar = 'Continuar con el registro'
            cerrar = 'Cerrar sesión'
            validar = 1
          } else {
            mensajito = res.mensaje;
            confirmar = 'Volver al registro'
            cerrar = 'Cerrar'
            validar = 2
          }
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: mensajito,
            showCancelButton: true,
            confirmButtonColor: '#094d74',
            cancelButtonColor: '#ffc72f',
            cancelButtonText: cerrar,
            confirmButtonText: confirmar
          }).then((result) => {
            if (result.isConfirmed) {
              this.verMantPersona = true;
              if (validar == 1) {
                this.nuevoToken(this.loginService)
              }
            } else {
              if (validar == 1) {
                sessionStorage.removeItem('access_user')
                sessionStorage.removeItem('access_user_token')
                sessionStorage.removeItem('access_menu')
                this.router.navigate(['/auth/login'])
              }

            }
          })
        }
      }).catch(error => error)
  }

  ServicioRegistrarPersona() {
    this.dto.NombreCompleto = `${this.dto.ApellidoPaterno} ${this.dto.ApellidoMaterno}, ${this.dto.Nombres}`
    console.log("ServicioRegistrarPersona dto a guardar:", this.dto);
    this.personaService.mantenimientoMaestro(1, this.dto, this.getUsuarioToken()).then(
      res => {
        console.log("res guardado:", res);
        if (res.success) {
          this.makeToast(this.getMensajeGrabado(this.dto.Documento));
          this.verMantPersona = false;
          console.log("entro:", this.mensajeController.resultado)
          this.mensajeController.resultado = res;
          console.log("res enviando:", res);
          this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        }
        else {
          this.verMantPersona = false;
          var mensajito;
          var confirmar;
          var cerrar;
          var validar = 0
          if (this.estaVacio(res.mensaje)) {
            mensajito = 'El token a expirado.'
            confirmar = 'Continuar con el registro'
            cerrar = 'Cerrar sesión'
            validar = 1
          } else {
            mensajito = res.mensaje;
            confirmar = 'Volver al registro'
            cerrar = 'Cerrar'
            validar = 2
          }
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: mensajito,
            showCancelButton: true,
            confirmButtonColor: '#094d74',
            cancelButtonColor: '#ffc72f',
            cancelButtonText: cerrar,
            confirmButtonText: confirmar
          }).then((result) => {
            if (result.isConfirmed) {
              this.verMantPersona = true;
              if (validar == 1) {
                this.nuevoToken(this.loginService)
              }
            } else {
              if (validar == 1) {
                sessionStorage.removeItem('access_user')
                sessionStorage.removeItem('access_user_token')
                sessionStorage.removeItem('access_menu')
                this.router.navigate(['/auth/login'])
              }

            }
          })
        }
      }).catch(error => error);
  }

  ServicioRegistrarEmpresa() {
    //this.dto.NombreCompleto = this.dto.Nombres;
    this.dto.NombreCompleto = `${this.dto.Nombres}`
    if (this.dto.IndicadorRetencion == " true") {
      console.log("Verdadero", this.dto.IndicadorRetencion)
      this.dto.IndicadorRetencion = "1";
    }
    else {
      console.log("Falso", this.dto.IndicadorRetencion)
      this.dto.IndicadorRetencion = "0";
    }

    if (this.esNumeroVacio(this.dto.DiaVencimiento)) {
      this.dto.DiaVencimiento = 0;
    }

    console.log("DTO INSERTANDO: ", this.dto);
    console.log("TOKEN: ", this.getUsuarioToken());
    this.personaService.mantenimientoMaestro(1, this.dto, this.getUsuarioToken()).then(
      res => {
        console.log("mantenimiento res", res)
        console.log("mantenimiento this.dto")
        if (res.success) {
          this.makeToast(this.getMensajeGrabado(this.dto.Documento));
          this.verMantPersona = false;
          this.mensajeController.resultado = res;
          this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        }
        else {
          this.verMantPersona = false;
          var mensajito;
          var confirmar;
          var cerrar;
          var validar = 0
          if (this.estaVacio(res.mensaje)) {
            mensajito = 'El token a expirado.'
            confirmar = 'Continuar con el registro'
            cerrar = 'Cerrar sesión'
            validar = 1
          } else {
            mensajito = res.mensaje;
            confirmar = 'Volver al registro'
            cerrar = 'Cerrar'
            validar = 2
          }
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: mensajito,
            showCancelButton: true,
            confirmButtonColor: '#094d74',
            cancelButtonColor: '#ffc72f',
            cancelButtonText: cerrar,
            confirmButtonText: confirmar
          }).then((result) => {
            if (result.isConfirmed) {
              this.verMantPersona = true;
              if (validar == 1) {
                this.nuevoToken(this.loginService)
              }
            } else {
              if (validar == 1) {
                sessionStorage.removeItem('access_user')
                sessionStorage.removeItem('access_user_token')
                sessionStorage.removeItem('access_menu')
                this.router.navigate(['/auth/login'])
              }
            }
          })
        }
      }).catch(error => error);
  }

  guardarPersona() {

    this.validarBooleanAFlagCampos();
    if (this.estaVacio(this.dto.TipoPersona)) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Seleccionar Persona.', life: 700 });
      return;
    }

    /**VALIDAR SI EL MENSAJE CONTROLADOR PIDE CREAR UN CLIENTE*/
    if (this.mensajeController.componente == "NUEVOCLIENTE" && this.esCliente == false) {
      this.messageShow('warn', 'Advertencia', 'La persona a crear no es un cliente');
      return;
    }
    /**VALIDAR SI EL MENSAJE CONTROLADOR PIDE CREAR UN CONYUGE*/
    if (this.mensajeController.componente == "NUEVOCONYUGE" && this.esCliente == false) {
      this.messageShow('warn', 'Advertencia', 'La persona a crear no es un cliente');
      return;
    }
    
    if (this.validarAccion == "NUEVO") {
      this.dto.IngresoFechaRegistro = new Date();
      this.dto.UltimaFechaModif = undefined;

      if (this.dto.TipoPersona == "J") {
        if (!this.validarCamposFormulario()) {
          if (this.estaVacio(this.dto.CorreoElectronico)) {
            this.verMantPersona = false;
            this.dto.IngresoUsuario = this.getUsuarioAuth().data[0].Usuario;
            Swal.fire({
              icon: 'warning',
              title: '¡Mensaje!',
              text: 'Registro sin correo. ¿Desea continuar?',
              showCancelButton: true,
              confirmButtonColor: '#094d74',
              cancelButtonColor: '#ffc72f',
              cancelButtonText: 'No, volver al registro',
              confirmButtonText: 'Sí, guardar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.ServicioRegistrarEmpresa();
              } else {
                this.verMantPersona = true;
              }
            })
          } else {
            if (this.esEmailValido(this.dto.CorreoElectronico)) {
              this.ServicioRegistrarEmpresa();
            }
          }
        }
      } else if (this.dto.TipoPersona == "N") {
        if (!this.validarCamposFormulario()) {
          if (this.dto.Documento.length >= 5) {
            if (this.estaVacio(this.dto.CorreoElectronico)) {
              this.dto.IngresoUsuario = this.getUsuarioAuth().data[0].Usuario;
              this.verMantPersona = false;
              Swal.fire({
                icon: 'warning',
                title: '¡Mensaje!',
                text: 'Registro sin correo. ¿Desea continuar?',
                showCancelButton: true,
                confirmButtonColor: '#094d74',
                cancelButtonColor: '#ffc72f',
                cancelButtonText: 'No, volver al registro',
                confirmButtonText: 'Sí, guardar'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.ServicioRegistrarPersona();
                } else {
                  this.verMantPersona = true;
                }
              })
            } else {
              if (this.esEmailValido(this.dto.CorreoElectronico)) {
                this.ServicioRegistrarPersona();
              }
            }
          }
        }
      }
    } else if (this.validarAccion == "EDITAR") {
      this.dto.UltimaFechaModif = new Date();
      if (this.dto.TipoPersona == "J") {
        if (this.dto.IndicadorRetencion == "true") {
          this.dto.IndicadorRetencion = "1";
        } else {
          this.dto.IndicadorRetencion = "0";
        }
        if (this.esNumeroVacio(this.dto.DiaVencimiento)) {
          this.dto.DiaVencimiento = 0;
        }
      }
      console.log("persona EDITAR", this.validarAccion);
      if (this.dto.TipoPersona == "J") {

        if (!this.validarCamposFormulario()) {

          if (this.estaVacio(this.dto.CorreoElectronico)) {
            this.verMantPersona = false;
            Swal.fire({
              icon: 'warning',
              title: '¡Mensaje!',
              text: 'Registro sin correo. ¿Desea continuar?',
              showCancelButton: true,
              confirmButtonColor: '#094d74',
              cancelButtonColor: '#ffc72f',
              cancelButtonText: 'No, volver al registro',
              confirmButtonText: 'Sí, guardar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.dto.NombreCompleto = this.dto.Nombres;
                console.log("dto a guardar:", this.dto);
                this.editarPersona(this.dto);
              } else {
                this.verMantPersona = true;
              }
            })
          } else {
            if (this.esEmailValido(this.dto.CorreoElectronico)) {
              this.dto.NombreCompleto = this.dto.Nombres;
              this.editarPersona(this.dto);
            }
          }

        }

      } else {
        console.log("guardar dto sss:", this.dto);
        // this.validarCamposFormulario();
        if (!this.validarCamposFormulario()) {
          if (this.dto.Documento.trim().length >= 5) {
            if (this.estaVacio(this.dto.CorreoElectronico)) {
              this.verMantPersona = false;
              Swal.fire({
                icon: 'warning',
                title: '¡Mensaje!',
                text: 'Registro sin correo. ¿Desea continuar?',
                showCancelButton: true,
                confirmButtonColor: '#094d74',
                cancelButtonColor: '#ffc72f',
                cancelButtonText: 'No, volver al registro',
                confirmButtonText: 'Sí, guardar'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.dto.NombreCompleto = `${this.dto.ApellidoPaterno} ${this.dto.ApellidoMaterno}, ${this.dto.Nombres}`
                  this.editarPersona(this.dto);
                } else {
                  this.verMantPersona = true;
                }
              });
            } else {
              if (this.esEmailValido(this.dto.CorreoElectronico)) {
                this.dto.CorreoElectronico = this.dto.CorreoElectronico.toUpperCase();
                this.dto.NombreCompleto = `${this.dto.ApellidoPaterno} ${this.dto.ApellidoMaterno}, ${this.dto.Nombres}`
                this.editarPersona(this.dto);
              }
            }
          }
        }
      }
    }
  }


  validarCamposFormulario() {
    var validar = false;
    if (this.dto.TipoPersona == "J") {

      if (this.validarIsNullCheckTipoPersona()) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Selecionar Tipo de Persona.', life: 700 });
        validar = true;
        console.log("VALIDA a validarCamposFormulario: 1");
      }

      if (this.estaVacio(this.dto.Nombres)) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar la Razón Social.', life: 700 });
        validar = true;
        console.log("VALIDA a Nombres: 2");
      }



      if (this.estaVacio(this.dto.Documento)) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar N° Documento.', life: 700 });
        validar = true;
        console.log("VALIDA a Documento: 4");
      }

      if (this.dto.Documento.trim().length != 11) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'El Ruc debe tener 11 caracteres.', life: 700 });
        validar = true;
        console.log("VALIDA a length: 5");
      }


      if (this.estaVacio(this.dto.Direccion)) {
        this.myDireccion.nativeElement.focus();
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar Dirección.', life: 700 });
        validar = true;
        console.log("VALIDA a Direccion: 6");
      }

      if (this.estaVacio(this.dto.Estado)) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar Estado.', life: 700 });
        validar = true;
        console.log("VALIDA a Estado: 7");
      }

      if (this.estaVacio(this.dto.Telefono)) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar Telefono.', life: 700 });
        validar = true;
        console.log("VALIDA a Telefono: 8");
      }

      console.log("VALIDA a validarCamposFormulario:", validar);

    } else if (this.dto.TipoPersona == "N") {

      if (this.validarIsNullCheckTipoPersona()) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Selecionar Tipo de Persona.', life: 700 });
        validar = true;
      }

      if (this.estaVacio(this.dto.TipoDocumento)) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Seleccionar Tipo de Documento.', life: 700 });
        validar = true;
      }

      if (this.estaVacio(this.dto.Documento)) {
        this.myDocumento.nativeElement.focus();
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar N° Documento.', life: 700 });
        validar = true;
      }
      else {

        if (this.dto.TipoDocumento == "D" || this.dto.TipoDocumento == "R") {
          if (!this.esNumero(this.dto.Documento.trim())) {
            this.myDocumento.nativeElement.focus();
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar Documento valido.', life: 700 });
            return;
          }
        }
      }

      if (this.estaVacio(this.dto.Nombres)) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar Nombre.', life: 700 });
        validar = true;
      }

      if (this.estaVacio(this.dto.ApellidoPaterno)) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar Apellido Paterno..', life: 700 });
        validar = true;
      }

      if (this.estaVacio(this.dto.ApellidoMaterno)) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar Apellido Materno.', life: 700 });
        validar = true;
      }

      if (this.esFechaVacia(this.dto.FechaNacimiento)) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar Fecha de Nacimiento.', life: 700 });
        validar = true;
      }

      if (this.estaVacio(this.dto.ApellidoMaterno)) {
        if (this.dto.TipoDocumento == "R") {
          this.myApellidoMaterno.nativeElement.focus();
          this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Seleccione Otro tipo de Documento.', life: 700 });
          validar = true;
        }
      }

      if (this.estaVacio(this.dto.Estado)) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Seleccionar el Estado.', life: 700 });
        validar = true;
      }

      if (this.estaVacio(this.dto.Telefono)) {
        this.myTelefono.nativeElement.focus();
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar Teléfono.', life: 700 });
        validar = true;
      }

      if (this.estaVacio(this.dto.Sexo)) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Seleccionar el Sexo.', life: 700 });
        validar = true;
      }

      // if(this.estaVacio(this.dto.Direccion)){
      //   this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar Dirección.', life: 700 });
      //   validar = true;
      // }

    }

    return validar;
  }


  esTelefesCeluValido(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
    if (!regex.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }


  validarInputDocumento(evento) {
    if (this.esNumero(evento.key)) {
      this.verDocumento = false;
    }
  }

  entrando(evento) {
    console.log(this.dto.Documento);
    console.log(evento);
    let key02
    if (this.dto.TipoDocumento == "R" || this.dto.TipoDocumento == "D") {
      key02 = evento.keyCode;
      key02 = String.fromCharCode(key02);
      console.log("key else 02", key02)
      const regex = /[A-Z]|\./;
      if (regex.test(this.dto.Documento)) {
        this.dto.Documento = null;
      }
    }
  }

  esRUCesDNIValido(event) {
    if (this.dto.TipoDocumento == "R" || this.dto.TipoDocumento == "D") {
      let key;
      console.log("event", event)
      if (event.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
        console.log("key if", key)
      } else {
        key = event.keyCode;
        key = String.fromCharCode(key);
        console.log("key else", key)
      }
      const regex = /[0-9]|\./;
      if (!regex.test(key)) {
        event.returnValue = false;
        if (event.preventDefault) {
          event.preventDefault();
          console.log("event.prevent", event.preventDefault());
        }
      }
    }
  }


  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }

  listarEstados() {
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstEstados.push({ label: 'Activo', value: "A" });
    this.lstEstados.push({ label: 'Inactivo', value: "I" });
    this.selectedEstado = "A";
  }

  listaComboTipoPersona() {
    this.lstTipoPersona.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOPERSONA").forEach(i => {
      this.lstTipoPersona.push({ label: i.Nombre, value: i.Codigo })
    });
  }


  selectedItemTipoDocumento(event) {
    this.selectedTipoDocuemento = event.value
    console.log("COMBO TIPO DOCUMENTO", this.selectedTipoDocuemento)
    if (this.selectedTipoDocuemento != "D") {
      this.verRuc = false;
      this.dto.Documento = null;
      this.verApeMat = false;
      this.verDocumento = false;
      this.ocultarApeMat = false;
      this.oculApeMatExt = true;
      if (this.selectedTipoDocuemento != "R") {
        this.validarmaxtexto = 15;
        this.validarmintexto = 5;
        if (this.selectedTipoDocuemento == "P") {
          this.validarmaxtexto = 12;
          this.validarmintexto = 5;
        }
        if (this.selectedTipoDocuemento == "Q") {
          this.validarmaxtexto = 9;
          this.validarmintexto = 9;
          this.ocultarApeMat = true;
          this.oculApeMatExt = false;
        }
      }
      else {
        if (this.estaVacio(this.dto.ApellidoMaterno)) {
          this.verApeMat = true;
        }
        this.ocultarApeMat = true;
        this.oculApeMatExt = false;
        this.validarmaxtexto = 11;
        this.validarmintexto = 11;
      }
    } else {
      if (this.estaVacio(this.dto.ApellidoMaterno)) {
        this.verApeMat = true;
      }
      this.verRuc = true;
      this.verDocumento = false;
      this.ocultarApeMat = true;
      this.oculApeMatExt = false;
      this.dto.Documento = null;
      this.validarmaxtexto = 8;
      this.validarmintexto = 8;
    }
    console.log("validartext", this.validarmaxtexto)
  }

  selectedItemFechaNacimiento(event) {
    this.selectedFechaNacimiento = new Date(event);
    let ahora = new Date();
    let fechanacimiento = new Date(this.selectedFechaNacimiento);
    let anios = ahora.getFullYear() - fechanacimiento.getFullYear();
    fechanacimiento.setFullYear(ahora.getFullYear());
    if (ahora < fechanacimiento) {
      --anios
    }
    this.dto.Edad = anios;
  }

  CalcularAnios() {
    let ahora = new Date();
    let fechanacimiento = new Date(this.dto.FechaNacimiento);
    let anios = ahora.getFullYear() - fechanacimiento.getFullYear();
    fechanacimiento.setFullYear(ahora.getFullYear());
    if (ahora < fechanacimiento) {
      --anios
    }
    this.dto.Edad = anios;
  }

  listaComboSexo() {
    this.lstSexo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "SEXO").forEach(i => {
      this.lstSexo.push({ label: i.Nombre.toUpperCase(), value: i.Codigo })
    });
  }

  listaComboTipoDocumento() {
    this.lstTipoDocumento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPODOCIDENTID").forEach(i => {
      this.lstTipoDocumento.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  listaComboTipoAdmision() {
    this.lstTipoAdmision.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOADMISION").forEach(i => {
      this.lstTipoAdmision.push({ label: i.Nombre, value: i.IdCodigo })
    });
  }

  listarComboDepartamento(): Promise<number> {
    this.lstDepartamento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    let departamento = { Num: 1 }
    return this.personaService.listarUbigeo(departamento).then(res => {
      res.forEach(e => {
        this.lstDepartamento.push({ label: e.Nombre, value: e.Codigo });
      });
      return 1;
    });
  }

  selectedItemDepartamento(event) {
    console.log("event departamento", event);
    this.selectedDepartamento = event.value;
    this.lstProvincia = []
    this.lstDistrito = []
    this.listarComboProvincia(this.selectedDepartamento);
  }

  listarComboProvincia(codigo: string): Promise<number> {
    this.lstProvincia = [];
    this.lstProvincia.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    let provincia = { Num: 2, Codigo: codigo }
    return this.personaService.listarUbigeo(provincia).then(res => {
      res.forEach(e => {
        this.lstProvincia.push({ label: e.Nombre, value: e.Codigo });
      });
      return 1;
    });
  }

  selectedItemProvincia(event) {
    this.selectedProvincia = null;
    this.selectedProvincia = event.value;
    // this.lstDistrito = []
    if (this.estaVacio(this.selectedDepartamento)) {
      this.selectedDepartamento = this.dto.DEPARTAMENTO;
    }
    this.listarComboDistrito(this.selectedDepartamento + this.selectedProvincia);
  }

  selectedItemEstado(event) {
    this.selectedEstado = null;
    this.selectedEstado = event.value;
    // this.lstDistrito = []
    if (this.estaVacio(this.selectedEstado)) {
      this.verValidarEstado = true;
    } else {
      this.verValidarEstado = false;
    }
  }

  listarComboDistrito(codigo: string): Promise<number> {
    this.lstDistrito = [];
    this.lstDistrito.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    let distrito = { Num: 3, Codigo: codigo }
    console.log("::: distrito payload", distrito)
    return this.personaService.listarUbigeo(distrito).then(res => {
      console.log("::: distrito response", res)
      res.forEach(e => {
        this.lstDistrito.push({ label: e.Nombre, value: e.Codigo });
      });
      return 1;
    });

  }

  checkesCliente() {
    this.verValidarTipoPersona = false;
  }

  checkesProveedor() {
    this.verValidarTipoPersona = false;
  }

  checkesEmpleado() {
    this.verValidarTipoPersona = false;
  }

  checkesOtro() {
    this.verValidarTipoPersona = false;
  }

  checkesRetencion() {
    this.verValidarTipoPersona = false;
  }


  validarBooleanAFlagCampos() {
    this.dto.EsCliente = this.booleanAFlag(this.esCliente);
    this.dto.EsProveedor = this.booleanAFlag(this.esProveedor);
    this.dto.EsEmpleado = this.booleanAFlag(this.esEmpleado);
    this.dto.EsOtro = this.booleanAFlag(this.esOtro);

  }

  validarflagABooleanCampos(dto: any) {
    this.esCliente = this.flagABoolean(dto.EsCliente);
    this.esProveedor = this.flagABoolean(dto.EsProveedor);
    this.esEmpleado = this.flagABoolean(dto.EsEmpleado);
  }

  validarIsNullCheckTipoPersona(): boolean {
    if (this.dto.EsCliente == 'N' && this.dto.EsProveedor == 'N' &&
      this.dto.EsEmpleado == 'N' && this.dto.EsOtro == 'N') {
      console.log("entro validar true");
      return true;
    } else {
      console.log("entro validar false");
      return false;
    }

  }


  //Metodo para limpiar formulario
  btnCerrar() {

    this.lstProvincia = [];
    this.lstDistrito = [];

    this.lstProvincia.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstDistrito.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    this.esCliente = false;
    this.esProveedor = false;
    this.esEmpleado = false;
    this.esOtro = false;

    this.fechaCreacion = undefined;
    this.fechaModificacion = undefined;
  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

}
