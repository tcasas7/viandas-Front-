import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ChangePasswordDTO } from 'src/app/Models/ChangePasswordDTO';
import { ResponseObject } from 'src/app/Models/Response/ResponseObj';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() openRegisterEvent = new EventEmitter<void>();

  changePasswordData: ChangePasswordDTO;
  registerForm: FormGroup;
  response!: ResponseObject;
  password: string = '';
  showPassword: boolean = false;

  isValid: boolean = false;
  passwordMatch: boolean = false;

  constructor(
    private loadingCtrl: LoadingController,
    private userService: UsersService,
    private alertTool: AlertTool
  )
  {
    this.changePasswordData = new ChangePasswordDTO();

    this.registerForm = new FormGroup({
      "phone": new FormControl(this.changePasswordData.phone),
      "email": new FormControl(this.changePasswordData.email),
      "password": new FormControl(this.changePasswordData.password),
      "repeatPassword": new FormControl(this.changePasswordData.password),
    })
  }

  registerUser() {
    this.validateFields();
    if(this.isValid === true) {
      if(this.passwordMatch === true) {
        this.changePasswordData.phone = this.registerForm.get("phone")?.value
      this.changePasswordData.email = this.registerForm.get("email")?.value
      this.changePasswordData.password = this.registerForm.get("password")?.value
      this.makeLoadingAnimation();
      this.doRequest();
      } else {
      this.alertTool.presentToast("Las contraseñas no coinciden");
      }
    } else {
      this.alertTool.presentToast("Campos vacíos");
    }
  }

  doRequest() {
    this.userService.ChangePassword(this.changePasswordData).subscribe( response => {
      this.response = response as ResponseObject
      console.log(this.response);
      if(this.response.statusCode === 200) {
        this.closeLoader();
        this.alertTool.presentToast("Contraseña cambiada con éxito");
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
    this.passwordMatch = false;
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
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  openRegisterModal(){
    this.openRegisterEvent.emit();
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  validateFields() {
    if(((this.registerForm.get("phone")?.value !== "") && (this.registerForm.get("phone")?.value !== null)) &&
      ((this.registerForm.get("email")?.value !== "") && (this.registerForm.get("email")?.value !== null)) &&
      ((this.registerForm.get("password")?.value !== "") && (this.registerForm.get("password")?.value !== null))) {
        console.log(this.registerForm.get("phone")?.value);
        console.log(this.registerForm.get("email")?.value);
        console.log(this.registerForm.get("password")?.value);
        this.isValid = true;
      }
    if(this.registerForm.get("password")?.value === this.registerForm.get("repeatPassword")?.value) {
      this.passwordMatch = true;
    }
  }
}
