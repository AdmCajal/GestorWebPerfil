import { EventEmitter, Injectable, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SecurityService } from '../../security/services/Security.service';
import { ActivatedRoute } from '@angular/router';
import { ComboItem } from '../models/interfaces/comboItem';

@Injectable({
    providedIn: 'root'
})
export class BaseComponenteMantenimiento {
    @Output() msjMantenimiento = new EventEmitter<any>(); //BehaviorSubject
    bloquearComponente = false;
    barraBusqueda = false;
    visualizarForm: boolean = false;
    visualizarLogMoficaciones: boolean = false;
    position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'top';

    breadcrumb: string | undefined;
    accion: 'AGREGAR' | 'EDITAR' | 'VER' | undefined;
    mantenimientoForm: FormGroup;

    lstEstados: ComboItem[] = [];
    constructor(protected _MessageService: MessageService, protected _SecurityService: SecurityService, protected _ActivatedRoute: ActivatedRoute,
    ) {
        this.mantenimientoForm = new FormGroup({});
        this.breadcrumb = this._SecurityService.nombreComponente(this._ActivatedRoute.snapshot.data['idMenu']) || this._ActivatedRoute.snapshot.data['breadcrumb'] || 'Nombre encontrado';
    }

    protected MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
        this._MessageService.clear();
        this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
    }

    public btnLogAuditoria(): void {
        this.visualizarLogMoficaciones = this.visualizarLogMoficaciones == true ? false : true;
    }
}
