import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../../../layout/component/app.floatingconfigurator';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { UsuarioService } from '../usuario.service';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';

@Component({
    selector: 'app-access',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './busqueda-usuario.component.html',
    styleUrls: ['./busqueda-usuario.component.scss'],
})
export class BusquedaUsuario implements OnInit {
    bloquearComponente = false;

    breadcrumb: string | undefined;
    cntRegistros: number = 10;

    filtroForm: FormGroup;

    lstBusqueda: any[] = [];

    lstEstados: any[] = [];
    constructor(private activatedRoute: ActivatedRoute,
        private _UsuarioService: UsuarioService,
        private _fb: FormBuilder,
        private _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService
    ) { this.filtroForm = new FormGroup({}); }

    ngOnInit(): void {
        this.breadcrumb = this.activatedRoute.snapshot.data['breadcrumb'] || 'Nombre encontrado';
        this.validarTipoDispositivo();
        this.obtenerDatosSelect();
        this.estructuraForm();
    }

    estructuraForm(): void {
        this.filtroForm = this._fb.group({
            usuario: [{ value: '', disabled: this.bloquearComponente }],
            nombres: [{ value: '', disabled: this.bloquearComponente }],
            estado: [{ value: '', disabled: this.bloquearComponente }],
        });
    }

    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTGEN')
        }).subscribe(resp => {
            this.lstEstados = [...resp.estados];
            console.log(this.lstEstados)
        });
    }

    btnBuscar(): void {
        this.bloquearComponente = true;
        this.lstBusqueda = [];
        const { usuario, nombres, estado } = this.filtroForm.value;
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
            })
        ).subscribe();
    }

    btnLimpiarFiltros(): void {
        this.estructuraForm();
    }

    onGlobalFilter(table: Table, event: Event): void {
        this.bloquearComponente = true;
        setTimeout(() => {
            table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
            this.bloquearComponente = false;
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
}
