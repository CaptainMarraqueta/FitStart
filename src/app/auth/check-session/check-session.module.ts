import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckSessionPageRoutingModule } from './check-session-routing.module';

import { CheckSessionPage } from './check-session.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckSessionPageRoutingModule
  ],
  declarations: [CheckSessionPage]
})
export class CheckSessionPageModule {}
