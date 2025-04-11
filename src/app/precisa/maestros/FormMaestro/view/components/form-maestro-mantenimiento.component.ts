import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { LazyLoadEvent, SelectItem, TreeNode } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../../util/ComponenteBasePrincipa';
import { AppSatate } from '../../../app.reducer';
import * as actions from '../../store/actions';
import { Subscription } from 'rxjs';
import { NodeMaestro } from '../../model/node-maestro';
import { Maestro } from '../../model/maestro';
import { MaestroService } from '../../service/maestro.service';
import { User, UsuarioAuth } from '../../../../auth/model/usuario';
import { Console } from 'console';
import Swal from 'sweetalert2';
import { AuditoriaComponent } from '../../../../../@theme/components/auditoria/auditoria.component';

@Component({
  selector: 'ngx-form-maestro-mantenimiento',
  templateUrl: './form-maestro-mantenimiento.component.html'
})

export class FormMaestroMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {

  @ViewChild(AuditoriaComponent, { static: false }) auditoriaComponent: AuditoriaComponent;
  acciones: string = ''
  validarAccion: string = ''
  position: string = 'top'
  form: any;
  @Output() obtenerSecuencia = new EventEmitter()
  lstEstados: SelectItem[] = []

  dto:Maestro= new Maestro();

  nodeMaestro : NodeMaestro = new NodeMaestro()
  dataArray: string[] = [];
  loading: boolean = false
  maestroDetalle: Subscription;
  // usuario: string;
  user : User = new User();
  usuarioAuth : UsuarioAuth = new UsuarioAuth();

  constructor(
    private store: Store<AppSatate>,
    private toastrService: NbToastrService,
    private maestroService: MaestroService,
    private formBuilder: FormBuilder) {
    super();
  }


/*   
ngOnDestroy(): void {
    this.maestroDetalle.unsubscribe()
  }
 */

  ngOnInit(): void {
    
 //   this.buildForm()
    this.cargarEstados();
  }

  /*    VALIDATORS    */
  buildForm() {
    this.form = this.formBuilder.group({
      tipousuario: ['', []],
      Perfil: ['', [Validators.required, Validators.maxLength(200)]],
      VaEstado: ['A', [Validators.required]],
      UltimoUsuario:[],
      estado:[],
    });

  }

  iniciarComponente(accion: string, product?: Maestro) {
    this.validarAccion = accion;
    // this.store.dispatch(actions.cargarLista())

    if (accion == "NUEVO") {
/*       this.dto = new Maestro();  
      this.dto.UsuarioCreacion = this.getUsuario().UsuarioRed;
      let fechaC = new Date()
      this.dto.FechaCreacion = fechaC
      this.buildForm() */
      this.cargarAcciones(accion)

    } else if (accion == "EDITAR") {
      this.cargarAcciones(accion, product)
      
    }
    else if (accion == "VER") {
      this.cargarAcciones(accion, product)
    }

  }


  
 saveProduct(event: Event) {
 
    // event.preventDefault();
    // if (!this.puedeEditar) {
      //if (this.form.valid) {
        if ( this.validarAccion == "EDITAR") {
          let fechaM = new Date();
          this.dto.FechaModificacion = fechaM;
          this.maestroService.mantenimientoMaestro(2, this.dto, this.getUsuarioToken()).then(
            res=> {
             if(res.success){
              this.dialog = false;
              this.makeToast(this.getMensajeActualizado(res.valor))
             }else{
              this.dialog = false;              
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${res.mensaje}`
              })
             }
            }
          ).catch(error=>error)  
        }
        else if(this.validarAccion == "NUEVO"){
          this.maestroService.mantenimientoMaestro(1, this.dto, this.getUsuarioToken()).then(
            res=> {
               if(res.success){
                this.makeToast(this.getMensajeGrabado(res.data.CodigoTabla))
                this.dialog = false;
               }else{
                  this.dialog = false;
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${res.mensaje}`
                  })
               }
            })
        }
      //}
    // }
  }

  lineaGenerada: string
  generarSecuencia(): string {
    this.obtenerSecuencia.emit();
    return this.lineaGenerada
  }

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }

  getUsuario() : User {
    let userStorage = JSON.parse(sessionStorage.getItem('access_user'))
    return this.user = userStorage.user[0];
  }



  cargarEstados(){
    this.lstEstados.push({ label: "Seleccione", value: null });      

          this.lstEstados.push({ label: 'Activo', value: 1 });

          this.lstEstados.push({ label: 'Inactivo', value: 2 });
  }
  
  cargarAcciones(accion: string, product?: any) {
    this.acciones = accion;
    if (accion == "NUEVO") {
      this.dialog = true;
      this.puedeEditar = false;
      this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].NombreCompleto.trim();
      this.dto.FechaCreacion = new Date();
      this.dto.FechaModificacion = undefined;
    } else if (accion == "VER") {
      this.dto=product;
      let fechaC = new Date(this.dto.FechaCreacion)
      let fechaM = new Date(this.dto.FechaModificacion)
      this.dto.FechaCreacion = fechaC
      this.dto.FechaModificacion = fechaM
      this.dialog = true;
      this.puedeEditar = true
    } else if (accion == "EDITAR") {
      this.dto=product;
      console.log("dto:",this.dto);
      let fechaC = new Date(this.dto.FechaCreacion)
      this.dto.FechaCreacion = fechaC
      this.dialog = true;
      this.puedeEditar = false
    }
  }
}
