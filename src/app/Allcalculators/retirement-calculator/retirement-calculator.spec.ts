import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetirementCalculator } from './retirement-calculator';

describe('RetirementCalculator', () => {
  let component: RetirementCalculator;
  let fixture: ComponentFixture<RetirementCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetirementCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetirementCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
