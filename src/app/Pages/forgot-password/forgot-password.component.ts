import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private userService: UsersService,
    private alertTool: AlertTool
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.alertTool.presentToast('Ingresá un correo válido');
      return;
    }

    console.log(this.form.value);

    const email = this.form.value.email!;
    
    this.userService.forgotPassword(this.form.value.email!).subscribe({
      next: () => {
        this.alertTool.presentToast('Revisá tu correo para continuar el cambio de contraseña');
      },
      error: (err) => {
        console.error(err);
        this.alertTool.presentToast('No se pudo enviar el enlace');
      }
    });
  }
}
