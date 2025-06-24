import { TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { EncryptService } from './encrypt.service';
import { Menu, Submenu } from '../models/interfaces/menu/menu';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuLayoutService {
  constructor(private _encryptService: EncryptService) { }

  guardarMenu(menu: Menu[]) {
    const titleCasePipe = new TitleCasePipe();
    let menuFormateado: any[] = Object.values(
      menu.reduce((acc: { [key: string]: any }, m) => {
        const titulo = titleCasePipe.transform(m.titulo);
        const ordenModulo = m.ordenModulo;
        acc[titulo] ||= {
          titulo,
          ordenModulo,
          submenu: [],
        };
        acc[titulo].submenu.push({
          nombre: titleCasePipe.transform(m.nombre),
          url: m.url,
          nivelModulo: m.nivelModulo,
          estado: m.status || m.estado == 'N' ? 1 : 0,
          id_menu: m.id_menu,
          icono: m.icono,
        });
        return acc;
      }, {})
    );


    menuFormateado = menuFormateado.sort((a: { ordenModulo: number }, b: { ordenModulo: number }) => {
      if (a.ordenModulo < b.ordenModulo) {
        return -1;
      }
      if (a.ordenModulo > b.ordenModulo) {
        return 1;
      }
      return 0;
    });

    menuFormateado.forEach((m) => {
      m.submenu.sort((a: Submenu, b: Submenu) => {
        if (a.nivelModulo < b.nivelModulo) {
          return -1;
        }
        if (a.nivelModulo > b.nivelModulo) {
          return 1;
        }
        return 0;
      });
    });

    console.log(menuFormateado);

    sessionStorage.setItem('Menu_Session', JSON.stringify(this._encryptService.Encriptar(JSON.stringify(menuFormateado))));
  }

  obtenerMenuFormateado(): any[] {
    if (sessionStorage.getItem('Menu_Session')) {
      const dataEncriptada: string = JSON.parse(sessionStorage.getItem('Menu_Session') || '');
      const menu: Menu[] = JSON.parse(this._encryptService.Desencriptar(dataEncriptada)) || [];
      const menuFormateado: any[] = [];

      menu.forEach((m) => {
        const subMenuFormateado: any[] = m.submenu.map((sm: Submenu) => ({
          id: sm.id_menu,
          label: sm.nombre,
          icon: sm.icono,
          routerLink: [sm.url.toLowerCase()],
        }));

        menuFormateado.push({ label: m.titulo, icon: subMenuFormateado[0]?.icon, class: 'bold-header', items: subMenuFormateado });
      });
      return menuFormateado;
    }

    return [];
  }

  guardarMenuCredencialesOrdenadas(): void {
    if (sessionStorage.getItem('Menu_Session')) {
      const credencialesMenu: Submenu[] = [];
      const dataEncriptada: string = JSON.parse(sessionStorage.getItem('Menu_Session') || '');
      const menu: Menu[] = JSON.parse(this._encryptService.Desencriptar(dataEncriptada)) || [];
      menu.forEach((m) => {
        credencialesMenu.push(...m.submenu.map((sm: Submenu) => ({
          id_menu: sm.id_menu,
          estado: sm.estado,
          nombre: sm.nombre,
          nivelModulo: sm.nivelModulo,
          icono: sm.icono, // Incluye 'icono'
          url: sm.url     // Incluye 'url'
        })));
      });
      credencialesMenu.sort((a, b) => a.id_menu - b.id_menu); // Operación sin 'parseInt'
      sessionStorage.setItem('data_menu', JSON.stringify(this._encryptService.Encriptar(JSON.stringify(credencialesMenu))));
    }
  }

  guardarDataMaestro(data: any) {
    sessionStorage.setItem("data_maestra", JSON.stringify(this._encryptService.Encriptar(JSON.stringify(data))));
  }

  obtenerDataMaestro(tipoMaestro: string): Observable<any[]> {

    const dataEncriptada: string = JSON.parse(sessionStorage.getItem('data_maestra') || '');
    const data: any[] = JSON.parse(this._encryptService.Desencriptar(dataEncriptada)) || [];
    let maestroFormateado: any[] = data.map((d: any) => ({
      tipo: d.CodigoTabla,
      codigo: d.Codigo,
      descripcion: d.Descripcion
    }))
      .filter((f) =>
        f.tipo == tipoMaestro
      );
    return of(maestroFormateado);
  }
}
