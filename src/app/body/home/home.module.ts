import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import {TabsComponent} from '../../components/tabs/tabs.component'

import { NgCircleProgressModule } from 'ng-circle-progress';
import { PodometerComponent } from 'src/app/components/podometer/podometer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TabsComponent,
    NgCircleProgressModule.forRoot({}),
  ],
  declarations: [HomePage,PodometerComponent]
})
export class HomePageModule {}
