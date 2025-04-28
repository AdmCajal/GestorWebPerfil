import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
import { VistaUsuario } from './components/vista-usuario.component/vista-usuario.component';
import { MantenimientoUsuario } from './components/mantenimiento-usuario.component/mantenimiento-usuario.component';


export default [
    {
        path: '', canActivate: [permisosGuard], data: { breadcrumb: 'Usuarios' }, component: VistaUsuario,
    }


] as Routes;
