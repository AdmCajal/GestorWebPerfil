import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { CompaniaService } from '../../services/compania.service';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { MantenimientoCompania } from '../mantenimiento-compania.component/mantenimiento-compania.component';
import { AccionesBusquedaComponente } from '../../../../../../core/utils/acccionesBusquedaComponente';
import { ACCION_FORMULARIO } from '../../../../../../core/constants/acciones-formulario';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { BaseComponenteBusqueda } from '../../../../../../core/utils/baseComponenteBusqueda';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';

@Component({
    selector: 'app-busqueda-compania',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule, MantenimientoCompania],
    templateUrl: './busqueda-compania.component.html',
    styleUrls: ['./busqueda-compania.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class BusquedaCompania extends BaseComponenteBusqueda implements OnInit, AccionesBusquedaComponente {
    @ViewChild(MantenimientoCompania) _MantenimientoUsuario!: MantenimientoCompania;

    lstEstados: ComboItem[] = [];
    constructor(private _ActivatedRoute: ActivatedRoute,
        private _CompaniaService: CompaniaService,
        private _fb: FormBuilder,
        override _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        override _LayoutService: LayoutService,
        public _Router: Router,
        override _ConfirmationService: ConfirmationService
    ) { super(_MessageService, _LayoutService, _ConfirmationService) }

    ngOnInit(): void {
        this.estructuraForm();
        this.obtenerDatosSelect();
    }

    estructuraForm(): void {
        this.filtroForm = this._fb.group({
            DocumentoFiscal: [{ value: '', disabled: this.bloquearComponente }],
            descripcioncorta: [{ value: '', disabled: this.bloquearComponente }],
            estado: [{ value: '', disabled: this.bloquearComponente }],
            rangoFechaCreacion: [{ value: [new Date(), new Date()], disabled: this.bloquearComponente }],
        });
    }
    obtenerDatosSelect(): void {
        const optTodos = { descripcion: 'TODOS', codigo: '' };

        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTLETRAS'),
        }).subscribe(resp => {
            const dataEstados = resp.estados?.map((ele: any) => ({
                descripcion: ele.descripcion?.trim()?.toUpperCase() || "", codigo: ele.codigo
            }));
            this.lstEstados = [optTodos, ...dataEstados];
        });
    }

    btnBuscar(): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.filtroForm.disable();

        this.lstBusqueda = [];
        this._CompaniaService.obtener(this.filtroForm.value).pipe(
            tap((consultaRepsonse: ResponseApi) => {
                if (consultaRepsonse.success) {

                    this.lstBusqueda = [...consultaRepsonse.data];
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
        registro.SedEstado = 2;
        this._CompaniaService.mantenimiento(valorAccionServicio, registro).pipe(
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
    btnMantenimientoFormulario(accion: 'AGREGAR' | 'EDITAR' | 'VER', registro?: any): void {
        this._MantenimientoUsuario.visualizarForm = true;
        this._MantenimientoUsuario.accion = accion;
        this._MantenimientoUsuario.bloquearComponente = accion == ACCION_FORMULARIO.VER ? true : false;
        this._MantenimientoUsuario.estructuraForm();
        this._MantenimientoUsuario.mantenimientoForm.patchValue(registro);
        this._MantenimientoUsuario.mantenimientoForm.get('EmpRucBusqueda')?.setValue({ visible: registro?.RUC || '' });
        this._MantenimientoUsuario.mantenimientoForm.get('EmpRazonSocialBusqueda')?.setValue({ visible: registro?.DescripcionCorta || '' });
        this._MantenimientoUsuario.mantenimientoForm.get('DocumentoFiscalBusqueda')?.setValue({ visible: registro?.DocumentoFiscal || '' });
        this._MantenimientoUsuario.mantenimientoForm.get('RepresentanteLegalBusqueda')?.setValue({ visible: registro?.RepresentanteLegal || '' });
    }
    rptaMantenimiento(respuesta: any): void {
        console.log(respuesta)
        if (respuesta.buscar) { this.btnBuscar(); }

        if (respuesta.accion) {
            switch (respuesta.accion) {
                case 'AGREGAR':
                    break;
                case 'EDITAR':
                    break;
                default:
                    break;
            }
        }
    }
}
