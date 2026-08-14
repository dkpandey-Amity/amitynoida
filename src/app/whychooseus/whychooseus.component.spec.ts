import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhychooseusComponent } from './whychooseus.component';

describe('WhychooseusComponent', () => {
  let component: WhychooseusComponent;
  let fixture: ComponentFixture<WhychooseusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhychooseusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhychooseusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
