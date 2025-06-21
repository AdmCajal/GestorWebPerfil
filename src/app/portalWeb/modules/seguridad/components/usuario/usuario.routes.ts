import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
import { BusquedaUsuario } from './components/busqueda-usuario.component/busqueda-usuario.component';
import { MantenimientoUsuario } from './components/mantenimiento-usuario.component/mantenimiento-usuario.component';


export default [
    {
        path: '', canActivate: [permisosGuard], data: { breadcrumb: 'Usuarios', idMenu: 'W1GRUP07CON003' }, component: BusquedaUsuario,
    },
    {
        path: 'mantenimiento/:accion',  data: { breadcrumb: 'Usuarios', idMenu: 'W1GRUP07CON003' }, component: MantenimientoUsuario,
    }
] as Routes;
