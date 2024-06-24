import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ResponseObject } from 'src/app/Models/Response/ResponseObj';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { UserDTO } from 'src/app/Models/UserDTO';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage {

  isAdmin: boolean = false;
  user: UserDTO;
  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();

  removeLocationResponse: ResponseObject = new ResponseObject();
  logged: boolean = false;
  didLoad: boolean = false;

  activeModal: number = 0;

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

    if(!this.logged || localStorage.getItem("role") !== "ADMIN"){
      this.router.navigate(["/unauthorized"]);
    }

    this.getData();
    
  }

  navigateToProfile() {
    this.router.navigate(["/profile"])
  }

  navigateToUnauthorized() {
    this.router.navigate(["/unauthorized"])
  }

  activateOrdersModal() {
    this.router.navigate(["admin-orders"])
    this.activeModal = 1;
  }

  activateMenusModal() {
    this.activeModal = 2;
  }

  activateStatsModal() {
    this.router.navigate(["stats"])
    this.activeModal = 3;
  }

  activateRoleModal() {
    this.activeModal = 4;
  }

  activateLocationModal() {
    this.router.navigate(["location"])
    this.activeModal = 5;
  }

  closeModal() {
    this.activeModal = 0;
  }

  navigateToHome() {
    this.router.navigate(["/home"]);
  }

  navigateToAdmin() {
    this.router.navigate(["/admin"]);
  }
  navigateToLocation() {
    this.router.navigate(["/location"]);
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

async getData() {
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
    this.logged = false;
    this.router.navigate(["/unauthorized"]);
    this.alertTool.presentToast("Oops... Ocurrió un error!");
  })
}
}
