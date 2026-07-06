import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgEveningProgramDetailsComponent } from './pg-evening-program-details.component';

describe('PgEveningProgramDetailsComponent', () => {
  let component: PgEveningProgramDetailsComponent;
  let fixture: ComponentFixture<PgEveningProgramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgEveningProgramDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgEveningProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
