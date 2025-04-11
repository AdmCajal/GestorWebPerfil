import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, LazyLoadEvent, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { ComponenteBasePrincipal } from '../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../@theme/ConstanteAngular';
import { UsuarioAuth } from '../../auth/model/usuario';
import { LoginService } from '../../auth/service/login.service';
import { FiltroServicio } from '../../framework-comun/Examen/dominio/filtro/FiltroExamen';
import { ExamenService } from '../../framework-comun/Examen/servicio/Examen.service';
import { PersonaBuscarComponent } from '../../framework-comun/Persona/components/persona-buscar.component';
import { PersonaService } from '../../framework-comun/Persona/servicio/persona.service';
import { ReporteVistaComponent } from '../../framework-comun/Reportes/view/reporte-vista.component';
import { convertDateStringsToDates } from '../../framework/funciones/dateutils';
import { Maestro } from '../../maestros/FormMaestro/model/maestro';
import { DtoAdmisionclinicaDetalle } from '../paciente-clinica/dominio/dto/DtoAdmisionclinicaDetalle';
import { DtoAdmisionprueba, DtoPacienteClinica } from '../paciente-clinica/dominio/dto/DtoPacienteClinica';
import { PacienteClinicaService } from '../paciente-clinica/service/paciente-clinica.service';
import { PacienteClinicaComponent } from '../paciente-clinica/view/paciente-clinica.component';
import { ConsultaDetalleComponent } from './components/consulta-detalle.component';
import { Admision } from './dominio/dto/DtoConsultaAdmision';
import { FiltroConsultaAdmision, FiltroTipoOAdmision } from './dominio/filtro/FiltroConsultaAdmision';
import { ConsultaAdmisionService } from './servicio/consulta-admision.service';

@Component({
  selector: 'ngx-consulta-admision',
  templateUrl: './consulta-admision.component.html',
  styleUrls: ['./consulta-admision.component.scss']
})
export class ConsultaAdmisionComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy, UIMantenimientoController {
  @ViewChild(ReporteVistaComponent, { static: false }) reporteVistaComponent: ReporteVistaComponent;
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(PacienteClinicaComponent, { static: false }) pacienteClinicaComponent: PacienteClinicaComponent;
  @ViewChild(ConsultaDetalleComponent, { static: false }) consultaDetalleComponent: ConsultaDetalleComponent;
  @ViewChild('pdfViewerActividades', { static: false }) pdfViewerActividades;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;

  segundos: number = 30;
  IdTimer: any;

  esPropios: boolean = false;

  Auth: UsuarioAuth = new UsuarioAuth();
  tipoadmision: FiltroTipoOAdmision = new FiltroTipoOAdmision();
  servicio: FiltroServicio = new FiltroServicio();
  filtro: FiltroConsultaAdmision = new FiltroConsultaAdmision();
  filtro2: FiltroConsultaAdmision = new FiltroConsultaAdmision();

  lstsedes: SelectItem[] = []
  lstEstado: SelectItem[] = [];
  lsttipoadmision: SelectItem[] = [];
  lstservicio: SelectItem[] = [];
  lstcliente: SelectItem[] = [];
  lstConsultaAdmision: SelectItem[] = [];
  bscPersona: any[] = [];

  editarCampoDocumento: boolean = false;
  loading: boolean;
  bloquearPag: boolean;
  verReporteModal: boolean = false;
  dto: Maestro[] = []
  dte: Admision = new Admision();
  lstListarXAdmision: DtoPacienteClinica[] = [];
  registroSeleccionado: any;
  dtofinal: DtoAdmisionprueba = new DtoAdmisionprueba();
  constructor(
    private router: Router,
    private loginService: LoginService,
    private personaService: PersonaService,
    private consultaAdmisionService: ConsultaAdmisionService,
    private examenService: ExamenService,
    protected messageService: MessageService,
    private confirmationService: ConfirmationService,
    private pacienteClinicaService: PacienteClinicaService,
    private toastrService: NbToastrService) {
    super();
  }

  ngOnDestroy(): void {
    // this.userInactive.unsubscribe();
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    const p1 = this.comboCargarServicios();
    const p2 = this.cargarEstados();
    const p3 = this.comboCargarSedes();
    const p4 = this.comboCargarTipoAdmision();


    Promise.all([p1, p2, p3, p4]).then(
      f => {

        this.fechaActual();
        setTimeout(() => {
          this.bloquearPag = false;
        }, 100);
      });

    // this.validateFilterDate(this.filtro);

  }

  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }

  coreBuscar(): void {
   // this.bloquearPag = true;
    if (this.filtro.NroPeticion == "") {
      this.filtro.NroPeticion = null;
    }
    // if (this.filtro.HistoriaClinica == "") {
    //   this.filtro.HistoriaClinica = null;
    // }
    if (this.filtro.OrdenAtencion == "") {
      this.filtro.OrdenAtencion = null;
    }
    this.dataTableComponent.first = 0;
    console.log("data filtro", this.filtro)
    this.grillaCargarDatos({ first: this.dataTableComponent.first });
  //  this.bloquearPag = false;
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

  verSelectorPaciente(): void {
    // this.personaBuscarComponent.iniciarComponente("BUSCADOR PACIENTES", this.objetoTitulo.menuSeguridad.titulo)
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), "BUSCAR","N");

  }

  verConsultaDetalle(): void {
    if (this.registroSeleccionado == null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: `Debe seleccionar un registro.`
      })
    } else {
      this.consultaDetalleComponent.coreIniciarComponenteDetalle(new MensajeController(this, 'CONDETA', ''), 'DETALLE', this.registroSeleccionado);
    }
  }

  coreSeleccionar(dta: any) {
    // if (dto === null) {
    //   this.mostrarMensajeInfo('Debe seleccionar un registro');
    //   return;
    // }

    this.mensajeController.resultado = dta;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    this.coreSalir();
  }

  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECPACIENTE") {


      console.log("data del seleccionar", mensage);
      this.filtro.Documento = mensage.resultado.Documento;
      this.filtro.NombreCompleto = mensage.resultado.NombreCompleto;
      this.filtro.Persona = mensage.resultado.Persona;
      this.editarCampoDocumento = true;
    } else if (mensage.componente == "SELECTREPORTE") {

    }
  }

  cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTADMISION").forEach(i => {
      this.lstEstado.push({ label: i.Nombre, value: i.IdCodigo })
    });
    //this.filtro.Estado = 0;
  }

  grillaCargarDatos(event: LazyLoadEvent) {
    this.bloquearPag = true;
    this.consultaAdmisionService.listarpaginado(this.filtro).then((res) => {
    var contado = 1;
      res.forEach(element => {
        element.numeroAdmision = contado++;
      });
      console.log("consulta Admision grillaCargarDatos:", res);
      this.lstConsultaAdmision = res;
      setTimeout(() => {
        this.bloquearPag = false;
      }, 500);
    });

  }

  fechaActual() {
    var hoy = new Date();
    var dia = hoy.getDate();
    var mes = hoy.getMonth() + 1;
    var anio = hoy.getFullYear();
    this.filtro.FechaCreacion = new Date(`${anio},${mes},${dia}`);
    this.filtro.FechaAdmision = new Date(`${anio},${mes},${dia}`);
    console.log("Consulta Admision fecha creacion", this.filtro.FechaCreacion)
  }

 
  comboCargarSedes(): Promise<number> {
    this.Auth = this.getUsuarioAuth();
    var prueba = this.Auth.data;

    let lstsedes = { IdEmpresa: 75300, SedEstado: 1 }
    this.lstsedes.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    var listaCombosedes = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('access_sedes')));
    if(lstsedes!=null)
    {
      listaCombosedes.forEach(e => {
        this.lstsedes.push({ label: e.SedDescripcion, value: e.IdSede  });
        this.filtro.IdSede = prueba[0].IdSede
      });
    }
    else
    {
      return this.loginService.listarSedes(lstsedes).then(
        sedes => {
          if (sedes.length > 0) {
            sedes.forEach(obj => this.lstsedes.push({ label: obj.SedDescripcion, value: obj.IdSede }));
            this.filtro.IdSede = prueba[0].IdSede
            console.log("Consulta Admision comboCargarSedes", sedes)
          }
          return 1
        }
      )
    }
  }

  comboCargarServicios(): Promise<number> {
    this.Auth = this.getUsuarioAuth();
    var prueba = this.Auth.data;
    this.servicio.Estado = 1;
    this.lstservicio.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.examenService.serviciopaginado(this.servicio).then(resp => {
      resp.forEach(e => {
        this.lstservicio.push({ label: e.Nombre, value: e.ClasificadorMovimiento });       
      });
      console.log("Consulta Admision comboCargarServicios", resp)
       this.filtro.ClasificadorMovimiento = prueba[0].ClasificadorMovimiento
      return 1;
    });
  }

  Correo(dto: Admision) {
    dto = this.registroSeleccionado;
    if (this.esListaVacia(dto)) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: 'Debe seleccionar un registro'
      })
      return
    } else {

      this.bloquearPag = true;
      let IdPersona = {
        IdPersona: dto.Persona,
        ClasificadorMovimiento: dto.ClasificadorMovimiento
      }
      var _parametros = null;
      this.Auth = this.getUsuarioAuth();
      var usuario = this.Auth.data;

      this.personaService.listarUsuarioWeb(IdPersona).then(resp => {
        console.log("resp", resp)
        if (resp[0].estadoActualizacion == 1) {
          _parametros = {
            success: 1,
            valor: 1,
            UneuNegocioId: usuario[0].UneuNegocioId,
            str_pTo: dto.CorreoElectronico,
            str_pCC: "darkon27@gmail.com",
            NombreCompleto: resp[0].NombreCompleto,
            PerNumeroDocumento: resp[0].UserNameWeb,
            Password: resp[0].PasswordWeb
          }
          var validar = 1;

          if (this.estaVacio(_parametros.str_pTo)) {
            setTimeout(() => {
              this.bloquearPag = false;
            }, 300);
            this.toastMensaje('Mensaje no enviado. El paciente no cuenta con un correo registrado.', 'warning', 3000);
            validar = 2;
          } else {
            if (!this.esEmailValido(_parametros.str_pTo)) {
              setTimeout(() => {
                this.bloquearPag = false;
              }, 300);
              this.toastMensaje('Mensaje no enviado. El paciente no cuenta con un correo valido.', 'warning', 3000);
              validar = 2;
            }
          }
          if (validar == 1) {
            return this.consultaAdmisionService.sendCorreo(_parametros).then(resp => {
              console.log("correo", resp)
              setTimeout(() => {
                this.bloquearPag = false;
              }, 300);
              this.toastMensaje('Correo enviado', 'success', 3000);
            }).catch(error => error);

          }
        } else {
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: 'Usuario ya personalizó su contraseña, procesa a generarla una nueva'
          })
          setTimeout(() => {
            this.bloquearPag = false;
          }, 300);
        }

      });
    }

  }

  traerXadmision() {
    this.Auth = this.getUsuarioAuth();
    var prueba = this.Auth.data;
    dto = this.registroSeleccionado;
    if (dto == null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: 'Debe seleccionar un registro'
      })

    } else {

      if (dto.IdSede == prueba[0].IdSede) {
        var dto = this.registroSeleccionado;

        if (dto.Estado == 1) {
          // if (dto.Estado == 1 || dto.Estado == 2) {
          let idAdmision = { IdAdmision: dto.IdAdmision }

          return this.consultaAdmisionService.listarXadmision(idAdmision).then((res) => {

            this.filtro2 = res.Admision;
            console.log("data del filtro", this.filtro2);
            // this.bscPersona = res.Admision
            // console.log("valor pasando", this.bscPersona)
            res.list_AdmisionServicio.forEach(element => {
              this.lstListarXAdmision.push(element);
            });
            console.log("data de la lista ", this.lstListarXAdmision);
            this.AnularAdmision(this.filtro2, this.lstListarXAdmision);
          });

        } else {
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: `Solo se puede anular los pendientes.`
          })
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: `USUARIO NO AUTORIZADO EN LA SEDE.`
        })
      }
    }

  }

  AnularAdmision(admision: FiltroConsultaAdmision, lista: DtoPacienteClinica[]) {
    console.log("data del anular detalle", admision)
    console.log("data del anular lista", lista)

    Swal.fire({
      title: 'Importante',
      text: "¿Seguro que desea anular el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#094d74',
      cancelButtonColor: '#ffc72f',
      cancelButtonText: '¡No, Cancelar!',
      confirmButtonText: '¡Si, Anular!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire(
        //   'Mensaje!',
        //   'El Pedido debe estar Registrado para Anularse',
        //   'warning'
        // )
        this.bloquearPag = true;
        var serv = lista;
        console.log("Registro seleccionado anular", serv)
        console.log("Cabecera del anular admision", admision)
        this.dtofinal.Admision.TipoDocumento = admision.TipoDocumento;
        this.dtofinal.Admision.Documento = admision.Documento;
        this.dtofinal.Admision.NombreCompleto = admision.NombreCompleto;
        this.dtofinal.Admision.fechanacimiento = new Date(admision.fechanacimiento);
        this.dtofinal.Admision.nombres = admision.nombres;
        this.dtofinal.Admision.apellidopaterno = admision.apellidopaterno;
        this.dtofinal.Admision.apellidomaterno = admision.apellidomaterno;
        this.dtofinal.Admision.sexo = admision.sexo;
        this.dtofinal.Admision.CorreoElectronico = admision.CorreoElectronico;
        this.dtofinal.Admision.IdAdmision = admision.IdAdmision; //admision.IdAdmision; normal registraria sin llamarlo cunado es 1
        this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
        this.dtofinal.Admision.TipoOperacionID = admision.TipoOperacionId;
        this.dtofinal.Admision.Persona = admision.Persona; //viene de un metodo persona
        this.dtofinal.Admision.FechaAdmision = new Date(admision.FechaAdmision);
        this.dtofinal.Admision.HistoriaClinica = admision.HistoriaClinica;
        this.dtofinal.Admision.NroPeticion = admision.NroPeticion;
        this.dtofinal.Admision.OrdenAtencion = admision.OrdenAtencion;
        this.dtofinal.Admision.MedicoId = admision.MedicoId;
        this.dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
        this.dtofinal.Admision.Estado = admision.Estado;
        this.dtofinal.Admision.FechaCreacion = new Date(admision.FechaCreacion);
        this.dtofinal.Admision.FechaModificacion = new Date();
        this.dtofinal.Admision.UsuarioCreacion = admision.UsuarioCreacion; //derrepente pasando nulo
        this.dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
        this.dtofinal.Admision.IpCreacion = admision.IpCreacion;   //crear metodo que nos muestre la IP del usuario
        this.dtofinal.Admision.IpModificacion = this.getIp();  //crear metodo que nos muestre la IP del usuario       
        this.dtofinal.Admision.IdEmpresaPaciente = admision.IdEmpresaPaciente;
        this.dtofinal.Admision.IdAseguradora = admision.IdAseguradora;
        this.dtofinal.Admision.TipoOrden = admision.TipoOrden;
        this.dtofinal.Admision.ClasificadorMovimiento = admision.ClasificadorMovimiento;
        // this.dtofinal.Admision.TipoPaciente=admision.TipoPaciente;
        this.dtofinal.Admision.IdEspecialidad = admision.IdEspecialidad;
        // this.dtofinal.Admision.TipoOrdenAtencion=admision.TipoOrdenAtencion;
        this.dtofinal.Admision.TipoAtencion = admision.TipoAtencion;
        this.dtofinal.Admision.DesEstado = admision.DesEstado;
        this.dtofinal.Admision.TIPOADMISIONID = admision.TIPOADMISIONID;; //admision.TIPOADMISIONID;
        this.dtofinal.Admision.FlatAprobacion = admision.FlatAprobacion;
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
          console.log("llegando toda la lista", this.dtofinal.list_AdmisionServicio)
        });

        this.dtofinal.IndicadorWS = 0;
        console.log("dto a anular admision:", this.dtofinal);
        this.pacienteClinicaService.mantenimientoAdmisionClinica(3, this.dtofinal, this.getUsuarioToken()).then(
          res => {
            this.toastMensaje('Se Anuló el registro con éxito.', 'success', 2000)
            console.log("entro el servicio", res)

            // Swal.fire({
            //   position: 'top-end',
            //   icon: 'success',
            //   title: 'Registro anulado.',
            //   showConfirmButton: false,
            //   timer: 1500
            // })
            setTimeout(() => {
              this.bloquearPag = false;
            }, 500);

            this.coreBuscar();

          }).catch(error => error)

      }
    })

  }

  comboCargarTipoAdmision(): Promise<number> {
    this.lsttipoadmision.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.consultaAdmisionService.listarcombotipoadmision(this.tipoadmision).then(resp => {
      console.log("combo tipo admision:", resp);
      resp.forEach(e => {
        this.lsttipoadmision.push({ label: e.AdmDescripcion, value: e.TipoAdmisionId });
      });
      return 1;
    });

  }


  anular() {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'EN DESARROLLO',
      showConfirmButton: false,
      timer: 1500
    })
  }

  constAT() {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'EN DESARROLLO',
      showConfirmButton: false,
      timer: 1500
    })
  }

  imprimirCodigo() {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'EN DESARROLLO',
      showConfirmButton: false,
      timer: 1500
    })


  }

  constAt(dto: Admision) {
    if (this.esListaVacia(this.registroSeleccionado)) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: 'Debe de generar primero el número de petición.'
      })
    } else {
      if (this.registroSeleccionado.Estado != 3) {
        this.bloquearPag = true;
        var payload = {
          IdReporte: 2,
          IdAdmision: this.registroSeleccionado.IdAdmision,
          NroPeticion: this.registroSeleccionado.NroPeticion
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
      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: 'Ya se encuentra anulado.'
        })
      }
    }
  }

  imprimir(dto: Admision) {
    if (this.esListaVacia(this.registroSeleccionado)) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: 'Debe de generar primero el número de petición.'
      })
    } else {

      if (this.registroSeleccionado.Estado != 3) {

        this.bloquearPag = true;
        var payload = {
          IdReporte: 1,
          IdAdmision: this.registroSeleccionado.IdAdmision,
          NroPeticion: this.registroSeleccionado.NroPeticion
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
      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: 'Ya se encuentra anulado.'
        })
      }
    }
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

  propios(event: any) {

    console.log("data propios", event);
    console.log("data propios", this.esPropios);
  }

  validarPropios() {

    if (this.esPropios == true) {
      this.filtro.UsuarioCreacion = this.getUsuarioAuth().data[0].Documento;
    } else {
      this.filtro.UsuarioCreacion = null;
    }
  }

  validarTeclaEnter(evento) {

    if (evento.key == "Enter") {
      if (this.filtro.Documento == null) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'warning',
          title: 'Documento no encontrado revise bien los parametros.'
        })
      } else {
        this.bloquearPag = true;
        let Documento = { Documento: this.filtro.Documento.trim() }
        this.personaService.listarpaginado(Documento).then((res) => {
          this.bscPersona = res;
          this.filtro.NombreCompleto = res[0].NombreCompleto;
          this.filtro.Persona = res[0].Persona;
          this.editarCampoDocumento = true;
          setTimeout(() => {
            this.bloquearPag = false;
          }, 500);


        });
      }


    }

    // buscarporplaca(){
    //   this.bloquearPagina();
    //   if (this.estaVacio(this.dto.dw_mtunidad.numeroplaca)) {
    //     this.dto.dw_mtunidad.numeroplaca = null;
    //   }

    //   this.mtTallercitaService.validarPersonaPorPlaca(this.dto.dw_mtunidad.numeroplaca).then(
    //     obj => {
    //       if (obj != null) {
    //         console.log("buscar por placa:", obj);
    //         this.dto.idcliente = obj.dw_infocliente.persona;
    //         this.dto.dw_infocliente.nombrepersonadesc = obj.dw_infocliente.nombrepersonadesc;
    //         this.dto.dw_infocliente.documentodni = obj.dw_infocliente.documentodni;
    //         this.dto.dw_infocliente.tipodocumentodnidesc = obj.dw_infocliente.tipodocumentodnidesc;
    //         this.dto.dw_infocliente.telefonopers = obj.dw_infocliente.telefonopers;
    //         this.dto.dw_infocliente.direccionpers = obj.dw_infocliente.direccionpers;
    //         this.dto.dw_mtunidad.numeroplaca = obj.dw_mtunidad.numeroplaca;
    //         this.dto.dw_mtunidad.descripcionunidad = obj.dw_mtunidad.descripcionunidad;
    //         this.dto.dw_mtunidad.marcaunidad = obj.dw_mtunidad.marcaunidad;
    //         this.dto.dw_mtunidad.modelodescripcion = obj.dw_mtunidad.modelodescripcion;
    //         this.dto.dw_mtunidad.nroasientos = obj.dw_mtunidad.nroasientos;
    //         this.dto.dw_mtunidad.modeloanio = obj.dw_mtunidad.modeloanio
    //         this.dto.dw_mtunidad.distancia = obj.dw_mtunidad.distancia;
    //         this.dto.dw_mtunidad.numerochasis = obj.dw_mtunidad.numerochasis;

    //         this.dto.idunidad = obj.dw_mtunidad.idunidad;

    //       } else {
    //         this.mostrarMensajeError('No se encontro al Cliente.');
    //       }
    //       this.desbloquearPagina();
    //     }
    //   );

    // }
  }

  limpiarPersona() {

    this.filtro.Documento = null;
    this.filtro.NombreCompleto = null;
    this.filtro.Persona = null;
    this.editarCampoDocumento = false;
  }

  mostrarMensajeInfo(mensaje: string): void {
    this.mostrarMensaje(mensaje, 'info');
  }

  mostrarMensaje(mensaje: string, tipo: string): void {
    this.messageService.clear();
    this.messageService.add({ severity: tipo, summary: 'Mensaje', detail: mensaje });
  }

  onRowSelect(event: any) {
    console.log("seleccion:", event);
    console.log("seleccion variable:", this.registroSeleccionado);
  }

  validarEstados() {
    if (this.registroSeleccionado.Estado == 5) {

      return "ESTADO TERMINADO VOLVER A ELEGIR.";

    }
    if (this.registroSeleccionado.Estado == 3) {

      return "ESTADO ANULADO VOLVER A ELEGIR.";

    }

    return null;
  }
  editarConsultaAdmision(dto: Admision) {
    this.Auth = this.getUsuarioAuth();
    var prueba = this.Auth.data;
    dto = this.registroSeleccionado;
    if (dto == null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: 'Debe seleccionar un registro'
      })
    } else {
      if (dto.IdSede == prueba[0].IdSede) {

        var validar = this.validarEstados()
        switch (dto.TipoAdmisionId) {
          case 1:

            if (validar != null) {
              Swal.fire({
                icon: 'warning',
                title: '¡Mensaje!',
                text: validar
              })

            } else {
              this.router.navigate(["precisa/admision/co_admisionclinica", this.ACCIONES.EDITAR, JSON.stringify(dto)], { skipLocationChange: true });
              console.log("DTO DEL EDITAR 1 :::", dto);
            }
            break;
          case 2:
            if (validar != null) {
              Swal.fire({
                icon: 'warning',
                title: '¡Mensaje!',
                text: validar
              })

            } else {
              this.router.navigate(["precisa/admision/co_admisionconvenio", this.ACCIONES.EDITAR, JSON.stringify(dto)], { skipLocationChange: true });
              console.log("DTO DEL EDITAR 2 :::", dto);
            }
            // this.router.navigate(["precisa/admision/co_admisionconvenio", this.ACCIONES.EDITAR, JSON.stringify(dto)], { skipLocationChange: true });
            // if (this.registroSeleccionado.Estado == 1) { // TIENE QUE SER == SOLO CAMBIARLO PARA PRUEBAS
            //   this.router.navigate(["precisa/admision/co_admisionconvenio", this.ACCIONES.EDITAR, JSON.stringify(dto)], { skipLocationChange: true });
            //   console.log("DTO DEL EDITAR CO:::", dto);
            // } else {
            //   Swal.fire({
            //     icon: 'warning',
            //     title: '¡Mensaje!',
            //     text: `SOLO SE PUEDE MODIFICAR LOS PENDIENTES.`
            //   })
            // alert("SOLO SE PUEDE MODIFICAR LOS PENDIENTES")
            // }
            break;
          default:
            if (this.registroSeleccionado.Estado == 1) { // TIENE QUE SER == SOLO CAMBIARLO PARA PRUEBAS
              this.router.navigate(["precisa/admision/co_admisionparticular", this.ACCIONES.EDITAR, JSON.stringify(dto)], { skipLocationChange: true });
              console.log("CO defaul:::", dto);
            } else {
              Swal.fire({
                icon: 'warning',
                title: '¡Mensaje!',
                text: `SOLO SE PUEDE MODIFICAR LOS PENDIENTES.`
              })
              // alert("SOLO SE PUEDE MODIFICAR LOS PENDIENTES")
            }
            break
        }

      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: `USUARIO NO AUTORIZADO EN LA SEDE.`
        })
        // alert("USUARIO NO AUTORIZADO EN LA SEDE")
      }
    }
  }

}
