import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPaymentInfoPage } from './admin-payment-info.page';

describe('AdminPaymentInfoPage', () => {
  let component: AdminPaymentInfoPage;
  let fixture: ComponentFixture<AdminPaymentInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPaymentInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
