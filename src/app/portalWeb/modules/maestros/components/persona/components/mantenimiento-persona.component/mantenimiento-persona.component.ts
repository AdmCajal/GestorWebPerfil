import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { FormBuilder, } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { AcccionesMantenimientoComponente } from '../../../../../../core/utils/acccionesMantenimientoComponente';
import { PersonaService } from '../../services/persona.service';
import { BaseComponenteMantenimiento } from '../../../../../../core/utils/baseComponenteMantenimiento';
import { SecurityService } from '../../../../../../security/services/Security.service';

@Component({
    selector: 'app-mantenimiento-persona',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-persona.component.html',
    styleUrls: ['./mantenimiento-persona.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class MantenimientoSucursal extends BaseComponenteMantenimiento implements OnInit, AcccionesMantenimientoComponente {


    lstPerfiles: any[] = [];

    constructor(override _ActivatedRoute: ActivatedRoute,
        override _SecurityService: SecurityService,
        private _PersonaService: PersonaService,
        private _fb: FormBuilder,
        override _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        override _ConfirmationService: ConfirmationService
    ) { super(_MessageService, _SecurityService, _ActivatedRoute, _ConfirmationService); }

    ngOnInit(): void {
        this.obtenerDatosSelect();
        this.estructuraForm();
    }

    estructuraForm(): void {
        this.mantenimientoForm = this._fb.group({
            codigo: [{ value: '', disabled: this.bloquearComponente }],
            nombre: [{ value: '', disabled: this.bloquearComponente }],
            telefono: [{ value: '', disabled: this.bloquearComponente }],
            direccion: [{ value: '', disabled: this.bloquearComponente }],
            compania: [{ value: '', disabled: this.bloquearComponente }],
            estado: [{ value: '', disabled: this.bloquearComponente }],

        });
    }
    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTGEN'),
            perfiles: this._PersonaService.obtenerPerfiles({ ESTADO: 'A' })
        }).subscribe(resp => {
            this.lstEstados = [...resp.estados];

            const dataPerfiles: any[] = resp.perfiles.map((m: any) => ({ codigo: m.Codigo, descripcion: m.Descripcion }));
            this.lstPerfiles = [...dataPerfiles];
        });
    }

    override guardarMantenimiento(): void {
        this.bloquearComponente = true;
        this.mantenimientoForm.disable();
        this.msjMantenimiento.emit({ accion: this.accion, buscar: true });
    }
}
