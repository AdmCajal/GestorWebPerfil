import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";



@Component({
    selector: 'ngx-insumo-mantenimiento',
    templateUrl: './insumo-mantenimiento.component.html'
  })
export class InsumoMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
 
  ngOnInit(): void {
    throw new Error("Method not implemented.");
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
