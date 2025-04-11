import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../../util/ComponenteBasePrincipa";



@Component({
    selector: 'ngx-autorizaciones-mantenimiento',
    templateUrl: './autorizaciones-mantenimiento.component.html'
  })
export class AutorizacionesMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
 
  ngOnInit(): void {
    
  }
  
  acciones: string = ''
  position: string = 'top'

  iniciarComponente(accion: string,titulo) {

    if (accion) {
      this.cargarAcciones(accion,titulo)
    }
  }

  
  cargarAcciones(accion: string, titulo) {
    this.acciones = `${titulo}: ${accion}`;
      this.dialog = true;
      this.puedeEditar = false;
    
  }


}
