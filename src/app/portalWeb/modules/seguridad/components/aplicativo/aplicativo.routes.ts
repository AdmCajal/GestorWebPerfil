import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
import { MantenimientoAplicativo } from './components/mantenimiento-aplicativo.component/mantenimiento-aplicativo.component';
import { BusquedaAplicativo } from './components/busqueda-perfil-usuario.component/busqueda-aplicativo.component';


export default [
    {
        path: '', data: { breadcrumb: 'Aplicativo', idMenu: 'nn' }, component: BusquedaAplicativo,
    }
] as Routes;
