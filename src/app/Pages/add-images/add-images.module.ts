import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router'; 

import { IonicModule } from '@ionic/angular';

import { AddImagesPageRoutingModule } from './add-images-routing.module';

import { AddImagesPage } from './add-images.page';

const routes: Routes = [
  {
    path: '',
    component: AddImagesPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddImagesPageRoutingModule
    
  ],
  declarations: [AddImagesPage]
})
export class AddImagesPageModule {}
