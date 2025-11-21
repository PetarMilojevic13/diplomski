import { TestBed } from '@angular/core/testing';

import { KorisnikDetaljnoService } from './korisnik-detaljno.service';

describe('KorisnikDetaljnoService', () => {
  let service: KorisnikDetaljnoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KorisnikDetaljnoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
