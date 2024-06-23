import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ChangeRoleDTO } from 'src/app/Models/ChangeRoleDTO';
import { ResponseObject } from 'src/app/Models/Response/ResponseObj';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss'],
})
export class RoleModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();

  data: ChangeRoleDTO;
  roleForm: FormGroup;
  response!: ResponseObject;

  finalPhone: string = '';

  email: string = '';
  role: number = 0;

  isValid: boolean = false;
  passwordMatch: boolean = false;

  constructor(
    private loadingCtrl: LoadingController,
    private userService: UsersService,
    private alertTool: AlertTool
  )
  {
    this.data = new ChangeRoleDTO();

    this.roleForm = new FormGroup({
      "email": new FormControl(this.email),
      "role": new FormControl(this.role)
    })
  }

  changeRole() {
    this.validateFields();
    if(this.isValid === true) {
      
      this.data.email = this.roleForm.get("email")?.value;
      this.data.Role = this.roleForm.get("role")?.value;
      console.log(this.data);
      this.makeLoadingAnimation();
      this.doRequest();
    } else {
      this.alertTool.presentToast("Campos vacíos");
    }
  }

  doRequest() {
    this.userService.ChangeRole(this.data).subscribe( response => {
      this.response = response as ResponseObject
      console.log(this.response);
      if(this.response.statusCode === 200) {
        this.closeLoader();
        this.alertTool.presentToast("Rol otorgado");
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
    if(((this.roleForm.get("email")?.value !== "") && (this.roleForm.get("email")?.value !== null)) &&
      ((this.roleForm.get("role")?.value !== "") && (this.roleForm.get("role")?.value !== null))){
        this.isValid = true;
    }
  }
}
