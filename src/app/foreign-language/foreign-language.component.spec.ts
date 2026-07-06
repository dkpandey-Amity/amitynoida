import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeignLanguageComponent } from './foreign-language.component';

describe('ForeignLanguageComponent', () => {
  let component: ForeignLanguageComponent;
  let fixture: ComponentFixture<ForeignLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForeignLanguageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForeignLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
