import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGallery } from './view-gallery';

describe('ViewGallery', () => {
  let component: ViewGallery;
  let fixture: ComponentFixture<ViewGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewGallery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
