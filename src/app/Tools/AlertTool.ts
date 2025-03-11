import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, ToastController } from "@ionic/angular";

@Injectable({
  providedIn:'root'
})

export class AlertTool {
    constructor(
      private alertController: AlertController, 
      private toastController: ToastController,
      private router: Router,
      private toastCtrl: ToastController
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
          position: 'top',
          cssClass: "centeredToast",
          color: 'light'
        }).then(res => res.present());
      }

      async presentToastWithRedirect(message: string, route: string) {
        const toast = await this.toastCtrl.create({
          message: message,
          duration: 8000,
          position: 'top',
          buttons: [
            {
              text: 'IR 🔥', // Más llamativo con emoji
              role: 'cancel',
              // cssClass: 'toast-button-highlight', // Aplicamos una clase personalizada
              handler: () => {
                this.router.navigate([route]);
              }
            }
          ]
        });
        toast.present();
      }
    }
