import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramBrochuresComponent } from './program-brochures.component';

describe('ProgramBrochuresComponent', () => {
  let component: ProgramBrochuresComponent;
  let fixture: ComponentFixture<ProgramBrochuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramBrochuresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramBrochuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
