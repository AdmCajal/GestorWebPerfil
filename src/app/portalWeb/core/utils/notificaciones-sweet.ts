import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root' // Esto asegura que los servicios sean globales y accesibles.
})
export class NotificacionesSweet {
    constructor() { }

    // Método para mostrar una alerta básica con SweetAlert2
    MensajeSweet(titulo: string, dsc: string, tipo: SweetAlertIcon) {
        return Swal.fire(`${titulo}`, `${dsc}`, `${tipo}`);
    }

    // Método para cerrar cualquier alerta activa
    closeAlert() {
        Swal.close();
    }

    // Método para mostrar una alerta con imagen personalizada
    MensajeConfirmarImg(titulo: string, dsc: string, urlImagen: string) {
        return Swal.fire({
            title: `${titulo}`,
            text: `${dsc}`,
            imageUrl: `${urlImagen}`,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
        });
    }
}
