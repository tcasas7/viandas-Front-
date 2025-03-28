import { Component, OnInit } from '@angular/core';
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
export class ProfilePage implements OnInit {

  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();
  removeLocationResponse: ResponseObject = new ResponseObject();
  logged: boolean = false;
  didLoad: boolean = false;
  user: UserDTO;
  isDeliveryRole: boolean = false;
  locations: Array<LocationDTO> = new Array<LocationDTO>();

  selectedLocation: LocationDTO | undefined | null = null;
  

  selectedLocationId: any;

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

  navigateToAdmin() {
    this.router.navigate(["/admin"]);
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
    this.locations.forEach( e => {
      if(e.isDefault) {
         this.selectedLocationId = e.id;
      }
    });
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
    this.selectedLocation = this.locations.find(location => location.id === this.selectedLocationId) || null;

    // Guardar dirección seleccionada en localStorage
    if (this.selectedLocation) {
      localStorage.setItem("selectedLocation", this.selectedLocation.id?.toString() || '');
    }
  }
}

addLocation(newLocation: LocationDTO) {
  // Agregar la nueva dirección a la lista
  this.locations.push(newLocation);

  // Actualizar la dirección seleccionada
  this.selectedLocation = newLocation;
  this.selectedLocationId = newLocation.id;

  // Cerrar el modal
  this.closeAddLocationModal();
}

confirmRemoveLocation(location: LocationDTO) {
  this.selectedLocation = location;
  this.removeLocation();
}

removeLocation() {
  if (this.selectedLocation) {
    this.userService.RemoveLocation(this.selectedLocation).subscribe(response => {
      if (response.statusCode === 200) {
        // Eliminar la dirección de la lista
        this.locations = this.locations.filter(location => location.id !== this.selectedLocation?.id);

        // Limpiar la selección
        this.selectedLocation = null;
        this.selectedLocationId = null;

        this.alertTool.presentToast('Dirección eliminada.');
      } else {
        this.alertTool.presentToast(response.message);
      }
    }, error => {
      this.alertTool.presentToast('Error al eliminar la dirección.');
    });
  }
}

makeDefault() {
  this.makeLoadingAnimation();
  if (this.selectedLocationId !== null) {
    this.selectedLocation = this.user.locations.find(location => location.id === this.selectedLocationId);
    if(this.selectedLocation?.isDefault) {
      this.alertTool.presentToast("Esta ya es tu dirección predeterminada");
      this.closeLoader();
      return;
    }
    this.userService.MakeDefault(this.selectedLocation).subscribe( async response => {
      this.removeLocationResponse = response as ResponseObject;
      if(this.removeLocationResponse.statusCode === 200) {
        this.alertTool.presentToast("Dirección actualizada");
        this.user.locations = this.user.locations.filter(location => location.id === this.selectedLocationId);
        await this.getData();
        
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

async getData() {
  this.userService.GetData().subscribe( response => {
    this.dataResponse = response as ResponseObjectModel<UserDTO>;
    this.user = this.dataResponse.model;
    localStorage.setItem("firstName", this.dataResponse.model.firstName);
    localStorage.setItem("lastName", this.dataResponse.model.lastName);
    this.locations = this.user.locations;

    const storedAddress = localStorage.getItem("selectedLocation");
    
    if (storedAddress) {
      this.selectedLocationId = storedAddress;
      this.selectedLocation = this.locations.find(location => location.id === this.selectedLocationId) || null;
    } else {
      // Si no hay dirección guardada, tomar la predeterminada
      const defaultLocation = this.locations.find(e => e.isDefault);
      if (defaultLocation) {
        this.selectedLocationId = defaultLocation.id;
        this.selectedLocation = defaultLocation;
      }
    }

    this.saveRole(this.dataResponse.model.role);

    this.didLoad = true;
    this.closeLoader();
    this.selectedLocationId = null;
  }, error => {
    this.closeLoader();
    this.router.navigate(["/unauthorized"]);
    this.alertTool.presentToast("Oops... Ocurrió un error!");
  })
}

  navigateToOrders() {
    //this.alertTool.presentToast("Funcionalidad en desarrollo");
    //Implementacion
    this.router.navigate(["/orders"]);
  }


  checkUserRole() {
    this.userService.getUserProfile().subscribe((response: UserDTO) => {
      this.user = response;  // Aquí obtienes los datos del usuario
      this.isDeliveryRole = this.user.role === 1;  // Si el rol es 1, es un repartidor
    });
  }
  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    this.userService.getUserProfile().subscribe((response: any) => {
      //console.log("Perfil del usuario:", response);
      this.user = response.model;  // Aquí debe estar el modelo completo
      //Console.log("¿Es repartidor?", this.user.role === 1);
      this.isDeliveryRole = this.user.role === 1;
  });
  
  }

  viewAssignedAddresses() {
    //console.log('Mostrando direcciones asignadas...');
  }
}
