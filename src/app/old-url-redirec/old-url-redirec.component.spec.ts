import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldUrlRedirecComponent } from './old-url-redirec.component';

describe('OldUrlRedirecComponent', () => {
  let component: OldUrlRedirecComponent;
  let fixture: ComponentFixture<OldUrlRedirecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OldUrlRedirecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldUrlRedirecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
