import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
import { BusquedaMiscelaneo, } from './components/busqueda-miscelaneo.component/busqueda-miscelaneo.component';


export default [
    {
        path: '', data: { breadcrumb: 'Miscelaneos' }, component: BusquedaMiscelaneo,
    }
] as Routes;
