import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentClubsComponent } from './student-clubs.component';

describe('StudentClubsComponent', () => {
  let component: StudentClubsComponent;
  let fixture: ComponentFixture<StudentClubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentClubsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentClubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
