import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, switchMap, take, finalize } from 'rxjs/operators';
import { SecurityService } from '../services/Security.service';
import { AuthService } from '../../modules/auth/auth.service';
import { ConfigService } from '../services/config.service';
import { API_PORTAL_ROUTES } from '../../core/constants/routers/api-portal.routes';
import { ResponseApi } from '../../core/models/response/response.model';

export const SecurityInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const securityService = inject(SecurityService);
    const configService = inject(ConfigService);
    const authService = inject(AuthService);

    let isRefreshingToken = false;
    const tokenSubject = new BehaviorSubject<string | null>(null);

    // Obtén el token actual
    const token = securityService.obtenerToken();

    // Evita interceptar la ruta de login o de assets
    if (req.url.includes(`${API_PORTAL_ROUTES.SEGURIDAD.LOGIN}`)) {
        return next(req);
    } else if (!req.url.includes(`assets`)) {

        // if (expiracionToken) {
        //     return handle401ErrorApiRendiciones(req, next, authService, securityService, tokenSubject, isRefreshingToken);
        // }
        if (token) {
            req = addTokenToRequest(req, token);
        }
    }

    return next(req).pipe(
        catchError((error) => {
            if (error.status === 401) {
                return handle401ErrorApiRendiciones(req, next, authService, securityService, tokenSubject, isRefreshingToken);
            }
            return of(error);
        })
    );
};

// Función para agregar el token al encabezado
function addTokenToRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
}

// Función para manejar errores 401 y renovar tokens
function handle401ErrorApiRendiciones(
    req: HttpRequest<any>,
    next: HttpHandlerFn,
    authService: AuthService,
    securityService: SecurityService,
    tokenSubject: BehaviorSubject<string | null>,
    isRefreshingToken: boolean
): Observable<HttpEvent<any>> {
    if (!isRefreshingToken) {
        isRefreshingToken = true;
        tokenSubject.next(null);

        const credencialesUsuario: any = authService.obtenerCredencialesRecarga();
        console.log(credencialesUsuario)
        return authService.iniciarSesion(credencialesUsuario).pipe(
            switchMap((validacionResponse: ResponseApi) => {
                if (validacionResponse.status) {
                    securityService.guardarLogin(validacionResponse);
                    tokenSubject.next(validacionResponse.token);
                    return next(addTokenToRequest(req, validacionResponse.token));
                } else {
                    return of(null);
                }
            }),
            catchError((error) => {
                console.error(`Error al validar token usuario. ${error}`);
                return of(error);
            }),
            finalize(() => {
                isRefreshingToken = false;
            })
        );
    } else {
        return tokenSubject.pipe(
            filter((token) => token != null),
            take(1),
            switchMap((token) => next(addTokenToRequest(req, token!)))
        );
    }
}
