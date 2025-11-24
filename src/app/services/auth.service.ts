import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../models/usuario';
import { map, switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'usuario';

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

registrar(usuario: Usuario): Observable<any> {
  return from(
    this.afAuth.createUserWithEmailAndPassword(usuario.email, usuario.password)
  ).pipe(
    switchMap(cred => {
      if (!cred.user) throw new Error('No se pudo crear el usuario');

      const uid = cred.user.uid;

      const usuarioDoc = {
        uid,
        nombre: usuario.nombre,
        email: usuario.email,
        edad: usuario.edad,
        genero: usuario.genero,
        objetivo: usuario.objetivo,
        condicion: usuario.condicion,
        altura: usuario.altura,
        peso: usuario.peso,
        fechaCreacion: new Date()
      };

      return from(
        this.afs.collection('usuarios').doc(uid).set(usuarioDoc)
      ).pipe(
        switchMap(() => from(cred.user!.getIdToken())),
        map(token => {
          this.guardarToken(token);
          this.guardarUsuario(usuarioDoc);
          return { ok: true, uid };
        })
      );
    })
  );
}


login(email: string, password: string): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password))
      .pipe(
        switchMap(async cred => {
          if (!cred.user) throw new Error('Usuario no encontrado');

          // Guardar mínimo info localmente usando Partial<Usuario>
          const usuario: Partial<Usuario> = { uid: cred.user.uid, email: cred.user.email || '' };
          this.guardarUsuario(usuario);

          // Guardar token Firebase
          const token = await cred.user.getIdToken();
          this.guardarToken(token);

          return { ok: true, usuario };
        })
      );
  }


  async getUid(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.uid : null;
  }


  guardarToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  guardarUsuario(usuario: any) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(usuario));
  }

 obtenerUsuario(): Usuario | null {
  const raw = localStorage.getItem(this.USER_KEY);
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    // Validar campos mínimos
    if (!obj || !obj.email || !obj.uid) return null;
    return obj as Usuario;
  } catch {
    return null;
  }
}

  estaLogueado(): boolean {
    return !!this.obtenerToken();
  }


  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

}
