import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { UserDTO } from 'src/app/Models/UserDTO';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage {

  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();
  user: UserDTO;
  isAdmin: boolean = false;
  didLoad: boolean = false;
  logged: boolean = false;

  constructor(
    private router: Router,
    private userService: UsersService,
    private loadingCtrl: LoadingController,
    private alertTool: AlertTool
  ) 
  {
    this.user = new UserDTO();
  }

  navigateToAdmin() {
    this.router.navigate(["admin"]);
  }

  ionViewWillEnter(){
    this.makeLoadingAnimation();
    if(localStorage.getItem("Logged") === "true"){
      this.logged = true;
    }
    else {
      this.logged = false;
    }

    if(!this.logged || localStorage.getItem("role") !== "ADMIN") {
      this.router.navigate(["/unauthorized"]);
    }

    this.getData();
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
    }, () => {
      this.closeLoader();
      this.logged = false;
      this.router.navigate(["/unauthorized"]);
      this.alertTool.presentToast("Oops... Ocurrió un error!");
    })
  }

  saveRole(role: number) {
    if(role === 0) {
      localStorage.setItem("role", "CLIENT");
      this.isAdmin = false;
    } else if( role === 1) {
      localStorage.setItem("role", "DELIVERY");
      this.isAdmin = false;
    } else if( role === 2) {
      localStorage.setItem("role", "ADMIN");
      this.isAdmin = true;
    }
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
}
