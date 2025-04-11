import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UISelectorController } from '../../../../../util/UISelectorController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { LoginService } from '../../../auth/service/login.service';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { PersonaService } from '../../Persona/servicio/persona.service';
import { dtoaseguradora } from '../dominio/dto/dtoaseguradora';
import { AseguradoraService } from '../servicio/aseguradora.service';
@Component({
  selector: 'ngx-aseguradora-mantenimiento',
  templateUrl: './aseguradora-mantenimiento.component.html'
})
export class AseguradoraMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, UISelectorController {


  lstEstados: SelectItem[] = [];
  verMantAseguradora: boolean = false;
  verLabelId: boolean = false;
  dto: dtoaseguradora = new dtoaseguradora();
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string;
  lstTipoAseguradora: SelectItem[] = [];
  validarAse: FormGroup
  editarCampos: boolean = false;
  validarAseg: FormGroup


  constructor(
    public loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private aseguradoraService: AseguradoraService,
    private toastrService: NbToastrService,
  ) { super(); }

  ngOnInit(): void {
    this.titulo = '';
    const p1 = this.listarEstados();
    const p2 = this.listacomboTipoAseguradora();

    this.ValidarAseguradora();
    Promise.all([p1, p2]).then(resp => {

    });

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
    this.verMantAseguradora = false;
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


  coreIniciarComponente(mensaje: MensajeController): void {
    this.mensajeController = mensaje;
    console.log("ENTRO NUEVO COMPONENTE", this.mensajeController);
    this.verMantAseguradora = true;
    this.titulo = 'ASEGURADORA';
    this.acciones = `${this.titulo}: ${this.mensajeController.tipo}`;
  }



  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, dtoEditAsegura?: any): void {

    sessionStorage.setItem('filtrosAseguradora', JSON.stringify(dtoEditAsegura));
    this.verMantAseguradora = true;
    this.mensajeController = mensaje;
    this.titulo = 'ASEGURADORA';
    this.acciones = `${this.titulo}: ${accionform}`;
    this.validarAccion = accionform;
    if (accionform == "NUEVO") {
      this.dto = new dtoaseguradora();
      this.editarCampos = false;
      this.verLabelId = false;
      this.ValidarAseguradora();
    } else if (accionform == "EDITAR") {
      this.editarCampos = false;
      this.verLabelId = true;
      this.dto = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('filtrosAseguradora')));
      // this.dto = dtoEditAsegura;
      this.ValidarAseguradora();
    } else if (accionform == "VER") {
      this.editarCampos = true;
      this.verLabelId = true;
      this.dto = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('filtrosAseguradora')));
      // this.dto = dtoEditAsegura;
      this.ValidarAseguradora();
    }

  }



  guardaraseguradora() {
    if (this.validarAseg.valid) {
      if (this.validarAccion == "NUEVO") {

        this.aseguradoraService.mantenimientoMaestro(1, this.dto, this.getUsuarioToken()).then(
          res => {
            if (res.success) {
              this.makeToast(this.getMensajeGrabado(this.dto.IdAseguradora));
              this.verMantAseguradora = false;
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            } 
            else {
              this.verMantAseguradora = false;
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
                  this.verMantAseguradora = true;
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

        let fechaM = new Date();
        // this.dto.FechaModificacion = fechaM;
        this.aseguradoraService.mantenimientoMaestro(2, this.dto, this.getUsuarioToken()).then(
          res => {
            if (res.success) {
              this.verMantAseguradora = false;
              this.makeToast(this.getMensajeActualizado(this.dto.IdAseguradora))
              this.mensajeController.resultado = this.dto.IdAseguradora;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            } 
            else {
              this.verMantAseguradora = false;
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
                  this.verMantAseguradora = true;
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
      this.validarAseg.markAllAsTouched();
    }
  }

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }

  listarEstados() {
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstEstados.push({ label: 'Activo', value: 1 });
    this.lstEstados.push({ label: 'Inactivo', value: 2 });
  }


  listacomboTipoAseguradora() {
    this.lstTipoAseguradora.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPASE").forEach(i => {
      this.lstTipoAseguradora.push({ label: i.Nombre, value: i.IdCodigo })
    });
  }

  ValidarAseguradora() {
    this.validarAseg = this.formBuilder.group({
      nombreAseguradora: [{ value: '', disabled: this.editarCampos }, [Validators.required, Validators.maxLength(200)]],
      tipoAseguradora: [{ value: '', disabled: this.editarCampos }, Validators.required],
      id: [{ value: '', disabled: true }],
      // observaciones: [{value: '', disabled : this.editarCampos}, [Validators.required, Validators.maxLength(200)]],
      estado: [{ value: '', disabled: this.editarCampos }, Validators.required]
    })
  }

  get nombreAseguradoraField() {
    return this.validarAseg.get('nombreAseguradora');
  }

  get tipoAseguradoraField() {
    return this.validarAseg.get('tipoAseguradora');
  }

  // get observacionesField() {
  //   return this.validarAseg.get('observaciones');
  // }

  get estadoField() {
    return this.validarAseg.get('estado');
  }




}
