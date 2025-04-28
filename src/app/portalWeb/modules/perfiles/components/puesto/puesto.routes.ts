import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
import { AsingarPuesto } from './components/asignar-puesto.component/asignar-puesto.component';


export default [
    {
        path: '', data: { breadcrumb: 'Puesto' }, component: AsingarPuesto,
    }


] as Routes;
