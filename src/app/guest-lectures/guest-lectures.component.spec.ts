import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestLecturesComponent } from './guest-lectures.component';

describe('GuestLecturesComponent', () => {
  let component: GuestLecturesComponent;
  let fixture: ComponentFixture<GuestLecturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestLecturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestLecturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
