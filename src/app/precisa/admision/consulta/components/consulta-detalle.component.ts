import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UISelectorController } from '../../../../../util/UISelectorController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { LoginService } from '../../../auth/service/login.service';
import { dtoPersona } from '../../../framework-comun/Persona/dominio/dto/dtoPersona';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { PersonaMantenimientoComponent } from '../../../framework-comun/Persona/vista/persona-mantenimiento.component';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { Admision, ConsultaDetalleAdmision } from '../dominio/dto/DtoConsultaAdmision';
import { FiltroConsultaAdmision, FiltroTipoOperacion } from '../dominio/filtro/FiltroConsultaAdmision';
import { ConsultaAdmisionService } from '../servicio/consulta-admision.service';
@Component({
  selector: 'ngx-consulta-detalle',
  templateUrl: './consulta-detalle.component.html',
  styleUrls: ['./consulta-detalle.component.scss']
})
export class ConsultaDetalleComponent extends ComponenteBasePrincipal implements OnInit, UISelectorController {
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;

  bscPersona: dtoPersona = new dtoPersona();
  validarIdAdmision: number = 0;
  lstSexo: SelectItem[] = [];
  bloquearPag: boolean;
  lstsedes: SelectItem[] = []
  lstTipoOperacion: SelectItem[] = [];
  lstTipoOrden: SelectItem[] = [];
  lstTipoAtencion: SelectItem[] = [];
  lstprocedencia: SelectItem[] = [];
  verConsultaDetalle: boolean = false;
  cantidad: number = 0;
  operacion: FiltroTipoOperacion = new FiltroTipoOperacion();
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string;
  editarCampos: boolean = true;
  dto: Admision = new Admision();
  filtro: ConsultaDetalleAdmision = new ConsultaDetalleAdmision();
  lstListarDetalle: ConsultaDetalleAdmision[] = [];
  selectedSede = "";
  lastYearTotal: number;

  Auth = this.getUsuarioAuth().data;

  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  constructor(
    private consultaAdmisionService: ConsultaAdmisionService,
    private loginService: LoginService,
    private personaService: PersonaService,
    private toastrService: NbToastrService
  ) { super(); }


  ngOnInit(): void {
    this.titulo = '';
    const p1 = this.comboCargarSedes();
    Promise.all([p1]).then(
      f => {

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
    this.verConsultaDetalle = false;
  }

  coreSeleccionar(dto: any): void {
    console.log("coreSeleccionar", this.dto);
    this.mensajeController.resultado = dto;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    this.coreSalir();
  }

  coreIniciarComponente(mensaje: MensajeController): void {
    this.mensajeController = mensaje;
    console.log("DETALLE ENTRO coreIniciarComponente", this.mensajeController);
    this.verConsultaDetalle = true;
    this.acciones = `${this.titulo}: ${this.mensajeController.tipo}`;
  }

  coreIniciarComponenteDetalle(mensaje: MensajeController, accionform: string, dtoConsultaDet?: any): void {
    this.filtro = new ConsultaDetalleAdmision();
    this.validarIdAdmision = 0;
    this.mensajeController = mensaje;
    console.log("DETALLE ENTRO coreIniciarComponenteDetalle", this.mensajeController);
    this.verConsultaDetalle = true;
    this.titulo = 'DETALLE DE ADMISION';
    this.acciones = this.titulo + ":" + accionform;
    this.validarAccion = accionform;
    console.log("validar admision:", this.validarIdAdmision);
    console.log("id admision:", dtoConsultaDet.IdAdmision);

    if (this.validarIdAdmision != dtoConsultaDet.IdAdmision) {
      if (accionform == "DETALLE") {
        this.dto.IdSede = null;
        this.lstListarDetalle = [];
        this.ListadoAdmisionConstancia(dtoConsultaDet);
      }
    }
  }


  auditoria(filtro?: any) {
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
    this.fechaCreacion = new Date();
    this.fechaModificacion = new Date();
    console.log("mostrar auditoria comparacion", this.getUsuarioAuth().data[0].Usuario, filtro.UsuarioCreacion, filtro.UsuarioModificacion)
    if (this.estaVacio(filtro.UsuarioModificacion)) {
      console.log("UsuarioModificacion Vacío")
      if (filtro.UsuarioCreacion == this.getUsuarioAuth().data[0].Usuario) {
        console.log("UsuarioCreacion Igual a UsuarioLogeado")
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
        this.fechaCreacion = new Date(filtro.FechaCreacion);
        if (this.esFechaVacia(filtro.FechaModificacion)) {
          this.fechaModificacion = new Date();
        } else {
          this.fechaModificacion = new Date(filtro.FechaModificacion);
        }
      } else {
        console.log("Traer Usuario Creado Nuevo")
        let dto = {
          Documento: filtro.UsuarioCreacion.trim(),
          tipopersona: "P",
          SoloBeneficiarios: "-1",
          UneuNegocioId: "-1"
        }
        return this.personaService.listaPersonaUsuario(dto).then((res) => {
          this.usuario = res[0].NombreCompleto;
          this.fechaCreacion = new Date(filtro.FechaCreacion);
          if (this.esFechaVacia(filtro.FechaModificacion)) {
            this.fechaModificacion = new Date();
          } else {
            this.fechaModificacion = new Date(filtro.FechaModificacion);
          }
          console.log("mostrar auditoria", this.usuario, this.fechaCreacion, this.fechaModificacion)
        })
      }
    } else {
      console.log("Usuario Modificado Lleno")
      if (filtro.UsuarioModificacion == this.getUsuarioAuth().data[0].Usuario) {
        console.log("Usuario Modificado Igual a Usuario Logeado")
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
        this.fechaCreacion = new Date(filtro.FechaCreacion);
        if (this.esFechaVacia(filtro.FechaModificacion)) {
          this.fechaModificacion = new Date();
        } else {
          this.fechaModificacion = new Date(filtro.FechaModificacion);
        }
      } else {
        console.log("Traer Usuario Modificado Nuevo")
        let dto = {
          Documento: filtro.UsuarioModificacion.trim(),
          tipopersona: "P",
          SoloBeneficiarios: "-1",
          UneuNegocioId: "-1"
        }
        return this.personaService.listaPersonaUsuario(dto).then((res) => {
          this.usuario = res[0].NombreCompleto;
          this.fechaCreacion = new Date(filtro.FechaCreacion);
          if (this.esFechaVacia(filtro.FechaModificacion)) {
            this.fechaModificacion = new Date();
          } else {
            this.fechaModificacion = new Date(filtro.FechaModificacion);
          }
          console.log("mostrar auditoria", this.usuario, this.fechaCreacion, this.fechaModificacion)
        })
      }
    }
  }


  ListadoAdmisionConstancia(detalleconsulta: Admision) {
    console.log("DETALLE ENTRO ListadoAdmisionConstancia", detalleconsulta);
    var filtroConsAdmision = new FiltroConsultaAdmision;
    filtroConsAdmision.IdAdmision = detalleconsulta.IdAdmision;
    filtroConsAdmision.NroPeticion = detalleconsulta.NroPeticion;
    this.filtro.NroPeticion = detalleconsulta.NroPeticion;
    this.filtro.OrdenAtencion = detalleconsulta.OrdenAtencion;
    this.filtro.NombreCompleto = detalleconsulta.NombreCompleto;
    this.filtro.HistoriaClinica = detalleconsulta.HistoriaClinica;
    this.filtro.FechaAdmision = detalleconsulta.FechaAdmision;
    this.filtro.OrdenSinapa = detalleconsulta.OrdenSinapa;
    this.filtro.TipoOrden = detalleconsulta.TipoOrden;
    this.filtro.Documento = detalleconsulta.Documento;
    this.filtro.IdAdmision = detalleconsulta.IdAdmision;
    this.filtro.Persona = detalleconsulta.Persona;

    this.bloquearPag = true;
    return this.consultaAdmisionService.listarDetalleAdmision(filtroConsAdmision).then(res => {
      console.log("ANGEL LLEGOOOOOOOOOOOOOO", res[0]);
      this.bloquearPag = false;
      if (res.length > 0) {
        this.filtro = res[0];
        this.filtro.Cama = detalleconsulta.Cama;
        this.dto.IdSede = detalleconsulta.IdSede;
        this.validarIdAdmision = detalleconsulta.IdAdmision;
        var contado = 1;
        var total = 0;
        var cantidadExamenes = 0;
        res.forEach(element => {
          element.numeroXadmision = contado++;
          cantidadExamenes += element.Cantidad;
          var ExamenConIgv = element.Precio * this.getUsuarioAuth().data[0].Igv;
        
          if(element.DesEstado !="Anulado"){
          total += (element.Precio + ExamenConIgv) * element.Cantidad;
         }   
         
          element.igvprecioexamenes = element.Precio + ExamenConIgv;
          this.lstListarDetalle.push(element);
        });
        this.cantidad = cantidadExamenes;
        this.lastYearTotal = total;
        this.auditoria(detalleconsulta);
      }
    });
  }

  verSelectorPaciente() {
    if (this.filtro != null) {
      //   console.log("Consulta Detalle verSelectorPaciente filtro", this.filtro);
      this.getPersonaServicio(this.filtro);
    }
  }

  getPersonaServicio(bscAdmision: any) {
    console.log("Consulta Detalle getPersonaServicio ::", this.filtro);
    let dto = {
      tipopersona: "ID",
      SoloBeneficiarios: this.filtro.Persona,
      Documento: this.filtro.Documento,
      UneuNegocioId: "0"
    }
    return this.personaService.listaPersonaUsuario(dto).then((res) => {
      console.log("Consulta Detalle del res ::", res);
      this.bloquearPag = false;
      if (res.length > 0) {
        this.bscPersona = null;
        this.bscPersona = res[0];
        this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONA', ''), "VER", 1, this.bscPersona);

      } else {
        console.log("entroo nadaaa");
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        this.filtro.Documento = null;
      }
    }).catch(error => error);

  }

  comboCargarSedes(): Promise<number> {
    // this.Auth = this.getUsuarioAuth();
    //  var prueba = this.Auth.data;
    let lstsedes = { IdEmpresa: 75300, SedEstado: 1 }
    this.lstsedes.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    var listaCombosedes = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_sedes')));
    if (lstsedes != null) {
      listaCombosedes.forEach(e => {
        this.lstsedes.push({ label: e.SedDescripcion, value: e.IdSede });
        this.filtro.IdSede = this.Auth[0].IdSede
      });
    }
    else {
      return this.loginService.listarSedes(lstsedes).then(
        sedes => {
          if (sedes.length > 0) {
            sedes.forEach(obj => this.lstsedes.push({ label: obj.SedDescripcion, value: obj.IdSede }));
            this.filtro.IdSede = this.Auth[0].IdSede
            console.log("Consulta Detalle comboCargarSedes", sedes)
          }
          return 1
        }
      )
    }
  }


  iniciarComponente(accion: string, titulo) {
    this.verConsultaDetalle = true;
    this.cargarAcciones(accion, titulo)
    this.coreIniciarComponente
  }

  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
  }

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
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
