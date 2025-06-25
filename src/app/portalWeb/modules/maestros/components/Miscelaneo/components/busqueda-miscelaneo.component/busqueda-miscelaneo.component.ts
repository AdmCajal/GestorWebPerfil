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
import { AccionesBusquedaComponente } from '../../../../../../core/utils/acccionesBusquedaComponente';
import { BaseComponenteBusqueda } from '../../../../../../core/utils/baseComponenteBusqueda';
import { ComboItem } from '../../../../../../core/models/interfaces/comboItem';

@Component({
    selector: 'app-busqueda-usuario',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule, MantenimientoMiscelaneo],
    templateUrl: './busqueda-miscelaneo.component.html',
    styleUrls: ['./busqueda-miscelaneo.component.scss'],
})
export class BusquedaMiscelaneo extends BaseComponenteBusqueda implements OnInit, AccionesBusquedaComponente {
    @ViewChild(MantenimientoMiscelaneo) _MantenimientoMiscelaneo!: MantenimientoMiscelaneo;

    lstEstados: ComboItem[] = [];
    constructor(private _ActivatedRoute: ActivatedRoute,
        private _MiscelaneoService: MiscelaneoService,
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
            usuario: [{ value: '', disabled: this.bloquearComponente }],
            nombres: [{ value: '', disabled: this.bloquearComponente }],
            estado: [{ value: '', disabled: this.bloquearComponente }],
            rangoFechaCreacion: [{ value: [new Date(), new Date()], disabled: this.bloquearComponente }],
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
        this.filtroForm.disable();

        this.lstBusqueda = [{ miscelaneoCod: '1', descripcion: 'Descripcion', companiaCod: 1, companiaDesc: 'Compañia 1', tipoCod: 1, tipoDesc: 'Tipo 1', estado: 'A', estadoDesc: 'Activo' }];
        this.bloquearComponente = false;
        this.filtroForm.enable();
    }
    btnInactivar(registro: any): void {
        throw new Error('Method not implemented.');
    }
    btnExportar(): void {
        throw new Error('Method not implemented.');
    }
    btnMantenimientoFormulario(accion: 'AGREGAR' | 'EDITAR' | 'VER', registro?: any): void {
        this._MantenimientoMiscelaneo.visualizarForm = true;
        this._MantenimientoMiscelaneo.accion = accion;
        this._MantenimientoMiscelaneo.mantenimientoForm.patchValue(registro);
        console.log(registro);
    }

    rptaMantenimiento(respuesta: any): void {
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
}
