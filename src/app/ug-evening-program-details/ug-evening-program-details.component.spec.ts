import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UgEveningProgramDetailsComponent } from './ug-evening-program-details.component';

describe('UgEveningProgramDetailsComponent', () => {
  let component: UgEveningProgramDetailsComponent;
  let fixture: ComponentFixture<UgEveningProgramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UgEveningProgramDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UgEveningProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
