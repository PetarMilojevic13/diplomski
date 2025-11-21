import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginKorisnikComponent } from './login-korisnik.component';

describe('LoginKorisnikComponent', () => {
  let component: LoginKorisnikComponent;
  let fixture: ComponentFixture<LoginKorisnikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginKorisnikComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginKorisnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
