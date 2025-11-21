import { TestBed } from '@angular/core/testing';

import { KorisnikPocetnaService } from './korisnik-pocetna.service';

describe('KorisnikPocetnaService', () => {
  let service: KorisnikPocetnaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KorisnikPocetnaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
