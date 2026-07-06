import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhdDisciplineListComponent } from './phd-discipline-list.component';

describe('PhdDisciplineListComponent', () => {
  let component: PhdDisciplineListComponent;
  let fixture: ComponentFixture<PhdDisciplineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhdDisciplineListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhdDisciplineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
