import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgInternationalProgrammesDetailsComponent } from './pg-international-programmes-details.component';

describe('PgInternationalProgrammesDetailsComponent', () => {
  let component: PgInternationalProgrammesDetailsComponent;
  let fixture: ComponentFixture<PgInternationalProgrammesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgInternationalProgrammesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgInternationalProgrammesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
