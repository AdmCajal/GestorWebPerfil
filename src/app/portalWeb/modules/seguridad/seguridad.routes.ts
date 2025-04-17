import { Routes } from '@angular/router';
import { permisosGuard } from '../../core/guards/permisos.guard';


export default [
    { path: 'co_usuariomantenimiento', loadChildren: () => import('./components/persona/usuario.routes') },
] as Routes;