import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhdCourseDetailsComponent } from './phd-course-details.component';

describe('PhdCourseDetailsComponent', () => {
  let component: PhdCourseDetailsComponent;
  let fixture: ComponentFixture<PhdCourseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhdCourseDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhdCourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
