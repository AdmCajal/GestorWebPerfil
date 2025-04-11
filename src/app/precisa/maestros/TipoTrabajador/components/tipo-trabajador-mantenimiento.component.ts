import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";



@Component({
    selector: 'ngx-tipo-trabajador-mantenimiento',
    templateUrl: './tipo-trabajador-mantenimiento.component.html'
  })
export class TipoTrabajadorMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  bloquearPag: boolean;
  acciones: string = ''
  position: string = 'top'
  private fileTmp: any;
  file: File = null;
  nombrearchivo: string;
  nombreruta: string;
  iniciarComponente(accion: string,titulo,fileTmp: any) {

    if (accion) {
      this.cargarAcciones(accion,titulo)

      this.nombreruta=fileTmp.data
      //data: "C:\\ARCHIVO\\SERVER\\BDO\\201701"
      console.log("Nuevo Ruta:",accion,fileTmp);
    }
  }

  
  cargarAcciones(accion: string,titulo) {
    this.acciones = `${titulo}: ${accion}`;
      this.dialog = true;
      this.puedeEditar = false;
    
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


}
