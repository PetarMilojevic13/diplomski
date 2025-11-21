import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditFilmComponent } from './admin-edit-film.component';

describe('AdminEditFilmComponent', () => {
  let component: AdminEditFilmComponent;
  let fixture: ComponentFixture<AdminEditFilmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditFilmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
