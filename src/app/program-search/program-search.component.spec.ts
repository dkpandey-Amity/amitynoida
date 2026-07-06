import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramSearchComponent } from './program-search.component';

describe('ProgramSearchComponent', () => {
  let component: ProgramSearchComponent;
  let fixture: ComponentFixture<ProgramSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
