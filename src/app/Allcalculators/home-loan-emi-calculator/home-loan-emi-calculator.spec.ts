import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoanEmiCalculator } from './home-loan-emi-calculator';

describe('HomeLoanEmiCalculator', () => {
  let component: HomeLoanEmiCalculator;
  let fixture: ComponentFixture<HomeLoanEmiCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLoanEmiCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeLoanEmiCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
