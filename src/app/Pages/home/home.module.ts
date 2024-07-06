import { ChangePasswordModalComponent } from './../../Components/change-password-modal/change-password-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { LoginModalComponent } from 'src/app/Components/login-modal/login-modal.component';
import { RegisterModalComponent } from 'src/app/Components/register-modal/register-modal.component';
import { OrderResumeComponent } from '../../Components/order-resume/order-resume.component';
import { AddDetailsModalComponent } from 'src/app/Components/add-details-modal/add-details-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    HomePage,
    LoginModalComponent,
    RegisterModalComponent,
    ChangePasswordModalComponent,
    OrderResumeComponent,
    AddDetailsModalComponent]
})
export class HomePageModule {}
