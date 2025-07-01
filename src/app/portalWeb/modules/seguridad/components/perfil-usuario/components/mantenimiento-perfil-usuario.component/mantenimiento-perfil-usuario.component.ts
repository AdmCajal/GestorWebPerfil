import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, finalize, forkJoin, of, switchMap, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { AcccionesMantenimientoComponente } from '../../../../../../core/utils/acccionesMantenimientoComponente';
import { ACCION_FORMULARIO } from '../../../../../../core/constants/acciones-formulario';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { PersonaService } from '../../../../../maestros/components/persona/services/persona.service';
import { v4 as uuidv4 } from 'uuid';
import { CompaniaService } from '../../../compania/services/compania.service';
import { PerfilUsuarioService } from '../../services/perfil-usuario.service';
import { SecurityService } from '../../../../../../security/services/Security.service';
import { BaseComponenteMantenimiento } from '../../../../../../core/utils/baseComponenteMantenimiento';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';
import { AplicativoService } from '../../../aplicativo/services/aplicativo.service';

@Component({
    selector: 'app-mantenimiento-perfil-usuario',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-perfil-usuario.component.html',
    styleUrls: ['./mantenimiento-perfil-usuario.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class MantenimientoPerfilUsuario extends BaseComponenteMantenimiento implements OnInit, AcccionesMantenimientoComponente {

    lstCompanias: ComboItem[] = [];
    lstAplicativos: ComboItem[] = [];

    lstaplicativosSeleccionados: TreeNode[] = [
        {
            key: '0',
            label: 'Spring',
            data: 'Documents Folder',
            children: [
                {
                    key: '0-0-0', label: 'Salud', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                    children: [
                        {
                            key: '0-0-0', label: 'Pedido', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                            // children: [
                            //     { key: '0-0-0-1', label: 'Agregar', icon: 'pi pi-fw pi-file', data: 'Expenses Document' }
                            // ]
                        },
                        { key: '0-0-1', label: 'Presupuestos', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                        { key: '0-0-1', label: 'Caja / Admisión', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                        { key: '0-0-1', label: 'Farmacia', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                    ]
                },
                {
                    key: '0-0-1', label: 'Comercial', icon: 'pi pi-fw pi-file', data: 'Resume Document',
                    children: [
                        {
                            key: '0-0-0', label: 'Comercial', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                            children: [
                                { key: '0-0-0', label: 'Resumen Comprobantes Electrónicos', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                                { key: '0-0-1', label: 'Log de comprobantes electrónicos', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
                            ]
                        },
                        {
                            key: '0-0-1', label: 'Maestros', icon: 'pi pi-fw pi-file', data: 'Resume Document',
                            children: [
                                {
                                    key: '0-0-0', label: 'Comercial', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                                    children: [
                                        { key: '0-0-0', label: 'Terminal Caja', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                                        { key: '0-0-1', label: 'banco', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                                        { key: '0-0-1', label: 'Caja', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                                        { key: '0-0-1', label: 'Componentes Caracteristicas', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    key: '0-0-1', label: 'General', icon: 'pi pi-fw pi-file', data: 'Resume Document',
                    children: [
                        {
                            key: '0-0-0', label: 'Bandeja', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                            children: [
                                { key: '0-0-0', label: 'Agente Bandeja', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                                { key: '0-0-1', label: 'Bandeja', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                                { key: '0-0-1', label: 'Formato Bandeja', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                            ]
                        },
                        {
                            key: '0-0-0', label: 'Maestros', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                            children: [
                                { key: '0-0-0', label: 'Médicos y prestaciones por U.N', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                                { key: '0-0-1', label: 'Correlativos de OA por U.N', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                                { key: '0-0-1', label: 'Artículos', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                            ]
                        }
                    ]
                },
                {
                    key: '0-0-1', label: 'Sistema', icon: 'pi pi-fw pi-file', data: 'Resume Document',
                    children: [
                        {
                            key: '0-0-0', label: 'Seguridad', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                            children: [
                                { key: '0-0-0', label: 'Cuentas Correo', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                                { key: '0-0-1', label: 'Ticketera', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                                { key: '0-0-1', label: 'Agente', icon: 'pi pi-fw pi-file', data: 'Resume Document' },
                            ]
                        },
                        {
                            key: '0-0-0', label: 'Imágenes', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                            children: [
                                { key: '0-0-0', label: 'Imagen Archivo', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                            ]
                        }
                    ]
                }
            ]
        },
        {
            key: '1',
            label: 'HCE',
            data: 'Documents Folder',
        }
    ]

    aplicativoSeleccionado: TreeNode[] = []
    nombreAplicativoSeleccionado: string = '';
    codigoAplicativoAgregar: any;

    constructor(override _ActivatedRoute: ActivatedRoute,
        private _PerfilUsuarioService: PerfilUsuarioService,
        private _CompaniaService: CompaniaService,
        private _AplicativoService: AplicativoService,
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
            empleadoBusqueda: [{ value: '', disabled: this.bloquearComponente }],
            PERSONA: [{ value: '', disabled: this.bloquearComponente }],
            USUARIO: [{ value: '', disabled: this.bloquearComponente }],
            NOMBRECOMPLETO: [{ value: '', disabled: true }],
            PERFIL: [{ value: '', disabled: this.bloquearComponente }],
            TipoUsuario: [{ value: '', disabled: this.bloquearComponente }],
            CorreoElectronico: [{ value: '', disabled: this.bloquearComponente }],
            Clave: [{ value: '', disabled: this.bloquearComponente }],
            contraseniaConfirmacion: [{ value: '', disabled: this.bloquearComponente }],
            ExpirarPasswordFlag: [{ value: '', disabled: this.bloquearComponente }],
            FechaExpiracion: [{ value: new Date(), disabled: this.bloquearComponente }],
            ESTADO: [{ value: '', disabled: this.bloquearComponente }],
            detallePerfiles: this._fb.array([])

        });
    }
    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTGEN'),
            companias: this._CompaniaService.obtener({}),
            aplicativos: this._AplicativoService.obtenerAplicativos({}),
        }).subscribe(resp => {
            const dataEstados = resp.estados?.map((ele: any) => ({
                descripcion: ele.descripcion?.trim()?.toUpperCase() || "", codigo: Number.parseInt(ele.codigo)
            }));
            this.lstEstados = [...dataEstados];

            const dataCompanias: any[] = resp.companias?.data?.map((m: any) => ({ codigo: m.Persona, descripcion: m.DescripcionCorta.trim() }));
            this.lstCompanias = [...dataCompanias];

            const datAplicativos: any[] = resp.aplicativos?.data?.map((m: any) => ({ codigo: m.Sistema, descripcion: m.Nombre.trim() }));
            this.lstAplicativos = [...datAplicativos];
        });
    }

    override obtenerDatosMantenimiento(): void { }

    override guardarMantenimiento(): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.mantenimientoForm.disable();

        let valorAccionServicio: number = this.accion == ACCION_FORMULARIO.AGREGAR ? ACCION_MANTENIMIENTO.AGREGAR : ACCION_MANTENIMIENTO.ACTUALIZAR;

        this._PerfilUsuarioService.mantenimiento(valorAccionServicio, this.mantenimientoForm.value).pipe(
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

    onAgregarAplicativoSeleccionado(): void {
        const item = this.lstAplicativos.find((item: any) => item.codigo === this.codigoAplicativoAgregar);

        if (item) {
            const aplicativoAgregar: TreeNode = { key: item.codigo, label: item.descripcion };
            const yaExiste = this.lstaplicativosSeleccionados.some((a: any) => a.key === aplicativoAgregar.key);

            if (yaExiste) {
                this.MensajeToastComun('notification', 'warn', 'Advertencia', 'El aplicativo ya fue agregado. No se permiten duplicados.');
            } else {
                this.lstaplicativosSeleccionados.unshift(aplicativoAgregar);
            }
        } else {
            this.MensajeToastComun('notification', 'warn', 'Advertencia', 'No se encontró el aplicativo al momento de agregar');
        }
    }
    onVerAplicativoSeleccionado(item: any): void {
        this.nombreAplicativoSeleccionado = item.label;
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
        this.aplicativoSeleccionado = [...data];
        this.MensajeToastComun('notification', 'success', 'Correcto', 'Módulos obtenidos');
    }


}
