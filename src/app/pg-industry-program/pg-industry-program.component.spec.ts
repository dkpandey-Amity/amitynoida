import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgIndustryProgramComponent } from './pg-industry-program.component';

describe('PgIndustryProgramComponent', () => {
  let component: PgIndustryProgramComponent;
  let fixture: ComponentFixture<PgIndustryProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgIndustryProgramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgIndustryProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
