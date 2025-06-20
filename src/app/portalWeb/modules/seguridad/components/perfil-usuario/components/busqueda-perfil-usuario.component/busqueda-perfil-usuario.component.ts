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
import { MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { HostListener } from '@angular/core';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { MantenimientoPerfilUsuario } from '../mantenimiento-perfil-usuario.component/mantenimiento-perfil-usuario.component';
import { AccionesVistaComponente } from '../../../../../../core/utils/acccionesVistaComponente';
import { ACCION_FORMULARIO } from '../../../../../../core/constants/acciones-formulario';
import { ACCION_MANTENIMIENTO } from '../../../../../../core/constants/acciones-mantenimiento';
import { PerfilUsuarioService } from '../../services/perfil-usuario.service';
import { SecurityService } from '../../../../../../security/services/Security.service';

@Component({
    selector: 'app-busqueda-perfil-usuario',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule, MantenimientoPerfilUsuario],
    templateUrl: './busqueda-perfil-usuario.component.html',
    styleUrls: ['./busqueda-perfil-usuario.component.scss'],
})
export class BusquedaPerfilUsuario implements OnInit, AccionesVistaComponente {
    @ViewChild(MantenimientoPerfilUsuario) _MantenimientoUsuario!: MantenimientoPerfilUsuario;


    bloquearComponente = false;
    barraBusqueda = false;

    breadcrumb: string | undefined;
    cntRegistros: number = 10;

    filtroForm: FormGroup;

    lstBusqueda: any[] = [];

    lstEstados: any[] = [];
    constructor(private activatedRoute: ActivatedRoute,
        private _PerfilUsuarioService: PerfilUsuarioService,
        private _fb: FormBuilder,
        private _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        private _LayoutService: LayoutService,
        public _Router: Router,
        private route: ActivatedRoute,


    ) { this.filtroForm = new FormGroup({}); }



    ngOnInit(): void {
        this.validarTipoDispositivo();
        this.obtenerDatosSelect();
        this.estructuraForm();
        this.esconderMenu();
    }

    estructuraForm(): void {
        this.filtroForm = this._fb.group({
            USUARIO: [{ value: '', disabled: this.bloquearComponente }],
            NOMBRECOMPLETO: [{ value: '', disabled: this.bloquearComponente }],
            ESTADO: [{ value: '', disabled: this.bloquearComponente }],
            rangoFechaCreacion: [{ value: [new Date(), new Date()], disabled: this.bloquearComponente }],
        });
    }

    esconderMenu() {
        this._LayoutService.onMenuToggle();
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

        this.lstBusqueda = [];
        this._PerfilUsuarioService.obtenerUsuarios(this.filtroForm.value).pipe(
            tap((consultaRepsonse: ResponseApi) => {
                if (consultaRepsonse.success) {

                    this.lstBusqueda = [...consultaRepsonse.data];

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

    btnInactivar(registro: any): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.filtroForm.disable();

        let valorAccionServicio: number = ACCION_MANTENIMIENTO.ESTADO
        registro.SedEstado = 2;
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

    btnMantenimientoFormulario(accion: 'AGREGAR' | 'EDITAR' | 'VER', registro?: any): void {
        this._MantenimientoUsuario.visualizarForm = true;
        this._MantenimientoUsuario.accion = accion;
        this._MantenimientoUsuario.bloquearComponente = accion == ACCION_FORMULARIO.VER ? true : false;
        this._MantenimientoUsuario.estructuraForm();
        this._MantenimientoUsuario.mantenimientoForm.patchValue(registro);
    }

    btnExportar(): void {
        throw new Error('Method not implemented.');
    }

    onGlobalFilter(table: Table, event: Event): void {
        this.bloquearComponente = true;
        this.barraBusqueda = true;
        this.filtroForm.disable();

        setTimeout(() => {
            table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
            this.bloquearComponente = false;
            this.barraBusqueda = false;
            this.filtroForm.enable();
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

    rptaMantenimiento(respuesta: any) {

        console.log(respuesta)
        if (respuesta.buscar) { this.btnBuscar(); }

        if (respuesta.accion) {
            switch (respuesta.accion) {
                case 'AGREGAR':
                    break;
                case 'EDITAR':
                    break;
                default:
                    break;
            }
        }
    }

    obtenerColorEstado(estado: string | number): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
        switch (estado) {
            case 1:
            case "1":
            case "A":
                return "success";
            case "0":
            case 2:
            case "I":
                return "danger";
            default:
                return "info";
        }
    }


    obtenerIconoEstado(estado: string | number): string {
        switch (estado) {
            case "1":
            case 1:
            case "A":
                return "pi-check";
            case "0":
            case 0:
            case 2:
            case "I":
                return "pi-times";
        }
        return "pi-info-circle"
    }

}
