import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpecification } from './add-specification';

describe('AddSpecification', () => {
  let component: AddSpecification;
  let fixture: ComponentFixture<AddSpecification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSpecification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSpecification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
