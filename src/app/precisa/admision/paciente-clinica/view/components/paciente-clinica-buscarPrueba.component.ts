import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../../util/ComponenteBasePrincipa";


@Component({
    selector: 'ngx-paciente-clinica-buscarPrueba',
    templateUrl: './paciente-clinica-buscarPrueba.component.html'
  })
export class PacienteClinicaBuscarPruebaComponent extends ComponenteBasePrincipal implements OnInit {
 
  ngOnInit(): void {
    
  }
  
  acciones: string = ''
  position: string = 'top'

  iniciarComponente(accion: string) {
    // if (accion == "NUEVO") {
    //   this.cargarAcciones(accion)
    // }
    this.cargarAcciones(accion)
  }

  
  cargarAcciones(accion: string) {
    this.acciones = `Buscar: ${accion}`;
    if (accion == "PRUEBA") {
      this.dialog = true;
      this.puedeEditar = false;
    }
  }


}
