import { Routes } from '@angular/router';
import { BusquedaAplicativo } from './components/busqueda-aplicativo.component/busqueda-aplicativo.component';


export default [
    {
        path: '', data: { breadcrumb: 'Aplicativo', idMenu: 'nn' }, component: BusquedaAplicativo,
    }
] as Routes;
