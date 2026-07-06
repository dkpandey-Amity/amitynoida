import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgProgramSearchComponent } from './pg-program-search.component';

describe('PgProgramSearchComponent', () => {
  let component: PgProgramSearchComponent;
  let fixture: ComponentFixture<PgProgramSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgProgramSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgProgramSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
