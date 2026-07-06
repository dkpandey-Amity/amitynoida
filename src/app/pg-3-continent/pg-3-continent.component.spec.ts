import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pg3ContinentComponent } from './pg-3-continent.component';

describe('Pg3ContinentComponent', () => {
  let component: Pg3ContinentComponent;
  let fixture: ComponentFixture<Pg3ContinentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pg3ContinentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pg3ContinentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
