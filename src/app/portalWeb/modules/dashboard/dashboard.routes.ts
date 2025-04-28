import { Routes } from '@angular/router';
import { permisosGuard } from '../../core/guards/permisos.guard';
import { DashBoardGeneral } from './dashboard-general/dashboard-general.component';


export default [
    { path: '', component: DashBoardGeneral },
] as Routes;