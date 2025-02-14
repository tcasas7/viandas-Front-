import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { LocationDTO } from 'src/app/Models/LocationDTO';
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

  isWeb: boolean = false;
  direcciones: string[] = [];

  activeModal: number = 0;
  locations: LocationDTO[] = [];

  constructor(
    private router: Router,
    private userService: UsersService,
    private loadingCtrl: LoadingController,
    private alertTool: AlertTool,
    private platform: Platform
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
    this.checkPlatform();

    this.getData();
  }

  navigateToProfile() {
    this.router.navigate(["profile"]);
  }

  navigateToUnauthorized() {
    this.router.navigate(["unauthorized"]);
  }

  activateOrdersModal() {
    
    this.router.navigate(["admin-orders"]);
    this.activeModal = 1;
  }

  activateMenusModal() {
    this.router.navigate(["add-menu"]);
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
    if (this.locations.length > 0) {
      this.activeModal = 5;
    } else {
      this.alertTool.presentToast("No hay direcciones para mostrar.");
    }
  }
  loadDirecciones() {
    // Simulación de carga de direcciones (puede reemplazarse con una llamada a la API)
    this.direcciones = [
      'Jose Hernandez, 720, Mar del Plata, Buenos Aires, Argentina',
      'Almirante Brown, 9153, Mar del Plata, Buenos Aires, Argentina'
    ];
  }

  activatePaymentInfoModal() {
   
    this.router.navigate(["admin-payment-info"])
    this.activeModal = 6;
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
    this.isAdmin = false;
  } else if( role === 1) {
    localStorage.setItem("role", "DELIVERY");
    this.isAdmin = false;
  } else if( role === 2) {
    localStorage.setItem("role", "ADMIN");
    this.isAdmin = true;
  }
}

async getData() {
  this.userService.GetData().subscribe(response => {
    this.dataResponse = response as ResponseObjectModel<UserDTO>;
    this.user = this.dataResponse.model;
    
    // Almacenar nombre y apellido en localStorage
    localStorage.setItem("firstName", this.dataResponse.model.firstName);
    localStorage.setItem("lastName", this.dataResponse.model.lastName);
    
    // Guardar las direcciones obtenidas
    this.locations = this.user.locations; // <-- Asegúrate de tener esta variable definida en tu componente

    // Guardar el rol del usuario
    this.saveRole(this.dataResponse.model.role);

    // Marcar la carga como completa y cerrar el loader
    this.didLoad = true;
    this.closeLoader();
  }, error => {
    // Manejar el error
    this.closeLoader();
    this.logged = false;
    this.router.navigate(["/unauthorized"]);
    this.alertTool.presentToast("Oops... Ocurrió un error!");
  });
}

  checkPlatform() {
    if(this.platform.is("desktop")) {
      this.isWeb = true;
    }else {
      this.isWeb = false;
    }
  }

}