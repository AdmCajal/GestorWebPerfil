import { Routes } from '@angular/router';
import { permisosGuard } from '../../core/guards/permisos.guard';


export default [
    { path: 'co_puestomantenimiento', loadChildren: () => import('./components/puesto/puesto.routes') },
] as Routes;