import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedPublicationsComponent } from './selected-publications.component';

describe('SelectedPublicationsComponent', () => {
  let component: SelectedPublicationsComponent;
  let fixture: ComponentFixture<SelectedPublicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedPublicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
