import { Component, ViewChild, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService, SelectItem } from "primeng/api";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { ConstanteAngular } from "../../../../@theme/ConstanteAngular";
import { UsuarioAuth } from "../../../auth/model/usuario";
import { PersonaBuscarComponent } from "../../../framework-comun/Persona/components/persona-buscar.component";
import { dtoPersona } from "../../../framework-comun/Persona/dominio/dto/dtoPersona";
import { PersonaService } from "../../../framework-comun/Persona/servicio/persona.service";
import { PersonaMantenimientoComponent } from "../../../framework-comun/Persona/vista/persona-mantenimiento.component";
import { FiltroCompaniamast } from "../../../seguridad/companias/dominio/filtro/FiltroCompaniamast";
import { MaestrocompaniaMastService } from "../../../seguridad/companias/servicio/maestrocompania-mast.service";
import { EmpleadoMast } from "../model/empleadomast";
import { filtroEmpleadoMast } from "../model/filtro.empleadomast";
import { EmpleadoMastService } from "../service/empleadomast.service";
import { ConstanteUI } from "../../../../../util/Constantes/Constantes";

@Component({
  selector: 'ngx-empleados-mantenimiento',
  templateUrl: './empleados-mantenimiento.component.html',
  styleUrls: ['./empleado-mantenimiento.component.scss']
})

export class EmpleadosMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy {
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  EmpleadoValid: FormGroup;

  bloquearPag: boolean;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  editarCampoDocumento: boolean = false;
  lstCompania: SelectItem[] = [];
  lstCargo: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  filtrocompa: FiltroCompaniamast = new FiltroCompaniamast();
  dtoEmpleado: EmpleadoMast = new EmpleadoMast();
  acciones: string = ''
  position: string = 'top'
  validarAccion: string = '';
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  dtoPersona: dtoPersona = new dtoPersona();
  isEditarPersona:boolean = false; 

  ngOnInit(): void {
    this.bloquearPag = true;
    const p1 = this.listarComboEstados();
    const p3 = this.listaComboCargo();
    const p4 = this.cargarCombocompania();
    this.bloquearPag = false;
    Promise.all([p1, p3, p4]).then(
      f => {
        setTimeout(() => {
          this.bloquearPag = false;
        }, 100);
      });
    this.EmpleadoValid.controls['email'].setValue('');
    this.EmpleadoValid = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{3,3})+$/)]]
    });
  } //[(ngModel)]="dtoEmpleado.CorreoInterno"

  ngOnDestroy(): void {

  }

  async iniciarComponente(msj: MensajeController, accion: string, titulo, _dtoEmpleado?: EmpleadoMast) {
    this.mensajeController = msj;
    this.bloquearPag = true;
    console.log("iniciarComponente ::", accion, _dtoEmpleado);
    if (accion) {
      this.dialog = true;
      this.validarAccion = accion;
      this.cargarAcciones(accion, _dtoEmpleado);
    }

    const prueba = await this.EmpleadoMastService.PRUEBA(null);
    console.log("prueba", prueba);

    this.bloquearPag = false;
  }

  constructor(
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private personaService: PersonaService,
    private EmpleadoMastService: EmpleadoMastService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,) {
    super();
  }

  async cargarAcciones(accion: string, _dtoEmpleado?: EmpleadoMast) {
    this.acciones = `${"Empleado"}: ${accion}`;
    this.dialog = true;
    this.puedeEditar = false;
    let bscPersona;
    this.fechaModificacion = undefined;
    switch (this.validarAccion) {
      case "NUEVO":
        this.fechaCreacion = new Date();
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

        this.fechaModificacion = undefined;
        //this.fechaModificacion = new Date();

        console.log("cargarAcciones NUEVO ::", this.validarAccion);
        console.log("Entydad NUEVO ::", _dtoEmpleado);
        this.dtoEmpleado = new EmpleadoMast();
        this.dtoEmpleado.Documento = "";
        this.dtoEmpleado.NombreCompleto = "";
        this.dtoEmpleado.Telefono = "";
        this.dtoEmpleado.Direccion = "";
        this.dtoEmpleado.Estado = "A";
        this.isEditarPersona = false;
        break;
      case "EDITAR":
        this.isEditarPersona = true;
        this.dtoEmpleado = new EmpleadoMast();

        console.log("cargarAcciones EDITAR ::", this.validarAccion);

        //Volver a buscar a empleado
        this.bloquearPag = true;
        let filtroEmpleado: filtroEmpleadoMast = new filtroEmpleadoMast();
        filtroEmpleado.Documento = _dtoEmpleado.Documento;
        const respEmpleado = await this.EmpleadoMastService.listarEmpleadoMast(filtroEmpleado);
        this.dtoEmpleado = await respEmpleado[0];
        this.bloquearPag = false;
        //
        bscPersona = {
          tipopersona: "ID",
          SoloBeneficiarios: this.dtoEmpleado.IdEmpleado,
          Documento: this.dtoEmpleado.Documento,
          UneuNegocioId: "0"
        }
        this.getPersonaServicio(bscPersona);
        //this.fechaCreacion = new Date(this.dtoEmpleado.FechaCreacion);

        //**FECHAS */
        if (this.dtoEmpleado.FechaCreacion != null) {
          this.fechaCreacion = new Date(this.dtoEmpleado.FechaCreacion);
        }
        if (this.dtoEmpleado.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(this.dtoEmpleado.UltimaFechaModif);
        }
        if (this.dtoEmpleado.FechaCese != null) {
          this.dtoEmpleado.FechaCese = new Date(this.dtoEmpleado.FechaCese);
        }
        if (this.dtoEmpleado.FechaFinContrato != null) {
          this.dtoEmpleado.FechaFinContrato = new Date(this.dtoEmpleado.FechaFinContrato);
        }
        if (this.dtoEmpleado.FechaInicioContrato != null) {
          this.dtoEmpleado.FechaInicioContrato = new Date(this.dtoEmpleado.FechaInicioContrato);
        }

        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dtoEmpleado.CompaniaSocio = this.dtoEmpleado.CompaniaSocio.trim();
        this.dtoEmpleado.CorreoInterno = this.dtoEmpleado.CorreoInterno.trim();
        break;
      case "VER":
        this.isEditarPersona = true;
        this.dtoEmpleado = new EmpleadoMast();
        this.puedeEditar = true;
        console.log("cargarAcciones EDITAR ::", this.validarAccion);
        this.dtoEmpleado = _dtoEmpleado;
        bscPersona = {
          tipopersona: "ID",
          SoloBeneficiarios: this.dtoEmpleado.IdEmpleado,
          Documento: this.dtoEmpleado.Documento,
          UneuNegocioId: "0"
        }
        this.getPersonaServicio(bscPersona);
        //this.fechaCreacion = new Date(this.dtoEmpleado.FechaCreacion);
        //**FECHAS */
        if (this.dtoEmpleado.FechaCreacion != null) {
          this.fechaCreacion = new Date(this.dtoEmpleado.FechaCreacion);
        }
        if (this.dtoEmpleado.UltimaFechaModif != null) {
          this.fechaModificacion = new Date(this.dtoEmpleado.UltimaFechaModif);
        }
        if (this.dtoEmpleado.FechaCese != null) {
          this.dtoEmpleado.FechaCese = new Date(this.dtoEmpleado.FechaCese);
        }
        if (this.dtoEmpleado.FechaFinContrato != null) {
          this.dtoEmpleado.FechaFinContrato = new Date(this.dtoEmpleado.FechaFinContrato);
        }
        if (this.dtoEmpleado.FechaInicioContrato != null) {
          this.dtoEmpleado.FechaInicioContrato = new Date(this.dtoEmpleado.FechaInicioContrato);
        }


        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.dtoEmpleado.CompaniaSocio = this.dtoEmpleado.CompaniaSocio.trim();
        break;
    }

    this.dtoEmpleado.UltimoUsuario = this.getUsuarioAuth().data[0].NombreCompleto;
  }

  validarTeclaEnterPaciente(evento) {
    console.log("validarTeclaEnterPaciente ::", evento);
    if (evento.key == "Enter") {
      if (this.dtoEmpleado.Documento == null) {
        this.toastMensaje('Ingrese un Nro. de documento', 'warning', 3000);
      }
      else if (this.dtoEmpleado.Documento.trim().length <= 4) {
        // this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
        this.dtoEmpleado.Documento = null;
      } else {
        let bscPersona = {
          Documento: this.dtoEmpleado.Documento.trim(),
          tipopersona: "P",
          SoloBeneficiarios: "0",
          UneuNegocioId: "0"
        }
        this.getPersonaServicio(bscPersona);
      }
    }
  }


  getPersonaServicio(bscPersona: any) {
    return this.personaService.listaPersonaUsuario(bscPersona).then((res) => {
      console.log("Consulta Detalle del res ::", res);
      this.bloquearPag = false;
      if (res.length > 0) {
        bscPersona = null;
        bscPersona = res[0];
        this.dtoPersona = res[0];
        this.dtoEmpleado.IdEmpleado = bscPersona.Persona;
        this.dtoEmpleado.Documento = bscPersona.Documento;
        this.dtoEmpleado.NombreCompleto = bscPersona.NombreCompleto;
        this.dtoEmpleado.Telefono = bscPersona.Telefono;
        this.dtoEmpleado.Direccion = bscPersona.Direccion;
        //  this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONA', ''), "VER", 1, bscPersona);
      } else {
        console.log("entroo nadaaa");
        //this.toastMensaje('Documento no encontrado, revise bien los parametros', 'warning', 3000);
      }
    }).catch(error => error);
  }

  verSelectorPaciente(): void {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), 'BUSCAR', "S");
  }


  coreSeleccionar(dta: any) {
    this.mensajeController.resultado = dta;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    this.coreSalir();
  }

  async coreMensaje(mensage: MensajeController) {
    if (mensage.resultado.EsEmpleado != 'S') {
      this.messageService.add({
        key: 'bc',
        severity: 'warn',
        summary: 'Warning',
        detail: 'La persona no es un empleado.'
      });

      return;
    }

    let filtrarEmpleado: filtroEmpleadoMast = new filtroEmpleadoMast();
    filtrarEmpleado.Documento = mensage.resultado.Documento;
    console.log("filtrarEmpleado", filtrarEmpleado);
    let empleado = await this.EmpleadoMastService.listarEmpleadoMast(filtrarEmpleado);
    console.log("empleado", empleado);

    if (empleado.length != 0) {
      if (empleado[0] != null || empleado != undefined) {
        this.messageService.add({
          key: 'bc',
          severity: 'warn',
          summary: 'Warning',
          detail: 'El empleado ya existe.'
        });
        return;
      }
    }


    if (mensage.componente == "SELECPACIENTE") {
      console.log("data del seleccionar", mensage);
      this.dtoEmpleado.Documento = mensage.resultado.Documento;
      this.dtoEmpleado.NombreCompleto = mensage.resultado.NombreCompleto;
      this.dtoEmpleado.IdEmpleado = mensage.resultado.Persona;
      this.dtoEmpleado.Direccion = mensage.resultado.Direccion;
      this.editarCampoDocumento = true;
      this.dtoPersona = mensage.resultado;
    }
  }

  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  limpiarPersona() {
    this.dtoEmpleado.IdEmpleado = null;
    this.dtoEmpleado.Documento = "";
    this.dtoEmpleado.NombreCompleto = "";
    this.dtoEmpleado.Telefono = "";
    this.dtoEmpleado.Direccion = "";
  }

  listarComboEstados() {
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstEstados.push({ label: 'Activo', value: "A" });
    this.lstEstados.push({ label: 'Inactivo', value: "I" });
  }

  listaComboCargo() {
    this.lstCargo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "CARGX").forEach(i => {
      this.lstCargo.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  cargarCombocompania(): Promise<number> {
    this.filtrocompa.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.filtrocompa).then(res => {
      console.log("company", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.CompaniaCodigo.trim() });
      });
      return 1;
    });
  }
  async coreGuardar() {

    if (this.dtoEmpleado == null) { this.messageShow('warn', 'Advertencia', 'Ingrese todos los campos.'); return; }
    if (this.dtoEmpleado.Documento == null || this.dtoEmpleado.Documento.length < 8) { this.messageShow('warn', 'Advertencia', 'El Documento no existe o es vacio.'); return; }
    if (this.dtoEmpleado.CompaniaSocio == null) { this.messageShow('warn', 'Advertencia', 'Seleccione una compañia.'); return; }
    if (this.dtoEmpleado.Cargo == null) { this.messageShow('warn', 'Advertencia', 'Seleccione un cargo.'); return; }
    if (this.dtoEmpleado.Telefono == null || this.dtoEmpleado.Telefono == '') { this.messageShow('warn', 'Advertencia', 'Ingrese un número de teléfono.'); return; }
    if (this.dtoEmpleado.CorreoInterno == null || this.dtoEmpleado.CorreoInterno == '') { this.messageShow('warn', 'Advertencia', 'Ingrese un correo.'); return; }
    //Validar si el elemento es un correo
    // alert("this.dtoEmpleado.CorreoInterno.startsWith('@')" +this.validarCorreo(this.dtoEmpleado.CorreoInterno))
    if (!this.validarCorreo(this.dtoEmpleado.CorreoInterno)) { this.messageShow('warn', 'Advertencia', 'Ingrese un correo valido.'); return; }

    if (this.dtoEmpleado.FechaInicioContrato == null || this.dtoEmpleado.FechaInicioContrato.toDateString() == '') { this.messageShow('warn', 'Advertencia', 'Ingrese una fecha de Inicio.'); return; }

    this.bloquearPag = true;
    console.log("this.dtoEmpleado", this.dtoEmpleado);

    switch (this.validarAccion) {

      case 'NUEVO':

        if (this.dtoPersona.EsEmpleado != 'S') {
          this.messageShow('warn', 'Advertencia', 'La persona no es de tipo empleado.');
          this.bloquearPag = false;
          return;
        }

        this.dtoPersona.EsEmpleado = 'S';
        /**AUDITORIA */
        // persona
        this.dtoPersona.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
        this.dtoPersona.UltimaFechaModif =  new Date();;
        this.dtoPersona.ipUltimo = this.getIp();
        // empleado
        this.dtoEmpleado.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
        this.dtoEmpleado.FechaCreacion = new Date();
        this.dtoEmpleado.UltimaFechaModif = undefined;

        //Telefono de empleado sin espacios
        this.dtoEmpleado.Telefono = this.dtoEmpleado.Telefono.trim();


        //this.dtoPersona.UltimaFechaModif = new Date();
        console.log("this.dtoPersona", this.dtoPersona);
        console.log("this.dtoEmpleado", this.dtoEmpleado);

        this.personaService.mantenimientoMaestro(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.dtoPersona, this.getUsuarioToken()).then(
          async res => {
            console.log("res", res);

            if (res.success) {
              this.bloquearPag = false;
              this.dtoEmpleado.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
              this.EmpleadoMastService.mantenimientoEmpleadoMast(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.dtoEmpleado, this.getUsuarioToken()).then(
                respNuevo => {
                  if (respNuevo.success || respNuevo.ok == true) {
                    this.messageShow('success', '', 'Empleado Registrado.');
                    this.dialog = false;
                    this.bloquearPag = false;
                    this.mensajeController.resultado = this.dtoEmpleado;
                    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                  } else {
                    this.messageShow('error', '', respNuevo.mensaje);
                    this.bloquearPag = false;
                  }
                }
              );

            }
          });

        break;
      case 'EDITAR':
        /**AUDITORIA */
        // persona
        this.dtoPersona.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
        this.dtoPersona.UltimaFechaModif = new Date();
        this.dtoPersona.ipUltimo = this.getIp();
        // empleado
        this.dtoEmpleado.UltimoUsuario = this.getUsuarioAuth().data[0].Usuario;
        this.dtoEmpleado.UltimaFechaModif = new Date();

        const respEditar = await this.EmpleadoMastService.mantenimientoEmpleadoMast(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.dtoEmpleado, this.getUsuarioToken());
        if (respEditar.success || respEditar.ok == true) {
          this.messageShow('success', '', 'Empleado Actualizado.');
          this.dialog = false;
          this.bloquearPag = false;
          this.mensajeController.resultado = this.dtoEmpleado;
          this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        } else {
          this.messageShow('error', '', respEditar.mensaje);
        }
        break
      default:
        this.dialog = false;
        this.bloquearPag = false;
        return;
    }
  }



  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
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
 
}
