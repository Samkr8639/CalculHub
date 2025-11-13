import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpfCalculator } from './ppf-calculator';

describe('PpfCalculator', () => {
  let component: PpfCalculator;
  let fixture: ComponentFixture<PpfCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PpfCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpfCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
