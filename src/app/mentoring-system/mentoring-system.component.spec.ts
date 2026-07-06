import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentoringSystemComponent } from './mentoring-system.component';

describe('MentoringSystemComponent', () => {
  let component: MentoringSystemComponent;
  let fixture: ComponentFixture<MentoringSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentoringSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentoringSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
