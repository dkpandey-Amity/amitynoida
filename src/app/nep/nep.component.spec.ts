import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NepComponent } from './nep.component';

describe('NepComponent', () => {
  let component: NepComponent;
  let fixture: ComponentFixture<NepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
