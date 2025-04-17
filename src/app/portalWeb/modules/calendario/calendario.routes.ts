import { Routes } from '@angular/router';
import { CalendarioGeneral } from './components/calendario-general/calendario-general.component';
import { permisosGuard } from '../../core/guards/permisos.guard';

export default [
    { path: '', canActivate: [permisosGuard], data: { breadcrumb: 'calendario' }, component: CalendarioGeneral }
] as Routes;
