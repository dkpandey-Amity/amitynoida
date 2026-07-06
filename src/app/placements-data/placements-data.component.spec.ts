import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementsDataComponent } from './placements-data.component';

describe('PlacementsDataComponent', () => {
  let component: PlacementsDataComponent;
  let fixture: ComponentFixture<PlacementsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacementsDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacementsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
