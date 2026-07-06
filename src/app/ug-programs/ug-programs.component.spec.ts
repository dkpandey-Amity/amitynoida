import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UgProgramsComponent } from './ug-programs.component';

describe('UgProgramsComponent', () => {
  let component: UgProgramsComponent;
  let fixture: ComponentFixture<UgProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UgProgramsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UgProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
