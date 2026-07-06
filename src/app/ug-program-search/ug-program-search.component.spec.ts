import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UgProgramSearchComponent } from './ug-program-search.component';

describe('UgProgramSearchComponent', () => {
  let component: UgProgramSearchComponent;
  let fixture: ComponentFixture<UgProgramSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UgProgramSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UgProgramSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
