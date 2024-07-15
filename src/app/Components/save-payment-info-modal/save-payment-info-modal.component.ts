import { ResponseObject } from './../../Models/Response/ResponseObj';
import { UsersService } from './../../Services/UsersService/users.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ContactDTO } from 'src/app/Models/ContactDTO';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-save-payment-info-modal',
  templateUrl: './save-payment-info-modal.component.html',
  styleUrls: ['./save-payment-info-modal.component.scss'],
})
export class SavePaymentInfoModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Input() modalType: number = 0;
  @Input() paymentInfo: ContactDTO = new ContactDTO();

  paymentInfoForm: FormGroup;

  finalPhone: string = '';

  preFix: string = '';
  areaCode: string = '';
  phone: string = '';
  wppMessage: string = '';

  response: ResponseObject = new ResponseObject();

  constructor
  (
    private usersService: UsersService,
    private loadingCtrl: LoadingController,
    private alertTool: AlertTool
  )
  {
    this.paymentInfoForm = new FormGroup({
      "preFix": new FormControl(this.preFix),
      "areaCode": new FormControl(this.areaCode),
      "phone": new FormControl(this.phone),
      "cbu": new FormControl(this.paymentInfo.cbu),
      "alias": new FormControl(this.paymentInfo.alias),
      "name": new FormControl(this.paymentInfo.name),
      "wppMessage": new FormControl(this.wppMessage),
      "accountName": new FormControl(this.paymentInfo.accountName)
    })
    this.paymentInfo = new ContactDTO();
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  addPaymentInfo() {
    this.makeLoadingAnimation();
    this.finalPhone = '+' + this.paymentInfoForm.get("preFix")?.value + ' ' + this.paymentInfoForm.get("areaCode")?.value + ' ' + this.paymentInfoForm.get("phone")?.value;
    this.paymentInfo.Id = 0;
    this.paymentInfo.phone = this.finalPhone;
    this.paymentInfo.cbu = this.paymentInfoForm.get("cbu")?.value;
    this.paymentInfo.alias = this.paymentInfoForm.get("alias")?.value;
    this.paymentInfo.name = this.paymentInfoForm.get("name")?.value;
    this.paymentInfo.isActive = false;
    this.paymentInfo.wppMessage = this.paymentInfoForm.get("wppMessage")?.value;
    this.paymentInfo.accountName = this.paymentInfoForm.get("accountName")?.value;

    this.usersService.AddContact(this.paymentInfo).subscribe( response => {
      this.response = response as ResponseObject;
      if(this.response.statusCode === 200) {
        this.alertTool.presentToast("Información de pago agregada");
        this.closeModal();
        this.closeLoader();
      } else {
        this.alertTool.presentToast("Error al agregar información de pago");
        this.closeLoader();
      }
      this.closeLoader();
    }, error => {
      this.alertTool.presentToast(this.response.message);
      this.closeLoader();
    });

  }

  modifyPaymentInfo() {

  }

  makeLoadingAnimation() {
    this.loadingCtrl.getTop().then(hasLoading => {
      if (!hasLoading) {
          this.loadingCtrl.create({
              spinner: 'circular',
              cssClass: "custom-loading"
          }).then(loading => loading.present());
      }
  })
  }

  async closeLoader() {
  
    this.checkAndCloseLoader();
  
    setTimeout(() => this.checkAndCloseLoader(), 500);
  }

  async checkAndCloseLoader() {
   
   const loader = await this.loadingCtrl.getTop();
   
    if(loader !== undefined) { 
      await this.loadingCtrl.dismiss();
    }
  }

  
}
