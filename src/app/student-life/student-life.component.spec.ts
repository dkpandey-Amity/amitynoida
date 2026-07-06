import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLifeComponent } from './student-life.component';

describe('StudentLifeComponent', () => {
  let component: StudentLifeComponent;
  let fixture: ComponentFixture<StudentLifeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentLifeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentLifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
