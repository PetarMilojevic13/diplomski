import { TestBed } from '@angular/core/testing';

import { GlumacDetaljiService } from './glumac-detalji.service';

describe('GlumacDetaljiService', () => {
  let service: GlumacDetaljiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlumacDetaljiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
