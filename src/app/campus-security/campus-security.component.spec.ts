import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusSecurityComponent } from './campus-security.component';

describe('CampusSecurityComponent', () => {
  let component: CampusSecurityComponent;
  let fixture: ComponentFixture<CampusSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampusSecurityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampusSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
