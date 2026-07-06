import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ug3ContinentDetailsComponent } from './ug-3-continent-details.component';

describe('Ug3ContinentDetailsComponent', () => {
  let component: Ug3ContinentDetailsComponent;
  let fixture: ComponentFixture<Ug3ContinentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ug3ContinentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ug3ContinentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
