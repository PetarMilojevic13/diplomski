import { TestBed } from '@angular/core/testing';

import { LoginKorisnikServiceService } from './login-korisnik-service.service';

describe('LoginKorisnikServiceService', () => {
  let service: LoginKorisnikServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginKorisnikServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
