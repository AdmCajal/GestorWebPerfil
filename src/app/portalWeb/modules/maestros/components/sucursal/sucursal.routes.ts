import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
import { BusquedaSucursal } from './components/busqueda-sucursal.component/busqueda-sucursal.component';
import { MantenimientoSucursal } from './components/mantenimiento-sucursal.component/mantenimiento-sucursal.component';


export default [
    {
        path: '', canActivate: [permisosGuard], data: { breadcrumb: 'Sucursal', idMenu: 'CON039' }, component: BusquedaSucursal,
    }
] as Routes;
