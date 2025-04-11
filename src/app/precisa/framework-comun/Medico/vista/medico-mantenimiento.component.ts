import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UISelectorController } from '../../../../../util/UISelectorController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { dtoMedico } from '../dominio/dto/dtomedico';
import { MedicoService } from '../servicio/medico.service';
import { PersonaService } from '../../Persona/servicio/persona.service';
import { Router } from '@angular/router';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { LoginService } from '../../../auth/service/login.service';
@Component({
  selector: 'ngx-medico-mantenimiento',
  templateUrl: './medico-mantenimiento.component.html'
})
export class MedicoMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, UISelectorController {


  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  Auth = this.getUsuarioAuth().data;

  lstEstado: SelectItem[] = [];
  lstSexo: SelectItem[] = [];
  lstespecialidad: SelectItem[] = [];
  verMantMedico: boolean = false;
  verLabelId: boolean = false;
  ocultarLabelId: boolean = false;

  dto: dtoMedico = new dtoMedico;
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string;
  editarCampos: boolean = false;
  validarMed: FormGroup


  constructor(
    private personaService: PersonaService,
    public loginService: LoginService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private medicoService: MedicoService,
    private toastrService: NbToastrService,
  ) { super(); }



  ngOnInit(): void {
    this.titulo = '';
    const p1 = this.comboCargarDatos();
    const p2 = this.cargarEstados();
    const p3 = this.listaComboSexo();


    Promise.all([p1, p2, p3]).then(
      f => {

      });


  }

  saveData() {  //prueba validar med del value esto si se puede borar
    console.log("save data", this.validarMed.value);
  }

  ValidarMedico() {

    this.validarMed = this.formBuilder.group({
      apePat: [{ value: this.dto.ApellidoPaterno, disabled: this.editarCampos }, [Validators.required, Validators.maxLength(50)]],
      apeMat: [{ value: '', disabled: this.editarCampos }, [Validators.required, Validators.maxLength(50)]],
      dni: [{ value: '', disabled: this.editarCampos }, [Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^\d+$/)]],
      correo: [{ value: '', disabled: this.editarCampos }, [Validators.maxLength(50), Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0,9]{1,3}\.[0-9]{1,3}\.[0,9]{1,3}\])|(([a-zA-z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )]],
      regColMed: [{ value: '', disabled: this.editarCampos }, [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^\d+$/)]],
      nombres: [{ value: '', disabled: this.editarCampos }, [Validators.required, Validators.maxLength(100)]],
      telf: [{ value: '', disabled: this.editarCampos }, [Validators.pattern(/^\d+$/), Validators.minLength(7), Validators.maxLength(15)]],
      regNaEs: [{ value: '', disabled: this.editarCampos }],
      sexo: [{ value: '', disabled: this.editarCampos }],
      id: [{ value: '', disabled: true }],
      espe: [{ value: '', disabled: this.editarCampos }],
      estado: [{ value: '', disabled: this.editarCampos }, Validators.required]
    })
  }


  get dniField() {
    return this.validarMed.get('dni');
  }

  get apePatField() {
    return this.validarMed.get('apePat');
  }

  get apeMatField() {
    return this.validarMed.get('apeMat');
  }

  get correoField() {
    return this.validarMed.get('correo');
  }
  get regColMedField() {
    return this.validarMed.get('regColMed');
  }
  get telfField() {
    return this.validarMed.get('telf');
  }

  get nombresField() {
    return this.validarMed.get('nombres');
  }

  get estadoField() {
    return this.validarMed.get('estado');
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
    this.verMantMedico = false;
  }

  coreSeleccionar(dto: any): void {
    this.mensajeController.resultado = dto;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    this.coreSalir();
  }

  coreIniciarComponente(mensaje: MensajeController): void {
    this.mensajeController = mensaje;
    console.log("ENTRO NUEVO COMPONENTE", this.mensajeController);
    this.verMantMedico = true;
    this.titulo = 'MEDICO';
    this.acciones = `${this.titulo}: ${this.mensajeController.tipo}`;
  }

  auditoria(filtro?: any, accion?: string) {
    console.log("Med auditoria", filtro)
    if (accion == "NUEVO" || this.estaVacio(filtro.UsuarioCreacion)) {
      this.fechaCreacion = new Date();
      this.usuario = this.Auth[0].NombreCompleto;
      this.fechaModificacion = new Date();
    } else {
      if (this.esNumero(filtro.UsuarioCreacion.trim())) {

        console.log("filtro", filtro)
        // var dtopersona   filtro.UsuarioCreacion.trim(),
        let Documento = {
          Documento: filtro.UsuarioCreacion.trim(),
          tipopersona: "USU",
          SoloBeneficiarios: "-1",
          UneuNegocioId: "-1"
        }
        return this.personaService.listaPersonaUsuario(Documento).then((res) => {  
          console.log("Med Nombre auditoria", res)
          if(res.length>0){
            this.usuario = res[0].NombreCompleto;
            this.fechaCreacion = new Date(filtro.FechaCreacion);
            if (this.esFechaVacia(filtro.FechaModificacion)) {
              this.fechaModificacion = null;
              // this.fechaModificacion = new Date();
            } else {
              this.fechaModificacion = new Date(filtro.FechaModificacion);
            }
            console.log("mostrar auditoria", this.usuario, this.fechaCreacion, this.fechaModificacion)
          }
        })
      } else {
        this.usuario = filtro.UsuarioCreacion.trim();
        if (this.esFechaVacia(filtro.FechaModificacion)) {
          this.fechaCreacion = new Date();
          // this.fechaModificacion = new Date();
        } else {
          this.fechaModificacion = new Date(filtro.FechaModificacion);
        }

        if (this.esFechaVacia(filtro.FechaModificacion)) {
          this.fechaModificacion = null;
          // this.fechaModificacion = new Date();
        } else {
          this.fechaModificacion = new Date(filtro.FechaModificacion);
        }

        // this.usuario = filtro.UsuarioCreacion;
        // this.fechaCreacion = new Date(filtro.FechaCreacion);
        // this.fechaModificacion = new Date(filtro.FechaModificacion);
      }

    }
  }

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, dtoEditMedico?: any): void {
    console.log("Medico coreIniciarComponentemantenimiento", accionform);
    sessionStorage.setItem('filtrosMedico', JSON.stringify(dtoEditMedico));
    this.auditoria(dtoEditMedico, accionform);
    this.verMantMedico = true;
    this.mensajeController = mensaje;
    this.titulo = 'MEDICO';
    this.acciones = `${this.titulo}: ${accionform}`;
    this.validarAccion = accionform;

    if (accionform == "NUEVO") {
      this.dto = new dtoMedico();
      console.log("DTO MAL:", this.dto);
      this.editarCampos = false;
      this.verLabelId = false;
      this.ocultarLabelId = true;
      this.ValidarMedico();
      // this.saveData();
    } else if (accionform == "EDITAR") {
      // this.dto=mensaje.componenteDestino.dtoEditMedico;      
      this.editarCampos = false;
      this.verLabelId = true;
      this.ocultarLabelId = false;
      this.dto = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('filtrosMedico')));
      // this.dto = dtoEditMedico;
      this.dto.Documento = dtoEditMedico.Documento.trim();
      this.ValidarMedico();
      // this.saveData();
    } else if (accionform == "VER") {
      this.editarCampos = true;
      this.verLabelId = true;
      this.ocultarLabelId = false;
      this.dto = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('filtrosMedico')));
      // this.dto = dtoEditMedico;
      this.ValidarMedico();
      // this.saveData();
    }

  }



  guardarmedico() {
    if (this.validarMed.valid) {
      if (this.estaVacio(this.dto.Correo)) {
        this.verMantMedico = false;
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
            if (this.validarAccion == "NUEVO") {
              // if (this.dto.Documento.trim() == '') {
              //   this.dto.Documento = null;
              // }
              this.dto.Busqueda = this.dto.ApellidoPaterno + " " + this.dto.ApellidoMaterno + " " + this.dto.Nombres;
              this.dto.TipoDocumento = "D";
              this.dto.IpCreacion = this.getIp();
              this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
              console.log("data del dto medico", this.dto);
              this.medicoService.mantenimientoMaestro(1, this.dto, this.getUsuarioToken()).then(
                res => {

                  if (res.success) {
                    this.makeToast(this.getMensajeGrabado(res.data.MedicoId));
                    this.verMantMedico = false;
                    this.mensajeController.resultado = res;
                    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                    // this.dto.MedicoId = res.data.MedicoId;
                  }
                  else {
                    this.verMantMedico = false;
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
                        this.verMantMedico = true;
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
                });


            } else if (this.validarAccion == "EDITAR") {
              // if (this.estaVacio(this.dto.Documento)) {
              //   this.dto.Documento = null;
              //   // this.dto.Documento = this.dto.MedicoId.toString();
              // }
              this.dto.Busqueda = this.dto.ApellidoPaterno + " " + this.dto.ApellidoMaterno + " " + this.dto.Nombres;
              this.dto.TipoDocumento = "D";
              this.dto.IpModificacion = this.getIp();
              this.dto.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
              this.medicoService.mantenimientoMaestro(2, this.dto, this.getUsuarioToken()).then(
                res => {
                  console.log("res", res)
                  if (res.success) {
                    this.verMantMedico = false;
                    this.makeToast(this.getMensajeActualizado(this.dto.MedicoId))
                    this.mensajeController.resultado = this.dto.MedicoId;
                    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                  }
                  else {
                    this.verMantMedico = false;
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
                        this.verMantMedico = true;
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
          } else {
            this.verMantMedico = true;
          }
        })


      } else {
        if (this.esEmailValido(this.dto.Correo)) {
          if (this.validarAccion == "NUEVO") {
            if (this.estaVacio(this.dto.Documento)) {
              this.dto.Documento = null;
            }
            this.dto.Busqueda = this.dto.ApellidoPaterno + " " + this.dto.ApellidoMaterno + " " + this.dto.Nombres;
            this.dto.TipoDocumento = "D";
            this.medicoService.mantenimientoMaestro(1, this.dto, this.getUsuarioToken()).then(
              res => {
                console.log("data del res medico", res);
                if (res.success) {
                  this.makeToast(this.getMensajeGrabado(res.data.MedicoId));
                  this.verMantMedico = false;
                  this.mensajeController.resultado = res;
                  this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                  // this.dto.MedicoId = res.data.MedicoId;
                }
                else {
                  this.verMantMedico = false;
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
                      this.verMantMedico = true;
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
              });


          } else if (this.validarAccion == "EDITAR") {
            if (this.estaVacio(this.dto.Documento)) {
              this.dto.Documento = null;
            }
            this.dto.Busqueda = this.dto.ApellidoPaterno + " " + this.dto.ApellidoMaterno + " " + this.dto.Nombres;
            this.dto.TipoDocumento = "D";
            this.medicoService.mantenimientoMaestro(2, this.dto, this.getUsuarioToken()).then(
              res => {
                console.log("res", res)
                if (res.success) {
                  this.verMantMedico = false;
                  this.makeToast(this.getMensajeActualizado(this.dto.MedicoId))
                }
                else {
                  this.verMantMedico = false;
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
                      this.verMantMedico = true;
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
        }
      }

    } else {
      this.validarMed.markAllAsTouched();
    }
  }


  esCMPValido(event) {
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

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }

  listaComboSexo() {
    this.lstSexo.push({ label: ConstanteAngular.COMBOSEXO, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "SEXO").forEach(i => {
      this.lstSexo.push({ label: i.Nombre, value: i.Codigo })
    });
  }


  cargarEstados() {
    this.lstEstado.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstEstado.push({ label: 'Activo', value: 1 });
    this.lstEstado.push({ label: 'Inactivo', value: 2 });
  }

  comboCargarDatos(){
    var lstComboprocedencia = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_Procendencia')));    
    if (!this.esListaVacia(lstComboprocedencia)){
        this.lstespecialidad.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
        lstComboprocedencia.forEach(e => {
        this.lstespecialidad.push({ label: e.Nombre, value: e.IdEspecialidad });   
        });
        console.log("Medico Mant lstespecialidad:",  this.lstespecialidad);
      } 
  }

  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreMensaje(mensage: MensajeController): void {

  }


  coreAccion(accion: string): void {
    throw new Error('Method not implemented.');
  }



  saveProduct() {

  }



}
