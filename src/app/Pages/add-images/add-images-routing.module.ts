import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddImagesPage } from './add-images.page';

const routes: Routes = [
  {
    path: '',
    component: AddImagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddImagesPageRoutingModule {}
