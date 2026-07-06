import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegratedProgramsDetailsComponent } from './integrated-programs-details.component';

describe('IntegratedProgramsDetailsComponent', () => {
  let component: IntegratedProgramsDetailsComponent;
  let fixture: ComponentFixture<IntegratedProgramsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegratedProgramsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegratedProgramsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
