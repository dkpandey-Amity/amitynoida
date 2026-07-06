import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInnovationComponent } from './student-innovation.component';

describe('StudentInnovationComponent', () => {
  let component: StudentInnovationComponent;
  let fixture: ComponentFixture<StudentInnovationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentInnovationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentInnovationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
