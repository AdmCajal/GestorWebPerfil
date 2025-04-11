import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api/selectitem';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { FiltroWcoSede } from '../../../maestros/Sedes/dominio/filtro/FiltroWcoSede';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { PersonaBuscarComponent } from '../../../framework-comun/Persona/components/persona-buscar.component';
import { PersonaMantenimientoComponent } from '../../../framework-comun/Persona/vista/persona-mantenimiento.component';
import { DtoPrograma } from '../model/DtoPrograma';
import { ProgramaService } from '../service/programa.service';
import { FiltroPrograma } from '../model/FiltroPrograma';
import { string32 } from 'pdfjs-dist/types/src/shared/util';

@Component({
  selector: 'ngx-programa-mantenimiento',
  templateUrl: './programa-mantenimiento.component.html',
  styleUrls: ['./programa-mantenimiento.component.scss']
})

export class ProgramaMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {

  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  @ViewChild(PersonaMantenimientoComponent, { static: false }) personaMantenimientoComponent: PersonaMantenimientoComponent;
  bloquearPag: boolean;
  validarform: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  acciones: string = ''
  position: string = 'top'
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  lstCompania: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstDepartamento: SelectItem[] = [];
  lstProvincia: SelectItem[] = [];
  lstDistrito: SelectItem[] = [];
  editarrepresen: boolean = false;
  lstMoneda: SelectItem[] = [];
  dto: DtoPrograma = new DtoPrograma();
  selectedDepartamento = "";
  filtro: FiltroPrograma = new FiltroPrograma();


  constructor(
    private personaService: PersonaService,
    private maestroSucursalService: MaestroSucursalService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private messageService: MessageService,
    private programaService: ProgramaService,
    private confirmationService: ConfirmationService) {

    super();

  }

  ngOnInit(): void {

    const p0 = this.cargarMoneda();
    const p1 = this.cargarCombocompania();
    const p2 = this.listarComboEstados();
    const p3 = this.listarComboDepartamento();
    const p4 = this.listarComboProvincia('14');
    const p5 = this.listarComboDistrito('01');


    Promise.all([p0, p1, p2, p3, p4, p5]).then(
      f => {
        this.dto.Departamento = '14';
        this.dto.Provincia = '01';
        this.dto.Distrito = '1';
      });

  }

  MontoTotalEvnArea(event): void {
    this.dto.MontoTotal = 0;
    if (this.dto.Precio == undefined || this.dto.Precio == 0 || this.dto.Precio == null) {
      this.dto.MontoTotal = 0;
    } else {
      this.dto.MontoTotal = Math.round(this.dto.Precio * this.dto.Area);
    }
    console.log('Monto Total de Area', this.dto.MontoTotal);
  }
  MontoTotalEvnPrecio(event): void {
    console.log('Precio', event.srcElement.value);
    if (this.dto.Area == undefined || this.dto.Area == 0 || this.dto.Area == null) {
      this.dto.MontoTotal = 0;
    } else {
      // let precioValue: string = event.srcElement.value;
      // let preciofiltrado: string[] = precioValue.toString().split(',');
      // let precio: string = "";
      // preciofiltrado.forEach(function (e) {
      //   console.log('aprecio', e);
      //   precio += e;
      // });
      // console.log('array de precio', precio);

      this.dto.MontoTotal = Math.round(this.dto.Area * this.dto.Precio);
    }
    console.log('Monto Total de Precio', this.dto.MontoTotal);
  }

  formatoNumerico(numero): number {
    let array: string[] = numero.toString().split(',');
    let valor: string = "";
    array.forEach(function (e) {
      console.log('aprecio', e);
      valor += e;
    });
    return +valor;
  }

  coreMensaje(mensage: MensajeController): void {
    console.log("data llegando mantenimiento:", mensage.resultado);
    if (mensage.componente == "SELECPROMOTOR") {
      this.dto.IdPromotor = mensage.resultado.Persona;
      this.dto.Documento = mensage.resultado.Documento;
      this.dto.NombreCompleto = mensage.resultado.NombreCompleto;


    }
  }


  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any,) {
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.bloquearPag = true;
    this.dto = new DtoPrograma();
    this.fechaModificacion = undefined;
    if (this.validarform == "NUEVO") {
      this.lstSucursal = [];
      this.lstPrograma = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

      const p5 = this.listarComboProvincia('14');
      const p6 = this.listarComboDistrito('1401');
      Promise.all([p5, p6]).then((resp) => {
        this.dto.Estado = 1;
        this.dto.MonedaCodigo = "EX";
        this.dto.Departamento = '14';
        this.dto.Provincia = '01';
        this.dto.Distrito = '05';
        this.puedeEditar = false;
        this.editarrepresen = false;
        this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
        this.fechaCreacion = new Date();
        this.dto.FechaRegistro = new Date();
        this.bloquearPag = false;


      });

    }
    else if (this.validarform == "EDITAR") {
      console.log("DTO EDITAR", rowdata);

      console.log(rowdata.Ubigeo.substring(0, 2));
      console.log(rowdata.Ubigeo.substring(0, 4));

      const p5 = this.listarComboProvincia(rowdata.Ubigeo.substring(0, 2));
      const p6 = this.listarComboDistrito(rowdata.Ubigeo.substring(0, 4));
      const p7 = this.cargarSucursalEditar(rowdata.CompaniaCodigo);
      Promise.all([p5, p6, p7]).then((resp) => {
        this.filtro.IdProyecto = rowdata.IdProyecto;
        this.bloquearPag = true;
        this.programaService.listarPrograma(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.puedeEditar = false;
          this.editarrepresen = false;
          console.log("EDITAR REST :", res);
          this.dto = res[0];


          if (res[0].Ubigeo != null) {
            this.dto.Departamento = res[0].Ubigeo.substring(0, 2);
            this.dto.Provincia = res[0].Ubigeo.substring(2, 4);
            this.dto.Distrito = res[0].Ubigeo.substring(4, 6);
          }
          this.dto.CompaniaCodigo = res[0].CompaniaCodigo.trim();
          if (res[0].FechaModificacion == null || res[0].FechaModificacion == undefined) {
            this.fechaModificacion == undefined;
          } else {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }

          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
          let Documento = {
            Documento: this.dto.Documento.trim(),
            tipopersona: "P",
            SoloBeneficiarios: "0",
            UneuNegocioId: "0"
          }
          this.bloquearPag = true;

          this.dto.promotordesc = res[0].NombreCompleto;

          return this.personaService.listaPersonaUsuario(Documento).then((res) => {
            this.bloquearPag = false;
            this.dto.promotordesc = res[0].NombreCompleto;
          }).catch(error => error);





        });
      });
    } else if (this.validarform == "VER") {
      console.log("DTO EDITAR", rowdata);

      console.log(rowdata.Ubigeo.substring(0, 2));
      console.log(rowdata.Ubigeo.substring(0, 4));

      const p5 = this.listarComboProvincia(rowdata.Ubigeo.substring(0, 2));
      const p6 = this.listarComboDistrito(rowdata.Ubigeo.substring(0, 4));
      const p7 = this.cargarSucursalEditar(rowdata.CompaniaCodigo);
      Promise.all([p5, p6, p7]).then((resp) => {
        this.filtro.IdProyecto = rowdata.IdProyecto;
        this.bloquearPag = true;
        this.programaService.listarPrograma(this.filtro).then((res) => {
          this.bloquearPag = false;
          this.puedeEditar = true;
          this.editarrepresen = false;
          console.log("VER REST :", res);
          this.dto = res[0];


          if (res[0].Ubigeo != null) {
            this.dto.Departamento = res[0].Ubigeo.substring(0, 2);
            this.dto.Provincia = res[0].Ubigeo.substring(2, 4);
            this.dto.Distrito = res[0].Ubigeo.substring(4, 6);
          }
          this.dto.CompaniaCodigo = res[0].CompaniaCodigo.trim();
          if (res[0].FechaModificacion == null || res[0].FechaModificacion == undefined) {
            this.fechaModificacion == undefined;
          } else {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }

          if (res[0].FechaModificacion != null || res[0].FechaModificacion != undefined) {
            this.fechaModificacion = new Date(res[0].FechaModificacion);
          }
          // this.fechaModificacion = new Date(res[0].FechaModificacion);
          this.fechaCreacion = new Date(res[0].FechaCreacion);
          this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
          let Documento = {
            Documento: this.dto.Documento.trim(),
            tipopersona: "P",
            SoloBeneficiarios: "0",
            UneuNegocioId: "0"
          }
          this.bloquearPag = true;

          this.dto.promotordesc = res[0].NombreCompleto;

          return this.personaService.listaPersonaUsuario(Documento).then((res) => {
            this.bloquearPag = false;
            this.dto.promotordesc = res[0].NombreCompleto;
          }).catch(error => error);
        });
      });
    }
  }

  listarComboEstados() {
    this.lstEstados = [];
    let label: string;
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      label = i.Nombre.trim();
      this.lstEstados.push({ label: label.toUpperCase(), value: i.IdCodigo })
    });
  }

  cargarCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
      console.log("listarCompaniaMast", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim().toUpperCase(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
      });
      return 1;
    });
  }

  selectedItemcompania(event) {
    if (event.value != null) {
      console.log(" this.lstCompania:", this.lstCompania);
      console.log("seleccion:", event);
      var dato = this.lstCompania.filter(x => x.value == event.value);
      this.filtroSede.IdEmpresa = Number(dato[0].title);
      this.cargarCombosede(this.filtroSede.IdEmpresa);
    }
    else {
      this.lstSucursal = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    }
  }

  cargarCombosede(IdPersona: number): Promise<number> {
    this.filtroSede.SedEstado = 1;
    this.filtroSede.IdEmpresa = IdPersona;
    this.lstSucursal = [];
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
      console.log("ListaSede", res);
      res.forEach(ele => {
        this.lstSucursal.push({ label: ele.SedDescripcion.trim().toUpperCase(), value: ele.IdSede });
      });
      return 1;
    });
  }

  cargarSucursalEditar(compniacodigo: string) {
    var dato = this.lstCompania.filter(x => x.value == compniacodigo);
    this.filtroSede.IdEmpresa = Number(dato[0].title);
    this.filtroSede.SedEstado = 1;
    this.lstSucursal = [];
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
      console.log("ListaSede EDITAR", res);
      res.forEach(ele => {
        this.lstSucursal.push({ label: ele.SedDescripcion.trim(), value: ele.IdSede });
      });
      return 1;
    });

  }


  listarComboDepartamento(): Promise<number> {
    this.lstDepartamento.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    let departamento = { Num: 1 }
    return this.personaService.listarUbigeo(departamento).then(res => {
      res.forEach(e => {
        this.lstDepartamento.push({ label: e.Nombre.toUpperCase(), value: e.Codigo });
      });
      return 1;
    });
  }

  selectedItemDepartamento(event) {
    console.log(this.lstDepartamento);
    if (event.value == null || event.value == undefined) {

      this.selectedDepartamento = event;
      this.lstProvincia = []
      this.lstDistrito = []
      this.listarComboProvincia(event);


    } else {
      this.selectedDepartamento = event.value;
      this.lstProvincia = []
      this.lstDistrito = []
      this.listarComboProvincia(event.value);
    }

  }

  async selectedItemProvincia(event) {
    if (event.value == null || event.value == undefined) {
      this.listarComboDistrito(this.selectedDepartamento + event);
    } else {
      this.listarComboDistrito(this.selectedDepartamento + event.value);
    }

  }


  listarComboProvincia(codigo: string): Promise<number> {
    this.lstProvincia = [];
    this.lstProvincia.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    let provincia = { Num: 2, Codigo: codigo }
    return this.personaService.listarUbigeo(provincia).then(res => {
      res.forEach(e => {
        this.lstProvincia.push({ label: e.Nombre.toUpperCase(), value: e.Codigo });
      });
      return 1;
    });
  }


  listarComboDistrito(codigo: string): Promise<number> {
    this.lstDistrito = [];
    console.log("ListaSede listarComboDistrito", codigo);
    this.lstDistrito.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    let distrito = { Num: 3, Codigo: codigo }
    return this.personaService.listarUbigeo(distrito).then(res => {
      res.forEach(e => {
        this.lstDistrito.push({ label: e.Nombre.toUpperCase(), value: e.Codigo });
      });
      return 1;
    });

  }




  verSelectorPersona() {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, 'SELECPROMOTOR', 'BUSCAR'), 'BUSCAR', "N");
  }

  crearPersona() {
    this.personaMantenimientoComponent.coreIniciarComponentemantenimiento(new MensajeController(this, 'TIPREGEMPRESA', ''), 'NUEVO', 1);
  }


  validarTeclaEnterRepresentante(evento) {
    if (evento.key == "Enter") {
      if (this.dto.Documento == null) {
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Ingrese un Nro. de documento.' });
        return;
      }
      else if (this.dto.Documento.trim().length >= 5) {
        let Documento = {
          Documento: this.dto.Documento.trim(),
          tipopersona: "P",
          SoloBeneficiarios: "0",
          UneuNegocioId: "0"
        }
        this.bloquearPag = true;
        return this.personaService.listaPersonaUsuario(Documento).then((res) => {
          this.bloquearPag = false;
          if (this.esListaVacia(res)) {
            this.dto.Documento = null;
            this.dto.promotordesc = null;
            this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
            return;
          }
          else if (res[0].hasOwnProperty("Documento")) {
            if (this.estaVacio(res[0].NombreCompleto)) {
              this.dto.promotordesc = `${res[0].Nombres}, ${res[0].ApellidoPaterno}`;
              this.editarrepresen = true;
            } else {
              this.dto.promotordesc = res[0].NombreCompleto;
              this.editarrepresen = true;
            }
          } else {
            this.dto.Documento = null;
            this.dto.promotordesc = null;
            this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
            return;
          }
        }).catch(error => error);
      } else {
        this.dto.Documento = null;
        this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'Documento no encontrado, revise bien los parametros.' });
        return;
      }
    }
  }

  cargarMoneda() {
    this.lstMoneda = [];
    let label: string;
    this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "MONEDA").forEach(i => {
      label = i.Nombre.trim()
      this.lstMoneda.push({ label: label.toUpperCase(), value: i.Codigo.trim() });
    });
  }
  limpiarDocumento() {
    this.dto.Documento = null;
    this.dto.NombreCompleto = null;
  }

  coreGuardar() {
    if (this.estaVacio(this.dto.Documento)) { this.messageShow('warn', 'Advertencia', 'Seleccione un promotor válido'); return; }
    if (this.estaVacio(this.dto.CompaniaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione una compañia válida'); return; }
    if (this.estaVacio(this.dto.IdSede)) { this.messageShow('warn', 'Advertencia', 'Seleccione una sucursal válida'); return; }

    if (this.estaVacio(this.dto.Nombre)) { this.messageShow('warn', 'Advertencia', 'Ingrese un nombre válido'); return; }
    if (this.estaVacio(this.dto.Area)) { this.messageShow('warn', 'Advertencia', 'Ingrese una área válida'); return; }
    if (this.estaVacio(this.dto.Precio)) { this.messageShow('warn', 'Advertencia', 'Ingrese un precio válido'); return; }

    if (this.estaVacio(this.dto.MonedaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de moneda válido'); return; }
    //if (this.estaVacio(this.dto.TotalCuota)) { this.messageShow('warn', 'Advertencia', 'Ingrese un total de cuotas válido'); return; }
    //if (this.estaVacio(this.dto.MontoInicial)) { this.messageShow('warn', 'Advertencia', 'Ingrese un monto inicial válido'); return; }
    if (this.estaVacio(this.dto.Departamento)) { this.messageShow('warn', 'Advertencia', 'Seleccione un departamento válido'); return; }
    if (this.estaVacio(this.dto.Provincia)) { this.messageShow('warn', 'Advertencia', 'Seleccione una provincia válida'); return; }
    if (this.estaVacio(this.dto.Distrito)) { this.messageShow('warn', 'Advertencia', 'Seleccione un distrito válido'); return; }

    if (this.estaVacio(this.dto.Estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione un estado válido'); return; }

    console.log("PROGRAMA GUARDAR", this.dto);

    this.dto.Ubigeo = this.dto.Departamento + "" + this.dto.Provincia + "" + this.dto.Distrito;
    this.dto.TotalCuota = this.formatoNumerico(this.dto.TotalCuota);
    if (this.validarform == "NUEVO") {
      this.bloquearPag = true;
      this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Usuario;
      this.dto.IpCreacion = this.getIp();  //crear metodo que nos muestre la IP del usuario

      this.programaService.mantenimientoPrograma(1, this.dto, this.getUsuarioToken()).then(
        res => {
          this.dialog = false;
          this.bloquearPag = false;
          console.log("registrado:", res);
          if (res != null) {
            if (res.mensaje == "Created") {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Se registró con éxito.' });
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            } else {
              this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
            }
          }
        });

    } else if (this.validarform == "EDITAR") {
      this.dto.UsuarioModificacion = this.getUsuarioAuth().data[0].Usuario.trim();
      this.dto.FechaModificacion = this.fechaModificacion;
      this.bloquearPag = true;
      this.programaService.mantenimientoPrograma(2, this.dto, this.getUsuarioToken()).then(
        res => {
          this.dialog = false;
          this.bloquearPag = false;
          if (res != null) {
            console.log("registrado:", res);
            if (res.mensaje == "Ok") {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Se actualizó con éxito.' });
              this.mensajeController.resultado = res;
              this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
            } else {
              this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: res.mensaje });
            }
          }

        });
    }


  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

}
