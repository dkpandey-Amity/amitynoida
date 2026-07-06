import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhdCourseListComponent } from './phd-course-list.component';

describe('PhdCourseListComponent', () => {
  let component: PhdCourseListComponent;
  let fixture: ComponentFixture<PhdCourseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhdCourseListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhdCourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
