import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMenuPage } from './add-menu.page';

describe('AddMenuPage', () => {
  let component: AddMenuPage;
  let fixture: ComponentFixture<AddMenuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
