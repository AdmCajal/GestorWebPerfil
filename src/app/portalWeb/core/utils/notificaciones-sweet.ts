import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root' 
})
export class NotificacionesSweet {
    constructor() { }

    // Método para mostrar una alerta básica con SweetAlert2
    MensajeSweet(titulo: string, dsc: string, tipo: SweetAlertIcon) {
        return Swal.fire(`${titulo}`, `${dsc}`, `${tipo}`);
    }

    // Método para cerrar cualquier alerta activa
    closeAlert(): void {
        Swal.close();
    }

   
}
