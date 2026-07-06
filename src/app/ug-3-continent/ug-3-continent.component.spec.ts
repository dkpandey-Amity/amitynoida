import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ug3ContinentComponent } from './ug-3-continent.component';

describe('Ug3ContinentComponent', () => {
  let component: Ug3ContinentComponent;
  let fixture: ComponentFixture<Ug3ContinentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ug3ContinentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ug3ContinentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
