import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, LazyLoadEvent, MessageService, SelectItem } from "primeng/api";
import { Table } from "primeng/table";
import { ComponenteBasePrincipal } from "../../../../../../util/ComponenteBasePrincipa";
import { ConstanteAngular } from "../../../../../@theme/ConstanteAngular";
import { UsuarioAuth } from "../../../../auth/model/usuario";
import { ServicioComunService } from "../../../../framework-comun/servicioComun.service";
import { DtoAdmisionclinicaDetalle } from "../../dominio/dto/DtoAdmisionclinicaDetalle";
import { DtoAdmisionprueba, DtoPacienteClinica } from "../../dominio/dto/DtoPacienteClinica";
import { FiltroPacienteClinica } from "../../dominio/filtro/FiltroPacienteClinica";
import { PacienteClinicaService } from "../../service/paciente-clinica.service";
import { NbToastrService } from '@nebular/theme';
import Swal from "sweetalert2";
import { MensajeController } from "../../../../../../util/MensajeController";
// import { IpServiceService } from "../../../../../ip-service.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Admision } from "../../../consulta/dominio/dto/DtoConsultaAdmision";
import { PersonaService } from "../../../../framework-comun/Persona/servicio/persona.service";
import { convertDateStringsToDates } from "../../../../framework/funciones/dateutils";
import { UISelectorController } from "../../../../../../util/UISelectorController";


@Component({
  selector: 'ngx-paciente-clinica-buscarOA',
  templateUrl: './paciente-clinica-buscarOA.component.html'
})
export class PacienteClinicaBuscarOAComponent extends ComponenteBasePrincipal implements OnInit,  UISelectorController  {
  mensajeController: MensajeController;
  filtro: FiltroPacienteClinica = new FiltroPacienteClinica();
  dtoAdmClini: DtoAdmisionclinicaDetalle = new DtoAdmisionclinicaDetalle();
  loading: boolean;
  ipAddress: string;
  bloquearPag: boolean;
  dto: DtoPacienteClinica = new DtoPacienteClinica();
  dtofinal: DtoAdmisionprueba = new DtoAdmisionprueba();
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  lstgridbuscarOA: DtoPacienteClinica[] = [];
  registroSeleccionado: any;
 // list_AdmisionServicio: DtoAdmisionclinicaDetalle[] = [];
  lstgridbuscarOA2: DtoPacienteClinica[] = [];
  lstCliente: SelectItem[] = [];
  lstsedeCliente: SelectItem[] = [];
  lstTipoAtencion: SelectItem[] = [];
  lstTipoPaciente: SelectItem[] = [];
  lstTipoServicio: SelectItem[] = [];
  isRunning: Boolean = false;
  cap: number = 1;
  titulo = '';
  validarAccion: string;
  validarOA: FormGroup;

  acciones: string = ''
  position: string = 'top'

  constructor(
    private formBuilder: FormBuilder,
  //  messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private pacienteClinicaService: PacienteClinicaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private toastrService: NbToastrService,
    servicioComun: ServicioComunService,
    private http: HttpClient,
    private personaService: PersonaService,

    
  ) {
    super();
  }


  coreSeleccionar(seleccion: any): void {
    throw new Error("Method not implemented.");
  }

  ngOnInit(): void {

    this.combocliente();
    const p2 = this.comboTipoAtencion();
    const p4 = this.comboTipoPaciente();
    console.log("comboTipoPaciente:: ", p4);
    const p5 = this.comboTipoServicio();
    console.log("comboTipoServicio:: ", p5);
    Promise.all([ p2, p4, p5]).then((resp) => {

    }); 
  }



  coreBusquedaRapida(filtro: string): void {
    throw new Error("Method not implemented.");
  }
  coreFiltro(flag: boolean): void {
    throw new Error("Method not implemented.");
  }
  coreIniciarComponente(mensaje: MensajeController): void {
    throw new Error("Method not implemented.");
  }
  coreExportar(tipo: string): void {
    throw new Error("Method not implemented.");
  }
  coreMensaje(mensage: MensajeController): void {
    throw new Error("Method not implemented.");
  }
  coreAccion(accion: string): void {
    throw new Error("Method not implemented.");
  }

  
  coreIniciarComponenteBuscarOA(mensaje: MensajeController, accionform: string, dtoEditExamen?: any) {

    this.mensajeController = mensaje;
    this.dialog = true;
    this.limpiarBuscador();
    this.puedeEditar = false;
    this.titulo = 'ORDEN DE ADMISION';
    this.acciones = `${this.titulo}: ${accionform}`;
    this.validarAccion = accionform;
    if (accionform == 'NUEVO') {
      this.filtro.TipoAtencion = dtoEditExamen.TipoAtencion;
      this.filtro.TipoOperacionID = dtoEditExamen.TipoOperacionID;
      this.filtro.TipoOrdenAtencion2 = dtoEditExamen.ClasificadorMovimiento; //Combo Servicio
      this.filtro.IdCliente = dtoEditExamen.comboCliente;
      this.dialog = true;
      this.puedeEditar = false;
    } else {
      this.filtro = mensaje.componenteDestino.dtoEditExamen;
    }

 
  }
 

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }


  defaultBuscar(event) {
    if (event.keyCode === 13) {
      console.log("defaultBuscar por enter:: ", event);
      this.coreBuscar();
    }
  }


  coreBuscar(): void {

      this.dataTableComponent.first = this.filtro.paginacion.paginacionRegistroInicio;

      if (this.estaVacio(this.filtro.CodigoOA)) {
        this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe Ingresar Orden de Atención.', life: 700 });
        return;
      }
      this.mensajeController.resultado = "1";
      this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);  
       if (this.filtro.TipoOrdenAtencion2 == "01") {
         this.filtro.TipoOrdenAtencion = 5;
       }
       if (this.filtro.TipoOrdenAtencion2 == "02") {
         this.filtro.TipoOrdenAtencion = 15;
       } 
        if (this.filtro.TipoOrdenAtencion2 == "03") {
         this.filtro.TipoOrdenAtencion = 9;
       }
       this.filtro.CodigoOA = this.filtro.CodigoOA.trim();


       this.bloquearPag = true;
             this.pacienteClinicaService.listarpaginado(this.filtro).then((res) => 
             {
              this.bloquearPag = false;
               console.log("LISTA data de ConsultaOA ::", res);
                 if (res.valor > 0)
                 {               
                   this.lstgridbuscarOA = res.data;
                   var contador = 0;
                   this.lstgridbuscarOA.forEach(element => {
                     contador = contador + 1;
                     element.nrocorrBuscarOA = contador;
                   });
                   this.lstgridbuscarOA2 = this.lstgridbuscarOA.filter(
                     (thing, i, arr) => arr.findIndex(t => t.Documento.trim() === thing.Documento.trim()) === i
                   );
                 }else
                 {
                   this.lstgridbuscarOA2 = null;              
                   this.makeToast(this.getMensajeAlerta(res.mensaje));           
                 }
               
       });
  
  }


  llamarPersonaXdocumento(docu) {
    let Documento = { Documento: docu.trim() }
    this.personaService.listarpaginado(Documento).then((res) => {
      console.log("mensaje del res llamar persona ", res)
    });
  }


  combocliente() {
    console.log("ConsultaOA lista cliente", JSON.parse(sessionStorage.getItem('comboCliente')));
    var listaComboliente = convertDateStringsToDates(JSON.parse(sessionStorage.getItem('comboCliente')));    
    if (!this.esListaVacia(listaComboliente)){
      listaComboliente.forEach(e => {
        this.lstCliente.push({ label: e.empresa, value: e.Persona });
         this.filtro.IdCliente= listaComboliente[0].Persona;
      });
      if(listaComboliente.length > 0){
         this.combosedecliente(this.filtro.IdCliente);
      }
    }
     else{
      this.lstCliente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.filtro.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
      this.filtro.TIPOADMISIONID = 1;
      this.filtro.TipEstado = 1;
      this.filtro.IdSede = this.getUsuarioAuth().data[0].IdSede;
       this.pacienteClinicaService.listarComboCliente(this.filtro)
        .then(resp => {
          resp.forEach(obj => this.lstCliente.push({ label: obj.empresa, value: obj.Persona }));
          if(this.lstCliente.length > 0){
          this.filtro.IdCliente = resp[0].Persona;
          console.log("ConsultaOA lista cliente", resp);
          sessionStorage.setItem('comboCliente', JSON.stringify(resp));         
          this.combosedecliente(this.filtro.IdCliente);
        }
        }); 
    }  
  }


  combosedecliente(IdCliente: number): Promise<number> {
    this.lstsedeCliente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.filtro.IdSede = this.getUsuarioAuth().data[0].IdSede;
    this.filtro.IdEmpresa = IdCliente;
    return this.pacienteClinicaService.listarCombosedeCliente(this.filtro)
      .then(resp => {
        resp.forEach(obj => this.lstsedeCliente.push({ label: obj.SedDescripcion, value: obj.SedCodigo }));
        this.filtro.Sucursal = resp[0].SedCodigo;
        console.log("ConsultaOA lista combosedecliente", this.lstsedeCliente);
        return 1;
      });
    
  }

  comboTipoAtencion() {
    this.lstTipoAtencion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOATENCION").forEach(i => {
      this.lstTipoAtencion.push({ label: i.Nombre, value: i.IdCodigo })
    });
    console.log("ConsultaOA lista comboTipoAtencion", this.lstTipoAtencion);
  }

  comboTipoPaciente(): Promise<number> {
    this.lstTipoPaciente.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.filtro.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
    this.filtro.TIPOADMISIONID = 1;
    this.filtro.IdSede = this.getUsuarioAuth().data[0].IdSede;
    this.filtro.TipEstado = 1;
    return this.pacienteClinicaService.listarTipoPaciente(this.filtro)
      .then(resp => {
        resp.forEach(obj => this.lstTipoPaciente.push({ label: obj.Descripcion, value: obj.TipoOperacionID }));
        console.log("ConsultaOA lista comboTipoPaciente", this.lstTipoPaciente);
        return 1;
      });
  }


  comboTipoServicio(): Promise<number> {
    this.lstTipoServicio.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.filtro.Estado = 1;
    this.filtro.Compania = this.getUsuarioAuth().data[0].ACCESO;
    return this.pacienteClinicaService.listarcomboTipoServicio(this.filtro)
      .then(resp => {
        resp.forEach(obj => this.lstTipoServicio.push({ label: obj.Nombre, value: obj.ClasificadorMovimiento }));
        console.log("ConsultaOA lista comboTipoServicio", this.lstTipoServicio);
        return 1;
      });
  }

  coreSalir() {
    this.dialog = false;
  };


  coreSeleccionar2(rowData: any) {
    this.dtofinal = new DtoAdmisionprueba();
    this.dtofinal.Admision.fechanacimiento = new Date(rowData.FechaNacimiento);
    this.dtofinal.Admision.TipoDocumento = rowData.TipoDocumento;
    this.dtofinal.Admision.Documento = rowData.Documento;
    this.dtofinal.Admision.nombres = rowData.PacienteNombres;
    this.dtofinal.Admision.apellidopaterno = rowData.PacienteAPPaterno;
    
    if (this.estaVacio(rowData.PacienteAPMaterno)) {
      this.dtofinal.Admision.apellidomaterno = " ";
    } else {
      this.dtofinal.Admision.apellidomaterno = rowData.PacienteAPMaterno;
    }
    this.dtofinal.Admision.sexo = rowData.Sexo;
    this.dtofinal.Admision.UneuNegocioId = this.getUsuarioAuth().data[0].UneuNegocioId;
    this.dtofinal.Admision.TipoOperacionID = this.filtro.TipoOperacionID;
    this.dtofinal.Admision.FechaAdmision = new Date(rowData.FechaLimiteAtencion);
    this.dtofinal.Admision.HistoriaClinica = rowData.CodigoHC;
    this.dtofinal.Admision.OrdenAtencion = rowData.CodigoOA;
    this.dtofinal.Admision.IdSede = this.getUsuarioAuth().data[0].IdSede;
    this.dtofinal.Admision.Estado = 1;
    this.dtofinal.Admision.FechaLimite =new Date(rowData.FechaLimiteAtencion);
    this.dtofinal.Admision.FechaCreacion = new Date();
    this.dtofinal.Admision.FechaModificacion = new Date();
    this.dtofinal.Admision.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
    this.dtofinal.Admision.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario;
    this.dtofinal.Admision.IpCreacion = this.getIp();
    this.dtofinal.Admision.IpModificacion = this.getIp();
    this.dtofinal.Admision.ClasificadorMovimiento = this.filtro.TipoOrdenAtencion2; //combo servicio
    this.dtofinal.Admision.TipoPaciente = this.filtro.TipoOperacionID;
    this.dtofinal.Admision.TipoAtencion = this.filtro.TipoAtencion;

    if (!this.estaVacio(rowData.TipoOrden)) {
      this.dtofinal.Admision.TipoOrden = rowData.TipoOrden;
    } else {
      this.dtofinal.Admision.TipoOrden = "";
    }
    if (!this.estaVacio(rowData.Pacienteemail)) {
      this.dtofinal.Admision.CorreoElectronico = rowData.Pacienteemail;
    } else {
      this.dtofinal.Admision.CorreoElectronico = "";
    }

    if (!this.estaVacio(rowData.Empleadora_RUC)) {
      this.dtofinal.Admision.RucEmpresaPaciente = rowData.Empleadora_RUC;
    }
    else {
      this.dtofinal.Admision.RucEmpresaPaciente = "";
    }

    if (!this.estaVacio(rowData.Empleadora_Nombre)) {
      this.dtofinal.Admision.EmpresaPaciente = rowData.Empleadora_Nombre;
    }
    else {
      this.dtofinal.Admision.EmpresaPaciente = "";
    }


    if (!this.estaVacio(rowData.Aseguradora_RUC)) {
      this.dtofinal.Admision.RucAseguradora = rowData.Aseguradora_RUC;
    } else {
      this.dtofinal.Admision.RucAseguradora = "";
    }

    if (!this.estaVacio(rowData.Aseguradora_Nombre)) {
      this.dtofinal.Admision.NombreAseguradora = rowData.Aseguradora_Nombre;
    } else {
      this.dtofinal.Admision.NombreAseguradora = "";
    }

    if (!this.estaVacio(rowData.Especialidad_Nombre)) {
      this.dtofinal.Admision.DesEspecialidad = rowData.Especialidad_Nombre;
    } else {
      this.dtofinal.Admision.DesEspecialidad = "";
    }

    if (!this.estaVacio(rowData.CMP)) {
      this.dtofinal.Admision.CMP = rowData.CMP;
    } else {
      this.dtofinal.Admision.CMP = "";
    }

    if (!this.estaVacio(rowData.MedicoNombres)) {
      this.dtofinal.Admision.NombreMedico = rowData.MedicoNombres;
    } else {
      this.dtofinal.Admision.NombreMedico = "";
    }

    if (!this.estaVacio(rowData.MedicoAPPaterno)) {
      this.dtofinal.Admision.PaternoMedico = rowData.MedicoAPPaterno;
    } else {
      this.dtofinal.Admision.PaternoMedico = "";
    }
    if (!this.estaVacio(rowData.MedicoAPMaterno)) {
      this.dtofinal.Admision.MaternoMedico = rowData.MedicoAPMaterno;
    } else {
      this.dtofinal.Admision.MaternoMedico = "";
    }

    this.dtofinal.Admision.dniMedico = "";
    this.dtofinal.Admision.TIPOADMISIONID = 1;


    this.lstgridbuscarOA.forEach(element => {
      if(element.IdOrdenAtencion == rowData.IdOrdenAtencion)
      {
          var dtoAdmClini = new DtoAdmisionclinicaDetalle();
          dtoAdmClini.Linea = element.Linea;
          dtoAdmClini.IdOrdenAtencion = element.IdOrdenAtencion;
          dtoAdmClini.CodigoComponente = element.Componente;
          dtoAdmClini.Descripcion = element.ComponenteNombre;
          dtoAdmClini.Cantidad = element.CantidadSolicitada;
          dtoAdmClini.Estado = 1;
          dtoAdmClini.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
          dtoAdmClini.IpCreacion = this.getIp();
          dtoAdmClini.IpModificacion = this.getIp();
          this.dtofinal.list_AdmisionServicio.push(dtoAdmClini);
        }
    });
    this.dtofinal.IndicadorWS = 1;
    console.log("ConsultaOA Envio GUARDAR DTO:",this.dtofinal); 
    this.bloquearPag = true;
    this.pacienteClinicaService.mantenimientoAdmisionClinica(1, this.dtofinal, this.getUsuarioToken())
    .then(
        res => {
          this.bloquearPag = false;
          console.log("data registrada:",res);
          if(res.valor >0){
            if (res.Admision.NroPeticion != null) {
            this.getMensajeGrabado(res.Admision.NroPeticion);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'El Registro Nro.'+  res.Admision.NroPeticion +  'se guardó con éxito', life: 1000 });

              this.coreSalir();
              this.limpiarBuscador();
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            } else {
              this.coreSalir();
              this.limpiarBuscador();
              Swal.fire({
                icon: 'warning',
                title: 'Error!',
                text: `${res.Mensaje}`
              });
             
            }
          }else{
            this.coreSalir();
            this.limpiarBuscador();
            Swal.fire({
              icon: 'warning',
              title: 'Oops...',
              text: `${res.Mensaje}`
            });
          }
         
        });

  }

  
  limpiarBuscador() {
    this.filtro.CodigoOA = null;
    this.lstgridbuscarOA2 = [];
    this.loading = false;
  }

}
