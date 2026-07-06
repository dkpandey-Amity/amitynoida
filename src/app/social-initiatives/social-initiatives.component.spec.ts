import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialInitiativesComponent } from './social-initiatives.component';

describe('SocialInitiativesComponent', () => {
  let component: SocialInitiativesComponent;
  let fixture: ComponentFixture<SocialInitiativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialInitiativesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
