import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../../../layout/component/app.floatingconfigurator';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { MiscelaneoService } from '../miscelaneo.service';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { HostListener } from '@angular/core';
import { LayoutService } from '../../../../../../../layout/service/layout.service';

@Component({
    selector: 'app-mantenimiento-usuario',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-miscelaneo.component.html',
    styleUrls: ['./mantenimiento-miscelaneo.component.scss'],
})
export class MantenimientoMiscelaneo implements OnInit {
    @Output() msjMantenimiento = new EventEmitter<any>(); //BehaviorSubject
    bloquearComponente = false;

    breadcrumb: string | undefined;
    accion: string | undefined;
    cntRegistros: number = 10;

    mantenimientoForm: FormGroup;

    lstBusqueda: any[] = [];
    lstEstados: any[] = [];
    lstPerfiles: any[] = [];

    visualizarForm: boolean = false;
    visualizarLogMoficaciones: boolean = false;
    position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'top';

    constructor(private activatedRoute: ActivatedRoute,
        private _UsuarioService: MiscelaneoService,
        private _fb: FormBuilder,
        private _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        private _LayoutService: LayoutService,

    ) { this.mantenimientoForm = new FormGroup({}); }

    ngOnInit(): void {
        this.breadcrumb = this.activatedRoute.snapshot.data['breadcrumb'] || 'Nombre no encontrado';
        this.validarTipoDispositivo();
        this.obtenerDatosSelect();
        this.estructuraForm();
        this.esconderMenu();
    }

    estructuraForm(): void {
        this.mantenimientoForm = this._fb.group({
            nroDocumento: [{ value: '', disabled: this.bloquearComponente }],
            nombres: [{ value: '', disabled: this.bloquearComponente }],
            perfil: [{ value: '', disabled: this.bloquearComponente }],
            tipoUsuario: [{ value: '', disabled: this.bloquearComponente }],
            correoElectronico: [{ value: '', disabled: this.bloquearComponente }],
            contrasenia: [{ value: '', disabled: this.bloquearComponente }],
            contraseniaConfirmacion: [{ value: '', disabled: this.bloquearComponente }],
            expirarContrasenia: [{ value: '', disabled: this.bloquearComponente }],
            fechaExpiracion: [{ value: new Date(), disabled: this.bloquearComponente }],

        });
    }

    esconderMenu() {
        this._LayoutService.onMenuToggle();
    }

    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTGEN'),
            perfiles: this._UsuarioService.obtenerPerfiles({ ESTADO: 'A' })
        }).subscribe(resp => {
            this.lstEstados = [...resp.estados];

            const dataPerfiles: any[] = resp.perfiles.map((m: any) => ({ codigo: m.Codigo, descripcion: m.Descripcion }));
            this.lstPerfiles = [...dataPerfiles];
        });
    }

    btnAccionForm(): void {
        this.bloquearComponente = true;
        this.mantenimientoForm.disable();

        this.lstBusqueda = [];
        const { usuario, nombres, estado } = this.mantenimientoForm.value;
        const filtroFormato = { USUARIO: usuario, NOMBRECOMPLETO: nombres, ESTADO: estado };

        this._UsuarioService.obtenerUsuarios(filtroFormato).pipe(
            tap((consultaRepsonse: ResponseApi) => {
                if (consultaRepsonse.success) {

                    this.lstBusqueda = [...consultaRepsonse.data.map((d: any) => ({
                        nroDocumento: d.USUARIO,
                        codigoTipoDocumento: d.TipoDocumento,
                        nombres: d.NOMBRECOMPLETO,
                        codigoEstado: d.ESTADO,
                        estadoNombre: d.DesEstado,
                        correoElectronico: d.CorreoElectronico,
                        codigoPersona: d.PERSONA,
                    }))];

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
                this.mantenimientoForm.enable();
            })
        ).subscribe();
    }

    btnLimpiarFiltros(): void {
        this.estructuraForm();
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

    @HostListener('document:keydown.enter', ['$event'])
    handleEnter(event: KeyboardEvent) {
        this.btnAccionForm();
    }

    btnLogAuditoria(): void {
        this.visualizarLogMoficaciones = this.visualizarLogMoficaciones == true ? false : true;
    }
}
