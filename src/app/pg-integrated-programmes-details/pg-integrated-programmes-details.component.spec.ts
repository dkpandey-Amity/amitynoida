import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgIntegratedProgrammesDetailsComponent } from './pg-integrated-programmes-details.component';

describe('PgIntegratedProgrammesDetailsComponent', () => {
  let component: PgIntegratedProgrammesDetailsComponent;
  let fixture: ComponentFixture<PgIntegratedProgrammesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgIntegratedProgrammesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgIntegratedProgrammesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
