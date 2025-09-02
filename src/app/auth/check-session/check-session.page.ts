import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-check-session',
  templateUrl: './check-session.page.html',
  styleUrls: ['./check-session.page.scss'],
  standalone: false
})
export class CheckSessionPage implements OnInit {

  constructor(
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    setTimeout(()=>{
        this.navCtrl.navigateRoot('/login');
    }, 1000);
  }

}
