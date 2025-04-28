import { Routes } from '@angular/router';
import { permisosGuard } from '../../../../core/guards/permisos.guard';
import { VistaMiscelaneo, } from './components/vista-miscelaneo.component/vista-miscelaneo.component';


export default [
    {
        path: '', data: { breadcrumb: 'Miscelaneos' }, component: VistaMiscelaneo,
    }


] as Routes;
