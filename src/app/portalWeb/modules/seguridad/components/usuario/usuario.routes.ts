import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
import { BusquedaUsuario } from './components/busqueda-usuario.component/busqueda-usuario.component';
import { MantenimientoUsuario } from './components/mantenimiento-usuario.component/mantenimiento-usuario.component';


export default [
    {
        path: '', canActivate: [permisosGuard], data: { breadcrumb: 'Usuarios' }, component: BusquedaUsuario,
    }


] as Routes;
