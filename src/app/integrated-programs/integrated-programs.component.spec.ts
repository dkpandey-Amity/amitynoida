import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegratedProgramsComponent } from './integrated-programs.component';

describe('IntegratedProgramsComponent', () => {
  let component: IntegratedProgramsComponent;
  let fixture: ComponentFixture<IntegratedProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegratedProgramsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegratedProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
