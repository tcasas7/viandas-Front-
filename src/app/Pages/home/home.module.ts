import { ChangePasswordModalComponent } from './../../Components/change-password-modal/change-password-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { LoginModalComponent } from 'src/app/Components/login-modal/login-modal.component';
import { RegisterModalComponent } from 'src/app/Components/register-modal/register-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [HomePage, LoginModalComponent, RegisterModalComponent, ChangePasswordModalComponent]
})
export class HomePageModule {}
