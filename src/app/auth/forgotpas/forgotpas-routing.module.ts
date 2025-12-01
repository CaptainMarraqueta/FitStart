import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotpasPage } from './forgotpas.page';

const routes: Routes = [
  {
    path: '',
    component: ForgotpasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotpasPageRoutingModule {}
