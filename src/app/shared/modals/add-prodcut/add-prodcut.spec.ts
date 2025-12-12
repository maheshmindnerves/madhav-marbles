import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProdcut } from './add-prodcut';

describe('AddProdcut', () => {
  let component: AddProdcut;
  let fixture: ComponentFixture<AddProdcut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProdcut]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProdcut);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
