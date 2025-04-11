import { Component, OnInit } from '@angular/core';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { DtoReserva } from '../model/DtoReserva';
import jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
import { FLOAT } from 'html2canvas/dist/types/css/property-descriptors/float';
import { FiltroCompaniamast } from '../../../seguridad/companias/dominio/filtro/FiltroCompaniamast';
import { isMainThread } from 'worker_threads';
import { ExportarService } from '../../../framework-comun/Exportar/exportar.service';
import { DtoCompaniamast } from '../../../seguridad/companias/dominio/dto/DtoCompaniamast';
import { FiltroPersona } from '../../../maestros/persona/dominio/filtro/FiltroPersona';
import { PersonaService } from '../../../framework-comun/Persona/servicio/persona.service';
import { PersonamastComponent } from '../../../maestros/persona/vista/personamast.component';
import { dtoPersona } from '../../../framework-comun/Persona/dominio/dto/dtoPersona';
import { Image } from '../../../seguridad/companias/dominio/dto/image';
import html2pdf from 'html2pdf.js';


@Component({
  selector: 'ngx-reserva-imprimir',
  templateUrl: './reserva-imprimir.component.html',
  styleUrls: ['./reserva-imprimir.component.scss']
})
export class ReservaImprimirComponent extends ComponenteBasePrincipal implements OnInit {
  bloquearPag: boolean;
  validarform: string = null;
  acciones: string = "";
  position: string = "top";
  puedeEditar: boolean = false;
  dto: DtoReserva;

  company?: any[] = [];
  logo: string;

  //DTOS
  compania: DtoCompaniamast = new DtoCompaniamast();
  persona: dtoPersona = new dtoPersona();
  personaCompania: dtoPersona = new dtoPersona();
  logoCompania: string = '';
  fechaActual = new Date();
  opcionesFormato = { day: 'numeric', month: 'long', year: 'numeric' };

  constructor(
    private maestroSucursalService: MaestroSucursalService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private personaService: PersonaService,
    private exportarService: ExportarService,

  ) {
    super();
  }

  ngOnInit(): void {
    // const p1 = this.getCompania();

    // Promise.all([p1]).then(res => {

    // });
  }

  async coreIniciarComponente(msj: MensajeController, accion: string, titulo, rowdata?: any) {
    this.bloquearPag = true;
    this.mensajeController = msj;
    this.validarform = accion;
    this.acciones = `${titulo} ${accion}`;
    this.dialog = true;
    console.log("coreIniciarComponente rowdata", rowdata)
    var mmlote = rowdata.Lote;
    var mmproyecto = rowdata.NomProyecto;
    this.dto = rowdata;
   // this.dto.Lote = mmproyecto +" "+ mmlote;
    this.dto.IdReserva = this.dto.IdReserva.toString().padStart(6,'0');
    this.dto.FechaFinal = new Date(this.dto.FechaFinal);
    console.log("coreIniciarComponente this.dto", this.dto);

    this.compania = await this.obtenerCompanias(rowdata.CompaniaCodigo);
    this.persona = await this.obtenerPersona(rowdata.Documento);
    this.personaCompania = await this.obtenerPersona(this.compania.RUC?.trim() || this.compania.RUC);

    let imagenEnviar: Image;
    let filtroImg: Image = new Image();
    filtroImg.Tabla = 'COMPANY';
    filtroImg.IdTabla = this.compania.Persona;
    imagenEnviar = await this.getImagenes(filtroImg);

    let arraynombreImg = [];
    // arraynombreImg = imagenEnviar.NombrePDF.split('.');
    
    console.log("CompaniaCodigo", this.compania);
    this.logoCompania = await this.obtenerImagenCompania(this.compania);
    console.log("persona", this.persona);
    console.log("personaCompania", this.personaCompania);
    // console.log("imagenEnviar", imagenEnviar);
    console.log("logoCompania", this.logoCompania);
    this.bloquearPag = false;
  }

  async obtenerCompanias(idCompania: any): Promise<any> {
    let filtro: FiltroCompaniamast = new FiltroCompaniamast();
    filtro.companiacodigo = idCompania;
    let data = await this.maestrocompaniaMastService.listarCompaniaMast(filtro);
    return data[0];
  }

  async obtenerPersona(documento: any): Promise<any> {

    let filtro: any = {
      Estado: 'A',
      TipoPersona: null,
      EsEmpleado: 'N',
      Documento: documento
    };

    let data = await this.personaService.listarpaginado(filtro);
    return data[0];
  }

  async getImagenes(filtroImg: Image): Promise<Image> {
    filtroImg.Estado = 1
    const imagenes: Image[] = await this.maestrocompaniaMastService.MantenimientoFileVer(filtroImg, this.getUsuarioToken());
    if (filtroImg.IdTabla == undefined || filtroImg.IdTabla == null) {
      //this.messageService.add({ key: 'bc', severity: 'warn', summary: 'Advertencia', detail: 'Imagen no obtenida' });
    }
    console.log("getImagenes", imagenes);
    return imagenes[0];
  }


  generarPDF() {
     this.bloquearPag = true;
    
     var canvas: HTMLElement = document.getElementById('boleta');
    html2pdf()
    .set({
      margin: 10,
      filename: 'Recibo de pago.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      className: 'boleta'
    })
    .from(canvas)
    .save();
    this.bloquearPag = false;
  }



  async obtenerImagenCompania(row): Promise<any> {
    this.bloquearPag = true;
    let filtroImg: Image = new Image();
    filtroImg.Tabla = 'COMPANY';
    filtroImg.IdTabla = row.Persona;
    const imagenEnviar: Image = await this.getImagenes(filtroImg);
    console.log('TRAIDAAAA', imagenEnviar);
    imagenEnviar
    this.bloquearPag = false;

    let arraynombreImg = imagenEnviar.NombrePDF?.split('.') || '';
    let image = `data:image/${arraynombreImg[arraynombreImg.length - 1]};base64,${imagenEnviar.Contenido}`;

    return image;
  }


}
