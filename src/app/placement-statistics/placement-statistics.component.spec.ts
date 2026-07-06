import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementStatisticsComponent } from './placement-statistics.component';

describe('PlacementStatisticsComponent', () => {
  let component: PlacementStatisticsComponent;
  let fixture: ComponentFixture<PlacementStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacementStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
