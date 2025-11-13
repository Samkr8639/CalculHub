import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdCalculator } from './fd-calculator';

describe('FdCalculator', () => {
  let component: FdCalculator;
  let fixture: ComponentFixture<FdCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FdCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FdCalculator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
