import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { RegisterDTO } from 'src/app/Models/RegisterDTO';
import { ResponseObject } from 'src/app/Models/Response/ResponseObj';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() openChangePasswordEvent = new EventEmitter<void>();

  registerData: RegisterDTO;
  registerForm: FormGroup;
  response!: ResponseObject;
  password: string = '';
  showPassword: boolean = false;
  isValid: boolean = false;
  passwordMatch: boolean = false;

  preFix: string = '';
  areaCode: string = '';
  phone: string = '';  

  constructor(
    private loadingCtrl: LoadingController,
    private userService: UsersService,
    private alertTool: AlertTool
  )
  {
    this.registerData = new RegisterDTO();

    this.registerForm = new FormGroup({
      "firstName": new FormControl(this.registerData.firstName),
      "lastName": new FormControl(this.registerData.lastName),
      "preFix": new FormControl(this.preFix),
      "areaCode": new FormControl(this.areaCode),
      "phone": new FormControl(this.phone),
      "email": new FormControl(this.registerData.email),
      "password": new FormControl(this.registerData.password),
      "repeatPassword": new FormControl(this.registerData.password),
    })
  }

  registerUser() {
    this.validateFields();
    if(this.isValid) {
      if(this.passwordMatch) {
        this.registerData.firstName = this.registerForm.get("firstName")?.value
        this.registerData.lastName = this.registerForm.get("lastName")?.value
        this.registerData.phone = '+' + this.registerForm.get("preFix")?.value + ' ' + this.registerForm.get("areaCode")?.value + ' ' + this.registerForm.get("phone")?.value
        this.registerData.email = this.registerForm.get("email")?.value
        this.registerData.password = this.registerForm.get("password")?.value
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
    this.userService.Register(this.registerData).subscribe( response => {
      this.response = response as ResponseObject
      console.log(this.response);
      if(this.response.statusCode === 200) {
        this.closeLoader();
        this.alertTool.presentToast("Registrado correctamente");
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

  openChangePasswordModal(){
    this.openChangePasswordEvent.emit();
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  validateFields() {
    if(((this.registerForm.get("firstName")?.value !== "") && (this.registerForm.get("firstName")?.value !== null)) &&
      ((this.registerForm.get("lastName")?.value !== "") && (this.registerForm.get("lastName")?.value !== null)) &&
      ((this.registerForm.get("preFix")?.value !== "") && (this.registerForm.get("preFix")?.value !== null)) &&
      ((this.registerForm.get("areaCode")?.value !== "") && (this.registerForm.get("areaCode")?.value !== null)) &&
      ((this.registerForm.get("phone")?.value !== "") && (this.registerForm.get("phone")?.value !== null)) &&
      ((this.registerForm.get("password")?.value !== "") && (this.registerForm.get("password")?.value !== null)) &&
      ((this.registerForm.get("email")?.value !== "") && (this.registerForm.get("email")?.value !== null))) {
        this.isValid = true;
      }
    if(this.registerForm.get("password")?.value === this.registerForm.get("repeatPassword")?.value) {
      this.passwordMatch = true;
    }
  }
}
