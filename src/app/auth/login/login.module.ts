// src/app/auth/login/login.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Importa esto (si usarás ngModel)

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // <-- Añade esto (si usarás ngModel)
    IonicModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage] // <-- Asegúrate de que LoginPage esté aquí
})
export class LoginPageModule {}
