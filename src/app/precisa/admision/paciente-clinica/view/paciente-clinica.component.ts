import { Component, OnChanges, SimpleChanges, OnInit, ViewChild, SimpleChange, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ConfirmationService, LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormGroup } from '@angular/forms';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { AseguradoraBuscarComponent } from '../../../framework-comun/Aseguradora/components/aseguradora-buscar.component';
import { AseguradoraService } from '../../../framework-comun/Aseguradora/servicio/aseguradora.service';
import { AseguradoraMantenimientoComponent } from '../../../framework-comun/Aseguradora/vista/aseguradora-mantenimiento.component';
import { ExamenBuscarComponent } from '../../../framework-comun/Examen/components/examen-buscar.component';
import { MedicoBuscarComponent } from '../../../framework-comun/Medico/components/medico-buscar.component';
import { MedicoService } from '../../../framework-comun/Medico/servicio/medico.service';
import { MedicoMantenimientoComponent } from '../../../framework-comun/Medico/vista/medico-mantenimiento.component';
import { PersonaBuscarComponent } from '../../../framework-comun/Persona/components/persona-buscar.component';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { PersonaMantenimientoComponent } from '../../../framework-comun/Persona/vista/persona-mantenimiento.component';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { Admision, AdmisionServicio, TraerXAdmisionServicio } from '../../consulta/dominio/dto/DtoConsultaAdmision';
import { FiltroCliente, FiltroListarXAdmision, FiltroTipoOperacion } from '../../consulta/dominio/filtro/FiltroConsultaAdmision';
import { ConsultaAdmisionService } from '../../consulta/servicio/consulta-admision.service';
import { DtoAdmisionprueba, DtoPacienteClinica } from '../dominio/dto/DtoPacienteClinica';
import { Router } from '@angular/router';
import { FiltroPacienteClinica } from '../dominio/filtro/FiltroPacienteClinica';
import { PacienteClinicaBuscarOAComponent } from './components/paciente-clinica-buscarOA.component';
import { PacienteClinicaBuscarPacienteComponent } from './components/paciente-clinica-buscarPaciente.component';
import { PacienteClinicaBuscarPruebaComponent } from './components/paciente-clinica-buscarPrueba.component';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { dtoPersona } from '../../../framework-comun/Persona/dominio/dto/dtoPersona';
import { PacienteClinicaService } from '../service/paciente-clinica.service';
import { EmpresaBuscarComponent } from '../../../framework-comun/Empresa/view/empresa-buscar.component';
import { ExamenService } from '../../../framework-comun/Examen/servicio/Examen.service';
import { FiltroExamen, FiltroServicio } from '../../../framework-comun/Examen/dominio/filtro/FiltroExamen';
import { NbToastrService, NB_THEME_OPTIONS } from '@nebular/theme';
import { DtoAdmisionclinicaDetalle } from '../dominio/dto/DtoAdmisionclinicaDetalle';
import { AppConfig } from '../../../../../environments/app.config';


@Component({
  selector: 'ngx-paciente-clinica',
  templateUrl: './paciente-clinica.component.html',
  styleUrls: ['./paciente-clinica.component.scss']
})
export class PacienteClinicaComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController, OnChanges {

  @ViewChild(PacienteClinicaBuscarOAComponent, { static: false }) buscarOAComponent: PacienteClinicaBuscarOAComponent;
  @ViewChild(PacienteClinicaBuscarPacienteComponent, { static: false }) buscarPacienteComponent: PacienteClinicaBuscarPacienteComponent;
  @ViewChild(PacienteClinicaBuscarPruebaComponent, { static: false }) buscarPruebaComponent: PacienteClinicaBuscarPruebaComponent;
  @ViewChild(AseguradoraMantenimientoComponent, { static: false }) aseguradoraMantenimientoComponent: AseguradoraMantenimientoComponent;
  @ViewChild(MedicoMantenimientoComponent, { static: false }) medicoMantenimientoComponent: MedicoMantenimientoComponent;
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(EmpresaBuscarComponent, { static: false }) empresaBuscarComponent: EmpresaBuscarComponent;
  @ViewChild(AseguradoraBuscarComponent, { static: false }) aseguradoraBuscarComponent: AseguradoraBuscarComponent;
  @ViewChild(MedicoBuscarComponent, { static: false }) medicoBuscarComponent: MedicoBuscarComponent;
  @ViewChild(ExamenBuscarComponent, { static: false }) examenBuscarComponent: ExamenBuscarComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  @ViewChild('pdfViewerActividades', { static: false }) pdfViewerActividades;

  colCard1: string = "col-sm-5";
  colCard2: string = "col-sm-4";

  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  segundos: number = 30;
  IdTimer: any;

  seleccionarItemPacienteTemp: any;
  seleccionarItemServicioTemp: any;
  seleccionarItemMedicoTemp: any;

  loading: boolean;
  bloquearPag: boolean;
  contarExamenes: number = 15;

  verReporteModal: boolean = false;

  valorseleccionadocombo: number;
  modeloSevicioId : number = 0;
  verBtnAnular: boolean = false;
  disableBtnGuardar: boolean  ;

  // disableBtnGuardarv2: boolean;

  

  Auth: UsuarioAuth = new UsuarioAuth();
  examen: FiltroExamen = new FiltroExamen();
  contado: number = 1;
  total: number = 0;
  cliente: FiltroCliente = new FiltroCliente();
  operacion: FiltroTipoOperacion = new FiltroTipoOperacion();
  servicio: FiltroServicio = new FiltroServicio();
  xadmision: FiltroListarXAdmision = new FiltroListarXAdmision;
  formularioOninit: boolean = true;
  editarCampos: boolean = true;
  editarDetallePrueba: boolean = true;
  editarCamposAutomaticos: boolean = true;
  editarCampoNroCama: boolean = true;
  editarCampoOA: boolean = true;
  editarCampoMedico: boolean = true;
  editarCampoAseguradora: boolean = true;
  editarCampoEmpresa: boolean = true;
  editarCampoDocumento: boolean = false;
  editarCampoSevicio: boolean = true;

  dtofinal: DtoAdmisionprueba = new DtoAdmisionprueba();
  tipo: any;
  lstSexo: SelectItem[] = [];
  lstprocedencia: SelectItem[] = [];
  lstTipoOrden: SelectItem[] = [];
  lstTipoAtencion: SelectItem[] = [];
  lstServicio: SelectItem[] = [];
  lstcliente: SelectItem[] = [];
  lstTipoOperacion: SelectItem[] = [];
  valorTipoPacienteId: any;
  valorCliente: any;
  bscPersona: dtoPersona = new dtoPersona();
  lstexamen: SelectItem[] = [];
  EnterExamen: SelectItem[] = [];
  MultEditPersona: SelectItem[] = [];
  lstSedeEmpresa: SelectItem[] = [];
  lstAnularAdmisionDetalle: DtoPacienteClinica[] = [];
  // lstListarXAdmision: any[] = [];
  selectedTipoPaciente = "";
  //grillas
  lstListarXAdmision: DtoPacienteClinica[] = [];
  admision: DtoPacienteClinica;
  //Formulario Reactivo
  public validarAdmision: FormGroup;

  tempfiltro: any;
  registroSeleccionado: any;
  lastYearTotal: number = 0;
  editarCantidad: boolean = true;
  //client: Client;
  filtro: FiltroPacienteClinica = new FiltroPacienteClinica();
  filtro2: FiltroPacienteClinica = new FiltroPacienteClinica();
  adm: Admision = new Admision();
  lst: AdmisionServicio = new AdmisionServicio();
  ind: TraerXAdmisionServicio = new TraerXAdmisionServicio();
  IdConsentimiento: number = 0;
  cantidad: number = 0;

  titulo: string;

  constructor(
    public router: Router,
    public confirmationService: ConfirmationService,
    private examenService: ExamenService,
    private consultaAdmisionService: ConsultaAdmisionService,
    private pacienteClinicaService: PacienteClinicaService,
    protected messageService: MessageService,
    private personaService: PersonaService,
    private aseguradoraService: AseguradoraService,
    private medicoService: MedicoService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    public config: AppConfig

  ) {
    super(
    );
  }

  ngOnDestroy(): void {
    // this.userInactive.unsubscribe();
  }

  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    this.iniciarComponent();
    const p1 = this.comboComboSexo();
    this.comboCargarProcendia();
    const p3 = this.comboComboTipoOrden();
    const p4 = this.comboCargarServicios();
    const p5 = this.comboCargarTipoAtencion();
    console.log("Clinica selec comboCargarTipoAtencion", p5);
    const p6 = this.comboCargarCliente();
    console.log("selec comboCargarCliente", p6);
    const p7 = this.comboCargarTipoOperacion();
    console.log("Clinica selec comboCargarTipoOperacion", p7);
    // this.titulo = '';
    Promise.all([p1,  p3, p4, p5, p6, p7]).then(resp => {
      var condicion = this.route.snapshot.url.length;
      if (condicion > 2) {
        this.tempfiltro = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
        if (this.tempfiltro) {
          console.log("Clinica ngOnInit Ingreso EditarAdmision",   this.tempfiltro);
          this.EditarAdmision(this.tempfiltro);
          this.auditoria(this.tempfiltro, 2);
          this.admision = this.tempfiltro;
        }
      }else{
        this.auditoria("NUEVO", 1);
      }
      this.filtro = this.formularioFiltrosRestaurar(this.filtro);   
      console.log("Clinica Termino ngOnInit",   this.filtro);
        this.bloquearPag = false;
    });
  }

  auditoria(filtro?: any, validar?: number) {
    if (validar == 1) {
      this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
      this.fechaCreacion = new Date();
      this.fechaModificacion = new Date();
    } else 
      {      
        if (!this.estaVacio(filtro.UsuarioCreacion.trim())) {        
          if( filtro.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario){
            this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
            this.fechaCreacion = new Date(filtro.FechaCreacion);
            if (this.esFechaVacia(filtro.FechaModificacion)) {
              this.fechaModificacion = new Date();
            } else {
              this.fechaModificacion = new Date(filtro.FechaModificacion);
            }
          }else{
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
          this.usuario = this.Auth[0].NombreCompleto;
          this.fechaCreacion = new Date();
          this.fechaModificacion = new Date();
        }
    }
  }


  listadoHistoriaClinica(persona: number) {
    var filtro = new FiltroPacienteClinica();
    filtro.persona = persona;
    filtro.IdSede = this.getUsuarioAuth().data[0].IdSede;
    return this.personaService.listadoSedeHistoria(filtro).then((res) => {
      console.log("historia clinica res", res);
      this.filtro.CodigoHC = res[0].CodigoHC;
    }).catch(error => error);
  }


  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECPACIENTE") {
      console.log("seleccionar paciente", mensage.resultado);
      this.bscPersona = mensage.resultado;
      this.listadoHistoriaClinica(mensage.resultado.Persona);
      this.listarConsentimientoXdocumento(mensage.resultado.Documento);
      this.filtro.Documento = mensage.resultado.Documento;
      if (this.estaVacio(mensage.resultado.NombreCompleto)) {
        this.filtro.NombreCompleto = `${mensage.resultado.Nombres}, ${mensage.resultado.ApellidoPaterno} ${mensage.resultado.ApellidoMaterno}`;
      } else {
        this.filtro.NombreCompleto = mensage.resultado.NombreCompleto;
      }
      //datos extras para el guardar OA
      this.filtro.Persona = mensage.resultado.Persona;
      this.filtro.Nombres = mensage.resultado.Nombres;
      this.filtro.ApellidoPaterno = mensage.resultado.ApellidoPaterno;
      this.filtro.ApellidoMaterno = mensage.resultado.ApellidoMaterno;
      this.filtro.TipoDocumento = mensage.resultado.TipoDocumento;
      this.filtro.CorreoElectronico = mensage.resultado.CorreoElectronico;
      this.filtro.Comentario = mensage.resultado.Comentario;
      this.filtro.Sexo = mensage.resultado.Sexo;
      this.filtro.CodigoHC = mensage.resultado.CodigoHC;
      // this.filtro.Edad = mensage.resultado.Edad;
      this.filtro.FechaNacimiento = new Date(mensage.resultado.FechaNacimiento);
      this.CalcularAnios();
      this.editarCampos = false;
      this.editarDetallePrueba = false;
      this.editarCampoOA = false;
      this.editarCampoSevicio = false;
      this.editarCamposAutomaticos = true;
      this.editarCampoNroCama = true;
      this.editarCampoDocumento = true;
      this.editarCampoEmpresa = false;
      this.editarCampoAseguradora = false;
      this.editarCampoMedico = false;
      this.disableBtnGuardar = true;
    }
    else if (mensage.componente == "SELECEMPRESA") {
      if (!this.estaVacio(mensage.resultado.DocumentoFiscal)) {
        this.filtro2.DocumentoFiscal = mensage.resultado.DocumentoFiscal;
      } else {
        this.filtro2.DocumentoFiscal = mensage.resultado.Documento;
      }
      this.filtro2.NombreCompleto = mensage.resultado.NombreCompleto;
      this.filtro2.Persona = mensage.resultado.Persona;
      this.lstSedeEmpresa = [];
      this.comboCargarSedeEmpresa(mensage.resultado.Persona);
      this.editarCampoEmpresa = true;
      console.log("selec empresa", mensage.resultado);
    }
    else if (mensage.componente == "SELECASEGURADORA") {
      this.filtro.IdAseguradora = mensage.resultado.IdAseguradora;
      this.filtro.NombreEmpresa = mensage.resultado.NombreEmpresa;
      this.editarCampoAseguradora = true;
      console.log("selec aseguradora", mensage.resultado)
    }
    else if (mensage.componente == "SELECMEDICO") {
      this.filtro.CMP = mensage.resultado.CMP;
      this.filtro.Busqueda = mensage.resultado.Busqueda;
      this.filtro.IdEspecialidad = mensage.resultado.IdEspecialidad;
      this.filtro.MedicoId = mensage.resultado.MedicoId;
      this.editarCampoMedico = true;
    }
    else if (mensage.componente == "BUSCEXAM") {
      if (this.filtro.NombreCompleto != null) {
        var validado = 0;
        var totala = 0;
        var cantidadExamenes = 0;
        this.contarExamenes = this.lstListarXAdmision.length;
        this.contarExamenes += mensage.resultado.length;
        this.lstListarXAdmision.forEach(x => {
          // var ExamenConIgv = x.ValorEmpresa * this.getUsuarioAuth().data[0].Igv; 
          // x.Valor = x.ValorEmpresa + ExamenConIgv; 
          cantidadExamenes += x.Cantidad;
          x.ValorEmpresa = x.Valor * x.Cantidad;
          totala += x.ValorEmpresa;
        });
        mensage.resultado.forEach(element => {
          // var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv; 
          // element.Valor = element.ValorEmpresa + ExamenConIgv;   
          cantidadExamenes += element.Cantidad;
          element.ValorEmpresa = element.Valor * element.Cantidad;
          totala += element.ValorEmpresa;
          this.lstListarXAdmision.forEach(ele => {
            if (element.CodigoComponente == ele.CodigoComponente) {
              validado = 1;
            }
          });
          if (validado == 1) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'EL CAMPO REGISTRADO SE REPITE', life: 3000 })
            return;
          } else {
            this.loading = true;
            this.lastYearTotal = totala;
            var contadorsito = this.lstListarXAdmision.length;
            element.numeroXadmision = contadorsito + 1;
            this.lstListarXAdmision.push(element);
            this.cantidad = cantidadExamenes;
            this.loading = false;
            this.seleccionarItemPacienteTemp = this.filtro.TipoOperacionID;
            this.seleccionarItemServicioTemp = this.filtro.ClasificadorMovimiento;
            // this.admision.TipoOperacionId = this.filtro.TipoOperacionID;
          }
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: 'Seleccione un paciente.'
        })
      }

    } else if (mensage.componente == 'BUSCOA') 
    {
      console.log("DATA ADMISION VIAJANDO DE BUSCOA ", mensage.resultado.Admision);
      if (mensage.resultado == "1") {
        this.btnNuevo();
      }
      else if (mensage.resultado.Admision != null) {
        this.auditoria(mensage.resultado.Admision, 2);
        this.editarCampos = false;
        this.editarDetallePrueba = false;
        this.editarCampoOA = true;
        this.editarCampoSevicio = false;
        this.editarCamposAutomaticos = true;
        this.editarCampoNroCama = true;
        this.editarCampoMedico = true;
        this.editarCampoAseguradora = true;
        this.editarCampoEmpresa = true;
        this.editarCampoDocumento = true;
        this.disableBtnGuardar = true;
        this.filtro.Documento = mensage.resultado.Admision.Documento;
        this.listarConsentimientoXdocumento(mensage.resultado.Admision.Documento);
        this.filtro.FechaNacimiento = new Date(mensage.resultado.Admision.fechanacimiento);
        this.filtro.Sexo = mensage.resultado.Admision.sexo;
        this.CalcularAnios();
        this.filtro.CodigoHC = mensage.resultado.Admision.HistoriaClinica;
        this.filtro.CorreoElectronico = mensage.resultado.Admision.CorreoElectronico;
        this.filtro.NroPeticion = mensage.resultado.Admision.NroPeticion;
        this.filtro.OrdenAtencion = mensage.resultado.Admision.OrdenAtencion;
        this.filtro.CMP = mensage.resultado.Admision.CMP;
        if (!this.esNumeroVacio(mensage.resultado.Admision.IdEspecialidad)) {
          this.filtro.IdEspecialidad = mensage.resultado.Admision.IdEspecialidad;
        }
        this.guardarOAmedico(mensage.resultado.Admision.MedicoId);
        this.guardarOAaseguradora(mensage.resultado.Admision.IdAseguradora);
        if (!this.esNumeroVacio(mensage.resultado.Admision.IdEmpresaPaciente)) {
          this.guardarOAempresa(mensage.resultado.Admision.IdEmpresaPaciente);
          this.lstSedeEmpresa = [];
          this.comboCargarSedeEmpresa(mensage.resultado.Admision.IdEmpresaPaciente);

        }
        this.guardarOAPersona(mensage.resultado.Admision.Persona);
        this.filtro.TipoOrden = mensage.resultado.Admision.TipoOrden;
        this.filtro.ClasificadorMovimiento = mensage.resultado.Admision.ClasificadorMovimiento;
        this.filtro.TipoAtencion = mensage.resultado.Admision.TipoAtencion;
        if (this.filtro.TipoAtencion == 2) {
          this.editarCampoNroCama = false;
        } else {
          this.editarCampoNroCama = true;
        }
        this.filtro.TipoOperacionID = mensage.resultado.Admision.TipoOperacionId;
        this.admision = mensage.resultado.Admision;

        if( mensage.resultado.Mensaje != "La OA fue ingresada sin detalle") 
          {
            if (mensage.resultado.list_AdmisionServicio[0].hasOwnProperty("CodigoComponente")) 
            {
              var totala = 0;
              var cantidadExamenes = 0;
              this.lstListarXAdmision.forEach(x => {
                cantidadExamenes += x.Cantidad;
                x.ValorEmpresa = x.Valor * x.Cantidad;
                totala += x.ValorEmpresa;
              });

              this.contarExamenes = mensage.resultado.list_AdmisionServicio.length;
              mensage.resultado.list_AdmisionServicio.forEach(element => {
                cantidadExamenes += element.Cantidad;
                element.ValorEmpresa = element.Valor * element.Cantidad;
                totala += element.ValorEmpresa;
                var contadorsito = this.lstListarXAdmision.length;
                element.numeroXadmision = contadorsito + 1;
                this.lstListarXAdmision.push(element);
              });
              this.lastYearTotal = totala;
              this.cantidad = cantidadExamenes;
              this.verBtnAnular = true;
              this.colCard1 = "col-sm-3";
              this.colCard2 = "col-sm-6";           
            }
          }else{
            this.disableBtnGuardar = false;
          }
     
        //this.bloquearPag = false;
        this.loading = false;
      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: `Registro Seleccionado sin Datos`
        })
      }
    } else if (mensage.componente == 'TIPMAPERSONANUEVO') {
      console.log("TIPMAPERSONANUEVO data llegando:",mensage.resultado);

      this.disableBtnGuardar = true;
      if (mensage.resultado != null) {

        this.filtro.Documento = mensage.resultado.data.Documento
        this.filtro.NombreCompleto = mensage.resultado.data.NombreCompleto
        this.filtro.CorreoElectronico = mensage.resultado.data.CorreoElectronico;
        this.filtro.Comentario = mensage.resultado.data.Comentario;
        this.filtro.Sexo = mensage.resultado.data.Sexo;
        this.filtro.CodigoHC = mensage.resultado.data.CodigoHC;
        this.filtro.FechaNacimiento = new Date(mensage.resultado.data.FechaNacimiento);
        this.CalcularAnios();
        this.filtro.Persona = mensage.resultado.data.Persona;
        this.filtro.TipoDocumento = mensage.resultado.data.TipoDocumento;
        this.filtro.Nombres = mensage.resultado.data.Nombres;
        this.filtro.ApellidoPaterno = mensage.resultado.data.ApellidoPaterno;
        this.filtro.ApellidoMaterno = mensage.resultado.data.ApellidoMaterno;
        this.filtro.Telefono = mensage.resultado.data.Telefono
        this.bscPersona = null
        this.bscPersona = mensage.resultado.data;
        this.editarCampos = false;
        this.editarDetallePrueba = false;
        this.editarCampoOA = false;
        this.editarCampoSevicio = false;
        this.editarCamposAutomaticos = true;
        this.editarCampoNroCama = true;
        this.editarCampoDocumento = true;
        this.editarCampoMedico = false;
        this.editarCampoAseguradora = false;
        this.editarCampoEmpresa = false;

      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: `Registro Seleccionado sin Datos`
        })
      }
       
    } else if (mensage.componente == 'TIPMAPERSONAEDITAR') {
      console.log("TIPMAPERSONAEDITAR VIAJANDO ", mensage.resultado.data);
      console.log("TIPMAPERSONAEDITAR paciente", this.bscPersona);
      this.MostrarEmpresa(this.bscPersona.Persona , 1);

    } else if (mensage.componente == 'TIPREGMEDICO') {
      console.log("data llegando medico", mensage.componente)
      console.log("data llegando medico", mensage.resultado)
      if (mensage.resultado != null) {
        this.bloquearPag = true;
        this.filtro.CMP = mensage.resultado.data.CMP;
        this.filtro.Busqueda = mensage.resultado.data.Busqueda;
        this.filtro.MedicoId = mensage.resultado.data.MedicoId;
        this.editarCampoMedico = true;
        this.bloquearPag = false;
      }
    } else if (mensage.componente == 'TIPREGASEGURADORA') {
      if (mensage.resultado != null) {
        this.bloquearPag = true;
        this.filtro.IdAseguradora = mensage.resultado.data.IdAseguradora;
        this.filtro.NombreEmpresa = mensage.resultado.data.NombreEmpresa;
        this.editarCampoAseguradora = true;
 
          this.bloquearPag = false;
  
      }
    } else if (mensage.componente == 'TIPREGEMPRESA') {
      console.log("data llegando mensaje", mensage.resultado)
      if (mensage.resultado != null) {
        this.bloquearPag = true;
        this.filtro2.DocumentoFiscal = mensage.resultado.data.Documento;
        this.filtro2.NombreCompleto = mensage.resultado.data.NombreCompleto;
        this.filtro2.Persona = mensage.resultado.data.Persona;
        this.editarCampoEmpresa = true;
        // this.editarCampoMedico = true;    
          this.bloquearPag = false; 
      }
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    // console.log("probando aqui", this.seleccionarItemPaciente)
    // console.log("VALOR ngOnChanges", changes.currentValue)
    // console.log(" aver despues", changes.previousValue)
  }

  selectedItemTipoPaciente(event) {
    var tipooperacion = this.seleccionarItemPacienteTemp;
    console.log("valor tipooperacion", tipooperacion);
    console.log("valor event.value", event.value);
    var listaEntyOperacion = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('EntyOperacion')));    
    if (!this.esListaVacia(listaEntyOperacion)){
      listaEntyOperacion.forEach(e => {
          if(e.TipoOperacionID== event.value){
            this.IdConsentimiento=e.FlaCon;
            console.log("IdConsentimiento",  this.IdConsentimiento);
          }       
      });
    }

    if(this.IdConsentimiento==1){
      this.listarConsentimientoXdocumento(this.filtro.Documento);
      }

    if (this.lstListarXAdmision.length > 0) {
      console.log("valor de lcombo despues", this.selectedTipoPaciente)
      this.bloquearPag = true;
      if (this.admision != null) {
        this.dtofinal.Admision.UsuarioCreacion = this.admision.UsuarioCreacion; //derrepente pasando nulo         
        this.dtofinal.Admision.Estado = this.admision.Estado;
        this.dtofinal.Admision.FechaCreacion = new Date(this.admision.FechaCreacion);
        this.dtofinal.Admision.IpCreacion = this.admision.IpCreacion;   //crear metodo que nos muestre la IP del usuario
        this.dtofinal.Admision.TipoAtencion = this.admision.TipoAtencion;
        this.dtofinal.Admision.DesEstado = this.admision.DesEstado;
        this.dtofinal.Admision.FechaAdmision = new Date(this.admision.FechaAdmision);
        this.dtofinal.Admision.FlatAprobacion = this.admision.FlatAprobacion;
        this.dtofinal.Admision.TipoAtencion = this.admision.TipoAtencion;
        this.dtofinal.Admision.IdAdmision = this.admision.IdAdmision;
      }
      else {
        this.dtofinal.Admision.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
        this.dtofinal.Admision.FechaCreacion = new Date();
        this.dtofinal.Admision.IpCreacion = this.getIp();
        this.dtofinal.Admision.FechaAdmision = new Date();
      }

      this.dtofinal.Admision.TipoDocumento = this.filtro.TipoDocumento;
      this.dtofinal.Admision.Documento = this.filtro.Documento;
      this.dtofinal.Admision.NombreCompleto = this.filtro.NombreCompleto;
      this.dtofinal.Admision.fechanacimiento = new Date(this.filtro.FechaNacimiento);
      this.dtofinal.Admision.nombres = this.filtro.Nombres;
      this.dtofinal.Admision.apellidopaterno = this.filtro.ApellidoPaterno;
      this.dtofinal.Admision.apellidomaterno = this.filtro.ApellidoMaterno;
      this.dtofinal.Admision.sexo = this.filtro.Sexo;
      this.dtofinal.Admision.CorreoElectronico = this.filtro.CorreoElectronico;
      //admision.IdAdmision; normal registraria sin llamarlo cunado es 1
      this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
      this.dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;
      this.dtofinal.Admision.Persona = this.filtro.Persona; //viene de un metodo persona

      this.dtofinal.Admision.HistoriaClinica = this.filtro.CodigoHC;
      this.dtofinal.Admision.NroPeticion = this.filtro.NroPeticion;
      this.dtofinal.Admision.OrdenAtencion = this.filtro.OrdenAtencion;
      this.dtofinal.Admision.MedicoId = this.filtro.MedicoId;
      this.dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
      this.dtofinal.Admision.FechaModificacion = new Date();
      // this.dtofinal.Admision.UsuarioCreacion = this.admision.UsuarioCreacion; //derrepente pasando nulo
      this.dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
      this.dtofinal.Admision.IpModificacion = this.getIp();  //crear metodo que nos muestre la IP del usuario

      this.dtofinal.Admision.IdEmpresaPaciente = this.filtro2.Persona;
      this.dtofinal.Admision.IdAseguradora = this.filtro.IdAseguradora;
      this.dtofinal.Admision.TipoOrden = this.filtro.TipoOrden;
      this.dtofinal.Admision.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;
      // this.dtofinal.Admision.TipoPaciente=admision.TipoPaciente;
      this.dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
      // this.dtofinal.Admision.TipoOrdenAtencion=this.filtro.TipoOrdenAtencion;

      this.dtofinal.Admision.TIPOADMISIONID = 1; //admision.TIPOADMISIONID;
      console.log("llegando toda cabecera tipo paciente", this.dtofinal.Admision)
      console.log("lista llegando combo", this.lstListarXAdmision)

      this.dtofinal.list_AdmisionServicio = [];
      this.lstListarXAdmision.forEach(element => {
        var dtoAdmClini = new DtoAdmisionclinicaDetalle;
        console.log("valor de dtoadmclini", dtoAdmClini)

        dtoAdmClini.IdAdmServicio = element.IdAdmServicio;
        dtoAdmClini.IdAdmision = element.IdAdmision;
        dtoAdmClini.Linea = element.Linea;
        dtoAdmClini.IdOrdenAtencion = element.IdOrdenAtencion;
        dtoAdmClini.CodigoComponente = element.CodigoComponente;
        dtoAdmClini.Descripcion = element.Descripcion;
        dtoAdmClini.Cantidad = element.Cantidad;
        dtoAdmClini.Valor = element.Valor;
        dtoAdmClini.Estado = element.Estado;
        dtoAdmClini.EstadoAdm = element.EstadoAdm;
        dtoAdmClini.Sexo = element.Sexo;
        dtoAdmClini.ClasificadorMovimiento = element.ClasificadorMovimiento;
        dtoAdmClini.UsuarioCreacion = element.UsuarioCreacion;
        dtoAdmClini.IpCreacion = element.IpCreacion;
        dtoAdmClini.IpModificacion = this.getIp();
        dtoAdmClini.TipoOperacionID = this.filtro.TipoOperacionID;
        dtoAdmClini.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
        this.dtofinal.list_AdmisionServicio.push(dtoAdmClini);

      });

      console.log("llegando lista combo tipo paciente", this.dtofinal.list_AdmisionServicio)
      this.dtofinal.IndicadorWS = 0;
      console.log("dto a selec tipo paciente:", this.dtofinal);  
        this.bloquearPag = false;
      this.pacienteClinicaService.cambioContratoTipoPaciente(1, this.dtofinal, this.getUsuarioToken()).then(

        res => {
          this.bloquearPag = true;
          // this.admision.TipoOperacionId = this.filtro.TipoOperacionID
          if (res.Mensaje.length <= 38) {
            Swal.fire({
              icon: 'warning',
              title: '¡Mensaje!',
              text: `${res.Mensaje}`
            })
            this.lastYearTotal = 0;
            this.contado = 1;
            this.lstListarXAdmision = [];
            var totala = 0;
            var cantidadExamenes = 0;
            console.log("probando res de la lista", res.list_AdmisionServicio[0].TipoOperacionId)
            res.list_AdmisionServicio.forEach(element => {
              // var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv; 
              // element.Valor = element.ValorEmpresa + ExamenConIgv;  
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = element.Valor * element.Cantidad;
              totala += element.Valor;
              // var contadorsito = 1;
              element.numeroXadmision = this.contado++;
              this.lstListarXAdmision.push(element);
            });
            // this.lstListarXAdmision = res.list_AdmisionServicio
            this.lastYearTotal = totala;
            this.cantidad = cantidadExamenes;
            this.loading = false;
            if (this.admision != null) {
              this.admision.TipoOperacionId = this.filtro.TipoOperacionID;             
                this.bloquearPag = false;         
            } else {
              this.seleccionarItemPacienteTemp = this.filtro.TipoOperacionID;             
                this.bloquearPag = false;           
            }
            // console.log("tipooperacion del antes", this.admision.TipoOperacionId)
            // this.mensajeController.resultado = res;
            // setTimeout(() => {
            //   this.bloquearPag = false;
            // }, 500);
          } else {
            this.bloquearPag = true;
            console.log("res al guardar admision TODO", res)
            Swal.fire({
              icon: 'warning',
              title: '¡Mensaje!',
              text: `${res.Mensaje}`
            }).then((result) => {
              if (result.isConfirmed) {
                // Swal.fire('Saved!', '', 'success')
                // this.filtro.TipoOperacionID = TipoOpe;
                if (this.admision != null) {

                  this.filtro.TipoOperacionID = this.admision.TipoOperacionId;
                  console.log("tipo operacon del despues", this.filtro.TipoOperacionID)             
                    this.bloquearPag = false;                 
                } else {
                  this.filtro.TipoOperacionID = this.seleccionarItemPacienteTemp;
                  console.log("tipo operacon del despues", this.filtro.TipoOperacionID)         
                    this.bloquearPag = false;              
                }

              }

            })
          }

        }).catch(error => error)

    }
  }

  EditarAdmision(tempfiltro: Admision) {
    console.log("EditarAdmision",  this.tempfiltro);
    this.bloquearPag = true;
    this.filtro.Documento = tempfiltro.Documento;
    this.filtro.NombreCompleto = tempfiltro.NombreCompleto;
    this.filtro.CodigoHC = tempfiltro.HistoriaClinica;
    this.filtro.Sexo = tempfiltro.sexo;
    this.filtro.FechaNacimiento = tempfiltro.fechanacimiento;
    this.CalcularAnios();
    this.filtro.NroPeticion = tempfiltro.NroPeticion;
    this.filtro.OrdenAtencion = tempfiltro.OrdenAtencion;
    this.filtro.OrdenSinapa = tempfiltro.OrdenSinapa;
    this.filtro.Telefono = tempfiltro.Telefono;
    this.filtro.Cama = tempfiltro.Cama;
    this.filtro.CoaSeguro = tempfiltro.CoaSeguro;
    this.filtro.Nombres = tempfiltro.nombres;
    this.filtro.ApellidoPaterno = tempfiltro.apellidopaterno;
    this.filtro.ApellidoMaterno = tempfiltro.apellidomaterno;
    this.filtro.TipoOperacionID = tempfiltro.TipoOperacionId;
    this.filtro.ClasificadorMovimiento = tempfiltro.ClasificadorMovimiento;
    this.filtro.TipoOrden = tempfiltro.TipoOrden;
    this.filtro.empresa = tempfiltro.IdSede;
    this.filtro.TipoAtencion = tempfiltro.TipoAtencion;
    this.filtro.IdSedeEmpresa = tempfiltro.IdSedeEmpresa;
    this.MostrarEmpresa(tempfiltro.Persona, 1);

    this.editarCampoDocumento = true;
    this.lstSedeEmpresa = [];
    if (tempfiltro.IdEmpresaPaciente > 0) {
      this.MostrarEmpresa(tempfiltro.IdEmpresaPaciente, 2);
      this.comboCargarSedeEmpresa(tempfiltro.IdEmpresaPaciente)
      this.filtro.IdSedeEmpresa = tempfiltro.IdSedeEmpresa;
    }
    this.MostrarMedico(tempfiltro.MedicoId);
    this.MostrarAseguradora(tempfiltro.IdAseguradora);
    this.grillaCargarDatos({ first: 0 });
    this.verBtnAnular = true;
    this.btnEditar(); 
    this.colCard1 = "col-sm-3"
    this.colCard2 = "col-sm-6"
    this.bloquearPag = false;

    var listaEntyOperacion = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('EntyOperacion'))); 
    if (!this.esListaVacia(listaEntyOperacion)){
      listaEntyOperacion.forEach(e => {
          if(e.TipoOperacionID== tempfiltro.TipoOperacionID){
            this.IdConsentimiento=e.FlaCon;
            console.log("IdConsentimiento",  this.IdConsentimiento);
          }       
      });
    }
/*     if(this.IdConsentimiento==1){
      this.listarConsentimientoXdocumento(this.filtro.Documento);
      } */

    // setTimeout(() => {
    //   this.bloquearPag = false;
    // }, 100);
  }

  CalcularAnios() {
    let ahora = new Date();
    let fechanacimiento = new Date(this.filtro.FechaNacimiento);
    let anios = ahora.getFullYear() - fechanacimiento.getFullYear();
    fechanacimiento.setFullYear(ahora.getFullYear());
    if (ahora < fechanacimiento) {
      --anios
    }
    this.filtro.Edad = anios;
  }


  limpiarPersona() {

    this.filtro.Persona = new FiltroPacienteClinica().Persona;
    this.filtro.Documento = new FiltroPacienteClinica().Documento;
    this.filtro.NombreCompleto = new FiltroPacienteClinica().NombreCompleto;
    this.filtro.FechaNacimiento = new FiltroPacienteClinica().FechaNacimiento;
    this.filtro.CorreoElectronico = new FiltroPacienteClinica().CorreoElectronico;
    this.filtro.Sexo = new FiltroPacienteClinica().Sexo;
    this.filtro.Edad = new FiltroPacienteClinica().Edad;
    this.filtro.Comentario = new FiltroPacienteClinica().Comentario;
    this.filtro.CodigoHC = new FiltroPacienteClinica().CodigoHC;
    this.filtro.consentimiento = new FiltroPacienteClinica().consentimiento;
    this.editarCampoDocumento = false;
    this.editarCampos = true;
    this.editarDetallePrueba = true;
    this.editarCampoAseguradora = true;
    this.editarCampoMedico = true;
    this.editarCampoEmpresa = true;
    this.disableBtnGuardar = true;
  }

  limpiarAseguradora() {

    this.filtro.IdAseguradora = new FiltroPacienteClinica().IdAseguradora;
    this.filtro.NombreEmpresa = new FiltroPacienteClinica().NombreEmpresa;
    this.editarCampoAseguradora = false;
  }

  limpiarMedico() {

    this.filtro.CMP = new FiltroPacienteClinica().CMP;
    this.filtro.Busqueda = new FiltroPacienteClinica().Busqueda;
    this.filtro.MedicoId = new FiltroPacienteClinica().MedicoId;
    this.editarCampoMedico = false;
  }

  limpiarEmpresa() {

    this.filtro2.DocumentoFiscal = new FiltroPacienteClinica().DocumentoFiscal;
    this.filtro2.NombreCompleto = new FiltroPacienteClinica().NombreCompleto;
    this.filtro2.Persona = new FiltroPacienteClinica().Persona;
    this.editarCampoEmpresa = false;
    this.lstSedeEmpresa = [];

  }

  //   coreBuscar(): void {
  //     this.dataTableComponent.first = this.filtro.paginacion.paginacionRegistroInicio;
  //    this.grillaCargarDatos({ first: this.dataTableComponent.first });
  // }

  cargarServicios() {
    const p1 = 1;
    Promise.all([p1]).then(
      f => {
        //  this.grillaCargarDatos({ first: this.dataTableComponent.first });
      }
    );
  }







  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }
  coreNuevo(): void {
    // this.openNew();
  }

  btnNuevo() {
    this.filtro = new FiltroPacienteClinica();
    this.filtro2 = new FiltroPacienteClinica();
    this.admision = new DtoPacienteClinica();    
    this.editarCampoDocumento = false;
    this.editarCampos = true;
    this.editarDetallePrueba = true;
    this.editarCampoAseguradora = true;
    this.editarCampoMedico = true;
    this.editarCampoEmpresa = true;
    this.disableBtnGuardar = true;
    this.editarCampoAseguradora = false;
    this.editarCampoMedico = false;
    this.editarCampoEmpresa = false;
    this.lstSedeEmpresa = [];
    this.filtro.TipoOrden = "R";
    this.filtro.TipoAtencion = 1;
    this.filtro.TipoOperacionID = this.valorTipoPacienteId;
    this.filtro.comboCliente = this.valorCliente;
    this.filtro.ClasificadorMovimiento = this.getUsuarioAuth().data[0].ClasificadorMovimiento
    this.lstListarXAdmision = [];
    this.lastYearTotal = 0
    this.cantidad = 0
    this.filtro.IdEspecialidad = 0
    this.editarCampos = true;
    this.editarDetallePrueba = true;
    this.editarCampoMedico = true;
    this.editarCampoAseguradora = true;
    this.editarCampoEmpresa = true;
    this.editarCampoDocumento = false;
    this.verBtnAnular = false;
    this.colCard1 = "col-sm-5"
    this.colCard2 = "col-sm-4"

  }

  btnEditar() {
    // this.editarCampoOA = false;
    this.editarCamposAutomaticos = true;
    this.editarCampos = false;
    this.editarDetallePrueba = false;
    this.disableBtnGuardar = true;

    


    this.editarCampoSevicio = false;
    this.editarCampoMedico = false;
    this.editarCampoAseguradora = false;
    this.editarCampoEmpresa = false;
    if (this.filtro.TipoAtencion == 2) {
      this.editarCampoNroCama = false;
    } else {
      this.editarCampoNroCama = true;
    }
    // this.ValidarAdmi();

  }

  coreBuscarPrueba(): void {
    this.openBuscarPrueba();
  }


  coreSeleccionar(filtro: any) {
    this.mensajeController.resultado = filtro;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    this.coreSalir();
  }

  
  BuscarOA() {
    this.buscarOAComponent.coreIniciarComponenteBuscarOA(new MensajeController(this, 'BUSCOA', ''), 'NUEVO', this.filtro);

  }

  openBuscarPaciente() {
    this.buscarPacienteComponent.iniciarComponente('PACIENTE')
  }

  openBuscarPrueba() {
    this.buscarPruebaComponent.iniciarComponente('PRUEBA')
  }

  crearAseguradora() {
    this.aseguradoraMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGASEGURADORA', ''), "NUEVO");
  }


  crearMedico() {
    this.medicoMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGMEDICO', ''), 'NUEVO');
  }

  //Nueva Empresa (Juridica) - Pacientes
  crearEmpresa() {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGEMPRESA', ''), 'NUEVO', 2);
  }

  MultiPersona() {
  //  this.bloquearPag = true;

    if (this.filtro.NombreCompleto == null && this.filtro.Documento == null) {
      this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONANUEVO', ''), "NUEVO", 1);
    } else {
      // console.log(":: this.filtro.Documento multipersona", this.filtro.Documento.trim())
      if (this.bscPersona != null) {
        this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONAEDITAR', ''), "EDITAR", 1, this.bscPersona);
    
      } else if (this.admision != null) {
        this.getPersonaServicio(this.filtro.Documento.trim(), 1);

      } else {
        this.getPersonaServicio(this.filtro.Documento.trim(), 1);
      }

    }
  }

  // Correo() {
  //   Swal.fire({
  //     position: 'top-end',
  //     icon: 'warning',
  //     title: 'EN DESARROLLO',
  //     showConfirmButton: false,
  //     timer: 1500
  //   })
  // }

  imprimirCodigo() {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'EN DESARROLLO',
      showConfirmButton: false,
      timer: 1500
    })
  }

  imprimir(dto: Admision) {
    this.bloquearPag = true;
    var payload = {
      IdReporte: 1,
      IdAdmision: this.admision.IdAdmision,
      NroPeticion: this.filtro.NroPeticion
    }
    this.consultaAdmisionService.printListadoReporte(payload).then(resp => {
      console.log("prin", resp);

      this.verReporteModal = true;

      var base64 = (resp.ValorByte);
      const file2 = this.base64toBlob(resp.ValorByte, 'application/pdf');

      const link = window.URL.createObjectURL(file2);
      this.pdfViewerActividades.pdfSrc = link;
      this.pdfViewerActividades.refresh();
 
        this.bloquearPag = false;
 

    });

  }

  base64toBlob(base64Data, contentType): Blob {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  AnularDetallePrueba() {
    var anular = this.registroSeleccionado;
    var validado = 0;
    this.lstAnularAdmisionDetalle = [];
    console.log("data del registro seleccionado", anular);
    anular.forEach(element => {
      // if (element.Estado == 1 || element.Estado == 2) {
      if (element.hasOwnProperty("IdAdmision")) {
        if (element.Estado == 1) {

          var dtoAdmClini = new DtoPacienteClinica();

          dtoAdmClini.IdAdmServicio = element.IdAdmServicio;
          dtoAdmClini.IdAdmision = element.IdAdmision;
          dtoAdmClini.Linea = element.Linea;
          dtoAdmClini.IdOrdenAtencion = element.IdOrdenAtencion;
          dtoAdmClini.CodigoComponente = element.CodigoComponente;
          dtoAdmClini.Descripcion = element.Descripcion;
          dtoAdmClini.Cantidad = element.Cantidad;
          dtoAdmClini.Valor = element.Valor;
          dtoAdmClini.Estado = element.Estado;
          dtoAdmClini.Sexo = element.Sexo;
          dtoAdmClini.UsuarioCreacion = element.UsuarioCreacion;
          dtoAdmClini.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
          dtoAdmClini.IpCreacion = element.IpCreacion;
          dtoAdmClini.IpModificacion = this.getIp();
          this.lstAnularAdmisionDetalle.push(dtoAdmClini);
          console.log("llegando toda la lista", this.dtofinal.list_AdmisionServicio);
        } else {
          validado = 1

          this.toastMensaje('El examen debe estar en pendiente para proceder la anulación.', 'warning', 2000);
          this.registroSeleccionado = null;

        }
      } else {
        validado = 1
        this.toastMensaje('No se puede anular Examen(es)', 'warning', 3000);
        this.registroSeleccionado = null;
      }

    });
    if (validado != 1) {
      this.pacienteClinicaService.anularAdmisionDetalle(4, this.lstAnularAdmisionDetalle, this.getUsuarioToken()).then(
        res => {
          this.auditoria(res.Admision, 2);
          this.bloquearPag = true;
          this.toastMensaje(`${res.Mensaje}`, 'success', 2000);      
          this.bloquearPag = false;
          console.log("llegando data del res anular admision", res);
          if (res.list_AdmisionServicio != null) {
            this.loading = true;
            this.lstListarXAdmision = [];
            var totala = 0;
            var cantidadExamenes = 0;
            var contadorsito = 1;
            res.list_AdmisionServicio.forEach(element => {
              // var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv; 
              // element.Valor = element.ValorEmpresa + ExamenConIgv;
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = element.Valor * element.Cantidad;
              totala += element.ValorEmpresa;
              element.numeroXadmision = contadorsito++;

              this.lstListarXAdmision.push(element);

            });
            this.lastYearTotal = totala;
            this.cantidad = cantidadExamenes;
            this.registroSeleccionado = null;
            this.loading = false;

            // this.mensajeController.resultado = res;


          } else {
            this.registroSeleccionado = null;
            this.toastMensaje(`${res.Mensaje}`, 'warning', 2000);
            // Swal.fire({
            //   icon: 'error',
            //   title: 'Oops...',
            //   text: `${res.Mensaje}`
            // })
          }
        }).catch(error => error)


    }
  }

  ValidarQuitarDetallePrueba() {
    var quitar = this.registroSeleccionado;
    console.log("ENTRO::")
    quitar.forEach(element => {
      if (element.hasOwnProperty("IdAdmision")) {
        console.log("ENTRO 1")
        this.QuitarDetallePrueba();
      } else {
        console.log("ENTRO 2")
        this.EliminarDetallePrueba();
      }
    });
  }

  EliminarDetallePrueba() {

    // this.lstListarXAdmision = this.lstListarXAdmision.filter(val => !eliExam.includes(val));
    this.lstListarXAdmision = this.lstListarXAdmision.filter(val => !this.registroSeleccionado.includes(val));

    this.registroSeleccionado = null;
    // var cont = this.lstListarXAdmision.length;
    var totaleliminar = 0
    var cantidadExamenes = 0
    var contardelete = 1
    if (this.lstListarXAdmision.length > 0) {
      this.lstListarXAdmision.forEach(element => {

        element.numeroXadmision = contardelete++;

        // element.numeroXadmision = cont ++;
        // var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv; 
        // element.Valor = element.ValorEmpresa + ExamenConIgv;    
        cantidadExamenes += element.Cantidad;
        element.ValorEmpresa = element.Valor * element.Cantidad;
        totaleliminar += element.ValorEmpresa;

      });
      this.lastYearTotal = totaleliminar;
      this.cantidad = cantidadExamenes;
    } else {
      this.lastYearTotal = 0;
      this.cantidad = 0;
    }

    this.toastMensaje('Se Quitó Examen(es)', 'success', 3000);

  }

  QuitarDetallePrueba() {
    this.bloquearPag = true;
    var quitar = this.registroSeleccionado;
    var validado = 0;
    console.log("data del registro seleccionado", quitar);
    this.lstAnularAdmisionDetalle = [];
    quitar.forEach(element => {
      if (element.Estado == 1) {
        var dtoAdmClini = new DtoPacienteClinica();
        dtoAdmClini.IdAdmServicio = element.IdAdmServicio;
        dtoAdmClini.IdAdmision = element.IdAdmision;
        dtoAdmClini.Linea = element.Linea;
        dtoAdmClini.IdOrdenAtencion = element.IdOrdenAtencion;
        dtoAdmClini.CodigoComponente = element.CodigoComponente;
        dtoAdmClini.Descripcion = element.Descripcion;
        dtoAdmClini.Cantidad = element.Cantidad;
        dtoAdmClini.Valor = element.Valor;
        dtoAdmClini.Estado = element.Estado;
        dtoAdmClini.Sexo = element.Sexo;
        dtoAdmClini.UsuarioCreacion = element.UsuarioCreacion;
        dtoAdmClini.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
        dtoAdmClini.IpCreacion = element.IpCreacion;
        dtoAdmClini.IpModificacion = this.getIp();
        this.lstAnularAdmisionDetalle.push(dtoAdmClini);

      }
      if (element.Estado != 1) {
        validado = 1
        this.registroSeleccionado = null;
        this.toastMensaje(`Ya no se puede eliminar Examen(es).`, 'warning', 2000);
        this.bloquearPag = false;
      }
    });
    if (validado != 1) {
      this.pacienteClinicaService.anularAdmisionDetalle(5, this.lstAnularAdmisionDetalle, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          this.auditoria(res.Admision, 2);
          this.toastMensaje(`${res.Mensaje}`, 'success', 2000);
          if (res.list_AdmisionServicio.length > 0) {
            this.loading = true;
            this.lstListarXAdmision = [];
            var totala = 0;
            var cantidadExamenes = 0;
            var contadorsito = 1;
            res.list_AdmisionServicio.forEach(element => {
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = element.Valor * element.Cantidad;
              totala += element.ValorEmpresa;
              element.numeroXadmision = contadorsito++;
              this.lstListarXAdmision.push(element);
            });
            this.lastYearTotal = totala;
            this.cantidad = cantidadExamenes;
            this.registroSeleccionado = null;
            this.loading = false;
          } else {
            this.registroSeleccionado = null;
            this.lstListarXAdmision = [];
            this.lastYearTotal = 0;
            this.cantidad = 0;
          }
        }).catch(error => error)

    }
  }

  ValidateAnular() {

    let valida = false;
    let salida = "Los examen(es) debe estar en pendiente para proceder la anulación.";


    this.lstListarXAdmision.forEach(element => {

      if (valida == false) {
        if (element.Estado == 1) {
          salida = null;
          valida = true;
        }
      }
    });

    return salida;
  }

  AnularAdmision(admision: DtoPacienteClinica) {

    var validar = this.ValidateAnular();
    console.log("llegando ", validar);
    if (validar != null) {
      //this.mostrarMensaje(valida, 'warn');

      Swal.fire({
        icon: 'warning',
        title: `¡Mensaje!`,
        text: validar
      })

    } else {
      Swal.fire({
        title: '¡Importante!',
        text: "¿Seguro que desea anular el registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#094d74',
        cancelButtonColor: '#ffc72f',
        cancelButtonText: 'No, Cancelar!',
        confirmButtonText: 'Si, Anular!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Swal.fire(
          //   'Mensaje!',
          //   'El Pedido debe estar Registrado para Anularse',
          //   'warning'
          // )

          // var serv = this.registroSeleccionado;
          // console.log("Registro seleccionado anular", serv)
          console.log("filtro del anular admision despues", this.filtro);
          this.dtofinal.Admision.TipoDocumento = this.filtro.TipoDocumento;
          this.dtofinal.Admision.Documento = this.filtro.Documento;
          this.dtofinal.Admision.NombreCompleto = this.filtro.NombreCompleto;
          this.dtofinal.Admision.fechanacimiento = new Date(this.filtro.FechaNacimiento);
          this.dtofinal.Admision.nombres = this.filtro.Nombres;
          this.dtofinal.Admision.apellidopaterno = this.filtro.ApellidoPaterno;
          this.dtofinal.Admision.apellidomaterno = this.filtro.ApellidoMaterno;
          this.dtofinal.Admision.sexo = this.filtro.Sexo;
          this.dtofinal.Admision.CorreoElectronico = this.filtro.CorreoElectronico;
          this.dtofinal.Admision.IdAdmision = admision.IdAdmision; //normal registraria sin llamarlo cunado es 1
          this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
          this.dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;
          console.log("TIPO OPERACION", this.dtofinal.Admision.TipoOperacionID);
          this.dtofinal.Admision.Persona = this.filtro.Persona; //viene de un metodo persona
          this.dtofinal.Admision.FechaAdmision = new Date(admision.FechaAdmision);
          this.dtofinal.Admision.HistoriaClinica = this.filtro.CodigoHC;
          this.dtofinal.Admision.NroPeticion = this.filtro.NroPeticion;
          this.dtofinal.Admision.OrdenAtencion = this.filtro.OrdenAtencion;
          this.dtofinal.Admision.MedicoId = this.filtro.MedicoId;
          this.dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
          this.dtofinal.Admision.Estado = admision.Estado;
          this.dtofinal.Admision.FechaCreacion = new Date(admision.FechaCreacion);
          this.dtofinal.Admision.FechaModificacion = new Date();
          this.dtofinal.Admision.UsuarioCreacion = admision.UsuarioCreacion; //derrepente pasando nulo
          this.dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
          this.dtofinal.Admision.IpCreacion = admision.IpCreacion;   //crear metodo que nos muestre la IP del usuario
          this.dtofinal.Admision.IpModificacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
          console.log("IP LLEGANDOOOOOO:::", this.dtofinal.Admision.IpModificacion);
          this.dtofinal.Admision.IdEmpresaPaciente = this.filtro2.Persona;
          this.dtofinal.Admision.IdAseguradora = this.filtro.IdAseguradora;
          this.dtofinal.Admision.TipoOrden = this.filtro.TipoOrden;
          this.dtofinal.Admision.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;
          // this.dtofinal.Admision.TipoPaciente=admision.TipoPaciente;
          this.dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
          // this.dtofinal.Admision.TipoOrdenAtencion=admision.TipoOrdenAtencion;
          this.dtofinal.Admision.TipoAtencion = admision.TipoAtencion;
          this.dtofinal.Admision.DesEstado = admision.DesEstado;
          this.dtofinal.Admision.TIPOADMISIONID = 1; //admision.TIPOADMISIONID;
          this.dtofinal.Admision.FlatAprobacion = admision.FlatAprobacion;
          console.log("llegando toda cabecera", this.dtofinal.Admision);
          this.dtofinal.list_AdmisionServicio = [];

          this.lstListarXAdmision.forEach(element => {

            // serv.forEach(element => {
            var dtoAdmClini = new DtoAdmisionclinicaDetalle();           
            dtoAdmClini.IdAdmServicio = element.IdAdmServicio;
            dtoAdmClini.IdAdmision = element.IdAdmision;
            dtoAdmClini.Linea = element.Linea;
            dtoAdmClini.IdOrdenAtencion = element.IdOrdenAtencion;
            dtoAdmClini.CodigoComponente = element.CodigoComponente;
            dtoAdmClini.Descripcion = element.Descripcion;
            dtoAdmClini.Cantidad = element.Cantidad;
            dtoAdmClini.Valor = element.Valor;
            dtoAdmClini.Estado = element.Estado;
            dtoAdmClini.Sexo = element.Sexo;
            // dtoAdmClini.CodigoComponente=element.Componente;
            dtoAdmClini.UsuarioCreacion = element.UsuarioCreacion;
            dtoAdmClini.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
            dtoAdmClini.IpCreacion = element.IpCreacion;
            dtoAdmClini.IpModificacion = this.getIp();
            this.dtofinal.list_AdmisionServicio.push(dtoAdmClini);
            console.log("llegando toda la lista", this.dtofinal.list_AdmisionServicio)
          });

          this.dtofinal.IndicadorWS = 0;
          console.log("dto a anular admision:", this.dtofinal);
          // this.pacienteClinicaService.mantenimientoAdmisionClinica(3, this.dtofinal).then(
          this.pacienteClinicaService.mantenimientoAdmisionClinica(3, this.dtofinal, this.getUsuarioToken()).then(
            res => {
              this.auditoria(res.Admision, 2);
              this.bloquearPag = true;
              this.toastMensaje('Se Anuló el registro con éxito.', 'success', 2000);
                this.bloquearPag = false;
              if (res.list_AdmisionServicio != null) {
                this.loading = true;
                this.lastYearTotal = 0;
                this.contado = 1;
                this.lstListarXAdmision = [];
                var totala = 0;
                var cantidadExamenes = 0;
                res.list_AdmisionServicio.forEach(element => {
                  // var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv; 
                  // element.Valor = element.ValorEmpresa + ExamenConIgv;  
                  cantidadExamenes += element.Cantidad;
                  element.ValorEmpresa = element.Valor * element.Cantidad;
                  totala += element.ValorEmpresa;
                  // var contadorsito = 1;
                  element.numeroXadmision = this.contado++;
                  this.lstListarXAdmision.push(element);
                });
                // this.lstListarXAdmision = res.list_AdmisionServicio
                this.cantidad = cantidadExamenes;
                this.lastYearTotal = totala;
                this.loading = false;


              } else {
                this.toastMensaje(`${res.Mensaje}`, 'warning', 2000);
                // Swal.fire({
                //   icon: 'error',
                //   title: 'Oops...',
                //   text: `${res.Mensaje}`
                // })
              }
            }).catch(error => error)


        }
      })
    }


  }

  enterCantidad(evento) {
    if (evento.key == "Enter" || evento.key == "Tab") {
      var cantidadExamenes = 0
      var cantidadXexamenes = 0
      this.cantidad = 0
      this.lstListarXAdmision.forEach(e => {
        if (e.Cantidad <= 0 || this.esNumeroVacio(e.Cantidad)) {
          e.Cantidad = 1;
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: 'Cantidad ingresada no valida',
            confirmButtonColor: '#094d74',
            confirmButtonText: 'OK'
          })
        }
        cantidadExamenes += e.Cantidad;
        e.ValorEmpresa = e.Cantidad * e.Valor;
        cantidadXexamenes += e.ValorEmpresa;
      });
      this.cantidad = cantidadExamenes;
      this.lastYearTotal = cantidadXexamenes;
    }
  }


  selectedItemTipoAtencion(event) {
    if (event.value == 2) {
      this.editarCampoNroCama = false;
    } else {
      this.editarCampoNroCama = true;
    }

  }
  selectedItemServicio(event) {
    if (event.value == "02") {
      this.editarCantidad = false;
    } else {
      this.editarCantidad = true;
    }
    if (this.lstListarXAdmision.length > 0) {
      if (this.seleccionarItemServicioTemp != event.value) {
        var mensaje = "Este Examen " + this.lstListarXAdmision[0].CodigoComponente + " no tiene configurado este servicio: " + event.value;
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: mensaje
        }).then((result) => {
          if (result.isConfirmed) {
            if (this.admision != null) {
              this.filtro.ClasificadorMovimiento = this.admision.ClasificadorMovimiento;
              console.log("COMBO SERVICIO DESDE ADMISION", this.admision.ClasificadorMovimiento);
            } else {
              this.filtro.ClasificadorMovimiento = this.seleccionarItemServicioTemp;
            }
          } else if (result.isDenied) {


          }
        })



      }

    }

  }


  ValidarGuardar(admision: DtoPacienteClinica) {
    let valida = this.ValidateFiles();


    if (valida != null) {
      //this.mostrarMensaje(valida, 'warn');

      Swal.fire({
        icon: 'warning',
        title: `¡Completar Campos Obligatorios!`,
        text: valida
      })

    } else {
      let validaCMP = this.ValidateCMP();
      if (validaCMP == null) {
        Swal.fire({
          title: '¡Importante!',
          text: "¿Seguro que desea guardar el registro?" + " " + this.filtro.Documento,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#094d74',
          cancelButtonColor: '#ffc72f',
          cancelButtonText: 'No, Cancelar!',
          confirmButtonText: 'Si, Guardar!'
        }).then((result) => {
          if (result.isConfirmed) {

            this.GuardarAdmision(admision);

          }
        })

      } else {
        Swal.fire({
          title: '¡Mensaje!',
          text: validaCMP,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#094d74',
          cancelButtonColor: '#ffc72f',
          cancelButtonText: 'No, Cancelar!',
          confirmButtonText: 'Si, Continuar!'
        }).then((result) => {
          if (result.isConfirmed) {
            if (this.esNumeroVacio(this.filtro.MedicoId)) {
              var filtro = new FiltroPacienteClinica();
              filtro.CMP = "0"
              this.servicioListarMedico(filtro);
            }
            Swal.fire({
              title: '¡Importante!',
              text: "¿Seguro que desea guardar el registro?" + " " + this.filtro.Documento,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#094d74',
              cancelButtonColor: '#ffc72f',
              cancelButtonText: 'No, Cancelar!',
              confirmButtonText: 'Si, Guardar!'
            }).then((result) => {
              if (result.isConfirmed) {

                this.GuardarAdmision(admision);

              }
            })

          }
        })

      }
    }
    this.loading = false;
    this.bloquearPag = false;
  }

  GuardarAdmision(admision: DtoPacienteClinica) {
    this.bloquearPag = true;
    let _dtofinal = new TraerXAdmisionServicio();
    var serv = this.registroSeleccionado;
    var indicaRegis = 0;
    console.log("Admision DTO GuardarAdmision", admision);
    console.log("Admision filtro", this.filtro);
    console.log("Admision registroSeleccionado", this.registroSeleccionado);
    if (admision == null) 
      {

      }
    else
      {
        //if (this.estaVacio(admision.NroPeticion)) 
        if (this.estaVacio(admision.NroPeticion)) 
        {

        }
        else
        {
          var indicaRegis = 1;
        }
      }

    if (indicaRegis == 1) 
    {
      var serv = this.registroSeleccionado;
      this.dtofinal.Admision.TipoDocumento = this.filtro.TipoDocumento;
      this.dtofinal.Admision.Documento = this.filtro.Documento;
      this.dtofinal.Admision.NombreCompleto = this.filtro.NombreCompleto;
      this.dtofinal.Admision.fechanacimiento = new Date(this.filtro.FechaNacimiento);
      this.dtofinal.Admision.nombres = this.filtro.Nombres;
      this.dtofinal.Admision.apellidopaterno = this.filtro.ApellidoPaterno;
      this.dtofinal.Admision.apellidomaterno = this.filtro.ApellidoMaterno;
      this.dtofinal.Admision.sexo = this.filtro.Sexo;
      this.dtofinal.Admision.CorreoElectronico = this.filtro.CorreoElectronico;
      this.dtofinal.Admision.IdAdmision = admision.IdAdmision;
      this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
      this.dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;
      this.dtofinal.Admision.Persona = this.filtro.Persona; //viene de un metodo persona
      this.dtofinal.Admision.FechaAdmision = new Date(admision.FechaLimiteAtencion);
      this.dtofinal.Admision.HistoriaClinica = this.filtro.CodigoHC;
      this.dtofinal.Admision.NroPeticion = this.filtro.NroPeticion;
      this.dtofinal.Admision.OrdenAtencion = this.filtro.OrdenAtencion;
      this.dtofinal.Admision.OrdenSinapa = this.filtro.OrdenSinapa;
      this.dtofinal.Admision.MedicoId = this.filtro.MedicoId;
      this.dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
      this.dtofinal.Admision.Estado = admision.Estado;
      this.dtofinal.Admision.FechaCreacion = new Date(admision.FechaCreacion);
      this.dtofinal.Admision.FechaModificacion = new Date();
      this.dtofinal.Admision.UsuarioCreacion = admision.UsuarioCreacion; //derrepente pasando nulo
      this.dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
      this.dtofinal.Admision.IpCreacion = admision.IpCreacion;   //crear metodo que nos muestre la IP del usuario
      this.dtofinal.Admision.IpModificacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
      this.dtofinal.Admision.IdEmpresaPaciente = this.filtro2.Persona;
      this.dtofinal.Admision.IdAseguradora = this.filtro.IdAseguradora;
      this.dtofinal.Admision.TipoOrden = this.filtro.TipoOrden;
      this.dtofinal.Admision.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;
      this.dtofinal.Admision.Cama = this.filtro.Cama;
      this.dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
      this.dtofinal.Admision.TipoAtencion = this.filtro.TipoAtencion;
      this.dtofinal.Admision.DesEstado = admision.DesEstado;
      this.dtofinal.Admision.TIPOADMISIONID = 1; //admision.TIPOADMISIONID;
      this.dtofinal.Admision.FlatAprobacion = admision.FlatAprobacion;
      this.dtofinal.Admision.ObservacionAlta = this.filtro.ObservacionAlta;
      this.dtofinal.list_AdmisionServicio = [];
      serv.forEach(element => {
        var dtoAdmClini = new DtoAdmisionclinicaDetalle();
        dtoAdmClini.IdAdmServicio = element.IdAdmServicio;
        dtoAdmClini.IdAdmision = element.IdAdmision;
        dtoAdmClini.Linea = element.Linea;
        dtoAdmClini.IdOrdenAtencion = element.IdOrdenAtencion;
        dtoAdmClini.CodigoComponente = element.CodigoComponente;
        dtoAdmClini.Descripcion = element.Descripcion;
        dtoAdmClini.Cantidad = element.Cantidad;
        dtoAdmClini.Valor = element.Valor;
        dtoAdmClini.Estado = element.Estado;
        dtoAdmClini.Sexo = element.Sexo;
        dtoAdmClini.UsuarioCreacion = element.UsuarioCreacion;
        dtoAdmClini.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
        dtoAdmClini.IpCreacion = element.IpCreacion;
        dtoAdmClini.IpModificacion = this.getIp();
        this.dtofinal.list_AdmisionServicio.push(dtoAdmClini);
      });
      this.dtofinal.IndicadorWS = 0;
      this.dtofinal.Admision.ObservacionAlta=this.filtro.ObservacionAlta;    

      console.log("DTO  GUARDAR", this.dtofinal);
      this.pacienteClinicaService.mantenimientoAdmisionClinica(2, this.dtofinal, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          this.auditoria(res.Admision, 2);
          if (this.estaVacio(res.Mensaje)) {
            this.toastMensaje('Se actualizó el registro con éxito.', 'success', 2000);
          } else {
            if (res.valor == 1) {
              this.toastMensaje(`${res.Mensaje}`, 'success', 3000);
            } else {
              this.toastMensaje(`${res.Mensaje}`, 'warning', 3000);
            }
          } 

          if (res.list_AdmisionServicio[0].hasOwnProperty("CodigoComponente")) {
            this.lstListarXAdmision = [];
            this.lastYearTotal = 0;
            var totala = 0;
            var cantidadExamenes = 0;
            var contadorsito = 1;
            res.list_AdmisionServicio.forEach(element => {
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = element.Valor * element.Cantidad;
              totala += element.ValorEmpresa;
              element.numeroXadmision = contadorsito++;
              this.lstListarXAdmision.push(element);
            });
            this.editarCampoMedico = true;
            this.editarCampoAseguradora = true;
            this.editarCampoEmpresa = true;
            this.lastYearTotal = totala;
            this.cantidad = cantidadExamenes;
            this.registroSeleccionado = null;
            this.verBtnAnular = true;
            this.colCard1 = "col-sm-3"
            this.colCard2 = "col-sm-6"
            this.editarCampos = true;
            this.editarDetallePrueba = true;
            this.editarCampoSevicio = false;
            this.loading = false;
          } else {
            Swal.fire({
              icon: 'warning',
              title: '¡Mensaje!',
              text: `${res.Mensaje}`
            })
          }
        }).catch(error => error)
    }
    else {
      console.log("DTO  admision", this.filtro);
      _dtofinal.Admision.TipoDocumento = this.filtro.TipoDocumento;
      _dtofinal.Admision.Documento = this.filtro.Documento;
      _dtofinal.Admision.NombreCompleto = this.filtro.NombreCompleto;
      _dtofinal.Admision.fechanacimiento = new Date(this.filtro.FechaNacimiento);
      _dtofinal.Admision.nombres = this.filtro.Nombres;
      _dtofinal.Admision.apellidopaterno = this.filtro.ApellidoPaterno;
      _dtofinal.Admision.apellidomaterno = this.filtro.ApellidoMaterno;
      _dtofinal.Admision.sexo = this.filtro.Sexo;
      _dtofinal.Admision.CorreoElectronico = this.filtro.CorreoElectronico;
      _dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
      _dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;
      _dtofinal.Admision.Persona = this.filtro.Persona; //viene de un metodo persona
      _dtofinal.Admision.FechaAdmision = new Date();
      _dtofinal.Admision.HistoriaClinica = this.filtro.CodigoHC;
      _dtofinal.Admision.NroPeticion = null;
      _dtofinal.Admision.OrdenAtencion = this.filtro.OrdenAtencion;
      _dtofinal.Admision.MedicoId = this.filtro.MedicoId;
      _dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
      _dtofinal.Admision.Estado = 1;
      _dtofinal.Admision.FechaCreacion = new Date();
      _dtofinal.Admision.FechaModificacion = new Date();
      _dtofinal.Admision.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;//derrepente pasando nulo
      _dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
      _dtofinal.Admision.IpCreacion = this.getIp();   //crear metodo que nos muestre la IP del usuario
      _dtofinal.Admision.IpModificacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
      _dtofinal.Admision.IdEmpresaPaciente = this.filtro2.Persona;
      _dtofinal.Admision.IdAseguradora = this.filtro.IdAseguradora;
      _dtofinal.Admision.TipoOrden = this.filtro.TipoOrden;
      _dtofinal.Admision.TipoAtencion = this.filtro.TipoAtencion;
      _dtofinal.Admision.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;
      _dtofinal.Admision.Cama = this.filtro.Cama;
      _dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
      _dtofinal.Admision.ObservacionAlta = this.filtro.ObservacionAlta;
      _dtofinal.Admision.TIPOADMISIONID = 1;

      serv.forEach(element => {
        var dtoAdmClini = new AdmisionServicio();
        dtoAdmClini.CodigoComponente = element.CodigoComponente;
        dtoAdmClini.Descripcion = element.Descripcion;
        dtoAdmClini.Cantidad = element.Cantidad;
        dtoAdmClini.Valor = element.Valor;
        dtoAdmClini.Estado = element.Estado;
        dtoAdmClini.Sexo = element.Sexo;
        dtoAdmClini.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();
        dtoAdmClini.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario.trim();
        dtoAdmClini.IpCreacion = this.getIp();
        dtoAdmClini.IpModificacion = this.getIp();
        _dtofinal.list_AdmisionServicio.push(dtoAdmClini);
      });
      _dtofinal.IndicadorWS = 0;
      this.bloquearPag = true;
      this.loading = true;
      this.pacienteClinicaService.mantenimientoAdmisionClinica(1,_dtofinal, this.getUsuarioToken())
      .then(
        res => {
          this.bloquearPag = false;
          this.loading = false;
          console.log("data registrada:",res)
          this.toastMensaje(`${res.Mensaje}`, 'warning', 3000);    
          if (res.valor > 0) {  
            this.admision = res.Admision;
            this.filtro.NroPeticion = res.Admision.NroPeticion;
            if (res.list_AdmisionServicio[0].hasOwnProperty("CodigoComponente")) 
            {
              this.lstListarXAdmision = [];
              this.lastYearTotal = 0;
              var totala = 0;
              var cantidadExamenes = 0;
              var contadorsito = 1;
              res.list_AdmisionServicio.forEach(element => {
                console.log("valor de e", element)
                cantidadExamenes += element.Cantidad;
                element.ValorEmpresa = element.Valor * element.Cantidad;
                totala += element.ValorEmpresa;
                element.numeroXadmision = contadorsito++;
                this.lstListarXAdmision.push(element);
              });
			  this.auditoria(res.Admision, 2);
              this.editarCampoMedico = true;
              this.editarCampoAseguradora = true;
              this.editarCampoEmpresa = true;
              this.lastYearTotal = totala;
              this.cantidad = cantidadExamenes;
              this.registroSeleccionado = null;
              this.verBtnAnular = true;
              this.colCard1 = "col-sm-3"
              this.colCard2 = "col-sm-6"
              this.editarCampos = true;
              this.editarDetallePrueba = true;
              this.editarCampoOA = true;
              this.editarCampoSevicio = false;
              this.admision = res.Admision;
              this.filtro.NroPeticion = res.Admision.NroPeticion;
            }
          }
        });
    
    }

  }

  ValidateCMP() {
    if (this.filtro.CMP == "0" || this.esNumeroVacio(this.filtro.MedicoId)) {
      return "Esta guardando la petición con medico automático, ¿Desea continuar?"
    }
    return null;
  }

  ValidateFiles() {


    if (this.esNumeroVacio(this.filtro.Telefono)) {


      return "El paciente no tiene un número de teléfono.";

    }
    if (this.estaVacio(this.filtro.CodigoHC)) {


      return "Seleccionar la historia clinica.";

    }
    if (this.estaVacio(this.filtro.OrdenAtencion)) {


      return "Seleccionar la OA.";

    }
    // if (this.esNumeroVacio(this.filtro.MedicoId)) {


    //   return "Seleccionar al médico.";

    // }
    if (this.estaVacio(this.filtro.NombreEmpresa)) {


      return "Seleccionar la aseguradora.";

    }
    // if (this.registroSeleccionado.length < 1) {
    if (this.esListaVacia(this.registroSeleccionado)) {


      return "Seleccionar un servicio como minimo con estado pendiente antes de grabar la OA.";

    }
    if (this.esNumeroVacio(this.filtro.IdEspecialidad)) {


      return "Seleccionar la procedencia.";

    }
    if (this.esNumeroVacio(this.filtro.comboCliente)) {


      return "Seleccionar al cliente.";

    }
    if (this.estaVacio(this.filtro.TipoOrden)) {


      return "Seleccionar el tipo orden.";

    }
    if (this.esNumeroVacio(this.filtro.TipoAtencion)) {



      return "Seleccionar el tipo atención.";

    }
    if (this.esNumeroVacio(this.filtro.TipoOperacionID)) {

      return "Seleccionar el tipo operación.";

    }

    return null;
  }

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }
  // ListadoPersona(){


  //   if (this.filtro.NombreCompleto == null) {
  //     console.log("Nombre completo VACIO")

  //   } else {

  //     let Documento = { Documento: this.filtro.Documento }
  //     this.personaService.listarpaginado(Documento).then((res) => {
  //       this.MultEditPersona = res;
  //       console.log("Llamando listado de persona", this.MultEditPersona)

  //      });

  //   }
  // }


  verSelectorPaciente(): void {
    // this.personaBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), 'BUSCAR',"N");
  }
  verSelectorMedico(): void {
    // this.personaBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
    this.medicoBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECMEDICO', 'BUSCAR'), 'BUSCAR');
  }
  verSelectorAseguradora(): void {
    // this.personaBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
    this.aseguradoraBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECASEGURADORA', 'BUSCAR'), 'BUSCAR');
  }
  verSelectorEmpresa(): void {
    // this.personaBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
    this.empresaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECEMPRESA', 'BUSCAR'), 'BUSCAR');
  }
  verSelectorExamen(): void {
    // this.examenBuscarComponent.iniciarComponente("BUSCAR EXAMENES", this.objetoTitulo.menuSeguridad.titulo)
    this.examenBuscarComponent.coreIniciarComponenteBuscar(new MensajeController(this, 'BUSCEXAM', ''), 'BUSCAR', 1, this.filtro);
    // this.aseguradoraMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAASEGURADORA', ''),"VER",rowdata);

  }

  comboComboSexo() {
    this.lstSexo = [];
    this.lstSexo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "SEXO").forEach(i => {
      this.lstSexo.push({ label: i.Nombre, value: i.Codigo })

    });
  }
  comboComboTipoOrden() {
    this.lstTipoOrden = [];
    this.lstTipoOrden.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOORDEN").forEach(i => {
      this.lstTipoOrden.push({ label: i.Nombre, value: i.Codigo })
    });
    this.filtro.TipoOrden = "R";
    console.log("Clinica comboComboTipoOrden", this.lstTipoOrden);
  }

  selectedItemProcedencia(event) {
    var change = this.seleccionarItemMedicoTemp;
    if (this.filtro.MedicoId != null) {
      if (this.seleccionarItemMedicoTemp != event.value) {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: 'La procedencia seleccionada no pertenece al médico.'
        }).then((result) => {
          if (result.isConfirmed) {
            this.filtro.IdEspecialidad = change;
          } else if (result.isDenied) {


          }
        })
      }


    }
  }

  MostrarMedico(MedicoId) {
    console.log("ID LLEGANDO MEDICO", MedicoId);
    // var tempdto = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
    // var filtro = new dtoPersona();
    var dtoadmin = new FiltroPacienteClinica();
    // var tempfiltro = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
    dtoadmin.MedicoId = MedicoId;

    // var MedicoId = { MedicoId: dtoadmin.MedicoId }
    // console.log("data listado ID MEDICO:", MedicoId);
    return this.medicoService.listarpaginado(dtoadmin).then((res) => {
      console.log("mostrar medico", res)
      if (res[0].MedicoId == 0) {
        this.filtro.CMP = res[0].MedicoId;
      } else {
        this.filtro.CMP = res[0].CMP;
      }
      if (!this.estaVacio(res[0].Busqueda)) {
        this.filtro.Busqueda = res[0].Busqueda;
      } else {
        this.filtro.Busqueda = res[0].Nombres;
      }
      this.filtro.MedicoId = res[0].MedicoId;

    });

  }


  MostrarAseguradora(IdAseguradora) {
    console.log("ID LLEGANDO ASEGURADORA", IdAseguradora);
    // var tempdto = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
    var filtro = new dtoPersona();
    filtro.IdAseguradora = IdAseguradora;
    // let IdAseguradora = { IdAseguradora: this.filtro.IdAseguradora }

    // console.log("data listado ID ASEGURADORA:", IdAseguradora);

    return this.aseguradoraService.listarpaginado(filtro).then((res) => {
      console.log("mostrar aseguradora", res)
      this.filtro.IdAseguradora = res[0].IdAseguradora;
      this.filtro.NombreEmpresa = res[0].NombreEmpresa;
      this.filtro.TipoOrdenAtencion = res[0].TipoAseguradora;

    });
  }

  MostrarEmpresa(idpersona, id) {
    this.bloquearPag = true;
    var dtopersona = new dtoPersona();
    dtopersona.Persona = idpersona;

    return this.personaService.listarXPersona(dtopersona).then((res) => {
      //persona
      if (id == 1) {
        if (this.estaVacio(res[0].NombreCompleto)) {
          this.filtro.NombreCompleto = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`

        } else {
          this.filtro.NombreCompleto = res[0].NombreCompleto;
        }
        console.log("Clinica MostrarPersona: ", res);
        this.listadoHistoriaClinica(res[0].Persona);
        this.filtro.Documento = res[0].Documento;
        console.log("Clinica listarConsentimientoXdocumento TipoOperacionID: ", this.filtro.TipoOperacionID);
        
        this.listarConsentimientoXdocumento(res[0].Documento);
        this.filtro.CorreoElectronico = res[0].CorreoElectronico;
        this.filtro.Sexo = res[0].Sexo;
        this.filtro.FechaNacimiento = new Date(res[0].FechaNacimiento);
        this.CalcularAnios();
        this.filtro.Persona = res[0].Persona;
        this.filtro.TipoDocumento = res[0].TipoDocumento;
        this.filtro.Nombres = res[0].Nombres;
        this.filtro.ApellidoPaterno = res[0].ApellidoPaterno;
        this.filtro.ApellidoMaterno = res[0].ApellidoMaterno;
        this.filtro.Telefono = res[0].Telefono;
        console.log("el Telefono es: ", this.filtro.Telefono);
        this.bscPersona = null
        this.bscPersona = res[0];
        this.filtro.Comentario = res[0].Comentario;
      }
      //empresa
      if (id == 2) {
        this.filtro2.DocumentoFiscal = res[0].Documento;
        this.filtro2.NombreCompleto = res[0].NombreCompleto;
        this.filtro2.Persona = res[0].Persona;
      }
      this.bloquearPag = false;


    });


  }

  guardarOAmedico(oamedico) {
    console.log("IDMEDICO CONSULTAR OA", oamedico);
    var dtoadmin = new FiltroPacienteClinica();
    dtoadmin.MedicoId = oamedico;
    this.bloquearPag = true;
    return this.medicoService.listarpaginado(dtoadmin).then((res) => {
      this.bloquearPag = false;
      console.log("oa medico", res);
      if(res != null){
        if (res[0].MedicoId == 0) {
          this.filtro.CMP = res[0].MedicoId;
        } else {
          this.filtro.CMP = res[0].CMP;
        }
        if (!this.estaVacio(res[0].Busqueda)) {
          this.filtro.Busqueda = res[0].Busqueda;
        } else {
          this.filtro.Busqueda = res[0].Nombres;
        }
        this.filtro.MedicoId = res[0].MedicoId;
      }

    });

  }

  guardarOAaseguradora(oaaseguradora) {

    var dtoadmin = new FiltroPacienteClinica();
    dtoadmin.IdAseguradora = oaaseguradora;

    this.bloquearPag = true;
    return this.aseguradoraService.listarpaginado(dtoadmin).then((res) => {
      this.bloquearPag = false;
      console.log("oa aseguradora", res);
      if(res !=null){
        this.filtro.IdAseguradora = res[0].IdAseguradora;
        this.filtro.NombreEmpresa = res[0].NombreEmpresa;
        this.filtro.TipoOrdenAtencion = res[0].TipoAseguradora;
      }
   


    });

  }

  guardarOAempresa(oaempresa) {

    var dtoadmin = new FiltroPacienteClinica();
    dtoadmin.Persona = oaempresa;
    this.bloquearPag = true;
    return this.personaService.listarXPersona(dtoadmin).then((res) => {
      this.bloquearPag = false;
      if(res !=null){
        this.filtro2.DocumentoFiscal = res[0].Documento;
        this.filtro2.NombreCompleto = res[0].NombreCompleto;
        this.filtro2.Persona = res[0].Persona;
      }
    });

  }

  guardarOAPersona(oaempresa) {
    var dtoadmin = new FiltroPacienteClinica();
    dtoadmin.Persona = oaempresa;
    this.bloquearPag = true;
    return this.personaService.listarXPersona(dtoadmin).then((res) => {
      this.bloquearPag = false;
      if(res !=null){

        this.filtro.Documento = res[0].Documento;
        if (this.estaVacio(res[0].NombreCompleto)) {
          this.filtro.NombreCompleto = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`
        } else {
          this.filtro.NombreCompleto = res[0].NombreCompleto;
        }
        this.filtro.Persona = res[0].Persona;
        this.filtro.Telefono = res[0].Telefono;
        this.bscPersona = null;
        this.bscPersona = res[0];

      }
    });
  }

  grillaCargarDatos(event: LazyLoadEvent) {
    var tempfiltro = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
    console.log("grillaCargarDatos JSON.parse", tempfiltro)
   
    this.xadmision.IdAdmision = tempfiltro.IdAdmision;

    let idAdmision = { IdAdmision: this.xadmision.IdAdmision }
    this.loading = true;
    return this.consultaAdmisionService.listarXadmision(idAdmision).then((res) => {
      this.loading = false;
      this.filtro.TipoAtencion = res.Admision.TipoAtencion;
        this.filtro.ObservacionAlta = res.Admision.ObservacionAlta;     
      this.filtro.CoaSeguro = res.Admision.CoaSeguro;
      this.filtro.CorreoElectronico = res.Admision.CorreoElectronico;
      this.filtro.Telefono = res.Admision.Telefono;
      console.log("grillaCargarDatos", res)
      //this.disableBtnGuardar = false;
      if (res.Admision.IdEspecialidad != null) {
        this.filtro.IdEspecialidad = res.Admision.IdEspecialidad;
        // this.seleccionarItemMedicoTemp = tempfiltro.IdEspecialidad;
      } else {
        this.filtro.IdEspecialidad = 0;
        // this.seleccionarItemMedicoTemp = 0;
      }
      this.filtro.TipoAtencion= res.Admision.TipoAtencion;
      if (res.Admision.TipoAtencion == 2) {
        this.editarCampoNroCama = false;
      } else {
        this.editarCampoNroCama = true;
      }
      // this.bscPersona = res.Admision
      // console.log("valor pasando", this.bscPersona)
      this.contarExamenes = res.list_AdmisionServicio.length;
      var cantidadExamenes = 0;
      res.list_AdmisionServicio.forEach(element => {

        element.numeroXadmision = this.contado++;
        // var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv; 
        // element.Valor = element.ValorEmpresa + ExamenConIgv;   
        cantidadExamenes += element.Cantidad;
        element.ValorEmpresa = element.Valor * element.Cantidad;
        this.total += element.ValorEmpresa;
        this.lstListarXAdmision.push(element);
      });
      this.cantidad = cantidadExamenes;
      // this.cantidad = this.lstListarXAdmision.length;
      this.seleccionarItemPacienteTemp = this.filtro.TipoOperacionID;
      this.lastYearTotal = this.total;
    });

  }





  revertir() {
    // this.soap.createClient('./assets/calculator.wsdl')
    // .then(client => {
    //   console.log('Client', client);
    //   this.client = client;
    // })
    // .catch(err => console.log('Error', err));


    this.pacienteClinicaService.listarConsultaOa().then((res) => {
      console.log("response service::", res);
    });


  }

  eliminarprueba() {
    this.Auth = this.getUsuarioAuth();
    var prueba = this.Auth.data;
    console.log("datos del auth", prueba);
  }

  coreEliminar() {
    // filtro.accion="DELETE"
    // this.router.navigate(["precisa/admision/co_admisionclinica", this.ACCIONES.ELIMINAR, JSON.stringify(filtro)], { skipLocationChange: true });
  }

  comboCargarSedeEmpresa(IdEmpresa: number): Promise<number> {
    this.lstSedeEmpresa.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.consultaAdmisionService.listarAdmisionSede(IdEmpresa).then(resp => {
      resp.forEach(e => {
        this.lstSedeEmpresa.push({ label: e.SedDescripcion, value: e.IdSede });
        this.filtro.IdSedeEmpresa = e.IdSede;
      });
      return 1;
    });
  }

  comboCargarTipoOperacion(): Promise<number> {
    console.log("Clinica this.filtro", this.filtro);
    this.operacion.TipEstado=1;
    this.operacion.TIPOADMISIONID=1;
    this.operacion.Persona = this.filtro.comboCliente;
    this.operacion.IdSede = this.filtro.IdSede;
    this.lstTipoOperacion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.consultaAdmisionService.listarcombotipooperacion(this.operacion).then(resp => {   
      resp.forEach(e => {
        this.lstTipoOperacion.push({ label: e.Descripcion, value: e.TipoOperacionID });
      });
      console.log("Clinica comboCargarTipoOperacion", this.lstTipoOperacion);
      if(this.lstTipoOperacion.length > 1){
        this.filtro.TipoOperacionID = resp[0].TipoOperacionID;
        this.valorTipoPacienteId = resp[0].TipoOperacionID;
        this.IdConsentimiento = resp[0].FlaCon;
        this.seleccionarItemPacienteTemp = this.filtro.TipoOperacionID;
        sessionStorage.setItem('EntyOperacion', JSON.stringify(resp));
        this.listaPerfil();
      }
      return 1;
    });
  }

comboCargarCliente(): Promise<number> {
    this.lstcliente = [];
    this.Auth = this.getUsuarioAuth();
    var client = this.Auth.data;
    this.cliente.UneuNegocioId = client[0].UneuNegocioId;
    this.cliente.TipEstado = 1;
    this.cliente.IdSede = client[0].IdSede;
    this.filtro.IdSede  = this.cliente.IdSede;
    this.cliente.TIPOADMISIONID = 1;
    this.lstcliente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    var listaComboliente = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('comboCliente')));    
        if (!this.esListaVacia(listaComboliente)){
          listaComboliente.forEach(e => {
            this.lstcliente.push({ label: e.empresa, value: e.Persona });
            this.filtro.comboCliente = e.Persona;
            this.valorCliente = e.Persona;
          });    
        }else{
          return this.consultaAdmisionService.listarcombocliente(this.cliente).then(resp => {
            resp.forEach(e => {   
              this.lstcliente.push({ label: e.empresa, value: e.Persona }); 
              this.filtro.comboCliente = e.Persona;
              this.valorCliente = e.Persona;
            });     
            sessionStorage.setItem('comboCliente', JSON.stringify(resp));
            console.log("Clinica lista cliente", JSON.stringify(resp));
            console.log("sessionStorage cliente", sessionStorage);
            return 1;
          });
      }
  }

  comboCargarServicios(): Promise<number> {
    this.Auth = this.getUsuarioAuth();
    var service = this.Auth.data;
    this.servicio.Estado = 1;
    this.lstServicio.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.examenService.serviciopaginado(this.servicio).then(resp => {
      resp.forEach(e => {
        this.lstServicio.push({ label: e.Nombre, value: e.ClasificadorMovimiento });
        // this.filtro.ClasificadorMovimiento = service[0].ClasificadorMovimiento
      });
      this.filtro.ClasificadorMovimiento = service[0].ClasificadorMovimiento;
      console.log("Clinica combo ClasificadorMovimiento", resp);
      console.log("combo ClasificadorMovimiento", service[0]);
      return 1;
        });

  }

  comboCargarTipoAtencion() {
    this.lstTipoAtencion = [];
    this.lstTipoAtencion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOATENCION").forEach(i => {
      this.lstTipoAtencion.push({ label: i.Nombre, value: i.IdCodigo })
    });
    this.filtro.TipoAtencion = 1;
  }

  //Procedencia cambiar nombre
  comboCargarProcendia() {
    this.lstprocedencia = [];
    var lstComboprocedencia = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_Procendencia')));    
    if (!this.esListaVacia(lstComboprocedencia)){
        this.lstprocedencia.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
        lstComboprocedencia.forEach(e => {
        this.lstprocedencia.push({ label: e.Nombre, value: e.IdEspecialidad });   
        });
        console.log("Clinica combo CargarProcendia",  this.lstprocedencia);
        this.filtro.IdEspecialidad = 0;
      } 
  }

  llamarPersona() {
    let Documento = {
      Documento: this.filtro.Documento.trim(),
      tipopersona: "P",
      SoloBeneficiarios: "0",
      UneuNegocioId: "0"
    }
    return this.personaService.listaPersonaUsuario(Documento).then((res) => {  
      this.bscPersona = res[0];
      this.filtro.Telefono = res[0].Telefono;
    });

  }

  esCodigoExamenValido(event) {
    if (this.filtro.ClasificadorMovimiento != "04") {
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
  }


  validarTeclaEnterPaciente(evento) {
    if (evento.key == "Enter") {
      if (this.filtro.Documento == null) {
        this.toastMensaje('Ingrese un Nro. de documento', 'warning', 3000);
      }
      else if (this.filtro.Documento.trim().length <= 4) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
        this.filtro.Documento = null;
      } else {
          this.getPersonaServicio(this.filtro.Documento.trim(), 2);
      }
    }
  }


  OnBlurMethod() {
    var cantidadExamenes = 0
    var total = 0
    this.cantidad = 0

    this.lstListarXAdmision.forEach(e => {
      if (e.Cantidad <= 0 || this.esNumeroVacio(e.Cantidad)) {
        e.Cantidad = 1;
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: 'Cantidad ingresada no valida',
          confirmButtonColor: '#094d74',
          confirmButtonText: 'OK'
        })
      }
      cantidadExamenes += e.Cantidad;
      e.ValorEmpresa = e.Cantidad * e.Valor;
      total += e.ValorEmpresa;
    });
    this.cantidad = cantidadExamenes;
    this.lastYearTotal = total

  }

  esCantidad(event) {
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

  validarSedesConsentimiento() {
    if (this.getUsuarioAuth().data[0].IdSede == 8) {
      return 1
    }
    if (this.getUsuarioAuth().data[0].IdSede == 514) {
      return 1
    }
    if (this.getUsuarioAuth().data[0].IdSede == 526) {
      return 1
    }
    if (this.getUsuarioAuth().data[0].IdSede == 426) {
      return 1
    }
    if (this.getUsuarioAuth().data[0].IdSede == 524) {
      return 1
    }
    if (this.getUsuarioAuth().data[0].IdSede == 331) {
      return 1
    }
    if (this.getUsuarioAuth().data[0].IdSede == 64) {
      return 1
    }
    if (this.getUsuarioAuth().data[0].IdSede == 523) {
      return 1
    }
    return null;
  }

  listarConsentimientoXdocumento(documento: string) {
    var validarConsentimiento = this.validarSedesConsentimiento();
    if (validarConsentimiento == 1) {
      let Documento = {
        Documento: documento
      }
      this.bloquearPag = true;
      return this.personaService.listaConsentimiento(Documento).then((res) => {
        this.bloquearPag = false;
        if (!this.estaVacio(res[0].msn)) {
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            confirmButtonColor: '#094d74',
            text: res[0].msn,
          }).then((result) => {
            if (result.isConfirmed) {
              this.filtro.consentimiento = res[0].msn;
            } else {
              this.filtro.consentimiento = res[0].msn;
            }
          })
        }
      }).catch(error => error);
    }
  }

  getPersonaServicio(documento: any, validator: number) {
    console.log("mensaje documento", documento);
    let dto = {
      Documento: documento.trim(),
      tipopersona: "P",
      SoloBeneficiarios: "0",
      UneuNegocioId: "0"
    }
    return this.personaService.listaPersonaUsuario(dto).then((res) => {  
       console.log("mensaje del res", res);
       console.log("dataaaa", res.length);
       this.bloquearPag = false;
      if(res.length > 0){
        if (validator == 1) {
          this.bscPersona = null;
          this.bscPersona = res[0];
          this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONAEDITAR', ''), "EDITAR", 1, this.bscPersona);
        } else {
          
              if (this.estaVacio(res[0].NombreCompleto)) {
                console.log("Documento ==", res);
                this.filtro.NombreCompleto = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`
  
              } else {
                console.log("Documento !=", res);
                this.filtro.NombreCompleto = res[0].NombreCompleto;
              }
              this.disableBtnGuardar=true;
              this.listadoHistoriaClinica(res[0].Persona);
              this.filtro.Documento = res[0].Documento;
            
        /*      
             var EntyOperacion = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('EntyOperacion')));  
              console.log("Clinica listarConsentimientoXdocumento TipoOperacionID",  EntyOperacion);
              console.log("Clinica listarConsentimientoXdocumento TipoOperacionID",  this.filtro.TipoOperacionID);
      */      
              console.log("Clinica listarConsentimientoXdocumento IdConsentimiento ",  this.IdConsentimiento);
              if(this.IdConsentimiento==1){
           this.listarConsentimientoXdocumento(res[0].Documento);
           }
              this.filtro.CorreoElectronico = res[0].CorreoElectronico;
              this.filtro.Comentario = res[0].Comentario;
              this.filtro.Sexo = res[0].Sexo;
              this.filtro.FechaNacimiento = new Date(res[0].FechaNacimiento);
              this.CalcularAnios();
              this.filtro.Persona = res[0].Persona;
              this.filtro.TipoDocumento = res[0].TipoDocumento;
              this.filtro.Nombres = res[0].Nombres;
              this.filtro.ApellidoPaterno = res[0].ApellidoPaterno;
              this.filtro.ApellidoMaterno = res[0].ApellidoMaterno;
              this.filtro.Telefono = res[0].Telefono;
              this.bscPersona = null;
              this.bscPersona = res[0];
              console.log("llenar listaPersonaUsuario: ",  this.filtro);
            
        }
  
          this.editarCampos = false;
          this.editarDetallePrueba = false;
          this.editarCampoOA = false;
          this.editarCampoSevicio = false;
          this.editarCamposAutomaticos = true;
          this.editarCampoNroCama = true;
          this.editarCampoDocumento = true;
          this.editarCampoMedico = false;
          this.editarCampoAseguradora = false;
          this.editarCampoEmpresa = false;
          this.disableBtnGuardar = true;

      }else{
        console.log("entroo nadaaa");
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        this.filtro.Documento = null;
      }
    }).catch(error => error);

  }

  validarEnterMedico(evento) {
    var filtro = new FiltroPacienteClinica();
    if (evento.key == "Enter") {
      if (this.filtro.CMP == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      } else {
        if (this.filtro.CMP.trim() == "0") {
          filtro.MedicoId = 0;
        } else {
          filtro.MedicoId = -1;
          filtro.Estado = 1;
          filtro.CMP = this.filtro.CMP.trim();
        }
        this.bloquearPag = true;
        this.medicoService.listarpaginado(filtro).then((res) => {
          this.bloquearPag = false;
          if (res.length >= 1) {
            if (!this.estaVacio(res[0].Busqueda)) {
              this.filtro.Busqueda = res[0].Busqueda;
            } else {
              this.filtro.Busqueda = res[0].Nombres
            }
            this.filtro.MedicoId = res[0].MedicoId;
            this.editarCampoMedico = true;
          } else {
            this.filtro.CMP = null;
            this.filtro.Busqueda = null;
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
          }
        });
/*         if (this.filtro.CMP.trim() == "0") {
          filtro.MedicoId = 0;
        } else {
          filtro.MedicoId = -1;
          filtro.Estado = 1;
          filtro.CMP = this.filtro.CMP.trim();
        }
        this.bloquearPag = true;
        this.servicioListarMedico(filtro);
          this.bloquearPag = false; */
      }
    }
  }

  servicioListarMedico(filtro: FiltroPacienteClinica) {
    this.medicoService.listarpaginado(filtro).then((res) => {

      if (res.length >= 1) {

        this.bloquearPag = true;
        console.log("enter medico", res);
        this.filtro.CMP = res[0].CMP;
        if (!this.estaVacio(res[0].Busqueda)) {
          this.filtro.Busqueda = res[0].Busqueda;
        } else {
          this.filtro.Busqueda = res[0].Nombres;
        }

        this.filtro.MedicoId = res[0].MedicoId;
        this.editarCampoMedico = true;

      } else {
        this.filtro.CMP = null;
        this.filtro.Busqueda = null;
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      }


    });
  }

  validarEnterAseguradora(evento) {
    var filtro = new FiltroPacienteClinica();

    if (evento.key == "Enter") {
      if (this.filtro.IdAseguradora == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      } else if (String(this.filtro.IdAseguradora).length <= 7) {
        this.bloquearPag = true;
        filtro.IdAseguradora = this.filtro.IdAseguradora;
        filtro.Estado = 1;
        this.aseguradoraService.listarpaginado(filtro).then((res) => {
          // this.filtro.NombreCompleto = `${res[0].ApellidoPaterno} ${res[0].ApellidoMaterno}, ${res[0].Nombres}`
          if (res.length == 1) {
            console.log("enter aseguradora", res)
            this.filtro.NombreEmpresa = res[0].NombreEmpresa;
            this.filtro.TipoOrdenAtencion = res[0].TipoAseguradora;
            this.editarCampoAseguradora = true;
              this.bloquearPag = false;   
          } else {        
              this.bloquearPag = false;     
            this.filtro.IdAseguradora = null
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
          }
        });
      } else {
        this.filtro.IdAseguradora = null
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
      }
    }
  }

  validarEnterEmpresa(evento) {
    var filtro = new FiltroPacienteClinica();
    if (evento.key == "Enter") {
      this.bloquearPag = true;
      if (this.filtro2.DocumentoFiscal == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);     
          this.bloquearPag = false;
      } else if (this.filtro2.DocumentoFiscal.trim().length == 11 || this.filtro2.DocumentoFiscal == "0") {
        let dto = {
          Documento: this.filtro2.DocumentoFiscal.trim(),
          tipopersona: "J",
          TipoDocumento: "R",          
          Estado: "A"
        }
        this.personaService.listarpaginado(dto).then((res) => {
          console.log("enter empresa", res)
          if (res.length > 0) {
            this.filtro2.NombreCompleto = res[0].NombreCompleto;
            this.filtro2.Persona = res[0].Persona;
            this.editarCampoEmpresa = true;    
              this.bloquearPag = false;      
          } else {
              this.bloquearPag = false;
              this.filtro2.DocumentoFiscal = null;   
              this.filtro2.NombreCompleto = null;      
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
          }
        });
      }
      else {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
          this.bloquearPag = false;
          this.filtro2.DocumentoFiscal = null;   
          this.filtro2.NombreCompleto = null;     
   
      }
    }
  }

  // var dtoadmin = new FiltroPacienteClinica();
  // var tempfiltro = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
  // dtoadmin.MedicoId = tempfiltro.MedicoId;
  // var MedicoId = { MedicoId: dtoadmin.MedicoId }
  // onsole.log("data listado ID MEDICO:", MedicoId);
  // return this.medicoService.listarpaginado(dtoadmin).then((res) => {
  // this.filtro.CMP = res[0].CMP;
  // this.filtro.Busqueda = res[0].Busqueda;
  // this.filtro.IdEspecialidad = res[0].IdEspecialidad;
  // });
  listPerfil: SelectItem[] = [];
  listaPerfil() 
  {   
    var filtro
    filtro = {
      UneuNegocioId: this.getUsuarioAuth().data[0].UneuNegocioId,
      MosEstado: 1,
      TipoOperacionID: this.filtro.TipoOperacionID
      }
      this.consultaAdmisionService.listarModeloServicio(filtro).then(resp => {
        this.listPerfil = resp;
        if (!this.esListaVacia(this.listPerfil)){
        console.log("Clinica listaPerfil",  resp[0].ModeloServicioId);
        this.modeloSevicioId = resp[0].ModeloServicioId;  }
    });   
  }

  async validarTeclaEnterExamen(evento) {
    if (evento.key == "Enter") {
      var validado = 0;
      var total = 0;
      var cantidadExamenes = 0;
      this.contarExamenes = this.lstListarXAdmision.length;
       this.examen.Estado = 1;
      this.examen.TipoOperacionID = this.filtro.TipoOperacionID;
      this.examen.empresa = this.filtro.Persona;
      this.examen.ModeloServicioId = this.modeloSevicioId;
      this.examen.CodigoComponente = this.filtro.CodigoComponente.trim();
      this.examen.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;
      console.log("filtro validarTeclaEnterExamen", this.examen)
      this.examenService.examenpaginado(this.examen).then((res) => {
        console.log("examen", res)

        if (!this.esListaVacia(res)) {

          console.log("entro al if")
          if (res[0].hasOwnProperty("CodigoComponente")) {

            this.contarExamenes += res.length;
            res.forEach(element => {

              this.lstListarXAdmision.forEach(e => {
                // var ExamenConIgv = e.ValorEmpresa * this.getUsuarioAuth().data[0].Igv; 
                // e.Valor = e.ValorEmpresa + ExamenConIgv;  
                cantidadExamenes += e.Cantidad;
                e.ValorEmpresa = e.Valor * e.Cantidad;
                total += e.ValorEmpresa;
                if (element.CodigoComponente == e.CodigoComponente) {
                  validado = 1;
                }

              });


              if (validado == 1) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'EL CAMPO REGISTRADO SE REPITE', life: 3000 })
                this.filtro.CodigoComponente = null;
                return;

              } else {
                // element.numeroXadmision = this.contado++;
                this.loading = true;
                var contadorsito = this.lstListarXAdmision.length;
                element.numeroXadmision = contadorsito + 1;
                this.lstListarXAdmision.push(element);
                // var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv; 
                // element.Valor = element.ValorEmpresa + ExamenConIgv;    
                cantidadExamenes += element.Cantidad;
                element.ValorEmpresa = element.Valor * element.Cantidad;
                total += element.ValorEmpresa;
                this.lastYearTotal = total;
                this.cantidad = cantidadExamenes;
                this.seleccionarItemPacienteTemp = this.filtro.TipoOperacionID;
                this.seleccionarItemServicioTemp = this.filtro.ClasificadorMovimiento;
                this.filtro.CodigoComponente = null;
                this.loading = false;

              }
            });
          }
        }
        else {
          console.log("entro al else", res)
          this.toastMensaje('Examen no encontrado, revise bien los parametros', 'warning', 3000)
          this.filtro.CodigoComponente = null;
          return;
        }


      });

    }
  }
  
  mostrarMensajeInfo(mensaje: string): void {
    this.mostrarMensaje(mensaje, 'info');
  }

  mostrarMensaje(mensaje: string, tipo: string): void {
    this.messageService.clear();
    this.messageService.add({ severity: tipo, summary: 'Mensaje', detail: mensaje });
  }

}


