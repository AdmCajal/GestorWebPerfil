import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { catchError, concatMap, EMPTY, finalize, forkJoin, from, map, Observable, of, switchMap, tap, throwError, toArray } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, TreeDragDropService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { AcccionesMantenimientoComponente } from '../../../../../../core/utils/acccionesMantenimientoComponente';
import { AccionFormulario } from '../../../../../../core/enums/accionFormulario.enum';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { AplicativoService } from '../../services/aplicativo.service';
import { SecurityService } from '../../../../../../security/services/Security.service';
import { ModuloAplicativo } from '../../../../../../core/models/interfaces/aplicativo/modulo.aplicativo';
import { NodoSeleccionadoModulo } from '../../../../../../core/models/interfaces/aplicativo/NodoSeleccionadoModulo.aplicativo';
import { BaseComponenteMantenimiento } from '../../../../../../core/utils/baseComponenteMantenimiento';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';
import { TIPO_NODO_APLICATIVO } from '../../../../../../core/constants/tipo-nodo.aplicativo';

@Component({
    selector: 'app-mantenimiento-aplicativo',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-aplicativo.component.html',
    styleUrls: ['./mantenimiento-aplicativo.component.scss'],
    providers: [TreeDragDropService, ConfirmationService, MessageService]
})
export class MantenimientoAplicativo extends BaseComponenteMantenimiento implements OnInit, AcccionesMantenimientoComponente {
    @Output() override msjMantenimiento = new EventEmitter<any>();
    lstIconos: ComboItem[] = [];

    lstModulosDisponibles: ModuloAplicativo[] = [];
    lstModulosAsignados: ModuloAplicativo[] = [];

    lstKeyGeneradas: number[] = [];
    nodoModuloSeleccionado: NodoSeleccionadoModulo = {
        esVisible: false,
        tituloDialog: '',
        tipo: '',
        accionRealizar: ACCION_MANTENIMIENTO.AGREGAR,
        nodoPadre: null,
        nodo: { key: 1, icon: '', label: '', tipoNodo: '', data: '', url: '', checked: false, sobreEscribir: false, esEditable: true, IdOpcionPadre: 0, codigoObj: '', icono: '', Compania: '', DescripcionCorta: '', Sistema: '', NivelOpcion: 0, Orden: 0, children: [] },
    };


    comentarioModulos: string = 'Agregue un módulo o formulario...';

    tipoNodoModulo: any = TIPO_NODO_APLICATIVO.MODULO;
    tipoNodoFormulario: any = TIPO_NODO_APLICATIVO.FORMULARIO;
    tipoNodoAccion: any = TIPO_NODO_APLICATIVO.ACCION;
    constructor(override _ActivatedRoute: ActivatedRoute,
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
        this.AgregarlstModulosDisponibles();
    }

    override estructuraForm(): void {
        this.comentarioModulos = 'Agregue un módulo o formulario...';
        this.mantenimientoForm = this._fb.group({
            Sistema: [{ value: this.generarCodigoAP(), disabled: this.bloquearComponente }, [Validators.maxLength(4)]],
            Nombre: [{ value: '', disabled: this.bloquearComponente }],
            Descripcion: [{ value: '', disabled: this.bloquearComponente }],
            UrlSistema: [{ value: '', disabled: this.bloquearComponente }],
            Estado: [{ value: 1, disabled: this.bloquearComponente }]
        });
    }

    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTGEN')
        }).subscribe(resp => {
            const dataEstados = resp.estados?.map((ele: any) => ({
                descripcion: ele.descripcion?.trim()?.toUpperCase() || "", codigo: Number.parseInt(ele.codigo)
            }));
            this.lstEstados = [...dataEstados];
            this.lstIconos = [
                { codigo: 'pi pi-user-plus', descripcion: 'Agregar usuario' },
                { codigo: 'pi pi-user-plus', descripcion: 'Agregar usuario' },
                { codigo: 'pi pi-plus-circle', descripcion: 'Agregar (círculo)' },
                { codigo: 'pi pi-plus', descripcion: 'Agregar' },
                { codigo: 'pi pi-folder-plus', descripcion: 'Agregar carpeta' },
                { codigo: 'pi pi-file-plus', descripcion: 'Agregar archivo' },
                { codigo: 'pi pi-cart-plus', descripcion: 'Agregar al carrito' },
                { codigo: 'pi pi-calendar-plus', descripcion: 'Agregar evento' },
                { codigo: 'pi pi-search-plus', descripcion: 'Ampliar búsqueda' },
                { codigo: 'pi pi-file-edit', descripcion: 'Editar archivo' },
                { codigo: 'pi pi-pen-to-square', descripcion: 'Editar (cuadro)' },
                { codigo: 'pi pi-pencil', descripcion: 'Editar' },
                { codigo: 'pi pi-user-edit', descripcion: 'Editar usuario' },
                { codigo: 'pi pi-minus', descripcion: 'Eliminar' },
                { codigo: 'pi pi-minus-circle', descripcion: 'Eliminar (círculo)' },
                { codigo: 'pi pi-search-minus', descripcion: 'Reducir búsqueda' },
                { codigo: 'pi pi-user-minus', descripcion: 'Eliminar usuario' },
                { codigo: 'pi pi-calendar-minus', descripcion: 'Eliminar evento' },
                { codigo: 'pi pi-cart-minus', descripcion: 'Eliminar del carrito' },
                { codigo: 'pi pi-trash', descripcion: 'Papelera / Eliminar' },
                { codigo: 'pi pi-check', descripcion: 'Aceptar / Confirmar' },
                { codigo: 'pi pi-check-circle', descripcion: 'Confirmar (círculo)' },
                { codigo: 'pi pi-check-square', descripcion: 'Confirmar (cuadro)' },
                { codigo: 'pi pi-file-check', descripcion: 'Archivo verificado' },
                { codigo: 'pi pi-verified', descripcion: 'Verificado' },
                { codigo: 'pi pi-clone', descripcion: 'Duplicar / Clonar' },
                { codigo: 'pi pi-cog', descripcion: 'Configuración' },
                { codigo: 'pi pi-download', descripcion: 'Descargar' },
                { codigo: 'pi pi-upload', descripcion: 'Subir archivo' },
                { codigo: 'pi pi-envelope', descripcion: 'Correo / Mensaje' },
                { codigo: 'pi pi-exclamation-circle', descripcion: 'Advertencia / Alerta' }
            ];
        });
    }

    override obtenerDatosMantenimiento(): void {
        this.comentarioModulos = 'Obteniendo módulos de aplicativo...';
        const Sistema = this.mantenimientoForm.get('Sistema');
        if (Sistema)
            Sistema.disable();

        this.lstModulosAsignados = [];
        forkJoin({
            modulos: this._AplicativoService.obtenerJerarquias({ Codigo: this.mantenimientoForm.get('Sistema')?.value || '' })
        }).subscribe(resp => {
            const modulos = resp.modulos;

            if (modulos.success) {
                this.lstModulosAsignados = [...resp.modulos.data?.result];
                if (this.lstModulosAsignados.length == 0) this.comentarioModulos = 'No se encontró información...';
            } else {
                this.comentarioModulos = 'No se encontró información...';
                this.MensajeToastComun('notification', 'error', 'Error', `${modulos.mensaje}`); return;
            }
        });
    }

    guardarModuloRecursivo(nodo: ModuloAplicativo): Observable<any> {
        return this._AplicativoService.mantenimientoModulo('INDIVIDUAL', ACCION_MANTENIMIENTO.AGREGAR, nodo).pipe(
            tap((response: ResponseApi) => {
                if (response.success) {
                    nodo.key = response.data.key;
                } else {
                    this.MensajeToastComun('notification', 'error', 'Error', response.mensaje);
                }
            }),
            concatMap((response: ResponseApi) => {
                if (!response.success) return EMPTY;

                if (nodo.children?.length > 0) {
                    return from(nodo.children).pipe(
                        concatMap((child: ModuloAplicativo) => {
                            child.IdOpcionPadre = nodo.key;
                            return this.guardarModuloRecursivo(child);
                        })
                    );
                }
                return of(null);
            }),
            catchError((error) => {
                console.error(error);
                this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
                return of(null);
            })
        );
    }

    private recolectarGuardados(nodo: ModuloAplicativo): Observable<any>[] {
        const operaciones: Observable<any>[] = [];

        const operacion = this._AplicativoService.mantenimientoModulo('INDIVIDUAL', ACCION_MANTENIMIENTO.AGREGAR, nodo).pipe(
            tap((response: ResponseApi) => {
                if (response.success) {
                    nodo.key = response.data.key;
                    this.MensajeToastComun('notification', 'success', 'Correcto', `Guardado ${nodo.label}`);
                } else {
                    this.MensajeToastComun('notification', 'error', 'Error', response.mensaje);
                }
            }),
            concatMap((response: ResponseApi) => {
                if (!response.success || !nodo.children || nodo.children.length == 0) {
                    return of(null);
                }

                const hijosObs = nodo.children.map(child => {
                    child.IdOpcionPadre = nodo.key;
                    return this.recolectarGuardados(child);
                });

                // Aplanamos todos los hijos (recursivamente)
                return forkJoin(hijosObs.map(obsList => forkJoin(obsList))).pipe(concatMap(() => of(null)));
            }),
            catchError((error) => {
                this.MensajeToastComun('notification', 'error', 'Error', `Error en ${nodo.label}`);
                console.error(error);
                return of(null);
            })
        );

        operaciones.push(operacion);
        return operaciones;
    }


    override guardarMantenimiento(): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.mantenimientoForm.disable();

        const valorAccionServicio = this.accion == AccionFormulario.AGREGAR
            ? ACCION_MANTENIMIENTO.AGREGAR
            : ACCION_MANTENIMIENTO.ACTUALIZAR;
        this._AplicativoService.mantenimiento(valorAccionServicio, this.mantenimientoForm.value).pipe(
            switchMap((response: ResponseApi) => {
                if (!response.success) {
                    this.MensajeToastComun('notification', 'error', 'Error', response.mensaje);
                    return of(response);
                } else {

                    return this._AplicativoService.mantenimientoModulo('MASIVO', this.nodoModuloSeleccionado.accionRealizar, this.lstModulosAsignados);
                }
            }),
            tap((response: ResponseApi) => {
                if (response.success) {
                    this.MensajeToastComun('notification', 'success', 'Correcto', response.mensaje);
                    this.visualizarForm = false;
                    this.msjMantenimiento.emit({ accion: this.accion, buscar: true });
                } else {
                    this.MensajeToastComun('notification', 'error', 'Error', response.mensaje);
                }
            }), catchError((error) => {
                console.error(`Error. ${JSON.stringify(error)}`);

                if (error.message.includes('Http failure response')) {
                    this.MensajeToastComun('notification', 'error', 'Sin respuesta', 'Hubo un problema de conexión. Por favor, verifica tu red e inténtalo nuevamente.');
                } else {
                    this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
                }
                console.error(`Error. ${JSON.stringify(error)}`);
                return of(error);
            }),
            finalize(() => {
                this.bloquearComponente = false;
                this.barraBusqueda = false;
                this.mantenimientoForm.enable();
            })
        ).subscribe();

        // if (valorAccionServicio == ACCION_MANTENIMIENTO.AGREGAR) {
        //     this._AplicativoService.mantenimiento(valorAccionServicio, this.mantenimientoForm.value).pipe(
        //         switchMap((response: ResponseApi) => {
        //             if (!response.success) {
        //                 this.MensajeToastComun('notification', 'error', 'Error', response.mensaje);
        //                 return of(response);
        //             } else {

        //                 return this._AplicativoService.mantenimientoModulo('MASIVO', this.nodoModuloSeleccionado.accionRealizar, this.lstModulosAsignados);
        //             }
        //         }),
        //         tap((response: ResponseApi) => {
        //             if (response.success) {
        //                 this.MensajeToastComun('notification', 'success', 'Correcto', response.mensaje);
        //                 this.visualizarForm = false;
        //                 this.msjMantenimiento.emit({ accion: this.accion, buscar: true });
        //             } else {
        //                 this.MensajeToastComun('notification', 'error', 'Error', response.mensaje);
        //             }
        //         }), catchError((error) => {
        //             console.error(`Error. ${JSON.stringify(error)}`);

        //             if (error.message.includes('Http failure response')) {
        //                 this.MensajeToastComun('notification', 'error', 'Sin respuesta', 'Hubo un problema de conexión. Por favor, verifica tu red e inténtalo nuevamente.');
        //             } else {
        //                 this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
        //             }
        //             console.error(`Error. ${JSON.stringify(error)}`);
        //             return of(error);
        //         }),
        //         finalize(() => {
        //             this.bloquearComponente = false;
        //             this.barraBusqueda = false;
        //             this.mantenimientoForm.enable();
        //         })
        //     ).subscribe();
        // } else {
        //     this._AplicativoService.mantenimiento(valorAccionServicio, this.mantenimientoForm.value).pipe(
        //         tap((response: ResponseApi) => {
        //             if (response.success) {
        //                 this.MensajeToastComun('notification', 'success', 'Correcto', response.mensaje);
        //                 this.visualizarForm = false;
        //                 this.msjMantenimiento.emit({ accion: this.accion, buscar: true });
        //             } else {
        //                 this.MensajeToastComun('notification', 'error', 'Error', response.mensaje);
        //             }
        //         }), catchError((error) => {
        //             console.error(`Error. ${JSON.stringify(error)}`);

        //             if (error.message.includes('Http failure response')) {
        //                 this.MensajeToastComun('notification', 'error', 'Sin respuesta', 'Hubo un problema de conexión. Por favor, verifica tu red e inténtalo nuevamente.');
        //             } else {
        //                 this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
        //             }
        //             console.error(`Error. ${JSON.stringify(error)}`);
        //             return of(error);
        //         }),
        //         finalize(() => {
        //             this.barraBusqueda = false;
        //         })
        //     ).subscribe();
        // }
    }

    // override guardarMantenimiento(): void {
    //     this.bloquearComponente = true;
    //     this.barraBusqueda = true;
    //     this.mantenimientoForm.disable();

    //     let valorAccionServicio: number = this.accion == ACCION_FORMULARIO.AGREGAR ? ACCION_MANTENIMIENTO.AGREGAR : ACCION_MANTENIMIENTO.ACTUALIZAR;

    //     this._AplicativoService.mantenimiento(valorAccionServicio, this.mantenimientoForm.value).pipe(
    //         tap((response: ResponseApi) => {
    //             if (response.success) {
    //                 this.MensajeToastComun('notification', 'success', 'Correcto', response.mensaje);
    //                 this.visualizarForm = false;
    //                 this.estructuraForm();
    //                 this.msjMantenimiento.emit({ accion: this.accion, buscar: true });
    //             } else {
    //                 this.MensajeToastComun('notification', 'error', 'Error', response.mensaje);
    //             }

    //         }), catchError((error) => {
    //             this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
    //             return of(null);
    //         }),
    //         finalize(() => {
    //             this.bloquearComponente = false;
    //             this.barraBusqueda = false;
    //             this.mantenimientoForm.enable();
    //         })
    //     ).subscribe();



    //     if (valorAccionServicio == ACCION_MANTENIMIENTO.ACTUALIZAR) {
    //         this._AplicativoService.mantenimientoModulo('MASIVO', this.nodoModuloSeleccionado.accionRealizar, this.lstModulosAsignados).pipe(
    //             tap((response: ResponseApi) => {
    //                 if (response.success) {
    //                     this.MensajeToastComun('notification', 'success', 'Correcto', response.mensaje);
    //                     this.visualizarForm = false;
    //                     this.estructuraForm();
    //                     this.msjMantenimiento.emit({ accion: this.accion, buscar: true });
    //                 } else {
    //                     this.MensajeToastComun('notification', 'error', 'Error', response.mensaje);
    //                 }

    //             }), catchError((error) => {
    //                 this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
    //                 return of(null);
    //             }),
    //             finalize(() => {
    //                 this.bloquearComponente = false;
    //                 this.barraBusqueda = false;
    //                 this.mantenimientoForm.enable();
    //             })
    //         ).subscribe();
    //     }

    // }
    generarCodigoAP(): string {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const aleatorio = Array.from({ length: 2 }, () =>
            caracteres.charAt(Math.floor(Math.random() * caracteres.length))
        ).join('');

        return `AP${aleatorio}`;
    }
    onNodeDropEliminarNodo(evento: any): void {
        this.AgregarlstModulosDisponibles();

        const nodoIngreso: ModuloAplicativo = evento?.dragNode;
        if (nodoIngreso) {
            const nodoPadre = this.buscarNodoPadre(this.lstModulosAsignados, nodoIngreso);

            if (nodoPadre)
                nodoIngreso.IdOpcionPadre = nodoPadre.key;

            this.nodoModuloSeleccionado.esVisible = false;
            this.nodoModuloSeleccionado.accionRealizar = ACCION_MANTENIMIENTO.ELIMINAR;
            this.nodoModuloSeleccionado.nodo = nodoIngreso;
            this.nodoModuloSeleccionado.nodoPadre = nodoPadre;
            this.actualizarModulosAsignados();
        }
    }

    onNodeDropLstModulosAsignados(evento: any): void {
        this.AgregarlstModulosDisponibles();

        const nodoIngreso: ModuloAplicativo = evento?.dragNode;
        if (nodoIngreso) {
            setTimeout(() => {
                const nodoPadre = this.buscarNodoPadre(this.lstModulosAsignados, nodoIngreso);
                nodoIngreso.key = this.generarCodigoUnico();
                nodoIngreso.Sistema = this.mantenimientoForm.get('Sistema')?.value; // acción realizada por todo tipó de evento

                if (nodoPadre) {
                    nodoIngreso.IdOpcionPadre = nodoPadre.key;
                    nodoIngreso.NivelOpcion = nodoPadre.NivelOpcion + 1;

                } else {
                    nodoIngreso.NivelOpcion = 1;
                    nodoIngreso.Orden = 1;
                }

                this.nodoModuloSeleccionado.esVisible = true;
                this.nodoModuloSeleccionado.accionRealizar = ACCION_MANTENIMIENTO.AGREGAR;

                switch (nodoIngreso.tipoNodo) {
                    case TIPO_NODO_APLICATIVO.MODULO:
                        nodoIngreso.icon = 'pi pi-folder-open';
                        this.nodoModuloSeleccionado.tipo = 'módulo';
                        break;
                    case TIPO_NODO_APLICATIVO.FORMULARIO:
                        nodoIngreso.icon = nodoIngreso.icon.replace('plus', 'check');
                        this.nodoModuloSeleccionado.tipo = 'formulario';
                        break;
                    case TIPO_NODO_APLICATIVO.ACCION:
                        this.nodoModuloSeleccionado.tipo = 'acción';
                        break;
                }
                this.nodoModuloSeleccionado.tituloDialog = `Opciones de ${this.nodoModuloSeleccionado.tipo}`;
                this.nodoModuloSeleccionado.nodo = nodoIngreso;
                this.nodoModuloSeleccionado.nodoPadre = nodoPadre;
                this.asignarOrdenPorUbicacion(this.lstModulosAsignados, nodoIngreso);
            });

        }
    }

    buscarNodoPadre(nodos: ModuloAplicativo[], nodoBuscado: ModuloAplicativo): ModuloAplicativo | null {
        for (let nodo of nodos) {
            if (nodo.children?.includes(nodoBuscado)) {
                return nodo;
            }

            const posiblePadre = this.buscarNodoPadre(nodo.children || [], nodoBuscado);
            if (posiblePadre) {
                return posiblePadre;
            }
        }
        return null;
    }

    asignarOrdenPorUbicacion(nodos: ModuloAplicativo[], nodoBuscado: ModuloAplicativo): boolean {
        for (let i = 0; i < nodos.length; i++) {
            const nodo = nodos[i];

            if (nodo === nodoBuscado) {
                nodos.sort((a, b) => a.label.localeCompare(b.label));

                nodos.forEach((n, index) => {
                    n.Orden = index + 1;
                });

                return true;
            }

            if (nodo.children?.length) {
                const encontrado = this.asignarOrdenPorUbicacion(nodo.children, nodoBuscado);
                if (encontrado) return true;
            }
        }

        return false;
    }


    btnNodoSeleccionado(nodoIngreso: any): void {
        this.nodoModuloSeleccionado.esVisible = true;
        this.nodoModuloSeleccionado.accionRealizar = ACCION_MANTENIMIENTO.ACTUALIZAR;

        this.nodoModuloSeleccionado.tipo = `${nodoIngreso.tipoNodo == TIPO_NODO_APLICATIVO.MODULO ? 'módulo' :
            nodoIngreso.tipoNodo == TIPO_NODO_APLICATIVO.FORMULARIO ? 'formulario' : 'acción'}`;
        this.nodoModuloSeleccionado.tituloDialog = `Opciones de ${this.nodoModuloSeleccionado.tipo}`;
        this.nodoModuloSeleccionado.nodo = nodoIngreso;
    }

    btnNodoCambioNombre(nodo: ModuloAplicativo): void {
        this.nodoModuloSeleccionado.accionRealizar = ACCION_MANTENIMIENTO.ACTUALIZAR;
        this.nodoModuloSeleccionado.tipo = `${nodo.tipoNodo == TIPO_NODO_APLICATIVO.MODULO ? 'módulo' :
            nodo.tipoNodo == TIPO_NODO_APLICATIVO.FORMULARIO ? 'formulario' : 'acción'}`;
        this.nodoModuloSeleccionado.tituloDialog = `Opciones de ${this.nodoModuloSeleccionado.tipo}`;
        this.nodoModuloSeleccionado.nodo = nodo;
        nodo.sobreEscribir = false;
        this.actualizarModulosAsignados();
        console.log(this.convListaPlana(this.lstModulosAsignados))

    }


    convListaPlana(nodes: ModuloAplicativo[]): ModuloAplicativo[] {
        const flat: ModuloAplicativo[] = [];

        function recurse(current: ModuloAplicativo[], parentKey: number | null) {
            for (const node of current) {
                // Extraemos los campos que no queremos propagar
                const { children, ...rest } = node;

                // Creamos el nuevo nodo plano
                const flatNode: ModuloAplicativo = {
                    ...rest,
                    children: [],
                };

                flat.push(flatNode);
                if (children && children.length > 0) {
                    recurse(children, flatNode.key);
                }
            }
        }
        recurse(nodes, null);
        return flat;
    }

    onDialogNodoOptFormulario(): void {
        if (this.nodoModuloSeleccionado && this.nodoModuloSeleccionado?.nodo) {
            const tipoCod = this.nodoModuloSeleccionado.nodo.tipoNodo;
            const tipoDesc = this.nodoModuloSeleccionado.tipo;

            if (this.nodoModuloSeleccionado.nodo.label.length == 0) {
                this.MensajeToastComun('notification', 'warn', 'Advertencia', `Debe ingresar el nombre de ${tipoDesc}`); return;
            }
            if (this.nodoModuloSeleccionado.nodo.codigoObj.length == 0) {
                this.MensajeToastComun('notification', 'warn', 'Advertencia', `Debe ingresar el código de objeto`); return;
            }

            switch (tipoCod) {
                case TIPO_NODO_APLICATIVO.MODULO:
                    break;
                case TIPO_NODO_APLICATIVO.FORMULARIO:
                    if (this.nodoModuloSeleccionado.nodo.url.length == 0) {
                        this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Debe ingresar una url'); return;
                    }
                    break;
                case TIPO_NODO_APLICATIVO.ACCION:
                    // if (this.nodoModuloSeleccionado.nodo.icono.length == 0) {
                    //     this.MensajeToastComun('notification', 'warn', 'Advertencia', `Debe ingresar el icono`); return;
                    // }
                    break;
                default:
                    this.MensajeToastComun('notification', 'warn', 'Advertencia', `Tipo de opción no válida: ${tipoCod}`); return;

            }

            this.nodoModuloSeleccionado.nodo.sobreEscribir = false;
            this.nodoModuloSeleccionado.esVisible = false;
            this.actualizarModulosAsignados();
        }
    }

    AgregarlstModulosDisponibles(): void {
        this.lstModulosDisponibles = [
            { key: 1, icon: 'pi pi-folder-plus', label: 'Módulo', tipoNodo: TIPO_NODO_APLICATIVO.MODULO, data: '', url: '', checked: false, sobreEscribir: false, esEditable: true, IdOpcionPadre: 0, codigoObj: '', icono: '', Compania: '00000100', DescripcionCorta: '', Sistema: '', NivelOpcion: 0, Orden: 0, children: [] },
            { key: 2, icon: 'pi pi-file-plus', label: 'Formulario', tipoNodo: TIPO_NODO_APLICATIVO.FORMULARIO, data: '', url: '', checked: false, sobreEscribir: false, esEditable: true, IdOpcionPadre: 0, codigoObj: '', icono: '', Compania: '00000100', DescripcionCorta: '', Sistema: '', NivelOpcion: 0, Orden: 0, children: [] },
            { key: 3, icon: 'pi pi-objects-column', label: 'Acción', tipoNodo: TIPO_NODO_APLICATIVO.ACCION, data: '', url: '', checked: false, sobreEscribir: false, esEditable: true, IdOpcionPadre: 0, codigoObj: '', icono: '', Compania: '00000100', DescripcionCorta: '', Sistema: '', NivelOpcion: 0, Orden: 0, children: [] }
        ];

        // const existeModulo: boolean = this.lstModulosDisponibles.filter((f: ModuloAplicativo) => f.tipoNodo == TIPO_NODO_APLICATIVO.MODULO).length > 0;
        // const existeFormulario: boolean = this.lstModulosDisponibles.filter((f: ModuloAplicativo) => f.tipoNodo == TIPO_NODO_APLICATIVO.FORMULARIO).length > 0;
        // const existeAccion: boolean = this.lstModulosDisponibles.filter((f: ModuloAplicativo) => f.tipoNodo == TIPO_NODO_APLICATIVO.ACCION).length > 0;
    }

    generarCodigoUnico(longitud: number = 6): number {
        let nuevoCodigo: number;
        do {
            nuevoCodigo = Math.floor(Math.random() * Math.pow(10, longitud));
        } while (this.lstKeyGeneradas.includes(nuevoCodigo));
        return nuevoCodigo;
    }

    actualizarModulosAsignados(): void {

        const nodo: ModuloAplicativo = this.nodoModuloSeleccionado.nodo;

        switch (this.accion) {

            case AccionFormulario.EDITAR:
                this.barraBusqueda = true;
                this._AplicativoService.mantenimientoModulo('INDIVIDUAL', this.nodoModuloSeleccionado.accionRealizar, nodo).pipe(
                    tap((response: ResponseApi) => {
                        if (response.success) {
                            this.MensajeToastComun('notification', 'success', 'Correcto', response.mensaje);
                            if (this.nodoModuloSeleccionado.accionRealizar == ACCION_MANTENIMIENTO.AGREGAR)
                                nodo.key = response.data.key;
                        } else {
                            this.MensajeToastComun('notification', 'error', 'Error', response.mensaje);
                        }

                    }), catchError((error) => {
                        console.log(error)
                        this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
                        return of(null);
                    }),
                    finalize(() => {
                        this.barraBusqueda = false;
                    })
                ).subscribe();
                break;
        }
    }


}
