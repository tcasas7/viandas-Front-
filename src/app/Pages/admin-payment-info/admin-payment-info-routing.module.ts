import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPaymentInfoPage } from './admin-payment-info.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPaymentInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPaymentInfoPageRoutingModule {}
