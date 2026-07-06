import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncubatorComponent } from './incubator.component';

describe('IncubatorComponent', () => {
  let component: IncubatorComponent;
  let fixture: ComponentFixture<IncubatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncubatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncubatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
