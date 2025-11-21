import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterKorisnikComponent } from './register-korisnik.component';

describe('RegisterKorisnikComponent', () => {
  let component: RegisterKorisnikComponent;
  let fixture: ComponentFixture<RegisterKorisnikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterKorisnikComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterKorisnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
