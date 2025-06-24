import { Injectable } from '@angular/core';
import { AccionesBusquedaComponente } from './acccionesBusquedaComponente';
import { FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { LayoutService } from '../../../layout/service/layout.service';

@Injectable({
    providedIn: 'root'
})
export class BaseComponenteBusqueda {

    bloquearComponente: boolean = false;
    barraBusqueda: boolean = false;

    cntRegistros: number = 10;
    filtroForm: FormGroup;
    lstBusqueda: any[] = [];
    constructor(protected _MessageService: MessageService, protected _LayoutService: LayoutService
    ) {
        this.esconderMenu();
        this.validarTipoDispositivo();
        this.filtroForm = new FormGroup({});
    }

    private validarTipoDispositivo(): void {
        if (/Android|iPhone|BlackBerry|IEMobile/i.test(navigator.userAgent)) {
            this.cntRegistros = 5;
        }

        if (/webOS|iPad|iPod|Opera Mini|Windows/i.test(navigator.userAgent)) {
            this.cntRegistros = 10;
        }
    }
    private esconderMenu(): void {
        this._LayoutService.onMenuToggle();
    }
    protected MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
        this._MessageService.clear();
        this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
    }

    onGlobalFilter(table: Table, event: Event): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.filtroForm.disable();

        setTimeout(() => {
            table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
            this.bloquearComponente = false;
            this.barraBusqueda = false;
            this.filtroForm.enable();
        }, 300);
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


}
