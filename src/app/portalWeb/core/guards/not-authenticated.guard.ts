import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../../security/services/Security.service';

@Injectable({
  providedIn: 'root'
})
export class NotAuthenticatedGuard implements CanActivate {

  constructor(private _router: Router, private _SecurityService: SecurityService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Determinar si el usuario no está autenticado
    const isAuthenticated = this._SecurityService.validarToken();
    if (isAuthenticated) {
      this._router.navigate(['/']);
      return false;
    }

    return true;
  }
}
