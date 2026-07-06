import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgProgramsListComponent } from './pg-programs-list.component';

describe('PgProgramsListComponent', () => {
  let component: PgProgramsListComponent;
  let fixture: ComponentFixture<PgProgramsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgProgramsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgProgramsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
