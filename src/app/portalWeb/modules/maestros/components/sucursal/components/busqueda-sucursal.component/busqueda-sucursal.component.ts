import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../../../layout/component/app.floatingconfigurator';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { SucursalService } from '../../services/sucursal.service';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { HostListener } from '@angular/core';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { MantenimientoSucursal } from '../mantenimiento-sucursal.component/mantenimiento-sucursal.component';
import { AccionesBusquedaComponente } from '../../../../../../core/utils/acccionesBusquedaComponente';
import { AccionFormulario } from '../../../../../../core/enums/accionFormulario.enum';
import { CompaniaService } from '../../../../../seguridad/components/compania/services/compania.service';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { BaseComponenteBusqueda } from '../../../../../../core/utils/baseComponenteBusqueda';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';
import { ESTADO_REGISTRO } from '../../../../../../core/constants/estados-registro';

@Component({
    selector: 'app-busqueda-sucursal',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule, MantenimientoSucursal],
    templateUrl: './busqueda-sucursal.component.html',
    styleUrls: ['./busqueda-sucursal.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class BusquedaSucursal extends BaseComponenteBusqueda implements OnInit, AccionesBusquedaComponente {
    @ViewChild(MantenimientoSucursal) _Mantenimiento!: MantenimientoSucursal;

    lstEstados: ComboItem[] = [];
    lstCompanias: ComboItem[] = [];

    constructor(private _ActivatedRoute: ActivatedRoute,
        private _SucursalService: SucursalService,
        private _CompaniaService: CompaniaService,
        private _fb: FormBuilder,
        override _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        override _LayoutService: LayoutService,
        public _Router: Router,
        override _ConfirmationService: ConfirmationService
    ) { super(_MessageService, _LayoutService, _ConfirmationService) }

    ngOnInit(): void {
        this.obtenerDatosSelect();
        this.estructuraForm();
    }

    estructuraForm(): void {
        this.filtroForm = this._fb.group({
            SedCodigo: [{ value: '', disabled: this.bloquearComponente }],
            SedDescripcion: [{ value: '', disabled: this.bloquearComponente }],
            IdEmpresa: [{ value: '', disabled: this.bloquearComponente }],
            SedEstado: [{ value: null, disabled: this.bloquearComponente }],
            rangoFechaCreacion: [{ value: [new Date(), new Date()], disabled: this.bloquearComponente }],
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
            this.lstEstados = [this.optTodos, ...dataEstados];

            const dataCompanias: any[] = resp.companias?.data?.map((m: any) => ({ codigo: m.Persona, descripcion: m.DescripcionCorta.trim() }));
            this.lstCompanias = [this.optTodos, ...dataCompanias];
        });
    }

    btnBuscar(): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.filtroForm.disable();

        this.lstDataBusqueda = [];
        this._SucursalService.obtener(this.filtroForm.value).pipe(
            tap((consultaRepsonse: ResponseApi) => {
                if (consultaRepsonse.success) {

                    this.lstDataBusqueda = [...consultaRepsonse.data];
                    this.MensajeToastComun('notification', 'success', 'Correcto', consultaRepsonse.mensaje);
                    return;
                } else {
                    this.MensajeToastComun('notification', 'warn', 'Advertencia', consultaRepsonse.mensaje);
                }
            }), catchError((error) => {
                this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
                console.error(`Error al buscar. ${error}`);
                return of(null);
            }),
            finalize(() => {
                this.bloquearComponente = false;
                this.barraBusqueda = false;
                this.filtroForm.enable();
            })
        ).subscribe();
    }
    override inactivarRegistro(registro: any): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.filtroForm.disable();

        let valorAccionServicio: number = ACCION_MANTENIMIENTO.ESTADO
        registro.SedEstado = registro.Estado == ESTADO_REGISTRO.ACTIVO_NUM ? ESTADO_REGISTRO.INACTIVO_NUM : ESTADO_REGISTRO.ACTIVO_NUM;

        this._SucursalService.mantenimiento(valorAccionServicio, registro).pipe(
            tap((response: ResponseApi) => {
                if (response.success) {
                    this.MensajeToastComun('notification', 'success', 'Correcto', response.mensaje);
                    this.btnBuscar();
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
                this.filtroForm.enable();
            })
        ).subscribe();

    }
    btnExportar(): void {
        throw new Error('Method not implemented.');
    }
    btnMantenimientoFormulario(accion: AccionFormulario, registro?: any): void {
        this._Mantenimiento.IniciarMantenimientoFormulario(accion, registro);
    }

    rptaMantenimiento(respuesta: any): void {

        console.log(respuesta)
        if (respuesta.buscar) { this.btnBuscar(); }

        if (respuesta.accion) {
            switch (respuesta.accion) {
                case AccionFormulario.AGREGAR:
                    break;
                case AccionFormulario.EDITAR:
                    break;
                default:
                    break;
            }
        }
    }
}
