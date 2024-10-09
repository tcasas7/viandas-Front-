import { Component } from '@angular/core';
import { AddMenusDTO } from 'src/app/Models/AddMenusDTO';
import { MenuDTO } from 'src/app/Models/MenuDTO';
import { ProductDTO } from 'src/app/Models/ProductDTO';
import { MenusService } from 'src/app/Services/MenusService/menus.service';
import { AlertTool } from 'src/app/Tools/AlertTool';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.page.html',
  styleUrls: ['./add-menu.page.scss'],
})


export class AddMenuPage {

  constructor(
    private menusService: MenusService,
    private alertTool: AlertTool,
    private loadingCtrl: LoadingController,
    private router: Router
    
  ) {
    // Cargar menús al iniciar
    this.loadMenusFromBackend();
  }

navigateToAddImages() {
this.router.navigate(['/add-images']);
}
navigateToAdmin() {
this.router.navigate(['/admin']);
}

  // Menús y productos
  standardMenu: MenuDTO = new MenuDTO();
  lightMenu: MenuDTO = new MenuDTO();
  proteicMenu: MenuDTO = new MenuDTO();

  standardProducts: ProductDTO[] = [];
  lightProducts: ProductDTO[] = [];
  proteicProducts: ProductDTO[] = [];

  // Precios
  standardPrice: number = 0;
  lightPrice: number = 0;
  proteicPrice: number = 0;

  // Control de visualización (collapse)
  standardIsCollapsed: boolean = true;
  lightIsCollapsed: boolean = true;
  proteicIsCollapsed: boolean = true;

  // Payload a enviar
  toSendPayload: AddMenusDTO = new AddMenusDTO();

  
  // Cargar menús y productos desde el backend
  loadMenusFromBackend() {
    this.menusService.GetAll().subscribe(response => {
      const loadedMenus: MenuDTO[] = response.model;  // Tipar explícitamente como 'MenuDTO[]'
  
      // Asignar menús
      this.standardMenu = loadedMenus.find((menu: MenuDTO) => menu.category === 'Estandar') || new MenuDTO();
      this.lightMenu = loadedMenus.find((menu: MenuDTO) => menu.category === 'Light') || new MenuDTO();
      this.proteicMenu = loadedMenus.find((menu: MenuDTO) => menu.category === 'Proteico') || new MenuDTO();
  
      // Asignar productos
      this.standardProducts = this.standardMenu.products || [];
      this.lightProducts = this.lightMenu.products || [];
      this.proteicProducts = this.proteicMenu.products || [];
  
      // Asignar precios
      this.standardPrice = this.standardMenu.price || 0;
      this.lightPrice = this.lightMenu.price || 0;
      this.proteicPrice = this.proteicMenu.price || 0;
  
    }, error => {
      console.error("Error al cargar menús:", error);
    });
  }

  
  // Expandir/colapsar los menús
  collapseStandard() { this.standardIsCollapsed = true; }
  uncollapseStandard() { this.standardIsCollapsed = false; }

  collapseLight() { this.lightIsCollapsed = true; }
  uncollapseLight() { this.lightIsCollapsed = false; }

  collapseProteic() { this.proteicIsCollapsed = true; }
  uncollapseProteic() { this.proteicIsCollapsed = false; }

  // Formatear y enviar los menús al backend
  sendMenus() {
    this.formatMenus();

    this.menusService.AddMenus(this.toSendPayload).subscribe(response => {
      if (response.statusCode === 200) {
        this.alertTool.presentToast('Menús actualizados correctamente');
      } else {
        this.alertTool.presentToast('Error al actualizar los menús');
      }
    }, error => {
      console.error("Error al enviar menús:", error);
      this.alertTool.presentToast('Error al enviar los menús');
    });
  }

  // Formatear el payload para enviarlo al backend
  formatMenus() {
    this.standardMenu.products = this.standardProducts;
    this.standardMenu.price = this.standardPrice;
    this.lightMenu.products = this.lightProducts;
    this.lightMenu.price = this.lightPrice;
    this.proteicMenu.products = this.proteicProducts;
    this.proteicMenu.price = this.proteicPrice;

    this.toSendPayload.Menus = [this.standardMenu, this.lightMenu, this.proteicMenu];
  }
}






















/*import { HttpHeaders } from '@angular/common/http';
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

  standardPrice: number = 0;
  lightPrice: number = 0;
  proteicPrice: number = 0;
  http: any;
  baseRoute: string | undefined;

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

    this.startArray(this.standardProducts, this.standardMenu ? this.standardMenu.products : []);
    this.startArray(this.lightProducts, this.lightMenu ? this.lightMenu.products : []);
    this.startArray(this.proteicProducts, this.proteicMenu ? this.proteicMenu.products : []);
    

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

    console.log('Payload being sent:', JSON.stringify(this.toSendPayload, null, 2)); // Log del payload

    if(this.isValid) {
        this.menusService.AddMenus(this.toSendPayload).subscribe(response => {
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
        });
    }

    this.toSendPayload = new AddMenusDTO();
    this.toSendPayload.Menus = new Array<MenuDTO>();
}


AddMenus(model: AddMenusDTO) {
  let token = localStorage.getItem("Token");

  const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
  });

  return this.http.post(this.baseRoute + "menus/add", model, {headers});
}

  
    formatMenus() {
      this.standardMenu.products = this.standardProducts;
      this.lightMenu.products = this.lightProducts;
      this.proteicMenu.products = this.proteicProducts;
  
      this.standardMenu.price = this.standardPrice || 0;
      this.lightMenu.price = this.lightPrice || 0;
      this.proteicMenu.price = this.proteicPrice || 0;
  
      // Validar que los productos tienen los nombres y IDs correctos antes de enviarlos
      this.toSendPayload.Menus.push(this.standardMenu);
      this.toSendPayload.Menus.push(this.lightMenu);
      this.toSendPayload.Menus.push(this.proteicMenu);
  
      this.toSendPayload.Menus.forEach(menu => {
          menu.products.forEach(product => {
              if (!product.id) {
                  console.error('Error: Producto sin ID o nombre:', product);
              } else {
                  console.log('Producto con ID listo para enviar:', product);
              }
          });
      });
  
      console.log('Payload preparado para enviar:', this.toSendPayload);
  }
  
  mapToArray(array: Array<ProductDTO>) {
    array.forEach(element => {
      this.addProduct(array, element);
    });
  }

  addProduct(array: Array<ProductDTO>, product: ProductDTO) {
    // Si el producto ya tiene un ID, lo mantenemos
    if (product.id) {
        array[product.day - 1].id = product.id;
    } else {
        console.error('Producto sin ID, no se sobrescribe:', product);
    }

    // Actualizamos el nombre del producto
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

  startArray(array: Array<ProductDTO>, existingProducts: Array<ProductDTO>) {
    for (let i = 0; i < 5; i++) {
        if (existingProducts && existingProducts[i]) {
            // Reutiliza los productos existentes con sus ID
            console.log('Producto existente cargado:', existingProducts[i]);
            array.push(existingProducts[i]);
        } else {
            // Solo crea nuevos productos si no hay productos existentes
            let product = new ProductDTO();
            product.day = i + 1;
            product.name = "";
            array.push(product);
        }
    }

    console.log('Array después de startArray():', array);  // Verifica que los ID se mantengan
}

loadMenusFromBackend() {
  this.menusService.GetAll().subscribe(response => {
      const loadedMenus = response.model;

      this.standardMenu = loadedMenus.find(menu => menu.category === "Estandar")|| new MenuDTO();
      this.lightMenu = loadedMenus.find(menu => menu.category === "Light")|| new MenuDTO();
      this.proteicMenu = loadedMenus.find(menu => menu.category === "Proteico")|| new MenuDTO();

      // Verificar si los productos cargados tienen los IDs correctos
      console.log('Productos del menú Estandar:', this.standardMenu ? this.standardMenu.products : []);
      console.log('Productos del menú Light:', this.lightMenu ? this.lightMenu.products : []);
      console.log('Productos del menú Proteico:', this.proteicMenu ? this.proteicMenu.products : []);

      // Asigna los productos cargados a los arrays correspondientes
      this.startArray(this.standardProducts, this.standardMenu ? this.standardMenu.products : []);
      this.startArray(this.lightProducts, this.lightMenu ? this.lightMenu.products : []);
      this.startArray(this.proteicProducts, this.proteicMenu ? this.proteicMenu.products : []);

      this.closeLoader();
  }, error => {
      console.error("Error cargando menús:", error);
      this.closeLoader();
  });
}

  addNewProduct(menuCategory: string) {
    let newProduct = new ProductDTO();
    newProduct.name = "Nuevo Producto";  // Nombre predeterminado
    newProduct.day = this.getNextAvailableDay(menuCategory);  // Asigna el próximo día disponible

    if (menuCategory === 'Estandar') {
        this.standardProducts.push(newProduct);
    } else if (menuCategory === 'Light') {
        this.lightProducts.push(newProduct);
    } else if (menuCategory === 'Proteico') {
        this.proteicProducts.push(newProduct);
    }
  }
  getNextAvailableDay(_menuCategory: string): import("../../Models/Enums/DayOfWeekEnums").DayOfWeek {
    throw new Error('Method not implemented.');
  }
  
}*/




/*sendMenus() {
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
  }*/