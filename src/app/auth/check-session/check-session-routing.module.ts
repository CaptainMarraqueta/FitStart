import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckSessionPage } from './check-session.page';

const routes: Routes = [
  {
    path: '',
    component: CheckSessionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckSessionPageRoutingModule {}
