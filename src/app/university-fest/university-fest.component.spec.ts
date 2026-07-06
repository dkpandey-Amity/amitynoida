import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversityFestComponent } from './university-fest.component';

describe('UniversityFestComponent', () => {
  let component: UniversityFestComponent;
  let fixture: ComponentFixture<UniversityFestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversityFestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversityFestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
