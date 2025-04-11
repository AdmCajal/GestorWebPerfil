import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, LazyLoadEvent, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { dtoPersona } from '../../../framework-comun/Persona/dominio/dto/dtoPersona';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { FiltroPersona } from '../dominio/filtro/FiltroPersona';
import Swal from 'sweetalert2';
import { PersonaMantenimientoComponent } from '../../../framework-comun/Persona/vista/persona-mantenimiento.component';
import { ipersona } from '../dominio/ipersona';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { lstat } from 'fs';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-personamast',
  templateUrl: './personamast.component.html',
  styleUrls: ['./personamast.component.scss']
})
export class PersonamastComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;
  @ViewChild(Table, { static: false }) dataTableComponent: Table;
  bloquearPag: boolean;
  filtro: FiltroPersona = new FiltroPersona();
  lstPersona: dtoPersona[] = [];
  lstEstados: SelectItem[] = [];
  lstTipoDocumento: SelectItem[] = [];
  lstTipoPersona: SelectItem[] = [];

  lstSexo: SelectItem[] = [];
  lstTipoAdmision: SelectItem[] = [];
  lstDepartamento: SelectItem[] = [];
  lstProvincia: SelectItem[] = [];
  lstDistrito: SelectItem[] = [];
  verMantPersona: boolean = false;
  dto: dtoPersona = new dtoPersona();
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string;
  esCliente: boolean = false;
  esProveedor: boolean = false;
  esEmpleado: boolean = false;
  esOtro: boolean = false;
  selectedPort = "";
  editarTipoDocumento: boolean = false;
  validarmaxtexto: number;
  validarmintexto: number;
  verDocumento: boolean = false;
  ocultarApeMat: boolean = false;
  oculApeMatExt: boolean = false;
  editarCampos: boolean = false;
  verApeMat: boolean = false;
  selectedFechaNacimiento = new Date();
  editarPassword: boolean = false;
  verValidarTipoPersona: boolean = false;
  verValidarTelefono: boolean = false;
  verValidarDireccion: boolean = false;
  selectedEstado = "";
  verValidarEstado: boolean = false;
  selectedTipoDocuemento = "";
  verRuc: boolean = false;
  registroSeleccionado: any;
  loading: boolean;
  ltsExportar: MenuItem[];
  @ViewChild('myTipoPersona', { static: false }) myTipoPersona: ElementRef;
  @ViewChild('myDocumento', { static: false }) myDocumento: ElementRef;


  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private personaService: PersonaService,
    private exportarService: ExportarService,) {
    super();
  }


  coreNuevo(): void {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONA', ''), "NUEVO", 1);
  }

  async coreinactivar(dtoInactivar) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm",
      accept: async () => {
        /**AUDITORIA*/
        dtoInactivar.UltimoUsuario = this.getUsuarioAuth().data[0].Documento;
        dtoInactivar.UltimaFechaModif = new Date();
        dtoInactivar.IpModificacion = this.getIp();
        dtoInactivar.estado = 'I';
        const respInactivar = await this.personaService.mantenimientoMaestro(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, dtoInactivar, this.getUsuarioToken());
        if (respInactivar != null) {
          if (respInactivar.success) {
            this.messageShow('success', 'success', this.getMensajeInactivo());
            this.coreBuscar();
          } else {
            this.messageShow('warn', 'Advertencia', this.getMensajeErrorinactivar());
          }
        } else {
          this.messageShow('warn', 'Advertencia', this.getMensajeErrorinactivar());
        }
      },
    });
  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }
  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }
  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "TIPMAPERSONA") {
      this.coreBuscar();
    }
  }
  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {

    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()

    const p1 = this.listarComboEstados();
    const p2 = this.listaComboTipoPersona();
    const p3 = this.listaComboTipoDocumento();
    const p4 = this.listaComboSexo();
    this.ltsExportar = [
      {
        label: "Formato PDF",
        icon: "pi pi-file-pdf",
        command: () => {
          this.exportPdf();
        },
      },
      {
        label: "Formato EXCEL",
        icon: "pi pi-file-excel",
        command: () => {
          this.exportExcel();
        },
      },
    ];
    Promise.all([p1, p2, p3, p4]).then(resp => {

      this.bloquearPag = false;
      this.filtro.Estado = 'A';
      console.log("tipo persona", this.lstTipoPersona);
    });

  }


  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      this.coreBuscar();
    }
  }


  coreBuscar(): void {
    this.dataTableComponent.first = 0;
    this.grillaCargarDatos({ first: this.dataTableComponent.first });

  }


  grillaCargarDatos(event: LazyLoadEvent) {

    if (this.estaVacio(this.filtro.TipoPersona)) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Debe Selecionar el tipo de Persona.' });
      this.myTipoPersona.nativeElement.focus();
      return;
    }

    if (this.estaVacio(this.filtro.Documento) && this.estaVacio(this.filtro.NombreCompleto)) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Debe ingresar N° Documento /o Nombre.' });
      this.myDocumento.nativeElement.focus();
      return;
    }

    this.bloquearPag = true;


    this.personaService.listarpaginado(this.filtro).then((res) => {
      console.log("res:", res);
      this.bloquearPag = false;

      var contado = 1;

      res.forEach(element => {
        let tipoPersonaC: string = '';
        element.numeropersona = contado++;

        if (element.EsCliente == "S") {

          tipoPersonaC = tipoPersonaC + `CLIENTE, `;
        }
        if (element.EsEmpleado == "S") {

          tipoPersonaC = tipoPersonaC + `EMPLEADO, `;
        }
        if (element.EsProveedor == "S") {

          tipoPersonaC = tipoPersonaC + `PROVEEDOR, `;
        }
        if (element.EsOtro == "S") {
          tipoPersonaC = tipoPersonaC + `OTROS`;
        }



        element.tipoPersonaC = tipoPersonaC;
        //element.tipoPersonaC = '';
        //element.desTipoDocumento = element.TipoDocumento == 'D' ? 'DNI' : element.TipoDocumento;

      });

      // if (this.estaVacio(res[0].NombreCompleto)) {
      //   res[0].NombreCompleto = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`

      // }
      this.lstPersona = res;


    });
  }

  listaComboTipoPersona() {
    this.lstTipoPersona.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOPERSONA").forEach(i => {
      this.lstTipoPersona.push({ label: i.Nombre.toUpperCase(), value: i.Codigo })
    });
  }

  listarComboEstados() {
    this.lstEstados.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.lstEstados.push({ label: 'Activo', value: "A" });
    this.lstEstados.push({ label: 'Inactivo', value: "I" });
  }

  listaComboTipoDocumento() {
    this.lstTipoDocumento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPODOCIDENTID").forEach(i => {
      this.lstTipoDocumento.push({ label: i.Nombre.toUpperCase(), value: i.Codigo })
    });
  }

  defaultBuscar(event) {
    if (event.keyCode === 13) {

      this.coreBuscar();
    }
  }


  coreEditar(row: dtoPersona) {

    // this.dto = new dtoPersona();
    // this.verMantPersona=true;
    // const p1= this.listarComboDepartamento();
    // const p2= this.listarComboProvincia(row.DEPARTAMENTO);
    // const p3 =   this.listarComboDistrito(row.DEPARTAMENTO + row.PROVINCIA);
    // Promise.all([p1,p2,p3]).then((resp) => {
    //   console.log("DEPARTAMENTO:",this.lstDepartamento);
    //   console.log("PROVINCIA:",this.lstProvincia);
    //   console.log("DISTRITO:",this.lstDistrito);
    //   this.dto = row;
    //   this.validarflagABooleanCampos(row);
    //   console.log("dto llegando:",this.dto);
    // });
    console.log("editar", row);

    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONA', ''), "EDITAR", 1, row);
  }

  coreVer(row: dtoPersona) {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPMAPERSONA', ''), "VER", 1, row);
  }

  invactivarProduct(product: dtoPersona) {
    Swal.fire({
      title: '¡Mensaje!',
      text: '¿Desea inactivar Codigo: ' + product.Documento + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#094d74',
      cancelButtonColor: '#ffc72f',
      cancelButtonText: '¡No, Cancelar!',
      confirmButtonText: '¡Si, Inactivar!'
    }).then((result) => {
      if (result.isConfirmed) {
        product.Estado = "I";
        return this.personaService.mantenimientoMaestro(3, product, this.getUsuarioToken()).then(
          res => {
            if (res.success) {
              this.toastMensaje(`El Registro Nro. ${product.Persona} fue inactivado`, 'success', 2000)
              this.dialog = false;
            } else {
              Swal.fire({
                icon: 'warning',
                title: '¡Mensaje!',
                text: `${res.message}`
              })
            }
          }
        ).catch(error => error)
      }
    })
  }

  Salirmodal() {
    this.verMantPersona = false;
  }

  listarComboDepartamento(): Promise<number> {
    this.lstDepartamento = [];
    this.lstDepartamento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    let departamento = { Num: 1 }
    return this.personaService.listarUbigeo(departamento).then(res => {
      res.forEach(e => {
        this.lstDepartamento.push({ label: e.Nombre, value: e.Codigo.trim() });
      });
      return 1;
    });
  }


  listarComboProvincia(codigo: string): Promise<number> {
    this.lstProvincia = [];
    this.lstProvincia.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    let provincia = { Num: 2, Codigo: codigo }
    return this.personaService.listarUbigeo(provincia).then(res => {
      res.forEach(e => {
        this.lstProvincia.push({ label: e.Nombre, value: e.Codigo.trim() });
      });
      return 1;
    });
  }

  listarComboDistrito(codigo: string): Promise<number> {
    this.lstDistrito = [];
    this.lstDistrito.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    let distrito = { Num: 3, Codigo: codigo }
    return this.personaService.listarUbigeo(distrito).then(res => {
      res.forEach(e => {
        this.lstDistrito.push({ label: e.Nombre, value: e.Codigo.trim() });
      });
      return 1;
    });

  }


  selectedItemTipoPersona(event) {
    this.selectedPort = event.value; //event.originalEvent.srcElement.innerText;
    if (this.selectedPort == "J") {
      this.filtro.TipoDocumento = "R"
      this.editarTipoDocumento = true;

    } else {
      this.editarTipoDocumento = false;
    }

  }


  enDesarrollo() {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'EN DESARROLLO',
      showConfirmButton: false,
      timer: 1500
    })
  }

  onRowSelect(event: any) {
    console.log("seleccion:", event);
    console.log("Persona onRowSelect:", this.registroSeleccionado);
  }

  listaComboSexo() {
    this.lstSexo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "SEXO").forEach(i => {
      this.lstSexo.push({ label: i.Nombre, value: i.Codigo })
    });
  }
  exportExcel() {
    if (this.lstPersona == null || this.lstPersona == undefined || this.lstPersona.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: ipersona[] = [];
      let contador: number = 0;
      let fechaNacimiento: string;
      let tipoPersonas: string[] = [];
      let tipoPersona: string = '';
      for (var i = 0; i < this.lstPersona.length; i++) {

        contador += 1;
        let fechaInicio = new Date(this.lstPersona[i].FechaNacimiento);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
        let yyyy = fechaInicio.getFullYear()
        fechaNacimiento = dd + "/" + mm + "/" + yyyy;
        //let ubigeo = this.lstPersona[i].Ubigeo!= null?this.lstPersona[i].Ubigeo.split(','):['','',''];

        console.log("tipo persona", this.lstTipoPersona);
        this.lstTipoPersona.forEach((e) => {
          if (this.lstPersona[i].TipoPersona == e.value) {
            this.lstPersona[i].TipoPersona = e.label;

          }

        });
        this.lstSexo.forEach((e) => {
          if (this.lstPersona[i].Sexo == e.value) {
            this.lstPersona[i].Sexo = e.label;

          }
        });
        this.lstTipoDocumento.forEach((e) => {
          if (this.lstPersona[i].TipoDocumento == e.value) {
            this.lstPersona[i].TipoDocumento = e.label;
          }
        });
        this.lstEstados.forEach((e) => {
          if (this.lstPersona[i].Estado == e.value) {
            this.lstPersona[i].Estado = e.label;
          }
        });
        // if (this.lstPersona[i].EsCliente == "S") {
        //   tipoPersonas.push("CLIENTE");
        // }
        // if (this.lstPersona[i].EsEmpleado == "S") {
        //   tipoPersonas.push("EMPLEADO");
        // }
        // if (this.lstPersona[i].EsProveedor == "S") {
        //   tipoPersonas.push("PROVEEDOR");
        // }
        // if (this.lstPersona[i].EsOtro == "S") {
        //   tipoPersonas.push("OTROS");
        // }

        // tipoPersonas.forEach((e) => {
        //   tipoPersona = `${e}, ${tipoPersona}`;
        // });

        let itemExportar: ipersona = {
          NUM: contador,
          ID: this.lstPersona[i].Persona,
          PERSONA: this.lstPersona[i].TipoPersona?.toUpperCase() || '',
          SEXO: this.lstPersona[i].Sexo?.toUpperCase() || '',
          TIPO_DOCUMENTO: this.lstPersona[i].TipoDocumento?.toUpperCase() || '',
          N_DOCUMENTO: this.lstPersona[i].Documento?.toUpperCase() || '',
          RUC: this.lstPersona[i].DocumentoFiscal?.toUpperCase() || '',
          NOMBRE: this.lstPersona[i].Nombres?.toUpperCase() || '',
          A_PATERNO: this.lstPersona[i].ApellidoPaterno?.toUpperCase() || '',
          A_MATERNO: this.lstPersona[i].ApellidoMaterno?.toUpperCase() || '',
          FECHA_NACIMIENTO: fechaNacimiento,
          EDAD: this.lstPersona[i].Edad,
          TIPO_PERSONA: this.lstPersona[i].tipoPersonaC.toUpperCase() || '',
          TELEFONO_1: this.lstPersona[i].Telefono?.toUpperCase() || '',
          TELEFONO_2: this.lstPersona[i].Celular?.toUpperCase() || '',
          EMAIL: this.lstPersona[i].CorreoElectronico?.toUpperCase() || '',
          DIRECCION: this.lstPersona[i].Direccion?.toUpperCase() || '',
          ESTADO: this.lstPersona[i].Estado?.toUpperCase() || '',
          REFERENCIA: this.lstPersona[i].DireccionReferencia?.toUpperCase() || '',
          UBIGEO: this.lstPersona[i].DescUbigeo?.toUpperCase() || '',
          COMENTARIO: this.lstPersona[i].Comentario?.toUpperCase() || ''
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      }
      this.exportarService.exportExcel(this.lstPersona, listaExportar, "Personas");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });
    }
    this.coreBuscar();
  }



  exportPdf() {
    if (this.lstPersona == null || this.lstPersona == undefined || this.lstPersona.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {

      var col = [[
        "NUM",
        //"ID",
        // "PERSONA",
        // "SEXO",


        // "RUC",
        "NOMBRE",
        "TIPO_DOCUMENTO",
        "N_DOCUMENTO",
        "ESTADO",
        "TELEFONO",
        "EMAIL",
        //"UBIGEO",
        "TIPO_PERSONA"
        // "A_PATERNO",
        // "A_MATERNO",
        // "FECHA_NACIMIENTO",
        // "EDAD",

        // "TELEFONO_2",

        // "DIRECCION",

        // "REFERENCIA",

        //"COMENTARIO",
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaNacimiento: string;
      let tipoPersonas: string[] = [];
      let tipoPersona: string = '';
      for (var i = 0; i < this.lstPersona.length; i++) {

        contador += 1;
        let fechaInicio = new Date(this.lstPersona[i].FechaNacimiento);
        let dd = ("0" + fechaInicio.getDate()).slice(-2);
        let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);
        let yyyy = fechaInicio.getFullYear()
        fechaNacimiento = dd + "/" + mm + "/" + yyyy;
        //let ubigeo = this.lstPersona[i].Ubigeo!= null?this.lstPersona[i].Ubigeo.split(','):['','',''];

        console.log("tipo persona", this.lstTipoPersona);
        this.lstTipoPersona.forEach((e) => {
          if (this.lstPersona[i].TipoPersona == e.value) {
            this.lstPersona[i].TipoPersona = e.label;

          }

        });
        this.lstSexo.forEach((e) => {
          if (this.lstPersona[i].Sexo == e.value) {
            this.lstPersona[i].Sexo = e.label;

          }
        });
        this.lstTipoDocumento.forEach((e) => {
          if (this.lstPersona[i].TipoDocumento == e.value) {
            this.lstPersona[i].TipoDocumento = e.label;
          }
        });
        this.lstEstados.forEach((e) => {
          if (this.lstPersona[i].Estado == e.value) {
            this.lstPersona[i].Estado = e.label;
          }
        });

        if (this.lstPersona[i].EsCliente == "S") {
          tipoPersonas.push("CLIENTE");
        }
        if (this.lstPersona[i].EsEmpleado == "S") {
          tipoPersonas.push("EMPLEADO");
        }
        if (this.lstPersona[i].EsProveedor == "S") {
          tipoPersonas.push("PROVEEDOR");
        }
        if (this.lstPersona[i].EsOtro == "S") {
          tipoPersonas.push("OTROS");
        }

        tipoPersonas.forEach((e) => {
          tipoPersona = `${e}, ${tipoPersona}`;
        });

        let itemExportar = [
          contador,
          this.lstPersona[i].NombreCompleto?.toUpperCase() || '',
          this.lstPersona[i].TipoDocumento?.toUpperCase() || '',
          this.lstPersona[i].Documento?.toUpperCase() || '',
          this.lstPersona[i].Estado?.toUpperCase() || '',
          this.lstPersona[i].Telefono?.toUpperCase() || '',
          this.lstPersona[i].CorreoElectronico?.toUpperCase() || '',
          // this.lstPersona[i].Persona,
          // this.lstPersona[i].Sexo?.toUpperCase() || '',
          // this.lstPersona[i].TipoDocumento?.toUpperCase() || '',
          // this.lstPersona[i].Documento?.toUpperCase() || '',
          // this.lstPersona[i].DocumentoFiscal?.toUpperCase() || '',
          // this.lstPersona[i].Nombres?.toUpperCase() || '',
          // this.lstPersona[i].ApellidoPaterno?.toUpperCase() || '',
          // this.lstPersona[i].ApellidoMaterno?.toUpperCase() || '',
          // fechaNacimiento,
          // this.lstPersona[i].Edad,
          // tipoPersona?.toUpperCase() || '',
          // this.lstPersona[i].Telefono?.toUpperCase() || '',
          // this.lstPersona[i].Celular?.toUpperCase() || '',
          // this.lstPersona[i].CorreoElectronico?.toUpperCase() || '',
          // this.lstPersona[i].Direccion?.toUpperCase() || '',
          // this.lstPersona[i].Estado?.toUpperCase() || '',
          //this.lstPersona[i].DireccionReferencia?.toUpperCase() || '',
          // this.lstPersona[i].DescUbigeo?.toUpperCase() || '',
          this.lstPersona[i].TipoPersona?.toUpperCase() || '',
          // this.lstPersona[i].Comentario?.toUpperCase() || ''

        ];
        rows.push(itemExportar);
      };

      this.exportarService.ExportPdf(this.lstPersona, col, rows, "Persona.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }
    this.coreBuscar();
  }
}
