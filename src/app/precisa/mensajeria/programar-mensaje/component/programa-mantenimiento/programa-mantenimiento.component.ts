import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../../util/ComponenteBasePrincipa';
import { UIMantenimientoController } from '../../../../../../util/UIMantenimientoController';
import { MensajeController } from '../../../../../../util/MensajeController';
import { ConstanteUI } from '../../../../../../util/Constantes/Constantes';
import { ConstanteAngular } from '../../../../../@theme/ConstanteAngular';
import { MessageService, SelectItem } from 'primeng/api';
import { PersonaBuscarComponent } from '../../../../framework-comun/Persona/components/persona-buscar.component';
import { dtoPersona } from '../../../../framework-comun/Persona/dominio/dto/dtoPersona';
import * as XLSX from 'xlsx';
import { VistaPreviaMensajeComponent } from '../vista-previa-mensaje/vista-previa-mensaje.component';
import { Dtoprogramacion } from '../../model/DtoProgramacion';
import { Dtoprogramaciondetalle } from '../../model/Dtoprogramaciondetalle';
import { MensajeServices } from '../../../formato-mensaje/services/mensaje.services';
import { Filtromensaje } from '../../../formato-mensaje/model/Filtromensaje';
import { icon } from 'leaflet';
import { ProgramarMensajeService } from '../../services/programar-mensaje.service';
import { DtoClassProgramacion } from '../../model/DtoClassProgramacion';
import { FiltroProgramacion } from '../../model/FiltroProgramacion';
@Component({
  selector: 'ngx-programa-mantenimiento',
  templateUrl: './programa-mantenimiento.component.html',
  styleUrls: ['./programa-mantenimiento.component.scss']
})
export class ProgramaMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(VistaPreviaMensajeComponent, { static: false }) vistaPreviaMensajeComponent: VistaPreviaMensajeComponent;


  /**CLASES DE FORMULARIO */
  dtoProgramacion: Dtoprogramacion = new Dtoprogramacion();
  dtoprogramacionDetalle: Dtoprogramaciondetalle[] = [];

  /**Listas de formulario */
  lstTipoMensaje: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstRepeticion: SelectItem[] = [];

  position: boolean;
  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = "";
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  TipoDeCambio: number;
  accionDetalle: string = '';
  html: '';
  rbTipo: string = '';
  dto: any = new dtoPersona();
  filtro: any = {
    persona: "",
    telefono: "",
    correo: ""
  };
  archivo: File | null = null;
  lstPersonasEnviar: any[] = [
    {
      num: 1,
      persona: "geampier Alexander Santamaria de la Cruz",
      telefono: "951178684",
      correo: "Geampier.dddd@gmail.com"
    }
  ];


  lstSeleccionadomultiple: any = [];

  constructor(private messageService: MessageService, private mensajeServices: MensajeServices, private programarMensajeService: ProgramarMensajeService) { super(); }

  async coreIniciarComponente(msj: MensajeController, accion: string, dtoAccion?: Dtoprogramacion) {



    // let filtroegresoDetalle: DtoEgreso = new DtoEgreso();
    try {
      //variables de entorno
      this.dtoProgramacion = new Dtoprogramacion();
      this.dtoprogramacionDetalle = [];
      this.lstSeleccionadomultiple = [];
      this.mensajeController = msj;
      this.acciones = accion;
      this.dialog = true;
      this.rbTipo = '';
      this.cargarEstado();
      await this.cargarTipoMensaje();
      this.cargarRepeticion();
      //auditoria
      this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;

      this.fechaModificacion = undefined;
      this.bloquearPag = true;
      this.puedeEditar = false;

      switch (accion) {
        case ConstanteUI.ACCION_SOLICITADA_NUEVO:
          this.fechaCreacion = new Date();
          this.puedeEditar = false;
          break;
        case ConstanteUI.ACCION_SOLICITADA_EDITAR:
          this.dtoProgramacion = { ...dtoAccion };
          this.dtoProgramacion.FechaInicio = new Date(this.dtoProgramacion.FechaInicio);
          this.dtoProgramacion.HoraInicio = new Date(this.dtoProgramacion.HoraInicio);
          this.fechaCreacion = this.dtoProgramacion.FechaCreacion;
          this.fechaModificacion = this.dto.fechaModificacion == null ? null : new Date(this.dto.fechaModificacion);

          this.dtoprogramacionDetalle = [];
          const filtroProgramacionEditar: FiltroProgramacion = new FiltroProgramacion();
          filtroProgramacionEditar.IdProgramacion = this.dtoProgramacion.IdProgramacion;
          const Detalle = await this.programarMensajeService.ListarMensajeProgramacionDetalle(filtroProgramacionEditar);
          Detalle.forEach(detalleProgramacion => {
            detalleProgramacion.num = this.dtoprogramacionDetalle.length + 1;
            this.dtoprogramacionDetalle.push(detalleProgramacion);
          });
          this.dtoprogramacionDetalle = [...this.dtoprogramacionDetalle];
          this.puedeEditar = false;

          console.log("EDITAR dtoprogramacionDetalle: ",this.dtoprogramacionDetalle);
          break;
        case ConstanteUI.ACCION_SOLICITADA_VER:
          this.dtoProgramacion = { ...dtoAccion };
          this.dtoProgramacion.FechaInicio = new Date(this.dtoProgramacion.FechaInicio);
          this.dtoProgramacion.HoraInicio = new Date(this.dtoProgramacion.HoraInicio);
          this.fechaCreacion = this.dtoProgramacion.FechaCreacion;
          this.fechaModificacion = this.dto.fechaModificacion == null ? null : new Date(this.dto.fechaModificacion);

          this.dtoprogramacionDetalle = [];
          const filtroProgramacionVer: FiltroProgramacion = new FiltroProgramacion();
          filtroProgramacionVer.IdProgramacion = this.dtoProgramacion.IdProgramacion;
          const DetalleVer = await this.programarMensajeService.ListarMensajeProgramacionDetalle(filtroProgramacionVer);
          DetalleVer.forEach(detalleProgramacion => {
            detalleProgramacion.num = this.dtoprogramacionDetalle.length + 1;
            this.dtoprogramacionDetalle.push(detalleProgramacion);
          });
          this.dtoprogramacionDetalle = [...this.dtoprogramacionDetalle];
          this.puedeEditar = true;
          console.log("VER dtoprogramacionDetalle: ",this.dtoprogramacionDetalle);
          break;

      }
    } catch (error) {
      console.log("ERROR::", error);
    } finally {
      this.bloquearPag = false;
      await this.seleccionTipoMensaje();
    }


  }

  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }
  coreBuscar(): void {
    // const lstPersonasEnviarBusqueda = structuredClone(this.lstPersonasEnviar.filter
    //   (f => f.persona.includes(this.filtro.persona) || f.telefono.includes(this.filtro.telefono) || f.correo.includes(this.filtro.correo)));
    //   console.log(this.filtro);
    //   console.log(lstPersonasEnviarBusqueda);

  }
  async coreGuardar() {
    /**VALIDACIONES DE PROGRAMACION */
    console.log("coreGuardar i", this.dtoProgramacion);
    if (this.estaVacio(this.dtoProgramacion.IdResponsable)) { this.messageShow('warn', 'Advertencia', 'Seleccione un responsable válido'); return; }
    if (this.estaVacio(this.dtoProgramacion.IdMensaje)) { this.messageShow('warn', 'Advertencia', 'Seleccione un formato de mensaje válido'); return; }
    if (this.estaVacio(this.dtoProgramacion.FechaInicio)) { this.messageShow('warn', 'Advertencia', 'Ingrese una fecha desde Válida'); return; }
    if (this.estaVacio(this.dtoProgramacion.HoraInicio)) { this.messageShow('warn', 'Advertencia', 'Ingrese una hora Válida'); return; }
    if (this.estaVacio(this.dtoProgramacion.TipoProgramacion)) { this.messageShow('warn', 'Advertencia', 'Seleccione una repetición Válida'); return; }
    if (this.estaVacio(this.dtoProgramacion.Estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione un wstado Válido'); return; }
    console.log("coreGuardar ii", this.dtoProgramacion);
    /**VALIDACIONES DE DETALLE PROGRAMACION */
    // Validacion de correo
    if (this.dtoprogramacionDetalle.length == 0) { this.messageShow('warn', 'Advertencia', 'Ingrese mínimo una persona a enviar'); return; }
    if (this.rbTipo == 'correo') {
      for (let persona of this.dtoprogramacionDetalle) {
        if (persona.Codigo == null) { this.messageShow('warn', 'Advertencia', `La persona ${persona.Nombre} su correo es inválido`); return; }
      }
    }

    // Validacion de número
    if (this.rbTipo == 'sms') {
      for (let persona of this.dtoprogramacionDetalle) {
        if (persona.Codigo == null) { this.messageShow('warn', 'Advertencia', `La persona ${persona.Nombre} su número es inválido`); return; }
        if (persona.Codigo.length < 9) { this.messageShow('warn', 'Advertencia', `La persona ${persona.Nombre} su número es inválido`); return; }
      }
    }
    console.log("coreGuardar iii", this.rbTipo);
    this.bloquearPag = true;
    switch (this.acciones) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        try {
          const nuevaProgramacion: DtoClassProgramacion = new DtoClassProgramacion();
          nuevaProgramacion.Programacion = this.dtoProgramacion;
          nuevaProgramacion.Detalle = this.dtoprogramacionDetalle;
          const respNuevo = await this.programarMensajeService.MantenimientoProgramacion(1, nuevaProgramacion, this.getUsuarioToken());
          respNuevo
          console.log("respNuevo", respNuevo);
          if (respNuevo.success == true) {
            this.messageShow('success', 'Success', this.getMensajeGuardado());
            this.mensajeController.resultado = respNuevo;
            this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            this.dialog = false;
          } else {
            this.messageShow('warn', 'Advertencia', this.getMensajeErrorGuardado());
          }
        } catch (error) {
          console.error("ERROR GUARDADO::", error);
          this.messageShow('warn', 'Advertencia', this.getMensajeErrorGuardado());
        } finally {
          this.bloquearPag = false;
        }
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        try {
          const editarProgramacion: DtoClassProgramacion = new DtoClassProgramacion();
          editarProgramacion.Programacion = this.dtoProgramacion;
          editarProgramacion.Detalle = this.dtoprogramacionDetalle;
          const respEditar = await this.programarMensajeService.MantenimientoProgramacion(2, editarProgramacion, this.getUsuarioToken());
          respEditar
          console.log("respEditar", respEditar);
          if (respEditar.success == true) {
            this.messageShow('success', 'Success', this.getMensajeGuardado());
            this.mensajeController.resultado = respEditar;
            this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            this.dialog = false;
          } else {
            this.messageShow('warn', 'Advertencia', this.getMensajeErrorGuardado());
          }
        } catch (error) {
          console.error("ERROR GUARDADO::", error);
          this.messageShow('warn', 'Advertencia', this.getMensajeErrorGuardado());
        } finally {
          this.bloquearPag = false;
        }
        break;
      case ConstanteUI.ACCION_SOLICITADA_VER:
        break;
    }
  }
  agregarPersonas(listaAgregar: any[], modo: string): void {
    /**VALIDACIONES ANTES DE AGREGAR */
    if (this.rbTipo == '') { this.messageShow('error', 'Error', 'Seleccione un formato de mensaje válido'); return; }

    switch (modo) {
      case 'SELECCION':
        console.log("listaAgregar", listaAgregar);
        console.log("lstPersonasEnviar", this.dtoprogramacionDetalle);

        for (let personaAgregar of listaAgregar) {

          for (let personaValidar of this.dtoprogramacionDetalle) {
            switch (this.rbTipo) {
              case 'correo':
                if (personaAgregar.CorreoElectronico == null || personaAgregar.CorreoElectronico == "") {
                  this.messageShow('warn', 'advertencia', ` La persona ${personaAgregar.Nombres} ${personaAgregar.ApellidoPaterno} ${personaAgregar.ApellidoMaterno} no cuenta con correo electrónico válido`);
                  this.dtoprogramacionDetalle = [...this.dtoprogramacionDetalle];
                  return;
                }

                if (personaValidar.Codigo == personaAgregar.CorreoElectronico) {
                  this.messageShow('error', 'Error', 'Ya existe una persona con el mismo correo electrónico');
                  this.dtoprogramacionDetalle = [...this.dtoprogramacionDetalle];
                  return;
                }
                break;
              case 'sms':
                if (personaAgregar.Telefono == null || personaAgregar.Telefono == "" || personaAgregar.Telefono.length < 9) {
                  this.messageShow('warn', 'advertencia', ` La persona ${personaAgregar.Nombres} ${personaAgregar.ApellidoPaterno} ${personaAgregar.ApellidoMaterno} no cuenta con Nro de celular válido`);
                  this.dtoprogramacionDetalle = [...this.dtoprogramacionDetalle];
                  return;
                }
                if (personaValidar.Codigo == personaAgregar.Telefono) {
                  this.messageShow('error', 'Error', 'Ya existe una persona con el mismo número');
                  this.dtoprogramacionDetalle = [...this.dtoprogramacionDetalle];
                  return;
                }
                break;
            }
          }

          let detalleAgregar: Dtoprogramaciondetalle = new Dtoprogramaciondetalle();
          detalleAgregar.IdPersona = personaAgregar.Persona;
          detalleAgregar.Codigo = this.rbTipo == 'correo' ? personaAgregar.CorreoElectronico : this.rbTipo == 'sms' ? personaAgregar.Telefono : null;
          detalleAgregar.Nombre = `${personaAgregar.Nombres} ${personaAgregar.ApellidoPaterno} ${personaAgregar.ApellidoMaterno}`;
          detalleAgregar.Indicador = this.rbTipo == 'correo' ? 2 : this.rbTipo == 'sms' ? 1 : null;;
          detalleAgregar.Estado = ConstanteUI.ESTADO_NUMERICO_ACTIVO;
          detalleAgregar.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();
          detalleAgregar.FechaCreacion = new Date();
          detalleAgregar.IpCreacion = this.getIp();
          detalleAgregar.num = this.dtoprogramacionDetalle.length + 1;

          this.dtoprogramacionDetalle.push(detalleAgregar);

          // this.lstPersonasEnviar.push({
          //   num: this.lstPersonasEnviar.length + 1,
          //   persona: `${personaAgregar.Nombres} ${personaAgregar.ApellidoPaterno} ${personaAgregar.ApellidoMaterno}`,
          //   telefono: personaAgregar.Telefono,
          //   correo: personaAgregar.CorreoElectronico
          // }
          // );
        }
        break;
      case 'ARCHIVO':
        for (let personaAgregar of listaAgregar) {
          this.lstPersonasEnviar.push({
            num: this.lstPersonasEnviar.length + 1,
            persona: `${personaAgregar.NOMBRE} ${personaAgregar.A_PATERNO} ${personaAgregar.A_MATERNO}`,
            telefono: personaAgregar.TELEFONO_1,
            correo: personaAgregar.EMAIL
          }
          );
        }
        break;
    }

    this.lstPersonasEnviar = [...this.lstPersonasEnviar];
    this.dtoprogramacionDetalle = [...this.dtoprogramacionDetalle];
  }
  coreMensaje(mensage: MensajeController): void {
    console.log("data llegando mantenimiento:", mensage.resultado);
    this.lstSeleccionadomultiple = [];
    if (mensage.componente == "SELECT_REPRESENTANTE") {
      this.dtoProgramacion.IdResponsable = mensage.resultado.Persona;
      this.dtoProgramacion.Documento = mensage.resultado.Documento;
      this.dtoProgramacion.Responsable = mensage.resultado.NombreCompleto;
    }
    if (mensage.componente == "SELECT_LSTPERSONAS") {
      this.agregarPersonas(mensage.resultado, 'SELECCION');
    }
  }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  cargarEstado(): void {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo })
    });
  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }
  coreBuscarPersona(busquedaSelectiva: boolean = false): void {
    if (this.rbTipo == '' && busquedaSelectiva == true) { this.messageShow('error', 'Error', 'Seleccione un formato de mensaje válido'); return; }
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, busquedaSelectiva == true ? 'SELECT_LSTPERSONAS' : 'SELECT_REPRESENTANTE', 'BUSCAR'), 'BUSCAR', "N", busquedaSelectiva);
  }
  coreVistaPrevia(): void {
    this.vistaPreviaMensajeComponent.coreIniciarComponente(new MensajeController(this, 'VISTA_PREVIA', ''), ConstanteUI.ACCION_SOLICITADA_NUEVO);
  }
  limpiarResponsable(): void {
    this.dtoProgramacion.IdResponsable = null;
    this.dtoProgramacion.Responsable = null;
    this.dtoProgramacion.Documento = null;
  }

  eliminarPersona(): void {
    console.log("eliminarPersona: ",this.lstSeleccionadomultiple);
    for (let personaEliminar of this.lstSeleccionadomultiple) {
      this.lstPersonasEnviar = this.lstPersonasEnviar.filter(p => p.Nombre != personaEliminar.Nombre);
    }
    console.log("eliminarPersona ok: ",this.lstPersonasEnviar);
  }


  cargaArchivo(event: any): void {
    this.archivo = event.target.files[0];
    this.obtenerListaArchivo();
  }
  obtenerListaArchivo() {
    try {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(jsonData);

        const headers: any = jsonData[0];
        const data = jsonData.slice(1);

        const lstPersonas = data.map((row: any) => {
          const obj: any = {};
          headers.forEach((header: any, index: number) => {
            obj[header] = row[index];
          });
          return obj;
        });

        console.log(lstPersonas);
        this.agregarPersonas(lstPersonas, 'ARCHIVO');

      };
      fileReader.readAsArrayBuffer(this.archivo);
    } catch (error) {
      console.log(`Error al leer archivo: ${error}`);
    }
  }

  async cargarTipoMensaje() {
    const filtroMensajes = new Filtromensaje();
    filtroMensajes.Estado = 1;
    this.lstTipoMensaje = [];
    const respMensaje = await this.mensajeServices.ListarMensaje(filtroMensajes);
    this.lstTipoMensaje.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    respMensaje.forEach(tipoMensaje => {
      this.lstTipoMensaje.push({ label: tipoMensaje.Nombre.toUpperCase(), value: tipoMensaje.IdMensaje, title: tipoMensaje.TipoMensaje })
    });
    this.lstTipoMensaje = [...this.lstTipoMensaje];
  }
  cargarRepeticion(): void {
    this.lstRepeticion = [];
    this.lstRepeticion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPREP").forEach(i => {
      this.lstRepeticion.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo })
    });
  }
  async seleccionTipoMensaje(): Promise<boolean> {

    if (this.dtoProgramacion.IdMensaje != null || this.dtoProgramacion.IdMensaje != undefined) {
      console.log("this.lstTipoMensaje", this.lstTipoMensaje);
      for (let tipoMensaje of this.lstTipoMensaje) {
        if (tipoMensaje.value == this.dtoProgramacion.IdMensaje) {
          console.log("this.lstTipoMensaje", tipoMensaje);
          this.rbTipo = tipoMensaje.title == 1 ? 'sms' : tipoMensaje.title == 2 ? 'correo' : null;
        }
      }

    }
    return true;
  }

}
