import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmimunComponent } from './amimun.component';

describe('AmimunComponent', () => {
  let component: AmimunComponent;
  let fixture: ComponentFixture<AmimunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmimunComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmimunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
