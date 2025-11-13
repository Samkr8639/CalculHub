import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mathematical } from './mathematical';

describe('Mathematical', () => {
  let component: Mathematical;
  let fixture: ComponentFixture<Mathematical>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mathematical]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mathematical);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
