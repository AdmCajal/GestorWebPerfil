import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { ConfirmationService } from 'primeng/api';
import { AppConfig } from '../../environments/app.config';
import { ComponenteBasePrincipal } from '../../util/ComponenteBasePrincipa';
import { ConstanteUI } from '../../util/Constantes/Constantes';
import { DtoMenu } from '../../util/DtoMenu';
import { MENU_ITEMS } from '../../util/precisa-menu';
import { LoginService } from './auth/service/login.service';

@Component({
  selector: 'ngx-precisa-index',
  templateUrl: './precisa-index.component.html',
  styleUrls: ['./precisa-index.component.scss']
})
export class PrecisaIndexComponent extends ComponenteBasePrincipal implements OnInit, OnDestroy {

  menu = MENU_ITEMS;
  lstMenu: NbMenuItem[] = [];
  model: any
  nodo_1: any[] = []
  img01: string;
  constructor(private menus: NbMenuService,
    private router: Router,
    private confirmationService: ConfirmationService,
    public loginService: LoginService,
    public config: AppConfig) {
    super();
    this.menus.onItemClick().subscribe((res) => {
      var obj = new DtoMenu();
      obj.titulo = res.item.title
      sessionStorage.setItem(ConstanteUI.MENUSEGURIDAD, JSON.stringify(obj));
    });
  }

  ngOnInit(): void {
    this.checkTimeOut();
    this.userInactive.subscribe((mensajito) => {
      this.IdTimer = setInterval(() => this.tick(this.confirmationService, this.router, this.loginService), 1000)
    });
    this.img01 = `${this.config.getEnv('recursos.precisa')}/assets`;
    let usuario = JSON.parse(sessionStorage.getItem('access_user'))
    let menu = JSON.parse(sessionStorage.getItem('access_menu'))
    //let sede = { group: true, title: `Sede: ${usuario.data[0]?.SedDescripcion}` }
    usuario = { usuario: usuario.data[0]?.Documento }

    this.cargarMenuNivel_1(menu)

    // this.lstMenu.push(sede)
    this.nodo_1.forEach(tituloNIvel_1 => {
      this.model = {
        title: tituloNIvel_1,
        icon: 'layout-outline',
        children: this.cargarMenuNivel_2(menu, tituloNIvel_1)
      }
      console.log("Error: cargarMenuNivel_1", this.model);
      this.lstMenu.push(this.model)
    });

    this.menu = this.lstMenu
  }

  ngOnDestroy(): void {
    this.userInactive.unsubscribe();
  }

  //dd/mm/yy 'anio, mes, dia'
  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  @HostListener('window:mousemove')
  checkUserActivity() {
    clearTimeout(this.timeoutId);
    this.checkTimeOut();
  }


  cargarMenuNivel_1(node: any) {
    let nodo = node.map(x => x.DescripcionGrupo)
    const result = nodo.reduce((acc, item) => {
      if (!acc.includes(item)) {
        acc.push(item);
      }
      return acc;
    }, [])

    this.nodo_1 = result
  }

  cargarMenuNivel_2(node: any, grupo: string): any {
    const nodo = Array.isArray(node) ? node : [node]
    return nodo.reduce((acc, item) => {
      if (grupo == item.DescripcionGrupo) {
        let model = {
          title: item.DescripcionPaginas,
          data: item,
          icon: 'person-outline',
          link: '/precisa' + this.convertirUrl(item.URL),
        }
        acc.push(model);
      }
      return acc;
    }, [])

  }

  convertirUrl(item: any): string {
    let result = ''
    result = item.replace("Comercial", "").replace(".aspx", "");
    return result.toLocaleLowerCase()
  }

}

