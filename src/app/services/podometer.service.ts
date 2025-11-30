import { Injectable, NgZone } from '@angular/core';
import { CapacitorPedometer } from '@capgo/capacitor-pedometer';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PodometerService {
  // Observable para exponer los pasos
  private _steps = new BehaviorSubject<number>(0);
  public steps$ = this._steps.asObservable();

  constructor(private zone: NgZone) {}

  // Inicializar el podómetro
  async init() {
    const avail = await CapacitorPedometer.isAvailable();

    if (avail.stepCounting) {
      await CapacitorPedometer.requestPermissions();
      CapacitorPedometer.startMeasurementUpdates();

      CapacitorPedometer.addListener('measurement', (data: any) => {
        // NgZone para actualizar Angular correctamente
        this.zone.run(() => {
          this._steps.next(data.numberOfSteps);
        });
      });
    } else {
      console.error('Podómetro no disponible en este dispositivo');
    }
  }

  // Detener el podómetro
  stop() {
    CapacitorPedometer.stopMeasurementUpdates();
    CapacitorPedometer.removeAllListeners();
  }
}
