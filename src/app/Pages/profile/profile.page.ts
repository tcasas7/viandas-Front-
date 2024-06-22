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

  selectedLocationId: number | null = null;

  isAdmin: boolean = false;
  showAddLocationModal: boolean = false;

  locations: Array<LocationDTO>
  loc1: LocationDTO;
  loc2: LocationDTO;
  loc3: LocationDTO;

  constructor(
    private router: Router,
    private userService: UsersService,
    private loadingCtrl: LoadingController,
    private alertTool: AlertTool
  )
  {
    this.loc1 = new LocationDTO();
    this.loc2 = new LocationDTO();
    this.loc3 = new LocationDTO();

    this.locations = new Array<LocationDTO>();

    this.loc1.Id = 1;
    this.loc2.Id = 2;
    this.loc3.Id = 3;

    this.loc1.dir = "José Hernández, 720";
    this.loc2.dir = "Mendez Funes de Millán, 967";
    this.loc3.dir = "San Martín, 2734";

    this.locations.push(this.loc1, this.loc2, this.loc3)
    console.log(this.locations)
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

    this.userService.GetData().subscribe( response => {
      this.dataResponse = response as ResponseObjectModel<UserDTO>;
      this.user = this.dataResponse.model;
      localStorage.setItem("firstName", this.dataResponse.model.firstName);
      localStorage.setItem("lastName", this.dataResponse.model.lastName);
      
      this.saveRole(this.dataResponse.model.role);

      this.user.locations.push(this.loc1, this.loc2, this.loc3);

      console.log(this.dataResponse.model);
      this.didLoad = true;
      this.closeLoader();
    }, error => {
      this.closeLoader();
      this.router.navigate(["/unauthorized"]);
      this.alertTool.presentToast("Oops... Ocurrió un error!");
      console.log(error.message);
    })
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

handleSelection(event: any) {
  if (event.detail.value === 'add_new') {
    this.onAddNewAddress();
  } else {
    const selectedLocation = this.locations.find(loc => loc.Id === event.detail.value);
    console.log('Dirección seleccionada:', selectedLocation);
  }
}

removeLocation() {
  this.makeLoadingAnimation();
  if (this.selectedLocationId !== null) {
    const selectedLocation = this.locations.find(location => location.Id === this.selectedLocationId);

    this.userService.RemoveLocation(selectedLocation).subscribe( response => {
      this.removeLocationResponse = response as ResponseObject;
      if(this.removeLocationResponse.statusCode === 200) {
        this.alertTool.presentToast("Dirección eliminada");
        this.locations = this.locations.filter(location => location.Id !== this.selectedLocationId);
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
}
