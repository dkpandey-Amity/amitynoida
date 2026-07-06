import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehavioralScienceComponent } from './behavioral-science.component';

describe('BehavioralScienceComponent', () => {
  let component: BehavioralScienceComponent;
  let fixture: ComponentFixture<BehavioralScienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BehavioralScienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BehavioralScienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
