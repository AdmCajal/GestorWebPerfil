import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
import { MantenimientoPerfilUsuario } from './components/mantenimiento-perfil-usuario.component/mantenimiento-perfil-usuario.component';
import { BusquedaPerfilUsuario } from './components/busqueda-perfil-usuario.component/busqueda-perfil-usuario.component';


export default [
    {
        path: '', canActivate: [permisosGuard], data: { breadcrumb: 'Usuarios', idMenu: 'CON003' }, component: BusquedaPerfilUsuario,
    },
    {
        path: 'mantenimiento/:accion',  data: { breadcrumb: 'Usuarios', idMenu: 'CON003' }, component: MantenimientoPerfilUsuario,
    }
] as Routes;
