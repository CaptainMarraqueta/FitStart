import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  credenciales = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  async iniciarSesion() {
    this.authService.login(this.credenciales).subscribe({
      next: async (res: any) => {
        this.authService.guardarToken(res.token);

        const alert = await this.alertCtrl.create({
          header: 'Bienvenido',
          message: `Hola ${res.usuario.nombre}, inicio de sesión exitoso.`,
          buttons: ['OK']
        });
        await alert.present();

        this.navCtrl.navigateRoot('/home');
      },
      error: async err => {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err.error?.error || 'Credenciales incorrectas',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  irARegistro() {
    this.navCtrl.navigateForward('/register');
  }

  
}
