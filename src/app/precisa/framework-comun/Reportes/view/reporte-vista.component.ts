import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { PdfJsViewerComponent, PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { MessageService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UISelectorController } from '../../../../../util/UISelectorController';
import { ConstanteAngular } from '../../../../@theme/ConstanteAngular';


@Component({
  selector: 'ngx-reporte-vista',
  templateUrl: './reporte-vista.component.html'
})
export class ReporteVistaComponent extends ComponenteBasePrincipal implements OnInit, UISelectorController {

  @ViewChild('pdfViewerContrato', { static: false }) pdfViewerContrato;
  verReporteModal: boolean = false;
  validarAccion: string;
  acciones: string = ''
  position: string = 'top'
  titulo: string;

  viewReporte: string;


  constructor(
    private toastrService: NbToastrService,
  ) { super(); }

  ngOnInit(): void {
    this.titulo = '';

    Promise.all([]).then(resp => {

    });

  }



  coreBusquedaRapida(filtro: string): void {
    throw new Error('Method not implemented.');
  }
  coreBuscar(tabla: Table): void {
    throw new Error('Method not implemented.');
  }
  coreFiltro(flag: boolean): void {
    throw new Error('Method not implemented.');
  }
  coreSalir(): void {
    //  this.mensajeController.componenteDestino.desbloquearPagina();        
    this.verReporteModal = false;
  }

  coreSeleccionar(dto: any): void {
    this.mensajeController.resultado = dto;
    this.mensajeController.componenteDestino.coreMensaje(this.mensajeController);
    this.coreSalir();
  }




  coreExportar(tipo: string): void {
    throw new Error('Method not implemented.');
  }
  coreMensaje(mensage: MensajeController): void {

  }


  coreAccion(accion: string): void {
    throw new Error('Method not implemented.');
  }


  coreIniciarComponente(mensaje: MensajeController): void {
    this.mensajeController = mensaje;
    console.log("ENTRO NUEVO COMPONENTE", this.mensajeController);
    this.verReporteModal = true;
    this.titulo = '';
    this.acciones = `${this.titulo}: ${this.mensajeController.tipo}`;
  }

  coreIniciarComponentemantenimiento(mensaje: MensajeController, accionform: string, reporte: any): void {
    this.mensajeController = mensaje;
    console.log("ENTRO NUEVO COMPONENTE", this.mensajeController);
    this.verReporteModal = true;
    this.titulo = '';
    this.acciones = `${this.titulo}: ${accionform}`;
    this.validarAccion = accionform;
    console.log(":: reporte", reporte)
    // this.viewReporte = reporte
    //console.log("this.viewReporte", this.viewReporte)
    this.pdfViewerContrato = new PdfJsViewerComponent;

    // var blob = new Blob([reporte], { type: 'application/pdf' })
    var blob = new Blob([reporte])
    console.log("blob", blob)
    const link = window.URL.createObjectURL(blob);
    console.log("link", link)

    console.log("::::: var pdfViewerContrato", this.pdfViewerContrato)
    //this.pdfViewerContrato = pdfViewerContrato
    this.pdfViewerContrato.pdfSrc = link;
    this.pdfViewerContrato.refresh();

    // console.log("After setter  this.pdfViewerContrato", this.pdfViewerContrato)


    // if (accionform == "NUEVO") {
    // } else if (accionform == "EDITAR") {
    // } else if (accionform == "VER") {
    // }

  }

  makeToast(title: string) {
    this.toastrService.show(null, `${title}`, this.showToast(this.status))
  }

}
