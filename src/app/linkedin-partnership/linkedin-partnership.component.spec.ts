import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinPartnershipComponent } from './linkedin-partnership.component';

describe('LinkedinPartnershipComponent', () => {
  let component: LinkedinPartnershipComponent;
  let fixture: ComponentFixture<LinkedinPartnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedinPartnershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkedinPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
