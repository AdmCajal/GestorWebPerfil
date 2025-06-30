import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, finalize, forkJoin, of, switchMap, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { AcccionesMantenimientoComponente } from '../../../../../../core/utils/acccionesMantenimientoComponente';
import { UsuarioService } from '../../services/usuario.service';
import { ACCION_FORMULARIO } from '../../../../../../core/constants/acciones-formulario';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { PersonaService } from '../../../../../maestros/components/persona/services/persona.service';
import { v4 as uuidv4 } from 'uuid';
import { CompaniaService } from '../../../compania/services/compania.service';
import { BaseComponenteMantenimiento } from '../../../../../../core/utils/baseComponenteMantenimiento';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';
import { VisualizarPerfilUsuario } from '../../../../../../core/models/interfaces/usuario/visualizarPerfil.usuario';
import { SecurityService } from '../../../../../../security/services/Security.service';

@Component({
    selector: 'app-mantenimiento-usuario',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-usuario.component.html',
    styleUrls: ['./mantenimiento-usuario.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class MantenimientoUsuario extends BaseComponenteMantenimiento implements OnInit, AcccionesMantenimientoComponente {

    lstUsuariosBusqueda: any[] = [];
    lstCompanias: ComboItem[] = [];

    perfilSeleccionadoVisualizar: VisualizarPerfilUsuario = {
        nombrePerfil: '',
        data: []
    }

    constructor(override _ActivatedRoute: ActivatedRoute,
        override _SecurityService: SecurityService,
        override _MessageService: MessageService,
        private _UsuarioService: UsuarioService,
        private _CompaniaService: CompaniaService,
        private _PersonaService: PersonaService,
        private _fb: FormBuilder,
        private _MenuLayoutService: MenuLayoutService,
        public _Router: Router,
        override _ConfirmationService: ConfirmationService
    ) {
        super(_MessageService, _SecurityService, _ActivatedRoute, _ConfirmationService);

        this._ActivatedRoute.paramMap.subscribe(params => {
            if (params.get('accion')) {
                const accionObtenida: any = params.get('accion') || '';
                switch (accionObtenida) {
                    case 'AGREGAR':
                    case 'EDITAR':
                    case 'VER':
                        this.accion = accionObtenida;
                        break;
                    default:
                        console.error(`La acción detectada no está contemplada: ${accionObtenida}`)
                        return;
                }
            } else {
                console.error(`La acción detectada no está contemplada: ${params.get('accion') || 'No se encontró'}`)
            }
        });
    }

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
    get optDetallePerfiles(): FormArray<any> {
        return this.mantenimientoForm.get('detallePerfiles') as FormArray;
    }

    btnAgregarLineaDetallePerfiles(): void {
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
    btnEliminarYReordenarDetallePerfiles(codDetalle: number): void {
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

    btnVisualizarPerfil(detalle: FormGroup): void {
        this.perfilSeleccionadoVisualizar.nombrePerfil = detalle.get('perfilNom')?.value || '';
        this.perfilSeleccionadoVisualizar.data = [
            {
                key: '0',
                label: 'Aplicativos',
                data: 'Documents Folder',
                icon: 'pi pi-fw pi-inbox',
                children: [
                    {
                        key: '0-0',
                        label: 'Spring',
                        data: 'Work Folder',
                        icon: 'pi pi-fw pi-cog',
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
                    }
                ]
            }
        ];
    }



    override guardarMantenimiento(): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.mantenimientoForm.disable();
        let valorAccionServicio: number = this.accion == ACCION_FORMULARIO.AGREGAR ? ACCION_MANTENIMIENTO.AGREGAR : ACCION_MANTENIMIENTO.ACTUALIZAR;

        // this._UsuarioService.mantenimiento(valorAccionServicio, this.mantenimientoForm.value).pipe(
        //     tap((response: ResponseApi) => {
        //         if (response.success) {
        //             this.MensajeToastComun('notification', 'success', 'Correcto', response.mensaje);
        //             this.visualizarForm = false;
        //             this.estructuraForm();
        //             this.msjMantenimiento.emit({ accion: this.accion, buscar: true });
        //         } else {
        //             this.MensajeToastComun('notification', 'error', 'Error', response.mensaje);
        //         }

        //     }), catchError((error) => {
        //         this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
        //         return of(null);
        //     }),
        //     finalize(() => {
        //         this.bloquearComponente = false;
        //         this.barraBusqueda = false;
        //         this.mantenimientoForm.enable();
        //     })
        // ).subscribe();

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
                this.lstUsuariosBusqueda = [];
                const dataResponse: any[] = responseApi.data;
                if (dataResponse.length > 0) {
                    const dataFormato = dataResponse.map(res => {
                        return {
                            ...res,
                            visible: res.Documento.trim() + ' - ' + res.NombreCompleto.trim(),
                        }
                    });
                    this.lstUsuariosBusqueda = [...dataFormato];
                }
            });
    }

    btnMantenimientoFormulario(): void {
        this._Router.navigate(['../../'], { relativeTo: this._ActivatedRoute });
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

}
