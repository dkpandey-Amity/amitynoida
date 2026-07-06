import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SangathanComponent } from './sangathan.component';

describe('SangathanComponent', () => {
  let component: SangathanComponent;
  let fixture: ComponentFixture<SangathanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SangathanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SangathanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
