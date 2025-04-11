import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsignarPerfilComponent } from './asignar-perfil/view/asignar-perfil.component';
import { CompaniasComponent } from './companias/view/companias.component';
import { ConfigurarCorreoComponent } from './conf-correo/view/configurar-correo.component';
import { PerfilUsuarioMantenimientoComponent } from './perfi-usuarios/view/components/perfil-usuario-mantenimiento.component';
import { PerfilUsuariosComponent } from './perfi-usuarios/view/perfil-usuarios.component';
import { PortalComponent } from './portal/view/portal.component';
import { SeguridadComponent } from './seguridad.component';
import { UsuariosComponent } from './usuarios/view/usuarios.component';
import { GenerarComprobanteComponent } from './generar-comprobante/view/generar-comprobante.component';
import { ConfigurarCorreoMantenimientoComponent } from './conf-correo/components/configurar-correo-mantenimiento.component';
import { UsuariosMantenimientoComponent } from './usuarios/components/usuarios-mantenimiento.component';
import { CompaniamastMantenimientoComponent } from './companias/view/components/companiamast-mantenimiento.component';

const routes: Routes = [{
  path: '',
  component: SeguridadComponent,
  children: [
    {
      path: 'co_perfilmantenimiento',
      component: PerfilUsuariosComponent,
    },
    {
      path: 'co_asignarperfil',
      component: AsignarPerfilComponent,
    },
    {
      path: 'co_usuariomantenimiento',
      component: UsuariosComponent,
    },
    {
      path: 'co_correomantenimiento',
      component: ConfigurarCorreoComponent,
    },
    {
      path: 'co_companiamantenimiento',
      component: CompaniasComponent,
    },
    {
      path: 'co_portal',
      component: PortalComponent,
    },
    {
      path: 'generar_comprobante',
      component: GenerarComprobanteComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PefilUsuariosRoutingModule { }

export const routedComponents = [
  SeguridadComponent,
  PerfilUsuariosComponent,
  PerfilUsuarioMantenimientoComponent,
  AsignarPerfilComponent,
  UsuariosComponent,
  ConfigurarCorreoComponent,
  CompaniasComponent,
  PortalComponent,
  GenerarComprobanteComponent,
  ConfigurarCorreoMantenimientoComponent,
  UsuariosMantenimientoComponent,
  CompaniamastMantenimientoComponent
];
