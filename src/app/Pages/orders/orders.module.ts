import { SupportButtonComponent } from './../../Components/support-button/support-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import { PaymentInfoComponent } from 'src/app/Components/payment-info/payment-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule
  ],
  declarations: [OrdersPage, PaymentInfoComponent, SupportButtonComponent]
})
export class OrdersPageModule {}
