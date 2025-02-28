import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
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
  showPassword: boolean = false;

  constructor(
    private loadingCtrl: LoadingController,
    private userService: UsersService,
    private alertTool: AlertTool
  ) {
    this.registerData = new RegisterDTO();

    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      preFix: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{2}$')]), // Prefijo de 2 dígitos
      areaCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{2,4}$')]), 
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{7}$')]), // Número de 7 dígitos
      email: new FormControl('', [Validators.required, Validators.email]), // Email válido
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6) // Ahora es obligatorio que tenga al menos 6 caracteres
      ]),
      repeatPassword: new FormControl('', [Validators.required])
      
    }, { validators: passwordMatchValidator }); // Aplica la validación aquí
  }

  registerUser() {
    if (this.registerForm.invalid) {
      this.alertTool.presentToast("Por favor, completa los campos correctamente.");
      return;
    }

    this.registerData.firstName = this.registerForm.get("firstName")?.value;
    this.registerData.lastName = this.registerForm.get("lastName")?.value;
    this.registerData.phone = '+' + this.registerForm.get("preFix")?.value + ' ' + 
                              this.registerForm.get("areaCode")?.value + ' ' + 
                              this.registerForm.get("phone")?.value;
    this.registerData.email = this.registerForm.get("email")?.value;
    this.registerData.password = this.registerForm.get("password")?.value;

    this.makeLoadingAnimation();
    this.doRequest();
  }

  doRequest() {
    this.userService.Register(this.registerData).subscribe(response => {
      this.response = response as ResponseObject;
      if (this.response.statusCode === 200) {
        this.closeLoader();
        this.alertTool.presentToast("Registrado correctamente.");
        this.closeModal();
      } else {
        this.closeLoader();
        this.alertTool.presentToast(this.response.message);
      }
    }, error => {
      this.closeLoader();
      this.alertTool.presentToast("Oops... Ocurrió un error!");
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
    if(loader !== undefined) { 
      await this.loadingCtrl.dismiss();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  openChangePasswordModal() {
    this.openChangePasswordEvent.emit();
  }

  closeModal() {
    this.closeModalEvent.emit();
  }
}

/** ✅ Función externa para validar que las contraseñas coincidan **/
export const passwordMatchValidator: ValidatorFn = (form: AbstractControl) => {
  const password = form.get('password')?.value;
  const repeatPassword = form.get('repeatPassword')?.value;

  return password === repeatPassword ? null : { mismatch: true };
};
