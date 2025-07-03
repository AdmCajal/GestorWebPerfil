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
export class UsuarioMantenimientoService {
    private usuario?: any;
    setUsuario(usuario: any) {
        this.usuario = usuario;
    }
    getUsuario() {
        return this.usuario;
    }
    limpiarUsuario() {
        this.usuario = undefined;
    }


}
