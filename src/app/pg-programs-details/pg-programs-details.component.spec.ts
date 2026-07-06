import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgProgramsDetailsComponent } from './pg-programs-details.component';

describe('PgProgramsDetailsComponent', () => {
  let component: PgProgramsDetailsComponent;
  let fixture: ComponentFixture<PgProgramsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgProgramsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgProgramsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
