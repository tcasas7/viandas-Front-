import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { LocationDTO } from 'src/app/Models/LocationDTO';
import { ResponseObject } from 'src/app/Models/Response/ResponseObj';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-change-phone-modal',
  templateUrl: './change-phone-modal.component.html',
  styleUrls: ['./change-phone-modal.component.scss'],
})
export class ChangePhoneModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();

  locationData: LocationDTO;
  phoneForm: FormGroup;
  response!: ResponseObject;

  finalPhone: string = '';

  preFix: string = '';
  areaCode: string = '';
  phone: string = '';  

  isValid: boolean = false;
  passwordMatch: boolean = false;

  constructor(
    private loadingCtrl: LoadingController,
    private userService: UsersService,
    private alertTool: AlertTool
  )
  {
    this.locationData = new LocationDTO();

    this.phoneForm = new FormGroup({
      "preFix": new FormControl(this.preFix),
      "areaCode": new FormControl(this.areaCode),
      "phone": new FormControl(this.phone),
    })
  }

  changePhone() {
    this.validateFields();
    if(this.isValid === true) {
      this.finalPhone = '+' + this.phoneForm.get("preFix")?.value + ' ' + this.phoneForm.get("areaCode")?.value + ' ' + this.phoneForm.get("phone")?.value
      this.makeLoadingAnimation();
      this.doRequest();
    } else {
      this.alertTool.presentToast("Campos vacíos");
    }
  }

  doRequest() {
    this.userService.ChangePhone(this.finalPhone).subscribe( response => {
      this.response = response as ResponseObject
      console.log(this.response);
      if(this.response.statusCode === 200) {
        this.closeLoader();
        this.alertTool.presentToast("Teléfono actualizado");
        this.closeModal();
      } else {
        this.closeLoader();
        this.alertTool.presentToast(this.response.message);
      }
    }, error => {
      if(error) {
        this.closeLoader();
        this.alertTool.presentToast("Oops... Ocurrió un error!");  
      }
    })
    this.isValid = false;
    this.finalPhone = '';
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

  closeModal() {
    this.closeModalEvent.emit();
  }

  validateFields() {
    if(((this.phoneForm.get("preFix")?.value !== "") && (this.phoneForm.get("preFix")?.value !== null)) &&
      ((this.phoneForm.get("areaCode")?.value !== "") && (this.phoneForm.get("areaCode")?.value !== null)) &&
      ((this.phoneForm.get("phone")?.value !== "") && (this.phoneForm.get("phone")?.value !== null))){
        this.isValid = true;
    }
  }
}
