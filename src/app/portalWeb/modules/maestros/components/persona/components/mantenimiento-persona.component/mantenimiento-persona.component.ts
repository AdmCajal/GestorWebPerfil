import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterModule } from '@angular/router';
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
import { LogModificacionesComponent } from '../../../../../../shared/components/log-modificaciones-component/log-modificaciones-component';
import { AcccionesMantenimientoComponente } from '../../../../../../core/utils/acccionesMantenimientoComponente';
import { PersonaService } from '../../services/persona.service';

@Component({
    selector: 'app-mantenimiento-persona',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule, RippleModule, ButtonModule, ComponentesCompartidosModule],
    templateUrl: './mantenimiento-persona.component.html',
    styleUrls: ['./mantenimiento-persona.component.scss'],
})
export class MantenimientoSucursal implements OnInit, AcccionesMantenimientoComponente {
    @Output() msjMantenimiento = new EventEmitter<any>(); //BehaviorSubject
    bloquearComponente = false;

    breadcrumb: string | undefined;
    accion: 'AGREGAR' | 'EDITAR' | 'VER' | undefined;
    cntRegistros: number = 10;

    mantenimientoForm: FormGroup;

    lstBusqueda: any[] = [];
    lstEstados: any[] = [];
    lstPerfiles: any[] = [];

    visualizarForm: boolean = false;
    visualizarLogMoficaciones: boolean = false;
    position: 'left' | 'right' | 'top' | 'bottom' | 'center' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright' = 'top';

    constructor(private activatedRoute: ActivatedRoute,
        private _PersonaService: PersonaService,
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
            codigo: [{ value: '', disabled: this.bloquearComponente }],
            nombre: [{ value: '', disabled: this.bloquearComponente }],
            telefono: [{ value: '', disabled: this.bloquearComponente }],
            direccion: [{ value: '', disabled: this.bloquearComponente }],
            compania: [{ value: '', disabled: this.bloquearComponente }],
            estado: [{ value: '', disabled: this.bloquearComponente }],

        });
    }

    esconderMenu() {
        this._LayoutService.onMenuToggle();
    }

    obtenerDatosSelect(): void {
        forkJoin({
            estados: this._MenuLayoutService.obtenerDataMaestro('ESTGEN'),
            perfiles: this._PersonaService.obtenerPerfiles({ ESTADO: 'A' })
        }).subscribe(resp => {
            this.lstEstados = [...resp.estados];

            const dataPerfiles: any[] = resp.perfiles.map((m: any) => ({ codigo: m.Codigo, descripcion: m.Descripcion }));
            this.lstPerfiles = [...dataPerfiles];
        });
    }

    btnAccionForm(): void {
        this.bloquearComponente = true;
        this.mantenimientoForm.disable();

        // this.bloquearComponente = false;
        // this.mantenimientoForm.enable();
        this.msjMantenimiento.emit({ accion: this.accion, buscar: true });

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

    // @HostListener('document:keydown.enter', ['$event'])
    // handleEnter(event: KeyboardEvent) {
    //     this.btnAccionForm();
    // }

    btnLogAuditoria(): void {
        this.visualizarLogMoficaciones = this.visualizarLogMoficaciones == true ? false : true;
    }

}
