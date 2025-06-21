import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
import { BusquedaPersona } from './components/busqueda-persona.component/busqueda-persona.component';
import { MantenimientoSucursal } from './components/mantenimiento-persona.component/mantenimiento-persona.component';


export default [
    {
        path: '', canActivate: [permisosGuard], data: { breadcrumb: 'Persona', idMenu: 'W1GRUP04CON019' }, component: BusquedaPersona,
    }
] as Routes;
