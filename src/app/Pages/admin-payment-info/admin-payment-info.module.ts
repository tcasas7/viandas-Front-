import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPaymentInfoPageRoutingModule } from './admin-payment-info-routing.module';

import { AdminPaymentInfoPage } from './admin-payment-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPaymentInfoPageRoutingModule
  ],
  declarations: [AdminPaymentInfoPage]
})
export class AdminPaymentInfoPageModule {}
