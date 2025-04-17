import { Component, ElementRef, Renderer2 } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { ConfigService } from '../../portalWeb/security/services/config.service';
import { ComponentesCompartidosModule } from '../../portalWeb/shared/componentes-compartidos.module';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, ComponentesCompartidosModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <img [src]="this.imagenesConfig.logo" alt="logo" class="resaltar-bordes"  [style]="{'height': imagenesConfig.sizeImg+'rem'}" class="mr-2">
                <span class="font-bold text-lg">{{'SANNA - GOLF LOS INCAS' |uppercase}}</span>
        </div>

        

        <div class="layout-topbar-actions">
           
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content justify-align-center">
                <span class="text-xl align-content-center">  {{'Geampier A. Santamaría de la Cruz' | titlecase }}</span>
                <p-avatar image="{{usuario.contenidoImagen || imagenesConfig.usuario}}" class="mr-2"  (click)="op.toggle($event)"
                shape="circle"></p-avatar>
                   
                </div>
            </div>
        </div>
    </div>
    
    <p-overlayPanel #op>
    <ng-template pTemplate="content">
        <div class="grid mt-1 p-3">
            <div class="w-25rem">
                <div class="flex">
                    <p-avatar image="{{usuario.contenidoImagen || imagenesConfig.usuario}}" (click)="op.toggle($event)" styleClass="mr-2"
                        size="large" shape="circle"></p-avatar>
                    <div class="">
                        <h4 class="mt-0 mb-0" >{{'Geampier A. Santamaría de la Cruz' | titlecase }}</h4>
                        <span>{{usuario.correo | titlecase }}</span>
                    </div>
                </div>
                <hr>
                <button [ngStyle]="{'padding':'0px', 'text-align': 'left', 'width': '100%'}" pButton pRipple label="Perfil" type="button" routerLink="/panel/perfil" icon="pi pi-user" class="p-button-rounded p-button-secondary p-button-text"></button>
                <hr>
                <button [ngStyle]="{'padding':'0px', 'text-align': 'left', 'width': '100%'}" pButton pRipple label="Cerrar Sesión" type="button" routerLink="/auth/cerrarsesion" icon="pi pi-sign-out" class="p-button-rounded p-button-secondary p-button-text"></button>
            </div>
        </div>
    </ng-template>
</p-overlayPanel>
`
})
export class AppTopbar {
    items!: MenuItem[];
    imagenesConfig: any = {};
    coloresConfig: any = {};

    usuario: any = {};

    constructor(public layoutService: LayoutService, private _configService: ConfigService, private renderer: Renderer2,
        private _Router: Router,
        private el: ElementRef) { this.configuracionInicialFormulario(); }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    configuracionInicialFormulario(): void {
        forkJoin({
            imagenes: this._configService.imagenesConfig(),
            colores: this._configService.coloresConfig()
        }).pipe(
            tap(({ imagenes, colores }) => {
                this.imagenesConfig = imagenes.cabecera;
                this.coloresConfig = colores.login;
            }),
            catchError(error => {
                console.error(`Error al obtener la configuración de formulario app topbar. ${error}`);
                return of(error);
            })
        ).subscribe();
    }
}
