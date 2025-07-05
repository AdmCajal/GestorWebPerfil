import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { UsuarioMantenimientoService } from "../services/usuario-mantenimiento.service";
import { AccionFormulario } from "../../../../../core/enums/accionFormulario.enum";

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
            case AccionFormulario.EDITAR:
            case AccionFormulario.VER:
                if (!usuario) {
                    this._Router.navigate(['seguridad/co_usuariomantenimiento']);
                    return null;
                }
                return usuario;
            case AccionFormulario.AGREGAR:
                return null;
            default: this._Router.navigate(['seguridad/co_usuariomantenimiento']);
                return null;
        }
    }
}
