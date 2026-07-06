import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexibleCreditSystemComponent } from './flexible-credit-system.component';

describe('FlexibleCreditSystemComponent', () => {
  let component: FlexibleCreditSystemComponent;
  let fixture: ComponentFixture<FlexibleCreditSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlexibleCreditSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlexibleCreditSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
