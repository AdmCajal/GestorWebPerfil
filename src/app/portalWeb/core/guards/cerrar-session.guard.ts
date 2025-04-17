// not-authenticated.guard.ts (o crea un guard específico para cerrar sesión)

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SecurityService } from '../../security/services/Security.service';

@Injectable({
  providedIn: 'root'
})
export class CerrarSesionGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    // Limpia los datos de sesión
    sessionStorage.clear();

    // Redirige manualmente al login
    this.router.navigate(['auth/login']);

    // Retorna false para evitar que Angular cargue un componente
    return false
  }
}
