import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlumacDetaljiComponent } from './glumac-detalji.component';

describe('GlumacDetaljiComponent', () => {
  let component: GlumacDetaljiComponent;
  let fixture: ComponentFixture<GlumacDetaljiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlumacDetaljiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlumacDetaljiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
