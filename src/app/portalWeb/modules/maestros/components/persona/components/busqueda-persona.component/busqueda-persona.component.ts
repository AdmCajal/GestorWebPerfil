import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../../../../layout/component/app.floatingconfigurator';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { PersonaService } from '../../services/persona.service';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { HostListener } from '@angular/core';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { MantenimientoSucursal } from '../mantenimiento-persona.component/mantenimiento-persona.component';
import { AccionesBusquedaComponente } from '../../../../../../core/utils/acccionesBusquedaComponente';

@Component({
    selector: 'app-busqueda-persona',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule, MantenimientoSucursal],
    templateUrl: './busqueda-persona.component.html',
    styleUrls: ['./busqueda-persona.component.scss'],
})
export class BusquedaPersona implements OnInit, AccionesBusquedaComponente {
    @ViewChild(MantenimientoSucursal) _MantenimientoUsuario!: MantenimientoSucursal;


    bloquearComponente = false;
    barraBusqueda = false;

    breadcrumb: string | undefined;
    cntRegistros: number = 10;

    filtroForm: FormGroup;

    lstBusqueda: any[] = [];

    lstEstados: any[] = [];
    constructor(private _ActivatedRoute: ActivatedRoute,
        private _PersonaService: PersonaService,
        private _fb: FormBuilder,
        private _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        private _LayoutService: LayoutService,
        public _Router: Router,

    ) { this.filtroForm = new FormGroup({}); }




    ngOnInit(): void {
        this.breadcrumb = this._ActivatedRoute.snapshot.data['breadcrumb'] || 'Nombre encontrado';
        this.validarTipoDispositivo();
        this.obtenerDatosSelect();
        this.estructuraForm();
        this.esconderMenu();
    }

    estructuraForm(): void {
        this.filtroForm = this._fb.group({
            tipoPersona: [{ value: '', disabled: this.bloquearComponente }],
            tipoDocumento: [{ value: '', disabled: this.bloquearComponente }],
            documento: [{ value: '', disabled: this.bloquearComponente }],
            nombre: [{ value: '', disabled: this.bloquearComponente }],
            estado: [{ value: '', disabled: this.bloquearComponente }],
            rangoFechaCreacion: [{ value: [new Date(), new Date()], disabled: this.bloquearComponente }],
        });
    }

    esconderMenu(): void {
        this._LayoutService.onMenuToggle();
    }

    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTGEN')
        }).subscribe(resp => {
            this.lstEstados = [...resp.estados];
        });
    }

    btnBuscar(): void {
        this.bloquearComponente = true;
        this.filtroForm.disable();

        this.lstBusqueda = [];
        const { tipoPersona, tipoDocumento, documento, nombre, estado } = this.filtroForm.value;
        const filtroFormato = { TipoPersona: 'N', TipoDocumento: 'D', Documento: '40859200', NombreCompleto: nombre, Estado: 'A' };

        this._PersonaService.obtener(filtroFormato).pipe(
            tap((consultaRepsonse: ResponseApi) => {
                if (consultaRepsonse.success) {

                    console.log(consultaRepsonse.data)
                    this.lstBusqueda = [...consultaRepsonse.data.map((d: any) => ({
                        codigo: d.USUARIO,
                        nombre: d.NOMBRECOMPLETO,
                        compania: d.PERFIL,
                        direccion: d.ESTADO,
                        telefono: d.DesEstado,
                        estado: d.ESTADO,
                        estadoDesc: d.DesEstado,
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
                this.filtroForm.enable();
            })
        ).subscribe();
    }

    btnMantenimientoFormulario(accion: 'AGREGAR' | 'EDITAR' | 'VER', registro?: any): void {
        this._MantenimientoUsuario.visualizarForm = true;
        this._MantenimientoUsuario.accion = accion;
        this._MantenimientoUsuario.mantenimientoForm.patchValue(registro);
        console.log(registro);
    }
    
    btnInactivar(registro: any): void {
        throw new Error('Method not implemented.');
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

    // @HostListener('document:keydown.enter', ['$event'])
    // handleEnter(event: KeyboardEvent) {
    //     this.btnBuscar();
    // }

    rptaMantenimiento(respuesta: any) {
        this.bloquearComponente = respuesta.bloquearComponente;
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
