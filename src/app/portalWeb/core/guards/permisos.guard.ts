
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { SecurityService } from '../../security/services/Security.service';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class permisosGuard implements CanActivate {
  constructor(private _SecurityService: SecurityService, private _router: Router, private titleService: Title) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const nombreComponente = route.data['breadcrumb'];
    const idMenu = route.data['idMenu'];
console.log(idMenu)
    if (sessionStorage.getItem('data_login') != null && nombreComponente == 'Dashboard') {
      // Cambia el título de la página

      if (nombreComponente) {
        this.titleService.setTitle(`.: ${nombreComponente} - Portal Web - SANNA :.`);
      }
      return true
    }
    else if (idMenu && this._SecurityService.permisosComponente(idMenu)) {
      // Cambia el título de la página
      if (this._SecurityService.nombreComponente(idMenu)) {
        this.titleService.setTitle(`.: ${this._SecurityService.nombreComponente(idMenu)} - Portal Web - SANNA :.`);
      }

      return true;
    } else if (sessionStorage.getItem('data_login') == null) {
      this._router.navigate(['/auth/login']);
      return false;
    }
    else {

      this._router.navigate(['/auth/access']);
      return false;
    }
  }
}