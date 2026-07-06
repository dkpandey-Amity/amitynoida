import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryUGProgramsComponent } from './industry-ug-programs.component';

describe('IndustryUGProgramsComponent', () => {
  let component: IndustryUGProgramsComponent;
  let fixture: ComponentFixture<IndustryUGProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndustryUGProgramsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndustryUGProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
