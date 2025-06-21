import { Routes } from '@angular/router';
import { permisosGuard } from '../../core/guards/permisos.guard';


export default [
    { path: 'co_miscelaneomantenimiento', loadChildren: () => import('./components/Miscelaneo/miscelaneo.routes') },
    { path: 'co_sedemantenimiento', loadChildren: () => import('./components/sucursal/sucursal.routes') },
    { path: 'co_personasmantenimiento', loadChildren: () => import('./components/persona/persona.routes') },

] as Routes;

