import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmityUniversityLogoComponent } from './amity-university-logo.component';

describe('AmityUniversityLogoComponent', () => {
  let component: AmityUniversityLogoComponent;
  let fixture: ComponentFixture<AmityUniversityLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmityUniversityLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmityUniversityLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
