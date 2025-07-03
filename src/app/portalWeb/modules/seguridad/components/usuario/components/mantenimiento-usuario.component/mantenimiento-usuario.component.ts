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
import { SucursalService } from '../../../../../maestros/components/sucursal/services/sucursal.service';

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
    lstCompania: ComboItem[] = [];
    lstSucursal: ComboItem[] = [];
    lstGerencia: ComboItem[] = [];
    lstCentroCosto: ComboItem[] = [];
    lstPerfilUsuario: ComboItem[] = [];

    perfilSeleccionadoVisualizar: VisualizarPerfilUsuario = {
        nombrePerfil: '',
        aplicativos: []
    }

    constructor(override _ActivatedRoute: ActivatedRoute,
        override _SecurityService: SecurityService,
        override _MessageService: MessageService,
        private _UsuarioService: UsuarioService,
        private _CompaniaService: CompaniaService,
        private _SucursalService: SucursalService,
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
            
            IndicadorValidarUsuarioRed: [{ value: '', disabled: this.bloquearComponente }],
            UsuarioRed: [{ value: '', disabled: this.bloquearComponente }],
            UnidadReplicacionDominioRed: [{ value: '', disabled: this.bloquearComponente }],

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
            this.lstEstados = [...dataEstados || []];

            const dataCompanias: any[] = resp.companias?.data?.map((m: any) => ({ codigo: m.Persona, descripcion: m.DescripcionCorta.trim() }));
            this.lstCompania = [...dataCompanias || []];
        });
    }
    override obtenerDatosMantenimiento(): void { }
    get optDetallePerfiles() {
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

    btnLimpiarPerfil(): void {
        this.perfilSeleccionadoVisualizar = {
            nombrePerfil: '',
            aplicativos: []
        }
    }
    btnVisualizarPerfil(detalle?: FormGroup): void {
        this.perfilSeleccionadoVisualizar.nombrePerfil = detalle?.get('perfilNom')?.value || '';
        this.perfilSeleccionadoVisualizar.aplicativos = [
            {
                Sistema: '', Nombre: 'app', Descripcion: 'Descripcion de aplicativo nro 1', UrlSistema: 'http://aplicativon.ro1.com', Estado: 1, DesEstado: 'Activo', modulos: [
                    {
                        key: 1, icon: 'pi pi-folder', label: 'Módulo', tipoNodo: 'M', data: '', url: '', checked: false, sobreEscribir: false, esEditable: true, IdOpcionPadre: 0, codigoObj: '', icono: '', Compania: '00000100', DescripcionCorta: '', Sistema: '', NivelOpcion: 0, Orden: 0, children: [
                            { key: 2, icon: 'pi pi-file', label: 'Formulario', tipoNodo: 'F', data: '', url: '', checked: false, sobreEscribir: false, esEditable: true, IdOpcionPadre: 0, codigoObj: '', icono: '', Compania: '00000100', DescripcionCorta: '', Sistema: '', NivelOpcion: 0, Orden: 0, children: [] },
                        ]
                    }
                ]
            },
            {
                Sistema: '', Nombre: 'app 2', Descripcion: 'Descripcion de aplicativo nro 2', UrlSistema: 'http://aplicativo.nro2.com', Estado: 1, DesEstado: 'Activo', modulos: []
            },
            {
                Sistema: '', Nombre: 'app 3', Descripcion: 'Descripcion de aplicativo nro 3', UrlSistema: 'http://aplicativo.nro3.com', Estado: 1, DesEstado: 'Activo', modulos: []
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
                const companiSeleccionado: any = this.lstCompania.filter((item) => item.codigo == evento.value)[0];
                detalle.get('companiaNom')?.setValue(companiSeleccionado?.descripcion);
                detalle.get('sucursalNom')?.setValue('');
                detalle.get('gerenciaNom')?.setValue('');
                detalle.get('centroCostoNom')?.setValue('');
                detalle.get('perfilNom')?.setValue('');

                this.btnObtenerSucursal(evento);
                break;
            case 'SUCURSAL':
                const sucursalSeleccionado: any = this.lstSucursal.filter((item) => item.codigo == evento.value)[0];
                detalle.get('sucursalNom')?.setValue(sucursalSeleccionado?.descripcion);
                detalle.get('gerenciaNom')?.setValue('');
                detalle.get('centroCostoNom')?.setValue('');
                detalle.get('perfilNom')?.setValue('');
                break;
            case 'GERENCIA':
                const gerenciaSeleccionado: any = this.lstGerencia.filter((item) => item.codigo == evento.value)[0];
                detalle.get('gerenciaNom')?.setValue(gerenciaSeleccionado?.descripcion);
                detalle.get('centroCostoNom')?.setValue('');
                detalle.get('perfilNom')?.setValue('');
                break;
            case 'CENTROCOSTO':
                const centroCostoSeleccionado: any = this.lstCentroCosto.filter((item) => item.codigo == evento.value)[0];
                detalle.get('centroCostoNom')?.setValue(centroCostoSeleccionado?.descripcion);
                detalle.get('perfilNom')?.setValue('');
                break;
            case 'PERFIL':
                const perfilSeleccionado: any = this.lstPerfilUsuario.filter((item) => item.codigo == evento.value)[0];
                detalle.get('perfilNom')?.setValue(perfilSeleccionado?.descripcion);
                break;
            default:
                this.MensajeToastComun('notification', 'error', 'Error', `el tipo: '${tipo}' no está considerado .`);
                return;
        }
    }

    btnObtenerSucursal(evento: any): void {
        this.lstSucursal = [];
        this.lstGerencia = [];
        this.lstCentroCosto = [];
        this.lstPerfilUsuario = [];

        forkJoin({
            sucursales: this._SucursalService.obtener({ IdEmpresa: evento.value }),
        }).subscribe(resp => {
            const data = resp.sucursales?.data?.map((ele: any) => ({
                descripcion: ele.SedDescripcion?.trim()?.toUpperCase() || "", codigo: ele.SedCodigo
            }));
            console.log(data)
            this.lstSucursal = [...data];
        });
    }
}
