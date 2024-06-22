import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { RegisterDTO } from 'src/app/Models/RegisterDTO';
import { ResponseObject } from 'src/app/Models/Response/ResponseObj';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { AuthService } from 'src/app/Services/AuthService/auth.service';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();

  registerData: RegisterDTO;
  registerForm: FormGroup;
  response!: ResponseObject;
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private userService: UsersService,
    private alertTool: AlertTool
  )
  {
    this.registerData = new RegisterDTO();

    this.registerForm = new FormGroup({
      "firstName": new FormControl(this.registerData.firstName),
      "lastName": new FormControl(this.registerData.lastName),
      "phone": new FormControl(this.registerData.phone),
      "email": new FormControl(this.registerData.email),
      "password": new FormControl(this.registerData.password),
      "repeatPassword": new FormControl(this.registerData.password),
    })
  }

  registerUser() {
    if(this.registerForm.get("password")?.value === this.registerForm.get("repeatPassword")?.value) {
      this.registerData.firstName = this.registerForm.get("firstName")?.value
      this.registerData.lastName = this.registerForm.get("lastName")?.value
      this.registerData.phone = this.registerForm.get("phone")?.value
      this.registerData.email = this.registerForm.get("email")?.value
      this.registerData.password = this.registerForm.get("password")?.value
      this.makeLoadingAnimation();
      this.doRequest();
    } else {
      this.alertTool.presentToast("Las contraseñas no coinciden");
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
  }

  navigateToHome() {
    this.router.navigate(["/home"]);
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
    
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}
