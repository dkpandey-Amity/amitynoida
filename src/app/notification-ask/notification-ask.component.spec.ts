import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAskComponent } from './notification-ask.component';

describe('NotificationAskComponent', () => {
  let component: NotificationAskComponent;
  let fixture: ComponentFixture<NotificationAskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationAskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationAskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
