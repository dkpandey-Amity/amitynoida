import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UgEveningProgramComponent } from './ug-evening-program.component';

describe('UgEveningProgramComponent', () => {
  let component: UgEveningProgramComponent;
  let fixture: ComponentFixture<UgEveningProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UgEveningProgramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UgEveningProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
