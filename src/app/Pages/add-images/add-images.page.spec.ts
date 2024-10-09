import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddImagesPage } from './add-images.page';

describe('AddImagesPage', () => {
  let component: AddImagesPage;
  let fixture: ComponentFixture<AddImagesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddImagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
