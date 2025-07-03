import { Injectable } from '@angular/core';
import { AccionesBusquedaComponente } from './acccionesBusquedaComponente';
import { FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LayoutService } from '../../../layout/service/layout.service';

@Injectable({
    providedIn: 'root'
})
export class BaseGeneral {

    constructor(
    ) {
    }

    obtenerColorEstado(estado: string | number): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
        switch (estado) {
            case 1:
            case "1":
            case "A":
                return "success";
            case "0":
            case 2:
            case "I":
                return "danger";
            default:
                return "info";
        }
    }

    obtenerIconoEstado(estado: string | number): string {
        switch (estado) {
            case "1":
            case 1:
            case "A":
                return "pi-check";
            case "0":
            case 0:
            case 2:
            case "I":
                return "pi-times";
        }
        return "pi-info-circle"
    }

    obtenerColorAccionEstado(estado: string | number): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
        switch (estado) {
            case 1:
            case "1":
            case "A":
                return "danger";
            case "0":
            case 2:
            case "I":
                return "success";
            default:
                return "info";
        }
    }
    obtenerDescAccionEstado(estado: string | number): string {
        switch (estado) {
            case "1":
            case 1:
            case "A":
                return "Inactivar";
            case "0":
            case 0:
            case 2:
            case "I":
                return "Activar";
        }
        return "Sin Desc Estado"
    }

    obtenerIconoAccionEstado(estado: string | number): string {
        switch (estado) {
            case "1":
            case 1:
            case "A":
                return "pi-lock";
            case "0":
            case 0:
            case 2:
            case "I":
                return "pi-unlock";
        }
        return "pi-info-circle"
    }


}
