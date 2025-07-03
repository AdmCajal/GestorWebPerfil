import { Injectable } from '@angular/core';
import { AccionesBusquedaComponente } from './acccionesBusquedaComponente';
import { FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LayoutService } from '../../../layout/service/layout.service';
import { BaseGeneral } from './baseGeneral';

@Injectable({
    providedIn: 'root'
})
export class BaseComponenteBusqueda extends BaseGeneral {

    bloquearComponente: boolean = false;
    barraBusqueda: boolean = false;

    cntRegistros: number = 10;
    filtroForm: FormGroup;
    lstBusqueda: any[] = [];

    optTodos = { descripcion: 'TODOS', codigo: null };

    constructor(
        protected _MessageService: MessageService,
        protected _LayoutService: LayoutService,
        protected _ConfirmationService: ConfirmationService
    ) {
        super();
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

    protected btnInactivarRegistro(event: Event, registro: any) {
        console.log(event.target as EventTarget)
        this._ConfirmationService.confirm({
            target: event.target as EventTarget,
            message: `¿Está seguro que quiere inactivar este registro?`,
            header: 'Inactivar Registro',
            closable: false,
            closeOnEscape: false,

            icon: 'pi pi-exclamation-triangle',
            key: 'confirmarInactivarRegitro',
            acceptButtonProps: {
                label: 'Confirmar',
                icon: 'pi pi-check'
            },
            accept: () => {
                this.inactivarRegistro(registro);
            },
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true,

            },
            reject: () => {
            }
        });
    }
    protected inactivarRegistro(registro: any): void { }

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
}
