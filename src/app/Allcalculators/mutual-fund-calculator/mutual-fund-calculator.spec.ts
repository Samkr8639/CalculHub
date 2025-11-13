import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualFundCalculator } from './mutual-fund-calculator';

describe('MutualFundCalculator', () => {
  let component: MutualFundCalculator;
  let fixture: ComponentFixture<MutualFundCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MutualFundCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MutualFundCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
