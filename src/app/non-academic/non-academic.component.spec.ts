import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonAcademicComponent } from './non-academic.component';

describe('NonAcademicComponent', () => {
  let component: NonAcademicComponent;
  let fixture: ComponentFixture<NonAcademicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonAcademicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonAcademicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
