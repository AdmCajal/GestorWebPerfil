import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { EncryptService } from '../../../../../core/services/encrypt.service';
import { ConfigService } from '../../../../../security/services/config.service';
import { API_PORTAL_ROUTES } from '../../../../../core/constants/routers/api-portal.routes';
import { ResponseApi } from '../../../../../core/models/response/response.model';

@Injectable({
    providedIn: 'root'
})
export class PersonaService {
    private apiUrl: string = "";

    constructor(private _http: HttpClient, private _encryptService: EncryptService, private _configService: ConfigService) { }


    obtener(filtro: any): Observable<ResponseApi> {
        return from(this._configService.UrlApiPortal()).pipe(
            switchMap(apiUrl => {
                this.apiUrl = `${apiUrl}${API_PORTAL_ROUTES.PERSONA.LISTAR}`;
                return this._http.post<ResponseApi>(this.apiUrl, filtro);
            }),
            catchError(error => {
                console.error(`Error al buscar. ${error}`);
                return throwError(error);
            })
        )
    }
    obtenerPersonaUsuario(filtro: any): Observable<ResponseApi> {
        return from(this._configService.UrlApiPortal()).pipe(
            switchMap(apiUrl => {
                this.apiUrl = `${apiUrl}${API_PORTAL_ROUTES.PERSONA.LISTAR_REPRESENTANTE}`;
                return this._http.post<ResponseApi>(this.apiUrl, filtro);
            }),
            catchError(error => {
                console.error(`Error al buscar. ${error}`);
                return throwError(error);
            })
        )
    }

    obtenerUbigeo(filtro: any): Observable<ResponseApi> {
        return from(this._configService.UrlApiPortal()).pipe(
            switchMap(apiUrl => {
                this.apiUrl = `${apiUrl}${API_PORTAL_ROUTES.PERSONA.LISTAR_UBIGEO}`;
                return this._http.post<ResponseApi>(this.apiUrl, filtro);
            }),
            catchError(error => {
                console.error(`Error al buscar. ${error}`);
                return throwError(error);
            })
        )
    }

    obtenerPerfiles(filtro: any): Observable<any> {
        return from(this._configService.UrlApiPortal()).pipe(
            switchMap(apiUrl => {
                this.apiUrl = `${apiUrl}${API_PORTAL_ROUTES.USUARIO.LISTAR_PERFIL}`;
                return this._http.post<ResponseApi>(this.apiUrl, filtro);
            }),
            catchError(error => {
                console.error(`Error al buscar usuarios. ${error}`);
                return throwError(error);
            })
        )
    }
}
