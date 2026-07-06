import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgEveningProgramComponent } from './pg-evening-program.component';

describe('PgEveningProgramComponent', () => {
  let component: PgEveningProgramComponent;
  let fixture: ComponentFixture<PgEveningProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgEveningProgramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgEveningProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
