import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundInterestCalculator } from './compound-interest-calculator';

describe('CompoundInterestCalculator', () => {
  let component: CompoundInterestCalculator;
  let fixture: ComponentFixture<CompoundInterestCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompoundInterestCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompoundInterestCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
