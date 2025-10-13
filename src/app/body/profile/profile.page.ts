// src/app/profile/profile.page.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  objetivos = [
  { label: 'Bajar de peso', value: 'bajar_peso' },
  { label: 'Ganar masa muscular', value: 'ganar_masa' },
  { label: 'Mantenerme saludable', value: 'salud' },
  { label: 'Mejorar resistencia', value: 'resistencia' }
  ];

  usuario: any = {};
  editando = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario() {
    const usuarioPersistido = this.authService.obtenerUsuario();
    if (usuarioPersistido) {
      // Si ya lo tenemos guardado en localStorage
      this.usuario = { ...usuarioPersistido };
    } else {
      // Si no está, consultamos a la API con el token
      const token = this.authService.obtenerToken();
      if (!token) return;

      this.http.get('http://localhost:3000/api/auth/perfil', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (res: any) => {
          this.usuario = { ...res };
          this.authService.guardarUsuario(res); // lo persistimos
        },
        error: err => {
          console.error('Error obteniendo perfil', err);
        }
      });
    }
  }

  async habilitarEdicion() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Deseas editar tu información?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Sí', handler: () => this.editando = true }
      ]
    });
    await alert.present();
  }

  guardarCambios() {
    const token = this.authService.obtenerToken();
    this.http.put('http://localhost:3000/api/auth/perfil', this.usuario, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: async (res: any) => {
        this.editando = false;
        this.authService.guardarUsuario(res); // actualizamos persistencia
        const alert = await this.alertCtrl.create({
          header: 'Éxito',
          message: 'Perfil actualizado correctamente',
          buttons: ['OK']
        });
        await alert.present();
      },
      error: err => console.error('Error al actualizar perfil', err)
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }

  toggleObjetivo(o: string) {
    if (this.usuario.objetivo.includes(o)) {
      this.usuario.objetivo = this.usuario.objetivo.filter((obj: string) => obj !== o);
    } else {
      this.usuario.objetivo.push(o);
    }
  }

  get objetivosTexto(): string {
    if (!this.usuario.objetivo || this.usuario.objetivo.length === 0) return '';
    return this.usuario.objetivo
      .map((val: string) => {       // <--- Aquí
        const obj = this.objetivos.find(o => o.value === val);
        return obj ? obj.label : val;
      })
      .join(', ');
  }



  goToGame() {
    this.navCtrl.navigateForward('/game');
  }
  goToRecipes() {
    this.navCtrl.navigateForward('/recipes');
  }
  goToHome() {
    this.navCtrl.navigateForward('/home');
  }
  goToGym() {
    this.navCtrl.navigateForward('/gym');
  }
  goToProfile() {
    this.navCtrl.navigateForward('/profile');
  }
}