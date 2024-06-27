import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { RoleModalComponent } from 'src/app/Components/role-modal/role-modal.component';
import { PinpointMapComponent } from 'src/app/Components/pinpoint-map/pinpoint-map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AdminPage, RoleModalComponent, PinpointMapComponent]
})
export class AdminPageModule {}
