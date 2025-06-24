import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComponentesCompartidosModule } from '../../componentes-compartidos.module';
import { AcccionesMantenimientoComponente } from '../../../core/utils/acccionesMantenimientoComponente';

@Component({
    selector: 'app-log-modificaciones',
    standalone: true,
    imports: [CommonModule, ComponentesCompartidosModule],
    template: `
    <div class="flex flex-wrap justify-content-between">
    <p-fieldset [styleClass]="'font-bold'" legend="Log de modificaciones" *ngIf="componente.visualizarLogMoficaciones">
        <div class="flex flex-column">
            <div class="flex">
                <p-avatar label="P" styleClass="mr-2" size="large" shape="circle" />
                <div class="w-11 ml-1">
                    <div class="text-400">Nota de <strong class="text-blue-700">Administrator</strong> - hace 4 días
                    </div>
                    <div class="font-medium"><strong class="font-bold">Se agregó un nuevo misceláneo:</strong>
                        Sucursal - SEG - Clínica el golf <strong class="font-bold">Fecha y hora:</strong> 2025-04-07
                        12:34:04</div>
                </div>
            </div>
            <p-divider align="center" type="dotted">
                <b>28 de enero de 2025</b>
            </p-divider>
        </div>
    </p-fieldset>
    </div>
    `
})
export class LogModificacionesComponent implements OnInit {
    @Input() componente!: AcccionesMantenimientoComponente;

    constructor(private _ActivatedRoute: ActivatedRoute,
        public _Router: Router,

    ) { }

    ngOnInit(): void {
    }


}
