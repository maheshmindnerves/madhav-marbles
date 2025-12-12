import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionProduct } from './description-product';

describe('DescriptionProduct', () => {
  let component: DescriptionProduct;
  let fixture: ComponentFixture<DescriptionProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescriptionProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
