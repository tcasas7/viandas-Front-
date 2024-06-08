import { Router } from '@angular/router';
import { Injectable } from "@angular/core";
import { AlertController, ToastController } from "@ionic/angular";

@Injectable({
  providedIn:'root'
})

export class AlertTool {
    constructor(
      private alertController: AlertController, 
      private toastController: ToastController,
      private router: Router){}

    async presentAlert(message: string, subHeader: string, header: string) {
        const alert = await this.alertController.create({
          header: header,
          subHeader: subHeader,
          message: message,
          buttons: ['OK'],
        });

        await alert.present();
      }

      async presentToast(message: string) {
        await this.toastController.create({
          message: message,
          duration: 2000,
          position: 'bottom',
          cssClass: "centeredToast",
        }).then(res => res.present());
      }
}