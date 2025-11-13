import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikeLoanEmiCalculator } from './bike-loan-emi-calculator';

describe('BikeLoanEmiCalculator', () => {
  let component: BikeLoanEmiCalculator;
  let fixture: ComponentFixture<BikeLoanEmiCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikeLoanEmiCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikeLoanEmiCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
