import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchCentresComponent } from './research-centres.component';

describe('ResearchCentresComponent', () => {
  let component: ResearchCentresComponent;
  let fixture: ComponentFixture<ResearchCentresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResearchCentresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResearchCentresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
