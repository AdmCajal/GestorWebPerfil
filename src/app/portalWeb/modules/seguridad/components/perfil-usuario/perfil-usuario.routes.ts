import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
import { MantenimientoPerfilUsuario } from './components/mantenimiento-perfil-usuario.component/mantenimiento-perfil-usuario.component';
import { BusquedaPerfilUsuario } from './components/busqueda-perfil-usuario.component/busqueda-perfil-usuario.component';


export default [
    {
        path: '', canActivate: [permisosGuard], data: { breadcrumb: 'Usuarios', idMenu: 'W1GRUP07CON001' }, component: BusquedaPerfilUsuario,
    }
] as Routes;
