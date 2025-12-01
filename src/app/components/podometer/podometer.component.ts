import { Component, OnInit, OnDestroy } from '@angular/core';
import { PodometerService } from '../../services/podometer.service';
import { Subscription } from 'rxjs';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-podometer',
  templateUrl: './podometer.component.html',
  styleUrls: ['./podometer.component.scss'],
})
export class PodometerComponent implements OnInit, OnDestroy {

  pasos = 0;
  private sub!: Subscription;

  constructor(private podometerService: PodometerService) {}

  async ngOnInit() {
    // Iniciar podómetro solo si no está ya activo
    await this.podometerService.init();

    // Recibir actualizaciones
    this.sub = this.podometerService.steps$.subscribe(val => {
      this.pasos = val;
    });

    // Reanudar servicio si la app vuelve del background
    App.addListener('resume', async () => {
      console.log('App resume → reactivando podómetro');
      await this.podometerService.init();
    });
  }

  ngOnDestroy() {
    // ⚠️ NO detener el podómetro
    // Si llamas this.podometerService.stop() → NO funciona en background

    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
