import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
import { BusquedaGerencia } from './components/busqueda-gerencia.component/busqueda-gerencia.component';


export default [
    {
        path: '', data: { breadcrumb: 'Gerencia', idMenu: 'nn' }, component: BusquedaGerencia,
    }
] as Routes;
