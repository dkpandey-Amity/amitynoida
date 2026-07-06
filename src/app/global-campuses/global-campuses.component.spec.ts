import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalCampusesComponent } from './global-campuses.component';

describe('GlobalCampusesComponent', () => {
  let component: GlobalCampusesComponent;
  let fixture: ComponentFixture<GlobalCampusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalCampusesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalCampusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
