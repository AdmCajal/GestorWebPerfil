import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService, TreeDragDropService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { AcccionesMantenimientoComponente } from '../../../../../../core/utils/acccionesMantenimientoComponente';
import { ACCION_FORMULARIO } from '../../../../../../core/constants/acciones-formulario';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { AplicativoService } from '../../services/aplicativo.service';
import { SecurityService } from '../../../../../../security/services/Security.service';
import { ModuloAplicativo } from '../../../../../../core/models/interfaces/aplicativo/modulo.aplicativo';
import { NodoSeleccionadoModulo } from '../../../../../../core/models/interfaces/aplicativo/NodoSeleccionadoModulo.aplicativo';
import { BaseComponenteMantenimiento } from '../../../../../../core/utils/baseComponenteMantenimiento';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';

@Component({
    selector: 'app-mantenimiento-aplicativo',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-aplicativo.component.html',
    styleUrls: ['./mantenimiento-aplicativo.component.scss'],
    providers: [TreeDragDropService, ConfirmationService, MessageService]
})
export class MantenimientoAplicativo extends BaseComponenteMantenimiento implements OnInit, AcccionesMantenimientoComponente {



    lstIconos: ComboItem[] = [];

    lstModulosDisponibles: ModuloAplicativo[] = [];
    lstModulosAsignados: ModuloAplicativo[] = [];

    nodoModuloSeleccionado: NodoSeleccionadoModulo = {
        esVisible: false, tituloDialog: '', tipo: '', nodo: { key: 1, icon: '', label: '', tipoNodo: '', data: '', url: '', sobreEscribir: false, esEditable: true, codigoObj: '', icono: '', children: [] }
    };

    constructor(override _ActivatedRoute: ActivatedRoute,
        private _PerfilUsuarioService: AplicativoService,
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
        this.mantenimientoForm = this._fb.group({
            Sistema: [{ value: '', disabled: this.bloquearComponente }],
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
                { codigo: 'pi pi-exclamation-circle', descripcion: 'Advertencia / Alerta' },
            ];
        });
    }

    override obtenerDatosMantenimiento(): void {
        forkJoin({
            modulos: this._PerfilUsuarioService.obtenerJerarquias({ Codigo: this.mantenimientoForm.get('Sistema')?.value || '' })
        }).subscribe(resp => {
            if (resp.modulos.data) {
                console.log(resp.modulos.data.result);
                this.lstModulosAsignados = [...resp.modulos.data.result];
            }

        });
    }

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

    onNodeDropLstModulosAsignados(evento: any): void {
        this.AgregarlstModulosDisponibles();

        const nodoIngreso: ModuloAplicativo = evento?.dragNode;

        if (nodoIngreso) {
            this.nodoModuloSeleccionado.esVisible = true;

            switch (nodoIngreso.tipoNodo) {
                case 'M':
                    nodoIngreso.icon = 'pi pi-folder-open';
                    this.nodoModuloSeleccionado.tipo = 'módulo';
                    break;
                case 'F':
                    nodoIngreso.icon = nodoIngreso.icon.replace('plus', 'check');
                    this.nodoModuloSeleccionado.tipo = 'formulario';
                    break;
                case 'A':
                    this.nodoModuloSeleccionado.tipo = 'acción';
                    break;
            }
            this.nodoModuloSeleccionado.tituloDialog = `Opciones de ${this.nodoModuloSeleccionado.tipo}`;
            this.nodoModuloSeleccionado.nodo = nodoIngreso;
        }
    }

    btnNodoSeleccionado(nodoIngreso: any): void {
        this.nodoModuloSeleccionado.esVisible = true;
        this.nodoModuloSeleccionado.tipo = `${nodoIngreso.tipoNodo == 'M' ? 'módulo' :
            nodoIngreso.tipoNodo == 'F' ? 'formulario' : 'acción'}`;
        this.nodoModuloSeleccionado.tituloDialog = `Opciones de ${this.nodoModuloSeleccionado.tipo}`;
        this.nodoModuloSeleccionado.nodo = nodoIngreso;

        console.log(JSON.stringify(this.lstModulosAsignados))
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
                case 'M':
                    break;
                case 'F':
                    if (this.nodoModuloSeleccionado.nodo.url.length == 0) {
                        this.MensajeToastComun('notification', 'warn', 'Advertencia', 'Debe ingresar una url'); return;
                    }
                    break;
                case 'A':
                    // if (this.nodoModuloSeleccionado.nodo.icono.length == 0) {
                    //     this.MensajeToastComun('notification', 'warn', 'Advertencia', `Debe ingresar el icono`); return;
                    // }
                    break;
                default:
                    this.MensajeToastComun('notification', 'warn', 'Advertencia', `Tipo de opción no válida: ${tipoCod}`); return;

            }

            this.nodoModuloSeleccionado.nodo.sobreEscribir = false;
            this.nodoModuloSeleccionado.esVisible = false;
        }
    }

    AgregarlstModulosDisponibles(): void {
        this.lstModulosDisponibles = [
            { key: 1, icon: 'pi pi-folder-plus', label: 'Módulo', tipoNodo: 'M', data: '', url: '', sobreEscribir: false, esEditable: true, codigoObj: '', icono: '', children: [] },
            { key: 2, icon: 'pi pi-file-plus', label: 'Formulario', tipoNodo: 'F', data: '', url: '', sobreEscribir: false, esEditable: true, codigoObj: '', icono: '', children: [] },
            { key: 3, icon: 'pi pi-objects-column', label: 'Acción', tipoNodo: 'A', data: '', url: '', sobreEscribir: false, esEditable: true, codigoObj: '', icono: '', children: [] }
        ]
    }


}
