import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import {PanelModule} from 'primeng/panel';



@Component({
    selector: 'ngx-cobranzas-mantenimiento',
    templateUrl: './cobranzas-mantenimiento.component.html'
  })
export class CobranzasMantenimientoComponent extends ComponenteBasePrincipal implements OnInit {
 
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  
  acciones: string = ''
  position: string = 'top'
  checked:boolean =false

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
