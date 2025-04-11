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
import { PersonaService } from '../../Persona/servicio/persona.service';
import { id } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { LoginService } from '../../../auth/service/login.service';
@Component({
  selector: 'ngx-cajapago',
  templateUrl: './cajapago.component.html'
})
export class CajaPagoComponent extends ComponenteBasePrincipal implements OnInit, UISelectorController {


  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  Auth = this.getUsuarioAuth().data;

  lstEstado: SelectItem[] = [];
  lstSexo: SelectItem[] = [];
  lstespecialidad: SelectItem[] = [];
  verCajapago: boolean = false;
  verLabelId: boolean = false;
  ocultarLabelId: boolean = false;

  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string;
  editarCampos: boolean = false;
  validarMed: FormGroup

  MontoPago: any;
  cantidadSoles: any;
  valorSoles: any;
  totalEfectivo: any;
  vueltoEfectivo: any;

  constructor(
    private personaService: PersonaService,
    public loginService: LoginService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: NbToastrService,
  ) { super(); }



  ngOnInit(): void {
    this.titulo = '';
    const p2 = this.cargarEstados();
    const p3 = this.listaComboSexo();


    Promise.all([p2, p3]).then(
      f => {

      });


  }

  saveData() {  //prueba validar med del value esto si se puede borar
    console.log("save data", this.validarMed.value);
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
    this.verCajapago = false;
  }

  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {


      this.valorSoles = this.cantidadSoles;
      this.totalEfectivo = this.valorSoles;
      this.vueltoEfectivo = this.MontoPago - this.totalEfectivo;
    }
  }

  coreSeleccionar(dto: any): void {
    this.mensajeController.resultado = dto;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    this.coreSalir();
  }

  coreIniciarComponente(mensaje: MensajeController): void {
    this.mensajeController = mensaje;
    console.log("ENTRO NUEVO COMPONENTE", this.mensajeController);
    this.verCajapago = true;
    this.titulo = 'PAGO PARTICULAR';
    this.acciones = `${this.titulo}: ${this.mensajeController.tipo}`;
  }

  auditoria(filtro?: any, accion?: string) {
    // this.usuario = "";
    if (accion == "NUEVO" || this.estaVacio(filtro.UsuarioCreacion)) {
      this.fechaCreacion = new Date();
      this.usuario = this.Auth[0].NombreCompleto;
      this.fechaModificacion = new Date();
    } else {
      if (this.esNumero(filtro.UsuarioCreacion.trim())) {

        console.log("filtro", filtro)
        // var dtopersona
        // dtopersona = filtro.IngresoUsuario;
        let dto = {
          Documento: filtro.UsuarioCreacion.trim(),
          tipopersona: "P",
          SoloBeneficiarios: "-1",
          UneuNegocioId: "-1"
        }
        // console.log("dtopersona", dtopersona)
        return this.personaService.listaPersonaUsuario(dto).then((res) => {
          console.log("mostrar usuario", res)
          this.usuario = res[0].NombreCompleto;
          this.fechaCreacion = new Date(filtro.FechaCreacion);
          if (this.esFechaVacia(filtro.FechaModificacion)) {
            this.fechaModificacion = null;
            // this.fechaModificacion = new Date();
          } else {
            this.fechaModificacion = new Date(filtro.FechaModificacion);
          }
          console.log("mostrar auditoria", this.usuario, this.fechaCreacion, this.fechaModificacion)
        })
      } else {
        this.usuario = filtro.UsuarioCreacion.trim();
        if (this.esFechaVacia(filtro.FechaModificacion)) {
          this.fechaCreacion = new Date();
        } else {
          this.fechaModificacion = new Date(filtro.FechaModificacion);
        }

        if (this.esFechaVacia(filtro.FechaModificacion)) {
          this.fechaModificacion = null;
        } else {
          this.fechaModificacion = new Date(filtro.FechaModificacion);
        }
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
