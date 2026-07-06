import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgIntegratedProgrammesComponent } from './pg-integrated-programmes.component';

describe('PgIntegratedProgrammesComponent', () => {
  let component: PgIntegratedProgrammesComponent;
  let fixture: ComponentFixture<PgIntegratedProgrammesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgIntegratedProgrammesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgIntegratedProgrammesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
