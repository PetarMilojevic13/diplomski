import { TestBed } from '@angular/core/testing';

import { GostPocetnaService } from './gost-pocetna.service';

describe('GostPocetnaService', () => {
  let service: GostPocetnaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GostPocetnaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
