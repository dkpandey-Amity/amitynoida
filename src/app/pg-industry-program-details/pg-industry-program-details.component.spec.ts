import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgIndustryProgramDetailsComponent } from './pg-industry-program-details.component';

describe('PgIndustryProgramDetailsComponent', () => {
  let component: PgIndustryProgramDetailsComponent;
  let fixture: ComponentFixture<PgIndustryProgramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgIndustryProgramDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgIndustryProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
