import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, TreeDragDropService } from 'primeng/api';
import { ComponenteBasePrincipal } from '../../../../../util/ComponenteBasePrincipa';
import { MensajeController } from '../../../../../util/MensajeController';
import { UIMantenimientoController } from '../../../../../util/UIMantenimientoController';
import { Maestro } from '../../FormMaestro/model/maestro';
import { TipoTrabajadorMantenimientoComponent } from '../components/tipo-trabajador-mantenimiento.component';
import { NodeService } from '../Service/nodeservice';
import { TreeNode } from 'primeng/api';
import Swal from 'sweetalert2';


@Component({
  selector: 'ngx-tipo-trabajador',
  templateUrl: './tipo-trabajador.component.html',
  providers: [TreeDragDropService, MessageService],
  styles: [`
      h4 {
          text-align: center;
          margin: 0 0 8px 0;
      }
  `]
})
export class TipoTrabajadorComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
  @ViewChild(TipoTrabajadorMantenimientoComponent, { static: false }) tipoTrabajadorMantenimientoComponent: TipoTrabajadorMantenimientoComponent;
  dto: Maestro[] = [];
  dtoFile: Maestro[] = [];
  files1: TreeNode[];
  files2: TreeNode[];
  files3: TreeNode[];
  files4: TreeNode[];
  bloquearPag: boolean;
  selectedFiles: TreeNode;
  private fileTmp: any;
  nombrearchivo: string;
  file: File = null;
  constructor(
    private nodeService: NodeService,
    private messageService: MessageService) {
    super();
  }

  coreMensaje(mensage: MensajeController): void {
    throw new Error('Method not implemented.');
  }

  coreNuevo(): void {
    if (this.fileTmp == null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: `Debe seleccionar una Ruta`
      })
      return;
    }
    this.tipoTrabajadorMantenimientoComponent.iniciarComponente("NUEVO", this.objetoTitulo.menuSeguridad.titulo,this.fileTmp)
  }

  coreBuscar(): void {
    throw new Error('Method not implemented.');
  }

  coreGuardar(): void {
    throw new Error('Method not implemented.');
  }

  coreExportar(): void {
    console.log("btn coreExportar:");
    if (this.fileTmp == null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: `Debe seleccionar una Ruta`
      })
      return;
    }
    this.tipoTrabajadorMantenimientoComponent.iniciarComponente("Exportar", this.objetoTitulo.menuSeguridad.titulo,this.fileTmp);
  }
  coreSalir(): void {
    throw new Error('Method not implemented.');
  }

  coreVer(dto) {
    console.log("btn coreVer:");
    this.tipoTrabajadorMantenimientoComponent.iniciarComponente("VER", this.objetoTitulo.menuSeguridad.titulo,dto);
  }

  coreEditar(dto) {
    console.log("btn coreEditar:");
    this.tipoTrabajadorMantenimientoComponent.iniciarComponente("EDITAR", this.objetoTitulo.menuSeguridad.titulo,dto)
  }

  ngOnInit(): void {
    this.bloquearPag = true;
    this.tituloListadoAsignar(1, this);
    this.iniciarComponent();
    let dw = new Maestro();
    dw.CodigoTabla = "01";
    dw.Descripcion = "PRUEBA DESCRI";
    dw.Nombre = "NOMBRE DETALLE";
    dw.Estado = 2;
    this.dto.push(dw);
    this.bloquearPag = false;


    let ObjRuta = { Nombre: "C:\\ARCHIVO\\SERVER\\"}
    this.nodeService.listarFiles(ObjRuta).then(response => {
      Swal.close()
      if (response) {
      var  xdtoFile = response;
      this.files2 = xdtoFile.data;
      console.log("Error: Miscelaneos", xdtoFile);
      } else {
        console.log("Error: Miscelaneos", JSON.stringify(response));
      }
    })

   // this.nodeService.getFiles().then(files => this.files1 = files);
    //this.nodeService.getFiles().then(files => this.files2 = files);

    this.files3 = [{
      label: "Backup",
      data: "Backup Folder",
      expandedIcon: "pi pi-folder-open",
      collapsedIcon: "pi pi-folder"
    }
    ];

    this.files4 = [{
      label: "Storage",
      data: "Storage Folder",
      expandedIcon: "pi pi-folder-open",
      collapsedIcon: "pi pi-folder"
    } ];
  }


  subirArchivo(fs: any) {
    console.log("Ruta:",this.fileTmp);
    if (this.fileTmp == null) {
      Swal.fire({
        icon: 'warning',
        title: '¡Mensaje!',
        text: `Debe seleccionar una Ruta`
      })
    } else {
        if (this.fileTmp.children == null) {
          Swal.fire({
            icon: 'warning',
            title: '¡Mensaje!',
            text: `Debe seleccionar una Carpeta`
          })
        } else {
          fs.click();
          console.log("nombre archivo:", fs);
        }
    }   
  }


exportar(event: any) {
  console.log("btn exportar:", event);
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
      if (this.file.size > 1048576) {
        Swal.fire({
          icon: 'warning',
          title: '¡Mensaje!',
          text: `El archivo es demasiado grande.`
        })
        return
      }
      console.log("FILE:", this.file)
      this.nombrearchivo = this.file.name;
      const reader = new FileReader();
      reader.readAsDataURL(this.file);
    }
}


  nodeSelect(event) {
    this.fileTmp = null;
    console.log(event.node);
    this.fileTmp=event.node;
  }

  getFile($event : any):void {
    console.log($event.target.files);
    const[ file ]=$event.target.files;
    this.fileTmp=
      {
      fileRaw:file,
      fileName:file.name
      }
      console.log($event.target.files);
}


sendFile():void {
const body = new FormData();
body.append('myFile',this.fileTmp.fileRaw,this.fileTmp.fileName);
this.nodeService.sendPost(body).subscribe(res => console.log(res)) 
}



}
