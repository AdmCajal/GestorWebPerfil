import { Routes } from '@angular/router';
import { Access } from './components/access/access.component';
import { Login } from './components/login/login.component';
import { Error } from './components/error/error.component';
import { NotAuthenticatedGuard } from '../../core/guards/not-authenticated.guard';
import { CerrarSesionGuard } from '../../core/guards/cerrar-session.guard';
import { CerrarSesion } from './components/cerrar-sesion/cerrar-sesion.component';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', canActivate: [NotAuthenticatedGuard], component: Login },
    { path: 'cerrarsesion', canActivate: [CerrarSesionGuard], component: CerrarSesion }
] as Routes;
