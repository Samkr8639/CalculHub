import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationLoanEmiCalculator } from './education-loan-emi-calculator';

describe('EducationLoanEmiCalculator', () => {
  let component: EducationLoanEmiCalculator;
  let fixture: ComponentFixture<EducationLoanEmiCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationLoanEmiCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationLoanEmiCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
