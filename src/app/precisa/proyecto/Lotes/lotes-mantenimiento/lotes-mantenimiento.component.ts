import { Sedes } from './../../../auth/model/sedes';
import { MaestroSucursalService } from './../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { ConstanteAngular } from './../../../../@theme/ConstanteAngular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { FiltroWcoSede } from '../../../maestros/Sedes/dominio/filtro/FiltroWcoSede';
import { DtoLote } from '../model/DtoLote';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { FiltroPrograma } from '../../Programa/model/FiltroPrograma';
import { FiltroLote } from '../model/FiltroLote';
import { LoteService } from '../service/lotes.service';
import { ProgramaService } from '../../Programa/service/programa.service';
import { FiltroManzana } from '../../Manzana/model/FiltroManzana';
import { ManzanaService } from '../../Manzana/service/manzana.service';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { MaestrotipocambioService } from '../../../maestros/TipoCambio/servicio/maestrotipocambio.service';
import { Filtrotipodecambio } from '../../../maestros/TipoCambio/dominio/filtro/Filtrotipodecambio';
import Swal from 'sweetalert2';
import { Image } from '../../../seguridad/companias/dominio/dto/image';
import { LotesImagenComponent } from '../lotes-imagen/lotes-imagen.component';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
@Component({
  selector: 'ngx-lotes-mantenimiento',
  templateUrl: './lotes-mantenimiento.component.html',
  styleUrls: ['./lotes-mantenimiento.component.scss']
})

export class LotesMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {

  @ViewChild(LotesImagenComponent, { static: false })
  lotesImagenComponent: LotesImagenComponent;

  bloquearPag: boolean;
  validarform: string = null;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  acciones: string = ''
  position: string = 'top'
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  filtroSede: FiltroWcoSede = new FiltroWcoSede();
  filtroPrograma: FiltroPrograma = new FiltroPrograma();
  filtro: FiltroLote = new FiltroLote();
  filtroTipoDeCambio: Filtrotipodecambio = new Filtrotipodecambio();
  dto: DtoLote = new DtoLote();
  valorEnSoles: number;
  valorEnsolesTotal: number;
  FiltroManzana: FiltroManzana = new FiltroManzana();

  lstCompania: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  lstSucursal: SelectItem[] = [];
  lstPrograma: SelectItem[] = [];
  lstManzana: SelectItem[] = [];
  lstMoneda: SelectItem[] = [];
  lstUbicacion: SelectItem[] = [];
  lstTipoLote: SelectItem[] = [];
  lstTipoInteres: SelectItem[] = [];
  lstEstadoCampo: SelectItem[] = [];
  lstDepartamento: SelectItem[] = [];
  lstProvincia: SelectItem[] = [];
  lstDistrito: SelectItem[] = [];
  lstEstadoLote: SelectItem[] = [];
  inputs: Object[] = [];
  enviarImagen:
    {
      ubicacion: number
      name: string,
      content: string,
      file: File | null
    }[] = [

    ]
  imagenes: any[] = [{
    id: 1,
    nameImage: '',
    content: '',
    type: '',
    size: 0
  }, {
    id: 2,
    nameImage: '',
    content: '',
    type: '',
    size: 0
  }, {
    id: 3,
    nameImage: '',
    content: '',
    type: '',
    size: 0
  }, {
    id: 4,
    nameImage: '',
    content: '',
    type: '',
    size: 0
  }];
  file: File = null;
  totalAreaASignada = 0;
  constructor(
    private personaService: PersonaService,
    private messageService: MessageService,
    private maestroSucursalService: MaestroSucursalService,
    private loteService: LoteService,
    private manzanaService: ManzanaService,
    private programaService: ProgramaService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private confirmationService: ConfirmationService,
    private maestrotipocambioService: MaestrotipocambioService) {

    super();
  }

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
    const p1 = this.cargarComboEstados();
    const p2 = this.cargarCombocompania();
    const p3 = this.cargarComboUbicacion();
    const p4 = this.cargarComboTipoLote();
    const p5 = this.cargarComboTipoInteres();
    const p6 = this.cargarComboEstadoCambio();
    const p7 = this.listarComboDepartamento();
    const p8 = this.cargarMoneda();
    const p9 = this.cargarComboEstadoLote();

    Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9]).then((resp) => {
      // this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      // this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      // this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      // this.lstProvincia.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      // this.lstDistrito.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    });

  }

  async iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: any,) {
    this.bloquearPag = true;
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo}: ${accion}`;
    this.dialog = true;
    this.dto = new DtoLote();
    this.enviarImagen = [];

    if (this.validarform == "NUEVO") {

      this.btnCerrar();

      this.dto.Estado = 1;
      this.dto.MonedaCodigo = "EX";
      this.dto.Condicion = 1;
      this.puedeEditar = false;
      this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
      this.dto.FechaCreacion = new Date();
      this.fechaCreacion = this.dto.FechaCreacion;
      this.fechaModificacion = null;
      var hoy = new Date();
      var dia = hoy.getDate();
      var mes = hoy.getMonth() + 1;
      var anio = hoy.getFullYear();
      this.filtroTipoDeCambio.fechacambio = new Date(`${anio},${mes},${dia}`);
      this.filtroTipoDeCambio.ultimafechamodif = new Date(`${anio},${mes},${dia}`);
      this.dto.TipoInteres = 1;
      this.maestrotipocambioService.listarmaestroTipoCambio(this.filtroTipoDeCambio).then((res) => {
        this.dto.MorosidadPorcentaje = 1;
        console.log("Tipo de cambio", res);
        if (res.length == 0) {
          this.puedeEditar = true;
          this.dto.TipoCambio = 0;
          this.messageService.add({
            key: "bc",
            severity: "warn",
            summary: "Warning",
            detail: "No tiene un tipo de cambio establecido",
          });
        }

        res.forEach(element => {

          if (element.FactorVenta == undefined || element.Estado == "I") {
            this.messageService.add({
              key: "bc",
              severity: "warn",
              summary: "Warning",
              detail: "No tiene un tipo de cambio establecido",
            });
            this.puedeEditar = true;
          }

          this.dto.TipoCambio = (element.Estado != "I" || element.Estado == undefined) ? element.FactorVenta : 0;
        })

      });
      console.log("dtoooo", this.dto.TipoCambio);


      this.bloquearPag = false;
    } else if (this.validarform == "EDITAR") {
      console.log("EDITAR rowdata :", rowdata);
      if (rowdata.IdLotePadre != null || rowdata.IdLotePadre != undefined) {
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "warning",
          detail: "El lote pertenece a una unión.",
        });
      } else {
        // const event0 = {value:rowdata.IdSede}
        const p1 = await this.cargarSucursalEditar(rowdata.CompaniaCodigo);
        const p2 = await this.cargarComboPrograma(rowdata.IdSede);
        const p3 = await this.cargarComboManzana(rowdata.IdProyecto);
        const p5 = await this.listarComboProvincia(rowdata.Ubigeo.substring(0, 2));
        const p6 = await this.listarComboDistrito(rowdata.Ubigeo.substring(0, 4));
        // const p7 = await this.selectedItemPrograma(event0);

        Promise.all([p1, p2, p3, p5, p6]).then((resp) => {
          this.filtro.IdLote = rowdata.IdLote;

          this.loteService.listarLote(this.filtro).then(async (res) => {
            this.bloquearPag = false;
            this.puedeEditar = false;



            let MaestroArchivo = {
              Tabla: "LOTE",
              IdTabla: this.filtro.IdLote,
              Estado: 1
            }

            const imagenes = await this.maestrocompaniaMastService.ListarTablaMaestroArchivo(MaestroArchivo);

            console.log("resresresres", imagenes);

            for (let element of imagenes) {
              if (element.Linea == 1) {
                res[0].imaNombre1 = element.NombrePDF;
                this.dto.imagen1 = element.Contenido;
              }
              if (element.Linea == 2) {
                res[0].imaNombre2 = element.NombrePDF;
                res[0].imagen2 = element.Contenido;
              }
              if (element.Linea == 3) {
                res[0].imaNombre3 = element.NombrePDF;
                res[0].imagen3 = element.Contenido;
              }
              if (element.Linea == 4) {
                res[0].imaNombre4 = element.NombrePDF;
                res[0].imagen4 = element.Contenido;
              }
            }

            this.dto = await res[0];
            this.valorEnSoles = this.dto.Valor * this.dto.TipoCambio;
            this.valorEnsolesTotal = this.dto.ValorTotal * this.dto.TipoCambio;
            this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
            this.fechaCreacion = new Date(this.dto.FechaCreacion);
            if (this.dto.FechaModificacion != null) {
              this.fechaModificacion = new Date(this.dto.FechaModificacion);
              console.log('fecha creación', this.fechaCreacion);
            }



            //arreglar
            this.dto.MonedaCodigo = rowdata.MonedaCodigo.trim();
            if (!this.estaVacio(this.dto.Ubigeo)) {
              this.dto.Departamento = res[0].Ubigeo.substring(0, 2);
              this.dto.Provincia = res[0].Ubigeo.substring(2, 4);
              this.dto.Distrito = res[0].Ubigeo.substring(4, 6);
            }


            console.log("dsadasdasdasdas", this.dto);

            console.log("EDITAR  this.dto :", this.dto);

          });
        });


      }

    } else if (this.validarform == "VER") {
      console.log("EDITAR rowdata :", rowdata);
      if (rowdata.IdLotePadre != null || rowdata.IdLotePadre != undefined) {
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "warning",
          detail: "El lote pertenece a una unión.",
        });
      } else {
        // const event0 = {value:rowdata.IdSede}
        const p1 = await this.cargarSucursalEditar(rowdata.CompaniaCodigo);
        const p2 = await this.cargarComboPrograma(rowdata.IdSede);
        const p3 = await this.cargarComboManzana(rowdata.IdProyecto);
        const p5 = await this.listarComboProvincia(rowdata.Ubigeo.substring(0, 2));
        const p6 = await this.listarComboDistrito(rowdata.Ubigeo.substring(0, 4));
        // const p7 = await this.selectedItemPrograma(event0);

        Promise.all([p1, p2, p3, p5, p6]).then((resp) => {
          this.filtro.IdLote = rowdata.IdLote;

          this.loteService.listarLote(this.filtro).then(async (res) => {
            this.bloquearPag = false;
            this.puedeEditar = true;



            let MaestroArchivo = {
              Tabla: "LOTE",
              IdTabla: this.filtro.IdLote,
              Estado: 1
            }

            const imagenes = await this.maestrocompaniaMastService.ListarTablaMaestroArchivo(MaestroArchivo);

            console.log("resresresres", imagenes);

            for (let element of imagenes) {
              if (element.Linea == 1) {
                res[0].imaNombre1 = element.NombrePDF;
                this.dto.imagen1 = element.Contenido;
              }
              if (element.Linea == 2) {
                res[0].imaNombre2 = element.NombrePDF;
                res[0].imagen2 = element.Contenido;
              }
              if (element.Linea == 3) {
                res[0].imaNombre3 = element.NombrePDF;
                res[0].imagen3 = element.Contenido;
              }
              if (element.Linea == 4) {
                res[0].imaNombre4 = element.NombrePDF;
                res[0].imagen4 = element.Contenido;
              }
            }

            this.dto = await res[0];
            this.valorEnSoles = this.dto.Valor * this.dto.TipoCambio;
            this.valorEnsolesTotal = this.dto.ValorTotal * this.dto.TipoCambio;
            this.usuario = this.getUsuarioAuth().data[0].NombreCompleto.trim();
            this.fechaCreacion = new Date(this.dto.FechaCreacion);
            if (this.dto.FechaModificacion != null) {
              this.fechaModificacion = new Date(this.dto.FechaModificacion);
              console.log('fecha creación', this.fechaCreacion);
            }



            //arreglar
            this.dto.MonedaCodigo = rowdata.MonedaCodigo.trim();
            if (!this.estaVacio(this.dto.Ubigeo)) {
              this.dto.Departamento = res[0].Ubigeo.substring(0, 2);
              this.dto.Provincia = res[0].Ubigeo.substring(2, 4);
              this.dto.Distrito = res[0].Ubigeo.substring(4, 6);
            }


            console.log("dsadasdasdasdas", this.dto);

            console.log("EDITAR  this.dto :", this.dto);

          });
        });


      }
    }


  }



  //Llenado de combos

  valorSolesIvalor(event): void {
    if (this.dto.AreaTotal == undefined) {
      this.dto.ValorTotal = 0;
    } else {
      let precioValue: string = event.srcElement.value;
      let preciofiltrado: string[] = precioValue.toString().split(',');
      let precio: string = "";
      preciofiltrado.forEach(function (e) {
        console.log('aprecio', e);
        precio += e;
      });
      console.log('array de precio', precio);

      this.dto.ValorTotal = Math.round(this.dto.AreaTotal * this.dto.Valor);
      this.valorEnSoles = Math.round(this.dto.Valor * this.dto.TipoCambio);
      this.valorEnsolesTotal = Math.round(this.dto.ValorTotal * this.dto.TipoCambio);
    }
  }


  valorSolesAtotal(event): void {
    if (this.dto.Valor == undefined) {
      this.dto.ValorTotal = 0;
    } else {
      this.dto.ValorTotal = Math.round(this.dto.Valor * this.dto.AreaTotal);
      this.valorEnSoles = Math.round(this.dto.Valor * this.dto.TipoCambio);
      this.valorEnsolesTotal = Math.round(this.dto.ValorTotal * this.dto.TipoCambio);
    }
  }



  cargarCombocompania(): Promise<number> {
    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
      console.log("listarCompaniaMast", res);
      res.forEach(ele => {
        //  this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.Persona });
        this.lstCompania.push({ label: ele.DescripcionCorta.toUpperCase(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
      });
      return 1;
    });
  }

  selectedItemcompania(event) {
    if (event.value != null) {
      var dato = this.lstCompania.filter(x => x.value == event.value);
      this.filtroSede.IdEmpresa = Number(dato[0].title);
      this.cargarCombosede(this.filtroSede.IdEmpresa);
    } else {
      this.lstSucursal = [];
      this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    }
    this.lstPrograma = [];
    this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstManzana = [];
    this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
  }

  cargarCombosede(IdPersona: number): Promise<number> {
    this.filtroSede.SedEstado = 1;
    this.filtroSede.IdEmpresa = IdPersona;
    this.lstSucursal = [];
    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestroSucursalService.ListaSede(this.filtroSede).then((res) => {
      console.log("ListaSede", res);
      res.forEach(ele => {
        this.lstSucursal.push({ label: ele.SedDescripcion.toUpperCase(), value: ele.IdSede, icon: ele.Precio });
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
        this.lstSucursal.push({ label: ele.SedDescripcion.toUpperCase(), value: ele.IdSede, icon: ele.Precio });
      });
      return 1;
    });

  }

  cargarComboProgramaEditar(IdSede: number): Promise<number> {
    this.filtroPrograma.Estado = 1;
    this.lstPrograma = [];
    this.filtroPrograma.IdSede = IdSede;
    this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.programaService.listarPrograma(this.filtroPrograma).then((res) => {
      console.log("Combo Programa:", res);
      res.forEach(ele => {
        this.lstPrograma.push({ label: ele.Nombre.toUpperCase(), value: ele.IdProyecto, icon: ele.Precio, styleClass: ele.Area });
      });
      return 1;
    });
  }


  cargarComboPrograma(Idsede?: number): Promise<number> {
    if (this.dto.IdSede != null || Idsede != null) {
      this.filtroPrograma.Estado = 1;
      this.lstPrograma = [];
      this.lstManzana = [];
      this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      if (this.dto.IdSede == null) {
        this.filtroPrograma.IdSede = Idsede;
      } else {
        this.filtroPrograma.IdSede = this.dto.IdSede;
      }

      this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
      if (this.filtroPrograma.IdSede == null) {
        return;
      }
      return this.programaService.listarPrograma(this.filtroPrograma).then((res) => {
        res.forEach(ele => {
          console.log("this.lstPrograma", this.lstPrograma);
          this.lstPrograma.push({ label: ele.Nombre.toUpperCase(), value: ele.IdProyecto, title: ele.Ubigeo.trim(), icon: ele.Precio, styleClass: ele.Area });
        });
        return 1;
      });
    } else {
      this.lstPrograma = []
      this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    }
    console.log("this.lstPrograma", this.lstPrograma);

  }

  listarComboDepartamento(): Promise<number> {
    this.lstDepartamento = [];
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
    this.listarComboProvincia(event.value);
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

  selectedItemProvincia(event) {
    this.listarComboDistrito(this.dto.Departamento + event.value);
  }


  listarComboDistrito(codigo: string): Promise<number> {
    this.lstDistrito = [];
    this.lstDistrito.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    let distrito = { Num: 3, Codigo: codigo }
    return this.personaService.listarUbigeo(distrito).then(res => {
      res.forEach(e => {
        this.lstDistrito.push({ label: e.Nombre.toUpperCase(), value: e.Codigo.trim() });
      });
      return 1;
    });
  }


  cargarComboUbicacion() {
    this.lstUbicacion = [];
    this.lstUbicacion.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPUBI").forEach(i => {
      this.lstUbicacion.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo })
    });
  }

  cargarComboEstadoLote() {
    this.lstEstadoLote = [];
    this.lstEstadoLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLOT").forEach(i => {
      this.lstEstadoLote.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo })
    });
    console.log("lstEstadoLote:", this.lstEstadoLote);
  }



  cargarComboTipoLote() {
    this.lstTipoLote = [];
    this.lstTipoLote.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPLOT").forEach(i => {
      this.lstTipoLote.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo })
    });
  }

  cargarComboTipoInteres() {
    this.lstTipoInteres = [];
    this.lstTipoInteres.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPINT").forEach(i => {
      this.lstTipoInteres.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo })
    });
  }

  cargarComboEstadoCambio() {
    this.lstEstadoCampo = [];
    this.lstEstadoCampo.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTCAM").forEach(i => {
      this.lstEstadoCampo.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo })
    });
  }

  cargarComboEstados() {
    this.lstEstados = [];
    this.lstEstados.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTGEN").forEach(i => {
      this.lstEstados.push({ label: i.Nombre.toUpperCase(), value: i.IdCodigo })
    });
  }


  async selectedItemPrograma(event) {
    if (event.value != null) {
      this.dto.Departamento = null;
      this.dto.Provincia = null;
      this.dto.Distrito = null;
      let buscarLote = new FiltroLote();
      buscarLote.CompaniaCodigo = this.dto.CompaniaCodigo;
      buscarLote.IdSede = this.dto.IdSede;
      buscarLote.IdProyecto = this.dto.IdProyecto;
      const respPrograma = await this.loteService.listarLote(buscarLote);
      this.totalAreaASignada = 0;
      console.log("respPrograma", respPrograma);

      respPrograma.forEach(ele => {
        this.totalAreaASignada += ele.AreaTotal
      });
      console.log("totalAreaASignada", this.totalAreaASignada);

      this.lstPrograma.forEach(async e => {
        console.log("JAJJAJAJJAJ", e);


        if (event.value == e.value) {
          // this.dto.Valor = Number(e.icon);
          // console.log("e.title", e.title);

          // this.dto.AreaTotal = Number(e.styleClass) - this.totalAreaASignada;
          // this.totalAreaASignada = this.dto.AreaTotal;
          // if (this.totalAreaASignada <= 0) {
          //   Swal.fire({
          //     title: '¡Importante!',
          //     text: `Se a asignado toda el Area M2, por favor elegir otro programa`,
          //     icon: 'warning',
          //     showCancelButton: false,
          //     confirmButtonColor: '#094d74'

          //   });
          //   return;
          // }
        }
      });

      const p1 = this.cargarComboManzana(this.dto.IdProyecto);
      var dato = this.lstPrograma.filter(x => x.value == event.value);
      const p2 = this.listarComboProvincia(dato[0].title.substring(0, 2));
      const p3 = this.listarComboDistrito(dato[0].title.substring(0, 4));

      Promise.all([p1, p2, p3]).then((resp) => {
        console.log("DEPARTAMENTO:", this.lstDepartamento);
        console.log("PROVINCIA:", this.lstProvincia);
        console.log("DISTRITO:", this.lstDistrito);
        console.log("UBIGEO", dato[0].title);
        this.dto.Departamento = dato[0].title.substring(0, 2);
        this.dto.Provincia = dato[0].title.substring(2, 4);
        this.dto.Distrito = dato[0].title.substring(4, 6);
      });
    } else {
      this.lstManzana = [];
      this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    }
  }
  // --- revisar gasmc ---
  cargarComboManzana(Id: number): Promise<number> {
    this.FiltroManzana.IdProyecto = Id;
    this.FiltroManzana.Estado = 1;
    this.lstManzana = [];
    this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.manzanaService.listarManzana(this.FiltroManzana).then((res) => {
      res.forEach(ele => {
        this.lstManzana.push({ label: ele.Nombre.trim(), value: ele.IdManzana });
      });
      return 1;
    });
  }

  cargarMoneda() {
    this.lstMoneda = [];
    this.lstMoneda.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "MONEDA").forEach(i => {
      this.lstMoneda.push({ label: i.Nombre.trim().toUpperCase (), value: i.Codigo.trim() });
    });
  }


  async coreGuardar() {
    // if (this.totalAreaASignada <= 0) {
    //   Swal.fire({
    //     title: '¡Importante!',
    //     text: `Se a asignado toda el Area M2, por favor elegir otro programa antes de guardar`,
    //     icon: 'warning',
    //     showCancelButton: false,
    //     confirmButtonColor: '#094d74',
    //     cancelButtonColor: '#ffc72f'

    //   });
    //   return;
    // }
    if (this.estaVacio(this.dto.Nombre)) { this.messageShow('warn', 'Advertencia', 'Ingrese un nombre válido'); return; }

    if (this.estaVacio(this.dto.CompaniaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione una compañia válida'); return; }
    if (this.estaVacio(this.dto.IdSede)) { this.messageShow('warn', 'Advertencia', 'Seleccione una sucursal válida'); return; }
    if (this.estaVacio(this.dto.IdProyecto)) { this.messageShow('warn', 'Advertencia', 'Seleccione un programa válido'); return; }
    if (this.estaVacio(this.dto.IdManzana)) { this.messageShow('warn', 'Advertencia', 'Seleccione una manzana válida'); return; }

    if (this.estaVacio(this.dto.Departamento)) { this.messageShow('warn', 'Advertencia', 'Seleccione un departamento válido'); return; }
    if (this.estaVacio(this.dto.Provincia)) { this.messageShow('warn', 'Advertencia', 'Seleccione una provincia válida'); return; }
    if (this.estaVacio(this.dto.Distrito)) { this.messageShow('warn', 'Advertencia', 'Seleccione un distrito válido'); return; }

    if (this.estaVacio(this.dto.Ubicacion)) { this.messageShow('warn', 'Advertencia', 'Seleccione una ubicación válida'); return; }
    if (this.estaVacio(this.dto.TipoLote)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de lote válido'); return; }

    if (this.estaVacio(this.dto.TipoInteres)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de interes válido'); return; }
    if (this.estaVacio(this.dto.Estado)) { this.messageShow('warn', 'Advertencia', 'Seleccione un estado válido'); return; }
    if (this.estaVacio(this.dto.Situacion)) { this.messageShow('warn', 'Advertencia', 'Seleccione un estado de campo detalle válido'); return; }

    if (this.estaVacio(this.dto.AreaTotal)) { this.messageShow('warn', 'Advertencia', 'Ingrese una área válida'); return; }
    if (this.estaVacio(this.dto.MonedaCodigo)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de moneda válido'); return; }
    if (this.estaVacio(this.dto.Valor)) { this.messageShow('warn', 'Advertencia', 'Ingrese un precio válido'); return; }



    this.dto.Ubigeo = this.dto.Departamento + "" + this.dto.Provincia + "" + this.dto.Distrito;
    this.dto.diasGracia = 10;

    if (!this.estaVacio(this.dto.Ubigeo)) {
      this.dto.Ubigeo = this.dto.Ubigeo.trim();
    }
    if (this.dto.Nombre != null) {
      this.dto.Nombre = this.dto.Nombre.toUpperCase();
    }
    if (this.dto.Direccion != null) {
      this.dto.Direccion = this.dto.Direccion.toUpperCase();
    }
    if (this.dto.Observacion != null) {
      this.dto.Observacion = this.dto.Observacion.toUpperCase();
    }

    if (this.validarform == "NUEVO") {
      this.bloquearPag = true;
      this.dto.UsuarioCreacion = this.getUsuarioAuth().data[0].Documento;
      this.dto.FechaCreacion = new Date();
      this.dto.IpCreacion = this.getIp();  //crear metodo que nos muestre la IP del usuario
      console.log("this.dto", this.dto);

      const respNuevoLote = await this.loteService.mantenimientoLote(ConstanteUI.SERVICIO_SOLICITUD_NUEVO, this.dto, this.getUsuarioToken());
      this.dialog = false;
      this.bloquearPag = false;
      console.log("registrado:", respNuevoLote);
      if (respNuevoLote.success) {
        this.dto.IdLote = await respNuevoLote.data.IdLote;
        this.messageService.add({ key: 'lc', severity: 'success', summary: 'Success', detail: this.getMensajeGuardado() });
        this.mensajeController.resultado = respNuevoLote;
        this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
      } else {
        this.messageService.add({ key: 'lc', severity: 'warn', summary: 'Advertencia', detail: this.getMensajeErrorGuardado() });
      }


    } else if (this.validarform == "EDITAR") {
      console.log(this.dto);
      if (this.dto.IdLotePadre != null || this.dto.IdLotePadre != undefined) {
        this.messageService.add({
          key: "bc",
          severity: "warn",
          summary: "warning",
          detail: "El lote pertenece a una unión.",
        });
      } else {
        this.dto.UsuarioModificacion = this.getUsuarioAuth().data[0].Documento.trim();
        this.dto.FechaModificacion = this.fechaModificacion;
        this.dto.IpModificacion = this.getIp();
        this.bloquearPag = true;
        const respEditarLote = await this.loteService.mantenimientoLote(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.dto, this.getUsuarioToken());
        this.dialog = false;
        this.bloquearPag = false;
        console.log("registrado:", respEditarLote);

        if (respEditarLote.success) {
          this.messageService.add({ key: 'lc', severity: 'success', summary: 'Success', detail: this.getMensajeActualizado() });
          this.mensajeController.resultado = respEditarLote;
          this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        } else {
          this.messageService.add({ key: 'lc', severity: 'warn', summary: 'Advertencia', detail: this.getMensajeErrorActualizar() });
        }

      }
    }

    if (this.enviarImagen.length >= 1) {

      let confirmarGuardadoImg: boolean = null;
      let respuestaImagen = null;
      for (let imagenEnviar of this.enviarImagen) {
        const Archivo = {
          Id: 0,
          Tabla: "LOTE",
          IdTabla: this.dto.IdLote,
          Linea: imagenEnviar.ubicacion,
          NombrePDF: imagenEnviar.name, //name
          Contenido: ".jpg", //type
          Estado: 1,
          UsuarioCreacion: this.dto.UsuarioCreacion,
          UsuarioModificacion: this.dto.UsuarioModificacion,
          FechaCreacion: this.dto.FechaCreacion,
          FechaModificacion: this.dto.FechaModificacion
        };

        let ViewModalExite = {
          success: "true",
          valor: "1",
          tokem: imagenEnviar.name, //name
          mensaje: imagenEnviar.content, //binario
          Archivo: this.file,
          data: Archivo
        }

        console.log("coreGuardar Mantenimientofile imaNombre1:", Archivo);
        console.log("coreGuardar ViewModalExite:", ViewModalExite);

        const respImagen = await this.maestrocompaniaMastService.Mantenimientofile(1, ViewModalExite, this.getUsuarioToken());

        this.bloquearPag = false;
        this.dialog = false;
        console.log("res", respImagen);
        if (respImagen != null) {
          console.log("registrado:", respImagen);
          if (respImagen.success) {
            confirmarGuardadoImg = true;
          } else {
            confirmarGuardadoImg = false;
          }
        }
        respuestaImagen = respImagen;
      }

      if (this.validarform == 'NUEVO' && confirmarGuardadoImg == true) {
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: this.getMensajeGuardado() });
        this.mensajeController.resultado = respuestaImagen;
        this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        return;
      }

      if (this.validarform == 'EDITAR' && confirmarGuardadoImg == true) {
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: this.getMensajeActualizado() });
        this.mensajeController.resultado = respuestaImagen;
        this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        return;
      }
      if (confirmarGuardadoImg == false) {
        this.messageService.add({ key: 'bc', severity: 'error', summary: 'error', detail: 'No se puedo guardar o actualizar las imagenes' });
      }


    }

  }

  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

  async coreVerImagen(row) {

    let filtroImg: Image = new Image();
    filtroImg.Tabla = 'LOTE';
    filtroImg.IdTabla = row.IdLote;
    if (filtroImg.IdTabla == undefined || filtroImg.IdTabla == null) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Imagen no obtenida' });
      return;
    }
    const imagenEnviar = await this.getImagenes(filtroImg);
    console.log('TRAIDAAAA', filtroImg);
    if (imagenEnviar == undefined || imagenEnviar[0].Contenido == undefined) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Imagen no obtenida' });
      return;
    } else {
      this.lotesImagenComponent.iniciarComponenteMaestro(new MensajeController(this, "SELECTOR_LOTE", ""), "VER",
        this.objetoTitulo.menuSeguridad.titulo, imagenEnviar);
    }

  }
  async getImagenes(filtroImg: Image): Promise<Image[]> {
    filtroImg.Estado = 1

    const imagenes: Image[] = await this.maestrocompaniaMastService.MantenimientoFileVer(filtroImg, this.getUsuarioToken());

    console.log("WAKANDA FOREVER", imagenes);
    return imagenes;
  }


  subirArchivo(fs: any) {
    fs.click();
    console.log("subirArchivo archivo:", fs);
  }


  exportar(event: any, ubicacion: number) {
    console.log('exportar evento', event.target);
    const img = event.target.files;
    const files = event.target.files;
    this.file = <File>files[0];
    console.log('evento', this.file);
    const reader = new FileReader();
    if (img[0].type.split("/")[0] != 'image') {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'El archivo no es una imagen' });
      if (ubicacion == 1) {
        this.dto.imaNombre1 = null;
        this.dto.imagen1 = null;
      }
      if (ubicacion == 2) {
        this.dto.imaNombre2 = null;
        this.dto.imagen2 = null;
      }
      if (ubicacion == 3) {
        this.dto.imaNombre3 = null;
        this.dto.imagen3 = null;
      }
      if (ubicacion == 4) {
        this.dto.imaNombre4 = null;
        this.dto.imagen4 = null;
      }

      return;
    }
    if (img[0].size > 1048576) {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Warning', detail: 'El archivo es demasiado grande.' });
      if (ubicacion == 1) {
        this.dto.imaNombre1 = null;
        this.dto.imagen1 = null;
      }
      if (ubicacion == 2) {
        this.dto.imaNombre2 = null;
        this.dto.imagen2 = null;
      }
      if (ubicacion == 3) {
        this.dto.imaNombre3 = null;
        this.dto.imagen3 = null;
      }
      if (ubicacion == 4) {
        this.dto.imaNombre4 = null;
        this.dto.imagen4 = null;
      }
      return;
    }

    reader.onloadend = () => {
      let base = reader.result as string;

      img[0].type


      if (ubicacion == 1) {
        this.dto.imaNombre1 = img[0].name;
        // this.dto.DescripcionLarga = img[0].type;
        this.dto.imagen1 = base.split('base64,')[1];
        console.log("this.dto: MELIODAS", this.dto)
        if (this.enviarImagen[0] == null || undefined) {
          this.enviarImagen.push({
            ubicacion: ubicacion,
            name: img[0].name,
            content: base.split('base64,')[1],
            file: this.file
          });
        } else {
          this.enviarImagen[0] =
          {
            ubicacion: ubicacion,
            name: img[0].name,
            content: base.split('base64,')[1],
            file: this.file
          };
        }
        console.log("this.enviarImagen", this.enviarImagen);

      }
      if (ubicacion == 2) {
        this.dto.imaNombre2 = img[0].name;
        // this.dto.DescripcionLarga = img[0].type;
        this.dto.imagen2 = base.split('base64,')[1];
        console.log("this.dto:2 WAKANDA", this.dto)
        if (this.enviarImagen[1] == null || undefined) {
          this.enviarImagen.push({
            ubicacion: ubicacion,
            name: img[0].name,
            content: base.split('base64,')[1],
            file: this.file
          });
        } else {
          this.enviarImagen[1] =
          {
            ubicacion: ubicacion,
            name: img[0].name,
            content: base.split('base64,')[1],
            file: this.file
          };
        }
        console.log("this.enviarImagen", this.enviarImagen);

      }
      if (ubicacion == 3) {
        this.dto.imaNombre3 = img[0].name;
        // this.dto.DescripcionLarga = img[0].type;
        this.dto.imagen3 = base.split('base64,')[1];
        console.log("this.dto:2 WAKANDA", this.dto)
        if (this.enviarImagen[2] == null || undefined) {
          this.enviarImagen.push({
            ubicacion: ubicacion,
            name: img[0].name,
            content: base.split('base64,')[1],
            file: this.file
          });
        } else {
          this.enviarImagen[2] =
          {
            ubicacion: ubicacion,
            name: img[0].name,
            content: base.split('base64,')[1],
            file: this.file
          };
        }
        console.log("this.enviarImagen", this.enviarImagen);

      }
      if (ubicacion == 4) {
        this.dto.imaNombre4 = img[0].name;
        // this.dto.DescripcionLarga = img[0].type;
        this.dto.imagen4 = base.split('base64,')[1];
        console.log("this.dto:2 WAKANDA", this.dto)
        if (this.enviarImagen[3] == null || undefined) {
          this.enviarImagen.push({
            ubicacion: ubicacion,
            name: img[0].name,
            content: base.split('base64,')[1],
            file: this.file
          });
        } else {
          this.enviarImagen[3] =
          {
            ubicacion: ubicacion,
            name: img[0].name,
            content: base.split('base64,')[1],
            file: this.file
          };
        }
        console.log("this.enviarImagen", this.enviarImagen);

      }




    };
    reader.readAsDataURL(img[0]);
  }


  eliminarImagen(ubicacion: number) {
    if (ubicacion == 1) {
      this.dto.imaNombre1 = null;
      this.dto.imagen1 = null;
    }
    if (ubicacion == 2) {
      this.dto.imaNombre2 = null;
      this.dto.imagen2 = null;
    }
    if (ubicacion == 3) {
      this.dto.imaNombre3 = null;
      this.dto.imagen3 = null;
    }
    if (ubicacion == 4) {
      this.dto.imaNombre4 = null;
      this.dto.imagen4 = null;
    }
    this.enviarImagen.push({
      content: null,
      file: null,
      name: null,
      ubicacion: ubicacion,
    })
    //this.enviarImagen = this.enviarImagen.filter((e) => e.ubicacion != ubicacion);
    console.log("this.enviarImagen", this.enviarImagen);
  }
  subirArchivo2(fs2: any) {
    fs2.click();
    console.log("nombre archivo:", fs2.files);
  }

  exportar2(event: any) {
    console.log('exportar evento', event.target);
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
        this.dto.imaNombre2 = img[0].name;
        // this.dto.DescripcionLarga = img[0].type;
        this.dto.imagen2 = base.split('base64,')[1];
        console.log("this.dto:", this.dto)
      }
    };
    reader.readAsDataURL(img[0]);
  }


  subirArchivo3(fs3: any) {
    fs3.click();
    console.log("nombre archivo:", fs3.files);
  }

  exportar3(event: any) {
    console.log('exportar evento', event.target);
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
        this.dto.imaNombre3 = img[0].name;
        // this.dto.DescripcionLarga = img[0].type;
        this.dto.imagen3 = base.split('base64,')[1];
        console.log("this.dto:", this.dto)
      }
    };
    reader.readAsDataURL(img[0]);
  }

  subirArchivo4(fs4: any) {
    fs4.click();
    console.log("nombre archivo:", fs4.files);
  }

  exportar4(event: any) {
    console.log('exportar evento', event.target);
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
        this.dto.imaNombre4 = img[0].name;
        // this.dto.DescripcionLarga = img[0].type;
        this.dto.imagen4 = base.split('base64,')[1];
        console.log("this.dto:", this.dto)
      }
    };
    reader.readAsDataURL(img[0]);
  }


  btnCerrar() {
    this.lstSucursal = [];
    this.lstPrograma = [];
    this.lstManzana = [];
    this.lstProvincia = [];
    this.lstDistrito = [];

    this.lstSucursal.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstPrograma.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstManzana.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstProvincia.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    this.lstDistrito.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    this.fechaCreacion = undefined;
    this.fechaModificacion = undefined;
  }
}
