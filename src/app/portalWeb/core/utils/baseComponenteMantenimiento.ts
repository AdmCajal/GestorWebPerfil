import { EventEmitter, Injectable, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SecurityService } from '../../security/services/Security.service';
import { ActivatedRoute } from '@angular/router';
import { ComboItem } from '../models/interfaces/comboItem';
import { AccionFormulario } from '../enums/accionFormulario.enum';
import { BaseGeneral } from './baseGeneral';

@Injectable({
    providedIn: 'root'
})
export class BaseComponenteMantenimiento extends BaseGeneral {
    @Output() msjMantenimiento = new EventEmitter<any>(); //BehaviorSubject
    bloquearComponente = false;
    barraBusqueda = false;
    visualizarForm: boolean = false;
    visualizarLogMoficaciones: boolean = false;
    position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'top';

    breadcrumb: string | undefined;
    accion: string | undefined;
    mantenimientoForm: FormGroup;

    lstEstados: ComboItem[] = [];
    constructor(
        protected _MessageService: MessageService,
        protected _SecurityService: SecurityService,
        protected _ActivatedRoute: ActivatedRoute,
        protected _ConfirmationService: ConfirmationService
    ) {
        super();
        this.mantenimientoForm = new FormGroup({});
        this.breadcrumb = this._SecurityService.nombreComponente(this._ActivatedRoute.snapshot.data['idMenu']) || this._ActivatedRoute.snapshot.data['breadcrumb'] || 'Nombre encontrado';
    }

    protected MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
        // this._MessageService.clear();
        this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
    }

    public btnLogAuditoria(): void {
        this.visualizarLogMoficaciones = this.visualizarLogMoficaciones == true ? false : true;
    }
    protected estructuraForm(): void { }

    protected btnConfirmarGuardarMantenimiento(event: Event) {
        console.log(event.target as EventTarget)
        this._ConfirmationService.confirm({
            target: event.target as EventTarget,
            message: `Por favor confirme la acción de ${this.accion?.toLowerCase()}.`,
            header: 'Confirmar Registro',
            closable: false,
            closeOnEscape: false,

            icon: 'pi pi-exclamation-triangle',
            key: 'confirmarRegistroMantenimiento',
            acceptButtonProps: {
                label: 'Confirmar',
                icon: 'pi pi-check'
            },
            accept: () => {
                this.guardarMantenimiento();
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
    protected guardarMantenimiento(): void { }

    public IniciarMantenimientoFormulario(accion: AccionFormulario, registro?: any): void {
        this.visualizarForm = true;
        this.barraBusqueda = false;
        this.bloquearComponente = false;
        this.accion = accion;
        this.estructuraForm();


        switch (accion) {
            case AccionFormulario.AGREGAR:
                break;
            case AccionFormulario.EDITAR:
                this.mantenimientoForm.patchValue(registro);
                this.obtenerDatosMantenimiento();
                break;
            case AccionFormulario.VER:
                this.bloquearComponente = true;
                this.mantenimientoForm.patchValue(registro);
                this.mantenimientoForm.disable();
                this.obtenerDatosMantenimiento();
                break;
        }
    }

    protected obtenerDatosMantenimiento(): void { }
}
