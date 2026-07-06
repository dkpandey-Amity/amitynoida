import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkAmityComponent } from './work-amity.component';

describe('WorkAmityComponent', () => {
  let component: WorkAmityComponent;
  let fixture: ComponentFixture<WorkAmityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkAmityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkAmityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
