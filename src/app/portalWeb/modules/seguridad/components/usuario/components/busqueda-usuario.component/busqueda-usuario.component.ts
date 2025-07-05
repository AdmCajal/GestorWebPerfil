import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { AccionesBusquedaComponente } from '../../../../../../core/utils/acccionesBusquedaComponente';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { BaseComponenteBusqueda } from '../../../../../../core/utils/baseComponenteBusqueda';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';
import { AccionFormulario } from '../../../../../../core/enums/accionFormulario.enum';
import { UsuarioMantenimientoService } from '../../services/usuario-mantenimiento.service';

@Component({
    selector: 'app-busqueda-usuario',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './busqueda-usuario.component.html',
    styleUrls: ['./busqueda-usuario.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class BusquedaUsuario extends BaseComponenteBusqueda implements OnInit, AccionesBusquedaComponente {


    lstEstados: ComboItem[] = [];
    constructor(private _ActivatedRoute: ActivatedRoute,
        private _UsuarioService: UsuarioService,
        private _UsuarioMantenimientoService: UsuarioMantenimientoService,
        private _fb: FormBuilder,
        override _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        override _LayoutService: LayoutService,
        public _Router: Router,
        override _ConfirmationService: ConfirmationService
    ) { super(_MessageService, _LayoutService, _ConfirmationService) }

    ngOnInit(): void {
        this.obtenerDatosSelect();
        this.estructuraForm();
    }

    estructuraForm(): void {
        this.filtroForm = this._fb.group({
            USUARIO: [{ value: '', disabled: this.bloquearComponente }],
            NOMBRECOMPLETO: [{ value: '', disabled: this.bloquearComponente }],
            ESTADO: [{ value: '', disabled: this.bloquearComponente }],
            rangoFechaCreacion: [{ value: [new Date(), new Date()], disabled: this.bloquearComponente }],
        });
    }
    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTLETRAS'),
        }).subscribe(resp => {
            this.lstEstados = [...resp.estados];
        });
    }

    btnBuscar(): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.filtroForm.disable();

        this.lstDataBusqueda = [];
        this._UsuarioService.obtenerUsuarios(this.filtroForm.value).pipe(
            tap((consultaRepsonse: ResponseApi) => {
                if (consultaRepsonse.success) {

                    this.lstDataBusqueda = [...consultaRepsonse.data.map((m: any) => { return { ...m, empleadoBusqueda: { visible: m.USUARIO }, Clave: '' } })];

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
        this._UsuarioService.mantenimiento(valorAccionServicio, registro).pipe(
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

    btnMantenimientoFormulario(accion: AccionFormulario, registro?: any): void {
        this._Router.navigate([accion], { relativeTo: this._ActivatedRoute });

        switch (accion) {
            case AccionFormulario.EDITAR:
            case AccionFormulario.VER:
                this._UsuarioMantenimientoService.setUsuario(registro);
                break;
        }
    }

    rptaMantenimiento(respuesta: any): void {

        console.log(respuesta)
        if (respuesta.buscar) { this.btnBuscar(); }

        if (respuesta.accion) {
            switch (respuesta.accion) {
                case AccionFormulario.AGREGAR:
                    break;
                case AccionFormulario.EDITAR:
                    break;
                default:
                    break;
            }
        }
    }
}
