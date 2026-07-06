import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryUgProgramsDetailsComponent } from './industry-ug-programs-details.component';

describe('IndustryUgProgramsDetailsComponent', () => {
  let component: IndustryUgProgramsDetailsComponent;
  let fixture: ComponentFixture<IndustryUgProgramsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndustryUgProgramsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndustryUgProgramsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
