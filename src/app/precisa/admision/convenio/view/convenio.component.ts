import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { AseguradoraBuscarComponent } from '../../../framework-comun/Aseguradora/components/aseguradora-buscar.component';
import { AseguradoraService } from '../../../framework-comun/Aseguradora/servicio/aseguradora.service';
import { AseguradoraMantenimientoComponent } from '../../../framework-comun/Aseguradora/vista/aseguradora-mantenimiento.component';
import { ClienteRucBuscarComponent } from '../../../framework-comun/ClienteRuc/view/clienteRuc-buscar.component';
import { EmpresaBuscarComponent } from '../../../framework-comun/Empresa/view/empresa-buscar.component';
import { ExamenBuscarComponent } from '../../../framework-comun/Examen/components/examen-buscar.component';
import { FiltroExamen, FiltroServicio } from '../../../framework-comun/Examen/dominio/filtro/FiltroExamen';
import { ExamenService } from '../../../framework-comun/Examen/servicio/Examen.service';
import { MedicoBuscarComponent } from '../../../framework-comun/Medico/components/medico-buscar.component';
import { MedicoService } from '../../../framework-comun/Medico/servicio/medico.service';
import { MedicoMantenimientoComponent } from '../../../framework-comun/Medico/vista/medico-mantenimiento.component';
import { PersonaBuscarComponent } from '../../../framework-comun/Persona/components/persona-buscar.component';
import { dtoPersona } from '../../../framework-comun/Persona/dominio/dto/dtoPersona';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { PersonaMantenimientoComponent } from '../../../framework-comun/Persona/vista/persona-mantenimiento.component';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { Admision, AdmisionServicio, Cliente, TraerXAdmisionServicio } from '../../consulta/dominio/dto/DtoConsultaAdmision';
import { FiltroCliente, FiltroListarXAdmision, FiltroTipoOperacion } from '../../consulta/dominio/filtro/FiltroConsultaAdmision';
import { ConsultaAdmisionService } from '../../consulta/servicio/consulta-admision.service';
import { DtoAdmisionclinicaDetalle } from '../../paciente-clinica/dominio/dto/DtoAdmisionclinicaDetalle';
import { DtoAdmisionprueba, DtoPacienteClinica } from '../../paciente-clinica/dominio/dto/DtoPacienteClinica';
import { FiltroPacienteClinica } from '../../paciente-clinica/dominio/filtro/FiltroPacienteClinica';
import { PacienteClinicaService } from '../../paciente-clinica/service/paciente-clinica.service';

@Component({
  selector: 'ngx-convenio',
  templateUrl: './convenio.component.html',
  styleUrls: ['./convenio.component.scss']
})
export class ConvenioComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController {

  @ViewChild(AseguradoraMantenimientoComponent, { static: false }) aseguradoraMantenimientoComponent: AseguradoraMantenimientoComponent;
  @ViewChild(MedicoMantenimientoComponent, { static: false }) medicoMantenimientoComponent: MedicoMantenimientoComponent;
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(AseguradoraBuscarComponent, { static: false }) aseguradoraBuscarComponent: AseguradoraBuscarComponent;
  @ViewChild(MedicoBuscarComponent, { static: false }) medicoBuscarComponent: MedicoBuscarComponent;
  @ViewChild(ExamenBuscarComponent, { static: false }) examenBuscarComponent: ExamenBuscarComponent;
  @ViewChild(ClienteRucBuscarComponent, { static: false }) clienteRucBuscarComponent: ClienteRucBuscarComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  @ViewChild(EmpresaBuscarComponent, { static: false }) empresaBuscarComponent: EmpresaBuscarComponent;
  @ViewChild('pdfViewerActividades', { static: false }) pdfViewerActividades;

  colCard1: string = "col-sm-5";
  colCard2: string = "col-sm-3";

  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  verReporteModal: boolean = false;
  loading: boolean;
  bloquearPag: boolean;
  contarExamenes: number = 15;

  seleccionarItemServicioTemp: any;
  seleccionarItemMedicoTemp: any;
  seleccionarItemTipoPacienteTemp: any;


  servicio: FiltroServicio = new FiltroServicio();
  operacion: FiltroTipoOperacion = new FiltroTipoOperacion();
  xadmision: FiltroListarXAdmision = new FiltroListarXAdmision();
  examen: FiltroExamen = new FiltroExamen();
  dtofinal: DtoAdmisionprueba = new DtoAdmisionprueba();
  filtro: FiltroPacienteClinica = new FiltroPacienteClinica();
  filtro2: FiltroPacienteClinica = new FiltroPacienteClinica();
  tempfiltro: any;
  dtoClienteRuc: Cliente = new Cliente();
  Auth: UsuarioAuth = new UsuarioAuth();

  tipoOperacionIdTemp: number
  IdConsentimiento: number = 0;
  cantidad: number = 0;

  disableBtnGuardar: boolean;
  verBtnAnular: boolean = false;
  editarCampos: boolean = true;
  editarDetallePrueba: boolean = true;
  editarCampoMedico: boolean = true;
  editarCampoAseguradora: boolean = true;
  editarCampoEmpresa: boolean = true;
  editarCampoDocumento: boolean = false;
  editarCampoCliente: boolean = false;
  editarComboTipPac: boolean = true;

  registroSeleccionado: any;
  contado: number = 1;
  total: number = 0;
  lastYearTotal: number = 0;
  editarCantidad: boolean = true;
  lstSexo: SelectItem[] = [];
  lstprocedencia: SelectItem[] = [];
  lstTipoOrden: SelectItem[] = [];
  lstTipoAtencion: SelectItem[] = [];
  lstServicio: SelectItem[] = [];
  lstSedeEmpresa: SelectItem[] = [];
  lstTipoOperacion: SelectItem[] = [];
  lstTipoPaciente: SelectItem[] = [];
  lstContrato: SelectItem[] = [];
  lstComentarioContrato: SelectItem[] = [];
  admision: DtoPacienteClinica;
  lstListarXAdmision: DtoPacienteClinica[] = [];
  EnterExamen: SelectItem[] = [];
  bscPersona: any[] = [];
  lstAnularAdmisionDetalle: DtoPacienteClinica[] = [];

 


  constructor(
    protected messageService: MessageService,
    private examenService: ExamenService,
    private personaService: PersonaService,
    private pacienteClinicaService: PacienteClinicaService,
    private aseguradoraService: AseguradoraService,
    private route: ActivatedRoute,
    private medicoService: MedicoService,
    private consultaAdmisionService: ConsultaAdmisionService,
  ) {
    super(

    );
  }

  ngOnDestroy(): void {
    // this.dataInactive.unsubscribe();
  }

  ngOnInit(): void {
    this.bloquearPag = true;

    this.iniciarComponent();

    const p1 = this.comboComboSexo();
    const p2 = this.comboCargarProcendia();
    const p3 = this.comboComboTipoOrden();
    const p4 = this.comboCargarServicios();
    const p5 = this.comboCargarTipoAtencion();

    Promise.all([p1, p2, p3, p4, p5]).then(resp => {

      var condicion = this.route.snapshot.url.length;
      if (condicion > 2) {
        this.tempfiltro = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
        if (this.tempfiltro) {
          this.EditarAdmision(this.tempfiltro);
          this.admision = this.tempfiltro;
          this.auditoria(this.tempfiltro, 2);
        }
      }else{
        this.auditoria("NUEVO", 1);
      }
   
      setTimeout(() => {
        this.filtro = this.formularioFiltrosRestaurar(this.filtro);
        this.bloquearPag = false;
      }, 1000);
    });

  }

  coreNuevo(): void {

  }

  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }

  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }

  coreMensaje(mensage: MensajeController): void {
    console.log("Convenio DATA coreMensaje", mensage);
    if (mensage.componente == "SELECPACIENTE") {
      this.bscPersona = mensage.resultado;
      this.filtro.Documento = mensage.resultado.Documento;
      if (this.estaVacio(mensage.resultado.NombreCompleto)) {
        this.filtro.NombreCompleto = `${mensage.resultado.Nombres}, ${mensage.resultado.ApellidoPaterno} ${mensage.resultado.ApellidoMaterno}`
      } else {
        this.filtro.NombreCompleto = mensage.resultado.NombreCompleto;
      }

      this.filtro.Persona = mensage.resultado.Persona;
      this.filtro.Nombres = mensage.resultado.Nombres;
      this.filtro.ApellidoPaterno = mensage.resultado.ApellidoPaterno;
      this.filtro.ApellidoMaterno = mensage.resultado.ApellidoMaterno;
      this.filtro.TipoDocumento = mensage.resultado.TipoDocumento;

      this.filtro.CorreoElectronico = mensage.resultado.CorreoElectronico;
      this.filtro.Comentario = mensage.resultado.Comentario;
      this.filtro.Sexo = mensage.resultado.Sexo;
      // this.filtro.Edad = mensage.resultado.Edad;
      this.filtro.FechaNacimiento = new Date(mensage.resultado.FechaNacimiento);
      this.CalcularAnios();

      this.editarCampos = false;
      this.editarDetallePrueba = false;
      this.editarCampoDocumento = true;
      this.editarCampoMedico = false;
      this.editarCampoAseguradora = false;
      this.editarCampoEmpresa = false;
      this.disableBtnGuardar = true;
    }
    else if (mensage.componente == "SELECCLIENTE") {
      this.dtoClienteRuc = mensage.resultado;
      this.editarCampoCliente = true;
      this.comboCargarContrato();
      this.lstListarXAdmision = [];
      this.lastYearTotal = 0;
    }
    else if (mensage.componente == "SELECEMPRESA") {
      this.filtro2.Documento = mensage.resultado.Documento;
      this.filtro2.NombreCompleto = mensage.resultado.NombreCompleto;
      this.filtro2.Persona = mensage.resultado.Persona;
      this.editarCampoEmpresa = true;
      this.comboCargarSedeEmpresa(mensage.resultado.Persona);
    }
    else if (mensage.componente == "SELECASEGURADORA") {
      this.filtro.IdAseguradora = mensage.resultado.IdAseguradora;
      this.filtro.NombreEmpresa = mensage.resultado.NombreEmpresa;
      this.editarCampoAseguradora = true;
    }
    else if (mensage.componente == "SELECMEDICO") {

      this.filtro.CMP = mensage.resultado.CMP;
      this.filtro.Busqueda = mensage.resultado.Busqueda;
      this.editarCampoMedico = true;
      this.filtro.MedicoId = mensage.resultado.MedicoId;
      // if (mensage.resultado.IdEspecialidad == null)
      //   this.filtro.IdEspecialidad = 0
      // else
      //   this.filtro.IdEspecialidad = mensage.resultado.IdEspecialidad
    }
    else if (mensage.componente == "BUSCEXAM") {
      var validado = 0;
      var totala = 0;
      var cantidadExamenes = 0;
      this.contarExamenes = this.lstListarXAdmision.length;
      this.contarExamenes += mensage.resultado.length;
      this.lstListarXAdmision.forEach(x => {
        cantidadExamenes += x.Cantidad;
        x.ValorEmpresa = x.Valor * x.Cantidad;
        totala += x.ValorEmpresa;
      });

      mensage.resultado.forEach(element => {
        var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
        element.Valor = element.ValorEmpresa;
        cantidadExamenes += element.Cantidad;
        element.ValorEmpresa = (element.Valor + ExamenConIgv) * element.Cantidad;
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
          this.cantidad = cantidadExamenes;
          var contadorsito = this.lstListarXAdmision.length;
          element.numeroXadmision = contadorsito + 1;
          this.lstListarXAdmision.push(element);
          // this.cantidad = this.lstListarXAdmision.length;
          this.tipoOperacionIdTemp = this.filtro.TipoOperacionID;
          // console.log("this.tipoOperacionIdTemp", this.tipoOperacionIdTemp)
          this.seleccionarItemServicioTemp = this.filtro.ClasificadorMovimiento;
          this.loading = false;
        }
      });

    }
    else if (mensage.componente == 'TIPMAPERSONANUEVO') {
      this.disableBtnGuardar = true;
      if (mensage.resultado != null) {
        this.filtro.Documento = mensage.resultado.data.Documento;
        this.filtro.NombreCompleto = mensage.resultado.data.NombreCompleto;
        this.filtro.CorreoElectronico = mensage.resultado.data.CorreoElectronico;
        this.filtro.Comentario = mensage.resultado.data.Comentario;
        this.filtro.Sexo = mensage.resultado.data.Sexo;
        this.filtro.FechaNacimiento = new Date(mensage.resultado.data.FechaNacimiento);
        this.CalcularAnios();
        this.filtro.Persona = mensage.resultado.data.Persona;
        this.filtro.TipoDocumento = mensage.resultado.data.TipoDocumento;
        this.filtro.Nombres = mensage.resultado.data.Nombres;
        this.filtro.ApellidoPaterno = mensage.resultado.data.ApellidoPaterno;
        this.filtro.ApellidoMaterno = mensage.resultado.data.ApellidoMaterno;
        this.filtro.Telefono = mensage.resultado.data.Telefono;
        this.bscPersona = null
        this.bscPersona = mensage.resultado.data;
        this.editarCampos = false;
        this.editarDetallePrueba = false;
        this.editarCampoDocumento = true;
        this.editarCampoMedico = false;
        this.editarCampoAseguradora = false;
        this.editarCampoEmpresa = false;
      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: `Registro Seleccionado sin datos`
        })
      }
      console.log("DATA VIAJANDO TIPMAPERSONANUEVO ", mensage.resultado.data);
    }
    else if (mensage.componente == 'TIPMAPERSONAEDITAR') {
      console.log("TIPMAPERSONAEDITAR VIAJANDO ", mensage.resultado.data);
      console.log("TIPMAPERSONAEDITAR filtro", this.filtro);
      console.log("TIPMAPERSONAEDITAR bscPersona", this.bscPersona);
      this.MostrarEmpresa(mensage.resultado, 1);
    }
    else if (mensage.componente == 'TIPREGMEDICO') {
      console.log("data llegando medico", mensage.componente);
      console.log("data llegando medico", mensage.resultado);
      if (mensage.resultado != null) {
        this.bloquearPag = true;
        this.filtro.CMP = mensage.resultado.data.CMP;
        this.filtro.Busqueda = mensage.resultado.data.Busqueda;
        this.filtro.MedicoId = mensage.resultado.data.MedicoId;
        this.editarCampoMedico = true;    
        this.bloquearPag = false;       
      }
    }
    else if (mensage.componente == 'TIPREGASEGURADORA') {
      if (mensage.resultado != null) {
        this.bloquearPag = true;
        this.filtro.IdAseguradora = mensage.resultado.data.IdAseguradora;
        this.filtro.NombreEmpresa = mensage.resultado.data.NombreEmpresa;
        this.editarCampoAseguradora = true;    
        this.bloquearPag = false;      
      }
    }
    else if (mensage.componente == 'TIPREGEMPRESA') {
      console.log("data llegando mensaje", mensage.resultado);
      if (mensage.resultado != null) {
        this.bloquearPag = true;
        this.filtro2.Documento = mensage.resultado.data.Documento;
        this.filtro2.NombreCompleto = mensage.resultado.data.NombreCompleto;
        this.filtro2.Persona = mensage.resultado.data.Persona;
        this.editarCampoEmpresa = true;     
        this.bloquearPag = false;     
      }
    }
  }

  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
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
        this.filtro.Documento = res[0].Documento;
        this.filtro.CorreoElectronico = res[0].CorreoElectronico;

        this.filtro.Sexo = res[0].Sexo;
        this.filtro.FechaNacimiento = new Date(res[0].FechaNacimiento);
        this.CalcularAnios();
        // this.filtro.Edad = res[0].Edad;            
        //campos extras para el Guardar OA
        this.filtro.Persona = res[0].Persona;
        this.filtro.TipoDocumento = res[0].TipoDocumento;
        this.filtro.Nombres = res[0].Nombres;
        this.filtro.ApellidoPaterno = res[0].ApellidoPaterno;
        this.filtro.ApellidoMaterno = res[0].ApellidoMaterno;
        this.filtro.Telefono = res[0].Telefono;
        console.log("el Telefono es: ", this.filtro.Telefono);
        this.filtro.Comentario = res[0].Comentario;
        this.bscPersona = null
        this.bscPersona = res[0];
      }
      //empresa
      if (id == 2) {
        this.filtro2.DocumentoFiscal = res[0].Documento;
        this.filtro2.NombreCompleto = res[0].NombreCompleto;
        this.filtro2.Persona = res[0].Persona;
      }
      this.bloquearPag = false
    });
  }


  btnEditar() {
    this.editarCampos = false;
    this.editarDetallePrueba = false;
    this.editarCampoMedico = false;
    this.editarCampoAseguradora = false;
    this.editarCampoEmpresa = false;
    this.editarCampoCliente = false;
  }


  btnNuevo() {
    this.filtro = new FiltroPacienteClinica();
    this.filtro2 = new FiltroPacienteClinica();
    this.dtoClienteRuc = new Cliente();
    // this.limpiarPersona()
    // this.limpiarClienteRuc()    
    this.lstContrato = []
    this.lstContrato.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstTipoPaciente = []
    this.lstTipoPaciente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.editarCampoCliente = false;
    this.lstListarXAdmision = [];
    this.lastYearTotal = 0;
    this.cantidad = 0;
    this.disableBtnGuardar = true;
    this.editarCampoDocumento = false;
    this.editarCampos = true;
    this.editarDetallePrueba = true;
    this.editarComboTipPac = true;
    // this.limpiarEmpresa()
    this.editarCampoEmpresa = false;
    // this.limpiarAseguradora()
    this.editarCampoAseguradora = false;
    // this.limpiarMedico()
    this.editarCampoMedico = false;
    this.admision = null;
    this.filtro.TipoOrden = "R";
    this.filtro.TipoAtencion = 2;
    this.filtro.ClasificadorMovimiento = this.Auth.data[0].ClasificadorMovimiento;
    this.filtro.IdEspecialidad = 0;
    this.tipoOperacionIdTemp = 0;
    this.lstListarXAdmision = [];
    this.lastYearTotal = 0;
    this.cantidad = 0;
    this.editarCampos = true;
    this.editarDetallePrueba = true;
    this.editarCampoMedico = true;
    this.editarCampoAseguradora = true;
    this.editarCampoEmpresa = true;
    this.editarCampoDocumento = false;
    this.verBtnAnular = false;
    this.colCard1 = "col-sm-5";
    this.colCard2 = "col-sm-3";

  }

  ValidarGuardar(admision: DtoPacienteClinica) {
    let valida = this.ValidateFilters();
    if (valida != null) {
      Swal.fire({
        icon: 'warning',
        title: `¡Completar Campos Obligatorios!`,
        text: valida
      })
    } else {
      let validaCMP = this.ValidateCMP();

      if (validaCMP == null) {
        Swal.fire({
          title: 'Importante!',
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
  }

  ValidateCMP() {
    if (this.filtro.CMP == "0") {
      return "Esta guardando la petición con medico automático, ¿Desea continuar?";
    }
    return null;
  }

  ValidateFilters() {
    if (this.filtro.Documento == null) {
      return "Debe ingresar el Paciente";
    }
    if (this.dtoClienteRuc.empresa == null) {
      return "Debe seleccionar un Cliente";
    }
    if (this.filtro.MedicoId == null) {
      return "Debe seleccionar el Médico";
    }
    if (this.estaVacio(this.filtro.NombreEmpresa)) {
      return "Seleccionar la aseguradora.";
    }
    if (this.filtro2.Documento == null) {
      return "Debe seleccionar la Empresa";
    }
    if (this.filtro.TipoOperacionID == null) {
      return "Debe seleccionar el Contrato";
    }
    if (this.filtro.IdEspecialidad == null) {
      return "Debe seleccionar la Procedencia";
    }
    if (this.filtro.ClasificadorMovimiento == null) {
      return "Debe seleccionar un Servicio";
    }
    if (this.filtro.TipoOrden == null) {
      return "Debe seleccionar el Tipo Orden";

    }
    if (this.filtro.TipoAtencion == null) {
      return "Debe seleccionar el Tipo Atención";
    }
    if (this.esListaVacia(this.registroSeleccionado)) {
      return "Debe seleccionar un servicio como mínimo con estado Pendiente antes de grabar la Orden de Atención";
    }
    return null;
  }

  GuardarAdmision(admision: DtoPacienteClinica) {
    let _dtofinal = new TraerXAdmisionServicio();
    var serv = this.registroSeleccionado;
    console.log("GuardarAdmision Inicial serv :", serv);
    var indicaRegis = 0;
    if (admision == null) 
      {
      }
    else
      {
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
      this.dtofinal.Admision.IdAdmision = admision.IdAdmision; // normal registraria sin llamarlo cunado es 1
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
      this.dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
      this.dtofinal.Admision.TipoAtencion = this.filtro.TipoAtencion;
      this.dtofinal.Admision.DesEstado = admision.DesEstado;
      this.dtofinal.Admision.TIPOADMISIONID = 2;
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

      console.log("dto a modificar:", this.dtofinal);
      this.bloquearPag = true;
      this.pacienteClinicaService.mantenimientoAdmisionClinica(2, this.dtofinal, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;     
          console.log("mantenimientoAdmisionClinica res:", res);
          if (this.estaVacio(res.Mensaje)) {
            this.toastMensaje('Se actualizó el registro con éxito.', 'success', 2000);
            this.auditoria(res.Admision, 2);
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
              var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
              element.Valor = element.ValorEmpresa ;
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = (element.Valor + ExamenConIgv)* element.Cantidad;
              totala += element.ValorEmpresa;
              element.numeroXadmision = contadorsito++;
              this.lstListarXAdmision.push(element);
            });
            this.lastYearTotal = totala;
            this.cantidad = cantidadExamenes;
            this.registroSeleccionado = null;
            this.verBtnAnular = true;
            this.colCard1 = "col-sm-3";
            this.colCard2 = "col-sm-5";
            this.editarCampos = true;
            this.editarDetallePrueba = true;
          } else {
            Swal.fire({
              icon: 'warning',
              title: '¡Mensaje!',
              text: `${res.Mensaje}`
            })
          }
        }).catch(error => error)
    }
    else 
    {

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
      _dtofinal.Admision.HistoriaClinica = "";
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
      _dtofinal.Admision.TipoPaciente = this.filtro.TipoPacienteId;
      _dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
      _dtofinal.Admision.ObservacionAlta = this.filtro.ObservacionAlta;
      _dtofinal.Admision.TIPOADMISIONID = 2; //admision.TIPOADMISIONID;
      serv.forEach(element => {
        var dtoAdmClini = new AdmisionServicio();
        dtoAdmClini.CodigoComponente = element.CodigoComponente;
        dtoAdmClini.Descripcion = element.Descripcion;
        dtoAdmClini.Cantidad = element.Cantidad;
        dtoAdmClini.Valor = element.Valor;
        dtoAdmClini.Estado = element.Estado;
        dtoAdmClini.Sexo = element.Sexo;
        dtoAdmClini.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
        dtoAdmClini.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
        dtoAdmClini.IpCreacion = this.getIp();
        dtoAdmClini.IpModificacion = this.getIp();
        _dtofinal.list_AdmisionServicio.push(dtoAdmClini);
      });
      _dtofinal.IndicadorWS = 0;
      console.log("Insertar DTO", _dtofinal);
          this.bloquearPag = true;
      this.pacienteClinicaService.mantenimientoAdmisionClinica(1, _dtofinal, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          console.log("mantenimientoAdmisionClinica res:", res);
          if (res.valor == 1) {
            this.toastMensaje(`${res.Mensaje}`, 'success', 3000);
          } else {
            this.toastMensaje(`${res.Mensaje}`, 'warning', 3000);
          }
          this.auditoria(res.Admision, 2);
          console.log("res  ELSE::: ", res)
          if (res.list_AdmisionServicio[0].hasOwnProperty("CodigoComponente")) {
            this.lstListarXAdmision = [];
            this.lastYearTotal = 0;
            var totala = 0;
            var cantidadExamenes = 0;
            var contadorsito = 1;
            res.list_AdmisionServicio.forEach(element => {
              var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
              element.Valor = element.ValorEmpresa ;
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = (element.Valor + ExamenConIgv)* element.Cantidad;
              totala += element.ValorEmpresa;
              element.numeroXadmision = contadorsito++;
              this.lstListarXAdmision.push(element);
            });
            this.cantidad = cantidadExamenes;
            this.lastYearTotal = totala;
            this.registroSeleccionado = null;
            this.verBtnAnular = true;
            this.colCard1 = "col-sm-3";
            this.colCard2 = "col-sm-5";
            this.editarCampos = true;
            this.editarDetallePrueba = true;
            this.admision = res.Admision;
            this.filtro.NroPeticion = res.Admision.NroPeticion;
          } else {
            Swal.fire({
              icon: 'warning',
              title: '¡Mensaje!',
              text: `${res.Mensaje}`
            })
          }
        }).catch(error => error)
    }

  }

  crearAseguradora() {
    this.aseguradoraMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGASEGURADORA', ''), "NUEVO");
  }

  crearMedico() {
    this.medicoMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGMEDICO', ''), 'NUEVO');
  }

  //Nueva Empresa (Juridica) - Pacientes
  crearPersona() {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGEMPRESA', ''), 'NUEVO', 2);
  }

  MultiPersona(filtro) {

    if (this.filtro.NombreCompleto == null && this.filtro.Documento == null) {
      this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONANUEVO', ''), "NUEVO", 1);

    } else {
      this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONAEDITAR', ''), "EDITAR", 1, filtro);

    }
  }

  verSelectorCliente(): void {
    this.clienteRucBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECCLIENTE', 'BUSCAR'), 'BUSCAR');
  }

  verSelectorPaciente(): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), 'BUSCAR',"N");
  }

  verSelectorMedico(): void {
    this.medicoBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECMEDICO', 'BUSCAR'), 'BUSCAR');
  }

  verSelectorAseguradora(): void {
    this.aseguradoraBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECASEGURADORA', 'BUSCAR'), 'BUSCAR');
  }

  verSelectorEmpresa(): void {
    this.empresaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECEMPRESA', 'BUSCAR'), 'BUSCAR');
  }

  verSelectorExamen(): void {
    this.filtro.empresa = this.dtoClienteRuc.Persona
    this.examenBuscarComponent.coreIniciarComponenteBuscar(new MensajeController(this, 'BUSCEXAM', ''), 'BUSCAR', 2, this.filtro);
  }

  comboComboSexo() {
    this.lstSexo = []
    this.lstSexo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "SEXO").forEach(i => {
      this.lstSexo.push({ label: i.Nombre, value: i.Codigo })

    });
  }

  comboComboTipoOrden() {
    this.lstTipoOrden = []
    this.lstTipoOrden.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOORDEN").forEach(i => {
      this.lstTipoOrden.push({ label: i.Nombre, value: i.Codigo })
    });
    this.filtro.TipoOrden = "R"
  }



  getListarTipoOperacion(TipoOperacionID: number): Promise<number> {

    var operacionFiltro = new FiltroTipoOperacion()
    this.Auth = this.getUsuarioAuth();
    var usuario = this.Auth.data;
    operacionFiltro.UneuNegocioId = usuario[0].UneuNegocioId;
    operacionFiltro.TIPOADMISIONID = 2;
    operacionFiltro.TipEstado = 1;
    operacionFiltro.TipoOperacionID = TipoOperacionID;
    return this.consultaAdmisionService.listarcombotipooperacion(operacionFiltro).then(resp => {
      console.log(resp)
      var filtroClienteRuc = new FiltroCliente()
      this.Auth = this.getUsuarioAuth();
      var usuario = this.Auth.data;
      filtroClienteRuc.UneuNegocioId = usuario[0].UneuNegocioId;
      filtroClienteRuc.TipEstado = 1;
      filtroClienteRuc.TIPOADMISIONID = 2;
      filtroClienteRuc.Codigo = resp[0].RucEmpresa;
      this.GetServiceCliente(filtroClienteRuc, true);

      return 1;
    });
  }

 

  setComentarioContrato(TipoOperacionID: number) {
    if (TipoOperacionID != null) {
      this.lstComentarioContrato.forEach(x => {
        if (x.value == TipoOperacionID) {
          this.filtro.ComentarioContrato = x.label;
        }
      })
    } else {
      this.filtro.ComentarioContrato = "";
    }
  }

  selectedItemTipoContrato(event) {
    var value = event.value; //event.originalEvent.srcElement.innerText;    
    this.editarComboTipPac = false;
    console.log("value esta listo parar entrar al metodo", value);
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

    this.validarExistLstListarXAdmision(value);
  }

  validarExistLstListarXAdmision(value: number) {
    if (this.lstListarXAdmision.length > 0) {
   
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
      this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
      this.dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;
      this.dtofinal.Admision.Persona = this.filtro.Persona; //viene de un metodo persona
      this.dtofinal.Admision.HistoriaClinica = this.filtro.CodigoHC;
      this.dtofinal.Admision.NroPeticion = this.filtro.NroPeticion;
      this.dtofinal.Admision.OrdenAtencion = this.filtro.OrdenAtencion;
      this.dtofinal.Admision.MedicoId = this.filtro.MedicoId;
      this.dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
      this.dtofinal.Admision.FechaModificacion = new Date();
      this.dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
      this.dtofinal.Admision.IpModificacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
      this.dtofinal.Admision.IdEmpresaPaciente = this.filtro2.Persona;
      this.dtofinal.Admision.IdAseguradora = this.filtro.IdAseguradora;
      this.dtofinal.Admision.TipoOrden = this.filtro.TipoOrden;
      this.dtofinal.Admision.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;
      this.dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
      this.dtofinal.Admision.TIPOADMISIONID = 2; //admision.TIPOADMISIONID;
      this.dtofinal.list_AdmisionServicio = [];
      this.lstListarXAdmision.forEach(element => {
        var dtoAdmClini = new DtoAdmisionclinicaDetalle;
        dtoAdmClini.IdAdmServicio = element.IdAdmServicio;
        dtoAdmClini.IdAdmision = element.IdAdmision;
        dtoAdmClini.Linea = element.Linea; //viene vacio desde editar
        dtoAdmClini.IdOrdenAtencion = element.IdOrdenAtencion; //viene vacio desde editar
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
      this.dtofinal.IndicadorWS = 0;
      this.bloquearPag = true;
      this.pacienteClinicaService.cambioContratoTipoPaciente(1, this.dtofinal, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          this.loading = false;
          if (res.Mensaje.length <= 38) {
            Swal.fire({
              icon: 'warning',
              title: 'Mensaje!',
              text: `${res.Mensaje}`
            })
            this.lastYearTotal = 0;
            this.contado = 1;
            this.lstListarXAdmision = [];
            var totala = 0;
            var cantidadExamenes = 0;
            res.list_AdmisionServicio.forEach(element => {
              var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
              element.Valor = element.ValorEmpresa ;
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = (element.Valor + ExamenConIgv) * element.Cantidad;
              totala += element.ValorEmpresa;
              element.numeroXadmision = this.contado++;
              this.lstListarXAdmision.push(element);
            });
            this.cantidad = cantidadExamenes;
            this.lastYearTotal = totala;
            if (this.esListaVacia(this.tipoOperacionIdTemp)) {
              this.admision.TipoOperacionId = value //value
            } else {
              this.tipoOperacionIdTemp = value;
            }
            this.setComentarioContrato(value);
            this.comboCargarTipoPaciente(value);
          } else {
            Swal.fire({
              icon: 'warning',
              title: '¡Mensaje!',
              text: `${res.Mensaje}`
            }).then((result) => {
              if (result.isConfirmed) {
                if (this.esListaVacia(this.tipoOperacionIdTemp)) {
                  this.filtro.TipoOperacionID = this.admision.TipoOperacionId;
                } else {
                  this.filtro.TipoOperacionID = this.tipoOperacionIdTemp;
                }
                this.setComentarioContrato(this.filtro.TipoOperacionID);
                this.comboCargarTipoPaciente(this.filtro.TipoOperacionID);
              }
            });
          }

        }).catch(error => console.log(error))
    } else {
      this.setComentarioContrato(value);
      this.comboCargarTipoPaciente(value);
    }
  }

  comboCargarTipoPaciente(TipoOperacionID: number): Promise<number> {
    console.log("value entrando a combo paciente", TipoOperacionID);
    var operacionFiltro = new FiltroTipoOperacion();
    this.Auth = this.getUsuarioAuth();
    var usuario = this.Auth.data;
    operacionFiltro.UneuNegocioId = usuario[0].UneuNegocioId; // preguntar a Jordan
    operacionFiltro.TIPOADMISIONID = 2;
    operacionFiltro.TipEstado = 1;
    operacionFiltro.Persona = this.dtoClienteRuc.Persona;
    operacionFiltro.TipoOperacionID = TipoOperacionID ;// pasar dato
    this.filtro.TipoPacienteId = null;
    this.lstTipoPaciente = [];
    this.lstTipoPaciente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    if (operacionFiltro.TipoOperacionID != null) {
      return this.consultaAdmisionService.listarcombotipooperacion(operacionFiltro).then(resp => {
        resp.forEach(e => {
          this.lstTipoPaciente.push({ label: e.Descripcion, value: e.TipoPacienteId });
        });
        sessionStorage.setItem('EntyOperacion', JSON.stringify(resp));
        console.log("CargarTipoPaciente listarcombotipooperacion", resp);
        this.filtro.TipoPacienteId = resp[0].TipoPacienteId;
        this.seleccionarItemTipoPacienteTemp = resp[0].TipoPacienteId;
        this.IdConsentimiento = resp[0].FlaCon;
        return 1;
      });
    }
  }

  comboCargarServicios(): Promise<number> {
    this.Auth = this.getUsuarioAuth();
    var service = this.Auth.data;
    this.servicio.Estado = 1;
    this.lstServicio = []
    this.lstServicio.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.examenService.serviciopaginado(this.servicio).then(resp => {
      resp.forEach(e => {
        this.lstServicio.push({ label: e.Nombre, value: e.ClasificadorMovimiento });     
      });
      console.log("Convenio comboCargarServicios", resp);
      this.filtro.ClasificadorMovimiento = service[0].ClasificadorMovimiento;
      return 1;
    });
  }

  comboCargarSedeEmpresa(IdEmpresa: number): Promise<number> {
    this.lstSedeEmpresa = []
    this.lstSedeEmpresa.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.consultaAdmisionService.listarAdmisionSede(IdEmpresa).then(resp => {
      resp.forEach(e => {
        this.lstSedeEmpresa.push({ label: e.SedDescripcion, value: e.IdSede });
      });
      return 1;
    });
  }

  comboCargarTipoAtencion() {
    this.lstTipoAtencion = []
    this.lstTipoAtencion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOATENCION").forEach(i => {
      this.lstTipoAtencion.push({ label: i.Nombre, value: i.IdCodigo })
    });
    this.filtro.TipoAtencion = 2;
  }

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

  grillaCargarDatos(event: LazyLoadEvent) {
    var tempfiltro = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
    this.xadmision.IdAdmision = tempfiltro.IdAdmision;
    let idAdmision = { IdAdmision: this.xadmision.IdAdmision }

    return this.consultaAdmisionService.listarXadmision(idAdmision).then((res) => {
      this.loading = true;
      console.log("Convenio grillaCargarDatos", res);
      this.filtro.TipoAtencion = res.Admision.TipoAtencion;
      this.filtro.ObservacionAlta = res.Admision.ObservacionAlta;
      this.contarExamenes = res.list_AdmisionServicio.length;
      var cantidadExamenes = 0;
      res.list_AdmisionServicio.forEach(element => {
        element.numeroXadmision = this.contado++;
        var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
        element.Valor = element.ValorEmpresa ;
        cantidadExamenes += element.Cantidad;
        element.ValorEmpresa = (element.Valor + ExamenConIgv) * element.Cantidad;
        this.total += element.ValorEmpresa;
        this.lstListarXAdmision.push(element);
      });
      if (res.Admision.IdEspecialidad != null) {
        this.filtro.IdEspecialidad = res.Admision.IdEspecialidad;
        // this.seleccionarItemMedicoTemp = tempfiltro.IdEspecialidad;
      } else {
        this.filtro.IdEspecialidad = 0;
        // this.seleccionarItemMedicoTemp = 0;
      }
    //  this.disableBtnGuardar = false;
      this.cantidad = cantidadExamenes;
      this.lastYearTotal = this.total;
      this.loading = false;

    });
  }

  // }

  MostrarMedico(MedicoId) {
    // var tempfiltro = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
    var dtoadmin = new FiltroPacienteClinica();
    dtoadmin.MedicoId = MedicoId;
    return this.medicoService.listarpaginado(dtoadmin).then((res) => {
      if (res[0].MedicoId == 0) {
        this.filtro.CMP = res[0].MedicoId;
      } else {
        this.filtro.CMP = res[0].CMP;
      }
      this.filtro.Busqueda = res[0].Busqueda;
      this.filtro.MedicoId = res[0].MedicoId;

    });
  }

  MostrarAseguradora(IdAseguradora) {
    //var tempdto = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);

    // this.filtro.IdAseguradora = tempfiltro.IdAseguradora;
    // let IdAseguradora = { IdAseguradora: this.filtro.IdAseguradora }
    var filtro = new dtoPersona();
    filtro.IdAseguradora = IdAseguradora;

    return this.aseguradoraService.listarpaginado(filtro).then((res) => {
      this.filtro.IdAseguradora = res[0].IdAseguradora;
      this.filtro.NombreEmpresa = res[0].NombreEmpresa;
    });

  }

  MostrarPersonaPaciente(tempfiltro: Admision) {
    this.filtro.Persona = tempfiltro.Persona;
    this.filtro.Documento = tempfiltro.Documento.trim();

    return this.personaService.listarpaginado(this.filtro).then((res) => {
      this.filtro.Sexo = res[0].Sexo;
      this.filtro.FechaNacimiento = new Date(res[0].FechaNacimiento);
      this.filtro.Edad = res[0].Edad;
      this.filtro.TipoDocumento = res[0].TipoDocumento.trim();
      this.filtro.Nombres = res[0].Nombres;
      this.filtro.ApellidoPaterno = res[0].ApellidoPaterno;
      this.filtro.ApellidoMaterno = res[0].ApellidoMaterno;
      this.CalcularAnios();
      this.filtro.Comentario = res[0].Comentario;
      this.filtro.CorreoElectronico = res[0].CorreoElectronico;
    });

  }

  MostrarEmpresaAseguradora(tempfiltro: Admision) {
    console.log("id empresa", tempfiltro.IdEmpresaPaciente);
    var dtopersona = new dtoPersona();
    dtopersona.Persona = tempfiltro.IdEmpresaPaciente;
    return this.personaService.listarXPersona(dtopersona).then((res) => {
      console.log("res empresa", res);
      this.filtro2.Documento = res[0].Documento;
      this.filtro2.NombreCompleto = res[0].NombreCompleto;
      this.comboCargarSedeEmpresa(res[0].Persona);
    });
  }

  MostrarPersona(documento: string) {
      let Documento = {
        Documento: documento.trim(),
        tipopersona: "P",
        SoloBeneficiarios: "0",
        UneuNegocioId: "0"
      }
      return this.personaService.listaPersonaUsuario(Documento).then((res) => {  
      if (this.esListaVacia(res)) {  
          this.bloquearPag = false;   
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        this.filtro.Documento = null;
      }
      else if (res[0].hasOwnProperty("Documento")) {
          this.bloquearPag = true;  
          this.bscPersona = null;
          this.bscPersona = res[0];
          this.filtro.Documento = res[0].Documento;
          this.filtro.TipoDocumento = res[0].TipoDocumento;
          this.filtro.Nombres = res[0].Nombres;
          this.filtro.ApellidoPaterno = res[0].ApellidoPaterno;
          this.filtro.ApellidoMaterno = res[0].ApellidoMaterno;
          if (this.estaVacio(res[0].NombreCompleto)) {
            this.filtro.NombreCompleto = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`
          } else {
            this.filtro.NombreCompleto = res[0].NombreCompleto;
          }
          this.filtro.CorreoElectronico = res[0].CorreoElectronico;
          this.filtro.Comentario = res[0].Comentario;
          this.filtro.Sexo = res[0].Sexo;
          this.filtro.Persona = res[0].Persona;
          this.filtro.Edad = res[0].Edad;
          this.filtro.FechaNacimiento = new Date(res[0].FechaNacimiento);
          console.log("MostrarPersona habilita guardar", documento);
          this.disableBtnGuardar = true;
          this.CalcularAnios();      
            this.bloquearPag = false;   
          console.log("LLAMANDO PERSONA?", this.bscPersona);
      } else {
        this.filtro.Documento = null;    
          this.bloquearPag = false;      
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
      }
    }).catch(error => error);
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

  enterCantidad(evento) {
    if (evento.key == "Enter" || evento.key == "Tab") {
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
        var ExamenConIgv = e.Valor * this.getUsuarioAuth().data[0].Igv;
        cantidadExamenes += e.Cantidad;
        e.ValorEmpresa = e.Cantidad * (e.Valor+ExamenConIgv);
        total += e.ValorEmpresa;
      });
      this.cantidad = cantidadExamenes;
      this.lastYearTotal = total
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
      // e.Valor = valorExamen;
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
          title: 'Mensaje!',
          text: mensaje
        }).then((result) => {
          if (result.isConfirmed) {
            if (this.admision != null) {
              this.filtro.ClasificadorMovimiento = this.admision.ClasificadorMovimiento;
              console.log("COMBO SERVICIO DESDE ADMISION", this.admision.ClasificadorMovimiento)
            } else {
              this.filtro.ClasificadorMovimiento = this.seleccionarItemServicioTemp;
            }
          } else if (result.isDenied) {


          }
        })



      }

    }

  }


  EditarAdmision(tempfiltro: Admision) {

    console.log("Convenio EditarAdmision", tempfiltro)
    this.bloquearPag = true;
    this.MostrarPersona(tempfiltro.Documento);
    this.editarCampoDocumento = true;
    this.MostrarPersonaPaciente(tempfiltro);

    this.filtro.CodigoHC = tempfiltro.HistoriaClinica;
    this.filtro.NroPeticion = tempfiltro.NroPeticion;
    this.filtro.OrdenAtencion = tempfiltro.OrdenAtencion;
    this.filtro.OrdenSinapa = tempfiltro.OrdenSinapa;
    this.filtro.ObservacionAlta = tempfiltro.ObservacionAlta;
    // this.filtro.Cama = this.tempfiltro.Cama;
    this.filtro.CoaSeguro = tempfiltro.CoaSeguro;
    // this.filtro.IdListaBase = this.tempfiltro.IdListaBase;
    //this.filtro.TipoOperacionID = 
    this.getListarTipoOperacion(tempfiltro.TipoOperacionId)
    this.MostrarMedico(tempfiltro.MedicoId);
    this.MostrarAseguradora(tempfiltro.IdAseguradora);
    if (!this.esNumeroVacio(tempfiltro.IdEmpresaPaciente)) {
      this.MostrarEmpresaAseguradora(tempfiltro);
    }
    //Cargar combos
    this.filtro.ClasificadorMovimiento = tempfiltro.ClasificadorMovimiento
    this.filtro.TipoOrden = tempfiltro.TipoOrden
    this.grillaCargarDatos({ first: 0 });
    this.btnEditar();
    this.verBtnAnular = true;
    this.colCard1 = "col-sm-3"
    this.colCard2 = "col-sm-5"
    this.bloquearPag = false;
  }

  EliminarDetallePrueba() {

    this.lstListarXAdmision = this.lstListarXAdmision.filter(val => !this.registroSeleccionado.includes(val));
    this.registroSeleccionado = null;
    // var cont = this.lstListarXAdmision.length;
    var totaleliminar = 0
    var cantidadExamenes = 0
    var contardelete = 1
    if (this.lstListarXAdmision.length > 0) {
      this.lstListarXAdmision.forEach(element => {

        element.numeroXadmision = contardelete++;
        var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
        element.Valor = element.ValorEmpresa ;
        cantidadExamenes += element.Cantidad;
        element.ValorEmpresa = (element.ValorEmpresa + ExamenConIgv) * element.Cantidad;
        totaleliminar += element.ValorEmpresa;

      });
      this.lastYearTotal = totaleliminar;
      this.cantidad = cantidadExamenes;
    } else {
      this.lastYearTotal = 0
      this.cantidad = 0
    }
    this.toastMensaje('Se Quitó Examen(es)', 'success', 3000)

  }

  CalcularAnios() {
    let ahora = new Date();
    let fechanacimiento = new Date(this.filtro.FechaNacimiento);
    let anios = ahora.getFullYear() - fechanacimiento.getFullYear();

    fechanacimiento.setFullYear(ahora.getFullYear());
    if (ahora < fechanacimiento) { --anios }
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
    this.disableBtnGuardar = true;
    this.editarCampoDocumento = false;
    this.editarCampos = true;
    this.editarDetallePrueba = true;
    this.editarComboTipPac = true;
  }

  limpiarClienteRuc() {
    this.dtoClienteRuc.Persona = new Cliente().Persona;
    this.dtoClienteRuc.Documento = new Cliente().Documento;
    this.dtoClienteRuc.empresa = new Cliente().empresa;
    this.lstContrato = []
    this.lstContrato.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.filtro.TipoOperacionID = new FiltroPacienteClinica().TipoOperacionID;
    this.filtro.ComentarioContrato = new FiltroPacienteClinica().ComentarioContrato;
    this.lstTipoPaciente = []
    this.lstTipoPaciente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.filtro.TipoPacienteId = new FiltroPacienteClinica().TipoPacienteId;
    this.editarCampoCliente = false;
    this.lstListarXAdmision = [];
    this.lastYearTotal = 0;
    this.cantidad = 0;
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
    this.filtro2.Documento = new FiltroPacienteClinica().Documento;
    this.filtro2.NombreCompleto = new FiltroPacienteClinica().NombreCompleto;
    this.filtro2.Persona = new FiltroPacienteClinica().Persona;
    this.editarCampoEmpresa = false;
  }

  validarTeclaEnterPaciente(evento) {
    if (evento.key == "Enter") {
      if (this.filtro.Documento == null) {
        this.toastMensaje('Ingrese un Nro. de documento', 'warning', 3000)
      }
      else if (this.filtro.Documento.trim().length >= 5) {
        this.bloquearPag = true;
        this.MostrarPersona(this.filtro.Documento).then((x) => {
          if (!this.esListaVacia(this.bscPersona)) {
            console.log("Clinica listarConsentimientoXdocumento IdConsentimiento ",  this.IdConsentimiento);
            if(this.IdConsentimiento==1){
              this.listarConsentimientoXdocumento(this.filtro.Documento);
            }
            this.editarCampos = false;
            this.editarDetallePrueba = false;
            this.editarDetallePrueba = false;
            this.editarCampoDocumento = true;
            this.editarCampoMedico = false;
            this.editarCampoAseguradora = false;
            this.editarCampoEmpresa = false;
            this.disableBtnGuardar = true;
          }
        })
      } else {
        this.filtro.Documento = null;
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      }
    }
  }


  validarTeclaEnterCliente(evento) {

    if (evento.key == "Enter") {
      if (this.dtoClienteRuc.Documento == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      }
      else if (this.dtoClienteRuc.Documento.trim().length != 11) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      } else {
        var filtroClienteRuc = new FiltroCliente()
        this.Auth = this.getUsuarioAuth();
        var usuario = this.Auth.data;
        filtroClienteRuc.UneuNegocioId = usuario[0].UneuNegocioId
        filtroClienteRuc.TipEstado = 1;
        filtroClienteRuc.TIPOADMISIONID = 2;
        filtroClienteRuc.Codigo = this.dtoClienteRuc.Documento.trim();
        this.GetServiceCliente(filtroClienteRuc);
      }
    }
  }


  GetServiceCliente(filtroClienteRuc: FiltroCliente, codeExecute: boolean = false) {
    this.bloquearPag = true;
    this.consultaAdmisionService.listarcombocliente(filtroClienteRuc).then((res) => {
      this.bloquearPag = false;
      if (res.length == 0 || res == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      } else {
        this.dtoClienteRuc.Persona = res[0].Persona;
        this.dtoClienteRuc.Documento = res[0].Documento;
        this.dtoClienteRuc.empresa = res[0].empresa;
        this.editarCampoCliente = true;
        this.comboCargarContrato(codeExecute);
      }
    });
  }


  comboCargarContrato(codeExecute: boolean = false): Promise<number> {
    var operacionFiltro = new FiltroTipoOperacion()
    this.Auth = this.getUsuarioAuth();
    var usuario = this.Auth.data;
    operacionFiltro.UneuNegocioId = usuario[0].UneuNegocioId;
    operacionFiltro.TIPOADMISIONID = 2;
    operacionFiltro.TipEstado = 1;
    operacionFiltro.Persona = this.dtoClienteRuc.Persona;
    this.lstContrato = [];
    this.lstComentarioContrato = [];
    this.lstContrato.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.consultaAdmisionService.listarcombotipooperacion(operacionFiltro).then(resp => {
      resp.forEach(e => {
        this.lstContrato.push({ label: e.CodigoContrato, value: e.TipoOperacionID });
        this.lstComentarioContrato.push({ label: e.Observacion, value: e.TipoOperacionID })
      });
      if (!codeExecute) {
        if (this.esNumeroVacio(this.tipoOperacionIdTemp)) {
          this.filtro.TipoOperacionID = resp[0].TipoOperacionID;
        } else {
          this.filtro.TipoOperacionID = this.tipoOperacionIdTemp;
        }
        this.validarExistLstListarXAdmision(this.filtro.TipoOperacionID);
      } else {
        this.filtro.TipoOperacionID = this.admision.TipoOperacionId;
        this.setComentarioContrato(this.filtro.TipoOperacionID);
        this.comboCargarTipoPaciente(this.filtro.TipoOperacionID);
      }
      return 1;
    });
  }

  ValidarQuitarDetallePrueba() {
    var quitar = this.registroSeleccionado;
    quitar.forEach(element => {
      if (element.hasOwnProperty("IdAdmision")) {
        this.QuitarDetallePrueba();
      } else {
        this.EliminarDetallePrueba();
      }
    });
  }

  QuitarDetallePrueba() {
    var quitar = this.registroSeleccionado;
    var validado = 0;
    console.log("data del registro seleccionado", quitar)
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
        this.toastMensaje(`Ya no se puede eliminar Examen(es).`, 'warning', 2000)
        // Swal.fire({
        //   icon: 'warning',
        //   title: 'MENSAJE!',
        //   text: `Ya no se puede eliminar Examen(es).`
        // })
      }
    });
    if (validado != 1) {
      this.pacienteClinicaService.anularAdmisionDetalle(5, this.lstAnularAdmisionDetalle, this.getUsuarioToken()).then(
        res => {
          this.auditoria(res.Admision, 2);
          this.bloquearPag = true;
          this.toastMensaje(`${res.Mensaje}`, 'success', 2000)
          // Swal.fire({
          //   position: 'top-end',
          //   icon: 'success',
          //   title: `${res.Mensaje}`,
          //   showConfirmButton: false,
          //   timer: 1500
          // })
          setTimeout(() => {
            this.bloquearPag = false;
          }, 500);


          if (res.list_AdmisionServicio.length > 0) {
            this.loading = true;
            this.lstListarXAdmision = [];
            var totala = 0;
            var cantidadExamenes = 0;
            var contadorsito = 1;
            res.list_AdmisionServicio.forEach(element => {
              var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
              element.Valor = element.ValorEmpresa ;
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = (element.Valor+ ExamenConIgv) * element.Cantidad;
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
            this.lstListarXAdmision = [];
            this.lastYearTotal = 0
            this.cantidad = 0
          }
        }).catch(error => error)

    }
  }

  AnularDetallePrueba() {
    var anular = this.registroSeleccionado;
    var validado = 0;
    this.lstAnularAdmisionDetalle = [];
    console.log("data del registro seleccionado", anular)
    anular.forEach(element => {
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
          console.log("llegando toda la lista", this.dtofinal.list_AdmisionServicio)
        } else {
          validado = 1

          this.toastMensaje('El examen debe estar en pendiente para proceder la anulación.', 'warning', 2000)
          this.registroSeleccionado = null;
        }
      } else {
        validado = 1
        this.toastMensaje('No se puede anular Examen(es)', 'warning', 3000)
        this.registroSeleccionado = null;
      }
    });
    if (validado != 1) {
      this.pacienteClinicaService.anularAdmisionDetalle(4, this.lstAnularAdmisionDetalle, this.getUsuarioToken()).then(
        res => {
          this.auditoria(res.Admision, 2);
          this.bloquearPag = true;
          this.toastMensaje(`${res.Mensaje}`, 'success', 2000)
          // Swal.fire({
          //   position: 'top-end',
          //   icon: 'success',
          //   title: `${res.Mensaje}`,
          //   showConfirmButton: false,
          //   timer: 1500
          // })
          setTimeout(() => {
            this.bloquearPag = false;
          }, 500);

          if (res.list_AdmisionServicio != null) {
            this.loading = true;
            this.lstListarXAdmision = [];
            var totala = 0;
            var cantidadExamenes = 0;
            var contadorsito = 1;
            res.list_AdmisionServicio.forEach(element => {

              var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
              element.Valor = element.ValorEmpresa ;
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = (element.Valor+ ExamenConIgv) * element.Cantidad;
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
            this.toastMensaje(`${res.Mensaje}`, 'warning', 2000)
            // Swal.fire({
            //   icon: 'warning',
            //   title: '¡Mensaje!',
            //   text: `${res.Mensaje}`
            // })
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
    var tempfiltro = admision;
    if (validar == null) {
      Swal.fire({
        icon: 'warning',
        title: `¡Mensaje!`,
        text: validar
      })

    } else {
      Swal.fire({
        title: 'Importante',
        text: "¿Seguro que desea anular el registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#094d74',
        cancelButtonColor: '#ffc72f',
        cancelButtonText: 'No, Cancelar!',
        confirmButtonText: 'Si, Anular!'
      }).then((result) => {
        if (result.isConfirmed) {
          var serv = this.lstListarXAdmision;
          console.log("Registro seleccionado anular", serv)
          console.log("Cabecera del anular admision", tempfiltro)
          this.dtofinal.Admision.TipoDocumento = tempfiltro.TipoDocumento;
          this.dtofinal.Admision.Documento = tempfiltro.Documento;
          this.dtofinal.Admision.NombreCompleto = tempfiltro.NombreCompleto;
          this.dtofinal.Admision.fechanacimiento = new Date(tempfiltro.fechanacimiento);
          this.dtofinal.Admision.nombres = tempfiltro.nombres;
          this.dtofinal.Admision.apellidopaterno = tempfiltro.apellidopaterno;
          this.dtofinal.Admision.apellidomaterno = tempfiltro.apellidomaterno;
          this.dtofinal.Admision.sexo = tempfiltro.sexo;
          this.dtofinal.Admision.CorreoElectronico = tempfiltro.CorreoElectronico;
          this.dtofinal.Admision.IdAdmision = tempfiltro.IdAdmision; //admision.IdAdmision; normal registraria sin llamarlo cunado es 1
          this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
          this.dtofinal.Admision.TipoOperacionID = tempfiltro.TipoOperacionId;
          this.dtofinal.Admision.Persona = tempfiltro.Persona; //viene de un metodo persona
          this.dtofinal.Admision.FechaAdmision = new Date(tempfiltro.FechaAdmision);
          this.dtofinal.Admision.HistoriaClinica = tempfiltro.HistoriaClinica;
          this.dtofinal.Admision.NroPeticion = tempfiltro.NroPeticion;
          this.dtofinal.Admision.OrdenAtencion = tempfiltro.OrdenAtencion;
          this.dtofinal.Admision.MedicoId = tempfiltro.MedicoId;
          this.dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
          this.dtofinal.Admision.Estado = tempfiltro.Estado;
          this.dtofinal.Admision.FechaCreacion = new Date(tempfiltro.FechaCreacion);
          this.dtofinal.Admision.FechaModificacion = new Date();
          this.dtofinal.Admision.UsuarioCreacion = tempfiltro.UsuarioCreacion; //derrepente pasando nulo
          this.dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
          this.dtofinal.Admision.IpCreacion = tempfiltro.IpCreacion;   //crear metodo que nos muestre la IP del usuario
          this.dtofinal.Admision.IpModificacion = this.getIp();  //crear metodo que nos muestre la IP del usuario       
          this.dtofinal.Admision.IdEmpresaPaciente = tempfiltro.IdEmpresaPaciente;
          this.dtofinal.Admision.IdAseguradora = tempfiltro.IdAseguradora;
          this.dtofinal.Admision.TipoOrden = tempfiltro.TipoOrden;
          this.dtofinal.Admision.ClasificadorMovimiento = tempfiltro.ClasificadorMovimiento;
          this.dtofinal.Admision.IdEspecialidad = tempfiltro.IdEspecialidad;
          this.dtofinal.Admision.TipoAtencion = tempfiltro.TipoAtencion;
          this.dtofinal.Admision.DesEstado = tempfiltro.DesEstado;
          this.dtofinal.Admision.TIPOADMISIONID = tempfiltro.TIPOADMISIONID; //admision.TIPOADMISIONID;
          this.dtofinal.Admision.FlatAprobacion = tempfiltro.FlatAprobacion;
          console.log("llegando toda cabecera", this.dtofinal.Admision)
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
          console.log("dto a anular admision:", this.dtofinal);
          this.bloquearPag = true;
          this.pacienteClinicaService.mantenimientoAdmisionClinica(3, this.dtofinal, this.getUsuarioToken()).then(
            res => {
              this.bloquearPag = false;
              console.log("entro el servicio")
              this.auditoria(res.Admision, 2);
              this.toastMensaje('Se Anuló el registro con éxito.', 'success', 2000)
              if (res.list_AdmisionServicio != null) {
                this.loading = true;
                console.log("res al guardar admision TODO", res);
                this.lastYearTotal = 0;
                this.contado = 1;
                this.lstListarXAdmision = [];
                var totala = 0;
                var cantidadExamenes = 0;
                res.list_AdmisionServicio.forEach(element => {
                  console.log("valor de e", element)
                  var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
                  element.Valor = element.ValorEmpresa ;
                  cantidadExamenes += element.Cantidad;
                  element.ValorEmpresa = (element.Valor + ExamenConIgv)* element.Cantidad;
                  totala += element.ValorEmpresa;
                  element.numeroXadmision = this.contado++;
                  this.lstListarXAdmision.push(element);
                });
                this.lastYearTotal = totala;
                this.cantidad = cantidadExamenes;
                console.log("valor de la tabla", this.lstListarXAdmision)
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
      })
    }


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
      }
    }
  }

  //validar para solo buscar RUC --> se igualo a "R"
  validarEnterEmpresa(evento) {
    if (evento.key == "Enter") {
       var filtro = new FiltroPacienteClinica();
      if (this.filtro2.Documento == null) {
        this.toastMensaje('Debe Ingresar el Documento Empresa.', 'warning', 3000)
      }
      else if (this.filtro2.Documento.trim().length == 11 || this.filtro2.Documento == "0") 
      {
        let dto = {
          Documento: this.filtro2.Documento.trim(),
          tipopersona: "J",
          TipoDocumento: "R",          
          Estado: "A"
        }

        this.bloquearPag = true;
        this.personaService.listarpaginado(dto).then((res) => {
          this.bloquearPag = false;
          if (res.length > 0) {
            this.filtro2.NombreCompleto = res[0].NombreCompleto;
            this.filtro2.Persona = res[0].Persona;
            this.editarCampoEmpresa = true;
          } else {
              this.filtro2.Documento = null;
              this.filtro2.NombreCompleto = null;
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
          }
        });

      } else {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
      }
    }
  }

  validarEnterAseguradora(evento) {
    var filtro = new FiltroPacienteClinica();
    if (evento.key == "Enter") {
      if (this.filtro.IdAseguradora == null) {
        this.toastMensaje('Debe Ingresar el Id de Aseguradora.', 'warning', 3000);
      } else if (String(this.filtro.IdAseguradora).length <= 7) {
        this.bloquearPag = true;
        filtro.IdAseguradora = this.filtro.IdAseguradora;
        filtro.Estado = 1;
        this.aseguradoraService.listarpaginado(filtro).then((res) => {
          this.bloquearPag = false;
          if (res.length == 1) {
            this.filtro.NombreEmpresa = res[0].NombreEmpresa;
            this.filtro.TipoOrdenAtencion = res[0].TipoAseguradora;
            this.editarCampoAseguradora = true;
          } else {
            this.filtro.IdAseguradora = null
            this.filtro.NombreEmpresa = null;
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
          }
        });
      } else {
        this.filtro.IdAseguradora = null;
        this.filtro.NombreEmpresa = null;
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      }
    }
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

  listaPerfil(): Promise<number> {

    var filtro
    filtro = {
      UneuNegocioId: this.getUsuarioAuth().data[0].UneuNegocioId,
      MosEstado: 1,
      TipoOperacionID: this.filtro.TipoOperacionID
    }

    return this.consultaAdmisionService.listarModeloServicio(filtro).then(resp => {

      return resp[0].ModeloServicioId;

    });
  }

  async validarTeclaEnterExamen(evento) {

    if (evento.key == "Enter") {
      var validado = 0;
      var total = 0;
      var cantidadExamenes = 0;
      this.contarExamenes = this.lstListarXAdmision.length;
      var modeloSevicioId = await this.listaPerfil();
      this.examen.Estado = 1;
      this.examen.TipoOperacionID = this.filtro.TipoOperacionID;
      this.examen.ModeloServicioId = modeloSevicioId;
      this.examen.empresa = this.filtro.Persona;
      this.examen.CodigoComponente = this.filtro.CodigoComponente;
      this.examen.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;

      this.bloquearPag = false;
      this.examenService.examenpaginado(this.examen).then((res) => {
        if (!this.esListaVacia(res)) {
          this.contarExamenes += res.length;
          res.forEach(element => {
            this.lstListarXAdmision.forEach(e => {
              cantidadExamenes += e.Cantidad;
              e.ValorEmpresa = e.Valor * e.Cantidad;
              total += e.ValorEmpresa;
              if (element.CodigoComponente == e.CodigoComponente) {
                validado = 1;
              }

            });

            this.bloquearPag = true;
            if (validado == 1) {
              setTimeout(() => {
                this.bloquearPag = false;
              }, 100);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'EL CAMPO REGISTRADO SE REPITE', life: 3000 })
              this.filtro.CodigoComponente = null;
              return;

            } else {
              // element.numeroXadmision = this.contado++;

              var contadorsito = this.lstListarXAdmision.length;
              element.numeroXadmision = contadorsito + 1;
              var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
              element.Valor = element.ValorEmpresa ;
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = (element.Valor + ExamenConIgv) * element.Cantidad;
              this.lstListarXAdmision.push(element);
              total += element.ValorEmpresa;
              this.lastYearTotal = total;
              this.cantidad = cantidadExamenes;
              this.filtro.CodigoComponente = null;
              setTimeout(() => {
                this.bloquearPag = false;
              }, 100);
            }
          });
        } else {
          setTimeout(() => {
            this.bloquearPag = false;
          }, 100);
          this.filtro.CodigoComponente = null;
          this.toastMensaje('Examen no encontrado, revise bien los parametros', 'warning', 3000)
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

  imprimir(dto: Admision) {
    this.bloquearPag = true;
    var payload = {
      IdReporte: 1,
      IdAdmision: this.admision.IdAdmision,
      NroPeticion: this.filtro.NroPeticion
    }
    this.consultaAdmisionService.printListadoReporte(payload).then(resp => {
      console.log("prin", resp)

      this.verReporteModal = true

      var base64 = (resp.ValorByte);
      const file2 = this.base64toBlob(resp.ValorByte, 'application/pdf');

      const link = window.URL.createObjectURL(file2);
      this.pdfViewerActividades.pdfSrc = link;
      this.pdfViewerActividades.refresh();
      setTimeout(() => {
        this.bloquearPag = false;
      }, 300);

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


  auditoria(filtro?: any, validar?: number) {
    if (validar == 1) {
      this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
      this.fechaCreacion = new Date();
      this.fechaModificacion = new Date();
    } 
    else { 
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
             // console.log("mostrar auditoria", this.usuario, this.fechaCreacion, this.fechaModificacion)
            })
          }
        } else {
          this.usuario = this.Auth[0].NombreCompleto;
          this.fechaCreacion = new Date();
          this.fechaModificacion = new Date();
        }
    }
    console.log("llego auditoria", this.usuario, this.fechaCreacion, this.fechaModificacion)
  }


  listarConsentimientoXdocumento(documento: string) {
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