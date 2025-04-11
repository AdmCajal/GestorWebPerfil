import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './auth/service/login.service';


@Injectable({
  providedIn: 'root'
})
export class PrecisaGuard implements CanActivate {

  constructor(
    private authService: LoginService,
    private router: Router
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(this.authService.usuarioAuth()){
      return true
    }
    this.router.navigate(['/auth/login'],{skipLocationChange:true});
    return false
  }

}
