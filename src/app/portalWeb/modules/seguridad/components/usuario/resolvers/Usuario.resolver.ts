import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { UsuarioMantenimientoService } from "../services/usuario-mantenimiento.service";
import { ACCION_FORMULARIO } from "../../../../../core/constants/acciones-formulario";

@Injectable({ providedIn: 'root' })
export class UsuarioResolver implements Resolve<any> {
    constructor(
        private _UsuarioMantenimientoService: UsuarioMantenimientoService,
        private _Router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot): any {
        const accion = route.paramMap.get('accion');
        const usuario = this._UsuarioMantenimientoService.getUsuario();

        switch (accion) {
            case ACCION_FORMULARIO.EDITAR:
            case ACCION_FORMULARIO.VER:
                if (!usuario) {
                    this._Router.navigate(['seguridad/co_usuariomantenimiento']);
                    return null;
                }
                return usuario;
            case ACCION_FORMULARIO.AGREGAR:
                return null;
            default: this._Router.navigate(['seguridad/co_usuariomantenimiento']);
                return null;
        }
    }
}
