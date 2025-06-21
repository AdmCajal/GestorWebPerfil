import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
import { BusquedaCompania } from './components/busqueda-compania.component/busqueda-compania.component';
import { MantenimientoCompania } from './components/mantenimiento-compania.component/mantenimiento-compania.component';


export default [
    {
        path: '', canActivate: [permisosGuard], data: { breadcrumb: 'Compañia', idMenu: 'W1GRUP07CON005' }, component: BusquedaCompania,
    }


] as Routes;
