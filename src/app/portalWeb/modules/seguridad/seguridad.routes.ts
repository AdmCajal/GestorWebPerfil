import { Routes } from '@angular/router';
import { permisosGuard } from '../../core/guards/permisos.guard';


export default [
    { path: 'co_usuariomantenimiento', loadChildren: () => import('./components/usuario/usuario.routes') },
] as Routes;