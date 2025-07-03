import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { EncryptService } from '../../core/services/encrypt.service';
import { ConfigService } from '../../security/services/config.service';
import { ResponseApi } from '../../core/models/response/response.model';
import { API_PORTAL_ROUTES } from '../../core/constants/routers/api-portal.routes';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl: string = "";

    constructor(private _http: HttpClient, private _encryptService: EncryptService, private _configService: ConfigService) { }


    iniciarSesion(usuario: any): Observable<ResponseApi> {
        return from(this._configService.UrlApiPortal()).pipe(
            switchMap(apiUrl => {
                this.apiUrl = `${apiUrl}${API_PORTAL_ROUTES.SEGURIDAD.LOGIN}`;
                return this._http.post<ResponseApi>(this.apiUrl, usuario);
            }),
            catchError(error => {
                console.error(`Error al iniciar sesión. ${error}`);
                return throwError(error);
            })
        )
    }


    // obtenerSociedades(): Observable<ResponseApi> {

    //     return from(this._configService.UrlApiPortal()).pipe(
    //         switchMap(apiUrl => {
    //             this.apiUrl = `${apiUrl}${API_PORTAL_ROUTES.AUTH.LOGIN}`;
    //             return this._http.get<ResponseApi>(this.apiUrl);
    //         }),
    //         catchError(error => {
    //             console.error(`Error al iniciar sesión. ${error}`);
    //             return throwError(error);
    //         })
    //     )

    // }
    obtenerMenuUsuario(usuario: any): Observable<ResponseApi> {
        console.log(usuario)
        return from(this._configService.UrlApiPortal()).pipe(
            switchMap(apiUrl => {
                this.apiUrl = `${apiUrl}${API_PORTAL_ROUTES.SEGURIDAD.MENU}`;
                return this._http.post<ResponseApi>(this.apiUrl, usuario);
            }),
            catchError(error => {
                console.error(`Error al iniciar sesión - obtener menus. ${error}`);
                return throwError(error);
            })
        )
    }

    obtenerDatosMaestros(): Observable<ResponseApi> {
        return from(this._configService.UrlApiPortal()).pipe(
            switchMap(apiUrl => {
                this.apiUrl = `${apiUrl}${API_PORTAL_ROUTES.MAESTRO.LISTAR}`;
                return this._http.post<ResponseApi>(this.apiUrl, {});
            }),
            catchError(error => {
                console.error(`Error al iniciar sesión - obtener menus. ${error}`);
                return throwError(error);
            })
        )
    }

    // validarUsuarioToken(usuario: any): Observable<ResponseApi> {

    //     return from(this._configService.UrlApiPortal()).pipe(
    //         switchMap(apiUrl => {
    //             this.apiUrl = `${apiUrl}${API_PORTAL_ROUTES.AUTH.TOKEN}`;
    //             return this._http.post<ResponseApi>(this.apiUrl, usuario);
    //         }),
    //         catchError(error => {
    //             console.error(`Error al iniciar sesión. ${error}`);
    //             return throwError(error);
    //         })
    //     )

    // }


    // guardarCredenciales(usuario: any) {
    //     localStorage.setItem("cred_msv_portal", JSON.stringify(this._encryptService.Encriptar(JSON.stringify(usuario))));
    // }

    guardarCredencialesRecarga(usuario: any) {
        sessionStorage.setItem("data_user_reload", JSON.stringify(this._encryptService.Encriptar(JSON.stringify(usuario))));
    }

    // obtenerCredenciales(): any {
    //     let usuarioGuardado: any;
    //     try {
    //         if (localStorage.getItem("cred_msv_portal")) {
    //             const dataEncriptada: string = JSON.parse(localStorage.getItem("cred_msv_portal") || "");
    //             const data: any = JSON.parse(this._encryptService.Desencriptar(dataEncriptada))
    //             usuarioGuardado = data;
    //             return usuarioGuardado;
    //         }
    //     } catch (error) {
    //         throw Error(`Las crendenciales están corruptas. ${error}`);
    //     } finally {
    //         return usuarioGuardado
    //     }

    // }
    obtenerCredencialesRecarga(): any {
        let usuarioGuardado: any;
        try {
            if (sessionStorage.getItem("data_user_reload")) {
                const dataEncriptada: string = JSON.parse(sessionStorage.getItem("data_user_reload") || "");
                const data: any = JSON.parse(this._encryptService.Desencriptar(dataEncriptada))
                usuarioGuardado = data;
                return usuarioGuardado;
            }
        } catch (error) {
            throw Error(`Las crendenciales están corruptas. ${error}`);
        } finally {
            return usuarioGuardado
        }

    }

    eliminarCredenciales(): void {
        localStorage.removeItem('cred_msv_portal');
    }

}
