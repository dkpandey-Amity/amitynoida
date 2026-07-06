import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeyondAcademicsComponent } from './beyond-academics.component';

describe('BeyondAcademicsComponent', () => {
  let component: BeyondAcademicsComponent;
  let fixture: ComponentFixture<BeyondAcademicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeyondAcademicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeyondAcademicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
