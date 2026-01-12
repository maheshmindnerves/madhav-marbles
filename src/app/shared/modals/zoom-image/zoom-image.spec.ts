import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomImage } from './zoom-image';

describe('ZoomImage', () => {
  let component: ZoomImage;
  let fixture: ComponentFixture<ZoomImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoomImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoomImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
