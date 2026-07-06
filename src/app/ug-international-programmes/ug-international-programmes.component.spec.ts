import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UgInternationalProgrammesComponent } from './ug-international-programmes.component';

describe('UgInternationalProgrammesComponent', () => {
  let component: UgInternationalProgrammesComponent;
  let fixture: ComponentFixture<UgInternationalProgrammesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UgInternationalProgrammesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UgInternationalProgrammesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
