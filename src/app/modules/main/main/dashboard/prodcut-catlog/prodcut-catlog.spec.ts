import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdcutCatlog } from './prodcut-catlog';

describe('ProdcutCatlog', () => {
  let component: ProdcutCatlog;
  let fixture: ComponentFixture<ProdcutCatlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdcutCatlog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdcutCatlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
