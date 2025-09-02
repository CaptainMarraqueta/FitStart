import { Component } from '@angular/core';
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
  
  field: string="";
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}
  ngOnInit() {
   }
  validateModel(model: any){
    //Recorro modelo 'usuario' revisando las entradas del Object
    for (var [key,value] of Object.entries(model)) {
      //si el value es "" retorno false e indico el nombre del campo que falta
      if (value == "") {
        this.field = key;
        return false;
      }      
    }
    return true;
  }
  
}
