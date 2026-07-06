import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UgProgramsDisciplineComponent } from './ug-programs-discipline.component';

describe('UgProgramsDisciplineComponent', () => {
  let component: UgProgramsDisciplineComponent;
  let fixture: ComponentFixture<UgProgramsDisciplineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UgProgramsDisciplineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UgProgramsDisciplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
