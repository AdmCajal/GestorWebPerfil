import { Image } from './../../../seguridad/companias/dominio/dto/image';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { MaestroSucursalService } from '../../../maestros/Sedes/servicio/maestro-sucursal.service';
import { MaestrocompaniaMastService } from '../../../seguridad/companias/servicio/maestrocompania-mast.service';
import { ImgService } from '../service/img.service';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'ngx-lotes-imagen',
  templateUrl: './lotes-imagen.component.html',
  styleUrls: ['./lotes-imagen.component.scss']
})
export class LotesImagenComponent extends ComponenteBasePrincipal implements OnInit {
  validarform: string = null;
  acciones: string = '';
  position: string = 'top';
  bloquearPag: boolean;
  seleccion: any;
  products: any[] = [];
  displayBasic:boolean =false;
  constructor(
    private maestroSucursalService: MaestroSucursalService,
    private maestrocompaniaMastService: MaestrocompaniaMastService,
    private messageService: MessageService,
    private photoService: ImgService
  ) {
    super();
  }

  ngOnInit(): void {
  }
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  iniciarComponenteMaestro(msj: MensajeController, accion: string, titulo, rowdata?: Image[],) {
    this.products = [];
    if (rowdata.length != 0) {

      this.mensajeController = msj;
      this.validarform = accion;
      this.acciones = `${titulo.toUpperCase()}: IMAGENES`;
      this.dialog = true;
      let arraynombreImg: string[] = [];
      console.log("rowdata", rowdata);

      rowdata = rowdata.filter((e) => e.NombrePDF != null); 
      for (let e of rowdata) {
        arraynombreImg = e.NombrePDF?.split('.')||[];
        this.products.push({ image: `data:image/${arraynombreImg[arraynombreImg.length - 1]};base64,${e.Contenido}` });
      }
      console.log("products",this.products);
      
    }
  }
}



export interface ModelImage {
  previewImageSrc: string;
  thumbnailImageSrc: string;
  alt: string;
}
