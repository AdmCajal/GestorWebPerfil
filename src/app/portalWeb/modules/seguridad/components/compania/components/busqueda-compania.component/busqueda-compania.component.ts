import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../../../layout/component/app.floatingconfigurator';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { CompaniaService } from '../../services/compania.service';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { HostListener } from '@angular/core';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { MantenimientoCompania } from '../mantenimiento-compania.component/mantenimiento-compania.component';
import { AccionesVistaComponente } from '../../../../../../core/utils/acccionesVistaComponente';
import { ACCION_FORMULARIO } from '../../../../../../core/constants/acciones-formulario';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';

@Component({
    selector: 'app-busqueda-compania',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule, MantenimientoCompania],
    templateUrl: './busqueda-compania.component.html',
    styleUrls: ['./busqueda-compania.component.scss'],
})
export class BusquedaCompania implements OnInit, AccionesVistaComponente {
    @ViewChild(MantenimientoCompania) _MantenimientoUsuario!: MantenimientoCompania;


    bloquearComponente = false;
    barraBusqueda = false;

    breadcrumb: string | undefined;
    cntRegistros: number = 10;

    filtroForm: FormGroup;

    lstBusqueda: any[] = [];

    lstEstados: any[] = [];
    constructor(private activatedRoute: ActivatedRoute,
        private _CompaniaService: CompaniaService,
        private _fb: FormBuilder,
        private _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        private _LayoutService: LayoutService,
        public _Router: Router,

    ) { this.filtroForm = new FormGroup({}); }



    ngOnInit(): void {
        this.breadcrumb = this.activatedRoute.snapshot.data['breadcrumb'] || 'Nombre encontrado';
        this.validarTipoDispositivo();
        this.obtenerDatosSelect();
        this.estructuraForm();
        this.esconderMenu();
    }

    estructuraForm(): void {
        this.filtroForm = this._fb.group({
            DocumentoFiscal: [{ value: '', disabled: this.bloquearComponente }],
            descripcioncorta: [{ value: '', disabled: this.bloquearComponente }],
            estado: [{ value: '', disabled: this.bloquearComponente }],
            rangoFechaCreacion: [{ value: [new Date(), new Date()], disabled: this.bloquearComponente }],
        });
    }
    esconderMenu() {
        this._LayoutService.onMenuToggle();
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

    btnInactivar(registro: any): void {
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

    btnExportar(): void {
        throw new Error('Method not implemented.');
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
    validarTipoDispositivo(): void {
        if (/Android|iPhone|BlackBerry|IEMobile/i.test(navigator.userAgent)) {
            this.cntRegistros = 5;
        }

        if (/webOS|iPad|iPod|Opera Mini|Windows/i.test(navigator.userAgent)) {
            this.cntRegistros = 10;
        }
    }

    MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
        this._MessageService.clear();
        this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
    }

    rptaMantenimiento(respuesta: any) {
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
