import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminOrdersPageRoutingModule } from './admin-orders-routing.module';

import { AdminOrdersPage } from './admin-orders.page';
import { CalendarComponent } from 'src/app/Components/calendar/calendar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminOrdersPageRoutingModule
  ],
  declarations: [AdminOrdersPage, CalendarComponent]
})
export class AdminOrdersPageModule {}
