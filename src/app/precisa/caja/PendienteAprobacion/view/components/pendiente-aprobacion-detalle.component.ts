import { Component, OnInit } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../../util/ComponenteBasePrincipa";


@Component({
    selector: 'ngx-pendiente-aprobacion-detalle',
    templateUrl: './pendiente-aprobacion-detalle.component.html'
  })
export class PendienteAprobacionDetalleComponent extends ComponenteBasePrincipal implements OnInit {
    
    ngOnInit(): void {
        
      }
      
      acciones: string = ''
      position: string = 'top'
    
      iniciarComponente(accion: string) {
    
        if (accion == "DETALLE") {
          this.cargarAcciones(accion)
    
        }
    }

    cargarAcciones(accion: string) {
        this.acciones = `Pendiente de Aprobación: ${accion}`;
        if (accion == "DETALLE") {
          this.dialog = true;
          this.puedeEditar = false;
        }
    }
}