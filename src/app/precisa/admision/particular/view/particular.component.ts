import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { AseguradoraBuscarComponent } from '../../../framework-comun/Aseguradora/components/aseguradora-buscar.component';
import { AseguradoraService } from '../../../framework-comun/Aseguradora/servicio/aseguradora.service';
import { AseguradoraMantenimientoComponent } from '../../../framework-comun/Aseguradora/vista/aseguradora-mantenimiento.component';
import { EmpresaBuscarComponent } from '../../../framework-comun/Empresa/view/empresa-buscar.component';
import { ExamenBuscarComponent } from '../../../framework-comun/Examen/components/examen-buscar.component';
import { FiltroExamen, FiltroServicio } from '../../../framework-comun/Examen/dominio/filtro/FiltroExamen';
import { ExamenService } from '../../../framework-comun/Examen/servicio/Examen.service';
import { MedicoBuscarComponent } from '../../../framework-comun/Medico/components/medico-buscar.component';
import { dtoMedico } from '../../../framework-comun/Medico/dominio/dto/dtomedico';
import { MedicoService } from '../../../framework-comun/Medico/servicio/medico.service';
import { MedicoMantenimientoComponent } from '../../../framework-comun/Medico/vista/medico-mantenimiento.component';
import { PersonaBuscarComponent } from '../../../framework-comun/Persona/components/persona-buscar.component';
import { dtoPersona } from '../../../framework-comun/Persona/dominio/dto/dtoPersona';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { PersonaMantenimientoComponent } from '../../../framework-comun/Persona/vista/persona-mantenimiento.component';
import { convertDateStringsToDates } from '../../../framework/funciones/dateutils';
import { Admision, AdmisionServicio, TraerXAdmisionServicio } from '../../consulta/dominio/dto/DtoConsultaAdmision';
import { FiltroListarXAdmision, FiltroTipoOperacion } from '../../consulta/dominio/filtro/FiltroConsultaAdmision';
import { ConsultaAdmisionService } from '../../consulta/servicio/consulta-admision.service';
import { DtoAdmisionclinicaDetalle } from '../../paciente-clinica/dominio/dto/DtoAdmisionclinicaDetalle';
import { DtoAdmisionprueba, DtoPacienteClinica } from '../../paciente-clinica/dominio/dto/DtoPacienteClinica';
import { FiltroPacienteClinica } from '../../paciente-clinica/dominio/filtro/FiltroPacienteClinica';
import { PacienteClinicaService } from '../../paciente-clinica/service/paciente-clinica.service';
import { CajaPagoComponent } from '../../../framework-comun/Cajapago/vista/cajapago.component';



@Component({
  selector: 'ngx-particular',
  templateUrl: './particular.component.html',
  styleUrls: ['./particular.component.scss']

})
export class ParticularComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController {

  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;
  @ViewChild(MedicoMantenimientoComponent, { static: false }) medicoMantenimientoComponent: MedicoMantenimientoComponent;
  @ViewChild(MedicoBuscarComponent, { static: false }) medicoBuscarComponent: MedicoBuscarComponent;
  @ViewChild(AseguradoraBuscarComponent, { static: false }) aseguradoraBuscarComponent: AseguradoraBuscarComponent;
  @ViewChild(AseguradoraMantenimientoComponent, { static: false }) aseguradoraMantenimientoComponent: AseguradoraMantenimientoComponent;
  @ViewChild(EmpresaBuscarComponent, { static: false }) empresaBuscarComponent: EmpresaBuscarComponent;
  @ViewChild(ExamenBuscarComponent, { static: false }) examenBuscarComponent: ExamenBuscarComponent;
  @ViewChild('pdfViewerActividades', { static: false }) pdfViewerActividades;
  @ViewChild(CajaPagoComponent, { static: false }) cajaPagoComponent: CajaPagoComponent;


  colCard1: string = "col-sm-5";
  colCard2: string = "col-sm-3";
  verReporteModal: boolean = false;

  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;

  segundos: number = 30;
  IdTimer: any;

  contado: number = 1;
  total: number = 0;
  contarExamenes: number = 15;

  seleccionarItemPacienteTemp: any;
  seleccionarItemServicioTemp: any;
  dtofinal: DtoAdmisionprueba = new DtoAdmisionprueba();
  lstprocedencia: SelectItem[] = [];
  lstSedeEmpresa: SelectItem[] = [];
  lstTipoOrden: SelectItem[] = [];
  verBtnAnular: boolean = false;
  bscPersona: any[] = [];
  registroSeleccionado: any;
  editarCantidad: boolean = true;
  editarCamposAutomaticos: boolean = true;
  editarCampoNroCama: boolean = true;
  disableBtnGuardar: boolean = true;
  editarCampoSevicio: boolean = true;
  xadmision: FiltroListarXAdmision = new FiltroListarXAdmision;
  examen: FiltroExamen = new FiltroExamen();
  operacion: FiltroTipoOperacion = new FiltroTipoOperacion();
  filtro: FiltroPacienteClinica = new FiltroPacienteClinica();
  filtro2: FiltroPacienteClinica = new FiltroPacienteClinica();
  admision: DtoPacienteClinica;
  servicio: FiltroServicio = new FiltroServicio();
  Auth: UsuarioAuth = new UsuarioAuth();
  bloquearPag: boolean;
  loading: boolean;
  cantidad: number = 0;
  lstTipoOperacion: SelectItem[] = [];
  lstTipoAtencion: SelectItem[] = [];
  lstSexo: SelectItem[] = [];
  lstServicio: SelectItem[] = [];
  lstListarXAdmision: DtoPacienteClinica[] = [];
  lstAnularAdmisionDetalle: DtoPacienteClinica[] = [];
  editarCampos: boolean = true;
  editarCampoMedico: boolean = true;
  editarCampoAseguradora: boolean = true;
  editarCampoEmpresa: boolean = true;
  editarCampoDocumento: boolean = false;
  lastYearTotal: number = 0;
  redondeoTotal: any;
  difRedondeo: any;
  tempfiltro: any;
  selectedTipoPaciente = "";

  constructor(
    protected messageService: MessageService,
    private pacienteClinicaService: PacienteClinicaService,
    private examenService: ExamenService,
    private consultaAdmisionService: ConsultaAdmisionService,
    private aseguradoraService: AseguradoraService,
    private medicoService: MedicoService,
    private personaService: PersonaService,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnDestroy(): void {
    //this.userInactive.unsubscribe();
  }

  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }
  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }

  corePago(): void {
    this.cajaPagoComponent.coreIniciarComponente(new MensajeController(this, 'SELECPAGO', 'Pago Particular'));
  }

  // coreMensaje(mensage: MensajeController): void {
  //   throw new Error('Method not implemented.');
  // }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    const p1 = this.comboCargarSexo();
    const p2 = this.comboCargarServicios();
    const p3 = this.comboCargarTipoOperacion();
    const p4 = this.comboCargarProcendia();
    const p5 = this.comboCargarTipoOrden();
    const p6 = this.comboCargarTipoAtencion();
    Promise.all([p1, p2, p3, p4, p5, p6]).then(resp => {
      var condicion = this.route.snapshot.url.length;
      if (condicion > 2) {
        this.tempfiltro = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
        if (this.tempfiltro) {
          console.log("data editar Particular", this.tempfiltro)
          this.EditarAdmision(this.tempfiltro);
          this.auditoria(this.tempfiltro, 2);
          this.admision = this.tempfiltro;
        }
      }

      this.filtro = this.formularioFiltrosRestaurar(this.filtro);
      this.auditoria("NUEVO", 1);
        this.bloquearPag = false;
    });
  }

  EditarAdmision(tempfiltro: Admision) {

    this.bloquearPag = true;

    // this.tempfiltro = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
    // console.log("editar admision", this.tempfiltro)
    this.filtro.Documento = tempfiltro.Documento;
    this.filtro.NombreCompleto = tempfiltro.NombreCompleto;
    // this.filtro.CodigoHC = tempfiltro.HistoriaClinica;
    this.filtro.Sexo = tempfiltro.sexo;
    this.filtro.FechaNacimiento = tempfiltro.fechanacimiento;
    this.CalcularAnios();
    this.filtro.NroPeticion = tempfiltro.NroPeticion;
    // this.filtro.OrdenAtencion = tempfiltro.OrdenAtencion;
    this.filtro.OrdenSinapa = tempfiltro.OrdenSinapa;
    this.filtro.Telefono = tempfiltro.Telefono;
    this.filtro.Cama = tempfiltro.Cama;

    this.filtro.Nombres = tempfiltro.nombres;
    this.filtro.ApellidoPaterno = tempfiltro.apellidopaterno;
    this.filtro.ApellidoMaterno = tempfiltro.apellidomaterno;
    this.filtro.TipoOperacionID = tempfiltro.TipoOperacionId;
    console.log("DATA TIPO OPERACION", tempfiltro)
    this.filtro.ClasificadorMovimiento = tempfiltro.ClasificadorMovimiento;
    console.log("DATA SERVICIO", this.filtro.TipoAtencion);

    // this.filtro.IdListaBase = tempfiltro.IdListaBase;

    // this.filtro.TipoOperacionID = tempfiltro.TipoOperacionID; //hacer una validacion falta pasar IDsede

    this.filtro.TipoOrden = tempfiltro.TipoOrden;
    this.filtro.empresa = tempfiltro.IdSede;

    // this.lstSedeEmpresa = [];
    // this.comboCargarSedeEmpresa(tempfiltro.IdEmpresaPaciente)

    this.filtro.IdSedeEmpresa = tempfiltro.IdSedeEmpresa;
    // this.comboCargarTipoOperacioneditar(tempfiltro);

    // this.bscPersona=tempfiltro

    this.MostrarEmpresa(tempfiltro.Persona, 1);
    this.editarCampoDocumento = true;
    if (!this.esNumeroVacio(tempfiltro.IdEmpresaPaciente)) {
      // if (tempfiltro.IdEmpresaPaciente > 0) {
      this.MostrarEmpresa(tempfiltro.IdEmpresaPaciente, 2);
      this.lstSedeEmpresa = [];
      this.comboCargarSedeEmpresa(tempfiltro.IdEmpresaPaciente)
      this.filtro.IdSedeEmpresa = tempfiltro.IdSedeEmpresa;
    }
    this.MostrarMedico(tempfiltro.MedicoId);


    this.MostrarAseguradora(tempfiltro.IdAseguradora);
    // this.MostrarEmpresa();
    this.grillaCargarDatos({ first: 0 });
    //if (anular.Estado == 1 || anular.Estado == 2) {
    this.verBtnAnular = true;
    this.colCard1 = "col-sm-2"
    this.colCard2 = "col-sm-6"
    //}
    setTimeout(() => {
      this.bloquearPag = false;
    }, 1000);
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

  MostrarMedico(MedicoId) {
    console.log("ID LLEGANDO MEDICO", MedicoId);
    // var tempdto = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
    var dtoadmin = new FiltroPacienteClinica();
    // var tempfiltro = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
    dtoadmin.MedicoId = MedicoId;


    return this.medicoService.listarpaginado(dtoadmin).then((res) => {
      console.log("mostrar medico", res)
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
    console.log("ID LLEGANDO ASEGURADORA", IdAseguradora);
    // var tempdto = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
    var filtro = new dtoPersona();
    filtro.IdAseguradora = IdAseguradora;

    return this.aseguradoraService.listarpaginado(filtro).then((res) => {
      console.log("mostrar aseguradora", res)
      this.filtro.IdAseguradora = res[0].IdAseguradora;
      this.filtro.NombreEmpresa = res[0].NombreEmpresa;
      this.filtro.TipoOrdenAtencion = res[0].TipoAseguradora;

    });
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

  async validarTeclaEnterExamen(evento) {

    if (evento.key == "Enter") {
      var validado = 0;
      var total = 0;
      var cantidadExamenes = 0;
      this.contarExamenes = this.lstListarXAdmision.length;
      var modeloSevicioId = await this.listaPerfil();

      this.examen.Estado = 1;
      this.examen.TipoOperacionID = this.filtro.TipoOperacionID;
      this.examen.empresa = this.filtro.Persona;
      this.examen.ModeloServicioId = modeloSevicioId;
      this.examen.CodigoComponente = this.filtro.CodigoComponente.trim();
      this.examen.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;

      this.examenService.examenpaginado(this.examen).then((res) => {
        console.log("examen", res)

        if (!this.esListaVacia(res)) {

          console.log("entro al if")
          if (res[0].hasOwnProperty("CodigoComponente")) {
            this.contarExamenes += res.length;
            res.forEach(element => {

              this.lstListarXAdmision.forEach(e => {
                cantidadExamenes += e.Cantidad;
                total += e.Cantidad * e.ValorEmpresa;
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
                var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
                element.Valor = element.ValorEmpresa + ExamenConIgv;
                cantidadExamenes += element.Cantidad;
                element.ValorEmpresa = element.Valor * element.Cantidad;
                total += element.ValorEmpresa;
                this.lstListarXAdmision.push(element);
                this.seleccionarItemPacienteTemp = this.filtro.TipoOperacionID;
                this.seleccionarItemServicioTemp = this.filtro.ClasificadorMovimiento;
                this.cantidad = cantidadExamenes;
                this.lastYearTotal = total;
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

  ValidateCMP() {
    if (this.filtro.CMP == "0") {
      return "Esta guardando la petición con medico automático, ¿Desea continuar?"
    }
    return null;
  }

  ValidateFiles() {

    if (this.filtro.Telefono == null || String(this.filtro.Telefono) == "") {
      return "Agregar un número de teléfono.";
    }

    if (this.filtro.MedicoId == null) {
      return "Seleccionar al médico.";
    }

    if (this.estaVacio(this.filtro.NombreEmpresa)) {
      return "Seleccionar la aseguradora.";
    }

    if (this.esListaVacia(this.registroSeleccionado)) {
      return "Seleccionar un servicio como minimo con estado pendiente antes de grabar la OA.";
    }

    if (this.filtro.IdEspecialidad == null) {
      return "Seleccionar la procedencia.";
    }

    if (this.filtro.TipoOrden == null) {
      return "Seleccionar el tipo orden.";
    }

    if (this.filtro.TipoAtencion == null) {
      return "Seleccionar el tipo atención.";
    }

    if (this.filtro.TipoOperacionID == null) {
      return "Seleccionar el tipo operación.";
    }

    return null;
  }

  selectedItemTipoAtencion(event) {
    if (event.value == 2) {
      this.editarCampoNroCama = false;
    } else {
      this.editarCampoNroCama = true;
    }

  }

  btnNuevo() {
    this.filtro = new FiltroPacienteClinica();
    this.filtro2 = new FiltroPacienteClinica();
    this.limpiarPersona();
    this.limpiarAseguradora();
    this.limpiarMedico();
    this.limpiarEmpresa();
    this.filtro.TipoOrden = "R";
    this.filtro.TipoAtencion = 1;

    this.filtro.ClasificadorMovimiento = this.getUsuarioAuth().data[0].ClasificadorMovimiento
    this.lstListarXAdmision = [];
    this.lastYearTotal = 0
    this.cantidad = 0
    this.filtro.IdEspecialidad = 0
    this.filtro.NroPeticion = null;
    this.filtro.Cama = null;
    this.filtro.OrdenSinapa = null;
    this.filtro.CoaSeguro = null;
    this.filtro.Sexo = null;
    this.filtro.ObservacionAlta = null;
    this.filtro.CodigoComponente = null;
    this.admision = null;
    this.filtro.comboCliente = this.getUsuarioAuth().data[0].IdSede

    this.editarCampos = true;
    this.editarCampoMedico = true;
    this.editarCampoAseguradora = true;
    this.editarCampoEmpresa = true;
    this.editarCampoDocumento = false;
    this.verBtnAnular = false;
    this.colCard1 = "col-sm-5"
    this.colCard2 = "col-sm-3"

  }

  btnEditar() {
    this.editarCamposAutomaticos = true;
    if (this.filtro.TipoAtencion == 2) {
      this.editarCampoNroCama = false;
    } else {
      this.editarCampoNroCama = true;
    }
    this.editarCampos = false;
    this.editarCampoSevicio = false;
    this.editarCampoMedico = false;
    this.editarCampoAseguradora = false;
    this.editarCampoEmpresa = false;

  }



  ValidarGuardar(admision: DtoPacienteClinica) {
    let valida = this.ValidateFiles()
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
          title: '¡Importante!',
          text: "¿Seguro que desea guardar el registro? " + this.filtro.Documento,
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
              text: "¿Seguro que desea guardar el registro? " + this.filtro.Documento,
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
    console.log("llegando ", validar)
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

          console.log("filtro del anular admision despues", this.filtro)
          this.dtofinal.Admision.TipoDocumento = this.filtro.TipoDocumento;
          this.dtofinal.Admision.Documento = this.filtro.Documento;
          this.dtofinal.Admision.NombreCompleto = this.filtro.NombreCompleto;
          this.dtofinal.Admision.fechanacimiento = new Date(this.filtro.FechaNacimiento);
          this.dtofinal.Admision.nombres = this.filtro.Nombres;
          this.dtofinal.Admision.apellidopaterno = this.filtro.ApellidoPaterno;
          this.dtofinal.Admision.apellidomaterno = this.filtro.ApellidoMaterno;
          this.dtofinal.Admision.sexo = this.filtro.Sexo;
          this.dtofinal.Admision.CorreoElectronico = "";
          this.dtofinal.Admision.IdAdmision = admision.IdAdmision; //normal registraria sin llamarlo cunado es 1
          this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
          this.dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;
          console.log("TIPO OPERACION", this.dtofinal.Admision.TipoOperacionID)
          this.dtofinal.Admision.Persona = this.filtro.Persona; //viene de un metodo persona
          this.dtofinal.Admision.FechaAdmision = new Date(admision.FechaAdmision);
          this.dtofinal.Admision.HistoriaClinica = "";
          this.dtofinal.Admision.NroPeticion = this.filtro.NroPeticion;
          this.dtofinal.Admision.OrdenAtencion = "";
          this.dtofinal.Admision.MedicoId = this.filtro.MedicoId;
          this.dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
          this.dtofinal.Admision.Estado = admision.Estado;
          this.dtofinal.Admision.FechaCreacion = new Date(admision.FechaCreacion);
          this.dtofinal.Admision.FechaModificacion = new Date();
          this.dtofinal.Admision.UsuarioCreacion = admision.UsuarioCreacion; //derrepente pasando nulo
          this.dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
          this.dtofinal.Admision.IpCreacion = admision.IpCreacion;   //crear metodo que nos muestre la IP del usuario
          this.dtofinal.Admision.IpModificacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
          console.log("IP LLEGANDOOOOOO:::", this.dtofinal.Admision.IpModificacion)
          this.dtofinal.Admision.IdEmpresaPaciente = this.filtro2.Persona;
          this.dtofinal.Admision.IdAseguradora = this.filtro.IdAseguradora;
          this.dtofinal.Admision.TipoOrden = this.filtro.TipoOrden;
          this.dtofinal.Admision.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;
          // this.dtofinal.Admision.TipoPaciente=admision.TipoPaciente;
          this.dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
          // this.dtofinal.Admision.TipoOrdenAtencion=admision.TipoOrdenAtencion;
          this.dtofinal.Admision.TipoAtencion = admision.TipoAtencion;
          this.dtofinal.Admision.DesEstado = admision.DesEstado;
          this.dtofinal.Admision.TIPOADMISIONID = 3; //admision.TIPOADMISIONID;
          this.dtofinal.Admision.FlatAprobacion = admision.FlatAprobacion;
          console.log("llegando toda cabecera", this.dtofinal.Admision)
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
              this.bloquearPag = true;
              this.toastMensaje('Se Anuló el registro con éxito.', 'success', 2000)

              setTimeout(() => {
                this.bloquearPag = false;
              }, 100);

              if (res.list_AdmisionServicio != null) {
                this.loading = true;
                //
                this.lastYearTotal = 0;
                this.cantidad = 0;
                this.contado = 1;
                this.lstListarXAdmision = [];
                var totala = 0;
                var cantidadExamenes = 0;

                res.list_AdmisionServicio.forEach(element => {
                  var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
                  element.Valor = element.ValorEmpresa + ExamenConIgv;
                  cantidadExamenes += element.Cantidad;
                  element.ValorEmpresa = element.Valor * element.Cantidad;
                  totala += element.ValorEmpresa;
                  // var contadorsito = 1;
                  element.numeroXadmision = this.contado++;
                  this.lstListarXAdmision.push(element);
                });
                // this.lstListarXAdmision = res.list_AdmisionServicio
                this.lastYearTotal = totala;
                this.cantidad = cantidadExamenes;
                // this.registroSeleccionado = null;
                console.log("valor de la tabla", this.lstListarXAdmision)
                this.loading = false;

              } else {
                this.toastMensaje(`${res.Mensaje}`, 'warning', 2000)

              }
            }).catch(error => error)

        }
      })
    }


  }

  AnularDetallePrueba() {
    var anular = this.registroSeleccionado;
    var validado = 0;
    this.lstAnularAdmisionDetalle = [];
    console.log("data del registro seleccionado", anular)
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
              element.Valor = element.ValorEmpresa + ExamenConIgv;
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
            this.toastMensaje(`${res.Mensaje}`, 'warning', 2000)
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
        element.Valor = element.ValorEmpresa + ExamenConIgv;
        cantidadExamenes += element.Cantidad;
        element.ValorEmpresa = element.Valor * element.Cantidad;
        totaleliminar += element.ValorEmpresa;

      });
      this.lastYearTotal = totaleliminar;
      this.cantidad = cantidadExamenes;
    } else {
      this.lastYearTotal = 0
      this.cantidad = 0
    }
    this.toastMensaje('Se Quitó Examen(es)', 'success', 3000)

    // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Se Quitó Examen(es)', life: 3000 });

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
              element.Valor = element.ValorEmpresa + ExamenConIgv;
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
            this.lstListarXAdmision = [];
            this.lastYearTotal = 0
            this.cantidad = 0
          }
        }).catch(error => error)

    }
  }

  GuardarAdmision(admision: DtoPacienteClinica) {
    this.bloquearPag = true;

    let _dtofinal = new TraerXAdmisionServicio()
    var serv = this.registroSeleccionado;

    if (admision != null) {
      this.bloquearPag = true;
      var serv = this.registroSeleccionado;
      this.dtofinal.Admision.TipoDocumento = this.filtro.TipoDocumento;
      this.dtofinal.Admision.Documento = this.filtro.Documento;
      this.dtofinal.Admision.NombreCompleto = this.filtro.NombreCompleto;
      this.dtofinal.Admision.fechanacimiento = new Date(this.filtro.FechaNacimiento);
      this.dtofinal.Admision.nombres = this.filtro.Nombres;
      this.dtofinal.Admision.apellidopaterno = this.filtro.ApellidoPaterno;
      this.dtofinal.Admision.apellidomaterno = this.filtro.ApellidoMaterno;
      this.dtofinal.Admision.sexo = this.filtro.Sexo;
      this.dtofinal.Admision.CorreoElectronico = "";
      this.dtofinal.Admision.IdAdmision = admision.IdAdmision; // normal registraria sin llamarlo cunado es 1
      this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
      this.dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;
      this.dtofinal.Admision.Persona = this.filtro.Persona; //viene de un metodo persona
      this.dtofinal.Admision.FechaAdmision = new Date(admision.FechaLimiteAtencion);
      this.dtofinal.Admision.HistoriaClinica = "";
      this.dtofinal.Admision.NroPeticion = this.filtro.NroPeticion;
      this.dtofinal.Admision.OrdenAtencion = "";
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
      // this.dtofinal.Admision.TipoPaciente=admision.TipoPaciente;
      this.dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
      // this.dtofinal.Admision.TipoOrdenAtencion=admision.TipoOrdenAtencion;
      this.dtofinal.Admision.TipoAtencion = this.filtro.TipoAtencion;
      this.dtofinal.Admision.DesEstado = admision.DesEstado;
      this.dtofinal.Admision.TIPOADMISIONID = 3; //admision.TIPOADMISIONID;
      this.dtofinal.Admision.FlatAprobacion = admision.FlatAprobacion;
      console.log("llegando toda cabecera", this.dtofinal.Admision)
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
        console.log("llegando toda la lista", this.dtofinal.list_AdmisionServicio)
      });

      this.dtofinal.IndicadorWS = 0;

      console.log("dto a guardar admision:", this.dtofinal);
      this.pacienteClinicaService.mantenimientoAdmisionClinica(2, this.dtofinal, this.getUsuarioToken()).then(
        res => {
          this.auditoria(res.Admision, 2);
          if (this.estaVacio(res.Mensaje)) {
            this.toastMensaje('Se actualizó el registro con éxito.', 'success', 2000)
          } else {
            if (res.valor == 1) {
              this.toastMensaje(`${res.Mensaje}`, 'success', 3000)
            } else {
              this.toastMensaje(`${res.Mensaje}`, 'warning', 3000)
            }
          }
          

          setTimeout(() => {
            this.bloquearPag = false;
          }, 500);

          if (res.list_AdmisionServicio[0].hasOwnProperty("CodigoComponente")) {

            this.lstListarXAdmision = [];
            this.lastYearTotal = 0;
            this.cantidad = 0;
            var totala = 0;
            var cantidadExamenes = 0;
            var contadorsito = 1;
            res.list_AdmisionServicio.forEach(element => {
              var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
              element.Valor = element.ValorEmpresa + ExamenConIgv;
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = element.Valor * element.Cantidad;
              totala += element.ValorEmpresa;

              element.numeroXadmision = contadorsito++;
              this.lstListarXAdmision.push(element);
            });
            this.lastYearTotal = totala;
            this.cantidad = cantidadExamenes;
            this.registroSeleccionado = null;
            this.verBtnAnular = true;
            this.colCard1 = "col-sm-2"
            this.colCard2 = "col-sm-6"
            this.editarCampos = true;
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

      _dtofinal.Admision.TipoDocumento = this.filtro.TipoDocumento;
      _dtofinal.Admision.Documento = this.filtro.Documento;
      _dtofinal.Admision.NombreCompleto = this.filtro.NombreCompleto;
      _dtofinal.Admision.fechanacimiento = new Date(this.filtro.FechaNacimiento);
      _dtofinal.Admision.nombres = this.filtro.Nombres;
      _dtofinal.Admision.apellidopaterno = this.filtro.ApellidoPaterno;
      _dtofinal.Admision.apellidomaterno = this.filtro.ApellidoMaterno;
      _dtofinal.Admision.sexo = this.filtro.Sexo;
      _dtofinal.Admision.CorreoElectronico = " ";
      _dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
      _dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;
      _dtofinal.Admision.Persona = this.filtro.Persona; //viene de un metodo persona
      _dtofinal.Admision.FechaAdmision = new Date();
      _dtofinal.Admision.HistoriaClinica = " ";
      _dtofinal.Admision.NroPeticion = null;
      _dtofinal.Admision.OrdenAtencion = " ";
      _dtofinal.Admision.MedicoId = this.filtro.MedicoId;
      _dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
      _dtofinal.Admision.Estado = 1;
      _dtofinal.Admision.FechaCreacion = new Date();
      _dtofinal.Admision.FechaModificacion = new Date();
      _dtofinal.Admision.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;//derrepente pasando nulo
      _dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
      _dtofinal.Admision.IpCreacion = this.getIp();
      _dtofinal.Admision.IpModificacion = this.getIp();
      _dtofinal.Admision.IdEmpresaPaciente = this.filtro2.Persona;
      _dtofinal.Admision.IdAseguradora = this.filtro.IdAseguradora;
      _dtofinal.Admision.TipoOrden = this.filtro.TipoOrden;
      _dtofinal.Admision.TipoAtencion = this.filtro.TipoAtencion;
      _dtofinal.Admision.ClasificadorMovimiento = this.filtro.ClasificadorMovimiento;
      _dtofinal.Admision.TipoPaciente = this.filtro.TipoOperacionID;
      _dtofinal.Admision.IdEspecialidad = this.filtro.IdEspecialidad;
      // this._dtofinal.Admision.TipoOrdenAtencion=admision.TipoOrdenAtencion;
      _dtofinal.Admision.TIPOADMISIONID = 3; //admision.TIPOADMISIONID;
      console.log("Seteando valores a _dtofinal - ELSE:: ", _dtofinal.Admision)

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
      console.log("_dtofinal -ELSE:: ", _dtofinal);
      this.pacienteClinicaService.mantenimientoAdmisionClinica(1, _dtofinal, this.getUsuarioToken()).then(
        res => {
          this.auditoria(res.Admision, 2);
          console.log("res  ELSE::: ", res)
          if (res.valor == 1) {
            this.toastMensaje(`${res.Mensaje}`, 'success', 3000)
          } else {
            this.toastMensaje(`${res.Mensaje}`, 'warning', 3000)
          }

          setTimeout(() => {
            this.bloquearPag = false;
          }, 500);

          if (res.list_AdmisionServicio[0].hasOwnProperty("CodigoComponente")) {
            this.loading = true;
            this.lstListarXAdmision = [];
            this.lastYearTotal = 0;
            this.cantidad = 0;
            var totala = 0;
            var cantidadExamenes = 0;
            var totalredon = 0;
            var contadorsito = 1;
            res.list_AdmisionServicio.forEach(element => {
              var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
              element.Valor = element.ValorEmpresa + ExamenConIgv;
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = element.Valor * element.Cantidad;
              totala += element.ValorEmpresa;
              totalredon += element.ValorIgv * element.Cantidad;
              element.numeroXadmision = contadorsito++;
              this.lstListarXAdmision.push(element);

            });
            this.lastYearTotal = totala;
            this.cantidad = cantidadExamenes;
            this.redondeoTotal = totalredon;
            this.registroSeleccionado = null;
            this.verBtnAnular = true;
            this.colCard1 = "col-sm-2"
            this.colCard2 = "col-sm-6"
            this.editarCampos = true;
            this.editarCampoSevicio = false;
            this.admision = res.Admision;
            this.filtro.NroPeticion = res.Admision.NroPeticion
            this.loading = false;
            this.mensajeController.resultado = res;


          } else {

            Swal.fire({
              icon: 'warning',
              title: '¡Mensaje!',
              text: `${res.Mensaje}`
            })
            // setTimeout(() => {
            //   this.bloquearPag = false;
            // }, 500);
          }
        }).catch(error => error)



    }

  }


  grillaCargarDatos(event: LazyLoadEvent) {
    var tempfiltro = convertDateStringsToDates(JSON.parse(this.route.snapshot.params['dto'] as string) as Admision);
    this.xadmision.IdAdmision = tempfiltro.IdAdmision;

    let idAdmision = { IdAdmision: this.xadmision.IdAdmision }

    return this.consultaAdmisionService.listarXadmision(idAdmision).then((res) => {
      this.loading = true;
      console.log("tipo atencion", res)
      this.filtro.TipoAtencion = res.Admision.TipoAtencion;
      this.filtro.ObservacionAlta = res.Admision.ObservacionAlta;
      this.filtro.CoaSeguro = res.Admision.CoaSeguro;
      this.filtro.CorreoElectronico = res.Admision.CorreoElectronico;
      this.filtro.Telefono = res.Admision.Telefono;
      console.log("grilla", res)
      this.disableBtnGuardar = false;
      if (res.Admision.IdEspecialidad != null) {
        this.filtro.IdEspecialidad = res.Admision.IdEspecialidad;
        // this.seleccionarItemMedicoTemp = tempfiltro.IdEspecialidad;
      } else {
        this.filtro.IdEspecialidad = 0;
        // this.seleccionarItemMedicoTemp = 0;
      }
      // this.bscPersona = res.Admision
      // console.log("valor pasando", this.bscPersona)
      var totalredon = 0;
      var cantidadExamenes = 0;
      this.contarExamenes = res.list_AdmisionServicio.length;
      res.list_AdmisionServicio.forEach(element => {
        element.numeroXadmision = this.contado++;
        var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
        element.Valor = element.ValorEmpresa + ExamenConIgv;
        cantidadExamenes += element.Cantidad;
        element.ValorEmpresa = element.Valor * element.Cantidad;
        this.total += element.Cantidad * element.ValorEmpresa;
        totalredon += element.ValorIgv * element.Cantidad; //ValorIgv viene el valor de los examenes ya con IGV
        this.lstListarXAdmision.push(element);
        if (res.Admision.IdEspecialidad != null) {
          this.filtro.IdEspecialidad = res.Admision.IdEspecialidad;
        } else {
          this.filtro.IdEspecialidad = 0;
        }
      });
      this.disableBtnGuardar = false;
      this.cantidad = cantidadExamenes;
      this.redondeoTotal = this.redondearNumero(totalredon, 0);
      this.difRedondeo = this.redondeoTotal - totalredon;
      this.lastYearTotal = this.total;
      this.loading = false;


    });

  }



  selectedItemTipoPaciente(event) {
    var tipooperacion = this.seleccionarItemPacienteTemp;



    // console.log("Combo tipo antes",this.seleccionarItemPacienteTemp)
    console.log("valor tipooperacion", tipooperacion)
    console.log("valor event", event)
    console.log("valor event.value", event.value)
    if (this.lstListarXAdmision.length > 0) {
      // const TipoOpe = this.filtro.TipoOperacionID;
      // console.log("tipo ope", TipoOpe)

      //this.selectedTipoPaciente = event.value
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
      this.dtofinal.Admision.CorreoElectronico = "";
      //admision.IdAdmision; normal registraria sin llamarlo cunado es 1
      this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
      this.dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;
      this.dtofinal.Admision.Persona = this.filtro.Persona; //viene de un metodo persona

      this.dtofinal.Admision.HistoriaClinica = "";
      this.dtofinal.Admision.NroPeticion = this.filtro.NroPeticion;
      this.dtofinal.Admision.OrdenAtencion = "";
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

      this.dtofinal.Admision.TIPOADMISIONID = 3; //admision.TIPOADMISIONID;
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
      setTimeout(() => {
        this.bloquearPag = false;
      }, 500);
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
            this.cantidad = 0;
            this.contado = 1;
            this.lstListarXAdmision = [];

            var totala = 0;
            var cantidadExamenes = 0;

            console.log("probando res de la lista", res.list_AdmisionServicio[0].TipoOperacionId)
            res.list_AdmisionServicio.forEach(element => {
              var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
              element.Valor = element.ValorEmpresa + ExamenConIgv;
              cantidadExamenes += element.Cantidad;
              element.ValorEmpresa = element.Valor * element.Cantidad;
              totala += element.ValorEmpresa;
              // var contadorsito = 1;
              element.numeroXadmision = this.contado++;
              this.lstListarXAdmision.push(element);
            });
            this.cantidad = cantidadExamenes;
            this.lastYearTotal = totala;
            this.loading = false;
            if (this.admision != null) {

              this.admision.TipoOperacionId = this.filtro.TipoOperacionID
              setTimeout(() => {
                this.bloquearPag = false;
              }, 500);
            } else {
              this.seleccionarItemPacienteTemp = this.filtro.TipoOperacionID
              setTimeout(() => {
                this.bloquearPag = false;
              }, 500);
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
                  setTimeout(() => {
                    this.bloquearPag = false;
                  }, 500);
                } else {
                  this.filtro.TipoOperacionID = this.seleccionarItemPacienteTemp;

                  console.log("tipo operacon del despues", this.filtro.TipoOperacionID)
                  setTimeout(() => {
                    this.bloquearPag = false;
                  }, 500);
                }

              }

            })
          }

        }).catch(error => error)

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

  comboCargarTipoOrden() {
    this.lstTipoOrden = [];
    this.lstTipoOrden.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOORDEN").forEach(i => {
      this.lstTipoOrden.push({ label: i.Nombre, value: i.Codigo })

    });
    this.filtro.TipoOrden = "R";

  }

  comboCargarProcendia(): Promise<number> {
    this.lstprocedencia = [];
    this.lstprocedencia.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    var dtoadmin = new dtoMedico();

    return this.medicoService.especialidadpaginado(dtoadmin).then(resp => {
      resp.forEach(e => {

        this.lstprocedencia.push({ label: e.Nombre, value: e.IdEspecialidad });
        this.filtro.IdEspecialidad = 0
      });

      return 1;

    });

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

  comboCargarTipoAtencion() {
    this.lstTipoAtencion = [];
    this.lstTipoAtencion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOATENCION").forEach(i => {

      this.lstTipoAtencion.push({ label: i.Nombre, value: i.IdCodigo })


    });
    this.filtro.TipoAtencion = 1;
  }

  comboCargarTipoOperacion(): Promise<number> {
    this.lstTipoOperacion = [];

    this.operacion.TipEstado = 1;
    this.operacion.TIPOADMISIONID = 3;

    this.lstTipoOperacion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    return this.consultaAdmisionService.listarcombotipooperacion(this.operacion).then(resp => {
      console.log("VERRRRRR", resp)
      resp.forEach(e => {

        this.lstTipoOperacion.push({ label: e.Descripcion, value: e.TipoOperacionID });
        this.filtro.TipoOperacionID = resp[0].TipoOperacionID;
      });

      console.log("this.lstTipoOperacion PC::", this.lstTipoOperacion)
      return 1;

    });

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
      console.log("combo servicio resp", resp);
      console.log("combo servicio", service[0]);
      return 1;


    });

  }

  comboCargarSexo() {
		this.lstSexo = [];
		this.lstSexo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
		this.getMiscelaneos().filter(x => x.CodigoTabla == "SEXO").forEach(i => {
		  this.lstSexo.push({ label: i.Nombre, value: i.Codigo })

		});
	  }

  limpiarEmpresa() {

    this.filtro2.Persona = null;
    this.filtro2.DocumentoFiscal = null;
    this.filtro2.NombreCompleto = null;
    this.editarCampoEmpresa = false;

  }

  limpiarAseguradora() {

    this.filtro.IdAseguradora = null;
    this.filtro.NombreEmpresa = null;
    this.editarCampoAseguradora = false;
  }

  limpiarMedico() {

    this.filtro.CMP = null;
    this.filtro.Busqueda = null;
    this.filtro.MedicoId = null;
    this.editarCampoMedico = false;
  }

  limpiarPersona() {

    this.filtro.Documento = new FiltroPacienteClinica().Documento;
    this.filtro.NombreCompleto = new FiltroPacienteClinica().NombreCompleto;
    this.filtro.FechaNacimiento = new FiltroPacienteClinica().FechaNacimiento;
    this.filtro.Sexo = new FiltroPacienteClinica().Sexo;
    this.filtro.Edad = new FiltroPacienteClinica().Edad;
    this.filtro.Comentario = new FiltroPacienteClinica().Comentario;
    this.filtro.Persona = new FiltroPacienteClinica().Persona;
    this.editarCampoDocumento = false;
    this.editarCampos = true;
    this.editarCampoAseguradora = true;
    this.editarCampoMedico = true;
    this.editarCampoEmpresa = true;

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

  getPersonaServicio(documento: string, validator: number) {
    console.log("mensaje documento", documento)
    let Documento = {
      Documento: documento.trim(),
      tipopersona: "P",
      SoloBeneficiarios: "0",
      UneuNegocioId: "0"
    }
    //return this.personaService.listarpaginado(Documento).then((res) => {
      return this.personaService.listaPersonaUsuario(Documento).then((res) => {
      console.log("mensaje del res", res)

      // if (res.hasOwnProperty("Documento")) {
      // if (res.length == 1) {
      if (validator == 1) {
        this.bscPersona = null
        this.bscPersona = res[0];
        this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONAEDITAR', ''), "EDITAR", 1, this.bscPersona);
        setTimeout(() => {
          this.bloquearPag = false
        }, 500);
      } else {
        if (this.esListaVacia(res)) {
          setTimeout(() => {
            this.bloquearPag = false;
          }, 100);
          this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
          this.filtro.Documento = null;
        }
        else if (res[0].hasOwnProperty("Documento")) {

          if (documento.trim() == res[0].Documento.trim()) {
            if (this.estaVacio(res[0].NombreCompleto)) {
              this.filtro.NombreCompleto = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`

            } else {
              this.filtro.NombreCompleto = res[0].NombreCompleto;
            }
            this.filtro.Documento = res[0].Documento;
            this.filtro.CorreoElectronico = res[0].CorreoElectronico;
            this.filtro.Comentario = res[0].Comentario;
            this.filtro.Sexo = res[0].Sexo;
            if (!this.estaVacio(res[0].CodigoHC)) {
              this.filtro.CodigoHC = res[0].CodigoHC;
            }
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
            console.log("el Telefono es: ", this.filtro.Telefono)
            this.bscPersona = null
            this.bscPersona = res[0];

            setTimeout(() => {
              this.bloquearPag = false;
            }, 100);
          } else {
            setTimeout(() => {
              this.bloquearPag = false;
            }, 100);
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
            this.filtro.Documento = null;
          }
        } else {
          setTimeout(() => {
            this.bloquearPag = false;
          }, 100);
          this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
          this.filtro.Documento = null;

        }

      }

    }).catch(error => error);

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
      // var ExamenConIgv = e.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
      // var valorExamen = e.ValorEmpresa + ExamenConIgv;
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
        cantidadExamenes += e.Cantidad;
        e.ValorEmpresa = e.Cantidad * e.Valor;
        total += e.ValorEmpresa
      });
      this.cantidad = cantidadExamenes;
      this.lastYearTotal = total
    }
  }

  validarTeclaEnterPaciente(evento) {

    if (evento.key == "Enter") {
      if (this.filtro.Documento == null) {
        this.toastMensaje('Ingrese un Nro. de documento', 'warning', 3000)
      }
      else if (this.filtro.Documento.length <= 4) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        this.filtro.Documento = null;
      } else {
        this.bloquearPag = true;
        // this.filtro.Persona = this.dto.Persona;
        // var response = this.getPersonaServicio(this.filtro.Documento.trim());
        this.getPersonaServicio(this.filtro.Documento.trim(), 2).then((x) => {
          console.log("data del x", x);
          if (!this.esListaVacia(this.bscPersona)) {
            this.editarCampos = false;
            this.editarCampoSevicio = false;
            this.editarCamposAutomaticos = true;
            this.editarCampoNroCama = true;
            this.editarCampoDocumento = true;
            this.editarCampoMedico = false;
            this.editarCampoAseguradora = false;
            this.editarCampoEmpresa = false;
            this.disableBtnGuardar = false;

          }
        });

        // if (response != null) {


      }
    }
  }

  validarEnterEmpresa(evento) {
    var filtro = new FiltroPacienteClinica();

    if (evento.key == "Enter") {
      this.bloquearPag = true;
      if (this.filtro2.DocumentoFiscal == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        setTimeout(() => {
          this.bloquearPag = false;
        }, 500);
      } else if (this.filtro2.DocumentoFiscal.length == 11 || this.filtro2.DocumentoFiscal == "0") {

        if (this.filtro2.DocumentoFiscal == "0") {
          filtro.NombreCompleto = "NO DEFINIDO"
          filtro.Documento = this.filtro2.DocumentoFiscal.trim();
          filtro.TipoDocumento = "R";
        } else {
          filtro.Documento = this.filtro2.DocumentoFiscal.trim();
          filtro.TipoDocumento = "R";
        }

        this.personaService.listarpaginado(filtro).then((res) => {

          console.log("enter empresa", res)
          if (res.length > 0) {

            this.filtro2.NombreCompleto = res[0].NombreCompleto;
            this.filtro2.Persona = res[0].Persona;
            this.editarCampoEmpresa = true;
            setTimeout(() => {
              this.bloquearPag = false;
            }, 500);
          } else {
            setTimeout(() => {
              this.bloquearPag = false;
              this.filtro2.DocumentoFiscal = null;
            }, 100);

            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
          }
        });
      }
      else {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
        setTimeout(() => {
          this.bloquearPag = false;
          this.filtro2.DocumentoFiscal == null;
        }, 500);

      }
    }
  }

  validarEnterAseguradora(evento) {
    var filtro = new FiltroPacienteClinica();

    if (evento.key == "Enter") {
      if (this.filtro.IdAseguradora == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      } else if (String(this.filtro.IdAseguradora).length <= 7) {
        this.bloquearPag = true;
        filtro.IdAseguradora = this.filtro.IdAseguradora;
        this.aseguradoraService.listarpaginado(filtro).then((res) => {
          // this.filtro.NombreCompleto = `${res[0].ApellidoPaterno} ${res[0].ApellidoMaterno}, ${res[0].Nombres}`
          if (res.length == 1) {
            console.log("enter aseguradora", res)
            this.filtro.NombreEmpresa = res[0].NombreEmpresa;
            this.filtro.TipoOrdenAtencion = res[0].TipoAseguradora;
            this.editarCampoAseguradora = true;
            setTimeout(() => {
              this.bloquearPag = false;
            }, 500);
          } else {
            setTimeout(() => {
              this.bloquearPag = false;
            }, 100);
            this.filtro.IdAseguradora = null
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
          }
        });
      } else {
        this.filtro.IdAseguradora = null
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
      }
    }
  }

  validarEnterMedico(evento) {
    var filtro = new FiltroPacienteClinica();
    if (evento.key == "Enter") {
      if (this.filtro.CMP == null) {
        this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)

      } else {

        this.bloquearPag = true;
        if (this.filtro.CMP.trim() == "0") {
          filtro.MedicoId = 0;
        } else {
          filtro.MedicoId = -1;
          filtro.Estado = 1;
          filtro.CMP = this.filtro.CMP.trim();
        }
        this.medicoService.listarpaginado(filtro).then((res) => {
          // if(filtro.CMP = "0"){
          //   this.filtro.Busqueda = res[0].Busqueda;
          //   this.filtro.MedicoId = res[0].MedicoId;
          //   setTimeout(() => {
          //     this.bloquearPag = false;
          //   }, 500);
          // }
          if (res.length >= 1) {

            this.bloquearPag = true;
            console.log("enter medico", res)
            this.filtro.Busqueda = res[0].Busqueda;
            // if (this.esNumeroVacio(res[0].IdEspecialidad)) {
            //   this.filtro.IdEspecialidad = 0;
            //   this.seleccionarItemMedicoTemp = 0;
            // } else {
            //   this.filtro.IdEspecialidad = res[0].IdEspecialidad;
            //   this.seleccionarItemMedicoTemp = res[0].IdEspecialidad;
            // }
            this.filtro.MedicoId = res[0].MedicoId;

            this.editarCampoMedico = true;
            setTimeout(() => {
              this.bloquearPag = false;
            }, 500);
          } else {
            this.filtro.CMP = null;
            this.filtro.Busqueda = null;
            setTimeout(() => {
              this.bloquearPag = false;
            }, 100);
            this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000)
          }


        });
      }


    }
  }



  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECPACIENTE") {
      console.log("seleccionar paciente", mensage.resultado)
      this.bscPersona = mensage.resultado;
      this.filtro.Documento = mensage.resultado.Documento;


      if (this.estaVacio(mensage.resultado.NombreCompleto)) {
        this.filtro.NombreCompleto = `${mensage.resultado.Nombres}, ${mensage.resultado.ApellidoPaterno} ${mensage.resultado.ApellidoMaterno}`
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
      // this.filtro.Edad = mensage.resultado.Edad;

      this.filtro.FechaNacimiento = new Date(mensage.resultado.FechaNacimiento);
      this.CalcularAnios();
      this.editarCampos = false;
      this.editarCampoSevicio = false;
      this.editarCamposAutomaticos = true;
      this.editarCampoNroCama = true;
      this.editarCampoDocumento = true;
      this.editarCampoEmpresa = false;
      this.editarCampoAseguradora = false;
      this.editarCampoMedico = false;
      this.disableBtnGuardar = false;
    }
    else if (mensage.componente == "SELECEMPRESA") {
      if (mensage.resultado.DocumentoFiscal != null) {
        this.filtro2.DocumentoFiscal = mensage.resultado.DocumentoFiscal;
      } else {
        this.filtro2.DocumentoFiscal = mensage.resultado.Documento;
      }
      this.filtro2.NombreCompleto = mensage.resultado.NombreCompleto;
      this.filtro2.Persona = mensage.resultado.Persona;
      this.lstSedeEmpresa = []
      this.comboCargarSedeEmpresa(mensage.resultado.Persona)
      this.editarCampoEmpresa = true;
      console.log("selec empresa", mensage.resultado)

      // console.log("datoscombo",mensage.resultado.Persona)
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
      // console.log("selec medico", mensage.resultado)
      this.editarCampoMedico = true;
    } else if (mensage.componente == 'TIPMAPERSONANUEVO') {
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
      // console.log("DATA VIAJANDO VIAJANDO ", mensage.resultado)
      // this.bloquearPag = true;
      // this.getPersonaServicio(mensage.resultado.trim(), 2)
      this.MostrarEmpresa(mensage.resultado, 1)
      console.log("DATA VIAJANDO VIAJANDO ", mensage.resultado.data)
    } else if (mensage.componente == 'TIPREGMEDICO') {
      console.log("data llegando medico", mensage.componente)
      console.log("data llegando medico", mensage.resultado)
      if (mensage.resultado != null) {
        this.bloquearPag = true;
        this.filtro.CMP = mensage.resultado.data.CMP;
        this.filtro.Busqueda = mensage.resultado.data.Busqueda;
        this.filtro.MedicoId = mensage.resultado.data.MedicoId;

        this.editarCampoMedico = true;
        setTimeout(() => {
          this.bloquearPag = false;
        }, 500);
      }
    } else if (mensage.componente == 'TIPREGASEGURADORA') {
      if (mensage.resultado != null) {
        this.bloquearPag = true;
        this.filtro.IdAseguradora = mensage.resultado.data.IdAseguradora;
        this.filtro.NombreEmpresa = mensage.resultado.data.NombreEmpresa;
        this.editarCampoAseguradora = true;
        setTimeout(() => {
          this.bloquearPag = false;
        }, 500);
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
        setTimeout(() => {
          this.bloquearPag = false;
        }, 500);
      }
    } else if (mensage.componente == "BUSCEXAM") {
      if (this.filtro.NombreCompleto != null) {
        this.contarExamenes = this.lstListarXAdmision.length;
        this.contarExamenes += mensage.resultado.length;
        console.log("ACAA:", mensage.resultado)
        var validado = 0;
        var totala = 0;
        var cantidadExamenes = 0;
        this.lstListarXAdmision.forEach(x => {
          cantidadExamenes += x.Cantidad;
          x.ValorEmpresa = x.Valor * x.Cantidad;
          totala += x.ValorEmpresa;
        });

        mensage.resultado.forEach(element => {
          var ExamenConIgv = element.ValorEmpresa * this.getUsuarioAuth().data[0].Igv;
          element.Valor = element.ValorEmpresa + ExamenConIgv;
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
            this.cantidad = cantidadExamenes;
            var contadorsito = this.lstListarXAdmision.length;
            element.numeroXadmision = contadorsito + 1;
            this.lstListarXAdmision.push(element);
            // this.cantidad = cantidadExamenes;
            this.loading = false;
            this.seleccionarItemPacienteTemp = this.filtro.TipoOperacionID;
            this.seleccionarItemServicioTemp = this.filtro.ClasificadorMovimiento;
            // this.admision.TipoOperacionId = this.filtro.TipoOperacionID;
          }
        });

        console.log("valor del total al buscar examen", this.lastYearTotal)

      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: 'Seleccione un paciente.'
        })
      }

    }




  }

  verSelectorExamen(): void {
    // this.examenBuscarComponent.iniciarComponente("BUSCAR EXAMENES", this.objetoTitulo.menuSeguridad.titulo)
    this.examenBuscarComponent.coreIniciarComponenteBuscar(new MensajeController(this, 'BUSCEXAM', ''), 'BUSCAR', 3, this.filtro);
    // this.aseguradoraMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAASEGURADORA', ''),"VER",rowdata);

  }

  verSelectorEmpresa(): void {
    // this.personaBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
    this.empresaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECEMPRESA', 'BUSCAR'), 'BUSCAR');
  }

  verSelectorAseguradora(): void {
    // this.personaBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
    this.aseguradoraBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECASEGURADORA', 'BUSCAR'), 'BUSCAR');
  }

  verSelectorPaciente(): void {
    // this.personaBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), 'BUSCAR',"N");
  }
  verSelectorMedico(): void {
    // this.personaBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
    this.medicoBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECMEDICO', 'BUSCAR'), 'BUSCAR');
  }

  crearEmpresa() {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGEMPRESA', ''), 'NUEVO', 2);
  }

  crearAseguradora() {
    this.aseguradoraMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGASEGURADORA', ''), "NUEVO");
  }

  crearMedico() {
    this.medicoMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGMEDICO', ''), 'NUEVO');
  }

  MultiPersona() {
   
    if (this.filtro.NombreCompleto == null && this.filtro.Documento == null) {
      this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONANUEVO', ''), "NUEVO", 1);
    } else {

      if (this.bscPersona != null) {
        this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONAEDITAR', ''), "EDITAR", 1, this.bscPersona);
  
      } else if (this.admision != null) {

        this.getPersonaServicio(this.filtro.Documento.trim(), 1)

      } else {
        this.getPersonaServicio(this.filtro.Documento.trim(), 1)
      }

    }
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

  constAt(dto: Admision) {
    this.bloquearPag = true;
    var payload = {
      IdReporte: 2,
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
    } else {
      if (this.esNumero(filtro.UsuarioCreacion.trim())) {
        var dtopersona
        // dtopersona = filtro.IngresoUsuario;
        let dto = {
          Documento: filtro.UsuarioCreacion.trim(),
          tipopersona: "P",
          SoloBeneficiarios: "0",
          UneuNegocioId: "0"
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
      } else {
        this.usuario = this.Auth[0].NombreCompleto;
        this.fechaCreacion = new Date();
        this.fechaModificacion = new Date();
      }
    }
  }

}
