import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../../util/ComponenteBasePrincipa";

@Component({
    selector: 'ngx-atencion-particulares-pago',
    templateUrl: './atencion-particulares-pago.component.html'
  })
export class AtencionParticularesPagoComponent extends ComponenteBasePrincipal implements OnInit {
   
  ngOnInit(): void {
       
  }

  acciones: string = ''
  position: string = 'top'

  iniciarComponente(accion: string) {

    if (accion == "PAGO") {
      this.cargarAcciones(accion)

    }
  }

  
  cargarAcciones(accion: string) {
    this.acciones = `Información Consulta: ${accion}`;
    if (accion == "PAGO") {
      this.dialog = true;
      this.puedeEditar = false;
    }
  }

}