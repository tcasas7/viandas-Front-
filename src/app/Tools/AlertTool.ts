import { Injectable } from "@angular/core";
import { AlertController, ToastController } from "@ionic/angular";

@Injectable({
  providedIn:'root'
})

export class AlertTool {
    constructor(
      private alertController: AlertController, 
      private toastController: ToastController
    ){}

    async presentAlert(message: string, subHeader: string, header: string) {
        const alert = await this.alertController.create({
          header: header,
          subHeader: subHeader,
          message: message,
          buttons: ['OK'],
          cssClass: "alertMessage"
        });

        await alert.present();
      }

      async presentToast(message: string) {
        await this.toastController.create({
          message: message,
          duration: 5000,
          position: 'bottom',
          cssClass: "centeredToast",
          color: 'light'
        }).then(res => res.present());
      }
}