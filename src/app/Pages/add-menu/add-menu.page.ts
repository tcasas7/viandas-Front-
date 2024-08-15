import { MenuDTO } from './../../Models/MenuDTO';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AddMenusDTO } from 'src/app/Models/AddMenusDTO';
import { ProductDTO } from 'src/app/Models/ProductDTO';
import { ResponseObject } from 'src/app/Models/Response/ResponseObj';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { UserDTO } from 'src/app/Models/UserDTO';
import { MenusService } from 'src/app/Services/MenusService/menus.service';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.page.html',
  styleUrls: ['./add-menu.page.scss'],
})
export class AddMenuPage {

  isAdmin: boolean = false;
  user: UserDTO;
  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();
  addResponse: ResponseObject = new ResponseObject();

  isValid: boolean = false;

  logged: boolean = false;
  didLoad: boolean = false;

  standardIsCollapsed: boolean = true;
  lightIsCollapsed: boolean = true;
  proteicIsCollapsed: boolean = true;

  toSendPayload: AddMenusDTO = new AddMenusDTO();

  standardMenu: MenuDTO = new MenuDTO();
  lightMenu: MenuDTO = new MenuDTO();
  proteicMenu: MenuDTO = new MenuDTO();

  standardProducts: Array<ProductDTO> = Array<ProductDTO>();
  lightProducts: Array<ProductDTO> = Array<ProductDTO>();
  proteicProducts: Array<ProductDTO> = Array<ProductDTO>();

  standardPrice: number = 4900;
  lightPrice: number = 4500;
  proteicPrice: number = 5200;

  constructor
  (
    private loadingCtrl: LoadingController,
    private router: Router,
    private userService: UsersService,
    private alertTool: AlertTool,
    private menusService: MenusService
  )
  {

    this.standardMenu.category = "Estandar";
    this.lightMenu.category = "Light";
    this.proteicMenu.category = "Proteico";

    this.startArray(this.standardProducts);
    this.startArray(this.lightProducts);
    this.startArray(this.proteicProducts);

    this.toSendPayload.Menus = new Array<MenuDTO>();

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

  navigateToAdmin() {
    this.router.navigate(["/admin"]);
  }

  navigateToAddImages() {
    this.router.navigate(["/add-images"]);
  }

  collapseStandard() {
    this.standardIsCollapsed = true;
  }
  collapseLight() {
    this.lightIsCollapsed = true;
  }
  collapseProteic() {
    this.proteicIsCollapsed = true;
  }

  uncollapseStandard() {
    this.standardIsCollapsed = false;
  }
  uncollapseLight() {
    this.lightIsCollapsed = false;
  }
  uncollapseProteic() {
    this.proteicIsCollapsed = false;
  }

  sendMenus() {
    this.makeLoadingAnimation();
    this.formatMenus();

    if(this.isValid) {
      this.menusService.AddMenus(this.toSendPayload).subscribe( response => {
        this.addResponse = response as ResponseObject;

        if(this.addResponse.statusCode === 200) {
          this.alertTool.presentToast("Menús añadidos exitosamente!");         
        } else {
          this.alertTool.presentToast("Oops... Ocurrió un error!");
        } 
        this.closeLoader();
      }, error => {
        this.alertTool.presentToast("Oops... Ocurrió un error!");
        this.closeLoader();
      })
    }
    this.toSendPayload = new AddMenusDTO();
    this.toSendPayload.Menus = new Array<MenuDTO>();
  }

  formatMenus() {
    this.standardMenu.products = this.standardProducts;
    this.lightMenu.products = this.lightProducts;
    this.proteicMenu.products = this.proteicProducts;

    this.standardMenu.price = this.standardPrice;
    this.lightMenu.price = this.lightPrice;
    this.proteicMenu.price = this.proteicPrice;

    this.mapToArray(this.standardProducts);
    this.mapToArray(this.lightProducts);
    this.mapToArray(this.proteicProducts);

    this.toSendPayload.Menus.push(this.standardMenu);
    this.toSendPayload.Menus.push(this.lightMenu);
    this.toSendPayload.Menus.push(this.proteicMenu);
    
    this.checkValidation(this.standardMenu);
    if(this.isValid)
      this.checkValidation(this.lightMenu);
    if(this.isValid)
      this.checkValidation(this.proteicMenu);
  }

  mapToArray(array: Array<ProductDTO>) {
    array.forEach(element => {
      this.addProduct(array, element);
    });
  }

  addProduct(array: Array<ProductDTO>, product: ProductDTO) {
    array[product.day - 1].id = 0;
    array[product.day - 1].name = product.name;
  }

  checkValidation(menu: MenuDTO) {

    var validated = true;

    if(menu.price === 0 || menu.price === null || menu.price === undefined) {
      this.alertTool.presentToast("Precio invalido en " + menu.category);
      validated = false;
      return;
    }
      
    menu.products.forEach(element => {
      if(element.name === '' || element.name === null) {
        validated = false;
        this.alertTool.presentToast("Campos vacios en menú " + menu.category);
        this.closeLoader();
        return;
      }
    });
    this.isValid = validated;
  }

  startArray(array: Array<ProductDTO>) {
    for(let i = 0; i < 5; i++) {
      let product = new ProductDTO();
      product.day = i + 1;
      product.name = "";
      array.push(product);
    }
  }
  
}