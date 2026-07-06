import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TieUpsComponent } from './tie-ups.component';

describe('TieUpsComponent', () => {
  let component: TieUpsComponent;
  let fixture: ComponentFixture<TieUpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TieUpsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TieUpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
