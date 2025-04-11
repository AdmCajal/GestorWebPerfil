import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";




@Component({
    selector: 'ngx-aprobadores-buscar',
    templateUrl: './aprobadores-buscar.component.html'
  })
export class AprobadoresBuscarComponent extends ComponenteBasePrincipal implements OnInit {

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
    acciones: string = ''
  position: string = 'top'
  dialog:boolean=false;
  iniciarComponente(accion: string,titulo) {
    this.dialog=true;
    // if (accion == "NUEVO") {
      this.cargarAcciones(accion,titulo)

    
    // else{
    //   this.cargarAcciones(accion,titulo)
    // }
    
  }

  
  cargarAcciones(accion: string,titulo) {
    this.acciones = `${titulo}: ${accion}`;
   
      this.dialog = true;
      this.puedeEditar = false;
    
  }
}