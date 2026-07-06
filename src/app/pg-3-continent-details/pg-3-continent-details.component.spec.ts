import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pg3ContinentDetailsComponent } from './pg-3-continent-details.component';

describe('Pg3ContinentDetailsComponent', () => {
  let component: Pg3ContinentDetailsComponent;
  let fixture: ComponentFixture<Pg3ContinentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pg3ContinentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pg3ContinentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
