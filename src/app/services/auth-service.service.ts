import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async registerUser(usuario: Usuario) {
    // Guardamos usuario en storage simulando un backend
    await this._storage?.set('usuario', usuario);
  }

  async login(email: string, password: string): Promise<boolean> {
    const usuario: Usuario = await this._storage?.get('usuario');
    if (usuario && usuario.email === email && usuario.password === password) {
      await this._storage?.set('isLoggedIn', true);
      return true;
    }
    return false;
  }

  async logout() {
    await this._storage?.set('isLoggedIn', false);
  }

  async isLoggedIn(): Promise<boolean> {
    return (await this._storage?.get('isLoggedIn')) === true;
  }

  async getUsuario(): Promise<Usuario | null> {
    return await this._storage?.get('usuario');
  }
}
