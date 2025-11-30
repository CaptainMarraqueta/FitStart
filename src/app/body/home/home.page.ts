import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})

export class HomePage {
  fechaHoy: string = '';
  metaProgreso: number = 0.75; // 75%
  calorias: number = 1840;
  caloriasMeta: number = 2500;
  pasos: number = 8432;
  

  constructor(private router: Router) {
    this.fechaHoy = this.getFechaHoy();
  }

  getFechaHoy(): string {
    const fecha = new Date();
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    });
  }

  goTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
