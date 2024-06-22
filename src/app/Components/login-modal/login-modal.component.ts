import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LoginDTO } from 'src/app/Models/LoginDTO';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { AuthService } from 'src/app/Services/AuthService/auth.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() openRegisterModalEvent = new EventEmitter<void>();
  @Output() openChangePasswordModalEvent = new EventEmitter<void>();

  loginData: LoginDTO;
  loginForm: FormGroup;
  response!: ResponseObjectModel<string>;
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertTool: AlertTool
  )
  {
    this.loginData = new LoginDTO();

    this.loginForm = new FormGroup({
      "email": new FormControl(this.loginData.email),
      "password": new FormControl(this.loginData.password)
    })
  }

  loginUser() {
    this.loginData.email = this.loginForm.get("email")?.value
    this.loginData.password = this.loginForm.get("password")?.value
    this.makeLoadingAnimation();
    this.doRequest();
  }

  doRequest() {
    this.authService.loginUser(this.loginData).subscribe( response => {
      this.response = response as ResponseObjectModel<string>
      console.log(this.response);
      if(this.response.statusCode === 200) {
        localStorage.setItem("Logged", "true");
        localStorage.setItem("Token", this.response.model);
        this.closeLoader();
        this.alertTool.presentToast("Sesión iniciada");
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
    this.openRegisterModalEvent.emit();
  }

  openChangePasswordModal(){
    this.openChangePasswordModalEvent.emit();
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}
