import { Image } from './../../dominio/dto/image';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../../util/ComponenteBasePrincipa';
import { ConstanteAngular } from '../../../../../@theme/ConstanteAngular';
import { PersonaService } from '../../../../framework-comun/Persona/servicio/persona.service';
import { DtoCompaniamast } from '../../dominio/dto/DtoCompaniamast';
import { MaestrocompaniaMastService } from '../../servicio/maestrocompania-mast.service';
import { PersonaBuscarComponent } from '../../../../framework-comun/Persona/components/persona-buscar.component';
import { MensajeController } from '../../../../../../util/MensajeController';
import { EmpresaBuscarComponent } from '../../../../framework-comun/Empresa/view/empresa-buscar.component';
import { FiltroCompaniamast } from '../../dominio/filtro/FiltroCompaniamast';
import { PersonaMantenimientoComponent } from '../../../../framework-comun/Persona/vista/persona-mantenimiento.component';
import Swal from 'sweetalert2';
import { JsonpClientBackend } from '@angular/common/http';
import { LotesImagenComponent } from '../../../../proyecto/Lotes/lotes-imagen/lotes-imagen.component';

@Component({
  selector: 'ngx-companiamast-mantenimiento',
  templateUrl: './companiamast-mantenimiento.component.html',
  styleUrls: ['./companiamast-mantenimiento.component.scss']
})
export class CompaniamastMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy {
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;
  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(EmpresaBuscarComponent, { static: false }) empresaBuscarComponent: EmpresaBuscarComponent;
  @ViewChild(LotesImagenComponent, { static: false })
  lotesImagenComponent: LotesImagenComponent;

  lstEstados: SelectItem[] = [];
  lstDepartamento: SelectItem[] = [];
  lstProvincia: SelectItem[] = [];
  lstDistrito: SelectItem[] = [];
  bloquearPag: boolean;
  validarform: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  dto: DtoCompaniamast = new DtoCompaniamast();
  acciones: string = '';
  position: string = 'top';
  selectedDepartamento = "";
  imagenEnviar: Image;
  nombrearchivo: string;
  file: File = null;
  filtro: FiltroCompaniamast = new FiltroCompaniamast();
  editarCampoEmpresa: boolean = false;
  editarrepresen: boolean = false;

  displayBasic: boolean;

  displayBasic2: boolean;

  displayCustom: boolean;

  activeIndex: number = 0;

  constructor(
    private messageService: MessageService,
    private personaService: PersonaService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
  ) {
    super();
  }
  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }

  ngOnInit(): void {

    const p1 = this.listarComboDepartamento();

    Promise.all([p1]).then(resp => {
      /*       this.photoService.getImages().then((images) => {
              this.images = images;
          }); */

    });

  }

  // iniciarComponenteMaestro(dto: any, accion: string, titulo) {

  async iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any) {
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    console.log("COMPAÑIA", rowdata);
    this.btnCerrar();
    this.dto = new DtoCompaniamast();
    this.fechaModificacion = undefined;
    if (this.validarform == "NUEVO") {
      const p0 = this.cargarEstados();
      Promise.all([p0]).then((resp) => {
        this.dto.Estado = 'A';
        this.puedeEditar = false;
        this.editarCampoEmpresa = false;
        this.editarrepresen = false;
        this.fechaCreacion = new Date();
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
      });
    } else if (this.validarform == "EDITAR") {
      this.puedeEditar = false;
      this.bloquearPag = true;
      this.editarCampoEmpresa = false;
      this.editarrepresen = false;
      const p0 = this.cargarEstados();
      const p1 = this.listarComboDepartamento();
      const p2 = this.listarComboProvincia(rowdata.CodDep);
      const p3 = this.listarComboDistrito(rowdata.CodDep + rowdata.CodPro);
      Promise.all([p0, p1, p2, p3]).then((resp) => {
        console.log("DEPARTAMENTO:", this.lstDepartamento);
        console.log("PROVINCIA:", this.lstProvincia);
        console.log("DISTRITO:", this.lstDistrito);
        this.filtro.companiacodigo = rowdata.CompaniaCodigo;
        this.maestrocompaniaMastService.listarCompaniaMast(this.filtro).then((res) => {
          this.bloquearPag = false;
          if (res != null) {
            this.dto = res[0];
            this.fechaModificacion = new Date();
            // this.fechaCreacion = new Date(res[0].FechaCreacion);
            if (res[0].FechaCreacion == null || res[0].FechaCreacion == undefined) {
              this.fechaCreacion = undefined;
            } else {
              this.fechaCreacion = new Date(res[0].FechaCreacion);
            }
            this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

            if (!this.estaVacio(res[0].DescripcionCorta)) {
              this.dto.DescripcionCorta = res[0].DescripcionCorta.trim();
            }
            if (!this.estaVacio(res[0].RepresentanteLegal)) {
              this.dto.RepresentanteLegal = res[0].RepresentanteLegal.trim();
            }
            if (!this.estaVacio(res[0].DireccionComun)) {
              this.dto.DireccionComun = res[0].DireccionComun.trim();
            }
            if (!this.estaVacio(res[0].DireccionAdicional)) {
              this.dto.DireccionAdicional = res[0].DireccionAdicional.trim();
            }
            if (!this.estaVacio(res[0].Telefono1)) {
              this.dto.Telefono1 = res[0].Telefono1.trim();
            }
            if (!this.estaVacio(res[0].DocumentoFiscal)) {
              this.dto.DocumentoFiscal = res[0].DocumentoFiscal.trim();
            }
            let dto = {
              Documento: this.dto.RUC.trim(),
              tipopersona: "J",
              TipoDocumento: "R",
              Estado: "A"
            }
            this.bloquearPag = true;
            this.personaService.listarpaginado(dto).then((res) => {
              this.bloquearPag = false;
              if (res.length > 0) {
                this.dto.Persona = res[0].Persona;
                this.dto.personadoc = res[0].Documento.trim();
                this.dto.DescripcionCorta = res[0].NombreCompleto.trim();
              } else {
                this.dto.Persona = null;
                this.dto.personadoc = null;
                this.dto.DescripcionCorta = null;
                this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
                return;
              }
            });

            let Documento = {
              Documento: this.dto.DocumentoFiscal.trim(),
              tipopersona: "P",
              SoloBeneficiarios: "0",
              UneuNegocioId: "0"
            }
            this.bloquearPag = true;
            return this.personaService.listaPersonaUsuario(Documento).then((res) => {
              this.bloquearPag = false;
              this.dto.RepresentanteLegal = res[0].NombreCompleto;
            }).catch(error => error);

          }


        });
      });
      let filtroImg: Image = new Image();
      filtroImg.Tabla = 'COMPANY';
      filtroImg.IdTabla = rowdata.Persona;
      const imagenObtenida: Image = await this.getImagenes(filtroImg);
      this.imagenEnviar = imagenObtenida;
      console.log("imagenEnviar", this.imagenEnviar);

      this.dto.DetraccionCuentaBancaria = await imagenObtenida.NombrePDF;
    } else if (this.validarform == "VER") {
      this.puedeEditar = true;
      this.editarCampoEmpresa = true;
      this.editarrepresen = true;
      this.bloquearPag = true;
      const p0 = this.cargarEstados();
      const p1 = this.listarComboDepartamento();
      const p2 = this.listarComboProvincia(rowdata.CodDep);
      const p3 = this.listarComboDistrito(rowdata.CodDep + rowdata.CodPro);
      Promise.all([p0, p1, p2, p3]).then((resp) => {
        console.log("DEPARTAMENTO:", this.lstDepartamento);
        console.log("PROVINCIA:", this.lstProvincia);
        console.log("DISTRITO:", this.lstDistrito);
        this.filtro.companiacodigo = rowdata.CompaniaCodigo;
        this.maestrocompaniaMastService.listarCompaniaMast(this.filtro).then((res) => {
          this.bloquearPag = false;
          if (res != null) {
            this.dto = res[0];
            this.fechaModificacion = new Date();
            // this.fechaCreacion = new Date(res[0].FechaCreacion);
            if (res[0].FechaCreacion == null || res[0].FechaCreacion == undefined) {
              this.fechaCreacion = undefined;
            } else {
              this.fechaCreacion = new Date(res[0].FechaCreacion);
            }
            this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();

            if (!this.estaVacio(res[0].DescripcionCorta)) {
              this.dto.DescripcionCorta = res[0].DescripcionCorta.trim();
            }
            if (!this.estaVacio(res[0].RepresentanteLegal)) {
              this.dto.RepresentanteLegal = res[0].RepresentanteLegal.trim();
            }
            if (!this.estaVacio(res[0].DireccionComun)) {
              this.dto.DireccionComun = res[0].DireccionComun.trim();
            }
            if (!this.estaVacio(res[0].DireccionAdicional)) {
              this.dto.DireccionAdicional = res[0].DireccionAdicional.trim();
            }
            if (!this.estaVacio(res[0].Telefono1)) {
              this.dto.Telefono1 = res[0].Telefono1.trim();
            }
            if (!this.estaVacio(res[0].DocumentoFiscal)) {
              this.dto.DocumentoFiscal = res[0].DocumentoFiscal.trim();
            }
            let dto = {
              Documento: this.dto.RUC.trim(),
              tipopersona: "J",
              TipoDocumento: "R",
              Estado: "A"
            }
            this.bloquearPag = true;
            this.personaService.listarpaginado(dto).then((res) => {
              this.bloquearPag = false;
              if (res.length > 0) {
                this.dto.Persona = res[0].Persona;
                this.dto.personadoc = res[0].Documento.trim();
                this.dto.DescripcionCorta = res[0].NombreCompleto.trim();
              } else {
                this.dto.Persona = null;
                this.dto.personadoc = null;
                this.dto.DescripcionCorta = null;
                this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
                return;
              }
            });

            let Documento = {
              Documento: this.dto.DocumentoFiscal.trim(),
              tipopersona: "P",
              SoloBeneficiarios: "0",
              UneuNegocioId: "0"
            }
            this.bloquearPag = true;
            return this.personaService.listaPersonaUsuario(Documento).then((res) => {
              this.bloquearPag = false;
              this.dto.RepresentanteLegal = res[0].NombreCompleto;
            }).catch(error => error);

          }


        });
      });
      let filtroImg: Image = new Image();
      filtroImg.Tabla = 'COMPANY';
      filtroImg.IdTabla = rowdata.Persona;
      const imagenObtenida: Image = await this.getImagenes(filtroImg);
      this.imagenEnviar = imagenObtenida;
      console.log("imagenEnviar", this.imagenEnviar);

      this.dto.DetraccionCuentaBancaria = await imagenObtenida.NombrePDF;

    }
   
  }

  cargarEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });
  }
  
  async coreVerImagen(row) {
    this.bloquearPag = true;
    console.log("imagenEnviar get", this.imagenEnviar);
    if (this.imagenEnviar != null || this.imagenEnviar != undefined) {
      if (this.validarform == 'NUEVO') {
        this.imagenEnviar = {
          NombrePDF: this.dto.DetraccionCuentaBancaria,
          Tipo: this.dto.DescripcionLarga,
          Contenido: this.dto.DescripcionPSF
        }
      }
      console.log('TRAIDAAAA', this.imagenEnviar);
      this.lotesImagenComponent.iniciarComponenteMaestro(new MensajeController(this, "SELECTOR_LOTE", ""), "VER",
      this.objetoTitulo.menuSeguridad.titulo, [this.imagenEnviar]);
    } else {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Imagen no obtenida' });
    }
    this.bloquearPag = false;
  }



  arrayBufferToBase64(buffer: any) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }





  async coreGuardar() {


    this.filtro = new FiltroCompaniamast();
    const companias: DtoCompaniamast[] = await this.maestrocompaniaMastService.listarCompaniaMast(this.filtro);
    let accionGuardar: string;
    for (var i = 0; i < companias.length; i++) {
      if (companias[i].RUC == this.dto.personadoc) {
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: "Ya existe una compañia con la misma razón social." });
        this.bloquearPag = false;
        return;
      }
    }


    if (this.estaVacio(this.dto.personadoc)) { this.messageShow('warn', 'Advertencia', 'Seleccione una razón social válida'); return; }
    if (this.estaVacio(this.dto.DocumentoFiscal)) { this.messageShow('warn', 'Advertencia', 'Seleccione un representante válido'); return; }

    //validar correo
    if (!this.estaVacio(this.dto.DireccionAdicional)) {
      if (!this.validarCorreo(this.dto.DireccionAdicional)) { this.messageShow('warn', 'Advertencia', 'Ingrese un correo valido.'); return; }
    }

    if (this.estaVacio(this.dto.Estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione un estado válido'); return; }

    this.bloquearPag = true;
    this.dto.Grupo = this.dto.CodDep + "" + this.dto.CodPro + "" + this.dto.CodDis;
    console.log("grupo:", this.dto.Grupo);
    if (this.validarform == "NUEVO") {
      this.bloquearPag = true;
      this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario.trim();
      this.dto.FechaCreacion = this.fechaCreacion;
      this.maestrocompaniaMastService.mantenimientoMaestro(1, this.dto, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          console.log("registrado:", res);
          if (res != null) {
            this.dialog = false;
            if (res.success) {
              accionGuardar = this.validarform;
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
              this.messageShow('success', 'Creada', 'Creación exitosa');
            } else {
              this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
            }
          }
        });

    } else if (this.validarform == "EDITAR") {
      this.dto.UltimaFechaModif = this.fechaModificacion;
      this.bloquearPag = true;
      this.maestrocompaniaMastService.mantenimientoMaestro(2, this.dto, this.getUsuarioToken()).then(
        res => {
          this.bloquearPag = false;
          if (res != null) {
            this.dialog = false;
            console.log("registrado:", res);
            if (res.mensaje == "Ok") {
              accionGuardar = this.validarform;
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            } else {
              this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
            }
          }

        });
    }

    if (this.dto.DescripcionPSF != null || this.dto.DescripcionPSF != undefined) {
      if (this.dto.DescripcionPSF.length > 0) {
        const Archivo = {
          Id: 0,
          Tabla: "COMPANY",
          IdTabla: this.dto.Persona,
          Linea: 1,
          NombrePDF: this.dto.DetraccionCuentaBancaria, //name
          Contenido: this.dto.DescripcionLarga, //type
          Estado: 1,
          UsuarioCreacion: this.dto.UsuarioCreacion,
          UsuarioModificacion: this.dto.UltimoUsuario,
          FechaCreacion: this.dto.FechaCreacion,
          FechaModificacion: this.dto.UltimaFechaModif
        };

        console.log("coreGuardar Mantenimientofile:", Archivo);

        let ViewModalExite = {
          success: "true",
          valor: "1",
          tokem: this.dto.DetraccionCuentaBancaria,
          mensaje: this.dto.DescripcionPSF,
          Archivo: this.file,
          data: Archivo
        }

        console.log("coreGuardar ViewModalExite:", ViewModalExite);    
          this.maestrocompaniaMastService.Mantenimientofile(1, ViewModalExite, this.getUsuarioToken()).then(
            res => {
              this.bloquearPag = false;
              console.log("Mantenimientofile res", res);

              if (res != null) {
                this.dialog = false;          
                if (res.success) {
                  console.log("Mantenimientofile res   LLEGO", res);
                  if (accionGuardar == 'NUEVO') {
                    this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Se registró con éxito.' });
                  } else if (accionGuardar == 'EDITAR') {
                    this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Se actualizó con éxito.' });
                  }
                  this.mensajeController.resultado = res;
                  this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
                } else {
                  this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
                }
              }
            });
       

      }
    }
  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }
  listarComboDepartamento(): Promise<number> {
    this.lstDepartamento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    let departamento = { Num: 1 }
    return this.personaService.listarUbigeo(departamento).then(res => {
      res.forEach(e => {
        this.lstDepartamento.push({ label: e.Nombre, value: e.Codigo });
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
        this.lstProvincia.push({ label: e.Nombre, value: e.Codigo });
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
        this.lstDistrito.push({ label: e.Nombre, value: e.Codigo });
      });
      return 1;
    });
  }

  selectedItemDepartamento(event) {
    this.selectedDepartamento = event.value;
    this.lstProvincia = []
    this.lstDistrito = []
    this.listarComboProvincia(event.value);
  }

  selectedItemProvincia(event) {
    this.listarComboDistrito(this.selectedDepartamento + event.value);
  }


  verSelectorRuc() {
    this.empresaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECEMPRESA', 'BUSCAR'), 'BUSCAR');
  }

  verSelectorDocumento() {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPACIENTE', 'BUSCAR'), 'BUSCAR', "N");
  }


  coreMensaje(mensage: MensajeController): void {
    console.log("data llegando mantenimiento:", mensage.resultado);
    if (mensage.componente == "SELECEMPRESA") {
      this.dto.Persona = mensage.resultado.Persona;
      this.dto.personadoc = mensage.resultado.Documento;
      this.dto.DescripcionCorta = mensage.resultado.NombreCompleto;
    } else if (mensage.componente == "SELECPACIENTE") {
      this.dto.DocumentoFiscal = mensage.resultado.Documento;
      this.dto.RepresentanteLegal = mensage.resultado.NombreCompleto;
    }
  }

  limpiarDocumento() {
    this.dto.DocumentoFiscal = null;
    this.dto.RepresentanteLegal = null;
    this.editarrepresen = false;
  }

  limpiarEmpresaRUC() {
    this.dto.Persona = null;
    this.dto.personadoc = null;
    this.dto.DescripcionCorta = null;
    this.editarCampoEmpresa = false;
  }


  crearPersonaEmpresa() {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGEMPRESA', ''), 'NUEVO', 2);
  }

  crearPersonaRepresentate() {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGEMPRESA', ''), 'NUEVO', 1);
  }


  //validar para solo buscar RUC --> se igualo a "R"
  validarEnterEmpresa(evento) {
    if (evento.key == "Enter") {
      if (this.dto.personadoc == null) {
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Debe Ingresar el Documento Empresa.' });
        return;
      }
      else if (this.dto.personadoc.trim().length == 11 || this.dto.personadoc == "0") {
        let dto = {
          Documento: this.dto.personadoc.trim(),
          tipopersona: "J",
          TipoDocumento: "R",
          Estado: "A"
        }
        this.bloquearPag = true;
        this.personaService.listarpaginado(dto).then((res) => {
          console.log("entro a traer ruc:", res);
          this.bloquearPag = false;
          if (res.length > 0) {
            this.dto.DescripcionCorta = res[0].NombreCompleto;
            this.dto.Persona = res[0].Persona;
            this.editarCampoEmpresa = true;
          } else {
            this.dto.personadoc = null;
            this.dto.DescripcionCorta = null;
            this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
            return;
          }
        });
      } else {
        this.dto.personadoc = null;
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
        return;
      }
    }
  }


  validarTeclaEnterRepresentante(evento) {
    if (evento.key == "Enter") {
      if (this.dto.DocumentoFiscal == null) {
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Ingrese un Nro. de documento.' });
        return;
      }
      else if (this.dto.DocumentoFiscal.trim().length >= 5) {
        let Documento = {
          Documento: this.dto.DocumentoFiscal.trim(),
          tipopersona: "P",
          SoloBeneficiarios: "0",
          UneuNegocioId: "0"
        }
        this.bloquearPag = true;
        return this.personaService.listaPersonaUsuario(Documento).then((res) => {
          this.bloquearPag = false;
          if (this.esListaVacia(res)) {
            this.dto.DocumentoFiscal = null;
            this.dto.RepresentanteLegal = null;
            this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
            return;
          }
          else if (res[0].hasOwnProperty("Documento")) {
            if (this.estaVacio(res[0].NombreCompleto)) {
              this.dto.RepresentanteLegal = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`;
              this.editarrepresen = true;
            } else {
              this.dto.RepresentanteLegal = res[0].NombreCompleto;
              this.editarrepresen = true;
            }
          } else {
            this.dto.DocumentoFiscal = null;
            this.dto.RepresentanteLegal = null;
            this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
            return;
          }
        }).catch(error => error);
      } else {
        this.dto.DocumentoFiscal = null;
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
        return;
      }
    }
  }

  subirArchivo(fs: any) {
    fs.click();
    console.log("nombre archivo:", fs);
  }

  capturarImg(event: any): any {

  }
 

  exportar(event: any) {
    const img = event.target.files;
    const files = event.target.files;
    this.file = <File>files[0];
    console.log('evento', this.file);
    const reader = new FileReader();
    reader.onloadend = () => {
      let base = reader.result as string;

      img[0].type
      if (img[0].type.split("/")[0] != 'image') {
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'El archivo no es una imagen' });
        return
      }
      if (img[0].size > 1048576) {
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'El archivo es demasiado grande.' });
        return
      } else {
        this.dto.DetraccionCuentaBancaria = img[0].name;
        this.dto.DescripcionLarga = img[0].type;
        this.dto.DescripcionPSF = base.split('base64,')[1];
        console.log("this.dto:", this.dto)
      }
    };
    reader.readAsDataURL(img[0]);

  }


  eliminarImagen() {

      // this.dto.DetraccionCuentaBancaria = null;
      // this.dto.DescripcionLarga = null;
      // this.dto.DescripcionPSF = null;
      // this.file = null;
    
    //this.enviarImagen = this.enviarImagen.filter((e) => e.ubicacion != ubicacion);
   
  }

  // imageClick(index: number) {
  //   this.activeIndex = index;
  //   this.displayCustom = true;
  // }

  async getImagenes(filtroImg: Image): Promise<Image> {
    filtroImg.Estado = 1
    const imagenes: Image[] = await this.maestrocompaniaMastService.MantenimientoFileVer(filtroImg, this.getUsuarioToken());
    if (filtroImg.IdTabla == undefined || filtroImg.IdTabla == null) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Imagen no obtenida' });
    }
    console.log("WAKANDA FOREVER", imagenes);
    return imagenes[0];
  }


  esTelefesCeluValido(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /^[0-9]/;
    if (!regex.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }

  btnCerrar() {
    this.lstProvincia = [];
    this.lstDistrito = [];

    this.lstProvincia.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstDistrito.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    this.fechaCreacion = undefined;
    this.fechaModificacion = undefined;
  }

}
