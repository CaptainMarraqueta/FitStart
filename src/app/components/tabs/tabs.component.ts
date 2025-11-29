import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular'; // <- importar Ionic
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,  // ✅ ya es standalone
  imports: [IonicModule, CommonModule] // ✅ import necesario
})
export class TabsComponent {
  @Input() activeTab: string = 'inicio';

  constructor(private router: Router) {}

  goTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}