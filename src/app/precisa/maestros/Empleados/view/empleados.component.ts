
import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { UsuarioAuth } from '../../../auth/model/usuario';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { Maestro } from '../../FormMaestro/model/maestro';
import { EmpleadosMantenimientoComponent } from '../components/empleados-mantenimiento.component';
import { EmpleadoMast } from '../model/empleadomast';
import { filtroEmpleadoMast } from '../model/filtro.empleadomast';
import { IEmpleado } from '../model/iempleado';
import { EmpleadoMastService } from '../service/empleadomast.service';
import { ConstanteUI } from '../../../../../util/Constantes/Constantes';

@Component({
  selector: 'ngx-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})

export class EmpleadosComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(EmpleadosMantenimientoComponent, { static: false }) empleadosMantenimientoComponent: EmpleadosMantenimientoComponent;
  bloquearPag: boolean;
  usuarioAuth: UsuarioAuth = new UsuarioAuth();
  editarTipoDocumento: boolean = false;
  lstTipoDocumento: SelectItem[] = [];
  lstCompania: SelectItem[] = [];
  lstCargo: SelectItem[] = [];
  lstEstados: SelectItem[] = [];
  filtrocompa: FiltroCompaniamast = new FiltroCompaniamast();
  filtro: filtroEmpleadoMast = new filtroEmpleadoMast();
  Entydad: EmpleadoMast = new EmpleadoMast()
  lstEmpleado: any[] = [];
  ltsExportar: MenuItem[];
  dto: Maestro[] = []

  constructor(
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private EmpleadoMastService: EmpleadoMastService,
    private exportarService: ExportarService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,) {
    super();
  }
  coreMensaje(mensage: MensajeController): void {
    if (mensage.componente == "SELECTOR_EMPLEADO") {
      this.coreBuscar();
    }
  }

  coreNuevo(): void {
    this.empleadosMantenimientoComponent.iniciarComponente(new MensajeController(this, 'SELECTOR_EMPLEADO', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);

  }

  coreVer(dto) {
    console.log("llego BtncoreEditar  ", dto);
    this.Entydad = dto;
    this.empleadosMantenimientoComponent.iniciarComponente(new MensajeController(this, 'SELECTOR_EMPLEADO', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, this.Entydad);


  }

  coreEditar(dto) {
    console.log("llego BtncoreEditar  ", dto);
    this.Entydad = dto;
    this.empleadosMantenimientoComponent.iniciarComponente(new MensajeController(this, 'SELECTOR_EMPLEADO', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, this.Entydad);

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

  validarTeclaEnter(evento) {
    if (evento.key == "Enter") {
      this.coreBuscar();
    }
  }



  onRowSelect(event: any) {
    console.log("seleccion onRowSelect:", event);
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent()
    const p1 = this.listarComboEstados();
    const p2 = this.listaComboTipoDocumento();
    const p3 = this.listaComboCargo();
    const p4 = this.cargarCombocompania();
    this.bloquearPag = false;
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
    Promise.all([p1, p2, p3, p4]).then(
      f => {
        setTimeout(() => {
          this.bloquearPag = false;
        }, 100);
      });
  }



  listarComboEstados() {
    this.lstEstados.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.lstEstados.push({ label: 'Activo', value: "A" });
    this.lstEstados.push({ label: 'Inactivo', value: "I" });
  }

  listaComboTipoDocumento() {
    this.lstTipoDocumento.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "TIPODOCIDENTID").forEach(i => {
      this.lstTipoDocumento.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  listaComboCargo() {
    this.lstCargo.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "CARGX").forEach(i => {
      this.lstCargo.push({ label: i.Nombre, value: i.Codigo })
    });
  }

  cargarCombocompania(): Promise<number> {
    this.filtrocompa.estado = "A";
    this.lstCompania.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    return this.maestrocompaniaMastService.listarCompaniaMast(this.filtrocompa).then(res => {
      console.log("company", res);
      res.forEach(ele => {
        this.lstCompania.push({ label: ele.DescripcionCorta.trim(), value: ele.CompaniaCodigo.trim() + '00' });
      });
      return 1;
    });
  }


  coreBuscar(): void {
    this.bloquearPag = true;
    console.log("llego coreBuscar");

    if (this.filtro.CompaniaSocio == "") {
      this.filtro.CompaniaSocio = null;
    }
    if (this.filtro.NombreCompleto == "") {
      this.filtro.NombreCompleto = null;
    }
    if (this.filtro.Cargo == "") {
      this.filtro.Cargo = null;
    }
    if (this.filtro.Estado == "") {
      this.filtro.Estado = null;
    }


    this.EmpleadoMastService.listarEmpleadoMast(this.filtro).then((res) => {

      let contado: number = 1;

      res.forEach((element) => {
        element.num = contado++;
        element.valorEnSoles = element.Valor * element.TipoCambio;
        element.valorEnsolesTotal = element.ValorTotal * element.TipoCambio;
        //element.descEstado = element.Estado == 1 ? "Activo" : "Inactivo";
      });
      this.lstEmpleado = res;
      this.bloquearPag = false;
    });
    console.log("llego coreBuscar", this.lstEmpleado);
  }

  coreinactivar(dtoInactivar) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm",
      accept: async () => {
        /**AUDITORIA */
        dtoInactivar.UltimoUsuario = this.getUsuarioAuth().data[0].Documento;
        dtoInactivar.UltimaFechaModif = new Date();
        dtoInactivar.Estado = 'I';
        const respInactivar = await this.EmpleadoMastService.mantenimientoEmpleadoMast(ConstanteUI.SERVICIO_SOLICITUD_INACTIVAR, dtoInactivar, this.getUsuarioToken());
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
      }
    });
  }
  async messageShow(_severity: string, _summary: string, _detail: string) {
    this.messageService.add({ key: 'bc', severity: _severity, summary: _summary, detail: _detail, life: 1000 });
  }


  // coreBuscar(): void {

  //   console.log("coreBuscar filtro", this.filtro);
  //   this.bloquearPag = true;

  //   this.EmpleadoMastService.listarEmpleadoMast(this.filtro).then((res) => {
  //     var contado = 1;
  //     res.forEach(element => {
  //       element.num = contado++;
  //     });
  //     console.log("consulta listarEmpleado:", res);
  //     this.lstEmpleado = res;
  //     setTimeout(() => {
  //       this.bloquearPag = false;
  //     }, 500);
  //   });

  // }


  async exportExcel() {
    if (this.lstEmpleado == null || this.lstEmpleado == undefined || this.lstEmpleado.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      this.bloquearPag = await true;
      let listaExportar: IEmpleado[] = [];
      let contador: number = 0;
      let fechaCreacion: string;
      let fechaInicio: string;
      let fechaFin: string;
      let fechaCese: string;
      this.lstEmpleado.forEach(function (e: EmpleadoMast) {
        contador += 1;

        if (e.FechaCreacion != null || e.FechaCreacion != undefined) {
          let FechaCreacion = new Date(e.FechaCreacion);
          let dd = ("0" + FechaCreacion.getDate()).slice(-2);
          let mm = ("0" + (FechaCreacion.getMonth() + 1)).slice(-2);
          let yyyy = FechaCreacion.getFullYear()
          fechaCreacion = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaCreacion = '';
        }

        if (e.FechaInicioContrato != null || e.FechaInicioContrato != undefined) {
          let FechaInicio = new Date(e.FechaInicioContrato);
          let dd = ("0" + FechaInicio.getDate()).slice(-2);
          let mm = ("0" + (FechaInicio.getMonth() + 1)).slice(-2);
          let yyyy = FechaInicio.getFullYear()
          fechaInicio = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaInicio = '';
        }

        if (e.FechaCese != null || e.FechaCese != undefined) {
          let FechaCese = new Date(e.FechaCese);
          // let dd = FechaCese.getDate() <= 9 ? "0" + FechaCese.getDate() : FechaCese.getDate();
          // let mm = FechaCese.getMonth() == 0 ? "01" : FechaCese.getMonth() <= 9 ? "0" + FechaCese.getMonth() : FechaCese.getMonth() + 1;
          let dd = ("0" + FechaCese.getDate()).slice(-2);
          let mm = ("0" + (FechaCese.getMonth() + 1)).slice(-2);
          let yyyy = FechaCese.getFullYear()
          fechaCese = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaCese = '';
        }

        if (e.FechaFinContrato != null || e.FechaFinContrato != undefined) {
          let FechaFin = new Date(e.FechaFinContrato);
          // let dd = FechaCese.getDate() <= 9 ? "0" + FechaCese.getDate() : FechaCese.getDate();
          // let mm = FechaCese.getMonth() == 0 ? "01" : FechaCese.getMonth() <= 9 ? "0" + FechaCese.getMonth() : FechaCese.getMonth() + 1;
          let dd = ("0" + FechaFin.getDate()).slice(-2);
          let mm = ("0" + (FechaFin.getMonth() + 1)).slice(-2);
          let yyyy = FechaFin.getFullYear()
          fechaFin = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaFin = '';
        }


        let itemExportar: IEmpleado = {

          NRO: contador,
          TIPO_DOCUMENTO: e.DesDocumento?.toUpperCase() || '',
          DOCUMENTO_EMPLEADO: e.DocumentoIdentidad,
          EMPLEADO: e.NombreCompleto?.toUpperCase() || '',
          FECHA_INICIO: fechaInicio,
          FECHA_FIN: fechaFin,
          COMPAÑIA: e.UneDescripcion?.toUpperCase() || '',
          CARGO: e.DesCargo?.toUpperCase() || '',
          EMAIL: e.CorreoInterno?.toUpperCase() || '',
          TELEFONO: e.Telefono,
          DIRECCION: e.Direccion?.toUpperCase() || '',
          FECHA_CESE: fechaCese,
          ESTADO: e.DescEstado?.toUpperCase() || '',
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });

      const result = await this.exportarService.exportExcel(this.lstEmpleado, listaExportar, "Empleados");
      console.log(result);

      this.bloquearPag = await false;
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });
    }
  }

  //pdf

  async exportPdf() {
    if (this.lstEmpleado == null || this.lstEmpleado == undefined || this.lstEmpleado.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      this.bloquearPag = await true;
      var col = [[
        "NRO",
        "FECHA",
        "COMPAÑIA",
        "TIPO_DOCUMENTO",
        "DOCUMENTO",
        "EMPLEADO",
        "CARGO",
        "EMAIL",
        "FECHA_INICIO",
        // "FECHA_CESE",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaInicio: string;
      let fechaCreacion: string;
      this.lstEmpleado.forEach(function (e: EmpleadoMast) {
        contador += 1;

        if (e.FechaInicioContrato != null || e.FechaInicioContrato != undefined) {
          let FechaInicio = new Date(e.FechaInicioContrato);
          let dd = ("0" + FechaInicio.getDate()).slice(-2);
          let mm = ("0" + (FechaInicio.getMonth() + 1)).slice(-2);
          let yyyy = FechaInicio.getFullYear()
          fechaInicio = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaInicio = '';
        }

          let FechaCreacion = new Date(e.FechaCreacion);
          let dd = ("0" + FechaCreacion.getDate()).slice(-2);
          let mm = ("0" + (FechaCreacion.getMonth() + 1)).slice(-2);          
          let yyyy = FechaCreacion.getFullYear()
          fechaCreacion = dd + "/" + mm + "/" + yyyy;


        let itemExportar = [
          contador,
          fechaCreacion,
          e.UneDescripcion?.toUpperCase() || '',
          e.DesDocumento?.toUpperCase() || '',
          e.DocumentoIdentidad,
          e.NombreCompleto?.toUpperCase() || '',
          e.DesCargo?.toUpperCase() || '',
          e.CorreoInterno?.toUpperCase() || '',
          fechaInicio,
          // fechaCese,
          e.DescEstado?.toUpperCase() || ''
        ];
        rows.push(itemExportar);
      });

      const result = await this.exportarService.ExportPdf(this.lstEmpleado, col, rows, "Empleados.pdf", "l");
      console.log("result", result);
      this.bloquearPag = await false;
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }

  }

}
