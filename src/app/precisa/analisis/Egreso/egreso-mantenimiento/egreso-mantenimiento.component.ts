import { noUndefined } from '@angular/compiler/src/util';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { PersonaBuscarComponent } from '../../../framework-comun/Persona/components/persona-buscar.component';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { EgresoService } from '../service/egreso.service';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';
import { DtoClassEgreso } from '../model/dtoclassegreso';
import { DtoEgreso } from '../model/dtoegreso';
import { DtoEgresoDetalle } from '../model/dtoegresodetalle';

@Component({
  selector: 'ngx-egreso-mantenimiento',
  templateUrl: './egreso-mantenimiento.component.html',
  styleUrls: ['./egreso-mantenimiento.component.scss']
})
export class EgresoMantenimientoComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  @ViewChild(PersonaBuscarComponent, { static: false }) personaBuscarComponent: PersonaBuscarComponent;
  position: boolean;
  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = "";
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  TipoDeCambio: number;
  accionDetalle: string = '';

  dtoClassEgreso: DtoClassEgreso = new DtoClassEgreso();
  egreso: DtoEgreso = new DtoEgreso();

  lstEgresoDetalle: DtoEgresoDetalle[] = [];
  lstTipoComprobante: SelectItem[] = [];
  detalleSeleccionado: DtoEgresoDetalle = new DtoEgresoDetalle();
  // {
  //   num: 0,
  //   TipoComprobante: '',
  //   TipoDocumento: '',
  //   Serie: '',
  //   Documento: '',
  //   Proveedor: '',
  //   Concepto: '',
  //   Cantidad: 0,
  //   igv: 0,
  //   Valor: 0,
  //   Total: 0
  // };
  isIgv: boolean = false;
  total: any = 900;
  igv: any = 150;
  subTotal: any = 750;
  isDialogDetalle: boolean;


  seleccion: any;
  lstCompania: SelectItem[] = [];
  FiltroCompan: FiltroCompaniamast = new FiltroCompaniamast();
  maxDate: Date = new Date();

  constructor(private maestrocompaniaMastService: MaestrocompaniaMastService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private egresoService: EgresoService) {
    super();
    // this.maxDate.setDate(this.maxDate.getDate()+1) 
  }
  coreNuevo(): void {
    throw new Error('Method not implemented.');
  }
  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }


  async coreGuardar() {

    if (this.estaVacio(this.egreso.FechaRegistro)) { this.messageShow('warn', 'Advertencia', 'Ingrese una fecha de registro válida'); return; }
    if (this.estaVacio(this.egreso.Documento)) { this.messageShow('warn', 'Advertencia', 'Ingrese una empleado válido'); return; }
    if (this.lstEgresoDetalle.length == 0) { this.messageShow('warn', 'Advertencia', 'Ingrese al menos un detalle de egreso'); return; }

    this.bloquearPag = true;
    this.dtoClassEgreso.Egreso = this.egreso;
    this.dtoClassEgreso.Detalle = this.lstEgresoDetalle;
    console.log("coreGuardar dtoClassEgreso", this.dtoClassEgreso);
    console.log("coreGuardar acciones", this.acciones);
    console.log("coreGuardar ACCION_SOLICITADA_NUEVO", ConstanteUI.ACCION_SOLICITADA_NUEVO);
    this.acciones
    switch (this.acciones) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        /**VARIABLES DE AUDITORIA - NUEVO */
        this.lstEgresoDetalle.forEach(e => {
          e.UsuarioCreacion = this.getUsuarioAuth().data[0].Documento;
          e.FechaCreacion = new Date();
          e.IpCreacion = this.getIp();
        })
        this.egreso.UsuarioCreacion = this.getUsuarioAuth().data[0].Documento;
        this.egreso.FechaCreacion = new Date();
        this.egreso.IpCreacion = this.getIp();
        this.egreso.Estado = ConstanteUI.ESTADO_NUMERICO_ACTIVO;

        this.dtoClassEgreso.Egreso = this.egreso;
        this.dtoClassEgreso.Detalle = this.lstEgresoDetalle;

        /**SERVICIO */
        this.egresoService.MantenimientoEgreso(ConstanteUI.SERVICIO_SOLICITUD_NUEVO, this.dtoClassEgreso).then(resp => {
          if (resp.success) {
            this.messageShow('success', 'Success', this.getMensajeGuardado());
            this.dialog = false;
            this.bloquearPag = false;
            this.mensajeController.resultado = this.dtoClassEgreso;
            this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
          } else {
            this.messageShow('warn', 'error', this.getMensajeErrorGuardado());
          }
        })
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        /**VARIABLES DE AUDITORIA - EDITAR */
        this.lstEgresoDetalle.forEach(e => {
          e.UsuarioModificacion = this.getUsuarioAuth().data[0].Documento;
          e.FechaModificacion = new Date();
          e.IpModificacion = this.getIp();
        })

        this.egreso.UsuarioModificacion = this.getUsuarioAuth().data[0].Documento;
        this.egreso.FechaModificacion = new Date();
        this.egreso.IpModificacion = this.getIp();

        this.dtoClassEgreso.Egreso = this.egreso;

        /**SERVICIO CABECERA*/
        this.egresoService.MantenimientoEgreso(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, this.dtoClassEgreso).then(resp => {
          if (resp.success) {
            this.messageShow('success', 'Success', this.getMensajeActualizado());
            this.dialog = false;
            this.bloquearPag = false;
            this.mensajeController.resultado = this.dtoClassEgreso;
            this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
          } else {
            this.messageShow('warn', 'error', this.getMensajeErrorActualizar());
          }
        })

        /**SERVICIO DETALLE*/
        let contarEgresosEditar = 0;
        this.lstEgresoDetalle.forEach(egresoDetalle => {
          this.egresoService.MantenimientoEgresoDetalle(ConstanteUI.SERVICIO_SOLICITUD_EDITAR, egresoDetalle).then(resp => {
            if (resp.success) {



              contarEgresosEditar++;
            } else {
              this.messageShow('warn', 'error', this.getMensajeErrorActualizar());
              return;
            }
          });
        });

        if (contarEgresosEditar == this.lstEgresoDetalle.length) {
          this.messageShow('success', 'Success', this.getMensajeActualizado());
          this.dialog = false;
          this.bloquearPag = false;
          this.mensajeController.resultado = this.dtoClassEgreso;
          this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
        }
        break;
    }
    //  this.dtoClassEgreso.Egreso.Estado = 1;







  }
  nuevoDetalle(accion: string) {
    this.accionDetalle = accion;
    this.isDialogDetalle = true;
    this.isIgv = false;
  }
  async coreMensaje(mensage: MensajeController) {
    if (mensage.componente == "SELECCLIENTE") {
      this.egreso.Documento = mensage.resultado.Documento;
      this.egreso.Empleado = mensage.resultado.NombreCompleto;
      this.egreso.IdEmpleado = mensage.resultado.Persona;
    }
    if (mensage.componente == "SELECPROVEEDOR") {
      this.detalleSeleccionado.Documento = mensage.resultado.Documento;
      this.detalleSeleccionado.Proveedor = mensage.resultado.NombreCompleto;
      this.detalleSeleccionado.IdProveedor = mensage.resultado.Persona;
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

  async coreIniciarComponente(msj: MensajeController, accion: string, dtoClassEgreso?: any) {
    this.btnCerrar();
    await this.cargarCombocompania();
    await this.cargarTipoComprobante();
    await this.calcularTotalDetalleEgreso();

    //variables de entorno
    this.mensajeController = msj;
    this.acciones = accion;
    this.dialog = true;

    //auditoria
    this.usuario = this.getUsuarioAuth().data[0].NombreCompleto;
    this.fechaCreacion = new Date();
    this.fechaModificacion = undefined;
    this.bloquearPag = true;
    this.puedeEditar = false;
    let filtroegresoDetalle: DtoEgreso = new DtoEgreso();
    switch (accion) {
      case ConstanteUI.ACCION_SOLICITADA_NUEVO:
        this.egreso.FechaCreacion = new Date();
        this.egreso.FechaRegistro = new Date();
         console.log("ACCION_SOLICITADA_NUEVO", ConstanteUI.ACCION_SOLICITADA_NUEVO);
        break;
      case ConstanteUI.ACCION_SOLICITADA_EDITAR:
        this.egreso = dtoClassEgreso;
        filtroegresoDetalle.IdEgreso = this.egreso.IdEgreso;
        await this.egresoService.ListarEgresoDetalle(filtroegresoDetalle).then(resp => {
          this.lstEgresoDetalle = resp;
          console.log("resp", resp);
        })

        await this.calcularTotalDetalleEgreso();
        this.fechaCreacion = new Date(this.egreso.FechaCreacion);
        this.egreso.FechaRegistro = new Date(this.egreso.FechaRegistro);
        this.fechaModificacion = this.egreso.FechaModificacion != null || this.egreso.FechaModificacion != null ? new Date(this.egreso.FechaModificacion) : null
        break;
      case ConstanteUI.ACCION_SOLICITADA_VER:
        this.puedeEditar = true;
        this.egreso = dtoClassEgreso;
        filtroegresoDetalle.IdEgreso = this.egreso.IdEgreso;
        await this.egresoService.ListarEgresoDetalle(filtroegresoDetalle).then(resp => {
          this.lstEgresoDetalle = resp;
          console.log("resp", resp);
        })
        await this.calcularTotalDetalleEgreso();

        this.fechaCreacion = new Date(this.egreso.FechaCreacion);
        this.egreso.FechaRegistro = new Date(this.egreso.FechaRegistro);
        this.fechaModificacion = this.egreso.FechaModificacion != null || this.egreso.FechaModificacion != null ? new Date(this.egreso.FechaModificacion) : null
        break;
    }
    this.bloquearPag = false;

    // this.lstEgresoDetalle = [
    //   {
    //     num: 1,
    //     TipoComprobante: "BV",
    //     TipoDocumento: 'BOLETA',
    //     Serie: 'b001',
    //     Documento: '00953228594',
    //     Proveedor: 'KFC',
    //     Concepto: 'GASTOS DE JUZGADO',
    //     Cantidad: 1,
    //     igv: 0,
    //     Valor: 500,
    //     Total: 500
    //   },
    //   {
    //     num: 2,
    //     TipoComprobante: "BV",
    //     TipoDocumento: 'BOLETA',
    //     Serie: 'B002',
    //     Documento: '00953228283',
    //     Proveedor: 'CABIFY',
    //     Concepto: 'MOBILIDAD',
    //     Cantidad: 1,
    //     igv: 0,
    //     Valor: 50,
    //     Total: 50
    //   },
    //   {
    //     num: 3,
    //     TipoComprobante: "BV",
    //     TipoDocumento: 'BOLETA',
    //     Serie: 'B003',
    //     Documento: '00953228494',
    //     Proveedor: 'KFC',
    //     Concepto: 'ALMUERZO',
    //     Cantidad: 2,
    //     igv: 0,
    //     Valor: 50,
    //     Total: 100
    //   },
    //   {
    //     num: 4,
    //     TipoComprobante: "BV",
    //     TipoDocumento: 'BOLETA',
    //     Serie: 'B004',
    //     Documento: '00953228595',
    //     Proveedor: 'CONSULTORIO PRADO',
    //     Concepto: 'ABOGADO',
    //     Cantidad: 1,
    //     igv: 0,
    //     Valor: 300,
    //     Total: 300
    //   }
    // ];
  }
  async cargarTipoComprobante(): Promise<boolean> {
    this.lstTipoComprobante = [];
    this.lstTipoComprobante.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });

    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPOCOMPROBANTE").forEach(i => {
      this.lstTipoComprobante.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });
    console.log("lstTipoComprobante", this.lstTipoComprobante);

    if (this.lstTipoComprobante.length == 0) {
      return false;
    } else {
      return true;
    }

  }
  async cargarCombocompania(): Promise<number> {
    this.lstCompania = [];

    this.FiltroCompan.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOSELECCIONE, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.FiltroCompan).then(res => {
      console.log("probando", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.CompaniaCodigo.trim(), title: ele.Persona });
      });
      return 1;
    });
  }
  async limpiarDocumento() {
    this.egreso.Documento = '';
    this.egreso.Empleado = '';
    this.egreso.IdEmpleado = null;
  }
  async limpiarDocumentoProveedor() {
    this.detalleSeleccionado.Documento = '';
    this.detalleSeleccionado.Proveedor = '';
    this.detalleSeleccionado.IdProveedor = 0;
  }
  async verPersona(seleccion: string, esEmpleado: string) {
    this.personaBuscarComponent.coreIniciarComponente(new MensajeController(this, seleccion, 'BUSCAR'), 'BUSCAR', esEmpleado);
  }
  async SeleccioneSerie(event) {
    this.lstTipoComprobante.forEach(e => {
      if (this.detalleSeleccionado.TipoDocumento == e.value) {
        this.detalleSeleccionado.DesTipoDocumento = e.label;
        return;
      }
    });

  }

  async ingresarDetalle() {
    //  this.lstEgresoDetalle.push(this.detalleSeleccionado);

    if (this.estaVacio(this.detalleSeleccionado.TipoDocumento)) { this.messageShow('warn', 'Advertencia', 'Seleccione un tipo de documento válido'); return; }
    if (this.estaVacio(this.detalleSeleccionado.Serie)) { this.messageShow('warn', 'Advertencia', 'Ingrese una serie válida'); return; }
    if (this.estaVacio(this.detalleSeleccionado.NroDocumento)) { this.messageShow('warn', 'Advertencia', 'Ingrese un nro de recibo válido'); return; }
    if (this.estaVacio(this.detalleSeleccionado.Documento)) { this.messageShow('warn', 'Advertencia', 'Ingrese un proveedor válido'); return; }
    if (this.estaVacio(this.detalleSeleccionado.Cantidad)) { this.messageShow('warn', 'Advertencia', 'Ingrese una cantidad válida'); return; }
    if (this.estaVacio(this.detalleSeleccionado.MontoAfecto)) { this.messageShow('warn', 'Advertencia', 'Ingrese un monto válido'); return; }

    if (this.accionDetalle == ConstanteUI.ACCION_SOLICITADA_INGRESAR) {
      this.lstEgresoDetalle = await [...this.lstEgresoDetalle, this.detalleSeleccionado];
      this.isDialogDetalle = false;
      this.detalleSeleccionado.IdEgreso = this.egreso.IdEgreso;
      if (this.acciones == ConstanteUI.ACCION_SOLICITADA_EDITAR) {

        this.detalleSeleccionado.UsuarioModificacion = null;
        this.detalleSeleccionado.FechaModificacion = null;
        this.detalleSeleccionado.IpModificacion = null;
        this.detalleSeleccionado.UsuarioCreacion = this.getUsuarioAuth().data[0].Documento;
        this.detalleSeleccionado.FechaCreacion = new Date();
        this.detalleSeleccionado.IpCreacion = this.getIp();
        this.egresoService.MantenimientoEgresoDetalle(ConstanteUI.SERVICIO_SOLICITUD_NUEVO, this.detalleSeleccionado).then(resp => {
          if (resp.success) {
            this.messageShow('success', 'success', this.getMensajeGuardado());
          } else {
            this.messageShow('warn', 'error', this.getMensajeErrorActualizar());
            return;
          }
        });
      }

    }
    if (this.accionDetalle == ConstanteUI.ACCION_SOLICITADA_EDITAR) {
      await this.lstEgresoDetalle.forEach(e => {
        if (e.num == this.detalleSeleccionado.num) {
          e = this.detalleSeleccionado;
          this.isDialogDetalle = false;
          return;
        }
      });
    }

    await this.calcularTotalDetalleEgreso();
  }
  async coreEditar(detalle: any, accion: string) {
    this.isDialogDetalle = true;
    this.detalleSeleccionado = detalle;
    console.log(this.detalleSeleccionado.TipoImpuesto);
    if (this.detalleSeleccionado.TipoImpuesto == ConstanteUI.ESTADO_NUMERICO_TRUE) {
      this.isIgv = true;
    }

    this.accionDetalle = accion;
  }
  async coreinactivar(detalle: any) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: `¿Desea eliminar este detalle?`,
      key: "confirm3",
      accept: async() => {

        if (this.acciones == ConstanteUI.ACCION_SOLICITADA_EDITAR) {
          detalle.UsuarioModificacion = null;
          detalle.FechaModificacion = null;
          detalle.IpModificacion = null;
          detalle.UsuarioCreacion = this.getUsuarioAuth().data[0].Documento;
          detalle.FechaCreacion = new Date();
          detalle.IpCreacion = this.getIp();
          this.egresoService.MantenimientoEgresoDetalle(ConstanteUI.SERVICIO_SOLICITUD_ELIMINAR, detalle).then(resp => {
            if (resp.success) {
              this.lstEgresoDetalle = this.lstEgresoDetalle.filter((e) => e.NroDocumento != detalle.NroDocumento);
              this.calcularTotalDetalleEgreso();
              this.messageShow('success', 'success', this.getMensajeEliminado());
            } else {
              this.messageShow('warn', 'error', this.getMensajeErrorEliminar());
              return;
            }
          });
        }
        if (this.acciones == ConstanteUI.ACCION_SOLICITADA_NUEVO) {
          this.lstEgresoDetalle = this.lstEgresoDetalle.filter((e) => e.NroDocumento != detalle.NroDocumento);
        }
        await this.calcularTotalDetalleEgreso();
       

        console.log("this.lstEgresoDetalle", this.lstEgresoDetalle);
      }
    });
  }


  async btnCerrar() {
    this.egreso = new DtoEgreso();
    this.lstEgresoDetalle = [];
  }
  async btnCerrarDetalle() {
    this.detalleSeleccionado = new DtoEgresoDetalle();
    let filtroegresoDetalle: DtoEgresoDetalle = new DtoEgresoDetalle();
    filtroegresoDetalle.IdEgreso = this.egreso.IdEgreso;
    // await this.egresoService.ListarEgresoDetalle(filtroegresoDetalle).then(resp => {
    //   this.lstEgresoDetalle = resp;
    //   console.log("resp", resp);
    // })

    // {
    //   num: 0,
    //   TipoComprobante: '',
    //   TipoDocumento: '',
    //   Serie: '',
    //   Documento: '',
    //   Proveedor: '',
    //   Concepto: '',
    //   Cantidad: 0,
    //   igv: 0,
    //   Valor: 0,
    //   Total: 0
    // };

  }
  async validarIgv() {
    this.isIgv = this.isIgv == false ? true : false;
    this.detalleSeleccionado.TipoImpuesto = this.isIgv == false ? ConstanteUI.ESTADO_NUMERICO_FALSE : ConstanteUI.ESTADO_NUMERICO_TRUE;
    this.calcularTotal();

  }
  async calcularTotal() {

    //this.detalleSeleccionado.MontoAfecto = (1 * this.detalleSeleccionado.MontoTotal) / this.detalleSeleccionado.Cantidad;
    if (this.isIgv) {
      this.detalleSeleccionado.MontoAfecto = (this.detalleSeleccionado.MontoTotal / this.detalleSeleccionado.Cantidad) / 1.18;
      this.detalleSeleccionado.MontoImpuesto = (this.detalleSeleccionado.MontoTotal / this.detalleSeleccionado.Cantidad) - this.detalleSeleccionado.MontoAfecto;
      console.log();

    }
    if (!this.isIgv) {
      this.detalleSeleccionado.MontoAfecto = this.detalleSeleccionado.MontoTotal / 1.18;
      let igv: number = this.detalleSeleccionado.MontoTotal - this.detalleSeleccionado.MontoAfecto;
      this.detalleSeleccionado.MontoAfecto = this.detalleSeleccionado.MontoAfecto + igv;
      this.detalleSeleccionado.MontoAfecto = this.detalleSeleccionado.MontoTotal / this.detalleSeleccionado.Cantidad;
      this.detalleSeleccionado.MontoImpuesto = 0;
      // this.detalleSeleccionado.MontoAfecto = (1 * this.detalleSeleccionado.MontoTotal) / this.detalleSeleccionado.Cantidad;
    }
    this.detalleSeleccionado.Cantidad = Number.isNaN(this.detalleSeleccionado.Cantidad) ? 0 : this.detalleSeleccionado.Cantidad;
    this.detalleSeleccionado.MontoAfecto = Number.isNaN(this.detalleSeleccionado.MontoAfecto) ? 0 : this.detalleSeleccionado.MontoAfecto;
    this.detalleSeleccionado.MontoImpuesto = Number.isNaN(this.detalleSeleccionado.MontoImpuesto) ? 0 : this.detalleSeleccionado.MontoImpuesto;
    this.detalleSeleccionado.MontoTotal = Number.isNaN(this.detalleSeleccionado.MontoTotal) ? 0 : this.detalleSeleccionado.MontoTotal;
  }

  async calcularTotalDetalleEgreso() {

    this.egreso.MontoAfecto = 0
    this.egreso.MontoImpuesto = 0
    this.egreso.MontoTotal = 0;
    this.egreso.Cantidad = 0;

    this.lstEgresoDetalle.forEach(e => {
      this.egreso.Cantidad += e.Cantidad;
      this.egreso.MontoAfecto += e.MontoAfecto;
      this.egreso.MontoImpuesto += e.MontoImpuesto;
      this.egreso.MontoTotal += e.MontoTotal;
    })
  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }

}
