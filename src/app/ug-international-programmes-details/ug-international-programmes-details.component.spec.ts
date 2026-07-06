import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UgInternationalProgrammesDetailsComponent } from './ug-international-programmes-details.component';

describe('UgInternationalProgrammesDetailsComponent', () => {
  let component: UgInternationalProgrammesDetailsComponent;
  let fixture: ComponentFixture<UgInternationalProgrammesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UgInternationalProgrammesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UgInternationalProgrammesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
