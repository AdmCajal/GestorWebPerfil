import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService, TreeDragDropService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { AcccionesMantenimientoComponente } from '../../../../../../core/utils/acccionesMantenimientoComponente';
import { AccionFormulario } from '../../../../../../core/enums/accionFormulario.enum';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { GerenciaService } from '../../services/gerencia.service';
import { SecurityService } from '../../../../../../security/services/Security.service';
import { BaseComponenteMantenimiento } from '../../../../../../core/utils/baseComponenteMantenimiento';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';
import { CompaniaService } from '../../../compania/services/compania.service';

@Component({
    selector: 'app-mantenimiento-gerencia',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-gerencia.component.html',
    styleUrls: ['./mantenimiento-gerencia.component.scss'],
    providers: [TreeDragDropService, ConfirmationService, MessageService]
})
export class MantenimientoGerencia extends BaseComponenteMantenimiento implements OnInit, AcccionesMantenimientoComponente {
    lstCompania: ComboItem[] = [];

    constructor(override _ActivatedRoute: ActivatedRoute,
        private _GerenciaService: GerenciaService,
        private _CompaniaService: CompaniaService,
        private _fb: FormBuilder,
        override _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        override _SecurityService: SecurityService,
        override _ConfirmationService: ConfirmationService
    ) { super(_MessageService, _SecurityService, _ActivatedRoute, _ConfirmationService); }

    ngOnInit(): void {
        this.obtenerDatosSelect();
        this.estructuraForm();
    }

    override estructuraForm(): void {
        this.mantenimientoForm = this._fb.group({
            nombreAplicativo: [{ value: '', disabled: this.bloquearComponente }],
            descripcion: [{ value: '', disabled: this.bloquearComponente }],
            baseDatos: [{ value: '', disabled: this.bloquearComponente }],
            estado: [{ value: '', disabled: this.bloquearComponente }]
        });
    }

    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTGEN'),
            companias: this._CompaniaService.obtener({})

        }).subscribe(resp => {
            const dataEstados = resp.estados?.map((ele: any) => ({
                descripcion: ele.descripcion?.trim()?.toUpperCase() || "", codigo: Number.parseInt(ele.codigo)
            }));
            this.lstEstados = [...dataEstados];
            const dataCompanias: any[] = resp.companias?.data?.map((m: any) => ({ codigo: m.Persona, descripcion: m.DescripcionCorta.trim() }));
            this.lstCompania = [...dataCompanias || []];
        });
    }
    override obtenerDatosMantenimiento(): void { }
    override guardarMantenimiento(): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.mantenimientoForm.disable();

        let valorAccionServicio: number = this.accion == AccionFormulario.AGREGAR ? ACCION_MANTENIMIENTO.AGREGAR : ACCION_MANTENIMIENTO.ACTUALIZAR;

        this._GerenciaService.mantenimiento(valorAccionServicio, this.mantenimientoForm.value).pipe(
            tap((response: ResponseApi) => {
                if (response.success) {
                    this.MensajeToastComun('notification', 'success', 'Correcto', response.mensaje);
                    this.visualizarForm = false;
                    this.estructuraForm();
                    this.msjMantenimiento.emit({ accion: this.accion, buscar: true });
                } else {
                    this.MensajeToastComun('notification', 'error', 'Error', response.mensaje);
                }

            }), catchError((error) => {
                this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
                return of(null);
            }),
            finalize(() => {
                this.bloquearComponente = false;
                this.barraBusqueda = false;
                this.mantenimientoForm.enable();
            })
        ).subscribe();

    }

}
