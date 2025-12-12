import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProdcut } from './edit-prodcut';

describe('EditProdcut', () => {
  let component: EditProdcut;
  let fixture: ComponentFixture<EditProdcut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProdcut]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProdcut);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
