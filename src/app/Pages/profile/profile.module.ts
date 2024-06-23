import { ChangePhoneModalComponent } from './../../Components/change-phone-modal/change-phone-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { AddLocationModalComponent } from 'src/app/Components/add-location-modal/add-location-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ProfilePage, AddLocationModalComponent, ChangePhoneModalComponent]
})
export class ProfilePageModule {}
