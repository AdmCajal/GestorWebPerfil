import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";



@Component({
    selector: 'ngx-examen-lista-mantenimiento',
    templateUrl: './examen-lista-mantenimiento.component.html'
  })
export class ExamenListaMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
 
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  
  acciones: string = ''
  position: string = 'top'

  iniciarComponente(accion: string,titulo) {
      this.cargarAcciones(accion,titulo)

  }

  
  cargarAcciones(accion: string,titulo) {
    this.acciones = `${titulo}: ${accion}`;

      this.dialog = true;
      this.puedeEditar = false;
    
  }


}
