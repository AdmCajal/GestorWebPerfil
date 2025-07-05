import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../../../layout/component/app.floatingconfigurator';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { HostListener } from '@angular/core';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { MantenimientoPerfilUsuario } from '../mantenimiento-perfil-usuario.component/mantenimiento-perfil-usuario.component';
import { AccionesBusquedaComponente } from '../../../../../../core/utils/acccionesBusquedaComponente';
import { AccionFormulario } from '../../../../../../core/enums/accionFormulario.enum';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { PerfilUsuarioService } from '../../services/perfil-usuario.service';
import { SecurityService } from '../../../../../../security/services/Security.service';
import { BaseComponenteBusqueda } from '../../../../../../core/utils/baseComponenteBusqueda';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';
import { CompaniaService } from '../../../compania/services/compania.service';
import { SucursalService } from '../../../../../maestros/components/sucursal/services/sucursal.service';

@Component({
    selector: 'app-busqueda-perfil-usuario',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule, MantenimientoPerfilUsuario],
    templateUrl: './busqueda-perfil-usuario.component.html',
    styleUrls: ['./busqueda-perfil-usuario.component.scss'],
    providers: [ConfirmationService, MessageService]
})
export class BusquedaPerfilUsuario extends BaseComponenteBusqueda implements OnInit, AccionesBusquedaComponente {
    @ViewChild(MantenimientoPerfilUsuario) _Mantenimiento!: MantenimientoPerfilUsuario;

    lstEstados: ComboItem[] = [];
    lstCompanias: ComboItem[] = [];
    lstSucursales: ComboItem[] = [];
    lstGerencias: ComboItem[] = [];
    lstCentroCostos: ComboItem[] = [];
    constructor(
        private _PerfilUsuarioService: PerfilUsuarioService,
        private _CompaniaService: CompaniaService,
        private _SucursalService: SucursalService,
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
            Perfil: [{ value: '', disabled: this.bloquearComponente }],
            CompaniaCodigo: [{ value: this.optTodos.codigo, disabled: this.bloquearComponente }],
            Sucursal: [{ value: this.optTodos.codigo, disabled: this.bloquearComponente }],
            CostCenter: [{ value: this.optTodos.codigo, disabled: this.bloquearComponente }]
        });
    }
    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTLETRAS'),
            companias: this._CompaniaService.obtener({})
        }).subscribe(resp => {
            this.lstEstados = [this.optTodos, ...resp.estados];

            const dataCompanias: any[] = resp.companias?.data?.map((m: any) => ({ codigo: m.Persona, descripcion: m.DescripcionCorta.trim() }));
            this.lstCompanias = [this.optTodos, ...dataCompanias || []];
        });
    }

    btnBuscar(): void {
        // this.bloquearComponente = true;
        // this.barraBusqueda = true;
        // this.filtroForm.disable();

        this.lstDataBusqueda = [];
        this._PerfilUsuarioService.obtener({}).pipe(
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
                this.barraBusqueda = false;
                this.filtroForm.enable();
            })
        ).subscribe();


        // this.lstDataBusqueda = [
        //     {
        //         perfil: 'Perfil 1',
        //         sucursalNom: 'sucursal 1',
        //         sucursalNom: 'sucursal 1',
        //         GerenciaNom: 'Gerencia 1',
        //         CentroCostoNom: 'Centro de costo 1',
        //         estado: 'A',
        //         estadoDesc: 'Activo',
        //     }
        // ]
    }
    override inactivarRegistro(registro: any): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.filtroForm.disable();

        let valorAccionServicio: number = ACCION_MANTENIMIENTO.ELIMINAR
        this._PerfilUsuarioService.mantenimiento(valorAccionServicio, registro).pipe(
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
        this._Mantenimiento.IniciarMantenimientoFormulario(accion, registro);
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

    btnObtenerSucursal(evento: any): void {
        this.lstSucursales = [];
        this.lstGerencias = [];
        this.lstCentroCostos = [];

        forkJoin({
            sucursales: this._SucursalService.obtener({ IdEmpresa: evento.value }),
        }).subscribe(resp => {
            const data = resp.sucursales?.data?.map((ele: any) => ({
                descripcion: ele.SedDescripcion?.trim()?.toUpperCase() || "", codigo: ele.SedCodigo
            }));
            this.lstSucursales = [this.optTodos, ...data];
        });
    }
}
