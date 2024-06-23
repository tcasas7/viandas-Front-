import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LocationDTO } from 'src/app/Models/LocationDTO';
import { ResponseObject } from 'src/app/Models/Response/ResponseObj';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { UserDTO } from 'src/app/Models/UserDTO';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();
  removeLocationResponse: ResponseObject = new ResponseObject();
  logged: boolean = false;
  didLoad: boolean = false;
  user: UserDTO;

  selectedLocation: LocationDTO = new LocationDTO();

  selectedLocationId: number | null = null;

  isAdmin: boolean = false;
  showAddLocationModal: boolean = false;
  showChangePhoneModal: boolean = false;

  constructor(
    private router: Router,
    private userService: UsersService,
    private loadingCtrl: LoadingController,
    private alertTool: AlertTool
  )
  {
    this.user = new UserDTO();
  }

  ionViewWillEnter() {
    this.makeLoadingAnimation();
    if(localStorage.getItem("Logged") === "true") {
      this.logged = true;
    }
    else {
      this.logged = false;
    }

    if(!this.logged) {
      this.router.navigate(["/unauthorized"]);
    }

    this.getData();
    
  }

  navigateToHome() {
    this.router.navigate(["/home"]);
  }

  navigateToAllOrders() {
    this.router.navigate(["/allorders"]);
  }

  logOut() {
    localStorage.clear();
    this.alertTool.presentToast("Sesión cerrada");
    this.navigateToHome();
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

saveRole(role: number) {
  if(role === 0) {
    localStorage.setItem("role", "CLIENT");
  } else if( role === 1) {
    localStorage.setItem("role", "DELIVERY");
  } else if( role === 2) {
    localStorage.setItem("role", "ADMIN");
    this.isAdmin = true;
  }
}

onAddNewAddress() {
  this.showAddLocationModal = true;
}

navigateToChangePhone() {
  this.showChangePhoneModal = true;
}

handleSelection(event: any) {
  if (event.detail.value === 'add_new') {
    this.onAddNewAddress();
  } else {
    this.selectedLocationId = event.detail.value;
  }
}

removeLocation() {
  this.makeLoadingAnimation();
  if (this.selectedLocationId !== null) {
    const selectedLocation = this.user.locations.find(location => location.dir === "" + this.selectedLocationId);


    this.userService.RemoveLocation(selectedLocation).subscribe( response => {
      this.removeLocationResponse = response as ResponseObject;
      if(this.removeLocationResponse.statusCode === 200) {
        this.alertTool.presentToast("Dirección eliminada");
        this.user.locations = this.user.locations.filter(location => location.dir !== "" + this.selectedLocationId);
        this.selectedLocationId = null;
      } else {
        this.alertTool.presentToast(this.removeLocationResponse.message);
      }
    }, error => {
      this.alertTool.presentToast("Oops... Ocurrió un error");
    })
  }
  this.closeLoader();
}

closeAddLocationModal() {
  this.showAddLocationModal = false;
  this.getData();
}

closeChangePhoneModal() {
  this.showChangePhoneModal = false;
  this.getData();
}

getData() {
  this.userService.GetData().subscribe( response => {
    this.dataResponse = response as ResponseObjectModel<UserDTO>;
    this.user = this.dataResponse.model;
    localStorage.setItem("firstName", this.dataResponse.model.firstName);
    localStorage.setItem("lastName", this.dataResponse.model.lastName);
    
    this.saveRole(this.dataResponse.model.role);

    this.didLoad = true;
    this.closeLoader();
  }, error => {
    this.closeLoader();
    this.router.navigate(["/unauthorized"]);
    this.alertTool.presentToast("Oops... Ocurrió un error!");
  })
}
}
