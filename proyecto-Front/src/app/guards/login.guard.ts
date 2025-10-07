import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.estaLogueado()) {
      // Si ya está logueado, lo redirigimos al perfil (o al home)
      this.router.navigate(['/profile']);
      return false;
    }
    return true; // Si no está logueado, puede entrar a login/register
  }
}
