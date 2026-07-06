import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerTestComponent } from './career-test.component';

describe('CareerTestComponent', () => {
  let component: CareerTestComponent;
  let fixture: ComponentFixture<CareerTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
