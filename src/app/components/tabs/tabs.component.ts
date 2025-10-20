import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone:false,
})
export class TabsComponent {
  // Esta variable recibirá el nombre de la pestaña activa desde la página padre
  @Input() activeTab: string = 'inicio';

  constructor(private router: Router) { }

  // Función para navegar a la página que se le indique
  goTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

}
