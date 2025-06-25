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

    estructuraForm(): void {
        this.mantenimientoForm = this._fb.group({
            nombreAplicativo: [{ value: '', disabled: this.bloquearComponente }],
            descripcion: [{ value: '', disabled: this.bloquearComponente }],
            baseDatos: [{ value: '', disabled: this.bloquearComponente }],
            estado: [{ value: '', disabled: this.bloquearComponente }]

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
        const nodoAnterior: ModuloAplicativo = evento?.dropNode;

        if (nodoIngreso) {
            const tipoIngreso = nodoIngreso.tipoNodo;
            const tipoDestino = nodoAnterior.tipoNodo;
            this.nodoModuloSeleccionado.esVisible = true;
            this.nodoModuloSeleccionado.tipo = `${nodoIngreso.tipoNodo == 'M' ? 'módulo' :
                nodoIngreso.tipoNodo == 'F' ? 'formulario' : 'acción'}`;
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
            if (this.nodoModuloSeleccionado.nodo.icono.length == 0) {
                this.MensajeToastComun('notification', 'warn', 'Advertencia', `Debe ingresar el icono`); return;
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
