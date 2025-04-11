import { Image } from './../dominio/dto/image';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, SelectItem } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';
import { iCompania } from '../dominio/dto/icompania';
import { FiltroCompaniamast } from '../dominio/filtro/FiltroCompaniamast';
import { MaestrocompaniaMastService } from '../servicio/maestrocompania-mast.service';
import { CompaniamastMantenimientoComponent } from './components/companiamast-mantenimiento.component';
import { DtoCompaniamast } from '../dominio/dto/DtoCompaniamast';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { LotesImagenComponent } from '../../../proyecto/Lotes/lotes-imagen/lotes-imagen.component';

@Component({
  selector: 'ngx-companias',
  templateUrl: './companias.component.html',
  styleUrls: ['./companias.component.scss']
})
export class CompaniasComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {

  lstCompanias: any[] = []
  lstEstado: SelectItem[] = [];
  bloquearPag: boolean = false;
  lstCompaniatb: any[] = [];
  ltsExportar: MenuItem[];
  filtro: FiltroCompaniamast = new FiltroCompaniamast();

  @ViewChild(CompaniamastMantenimientoComponent, { static: false }) companiamastMantenimientoComponent: CompaniamastMantenimientoComponent;
  @ViewChild(LotesImagenComponent, { static: false })
  lotesImagenComponent: LotesImagenComponent;

  constructor(
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private exportarService: ExportarService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.tituloListadoAsignar(1, this)
    const p1 = this.cargarEstados();
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
    Promise.all([p1]).then((resp) => {

    });
  }
  coreMensaje(mensage: MensajeController): void {

    console.log("entro company listado:", mensage.componente);
    if (mensage.componente == "SELECTOR_COMPANY") {
      this.coreBuscar();
    }
  }

  coreNuevo(): void {
    this.companiamastMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_COMPANY', ''), "NUEVO", this.objetoTitulo.menuSeguridad.titulo);
  }
  coreEditar(row) {
    this.companiamastMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_COMPANY', ''), "EDITAR", this.objetoTitulo.menuSeguridad.titulo, row);
  }
  coreVer(row) {
    this.companiamastMantenimientoComponent.iniciarComponenteMaestro(new MensajeController(this, 'SELECTOR_COMPANY', ''), "VER", this.objetoTitulo.menuSeguridad.titulo, row);
  }

  async coreVerImagen(row) {
    this.bloquearPag = true;
    let filtroImg: Image = new Image();
    filtroImg.Tabla = 'COMPANY';
    filtroImg.IdTabla = row.Persona;
    const imagenEnviar: Image = await this.getImagenes(filtroImg);
    console.log('TRAIDAAAA', imagenEnviar);
    if (imagenEnviar != undefined && imagenEnviar.Contenido != undefined) {
      this.lotesImagenComponent.iniciarComponenteMaestro(new MensajeController(this, "SELECTOR_LOTE", ""), "VER",
        this.objetoTitulo.menuSeguridad.titulo, [imagenEnviar]);
    } else {
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Imagen no obtenida' });
    }
    this.bloquearPag = false;
  }

  coreBuscar(): void {
    this.bloquearPag = true;
    this.maestrocompaniaMastService.listarCompaniaMast(this.filtro).then((res: any[]) => {
      this.bloquearPag = false;
      let contado: number = 1;
      res.forEach(element => {
        element.num = contado++;
      });
      this.lstCompaniatb = res;
      console.log("maestro CompaniaMast listado:", res);
    });
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



  cargarEstados() {
    this.lstEstado = [];
    this.lstEstado.push({ label: ConstanteAngular.COMBOTODOS, value: null });
    this.getMiscelaneos().filter(x => x.CodigoTabla == "ESTLETRAS").forEach(i => {
      this.lstEstado.push({ label: i.Nombre.trim(), value: i.Codigo.trim() });
    });
  }

  defaultBuscar(event) {
    if (event.keyCode === 13) {
      this.coreBuscar();
    }
  }

  coreinactivar(row) {
    this.confirmationService.confirm({
      header: "Confirmación",
      icon: "fa fa-question-circle",
      message: "¿Desea inactivar este registro ? ",
      key: "confirm2",
      accept: () => {
        row.estado = 'I';
        this.maestrocompaniaMastService.mantenimientoMaestro(3, row, this.getUsuarioToken()).then(
          res => {
            if (res != null) {
              this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'Anulado con éxito.' });
              this.coreBuscar();
            }
          });
      },

    });
  }

  exportExcel() {
    if (this.lstCompaniatb == null || this.lstCompaniatb == undefined || this.lstCompaniatb.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {
      let listaExportar: iCompania[] = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstCompaniatb.forEach(function (e: DtoCompaniamast) {
        contador += 1;

        if (e.FechaCreacion != null || e.FechaCreacion != undefined) {
          let fechaInicio = new Date(e.FechaCreacion);
          let dd = ("0" + fechaInicio.getDate()).slice(-2);
          let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);          let yyyy = fechaInicio.getFullYear()
          fechaCreacion = dd + "/" + mm + "/" + yyyy;

        } else {
          fechaCreacion = '';
        }



        let ubigeo = e.Ubigeo != null ? e.Ubigeo.split(',') : ['', '', ''];

        let itemExportar: iCompania = {
          NUM: contador,
          FECHA: fechaCreacion,
          DOCUMENTO_RAZON_SOCIAL: e.RUC.trim(),
          NOMBRE_RAZON_SOCIAL: e.DescripcionCorta.toUpperCase(),
          DOCUMENTO_REPRESENTANTE: e.DocumentoFiscal.trim(),
          NOMBRE_REPRESENTANTE: e.RepresentanteLegal != null ? e.RepresentanteLegal.toUpperCase() : '',
          PAGINA_WEB: e.DireccionComun != null ? e.DireccionComun.toUpperCase() : '',
          CORREO: e.DireccionAdicional != null ? e.DireccionAdicional.toUpperCase() : '',
          TELEFONO: e.Telefono1 != null ? e.Telefono1.trim() : '',
          DEPARTAMENTO: ubigeo[0] != null ? ubigeo[0] : '',
          PROVINCIA: ubigeo[1] != null ? ubigeo[1] : '',
          DISTRITO: ubigeo[2] != null ? ubigeo[2] : '',
          ESTADO: e.ESTADOdesc.toUpperCase()
        };
        // Monto_Separacion:  new Intl.NumberFormat().format(element.ValorSeparacion),
        listaExportar.push(itemExportar);
      });
      this.exportarService.exportExcel(this.lstCompaniatb, listaExportar, "Compañia");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo EXCEL Generado.",
      });
    }
  }


  exportPdf() {
    if (this.lstCompaniatb == null || this.lstCompaniatb == undefined || this.lstCompaniatb.length == 0) {
      this.messageService.add({
        key: "bc",
        severity: "warn",
        summary: "Warning",
        detail: "Realice Busqueda primero",
      });
    } else {

      var col = [[
        "NUM",
        "FECHA",
        "RUC",
        "NOMBRE_RAZON_SOCIAL",
        "DOC_REPRESENTANTE",
        "NOMBRE_REPRESENTANTE",
        "TELEFONO",
        "ESTADO"
      ]];
      var rows = [];
      let contador: number = 0;
      let fechaCreacion: string;
      this.lstCompaniatb.forEach(function (e: DtoCompaniamast) {
        contador += 1;

        if (e.FechaCreacion != null || e.FechaCreacion != undefined) {
          let fechaInicio = new Date(e.FechaCreacion);
          let dd = ("0" + fechaInicio.getDate()).slice(-2);
          let mm = ("0" + (fechaInicio.getMonth() + 1)).slice(-2);           let yyyy = fechaInicio.getFullYear()
          fechaCreacion = dd + "/" + mm + "/" + yyyy;
        } else {
          fechaCreacion = '';
        }

        let ubigeo = e.Ubigeo != null ? e.Ubigeo.split(',') : ['', '', ''];

        let itemExportar = [
          contador,
          fechaCreacion,
          e.RUC.trim(),
          e.DescripcionCorta.toUpperCase(),
          e.DocumentoFiscal.toUpperCase(),
          e.RepresentanteLegal != null ? e.RepresentanteLegal.toUpperCase() : '',
          e.Telefono1 != null ? e.Telefono1.trim() : '',
          e.ESTADOdesc.toUpperCase()
        ];
        rows.push(itemExportar);
      });

      this.exportarService.ExportPdf(this.lstCompaniatb, col, rows, "Compañia.pdf", "l");
      this.messageService.add({
        key: "bc",
        severity: "success",
        summary: "Success",
        detail: "Archivo PDF Generado.",
      });
    }
  }

  async getImagenes(filtroImg: Image): Promise<Image> {
    filtroImg.Estado = 1
    if(filtroImg.IdTabla == undefined || filtroImg.IdTabla == null){
      this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Imagen no obtenida' });
      return;
    }
    const imagenes: Image[] = await this.maestrocompaniaMastService.MantenimientoFileVer(filtroImg, this.getUsuarioToken());

    console.log("WAKANDA FOREVER", imagenes);
    return imagenes[0];
  }
}
