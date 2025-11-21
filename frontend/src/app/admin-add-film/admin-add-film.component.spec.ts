import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddFilmComponent } from './admin-add-film.component';

describe('AdminAddFilmComponent', () => {
  let component: AdminAddFilmComponent;
  let fixture: ComponentFixture<AdminAddFilmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddFilmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
