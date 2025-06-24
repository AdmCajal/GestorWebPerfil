import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../../../layout/component/app.floatingconfigurator';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { catchError, debounceTime, finalize, forkJoin, of, switchMap, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { HostListener } from '@angular/core';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { LogModificacionesComponent } from '../../../../../../shared/components/log-modificaciones-component/log-modificaciones-component';
import { AcccionesMantenimientoComponente } from '../../../../../../core/utils/acccionesMantenimientoComponente';
import { ACCION_FORMULARIO } from '../../../../../../core/constants/acciones-formulario';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { PersonaService } from '../../../../../maestros/components/persona/services/persona.service';
import { v4 as uuidv4 } from 'uuid';
import { CompaniaService } from '../../../compania/services/compania.service';
import { GerenciaService } from '../../services/gerencia.service';
import { SecurityService } from '../../../../../../security/services/Security.service';
import { ModuloAplicativo } from '../../../../../../core/models/interfaces/aplicativo/modulo.aplicativo';
import { NodoSeleccionadoModulo } from '../../../../../../core/models/interfaces/aplicativo/NodoSeleccionadoModulo.aplicativo';

@Component({
    selector: 'app-mantenimiento-gerencia',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-gerencia.component.html',
    styleUrls: ['./mantenimiento-gerencia.component.scss'],
    providers: [TreeDragDropService]

})
export class MantenimientoGerencia implements OnInit, AcccionesMantenimientoComponente {
    @Output() msjMantenimiento = new EventEmitter<any>(); //BehaviorSubject
    bloquearComponente = false;
    barraBusqueda = false;

    breadcrumb: string | undefined;
    accion: 'AGREGAR' | 'EDITAR' | 'VER' | undefined;
    cntRegistros: number = 10;

    mantenimientoForm: FormGroup;

    lstEstados: any[] = [];


    visualizarForm: boolean = false;
    visualizarLogMoficaciones: boolean = false;
    position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'top';

    constructor(private _ActivatedRoute: ActivatedRoute,
        private _GerenciaService: GerenciaService,
        private _fb: FormBuilder,
        private _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        private _LayoutService: LayoutService,
        private _SecurityService: SecurityService,

    ) { this.mantenimientoForm = new FormGroup({}); }

    ngOnInit(): void {
        this.breadcrumb = this._SecurityService.nombreComponente(this._ActivatedRoute.snapshot.data['idMenu']) || this._ActivatedRoute.snapshot.data['breadcrumb'] || 'Nombre encontrado';
        this.obtenerDatosSelect();
        this.estructuraForm();
        this.esconderMenu();
    }

    estructuraForm(): void {
        this.mantenimientoForm = this._fb.group({
            nombreAplicativo: [{ value: '', disabled: this.bloquearComponente }],
            descripcion: [{ value: '', disabled: this.bloquearComponente }],
            baseDatos: [{ value: '', disabled: this.bloquearComponente }],
            estado: [{ value: '', disabled: this.bloquearComponente }]

        });
    }

    esconderMenu(): void {
        this._LayoutService.onMenuToggle();
    }

    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTGEN')
        }).subscribe(resp => {
            const dataEstados = resp.estados?.map((ele: any) => ({
                descripcion: ele.descripcion?.trim()?.toUpperCase() || "", codigo: Number.parseInt(ele.codigo)
            }));
            this.lstEstados = [...dataEstados];

        });
    }
    btnAccionForm(): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.mantenimientoForm.disable();

        let valorAccionServicio: number = this.accion == ACCION_FORMULARIO.AGREGAR ? ACCION_MANTENIMIENTO.AGREGAR : ACCION_MANTENIMIENTO.ACTUALIZAR;

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

    onVerAplicativoSeleccionado(item: any): void {
        let data = [
            {
                key: '0', label: 'Salud', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                children: [
                    { key: '0-1', label: 'Pedido', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                    { key: '0-2', label: 'Presupuestos', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                    { key: '0-3', label: 'Caja / Admisión', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                    { key: '0-4', label: 'Farmacia', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                ]
            },
            {
                key: '1', label: 'Comercial', icon: 'pi pi-fw pi-file', data: 'Resume Document',
                children: [
                    {
                        key: '1-1', label: 'Comercial', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                        children: [
                            { key: '1-1-1', label: 'Resumen Comprobantes Electrónicos', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                            { key: '1-1-2', label: 'Log de comprobantes electrónicos', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
                        ]
                    },
                    {
                        key: '1-2', label: 'Maestros', icon: 'pi pi-fw pi-file', data: 'Resume Document',
                        children: [
                            {
                                key: '1-2-1', label: 'Comercial', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                                children: [
                                    { key: '1-2-1-1', label: 'Terminal Caja', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                                    { key: '1-2-1-2', label: 'banco', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                                    { key: '1-2-1-3', label: 'Caja', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                                    { key: '1-2-1-4', label: 'Componentes Caracteristicas', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                key: '2', label: 'General', icon: 'pi pi-fw pi-file', data: 'Resume Document',
                children: [
                    {
                        key: '2-1', label: 'Bandeja', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                        children: [
                            { key: '2-1-1', label: 'Agente Bandeja', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                            { key: '2-1-2', label: 'Bandeja', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                            { key: '2-1-3', label: 'Formato Bandeja', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                        ]
                    },
                    {
                        key: '2-2', label: 'Maestros', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                        children: [
                            { key: '2-2-1', label: 'Médicos y prestaciones por U.N', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                            { key: '2-2-2', label: 'Correlativos de OA por U.N', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                            { key: '2-2-3', label: 'Artículos', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                        ]
                    }
                ]
            },
            {
                key: '3', label: 'Sistema', icon: 'pi pi-fw pi-file', data: 'Resume Document',
                children: [
                    {
                        key: '3-1', label: 'Seguridad', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                        children: [
                            { key: '3-1-1', label: 'Cuentas Correo', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                            { key: '3-1-2', label: 'Ticketera', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                            { key: '3-1-3', label: 'Agente', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                        ]
                    },
                    {
                        key: '3-2', label: 'Imágenes', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                        children: [
                            { key: '3-2-1', label: 'Imagen Archivo', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                        ]
                    }
                ]
            }
        ];
        this.MensajeToastComun('notification', 'success', 'Correcto', 'Módulos obtenidos');
    }


    MensajeToastComun(key: string, tipo: string, titulo: string, dsc: string): void {
        this._MessageService.clear();
        this._MessageService.add({ key: key, severity: tipo, summary: titulo, detail: dsc });
    }

    btnLogAuditoria(): void {
        this.visualizarLogMoficaciones = this.visualizarLogMoficaciones == true ? false : true;
    }

}
