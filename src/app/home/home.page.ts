import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
  ) {}

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
