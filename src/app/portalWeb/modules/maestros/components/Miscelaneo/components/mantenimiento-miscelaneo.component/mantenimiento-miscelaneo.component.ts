import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../../../layout/component/app.floatingconfigurator';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { MiscelaneoService } from '../../Services/miscelaneo.service';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { HostListener } from '@angular/core';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { BaseComponenteMantenimiento } from '../../../../../../core/utils/baseComponenteMantenimiento';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';
import { SecurityService } from '../../../../../../security/services/Security.service';

@Component({
    selector: 'app-mantenimiento-usuario',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-miscelaneo.component.html',
    styleUrls: ['./mantenimiento-miscelaneo.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class MantenimientoMiscelaneo extends BaseComponenteMantenimiento implements OnInit {

    lstPerfiles: ComboItem[] = [];
    constructor(override _ActivatedRoute: ActivatedRoute,
        override _SecurityService: SecurityService,
        private _MiscelaneoService: MiscelaneoService,
        private _fb: FormBuilder,
        override _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        private _LayoutService: LayoutService,
        override _ConfirmationService: ConfirmationService

    ) { super(_MessageService, _SecurityService, _ActivatedRoute, _ConfirmationService); }

    ngOnInit(): void {
        this.obtenerDatosSelect();
        this.estructuraForm();
    }

    estructuraForm(): void {
        this.mantenimientoForm = this._fb.group({
            nroDocumento: [{ value: '', disabled: this.bloquearComponente }],
            nombres: [{ value: '', disabled: this.bloquearComponente }],
            perfil: [{ value: '', disabled: this.bloquearComponente }],
            tipoUsuario: [{ value: '', disabled: this.bloquearComponente }],
            correoElectronico: [{ value: '', disabled: this.bloquearComponente }],
            contrasenia: [{ value: '', disabled: this.bloquearComponente }],
            contraseniaConfirmacion: [{ value: '', disabled: this.bloquearComponente }],
            expirarContrasenia: [{ value: '', disabled: this.bloquearComponente }],
            fechaExpiracion: [{ value: new Date(), disabled: this.bloquearComponente }],

        });
    }
    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTGEN'),
            perfiles: this._MiscelaneoService.obtenerPerfiles({ ESTADO: 'A' })
        }).subscribe(resp => {
            this.lstEstados = [...resp.estados];

            const dataPerfiles: any[] = resp.perfiles.map((m: any) => ({ codigo: m.Codigo, descripcion: m.Descripcion }));
            this.lstPerfiles = [...dataPerfiles];
        });
    }

    override guardarMantenimiento(): void {
        this.bloquearComponente = true;
        this.mantenimientoForm.disable();
    }
}
