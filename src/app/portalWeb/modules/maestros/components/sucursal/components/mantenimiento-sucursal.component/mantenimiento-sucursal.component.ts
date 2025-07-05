import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../../../layout/component/app.floatingconfigurator';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { HostListener } from '@angular/core';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { LogModificacionesComponent } from '../../../../../../shared/components/log-modificaciones-component/log-modificaciones-component';
import { AcccionesMantenimientoComponente } from '../../../../../../core/utils/acccionesMantenimientoComponente';
import { SucursalService } from '../../services/sucursal.service';
import { CompaniaService } from '../../../../../seguridad/components/compania/services/compania.service';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { AccionFormulario } from '../../../../../../core/enums/accionFormulario.enum';
import { BaseComponenteMantenimiento } from '../../../../../../core/utils/baseComponenteMantenimiento';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';
import { SecurityService } from '../../../../../../security/services/Security.service';

@Component({
    selector: 'app-mantenimiento-sucursal',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-sucursal.component.html',
    styleUrls: ['./mantenimiento-sucursal.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class MantenimientoSucursal extends BaseComponenteMantenimiento implements OnInit, AcccionesMantenimientoComponente {
    @Output() override msjMantenimiento = new EventEmitter<any>();

    lstCompanias: ComboItem[] = [];

    constructor(override _ActivatedRoute: ActivatedRoute,
        override _SecurityService: SecurityService,
        private _SucursalService: SucursalService,
        private _CompaniaService: CompaniaService,
        private _fb: FormBuilder,
        override _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        override _ConfirmationService: ConfirmationService
    ) { super(_MessageService, _SecurityService, _ActivatedRoute, _ConfirmationService); }

    ngOnInit(): void {
        this.obtenerDatosSelect();
        this.estructuraForm();
    }

    override estructuraForm(): void {
        this.mantenimientoForm = this._fb.group({
            SedCodigo: [{ value: '', disabled: this.bloquearComponente }, [Validators.required, Validators.minLength(3)]],
            SedDescripcion: [{ value: '', disabled: this.bloquearComponente }, [Validators.required]],
            Telefono: [{ value: '', disabled: this.bloquearComponente }],
            Direccion: [{ value: '', disabled: this.bloquearComponente }],
            IdEmpresa: [{ value: '', disabled: this.bloquearComponente }, [Validators.required]],
            SedEstado: [{ value: '', disabled: this.bloquearComponente }, [Validators.required]],
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
            this.lstCompanias = [...dataCompanias];
        });
    }
    override obtenerDatosMantenimiento(): void { }
    override guardarMantenimiento(): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.mantenimientoForm.disable();

        let valorAccionServicio: number = this.accion == AccionFormulario.AGREGAR ? ACCION_MANTENIMIENTO.AGREGAR : ACCION_MANTENIMIENTO.ACTUALIZAR;
        console.log(valorAccionServicio)
        this._SucursalService.mantenimiento(valorAccionServicio, this.mantenimientoForm.value).pipe(
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
