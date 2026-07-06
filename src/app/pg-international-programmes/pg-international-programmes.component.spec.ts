import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgInternationalProgrammesComponent } from './pg-international-programmes.component';

describe('PgInternationalProgrammesComponent', () => {
  let component: PgInternationalProgrammesComponent;
  let fixture: ComponentFixture<PgInternationalProgrammesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgInternationalProgrammesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgInternationalProgrammesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
