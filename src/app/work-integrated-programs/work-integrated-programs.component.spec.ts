import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkIntegratedProgramsComponent } from './work-integrated-programs.component';

describe('WorkIntegratedProgramsComponent', () => {
  let component: WorkIntegratedProgramsComponent;
  let fixture: ComponentFixture<WorkIntegratedProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkIntegratedProgramsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkIntegratedProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
