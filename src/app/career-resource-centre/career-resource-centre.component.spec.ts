import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerResourceCentreComponent } from './career-resource-centre.component';

describe('CareerResourceCentreComponent', () => {
  let component: CareerResourceCentreComponent;
  let fixture: ComponentFixture<CareerResourceCentreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerResourceCentreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerResourceCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
