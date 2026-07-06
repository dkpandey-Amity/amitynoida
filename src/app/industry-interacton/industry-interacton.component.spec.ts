import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryInteractonComponent } from './industry-interacton.component';

describe('IndustryInteractonComponent', () => {
  let component: IndustryInteractonComponent;
  let fixture: ComponentFixture<IndustryInteractonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndustryInteractonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndustryInteractonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
