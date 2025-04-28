import { Routes } from '@angular/router';
import { permisosGuard } from '../../core/guards/permisos.guard';


export default [
    { path: 'co_miscelaneomantenimiento', loadChildren: () => import('./components/Miscelaneo/miscelaneo.routes') },
] as Routes;