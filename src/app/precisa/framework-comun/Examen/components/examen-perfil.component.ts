import { Component, OnInit, ViewChild } from "@angular/core";
import { ComponenteBasePrincipal } from "../../../../../util/ComponenteBasePrincipa";
import { MensajeController } from "../../../../../util/MensajeController";
import { UIMantenimientoController } from "../../../../../util/UIMantenimientoController";



@Component({
    selector: 'ngx-examen-perfil',
    templateUrl: './examen-perfil.component.html'
})
export class ExamenPerfilComponent extends ComponenteBasePrincipal implements OnInit, UIMantenimientoController {
   

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

    acciones: string = ''
    position: string = 'top'


    constructor(
        

    ) {
        super(

        );
    }

    coreMensaje(mensage: MensajeController): void {
       
    }
    coreNuevo(): void {
        throw new Error("Method not implemented.");
    }
    coreBuscar(): void {
        throw new Error("Method not implemented.");
    }
    coreGuardar(): void {
        throw new Error("Method not implemented.");
    }

    coreExportar(tipo: string): void {
        throw new Error("Method not implemented.");
    }
    coreSalir(): void {
        throw new Error("Method not implemented.");
    }


    iniciarComponente(accion: string, titulo) {

        // if (accion) {
        this.cargarAcciones(accion, titulo)
        // }
    }



    cargarAcciones(accion: string, titulo) {

        this.acciones = `${titulo}: ${accion}`;
        this.dialog = true;
        this.puedeEditar = false;

    }

    

   

}
