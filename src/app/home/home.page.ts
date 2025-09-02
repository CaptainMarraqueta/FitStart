import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {

  constructor(
    private navCtrl: NavController,
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
