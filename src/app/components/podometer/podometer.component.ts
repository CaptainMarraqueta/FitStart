import { Component, OnInit,OnDestroy } from '@angular/core';
import { PodometerService } from '../../services/podometer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-podometer',
  templateUrl: './podometer.component.html',
  styleUrls: ['./podometer.component.scss'],
})
export class PodometerComponent  implements OnInit,OnDestroy {
  pasos = 0;
  private sub!: Subscription;

  constructor(private podometerService: PodometerService) {}

  async ngOnInit() {
    await this.podometerService.init();
    this.sub = this.podometerService.steps$.subscribe((val) => {
      this.pasos = val;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.podometerService.stop();
  }
}
