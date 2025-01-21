import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ChangePasswordDTO } from 'src/app/Models/ChangePasswordDTO';
import { LocationDTO } from 'src/app/Models/LocationDTO';
import { ResponseObject } from 'src/app/Models/Response/ResponseObj';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-add-location-modal',
  templateUrl: './add-location-modal.component.html',
  styleUrls: ['./add-location-modal.component.scss'],
})
export class AddLocationModalComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() openRegisterEvent = new EventEmitter<void>();

  locationData: LocationDTO;
  locationForm: FormGroup;
  response!: ResponseObject;
  password: string = '';
  showPassword: boolean = false;

  street: string = '';
  number: string = '';

  isValid: boolean = false;
  passwordMatch: boolean = false;

  constructor(
    private loadingCtrl: LoadingController,
    private userService: UsersService,
    private alertTool: AlertTool
  )
  {
    this.locationData = new LocationDTO();

    this.locationForm = new FormGroup({
      "street": new FormControl(this.street),
      "number": new FormControl(this.number)
    })
  }

  registerUser() {
    this.validateFields();
    if (this.isValid) {
      const street = this.locationForm.get("street")?.value.trim();
      const number = this.locationForm.get("number")?.value.trim();
  
      // Agregar contexto a la dirección
      this.locationData.dir = `${street} ${number}, Mar del Plata, General Pueyrredon, Argentina`;
  
      // Eliminar el ID si no es necesario
      delete this.locationData.id;
  
      this.makeLoadingAnimation();
      this.doRequest();
    } else {
      this.alertTool.presentToast("Campos vacíos");
    }
  }
  
  
  doRequest() {
    this.userService.AddLocation(this.locationData).subscribe( response => {
      this.response = response as ResponseObject
      console.log(this.response);
      if(this.response.statusCode === 200) {
        this.closeLoader();
        this.alertTool.presentToast("Dirección añadida");
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
    if(((this.locationForm.get("street")?.value !== "") && (this.locationForm.get("street")?.value !== null)) && 
      ((this.locationForm.get("number")?.value !== "") && (this.locationForm.get("number")?.value !== null))){
        this.isValid = true;
      }
  }
}
