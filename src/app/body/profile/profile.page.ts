import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage {

  usuario: any = {
    nombre: '',
    edad: null,
    objetivo: []
  };

  objetivos = [
    { label: 'Bajar de peso', value: 'bajar_peso' },
    { label: 'Ganar masa muscular', value: 'ganar_masa' },
    { label: 'Mantenerme saludable', value: 'salud' },
    { label: 'Mejorar resistencia', value: 'resistencia' }
  ];

  editando = false;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  async ionViewWillEnter() {
    const perfil = this.authService.obtenerUsuario();
    if (perfil) this.usuario = perfil;
  }

  async habilitarEdicion() {
    const alert = await this.alertCtrl.create({
      header: 'Editar',
      message: '¿Deseas modificar tu perfil?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Sí', handler: () => this.editando = true }
      ]
    });
    await alert.present();
  }

  async guardarCambios() {
    const uid = await this.authService.getUid();
    if (!uid) return;

    await this.afs.collection('usuarios').doc(uid).update(this.usuario);

    const alert = await this.alertCtrl.create({
      header: 'Éxito',
      message: 'Perfil actualizado correctamente',
      buttons: ['OK']
    });

    await alert.present();
    this.editando = false;

    // Actualizar localStorage
    this.authService.guardarUsuario(this.usuario);
  }

  async cerrarSesion() {
    await this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }

  toggleObjetivo(value: string) {
    if (!this.usuario.objetivo) this.usuario.objetivo = [];

    if (this.usuario.objetivo.includes(value)) {
      this.usuario.objetivo = this.usuario.objetivo.filter((o: string) => o !== value);
    } else {
      this.usuario.objetivo.push(value);
    }
  }

  goToHome() { this.navCtrl.navigateForward('/home'); }
  goToGame() { this.navCtrl.navigateForward('/game'); }
  goToRecipes() { this.navCtrl.navigateForward('/recipes'); }
  goToGym() { this.navCtrl.navigateForward('/gym'); }
  goToProfile() { this.navCtrl.navigateForward('/profile'); }

}