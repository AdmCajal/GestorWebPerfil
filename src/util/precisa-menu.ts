import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [

  {
    title: 'Dashboard',
    icon: 'shopping-cart-outline',
    link: '/precisa/dashboard',
    home: true,
  },
  {
    title: 'MAESTROS',
    group: true,
  },
  {
    title: 'Maestros',
    icon: 'layout-outline',
    children: [
      {
        title: 'Asignar Servicio',
        icon: 'browser-outline',
        link: '/precisa/maestros/asignar-servicio'
      }

    ],
  },
  {
    title: 'SEGURIDAD',
    group: true,
  },
  {
    title: 'seguridad',
    icon: 'layout-outline',
    children: [
      {
        title: 'Perfil Usuarios',
        icon: 'person-outline',
        link: '/precisa/seguridad/perfil-usuario'
      },
      {
        title: 'Asignar Perfil',
        pathMatch: 'prefix',
        icon: 'person-outline',
        link: '/precisa/seguridad/perfil-usuario',
      },
      {
        title: 'Usuarios',
        icon: 'person-outline',
        link: '/precisa/seguridad/usuario',
      },
      {
        title: 'Configuración Correo',
        icon: 'email-outline',
        link: '/precisa/seguridad/configuracion-correo',
      },
      {
        title: 'Campaña',
        icon: 'browser-outline',
        link: '/precisa/seguridad/campania',
      },
      {
        title: 'Portal',
        icon: 'clipboard-outline',
        link: '/precisa/seguridad/portal',
      }
    ],
  }
];
