import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsoredProjectsComponent } from './sponsored-projects.component';

describe('SponsoredProjectsComponent', () => {
  let component: SponsoredProjectsComponent;
  let fixture: ComponentFixture<SponsoredProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SponsoredProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SponsoredProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
