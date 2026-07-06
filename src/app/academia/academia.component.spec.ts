import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademiaComponent } from './academia.component';

describe('AcademiaComponent', () => {
  let component: AcademiaComponent;
  let fixture: ComponentFixture<AcademiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
