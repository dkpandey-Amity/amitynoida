import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatentsComponent } from './patents.component';

describe('PatentsComponent', () => {
  let component: PatentsComponent;
  let fixture: ComponentFixture<PatentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
