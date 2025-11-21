import { TestBed } from '@angular/core/testing';

import { ReziserDetaljiService } from './reziser-detalji.service';

describe('ReziserDetaljiService', () => {
  let service: ReziserDetaljiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReziserDetaljiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
