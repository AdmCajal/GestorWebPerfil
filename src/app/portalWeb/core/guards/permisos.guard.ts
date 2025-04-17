
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

    console.log(nombreComponente)
    if (sessionStorage.getItem('data_login') != null && nombreComponente == 'Dashboard') {
      // Cambia el título de la página

      if (nombreComponente) {
        this.titleService.setTitle(`.: ${nombreComponente} - Portal Web - SANNA :.`);
      }
      return true
    }
    else if (nombreComponente && this._SecurityService.permisosComponente(nombreComponente)) {
      // Cambia el título de la página
      if (nombreComponente) {
        this.titleService.setTitle(`.: ${nombreComponente} - Portal Web - SANNA :.`);
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