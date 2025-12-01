import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-check-session',
  templateUrl: './check-session.page.html',
  styleUrls: ['./check-session.page.scss'],
})
export class CheckSessionPage implements OnInit {

  constructor(
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // Espera a la autenticación de Firebase
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.navCtrl.navigateRoot('/home');
      } else {
        this.navCtrl.navigateRoot('/login');
      }
    });
  }
}