import { Injectable } from '@angular/core';
// import { Submenu } from '../../core/Model/Entities/auth/Menu.model';
// import { Usuario } from '../../core/Model/Entities/auth/Usuario.model';
import { EncryptService } from '../../core/services/encrypt.service';
import { ResponseApi } from '../../core/models/response/response.model';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {

    constructor(private _EncryptService: EncryptService) { }

    guardarLogin(response: ResponseApi): void {
        sessionStorage.setItem("data_login", JSON.stringify(this._EncryptService.Encriptar(JSON.stringify(response))));
    }
    eliminarLogin(): void {
        sessionStorage.removeItem('data_login');
    }

    obtenerToken(): string {
        let token: string = '';
        try {
            if (sessionStorage.getItem("data_login")) {
                const dataEncriptada: string = JSON.parse(sessionStorage.getItem("data_login") || "");
                const data: ResponseApi = JSON.parse(this._EncryptService.Desencriptar(dataEncriptada));
                token = data.tokem;
            }
        } catch (error) {
            throw Error(`Las crendenciales están corruptas. ${error}`);
        } finally {
            return token;
        }

    }

    validarToken(): boolean {
        if (sessionStorage.getItem("data_login") !== null) return true;
        return false;
    }

    permisosComponente(idMenu: string): boolean {

        if (idMenu == 'public') return true;

        if (sessionStorage.getItem("data_menu")) {
            const dataEncriptada: string = JSON.parse(sessionStorage.getItem("data_menu") || "");
            const data: any[] = JSON.parse(this._EncryptService.Desencriptar(dataEncriptada)) || [];
            const subMenu: any = data.find(sm => sm.id_menu === idMenu);
            console.log(idMenu)
            console.log(data)
            console.log(subMenu)
            return subMenu && subMenu.estado == 1 ? true : false
        }
        return false;
    }

    nombreComponente(idMenu: string): string |undefined {

        if (idMenu == 'public') return 'true';

        if (sessionStorage.getItem("data_menu")) {
            const currentUrl = window.location.href;
            const lastSegment = currentUrl.split('/').pop();
            //&& sm.url.includes(lastSegment)
            const dataEncriptada: string = JSON.parse(sessionStorage.getItem("data_menu") || "");
            const data: any[] = JSON.parse(this._EncryptService.Desencriptar(dataEncriptada)) || [];
            const subMenu: any = data.find(sm => sm.id_menu === idMenu );

            console.log(lastSegment);

            // console.log(idMenu)
            console.log(data)
            // console.log(subMenu)

            if (subMenu) return subMenu.nombre;
        }
        return undefined;
    }

    cerrarSesion():void {
        sessionStorage.removeItem('Menu_Session');
        sessionStorage.removeItem('data_menu');
        sessionStorage.removeItem('data_login');
        sessionStorage.removeItem('data_user');
    }


    guardarUsuarioLogueado(usuario: any) {
        sessionStorage.setItem("data_user", JSON.stringify(this._EncryptService.Encriptar(JSON.stringify(usuario))));
    }

    obtenerUsuarioLogueado(): any {
        if (sessionStorage.getItem("data_user") != null) {
            const dataEncriptada: string = JSON.parse(sessionStorage.getItem("data_user") || "");
            const data: any = JSON.parse(this._EncryptService.Desencriptar(dataEncriptada)) || null;
            return data;
        }
        return null;
    }

    encriptarDataGeneral(data: string): string {
        return this._EncryptService.Encriptar(JSON.stringify(data));
    }

    desencriptarDataGeneral(data: string): string {
        const dataDesencriptar = this._EncryptService.Desencriptar(data) || '';
        return dataDesencriptar;
    }
}
