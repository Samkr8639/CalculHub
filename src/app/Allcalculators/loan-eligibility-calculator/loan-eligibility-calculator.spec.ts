import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanEligibilityCalculator } from './loan-eligibility-calculator';

describe('LoanEligibilityCalculator', () => {
  let component: LoanEligibilityCalculator;
  let fixture: ComponentFixture<LoanEligibilityCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanEligibilityCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanEligibilityCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
