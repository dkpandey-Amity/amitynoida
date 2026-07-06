import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhdProgramSearchComponent } from './phd-program-search.component';

describe('PhdProgramSearchComponent', () => {
  let component: PhdProgramSearchComponent;
  let fixture: ComponentFixture<PhdProgramSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhdProgramSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhdProgramSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
