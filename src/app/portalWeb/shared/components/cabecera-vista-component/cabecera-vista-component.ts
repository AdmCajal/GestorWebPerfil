import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { Table } from 'primeng/table';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HostListener } from '@angular/core';
import { ComponentesCompartidosModule } from '../../componentes-compartidos.module';
import { AccionesBusquedaComponente } from '../../../core/utils/acccionesBusquedaComponente';
import { SecurityService } from '../../../security/services/Security.service';

@Component({
    selector: 'app-cabecera-vista',
    standalone: true,
    imports: [CommonModule, ComponentesCompartidosModule],
    template: `
    <div class="flex flex-wrap justify-content-between">
        <h3>{{'' + breadcrumb}} </h3>

        <div class="flex flex-wrap gap-2">
            <p-button icon="pi pi-plus" label="Nuevo" raised (onClick)="btnNuevo()" />
            <p-button icon="pi pi-search" label="Buscar" severity="secondary" raised (onClick)="btnBuscar()" />
            <p-button icon="pi pi-download" label="Exportar" severity="contrast" raised (onClick)="btnExportar()" />
        </div>
    </div>
    <hr *ngIf="!this.componente.barraBusqueda" class="mb-2 mt-0">
    <p-progressbar mode="indeterminate" class="mb-2 mt-0" [style]="{ height: '1px' }" *ngIf="this.componente.bloquearComponente" />
    `
})
export class CabeceraVistaComponent implements OnInit {


    breadcrumb: string | undefined;

    @Input() componente!: AccionesBusquedaComponente;

    constructor(private _ActivatedRoute: ActivatedRoute,
        public _Router: Router,
        private _SecurityService: SecurityService

    ) { }

    ngOnInit(): void {
        this.breadcrumb = this._SecurityService.nombreComponente(this._ActivatedRoute.snapshot.data['idMenu']) || this._ActivatedRoute.snapshot.data['breadcrumb']  //this.activatedRoute.snapshot.data['breadcrumb'] || 'Nombre encontrado';
    }

    btnNuevo(): void {
        this.componente.btnMantenimientoFormulario('AGREGAR');
    }

    btnBuscar(): void {
        this.componente.btnBuscar();
    }

    btnExportar(): void {
        this.componente.btnExportar();
    }

}
