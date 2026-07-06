import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgProgramsComponent } from './pg-programs.component';

describe('PgProgramsComponent', () => {
  let component: PgProgramsComponent;
  let fixture: ComponentFixture<PgProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgProgramsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
