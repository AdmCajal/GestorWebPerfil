import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { EncryptService } from '../../../../../core/services/encrypt.service';
import { ConfigService } from '../../../../../security/services/config.service';
import { API_PORTAL_ROUTES } from '../../../../../core/constants/routers/api-portal.routes';
import { ResponseApi } from '../../../../../core/models/response/response.model';
import { ACCION_MANTENIMIENTO } from '../../../../../core/constants/acciones-mantenimiento';

@Injectable({
    providedIn: 'root'
})
export class SucursalService {
    private apiUrl: string = "";

    constructor(private _http: HttpClient, private _encryptService: EncryptService, private _configService: ConfigService) { }


    obtener(filtro: any): Observable<ResponseApi> {
        return from(this._configService.UrlApiPortal()).pipe(
            switchMap(apiUrl => {
                this.apiUrl = `${apiUrl}${API_PORTAL_ROUTES.SUCURSAL.LISTAR}`;
                return this._http.post<ResponseApi>(this.apiUrl, filtro);
            }),
            catchError(error => {
                console.error(`Error al buscar usuarios. ${error}`);
                return throwError(error);
            })
        )
    }
    mantenimiento(codigo: number, obj: any): Observable<ResponseApi> {

        return from(this._configService.UrlApiPortal()).pipe(
            switchMap(apiUrl => {
                this.apiUrl = `${apiUrl}${API_PORTAL_ROUTES.SUCURSAL.MANTENIMIENTO}${codigo}`;
                return this._http.post<ResponseApi>(this.apiUrl, obj);
            }),
            catchError(error => {
                console.error(`Error al registrar. ${error}`);
                return throwError(error);
            })
        )
    }
}
