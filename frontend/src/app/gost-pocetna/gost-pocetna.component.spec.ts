import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GostPocetnaComponent } from './gost-pocetna.component';

describe('GostPocetnaComponent', () => {
  let component: GostPocetnaComponent;
  let fixture: ComponentFixture<GostPocetnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GostPocetnaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GostPocetnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
