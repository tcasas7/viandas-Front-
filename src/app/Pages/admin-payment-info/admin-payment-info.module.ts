import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPaymentInfoPageRoutingModule } from './admin-payment-info-routing.module';

import { AdminPaymentInfoPage } from './admin-payment-info.page';
import { SavePaymentInfoModalComponent } from 'src/app/Components/save-payment-info-modal/save-payment-info-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPaymentInfoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AdminPaymentInfoPage, SavePaymentInfoModalComponent]
})
export class AdminPaymentInfoPageModule {}
