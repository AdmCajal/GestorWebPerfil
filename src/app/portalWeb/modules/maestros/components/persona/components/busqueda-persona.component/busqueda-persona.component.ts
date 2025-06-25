import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ComponentesCompartidosModule } from '../../../../../../shared/componentes-compartidos.module';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../services/persona.service';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { ResponseApi } from '../../../../../../core/models/response/response.model';
import { FormBuilder, } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MenuLayoutService } from '../../../../../../core/services/menu.layout.service';
import { LayoutService } from '../../../../../../../layout/service/layout.service';
import { MantenimientoSucursal } from '../mantenimiento-persona.component/mantenimiento-persona.component';
import { AccionesBusquedaComponente } from '../../../../../../core/utils/acccionesBusquedaComponente';
import { BaseComponenteBusqueda } from '../../../../../../core/utils/baseComponenteBusqueda';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';

@Component({
    selector: 'app-busqueda-persona',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule, MantenimientoSucursal],
    templateUrl: './busqueda-persona.component.html',
    styleUrls: ['./busqueda-persona.component.scss'],
})
export class BusquedaPersona extends BaseComponenteBusqueda implements OnInit, AccionesBusquedaComponente {
    @ViewChild(MantenimientoSucursal) _MantenimientoUsuario!: MantenimientoSucursal;

    lstEstados: ComboItem[] = [];
    constructor(
        private _PersonaService: PersonaService,
        private _fb: FormBuilder,
        override _MessageService: MessageService,
        private _MenuLayoutService: MenuLayoutService,
        override _LayoutService: LayoutService,
        public _Router: Router,

    ) { super(_MessageService, _LayoutService) }

    ngOnInit(): void {
        this.obtenerDatosSelect();
        this.estructuraForm();
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
    btnInactivar(registro: any): void {
        throw new Error('Method not implemented.');
    }
    btnExportar(): void {
        throw new Error('Method not implemented.');
    }
    btnMantenimientoFormulario(accion: 'AGREGAR' | 'EDITAR' | 'VER', registro?: any): void {
        this._MantenimientoUsuario.visualizarForm = true;
        this._MantenimientoUsuario.accion = accion;
        this._MantenimientoUsuario.mantenimientoForm.patchValue(registro);
        console.log(registro);
    }

    rptaMantenimiento(respuesta: any): void {
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
}
