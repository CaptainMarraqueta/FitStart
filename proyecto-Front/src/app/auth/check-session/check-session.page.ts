import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-check-session',
  templateUrl: './check-session.page.html',
  styleUrls: ['./check-session.page.scss'],
  standalone: false
})
export class CheckSessionPage implements OnInit {

  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    setTimeout(() => {
      if (this.authService.estaLogueado()) {
        this.navCtrl.navigateRoot('/home'); // si hay sesión
      } else {
        this.navCtrl.navigateRoot('/login'); // si no hay sesión
      }
    }, 1000); // pequeño delay tipo splash
  }
}
