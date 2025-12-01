import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-forgotpas',
  templateUrl: './forgotpas.page.html',
  styleUrls: ['./forgotpas.page.scss'],
})
export class ForgotpasPage {
  email: string = '';

  constructor(private toastCtrl: ToastController) {}

  async resetPassword() {
    if (!this.email) {
      await this.showToast('Por favor, ingresa tu correo');
      return;
    }

    const token = Math.random().toString(36).substr(2); // token simple
    const templateParams = {
      to_email: this.email,
      reset_link: `https://tuapp.com/reset-password?token=${token}`
    };

    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_PUBLIC_KEY')
      .then(() => this.showToast('Correo enviado. Revisa tu bandeja de entrada.'))
      .catch(err => {
        console.error(err);
        this.showToast('Ocurrió un error, intenta nuevamente.');
      });
  }

  // 🔹 Cambiado a public para poder testearlo
  public async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }
}

