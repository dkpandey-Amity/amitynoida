import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyAbroadProgramComponent } from './study-abroad-program.component';

describe('StudyAbroadProgramComponent', () => {
  let component: StudyAbroadProgramComponent;
  let fixture: ComponentFixture<StudyAbroadProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyAbroadProgramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyAbroadProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
