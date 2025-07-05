import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../services/persona.service';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder, Validators, } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { MantenimientoSucursal } from '../mantenimiento-persona.component/mantenimiento-persona.component';
import { AccionesBusquedaComponente } from '../../../../../../core/utils/acccionesBusquedaComponente';
import { BaseComponenteBusqueda } from '../../../../../../core/utils/baseComponenteBusqueda';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { ESTADO_REGISTRO } from '../../../../../../core/constants/estados-registro';
import { AccionFormulario } from '../../../../../../core/enums/accionFormulario.enum';

@Component({
    selector: 'app-busqueda-persona',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule, MantenimientoSucursal],
    templateUrl: './busqueda-persona.component.html',
    styleUrls: ['./busqueda-persona.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class BusquedaPersona extends BaseComponenteBusqueda implements OnInit, AccionesBusquedaComponente {
    @ViewChild(MantenimientoSucursal) _Mantenimiento!: MantenimientoSucursal;

    lstEstados: ComboItem[] = [];
    lstTipoPersonas: ComboItem[] = [];
    lstTipoDocumentos: ComboItem[] = [];
    constructor(
        private _PersonaService: PersonaService,
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
            TipoPersona: [{ value: '', disabled: this.bloquearComponente }, [Validators.required]],
            TipoDocumento: [{ value: '', disabled: this.bloquearComponente }, [Validators.required]],
            Documento: [{ value: '', disabled: this.bloquearComponente }],
            NombreCompleto: [{ value: '', disabled: this.bloquearComponente }],
            Estado: [{ value: this.optTodos.codigo, disabled: this.bloquearComponente }],
            rangoFechaCreacion: [{ value: [new Date(), new Date()], disabled: this.bloquearComponente }],
        });
        this.lstColBusqueda = [
            'Nombres',
            'Tipo De Documento',
            'Documento',
            'Teléfono',
            'Correo Electrónico',
            'Tipo Persona',
            'Estado',
        ]
    }
    obtenerDatosSelect(): void {
        forkJoin({
            tipoPersonas: this._MenuLayoutService.obtenerDataMaestro('TIPOPERSONA'),
            tipoDocumentos: this._MenuLayoutService.obtenerDataMaestro('TIPODOCIDENTID'),
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTLETRAS'),
        }).subscribe(resp => {
            this.lstTipoPersonas = [...resp.tipoPersonas];
            this.lstTipoDocumentos = [...resp.tipoDocumentos];
            this.lstEstados = [this.optTodos, ...resp.estados];
        });
    }

    btnBuscar(): void {
        this.bloquearComponente = true;
        this.filtroForm.disable();

        this.lstDataBusqueda = [];
        const { tipoPersona, tipoDocumento, documento, nombre, estado } = this.filtroForm.value;
        const filtroFormato = { TipoPersona: 'N', TipoDocumento: 'D', Documento: '40859200', NombreCompleto: nombre, Estado: 'A' };

        this._PersonaService.obtener(this.filtroForm.value).pipe(
            tap((consultaRepsonse: ResponseApi) => {
                if (consultaRepsonse.success) {
                    this.lstDataBusqueda = [...consultaRepsonse.data];

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
                this.filtroForm.enable();
            })
        ).subscribe();
    }
    override inactivarRegistro(registro: any): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.filtroForm.disable();

        let valorAccionServicio: number = ACCION_MANTENIMIENTO.ESTADO
        registro.Estado = registro.Estado == ESTADO_REGISTRO.ACTIVO_STRI ? ESTADO_REGISTRO.INACTIVO_STR : ESTADO_REGISTRO.ACTIVO_STRI;

        this._PersonaService.mantenimiento(valorAccionServicio, registro).pipe(
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
        if (this.exportarExcel(this.lstColBusqueda, this.lstDataBusqueda, ''))
            this.MensajeToastComun('notification', 'success', 'Correcto', 'Se exportó con exito la data');
    }
    btnMantenimientoFormulario(accion: AccionFormulario, registro?: any): void {
        this._Mantenimiento.IniciarMantenimientoFormulario(accion, registro);

    }

    rptaMantenimiento(respuesta: any): void {
        this.bloquearComponente = respuesta.bloquearComponente;
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
