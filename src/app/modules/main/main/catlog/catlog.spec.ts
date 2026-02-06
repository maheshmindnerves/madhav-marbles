import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Catlog } from './catlog';

describe('Catlog', () => {
  let component: Catlog;
  let fixture: ComponentFixture<Catlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catlog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Catlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
