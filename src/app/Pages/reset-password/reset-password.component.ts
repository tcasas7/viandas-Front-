import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  token: string = '';
  showPassword = false;
  showConfirmPassword = false;


  constructor(
    private route: ActivatedRoute,
    private userService: UsersService,
    private alertTool: AlertTool,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.resetForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  submit(): void {
    if (this.resetForm.invalid) {
      this.alertTool.presentToast('Completá todos los campos');
      return;
    }

    const { newPassword, confirmPassword } = this.resetForm.value;

    if (newPassword !== confirmPassword) {
      this.alertTool.presentToast('Las contraseñas no coinciden');
      return;
    }

    this.userService.resetPassword({ token: this.token, newPassword }).subscribe({
      next: () => {
        this.alertTool.presentToast('Contraseña actualizada con éxito');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.alertTool.presentToast('Error al actualizar la contraseña. El enlace puede haber expirado.');
      }
    });
  }



    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }

    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    }

}
