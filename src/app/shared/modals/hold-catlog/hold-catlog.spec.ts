import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldCatlog } from './hold-catlog';

describe('HoldCatlog', () => {
  let component: HoldCatlog;
  let fixture: ComponentFixture<HoldCatlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoldCatlog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoldCatlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
