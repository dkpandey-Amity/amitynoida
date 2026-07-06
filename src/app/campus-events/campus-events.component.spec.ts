import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusEventsComponent } from './campus-events.component';

describe('CampusEventsComponent', () => {
  let component: CampusEventsComponent;
  let fixture: ComponentFixture<CampusEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampusEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampusEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
