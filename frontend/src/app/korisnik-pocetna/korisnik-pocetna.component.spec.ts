import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KorisnikPocetnaComponent } from './korisnik-pocetna.component';

describe('KorisnikPocetnaComponent', () => {
  let component: KorisnikPocetnaComponent;
  let fixture: ComponentFixture<KorisnikPocetnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KorisnikPocetnaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KorisnikPocetnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
