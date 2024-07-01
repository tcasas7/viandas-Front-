import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMenuPageRoutingModule } from './add-menu-routing.module';

import { AddMenuPage } from './add-menu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMenuPageRoutingModule
  ],
  declarations: [AddMenuPage]
})
export class AddMenuPageModule {}
