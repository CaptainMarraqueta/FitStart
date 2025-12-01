import { TestBed } from '@angular/core/testing';

import { PodometerService } from './podometer.service';

describe('PodometerService', () => {
  let service: PodometerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PodometerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
