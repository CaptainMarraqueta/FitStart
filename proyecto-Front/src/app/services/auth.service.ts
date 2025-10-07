// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'usuario';

  constructor(private http: HttpClient) {}

  registrar(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.API}/register`, usuario);
  }

  // Guarda automáticamente token y usuario devueltos por el backend
  login(credenciales: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API}/login`, credenciales).pipe(
      tap((resp: any) => {
        if (resp?.token) {
          this.guardarToken(resp.token);
        }
        if (resp?.usuario) {
          this.guardarUsuario(resp.usuario);
        }
      })
    );
  }

  guardarToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // === Persistencia de USUARIO ===
  guardarUsuario(usuario: Usuario) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
  }

  obtenerUsuario(): Usuario | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  }

  // Decodifica payload del JWT (sin librerías externas)
  private decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  private tokenExpirado(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload?.exp) return false; // si no trae exp, asumimos válido
    const ahora = Date.now() / 1000;
    return payload.exp < ahora;
  }

  estaLogueado(): boolean {
    const token = this.obtenerToken();
    if (!token) return false;

    if (this.tokenExpirado(token)) {
      this.logout(); // limpia si ya expiró
      return false;
    }
    return true;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
