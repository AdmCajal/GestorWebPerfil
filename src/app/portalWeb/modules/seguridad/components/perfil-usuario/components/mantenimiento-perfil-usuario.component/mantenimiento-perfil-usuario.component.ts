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
import { MessageService } from 'primeng/api';
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
import { PerfilUsuarioService } from '../../services/perfil-usuario.service';
import { SecurityService } from '../../../../../../security/services/Security.service';

@Component({
    selector: 'app-mantenimiento-perfil-usuario',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-perfil-usuario.component.html',
    styleUrls: ['./mantenimiento-perfil-usuario.component.scss'],
})
export class MantenimientoPerfilUsuario implements OnInit, AcccionesMantenimientoComponente {
    @Output() msjMantenimiento = new EventEmitter<any>(); //BehaviorSubject
    bloquearComponente = false;
    barraBusqueda = false;

    breadcrumb: string | undefined;
    accion: 'AGREGAR' | 'EDITAR' | 'VER' | undefined;
    cntRegistros: number = 10;

    mantenimientoForm: FormGroup;

    lstUsuarios: any[] = [];
    lstEstados: any[] = [];
    lstPerfiles: any[] = [];
    lstCompanias: any[] = [];

    lstaplicativosSeleccionados: any[] = [
        {
            key: '0',
            label: 'Spring',
            data: 'Documents Folder',
            children: [
                {
                    key: '0-0-0', label: 'Salud', icon: 'pi pi-fw pi-file', data: 'Expenses Document',
                    children: [
                        { key: '0-0-0', label: 'Pedido', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
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

    aplicativoSeleccionado: any[] = []
    nombreAplicativoSeleccionado: string = '';
    codigoAplicativoAgregar: any;

    visualizarForm: boolean = false;
    visualizarLogMoficaciones: boolean = false;
    position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'top';

    constructor(private activatedRoute: ActivatedRoute,
        private _PerfilUsuarioService: PerfilUsuarioService,
        private _CompaniaService: CompaniaService,
        private _PersonaService: PersonaService,
        private _fb: FormBuilder,
        private _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        private _LayoutService: LayoutService,
        private _SecurityService: SecurityService,

    ) { this.mantenimientoForm = new FormGroup({}); }

    ngOnInit(): void {
        this.breadcrumb = this._SecurityService.nombreComponente(this.activatedRoute.snapshot.data['idMenu']) //this.activatedRoute.snapshot.data['breadcrumb'] || 'Nombre encontrado';
        this.validarTipoDispositivo();
        this.obtenerDatosSelect();
        this.estructuraForm();
        this.esconderMenu();
    }

    estructuraForm(): void {
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
    get optDetallePerfiles() {
        return this.mantenimientoForm.get('detallePerfiles') as FormArray;
    }

    agregarLineaDetallePerfiles() {
        this.optDetallePerfiles.push(this._fb.group({
            uuidv4: [uuidv4()],
            ordenVista: [this.optDetallePerfiles.length + 1],
            companiaCod: '0',
            companiaNom: 'Seleccionar',
            sucursalCod: '0',
            sucursalNom: 'Seleccionar',
            gerenciaCod: '0',
            gerenciaNom: 'Seleccionar',
            centroCostoCod: '0',
            centroCostoNom: 'Seleccionar',
            perfilCod: '0',
            perfilNom: 'Seleccionar',
        }));
    }
    eliminarYReordenarDetallePerfiles(codDetalle: number) {
        let detalleArray = this.optDetallePerfiles;

        let index = detalleArray.value.findIndex((detalle: any) => detalle.uuidv4 === codDetalle);

        if (index >= 0) {
            detalleArray.removeAt(index);

            detalleArray.controls.forEach((detalle, i) => {
                detalle.get('ordenVista')?.setValue(i + 1);
            });
        } else {
            console.log(`No se encontró el detalle con codDetalle: ${codDetalle}`);
        }
    }

    esconderMenu() {
        this._LayoutService.onMenuToggle();
    }

    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTGEN'),
            perfiles: this._PerfilUsuarioService.obtenerPerfiles({ ESTADO: 'A' }),
            companias: this._CompaniaService.obtener({})
        }).subscribe(resp => {
            const dataEstados = resp.estados?.map((ele: any) => ({
                descripcion: ele.descripcion?.trim()?.toUpperCase() || "", codigo: Number.parseInt(ele.codigo)
            }));
            this.lstEstados = [...dataEstados];

            const dataCompanias: any[] = resp.companias?.data?.map((m: any) => ({ codigo: m.Persona, descripcion: m.DescripcionCorta.trim() }));
            this.lstCompanias = [...dataCompanias];

            const dataPerfiles: any[] = resp.perfiles.map((m: any) => ({ codigo: m.Codigo, descripcion: m.Descripcion }));
            this.lstPerfiles = [...dataPerfiles];
        });
    }
    btnAccionForm(): void {
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

    btnBuscarEmpleado(campo: string): void {
        this.mantenimientoForm
            .get(campo)
            ?.valueChanges.pipe(
                debounceTime(1000),
                switchMap(res => {
                    if (res.length >= 0) {
                        if (res.length == 0) {
                            this.mantenimientoForm.get('PERSONA')?.setValue('');
                            this.mantenimientoForm.get('USUARIO')?.setValue('');
                            this.mantenimientoForm.get('NOMBRECOMPLETO')?.setValue('');
                            this.mantenimientoForm.get('CorreoElectronico')?.setValue('');
                        }
                        const filtroForm = {
                            Documento: res.trim(),
                            tipopersona: "N", // Natural
                            SoloBeneficiarios: "0",
                            UneuNegocioId: "0"
                        }
                        return this._PersonaService.obtener(filtroForm);
                    }
                    return [];
                })
            )
            .subscribe((responseApi) => {
                this.lstUsuarios = [];
                const dataResponse: any[] = responseApi.data;
                if (dataResponse.length > 0) {
                    const dataFormato = dataResponse.map(res => {
                        return {
                            ...res,
                            visible: res.Documento.trim() + ' - ' + res.NombreCompleto.trim(),
                        }
                    });
                    this.lstUsuarios = [...dataFormato];
                }
            });
    }

    onEmpleadoSeleccionado(evento: any): void {
        this.mantenimientoForm.get('PERSONA')?.setValue(evento.value.Persona);
        this.mantenimientoForm.get('USUARIO')?.setValue(evento.value.Documento);
        this.mantenimientoForm.get('NOMBRECOMPLETO')?.setValue(evento.value.NombreCompleto);
        this.mantenimientoForm.get('CorreoElectronico')?.setValue(evento.value.CorreoInterno);

        this.mantenimientoForm.get('empleadoBusqueda')?.setValue({ visible: evento.value.Documento });
    }

    onAsignarDescripcionDetalle(evento: any, detalle: FormGroup, tipo: string): void {
        switch (tipo) {
            case 'COMPANIA':
                const companiSeleccionado: any = this.lstCompanias.filter((item) => item.codigo == evento.value)[0];
                detalle.get('companiaNom')?.setValue(companiSeleccionado?.descripcion);
                break;
            case 'SUCURSAL':
                const sucursalSeleccionado: any = this.lstCompanias.filter((item) => item.codigo == evento.value)[0];
                detalle.get('companiaNom')?.setValue(sucursalSeleccionado?.descripcion);
                break;
            case 'GERENCIA':
                const gerenciaSeleccionado: any = this.lstCompanias.filter((item) => item.codigo == evento.value)[0];
                detalle.get('companiaNom')?.setValue(gerenciaSeleccionado?.descripcion);
                break;
            case 'CENTROCOSTO':
                const centroCostoSeleccionado: any = this.lstCompanias.filter((item) => item.codigo == evento.value)[0];
                detalle.get('companiaNom')?.setValue(centroCostoSeleccionado?.descripcion);
                break;
            case 'PERFIL':
                const perfilSeleccionado: any = this.lstCompanias.filter((item) => item.codigo == evento.value)[0];
                detalle.get('companiaNom')?.setValue(perfilSeleccionado?.descripcion);
                break;
            default:
                this.MensajeToastComun('notification', 'error', 'Error', `el tipo: '${tipo}' no está considerado .`);
                return;
        }

    }

    onAgregarAplicativoSeleccionado(): void {
        const item = this.lstPerfiles.find((item: any) => item.codigo === this.codigoAplicativoAgregar);

        if (item) {
            const aplicativoAgregar = { key: item.codigo, label: item.descripcion };
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

    onGlobalFilter(table: Table, event: Event): void {
        this.bloquearComponente = true;
        this.mantenimientoForm.disable();

        setTimeout(() => {
            table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
            this.bloquearComponente = false;
            this.mantenimientoForm.enable();
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

    // @HostListener('document:keydown.enter', ['$event'])
    // handleEnter(event: KeyboardEvent) {
    //     this.btnAccionForm();
    // }

    btnLogAuditoria(): void {
        this.visualizarLogMoficaciones = this.visualizarLogMoficaciones == true ? false : true;
    }

}
