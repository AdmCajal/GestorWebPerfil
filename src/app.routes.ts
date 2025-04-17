import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { permisosGuard } from './app/portalWeb/core/guards/permisos.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', canActivate: [permisosGuard], data: { breadcrumb: 'Dashboard' }, component: Dashboard },
            { path: 'uikit', canActivate: [permisosGuard], loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', canActivate: [permisosGuard], component: Documentation },
            { path: 'pages', canActivate: [permisosGuard], loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'calendar', canActivate: [permisosGuard], loadChildren: () => import('./app/portalWeb/modules/calendario/calendario.routes') },
            { path: 'seguridad', loadChildren: () => import('./app/portalWeb/modules/seguridad/seguridad.routes') },

        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/portalWeb/modules/auth/auth.routes') },
    { path: '**', redirectTo: '/auth/access' }
];
