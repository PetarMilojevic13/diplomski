import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KorisnikDetaljnoComponent } from './korisnik-detaljno.component';

describe('KorisnikDetaljnoComponent', () => {
  let component: KorisnikDetaljnoComponent;
  let fixture: ComponentFixture<KorisnikDetaljnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KorisnikDetaljnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KorisnikDetaljnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
