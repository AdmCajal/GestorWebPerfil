import { Routes } from '@angular/router';
import { permisosGuard } from '../../core/guards/permisos.guard';


export default [
    { path: 'co_usuariomantenimiento', loadChildren: () => import('./components/usuario/usuario.routes') },
    { path: 'co_companiamantenimiento', loadChildren: () => import('./components/compania/compania.routes') },
    { path: 'co_perfilmantenimiento', loadChildren: () => import('./components/perfil-usuario/perfil-usuario.routes') },
    { path: 'co_aplicativomantenimiento', loadChildren: () => import('./components/aplicativo/aplicativo.routes') },
    { path: 'co_gerenciamantenimiento', loadChildren: () => import('./components/gerencia/gerencia.routes') },
] as Routes;