import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, NavController } from '@ionic/angular';
import { BiometricService } from 'src/app/services/biometric.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false,
})
export class LoginPage {
  credenciales = { email: '', password: '' };
  biometricAvailable = false;
  useBiometric = false;
  readonly BIOMETRIC_SERVER = 'com.tuempresa.tuapp';

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private biometric: BiometricService
  ) {}

  async ionViewWillEnter() {
    this.biometricAvailable = await this.biometric.isAvailable();
  }

  async iniciarSesion() {
    this.authService.login(this.credenciales.email,this.credenciales.password).subscribe({
      next: async (res: any) => {
        // Guardamos credenciales biométricas si el usuario lo desea
        if (this.useBiometric && this.biometricAvailable && Capacitor.isNativePlatform()) {
          await this.biometric.saveCredentials(
            this.credenciales.email,
            this.credenciales.password,
            this.BIOMETRIC_SERVER
          );
        }

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

  async loginConBiometria() {
    if (!this.biometricAvailable) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Biometría no disponible en este dispositivo',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const verified = await this.biometric.verifyIdentity();
    if (!verified) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Autenticación biométrica fallida',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const creds = await this.biometric.getCredentials(this.BIOMETRIC_SERVER);
    if (!creds) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'No se encontraron credenciales guardadas',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Relogueamos usando AuthService
    this.credenciales.email = creds.username;
    this.credenciales.password = creds.password;
    this.iniciarSesion();
  }

  irARegistro() {
    this.navCtrl.navigateForward('/register');
  }
}
