import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
// import { BusquedaUsuario } from './components/busqueda-perfil-usuario.component/busqueda-perfil-usuario.component';
// import { MantenimientoUsuario } from './components/mantenimiento-perfil-usuario.component/mantenimiento-perfil-usuario.component';


export default [
    {
        path: '', canActivate: [permisosGuard], data: { breadcrumb: 'Usuarios', idMenu: 'CON003' }, component: BusquedaUsuario,
    },
    {
        path: 'mantenimiento/:accion',  data: { breadcrumb: 'Usuarios', idMenu: 'CON003' }, component: MantenimientoUsuario,
    }
] as Routes;
