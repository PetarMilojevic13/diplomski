import { TestBed } from '@angular/core/testing';

import { AdminPocetnaService } from './admin-pocetna.service';

describe('AdminPocetnaService', () => {
  let service: AdminPocetnaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPocetnaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
