import { Routes } from '@angular/router';
import { permisosGuard } from '../../core/guards/permisos.guard';


export default [
    { path: 'co_usuariomantenimiento', loadChildren: () => import('./components/usuario/usuario.routes') },
    { path: 'co_companiamantenimiento', loadChildren: () => import('./components/compania/compania.routes') },
    { path: 'co_perfilmantenimiento', loadChildren: () => import('./components/perfil-usuario/perfil-usuario.routes') },
] as Routes;