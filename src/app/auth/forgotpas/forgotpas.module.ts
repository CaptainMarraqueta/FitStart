import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotpasPageRoutingModule } from './forgotpas-routing.module';

import { ForgotpasPage } from './forgotpas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotpasPageRoutingModule
  ],
  declarations: [ForgotpasPage]
})
export class ForgotpasPageModule {}
