import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ContactDTO } from 'src/app/Models/ContactDTO';
import { ResponseObject } from './../../Models/Response/ResponseObj';
import { UsersService } from './../../Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-save-payment-info-modal',
  templateUrl: './save-payment-info-modal.component.html',
  styleUrls: ['./save-payment-info-modal.component.scss'],
})
export class SavePaymentInfoModalComponent implements OnChanges {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Input() modalType: number = 0;
  @Input() paymentInfo: ContactDTO = new ContactDTO();

  paymentInfoForm!: FormGroup;

  isValid: boolean = false;

  finalPhone: string = '';

  response: ResponseObject = new ResponseObject();

  constructor(
    private usersService: UsersService,
    private loadingCtrl: LoadingController,
    private alertTool: AlertTool
  ) {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['paymentInfo'] && changes['paymentInfo'].currentValue) {
      this.updateForm(changes['paymentInfo'].currentValue);
    }
  }

  initializeForm() {
    this.paymentInfoForm = new FormGroup({
      preFix: new FormControl(''),
      areaCode: new FormControl(''),
      phone: new FormControl(''),
      cbu: new FormControl(''),
      alias: new FormControl(''),
      name: new FormControl(''),
      wppMessage: new FormControl(''),
      accountName: new FormControl('')
    });
  }

  updateForm(paymentInfo: ContactDTO) {
    this.paymentInfoForm.patchValue({
      cbu: paymentInfo.cbu || '',
      alias: paymentInfo.alias || '',
      name: paymentInfo.name || '',
      wppMessage: paymentInfo.wppMessage || '',
      accountName: paymentInfo.accountName || ''
    });
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
  addPaymentInfo() {
    this.validateFields();
  
    if (!this.isValid) {
      return;
    }
  
    this.makeLoadingAnimation();
  
    // Actualizamos los datos del objeto paymentInfo
    this.paymentInfo.phone = '+' + this.paymentInfoForm.get("preFix")?.value + ' ' +
                             this.paymentInfoForm.get("areaCode")?.value + ' ' +
                             this.paymentInfoForm.get("phone")?.value;
    this.paymentInfo.cbu = this.paymentInfoForm.get("cbu")?.value;
    this.paymentInfo.alias = this.paymentInfoForm.get("alias")?.value;
    this.paymentInfo.name = this.paymentInfoForm.get("name")?.value;
    this.paymentInfo.accountName = this.paymentInfoForm.get("accountName")?.value;
    this.paymentInfo.isActive = false;
  
    // Verificación de los datos antes de enviar
    console.log('Datos a enviar:', this.paymentInfo);
  
    this.usersService.AddContact(this.paymentInfo).subscribe(response => {
      this.response = response as ResponseObject;
      if (this.response.statusCode === 200) {
        this.alertTool.presentToast("Información de pago agregada");
        this.closeModal();
      } else {
        this.alertTool.presentToast("Error al agregar información de pago");
      }
      this.closeLoader();
    }, error => {
      this.alertTool.presentToast("Error al agregar información de pago");
      this.closeLoader();
    });
  }
  
  modifyPaymentInfo() {
    this.validateFields();

    if(this.isValid === false) {
      this.alertTool.presentToast("Campos vacíos");
      return;
    }

    this.makeLoadingAnimation();
    this.finalPhone = '+' + this.paymentInfoForm.get("preFix")?.value + ' ' + this.paymentInfoForm.get("areaCode")?.value + ' ' + this.paymentInfoForm.get("phone")?.value;
    this.paymentInfo.phone = this.finalPhone;
    this.paymentInfo.cbu = this.paymentInfoForm.get("cbu")?.value;
    this.paymentInfo.alias = this.paymentInfoForm.get("alias")?.value;
    this.paymentInfo.name = this.paymentInfoForm.get("name")?.value;
    this.paymentInfo.wppMessage = this.paymentInfoForm.get("wppMessage")?.value;
    this.paymentInfo.accountName = this.paymentInfoForm.get("accountName")?.value;

    this.usersService.UpdateContact(this.paymentInfo).subscribe(response => {
      this.response = response as ResponseObject;
      if (this.response.statusCode === 200) {
        this.alertTool.presentToast("Información de pago modificada");
        this.closeModal();
        this.closeLoader();
      } else {
        this.alertTool.presentToast(this.response.message);
        this.closeLoader();
      }
      this.closeLoader();
    }, error => {
      this.alertTool.presentToast(this.response.message);
      this.closeLoader();
    });
  }

  makeLoadingAnimation() {
    this.loadingCtrl.getTop().then(hasLoading => {
      if (!hasLoading) {
        this.loadingCtrl.create({
          spinner: 'circular',
          cssClass: "custom-loading"
        }).then(loading => loading.present());
      }
    });
  }

  async closeLoader() {
    this.checkAndCloseLoader();
    setTimeout(() => this.checkAndCloseLoader(), 500);
  }

  async checkAndCloseLoader() {
    const loader = await this.loadingCtrl.getTop();
    if (loader !== undefined) {
      await this.loadingCtrl.dismiss();
    }
  }

  validateFields() {
    if(((this.paymentInfoForm.get("preFix")?.value !== "") && (this.paymentInfoForm.get("preFix")?.value !== null)) &&
      ((this.paymentInfoForm.get("areaCode")?.value !== "") && (this.paymentInfoForm.get("areaCode")?.value !== null)) &&
      ((this.paymentInfoForm.get("phone")?.value !== "") && (this.paymentInfoForm.get("phone")?.value !== null))){
        this.isValid = true;
    }
  }
}
