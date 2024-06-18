import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { CartItem } from 'src/app/Models/CartItem';
import { MenuDTO } from 'src/app/Models/MenuDTO';
import { ResponseObjectList } from 'src/app/Models/Response/ResponseObjList';
import { ResponseObjectModel } from 'src/app/Models/Response/ResponseObjModel';
import { UserDTO } from 'src/app/Models/UserDTO';
import { MenusService } from 'src/app/Services/MenusService/menus.service';
import { UsersService } from 'src/app/Services/UsersService/users.service';
import { AlertTool } from 'src/app/Tools/AlertTool';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  dataResponse: ResponseObjectModel<UserDTO> = new ResponseObjectModel();

  logged: boolean = false;

  item1: CartItem = new CartItem();
  item2: CartItem = new CartItem();
  item3: CartItem = new CartItem();

  item4: CartItem = new CartItem();
  item5: CartItem = new CartItem();
  item6: CartItem = new CartItem();

  item7: CartItem = new CartItem();
  item8: CartItem = new CartItem();
  item9: CartItem = new CartItem();

  item10: CartItem = new CartItem();
  item11: CartItem = new CartItem();
  item12: CartItem = new CartItem();

  item13: CartItem = new CartItem();
  item14: CartItem = new CartItem();
  item15: CartItem = new CartItem();

  carouselItems: CartItem[];
  carouselSets: any[][] = [];
  currentIndex = 0;
  itemsPerSlide = 3;
  daysOfWeek: any[] = [
    { "day": 'Lunes', "class": 'monday'},
    { "day": 'Martes', "class": 'tuesday'},
    { "day": 'Miercoles', "class": 'wednesday'},
    { "day": 'Jueves', "class": 'thursday'},
    { "day": 'Viernes', "class": 'friday'}
  ]
  icon: string = "cart-outline"

  leftHiden: boolean = false;
  rightHiden: boolean = true;

  actualDayNumber = 1;
  actualDayName: any;

  totalUnits: number = 0;

  modalOpened: boolean = false;

  priceStandard: number = 4900;
  priceLight: number = 4500;
  priceProteic: number = 5200;

  isDesktop!: boolean;

  profileImageUrl: any;

  message!: ResponseObjectList<MenuDTO>;

  menus: MenuDTO[];

  standardItems: CartItem[];
  lightItems: CartItem[];
  proteicItems: CartItem[];

  constructor(
    private alertTool: AlertTool,
    private router: Router,
    private platform: Platform, 
    private sanitizer: DomSanitizer, 
    private menuService: MenusService,
    private cdr: ChangeDetectorRef,
    private userService: UsersService,
    private loadingCtrl: LoadingController
    ) {
      this.menus = new Array<MenuDTO>();
      this.standardItems = new Array<CartItem>()
      this.lightItems = new Array<CartItem>()
      this.proteicItems = new Array<CartItem>()
      this.carouselItems = new Array<CartItem>()

      this.initializeApp();
    
      this.actualDayName = this.daysOfWeek[this.currentIndex].day;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.isDesktop = this.platform.is('desktop');
    });
  }

  async instanceItems() {
    try {
      const response = await this.menuService.GetAll().toPromise();
      this.message = response as ResponseObjectList<MenuDTO>;
      this.menus = this.message.model;
  
      await this.formatToCartItems();
      this.initializeCarouselSets();
      this.closeLoader();
    } catch (error) {
      this.closeLoader();
      this.alertTool.presentToast("Oops... Ocurrió un error");
      console.error('Error fetching data:', error);
    }
  }

  ionViewWillEnter(){

    if(localStorage.getItem("Logged") === "true") {
      this.logged = true;
    }
    else {
      this.logged = false;
    }

    this.makeLoadingAnimation();

    if(this.logged) {
      this.userService.GetData().subscribe( response => {
        this.dataResponse = response as ResponseObjectModel<UserDTO>;

        localStorage.setItem("firstName", this.dataResponse.model.firstName);
        localStorage.setItem("lastName", this.dataResponse.model.lastName);

        console.log(this.dataResponse);
      }, error => {
        localStorage.clear();
        this.logged = false;
      })
    }
    this.instanceItems();
  }

  initializeCarouselSets() {
    for (let i = 0; i < this.carouselItems.length; i += this.itemsPerSlide) {
      this.carouselSets.push(this.carouselItems.slice(i, i + this.itemsPerSlide));
    }
  }

  updateCarousel() {
    const carouselContent = document.querySelector('.carousel-content') as HTMLElement;
    const setWidth = 77; // Ancho del set + margen derecho
    const translateX = -this.currentIndex * setWidth;
    carouselContent.style.transform = `translateX(${translateX}vw)`;
    this.actualDayName = this.daysOfWeek[this.currentIndex].day;

    if(this.currentIndex == 0) {
      this.leftHiden = false;
    } else if(this.currentIndex == 4) {
      this.rightHiden = false;
    } else {
      this.leftHiden = true;
      this.rightHiden = true;
    }
  }

  next() {
    if (this.currentIndex < this.carouselSets.length - 1) {
      this.currentIndex++;
      this.actualDayNumber++;
      this.updateCarousel();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.actualDayNumber--;
      this.updateCarousel();
    }
  }

  addToCart(item: CartItem) {
    item.total ++;
    this.totalUnits++;
  }

  removeFromCart(item: CartItem) {
    if(item.total <= 1)
      item.cartPressed = false;

    item.total--;
    this.totalUnits--;
  }

  pressCart(item: CartItem) {
    item.cartPressed = true;
    this.addToCart(item);
  }

  navigateToProfile() {
    this.router.navigate(["/profile"]);
  }

  navigateToLogin() {
    this.router.navigate(["/login"]);
  }

  makeOrder() {
    if(this.totalUnits === 0) {
      this.alertTool.presentToast("No tenes ningún producto en tu carrito");
    } else {
      this.alertTool.presentAlert("Debes iniciar sesión para poder realizar el pedido", "Iniciar sesión", "Viandas del Sur");
    }
  }

  makeImageGuid(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.menuService.Image(id).subscribe(
        (response) => {
          const objectURL = URL.createObjectURL(response);
          resolve(objectURL);
        },
        (error) => {
          reject(null);
        }
      );
    });
  }
  

  async setImageForItem(item: any) {
    try {
      const url = await this.makeImageGuid(item.id);
      const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(url);
      item.image = sanitizedUrl;
    } catch (error) {
      console.log('Error fetching image', error);
      item.image = '';
    }
  }
  

  async formatToCartItems() {
    for (const menu of this.menus) {
      for (const prod of menu.products) {
        const item = new CartItem();
        item.id = prod.id;
        item.day = prod.day;
        item.name = prod.name;

        var hasImage = true;
        if(prod.imageName === "Default")
          hasImage = false;

        item.hasImage = hasImage;
        item.category = menu.category;

        await this.setImageForItem(item);
        if (item.category === 'Estandar') {
          item.price = this.priceStandard;
          this.standardItems.push(item);
        } else if (item.category === 'Light') {
          item.price = this.priceLight;
          this.lightItems.push(item);
        } else if (item.category === 'Proteico') {
          item.price = this.priceProteic;
          this.proteicItems.push(item);
        }
      }
    }
  
    for (let i = 0; i < 5; i++) {
      this.carouselItems.push(this.standardItems[i], this.lightItems[i], this.proteicItems[i]);  
    }
    this.cdr.detectChanges();
  }

  getSanitizedUrl(imageUrl: any) {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
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
