import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPage } from './register.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  // Es crucial añadir el schema aquí para que se reconozca en esta ruta
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterPageRoutingModule {}
