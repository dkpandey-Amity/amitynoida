import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProgramsNoidaComponent } from './all-programs-noida.component';

describe('AllProgramsNoidaComponent', () => {
  let component: AllProgramsNoidaComponent;
  let fixture: ComponentFixture<AllProgramsNoidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProgramsNoidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProgramsNoidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
