import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../../../layout/component/app.floatingconfigurator';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { MiscelaneoService } from '../../Services/miscelaneo.service';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { HostListener } from '@angular/core';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { MantenimientoMiscelaneo } from '../mantenimiento-miscelaneo.component/mantenimiento-miscelaneo.component';
import { CabeceraVistaComponent } from '../../../../../../shared/components/cabecera-vista-component/cabecera-vista-component';
import { AccionesVistaComponente } from '../../../../../../core/utils/acccionesVistaComponente';

@Component({
    selector: 'app-busqueda-usuario',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule, MantenimientoMiscelaneo],
    templateUrl: './busqueda-miscelaneo.component.html',
    styleUrls: ['./busqueda-miscelaneo.component.scss'],
})
export class BusquedaMiscelaneo implements OnInit, AccionesVistaComponente {
    @ViewChild(MantenimientoMiscelaneo) _MantenimientoMiscelaneo!: MantenimientoMiscelaneo;


    bloquearComponente = false;
    barraBusqueda: boolean = false;

    breadcrumb: string | undefined;
    cntRegistros: number = 10;

    filtroForm: FormGroup;

    lstBusqueda: any[] = [{ miscelaneoCod: '1', descripcion: 'Descripcion', companiaCod: 1, companiaDesc: 'Compañia 1', tipoCod: 1, tipoDesc: 'Tipo 1', estado: 'A', estadoDesc: 'Activo' }];

    lstEstados: any[] = [];
    constructor(private activatedRoute: ActivatedRoute,
        private _UsuarioService: MiscelaneoService,
        private _fb: FormBuilder,
        private _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        private _LayoutService: LayoutService,
        public _Router: Router,

    ) { this.filtroForm = new FormGroup({}); }

    ngOnInit(): void {
        this.breadcrumb = this.activatedRoute.snapshot.data['breadcrumb'] || 'Nombre encontrado';
        this.validarTipoDispositivo();
        this.obtenerDatosSelect();
        this.estructuraForm();
        this.esconderMenu();
    }

    estructuraForm(): void {
        this.filtroForm = this._fb.group({
            usuario: [{ value: '', disabled: this.bloquearComponente }],
            nombres: [{ value: '', disabled: this.bloquearComponente }],
            estado: [{ value: '', disabled: this.bloquearComponente }],
            rangoFechaCreacion: [{ value: [new Date(), new Date()], disabled: this.bloquearComponente }],
        });
    }

    esconderMenu() {
        this._LayoutService.onMenuToggle();
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
        this.filtroForm.disable();

        this.lstBusqueda = [{ miscelaneoCod: '1', descripcion: 'Descripcion', companiaCod: 1, companiaDesc: 'Compañia 1', tipoCod: 1, tipoDesc: 'Tipo 1', estado: 'A', estadoDesc: 'Activo' }];

        // const { usuario, nombres, estado } = this.filtroForm.value;
        // const filtroFormato = { USUARIO: usuario, NOMBRECOMPLETO: nombres, ESTADO: estado };

        // this._UsuarioService.obtenerUsuarios(filtroFormato).pipe(
        //     tap((consultaRepsonse: ResponseApi) => {
        //         if (consultaRepsonse.success) {

        //             this.lstBusqueda = [...consultaRepsonse.data.map((d: any) => ({
        //                 nroDocumento: d.USUARIO,
        //                 tipoDocumento: d.TipoDocumento,
        //                 nombres: d.NOMBRECOMPLETO,
        //                 perfil: d.PERFIL,
        //                 estado: d.ESTADO,
        //                 estadoDesc: d.DesEstado,
        //                 correoElectronico: d.CorreoElectronico,
        //                 persona: d.PERSONA,
        //                 tipoUsuario: d.TipoUsuario,
        //                 expirarContrasenia: d.ExpirarPasswordFlag,
        //                 fechaExpiracion: d.FechaExpiracion,
        //             }))];

        //             this.MensajeToastComun('notification', 'success', 'Correcto', consultaRepsonse.mensaje);
        //             return;
        //         } else {
        //             this.MensajeToastComun('notification', 'warn', 'Advertencia', consultaRepsonse.mensaje);
        //         }
        //     }), catchError((error) => {
        //         this.MensajeToastComun('notification', 'error', 'Error', 'Se generó un error. Pongase en contacto con los administradores.');
        //         console.error(`Error al buscar. ${error}`);
        //         return of(null);
        //     }),
        //     finalize(() => {
        //         this.bloquearComponente = false;
        //         this.filtroForm.enable();
        //     })
        // ).subscribe();
        this.bloquearComponente = false;
        this.filtroForm.enable();
    }

    btnMantenimientoFormulario(accion: 'AGREGAR' | 'EDITAR' | 'VER', registro?: any): void {
        this._MantenimientoMiscelaneo.visualizarForm = true;
        this._MantenimientoMiscelaneo.accion = accion;
        this._MantenimientoMiscelaneo.mantenimientoForm.patchValue(registro);
        console.log(registro);
    }

    btnExportar(): void {
        throw new Error('Method not implemented.');
    }
    onGlobalFilter(table: Table, event: Event): void {
        this.bloquearComponente = true;
        this.filtroForm.disable();

        setTimeout(() => {
            table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
            this.bloquearComponente = false;
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

    @HostListener('document:keydown.enter', ['$event'])
    handleEnter(event: KeyboardEvent) {
        this.btnBuscar();
    }

    rptaMantenimiento(respuesta: any) {
        this.bloquearComponente = respuesta.bloquearComponente;
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

    obtenerColorEstado(estado: string): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
        switch (estado) {
            case "1":
            case "A":
                return "success";
            case "0":
            case "I":
                return "danger";
            default:
                return "info";
        }
    }


    obtenerIconoEstado(estado: string): string {
        switch (estado) {
            case "1":
            case "A":
                return "pi-check";
            case "0":
            case "I":
                return "pi-times";
        }
        return "pi-info-circle"
    }

}
